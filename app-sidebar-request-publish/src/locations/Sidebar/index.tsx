import React, { useEffect, useMemo, useState } from "react";
import { Box, Paragraph, Button, Spinner } from "@contentful/f36-components";
import {
  PreviewIcon,
  WarningIcon,
  CheckCircleIcon,
} from "@contentful/f36-icons";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { postSlackMessage } from "./utils";
import { AppInstallationParameters } from "../ConfigScreen";

const Sidebar = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);
  const [messageSended, setMessageSended] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);

  const sdk = useSDK<SidebarExtensionSDK>();
  const cma = useCMA();

  const installationParameters: AppInstallationParameters = useMemo(
    () => sdk.parameters?.installation,
    [sdk.parameters?.installation]
  );

  const sendRequest = async () => {
    setSendingRequest(true);
    try {
      if (enabled) {
        if (installationParameters?.selectedPlatform === "slack-app") {
          const space = await cma.space.get({
            spaceId: sdk.ids.space,
          });
          const environment = await cma.environment.get({
            spaceId: sdk.ids.space,
            environmentId: sdk.ids.environmentAlias ?? sdk.ids.environment,
          });

          const response = await postSlackMessage(
            installationParameters.slackOauthToken as string,
            installationParameters.slackMessagesChannelId as string,
            `*There is a new publication request at ${space.name} / ${
              environment.name
            }*\n>*Requested by:* ${sdk.user.firstName} ${
              sdk.user.lastName
            }\n>*Content Type:* ${
              sdk.contentType.name
            }\n>*Display name:* ${sdk.entry.fields[
              sdk.contentType.displayField
            ].getValue()}`
          );
          if (!response) {
            throw new Error("Call not okay!");
          } else {
            setMessageSended(true);
            setMessageError(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessageError(true);
      setMessageSended(false);
    }
    setSendingRequest(false);
  };

  useEffect(() => {
    if (installationParameters) {
      if (installationParameters?.selectedPlatform === "slack-app") {
        if (
          installationParameters?.slackMessagesChannelId &&
          installationParameters?.slackOauthToken
        ) {
          setEnabled(true);
        }
      }
    }
  }, [installationParameters]);

  return (
    <Box>
      <Paragraph>
        Send a notification to require this entry to be published
      </Paragraph>
      <Button
        endIcon={sendingRequest ? <Spinner size="small" /> : <PreviewIcon />}
        variant="positive"
        isFullWidth
        onClick={sendRequest}
        isDisabled={sendingRequest}
      >
        {sendingRequest ? "Sending Request" : "Request Publication"}
      </Button>
      {messageError ? (
        <Box display="flex" marginTop="spacingS">
          <WarningIcon variant="negative" />
          <Paragraph marginLeft="spacingM" marginRight="spacingM">
            Error sending the notification
          </Paragraph>
        </Box>
      ) : messageSended ? (
        <Box display="flex" marginTop="spacingS">
          <CheckCircleIcon variant="positive" />
          <Paragraph marginLeft="spacingM" marginRight="spacingM">
            Notification sent successfully!
          </Paragraph>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Sidebar;
