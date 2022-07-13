import { EditorExtensionSDK } from '@contentful/app-sdk'
import { useSDK } from '@contentful/react-apps-toolkit'
import { useState } from 'react'
import { MlFormField, MlFormFieldSize, MlFormFieldType } from '../interfaces'
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

  const [entry, setEntry] = useState<MlFormField>({
    name: sdk.entry.fields.name.getValue() || '',
    id: sdk.entry.fields.id.getValue() || '',
    fieldName: sdk.entry.fields.fieldName.getValue() || '',
    placeholder: sdk.entry.fields.placeholder.getValue() || '',
    required: sdk.entry.fields.required.getValue() || true,
    errorMessage: sdk.entry.fields.errorMessage.getValue() || '',
    helperMessage: sdk.entry.fields.helperMessage.getValue() || '',
    type: sdk.entry.fields.type.getValue() || MlFormFieldType.TEXT,
    options: sdk.entry.fields.options.getValue() || [],
    pattern: sdk.entry.fields.pattern.getValue() || '',
    min: sdk.entry.fields.min.getValue() || 0,
    max: sdk.entry.fields.max.getValue() || 0,
    minLength: sdk.entry.fields.minLength.getValue() || 0,
    maxLength: sdk.entry.fields.maxLength.getValue() || 0,
    defaultValue: sdk.entry.fields.defaultValue.getValue() || '',
    readonly: sdk.entry.fields.readonly.getValue() || false,
    disabled: sdk.entry.fields.disabled.getValue() || false,
    submitOnEnter: sdk.entry.fields.submitOnEnter.getValue() || false,
    size: sdk.entry.fields.size.getValue() || MlFormFieldSize.MEDIUM,
    valueType: sdk.entry.fields.valueType.getValue() || '',
    hidden: sdk.entry.fields.hidden.getValue() || false,
    columns: sdk.entry.fields.columns.getValue() || 0,
    rows: sdk.entry.fields.rows.getValue() || 0,
    maxUploadFileSize: sdk.entry.fields.maxUploadFileSize.getValue() || 0,
    multipleFiles: sdk.entry.fields.multipleFiles.getValue() || false,
    allowedFileExtensions: sdk.entry.fields.allowedFileExtensions.getValue() || [],
    servicesFieldIds: sdk.entry.fields.servicesFieldIds.getValue() || {},
    leftIcon: sdk.entry.fields.leftIcon.getValue() || undefined,
    rightIcon: sdk.entry.fields.rightIcon.getValue() || undefined,
    validations: sdk.entry.fields.validations.getValue() || {},
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
