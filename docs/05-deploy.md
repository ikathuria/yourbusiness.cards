# 05 — Deploy to Vercel (Milestone 8)

The repo is on GitHub (`ikathuria/yourbusiness.cards`). Vercel deploys `main`
automatically on every push, with preview deploys for branches/PRs.

## 1. Import the project
1. Go to <https://vercel.com/new> and sign in with **GitHub**.
2. Import the **`yourbusiness.cards`** repo.
3. **⚠️ Set Root Directory = `apps/web`** (this is a monorepo — the app lives there).
   Framework preset auto-detects **Next.js**; leave build/output as default.

## 2. Environment variables
Add these in the import screen (or Project → Settings → Environment Variables).
Copy the **values** from your local `apps/web/.env.local`.

**Required (the app needs these to work):**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY      # or NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Recommended:**
```
NEXT_PUBLIC_APP_URL                       # set to your Vercel URL after first deploy (see step 4)
SUPABASE_SERVICE_ROLE_KEY                 # needed once AI QR art (storage) merges; harmless to add now — keep secret
```

**Later (when those features merge):**
```
REPLICATE_API_TOKEN     # AI QR art
ANTHROPIC_API_KEY       # AI card generator
```

> Don't paste secrets into git — only into Vercel's env settings. `.env.local` stays local.

## 3. Deploy
Click **Deploy**. First build takes ~1–2 min. You'll get a URL like
`https://yourbusiness-cards.vercel.app`.

## 4. Point the app at its real URL
1. Copy the production URL (or set up the custom domain — step 6).
2. Set `NEXT_PUBLIC_APP_URL` to it (e.g. `https://yourbusiness-cards.vercel.app`),
   then **redeploy** (Deployments → ⋯ → Redeploy). This makes QR codes and OG
   share images use absolute production URLs.

## 5. Supabase production settings
In the Supabase dashboard:
- **Authentication → URL Configuration:** set **Site URL** to your Vercel URL and add it
  to **Redirect URLs** (needed if you later add OAuth/magic-link; harmless now).
- **Authentication → Providers → Email:** keep **"Confirm email" OFF** for instant demo signups.

## 6. Custom domain (optional)
Project → **Settings → Domains** → add `yourbusiness.cards`, then update the domain's
DNS at your registrar per Vercel's instructions. Update `NEXT_PUBLIC_APP_URL` to the apex
domain and redeploy.

## Notes
- Deploys come from **`main`** (verified features). Feature branches get **preview** URLs
  automatically — great for testing AI QR art before merging.
- No server to manage: Next.js routes run as Vercel functions; the DB is Supabase.
- If a build fails on Vercel, check that **Root Directory = `apps/web`** and the required
  env vars are set.
