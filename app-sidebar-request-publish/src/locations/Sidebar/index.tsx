import React from "react";
import {
  Box,
  SectionHeading,
  Paragraph,
  ButtonGroup,
  Button,
} from "@contentful/f36-components";
import { PreviewIcon } from "@contentful/f36-icons";
import { SidebarExtensionSDK } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";

const Sidebar = () => {
  const sdk = useSDK<SidebarExtensionSDK>();

  return (
    <Box paddingBottom="spacingM" marginBottom="spacingM">
      <SectionHeading marginBottom="spacingS">
        Request Publication
      </SectionHeading>
      <Paragraph>
        Send a notification to require this entry to be published
      </Paragraph>
      <Button endIcon={<PreviewIcon />} variant="positive" isFullWidth>
        Request Publication
      </Button>
    </Box>
  );
};

export default Sidebar;
