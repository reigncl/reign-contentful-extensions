import * as React from 'react';
import { render } from 'react-dom';
import { HelpText, TextInput, ValidationMessage } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK, SearchQuery } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { useEffect, useState } from 'react';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface ExtensionParametersInstance {
  siteFieldId?: string;
  errorMessage?: string;
  helpMessage?: string;
}

const App = (props: AppProps) => {
  const appEnvironmentUri =
    props.sdk.ids.environment !== 'master' ? `/environments/${props.sdk.ids.environment}` : '';
  const appUriContentType = `https://app.contentful.com/spaces/${props.sdk.ids.space}${appEnvironmentUri}/content_types/${props.sdk.ids.contentType}/fields`;
  const [value, setValue] = useState<string>(
    props.sdk.field?.getValue() ? props.sdk.field.getValue() : ''
  );
  const [fieldValue, setFieldValue] = useState<string>(
    props.sdk.field?.getValue() ? props.sdk.field.getValue() : ''
  );
  const [isSlugUsed, setIsSlugUsed] = useState<boolean>(false);
  let detachExternalChangeHandler: Function | null = null;
  let detachSiteChangeHandler: Function | null = null;
  const siteFielIdDefault = 'site';

  if (
    !(props.sdk.parameters.instance as ExtensionParametersInstance).siteFieldId ||
    !(props.sdk.parameters.instance as ExtensionParametersInstance).errorMessage
  ) {
    return (
      <>
        <ValidationMessage style={{ marginTop: '0.5rem' }}>
          Please complete the ui-extension setup for field <strong>{props.sdk.field.id}</strong>{' '}
          <a href={appUriContentType} target="_blank">
            here
          </a>
          .
        </ValidationMessage>
      </>
    );
  }

  const [site, setSite] = useState<string>(
    props.sdk.entry?.fields[
      (props.sdk.parameters.instance as ExtensionParametersInstance).siteFieldId ??
        siteFielIdDefault
    ]?.getValue() || ''
  );

  useEffect(() => {
    props.sdk.window.startAutoResizer();
    detachSiteChangeHandler =
      props.sdk.entry?.fields[
        (props.sdk.parameters.instance as ExtensionParametersInstance).siteFieldId ??
          siteFielIdDefault
      ].onValueChanged(siteChangeHandler);
    detachExternalChangeHandler = props.sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachSiteChangeHandler) detachSiteChangeHandler();
      if (detachExternalChangeHandler) detachExternalChangeHandler();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateSlugUsed().then((result) => {
        setIsSlugUsed(result);
        if (result) {
          setFieldValue('');
        } else {
          setFieldValue(value);
        }
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    if (fieldValue) {
      props.sdk.field?.setValue(fieldValue).then();
    } else {
      props.sdk.field?.removeValue().then();
    }
  }, [fieldValue]);

  useEffect(() => {
    validateSlugUsed().then((result) => {
      setIsSlugUsed(result);
      if (result) {
        setFieldValue('');
      } else {
        setFieldValue(value);
      }
    });
  }, [site]);

  const onExternalChange = (externalValue: string) => {
    if (externalValue) {
      setValue(externalValue);
    }
  };

  const siteChangeHandler = (site: string) => {
    setSite(site);
  };

  const validateSlugUsed = async () => {
    if (value && site) {
      const thisId = props.sdk.entry.getSys().id;
      const searchQuery: SearchQuery = {
        limit: 5,
        ['content_type']: props.sdk.ids.contentType,
        [`fields.${
          (props.sdk.parameters.instance as ExtensionParametersInstance).siteFieldId ??
          siteFielIdDefault
        }[in]`]: site,
        [`fields.${props.sdk.field.id}[in]`]: value,
        ['sys.id[nin]']: thisId,
      };
      const result = await props.sdk.space.getEntries(searchQuery);
      if (result.total > 0) {
        setIsSlugUsed(true);
        return true;
      }
    }
    return false;
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValue(value);
  };

  return (
    <>
      <TextInput
        value={value}
        onChange={(event) => onChange(event as React.ChangeEvent<HTMLInputElement>)}
      />
      {(props.sdk.parameters.instance as ExtensionParametersInstance)?.helpMessage && (
        <HelpText>
          {(props.sdk.parameters.instance as ExtensionParametersInstance)?.helpMessage}
        </HelpText>
      )}
      {isSlugUsed && (
        <ValidationMessage style={{ marginTop: '0.5rem' }}>
          {(props.sdk.parameters.instance as ExtensionParametersInstance).errorMessage}
        </ValidationMessage>
      )}
    </>
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
