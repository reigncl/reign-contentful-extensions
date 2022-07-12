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

export enum MlFormFieldServices {
  AWS = 'aws',
  EMTELCO = 'emtelco',
  EVENTBROKER = 'eventbroker',
  FIVE9 = 'five9',
  HORUS = 'horus',
  HUBSPOT = 'hubspot',
  LINK = 'link',
  MAILCHIMP = 'mailchimp',
  MASIV = 'masiv',
  MYTOOLS = 'mytools',
  PARDOT = 'pardot',
  QFLOW = 'qflow',
  SENDINBLUE = 'sendinblue',
  ZENDESK = 'zendesk',
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
  options: Record<'label' | 'value', string>[]
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
  servicesFieldIds: Record<MlFormFieldServices, string>
}
