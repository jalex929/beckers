import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../components/Footer'

afterEach(cleanup)

describe('Footer — content', () => {
  beforeAll(() => {
    console.log('\n━━━ Footer ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })

  it('renders brand name', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const el = screen.getByText('Meridian')
    console.log(`  brand name     → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const el = screen.getByText('Clarity in the business of healthcare.')
    console.log(`  tagline        → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const resourceLink = screen.getByRole('link', { name: 'Resource Library' })
    const homeLink = screen.getByRole('link', { name: 'Home' })
    console.log(`  nav link       → ${JSON.stringify(resourceLink.textContent)}`)
    console.log(`  nav link       → ${JSON.stringify(homeLink.textContent)}`)
    expect(resourceLink).toBeInTheDocument()
    expect(homeLink).toBeInTheDocument()
  })

  it('renders copyright with brand name', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const el = screen.getByText(/Meridian Health Intelligence\. All rights reserved\./)
    console.log(`  copyright      → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })
})
