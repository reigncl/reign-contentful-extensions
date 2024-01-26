import { Box, TextInput, Pill } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";

const InputTextListEditor = ({
  definition,
  value,
  handleUpdate,
}: {
  definition: InterfaceItem;
  value: Array<string>;
  handleUpdate: Function;
}) => {
  return (
    <>
      <Box>
        <TextInput
          id={definition.key}
          defaultValue={""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newValue = [...(value ?? [])];
              newValue.push(e?.currentTarget?.value);
              handleUpdate(newValue);
            }
          }}
        />
      </Box>
      <Box padding="spacingS">
        {value?.map((val: string, idx: number) => {
          return (
            <span key={`Pill-${idx}`}>
              <Pill
                style={{ marginBottom: "5px" }}
                testId={val}
                label={val}
                onClose={() => {
                  const newValue = [...(value ?? [])];
                  newValue.splice(idx, 1);
                  handleUpdate(newValue);
                }}
              />{" "}
            </span>
          );
        })}
      </Box>
    </>
  );
};

export default InputTextListEditor;
