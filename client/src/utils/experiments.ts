// Experiment registry — defines all active A/B tests and their variants.
// Variants are persisted to localStorage under 'meridian_experiments' so the
// same user gets the same variant across page reloads.

export interface ExperimentConfig {
  id: string
  variants: readonly string[]
  weights?: readonly number[] // must sum to 1; omit for equal split
}

export const EXPERIMENTS = {
  'hero-cta': {
    id: 'hero-cta',
    variants: ['control', 'explore'] as const,
    // control: "Browse the Resource Library"
    // explore: "Explore Resources"
  },
  'signup-cta': {
    id: 'signup-cta',
    variants: ['control', 'register'] as const,
    // control: "Get Access"
    // register: "Register Now"
  },
} satisfies Record<string, ExperimentConfig>

export type ExperimentId = keyof typeof EXPERIMENTS
export type VariantOf<T extends ExperimentId> = typeof EXPERIMENTS[T]['variants'][number]
