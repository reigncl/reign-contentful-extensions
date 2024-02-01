import { ConfigAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { FieldSetupItem, FieldUpdateValueFunction } from "../FieldSetup.types";
import { ContentTypeInfo } from "../../../locations/ConfigScreen";

export interface SetupImportProps {
  sdk: FieldAppSDK | ConfigAppSDK;
  updateValue: FieldUpdateValueFunction;
  configurations: Array<FieldSetupItem>;
  contentTypes: Array<ContentTypeInfo>;
}

export interface ErrorItem {
  position: number;
  errors: Array<string>;
}
