import { Link } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import AssetCard from '../components/AssetCard';
import styles from './HomePage.module.css';

const TYPE_ICONS: Record<string, string> = {
  'Live Webinar': '📡',
  'On-Demand Webinar': '▶',
  'Whitepaper': '📄',
  'on-demand podcast': '🎙',
};

export default function HomePage() {
  const { assets, loading } = useAssets();
  const featured = assets.slice(0, 3);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Healthcare Intelligence Resource Center</div>
            <h1 className={styles.heroTitle}>
              Advance Your Practice with<br />
              <em className={styles.heroEm}>Expert-Led Resources</em>
            </h1>
            <p className={styles.heroSub}>
              Access whitepapers, webinars, and podcasts curated by healthcare leaders
              at the forefront of clinical, financial, and operational excellence.
            </p>
            <div className={styles.heroActions}>
              <Link to="/assets" className={styles.heroCta}>Browse All Resources</Link>
              <Link to="/assets?type=Live+Webinar" className={styles.heroSecondary}>Upcoming Webinars →</Link>
            </div>
          </div>
          <div className={styles.heroAside}>
            <div className={styles.statBlock}>
              <div className={styles.statNum}>10+</div>
              <div className={styles.statLabel}>Expert Resources</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBlock}>
              <div className={styles.statNum}>4</div>
              <div className={styles.statLabel}>Content Formats</div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBlock}>
              <div className={styles.statNum}>Free</div>
              <div className={styles.statLabel}>Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content types */}
      <section className={styles.types}>
        <div className={styles.container}>
          <div className={styles.typesGrid}>
            {Object.entries(TYPE_ICONS).map(([type, icon]) => (
              <Link key={type} to={`/assets?type=${encodeURIComponent(type)}`} className={styles.typeCard}>
                <span className={styles.typeIcon}>{icon}</span>
                <span className={styles.typeLabel}>{type === 'on-demand podcast' ? 'Podcast' : type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured resources */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionEyebrow}>Featured Resources</div>
            <h2 className={styles.sectionTitle}>From Our Content Library</h2>
            <Link to="/assets" className={styles.sectionLink}>View all resources →</Link>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading resources…</div>
          ) : (
            <div className={styles.grid}>
              {featured.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA band */}
      <section className={styles.ctaBand}>
        <div className={styles.container}>
          <div className={styles.ctaBandInner}>
            <div>
              <div className={styles.ctaEyebrow}>Free Access</div>
              <h2 className={styles.ctaTitle}>Ready to get started?</h2>
              <p className={styles.ctaText}>
                Register for any resource in minutes. No subscription required.
              </p>
            </div>
            <Link to="/assets" className={styles.ctaBtn}>Browse Resources</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
