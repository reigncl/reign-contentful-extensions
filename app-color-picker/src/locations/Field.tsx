import React, { useEffect, useRef, useState } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import {
  CirclePicker,
  ChromePicker,
  CompactPicker,
  ColorResult,
} from "react-color";

export enum TypeColorPicker {
  CirclePicker = "CirclePicker",
  ChromePicker = "ChromePicker",
  CompactPicker = "CompactPicker",
  HTMLNative = "HTMLNative",
}

export interface ExtensionParametersInstance {
  contentType?: string;
  field?: string;
  content?: Array<string>;
  type?: TypeColorPicker;
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [value, setValue] = useState<string>(
    sdk.field?.getValue() ? sdk.field.getValue() : ""
  );
  const detachExternalChangeHandler = useRef<Function>();
  const [parameters, setParameters] = useState<
    ExtensionParametersInstance | undefined
  >();
  const availableColors = parameters?.content ?? [];

  const onChangeColor = async (color: ColorResult) => {
    setValue(color.hex);
  };

  const onChangeColorComplete = async (color: ColorResult) => {
    setValue(color.hex);
    await sdk.field.setValue(color.hex);
  };

  const onChangeNative = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value;
    setValue(value);
    await sdk.field.setValue(value);
  };

  const onExternalChange = (externalValue: string) => {
    if (externalValue) {
      setValue(externalValue);
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    detachExternalChangeHandler.current =
      sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler.current)
        detachExternalChangeHandler.current();
    };
  }, [sdk]);

  useEffect(() => {
    const paramsFromField = (
      sdk.parameters.installation?.items as Array<ExtensionParametersInstance>
    )?.find(
      (value: ExtensionParametersInstance) =>
        value?.contentType === sdk.ids.contentType &&
        value?.field === sdk.ids.field
    );
    setParameters(paramsFromField);
  }, [sdk.parameters]);

  return (
    <div style={{ padding: "15px" }}>
      {parameters?.type === TypeColorPicker.HTMLNative && (
        <input
          value={value}
          type="color"
          title={value}
          onChange={onChangeNative}
          name={sdk.field.id}
        />
      )}

      {parameters?.type === TypeColorPicker.CirclePicker && (
        <CirclePicker
          color={value}
          colors={availableColors}
          onChangeComplete={onChangeColorComplete}
        />
      )}

      {parameters?.type === TypeColorPicker.ChromePicker && (
        <ChromePicker
          color={value}
          disableAlpha={true}
          onChange={onChangeColor}
          onChangeComplete={onChangeColorComplete}
        />
      )}

      {parameters?.type === TypeColorPicker.CompactPicker && (
        <CompactPicker
          color={value}
          colors={availableColors}
          onChangeComplete={onChangeColorComplete}
        />
      )}
    </div>
  );
};

export default Field;
