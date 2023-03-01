import React, { useEffect, useState } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import MainEditor from "../components/MainEditor";
import { EditorTypeValue, FieldState } from "../types";
import { deepEqual } from "../util/deep-equal";
import {
  AppInstallationParameters,
  ConfigJsonStructureItem,
} from "./ConfigScreen";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [value, setValue] = useState<EditorTypeValue>();
  const [stucture, setStructure] = useState<EditorTypeValue>();

  useEffect(() => {
    sdk.window.startAutoResizer();
    return () => {
      sdk.window.stopAutoResizer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const structure = (
      sdk.parameters.installation as AppInstallationParameters
    ).items?.find(
      (value: ConfigJsonStructureItem) =>
        value.contentType === sdk.ids.contentType &&
        value.field === sdk.ids.field
    );

    console.log('')
    console.log("Field useEffect structure", structure?.json);
    console.log("Field useEffect structure", structure?.json);

    setStructure(structure?.json);
    setValue(sdk.field.getValue() ?? {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  useEffect(() => {
    const currentValue =
      (sdk.field.getValue() as Record<string, unknown>) ?? {};
    if (deepEqual(currentValue, value as Record<string, unknown>) === false) {
      sdk.field.setValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <MainEditor
        structure={stucture as FieldState}
        value={value as FieldState}
        handleUpdate={(e: any)=> {
          console.log('handleUpdate e', e)
        }}
      />
    </>
  );
};

export default Field;
