import { createContext } from 'react'
import { FieldContextType } from '../types'
import { INITIAL_FIELD_STATE } from './FieldReducer'

export const FieldContext = createContext<FieldContextType>({
  state: INITIAL_FIELD_STATE,
  dispatch: () => ({}),
})
