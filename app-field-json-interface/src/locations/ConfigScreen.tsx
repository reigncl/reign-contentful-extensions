import { AppExtensionSDK, SerializedJSONValue } from '@contentful/app-sdk'
import { Box, Flex, Heading, Table, TextLink } from '@contentful/f36-components'
import { DeleteIcon, EditIcon, PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { css } from 'emotion'
import { Control } from 'contentful-management'
import { useCallback, useEffect, useState } from 'react'
import { DialogResult, InstallationParams, SchemaItem } from '../types'

export type { InstallationParams, SchemaItem }

enum DialogMode {
  ADD,
  UPDATE,
}

const ConfigScreen = () => {
  const sdk = useSDK<AppExtensionSDK>()
  const cma = useCMA()
  const [items, setItems] = useState<SchemaItem[]>([])

  useEffect(() => {
    ;(async () => {
      const params = (await sdk.app.getParameters()) as InstallationParams | null
      setItems(params?.items ?? [])
      sdk.app.setReady()
    })()
  }, [sdk])

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState()
    return { parameters: { items }, targetState: currentState }
  }, [items, sdk])

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure())
  }, [sdk, onConfigure])

  const setWidgetForField = async (
    contentType: string,
    fieldId: string,
    widgetId: string,
    widgetNamespace = 'builtin'
  ) => {
    try {
      const editor = await cma.editorInterface.get({ contentTypeId: contentType })
      const controls = editor.controls?.map((control: Control) =>
        control.fieldId === fieldId ? { ...control, widgetId, widgetNamespace } : control
      )
      await cma.editorInterface.update({ contentTypeId: contentType }, { ...editor, controls })
    } catch {}
  }

  const openDialog = async (mode: DialogMode, item?: SchemaItem, index?: number) => {
    try {
      const result = (await sdk.dialogs.openCurrentApp({
        title: mode === DialogMode.ADD ? 'Add JSON structure' : 'Edit JSON structure',
        minHeight: 500,
        parameters: {
          contentType: item?.contentType,
          field: item?.field,
          json: JSON.stringify(item?.json ?? {}),
          index,
        } as unknown as SerializedJSONValue,
      })) as DialogResult | null

      if (!result) return

      if (mode === DialogMode.ADD) {
        await setWidgetForField(result.contentType, result.field, sdk.ids.app, 'app')
        setItems(prev => [...prev, result])
      } else if (mode === DialogMode.UPDATE && typeof result.index !== 'undefined') {
        const prev = items[result.index]
        if (prev.contentType !== result.contentType || prev.field !== result.field) {
          await setWidgetForField(prev.contentType, prev.field, 'objectEditor')
          await setWidgetForField(result.contentType, result.field, sdk.ids.app, 'app')
        }
        setItems(current => current.map((it, i) => (i === result.index ? result : it)))
      }
    } catch (err) {
      console.error('openDialog error', err)
    }
  }

  const openDeleteDialog = async (item: SchemaItem, index: number) => {
    try {
      const confirmed = await sdk.dialogs.openConfirm({
        title: 'Delete JSON structure?',
        message: `This will remove the structure for "${item.field}" in "${item.contentType}".`,
      })
      if (!confirmed) return
      await setWidgetForField(item.contentType, item.field, 'objectEditor')
      setItems(prev => prev.filter((_, i) => i !== index))
    } catch (err) {
      console.error('openDeleteDialog error', err)
    }
  }

  return (
    <Flex className={css({ margin: '80px' })}>
      <Box paddingLeft="spacingL">
        <Heading>
          JSON Structure Items{' '}
          <TextLink
            as="button"
            variant="primary"
            icon={<PlusIcon />}
            alignIcon="start"
            onClick={() => openDialog(DialogMode.ADD)}
          >
            Add JSON
          </TextLink>
        </Heading>

        {items.length > 0 && (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Content type</Table.Cell>
                <Table.Cell>Field ID</Table.Cell>
                <Table.Cell>Actions</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {items.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{item.contentType}</Table.Cell>
                  <Table.Cell>{item.field}</Table.Cell>
                  <Table.Cell>
                    <TextLink
                      as="button"
                      variant="primary"
                      icon={<EditIcon />}
                      alignIcon="end"
                      onClick={() => openDialog(DialogMode.UPDATE, item, idx)}
                    />
                    <TextLink
                      as="button"
                      variant="negative"
                      icon={<DeleteIcon />}
                      alignIcon="end"
                      onClick={() => openDeleteDialog(item, idx)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Box>
    </Flex>
  )
}

export default ConfigScreen
