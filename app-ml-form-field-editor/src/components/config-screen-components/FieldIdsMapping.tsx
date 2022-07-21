import {
  FormControl,
  Paragraph,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  Button,
  IconButton,
  Flex,
  Note,
} from '@contentful/f36-components'
import { ContentTypeProps, ContentFields, KeyValueMap } from 'contentful-management'
import { Dispatch, SetStateAction } from 'react'
import { ChevronDownIcon, CloseIcon } from '@contentful/f36-icons'
import { CommonConfigScreenProps, MlFormFieldDefaultKeys } from '../../interfaces'
import { AppInstallationParameters } from '../ConfigScreen'

export const FieldIdsMapping = ({
  parameters,
  setParameters,
  availableFields,
  setAvailableFields,
  contentTypes,
  availableContentTypes,
  setAvailableContentTypes,
}: CommonConfigScreenProps & {
  availableFields?: ContentFields<KeyValueMap>[]
  setAvailableFields: Dispatch<SetStateAction<ContentFields<KeyValueMap>[] | undefined>>
  contentTypes?: ContentTypeProps[]
  availableContentTypes?: ContentTypeProps[]
  setAvailableContentTypes: Dispatch<SetStateAction<ContentTypeProps[] | undefined>>
}) => {
  const updateParameters = (contentType: ContentTypeProps | undefined, fields: ContentFields<KeyValueMap>[]) => {
    const newParameters: AppInstallationParameters = {
      ...parameters,
      fieldIds: Object.values(MlFormFieldDefaultKeys).reduce(
        (prevValue, nextValue) => ({
          ...prevValue,
          [nextValue]: '',
        }),
        {} as AppInstallationParameters['fieldIds'],
      ),
      contentType,
    }

    let newAvailableContentTypes = contentTypes
    if (contentType) {
      newAvailableContentTypes = contentTypes?.filter((c) => c.sys.id !== contentType!.sys.id)
    }
    setAvailableContentTypes(newAvailableContentTypes)
    setParameters(newParameters)
    setAvailableFields(fields)
  }

  const onFieldIdChange = (value: string, defaultFieldId: string) => {
    const newParameters: AppInstallationParameters = {
      ...parameters,
      fieldIds: {
        ...parameters.fieldIds,
        [defaultFieldId]: value,
      },
    }
    setParameters(newParameters)

    const customFieldIds = Object.values(newParameters.fieldIds)
    const fields = newParameters.contentType?.fields.filter(
      (field) => !customFieldIds.find((customFieldId) => field.id === customFieldId),
    )
    setAvailableFields(fields)
  }

  return (
    <FormControl>
      <FormControl.Label>Field Ids Mapping</FormControl.Label>
      <Paragraph>Here you can set custom field ids for your content type.</Paragraph>
      <div style={{ marginBottom: '20px' }}>
        {availableContentTypes?.length && (
          <Flex flexDirection="column" gap="10px">
            <Menu>
              <Menu.Trigger>
                <Button size="small" variant="secondary" endIcon={<ChevronDownIcon />}>
                  Select Content Type
                </Button>
              </Menu.Trigger>
              {availableContentTypes.length > 0 && (
                <Menu.List>
                  {availableContentTypes.map((contentType, index) => {
                    return (
                      <Menu.Item
                        key={`${contentType.name}-item-${index}`}
                        onClick={() => updateParameters(contentType, contentType.fields)}
                      >
                        {contentType.name}
                      </Menu.Item>
                    )
                  })}
                </Menu.List>
              )}
            </Menu>
            {parameters.contentType?.name && (
              <Note>
                Selected Content Type: <strong>{parameters.contentType.name}</strong>.
                <button
                  onClick={() => updateParameters(undefined, [])}
                  style={{
                    color: '#BD002A',
                    fontWeight: 'bold',
                    background: 'transparent',
                    border: '0',
                    cursor: 'pointer',
                  }}
                >
                  Click here to remove it
                </button>
              </Note>
            )}
            {!parameters.contentType && (
              <Note variant="warning">
                <strong>You have to select a Content Type for the Contentful App to work.</strong> Then you can define
                custom field IDs.
              </Note>
            )}
          </Flex>
        )}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Default Field Id</TableCell>
            <TableCell>Selector</TableCell>
            <TableCell>Local Field Id</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(MlFormFieldDefaultKeys).map((defaultFieldId, index) => {
            return (
              <TableRow key={index}>
                <TableCell style={{ verticalAlign: 'middle' }}>{defaultFieldId}</TableCell>
                <TableCell style={{ verticalAlign: 'middle' }}>
                  {availableFields && (
                    <Menu>
                      <Menu.Trigger>
                        <Button
                          isDisabled={availableFields.length === 0}
                          size="small"
                          variant="secondary"
                          endIcon={<ChevronDownIcon />}
                        >
                          Select local field ID
                        </Button>
                      </Menu.Trigger>
                      {availableFields.length > 0 && (
                        <Menu.List>
                          {availableFields.map((availableField, index) => {
                            return (
                              <Menu.Item
                                key={`${availableField.name}-item-${index}`}
                                onClick={() => onFieldIdChange(availableField.id, defaultFieldId)}
                              >
                                {availableField.id}
                              </Menu.Item>
                            )
                          })}
                        </Menu.List>
                      )}
                    </Menu>
                  )}
                </TableCell>
                <TableCell style={{ verticalAlign: 'middle' }}>{parameters.fieldIds[defaultFieldId]}</TableCell>
                <TableCell style={{ verticalAlign: 'middle' }}>
                  <IconButton
                    variant="negative"
                    size="small"
                    isDisabled={!parameters.fieldIds[defaultFieldId]}
                    aria-label={`Delete ${defaultFieldId} mapping`}
                    icon={<CloseIcon />}
                    onClick={() => onFieldIdChange('', defaultFieldId)}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </FormControl>
  )
}
