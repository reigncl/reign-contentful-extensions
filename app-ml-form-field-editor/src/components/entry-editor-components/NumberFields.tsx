import { FormControl, TextInput } from '@contentful/f36-components'
import { CommonProps } from '../../interfaces'

export const NumberFields = ({ entry, updateField }: CommonProps) => (
  <>
    <FormControl>
      <FormControl.Label>Minimum Value</FormControl.Label>
      <TextInput
        testId="min"
        onChange={(e) => {
          updateField(e.target.value, 'min')
        }}
        defaultValue={`${entry.min}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>

    <FormControl>
      <FormControl.Label>Maximum Value</FormControl.Label>
      <TextInput
        testId="max"
        onChange={(e) => {
          updateField(e.target.value, 'max')
        }}
        defaultValue={`${entry.max}`}
        css={{ width: 150 }}
        type="number"
      />
    </FormControl>
  </>
)
