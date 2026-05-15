import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandName}>Becker's</span>
          <span className={styles.brandSub}>Resource Library</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink to="/assets" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Resources
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
