import { Switch } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { getValue, updateValue } from "../../util/set-value";

const BooleanEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props;
  let pathObject = '';
  if (typeof index !== "undefined" && index > -1) {
    pathObject = `${parentKey}${parentKey ? "." : ""}${index}.${currentKey}`
  } else {
    pathObject = `${parentKey}${parentKey ? "." : ""}${currentKey}`
  }

  const valueField = getValue(value, pathObject as string);
  return (
    <Switch
      name={parentKey}
      id={parentKey}
      defaultChecked={valueField ? true : false}
      onChange={(e) => {
        if (handleUpdate) {
          handleUpdate(
            updateValue(
              value,
              pathObject as string,
              e.target.checked,
              index,
              currentKey
            )
          );
        }
      }}
    />
  );
};

export default BooleanEditor;
