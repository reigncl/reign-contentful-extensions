import { Stack } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";
import { useEffect, useState } from "react";

type ColorPickerValue = { r: number; g: number; b: number };

const ColorPicker = ({
  definition,
  value,
  handleUpdate,
}: {
  definition: InterfaceItem;
  value: string | ColorPickerValue;
  handleUpdate: Function;
}) => {
  const [colorHEX, setColorHEX] = useState<string>();
  const [options, setOptions] = useState<Array<string>>([]);
  const hexToRgb = (hex: string): ColorPickerValue | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  };

  useEffect(() => {
    if (typeof value === "string") {
      setColorHEX(value);
    } else if (typeof value === "object") {
      setColorHEX(rgbToHex(value?.r, value?.g, value?.b));
    }
  }, [value]);

  const handleUpdateColor = (hexColor: string) => {
    if (definition?.output === "rgb") {
      handleUpdate(hexToRgb(hexColor));
    } else {
      handleUpdate(hexColor);
    }
  };

  useEffect(() => {
    if (definition?.options && definition?.options?.length > 0) {
      const newOptions = definition?.options?.filter(
        (opt: string) => opt !== ""
      );
      setOptions(newOptions);
    }
  }, [definition?.options]);

  return (
    <>
      <Stack>
        <datalist id="color-picker-list">
          {options?.map((option: string) => {
            return <option value={option}></option>;
          })}
        </datalist>
        {options?.length > 0 ? (
          <input
            type="color"
            value={colorHEX}
            id={definition.key}
            list="color-picker-list"
            onChange={(e) => {
              const changeValue = e?.currentTarget?.value;
              if (colorHEX !== changeValue) {
                handleUpdateColor(e?.currentTarget?.value);
              }
            }}
          />
        ) : (
          <input
            type="color"
            value={colorHEX}
            id={definition.key}
            onChange={(e) => {
              const changeValue = e?.currentTarget?.value;
              if (colorHEX !== changeValue) {
                handleUpdateColor(e?.currentTarget?.value);
              }
            }}
          />
        )}
      </Stack>
    </>
  );
};
export default ColorPicker;
