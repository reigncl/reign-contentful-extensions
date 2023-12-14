import { AssetCard, Flex, MenuItem } from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";

export default function AssetPanel() {
  return (
    <>
      <Flex alignItems="center" justifyContent="center" paddingTop="spacingL">
        <AssetCard
          status="published"
          type="plaintext"
          title="Everest"
          actions={[
            <MenuItem key="copy" onClick={() => alert("copy")}>
              Copy
            </MenuItem>,
            <MenuItem key="delete" onClick={() => alert("delete")}>
              Delete
            </MenuItem>,
          ]}
        />
      </Flex>
    </>
  );
}
