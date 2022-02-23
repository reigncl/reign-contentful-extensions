import { Asset, PlainClientAPI } from 'contentful-management'
import { Asset as FormaAsset, Heading, Table, TextInput } from '@contentful/f36-components'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useEffect, useState } from 'react'
import { BannerImage } from '../interfaces'

interface FieldProps {
  sdk: FieldExtensionSDK
  cma: PlainClientAPI
}

const Field = (props: FieldProps) => {
  const [field, setField] = useState<BannerImage[]>(props.sdk.field.getValue())
  let detachSiteChangeHandler: Function | null = null

  const imagesChangeHandler = async () => {
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
          category: '',
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

  if (field.length === 0) {
    console.log('no field')
    console.log(field)

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
          <Table.Cell width="50%" testId="categoryCellHead">
            Category
          </Table.Cell>
          <Table.Cell testId="imageCellHead">Image</Table.Cell>
        </Table.Row>
      </Table.Head>

      <Table.Body testId="tableBody">
        {field.map(({ imageUrl, imageId, category }, idx) => (
          <Table.Row key={`${idx}-${imageId}`}>
            <Table.Cell>
              <TextInput
                onChange={(e) => {
                  const newField: BannerImage[] = JSON.parse(JSON.stringify(field))
                  newField[idx].category = e.target.value
                  updateField(newField)
                }}
                defaultValue={category}
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
