import { ConfigAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { ContentTypeInfo } from "../../locations/ConfigScreen";

export type FieldValueType =
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | undefined;

export interface InterfaceItem {
  label: string;
  key: string;
  type: "Boolean" | "InputText" | "InputTextList" | "Select" | "Textarea";
  inputTextType?: "text" | "password" | "email" | "number" | "url" | "regex" | "colorpicker";
  output?: "hex" | "rgb";
  regex?: RegExp;
  options?: Array<string>;
  helpText?: string;
  errorMessage?: string;
  required?: boolean;
}

export interface Interface {
  id: string;
  name: string;
  isArray: boolean;
  isCollapsed: boolean;
  items?: Array<InterfaceItem>;
}

export interface FieldSetupItem {
  contentType: string;
  fieldId: string;
  interfaceId: string;
  min?: number;
  max?: number;
}

export interface FieldSetup {
  interfaces?: Array<Interface>;
  configurations?: Array<FieldSetupItem>;
}

export type FieldUpdateValueFunction = <Value = any>(
  value: Value | FieldSetup
) => void;

export interface FieldSetupProps {
  sdk: FieldAppSDK | ConfigAppSDK;
  value: FieldSetup;
  updateValue: FieldUpdateValueFunction;
  contentTypes: Array<ContentTypeInfo>;
}
