/*
    To add new applications/integrations to the Selector Dropdown, add a new key on this object.
    Remember to create its Configuration Screen also.
*/
export type AvailablePlatformsType = "slack-app";

export const AVAILABLE_PLATFORMS: Record<AvailablePlatformsType, string> = {
  "slack-app": "Slack",
};

export const DEFAULT_PLATFORM: string = "slack-app";
