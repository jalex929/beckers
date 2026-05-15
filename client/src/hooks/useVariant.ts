import { useState, useEffect } from 'react'
import { EXPERIMENTS } from '../utils/experiments'
import type { ExperimentId, VariantOf } from '../utils/experiments'
import { track } from '../utils/analytics'

const STORAGE_KEY = 'meridian_experiments'

function getStored(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function pickVariant(id: ExperimentId): string {
  const exp = EXPERIMENTS[id] as import('../utils/experiments').ExperimentConfig
  const weights = exp.weights ?? exp.variants.map(() => 1 / exp.variants.length)
  let r = Math.random()
  for (let i = 0; i < exp.variants.length; i++) {
    r -= weights[i]
    if (r <= 0) return exp.variants[i]
  }
  return exp.variants[exp.variants.length - 1]
}

// Assigns a variant on first visit (persisted to localStorage) and fires
// experiment_exposure once per session via sessionStorage guard.
export function useVariant<T extends ExperimentId>(experimentId: T): VariantOf<T> {
  const [variant] = useState<string>(() => {
    const stored = getStored()
    if (stored[experimentId]) return stored[experimentId]
    const assigned = pickVariant(experimentId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, [experimentId]: assigned }))
    return assigned
  })

  useEffect(() => {
    const sessionKey = `meridian_exp_${experimentId}`
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1')
      track({
        event: 'experiment_exposure',
        properties: { experiment_id: experimentId, variant },
      })
    }
  }, [experimentId, variant])

  return variant as VariantOf<T>
}
