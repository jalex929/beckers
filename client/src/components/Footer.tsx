import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Meridian</span>
          <p className={styles.tagline}>Insights that drive better care.</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/assets" className={styles.link}>Resource Library</Link>
          <Link to="/" className={styles.link}>Home</Link>
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} Meridian Health Intelligence. All rights reserved.</p>
      </div>
    </footer>
  )
}
