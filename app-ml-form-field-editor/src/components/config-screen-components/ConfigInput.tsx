import { FormControl, Paragraph, TextInput } from '@contentful/f36-components'
import { CommonConfigScreenProps } from '../../interfaces'
import { AppInstallationParameters } from '../ConfigScreen'

export const ConfigInput = ({
  parameters,
  setParameters,
  label,
  paragraph,
  id,
  placeholder,
}: CommonConfigScreenProps & {
  label: string
  paragraph: string
  id: keyof Omit<AppInstallationParameters, 'fieldIds' | 'contentType'>
  placeholder: string
}) => {
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <Paragraph>{paragraph}</Paragraph>
      <TextInput
        testId={id}
        onChange={(e) => {
          setParameters({ ...parameters, [id]: e.target.value })
        }}
        defaultValue={parameters[id]}
        value={parameters[id]}
        placeholder={placeholder}
        css={{ width: 150 }}
      />
    </FormControl>
  )
}
