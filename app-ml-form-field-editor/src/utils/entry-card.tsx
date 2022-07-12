import { EntryCard, EntityStatus, MenuItem } from '@contentful/f36-components'

type EntryCardProps = {
  title: string
  contentType: string
  status: EntityStatus
  onClick?: () => unknown
  key?: string
  className?: string
  onDelete?: () => unknown
}

export const renderEntryCard = ({ title, contentType, status, onClick, key, className, onDelete }: EntryCardProps) => {
  return (
    <EntryCard
      key={key}
      className={className}
      title={title}
      contentType={contentType}
      status={status}
      onClick={onClick}
      actions={
        onDelete
          ? [
              <MenuItem key="delete" onClick={onDelete}>
                Delete
              </MenuItem>,
            ]
          : undefined
      }
    />
  )
}

export const redirectToEntryUri = (uri: string, entryId: string) => {
  if (typeof window !== 'undefined') window.open(`${uri}/${entryId}`, '_blank')
}
