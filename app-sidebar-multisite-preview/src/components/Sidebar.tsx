import React, { useEffect, useState } from "react";
import { PlainClientAPI } from "contentful-management";
import {
  Button,
  Note,
  Stack,
  ValidationMessage,
} from "@contentful/f36-components";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { ExternalLinkIcon } from "@contentful/f36-icons";
import { AppInstallationParameters, ConfigPreviewItem } from "./ConfigScreen";
import { SortByLabel } from "../utils/sort-by";
import { BuildPreviewUrl } from "../utils/build-preview-url";
import { GetBracesVar } from "../utils/get-braces-var";

interface SidebarProps {
  sdk: SidebarExtensionSDK;
  cma: PlainClientAPI;
}

const Sidebar = (props: SidebarProps) => {
  const siteFielIdDefault: string = "site";
  const slugFielIdDefault: string = "slug";
  const appEnvironmentUri =
    props.sdk.ids.environment !== "master"
      ? `/environments/${props.sdk.ids.environment}`
      : "";
  const appSetupUri = `https://app.contentful.com/spaces/${props.sdk.ids.space}${appEnvironmentUri}/apps/${props.sdk.ids.app}`;
  const { contentTypePage, fieldSite, items, fieldSlug } = props?.sdk
    ?.parameters?.installation as AppInstallationParameters;

  const [siteSelected, setSiteSelected] = useState<string | undefined>(
    props?.sdk?.entry?.fields[fieldSite ?? siteFielIdDefault]?.getValue()
  );
  const [slugPgPage, setSlugPgPage] = useState<string | undefined>(
    props?.sdk?.entry?.fields[fieldSlug ?? slugFielIdDefault]?.getValue()
  );
  let detachSiteChangeHandler: Function | null = null;
  let detachSlugChangeHandler: Function | null = null;

  useEffect(() => {

    const siteChangeHandler = (value: string) => {
      props.sdk.window.startAutoResizer();
      setSiteSelected(value);
    };

    const slugChangeHandler = (value: string) => {
      props.sdk.window.startAutoResizer();
      setSlugPgPage(value);
    };

    detachSiteChangeHandler =
      // eslint-disable-next-line react-hooks/exhaustive-deps
      props.sdk.entry?.fields[
        (props.sdk.parameters.installation as AppInstallationParameters)
          ?.fieldSite ?? siteFielIdDefault
      ].onValueChanged(siteChangeHandler);
    detachSlugChangeHandler =
      // eslint-disable-next-line react-hooks/exhaustive-deps
      props.sdk.entry?.fields[
        (props.sdk.parameters.installation as AppInstallationParameters)
          ?.fieldSlug ?? slugFielIdDefault
      ].onValueChanged(slugChangeHandler);

    return () => {
      if (detachSiteChangeHandler) detachSiteChangeHandler();
      if (detachSlugChangeHandler) detachSlugChangeHandler();
    };
  }, []);

  if (
    !contentTypePage ||
    !fieldSite ||
    !fieldSlug ||
    !items ||
    (items && items.length === 0)
  ) {
    return (
      <>
        <ValidationMessage style={{ marginTop: "0.5rem" }}>
          Please complete the app setup{" "}
          <a href={appSetupUri} target="_blank" rel="noreferrer">
            <strong>here</strong>
          </a>
          .
        </ValidationMessage>
      </>
    );
  }
  if (!siteSelected || !slugPgPage) {
    return (
      <>
        <ValidationMessage style={{ marginTop: "0.5rem" }}>
          Please select a site and write the slug.
        </ValidationMessage>
      </>
    );
  }

  const itemsFiltered: Array<ConfigPreviewItem> = items
    ?.filter((item: ConfigPreviewItem) => item.site === siteSelected)
    ?.sort(SortByLabel);

  return (
    <Stack flexDirection="column">
      {itemsFiltered && itemsFiltered.length === 0 && (
        <>
          <Note variant="warning">
            Please add previews to this site{" "}
            <a href={appSetupUri} target="_blank" rel="noreferrer">
              <strong>here</strong>
            </a>
            .
          </Note>
        </>
      )}
      {itemsFiltered &&
        itemsFiltered.length > 0 &&
        itemsFiltered?.map((item: ConfigPreviewItem, index: number) => {
          const urlFieldId: string = GetBracesVar(item?.url) as string;
          const previewLink = BuildPreviewUrl(
            item?.url,
            slugPgPage,
            urlFieldId
          );
          return (
            <Button
              key={index}
              as="a"
              startIcon={<ExternalLinkIcon />}
              target="_blank"
              isFullWidth
              href={previewLink}
            >
              {item.label}
            </Button>
          );
        })}
    </Stack>
  );
};

export default Sidebar;
