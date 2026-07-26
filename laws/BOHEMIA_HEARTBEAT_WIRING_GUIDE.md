# BOHEMIA — HEARTBEAT WIRING GUIDE
### 7.1.26 — how to move the rig and combat off their own clocks onto the one heartbeat. This is a WIRING job, not a rewrite. Each file keeps its own draw loop; it just stops computing its own beat.

---

## THE SITUATION

Three files each keep their own 120 BPM timing:
- `bohemia_core.js` — the real deterministic Clock (the sim heartbeat).
- `BOHEMIAN_RIG.html` — its own `performance.now()` math in `procedural()` for walk/idle.
- `bohemia_combat_v9.html` — its own clock for the Dead Eye Dial pattern motion.

They agree by coincidence. One hitch and they drift. `bohemia_heartbeat.js` is the single clock they all subscribe to. 23 tests confirm it's the same math as the core Clock, clamps hitches identically, and is deterministic + serializable.

---

## THE RULE

**There is one `heartbeat`. Nothing else advances time.** Presentation layers subscribe:
- `heartbeat.onBeat(fn)` — whole-beat game logic (advance a turn, step the sim).
- `heartbeat.onFrame(fn)` — per-frame render/interp (draw the dial swing, interpolate the walk).
- `heartbeat.beatsFloat()` — continuous beat position, the one thing a pattern samples.
- `heartbeat.phase(beatsPerBar)` — 0..1 through a musical bar.

One place calls `heartbeat.tick(performance.now())` per frame — the top-level game loop. In standalone tools (the rig by itself), that tool's own rAF loop calls tick.

---

## RIG: THE SWAP

The rig's `procedural(R)` currently computes phase from its own timestamp:

```js
// BEFORE (rig owns its clock):
let t0 = performance.now();
function procedural(R){
  const ph = ((performance.now() - t0) / 1000);
  const sw = Math.sin(ph * Math.PI * 2 * (120/60) / 2);
  // ...walk/idle use sw...
}
```

Swap the phase source to the heartbeat. The walk cycle is one full swing per 2 beats, so sample `beatsFloat()`:

```js
// AFTER (rig reads the one heartbeat):
function procedural(R){
  const sw = Math.sin(heartbeat.beatsFloat() * Math.PI);   // one swing / 2 beats, on the beat
  // ...walk/idle use sw exactly as before...
}
```

And in the rig's draw loop, drive the heartbeat once per frame (only in the standalone tool — in the full game the top-level loop owns this):

```js
function draw(){
  heartbeat.tick(performance.now());   // <-- add this line; the ONE clock advance
  // ...existing draw code unchanged...
  requestAnimationFrame(draw);
}
```

Include the script before the rig's code:
```html
<script src="bohemia_heartbeat.js"></script>
```
Then `const { heartbeat } = window.BohemiaHeartbeat;` at the top of the rig script.

That's it. The `sw` value is now phase-locked to the same beat the sim and combat use. Nothing else in the rig changes. The 8-direction skinning, the side-locked bones, the baked art — all untouched.

---

## COMBAT: THE SWAP

The Dead Eye Dial's `tickPat` motion samples time to move the pattern. Wherever it currently reads its own elapsed time / phase, replace that read with `heartbeat.beatsFloat()` (for continuous pattern position) or `heartbeat.phase(n)` (for bar-relative patterns). The 52 patterns don't change shape; they just read their clock from the heartbeat instead of a local one. The killshot camera, being a per-frame presentation effect, uses `onFrame(alpha => ...)` for its interpolation.

Because `tickPat` is the shared motion engine that the combat file and `dead_eye_dial_directions.html` both use (per the combat notes, they will merge into one game), moving `tickPat` onto the heartbeat means BOTH inherit the shared clock in one change. This is exactly why the wiring matters before the merge: one clock, then combine.

---

## FULL-ENGINE INTEGRATION (later, when core drives everything)

When the game runs the full engine, there should be literally ONE clock object. Wire the heartbeat to the core Clock so they share position:

```js
heartbeat.fromCoreClock(coreClock);   // heartbeat adopts the core's beat/acc
```

Then the top-level loop advances the core Clock (which steps the sim) and the heartbeat mirrors it for presentation. Because both use identical math (verified in tests), and because `snapshot()/restore()` round-trips the exact beat, a save reproduces the precise beat every subscriber was on — the dial mid-swing, the walk mid-stride, the sim mid-turn.

---

## WHY THIS ORDER

The heartbeat had to exist before the rig-render layer and before the combat merge, because both of those want to move off the same beat. Building it now means:
1. The rig animation (walk/run/idle from the neutral skeleton) is born on the shared clock.
2. The combat merge (`v9` + `directions` into one game) inherits one clock instead of reconciling two.
3. The save system already round-trips the beat, so determinism is free.

Wiring is a two-line swap per file. The rewrite risk is zero because the draw loops, patterns, and art are all untouched — only the *source of the beat* changes.

---

*BOHEMIA — Heartbeat Wiring — 7.1.26*
*One clock. Everything subscribes. The rig walks, the dial swings, and the sim turns off the same 120 BPM heartbeat, and a save reproduces the exact beat all three were on.*
