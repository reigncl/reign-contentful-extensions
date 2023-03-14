/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Pill, Flex } from "@contentful/f36-components";
import { DragIcon } from "@contentful/f36-icons";
import { arrayMoveImmutable } from "array-move";
import React, { useCallback } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

const Pills = ({
  items,
  onChange,
}: {
  items: string[];
  onChange?: Function;
}) => {
  const updateItems = (items: string[]) => {
    if (onChange) {
      onChange(items);
    }
  };

  const removeItem = useCallback(
    (index: number) => {
      const newItems = items.filter((_, filterIndex) => index !== filterIndex);
      updateItems(newItems);
    },
    [items]
  );

  const swapItems = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      const newItems = arrayMoveImmutable(items, oldIndex, newIndex);
      updateItems(newItems);
    },
    [items]
  );

  const SortablePillHandle = SortableHandle(() => (
    <Box marginTop="spacingXs">
      <DragIcon variant="muted" />
    </Box>
  ));

  const SortablePill = SortableElement<{ label: string; onRemove: Function }>(
    ({ label, onRemove }: { label: string; onRemove: Function }) => (
      <Box marginRight="spacingS">
        <Pill
          label={label}
          onClose={() => {
            onRemove();
          }}
          onDrag={() => {}}
          dragHandleComponent={<SortablePillHandle />}
        />
      </Box>
    )
  );

  const SortableList = SortableContainer<any>((props: any) => (
    <Flex flexWrap="wrap" gap="spacingS">{props.children}</Flex>
  ));

  return (
    <SortableList
      useDragHandle
      axis="xy"
      distance={10}
      onSortEnd={({
        oldIndex,
        newIndex,
      }: {
        oldIndex: number;
        newIndex: number;
      }) => {
        swapItems({ oldIndex, newIndex });
      }}
    >
      {items?.map((item, index) => (
        <SortablePill
          key={item}
          index={index}
          label={item as string}
          onRemove={() => removeItem(index)}
        />
      ))}
    </SortableList>
  );
};

export default Pills;
