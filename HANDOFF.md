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
| `/ai-hiring-solutions` | `/` | the old nav's "Services", and it pitched both audiences at once. `/features` is the *hiring* features page -- each audience has its own -- so the home page, which offers both paths, is the honest target |
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

**Checked 2026-09-21: `site:staging.hirerevolution.ai` returns nothing.** The
robots file went up before any crawler got there, so there is no index to
clean up and no removal requests to file.

### 2. The DNS cutover

Today: apex and `www` are Cloudflare **CNAMEs to Hostinger**
(`hirerevolution.ai.cdn.hstgr.net`), DNS-only, resolving to Hostinger IPs.

Target: apex and `www` point at the reserved IP `159.89.242.172`.

Decided 2026-09-21: the apex goes **Cloudflare proxied (orange)** with a
Cloudflare **Origin CA certificate** on the droplet and zone SSL/TLS at
**Full (Strict)** — see item 4. That choice removes the old ordering trap.
`certbot --nginx` needed the name to already resolve to the droplet, so the
certificate could only be obtained after the DNS change, in a window where
the apex was live and the TLS was not. An Origin CA certificate is issued by
Cloudflare on request, with no domain-validation callback, so **everything on
the droplet can be prepared and tested before any public DNS changes.**

1. Add the six redirects and deploy. *(Done 2026-09-21.)*
2. **On the droplet, before touching DNS:** add an nginx server block for
   `hirerevolution.ai` and `www.hirerevolution.ai`, and install a Cloudflare
   Origin CA certificate for both names.

   There is no server block for either name today — the only `server_name` on
   the box is `staging.hirerevolution.ai`, which is why a request arriving
   with `Host: hirerevolution.ai` currently falls through to nginx's stock
   default server and gets a 404. That is expected, not a fault. **Put both
   names on the block**, or `www` will resolve to the droplet and still
   answer 404 from the default server.

   Copy the `proxy_set_header` lines from the existing staging block —
   especially `X-Forwarded-For $proxy_add_x_forwarded_for`. Cloudflare puts
   the real visitor IP at the front of that header and `clientIp()` in
   `lib/rate-limit.ts` reads the first entry, so the per-IP limits and
   Turnstile keep seeing real addresses. `verifyTurnstile` sends that IP to
   siteverify as `remoteip`, so getting this wrong fails every JD submission,
   not just the rate limiting.

   Leave staging alone: it stays unproxied on Let's Encrypt, and its certbot
   renewal must keep working. Only the apex moves to the Origin CA cert, and
   that one does not renew through certbot at all.

   Test it before the DNS change, with `--resolve` standing in for DNS:

   ```
   curl -k --resolve hirerevolution.ai:443:159.89.242.172 https://hirerevolution.ai/
   curl -k --resolve hirerevolution.ai:443:159.89.242.172 https://hirerevolution.ai/robots.txt
   ```

   `-k` because an Origin CA certificate is trusted by Cloudflare, not by your
   machine — that is normal, and is exactly why the zone must be Full
   (Strict). The second command is also the first chance to see `robots.ts`
   take its `Allow: /` branch: it decides on the `Host` header, so until this
   server block exists there is no way to reach that branch on the droplet.
3. **Put the production environment on the droplet and rebuild.** Details
   below — skipping this ships a site whose every Log in button leads to a
   Cloudflare Access wall.
4. Point apex + `www` at `159.89.242.172` **and set both to proxied (orange)
   in the same change**. The grey-cloud rule in Traps only protects
   Hostinger's certificate renewal while Hostinger still serves the apex; the
   moment these records move to the droplet that no longer applies. Do not
   land them grey as an intermediate step — with an Origin CA certificate a
   grey-clouded apex serves a certificate browsers do not trust, so you would
   be creating the exact outage you are trying to avoid.
5. Verify through Cloudflare: both names over HTTPS with a valid public
   certificate; the six legacy redirects, the three rename redirects and the
   legal 308s; `curl https://hirerevolution.ai/robots.txt` now says
   `Allow: /` and advertises the sitemap; and click **Log in**, **Start
   free** and submit a JD through `/offers/submit-job-description` — those
   three exercise what step 3 changed and nothing else does.

   Then check Cloudflare itself: SSL/TLS is **Full (Strict)** (Flexible
   causes redirect loops against a `--redirect` origin), and a cache rule
   bypasses `/api/*`. Leave Rocket Loader and JS minification **off** — they
   rewrite script loading and can break React hydration.
6. Only then decommission the Hostinger site.

#### Step 3 in full: the droplet is still pointed at dev

The droplet builds from `.env.production.local`, which today holds the **dev**
values. `config/.env.prod` in this repo has the right ones and is correct as
written, including both apex names in the Turnstile list. It is gitignored and
holds the service user's password, so move it out of band — scp it, do not
paste it anywhere.

| | on the droplet now | `.env.prod` has |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://app-dev.hirerevolution.ai` | `https://app.hirerevolution.ai` |
| `APP_API_URL` | `https://api-dev.hirerevolution.ai` | `https://api.hirerevolution.ai` |
| `SITE_ORIGIN` | `https://staging.hirerevolution.ai` | `https://hirerevolution.ai` |
| `TURNSTILE_HOSTNAMES` | `staging.hirerevolution.ai` | `hirerevolution.ai,www.hirerevolution.ai` |
| `FIREBASE_WEB_API_KEY`, `WEBSITE_SUBMITTER_PASSWORD` | dev values | prod values |

Two reasons this cannot wait until after launch:

**`NEXT_PUBLIC_APP_URL` is inlined at build time**, not read at runtime, so
changing the file is not enough — the droplet has to `npm run build` again.
Until it does, every "Log in" and "Start free" on the public site points at
`app-dev.hirerevolution.ai`, which sits behind Cloudflare Access. Real
visitors would meet an Access gate on the primary conversion path, and
nothing about the page looks broken until someone clicks.

**Turnstile validates the hostname.** `verifyTurnstile` in `lib/turnstile.ts`
rejects any token whose hostname is not in `TURNSTILE_HOSTNAMES`, so with the
dev value every real JD submission from the apex is refused.

**This is one build for both names.** nginx will serve `hirerevolution.ai`
and `staging.hirerevolution.ai` from the same PM2 process and the same
compiled bundle, so the switch is not scoped to the apex:

- staging starts talking to the **production** app and API too. There is no
  longer a dev-pointed environment on this box — that is really the decision
  in item 4 below, arriving whether or not it was made deliberately.
- the JD form on `staging.hirerevolution.ai` **stops working**, because the
  prod Turnstile list does not include that hostname. If you want staging's
  form to keep working, append `,staging.hirerevolution.ai` to
  `TURNSTILE_HOSTNAMES` when you copy the file.

Keeping a genuinely separate dev-pointed staging means a second droplet with
its own build, not a second server block.

### 3. Tell the app the contact-sales page exists

In `ai-hr-chatbot`, `backend/services/website_offer_config.py` reads
`WEBSITE_CONTACT_SALES_URL` and falls back to `mailto:sales@hirerevolution.ai`
because the live site had no such page. Once the new site is on the apex, set
it to `https://hirerevolution.ai/contact-sales` in the app's prod (and dev and
demo) environments. The docstring in that file says the same thing.

### 4. Is "staging" production? — **decided 2026-09-21**

The droplet is a single 1 vCPU / 1 GB box with no redundancy. The decision:
**keep PM2 at one instance and put Cloudflare proxied in front of the apex.**
No second droplet.

Why not two PM2 instances on this box, which was the other way to get
zero-downtime deploys: `lib/rate-limit.ts` keeps its counters in a
module-level `Map` and says so in its docstring — a second process gets its
own copy, so every public limit roughly doubles (3 submissions per IP per day
becomes about 6 on `/api/submit-jd`, `/api/contact-sales` and
`/api/demo-link`) with nothing logged to tell you. On top of that,
`max_memory_restart` is **per instance**, so two of them allow 800 MB on a
1 GB box that also runs nginx and, during each deploy, `npm run build`. And
two Node processes on one vCPU share one core, so there is no throughput to
gain. Revisit only after resizing the droplet, and fix the rate limiter in
the same change.

Note the rebuild in cutover step 3 leaves no dev-pointed environment on this
box: one build serves both `hirerevolution.ai` and
`staging.hirerevolution.ai`. Keeping a real dev-pointed staging means a
second droplet.

#### What proxying does and does not buy

Caching is now safe in a way it was not before 2026-09-21: the home page used
to redirect returning job seekers to `/job-seekers` based on a cookie, so `/`
varied per visitor. That is gone — `/` is the same response for everyone, and
the only cookie-setting responses are the `?for=` 307s, which Cloudflare will
not cache because they carry `Set-Cookie`.

**Origin hiding will not work as long as `staging.hirerevolution.ai` stays
unproxied on the same address.** Locking the origin to Cloudflare's IP ranges
is what makes proxying hide anything, and that would take staging down with
it, because staging resolves straight to the reserved IP by design. So either
accept that the origin stays reachable — and treat proxying as a
caching/WAF/TLS change only — or move staging behind Cloudflare too (proxied,
or Access like `app-dev`). Decide this deliberately; do not assume the origin
is hidden just because the apex is orange.

While the origin is reachable, `X-Forwarded-For` is spoofable by anyone who
hits it directly with a `Host` header, which is a way around the per-IP rate
limits. That is already true today; proxying does not make it worse, but it
does not fix it either.

## Traps

**Cloudflare proxying and Hostinger SSL.** While Hostinger still serves the
apex, the apex and `www` records **must stay DNS-only (grey cloud)**. Proxying
them makes Hostinger's connection check fail, which silently stops Let's
Encrypt renewal; the cert then expires ~90 days later and the site 526/525s.
This has already happened once — down 2026-08-17 to 2026-08-25. The current
Hostinger cert expires **2026-11-23**, renewal window opens ~2026-10-24, so
there is a real deadline: cut over before then, or make sure the records are
still grey when that window opens.

*After* the cutover this constraint disappears: the apex goes proxied on
purpose (item 4), and the Origin CA certificate it uses is issued on request
rather than domain-validated, so there is no renewal that proxying can break.
The grey-cloud rule is therefore a **pre-cutover** rule only, and step 4 of
the sequence above flips the records and the orange cloud together.

Two names keep their own arrangements. `staging.hirerevolution.ai` stays
**unproxied** on Let's Encrypt, and its `certbot --nginx` renewal must keep
working — do not proxy it while that is true, or you recreate the Hostinger
failure on the droplet. `app-dev.hirerevolution.ai` stays proxied behind
Cloudflare Access. Zone SSL/TLS stays **Full (Strict)** throughout; Flexible
against an origin that redirects to HTTPS is an infinite redirect loop.

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
