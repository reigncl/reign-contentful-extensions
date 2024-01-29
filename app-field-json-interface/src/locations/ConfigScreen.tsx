import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import FieldSettings from "../components/FieldSettings/FieldSettings";
import { FieldSetup } from "../components/FieldSettings/FieldSetup.types";
import { Box, Flex, Heading } from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";

const ConfigScreen = () => {
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

  return (
    <Box
      style={{
        maxWidth: tokens.contentWidthText,
        margin: "0 auto",
        paddingTop: tokens.spacingM,
      }}
    >
      <Heading>Configuration</Heading>
      <FieldSettings
        sdk={sdk}
        value={parameters}
        updateValue={(newValue) => onUpdate(newValue as FieldSetup)}
      />
    </Box>
  );
};

export default ConfigScreen;
