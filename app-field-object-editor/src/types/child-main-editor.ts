import { EditorTypeValue } from './switch-editor'

export interface ChildMainEditorProps {
  dataFromField?: any
  data?: EditorTypeValue | EditorTypeValue[]
  parentKey: string
  isArray?: boolean
}
