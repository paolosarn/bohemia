# BOHEMIA ADDENDUM: DIAL ODDS TUNING + WORLD SEED DECISION + PERF BUDGETS
7/3/26, overnight autonomous research block. Three horizon items answered
with measured numbers. All tuning DECISIONS remain Paolo's; this file is
the evidence.

## 1. DEAD EYE DIAL: HEADLESS ODDS SIMULATION (the tuning report)
Built `_dialsim.js`: the LOCKED pattern engine extracted verbatim from the
shipped combat module (game file untouched) and run headless against a
model player: watches the needle, predicts one reaction-time ahead
(220ms +/- 50ms human distribution), fires when the prediction lands in
the center killshot window (0.10 rad assumed half-width). 300 trials per
pattern per package. Raw table filed as `_dialsim_results.json`.

### THE PACKAGE LADDER WORKS
Mean hit probability: EASY 78%, NORMAL 74%, HARD 64%, VERY HARD 52%,
BOHEMIAN 33%. Monotonic. The felt-speed convergence does its job at the
package level.

### OUTLIERS FOR PAOLO'S REVIEW [PENDING, Paolo's call on every one]
- avalanche: 0% hit, 2.1% center occupancy at HARD and above. The sim
  agrees with the delete flag: the model player cannot land it, ever.
- EASY-shape betrayal: the speed formula makes LOW-hardness shapes the
  FASTEST at high packages (felt equalization). Three of Paolo's tier-1
  EASY patterns turn brutal at HARD: stagger 2%, hook 4%, hitch 11%.
  Options if unwanted: cap the speed multiplier for tier-1 shapes, or
  re-tier those three.
- Never-hard trio: feint 93%, lurch 100%, piston 100% hit EVEN AT
  BOHEMIAN. Rated tier 3/4 but their motion stays predictable near center
  at any speed. Caveat: the model may exploit predictability a human
  cannot; worth a hands-on check before re-tiering.
- Greed integrity: 33 of 36 NORMAL-pool patterns get HARDER or equal when
  greed is held, as designed. Three get EASIER held: crawl 95>98,
  static 30>44, flutter2 16>26 (doubling those particular rhythms lands
  the needle on center more often). Flagged.

### HONEST LIMITS OF THE MODEL
One strategy only (predictive center intercept). Real players learn the
beat (PHASE locks the kill moment to the 120 grid, rhythm-firing is the
intended mastery path and the model does not use it). Absolute numbers
move with the real killshot arc width; the RANKINGS and the ladder are
the durable findings.

## 2. WORLD SEED DECISION: mulberry32 vs sfc32 (measured, recommended)
`_prngbench.js`, 20M draws each:
- SPEED: mulberry32 254M/s, sfc32 24M/s. 10.6x faster.
- QUALITY: both healthy. Chi-square 242 vs 211 (255 dof, both in band),
  serial correlation -0.0005 vs 0.0012 (both ~0), adjacent-seed
  correlation (the fold-determinism concern: neighboring world seeds must
  give unrelated worlds): deviation 0.005 vs 0.004, both clean.
RECOMMENDATION: mulberry32 for world seeds. Equal statistical quality,
10x the speed, one 32-bit word of state (folds smaller). sfc32 stays on
the shelf if anything ever needs a longer period. Adoption nod
[PENDING Paolo], but the data is one-sided.

## 3. PERF BUDGETS + THE ATLAS QUESTION (horizon items closed with numbers)
Measured on the shipped alpha, headless:
- COLD buildFrame: 13.1ms/frame on desktop node (was 14.8 before tonight's
  pixel-list optimization, shipped: the completeness pass now walks
  precomputed per-part pixel lists instead of scanning the whole grid per
  part per frame). iPhone estimate 3-5x: ~50ms. VERDICT: uncached frames
  are NOT affordable live. The frame cache + runtime warmer architecture
  is load-bearing and correct.
- PRE-BAKE ATLAS: full roster = 86 clips x 8 dirs x 24 buckets = 16,512
  frames, ~44MB compressed inside the HTML. DEAD ON ARRIVAL for a single
  file on iPhone. Core-3 (idle/walk/run) pre-bake would be ~1.5MB but the
  runtime warmer already covers those in the first seconds of play.
  RECOMMENDATION: no build-time atlas, the horizon item closes. The
  warmer is the atlas.
- CROWD STRATEGY (the NPC Factory implication): the frame cache is keyed
  by look, not by character. NPCs SHARING a look blit for free after one
  warm; every UNIQUE look pays its own ~50ms/frame warm cost. The crowd
  plan that follows from the numbers: a small set of NPC look archetypes
  (outfit+tint combos), warmed once each, then unlimited instances.
  Archetype COUNT and LOOKS are creative [PENDING, Paolo's call].
