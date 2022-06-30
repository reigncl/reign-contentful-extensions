import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  Note,
  TextInput,
} from "@contentful/f36-components";
import { DialogExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import tokens from "@contentful/f36-tokens";

interface KeyValue {
  id: string;
  key?: string;
  value?: string;
}

interface DialogParameters {
  [key: string]: string;
}

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>();

  const [valueList, setValueList] = useState<KeyValue[]>([]);
  const [keyValueCounter, setKeyValueCounter] = useState(0);

  useEffect(() => {
    sdk.window.startAutoResizer();
    const parameters = sdk.parameters.invocation as
      | DialogParameters
      | undefined;
    if (parameters) {
      const valueListArray = [];
      let keyValueCont = 0;
      for (const key in parameters) {
        valueListArray.push({
          id: keyValueCont.toString(),
          key: key,
          value: parameters[key],
        });
        keyValueCont++;
      }
      setValueList(valueListArray);
      setKeyValueCounter(keyValueCont);

      console.log({ valueListArray });
    }
    //eslint-disable-next-line
  }, []);

  const addKeyValue = () => {
    setValueList([
      ...valueList,
      { id: keyValueCounter.toString(), key: "", value: "" },
    ]);
    setKeyValueCounter(keyValueCounter + 1);
  };

  const removeKeyValue = (id: string) => {
    setValueList(valueList.filter((value) => id !== value.id));
  };

  const parse = (value: string) => {
    try {
      const obj = JSON.parse(value);
      return obj;
    } catch (e) {
      return value;
    }
  };

  const saveData = () => {
    const configData = valueList.reduce((valueListObject, currentValue) => {
      if (currentValue.key && currentValue.value) {
        return {
          ...valueListObject,
          [currentValue.key]: parse(currentValue.value),
        };
      }
      return valueListObject;
    }, {});

    console.log({ configData });
    sdk.close(configData);
  };

  const handleKeyChange = (event: any, id: string) => {
    const value = valueList.find((value) => value.id === id);
    if (value) {
      value.key = event.target.value;
    }
  };

  const handleValueChange = (event: any, id: string) => {
    const value = valueList.find((value) => value.id === id);
    if (value) {
      value.value = event.target.value;
    }
  };

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"space-between"}
      style={{ height: "100vh" }}
    >
      <Flex
        flexGrow={1}
        padding={"spacingL"}
        flexDirection={"column"}
        style={{ overflowY: "scroll" }}
      >
        {!valueList.length && (
          <Note variant="warning">No configuration variables found</Note>
        )}
        {valueList.map((value) => {
          const stringValue =
            typeof value.value === "object"
              ? JSON.stringify(value.value)
              : value.value;
          return (
            <Flex alignItems={"flex-end"} key={value.id}>
              <Flex flexGrow={1}>
                <FormControl style={{ margin: tokens.spacingS }}>
                  <FormControl.Label>Key</FormControl.Label>
                  <TextInput
                    value={value.key}
                    onChange={(event) => handleKeyChange(event, value.id)}
                    name={"variable"}
                    id={"variable"}
                  />
                </FormControl>
              </Flex>
              <Flex flexGrow={1}>
                <FormControl style={{ margin: tokens.spacingS }}>
                  <FormControl.Label>Value</FormControl.Label>
                  <TextInput
                    value={stringValue}
                    onChange={(event) => handleValueChange(event, value.id)}
                    name={"variable"}
                    id={"variable"}
                  />
                </FormControl>
              </Flex>
              <Flex flexGrow={2}>
                <FormControl style={{ margin: tokens.spacingS }}>
                  <Button
                    variant={"negative"}
                    onClick={() => removeKeyValue(value.id)}
                  >
                    Remove Variable
                  </Button>
                </FormControl>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex
        justifyContent={"space-between"}
        padding={"spacingL"}
        className={"f36-box-shadow--default"}
      >
        <Button variant={"positive"} onClick={() => addKeyValue()}>
          Add Variable
        </Button>
        <Flex>
          <Button
            variant={"positive"}
            style={{ marginRight: tokens.spacingM }}
            onClick={() => saveData()}
          >
            Save
          </Button>
          <Button variant={"secondary"} onClick={() => sdk.close()}>
            Close
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dialog;
