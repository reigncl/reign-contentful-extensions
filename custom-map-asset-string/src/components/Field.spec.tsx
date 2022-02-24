import Field from './Field'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { assetMock, fieldMock, imagesMock, mockCma, mockSdk } from '../../test/mocks'

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

  it('should render table when there are images in field', async () => {
    mockSdk.field.getValue.mockImplementation(() => fieldMock)
    mockSdk.entry.fields.images.getValue.mockImplementation(() => imagesMock)

    const { findByTestId } = render(<Field cma={mockCma} sdk={mockSdk} />)
    expect(await findByTestId('table')).toBeInTheDocument()
  })

  it('should render table when there are no images in custom field but there are in images field', async () => {
    mockSdk.field.getValue.mockImplementation(() => [])
    mockSdk.entry.fields.images.getValue.mockImplementation(() => imagesMock)
    mockCma.asset.get.mockImplementation(() => assetMock)

    const { findByTestId } = render(<Field cma={mockCma} sdk={mockSdk} />)
    expect(await findByTestId('table')).toBeInTheDocument()
  })

  it('should change field state when input changes', async () => {
    mockSdk.field.getValue.mockImplementation(() => fieldMock)
    mockSdk.entry.fields.images.getValue.mockImplementation(() => imagesMock)
    mockCma.asset.get.mockImplementation(() => assetMock)

    const { findAllByTestId } = render(<Field cma={mockCma} sdk={mockSdk} />)

    const inputs = await findAllByTestId(/textInput/)

    const inputValues = ['/1', '/2', '/3']
    inputs.forEach((input, idx) => {
      const inputValue = inputValues[idx]

      expect(input).toBeInTheDocument()
      expect((input as HTMLInputElement).defaultValue).toBe(fieldMock[idx].category)

      fireEvent.change(input, {
        target: { value: inputValue },
      })

      expect((input as HTMLInputElement).value).toBe(inputValue)
    })

    expect(mockSdk.field.setValue).toHaveBeenCalledTimes(inputs.length + 1)
  })

  it('should call detachSiteChangeHandler', () => {
    mockSdk.field.getValue.mockImplementation(() => fieldMock)
    const mockDetachSiteChangeHandler = jest.fn().mockImplementation(() => 'detach site')
    mockSdk.entry.fields.images.onValueChanged.mockImplementation(() => mockDetachSiteChangeHandler)
    mockCma.asset.get.mockImplementation(() => assetMock)

    const { unmount } = render(<Field cma={mockCma} sdk={mockSdk} />)

    unmount()
    expect(mockDetachSiteChangeHandler).toHaveBeenCalled()
  })
})
