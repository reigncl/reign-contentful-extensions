import React, { useEffect, useState } from "react";
import {
  AssetProps,
  Button,
  Paragraph,
  Stack,
  Tabs,
} from "@contentful/f36-components";
import { Asset, FieldAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { PlusIcon, CycleIcon } from "@contentful/f36-icons";
import RedirectsPanel from "../components/RedirectsPanel";
import AssetPanel from "../components/AssetPanel";
import { AssetFileProp } from "contentful-management";

interface IAssetRef {
  sys: IAssetRefSys;
}

interface IAssetRefSys {
  type: string;
  linkType: string;
  id: string;
}

export interface IRedirect {
  from: string;
  to: string;
  type: number;
}

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [asset, setAsset] = useState<IAssetRef | undefined>(
    sdk.field.getValue()
  );
  const [redirects, setRedirects] = useState<Array<IRedirect>>([]);

  const value = sdk.field.getValue() as IAssetRef;

  const populateAsset = async (assetId: string): Promise<void> => {
    try {
      const assetObject: Asset = await sdk.cma.asset.get({ assetId });
      let assetUrl = assetObject?.fields?.file[sdk.locales.default]?.url;
      if (
        assetUrl &&
        assetObject?.fields?.file[sdk.locales.default]?.contentType ===
          "application/json"
      ) {
        assetUrl = assetUrl?.startsWith("https:")
          ? assetUrl
          : `https:${assetUrl}`;
        const response = await fetch(assetUrl);
        const assetContent = await response.json();
        if (assetContent && Array.isArray(assetContent)) {
          setRedirects(assetContent);
        }
        console.log("assetContent", assetContent);
      }
    } catch (error) {}
  };

  const updateAssetContent = async () => {
    const dataFile = {
      contentType: "application/json",
      fileName: `redirects-${new Date().getTime()}.json`,
      file: JSON.stringify(redirects),
    };
    try {
      let assetContentful: Asset | undefined = undefined;
      if (asset?.sys?.id) {
        let currentAsset = await sdk.cma.asset.get({ assetId: asset.sys.id });
        if (currentAsset) {
          const uploadJson = await sdk.cma.upload.create(
            { spaceId: sdk.ids.space },
            { file: dataFile.file }
          );
          currentAsset.fields.file[sdk.locales.default] = {
            contentType: dataFile.contentType,
            fileName: dataFile.fileName,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: uploadJson.sys.id,
              },
            },
          };
          assetContentful = await sdk.cma.asset.update(
            { assetId: currentAsset.sys.id },
            currentAsset
          );
        }
      } else {
        let data: Omit<AssetFileProp, "sys"> = {
          fields: {
            title: {},
            description: {},
            file: {},
          },
        };
        data.fields.title[sdk.locales.default] = `Redirects`;
        data.fields.description[sdk.locales.default] = ``;
        data.fields.file[sdk.locales.default] = dataFile;
        assetContentful = await sdk.cma.asset.createFromFiles(
          {
            spaceId: sdk.ids.space,
          },
          data
        );
      }
      if (assetContentful) {
        await sdk.cma.asset.processForAllLocales(
          {
            spaceId: sdk.ids.space,
          },
          assetContentful
        );
        setAsset({
          sys: { type: "Link", linkType: "Asset", id: assetContentful.sys.id },
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const openDialog = () => {
    sdk.dialogs.openCurrentApp({width: 600, minHeight: 500})
  }

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  useEffect(() => {
    if (asset?.sys?.id) {
      populateAsset(asset?.sys?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, sdk.cma.asset]);

  return (
    <>
      <button onClick={updateAssetContent}>updateAssetContent</button>
      <Stack alignItems="right" justifyContent="right">
        <Button size="small" startIcon={<CycleIcon />} variant="positive">
          Save configuration
        </Button>
        <Button size="small" startIcon={<PlusIcon />} variant="primary" onClick={openDialog}>
          Add redirect
        </Button>
      </Stack>
      <Paragraph>{JSON.stringify(value)}</Paragraph>
      <Tabs defaultTab="first">
        <Tabs.List variant="horizontal-divider">
          <Tabs.Tab panelId="first">Redirects</Tabs.Tab>
          <Tabs.Tab panelId="second" isDisabled>
            Asset
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="first">
          <RedirectsPanel redirects={redirects} />
        </Tabs.Panel>
        <Tabs.Panel id="second">
          <AssetPanel />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Field;
