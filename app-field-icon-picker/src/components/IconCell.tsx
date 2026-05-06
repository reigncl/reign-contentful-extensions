import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

import { IconEntry, IconSetProvider } from '../icon-sets';

export interface IconCellProps {
  entry: IconEntry;
  provider: IconSetProvider;
  selected?: boolean;
  onSelect: (name: string) => void;
}

const cellClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: tokens.spacingXs,
  padding: tokens.spacingS,
  borderRadius: tokens.borderRadiusMedium,
  border: `1px solid transparent`,
  background: tokens.gray100,
  cursor: 'pointer',
  transition: 'background 0.12s ease, border-color 0.12s ease, transform 0.12s ease',
  outline: 'none',
  '&:hover': {
    background: tokens.gray200,
  },
  '&:focus-visible': {
    borderColor: tokens.blue500,
    boxShadow: `0 0 0 2px ${tokens.blue200}`,
  },
});

const cellSelectedClass = css({
  borderColor: tokens.blue500,
  background: tokens.blue100,
  '&:hover': {
    background: tokens.blue100,
  },
});

const iconBoxClass = css({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: tokens.gray800,
});

const labelClass = css({
  fontSize: tokens.fontSizeS,
  lineHeight: tokens.lineHeightS,
  color: tokens.gray700,
  textAlign: 'center',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const IconCell: React.FC<IconCellProps> = ({ entry, provider, selected, onSelect }) => {
  return (
    <button
      type="button"
      title={entry.label}
      data-test-id={`icon-cell-${entry.name}`}
      className={`${cellClass} ${selected ? cellSelectedClass : ''}`}
      onClick={() => onSelect(entry.name)}
    >
      <span className={iconBoxClass}>{provider.render(entry.name, { size: 24 })}</span>
      <span className={labelClass}>{entry.label}</span>
    </button>
  );
};

export default IconCell;
