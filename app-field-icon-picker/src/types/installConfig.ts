/** Field types this app can be wired to (stored on each install row for editor reset / docs). */
export type InstallFieldType = 'Symbol' | 'Text' | 'Object';

export type ExtraFieldDef = {
  id: string;
  label: string;
  type: 'text';
  required?: boolean;
};

export interface ConfigJsonStructureItem {
  contentType: string;
  field: string;
  iconSet: string;
  index?: number;
  /** Saved when the row is created/updated so config can reset the correct built-in widget. */
  fieldType?: InstallFieldType;
  /** When non-empty on an Object field, entry value is a list of `{ icon, ...ids }`. */
  extraFields?: ExtraFieldDef[];
}

export interface AppInstallationParameters {
  items?: Array<ConfigJsonStructureItem>;
}
