import React, { useEffect } from "react";
import { FieldAppSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import FieldInterface from "../components/FieldInterface/FieldInterface";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  return <FieldInterface sdk={sdk} />;
};

export default Field;
