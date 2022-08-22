import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Form,
  FormControl,
  Paragraph,
  SectionHeading,
  Select,
  Spinner,
  Subheading,
  TextInput,
  Card,
} from "@contentful/f36-components";
import { WarningIcon, CheckCircleIcon } from "@contentful/f36-icons";
import { ConversationChannelType, listChannels } from "./utils";
import { AppInstallationParameters } from "../../locations/ConfigScreen";

interface ISlackConfigDisplay {
  initialParams?: AppInstallationParameters;
}

interface ISlackConfig extends ISlackConfigDisplay {
  onParamsChange: (params: Record<string, string>) => void;
  initialParams?: AppInstallationParameters;
}

export const SlackConfig = ({
  onParamsChange,
  initialParams,
}: ISlackConfig): JSX.Element => {
  // FORM TRACKING STATES
  const [OAuthToken, setOAuthToken] = useState<string>(
    initialParams?.slackOauthToken ?? ""
  );
  const [selectedChannel, setSelectedChannel] = useState<string>(
    initialParams?.slackMessagesChannelId ?? ""
  );

  //FETCHING SLACK STATES
  const [loadingChannels, setLoadingChannels] = useState<boolean>();
  const [availableChannels, setAvailableChannels] = useState<
    ConversationChannelType[]
  >([]);

  useEffect(() => {
    const updateChannels = async () => {
      const channelsResult = await listChannels(OAuthToken);
      setAvailableChannels(channelsResult);
      setLoadingChannels(false);
    };

    if (OAuthToken) {
      try {
        setLoadingChannels(true);
        updateChannels();
      } catch (error) {
        setLoadingChannels(false);
        console.error(error);
      }
    } else {
      setSelectedChannel("");
    }
  }, [OAuthToken]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onParamsChange({
      slackOauthToken: OAuthToken,
      slackMessagesChannelId: selectedChannel,
    });
  };

  return (
    <Box marginTop="spacingXl">
      <SectionHeading>Slack App Configuration</SectionHeading>
      <Box>
        <Form onSubmit={onFormSubmit}>
          <FormControl>
            <FormControl.Label isRequired>
              Bot User OAuth Token
            </FormControl.Label>
            <TextInput
              id="oauth-token"
              name="oauth-token"
              isRequired
              placeholder="xoxb-your-token"
              value={OAuthToken}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setOAuthToken(event.target.value);
              }}
            />
            <FormControl.HelpText>
              Enter the OAuth Token required to communicate with the Slack app.
            </FormControl.HelpText>
          </FormControl>

          {loadingChannels ? (
            <Box display="flex">
              <WarningIcon variant="warning" />
              <Paragraph marginLeft="spacingM" marginRight="spacingM">
                Loading Available channels
              </Paragraph>
              <Spinner size="medium" />
            </Box>
          ) : !OAuthToken ? (
            <Box display="flex">
              <WarningIcon variant="negative" />
              <Paragraph marginLeft="spacingM" marginRight="spacingM">
                Enter an OAuth Token to select a channel
              </Paragraph>
            </Box>
          ) : availableChannels.length < 1 ? (
            <Box display="flex">
              <WarningIcon variant="negative" />
              <Paragraph marginLeft="spacingM" marginRight="spacingM">
                Enter a valid OAuth Token to select a channel
              </Paragraph>
            </Box>
          ) : (
            <Box display="flex">
              <CheckCircleIcon variant="positive" />
              <Paragraph marginLeft="spacingM" marginRight="spacingM">
                Valid OAuth Token
              </Paragraph>
            </Box>
          )}

          <FormControl>
            <FormControl.Label isRequired>Messages Channel</FormControl.Label>
            <Select
              id="messages-channel"
              name="messages-channel"
              value={selectedChannel}
              isRequired
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setSelectedChannel(event.target.value);
              }}
              isDisabled={
                availableChannels.length < 1 || !OAuthToken || loadingChannels
              }
            >
              <Select.Option value="" isDisabled>
                Please select a channel...
              </Select.Option>
              {OAuthToken &&
                !loadingChannels &&
                availableChannels.map((channel) => (
                  <Select.Option value={channel.id} key={channel.id}>
                    {channel.name}
                  </Select.Option>
                ))}
            </Select>
            <FormControl.HelpText>
              Select a Channel where to send messages to. It will load after the
              above OAuth token is set.
            </FormControl.HelpText>
          </FormControl>

          <Button
            variant="primary"
            type="submit"
            isDisabled={!(selectedChannel && OAuthToken)}
          >
            Save Values
          </Button>
        </Form>
      </Box>
    </Box>
  );
};

export const SlackDisplayConfig = ({
  initialParams,
}: ISlackConfigDisplay): JSX.Element => {
  return (
    <Card marginBottom="spacing2Xl">
      <Subheading>Selected OAuth Token:</Subheading>
      <Paragraph>
        {initialParams?.slackOauthToken ?? "No OAuth token provided"}
      </Paragraph>
      <Subheading>Channel ID:</Subheading>
      <Paragraph>
        {initialParams?.slackMessagesChannelId ?? "No channel set"}
      </Paragraph>
    </Card>
  );
};

export default SlackConfig;
