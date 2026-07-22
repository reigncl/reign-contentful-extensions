import { TextInput } from '@contentful/f36-components'

interface Props {
  value: string | undefined
  onChange: (value: string) => void
}

const StringField = ({ value, onChange }: Props) => (
  <TextInput
    defaultValue={value ?? ''}
    onBlur={e => onChange(e.target.value)}
  />
)

export default StringField
