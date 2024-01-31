import { ConfigAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { FieldSetupItem, FieldUpdateValueFunction } from "../FieldSetup.types";

export interface SetupImportProps {
  sdk: FieldAppSDK | ConfigAppSDK;
  updateValue: FieldUpdateValueFunction;
  configurations: Array<FieldSetupItem>;
}
