import React, { useMemo } from 'react'
import { locations } from '@contentful/app-sdk'
import ConfigScreen from './locations/ConfigScreen'
import Field from './locations/Field'
import Dialog from './locations/Dialog'
import { useSDK } from '@contentful/react-apps-toolkit'
import { FieldProvider } from './context/FieldProvider'

const ComponentLocationSettings = {
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_ENTRY_FIELD]: Field,
  [locations.LOCATION_DIALOG]: Dialog,
}

const App = () => {
  const sdk = useSDK()

  const Component = useMemo(() => {
    for (const [location, component] of Object.entries(ComponentLocationSettings)) {
      if (sdk.location.is(location)) {
        return component
      }
    }
  }, [sdk.location])

  return Component ? (
    <FieldProvider>
      <Component />
    </FieldProvider>
  ) : null
}

export default App
