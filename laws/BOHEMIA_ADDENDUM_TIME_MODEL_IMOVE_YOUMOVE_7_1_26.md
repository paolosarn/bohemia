# BOHEMIA — ADDENDUM: TIME MODEL — "I MOVE, YOU MOVE"
_Filed 7.1.26. The core time philosophy of the whole game. Status: LOCKED + built + tested (34 tests green across scheduler + integration)._

## THE LOCK (Paolo's call, this session)
Bohemia is a **roguetime / "I move, you move"** game — the RF4 / WazHack / Enter-the-Chronosphere lineage Paolo fell in love with. The world advances only when the player acts. BUT with one hard refinement Paolo locked emphatically:

> **Only GRID POSITION waits for the player. Animation NEVER stops.**

Nobody is ever a frozen statue. Every sprite plays its current animation continuously on the 120 BPM heartbeat — dancers dance, idlers breathe, and a walker **walks in place (treadmill)** while the world is settled. The instant the player takes a grid-step, the world advances one turn and actors translate tile-to-tile (the heartbeat interpolates the slide so it's smooth and on-beat).

Paolo on the walk-in-place fork (keep walk-anim in place vs drop to idle when not translating): **"A ABSOLUTELY A NO FUCKING WAY IN HELL IT WOULD BE ANYTHING BUT."** A walker keeps its walk cycle in place; it never drops to idle just because the world isn't traveling. LOCKED.

## TWO CLOCKS, TWO JOBS (both required, neither replaces the other)
- **HEARTBEAT (120 BPM, already built):** the render/animation clock. Drives every sprite's current animation, always, never gated. This is what keeps the world alive-but-in-place.
- **SCHEDULER (bohemia_scheduler.js, built this session):** the world-turn / grid clock. Advances grid position exactly one world-turn per committed player action. The player is "actor #0" and is the only actor whose decision blocks on real input — until the player commits, not one grid-step happens anywhere.

## ANIMATION TAXONOMY (Paolo confirmed the loop-vs-terminal split)
Every animation declares its end-behaviour:
- **LOOP** (walk/run/idle/dance/sway/fidget): plays forever, returns to itself. Runs in place on the heartbeat regardless of turn state. The treadmill.
- **RETURN** (flinch/reload/gesture): one-shot, then falls back to the prior loop.
- **TERMINAL** (headshot death/KO): one-shot, actor enters a new RESTING state and stays there.

**Terminal anims play through LIVE, immediately, on their own heartbeat beats — NOT gated by player movement.** Paolo: a death is a body resolving, not a grid move, so gating a corpse's collapse on the player's footsteps would look insane. A dying actor leaves the grid queue at once (state RESOLVING) and its ragdoll runs to rest via the frame-tick even if the player never moves again; then it's DOWN (corpse). Ties into the already-built Verlet ragdoll (Animation/Ragdoll addendum) and becomes an entities delta (permanent) in the full game.

## THE SUN, RESOLVED (this answers the day/night question cleanly)
There is **no wall-clock day/night.** Time-of-day, if/when built, is a readout of **world-turns elapsed** (the scheduler's `turn` counter). The sun advances a notch per turn; solar output / heat / brownout timing read off turn-phase. **The world literally cannot advance toward night while the player stands still** — thematically perfect for a frozen city waiting on one person to act. The turn counter is saved (v5), so day-phase survives reload and is fully deterministic.
[Still PENDING Paolo — the earlier day/night fork: does time-of-day drive MECHANICS (solar output, brownouts, night entities) or stay cosmetic? Now trivial to wire either way onto the turn counter.]

## ENERGY MODEL (how different speeds work with no wall clock)
Standard roguelike energy scheduling ("treat the hero as just another actor"). Each actor banks `energy` at its `speed`; crossing `STEP_COST` (100) earns one grid-step. speed = STEP_COST → steps every turn; half → every other turn; double → twice per turn (a fast animal). Deterministic, saveable, no timers.

## WHAT'S BUILT (bohemia_scheduler.js — 24 tests, + 10 integration tests)
Actor model (tile/target/slide/energy/speed/life/anim/animMode/ai), `commitPlayerAction` (the turn), slide resolution, `tickAnimations` (resolves RETURN/TERMINAL live), `playOneShot`, turn snapshot/restore. Proven: world frozen till commit; walk-in-place holds across animation frames with zero grid steps; fast/slow energy speeds; walls block without phase-through; terminal death plays through with no player action and the corpse never moves; RETURN returns to its loop; full determinism; turn save/restore.

## WIRING (into the loop scaffold — done)
New `bootScheduler` step (Layer 3, beside heartbeat). Loop exposes `commit(ctx, intent)` = the one entry point that advances the grid world a turn. Loop `tick()` runs `tickAnimations` every frame so one-shots resolve live. `captureSave` persists the world-turn. Save schema bumped **v4→v5** (adds `turn`, old saves default turn 0); migration + fresh-save + validate all updated and regression-green.

## FILES
- `bohemia_scheduler.js` — md5 `e64e091f72af76003e47bf6e0727c62b`
- `bohemia_loop.js` — md5 `e38a824058974e64537fac8ffc4d0a73`
- `bohemia_engine.js` — md5 `c0aea921ce9f06e7fd87d156d5304b32` (save v5)

---
*BOHEMIA — Time Model — 7.1.26*
*The city runs in place, breathing, waiting. It only travels when you do. Death is the one thing that doesn't wait.*
