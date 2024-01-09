import { useEffect, useState } from "react";
import {
  AppInstallationContentType,
  AppInstallationParameters,
} from "../../../locations/ConfigScreen";
import { FieldSetupItem, Interface } from "../FieldSetup.types";
import { SetupConfigurationDialogProps } from "./SetupConfigurations.types";
import {
  CollectionProp,
  ContentTypeProps,
  ContentFields,
} from "contentful-management";
import {
  Form,
  Heading,
  HelpText,
  FormControl,
  Select,
  Button,
  Box,
} from "@contentful/f36-components";
import { updateEditor } from "../../../tools";

const SetupConfigurationDialog = ({ sdk }: SetupConfigurationDialogProps) => {
  const { contentType, fieldId } = sdk.parameters
    .installation as AppInstallationParameters;
  const parameters = sdk.parameters.invocation as unknown as FieldSetupItem & {
    index?: number;
    interfaces?: Interface[];
  };
  const [contentTypesList, setContentTypesList] = useState<
    Array<AppInstallationContentType>
  >([]);
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);
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
  const [interfaces] = useState<Interface[]>(parameters?.interfaces ?? []);

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
      index: indexConfiguration,
    } as FieldSetupItem & {
      index?: number;
    });
  };

  useEffect(() => {
    (async () => {
      if (
        !contentTypesList ||
        (contentTypesList && contentTypesList?.length === 0)
      ) {
        const collectionResponse: CollectionProp<ContentTypeProps> =
          await sdk.cma.contentType.getMany({
            query: { order: "sys.id" },
          });
        const arrayOfContentTypes = collectionResponse?.items?.map(
          (item: ContentTypeProps) => {
            return {
              name: item.name,
              id: item.sys.id,
            };
          }
        );
        setContentTypesList(arrayOfContentTypes);
      }
    })();
  }, [contentTypesList, sdk.cma.contentType]);

  useEffect(() => {
    (async () => {
      const getArrayOfFieldsFromContentType = async (contentTypeId: string) => {
        const contentTypePage = await sdk.cma.contentType.get({
          contentTypeId,
        });
        return contentTypePage?.fields
          ?.filter((field: ContentFields) => field.type === "Object")
          ?.map((field: ContentFields) => field.id);
      };
      if (contentTypeSelected) {
        const arrayOfFields = await getArrayOfFieldsFromContentType(
          contentTypeSelected
        );
        setFieldsList(arrayOfFields);
      }
    })();
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
            {contentTypesList?.map(
              (ct: AppInstallationContentType, index: number) => {
                return (
                  <Select.Option key={index} value={ct.id}>
                    {ct.name}
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
              if (fieldSelected) {
                await updateEditor({
                  sdk,
                  contentType: contentTypeSelected,
                  fieldId: fieldSelected,
                  widgetId: "objectEditor",
                });
              }
              setFieldSelected(e.currentTarget.value);
            }}
          >
            <Select.Option value="">Select field</Select.Option>
            {fieldsList?.map((field: string, index: number) => {
              return (
                <Select.Option
                  key={index}
                  value={field}
                  isDisabled={
                    contentTypeSelected === contentType && field === fieldId
                  }
                >
                  {field}
                </Select.Option>
              );
            })}
          </Select>
          <HelpText>Select the field you want to configure.</HelpText>
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
        <Button variant="primary" type="submit">
          {typeof indexConfiguration === "undefined" ? "Add" : "Edit"}{" "}
          configuration
        </Button>
      </Form>
    </Box>
  );
};

export default SetupConfigurationDialog;
