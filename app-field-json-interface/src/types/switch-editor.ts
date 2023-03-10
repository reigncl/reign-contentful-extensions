import { FieldState } from "./field-reducer"

export type EditorTypeValue = string | number | boolean | Record<string, any>

export interface SwitchEditorProps {
  parentKey: string
  prevParentKey?: string
  currentKey?: string
  index?: number
  value?: EditorTypeValue;
  structure?: EditorTypeValue;
  handleUpdate?: Function
}
