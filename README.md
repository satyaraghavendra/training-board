# Training Board V3 — Deployment Guide

## Architecture
- **Hosting:** Cloudflare Pages (free, global CDN)
- **Videos:** Cloudflare R2 (free up to 10GB)
- **Database:** Supabase PostgreSQL (free up to 500MB)
- **CI/CD:** GitHub → Cloudflare Pages auto-deploy
- **Offline:** Service Worker PWA, boots without network

**Monthly cost: $0.00**

---

## Step 1 — Cloudflare R2 (Video CDN)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **R2 → Create bucket** → name it `training-board-media`
3. Upload your entire `videos/` folder (230MB)
4. **Settings → Public access** → Enable → copy the public URL
   - Looks like: `https://pub-abc123def456.r2.dev`
5. Open `js/data.js` and replace:
   ```
   const CDN_BASE = 'https://YOUR_R2_BUCKET.r2.dev';
   ```
   with your actual URL.

---

## Step 2 — Supabase Database

1. Create project at [supabase.com](https://supabase.com) (free)
2. Go to **SQL Editor** and run:

```sql
create table workout_logs (
  id           bigint generated always as identity primary key,
  profile      text not null,
  week         integer not null,
  day_id       text not null,
  completed_at timestamptz default now()
);

alter table workout_logs enable row level security;

create policy "anon insert" on workout_logs
  for insert to anon with check (true);

create policy "anon select" on workout_logs
  for select to anon using (true);
```

3. Go to **Settings → API** and copy:
   - Project URL → `https://YOUR_PROJECT_ID.supabase.co`
   - `anon` `public` key
4. Open `js/state.js` and replace:
   ```javascript
   const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
   ```

---

## Step 3 — GitHub Repository

```bash
git init
git add .
git commit -m "Training Board V3 — initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/training-board.git
git push -u origin main
```

---

## Step 4 — Cloudflare Pages

1. Cloudflare Dashboard → **Pages → Create project**
2. **Connect to Git** → select your GitHub repo
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
4. **Deploy**

Your app is live at `https://training-board.pages.dev`

Every `git push` to `main` auto-deploys in ~30 seconds.

---

## Step 5 — Add PWA Icons

Create two PNG icons and place in `/icons/`:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

Use a lime green (#C8FF3E) background with a white "TB" monogram.
Free generator: [realfavicongenerator.net](https://realfavicongenerator.net)

---

## Step 6 — Install on Devices

**Android TV:**
1. Open Chrome on TV → navigate to your Cloudflare Pages URL
2. Chrome menu → **Add to Home screen**
3. App installs natively, runs fullscreen

**Phone:**
1. Open Chrome → navigate to URL
2. Banner appears: "Add Training Board to Home Screen"
3. Tap → installed as PWA

---

## File Structure

```
TrainingBoardV3/
├── index.html          ← Shell + SW registration
├── styles.css          ← All styles
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker (offline-first)
├── _headers            ← Cloudflare Pages cache rules
├── _redirects          ← Cloudflare Pages SPA routing
├── README.md           ← This file
├── icons/
│   ├── icon-192.png    ← PWA icon (you create)
│   └── icon-512.png    ← PWA icon (you create)
└── js/
    ├── data.js         ← All program data + CDN_BASE config
    ├── audio.js        ← Web Audio engine
    ├── ui.js           ← DOM + navigation
    ├── timer.js        ← Date.now() drift-corrected timers
    ├── state.js        ← Profiles + Supabase sync + Wake Lock
    └── boot.js         ← Entry point
```

---

## Updating the Program (Future)

To add Tejaswi's Phase 4 / heavier bell data:
1. Edit `js/data.js` locally
2. `git add js/data.js && git commit -m "Add Phase 4 data" && git push`
3. Cloudflare deploys in 30 seconds
4. Both TV and phone pull new data on next SW cache refresh

---

## V3 Architecture Decisions

| Decision | Rationale |
|---|---|
| No Supabase SDK | Native `fetch()` keeps bundle at 0 extra KB |
| Videos on R2, not SW cache | 230MB would destroy device storage if SW-cached |
| localStorage as source of truth | Supabase sync is background-only — never blocks workout |
| `setInterval` at 250ms | Smoother display; `Date.now()` correction handles drift |
| `_headers` immutable for JS/CSS | Cloudflare serves from edge cache; zero origin hits |
