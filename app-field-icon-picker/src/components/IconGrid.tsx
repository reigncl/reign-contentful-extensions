import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

import { IconEntry, IconSetProvider } from '../icon-sets';
import IconCell from './IconCell';

export interface IconGridProps {
  entries: IconEntry[];
  provider: IconSetProvider;
  selectedName?: string;
  onSelect: (name: string) => void;
}

const gridClass = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: tokens.spacingS,
  padding: tokens.spacingS,
});

const emptyClass = css({
  padding: tokens.spacingL,
  textAlign: 'center',
  color: tokens.gray600,
  fontSize: tokens.fontSizeM,
});

const IconGrid: React.FC<IconGridProps> = ({ entries, provider, selectedName, onSelect }) => {
  if (entries.length === 0) {
    return <div className={emptyClass} data-test-id="icon-grid-empty">No results found</div>;
  }
  return (
    <div className={gridClass} data-test-id="icon-grid">
      {entries.map((entry) => (
        <IconCell
          key={entry.name}
          entry={entry}
          provider={provider}
          selected={entry.name === selectedName}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default IconGrid;
