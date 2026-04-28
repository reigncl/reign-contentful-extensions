export interface FieldMapping {
  label: string;
  serviceField: string;
}

export interface AppInstallationParameters {
  serviceUrl: string;
  labelField: string;
  valueField: string;
  headers: Record<string, string>;
  mappings: FieldMapping[];
}

export interface HeaderEntry {
  key: string;
  value: string;
}

export interface FieldInstanceParameters {
  labelFieldId?: string;
  labelPrefix?: string;
}

export interface ServiceItem {
  label: string;
  value: string;
}

export function extractArray(data: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object') {
    for (const val of Object.values(data as object)) {
      if (Array.isArray(val) && (val as unknown[]).length > 0) {
        return val as Record<string, unknown>[];
      }
    }
  }
  return null;
}

export function getScalarFields(item: Record<string, unknown>): string[] {
  return Object.keys(item).filter(
    (k) => typeof item[k] === 'string' || typeof item[k] === 'number'
  );
}
