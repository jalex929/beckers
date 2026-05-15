import { Link, useLocation } from 'react-router-dom'
import AssetBadge from './AssetBadge'
import styles from './AssetCard.module.css'
import type { Asset } from '../types'
import { track } from '../utils/analytics'
import type { AssetCardContext } from '../utils/analytics'

interface Props {
  asset: Asset
  index?: number
  highlight?: string
  context?: AssetCardContext
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    i % 2 === 1 ? <mark key={i} className={styles.highlight}>{part}</mark> : part
  )
}

export default function AssetCard({ asset, index = 0, highlight, context = 'assets_page' as AssetCardContext }: Props) {
  const location = useLocation()
  const date = formatDate(asset.executionDate)
  const from = location.pathname + location.search

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className={styles.meta}>
        <AssetBadge type={asset.assetType} />
        {date && <time className={styles.date}>{date}</time>}
      </div>
      <h3 className={styles.title}>
        {highlight ? highlightText(asset.name, highlight) : asset.name}
      </h3>
      <p className={styles.description}>
        {highlight ? highlightText(asset.description, highlight) : asset.description}
      </p>
      {asset.sponsorName && (
        <p className={styles.sponsor}>Sponsored by {asset.sponsorName}</p>
      )}
      <Link
        to={`/assets/${asset.id}`}
        state={{ from }}
        className={styles.cta}
        onClick={() => track({
          event: 'asset_card_clicked',
          properties: {
            asset_id: asset.id,
            asset_type: asset.assetType,
            asset_name: asset.name,
            position: index,
            context,
          },
        })}
      >
        Get Access →
      </Link>
    </article>
  )
}
