import { Box, Switch } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";

const BooleanEditor = ({
  definition,
  value,
  handleUpdate,
}: {
  definition: InterfaceItem;
  value: boolean;
  handleUpdate: Function;
}) => {
  return (
    <>
      <Box>
        <Switch
          defaultChecked={value ? true : false}
          onChange={(e) => {
            handleUpdate(e.target.checked);
          }}
          name={definition.key}
          id={definition.key}
        />
      </Box>
    </>
  );
};

export default BooleanEditor;
