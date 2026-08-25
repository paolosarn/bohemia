# 201 LAUNCHES, ZERO OF THEM THE BROWSER HE PLAYS ON
# (8/25/26, coordinator sweep 16. A DECISION plus a routed work order and
# ONE THING ONLY PAOLO CAN UNBLOCK. This is the VERIFY ON THE REAL
# SURFACE law turned on our own apparatus.)

## 1. THE MEASUREMENT, AND IT IS NOT CLOSE
    grep -rhoE "(chromium|firefox|webkit)\.launch" gates/ tools/
      201  chromium.launch
        0  firefox.launch
        0  webkit.launch
150 gates require Playwright. About 94 of them boot the entire alpha in a
real browser and drive it by tapping real buttons — the discipline this
repo is proudest of and should be. **EVERY ONE OF THEM IS CHROME.**
WebKit is not merely unused here. IT IS NOT INSTALLED:
    ls /opt/pw-browsers -> chromium, chromium-1194,
                           chromium_headless_shell-1194, ffmpeg-1011
The four files in gates/ that match "webkit" match on CSS prefixes —
`-webkit-touch-callout`, `webkitUserSelect`. Not one launches the engine.

## 2. WHY THAT IS A CATEGORY ERROR AND NOT A GAP
This project's charter line one is **iPhone portrait**. On an iPhone,
outside the EEA, EVERY BROWSER IS WEBKIT — App Store rule 2.5.6 ("apps
that browse the web must use the appropriate WebKit framework and WebKit
JavaScript") has stood since 2008. The EU's Digital Markets Act forced
Apple to allow alternative engines in the EEA from March 2024, and the
restriction **continues to apply in the UK and the rest of the world**,
which includes Las Vegas and includes Paolo's phone and includes every
phone in the friends round.
So "Chrome on iPhone" does not exist. Chrome on iPhone IS WebKit wearing
a Chrome hat. **THERE IS NO PATH BY WHICH ANY PLAYER OF THIS GAME EVER
RUNS THE ENGINE OUR ENTIRE PROOF APPARATUS RUNS.**
### THE PART THAT SHOULD STING
laws/ has held VERIFY ON THE REAL SURFACE since 7/18, and its sentence is
"art is verified ONLY on the surface Paolo sees — a side-door probe is a
lie." We wrote that law about a preview canvas. **HEADLESS CHROMIUM IS A
SIDE-DOOR PROBE FOR AN IPHONE GAME**, and 150 gates have been walking
through that side door since the law was written.

## 3. THE FINDING THAT CHALLENGES WHAT WE BELIEVE
### WE BELIEVE: green gates mean it works.
It is the load-bearing belief of this whole operation. "A law without a
machine gate is not enforced" only works if the machine is watching the
right thing. THE GATES DO NOT PROVE THE GAME WORKS. THEY PROVE IT WORKS
IN CHROME.
And this repo has ALREADY LEARNED THIS EXACT LESSON TWICE, in its own
words, and did not generalise it:
  - the thumb sweep (8/15): "FIFTEEN GATES OPEN A 390x844 VIEWPORT AND
    VERIFY WHAT FITS — a Playwright click lands anywhere with equal ease,
    so reachability is invisible to our whole apparatus BY CONSTRUCTION."
  - the border finding (8/16): a pass that was individually correct and
    still wrong because of WHERE IT SAT IN THE PIPELINE, and "no amount
    of reading the pass finds that; only measuring the pixels he receives
    does."
Both are the same shape as this: **the apparatus was blind in a way the
apparatus could not see.** Twice we fixed the instance. Nobody asked what
else the instrument cannot see. This is the third instance and it is the
biggest, because it is not one gate measuring the wrong thing — it is all
150 measuring the wrong engine.
### AND WE ALREADY WRITE SAFARI-SPECIFIC CODE WE HAVE NEVER RUN
The backlog names Safari in at least seven places, with real engineering
attached: `navigator.storage.persist()` for Safari 17's seven-day
eviction, `-webkit-touch-callout` against the iOS long-press selection
menu, safe-area insets against Safari's bottom URL bar, and the flat
statement "iOS Safari kills the page." **WE HAVE WRITTEN A PILE OF CODE
WHOSE ONLY PURPOSE IS TO SURVIVE AN ENGINE WE HAVE NEVER ONCE STARTED.**
Every one of those fixes is currently a hypothesis.

## 4. WHAT THE OTHER AISLE SAYS IS WAITING FOR US
Web-game practitioners have been filing the same iOS-specific failures
for a decade, and they are not cosmetic:
- **CANVAS MEMORY IS CAPPED AND THE FAILURE IS SILENT.** Mobile Safari
  and WKWebView warn past a total canvas budget (documented around
  384 MB) and then `getContext` **starts returning null**. Not a crash
  with a message — a null. WE ARE A CANVAS GAME THAT JUST QUADRUPLED ITS
  PIXELS (CHARACTER's 2X/4X work) and preloads a 15.9 MB slice on every
  visit.
- **WEBGL CANVAS RESIZING LEAKS ON iOS SAFARI** (WebKit bug 219780), and
  GPU memory available for rendering has DECREASED across iOS versions,
  producing crashes mid-gameplay.
- **AUDIO IS THE CLASSIC.** WebKit's audio history is a graveyard of
  gesture-unlock requirements, one-file-at-a-time eras, parallel playback
  only after full preload, and "delayed and glitchy" WebAudio (WebKit bug
  221334). THE SOUND LANE HAS SHIPPED 500+ SOUNDS, 24 MUSIC BATCHES AND A
  QUEST STING THIS WEEK, ALL PROVEN AUDIBLE IN CHROME.
- **LARGE JAVASCRIPT PARSE IS SLOW ON iOS.** Our alpha is a single
  enormous HTML file. The lane already found "FORTY MEGABYTES BEFORE YOU
  CAN MOVE" and measured it in Chrome.
None of these are predictions about our build. They are the documented
shape of the class of bug that is invisible to us BY CONSTRUCTION.

## 5. THE HONEST LIMIT, STATED BEFORE ANYONE GETS EXCITED
**PLAYWRIGHT'S WEBKIT IS NOT SAFARI, AND I WILL NOT LET THIS RECORD
PRETEND OTHERWISE.** It is a WebKit build that approximates Safari; it is
DESKTOP WebKit, not mobile Safari; it does not carry Apple's OS
integrations, the real virtual keyboard, real notch/safe-area behaviour,
real scrolling and fixed-position quirks, or anything performance- or
memory-related on real hardware. Practitioner guidance is unanimous that
some bugs appear only on real devices.
SO THE CLAIM THIS BUYS IS NARROW AND IT IS STILL ENORMOUS: **it moves us
from testing an engine no player will ever run, to testing the right
engine family imperfectly.** Engine-level divergences — API presence,
audio unlock behaviour, storage semantics, CSS support, JS feature gaps,
and outright exceptions — are exactly what it catches. The rest needs a
phone, and we have one: HIS.

## 6. THE THING ONLY PAOLO CAN UNBLOCK, AND IT IS NOT A DESIGN QUESTION
I tried to install it rather than recommend it. IT IS BLOCKED AT THE
NETWORK, twice, by name:
    Error: Download failed: server returned code 403 body 'request
    blocked: no rule or allowlist entry allows host "cdn.playwright.dev"'
    Error: ... no rule or allowlist entry allows host
    "playwright.download.prss.microsoft.com"
The fleet CANNOT install WebKit from inside a session. Two hostnames need
to be on the environment's allowlist:
    cdn.playwright.dev
    playwright.download.prss.microsoft.com
That is an environment setting, not a ruling and not a design call, and I
am naming it here rather than putting it in front of him as a question.
FALLBACK IF IT STAYS BLOCKED, and it is the better half anyway:
**HE HAS THE ONLY REAL DEVICE THIS PROJECT WILL EVER HAVE.** The friends
round is 5-8 people on 5-8 real iPhones with the one link — that is the
largest real-Safari test this game will get before launch, and right now
NOTHING IS SET UP TO CATCH WHAT IT FINDS. Which connects this straight
back to sweep 14's finding: the feedback card (RUN 0f) is the instrument,
and it is still unbuilt.

## 7. THE DECISION (mine, EVERYTHING IS A THUMB, correct-after)
**THE ENGINE IS PART OF THE SURFACE. A GATE THAT RUNS ONLY IN CHROMIUM
DOES NOT GET TO SAY THE GAME WORKS.**
1. **A WEBKIT LANE ON THE DEMO PATH, NOT THE WHOLE SUITE.** Running all
   150 gates twice doubles a suite that already took a full session to
   make finish. The DEMO PATH runs in both: the_whole_demo_gate,
   opening_gate, save_iphone_gate, durable_save_gate, home_phone_gate,
   phone_rings_gate, demo_sound_gate, every_panel_closes_gate. Eight
   gates, the ones that decide whether a stranger can play.
2. **THE ENGINE IS A PARAMETER, NOT A COPY-PASTE.** One shared helper
   that reads an env var and returns the browser type, so a gate is
   written once and run twice. Any gate hard-coding `chromium.launch`
   after that is the drift, and the sweep will find it.
3. **IT REPORTS, IT DOES NOT BLOCK, FOR ONE WEEK.** A brand-new engine on
   a codebase that has never met it will go red on things that are
   WebKit's fault and not ours, and a suite that cries wolf gets ignored
   — this repo has the receipts on that. One week advisory, then it
   blocks.
4. **THE SAFARI CODE WE ALREADY WROTE GETS VERIFIED FIRST.** persist(),
   the touch-callout suppression, safe-area insets, the audio unlock.
   Those are hypotheses today. Cheapest possible win: they are already
   written, and we would simply be finding out whether they work.
5. **NOTHING NEW SHIPS FOR THIS.** No features. This is the instrument,
   and the instrument has been pointed at the wrong thing.

## 8. ROUTED
- **RUN (owns the suite, P0-SUITE) — WEBKIT-1: THE ENGINE IS A
  PARAMETER.** The helper, the eight demo-path gates, advisory for one
  week. Registered in gates/bohemia_gates.py as a separate pass so its
  reds are legible and never confused with a Chromium red.
- **RUN — WEBKIT-2: VERIFY THE SAFARI CODE WE ALREADY SHIPPED.** The
  four hypotheses in §7.4, measured, in the right engine.
- **SHARED — WEBKIT-3: THE ENVIRONMENT.** The two hostnames in §6. If
  they stay blocked, say so out loud in the handoff instead of quietly
  skipping the lane — a silently skipped engine is exactly how this went
  unnoticed for two months.
- **NOTE FOR THE FRIENDS ROUND (blocks nothing, but it is the pairing
  that matters):** those 5-8 phones are the only real Safari we will get.
  The feedback card is what turns them into data. Sweep 14's routing
  stands and this raises its value.

## 9. CONFIDENCE, PER CLAIM
- 201 chromium launches, 0 webkit, WebKit not installed: **CERTAIN**,
  measured twice.
- The WebKit mandate outside the EEA: Apple's own rule text and Apple's
  own 2024 DMA announcement. **HIGH.**
- Playwright WebKit is not Safari: practitioner consensus, and I have
  narrowed the claim to match. **HIGH.**
- The specific iOS failures in §4: WebKit's own bug tracker and
  practitioner write-ups. They are the SHAPE of the risk, not a
  prediction about our build. **HIGH as a class, UNKNOWN for us — which
  is the entire point.**
- The install being blocked: reproduced twice, exact 403 text quoted.
  **CERTAIN.**
- That WebKit will find real bugs in our build: a **PREDICTION.** It
  might come back clean, and that would be the best possible outcome and
  still worth every minute.

## SOURCES
Apple App Store Review Guideline 2.5.6; Apple Newsroom, "Apple announces
changes to iOS, Safari, and the App Store in the European Union"
(Jan 2024) and Apple Developer's DMA support page; UK CMA mobile browsers
market investigation working paper on the WebKit requirement; WebKit
Bugzilla 219780 (WebGL canvas resize leak), 222723 (canvas memory),
221334 (WebAudio delayed/glitchy), 132691 (audio playback on mobile
WebKit); Game Developer, "The HTML5 audio troubleshooting guide";
html5gamedevs and Construct community threads on iOS WebAudio; BrowserStack
and practitioner guides on Playwright's WebKit vs real Safari. In-repo:
gates/ (201 launches), /opt/pw-browsers, BOHEMIA_BACKLOG.md rows -5 and
-6 and the Safari lines, laws/ VERIFY ON THE REAL SURFACE (7/18),
records/BOHEMIA_THE_FRIENDS_ROUND_IS_NOT_READY_8_24_26.md.
