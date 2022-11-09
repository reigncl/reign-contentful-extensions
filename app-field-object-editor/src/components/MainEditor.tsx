import { EditorTypeValue, MainEditorProps } from '../types'
import SwitchEditor from './SwitchEditor'
import { Box, Form, FormControl, Stack, Table } from '@contentful/f36-components'
import { useContext } from 'react'
import { FieldContext } from '../context/FieldContext'

const MainEditor = (props: MainEditorProps) => {
  const { state } = useContext(FieldContext)
  const { parentKey } = props
  const preParentKey = parentKey ? `${parentKey}.` : parentKey
  if (!state?.structure) {
    return <>Cargando</>
  }
  return (
    <Table>
      <Table.Body>
        {Object.keys(state?.structure)?.map((key: string, index: number) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>
                <SwitchEditor
                  parentKey={`${preParentKey}${key}`}
                  value={(state?.structure as Record<string, EditorTypeValue>)[key]}
                  currentKey={key}
                />
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default MainEditor
