import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { useEffect, useState, useRef } from 'react';

interface AppProps {
  sdk: FieldExtensionSDK;
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

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValue(value);
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
    <input
      value={value}
      onChange={(event) => onChange(event as React.ChangeEvent<HTMLInputElement>)}
      type="color"
      title={value}
      name={props.sdk.field.id}
    />
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
