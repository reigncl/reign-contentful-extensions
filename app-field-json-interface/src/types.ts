export type PrimitiveSchema = 'string' | 'longstring' | 'number' | 'boolean'
export type ObjectSchema = { [key: string]: Schema }
export type Schema = PrimitiveSchema | ObjectSchema | ObjectSchema[]

export interface InstallationParams {
  items?: SchemaItem[]
}

export interface SchemaItem {
  contentType: string
  field: string
  json: ObjectSchema
}

export interface DialogInvocation {
  contentType?: string
  field?: string
  json?: string
  index?: number
}

export interface DialogResult {
  contentType: string
  field: string
  json: ObjectSchema
  index?: number
}
