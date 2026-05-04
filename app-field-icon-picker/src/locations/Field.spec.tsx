import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Field from './Field';
import { mockCma, mockSdk } from '../../test/mocks';
import '../icon-sets';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Field component', () => {
  it('renders the icon picker input', () => {
    const { getByPlaceholderText } = render(<Field />);
    expect(getByPlaceholderText('Search icons')).toBeInTheDocument();
  });
});
