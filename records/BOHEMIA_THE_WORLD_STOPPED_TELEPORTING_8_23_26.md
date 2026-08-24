# THE WORLD TELEPORTED FIFTY-SIX PIXELS TWICE A SECOND AND WE CALLED IT WALKING
### 8/23/26, RUN lane. TAB: RUN (walk anywhere).

## THE NUMBER

Holding the pad down and sampling the stage canvas every 40ms, then taking the
**median** change between adjacent frames:

```
standing still            median  0.0%    max  0.0%
walking, BEFORE (GRID)    median  0.0%    max 61.7%   <- that max IS the teleport
walking, AFTER  (SLIDE)   median 58.8%    max 68.1%
```

Before this, **a typical frame of walking was identical to the frame before it**
and then, twice a second, 61% of the screen changed at once. That is not a
figure of speech about how it felt. That is the pixel count.

## WHY IT HAPPENED, AND WHY IT WAS INVISIBLE

The city's camera is player-centred and whole-pixel:

```js
const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);
```

`hx,hy` are CELLS and they change instantly inside `stepOnce()`. So the body
**cannot** move on screen -- it is pinned to the centre by construction -- and
the entire world jumps one whole cell every BEAT. At the walk zoom that is
fifty-six pixels.

It was invisible to every instrument we own because **the animation was already
perfect**. `ANIM` picks a walk frame off `(now-t0)/BEAT`, so the legs cycle
beautifully, on the beat, at sixty frames a second. Every sound plays. Every
step counts. `DAY.step` fires. The clock advances 0.084 minutes a cell. Every
check any gate could ask said the walk was working, and the ground under his
feet was teleporting.

## THE FIX IS A MIGRATION, NOT AN INVENTION

From the run slice, which has carried it since July on a panel nobody opens
(`records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md`, re-opened
by Paolo as something to PLAY rather than read):

> **GRID** the turn lands and you are in the next cell. Today's feel.
> **SLIDE** option 1: SAME rules, the body just slides across the cell over the
> beat instead of teleporting. The pattern note's cheapest option, and the
> ruling explicitly leaves how a spent action is DRAWN to us, **so this changes
> no law**.

In a player-centred camera the same relative motion reads as THE WORLD GLIDING
under a steady body. That is what shipped.

## IT COST NO LOOP, AND THAT IS THE FIND

`animate()` **already** runs a `requestAnimationFrame` loop for exactly one BEAT
after every successful step. It **already** calls `render()` on every frame of
it. It **already** computes `(performance.now()-ANIM.t0)/BEAT` -- the
interpolation parameter has been sitting in the file being used for exactly one
thing: choosing a sprite frame.

Every frame of the walk was already redrawing the whole world. The only thing
that changed is WHERE. No new timer, no new loop, no extra draw call.

The whole-pixel camera is preserved and it had to be: the `Math.round` is
load-bearing (the PIXEL FIX note, and the MOBILE RENDER CONTRACT's ban on
non-integer scale). The glide changes what goes INTO the round, never that it
happens. The camera still lands on a whole pixel every single frame -- it just
lands on a different one sixty times a beat instead of twice a second.

## BOTH CAMERAS, BECAUSE THERE ARE THREE AND ONLY FIXING ONE IS THIS LANE'S BUG

- `renderHuman()` follows the body outdoors -> the CAMERA glides, the body stays
  nailed to the centre of the screen.
- `renderInside()` has **two** branches. A plate small enough to FIT gives a
  static camera, so the BODY is what moves on screen and the body is what glides.
  A plate too big falls back to following the body, so the camera glides.
- `tpCellAt()` derives its origin with the same formula the renderer uses, so a
  tap mid-step hits the tile he can SEE rather than the one the model has already
  moved to. A tap that disagreed with the drawing is a bug you only find by
  tapping mid-step, which nobody was ever going to do by hand.

One helper feeds all four call sites.

## WHERE HE CHANGES IT HIMSELF (8/12)

A chip in the **builder's drawer** (the 🛠 button, RUN tab) cycles GRID / SLIDE
mid-walk. SLIDE is the default -- the good one is what he gets without having to
find it. The choice survives a reload.

The drawer and not the toolbar, on his own 8/16 ruling: *"the run has a lot of
bullshit buttons still around from the early days."* One tap away, never in the
row his thumb reaches for PHONE in.

## THE GATE, AND WHY IT LOOKS AT PIXELS

`gates/walk_feel_gate.js`, registered as **WALK FEEL**. 20 claims.

Mutation-tested twice:

| mutant | result |
|---|---|
| `camCell` never interpolates | **5 claims red** |
| `camCell` interpolates PERFECTLY and the renderer goes back to reading `hx,hy` | **2 claims red** |

The second one is the reason the gate reads the canvas. It is this lane's
most-found bug wearing its best disguise -- **a finished thing with a published
seam and no caller** -- and under it EVERY MODEL CLAIM STAYED GREEN. "The camera
sat between cells for 87.5% of a walked beat" was still perfectly true, because
the camera really was between cells, and nothing drew it there. Only the two
checks that look at the stage canvas noticed.

A gate built on the seam would have shipped a feature that does nothing and
called it proved.

The instrument proves its own eyes before it reports anything: it asserts a
still frame is still (0.0%), and that it can see a 56-pixel jump in GRID (61%),
before it is allowed to claim anything about a 3-pixel one.

**The median is the metric on purpose.** A mean would be dragged up in GRID by
exactly the two frames that straddle a beat boundary -- the frames the feature
exists to delete.

## WHAT IS NOT CARRIED, NAMED RATHER THAN HIDDEN

**HYBRID and FREE.** Continuous movement in the city means a second position
space with its own collision against `cellAt`, its own door handling, and its
own answer for how a continuous body spends a day that is metered **per CELL
ENTERED**. That is a build, not a migration. FREE is additionally the one the
run slice's own note flags as called dead on arrival by TIME IS SPENT BY
ACTIONS. Both stay in the run slice, and both stay owed.

**The overmap.** Stepping in map mode is a real traversal (ten minutes a cell)
and it jumps too, but its camera is the iso one and proving it is a second
surface. `glideStart` declines outright in map mode rather than leaving state
lying around that nothing draws.

## NO RULE MOVED

Time is still spent per cell entered. One step is still one step in the day
ledger. The metronome is still the only clock. Occupancy still resolves on the
true cell. A jump too big to be a step -- a spawn, a `loadCell`, a door -- is
drawn where it lands and never slid across the map.

This is purely how a spent beat is DRAWN, which the ruling leaves to us in as
many words.

---

**Ledger:** `walk_feel` moves to the played surface. 13 of 30 -> **14 of 30**.
