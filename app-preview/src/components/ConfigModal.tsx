import { SetStateAction, useEffect, useState } from "react";
import { Button, Flex, Form, FormControl, Heading, Modal, Select, Stack, Table, TextInput } from "@contentful/f36-components";
import { PlusIcon, DeleteIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import components from "../components";
import { AppInstallationParameters } from "../locations/ConfigScreen";

const ConfigModal: React.FC<ConfigModalProps> = ({ setShown, shown, contentTypes, setParameters, parameters, editing, setEditing }) => {
  const [contentType, setContentType] = useState<string | undefined>(contentTypes.find((ct) => Boolean(!parameters[ct])) || undefined);
  const [component, setComponent] = useState<string>(Object.keys(components)[0]);

  const [keyMappings, setKeyMappings] = useState<Record<string, string>>({});
  const [valueMappings, setValueMappings] = useState<Record<string, string>>({});

  const [key, setKey] = useState<string>('');
  const [keyReplacement, setKeyReplacement] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [valueReplacement, setValueReplacement] = useState<string>('');

  useEffect(() => {
    if (!shown) {
      setKeyMappings({});
      setValueMappings({});
      setKey('');
      setKeyReplacement('');
      setValue('');
      setValueReplacement('');
      setEditing(null);
    }
  }, [shown, setEditing]);

  useEffect(() => {
    if (editing) {
      setContentType(editing);
      setKeyMappings(parameters[editing].keyMappings);
      setValueMappings(parameters[editing].valueMappings);
      setComponent(parameters[editing].component);
    }
  }, [editing, parameters]);

  const addKeyReplacement = () => {
    if (!key || !keyReplacement) return;

    setKeyMappings((keyMappings) => ({
      ...keyMappings,
      [key]: keyReplacement
    }));

    setKey('');
    setKeyReplacement('');
  };

  const addValueReplacement = () => {
    if (!value || !valueReplacement) return;

    setValueMappings((valueMappings) => ({
      ...valueMappings,
      [value]: valueReplacement
    }));

    setValue('');
    setValueReplacement('');
  };

  const deleteKey = (key: string) => {
    if (keyMappings[key]) {
      setKeyMappings((mappings) => {
        const newMappings = { ...mappings };
        delete newMappings[key];
        return newMappings;
      })    
    }
  };

  const deleteValue = (value: string) => {
    if (valueMappings[value]) {
      setValueMappings((mappings) => {
        const newMappings = { ...mappings };
        delete newMappings[value];
        return newMappings;
      })
    }
  }

  const saveParameters = async () => {
    if (!contentType || !component) return;

    const parameter = {
      component,
      keyMappings,
      valueMappings,
    };

    setParameters((parameters) => ({
      ...parameters,
      [contentType]: parameter
    }));

    setShown(false);
  }

  return (
    <Modal isShown={shown} onClose={() => setShown(false)}>
      <Heading>Add new configuration</Heading>
      <Form>
        <FormControl>
          <FormControl.Label isRequired>Content Type</FormControl.Label>
          {editing ? (
            <TextInput isDisabled value={editing} />
          ) : (
            <Select id="contentType" name="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)}>
              {contentTypes.map((contentType) => (
                <Select.Option key={contentType} value={contentType} isDisabled={Boolean(parameters[contentType])}>{contentType}</Select.Option>
              ))}
            </Select>
          )}
          <FormControl.HelpText>Please select a content type. Content types that already have a configuration created are disabled.</FormControl.HelpText>
        </FormControl>

        <FormControl>
          <FormControl.Label isRequired>Component</FormControl.Label>
          <Select id="component" name="component" value={component} onChange={(e) => setComponent(e.target.value)}>
            {Object.keys(components).map((component) => (
              <Select.Option key={component} value={component}>{component}</Select.Option>
            ))}
          </Select>
          <FormControl.HelpText>Please select the component that will be used for rendering the preview.</FormControl.HelpText>
        </FormControl>

        <FormControl>
          <FormControl.Label>Key Mappings</FormControl.Label>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell align="center">Key</Table.Cell>
                <Table.Cell align="center">Replacement</Table.Cell>
                <Table.Cell width={10} />
              </Table.Row>
            </Table.Head>
            <Table.Body>
            {Object.entries(keyMappings).map(([key, replacement]) => (
              <Table.Row key={key}>
                <Table.Cell align="center">{key}</Table.Cell>
                <Table.Cell align="center">{replacement}</Table.Cell>
                <Table.Cell>
                  <DeleteIcon variant="negative" width={10} className={css({ cursor: 'pointer' })} onClick={() => deleteKey(key)} />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table>
          <Stack className={css({ marginTop: '10px' })}>
            <TextInput placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} />
            <TextInput 
              placeholder="Replacement" 
              value={keyReplacement} 
              onChange={(e) => setKeyReplacement(e.target.value)}
              onKeyDown={(e) => e.code === 'Enter' && addKeyReplacement()} 
            />
            <Button endIcon={<PlusIcon />} variant="primary" onClick={addKeyReplacement}>
              Add
            </Button>          
          </Stack>
          <FormControl.HelpText>Key mappings change the way the fields are passed as props to the components. For example, the 'name' field in Contentful can be mapped to be passed as 'title' to the component.</FormControl.HelpText>
        </FormControl>

        <FormControl>
          <FormControl.Label>Value Mappings</FormControl.Label>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell align="center">Value</Table.Cell>
                <Table.Cell align="center">Replacement</Table.Cell>
                <Table.Cell width={10} />
              </Table.Row>
            </Table.Head>
            <Table.Body>
            {Object.entries(valueMappings).map(([value, replacement]) => (
              <Table.Row key={value}>
                <Table.Cell align="center">{value}</Table.Cell>
                <Table.Cell align="center">{replacement}</Table.Cell>
                <Table.Cell>
                  <DeleteIcon variant="negative" width={10} className={css({ cursor: 'pointer' })} onClick={() => deleteValue(value)} />
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table>
          <Stack className={css({ marginTop: '10px' })}>
            <TextInput placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />
            <TextInput 
              placeholder="Replacement" 
              value={valueReplacement} 
              onChange={(e) => setValueReplacement(e.target.value)} 
              onKeyDown={(e) => e.code === 'Enter' && addValueReplacement()} 
            />
            <Button endIcon={<PlusIcon />} variant="primary" onClick={addValueReplacement}>
              Add
            </Button>          
          </Stack>
          <FormControl.HelpText>Value mappings change the way the field values are passed as props to the components. For example, the color code 'N0' can be translated to be passed as '#FFFFFF' to the component.</FormControl.HelpText>
        </FormControl>
      </Form>
      
      <Flex justifyContent="end">
        <Stack>
          <Button onClick={() => setShown(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => saveParameters()} isDisabled={!contentType || !component}>Save</Button>
        </Stack>
      </Flex>
    </Modal>
  )
};

export default ConfigModal;

interface ConfigModalProps {
  shown: boolean;
  setShown: (shown: SetStateAction<boolean>) => void;
  contentTypes: string[];
  setParameters: (parameters: SetStateAction<AppInstallationParameters>) => void;
  parameters: AppInstallationParameters;
  editing: string | null;
  setEditing: (editing: SetStateAction<string | null>) => void;
};