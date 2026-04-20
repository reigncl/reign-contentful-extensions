import { InterfaceItem } from "../FieldSettings/FieldSetup.types";

export interface ItemRow {
  /** Stable React key for the row, derived from the source row number. */
  rowKey: string;
  items: InterfaceItem[];
}

/**
 * Cap on how many items render side-by-side in a single visual row, so a
 * misconfigured group with N>>4 items doesn't shrink each editor into an
 * unusable sliver. Items beyond the cap fall through to a new physical row
 * via the renderer's `gridAutoRows: "auto"` (or by simply chunking).
 */
export const MAX_ROW_COLUMNS = 4;

/**
 * Group items by their `row` number, preserving authored order within each
 * group. Numeric values are opaque ids: `1, 1, 5, 5` and `1, 1, 2, 2` produce
 * identical groupings. Items with no `row` (or a non-finite value) fall into
 * a trailing group, each on their own physical row.
 *
 * The cap above is enforced by chunking: a group of 6 items becomes two
 * physical rows of `MAX_ROW_COLUMNS` (and the remainder).
 */
export function groupItemsByRow(items: InterfaceItem[]): ItemRow[] {
  const buckets = new Map<number, InterfaceItem[]>();
  const FALLBACK = Number.POSITIVE_INFINITY;

  items.forEach((item) => {
    const r =
      typeof item.row === "number" && Number.isFinite(item.row)
        ? item.row
        : FALLBACK;
    const arr = buckets.get(r) ?? [];
    arr.push(item);
    buckets.set(r, arr);
  });

  const orderedRowNumbers = Array.from(buckets.keys()).sort((a, b) => a - b);

  const result: ItemRow[] = [];
  orderedRowNumbers.forEach((r) => {
    const groupItems = buckets.get(r)!;
    const baseKey = r === FALLBACK ? "row-tail" : `row-${r}`;

    if (r === FALLBACK) {
      groupItems.forEach((item, idx) => {
        result.push({ rowKey: `${baseKey}-${idx}`, items: [item] });
      });
      return;
    }

    for (let i = 0; i < groupItems.length; i += MAX_ROW_COLUMNS) {
      const chunk = groupItems.slice(i, i + MAX_ROW_COLUMNS);
      const chunkKey =
        groupItems.length <= MAX_ROW_COLUMNS
          ? baseKey
          : `${baseKey}-${i / MAX_ROW_COLUMNS}`;
      result.push({ rowKey: chunkKey, items: chunk });
    }
  });

  return result;
}
