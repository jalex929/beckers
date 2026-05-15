import { useEffect } from 'react'
import { useVariant } from '../hooks/useVariant'
import { track } from '../utils/analytics'
import { Link } from 'react-router-dom'
import { useAssets } from '../hooks/useAssets'
import { useRecentlyViewed, clearRecentlyViewed } from '../hooks/useRecentlyViewed'
import AssetCard from '../components/AssetCard'
import SkeletonCard from '../components/SkeletonCard'
import styles from './HomePage.module.css'

const TYPES = [
  { label: 'Live Webinars', value: 'Live Webinar' },
  { label: 'On-Demand Webinars', value: 'On-Demand Webinar' },
  { label: 'Whitepapers', value: 'Whitepaper' },
  { label: 'Podcasts', value: 'on-demand podcast' },
]

export default function HomePage() {
  const { assets, loading, error } = useAssets()
  const { items: recentlyViewed, refresh } = useRecentlyViewed()
  const featured = assets.slice(0, 3)
  const heroCTAVariant = useVariant('hero-cta')
  const heroCTALabel = heroCTAVariant === 'explore' ? 'Explore Resources' : 'Browse the Resource Library'

  // Refresh recently viewed when returning to this page
  useEffect(() => {
    refresh()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Meridian Health Intelligence</p>
          <h1 className={styles.heroTitle}>Discover Healthcare's Leading Resources</h1>
          <p className={styles.heroSub}>
            Access expert webinars, whitepapers, and podcasts curated for healthcare professionals.
          </p>
          <Link to="/assets" className={styles.heroCta}>{heroCTALabel}</Link>
        </div>
      </section>

      {/* Recently Viewed — only shown once user has viewed at least one asset */}
      {recentlyViewed.length > 0 && (
        <section className={styles.recentSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recently Viewed</h2>
              <div className={styles.sectionHeaderActions}>
                <button
                  onClick={() => {
                    track({ event: 'recently_viewed_cleared', properties: { item_count: recentlyViewed.length } })
                    clearRecentlyViewed()
                    refresh()
                  }}
                  className={styles.clearHistoryBtn}
                >
                  Clear
                </button>
                <Link to="/assets" className={styles.sectionLink}>View all resources →</Link>
              </div>
            </div>
            <div className={styles.grid}>
              {recentlyViewed.map((asset, idx) => (
                <AssetCard key={asset.id} asset={asset} index={idx} context="homepage_recently_viewed" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Resources */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Resources</h2>
            <Link to="/assets" className={styles.sectionLink}>View all resources →</Link>
          </div>
          {loading && (
            <div className={styles.grid}>
              {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          )}
          {error && <p className={styles.stateError}>{error}</p>}
          {!loading && !error && (
            <div className={styles.grid}>
              {featured.map((asset, idx) => (
                <AssetCard key={asset.id} asset={asset} index={idx} context="homepage_featured" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Type */}
      <section className={styles.browseSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Browse by Type</h2>
          <div className={styles.typeGrid}>
            {TYPES.map(t => (
              <Link
                key={t.value}
                to={`/assets?type=${encodeURIComponent(t.value)}`}
                className={styles.typeCard}
              >
                <span className={styles.typeLabel}>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
