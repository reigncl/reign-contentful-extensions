import { useMemo } from 'react'
import { locations } from '@contentful/app-sdk'
import ConfigScreen from './components/ConfigScreen'
import EntryEditor from './components/EntryEditor'
import { useSDK } from '@contentful/react-apps-toolkit'
import './styles/index.css'

const ComponentLocationSettings = {
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_ENTRY_EDITOR]: EntryEditor,
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

  return Component ? <Component /> : null
}

export default App
