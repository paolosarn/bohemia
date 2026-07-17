# BOHEMIA — ADDENDUM: OCCUPANCY LAW + LIGHT WIRING (7/16/26)

Slice V10 landed. Audited it line by line (19,251 bytes of code under 2.9MB of
baked art). Three real defects found and killed. V11 shipped the same turn.

## 1. OCCUPANCY LAW (new, locked — extension of an existing law)
The cars-never-overlap rule (street tuner, occupancy-grid collision check) was
never extended to BODIES. In V10 NPCs walked through each other and through
themselves; only the player's cell was defended, and it was defended with a
hack (`|nx-guy.x|+|ny-guy.y|===0`).

LAW: **one body per cell, player included.** `world.passable(x,y,self)` is now
asked WHO is asking, so an actor is never blocked by its own cell. Every mover
carries an `id`. Root-cause fix in the engine (`BOH_SLICE.makeMover`), not a
patch in the slice.

## 2. NPC TIME-STAMP BUG (fixed)
I-MOVE-YOU-MOVE resolved NPC steps with `brain.tick(0,...)`, stamping
`stepAt = 0`. `lerpPos()` then computed k = 1 forever, so in GAME TIME mode
every NPC **teleported** cell to cell while the player slid. Only FREE RUN
looked right. NPCs are now stamped with render time; world state still only
advances on the player's step (law intact — wall clock animates cosmetics only).

## 3. STATIC_LIGHTS WERE DEAD DATA (fixed)
The payload shipped `STATIC_LIGHTS` (3 steady warm emitters, 255/214/150,
r=12 cells, at 2,44 / 16,44 / 9,62 — lantern/stove/flashlight class from light
registry v2). The renderer only ever called `pass.setEmitters(FIRES)`. The
approved emitters were cooked, embedded, and never lit. Now:
`pass.setEmitters(FIRES.concat(STATIC_LIGHTS))`.
Light philosophy law untouched: full-bright scene → whole-frame multiply →
emissives only above darkness. No per-sprite tint.

## REGRESSION GATE
`test_v11.js`, 13 checks, all green: no-overlap, self-never-blocks-self,
chain-step after vacate, wanderer first-tick-synchronizes-only, stamped NPC
interpolates, BEAT=500 (120 BPM law), walk 1.9s / run 0.9s (world clock walk
law), night ambient floor 2.42/2.64/3.52 preserved, day/night split.

## ENGINE SYNC
Slice engine extracted standalone as `bohemia_slice_engine.js`
(BOH_LIGHT + BOH_DAYCYCLE + BOH_SLICE) and inlined identically in V11. Any
future edit syncs both.

## STILL OPEN (unchanged, Paolo's calls)
- **Act-1 grid-power ruling** — decides whether traffic signal / ped signal /
  cane lamp post become live emitters. Held in light registry v2. The three
  wired lights are all non-grid, so this ruling is not blocked by anything.
- Lamp spacing in game cells; #26 tile color conflict; sign/door/fire proof
  verdicts; item scale law; currency logo; suburban kit path; 1,994 unjudged packs.
- Turn-pocket anatomy (art gap + recipe grammar) — from the Vegas lane research.
- Full map pinch-zoom and pan (R=26 slot view-radius cap; V11 still hard-scrolls
  the wrap div every frame).
