import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK } from "@contentful/app-sdk";
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  Button,
  FormControl,
  HelpText,
  Select,
  Notification,
} from "@contentful/f36-components";
import { css } from "emotion";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import {
  CollectionProp,
  ContentTypeProps,
  ContentFields,
} from "contentful-management";
import { updateEditor } from "../util";

export interface AppInstallationParameters {
  contentType?: string;
  fieldId?: string;
}

export interface AppInstallationContentType {
  name?: string;
  id?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const sdk = useSDK<ConfigAppSDK>();
  const [contentTypesList, setContentTypesList] = useState<
    Array<AppInstallationContentType>
  >([]);
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);
  const [submitted, setSubmitted] = useState(true);
  const [contentTypeSelected, setContentTypeSelected] = useState<
    string | undefined
  >(parameters?.contentType);
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(
    parameters?.fieldId
  );

  const submitForm = async () => {
    setSubmitted(false);
    if (parameters?.contentType && parameters?.fieldId) {
      await updateEditor({
        sdk,
        contentType: parameters?.contentType,
        fieldId: parameters?.fieldId,
        widgetId: "objectEditor",
      });
    }
    setParameters({
      contentType: contentTypeSelected,
      fieldId: fieldSelected,
    });
    if (contentTypeSelected && fieldSelected) {
      await updateEditor({
        sdk,
        contentType: contentTypeSelected,
        fieldId: fieldSelected,
        widgetId: sdk.ids.app,
        widgetNamespace: "app",
      });
    }
    setSubmitted(true);

    Notification.info("Configuration created, now save settings.");
  };

  const resetForm = async () => {
    if (parameters?.contentType && parameters?.fieldId) {
      await updateEditor({
        sdk,
        contentType: parameters?.contentType,
        fieldId: parameters?.fieldId,
        widgetId: "objectEditor",
      });
    }
    setContentTypeSelected('');
    setFieldSelected('');
    setParameters({});
  };

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  const onContentTypeChange = async (contentTypeId: string) => {
    setSubmitted(false);
    setContentTypeSelected(contentTypeId);
  };

  const onFieldSiteChange = async (fieldId: string) => {
    setSubmitted(false);
    setFieldSelected(fieldId);
  };

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setContentTypeSelected(currentParameters?.contentType);
        setFieldSelected(currentParameters?.fieldId);
        setParameters(currentParameters);
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

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
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Form onSubmit={submitForm}>
        <Heading>Configuration</Heading>
        <Paragraph>
          Select a content type, then choose a field to set the main editor.
        </Paragraph>
        <HelpText>
          The content type must be specific to saving global settings and the
          field must be of type JSON.
        </HelpText>
        <FormControl>
          <FormControl.Label isRequired>Content type</FormControl.Label>
          <Select
            id="optionSelect-SelectContentType"
            name="optionSelect-SelectContentType"
            value={contentTypeSelected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onContentTypeChange(e.currentTarget.value)
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
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>Field</FormControl.Label>
          <Select
            id="optionSelect-SelectSiteField"
            name="optionSelect-SelectSiteField"
            value={fieldSelected}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFieldSiteChange(e.currentTarget.value)
            }
          >
            <Select.Option value="">Select field</Select.Option>
            {fieldsList?.map((field: string, index: number) => {
              return (
                <Select.Option key={index} value={field}>
                  {field}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>
        <Button variant="primary" type="submit" isDisabled={submitted}>
          Set up
        </Button>{" "}
        <Button variant="secondary" type="button" onClick={resetForm}>
          Reset
        </Button>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
