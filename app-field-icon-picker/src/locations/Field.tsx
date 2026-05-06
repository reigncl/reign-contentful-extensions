import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Note } from '@contentful/f36-components';
import { css } from 'emotion';

import IconPicker from '../components/IconPicker';
import IconListEditor from '../components/IconListEditor';
import { DEFAULT_ICON_SET_ID, getIconSet, IconValue } from '../icon-sets';
import type { ConfigJsonStructureItem, ExtraFieldDef } from '../types/installConfig';
import {
  ListRow,
  normalizeListValue,
  rowsToPersistedList,
} from '../util/fieldConfig';

export type ExtensionParametersInstance = Omit<ConfigJsonStructureItem, 'index'>;

const isIconValue = (value: unknown): value is IconValue => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.set === 'string' && typeof candidate.name === 'string';
};

const containerClass = css({
  padding: '8px 4px',
});

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const detachExternalChangeHandler = useRef<Function>();
  const [parameters, setParameters] = useState<ExtensionParametersInstance | undefined>();

  const initialValue = sdk.field?.getValue();
  const [objectValue, setObjectValue] = useState<IconValue | null>(
    isIconValue(initialValue) ? initialValue : null
  );
  const [stringValue, setStringValue] = useState<string | null>(
    typeof initialValue === 'string' ? initialValue : null
  );
  const [listRows, setListRows] = useState<ListRow[]>([]);

  const iconSetId = parameters?.iconSet ?? DEFAULT_ICON_SET_ID;
  const provider = useMemo(() => getIconSet(iconSetId), [iconSetId]);

  const fieldType = sdk.field?.type ?? '';
  const extraFields: ExtraFieldDef[] | undefined =
    parameters?.extraFields && parameters.extraFields.length > 0
      ? parameters.extraFields
      : undefined;

  const listMode = fieldType === 'Object' && Boolean(extraFields?.length);
  const stringMode = fieldType === 'Symbol' || fieldType === 'Text';
  const objectMode = fieldType === 'Object' && !listMode;

  const syncFromField = useCallback(() => {
    const v = sdk.field.getValue();
    const cfg = (sdk.parameters.installation?.items as Array<ExtensionParametersInstance> | undefined)?.find(
      (item) => item?.contentType === sdk.ids.contentType && item?.field === sdk.ids.field
    );
    const ef = cfg?.extraFields?.length ? cfg.extraFields : undefined;
    const ft = sdk.field.type;

    if (ft === 'Object' && ef?.length) {
      setListRows(normalizeListValue(v, ef));
      return;
    }
    if (ft === 'Symbol' || ft === 'Text') {
      setStringValue(typeof v === 'string' ? v : null);
      return;
    }
    if (ft === 'Object') {
      setObjectValue(isIconValue(v) ? v : null);
    }
  }, [sdk]);

  useEffect(() => {
    const items = sdk.parameters.installation?.items as
      | Array<ExtensionParametersInstance>
      | undefined;
    const paramsFromField = items?.find(
      (item) => item?.contentType === sdk.ids.contentType && item?.field === sdk.ids.field
    );
    setParameters(paramsFromField);
  }, [sdk.parameters, sdk.ids.contentType, sdk.ids.field]);

  useEffect(() => {
    syncFromField();
  }, [parameters, fieldType, syncFromField]);

  const onChangeObject = async (next: IconValue) => {
    setObjectValue(next);
    await sdk.field.setValue(next);
  };

  const onChangeString = async (next: string) => {
    setStringValue(next);
    await sdk.field.setValue(next);
  };

  const onChangeList = async (rows: ListRow[]) => {
    if (!extraFields) return;
    setListRows(rows);
    await sdk.field.setValue(rowsToPersistedList(rows, extraFields));
  };

  const onExternalChange = (externalValue: unknown) => {
    const cfg = (sdk.parameters.installation?.items as Array<ExtensionParametersInstance> | undefined)?.find(
      (item) => item?.contentType === sdk.ids.contentType && item?.field === sdk.ids.field
    );
    const ef = cfg?.extraFields?.length ? cfg.extraFields : undefined;
    const ft = sdk.field.type;

    if (ft === 'Object' && ef?.length) {
      setListRows(normalizeListValue(externalValue, ef));
      return;
    }
    if (ft === 'Symbol' || ft === 'Text') {
      setStringValue(typeof externalValue === 'string' ? externalValue : null);
      return;
    }
    if (ft === 'Object') {
      if (isIconValue(externalValue)) setObjectValue(externalValue);
      else if (externalValue == null) setObjectValue(null);
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    detachExternalChangeHandler.current = sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler.current) {
        detachExternalChangeHandler.current();
      }
    };
  }, [sdk]);

  if (!provider) {
    return (
      <div className={containerClass}>
        <Note variant="warning" title="Icon set not available">
          Icon set "{iconSetId}" is not registered. Please check the app configuration.
        </Note>
      </div>
    );
  }

  if (fieldType !== 'Symbol' && fieldType !== 'Text' && fieldType !== 'Object') {
    return (
      <div className={containerClass}>
        <Note variant="warning" title="Unsupported field type">
          This app supports <strong>Short text</strong> (Symbol), <strong>Long text</strong> (Text), and{' '}
          <strong>JSON Object</strong> fields only. Current type: {fieldType || '(unknown)'}.
        </Note>
      </div>
    );
  }

  if (listMode && extraFields) {
    return (
      <div className={containerClass}>
        <IconListEditor
          provider={provider}
          extraFields={extraFields}
          value={listRows}
          onChange={onChangeList}
        />
      </div>
    );
  }

  if (stringMode) {
    return (
      <div className={containerClass}>
        <IconPicker
          variant="plainName"
          provider={provider}
          value={stringValue}
          onChange={onChangeString}
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <IconPicker provider={provider} value={objectValue} onChange={onChangeObject} />
    </div>
  );
};

export default Field;
