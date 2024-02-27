import { IconButton, Stack, TextInput } from "@contentful/f36-components";
import { InterfaceItem } from "../../../FieldSettings/FieldSetup.types";
import { CloseIcon } from "@contentful/f36-icons";
import { useEffect, useRef, useState } from "react";

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
  const inputElement = useRef<HTMLInputElement>(null);
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

  const handleUpdateColor = (hexColor: string) => {
    if (definition?.output === "rgb") {
      handleUpdate(hexToRgb(hexColor));
    } else {
      handleUpdate(hexColor);
    }
  };

  useEffect(() => {
    if (!!!colorHEX) {
      if (typeof value === "string" && value !== "") {
        setColorHEX(value);
      } else if (typeof value === "object") {
        setColorHEX(rgbToHex(value?.r, value?.g, value?.b));
      } else {
        setColorHEX("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (definition?.options && definition?.options?.length > 0) {
      const newOptions = definition?.options?.filter(
        (opt: string) => opt !== ""
      );
      setOptions(newOptions);
    }
  }, [definition?.options]);

  if (typeof colorHEX === "undefined") {
    return <>...</>;
  }

  return (
    <>
      <Stack>
        <datalist id="color-picker-list">
          {options?.map((option: string) => {
            return <option value={option}></option>;
          })}
        </datalist>
        <TextInput.Group style={{ width: "250px" }}>
          {options?.length > 0 ? (
            <TextInput
              style={{ width: "100px" }}
              type="color"
              defaultValue={colorHEX}
              id={`input-with-datalist-${definition.key}`}
              list="color-picker-list"
              ref={inputElement}
              onBlur={(e) => {
                const newColor = e?.currentTarget?.value;
                setColorHEX(newColor);
                handleUpdateColor(newColor);
              }}
            />
          ) : (
            <TextInput
              style={{ width: "100px" }}
              type="color"
              defaultValue={colorHEX}
              id={`input-${definition.key}`}
              ref={inputElement}
              onBlur={(e) => {
                const newColor = e?.currentTarget?.value;
                setColorHEX(newColor);
                handleUpdateColor(newColor);
              }}
            />
          )}
          <TextInput
            style={{ width: "100px" }}
            type="text"
            value={colorHEX}
            onChange={(e) => {
              const newColor = e?.currentTarget?.value;
              setColorHEX(newColor);
              handleUpdateColor(newColor);
            }}
          />
          <IconButton
            variant="secondary"
            icon={<CloseIcon />}
            onClick={() => {
              setColorHEX("");
              handleUpdate("");
            }}
            aria-label="Reset"
          />
        </TextInput.Group>
      </Stack>
    </>
  );
};
export default ColorPicker;
