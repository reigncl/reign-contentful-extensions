import { Switch } from "@contentful/f36-components";
import { Editor } from "../../types/editor";

const BooleanEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey } = props
  const valueField = ''
  return (
    <Switch
      name={parentKey}
      id={parentKey}
      defaultChecked={valueField ? true : false}
      onChange={(e) => {
        if (handleUpdate) {
          console.log(`BooleanEditor parentKey=${parentKey}.${currentKey}`)
          handleUpdate(e.target.checked)
        }
      }}
    />
  );
};

export default BooleanEditor;
