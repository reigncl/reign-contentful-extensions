import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dialog from './Dialog';
import { mockCma, mockSdk } from '../../test/mocks';
import '../icon-sets';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Dialog component', () => {
  it('renders the configuration form labels', async () => {
    const { getByText } = render(<Dialog />);
    await waitFor(() => {
      expect(getByText('Content type')).toBeInTheDocument();
      expect(getByText('Icon set')).toBeInTheDocument();
    });
  });
});
