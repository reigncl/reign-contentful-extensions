import { ConfigAppSDK, DialogAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { Interface } from "../FieldSetup.types";

export interface SetupInterfacesProps {
  items?: Array<Interface>;
  onUpdate: (update: Array<Interface>) => void;
  sdk: FieldAppSDK | ConfigAppSDK;
}

export interface SetupInterfaceDialogProps {
  sdk: DialogAppSDK;
}
