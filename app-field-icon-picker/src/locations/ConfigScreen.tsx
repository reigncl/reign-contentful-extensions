import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Paragraph,
  Table,
  TextLink,
} from '@contentful/f36-components';
import { AppExtensionSDK, SerializedJSONValue } from '@contentful/app-sdk';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import { DeleteIcon, EditIcon, PlusIcon } from '@contentful/f36-icons';
import { Control } from 'contentful-management';

import { DialogTypes } from './Dialog';
import { listIconSets } from '../icon-sets';
import type { AppInstallationParameters, ConfigJsonStructureItem } from '../types/installConfig';
import { defaultBuiltinWidgetId } from '../util/fieldConfig';

export type { ConfigJsonStructureItem, AppInstallationParameters } from '../types/installConfig';

const ConfigScreen = () => {
  const sdk = useSDK<AppExtensionSDK>();
  const cma = useCMA();
  const [parameters, setParameters] = useState<AppInstallationParameters>({});

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  const updateEditor = async (
    contentType: string,
    fieldId: string,
    widgetId: string,
    widgetNamespace: string = 'builtin'
  ) => {
    try {
      const editor = await cma.editorInterface.get({ contentTypeId: contentType });
      const controls = editor.controls?.map((control: Control) => {
        if (control.fieldId === fieldId) {
          return { ...control, widgetId, widgetNamespace };
        }
        return control;
      });
      await cma.editorInterface.update(
        { contentTypeId: contentType },
        { ...editor, controls }
      );
    } catch (error) {
      console.error('updateEditor error', error);
    }
  };

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
      if (currentParameters) {
        setParameters(currentParameters);
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

  const iconSetLabel = (id: string): string => {
    return listIconSets().find((set) => set.id === id)?.label ?? id;
  };

  const extraFieldsSummary = (item: ConfigJsonStructureItem): string => {
    const ef = item.extraFields;
    if (!ef?.length) return '—';
    return ef.map((e) => e.id).join(', ');
  };

  const TableWithItems = () => {
    if (!parameters.items || parameters.items.length === 0) {
      return (
        <Paragraph>
          No mappings yet. Click <em>Add config</em> to wire this app to a field.
        </Paragraph>
      );
    }
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Content type</Table.Cell>
            <Table.Cell>Field</Table.Cell>
            <Table.Cell>Icon set</Table.Cell>
            <Table.Cell>Extra fields</Table.Cell>
            <Table.Cell>Actions</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {parameters.items.map((item: ConfigJsonStructureItem, itemIndex: number) => (
            <Table.Row key={itemIndex}>
              <Table.Cell>{item?.contentType}</Table.Cell>
              <Table.Cell>{item?.field}</Table.Cell>
              <Table.Cell>{iconSetLabel(item?.iconSet)}</Table.Cell>
              <Table.Cell>{extraFieldsSummary(item)}</Table.Cell>
              <Table.Cell>
                <TextLink
                  as="button"
                  variant="primary"
                  icon={<EditIcon />}
                  alignIcon="end"
                  onClick={() => openDialog(DialogTypes.UPDATE, item, itemIndex)}
                />
                <TextLink
                  as="button"
                  variant="negative"
                  icon={<DeleteIcon />}
                  alignIcon="end"
                  onClick={() => openDeleteDialog(item, itemIndex)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

  const openDialog = async (
    type: DialogTypes,
    item?: ConfigJsonStructureItem,
    index?: number
  ) => {
    try {
      const result: ConfigJsonStructureItem = await sdk.dialogs.openCurrentApp({
        title: type === DialogTypes.ADD ? 'Add new configuration' : 'Edit configuration',
        minHeight: 520,
        parameters: {
          contentType: item?.contentType,
          field: item?.field,
          iconSet: item?.iconSet,
          fieldType: item?.fieldType,
          extraFields: item?.extraFields,
          index,
        } as unknown as SerializedJSONValue,
      });
      const currentItems = parameters.items ?? [];
      if (type === DialogTypes.ADD && result) {
        await updateEditor(result.contentType, result.field, sdk.ids.app, 'app');
        currentItems.push(result);
      }
      if (type === DialogTypes.UPDATE && typeof result?.index !== 'undefined') {
        const previousVersion = currentItems[result.index];
        if (
          previousVersion.contentType !== result.contentType ||
          previousVersion.field !== result.field
        ) {
          await updateEditor(
            previousVersion.contentType,
            previousVersion.field,
            defaultBuiltinWidgetId(previousVersion.fieldType),
            'builtin'
          );
          await updateEditor(result.contentType, result.field, sdk.ids.app, 'app');
        }
        currentItems[result.index] = result;
      }
      if (result) {
        setParameters({ ...parameters, items: currentItems });
      }
    } catch (error) {
      console.log('openDialog error', error);
    }
  };

  const openDeleteDialog = async (item: ConfigJsonStructureItem, index: number) => {
    try {
      const deleteResponse = await sdk.dialogs.openConfirm({
        title: 'Are you sure to delete this configuration?',
        message: '',
      });
      if (deleteResponse) {
        await updateEditor(
          item.contentType,
          item.field,
          defaultBuiltinWidgetId(item.fieldType),
          'builtin'
        );
        const currentItems = parameters.items ?? [];
        currentItems.splice(index, 1);
        setParameters({ ...parameters, items: currentItems });
      }
    } catch (error) {
      console.log('openDeleteDialog error', error);
    }
  };

  return (
    <Flex className={css({ margin: '80px' })}>
      <Box paddingLeft="spacingL">
        <Heading>
          Icon picker configurations{' '}
          <TextLink
            as="button"
            variant="primary"
            icon={<PlusIcon />}
            alignIcon="start"
            onClick={() => openDialog(DialogTypes.ADD)}
          >
            Add config
          </TextLink>
        </Heading>
        <Paragraph>
          Map this app to a <strong>Short text</strong>, <strong>Long text</strong>, or <strong>JSON Object</strong>{' '}
          field. Saving wires the app to the field automatically.
        </Paragraph>
        <TableWithItems />
      </Box>
    </Flex>
  );
};

export default ConfigScreen;
