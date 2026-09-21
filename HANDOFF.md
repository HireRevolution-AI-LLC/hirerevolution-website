# Handoff: finishing the hirerevolution.ai website

**Written:** 2026-09-20; item 1 closed out 2026-09-21. Everything below was verified against the live hosts
and the repo on that date — where a fact is a guess, it says so.

## What this project is

`hirerevolution.ai` is still served by a **Hostinger Website Builder** site.
This repo is its replacement: a Next.js 16 site, already built, already
deployed, already serving the full page set at
**https://staging.hirerevolution.ai**.

So "recreate the website" is essentially done. What is left is **cutting the
public domain over to it**, plus a short list of gaps that would lose traffic
or look sloppy on the day. This document is that list.

## Verified state, 2026-09-20

| | |
|---|---|
| Repo | `git@github.com:HireRevolution-AI-LLC/hirerevolution-website.git`, branch `main` |
| Stack | Next.js 16.3.5, React 19.2.8, Node 22. Dependencies are exactly `next`, `react`, `react-dom` |
| Staging URL | https://staging.hirerevolution.ai — **200, healthy** |
| Host | DigitalOcean droplet `hirerevolution-website-staging`, nyc3, `s-1vcpu-1gb` |
| Addresses | Droplet `104.236.9.35`; **reserved IP `159.89.242.172`** is what DNS points at. Both answer — the droplet's own IP returns nginx's 404 default server unless you send the right `Host` header. They are the same machine; this is not a stale-state bug (I checked, because it looks like one) |
| TLS | Let's Encrypt on the droplet via `certbot --nginx`, issued 2026-09-18, **expires 2026-12-17**. Not Cloudflare-terminated — `staging` resolves straight to the reserved IP |
| Serving | nginx :80/:443 → PM2 (`ecosystem.config.js`, fork mode, 1 instance, restart at 400M) → `next start -p 3000` |
| CI | `.github/workflows/deploy.yml`. **Push to `main` deploys.** SSH to `STAGING_HOST`, `git reset --hard origin/main`, `npm ci`, `npm run build`, `pm2 reload`. ~90s. Last 5 runs green |
| Secrets | GitHub repo secrets `STAGING_HOST`, `SSH_PRIVATE_KEY` |
| Infra as code | `terraform/` (OpenTofu). `terraform.tfstate` and `terraform.tfvars` exist **locally only** — both are gitignored and have never been committed (checked across all branches) |

### Pages that exist

`/` · `/about` · `/features` · `/pricing` · `/contact` · `/contact-sales` ·
`/demo` · `/job-seekers` · `/job-seekers/features` · `/job-seekers/pricing` ·
`/offers/submit-job-description` · `/accessibility` · `/fulfillment-policy`

Plus `/sitemap.xml` and `/robots.txt`, added 2026-09-21 (see below).

API routes: `/api/submit-jd`, `/api/contact-sales`, `/api/demo-link`. The API
path keeps the short `submit-jd` name — it is an internal endpoint the offer
page calls, not a URL anyone types.

`/privacy-policy`, `/privacy`, `/terms-of-service` and `/terms` 308 to the app
(`next.config.ts`) — the legal text lives on `app.hirerevolution.ai` so there
is one copy, not two.

**Renamed 2026-09-21**, before launch, while it was still free to do so — the
old paths 308 to the new ones:

| Was | Now | Why |
|---|---|---|
| `/candidates` | `/job-seekers` | every label on that side says "job seekers"; "candidate" is employer vocabulary, and the hiring copy uses it for the people employers review |
| `/digital-accessibility` | `/accessibility` | the page calls itself "Accessibility Statement"; `/accessibility` used to redirect *to* the long URL, which was backwards |
| `/offers/submit-jd` | `/offers/submit-job-description` | "JD" is recruiter jargon in a public URL |

The audience *key* is still `candidates` — it is the `hr_audience` cookie value
and the `?for=` value, so renaming it would reset the remembered choice for
everyone who already has the cookie. Only the URLs changed.

## What is actually left

### 1. Six old URLs 404 on the new site — **done 2026-09-21**

These are every non-root entry in the live site's `sitemap.xml`. All six
returned 200 on Hostinger and 404 on staging; all six now 308 in
`next.config.ts`, verified against a production build.

Three of the slugs do not describe their contents, so the targets below come
from reading each page, not from its URL:

| Old URL | Target | Why |
|---|---|---|
| `/ai-hiring-solutions` | `/features` | the old nav's "Services" |
| `/ai-hiring-solutions-pricing` | `/pricing` | |
| `/contact-ai-hiring-solutions` | `/contact` | |
| `/job-searching` | `/about` | **not a job-seeker page** — it is the About page: founder story and mission. The old nav's "About" and its "Read our story" CTA both pointed here |
| `/ai-job-applications-candidate-seeker-details` | `/features` | **employer-facing** — "Are you an employer looking to attract the right candidates faster?", "Empowering Employers". "candidate-seeker" means one who seeks candidates |
| `/ai-job-applications-seeker-details` | `/candidates/features` | the genuinely job-seeker-facing one: resume matching, cover letters, applicant database |

The last two share the title "Revolutionizing AI Job Applications with AI
Technology" and so look like near-duplicates in the sitemap. They are not —
they address opposite audiences, and an earlier draft of this document guessed
both wrong on that basis. `/demo`, `/fulfillment-policy` and
`/digital-accessibility` are in the old sitemap too and already exist here at
the same paths.

If the Hostinger site is edited again before the cutover, re-check with
`curl -sS https://hirerevolution.ai/sitemap.xml`.

### 1b. Search engines — **done 2026-09-21**

The site shipped no `sitemap.xml` and no `robots.txt`, and staging returned 200
to any crawler with no `X-Robots-Tag` — so `staging.hirerevolution.ai` was free
to index and would have competed with the apex for the same copy once it went
live.

Both now exist. `app/robots.ts` reads the `Host` header, so one build answers
`Allow: /` on `hirerevolution.ai` and `www`, and `Disallow: /` everywhere else
including staging. `app/sitemap.ts` lists the 13 indexable pages from
`lib/site.ts`, always at the production origin, hiring pages ranked above the
job-seeker ones. Redirects and API routes are deliberately not in it.

Worth confirming after the cutover that staging has not already been indexed:
search `site:staging.hirerevolution.ai`.

### 2. The DNS cutover

Today: apex and `www` are Cloudflare **CNAMEs to Hostinger**
(`hirerevolution.ai.cdn.hstgr.net`), DNS-only, resolving to Hostinger IPs.

Target: apex and `www` point at the reserved IP `159.89.242.172`.

Order matters, because certbot cannot issue for a name that does not yet
resolve to the droplet:

1. Add the six redirects and deploy. *(Done — they just need to be live
   on the droplet before the DNS change.)*
2. Point apex + `www` at `159.89.242.172` (A record for the apex; A or CNAME
   for `www`). Keep them **DNS-only / grey cloud** — see Traps.
3. On the droplet, issue certs for both names:
   `certbot --nginx -d hirerevolution.ai -d www.hirerevolution.ai --redirect`
4. Verify both over HTTPS, and verify the six redirects and the legal 308s.
5. Only then decommission the Hostinger site.

### 3. Tell the app the contact-sales page exists

In `ai-hr-chatbot`, `backend/services/website_offer_config.py` reads
`WEBSITE_CONTACT_SALES_URL` and falls back to `mailto:sales@hirerevolution.ai`
because the live site had no such page. Once the new site is on the apex, set
it to `https://hirerevolution.ai/contact-sales` in the app's prod (and dev and
demo) environments. The docstring in that file says the same thing.

### 4. Decide whether "staging" is production

The droplet is named `...-staging` and is a **single 1 vCPU / 1 GB box with one
PM2 instance and no redundancy**. That is a fine marketing site and a poor
production story. Before the cutover, decide deliberately whether to:

- promote it as-is and accept that a reboot is downtime (cheapest, defensible
  for a marketing site), or
- put Cloudflare **proxied** in front of the apex for caching and origin
  hiding, which changes the TLS story (see Traps), or
- stand up a second droplet behind a load balancer (probably overkill).

There is no wrong answer here, but pick one on purpose rather than by default.

## Traps

**Cloudflare proxying and Hostinger SSL.** While Hostinger still serves the
apex, the apex and `www` records **must stay DNS-only (grey cloud)**. Proxying
them makes Hostinger's connection check fail, which silently stops Let's
Encrypt renewal; the cert then expires ~90 days later and the site 526/525s.
This has already happened once — down 2026-08-17 to 2026-08-25. The current
Hostinger cert expires **2026-11-23**, renewal window opens ~2026-10-24, so
there is a real deadline: cut over before then, or make sure the records are
still grey when that window opens.

*After* the cutover this constraint disappears with Hostinger — but it is
replaced by a new one: the droplet's certbot also needs the name to resolve to
it, so if you later switch the apex to Cloudflare **proxied**, use an origin
certificate and Full (Strict), and stop relying on `certbot --nginx` renewal.
`app-dev.hirerevolution.ai` is a separate record, stays proxied with Cloudflare
Access, and zone SSL/TLS should remain Full (Strict) throughout.

Do **not** accept Hostinger's prompt to move nameservers to
`ns1/ns2.dns-parking.com`; that removes Cloudflare from the picture entirely.

**The OpenTofu state is local and unbacked.** `terraform/terraform.tfstate`
and `terraform.tfvars` are gitignored and exist only on this laptop, so the
state describing the live droplet has no backup and no remote. The tfvars file
holds a DigitalOcean API token — do not commit it, and do not paste it
anywhere. Treat a `tofu apply` as capable of destroying the running droplet:
read the plan. The reserved IP is a separate resource from the droplet, so
losing the droplet does not lose the address.

**Pushing to `main` deploys.** There is no staging-of-staging. A doc-only
commit still runs a full build and `pm2 reload`.

**Next.js 16 is not the Next.js most training data knows.** `AGENTS.md` says
to read `node_modules/next/dist/docs/` before writing code, and that the
`<!-- BEGIN:nextjs-agent-rules -->` block in it is regenerated by `next dev` —
commit it with your work rather than trying to remove it.

## Working in this repo

```bash
cd ~/PycharmProjects/hr-marketing-website
npm install
npm run dev     # http://localhost:3000
npm run build   # what CI runs; make it pass before pushing
npm run lint
```

Environment variables the app code reads: `APP_API_URL`, `DEMO_API_URL`,
`NEXT_PUBLIC_APP_URL`, `SITE_ORIGIN`, `WEBSITE_SUBMITTER_EMAIL`,
`WEBSITE_SUBMITTER_PASSWORD`, `FIREBASE_WEB_API_KEY`,
`FIREBASE_AUTH_EMULATOR_HOST`, `TURNSTILE_SECRET`, `TURNSTILE_HOSTNAMES`.
These live on the droplet, not in the repo — read them there before changing
anything that depends on them.

`/offers/submit-jd` posts to the same app endpoint the "Create Job Description"
button uses in `app.hirerevolution.ai/add-jd`, behind Turnstile and a per-IP
rate limit; the app re-checks everything. There is a `turnstile-spin` skill in
`.claude/skills/` for Turnstile work.

## Related reading

- `INFRASTRUCTURE.md` — the original OpenTofu + GitHub Actions build-out
- `DEPLOY_NOW.md` — the five-step first deploy, already done; useful as a record
- `DEPLOYMENT.md`
- In `ai-hr-chatbot`: `backend/services/website_offer_config.py` for the JD
  offer limits and the contact-sales URL
