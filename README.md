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

## Updating later

Whenever you want to change something, edit the file on GitHub directly
(click the pencil icon on `index.html` in the repo), or re-upload a new
version the same way as step 3. GitHub Pages redeploys automatically within
a minute of any commit.
