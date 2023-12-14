import { FieldAppSDK } from "@contentful/app-sdk";
import { WidgetType } from "@contentful/default-field-editors";
import { Field } from "@contentful/default-field-editors";
import { Flex } from "@contentful/f36-components";

export default function AssetPanel({
  sdk,
  widgetId,
}: {
  sdk: FieldAppSDK;
  widgetId?: WidgetType;
}) {
  return (
    <>
      <Flex paddingTop="spacingL">
        <Field sdk={sdk} widgetId={widgetId} />
      </Flex>
    </>
  );
}
