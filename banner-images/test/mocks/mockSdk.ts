const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
  },
  window: {
    startAutoResizer: jest.fn().mockImplementation(() => {}),
  },
  field: {
    getValue: jest.fn(),
    setValue: jest.fn(),
    locale: 'en-US',
  },
  entry: {
    fields: {
      images: {
        getValue: jest.fn(),
        onValueChanged: jest.fn(),
      },
    },
  },
}

export { mockSdk }
