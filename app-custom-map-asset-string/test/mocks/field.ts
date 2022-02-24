import { BannerImage } from '../../src/interfaces'

export const bannerImageMock: BannerImage = {
  category: '/Women',
  text: 'Women Shoes',
  imageUrl: '#',
  imageId: 'dummy-id',
}

export const fieldMock: BannerImage[] = [
  { ...bannerImageMock },
  { ...bannerImageMock, imageId: 'dummy-id2', category: '/Women-2', text: 'Women Shoes-2' },
  { ...bannerImageMock, imageId: 'dummy-id3', category: '/Women-3', text: 'Women Shoes-3' },
]
