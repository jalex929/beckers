// Thin event bus — compatible with GTM dataLayer (GA4 / Segment destination)

export type AssetCardContext =
  | 'homepage_featured'
  | 'homepage_recently_viewed'
  | 'assets_page'
  | 'related'

export type AnalyticsEvent =
  | { event: 'page_viewed'; properties: { page: string; path: string } }
  | {
      event: 'asset_card_clicked'
      properties: { asset_id: string; asset_type: string; asset_name: string; position: number; context: AssetCardContext }
    }
  | { event: 'filter_applied'; properties: { filter_value: string } }
  | { event: 'search_used'; properties: { query: string; result_count: number } }
  | { event: 'sort_changed'; properties: { sort_value: string } }
  | { event: 'load_more_clicked'; properties: { page_number: number; visible_count: number; total_count: number } }
  | { event: 'signup_started'; properties: { asset_id: string; asset_type: string } }
  | { event: 'signup_submitted'; properties: { asset_id: string; asset_type: string } }
  | { event: 'signup_completed'; properties: { asset_id: string; asset_type: string; signup_date: string } }
  | { event: 'signup_failed'; properties: { asset_id: string; error_message: string } }
  | {
      event: 'recommendation_clicked'
      properties: { source_asset_id: string; clicked_asset_id: string; clicked_asset_type: string; position: number }
    }
  | { event: 'recently_viewed_cleared'; properties: { item_count: number } }
  | { event: 'experiment_exposure'; properties: { experiment_id: string; variant: string } }

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export function track(analyticsEvent: AnalyticsEvent): void {
  const payload = {
    event: analyticsEvent.event,
    ...analyticsEvent.properties,
    timestamp: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push(payload)
  }

  if (import.meta.env.DEV) {
    console.log('[analytics]', analyticsEvent.event, analyticsEvent.properties)
  }
}
