import { Box, Select } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";

const SelectEditor = ({
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
        <Select
          onBlurCapture={(e) => {
            handleUpdate(e?.currentTarget?.value);
          }}
          value={value}
          id={definition.key}
          name={definition.key}
        >
          <Select.Option
            key={`${definition.key}-default`}
            value={""}
            isDisabled={definition.required}
          >
            Select...
          </Select.Option>
          {definition?.options?.map((option: string, idx: number) => {
            return (
              <Select.Option key={`${definition.key}-${idx}`} value={option}>
                {option}
              </Select.Option>
            );
          })}
        </Select>
      </Box>
    </>
  );
};

export default SelectEditor;
