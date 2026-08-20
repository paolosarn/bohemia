# LOADED IS NOT ARRIVED (8/20/26, WORLD lane)

> **CORRECTED THE SAME DAY.** The first version of this record made a false claim, in bold,
> to the director. The correction is the first section, not a footnote.

## THE CORRECTION, FIRST

**I shipped this:** *"his harmonized street bank reaches NO ROAD IN THE VALLEY — 44,376 road
ground cells sampled, ZERO mapping to an approved street tile."*

**It is false.** Measured properly across **192,512 ground cells in 22 district types**:

| door | hits | pools |
|---|---|---|
| `cell.gArtPool` (a pool named on the cell) | **145,128** | `hyard` 90,962 · **`street` 52,904** · `side` 1,262 |
| `SA_MAP[cell.g]` (a colour lookup) | 3,171 | `street` 2,907 · `side` 264 |
| neither (plain generated colour) | 44,213 | — |

In arterial and freeway districts specifically, **7,228 of 14,336 sampled ground cells wear
`street` and 863 wear `side`.** His approved 7/14 bank reaches the roads abundantly. It
always did.

**Two instrumentation errors, both mine, in one gate:**

1. **I counted the wrong object.** `saTex()` blits the approved Image into a canvas **once**
   per (pool, variant), caches that canvas, and returns **the canvas**. After first use the
   renderer draws a cache entry my counter could not recognise — and the cache was already
   warm when the sweep started. Eight working pools looked silent; the three that happened to
   be first-used mid-sweep looked like the only survivors. Hence the false *"3 of 21 draw"*.
2. **I asked one of two doors.** `SA_MAP` is a **colour** lookup and it genuinely returns
   nothing on road cells. The live door is `gArtPool`, an **explicit pool named on the cell**.
   I got a null from the legacy door and reported the art missing.

**A NULL FROM ONE LOOKUP IS NOT A FACT ABOUT THE WORLD.** I wrote *"a probe that checks one
room and reports the house empty is the same disease as the bug it hunts"* into this very
file, caught myself doing it twice while building it, and then did it a third time and
shipped it. The pattern is not that probes are hard. It is that **a negative result deserves
the same scepticism as a positive one**, and I gave it none because it was exciting.

## WHAT IS ACTUALLY TRUE, AND STILL WORTH HAVING

The finding that started this is real and unchanged: **his 348 traffic signal sprites were
loaded, correct, and drawing nowhere for weeks**, while the check that said *"his sprites are
LOADED in the browser"* stayed green. Every art pool is reached through a lookup, and when
the thing that lookup keys on changes underneath it, the art stops appearing and nothing goes
red.

So the gate counts **requests**, not draws:

- **SPRITES** (heroes, signals) are counted at the draw — they are blitted directly and never
  re-wrapped. Heroes: **3,664 draws, 60/60 loaded.** Signals: **6 draws**, zero this morning.
- **POOLS** are counted at the `saTex()` **request** — door-independent and
  cache-independent, so neither a warm cache nor a choice between two lookups can fool it.
  **8 of 21 pools are in active use:** `street`, `side`, `hroof`, `hwall`, `hwindow`,
  `hboarded`, `hdoor`, `hyard`.

**13 pools are never requested once** across 58 renders of 36 district types plus the city
view: `roof`, `wallface`, `wallwin`, `perimeter`, `pocket_v`, `pocket_h`, `cross_ns`,
`cross_ew`, `lane_h`, `lane_v`, `shoulder`, `median_h`, `median_v`. **That part is real:
nothing in the game asks for them.** Several are plausibly superseded — the pocket / crossing
/ lane / median set predates the roads drawing themselves from their own modules — but
"plausibly superseded" is a guess, and guessing is what produced the retraction above. They
are **named and ratcheted** so the question stays visible for whoever owns the streets.

## THE MUTATIONS

- Point the signal code back at the old flag → *"his 7/17 TRAFFIC SIGNALS arrive (0 draws)"*
  fails. **This is the exact historical regression**: the gate would have caught it the day it
  happened.
- Close **both** doors on `street` → the ratchet fails on 14 silent, was 13. Closing only one
  door does **not** trip it, which is correct: the art is still arriving through the other.
  My first attempt at this mutation closed one door, did not bite, and that is precisely the
  evidence I should have followed instead of publishing.

## AND THREE OF MY OWN GATES WERE NOT IN THE SUITE

Found while registering this one. `interior_ground_gate.js` and `hazard_look_gate.js` (both
mine, both 8/20) were never added to the table in `gates/bohemia_gates.py`, so they had only
ever run because I ran them by hand and would never have run again after this session ended.
**A gate that is not in the table is a gate nobody runs — the same silence it was written to
end.** All three registered and verified through the runner, not standalone.

---
**Gate:** `gates/approved_art_arrives_gate.js` (7 checks, two mutations confirmed) ·
**Registered:** `gates/bohemia_gates.py` (+ INTERIOR GROUND, + HAZARD LOOK, + ART ARRIVES)
