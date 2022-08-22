import { Box, Flex, Button, Menu, EntryCard, MenuItem } from '@contentful/f36-components'
import { PlusIcon, ChevronDownIcon } from '@contentful/f36-icons'
import { ContentTypeProps } from 'contentful-management'
import { useEntry } from '../../hooks'
import { ReferenceEntry } from '../../interfaces'

export type AssetSelectorProps = {
  fieldId: string
  entryReference: ReferenceEntry | null
  updateField: (newEntryValue: ReferenceEntry | null, fieldKey: string) => void
  contentType: ContentTypeProps
}

const getEntryStatus = ({
  publishedAt,
  updatedAt,
  createdAt,
}: {
  publishedAt?: string
  updatedAt?: string
  createdAt?: string
}) => {
  if (updatedAt === publishedAt) return 'published'
  if (!publishedAt && createdAt) return 'draft'
  if (createdAt !== publishedAt && updatedAt) return 'changed'
}

export const EntrySelector = ({ entryReference, updateField, fieldId, contentType }: AssetSelectorProps) => {
  const { onNewEntry, onEditEntry, onRemoveEntry, onSelectExistingEntry, defaultLocale } = useEntry({
    entryReference,
    updateField,
    fieldId,
    contentType,
  })

  if (!entryReference)
    return (
      <Box
        as="div"
        style={{
          border: '1px',
          borderRadius: '5px',
          paddingBlock: '32px',
          borderColor: 'rgb(103, 114, 138)',
          borderStyle: 'dashed',
          width: '100%',
        }}
      >
        <Flex alignItems="center" justifyContent="center" flexDirection="row">
          <Menu>
            <Menu.Trigger>
              <Button
                variant="secondary"
                startIcon={<PlusIcon />}
                endIcon={<ChevronDownIcon />}
                style={{ fontWeight: 700 }}
                size="small"
              >
                Add content
              </Button>
            </Menu.Trigger>
            <Menu.List>
              <Menu.Item onClick={onSelectExistingEntry}>Add existing content</Menu.Item>
              <Menu.Divider />
              <Menu.SectionTitle>New Content</Menu.SectionTitle>
              <Menu.Item onClick={onNewEntry}>{contentType.name}</Menu.Item>
            </Menu.List>
          </Menu>
        </Flex>
      </Box>
    )

  return (
    <EntryCard
      status={getEntryStatus(entryReference.sys)}
      contentType={contentType.name}
      title={(entryReference?.fields?.name?.[defaultLocale] as string) ?? 'Untitled'}
      actions={[
        <MenuItem key="remove" onClick={onRemoveEntry}>
          Remove
        </MenuItem>,
      ]}
      onClick={onEditEntry}
    />
  )
}
