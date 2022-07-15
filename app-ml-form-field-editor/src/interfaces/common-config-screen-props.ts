import { Dispatch, SetStateAction } from 'react'
import { AppInstallationParameters } from '../components/ConfigScreen'

export type CommonConfigScreenProps = {
  parameters: AppInstallationParameters
  setParameters: Dispatch<SetStateAction<AppInstallationParameters>>
}
