import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Heading, Form, Flex, Table, Button, Stack, Note } from '@contentful/f36-components'
import { PlusIcon, EditIcon, DeleteIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
import ConfigModal from '../components/ConfigModal';
import { createClient } from 'contentful-management';

export interface AppInstallationParameters {
  [contentType: string]: {
    component: string;
    keyMappings: Record<string, string>;
    valueMappings: Record<string, string>;
  }
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  const sdk = useSDK<AppExtensionSDK>();
  const cma = useCMA();

  const onConfigure = useCallback(async () => {
    const client = await createClient({ apiAdapter: sdk.cmaAdapter });
    const space = await client.getSpace(sdk.ids.space);
    const environment = await space.getEnvironment(sdk.ids.environment);
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen. 
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook
    for (const key of Object.keys(parameters)) {
      const contentType = await environment.getContentType(key);

      // If the content type already has the 'preview' field it is skipped
      if (contentType.fields.find((field) => field.id === 'preview')) {
        continue;
      }

      // Adds a 'preview' field to the selected content type
      contentType.fields.push({ omitted: false, disabled: false, required: false, type: 'Symbol', id: 'preview', name: 'Preview', localized: false });
      const updatedContentType = await contentType.update();
      await updatedContentType.publish();

      // Update the editor interface of the recently created 'preview' field to use the app's widget
      const editorInterface = await updatedContentType.getEditorInterface();
      editorInterface.controls?.pop();
      editorInterface.controls?.push({ fieldId: 'preview', widgetId: sdk.ids.app, widgetNamespace: 'app' });
      await editorInterface.update();
    }
    
    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      const allContentTypes = await cma.contentType.getMany({});
      setContentTypes(allContentTypes.items.map((contentType) => contentType.sys.id));

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk, cma]);

  const deleteConfig = (ct: string) => {
    if (parameters[ct]) {
      setParameters((parameters) => {
        const newParameters = { ...parameters };
        delete newParameters[ct];
        return newParameters;
      })
    }
  }

  const editConfig = (ct: string) => {
    setEditing(ct);
    setShowConfigModal(true);
  }

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>Preview app configurations</Heading>
        <Note variant="warning">
          After creating a preview configuration, a new field must be added to the content type (if it doesn't already exist), 
          and the preview widget must be selected under the 'Appearance' tab.
        </Note>
        <Table className={css({ marginBottom: '30px', marginTop: '20px' })}>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Content Type</Table.Cell>
              <Table.Cell>Component</Table.Cell>
              <Table.Cell>Key Mappings</Table.Cell>
              <Table.Cell>Value Mappings</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {Object.entries(parameters).map(([contentType, object]) => (
              <Table.Row key={contentType}>
                <Table.Cell>{contentType}</Table.Cell>
                <Table.Cell>{object.component}</Table.Cell>
                <Table.Cell>{Object.keys(object.keyMappings || {}).length}</Table.Cell>
                <Table.Cell>{Object.keys(object.valueMappings || {}).length}</Table.Cell>
                <Table.Cell>
                  <Stack>
                    <EditIcon onClick={() => editConfig(contentType)} className={css({ cursor: 'pointer' })} />
                    <DeleteIcon variant="negative" onClick={() => deleteConfig(contentType)} className={css({ cursor: 'pointer' })} />
                  </Stack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Button startIcon={<PlusIcon />} variant="primary" onClick={() => setShowConfigModal(true)}>
          Create configuration
        </Button>
        {contentTypes.length && (
          <ConfigModal 
            shown={showConfigModal}
            setShown={setShowConfigModal} 
            contentTypes={contentTypes} 
            setParameters={setParameters}
            parameters={parameters}
            editing={editing}
            setEditing={setEditing}
          />
        )}
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
