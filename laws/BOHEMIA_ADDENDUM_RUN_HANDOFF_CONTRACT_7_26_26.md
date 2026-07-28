# BOHEMIA ADDENDUM: THE RUN/COMBAT HANDOFF CONTRACT (COMBAT lane, 7/26/26)

Mechanism, not canon. This is the exact wire the RUN lane calls when a quest
step turns into a fight, and exactly what comes back. Written so the run lane
never has to read combat's code to use it.

Machine-locked by `gates/combat_lab_gate.js` sections 5 and 6 (the bus is
EXECUTED headless, five encounters back to back, not string-matched).
Maintainer tool: `python3 tools/bohemia_combat_handoff_patch.py` (idempotent,
anchor-asserted, patches COMBAT_B64 + the parent shell in one command).

## THE CALL (parent shell, from anywhere in the alpha)

```js
startEncounter({
  questId:'S01', stepId:'meter_confront',   // who is asking, and which beat
  encounterId:'enc_7',                      // optional; auto-assigned if absent
  objective:'DO NOT KILL THE METER READER', // shown over the board while you fight
  faction:'REDS', reason:'quest', mercy:true,
  playerHP:78,                              // carry the run's health in
  packageId:2,                              // difficulty 0..4
  roster:[{name:'HOSTILE',hp:50,arch:'human'}, ...],   // up to 8; the game decides who you fight
  onEnd:(outcome)=>{ /* the quest step resumes here */ }
});
```

- The combat tab does NOT need to have been opened. `ensureCombatFrame()`
  builds it on demand.
  [CORRECTION, coordinator 7/28/26 — engine reality audit]: the background
  WARMING this section originally promised was REVERTED the same day it
  shipped (7/26, it pre-baked stale clothing — see the note at
  BOHEMIA_ALPHA_0_9.html:6000-6004). The "instant / 14ms" cold-handoff claim
  measured the warmed path and is STALE: today a first fight decodes the full
  COMBAT_B64 at handoff time, plus the fixed 250ms, plus the READY queue.
  Re-landing warming without the stale-clothing bug is routed in
  laws/BOHEMIA_ENGINE_REALITY_MAP_7_28_26.md.
- An encounter posted before the demo is listening is QUEUED and flushed on
  `BOHEMIA_COMBAT_READY` (with a ping retry). It is never dropped.
- `abortEncounter()` calls the fight off (a talk resolved it, a timer ran out)
  and still returns one clean settled outcome.

## WHAT COMES BACK

`onEnd(outcome)`, also parked on `G.encounter.outcome` and `G.lastEncounter`:

```js
{ result:'win'|'loss'|'aborted', reason:'cleared'|'down'|'abort', victory:bool,
  dead:1, spared:2, fled:1, alive:0,      // the mercy mechanics, tallied
  fates:[{eid,name,fate:'dead'|'spared'|'fled'|'alive'}, ...],
  playerHP:41, turns:9,
  encounterId, questId, stepId }          // the context, echoed back
```

Exactly ONE outcome per encounter, whether you cleared it, went down, or the
quest pulled you out. Settling is latched on both sides.

## THE GUARANTEES

1. **CLEAN SLATE.** Every encounter starts from a declared LEAK LIST inside
   HANDOFF CORE: state, corpses, blood, litter, fx, streaks, grenade, wager,
   stamina, recoil/wound, the nerve tracker, an armed sprint. One table, one
   truth. Five fights back to back leave nothing behind (gate-executed).
2. **CONTEXT IN, CONTEXT OUT.** Strings are clamped, package clamped 0..4,
   mercy coerced to a real boolean. Nothing a quest sends can deform the fight.
3. **NO SPLASH.** A quest-driven encounter takes over the demo's TAP TO START
   screen. The demo splash is for someone opening the COMBAT tab to play the
   dial, never what a run walks into.
4. **FAILURE IS LOUD.** A fight that cannot be built posts
   `BOHEMIA_COMBAT_ERROR` with its encounter id and lands in the combat log.
   The run hears the failure instead of waiting forever. The next encounter
   still starts clean.

## THE 13-SECOND STALL (found by verifying on the real surface)

Measured on the shipped alpha in headless Chromium: a cold handoff took
**12.9 seconds** to reach the fight. None of it was the encounter. The combat
demo's head carried a render-blocking cross-origin Google Fonts stylesheet,
which holds the entire inline script until it loads or the socket gives up. On
a phone with one bar that is the run stopping dead at the moment it gets good.
The font is now non-blocking (`media="print" onload`), and the frame warms in
the background: **12,910ms -> 14ms**.

Lesson, already law: VERIFY ON THE REAL SURFACE. Every gate was green while
the handoff took thirteen seconds. A green metric proves non-violation, never
quality.

Proof: `slices/BOHEMIA_RUN_HANDOFF_PROOF_7_26_26.png` (a cold quest handoff,
combat tab never opened, objective on the board, quest health carried in).
