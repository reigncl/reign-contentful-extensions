import { Switch } from '@contentful/f36-components'
import { useState } from 'react'

interface Props {
  value: boolean | undefined
  onChange: (value: boolean) => void
}

const BooleanField = ({ value, onChange }: Props) => {
  const [checked, setChecked] = useState(value ?? false)

  return (
    <Switch
      isChecked={checked}
      onChange={e => {
        setChecked(e.target.checked)
        onChange(e.target.checked)
      }}
    />
  )
}

export default BooleanField
