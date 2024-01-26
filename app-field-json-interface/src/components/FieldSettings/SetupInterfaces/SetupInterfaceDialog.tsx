import { CSSProperties, useEffect, useState } from "react";
import { SetupInterfaceDialogProps } from "./SetupInterfaces.types";
import { DeleteIcon } from "@contentful/f36-icons";
import {
  Form,
  FormControl,
  TextInput,
  Box,
  Textarea,
  Button,
  Subheading,
  Select,
  Table,
  IconButton,
  HelpText,
  Note,
} from "@contentful/f36-components";
import { Interface, InterfaceItem } from "../FieldSetup.types";
import tokens from "@contentful/f36-tokens";

const SetupInterfaceDialog = ({ sdk }: SetupInterfaceDialogProps) => {
  const parameters = sdk.parameters.invocation as unknown as Interface & {
    index?: number;
  };
  const [indexInterface] = useState<number | undefined>(parameters?.index);
  const [idInterface] = useState<string | undefined>(parameters?.id);
  const [items, setItems] = useState<Array<InterfaceItem>>(
    parameters?.items ?? []
  );
  const [name, setName] = useState<string>(parameters?.name ?? "");
  const [isArray, setIsArray] = useState<boolean>(parameters?.isArray ?? false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(parameters?.isCollapsed ?? false);

  const submitForm = () => {
    sdk.close({
      id: idInterface,
      name,
      isArray,
      isCollapsed,
      items,
      index: indexInterface,
    } as Interface & {
      index?: number;
    });
  };

  const ItemEditor = ({
    interfaceItem,
    index,
  }: {
    interfaceItem: InterfaceItem;
    index: number;
  }) => {
    const [item, setItem] = useState<InterfaceItem>(interfaceItem);

    useEffect(() => {
      const arrItems = items;
      arrItems[index] = {
        label: item?.label,
        key: item?.key,
        type: item?.type,
        options: item?.options,
        required: item?.required ?? false,
        inputTextType: item?.inputTextType,
        errorMessage: item?.errorMessage,
        regex: item?.regex,
        helpText: item?.helpText,
      };
      setItems(arrItems);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const StyleHelpText: CSSProperties = {
      fontSize: tokens.fontSizeS,
      paddingBottom: tokens.spacingXs,
    };

    return (
      <Table.Row>
        <Table.Cell>
          <HelpText style={StyleHelpText}>Enter the key/id:</HelpText>
          <TextInput
            size="small"
            value={item?.key}
            onChange={(e) => {
              setItem({ ...item, key: e?.currentTarget.value });
            }}
          />
        </Table.Cell>
        <Table.Cell>
          <HelpText style={StyleHelpText}>Enter the label:</HelpText>
          <TextInput
            size="small"
            value={item?.label}
            onChange={(e) => {
              setItem({ ...item, label: e?.currentTarget.value });
            }}
          />
        </Table.Cell>
        <Table.Cell>
          <HelpText style={StyleHelpText}>Select a field type:</HelpText>
          <Select
            size="small"
            value={item?.type}
            onChange={(e) => {
              setItem({
                ...item,
                type: e?.currentTarget
                  .value as unknown as InterfaceItem["type"],
              });
            }}
          >
            <Select.Option value="">Select a type</Select.Option>
            <Select.Option value="Boolean">Boolean</Select.Option>
            <Select.Option value="InputText">InputText</Select.Option>
            <Select.Option value="InputTextList">InputTextList</Select.Option>
            <Select.Option value="Select">Select</Select.Option>
            <Select.Option value="Textarea">Textarea</Select.Option>
          </Select>
        </Table.Cell>
        <Table.Cell>
          {["Select"].includes(item?.type) && (
            <>
              <HelpText style={StyleHelpText}>
                Add the options to list, separate them by comma:
              </HelpText>
              <Textarea
                rows={2}
                value={item?.options?.toString()}
                onChange={(e) => {
                  setItem({
                    ...item,
                    options: e?.currentTarget.value?.split(","),
                  });
                }}
              ></Textarea>
            </>
          )}
          {["InputText"].includes(item?.type) && (
            <>
              <HelpText style={StyleHelpText}>Select a input type:</HelpText>
              <Select
                size="small"
                value={item?.inputTextType}
                onChange={(e) => {
                  console.log(e?.currentTarget.value);
                  setItem({
                    ...item,
                    inputTextType: e?.currentTarget
                      .value as unknown as InterfaceItem["inputTextType"],
                  });
                }}
              >
                <Select.Option value="">Select a input type</Select.Option>
                <Select.Option value="text">text</Select.Option>
                <Select.Option value="password">password</Select.Option>
                <Select.Option value="email">email</Select.Option>
                <Select.Option value="number">number</Select.Option>
                <Select.Option value="url">url</Select.Option>
                <Select.Option value="regex">regex</Select.Option>
              </Select>
              {item?.inputTextType === "regex" && (
                <Box
                  style={{
                    borderTop: "1px solid rgb(207, 217, 224)",
                    marginTop: tokens.spacingM,
                    paddingTop: tokens.spacing2Xs,
                  }}
                >
                  <HelpText style={StyleHelpText}>
                    Write regex expression:
                  </HelpText>
                  <TextInput
                    size="small"
                    value={item?.regex?.toString()}
                    onChange={(e) => {
                      setItem({
                        ...item,
                        regex: e?.currentTarget.value as unknown as RegExp,
                      });
                    }}
                  />
                </Box>
              )}
            </>
          )}
          {!!!["Select", "InputText"].includes(item?.type) && <>N/A</>}
        </Table.Cell>
        {/*<Table.Cell>
          <Switch
            isChecked={item?.required}
            onChange={(e) => {
              setItem({ ...item, required: !!!item?.required });
            }}
          />
          <HelpText>Activate if this field is required</HelpText>
        </Table.Cell>*/}
        <Table.Cell>
          <HelpText style={StyleHelpText}>
            Add some help text for the editors:
          </HelpText>
          <Textarea
            rows={2}
            value={item?.helpText}
            onChange={(e) => {
              setItem({ ...item, helpText: e?.currentTarget.value });
            }}
          ></Textarea>
        </Table.Cell>
        <Table.Cell>
          <HelpText style={StyleHelpText}>
            Add a custom error message for this field:
          </HelpText>
          <Textarea
            rows={2}
            value={item?.errorMessage}
            onChange={(e) => {
              setItem({ ...item, errorMessage: e?.currentTarget.value });
            }}
          ></Textarea>
        </Table.Cell>
        <Table.Cell>
          <IconButton
            variant="transparent"
            aria-label="Remove Field"
            icon={<DeleteIcon />}
            onClick={async () => {
              const response = await sdk.dialogs.openConfirm({
                title: "Remove Field",
                message: "Are you sure you want to delete this field?",
              });
              if (response) {
                const arrItems = [...items];
                arrItems.splice(index, 1);
                setItems(arrItems);
              }
            }}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  const ListItems = () => {
    return (
      <Box paddingBottom="spacingM">
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Key</Table.Cell>
              <Table.Cell>Label</Table.Cell>
              <Table.Cell>Type</Table.Cell>
              <Table.Cell>Options</Table.Cell>
              {/*<Table.Cell>Required</Table.Cell>*/}
              <Table.Cell>Help Text</Table.Cell>
              <Table.Cell>Error Message</Table.Cell>
              <Table.Cell>Remove</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items?.map((item: InterfaceItem, index: number) => (
              <ItemEditor
                key={`item-editor-${index}`}
                interfaceItem={item}
                index={index}
              />
            ))}
          </Table.Body>
        </Table>
      </Box>
    );
  };

  return (
    <Box padding="spacingM">
      <Form onSubmit={submitForm}>
        <Box
          style={{
            borderBottom: "1px solid rgb(207, 217, 224)",
            maxWidth: "600px",
          }}
          marginBottom="spacingM"
        >
          <Subheading>Interface setup</Subheading>
          <FormControl>
            <FormControl.Label isRequired>Name</FormControl.Label>
            <TextInput
              value={name}
              onChange={(e) => {
                setName(e?.currentTarget?.value);
              }}
            />
            <FormControl.HelpText>
              Please enter a name to indentify the interface
            </FormControl.HelpText>
          </FormControl>
          <FormControl>
            <FormControl.Label isRequired>Single or Multiple</FormControl.Label>
            <Select
              value={isArray?.toString()}
              id="optionSelect-isArray"
              name="optionSelect-isArray"
              onChange={(e) => {
                setIsArray(e?.currentTarget?.value === "true" ? true : false);
              }}
            >
              <Select.Option value={"false"}>Single</Select.Option>
              <Select.Option value={"true"}>Multiple</Select.Option>
            </Select>
            <FormControl.HelpText>
              Select multiple if you need an array of objects.
            </FormControl.HelpText>
          </FormControl>
          <FormControl>
            <FormControl.Label isRequired>Collapse content</FormControl.Label>
            <Select
              value={isCollapsed?.toString()}
              id="optionSelect-isCollapsed"
              name="optionSelect-isCollapsed"
              onChange={(e) => {
                setIsCollapsed(e?.currentTarget?.value === "true" ? true : false);
              }}
            >
              <Select.Option value={"false"}>Keep UI Interface by default</Select.Option>
              <Select.Option value={"true"}>Set up a collapsible</Select.Option>
            </Select>
            <FormControl.HelpText>
            Set up a collapsible as a wrapper for you UI Interface.
            </FormControl.HelpText>
          </FormControl>
        </Box>

        <Box
          style={{ borderBottom: "1px solid rgb(207, 217, 224)" }}
          marginBottom="spacingM"
          paddingBottom="spacingM"
        >
          <Subheading>Fields</Subheading>
          {!!!items ||
            (items?.length === 0 && (
              <Box paddingBottom="spacingM">
                <Note variant="neutral">No fields have been defined yet.</Note>
              </Box>
            ))}
          {items && items?.length > 0 && (
            <>
              <ListItems />
            </>
          )}
          <Button
            onClick={() => {
              const modItems = [...items];
              modItems.push({});
              setItems(modItems);
            }}
            size="small"
            variant="primary"
            type="button"
          >
            Add field
          </Button>
        </Box>

        <Button
          isDisabled={!!!name || !!!items || items.length === 0}
          variant="primary"
          type="submit"
        >
          {typeof indexInterface === "undefined"
            ? "Create interface"
            : "Edit interface"}
        </Button>
      </Form>
    </Box>
  );
};

export default SetupInterfaceDialog;
