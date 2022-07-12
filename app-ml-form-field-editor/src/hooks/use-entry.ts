import { EditorExtensionSDK } from '@contentful/app-sdk'
import { PlainClientAPI } from 'contentful-management'
import { useEffect, useState } from 'react'
import { LinkEntry } from '../interfaces'
import { getStatus } from '../utils'

export const useEntry = <T>(sdk: EditorExtensionSDK, cma: PlainClientAPI, mainEntry: T, key: keyof T) => {
  const getEntry = async (): Promise<LinkEntry | undefined> => {
    const localEntryReference = sdk.entry.fields[key as string].getValue()

    if (localEntryReference) {
      const cfEntry = await cma.entry.get({
        entryId: localEntryReference?.sys.id,
      })

      return {
        name: cfEntry.fields.name['en-US'],
        status: getStatus(cfEntry.sys.publishedAt, cfEntry.sys.firstPublishedAt, cfEntry.sys.updatedAt),
        id: cfEntry.sys.id,
      }
    }
    return undefined
  }

  const [entry, setEntry] = useState<LinkEntry>()

  useEffect(() => {
    getEntry().then((data) => {
      setEntry(data)
    })
  }, [mainEntry[key]])

  return { entry }
}
