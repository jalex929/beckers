import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';
import AssetCard from '../components/AssetCard';
import type { AssetType } from '../types';
import styles from './AssetsPage.module.css';

const ALL_TYPES: AssetType[] = ['Live Webinar', 'On-Demand Webinar', 'Whitepaper', 'on-demand podcast'];
const TYPE_LABELS: Record<string, string> = { 'on-demand podcast': 'Podcast' };
const PAGE_SIZE = 6;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AssetsPage() {
  const { assets, loading, error } = useAssets();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<AssetType | ''>((searchParams.get('type') as AssetType) ?? '');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'default' | 'date-asc' | 'date-desc'>('default');

  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeType]);

  function handleTypeChange(t: AssetType | '') {
    setActiveType(t);
    if (t) setSearchParams({ type: t });
    else setSearchParams({});
  }

  const filtered = useMemo(() => {
    let list = [...assets];

    if (activeType) list = list.filter(a => a.assetType === activeType);

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.sponsorName.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'date-asc') {
      list.sort((a, b) => new Date(a.executionDate ?? a.lastModifiedDate).getTime() - new Date(b.executionDate ?? b.lastModifiedDate).getTime());
    } else if (sortBy === 'date-desc') {
      list.sort((a, b) => new Date(b.executionDate ?? b.lastModifiedDate).getTime() - new Date(a.executionDate ?? a.lastModifiedDate).getTime());
    }

    return list;
  }, [assets, activeType, debouncedQuery, sortBy]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <main className={styles.main}>
      <div className={styles.pageHead}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>Resource Library</div>
          <h1 className={styles.title}>Healthcare Insights &amp; Resources</h1>
          <p className={styles.subtitle}>Expert-curated content from leading health systems and sponsors.</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.typeFilters}>
            <button
              className={`${styles.typeBtn} ${activeType === '' ? styles.typeBtnActive : ''}`}
              onClick={() => handleTypeChange('')}
            >
              All
            </button>
            {ALL_TYPES.map(t => (
              <button
                key={t}
                className={`${styles.typeBtn} ${activeType === t ? styles.typeBtnActive : ''}`}
                onClick={() => handleTypeChange(t)}
              >
                {TYPE_LABELS[t] ?? t}
              </button>
            ))}
          </div>

          <div className={styles.controlsRight}>
            <input
              type="search"
              className={styles.search}
              placeholder="Search resources…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <select
              className={styles.sort}
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="default">Default order</option>
              <option value="date-asc">Date: earliest first</option>
              <option value="date-desc">Date: latest first</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <div className={styles.count}>
            Showing {Math.min(paginated.length, filtered.length)} of {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
            {activeType && <span className={styles.countFilter}> — filtered by "{TYPE_LABELS[activeType] ?? activeType}"</span>}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚠</div>
            <div className={styles.emptyTitle}>Could not load resources</div>
            <div className={styles.emptyText}>{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <div className={styles.emptyTitle}>No resources found</div>
            <div className={styles.emptyText}>Try adjusting your search or filters.</div>
            <button className={styles.clearBtn} onClick={() => { setQuery(''); handleTypeChange(''); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {paginated.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMore}>
                <button className={styles.loadMoreBtn} onClick={() => setPage(p => p + 1)}>
                  Load more resources
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
