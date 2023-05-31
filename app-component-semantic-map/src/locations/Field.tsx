import React, { useEffect, useState } from "react";
import {
  EntityList,
  FormControl,
  Select,
  Table,
} from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
  EditorLayoutItem,
  EntryProps,
  FieldItem,
  SysLink,
} from "contentful-management";

const Field = () => {
  const fieldIdSemantic = "semantic";
  const cma = useCMA();
  const sdk = useSDK<FieldExtensionSDK>();
  const [contentTypesList, setContentTypesList] = useState<
    Array<Record<string, string>>
  >([]);
  const [contentTypeSelected, setContentTypeSelected] = useState<string>("");
  const [fieldsList, setFieldsList] = useState<ContentFields[]>([]);
  const [semanticFieldsList, setSemanticFieldsList] = useState<ContentFields[]>(
    []
  );

  let detachSiteChangeHandler: Function | null = null;

  const onFieldSemanticChange = async (value: SysLink) => {
    console.log("onFieldSemanticChange value", value);
    if (value) {
      try {
        const semanticEntry: EntryProps<any> = await cma.entry.get({
          entryId: value.sys.id,
        });
        if (semanticEntry) {
          console.log("onFieldSemanticChange semanticEntry", semanticEntry);
          const semanticContentType = await cma.contentType.get({
            contentTypeId: semanticEntry.sys.contentType.sys.id,
          });
          setSemanticFieldsList(semanticContentType?.fields ?? []);
        }
      } catch (error) {}
    }
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
        return contentTypePage;
      };
      if (contentTypeSelected) {
        const arrayOfFields = await getArrayOfFieldsFromContentType(
          contentTypeSelected
        );
        setFieldsList(arrayOfFields?.fields);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeSelected]);

  useEffect(() => {
    console.log("useEffect field", sdk.entry.fields);
    sdk.window.startAutoResizer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    detachSiteChangeHandler = sdk.entry.fields.semantic.onValueChanged(
      onFieldSemanticChange
    );

    return () => {
      if (detachSiteChangeHandler) detachSiteChangeHandler();
    };
  }, []);

  return (
    <>
      <SelectContentType />
      <FormControl>
        <FormControl.Label>
          Map component fields with semantic fields.
        </FormControl.Label>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Component fields</Table.Cell>
              <Table.Cell>Semantic fields</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {fieldsList?.map(
              (contentTypeField: ContentFields, index: number) => {
                return (
                  <Table.Row key={`contentTypeField-${index}`}>
                    <Table.Cell>
                      <h4>{contentTypeField.name}</h4>
                      <small>{contentTypeField.id}</small>
                    </Table.Cell>
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
                        {semanticFieldsList?.map(
                          (value: ContentFields, index: number) => {
                            console.log("Select Semantic data", value);
                            return (
                              <Select.Option key={index} value={value.id}>
                                {value.name}
                              </Select.Option>
                            );
                          }
                        )}
                      </Select>
                    </Table.Cell>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </FormControl>
    </>
  );
};

export default Field;
