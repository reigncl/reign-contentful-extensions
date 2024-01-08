import { Button, Flex, Note, Table } from "@contentful/f36-components";
import { SetupInterfacesProps } from "./SetupInterfaces.types";

const SetupInterfaces = ({ sdk, items, onUpdate }: SetupInterfacesProps) => {
  const addInterface = async () => {
    try {
      const response = await sdk.dialogs.openCurrentApp({
        title: "Add Interface",
        width: "large",
        minHeight: 400,
        parameters: {
          type: 'interface'
        }
      });
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
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Claus Mitchell</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
            </Table.Row>
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
