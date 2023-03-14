import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  Select,
  TextInput,
  IconButton,
} from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { PlusIcon } from "@contentful/f36-icons";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import {
  AppInstallationParameters,
  ConfigJsonStructureItem,
} from "./ConfigScreen";
import Pills from "../components/Pills";

export enum TYPE_INPUT {
  "SINGLE",
  "MULTIPLE",
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [value, setValue] = useState<string[]>();
  const [valueTextInput, setValueTextInput] = useState<string>("");
  const [type, setType] = useState<TYPE_INPUT>(TYPE_INPUT.SINGLE);
  const [stringToSplit, setStringToSplit] = useState<string>("");
  const detachExternalChangeHandler = useRef<Function>();
  const textInputRef = useRef<any>();

  const populateValue = (data: string): void => {
    let dataAsArrayString: string[] = [];
    if (type === TYPE_INPUT.SINGLE) {
      dataAsArrayString = [...(value ?? []), data?.trim()];
    }
    if (type === TYPE_INPUT.MULTIPLE) {
      dataAsArrayString = data?.toString()?.split(stringToSplit);
      dataAsArrayString = dataAsArrayString?.map((vString: string) =>
        vString?.trim()
      );
      dataAsArrayString = (value ?? [])?.concat(dataAsArrayString);
    }
    sdk.field.setValue(dataAsArrayString);
    setValue(dataAsArrayString);
  };

  const onExternalChange = (externalValue: string[]) => {
    if (externalValue) {
      setValue(externalValue);
    }
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
    detachExternalChangeHandler.current =
      sdk.field?.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler.current)
        detachExternalChangeHandler.current();
    };
  }, [sdk]);

  useEffect(() => {
    const structure = (
      sdk.parameters.installation as AppInstallationParameters
    ).items?.find(
      (value: ConfigJsonStructureItem) =>
        value.contentType === sdk.ids.contentType &&
        value.field === sdk.ids.field
    );

    setStringToSplit(structure?.data ?? "");
    setValue(sdk.field.getValue());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  return (
    <>
      <FormControl>
        <TextInput.Group>
          <TextInput
            type="text"
            ref={textInputRef}
            value={valueTextInput}
            autoComplete={"off"}
            name="dialog-label"
            onChange={(event) => {
              setValueTextInput(event.currentTarget.value);
            }}
          />
          <IconButton
            variant="secondary"
            icon={<PlusIcon />}
            onClick={() => {
              populateValue(textInputRef.current.value);
              setValueTextInput('')
            }}
            aria-label="Add"
            isDisabled={!valueTextInput}
          >
            Add
          </IconButton>
          <Select
            id="optionSelect-controlled"
            name="optionSelect-controlled"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (e.currentTarget.value === "0") {
                setType(TYPE_INPUT.SINGLE);
              } else {
                setType(TYPE_INPUT.MULTIPLE);
              }
            }}
          >
            <Select.Option value={TYPE_INPUT.SINGLE}>Single</Select.Option>
            <Select.Option value={TYPE_INPUT.MULTIPLE}>Multiple</Select.Option>
          </Select>
        </TextInput.Group>
        {TYPE_INPUT.SINGLE === type && (
          <FormControl.HelpText>
            Enter your text, it will be added to the bottom of the list.
          </FormControl.HelpText>
        )}
        {TYPE_INPUT.MULTIPLE === type && (
          <FormControl.HelpText>
            Enter your multiples texts to add.{" "}
            <i>
              Separartor character is <strong>{stringToSplit}</strong>
            </i>
          </FormControl.HelpText>
        )}
      </FormControl>

      <Pills
        items={value as string[]}
        onChange={(dataOnChange: string[]) => {
          sdk.field.setValue(dataOnChange);
          setValue(dataOnChange);
        }}
      />
    </>
  );
};

export default Field;
