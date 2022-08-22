export interface ReferenceEntry {
  sys: {
    id: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
  }
  fields: Record<string, Record<string, string | unknown>>
}

export interface ReferenceMultiSite {
  [site: string]: ReferenceEntry | null // at-link entry associated to some site
}
