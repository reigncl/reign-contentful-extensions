import { AppExtensionSDK } from '@contentful/app-sdk'
import { Checkbox, FormControl, Stack, Switch, TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'
import { CommonEntryEditorProps } from '../../interfaces'
import { NotConfiguredAppNote } from '../../utils'
import { AppInstallationParameters } from '../ConfigScreen'

export const FileFields = ({ entry, updateField }: CommonEntryEditorProps) => {
  const sdk = useSDK<AppExtensionSDK>()

  const handleAllowedExtensionsChange = (extension: string) => {
    if (!entry.allowedFileExtensions.find((value) => value === extension)) {
      updateField([...entry.allowedFileExtensions, extension], 'allowedFileExtensions')
    } else {
      updateField(
        entry.allowedFileExtensions.filter((value) => value !== extension),
        'allowedFileExtensions',
      )
    }
  }

  return (
    <>
      <FormControl>
        <FormControl.Label>Max Upload File Size</FormControl.Label>
        <TextInput
          testId="maxUploadFileSize"
          onChange={(e) => {
            updateField(e.target.value, 'maxUploadFileSize')
          }}
          defaultValue={`${entry.maxUploadFileSize}`}
          css={{ width: 150 }}
          type="number"
        />
      </FormControl>

      <FormControl>
        <Switch
          name="multipleFiles"
          id="multipleFiles"
          isChecked={entry.multipleFiles}
          onChange={() => updateField(!entry.multipleFiles, 'multipleFiles')}
        >
          Is Multiple ?
        </Switch>
      </FormControl>

      <FormControl>
        <FormControl.Label>Allowed File Extensions</FormControl.Label>
        {(sdk.parameters.installation as AppInstallationParameters).fileExtensions ? (
          <Stack flexDirection="row">
            {(sdk.parameters.installation as AppInstallationParameters).fileExtensions.split(',').map((value) => (
              <Checkbox
                name={`${value}Ext`}
                id={`${value}Ext`}
                key={`${value}Ext`}
                isChecked={!!entry.allowedFileExtensions?.find((ext) => ext === value)}
                onChange={() => handleAllowedExtensionsChange(value)}
              >
                {value}
              </Checkbox>
            ))}
          </Stack>
        ) : (
          <NotConfiguredAppNote label="You have not configured file extensions." />
        )}
      </FormControl>
    </>
  )
}
