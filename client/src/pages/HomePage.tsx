import { Link } from 'react-router-dom'
import { useAssets } from '../hooks/useAssets'
import AssetCard from '../components/AssetCard'
import styles from './HomePage.module.css'

const TYPES = [
  { label: 'Live Webinars', value: 'Live Webinar' },
  { label: 'On-Demand Webinars', value: 'On-Demand Webinar' },
  { label: 'Whitepapers', value: 'Whitepaper' },
  { label: 'Podcasts', value: 'on-demand podcast' },
]

export default function HomePage() {
  const { assets, loading, error } = useAssets()
  const featured = assets.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Becker's Healthcare</p>
          <h1 className={styles.heroTitle}>Discover Healthcare's Leading Resources</h1>
          <p className={styles.heroSub}>
            Access expert webinars, whitepapers, and podcasts curated for healthcare professionals.
          </p>
          <Link to="/assets" className={styles.heroCta}>Browse the Resource Library</Link>
        </div>
      </section>

      {/* Featured Resources */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Resources</h2>
            <Link to="/assets" className={styles.sectionLink}>View all resources →</Link>
          </div>
          {loading && <p className={styles.stateMsg}>Loading resources…</p>}
          {error && <p className={styles.stateError}>{error}</p>}
          {!loading && !error && (
            <div className={styles.grid}>
              {featured.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
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
