import React, { useContext, useEffect, useState } from 'react'
import { EditorTypeValue, FieldActionTypes, SwitchEditorProps } from '../types'
import { Switch, Textarea, TextInput } from '@contentful/f36-components'
import ChildMainEditor from './ChildMainEditor'
import { FieldContext } from '../context/FieldContext'
import { getValue, setValue } from '../util/set-value'
import ArrayChildMainEditor from './ArrayChildMainEditor'

const SwitchEditor = (props: SwitchEditorProps) => {
  const { value, currentKey, parentKey, index, prevParentKey } = props
  const { state, dispatch } = useContext(FieldContext)
  const [valueField, setValueField] = useState(null)

  const HandleDefault = (valueDefault: EditorTypeValue) => {
    if (typeof valueDefault === 'object' && Array.isArray(valueDefault?.value)) {
      console.log('ARRAY', JSON.stringify(getValue({ ...(state.value as object) }, parentKey)))
      return <ArrayChildMainEditor data={valueDefault?.value} parentKey={parentKey} />
    }
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      return <ChildMainEditor data={value?.value} parentKey={parentKey} />
    }
    return <></>
  }

  useEffect(() => {
    if (index && prevParentKey) {
      /*console.log('INIT!')
      console.log('useEffect getValue  prevParentKey', prevParentKey)
      console.log('useEffect getValue  index', index)
      console.log('useEffect getValue  currentKey', currentKey)
      console.log('useEffect getValue', getValue({ ...(state.value as object) }, prevParentKey))
      console.log(
        'useEffect getValue index',
        getValue({ ...(state.value as object) }, prevParentKey)[index]
      )*/
      const currentValue = getValue({ ...(state.value as object) }, prevParentKey)[index]
      /*console.log('useEffect getValue  currentValue', currentValue)
      console.log(
        'useEffect getValue  setValueField',
        currentValue && currentValue[currentKey] ? currentValue[currentKey] : null
      )*/
      setValueField(currentValue && currentValue[currentKey] ? currentValue[currentKey] : null)
    } else {
      console.log('MMMMM')
      setValueField(getValue({ ...(state.value as object) }, parentKey))
    }
  }, [state])

  useEffect(() => {
    const cv = getValue({ ...(state.value as object) }, prevParentKey ?? '')
    console.log(`useEffect valueField=${JSON.stringify(valueField)} currentKey=${currentKey} parentKey=${parentKey} prevParentKey=${prevParentKey} index=${index}`)
    console.log(`useEffect valueField=${JSON.stringify(valueField)} currentKey=${currentKey} parentKey=${parentKey} prevParentKey=${prevParentKey} index=${index}`)
    console.log(`useEffect getValue=${JSON.stringify(cv)}`)
    console.log(``)
  }, [valueField])

  console.log(`venga currentKey=${currentKey} valueField=${JSON.stringify(valueField)}`)

  switch (value) {
    case 'string':
      return (
        <>
          {valueField}
          <TextInput
            name={parentKey}
            id={parentKey}
            type="text"
            defaultValue={valueField ?? ''}
            onBlurCapture={(e) => {
              dispatch({
                type: FieldActionTypes.UPDATE_VALUE,
                payload: {
                  value: setValue(
                    { ...(state.value as object) },
                    parentKey,
                    e.currentTarget.value,
                    {
                      index,
                      prevParentKey,
                      key: currentKey,
                    }
                  ),
                },
              })
            }}
          />
        </>
      )
    case 'longstring':
      return (
        <>
          {valueField}
          <Textarea
            name={parentKey}
            id={parentKey}
            defaultValue={valueField ?? ''}
            onBlurCapture={(e) => {
              dispatch({
                type: FieldActionTypes.UPDATE_VALUE,
                payload: {
                  value: setValue(
                    { ...(state.value as object) },
                    parentKey,
                    e.currentTarget.value,
                    {
                      index,
                      prevParentKey,
                      key: currentKey,
                    }
                  ),
                },
              })
            }}
          />
        </>
      )
    case 'boolean':
      return (
        <>
          {valueField ? true : false}
          <Switch
            name={parentKey}
            id={parentKey}
            defaultChecked={valueField ? true : false}
            onChange={(e) => {
              dispatch({
                type: FieldActionTypes.UPDATE_VALUE,
                payload: {
                  value: setValue({ ...(state.value as object) }, parentKey, e.target.checked, {
                    index,
                    prevParentKey,
                    key: currentKey,
                  }),
                },
              })
            }}
          />
        </>
      )
    case 'number':
      return (
        <>
          {valueField}
          <TextInput
            name={parentKey}
            id={parentKey}
            type="number"
            defaultValue={valueField ?? ''}
            onBlurCapture={(e) => {
              dispatch({
                type: FieldActionTypes.UPDATE_VALUE,
                payload: {
                  value: setValue(
                    { ...(state.value as object) },
                    parentKey,
                    parseInt(e.currentTarget.value, 10),
                    {
                      index,
                      prevParentKey,
                      key: currentKey,
                    }
                  ),
                },
              })
            }}
          />
        </>
      )
    default:
      return <HandleDefault value={value} />
  }
}

export default SwitchEditor
