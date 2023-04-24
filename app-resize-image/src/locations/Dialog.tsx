import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  Note,
  Notification,
} from "@contentful/f36-components";
import { DialogAppSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { AssetProps } from "../types/asset-props";
import ResizableImage from "../components/ResizableImage";

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const cma = useCMA();

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [asset, setAsset] = useState<AssetProps | null>(null);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);

  const srcAsset = useMemo(() => {
    if (asset) {
      return asset?.fields?.file[sdk.locales.default].url ?? "";
    }
    return "";
  }, [asset]);

  useEffect(() => {
    getAssetById(sdk.parameters?.invocation as string);
  }, []);

  /**
   * @description gets the data of the asset in Contentful given its id
   * @param {string} id
   */
  const getAssetById = async (id: string) => {
    try {
      const response = await cma.asset.get({ assetId: id });
      setAsset(response);
    } catch (error) {
      Notification.error("An error occurred getting the asset data");
    }
  };

  /**
   * @description it fetches an image from a URL and returns it as a buffer
   * @return {*}  {(Promise<ArrayBuffer | undefined>)}
   */
  const getImageFromUrl = useCallback(async (): Promise<
    ArrayBuffer | undefined
  > => {
    try {
      if (asset) {
        const url = `https:${asset.fields.file[sdk.locales.default].url}?w=${
          size.width
        }&h=${size.height}`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();

        return arrayBuffer;
      }
    } catch (error) {
      Notification.error("An error occurred processing the resized image");
      setIsSavingImage(false);
    }
  }, [asset, size]);

  /**
   * @description uploads an image buffer to Contentful and updates the asset if it already exists.
   * @param {ArrayBuffer} imageBuffer
   * @return {*}  {(Promise<AssetProps | undefined>)}
   */
  const uploadImageToContentful = useCallback(
    async (imageBuffer: ArrayBuffer): Promise<void> => {
      try {
        if (asset) {
          let upload = await cma.upload.create({}, { file: imageBuffer });
          let assetUpdated = await cma.asset.update(
            { assetId: asset?.sys.id },
            {
              sys: asset.sys,
              fields: {
                title: {
                  [sdk.locales.default]:
                    asset.fields.title[sdk.locales.default],
                },
                description: {
                  [sdk.locales.default]: asset.fields.description
                    ? asset.fields.description[sdk.locales.default]
                    : "",
                },
                file: {
                  [sdk.locales.default]: {
                    uploadFrom: {
                      sys: {
                        type: "Link",
                        linkType: "Upload",
                        id: upload.sys.id,
                      },
                    },
                    fileName: asset.fields.file[sdk.locales.default].fileName,
                    contentType:
                      asset.fields.file[sdk.locales.default].contentType,
                  },
                },
              },
            }
          );
          assetUpdated = await cma.asset.processForAllLocales({}, assetUpdated);
          assetUpdated = await cma.asset.publish(
            { assetId: assetUpdated.sys.id },
            assetUpdated
          );
          sdk.close(Boolean(assetUpdated));
        }
      } catch (error) {
        Notification.error(
          "An error occurred while uploading the image in Contentful"
        );
      } finally {
        setIsSavingImage(false);
      }
    },
    [asset]
  );

  /**
   * @description  handles saving an image by getting it from a URL, uploading it to Contentful, and closing the dialog.
   * @return {*}  {Promise<void>}
   */
  const handleSaveImage = async (): Promise<void> => {
    setIsSavingImage(true);
    const imageBuffer = await getImageFromUrl();
    if (imageBuffer) {
      await uploadImageToContentful(imageBuffer);
    }
  };

  return (
    <Flex flexDirection="column" style={{ height: "100vh" }}>
      <Modal.Header
        testId="modal-header"
        title="Image resizing tool"
        onClose={() => sdk.close(false)}
      />
      <Modal.Content>
        <Flex
          flexDirection="column"
          alignItems="center"
          style={{ background: "#F4F5F7", borderRadius: "10px" }}
        >
          <Box marginBottom="spacingL" marginTop="spacingL">
            <Note variant="primary" testId="note">
              Now you can edit the dimensions of your newly uploaded image,
              dragging its corners and getting a new resized image
            </Note>
          </Box>
          <Box marginBottom="spacingL" style={{ minHeight: "72vh" }}>
            <ResizableImage src={srcAsset} size={size} onChangeSize={setSize} />
          </Box>
        </Flex>
      </Modal.Content>
      <Modal.Controls>
        <Badge testId="width-badge" variant="secondary">
          Width: {size.width}px
        </Badge>
        <Badge testId="height-badge" variant="secondary">
          height: {size.height}px
        </Badge>
        <Button
          testId="save-button"
          variant="positive"
          onClick={handleSaveImage}
          isLoading={isSavingImage}
          isDisabled={isSavingImage}
        >
          {isSavingImage && "Saving new image"}
          {!isSavingImage && "Save new image"}
        </Button>
      </Modal.Controls>
    </Flex>
  );
};

export default Dialog;

