export function BuildPreviewUrl(
  previewUrl: string,
  value: string,
  slugFieldId: string
): string {
  if (previewUrl && value && slugFieldId && previewUrl?.includes(slugFieldId)) {
    return previewUrl.replace(slugFieldId, value);
  }
  return "";
}
