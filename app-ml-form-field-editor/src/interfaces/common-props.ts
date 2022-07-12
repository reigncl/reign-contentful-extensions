import { MlFormField } from '.'

export type CommonProps = {
  entry: MlFormField
  updateField: (newField: unknown, fieldKey: keyof MlFormField) => void
}
