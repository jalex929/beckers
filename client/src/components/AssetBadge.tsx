import styles from './AssetBadge.module.css'
import type { AssetType } from '../types'
import eventsIcon from '../assets/icons/events.svg'
import webinarsIcon from '../assets/icons/webinars.svg'
import whitepaperIcon from '../assets/icons/whitepapers.svg'
import podcastsIcon from '../assets/icons/podcasts.svg'

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

const ICONS: Record<AssetType, string> = {
  'Live Webinar': eventsIcon,
  'On-Demand Webinar': webinarsIcon,
  'Whitepaper': whitepaperIcon,
  'on-demand podcast': podcastsIcon,
}

// These badge variants use white text — icon must be inverted to white
const ICON_INVERSE: Record<AssetType, boolean> = {
  'Live Webinar': true,
  'On-Demand Webinar': true,
  'Whitepaper': false,
  'on-demand podcast': true,
}

interface Props {
  type: AssetType
}

export default function AssetBadge({ type }: Props) {
  const icon = ICONS[type]
  const inverse = ICON_INVERSE[type]
  return (
    <span className={`${styles.badge} ${VARIANTS[type] ?? ''}`}>
      {icon && (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className={`${styles.icon} ${inverse ? styles.iconInverse : ''}`}
        />
      )}
      {LABELS[type] ?? type}
    </span>
  )
}
