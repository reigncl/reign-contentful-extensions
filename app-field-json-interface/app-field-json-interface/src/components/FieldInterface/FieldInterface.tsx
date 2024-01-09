import { FieldAppSDK } from "@contentful/app-sdk";
import {
  FieldSetup,
  FieldSetupItem,
  Interface,
  InterfaceItem,
} from "../FieldSettings/FieldSetup.types";
import { useEffect, useState } from "react";
import { AppInstallationParameters } from "../../locations/ConfigScreen";
import { CollectionProp, EntryProps, KeyValueMap } from "contentful-management";
import EditorsHandler from "./Editors";

export interface FieldSetupProps {
  sdk: FieldAppSDK;
}

const FieldInterface = ({ sdk }: FieldSetupProps) => {
  const [value, setValue] = useState<Record<string, unknown>>(
    (sdk.field.getValue() as Record<string, unknown>) ?? {}
  );
  const parameters = sdk.parameters.installation as AppInstallationParameters;
  const [interfaceField, setInterfaceField] = useState<Interface | undefined>(
    undefined
  );
  const [configurationField, setConfigurationField] = useState<
    FieldSetupItem | undefined
  >(undefined);

  const handleUpdate = async (value: Record<string, unknown>) => {
    await sdk.field.setValue(value);
    setValue(value);
    setInterfaceField({ ...(interfaceField as Interface) });
  };

  useEffect(() => {}, [value]);

  useEffect(() => {
    const { contentType, field } = sdk.ids;
    sdk.cma.entry
      .getMany({ query: { content_type: parameters?.contentType } })
      ?.then((response: CollectionProp<EntryProps<KeyValueMap>>) => {
        const item = response.items?.find(
          (item: EntryProps<KeyValueMap>, idx: number) => idx === 0
        );
        const content = item?.fields[parameters?.fieldId ?? ""];
        const currentLangEditor = sdk.locales.default;
        if (content) {
          const findConfig = (
            content[currentLangEditor] as FieldSetup
          )?.configurations?.find(
            (config: FieldSetupItem) =>
              config.contentType === contentType && config.fieldId === field
          );
          const findInterface = (
            content[currentLangEditor] as FieldSetup
          )?.interfaces?.find(
            (inter: Interface) => inter.id === findConfig?.interfaceId
          );
          setConfigurationField(findConfig);
          setInterfaceField(findInterface);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  return (
    <>
      {interfaceField?.items?.map((item: InterfaceItem, idx: number) => (
        <EditorsHandler
          interfaceItem={item}
          updateValue={handleUpdate}
          value={value}
        />
      ))}
    </>
  );
};

export default FieldInterface;
