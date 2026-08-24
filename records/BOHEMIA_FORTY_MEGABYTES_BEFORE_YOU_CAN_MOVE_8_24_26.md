# FORTY MEGABYTES BEFORE YOU CAN MOVE

**8/24/26 — WORLD lane. Nothing in this repo was watching the one number that decides
whether a friend plays the demo or closes the tab. It is 40.5 MB, 32.4 MB of it lands
*after* the only gesture a player makes, and 28 MB of that is a single file. I found it,
measured it, built the obvious fix, proved the fix makes it WORSE, reverted it, and gated
the number so it cannot grow while the real fix waits.**

---

## HOW I GOT HERE

My handoff's top item was the cluster seam on golf (9 cells), railyard (6) and landfill (4).
Before taking it I checked the size of the prize: **19 cells, 0.2% of the valley**, and each
one needs its canonical layout re-authored to scale, which is closer to redesign than to
copying solar's recipe. That is a poor trade in a demo week.

So I asked the demo what it was actually missing instead, starting from
`records/BOHEMIA_DEMO_STATUS_BOARD_8_14_26.md` — which carries its own warning in capitals:

> *A STATUS BOARD IS A CLAIM ABOUT THE TREE AND IT DECAYS LIKE ONE. RE-MEASURE BEFORE
> STEERING ANYBODY.*

Its headline claim was that an 11 MB run slice is fetched on every visit for a panel that is
never displayed. **Re-measured: false.** `BOHEMIA_RUN_CURRENT.html` is not fetched at all
now — the RUN lane changed the iframe to `data-src` and it is genuinely lazy. Credit where it
is due, and the board's own warning earned its keep for the third time.

But the real number turned out to be far worse than the board ever said.

## THE MEASUREMENT

Over real HTTP, cold cache, tapping the splash after a few seconds like a person:

```
BEFORE THE TAP     8.11 MB
AFTER THE TAP     32.38 MB    <-- 10.4 s of dead wait on LOCALHOST, zero latency
TOTAL TO PLAY     40.48 MB

  28.04 MB  BOHEMIA_CITY_TILES.js     8,674 tile sprites in one file
   4.05 MB  BOHEMIA_ALPHA_0_9.html    (fetched TWICE -- see below)
   2.62 MB  BOHEMIA_CITY_WORLD.html
   1.72 MB  BOHEMIA_CITY_PROPS.js
```

Not one byte of the 32 MB starts downloading until the tap **creates** the city iframe. The
whole payload is serialised after the only gesture a player makes. On localhost that is ten
seconds; on cellular it is minutes, staring at a splash they already tapped.

`BOHEMIA_CITY_TILES.js` breaks down as 24 families, `misc` alone being 6.8 MB of 2,845
sprites, `TP_TILES` 20.9 MB of the 28.

**Encoding is not the problem, and I checked before assuming it was.** Base64 is 4/3 of
binary, but gzip recovers almost all of it: 28.04 MB raw compresses to 20.76 MB, which is
about what the raw PNGs would weigh anyway. Converting to real image files would buy
essentially nothing. The weight is the art.

## THE FIX I BUILT, MEASURED, AND THREW AWAY

If the bytes cannot shrink, then stop making the player wait *serially* for them: the splash
is dead time a human is already spending, so spend it downloading. Same bytes, moved to
where nobody is waiting on them. Real games preload on the title screen.

Built it — a `fetch()` on load, not `<link rel=prefetch>`, because **Safari does not
implement rel=prefetch and Paolo plays this on an iPhone**; a hint the target browser ignores
is not an optimisation, it is a comment.

Then measured it, and the after-tap number did not move at all. The server's own log says
why:

```
13:56:10  GET BOHEMIA_CITY_TILES.js   200      <- the warm-up
13:56:10  GET BOHEMIA_CITY_PROPS.js   200      <- the warm-up
13:56:21  GET BOHEMIA_CITY_TILES.js   200      <- the iframe, AGAIN
          (props: never re-requested -- served from cache)
```

**Props (1.7 MB) warmed and was reused. Tiles (28 MB) was downloaded twice.** Chromium will
not put a response that large in its HTTP cache, so the warm-up does not warm anything — it
just doubles the bytes on a metered connection.

That is worse than doing nothing, so it is reverted and the alpha is byte-identical to what
it was. **STOP PRODUCING: a fix my own measurement says is harmful does not ship because I
already wrote it.**

Two things had to go right to catch this, and both are this week's lessons again:

- **A `response` event fires for cache hits too**, and still reports a content-length. My
  first counting made the warm cache look like a fresh download. Counting from the *server*
  side is what told the truth — VERIFY ON THE REAL SURFACE, applied to loading.
- **`file://` has no cache semantics**, so none of this is measurable there at all.

## THE SMALLER THING I FOUND ON THE WAY

The ordered request log is `ALPHA -> sw.js -> ALPHA`. The always-fresh service worker is
network-first for navigations and re-fetches the document with `cache:'no-store'`, so the
4 MB alpha crosses the wire **twice** on a cold visit. That is the ONE-LINK LAW's freshness
guarantee being paid for in megabytes. It is real and measured here; whether it also happens
on a repeat visit with the worker already installed is not something I established, so
nobody should act on it until they check.

## WHAT SHIPPED: THE NUMBER NOW HAS A GATE

`gates/time_to_play_gate.js`, registered as **TIME TO PLAY**, 6/0, 13 s.

It stands up a real static server with real cache headers, boots the alpha, waits the beat a
person spends reading the splash, taps it, and counts **what the server was actually asked
for** — not what the browser reported. It holds two ceilings that only ever come down (46 MB
total, 36 MB after the tap), and it names any file big enough to be un-cacheable as **split
debt** with the size it had when listed, using the same ratchet idiom as `legend_kept`: it
may not grow, and an entry left listed after being fixed fails too.

Both ceilings mutation-tested: dropped to 30/20 MB, both go red naming the measured number.

A debt entry is not an excuse, it is an address. This one says exactly where to go:
`tools/bohemia_city_split_tile_bank.py` is the 8/6 precedent that pulled this bank out of
the world page in the first place — for repo size, not load time. The same move one level
deeper is the fix.

## WHAT COMES AFTER

1. **SPLIT THE TILE BANK.** Not into 8 files by declaration — `TP_TILES` alone is 20.9 MB and
   would still be un-cacheable. Split it **by family** (24 of them, largest `misc` at 6.8 MB)
   so every chunk is small enough for a browser to keep. That makes three things true at once
   that are false today: the chunks cache, they download in parallel, and the splash warm-up
   starts working — at which point the reverted fix above becomes correct and can come back.
2. **Then re-run TIME TO PLAY and lower the ceilings to whatever it measures.** The ratchet
   is the point.
3. **Only after that is progressive loading worth attempting** — draw the world in its flat
   colours and let art arrive. Note the prerequisite, measured today: with the bank blocked
   the world is not a flat-coloured world, it is a **black void** with
   `ReferenceError: HERO_SRC is not defined`. The renderer has a hard dependency on the whole
   bank and would have to degrade gracefully first.
4. The cluster seam for golf / railyard / landfill / farm is still open and still correct;
   it is just worth 19 cells against this one's 28 MB.
