import { FieldInterfaceValue } from "../components/FieldInterface/FieldInterface.types";
import {
  Interface,
  InterfaceItem,
} from "../components/FieldSettings/FieldSetup.types";

export type ValidateEntryValueOutput = Record<string, boolean>;

const validateField = (
  value: string | number | boolean,
  item: InterfaceItem
): boolean => {
  let isValid = false;
  if (item?.type === "InputText") {
    let regexString: RegExp | undefined;
    switch (item?.inputTextType) {
      case "email":
        regexString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        break;
      case "number":
        regexString = /^[0-9]*$/;
        break;
      case "url":
        regexString =
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        break;
      case "regex":
        regexString = item?.regex;
        break;
      default:
        isValid = true;
        break;
    }
    if (regexString) {
      const regex = new RegExp(regexString);
      return regex.test(value?.toString());
    }
  }
  return isValid;
};

const validateEntryValue = (
  value: FieldInterfaceValue,
  iface: Interface
): Array<ValidateEntryValueOutput> | ValidateEntryValueOutput => {
  let output: Array<ValidateEntryValueOutput> | ValidateEntryValueOutput;
  if (value && Array.isArray(value) && iface.isArray === true) {
    // Multiple Mode
    output = value?.map((val: Record<string, unknown>) => {
      let valItem: ValidateEntryValueOutput = {};
      iface?.items?.forEach((item: InterfaceItem) => {
        valItem[item.key] = validateField(val[item.key] as string, item);
      });
      return valItem;
    });
  } else {
    // Single Mode
    output = {};
    iface?.items?.forEach((item: InterfaceItem) => {
      output[item.key] = validateField(value[item.key] as string, item);
    });
  }
  return output;
};

export { validateEntryValue, validateField };
