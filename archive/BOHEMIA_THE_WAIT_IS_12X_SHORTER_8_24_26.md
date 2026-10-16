# THE WAIT IS 12x SHORTER

**8/24/26 — WORLD lane. The tap-to-world wait went from 32.38 MB to 2.65 MB. Same art, same
world, not a pixel different: the 28 MB tile bank is now eight cacheable chunks, and the
splash downloads them while the player is reading it.**

---

## WHERE THIS CAME FROM

Yesterday's turn measured the demo's real blocker and then failed to fix it, on purpose:

> Warming the cache during the splash did not move the number at all, because **Chromium
> will not keep a response that large** — the warm-up downloaded the bank and the iframe
> downloaded it AGAIN.

That turn shipped the finding, a gate to hold the number, and one instruction: **split the
bank into chunks small enough to cache.** This is that.

## FIRST, THE NUMBER THE PLAN DEPENDED ON

"Small enough" is not a plan until you know how small. So I measured the wall instead of
guessing at it — serve files of increasing size, fetch each twice, and watch which second
fetch reaches the server:

```
 1 MB  served from cache      6 MB  served from cache
 2 MB  served from cache      8 MB  RE-DOWNLOADED
 4 MB  served from cache     12 MB  RE-DOWNLOADED   ... and everything larger
```

**The wall is between 6 and 8 MB.** So the chunker targets 4 MB, which is why `misc` — 6.81 MB
on its own and comfortably inside the "cacheable" column — still gets split. A chunk that
only just fits is a chunk that stops fitting the next time somebody cooks a sprite.

## WHAT SHIPPED

`tools/bohemia_city_chunk_tile_bank.py`. It reads the bank, bins it, and writes
`BOHEMIA_CITY_TILES_01..08.js`, none over 4 MB:

```
_01  3.98   _02  3.14   _03  1.50   _04  4.00
_05  3.89   _06  3.99   _07  3.83   _08  3.71
```

Chunk 1 declares the containers; later chunks fill them; a family too big for one chunk is
split and re-joined with `.concat` **in load order**, so no sprite index ever moves. Script
tags without `async`/`defer` execute in document order, which is the only thing holding this
together and is guaranteed by the spec rather than by luck.

Then the alpha warms them during the splash — the exact code that was written and reverted
yesterday, unchanged. Same code, different file sizes, opposite result. That is the whole
reason the chunking had to come first.

## MEASURED, FROM THE SERVER'S SIDE

```
                      before      after
after the tap       32.38 MB    2.65 MB      <-- the wait the player actually feels
total to play       40.48 MB   40.51 MB      (identical: same bytes, moved)
```

The request order tells the story better than the number does. Every chunk now arrives
**before** the tap; afterwards only the world page is fetched:

```
ALPHA -> sw.js -> ALPHA -> TILES_01..08 -> PROPS   |TAP|   -> CITY_WORLD.html
```

**The world is unchanged.** `walked_surface` reports 8,595 cells / 93.3% reachable / 99.9%
drawn by their own module — identical to before the split, to the cell.

## THREE THINGS THIS COULD HAVE BROKEN, AND DID

**1. Equivalence.** The tool re-reads what it wrote, evaluates the chunks in load order in a
real engine, and deep-compares every declaration against the original. It refuses to write
if that fails — and it did fail, first try: I emitted families biggest-first to pack tighter,
and `JSON.stringify` walks an object in **insertion order**, so a size-sorted `TP_TILES` is a
different object even though every family in it is identical. Nothing in the renderer should
care. "Should" is not a thing to bet the world's art on for a few hundred KB of packing, so
families keep their original order.

**2. Its own guard.** The first packing put all seven "small" declarations in chunk 1 and it
came out at **7.12 MB** — over the wall, because HERO_SRC (2.83) plus DOOR_ANIM (2.54) plus
the rest is not small. The tool's own size check caught it and refused to write anything.
That check is the one job this tool exists to do.

**3. A patch tool with nothing to do with any of this.**
`tools/bohemia_city_props_patch.py` inserts the props bank immediately after
`<script src="BOHEMIA_CITY_TILES.js"></script>` — it uses that tag as an **anchor**. Deleting
the tag silently broke it. A run of N script tags is a worse anchor than one tag was, because
N moves, so the chunks now live inside a named region and other tools anchor on
`<!-- __TILE_BANK_END__ -->`, which is stable at any chunk count.

## THE ONE THAT DID NOT BREAK, AND WHY

`gates/bohemia_city_app.js` is the shared resolver 33 gates use to ask "what is the city
source". Its comment, written on 8/6 when the bank was first split out:

> *"EVERY CONSUMER STILL SEES THE WHOLE LOGICAL DOCUMENT. Twenty-odd gates ask this resolver
> for the city source and some of them grep it for tile data; splitting the FILES without
> splitting the ANSWER is exactly the trap that cost the fleet a day on 8/2 and again on
> 8/4. So read() glues it back on."*

One function changed — it now globs the chunks and joins them in sorted order — and 33 gates
did not have to know. Sixteen of them were run individually to confirm it. That is what a
single owner buys, and it is worth naming because the 8/6 author paid for it in advance.

## THE COST, SAID OUT LOUD

This commit adds about **28 MB of new blobs** to the repository: the same art re-stored under
new names, while the old blob stays in history forever. Against a 906 MB repo with a 5 GB
ceiling 137 days out, that is roughly one day off the clock.

It buys that back and more. The bank used to be one file, so changing a single sprite
rewrote all 28 MB into a new blob. Now it rewrites **one 4 MB chunk**. Future art edits cost
about a seventh of what they did.

## GATES

```
time to play 9/0   walked surface 11/0   blob integrity 103/0   integration 128/0
city tab 64/0   current slice 6/0   map tab 9/0   alpha loads 20/0   props 76/0
city kit binding 12/0   dooranim 10/0   hero wire 145/0   icon 25/0   street source 18/0
mapsize 13/0   interiors 42/0   navcluster 16/0   full pixel 15/0   touch guard 25/0
traffic signal 11/0   shadow 7/0   doorjamb 15/0   ewdoor 7/0   market 32/0
one valley 12/0   cold boot 11/0   pages publish 18/0   repo budget 7/0
```

`time_to_play_gate` also grew three claims and lost one:

- **The split debt is empty**, one day after it was created. The entry came off rather than
  sitting green, which is what the stale-entry check exists to force — and that check had a
  hole the moment it was needed: it read `sizeOf(n) && ...`, and `sizeOf` returns 0 for a
  file that no longer exists, so a debt entry naming a **deleted** file was silently skipped.
  The one case it existed for was the one case it could not see.
- **The after-tap ceiling ratcheted 36 MB → 6 MB.** That is the point of a ratchet.
- **The warm list must match the chunks on disk**, both ways. If they drift the warm-up 404s
  on every boot and the wait comes back *looking like nothing changed*, which is the worst
  kind of regression.
- **The un-cacheable single bank must stay gone.**

## WHAT COMES AFTER

1. **Total is still 40.5 MB.** The wait is fixed; the *download* is not. The next real win is
   progressive loading — draw the world and let art arrive — and the prerequisite is measured
   and unpleasant: with the bank blocked the world is a **black void** with
   `ReferenceError: HERO_SRC is not defined`, not a flat-coloured world. The renderer
   hard-depends on the whole bank and has to degrade gracefully first.
2. **The alpha crosses the wire twice** (`ALPHA -> sw.js -> ALPHA`, 4 MB each). The
   always-fresh service worker re-fetches navigations with `cache:'no-store'`. Whether that
   repeats on a warm visit is still not established — check before acting.
3. The cluster seam for golf / railyard / landfill / farm is still open, still correct, and
   still worth 19 cells.
