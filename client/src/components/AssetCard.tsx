import { Link } from 'react-router-dom';
import type { Asset } from '../types';
import AssetBadge from './AssetBadge';
import styles from './AssetCard.module.css';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AssetCard({ asset }: { asset: Asset }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <AssetBadge type={asset.assetType} />
        {asset.executionDate && (
          <span className={styles.date}>{formatDate(asset.executionDate)}</span>
        )}
      </div>

      <h3 className={styles.title}>{asset.name}</h3>
      <p className={styles.desc}>{asset.description}</p>

      <div className={styles.foot}>
        <span className={styles.sponsor}>Sponsored by {asset.sponsorName}</span>
        <Link to={`/assets/${asset.id}`} className={styles.cta}>
          Get Access →
        </Link>
      </div>
    </article>
  );
}
