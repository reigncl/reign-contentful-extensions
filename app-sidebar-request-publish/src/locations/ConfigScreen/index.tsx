import React, { useCallback, useState, useEffect, useMemo } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Heading,
  Paragraph,
  Flex,
  SkeletonContainer,
  SkeletonBodyText,
} from "@contentful/f36-components";
import { css } from "emotion";
import { useSDK } from "@contentful/react-apps-toolkit";
import PlatformSelector from "../../components/PlatformSelector";
import { PlatformConfigComponentSwitch } from "./utils";

export interface AppInstallationParameters {
  selectedPlatform?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [loading, setLoading] = useState<boolean>(true);
  const sdk = useSDK<AppExtensionSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      await sdk.app.setReady();
      setLoading(false);
    })();
  }, [sdk]);

  const onPlatformChange = useCallback(
    (platform: string) => {
      setParameters((oldParams) => ({
        ...oldParams,
        selectedPlatform: platform,
      }));
    },
    [setParameters]
  );

  const selectedPlatform = useMemo(
    () => parameters?.selectedPlatform,
    [parameters?.selectedPlatform]
  );

  const ConfigComponent = useMemo(
    () => PlatformConfigComponentSwitch(selectedPlatform),
    [selectedPlatform]
  );

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "40px 80px", maxWidth: "800px" })}
    >
      <Heading>Configuration Details</Heading>
      <Paragraph>
        To start posting publishing notifications we must first configure some
        application values
      </Paragraph>
      {loading ? (
        <SkeletonContainer>
          <SkeletonBodyText numberOfLines={4} />
        </SkeletonContainer>
      ) : (
        <React.Fragment>
          <PlatformSelector
            onPlatformChange={onPlatformChange}
            initialPlatform={selectedPlatform}
          />
          <ConfigComponent />
        </React.Fragment>
      )}
    </Flex>
  );
};

export default ConfigScreen;
