import { Box, Button, IconButton, Menu, Note, Table, ValidationMessage } from '@contentful/f36-components'
import { useEffect, useState } from 'react'
import { ReferenceMultiSite, InstanceParameters } from '../interfaces'
import { ChevronDownIcon, CloseIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { EntrySelector } from '../components/field-editor-components'
import { EntryFieldAPI, FieldExtensionSDK } from '@contentful/app-sdk'
import { ContentTypeProps } from 'contentful-management'

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const appEnvironmentUri = sdk.ids.environment !== 'master' ? `/environments/${sdk.ids.environment}` : ''
  const appUriContentType = `https://app.contentful.com/spaces/${sdk.ids.space}${appEnvironmentUri}/content_types/${sdk.ids.contentType}/fields`
  const { siteFieldId, contentTypeId } = sdk.parameters.instance as InstanceParameters
  const [sites, setSites] = useState<Array<string>>([])
  const [contentType, setContentType] = useState<ContentTypeProps>()
  let detachExternalChangeHandler: Function | null = null
  let detachSiteChangeHandler: Function | null = null

  const [field, setField] = useState<ReferenceMultiSite>(sdk.field.getValue() ?? {})

  const updateField = (newField: ReferenceMultiSite) => {
    sdk.field.setValue(newField)
    setField(newField)
  }

  const populateContentType = () => {
    cma.contentType
      .get({ contentTypeId })
      .then((data: ContentTypeProps) => {
        setContentType(data)
      })
      .catch((error) => console.log('error', error))
  }

  const onExternalChange = (externalValue: ReferenceMultiSite) => {
    setField(externalValue)
  }

  const siteChangeHandler = (newSites: Array<string> | undefined) => {
    setSites(newSites ?? [])
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    detachSiteChangeHandler = (sdk.entry.fields[siteFieldId] as EntryFieldAPI)?.onValueChanged(siteChangeHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    detachExternalChangeHandler = sdk.field?.onValueChanged(onExternalChange)
    return () => {
      if (detachSiteChangeHandler) detachSiteChangeHandler()
      if (detachExternalChangeHandler) detachExternalChangeHandler()
    }
  }, [])

  useEffect(() => {
    sdk.window.startAutoResizer()
    if (contentTypeId) {
      populateContentType()
    }
    return () => {
      sdk.window.stopAutoResizer()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteFieldId, contentTypeId, contentType, sdk.window])

  useEffect(() => {
    // field
    const filteredField: ReferenceMultiSite = {}
    for (let item in field) {
      if (sites && sites.includes(item)) {
        filteredField[item as string] = field[item]
      }
    }
    updateField(filteredField)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites])

  if (!siteFieldId || !contentTypeId) {
    sdk.window.stopAutoResizer()
    return (
      <ValidationMessage style={{ marginTop: '0.5rem' }}>
        Please complete the app setup for field <strong>{sdk.field.id}</strong>{' '}
        <a href={appUriContentType} target="_blank" rel="noreferrer">
          here
        </a>
        .
      </ValidationMessage>
    )
  }
  if (!contentType) {
    sdk.window.stopAutoResizer()
    return (
      <ValidationMessage style={{ marginTop: '0.5rem' }}>
        The content type (<strong>{contentTypeId}</strong>) does not exist.
        <br />
        Please check the app setup for field <strong>{sdk.field.id}</strong>{' '}
        <a href={appUriContentType} target="_blank" rel="noreferrer">
          here
        </a>
        .
      </ValidationMessage>
    )
  }

  return (
    <div style={{ minHeight: 200 }}>
      <Menu>
        <Menu.Trigger>
          <Button
            isDisabled={sites.length === 0}
            size="small"
            variant="secondary"
            endIcon={<ChevronDownIcon />}
          >
            Select site
          </Button>
        </Menu.Trigger>
        {sites.length > 0 && (
          <Menu.List>
            {sites.map((site, index) => {
              return (
                <Menu.Item
                  key={`${site}-item-${index}`}
                  onClick={() => {
                    const newField = { ...field, [site]: null }
                    updateField(newField)
                  }}
                >
                  {site}
                </Menu.Item>
              )
            })}
          </Menu.List>
        )}
      </Menu>
      <div style={{ paddingTop: '10px' }}>
        {sites.length === 0 && (
          <Note variant="warning">
            Activate a site in <strong>{siteFieldId}</strong> field.
          </Note>
        )}
        {!!sites.length && !!Object.entries(field).length && (
          <Table testId="table">
            <Table.Head testId="tableHead">
              <Table.Row>
                <Table.Cell width="25%" testId="siteCellHead">
                  Site
                </Table.Cell>
                <Table.Cell testId="logoCellHead">Logo</Table.Cell>
                <Table.Cell testId="actionsCellHead">Actions</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {Object.entries(field).map(([siteKey, ReferenceEntry], index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell style={{ verticalAlign: 'middle' }}>{siteKey}</Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'middle' }}>
                      <Box>
                        <EntrySelector
                          entryReference={ReferenceEntry}
                          updateField={(newEntryValue, fieldKey: string) => {
                            updateField({
                              ...field,
                              [fieldKey]: newEntryValue,
                            })
                          }}
                          fieldId={siteKey}
                          contentType={contentType}
                        />
                      </Box>
                    </Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'middle' }}>
                      <IconButton
                        variant="negative"
                        size="small"
                        aria-label={`Delete ${siteKey} config`}
                        icon={<CloseIcon />}
                        onClick={() => {
                          const newField = JSON.parse(JSON.stringify(field))
                          delete newField[siteKey]
                          updateField(newField)
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  )
}

export default Field
