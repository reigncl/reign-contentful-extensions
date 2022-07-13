import { FormControl, TextInput } from '@contentful/f36-components'
import { CommonProps } from '../../interfaces'

export const TextFields = ({ entry, updateField }: CommonProps) => (
  <>
    <FormControl>
      <FormControl.Label>Min Length</FormControl.Label>
      <TextInput
        testId="minLength"
        onChange={(e) => {
          updateField(e.target.value, 'minLength')
        }}
        defaultValue={`${entry.minLength}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>

    <FormControl>
      <FormControl.Label>Max Length</FormControl.Label>
      <TextInput
        testId="maxLength"
        onChange={(e) => {
          updateField(e.target.value, 'maxLength')
        }}
        defaultValue={`${entry.maxLength}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>
  </>
)
