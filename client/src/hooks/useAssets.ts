import { useState, useEffect } from 'react';
import type { Asset, SignupPayload, SignupResult } from '../types';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/assets')
      .then(r => r.json())
      .then(json => setAssets(json.data ?? []))
      .catch(() => setError('Failed to load assets.'))
      .finally(() => setLoading(false));
  }, []);

  return { assets, loading, error };
}

export function useAsset(id: string) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/assets/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Asset not found');
        return r.json();
      })
      .then(json => setAsset(json.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { asset, loading, error };
}

export async function submitSignup(assetId: string, payload: SignupPayload): Promise<SignupResult> {
  const res = await fetch(`/assets/${assetId}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ person: payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Signup failed');
  return json.data;
}
