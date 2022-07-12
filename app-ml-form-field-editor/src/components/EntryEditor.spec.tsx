import EntryEditor from './EntryEditor'
import { render, fireEvent, act } from '@testing-library/react'
import { mockCma, mockSdk } from '../../test/mocks'

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}))

describe('Entry component', () => {
  it('Component required text exist', () => {
    const { getByText } = render(<EntryEditor />)

    expect(getByText('Name')).toBeInTheDocument()
    expect(getByText('Variant')).toBeInTheDocument()
    expect(getByText('Title')).toBeInTheDocument()
  })

  describe('Variation change', () => {
    it('should show email field when email variant is selected', async () => {
      const { getByText, getByTestId } = render(<EntryEditor />)

      // Email option
      await act(async () => {
        fireEvent.change(getByTestId('variant'), { target: { value: 'email' } })
      })

      expect((getByTestId('emailOption') as HTMLOptionElement).selected).toBeTruthy()
      expect((getByTestId('chatOption') as HTMLOptionElement).selected).toBeFalsy()
      expect((getByTestId('phoneOption') as HTMLOptionElement).selected).toBeFalsy()

      expect(() => getByText('Email')).toBeDefined()
      expect(() => getByText('Chat')).toThrow()
      expect(() => getByText('US Phone Number')).toThrow()
      expect(() => getByText('International Number')).toThrow()
    })

    it('should show chat field when chat variant is selected', async () => {
      const { getByText, getByTestId } = render(<EntryEditor />)

      // Chat option
      await act(async () => {
        fireEvent.change(getByTestId('variant'), { target: { value: 'chat' } })
      })

      expect((getByTestId('emailOption') as HTMLOptionElement).selected).toBeFalsy()
      expect((getByTestId('chatOption') as HTMLOptionElement).selected).toBeTruthy()
      expect((getByTestId('phoneOption') as HTMLOptionElement).selected).toBeFalsy()

      expect(() => getByText('Email')).toThrow()
      expect(() => getByText('Chat')).toBeDefined()
      expect(() => getByText('US Phone Number')).toThrow()
      expect(() => getByText('International Number')).toThrow()
    })

    it(`should show both usPhoneNumber and internationalNumber fields when 'phone' variant is selected`, async () => {
      const { getByText, getByTestId } = render(<EntryEditor />)

      // Phone option
      await act(async () => {
        fireEvent.change(getByTestId('variant'), { target: { value: 'phone' } })
      })

      expect((getByTestId('emailOption') as HTMLOptionElement).selected).toBeFalsy()
      expect((getByTestId('chatOption') as HTMLOptionElement).selected).toBeFalsy()
      expect((getByTestId('phoneOption') as HTMLOptionElement).selected).toBeTruthy()

      expect(() => getByText('Email')).toThrow()
      expect(() => getByText('Chat')).toThrow()
      expect(() => getByText('US Phone Number')).toBeDefined()
      expect(() => getByText('International Number')).toBeDefined()
    })
  })
})
