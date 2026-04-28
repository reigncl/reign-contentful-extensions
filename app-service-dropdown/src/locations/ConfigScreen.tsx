import { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  FormControl,
  TextInput,
  Button,
  IconButton,
  Select,
  Option,
  Note,
  Badge,
  Text,
  SectionHeading,
  Box,
} from '@contentful/f36-components';
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import { useSDK } from '@contentful/react-apps-toolkit';
import {
  AppInstallationParameters,
  FieldMapping,
  HeaderEntry,
  extractArray,
  getScalarFields,
} from '../types';
import { buildFetchUrl } from '../fetchUrl';

const separator = css({ borderTop: '1px solid #e5ebed', margin: '24px 0' });

function headersToEntries(headers: Record<string, string>): HeaderEntry[] {
  return Object.entries(headers).map(([key, value]) => ({ key, value }));
}

function entriesToHeaders(entries: HeaderEntry[]): Record<string, string> {
  return entries.reduce<Record<string, string>>((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value;
    return acc;
  }, {});
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    serviceUrl: '',
    labelField: '',
    valueField: '',
    headers: {},
    mappings: [],
  });
  const [headerEntries, setHeaderEntries] = useState<HeaderEntry[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [previewItems, setPreviewItems] = useState<Record<string, unknown>[]>([]);

  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    const finalParameters: AppInstallationParameters = {
      ...parameters,
      headers: entriesToHeaders(headerEntries),
    };
    return { parameters: finalParameters, targetState: currentState };
  }, [parameters, headerEntries, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  const fetchAndAnalyze = useCallback(async (url: string, hdrs: Record<string, string>) => {
    setIsFetching(true);
    setFetchError(null);
    setDetectedFields([]);
    setPreviewItems([]);
    try {
      const response = await fetch(buildFetchUrl(url), {
        headers: { 'Content-Type': 'application/json', ...hdrs },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const items = extractArray(data);
      if (!items || items.length === 0) {
        setFetchError('No array of items was detected in the service response.');
        return;
      }
      const fields = getScalarFields(items[0]);
      if (!fields.length) {
        setFetchError('No text or number fields were found at the top level of the items.');
        return;
      }
      setDetectedFields(fields);
      setPreviewItems(items.slice(0, 3));
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Unknown error while fetching.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
        const entries = headersToEntries(currentParameters.headers ?? {});
        setHeaderEntries(entries);
        if (currentParameters.serviceUrl) {
          await fetchAndAnalyze(currentParameters.serviceUrl, currentParameters.headers ?? {});
        }
      }
      sdk.app.setReady();
    })();
  }, [sdk, fetchAndAnalyze]);

  const handleUrlChange = (url: string) => {
    setParameters((p) => ({ ...p, serviceUrl: url }));
    setDetectedFields([]);
    setPreviewItems([]);
    setFetchError(null);
  };

  const handleAddHeader = () => {
    setHeaderEntries((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaderEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, field: keyof HeaderEntry, val: string) => {
    setHeaderEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, [field]: val } : entry))
    );
  };

  const handleAddMapping = () => {
    setParameters((p) => ({ ...p, mappings: [...(p.mappings ?? []), { label: '', serviceField: '' }] }));
  };

  const handleRemoveMapping = (index: number) => {
    setParameters((p) => ({ ...p, mappings: p.mappings.filter((_, i) => i !== index) }));
  };

  const handleMappingChange = (index: number, field: keyof FieldMapping, val: string) => {
    setParameters((p) => ({
      ...p,
      mappings: p.mappings.map((m, i) => (i === index ? { ...m, [field]: val } : m)),
    }));
  };

  const handleTest = () => {
    fetchAndAnalyze(parameters.serviceUrl, entriesToHeaders(headerEntries));
  };

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>Service Dropdown — Configuration</Heading>
        <Paragraph>
          Enter your service URL and select which fields to use as the visible label and as the
          value stored in the Contentful field.
        </Paragraph>

        {/* ── URL ── */}
        <Box className={separator} />
        <SectionHeading>Data source</SectionHeading>

        <FormControl isRequired>
          <FormControl.Label>Service URL</FormControl.Label>
          <Flex gap="spacingS" alignItems="flex-start">
            <TextInput
              value={parameters.serviceUrl}
              placeholder="https://api.example.com/items"
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <Button
              variant="secondary"
              isLoading={isFetching}
              onClick={handleTest}
              isDisabled={!parameters.serviceUrl || isFetching}
            >
              Test URL
            </Button>
          </Flex>
          <FormControl.HelpText>
            The endpoint must return a JSON array of objects (or an object containing one).
          </FormControl.HelpText>
        </FormControl>

        {/* ── Headers ── */}
        <Box className={separator} />
        <SectionHeading>Authentication headers</SectionHeading>
        <Paragraph>
          Add HTTP headers that will be included in every request to the service (e.g.{' '}
          <code>Authorization</code> or <code>x-api-key</code>).
        </Paragraph>

        <Flex flexDirection="column" gap="spacingS">
          {headerEntries.map((entry, i) => (
            <Flex key={i} gap="spacingS" alignItems="center">
              <TextInput
                placeholder="Name (e.g. Authorization)"
                value={entry.key}
                onChange={(e) => handleHeaderChange(i, 'key', e.target.value)}
                style={{ flex: '0 0 240px' }}
              />
              <TextInput
                placeholder="Value (e.g. Bearer token123)"
                value={entry.value}
                onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
              />
              <IconButton
                variant="transparent"
                aria-label="Remove header"
                icon={<DeleteIcon />}
                onClick={() => handleRemoveHeader(i)}
              />
            </Flex>
          ))}
        </Flex>

        <Box marginTop="spacingS">
          <Button
            variant="secondary"
            size="small"
            startIcon={<PlusIcon />}
            onClick={handleAddHeader}
          >
            Add header
          </Button>
        </Box>

        {/* ── Fetch result ── */}
        {fetchError && (
          <Box marginTop="spacingM">
            <Note variant="negative" title="Error connecting to the service">
              {fetchError}
            </Note>
          </Box>
        )}

        {detectedFields.length > 0 && (
          <>
            <Box marginTop="spacingM">
              <Note variant="positive" title="Service detected successfully">
                Found <strong>{previewItems.length}+</strong> items with fields:{' '}
                {detectedFields.map((f) => (
                  <Badge key={f} variant="secondary" style={{ marginRight: 4 }}>
                    {f}
                  </Badge>
                ))}
              </Note>
            </Box>

            {/* ── Field mapping ── */}
            <Box className={separator} />
            <SectionHeading>Field mapping</SectionHeading>

            <FormControl isRequired>
              <FormControl.Label>Label field</FormControl.Label>
              <Select
                value={parameters.labelField}
                onChange={(e) => setParameters((p) => ({ ...p, labelField: e.target.value }))}
              >
                <Option value="">— Select a field —</Option>
                {detectedFields.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                    {previewItems[0] !== undefined
                      ? `  (e.g. "${String(previewItems[0][f] ?? '')}")`
                      : ''}
                  </Option>
                ))}
              </Select>
              <FormControl.HelpText>
                Text the editor will see in the dropdown.
              </FormControl.HelpText>
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Value field</FormControl.Label>
              <Select
                value={parameters.valueField}
                onChange={(e) => setParameters((p) => ({ ...p, valueField: e.target.value }))}
              >
                <Option value="">— Select a field —</Option>
                {detectedFields.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                    {previewItems[0] !== undefined
                      ? `  (e.g. "${String(previewItems[0][f] ?? '')}")`
                      : ''}
                  </Option>
                ))}
              </Select>
              <FormControl.HelpText>
                Value that will be saved to the Contentful field when an option is selected.
              </FormControl.HelpText>
            </FormControl>

            {/* ── Additional mappings ── */}
            <Box className={separator} />
            <SectionHeading>Additional info fields</SectionHeading>
            <Paragraph>
              Map service fields to display as extra information below the dropdown when an option
              is selected.
            </Paragraph>

            <Flex flexDirection="column" gap="spacingS">
              {(parameters.mappings ?? []).map((mapping, i) => (
                <Flex key={i} gap="spacingS" alignItems="center">
                  <TextInput
                    placeholder="Label (e.g. Start date)"
                    value={mapping.label}
                    onChange={(e) => handleMappingChange(i, 'label', e.target.value)}
                    style={{ flex: '0 0 200px' }}
                  />
                  <Select
                    value={mapping.serviceField}
                    onChange={(e) => handleMappingChange(i, 'serviceField', e.target.value)}
                  >
                    <Option value="">— Service field —</Option>
                    {detectedFields.map((f) => (
                      <Option key={f} value={f}>
                        {f}
                        {previewItems[0] !== undefined
                          ? `  (e.g. "${String(previewItems[0][f] ?? '')}")`
                          : ''}
                      </Option>
                    ))}
                  </Select>
                  <IconButton
                    variant="transparent"
                    aria-label="Remove field"
                    icon={<DeleteIcon />}
                    onClick={() => handleRemoveMapping(i)}
                  />
                </Flex>
              ))}
            </Flex>

            <Box marginTop="spacingS">
              <Button
                variant="secondary"
                size="small"
                startIcon={<PlusIcon />}
                onClick={handleAddMapping}
              >
                Add field
              </Button>
            </Box>

            {/* ── Preview ── */}
            {parameters.labelField && parameters.valueField && (
              <>
                <Box className={separator} />
                <SectionHeading>Dropdown preview</SectionHeading>
                <Note title="First options will look like this">
                  <Flex flexDirection="column" gap="spacingXs">
                    {previewItems.map((item, i) => (
                      <Flex key={i} gap="spacingS" alignItems="center">
                        <Badge variant="secondary">
                          {String(item[parameters.valueField] ?? '—')}
                        </Badge>
                        <Text>{String(item[parameters.labelField] ?? '—')}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Note>
              </>
            )}
          </>
        )}
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
