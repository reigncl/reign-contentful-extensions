import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Form,
  FormControl,
  Paragraph,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@contentful/f36-components";
import { DialogAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  const [submitted, setSubmitted] = useState(false);
  const submitForm = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  return (
    <Flex padding="spacingL">
      <Form style={{ width: "100%" }} onSubmit={submitForm}>
        <FormControl>
          <h2>Add a new redirect</h2>
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>From</FormControl.Label>
          <TextInput />
          <FormControl.HelpText>
            Please enter the path of the source url{" "}
          </FormControl.HelpText>
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>To</FormControl.Label>
          <TextInput />
          <FormControl.HelpText>
            Please enter a path or url for the target
          </FormControl.HelpText>
        </FormControl>
        <FormControl>
          <FormControl.Label isRequired>Type</FormControl.Label>
          <Select
            id="optionSelect-uncontrolled"
            name="optionSelect-uncontrolled"
            defaultValue="type"
          >
            <Select.Option value="">Select one</Select.Option>
            <Select.Option value="307">307</Select.Option>
            <Select.Option value="308">308</Select.Option>
          </Select>
          <FormControl.HelpText>Please select a type</FormControl.HelpText>
        </FormControl>
        <Stack alignItems="right" justifyContent="right">
          <Button size="small" variant="primary" type="submit">
            Add & add another
          </Button>{" "}
          <Button size="small" variant="primary" type="submit">
            Add & close
          </Button>{" "}
          <Button
            size="small"
            variant="negative"
            type="button"
            onClick={() => {
              sdk.close();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
};

export default Dialog;
