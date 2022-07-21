import { EditorExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useEffect, useMemo, useState } from 'react'
import { MlFormField, MlFormFieldType, MlFormFieldValueType } from '../interfaces'
import { NotConfiguredAppNote } from '../utils'
import { AppInstallationParameters } from './ConfigScreen'
import {
  CommonFields,
  FileFields,
  NumberFields,
  SelectFields,
  TextAreaFields,
  TextFields,
} from './entry-editor-components'

const Entry = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const parameters = useMemo(() => sdk.parameters.installation as AppInstallationParameters, [sdk])
  const [isAppConfigured, setIsAppConfigured] = useState(false)

  const [entry, setEntry] = useState<MlFormField>({
    name: '',
    id: '',
    fieldName: '',
    placeholder: '',
    required: true,
    errorMessage: '',
    helperMessage: '',
    type: MlFormFieldType.TEXT,
    options: [],
    pattern: '',
    min: 0,
    max: 0,
    minLength: 0,
    maxLength: 0,
    defaultValue: '',
    readonly: false,
    disabled: false,
    submitOnEnter: false,
    size: '',
    valueType: MlFormFieldValueType.VALUE,
    hidden: false,
    columns: 0,
    rows: 0,
    maxUploadFileSize: 0,
    multipleFiles: false,
    allowedFileExtensions: [],
    servicesFieldIds: {},
    leftIcon: undefined,
    rightIcon: undefined,
    validations: {},
  })

  const updateField = (newField: unknown, fieldKey: keyof MlFormField) => {
    sdk.entry.fields[fieldKey].setValue(newField)

    setEntry({
      ...entry,
      [fieldKey]: newField,
    })
  }

  useEffect(() => {
    ;(async () => {
      if (parameters.contentType) {
        const defaultFieldIds = Object.keys(parameters.fieldIds)
        const hasFieldIdsCorrectlyMapped = parameters.contentType.fields.every((field) =>
          defaultFieldIds.find((defaultFieldId) => field.id === defaultFieldId),
        )
        setIsAppConfigured(hasFieldIdsCorrectlyMapped)

        if (hasFieldIdsCorrectlyMapped)
          setEntry({
            name: sdk.entry.fields[parameters.fieldIds.name || 'name'].getValue() || '',
            id: sdk.entry.fields[parameters.fieldIds.id || 'id'].getValue() || '',
            fieldName: sdk.entry.fields[parameters.fieldIds.fieldName || 'fieldName'].getValue() || '',
            placeholder: sdk.entry.fields[parameters.fieldIds.placeholder || 'placeholder'].getValue() || '',
            required: sdk.entry.fields[parameters.fieldIds.required || 'required'].getValue() || true,
            errorMessage: sdk.entry.fields[parameters.fieldIds.errorMessage || 'errorMessage'].getValue() || '',
            helperMessage: sdk.entry.fields[parameters.fieldIds.helperMessage || 'helperMessage'].getValue() || '',
            type: sdk.entry.fields[parameters.fieldIds.type || 'type'].getValue() || MlFormFieldType.TEXT,
            options: sdk.entry.fields[parameters.fieldIds.options || 'options'].getValue() || [],
            pattern: sdk.entry.fields[parameters.fieldIds.pattern || 'pattern'].getValue() || '',
            min: sdk.entry.fields[parameters.fieldIds.min || 'min'].getValue() || 0,
            max: sdk.entry.fields[parameters.fieldIds.max || 'max'].getValue() || 0,
            minLength: sdk.entry.fields[parameters.fieldIds.minLength || 'minLength'].getValue() || 0,
            maxLength: sdk.entry.fields[parameters.fieldIds.maxLength || 'maxLength'].getValue() || 0,
            defaultValue: sdk.entry.fields[parameters.fieldIds.defaultValue || 'defaultValue'].getValue() || '',
            readonly: sdk.entry.fields[parameters.fieldIds.readonly || 'readonly'].getValue() || false,
            disabled: sdk.entry.fields[parameters.fieldIds.disabled || 'disabled'].getValue() || false,
            submitOnEnter: sdk.entry.fields[parameters.fieldIds.submitOnEnter || 'submitOnEnter'].getValue() || false,
            size: sdk.entry.fields[parameters.fieldIds.size || 'size'].getValue() || '',
            valueType: sdk.entry.fields[parameters.fieldIds.valueType || 'valueType'].getValue() || '',
            hidden: sdk.entry.fields[parameters.fieldIds.hidden || 'hidden'].getValue() || false,
            columns: sdk.entry.fields[parameters.fieldIds.columns || 'columns'].getValue() || 0,
            rows: sdk.entry.fields[parameters.fieldIds.rows || 'rows'].getValue() || 0,
            maxUploadFileSize:
              sdk.entry.fields[parameters.fieldIds.maxUploadFileSize || 'maxUploadFileSize'].getValue() || 0,
            multipleFiles: sdk.entry.fields[parameters.fieldIds.multipleFiles || 'multipleFiles'].getValue() || false,
            allowedFileExtensions:
              sdk.entry.fields[parameters.fieldIds.allowedFileExtensions || 'allowedFileExtensions'].getValue() || [],
            servicesFieldIds:
              sdk.entry.fields[parameters.fieldIds.servicesFieldIds || 'servicesFieldIds'].getValue() || {},
            leftIcon: sdk.entry.fields[parameters.fieldIds.leftIcon || 'leftIcon'].getValue() || undefined,
            rightIcon: sdk.entry.fields[parameters.fieldIds.rightIcon || 'rightIcon'].getValue() || undefined,
            validations: sdk.entry.fields[parameters.fieldIds.validations || 'validations'].getValue() || {},
          })
      }
    })()
  })

  return (
    <>
      <div className="entry-container">
        {!isAppConfigured && (
          <NotConfiguredAppNote label="You have not selected the Content Type or some of your field IDs are not the same as the default ones." />
        )}

        {isAppConfigured && (
          <>
            <CommonFields entry={entry} updateField={updateField} />

            {entry.type === 'textarea' && <TextAreaFields entry={entry} updateField={updateField} />}

            {['text', 'password'].includes(entry.type) && <TextFields entry={entry} updateField={updateField} />}

            {['number', 'range'].includes(entry.type) && <NumberFields entry={entry} updateField={updateField} />}

            {entry.type === 'file' && <FileFields entry={entry} updateField={updateField} />}

            {entry.type === 'select' && (
              <SelectFields level={0} options={entry.options} entry={entry} updateField={updateField} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Entry
