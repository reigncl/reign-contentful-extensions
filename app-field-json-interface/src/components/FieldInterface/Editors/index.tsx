import { FormControl } from "@contentful/f36-components";
import BooleanEditor from "./Boolean";
import InputTextEditor from "./InputText";
import InputTextListEditor from "./InputTextList";
import SelectEditor from "./Select";
import TextareaEditor from "./Textarea";
import { getValue, setValue } from "../../../util";
import { InterfaceItem } from "../../FieldSettings/FieldSetup.types";

const EditorsHandler = ({
  interfaceItem,
  updateValue,
  value,
}: {
  interfaceItem: InterfaceItem;
  updateValue: Function;
  value: Record<string, unknown>;
}) => {
  const fieldValue = getValue(value, interfaceItem.key);

  const handleUpdate = (update: string) => {
    updateValue(setValue(value ?? {}, interfaceItem.key, update));
  };

  const RenderEditor = ({ type }: { type: string }) => {
    switch (type) {
      case "InputText":
        return (
          <InputTextEditor
            value={fieldValue}
            handleUpdate={handleUpdate}
            definition={interfaceItem}
          />
        );
      case "InputTextList":
        return (
          <InputTextListEditor
            value={fieldValue}
            handleUpdate={handleUpdate}
            definition={interfaceItem}
          />
        );
      case "Textarea":
        return (
          <TextareaEditor
            value={fieldValue}
            handleUpdate={handleUpdate}
            definition={interfaceItem}
          />
        );
      case "Select":
        return (
          <SelectEditor
            value={fieldValue}
            handleUpdate={handleUpdate}
            definition={interfaceItem}
          />
        );
      case "Boolean":
        return (
          <BooleanEditor
            value={fieldValue}
            handleUpdate={handleUpdate}
            definition={interfaceItem}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <FormControl>
      <FormControl.Label isRequired={interfaceItem?.required === true}>
        {interfaceItem?.label}
      </FormControl.Label>
      <RenderEditor type={interfaceItem?.type} />
      <FormControl.HelpText>{interfaceItem?.helpText}</FormControl.HelpText>
    </FormControl>
  );
};

export default EditorsHandler;