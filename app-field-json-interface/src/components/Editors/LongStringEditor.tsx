import { Textarea } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { updateValue } from "../../util/set-value";

const LongStringEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props;
  const valueField = "";
  let pathObject =
    typeof index !== "undefined" && index > -1
      ? parentKey
      : `${parentKey}.${currentKey}`;
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

export default LongStringEditor;
