import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextInput,
  Note,
  FormControl,
  Flex,
  Modal,
} from '@contentful/f36-components'
import { PlusIcon, CloseIcon, EditIcon } from '@contentful/f36-icons'
import { useState } from 'react'
import { CommonEntryEditorProps, MlFormField } from '../../interfaces'

export type SelectFieldsProps = CommonEntryEditorProps & {
  options: MlFormField['options']
  level: number
}

export const SelectFields = ({ level, options, entry, updateField }: SelectFieldsProps) => {
  const [optionsQty, setOptionsQty] = useState(Object.values(options).length)
  const [showChildrenModal, setShowChildrenModal] = useState(false)
  const [optionIndexSelected, setOptionIndexSelected] = useState<number>()

  return (
    <>
      <FormControl>
        <FormControl.Label>Options</FormControl.Label>
        <div>
          <Button
            size="small"
            variant="secondary"
            endIcon={<PlusIcon />}
            onClick={() => {
              options[optionsQty] = {
                label: '',
                value: '',
                children: undefined,
              }
              updateField(entry.options, 'options')
              setOptionsQty((prevValue) => prevValue + 1)
            }}
          >
            Add option
          </Button>
          <div style={{ paddingTop: '10px' }}>
            {optionsQty === 0 && <Note variant="warning">There are no options.</Note>}
            {optionsQty > 0 && (
              <Table style={{ maxWidth: '600px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Label</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Children</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {options.map((option, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ verticalAlign: 'middle' }}>
                          <TextInput
                            onChange={(event) => {
                              options[index].label = event.target.value
                              updateField(entry.options, 'options')
                            }}
                            value={option.label}
                          />
                        </TableCell>
                        <TableCell style={{ verticalAlign: 'middle' }}>
                          <TextInput
                            onChange={(event) => {
                              options[index].value = event.target.value
                              updateField(entry.options, 'options')
                            }}
                            value={option.value}
                          />
                        </TableCell>
                        <TableCell style={{ verticalAlign: 'middle' }}>
                          {level < 2 ? (
                            options[index].children ? (
                              <Flex flexDirection="row" gap="8px">
                                <IconButton
                                  aria-label="edit"
                                  size="small"
                                  variant="secondary"
                                  icon={<EditIcon />}
                                  onClick={() => {
                                    setOptionIndexSelected(index)
                                    setShowChildrenModal(true)
                                  }}
                                />
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  variant="negative"
                                  icon={<CloseIcon />}
                                  onClick={() => {
                                    options[index].children = undefined
                                    updateField(entry.options, 'options')
                                  }}
                                />
                              </Flex>
                            ) : (
                              <IconButton
                                aria-label="add"
                                size="small"
                                variant="positive"
                                icon={<PlusIcon />}
                                onClick={() => {
                                  options[index].children = []
                                  updateField(entry.options, 'options')
                                }}
                              />
                            )
                          ) : null}
                        </TableCell>
                        <TableCell style={{ verticalAlign: 'middle' }}>
                          <IconButton
                            variant="negative"
                            size="small"
                            aria-label={`Delete ${index} option`}
                            icon={<CloseIcon />}
                            onClick={() => {
                              options.splice(index, 1)
                              setOptionsQty((prevValue) => prevValue - 1)
                              updateField(entry.options, 'options')
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </FormControl>
      {optionIndexSelected !== undefined && options[optionIndexSelected]?.children !== undefined && (
        <Modal onClose={() => setShowChildrenModal(false)} isShown={showChildrenModal}>
          {() => (
            <>
              <Modal.Header title="Modal title" onClose={() => setShowChildrenModal(false)} />
              <Modal.Content>
                <SelectFields
                  level={level + 1}
                  entry={entry}
                  options={options[optionIndexSelected].children}
                  updateField={updateField}
                />
              </Modal.Content>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
