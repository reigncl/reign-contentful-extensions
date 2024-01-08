import { FieldAppSDK } from "@contentful/app-sdk";

export type FieldValueType =
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | undefined;

export interface InterfaceItem {
  id: string;
  label: string;
  key: string;
  type: "Boolean" | "InputText" | "InputTextList" | "Select" | "Textarea";
  options?: Array<string>;
  helpText?: string;
  required: boolean;
}

export interface Interface {
  name: string;
  items: Array<InterfaceItem> | Array<Array<InterfaceItem> | InterfaceItem>;
}

export interface FieldSetupItem {
  contentType: string;
  fieldId: string;
  interface: Interface;
}

export interface FieldSetup {
  interfaces?: Array<Interface>;
  configurations?: Array<FieldSetupItem>;
}

export interface FieldSetupProps {
  sdk: FieldAppSDK;
}
