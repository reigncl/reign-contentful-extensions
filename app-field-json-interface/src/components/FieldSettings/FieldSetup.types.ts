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
  /**
   * Optional 1-based "row group" used by the field renderer to put multiple
   * items side-by-side. Items sharing the same `row` render together; missing
   * or non-finite values fall into a trailing group. Numbers are opaque ids,
   * not display order: `1, 1, 5, 5` and `1, 1, 2, 2` render identically.
   */
  row?: number;
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
