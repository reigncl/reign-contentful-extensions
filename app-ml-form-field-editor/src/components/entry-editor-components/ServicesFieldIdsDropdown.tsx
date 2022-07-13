import { AppExtensionSDK } from '@contentful/app-sdk'
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextInput,
  Note,
  Menu,
} from '@contentful/f36-components'
import { ChevronDownIcon, CloseIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'
import { CommonProps } from '../../interfaces'
import { AppInstallationParameters } from '../ConfigScreen'

export const ServicesFieldIdsDropdown = ({ entry, updateField }: CommonProps) => {
  const sdk = useSDK<AppExtensionSDK>()

  const servicesQty = Object.values(entry.servicesFieldIds).length
  const availableServices = (sdk.parameters.installation as AppInstallationParameters).services
    .split(',')
    .filter((service) => {
      return !Object.keys(entry.servicesFieldIds).find((serviceName) => serviceName === service)
    })

  return (
    <div>
      <Menu>
        <Menu.Trigger>
          <Button
            isDisabled={availableServices.length === 0}
            size="small"
            variant="secondary"
            endIcon={<ChevronDownIcon />}
          >
            Select service
          </Button>
        </Menu.Trigger>
        {availableServices.length > 0 && (
          <Menu.List>
            {availableServices.map((service, index) => {
              return (
                <Menu.Item
                  key={`${service}-item-${index}`}
                  onClick={() => {
                    updateField({ ...entry.servicesFieldIds, [service]: '' }, 'servicesFieldIds')
                  }}
                >
                  {service}
                </Menu.Item>
              )
            })}
          </Menu.List>
        )}
      </Menu>
      <div style={{ paddingTop: '10px' }}>
        {servicesQty === 0 && <Note variant="warning">There are no configured services.</Note>}
        {servicesQty > 0 && (
          <Table style={{ maxWidth: '600px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Field Id</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(entry.servicesFieldIds).map(([serviceKey, fieldId], index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={{ verticalAlign: 'middle' }}>{serviceKey}</TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }}>
                      <TextInput
                        onChange={(event) => {
                          entry.servicesFieldIds[serviceKey] = event.target.value
                          updateField(entry.servicesFieldIds, 'servicesFieldIds')
                        }}
                        value={fieldId}
                      />
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }}>
                      <IconButton
                        variant="negative"
                        size="small"
                        aria-label={`Delete ${serviceKey} config`}
                        icon={<CloseIcon />}
                        onClick={() => {
                          delete entry.servicesFieldIds[serviceKey]
                          updateField(entry.servicesFieldIds, 'servicesFieldIds')
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
