import { ColorPickerValue } from "./Editors/ColorPicker";

export type FieldInterfaceValue =
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | null
  | ColorPickerValue;
