import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'

afterEach(cleanup)

vi.mock('../hooks/useAssets', () => ({
  useAssets: () => ({ assets: [], loading: false, error: null }),
}))

vi.mock('../hooks/useRecentlyViewed', () => ({
  useRecentlyViewed: () => ({ items: [], refresh: vi.fn() }),
  clearRecentlyViewed: vi.fn(),
}))

function renderPage() {
  return render(<MemoryRouter><HomePage /></MemoryRouter>)
}

describe('HomePage — hero copy', () => {
  beforeAll(() => {
    console.log('\n━━━ HomePage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })

  it('renders eyebrow', () => {
    renderPage()
    const el = screen.getByText('Meridian Health Intelligence')
    console.log(`  hero eyebrow   → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders heading', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: /Discover Healthcare's Leading Resources/ })
    console.log(`  hero heading   → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders hero subtitle', () => {
    renderPage()
    const el = screen.getByText(/Access expert webinars, whitepapers/)
    console.log(`  hero subtitle  → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders hero CTA link', () => {
    renderPage()
    const el = screen.getByRole('link', { name: 'Browse the Resource Library' })
    console.log(`  hero CTA       → ${JSON.stringify(el.textContent)}`)
    expect(el).toHaveAttribute('href', '/assets')
  })
})

describe('HomePage — sections', () => {
  it('renders Featured Resources heading', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: 'Featured Resources' })
    console.log(`  section title  → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders Browse by Type heading', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: 'Browse by Type' })
    console.log(`  section title  → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders all four type category links', () => {
    renderPage()
    const types = ['Live Webinars', 'On-Demand Webinars', 'Whitepapers', 'Podcasts']
    types.forEach(label => {
      const el = screen.getByRole('link', { name: label })
      console.log(`  type link      → ${JSON.stringify(el.textContent)}`)
      expect(el).toBeInTheDocument()
    })
  })
})
