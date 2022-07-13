import { ContentfulLinkAsset } from './contentful-link-asset'

export enum MlFormFieldSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

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

export enum MlFormFieldAllowedExtensions {
  ZIP = 'zip',
  XLS = 'xls',
  XLSX = 'xlsx',
  DOC = 'doc',
  DOCX = 'docx',
  PDF = 'pdf',
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
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
  size: MlFormFieldSize
  hidden?: boolean
  columns?: number
  rows?: number
  valueType?: MlFormFieldValueType
  maxUploadFileSize?: number
  multipleFiles?: boolean
  allowedFileExtensions: MlFormFieldAllowedExtensions[]
  servicesFieldIds: Record<string, string>
  leftIcon?: ContentfulLinkAsset
  rightIcon?: ContentfulLinkAsset
  validations: Record<MlFormFieldValidations | string, Record<'pattern' | 'errorMessage', string>>
}
