import React, { useEffect } from "react";
import { PlainClientAPI } from "contentful-management";
import { Button, Stack, ValidationMessage } from "@contentful/f36-components";
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
  useEffect(() => {
    props.sdk.window.startAutoResizer();
  }, [props.sdk.window]);

  const appEnvironmentUri =
    props.sdk.ids.environment !== "master"
      ? `/environments/${props.sdk.ids.environment}`
      : "";
  const appSetupUri = `https://app.contentful.com/spaces/${props.sdk.ids.space}${appEnvironmentUri}/apps/${props.sdk.ids.app}`;
  const { contentTypePage, fieldSite, items, fieldSlug } = props?.sdk
    ?.parameters?.installation as AppInstallationParameters;
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

  const siteSelected: string = props?.sdk?.entry?.fields[fieldSite]?.getValue();
  const slugPgPage: string = props?.sdk?.entry?.fields[fieldSlug]?.getValue();
  if (!siteSelected || !slugPgPage) {
    return (
      <>
        <ValidationMessage style={{ marginTop: "0.5rem" }}>
          Please select a site and write the slug.
        </ValidationMessage>
      </>
    );
  }

  return (
    <Stack flexDirection="column">
      {items
        ?.filter((item: ConfigPreviewItem) => item.site === siteSelected)
        ?.sort(SortByLabel)
        ?.map((item: ConfigPreviewItem, index: number) => {
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
              endIcon={<ExternalLinkIcon />}
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
