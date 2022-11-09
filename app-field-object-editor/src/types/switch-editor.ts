export type EditorTypeValue = string | number | boolean | Record<string, any>

export interface SwitchEditorProps {
  value: EditorTypeValue
  parentKey: string
  currentKey: string
}
