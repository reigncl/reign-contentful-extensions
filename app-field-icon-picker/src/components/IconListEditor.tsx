import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Note,
  TextInput,
} from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { DeleteIcon } from '@contentful/f36-icons';

import type { ExtraFieldDef } from '../types/installConfig';
import type { IconSetProvider } from '../icon-sets';
import {
  emptyListRow,
  ListRow,
  validateListRows,
} from '../util/fieldConfig';
import IconPicker from './IconPicker';

export interface IconListEditorProps {
  provider: IconSetProvider;
  extraFields: ExtraFieldDef[];
  value: ListRow[];
  onChange: (rows: ListRow[]) => void;
  disabled?: boolean;
}

const rowShellClass = css({
  border: `1px solid ${tokens.gray300}`,
  borderRadius: tokens.borderRadiusMedium,
  padding: tokens.spacingM,
  marginBottom: tokens.spacingM,
});

const IconListEditor: React.FC<IconListEditorProps> = ({
  provider,
  extraFields,
  value,
  onChange,
  disabled,
}) => {
  const validation = useMemo(() => validateListRows(value, extraFields), [value, extraFields]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const updateRow = (index: number, patch: Partial<ListRow>) => {
    const next: ListRow[] = value.map((row, i): ListRow =>
      i === index ? ({ ...row, ...patch } as ListRow) : row
    );
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...value, emptyListRow(extraFields)]);
  };

  return (
    <Box>
      {!validation.valid && value.length > 0 && (
        <Note variant="negative" title="Check required fields" className={css({ marginBottom: tokens.spacingM })}>
          {validation.errors.join(' ')}
        </Note>
      )}

      {value.map((row, index) => (
        <div key={index} className={rowShellClass} data-test-id="icon-list-row">
          <Flex justifyContent="space-between" alignItems="center" marginBottom="spacingS">
            <span className={css({ fontWeight: 600, fontSize: tokens.fontSizeM })}>Step {index + 1}</span>
            <Flex gap="spacingXs">
              <Button
                variant="transparent"
                size="small"
                isDisabled={disabled || index === 0}
                onClick={() => move(index, index - 1)}
              >
                Move up
              </Button>
              <Button
                variant="transparent"
                size="small"
                isDisabled={disabled || index === value.length - 1}
                onClick={() => move(index, index + 1)}
              >
                Move down
              </Button>
              <Button
                variant="negative"
                size="small"
                isDisabled={disabled}
                startIcon={<DeleteIcon />}
                onClick={() => removeRow(index)}
              >
                Remove
              </Button>
            </Flex>
          </Flex>

          <FormControl marginBottom="spacingM">
            <FormControl.Label>Icon</FormControl.Label>
            <IconPicker
              variant="plainName"
              provider={provider}
              value={row.icon || null}
              onChange={(icon) => updateRow(index, { icon })}
            />
          </FormControl>

          {extraFields.map((def) => (
            <FormControl key={def.id} marginBottom="spacingM" isRequired={def.required}>
              <FormControl.Label>{def.label || def.id}</FormControl.Label>
              <TextInput
                value={row[def.id] ?? ''}
                isDisabled={disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateRow(index, { [def.id]: e.target.value })
                }
              />
            </FormControl>
          ))}
        </div>
      ))}

      <Button
        variant="secondary"
        isDisabled={disabled}
        onClick={addRow}
        data-test-id="icon-list-add"
      >
        Add step
      </Button>
    </Box>
  );
};

export default IconListEditor;
