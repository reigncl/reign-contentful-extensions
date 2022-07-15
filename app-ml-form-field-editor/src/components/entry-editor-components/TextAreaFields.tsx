import { FormControl, TextInput } from '@contentful/f36-components'
import { CommonEntryEditorProps } from '../../interfaces'

export const TextAreaFields = ({ entry, updateField }: CommonEntryEditorProps) => (
  <>
    <FormControl>
      <FormControl.Label>Columns</FormControl.Label>
      <TextInput
        testId="columns"
        onChange={(e) => {
          updateField(e.target.value, 'columns')
        }}
        defaultValue={`${entry.columns}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>

    <FormControl>
      <FormControl.Label>Rows</FormControl.Label>
      <TextInput
        testId="rows"
        onChange={(e) => {
          updateField(e.target.value, 'rows')
        }}
        defaultValue={`${entry.rows}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>
  </>
)
