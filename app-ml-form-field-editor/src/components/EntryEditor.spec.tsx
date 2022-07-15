import EntryEditor from './EntryEditor'
import { render } from '@testing-library/react'
import { mockCma, mockSdk } from '../../test/mocks'

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}))

describe('Entry component', () => {
  it('Component required', () => {
    const component = render(<EntryEditor />)

    expect(component).toBeDefined()
  })
})
