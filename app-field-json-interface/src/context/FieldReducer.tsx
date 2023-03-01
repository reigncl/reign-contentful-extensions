import { FieldAction, FieldActionTypes, FieldState } from '../types'

export const INITIAL_FIELD_STATE: FieldState = {
  structure: {},
  value: {},
}

export const FieldReducer: (state: FieldState, action: FieldAction) => FieldState = (
  state = INITIAL_FIELD_STATE,
  action: FieldAction
): FieldState => {
  switch (action.type) {
    case FieldActionTypes.UPDATE_VALUE: {
      return {
        ...state,
        value: action.payload.value ?? state?.value,
      }
    }
    case FieldActionTypes.INIT: {
      return {
        structure: action.payload.structure ?? {},
        value: action.payload.value ?? {},
      }
    }
    default:
      return state
  }
}
