export const assetMock = {
  sys: {
    id: 'dummy-id',
  },
  fields: {
    file: {
      'en-US': {
        url: '#',
      },
    },
  },
}

export const imagesMock = [
  { ...assetMock },
  { ...assetMock, sys: { id: 'dummy-id2' } },
  { ...assetMock, sys: { id: 'dummy-id3' } },
]
