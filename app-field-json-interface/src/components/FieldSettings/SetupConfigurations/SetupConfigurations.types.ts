import { ConfigAppSDK, DialogAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { FieldSetupItem, Interface } from "../FieldSetup.types";
import { ContentTypeInfo } from "../../../locations/ConfigScreen";

export interface SetupConfigurationsProps {
  items?: Array<Interface>;
  configurations?: Array<FieldSetupItem>;
  sdk: FieldAppSDK | ConfigAppSDK;
  onUpdate: (update: Array<FieldSetupItem>) => void;
  contentTypes: ContentTypeInfo;
}
export interface SetupConfigurationDialogProps {
  sdk: DialogAppSDK;
}
