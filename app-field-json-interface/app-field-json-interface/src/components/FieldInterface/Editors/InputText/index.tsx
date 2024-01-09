import { TextInput } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";

const InputTextEditor = ({
  definition,
  value,
  handleUpdate,
}: {
  definition: InterfaceItem;
  value: string;
  handleUpdate: Function;
}) => {
  return (
    <>
      <TextInput
        id={definition.key}
        defaultValue={value}
        onBlurCapture={(e) => {
          handleUpdate(e?.currentTarget?.value);
        }}
      />
    </>
  );
};

export default InputTextEditor;
