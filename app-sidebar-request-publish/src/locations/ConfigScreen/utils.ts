import React from "react";
import SlackConfig, { SlackDisplayConfig } from "../../components/SlackConfig";
import { AvailablePlatformsType } from "../../constants/platforms";

export const PlatformConfigComponentSwitch = (
  selectedPlatform?: AvailablePlatformsType | string
) => {
  switch (selectedPlatform) {
    case "slack-app":
      return SlackConfig;

    default:
      return React.Fragment;
  }
};

export const PlatformConfigDisplayComponentSwitch = (
  selectedPlatform?: AvailablePlatformsType | string
) => {
  switch (selectedPlatform) {
    case "slack-app":
      return SlackDisplayConfig;

    default:
      return React.Fragment;
  }
};
