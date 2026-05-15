import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>BH</span>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Becker's Healthcare</span>
            <span className={styles.brandSub}>Resource Center</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Home
          </NavLink>
          <NavLink to="/assets" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Resources
          </NavLink>
        </nav>

        <Link to="/assets" className={styles.cta}>
          Browse All Resources
        </Link>
      </div>
    </header>
  );
}
