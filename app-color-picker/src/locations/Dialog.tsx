import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Form,
  FormControl,
  Pill,
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
import { TypeColorPicker } from "./Field";

export enum DialogTypes {
  ADD,
  UPDATE,
}

export interface DialogJsonStructureItem {
  contentType: string;
  field: string;
  content?: Array<string>;
  type?: TypeColorPicker;
  index?: number;
}

export interface JsonItems {
  label: string;
  value: string;
}

const Dialog = () => {
  const cma = useCMA();
  const sdk = useSDK<DialogExtensionSDK>();
  const pickerTypes = TypeColorPicker;
  const [submitted, setSubmitted] = useState(false);
  const [contentTypesList, setContentTypesList] = useState<
    Array<Record<string, string>>
  >([]);
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);
  const [validHex, setValidHex] = useState(true);

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
  const [typeSelected, setTypeSelected] = useState<string | undefined>(
    (sdk.parameters.invocation as unknown as DialogJsonStructureItem)?.type
  );
  const [content, setContent] = useState<Array<string> | undefined>(
    (sdk.parameters.invocation as unknown as DialogJsonStructureItem)?.content
  );
  const [colorValue, setColorValue] = useState<string | undefined>("");

  const submitForm = () => {
    setSubmitted(true);
    sdk.close({
      contentType: contentTypeSelected,
      field: fieldSelected,
      content: content,
      type: typeSelected,
      index,
    } as ConfigJsonStructureItem);
  };

  const onContentTypeChange = async (contentTypeId: string) => {
    setContentTypeSelected(contentTypeId);
  };

  const onFieldSiteChange = async (fieldId: string) => {
    setFieldSelected(fieldId);
  };

  const onClosePill = (idx: number) => {
    const currentItems = [...(content ?? [])];
    currentItems?.splice(idx, 1);
    setContent(currentItems);
  }

  const validateHexColor = (color: string): boolean => {
    const result = /^#[0-9A-F]{6}$/i.test(color);
    setValidHex(result);
    return result;
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

  const SelectField = () => (
    <FormControl>
      <FormControl.Label>Select an Text type field</FormControl.Label>
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

  const SelectPicker = () => (
    <FormControl>
      <FormControl.Label>Select a type of datepicker</FormControl.Label>
      <Select
        id="optionSelect-SelectPicker"
        name="optionSelect-SelectPicker"
        value={typeSelected}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setTypeSelected(e.currentTarget.value)
        }
      >
        <Select.Option value="">Select type</Select.Option>
        {Object.keys(pickerTypes)?.map((field: string, index: number) => {
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
          ?.filter((field: ContentFields) => field.type === "Symbol")
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

  console.log('pickerTypes', Object.keys(pickerTypes))

  return (
    <Flex padding="spacingM" fullWidth>
      <Form className={css({ width: "100%" })}>
        <SelectContentType />
        <SelectField />
        <SelectPicker />
        <FormControl isInvalid={!!!validHex}>
          <FormControl.Label>Hex Color</FormControl.Label>
          <TextInput.Group>
            <TextInput
              value={colorValue}
              name="dialog-label"
              placeholder="#FFFFFF"
              onChange={(e) => {
                setColorValue(e.target.value);
                validateHexColor(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  validateHexColor(e.currentTarget.value) === true
                ) {
                  setColorValue("");
                  if (!content?.includes(e.currentTarget.value)) {
                    setContent([...(content ?? []), e.currentTarget.value]);
                  }
                }
              }}
            />
            {colorValue && colorValue?.length && (
              <Box
                className={css({
                  width: "70px",
                  backgroundColor: colorValue,
                  height: "40px",
                })}
              >
                {" "}
              </Box>
            )}
          </TextInput.Group>
          {!!!validHex && (
            <FormControl.ValidationMessage>
              Please check your color
            </FormControl.ValidationMessage>
          )}
          <FormControl.HelpText>
            Add a Hex css color, like: <code>#FFFFFF</code> <code>#cccccc</code>
          </FormControl.HelpText>
          <Flex flexWrap="wrap">
            {content?.map((color: string, index: number) => {
              return (
                <Box
                  key={index}
                  className={css({ paddingRight: "10px", paddingTop: "10px" })}
                >
                  <Pill
                    testId="pill-item"
                    label={color}
                    onClose={() => onClosePill(index)}
                  />
                </Box>
              );
            })}
          </Flex>
        </FormControl>
        <Button
          variant={typeof index !== "undefined" ? "positive" : "primary"}
          type="button"
          onClick={submitForm}
          isDisabled={submitted}
        >
          {typeof index !== "undefined" ? "Edit" : "Add"}
        </Button>
      </Form>
    </Flex>
  );
};

export default Dialog;
