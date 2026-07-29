# BOHEMIA — COMBAT: THE TWO I DID NOT BUILD, AND EXACTLY HOW THEY GET BUILT (7/29/26)

Paolo sent two more mid-turn. Both are good, both are ruled, **neither is built**,
and this file is why plus the design so the next turn starts writing code.

Five things shipped this turn already (night range, the perk allowance, the
grenade throw, the warehouse, the chest anchor + approved streets). Adding two
more untested features to a pile of five he has not seen yet is the pile-up
STOP PRODUCING exists to prevent. He needs to *play* five before he gets seven.

---

## 1. THE COVER POSE FOLLOWS THE DIAL

> "when the deadshot dial is on someone and they have cover. i want their cover
> animation to be tied to where there deadshot dial lands perfectly in the
> center. so that killshot they better be out of cover. and when its in miss
> territory they are under cover if that makes sense! i still like how they
> animate already just keep in mind when its deadshot dial time i want them to
> pop out when its supposed to be the killshot type shit."

**This is the best idea in the message and it is nearly free.**

### Why it matters more than it sounds
Right now the dial is an abstraction sitting on top of the fight. The needle
sweeps, you press, a number decides. The man you are shooting at is doing his own
thing on his own timer and the two are unrelated.

Tying his cover pose to the needle makes the dial **a picture of the truth**: the
needle is not a skill check drawn over him, it IS how exposed he is right now.
Dead centre means he is out. Miss territory means he is tucked. So the player
stops reading a gauge and starts reading a man, which is the difference between a
minigame and a fight.

### It is already 90% there, exactly like the killshot allowance was
Everything needed exists:

- `G.angle` is the live needle offset from centre, every frame.
- `z.hZ` / `vz` / `hitz` are the kill, vital and hit zone half-widths, already
  computed from the same expressions the shot resolves on.
- The enemy already has baked poses for exactly these two states: the crouch/tuck
  frames and the peek/rise frames. `enemyFrame(e,now)` already picks between them
  off `peeking(e)` / `firing(e)` / `e.gcov`.

### The build
1. During `G.phase==='aim'`, for the man being aimed at only, derive an exposure
   value from the needle: `expo = clamp01(1 - |G.angle| / hitz)`. 1 at dead
   centre, 0 out in miss territory.
2. Feed that to the frame picker so the target reads TUCKED at low expo and
   POPPED at high expo, using the frames that already exist. Hysteresis is
   already solved in this codebase (the arm-hold gate) and the same trick applies
   so he does not strobe on a fast sweep.
3. **Do not touch the rig, the clips or the BAKED poses.** This SELECTS an
   existing pose per frame. It is combat logic, not animation work, which also
   keeps it clear of the animation revamp running in another session.

### The one thing to be careful about
It must not change WHO CAN BE HIT. Cover, damage and exposure resolve off the
existing geometry, and this is a READ of the needle, not a new input to it. Same
rule the under-deck x-ray shipped under: a ghost is a read, not a rule change.

---

## 2. CARS ON THE FIELD, AND THEY ARE 2 x 3 TILES

> "we have hella cars on file that are aproved. and when u slide a car in it
> should be 2 tiles by 3 tiles so yeah"

**HIS RULING, RECORDED: A CAR IS 2 TILES BY 3 TILES.** That is now the footprint,
and it needs to reach TF-CMB-003 (the dead-car tile form), whose E section
currently defers to the `_vehicle` size helper. His number wins over the helper;
the form gets amended when the car lands.

### What it changes about the arena, which is the reason to want it
Every cover object in this fight is ONE TILE. A car is the first **multi-tile**
piece of cover in the game, and that is a genuinely different object:

- it blocks a line for a **length**, not a point, so it makes a lane rather than
  a hiding spot
- you can be at the **engine end** (hidden to the chest) or the **boot end**
  (hidden to the waist) — one object with two different cover values, which no
  block can do
- on the street arena it parks in the stalls and along the kerb; in the warehouse
  it belongs at the dock doors

### The work, honestly
Placement and collision are the easy half and follow the existing pillar rules.
The real work is that `G.pillars` entries are circles with a radius, and a 2x3
car is a rectangle. Cover, the dash-path block and the vault check all currently
ask "how far is this point from that circle". Multi-tile cover needs those to ask
a rectangle instead. That is a small, contained change to about five functions,
and it is worth doing properly rather than faking a car as three overlapping
circles.

### And the shopping check has to happen first
He says "we have hella cars on file that are approved". The 7/28 shopping check
found `car_wreck` x20 in `banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt`, which
self-describes as "derived pool for the bake factory; corpus art, no new canon"
and is NOT a row in the approved asset index. So before anything is drawn:
**open that bank, render the 20, and look at them at 2x3 tiles.** If they read at
the 45 view, this is a wiring job and nothing gets cooked. If they do not, that
is the evidence TF-CMB-003 needs, and it goes in the form.

That check is the first thing the next turn does, because it decides whether this
is an art ask at all.

---

## BUILD ORDER WHEN HE SAYS GO
1. The cover pose follows the dial. It is nearly free, it needs no art, and it
   makes the dial mean something it does not mean today.
2. The car: shopping check first, then rectangle cover, then placement.
