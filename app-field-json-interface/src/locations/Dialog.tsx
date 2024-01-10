import React, { useEffect, useState } from "react";
import { DialogAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import SetupInterfaceDialog from "../components/FieldSettings/SetupInterfaces/SetupInterfaceDialog";
import SetupConfigurationDialog from "../components/FieldSettings/SetupConfigurations/SetupConfigurationDialog";

export type DialogType = "configuration" | "interface";

export interface DialogDefaultParameters {
  type?: DialogType;
}

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const [parameters, setParameters] = useState<DialogDefaultParameters>({});

  useEffect(() => {
    setParameters((sdk.parameters.invocation as DialogDefaultParameters) ?? {});
  }, [sdk]);

  switch (parameters?.type) {
    case "configuration":
      return <SetupConfigurationDialog sdk={sdk} />;
    case "interface":
      return <SetupInterfaceDialog sdk={sdk} />;
    default:
      return <></>;
  }
};

export default Dialog;
