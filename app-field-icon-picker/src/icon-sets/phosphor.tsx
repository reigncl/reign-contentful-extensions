import React from 'react';
import { css } from 'emotion';
import { icons as phosphorIcons } from '@phosphor-icons/core';

import { IconEntry, IconRenderOptions, IconSetProvider } from './types';

/** All regular-weight SVGs as strings — avoids @phosphor-icons/react (entire icon tree) so the app bundle fits Contentful upload limits. */
const svgModules = import.meta.glob<string>('../../node_modules/@phosphor-icons/core/assets/regular/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const kebabFromModulePath = (path: string): string => {
  const file = path.split('/').pop() ?? '';
  return file.replace(/\.svg$/i, '');
};

const svgByKebabName: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [path, svg] of Object.entries(svgModules)) {
    map.set(kebabFromModulePath(path), svg);
  }
  return map;
})();

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

const pascalToKebab: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const rawMeta of phosphorIcons) {
    const meta = rawMeta as unknown as PhosphorMeta;
    if (svgByKebabName.has(meta.name)) {
      map.set(meta.pascal_name, meta.name);
    }
  }
  return map;
})();

const buildEntries = (): IconEntry[] => {
  const entries: IconEntry[] = [];
  for (const rawMeta of phosphorIcons) {
    const meta = rawMeta as unknown as PhosphorMeta;
    if (!svgByKebabName.has(meta.name)) continue;

    const aliasLabel = meta.alias?.name ? toLabel(meta.alias.name) : undefined;
    entries.push({
      name: meta.pascal_name,
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

const inlineSvgWrapClass = (size: number) =>
  css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: 0,
    '& svg': {
      width: '100%',
      height: '100%',
    },
  });

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
    const kebab = pascalToKebab.get(name);
    if (!kebab) return null;
    const svg = svgByKebabName.get(kebab);
    if (!svg) return null;
    const size = opts?.size ?? 24;
    return <span className={inlineSvgWrapClass(size)} dangerouslySetInnerHTML={{ __html: svg }} aria-hidden />;
  },
};
