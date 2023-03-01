import { Button, Table } from "@contentful/f36-components";
import * as icons from "@contentful/f36-icons";
import { useState } from "react";
import { EditorTypeValue } from "../types";
import { ChildMainEditorProps } from "../types/child-main-editor";
import BooleanEditor from "./Editors/BooleanEditor";
import LongStringEditor from "./Editors/LongStringEditor";
import NumberEditor from "./Editors/NumberEditor";
import StringEditor from "./Editors/StringEditor";

const ArrayChildMainEditor = (props: ChildMainEditorProps) => {
  const { value, structure, handleUpdate, parentKey } = props;
  const [dataToLoop, setDataToLoop] = useState<any[]>([]);

  const addEditorTable = () => {
    setDataToLoop([...(dataToLoop ?? []), {}]);
  };

  const removeEditorTable = (TableIndex: number) => {
    const dataToLoopFiltered = dataToLoop?.filter(
      (value: any, i: number) => i !== TableIndex
    );
    setDataToLoop(dataToLoopFiltered);
  };

  if (!structure) {
    return <>Cargando</>;
  }

  const EditorArray = ({
    type,
    currentKey,
    index,
  }: {
    type?: string;
    currentKey?: string;
    index?: number;
  }) => {
    switch (type) {
      case "string":
        return (
          <StringEditor
            handleUpdate={handleUpdate}
            parentKey={parentKey}
            value={value}
            currentKey={`${currentKey}`}
          />
        );
      case "longstring":
        return (
          <LongStringEditor
            handleUpdate={handleUpdate}
            parentKey={parentKey}
            value={value}
            currentKey={`${currentKey}`}
          />
        );
      case "boolean":
        return (
          <BooleanEditor
            handleUpdate={handleUpdate}
            parentKey={parentKey}
            value={value}
            currentKey={`${currentKey}`}
          />
        );
      case "number":
        return (
          <NumberEditor
            handleUpdate={handleUpdate}
            parentKey={parentKey}
            value={value}
            currentKey={`${currentKey}`}
          />
        );
      default:
        return <></>;
    }
  };

  const EditorTable = ({ idx }: { idx: number }) => {
    return (
      <>
        <Table>
          <Table.Body>
            <Table.Row key={idx}>
              <Table.Cell>#{idx} </Table.Cell>
              <Table.Cell>
                <Table>
                  <Table.Body>
                    {Object.keys((structure as EditorTypeValue[])[0])?.map(
                      (key: string, index: number) => {
                        return (
                          <Table.Row key={index}>
                            <Table.Cell>{key}</Table.Cell>
                            <Table.Cell>
                              <EditorArray
                                currentKey={`${key}`}
                                type={
                                  (
                                    (
                                      structure as EditorTypeValue[]
                                    )[0] as Record<string, EditorTypeValue>
                                  )[key] as string
                                }
                              />
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
                    )}
                  </Table.Body>
                </Table>
              </Table.Cell>
              <Table.Cell>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => removeEditorTable(idx)}
                >
                  <icons.CloseTrimmedIcon variant="negative" />
                </span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  };

  return (
    <>
      {dataToLoop?.map((data, i: number) => (
        <EditorTable key={i} idx={i} />
      ))}
      <hr color="#E7EBEE" />
      <Button
        size="small"
        startIcon={<icons.PlusIcon />}
        variant="primary"
        onClick={addEditorTable}
      >
        Add
      </Button>
    </>
  );
};

export default ArrayChildMainEditor;
