import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'

afterEach(cleanup)

describe('Header — content', () => {
  beforeAll(() => {
    console.log('\n━━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })

  it('renders brand name', () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    const el = screen.getByText('Meridian')
    console.log(`  brand name     → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders brand subtitle', () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    const el = screen.getByText('Resource Library')
    console.log(`  brand subtitle → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })

  it('renders Resources nav link', () => {
    render(<MemoryRouter><Header /></MemoryRouter>)
    const el = screen.getByRole('link', { name: 'Resources' })
    console.log(`  nav link       → ${JSON.stringify(el.textContent)}`)
    expect(el).toBeInTheDocument()
  })
})
