const mockSdk: any = {
  app: {
    onConfigure: jest.fn(),
    getParameters: jest.fn().mockReturnValueOnce({}),
    setReady: jest.fn(),
    getCurrentState: jest.fn(),
  },
  ids: {
    app: 'test-app',
  },
  entry: {
    get: jest.fn(),
    fields: {
      name: {
        getValue: jest.fn(() => 'Email contact'),
        setValue: jest.fn(),
      },
      variant: {
        getValue: jest.fn(() => 'email'),
        setValue: jest.fn(),
      },
      title: {
        getValue: jest.fn(() => 'Email'),
        setValue: jest.fn(),
      },
      usPhoneNumber: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
      internationalNumber: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
      chat: {
        getValue: jest.fn(() => ({
          sys: {
            linkType: 'Entry',
            type: 'Link',
            id: 'id',
          },
        })),
        setValue: jest.fn(),
      },
      email: {
        getValue: jest.fn(() => undefined),
        setValue: jest.fn(),
      },
    },
  },
}

export { mockSdk }
