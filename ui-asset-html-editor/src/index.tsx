import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import './index.css';
import { Asset as FormaAsset } from '@contentful/f36-components'

interface AppProps {
  sdk: FieldExtensionSDK;
}

const App = (props: AppProps) => {
  return <>
  <FormaAsset type="image" src={undefined} style={{ width: '100%', height: 100 }} />
  </>;
}

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
