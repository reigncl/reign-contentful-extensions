import { Asset, EditorExtensionSDK, NavigatorOpenResponse } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { AssetProps } from 'contentful-management'
import { useState, useEffect, useMemo } from 'react'
import { CommonProps, ContentfulLinkAsset, MlFormField } from '../interfaces'

export const useAsset = ({ entry, updateField, fieldId }: CommonProps & { fieldId: keyof MlFormField }) => {
  const cma = useCMA()
  const sdk = useSDK<EditorExtensionSDK>()

  const defaultLocale = useMemo(() => sdk.locales.default, [sdk])

  const [asset, setAsset] = useState<AssetProps>()

  const loadAsset = async (assetId?: string) => {
    if (assetId) {
      try {
        const contentfulAsset = await cma.asset.get({ assetId })
        setAsset(contentfulAsset)
      } catch (error) {
        console.warn('loadLeftIconImage error', error)
      }
    }
  }

  const onNewAsset = () => {
    sdk.navigator.openNewAsset({ slideIn: { waitForClose: true } }).then((newAsset: NavigatorOpenResponse<Asset>) => {
      if (newAsset && newAsset.entity) {
        const assetReference = {
          sys: {
            id: newAsset.entity.sys.id,
            linkType: newAsset.entity.sys.type,
            type: 'Link',
          },
        }

        updateField(assetReference, fieldId)
        loadAsset(newAsset.entity.sys.id)
      }
    })
  }

  const onEditAsset = () => {
    sdk.navigator
      .openAsset((entry[fieldId] as ContentfulLinkAsset)?.sys?.id, {
        slideIn: { waitForClose: true },
      })
      .then((newAsset: NavigatorOpenResponse<Asset>) => {
        if (newAsset && newAsset.entity) {
          const assetReference = {
            sys: {
              id: newAsset.entity.sys.id,
              linkType: newAsset.entity.sys.type,
              type: 'Link',
            },
          }

          updateField(assetReference, fieldId)
          loadAsset(newAsset.entity.sys.id)
        }
      })
  }

  const onRemoveAsset = () => {
    setAsset(undefined)
    updateField(null, fieldId)
  }

  const onDownloadAsset = (asset: Asset) => {
    const url = `https:${asset.fields?.file[defaultLocale]?.url}`
    if (typeof window !== 'undefined') {
      const win = window.open(url, '_blank')
      win?.focus()
    }
  }

  const onSelectExistingAsset = () => {
    sdk.dialogs.selectSingleAsset().then((newAsset: any) => {
      if (newAsset) {
        const assetReference = {
          sys: {
            id: newAsset.sys.id,
            linkType: newAsset.sys.type,
            type: 'Link',
          },
        }

        updateField(assetReference, fieldId)
        loadAsset(newAsset.sys.id)
      }
    })
  }

  useEffect(() => {
    loadAsset((entry[fieldId] as ContentfulLinkAsset)?.sys?.id)
  }, [])

  return { asset, onNewAsset, onEditAsset, onRemoveAsset, onDownloadAsset, onSelectExistingAsset, defaultLocale }
}
