import { AppExtensionSDK } from '@contentful/app-sdk'
import { Note } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

export const NotConfiguredAppNote = ({ label }: { label: string }) => {
  const sdk = useSDK<AppExtensionSDK>()
  const appEnvironmentUri = sdk.ids.environment !== 'master' ? `/environments/${sdk.ids.environment}` : ''
  const appSetupUri = `https://app.contentful.com/spaces/${sdk.ids.space}${appEnvironmentUri}/apps/${sdk.ids.app}`

  return (
    <Note variant="warning">
      {label} Please complete the app setup{' '}
      <a href={appSetupUri} target="_blank" rel="noreferrer">
        <strong>here</strong>
      </a>
      .
    </Note>
  )
}
