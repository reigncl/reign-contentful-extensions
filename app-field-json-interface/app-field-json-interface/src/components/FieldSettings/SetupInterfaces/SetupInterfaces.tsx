import {
  Button,
  Flex,
  IconButton,
  Note,
  Table,
} from "@contentful/f36-components";
import { SetupInterfacesProps } from "./SetupInterfaces.types";
import { Interface } from "../FieldSetup.types";
import { DeleteIcon, EditIcon } from "@contentful/f36-icons";

const SetupInterfaces = ({ sdk, items, onUpdate }: SetupInterfacesProps) => {
  const addInterface = async () => {
    try {
      const response = (await sdk.dialogs.openCurrentApp({
        title: "Add Interface",
        width: "fullWidth",
        minHeight: 600,
        parameters: {
          type: "interface",
        },
      })) as Interface & {
        index?: number;
      };
      
      if (response) {
        const arrItems = [...(items ?? [])];
        arrItems.push({
          name: response.name,
          isArray: response.isArray,
          items: response.items,
        });
        onUpdate(arrItems);
      }
    } catch (error) {}
  };

  const RenderInterfaces = () => {
    if (!!!items || items?.length === 0) {
      return (
        <Note variant="neutral">No interfaces have been created yet.</Note>
      );
    }
    return (
      <>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Fields</Table.Cell>
              <Table.Cell>Is Array</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {items?.map((item: Interface, index: number) => (
              <>
                <Table.Row key={`inteface-${index}`}>
                  <Table.Cell>{item?.name}</Table.Cell>
                  <Table.Cell>{item?.items?.length}</Table.Cell>
                  <Table.Cell>{item?.isArray?.toString()}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      variant="transparent"
                      aria-label="Edit Interface"
                      icon={<EditIcon />}
                      onClick={async () => {
                        const response = (await sdk.dialogs.openCurrentApp({
                          title: "Edit Interface",
                          width: "fullWidth",
                          minHeight: 600,
                          parameters: { ...item, type: "interface", index },
                        })) as Interface & {
                          index?: number;
                        };

                        if (response && typeof response.index !== "undefined") {
                          const arrItems = [...items];
                          arrItems[response.index] = {
                            name: response.name,
                            isArray: response.isArray,
                            items: response.items,
                          };
                          onUpdate(arrItems);
                        }
                      }}
                    />
                    <IconButton
                      variant="transparent"
                      aria-label="Remove Interface"
                      icon={<DeleteIcon />}
                      onClick={async () => {
                        const response = await sdk.dialogs.openConfirm({
                          title: "Remove Interface",
                          message:
                            "Are you sure you want to delete this interface?",
                        });
                        if (response) {
                          const arrItems = [...items];
                          arrItems.splice(index, 1);
                          onUpdate(arrItems);
                        }
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              </>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  };

  return (
    <>
      <Flex padding="spacingS" justifyContent="right">
        <Button onClick={addInterface} variant="primary" size="small">
          Add Interface
        </Button>
      </Flex>
      <RenderInterfaces />
    </>
  );
};

export default SetupInterfaces;
