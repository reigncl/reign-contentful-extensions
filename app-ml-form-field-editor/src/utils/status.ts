import { EntityStatus } from '@contentful/f36-components'

export const getStatus = (publishedAt?: string, firstPublishedAt?: string, updatedAt?: string): EntityStatus => {
  if (publishedAt === firstPublishedAt || publishedAt === updatedAt) return 'published'
  if (!publishedAt && !firstPublishedAt) return 'draft'
  if (firstPublishedAt && publishedAt !== updatedAt) return 'changed'
  return 'draft'
}
