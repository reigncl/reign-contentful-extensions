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
import {
  Flex,
  Button,
  Grid,
  IconButton,
  Badge,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { FieldInterfaceValue } from "./FieldInterface.types";
import { DeleteIcon } from "@contentful/f36-icons";

export interface FieldSetupProps {
  sdk: FieldAppSDK;
}

const FieldInterface = ({ sdk }: FieldSetupProps) => {
  const [value, setValue] = useState<FieldInterfaceValue>(
    (sdk.field.getValue() as Record<string, unknown>) ?? {}
  );
  const parameters = sdk.parameters.installation as AppInstallationParameters;
  const [interfaceField, setInterfaceField] = useState<Interface | undefined>(
    undefined
  );

  const handleUpdate = async (value: FieldInterfaceValue) => {
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
          setInterfaceField(findInterface);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  if (interfaceField?.isArray) {
    const arrValue = Array.isArray(value) ? value : [];
    return (
      <>
        {arrValue?.map((val: Record<string, unknown>, index: number) => (
          <Grid
            key={`grid-${index}`}
            style={{
              width: "100%",
              borderBottom: "1px solid rgb(207, 217, 224)",
              paddingTop: tokens.spacingS,
            }}
            columns="0.8fr 6fr 0.3fr"
            rowGap="spacingM"
            columnGap="spacingM"
          >
            <Grid.Item>
              <Badge>{index + 1}</Badge>
            </Grid.Item>
            <Grid.Item>
              {interfaceField?.items?.map(
                (item: InterfaceItem, idx: number) => (
                  <EditorsHandler
                    key={`EditorsHandler-${idx}`}
                    interfaceItem={item}
                    updateValue={(update: Record<string, unknown>) => {
                      arrValue[index] = update;
                      handleUpdate(arrValue);
                    }}
                    value={val as Record<string, unknown>}
                  />
                )
              )}
            </Grid.Item>
            <Grid.Item>
              <IconButton
                variant="transparent"
                aria-label="Remove Item"
                icon={<DeleteIcon />}
                onClick={async () => {
                  const response = await sdk.dialogs.openConfirm({
                    title: "Remove Item",
                    message: "Are you sure you want to delete this item?",
                  });
                  if (response) {
                    arrValue.splice(index, 1);
                    handleUpdate(arrValue);
                  }
                }}
              />
            </Grid.Item>
          </Grid>
        ))}
        <Flex padding="spacingS" justifyContent="right">
          <Button
            onClick={async () => {
              arrValue.push({});
              handleUpdate(arrValue);
            }}
            variant="primary"
            size="small"
          >
            Add item
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <>
      {interfaceField?.items?.map((item: InterfaceItem, idx: number) => (
        <EditorsHandler
          interfaceItem={item}
          updateValue={handleUpdate}
          value={value as Record<string, unknown>}
        />
      ))}
    </>
  );
};

export default FieldInterface;