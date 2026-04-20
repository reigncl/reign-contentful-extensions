import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Note } from '@contentful/f36-components';
import { css } from 'emotion';

import IconPicker from '../components/IconPicker';
import { DEFAULT_ICON_SET_ID, getIconSet, IconValue } from '../icon-sets';

export interface ExtensionParametersInstance {
  contentType?: string;
  field?: string;
  iconSet?: string;
  index?: number;
}

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
  const [value, setValue] = useState<IconValue | null>(
    isIconValue(initialValue) ? initialValue : null
  );

  const iconSetId = parameters?.iconSet ?? DEFAULT_ICON_SET_ID;
  const provider = useMemo(() => getIconSet(iconSetId), [iconSetId]);

  const onChange = async (next: IconValue) => {
    setValue(next);
    await sdk.field.setValue(next);
  };

  const onExternalChange = (externalValue: unknown) => {
    if (isIconValue(externalValue)) {
      setValue(externalValue);
    } else if (externalValue == null) {
      setValue(null);
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

  useEffect(() => {
    const items = sdk.parameters.installation?.items as
      | Array<ExtensionParametersInstance>
      | undefined;
    const paramsFromField = items?.find(
      (item) => item?.contentType === sdk.ids.contentType && item?.field === sdk.ids.field
    );
    setParameters(paramsFromField);
  }, [sdk.parameters, sdk.ids.contentType, sdk.ids.field]);

  if (!provider) {
    return (
      <div className={containerClass}>
        <Note variant="warning" title="Icon set not available">
          Icon set "{iconSetId}" is not registered. Please check the app configuration.
        </Note>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <IconPicker provider={provider} value={value} onChange={onChange} />
    </div>
  );
};

export default Field;
