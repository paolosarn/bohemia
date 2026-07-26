# BOHEMIA — ADDENDUM: FOLD DETERMINISM LAWS
_Filed 7.1.26. Extends the Generational Persistence addendum. Status: LOCKED + tested._

## The problem this closes
The generational fold promised "world = f(seed, choiceLog)" and "store almost nothing"
(3-gen dynasty = 619 bytes). That promise silently broke in two places. Both would
corrupt a 100-year save on reload with zero visible warning at the time it happened.

### Bug 1 — same-beat fold was order-dependent (CONFIRMED, now fixed)
`foldGeneration` sorted choices by `beat` only. Choices sharing a beat kept whatever
order the array happened to be in. For any non-commutative pair (e.g. a standing shift
that clamps at -100 then a +50) the result depended on array order:
- order ab => network standing -50
- order ba => network standing -100

A re-serialized or merged choiceLog could flip that order and produce a different
dynasty from the identical choices. Proven with a test; both orderings gave different
faction standings.

**FIX (LAW):** the fold sorts by `beat`, then breaks ties by choice `id` (stable,
content-authored, globally unique). Insertion order is never trusted again.

### Bug 2 — heir selection consumed a live RNG stream (LANDMINE, now fixed)
`selectHeir(family, rng)` called `pick(rng, n)`, drawing from a live stream. Stream
POSITION is hidden state not in the 619 bytes. A mid-generation reload re-runs from a
different stream position and picks a DIFFERENT heir for the same family. It hadn't
bitten yet only because `runDynasty` didn't call it — an orphan waiting to corrupt.

**FIX (LAW):** heir selection is derived, not streamed.
`selectHeir(family, seedText, gen)` computes its index from
`xmur3(seedText + '::heir::' + gen + '::' + tag + '::' + candidateIds)`.
Same family + same seed => same heir, forever, regardless of reload timing. Verified
stable across repeated calls AND seed-varied (different seeds can pick different heirs,
so it's not hard-locked to child index 0).

## The governing law (applies to ALL future fold-time logic)
> The fold must be a pure function of (seed, choiceLog) and nothing else.
> Any randomness must be derived deterministically from the seed plus the choice's
> own identity — never from a live RNG stream, wall clock, iteration order, or any
> state not stored in the choiceLog.

If you ever add a stochastic fold-time decision (mutation, event roll, trait pick),
derive it the same way heir selection now does. Do not hand it a stream.

## Proof (tests written, all green)
- `test_fold_corruption.js` — 3/3 pass: tie-order independence, heir reload-stability, heir seed-variation.
- `test_dynasty_determinism.js` — 200/200 identical dynasties across 200 deterministic
  shuffles of the same choiceLog. Readouts stable (monument, district texture, two-ledger finale).

## Signature change (breaking, note for wiring)
OLD: `selectHeir(family, rng)`
NEW: `selectHeir(family, seedText, gen)`
When the generational fold gets wired into the master loop, pass the run's seed string
and the generation number, not an RNG function.

## Engine
`bohemia_engine.js` — md5 `c01f9f0afe2d8ea5cb1c8bb0f429229c`. Bundle self-check green,
all 10 modules. Generations exports 11 keys (`pick` removed, `derivedIndex` internal,
`foldFromSave` + `amalgamationModel` added).

---

# PART 2 — THE SAVE↔FOLD BRIDGE (built same session, LOCKED + tested)

The hardened fold was an orphan — nothing called it. This wires it into the save
model so it actually runs on load, and connects the two-ledger principle to the
Amalgamation's knowledge model as enforced code, not authoring.

## Save schema v3 → v4 (migration added, old dynasties safe)
Choice log entries grew from `{id, beat}` to `{id, beat, gen, recorded, effect}`:
- `gen` — which generation made the choice (fold sorts by it).
- `recorded` — the two-ledger flag. true = public/feed (the Amalgamation sees it);
  false = off-ledger (tunnels, family, private — the blind spot). Defaults true.
- `effect` — the fold-summable payload (standing/build/invest/karma/virtue/etc), or null.

Old v3 entries default to `gen:1, recorded:true, effect:null` — safe because pre-v4
choices were all early, public, non-folding acts. Verified: a v3 save migrates and
folds without error.

## `recordChoice(save, id, beat, opts)` — now stamps the ledger at log time
`opts = {gen, recorded, effect}`. `gen` defaults to `save.act`, `recorded` defaults
to true (world is recorded BY DEFAULT; going dark is the deliberate exception).

## New Generations exports
- `foldFromSave(save)` — runs the full 100-year dynasty straight off the save's
  choice log. Pure: same save => same folds, every load.
- `amalgamationModel(save)` — the antagonist's knowledge = the RECORDED ledger only.
  Returns `{knows, blindSpot, modelledFolds, predictedFinal}`. The blind spot is
  enforced by the flag: `recorded:false` choices are simply absent from what the
  machine folds. Its `predictedFinal` is a deliberately INCOMPLETE picture — missing
  every off-ledger move. That gap is, mechanically, the finale win condition.

## Proof (test_save_fold_bridge.js — 15/15 green)
Fresh save → record 7 choices across 3 gens on both ledgers → serialize → deserialize
(migrate+validate) → fold. Confirmed: unrecorded choices still shape the real dynasty;
the Amalgamation model is blind to exactly the 3 off-ledger moves (can't see the
undercity pact, undercounts the sacrifice vow, underestimates final karma); v3 saves
migrate and fold; repeated loads fold identically.

## Still PENDING Paolo (unchanged, now unblocked by the wiring):
- Which choices are authored `recorded:false` (rule candidate: tunnels/compound/family
  = unrecorded; feed-facing/public/faction = recorded).
- Does the player SEE which ledger a choice lands on (feed-ping vs no-ping).
- Can an off-ledger choice get exposed (surveillance leak = threat-escalation event).
