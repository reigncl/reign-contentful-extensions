import { FormControl } from "@contentful/f36-components";
import BooleanEditor from "./Boolean";
import InputTextEditor from "./InputText";
import InputTextListEditor from "./InputTextList";
import SelectEditor from "./Select";
import TextareaEditor from "./Textarea";
import { getValue, setValue } from "../../../util";
import { InterfaceItem } from "../../FieldSettings/FieldSetup.types";
import { useEffect } from "react";

const EditorsHandler = ({
  interfaceItem,
  updateValue,
  value,
  isInvalid,
}: {
  interfaceItem: InterfaceItem;
  updateValue: Function;
  value: Record<string, unknown>;
  isInvalid: boolean;
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
    <FormControl isInvalid={isInvalid}>
      <FormControl.Label /*isRequired={interfaceItem?.required === true}*/>
        {interfaceItem?.label} isInvalid{isInvalid?.toString()}
      </FormControl.Label>
      <RenderEditor type={interfaceItem?.type} />
      <FormControl.HelpText>{interfaceItem?.helpText}</FormControl.HelpText>
      {isInvalid && interfaceItem?.errorMessage && (
        <FormControl.ValidationMessage>
          {interfaceItem?.errorMessage}
        </FormControl.ValidationMessage>
      )}
    </FormControl>
  );
};

export default EditorsHandler;
