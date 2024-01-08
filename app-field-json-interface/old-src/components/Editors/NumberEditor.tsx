import { TextInput } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { getValue, updateValue } from "../../util/set-value";

const NumberEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props;
  let pathObject = '';
  if (typeof index !== "undefined" && index > -1) {
    pathObject = `${parentKey}${parentKey ? "." : ""}${index}.${currentKey}`
  } else {
    pathObject = `${parentKey}${parentKey ? "." : ""}${currentKey}`
  }

  const valueField = getValue(value, pathObject as string);
  return (
    <TextInput
      name={parentKey}
      id={parentKey}
      type="number"
      defaultValue={valueField ?? ""}
      onBlurCapture={(e) => {
        if (handleUpdate) {
          handleUpdate(
            updateValue(
              value,
              pathObject as string,
              e.currentTarget.value
            )
          );
        }
      }}
    />
  );
};

export default NumberEditor;
