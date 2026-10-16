# THE WORLD SURVIVES WITHOUT ITS ART

**8/25/26 — WORLD lane. Block all 26 MB of sprites and the city still renders a playable
world: ground, character, HUD, cold open, quest card, movement pad, zero errors. Yesterday
the same test was a black screen and a `ReferenceError`. That was the one thing standing
between this build and progressive loading, and it is gated now so it cannot rot.**

---

## FIRST I KILLED AN ITEM OFF MY OWN LIST

The handoff's number two was "the alpha crosses the wire twice — may be 4 MB for free,
**check before acting**". Checked. Three visits in one browser, counting what the server was
actually asked for:

```
visit 1   alpha requested 2x   (8.17 MB)   worker installing
visit 2   alpha requested 1x   (4.08 MB)
visit 3   alpha requested 1x   (4.08 MB)
```

So it is **first visit only**, not every load. And it is **deliberate**: the alpha reloads
once on `controllerchange`, and that reload is load-bearing. The first navigation happens
*before* any worker exists, so it can be served stale from the CDN or the phone's HTTP cache
— which is exactly the bug the ONE-LINK LAW was written about. The reload is what guarantees
the first visit renders the newest deploy.

**Not free. Struck off the list rather than left there looking like a win.** (Side finding
worth having: on visits 2 and 3 *only the alpha* is requested — every chunk comes from cache.
A returning player downloads 4 MB total.)

## THE EXPERIMENT THAT DECIDED THE TURN

Progressive loading is the only thing left that touches the 40 MB total. Yesterday's
measurement said the blocker was ugly: block the bank and the world is a black void with
`ReferenceError: HERO_SRC is not defined`.

But that error is about **names**, not about art. So, without touching anything on disk —
rewrite the page in flight, inject the eight names as empty containers, block the whole bank:

```
state : {"om":"object","tp":"object","tpKeys":0,"cellGround":"#8a8a86","canvases":2}
errors: []
```

Zero errors, and a screenshot showing a **playable world**. Ground, the character, DAY 1 ·
06:00 · SUBURB · ON FOOT, the cold open, THE METER READER card, GET UP, the movement pad,
BIKE, SLEEP. Only the texture missing.

**One bootstrap line was the entire prerequisite.**

(The probe needed one fix to be honest: the route never fired until the service worker was
blocked, because the worker fetches navigations itself and those requests never reach page
interception.)

## WHY IT IS NOT A BOOTSTRAP LINE

The obvious implementation — declare the names up front, make the chunks assign — would have
broken a lot. **Five gates and four tools read the declaration form**: `city_tab`,
`full_res`, `interiors` and `street_source` grep the assembled document for
`const SA_TILES=`, `const IN_DOOR_B64=` and friends.

So the shape is **declare once, mutate after**:

- **Chunk 1 declares all eight names**, and fills every one small enough to sit there
  (SA_TILES, SIG_TILES, JAMB_W, JAMB_E, IN_DOOR_B64 — 1.75 MB), so those greps still find
  real content.
- The three big ones (HERO_SRC 2.83, DOOR_ANIM 2.54, TP_TILES 20.9) are declared **empty**
  and filled by later chunks through mutation — `Object.assign`, a push loop, `TP_TILES[fam]=`
  — and **nothing after chunk 1 ever re-binds a name**.

9 chunks now, none over 4 MB, `EQUIVALENCE: IDENTICAL`.

## THREE THINGS THE TOOL GOT WRONG, EACH CAUGHT BY SOMETHING

**1. It could not re-run.** The first version read the monolith, which it then deleted — so
changing the emission shape meant digging the old file out of git. It reads its own chunks
back now, and that path has a trap of its own: the chunks are mostly *mutations*, so the
declaration scanner would have read `TP_TILES` as the empty object chunk 1 declares and
silently thrown 21 MB away. They get **evaluated**, not scanned. (And in one `eval`, not two
— `const` inside an eval is scoped to that eval, which is a `ReferenceError` I walked
straight into.)

**2. A sizing function that was right for one type and silently wrong for another.** Chunk 2
came out at **5.37 MB** — under the measured 6 MB wall, so the guard did not fire, but with
almost no margin, which is the exact thing this tool's own comments say not to ship. The
cause: element sizes used `len(item)`, which is the byte length of a base64 string and the
**element count** of a nested array. `DOOR_ANIM` is a list of frame lists, so it measured
itself at **0.00 MB while actually being 2.54 MB**. Same shape of bug as a sampler that steps
over half a boundary. Sizes are `len(J(item))` now: 9 chunks, largest 4.00 MB.

**3. It put all eight declarations on one line.** `street_source_gate` finds `const SA_TILES=`
and reads **to the end of the line**, so it swallowed the following declarations and the
street table stopped parsing. The consumers were written against a line-per-declaration file;
that shape is preserved now. 16/1 → 18/0.

## WHAT IS GATED

`time_to_play_gate` grew two claims and runs a second boot with chunks 02+ blocked:

```
ART BLOCKED: world builds=true  families=0  errors=0
TIME TO PLAY GATE: 11 passed, 0 failed
```

Mutation-tested by blocking chunk 01 as well, which reproduces the original failure exactly:

```
ART BLOCKED: world builds=false  families=undefined  errors=2
FAIL: THE WORLD BUILDS WITH ITS ART BLOCKED  -- ReferenceError: TP_TILES is not defined
FAIL: and it does it with NO page error  -- ReferenceError: HERO_SRC is not defined
```

Gated because it is **invisible**. Nothing a player sees depends on it today. It would rot
the first time somebody moved a declaration out of chunk 1, and the next person to attempt
progressive loading would find a black screen and no idea why.

## WHAT I DID NOT SHIP, AND THE INSTRUMENT THAT FAILED

The last step — mark chunks 2..N `defer` so the blocking payload drops from 28 MB to 1.75 MB
— is **not shipped**, because I could not prove the deferred art actually gets *drawn*.

I ran three modes (normal / deferred / blocked) and compared page screenshots. All three came
back **byte-identical**, including blocked — the DAY 1 card sits over the canvas, so I was
comparing the overlay. I switched to reading the canvas directly and printed a control:
*normal must differ from blocked, or the canvas is not where the art lands*. **The control
failed.** `normal === blocked` was true, so that canvas is not the world surface either.

What is known: with `defer`, all 24 families arrive and there are zero errors. What is not
known: whether the world ends up textured or stays flat. A `defer` shipped on a broken
instrument is exactly the trade this week keeps punishing, so it waits for a probe that can
tell a textured world from an untextured one.

## GATES

```
time to play 11/0 (mutation-tested)   walked surface 11/0 (8,595 / 93.3% / 99.9%, unmoved)
street source 18/0   city tab 64/0   interiors 42/0   hero wire 145/0   dooranim 10/0
doorjamb 15/0   blob integrity 107/0   integration 128/0   current slice 6/0   map tab 9/0
alpha loads 20/0   props 76/0
```

`full_res` is 12/1 — **and it is 12/1 on plain origin/main too**, measured in a worktree
rather than assumed. Pre-existing, not this change.

The build stamp deliberately does **not** move: the world renders identically, so claiming a
visible change would send him looking for something that is not there.

## WHAT COMES AFTER

1. **A probe that can see the world's pixels.** Everything about progressive loading now
   hangs on it. Dismiss the DAY 1 card first, find the canvas the ground actually draws to,
   and prove normal ≠ blocked before trusting any comparison.
2. **Then `defer` on chunks 2..N.** 28 MB → 1.75 MB blocking. The world already survives it;
   the only open question is repaint.
3. Cluster seam for golf / railyard / landfill / farm — open, correct, 19 cells.
4. Aperture mismatch (13 cells) + midpoint keep-out (2 cells) from 8/22.
