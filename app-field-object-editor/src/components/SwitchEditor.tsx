import React, { useContext, useEffect, useState } from 'react'
import { EditorTypeValue, FieldActionTypes, SwitchEditorProps } from '../types'
import { Form, Switch, TextInput } from '@contentful/f36-components'
import ChildMainEditor from './ChildMainEditor'
import { FieldContext } from '../context/FieldContext'
import { getValue, setValue } from '../util/set-value'

const SwitchEditor = (props: SwitchEditorProps) => {
  const { value, parentKey } = props
  const { state, dispatch } = useContext(FieldContext)
  const [valueField, setValueField] = useState(getValue({ ...(state.value as object) }, parentKey))

  const HandleDefault = (value: EditorTypeValue) => {
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      return <ChildMainEditor data={value?.value} parentKey={parentKey} />
    }
    return <></>
  }

  useEffect(() => {
    setValueField(getValue({ ...(state.value as object) }, parentKey))
  }, [state])

  switch (value) {
    case 'string':
      return (
        <TextInput
          name={parentKey}
          id={parentKey}
          type="text"
          defaultValue={valueField ?? ''}
          onBlurCapture={(e) => {
            dispatch({
              type: FieldActionTypes.UPDATE_VALUE,
              payload: {
                value: setValue({ ...(state.value as object) }, parentKey, e.currentTarget.value),
              },
            })
          }}
        />
      )
    case 'boolean':
      return (
        <Switch
          name={parentKey}
          id={parentKey}
          defaultChecked={valueField ? true : false}
          onChange={(e) => {
            dispatch({
              type: FieldActionTypes.UPDATE_VALUE,
              payload: {
                value: setValue({ ...(state.value as object) }, parentKey, e.target.checked),
              },
            })
          }}
        />
      )
    case 'number':
      return (
        <TextInput
          name={parentKey}
          id={parentKey}
          type="number"
          defaultValue={valueField}
          onBlurCapture={(e) => {
            dispatch({
              type: FieldActionTypes.UPDATE_VALUE,
              payload: {
                value: setValue({ ...(state.value as object) }, parentKey, e.currentTarget.value),
              },
            })
          }}
        />
      )
    default:
      return <HandleDefault value={value} />
  }
}

export default SwitchEditor
