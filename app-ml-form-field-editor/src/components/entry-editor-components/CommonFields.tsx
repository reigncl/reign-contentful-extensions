import { Box, FormControl, Select, Switch, TextInput } from '@contentful/f36-components'
import { MlFormFieldValueType, CommonProps, MlFormFieldType } from '../../interfaces'
import { AssetSelector, ServicesFieldIdsDropdown, ValidationsDropdown } from '.'
import { AppInstallationParameters } from '../ConfigScreen'
import { AppExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { NotConfiguredAppNote } from '../../utils'

export const CommonFields = ({ entry, updateField }: CommonProps) => {
  const sdk = useSDK<AppExtensionSDK>()

  return (
    <>
      <FormControl isRequired>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput
          testId="name"
          onChange={(e) => {
            updateField(e.target.value, 'name')
          }}
          defaultValue={entry.name}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.name.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>ID</FormControl.Label>
        <TextInput
          testId="id"
          onChange={(e) => {
            updateField(e.target.value, 'id')
          }}
          defaultValue={entry.id}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.id.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>Field Name</FormControl.Label>
        <TextInput
          testId="fieldName"
          onChange={(e) => {
            updateField(e.target.value, 'fieldName')
          }}
          defaultValue={entry.fieldName}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.fieldName.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl>
        <FormControl.Label>Placeholder</FormControl.Label>
        <TextInput
          testId="placeholder"
          onChange={(e) => {
            updateField(e.target.value, 'placeholder')
          }}
          defaultValue={entry.placeholder}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.placeholder?.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl>
        <FormControl.Label>Submit form when &quot;enter&quot; key is typed</FormControl.Label>
        <Switch
          name="submitOnEnter"
          id="submitOnEnter"
          isChecked={entry.submitOnEnter}
          onChange={() => updateField(!entry.submitOnEnter, 'submitOnEnter')}
        >
          Submit on Enter ?
        </Switch>
      </FormControl>

      <FormControl>
        <Switch
          name="required"
          id="required"
          isChecked={entry.required}
          onChange={() => updateField(!entry.required, 'required')}
        >
          Is Required ?
        </Switch>
      </FormControl>

      <FormControl>
        <Switch
          name="readonly"
          id="readonly"
          isChecked={entry.readonly}
          onChange={() => updateField(!entry.readonly, 'readonly')}
        >
          Is Readonly ?
        </Switch>
      </FormControl>

      <FormControl>
        <Switch
          name="disabled"
          id="disabled"
          isChecked={entry.disabled}
          onChange={() => updateField(!entry.disabled, 'disabled')}
        >
          Is Disabled ?
        </Switch>
      </FormControl>

      <FormControl>
        <Switch
          name="hidden"
          id="hidden"
          isChecked={entry.hidden}
          onChange={() => updateField(!entry.hidden, 'hidden')}
        >
          Is Hidden ?
        </Switch>
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>Size</FormControl.Label>
        {(sdk.parameters.installation as AppInstallationParameters).sizes ? (
          <Select
            testId="size"
            onChange={(e) => {
              updateField(e.target.value, 'size')
            }}
            defaultValue={entry.size}
          >
            {(sdk.parameters.installation as AppInstallationParameters).sizes.split(',').map((value) => (
              <Select.Option key={value} testId={`${value}Option`} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <NotConfiguredAppNote label="You have not configured input sizes." />
        )}
      </FormControl>

      <FormControl>
        <FormControl.Label>Left Icon</FormControl.Label>
        <Box>
          <AssetSelector entry={entry} updateField={updateField} fieldId="leftIcon" />
        </Box>
      </FormControl>

      <FormControl>
        <FormControl.Label>Right Icon</FormControl.Label>
        <Box>
          <AssetSelector entry={entry} updateField={updateField} fieldId="rightIcon" />
        </Box>
      </FormControl>

      <FormControl>
        <FormControl.Label>Helper Message</FormControl.Label>
        <TextInput
          testId="helperMessage"
          onChange={(e) => {
            updateField(e.target.value, 'helperMessage')
          }}
          defaultValue={entry.helperMessage}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.helperMessage?.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl>
        <FormControl.Label>Default Value</FormControl.Label>
        <TextInput
          testId="defaultValue"
          onChange={(e) => {
            updateField(e.target.value, 'defaultValue')
          }}
          defaultValue={entry.defaultValue}
          css={{ width: 150 }}
        />
        <FormControl.HelpText>{entry.defaultValue?.length} characters</FormControl.HelpText>
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>Value Type (where the field get its value from)</FormControl.Label>
        <Select
          testId="valueType"
          onChange={(e) => {
            updateField(e.target.value, 'valueType')
          }}
          defaultValue={entry.valueType}
        >
          <Select.Option value="">Select an option</Select.Option>
          {Object.values(MlFormFieldValueType).map((value) => (
            <Select.Option key={value} testId={`${value}Option`} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControl.Label>Validations</FormControl.Label>
        {(sdk.parameters.installation as AppInstallationParameters).validations ? (
          <ValidationsDropdown entry={entry} updateField={updateField} />
        ) : (
          <NotConfiguredAppNote label="You have not configured validations." />
        )}
      </FormControl>

      {!Object.keys(entry.validations).length && (
        <FormControl>
          <FormControl.Label>Error Message (used when there are no validations)</FormControl.Label>
          <TextInput
            testId="errorMessage"
            onChange={(e) => {
              updateField(e.target.value, 'errorMessage')
            }}
            defaultValue={entry.errorMessage}
            css={{ width: 150 }}
          />
          <FormControl.HelpText>{entry.errorMessage?.length} characters</FormControl.HelpText>
        </FormControl>
      )}

      <FormControl>
        <FormControl.Label>Services Field Ids</FormControl.Label>
        {(sdk.parameters.installation as AppInstallationParameters).services ? (
          <ServicesFieldIdsDropdown entry={entry} updateField={updateField} />
        ) : (
          <NotConfiguredAppNote label="You have not configured services." />
        )}
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>Type</FormControl.Label>
        <Select
          testId="type"
          onChange={(e) => {
            updateField(e.target.value, 'type')
          }}
          defaultValue={entry.type}
        >
          {Object.values(MlFormFieldType).map((value) => (
            <Select.Option key={value} testId={`${value}Option`} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
