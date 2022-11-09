import React, { useContext } from 'react'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useEffect } from 'react'
import MainEditor from '../components/MainEditor'
import { FieldContext } from '../context/FieldContext'
import { FieldActionTypes } from '../types'
import { deepEqual } from '../util/deep-equal'
import { AppInstallationParameters, ConfigJsonStructureItem } from './ConfigScreen'

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const { state, dispatch } = useContext(FieldContext)

  useEffect(() => {
    sdk.window.startAutoResizer()

    const structure = (sdk.parameters.installation as AppInstallationParameters).items?.find(
      (value: ConfigJsonStructureItem) =>
        value.contentType === sdk.ids.contentType && value.field === sdk.ids.field
    )

    dispatch({
      type: FieldActionTypes.INIT,
      payload: { structure: structure?.json, value: sdk.field.getValue() ?? {} },
    })

    return () => {
      sdk.window.stopAutoResizer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const currentValue = (sdk.field.getValue() as Record<string, unknown>) ?? {}
    if (deepEqual(currentValue, state.value as Record<string, unknown>) === false) {
      sdk.field.setValue(state.value)
    }
  }, [state.value])

  return (
    <>
      <MainEditor parentKey={''} />
    </>
  )
}

export default Field
