import { CSSProperties, useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Flex, IconButton } from "@contentful/f36-components";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  DragIcon,
} from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import EditorsHandler from "../Editors";
import { groupItemsByRow } from "../groupItemsByRow";
import { InterfaceItem } from "../../FieldSettings/FieldSetup.types";

export interface SortableEntryProps {
  id: string;
  index: number;
  total: number;
  value: Record<string, unknown>;
  items: Array<InterfaceItem>;
  onChange: (updated: Record<string, unknown>) => void;
  onDelete: () => void;
  checkIsInvalid: (key: string) => boolean;
  defaultCollapsed?: boolean;
}

const buildLabel = (
  value: Record<string, unknown>,
  items: Array<InterfaceItem>,
  fallback: string
): string => {
  for (const item of items) {
    if (
      (item.type === "InputText" && item.inputTextType !== "colorpicker") ||
      item.type === "Textarea"
    ) {
      const raw = value?.[item.key];
      if (typeof raw === "string" && raw.trim().length > 0) {
        return raw.length > 60 ? raw.slice(0, 60) + "\u2026" : raw;
      }
    }
  }
  for (const item of items) {
    const raw = value?.[item.key];
    if (typeof raw === "string" && raw.trim().length > 0) {
      return raw.length > 60 ? raw.slice(0, 60) + "\u2026" : raw;
    }
    if (typeof raw === "number" || typeof raw === "boolean") {
      return String(raw);
    }
  }
  return fallback;
};

const SortableEntry = ({
  id,
  index,
  total,
  value,
  items,
  onChange,
  onDelete,
  checkIsInvalid,
  defaultCollapsed,
}: SortableEntryProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [collapsed, setCollapsed] = useState<boolean>(
    defaultCollapsed ?? false
  );

  const label = useMemo(
    () => buildLabel(value, items, "Item"),
    [value, items]
  );

  const hasInvalidChild = useMemo(
    () => items.some((item) => checkIsInvalid(item.key)),
    [items, checkIsInvalid]
  );

  const cardStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    boxShadow: isDragging
      ? "0 6px 16px rgba(0, 0, 0, 0.18)"
      : "0 1px 2px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${
      hasInvalidChild ? tokens.red400 : tokens.gray300
    }`,
    borderRadius: tokens.borderRadiusMedium,
    background: tokens.colorWhite,
    marginBottom: tokens.spacingS,
    overflow: "hidden",
  };

  return (
    <div ref={setNodeRef} style={cardStyle} data-test-id="sortable-entry">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="spacingS"
        style={{
          background: tokens.gray100,
          borderBottom: collapsed
            ? "none"
            : `1px solid ${tokens.gray200}`,
          gap: tokens.spacingS,
        }}
      >
        <Flex
          alignItems="center"
          style={{ gap: tokens.spacingS, minWidth: 0, flex: 1 }}
        >
          <IconButton
            variant="transparent"
            aria-label={`Reorder item ${index + 1} of ${total}`}
            icon={<DragIcon />}
            size="small"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            {...attributes}
            {...listeners}
          />
          <Box
            style={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: tokens.fontSizeM,
              fontWeight: tokens.fontWeightDemiBold,
              color: tokens.gray800,
            }}
            title={`${label} [${index + 1}]`}
          >
            {label}{" "}
            <span
              style={{
                color: tokens.gray600,
                fontWeight: tokens.fontWeightNormal,
              }}
            >
              [{index + 1}]
            </span>
          </Box>
        </Flex>
        <Flex alignItems="center" style={{ gap: tokens.spacing2Xs }}>
          <IconButton
            variant="transparent"
            aria-label="Remove Item"
            icon={<DeleteIcon />}
            size="small"
            onClick={onDelete}
          />
          <IconButton
            variant="transparent"
            aria-label={collapsed ? "Expand item" : "Collapse item"}
            icon={collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
            size="small"
            onClick={() => setCollapsed((c) => !c)}
          />
        </Flex>
      </Flex>
      {!collapsed && (
        <Box padding="spacingM">
          {groupItemsByRow(items).map((row) => {
            if (row.items.length === 1) {
              const item = row.items[0];
              return (
                <div
                  key={row.rowKey}
                  style={{ marginBottom: tokens.spacingS }}
                >
                  <EditorsHandler
                    interfaceItem={item}
                    updateValue={(update: Record<string, unknown>) => {
                      onChange(update);
                    }}
                    value={value}
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
                {row.items.map((item) => (
                  <EditorsHandler
                    key={item.key}
                    interfaceItem={item}
                    updateValue={(update: Record<string, unknown>) => {
                      onChange(update);
                    }}
                    value={value}
                    isInvalid={checkIsInvalid(item.key)}
                  />
                ))}
              </div>
            );
          })}
        </Box>
      )}
    </div>
  );
};

export default SortableEntry;
