import { ConfigAppSDK } from "@contentful/app-sdk";
import { Control } from "contentful-management";

export interface InterfaceUpdateEditor {
  sdk: ConfigAppSDK;
  contentType: string;
  fieldId: string;
  widgetId: string;
  widgetNamespace?: string;
}

export const updateEditor = async ({
  sdk,
  contentType,
  fieldId,
  widgetId,
  widgetNamespace = "builtin",
}: InterfaceUpdateEditor) => {
  try {
    const editor = await sdk.cma.editorInterface.get({
      contentTypeId: contentType,
    });
    const controls = editor.controls?.map((value: Control) => {
      if (value.fieldId === fieldId) {
        return { ...value, widgetId, widgetNamespace };
      }
      return value;
    });
    await sdk.cma.editorInterface.update(
      { contentTypeId: contentType },
      { ...editor, controls: controls }
    );
  } catch (error) {}
};
