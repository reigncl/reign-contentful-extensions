import { vi } from 'vitest';

const mockCma: any = {
  contentType: {
    getMany: vi.fn().mockResolvedValue({ items: [] }),
    get: vi.fn().mockResolvedValue({ fields: [] }),
  },
  editorInterface: {
    get: vi.fn().mockResolvedValue({ controls: [] }),
    update: vi.fn().mockResolvedValue({}),
  },
};

export { mockCma };
