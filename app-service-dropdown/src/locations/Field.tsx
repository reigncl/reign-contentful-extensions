import { useEffect, useState, useCallback } from 'react';
import { Select, Option, Spinner, Note, FormControl } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import {
  AppInstallationParameters,
  FieldInstanceParameters,
  ServiceItem,
  extractArray,
} from '../types';
import { buildFetchUrl } from '../fetchUrl';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const params = sdk.parameters.installation as AppInstallationParameters;
  const instanceParams = sdk.parameters.instance as FieldInstanceParameters;
  const labelFieldId = instanceParams?.labelFieldId?.trim() || null;
  const labelPrefix = instanceParams?.labelPrefix ?? '';
  const mappings = params?.mappings ?? [];

  const [items, setItems] = useState<ServiceItem[]>([]);
  const [rawItems, setRawItems] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(
    (sdk.field.getValue() as string | undefined) ?? ''
  );

  useEffect(() => {
    sdk.window.startAutoResizer();
    return () => sdk.window.stopAutoResizer();
  }, [sdk]);

  useEffect(() => {
    if (!params?.serviceUrl || !params?.labelField || !params?.valueField) {
      setError(
        'The app is not configured correctly. Set the URL and fields in the configuration screen.'
      );
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await fetch(buildFetchUrl(params.serviceUrl), {
          headers: { 'Content-Type': 'application/json', ...(params.headers ?? {}) },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        const arr = extractArray(data);
        if (!arr || arr.length === 0) throw new Error('No array found in the service response.');

        const loaded: ServiceItem[] = arr.map((item) => ({
          label: String(item[params.labelField] ?? ''),
          value: String(item[params.valueField] ?? ''),
        }));

        setItems(loaded);
        setRawItems(arr);

        // Sync label on initial load if out of sync
        const currentValue = sdk.field.getValue() as string | undefined;
        if (labelFieldId && currentValue) {
          const match = loaded.find((item) => item.value === currentValue);
          const entryField = sdk.entry.fields[labelFieldId];
          if (match && entryField) {
            const localeField = entryField.getForLocale(sdk.field.locale);
            const labelValue = `${labelPrefix}${match.label}`;
            const currentLabel = localeField.getValue() as string | undefined;
            if (!currentLabel || currentLabel !== labelValue) {
              await localeField.setValue(labelValue);
            }
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error loading options from the service.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params, labelFieldId, sdk]);

  const writeLabelField = useCallback(
    async (selectedValue: string, selectedItems: ServiceItem[]) => {
      if (!labelFieldId) return;
      const entryField = sdk.entry.fields[labelFieldId];
      if (!entryField) return;

      const localeField = entryField.getForLocale(sdk.field.locale);

      if (selectedValue) {
        const match = selectedItems.find((item) => item.value === selectedValue);
        if (match) {
          await localeField.setValue(`${labelPrefix}${match.label}`);
        }
      } else {
        await localeField.removeValue();
      }
    },
    [sdk, labelFieldId, labelPrefix]
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (newValue) {
        await sdk.field.setValue(newValue);
      } else {
        await sdk.field.removeValue();
      }

      await writeLabelField(newValue, items);
    },
    [sdk.field, items, writeLabelField]
  );

  if (isLoading) return <Spinner />;

  if (error) return <Note variant="negative">{error}</Note>;

  const selectedRaw = rawItems.find(
    (item) => String(item[params.valueField] ?? '') === value
  );

  return (
    <FormControl>
      <Select value={value} onChange={handleChange}>
        <Option value="">— Select an option —</Option>
        {items.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
      {selectedRaw &&
        mappings
          .filter((m) => m.label && m.serviceField && selectedRaw[m.serviceField] != null)
          .map((m) => (
            <FormControl.HelpText key={m.label}>
              <strong>{m.label}</strong> {String(selectedRaw[m.serviceField])}
            </FormControl.HelpText>
          ))}
    </FormControl>
  );
};

export default Field;
