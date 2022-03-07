import React, { useCallback, useState, useEffect } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  CollectionProp,
  ContentFields,
  ContentTypeFieldValidation,
  ContentTypeProps,
  PlainClientAPI,
} from "contentful-management";
import {
  Heading,
  Form,
  Flex,
  Select,
  FormControl,
  Note,
  Box,
  Table,
  Text,
  TextLink,
  Tooltip,
} from "@contentful/f36-components";
import { DeleteIcon, EditIcon, PlusIcon } from "@contentful/f36-icons";
import { css } from "@emotion/css";
import { DialogTypes } from "./Dialog";

export interface AppInstallationParameters {
  contentTypePage?: string;
  fieldSite?: string;
  fieldSlug?: string;
  items?: Array<ConfigPreviewItem>;
}

interface ConfigScreenProps {
  sdk: AppExtensionSDK;
  cma: PlainClientAPI;
}

export interface ConfigPreviewItem {
  site: string;
  url: string;
  label: string;
  index?: number;
}

const ConfigScreen = (props: ConfigScreenProps) => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [contentTypes, setContentTypes] =
    useState<Array<Record<string, string>>>();
  const [sites, setSites] = useState<Array<string>>();
  const [fields, setFields] = useState<Array<string>>();

  const onConfigure = useCallback(async () => {
    const currentState = await props.sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, props.sdk]);

  useEffect(() => {
    props.sdk.app.onConfigure(() => onConfigure());
  }, [props.sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await props.sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }
      props.sdk.app.setReady();
    })();
  }, [props.sdk]);

  useEffect(() => {
    (async () => {
      if (!contentTypes) {
        const collectionResponse: CollectionProp<ContentTypeProps> =
          await props.cma.contentType.getMany({});
        const arrayOfContentTypes = collectionResponse?.items
          ?.map((item: ContentTypeProps) => {
            return {
              name: item.name,
              id: item.sys.id,
            };
          })
          ?.sort();
        setContentTypes(arrayOfContentTypes);
      }
    })();
  }, [contentTypes, props.cma.contentType]);

  useEffect(() => {
    (async () => {
      const getArrayOfSites = async (fieldId: string) => {
        if (parameters.contentTypePage) {
          const contentTypePage = await props.cma.contentType.get({
            contentTypeId: parameters.contentTypePage,
          });
          return contentTypePage.fields
            .find((field: ContentFields) => field.id === fieldId)
            ?.validations?.find(
              (validation: ContentTypeFieldValidation) =>
                typeof validation.in !== "undefined"
            )?.in as Array<string>;
        }
        return [];
      };
      if (!sites && parameters?.contentTypePage && parameters?.fieldSite) {
        const arrayOfSites: Array<string> = await getArrayOfSites(
          parameters?.fieldSite
        );
        setSites(arrayOfSites);
        console.log("arrayOfSites", arrayOfSites);
      }
    })();
  }, [
    sites,
    props.cma.contentType,
    parameters.contentTypePage,
    parameters.fieldSite,
  ]);

  useEffect(() => {
    (async () => {
      const getArrayOfFieldsFromContentType = async (contentTypeId: string) => {
        const contentTypePage = await props.cma.contentType.get({
          contentTypeId,
        });
        return contentTypePage?.fields?.map((field: ContentFields) => field.id);
      };

      if (!fields && parameters?.contentTypePage) {
        const arrayOfFields = await getArrayOfFieldsFromContentType(
          parameters?.contentTypePage
        );
        setFields(arrayOfFields);
      }
    })();
  }, [props.cma.contentType, parameters.contentTypePage, fields]);

  const onContentTypeChange = async (contentTypeId: string) => {
    setParameters({
      contentTypePage: contentTypeId,
    });
    setFields(undefined);
    setSites(undefined);
  };

  const onFieldSiteChange = async (fieldId: string) => {
    setParameters({
      ...parameters,
      fieldSite: fieldId,
    });
    setSites(undefined);
  };

  const onFieldSlugChange = async (fieldId: string) => {
    setParameters({
      ...parameters,
      fieldSlug: fieldId,
    });
  };

  const SelectContentType = () => {
    return (
      <FormControl>
        <FormControl.Label>
          Select the content type used for page.
        </FormControl.Label>
        <Select
          id="optionSelect-SelectContentType"
          name="optionSelect-SelectContentType"
          value={parameters?.contentTypePage}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onContentTypeChange(e.currentTarget.value)
          }
        >
          <Select.Option value="">Select content type</Select.Option>
          {contentTypes?.map((ct: Record<string, string>, index: number) => {
            return (
              <Select.Option key={index} value={ct.id}>
                {ct.name}
              </Select.Option>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const SelectSiteField = () => (
    <FormControl>
      <FormControl.Label>
        Select the field with sites (list of sites).
      </FormControl.Label>
      <Select
        id="optionSelect-SelectSiteField"
        name="optionSelect-SelectSiteField"
        value={parameters?.fieldSite}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onFieldSiteChange(e.currentTarget.value)
        }
      >
        <Select.Option value="">Select field</Select.Option>
        {fields?.map((field: string, index: number) => {
          return (
            <Select.Option key={index} value={field}>
              {field}
            </Select.Option>
          );
        })}
      </Select>
    </FormControl>
  );

  const SelectSlugField = () => (
    <FormControl>
      <FormControl.Label>Select the "slug/permalink" field.</FormControl.Label>
      <Select
        id="optionSelect-SelectSiteField"
        name="optionSelect-SelectSiteField"
        value={parameters?.fieldSlug}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onFieldSlugChange(e.currentTarget.value)
        }
      >
        <Select.Option value="">Select field</Select.Option>
        {fields?.map((field: string, index: number) => {
          return (
            <Select.Option key={index} value={field}>
              {field}
            </Select.Option>
          );
        })}
      </Select>
    </FormControl>
  );

  const SitesDetected = () => (
    <>{sites && <Note>We are detected this sites: {sites?.toString()}</Note>}</>
  );

  const TextWithNote = ({ note, id, children }: Record<string, string>) => (
    <Tooltip placement="top" id={id} content={note}>
      <Text as="b" fontColor="red600" fontWeight="fontWeightDemiBold">
        {children}
      </Text>
    </Tooltip>
  );

  const TableWithItems = () => {
    if (!parameters.items || parameters.items.length === 0) {
      return <></>;
    }
    return (
      <>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Site</Table.Cell>
              <Table.Cell>
                <TextWithNote
                  note="Preview URL for content type selected. E.g. https://www.yourwebsite.com/{fieldId}"
                  id="url"
                >
                  URL
                </TextWithNote>
              </Table.Cell>
              <Table.Cell>Button label</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {parameters.items.map((itm: ConfigPreviewItem, itmIndex: number) => {
              return (
                <Table.Row key={itmIndex}>
                  <Table.Cell>{itm?.site}</Table.Cell>
                  <Table.Cell>{itm?.url}</Table.Cell>
                  <Table.Cell>{itm?.label}</Table.Cell>
                  <Table.Cell>
                    <TextLink
                      as="button"
                      variant="primary"
                      icon={<EditIcon />}
                      alignIcon="end"
                      onClick={() => {
                        openDialog(DialogTypes.UPDATE, itm, itmIndex);
                      }}
                    />
                    <TextLink
                      as="button"
                      variant="negative"
                      icon={<DeleteIcon />}
                      alignIcon="end"
                      onClick={() => {
                        openDeleteDialog(itm, itmIndex);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </>
    );
  };

  const openDialog = async (
    type: DialogTypes,
    item?: ConfigPreviewItem,
    index?: number
  ) => {
    try {
      console.log('openDialog index', index)
      const result: ConfigPreviewItem = await props.sdk.dialogs.openCurrentApp({
        title: type === DialogTypes.ADD ? "Add new preview" : "Edit preview",
        minHeight: 450,
        parameters: {
          sites,
          type,
          item,
          index,
        },
      });
      const currentItems = parameters.items ?? [];
      if (type === DialogTypes.ADD && result) {
        currentItems.push(result);
      }
      if (type === DialogTypes.UPDATE && typeof result?.index !== "undefined") {
        currentItems[result?.index] = result;
      }
      if (result) {
        setParameters({
          ...parameters,
          items: currentItems,
        });
      }
    } catch (error) {
      console.log("openDialog error", error);
    }
  };

  const openDeleteDialog = async (item: ConfigPreviewItem, index: number) => {
    try {
      const deleteResponse = await props.sdk.dialogs.openConfirm({
        title: "Are you sure to delete this preview?",
        message: `${item.url.slice(0, 60)}...`,
      });
      if (deleteResponse) {
        const currentItems = parameters.items ?? [];
        currentItems.splice(index, 1);
        setParameters({
          ...parameters,
          items: currentItems,
        });
      }
    } catch (error) {
      console.log("openDeleteDialog error", error);
    }
  };

  return (
    <Flex className={css({ margin: "80px" })}>
      <Box>
        <Form>
          <Heading>Config</Heading>
          <SelectContentType />
          <SelectSiteField />
          <SelectSlugField />
          <SitesDetected />
        </Form>
      </Box>
      <Box paddingLeft="spacingL">
        <Heading>
          Preview Items{" "}
          <TextLink
            as="button"
            variant="primary"
            icon={<PlusIcon />}
            alignIcon="start"
            onClick={() => {
              openDialog(DialogTypes.ADD);
            }}
          >
            Add preview
          </TextLink>
        </Heading>
        <TableWithItems />
      </Box>
    </Flex>
  );
};

export default ConfigScreen;
