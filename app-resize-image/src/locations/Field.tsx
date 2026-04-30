import React, { useEffect, useState } from "react";
import { Box, Button, Notification } from "@contentful/f36-components";
import { FieldAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import {
  CombinedLinkActions,
  SingleMediaEditor,
} from "@contentful/field-editor-reference";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const contentField = sdk?.entry?.fields["image"];
  const [assetId, setAssetId] = useState<string | null>(null);

  useEffect(() => {
    const detach = contentField.onValueChanged((value) => {
      setAssetId(value?.sys?.id);
    });
    return () => detach();
  }, [contentField]);

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  /**
   * @description opens a dialog box in a full-width view and allows modification of an image asset
   */
  const openDialogResizeTool = (): void => {
    sdk.dialogs
      .openCurrentApp({
        width: "fullWidth",
        minHeight: "80vh",
        shouldCloseOnEscapePress: true,
        allowHeightOverflow: true,
        parameters: assetId,
      })
      .then((updated) => {
        if (updated) {
          Notification.success("The image has been successfully modified");
        }
      });
  };

  return (
    <>
      <Box>
        <SingleMediaEditor
          viewType="card"
          sdk={sdk}
          isInitiallyDisabled={false}
          renderCustomActions={(props: any) => (
            <CombinedLinkActions {...props} />
          )}
          parameters={{
            instance: {
              showCreateEntityAction: true,
              showLinkEntityAction: true,
            },
          }}
        />
      </Box>

      {assetId && (
        <Box marginTop="spacingL">
          <Button variant="primary" onClick={openDialogResizeTool}>
            Resize image
          </Button>
        </Box>
      )}
    </>
  );
};

export default Field;

