import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>BH</div>
          <div>
            <div className={styles.brandName}>Becker's Healthcare</div>
            <div className={styles.brandSub}>Resource Center</div>
          </div>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <div className={styles.colLabel}>Resources</div>
            <Link to="/assets" className={styles.colLink}>All Resources</Link>
            <Link to="/assets?type=Live+Webinar" className={styles.colLink}>Live Webinars</Link>
            <Link to="/assets?type=On-Demand+Webinar" className={styles.colLink}>On-Demand Webinars</Link>
            <Link to="/assets?type=Whitepaper" className={styles.colLink}>Whitepapers</Link>
            <Link to="/assets?type=on-demand+podcast" className={styles.colLink}>Podcasts</Link>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>Becker's Sites</div>
            {['Hospital Review', 'ASC Review', 'Spine Review', 'Dental Review', 'Payer Issues'].map(s => (
              <span key={s} className={styles.colLink}>{s}</span>
            ))}
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>About</div>
            {['About Becker\'s', 'Media Kit', 'Contact Us', 'Privacy Policy', 'Careers'].map(s => (
              <span key={s} className={styles.colLink}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.legal}>
        <span>© 2026 Becker's Healthcare. All Rights Reserved.</span>
        <span>Professional · Trusted · Engaging</span>
      </div>
    </footer>
  );
}
