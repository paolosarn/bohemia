> **RULED 7/26, SAME DAY, READ THIS FIRST.** Paolo rejected this study's premise:
> "who said I wanted to test the walking... this does not help me right now."
> Two things follow and both are LOCKED.
> (1) THE LAB DOES NOT STUDY MOVEMENT. A lab emulation is a game's MECHANICS,
> three or more, playable end to end — see
> laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md. LAB-02 (fishing,
> farming, marriage) is what this lane should have shipped first.
> (2) SECTION 3'S FORK IS CLOSED. He ruled Bohemia's movement in the same breath:
> "the world moves when you move, where the world moves when you spend time taking
> an action". Options A/B/C below are ANSWERED —
> laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md. Nothing in section 4
> is a live build item any more except by his say-so.
> This file is kept as the record of what was measured, not as a recommendation.

# LAB 01 — PATTERN NOTE: HOW STARDEW'S TOWN WALK IS BUILT, AND WHAT BOHEMIA SHOULD TAKE

Lane: LAB (law: `laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md`, Paolo 7/26/26)
Emulation: `slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html`
Numbers + citations: `records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt`
Gate: `gates/lab_gate.js`

This is a reference artifact. It ports nothing. Paolo plays the page; if he says
"port this feel", the items in section 4 become build items in the named lane.

---

## 1. THE PLAIN-ENGLISH VERSION (no code)

Stardew's walk feels good for five reasons, and four of them are not the speed.

1. **You are already at full speed on the first frame.** There is no
   acceleration and no deceleration anywhere in the game. Press, move. Release,
   stop. A ramp would feel "smoother" and would make the game feel worse,
   because on a 14-minute day you are constantly making tiny corrections.

2. **The thing that bumps into walls is a small box at your feet**, three
   quarters of a tile wide and half a tile tall — not your body, not your
   sprite. Your head and shoulders pass over fences and counters. This is why
   the town feels roomy while being tiny.

3. **When you cannot go, you still go a bit.** Blocked at full speed? It
   retries at HALF speed. So you keep creeping into a gap instead of stopping
   dead a hair short of it. Nothing announces this. You feel it as "the
   controls are never stuck".

4. **It steers you through doorways without telling you.** If you are walking
   straight at a wall and only ONE SIDE of your feet is actually blocked, the
   game slides you sideways toward the free side. That is why you never snag a
   door frame in Stardew, and why there is no forum thread about the doors in
   Stardew.

5. **Diagonals cost you.** Hold two directions and each axis runs at 70% —
   so the diagonal is the same total speed as a straight line. Without this,
   every player learns to walk diagonally everywhere, and the game silently
   becomes a game about walking diagonally.

Two more that are about the world, not the walk:

- **A door is free.** Walking inside costs a 0.8s fade each way and the clock
  is PAUSED for both. On a 14-minute day, taxing you for going indoors would
  make the player avoid interiors. So it does not.
- **Night is not painted.** The game subtracts pure yellow from the screen on a
  fixed curve, which leaves blue. Nobody painted a night palette. Lamps punch
  holes in the yellow.

**The one thing that will not survive the trip to Bohemia:** Stardew shows
**20 x 11 tiles** on screen at once, on a landscape desktop monitor. Bohemia is
an iPhone held in portrait. At Stardew's real zoom a phone shows **6 tiles
wide**. The walk feel is inseparable from how much world you can see while you
walk, and that is a genuine unsolved trade for us, not a number to copy. The
emulation has a `TRUE 4x ZOOM` chip so both can be felt back to back.

---

## 2. THE CODE PATTERNS (what the master actually wrote)

### 2.1 Speed is a per-frame pixel budget, not a velocity

```js
// Farmer.getMovementSpeed(), Farmer.cs:5606
speed = max(1, (base + buffs) * 0.066 * elapsedMs);   // base 2 walk / 5 run
if (heldDirections > 1) speed = 0.7 * speed;
```

No velocity vector is stored. There is nothing to accelerate. `0.066 * 16.667ms`
is the frame-rate-independence retrofit — the original was raw pixels per tick
and villagers still are (see 2.5).

### 2.2 The collision cascade — the whole "softness" in twelve lines

```js
// Farmer.MovePosition, Farmer.cs:5955-6018, once PER HELD DIRECTION,
// in the order UP, DOWN, RIGHT, LEFT. Each axis is independent.
if (warpAt(nextBox(dir, speed)))        return warp(dir);      // doors first
if (!colliding(nextBox(dir, speed)))    return move(dir, speed);       // full
if (!colliding(nextBox(dir, speed / 2))) return move(dir, speed / 2);  // half
if (heldDirections === 1) {                                    // corner slip
  const q = nextBox(dir, speed);
  const [a, b] = quarterProbe(q, dir);   // first & last quarter of the box,
                                         // across the movement axis
  if (a && !b && free(perpPositive)) move(perpPositive, base * ms / 64);
  if (b && !a && free(perpNegative)) move(perpNegative, base * ms / 64);
}
```

Three facts hide in there:

- The probe box is shifted by `Ceiling(speed)`, i.e. it always looks at least a
  whole pixel ahead. Sub-pixel speeds still test integer collisions.
- The slip is **an eighth of your walk speed** (0.52 px/tick). It is a nudge,
  not a rail. You do not feel steered; you feel un-stuck.
- The slip is disabled the moment you hold two directions, because a diagonal
  already resolves itself by axis.

### 2.3 The camera does not smooth

```js
// Game1.UpdateViewPort, Game1.cs:7735
target = clampToMap(playerStandingPoint - viewportSize / 2);
if (abs(camera - target) > 64) camera = target;          // snap
else camera += sign(delta) * min(abs(delta), getMovementSpeed());
```

The catch-up rate is *the player's own speed*, so the camera is glued to you and
the branch only ever fires on a warp. No lerp, no lookahead. Pixel art plus a
smoothed camera equals shimmer; they just did not do it.

### 2.4 Doors are collision, not interaction

The warp test runs on the **next** position box, before the move. So you walk
into a door; you never press a button, and standing on the tile does nothing.
You are placed one tile in FRONT of the destination door so the return warp
cannot instantly re-fire. Fade is `alpha += 0.02` per tick, 50 ticks each way,
and `shouldTimePass()` is false throughout.

### 2.5 The schedule is dumb on purpose

An NPC gets a time key, A*s to a tile, walks it **one axis at a time** at a raw
`speed` of 2 px/tick, then idles a random 6-12 seconds, re-facing each idle,
with a 600ms breathing bob. No steering behaviours, no crowd avoidance, no
waypoint smoothing. It reads as a person with somewhere to be because it has
somewhere to be at a stated time, not because the motion is clever.

And the asymmetry nobody planned: **villagers never got the ms-scaled speed the
player got.** They walk 1.875 tiles/s against your 2.06 walk and 5.16 run. You
always out-pace the town. It reads as authority. It is an unfinished refactor.

---

## 3. HOW THIS COMPARES TO WHAT BOHEMIA SHIPS TODAY

Measured off `slices/BOHEMIA_RUN_SLICE_7_26_26.html` (the shipped run) and
`engine/bohemia_world.js` / `Loop.makeWalkSurface`:

| | Stardew | Bohemia's run today |
|---|---|---|
| step size | 5.5 px = 1/12 of a tile | **a whole tile, instantly** |
| walk speed | 2.06 t/s walk, 5.16 t/s run | ~9.1 t/s (a step every 110ms) |
| first repeat | none — continuous | **220ms hitch** before the hold repeats |
| diagonals | yes, at 0.7 per axis | none (4 buttons) |
| collides with | a 48x32 box at the feet | the whole cell (OCCUPANCY LAW) |
| blocked | half-step, then corner slip | stop |
| camera | glued, clamped, no smoothing | follows by cell |

So Bohemia's overworld walk is currently **faster than Stardew's run and much
coarser**: it teleports a full tile at a time with a hitch on the first repeat.
That combination — big discrete jumps, high rate, a hitch — is most of why the
overworld reads as stiff. It is not the art.

**RULED THE SAME DAY — the fork below is CLOSED, kept for the record.** Paolo:
"the world moves when you move, where the world moves when you spend time taking
an action." Option 1 is effectively what he described, option 3 is dead, and an
action-cost table is canon he has not written yet
(laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md).

**The deep tension, as it was written before he ruled it:** Bohemia's 120 BPM LAW
(I-MOVE-YOU-MOVE) and OCCUPANCY LAW (one body per cell, including the player)
make the world turn-based on the beat. Stardew's walk is continuous and
sub-pixel and has no turn at all. You cannot have both in the same surface.
The three honest options, all Paolo's call:

1. **Keep the beat, smooth the picture.** The turn still lands on the beat and
   still moves you one cell, but the body INTERPOLATES across the cell over the
   beat instead of teleporting, and the camera rides the interpolation. Feels
   continuous, changes no rule, breaks no gate. Cheapest by far.
2. **Two movement modes.** Free continuous walking (Stardew's model) while
   nothing is happening; the instant a fight or a scheduled beat starts, snap to
   the grid and go turn-based. Two systems, two sets of bugs, and the snap is a
   visible seam.
3. **Free walking everywhere**, which retires I-MOVE-YOU-MOVE for the overworld.
   That is a canon change and is not mine to propose further.

**RULED, not [PENDING Paolo] any more.** He picked the shape himself before this
note reached him: the world moves when you spend time on an action. What is still
his and still unwritten is the ACTION COST TABLE (what a step costs versus a swing
versus a search), and no lane invents that.

---

## 4. WHAT TO PORT (each one is legal today, no law changes)

Ordered by how much feel per hour of work.

1. **INTERPOLATE THE CELL.** (RUN lane.) The turn already resolves on the beat;
   draw the body moving across the cell over the beat instead of jumping. This
   is the single biggest feel change available and it touches only the renderer.
   Stardew's own numbers give the target: never move more than ~1/12 of a tile
   between frames.
2. **KILL THE HITCH.** (RUN lane.) The 220ms grace before hold-repeat exists so
   a tap is one step. Keep the tap behaviour, drop the pause: hold means
   continuous from frame one, exactly like a held direction in Stardew.
3. **A FEET BOX, NOT A CELL.** (WORLD/RUN.) OCCUPANCY LAW is about who owns a
   cell, and it stays. But what the player's *body* is allowed to overlap for
   RENDERING and for near-miss walking can be the bottom half of the cell.
   Fences, counters and kerbs stop reading as walls.
4. **THE HALF STEP AND THE CORNER SLIP.** (RUN lane, needs 1 above to be
   visible.) Both are ~10 lines. On a phone, where the thumb is imprecise, the
   corner slip is worth more to us than it is to Stardew.
5. **DIAGONALS AT 0.7.** (RUN lane.) The run has 4 buttons. An 8-way drag stick
   (the emulation ships one) is one thumb, no reach, and diagonals are free once
   axes are attempted independently.
6. **DOORS AS COLLISION.** (RUN/CITY.) We already have the right doors — the
   7/13 animated bank, 1 wide x 2 tall, per the DOOR LAW. Stardew's contribution
   is that you never press anything: walking into the leaf is the input, and the
   frame >= 5 rule we already have is the "you are through" test. And the fade
   should cost NO game time.
7. **A FREE CLOCK.** (WORLD.) 7 real seconds per 10 game minutes, a 14-minute
   day, and time paused during every transition, is a shipped, proven pacing
   answer for a day-cycle game. Ours is not set. Note the shape, not the number:
   Bohemia's day is a different length and that is canon.
8. **NIGHT AS A SUBTRACTED CHANNEL.** (ART.) Their whole night is one curve and
   one colour subtracted, with lights punched out. For us it is doubly
   attractive: no act-2/act-3 night palettes to paint, and it lands exactly on
   LIGHT=TERRITORY and CLUSTERED POWER — an unlit block is literally the
   absence of a punched hole. The exact colour is ours (yellow is Stardew's
   warmth; a dead valley is not warm), and it must pass the constitution's
   value bands.
9. **SCHEDULE, NOT AI.** (WORLD.) One time key, one destination tile, A*, a
   6-12s idle with a re-face and a breath. That is the whole villager. Our
   ambient encounter director does not need to be smarter than this to read as
   a living street.

## 5. WHAT NOT TO PORT

- **Interiors bigger than their buildings.** Stardew does this everywhere and
  gets away with it. INTERIOR-MATCHES-EXTERIOR is LOCKED, and the emulation
  obeys our law instead (every interior is exactly its footprint), which is why
  its buildings had to be drawn big enough to hold a room. Draw bigger
  buildings; do not fake the inside.
- **20 tiles of screen.** See section 1. Portrait is the constraint we chose.
- **The frame-rate-dependent NPC speed.** Take the RATIO (villagers slower than
  the player) and reject the mechanism.
- **The art.** None of the emulation's pixels are Bohemia's, and none of
  Stardew's are either — every shape on that page is a flat placeholder drawn
  from primitives, in a palette picked to look like nothing we ship.

---

## 6. HONEST LIMITS OF THIS EMULATION

- It is the WALK. No tools, no inventory, no interaction, no combat, no
  festivals, no weather, no multiplayer.
- One town, two interiors, one NPC — exactly what the backlog item asked for.
- The night overlay approximates a GPU reverse-subtract with a blue multiply on
  their exact alpha curve. The curve is right; the operator is not.
- The walk-cycle art is a placeholder leg swing with the master's timing, not
  the master's sprite.
- All movement numbers are measured by the gate in a real browser. All feel
  claims in section 1 are mine and are for Paolo to agree or reject by playing.
