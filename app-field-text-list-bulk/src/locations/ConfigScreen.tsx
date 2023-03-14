import React, { useCallback, useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Table,
  TextLink,
  Box,
} from "@contentful/f36-components";
import { AppExtensionSDK, SerializedJSONValue } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import { DeleteIcon, EditIcon, PlusIcon } from "@contentful/f36-icons";
import { DialogTypes } from "./Dialog";
import { Control } from "contentful-management";

export interface AppInstallationParameters {
  items?: Array<ConfigJsonStructureItem>;
}

export interface ConfigJsonStructureItem {
  contentType: string;
  field: string;
  data: string;
  index?: number;
}

const ConfigScreen = () => {
  const fieldTypeEditor = "Array";
  const sdk = useSDK<AppExtensionSDK>();
  const cma = useCMA();
  const [parameters, setParameters] = useState<AppInstallationParameters>({});

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  const updateEditor = async (
    contentType: string,
    fieldId: string,
    widgetId: string,
    widgetNamespace: string = "builtin"
  ) => {
    try {
      const editor = await cma.editorInterface.get({
        contentTypeId: contentType,
      });
      const controls = editor.controls?.map((value: Control) => {
        if (value.fieldId === fieldId) {
          return { ...value, widgetId, widgetNamespace };
        }
        return value;
      });
      await cma.editorInterface.update(
        { contentTypeId: contentType },
        { ...editor, controls: controls }
      );
    } catch (error) {}
  };

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

  const TableWithItems = () => {
    if (!parameters.items || parameters.items.length === 0) {
      return <></>;
    }
    return (
      <>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Content type</Table.Cell>
              <Table.Cell>Field id</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {parameters.items.map(
              (itm: ConfigJsonStructureItem, itmIndex: number) => {
                return (
                  <Table.Row key={itmIndex}>
                    <Table.Cell>{itm?.contentType}</Table.Cell>
                    <Table.Cell>{itm?.field}</Table.Cell>
                    <Table.Cell>
                      <TextLink
                        as="button"
                        variant="primary"
                        icon={<EditIcon />}
                        alignIcon="end"
                        onClick={() => {
                          openDialog(DialogTypes.UPDATE, itm, itmIndex);
                        }}
                      />
                      <TextLink
                        as="button"
                        variant="negative"
                        icon={<DeleteIcon />}
                        alignIcon="end"
                        onClick={() => {
                          openDeleteDialog(itm, itmIndex);
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </>
    );
  };

  const openDialog = async (
    type: DialogTypes,
    item?: ConfigJsonStructureItem,
    index?: number
  ) => {
    try {
      const result: ConfigJsonStructureItem = await sdk.dialogs.openCurrentApp({
        title: type === DialogTypes.ADD ? "Add new config" : "Edit config",
        minHeight: 360,
        parameters: {
          contentType: item?.contentType,
          field: item?.field,
          data: item?.data,
          index,
        } as unknown as SerializedJSONValue,
      });
      const currentItems = parameters.items ?? [];
      if (type === DialogTypes.ADD && result) {
        await updateEditor(
          result.contentType,
          result.field,
          sdk.ids.app,
          "app"
        );
        currentItems.push(result);
      }
      if (type === DialogTypes.UPDATE && typeof result?.index !== "undefined") {
        const previewItemVersion = currentItems[result?.index];
        if (
          previewItemVersion.contentType !== result.contentType ||
          previewItemVersion.field !== result.field
        ) {
          await updateEditor(
            previewItemVersion.contentType,
            previewItemVersion.field,
            fieldTypeEditor
          );
          await updateEditor(
            result.contentType,
            result.field,
            sdk.ids.app,
            "app"
          );
        }
        currentItems[result?.index] = result;
      }
      if (result) {
        setParameters({
          ...parameters,
          items: currentItems,
        });
      }
    } catch (error) {
      console.log("openDialog error", error);
    }
  };

  const openDeleteDialog = async (
    item: ConfigJsonStructureItem,
    index: number
  ) => {
    try {
      const deleteResponse = await sdk.dialogs.openConfirm({
        title: "Are you sure to delete this configuration?",
        message: ``,
      });
      if (deleteResponse) {
        await updateEditor(item.contentType, item.field, fieldTypeEditor);
        const currentItems = parameters.items ?? [];
        currentItems.splice(index, 1);
        setParameters({
          ...parameters,
          items: currentItems,
        });
      }
    } catch (error) {
      console.log("openDeleteDialog error", error);
    }
  };

  return (
    <Flex className={css({ margin: "80px" })}>
      <Box paddingLeft="spacingL">
        <Heading>
          List configurations{" "}
          <TextLink
            as="button"
            variant="primary"
            icon={<PlusIcon />}
            alignIcon="start"
            onClick={() => {
              openDialog(DialogTypes.ADD);
            }}
          >
            Add config
          </TextLink>
        </Heading>
        <TableWithItems />
      </Box>
    </Flex>
  );
};

export default ConfigScreen;
