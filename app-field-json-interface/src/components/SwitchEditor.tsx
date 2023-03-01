import React from "react";
import { EditorTypeValue, SwitchEditorProps } from "../types";
import ChildMainEditor from "./ChildMainEditor";
import ArrayChildMainEditor from "./ArrayChildMainEditor";
import StringEditor from "./Editors/StringEditor";
import BooleanEditor from "./Editors/BooleanEditor";
import NumberEditor from "./Editors/NumberEditor";
import LongStringEditor from "./Editors/LongStringEditor";

const SwitchEditor = (props: SwitchEditorProps) => {
  const { value, structure, parentKey, handleUpdate, currentKey } = props;

  const HandleDefault = (value: EditorTypeValue) => {
    if (typeof value === "object" && Array.isArray(structure)) {
      const arrKey = parentKey ? `${parentKey}.` : parentKey
      return (
        <ArrayChildMainEditor
          structure={structure}
          value={value}
          handleUpdate={handleUpdate}
          parentKey={`${arrKey}${currentKey}`}
        />
      );
    }
    if (typeof value === "object" && !Array.isArray(structure)) {
      const arrKey = parentKey ? `${parentKey}.` : parentKey
      return (
        <ChildMainEditor
          structure={structure}
          value={value}
          handleUpdate={handleUpdate}
          parentKey={`${arrKey}${currentKey}`}
          
        />
      );
    }
    return <></>;
  };

  switch (structure) {
    case "string":
      return (
        <StringEditor
          handleUpdate={handleUpdate}
          parentKey={parentKey}
          value={value}
          currentKey={currentKey}
        />
      );
    case "longstring":
      return (
        <LongStringEditor
          handleUpdate={handleUpdate}
          parentKey={parentKey}
          value={value}
          currentKey={currentKey}
        />
      );
    case "boolean":
      return (
        <BooleanEditor
          handleUpdate={handleUpdate}
          parentKey={parentKey}
          value={value}
          currentKey={currentKey}
        />
      );
    case "number":
      return (
        <NumberEditor
          handleUpdate={handleUpdate}
          parentKey={parentKey}
          value={value}
          currentKey={currentKey}
        />
      );
    default:
      return <HandleDefault value={value} />;
  }
};

export default SwitchEditor;
