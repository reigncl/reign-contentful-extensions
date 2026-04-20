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
  Accordion,
  HelpText,
  FormControl,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { FieldInterfaceValue } from "./FieldInterface.types";
import { ValidateEntryValueOutput, validateEntryValue } from "../../util";
import { FieldValueContext } from "../../context/FieldValueContex";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableEntry from "./SortableEntry/SortableEntry";
import { useEntryIds } from "./SortableEntry/useEntryIds";
import { groupItemsByRow } from "./groupItemsByRow";

export interface FieldSetupProps {
  sdk: FieldAppSDK;
}

const FieldInterface = ({ sdk }: FieldSetupProps) => {
  const { fieldValue, fieldValueUpdate } = useContext(FieldValueContext);
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

  const arrValue: Array<Record<string, unknown>> = Array.isArray(fieldValue)
    ? (fieldValue as Array<Record<string, unknown>>)
    : [];
  const entryIds = useEntryIds(arrValue.length);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = entryIds.ids.indexOf(String(active.id));
    const newIndex = entryIds.ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }
    entryIds.move(oldIndex, newIndex);
    const reordered = arrayMove(arrValue, oldIndex, newIndex);
    handleUpdate(reordered);
  };

  const RenderArray = () => {
    return (
      <>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={entryIds.ids}
            strategy={verticalListSortingStrategy}
          >
            {arrValue.map(
              (val: Record<string, unknown>, index: number) => (
                <SortableEntry
                  key={entryIds.ids[index]}
                  id={entryIds.ids[index]}
                  index={index}
                  total={arrValue.length}
                  value={val}
                  items={interfaceField?.items ?? []}
                  defaultCollapsed={
                    arrValue.length > 2 && index > 0
                  }
                  onChange={(updated) => {
                    const next = arrValue.slice();
                    next[index] = updated;
                    handleUpdate(next);
                  }}
                  onDelete={async () => {
                    const response = await sdk.dialogs.openConfirm({
                      title: "Remove Item",
                      message: "Are you sure you want to delete this item?",
                    });
                    if (response) {
                      const next = arrValue.slice();
                      next.splice(index, 1);
                      entryIds.remove(index);
                      handleUpdate(next);
                    }
                  }}
                  checkIsInvalid={(key) => checkIsInvalid(key, true, index)}
                />
              )
            )}
          </SortableContext>
        </DndContext>
        <Flex padding="spacingS" justifyContent="right">
          <Button
            onClick={async () => {
              entryIds.append();
              handleUpdate([...arrValue, {}]);
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
    const rows = groupItemsByRow(interfaceField?.items ?? []);
    return (
      <>
        {rows.map((row) => {
          if (row.items.length === 1) {
            const item = row.items[0];
            return (
              <div
                key={row.rowKey}
                style={{ marginBottom: tokens.spacingS }}
              >
                <EditorsHandler
                  interfaceItem={item}
                  updateValue={handleUpdate}
                  value={fieldValue as Record<string, unknown>}
                  isInvalid={checkIsInvalid(item.key)}
                />
              </div>
            );
          }
          return (
            <div
              key={row.rowKey}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${row.items.length}, minmax(0, 1fr))`,
                columnGap: tokens.spacingM,
                rowGap: tokens.spacingS,
                marginBottom: tokens.spacingS,
              }}
            >
              {row.items.map((item: InterfaceItem) => (
                <EditorsHandler
                  key={item.key}
                  interfaceItem={item}
                  updateValue={handleUpdate}
                  value={fieldValue as Record<string, unknown>}
                  isInvalid={checkIsInvalid(item.key)}
                />
              ))}
            </div>
          );
        })}
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
