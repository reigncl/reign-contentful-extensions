import { useEffect, useState } from "react";
import {
  Tabs,
  Notification,
  Subheading,
  Flex,
  Textarea,
  Stack,
  Button,
  Text,
  IconButton,
} from "@contentful/f36-components";
import {
  FieldSetupItem,
  FieldSetupProps,
  Interface,
  FieldSetup,
} from "./FieldSetup.types";
import SetupInterfaces from "./SetupInterfaces/SetupInterfaces";
import SetupConfigurations from "./SetupConfigurations/SetupConfigurations";
import tokens from "@contentful/f36-tokens";
import {
  CopyIcon,
  CheckCircleIcon,
  CloudUploadIcon,
} from "@contentful/f36-icons";

const FieldSettings = ({ sdk, value, updateValue }: FieldSetupProps) => {
  const [configurations, setConfigurations] = useState<Array<FieldSetupItem>>(
    (value as FieldSetup)?.configurations ?? []
  );
  const [interfaces, setInterfaces] = useState<Array<Interface>>(
    (value as FieldSetup)?.interfaces ?? []
  );

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
            >
              Validate JSON
            </Button>
            <Button
              size="small"
              startIcon={<CloudUploadIcon />}
              variant="primary"
              isDisabled
            >
              Save config
            </Button>
          </Stack>
          <Textarea rows={15}></Textarea>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default FieldSettings;
