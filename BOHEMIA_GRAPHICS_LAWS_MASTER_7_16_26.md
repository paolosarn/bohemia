==============================================================================
BOHEMIA GRAPHICS — LAWS, ADDENDA, INTEGRATION & RESEARCH MASTER
Built 7/16/26 from the graphics chat restore.
26 LAW/CANON + 13 INTEGRATION + 8 RESEARCH + 6 PROCESS + 2 IDEA. Every doc the graphics chat produced.
55 files bundled.
==============================================================================


==============================================================================
### FILE: BOHEMIA_ABSORPTION_PREFLIGHT_7_14_26.md
### MD5: b6b5fe28fa3a0a8b00076e05593ca3cd  |  1.3 KB
==============================================================================

# BOHEMIA — ABSORPTION PREFLIGHT (7/14/26)

Dry-run rehearsal of the 5-step surgery. NO alpha was produced (ONE-ALPHA law); this verifies the real session with Paolo will be zero-surprise.

## 1. ANCHOR CHECK (uploaded BOHEMIA_ALPHA_0_9.html, 29MB)
- `</script>` (engine block close): 3 occurrence(s) — OK
- `BAKED` (BAKED presence): 28 occurrence(s) — OK
- `bohemia_music` (music repo start): 3 occurrence(s) — OK
- `scheduler` (scheduler): 2 occurrence(s) — OK
- `addEventListener` (game boot): 33 occurrence(s) — OK

## 2. NAMESPACE COLLISIONS
- `BOH_LIGHT`: 0 existing occurrence(s) — CLEAN
- `BOH_DAYCYCLE`: 0 existing occurrence(s) — CLEAN
- `BOH_SLICE`: 0 existing occurrence(s) — CLEAN
- `BOH_BLOCKGEN`: 0 existing occurrence(s) — CLEAN
- `BOH_OMBRIDGE`: 0 existing occurrence(s) — CLEAN
- `BOH_PLOTGEN`: 0 existing occurrence(s) — CLEAN
- verdict: ALL CLEAN — modules insert without renaming

## 3. INSERTION BUDGET
- engine bundle: 31KB raw; alpha is 29MB -> +0.11% size. Negligible.

## 4. TEST GATE
- bohemia_graphics_tests.js: 74/74 green standalone; requires /mnt/project/bohemia_overmap.js for bridge checks (present in main project). Portable as-is.

## 5. GO/NO-GO
- GO pending Paolo. Surgery remains a with-Paolo session in the MAIN project per ONE-ALPHA law. This preflight retires the unknown-unknowns.

==============================================================================
### FILE: BOHEMIA_ADDENDUM_ACT1_COMPLETION_PIPELINE_7_13_26.md
### MD5: e572a540eec51766ce1710faa33d6c8a  |  3.1 KB
==============================================================================

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


==============================================================================
### FILE: BOHEMIA_ADDENDUM_ACT_TEXTURE_PROGRESSION_7_10_26.md
### MD5: 671e0bf54138b767de9b6c13bbaa947d  |  2.6 KB
==============================================================================

# BOHEMIA — ACT TEXTURE PROGRESSION (Paolo vision, 7/10/26)
Paolo: "everything that's an act one just becomes an upgrades into act two and
an act three textures."

## The vision (design direction, shaping the library now)
The city's LOOK graduates across the three-dynasty arc: act-1 textures
(rawest collapse: rubble, rags, scavenge) upgrade into act-2 (stabilizing,
patched, functional) and act-3 (rebuilt + lightly cyberpunk under the
Amalgamation's shadow). Same places, evolving skins — ties directly to
BUILDING TIER ASCENT and generational persistence: the world visibly heals
or hardens as decades pass.

## Library consequence
Every pack/asset gets an ACT PLACEMENT from Paolo's mega re-categorization
sweep: ACT1 / ACT2 / ACT3 / NOT-IN-BOHEMIA / MAYBE. Act tags become the
procgen's texture-era selector: zone era -> allowed texture pools.
Paolo favorites noted: apocalypse packs + city packs = the game's heart.

## THE SWEEP EXECUTED (7/10/26) — the library has a timeline
Paolo judged ALL 294 packs in one sitting. Tile-level result:
- ACT 1 (collapse): 2,643 tiles — trash, rubble, cracked/burnt ground,
  barricades, camps, scrap, zombie remains, chain link, hazard signage,
  crates, survival gear, dead trees. The heart of the game, as he said.
- ACT 2 (stabilizing): 938 — cafes and coffee culture, furniture, animals,
  mailboxes, safehouses, first flowers/plants, markets maturing.
- ACT 3 (rebuilt + lightly cyberpunk): 1,105 — sci-fi walls/furniture, neon,
  holograms, robots/drones, labs, machines&tech, cables, AND full greenery:
  grass, gardens, fountains, flower paths, spring trees.
- NO (never in waking Bohemia): 1,781 — fantasy/medieval/pirate/classical
  statuary confirmed dead at scale.
- NIGHTMARE POOL: 213 — statues/gargoyles, occult, psychological, hell
  decorations, volcanic, flagged walls. The nightmare idea now has a real
  art budget.
- UNDECIDED (?): 1,994 — return pool for future sittings.

## DESIGN PATTERNS PAOLO'S TAPS REVEALED (filed as direction, his to confirm)
1. VEGETATION = HEALING ARC: grass/flowers/fountains/spring trees are ACT 3;
   dead trees are ACT 1; first modest plants ACT 2. The world literally
   regrows across the dynasty century. (Some crops/gardens A1 = survival
   farming vs act-3 ornamental green.)
2. TECH = ACT 3 at scale: every sci-fi/neon/hologram/robot/lab pack landed
   act 3 — lightly-cyberpunk end-state confirmed across ~40 packs.
3. CAFE CULTURE = ACT 2 signature: coffee, pastries, awnings, menus,
   signage — normal life returning is act 2's texture.
4. LIGHT SOURCES SPLIT: fire barrels/emergency lights A1; lanterns/torches
   NO (medieval); neon A3. Light itself tells the era.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_ALPHA_ABSORPTION_PLAN_7_14_26.md
### MD5: 0ae770af05b03da1b1e382c77a952015  |  2.7 KB
==============================================================================

# BOHEMIA — ALPHA ABSORPTION PLAN (7/14/26)
How the demo-slice systems enter BOHEMIA_ALPHA_0_9.html. Grounded in actual
alpha recon (30.3MB single file; modules confirmed: face renderer
(renderFace), ANIMBEATS beat table with the 7/2 animation verdicts,
CombatBridge with headless LOD resolver, city-view LOD notes).

## What ships in (the modules, all tested)
1. bohemia_light_pass.js — LIGHT PHILOSOPHY LAW as code (5/5 tests).
   Alpha has NO lighting today (zero lightmap/composite hits) -> clean drop,
   no conflicts. Hook: the world-view draw path renders FULL-BRIGHT into a
   scene buffer, then pass.apply() multiplies the whole frame; flame/emissive
   sprites draw after. Phase feeds off the existing beat clock (ANIMBEATS
   already defines beats -> phase=(sub%8)/8). levelAt(gx,gy) is the future
   stealth/AI-vision primitive.
2. bohemia_blockgen.js — street/block generation (9/9 law tests: lane width
   2, line colors, crosswalks at intersections only, staggered lamps, car
   no-overlap, no-single-street variety, freeway preset, determinism).
   Hook: city view block expansion / exploration map gen.
3. BOHEMIA_STREET_POOLS_HARMONIZED (v6, Paolo-evidence orientation table) +
   BOHEMIA_SEAM_FIXED_SURFACES — LAW: alpha tile sources switch to processed
   banks; raw masters are NEVER rendered (baked-outline black-grid law).
4. BOHEMIA_DOOR_ANIM_BANK (27 approved, leaf-pixel law) — door entities:
   2-beat swing, collision flips at frame >= 5.
5. BOHEMIA_FIRE_FLICKER_BANK (34 loops) + BOHEMIA_ACT1_LIGHT_SOURCES v3
   (meter-grounded radii; ambient_night = Paolo's +10% values; electric
   entries PENDING his act-1 grid ruling).

## Order of surgery
1. Add light-pass module + scene-buffer refactor of world draw (biggest
   render change, do first, test in isolation).
2. Register emitters from LIGHT_SOURCES v3; wire flicker loops to beat.
3. Swap tile sources to processed pools (grep any raw repo reads, kill).
4. Door entities from the bank.
5. blockgen behind the city view (block -> cell grid -> renderer).
Each step: ENGINE SYNC LAW (sync inlined engine everywhere) + regression
gates (draw-order static check from LIVE SLICE V3 ports as an alpha test).

## LAW / CAUTION
ONE-ALPHA LAW: actual surgery happens on the canonical alpha with Paolo
present (main project), not on this chat's uploaded copy — this chat ships
the tested modules, banks, and this plan. The rig swap-in (BAKED.pose walker
into the slice's proxy slot) rides the same session since the rig engine
lives inline in the alpha.

## Next / next-next (standing report)
NEXT: continue act-1 completion between Paolo verdicts (vision sheets when
the channel cooperates; house factory v2 the moment his part roles land).
NEXT-NEXT: absorption session per this plan, rig swap-in included.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_ANIMATION_PIXEL_LAW_7_13_26.md
### MD5: 29b7c7316c3c636b71cd054ab766e07a  |  1.0 KB
==============================================================================

# BOHEMIA — ANIMATION-PIXEL LAW + FLASH DIRECTION (Paolo, 7/13/26)

## ANIMATION-PIXEL LAW
Every animation must pinpoint exactly which pixels it touches. Moving parts
(the LEAF) animate; structure (jambs, posts, headers, frames, borders) stays
frozen. A gate's bars rise inside untouched posts. Double doors = TWO leaves,
split at the center seam, left leaf travels west, right leaf travels east,
frame untouched. Leaf rects auto-detected per sprite (edge-profile jamb/header
detection), Paolo verdicts correct detections.

## AESTHETIC DIRECTION (Paolo-stated)
One-man-army, early-Flash / Newgrounds energy: cheap programmatic animation
is ON BRAND and low-key liked — "as long as it's done to 120 BPM everything
really is gonna be OK." Charm over polish; the beat is the polish.

## Consequence
Factory v3 implements leaf detection + two styles (gate_rollup, double_swing).
Applies beyond doors: every animated prop (fans, vents, gauges) declares its
touched-pixel region; static structure never wiggles.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_ART_LAWS_VERDICT_BATCH_7_10_26.md
### MD5: b1ae2be2341e972f94ce188693447f5c  |  3.0 KB
==============================================================================

# BOHEMIA — ART LAWS FROM VERDICT BATCH (7/10/26, Paolo, LOCKED)

1. **BLUR LAW**: any naked/undressed base rig render must have blurred
   genitalia and nipples. Applies engine-wide.
2. **DAMAGE-LEVEL TAGS**: ground tiles carry a wear grade (wash 0-1 = damaged,
   2-3 = cleaner was the seed observation). Placement can grade wear across an
   area — worn where traffic/collapse, cleaner where sheltered.
3. **WATER CONTEXT VARIANTS**: same water reads NICER as lake/river, DIRTIER
   as sewer-floor water. Water is context-dressed, not one texture everywhere.
4. **DOOR RARITY (Vegas canon)**: the real Vegas tunnel system has very few
   doors. Doors are scarce, meaningful objects. Sizes 2x2 or 3x2 MULTICELL
   with LEFT/RIGHT facings — never 1x1. Current demo doors flagged for re-cut.
5. **HATCH GLOW (lighting client)**: hatch purple = fiber-optic cables with
   radiant glow, texture flowing. Executes fully when the lighting system
   exists; hatch is its first named client.
6. **GRAVEYARD confirmations**: homeless grime skin ramps DEAD; NeuroLink
   reveal renders v1+v2 DEAD. Reveal look redesigns only inside the Universal
   Reveal System with the fiber-optic direction.

## CORRECTION — DOOR FACINGS (Paolo, 7/10/26)
Left/right facing = the door faces EAST or WEST (sits in a side wall). That is
NOT a mirrored front sprite. An east/west door renders EDGE-ON: width compresses
to a FRACTION of the frontal sprite (narrow profile strip against the side wall).
Mirroring only swaps which side the profile sits on. Claude's first attempt
(mirrored front doors) was wrong and is dead.

## NO-TRANSFORM LAW (Paolo, 7/10/26, after two dead door attempts)
Directional variants are NEVER produced by geometric transforms of front art
(no mirror, no squish, no shear). A view from the east/west is a SEPARATE
DRAWING — same principle as the rig's 8 hand-mapped facings. Claude sources
directional art from packs drawn that way, or flags it as a real art pass.
Mirror is allowed ONLY where canon already blesses it (rig W = baked mirror of
E, per Paolo's own mapping) — never as a shortcut Claude invents.

## SEAM PHILOSOPHY (Paolo, 7/10/26)
Visible tile borders are a FEATURE — they teach players the grid-based system.
The goal is NOT invisible seams. The fix only softens the harshest edges, with
a light touch that never smears texture. Grid readability > seamlessness.

## EAST/WEST DOOR REFERENCE (Paolo, photo, 7/10/26 — LOCKED)
Paolo circled the LEFT FRAME EDGE of a frontal door sprite: THAT strip is what
an east/west door looks like — the door's own painted frame-edge sliver,
roughly frame thickness wide. NOT a squish (dead), NOT separate tall-narrow
door art (all 14 candidates dead). Method: CROP the painted edge strip from
approved frontal door art (real pixels, no resampling). Width options offered
to Paolo; he picks.

## SEAM VERDICT (Paolo, 7/10/26)
Seam v1 (offset-wrap, stronger heal) APPROVED — "like that a lot more."
Lighter v2 direction dead. v1 applied to all demo ground tiles in the bake;
originals remain re-cuttable from HD masters per manifest law.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_BEYOND_SIDEWALK_RESEARCH_7_14_26.md
### MD5: 02ebc44f208c2df86c692d4f80c60f52  |  2.6 KB
==============================================================================

# BOHEMIA — BEYOND-THE-SIDEWALK ZONE RESEARCH (7/14/26)
Arms Paolo's zone-law rulings. SIDEWALK SANCTITY LAW stands: this zone
begins at the sidewalk's back edge. Nothing here is designed by Claude —
this is real-Vegas anatomy with sourced numbers, converted to game cells
(CELL_M = 0.75, so 10ft ≈ 4 cells, 20ft ≈ 8 cells, 30ft ≈ 12 cells).

## PER-DISTRICT ANATOMY (real Vegas, sourced from City of LV Title 19 + FHWA)
| district | what sits past the sidewalk | real numbers | game cells |
|---|---|---|---|
| SUBURB (R-1) | front YARD, then house face; driveway cuts to garage | front setback 20 ft, side 5 ft | ~8 cells of yard |
| SUBURB compact/small-lot | shallower yards | 15 ft / 10 ft fronts | 6 / 4 cells |
| ESTATES/GATED | deep yards | 30 ft front | 12 cells |
| TRAILER | pad rows | 10 ft front | 4 cells |
| COMMERCIAL (legacy sprawl — most of 2020s Vegas fabric) | PARKING LOT fronts the stores; buildings sit deep on the lot | FHWA: commerce sprawls along arterials; classic strip-mall pattern | parking apron ~10-30 cells, then storefront run |
| COMMERCIAL (modern code) | building AT the street edge (min setback), parking pushed to side/rear | LV code: "strong street edge... parking to side or rear of buildings" | 0-2 cell setback, storefront at walk |
| DOWNTOWN | zero-setback storefronts (overlay exempts setbacks) | Downtown overlay exemption | storefront at the sidewalk's back edge |
| STRIP/RESORT | attraction frontage, then porte-cochere entries | porte cochere min front 30 ft | 12+ cells of frontage spectacle |

## THE FORKS FOR PAOLO (all PENDING, none Claude's to call)
1. Commercial pattern: legacy parking-front (period-accurate 2020s fabric),
   code-forward storefronts, or a mix keyed to cell quality/age?
2. Suburb yard depth per class (8-cell default from R-1?) and what fills a
   post-collapse yard (dead lawn, dirt, junk, garden plots as citybuilder
   output?).
3. Driveway law (suburb curb cuts) — exists or abstracted away?
4. Parking lot ground: we have cracked concrete pools; stall striping art
   is an open gap like turn pockets.
5. Downtown zero-setback means building faces ARE the sidewalk's back wall
   — door/window walls directly walkable-adjacent (big for the demo feel).
6. Where ruins live: inside these zones per district (yards hold collapsed
   houses, lots hold collapsed storefronts) — placement laws per zone
   pending.

## WHY IT MATTERS
This zone is where the citybuilder builds, where doors lead inside, where
the player lives. Its laws + the house part-role labels together unlock
building generation. One page, ten rulings, and the frontier opens.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_BLOCK_CANON_7_13_26.md
### MD5: 1ed1c6683df28d390b9492a03e67065b  |  1.2 KB
==============================================================================

# BOHEMIA — BLOCK CANON (Paolo, 7/13/26)

## The structure
A NEIGHBORHOOD / BLOCK = one grid cell of the city (overmap) view. Move up
one grid, that's the next block. The block is the unit of world generation,
loading, and identity.

## Block character (Paolo): STREET-SCENE-FIRST
Most blocks are STREETS with things happening in them, buildings on the
sides. Block types named by Paolo so far (open set, his to grow):
- STREET (default: road + flanking buildings + street life/chaos)
- FREEWAY (his sweep comment "on the freeway" signs already tagged)
- UNDERPASS
- WASH (flood channel — canon tunnel-world surface expression)
- SEWER ENTRANCE (his manhole-cover comment = the block's door downward)
- RESIDENTIAL (tract housing — one type among many, not the default)
Casinos noted earlier as their own animal.

## Pipeline consequence
The neighborhood/worldgen pass generates BLOCK TYPES, not just housing:
each type = a recipe (which act-pool textures, which prop families, which
street furniture, which entrances). House Factory remains queued but is one
recipe among many; STREET RECIPE is the priority recipe because most blocks
are streets. Paolo judges generated blocks via output galleries.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_CELL_IS_PLOT_WALLED_SUBURBS_7_14_26.md
### MD5: 2eee39521a67bc1f8c2aa6e62d5b7e96  |  1.8 KB
==============================================================================

# BOHEMIA — CELL-IS-PLOT + WALLED SUBURBS (Paolo rulings, 7/14/26)

## 1. CELL-IS-PLOT LAW (LOCKED)
Each overmap grid cell IS its assignment, wall to wall:
- COMMERCIAL cell = a parking lot with storefront (legacy Vegas pattern
  confirmed: parking fronts the stores).
- SUBURB cell = a WALLED-OFF suburban neighborhood (the whole 128x128
  plot is the tract).
- Streets (built + certified) are the connective tissue between plots —
  "the most important cause they connect everything else."

## 2. WALLED SUBURBS LAW (LOCKED)
Real Vegas truth Paolo stated: decent and nice suburbs are SURROUNDED BY
WALLS (the CMU block perimeter walls lining every arterial). Only the
rough parts of town have houses whose driveways connect directly to the
arterial.
- Game mapping: suburb cell quality decides its frontage:
  - decent/high quality -> PERIMETER WALL around the tract, gated entry
    point(s) onto the street.
  - low quality ("shit parts") -> OPEN frontage, houses + driveways meet
    the arterial directly.
  - [PENDING Paolo: the exact quality threshold; entry-gate count/placement
    rules; wall art (block wall tiles) — likely candidates exist in wall
    banks, unverified.]

## 3. SCALE ANSWER (standing canon, Valley Scale Law 7/6)
1 overmap grid = 128 x 128 fine tiles = 16,384 tiles = 96m x 96m
(CELL_M 0.75). Valley = 96 grids across = 12,288 tiles = the researched
6h23m walk (World Clock Walk Law: 4 min game time per grid).

## CONSEQUENCE FOR GENERATION (next builds)
- Suburb plot generator: perimeter wall ring + gate(s) + interior tract
  (interior awaits house part-role labels).
- Commercial plot generator: parking apron fronting a storefront run
  (stall striping = queued art gap alongside turn pockets).
- Both consume the plot's own seed (deterministic, bridge-style).


==============================================================================
### FILE: BOHEMIA_ADDENDUM_CURRENCY_LOGOS_IDEA_7_13_26.md
### MD5: 75ed15020865814243adb4cde9ae485b  |  0.5 KB
==============================================================================

# BOHEMIA — CURRENCY LOGOS (IDEA SEED, Paolo 7/13/26, NOT LOCKED)
Judging Survival props #39/#45/#46, Paolo: "LOGO FOR SUPPLIES 1/3 currency?",
"LOGO for energy currency?", "Logo for medicine currency?"

Seed: three resource currencies — SUPPLIES / ENERGY / MEDICINE — each with a
logo drawn from these prop silhouettes. Matches the survival-accounting
economy. Status: idea only, awaiting Paolo's design pass. Tiles flagged in
the confirmed set as logo references.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_DISTRICT_MERGE_LAW_7_14_26.md
### MD5: b04c3d2ec2008508135356f3f90be215  |  1.3 KB
==============================================================================

# BOHEMIA — DISTRICT MERGE LAW (Paolo, 7/14/26)

## THE LAW (LOCKED)
Adjacent same-type overmap cells MAY work together as ONE merged plot:
- 2 touching residential -> one walled neighborhood spanning both grids
  (single perimeter ring around the union, NO wall between them).
- 4 touching residential -> one big tract (256x256 fine cells).
- Same for commercial (shared parking field + longer storefront runs)
  and industrial.
"MAY" = merging is not guaranteed: per-cluster seeded decision,
deterministic from the overmap seed. [PENDING Paolo: merge probability
default (starting at 60%), max cluster size beyond 2x2, whether quality
must match to merge.]

## REAL GROUNDING
This is literally Vegas fabric: master-planned communities span many
blocks behind one continuous wall; shopping centers share parking fields
across parcels. Single-parcel = the exception in the suburbs, not the rule.

## ENGINE CONSEQUENCE
- plotgen: generate(kind, seed, quality, {shape}) where shape = cluster
  rectangle (1x1, 2x1, 1x2, 2x2). Wall ring wraps the UNION. Gates on
  street-facing outer edges. Commercial apron spans the full frontage.
- bridge: clusterFor(overmap, x, y) detects the maximal same-district
  rect (cap 2x2), seeded merge coin, returns the cluster + which cell of
  it (so any cell queried renders its slice of the merged plot).


==============================================================================
### FILE: BOHEMIA_ADDENDUM_DUAL_SCALE_PRECEDENTS_7_14_26.md
### MD5: 18ddad6bbd624e293a7d0a0a5f05aa00  |  1.6 KB
==============================================================================

# BOHEMIA — DUAL-SCALE WORLD DESIGN PRECEDENTS (research note, 7/14/26)
Paolo asked: has any open-world RPG designed a world at both the
individual walkable level AND the city-builder level like this?

## THE PRECEDENT MAP
- DWARF FORTRESS: deepest ancestor. One generated world; fortress mode
  builds, adventure mode walks the same world (including your dead forts).
  But: two separate MODES, ASCII abstraction, no unified loop.
- CATACLYSM: DDA: architecture twin (overmap -> streamed fine layer, the
  pattern Bohemia borrowed). Building is base-camp scale, no city
  assignment, no dynasty.
- DARK CLOUD / DARK CHRONICLE (PS2): closest FEEL. Collect town pieces,
  place them, then WALK the town you assembled. Rebuilding the world is
  the game. Small towns, menu placement, no open world between.
- KENSHI: build-anywhere + walk-everywhere in one continuous world, squad
  RPG. No abstraction layer, no plot-class grid.
- FALLOUT 4: mainstream open-world RPG + settlement building at
  individual level. Settlements are points, not a city grid.
- ACTRAISER (1990): oldest two-layer ancestor (god-game growth + action
  levels), layers are different spaces.
- (Adjacent: Mount & Blade, Suikoden castles, Dragon Quest Builders,
  Songs of Syx — each holds one piece.)

## THE UNCLAIMED SYNTHESIS (what Bohemia is)
Assignment-grid citybuilder (CELL-IS-PLOT law: every grid IS a plot class)
+ every plot REAL and walkable in ONE continuous world (Continuous Walk
Law) + Stardew pixel density (Valley Scale Law) + generational roguelite
with persistent consequence. Every piece is individually proven by a
shipped game; the weld is unclaimed. Grounded AND novel.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_GAME_FIRST_LAW_7_10_26.md
### MD5: febbc766f3ae2f47aecbc5383ce4a02a  |  1.3 KB
==============================================================================

# BOHEMIA — GAME-FIRST LAW (7/10/26, Paolo, LOCKED)

## The law
Nothing is built to fit the demo. Systems, assets, palettes, pipelines, and
tools are built to fit the WHOLE GAME; the demo is a slice that borrows them.
If a choice helps the demo but shapes the system wrong for the game, it is the
wrong choice. Paolo's words: things oriented to fit the demo best will make
the game suck — orient to the game and the demo inherits quality.

## Scale correction (canon color)
- The demo map Claude drafted was far too small ("not expansive at all").
  Real scale: the player walks 1-3 minutes through dark tunnel — hundreds of
  cells of travel, darkness, some tech on you, useless pickup items along the
  way. (Map itself remains Paolo's/proc-gen's to shape, per Map Law.)
- The hatch/Network build likely sits in ACT 3: lightly cyberpunk mixed into a
  fucked-up sewer-homeless situation under Vegas. Creepy, cool, combat,
  people talking — the whole enchilada. It is CONTENT, not the project's
  center of gravity.

## Standing consequences
- Every system ships at library/game scale first (lighting, reveal, seams,
  variants, categories) — demo consumes, never dictates.
- Feedback requests to Paolo: ALWAYS an interactive with export. Never a
  question, never a picture.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_ITEM_SCALE_LAW_7_13_26.md
### MD5: aefb5e92c5870fbaacf92e212d664a4c  |  1.2 KB
==============================================================================

# BOHEMIA — ITEM SCALE LAW (draft from Paolo's 848 flags, 7/13/26)

## The finding (systematic, from the Great Sweep)
Paolo's TOO-BIG/TOO-SMALL flags split cleanly along one fault line:
- HAND OBJECTS at 1 cell read TOO BIG: jars, bottles, food, drinks, supplies,
  loot, blood splats, screens, small props. (542 flags)
- STRUCTURES rendered as 1-cell props read TOO SMALL: cars, building parts,
  broken walls, roofs, fences, chain link, market stalls, dead trees. (306)

## The law (draft — Paolo confirms)
1. ITEM_SCALE: hand-object families render at ~0.55 of a cell (sub-cell
   sprites, centered or scatter-anchored). One knob, engine-wide:
   `ITEM_RENDER_SCALE=0.55`, tunable per family.
2. STRUCTURE_UPSCALE: structure families never render as 1-cell props —
   they take real footprints (cars 2x3 LAW; wall/roof pieces render as
   SURFACE cells in their layer; fences as run pieces; stalls/trees
   multicell per family).
3. Paolo's per-tile flags in BOHEMIA_ACT1_CONFIRMED_SET override any default.

## Consequence
The prop layer gets believable scale hierarchy for free: a bottle is small,
a car is big, a wall is a wall. My fp=source-aspect assumption is retired.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_LEARNED_RULES_7_10_26.md
### MD5: ee60b3cc1692c20b341737646b6d9d76  |  2.3 KB
==============================================================================

# BOHEMIA — LEARNED RULES FROM PAOLO'S AUDIT (7/10/26)

## The directive (Paolo, memory-locked)
Paolo's item feedback = training data. Claude generalizes and propagates
automatically. He teaches once; Claude applies library-wide, forever.

## Rules extracted from the 90 verdicts (permanent)
1. **FENCE ≠ WALL** — fences (metal/iron/chain) are their own category.
2. **PATH tiles are DIRECTIONAL** — grass-stone paths read N-S (or E-W);
   direction is part of the tile's identity, like door facings.
3. **PLANTS ARE OVERLAYS** — vegetation sits ON a real ground texture, never
   baked into a fake grass square of its own.
4. **RUBBLE IS FLOOR OVERLAY** — debris reads as on-the-ground.
5. **ROCK ≠ DIRT** — texture identity over category convenience.
6. **ALPHA TILES VIOLATE THE LAWS** — lava tiles and purple glowing bricks
   live inside the alpha's baked categories. Purity applies to STRUCTURAL
   surfaces (walls/floors/roofs/doors); emissive PROPS (torches, fire barrels)
   are legal. Gate scoped accordingly.
7. **ITEMS are a real category** — hand objects (broom, crowbar, pickax, map,
   diamond, ingot, suitcase, coffee pot) don't belong in building categories.
   Concept group: propagates by suggestion only, Paolo's eye finalizes.
8. **STREET SIGNS**: stop signs / triangle signs belong to a street-sign
   family (wall-signs vs standing-signs distinction noted).
9. **SHOW IT BIG** — several verdicts were "too tiny to tell." All future
   interactives show tiles large / tap-to-zoom. (memory-locked)
10. **Fountain-scale objects are MULTICELL** (A69) — big props span cells.
11. **Delete junk glyphs** — tiles that are just a number/letter graphic die.

## What was executed (same turn)
- Scoped purity sweep of alpha structural categories: 1,387 gate-suspects
  recorded (alpha_struct_violations) — suspects, not auto-kills (gate over-
  fires on warm rust; Paolo-exemplar matching is the trusted detector).
- Exemplar propagation with per-group thresholds, one group per tile:
  AUTO-APPLY tier 591 corrections (lava 6, purple-brick 24, fence 17, bones 11,
  rubble 72, path 181, plants 280); SUGGEST tier 2,947 (items+signs).
- Raw 90 verdicts saved verbatim in the verdicts file (permanent training set).

## New categories proposed (one-tap approval pending Paolo)
fence (exists — gets the moved tiles), path (NEW), item (NEW), street_sign (NEW)


==============================================================================
### FILE: BOHEMIA_ADDENDUM_LIGHTING_RESEARCH_7_10_26.md
### MD5: b5fd41d40159be44b7832f278e7ddaf3  |  2.7 KB
==============================================================================

# BOHEMIA — LIGHTING SYSTEM RESEARCH: MINECRAFT MODEL (7/10/26)

## Paolo's directive
Research the Minecraft lighting system. Bohemia could use lights like that but
"maybe even more intense" — and NOT necessarily Minecraft's fast falloff that
forces tons of sources. Decisions below are PENDING Paolo.

## How Minecraft does it (researched, verified)
- 16 integer light levels, 0 (pitch black) to 15 (max).
- TWO channels per cell: SKY light and BLOCK light; rendered brightness = the
  MAX of the two, never the sum. Light is non-additive — a second torch only
  extends coverage, it never stacks brightness.
- Block light spreads by FLOOD FILL: minus 1 per cell of taxicab distance,
  producing a diamond-shaped pool around each source (diagonal costs 2).
- A torch emits 14, so it lights ~14 cells; cave-proofing means a source every
  13-14 cells. This is the "light dies quick, need lots of sources" feel Paolo
  noted.
- Opaque cells stop light dead. Some materials attenuate instead (water cuts
  light by 2 per cell). Sky light is 15 under open sky, dimmed by weather
  (rain 12, thunderstorm 10), moonlight ~4.
- Light level gates GAMEPLAY, not just visuals: hostile spawns need darkness,
  crops need light. The light map IS a rules layer.

## Why this model fits Bohemia's engine
- Integer levels on a grid = cheap flood-fill, deterministic (FOLD-safe),
  quantizes cleanly with the 120bpm world.
- Two-channel max() = day/night city on the surface, ZERO sky channel in the
  sewers — the demo becomes pure block light, dread by arithmetic.
- Light as a RULES layer is very Bohemia: agents ambush below a light
  threshold (the dark literally spawns danger, like Minecraft mobs), crops in
  the city-builder need light, curfew/blackout events change the map.

## Bohemia design options [ALL PENDING PAOLO]
1. FALLOFF RATE: (a) Minecraft-exact -1/cell; (b) HALF falloff -1 per 2 cells
   (sources reach twice as far — "more intense", fewer sources needed);
   (c) per-source profiles (candle falls fast, floodlight carries).
2. INTENSITY CEILING: keep 0-15, or 0-31 for stronger-than-Minecraft sources.
3. SOURCES (canon-flavored): fire barrels, work lights, neon remnants, the
   HATCH's fiber-optic purple (a light SOURCE — ties to the lighting-client
   note), NeuroLink reveal glow as a tiny emitter on revealed agents.
4. WATER ATTENUATION: sewer water cutting light by 2/cell (Minecraft-style).
5. GAMEPLAY GATES: agent ambush threshold, crop growth, visibility radius.

## Demo implication (once Paolo picks)
Sewer demo = no sky channel. The wash entrance glows with daylight at the
mouth, decays into the tunnel, and the last light before the hatch room is the
hatch itself, purple. The descent-into-dark pacing becomes literal math.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_LIGHT_PHILOSOPHY_7_14_26.md
### MD5: 0f6008bc58fc210487e8bca693b2bffc  |  0.7 KB
==============================================================================

# BOHEMIA — LIGHT PHILOSOPHY LAW (Paolo, 7/14/26)

"Everything can be touched by light. Nothing is above light."

## The law
Lighting is a WHOLE-FRAME FINAL PASS, never per-sprite tinting. Render
order, forever:
1. Draw the entire scene FULL-BRIGHT (grounds, props, doors, characters,
   UI-less world content).
2. Multiply the whole frame by the LIGHTMAP (ambient + all emitters,
   flicker wobble included).
3. ONLY emissives draw after the darkness pass (flames, glow cores,
   screens) — because they ARE light.
No sprite may ever be drawn after step 2 unless it emits. Per-sprite light
tinting is BANNED (it is how things escape the light).

## Engine consequence
Render contract layer 8 = this pass. Alpha integration inherits it.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_LINE_COLOR_LAW_7_13_26.md
### MD5: 83f85b9edd9dd6388710ce08b1ae854f  |  1.1 KB
==============================================================================

# BOHEMIA — LINE COLOR LAW (Paolo, 7/13/26)

## The law
1. YELLOW/ORANGE lines ALWAYS separate DIRECTION of traffic (medians,
   centerlines). Never used between same-direction lanes.
2. WHITE lines separate LANES moving the same direction.
3. ORIENTATION INTELLIGENCE required: line tiles must run WITH the road
   axis — N-S road uses N-S-running lines, E-W road uses E-W-running lines.
   A marking crossing the travel direction is only legal as a CROSSWALK.

## Grounding
Matches real US/Nevada road marking standards (yellow = opposing traffic
boundary, white = same-direction lane boundary) — the game's streets read
true to anyone who has driven.

## Enforcement
- Anatomy pool v2 metadata: every line tile carries color_class
  (yellow_direction | white_lane) + line axis per rotation variant.
- Generator rule: median/centerline rows draw ONLY yellow_direction tiles in
  road-axis orientation; lane-divider rows ONLY white_lane tiles in road-axis
  orientation; crosswalk = perpendicular by definition.
- Any future line art (purpose-made lane markings on the art-gap queue)
  inherits the law at birth.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_NEIGHBORHOOD_READINESS_7_13_26.md
### MD5: 9fd4911a500ea3c79ed003eb2a3b1ba9  |  2.1 KB
==============================================================================

# BOHEMIA — MASS NEIGHBORHOOD READINESS (7/13/26)
Paolo's question: are we set up for procedurally-mass-produced Vegas
neighborhoods? Answer: the machine is half-built ON PURPOSE and the missing
half is now named and queued.

## Why Vegas tract housing is procgen's best friend
Real Vegas neighborhoods ARE mass production: a handful of house models
repeated thousands of times with palette/mirror/lot variation, behind
cinderblock yard walls, on arterial-grid streets. Our pipeline maps 1:1:
few prefabs x VARIANT FACTORY (palette shifts) x lot placement = endless
authentic blocks. (Favela-method covers post-collapse informal growth on top.)

## HAVE (foundations already built)
- Seamless walls (303) + roofs (123 across 3 packs) + windows (116) +
  doors (346, footprint law) + fences (119) + yard material (253 rock/gravel/
  grass) + mailboxes (53!) — mailboxes are pure suburbia.
- Variant factory (validated) = tract-house palette variation for free.
- Prefab Factory law + building parts taxonomy + tier ascent (act upgrades).
- Reference-grid law (real arterials) + valley scale law + transitions +
  render contract + act placement master (era texture pools).

## GAPS (named, queued — no pretending)
1. HOUSE FACTORY (the assembly layer): tiles -> complete stamped house
   prefabs (footprint, wall runs, roof fill, door+window placement rules,
   N variants per model). THE missing middle. Queue: next major build.
2. SUBURBAN KIT ART GAPS (library has ZERO): garage doors, stucco walls,
   driveways, cinderblock yard walls, AC units, palms. These are THE Vegas
   signifiers. Paths: (a) REFERENCE-class production (draw purpose art from
   closest refs), (b) re-dress existing walls/doors via variant ops,
   (c) Paolo sources packs. [PENDING Paolo priority call]
3. NEIGHBORHOOD GEN PASS (worldgen Phase B): roads->lots->house stamps —
   designed, not built; house factory is its prerequisite.

## ORDER (the step after the step)
Stage 1 vision audit (running) -> Stage 2 requirements matrix -> HOUSE
FACTORY build -> suburban kit gap production -> neighborhood gen pass ->
Paolo judges GENERATED BLOCKS via output galleries (his map authority intact).


==============================================================================
### FILE: BOHEMIA_ADDENDUM_NEUROLINK_REVEAL_7_10_26.md
### MD5: 047fe9f58ee42c0d2fb6c2ac35d51b8f  |  1.9 KB
==============================================================================

# BOHEMIA — NEUROLINK REVEAL + AGENT PURPLE EXCEPTION (7/10/26, Paolo, LOCKED)

## The ruling (extends the Purple Reservation Law)
Purple belongs to the Amalgamation — the hatch AND inside its agents.
Cybernetic homeless (Amalgamation agents) may carry purple in exactly two ways:

1. **PURPLE EYES** — agent iris color. Subtle at distance, wrong up close.
2. **DAMAGE REVEAL** — shoot an agent once and if it does NOT die, a purple
   glow/glare in the head exposes the NeuroLink implant. Undamaged agents look
   like ordinary homeless. The tech is revealed BY VIOLENCE, mid-combat.

No other purple anywhere in the world. (Hatch + agents only.)

## Why the damage reveal is strong
- The player discovers what these people are by hurting them. The horror lands
  as a consequence of the player's own action — you shot a homeless person and
  the purple light told you why they attacked. Guilt and revelation in one beat.
- Mechanically it telegraphs "this one is an agent, not a bystander" only after
  first blood — supports the social-reveal storyline ("why do homeless attack me").
- Ties directly to the locked combat resolution: a HIT that doesn't kill ends
  turn clean — the reveal fires on that beat.

## Implementation states (agent visual state machine)
- INTACT: world skin (SKIN_TONES_WORLD) + rags, purple iris (only tell). [grime ramps DEAD 7/10]
- REVEALED (took >=1 hit, still alive): purple NeuroLink glow at head/temple,
  persists for the rest of the fight.
- DEAD: glow dies with them (the Amalgamation withdraws).

## Data shipped this turn
- BOHEMIA_AGENT_LOOK_7_10_26.js — AGENT_IRIS, NEUROLINK_GLOW colors, state enum
- BOHEMIA_AGENT_REVEAL_INTEGRATION_7_10_26.md — how the code accepts it
- Preview PNG — agent in all 3 states over real sewer tiles

## Still Paolo's
- Exact glow shape/placement on the sprite (temple vs crown vs behind the eyes)
- Whether ALL agents share one purple or it varies by conversion age


==============================================================================
### FILE: BOHEMIA_ADDENDUM_NIGHTMARE_CONTENT_IDEA_7_10_26.md
### MD5: 0626bffdad94deac02ce183a775ff5e3  |  0.8 KB
==============================================================================

# BOHEMIA — NIGHTMARE CONTENT (IDEA SEED, 7/10/26, NOT LOCKED)
Paolo, judging a surreal "Psychological elements" tile: "we can definitely
keep this if we want people to do a quest when they're in having like a
nightmare or something — for nightmares only."

## The seed
Fantasy/surreal/crystal tiles that violate Vegas grounding get a
NIGHTMARE-ONLY content tag instead of deletion. If a nightmare/dream quest
ever exists (Paolo's call), the art is banked and waiting: psychological
tiles, crystal/bioluminescence packs, alien-tech pieces.

## Status
IDEA ONLY — "if we want." No quest designed, no canon implied. Tiles tagged
NIGHTMARE-ONLY (confirmed) or NIGHTMARE-ONLY? (Claude suggest, crystals).
Grounded-world purity laws unaffected: this content NEVER appears in waking
Vegas.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_PIXEL_WORKFLOW_RESEARCH_7_10_26.md
### MD5: 929b8cab39fd541d7ed1114655b951ab  |  7.5 KB
==============================================================================

# BOHEMIA — HOW THE GREATS BUILT THEIRS + THE BOHEMIA GAME PLAN (7/10/26)

## PART 1 — RESEARCH: how real pixel games handled workflow

### Stardew Valley (closest analog: solo dev, giant scope)
- Eric Barone, alone, ~4.5 years, 10-12 hrs/day: code (C#/XNA + xTile tilemap
  lib), art (Paint.NET), music (Reason), design. No engine like Unity — a thin
  custom stack over a tile library. Same shape as Bohemia's custom JS engine.
- KEY LESSON 1 — SLICES: he built the game area by area, vertical slices,
  each slice playable before moving on. Not system-by-system across the whole
  game.
- KEY LESSON 2 — 16x16 DISCIPLINE: one small fixed tile size kept the art
  volume achievable for one person across a huge game. (Bohemia's 44px cell =
  same principle: one cell contract everywhere.)
- KEY LESSON 3 — THE REDO TRAP: he redrew everything repeatedly for years as
  his skill grew; on his next game he explicitly refuses to loop redos.
  Bohemia translation: verdict once, bank, DON'T revisit banked art unless a
  law changes. (Our GRAVEYARD IS FINAL + verdict banks already encode this.)
- KEY LESSON 4 — intuition + scrap: try, feel, scrap fast. (= Paolo's
  verdict-training loop.)

### Terraria (the procgen monster)
- World generation is ONE pipeline: 103 sequential passes in WorldGen.cs.
  Terrain -> caves (TileRunner random-walk brush) -> cellular-automata
  smoothing -> liquids settling -> biome painting -> ores -> structures ->
  cleanup. Each pass small, testable, ordered.
- Structures use the STAMP pattern: design a prefab by hand, export as tile
  block, generation finds a suitable spot + merges edges.
- Modded worldgen best practice: edit-code-in-game, trigger single passes,
  undo world — FAST ITERATION HARNESS is the real secret.
- BOHEMIA TRANSLATION: Vegas gen = ordered pass pipeline (valley terrain ->
  road grid skeleton -> districts -> lots -> buildings -> collapse damage ->
  loot/props -> factions/spawns), each pass a pure function seed->grid,
  individually triggerable in a test harness. Prefab stamps = our PREFAB
  FACTORY law, already filed.

### Autotiling (the industry's tile-joining answer)
- Standard: blob/bitmask autotiling — 8 neighbors -> 256 masks -> 47 visual
  tiles. Proven but art-hungry: 47 tiles PER terrain type.
- Modern trick: DUAL-GRID / dual-tilemap — logic grid separate from display
  grid; display samples 4 corners; only ~5 art tiles per terrain replace the
  47. Massive art savings, cleaner code, used to cut 47->5.
- Wang tiles: edge-matching theory underneath; also enables aperiodic variety.
- BOHEMIA TRANSLATION: we solved SAME-TILE tiling (seam pipeline). The next
  frontier is BETWEEN-TERRAIN transitions (grass->concrete edge). Dual-grid
  means we need only ~5 transition pieces per terrain PAIR that matters, not
  47 — and our quilt/crop machinery can HARVEST those 5 pieces from pack art.
  Bohemia cell contract stays: logic grid = truth, display grid = dressing.

### Procedural cities (the Vegas problem)
- Canon algorithm family: Parish–Müller (CityEngine) — grow road network with
  global goals + local constraints (intersect->crossing, near->snap), then
  blocks = enclosed areas, then LOT SUBDIVISION (OBB recursive slicing with
  area/aspect/access stop rules), then buildings per lot. Citygen generated
  24,000 buildings in 3.5s on 2007 hardware — city-scale procgen is CHEAP
  when the pipeline is right.
- Districts: flood-fill / Voronoi zoning (industrial, residential, commercial,
  parks) before lots.
- DIRECTLY BOHEMIA-RELEVANT FIND: published method for FAVELA/informal-
  settlement generation (A* zigzag roads on rough terrain, quadtree lots,
  alley systems, dead ends). Post-collapse Vegas rebuilding = formal grid
  (old Vegas, real streets) + informal settlement growth (new communities) —
  BOTH have literature. Vegas's real arterial grid also matches our
  REFERENCE-GRID law: real streets are the primary road network, procgen
  fills blocks.

## PART 2 — THE BOHEMIA GAME PLAN (graphics -> playable world)

PHASE A — RENDER CONTRACT (the bridge everything crosses)
1. One renderer consumes: ground layer (seamless sets) -> overlay layer ->
   prop/standing layer (multicell, DEPTH LAW) -> entities -> fx -> lighting.
2. Dual-grid transitions: harvest ~5 edge pieces per terrain pair that the
   demo needs (concrete<->wash, wash<->water first). Small, testable.
3. Door junction render per Paolo's pick; WALL-MOUNTED compositing.
GATE: one screen of the demo tunnel renders from banked data alone.

PHASE B — WORLDGEN PIPELINE SKELETON (Terraria discipline)
4. Pass harness: seed -> pass list -> grid; run/undo single passes in a test
   page. Passes v1: valley terrain -> real-Vegas arterial grid (reference-grid
   law) -> district zoning -> block/lot subdivision (OBB rules) -> building
   stamping (prefab factory) -> collapse pass (damage/rubble/overlays) ->
   prop dressing (demo prop pool rules) -> spawn tables.
5. Informal-settlement pass (favela method) for post-collapse communities;
   tunnel network pass for the underworld (canon).
GATE: seed generates a walkable district; Paolo judges GENERATOR OUTPUT
GALLERIES (same verdict-training loop, aimed at layouts — his map authority
preserved: he tunes rules, never Claude hand-placing).

PHASE C — SLICE, NOT SYSTEMS (Stardew discipline)
6. Build THE DEMO SLICE end-to-end on A+B: tunnel walk (1-3 min), dark,
   pickups, one encounter with cover, hatch reveal. Every system only as deep
   as the slice needs.
7. Then widen slice by slice (surface district, first settlement, act
   structure), never all-systems-at-once.

PHASE D — FACTORY FOREVER (our own law, validated by their history)
8. Art keeps flowing through the trained pipeline per new need; verdicts keep
   training; banks keep growing. Barone's redo-trap avoided: banked ships.

## PART 3 — HONEST PERCENTAGES (whole game = 100%)

- ART LIBRARY (assets processed, sorted, seam-ready, verdict-trained): ~70%
  of the library work is done. Remaining: transitions harvest, purpose art
  gaps (tunnel-specific, Vegas-modern bridges if ever, E/W variants), rig
  skins volume.
- RENDER INTEGRATION (banked art actually drawing in the engine as layers):
  ~25%. Tile block + bake exist; layered contract (overlays, multicell
  depth, junctions, lighting) not wired.
- MAPS (actual playable spaces): ~5%. Schema + prop pool exist; no map
  content (yours by law).
- PROCGEN (the city generator): ~12%. Strong design canon (citybuilder,
  prefab factory, reference-grid, valley scale laws) + overmap skeleton;
  pipeline passes not built. Research now closes the how.
- COMBAT: ~60%. Dial system, 52 patterns, packages, cover art + rules;
  needs junction with world + group fights.
- CHARACTERS/ANIMATION: ~40%. Rig, regions, 8-dir export, skins/rags
  approved; volume production + in-world animation integration remain.
- MUSIC: ~55%. Repo, laws, verdicts; volume-balance pass + coverage gaps.
- QUESTS/NARRATIVE: writing ~50% (53 questbook-grade docs incl. 3 finales);
  implementation ~2%.
- CITY-BUILDER SIM (economy/survival/logistics): design ~55% (deep addenda),
  implementation ~15% (engine modules + tests).
- UI/UX: ~15%. Menus/roadmap docs; little built.
- PERSISTENCE/META (dynasties, succession, saves): design ~60%,
  implementation ~30% (persistence v1, fold determinism).

WEIGHTED OVERALL: design+assets era ~45% done; IMPLEMENTATION era ~20% done.
Blended honest number for "the whole enchilada": **~25%** — with the single
biggest unlock being Phase A (render contract), because it converts the
week's asset mountain into visible game.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_PURPLE_RESERVATION_LAW_7_10_26.md
### MD5: d70c3bc402544ebb2a0f8c3c46fe1f5b  |  1.4 KB
==============================================================================

# BOHEMIA — PURPLE RESERVATION LAW (7/10/26, Paolo, LOCKED)

## The law
Purple/magenta/violet is RESERVED. In the sewer demo (and as standing direction),
ONLY the door/hatch from the tunnel into the Network build may carry that purple.
No fantasy-purple tiles scattered through the world. No purple runes, no purple
floors, no ambient purple decor.

## Why it's strong
The color becomes a story tell. The player learns it wordlessly: purple = the
Amalgamation's threshold. Scarcity is what gives it power. (Same principle as
the AMALGAM art direction's magenta — the villain owns this hue.)

## Immediate effects
- Purple/violet tiles PURGED from the wash/sewer/water demo tile pools
  (rune-style purple tiles had leaked in via the hazard pool).
- The hatch in the demo map is redrawn as THE purple moment.
- REDMAG tile category (325 tiles) = quarantine list: usable ONLY for
  Amalgamation/Network-threshold contexts, blood/danger reds excepted.

## Open under this law [PENDING Paolo]
- The cybernetic-homeless subdermal magenta tell (proposed this session):
  it is "that type of purple." Strict reading of the law kills it; an
  Amalgamation-agent exception would allow it (they ARE the Amalgamation's).
  Awaiting Paolo's ruling. Skin ramps themselves are APPROVED and unaffected.

## Approved same turn
- World-graded skin palettes (SKIN_TONES_WORLD): Paolo — "skin colors look
  fantastic." LOCKED for the demo.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_REFERENCE_GRID_PIPELINE_7_10_26.md
### MD5: fc11715b62011d3225e6c28ce265f5dc  |  1.4 KB
==============================================================================

# BOHEMIA — REFERENCE-TO-GRID PIPELINE (7/10/26, Paolo's directive)

## The idea (Paolo)
Big-brain research: gather the biggest/best pixel-city reference images, Claude
derives a GRID BASE from what it sees (street pattern, building massing, block
structure), and that grid becomes playable — dressed with OUR tiles.

## How it satisfies the Map Law
Claude still never INVENTS layouts. Claude TRANSCRIBES composition from a
reference Paolo has seen/approved. The reference is the designer; Claude is the
digitizer. Paolo picks/approves every reference before transcription.

## The rules
1. References are used for STRUCTURE ONLY (street grids, block sizes, density
   rhythm, landmark placement logic). Never copy another game's art or tiles.
2. Priority reference #1 is REAL LAS VEGAS — the canon already honors real
   geography (Strat, Red Rock wall, real pipeline routes). Real Vegas street
   grids are the most authentic "biggest pixel city" source there is, and
   uncopyrightable.
3. Secondary: pixel-city composition TECHNIQUES researched from design writing
   (how city scenes read at tile scale: block rhythm, street width ratios,
   landmark anchoring) — techniques, not lifted images.
4. Pipeline: Paolo approves reference -> Claude transcribes to grid (zones,
   streets, blocks in the map-data schema) -> tiles dress it -> playable.

## Status
Filed. First transcription target pending Paolo (suggest: a real Vegas
district he names). Research pass queued.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_SEWER_DEMO_HOMELESS_7_10_26.md
### MD5: 6ad96b1df98e02033f8431f40ec7ab90  |  3.2 KB
==============================================================================

# BOHEMIA — ADDENDUM: SEWER DEMO + CYBERNETIC HOMELESS (7/10/26)

## Status
Paolo's idea, locked as canon this turn. This is BOTH the demo location AND a
real Act 3-ish story beat. Chosen deliberately over a generic warehouse/jail.

## THE DEMO LOCATION — Vegas wash + storm sewers
- Player starts ABOVE in the WASH (Vegas's real concrete flood channels — dry
  most of the year, built for flash floods). ~ a few minutes here.
- Descends into the SEWER proper. Creepy as fuck. Procedurally generated.
- Climax: a HATCH into a hidden NETWORK BUILD deep in the sewer.
- The Network build SIPHONS POWER off Vegas stormwater/rain runoff, in the most
  secret way possible, to feed the Amalgamation's network. Bottom-of-level reveal.
- Flow: wash (short) -> sewer (longer, creepy, procedural) -> hidden Network hatch.

## THE ENEMY — cybernetic homeless (LOCKED)
- The Amalgamation, when it wants to DISAPPEAR old NeuroLink-tech members, does
  NOT kill them. It CONVERTS them into homeless who guard certain areas under
  surveillance.
- WHY the homeless specifically: a society that already ignores and steps over
  its homeless (Skid Row / downtown LA as the real-world reference) is a society
  that will never count them, never miss them, never investigate. The indifference
  is the cover. That's how the Amalgamation gets away with it.
- THE HORROR IS REAL-WORLD, not sci-fi. The tech just weaponizes an indifference
  that already exists. This is the life-lesson layer running underneath.
- You can BARELY tell they're cybernetic. The tell is under the skin / hidden in
  how they're drawn. [ART DIRECTION PENDING — Paolo's call]

## THE STORY HOOK — social reveal (LOCKED, withhold-info technique)
- The FAMILY HEIRLOOM can stop the Amalgamation, and IT KNOWS. So it keeps
  sending homeless at the dynasty over time.
- The player does NOT understand why. They mention it offhand: "why do so many
  homeless keep attacking me?" Others react: "wait — they attack you too?"
- That shared confusion is how the truth surfaces SIDEWAYS. The game never
  announces it. Player assembles it from overheard comments. (Bloody Baron DNA.)
- Tone: darkly funny on the surface, real-deal underneath.

## PENDING — PAOLO'S CALLS (art/design direction, Claude will NOT invent)
- [PENDING] What the cybernetic homeless look like — the tell under the skin.
- [PENDING] What the Network stormwater-siphon build looks like.
- [PENDING] Enemy behavior: rush the player vs throw rocks/sticks vs mix.
- [PENDING] Exact split of time: how long in wash vs sewer (rough: wash short,
  sewer longer — "5 min in sewer or longer").

## DEMO SCOPE NOTE
- Procedurally generated, but this is a DEMO — we build a contained slice, not
  the full proc system. A hand-bounded proc map: wash entrance -> sewer run -> hatch room.
- Ties into the existing combat demo (Dead Eye Dial) + light grid movement.
- Connects to canon: family heirloom = the fragment-of-legitimate-access concept
  already filed (decommission code / admin cert / founder key in the Family Box).

## LIFE LESSON UNDERNEATH (never preached)
Society's most-ignored people are the easiest to disappear. The system that looks
away is the system that lets it happen. The player learns this by living it, not
by being told.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_SHADOWS_CONCEPTS_7_10_26.md
### MD5: 552eaa744c9015f475b66e832ac1c1a0  |  1.6 KB
==============================================================================

# BOHEMIA — SHADOWS: DESIGN CONCEPTS (7/10/26, invited by Paolo)

## What the lighting system already gives free
Walls stopping the flood-fill IS hard shadow: the dark behind a wall relative
to a source. Zero extra cost, already working in the playground.

## Concept options [ALL PENDING PAOLO]
1. **CAST SHADOWS (directional)** — per source, raycast (Bresenham) from the
   source to each lit cell; a wall on the ray blocks light past it. Turns the
   diamond glow into true line-of-sight pools with hard-edged shadow lanes
   behind obstacles. Cost: modest (small maps, few sources). The dramatic one:
   an agent steps between you and the fire barrel and its shadow crosses you.
2. **ENTITY BLOB SHADOWS** — soft ellipse under every rig, offset away from
   the nearest strong source. Pure cosmetic paint, cheap, sells grounding.
3. **FLICKER ON THE BEAT** — fire sources oscillate ±1 light level on the
   120bpm grid. The whole tunnel breathes with the soundtrack. Very Bohemia.
4. **SHADOW AS STEALTH RULE** — cells in shadow (light below threshold AND
   occluded from sources) count as hiding spots — for the player AND for
   agents. Ties to under-stairway ambush idea + agent ambush thresholds.
5. **LONG SHADOWS AT THE WASH MOUTH** — surface daylight entering the tunnel
   mouth casts one long directional shadow lane inward. One-off scripted
   moment, cheap, cinematic descent beat.

## Recommendation order (engine-first, cheapest real win first)
2 (blob) -> 3 (beat flicker) -> 1 (raycast) -> 4 (stealth rule) -> 5 (set piece)
All compose with the validated flood-fill; none replace it.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_SHADOW_TECH_RESEARCH_7_10_26.md
### MD5: 5ad5f0e12cbc4f49c6dd515ee9a72135  |  2.9 KB
==============================================================================

# BOHEMIA — SHADOW/LIGHT TECH RESEARCH: HOW GOOD 2D GAMES DO IT (7/10/26)

## Technique menu (all canvas/iPhone-feasible, ranked for Bohemia)

### 1. RECURSIVE SHADOWCASTING (grid FOV) — the roguelike standard
The grid is split into 8 octants around the source; cells are traversed
row-by-row outward, and when an occupied cell is hit the octant recursively
splits into smaller regions bounded by rays to the blocker's corners. Result:
exact per-cell visibility with hard shadow lanes behind obstacles.
WHY US: grid-native, integer, deterministic (FOLD-safe), no geometry needed.
This upgrades our flood-fill from "diamond glow" to true line-of-sight light.

### 2. SMOOTH CORNER-AVERAGED LIGHTMAP — the Terraria look
Tiles render full-bright; a darkness overlay is drawn on top where each cell
corner's alpha is the AVERAGE of the four surrounding cells' light. Light
becomes a smooth gradient while the pixel art underneath stays crisp.
Performance trick from the same lineage: paint the light values into ONE tiny
offscreen bitmap (a pixel per cell), stretch it over the scene as a single
draw with smoothing ON — light is smooth, art is sharp, draw cost is one quad.
WHY US: kills the blocky per-cell lighting instantly; ~zero cost.

### 3. FUZZY/SOFT SHADOWS — multi-origin sampling
The Sight&Light technique: cast rays only toward wall-segment endpoints (plus
two rays offset ±0.00001 rad to catch the wall behind each corner), sort hits
by angle, connect into a visibility polygon. Penumbra comes from drawing
SEVERAL visibility polygons from slightly offset origins and blending them as
an alpha mask — soft creepy edges, famously "creepy result."
WHY US: 2-3 jittered origins per major source = soft shadow edges in the
sewer without any GPU tricks. Use sparingly (hero sources only).

### 4. COLORED LIGHT — RGB lightmap channels
Same lighting algorithm run per color channel (or store r,g,b per cell instead
of one level). Fire is orange, work lights white, the hatch purple — mixing
happens naturally where pools overlap.
WHY US: the amalgam purple bleeding into firelight IS the horror palette.

### 5. PERFORMANCE LAWS (from Terraria-like engines)
- Bake static lights; recompute only when something changes.
- Amortize: dynamic lights may update progressively across frames.
- Keep the light bitmap LOW RES (per-cell) and scale up; never per-pixel CPU.

## Recommended Bohemia stack (pending Paolo)
flood-fill levels (VALIDATED) + shadowcasting occlusion (1) + corner-averaged
smooth overlay (2) + RGB channels (4), with fuzzy multi-origin (3) reserved
for hero moments (the hatch room). Beat-flicker from the shadows addendum
rides on top. This is Terraria-smooth + Darkwood-menace on our engine.

## Demo image in words
Wash mouth: bright, soft-edged daylight cone. Tunnel: firelight pools with
smooth falloff, hard black lanes behind pillars. Hatch room: one purple
source, soft-edged, tinting the walls — the only color in the dark.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_SIDEWALK_SANCTITY_7_14_26.md
### MD5: 3d875dc0cb004cf768067eb250328fa4  |  1.1 KB
==============================================================================

# BOHEMIA — SIDEWALK SANCTITY LAW (Paolo, 7/14/26)

Verbatim intent: "Nothing goes on it except like lamp posts and shit like
that... you're putting ruins on the sidewalk where people walk and that's
not realistic... buildings don't go on streets."

## THE LAW
- Sidewalks (1 tile standard, 2 busy, 3 Strip max) are the WALKING zone.
- Sidewalk whitelist: street lamps / fire barrels standing in for them,
  and street furniture of that class ONLY. [Exact furniture whitelist
  beyond lamps: PENDING Paolo as items come up — hydrants, benches,
  parking meters are plausible candidates, not yet ruled.]
- Buildings, ruins, walls, and every structure live PAST the sidewalk,
  in the block interior BEYOND the street block's edge.
- That beyond-the-sidewalk zone is NOT YET DESIGNED. Nothing generates
  there until its laws exist. Street blocks end at the sidewalk's back
  edge, period.

## GRAVEYARD
RUIN FLANK pass (7/14) killed same day: placed ruin fragments ON sidewalk
rows. Reverted from blockgen; regression tests green. Lesson: getting
ahead of undesigned zones = hallucinating structure. Wait for the zone's
laws.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_STREETLIGHT_HEIGHT_POWER_7_14_26.md
### MD5: 81739a7f21fdb01e87c719774e878f92  |  1.7 KB
==============================================================================

# BOHEMIA — STREETLIGHT HEIGHT + CLUSTERED POWER (7/14/26)

## RESEARCHED HEIGHTS (sourced)
Residential poles 20-30 ft (6-9 m); urban/commercial 20-30 ft; highway
30-50 ft (9-15 m); vs human 1.75 m = lamps are 3.5x-8x human height.

## PAOLO RULINGS (LOCKED)
- Proper street lights render 3 OR 4 TILES TALL: residential = 3,
  arterial + freeway = 4 (matches the real ratio split).
- FIRE BARRELS ARE RARE. They are NOT lamp stand-ins. Standalone props,
  occasional, human-scale.
- Lamp default state = DEAD (dark variants bank = act-1 canon).

## CLUSTERED OUTAGES (Paolo's instinct + technical grounding)
Street lighting fails by CIRCUIT, not by lamp: one dead feeder or one
stretch of stripped copper kills an entire run (copper wire theft was
already killing Vegas streetlight runs pre-collapse — documented).
So outages/survivals are CLUSTERS, never alternating.

## CLUSTERED POWER LAW (LOCKED — Paolo 7/14: 'I like the answers')
- Act-1 live fraction: ~10-15% of lamps, all in clusters. Way darker
  than half — 30 years of entropy + copper scavenging.
- Every lit cluster is OWNED: settlement generator runs, faction-held
  circuits, and NETWORK territory kept eerily, perfectly lit (the
  Amalgamation's glowing empty streets = signature horror image).
- Rare lone survivors: solar-head lamps whose panels lived; they flicker
  alone, belong to nobody.
- LIGHT = TERRITORY: the player reads ownership and danger by glow.
LOCKED: lit fraction 12% nominal (10-15 band, tunable). Ownership tags:
settlement-run / faction circuit / NETWORK zone (eerily perfect) / lone
solar survivor. [PENDING only: WHERE NETWORK zones sit on the map — that
placement is Paolo's map-design call, the mechanics below are ready.]


==============================================================================
### FILE: BOHEMIA_ADDENDUM_STREET_CANON_7_13_26.md
### MD5: c63646c258e27e583540a65b50d95dc0  |  1.1 KB
==============================================================================

# BOHEMIA — STREET CANON (Paolo, 7/13/26)

## Verdict on street gen v0: DOWN (premature), idea credited
Claude generated before scale training was complete. Cars read 2x2 (law is
2x3); a fire extinguisher stood human-sized (ITEM_SCALE never applied);
no crosswalks; no middle lane. Sidewalk-vs-street distinction: credited.

## STREET CANON (Paolo-stated)
1. REALISTIC WIDTHS: Bohemia streets are real Vegas streets. A two-lanes-
   each-way road ≈ 16 cells wide, possibly more. Never toy-width (v0 used 5).
2. STREET ANATOMY required: lanes per direction, MIDDLE/turn lane,
   CROSSWALKS at intersections, sidewalks flanking. Lane markings are
   structure, not decoration.
3. Ties to VALLEY SCALE LAW + reference-grid: real arterial proportions.

## ORDER CORRECTION (Paolo steer)
Street generation PARKED until: Stage 1 vision audit complete (naming catches
scale absurdities like extinguishers) + scale law APPLIED in the render path.
Training before generating. Prerequisite chain: vision naming -> scale
application -> anatomy pieces (lane lines, crosswalk pool) -> then gen v1.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_STREET_COMPOSITION_LAWS_7_14_26.md
### MD5: c8e0116169ecf17dc4c4f67493783abb  |  3.1 KB
==============================================================================

# BOHEMIA ADDENDUM: STREET COMPOSITION LAWS (7/14/26)
Paolo's calls, locked this session, from the street tuner review.

## LANE LAW (LOCKED)
- Lanes per direction: 1 to 4 depending on how busy the street is. 5 per
  direction for freeways only.
- Typical: most streets run 2 or 3 lanes per direction.
- LANE WIDTH NEVER CHANGES. One fixed lane width across the whole game.

## SIDEWALK WIDTH LAW (LOCKED)
- Most sidewalks: width 1.
- Busier streets: width 2.
- The Strip: width 3 MAXIMUM. Nothing anywhere exceeds 3.

## CROSSWALK LAW (LOCKED)
- Crosswalks exist ONLY at intersection crossings (real Vegas: no mid-block
  crosswalks).
- Most crosswalks: width 1. Busier streets: width 2.

## MEDIAN LAW (LOCKED)
- Most streets: median width 1. Busier streets: width 2.
  (Voice-to-text "meeting width" = median width.)

## STREET LAMP SPACING (RESEARCH FILED, game math = Paolo's call)
Source: Clark County Area Uniform Standard Drawings (dwg 300/311/311.1/312,
the real spec Vegas is built to).
| street class | real spacing | ~meters (1 cell ~ 1m) |
|---|---|---|
| Arterial (100ft+ ROW, mile roads) | staggered both sides, 160ft same-side / 80ft opposite offset (Clark Co unincorporated 120/60, some entities 140/70) | pole every ~24m alternating sides (~49m same side); tight version ~18m |
| Collector (80ft ROW) | 170ft same-side / 85ft staggered | every ~26m alternating |
| Residential (60ft or less ROW) | 170-180ft, one side allowed | every ~52-55m, single side |
| Intersections | poles required at every corner | every corner |
| Medians | lighting allowed when median >= 10ft; Henderson/Boulder City REQUIRE median lighting on 100ft+ ROW | median >= ~3m carries lamps |
[PENDING, Paolo's call]: the equivalent in-game spacing numbers. Paolo does
the math; these are the grounded real refs.

## STAGGERED LAMP LAW (LOCKED, Paolo 7/14/26: "Real Vegas")
Street lamps STAGGER, alternating sides of the street, per the Clark County
staggered layout. Never placed as facing pairs. Spacing knob = distance
between consecutive lamps (which alternate sides), so same-side distance is
2x the knob. In-game numeric spacing = Paolo's math [PENDING].

## STREET TUNER FIX QUEUE
1. FIRE BARREL MISLABEL, root cause found: the lamp sprites come from tile
   pack "18. Light sources and fire barrels" and the tuner inherited the
   pack name. FIX: split into separate families (street_lamp vs
   fire_barrel), tuner label reads "street lamp".
2. CAR OVERLAP LAW (LOCKED): cars must NEVER overlap each other. Placement
   gets a collision check.
3. CAR ROTATION LAW (LOCKED): cars face all four ways, not just E-W. Rotate
   props freely; N-S facing cars are normal street furniture.

## GROUNDING
All widths and spacings trace to real Vegas street anatomy (Clark County
USD). Lane counts match real valley arterials (2-4 per direction) and the
5-lane freeway sections of the 15/95.

## NO SINGLE STREET LAW (LOCKED, Paolo 7/14/26)
There is no one way to make a street. Street variety is the point: the
composition laws above are RANGES, and generation must vary lanes, medians,
sidewalks, dressing, and damage within them per block. Paolo's tuner
directions are the variety envelope, never a fixed template.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_TILE_PIPELINE_SEAMS_VARIANTS_7_10_26.md
### MD5: f957f0a0307d18dd4bc92acf8b0dae4b  |  1.8 KB
==============================================================================

# BOHEMIA — TILE PRODUCTION PIPELINE: VERDICTS -> SEAMS -> VARIANTS (7/10/26, Paolo)

## The pipeline order (Paolo, locked)
1. **VERDICTS** — Paolo thumbs-up/down the work (list delivered 7/10/26).
2. **SEAM FIX (re-crop)** — approved tiles get processed so repeating textures
   read as ONE integrated surface, NOT Lego blocks stacked side by side.
   The current crops butt hard edges against each other; the fix is edge
   treatment / re-crop so same-texture neighbors flow together.
3. **VARIANT FACTORY** — every APPROVED block becomes a template: Claude
   generates ~3 more versions of that same block. Approval unlocks volume.
   (Factory Law applied to tiles: approved = seed, variants = batch output,
   purity gate = regression gate on every generated variant.)

## Seam-fix candidate approaches (to prototype for Paolo's judgment)
A. **Edge cross-fade**: blend a few edge pixels with the wrapped opposite edge
   so any tile meets itself and its siblings smoothly.
B. **Offset-wrap repair**: shift the texture 50%, heal the visible cross seam,
   shift back — makes a tile truly self-tiling (classic texture technique).
C. **Shared-border normalization**: force all tiles in one category to share a
   common border tone band so any-to-any adjacency blends.
Feathered patch-scatter (already in the buffet) helps placement variety but
does NOT fix the hard tile-edge problem — that needs per-tile processing.

## Rules
- Seam processing runs AFTER verdicts, on APPROVED tiles only.
- Every processed tile and every generated variant passes the purity gate.
- HD masters stay untouched — seam-fixed copies are new bakes, re-cuttable.

## PENDING PAOLO
- Verdicts on the 18-item list
- Seam approach pick once prototypes are in front of him
- Variant count per approved block (default ~3, his call)


==============================================================================
### FILE: BOHEMIA_ADDENDUM_UNIVERSAL_REVEAL_SYSTEM_7_10_26.md
### MD5: d5c28e54670e39e51e930c7c013e9648  |  2.0 KB
==============================================================================

# BOHEMIA — UNIVERSAL DAMAGE-REVEAL SYSTEM (7/10/26, Paolo's directive)

## The reframe (Paolo, quoted intent)
The agent NeuroLink reveal must NOT be a one-off hack. It is the first instance
of an ENGINE-LEVEL MODULAR SYSTEM: anytime ANYONE gets shot, they progressively
reveal more of what's underneath. Cybernetics under skin. Armor under a coat.
Wounds. Possibly losing an arm. The reveal IS the damage model's visual language.

## Engine architecture (modular, game-wide)
Every entity gets a REVEAL STACK per body region (rides the existing 12-part
rig regions — no region geometry touched, paint layers only):

  entity.reveal = {
    layers: [                      // outermost first
      {id:'coat',    hp:30},       // garment layer — tears/opens
      {id:'armor',   hp:40},       // hidden vest — revealed when coat opens
      {id:'skin',    hp:0},        // base paint
      {id:'under',   fx:'neurolink'} // what's UNDERNEATH — cyber, bone, wound
    ],
    perRegion: true                // hits map to the region struck (HEAD/ARM-L/...)
  }

- A hit routes to the struck region (Dead Eye zones already aim at regions).
- Damage peels the region's outermost layer first; when a layer breaks, the
  next layer becomes VISIBLE there. Paint-layer swap, post-paint cosmetic.
- The agent NeuroLink glow = under-layer fx of the HEAD region. Same system
  later does: armor chunks cracking off raiders, wounds showing on anyone,
  terminal dismemberment (ragdoll-exempt path, uncached, per the terminal law).
- Beat-synced fx pulse on the 120bpm grid like all animation.

## Why it's right for Bohemia
Damage tells the truth about what people are. That is LITERALLY the game's
theme — proximity to truth is what's dangerous. The engine making violence
reveal what's hidden is the theme as a mechanic.

## PENDING PAOLO
- Layer vocab v1: which layers exist at launch (coat/armor/skin/under enough?)
- Dismemberment: in or out (or dynasty-gen-3 tech unlock?)
- Whether civilians reveal too (wounds) or only agents/armored


==============================================================================
### FILE: BOHEMIA_ADDENDUM_VEGAS_LANE_RESEARCH_7_14_26.md
### MD5: db9734cdf595f2836d2b2bcc15a514c1  |  2.0 KB
==============================================================================

# BOHEMIA — REAL VEGAS LANE RESEARCH (7/14/26, Paolo directive: no more guessing)

## THE SOURCED NUMBERS
| road | through lanes | extras | sources |
|---|---|---|---|
| THE STRIP (Las Vegas Blvd) | 3 per direction (min 6 through) | turn pockets make it read 8-10 wide; wide sidewalks; raised median sections | FHWA pedestrian safety study; walking guides; Antiplanner field count |
| Mile-grid ARTERIALS (Flamingo class) | 3 per direction typical | +2 left-turn pockets at majors (dual/TRIPLE at intersections), wide bus lane each way on transit corridors; centers = raised median OR two-way-left-turn lane; ROW built for 6-8 lanes; 45 mph | FHWA (mile-grid arterial description), Antiplanner Flamingo count |
| I-15 RESORT CORRIDOR | 5 per direction | + HOV lanes; NDOT: Flamingo-Sahara "can only accommodate five through lanes each direction"; Trop stretch restored to 5/dir 2025 | NDOT I-15 Central Corridor; RJ 2025 |
| I-15 approaches | 3 per direction (6 overall) from Primm; south segments widening 6->8 and 6->11 total | HOV from St Rose to I-11 | AARoads; RJ widening project |
| Residential streets | 1 per direction | parking lanes at curb | Clark County standard practice |
| Suburban sidewalks | ~5 ft max, back of curb | = width 1 game cell; Strip's wide walks = Paolo's 3-cell max law | FHWA |

## VERDICT ON THE GAME LANE LAW (locked earlier)
Paolo's law (1-4 lanes/dir, 5 freeway) IS real Vegas: freeway 5/dir = I-15
resort corridor exactly; Strip 3/dir exact; arterial 3/dir exact.

## BRIDGE RECIPE CORRECTIONS (applied this turn)
- arterial: DEFAULT 3 lanes/dir (was 2-3 by quality — hallucinated); quality
  now only drops minor arterials to 2.
- strip: 3/dir, sidewalk 3 (law max), median present — confirmed.
- downtown/commercial: 2-3/dir.
- freeway: 5/dir (law = reality).

## NEW GAP QUEUE ENTRY — TURN POCKET ANATOMY
Real Vegas intersections carry dual/triple LEFT-TURN POCKETS and right-turn
pockets; centers alternate raised median vs two-way-left-turn lane. We have
no turn-pocket tiles or recipe grammar. [Art gap + recipe grammar PENDING.]


==============================================================================
### FILE: BOHEMIA_ADDENDUM_VEGAS_NEIGHBORHOOD_ANATOMY_7_14_26.md
### MD5: 86a495189e6246ec01eee4860555f4f0  |  2.0 KB
==============================================================================

# BOHEMIA — VEGAS NEIGHBORHOOD OVERHEAD ANATOMY (researched, 7/14/26)
Paolo's directive: look at real Vegas neighborhoods from overhead and get
the street truth into generation. Sourced findings:

## STREET PATTERN TRUTH (overhead)
- Vegas suburbs are CURVILINEAR: loops + cul-de-sacs, NOT grids. Summerlin
  aerials show cul-de-sac clusters and curving streets as the signature.
- The pattern is HIERARCHICAL + DISCONTINUOUS by engineering standard
  (ITE, rooted in the 1951-56 LA safety study): local streets feed
  COLLECTORS feed ARTERIALS; limited access points to the perimeter road;
  T-intersections, elbow turns, short streets; through-traffic impossible.
- Consequence for Bohemia: a suburb plot touches the arterial at FEW,
  DELIBERATE entry points. Entries are street-connected BY DEFINITION.
  Interior = loops/culs off a small collector spine. (Interior layout law
  itself: PENDING Paolo — this file is the reference for that ruling.)

## GATED TRUTH (numbers)
- Valley has 580+ named communities; ~80 are guard-gated (~14%). Gated
  (unmanned) adds more, but MOST communities are walled-not-gated.
  Paolo's law confirmed by data.
- Guard-gated = wealth tier: The Ridges runs TWO 24-hour guard gates
  (three for its inner enclave The Pointe) and ~$900/mo HOA stacks.
  Post-apocalypse: those layered gates are story gold (holdout enclaves,
  sealed communities, the rich who locked themselves in).

## LAWS LOCKED FROM PAOLO'S VERDICT (7/14)
1. ONE WALL PER COMMUNITY: wall design chosen ONCE per plot (seeded);
   uniform around the ring; variety lives BETWEEN communities.
   Per-cell wall shuffle BANNED (same crime as desert confetti).
2. GATES TOUCH STREETS: entries exist ONLY on plot edges that face a
   street cell; the entrance itself is a SUBURB ROAD segment running
   from the street through the wall line inward.
3. GATED = RICH: most plots get walls with OPEN entries (gap, no gate
   hardware). Gate hardware (and guard shacks later) only at top quality.
   [PENDING: exact quality thresholds for walls and for gates.]


==============================================================================
### FILE: BOHEMIA_ADDENDUM_VEGAS_STREET_ANATOMY_7_13_26.md
### MD5: 90c56a700ab98636e9c4d25c3349fdd0  |  0.9 KB
==============================================================================

# BOHEMIA — VEGAS STREET ANATOMY CANON (Paolo, 7/13/26)

## The correction
Street gen v1 verdict: dimensions/knobs GOOD, tile SEMANTICS WRONG — Claude
assigned marking roles from one sheet glance and used street art where it's
not typically used. Tile roles are PAOLO's to assign, not Claude's to guess.

## Vegas street anatomy (Paolo-stated)
- LANE DIVIDERS: thin lines separating lanes moving the SAME direction.
- MEDIAN: one FAT divider in the middle separating OPPOSING traffic;
  sometimes wide ("fat") to accommodate U-TURNS. U-turn culture is real Vegas.
- Crosswalks, edges/shoulders exist as their own roles.

## Fix in motion
STREET TILE ROLE LABELER shipped: Paolo assigns each marked tile's role
(lane divider / median / crosswalk / edge-shoulder / plain / not-street).
His labels replace Claude's guessed anatomy classes; generator consumes
roles, never guesses. Anatomy pool rebuilt from his export.


==============================================================================
### FILE: BOHEMIA_ADDENDUM_VERTICALITY_STAIRS_7_10_26.md
### MD5: 869ce3c4626342ea5089cfd6181e14df  |  1.9 KB
==============================================================================

# BOHEMIA — VERTICALITY: MULTI-STORY + STAIRS + UNDER-STAIRS (7/10/26)

## Status: PAOLO'S IDEA, CATALOGUED — design decisions pending his calls
Raised 7/10/26: second-story and third-story activity, stairs, and the player
being UNDER a stairway.

## What it implies technically (the honest picture)
1. **Z-LEVELS**: multi-story needs a floor index per cell (z=0 ground, z=1
   second story...). The map data schema extends cleanly: grid becomes
   per-level, walls per-level. Plumbing-ready.
2. **STAIRS as connector**: a cell type that moves the player between z-levels.
   The 7-type shortlist (Paolo's v1, marked "refine later") has NO stairs type.
   Candidate: add STAIRS as type 8, or treat as DOOR-variant (a door between
   floors). PAOLO'S CALL.
3. **UNDER-STAIRWAY = occlusion**: the player walking under an overhead thing
   is a RENDER-LAYER question — the stair/floor above draws OVER the player.
   The rig already has layerOverride semantics (DEPTH LAW: lowest index =
   nearest). Same principle extends to world cells: an OVERHEAD layer that
   draws above entities. Under-stairs is also a natural HIDING/ambush spot —
   fits the sewer agents and the whole surveillance theme.
4. **Second-story ACTIVITY**: NPCs/enemies on z=1 shooting down / being seen
   from below implies line-of-sight across levels + partial visibility of
   upper floors (cutaway or transparency when player is inside). Big system.
   Not demo scope unless Paolo says so.

## What the library has TODAY (checked this session)
Stairs/steps/ladders/platform packs exist in the HD masters (counts in session
log). Enough raw art to prototype stairs + a second story without new packs.

## PENDING PAOLO
- Is verticality IN the demo, or filed for the full game?
- STAIRS: new type 8, or DOOR-variant?
- Under-overhead occlusion: full hide, or silhouette/outline of the player
  showing through (common roguelite solve)?
- How many z-levels max (2? 3?)


==============================================================================
### FILE: BOHEMIA_ADDENDUM_WORLD_CLOCK_WALK_LAW_7_14_26.md
### MD5: 66e3deb7cc19fc65d10319564837a59a  |  2.0 KB
==============================================================================

# BOHEMIA — WORLD CLOCK WALK LAW (researched 7/14/26, Paolo directive)
Paolo: crossing the in-game valley on foot must take the same TIME as a real
human walking the real valley east-west, nonstop, at researched normal speed.

## THE RESEARCH
- Civilization width: Clark County's official "Urban Planning Area" of Las
  Vegas is ~20 miles (32 km) east-west (x 30 mi north-south). East wall =
  Frenchman Mountain / Sunrise Manor foothills (~10 mi east of downtown);
  west wall = Summerlin against Red Rock (community runs the valley's
  western edge). Sources: Wikipedia Las Vegas Valley (county planning area),
  Frenchman Mountain refs, Summerlin refs.
- Walking speed: 1.4 m/s = 5.0 km/h = 3.1 mph. The standard researched
  figure: average crosswalk speed, recommended by the Design Manual for
  Roads and Bridges; preferred-walking-speed literature centers 1.2-1.5 m/s.

## THE ANSWER
20 mi = 32,187 m at 1.4 m/s = 22,990 s = 383 minutes
= 6 HOURS 23 MINUTES walking nonstop, east edge of civilization to west.

## THE LAW (the formula)
The 96-cell overmap crossing = ~383 min of GAME TIME. Therefore:
- CITY VIEW: 1 overmap grid walked = 4 MINUTES game time (96 x 4 = 384 min,
  matches the research to within 1 minute).
- HUMAN VIEW: 1 overmap cell = 128 fine steps, so each fine cell of real
  ground = 32,187/12,288 = 2.62 m real-equivalent:
  | mode | game time per fine step | fine steps per game minute |
  | walk (1.4 m/s real) | 1.9 s | 32 |
  | run (~3 m/s real)   | 0.9 s | ~66 |
- Sanity: a survivor walking dawn to dusk crosses the valley once with
  daylight to spare, exactly like a real human.
- I-MOVE-YOU-MOVE unchanged: these are the amounts the clock advances PER
  STEP TAKEN; standing still advances nothing.

## SUPERSESSION FLAG
VALLEY_SCALE_LAW 7/6 carried a placeholder "city-mode marker move = 10 min
per cell". This researched law sets 4 min per cell. [Paolo's directive was
"the researched answer IS the game equivalence" — treating 4 min/cell as
LOCKED unless he overrules.]
The demo slice's 1440-beats-per-day placeholder is superseded by this table.


==============================================================================
### FILE: BOHEMIA_AGENT_REVEAL_INTEGRATION_7_10_26.md
### MD5: 5970029821c47e6ccfba0dce9aed3e3e  |  3.1 KB
==============================================================================

# BOHEMIA — AGENT REVEAL INTEGRATION (7/10/26)

## What this is
Everything the code needs to render cybernetic-homeless agents in their three
states: INTACT (looks like an ordinary homeless person, purple eyes only),
REVEALED (took a hit, survived, NeuroLink glows purple at the head), DEAD.

## Files
- `BOHEMIA_AGENT_LOOK_7_10_26.js` — the data (this doc explains the plumbing)
- `BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js` — SKIN_TONES_WORLD (SKIN_TONES_HOMELESS is DEAD, 7/10)
- Preview: `BOHEMIA_AGENT_REVEAL_PREVIEW.png`

## HOW THE CODE ACCEPTS IT
1. **Skin**: agents paint with `SKIN_TONES_WORLD`, same as everyone. (Grime ramps DEAD 7/10.)
   One branch where the look-config resolves tone:
   `const tones = SKIN_TONES_WORLD;`  // no agent branch — the RAGS carry the read
   `skinRampFor()` untouched. Regions untouched (color data only).
2. **Eyes**: APPEND `AGENT_IRIS` to the alpha's existing `IRIS` array (do not
   reorder — existing saves index IRIS by position). Agents get
   `look.irisIndex = IRIS.length-1` at spawn. Civilians never roll it.
3. **Reveal state**: add `revealState` to the agent entity (AGENT_STATE enum).
   Transition hook lives in combat resolution: on a HIT/VITAL that does NOT
   kill an agent, set `revealState=REVEALED`. (KILL zone -> DEAD, no glow.)
4. **Glow render**: when `revealState===REVEALED`, after the normal sprite
   paint, stamp NEUROLINK_GLOW.core pixels at the temple cells of the HEAD
   region and NEUROLINK_GLOW.halo above them. This is a POST-PAINT cosmetic
   layer on the composed frame — it reads HEAD region cells, never writes
   region geometry.
   NOTE: terminal-clip law applies — glow layer joins headshot/ragdoll frames
   uncached like the rest of the terminal path.
5. **Beat sync**: glow can pulse on the 120bpm grid (BEAT=0.5s) like all
   animation. Suggested: halo alpha oscillates per beat, core steady.

## LAW COMPLIANCE
- Purple Reservation Law: purple renders ONLY on hatch + agents (eyes, reveal
  glow). Verified in preview: civilian figure contains zero purple pixels.
- Region geometry: untouched. All of this is paint + post-paint cosmetics.

## PENDING PAOLO
- Glow placement final call (temple pixels vs crown vs behind eyes)
- One shared purple vs variation by conversion age

## UPDATE — RAG OUTFITS (7/10/26)
- `BOHEMIA_AGENT_RAGS_7_10_26.js` — 8 preset rag outfits, tints SAMPLED from the
  categorized world tiles themselves (BROWN + NEUTRAL families, dark band), so
  agents literally wear the world's debris colors.
- Plugs into the EXISTING tint system: same shape as `G.tints`
  ({jacket,shirt,pants,shoes:[r,g,b]}), applied through `tintRamp()` — luminance
  preserved, outlines untouched, zero new code paths. Agents roll one at spawn.
- [PENDING Paolo: eyeball the 8; direction is dusty-brown/grey rags — redirect if
  the homeless should read differently.]

## UPDATE — REVEAL TONED DOWN (Paolo verdict 7/10/26)
Revealed state was doing too much purple. New spec: iris px unchanged; glow =
TWO temple core px + ONE dim (alpha~140) halo px per side. NO crown pixels,
NO bloom ellipse. Base-sprite purple footprint cut from ~14px to 6px.
The glow layer stamps exactly: core at HEAD-region temple cells, halo one px above.


==============================================================================
### FILE: BOHEMIA_ANIM_GAP_RECONCILIATION_7_14_26.md
### MD5: ef38e441f715204dabcfeafb027736b3  |  0.7 KB
==============================================================================

# BOHEMIA — ANIMATION GAP RECONCILIATION (7/14/26, corrected)

Join key = clip top-level pack/idx. Coverage: doors 27/30, fires 4/11.
First pass shipped a false 100%-gap list (wrong join key, caught same turn).

## interact_open_close: 3 uncovered
- prov_Doors_and_Arch_00
- prov_Doors_and_Arch_01
- prov_Doors_and_Arch_05

## loop_flicker: 7 uncovered
- p_camp_cookfire_tripod_14
- p_camp_campfire_15
- p_camp_cookfire_pot_16
- p_camp_cookfire_spit_17
- p_camp_campfire_small_18
- p_camp_firewood_stack_21
- p_light_flare_road_05

## loop_particles: 7 uncovered
- o_fx_flame_burst_00
- o_fx_smoke_puff_01
- o_fx_smoke_puff_02
- o_fx_smoke_puff_03
- o_fx_smoke_small_04
- o_fx_ember_trail_05
- o_fx_spark_burst_06


==============================================================================
### FILE: BOHEMIA_COVER_INTEGRATION_7_10_26.md
### MD5: 8565e9347d5bd7ab2ff6d4e1d883b25c  |  1.0 KB
==============================================================================

# BOHEMIA — COVER PROPS INTEGRATION (7/10/26)

## What exists
13 Paolo-confirmed cover props (family='cover' in
BOHEMIA_MULTICELL_SET_7_10_26.txt), from '5. Barricades and defenses'.
All multicell, true-res baked, purity-flagged.

## How code consumes
1. Load multicell set; filter family=='cover' and pure==true.
2. Each cover prop placed on the grid claims its fp cells with:
   blocksMove=true, blocksLOS=partial, coverState='HARD'.
3. Combat bridge: a unit adjacent to a cover cell on the side away from the
   attacker gains inCover=true — feeds the existing cover/pop mechanic
   (dial minigame on pop-out attempts).
4. Open design note (unchanged, Paolo 7/? ): 1v1 pop-button spam acceptable;
   2v1+ must make spam risky. Cover PROPS don't change that logic — they
   only give it world geometry.
5. Render: cover props draw in the standing/prop layer, occlude per DEPTH LAW.

## Pending Paolo
- Which cover props dress the DEMO tunnel (placement = map/his call).
- Soft vs hard cover tiers if he ever wants them (single tier for now).


==============================================================================
### FILE: BOHEMIA_DEMO_BAKE_INTEGRATION_7_10_26.md
### MD5: 3c4048df12ffa29297d00612122e16f4  |  4.5 KB
==============================================================================

# BOHEMIA — DEMO TILE BAKE INTEGRATION (7/10/26)

## What shipped
- `BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt` — 24 tiles, 5 categories, 44px RGBA light
  copies, EXACT same JSON shape as BOHEMIA_TILE_REPO.txt:
  `{version, built, type:{cat:tiletype}, tiles:{cat:[b64...]}, counts}`
- `BOHEMIA_DEMO_TILE_SOURCES_7_10_26.txt` — HD-master pointers per tile
  (file|pack|idx) so any bad cut re-cuts from the masters, per the manifest law.
- `bohemia_purity_gate.py` — permanent FACTORY-LAW gate (see below).

## Categories baked (name -> 7-type)
- sewer_wash  (4)  -> ground   — light dry concrete, the flood channel
- sewer_floor (7)  -> ground   — dark wet stone tunnel floor
- sewer_water (3)  -> ground   — the channel that threads the descent
- sewer_wall  (8)  -> wall     — dark neutral tunnel walls, tonal spread
- sewer_door  (2)  -> door     — dark gates/doors (NOT the hatch)

## HOW THE CODE ACCEPTS IT
1. The bake file is MERGEABLE into the alpha's tile repo: for each category in
   `tiles`, add the category to the alpha repo's `tiles` and its type to `type`,
   update `counts`. New names (sewer_*) cannot collide with existing categories.
2. The judging menu picks the new categories up automatically once merged —
   they land UNJUDGED like all new tiles (per standing law: no pre-approval).
3. The demo map (BOHEMIA_SEWER_DEMO_MAP_SPEC) references zones wash/sewer/water;
   the render bridge maps zone -> category: wash->sewer_wash, sewer->sewer_floor,
   water->sewer_water, plus sewer_wall for tunnel edges, sewer_door for interior
   doors. THE HATCH IS NOT A TILE — it is the one purple PROP, rendered from
   NEUROLINK_GLOW/amalgam colors (see agent look files).
4. MERGE HAPPENS IN THE MAIN PROJECT SESSION that owns the alpha (one-alpha law).
   This chat ships the bake; the alpha-owning session merges it.

## THE PURITY GATE (FACTORY LAW — permanent regression gate)
`python3 bohemia_purity_gate.py <repo.txt>` — exits 1 with a violation list if
ANY tile contains purple px (Purple Reservation Law) or lava-hot px (No Volcano
Law). Runs on light bakes AND HD chunks. Every future tile bake runs this gate
before shipping. Current bake: PASS (0 purple, 0 lava, all 24 tiles).

## PENDING PAOLO
- Eyeball the sewer walls/doors when parked (auto-picked for tone, your call)
- The hatch PROP art itself (drawn marker so far, needs its real look)

## UPDATE (same day) — map data + hatch variants shipped
- `BOHEMIA_SEWER_DEMO_MAP_DATA_7_10_26.json` — the machine-readable map the render
  bridge consumes directly: 14x30 grid, zone->category mapping, computed WALL layer
  (80 cells, every void orthogonally touching walkable), player_start, hatch pos,
  6 validated agent spawns (left chamber x2, right chamber x2, hatch guards x2).
  Render rule: walls draw with `sewer_wall`, doors with `sewer_door`, hatch is the
  purple prop at hatch.pos.
- `BOHEMIA_HATCH_VARIANTS.png` + `BOHEMIA_HATCH_{0..3}.png` — four 44px hatch prop
  OPTIONS for Paolo to pick (dial-directions precedent): 0 MANHOLE (purple seam rim),
  1 VAULT (spoked door, purple core), 2 IRIS (amalgam eye aperture), 3 GRATE (purple
  light bleeding up through slats). All inside the Purple Reservation Law.
  [PENDING Paolo: pick one or redirect.]

## UPDATE v3 — HOMELESS CAMPS (set dressing, 7/10/26)
- Bake gains 4 PROP categories: sewer_prop_bed/trash/crate/misc (6 tiles each,
  purity-gated, cold props only — nothing emissive, No Volcano Law safe).
- Map data gains `props` (23 placements) + `prop_pools`: CAMPS in both ambush
  chambers (bedding + crates + trash = the agents LIVE there, the camp tells the
  story before the fight starts), corners of the hatch room, sparse tunnel and
  wash scatter. No placement collides with a spawn cell.
- Render rule: props draw AFTER ground, same cell, alpha-composited. PROP type =
  walk-around per the 7-type system.
- Map render v3 shipped: camps visible, purity re-verified (0 lava, purple hatch-only).

## v12 UPDATES (7/10/26)
- tiles_multicell.sewer_door_multi: 2 Paolo-validated doors (2x2 industrial,
  2x1 airlock). Render per DOOR FOOTPRINT LAW; 1x1 sewer_door DEPRECATED —
  wire multicell doors into wall lines; junction treatment [PENDING Paolo],
  flush = placeholder.
- Cover props available (family='cover' in multicell set) — see
  BOHEMIA_COVER_INTEGRATION_7_10_26.md; placement = Paolo/map.
- Water slots: lead favorite + 3 Paolo-validated quilts; context dressing
  (clean/dirty) at render per water-context law.
- All consuming rules for families: BOHEMIA_FAMILY_CONSUMER_RULES_7_10_26.md.


==============================================================================
### FILE: BOHEMIA_DEMO_FLOW_7_10_26.md
### MD5: f3b2453c78455d0ae14afe89cce1feb5  |  3.1 KB
==============================================================================

# BOHEMIA — SEWER DEMO FLOW PACKAGE (7/10/26)

## What this is
The demo's encounter data, pacing curve, and music mapping — all derived from
LOCKED canon (combat resolution, map data, music vibe system). No new mechanics
invented. Behavior details stay [PENDING Paolo] where he hasn't ruled.

## 1. AGENT ENCOUNTER DATA (from locked combat resolution)
Combat law: KILL zone = exactly 100 dmg through armor; MISS draws return fire;
HIT damages + clean turn; VITAL damages + stuns 2 turns.

Demo agent stat block (data, ready for entity config):
```
const DEMO_AGENT={
  hp:100, armor:0,            // one-shots on a KILL, per locked demo-enemy law
  revealState:0,               // AGENT_STATE.INTACT (see agent look files)
  skin:'SKIN_TONES_WORLD', iris:'AGENT_IRIS',   // grime skins DEAD 7/10 — rags carry the read
  behavior:'PENDING_PAOLO',    // rush vs throw rocks/sticks vs mix — his call
};
const HATCH_GUARD={...DEMO_AGENT, hp:140};  // survives one KILL-zone shot =
// GUARANTEED reveal moment before death. The demo's horror beat is unmissable
// at the hatch even if the player one-shots everything else.
```
Note: hp:140 on guards is a PROPOSAL — it weaponizes the locked reveal system
so every player sees the NeuroLink glow at least once. [Paolo approves/kills]

## 2. PACING CURVE (tension over the descent — Sasko sticky-note method)
- WASH (rows 0-6): CALM. Bright, open, no enemies. Player learns movement free.
- TRANSITION (7-9): UNEASE. Light drops, walls close in. Still no contact.
- SEWER RUN (10-13): TENSION. Dark, water channel, nothing attacks yet.
- LEFT CHAMBER (14-17): SPIKE — first ambush, 2 agents. First reveal chance.
- CORRIDOR (18): breath.
- RIGHT CHAMBER (19-22): SPIKE — second ambush, 2 agents, player now knows.
- APPROACH (23-24): DREAD. Quietest stretch, longest dark.
- HATCH ROOM (25-29): CLIMAX — 2 guards (reveal guaranteed), then the purple
  hatch. Demo ends at the threshold. Truth found, door unopened.
Shape: calm -> slow build -> spike -> breath -> spike -> dread -> climax.

## 3. MUSIC MAPPING (existing MUS.pool() vibe system, no new songs needed)
- WASH: no music or lowest-key ambient — silence is the calm
- TRANSITION+SEWER: pool('TENSION')
- CHAMBER FIGHTS: pool('COMBAT') on aggro, back to TENSION on clear
- APPROACH: TENSION, lowest-energy pick (or thin the mix if supported)
- HATCH ROOM fight: COMBAT; on clear + hatch approach: single sting, then
  silence over the purple. The quiet IS the reveal. [sting choice PENDING —
  Paolo may want a dedicated cook for the hatch moment]

## 4. MERGE DRY-RUN RECORD (run this session, alpha untouched)
Bake merged against a COPY of the alpha repo: zero category collisions,
14 categories / 899 tiles post-merge, all 44px RGBA, all types legal.
Main session merge is proven safe.

## PENDING PAOLO
- Agent behavior (rush / throw / mix)
- Guard hp:140 reveal-guarantee proposal
- Hatch sting: pick from existing catalog or dedicated cook
- Hatch prop pick (variants 0-3 shipped earlier)

## COVER PROPS (added 7/10/26)
Cover family exists (13 Paolo-confirmed barricade props). Tunnel encounters can use real cover geometry: agent and guards take cover states from props per BOHEMIA_COVER_INTEGRATION_7_10_26.md. Placement = Paolo/map.


==============================================================================
### FILE: BOHEMIA_DOOR_ANIM_INTEGRATION_7_13_26.md
### MD5: af4c2a5050dd19ae3f005251c51af491  |  0.8 KB
==============================================================================

# BOHEMIA — DOOR ANIMATION BANK: integration (7/13/26)
File: BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt
Format: {clips: {name: {style, fp, frames:[b64 x9]}}, frames_per_clip:9}

## Engine consumption (render contract layer 5)
- Door entity holds clipName + state (closed|opening|open|closing) + frame.
- 120 BPM LAW: open/close spans 2 beats; scheduler advances frame on
  half-beat subdivisions (9 frames -> 4 per beat + landing frame).
- COLLISION: passable when frame >= 5; blocks light while frame < 5
  (feeds lighting flood-fill re-run on state change).
- Interact verb 'open' from the requirements matrix triggers toggle; sfx
  hook 'door_metal' fires on frames 1 and 8.
- Factory scales to the other 35 confirmed doors after Paolo validates
  motion on these two (verdicts tune header/edge ratios per style).


==============================================================================
### FILE: BOHEMIA_FAMILY_CONSUMER_RULES_7_10_26.md
### MD5: f993f0ca6e56fd26e33c27f5adb540c7  |  1.9 KB
==============================================================================

# BOHEMIA — FAMILY CONSUMER RULES v2 (7/10/26, FINAL SORT)

All 90 families, 2503 multicell tiles, 0 held.
Content states: USABLE (spawns), MAYBE, UNSCHEDULED (kept/no place), NEVER-SEE (kept/excluded), ACT-2?/ACT-3/ACT-3? (act pools), NIGHTMARE-ONLY (sealed from waking world), quarantines (PIRATE/FANTASY-MEDIEVAL/VOLCANO/ATLANTIS), STYLE-MISMATCH, DEAD (Paolo deletes only).

Engine rule: spawn eligibility = usable OR (no flag AND family rule allows). Never spawn: NEVER-SEE, quarantines, NIGHTMARE-ONLY (outside nightmare), UNSCHEDULED, DEAD.

- furniture (257)
- building_part (251)
- door (129)
- monument (118)
- bridge (114)
- light (98)
- tree (90)
- vegetation (85)
- container (77)
- vehicle (65)
- banner (55)
- sign (52)
- pipe (45)
- spike (43)
- crystal (43)
- stairs_vertical (43)
- stall (36)
- item_pile (35)
- spaceship (34)
- dock (31)
- machine (30)
- rock (30)
- pirate (27)
- fantasy_medieval (24)
- fence (24)
- water_feature (24)
- volcano (21)
- cozy (20)
- brazier (20)
- medieval_misc (19)
- ruin (18)
- tank (17)
- nightmare (17)
- trash_debris (17)
- tent (17)
- hazard (16)
- interior (16)
- chain (16)
- laboratory (15)
- shrub (15)
- wire (15)
- furnace (14)
- grass (14)
- pottery (14)
- cover (13)
- fx (13)
- chains (13)
- remains (12)
- act3_future (12)
- temple_ruin (12)
- fantasy_monument (12)
- blacksmith (12)
- animal (12)
- toxic (12)
- medieval_weapons (11)
- viking_medieval (11)
- tech (11)
- deep_sea (11)
- decor_misc (10)
- lava_cracks (10)
- cauldron (10)
- town_square (9)
- treasure (9)
- petals (9)
- survival_props (8)
- skeleton (8)
- misc_unknown (7)
- bookshelf (7)
- gore (7)
- occult (7)
- cafe_food (7)
- spellbooks (6)
- gore_demonic (6)
- burn_marks (6)
- weapons_supplies (5)
- DEAD (5)
- ship_details (5)
- ladder (5)
- winter (5)
- symbol (4)
- escalator (4)
- alchemy (4)
- astronomy (3)
- path (2)
- window_broken (2)
- shrine (1)
- drinks (1)
- fountain (1)
- vents (1)
- pillars (1)

==============================================================================
### FILE: BOHEMIA_GRAPHICS_SESSION_LEDGER_7_10_26.md
### MD5: cc78c154b9bc64c697810c84edcf6aaf  |  38.6 KB
==============================================================================

# BOHEMIA — GRAPHICS SESSION LEDGER (7/10/26)
Every file shipped this session, what it is, and its status. WRAP CHECKLIST source.

## CANON / LAWS (-> project at wrap)
- BOHEMIA_ADDENDUM_SEWER_DEMO_HOMELESS_7_10_26.md — sewer demo + cybernetic homeless + heirloom hook (LOCKED)
- BOHEMIA_ADDENDUM_PURPLE_RESERVATION_LAW_7_10_26.md — purple = hatch + agents only (LOCKED)
- BOHEMIA_ADDENDUM_NEUROLINK_REVEAL_7_10_26.md — purple eyes + damage reveal (LOCKED)
- BOHEMIA_DEMO_VERDICTS_7_10_26.txt — all Paolo verdicts incl. MAP LAW (Claude never designs layouts)

## TILE LIBRARY (-> graphics project at wrap)
- BOHEMIA_TILECAT_MASTER_7_10_26.txt — v2 master index, 8,674/8,674 categorized
- BOHEMIA_TILECAT_{NEUTRAL,BROWN,GOLD,COOL,REDMAG,GREEN}_7_10_26.txt — six families (REDMAG quarantined)
- BOHEMIA_HD_TYPE_SEED_7_10_26.txt — all 8,674 typed [type,confidence]; 3,694 low-conf PROPs need Paolo first
- bohemia_purity_gate.py — PERMANENT FACTORY-LAW gate (purple + volcano), caught 1 real violation this session

## DEMO PACKAGE (-> alpha-owning session merges)
- BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt — v3: 5 tile cats + 4 prop cats, GATE PASS
- BOHEMIA_DEMO_TILE_SOURCES_7_10_26.txt — HD-master pointers for every baked tile
- BOHEMIA_SEWER_DEMO_MAP_DATA_7_10_26.json — SCHEMA ONLY now (Map Law): grid/zones/walls/spawns/props format. Layout inside is RETIRED, awaits Paolo's shape.
- BOHEMIA_DEMO_BAKE_INTEGRATION_7_10_26.md — merge instructions + dry-run PASS record (zero collisions)
- BOHEMIA_DEMO_FLOW_7_10_26.md — encounter data, pacing curve, music mapping
- BOHEMIA_DEMO_ROOM_TILESET_7_10_26.txt — STALE (pre-verdict picks), superseded by the bake

## CHARACTER / AGENTS (approved unless noted)
- BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js — world-graded SKIN_TONES (APPROVED "fantastic")
- BOHEMIA_SKIN_REGRADE_INTEGRATION_7_10_26.md — how it plugs in
- BOHEMIA_AGENT_LOOK_7_10_26.js — AGENT_IRIS, NEUROLINK_GLOW, state enum
- BOHEMIA_AGENT_REVEAL_INTEGRATION_7_10_26.md — plumbing + toned-down glow spec (6px)
- BOHEMIA_AGENT_RAGS_7_10_26.js — 8 outfits, world-sampled (APPROVED)

## VISUALS (previews, Paolo's judging surface)
- BOHEMIA_SEWER_DEMO_MAP.png — RETIRED as map (Map Law); still shows tile/prop harmony
- BOHEMIA_DEMO_BAKE_SHEET.png — judging sheet (floor2 + water verdicts executed)
- BOHEMIA_HATCH_VARIANTS.png + BOHEMIA_HATCH_{0..3}.png — variant 1 VAULT LOCKED
- BOHEMIA_AGENT_REVEAL_PREVIEW.png — v2 subtle glow
- BOHEMIA_AGENT_RAGS_SHEET.png — approved
- BOHEMIA_SKIN_REGRADE_PREVIEW.png — approved
- BOHEMIA_TILECAT_NEUTRAL_sheet.png, BOHEMIA_TILECAT_BROWN_sample.png, BOHEMIA_DEMO_ROOM_preview.png — working previews

## OPEN — PAOLO
Agent behavior (rush/throw/mix) | guard hp140 proposal | hatch sting | walls/doors eyeball | THE MAP SHAPE (his design, whenever)

## CONTINUOUS COOK BANK (7/10/26, post-rule — all UNJUDGED, gated, banked)
- BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt v2 — 1,019 grounds, chroma metric,
  Paolo-override mechanism, PATTERN quarantine (147+60)
- BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt — 303 walls, 185 S (Paolo: "decent")
- BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt — liquid pass, full quilt
- BOHEMIA_GROUND_VARIANT_BANK_7_10_26.txt — 1,211 seam-preserving variants
  (clean/dirty/tone/wrap-shift, torus grime)
- Period solver: 2 attempts logged, ~3 rescued, bug filed; PATTERN pool intact
- Judgment: ONE mega-session interactive to be built at next milestone; Paolo
  opens whenever he feels like it
- BOHEMIA_PATH_SEAMLESS_SET_7_10_26.txt v2 — TRUE paths (92, bridges expelled)
- BOHEMIA_BRIDGE_SET_7_10_26.txt — NEW bridge category (203, all N-S tagged)
- BOHEMIA_DOOR_EW_BANK_7_10_26.txt — E/W edge candidates for the door library
  (own-frame crop, 7px ref, widths adjustable per doorway)
- BOHEMIA_ALPHA_SURFACE_UPGRADES_7_10_26.txt — 331 alpha surface tiles matched
  to seamless HD versions, drop-in swaps for the merge session
- BOHEMIA_WALL_VARIANT_BANK_7_10_26.txt — wall variants (h-wrap grime), gated
- BOHEMIA_OVERLAY_BANK_7_10_26.txt — 174 ground overlays (foliage 69 / rubble 95
  / stain 10), transparency + ground-hug checked, render-after-ground rule
- BOHEMIA_ITEM_CATEGORY_PROPOSAL_7_10_26.txt — item concept group candidates
  (suggestion-only; feeds demo useless-pickups + game loot layer)
- BOHEMIA_STANDING_SET_7_10_26.txt — 575 standings, 39 floaters flagged for eyes
- BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt — 25 combat floor-paint overlays (red legal)
- BOHEMIA_MEGA_JUDGING_2_7_10_26.html — sweep bundle: overlays/bridges/gore/floaters
- BOHEMIA_ATLANTIS_QUARANTINE_7_10_26.txt v2 — pack-level suggest (3 packs, 112
  tiles); aesthetic concepts don't propagate visually (v1 lesson logged)
- BOHEMIA_BRIDGE_SET (updated) — deck-continuity pass: 59 run-ready N-S bridges
- BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt — roofs through the pipeline
- BOHEMIA_MULTICELL_SET_7_10_26.txt — all 2,503 multicell tiles baked true-res,
  family-classified, purity-flagged
- BOHEMIA_MULTICELL_TRAINING_7_10_26.html — doors/vehicles/fountain training slice
- Multicell held-drain: 542 moved via pack-name rules (19 new families:
  container/pipe/light/vegetation/stall/tent/fence/wire/tank/...); 781 held
- BOHEMIA_DIRECTIONAL_VARIANT_BANK_7_10_26.txt — path/bridge/roof variants,
  grime wraps only along legal adjacency axes
- Heuristic Lessons Ledger filed (4 semantic dims = Paolo-only; 7 measurable)
- BOHEMIA_COVER_INTEGRATION_7_10_26.md — cover family wired to combat
- BOHEMIA_FAMILY_CONSUMER_RULES_7_10_26.md — all 56 families have consuming
  rules or explicit PENDING flags; merge package cross-check complete
- Pack sweeps 1+2 executed (205 tiles Paolo-named); batch 3 pending; 325 held

## WRAP DIFF ADDITIONS (auto-caught)
- BOHEMIA_ADDENDUM_ART_LAWS_VERDICT_BATCH_7_10_26.md
- BOHEMIA_ADDENDUM_GAME_FIRST_LAW_7_10_26.md
- BOHEMIA_ADDENDUM_LEARNED_RULES_7_10_26.md
- BOHEMIA_ADDENDUM_LIGHTING_RESEARCH_7_10_26.md
- BOHEMIA_ADDENDUM_NIGHTMARE_CONTENT_IDEA_7_10_26.md
- BOHEMIA_ADDENDUM_REFERENCE_GRID_PIPELINE_7_10_26.md
- BOHEMIA_ADDENDUM_SHADOWS_CONCEPTS_7_10_26.md
- BOHEMIA_ADDENDUM_SHADOW_TECH_RESEARCH_7_10_26.md
- BOHEMIA_ADDENDUM_TILE_PIPELINE_SEAMS_VARIANTS_7_10_26.md
- BOHEMIA_ADDENDUM_UNIVERSAL_REVEAL_SYSTEM_7_10_26.md
- BOHEMIA_ADDENDUM_VERTICALITY_STAIRS_7_10_26.md
- BOHEMIA_ALPHA_CORRECTIONS_LEARNED_7_10_26.txt
- BOHEMIA_ALPHA_PURITY_AUDIT_7_10_26.txt
- BOHEMIA_BAKE_V8_GALLERY_7_10_26.html
- BOHEMIA_CATEGORY_AUDIT_TOOL_7_10_26.html
- BOHEMIA_CLUSTER_NAMING_7_10_26.html
- BOHEMIA_DOORS_SEAMS_TOOL_7_10_26.html
- BOHEMIA_DOOR_JUNCTION_LAB_7_10_26.html
- BOHEMIA_EW_DOOR_TOOL_7_10_26.html
- BOHEMIA_FAMILY_SORT_TRAINING_7_10_26.html
- BOHEMIA_FX_STRIPS_7_10_26.txt
- BOHEMIA_GRAPHICS_SESSION_LEDGER_7_10_26.md
- BOHEMIA_GROUND_MASTER_SET_7_10_26.txt
- BOHEMIA_GROUND_SPOTCHECK_R3_7_10_26.html
- BOHEMIA_GROUND_SPOTCHECK_TOOL_7_10_26.html
- BOHEMIA_JUDGING_BOARD_7_10_26.png
- BOHEMIA_LIGHTING_PLAYGROUND_7_10_26.html
- BOHEMIA_MASTER_MERGE_PACKAGE_7_10_26.md
- BOHEMIA_MEGA_JUDGING_7_10_26.html
- BOHEMIA_MISC_PACK_SWEEP_1_7_10_26.html
- BOHEMIA_MISC_PACK_SWEEP_2_7_10_26.html
- BOHEMIA_MISC_PACK_SWEEP_3_7_10_26.html
- BOHEMIA_MISC_SPLIT_INTEGRATION_7_10_26.md
- BOHEMIA_MISC_SPLIT_PROPOSAL_7_10_26.txt
- BOHEMIA_PREFAB_KITS_TOOL_7_10_26.html
- BOHEMIA_SEAMLESS_PROOF_GALLERY_7_10_26.html
- BOHEMIA_SEAM_QUILT_TOOL_7_10_26.html
- BOHEMIA_SEAM_R3_TOOL_7_10_26.html
- BOHEMIA_SEAM_SCHOOL_R2_TOOL_7_10_26.html
- BOHEMIA_SEAM_SCHOOL_TOOL_7_10_26.html
- BOHEMIA_SEWER_DEMO_MAP_SPEC_7_10_26.txt
- BOHEMIA_SIDEDOORS_SEAMV2_TOOL_7_10_26.html
- BOHEMIA_TILECAT_BROWN_7_10_26.txt
- BOHEMIA_TILECAT_COOL_7_10_26.txt
- BOHEMIA_TILECAT_GOLD_7_10_26.txt
- BOHEMIA_TILECAT_GREEN_7_10_26.txt
- BOHEMIA_TILECAT_NEUTRAL_7_10_26.txt
- BOHEMIA_TILECAT_REDMAG_7_10_26.txt
- BOHEMIA_VARIANTS_B2_TOOL_7_10_26.html
- BOHEMIA_VARIANTS_BATCH1_TOOL_7_10_26.html
- BOHEMIA_VERDICT_RECORD_7_10_26.md
- BOHEMIA_VERDICT_SESSION_FX_ACT3_PURPLE_7_10_26.html
- BOHEMIA_VERDICT_TOOL_7_10_26.html
- BOHEMIA_WALL_PROOF_GALLERY_7_10_26.html
- BOHEMIA_WINDOW_SET_7_10_26.txt

## 7/13 STRETCH ADDITIONS (Great Sweep era)
- BOHEMIA_ACT1_SWEEP_VERDICTS_MASTER.txt — all 2,604 Paolo verdicts
- BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt — v2 with reclasses/tags/scale fixes
- BOHEMIA_ADDENDUM_ITEM_SCALE_LAW_7_13_26.md — [PENDING Paolo confirm]
- BOHEMIA_ADDENDUM_CURRENCY_LOGOS_IDEA_7_13_26.md — [PENDING Paolo design]
- BOHEMIA_ADDENDUM_ACT1_COMPLETION_PIPELINE_7_13_26.md — the 5-stage map
- BOHEMIA_ADDENDUM_NEIGHBORHOOD_READINESS_7_13_26.md — house factory + kit gaps
- BOHEMIA_ADDENDUM_BLOCK_CANON_7_13_26.md — block = city-view grid cell, street-first
- BOHEMIA_ACT1_VISION_AUDIT_7_13_26.txt — 208 named (sheets 1-5/40)
- BOHEMIA_ACT1_REQUIREMENTS_MATRIX_7_13_26.txt — FULL 1,927 rows (208 final + 1,719 provisional)
- BOHEMIA_ACT1_GAP_QUEUES_7_13_26.txt — anim 37 (doors) / light 65 / sfx 8 / art gaps
- BOHEMIA_STREET_RECIPE_SPEC_7_13_26.md — priority block recipe
Vision-channel note: sheets 6-8 rendered awaiting clean vision pass; emitter
split sheet same. NO names were guessed.

## 7/14 SLEEP COOK (overnight)
- STAGGERED LAMP LAW + NO SINGLE STREET LAW locked into
  BOHEMIA_ADDENDUM_STREET_COMPOSITION_LAWS_7_14_26.md
- STREET TUNER v5: real cane-post lamps staggered Real-Vegas style, fire
  barrels split to their own knob, car no-overlap occupancy + 4-way facings,
  law defaults loaded. 9/9 static checks.
- VISION CORRECTION PASS: sheets 2-4 misnaming purged (batch-positional
  fabrications; 'streetlamps' were sacks), 328 per-item ground-truth names,
  matrix + queues rebuilt, LIGHT REGISTRY v2 (real emitters; electric lights
  PENDING Paolo's act-1 grid-power ruling). Lesson filed in DEMO_VERDICTS.
- HOUSE FACTORY v1 BORN: assembly layer shipped —
  BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt (24 gated stamps, 8 wall kits x
  1 roof pack x 10 approved doors x 83 windows),
  BOHEMIA_HOUSE_FACTORY_GALLERY_7_14_26.html (UNJUDGED),
  BOHEMIA_HOUSE_FACTORY_INTEGRATION_7_14_26.md.
  Known thinness: only ONE roof pack has baked pixels — roof recut queued to
  widen kits after Paolo's verdicts.

## 7/14 SLEEP COOK part 2
- HOUSE FACTORY v1 batch: Paolo verdict ALL DOWN — killed, lesson filed
  (texture rectangles are not architecture). HOUSE PART ROLES labeler built
  (86 pieces, 8 roles) — PARKED for Paolo's morning.
- Vision sheets 9-12 rendered + mapped (street props, warning/road props,
  light sources, trash/debris, chainlink, palisades, pipes/cables) — vision
  channel down again, ZERO guesses banked, awaiting clean window.
- ROOF KIT EXPANSION: 36 act-1-approved roofs baked, purity + wrap-edge seam
  tiering (27 S / 6 A / 3 B). Honest note: all one pack — act-1 roof variety
  will come from part roles + variant palette shifts.
- bohemia_blockgen.js SHIPPED: worldgen Phase B harness — block spec -> CELL
  GRID (semantic layers, never images). Laws encoded and TESTED 9/9: lane
  width 2, line colors, crosswalks only at intersections, staggered lamps,
  car no-overlap, no-single-street variety (>=8 configs per 50 seeds),
  freeway 5-lane preset, determinism. wash/sewer recipes stubbed pending
  Paolo direction.

## 7/14 SLEEP COOK part 3
- Sheets 9-10 came through CLEAN and got banked: 408 total named. Findings:
  THE STREET LAMP FAMILY (7 lit variants incl double-head), fire hydrants,
  parking meter, MANHOLE COVER (sewer-entrance class) + STORM DRAIN (wash
  tie), posted signs (own poles), lanterns, amber/red emergency beacons,
  13 fire barrels/braziers visually confirmed burning.
- Matrix + queues + LIGHT REGISTRY v3 refreshed: flame class linked to
  flicker clips, beacon class (blink), electric family (lamps/traffic/
  spotlight) all held PENDING Paolo's act-1 grid-power ruling.

## 7/14 drive-time cook
- Sheet 9 vision retry: channel still down, no guesses.
- BLOCK RENDERER shipped: bohemia_blockgen semantic grids now paint to pixels
  through the verified pools (the street recipe implementation bridge).
  4 TRUE car facings (0/90/180/270). BOHEMIA_BLOCKGEN_RENDER_PROOF_7_14_26.html:
  6 block types rendered from the law-tested generator, UNJUDGED.

## 7/14 SEAM AUDIT (Paolo request: "look at all the seams, all of them")
- BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt: all 605 approved surface tiles
  audited; 224 clean, 381 fixed (crop-search + wrap-blend), purity-gated,
  re-tiered (257 S / 230 A / 104 B / 14 C).
- Anatomy pool v6: dashed LANE_DIV lines dash-period-cropped on HD masters
  (misalign 1.0 -> 0.0; seams 26-41 -> 15-27); medians re-centered.
- STREET TUNER v6: pools swapped to seam-fixed surfaces + self-meeting lines.
- BOHEMIA_SEAM_FIX_PROOF_7_14_26.html: before/after tiled comparisons.

## 7/14 DEMO SLICE ERA OPENS
- BOHEMIA_NIGHT_BLOCKS_PROOF_7_14_26.html: generated streets + validated
  lighting model (16 levels, flood, max-not-sum, corner quads); fires emit
  their own sampled colors; street lamps DARK pending Paolo's act-1
  grid-power ruling. Day/night pairs, 3 block types. UNJUDGED.
- NEXT: live animated demo slice (fire loops + tappable doors on canvas).
- NEXT-NEXT: walkable slice (120 BPM movement) -> alpha integration.

## 7/14 LIVE SLICE v0
- BOHEMIA_LIVE_SLICE_7_14_26.html: first LIVING block — canvas night street,
  fire loops on the 120 BPM clock (8 frames/beat), additive glow wobble
  synced to flame frames, Paolo-approved swing door tappable (2-beat
  open/close, collision threshold noted at frame 5). Static checks green.
- NEXT: Paolo's eye on mood + live slice; NEXT-NEXT: walkable slice
  (120 BPM movement law) -> alpha integration.

## 7/14 LIVE SLICE v1
- Door + walker now LIT BY LOCAL LIGHT (Paolo callout): per-frame light level
  sample (ambient + reaching fire glow with wobble), multiply tint.
- WALKABLE: proxy silhouette (rig's slot), 120 BPM movement law (input =
  request, step executes on beat tick), wreck collision, door passable from
  frame 5. Static checks 6/6.
- NEXT: Paolo plays it; NEXT-NEXT: rig swap-in + alpha integration path.

## 7/14 LIGHT MODULE + MULTI-BLOCK CITY
- bohemia_light_pass.js: LIGHT PHILOSOPHY LAW as tested engine module
  (5/5: emitter level, ambient, falloff, wobble, settable) — alpha-ready.
- LIVE SLICE V3: FIRST MULTI-BLOCK CITY — 4 stitched generated blocks
  (2-lane+crosswalk / 2-lane / residential / 3-lane), 2 tappable doors,
  camera-follow, RUN mechanic (hold 2+ beats = 2 cells/beat per 120 BPM
  LAW). Static checks 7/7 incl. law draw-order verification.
- NEXT: Paolo plays V3; NEXT-NEXT: rig swap-in plan + alpha absorption of
  bohemia_light_pass.js + blockgen.

## 7/14 ALPHA ABSORPTION PLAN
- Alpha recon: no existing lighting (clean drop for light pass), ANIMBEATS
  clock present, CombatBridge + LOD confirmed.
- BOHEMIA_ADDENDUM_ALPHA_ABSORPTION_PLAN_7_14_26.md: 5 modules/banks, 5-step
  surgery order, gates, ONE-ALPHA caution (surgery in main project with
  Paolo).

## 7/14 SHEETS 9-12 BANKED (context recheck win)
- 65 new ground-truth names (473 total). Discovery: light-sources #0-6 = the
  REAL lit street lamp sprites (canonical lamp family; act-1 dark state
  needs unlit variants — queued). 17-pack signs are STANDING; 14-pack are
  faces for the pole line.
- Matrix rows finalized for 9-12; queues refreshed; LIGHT REGISTRY v4
  (+lamps/beacons/flare). LESSON: recheck context before declaring a vision
  view failed.

## 7/14 DARK LAMP FACTORY + SHEETS 13-16 RENDERED
- BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt: act-1 dead-grid lamp states for
  the real lamp family — glow pixels dimmed to dead glass, poles
  byte-identical, machine-gated (glow-kill >90% / pole-untouched / purity).
  Lit originals = powered state for later acts / Paolo's ruling.
- Sheets 13-16 rendered + mapped (doors, windows, broken walls, scrap
  panels, floors) — vision window closed again, zero guesses banked.
- NEXT: name 13-16 on a clean window; emitter-split leftovers.
- NEXT-NEXT: house factory v2 on Paolo's labels; absorption session.

## 7/14 WEATHER VARIANT FACTORY
- Street/side pools bred bleach+grime siblings (interior-only jitter, edge
  bands byte-identical, luminance delta bounded, purity) — repetition broken
  with zero seam risk. Tuner v15. Sheet 13 vision retry: window closed.

## 7/14 DAY CYCLE + SLICE V4
- bohemia_daycycle.js: sun-grounded ambient curve (7/7 tests: Paolo night
  floor, full noon, warm golden hour, continuity, wrap). DUSK values flagged
  tunable for Paolo.
- LIVE SLICE V4: time-of-day slider + auto 2-min day, ambient live through
  the light-pass law every frame; walker step TWEEN (smooth slide over
  0.6 beat) + facing marker. Static checks 8/8 incl. law order intact.

## 7/14 SLICE CORE + PEOPLE
- bohemia_slice_core.js: beat clock, grid mover (walk/run law), door
  controller (2-beat swing, passable f>=5), wanderer brain — 8/8 tests.
  Absorption-ready; slice logic no longer inline-only.
- LIVE SLICE V5: THE CITY HAS PEOPLE — 3 wanderer NPCs on the shared beat
  clock, colliding honestly (wrecks/doors/player), drawn in the scene pass
  so the light law owns them too. Checks 6/6. Sheet 14 vision: closed.
- NEXT: vision windows for 13-16; Paolo labels -> house v2.
- NEXT-NEXT: absorption session (light, daycycle, slice core, blockgen).

## 7/14 I-MOVE-YOU-MOVE HONORED (Paolo canon reminder)
- Time model law re-affirmed in graphics plumbing: world advances ONLY with
  player movement (1 step = 1 world beat; day = 1440 beats). Flames flicker
  cosmetically, never world state.
- bohemia_slice_core.js + makeTurnClock (frozen-world tests green).
- LIVE SLICE V6: GAME TIME default (world frozen till you step; survivors +
  sun advance with your beats), FREE RUN kept as demo toggle. Checks 7/7.

## 7/14 WORLD CLOCK WALK LAW (researched + filed)
- Real valley civilization: ~20 mi E-W (Clark County Urban Planning Area);
  walking speed 1.4 m/s (design-manual standard) -> 6h23m nonstop crossing.
- LAW: 1 overmap grid = 4 min game time; fine step = 1.9 s walk / 0.9 s run;
  32 walk-steps per game minute. I-move-you-move untouched. Supersedes the
  10-min placeholder + the slice's 1440-beat day.

## 7/14 SLICE V7 — WORLD CLOCK LAW WIRED
- bohemia_slice_core.js + makeWorldClock (law constants; 4 tests green:
  22:00 start, 128 steps = 4 min, 32 steps ~ 1 min, run cost).
- LIVE SLICE V7: every step advances 1.9s game time (0.9s running), TOD
  driven by world seconds, HUD shows the law clock. BEHAVIORAL GATE PASS
  (64 steps ~ 121.6s advanced; run per-cell cost < walk).

## 7/14 OVERMAP BRIDGE — REAL VEGAS RENDERED
- bohemia_overmap_bridge.js: canonical overmap cell -> blockgen recipe by
  district; cell's OWN seed drives generation (deterministic per Continuous
  Walk Law); quality -> wreck density [tunable]. TESTS 7/7 (Strip sidewalk
  law 3, freeway 5 lanes, determinism, suburb 1+1, pending marker for
  untemplated districts).
- BOHEMIA_REAL_VEGAS_BLOCKS_7_14_26.html: 4 canonical locations rendered
  day+night (arterial 16,3 / suburb 20,3 / STRIP 51,29 / downtown 50,22).
- Sheet 15 vision roll: closed again.
- NEXT: Paolo judges real Vegas; vision windows.
- NEXT-NEXT: bridge + all modules into the absorption session.

## 7/14 LANE RESEARCH (Paolo: stop hallucinating lanes)
- BOHEMIA_ADDENDUM_VEGAS_LANE_RESEARCH_7_14_26.md: sourced table — Strip
  3/dir (min 6 through, reads 8-10 w/ pockets); arterials 3/dir + dual/
  triple turn pockets + bus lanes; I-15 resort corridor 5/dir (NDOT) + HOV;
  residential 1/dir; suburban sidewalks ~5ft (1 cell). Paolo's lane law =
  real Vegas exactly (freeway 5 = I-15).
- Bridge recipes corrected (arterial default 3/dir); tests 4/4.
- Turn-pocket anatomy added to gap queues (art + recipe grammar pending).

## 7/14 REAL VEGAS v2
- Gallery regenerated on researched lanes: arterial 3/dir, Strip 3/dir +
  sidewalk 3 + median, I-15 5/dir. Five canonical locations day+night.
  UNJUDGED. Sheet 16 vision roll: closed.

## 7/14 SLICE V8 — REAL VEGAS WALKABLE
- Route: canonical cells (33,6) suburb -> (34,6) suburb -> (35,6) commercial
  -> (36,6) arterial, seed 12345, researched lanes, full stack (game time,
  world clock law, NPCs, doors, fires). BEHAVIORAL GATE PASS (20 steps =
  ~38s world time, NPCs walk).
- Terrain packs located for desert/wash recipes (grass, dirt, rock, burnt
  ground, rubble) — desert/mountain bridge recipes possible next.

## 7/14 TERRAIN ERA — VALLEY EDGES COVERED
- Terrain pools from proven seamless bank (desert 12 / scorch 6 / rock 4).
- blockgen: desert + mountain types (8/8 tests incl. street/freeway
  regressions, desert-passable law, mountain-density law, determinism).
- Bridge: DESERT (589 cells) + MOUNTAIN (895 cells) now covered — 1,484
  more canonical cells renderable. Real Vegas gallery v3 adds desert edge
  + mountain rim day/night. WASH still pending (channel recipe needs Paolo).

## 7/14 TERRAIN v1 DOWN — PICKER SHIPPED
- Terrain v1 graveyarded (seams broken by re-cutting raws instead of using
  the bank's stored processed pixels; pools machine-picked without Paolo).
- BOHEMIA_TERRAIN_PICKER_7_14_26.html: seamless-bank candidates shown 3x3
  tiled (seams naked), tag DESERT / ROCK / SCORCH / NO. Paolo's export =
  the pools, verbatim. Terrain v2 renders only from his picks.

## 7/14 TERRAIN v2 — PAOLO'S PICKS LIVE
- Picker export applied verbatim: desert 9 (+TP22 fav 2x weight), rock 1,
  scorch 3, 15 killed. BOHEMIA_TERRAIN_PICKS_7_14_26.txt = same-turn repo.
- Pools carry the seamless bank's stored pixels untouched (source-of-truth
  law). Real Vegas gallery v4: desert edge + mountain rim re-rendered from
  his tiles (v1 corpse kept above for contrast). Boulder sprites still an
  honest gap (no judged rock formations).

## 7/14 DESERT DOMINANCE LAW (Paolo: too much diversity)
- Desert ground: TP22 (his favorite) dominates ~85%; other picks appear only
  as coherent value-noise clusters (one tile per region). Per-cell shuffle
  BANNED for open terrain. Gallery v5 cards TV3-x for verdict.

## 7/14 ENGINE BUNDLE + UNIFIED TESTS
- bohemia_engine_graphics_7_14_26.js: all five graphics modules in one
  import (light pass, day cycle, slice core w/ 3 clocks, blockgen w/
  terrain, overmap bridge w/ researched lanes).
- bohemia_graphics_tests.js: ONE command runs every module's suite.
  Sheet 13 vision roll: closed again (image returned empty).

## 7/14 V8.1 PERF HARDENING
- Render locked to flame subframe clock (~16fps) + dirty-flag: idle GPU work
  cut ~73%; input/door changes render instantly; hidden tab skips work.
  Behavioral gate: 60 RAF frames/s -> <=20 renders idle, immediate render
  on step. iPhone battery honesty for the demo slice.

## 7/14 MEGA VERDICT SESSION SHIPPED
- BOHEMIA_MEGA_VERDICT_SESSION_7_14_26.html: milestone consolidation —
  dark lamps proof, weather sibling proofs embedded; real vegas / night
  blocks / slice V8.1 feel / tuner v15 / mounted signs as checklist rows
  (LATER = valid). One export. Nothing blocks on it.

## 7/14 MEGA BLESSED + RUIN FLANKS
- Paolo blanket UP on the mega session -> banked (BOHEMIA_MEGA_VERDICTS_
  BANKED_7_14_26.txt): dark lamps = act-1 canon states, mounted signs
  approved (+10 matrix rows, sign queue cleared), weather/tuner/slice/
  galleries blessed.
- RUIN FLANK LAW in blockgen (7/7 tests): street building-edges carry
  judged broken-building fragments, lawful spacing, decay-scaled density,
  impassable, never on crosswalks. Proof card RF0 in the gallery.

## 7/14 SIDEWALK SANCTITY LAW + VERDICT BANK
- Real-vegas exports banked: desert dominance UP (locked), mountain UP,
  all 5 researched-lane street blocks UP, terrain v1 + confetti desert
  DOWN (already graveyarded), RUIN FLANKS DOWN.
- SIDEWALK SANCTITY LAW filed (addendum): sidewalks carry lamps/street
  furniture ONLY; buildings+ruins live past the sidewalk in a zone whose
  laws don't exist yet; street blocks END at the sidewalk back edge.
- Flank pass reverted from blockgen; 6/6 revert+regression tests green.

## 7/14 SMALL-SHEET VISION EXPERIMENT + SFX MANIFEST
- Experiment answered: even a 10-item small sheet returns blank — the
  vision channel is fully closed this stretch, sheet size is not the
  variable. Emitter split stays queued.
- BOHEMIA_SFX_HOOK_MANIFEST_7_14_26.txt compiled from the matrix: every
  named asset's engine sound hooks grouped (one sound per hook serves all
  listed assets), anim loops needing synced audio listed, standing law
  hooks (door 2-beat, fire crackle, walk/run steps) included. Clean
  handoff for the audio side.

## 7/14 PIPELINE STATUS DASHBOARD
- BOHEMIA_PIPELINE_STATUS_7_14_26.html: glanceable state — 473/1927 named,
  queues, today's 9 locked laws, the pending-Paolo shelf (10 items), and
  the three loaded cannons. Compiled from banks on disk, zero invention.

## 7/14 BEYOND-SIDEWALK RESEARCH FILED
- Real Vegas zone anatomy sourced (LV Title 19 + FHWA): suburb yards 20ft
  (~8 cells), compact 15/10ft, estates 30ft, legacy commercial = PARKING
  FRONTS STORES (the 2020s fabric), modern code = building-forward,
  downtown = zero setback, resort porte-cochere 30ft min. Six forks
  written for Paolo's rulings. The frontier is armed, not designed.

## 7/14 CELL-IS-PLOT + WALLED SUBURBS LOCKED (Paolo rulings)
- Each overmap cell IS its assignment: commercial = parking lot w/
  storefront; suburb = WALLED neighborhood (quality-gated: nice = walls +
  gates, rough = open driveways to the arterial). Streets = connective
  tissue, certified. Scale reconfirmed: 128x128 = 16,384 tiles per grid.
- Unlocks: suburb plot generator (wall ring + gates) and commercial plot
  generator (parking apron + storefront run) as next builds.

## 7/14 FULL QUEUE PRE-RENDERED (Paolo: graphics graphics graphics)
- ALL 1,454 remaining unnamed UPs now rendered as verdict-ready sheets
  (13 through ~53, 40 assets each, priority-ordered: doors/windows/walls/
  floors/signs/lights first), each with a saved position map + master
  index (/home/claude/sheet_index.json). Any vision window now mass-banks
  hundreds instantly, zero prep latency. Channel remains closed (2 fresh
  blanks on 13) — patrol continues every turn.

## 7/14 PLOT GENERATORS — CELL-IS-PLOT AS ENGINE CODE
- bohemia_plotgen.js: suburbPlot (perimeter wall ring, quality-gated per
  WALLED SUBURBS LAW, 2 gated 3-cell entries researched-default, interior
  empty awaiting house labels) + commercialPlot (24-cell parking apron
  fronting a storefront band, backlot behind). 9/9 standalone tests;
  bundled; unified suite now 40/40. Pending flags carried in meta:
  wall threshold + gate rules + yard fill + stall striping + wall art.
- Vision patrol: sheet 18 blank. Channel still closed.

## 7/14 DISTRICT MERGE LAW (Paolo) — MULTI-CELL PLOTS LIVE
- LAW: adjacent same-type cells MAY merge (2 or 4 residential = one
  walled neighborhood; same commercial/industrial). Addendum filed.
- plotgen: shape-aware plots (1x1 to 2x2, 256x256 tracts); single ring
  wraps the union, no interior walls, gates scale with frontage;
  commercial apron spans full merged frontage. bridge: clusterFor()
  seeded merge coin (p=0.6 default, PENDING), deterministic, every
  member cell resolves its slice. 10/10 new tests; unified suite 44/44.

## 7/14 WALL PICKER SHIPPED
- BOHEMIA_WALL_PICKER_7_14_26.html: seamless wall bank candidates shown
  as 6-tile RUNS (walls live as runs). Paolo tags PERIMETER / NO; picks
  become the perimeter wall pool for the walled-suburb render proof.
  Sheet 19 patrol: channel still closed.

## 7/14 WALL HEIGHT LAW (Paolo): perimeter walls minimum 2 tiles tall
- Wall picker rebuilt: same 44 candidates, every run now 6 wide x 2 TALL.
- plotgen wall props carry hTiles:2; verified across merged plots.

## 7/14 WALL PICKS + TAN FACTORY
- Paolo picked W26-W37 (12 perimeter walls; W36/W37 seam-flagged).
  Direction: 85% of Vegas walls = desert yellow tan -> tan variants
  factory-built (luminance-preserving uniform recolor, seam-safe by
  construction, drift measured ~0). Pool banked: 85% tan / 15% original
  (BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt). Proof gallery shipped with
  original-vs-tan pairs for verdict.

## 7/14 TAN BLESSED + WALLED SUBURB PROOF
- Paolo "Perfect!" on tan walls -> pool locked 85/15.
- Gallery cards SP0-SP2: gate closeup w/ 2-tall tan faces (day+night),
  single 128x128 tract overview (ring + 2 gates), merged 2x1 overview
  (one ring, no interior wall, 4 gates). Yard ground = TP22 placeholder,
  yard fill law still PENDING.

## 7/14 NEIGHBORHOOD ANATOMY + PLOTGEN v2 (Paolo verdict R2)
- Downvoted forever + purged from gallery: SP0-2, RF0, T0/T1, TV2-0/1.
- Research filed (BOHEMIA_ADDENDUM_VEGAS_NEIGHBORHOOD_ANATOMY): Vegas
  suburbs = curvilinear loops+culs, hierarchical discontinuous (ITE),
  few deliberate arterial entries; ~80 guard-gated of 580+ communities
  (Ridges = 2-3 gate layers) -> gated = rich confirmed by data.
- THREE LAWS in plotgen v2 (11/11): ONE WALL PER COMMUNITY (seeded
  style, uniform ring, variety between plots); GATES TOUCH STREETS
  (entries only on street-facing edges, entrance = suburb_road + 4-cell
  inward stub); GATED = RICH (walls common, gate hardware only top
  quality). bridge.plotFor() detects real street edges from the overmap.
  Unified suite green after refresh.

## 7/14 COMMERCIAL v2 — APRON FACES THE STREET
- commercialPlot rebuilt: parking apron orients toward the primary street
  edge (all four orientations tested), storefront band behind it, backlot
  deepest; 3-cell driveway curb cuts only on street edges (gates-touch-
  streets law, general). 8/8 new tests; unified suite 44/44 after refresh.
- Vision patrol sheet 20: blank.

## 7/14 RESIDENTIAL FAMILY COVERAGE
- gated (27 cells) / estate (83) / trailer (16) districts wired through
  plotFor with character overrides on the same three suburb laws:
  gated = walled+gated by definition; estate = walled+gated, 12-cell
  setback tag; trailer = open unwalled. 5/5 tests on real overmap cells;
  unified suite 44/44 after refresh. Patrol sheet 21: blank.

## 7/14 INDUSTRIAL PLOTS + DASHBOARD v2
- industrialPlot: street-facing drive apron, shed band, gravel yard,
  fence ring (fence family != community wall, art pending) w/ drive cuts
  on street edges; bridge maps industrial/warehouse/railyard/storage
  (50 cells). 6/6 tests; unified 44/44. Patrol sheet 22: blank.
- Pipeline dashboard refreshed to post-plot-era truth (14 laws, coverage
  table, shelf, cannons).

## 7/14 BIG-ACREAGE GRAMMAR (wash/solar/farm)
- Semantic-role grammars, art pools PENDING: wash = centered concrete
  floor + slopes + one-side service road (37 cells); solar = panel rows /
  service aisles, fenced (303 cells); farm = field rows + lanes every 8
  (162 cells). 11/11 tests incl. street regression; bridge covers all
  three; unified 44/44. 502 more canonical cells typed. Patrol 23: blank.

## 7/14 AIRFIELD GRAMMAR + SESSION MANIFEST
- airfield grammar (runway 3-wide w/ centerline, parallel taxiway, apron
  band) covers airport+airbase (102 cells); 5/5 tests; unified 44/44.
- BOHEMIA_SESSION_MANIFEST_7_14_26.md: every output file indexed with
  size + md5. Patrol sheet 24: blank.

## 7/14 VALLEY COVERAGE ATLAS
- BOHEMIA_VALLEY_COVERAGE_ATLAS_7_14_26.html: full 96x96 canonical valley
  rendered as one color-coded picture — every generating family + counts,
  red = Paolo-designed landmarks. One glance = state of the world.
  Patrol sheet 25: blank.

## 7/14 UNIFIED SUITE CONSOLIDATION
- All standalone test blocks from today folded into
  bohemia_graphics_tests.js: plotgen v2 full (walls/entries/overrides),
  commercial orientations, industrial, wash/solar/farm/airfield, bridge
  full-coverage checks on real overmap cells. ONE command now proves the
  entire graphics era. Patrol sheet 26: blank.

## 7/14 ABSORPTION PREFLIGHT
- Dry-run rehearsal against the uploaded alpha (no alpha produced —
  ONE-ALPHA law): anchors verified, BOH_* namespaces collision-checked,
  insertion budget measured, test-gate portability confirmed. Report:
  BOHEMIA_ABSORPTION_PREFLIGHT_7_14_26.md. Patrol sheet 27: blank.

## 7/14 STALL STRIPING FACTORY (art gap -> candidates)
- Faded white stall-line tiles composited onto certified parking concrete
  (v+h, broken/aged), apron mock at real spacing (stall lines every 4
  tiles, drive aisle every 4th row). Candidates banked UNJUDGED — enter
  pools only on Paolo UP. Answers "is the coding graphics": pivoted to
  pure tile production for vision-independent art gaps.

## 7/14 PARKING GEOMETRY LAW (Paolo)
- ST0 UP (stall-line tiles live), ST1 DOWN -> law: lines every 3rd tile
  with SHARED dividers (strip space space strip), stall interior = 2
  tiles (cars 2 wide), rows 4 deep, aisles max 4 (circulation). Proof v2
  zoomed out with certified wrecks parked to prove the 2-wide fit.

## 7/14 PARKING BLESSED -> SCALED + ENGINE LAW
- PK0/PK1 "perfect" -> stall-line pools scaled to the FULL certified
  concrete pool (v+h) and banked with the geometry law. commercialPlot
  aprons now carry stall semantics natively (aisle nearest street, stall
  bands 4 deep, lines every 3rd shared, 2-tile interiors). 5/5 engine
  tests; unified suite 76/76.
- Post-mortem: first engine edit missed its anchor (assert failed, file
  untouched) and the gate caught the phantom immediately — fixed against
  the real anchor, suite fully green.
- Post-mortem round 2: my patch invented a helper (put) the function never
  had. Root cause: editing from memory instead of reading the file. Fixed
  by reading the real internals and reusing the actual coordinate mapping.
  Parking law live in engine, unified suite fully green.

## 7/14 TURN MARKING FACTORY (candidates, unjudged)
- Two-way-left-turn center lane tiles (solid yellow outer + dashed yellow
  inner, L/R + T/B siblings, both axes) + turn-pocket dashed white lines
  (both axes) composited on certified concrete with certified line colors.
  36 candidates banked UNJUDGED; proof shows assembled EW center strip +
  pocket run. Line-war rules honored (axis explicit per variant).
  Patrol sheet 28: blank.

## 7/14 ANIM RECONCILIATION + APRON PROOF
- BOHEMIA_ANIM_GAP_RECONCILIATION_7_14_26.md: matrix anim rows crossed
  against door/fire banks -> exact named gap lists per hook family.
- CA0 in the gallery: engine-generated commercial apron from plotgen,
  BLESSED MATERIALS ONLY (parking law + stall tiles + certified concrete
  + wrecks parked 2-wide, day+night); storefront band deliberately
  excluded (no blessed material). Patrol sheet 29: blank.
- Reconciliation corrected same turn (first pass used a wrong join key
  and claimed 100% gaps): real coverage computed against clip pack/idx.

## 7/14 BLANKET UP + ANIM GAP COOK
- Paolo thumbs-up everything -> CA0/TM0/TM1 banked; turn-marking pools
  promoted into the harmonized bank (twlt v/h siblings + pocket lines).
- Animation debt cooked: 7 fire flicker loops (warm-pixel oscillation) +
  3 door double-swings (center squash), every clip machine-gated for
  frozen borders (leaf-pixel law). Banked UNJUDGED; live-looping proof
  page shipped for verdict.

## 7/14 ANIM VERDICTS -> LAWS + RECOOK
- 5 fires UP -> folded into canonical fire bank (now 39 clips).
- UNLIT-NO-FLICKER LAW: firewood stack anim corrected to none in matrix.
- DOOR LEAF LAW: single doors = single leaf hinged one side; center split
  = double doors only. 3 doors recooked single-leaf (hinge left), borders
  gated, proof v2 shipped UNJUDGED.

## 7/14 DOOR FRAME LAW (Paolo) + v3 RECOOK
- LAW LOCKED: all doors have frames; E/W/N door borders NEVER animate
  (new machine gate byte-verifies the bands per frame); leaf swings
  inside over a dark revealed opening; SOUTH edge may move; hinge west.
- v2 center-and-frame animation graveyarded; v3 shipped UNJUDGED with
  the gate green on all 3 doors.

## 7/14 DOORS v3 BLESSED — OPEN/CLOSE QUEUE CLOSED
- All 3 UP -> folded into canonical door bank (30 clips). Anim queues:
  open/close CLOSED 30/30, flicker CLOSED 10/10, particle loops (7) =
  the only remaining animation debt in act 1.

## 7/14 PARTICLE LOOP COOK (last anim debt)
- The 7 are FX sprites (Embers and particles pack): type-matched loops
  cooked — smoke puffs rise/sway/fade, flame burst pulses, ember trail
  drifts, spark burst expands/fades. Borders machine-gated. Banked
  UNJUDGED; dark-bg live proof (SUN-MODE exception: FX unreadable on
  light, brightness-lift is the dark canvas itself). Patrol 30: blank.

## 7/14 PARTICLES BANKED + DASHBOARD v3
- 5/7 particle loops UP -> BOHEMIA_PARTICLE_LOOP_BANK_7_14_26.txt;
  puffs 02/03 pending (no verdict, not DOWN). Queues updated.
- Dashboard v3: evening truth (markings complete, anim closed, atlas,
  preflight green).

## 7/14 BIG TURN: WEATHER MASS + CENTER TURN + GALLERY v6
- MASS WEATHER FACTORY: bleach+grime siblings for 14 pool families, +188
  tiles, ALL edge-identical to parents (0 gate failures).
- CENTER TURN LANE in blockgen (opts.centerTurn converts median band to
  twlt_T/B rows, sidewalk-safe widen; 6/6 + unified 78/78).
- Gallery rebuilt CLEAN as v6: new center-turn arterial proof (blessed
  twlt pools + weathered siblings live) + median regression reference,
  day+night; all graveyard cards gone. Patrol sheet 31: blank.

## 7/14 V6 DOWN -> WEATHER RARITY + MARKINGS-30YR LAWS
- Root cause of color chaos: 188 siblings entered pools at EQUAL weight
  (color confetti). Fixed: pools = parents only; siblings moved to a
  weather_variants store drawn at 12%.
- MARKINGS-30YR LAW: every white/yellow across lane/median/cross/stall/
  twlt/pocket pools washed 0.55 toward local asphalt (fresh paint killed);
  act-1 locks the base for all acts. Gallery v7 shipped (V6 purged).

## 7/14 V7 BLESSED + DEEPER WASH (v8)
- V7 both UP; Paolo tune: dull markings further -> second wash pass
  (0.40, relaxed thresholds) on all marking pools + weather variants.
  Gallery v8 confirm cards shipped.

## 7/14 V8 BLESSED + SLICE V9 (big turn)
- V8-0/V8-1 blessed -> 30yr wash LOCKED at compound strength.
- LIVE SLICE V9: same canonical route rebuilt on the fully blessed pool
  state (washed markings, weather rarity 88/12, arterial rendered with
  the CENTER TURN lane, single-leaf door in the anim set, 60 wreck
  occupancy cells). Behavioral gate: world clock exact, wreck collision
  blocks movement.
- WALL PICKER BATCH 2 shipped (remaining 48 candidates, 2-tall runs).
  Patrol sheet 32: blank.

## 7/14 LAMP HEIGHT LAW + RARE BARRELS + CLUSTER LORE
- Researched: residential 20-30ft / highway 30-50ft = 3.5-8x human ->
  Paolo's ruling filed: lamps 3 tall (small streets) / 4 tall (arterial+),
  DEAD by default; fire barrels demoted to RARE standalone sidewalk props
  (3%), never lamp stand-ins. Engine + tests + bundle (suite 80/80).
- Clustered-power lore: circuit-failure + copper-theft grounding filed;
  Claude recommendation (10-15% lit, light=territory, NETWORK zones
  eerily perfect) PENDING Paolo lock.

## 7/14 CLUSTERED POWER LOCKED + POWER GRID MODULE + MONEY IMAGE
- Paolo locked the cluster lore ("I like the answers"): 12% nominal lit,
  light=territory, NETWORK zones eerily perfect (placement = his call).
- bohemia_powergrid.js: circuits = feeder-scale street runs (1,662 on the
  canonical valley), seeded 12% live (measured 11.6%), owners tagged
  (settlement/faction/network/solar_lone), clustering proven by adjacency
  test. 5/5.
- Gallery card LT0: night arterial, 4-tall dead lamps into a LIVE
  settlement circuit (lit lamp sprites, 12-cell arterial radius) and back
  to dark, rare barrel. The light=territory image, rendered.


==============================================================================
### FILE: BOHEMIA_HOUSE_FACTORY_INTEGRATION_7_14_26.md
### MD5: dab494622cb7dfbbca3104a08f00aea5  |  1.3 KB
==============================================================================

# BOHEMIA — HOUSE FACTORY: integration (7/14/26)
Bank: BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt
Format: houses[] each {fp "WxH", wall_pack, roof_pack, door [pack,idx],
windows [[pack,idx]..], door_x, win_x, gates{}, b64 stamp}

## What it is
The assembly layer between tiles and neighborhoods: a typed generator that
composes complete house prefab stamps from approved banks (Factory Law:
spec -> generator -> gated batch -> Paolo verdict pipeline).

## Engine consumption
- A house prefab = footprint + the stamp + semantic cells: wall row solid
  (light_block), door cell = door entity (anim bank open/close, collision
  toggles), interior behind the facade loads on entry (drill-in scale).
- Worldgen lots consume prefabs: lot picks a Paolo-approved KIT (wall pack x
  roof pack combo from his gallery verdicts) + footprint that fits the lot;
  variant factory palette-shifts for tract variety (Vegas repetition law).
- Structural gates re-run at spawn (regression): door in bounds, windows
  clear, purity.

## Next / next-next
Paolo judges the 24 -> kit canon locks -> LOT PASS (lots consume approved
kits) -> BLOCK ASSEMBLY (street recipe + flanking lots = first full block
galleries). Suburban Vegas kit art (garage/stucco/driveway/block wall)
remains the named gap for true tract neighborhoods.


==============================================================================
### FILE: BOHEMIA_LIGHTING_INTEGRATION_7_13_26.md
### MD5: ab3180cd41992aa528bb16f3e62a4808  |  1.4 KB
==============================================================================

# BOHEMIA — ACT-1 LIGHTING WIRING (7/13/26)
File: BOHEMIA_ACT1_LIGHT_SOURCES_7_13_26.txt (registry of every act-1 emitter)

## Engine consumption (render contract layer 8, validated lighting model)
- On block load: place emitters from prop instances; lightmap = flood-fill
  per channel, max-not-sum, 16 levels; corner-averaged quad per cell.
- FIRE sources: light level wobbles ±flicker_amp on beat subdivisions,
  synced to their 8-frame flame loop (same clock — 120 BPM LAW).
- ELECTRIC: steady with rare stutter (amp 0.03) — post-collapse grid mood.
- Door state feeds occlusion: closed door blocks, open doesn't (door bank
  collision threshold frame 5) -> re-flood on door events.
- emit_color per source; falloff curve + radii = [PENDING PaolO] one knob
  session, defaults shipped (fire 4 cells, electric 6).
- Street recipe consumes emitter_spacing as the darkness-rhythm knob.


## METER-GROUNDED LAMP RADII (research, 7/14/26)
Rule confirmed across sources: illuminated width ~ pole height; useful
radius ~1-1.5x height. Vegas classes -> game (1 cell ~ 1m):
| class | pole | game radius |
|---|---|---|
| residential lamp | 6-9m | 8 cells |
| arterial/commercial | 8-12m | 12 cells |
| highway mast | 12-15m | 15 cells |
| fire barrel | open flame | 4 cells |
| lantern/flashlight | handheld | 3 cells |
NIGHT AMBIENT: raised 10 pct per Paolo (2.2/2.4/3.2 -> 2.42/2.64/3.52 of 16),
"not too dark, just right".


==============================================================================
### FILE: BOHEMIA_MASTER_MERGE_PACKAGE_7_10_26.md
### MD5: 3ca6071a8445e8016ef2a5ea4e8506c1  |  3.5 KB
==============================================================================

# BOHEMIA — MASTER MERGE PACKAGE (7/10/26)
One index of EVERYTHING this graphics session shipped, with exactly how the
code accepts each piece. The alpha-owning session works top to bottom.

## 1. DEMO (merge first — smallest, fully Paolo-verdicted)
- `BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt` v11 — merge into TP_TILES (dry-run
  proven zero collisions). Categories prefixed sewer_*. GATE PASS.
- `BOHEMIA_SEWER_DEMO_MAP_DATA_7_10_26.json` — SCHEMA only; layout comes from
  Paolo/proc-gen (Map Law). Props/spawns/walls format ready.
- `BOHEMIA_DEMO_FLOW_7_10_26.md` — encounter data, pacing, music pools.
- Skins/agents/rags JS files — drop-in per their integration mds. Reveal
  visual: ONLY via Universal Reveal System (fiber-optic direction).

## 2. LIBRARY SETS (the game's surfaces — consume via pointers/b64)
Format shared by all sets: {tiles:[{file,pack,idx, method, crop?|b64?, sal,
tier, pure}]}. RULES: tier = seam-readiness NOT tile quality; 'crop' rebuilds
from HD masters (BOHEMIA_HD_TILE_REPO_part1-4); 'b64' = ready pixels (quilt/
period). paolo_overrides beat scores. PATTERN/RESIST await period solver.
- BOHEMIA_GROUND_SEAMLESS_SET (1,019) | BOHEMIA_WALL_SEAMLESS_SET (303)
- BOHEMIA_WATER_SEAMLESS_SET (45) | BOHEMIA_PATH_SEAMLESS_SET v2 (92, N-S)
- BOHEMIA_BRIDGE_SET (203, direction per tile, 59 run-ready, deck_crop)
- BOHEMIA_ROOF_SEAMLESS_SET (47)

## 3. UPGRADES (alpha improves itself)
- `BOHEMIA_ALPHA_SURFACE_UPGRADES_7_10_26.txt` — 486 fingerprint-matched
  drop-in seamless swaps (331 surfaces + 155 walls). Apply on load; judging
  menu shows swap badges; Paolo vetoes per tile.
- `BOHEMIA_ALPHA_CORRECTIONS_LEARNED_7_10_26.txt` — 591 AUTO category moves +
  2,947 SUGGEST, learned from Paolo's 90 audit verdicts.
- `BOHEMIA_MISC_SPLIT_PROPOSAL_7_10_26.txt` — 2,845 misc assignments (judging
  finalizes).

## 4. NEW LAYERS (render order: ground -> overlay -> entities/props -> standing)
- `BOHEMIA_OVERLAY_BANK_7_10_26.txt` — 174, PAOLO-VALIDATED 12/12. Walkable,
  draw-after-ground, alpha-composite.
- `BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt` — 24, validated. Combat paints these
  under bodies. Red legal, purple never.
- `BOHEMIA_STANDING_SET_7_10_26.txt` — 575 (+display_footprint, WALL-MOUNTED
  placement, seasonal parking flags).
- `BOHEMIA_WINDOW_SET_7_10_26.txt` — 83, WALL-MOUNTED class, composite onto
  wall cells.
- `BOHEMIA_DOOR_EW_BANK_7_10_26.txt` — 184 E/W edge candidates (7px ref).
- `BOHEMIA_ITEM_CATEGORY_PROPOSAL_7_10_26.txt` — 253 loot candidates
  (suggest-only; feeds useless-pickups).

## 5. VARIANT BANKS (post-verdict volume; sample-calibrated by mega verdicts)
- BOHEMIA_GROUND_VARIANT_BANK (1,211) | BOHEMIA_WALL_VARIANT_BANK (438)
- V-verdicts from mega-1 calibrate kinds: clean/tone/shift trusted, dirty
  mixed (2 downs) — dirty variants surface for judging before use.

## 6. QUARANTINES / PARKED
- ATLANTIS pack-level suggest (112, 3 packs) | seasonal tiles | PATTERN pools
  (204 grounds + 57 walls) await the period solver (bug logged).

## 7. LAWS SHIPPED THIS SESSION (addenda -> project at wrap)
Purple Reservation | NeuroLink Reveal | Universal Reveal System | Art Laws
batch (blur/damage-tags/water-context/door-rarity/hatch-glow) | No-Transform |
Seam Philosophy + validated pipeline | Game-First | Modern Sewer Canon |
Learned Rules (fence/path/plants/items/bridges/Atlantis/footprints/wall-
mounted/no-seasons) | Reference-Grid Pipeline | Lighting research + validated
model | Shadows concepts + tech research | Verticality (pending calls)


==============================================================================
### FILE: BOHEMIA_MISC_SPLIT_INTEGRATION_7_10_26.md
### MD5: 82f8aa0d42a20c93fd6d31e07530beab  |  1.7 KB
==============================================================================

# BOHEMIA — MISC PILE SPLIT PROPOSAL INTEGRATION (7/10/26)

## What this is
The named outstanding graphics job (START HERE doc): the alpha's 2,845-tile
'misc' category, every tile now has a PROPOSED real category. Method: each misc
tile matched by visual features against prototypes built from the 23 real
categories already in TP_TILES. Zero tiles below 0.5 confidence.

## File
`BOHEMIA_MISC_SPLIT_PROPOSAL_7_10_26.txt` — JSON:
`assignments: {miscIdx: [proposedCategory, confidence]}` + counts.

## HOW THE CODE ACCEPTS IT
1. The alpha's tile block is `TP_TILES` (24 categories incl. misc) + `TP_TYPE`
   inside the CITY module. The proposal maps misc INDEX -> target category.
2. Apply pattern (alpha-owning session): on load, read the proposal file; for
   each accepted assignment, move `TP_TILES.misc[idx]` into
   `TP_TILES[target]` and record the move so saves/judging stay consistent.
3. JUDGING FLOW (Paolo's law: he overrides): surface the proposal in the tile
   judging menu as a pre-filled suggestion per misc tile — accept-all per
   category, or per-tile override. NOTHING moves without his verdict export.
4. Sort judging by ascending confidence so Paolo's eye hits the shakiest
   guesses first.

## Proposed distribution (2,845 total)
sign 260, furniture 250, container 191, industrial 179, light 164, monument 160,
door 156, trash 155, fence 138, roof 128, window 126, weapon 124, rubble 124,
foliage 106, wall 106, gore 97, vehicle 87, concrete 77, street 60, grass 46,
dirt 45, burnt 39, hazard 27.

## LAW COMPLIANCE
- One-alpha law: this chat ships the DATA; the alpha-owning session applies it.
- Paolo's judging is the only authority that finalizes any move.


==============================================================================
### FILE: BOHEMIA_RENDER_CONTRACT_7_10_26.md
### MD5: 482fa33c4e74e3b5a9b79c66c8438941  |  2.0 KB
==============================================================================

# BOHEMIA — RENDER CONTRACT v1 (7/10/26)
The one renderer every zone uses. Demo tunnel = first consumer. Engine-first:
nothing below is demo-specific.

## Layer order (bottom -> top), per visible cell
1. GROUND — from seamless sets (b64 or crop-window rebuild). Variants rotate
   by cell hash (deterministic; fold determinism law).
2. GROUND TRANSITIONS — dual-grid: display grid offset half-cell; each display
   tile samples its 4 corner cells' terrain; if mixed, draw transition piece
   for that corner combo (harvest file below). ~5 pieces per terrain PAIR.
3. OVERLAYS — foliage/rubble/stains/gore (validated banks). Walkable,
   alpha-composited, wrap-aware variants legal.
4. PROPS/STANDING — multicell true-res; draw by depth (feet-row sort);
   occlude entities per DEPTH LAW; display_footprint honored; WALL-MOUNTED
   composites onto wall cells; cover props expose coverState to combat.
5. DOORS — 2x1/2x2 in wall lines (DOOR FOOTPRINT LAW); junction treatment =
   flush placeholder until Paolo picks.
6. ENTITIES — rig-rendered characters (120 BPM stepper), gore paints under
   bodies on death.
7. FX — beat-quantized clips (strips bank PARKED until validated; slot exists).
8. LIGHTING — validated Minecraft-model (16 levels, flood-fill, max-not-sum,
   sky+block channels); falloff curve [PENDING Paolo]; corner-averaged
   lightmap quad per Terraria research.

## Data contracts (all shipped, all gated)
ground: BOHEMIA_GROUND/WALL/WATER/PATH/ROOF_SEAMLESS_SET (tier filter S/A +
paolo_overrides) | variants: GROUND/WALL/DIRECTIONAL_VARIANT_BANK | overlays:
OVERLAY_BANK + GORE_OVERLAY_BANK | props: MULTICELL_SET (spawn law: usable OR
unflagged-allowed; NEVER-SEE/quarantines/NIGHTMARE-ONLY/UNSCHEDULED never) +
DEMO_PROP_POOL | doors: bake v12 tiles_multicell | standings: STANDING_SET |
windows: WINDOW_SET | transitions: TRANSITION_SET (this session).

## Spawn/purity invariants
Purity gate before any bake reaches screen. Purple law demo-scoped. Volcano
never. Content states enforced at spawn-table build, not at draw.


==============================================================================
### FILE: BOHEMIA_SESSION_MANIFEST_7_14_26.md
### MD5: 33d7eadd481f10d37d36d2a0b4f95fd6  |  17.1 KB
==============================================================================

# BOHEMIA GRAPHICS SESSION MANIFEST (7/10-7/14/26)

Every file this session shipped, md5-stamped. The ledger (BOHEMIA_GRAPHICS_SESSION_LEDGER_7_10_26.md) tells the story; this is the index.

- `BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt` | 307KB | b827d48f4ab584caa67166c7adae6a7f
- `BOHEMIA_ACT1_GAP_QUEUES_7_13_26.txt` | 5KB | 56b6ef3f80014a45f7a28287c4eb65bd
- `BOHEMIA_ACT1_GREAT_SWEEP_7_10_26.html` | 15706KB | 60ade19dd2fbb2a0b30cdb3213551982
- `BOHEMIA_ACT1_LIGHT_SOURCES_7_13_26.txt` | 14KB | fcbc44becd7d7a4697c6a77f9f409083
- `BOHEMIA_ACT1_REQUIREMENTS_MATRIX_7_13_26.txt` | 456KB | fd7d5fe069ff7fa1ce368f593fb20d38
- `BOHEMIA_ACT1_SWEEP_VERDICTS_MASTER.txt` | 82KB | 6f19e1344307806b08c5e6939d66bf52
- `BOHEMIA_ACT1_VISION_AUDIT_7_13_26.txt` | 68KB | a44af15061984edadb9e451afcaba7e8
- `BOHEMIA_ACT_PLACEMENT_MASTER_7_10_26.txt` | 18KB | a2abc0f6fffd666d1fea97b081a0d089
- `BOHEMIA_ADDENDUM_ACT1_COMPLETION_PIPELINE_7_13_26.md` | 3KB | e572a540eec51766ce1710faa33d6c8a
- `BOHEMIA_ADDENDUM_ACT_TEXTURE_PROGRESSION_7_10_26.md` | 2KB | 671e0bf54138b767de9b6c13bbaa947d
- `BOHEMIA_ADDENDUM_ALPHA_ABSORPTION_PLAN_7_14_26.md` | 2KB | 0ae770af05b03da1b1e382c77a952015
- `BOHEMIA_ADDENDUM_ANIMATION_PIXEL_LAW_7_13_26.md` | 0KB | 29b7c7316c3c636b71cd054ab766e07a
- `BOHEMIA_ADDENDUM_ART_LAWS_VERDICT_BATCH_7_10_26.md` | 3KB | b1ae2be2341e972f94ce188693447f5c
- `BOHEMIA_ADDENDUM_BEYOND_SIDEWALK_RESEARCH_7_14_26.md` | 2KB | 02ebc44f208c2df86c692d4f80c60f52
- `BOHEMIA_ADDENDUM_BLOCK_CANON_7_13_26.md` | 1KB | 1ed1c6683df28d390b9492a03e67065b
- `BOHEMIA_ADDENDUM_CELL_IS_PLOT_WALLED_SUBURBS_7_14_26.md` | 1KB | 2eee39521a67bc1f8c2aa6e62d5b7e96
- `BOHEMIA_ADDENDUM_CURRENCY_LOGOS_IDEA_7_13_26.md` | 0KB | 75ed15020865814243adb4cde9ae485b
- `BOHEMIA_ADDENDUM_DISTRICT_MERGE_LAW_7_14_26.md` | 1KB | b04c3d2ec2008508135356f3f90be215
- `BOHEMIA_ADDENDUM_DUAL_SCALE_PRECEDENTS_7_14_26.md` | 1KB | 18ddad6bbd624e293a7d0a0a5f05aa00
- `BOHEMIA_ADDENDUM_GAME_FIRST_LAW_7_10_26.md` | 1KB | febbc766f3ae2f47aecbc5383ce4a02a
- `BOHEMIA_ADDENDUM_ITEM_SCALE_LAW_7_13_26.md` | 1KB | aefb5e92c5870fbaacf92e212d664a4c
- `BOHEMIA_ADDENDUM_LEARNED_RULES_7_10_26.md` | 2KB | ee60b3cc1692c20b341737646b6d9d76
- `BOHEMIA_ADDENDUM_LIGHTING_RESEARCH_7_10_26.md` | 2KB | b5fd41d40159be44b7832f278e7ddaf3
- `BOHEMIA_ADDENDUM_LIGHT_PHILOSOPHY_7_14_26.md` | 0KB | 0f6008bc58fc210487e8bca693b2bffc
- `BOHEMIA_ADDENDUM_LINE_COLOR_LAW_7_13_26.md` | 1KB | 83f85b9edd9dd6388710ce08b1ae854f
- `BOHEMIA_ADDENDUM_NEIGHBORHOOD_READINESS_7_13_26.md` | 2KB | 9fd4911a500ea3c79ed003eb2a3b1ba9
- `BOHEMIA_ADDENDUM_NEUROLINK_REVEAL_7_10_26.md` | 1KB | 047fe9f58ee42c0d2fb6c2ac35d51b8f
- `BOHEMIA_ADDENDUM_NIGHTMARE_CONTENT_IDEA_7_10_26.md` | 0KB | 0626bffdad94deac02ce183a775ff5e3
- `BOHEMIA_ADDENDUM_PIXEL_WORKFLOW_RESEARCH_7_10_26.md` | 7KB | 929b8cab39fd541d7ed1114655b951ab
- `BOHEMIA_ADDENDUM_PURPLE_RESERVATION_LAW_7_10_26.md` | 1KB | d70c3bc402544ebb2a0f8c3c46fe1f5b
- `BOHEMIA_ADDENDUM_REFERENCE_GRID_PIPELINE_7_10_26.md` | 1KB | fc11715b62011d3225e6c28ce265f5dc
- `BOHEMIA_ADDENDUM_SEWER_DEMO_HOMELESS_7_10_26.md` | 3KB | 6ad96b1df98e02033f8431f40ec7ab90
- `BOHEMIA_ADDENDUM_SHADOWS_CONCEPTS_7_10_26.md` | 1KB | 552eaa744c9015f475b66e832ac1c1a0
- `BOHEMIA_ADDENDUM_SHADOW_TECH_RESEARCH_7_10_26.md` | 2KB | 5ad5f0e12cbc4f49c6dd515ee9a72135
- `BOHEMIA_ADDENDUM_SIDEWALK_SANCTITY_7_14_26.md` | 1KB | 3d875dc0cb004cf768067eb250328fa4
- `BOHEMIA_ADDENDUM_STREET_CANON_7_13_26.md` | 1KB | c63646c258e27e583540a65b50d95dc0
- `BOHEMIA_ADDENDUM_STREET_COMPOSITION_LAWS_7_14_26.md` | 3KB | c8e0116169ecf17dc4c4f67493783abb
- `BOHEMIA_ADDENDUM_TILE_PIPELINE_SEAMS_VARIANTS_7_10_26.md` | 1KB | f957f0a0307d18dd4bc92acf8b0dae4b
- `BOHEMIA_ADDENDUM_UNIVERSAL_REVEAL_SYSTEM_7_10_26.md` | 1KB | d5c28e54670e39e51e930c7c013e9648
- `BOHEMIA_ADDENDUM_VEGAS_LANE_RESEARCH_7_14_26.md` | 2KB | db9734cdf595f2836d2b2bcc15a514c1
- `BOHEMIA_ADDENDUM_VEGAS_NEIGHBORHOOD_ANATOMY_7_14_26.md` | 2KB | 86a495189e6246ec01eee4860555f4f0
- `BOHEMIA_ADDENDUM_VEGAS_STREET_ANATOMY_7_13_26.md` | 0KB | 90c56a700ab98636e9c4d25c3349fdd0
- `BOHEMIA_ADDENDUM_VERTICALITY_STAIRS_7_10_26.md` | 1KB | 869ce3c4626342ea5089cfd6181e14df
- `BOHEMIA_ADDENDUM_WORLD_CLOCK_WALK_LAW_7_14_26.md` | 2KB | 66e3deb7cc19fc65d10319564837a59a
- `BOHEMIA_AGENT_LOOK_7_10_26.js` | 0KB | 67ecad76e8c774512170fdb30eadc1c3
- `BOHEMIA_AGENT_RAGS_7_10_26.js` | 1KB | 07b1bf471506855d187454a53df540e9
- `BOHEMIA_AGENT_RAGS_SHEET.png` | 89KB | 718b7fefa7d693bb06f878dbb858750c
- `BOHEMIA_AGENT_REVEAL_INTEGRATION_7_10_26.md` | 3KB | 5970029821c47e6ccfba0dce9aed3e3e
- `BOHEMIA_AGENT_REVEAL_PREVIEW.png` | 100KB | d048302abae3316be55040bae661250a
- `BOHEMIA_ALPHA_CORRECTIONS_LEARNED_7_10_26.txt` | 394KB | a7f9e3a51ebe91cd6f2126288c43da5c
- `BOHEMIA_ALPHA_PURITY_AUDIT_7_10_26.txt` | 365KB | 7a6658d94cf236b10e5de88e8bbb6509
- `BOHEMIA_ALPHA_SURFACE_UPGRADES_7_10_26.txt` | 1027KB | 837f17b82217c31a60616dbf312f039f
- `BOHEMIA_ATLANTIS_QUARANTINE_7_10_26.txt` | 10KB | f42c66295a5a4cb218d4d6a36d7472c7
- `BOHEMIA_BAKE_V8_GALLERY_7_10_26.html` | 362KB | ff496484e92c9027080f53790720fb5a
- `BOHEMIA_BLOCKGEN_RENDER_PROOF_7_14_26.html` | 1993KB | c56f47b568d342fbcec15ef0bae838b8
- `BOHEMIA_BRIDGE_SET_7_10_26.txt` | 415KB | 0a02bba8614a261648e7faba2152f1e3
- `BOHEMIA_CATEGORY_AUDIT_TOOL_7_10_26.html` | 256KB | c0a82ff7255b7e47c1237533a70c5ea4
- `BOHEMIA_CLUSTER_NAMING_7_10_26.html` | 1467KB | 5f7946cd45b125936a7d05a2de663521
- `BOHEMIA_COVER_INTEGRATION_7_10_26.md` | 1KB | 8565e9347d5bd7ab2ff6d4e1d883b25c
- `BOHEMIA_DEMO_BAKE_INTEGRATION_7_10_26.md` | 4KB | 3c4048df12ffa29297d00612122e16f4
- `BOHEMIA_DEMO_BAKE_SHEET.png` | 130KB | 6b8a23db0ac8ca0a651d4f9a4f058674
- `BOHEMIA_DEMO_FLOW_7_10_26.md` | 3KB | f3b2453c78455d0ae14afe89cce1feb5
- `BOHEMIA_DEMO_PROP_POOL_7_10_26.txt` | 3884KB | 6d9d07b4bf2325f717eee9eb57a0141f
- `BOHEMIA_DEMO_ROOM_TILESET_7_10_26.txt` | 1KB | cbff604a0aaac4e572e33d161854e249
- `BOHEMIA_DEMO_ROOM_preview.png` | 135KB | a4983921d2c1e0755398e92d5269b0f1
- `BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt` | 182KB | e94a24489fcd4489f9f55380f933c358
- `BOHEMIA_DEMO_TILE_SOURCES_7_10_26.txt` | 2KB | edb7bc856a377fd30e1581473c28e224
- `BOHEMIA_DEMO_VERDICTS_7_10_26.txt` | 27KB | 2bff22f78673d93552c5ab0ed9a8637c
- `BOHEMIA_DIRECTIONAL_VARIANT_BANK_7_10_26.txt` | 967KB | 81f6442ab25497b14a8f525510ff7e90
- `BOHEMIA_DOORS_SEAMS_TOOL_7_10_26.html` | 428KB | ceccf2c99ead374e7c649f3c263e18e9
- `BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt` | 11952KB | cb73f97aa8365077a5c437f9afafdc4d
- `BOHEMIA_DOOR_ANIM_INTEGRATION_7_13_26.md` | 0KB | af4c2a5050dd19ae3f005251c51af491
- `BOHEMIA_DOOR_ANIM_PROOF_7_13_26.html` | 6614KB | 5aa49b79030fe7775a5b973c7c33ff07
- `BOHEMIA_DOOR_EW_BANK_7_10_26.txt` | 536KB | 87826ddb7ff8be1000c40ec97eeccf56
- `BOHEMIA_DOOR_JUNCTION_LAB_7_10_26.html` | 756KB | 20df9eaf7fba71835afffcb7dbc384be
- `BOHEMIA_EW_DOOR_TOOL_7_10_26.html` | 120KB | 789041bda6a114a3eb42f6e5cb4d466f
- `BOHEMIA_FAMILY_CONSUMER_RULES_7_10_26.md` | 1KB | f993f0ca6e56fd26e33c27f5adb540c7
- `BOHEMIA_FAMILY_SORT_TRAINING_7_10_26.html` | 603KB | f9b961fadcfd8ba01d1d92ec33da2177
- `BOHEMIA_FIRE_FLICKER_BANK_7_13_26.txt` | 9346KB | 0185eeaf432e5e082554c962300ca5c6
- `BOHEMIA_FIRE_FLICKER_PROOF_7_13_26.html` | 2150KB | d2f9f375a2aff2d4d8898d4724bf2404
- `BOHEMIA_FULL_LIBRARY_ACT_SWEEP_7_10_26.html` | 1709KB | 6cdce42305901575ee9c994e0d356474
- `BOHEMIA_FX_STRIPS_7_10_26.txt` | 2KB | 0eef264fdc1e51f410dae8986ea66bcb
- `BOHEMIA_GORE_OVERLAY_BANK_7_10_26.txt` | 152KB | ee866715b4624d91832243d742a2144f
- `BOHEMIA_GRAPHICS_SESSION_LEDGER_7_10_26.md` | 30KB | b71c50576ca0b7ab2249a5add2097fd0
- `BOHEMIA_GROUND_MASTER_SET_7_10_26.txt` | 224KB | 93322a688d5fd1644a97b1555cfb4b43
- `BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt` | 2901KB | 5a833bc9777da6d315c4fbbc859ad569
- `BOHEMIA_GROUND_SPOTCHECK_R3_7_10_26.html` | 250KB | 532837538c6845d16a37f6a0d2b2cd7b
- `BOHEMIA_GROUND_SPOTCHECK_TOOL_7_10_26.html` | 324KB | 9725be0a3e32bbded02bc19f7c77dba6
- `BOHEMIA_GROUND_VARIANT_BANK_7_10_26.txt` | 7279KB | fc14b9d054fc988836e3be17a9bdd0dc
- `BOHEMIA_HATCH_GRATE.png` | 0KB | 3c59128696cf6aa1ec9554ef2ddfc4fe
- `BOHEMIA_HATCH_IRIS.png` | 0KB | ebc0c21b64454edfce652ee28e9c1aee
- `BOHEMIA_HATCH_MANHOLE.png` | 0KB | 3cbe4eba13861b54117182ffee644ebe
- `BOHEMIA_HATCH_VARIANTS.png` | 81KB | 0be221e8bae5e268750ee1c45973cea3
- `BOHEMIA_HATCH_VAULT.png` | 0KB | a828260599c8d7f7d06040ab0413ee1f
- `BOHEMIA_HD_TYPE_SEED_7_10_26.txt` | 209KB | 574bcd2477f9e46cb6fb9597182a2872
- `BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt` | 2569KB | a455b5506b358fd0ed53c2c34bbb0c06
- `BOHEMIA_HOUSE_FACTORY_GALLERY_7_14_26.html` | 2569KB | b9a6c2c0f391132117a3a44f977faca4
- `BOHEMIA_HOUSE_FACTORY_INTEGRATION_7_14_26.md` | 1KB | dab494622cb7dfbbca3104a08f00aea5
- `BOHEMIA_HOUSE_PART_ROLES_7_14_26.html` | 1077KB | ae38a0e32a779f4ec63a8efd0444efcc
- `BOHEMIA_ITEM_CATEGORY_PROPOSAL_7_10_26.txt` | 26KB | 1f8661fceba5b83b5503903a60613a79
- `BOHEMIA_JUDGING_BOARD_7_10_26.png` | 943KB | 7790c67b295635065ce7a548424e8f56
- `BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt` | 78KB | f3f3a09b6551d23722d1439fd5fbc56f
- `BOHEMIA_LIGHTING_INTEGRATION_7_13_26.md` | 1KB | ab3180cd41992aa528bb16f3e62a4808
- `BOHEMIA_LIGHTING_PLAYGROUND_7_10_26.html` | 23KB | 6f05d0a62715043a402bc7b747b402bf
- `BOHEMIA_LIVE_SLICE_7_14_26.html` | 1274KB | 673f073a5c9476f7455f5091500df357
- `BOHEMIA_LIVE_SLICE_V2_7_14_26.html` | 1447KB | d425d0ea3743d21af7070d65515be76e
- `BOHEMIA_LIVE_SLICE_V3_7_14_26.html` | 4906KB | 8d4f53f3d27c21c05d5a16bd13be998e
- `BOHEMIA_LIVE_SLICE_V4_7_14_26.html` | 4909KB | bdba57f72ab48077aca0981a5370bec1
- `BOHEMIA_LIVE_SLICE_V5_7_14_26.html` | 4913KB | 3cebd7986a62c2a182c61847bf5a48ae
- `BOHEMIA_LIVE_SLICE_V6_7_14_26.html` | 4914KB | b2ada091b7f624c02db27f64827d5c97
- `BOHEMIA_LIVE_SLICE_V7_7_14_26.html` | 4915KB | ebd81dd12d9916bfec42d61b57277114
- `BOHEMIA_LIVE_SLICE_V8_7_14_26.html` | 4962KB | dc8626f4ec88ec27256c8a5d8b4884b6
- `BOHEMIA_MASTER_MERGE_PACKAGE_7_10_26.md` | 3KB | 3ca6071a8445e8016ef2a5ea4e8506c1
- `BOHEMIA_MEGA_JUDGING_2_7_10_26.html` | 740KB | 745610ca08bc72a5d372d8b39c02c3e9
- `BOHEMIA_MEGA_JUDGING_7_10_26.html` | 564KB | 47a018960bbc1ace15d3da51fb6179b6
- `BOHEMIA_MEGA_VERDICTS_BANKED_7_14_26.txt` | 0KB | e2f338a322e653d315de0ff24d5ff0b0
- `BOHEMIA_MEGA_VERDICT_SESSION_7_14_26.html` | 71KB | a3945f2ae54e07b2cec7b9b1fbf755ab
- `BOHEMIA_MISC_PACK_SWEEP_1_7_10_26.html` | 1487KB | c982463d2238c452fc4770e20d050283
- `BOHEMIA_MISC_PACK_SWEEP_2_7_10_26.html` | 1317KB | cbee334cd84542e18d82df421f399cee
- `BOHEMIA_MISC_PACK_SWEEP_3_7_10_26.html` | 1011KB | 1733ebaeb6a2774794df75717ad4e03c
- `BOHEMIA_MISC_PACK_SWEEP_4_7_10_26.html` | 1089KB | 45195e12d67a4d0df3d09d15e9a0dc85
- `BOHEMIA_MISC_PACK_SWEEP_FINAL_7_10_26.html` | 2136KB | 6616464ad614b168e85bddb42a16cabc
- `BOHEMIA_MISC_SPLIT_INTEGRATION_7_10_26.md` | 1KB | 82f8aa0d42a20c93fd6d31e07530beab
- `BOHEMIA_MISC_SPLIT_PROPOSAL_7_10_26.txt` | 72KB | a6a65f845440d8bfbac8a9a313f59a00
- `BOHEMIA_MOUNTED_SIGNS_7_13_26.txt` | 98KB | ce945af624770467c98d39b5c3aceb18
- `BOHEMIA_MOUNTED_SIGNS_PROOF_7_13_26.html` | 102KB | 036e9b6498076142c751199be98302e1
- `BOHEMIA_MULTICELL_SET_7_10_26.txt` | 548KB | 8a71661f33862441285d96200d155ca8
- `BOHEMIA_MULTICELL_TRAINING_7_10_26.html` | 517KB | f8bef820c00a3b9b753753df35ee1e0f
- `BOHEMIA_NIGHT_BLOCKS_PROOF_7_14_26.html` | 1201KB | affef8df296d836d67917e0d6a9b0673
- `BOHEMIA_OVERLAY_BANK_7_10_26.txt` | 1091KB | 388a5629d27e85cc4b76fb4b11b443da
- `BOHEMIA_PATH_SEAMLESS_SET_7_10_26.txt` | 352KB | abe5272a452aa7e1087018f80029eff0
- `BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt` | 112KB | 6793a5a191a0e7487e6805afc6001bfe
- `BOHEMIA_PIPELINE_STATUS_7_14_26.html` | 3KB | 85e9f503fa3d39378f3b6d0d2c56259c
- `BOHEMIA_PREFAB_KITS_TOOL_7_10_26.html` | 149KB | 45ab5cc626caf1445e8323c5dfbeb444
- `BOHEMIA_REAL_VEGAS_BLOCKS_7_14_26.html` | 3109KB | d2e0d790a87db7d06fd00d5282e314ee
- `BOHEMIA_REAL_VEGAS_VERDICTS_7_14_26.txt` | 0KB | b0c37025eb5a5d18eaf0fc8e4e96e7c1
- `BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt` | 0KB | ccae37585a69da428840c39ebabe693e
- `BOHEMIA_RENDER_CONTRACT_7_10_26.md` | 2KB | 482fa33c4e74e3b5a9b79c66c8438941
- `BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt` | 201KB | cc69b4b2a9a9d893f61c12d107c4e9b5
- `BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt` | 159KB | d96aac17ab445f433a2296f94b3592c2
- `BOHEMIA_SEAMLESS_PROOF_GALLERY_7_10_26.html` | 312KB | 3e2e442d27cff60136074aa816dd658d
- `BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt` | 3424KB | 08014edd82a81b48be89a141acccbbe5
- `BOHEMIA_SEAM_FIX_PROOF_7_14_26.html` | 421KB | 14c0e2af9ca963406ef20ff802700c76
- `BOHEMIA_SEAM_FIX_PROTOTYPES.png` | 27KB | f868df6dd19f526c1c8d6895922d008c
- `BOHEMIA_SEAM_QUILT_TOOL_7_10_26.html` | 200KB | a28ffcf935476bba53a7d8b24d2c09ac
- `BOHEMIA_SEAM_R3_TOOL_7_10_26.html` | 80KB | 7878fb207ddccba8f60edbe9063c49af
- `BOHEMIA_SEAM_SCHOOL_R2_TOOL_7_10_26.html` | 137KB | b2996b40bd8776f589d050bd94db017e
- `BOHEMIA_SEAM_SCHOOL_TOOL_7_10_26.html` | 310KB | 0fae8461c9a1d6726579b4537d2c44e0
- `BOHEMIA_SESSION_SHOWCASE_7_10_26.html` | 711KB | e67f52fc8201d028e908409f174cc823
- `BOHEMIA_SEWER_DEMO_MAP.png` | 121KB | a6423b82e32e85f71c316472f686d28d
- `BOHEMIA_SEWER_DEMO_MAP_DATA_7_10_26.json` | 8KB | 72500a3859b6cf031c214f5d3aa77ce4
- `BOHEMIA_SEWER_DEMO_MAP_SPEC_7_10_26.txt` | 2KB | 4ca3d642266e53930b4934d8f1848096
- `BOHEMIA_SFX_HOOK_MANIFEST_7_13_26.txt` | 1KB | 58e58c2ecf25635531951f460a47819d
- `BOHEMIA_SFX_HOOK_MANIFEST_7_14_26.txt` | 8KB | e5e98f73221c24f2f84d63b35b0babaa
- `BOHEMIA_SIDEDOORS_SEAMV2_TOOL_7_10_26.html` | 465KB | 2801385d0a2a0a50f471d8b36fcb342b
- `BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js` | 0KB | bb9305a02134ff2de975ede6e85b782c
- `BOHEMIA_SKIN_REGRADE_INTEGRATION_7_10_26.md` | 2KB | 45974c5eae68c2e09c9e60c21b3a3c66
- `BOHEMIA_SKIN_REGRADE_PREVIEW.png` | 535KB | ea116dc3b461e59e32733d01e3feea60
- `BOHEMIA_STANDING_SET_7_10_26.txt` | 74KB | 37d80a809124d8816e1cb919c880a08c
- `BOHEMIA_STREET_ANATOMY_POOL_7_13_26.txt` | 90KB | 44b58fdf0ce1138ef2aabe7be00ae915
- `BOHEMIA_STREET_GEN_GALLERY_7_13_26.html` | 1272KB | bc49fbcbcf5cfb64c22e1506cf6d4b84
- `BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt` | 467KB | fb497f832d93b24fa8d59ea696af82cf
- `BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt.law` | 0KB | d41d8cd98f00b204e9800998ecf8427e
- `BOHEMIA_STREET_RECIPE_SPEC_7_13_26.md` | 1KB | 0166a6942a6660d2b409d18b4593c1ef
- `BOHEMIA_STREET_TILE_ROLES_7_13_26.html` | 1264KB | 0317ae9f500342ac24255528cb033a6c
- `BOHEMIA_STREET_TUNER_7_13_26.html` | 957KB | 4ad325fc2fa67a57ab557bf778b99eee
- `BOHEMIA_TAN_WALL_PROOF_7_14_26.html` | 1393KB | af280b8a89c7c1a1cd1a4d05fd1b56d4
- `BOHEMIA_TERRAIN_PICKER_7_14_26.html` | 886KB | 35c85679670bfafc437d0355ae196a84
- `BOHEMIA_TERRAIN_PICKS_7_14_26.txt` | 1KB | f324895d141dd3535a6cee93c412f862
- `BOHEMIA_TILECAT_BROWN_7_10_26.txt` | 29KB | ea1c5cc27210838d0ab4c2f5a51b4fe8
- `BOHEMIA_TILECAT_BROWN_sample.png` | 644KB | 652ba46b27fa0f30de1d482928a921f8
- `BOHEMIA_TILECAT_COOL_7_10_26.txt` | 8KB | b632abeb17e127c69b2cf739c9b11b7f
- `BOHEMIA_TILECAT_GOLD_7_10_26.txt` | 12KB | 3848c49c414342e5cfe624a3919b93d8
- `BOHEMIA_TILECAT_GREEN_7_10_26.txt` | 4KB | d4c2494f2eabcf49adaa0e290dd0e3e1
- `BOHEMIA_TILECAT_MASTER_7_10_26.txt` | 0KB | b4a16d521d29d198cb49e48aa51307b9
- `BOHEMIA_TILECAT_NEUTRAL_7_10_26.txt` | 14KB | e4331b47ab5d537656d7efc033ef88db
- `BOHEMIA_TILECAT_NEUTRAL_sheet.png` | 1843KB | 40a6b8562fada074af0f6793f25317ee
- `BOHEMIA_TILECAT_REDMAG_7_10_26.txt` | 6KB | 774ecff7de5b534c487cc60e1491f749
- `BOHEMIA_TRANSITIONS_PROOF_7_10_26.html` | 51KB | 5fdbbbf05ddf8052ce1b641c94578626
- `BOHEMIA_TRANSITION_SET_7_10_26.txt` | 73KB | 587737c1a5b73a559c4bab59899249d0
- `BOHEMIA_VARIANTS_B2_TOOL_7_10_26.html` | 496KB | 6caebe05179a84c7380799fb1cd4be53
- `BOHEMIA_VARIANTS_BATCH1_TOOL_7_10_26.html` | 460KB | 5f6ef26f6f58dd29a08244d6c4ddc143
- `BOHEMIA_VERDICT_RECORD_7_10_26.md` | 2KB | 30ffef07ffa3753610948e6d20cf2f14
- `BOHEMIA_VERDICT_SESSION_FX_ACT3_PURPLE_7_10_26.html` | 1263KB | b75a5de523910128962726ef8c19d3e1
- `BOHEMIA_VERDICT_TOOL_7_10_26.html` | 1189KB | 5b4999a5278acc0e22713a0e5c97e0c7
- `BOHEMIA_WALLMOUNT_PROOF_7_10_26.html` | 238KB | 393efac223b5c1989a48ca14e476a87e
- `BOHEMIA_WALL_PICKER_7_14_26.html` | 953KB | a000cf0f71161c385b2cced4ccd2fa96
- `BOHEMIA_WALL_PICKS_7_14_26.txt` | 1KB | 9423962dbc6d2dfc362d5335843c2f0f
- `BOHEMIA_WALL_PROOF_GALLERY_7_10_26.html` | 171KB | 86a491e445f89c578291eebacc6400dc
- `BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt` | 607KB | 005c6ff84d7ed3a8572a71784c064792
- `BOHEMIA_WALL_VARIANT_BANK_7_10_26.txt` | 2538KB | a1dddaeef5296ca386c814c17c69bf31
- `BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt` | 267KB | 1673d82154528633502fde15916488fb
- `BOHEMIA_WINDOW_SET_7_10_26.txt` | 12KB | e6bfa66baa5d65ee67cc3b27133440ca
- `bohemia_blockgen.js` | 9KB | 7026302e8ea2a416f8d11fc735b98dcf
- `bohemia_daycycle.js` | 1KB | d3ca07d6a97cfa2cb156a8eb4dad2f08
- `bohemia_engine_graphics_7_14_26.js` | 31KB | 7a60719aeb20994b3dbb4b0dde9e582c
- `bohemia_graphics_tests.js` | 5KB | f4a93b9fd6d32b0916a8480f47ee9849
- `bohemia_light_pass.js` | 2KB | 3a5d9c4c7f3320ee1f9b63b33a6e3eb0
- `bohemia_overmap_bridge.js` | 4KB | fbce34f5306cf45822ea95e89041f686
- `bohemia_plotgen.js` | 9KB | d39144c35e70195fed5c9d70340ba4f8
- `bohemia_prop_scale.js` | 1KB | 271e875a013a0cc6d56802a13edfa6bf
- `bohemia_purity_gate.py` | 1KB | 69f449c129dd89e35904be8bb819a6c7
- `bohemia_slice_core.js` | 4KB | f6747e07e09da60457e910f9c8084043
- `bohemia_transitions.js` | 1KB | 8495bdba6ba084a66bc0d5904b9e1cf3

==============================================================================
### FILE: BOHEMIA_SKIN_REGRADE_INTEGRATION_7_10_26.md
### MD5: 45974c5eae68c2e09c9e60c21b3a3c66  |  2.5 KB
==============================================================================

# BOHEMIA — SKIN REGRADE INTEGRATION (7/10/26)

## What this is
World-graded skin palettes so the player character and NPCs sit in the demo
world's light instead of glowing museum-clean. Graded MATHEMATICALLY against the
measured ambient of the actual wash/sewer demo tiles (ambient RGB ~(67,61,57),
world saturation ~0.23). Not a guess.

## The grade (method, reproducible)
For each of the 9 existing SKIN_TONES ramps, each shade:
1. desaturate 30% (world sat is low, clean skin pops unnaturally)
2. darken to 82% value (drop into the world's value range, still reads vs ground)
3. pull 10% toward world ambient (the dust tint everything in Vegas shares)
Homeless variant: 45% desat, 70% value, 22% ambient pull (dirt-caked).

## HOW THE CODE ACCEPTS IT (friction-free)
File shipped: `BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js`
1. **SKIN_TONES_WORLD** is a drop-in replacement for the existing `SKIN_TONES`
   array in the alpha. IDENTICAL structure: `[name,[[r,g,b]x3]]`, same 9 names,
   same order. Swap the array literal, nothing else changes.
2. `skinRampFor()` needs NO edit — it reads `skinTone[1]` and builds
   `[[outline], dark, mid, light, light, mid]` exactly as before.
3. Existing saves keep working: `look.skinToneName` matches by NAME and all 9
   names are unchanged.
4. ~~SKIN_TONES_HOMELESS~~ **DEAD (7/10 verdict, graveyard is final).** Agents use SKIN_TONES_WORLD;
   the rags carry the read, not the skin.
   no branch, no second tone array — the RAGS carry the homeless read.
5. **CYBER_TELL** (PROPOSAL, not locked): two RGBs for subdermal magenta accents,
   pulled from the AMALGAM art direction. If Paolo approves the direction, they
   apply as 2-3 single-pixel accents (temple/chest/forearm) on the homeless
   sprite AFTER the ramp paint — cosmetic layer, no rig/region touch.

## LAWS HONORED
- Region geometry untouched. This is COLOR data only — ramps the existing
  skinColorLayer paints with. No mesh, no regions, no reshape.
- Old SKIN_TONES stays recoverable (it's in this doc's git-of-record below).

## Old values (recovery record)
pale[233,210,192] fair[245,222,202] olive[230,196,162] tan[224,182,142]
bronze[198,152,114] brown[162,118,86] deep[112,80,58] ebony[86,60,44] onyx[64,44,34]
(light shade shown; full old array lives verbatim in the alpha until swapped)

## PENDING PAOLO
- Approve/reject the world-graded ramps (preview: BOHEMIA_SKIN_REGRADE_PREVIEW.png)
- Approve/reject/redirect the magenta subdermal tell (it's a stab, your call)
- Homeless clothing/rags palette (not built — waiting on your direction)


==============================================================================
### FILE: BOHEMIA_STREET_RECIPE_SPEC_7_13_26.md
### MD5: 0166a6942a6660d2b409d18b4593c1ef  |  1.6 KB
==============================================================================

# BOHEMIA — STREET BLOCK RECIPE v1 (spec, 7/13/26)
The priority block recipe (most blocks are streets — Block Canon). Plumbing
spec only; every knob is data, every aesthetic default is Paolo's to set.

## Recipe layers (consumes render contract + act placement + confirmed set)
1. BED: street/asphalt grounds from act-pool (act1 confirmed cracked street/
   concrete), gutters via transitions to sidewalk concrete.
2. ROADWAY FEATURES: manhole covers (Paolo-identified), grenade scorch,
   crack overlays, gore layer where history says so.
3. FLANKS: building facades (wall runs + windows WALL-MOUNTED + doors per
   footprint law) OR fence runs OR open lots (yard materials).
4. STREET FURNITURE: signs (warning/freeway classes), street lamps
   (emitters), fire barrels (emit+loop), wrecked cars (2x3, cover), crates,
   barricade cover lines.
5. LIFE LAYER: camps/tents, item piles (useless pickups law), remains
   (usable subset), trash (all-usable pack).
6. ENTRANCES: sewer manholes/hatch cells, underpass mouths, block exits.

## Density knobs (data, defaults pending Paolo)
props_per_cell_pct, cover_line_freq, camp_freq, wreck_freq, emitter_spacing
(darkness rhythm!), loot_density (ties survival accounting).

## Special street types (same recipe, different knob presets + pools)
FREEWAY (wide bed, freeway signs, wreck density high), UNDERPASS (dark,
emitters sparse, camp density high — canon homeless system), WASH (channel
bed, water transitions, tunnel mouths).

## Gate
Generator output galleries -> Paolo verdicts -> knob tuning. Map Law intact:
recipes generate, Paolo judges and tunes, Claude never hand-places a canon map.


==============================================================================
### FILE: BOHEMIA_VERDICT_RECORD_7_10_26.md
### MD5: 30ffef07ffa3753610948e6d20cf2f14  |  2.2 KB
==============================================================================

# BOHEMIA — VERDICT RECORD (7/10/26) — PAOLO'S VERDICTS PROCESSED

 1. World-graded skins ...... UP + LAW: naked base rig must have BLURRED
    genitalia and nipples. Applies to any undressed render.
 2. Homeless grime skins .... DOWN — DEAD (graveyard). Agents use the world
    skins like everyone; the RAGS carry the homeless read.
 3. Agent purple eyes ....... UP — LOCKED.
 4. NeuroLink reveal v2 ..... DOWN — DEAD as rendered. Reveal VISUAL moves to
    the Universal Reveal System redesign, informed by the fiber-optic glow
    direction (see 6). No third one-off attempt.
 5. Rag outfits x8 .......... UP — LOCKED.
 6. Vault hatch ............. UP + DIRECTION: the purple should read like
    FIBER-OPTIC CABLES with a RADIANT GLOW, texture flowing. Full effect lands
    with the future LIGHTING SYSTEM — hatch is a lighting-system client.
 7. Wash row ................ UP + insight: wash 0-1 read DAMAGED, 2-3 read
    LESS damaged. Tiles get DAMAGE-LEVEL tags so placement can grade wear.
 8. Floor row ............... favorites 5, 1, 4 — pool reweighted, favorites dominate.
 9. Water row ............... favorite 2 + DIRECTION: water needs CONTEXT
    VARIANTS — nicer/cleaner as lake/river, dirtier as sewer-tunnel floor water.
10. Wall row ................ favorites 0, 3, 4 — pool reweighted.
11. Door row ................ both liked + CANON: Vegas tunnels have FEW doors
    (rarity rule). Doors are MULTICELL: 2x2 or 3x2 grid, and need LEFT/RIGHT
    facing variants. Current 1x1 door bake is wrong scale -> re-cut from HD
    masters as multicell with facings.
12. Camp props .............. UP — LOCKED.
13. Purity gate ............. SHRUG — stays (plumbing, serves the laws).
14-18 ....................... N/A — plumbing/data, not art. No thumbs needed.
19. Seam fix ................ UP — direction approved. Approach pick (cross-fade
    vs offset-wrap) lands by eye once applied to approved tiles.

## EXECUTED THIS TURN
- Grime skins + reveal v2 removed from active data (graveyard final)
- Bake reweighted: floor/wall/water favorites lead their pools
- Door re-cut requirement filed (multicell + facings)
- New laws filed: blur law, damage-level tags, water context variants,
  door rarity, hatch fiber-optic lighting note
