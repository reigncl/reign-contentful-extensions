import { DialogExtensionSDK } from '@contentful/app-sdk'
import { Button, Flex, Form, FormControl, Select, Textarea } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { CollectionProp, ContentFields, ContentTypeProps } from 'contentful-management'
import { css } from 'emotion'
import { useEffect, useState } from 'react'
import { DialogInvocation, DialogResult, ObjectSchema } from '../types'

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>()
  const cma = useCMA()
  const invocation = sdk.parameters.invocation as unknown as DialogInvocation

  const [contentTypes, setContentTypes] = useState<{ id: string; name: string }[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [contentType, setContentType] = useState(invocation.contentType ?? '')
  const [field, setField] = useState(invocation.field ?? '')
  const [json, setJson] = useState(formatJson(invocation.json ?? '{}'))
  const [jsonValid, setJsonValid] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    ;(async () => {
      const response: CollectionProp<ContentTypeProps> = await cma.contentType.getMany({
        query: { order: 'sys.id' },
      })
      setContentTypes(
        response.items.map(ct => ({ id: ct.sys.id, name: ct.name }))
      )
    })()
  }, [cma.contentType])

  useEffect(() => {
    if (!contentType) {
      setFields([])
      return
    }
    ;(async () => {
      const ct = await cma.contentType.get({ contentTypeId: contentType })
      setFields(
        ct.fields
          .filter((f: ContentFields) => f.type === 'Object')
          .map((f: ContentFields) => f.id)
      )
    })()
  }, [contentType, cma.contentType])

  const handleSubmit = () => {
    if (!jsonValid || !contentType || !field) return
    setSubmitted(true)
    sdk.close({
      contentType,
      field,
      json: JSON.parse(json) as ObjectSchema,
      index: invocation.index,
    } as DialogResult)
  }

  const handleJsonChange = (raw: string) => {
    setJson(raw)
    try {
      JSON.parse(raw)
      setJsonValid(true)
    } catch {
      setJsonValid(false)
    }
  }

  const isEditing = typeof invocation.index !== 'undefined'
  const canSubmit = !submitted && jsonValid && !!contentType && !!field

  return (
    <Flex padding="spacingM" fullWidth>
      <Form className={css({ width: '100%' })} onSubmit={handleSubmit}>
        <FormControl>
          <FormControl.Label>Content type</FormControl.Label>
          <Select
            value={contentType}
            onChange={e => {
              setContentType(e.currentTarget.value)
              setField('')
            }}
          >
            <Select.Option value="">Select content type</Select.Option>
            {contentTypes.map(ct => (
              <Select.Option key={ct.id} value={ct.id}>
                {ct.name}
              </Select.Option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Object field</FormControl.Label>
          <Select
            value={field}
            onChange={e => setField(e.currentTarget.value)}
          >
            <Select.Option value="">Select field</Select.Option>
            {fields.map(f => (
              <Select.Option key={f} value={f}>
                {f}
              </Select.Option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired isInvalid={!jsonValid}>
          <FormControl.Label>JSON structure</FormControl.Label>
          <Textarea
            rows={10}
            value={json}
            onChange={e => handleJsonChange(e.target.value)}
          />
          {!jsonValid && (
            <FormControl.ValidationMessage>Invalid JSON</FormControl.ValidationMessage>
          )}
        </FormControl>

        <Button
          variant={isEditing ? 'positive' : 'primary'}
          type="submit"
          isDisabled={!canSubmit}
        >
          {isEditing ? 'Save changes' : 'Add'}
        </Button>
      </Form>
    </Flex>
  )
}

function formatJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

export default Dialog
