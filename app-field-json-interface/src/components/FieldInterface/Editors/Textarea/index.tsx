import { Box, Textarea } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";

const TextareaEditor = ({
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
      <Box>
        <Textarea
          id={definition.key}
          defaultValue={value}
          onBlurCapture={(e) => {
            const changeValue = e?.currentTarget?.value;
            if (value !== changeValue) {
              handleUpdate(e?.currentTarget?.value);
            }
          }}
        />
      </Box>
    </>
  );
};

export default TextareaEditor;
