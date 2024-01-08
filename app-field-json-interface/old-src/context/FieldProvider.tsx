import { ReactNode, useMemo, useReducer } from 'react'
import { FieldContext } from './FieldContext'
import { FieldReducer, INITIAL_FIELD_STATE } from './FieldReducer'

export const FieldProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(FieldReducer, INITIAL_FIELD_STATE)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}
