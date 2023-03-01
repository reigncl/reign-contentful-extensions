import { TextInput } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { setValue } from "../../util/set-value";

const NumberEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey } = props
  const valueField = ''
  return (
    <TextInput
      name={parentKey}
      id={parentKey}
      type="number"
      defaultValue={valueField ?? ""}
      onBlurCapture={(e) => {
        if (handleUpdate) {
          console.log(`NumberEditor parentKey=${parentKey}.${currentKey}`)
          handleUpdate(e.currentTarget.value)
        }
      }}
    />
  );
};

export default NumberEditor;
