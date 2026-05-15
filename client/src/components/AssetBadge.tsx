import styles from './AssetBadge.module.css'
import type { AssetType } from '../types'

const LABELS: Record<AssetType, string> = {
  'Live Webinar': 'Live Webinar',
  'On-Demand Webinar': 'On-Demand Webinar',
  'Whitepaper': 'Whitepaper',
  'on-demand podcast': 'Podcast',
}

const VARIANTS: Record<AssetType, string> = {
  'Live Webinar': styles.live,
  'On-Demand Webinar': styles.onDemand,
  'Whitepaper': styles.whitepaper,
  'on-demand podcast': styles.podcast,
}

interface Props {
  type: AssetType
}

export default function AssetBadge({ type }: Props) {
  return (
    <span className={`${styles.badge} ${VARIANTS[type] ?? ''}`}>
      {LABELS[type] ?? type}
    </span>
  )
}
