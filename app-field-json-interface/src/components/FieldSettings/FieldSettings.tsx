import { Tabs } from "@contentful/f36-components";
import {
  FieldSetupItem,
  FieldSetupProps,
  Interface,
  FieldSetup,
} from "./FieldSetup.types";
import SetupInterfaces from "./SetupInterfaces/SetupInterfaces";
import SetupConfigurations from "./SetupConfigurations/SetupConfigurations";
import { useEffect, useState } from "react";

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
  };

  const handleChangeConfigurations = (update: Array<FieldSetupItem>) => {
    setConfigurations(update ?? []);
    updateValue({ configurations: update ?? [], interfaces });
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
      </Tabs>
    </>
  );
};

export default FieldSettings;
