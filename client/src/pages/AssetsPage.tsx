import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAssets } from '../hooks/useAssets'
import AssetCard from '../components/AssetCard'
import SkeletonCard from '../components/SkeletonCard'
import styles from './AssetsPage.module.css'
import type { AssetType } from '../types'
import { track } from '../utils/analytics'

const ASSET_TYPES: { label: string; value: AssetType | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Live Webinars', value: 'Live Webinar' },
  { label: 'On-Demand Webinars', value: 'On-Demand Webinar' },
  { label: 'Whitepapers', value: 'Whitepaper' },
  { label: 'Podcasts', value: 'on-demand podcast' },
]

const PAGE_SIZE = 9

export default function AssetsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { assets, loading, error } = useAssets()

  const [typeFilter, setTypeFilter] = useState<AssetType | ''>((searchParams.get('type') as AssetType) ?? '')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'default' | 'asc' | 'desc'>('default')
  const [page, setPage] = useState(1)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [typeFilter, search, sort])

  useEffect(() => {
    if (search.trim()) {
      track({ event: 'search_used', properties: { query: search, result_count: filtered.length } })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleTypeFilter = useCallback((value: AssetType | '') => {
    setTypeFilter(value)
    track({ event: 'filter_applied', properties: { filter_value: value || 'all' } })
    if (value) setSearchParams({ type: value })
    else setSearchParams({})
  }, [setSearchParams])

  const filtered = useMemo(() => {
    let result = assets

    if (typeFilter) {
      result = result.filter(a => a.assetType === typeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.sponsorName.toLowerCase().includes(q)
      )
    }

    if (sort === 'desc') {
      result = [...result].sort((a, b) => {
        const da = a.executionDate ? new Date(a.executionDate).getTime() : 0
        const db = b.executionDate ? new Date(b.executionDate).getTime() : 0
        return db - da
      })
    } else if (sort === 'asc') {
      result = [...result].sort((a, b) => {
        const da = a.executionDate ? new Date(a.executionDate).getTime() : 0
        const db = b.executionDate ? new Date(b.executionDate).getTime() : 0
        return da - db
      })
    }

    return result
  }, [assets, typeFilter, search, sort])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Resource Library</h1>
        </div>

        {/* Filters */}
        <div className={styles.controls}>
          <div className={styles.typeFilters} role="group" aria-label="Filter by type">
            {ASSET_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => handleTypeFilter(t.value as AssetType | '')}
                className={`${styles.filterBtn} ${typeFilter === t.value ? styles.filterActive : ''}`}
                aria-pressed={typeFilter === t.value}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.rightControls}>
            <input
              type="search"
              placeholder="Search resources…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className={styles.searchInput}
              aria-label="Search resources"
            />
            <select
              value={sort}
              onChange={e => {
                const v = e.target.value as 'default' | 'asc' | 'desc'
                setSort(v)
                track({ event: 'sort_changed', properties: { sort_value: v } })
              }}
              className={styles.sortSelect}
              aria-label="Sort resources"
            >
              <option value="default">Default</option>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className={styles.resultCount}>
            Showing {visible.length} of {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* States */}
        {loading && (
          <div className={styles.grid}>
            {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        )}
        {error && <p className={styles.stateError}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p>No resources match your search.</p>
            <button onClick={() => { setTypeFilter(''); setSearchInput('') }} className={styles.clearBtn}>
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && visible.length > 0 && (
          <>
            <div className={styles.grid}>
              {visible.map((asset, idx) => (
                <AssetCard key={asset.id} asset={asset} index={idx} highlight={search} context="assets_page" />
              ))}
            </div>
            {hasMore && (
              <div className={styles.loadMore}>
                <button
                  onClick={() => {
                    setPage(p => p + 1)
                    track({ event: 'load_more_clicked', properties: { page_number: page + 1, visible_count: visible.length, total_count: filtered.length } })
                  }}
                  className={styles.loadMoreBtn}
                >
                  Load more resources
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
