import { Switch } from "@contentful/f36-components";
import { Editor } from "../../types/editor";
import { updateValue } from "../../util/set-value";

const BooleanEditor = (props: Editor) => {
  const { handleUpdate, parentKey, value, currentKey, index } = props
  const valueField = ''
  let pathObject = typeof index !== 'undefined' && index > -1 ? parentKey : `${parentKey}.${currentKey}`
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
