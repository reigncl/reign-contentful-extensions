import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import './index.css';
import { useEffect, useState, useRef } from 'react';
import { CirclePicker, ChromePicker, CompactPicker, ColorResult } from 'react-color';
import { FormControl } from '@contentful/f36-components';

interface AppProps {
  sdk: FieldExtensionSDK;
}

enum TypeColorPicker {
  CirclePicker = 'CirclePicker',
  ChromePicker = 'ChromePicker',
  CompactPicker = 'CompactPicker',
  HTMLNative = 'HTMLNative',
}

interface ExtensionParametersInstance {
  colors?: string;
  type?: TypeColorPicker;
}

interface AppProps {
  sdk: FieldExtensionSDK;
}

const App = (props: AppProps) => {
  const [value, setValue] = useState<string>(
    props.sdk.field?.getValue() ? props.sdk.field.getValue() : ''
  );
  // eslint-disable-next-line @typescript-eslint/ban-types
  const detachExternalChangeHandler = useRef<Function>();
  const [parameters, setParameters] = useState<ExtensionParametersInstance>(
    props.sdk.parameters.instance as ExtensionParametersInstance
  );
  const availableColors =
    parameters?.colors?.split(',')?.map((color: string) => color?.toLowerCase()?.trim()) || [];

  const onChangeColor = async (color: ColorResult) => {
    setValue(color.hex);
  };

  const onChangeColorComplete = async (color: ColorResult) => {
    setValue(color.hex);
    await props.sdk.field.setValue(color.hex);
  };

  const onChangeNative = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value;
    setValue(value);
    await props.sdk.field.setValue(value);
  };

  const onExternalChange = (externalValue: string) => {
    if (externalValue) {
      setValue(externalValue);
    }
  };

  useEffect(() => {
    props.sdk.window.startAutoResizer();
    detachExternalChangeHandler.current = props.sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler.current) detachExternalChangeHandler.current();
    };
  }, [props.sdk]);

  return (
    <FormControl margin="spacingS">
      {parameters?.type === TypeColorPicker.HTMLNative && (
        <input
          value={value}
          type="color"
          title={value}
          onChange={onChangeNative}
          name={props.sdk.field.id}
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
    </FormControl>
  );
};

init((sdk) => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
