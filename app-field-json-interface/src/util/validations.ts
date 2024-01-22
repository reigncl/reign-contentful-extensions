import { FieldInterfaceValue } from "../components/FieldInterface/FieldInterface.types";
import {
  Interface,
  InterfaceItem,
} from "../components/FieldSettings/FieldSetup.types";

export interface ValidateEntryValueOutput {
  key: string;
  isValid: boolean;
}

const validateField = (value: FieldInterfaceValue, item: InterfaceItem) => {};

const validateEntryValue = (
  value: FieldInterfaceValue,
  iface: Interface
): Array<ValidateEntryValueOutput> => {
  const output: Array<ValidateEntryValueOutput> = [];
  let hasError = false;
  if (value && Array.isArray(value) && iface.isArray === true) {
    // Multiple Mode
  } else {
    // Single Mode
  }
  return output;
};

export { validateEntryValue, validateField };
