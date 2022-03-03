import React, { useState } from "react";
import { PlainClientAPI } from "contentful-management";
import {
  Button,
  Flex,
  Form,
  FormControl,
  Select,
  TextInput,
} from "@contentful/f36-components";
import { DialogExtensionSDK } from "@contentful/app-sdk";
import { ConfigPreviewItem } from "./ConfigScreen";
import { css } from "@emotion/css";

export enum DialogTypes {
  ADD, UPDATE
}

interface DialogProps {
  sdk: DialogExtensionSDK;
  cma: PlainClientAPI;
}

interface DialogParameters {
  sites: Array<string>;
  item?: ConfigPreviewItem;
  type: DialogTypes;
}

const Dialog = (props: DialogProps) => {
  const [submitted, setSubmitted] = useState(false);
  const sites = (props.sdk.parameters.invocation as DialogParameters).sites;
  const [site, setSite] = useState<string | undefined>(
    (props.sdk.parameters.invocation as DialogParameters).item?.site
  );
  const [url, setUrl] = useState<string | undefined>(
    (props.sdk.parameters.invocation as DialogParameters).item?.url
  );
  const [stage, setStage] = useState<string | undefined>(
    (props.sdk.parameters.invocation as DialogParameters).item?.stage
  );

  const submitForm = () => {
    setSubmitted(true);
    console.log("dialogprops", props);
    props.sdk.close({
      site,
      url,
      stage,
    } as ConfigPreviewItem);
  };

  return (
    <Flex padding="spacingM" fullWidth>
      <Form className={css({ width: "100%" })} onSubmit={submitForm}>
        <FormControl isRequired>
          <FormControl.Label>Select site</FormControl.Label>
          <Select
            id="dialog-selectSite"
            name="dialog-selectSite"
            value={site}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSite(e.currentTarget.value);
            }}
          >
            <Select.Option value={""}></Select.Option>
            {sites?.map((st: string, index: number) => {
              return (
                <Select.Option key={index} value={st}>
                  {st}
                </Select.Option>
              );
            })}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Add URL</FormControl.Label>
          <TextInput
            value={url}
            type="url"
            name="dialog-url"
            placeholder="https://www.yourwebsite.com/{slug}"
            onChange={(e) => {
              setUrl(e.currentTarget.value);
            }}
          />
          <FormControl.HelpText>
            Preview URL for content type selected. E.g.
            https://www.yourwebsite.com/{"{fieldId}"}
          </FormControl.HelpText>
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Write the stage</FormControl.Label>
          <TextInput
            value={stage}
            type="text"
            name="dialog-stage"
            placeholder="staging"
            onChange={(e) => {
              setStage(e.currentTarget.value);
            }}
          />
          <FormControl.HelpText>
            The stage of the link. E.g. dev, staging, production
          </FormControl.HelpText>
        </FormControl>
        <Button variant="primary" type="submit" isDisabled={submitted}>
          Create preview
        </Button>
      </Form>
    </Flex>
  );
};

export default Dialog;
