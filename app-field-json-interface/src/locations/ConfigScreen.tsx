import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import FieldSettings from "../components/FieldSettings/FieldSettings";
import { FieldSetup } from "../components/FieldSettings/FieldSetup.types";
import { Box, Heading } from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import {
  CollectionProp,
  ContentTypeProps,
  ContentFields,
  KeyValueMap,
} from "contentful-management";

export type ContentTypeInfo = {
  id: string;
  name: string;
  fields: Array<ContentFields<KeyValueMap>>;
};

const ConfigScreen = () => {
  const [contentTypes, setContentTypes] = useState<Array<ContentTypeInfo>>([]);
  const [parameters, setParameters] = useState<FieldSetup>({});
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  const onUpdate = (value: FieldSetup): void => {
    setParameters(value);
  };

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: FieldSetup | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }
      sdk.app.setReady();
    })();
  }, [sdk]);

  useEffect(() => {
    let updateContentTypes: Array<ContentTypeInfo> = [];
    sdk.cma.contentType
      .getMany({ query: { limit: 1000, order: "sys.id" } })
      ?.then((value: CollectionProp<ContentTypeProps>) => {
        updateContentTypes = value?.items?.map((ct: ContentTypeProps) => {
          return {
            name: ct.name,
            id: ct.sys.id,
            fields: ct?.fields,
          };
        });
        setContentTypes(updateContentTypes);
      });
  }, [sdk]);

  return (
    <Box
      style={{
        maxWidth: tokens.contentWidthText,
        margin: "0 auto",
        paddingTop: tokens.spacingM,
        paddingBottom: tokens.spacingM,
      }}
    >
      <Heading>Configuration</Heading>
      <FieldSettings
        sdk={sdk}
        value={parameters}
        updateValue={(newValue) => onUpdate(newValue as FieldSetup)}
        contentTypes={contentTypes}
      />
    </Box>
  );
};

export default ConfigScreen;
