import { MlFormField } from '.'

export type CommonEntryEditorProps = {
  entry: MlFormField
  updateField: (newField: unknown, fieldKey: keyof MlFormField) => void
}
