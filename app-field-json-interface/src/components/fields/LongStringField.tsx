import { Textarea } from '@contentful/f36-components'

interface Props {
  value: string | undefined
  onChange: (value: string) => void
}

const LongStringField = ({ value, onChange }: Props) => (
  <Textarea
    defaultValue={value ?? ''}
    onBlur={e => onChange(e.target.value)}
  />
)

export default LongStringField
