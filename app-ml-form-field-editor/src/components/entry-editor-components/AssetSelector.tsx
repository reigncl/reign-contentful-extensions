import { Box, Flex, Button, Menu, AssetCard, MenuItem, Paragraph } from '@contentful/f36-components'
import { PlusIcon, ChevronDownIcon } from '@contentful/f36-icons'
import { useAsset } from '../../hooks'
import { CommonProps, MlFormField } from '../../interfaces'

export type AssetSelectorProps = CommonProps & {
  fieldId: keyof MlFormField
}

const ActionParagraph = ({ label }: { label: string }) => (
  <Paragraph
    style={{
      letterSpacing: '0.1rem',
      fontWeight: '600',
      color: 'rgb(17, 27, 43)',
      fontSize: '0.75rem',
      padding: '0.5rem 1rem 0 1rem',
      textTransform: 'uppercase',
    }}
  >
    {label}
  </Paragraph>
)

export const AssetSelector = ({ entry, updateField, fieldId }: AssetSelectorProps) => {
  const { asset, onNewAsset, onEditAsset, onRemoveAsset, onDownloadAsset, onSelectExistingAsset, defaultLocale } =
    useAsset({
      entry,
      updateField,
      fieldId,
    })

  if (!asset)
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
                Add media
              </Button>
            </Menu.Trigger>
            <Menu.List>
              <Menu.Item onClick={onSelectExistingAsset}>Add existing media</Menu.Item>
              <Menu.Item onClick={onNewAsset}>Add new media</Menu.Item>
            </Menu.List>
          </Menu>
        </Flex>
      </Box>
    )

  return (
    <AssetCard
      type="image"
      size="small"
      src={asset?.fields?.file ? asset?.fields?.file[defaultLocale]?.url ?? '' : ''}
      status={asset ? (asset?.sys?.publishedAt ? 'published' : 'changed') : 'draft'}
      title={asset?.fields?.file ? asset?.fields?.file[defaultLocale]?.fileName ?? '' : ''}
      actions={[
        <ActionParagraph label="ACTIONS" key="actions" />,
        <MenuItem key="edit" onClick={onEditAsset}>
          Edit
        </MenuItem>,
        asset?.fields?.file && (
          <MenuItem key="download" onClick={() => onDownloadAsset(asset)}>
            Download
          </MenuItem>
        ),
        <MenuItem key="remove" onClick={onRemoveAsset}>
          Remove
        </MenuItem>,
        ...(asset?.fields?.file
          ? [
              <ActionParagraph label="FILE INFO" key="actions" />,
              <MenuItem key="filename">{asset?.fields?.file[defaultLocale]?.fileName}</MenuItem>,
              <MenuItem key="filetype">{asset?.fields?.file[defaultLocale]?.contentType}</MenuItem>,
              <MenuItem key="filesize">
                {Number(asset?.fields?.file[defaultLocale]?.details?.size ?? 0 / 1000).toFixed(2) + ' kB'}
              </MenuItem>,
              <MenuItem key="filedimensions">
                {asset.fields?.file[defaultLocale]?.details?.image.width +
                  ' x ' +
                  asset.fields?.file[defaultLocale]?.details?.image.height}
              </MenuItem>,
            ]
          : []),
      ]}
      onClick={onEditAsset}
    />
  )
}
