import { BannerImage } from '../../src/interfaces'

export const bannerImageMock: BannerImage = {
  category: '/Women',
  imageUrl: '#',
  imageId: 'dummy-id',
}

export const fieldMock: BannerImage[] = [{ ...bannerImageMock }, { ...bannerImageMock }, { ...bannerImageMock }]
