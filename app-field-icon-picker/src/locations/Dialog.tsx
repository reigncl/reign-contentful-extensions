import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Form,
  FormControl,
  Note,
  Select,
  TextInput,
} from '@contentful/f36-components';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
} from 'contentful-management';

import type { ConfigJsonStructureItem, ExtraFieldDef } from '../types/installConfig';
import { DEFAULT_ICON_SET_ID, listIconSets } from '../icon-sets';
import { isInstallFieldType } from '../util/fieldConfig';

export enum DialogTypes {
  ADD,
  UPDATE,
}

export type DialogJsonStructureItem = ConfigJsonStructureItem;

type FieldMeta = { id: string; type: string };

const SUPPORTED_FIELD_TYPES = new Set(['Symbol', 'Text', 'Object']);

const emptyExtraRow = (): ExtraFieldDef => ({
  id: '',
  label: '',
  type: 'text',
  required: false,
});

const Dialog = () => {
  const cma = useCMA();
  const sdk = useSDK<DialogExtensionSDK>();
  const invocation = sdk.parameters.invocation as unknown as ConfigJsonStructureItem;
  const { index } = invocation;

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [contentTypesList, setContentTypesList] = useState<Array<Record<string, string>>>([]);
  const [fieldsMeta, setFieldsMeta] = useState<FieldMeta[]>([]);

  const [contentTypeSelected, setContentTypeSelected] = useState<string | undefined>(
    invocation?.contentType
  );
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(invocation?.field);
  const [iconSetSelected, setIconSetSelected] = useState<string>(
    invocation?.iconSet ?? DEFAULT_ICON_SET_ID
  );
  const [extraFieldsDraft, setExtraFieldsDraft] = useState<ExtraFieldDef[]>(() => {
    const fromInv = invocation?.extraFields;
    if (Array.isArray(fromInv) && fromInv.length) return fromInv.map((e) => ({ ...e, type: 'text' as const }));
    return [];
  });

  const iconSets = listIconSets();

  const selectedFieldType = useMemo(
    () => fieldsMeta.find((f) => f.id === fieldSelected)?.type,
    [fieldsMeta, fieldSelected]
  );

  const isObjectField = selectedFieldType === 'Object';

  const isValid = Boolean(contentTypeSelected && fieldSelected && iconSetSelected);

  const updateExtraRow = (i: number, patch: Partial<ExtraFieldDef>) => {
    setExtraFieldsDraft((rows) => rows.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  };

  const addExtraFieldRow = () => {
    setExtraFieldsDraft((rows) => [...rows, emptyExtraRow()]);
  };

  const removeExtraFieldRow = (i: number) => {
    setExtraFieldsDraft((rows) => rows.filter((_, j) => j !== i));
  };

  const submitForm = () => {
    if (!isValid) return;
    setSubmitError(null);

    const ft = selectedFieldType;
    if (!isInstallFieldType(ft)) {
      setSubmitError('Selected field must be Short text, Long text, or JSON Object.');
      return;
    }

    let extraFieldsOut: ExtraFieldDef[] | undefined;
    if (ft === 'Object') {
      const cleaned = extraFieldsDraft
        .filter((r) => r.id.trim())
        .map((r) => ({
          id: r.id.trim(),
          label: (r.label.trim() || r.id.trim()) as string,
          type: 'text' as const,
          required: Boolean(r.required),
        }));
      const ids = cleaned.map((c) => c.id);
      const dup = ids.find((id, i) => ids.indexOf(id) !== i);
      if (dup) {
        setSubmitError(`Duplicate extra field id: "${dup}".`);
        return;
      }
      extraFieldsOut = cleaned.length ? cleaned : undefined;
    }

    setSubmitted(true);
    sdk.close({
      contentType: contentTypeSelected!,
      field: fieldSelected!,
      iconSet: iconSetSelected,
      fieldType: ft,
      extraFields: ft === 'Object' ? extraFieldsOut : undefined,
      index,
    } as ConfigJsonStructureItem);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const collectionResponse: CollectionProp<ContentTypeProps> = await cma.contentType.getMany({
        query: { order: 'sys.id' },
      });
      if (cancelled) return;
      const arrayOfContentTypes = (collectionResponse?.items ?? []).map(
        (item: ContentTypeProps) => ({ name: item.name, id: item.sys.id })
      );
      setContentTypesList(arrayOfContentTypes);
    })();
    return () => {
      cancelled = true;
    };
  }, [cma.contentType]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!contentTypeSelected) {
        if (!cancelled) setFieldsMeta([]);
        return;
      }
      const contentType = await cma.contentType.get({ contentTypeId: contentTypeSelected });
      if (cancelled) return;
      const meta = (contentType?.fields ?? [])
        .filter((field: ContentFields) => SUPPORTED_FIELD_TYPES.has(field.type))
        .map((field: ContentFields) => ({ id: field.id, type: field.type }));
      setFieldsMeta(meta);
    })();
    return () => {
      cancelled = true;
    };
  }, [contentTypeSelected, cma.contentType]);

  useEffect(() => {
    if (!fieldSelected) return;
    const stillThere = fieldsMeta.some((f) => f.id === fieldSelected);
    if (!stillThere) setFieldSelected(undefined);
  }, [fieldsMeta, fieldSelected]);

  useEffect(() => {
    if (selectedFieldType === 'Symbol' || selectedFieldType === 'Text') {
      setExtraFieldsDraft([]);
    }
  }, [selectedFieldType]);

  return (
    <Flex padding="spacingM" fullWidth>
      <Form className={css({ width: '100%' })}>
        <FormControl>
          <FormControl.Label>Content type</FormControl.Label>
          <Select
            id="optionSelect-contentType"
            name="optionSelect-contentType"
            value={contentTypeSelected ?? ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setContentTypeSelected(event.currentTarget.value || undefined)
            }
          >
            <Select.Option value="">Select content type</Select.Option>
            {contentTypesList?.map((ct, idx) => (
              <Select.Option key={idx} value={ct.id}>
                {ct.name}
              </Select.Option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Field</FormControl.Label>
          <Select
            id="optionSelect-field"
            name="optionSelect-field"
            value={fieldSelected ?? ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setFieldSelected(event.currentTarget.value || undefined)
            }
            isDisabled={!contentTypeSelected}
          >
            <Select.Option value="">Select field</Select.Option>
            {fieldsMeta.map((field) => (
              <Select.Option key={field.id} value={field.id}>
                {field.id} ({field.type})
              </Select.Option>
            ))}
          </Select>
          <FormControl.HelpText>
            Short text (Symbol), long text (Text), and JSON Object fields are supported.
          </FormControl.HelpText>
        </FormControl>

        {contentTypeSelected && fieldsMeta.length === 0 && (
          <Note variant="warning" title="No supported fields">
            This content type has no Symbol, Text, or Object fields. Add one to use the icon picker.
          </Note>
        )}

        <FormControl>
          <FormControl.Label>Icon set</FormControl.Label>
          <Select
            id="optionSelect-iconSet"
            name="optionSelect-iconSet"
            value={iconSetSelected}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setIconSetSelected(event.currentTarget.value)
            }
          >
            {iconSets.map((set) => (
              <Select.Option key={set.id} value={set.id}>
                {set.label}
              </Select.Option>
            ))}
          </Select>
          <FormControl.HelpText>
            Pick the icon library to use. New libraries can be added by registering a provider.
          </FormControl.HelpText>
        </FormControl>

        {isObjectField && (
          <Box marginTop="spacingL" marginBottom="spacingM">
            <FormControl.Label marginBottom="spacingS">Extra fields (list mode)</FormControl.Label>
            <FormControl.HelpText marginBottom="spacingM">
              Optional. When you add at least one extra field, the JSON Object value becomes an ordered array of{' '}
              <code>{'{ icon, ... }'}</code> objects instead of a single <code>{'{ set, name }'}</code>.
            </FormControl.HelpText>

            {extraFieldsDraft.map((row, i) => (
              <Flex
                key={i}
                gap="spacingS"
                alignItems="flex-end"
                marginBottom="spacingM"
                className={css({ flexWrap: 'wrap' })}
              >
                <FormControl>
                  <FormControl.Label>Id</FormControl.Label>
                  <TextInput
                    value={row.id}
                    placeholder="e.g. label"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExtraRow(i, { id: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Label</FormControl.Label>
                  <TextInput
                    value={row.label}
                    placeholder="Display label"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateExtraRow(i, { label: e.target.value })
                    }
                  />
                </FormControl>
                <label
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacingXs,
                    marginBottom: tokens.spacingS,
                  })}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(row.required)}
                    onChange={(e) => updateExtraRow(i, { required: e.target.checked })}
                  />
                  Required
                </label>
                <Button variant="negative" size="small" onClick={() => removeExtraFieldRow(i)}>
                  Remove
                </Button>
              </Flex>
            ))}

            <Button variant="secondary" size="small" onClick={addExtraFieldRow}>
              Add field
            </Button>
          </Box>
        )}

        {submitError && (
          <Note variant="negative" title="Cannot save" className={css({ marginBottom: tokens.spacingM })}>
            {submitError}
          </Note>
        )}

        <Button
          variant={typeof index !== 'undefined' ? 'positive' : 'primary'}
          type="button"
          onClick={submitForm}
          isDisabled={submitted || !isValid}
        >
          {typeof index !== 'undefined' ? 'Edit' : 'Add'}
        </Button>
      </Form>
    </Flex>
  );
};

export default Dialog;
