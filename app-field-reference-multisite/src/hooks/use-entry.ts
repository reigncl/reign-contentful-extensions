import { Entry, NavigatorOpenResponse } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { ContentTypeProps } from 'contentful-management'
import { useState, useEffect, useMemo } from 'react'
import { ReferenceEntry } from '../interfaces'

export const useEntry = ({
  entryReference,
  updateField,
  fieldId,
  contentType,
}: {
  entryReference: ReferenceEntry | null
  updateField: (newEntryValue: ReferenceEntry | null, fieldKey: string) => void
  fieldId: string
  contentType: ContentTypeProps
}) => {
  const cma = useCMA()
  const sdk = useSDK()

  const defaultLocale = useMemo(() => sdk.locales.default, [sdk])

  const [entry, setEntry] = useState<ReferenceEntry>()

  const loadEntry = async (entryId?: string) => {
    if (entryId) {
      try {
        const contentfulEntry = await cma.entry.get({ entryId })

        const formattedEntry: ReferenceEntry = {
          sys: {
            id: contentfulEntry.sys.id,
            publishedAt: contentfulEntry.sys.publishedAt,
            createdAt: contentfulEntry.sys.createdAt,
            updatedAt: contentfulEntry.sys.updatedAt,
          },
          fields: contentfulEntry.fields,
        }
        setEntry(formattedEntry)
        updateField(formattedEntry, fieldId)
      } catch (error) {
        console.warn('load entry error', error)
      }
    }
  }

  const onNewEntry = () => {
    sdk.navigator
      .openNewEntry(contentType.sys.id, { slideIn: { waitForClose: true } })
      .then((newEntry: NavigatorOpenResponse<Entry>) => {
        if (newEntry && newEntry.entity) {
          loadEntry(newEntry.entity.sys.id)
        }
      })
  }

  const onEditEntry = () => {
    sdk.navigator
      .openEntry(entry?.sys.id ?? '', {
        slideIn: { waitForClose: true },
      })
      .then((newEntry: NavigatorOpenResponse<Entry>) => {
        if (newEntry && newEntry.entity) {
          loadEntry(newEntry.entity.sys.id)
        }
      })
  }

  const onRemoveEntry = () => {
    setEntry(undefined)
    updateField(null, fieldId)
  }

  const onSelectExistingEntry = () => {
    sdk.dialogs.selectSingleEntry({ contentTypes: [contentType.sys.id] }).then((newEntry: any) => {
      if (newEntry) {
        loadEntry(newEntry.sys.id)
      }
    })
  }

  useEffect(() => {
    loadEntry(entryReference?.sys.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { onNewEntry, onEditEntry, onRemoveEntry, onSelectExistingEntry, defaultLocale }
}
