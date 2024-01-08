import React, { useEffect } from "react";
import { Note } from "@contentful/f36-components";
import { FieldAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { AppInstallationParameters } from "./ConfigScreen";
import FieldInterface from "../components/FieldInterface/FieldInterface";
import FieldSettings from "../components/FieldSettings/FieldSettings";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const { contentType, fieldId } = sdk.parameters
    .installation as AppInstallationParameters;
  const appConfigURL = `https://app.contentful.com/spaces/${sdk.ids.space}/environments/${sdk.ids.environment}/apps/${sdk.ids.app}`;

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  if (!contentType || !fieldId) {
    return (
      <Note variant="warning">
        Please check the <a href={appConfigURL}>app configuration.</a>
      </Note>
    );
  }

  if (contentType === sdk.ids.contentType && fieldId === sdk.ids.field) {
    return <FieldSettings sdk={sdk} />;
  }

  return <FieldInterface sdk={sdk} />;
};

export default Field;
