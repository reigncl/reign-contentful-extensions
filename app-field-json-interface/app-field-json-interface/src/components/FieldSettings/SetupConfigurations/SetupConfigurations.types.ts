import { DialogAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { FieldSetupItem, Interface } from "../FieldSetup.types";

export interface SetupConfigurationsProps {
  items?: Array<Interface>;
  configurations?: Array<FieldSetupItem>;
  sdk: FieldAppSDK;
  onUpdate: (update: Array<FieldSetupItem>) => void;
}
export interface SetupConfigurationDialogProps {
  sdk: DialogAppSDK;
}
