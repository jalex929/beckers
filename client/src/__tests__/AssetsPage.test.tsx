import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AssetsPage from '../pages/AssetsPage'

afterEach(cleanup)

vi.mock('../hooks/useAssets', () => ({
  useAssets: () => ({ assets: [], loading: false, error: null }),
}))

function renderPage() {
  return render(<MemoryRouter><AssetsPage /></MemoryRouter>)
}

describe('AssetsPage — controls and copy', () => {
  beforeAll(() => {
    console.log('\n━━━ AssetsPage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })

  it('renders page title', () => {
    renderPage()
    const el = screen.getByRole('heading', { name: 'Resource Library' })
    console.log(`  page title     → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders all five filter buttons', () => {
    renderPage()
    const filters = ['All', 'Live Webinars', 'On-Demand Webinars', 'Whitepapers', 'Podcasts']
    filters.forEach(label => {
      const el = screen.getByRole('button', { name: label })
      console.log(`  filter button  → ${JSON.stringify(el.textContent)}`)
      expect(el).toBeInTheDocument()
    })
  })

  it('renders search input with correct placeholder', () => {
    renderPage()
    const el = screen.getByPlaceholderText('Search resources…')
    console.log(`  search input   → placeholder ${JSON.stringify(el.getAttribute('placeholder'))}`)
    expect(el).toBeInTheDocument()
  })

  it('renders sort options', () => {
    renderPage()
    const options = ['Default order', 'Coming up soon']
    options.forEach(label => {
      const el = screen.getByRole('option', { name: label })
      console.log(`  sort option    → ${JSON.stringify(el.textContent)}`)
      expect(el).toBeInTheDocument()
    })
  })

  it('renders empty state message when no assets match', () => {
    renderPage()
    const el = screen.getByText('No resources match your search.')
    console.log(`  empty state    → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders Clear filters button in empty state', () => {
    renderPage()
    const el = screen.getByRole('button', { name: 'Clear filters' })
    console.log(`  clear button   → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })
})
