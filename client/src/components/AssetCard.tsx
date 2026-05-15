import { Link, useLocation } from 'react-router-dom'
import AssetBadge from './AssetBadge'
import styles from './AssetCard.module.css'
import type { Asset } from '../types'

interface Props {
  asset: Asset
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function AssetCard({ asset }: Props) {
  const location = useLocation()
  const date = formatDate(asset.executionDate)
  const from = location.pathname + location.search

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <AssetBadge type={asset.assetType} />
        {date && <time className={styles.date}>{date}</time>}
      </div>
      <h3 className={styles.title}>{asset.name}</h3>
      <p className={styles.description}>{asset.description}</p>
      {asset.sponsorName && (
        <p className={styles.sponsor}>Sponsored by {asset.sponsorName}</p>
      )}
      <Link to={`/assets/${asset.id}`} state={{ from }} className={styles.cta}>
        Get Access →
      </Link>
    </article>
  )
}
