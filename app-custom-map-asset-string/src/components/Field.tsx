/* eslint-disable no-unused-vars */
import { Asset, PlainClientAPI } from 'contentful-management'
import { Asset as FormaAsset, Heading, Table, TextInput, ValidationMessage } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useEffect, useState } from 'react'
import { BannerImage, InstanceParameters } from '../interfaces'
import { toCamelCase } from '../utils'

interface FieldProps {
  sdk: FieldExtensionSDK
  cma: PlainClientAPI
}

const Field = (props: FieldProps) => {
  const appEnvironmentUri = props.sdk.ids.environment !== 'master' ? `/environments/${props.sdk.ids.environment}` : ''
  const appUriContentType = `https://app.contentful.com/spaces/${props.sdk.ids.space}${appEnvironmentUri}/content_types/${props.sdk.ids.contentType}/fields`

  const firstTextParameter = (props.sdk.parameters.instance as InstanceParameters).firstText
  const firstParameterKey = toCamelCase(firstTextParameter)
  const secondTextParameter = (props.sdk.parameters.instance as InstanceParameters).secondText
  const secondParameterKey = toCamelCase(secondTextParameter)

  const [field, setField] = useState<BannerImage[]>(props.sdk.field.getValue())
  let detachSiteChangeHandler: Function | null = null

  const imagesChangeHandler = async () => {
    if (!firstTextParameter || !firstParameterKey || !secondTextParameter || !secondParameterKey) {
      return
    }

    const imagesField: Asset[] = props.sdk.entry.fields.images?.getValue()

    if (!imagesField) {
      updateField([])
      return
    }

    const cleanedImages: BannerImage[] = []
    const fieldBuilder = imagesField.map(async (image) => {
      const foundedImage = field.find((bannerImage) => bannerImage.imageId === image.sys.id)
      if (foundedImage) {
        cleanedImages.push(foundedImage)
      } else {
        const contentfulImage = await props.cma.asset.get({ assetId: image.sys.id })
        cleanedImages.push({
          [firstParameterKey]: '',
          [secondParameterKey]: '',
          imageId: image.sys.id,
          imageUrl: contentfulImage.fields.file[props.sdk.field.locale].url!,
        })
      }
    })

    await Promise.all(fieldBuilder)
    updateField(cleanedImages)
  }

  const updateField = (newField: BannerImage[]) => {
    props.sdk.field.setValue(newField)
    setField(newField)
  }

  useEffect(() => {
    props.sdk.window.startAutoResizer()
    imagesChangeHandler()

    detachSiteChangeHandler = props.sdk.entry.fields.images.onValueChanged(imagesChangeHandler)

    return () => {
      if (detachSiteChangeHandler) detachSiteChangeHandler()
    }
  }, [])

  if (!firstTextParameter || !secondTextParameter) {
    props.sdk.window.stopAutoResizer()
    return (
      <ValidationMessage style={{ marginTop: '0.5rem' }}>
        Please complete the app setup for field <strong>{props.sdk.field.id}</strong>{' '}
        <a href={appUriContentType} target="_blank" rel="noreferrer">
          here
        </a>
        .
      </ValidationMessage>
    )
  }

  if (field.length === 0) {
    return (
      <Heading style={{ textAlign: 'center' }} testId="noImagesHeading">
        No images
      </Heading>
    )
  }

  return (
    <Table testId="table">
      <Table.Head testId="tableHead">
        <Table.Row>
          <Table.Cell width="25%" testId="firstInputCellHead">
            {firstTextParameter}
          </Table.Cell>
          <Table.Cell width="25%" testId="secondInputCellHead">
            {secondTextParameter}
          </Table.Cell>
          <Table.Cell testId="imageCellHead">Image</Table.Cell>
        </Table.Row>
      </Table.Head>

      <Table.Body testId="tableBody">
        {field.map(({ imageUrl, imageId, [firstParameterKey]: firstInput, [secondParameterKey]: secondInput }, idx) => (
          <Table.Row key={`${idx}-${imageId}`}>
            <Table.Cell>
              <TextInput
                testId={`firstTextInput-${idx}-${firstParameterKey}`}
                onChange={(e) => {
                  const newField: BannerImage[] = JSON.parse(JSON.stringify(field))
                  newField[idx][firstParameterKey] = e.target.value
                  updateField(newField)
                }}
                defaultValue={firstInput}
              />
            </Table.Cell>
            <Table.Cell>
              <TextInput
                testId={`secondTextInput-${idx}-${secondParameterKey}`}
                onChange={(e) => {
                  const newField: BannerImage[] = JSON.parse(JSON.stringify(field))
                  newField[idx][secondParameterKey] = e.target.value
                  updateField(newField)
                }}
                defaultValue={secondInput}
              />
            </Table.Cell>
            <Table.Cell>
              <FormaAsset type="image" src={imageUrl} style={{ width: '100%', height: 100 }} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default Field
