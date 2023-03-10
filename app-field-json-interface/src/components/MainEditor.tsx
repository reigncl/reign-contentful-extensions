import { EditorTypeValue, MainEditorProps } from "../types";
import { Table } from "@contentful/f36-components";
import SwitchEditor from "./SwitchEditor";

const MainEditor = (props: MainEditorProps) => {
  const { structure, value, handleUpdate } = props;
  
  if (!structure) {
    return <>Cargando</>;
  }

  return (
    <>
      <Table>
        <Table.Body>
          {Object.keys(structure)?.map((key: string, index: number) => {
            return (
              <Table.Row key={index}>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>
                  <SwitchEditor
                    parentKey={''}
                    currentKey={`${key}`}
                    value={value}
                    structure={(structure as Record<string, EditorTypeValue>)[key]}
                    handleUpdate={handleUpdate}
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

export default MainEditor;
