const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
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
    getValue: jest.fn().mockReturnValue(undefined),
    setValue: jest.fn(),
    removeValue: jest.fn(),
    onValueChanged: jest.fn().mockReturnValue(() => {}),
  },
  window: {
    startAutoResizer: jest.fn(),
  },
  dialogs: {
    openCurrentApp: jest.fn(),
    openConfirm: jest.fn(),
  },
  close: jest.fn(),
};

export { mockSdk };
