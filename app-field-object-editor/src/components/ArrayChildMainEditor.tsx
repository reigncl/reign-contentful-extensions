import { Button, Table } from '@contentful/f36-components'
import * as icons from '@contentful/f36-icons'
import { useState } from 'react'
import { EditorTypeValue } from '../types'
import { ChildMainEditorProps } from '../types/child-main-editor'
import SwitchEditor from './SwitchEditor'

const ArrayChildMainEditor = (props: ChildMainEditorProps) => {
const [dataToLoop, setDataToLoop] = useState<any[]>([])
  const { data, parentKey } = props
  const preParentKey = parentKey ? `${parentKey}.` : parentKey
  if (!data) {
    return <>Cargando</>
  }

  const addEditorTable = () => {
    console.log('addEditorTable')
    setDataToLoop([...dataToLoop, {}])
  }

  const EditorTable = ({ idx }: { idx: number }) => {
    return (
      <Table>
        <Table.Body>
          {Object.keys((data as EditorTypeValue[])[0])?.map((key: string, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>
                  <SwitchEditor
                    currentKey={`${key}`}
                    parentKey={`${preParentKey}${key}`}
                    value={((data as EditorTypeValue[])[0] as Record<string, EditorTypeValue>)[key]}
                    index={idx}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  return (
    <>
      {dataToLoop?.map((data, i: number) => (
        <>
          <EditorTable idx={i} />
        </>
      ))}
      <Button size="small" startIcon={<icons.PlusIcon />} variant="primary" onClick={addEditorTable}>
        Add
      </Button>
    </>
  )
}

export default ArrayChildMainEditor
