import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

import { IconEntry, IconSetProvider, IconValue } from '../icon-sets';
import IconGrid from './IconGrid';

export interface IconPickerProps {
  provider: IconSetProvider;
  value: IconValue | null;
  onChange: (value: IconValue) => void;
  onClear?: () => void;
  placeholder?: string;
  maxResults?: number;
}

const wrapperClass = css({
  width: '100%',
});

const rowClass = css({
  display: 'flex',
  alignItems: 'stretch',
  gap: tokens.spacingS,
  width: '100%',
});

const previewBoxClass = css({
  width: '40px',
  height: '40px',
  flex: '0 0 40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: tokens.borderRadiusMedium,
  border: `1px solid ${tokens.gray300}`,
  background: tokens.colorWhite,
  color: tokens.gray800,
  pointerEvents: 'none',
  userSelect: 'none',
});

const inputWrapperClass = css({
  flex: '1 1 auto',
  minWidth: 0,
});

const dropdownClass = css({
  marginTop: tokens.spacingXs,
  marginLeft: '48px',
  maxHeight: '360px',
  overflowY: 'auto',
  background: tokens.colorWhite,
  border: `1px solid ${tokens.gray300}`,
  borderRadius: tokens.borderRadiusMedium,
  boxShadow: tokens.boxShadowDefault,
});

const matches = (entry: IconEntry, normalizedQuery: string): boolean => {
  if (!normalizedQuery) return true;
  if (entry.label.toLowerCase().includes(normalizedQuery)) return true;
  for (const keyword of entry.keywords) {
    if (keyword.includes(normalizedQuery)) return true;
  }
  return false;
};

const IconPicker: React.FC<IconPickerProps> = ({
  provider,
  value,
  onChange,
  placeholder = 'Search icons',
  maxResults = 200,
}) => {
  const allEntries = useMemo(() => provider.list(), [provider]);
  const entriesByName = useMemo(() => {
    const map = new Map<string, IconEntry>();
    for (const entry of allEntries) map.set(entry.name, entry);
    return map;
  }, [allEntries]);

  const selectedEntry = value && value.set === provider.id ? entriesByName.get(value.name) : undefined;

  const [open, setOpen] = useState(false);
  const [rawQuery, setRawQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRawQuery(selectedEntry?.label ?? '');
  }, [selectedEntry?.label]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(rawQuery.trim().toLowerCase()), 100);
    return () => window.clearTimeout(handle);
  }, [rawQuery]);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const filteredEntries = useMemo(() => {
    const query = debouncedQuery;
    if (!query) return allEntries.slice(0, maxResults);
    const out: IconEntry[] = [];
    for (const entry of allEntries) {
      if (matches(entry, query)) {
        out.push(entry);
        if (out.length >= maxResults) break;
      }
    }
    return out;
  }, [allEntries, debouncedQuery, maxResults]);

  const handleSelect = (name: string) => {
    onChange({ set: provider.id, name });
    setOpen(false);
  };

  return (
    <div className={wrapperClass} ref={wrapperRef}>
      <div className={rowClass}>
        <div className={previewBoxClass} data-test-id="icon-preview" aria-hidden="true">
          {selectedEntry ? provider.render(selectedEntry.name, { size: 24 }) : null}
        </div>
        <div className={inputWrapperClass}>
          <TextInput
            value={rawQuery}
            placeholder={placeholder}
            testId="icon-picker-input"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setRawQuery(event.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
      </div>
      {open && (
        <div className={dropdownClass} data-test-id="icon-picker-dropdown">
          <IconGrid
            entries={filteredEntries}
            provider={provider}
            selectedName={selectedEntry?.name}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
};

export default IconPicker;
