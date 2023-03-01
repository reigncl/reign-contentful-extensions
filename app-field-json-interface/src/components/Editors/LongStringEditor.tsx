import { Textarea } from "@contentful/f36-components";
import { Editor } from "../../types/editor";

const LongStringEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey } = props;
  const valueField = "";
  return (
    <Textarea
      name={parentKey}
      id={parentKey}
      defaultValue={valueField ?? ""}
      onBlurCapture={(e) => {
        if (handleUpdate) {
          console.log(`LongStringEditor parentKey=${parentKey}.${currentKey}`)
          handleUpdate(e.currentTarget.value);
        }
      }}
    />
  );
};

export default LongStringEditor;
