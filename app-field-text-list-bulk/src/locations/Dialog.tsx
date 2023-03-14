import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Form,
  FormControl,
  Select,
  TextInput,
} from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { DialogExtensionSDK } from "@contentful/app-sdk";
import { css } from "emotion";
import { ConfigJsonStructureItem } from "./ConfigScreen";
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
} from "contentful-management";

export enum DialogTypes {
  ADD,
  UPDATE,
}

export interface DialogJsonStructureItem {
  contentType: string;
  field: string;
  data: string;
  index?: number;
}

export interface JsonItems {
  label: string;
  value: string;
}

const Dialog = () => {
  const fieldType = "Array";
  const cma = useCMA();
  const sdk = useSDK<DialogExtensionSDK>();
  const [submitted, setSubmitted] = useState(false);
  const [contentTypesList, setContentTypesList] = useState<
    Array<Record<string, string>>
  >([]);
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);
  const [validData, setValidData] = useState(false);

  const { index } = sdk.parameters
    .invocation as unknown as DialogJsonStructureItem;
  const [contentTypeSelected, setContentTypeSelected] = useState<
    string | undefined
  >(
    (sdk.parameters.invocation as unknown as DialogJsonStructureItem)
      ?.contentType
  );
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(
    (sdk.parameters.invocation as unknown as DialogJsonStructureItem)?.field
  );
  const [data, setData] = useState<string | undefined>(
    (sdk.parameters.invocation as unknown as DialogJsonStructureItem)?.data
  );

  const submitForm = () => {
    setSubmitted(true);
    sdk.close({
      contentType: contentTypeSelected,
      field: fieldSelected,
      data: data,
      index,
    } as ConfigJsonStructureItem);
  };

  const onContentTypeChange = async (contentTypeId: string) => {
    setContentTypeSelected(contentTypeId);
  };

  const onFieldSiteChange = async (fieldId: string) => {
    setFieldSelected(fieldId);
  };

  const SelectContentType = () => {
    return (
      <FormControl>
        <FormControl.Label>
          Choose a content type to list his fields.
        </FormControl.Label>
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
            (ct: Record<string, string>, index: number) => {
              return (
                <Select.Option key={index} value={ct.id}>
                  {ct.name}
                </Select.Option>
              );
            }
          )}
        </Select>
      </FormControl>
    );
  };

  const validateData = (data: string) => {
    try {
      if (data === "") {
        throw new Error("validateData data");
      }
      setValidData(true);
    } catch (error) {
      // console.log(error)
      setValidData(false);
    }
  };

  const SelectField = () => (
    <FormControl>
      <FormControl.Label>Select an Array type field</FormControl.Label>
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
  );

  useEffect(() => {
    (async () => {
      if (
        !contentTypesList ||
        (contentTypesList && contentTypesList?.length === 0)
      ) {
        const collectionResponse: CollectionProp<ContentTypeProps> =
          await cma.contentType.getMany({
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
  }, [contentTypesList, cma.contentType]);

  useEffect(() => {
    (async () => {
      const getArrayOfFieldsFromContentType = async (contentTypeId: string) => {
        const contentTypePage = await cma.contentType.get({
          contentTypeId,
        });
        return contentTypePage?.fields
          ?.filter((field: ContentFields) => {
            console.log(field.type);
            return field.type === fieldType;
          })
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
    <Flex padding="spacingM" fullWidth>
      <Form className={css({ width: "100%" })} onSubmit={submitForm}>
        <SelectContentType />
        <SelectField />
        <FormControl isRequired>
          <FormControl.Label>String separator</FormControl.Label>
          <TextInput
            type="text"
            defaultValue={data}
            name="dialog-label"
            onChange={(e) => {
              validateData(e.target.value);
              setData(e.target.value);
            }}
          />
        </FormControl>
        <Button
          variant={typeof index !== "undefined" ? "positive" : "primary"}
          type="submit"
          isDisabled={submitted || !validData || !contentTypeSelected || !fieldSelected}
        >
          {typeof index !== "undefined" ? "Edit" : "Add"}
        </Button>
      </Form>
    </Flex>
  );
};

export default Dialog;
