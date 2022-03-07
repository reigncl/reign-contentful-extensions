import { ConfigPreviewItem } from "../components/ConfigScreen";

export function SortByLabel(a: ConfigPreviewItem, b: ConfigPreviewItem) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}
