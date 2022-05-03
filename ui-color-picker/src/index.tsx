import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { useEffect, useState, useRef } from 'react';
import { CirclePicker, ChromePicker, SwatchesPicker, ColorResult } from 'react-color';

interface AppProps {
  sdk: FieldExtensionSDK;
}

enum TypeColorPicker {
  CirclePicker = 'CirclePicker',
  ChromePicker = 'ChromePicker',
  SwatchesPicker = 'SwatchesPicker',
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
  const parameters = props.sdk.parameters.instance as ExtensionParametersInstance;
  const availableColors = parameters?.colors?.split(',') || [];

  const onChange = (color: ColorResult) => {
    setValue(color.hex);
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

  const MainPicker = () => {
    switch (parameters?.type) {
      case TypeColorPicker.CirclePicker:
        return (
          <CirclePicker
            color={value}
            colors={availableColors}
            onChangeComplete={onChange}
          />
        );
      case TypeColorPicker.ChromePicker:
        return (
          <ChromePicker
            color={value}
            onChangeComplete={onChange}
          />
        );
      case TypeColorPicker.SwatchesPicker:
        return (
          <SwatchesPicker
            color={value}
            colors={[availableColors]}
            onChange={onChange}
            onChangeComplete={onChange}
          />
        );
      case TypeColorPicker.HTMLNative:
      default:
        return <input value={value} type="color" title={value} name={props.sdk.field.id} />;
    }
  };

  return (
    <div style={{'padding': '0 20px'}}>
      <MainPicker />
    </div>
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
