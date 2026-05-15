import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAsset, useAssets, submitSignup } from '../hooks/useAssets';
import AssetBadge from '../components/AssetBadge';
import AssetCard from '../components/AssetCard';
import type { SignupRecord } from '../types';
import styles from './SignupPage.module.css';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });
}

export default function SignupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { asset, loading, error: assetError } = useAsset(id ?? '');
  const { assets } = useAssets();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', jobTitle: '', companyName: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<SignupRecord | null>(null);

  const related = assets
    .filter(a => a.id !== id && (a.assetType === asset?.assetType || a.sponsorName === asset?.sponsorName))
    .slice(0, 3);

  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.jobTitle.trim()) errs.jobTitle = 'Required';
    if (!form.companyName.trim()) errs.companyName = 'Required';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      const result = await submitSignup(id!, form);
      setConfirmation(result);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function field(name: keyof typeof form, label: string, type = 'text') {
    return (
      <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        <input
          type={type}
          className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
          value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          autoComplete={name === 'email' ? 'email' : 'off'}
        />
        {errors[name] && <span className={styles.fieldError}>{errors[name]}</span>}
      </div>
    );
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.skeletonWrap}>
            <div className={styles.skeleton} style={{ height: 320 }} />
            <div className={styles.skeleton} style={{ height: 480 }} />
          </div>
        </div>
      </main>
    );
  }

  if (assetError || !asset) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <div className={styles.notFoundTitle}>Resource not found</div>
            <p>This resource may no longer be available.</p>
            <Link to="/assets" className={styles.backBtn}>← Back to all resources</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.back}>
          <button className={styles.backLink} onClick={() => navigate(-1)}>← Back to resources</button>
        </div>

        <div className={styles.layout}>
          {/* Asset summary panel */}
          <aside className={styles.panel}>
            <div className={styles.panelHead}>
              <AssetBadge type={asset.assetType} />
              {asset.executionDate && (
                <div className={styles.panelDate}>
                  {formatDateTime(asset.executionDate)}
                </div>
              )}
            </div>

            <h1 className={styles.panelTitle}>{asset.name}</h1>
            <p className={styles.panelDesc}>{asset.description}</p>

            <div className={styles.panelMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Sponsor</span>
                <span className={styles.metaValue}>{asset.sponsorName}</span>
              </div>
              {asset.expirationDate && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Available through</span>
                  <span className={styles.metaValue}>{formatDate(asset.expirationDate)}</span>
                </div>
              )}
            </div>

            {asset.speakers && asset.speakers.length > 0 && (
              <div className={styles.speakers}>
                <div className={styles.speakersLabel}>Featuring</div>
                {asset.speakers.map(s => (
                  <div key={s.id} className={styles.speaker}>
                    <div className={styles.speakerAvatar}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <div className={styles.speakerName}>{s.firstName} {s.lastName}</div>
                      <div className={styles.speakerRole}>{s.jobTitle}, {s.companyName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Form / Confirmation */}
          <div className={styles.formWrap}>
            {confirmation ? (
              <div className={styles.confirmation}>
                <div className={styles.confirmIcon}>✓</div>
                <h2 className={styles.confirmTitle}>You're registered!</h2>
                <p className={styles.confirmText}>
                  Thank you, <strong>{confirmation.person.firstName}</strong>. Your registration for{' '}
                  <em>{asset.name}</em> was confirmed on{' '}
                  {formatDateTime(confirmation.signupDate)}.
                </p>
                <div className={styles.confirmMeta}>
                  <span>Confirmation #{confirmation.id.slice(0, 8).toUpperCase()}</span>
                  <span>Sent to {confirmation.person.email}</span>
                </div>
                <Link to="/assets" className={styles.confirmBack}>Browse more resources →</Link>

                {related.length > 0 && (
                  <div className={styles.related}>
                    <div className={styles.relatedLabel}>You might also like</div>
                    <div className={styles.relatedGrid}>
                      {related.map(a => <AssetCard key={a.id} asset={a} />)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={styles.formHead}>
                  <h2 className={styles.formTitle}>Register for free access</h2>
                  <p className={styles.formSub}>All fields are required.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.fieldRow}>
                    {field('firstName', 'First name')}
                    {field('lastName', 'Last name')}
                  </div>
                  {field('email', 'Work email', 'email')}
                  {field('jobTitle', 'Job title')}
                  {field('companyName', 'Company name')}

                  {apiError && (
                    <div className={styles.apiError}>{apiError}</div>
                  )}

                  <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Register now'}
                  </button>

                  <p className={styles.disclaimer}>
                    By registering, you agree to receive communications from Becker's Healthcare.
                    You can unsubscribe at any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
