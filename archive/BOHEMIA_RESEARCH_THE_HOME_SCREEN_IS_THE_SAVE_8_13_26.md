# RESEARCH — THE HOME SCREEN IS THE SAVE (8/13/26, coordinator sweep 8
# catch; doctrine §4b — both aisles, anti-yes-man)

## THE FALSIFIABLE QUESTION
RUN 00b's routed near-term answer to iOS's 7-day save eviction is
persist() + aggressive export prompts. Question: is that actually the
strongest available fix on the only platform that matters — or is the
real fix an INSTALLED home-screen app, and if so what does installing
cost us?

## WHAT THE REPO ALREADY KNOWS AND DOESN'T HAVE
The save-durability module's own comment (alpha ~line 11278) already
states the exemption: "iOS Safari's ITP wipes all script-writable
storage after 7 days without a visit... A HOME SCREEN install is
exempt." But the alpha ships NO manifest, NO apple-mobile-web-app meta
tags, NO apple-touch-icon. On iOS, add-to-home-screen without those
creates a BOOKMARK that reopens in Safari — no standalone app, and no
exemption. The knowledge is a comment; the surface cannot deliver it.

## AISLE 1 — PLATFORM PRIMARY (WebKit's own words)
1. webkit.org (Full Third-Party Cookie Blocking and More, ITP docs):
   ALL script-writable storage (localStorage, IndexedDB, service worker
   registrations) is deleted after 7 days of Safari use without visiting
   the site. Home-screen web applications "are not part of Safari",
   keep their own days-of-use counter, and their first-party storage is
   EXEMPT from the 7-day cap. The exemption is official, documented,
   and exactly the failure RUN 00b exists to survive.
2. THE LANDMINE (Apple dev forums + practitioner writeups, consistent):
   iOS standalone mode gets a SEPARATE storage silo — localStorage,
   cookies, and the service worker instance do NOT carry over from
   Safari to the installed app. A player who installs on day 5 opens
   the icon to an EMPTY game. Known bridge: Cache Storage IS shared
   between the two modes (practitioner-documented workaround), and our
   export/import blob is a manual bridge that already exists.

## AISLE 2 — THE REAL WORLD (install prompts as a measured practice)
3. Commerce/industry data (Google case studies: Lancôme, MakeMyTrip;
   web.dev guidance): CUSTOM install prompts shown at an engaged moment
   multiply install rates (3-6x vs passive) and installed users show
   2-3x retention vs browser-only. Timing rule of thumb: prompt after
   real engagement, never on arrival. On iOS there is no
   beforeinstallprompt event — the card must be instructional (share
   sheet -> Add to Home Screen), which is standard practice.
   [Marketing-flavored aggregates — direction solid, multipliers soft.]
4. GAMES AISLE (webgamedev.com practitioner consensus): for browser
   games the installed icon means fullscreen with no browser chrome, an
   icon beside real apps, and session re-entry without typing a URL —
   the "feels like a real game" delta for a phone-first game is the
   whole point.

## THE CHALLENGE FINDING (vs what we believe)
RUN 00b's near-term plan is the WEAK fix: persist() is advisory on iOS
and export prompts put the burden on the player every time. The STRONG
fix was never routed because it looks like marketing, not engineering:
ONE manifest + three head tags + one icon + one well-timed card makes
the game (a) an app icon on Paolo's and every friend's phone, (b)
fullscreen without Safari chrome, and (c) EXEMPT from the eviction that
motivated 00b in the first place. The eviction problem and the
"feels like a real app" problem are the SAME FIX. But the silo landmine
inverts the usual timing logic: the LATER a player installs, the more
progress the install strands in Safari's silo — so the card belongs
EARLY (first sleep-save, the demo's natural "this is worth keeping"
beat), and the export/import blob is the documented crossing for
anyone who installs late.

## ROUTED (work order — RUN 00b amendment; correct-after)
1. slices/ gains manifest.webmanifest (name BOHEMIA, display
   standalone, portrait, start_url the ONE LINK — the icon IS the one
   link with a face; ONE-LINK LAW untouched) + apple-mobile-web-app
   meta tags + apple-touch-icon built from approved art (draft — he
   corrects the icon like everything else).
2. THE CARD: after the FIRST sleep-save, once, the save surface offers
   "put BOHEMIA on your home screen" with the iOS share-sheet steps —
   engaged-moment timing per the data; never on arrival; never nagging
   (once, then a quiet corner affordance).
3. THE CROSSING: install card mentions export; the save status()
   already reports evictionRisk and navigator.standalone — surface it
   honestly (installed = "your save is safe here"; Safari = the risk
   line it already planned).
4. Cache Storage bridge = OPTIONAL later hardening (shared between
   modes, practitioner-documented); export/import is the v1 crossing.
5. pages_publish note: the manifest + icon live in slices/ (already a
   published folder) or the installed app 404s — bind it in the gate's
   copy list check.
Demo note: this IS demo-adjacent-critical — the friends round (closed
playtest protocol) is exactly when saves must survive a week of not
playing, and when the icon-on-phone delta hits hardest.

## CONFIDENCE
WebKit exemption + silo: platform primary + consistent practitioner
reports, high. Retention multipliers: industry marketing aggregates,
medium — direction trusted, numbers not load-bearing. The routing
stands on the platform facts alone.

Sources: webkit.org/blog/10218 + webkit.org/tracking-prevention
(the cap + the exemption), developer.apple.com forums thread 710157 +
jakub-kozak.medium.com + netguru.com (the standalone storage silo +
Cache Storage bridge), web.dev/learn/pwa/installation-prompt +
love2dev.com (prompt timing; Lancôme/MakeMyTrip data),
webgamedev.com/publishing/pwa (games-aisle practice).
