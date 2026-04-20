const mockCma: any = {
  contentType: {
    getMany: jest.fn().mockResolvedValue({ items: [] }),
    get: jest.fn().mockResolvedValue({ fields: [] }),
  },
  editorInterface: {
    get: jest.fn().mockResolvedValue({ controls: [] }),
    update: jest.fn().mockResolvedValue({}),
  },
};

export { mockCma };
