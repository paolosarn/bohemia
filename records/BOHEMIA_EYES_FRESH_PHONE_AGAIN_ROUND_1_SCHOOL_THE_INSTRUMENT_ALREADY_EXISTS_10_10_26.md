# EYES AND EARS -- [a fresh phone judged again] -- ROUND ONE: SCHOOL
### 10/10/26 -- session eyes-5vql33

Row: after RUN's [a fresh phone sees the door] shipped, re-walk a wiped phone and time the real
title paint, NEW GAME lit, and the first tap through it, beside PLUMBER's own numbers (the title
2.8 s, NEW GAME 67 s at 4x). This round is research only, no measuring, per this lane's own
two-round law.

## REUSE-FIRST: THE REAL INSTRUMENT ALREADY EXISTS, BUILT BY PLUMBER

Checked before designing anything: `tools/bohemia_first_load.js` (PLUMBER, row [first load],
10/9) already measures almost exactly what this row asks for, correctly, from a genuinely fresh,
untouched boot (no driver interference -- `bare:true`, no knock, no tap). It records, in
milliseconds since the tap, using a real `PerformanceObserver` on the browser's own standards-based
`first-contentful-paint` paint entry (not an estimate): `fcp`, the title's own first visible frame
(`#title`, not `.gone`), the menu buttons' first visible frame, and `ready` (the game's own
`window.__LOAD_READY` flag, meaning the loading bar is done and NEW GAME is live). It also reads
real network timing for bytes-before-title and bytes-before-ready, and flags files downloaded
twice. This is the exact instrument PLUMBER's own 2.8 s / 67 s numbers on the board came from. Round
two reuses `readOnce()` directly rather than re-deriving any of this.

## THE ONE REAL GAP, NAMED PRECISELY

PLUMBER's tool stops at `ready` -- it never taps NEW GAME. The row's own words ask for one thing
this tool does not do: "walks the first tap." That is this lane's real, distinct contribution for
round two: extend the reach past `ready`, press NEW GAME with a real touch, and time how long the
picks screen takes to become real and tappable -- not re-measuring what PLUMBER already measured
correctly, adding the one piece that is actually new.

## THE REAL VOCABULARY, SOURCED, SO THE NUMBERS ARE NAMED RIGHT

Checked the real, standard terms these numbers are versions of, against the primary source
(web.dev, Google's own performance documentation), not an SEO blog's paraphrase of it:

- **First Contentful Paint (FCP)** is a real, standardized browser timing entry
  (`PerformanceObserver` on `paint`, type `first-contentful-paint`) -- PLUMBER's `fcp` field reads
  this directly, the same metric Lighthouse and Chrome's own field data use. This is the one number
  in the whole row that is already a true, standards-measured figure, not an approximation.
- **Time to Interactive (TTI)**, web.dev's own definition: not simply "when the loading bar
  finishes," but a real calculated window -- starting from FCP, the browser looks for a quiet
  stretch of at least five seconds with no long main-thread tasks and no more than two in-flight
  network requests, and TTI is set to the end of the last long task before that quiet window (or to
  FCP itself if there was none). THIS MATTERS FOR NAMING: PLUMBER's `ready` flag is the GAME'S OWN
  readiness signal (the loading bar completing, NEW GAME lit) -- a real and useful number, but not
  the same thing as the browser-computed TTI metric, since `ready` says nothing about whether the
  main thread is actually free or still busy. Round two reports `ready` as what it is (the game's
  own signal) rather than mislabeling it TTI.
  [web.dev -- Time to Interactive (TTI)](https://web.dev/tti/)
- **The first tap's own latency** is the real, current metric family INP (Interaction to Next
  Paint), which replaced the older FID (First Input Delay) as a Core Web Vital in March 2024 and
  measures the delay from a real interaction to the next paint. INP samples every interaction across
  a page's whole life and reports the worst one; this row only wants the FIRST interaction's own
  latency, which is scoped like the older FID, not full-page INP -- round two should report a single
  first-tap latency number, not build a whole-session INP sampler the row never asked for.
  [Core Web Vitals -- LCP, INP, CLS](https://getsleek.io/blog/what-are-core-web-vitals)

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. Call `tools/bohemia_first_load.js`'s own `readOnce()` unmodified for `fcp`/title/buttons/`ready`
   and the byte numbers -- the exact instrument PLUMBER's 2.8 s / 67 s came from, re-run fresh
   against the shipped fix rather than quoted secondhand.
2. Extend past `ready`: a real touch on NEW GAME, timed from `ready` to the picks screen becoming
   real (matching the row's own "walks the first tap"), reported as its own number, not folded into
   `ready`.
3. Name `fcp` as the one true standards-measured figure, `ready` as the game's own readiness signal
   (not TTI, precisely because it is not the browser-computed quiet-window metric), and the new tap
   latency as a single first-interaction number (FID-shaped, not a full INP sample).
4. One VOTE item with the before (already posted by PLUMBER) and the after, side by side, with the
   first frame.

## ROUTED

Nothing to route yet -- school round. PLUMBER's own tool needs no fix; this lane extends it, not
replaces it.

## SHIP TEST FOR THIS ROUND

The instrument this row needs is not new: PLUMBER already built and proved the hard three-quarters
of it (FCP via the real browser API, title, buttons, ready, with real network timing), and this
round found that rather than assuming it had to be rebuilt. The one real gap (the first tap) is
named precisely, not guessed at. The row's own vocabulary is checked against the primary source
(web.dev's own TTI article) rather than an SEO paraphrase, and a real naming error is caught before
round two could make it: the game's own `ready` flag is not the same thing as the browser-computed
TTI metric, and round two will not call it that. NO MEASURING THIS ROUND, per the lane's own
two-round law. Round two next: `readOnce()` reused, the first tap added, one real before/after.
