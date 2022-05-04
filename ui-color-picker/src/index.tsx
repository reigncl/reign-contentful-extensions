import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { CirclePicker, ChromePicker, CompactPicker, ColorResult } from 'react-color';

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
  const [value, setValue] = React.useState<string>(
    props.sdk.field?.getValue() ? props.sdk.field.getValue() : ''
  );
  // eslint-disable-next-line @typescript-eslint/ban-types
  const detachExternalChangeHandler = React.useRef<Function>();
  const [parameters, setParameters] = React.useState<ExtensionParametersInstance>(
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

  React.useEffect(() => {
    props.sdk.window.startAutoResizer();
    detachExternalChangeHandler.current = props.sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler.current) detachExternalChangeHandler.current();
    };
  }, [props.sdk]);

  return (
    <div style={{'padding': '10px'}}>
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
    </div>
  );
};

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
