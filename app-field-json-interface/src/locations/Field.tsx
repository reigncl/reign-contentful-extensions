import React, { useEffect } from "react";
import { FieldAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import FieldInterface from "../components/FieldInterface/FieldInterface";
import { FieldValueProvider } from "../context/FieldValueProvider";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  return (
    <FieldValueProvider sdk={sdk}>
      <FieldInterface sdk={sdk} />
    </FieldValueProvider>
  );
};

export default Field;
