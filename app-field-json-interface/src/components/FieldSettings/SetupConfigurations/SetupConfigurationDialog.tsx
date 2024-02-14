import { useEffect, useState } from "react";
import {
  ContentTypeInfo,
} from "../../../locations/ConfigScreen";
import { FieldSetupItem, Interface } from "../FieldSetup.types";
import { SetupConfigurationDialogProps } from "./SetupConfigurations.types";
import {
  ContentFields,
  KeyValueMap,
} from "contentful-management";
import {
  Form,
  Heading,
  HelpText,
  FormControl,
  Select,
  Button,
  Box,
  TextInput,
} from "@contentful/f36-components";
import { updateEditor } from "../../../util";

const SetupConfigurationDialog = ({ sdk }: SetupConfigurationDialogProps) => {
  const parameters = sdk.parameters.invocation as unknown as FieldSetupItem & {
    index?: number;
    interfaces?: Interface[];
    contentTypes?: Array<ContentTypeInfo>;
    configurations?: Array<FieldSetupItem>;
  };
  const [indexConfiguration] = useState<number | undefined>(parameters?.index);
  const [contentTypeSelected, setContentTypeSelected] = useState<
    string | undefined
  >(parameters?.contentType);
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(
    parameters?.fieldId
  );
  const [interfaceSelected, setInterfaceSelected] = useState<
    string | undefined
  >(parameters?.interfaceId);
  const [min, setMin] = useState<number | undefined>(parameters?.min);
  const [max, setMax] = useState<number | undefined>(parameters?.max);
  const [interfaces] = useState<Interface[]>(parameters?.interfaces ?? []);
  const [fieldsList, setFieldsList] = useState<ContentTypeInfo["fields"]>([]);

  const submitForm = async () => {
    await updateEditor({
      sdk,
      contentType: contentTypeSelected,
      fieldId: fieldSelected,
      widgetId: sdk.ids.app,
      widgetNamespace: "app",
    });
    sdk.close({
      contentType: contentTypeSelected,
      fieldId: fieldSelected,
      interfaceId: interfaceSelected,
      min,
      max,
      index: indexConfiguration,
    } as FieldSetupItem & {
      index?: number;
    });
  };

  const isInvalidMinMax = (): boolean => {
    if (typeof min === "number" && typeof max === "number") {
      return min > max;
    }
    return false;
  };

  useEffect(() => {
    setFieldsList([]);
    if (parameters && parameters?.contentTypes && contentTypeSelected) {
      const arrayOfFields = parameters.contentTypes?.find(
        (ct: ContentTypeInfo) => contentTypeSelected === ct.id
      )?.fields;
      setFieldsList(arrayOfFields ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeSelected]);

  return (
    <Box padding="spacingM">
      <Form onSubmit={submitForm}>
        <Heading>Configuration</Heading>
        <FormControl>
          <FormControl.Label isRequired>Content type</FormControl.Label>
          <Select
            id="optionSelect-SelectContentType"
            name="optionSelect-SelectContentType"
            value={contentTypeSelected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setContentTypeSelected(e.currentTarget.value)
            }
          >
            <Select.Option value="">Select content type</Select.Option>
            {parameters?.contentTypes?.map(
              (ctInfo: ContentTypeInfo, index: number) => {
                return (
                  <Select.Option key={index} value={ctInfo.id}>
                    {ctInfo?.name}
                  </Select.Option>
                );
              }
            )}
          </Select>
          <HelpText>
            Select the content type where the field you want to configure is
            located.
          </HelpText>
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>Field</FormControl.Label>
          <Select
            id="optionSelect-SelectSiteField"
            name="optionSelect-SelectSiteField"
            value={fieldSelected}
            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
              if (fieldSelected && interfaceSelected && typeof parameters?.index === 'number') {
                await updateEditor({
                  sdk,
                  contentType: contentTypeSelected,
                  fieldId: fieldSelected,
                  widgetId: "objectEditor",
                });
              }
              setFieldSelected(e?.currentTarget?.value ?? undefined);
            }}
          >
            <Select.Option value="">Select field</Select.Option>
            {fieldsList?.map(
              (field: ContentFields<KeyValueMap>, index: number) => {
                const config: FieldSetupItem | undefined =
                  parameters?.configurations?.find(
                    (cf) =>
                      cf.contentType === contentTypeSelected &&
                      field.id === cf.fieldId
                  );
                return (
                  <Select.Option
                    key={index}
                    value={field.id}
                    isDisabled={typeof config !== 'undefined'}
                  >
                    {field.id}
                  </Select.Option>
                );
              }
            )}
          </Select>
          <HelpText>Select the field with type Object to configure.</HelpText>
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>Interface</FormControl.Label>
          <Select
            id="optionSelect-Interface"
            name="optionSelect-Interface"
            value={interfaceSelected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setInterfaceSelected(e.currentTarget.value)
            }
          >
            <Select.Option value="">Select Interface</Select.Option>
            {interfaces?.map((interfaceItem: Interface, index: number) => {
              return (
                <Select.Option key={index} value={interfaceItem?.id}>
                  {interfaceItem?.name} - ( {interfaceItem?.id} )
                </Select.Option>
              );
            })}
          </Select>
          <HelpText>Select the interface you want to attach.</HelpText>
        </FormControl>
        {interfaces?.find((iface: Interface) => interfaceSelected === iface.id)
          ?.isArray && (
          <>
            <FormControl>
              <FormControl.Label>Min & max items</FormControl.Label>
              <TextInput.Group>
                <TextInput
                  id="config-min-items"
                  name="config-min-items"
                  placeholder="min"
                  type="number"
                  min={0}
                  value={min?.toString()}
                  onChange={(e) =>
                    setMin(parseInt(e.currentTarget.value ?? null))
                  }
                />
                <TextInput
                  id="config-max-items"
                  name="config-max-items"
                  placeholder="max"
                  type="number"
                  min={max ?? 0}
                  value={max?.toString()}
                  onChange={(e) =>
                    setMax(parseInt(e.currentTarget.value ?? null))
                  }
                />
              </TextInput.Group>
              <HelpText>
                If the interface is multiple, you can set up a minimum and
                maximum quantity of items.
              </HelpText>
            </FormControl>
          </>
        )}
        <Button variant="primary" type="submit" isDisabled={isInvalidMinMax()}>
          {typeof indexConfiguration === "undefined" ? "Add" : "Edit"}{" "}
          configuration
        </Button>
      </Form>
    </Box>
  );
};

export default SetupConfigurationDialog;
