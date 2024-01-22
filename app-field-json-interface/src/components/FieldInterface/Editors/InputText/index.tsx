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
    {definition?.inputTextType} as
      <TextInput
        id={definition.key}
        defaultValue={value}
        type={definition?.inputTextType ?? "text"}
        onBlurCapture={(e) => {
          const changeValue = e?.currentTarget?.value;
          if (value !== changeValue) {
            handleUpdate(e?.currentTarget?.value);
          }
        }}
      />
    </>
  );
};

export default InputTextEditor;
