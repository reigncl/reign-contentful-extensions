import React, { ComponentType } from 'react';
import { icons as phosphorIcons } from '@phosphor-icons/core';
import * as PhosphorReact from '@phosphor-icons/react';

import { IconEntry, IconRenderOptions, IconSetProvider } from './types';

type PhosphorIconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}>;

type PhosphorReactExports = Record<string, PhosphorIconComponent | unknown>;

const componentByName = PhosphorReact as unknown as PhosphorReactExports;

const toLabel = (kebabName: string): string =>
  kebabName
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');

interface PhosphorMeta {
  name: string;
  pascal_name: string;
  alias?: { name: string; pascal_name: string };
  tags?: ReadonlyArray<string>;
  categories?: ReadonlyArray<string>;
}

const buildEntries = (): IconEntry[] => {
  const entries: IconEntry[] = [];
  for (const rawMeta of phosphorIcons) {
    const meta = rawMeta as unknown as PhosphorMeta;
    const pascalName = meta.pascal_name;
    if (!componentByName[pascalName]) {
      continue;
    }
    const aliasLabel = meta.alias?.name ? toLabel(meta.alias.name) : undefined;
    entries.push({
      name: pascalName,
      label: toLabel(meta.name),
      keywords: [
        meta.name,
        meta.pascal_name,
        ...((meta.tags as string[] | undefined) ?? []),
        ...((meta.categories as string[] | undefined) ?? []),
        ...(meta.alias?.name ? [meta.alias.name, meta.alias.pascal_name] : []),
        ...(aliasLabel ? [aliasLabel] : []),
      ].map((value) => value.toLowerCase()),
    });
  }
  entries.sort((a, b) => a.label.localeCompare(b.label));
  return entries;
};

let cachedEntries: IconEntry[] | null = null;

export const phosphorProvider: IconSetProvider = {
  id: 'phosphor',
  label: 'Phosphor Icons',
  list(): IconEntry[] {
    if (!cachedEntries) {
      cachedEntries = buildEntries();
    }
    return cachedEntries;
  },
  render(name: string, opts?: IconRenderOptions): React.ReactNode {
    const Component = componentByName[name] as PhosphorIconComponent | undefined;
    if (!Component) return null;
    return <Component size={opts?.size ?? 24} weight="regular" />;
  },
};
