import { EditorTypeValue, FieldState, MainEditorProps } from "../types";
import { Table } from "@contentful/f36-components";
import { useContext } from "react";
import { FieldContext } from "../context/FieldContext";
import SwitchEditor from "./SwitchEditor";

const MainEditor = (props: MainEditorProps) => {
  const { structure, value, handleUpdate } = props;
  console.log(`MainEditor structure=${JSON.stringify(structure)}`);
  console.log(`MainEditor value=${JSON.stringify(value)}`);

  if (!structure) {
    return <>Cargando</>;
  }

  return (
    <>
      MainEditor
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
