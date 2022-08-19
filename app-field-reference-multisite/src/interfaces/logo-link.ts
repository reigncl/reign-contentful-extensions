export interface LogoLink {
  sys: {
    id: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
  }
  fields: Record<string, Record<string, string | unknown>>
}

export interface LogoLinks {
  [site: string]: LogoLink | null // at-link entry associated to some site
}
