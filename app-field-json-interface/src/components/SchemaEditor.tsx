import { Table } from '@contentful/f36-components'
import { useState } from 'react'
import { ObjectSchema } from '../types'
import SchemaField from './SchemaField'

interface Props {
  schema: ObjectSchema
  initialValue: Record<string, any>
  onChange: (value: Record<string, any>) => void
}

const SchemaEditor = ({ schema, initialValue, onChange }: Props) => {
  const [value, setValue] = useState<Record<string, any>>(initialValue ?? {})

  const handleFieldChange = (key: string, fieldValue: any) => {
    const next = { ...value, [key]: fieldValue }
    setValue(next)
    onChange(next)
  }

  return (
    <Table>
      <Table.Body>
        {Object.entries(schema).map(([key, fieldSchema]) => (
          <Table.Row key={key}>
            <Table.Cell style={{ width: 160, whiteSpace: 'nowrap' }}>{key}</Table.Cell>
            <Table.Cell>
              <SchemaField
                schema={fieldSchema}
                value={value[key]}
                onChange={fieldValue => handleFieldChange(key, fieldValue)}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default SchemaEditor
