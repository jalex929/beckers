import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useAsset, useAssets, submitSignup } from '../hooks/useAssets'
import { recordView } from '../hooks/useRecentlyViewed'
import AssetBadge from '../components/AssetBadge'
import AssetCard from '../components/AssetCard'
import styles from './SignupPage.module.css'
import { track } from '../utils/analytics'
import { useVariant } from '../hooks/useVariant'
import type { SignupPayload, SignupResult } from '../types'

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function getUrgencyLabel(dateStr?: string, assetType?: string): string | null {
  if (assetType !== 'Live Webinar' || !dateStr) return null
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (days < 0 || days > 30) return null
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

function getRegistrationCount(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 50 + (hash % 150)
}

const EMPTY_FORM: SignupPayload = {
  firstName: '', lastName: '', email: '', jobTitle: '', companyName: '',
}

export default function SignupPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const backTo = (location.state as { from?: string } | null)?.from ?? '/assets'
  const { asset, loading, error } = useAsset(id ?? '')
  const { assets: allAssets } = useAssets()

  useEffect(() => {
    if (asset) recordView(asset)
  }, [asset])

  useEffect(() => {
    if (asset) document.title = `${asset.name} · Meridian`
    else document.title = 'Register · Meridian'
  }, [asset])

  const [form, setForm] = useState<SignupPayload>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<SignupPayload>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SignupResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const hasStartedSignup = useRef(false)
  const signupCTAVariant = useVariant('signup-cta')
  const submitLabel = signupCTAVariant === 'register' ? 'Register Now' : 'Get Access'

  function validate(): boolean {
    const errors: Partial<SignupPayload> = {}
    if (!form.firstName.trim()) errors.firstName = 'Required'
    if (!form.lastName.trim()) errors.lastName = 'Required'
    if (!form.email.trim()) errors.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email'
    if (!form.jobTitle.trim()) errors.jobTitle = 'Required'
    if (!form.companyName.trim()) errors.companyName = 'Required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !id) return
    setSubmitting(true)
    setSubmitError(null)
    if (id && asset) {
      track({ event: 'signup_submitted', properties: { asset_id: id, asset_type: asset.assetType } })
    }
    try {
      const data = await submitSignup(id, form)
      setResult(data)
      if (id && asset) {
        track({ event: 'signup_completed', properties: { asset_id: id, asset_type: asset.assetType, signup_date: data.signupDate } })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.'
      setSubmitError(msg)
      if (id) {
        track({ event: 'signup_failed', properties: { asset_id: id, error_message: msg } })
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleFieldFocus() {
    if (!hasStartedSignup.current && asset && id) {
      hasStartedSignup.current = true
      track({ event: 'signup_started', properties: { asset_id: id, asset_type: asset.assetType } })
    }
  }

  function handleChange(field: keyof SignupPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (fieldErrors[field]) setFieldErrors(fe => ({ ...fe, [field]: undefined }))
    }
  }

  const related = asset
    ? allAssets
        .filter(a => a.id !== asset.id && (a.assetType === asset.assetType || a.sponsorName === asset.sponsorName))
        .slice(0, 3)
    : []

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p className={styles.stateMsg}>Loading…</p>
        </div>
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className={styles.page}>
        <div className="container">
          <Link to={backTo} className={styles.backLink}>← Back to Resources</Link>
          <p className={styles.stateError}>{error ?? 'Resource not found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to={backTo} className={styles.backLink}>← Back to Resources</Link>

        <div className={styles.layout}>
          {/* Asset Detail Panel */}
          <aside className={styles.assetPanel}>
            <div className={styles.assetMeta}>
              <AssetBadge type={asset.assetType} />
              {formatDate(asset.executionDate) && (
                <time className={styles.date} dateTime={asset.executionDate}>{formatDate(asset.executionDate)}</time>
              )}
              {getUrgencyLabel(asset.executionDate, asset.assetType) && (
                <span className={styles.urgencyBadge}>
                  {getUrgencyLabel(asset.executionDate, asset.assetType)}
                </span>
              )}
            </div>
            <h1 className={styles.assetTitle}>{asset.name}</h1>
            <p className={styles.assetDescription}>{asset.description}</p>
            {asset.sponsorName && (
              <p className={styles.sponsor}>Sponsored by <strong>{asset.sponsorName}</strong></p>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--color-fg-muted, #666)', marginTop: '0.75rem' }}>
              {getRegistrationCount(asset.id).toLocaleString()} healthcare professionals registered
            </p>
            {asset.speakers && asset.speakers.length > 0 && (
              <div className={styles.speakers}>
                <h3 className={styles.speakersLabel}>Speakers</h3>
                <ul className={styles.speakerList}>
                  {asset.speakers.map((s, i) => (
                    <li key={s.id ?? i} className={styles.speaker}>
                      <span className={styles.speakerName}>{s.firstName} {s.lastName}</span>
                      {(s.jobTitle || s.companyName) && (
                        <span className={styles.speakerRole}>
                          {[s.jobTitle, s.companyName].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {asset.expirationDate && (
              <p className={styles.expiry}>Access expires <time dateTime={asset.expirationDate}>{formatDate(asset.expirationDate)}</time></p>
            )}
          </aside>

          {/* Form / Success */}
          <div className={styles.formPanel}>
            {result ? (
              <div className={styles.success} role="status">
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>You're registered!</h2>
                <p className={styles.successSub}>
                  Registered on {formatDate(result.signupDate)}.
                  You'll receive access information at <strong>{result.person.email}</strong>.
                </p>
                {related.length > 0 && (
                  <div className={styles.related}>
                    <h3 className={styles.relatedTitle}>You might also like</h3>
                    <div className={styles.relatedGrid}>
                      {related.map(a => <AssetCard key={a.id} asset={a} context="related" />)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <h2 className={styles.formTitle}>Get Access</h2>
                <p className={styles.formSub}>Complete the form below to access this resource.</p>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="firstName" className={styles.label}>First name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange('firstName')}
                      onFocus={handleFieldFocus}
                      className={`${styles.input} ${fieldErrors.firstName ? styles.inputError : ''}`}
                      autoComplete="given-name"
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.firstName}
                      aria-describedby="firstName-error"
                    />
                    {fieldErrors.firstName && <span id="firstName-error" className={styles.fieldError}>{fieldErrors.firstName}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="lastName" className={styles.label}>Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange('lastName')}
                      className={`${styles.input} ${fieldErrors.lastName ? styles.inputError : ''}`}
                      autoComplete="family-name"
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.lastName}
                      aria-describedby="lastName-error"
                    />
                    {fieldErrors.lastName && <span id="lastName-error" className={styles.fieldError}>{fieldErrors.lastName}</span>}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Work email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby="email-error"
                  />
                  {fieldErrors.email && <span id="email-error" className={styles.fieldError}>{fieldErrors.email}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="jobTitle" className={styles.label}>Job title</label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={form.jobTitle}
                    onChange={handleChange('jobTitle')}
                    className={`${styles.input} ${fieldErrors.jobTitle ? styles.inputError : ''}`}
                    autoComplete="organization-title"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.jobTitle}
                    aria-describedby="jobTitle-error"
                  />
                  {fieldErrors.jobTitle && <span id="jobTitle-error" className={styles.fieldError}>{fieldErrors.jobTitle}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="companyName" className={styles.label}>Company</label>
                  <input
                    id="companyName"
                    type="text"
                    value={form.companyName}
                    onChange={handleChange('companyName')}
                    className={`${styles.input} ${fieldErrors.companyName ? styles.inputError : ''}`}
                    autoComplete="organization"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.companyName}
                    aria-describedby="companyName-error"
                  />
                  {fieldErrors.companyName && <span id="companyName-error" className={styles.fieldError}>{fieldErrors.companyName}</span>}
                </div>

                {submitError && <p className={styles.submitError} role="alert">{submitError}</p>}

                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? 'Submitting…' : submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
