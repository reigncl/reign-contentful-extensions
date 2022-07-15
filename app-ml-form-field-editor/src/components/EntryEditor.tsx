import { EditorExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useMemo, useState } from 'react'
import { MlFormField, MlFormFieldType } from '../interfaces'
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
  const fieldIds = useMemo(() => (sdk.parameters.installation as AppInstallationParameters).fieldIds, [sdk])

  const [entry, setEntry] = useState<MlFormField>({
    name: sdk.entry.fields[fieldIds.name ?? 'name'].getValue() || '',
    id: sdk.entry.fields[fieldIds.id ?? 'id'].getValue() || '',
    fieldName: sdk.entry.fields[fieldIds.fieldName ?? 'fieldName'].getValue() || '',
    placeholder: sdk.entry.fields[fieldIds.placeholder ?? 'placeholder'].getValue() || '',
    required: sdk.entry.fields[fieldIds.required ?? 'required'].getValue() || true,
    errorMessage: sdk.entry.fields[fieldIds.errorMessage ?? 'errorMessage'].getValue() || '',
    helperMessage: sdk.entry.fields[fieldIds.helperMessage ?? 'helperMessage'].getValue() || '',
    type: sdk.entry.fields[fieldIds.type ?? 'type'].getValue() || MlFormFieldType.TEXT,
    options: sdk.entry.fields[fieldIds.options ?? 'options'].getValue() || [],
    pattern: sdk.entry.fields[fieldIds.pattern ?? 'pattern'].getValue() || '',
    min: sdk.entry.fields[fieldIds.min ?? 'min'].getValue() || 0,
    max: sdk.entry.fields[fieldIds.max ?? 'max'].getValue() || 0,
    minLength: sdk.entry.fields[fieldIds.minLength ?? 'minLength'].getValue() || 0,
    maxLength: sdk.entry.fields[fieldIds.maxLength ?? 'maxLength'].getValue() || 0,
    defaultValue: sdk.entry.fields[fieldIds.defaultValue ?? 'defaultValue'].getValue() || '',
    readonly: sdk.entry.fields[fieldIds.readonly ?? 'readonly'].getValue() || false,
    disabled: sdk.entry.fields[fieldIds.disabled ?? 'disabled'].getValue() || false,
    submitOnEnter: sdk.entry.fields[fieldIds.submitOnEnter ?? 'submitOnEnter'].getValue() || false,
    size: sdk.entry.fields[fieldIds.size ?? 'size'].getValue() || '',
    valueType: sdk.entry.fields[fieldIds.valueType ?? 'valueType'].getValue() || '',
    hidden: sdk.entry.fields[fieldIds.hidden ?? 'hidden'].getValue() || false,
    columns: sdk.entry.fields[fieldIds.columns ?? 'columns'].getValue() || 0,
    rows: sdk.entry.fields[fieldIds.rows ?? 'rows'].getValue() || 0,
    maxUploadFileSize: sdk.entry.fields[fieldIds.maxUploadFileSize ?? 'maxUploadFileSize'].getValue() || 0,
    multipleFiles: sdk.entry.fields[fieldIds.multipleFiles ?? 'multipleFiles'].getValue() || false,
    allowedFileExtensions: sdk.entry.fields[fieldIds.allowedFileExtensions ?? 'allowedFileExtensions'].getValue() || [],
    servicesFieldIds: sdk.entry.fields[fieldIds.servicesFieldIds ?? 'servicesFieldIds'].getValue() || {},
    leftIcon: sdk.entry.fields[fieldIds.leftIcon ?? 'leftIcon'].getValue() || undefined,
    rightIcon: sdk.entry.fields[fieldIds.rightIcon ?? 'rightIcon'].getValue() || undefined,
    validations: sdk.entry.fields[fieldIds.validations ?? 'validations'].getValue() || {},
  })

  const updateField = (newField: unknown, fieldKey: keyof MlFormField) => {
    sdk.entry.fields[fieldKey].setValue(newField)
    console.log(newField)

    setEntry({
      ...entry,
      [fieldKey]: newField,
    })
  }

  return (
    <>
      <div className="entry-container">
        <CommonFields entry={entry} updateField={updateField} />

        {entry.type === 'textarea' && <TextAreaFields entry={entry} updateField={updateField} />}

        {['text', 'password'].includes(entry.type) && <TextFields entry={entry} updateField={updateField} />}

        {['number', 'range'].includes(entry.type) && <NumberFields entry={entry} updateField={updateField} />}

        {entry.type === 'file' && <FileFields entry={entry} updateField={updateField} />}

        {entry.type === 'select' && (
          <SelectFields level={0} options={entry.options} entry={entry} updateField={updateField} />
        )}
      </div>
    </>
  )
}

export default Entry
