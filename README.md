# THE SYSTEM — Path to Commission

A PWA (installable web app) for SSB prep: quest/XP tracker, study timer with
customizable Pomodoro lengths, and a one-year study log.

## Deploy to GitHub Pages (no coding needed)

1. **Create a GitHub account** if you don't have one: https://github.com/signup

2. **Create a new repository**
   - Go to https://github.com/new
   - Repository name: `the-system` (or anything you like)
   - Set it to **Public** (required for free GitHub Pages)
   - Do NOT initialize with a README (we already have one)
   - Click **Create repository**

3. **Upload the files**
   - On the new repo's page, click **uploading an existing file**
   - Drag in all 4 items from this folder: `index.html`, `manifest.json`,
     `service-worker.js`, and the whole `icons` folder
   - Scroll down, click **Commit changes**

4. **Turn on GitHub Pages**
   - Go to the repo's **Settings** tab → **Pages** (left sidebar)
   - Under "Build and deployment" → Source: select **Deploy from a branch**
   - Branch: select `main`, folder `/ (root)` → **Save**
   - Wait ~1 minute, refresh the page — you'll see a green box with your live
     URL, something like:
     `https://YOUR-USERNAME.github.io/the-system/`

5. **Open that URL on your phone or laptop**
   - Android/Chrome: tap the ⋮ menu → **Install app** (or **Add to Home screen**)
   - iPhone/Safari: tap Share → **Add to Home Screen**
   - Laptop/Chrome/Edge: click the install icon (⊕) in the address bar

Once installed, it opens full-screen like a native app, works offline (the
service worker caches the app shell), and — because it's a real URL now
instead of a local file — the **same link works on every device**. Note:
each device still keeps its *own* local progress (browser storage doesn't
sync between devices automatically); use **Export Backup** inside the app
if you want to move progress from one device to another.

## Add the AI Coach (optional, ~10 minutes)

The app has a built-in AI Coach tab that can give real answers — weekly insights,
journal feedback, a live-generated 12-hour study plan, and diet suggestions —
powered by Google's Gemini. Since GitHub Pages can't hold secrets, your API key
lives in a small free **Cloudflare Worker** instead, and the app only ever talks
to that Worker (never to Google directly), so your key is never exposed publicly.

**1. Get a Gemini API key**
- Go to https://aistudio.google.com/apikey
- Sign in with a Google account, click **Create API key**
- Copy the key somewhere safe (you'll paste it once, into Cloudflare, not into the app)

**2. Create the Cloudflare Worker**
- Go to https://dash.cloudflare.com/sign-up and make a free account
- Left sidebar → **Workers & Pages** → **Create** → **Create Worker**
- Give it any name (e.g. `the-system-ai`) → **Deploy** (it'll deploy a placeholder first)
- Click **Edit code**, delete everything in the editor, and paste in the entire
  contents of `cloudflare-worker.js` (included in this folder)
- Near the top of that file, check the `ALLOWED_ORIGIN` line matches your GitHub
  Pages URL exactly (e.g. `https://adityathakurchess2023-netizen.github.io`)
- Click **Deploy** again to save your changes

**3. Add your API key as a secret**
- On the Worker's page, go to **Settings** → **Variables and Secrets**
- Click **Add** → Type: **Secret**, Name: `GEMINI_API_KEY`, Value: paste your key
- Save

**4. Copy your Worker's URL**
- On the Worker's main page you'll see a URL like
  `https://the-system-ai.yourname.workers.dev` — copy it

**5. Connect it in the app**
- Open your live site → **🧭 PLANNER** tab → **🤖 AI Coach** panel
- Click **⚙ Configure AI**, paste the Worker URL, click **Save**
- The small dot next to "AI Coach" turns green once it's connected
- Try the quick-action buttons (Weekly Insight, Journal Feedback, AI-Build
  Today's Plan, AI Diet Plan) or just type a question and hit Ask

**Cost note:** Gemini's API has a free tier that comfortably covers personal
daily use like this. Check current limits at https://ai.google.dev/pricing.
Cloudflare Workers' free tier (100,000 requests/day) is far more than you'll need.

## Updating later

Whenever you want to change something, edit the file on GitHub directly
(click the pencil icon on `index.html` in the repo), or re-upload a new
version the same way as step 3. GitHub Pages redeploys automatically within
a minute of any commit.
