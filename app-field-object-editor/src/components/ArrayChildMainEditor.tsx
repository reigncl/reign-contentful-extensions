import { Button, Table } from '@contentful/f36-components'
import * as icons from '@contentful/f36-icons'
import { useContext, useEffect, useState } from 'react'
import { FieldContext } from '../context/FieldContext'
import { EditorTypeValue } from '../types'
import { ChildMainEditorProps } from '../types/child-main-editor'
import { getValue } from '../util/set-value'
import SwitchEditor from './SwitchEditor'

const ArrayChildMainEditor = (props: ChildMainEditorProps) => {
  const { data, parentKey } = props
  const [dataToLoop, setDataToLoop] = useState<any[]>([])
  const { state, dispatch } = useContext(FieldContext)
  const preParentKey = parentKey ? `${parentKey}.` : parentKey

  const addEditorTable = () => {
    setDataToLoop([...dataToLoop ?? [], {}])
  }

  const removeEditorTable = (TableIndex: number) => {
    const dataToLoopFiltered = dataToLoop?.filter((value: any, i: number) => i !== TableIndex)
    setDataToLoop(dataToLoopFiltered)
  }

  useEffect(() => {
    setDataToLoop(getValue({ ...(state.value as object) }, parentKey) ?? [])
  }, [state])

  if (!data) {
    return <>Cargando</>
  }

  const EditorTable = ({ idx }: { idx: number }) => {
    return (
      <>
        <Table>
          <Table.Body>
            <Table.Row key={idx}>
              <Table.Cell>#{idx} </Table.Cell>
              <Table.Cell>
                <Table>
                  <Table.Body>
                    {Object.keys((data as EditorTypeValue[])[0])?.map(
                      (key: string, index: number) => {
                        return (
                          <Table.Row key={index}>
                            <Table.Cell>{key}</Table.Cell>
                            <Table.Cell>
                              <SwitchEditor
                                currentKey={`${key}`}
                                parentKey={`${preParentKey}${key}`}
                                prevParentKey={parentKey}
                                value={
                                  (
                                    (data as EditorTypeValue[])[0] as Record<
                                      string,
                                      EditorTypeValue
                                    >
                                  )[key]
                                }
                                index={idx}
                              />
                            </Table.Cell>
                          </Table.Row>
                        )
                      }
                    )}
                  </Table.Body>
                </Table>
              </Table.Cell>
              <Table.Cell>
                <span style={{ cursor: 'pointer' }} onClick={() => removeEditorTable(idx)}>
                  <icons.CloseTrimmedIcon variant="negative" />
                </span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    )
  }

  return (
    <>
      {dataToLoop?.map((data, i: number) => (
        <EditorTable key={i} idx={i} />
      ))}
      <hr color="#E7EBEE" />
      <Button
        size="small"
        startIcon={<icons.PlusIcon />}
        variant="primary"
        onClick={addEditorTable}
      >
        Add
      </Button>
    </>
  )
}

export default ArrayChildMainEditor
