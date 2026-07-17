# BOHEMIA ADDENDUM: NEIGHBORHOOD PREFAB FACTORY (7/6/26)
Paolo's directive: big research on how other games filled local maps, then
keep working. Researched, architected, BUILT into the alpha this session.

## THE RESEARCH (grounded)
- CDDA MAPGEN: every building type has a POOL of weighted JSON templates.
  A template = ASCII rows, each char resolved through a symbol PALETTE to
  terrain+furniture. NESTED chunks (1x1 up to full 24x24) stamp variety
  inside parents. One authored _north version auto-rotates 4 ways.
  POST-PROCESS GENERATORS (riot_damage etc) run AFTER generation to bash,
  burn, and bloody the result. Weighted variants make the same "house"
  oter pick a different template every spawn.
- SPELUNKY (1+2): a level = a 4x4 grid of room templates picked from pools
  per room TYPE (path openings), authored as 10x8 text characters with
  tile codes, CHUNKS inside marked for sub-randomization, 50%-chance
  tiles, horizontal flips. Small hand-authored text + pools + chance
  hooks = endless unique levels.
- CONVERGENCE: both masters use SMALL TEXT TEMPLATES + WEIGHTED POOLS +
  RANDOMIZATION HOOKS INSIDE + DERIVED ROTATION/FLIP. This maps one-to-one
  onto the FACTORY LAW (template = the typed spec, generator stamps volume)
  and the VERDICT WORKFLOW (Claude cooks template batches, Paolo thumbs,
  approved -> weighted pool, rejected -> graveyard + post-mortem).
- THE THREE-VERSION HOOK: CDDA's post-process damage pass is the proven
  mechanism for ruin/patched/rebuilt: author each prefab ONCE at rebuilt,
  derive RUIN and PATCHED as deterministic damage passes (knocked walls,
  scorch decals, weed tiles). [PENDING, Paolo: derive vs hand-author the
  three versions per prefab; derive is the factory-law answer.]

## WHAT GOT BUILT (in bohemia_city_unified.html + ALPHA, 11/11 proofs)
- PREFAB FORMAT: {id, weight, rows[]} ASCII. Palette chars:
  '.' lot ground, '#' structure, '%' structure 50% (variation hook),
  'p' paved path/driveway/parking, 'g' green, 't' tree/clutter
  (unwalkable), 'w' water, ',' keep district ground.
- POOLS (starter set, ALL PLACEHOLDER LOOK, art direction = Paolo's):
  suburb (house_yard, house_drive, house_L, vacant_lot), apartment
  (apt_court, apt_rows), commercial (strip_stores, pad_store, lot_only),
  industrial (shed_big, yard_stacks), downtown (tower, tower_plaza),
  park (grove, field), generic (slab). Megablock districts (resort, mall,
  casino, stadium) stay single-structure.
- LOT SUBDIVISION: the interior splits into quadrant blocks along the two
  interior streets; each block subdivides into lots on a per-pool LOT
  PITCH (suburb 28x24 = real yards, the locked 8-12 house read; commercial
  36x12 strip lots; downtown 18x14 tight towers). Each lot stamps ONE
  prefab: deterministic weighted pick from hash(seed, cell, lot), jittered
  inside the lot, ~1 in 7 suburb lots stays vacant, per-stamp horizontal
  FLIP for free variety, '%' cells resolve per-stamp-hash.
- ABSTRACTION LAW WIRED: a suburb cell with 3+ suburb neighbors rolls
  ~1-in-5 as an APARTMENT COMPLEX pool instead of houses. A cluster of
  house cells = a big-house neighborhood or an apartment complex, exactly
  as locked.
- PROTECTION: stamps never bleed onto the street ring or interior streets
  (proof-tested), interiors stay majority-walkable, two neighborhoods
  never stamp identically, same (seed,cell) identical forever.

## THE PRODUCTION LINE THIS OPENS (the actual point)
Cooked batches are now just MORE PREFABS in this exact text format. The
verdict loop for world content becomes: Claude authors N prefab variants
per district class -> renders thumbnails -> Paolo thumbs -> approved
prefabs enter the pool with a weight -> the whole valley instantly grows
the variety. Art direction upgrade later = re-skinning the palette chars,
the stamps and pools stay.

## THE COOKING FACTORY + PREFAB LAB (BUILT same session, Paolo's law:
## nothing is one-off, build the factory before the batch)
- cookHouse(hash): the parametric house generator. Spec knobs rolled per
  hash: footprint W 8-12 x H 5-8, shape (rect / L-cut / south wing), 2-4
  '%' accents, porch 2-3 wide, driveway to the lot edge on a rolled side,
  1-3 trees, 0-2 2x2 garden patches. Every output is a legal pool-format
  prefab. FACTORY GATE: 200-hash sweep (legal chars, rectangular, dims
  <=16x16 fits the lot pitch, 12+ structure cells, side margins clear).
- PREFAB LAB (🏠 PREFABS button, city tab): cooks batches of 12, draws
  each candidate as a thumbnail through the palette, 👍/👎 per candidate.
  THUMBED-UP COOKS ENTER THE LIVE SUBURB POOL INSTANTLY (caches clear, the
  world regrows with the winner in rotation, drop in and see it standing).
  NEW BATCH rerolls the seed. EXPORT VERDICTS posts prefab_verdicts.txt
  through the parent export modal (share/copy/download), approved rows
  included verbatim so winners bake into canon next session.
- Verdict flow parity with music: cook, thumb, live-apply, export, bake.

## THE TEXTURE TILE FACTORY (BUILT same session, Paolo's direction:
## texture and love at character-grade pixel density, no flat cells)
- Every fine cell renders through procedural 8x8 PIXEL TEXTURES, not flat
  color. Painters: grass (speckle + blade dashes + light tips), dirt
  (grain + pebble runs), asphalt (aggregate noise + wear cracks), paved
  (slab seams), roof (shingle rows + ridge highlight), canopy (leaf
  clumps + light hits), water (wave bands), rock (boulder shadow/light).
- 4 variants per (kind, base color), memoized; each cell picks a variant
  + micro tint jitter by position hash so neighbors never repeat. Quality
  tint law preserved (textures derive from the district base color).
- Structures get edge DEPTH: light top lip, dark bottom lip.
- PERF LAW HONORED (7/3 chunking law): textures bake ONCE into a 128x128
  canvas per 16x16-cell chunk; the frame blits scaled chunk canvases,
  never per-cell draws. Night = per-chunk dark overlay + lamp dots from
  the chunk's recorded structure list. LRU eviction carries the canvas.
- FACTORY GATE: 16 checks (every painter runs + paints, memoization,
  kind routing, chunk bake + lamp record).
- DENSITY CORRECTION (Paolo's call, same session): 8px per cell was a
  perf lowball and read blocky. TPX=16: near 1:1 with screen pixels at
  default zoom (cell = 22 screen px). Painters rebuilt at 16: grass gains
  clump patches, asphalt gains wear-crack runs + lane specks, roofs gain
  staggered shingle seams, dirt gains shaded stones. Canvas memory held
  safe by a dedicated LRU: cell data stays cached wide, baked canvases
  cap at 160 (~40MB iPhone-safe).
- HOUSES READ AS HOUSES NOW: every suburb/apartment stamp rolls a roof
  color from a 7-tone palette (reds, browns, slate, teal, clay) so one
  neighborhood carries varied roofs; the SOUTH FACE of each footprint
  (structure cell with yard below) renders as a WALL texture: lighter
  siding, eave shadow, a door, two windows. Slabs became homes.
- The painter set is the factory; texture LOOKS are first-pass.
  [PENDING, Paolo's verdicts: per-kind texture styles are thumbable the
  same way prefabs are; a TEXTURE LAB panel is one step from the prefab
  lab pattern if wanted.]

## STATUS
- Prefab engine + starter pools + cooking factory + lab: BUILT, gated.
- All prefab LOOKS: [PLACEHOLDER, PENDING Paolo's art direction].
- Three-version derive-vs-author: [PENDING Paolo].
- ALL FOUR COOKERS LIVE (overnight 7/7): commercial pads (parking apron +
  back store + storefront glass runs + pad sites), apartment courts (thick
  block wrapping a shared court, O and U variants, court walks, ring gate),
  industrial sheds (shed + work apron + container stack yard). Every pool
  button in the PREFAB tab is live; switching pools cooks a fresh batch
  with that pool's cooker; approved cooks relay into the matching city
  pool generically. FACTORY GATE v2: 20 checks, 200-hash sweeps per cooker
  (legal chars, dims fit each pool's lot pitch, rectangular, structure
  mass, always keeps open approachable ground). All looks remain
  [PLACEHOLDER, Paolo's art direction pending].
