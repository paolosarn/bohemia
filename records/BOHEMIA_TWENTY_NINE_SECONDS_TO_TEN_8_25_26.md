# TWENTY-NINE SECONDS TO TEN

**8/25/26 — WORLD lane. A friend on a weak phone who taps the splash the second it appears
now waits **10.8 seconds** for the city instead of **28.6**. The 26 MB of sprite art came off
the critical path entirely and streams in behind him. Two gates hold it there, and both were
mutation-tested. The interesting part is not the number: it is that FOUR separate honest
instruments told me the truth for two days and I called all four of them broken.**

---

## THE PART THAT COST THE MOST: THE PROBES WERE NEVER LYING

The question was simple. Take the art off the critical path, then prove the art still gets
drawn. Four ways of asking, in order:

```
a data-URL tail             matched three visibly different worlds
a raw pixel checksum        different on every repaint of the SAME build
distinct colour counting    8028 with all the art, 8028 with none
neighbour edge density       325 with all the art,  325 with none
```

Every one of those failed its own control — a world with 24 sprite families and a world with
ZERO measured the same. Three probe generations went into fixing the ruler. The record from
earlier the same day is titled *"because yesterday's lied"*.

**They did not lie. Not one of them.** I finally saved the two pictures and looked at them,
and they are identical, pixel for pixel, because **none of the late art is on the spawn
screen**:

```
HERO_SRC    read only by renderCity()      -- the zoomed-out CITY view
TP_TILES    read only by the tile painter  -- TP.on / TP.scatter
DOOR_ANIM   read only when a door swings
```

The walked street view is drawn from chunk 1: sidewalk, asphalt, weeds, brick, and the
characters, who are procedural. The instruments were pointed at the one surface where the
answer could not appear, and each one dutifully reported no difference.

In CITY MODE it is not subtle:

```
all chunks blocking   detail 631 / 1000     painted grey blocks
art blocked           detail 218 / 1000     flat red prisms
```

**The lesson is not "measure pixels".** I already had that law, and followed it. It is that
VERIFY ON THE REAL SURFACE has a second half nobody wrote down: *the real surface is the one
where the thing you changed is visible.* A correct instrument aimed at the wrong screen is
confidently wrong, and confidently wrong survives a lot longer than red.

## THE BUG UNDER THAT, WHICH WAS REAL

With a probe that could finally see, the re-bake still did not reach the screen. The receipt:

```
BANKS   TP_TILES=24  TP_IMG=24  HERO_IMG=69  DOOR_ANIM=10/10  decoded=100%
CANVAS  as it boots                sum=188303220
CANVAS  after a hand-fired repaint  sum=1170979137
```

Everything arrived, everything decoded, and the canvas held the no-art picture until a
repaint was fired by hand. The re-bake had been right the whole time; it was **announcing
itself to an empty stage.** The loader runs seconds after the parse; the world is generated
and drawn later still. `saFlush()` throws away drawn chunks and re-renders — run before a
single chunk has ever been drawn it clears an empty cache, renders nothing, and (being a
once-only flush) never comes back.

It now waits for `chunkCache` to hold something before repainting. If the world never draws,
no repaint is needed anyway: the banks are full, so whenever it does draw, it draws with the
art.

## AND THEN THE THING THAT ACTUALLY MADE IT FAST

Chunks 2..N were `<script defer>`. That is the obvious answer and it is the wrong tool.

**`defer` delays EXECUTION. It does not delay the DOWNLOAD.** The browser sees all eight tags
during the parse and opens all eight transfers immediately, next to the one blocking chunk
the world is waiting on. A request-by-request timeline on a throttled phone, tapping at once:

```
0.9s -> 28.9s   1.75 MB  BOHEMIA_CITY_TILES_01.js      <-- five seconds of work
0.9s -> 28.5s   1.72 MB  BOHEMIA_CITY_PROPS.js
0.9s -> 25.3s   1.51 MB  BOHEMIA_CITY_TILES_04.js
```

1.75 MB should take five seconds on a 3 Mbit link. It took twenty-nine, because it was
sharing the pipe with 26 MB of sprites nobody could see yet.

So the chunks are not tags any more. A 2 KB deferred loader waits until the canvas actually
has a city on it, then pulls them itself, in order, one at a time, and calls the re-bake.
Order is correctness, not speed: every chunk after the first MUTATES what chunk 1 declared.

```
0.8s ->  3.2s            BOHEMIA_CITY_WORLD.html
0.9s -> 10.4s   1.75 MB  BOHEMIA_CITY_TILES_01.js
0.9s ->  1.1s   0.00 MB  BOHEMIA_CITY_TILES_LATE.js
0.9s -> 10.4s   1.72 MB  BOHEMIA_CITY_PROPS.js
DRAWN WORLD at 11.6s   (wait after the tap 10.8s)
```

## TWO SMALLER CORRECTIONS ON THE WAY, BOTH THE SAME MISTAKE

**The warm-up was hurting the impatient player.** A warm fetch that has not FINISHED has not
filled the cache, so when the iframe asks for the same file half a second later the browser
opens a second download of it. Chunk 1 and the props were each in flight twice. The warm-up
now does nothing for the first two seconds, so a player who taps inside that window never
starts one; the tap pauses the queue and the city frame finishing resumes it. And the world
page came OUT of the warm list: `sw.js` is network-first for navigations, an iframe load is a
navigation, so warming it cost 2.68 MB and bought nothing.

**And the gate's own clock was flattering me.** `time_to_play_gate` waited for `#cv` to
EXIST. `#cv` is on line 181 of a 2.6 MB page — the parser reaches it before a single script
has run. It measured "has the page started arriving", not "can he see the city". It now waits
for pixels: a canvas with more than eight distinct colours. That is why the honest number
moved from a bogus 24.1 s to a real 28.7 s before any of today's work counted for anything.

## GATES

```
LATE ART GATE:     21 passed, 0 failed   (mutation: kill the re-bake -> 10 failures)
TIME TO PLAY GATE: 13 passed, 0 failed   (mutation: ceiling 5s -> names the measured 10.7s)
```

`late_art_gate` boots three times — every chunk blocking, the page as shipped, and the art
blocked — switches to CITY MODE and compares. The control has to pass before the answer is
believed. It also names each bank one at a time, because "the picture looks right" would
still pass with a bank nobody can see from the spawn point left empty.

`CEIL_TAP_TO_WORLD_MS` ratchets 30 s -> 16 s.

## WHAT IS LEFT ON THIS

10.8 s is now **CITY_WORLD.html (2.62 MB) + chunk 1 (1.75 MB) + props (1.72 MB)** and nothing
else — 6.1 MB at 375 KB/s is 16 s of transfer, overlapped down to 11. To go lower, one of
those three has to shrink; there is no ordering trick left. The world page is the biggest and
the least examined.

Still open behind that: the cluster seam for golf / railyard / landfill / farm (19 cells), and
the aperture mismatch (13 cells) plus midpoint keep-out (2 cells) from 8/22.
