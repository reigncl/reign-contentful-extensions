import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Form,
  FormControl,
  Note,
  Select,
} from '@contentful/f36-components';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { css } from 'emotion';
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
} from 'contentful-management';

import { ConfigJsonStructureItem } from './ConfigScreen';
import { DEFAULT_ICON_SET_ID, listIconSets } from '../icon-sets';

export enum DialogTypes {
  ADD,
  UPDATE,
}

export interface DialogJsonStructureItem {
  contentType?: string;
  field?: string;
  iconSet?: string;
  index?: number;
}

const SUPPORTED_FIELD_TYPE = 'Object';

const Dialog = () => {
  const cma = useCMA();
  const sdk = useSDK<DialogExtensionSDK>();
  const invocation = sdk.parameters.invocation as unknown as DialogJsonStructureItem;
  const { index } = invocation;

  const [submitted, setSubmitted] = useState(false);
  const [contentTypesList, setContentTypesList] = useState<Array<Record<string, string>>>([]);
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);

  const [contentTypeSelected, setContentTypeSelected] = useState<string | undefined>(
    invocation?.contentType
  );
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(invocation?.field);
  const [iconSetSelected, setIconSetSelected] = useState<string>(
    invocation?.iconSet ?? DEFAULT_ICON_SET_ID
  );

  const iconSets = listIconSets();

  const isValid = Boolean(contentTypeSelected && fieldSelected && iconSetSelected);

  const submitForm = () => {
    if (!isValid) return;
    setSubmitted(true);
    sdk.close({
      contentType: contentTypeSelected,
      field: fieldSelected,
      iconSet: iconSetSelected,
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
        if (!cancelled) setFieldsList([]);
        return;
      }
      const contentType = await cma.contentType.get({ contentTypeId: contentTypeSelected });
      if (cancelled) return;
      const arrayOfFields = (contentType?.fields ?? [])
        .filter((field: ContentFields) => field.type === SUPPORTED_FIELD_TYPE)
        .map((field: ContentFields) => field.id);
      setFieldsList(arrayOfFields);
    })();
    return () => {
      cancelled = true;
    };
  }, [contentTypeSelected, cma.contentType]);

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
          <FormControl.Label>JSON Object field</FormControl.Label>
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
            {fieldsList?.map((field, idx) => (
              <Select.Option key={idx} value={field}>
                {field}
              </Select.Option>
            ))}
          </Select>
          <FormControl.HelpText>
            Only fields of type <code>Object</code> (JSON Object) are listed.
          </FormControl.HelpText>
        </FormControl>

        {contentTypeSelected && fieldsList.length === 0 && (
          <Note variant="warning" title="No JSON Object fields">
            The selected content type has no JSON Object fields. Add one to wire the icon picker.
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
