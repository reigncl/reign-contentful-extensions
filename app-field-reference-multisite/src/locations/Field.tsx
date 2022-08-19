import { Box, Button, IconButton, Menu, Note, Table, ValidationMessage } from '@contentful/f36-components'
import { useEffect, useState } from 'react'
import { LogoLinks, InstanceParameters } from '../interfaces'
import { ChevronDownIcon, CloseIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { EntrySelector } from '../components/field-editor-components'
import { EntryFieldAPI, FieldExtensionSDK } from '@contentful/app-sdk'
import { CollectionProp, ContentTypeFieldValidation, ContentTypeProps } from 'contentful-management'

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const appEnvironmentUri = sdk.ids.environment !== 'master' ? `/environments/${sdk.ids.environment}` : ''
  const appUriContentType = `https://app.contentful.com/spaces/${sdk.ids.space}${appEnvironmentUri}/content_types/${sdk.ids.contentType}/fields`
  const { siteFieldId, contentTypeId } = sdk.parameters.instance as InstanceParameters
  const [sites, setSites] = useState<Array<string>>([])
  const [availableSites, setAvailableSites] = useState<Array<string>>([])
  const [contentType, setContentType] = useState<ContentTypeProps>()

  const [field, setField] = useState<LogoLinks>(sdk.field.getValue() ?? {})

  const updateField = (newField: LogoLinks) => {
    sdk.field.setValue(newField)
    setField(newField)
  }

  const updateAvailableSites = (field: LogoLinks) => {
    setAvailableSites(
      sites.filter((site) => {
        return !Object.keys(field).find((siteKey) => siteKey === site)
      }) ?? []
    )
  }

  const populateSites = () => {
    const validation: ContentTypeFieldValidation | undefined = (
      sdk.entry.fields[siteFieldId] as EntryFieldAPI
    )?.validations?.find((validation: ContentTypeFieldValidation) => {
      for (let validationKey in validation) {
        if (validationKey === 'in') {
          return true
        }
      }
      return false
    })
    if (validation?.in && validation?.in?.length) {
      setSites(validation?.in as Array<string>)
    }
  }

  const populateContentType = () => {
    cma.contentType
      .getMany({})
      .then((data: CollectionProp<ContentTypeProps>) => {
        console.log('data', data)
        data?.items?.map((value: ContentTypeProps) => {
          if (value?.sys?.id === contentTypeId) {
            setContentType(value)
          }
        })
      })
      .catch((error) => console.log('error', error))
  }

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [])

  useEffect(() => {
    if (siteFieldId) {
      populateSites()
    }
    if (contentTypeId) {
      populateContentType()
    }
  }, [siteFieldId, contentTypeId])

  useEffect(() => {
    if (sites && sites?.length) {
      updateAvailableSites(field)
    }
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
            isDisabled={availableSites.length === 0}
            size="small"
            variant="secondary"
            endIcon={<ChevronDownIcon />}
          >
            Select site
          </Button>
        </Menu.Trigger>
        {availableSites.length > 0 && (
          <Menu.List>
            {availableSites.map((site, index) => {
              return (
                <Menu.Item
                  key={`${site}-item-${index}`}
                  onClick={() => {
                    const newField = { ...field, [site]: null }
                    updateField(newField)
                    updateAvailableSites(newField)
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
            There are no sites configured in the <strong>{siteFieldId}</strong> field.
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
              {Object.entries(field).map(([siteKey, logoLink], index) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell style={{ verticalAlign: 'middle' }}>{siteKey}</Table.Cell>
                    <Table.Cell style={{ verticalAlign: 'middle' }}>
                      <Box>
                        <EntrySelector
                          entryReference={logoLink}
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
                          updateAvailableSites(newField)
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
