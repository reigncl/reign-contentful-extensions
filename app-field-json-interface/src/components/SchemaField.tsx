import { Schema } from '../types'
import ArrayField from './ArrayField'
import SchemaEditor from './SchemaEditor'
import BooleanField from './fields/BooleanField'
import LongStringField from './fields/LongStringField'
import NumberField from './fields/NumberField'
import StringField from './fields/StringField'

interface Props {
  schema: Schema
  value: any
  onChange: (value: any) => void
}

const SchemaField = ({ schema, value, onChange }: Props) => {
  if (schema === 'string') return <StringField value={value} onChange={onChange} />
  if (schema === 'longstring') return <LongStringField value={value} onChange={onChange} />
  if (schema === 'number') return <NumberField value={value} onChange={onChange} />
  if (schema === 'boolean') return <BooleanField value={value} onChange={onChange} />

  if (Array.isArray(schema)) {
    return <ArrayField itemSchema={schema[0]} value={value ?? []} onChange={onChange} />
  }

  if (typeof schema === 'object') {
    return <SchemaEditor schema={schema} initialValue={value ?? {}} onChange={onChange} />
  }

  return null
}

export default SchemaField
