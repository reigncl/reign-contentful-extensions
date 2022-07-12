import { AssetCard, DropdownList, DropdownListItem, FieldGroup, FormLabel, Button } from '@contentful/f36-components'

interface IconUploaderProps {
  label?: string
  icon?: {
    sys: {
      id: string
      linkType: string
      type: string
    }
  }
  asset: {
    isLoading: boolean
    asset: {
      fields: {
        title: any
        file: any
        description: any
      }
      metadata: {
        tags: Array<any>
      }
      sys: {
        id: string
        createdBy: { sys: any }
        environment: { sys: any }
        space: any
        type: string
        publishedCounter: number
        updatedAt: string
        updatedBy: { sys: any }
        version: number
        publishedAt: string
      }
    }
  }
  localesDefault: string
  onNewAssetClick?: () => void
  onExistingAssetClick?: () => void
  onRemoveIcon?: () => void
  onDownloadIcon: (url: string) => void
  onOpenAsset?: () => void
}

const IconUploader = ({
  onNewAssetClick,
  onExistingAssetClick,
  onRemoveIcon,
  onDownloadIcon,
  onOpenAsset,
  label,
  icon,
  asset,
  localesDefault,
}: IconUploaderProps) => {
  return (
    <FieldGroup>
      <FormLabel htmlFor="form">{label}</FormLabel>
      {icon === null ? (
        <>
          <Button onClick={onNewAssetClick} variant="positive" style={{ marginRight: 20 }}>
            New Asset
          </Button>
          <Button onClick={onExistingAssetClick} variant="primary">
            Select Asset
          </Button>
        </>
      ) : (
        <AssetCard
          type="image"
          isLoading={asset.isLoading}
          src={asset.asset?.fields?.file ? asset.asset?.fields?.file[localesDefault]?.url ?? '' : ''}
          status={asset?.asset ? (asset?.asset?.sys?.publishedAt ? 'published' : 'changed') : 'draft'}
          title={asset.asset?.fields?.file ? asset.asset?.fields?.file[localesDefault]?.fileName ?? '' : ''}
          dropdownListElements={
            <>
              <DropdownList>
                <DropdownListItem isTitle>Actions</DropdownListItem>
                <DropdownListItem onClick={onRemoveIcon}>Remove</DropdownListItem>
                <DropdownListItem onClick={onOpenAsset}>Edit Asset</DropdownListItem>
                {asset?.asset?.fields?.file && (
                  <DropdownListItem
                    onClick={(e) => {
                      onDownloadIcon(asset.asset ? `https:${asset.asset?.fields?.file[localesDefault]?.url}` : '')
                    }}
                  >
                    Open Asset
                  </DropdownListItem>
                )}
              </DropdownList>
              {asset.asset?.fields?.file && (
                <DropdownList border="top">
                  <DropdownListItem isTitle>File info</DropdownListItem>
                  <DropdownListItem>
                    {asset.asset?.fields?.file ? asset.asset?.fields?.file[localesDefault]?.fileName : ''}
                  </DropdownListItem>
                  <DropdownListItem>
                    {asset.asset?.fields?.file ? asset.asset?.fields?.file[localesDefault]?.contentType : ''}
                  </DropdownListItem>
                  <DropdownListItem>
                    {asset.asset?.fields?.file
                      ? Number(asset.asset?.fields?.file[localesDefault]?.details?.size ?? 0 / 1000).toFixed(2) + ' kB'
                      : ''}
                  </DropdownListItem>
                  <DropdownListItem>
                    {asset.asset?.fields?.file[localesDefault]?.details.image
                      ? asset.asset?.fields?.file[localesDefault]?.details.image.width +
                        ' x ' +
                        asset.asset?.fields?.file[localesDefault]?.details.image.height
                      : ''}
                  </DropdownListItem>
                </DropdownList>
              )}
            </>
          }
        />
      )}
    </FieldGroup>
  )
}

export default IconUploader
