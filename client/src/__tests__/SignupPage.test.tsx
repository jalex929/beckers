import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SignupPage from '../pages/SignupPage'
import type { Asset } from '../types'

afterEach(cleanup)

const MOCK_ASSET: Asset = {
  id: 'test-1',
  name: 'AI in Hospital Operations',
  description: 'How leading health systems are deploying AI at the point of care.',
  assetType: 'Live Webinar',
  sponsorName: 'Summit Health Partners',
  executionDate: '2024-06-15',
  speakers: [{ id: 'spk-1', firstName: 'Jane', lastName: 'Smith', jobTitle: 'Chief Medical Officer', companyName: 'Summit Health' }],
}

// vi.hoisted ensures these fns are available inside the vi.mock() factory
const mockUseAsset = vi.hoisted(() => vi.fn())
const mockUseAssets = vi.hoisted(() => vi.fn())

vi.mock('../hooks/useRecentlyViewed', () => ({
  recordView: vi.fn(),
  useRecentlyViewed: () => ({ items: [], refresh: vi.fn() }),
}))

vi.mock('../hooks/useAssets', () => ({
  useAssets: () => mockUseAssets(),
  useAsset: () => mockUseAsset(),
  submitSignup: vi.fn(),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/assets/test-1']}>
      <Routes>
        <Route path="/assets/:id" element={<SignupPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('SignupPage — form copy', () => {
  beforeAll(() => {
    console.log('\n━━━ SignupPage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })

  beforeEach(() => {
    mockUseAsset.mockReturnValue({ asset: MOCK_ASSET, loading: false, error: null })
    mockUseAssets.mockReturnValue({ assets: [], loading: false, error: null })
  })

  it('renders form title', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: 'Get Access' })
    console.log(`  form title     → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders form subtitle', () => {
    renderPage()
    const el = screen.getByText('Complete the form below to access this resource.')
    console.log(`  form subtitle  → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders all five field labels', () => {
    renderPage()
    const labels = ['First name', 'Last name', 'Work email', 'Job title', 'Company']
    labels.forEach(label => {
      const el = screen.getByText(label)
      console.log(`  field label    → ${JSON.stringify(el.textContent)}`)
      expect(el).toBeInTheDocument()
    })
  })

  it('renders submit button', () => {
    renderPage()
    const el = screen.getByRole('button', { name: /get access|register now/i })
    console.log(`  submit button  → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders asset title in detail panel', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: MOCK_ASSET.name })
    console.log(`  asset title    → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders back link', () => {
    renderPage()
    const el = screen.getByRole('link', { name: '← Back to Resources' })
    console.log(`  back link      → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders speaker name on asset card when speakers are present', () => {
    renderPage()
    const el = screen.getByText('Jane Smith')
    console.log(`  speaker name   → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })
})

describe('SignupPage — error state', () => {
  beforeEach(() => {
    mockUseAsset.mockReturnValue({ asset: null, loading: false, error: 'Resource not found.' })
    mockUseAssets.mockReturnValue({ assets: [], loading: false, error: null })
  })

  it('renders error message and back link', () => {
    render(
      <MemoryRouter initialEntries={['/assets/bad-id']}>
        <Routes>
          <Route path="/assets/:id" element={<SignupPage />} />
        </Routes>
      </MemoryRouter>
    )
    const backLink = screen.getByRole('link', { name: '← Back to Resources' })
    const errMsg = screen.getByText('Resource not found.')
    console.log(`  error back link → ${JSON.stringify(backLink.textContent)}`)
    console.log(`  error message   → ${JSON.stringify(errMsg.textContent)}`)
    expect(backLink).toBeInTheDocument()
    expect(errMsg).toBeInTheDocument()
  })
})
