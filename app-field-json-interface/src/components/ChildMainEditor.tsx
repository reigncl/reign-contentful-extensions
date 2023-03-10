import { Table } from '@contentful/f36-components'
import { EditorTypeValue } from '../types'
import { ChildMainEditorProps } from '../types/child-main-editor'
import SwitchEditor from './SwitchEditor'

const ChildMainEditor = (props: ChildMainEditorProps) => {
  const { value, structure, handleUpdate, parentKey } = props
  if (!structure) {
    return <>Cargando</>
  }
  return (
    <Table>
      <Table.Body>
        {Object.keys(structure)?.map((key: string, index: number) => {
          return (
            <Table.Row key={index}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>
                <SwitchEditor
                  parentKey={`${parentKey}`}
                  currentKey={`${key}`}
                  value={value}
                  handleUpdate={handleUpdate}
                  structure={(structure as Record<string, EditorTypeValue>)[key]}
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
