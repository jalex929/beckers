import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.shimmer} ${styles.badge}`} />
      <div className={`${styles.shimmer} ${styles.title1}`} />
      <div className={`${styles.shimmer} ${styles.title2}`} />
      <div className={`${styles.shimmer} ${styles.body1}`} />
      <div className={`${styles.shimmer} ${styles.body2}`} />
      <div className={`${styles.shimmer} ${styles.body3}`} />
      <div className={`${styles.shimmer} ${styles.cta}`} />
    </div>
  )
}
