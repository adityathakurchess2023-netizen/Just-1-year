# AI Coach Setup — do this once

Your tracker (`index.html`) now has an "AI Coach" panel: a study-plan generator,
lecturette/journal feedback, and a diet planner, all powered by real Claude.

Because your site is hosted on GitHub Pages (a static file host with no server),
it can't safely hold a secret API key — anyone could open dev tools and steal it.
So the AI calls go through a tiny middleman *you* control: a **Cloudflare Worker**.
It's free, takes about 10 minutes the first time, and you'll never touch it again
after this.

```
Your site (GitHub Pages)  →  Your Worker (holds the key)  →  Anthropic API
```

## Step 1 — Get an Anthropic API key

1. Go to https://console.anthropic.com and sign up / log in.
2. Add a small amount of credit (a few dollars covers a *lot* of usage for this —
   each request costs a fraction of a cent).
3. Go to **API Keys** → **Create Key**. Copy it somewhere safe — you won't be able
   to see it again after this screen.

## Step 2 — Install the Cloudflare CLI (Wrangler)

You need [Node.js](https://nodejs.org) installed first (any recent version).
Then, in a terminal:

```bash
npm install -g wrangler
wrangler login
```

This opens a browser tab to log into (or create) a free Cloudflare account.

## Step 3 — Deploy the worker

1. Download these two files from this same folder: `worker.js` and `wrangler.toml`.
   Put them together in a new empty folder on your computer, e.g. `ai-coach-worker/`.
2. Open a terminal in that folder and run:

```bash
wrangler secret put ANTHROPIC_API_KEY
```

Paste your Anthropic key when prompted (it won't show on screen — that's normal).

3. Deploy it:

```bash
wrangler deploy
```

4. Wrangler will print a URL like:

```
https://the-system-ai-coach.YOUR-SUBDOMAIN.workers.dev
```

**Copy that URL.**

## Step 4 — Connect it in the app

1. Open your tracker site.
2. In the **AI Coach** panel, tap **⚙ Connection**.
3. Paste the worker URL from Step 3, tap **Save**.
4. Try **Generate Today's Plan** — you should see a real schedule appear in a few
   seconds.

That's it. The connection is saved in your browser, so you only need to do this
once per device/browser.

## Optional: lock the worker to only your site

Right now `worker.js` allows requests from anywhere (`ALLOWED_ORIGIN = "*"`).
This is fine to start, but once everything works, open `worker.js`, change:

```js
const ALLOWED_ORIGIN = "*";
```

to your actual site:

```js
const ALLOWED_ORIGIN = "https://adityathakurchess2023-netizen.github.io";
```

then run `wrangler deploy` again. This stops other websites from quietly using
your worker (and your API credit) even though the key itself was never exposed
either way.

## Cost

Cloudflare Workers: free tier covers up to 100,000 requests/day — you will not
come close to this.

Anthropic API: pay-as-you-go, billed to the account you funded in Step 1. Typical
usage here (a few plan generations + feedback + diet plans per day) should run
a few cents a week at most. You can set a monthly spend cap in the Anthropic
console under **Billing** if you want a hard ceiling.

## Troubleshooting

- **"No AI connection set up yet"** → you haven't pasted the worker URL in
  ⚙ Connection yet, or you cleared it.
- **"Couldn't reach the AI right now"** → double check the worker URL has no
  typo and doesn't have a trailing slash mismatch; check
  `wrangler tail` in your worker folder to see live error logs while you retry
  in the app.
- **"Server misconfigured: ANTHROPIC_API_KEY secret is not set"** → repeat
  Step 3's `wrangler secret put ANTHROPIC_API_KEY` command and redeploy.
