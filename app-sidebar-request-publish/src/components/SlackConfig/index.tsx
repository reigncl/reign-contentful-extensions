import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Form,
  FormControl,
  SectionHeading,
  Select,
  TextInput,
} from "@contentful/f36-components";
import { listChannels } from "./utils";

export const SlackConfig = () => {
  const [enableSubmit, setEnableSubmit] = useState<boolean>(true);
  const [OAuthToken, setOAuthToken] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
            >
              <Select.Option value="" isDisabled>
                Please select a channel...
              </Select.Option>
              <Select.Option value={"test"}>test</Select.Option>
            </Select>
            <FormControl.HelpText>
              Select a Channel where to send messages to. It will load after the
              above OAuth token is set.
            </FormControl.HelpText>
          </FormControl>
          <Button variant="primary" type="submit" isDisabled={!enableSubmit}>
            Save Values
          </Button>
        </Form>
      </Box>
    </Box>
  );
};

export default SlackConfig;
