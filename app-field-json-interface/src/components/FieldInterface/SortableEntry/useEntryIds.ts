import { useRef } from "react";
import { nanoid } from "nanoid";

/**
 * Maintains a stable list of opaque ids parallel to a dynamic array.
 *
 * Array entries in the field value are plain objects without a stable id, but
 * @dnd-kit needs each sortable item to have a stable identifier across renders
 * so the drag state survives edits, additions and deletions. We keep the ids
 * in a ref and synchronize length/order with the live array using the helpers
 * below.
 */
export interface EntryIdsHandle {
  /** Current ids, one per entry, same order as the live array. */
  ids: string[];
  /** Ensure ids array length matches the given target length (append/trim). */
  syncLength: (target: number) => void;
  /** Apply a reorder to the ids using the indices that moved. */
  move: (from: number, to: number) => void;
  /** Remove the id at index i. */
  remove: (i: number) => void;
  /** Append a new id (used right before pushing a new entry). */
  append: () => void;
}

export function useEntryIds(currentLength: number): EntryIdsHandle {
  const idsRef = useRef<string[]>([]);

  if (idsRef.current.length !== currentLength) {
    if (idsRef.current.length < currentLength) {
      while (idsRef.current.length < currentLength) {
        idsRef.current.push(nanoid());
      }
    } else {
      idsRef.current = idsRef.current.slice(0, currentLength);
    }
  }

  const syncLength = (target: number) => {
    if (idsRef.current.length < target) {
      while (idsRef.current.length < target) {
        idsRef.current.push(nanoid());
      }
    } else if (idsRef.current.length > target) {
      idsRef.current = idsRef.current.slice(0, target);
    }
  };

  const move = (from: number, to: number) => {
    const next = idsRef.current.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    idsRef.current = next;
  };

  const remove = (i: number) => {
    const next = idsRef.current.slice();
    next.splice(i, 1);
    idsRef.current = next;
  };

  const append = () => {
    idsRef.current = [...idsRef.current, nanoid()];
  };

  return {
    ids: idsRef.current,
    syncLength,
    move,
    remove,
    append,
  };
}
