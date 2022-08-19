import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Paragraph,
  SectionHeading,
  Select,
} from "@contentful/f36-components";

import {
  AVAILABLE_PLATFORMS,
  DEFAULT_PLATFORM,
} from "../../constants/platforms";

interface IPlatformSelector {
  initialPlatform?: string;
  onPlatformChange?: (platform: string) => void;
}

export const PlatformSelector = ({
  initialPlatform = DEFAULT_PLATFORM,
  onPlatformChange,
}: IPlatformSelector): JSX.Element => {
  const [platform, setPlatform] = useState<string>(initialPlatform);

  useEffect(() => {
    if (onPlatformChange) {
      onPlatformChange(platform);
    }
  }, [platform, onPlatformChange]);

  const handlePlatformChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setPlatform(event.target.value);

  return (
    <Box paddingTop="spacingL">
      <SectionHeading>Platform</SectionHeading>
      <Paragraph>
        Before configuring the necessary values, select the desired platform for
        integration.
      </Paragraph>
      <Select
        id="selected-platform"
        name="selected-platform"
        value={platform}
        onChange={handlePlatformChange}
      >
        {Object.entries(AVAILABLE_PLATFORMS).map(([key, value]) => (
          <Select.Option value={key} key={key}>
            {value}
          </Select.Option>
        ))}
      </Select>
    </Box>
  );
};

export default PlatformSelector;
