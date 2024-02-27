import { ReactNode, useEffect, useState } from "react";
import { FieldValueContext } from "./FieldValueContex";
import { FieldAppSDK } from "@contentful/app-sdk";
import { FieldInterfaceValue } from "../components/FieldInterface/FieldInterface.types";

export const FieldValueProvider = ({
  children,
  sdk,
}: {
  children: ReactNode;
  sdk: FieldAppSDK;
}) => {
  const [value, updateValue] = useState<FieldInterfaceValue>(null);
  const handleUpdateValue = async (newValue: FieldInterfaceValue) => {
    updateValue(newValue);
    await sdk.field.setValue(newValue);
  };

  useEffect(() => {
    updateValue(sdk.field.getValue());
  }, [sdk]);

  return (
    <FieldValueContext.Provider
      value={{ fieldValue: value, fieldValueUpdate: handleUpdateValue }}
    >
      {children}
    </FieldValueContext.Provider>
  );
};
