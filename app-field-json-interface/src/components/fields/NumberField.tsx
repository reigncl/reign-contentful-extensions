import { TextInput } from '@contentful/f36-components'

interface Props {
  value: number | undefined
  onChange: (value: number) => void
}

const NumberField = ({ value, onChange }: Props) => (
  <TextInput
    type="number"
    defaultValue={value !== undefined ? String(value) : ''}
    onBlur={e => onChange(Number(e.target.value))}
  />
)

export default NumberField
