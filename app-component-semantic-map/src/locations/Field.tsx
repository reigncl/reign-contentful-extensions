import React, { useEffect, useState } from "react";
import { FormControl, Select, Table } from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
} from "contentful-management";

const Field = () => {
  const cma = useCMA();
  const sdk = useSDK<FieldExtensionSDK>();
  const [contentTypesList, setContentTypesList] = useState<
    Array<Record<string, string>>
  >([]);
  const [contentTypeSelected, setContentTypeSelected] = useState<string>("");
  const [fieldsList, setFieldsList] = useState<Array<string>>([]);

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
            setContentTypeSelected(e.currentTarget.value)
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

  useEffect(() => {
    sdk.window.startAutoResizer();
    return () => {
      sdk.window.stopAutoResizer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        return contentTypePage?.fields?.map((field: ContentFields) => field.id);
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
    <>
      <SelectContentType />
      <FormControl>
        <FormControl.Label>
          Choose a content type to list his fields.
        </FormControl.Label>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Component attribute</Table.Cell>
              <Table.Cell>Semantic data</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {fieldsList?.map((contentTypeField: string, index: number) => {
              return (
                <Table.Row key={`contentTypeField-${index}`}>
                  <Table.Cell>{contentTypeField}</Table.Cell>
                  <Table.Cell>
                    <Select
                      id={`optionSelect-SemanticField-${index}`}
                      name={`optionSelect-SemanticField-${index}`}
                      value={""}
                      /*onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onContentTypeChange(e.currentTarget.value)
          }*/
                    >
                      <Select.Option value="">
                        Select Semantic data
                      </Select.Option>
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
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </FormControl>
    </>
  );
};

export default Field;
