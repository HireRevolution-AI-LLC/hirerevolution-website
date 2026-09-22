# Handoff: finishing the hirerevolution.ai website

**Written:** 2026-09-20; items 1, 1b and 5 closed and cutover steps 2-3
prepared 2026-09-21. Everything below was verified against the live hosts
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
| TLS | `staging`: Let's Encrypt via `certbot --nginx`, expires 2026-12-17, not Cloudflare-terminated. Apex + `www`: own block with a key and CSR at `/etc/ssl/hirerevolution/`, currently serving a **self-signed placeholder** — see cutover step 2 |
| Serving | nginx :80/:443 → PM2 (`ecosystem.config.js`, fork mode, 1 instance, restart at 400M) → `next start -p 3000`. PM2 runs as the unprivileged **`deploy`** user (`pm2-deploy.service`), not root |
| CI | `.github/workflows/deploy.yml`. **Push to `main` deploys.** SSH to `STAGING_HOST` **as `deploy`**, `git reset --hard origin/main`, `npm ci`, `npm run build`, `pm2 reload`. ~90s. Last 5 runs green |
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

Target: apex and `www` point at the reserved IP `159.89.242.172`, proxied,
and `staging.hirerevolution.ai` no longer exists.

**Decided 2026-09-21: staging is retired at the cutover, not kept.** There is
one droplet, one PM2 process and one build; "staging" was only ever a second
name pointed at it, and after step 3 below it is not even a different
environment. Retiring the name is what makes step 7 possible, and it removes
the certbot renewal the rest of this plan had to work around. A genuine
pre-production environment, if one is wanted later, is a second droplet with
its own build — see item 4.

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
   Origin CA certificate for both names. — **done 2026-09-21.**

   `/etc/nginx/sites-available/hirerevolution.ai` (symlinked into
   `sites-enabled`) now serves both names on 443 and 301s port 80 to HTTPS.
   A 2048-bit key and a CSR covering both names were generated **on the
   droplet**, so the private key has never left it:
   `/etc/ssl/hirerevolution/origin.{key,csr}`.

   The Cloudflare Origin CA certificate is installed, issued from that CSR
   for exactly `hirerevolution.ai` and `www.hirerevolution.ai` — no wildcard,
   so a compromise here cannot produce a valid origin certificate for `app`,
   `api` or any other subdomain. It expires **2041-09-18** and does not renew
   through certbot, so there is no renewal that proxying can break. Verified:
   both names present it over TLS, its public key matches `origin.key`, and
   staging still presents its own Let's Encrypt certificate.

   Replace it, if it ever needs replacing, with
   `scripts/install-origin-cert.sh <pem>`. That script refuses a non-PEM, an
   issuer that is not `CloudFlare Origin SSL Certificate Authority`, and a
   certificate whose public key does not match the droplet's key; it rolls
   back if nginx will not load the new file.

   **Do not install it with `ssh host 'cat > origin.crt'`.** The redirect
   truncates the file the moment it opens, so an interrupted paste leaves an
   empty certificate — nginx keeps serving from memory but `nginx -t` fails,
   which means the next reload *or reboot* takes the site down, with nothing
   visibly wrong until then. This happened on 2026-09-21; recovery was
   regenerating the placeholder from the CSR and the key, which survive
   because they are separate files.

   Staging's block is untouched and stays that way — it is how you compare
   before and after, and it is the fallback if the apex misbehaves. It keeps
   its Let's Encrypt certificate until step 7 deletes both. Only the apex uses
   the Origin CA cert, and that one does not renew through certbot at all.

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
3. **Put the production environment on the droplet and rebuild.** —
   **done 2026-09-21.** `scripts/push-env.sh prod` wrote `config/.env.prod`
   to the droplet (the previous dev file is kept beside it as
   `.env.production.local.dev-backup-2026-09-21`, mode 600) and the site was
   rebuilt, so `NEXT_PUBLIC_APP_URL` is inlined as `app.hirerevolution.ai`.
   Verified: no `app-dev` reference survives on any page, and `/pricing`
   renders real plan prices fetched from the **prod** API. Details below.
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
   three exercise what step 3 changed and nothing else does. The JD
   submission is also the only way to find out whether the Turnstile widget's
   hostname allowlist was updated; a token that never arrives looks like a
   form that simply will not submit.

   Then check Cloudflare itself: SSL/TLS is **Full (Strict)** (Flexible
   causes redirect loops against a `--redirect` origin), and a cache rule
   bypasses `/api/*`. Leave Rocket Loader and JS minification **off** — they
   rewrite script loading and can break React hydration.
6. Only then decommission the Hostinger site.
7. **Retire staging and close the origin.** Once the apex has served for a
   day or two and you have stopped wanting a rollback:

   - delete the `staging` record in Cloudflare DNS;
   - on the droplet, remove its nginx server block, `nginx -t`,
     `systemctl reload nginx`, then
     `certbot delete --cert-name staging.hirerevolution.ai`;
   - drop the name from anywhere it is still configured (`TURNSTILE_HOSTNAMES`
     in `config/.env.prod`, the `STAGING_HOST` secret's *name* is cosmetic and
     can stay — it holds the reserved IP, which does not change).

   With no public name resolving to the reserved IP, the origin can finally be
   closed: narrow the `80` and `443` `inbound_rule` blocks in
   `terraform/main.tf` from `0.0.0.0/0` to Cloudflare's published ranges
   (<https://www.cloudflare.com/ips/>) and `tofu apply` — **read the plan
   first**, and leave port 22 alone or you lock yourself out.

   This is the step that makes proxying worth anything. Until it happens
   anyone can skip Cloudflare by hitting `159.89.242.172` with a `Host:`
   header, which bypasses the WAF and lets them write whatever they like into
   `X-Forwarded-For` — the header both the per-IP rate limits and Turnstile's
   `remoteip` are read from.

#### Step 3 in full: the droplet is still pointed at dev

Kept as the record of what changed and why, since it is also the rollback
procedure: `cp .env.production.local.dev-backup-2026-09-21
.env.production.local`, rebuild, reload. `config/.env.prod` is gitignored and
holds the service user's password — move it with `scripts/push-env.sh`, never
paste it anywhere.

| | on the droplet before | `.env.prod`, now live |
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
dev value every real JD submission from the apex would be refused. Now set to
`hirerevolution.ai,www.hirerevolution.ai`.

**One Turnstile check is still outstanding, and it is not in this repo.**
There is a single widget for both environments — `config/.env.dev` and
`config/.env.prod` hold the *same* `TURNSTILE_SECRET` (compared by hash), and
the sitekey is hardcoded in `app/components/Turnstile.tsx`, so the pair
matches and Cloudflare accepts the secret. What cannot be checked from
outside the dashboard is that widget's **allowed-hostnames list**. If it only
names `staging.hirerevolution.ai`, the widget will not issue a token on the
apex and every JD submission fails at the human check — with the form looking
perfectly normal. Add `hirerevolution.ai` and `www.hirerevolution.ai` to the
widget under Turnstile in the Cloudflare dashboard before the flip.

**This is one build for both names.** nginx will serve `hirerevolution.ai`
and `staging.hirerevolution.ai` from the same PM2 process and the same
compiled bundle, so the switch is not scoped to the apex:

- staging starts talking to the **production** app and API too. There is no
  longer a dev-pointed environment on this box — that is really the decision
  in item 4 below, arriving whether or not it was made deliberately.
- the JD form on `staging.hirerevolution.ai` **stops working**, because the
  prod Turnstile list does not include that hostname. That is expected and
  fine: staging is being retired, and step 5 verifies the form on the apex,
  which is the hostname that matters. Do not append
  `,staging.hirerevolution.ai` to `TURNSTILE_HOSTNAMES` to paper over it —
  that only widens the list for a name you are about to delete.

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

**Orange cloud alone does not hide the origin.** What hides it is locking
the droplet's firewall to Cloudflare's IP ranges, and that used to be blocked:
`staging.hirerevolution.ai` resolves straight to the reserved IP by design, so
closing the origin would have taken staging down. Retiring staging (cutover
step 7) removes that constraint, which is most of the reason to retire it.

Until step 7 lands, treat proxying as a caching/WAF/TLS change only. An
unclosed origin also means `X-Forwarded-For` is spoofable by anyone who hits
`159.89.242.172` directly with a `Host` header, and that header is what the
per-IP rate limits and Turnstile's `remoteip` are read from. True today;
proxying neither worsens nor fixes it. Step 7 does.

### 5. Security items from the review — **closed 2026-09-21**

A security review on 2026-09-21 fixed what lives in this repo: security
headers including a CSP, `Secure` on the audience cookie, a per-IP burst
ceiling ahead of the Turnstile call, pinned GitHub Action SHAs with
`permissions: contents: read`, upstream-supplied URLs no longer trusted into
an `href`, and `no-store` on the submission-status response. Four items needed
the droplet or a design change; all four were closed later the same day.

**Deploys no longer run as root.** An unprivileged `deploy` user owns
`/var/www/hirerevolution-website` and runs the site's PM2 daemon
(`pm2-deploy.service`; `pm2-root.service` is disabled and `pm2 list` shows the
app under `deploy`). It has **no sudo**, and the CI key sits in its
`authorized_keys` and no longer in root's — so a compromise of the deploy
workflow costs the website, not the droplet. Root SSH with the operator keys
(`infra-key`, `FE_ssh`) is untouched, and that is now the only way in as root.
`terraform/user_data.sh` provisions a rebuilt droplet the same way and
`scripts/push-env.sh` connects as `deploy`. If a deploy step ever needs root,
give `deploy` one narrow sudoers line for that exact command rather than
moving the login back.

**`/api/submit-jd/status` now requires proof that you submitted the job.**
`POST /api/submit-jd` returns a short-lived token (30 minutes) bound to that
import id by HMAC, the page sends it back in an `X-Submission-Token` header,
and the status route answers 403 to anything else — before it rate-limits and
before it calls the app. Holding a stray import UUID is no longer enough.

`lib/submission-token.ts` derives its signing key from `TURNSTILE_SECRET` with
HKDF rather than taking a new environment variable, on purpose: a new secret
would have to reach every environment before the code could ship, and the
usual failure there is a silent fallback that signs with a constant. Nothing
can be configured for the JD form and not for this, because `verifyTurnstile`
already refuses every submission without that secret. Rotating it invalidates
tokens issued before the rotation, which costs a page mid-poll the same
fallback it uses for any other failure: "we'll email you the link."

The app-side version of this — `GET /api/job-imports/{id}` scoped to the
submitter — is still worth doing as defence in depth, because the website
reads every import as the one service user. It is no longer what stands
between a stranger and someone else's job description.

**nginx no longer advertises its version.** `server_tokens off;` is set in
`/etc/nginx/nginx.conf` and in `terraform/user_data.sh`; responses say
`Server: nginx` with no version.

**Rate limits survive a deploy.** `lib/rate-limit.ts` still keeps its counters
in memory, but mirrors them to a file (`RATE_LIMIT_STATE_FILE`, default
`/tmp/hirerevolution-rate-limit.json`, mode 0600) — written debounced, flushed
on the SIGINT/SIGTERM that PM2 sends, reloaded on first use. Before this, the
24-hour per-IP JD limit reset several times a day, since every push to `main`
reloads PM2. The file is a mirror and not the source of truth: every
filesystem error is swallowed, because a disk problem must never turn into a
failed form submission.

It is still **single-process**. Two PM2 instances would keep two maps and race
on the file, so this does not make item 4's second instance safe; that still
needs a shared store.

#### Notes for the app team, not this repo

`/api/demo-link` sets its own `Origin` header to satisfy the demo API's origin
allowlist. That allowlist therefore stops nothing from a server; if it is
meant as a security control, it needs to be a shared secret or a signed
request instead.

`normalizeWebsite` accepts any http(s) URL containing a dot — including
hostnames that resolve internally and `user:pass@` userinfo — and forwards it
to the app as data. Nothing here fetches it. If the app ever does, that is
SSRF, and the validation needs to happen on that side.

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
failure on the droplet. This one expires with the name itself at cutover step
7; its certificate runs to 2026-12-17, which is well past the cutover. `app-dev.hirerevolution.ai` stays proxied behind
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
anything that depends on them. `TURNSTILE_SECRET` does double duty: it also
derives the signing key for submission-status tokens (item 5).

One optional variable is not in `config/.env.*` and does not need to be:
`RATE_LIMIT_STATE_FILE`, where the rate limiter mirrors its counters. The
default under `/tmp` is fine on this droplet.

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
