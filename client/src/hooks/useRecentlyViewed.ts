import { useState, useEffect } from 'react'
import type { Asset } from '../types'

const KEY = 'meridian_recently_viewed'
const MAX = 4

export function getRecentlyViewed(): Asset[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function recordView(asset: Asset) {
  const current = getRecentlyViewed()
  const deduped = current.filter(a => a.id !== asset.id)
  const updated = [asset, ...deduped].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<Asset[]>(getRecentlyViewed)

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(getRecentlyViewed())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { items, refresh: () => setItems(getRecentlyViewed()) }
}
