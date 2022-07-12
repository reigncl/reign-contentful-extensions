import { Button } from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { MouseEventHandler } from 'react'

export const renderAddEntryButton = (onClick: MouseEventHandler<HTMLButtonElement> | undefined) => {
  return (
    <Button variant="primary" startIcon={<PlusIcon />} onClick={onClick}>
      Add entry
    </Button>
  )
}
