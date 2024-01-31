import {
  Stack,
  Button,
  Note,
  List,
  Textarea,
  Notification,
  Text,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { deepEqual, updateEditor } from "../../../util";
import {
  FieldSetupItem,
  Interface,
  InterfaceItem,
  FieldSetup,
} from "../FieldSetup.types";
import { CheckCircleIcon, CycleIcon } from "@contentful/f36-icons";
import { useEffect, useState } from "react";
import { SetupImportProps } from "./SetupImport.types";
import {
  CollectionProp,
  ContentTypeProps,
  ContentFields,
  KeyValueMap,
} from "contentful-management";

const SetupImport = ({ sdk, updateValue, configurations }: SetupImportProps) => {
  const [contentTypes, setContentTypes] = useState<Record<string, string[]>>(
    {}
  );

  const [settings, setSettings] = useState<FieldSetup | undefined>(undefined);
  const [validSettings, setValidSettings] = useState<boolean>(false);

  const [newSetupSubmitted, setNewSetupSubmitted] = useState<boolean>(false);

  const uninstallAllEditors = async () => {
    if (configurations?.length) {
      for (let value of configurations) {
        if (value?.contentType && value?.fieldId) {
          await updateEditor({
            sdk,
            contentType: value?.contentType,
            fieldId: value?.fieldId,
            widgetId: "objectEditor",
          });
        }
      }
    }
  };

  const setupAllEditors = async (setups?: Array<FieldSetupItem>) => {
    if (setups?.length) {
      for (let value of setups) {
        if (value?.contentType && value?.fieldId) {
          await updateEditor({
            sdk,
            contentType: value?.contentType,
            fieldId: value?.fieldId,
            widgetId: sdk.ids.app,
            widgetNamespace: "app",
          });
        }
      }
    }
  };

  useEffect(() => {
    const updateContentTypes: Record<string, string[]> = {};
    sdk.cma.contentType
      .getMany({ query: { limit: 1000 } })
      ?.then((value: CollectionProp<ContentTypeProps>) => {
        for (let ct of value?.items) {
          const fields = ct?.fields?.map(
            (value: ContentFields<KeyValueMap>) => value?.id
          );
          updateContentTypes[ct.sys.id] = fields;
        }
        setContentTypes(updateContentTypes);
      });
  }, [sdk]);
  return (
    <>
      <Stack
        style={{
          color: tokens.gray500,
          fontWeight: tokens.fontWeightMedium,
          paddingBottom: tokens.spacingS,
          paddingTop: tokens.spacingS,
        }}
      >
        Import settings
      </Stack>
      <Stack
        style={{
          color: tokens.gray500,
          paddingBottom: tokens.spacingS,
        }}
      >
        For this process you need a backup (JSON string) with interfaces and
        configurations. Paste/type the JSON string in this textarea, after you
        should validate it, then if pass the validation process, the "set up
        definition" button is going to be available to import the new
        definition.
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="right"
        style={{
          paddingBottom: tokens.spacingS,
        }}
      >
        <Button
          size="small"
          startIcon={<CheckCircleIcon />}
          variant="secondary"
          onClick={() => {
            let valid = false;
            if (settings) {
              if (
                deepEqual(
                  settings as unknown as Record<string, unknown>,
                  {}
                ) === true
              ) {
                valid = true;
              } else {
                let validConfigurations = false;
                let validInterfaces = false;
                if (typeof settings.configurations !== "undefined") {
                  validConfigurations = true;
                  settings?.configurations?.forEach((value: FieldSetupItem) => {
                    if (
                      !!!value ||
                      !!!value.contentType ||
                      !!!value.fieldId ||
                      !!!value.interfaceId
                    ) {
                      validConfigurations = false;
                    }
                    const findContentType = contentTypes[value.contentType];
                    if (!!!findContentType) {
                      validConfigurations = false;
                    }
                    if (!!!findContentType.includes(value.fieldId)) {
                      validConfigurations = false;
                    }
                  });
                }
                if (typeof settings.interfaces !== "undefined") {
                  validInterfaces = true;
                  settings?.interfaces?.forEach((value: Interface) => {
                    let validFields = true;
                    value?.items?.forEach((item: InterfaceItem) => {
                      if (
                        !!!item ||
                        !!!item.key ||
                        !!!item.label ||
                        !!!item.type
                      ) {
                        validFields = false;
                      }
                    });
                    if (
                      !!!value ||
                      !!!value.id ||
                      !!!value.name ||
                      !validFields
                    ) {
                      validInterfaces = false;
                    }
                  });
                }
                valid = validConfigurations && validInterfaces;
              }
            }
            setValidSettings(valid);
          }}
        >
          Validate JSON
        </Button>
        <Button
          size="small"
          startIcon={<CycleIcon />}
          variant="primary"
          isDisabled={!!!validSettings || newSetupSubmitted}
          isLoading={newSetupSubmitted}
          onClick={async () => {
            if (settings) {
              setNewSetupSubmitted(true);
              await uninstallAllEditors();
              await setupAllEditors(settings?.configurations);
              updateValue(settings);
              setSettings(undefined);
              setValidSettings(false);
              setNewSetupSubmitted(false);
              Notification.info(
                "Config have changed, remember to save settings."
              );
            }
          }}
        >
          Set up new config
        </Button>
      </Stack>
      <Stack
        style={{
          paddingBottom: tokens.spacingS,
        }}
      >
        <Note variant="warning" style={{ width: tokens.contentWidthFull }}>
          <Text>Configurations with errors</Text>
          <List>
            <List.Item>Configuration #1</List.Item>
            <List.Item>
              <List>
                <List.Item>
                  Missing required props (contentType, fieldId, interfaceId)
                </List.Item>
                <List.Item>Content type {"contenttype"} not exists</List.Item>
                <List.Item>
                  Field id {"fieldid"} not exists in content type{" "}
                  {"contenttype"}
                </List.Item>
              </List>
            </List.Item>
          </List>
          <Text>Interfaces with errors</Text>
          <List>
            <List.Item>Interface #1</List.Item>
            <List.Item>
              <List>
                <List.Item>Missing required props (id, name)</List.Item>
                <List.Item>
                  Interface is missing required props (key, label, type) in Item
                  #4
                </List.Item>
              </List>
            </List.Item>
          </List>
        </Note>
      </Stack>
      <Textarea
        placeholder="Paste a JSON definition."
        value={JSON.stringify(settings, null, 2) ?? ""}
        isDisabled={newSetupSubmitted}
        rows={15}
        onChange={(e) => {
          try {
            const settingsAsObject: FieldSetup = JSON.parse(
              e?.currentTarget?.value
            );
            setValidSettings(false);
            setSettings(settingsAsObject);
          } catch (error) {
            console.log(error);
          }
        }}
      ></Textarea>
    </>
  );
};

export default SetupImport;
