import { useCallback, useState, useEffect } from 'react'
import { AppExtensionSDK } from '@contentful/app-sdk'
import { Heading, Form, Paragraph, Flex, Box, FormControl, TextInput } from '@contentful/f36-components'
import { css } from 'emotion'
import { useSDK } from '@contentful/react-apps-toolkit'

export interface AppInstallationParameters {
  services: string
  validations: string
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    services: '',
    validations: '',
  })

  const sdk = useSDK<AppExtensionSDK>()

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
        setParameters(currentParameters)
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady()
    })()
  }, [sdk])

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>App Config</Heading>
        <Box>
          <FormControl>
            <FormControl.Label>Services</FormControl.Label>
            <Paragraph>Here you can add services to map specific field ids in your inputs.</Paragraph>
            <TextInput
              testId="services"
              onChange={(e) => {
                setParameters({ ...parameters, services: e.target.value })
              }}
              defaultValue={parameters.services}
              value={parameters.services}
              placeholder="aws,hubspot,mailchimp"
              css={{ width: 150 }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Validations</FormControl.Label>
            <Paragraph>Here you can add validation types that your inputs need to consider.</Paragraph>
            <TextInput
              testId="validations"
              onChange={(e) => {
                setParameters({ ...parameters, validations: e.target.value })
              }}
              defaultValue={parameters.validations}
              value={parameters.validations}
              placeholder="Dni,Special Identifier,Rut"
              css={{ width: 150 }}
            />
          </FormControl>
        </Box>
      </Form>
    </Flex>
  )
}

export default ConfigScreen
