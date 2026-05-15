import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AssetsPage from './pages/AssetsPage'
import SignupPage from './pages/SignupPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Page not found</h1>
      <Link to="/" style={{ color: 'var(--color-accent)' }}>Back to home</Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/assets/:id" element={<SignupPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
