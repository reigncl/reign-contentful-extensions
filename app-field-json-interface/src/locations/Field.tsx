import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useEffect, useMemo } from 'react'
import SchemaEditor from '../components/SchemaEditor'
import { InstallationParams, ObjectSchema } from '../types'

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => sdk.window.stopAutoResizer()
  }, [sdk.window])

  const schema = useMemo<ObjectSchema | undefined>(() => {
    const params = sdk.parameters.installation as InstallationParams
    return params.items?.find(
      item => item.contentType === sdk.ids.contentType && item.field === sdk.ids.field
    )?.json
  }, [sdk.parameters.installation, sdk.ids.contentType, sdk.ids.field])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => sdk.field.getValue() ?? {}, [])

  if (!schema) return null

  return (
    <SchemaEditor
      schema={schema}
      initialValue={initialValue}
      onChange={value => sdk.field.setValue(value)}
    />
  )
}

export default Field
