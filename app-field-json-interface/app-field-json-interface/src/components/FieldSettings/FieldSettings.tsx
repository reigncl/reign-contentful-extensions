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

const FieldSettings = ({ sdk }: FieldSetupProps) => {
  const [configurations, setConfigurations] = useState<Array<FieldSetupItem>>(
    (sdk.field.getValue() as FieldSetup)?.configurations ?? []
  );
  const [interfaces, setInterfaces] = useState<Array<Interface>>(
    (sdk.field.getValue() as FieldSetup)?.interfaces ?? []
  );

  const handleChangeInterfaces = (update: Array<Interface>) => {
    setInterfaces(update ?? []);
  };

  const handleChangeConfigurations = (update: Array<FieldSetupItem>) => {
    setConfigurations(update ?? []);
  };

  useEffect(() => {
    sdk.field.setValue({ configurations, interfaces }).catch((error) => {
      console.log(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configurations, interfaces]);

  return (
    <>
      <Tabs defaultTab="interfaces">
        <Tabs.List>
          <Tabs.Tab panelId="interfaces">Interfaces</Tabs.Tab>
          <Tabs.Tab panelId="configurations">Configurations</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="interfaces">
          <SetupInterfaces
            sdk={sdk}
            items={interfaces}
            onUpdate={handleChangeInterfaces}
          />
        </Tabs.Panel>
        <Tabs.Panel id="configurations">
          <SetupConfigurations />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default FieldSettings;
