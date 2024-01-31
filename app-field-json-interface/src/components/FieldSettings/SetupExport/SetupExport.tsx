import {
  Stack,
  Button,
  Textarea,
  Notification,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { CopyIcon } from "@contentful/f36-icons";
import { SetupExportProps } from "./SetupExport.types";

const SetupExport = ({value}: SetupExportProps) => {
  return (
    <>
      <Stack
        style={{
          color: tokens.gray500,
          fontWeight: tokens.fontWeightMedium,
          paddingBottom: tokens.spacingS,
          paddingTop: tokens.spacingS,
        }}
      >
        Export settings
      </Stack>
      <Stack
        style={{
          color: tokens.gray500,
          paddingBottom: tokens.spacingS,
        }}
      >
        In this textarea you will find the application definitions such as
        interfaces and configurations.
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="right"
        style={{
          paddingBottom: tokens.spacingS,
        }}
      >
        <Button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(value, null, 2));
            Notification.info("Copied settings.");
          }}
          size="small"
          startIcon={<CopyIcon />}
          variant="secondary"
        >
          Copy current config
        </Button>
      </Stack>
      <Textarea rows={15} isReadOnly>
        {JSON.stringify(value, null, 2)}
      </Textarea>
    </>
  );
};

export default SetupExport;
