import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Note, Spinner } from '@contentful/f36-components';
import components from '../components';
import { createClient } from 'contentful-management';
import { cleanContentfulEntry } from '../utils/contentful';

const defaultLocale = 'en-US';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const parameters = sdk.parameters.installation;
  const id = sdk.contentType.sys.id;

  const Component = useMemo(() => components[parameters[id]?.component], [parameters, id]);
  const keyMappings = useMemo(() => parameters[id]?.keyMappings || {}, [parameters, id]);
  const valueMappings = useMemo(() => parameters[id]?.valueMappings || {}, [parameters, id]);

  const [props, setProps] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const client = createClient({ apiAdapter: sdk.cmaAdapter });
      const space = await client.getSpace(sdk.ids.space);
      const environment = await space.getEnvironment(sdk.ids.environment);
      
      // Using .getEntryReferences is the only way (or rather most efficient way) to bring the data from nested entries
      const entries = await environment.getEntryReferences(sdk.entry.getSys().id);
      const entry = entries.items[0];
      
      // Quicker to look up the references in a map, only going through the array once
      const references = new Map();
  
      for (const reference of (entries.includes?.Entry || [])) {
        references.set(reference.sys.id, reference);
      }
      
      for (const [key, reference] of Object.entries(entry.fields)) {
        if (references.has(reference[defaultLocale]?.sys?.id)) {
          entry.fields[key][defaultLocale] = references.get(reference[defaultLocale]?.sys?.id);
        }
      }
      
      const _props = cleanContentfulEntry(entry, parameters, references);
  
      setProps(_props);
    } finally {
      setLoading(false);
    }
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.window.startAutoResizer();
    fetchData();
    const detachables: Array<() => void> = [];

    Object.entries(sdk.entry.fields).forEach(([key, object]) => {
      const detach = object.onValueChanged((value) => {
        const k = keyMappings[key] || key;
        const v = valueMappings[value] || value;

        setProps(props => ({ ...props, [k]: v }));
      });
      detachables.push(detach);
    })

    return () => {
      detachables.forEach(detach => detach());
    }
  }, [sdk, keyMappings, valueMappings, fetchData]);

  if (!parameters[id] || !Component) {
    return (
      <Note variant="warning">
        The preview app is not properly set up for this content type.
        <br />
        Please go to the configuration screen to add a configuration for {sdk.contentType.name}.
      </Note>
    );
  };

  if (loading) {
    return <Spinner />
  }

  return <div><Component {...props} /></div>;
};

export default Field;
