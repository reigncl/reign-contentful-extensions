import { createContext } from "react";
import { FieldInterfaceValue } from "../components/FieldInterface/FieldInterface.types";

export const FieldValueContext = createContext<{
  fieldValue: FieldInterfaceValue;
  fieldValueUpdate: (newValue: FieldInterfaceValue) => void;
}>({
  fieldValue: null,
  fieldValueUpdate: () => ({}),
});
