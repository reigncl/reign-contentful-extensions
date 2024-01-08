import { EditorTypeValue } from './switch-editor'

export interface ChildMainEditorProps {
  value?: EditorTypeValue;
  structure?: EditorTypeValue;
  handleUpdate?: Function
  parentKey: string
}
