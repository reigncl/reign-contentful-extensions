import Field from './Field'
import { render, cleanup } from '@testing-library/react'
import { fieldMock, mockCma, mockSdk } from '../../test/mocks'

describe('Field component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(cleanup)

  it('should not render table when there are no images', () => {
    mockSdk.field.getValue.mockImplementation(() => [])
    const { getByTestId } = render(<Field cma={mockCma} sdk={mockSdk} />)
    expect(getByTestId('noImagesHeading')).toBeInTheDocument()
  })

  it('should render table when there are images', () => {
    mockSdk.field.getValue.mockImplementation(() => fieldMock)
    const { getByTestId } = render(<Field cma={mockCma} sdk={mockSdk} />)
    expect(getByTestId('table')).toBeInTheDocument()
  })
})
