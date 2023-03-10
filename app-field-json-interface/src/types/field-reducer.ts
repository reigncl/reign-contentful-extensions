import { Dispatch } from 'react'
import { EditorTypeValue } from './switch-editor'

export type FieldState = {
  structure: EditorTypeValue
  value: EditorTypeValue
}

export type FieldContextType = {
  state: FieldState
  dispatch: Dispatch<FieldAction>
}

export enum FieldActionTypes {
  INIT = '@init-field',
  UPDATE_STRUCTURE = '@update-field-structure',
  UPDATE_VALUE = '@update-field-value',
}
export type KeyValue = { key: string; value: EditorTypeValue }

export interface FieldAction {
  type: FieldActionTypes
  payload: {
    structure?: EditorTypeValue
    value?: EditorTypeValue
  }
}
