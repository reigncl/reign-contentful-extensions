import * as React from 'react';
import {render} from 'react-dom';
import { TextInput, ValidationMessage } from '@contentful/forma-36-react-components';
import {init, FieldExtensionSDK, SearchQuery } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import {useEffect, useState} from "react";

interface AppProps {
   sdk: FieldExtensionSDK;
}

const App = (props: AppProps) => {
   const [value, setValue] = useState<string>(props.sdk.field?.getValue() ? props.sdk.field.getValue() : '')
   const [site, setSite] = useState<string>(props.sdk.entry?.fields['site']?.getValue() || '');
   const [fieldValue, setFieldValue] = useState<string>(props.sdk.field?.getValue() ? props.sdk.field.getValue() : '');
   const [isSlugUsed, setIsSlugUsed] = useState<boolean>(false);

   let detachExternalChangeHandler: Function | null = null;
   let detachSiteChangeHandler: Function | null = null;

   useEffect(() => {
      props.sdk.window.startAutoResizer();
      detachSiteChangeHandler = props.sdk.entry?.fields['site'].onValueChanged(siteChangeHandler);
      detachExternalChangeHandler = props.sdk.field?.onValueChanged(onExternalChange);

      return () => {
         if (detachSiteChangeHandler) detachSiteChangeHandler();
         if (detachExternalChangeHandler) detachExternalChangeHandler();
      }
   }, []);

   useEffect(() => {
      const timeout = setTimeout(() => {
         validateSlugUsed().then(result => {
            setIsSlugUsed(result);
            if (result) {
               setFieldValue('');
            } else {
               setFieldValue(value);
            }
         })
      }, 1500)


      return () => clearTimeout(timeout)
   }, [value]);

   useEffect(() => {
      if (fieldValue) {
         props.sdk.field?.setValue(fieldValue).then();
      } else {
         props.sdk.field?.removeValue().then();
      }
   }, [fieldValue])

   useEffect(() => {
      validateSlugUsed().then(result => {
         setIsSlugUsed(result);
         if (result) {
            setFieldValue('');
         } else {
            setFieldValue(value);
         }
      })
   }, [site])

   const onExternalChange = (externalValue: string) => {
      if (externalValue) {
         setValue(externalValue);
      }
   };

   const siteChangeHandler = (site: string) => {
      setSite(site);
   }

   const validateSlugUsed = async () => {
      if (value && site) {
         const thisId = props.sdk.entry.getSys().id;
         const searchQuery: SearchQuery = {
            limit: 5,
            ['content_type']: 'pg-page',
            ['fields.site[in]']: site,
            ['fields.slug[in]']: value,
            ['sys.id[nin]']: thisId,
         }
         const result = await props.sdk.space.getEntries(searchQuery);
         if (result.total > 0) {
            setIsSlugUsed(true);
            return true;
         }
      }
      return false;
   }

   const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setValue(value);
   };


   return (
       <>
          <TextInput
              value={value}
              onChange={event => onChange(event as React.ChangeEvent<HTMLInputElement>)}
          />
          {isSlugUsed && <ValidationMessage style={{marginTop: '0.5rem'}}>
              El slug ya se encuentra en uso para el sitio seleccionado
          </ValidationMessage>}
       </>
   );
}

init(sdk => {
   render(<App sdk={sdk as FieldExtensionSDK}/>, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
