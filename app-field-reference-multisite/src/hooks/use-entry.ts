import { Entry, NavigatorOpenResponse } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { ContentTypeProps } from 'contentful-management'
import { useState, useEffect, useMemo } from 'react'
import { LogoLink } from '../interfaces'

export const useEntry = ({
  entryReference,
  updateField,
  fieldId,
  contentType,
}: {
  entryReference: LogoLink | null
  updateField: (newEntryValue: LogoLink | null, fieldKey: string) => void
  fieldId: string
  contentType: ContentTypeProps
}) => {
  const cma = useCMA()
  const sdk = useSDK()

  const defaultLocale = useMemo(() => sdk.locales.default, [sdk])

  const [entry, setEntry] = useState<LogoLink>()

  const loadEntry = async (entryId?: string) => {
    if (entryId) {
      try {
        const contentfulEntry = await cma.entry.get({ entryId })
        // PRINT CONTENTFUL ENTRY HERE AND SEE WHY cannot read properties of Undefined
        // reading en-US when creating new entry
        console.log(contentfulEntry)

        const formattedEntry: LogoLink = {
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
  }, [])

  return { onNewEntry, onEditEntry, onRemoveEntry, onSelectExistingEntry, defaultLocale }
}
