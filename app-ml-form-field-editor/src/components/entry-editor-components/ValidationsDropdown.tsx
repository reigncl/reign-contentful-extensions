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
import { CommonProps, MlFormFieldValidations } from '../../interfaces'
import { isRegex } from '../../utils'
import { AppInstallationParameters } from '../ConfigScreen'

export const ValidationsDropdown = ({ entry, updateField }: CommonProps) => {
  const sdk = useSDK<AppExtensionSDK>()

  const validationsQty = Object.values(entry.validations).length
  const availableValidations = Object.values<string>(MlFormFieldValidations)
    .concat((sdk.parameters.installation as AppInstallationParameters).validations.split(','))
    .filter((val) => {
      return !Object.keys(entry.validations).find((valName) => valName === val)
    })

  return (
    <div>
      <Menu>
        <Menu.Trigger>
          <Button
            isDisabled={availableValidations.length === 0}
            size="small"
            variant="secondary"
            endIcon={<ChevronDownIcon />}
          >
            Select validation
          </Button>
        </Menu.Trigger>
        {availableValidations.length > 0 && (
          <Menu.List>
            {availableValidations.map((validation, index) => {
              return (
                <Menu.Item
                  key={`${validation}-item-${index}`}
                  onClick={() => {
                    updateField(
                      { ...entry.validations, [validation]: { pattern: '', errorMessage: '' } },
                      'validations',
                    )
                  }}
                >
                  {validation}
                </Menu.Item>
              )
            })}
          </Menu.List>
        )}
      </Menu>
      <div style={{ paddingTop: '10px' }}>
        {validationsQty === 0 && <Note variant="warning">There are no configured validations.</Note>}
        {validationsQty > 0 && (
          <Table style={{ maxWidth: '600px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Pattern</TableCell>
                <TableCell>Custom Error Message</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(entry.validations).map(([validationKey, validationValues], index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={{ verticalAlign: 'middle' }}>{validationKey}</TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }}>
                      {validationKey === MlFormFieldValidations.CUSTOM && (
                        <TextInput
                          onChange={(event) => {
                            entry.validations[validationKey as MlFormFieldValidations].pattern = event.target.value
                            updateField(entry.validations, 'validations')
                          }}
                          isInvalid={
                            validationKey === MlFormFieldValidations.CUSTOM
                              ? !isRegex(entry.validations[validationKey as MlFormFieldValidations].pattern)
                              : false
                          }
                          value={validationValues.pattern}
                        />
                      )}
                      {!isRegex(entry.validations[validationKey as MlFormFieldValidations].pattern) && (
                        <span style={{ color: 'rgb(189, 0, 42)', display: 'inline' }}>
                          You have to enter a valid regex
                        </span>
                      )}
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }}>
                      <TextInput
                        onChange={(event) => {
                          entry.validations[validationKey as MlFormFieldValidations].errorMessage = event.target.value
                          updateField(entry.validations, 'validations')
                        }}
                        value={validationValues.errorMessage}
                      />
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }}>
                      <IconButton
                        variant="negative"
                        size="small"
                        aria-label={`Delete ${validationKey} validation`}
                        icon={<CloseIcon />}
                        onClick={() => {
                          delete entry.validations[validationKey as MlFormFieldValidations]
                          updateField(entry.validations, 'validations')
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
