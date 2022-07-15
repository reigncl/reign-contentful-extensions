import { useCallback, useState, useEffect } from 'react'
import { AppExtensionSDK } from '@contentful/app-sdk'
import { Heading, Form, Flex, Box } from '@contentful/f36-components'
import { css } from 'emotion'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { MlFormFieldDefaultKeys } from '../interfaces'
import { ContentFields, ContentTypeProps, KeyValueMap } from 'contentful-management'
import { ConfigInput } from './config-screen-components'
import { FieldIdsMapping } from './config-screen-components/FieldIdsMapping'

export interface AppInstallationParameters {
  services: string
  validations: string
  sizes: string
  fileExtensions: string
  fieldIds: Record<MlFormFieldDefaultKeys, string>
  contentType?: ContentTypeProps
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    services: '',
    validations: '',
    sizes: '',
    fileExtensions: '',
    fieldIds: Object.values(MlFormFieldDefaultKeys).reduce(
      (prevValue, nextValue) => ({
        ...prevValue,
        [nextValue]: '',
      }),
      {} as AppInstallationParameters['fieldIds'],
    ),
    contentType: undefined,
  })
  const [contentTypes, setContentTypes] = useState<ContentTypeProps[]>()
  const [availableContentTypes, setAvailableContentTypes] = useState<ContentTypeProps[]>()

  const [availableFields, setAvailableFields] = useState<ContentFields<KeyValueMap>[]>()

  const sdk = useSDK<AppExtensionSDK>()
  const cma = useCMA()

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState()
    return {
      parameters,
      targetState: currentState,
    }
  }, [parameters, sdk])

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure())
  }, [sdk, onConfigure])

  useEffect(() => {
    ;(async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters()

      if (currentParameters) {
        const contentTypes = await cma.contentType.getMany({
          spaceId: sdk.ids.space,
          environmentId: sdk.ids.environment,
        })
        let availableContentTypes = contentTypes.items

        if (currentParameters.contentType) {
          // Retrieve content type again just in case that fields has changed.

          const currentSelectedContentType = contentTypes.items.find(
            (c) => c.sys.id === currentParameters.contentType!.sys.id,
          )

          const customFieldIds = Object.values(currentParameters.fieldIds)
          const fields = currentSelectedContentType!.fields.filter(
            (field) => !customFieldIds.find((customFieldId) => field.id === customFieldId),
          )
          setAvailableFields(fields)

          availableContentTypes = availableContentTypes.filter(
            (c) => c.sys.id !== currentParameters.contentType?.sys.id,
          )
        }
        setContentTypes(contentTypes.items)
        setAvailableContentTypes(availableContentTypes)
        setParameters(currentParameters)
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady()
    })()
  }, [sdk])

  return (
    <Flex justifyItems="center" fullWidth>
      <Flex flexDirection="column" className={css({ margin: '80px auto', width: '800px' })}>
        <Form>
          <Heading>App Config</Heading>
          <Box>
            <ConfigInput
              parameters={parameters}
              setParameters={setParameters}
              label="Services"
              paragraph="Here you can add services to map specific field ids in your inputs."
              id="services"
              placeholder="aws,hubspot,mailchimp"
            />
            <ConfigInput
              parameters={parameters}
              setParameters={setParameters}
              label="Validations"
              paragraph="Here you can add validation types that your inputs need to consider."
              id="validations"
              placeholder="Dni,Special Identifier,Rut"
            />
            <ConfigInput
              parameters={parameters}
              setParameters={setParameters}
              label="Sizes"
              paragraph="Here you can add the sizes your input has to support."
              id="sizes"
              placeholder="small,medium,large"
            />
            <ConfigInput
              parameters={parameters}
              setParameters={setParameters}
              label="File Extensions"
              paragraph="Here you can add the file extensions that you want to give support."
              id="fileExtensions"
              placeholder="zip,xls,doc,docx,pdf,jpg,jpeg"
            />
            <FieldIdsMapping
              parameters={parameters}
              setParameters={setParameters}
              availableFields={availableFields}
              setAvailableFields={setAvailableFields}
              contentTypes={contentTypes}
              availableContentTypes={availableContentTypes}
              setAvailableContentTypes={setAvailableContentTypes}
            />
          </Box>
        </Form>
      </Flex>
    </Flex>
  )
}

export default ConfigScreen
