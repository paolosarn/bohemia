# BOHEMIA — ACT-1 ASSET COMPLETION PIPELINE (7/13/26)
Research-grounded plan. Goal per Paolo: shrink his training load to spot-audits,
Claude does the big things, and the step after the step is always known.

## What studios actually do (research)
1. THE CHARACTER IS THE RULER: asset scale is judged against the player
   character, not against tiles — character size is the reference for scaling
   everything.
2. METADATA IN THE NAME: `type_family_name_variant` naming encodes what a
   thing is at a glance (SM_Crate_Wood_01 pattern); names + a metadata
   database (DAM) carry tags for every pipeline stage.
3. PER-ASSET REQUIREMENTS PROFILE: production tracks each asset against a
   matrix (model/texture/animation/vfx/sfx/collision) — an asset is DONE only
   when its whole row is done.
4. PIPELINE STAGES with review gates, not ad-hoc passes.

## THE BOHEMIA PIPELINE (stages, owners, gates)

### STAGE 1 — VISION AUDIT (Claude's own eyes, running NOW)
Claude renders contact sheets of confirmed act-1 assets NEXT TO the RIG-SCALE
RULER (neutral 56px character silhouette, rig proportions — a ruler, not art)
and, using actual vision (not heuristics):
- NAMES every asset (`p_trash_oildrum_01` convention: layer prefix
  g/w/p/d/o = ground/wall/prop/door/overlay + family + name + variant)
- JUDGES scale vs the character (a bottle ≈ knee-high item, a car ≈ 2.5
  characters long) — refining Paolo's BIG/SMALL flags into exact render scales
- FLAGS mismatches (misfiled, mis-familied, style-off)
GATE: Paolo spot-audits ~5% samples; corrections retrain the batch.
Rate: ~50 assets/sheet, 1,927 confirmed = ~40 sheets across cook turns.

### STAGE 2 — REQUIREMENTS MATRIX (Claude drafts, Paolo audits)
Every confirmed asset gets a profile row:
name | scale | footprint | placement | LIGHT (emits? blocks? color) |
ANIMATION (none/loop/interact: fire=loop, door=open+close, water=flow) |
SFX hook | collision | cover | loot | interact verb | act tags
Claude auto-drafts from family+vision (fire barrel: emits warm light, loop
anim, sfx crackle). Paolo audits the DRAFT RULES per family, not per asset.

### STAGE 3 — GAP QUEUES (automatic from the matrix)
Matrix rows with missing pieces become production queues:
- ANIMATION QUEUE: doors needing open/close, fires needing loops...
- LIGHTING QUEUE: emissives needing glow masks + light params
- SFX QUEUE: hooks needing sounds (music-chat pipeline)
- ART-GAP QUEUE: needs purpose-made art (REFERENCE class feeds this)

### STAGE 4 — FACTORY PRODUCTION per queue (Factory Law)
Frame generation for loops (fire/water via palette-cycling + drawn frames),
glow-mask baking for emissives, door open/close frame synthesis — each a
factory with gates; Paolo judges SAMPLES per factory, output banks.

### STAGE 5 — RENDER CONTRACT INTEGRATION
Matrix drives the engine: light params feed the validated lighting model,
anim clips feed the beat-quantized player, scale feeds ITEM SCALE LAW.
GATE: the demo tunnel slice renders with living act-1 assets.

## Standing rule
Claude always states current stage + next stage + the stage after in every
pipeline report. No hallucinated next steps: this document is the map.
