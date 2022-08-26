import { Box, Note, Table, ValidationMessage } from '@contentful/f36-components'
import { useEffect, useState } from 'react'
import { ReferenceMultiSite, InstanceParameters } from '../interfaces'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { EntrySelector } from '../components/field-editor-components'
import { EntryFieldAPI, FieldExtensionSDK } from '@contentful/app-sdk'
import { ContentTypeProps } from 'contentful-management'
import { useIsMounted } from '../hooks'

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const appEnvironmentUri =
    sdk.ids.environment !== 'master' ? `/environments/${sdk.ids.environment}` : ''
  const appUriContentType = `https://app.contentful.com/spaces/${sdk.ids.space}${appEnvironmentUri}/content_types/${sdk.ids.contentType}/fields`
  const { siteFieldId, contentTypeId, validFieldId } = sdk.parameters.instance as InstanceParameters
  const [sites, setSites] = useState<Array<string>>([])
  const [isFieldValid, setIsFieldValid] = useState<boolean>(true)
  const [contentType, setContentType] = useState<ContentTypeProps>()
  const [hasCheckedContentType, setHasCheckedContentType] = useState(false)

  let detachExternalChangeHandler: Function | null = null
  let detachSitesFieldChangeHandler: Function | null = null

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
      .finally(() => setHasCheckedContentType(true))
  }

  const onExternalChange = (externalValue: ReferenceMultiSite) => {
    setField(externalValue ?? {})
  }

  const sitesFieldChangeHandler = (newSites: Array<string> | undefined) => {
    setSites(newSites ?? [])
  }

  const isMounted = useIsMounted()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    detachSitesFieldChangeHandler = (
      sdk.entry.fields[siteFieldId] as EntryFieldAPI
    )?.onValueChanged(sitesFieldChangeHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    detachExternalChangeHandler = sdk.field?.onValueChanged(onExternalChange)
    return () => {
      if (detachSitesFieldChangeHandler) detachSitesFieldChangeHandler()
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
  }, [])

  const validateEntry = () => {
    const appFields = sdk.editor.editorInterface.controls?.filter(
      (control) => control.widgetId === sdk.ids.app
    )
    const validFields = appFields?.every((field) => {
      const entryField = sdk.entry.fields[field.fieldId].getValue()
      return (
        Object.keys(entryField).length === sites.length &&
        Object.values(entryField).every((value) => !!value)
      )
    })

    const validField = sdk.entry.fields[validFieldId].getForLocale(sdk.locales.default)
    if (validFields) validField.setValue('true')
    else validField.setValue('false')
  }

  const validateField = async () => {
    const isValid = sites.every((site) => site && !!field[site])
    setIsFieldValid(isValid)
    sdk.field.setInvalid(!isValid)

    validateEntry()
  }

  useEffect(() => {
    if (sites && isMounted && field) {
      const filteredField: ReferenceMultiSite = {}
      sites.forEach((site) => {
        if (site in field) {
          filteredField[site as string] = field[site]
        } else {
          filteredField[site as string] = null
        }
      })

      updateField(filteredField)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites])

  useEffect(() => {
    if (sites && isMounted && field) {
      validateField()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

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

  if (!hasCheckedContentType) return <span>Loading...</span>

  if (!contentType && hasCheckedContentType) {
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
                <Table.Cell testId="logoCellHead">Entry</Table.Cell>
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
                          contentType={contentType!}
                        />
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        )}
      </div>
      {!isFieldValid ? (
        <ValidationMessage style={{ marginTop: '0.5rem' }}>
          {(sdk.parameters.instance as InstanceParameters)?.errorMessage ??
            `You have to select an entry per site`}
        </ValidationMessage>
      ) : null}
    </div>
  )
}

export default Field
