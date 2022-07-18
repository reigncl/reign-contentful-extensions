import { ContentfulLinkAsset } from './contentful-link-asset'

export enum MlFormFieldValueType {
  VALUE = 'value',
  PARAM = 'param',
}

export enum MlFormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
  RANGE = 'range',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  URL_PATH = 'origin URL (path)',
  URL_FULL = 'origin URL (full)',
  DATEPICKER = 'datepicker',
  FILE = 'file',
}

export enum MlFormFieldValidations {
  NUMERIC = 'Numeric',
  ALPHANUMERIC = 'Alphanumeric',
  CUSTOM = 'Custom',
  PHONE = 'Phone',
}

export type MlFormFieldOptions = {
  label: string
  value: string
  children: any
}

export enum MlFormFieldDefaultKeys {
  NAME = 'name',
  ID = 'id',
  FIELD_NAME = 'fieldName',
  PLACEHOLDER = 'placeholder',
  REQUIRED = 'required',
  ERROR_MESSAGE = 'errorMessage',
  HELPER_MESSAGE = 'helperMessage',
  TYPE = 'type',
  OPTIONS = 'options',
  PATTERN = 'pattern',
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  DEFAULT_VALUE = 'defaultValue',
  READONLY = 'readonly',
  DISABLED = 'disabled',
  SUBMIT_ON_ENTER = 'submitOnEnter',
  SIZE = 'size',
  HIDDEN = 'hidden',
  COLUMNS = 'columns',
  ROWS = 'rows',
  VALUE_TYPE = 'valueType',
  MAX_UPLOAD_FILE_SIZE = 'maxUploadFileSize',
  MULTIPLE_FILES = 'multipleFiles',
  ALLOWED_FILE_EXTENSIONS = 'allowedFileExtensions',
  SERVICES_FIELD_IDS = 'servicesFieldIds',
  LEFT_ICON = 'leftIcon',
  RIGHT_ICON = 'rightIcon',
  VALIDATIONS = 'validations',
}

export interface MlFormField {
  name: string
  id: string
  fieldName: string
  placeholder?: string
  required?: boolean
  errorMessage?: string
  helperMessage?: string
  type: MlFormFieldType
  options: MlFormFieldOptions[]
  pattern?: string
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  defaultValue?: string
  readonly?: boolean
  disabled?: boolean
  submitOnEnter?: boolean
  size: string
  hidden?: boolean
  columns?: number
  rows?: number
  valueType?: MlFormFieldValueType
  maxUploadFileSize?: number
  multipleFiles?: boolean
  allowedFileExtensions: string[]
  servicesFieldIds: Record<string, string>
  leftIcon?: ContentfulLinkAsset
  rightIcon?: ContentfulLinkAsset
  validations: Record<MlFormFieldValidations | string, Record<'pattern' | 'errorMessage', string>>
}
