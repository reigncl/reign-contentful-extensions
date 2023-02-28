import { EditorTypeValue } from "./switch-editor"

export interface ChildMainEditorProps {
  data?: EditorTypeValue | EditorTypeValue[]
  parentKey: string
  isArray?: boolean
}
