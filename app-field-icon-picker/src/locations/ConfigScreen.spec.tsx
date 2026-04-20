import React from 'react';
import { render } from '@testing-library/react';
import ConfigScreen from './ConfigScreen';
import { mockCma, mockSdk } from '../../test/mocks';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Config Screen component', () => {
  it('renders the heading and registers configure handler', async () => {
    const { getByText } = render(<ConfigScreen />);
    await mockSdk.app.onConfigure.mock.calls[0][0]();
    expect(getByText(/Icon picker configurations/i)).toBeInTheDocument();
  });
});
