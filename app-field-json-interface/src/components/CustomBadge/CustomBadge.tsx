import tokens from "@contentful/f36-tokens";
import { CSSProperties } from "react";

const badgeStyle: CSSProperties = {
  display: "inline-flex",
  columnGap: "0.25rem",
  alignItems: "center",
  borderRadius: "4px",
  overflow: "hidden",
  verticalAlign: "middle",
  color: "#0059C8",
  backgroundColor: "#CEECFF",
  padding: "0 0.5rem",
  lineHeight: "1.25rem",
  maxHeight: "1.25rem",
};

type CustomBadgeProps = {
  children: string | number | JSX.Element | JSX.Element[];
};

const CustomBadge = ({ children }: CustomBadgeProps) => {
  return (
    <div style={badgeStyle} data-test-id="cf-ui-badge">
      <span
        style={{
          fontWeight: tokens.fontWeightDemiBold,
          fontSize: tokens.fontSizeS,
        }}
        data-test-id="cf-ui-caption"
      >
        {children}
      </span>
    </div>
  );
};

export default CustomBadge;
