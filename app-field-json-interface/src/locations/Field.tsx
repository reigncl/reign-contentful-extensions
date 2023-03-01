import React, { useEffect, useState } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import MainEditor from "../components/MainEditor";
import { EditorTypeValue, FieldState } from "../types";
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

    setStructure(structure?.json);
    setValue(sdk.field.getValue() ?? {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  return (
    <>
      <MainEditor
        structure={stucture as FieldState}
        value={value as EditorTypeValue}
        handleUpdate={(e: any) => {
          sdk.field.setValue(e);
        }}
      />
    </>
  );
};

export default Field;
