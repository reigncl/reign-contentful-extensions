import { TextInput } from "@contentful/f36-components";
import { Editor } from "../../types/editor";

const StringEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey } = props;
  const valueField = "";
  return (
    <TextInput
      name={parentKey}
      id={parentKey}
      type="text"
      defaultValue={valueField ?? ""}
      onBlurCapture={(e) => {
        if (handleUpdate) {
          console.log(`StringEditor parentKey=${parentKey}.${currentKey}`)
          handleUpdate(e.currentTarget.value);
        }
      }}
    />
  );
};

export default StringEditor;
