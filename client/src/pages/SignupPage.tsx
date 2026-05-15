import { useState, useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useAsset, useAssets, submitSignup } from '../hooks/useAssets'
import { recordView } from '../hooks/useRecentlyViewed'
import AssetBadge from '../components/AssetBadge'
import AssetCard from '../components/AssetCard'
import styles from './SignupPage.module.css'
import type { SignupPayload, SignupResult } from '../types'

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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

  const [form, setForm] = useState<SignupPayload>(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState<Partial<SignupPayload>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SignupResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
    try {
      const data = await submitSignup(id, form)
      setResult(data)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field: keyof SignupPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (fieldErrors[field]) setFieldErrors(fe => ({ ...fe, [field]: undefined }))
    }
  }

  const related = asset
    ? allAssets.filter(a => a.id !== asset.id && a.assetType === asset.assetType).slice(0, 2)
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
                <time className={styles.date}>{formatDate(asset.executionDate)}</time>
              )}
            </div>
            <h1 className={styles.assetTitle}>{asset.name}</h1>
            <p className={styles.assetDescription}>{asset.description}</p>
            {asset.sponsorName && (
              <p className={styles.sponsor}>Sponsored by <strong>{asset.sponsorName}</strong></p>
            )}
            {asset.speakers && asset.speakers.length > 0 && (
              <div className={styles.speakers}>
                <h3 className={styles.speakersLabel}>Speakers</h3>
                <ul className={styles.speakerList}>
                  {asset.speakers.map((s, i) => (
                    <li key={i} className={styles.speaker}>
                      <span className={styles.speakerName}>{s.name}</span>
                      {(s.title || s.company) && (
                        <span className={styles.speakerRole}>
                          {[s.title, s.company].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {asset.expirationDate && (
              <p className={styles.expiry}>Access expires {formatDate(asset.expirationDate)}</p>
            )}
          </aside>

          {/* Form / Success */}
          <div className={styles.formPanel}>
            {result ? (
              <div className={styles.success}>
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
                      {related.map(a => <AssetCard key={a.id} asset={a} />)}
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
                      className={`${styles.input} ${fieldErrors.firstName ? styles.inputError : ''}`}
                      autoComplete="given-name"
                    />
                    {fieldErrors.firstName && <span className={styles.fieldError}>{fieldErrors.firstName}</span>}
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
                    />
                    {fieldErrors.lastName && <span className={styles.fieldError}>{fieldErrors.lastName}</span>}
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
                  />
                  {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
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
                  />
                  {fieldErrors.jobTitle && <span className={styles.fieldError}>{fieldErrors.jobTitle}</span>}
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
                  />
                  {fieldErrors.companyName && <span className={styles.fieldError}>{fieldErrors.companyName}</span>}
                </div>

                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                  {submitting ? 'Submitting…' : 'Get Access'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
