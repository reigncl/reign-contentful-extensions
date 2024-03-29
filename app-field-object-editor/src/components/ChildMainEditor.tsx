import { Table } from '@contentful/f36-components'
import { EditorTypeValue } from '../types'
import { ChildMainEditorProps } from '../types/child-main-editor'
import SwitchEditor from './SwitchEditor'

const ChildMainEditor = (props: ChildMainEditorProps) => {
  const { data, parentKey } = props
  const preParentKey = parentKey ? `${parentKey}.` : parentKey
  if (!data) {
    return <>Cargando</>
  }
  return (
    <Table>
      <Table.Body>
        {Object.keys(data)?.map((key: string, index: number) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>
                <SwitchEditor
                  currentKey={`${key}`}
                  parentKey={`${preParentKey}${key}`}
                  value={(props?.data as Record<string, EditorTypeValue>)[key]}
                />
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default ChildMainEditor
