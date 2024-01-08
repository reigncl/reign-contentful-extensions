import { Textarea } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { getValue, updateValue } from "../../util/set-value";

const LongStringEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props;
  let pathObject = '';
  if (typeof index !== "undefined" && index > -1) {
    pathObject = `${parentKey}${parentKey ? "." : ""}${index}.${currentKey}`
  } else {
    pathObject = `${parentKey}${parentKey ? "." : ""}${currentKey}`
  }

  const valueField = getValue(value, pathObject as string);
  return (
    <Textarea
      name={parentKey}
      id={parentKey}
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

export default LongStringEditor;
