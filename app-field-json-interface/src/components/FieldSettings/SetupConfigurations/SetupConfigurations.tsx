import {
  Flex,
  Button,
  IconButton,
  Note,
  Table,
  Badge,
  Box,
} from "@contentful/f36-components";
import { SetupConfigurationsProps } from "./SetupConfigurations.types";
import { FieldSetupItem, Interface } from "../FieldSetup.types";
import { DeleteIcon, EditIcon } from "@contentful/f36-icons";
import { CSSProperties, useEffect, useState } from "react";
import { CollectionProp, ContentTypeProps } from "contentful-management";
import { updateEditor } from "../../../util";

const SetupConfigurations = ({
  sdk,
  items,
  configurations,
  onUpdate,
}: SetupConfigurationsProps) => {
  const [contentTypes, setContentTypes] = useState<Record<string, string>>({});
  const [interfaces, setInterfaces] = useState<Record<string, string>>({});
  const styleCell: CSSProperties = { verticalAlign: "middle" };
  const styleBadge: CSSProperties = { textTransform: "none" };
  const addConfiguration = async () => {
    try {
      const response = (await sdk.dialogs.openCurrentApp({
        title: "Add Configuration",
        width: "medium",
        minHeight: 500,
        parameters: {
          type: "configuration",
          interfaces: items,
        },
      })) as FieldSetupItem & {
        index?: number;
      };

      if (response) {
        const arrConfigurations = [...(configurations ?? [])];
        arrConfigurations.push({
          contentType: response?.contentType,
          fieldId: response?.fieldId,
          interfaceId: response?.interfaceId,
        });
        onUpdate(arrConfigurations);
      }
    } catch (error) {}
  };

  const RenderConfigurations = () => {
    if (!!!items || items?.length === 0) {
      return (
        <Note variant="neutral">No interfaces have been created yet.</Note>
      );
    }
    if (!!!configurations || configurations?.length === 0) {
      return (
        <Note variant="neutral">No configurations have been created yet.</Note>
      );
    }

    return (
      <>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Content type</Table.Cell>
              <Table.Cell>Field id</Table.Cell>
              <Table.Cell>Interface</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {configurations?.map((config: FieldSetupItem, index: number) => (
              <Table.Row key={`configuration-${index}`}>
                <Table.Cell style={styleCell}>
                  <Box>{contentTypes[config?.contentType]}</Box>
                  <Box>
                    <Badge style={styleBadge}>{config?.contentType}</Badge>
                  </Box>
                </Table.Cell>
                <Table.Cell style={styleCell}>{config?.fieldId}</Table.Cell>
                <Table.Cell style={styleCell}>
                  <Box>{interfaces[config?.interfaceId]}</Box>
                  <Box>
                    <Badge style={styleBadge}>{config?.interfaceId}</Badge>
                  </Box>
                </Table.Cell>
                <Table.Cell style={styleCell}>
                  <IconButton
                    variant="transparent"
                    aria-label="Edit Configuration"
                    icon={<EditIcon />}
                    onClick={async () => {
                      const response = (await sdk.dialogs.openCurrentApp({
                        title: "Edit Configuration",
                        width: "medium",
                        minHeight: 500,
                        parameters: {
                          ...config,
                          type: "configuration",
                          index,
                          interfaces: items,
                        },
                      })) as FieldSetupItem & {
                        index?: number;
                        interfaces?: Array<Interface>;
                      };

                      if (response && typeof response.index !== "undefined") {
                        const arrConfigurations = [...configurations];
                        arrConfigurations[response.index] = {
                          contentType: response.contentType,
                          fieldId: response.fieldId,
                          interfaceId: response.interfaceId,
                        } as FieldSetupItem;
                        onUpdate(arrConfigurations);
                      }
                    }}
                  />
                  <IconButton
                    variant="transparent"
                    aria-label="Remove Configuration"
                    icon={<DeleteIcon />}
                    onClick={async () => {
                      const response = await sdk.dialogs.openConfirm({
                        title: "Remove Configuration",
                        message:
                          "Are you sure you want to delete this configuration?",
                      });
                      if (response) {
                        await updateEditor({
                          sdk,
                          contentType: config?.contentType,
                          fieldId: config?.fieldId,
                          widgetId: "objectEditor",
                        });
                        const arrConfigurations = [...configurations];
                        arrConfigurations.splice(index, 1);
                        onUpdate(arrConfigurations);
                      }
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  };

  useEffect(() => {
    sdk.cma.contentType
      .getMany({})
      .then((items: CollectionProp<ContentTypeProps>) => {
        let updateContentTypes = { ...contentTypes };
        items.items?.forEach((value: ContentTypeProps) => {
          updateContentTypes[value?.sys?.id] = value?.name;
        });
        setContentTypes(updateContentTypes);
      });
    if (items?.length) {
      let updateInterfaces = { ...interfaces };
      items?.forEach((item: Interface) => {
        updateInterfaces[item.id] = item.name;
      });
      setInterfaces(updateInterfaces);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk, items]);

  return (
    <>
      <Flex padding="spacingS" justifyContent="right">
        <Button onClick={addConfiguration} variant="primary" size="small">
          Add Configuration
        </Button>
      </Flex>
      <RenderConfigurations />
    </>
  );
};

export default SetupConfigurations;
