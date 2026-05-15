# Deployment Guide

Meridian uses two services:

| Layer | Service | What it runs |
|---|---|---|
| Backend API | Railway | Express + TypeScript (`npm run build && npm start`) |
| Frontend | Netlify | React + Vite (`client/` → `client/dist/`) |

The frontend proxies `/assets/*` to Railway via a Netlify redirect rule, so the browser only ever talks to the Netlify domain. No CORS configuration is needed under normal circumstances.

---

## 1. Deploy the backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project → Deploy from GitHub repo** → select `jalex929/beckers`.
3. Railway auto-detects Node.js and runs:
   - `npm install`
   - `npm run build` (compiles TypeScript → `dist/`)
   - `npm start` (runs `node dist/server.js`)
4. Once deployed, open **Settings → Networking → Generate Domain**.
5. Copy the URL — it will look like `https://beckers-production-xxxx.up.railway.app`.

Railway sets the `PORT` environment variable automatically. No manual configuration needed.

---

## 2. Wire the backend URL into Netlify

Open `netlify.toml` in the project root and replace the placeholder in the redirect rule:

```toml
[[redirects]]
  from   = "/assets/*"
  to     = "https://REPLACE_WITH_RAILWAY_URL/assets/:splat"  # ← replace this
  status = 200
  force  = true
```

Replace `https://REPLACE_WITH_RAILWAY_URL` with your Railway URL, e.g.:

```toml
  to = "https://beckers-production-xxxx.up.railway.app/assets/:splat"
```

Commit and push:

```bash
git add netlify.toml
git commit -m "Set Railway backend URL for Netlify proxy"
git push origin main
```

---

## 3. Deploy the frontend to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in with GitHub.
2. **Add new site → Import an existing project → GitHub** → select `jalex929/beckers`.
3. Netlify reads `netlify.toml` automatically. Confirm the settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**.

The first deploy will fail if step 2 hasn't been done yet (Railway URL is still the placeholder). Complete step 2 first, or trigger a redeploy after updating `netlify.toml`.

---

## Local development (unchanged)

```bash
# Terminal 1 — backend
npm run dev          # Express on http://localhost:3000

# Terminal 2 — frontend
npm run dev:client   # Vite on http://localhost:5173
                     # /assets/* proxied to localhost:3000 automatically
```

No `.env` files are needed for local development.

---

## Bolt.new compatibility

Bolt pushes changes to the GitHub repo → Netlify detects the push and redeploys the frontend automatically. No additional configuration is needed on Bolt's side.

The `netlify.toml` and `DEPLOY.md` files are not edited by Bolt. If Bolt introduces a UI change that needs to be reflected in the live site, push from Bolt → GitHub → Netlify picks it up within ~30 seconds.

---

## Troubleshooting

**API calls return 404 on the live site**
The Railway URL in `netlify.toml` is still the placeholder. Complete step 2.

**API calls return 404 in development**
The Express backend isn't running. Start it with `npm run dev` in the project root.

**Netlify build fails**
Check that the base directory is set to `client` in Netlify's build settings (it reads from `netlify.toml` but the UI can override it).

**Railway deploy fails**
Confirm `npm run build` compiles without errors locally: `cd` to the project root and run `npm run build`. Fix any TypeScript errors before pushing.
