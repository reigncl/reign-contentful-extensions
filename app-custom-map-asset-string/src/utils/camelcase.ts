export const toCamelCase = (key?: string) =>
  key
    ? key
        .toLowerCase()
        .replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/ñ/, 'n')
    : ''
