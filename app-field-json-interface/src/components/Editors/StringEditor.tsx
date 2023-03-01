import { TextInput } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { updateValue } from "../../util/set-value";

const StringEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props;
  const valueField = "";
  let pathObject =
    typeof index !== "undefined" && index > -1
      ? parentKey
      : `${parentKey}.${currentKey}`;
  return (
    <TextInput
      name={parentKey}
      id={parentKey}
      type="text"
      defaultValue={valueField ?? ""}
      onBlurCapture={(e) => {
        if (handleUpdate) {
          handleUpdate(
            updateValue(
              value,
              pathObject as string,
              e.currentTarget.value,
              index,
              currentKey
            )
          );
        }
      }}
    />
  );
};

export default StringEditor;
