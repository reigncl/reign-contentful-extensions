import type { ExtraFieldDef, InstallFieldType } from '../types/installConfig';

export type ListRow = Record<string, string>;

export function isListMode(fieldType: string, extraFields: ExtraFieldDef[] | undefined): boolean {
  return fieldType === 'Object' && Boolean(extraFields?.length);
}

export function defaultBuiltinWidgetId(fieldType: string | undefined): string {
  switch (fieldType) {
    case 'Symbol':
      return 'singleLine';
    case 'Text':
      return 'multipleLine';
    case 'Object':
    default:
      return 'objectEditor';
  }
}

export function emptyListRow(extraFields: ExtraFieldDef[]): ListRow {
  const row: ListRow = { icon: '' };
  for (const f of extraFields) row[f.id] = '';
  return row;
}

export function normalizeListValue(raw: unknown, extraFields: ExtraFieldDef[]): ListRow[] {
  if (!Array.isArray(raw)) return [];
  const ids = extraFields.map((e) => e.id);
  return raw.map((item) => {
    const o = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const row: ListRow = { icon: typeof o.icon === 'string' ? o.icon : '' };
    for (const id of ids) {
      row[id] = typeof o[id] === 'string' ? o[id] : '';
    }
    return row;
  });
}

/** Shape written to the Object field (JSON array). */
export function rowsToPersistedList(
  rows: ListRow[],
  extraFields: ExtraFieldDef[]
): Array<Record<string, string>> {
  return rows.map((r) => {
    const o: Record<string, string> = { icon: r.icon ?? '' };
    for (const f of extraFields) o[f.id] = r[f.id] ?? '';
    return o;
  });
}

export function validateListRows(
  rows: ListRow[],
  extraFields: ExtraFieldDef[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  rows.forEach((row, i) => {
    const n = i + 1;
    if (!row.icon?.trim()) errors.push(`Row ${n}: pick an icon.`);
    for (const f of extraFields) {
      if (f.required && !String(row[f.id] ?? '').trim()) {
        errors.push(`Row ${n}: ${f.label || f.id} is required.`);
      }
    }
  });
  return { valid: errors.length === 0, errors };
}

export function isInstallFieldType(value: string | undefined): value is InstallFieldType {
  return value === 'Symbol' || value === 'Text' || value === 'Object';
}
