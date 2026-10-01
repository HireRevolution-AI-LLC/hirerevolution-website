# QR codes and how we measure them

Every QR code we print — business cards, handouts, conference signs — encodes
the same address, `https://hirerevolution.ai/qr`. That address forwards to
whichever page we choose, so we can change where the codes lead without
reprinting anything. This document explains how the redirect works, how to
count scans today, and what it takes to get full campaign reporting from an
analytics service.

## The /qr address forwards to a destination that only a deploy can change

The redirect lives in `app/qr/route.ts`. Its target is a single constant:

```ts
const DESTINATION = "/?utm_source=qr";
```

To send the codes somewhere else, change that line, commit, and push to
`main`. The deploy workflow puts it live in about ninety seconds, and every
code already in circulation follows. The destination can be a page on this
site (for example `/videos?utm_source=qr`) or a full URL on a site we control.

The destination is written into the code on purpose. It is not read from the
scanned link, a cookie, a database or an admin page, and anything a visitor
adds to the link is thrown away. As a result, nobody outside the team can make
`/qr` send people to an address of their choosing. The only way to change it
is a commit to this repository.

The redirect is temporary (HTTP 307) and marked `Cache-Control: no-store`, so
neither browsers nor Cloudflare remember it. A permanent redirect would be
cached indefinitely, and anyone who had scanned a code before would keep
landing on the old page after we changed it. Do not switch it to permanent.

## Scans can be counted today from the server log

The site has no analytics service yet, so the redirect counts scans itself.
Each request to `/qr` writes one line to the application log:

```
[qr] scan 2026-09-29T23:08:15.389Z
```

The line records the time and nothing else — no IP address, no device, no
browser — so it tells us how many scans happened and when, not who made them.

The site runs under PM2 as the `deploy` user on the droplet, and PM2 keeps the
application's output in that user's home directory. To see the total number
of scans, SSH to the droplet and run:

```bash
grep -c '\[qr\] scan' /home/deploy/.pm2/logs/hirerevolution-website-out.log
```

To see scans per day, which shows whether a particular conference, mailing or
sign produced traffic:

```bash
grep '\[qr\] scan' /home/deploy/.pm2/logs/hirerevolution-website-out.log | cut -c11-20 | sort | uniq -c
```

The count is close to, but not exactly, the number of people who scanned a
code. Someone who types the address by hand is counted too, which should be
rare. The staging site is served by the same process, so a team member
testing `staging.hirerevolution.ai/qr` also adds a line. And the log is a
file on the server: if it is deleted, or if log rotation is ever turned on,
the older lines go with it. Copy the numbers somewhere durable now and then if
the history matters.

What the log cannot tell us is what happened after the scan — which pages the
visitor read, and whether they booked a demo or submitted a job description.
That is the job of the tag on the destination.

## The utm_source tag lets an analytics service attribute QR visits

The destination ends in `?utm_source=qr`. UTM tags are a convention that every
mainstream analytics service understands: when a visitor arrives on a page
whose address carries `utm_source`, the service records that value as the
source of the visit and attaches it to everything that visitor does for the
rest of the session.

Today nothing on the site reads the tag, so it has no effect yet. Once an
analytics service is installed, it will do three things for us without any
further work on the QR side. It will show QR visits as their own traffic
source, separate from search, LinkedIn and direct visits. It will show what
those visitors did next — how many pages they viewed, which ones, and how long
they stayed. And, once we tell the service which actions count as
conversions (see step 4 below), it will report how many QR visitors went on to
submit a job description, request a demo or contact sales. That last number
is the one that answers whether printed material is worth what it costs.

Keep the tag whenever the destination is a page on this site. If the codes are
ever pointed at an outside site such as YouTube, the tag does nothing there,
but the log line still counts every scan.

## Recommended service: Plausible, with Google Analytics as the free alternative

Three services fit a site like this one. Each reads UTM tags automatically.

**Plausible** is the recommendation. It is built for exactly this kind of
question — where did visitors come from, and did they convert — and it
presents the answer on one page without configuration. It does not use
cookies or collect personal data, so it does not require a cookie consent
banner, and its script is small enough not to slow the site. UTM tags appear
under Sources → Campaigns, and conversions are set up as "goals" in a few
clicks. It costs money: plans start at around $9 a month for a site of our
size, after a 30-day free trial. Check current pricing at plausible.io before
signing up.

**Google Analytics 4** is free and far more capable, and it is the right
choice if we expect to run Google Ads or need detailed funnels and audiences.
The cost is complexity: its reports take real effort to learn, and it sets
cookies, which means our privacy policy must say so and visitors from places
with consent laws (the EU and UK in particular) should be asked before it
loads. The old Hostinger site used Google Analytics, so an account and
property may already exist; it is worth checking before creating a new one.
One detail if we choose it: Google groups traffic into channels using
`utm_medium`, and a visit with only `utm_source` lands in "Unassigned". Change
the destination to `/?utm_source=qr&utm_medium=print` at the same time so QR
visits are grouped sensibly.

**Umami** is an open-source, cookieless alternative similar to Plausible,
available as a hosted service or self-hosted for free. It is a reasonable
choice if cost matters more than polish, though self-hosting it would add a
database and a service to the droplet, which is already small.

**Cloudflare Web Analytics does not fit this purpose.** Cloudflare already
tries to inject its analytics script into our pages (it is currently blocked
by the site's security policy; see HANDOFF.md, item 6). But Cloudflare's
analytics deliberately does not record query strings, so it cannot see
`utm_source` and cannot tell QR visitors apart from anyone else. Whatever we
choose above, that item in HANDOFF.md still needs a decision: either allow
the Cloudflare script or turn Web Analytics off in the Cloudflare dashboard.

## Completing the setup

These steps assume Plausible; the differences for Google Analytics are noted
in each step.

1. Create the account and add `hirerevolution.ai` as a site. Plausible gives
   you a script tag to install; Google Analytics gives you a measurement ID
   that starts with `G-`.

2. Load the script on every page from the root layout, `app/layout.tsx`.
   Add it the way `app/components/Turnstile.tsx` adds Turnstile's script —
   from an effect, after the page loads — rather than as a `<script src>` in
   the page markup. A cross-origin script referenced in the HTML without an
   integrity hash is what SecurityScorecard flagged in September, and
   analytics scripts cannot carry one because the vendor updates them in
   place. For Google Analytics, the `GoogleAnalytics` component from
   `@next/third-parties` is the Next.js-supported route, but check the
   rendered HTML afterwards: if `googletagmanager.com` appears in it, load
   the script from an effect instead.

3. Allow the service in the Content Security Policy, which is built in
   `lib/csp.ts` and applied to every page by `proxy.ts`. The policy blocks
   every outside script by default, and a new analytics script will silently
   fail to load until it is allowed. Plausible needs `https://plausible.io`
   added to `script-src` and `connect-src`. Google Analytics needs
   `https://www.googletagmanager.com` in `script-src`;
   `https://www.googletagmanager.com` and `https://*.google-analytics.com` in
   `img-src`; and those two plus `https://*.google.com` in `connect-src`.
   Add the new hosts to the list in the comment at the top of `lib/csp.ts`,
   which records why each outside origin is allowed.

4. Record conversions. Page views are counted automatically, but the service
   cannot know a form succeeded unless the site tells it. Fire a named event
   when each form's request succeeds: in `app/offers/submit-job-description/page.tsx`
   after `/api/submit-jd` returns, in `app/contact-sales/page.tsx` after
   `/api/contact-sales` returns, and in `app/demo/DemoLinkForm.tsx` after
   `/api/demo-link` returns. Then mark those events as goals (Plausible) or
   key events (Google Analytics). The "book a live demo" button is an
   outbound link to Calendly, so count it as an outbound-link click; both
   services can track outbound clicks.

5. Update the privacy policy. It lives in the app repository and is served
   from `app.hirerevolution.ai/privacy`, not from this site. It should name
   the analytics service. For Google Analytics it must also describe the
   cookies, and a consent banner should be added before the script loads for
   visitors who need one.

6. Deploy, then scan a real printed code with a phone. Within a minute or two
   the visit should appear in the service's real-time view with `qr` as its
   source (Plausible: Sources → Campaigns; Google Analytics: Reports →
   Acquisition → Traffic acquisition, filtered by session source). Check the
   browser console on the live site for Content Security Policy errors — a
   missing host in step 3 shows up there and nowhere else.

## Telling one printed piece from another would need more than one address

Every code currently encodes the same `/qr`, so all scans look alike: we can
see that a scan happened and on what day, but not whether it came from a
business card or a conference banner. The date is often enough to infer it —
a spike during a conference is the conference.

If we ever need to tell pieces apart precisely, the way to do it is a small,
fixed set of addresses such as `/qr/card` and `/qr/event`, each with its own
hard-coded destination and its own `utm_campaign` value, printed on the
matching material. That keeps the security property above, since each
address is still defined in code. The cost is that materials are no longer
interchangeable, and a card printed with one address stays tied to it. We
have not done this, and there is no need to until the plain count stops
answering the question.
