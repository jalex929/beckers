import type { AssetType } from '../types';
import styles from './AssetBadge.module.css';

const CONFIG: Record<string, { label: string; cls: string }> = {
  'Live Webinar':       { label: 'Live Webinar',       cls: 'live' },
  'On-Demand Webinar':  { label: 'On-Demand Webinar',  cls: 'ondemand' },
  'Whitepaper':         { label: 'Whitepaper',          cls: 'whitepaper' },
  'on-demand podcast':  { label: 'Podcast',             cls: 'podcast' },
};

export default function AssetBadge({ type }: { type: AssetType }) {
  const cfg = CONFIG[type] ?? { label: type, cls: 'default' };
  return <span className={`${styles.badge} ${styles[cfg.cls]}`}>{cfg.label}</span>;
}
