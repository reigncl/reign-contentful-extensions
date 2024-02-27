import { FieldAppSDK } from "@contentful/app-sdk";
import {
  FieldSetup,
  FieldSetupItem,
  Interface,
  InterfaceItem,
} from "../FieldSettings/FieldSetup.types";
import { useContext, useEffect, useState } from "react";
import EditorsHandler from "./Editors";
import {
  Flex,
  Button,
  Grid,
  IconButton,
  Accordion,
  HelpText,
  FormControl,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { FieldInterfaceValue } from "./FieldInterface.types";
import { DeleteIcon } from "@contentful/f36-icons";
import { ValidateEntryValueOutput, validateEntryValue } from "../../util";
import CustomBadge from "../CustomBadge/CustomBadge";
import { FieldValueContext } from "../../context/FieldValueContex";

export interface FieldSetupProps {
  sdk: FieldAppSDK;
}

const FieldInterface = ({ sdk }: FieldSetupProps) => {
  const { fieldValue, fieldValueUpdate } = useContext(FieldValueContext);
  /*const [value, setValue] = useState<FieldInterfaceValue>(
    (sdk.field.getValue() as Record<string, unknown>) ?? {}
  );*/
  const [interfaceField, setInterfaceField] = useState<Interface | undefined>(
    undefined
  );
  const [configField, setConfigField] = useState<FieldSetupItem | undefined>(
    undefined
  );
  const [validations, setValidations] = useState<
    Array<ValidateEntryValueOutput> | ValidateEntryValueOutput | undefined
  >(undefined);

  const [isValidQtyItems, setIsValidQtyItems] = useState<boolean | undefined>(
    undefined
  );

  const handleUpdate = async (valueUpdate: FieldInterfaceValue) => {
    // await sdk.field.setValue(valueUpdate);
    validate(valueUpdate);
    fieldValueUpdate(valueUpdate);
    setInterfaceField({ ...(interfaceField as Interface) });
  };

  const validate = (val?: FieldInterfaceValue) => {
    if (interfaceField) {
      let isInvalid = false;
      const validateResponse = validateEntryValue(val ?? fieldValue, interfaceField);
      setValidations(validateResponse);
      if (Array.isArray(validateResponse)) {
        validateResponse.forEach((item: ValidateEntryValueOutput) => {
          Object.keys(item).forEach((key: string) => {
            if (item[key] === true) {
              isInvalid = true;
            }
          });
        });
      } else {
        Object.keys(validateResponse).forEach((key: string) => {
          if (validateResponse[key] === true) {
            isInvalid = true;
          }
        });
      }
      if (typeof configField?.min === "number") {
        const arrValue = Array.isArray(fieldValue) ? fieldValue : [];
        if (arrValue.length < configField.min) {
          isInvalid = true;
          setIsValidQtyItems(false);
        } else {
          setIsValidQtyItems(true);
        }
      }
      sdk.field.setInvalid(isInvalid);
    }
  };

  const checkIsInvalid = (
    key: string,
    isMultiple: boolean = false,
    idx?: number
  ): boolean => {
    if (key && validations) {
      if (isMultiple === true && typeof idx === "number") {
        const item = (validations as Array<ValidateEntryValueOutput>)[idx];
        return item &&
          typeof item[key] !== "undefined" &&
          typeof item[key] === "boolean"
          ? item[key]
          : false;
      }
      if (isMultiple === false) {
        const item = validations as ValidateEntryValueOutput;
        return item &&
          typeof item[key] !== "undefined" &&
          typeof item[key] === "boolean"
          ? item[key]
          : false;
      }
    }
    return false;
  };

  const checkIfSetMinMax = (): boolean => {
    return (
      typeof configField?.min === "number" ||
      typeof configField?.max === "number"
    );
  };

  const disableAddItem = (): boolean => {
    if (
      typeof configField?.min === "number" &&
      typeof configField?.max === "number"
    ) {
      const arrValue = Array.isArray(fieldValue) ? fieldValue : [];
      return arrValue?.length >= configField.max;
    }
    return false;
  };

  const RenderArray = () => {
    const arrValue = Array.isArray(fieldValue) ? fieldValue : [];
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
              <CustomBadge>{index + 1}</CustomBadge>
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
                    isInvalid={checkIsInvalid(item.key, true, index)}
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
            isDisabled={disableAddItem()}
          >
            Add item
          </Button>
        </Flex>
        <Flex justifyContent="right">
          <HelpText
            style={{
              fontSize: tokens.fontSizeS,
              paddingRight: tokens.spacingS,
            }}
          >
            Total items {`{ ${arrValue?.length} `}
            {typeof configField?.max === "number"
              ? " / " + configField?.max
              : ""}
            {` }`}
          </HelpText>
        </Flex>
        {checkIfSetMinMax() && (
          <>
            <Flex justifyContent="right">
              <HelpText
                style={{
                  fontSize: tokens.fontSizeS,
                  paddingRight: tokens.spacingS,
                }}
              >
                Min items: <strong>{configField?.min}</strong>{" "}
                {typeof configField?.max === "number" ? (
                  <>
                    {" "}
                    / Max items <strong>{configField?.max}</strong>{" "}
                  </>
                ) : (
                  <></>
                )}
              </HelpText>
            </Flex>
          </>
        )}
        {isValidQtyItems === false && typeof configField?.min === "number" && (
          <>
            <Flex justifyContent="right">
              <FormControl.ValidationMessage>
                You need to add at least <strong>{configField?.min}</strong>{" "}
                item
                {configField.min > 1 ? "s" : ""}
              </FormControl.ValidationMessage>
            </Flex>
          </>
        )}
      </>
    );
  };

  const RenderDefault = () => {
    return (
      <>
        {interfaceField?.items?.map((item: InterfaceItem, idx: number) => (
          <EditorsHandler
            key={`EditorsHandler-${idx}`}
            interfaceItem={item}
            updateValue={handleUpdate}
            value={fieldValue as Record<string, unknown>}
            isInvalid={checkIsInvalid(item.key)}
          />
        ))}
      </>
    );
  };

  const Render = () => {
    if (interfaceField?.isArray) {
      return <RenderArray />;
    } else {
      return <RenderDefault />;
    }
  };

  useEffect(() => {
    if (fieldValue) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interfaceField, fieldValue]);

  useEffect(() => {
    const { contentType, field } = sdk.ids;
    const { interfaces, configurations } = sdk.parameters
      .installation as FieldSetup;
    const findConfig = configurations?.find(
      (config: FieldSetupItem) =>
        config.contentType === contentType && config.fieldId === field
    );
    const findInterface = interfaces?.find(
      (inter: Interface) => inter.id === findConfig?.interfaceId
    );
    if (findInterface) {
      setInterfaceField(findInterface);
      setConfigField(findConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  useEffect(() => {
    const { contentType, field } = sdk.ids;
    const { interfaces, configurations } = sdk.parameters
      .installation as FieldSetup;
    const findConfig = configurations?.find(
      (config: FieldSetupItem) =>
        config.contentType === contentType && config.fieldId === field
    );
    const findInterface = interfaces?.find(
      (inter: Interface) => inter.id === findConfig?.interfaceId
    );
    if (findInterface) {
      setInterfaceField(findInterface);
    }
    fieldValueUpdate(sdk.field.getValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

  if (interfaceField?.isCollapsed) {
    return (
      <Accordion>
        <Accordion.Item title={interfaceField.name}>
          <Render />
        </Accordion.Item>
      </Accordion>
    );
  }

  return <Render />;
};

export default FieldInterface;
