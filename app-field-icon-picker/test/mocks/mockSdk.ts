import { vi } from 'vitest';

const mockSdk: any = {
  app: {
    onConfigure: vi.fn(),
    getParameters: vi.fn().mockReturnValueOnce({}),
    setReady: vi.fn(),
    getCurrentState: vi.fn(),
  },
  ids: {
    app: 'test-app',
    contentType: 'test-content-type',
    field: 'test-field',
  },
  parameters: {
    installation: {},
    invocation: {},
  },
  field: {
    id: 'test-field',
    getValue: vi.fn().mockReturnValue(undefined),
    setValue: vi.fn(),
    removeValue: vi.fn(),
    onValueChanged: vi.fn().mockReturnValue(() => {}),
  },
  window: {
    startAutoResizer: vi.fn(),
  },
  dialogs: {
    openCurrentApp: vi.fn(),
    openConfirm: vi.fn(),
  },
  close: vi.fn(),
};

export { mockSdk };
