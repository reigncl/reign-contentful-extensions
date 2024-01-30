import { useEffect, useState } from "react";
import {
  Tabs,
  Notification,
  Textarea,
  Stack,
  Button,
} from "@contentful/f36-components";
import {
  FieldSetupItem,
  FieldSetupProps,
  Interface,
  FieldSetup,
  InterfaceItem,
} from "./FieldSetup.types";
import SetupInterfaces from "./SetupInterfaces/SetupInterfaces";
import SetupConfigurations from "./SetupConfigurations/SetupConfigurations";
import tokens from "@contentful/f36-tokens";
import { CopyIcon, CheckCircleIcon, CycleIcon } from "@contentful/f36-icons";
import { deepEqual, updateEditor } from "../../util";

const FieldSettings = ({ sdk, value, updateValue }: FieldSetupProps) => {
  const [configurations, setConfigurations] = useState<Array<FieldSetupItem>>(
    (value as FieldSetup)?.configurations ?? []
  );
  const [interfaces, setInterfaces] = useState<Array<Interface>>(
    (value as FieldSetup)?.interfaces ?? []
  );

  const [settings, setSettings] = useState<FieldSetup | undefined>(undefined);
  const [validSettings, setValidSettings] = useState<boolean>(false);

  const handleChangeInterfaces = (update: Array<Interface>) => {
    setInterfaces(update ?? []);
    updateValue({ configurations, interfaces: update ?? [] });

    Notification.info("Interfaces have changed, remember to save settings.");
  };

  const handleChangeConfigurations = (update: Array<FieldSetupItem>) => {
    setConfigurations(update ?? []);
    updateValue({ configurations: update ?? [], interfaces });

    Notification.info(
      "Configurations have changed, remember to save settings."
    );
  };

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
    setConfigurations((value as FieldSetup)?.configurations ?? []);
    setInterfaces((value as FieldSetup)?.interfaces ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Tabs defaultTab="configurations">
        <Tabs.List>
          <Tabs.Tab panelId="configurations">Fields configurations</Tabs.Tab>
          <Tabs.Tab panelId="interfaces">Interfaces</Tabs.Tab>
          <Tabs.Tab panelId="export">Export</Tabs.Tab>
          <Tabs.Tab panelId="import">Import</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="interfaces">
          <SetupInterfaces
            sdk={sdk}
            items={interfaces}
            onUpdate={handleChangeInterfaces}
          />
        </Tabs.Panel>
        <Tabs.Panel id="configurations">
          <SetupConfigurations
            sdk={sdk}
            items={interfaces}
            onUpdate={handleChangeConfigurations}
            configurations={configurations}
          />
        </Tabs.Panel>
        <Tabs.Panel id="export">
          <Stack
            style={{
              color: tokens.gray500,
              fontWeight: tokens.fontWeightMedium,
              paddingBottom: tokens.spacingS,
              paddingTop: tokens.spacingS,
            }}
          >
            Export settings
          </Stack>
          <Stack
            style={{
              color: tokens.gray500,
              paddingBottom: tokens.spacingS,
            }}
          >
            In this textarea you will find the application definitions such as
            interfaces and configurations.
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="right"
            style={{
              paddingBottom: tokens.spacingS,
            }}
          >
            <Button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(value, null, 2));
                Notification.info("Copied settings.");
              }}
              size="small"
              startIcon={<CopyIcon />}
              variant="secondary"
            >
              Copy current config
            </Button>
          </Stack>
          <Textarea rows={15} isReadOnly>
            {JSON.stringify(value, null, 2)}
          </Textarea>
        </Tabs.Panel>
        <Tabs.Panel id="import">
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
            If you have a definitions backup, you can paste in this textarea,
            after you should validate it then if pass the validation process,
            the save definition button is going to be available.
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
                      settings?.configurations?.forEach(
                        (value: FieldSetupItem) => {
                          if (
                            !!!value ||
                            !!!value.contentType ||
                            !!!value.fieldId ||
                            !!!value.interfaceId
                          ) {
                            validConfigurations = false;
                          }
                        }
                      );
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
              isDisabled={!!!validSettings}
              onClick={async () => {
                if (settings) {
                  await uninstallAllEditors();
                  await setupAllEditors(settings?.configurations);
                  updateValue(settings);
                  setSettings(undefined);
                  setValidSettings(false);
                  Notification.info(
                    "Config have changed, remember to save settings."
                  );
                }
              }}
            >
              Set up new config
            </Button>
          </Stack>
          <Textarea
            placeholder="Paste a JSON definition."
            value={JSON.stringify(settings, null, 2) ?? ""}
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
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default FieldSettings;
