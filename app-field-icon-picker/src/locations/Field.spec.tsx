import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Field from './Field';
import { mockCma, mockSdk } from '../../test/mocks';
import '../icon-sets';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Field component', () => {
  beforeEach(() => {
    mockSdk.field.type = 'Object';
    mockSdk.parameters.installation = {};
    mockSdk.field.getValue.mockReturnValue(undefined);
  });

  it('renders the icon picker input for Object field without extraFields', () => {
    mockSdk.parameters.installation = {
      items: [
        {
          contentType: 'test-content-type',
          field: 'test-field',
          iconSet: 'phosphor',
          fieldType: 'Object',
        },
      ],
    };
    const { getByPlaceholderText } = render(<Field />);
    expect(getByPlaceholderText('Search icons')).toBeInTheDocument();
  });

  it('uses plain string mode for Symbol fields', () => {
    mockSdk.field.type = 'Symbol';
    mockSdk.parameters.installation = {
      items: [
        {
          contentType: 'test-content-type',
          field: 'test-field',
          iconSet: 'phosphor',
          fieldType: 'Symbol',
        },
      ],
    };
    mockSdk.field.getValue.mockReturnValue('ArrowDown');
    const { getByPlaceholderText } = render(<Field />);
    expect(getByPlaceholderText('Search icons')).toBeInTheDocument();
  });

  it('renders list editor when Object field has extraFields', async () => {
    mockSdk.field.type = 'Object';
    mockSdk.parameters.installation = {
      items: [
        {
          contentType: 'test-content-type',
          field: 'test-field',
          iconSet: 'phosphor',
          fieldType: 'Object',
          extraFields: [{ id: 'label', label: 'Label', type: 'text' as const }],
        },
      ],
    };
    mockSdk.field.getValue.mockReturnValue([{ icon: 'Users', label: 'One' }]);
    const { getByText, getByPlaceholderText } = render(<Field />);
    await waitFor(() => {
      expect(getByText('Add step')).toBeInTheDocument();
    });
    expect(getByPlaceholderText('Search icons')).toBeInTheDocument();
  });
});
