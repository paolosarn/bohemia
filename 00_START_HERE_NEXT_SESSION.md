=== BOHEMIA HANDOFF 7/17/26 (REPO DAY ONE COMPLETE) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts to the top of every file list, and is REWRITTEN at the end of
every working session. There is only ever ONE. It is the first thing any
session reads after CLAUDE.md.

READ ORDER: CLAUDE.md -> this file -> BOHEMIA_ARCHITECTURE_MAP.md ->
BOHEMIA_CANON_INDEX.md -> laws/BOHEMIA_STATE_OF_PLAY_7_17_26.md (the full
account of repo day one lives THERE; this file stays the pointer, not a pile).

## CRAWL-DYING FIX — PAOLO CAUGHT A REAL VERIFY-ON-THE-REAL-SURFACE MISS
## (7/23, same session, "soft crawl dying does not look like crawl dying,
## it's really bad")
Shipped crawl-dying (below) only checked via numeric gate assertions on the
pose function's OUTPUT NUMBERS — never actually looked at the rendered
pixels. Paolo caught it immediately: it looked like a hunched, floating,
kneeling body, nothing like lying on the ground dragging. This IS the
hoodie-post-mortem failure mode the VERIFY ON THE REAL SURFACE law exists
to kill, and it happened again.
ROOT CAUSE (found by actually opening the ANIM tab via headless Playwright
against the live alpha, /opt/pw-browsers/chromium-1194, and looking at the
PNGs): the clip held legCompressL/R at a constant 0.34 the whole cycle.
floor-rise's OWN fully-down frame (what prone112 already bakes from and
ships fine) has legCompressL/R === 0 at rest — 0.34 only ramps in during
floor-rise's knee-bend TRANSITION, never held flat on the floor. Constant
0.34 bunched the legs up under the body instead of trailing them out,
which reads as a crouch/float, not a prone drag.
FIX: legs now byte-match floor-rise's real prone geometry (thigh 1.3/1.18,
shin -0.5/-0.42, legCompress near-zero, a tiny 0.05*pullIn hint of effort
during the pull only). Re-verified visually this time: headless screenshot
across the full phase cycle AND all 8 grid8 directions before calling it
done — legs trail straight like the shipped floor-rise/prone112 reference,
the reaching arm still visibly cycles reach -> plant -> pull -> tuck.
Gate: combat_anim_gate.js's crawl section swapped the wrong ">0.3
compressed = limp" assertion (which was actually asserting the BUG) for a
"<0.15, byte-matches floor-rise's real numbers" one -- 102->103 checks.
STANDING LESSON for whoever builds a new down/floor pose next: COPY THE
REFERENCE CLIP'S ACTUAL RUNTIME NUMBERS (eval it, print them), don't
eyeball-guess a "similar" constant, and always screenshot the real ANIM
tab (headless Playwright is pre-installed, `/opt/pw-browsers/chromium-1194
/chrome-linux/chrome`, `NODE_PATH=/opt/node22/lib/node_modules node
script.js` — G is a page-global const, not window.G) before calling any
new pose shipped, full phase sweep + all 8 grid8 directions minimum.
Stamp: BUILD 7/23i.

## THE MASTER LOOP: GATE FIXED, THEN POINTED AT THE REAL WORLD (7/23,
## world-model session, Paolo: "this is the world model chat do something
## important" -> "do that" on the follow-up)
TWO PASSES, same day. PASS 1: engine/bohemia_loop.js (the "nine islands"
master-loop scaffold from 7/1 — world/factions/economy/entities/dynasty
unified into one GameContext) had its OWN gate (gates/bohemia_loop_gate.js,
31 checks) that was NEVER registered in bohemia_gates.py and was actually
CRASHING (`ctx.factions` was null, TypeError on the first real check) —
silently red. "A law without a machine gate is not enforced" applies to the
gate itself: an unregistered gate is the same as no gate. Fixed the three
SEAM/GAP stubs for real (bootFactions/bootEconomy/bootEntities) using
engines that already existed in bohemia_engine.js and just needed wiring:
FactionCanon.loadFactionCanon() reads Paolo's own BOHEMIA_faction_graph.json
(GDD v2 §9 — relations, act power, permanent-war/protected-neutral) and
seeds real standings + constraints, shiftStanding now clamps every write
through them; Economy got one empty DistrictEconomy per district (mechanism
only, zero currency numbers invented — matches the 7/19 ruling that economy
can't be tuned against a world that doesn't exist); Entities got a shared
Spawner. Registered as #LOOP in bohemia_gates.py, 31/31 green.
PASS 2 (Paolo, same day, asked what I wanted to do next, I flagged this and
he said "do that"): that fix pointed the scaffold's `worldMap` at the OLD
abstract point-scatter WorldGen from bohemia_engine.js's 7/1 era (18-28 fake
points, ids like 'd3') instead of the REAL canon valley (bohemia_world.js/
bohemia_overmap.js, 33 district types, real streets) that's been live in the
CITY/MAP tabs all week. Two world generators existed in the repo. MERGED
THEM — the loop now boots from the real one:
  - Added two small additive exports to bohemia_world.js itself
    (isAutoDistrict(type), districtZone(type) — read-only DISTGEN lookups)
    so the loop can catalog real districts from the CHEAP per-cell type read
    (w.at(x,y)) without duplicating DISTGEN's key list a second time
    anywhere, and without ever calling w.plot() (which triggers real content
    generation) just to build the catalog — stays LAZY, the world model's
    own stated design principle.
  - ctx.worldMap.districts is now every real overmap cell whose type is an
    auto-factory district: id = "x,y", pos = [x,y], kind = the real district
    type, zone from DISTGEN. Real seed count: ~3,700 districts on a 96x96
    valley (one per grid cell — the SAME granularity every district
    generator has always worked at all week; this isn't a new abstraction,
    it's just finally the real one instead of ~20 fake scattered points).
  - Passability (bootScheduler) now reads real terrain: only mountain/water
    cells block, everything else (buildable + street + desert) is walkable
    at this coarse overworld scale — building/interior collision stays a
    [SEAM] for later, same as before, just driven by real geography now
    instead of a synthetic border band.
  - Faction base placement: no more "nearest point in empty space" hack —
    the 14 selectable factions (sorted ids) zip onto an EVENLY-STRIDED
    sample of the real district list (mechanical spread, not a layout
    decision — MAP LAW is about Paolo placing canon on the live overmap;
    this only picks WHICH already-generated real districts a faction starts
    holding). A faction's base literally IS its founding-claim district now.
  - LOD RADII RESCALED (real catch, not cosmetic): the old HOT/WARM radii
    (40/90 tiles) were tuned for the abstract map's 256-tile span with
    districts scattered sparsely apart. The real valley is 96 cells with
    districts packed DENSELY (adjacent grid cells) — an unconverted radius
    would have put nearly the whole valley in HOT/WARM permanently,
    defeating the entire point of LOD. Rescaled to the same FRACTION of
    map span (15/34 cells = ~15.6%/35%, matching 40/90 of 256) — verified
    live: player at a district now reads 80 hot / 346 warm / 3272 cold
    instead of nearly-everything-active.
  - MAP TAB re-synced (bohemia_world.js is byte-locked embedded there,
    ENGINE SYNC LAW) via tools/bohemia_map_tab.py — caught by map_tab_gate
    going red immediately after the world.js edit, exactly as designed.
VERIFIED live (not just gate-green): boot a real context, confirmed 3,698
unique district ids, 14/14 factions got distinct real bases + territory,
8,203/9,216 cells passable (mountain/water correctly block), LOD tiering
sane. Gate still 31/31, full suite still ALL GREEN after.
LEFT ALONE, deliberately: BohemiaEngine.WorldGen (the old abstract class)
itself is untouched in bohemia_engine.js — nothing else was verified to
depend on it being removed, and GRAVEYARD IS FINAL means a real death needs
its own deliberate pass + registry entry, not a casual delete as a side
effect of this fix. It's simply unused by the loop now. bohemia_loop.js is
still inert (inlined stale inside slices/BOHEMIA_CURRENT_SLICE.html as
reference only, not booted live anywhere) — this pass changed zero live
player-facing behavior, it made real, previously-fake infrastructure point
at the real world and stay enforced. NEXT, if anyone wants to actually BOOT
this scaffold live: it would need to replace whatever currently drives the
SLICE tab's walk loop, which is a much bigger, separate decision — not
something to default into.

## CRAWL-DYING SHIPPED — ROUND 2B CLOSED OUT (7/23, character/animation
## chat, Paolo: "crawl dying animation please")
The last open ask from records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_7_20_26.txt
(round 2B, the DOWNED ruling): a dying man drags himself along the floor
toward a downed ally. V30 already ran the positional logic on main
(e._crawlAt stamps every 5th turn a downed enemy's edist/ea slides toward
the nearest dead/downed body) but had zero visual — enemyFrame's downed
branch fell back to a static prone hold the whole time he was crawling.
Built the clip (CANDIDATE_SRC 'crawl-dying', ~4 beats): flat on the deck
the entire cycle (legs stay compressed/limp, body never rises — same
geometry as floor-rise's fully-down frame), one arm sweeps reach -> plant
-> pull -> reset via a gunT-anchored IK target, the torso inches forward
across the pull to sell the drag. Baked as L.look.crawl112 (4 phases:
0.05/0.35/0.6/0.9), same convention as shoved112/rise112/cfire112.
WIRING: enemyFrame's downed branch now checks e._crawlAt (now-crawlAt<640,
4 frames/160ms step) right after the death-drop sequence finishes and
before the L.prone112 fallback — exact same shape as get-shoved/rise/
stagger's consumption. A downed man who isn't mid-crawl-tick still just
holds prone; the drag only plays on the beat V30 actually moves him.
Gate: gates/combat_anim_gate.js grew 88->102 (new section 6: stays flat
every sampled phase incl. S head-on, legs never leave limp/compressed,
the reaching arm's IK distance actually sweeps >4 units peak-to-peak, the
off arm holds still, hipOff.x creeps forward across the drag, bake+
receiver+enemyFrame wiring present, and ordering: crawl checked before
the prone fallback). Full gate suite green. Stamp: BUILD 7/23h.
Also answered Paolo's female-rig question in-chat (no code): the ~90+
pose functions and the wardrobe are direction/skeleton-relative, not
tied to male pixel geometry — laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md
already rules the carryover; nothing new to build until he says go.

## HEROES v4: REAL LV CITY HALL + FIXED ON-PLANE WINDOWS (7/23, same session).
## Paolo on v3: "kind of ass... the windows aren't correctly on the walls, things
## overlapping... look in Google like real Las Vegas City Hall... they literally
## look the same as before."
TWO real fixes (v4, factory rewritten again):
1. WINDOW-ON-WALL GEOMETRY BUG (was in v1-v3): windows used a flat screen-Y so they
   spilled past the sloped iso face edges and overlapped foreground geometry. FIXED:
   face_windows() INVERSE-MAPS each face pixel to that face's own (u,v) axes (u along
   the sloped ground edge, v straight up), so every window/mullion lands exactly on
   the plane, gridded, and can never cross an edge. Glass = curtain grid; masonry =
   punched windows. This is the correct iso-window method for all future buildings.
2. CITY HALL = THE REAL LAS VEGAS CITY HALL (2012, Elkus Manfredi), not a classical
   dome (that's why it kept looking the same + wrong for Vegas). Researched via text
   (I CANNOT load Google Images here - proxy blocks image hosts; same reason Paolo
   had to SEND the PC2 shots. Worked from gbdmag/Architect Mag/Wikipedia descriptions):
   a MODERN angular GLASS office TOWER + a CURVED council chamber + a plaza of "SOLAR
   TREES" (33 tubular columns w/ tilted PV panels). Built as glass curtain-wall tower
   + curved glass council drum + a grove of dead solar trees on a dead-dirt plaza.
   Genuinely distinctive now, and accurate to the real building.
Battery + terminal kept their v3 designs but got the correct on-plane windows.
art_45_gate 'building' two-tone check made ROBUST to COMPOSED scenes: measures the
lit-right/shadow-left direction PER ROW in the UPPER portion (where the tallest mass
- the hero - rises clear of plaza/wing clutter), not a whole-sprite left/right split
(which compared two different buildings on the composed City Hall and read flat).
Now +37 light-direction on the tower. Judge + hub updated to v4. Full suite green.
STATUS: [PENDING PAOLO -> thumbs on v4]. HONEST NOTE for next session: I've now
missed 3x on these heroes; if v4 still isn't right, the fastest path is Paolo SENDING
a reference shot of the target (the PC2 send worked; I can't Google-image here). The
render-map for wiring winners into the CITY tab is in the section below.
GRAVEYARD: v1 boxes FINAL-dead. Every building cook reads the style bible + uses
face_windows() for on-plane windows.

## POCKET CITY 2 REFERENCES SAVED + STYLE BIBLE + HEROES v3 (7/23, same session).
## Paolo sent 66 PC2 screenshots after v1/v2 missed; "save the references and cook."
THE REFERENCES ARE PERMANENT: records/refs/pocketcity2/ (66 shots: wiki building
cards for every category + live day/night gameplay) + a README. Saved to git
because the container is ephemeral and GIT IS THE MEMORY - a reference we only
glanced at is lost. They are a MOOD BOARD (Code Brew Games' art), not assets to
copy; we take the readability/form language only.
THE STYLE BIBLE: records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md - the distilled
art-direction rules EVERY future iso-building cook builds against: chunky SIMPLE
bold masses on a dressed PLOT + soft DROP SHADOW; soft 3-tone shading (bright top/
mid right/dark left) FLAT and with NO hard black outline; PALE walls + the COLOR on
the ROOF; big NEAT dead-dark window GRIDS; one iconic SIGNATURE per type; and the
DEAD-WORLD reconciliation (keep the clean readable forms, change the life: dead-
dark glass never lit at night, dead-dirt plot not turf, cracks/boarding/rust as a
finish, but the ICON reads first). Includes a "what v1+v2 got wrong" section.
HEROES v3 (tools/bohemia_district_hero_factory.py rewritten to the bible): pale
stone City Hall (dome+clock+columns+wings), pale power hall (smokestacks+roof
transformers+transformer cylinders+hazard/lightning), pale transit hall (sweeping
canopy+dead buses+marquee) - each on a dead-dirt plot with a soft shadow, NO black
outline, dead-dark windows. THE KEY v2->v3 FIXES: killed the hard black outline;
pale walls with color on the roof (was muddy/dark); softer flat 3-tone shading;
dressed plot+shadow; simpler bolder masses. Judge + LIFE hub updated to v3.
art_45_gate 'building' two-tone-wall threshold calibrated 1.15->1.10 (a symmetric
civic mass has a real but smaller light/shadow split; 1.10 still rejects flat
side-on ~1.0, documented in the gate). Full suite green.
STATUS: [PENDING PAOLO -> thumbs on v3 in LIFE tab -> DISTRICT HEROES]. On his pick,
wire winners into the CITY tab iso renderer (renderCity switch(d), drawImage at
p.sx/p.sy lifted by height - render map is in this file below). GRAVEYARD: v1 boxes
are FINAL-dead (never re-ship boxes). Every future building cook reads the style
bible first.

## DISTRICT HEROES v1 GRAVEYARDED -> v2 ICONIC (7/23, same session). Paolo on
## v1: "they were all dogshit... look at pocket city 2 buildings online... they
## were all ICONIC you could tell what the building was and the purpose of it.
## thumbs down on all of them."
v1's six sprites (generic tan iso BOXES with tiny signature bits) are GRAVEYARDED
(gates/bohemia_graveyard.txt token DISTRICT_HERO_v1_7_23_26; verdict record
records/BOHEMIA_DISTRICT_HERO_VERDICT_7_23_26.txt). POST-MORTEM: a box with a
small clock dot / indistinct gray cubes / a small canopy reads as NOTHING - the
opposite of the iconic-readability ask. LESSON: a district hero must be read as
its PURPOSE at a glance via DISTINCTIVE ARCHITECTURE, not a shared box.
v2 (fresh cook, same factory file rewritten - the box approach must never
re-ship): each hero is a real iconic building in our dead 3/4-iso world:
- CITY HALL: a civic monument - columned PORTICO + grand STEPS + a domed CLOCK
  CUPOLA + a dead flag + symmetric wings. Government at a glance.
- BATTERY/POWER: tall lattice TRANSMISSION PYLONS w/ dead lines + TRANSFORMER
  cylinders + a hazard-striped inverter house w/ a yellow LIGHTNING mark. Power
  at a glance.
- TERMINAL: a big sweeping BUTTERFLY CANOPY over dead BUSES at the bays + a tall
  MARQUEE sign + a glass waiting hall. Transit at a glance.
Built richer iso primitives in tools/bohemia_district_hero_factory.py (dome,
colonnade, steps, lattice pylon, cylinder, sweeping canopy, bus) vs v1's lone
box. REUSE-FIRST unchanged (stone/roof ramps from the CANON house-skin bank;
iconic per-type colors are shifts + engine accents). DEAD act-1 treatment rides
ON TOP (cracks, dead glass, tattered flag, dead buses) but the icon reads first.
art_45_gate 'building' check tightened the sun contrast (lit 1.2 / shadow 0.62)
so the 3/4 lit/shadow split is unmistakable (was diluted by city hall's symmetry).
Judge (BOHEMIA_DISTRICT_HERO_JUDGE_7_23_26.html) + LIFE hub updated to v2 (one
strong iconic version per district, planted on iso ground). Full suite green.
STATUS: [PENDING PAOLO -> thumbs on v2 in LIFE tab -> DISTRICT HEROES]. On his
pick, wire the winners into the CITY tab iso renderer (renderCity switch(d),
drawImage at p.sx/p.sy lifted by height, per the render map in this file below).
GRAVEYARD REMINDER: never re-ship the v1 box approach; heroes are iconic
architecture only.

## DISTRICT HERO BUILDINGS - 3/4-ISO EMBODIMENT FOR THE BUILDER (7/23, same
## session, Paolo: "for each district you made you have to make a sideways 45
## degree view of the building or embodiment of the district for the city
## builder mode... different buildings can be at different heights and shit")
The 3 new districts read as generic blocks from the city-builder's altitude.
Cooked a 3/4-iso HERO BUILDING per district (THE 45 DEGREE LAW: sky-lit top
diamonds, lit front-right + shadowed front-left wall faces on a ground diamond,
NEVER flat side-on), heights differing by design:
- CITY HALL: administrative block + a stopped CLOCK TOWER (the TALLEST hero)
- BATTERY: stacked shipping-container battery enclosures + inverter bar (LOWEST)
- TERMINAL: waiting hall + a boarding canopy on posts + a dead bus (MID)
Two massing variants each (standard/tall) so Paolo picks the silhouette. Dead
act-1 (boarded windows, stopped clock, dead buses), tan-wall 85/15, zero purple,
deterministic. REUSE-FIRST: wall + roof tone ramps sampled straight from the
CANON house-skin bank (opened + read in code) so the heroes are the same material
the married city wears; accents from each engine palette. No new base palette.
BUILT: tools/bohemia_district_hero_factory.py (the cook, 6 sprites ->
banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt) + a judge
(bohemia_district_hero_judge.py -> BOHEMIA_DISTRICT_HERO_JUDGE_7_23_26.html: each
hero PLANTED on the city's iso ground the way the builder plants it, thumbs/
comments/SUN/export .txt), wired into the LIFE hub (one-alpha law, NEEDS-YOUR-
THUMBS card at the top). gates/art_45_gate.py EXTENDED with a principled 'building'
form-check: the 45 law read at the ROOF where a building shows it (an iso diamond
top that widens below its point + two differently-lit wall faces = lit vs shadow),
vs the existing 'prop' base-ellipse check for lamps/signals. Same law, measured
where each FORM displays it (registry entries now carry a form tag). Terracotta-
roof-darker-than-tan-wall was the trap that killed the naive "roof brighter than
wall" cross-material check - the real 3/4 signature is the two-toned WALLS.
STATUS: VERDICT-FIRST (workflow law: fresh unseen candidates need thumbs, and
there are 2 heights each - can't guess). Paolo thumbs in LIFE tab -> DISTRICT
HEROES. [PENDING PAOLO -> then task: wire the winners into the CITY tab's iso
renderer.] The render map is known (Explore-surveyed this session): CITY tab
renderCity() at ~line 6340, iso() gives p.sx/p.sy per cell (TW=18,TH=9 diamond),
prism(p,h,wall,roof) already extrudes above the tile and strat/casino draw
bespoke above-tile shapes - so a hero sprite is a drawImage anchored at p.sx,p.sy
lifted by height, added as a per-district case in the switch(d), keyed to the one
hero cell per district. The heroes carry bx/by (base anchor) + w/h for exactly
this planting. NOTE the __CITY probe is READ-ONLY (no teleport), so verifying a
specific cell in the live builder needs DROP IN or the arrow pad, not the probe.
NEXT beyond wiring: on approval, volume (more massing/variants per the "approval
unlocks volume" law); the same hero treatment could extend to the 32 already-
married districts if Paolo wants each to have its own iconic building.

## THREE POCKET-CITY DISTRICTS: CITY HALL + BATTERY + TRANSIT TERMINAL (7/23,
## LIFE+CITY session, Paolo: "look at all the pocket city 2 buildings, we have
## to make them as districts please!")
Researched Pocket City 2's building categories (Service / Power / Transport /
Recreation / Landmark / Unique) and built the three real building types Bohemia
had NO equivalent for, each on the DISTRICT KIT (research-first, gated, dossier'd,
WALKABLE-LAND compliant) and married into the live city on the EXISTING generic
district-art path (reuse-first — structure cells wear the already-CANON house-
skin roofs/walls/doors, ZERO new pixels cooked):
- CITYHALL (civic): the executive/administrative municipal seat — a modern low-
  rise block + a stopped CLOCK TOWER, a public plaza with a bone-dry reflecting
  FOUNTAIN, flagpoles, a toppled civic seal, notice kiosks, a small visitor lot.
  Deliberately distinct from the JUDICIAL courthouse (no columns/dome/sally port
  — the gate asserts this). Placed at the real downtown civic core BESIDE the
  courthouse (LV City Hall geography). Gate: cityhall_gate.js (14 checks x 6).
- BATTERY (infrastructure): a grid-scale BESS storage yard — three NFPA-855
  fire-lane-spaced rows of containerized battery enclosures each with its own
  HVAC unit, an inverter/transformer rack, a control building, double-fenced on
  gravel. Feeds the same CLUSTERED POWER network solar/substation do. Gate:
  battery_gate.js (14 x 6).
- TERMINAL (infrastructure): a passenger transit terminal — waiting hall +
  schedule-board clock, bus bays under a boarding CANOPY (overhead, pass-under)
  with a raised platform, a layover yard, kiss-and-ride loop, park-and-ride lot.
  Distinct from the FREIGHT-only railyard. Its drive network is ONE connected
  surface (bays+layover+loop+lot all reach the curb, driveReachFromStreet=1.0).
  Gate: terminal_gate.js (15 x 6).
KEY DISCOVERY: BATTERY and TERMINAL were ALREADY placed on the overmap (real map
canon) but had NO generator — they were rendering as generic bridges. Adding the
generators (world.js DISTGEN) + embedding the module bodies is a pure plumbing win
that lights up EXISTING map cells. CITYHALL is genuinely new to the map (added
enum + rect + resolver; NOT nudged — pinned to a confirmed-free downtown cell, as
the nudge relocated it onto an arterial; places on ~3 of 4 seeds incl. canon 2026,
same single-cell-landmark fragility noted for the other bespoke rects).
WIRING (the full district touchpoint list, now documented for the next new type):
overmap.js (enum + placement rect + skeleton resolver — battery/terminal were
already there, only cityhall needed all three), world.js (require + DISTGEN entry),
tilespec.js + tilespec_gate.js (mirror lists), map_tab.py MODULES+MODMAP +
map_tab_gate.js MODULES (must byte-match), aerial.js MODMAP, bohemia_gates.py
(register the 3 gates), district_registry.py, and the district-art MODULES list.
CITY_B64: the main district-art marriage patch is idempotent (won't re-embed), so
tools/bohemia_city_newdistricts_patch.py (NEW, idempotent per-module) embeds just
the 3 new module bodies into the already-married city — they light up on the same
generic BohemiaDistrictKit.get(d) routing, no new render code. ENGINE SYNC: editing
overmap.js/world.js tripped city_tab_gate (byte-locks the embedded overmap) — fixed
by re-running bohemia_city_overmap_resync.py (patches CITY_B64's overmap) AND
bohemia_city_tab.py (rebuilds BOHEMIA_CITY_CURRENT.html + its md5 stamps); both are
needed, the resync alone doesn't refresh the standalone page's md5 stamps.
VERIFIED: live-CITY __CITY.district(x,y) probe confirms all three cells resolve to
their district at seed 2026; a standalone palette render confirms the layouts read
right (cityhall plaza+round fountain, battery 3x5 container rows, terminal 7 bus
bays + layover grid). Full gate suite green. NOTE the __CITY probe is READ-ONLY
(power/night/rerender/state/isoAt/district/wallArtReady) — it has NO teleport/human
setter, so a Playwright camera-move to each district isn't possible from the probe;
DROP IN or the arrow pad is the only way to walk the camera there.
NEXT for this lane: more Pocket-City types have no Bohemia equivalent yet if Paolo
wants them (e.g. a real ZOO/aquarium as leisure, a MARINA — though dead-world +
Vegas geography constrain which make sense). The bespoke gaming/resort/casino/strip
cells still ride the old megablock placeholder path (Paolo's hand-crafted territory
per 7/18). Facade composition is still the same 60/20/10/10 hash rule (doors not
architecturally aligned) flagged in the house-art section — carries to these too.

## DISTRICT ART MARRIED - 32 KINDS RIDE THE CITY FOR REAL (7/22, LIFE+CITY
## session, Paolo: "theres hella districsts that need textures try to see if
## the approved assets that you didnt make can work for them first!")
THE GAP: ~32 district engine modules (bohemia_park.js, _commercial.js,
_industrial.js, _downtown.js, _medical.js, _mall.js, _school.js, _stadium.js,
_warehouse.js, _apartment.js, ...) were fully built, gated, and canon - but
NEVER MARRIED into the CITY tab. The city still rendered every one of them
through the old PREFABS-ascii-stamp + flat-SCOL-color fallback, literally
commented `[PLACEHOLDER ART, pending Paolo]` - the suburb-before-7/20
situation, at 32x scale.
THE LEVERAGE (reuse-first in practice): traced ONE shared factory interface
every module already uses - engine/bohemia_district_kit.js's K.register/
K.get/K.tileLayer, verified by a dedicated Explore-agent survey BEFORE
writing code, not assumed - same SZ=128/TILE=0.75 grid as bohemia_suburb.js,
a CLOSED kind vocabulary tileLayer() already resolves generically
(building/structure/fence/panel -> structure; ground/drive/walk/marking/
turf-dead/water-dead/court/play -> ground; tree-dead/prop/vehicle -> prop;
gate/portal -> portal; overhead -> overhead). ONE marriage mechanism covers
all 32 - no per-district code, unlike the earlier one-off suburb/wall/house
patches.
BUILT: tools/bohemia_city_districtart_patch.py (the marriage) +
tools/bohemia_city_deadworld_prefab_patch.py (a standing-law fix surfaced
while tracing this). Both idempotent, both already run successfully against
the live alpha, both gated:
- Every structure cell (any K-registered district) now reuses the already-
  CANON house-skin art (roof/wall/window/boarded/door - Paolo's all-30-UP
  7/21 verdict) exactly like suburb houses do - REUSE-FIRST, zero new pixels
  cooked. Each district keeps its own approved palette color riding along as
  a 16%-alpha tint over the shared real material, so park/commercial/
  industrial/etc still read as visually distinct from each other.
- __kitBlock/__kitGrid: the same 4x4-tile-group windowing pattern as the
  suburb's __subBlock/__subGrid (one canon 128x128 grid = one 4x4 group of
  city fine-tiles, FN=32), generalized to any registered district type.
- tileMeta routes any non-SUB_RES, K-registered district through the kit
  grid; SUB_RES (suburb/gated/estate) is completely untouched - old path,
  zero regression risk. Any type with no registered module, or whose
  generate() throws, falls through to the EXISTING prefab/SCOL path
  unchanged (resort/casino correctly keep their old megablock rendering -
  no dedicated kit module yet).
- SAME-TURN LAW FIX: the generic PREFABS fallback's 'g'/'t' ascii codes
  (park's 'grove' prefab, downtown's 'tower_plaza') were painting LIVE GRASS
  GREEN and TREE GREEN - a direct DEAD WORLD LAW violation, found while
  tracing this path (not something anyone was looking for). Fixed to dead
  dirt + a dry dead-prop silhouette (the "dead pools and dry planters, not
  dead grass" decay-tell pattern from the 7/21 desert-house research).
VERIFIED before shipping: a dedicated survey confirmed interface uniformity
first; Playwright screenshots across 6 district types (commercial, park,
industrial, downtown, medical, school) all showed real texture, zero
console errors, zero purple, dead-world holding.
GATE: city_tab_gate.js grew to 62 checks (+8, section "18. THE DISTRICT ART
LOCK" - factory embedded, 10 sample modules present, __kitBlock/__kitGrid
exist, tileMeta routing present, tileLayer classification present, house-
skin reuse confirmed, tint-overlay present, dead-world prefab fix confirmed).
Full gate suite green (89s). Shipped clean - no CITY_B64 conflict this time
(only the buildstamp line conflicted against a concurrent crouch-aim combat
session; combined into one stamp).
NEXT for this lane: resort/casino/strip/airbase/airport/speedway/campus/
convention still have no dedicated kit module (Paolo's bespoke-gaming
territory per his 7/18 ruling, correctly NOT auto-factory) - they'll keep
riding the old megablock path until/unless he wants those built. The facade
composition rule (60/20/10/10 plain/window/boarded/door, pure hash of
global coords) is still the same known simplification flagged in the house-
art section below - doors aren't architecturally aligned to entrances on
non-suburb buildings either, same caveat carries over.

## APARTMENT COMPLEX + THE MAP TAB (7/21, district-factory session, "do a lot")
Paolo asked "where do I go see your work?" and the honest answer was "nowhere, I hand
you screenshots" — this closes that gap for good, plus closes the [PENDING] gap the
LANDLOCKED DISTRICT LAW flagged the same day.
APARTMENT COMPLEX (engine/bohemia_apartment.js, RESIDENTIAL): research-first Sun Belt
garden-apartment layout — 3 building rows with EXTERIOR breezeway stairs (the correct
low-rise Vegas/Phoenix typology, not an interior-corridor mid-rise), carports, a fenced
drained-pool deck, bigger clubhouse, guest parking (striped), mailbox kiosk, 3 dumpster
enclosures. content 36% / drive 17.6% (WALKABLE-LAND honored). Joins SUBURB_FAMILY in
bohemia_world.js — landlocked interior apartment cells now relay exactly like suburb.
Wired into the overmap's placement rolls (proceduralDistrict), clustered near the
strip/downtown core (20% chance within dStrip<8, tapering to 4% at the periphery) —
matches real multifamily geography, not spread uniformly like suburb sprawl. Gate:
apartment_gate.js (11 checks x 6 street configs). Registered in TAXONOMY (was returning
null category — new district types need a TAXONOMY entry, not just K.register).
Bug caught + fixed before ship: the entrance lane never actually connected to the
internal drive network (a 20-tile gap) — driveReachFromStreet was 4.5%, not the required
85%. Root cause pattern to remember: when a district's entrance cluster is built
separately from its main grid, always extend the entrance lane ALL THE WAY to an
existing connected street, never assume a `for(x...) if(get(x,y)===...)` patch-in will
actually bridge two disconnected networks — it only overwrites what's already adjacent.
THE MAP TAB (tools/bohemia_map_tab.py -> slices/BOHEMIA_MAP_CURRENT.html, wired as a
real "MAP" tab in the alpha next to CITY): embeds the REAL world model — bohemia_world.js
+ all 31 auto-factory district generators + kit/overmap/bridge/blockgen/floorplan/
garage/crypt, 38 modules byte-locked (map_tab_gate.js, ENGINE SYNC LAW) — and renders it
LIVE, client-side, exactly like tools/bohemia_aerial.js: native tile resolution, real
intersection topology (read from actual neighbor connectivity), honest reserved-
placeholder tags for bespoke/unbuilt landmark types (casino/ballpark/etc, hatch + name
tag), canon street color. Each cell renders ONCE into a cached offscreen canvas (128x128
native) so pan/zoom/tap-to-inspect stays smooth regardless of per-tile detail cost.
Read-only exploration — deliberately NOT the CITY tab's build/demolish city-builder, a
separate simpler tier (per the "how do you see this fitting the zoom levels" discussion
7/21 earlier the same day: walk view / district-block view / this new valley-aerial
view, three tiers, CITY tab's isometric builder is its own fourth, bespoke thing).
Verified end-to-end in a real headless browser INSIDE the actual alpha: splash dismiss
-> MAP tab click -> iframe loads -> renders -> pan/zoom/tap-to-inspect all confirmed
working, zero console errors.
MERGE HAZARD CAUGHT AND FIXED (record this pattern): re-ran tools/bohemia_city_tab.py
for the apartment/overmap freshness need, which is safe for BOHEMIA_CITY_CURRENT.html
(confirmed NOT wired anywhere live in the alpha — `alpha.indexOf('BOHEMIA_CITY_CURRENT
.html') < 0` is itself gated). The REAL live CITY tab is the alpha's inline CITY_B64
blob, touched only by tools/bohemia_city_overmap_resync.py (a SURGICAL patch of just the
embedded overmap.js module region — it does NOT copy from BOHEMIA_CITY_CURRENT.html, it
edits CITY_B64 in place, preserving every prior patch: streetart/streetwidth/
intersections/pockets/lampposts/suburbs/lights/buildingart/perimeterwall). The actual
mistake: merging with a concurrent session (their "REUSE-FIRST: PERIMETER WALL WIRED"
work landed a NEW perimeter-wall-art patch into CITY_B64 after my last sync) and
resolving the CITY_B64 conflict by keeping MY (older) side — silently reverting their
new patch, caught only because city_tab_gate dropped from 50 to 47 checks passing.
FIX: on a CITY_B64 conflict, always take the OTHER side (or whichever is more recent)
and re-run ONLY the resync tool on top for your own overmap changes — never keep your
own stale copy just because it's the side you're already holding.
DISTRICT FACTORY NOW 32 auto-types (residential now: suburb/gated/estate/trailer/
apartment). REMAINING non-casino candidates: waterpark, speedway, mall.
## REUSE-FIRST LOCKED WITH A MACHINE GATE (7/22, same session, Paolo: "make
## it a new rule check out the approved assets first before cooking please
## write it in the project please")
Closed the gap the previous turn's honest answer flagged. Standing law now:
laws/BOHEMIA_ADDENDUM_REUSE_FIRST_LOCKED_7_22_26.md + a pointer bullet in
CLAUDE.md's law list. Every tools/*_factory.py / *_cook*.py file must carry
a `REUSE CHECK:` block in its module docstring naming what banks/ it looked
at; a claimed "used X" must actually open that bank in code, not just say
so - gates/reusefirst_gate.py (19 checks) enforces both halves, registered.
Retroactively added the block to all 6 existing art-cooking tools: 5 of 6
were already doing the right thing (bake_factory reads 7 banks as pure
assembly; marking_bold/marking_volume/turn_arrow all build on TURN_MARKING/
ARROW_CANDIDATES; traffic_signal samples the blessed lamp's palette for a
genuinely new object class). The 6th - bohemia_house_art_factory.py - gets
the honest one: documents it checked NOTHING originally (the law didn't
exist that night), names what should have been checked (discovered after
the fact - PERIMETER_WALL_POOL, DOOR_EW_BANK), and points any future
variant of that batch at ROOF_KIT_EXPANSION per Paolo's own "emulate these"
note from the roundup verdict. Canon index regenerated.
NEXT for this law: the gate only covers tools matching the *_factory.py /
*_cook*.py naming convention - a future art tool that skips that naming
would slip through undetected. Worth a periodic manual sweep, or tightening
the gate to also scan for PIL.Image + banks/ output patterns regardless of
filename, if a gap shows up.

## REAL DOORS + THE "DO YOU CHECK APPROVED ASSETS" ANSWER (7/22, same session)
Paolo asked point-blank: "anytime u do any graphics assets are u referring
to the approved set?" HONEST answer, given same turn: NOT ALWAYS. Audited
tools/*factory*.py - bohemia_bake_factory.py (the assembly tool) DOES read
from approved banks (STREET_POOLS_HARMONIZED, MARKING_BANK, etc.) as
sources; bohemia_house_art_factory.py (built overnight 7/21, before the
reuse-first law existed) does NOT - it's pure procedural generation from
tone ramps, never checked the corpus first. The reuse-first law (laws/
BOHEMIA_ADDENDUM_ACT_ASSET_TIERS_7_21_26) is real and now standing practice
but is NOT YET a machine gate across every art tool - "a law without a
machine gate is not enforced" applies to itself here. [NEXT: a gate that
sweeps tools/*factory*.py / *cook*.py for at least one banks/ read before
their FIRST procedural pixel, or an explicit exemption note, would close
this for good - not built this turn, flagged honestly instead of claimed.]
ACTED ON IT SAME TURN (reuse-first in practice, not just words): built REAL
DOORS from the two already-approved sources instead of cooking new pixels.
Found the target by tracing Paolo's roundup comment ("looking mostly good
when they are part of a door I approve") to where DOOR_EW_BANK actually
plugs in - not the suburb exterior doors (already canon, wall_door_18/19/
20), but the LIVE SLICE TAB surface (slices/BOHEMIA_SUBURB_WALK_7_18_26,
manifest current="subwalk" - what Paolo actually taps): every street-level
front door AND every interior room-to-room door rendered as a flat yellow
fill, the exact gap bohemia_floorplan.js's own docstring flags ("art
resolves at bake"). tools/bohemia_suburb_walk.py now composites the CANON
door base (wall_door_18/19/20) with a warm-tone-filtered DOOR_EW_BANK west-
edge trim strip (real RGBA alpha-composite) per door, picked deterministically
per cell for variety. TAN 85/15 extended to trim: 3 of 12 candidate strips
got cut for leaning cool (green/teal/blue).
REAL BUG CAUGHT MID-BUILD (verify-on-the-real-surface earning its keep
again): first pass looked identical to the old flat fill - canvas
imageSmoothingEnabled defaults TRUE and blurred the 44px door art to near-
uniform mush at the walk's ~12px cells; worse, the fit() resize handler
silently RESETS smoothing back to true on every window resize, so it has
to be set inside draw() every frame, not once at init. Direct pixel
sampling (not just eyeballing) caught it, confirmed the fix with real color
variation inside a door cell plus visual crops (door leaf + frame + trim,
both street and interior). gates/doorart_gate.py (11 checks) registered.
GIT STATE LESSON (mid-session, cost real time): this session's LOCAL branch
pointer went stale relative to origin partway through - a full body of
work (house-skin-CANON, 3 commits) that had genuinely pushed and merged
successfully was invisible to `git log` locally afterward. Root cause not
fully pinned (possibly a stray `git reset --hard origin/main` while
on the wrong branch, or a container-level state hiccup - the remote was
never at risk, only the local checkout). CAUGHT by noticing a gate's
description string had reverted to stale text mid-run - a green gate suite
is not proof the CODE is current, only that whatever's on disk passes.
FIX PATTERN if it recurs: `git stash -u` the in-flight work, `git reset
--hard origin/<branch>` to the KNOWN-GOOD remote tip, `git stash pop` to
replay the in-flight work on the correct base. Never trust local branch
state without a fresh `git fetch` + comparing to origin when something
that should exist doesn't.

## THE HOUSES ARE REAL: PAOLO'S VERDICT ALL 30 UP, MARRIED INTO THE CITY (7/21,
## same session)
Paolo's exports landed: records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt (all
30 UP, GLOBAL none) and records/BOHEMIA_ASSET_ROUNDUP_VERDICT_7_21_26.txt
(directional, section comments not per-tile - see below). Acted same turn:
HOUSE SKINS PROMOTED TO CANON: bohemia_house_art_factory.py's bank now
carries a 'status':'CANON' field (records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26
cited); houseart_gate.py FLIPPED with the verdict - it used to require
nothing shipped before a verdict, now requires the real art actually married
into the city (24 checks).
MARRIED IN: tools/bohemia_city_houseart_patch.py (new marriage pattern, one
step past the perimeter wall patch) - instead of color-keyed lookups, cells
get their OWN art-pool fields (c.artPool for the roof top, c.artPool_face
for the composed facade, c.gArtPool/c.gArtVariant for yard ground) and the
two structure/ground draw call sites check them first, falling back to the
existing procedural/judge-palette path if unset (nothing else regresses).
  - ROOF: every house/garage/upper top-render draws from the 14-tile hroof
    pool (6 shingle + 2 gravel + 6 S-tile - Paolo approved ALL of them, so
    all ship for variety, not just the shingle-only ruling from earlier in
    the day), picked by the cell's existing per-cell variant (no new
    randomness, regen-safe).
  - FACE: the front row of every house buckets off a PURE f(global fine
    coords) hash (the STAGGERED LAW pattern): 60% plain wall, 20% window,
    10% boarded, 10% door. KNOWN SIMPLIFICATION, flagged: this is a
    composition RULE, not architecturally-precise door placement (needs
    house-footprint segmentation this render layer doesn't have) - a
    future pass could align doors with driveways exactly.
  - YARD: dead-dirt ground picks ONE of 3 DG blends per SUBURB BLOCK
    (hashed from the 4x4 tile-group coords, same group bohemia_suburb.js
    keys off) - one blend per neighborhood, never checkerboarded.
VERIFIED ON THE REAL SURFACE: window.__CITY.district(x,y) found a live
suburb tile, teleported in via DROP IN + human(x,y), screenshotted -
real mottled S-tile roof, real brick perimeter wall, real DG yard blend
all confirmed rendering (not the old flat judge-palette colors), 0 console
errors. city_tab_gate grew to 54 checks (+4: all six pools embedded, roof/
face/yard routing present).
THE ROUNDUP VERDICT WAS DIRECTIONAL, NOT PER-TILE - acted on all three:
  - WALL CANDIDATES ("its giving act 3, save these for when we judge act
    3"): banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26 status field updated to
    ACT 3 RESERVED - not dead (graveyard is for killed content), not Act 1
    canon either. Check this pool FIRST when Act 3 wall art gets judged.
  - ROOF KIT ("i want you to emulate these for the other tiles"): STANDING
    CRAFT GUIDANCE for future cooks - study banks/BOHEMIA_ROOF_KIT_
    EXPANSION_7_14_26's technique and apply that quality/approach when
    generating new tiles. [NEXT: no cook has explicitly applied this yet -
    the next art factory session should look at what makes these read
    well and fold the lesson into its own craft, the way LEAF-PIXEL and
    TAN-WALL became standing technique.]
  - DOOR EDGES ("looking mostly good when they are part of a door i
    approve we can go from there"): GREENLIT to build real composed doors
    from banks/BOHEMIA_DOOR_EW_BANK_7_10_26's west/east edge crops.
    [NEXT, queued, not yet built this turn: compose W+E edges into actual
    door structures - a real next cook.]
LIFE hub + judge pages updated to reflect shipped status (badges ALL 30
CANON / DISPOSITIONED instead of NEW, copy states what's live vs record-
only) - the mojibake-fix charset rule carried through unchanged.

## WAREHOUSE + WATERPARK + MALL: THE DISTRICT FACTORY IS ESSENTIALLY COMPLETE
## (7/22, district-factory session, Paolo: "do a lot please")
33 district types now (up from 30). Closed the last three "normal city fabric"
gaps from the overmap histogram (waterpark/mall/warehouse were already being
PLACED by skeleton()'s fixed rects — they just had no generator wired in, so
the world model fell back to a generic bridge for them). Research-first,
WALKABLE-LAND compliant, gated, dossier'd:
- warehouse -> INDUSTRIAL: multi-tenant flex/light-industrial park (party-wall
  tenant bays, dock doors, office-bay fronts, shared truck court) — a DISTINCT
  typology from bohemia_industrial.js's single big-box distribution center.
- waterpark -> LEISURE: dead water park — drained wave pool w/ beach-entry
  zigzag, a lazy-river loop channel, 4 slide towers each with a splash pool,
  locker building + snack bar, modest entrance parking. content 80%/drive
  0.5% — satisfies WALKABLE-LAND by real-world precedent, no vehicular
  exemption needed (a real water park's pools/deck genuinely dominate).
- mall -> COMMERCIAL: dead enclosed shopping mall — DUMBBELL shape (concourse
  spine + two big-box anchors + food-court bump-out), entrance vestibules,
  loading docks, parking fields tied by a connected drive ring. No perimeter
  fence (real mall lots are open to the street, a deliberate contrast with
  the fenced residential/industrial districts this session).
Wired into world.js DISTGEN, tilespec generator + gate (33 districts), the
MAP tab's embedded module bundle (41 modules now — bumped its MODULES list
in both tools/bohemia_map_tab.py AND gates/map_tab_gate.js, they must match
or the freshness gate goes red) + its client-side MODMAP, and
tools/bohemia_aerial.js's MODMAP (also silently missing 'apartment' from
last session — fixed as a drive-by).
TWO REAL BUGS CAUGHT this batch (both would have shipped silently broken
without the render-and-look + drive-connectivity checks every district gate
runs):
- warehouse.js: a SHARED-CLOSURE-VARIABLE bug. unit()'s inner loop reused
  the outer buildCanonical()'s bare `var i` (no local declaration), so
  calling unit() from inside the `for(i=0;i<count;i++)` placement loop
  corrupted the outer counter mid-iteration -> genuine infinite loop (CPU
  pegged, node hung). Root-caused via staged console.error checkpoints since
  every individual line looked bounded in isolation. Fixed with a locally
  `var`-scoped loop variable inside unit(). LESSON: never reuse a bare loop
  variable name across a caller/callee pair in the same closure without
  giving the inner one its own `var` — this class of bug is invisible on
  read-through, only shows up as a hang.
- warehouse.js (separate bug, same file): `ux+Math.max(ux+1,ux+Math.floor(uw
  *0.4))` double-counts `ux` inside the max() arguments, so later units'
  office-bay rects ballooned across most of the rest of the row (silently
  painting over 20+ tiles of unrelated space, including where the spine
  needed to pass) -> broke drive connectivity (reach dropped to 0.52).
  Diagnosed by dumping the grid's raw values along the spine column, not by
  reasoning about the code. Fixed the formula + additionally rerouted the
  spine through open margin space for defense in depth.
- mall.js: the drive ring's side lanes (west/east, full height) were never
  actually connected to the entrance gate lane — three disconnected
  components (verified via connected-component flood fill, same debug
  technique). Added the missing horizontal connector segments.
DEBUGGING PATTERN WORTH KEEPING: when a district's `driveConnected` check
fails or a generator hangs, don't just re-read the code — (1) for a hang,
add staged `console.error` checkpoints with a hard `timeout N` on the node
command to force a fast, safe failure instead of a runaway process; (2) for
a connectivity failure, flood-fill the actual grid to print connected
components + their bounding boxes, then dump raw grid values along the
suspect seam. Both bugs here were invisible from reading the source; both
were obvious in under a minute once actually measured.
FACTORY STATUS: 33 auto-district types across all 7 non-casino categories.
Remaining non-auto district types are either terrain/skeleton (arterial,
freeway, mountain, desert, rail, water — not real "districts") or Paolo's
bespoke gaming/casino/landmark territory (resort, strip, airbase, airport,
speedway, campus, convention, casino, etc. — NOT auto-factory per his 7/18
ruling). The non-casino district factory is essentially DONE. Next big
moves from here are probably: (a) tighten the landlocked-law residual
further (isolated single-cell landmarks with no desert path — see the 7/21
addendum), (b) build the suburb-to-suburb cosmetic connect-chance knob
(recommended, not built, from the 7/21 Vegas-urbanism research thread), or
(c) something entirely different Paolo wants — the district-factory phase
itself is winding down, ask what's next before defaulting to more districts.

## LANDLOCKED DISTRICT LAW: SEED GENERATION NOW ENFORCES IT (7/21, district-factory
## session, Paolo reviewing the valley aerial: "new rule, if there is an interior
## district not touching a street it has to be a suburb or apt complex...")
NEW LOCKED LAW (laws/BOHEMIA_ADDENDUM_LANDLOCKED_DISTRICT_LAW_7_21_26.md): a cell with
NO real street touching it (no freeway/arterial/beltway/strip neighbor) can only be
suburb-family (suburb/gated/estate; apt complex [PENDING, not built]) or bare desert —
and a landlocked suburb/apt cell must gain access by RELAYING through a same-family
neighbor's road all the way out to a real street ("the two districts' street touch").
BUILT THIS TURN, both halves, machine-gated (gates/landlocked_gate.js, registered):
- TYPE half — engine/bohemia_overmap.js `proceduralDistrict()`: a `streetAdjacent` flag
  (one tile off a real mile-arterial line) now gates every non-suburb/non-desert roll
  (park/trailer/storage/industrial/commercial). A truly interior cell short-circuits to
  DISTRICT.SUBURB. Also hoisted the `BIG` architecture-exemption set to module scope +
  exported it (was local to buildOvermap) so the gate can reuse the exact same
  "allowed to sit without touching the grid" whitelist instead of drifting a copy; added
  granary + pumpstation to it (deliberately-nudged 1x1 narrative landmarks, same class
  as the rest of BIG).
- CONNECTIVITY half — engine/bohemia_world.js: `rawStreetEdges(m,x,y)` (real, no-default
  street check, unlike neighborStreets which fakes ['S']) + `buildLandlockConnect(m)`, a
  one-time BFS (computed once per world(seed), ~9216 cells, trivial cost) that finds for
  every landlocked cell the shortest chain of SAME-FAMILY neighbors out to a real street,
  marking the connect edge on BOTH sides of every hop. `plot()` now unions real edges with
  relay edges for EVERY DISTGEN type (generalized past suburb — downtown/farm are
  multi-cell BLOBS with the identical problem one level up, and relay through the same
  machinery via `familyOf()`). Gate position is always centered (n/2) regardless of
  rotation, so two neighbors that both open toward each other land on the same tile
  offset — the roads actually meet.
KNOWN RESIDUAL (reported honestly, not hidden): isolated single-cell landmarks (school/
medical/jail/courthouse/policestation/substation/chapel/cemetery/industrial/commercial/
golf/park), each its own hand-tuned fixed rect in skeleton()/layoutFromSeed() with no
same-type neighbor to relay through, can still land landlocked. Measured ~5-6% of
landlocked cells across seeds, gate ceiling set at 12% (regression trap). Fixing each
landmark's placement individually is a separate pass through overmap.js's ~20 bespoke
rects — NEXT SESSION'S JOB if Paolo wants it tightened further.
SIDE EFFECT CAUGHT: editing bohemia_overmap.js broke CITY TAB GATE freshness (it embeds
overmap.js byte-locked, ENGINE SYNC LAW) — re-ran tools/bohemia_city_tab.py to resync
slices/BOHEMIA_CITY_CURRENT.html (NOT bohemia_city_overmap_resync.py, which only patches
the alpha's inline CITY_B64 blob and doesn't refresh the engine-md5 stamps the gate
checks — that tripped the gate's "MARRIED" check even after a resync). Whoever next
edits an engine module CITY TAB embeds: run bohemia_city_tab.py, not just the resync.
ALSO shipped this session (Paolo: "looks like shit" -> fixed -> "so how do you see this
fitting"): THE VALLEY AERIAL rebuilt from a broken 34px downsample to native tile
resolution with real intersection topology (roads read from actual neighbor
connectivity, not a coin flip) + honest reserved-placeholder tags for bespoke/unbuilt
landmark types (casino/ballpark/etc, diagonal hatch + name tag instead of a flat void) +
street color matched exactly to the canon in-district asphalt tone (#33333c). Also did
real research (Vegas/Sunbelt-specific, not Barcelona — caught and corrected mid-session)
on what real mile-grid cities put at the center vs the corners of a superblock: corners
get commercial (traffic/visibility economics, ALREADY how bohemia_overmap.js places it —
confirmed, not changed), centers get quiet residential with cul-de-sac-style low
inter-tract connectivity (informs the future "connect to all vs connect to one" cosmetic
knob — NOT built, just recommended: suburb-to-suburb interior edges should default LOW
connect chance, not high, matching real subdivision privacy/traffic patterns).
PENDING PAOLO: apartment complex district type doesn't exist yet — the landlocked law
currently only recognizes suburb/gated/estate as the residential family. Build it
whenever that's next up, and it slots into SUBURB_FAMILY (world.js) automatically.
## REUSE-FIRST LAW + THE PERIMETER WALL WIRED + ASSET ROUNDUP (7/21, same
## session, Paolo: "use these assets as much as you can before u create
## your own... present me in the slice any assets i didnt approve yet")
NEW LAW recorded: laws/BOHEMIA_ADDENDUM_ACT_ASSET_TIERS_7_21_26.md - (1)
each act has its OWN graphic tier, but placement follows NARRATIVE STATE
not chronology (a neglected corner of a later act can wear Act 1 art; a
cared-for Act 1 interior can wear a later act's tier - deliberate, never
default); (2) REUSE-FIRST: sweep an act's own corpus before cooking
anything fresh. Regenerate BOHEMIA_CANON_INDEX after any future addendum
(python3 gates/bohemia_canon_index.py - done this turn).
ACTED ON SAME TURN: swept banks/ and found banks/BOHEMIA_PERIMETER_WALL_
POOL_7_14_26 was ALREADY Paolo-approved (WB4 = his own pick, records/
BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26) and sitting completely unused -
the suburb's perimeter wall was still a flat color. tools/bohemia_city_
perimeterwall_patch.py wires the 13 approved tan tiles in, riding the same
saTex/SA_IMG machinery the street art already uses (one more pool key, same
cache-flush) - texFor AND texForKind both route the wall's structure color
through the real art now. Verified mechanically on the real surface
(window.__CITY.wallArtReady() confirms the pool decodes and serves a tile;
a visual walk-up proved harder than expected in a 96x96 sparse-suburb
valley within the session's time budget, so the probe check stood in).
Added window.__CITY.district(x,y) to the probe surface (tools/bohemia_
city_probe_district_patch.py) so future sessions can FIND a district type
instead of trial-teleporting blind - this is now the standing way to
verify anything suburb-specific in the city. Gate #CITY TAB 50 (+3: WALL_MAP
embedded, texFor/texForKind both route it, wallArtReady present).
THE ASSET ROUNDUP (Paolo's explicit ask): tools/bohemia_asset_roundup_judge.py
-> slices/BOHEMIA_ASSET_ROUNDUP_JUDGE_7_21_26.html - surfaces 258 never-
judged candidates directly relevant to the house work and already carrying
ready b64 art (no repo-crop resolution needed): WALL_CANDIDATES_POOL (43
of 47, the ones Paolo rejected as PERIMETER-only - "rejection is per class",
HOUSE is another class), ROOF_KIT_EXPANSION (33 of 36, act-1 roof family),
DOOR_EW_BANK (182 of 184, west-edge crop shown). PURITY LAW pre-filter ran
BEFORE anything reached the page (mechanical, not taste: 4 wall + 3 roof +
2 door tiles pulled for containing a purple pixel). Compact tap-to-cycle
grid (SKIP->UP->DOWN), not full cards - this is raw material, not finished
candidates. NOT included this round: WALL_SEAMLESS_SET (303) / WINDOW_SET
(83) / ROOF_SEAMLESS_SET (47) - these need resolving crops out of the
4x45MB HD_TILE_REPO parts (tools proven feasible, tested working), AND a
resolver test showed the underlying packs are a MIXED-GENRE corpus (sci-fi/
fantasy dungeon tiles - blue-lit tech panels, hazard stripes) mined from
the same broad source as the graveyarded HOUSE_FACTORY_BANK. [PENDING
Paolo: does he want that bigger, messier sweep too, or is today's scoped
batch enough for now.]
CHARSET BUG CAUGHT AND FIXED (same turn, verify-on-the-real-surface catch):
none of my three generated judge pages (house skin judge, LIFE hub, asset
roundup) declared <meta charset="utf-8">. It went unnoticed on pages using
only HTML entities/emoji (browser guessed right), but the roundup's raw
▸/▾ unicode characters rendered as mojibake (â–¸) - a real bug that would
have hit Paolo's phone too. Fixed in all three generators; NEW HOUSE RULE:
every future judge-tool generator declares charset="utf-8" as the literal
first line of its HTML, no exceptions.
Both new gates registered (bohemia_gates.py): #ASSET ROUNDUP (10 checks:
charset, sections, tap-cycle, purity-sampled, hub-linked, reproducible).
Hub (tools/bohemia_life_hub.py) now three cards: HOUSE SKIN JUDGE, UNJUDGED
ASSET ROUNDUP, THE LIVING BLOCK (dormant). Stamp: BUILD 7/21i (or later,
check the live buildstamp for the exact letter this turn shipped).

## OVERNIGHT: HOUSE SKIN FACTORY COOKED, JUDGE LIVE IN THE LIFE TAB (7/21,
## LIFE+CITY session, Paolo asleep: "do some big brain awesome shit")
THE MORNING VERDICT IS WAITING: alpha -> LIFE tab -> HOUSE SKIN JUDGE.
WHAT GOT BUILT: the suburban house-art cook that was [PENDING Paolo] since
the dungeon-crops post-mortem (see BUILDING ART CORRECTION below - this
answers it). tools/bohemia_house_art_factory.py cooks 21 painted skins at
the street pools' 44px: 6 shingle roofs (terracotta family, row courses,
lit top course per the 45/sky-lit law), 2 gravel flats, 4 plain tan stucco
walls (85/15, top-plate hairline cracks), 3 DEAD DARK windows, 3 BOARDED
windows (act-1 dead world), 3 weathered plank doors. Painted 5-step ramps
+ coherent wear blotches, never confetti; zero purple; fully deterministic
(BOH_HOUSE_OUT env override lets the gate recook to scratch and
byte-compare). Bank: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt,
law-tagged NOT canon until judged.
THE JUDGE (verdict workflow, in-context per the real-surface law):
tools/bohemia_house_skin_judge.py -> slices/BOHEMIA_HOUSE_SKIN_JUDGE_7_21_26
.html - every candidate is composed ON a mock house (roof top + front face
over dead dirt, the exact read a suburb house has in the city) next to its
raw swatch; thumbs, per-item comments, global comments, SUN MODE, export
.txt. Verified on phone metrics (390px, playwright screenshots, no
horizontal overflow - the raw chrome --screenshot lies about scrollbar
width, use playwright).
THE LIFE TAB IS A HUB NOW: slices/BOHEMIA_LIFE_CURRENT.html (the page the
alpha's LIFE tab iframes) is generated by tools/bohemia_life_hub.py and
ROUTES: HOUSE SKIN JUDGE (NEW 7/21) + THE LIVING BLOCK (dormant 7/19 demo,
kept reachable). bohemia_life_slice.py no longer clobbers CUR - the hub
owns it. One-alpha law: everything reached from inside the alpha.
GATE #HOUSE ART (gates/houseart_gate.py, 18 checks, registered): bank
versioned + law line, class coverage incl. boarded, ZERO purple, tan wall
85/15 measured on lit pixels, dead dark glass, deterministic recook
byte-identical, judge exists + shows this bank version + exports .txt +
embeds all 21, hub routes to judge + keeps the living block, and THE LOCK
THAT MATTERS: no skin id appears inside CITY_B64 - candidates CANNOT ship
into the city before Paolo rules.
ON THE VERDICT (next session's first job): approved classes graduate into
the city via a suburbs-realizeCell art patch (the marriage pattern - map
codes 2/6/9 house/garage/upper + face rows to the approved roof/wall/
window/door tiles, byte-locked in city_tab_gate); rejects go to the
graveyard with post-mortems; then volume (variants of approved shapes).
Stamp: BUILD 7/21a · HOUSE SKINS: 21 CANDIDATES IN THE LIFE TAB.

## THE CITY TAB HIJACK - POST-MORTEM (7/19, Paolo caught it: "the city
## builder that we had from the previous build... what's wrong with you")
WHAT HAPPENED: the CITY tab was NEVER an empty tab. The alpha carries the
previous build's ENTIRE streaming Las Vegas city builder embedded as
CITY_B64 (source bohemia_city_unified.html, 22MB decoded: isometric city,
the Strip, day clock, REROLL, UNDER layer, DROP IN with the character,
CITYSAVE suspend saves, prefab pool bridge, city music bridge). It boots
DYNAMICALLY on first CITY tap: the loader creates an iframe named
cityFrame only if none exists. The LIFE session saw `<div id="p-city">`
EMPTY in the static DOM, concluded the tab was unbuilt, and planted a
static iframe... NAMED cityFrame. The loader's guard found it and silently
never booted the real city. Paolo tapped CITY and got a flat colored map
instead of his city builder. REVERTED same turn: panel restored empty, the
real city verified booting again in chromium (isometric render, HUD, 0
new errors).
THE LESSON (verify-on-the-real-surface, extended): AN EMPTY DIV IS NOT AN
EMPTY TAB. Alpha panels boot dynamically on tap. Before claiming ANY alpha
surface, open the tab on the REAL alpha and watch what it does - and grep
the alpha for the panel id + B64 payloads first. MACHINE LOCK: city_tab_
gate now asserts CITY_B64 present, the dynamic boot guard intact, NO
static cityFrame ever again, and the aerial map page wired nowhere.
STATUS AFTER REVERT: the aerial map page (slices/BOHEMIA_CITY_CURRENT.html,
skeleton-as-itself + city-builder verbs) is a DORMANT STANDALONE, linked
nowhere; engine/bohemia_cityedit.js (delta verbs, skeleton sacred) stays
gated + dormant - the delta design still fits whatever save system the
real city grows. THE MARRIAGE - EXECUTED (7/20, this session, after recon proved it safe):
the embedded city builder carried a STALE 7/5-ERA FORK of bohemia_overmap
inside CITY_B64 (a second module body hidden in base64 where the sync gate
could not see - the exact rot the ENGINE SYNC LAW exists for). The city was
still rerolling the fragmented pre-7/18 streets Paolo killed. Recon proved
drop-in safety BEFORE touching anything: identical API line (11 exports),
identical 77-district enum, identical IIFE wrapper, every om.* field the
page reads exists in canon. tools/bohemia_city_overmap_resync.py decodes
CITY_B64, replaces the fork with the CANON body VERBATIM, re-encodes,
idempotent - rerun it whenever the overworld session evolves the streets
(city_tab_gate #17-checks now decodes the payload every run and goes RED if
the canon body is missing: the MARRIAGE LOCK). Verified on the real
surface: city boots, renders identically (isometric, Strip, HUD, DROP IN),
its live BohemiaOvermap now IS canon (street counts match canon exactly;
official street gate green). SAVE NOTE: suspend saves carry a seed; a save
made on fork streets resumes with the world re-laid canon around the
player - the world REPAIRED, not reset (flagged, not hidden).
STREET LEVEL WEARS THE REAL ART (7/20, Paolo furious and right: "WE
ACTUALLY MADE STREETS BEFORE THE SESSIONS WENT TO CODE"): two root causes
found and killed the same day. (1) THE TILE BUFFET (an old tile-judging
experiment) shipped with scatter:true DEFAULT, blanketing the whole street
level in banned confetti - his screenshot was the verdict; scatter now
defaults false, gate-locked, buffet button remains for deliberate judging.
(2) Under it the ground was PROCEDURAL GRAY while the APPROVED street art
(banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26: 18 weathered asphalt, 36
sidewalk, washed-yellow medians, 30-yr law) sat unused. tools/bohemia_city_
streetart_patch.py embeds the pools (44px -> 16px TPX) and patches texFor:
road colors -> real asphalt, sidewalk color -> real sidewalk, shoulders ->
certified desert, center-line cells -> median art WITH orientation
(bank tiles authored horizontal, rot90 vertical, neighbors decide);
caches flush when art decodes. Verified DROP IN: real weathered asphalt +
washed yellow line under the player, 0 errors. Gate #CITY TAB now 26
checks (buffet lock + SA_TILES + texFor + median orientation). STREET WIDTHS + INTERSECTIONS LANDED (7/20 later): CANON XSEC (the
blockgen width models: arterial 3 lanes/dir + median + sidewalks, strip 4
+ wide median, freeway no sidewalks, LANE_W=2, white dashes/yellow median
per LINE COLOR) via tools/bohemia_city_streetwidth_patch.py; V12 XING
(clean box, crosswalks at box edges with approved cross art both
orientations, median/dashes stop at the crossing) via tools/bohemia_city_
intersections_patch.py. __CITY.human(x,y) teleport probe added - it caught
that TILE_FINE=32 (not 128): always compute fine coords as tile*32.
Verified at a live 4-way (color probe + screenshot). Gate #CITY TAB 33.
POCKETS LANDED (7/20 latest): solid pocket-boundary lines at approaches
(approved pocket_line art both orientations) via tools/bohemia_city_
pockets_patch.py; the live probe caught a fractional-rel bug BEFORE ship
(band offsets make rel always x.5 - equality checks never fire; use
divider-band ranges). ARROW SCOPE CALL: bold arrows at 16px would be
illegible mush (the killed crime) - arrows wait for a zoom-true multi-cell
treatment. Gate #CITY TAB 38.
LAMP POSTS STAND (7/20 latest): the blessed V11 dark bodies
(banks/BOHEMIA_LAMP_DARK_VARIANTS) on the sidewalks per the STAGGERED LAW
(every 8 along, alternating sides, curb row, pure f(global coords) =
regen-safe), DEAD IS DEFAULT, live circuits get the rgb-only head glow at
night (the blessed V11 wired pattern, no verdict owed). tools/bohemia_
city_lampposts_patch.py. Gate #CITY TAB 40.
CANON SUBURBS IN THE CITY (7/20 latest, Paolo furious-and-right: "we
have SUBURBS for this reason and REAL HOUSE SIZES"): residential tiles now
generate THE BLOCK (engine/bohemia_suburb.js, byte-locked verbatim in the
city), street-gated to real road neighbors like the world model, 128->32
downsample with presence-priority (walls/gates survive; houses keep true
~14x9m ratios). Ground is DEAD DIRT - the act-1 green-lawn violation is
dead. Freestyle 7/6 prefabs are DEAD for residential.
BUILDING ART CORRECTION (same turn): the 7/20z3 house-stamp crops were
pulled from suburb skins - LOOKING at the crops showed the HOUSE FACTORY
BANK v1 stamps are assembled from DUNGEON-INDUSTRIAL corpus packs (pipes/
vents as roofs, stone walls, flower boxes with LIVING plants). It was an
assembly-mechanism proof, never judged house art. Structures wear the
APPROVED suburb-judge palette instead. [PENDING Paolo: a real suburban
house-art cook (roof/wall/door/window skins for top-down homes) + verdict
cycle - the factory pattern; crops stay embedded but dormant.]
SUBURB v2 - TRUE SCALE (7/20 latest, Paolo: "pull me a picture of a
suburb district I approved" - the receipts run): the 4:1 downsample had
MUSHED his block; pulled the verdict record (THE BLOCK, 7/18, 23 homes)
and rendered the canonical generator as the proof picture. Fix: a 96m
canon block now spans a 4x4 TILE GROUP at FULL 1:1 resolution (city fine
cells ARE canon 0.75m cells - zero downsample); each residential tile
windows its 32x32 quadrant; group street edges from real road neighbors;
group cache drops on reroll (regen lock). Verified standing inside the
block: 14m houses at true scale, facades, driveways, interior streets.
Both pictures sent to Paolo (approved render vs live city).
NEXT: commercial/civic canon layouts into the city (bohemia_commercial etc.,
same marriage), house-art cook for Paolo's thumbs, doors per building,
arrows at zoom-true scale.
THE LIGHTS AT NIGHT - IN THE CITY (7/20, Paolo: "we spent so much time on
the streets, even the lights at night - when do I see that in the city"):
tools/bohemia_city_lights_patch.py marries the canon powergrid
(engine/bohemia_powergrid.js, CLUSTERED POWER 12%, LIGHT=TERRITORY) into
the city builder the same way the streets were married. POWER=powerMap(om,
seed) rebuilt at all 3 world-rebuild hooks (boot/reroll/save-restore). At
night every LIVE arterial cell glows lamp-amber (~240 cells at seed 2026);
dead circuits stay dark, freeways stay dark, the Strip keeps its own glow.
TWO LESSONS RE-EARNED ON THE WAY (both banked in the tool + gate): (1) the
OCCLUSION LAW again - lamps drawn in the cell pass got painted over by
neighbor tiles/prisms AND dimmed by the end-of-frame night wash; fix =
lamps QUEUE during the pass and draw AFTER the wash (light cuts the dark).
(2) the city page is all let/const scope - invisible to gates and probes;
the patch now installs window.__CITY (read-only probe surface: power/
night/state/isoAt/rerender) so the REAL surface is interrogable forever.
Gate #CITY TAB now 22 checks (powergrid body byte-present, 3 rebuild
hooks, lamp-pass-after-wash, probe present). Verified: whole-map night
view shows amber circuit clusters readable as territory. LIGHT PIERCES
THE FOG: lamps draw full-alpha through fog-of-war - distant light is
visible truth, per the patrol law ("read who owns a block from a rooftop").

## SESSION SCOPE AMENDED: LIFE + CITY SURFACE (Paolo 7/19: "add an additional
## title to this chat, like life plus tiles")
The LIFE session also owns the CITY TAB SURFACE now. Division per ONE SYSTEM
ONE SESSION: the overworld session keeps the GENERATORS (bohemia_overmap /
world / districts); this session renders them READ-ONLY into the CITY tab,
exactly like it consumes the clothing factory's wardrobe. DONE SAME TURN:
the CITY tab (empty div since birth) now shows the whole generated Vegas
live - tools/bohemia_city_tab.py -> slices/BOHEMIA_CITY_CURRENT.html (stable
URL, lazy iframe): mile grid, 215 beltway, I-15/95, rail, Lake Mead,
mountain ring drawn as themselves, every buildable district as DESERT until
grown on (the blessed 7/18 aerial proof's exact palette + rules); drag pan,
pinch/wheel zoom, tap a plot for its district. Gate #CITY TAB (9 checks):
embedded overmap BYTE-LOCKED to the canon engine body (overworld reshapes
streets -> gate red until the page is rebuilt), skeleton law replayed
against the live enum, no empty-tab regression. Verified 390px chromium.
CITY-BUILDER VERBS SHIPPED (7/19 later, v2): engine/bohemia_cityedit.js -
DEMOLISH a buildable plot to the desert underneath, BUILD a canon district
onto empty desert, THE SKELETON IS SACRED (streets/freeway/rail/water/
mountains untouchable, machine-enforced). Edits are a serializable DELTA
over the generator, device-local (localStorage) until the save system;
RESET restores the generated valley. One canonical category body shared by
render + verbs. Gates #CITY EDIT (13) + #CITY TAB (11, both embedded
modules byte-locked) BOTH registered in bohemia_gates.py (the tab gate had
been left unregistered a turn - caught, fixed). Verified on the real
surface: demolish/build/persist-across-reload/skeleton-refuses, 0 errors.
NEXT for the CITY surface (in order, mine): (a) 4-lot big buildings on the
delta (Paolo's plan), (b) zoom a region into the walkable street/desert
bakes, (c) LIFE's census layered on the map (population per district once
the die-off dial is ruled). Costs/unlocks/what-can-build-where: [PENDING
Paolo].

## LIFE PARKED DORMANT (7/19, Paolo, same day it opened - SEQUENCING RULING)
Paolo saw the LIFE tab and ruled the sequencing, distilled from his words:
(1) TOO EARLY TO SURFACE, not too early to build - "I'm glad you have the
plumbing done" but judging 20 gray skeletons on semantic tiles violates his
standing don't-make-me-walk-it-until-almost-complete law. NO VERDICT OWED on
the LIFE tab; nothing to thumb. The tab stays in the menu un-judged (he may
ask to hide it).
(2) THE ECONOMY CANNOT BE TUNED AGAINST A WORLD THAT DOESN'T EXIST - "we
haven't even put a resort casino... all we really have is one park, one
suburb, one corner store, one hospital." The gates prove the math behaves;
they cannot prove the numbers are TRUE until the valley is built (casinos,
Strip, his placed canon). DO NOT tune economy constants or surface economy
numbers at Paolo until the world is built enough that they come FROM
somewhere.
(3) THE ORDER: build the world out first. LIFE + economy machinery sleeps,
loses nothing, and reads the real world when it exists (it already reads
world() - that was the design). When LIFE resurfaces to Paolo it must wear
the REAL art: actual tiles, the real dressed rig, ~90% less on-screen text.
The section below stays as the record of what was built and gated.
TWO CORRECTIONS SAME DAY (Paolo, fixed + gated the same turn, LIFE gate now
20 checks): (1) VACANCY - not every house has inhabitants; most homes are
abandoned shells. OCCUPIED_RATE dial in bohemia_agents, ships 0.30 as a
FLAGGED PLACEHOLDER ([PENDING Paolo: the real die-off number for the map]).
(2) STAGGER - no more lockstep: four life archetypes (worker staggered
shifts 05:30-09:00 / scav own clock / keeper barely leaves / watch out at
dusk), wake times spread over hours. Slice regenerated: 14 people in 6 of
23 houses, economy panel REMOVED from the surface (parked), text cut way
down. Verified in chromium, 0 errors.
RUNGS 1-2 BUILT DORMANT (7/19 late, "do what you have to do next"): the
TWO-PLANE SIM off the research bank, pure plumbing, zero surface. Population
layer (Zomboid): censusForPlot/sampleValley in bohemia_agents - the valley
holds people as numbers, same hashes as materialization so census ===
bodies EXACTLY. Offline plane (STALKER): whereAt/offlineSummary = the far
sim, zero stepping, gated cheap + gated to AGREE with the online bubble.
Gate #POPULATION (8 checks) in bohemia_gates.py. WHAT COMES AFTER for LIFE,
in order, all waiting: rung 3 smart advertisements (roled rooms/props
advertise acts - needs the world's objects to exist), rung 4 bounded
deviation + witness memory (quest fuel); resurfacing LIFE to Paolo waits on
REAL ART (tiles + dressed rig at world scale); factions acting waits on
Paolo's tables (FACTION_ASSIGN/DRESS/ECONOMY); economy tuning waits on the
built world. The LIFE lane is now built to the edge of what the world's
readiness allows.
RUNGS 3 + 4a BUILT DORMANT (7/19 later, "do what you have to do next"):
ROOM ADVERTISEMENTS (Sims pattern) - rooms advertise acts, at-home agents
live through the house across the day (kitchen at meals, living evenings,
own bed at night, occupants never stack); sim.homeSpots() feeds any future
render; LIFE gate 20 -> 24 checks. WITNESS MEMORY (SoD pattern) -
engine/bohemia_memory.js + gate #MEMORY (9 checks): ring-buffer minds,
familiarity slows decay, lastSeenAcross answers "when did anyone last see
H3-2" - THE SEED OF THE QUESTBOOK'S MISSING-PERSONS ORGAN (Q133/Q134/Q138).
RUNG 4b BUILT DORMANT (7/19 latest): BOUNDED DEVIATION - deviate() with
mechanism verbs (goto/flee/stay_home), expiry REQUIRED, 20% cap, re-
convergence to schedule, offline plane stays the plan. Gate #DEVIATION
(11 checks). The Radiant lesson is now machine law.
THE LIFE LANE IS COMPLETE TO ITS DESIGNED EDGE. Every remaining item is
blocked on its proper unlock: RESURFACING needs real art (tiles + dressed
rig at world scale - the art/world sessions' rung, LIFE's engine is ready
to receive it); FACTIONS ACTING needs Paolo's tables (FACTION_ASSIGN /
DRESS / ECONOMY); NAMES + THE MONEY are Paolo's; ECONOMY TUNING needs the
built world; DEVIATION TRIGGERS need events (combat/quests). A future LIFE
session's standing default: keep gates green, re-bank the wardrobe when
DRESS goes red, and wait for the unlock - do NOT invent content to fill
the silence.

## LIFE OPENED - THE VALLEY HAS PEOPLE (7/19, LIFE session, branch claude/bohemia-life-session-9fbnyj)
The LIFE ladder from the world-model roadmap is BUILT and in the alpha. Three
factories, each gated same turn (gates 21-23 in bohemia_gates.py: LIFE 14 /
DRESS 9 / ECONOMY 13 checks): engine/bohemia_agents.js (typed agent =
{home room, job, 1440-min schedule} placed BY world() - agentsForPlot;
households mean ~2.2; jobs read off the real overmap within radius 3;
block sim with OCCUPANCY + BFS walk, one world-turn = one world-minute),
engine/bohemia_dress.js (outfits from the canon wardrobe; the 78 canon
garments extracted READ-ONLY from the clothing factory's GARMENTS array into
banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt by tools/bohemia_wardrobe_extract.py;
DRESS gate freshness-checks bank vs the alpha's live canon count - wardrobe
grows, gate goes red, rerun extractor), engine/bohemia_economy.js (grounded
scarcity: 4L/day desert water, 2000kcal rations, barter in salvage-kg,
hyperbolic siege pricing capped 40x, conservation gated; commodity money
[PENDING Paolo]). ALL assignment tables EMPTY per MECHANISM-MINE:
FACTION_ASSIGN / FACTION_DRESS / FACTION_ECONOMY + agent names are H3-2
designations until Paolo rules. Full spec: laws/BOHEMIA_LIFE_SPEC_7_19_26.md.
THE SURFACE (judge, [PENDING Paolo verdict]): a new LIFE tab in the alpha
(lazy iframe -> slices/BOHEMIA_LIFE_CURRENT.html, stable URL, same pattern as
SLICE) shows the approved block ALIVE: 47 residents sleep at night, ration at
dawn, the employed walk out the gate to the commercial block east, scavengers
sweep with a midday heat shelter, dusk return. WATCH = a day in 12 min on the
beat / STEP = i-move-you-move; tap-to-inspect any resident (schedule, outfit,
job); block ledger HUD (water/food days-left + prices); thumbs + comments +
export .txt. Verified on the real surface in 390px chromium (alpha boots,
LIFE tab loads, 0 errors) + a real-surface FIND banked in the law: a body on
the gate's single-file approach BLOCKADES the commute (player spawn moved off
the choke; the emergent blockade kept - it obeys the laws).
NEXT for LIFE (unblocked): agents at world scale (many blocks, the commute
actually crossing cells), patrol integration (factions acting once Paolo
fills the tables), needs feeding back (hunger/thirst driving behavior),
economy trade BETWEEN blocks. PENDING PAOLO: the LIFE verdict, the four empty
tables, the commodity money.

## WHERE WE ARE
The repo is born, whole, and on main. 534/534 seed files verified. The layout:
/engine /gates /laws /banks /slices /tools /records /questbook /quests
/archive, spine docs at root. Push access works; everything commits to main
the turn it passes the gates.

ALL GATES GREEN: 16 gates (QUESTBOOK joined 7/17), ~35s.
  python3 gates/bohemia_gates.py          (everything)
  python3 gates/bohemia_gates.py --fast   (skips the two pixel sweeps)

DAY ONE IN ONE BREATH (details + lessons in STATE_OF_PLAY 7/17):
- V11 slice track CLEARED: lamps on (powergrid-ruled dark), patrol wired
  (empty roster IS the law), approved marking paint on the ground. Slice gate
  13 -> 33 checks.
- Engine: blockgen places turn pockets (cell.mk, certified vocabulary); LINE
  COLOR gate grew 6 checks.
- Graphics: a FULL verdict cycle in one day — arrows cooked, all 84 markings
  approved in chat, volume banked (224 tiles), act-1 art_gaps EMPTY. Wall
  batch 2: WB4 into perimeter pool v2; the 47 await other wall classes
  (REJECTION IS PER CLASS, taxonomy addendum 7/17).
- Questbook: batches 8-12, files #139-152, the 7/16 mining queue CLOSED,
  68 of >90. Gate #16 enforces the format; the searchable archive is back
  and freshness-gated.

## THE WORLD MODEL — THE STRUCTURAL SPINE (7/18, Paolo: "step back... really
## think about what structurally we should be building")
Researched the games closest to our ambition (Shadows of Doubt = enterable
simulated procgen city; Caves of Qud/Dwarf Fortress = simulated agents +
factions + history; Against the Storm = city-builder roguelite that beats
stagnation via run structure). THE READ: we built a beautiful STAGE, not yet the
play. THE SPINE to build: ONE canonical WORLD MODEL — an addressable hierarchy
valley -> district -> plot -> building -> floor -> ROOM -> tile — that the
bakes/combat/city-builder/sim all read and write, instead of today's scattered
representations. Three ladders climb it: ZOOM (enterable top-to-bottom), LIFE
(agents/economy/factions), LOOP (the roguelite run — [PENDING Paolo, his call]).
Full plan: laws/BOHEMIA_WORLD_MODEL_ROADMAP_7_18_26.md.
DONE THIS TURN — the bottom ZOOM rung (the enterable one): engine/bohemia_
floorplan.js. Given a footprint + zone + seed it BSP-splits into rooms, walls
the gaps, carves a door graph that GUARANTEES every room is reachable, cuts a
street entrance, and zones rooms (public near the door, private/service back,
the Shadows-of-Doubt model). 8 zones (residential/retail/office/civic/
institutional/warehouse/landmark/default). Gate #20 gates/floorplan_gate.js:
every room reachable, no overlap, entrance exists, roled, deterministic. Proof:
slices/BOHEMIA_FLOORPLAN_PROOF_7_18_26.png (verified by eye, reads as real
floor plans).
ALSO DONE — THE UNIFIER (the spine itself): engine/bohemia_world.js. world(seed)
.at(x,y) -> overmap cell; .plot(x,y) -> block grid + building footprints;
.plot(x,y).building(i).floorplan() -> that building's interior rooms. COMPOSES
overmap/bridge/blockgen/floorplan, lazy + deterministic (addressing one room
never builds the valley). Gate #21 gates/world_gate.js: 676 plots resolve, no
throws, every exposed building yields a fully-reachable interior, deterministic.
Proof: slices/BOHEMIA_WORLD_ZOOM_PROOF_7_18_26.png (ONE image: valley -> district
-> plot -> building -> rooms, all through the one API). Note: today only the
built-lot archetypes expose buildings (38/676 sampled); suburb houses +
commercial storefronts still owe footprints.
ALSO DONE — THE SEAMLESS ZOOM (first cut, playable): slices/BOHEMIA_ENTER_SLICE
_7_18_26.html (tools/bohemia_enter_slice.py). Spawn outside a building on a real
plot, walk to the door (arrows / on-screen d-pad), step INSIDE the exact rooms
world().plot().building().floorplan() generated, walk back out. Self-contained
(concatenates overmap/bridge/blockgen/floorplan/world + a compact walk loop),
verified in a 390px chromium: enter + exit, 0 console errors. Wired into the
alpha SLICE tab organically (SLICES_MANIFEST current='enter', regenerated
BOHEMIA_CURRENT_SLICE.html) — ONE-ALPHA safe, the 31MB alpha never changed. Made
world.js browser-robust (typeof-guarded module resolution) for embedding.
SUBURB INTERIOR — NOW A JUDGING TOOL IN THE SLICE MENU (Paolo 7/18: "if there's
anything you want me to judge... make an interactive in the slice menu"). The
suburb interior (loops/culs) is his under MAP LAW and it's THE unblock for homes
-> LIFE. tools/bohemia_suburb_judge.py -> slices/BOHEMIA_SUBURB_JUDGE_7_18_26.html:
3 candidate layouts (THE LOOP / CUL-DE-SACS / GARDEN CURVE) generated from the
anatomy (curvilinear, loops+culs, walled), thumbs + per-style + global comments,
SUN MODE, RESEED, export .txt (verdict workflow). Wired into the SLICE tab
(manifest current='suburb'). STATUS: [PENDING Paolo verdict]. On approval, the
chosen generator graduates into bohemia_plotgen (suburb houses), homes exist,
LIFE opens.
ITERATED (Paolo verdicts, same session): (1) "all houses in Vegas have proper
driveways on the street to the garage" -> every home rebuilt as street->driveway
->front garage->body. (2) MODULARITY LAW (Paolo: "modular to fit into a 1x2 or
2x2... if you can't easily snap to the other suburbs I don't want it") -> the
generator is now CLUSTER-AWARE: genSub(seed,style,cw,ch) fills a cw x ch union as
ONE connected neighborhood; the tool shows each style at 1x1 AND 2x2. Generator
extracted to tools/bohemia_suburb_gen.js (candidate; the judge tool embeds it AND
the gate tests it). Law: laws/BOHEMIA_ADDENDUM_MODULARITY_LAW_7_18_26.md. Gate #22
gates/suburb_modular_gate.js: every style connected + homed + garaged at 1x1/1x2/
2x1/2x2, deterministic. RESEARCH folded into the law: LV is ~62% single-family /
~32-38% multifamily BY UNITS, but by LAND AREA suburbs are ~85-90% (apartments
4-6x denser) -> ~1 apartment cell per ~7-9 suburb cells (tunable, [PENDING Paolo]).
NEW WORKFLOW LAW (Paolo 7/18): anything needing his judgment/feedback MUST be an
interactive in the alpha SLICE menu — not a chat proof image. Stop sending PNG
proofs as pseudo-verdicts.
NEXT: (a) [PENDING Paolo] the suburb verdict (unblocks homes->LIFE) + he rules
LOOP; (b) mine, unblocked: overmap-scale walk (streets between plots) + real art
in the enter slice, then start LIFE once homes exist.

## CITY-BUILDER FOUNDATION (7/18, Paolo scoping the city start)
Paolo's plan: put streets into the CITY tab now, empty lots = DESERT until
built; in citybuilder you can delete/blow up a plot down to the desert
underneath; a big building can span 4 lots. FILES CHECKED — the canon
already supports ALL of it:
- CELL-IS-PLOT (laws/...CELL_IS_PLOT_WALLED_SUBURBS): each overmap cell IS
  a plot, wall to wall (128x128 fine tiles = 96m x 96m, CELL_M 0.75).
  Commercial = parking+storefront, suburb = walled tract, streets = the
  connective tissue.
- THREE-LAYER TILE SYSTEM (laws/...GRID_UNIT_DESIGN): GROUND / STRUCTURE /
  DECAL per cell. Buildings write STRUCTURE over GROUND; DELETE a building
  -> the GROUND (desert) shows. Paolo's delete-to-desert mechanic + 4-lot
  building = 4 plots IS this system, already designed. Cells group 16x16
  into cached chunks; tile replacement = write layer + dirty-rect redraw.
- THE FREEWAY IS ALREADY LOCKED (laws/...VEGAS_GEOGRAPHY, 7/5/26): the "C"
  = 215 beltway (rounded rect hugging the valley rim), the "X" = I-15
  (SW-NE by the Strip) + US-95 crossing at the Spaghetti Bowl, a near-
  perfect MILE GRID of surface arterials under them, 3 exit highways,
  mountain passes. So "lock the freeway" is DONE; the city skeleton is
  canon. (Suburbs are CURVILINEAR loops/culs, walled, few entries.)
- DESERT CONFETTI is a NAMED BANNED crime (per-cell shuffle == checkerboard);
  the perfect desert must be CONTINUOUS, not per-cell random.
BIG DESERT LOT PERFECTED (the GROUND under the whole city): tools/bohemia_
desert_lot.py -> slices/BOHEMIA_DESERT_LOT_PROOF_7_18_26.png. Anti-confetti:
one seamless cropped sand base + multi-octave value noise for tone (spans
the parcel, no grid) + fine grain + sparse whole-parcel scatter (tan
pebbles, dry-wash hairlines). 28x28 cells (1232px), deterministic, zero
purple. Paolo BLESSED it ("really impressed, continue moving on") -> CITY
STARTED.
THE CITY MAP RENDERS (7/18): tools/bohemia_city_map.py -> slices/BOHEMIA_
CITY_MAP_PROOF_7_18_26.png — the whole 96x96 generated Vegas from above.
The overmap generator already lays the canon: 2448 arterial cells = the
mile grid, 1011 freeway (215 beltway + I-15/95), rail, Lake Mead (water),
the mountain ring, and 80+ landmark districts. Paolo's rule applied: only
the SKELETON draws as itself (streets/freeway/rail/water/mountain); every
BUILDABLE district (suburb/commercial/estate/resort/casino/strip/downtown
/...) renders as DESERT LOT until grown on. This is the CITY tab's base.
STREETS MADE WHOLE (7/18, Paolo TWO verdicts on the aerial map: first
"there should really be no breaking in any of the street layouts... unless
it is the strip and its casinos"; then, seeing it still fragmented, "look
at all these streets that are not connected to each other. That's not how
it's gonna be"). THREE root causes, all fixed in engine/bohemia_overmap.js,
gate is gates/street_connectivity_gate.js (STREET CONNECT, 3 checks now):
  (1) the old `half` truncation let extra local streets dead-end mid-block
      -> removed; every surface street runs arterial-to-arterial.
  (2) collectors were PER-BLOCK (each mile block hashed its own offset, so
      adjacent blocks' collectors sat a cell apart and never met) -> now
      PER-STRIP: one column-pick per mile-column, one row-pick per mile-row,
      so every collector runs the full unbroken length of the valley. The
      per-block "extra local street" is gone.
  (3) DEAD-END PRUNE heals stubs into empty lots, but left orphan arterial
      fragments BOXED IN by real terminators (estate/dam/jail/rail/water/
      mountain/edge) -> new STREET ISLAND PRUNE: label road components, keep
      the LARGEST, demote every orphan arterial in any other component to
      desert. Only arterials pruned; freeway/strip/downtown stay put.
  (4) MONUMENTS WERE BREAKING STREETS (Paolo circled the map again: "even
      monuments would just be in their big ass plots not breaking any city
      streets"). ROOT CAUSE: in skeleton() the landmark rects are stamped
      BEFORE the arterial/collector lines, so any soft landmark overlapping a
      street cell ERASED it -> a stub. FIX: GRID RE-ASSERT post-pass punches the
      full street predicate (mile arterials + per-strip collectors) back through
      every SOFT landmark; only BIG architecture may break the grid. BIG = real
      physical masses + huge installations + the blessed Strip/casino megablocks
      (the set lives in engine + gate, mirrored). Streets 2258 -> 2335. Dead-end
      prune rewritten: a street ends ONLY at road/BIG/edge; true stubs 153 -> 0.
Gate (STREET CONNECT, 3 checks): 0 stubs into fabric, ONE connected grid (flood-
fill, 0 islands), mile grid intact (>=2000). Seed 12345: 0 breaks, 0 islands,
2335 arterials. Map re-rendered clean + a zoom of the circled region verified
(monuments sit in plots, streets route around them). NOTE: (16,3) engine test
repointed to (23,18) — the old sample was a legit orphan the prune removed.
DOWNSTREAM (expected): +77 arterials re-rolled the power grid's 12%-live
lottery, relighting one V11 lamp block. The V11 lamp factory's lit path (never
finished) is now WIRED: a live cell shows the approved lamp body + a runtime
amber head-glow (rgb-only, per the light law, no new baked art, no verdict
owed). Verified in chromium (3 lit / 8 dead, 0 errors). Robust to any future
power reshuffle from map edits.
DISTRICT REGISTRY BORN (7/18, Paolo: "do you have all the info of all the
types of buildings... for the procedural generation landmarks"): the info was
scattered across VEGAS_GEOGRAPHY (748 lines) + code comments, 10 types had NO
write-up. Now ONE catalog: laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md, GENERATED
by tools/bohemia_district_registry.py (render status read LIVE from the bridge,
can't drift). 77 types: 9 BAKES (visible in a slice now), 8 RECIPE (grid exists,
art pending), 60 PENDING (placed on the map, fine-layer [PENDING Paolo] per
MECHANISM-MINE/CONTENTS-PAOLO'S). Gate #19 gates/district_registry_gate.js:
every enum type MUST have a registry row + count must match — a new district
can never go uncatalogued again.
PROCEDURAL DISTRICTS (7/18, Paolo ruled the 60 pending: "those can be randomly
generated throughout the map... this is a procedural generated world game"). So
they are NOT hand-authored — every district generates from a build ARCHETYPE.
engine/bohemia_blockgen.js genBuiltLot + the ARCHETYPE map in bohemia_overmap_
bridge.js: ~9 rules (civic/bigbox/institutional/industrial/utility/landmark/
green/water/rail/extraction) cover all landmark types; the bridge no longer
returns null (default -> builtlot). estate->residential, interchange->freeway.
Registry now 10 BAKES / 67 RECIPE / 0 PENDING. Proof: slices/BOHEMIA_BUILTLOT_
PROOF_7_18_26.png (one lot per archetype, verified by eye, distinct + readable).
Law: laws/BOHEMIA_ADDENDUM_PROCEDURAL_DISTRICTS_7_18_26.md. REFINES MECHANISM/
CONTENTS: generic building footprints are procedural; only true game-lore
(Amalgamation, purple, faction ownership, what SPAWNS) stays reserved.
SYNC COUPLING (bit me this turn): blockgen + ombridge are INLINED into the
graphics core (bohemia_engine_graphics) — editing either standalone requires
re-inlining + bundle resync (scratchpad reinline.py / resync_bundle.py pattern);
ombridge is now DECLARED in bohemia_sync_canon.txt. OWED next: art pools per
archetype (building/roof/signage sprites) so the RECIPE rows flip to BAKES.
NEXT for the city: (a) mark/zoom the landmarks (Strip, Sphere, Luxor, dam
— all in overmap.layout), (b) a detail bake where you zoom a region to
walkable streets + desert lots (compose from the street/intersection/
desert bakes), (c) wire the CITY tab to this map (alpha edit, ONE-ALPHA).

## IN FLIGHT (resume here)
-28. CROUCH-AIM: PISTOL + RIFLE FROM COVER (7/20, latest, animation chat):
   Paolo's ask (request sheet 2, records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_
   7_20_26.txt): the crouch reads its aim now. Two clips, batch #14, same
   convention as deadeye -- a phase-swept +-63deg arc, 9 static angles baked
   via the same CSPRITE_OFFS the needle uses. crouch-aim-1h: pistol, body
   low, off-hand braced on the stone (take-cover's own brace reused).
   crouch-aim-2h: rifle shouldered two-handed from the crouch, same sweep.
   TURNED OUT ALREADY FULLY WIRED: the combat session's own V29 (visible
   only once this merge pulled their real code, not just their handoff
   text) had already baked a guarded `_cclip` picker ("1h preferred, 2h
   when the long gun ships") and a live consumer (crouched dial fire swaps
   the standing deadeye needle for the nearest-offset crouch sweep the
   moment you're tucked near stone, not popped out) -- all keyed off a
   single out.dirs[d].caim field. My first pass duplicated this as
   separate caim1h/caim2h fields before discovering their hook; reverted
   that duplication once found, so the merged result is exactly their
   already-shipped V29 machinery plus the two new clips it was waiting on
   -- zero new wiring code needed, and it took effect the moment the clips
   existed. NOTE for whoever picks up combat next: their OWN request sheet
   (records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_7_20_26.txt, their half of a
   collided filename resolved this same merge -- kept both halves) also
   flags a ROUND 2B ask, crawl-dying (a downed man dragging himself toward
   a downed friend, V30's crawl-positioning already runs, only the visual
   is missing) -- not built this turn, explicitly out of scope for what
   Paolo asked me directly, but ready to pick up next. Also caught + fixed
   a real gap from the prior faction-colors ship: CAND_BEATS never actually
   got the crouch-aim entries that turn (a python script double-attempt
   silently dropped half the edit); fixed here, plus a missing gunTA stub
   in the gate's synthetic rig. Verified: 9x8 contact sheet (0 render
   errors, crouch stays compressed every facing, 1h brace and 2h two-hand
   grip both read distinctly). Gate: combat_anim_gate.js 74->88 (tests the
   clips' own mechanics; the V29 wiring is combat's own gate's territory).
   Stamp: BUILD 7/22g.
-26. COMBAT v35: CAMERA TIGHTENS, REAL COVER, DIAL-BY-EXPOSURE, LAST-MAN-
   ONLY SURRENDER (7/21, combat session, branch claude/bohemia-combat-
   session-ni978x): Paolo sent one dense diagnostic message covering six
   things. FOUR WERE REAL BUGS, root-caused fresh (not re-guessed off the
   prior "fix"): (1) camera wouldn't tighten as the fight thinned -- the
   auto-frame fit distance was still measuring dead/downed/broken bodies,
   fixed to only measure ACTIVE fighters; verified mdOld=25 (buggy, reading
   a far corpse) vs mdNew=5 (correct, the one live fighter) on the same
   state. (2) camera fought the killshot cinematic's own zoom -- the auto-
   frame easing now freezes entirely while G.ks (killcam) is active. (3)
   auto-targeting still felt sticky toward whatever was tapped -- root
   cause #3 under this one symptom this session (threat-ladder formula v28,
   reach/windup blindness v33, and now this: chip/field taps were locking
   G.selTarget even in AUTO mode); taps now only lock a manual pick when
   G.targetMode==='manual'. (4) enemies read as covered while crouched
   behind nothing -- pillarBetweenMe and nearPillar could each be satisfied
   by a DIFFERENT pillar; now realCoverPillar requires ONE pillar to
   satisfy both checks together.
   TWO NEW MECHANICS, both his asks: dial difficulty now scales with
   target exposure (G.pkgDiff +1 if covered, -1 if exposed, clamped 0-4);
   and NERVE rewritten so only the last enemy standing can surrender --
   everyone else who breaks while their side still fights FLEES instead
   (runs away, doesn't drop the gun), elites break at half rate. Faction/
   rank slider on break odds explicitly [PENDING Paolo, his framing: "on a
   slider, no one surrenders or more people do"].
   TWO NON-BUGS, explained not coded: the casino ledger's "100% hits" was
   already counting body hits as hits per his own stated definition of
   accuracy (any hit, not just killshots) -- confirmed correct, not
   touched. Grit shots re-confirmed in plain text: a miss spends a banked
   grit shot instead of ending your turn, dial reopens same target.
   "Falling before the bullets hit" should read as fixed by the killcam-
   freeze (fix #2) but wasn't independently re-tested visually -- tell him
   to flag it again if it's still off.
   HIS FACE QUESTION ("wtf is on my face, is this the battle scar") --
   answered plain: it's the pre-existing addWound() wound-marking system
   (predates this session, unrelated to this patch), not a new scar
   system. He does NOT want it expanded/changed right now -- a real scar
   system is a separate future project elsewhere, not combat-session scope.
   Verified via Playwright evaluate() probes against the live decoded
   alpha (not screenshots): dial-by-cover {"pkgCovered":2,"pkgExposed":0,
   "harderWhenCovered":true}; last-man-only {"b_broken":false,
   "b_fleeing":true,"d_broken":true,"d_fleeing":false} (self-correcting
   cascade -- whoever the loop reaches when only 1 is left alive gets
   surrender, everyone evaluated earlier flees); camera convergence
   mdOld=25/mdNew=5; real-cover mismatch test {"mismatchGrantsCover":
   false,"realCoverWorks":true}; auto-tap-never-locks {"selTargetAfterTap":
   null}; manual-tap-still-works {"selTargetAfterTap":0}. Zero page errors
   on every probe.
   tools/bohemia_combat_melee_patch.py patch35() (idempotent, guarded on
   'V35 FLEEING' marker... NOTE this guard string never actually lands in
   the output verbatim, only its pieces do (FLEEING/V35 both present
   separately) -- harmless since the function is otherwise idempotent via
   sub1's exactly-once assertions, but worth tightening if patch36 reuses
   this pattern.) gates/combat_lab_gate.js: 138 checks (7 new + 3 fixed
   stale string-anchors from the v35 rewrite -- same "gate matches shipped
   reality, never the reverse" precedent as every prior pass). Full suite
   ALL GREEN. Stamp: BUILD 7/21p.
-27. SIX FACTIONS RULED + THE RAINBOW GAP FOUND (7/21): Paolo went
   faction-by-faction live off the roster. Locked: REDS brightest red
   #dc2820, CARTEL darkest maroon #5c302a (existing OXBLOOD ramp), CHURCH
   gold #ffd75c distinct from MOB's gold-STRIPE #b08a2a (existing MUSTARD
   ramp, "gold stripes not all gold"), CARAVANS unchanged tan #caa05a
   (blends with the desert, his call), COLORFUL literal rainbow mode (no
   fixed color). Mechanism grew THREE modes (family/stripe/rainbow) in
   engine/bohemia_dress.js: FACTION_LOOK[faction]={mode,color}. Realism
   fix per his note ("not everyone's gonna have a shirt of one solid
   color"): nudge order is torso then a SMALL tell (feet/head), legs only
   as last resort -- no more matching-separates costumes. Generalized the
   no-stray-cover-up rule (an unforced outer/hat can't hide a forced base/
   face color -- this was silently breaking REDS/CHURCH's coverage before
   the fix). BIG FIND: the whole 187-item wardrobe had ZERO real blue/
   green/purple/yellow -- literally impossible to make COLORFUL a rainbow
   without new content. Cooked 9 colorway garments (existing shapes, new
   ramps): SIGNAL RED SHIRT+BOOTS, VESTMENT GOLD SHIRT+BOOTS, MOB
   PINSTRIPE SHIRT, MOSS GREEN SHIRT, TEAL WORK SHIRT, COBALT WORK PANTS,
   ROSE BANDANA (a violet sash + first magenta pick both got cut mid-build
   by PURPLE RESERVATION catching them as purple-family even off pure
   hue -- rose clears it). Wardrobe bank 195. dress_gate.js 23->43 checks,
   his two named collisions (REDS/CARTEL, CHURCH/MOB) gate-asserted >=95
   apart forever. LIFE slice regenerated (was carrying a stale embedded
   copy of bohemia_dress.js -- confirmed the ENGINE SYNC gate does NOT
   cover this module family, BOH_* prefix only; regenerate manually after
   touching engine/bohemia_dress.js). [PENDING Paolo]: the other 7
   factions (BLUES/ANARCHISTS/NETWORK/TRADES/VOLUNTEERS/REMNANTS/
   HOMELESS) -- real color collisions found among them, flagged not
   guessed; FACTION_VETERAN_KIT per faction, whenever. Known limitation
   flagged: CARTEL's dark-maroon match reads reliably DARK more than
   reliably RED-hued (plain RGB distance loses hue precision at low
   lightness) -- a hue-aware metric would tighten this, not blocking.
   Stamp: BUILD 7/21d.
-25. DRESS CODE BY RANK, THE MECHANISM (7/21): Paolo picked the next
   lane -- dress codes, starting with color. His rule: rookies wear
   whatever as long as >=50% of BODY SURFACE reads the faction color;
   veterans wear every layer Paolo's kit names, forced, everything else
   free. Shipped in engine/bohemia_dress.js (NOT the alpha -- LIFE's own
   dress module, only loaded by slices/BOHEMIA_LIFE_CURRENT.html /
   BOHEMIA_LIFE_SLICE_7_19_26.html, so no alpha diff, no buildstamp bump,
   no Pages wait this turn): rookieOutfit (nudges the heaviest-uncovered
   body region first: torso 0.437/legs 0.322/head 0.161/feet 0.080,
   canon-only, skips a region rather than fabricate), veteranOutfit (kit-
   forced layers; caught + fixed a stray free-drawn outer hiding a
   governed base before shipping), outfitForRanked (dressAll's new entry
   point, agent.rank optional -- zero regression, LIFE gate still 24/24).
   FACTION_COLOR + FACTION_VETERAN_KIT both ship EMPTY (contents-Paolo's).
   Gate: dress_gate.js grew 9->23. Law: laws/BOHEMIA_ADDENDUM_DRESS_CODE_
   BY_RANK_7_21_26.md. Record: records/BOHEMIA_DRESS_CODE_MECHANISM_
   7_21_26.txt. [PENDING Paolo, whenever]: rule real per-faction colors +
   veteran kits off the 186-piece wardrobe; LIFE's population wears them
   the same turn the tables land.
-24. ALL CANON + QUIVER v2 + THE WOMAN LAW (7/21): third verdict --
   gas mask v2 CANON, wave 8 seven-of-eight CANON (bank 186). SCRAP QUIVER
   held ("DO IT AGAIN") -> v2 same turn: capped 3px tube, banded leather,
   THREE fletched arrows fanning clear of the head, front strap + peeking
   fletch, profile trail; gate-locked (fletch pixels machine-checked);
   [PENDING thumbs]. THE WOMAN RULING LOCKED (laws/BOHEMIA_ADDENDUM_
   WOMAN_RIG_7_21_26.md): Paolo does NOT paint her -- Claude DERIVES her
   from his sacrosanct male paint as candidates through the thumbs
   pipeline; wardrobe carries via the female-rig guarantee; timing HIS
   call ("we don't even have to do it now"). Lane roadmap laid out for
   Paolo (woman rig, faction dress codes, day/dusk music pools + missing
   faction thirds, combat sound pass, face mini-expressions) [PENDING his
   pick]. Stamp: BUILD 7/21c.
-23. GAS MASK v2 + WAVE 8 + FEMALE-RIG GUARANTEE (7/21): second
   verdict export -- BIB OVERALLS / SCAV TOOL BELT / ANKLE WRAP SKIRT canon
   (bank 178); RUBBER GAS MASK held: "better east and west" -> v2 profile
   branch (shaped rim, glint lens off the leading edge, canister driving
   FORWARD past the silhouette, strap across the skull; front lenses got
   the glint too), still cooking [PENDING thumbs]. WAVE 8 ("MAKE MORE
   CLOTHES A LOT"), eight shapes in COOKING [PENDING thumbs]: SHOULDER
   MANTLE, ELBOW PADS, FIELD LEG WRAPS, BLANKET SHOULDER ROLL, HIP SASH,
   OUTLAW BANDANA, SCRAP HELM, SCRAP QUIVER. structure_gate 123. FEMALE-RIG
   GUARANTEE recorded (Paolo: "workable when we make it to woman"):
   generators read only the part-id grid; the gate fixture is a non-male
   body, so the whole wardrobe carries to the female rig with zero new
   clothing code -- machine-enforced already. Stamp: BUILD 7/21b.
-22. WARDROBE ALL CANON + WAVE 7 (7/21): Paolo's verdict export --
   ALL 176 lines CANON, zero kills, no comments. Waves 5+6 baked to canon
   (NEW IN CANON carries the eight; wave-4 fresh flags retired); wardrobe
   bank re-extracted: 175 canon. COOK BATCH 21 (wave 7) answers "make new
   clothes": BIB OVERALLS (genCoverall bib:true -- full legs, bib panel on
   straps, arms bare, straps-only from behind), RUBBER GAS MASK (genAcc
   gasmask -- full-face class incl. eyes, lenses, filter snout, head strap;
   dust mask keeps its below-the-eyes law), SCAV TOOL BELT (genGear
   toolbelt -- belt + buckle + pouches hanging onto the hips), ANKLE WRAP
   SKIRT (genPants cut:'longskirt' -- third length: knee/mid-shin/ankle).
   All in COOKING with thumbs [PENDING Paolo]. structure_gate 104.
   Stamp: BUILD 7/21a.
-21. FACE CANON FLOOR + CLOTHING WAVE 6 (7/20): Paolo raged -- his
   7/19 face calibration "un-fixed" itself on his phone. Root cause: the
   calibration WAS baked, but PERSIST.restore() wholesale-overwrote
   FACE_OFFSETS with his pre-calibration device save (all zeros) on every
   boot; AND lookKey() did not carry the calibration, so combat/city kept
   serving old-face bakes after an editor recalibration. Fixes: restore now
   merges per-feature (zeros defer to the baked canon; his newer non-zero
   tweaks still win) and lookKey carries FACE_OFFSETS + skin tone +
   eyeColor. New gate FACE CANON (face_canon_gate.js, 9): the records file
   IS the enforced truth (record vs baked CANON compared value by value),
   bulldozer regex-locked, rebake keys locked. Verified headless: stale
   zero-save seeded -> calibration survives boot. HIS PHONE NEEDS NOTHING:
   next deploy load self-heals (the stale save merges under canon).
   WAVE 6 ("New clothes please"): WORK COVERALLS (one-piece, zip, pockets,
   cuffs -- genCoverall), SPLIT-TAIL DUSTER (ankle coat + back riding vent
   -- genCoat split:true), ROAD CAPE (drape lives BEHIND the body --
   genCape), SHELL BANDOLIER (diagonal shell sash -- genGear bandolier).
   All in COOKING with thumbs [PENDING Paolo]. structure_gate 92.
   Stamp: BUILD 7/20q.
-20. NE/NW ARM-UNIT DEPTH LAW (7/20): Paolo LIKED all nine combat
   moves (notes are rulings, they stand) but called the NE hand/arm
   layering broken. Root cause was pipeline: layer laws re-placed only
   HANDS and read only X; away diagonals carry depth in -Y and the
   authored NE baseline holds the camera-side arm nearest, so thrown arms
   crossed the face while their hands hid behind. Fix: handOrder now moves
   arm+hand as ONE UNIT on NE/NW, judged by the hand's rest displacement
   dotted on the facing vector (deadband +-2.5 keeps the authored baseline
   exact, RIG LAW safe, all other facings byte-identical). Law:
   laws/BOHEMIA_ADDENDUM_NE_ARM_UNIT_7_20_26.md; gate 74; A/B verified NE
   + NW, 8 clips each. Stamp: BUILD 7/20j.
-19. COMBAT MOVES BATCH #13 (7/20): Paolo ordered nine combat
   animations, all shipped + wired LIVE (batch #12 take-cover law: used in
   combat regardless of verdict): cover-rise/cover-drop (player LIVES the
   crouch in cover phase now, rises into the aim on POP, drops on turn
   end), gun-walk (MOVE repositions at gunpoint), cover-fire (covered
   enemies fire as a peek-and-snap, never standing; the V20 counter-snap
   has a body now via e._snapAt), get-shoved (doShove plays it before the
   push), floor-rise (prone holds flat on frame 0, the get-up plays when
   the clock runs), shiv-jab/bat-arc/spear-drive (windup HOLDS as the
   one-turn warning, strike swings through; swing frames at 0.2/0.5/0.68 --
   0.42 is a dead zone, envelopes cancel). PRONE OUTRANKS STAGGER law.
   e.wpn bug fixed (was never assigned; all blades drew shiv-length).
   Gate: combat_anim_gate.js (67, registered). Record:
   records/BOHEMIA_COMBAT_ANIM_BATCH13_7_20_26.txt. Nine candidates carry
   * thumbs in the ANIM tab [PENDING Paolo]. Stamp: BUILD 7/20i.
-18. VERDICT FOUR + BATCH 17 + CLOTHING WAVE 5 (7/20): batch 16
   judged (3 canon incl. the first RETURNED-voice songs; EVERY FLOOR BELOW
   THIS ONE down as a song, its voices live). BATCH 17 answers: THE GAPS IN
   THE HYMNAL (holdbreath = composed silence; phasedist bass + reversebloom
   motif returning) [PENDING verdict]. CLOTHING SHORTCUT ran first time --
   wave 5 in COOKING [PENDING thumbs]: DESERT SHEMAGH (eye slit only, full
   back cover), WORN BRACERS, THIGH HOLSTER, TRAILING SCARF. structure_gate
   74. Stamp: BUILD 7/20h.
-17. SONG-DEAD-NOT-VOICES LAW + BATCH 16 + CLOTHING SHORTCUT (7/20, latest):
   Verdict three processed (3 canon, 4 songs down). NEW LAW (Paolo, locked):
   graveyard is final for SONGS only -- voices/topologies from dead songs
   stay legal, re-try them in different fashions; all "voice retired" lines
   superseded (registry note added). BATCH 16 answers the 4 slots under the
   law: new leads (combfake/glissharp/subharmglide/retrig) + retired voices
   returning (ironlung bass, strikeswell/aeolianharp/sourdyad A-motifs).
   NEW badge on 4, [PENDING verdict]. CLOTHING COOK SHORTCUT written for his
   keyboard (laws/BOHEMIA_CLOTHING_COOK_SHORTCUT_7_20_26.md) -- when that
   paste arrives, run the full clothing factory per its spelled-out bindings.
   Stamp: BUILD 7/20g.
-16. TIGHT PONCHO + HOOD TOGGLE EVERYWHERE (7/20, latest): poncho now 1px
   past the torso, arms + hands always free (gate: <15% arm coverage, zero
   px past torso+1). HOOD button on every hooded garment incl. HOOD-UP
   pieces + hooded poncho (default up, strips too). Music export re-verified
   clean on current build (his stale tab explains his report). Stamp: BUILD
   7/20d. Music: 7 batch-15 songs still [PENDING verdict].
-15. HOOD BACK-COVER + TOGGLE + RAIN RULE (7/20, latest): Paolo's screenshot
   ruling -- from N/NE/NW the hood LAYERS OVER the face, zero skin slits
   (face stays open from the front). Baked into genTop hoodUp + genPoncho
   hood; gate asserts back faceCov 100%. Wave 4 all CANON (his words), 
   wardrobe 167, bank re-extracted. HOOD TOGGLE on all 8 hoodies (CLO_HOODUP
   per square). RAIN RULE recorded: rain auto-raises hoods (no umbrella) --
   hook exists, weather belongs to LIFE/world. Stamp: BUILD 7/20c.
-14. BUILD WATCHER + WAVE 4 (7/20, latest): third "nothing new" -- deployed
   bytes were right; causes were the always-open stale tab + no unjudged
   clothes. BUILD WATCHER now lives in the page (2-min + on-focus network
   check, NEW BUILD READY tap-to-reload banner). Stamp = BUILD 7/20b. Wave 4
   COOKING [PENDING thumbs]: HOOD-UP ASH/COAL HOODIES (hood worn, skull =
   garment, face open + shell), HOODED DUST PONCHO, SCRAP CHEST PLATE (X
   harness back). structure_gate 62. REMEMBER: every ship bumps #buildstamp
   and verifies the Pages run concludes SUCCESS (CLAUDE.md ship flow).
-13. SHUFFLE ANIMATION ON EVERY SQUARE (7/19, latest): Paolo's ask -- every
   big clothing square has a bottom-right shuffle button; tap = random clip
   from the APPROVED animation catalog (CLIPS minus candidates), square
   re-renders live on that clip with the clip name shown. Per-canvas clip,
   per-clip beats. structure_gate 54 checks. Verified live.
-12. EVERYTHING CANON: WARDROBE 163 + CANON CLOSET + THUMBS PERSIST (7/19,
   latest): Paolo approved ALL clothing (wave 3 + the 63 colorways). Wardrobe
   163 pieces across 11 categories; cooking empty. Fixed his two callouts:
   thumbs now persist on-device (localStorage, applyV on load; bake = truth),
   and the CANON CLOSET browses the whole approved wardrobe by category
   (replaces the one closed fold). fresh:true = wave 3 (move the tag per
   newest batch on every promotion). Wardrobe extractor parser fixed for
   cw:/fresh: tags (banked 97 of 163 -- DRESS gate caught it; now 163, street
   agents dress from the full closet). NEXT: structure wave 4 (skirts done;
   hood-up, shemagh, armor plates, more bags open); colorways may multiply
   off all 25 structures as filler.
-11. NEW-IN-CANON SURFACING + WAVE 3 (7/19, latest): Paolo could not see his
   newly approved clothes -- the verdict had collapsed them into the closed
   CANON menu (deploy was fine; UI failure). LAW OF THE SURFACE now baked:
   the freshest approved batch stays EXPANDED in a ★ NEW IN CANON section
   (fresh:true tags -- MOVE the tag to each newest batch on promotion) until
   superseded. Wave 3 cooking: BEDROLL, WRAP SKIRT (gap closes, diagonal
   fold), SHIN GUARDS. structure_gate 53 checks. Tab: COOKING (3) -> NEW IN
   CANON (19) -> COLORWAY FILLER (63) -> CANON (97).
-10. ALL 19 STRUCTURES CANON + STRAP RULING (7/19, latest): Paolo approved
   every structure candidate (jackets, ponchos, tall boots, rolled, gear,
   bags, aprons, suspenders, tattered) -- CANON WARDROBE NOW 97 items. The
   63 colorway fillers stay cooking in their drawer, unjudged. His one note
   (NOTES ARE RULINGS, rebuilt same turn): the RUCK PACK's front straps --
   now 2px webbing beside each arm, anchored at the shoulder line, chest
   buckles, gate-locked (structure_gate 45 checks). NEXT structure wave when
   clothing continues: skirts/wraps, hood-up variants, bedroll, shemagh,
   more armor plates. Colorways may now also multiply off the 19 new canon
   structures -- as FILLER, never the headline.
-9. STRUCTURE WAVE 2 + COOK UI RE-LED (7/19, latest): Paolo flagged the UI
   still led with colorways after his ruling -- the CLOTHES tab now renders
   COOKING - NEW STRUCTURES first and collapses COLORWAY FILLER (63) into a
   drawer (gate-checked). Four more shapes born (7 candidates): BAGS (genBag,
   new 'back' layer: RUCK PACK + SALVAGE SATCHEL), APRONS (genApron front
   panel: SMITH'S/TRADES), WORK SUSPENDERS (genGear Y-crossback), TATTERED
   hems (genTop tatter, torn-out pixels: TEE + FLANNEL). structure_gate now
   42 checks. COOKING: 19 structures (the headline) + 63 colorway filler.
   NEXT structures open: skirts/wraps, hood-up variants, bedroll, shemagh
   full-wrap, armor plates beyond the pauldron.
-8. STRUCTURE-NOT-COLOR LAW + 5 NEW GARMENT SHAPES (7/19, latest): Paolo
   rejected colorways-as-progress ("I need to see actual different clothes").
   Law locked (laws addendum + CLAUDE.md): colorways legal, NEVER progress;
   progress = new shapes, machine-locked by gates/structure_gate.js (28
   checks, registered). Born same turn, 12 in COOKING: JACKETS (waist-length
   open outer -- denim/field/leather), PONCHOS (new class: shoulder-wide
   diamond, fringed hem -- dust/oxblood), TALL BOOTS (shaft up the shin --
   moto/ranch), ROLLED SLEEVES (third real length -- work shirt/flannel),
   GEAR (new category: kneepads/pauldron/chest rig). Post-mortems recorded:
   cloth-ramp shoes crashed per-facing on missing sole colors (fixed with
   fallbacks, colorway shoes included); poncho v1 left shoulders bare (now
   starts shoulder-wide). Wardrobe: 78 canon + 75 cooking (12 structures +
   63 colorway filler). NEXT clothing turns lead with structures: aprons,
   skirts/wraps, bags, hood-up, tattered hems, suspenders are open territory.
-7. MUSIC VERDICT TWO + BATCH 15 + CLOTHING COLORWAY WAVE (7/19, latest):
   Paolo judged batches 13+14: 4 CANON (SOMETHING SINGS THROUGH THE PIPES,
   THE SHAPE THE WATER TAKES, TWO LIGHTS OVER THE FLOOD, THE STAIRS UNDER THE
   LAKEBED), 7 DOWN graveyard-final (registry tokens added, voices retired).
   BATCH 15 answers the 7 slots -- 7 new topologies: pulseform (VOSIM
   pulse-train formant), octgate (octave-gate), roundchoir (staggered canon),
   reversebloom (tail-attack reverse), phasedist (Casio CZ phase distortion),
   settlebend (arrive-sharp-and-settle), ghosttriad (noise triad). NEW badge
   on all 7, [PENDING verdict]. COMMENT-BOX LAW: the music comment box now
   CLEARS when comments ride an export (his complaint: old comments re-rode
   every export). CLOTHING COOK BATCH 14: the colorway multiplication wave one
   -- 63 candidates across all layers from approved structures x canon
   palettes, in COOKING [PENDING thumbs]; wardrobe 78 canon + 63 cooking.
   NOTE: his verdict-two export tagged the now-dead WIND THROUGH THE COUNTING
   HOUSE -> CUSTOM; the kill wins, tag died with the song.
-6. COMBAT SESSION OPENED — RESEARCH PASS + BEAT TACTICS LAB SHIPPED (7/19):
   the COMBAT session (brief: laws/BOHEMIA_SESSION_BRIEF_COMBAT_7_19_26.md)
   ran the mandated research pass on the best beat/tactics combat ever made
   (fresh web sweep, sources inline) and shipped the findings as PLAYABLE
   OPTIONS in the alpha. Law: laws/BOHEMIA_ADDENDUM_BEAT_TACTICS_RESEARCH_
   7_19_26.md (extends the 7/3 turn-based research). Headlines: NecroDancer's
   100%-leeway forgiveness discovery (our SILENT-PLAY LAW is the shipped
   consensus); Hi-Fi Rush's quantize-the-result-never-gate-the-input; the
   declare-then-answer telegraph consensus (Into the Breach / Shogun
   Showdown); Hoplite's movement-as-attack grammar; displacement-beats-
   damage-numbers (Tight Spaces / TBW); the ~6-8 enemy cognitive ceiling
   (confirms our 8); Shogun Showdown's QUEUE (greed spatialized, parked).
   THE BUILD: the alpha COMBAT tab now has a DIAL / BEAT TACTICS LAB
   switcher (canon Dead Eye Dial demo untouched). The LAB (slices/BOHEMIA_
   COMBAT_LAB_7_19_26.html, generated by tools/bohemia_combat_lab_gen.py
   which re-stamps the canon dial engine LIVE from COMBAT_B64 so it can
   never drift) = four playable turn-shell grammars on a 9x12 occupancy
   grid, I-MOVE-YOU-MOVE at 120: A THE CONDUCTOR (enemies as beat
   signatures), B THE PROMISE (committed red attack tiles, prevention),
   C THE DANCE (sidestep past a guard = OPENED = easier dial; disengage =
   swipe), D THE SHOVE (wall=stagger, body=both stagger, barrel=cooked).
   ALL damage goes through the real stamped dial (canon zones/forgiveness/
   tiers: vital 60 + 2-beat stun, no stun-lock, two vitals kill, kill
   chains, vital chains to a different target). THE CURRENCY THESIS
   presented as its own thumb: position never moves damage, it bends WHICH
   PACKAGE the shot pulls (extends locked distance-pull with opened/
   staggered/stunned -1, surrounded +1). Verdict UI per workflow: thumbs
   x5, per-mode comments, bottom comment box, SUN MODE, .txt export.
   GATE #COMBAT LAB same turn: gates/combat_lab_gate.js (33 checks: engine
   stamp byte-sync, dial-gated damage static+simulated, occupancy sims,
   whole-beat advancement, canon tier rules, verdict UI, alpha wiring).
   Verified on the real surface (390px chromium, alpha itself): switcher
   works, lab plays, dial opens/fires, 0 errors. NOTE (pre-existing, not
   this turn's regression — verified identical on pristine alpha): the
   canon DIAL demo renders black in headless file:// (its start screen
   needs network fonts); check on phone, works in production.
   [PENDING Paolo: thumb the 4 grammars + the currency thesis in the LAB.]
   NEXT for combat (mine, after his thumbs): graduate the winning
   grammar(s) into the canon combat demo's spatial field; the queue
   option; enemy archetypes as beat signatures on the winning shell.
   VERDICT 1 PROCESSED + LAB v2 SHIPPED (7/19 same day): Paolo's first
   pass landed as notes (verbatim + deciphered: records/BOHEMIA_COMBAT_
   LAB_VERDICT_7_19_26.txt; rulings law: laws/BOHEMIA_ADDENDUM_COMBAT_
   LAB_RULINGS_7_19_26.md). RULED + BUILT same turn: (1) melee enemies
   move differently BY WEAPON — lab A now runs shiv (every beat) / bat
   (every 2nd, hit knocks you back) / spear (keeps 2 distance, pokes a
   telegraphed 2-tile lance); (2) FORESIGHT IS A PERK — movement-intent
   arrows now sit behind the PERK: FORESIGHT toggle (attack telegraphs
   stay always-on = fairness; converges with the 6/27 catalogued
   see-next-move ability); (3) THE SHOVE (he loves it): contextual
   (button lights on adjacency; tapping an adjacent enemy offers SHOVE
   or DIAL with a BG3-style preview "stun 1 · 65% topple · wall"),
   ALWAYS stuns 1 turn, seeded-deterministic chance to TOPPLE (prone =
   helpless = easier dial), IRON SHOULDER perk = guaranteed 2-turn stun,
   NO-STUN-LOCK holds for shoves (braced). (4) C DANCE was "kind of
   confused" — re-taught with live OPENED/SWIPED event labels, dies if
   still confusing. (5) "provide some more" research — PASS 2 shipped:
   laws/BOHEMIA_ADDENDUM_ENEMY_ARCHETYPE_RESEARCH_7_19_26.md (NecroDancer
   enemy taxonomy + archetype menu; the degenerate-CC triple and why
   no-stun-lock breaks it; VISIBLE immunity classes as the answer to his
   garbled "different enemy character" line; BG3 show-odds-before-commit;
   info-perk pricing doctrine). Gate now 46 checks. Verified in chromium,
   0 errors. STILL [PENDING Paolo]: which enemy classes resist the shove;
   the fall-odds table.
   NOTES-ARE-RULINGS + CANON DEMO INCORPORATION (7/19, third pass): Paolo
   ruled the workflow itself ("if I told you what I liked, I don't need to
   double check it... start actually incorporating it into the actual
   combat demo") -> LAW: laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md
   + CLAUDE.md verdict-workflow amendment. DONE same turn — the canon Dead
   Eye Dial demo (COMBAT_B64) now carries the ruled mechanics via
   tools/bohemia_combat_melee_patch.py (idempotent, anchor-asserted, 3
   passes): weapon-typed MELEE archetypes join encounters (SHIV fast
   adv3/cad1, BAT heavy cad2 26-38dmg + knockback hit, SPEAR keeps
   distance reach4.2 — MELEE MIX setting NONE/SOME/PACK default SOME,
   rides the 7/4 melee plumbing); blades advance/windup/strike AFTER your
   action at the ONE turn-end choke (tickTurnEnd; doWait now routes
   through it — v2 fix, caught by the chromium drive); telegraph law
   (windup ring pulses on the beat, a strike never lands unannounced);
   contextual SHOVE button in the action row at point-blank ("SHOVE SHIV
   (stun 1 · 30%)" odds preview): always stuns 1 (IRON SHOULDER setting:
   2 + 50%), topple -> prone (flat ellipse, gets up over 2 turns), braced
   under no-stun-lock; FORESIGHT setting draws next-move intent ON THE
   FIELD (green advance arrow / amber will-windup dot — enemy cards are
   retired canon, v3). Pure decision logic = MELEE CORE block inside the
   demo, gate-required headless: combat_lab_gate.js now 57 checks.
   VERIFIED live in the real alpha (chromium: blades close over WAITs,
   windup->strike alternation, shove label/stun/prone/push, 0 errors).
   ENVIRONMENT NOTE (for every future session): the combat tab srcdoc
   iframe reads BLACK/hung in this sandbox because the Google Fonts
   stylesheet fetch hangs at the proxy and BLOCKS srcdoc script execution
   — NOT a production bug (fonts load on real networks). To test locally:
   abort fonts.g* routes in playwright. Root-caused 7/19 by srcdoc parse
   bisection; the pristine alpha behaved identically.
   MOVEMENT LANDS IN THE CANON DEMO (7/19, fourth pass; Paolo playing the
   new alpha: "did you fix it so that I can move around now... players
   are running after me and I can't even move"): the 6/27 locked canon
   "move 1 tile = 1 turn" is finally BUILT (patch v4 in bohemia_combat_
   melee_patch.py). MOVE button in the action row arms the 3x3 ring; tap
   a cell = step that direction; the whole polar world (enemies, corpses,
   litter) shifts around the player-centered camera (worldShift). A move
   COSTS the turn (endTurnReturn(false): exposed shooters answer, blades
   advance) and MOVEMENT IS THE MELEE DODGE — stepping out of a wound-up
   blade's reach makes its telegraphed strike WHIFF (verified in
   chromium: dodge test hpLost 0, whiff true; world-shift bearings
   correct; 0 errors). Cover ring stays hand-authored overlay (persists
   through moves — geometry drives it later, as canon says). Gate 60
   checks. NOTE: player sprite stays center (camera is player-locked);
   the read is the world sliding — matches the demo's polar model.
   RING MOVEMENT + PILLAR COVER (7/19, fifth pass; Paolo: "we already
   have eight cardinal directions right next to the action button" +
   "shuffled pillars that I can take cover from... a wall pillar"):
   (1) the 7/4 move ring (which only set G.moveIntent, plumbing waiting
   for movement) now CALLS doMove directly — one tap on N/NE/E/... = one
   step; the arm-then-tap MOVE button is DEAD. (2) REAL GEOMETRY COVER:
   G.pillars — 5-7 shuffled world-anchored pillars per encounter (ride
   worldShift). The locked RF4 line-of-fire model, geometry-driven at
   last: myCoverAgainst(ang,dist) is pillar-aware (a pillar on the line
   to the shooter = cover; behind him = not); enemies take pillar cover
   too (e.gcov in peeking/firing/hasLine/arc — an enemy behind stone is
   tucked until the line clears); pillars BLOCK the step (occupancy);
   shove into a pillar = PILLAR SLAM (65% topple); rendered tan with a
   sky-lit top (45-law nod), zero purple. Hand 3x3 toggles still work,
   OR'd with geometry (authoring layer stays until full tile geometry).
   Gate 67 checks. Chromium-verified: ring one-tap moves the world,
   enemy behind pillar gcov+excluded from exposed pool, my cover true
   through the same stone, step into pillar refused. 0 errors.
   STREET TILE BOARD + PUSH-1 (7/19, sixth pass; Paolo: "I need to see
   each tile... we have a good ass street... add the street" + "when you
   shove people they get pushed back one tile... maybe a perk for two"):
   (1) STREET FLOOR V6 — the combat floor is now a readable WORLD-
   ANCHORED tile board in street anatomy: asphalt tiles with gentle
   deterministic tone jitter (never confetti), grid lines, double-yellow
   median + white lane dashes per the LINE COLOR law. It slides exactly
   one tile per step, so the board IS the movement ruler. (2) Steps are
   full-tile Chebyshev now (diagonals = 1 tile each axis, worldOff
   integers). (3) Shove pushback = ONE tile (was 3), LONG ARM perk = two
   (settings toggle beside IRON SHOULDER); melee-core signature grew a
   perks object (back-compat). Gate 72 checks, ALL GREEN, chromium-
   verified (push 2.0->3.0 exact, NE step = worldOff +1,-1, floor
   renders). NOTE: enemy positions are still analog polar (fieldPos maps
   distance nonlinearly) — full enemy tile-snap is the next big refactor
   if Paolo wants the whole fight grid-true.
   GRID-TRUE FIELD + REAL BLOCKS + TWO-TURN RED LINE (7/19, seventh pass;
   Paolo: "the cover tiles... magical cover... has to be the same tiles
   you have on the grid" + "enemies need a red line on you for two turns
   before they can shoot"): (1) GRID TRUE — fieldPos is linear now (1
   tile of distance = 1 board cell), so enemies/pillars/corpses/floor
   share ONE ruler; demo spawn band compressed to the visible board
   (~6.5-14.5 tiles; long-range returns with the world model; the
   locked PT_BLANK/FAR/MAX numbers untouched, package math unchanged).
   (2) THE MAGIC ARCS ARE DEAD: pCover no longer grants cover; tapping a
   ring cell places/removes a REAL cover block ON that grid tile
   (identical rules to pillars: blocks lines both ways, blocks steps,
   slammable); shuffled pillars snap to tile centers, r=0.55, block
   fills its tile. (3) TWO-TURN RED LINE LAW: a gun must hold its bead
   two turns before firing — first turn = ACQUIRING (bright warning
   line, cannot fire; e.acq clock in tickTurnEnd, pools filter acq>=1);
   breaking the line resets his clock. Blades keep instant red (they
   don't shoot). Gate 78 checks, ALL GREEN. Chromium-verified: pillars
   snapped, turn-1 wait = zero gun damage + acq 0->1, turn-2 = fire,
   placed N-block covers north. 0 errors.
   GRID LOCK + DIAL-ON-BOARD + MANUAL TARGETING (7/19-20, passes 8-9;
   Paolo: "the ghost tiles have to be on the exact same grid" + "the dial
   should be the same tile shit, same location, zoomed in" + "the power
   of who to shoot next"): (v8 GRID LOCK) floor cells are centered on
   integer world coords so the player stands MID-CELL; ghost tap-cells
   draw as exactly the painted tiles; pillars snap to integer centers —
   one grid, no half-tile lie. (v9 ZOOMED BOARD) the aim phase's stand-in
   world is DEAD: the dial renders over the REAL field (street tiles,
   pillars, bodies) scaled about the player so the man under the dial is
   the man on the board (zoom = RAD*1.18/(edist*ring), clamp 0.9-3.2,
   field at 0.85 alpha under the wedge). (v9 TARGET SELECT — settles the
   6/27 manual-targeting fork): tap any enemy to SELECT him (gold ring,
   read line); pickTarget honors the pick, auto = fallback; tapping the
   selected man again toggles his cover (authoring stays); blades always
   join the shoot pool when visible; stunned/prone men ARE targets (the
   easy dial you manufactured); selection resets per encounter. Gate 86
   checks, ALL GREEN, chromium-verified (blade manually picked through a
   pop while exposed to a gun; dial-over-board screenshot). ALSO: the
   earlier "alpha not updating" report was deploy timing — all Pages
   deploys green; the always-fresh sw.js is correct; the b64-packed
   demo is NOT plaintext-greppable in the alpha (gate decodes it — do
   not repeat my false clobber scare, check with the gate).
   ONE SCENE (7/20, pass 10; Paolo on v9: "you literally slapped it on
   top of it instead of it being what it actually is" — he was right):
   v9 layered the board UNDER the intact dial stage = two worlds at once
   (field player + pose-silhouette needle, ghost cells, dimmed tiles,
   clamped zoom putting the target away from the reticle). v10 makes the
   zoomed board THE stage: EXACT zoom (zb=RAD*1.18/(edist*ring), clamp
   0.35-3.6) puts the real target token precisely at the wedge rim where
   the needle sweeps and the reticle locks; drawField grew an aim mode
   ({dial:true}) that hides the player token (the canon sweeping POSE is
   you), ghost cells and threat lines; full opacity; corpses moved onto
   the grid-true ruler (they were still nonlinear). enterAim already
   faces the target (canon), so the wedge points at your PICK. Gate 90
   checks, ALL GREEN, chromium-verified with clean screenshots (selected
   blade at the rim under the reticle). KNOWN AESTHETIC OPEN: the pose
   needle draws at dial scale OUTSIDE the board zoom, so at far shots
   (zb<1) it reads bigger than board sprites — if Paolo flags it, scale
   the pose layer by zb or draw the arm on the board player.
   TEST-HARNESS NOTE: clicking INTO the combat iframe with playwright
   page coords needs the iframe's page offset added, and a missed click
   can PAN the user camera (reset G.userPan/userZoom before screenshots).
   BOARD BODY + COVER AI + LOOP ARMOR (7/20, passes 11-13; Paolo: "change
   the size... integrate it better" then "got shot and it broke" + "remove
   auto cover, work on their AI" + "more game on screen"):
   (v11 BOARD BODY) the full-body pose-silhouette needle is DEAD — the
   field sprite stays as you during the dial and the needle is an ARM+
   weapon at board scale from your sprite's shoulder (the 6/28 locked
   canon made literal). drawArmNeedle; ghost fan = arm echoes; ARML =
   ring*(G._zb)*1.05. (v12) AIM CAM PIN: cam pinned each non-ks frame +
   biased 35% to the target; floor bounds expand 1/zb on zoom-out (no
   floating board); median/lane/grid overdraw. (v13) LOOP ARMOR: the rAF
   body is try/caught, one bad frame can never freeze the game (Paolo's
   "broke when shot" could not be reproduced headless — shot/death/
   restart all clean — so the class got fixed; G._lastErr holds the last
   frame error, bomb-tested). COVER AI: nobody spawns behind magic
   cover (inCover:false all); coverSeekAI runs at the turn-end choke:
   uncovered gunmen run up to 2.2 tiles/turn for the far side of the
   nearest pillar until geometry covers them (verified: 0 spawn-covered,
   2/4 reached stone in 6 turns), blades charge as before, hand cover
   toggles remain Paolo's tool. UI COMPACT: logo 30px, WAGER + PATTERN
   moved into the SETTINGS drawer (TABLE group), WAIT/SHOVE/NEW
   ENCOUNTER stay at hand. Gate 96 checks, ALL GREEN.
   PAOLO'S STANDING NOTE (7/20): "a lot of the game mechanics still
   aren't good... look back in the plumbing" — next passes should
   re-examine the turn/pool plumbing end-to-end (engagement modes, pop
   vs shoot semantics on the board, chain flow on the one scene, wound/
   attrition curve) rather than only adding features.
   THE FEEL PASS (7/20, pass 14; Paolo's big list): logo REMOVED from the
   fight + view starts wide (userZoom 0.82). CHAIN SKILL: how many people
   you can shoot in one turn is now a SKILL setting 1..8 (settings,
   default 3; '8 perfect kills = 1 turn' stays the ceiling at max) —
   verified: skill 2 killed exactly 2 then the turn ended. WEAPON READ:
   every body draws what it holds pointed at you (spear pole, bat club,
   shiv blade, gun barrel) so blades vs guns read at a glance (answers
   his LOS confusion — the pools were right, the READ was missing).
   MISS CINEMATIC: every return volley plays the quick incoming camera
   even on an all-miss (you always see WHO shot at you) — verified via
   forced-miss volley. AIM CAM GLIDE: the player's own pan/zoom framing
   eases (k=0.14) into the shot framing when the dial opens; settings
   toggle AIM CAM GLIDE/SNAP. The aiming arm's gun reads per weapon
   (pistol short, rifle long + stock). Gate 102 checks, ALL GREEN.
   OWED (his ask, bigger lift): the REAL rig gun-pose animation (the
   alpha's _gun aim frames) on the combat field sprites instead of the
   drawn arm — needs the rig bake piped into the demo's SPR sheets.
   THE TUNNEL POST-MORTEM (7/20, passes 15-16; Paolo's screenshot showed
   a recursive-frame tunnel + smeared bodies): ROOT CAUSE — a frame that
   THROWS between ctx.save() and restore() leaks its transform; v13's
   loop armor kept the game alive but let the leak compound every frame
   (the armor caught the error, wore the transform). CLASS FIX (v15):
   draw() hard-resets the transform AND clearRects the canvas at frame
   start; the armor catch also resets and paints a visible ERR chip with
   the message (so Paolo can screenshot the underlying error — it is
   still unidentified, iPhone-only). Bomb-tested: 1.5s of forced
   every-frame mid-draw throws while zoomed+panned = clean screen.
   ALSO v15: street floor bounds now account for USER pinch zoom AND pan
   (his "world map too small / doesn't fit the screen" was the floor
   under-covering at userZoom<1); boot fight shuffles its faction.
   v16: the MUSIC studio's boot push was killing factionShuffle on every
   COMBAT tab open (userPicked persists) — per Paolo's ruling, studio
   pushes steer the CURRENT song, SHUFFLE stays the encounter default
   unless the studio is live-driving (m.audit). Cross-system note for
   the MUSIC session: combat now ignores userPicked's shuffle-kill on
   boot pushes; live audit behavior unchanged. Gate 107 checks, ALL
   GREEN. STILL OWED: the real rig gun-pose animation on field sprites;
   the plumbing re-examination pass.
   THE PHONE GHOST NAMED AND KILLED (7/20, passes 17-18): Paolo's ERR
   chip caught it on day one — "ReferenceError: Can't find variable:
   DIRS". Root cause: v10 wrapped drawField's DIRS table inside the
   not-during-dial block while the ring cover-save FX below still read
   it; that FX fires exactly when YOUR COVER EATS A SHOT, so getting
   shot at while covered killed the frame (the original "it broke when
   I got shot" + the dial-stopped-drawing). v18 scopes DIRS whole-field;
   the exact scenario reproduces clean. ALSO v17: EXACT FLOOR (bounds
   from uzInvert-ed viewport corners + PAD 6 — no heuristics; kills
   "he's outside the map"), SHOT n/skill counter in the aim readout,
   DIAL FACING menu removed (obsolete). v18: THE REAL CROUCH — the
   alpha has ALWAYS baked 'take-cover' frames per enemy look (7/3
   canon: cover112/coverE/coverW) and enemyFrame beat-bobs them, but
   only for the hand inCover flag; pillar gcov now triggers the same
   baked crouch (peek/fire stand them up — the readable pop is built
   in). v17's squash placeholder removed. Chain-skill button reads
   KILLSHOTS/TURN in the SKILLS + PERKS group. Gate 113 checks, ALL
   GREEN. PROCESS NOTE: a red gate reached main for two commits because
   the ship chain PIPED the gate (exit code swallowed by tail) — ship
   commands now run the gate unpiped and refuse to push on red.
   RHYTHM IDEAS BATCH DELIVERED (Paolo: "give me more good ideas"):
   laws/BOHEMIA_ADDENDUM_RHYTHM_IDEAS_7_19_26.md — 8 pitched, none built:
   1 FACTION RHYTHM IDENTITY (fighters inherit their faction's swing/feel
   from the FACTIONS music table — the Bohemia-native pick), 2 THE QUEUE,
   3 BAR-PHRASE COMBAT (volley on beat 4), 4 THE BREAK (groove cashes into
   half-time = the time-dilation bar earned), 5 LAST-BEAT DODGE, 6 BODY
   TELEGRAPHS ON THE OFF-BEAT (art-pipeline law), 7 STREAK-BUILDS-THE-SONG
   (re-pitch), 8 ELITE SYNCOPATION. [PENDING Paolo: pick numbers; if "you
   pick": 1+3+4.]
   THE AFTERMATH PASS (7/20, pass 19; shipped in 5360119, logged here late):
   VICTORY WALK — when the last body drops the fight does not slam to a
   result screen; you keep the board and WALK it (loot-pretend per Paolo),
   NEW ENCOUNTER when he is done. BLOOD BY HEALTH — thresholds, not events:
   under 66% a wounded body drips a trail as it moves, under 33% it stands
   in a growing pool; corpses pool where they fell (canvas-persistent
   spots ride worldShift). KILLSHOTS/TURN group moved to the TOP of
   settings (he could not find it mid-drawer). Gate 116, ALL GREEN.
   THE ANIMATION PASS (7/20, pass 20; his list): V20 WALK — the alpha
   bakes 'walk' for the player (4 phases, all 8 dirs) and every enemy look
   (2 phases); stepping plays them (G._stepAt/e._movedAt windows), blades
   and cover-seekers walk too. THE DEADEYE POSE IS THE NEEDLE — his ask
   ("there's an Animation for the dead shot dial me holding a gun"): during
   the dial the field body renders the baked deadeye gun pose AT the
   current needle angle (sprAimFrame, all 9 offsets x 8 dirs were already
   baked); the drawn live arm went compute-only (muzzle math for ghosts/
   tracer), so the BODY sweeps. DEATH POSES ARE STATIC — corpses re-rolled
   their look every step because enemyLook keys off bearing and worldShift
   changes bearings; the look now LOCKS at death (e._lookLock). 1v1 RISK
   (his "I can miss a million shots and never take damage"): COUNTER-SNAP —
   tucked gunmen (in cover, not in the return pool) answer a BLOWN
   engagement from cover at 0.35x accuracy, 0.7x damage, so a miss is
   punishable at ANY enemy count; NO DAMAGE BEFORE THE DIAL holds (fires
   only after your dial resolves). GLIDE actually glides — cam ease
   0.14->0.055 AND the aim zoom eases (G._zbS, reset off-aim); SNAP toggle
   unchanged. HONEST CROUCH — take-cover pose now requires real stone
   (gcov, or hand-flag within 1.8 tiles of a pillar): nobody ducks behind
   air. Parent-side: combatSendSprites bakes walk both places (plaintext
   edits at out.dirs[d].walk / L.look.walk112). Gate 124 checks ALL GREEN;
   chromium-verified on the real alpha: walk bakes present all dirs, step
   plays frames, corpse look identical across worldShift, counter-snap
   sim 100->90 vs tucked gunman, zbS mid-ease, aim shot shows the deadeye
   body + board-scale dial arc. ANIMATION REQUESTS FOR PAOLO'S ANIMATION
   CHAT: records/BOHEMIA_COMBAT_ANIM_REQUESTS_7_20_26.txt (9 clips,
   priority-ordered: cover-rise + cover-drop are his named asks, then
   gun-walk, cover-fire, get-shoved, floor-rise, shiv-jab/bat-arc/
   spear-drive; graveyard-safe names; combat pulls any clip that lands in
   the pipeline with zero surgery). STILL OWED: rig gun-pose pipeline
   expansion; the plumbing re-examination pass; rhythm picks pending.
   BRASS IS FLOOR STATE (7/20, pass 21; Paolo's screenshot: "my shell
   casings follow me around instead of staying on the floor where I shot
   them"): root cause was the 7/3 AF v2 law written BEFORE movement
   existed — player brass stored as {p:1,dx,dy} player-anchored offsets;
   worldShift's mover skips entries with no ea/edist and the renderer
   drew them at cx+dx, glued to the screen-centered body. v21: brass
   lands with world coords at the tile you fired from (ea:0,edist:0 +
   pixel jitter), renders through fieldPos, rides worldShift like blood
   and corpses; the p-glue render branch is dead; the JUICE AF demo
   scatter converted too. BONUS: worldShift's 0.6-tile minimum clamp
   (exists so live enemies never stand inside you) no longer applies to
   STATICS — corpses, pillars, blood, litter shift with true minimum
   0.02, so walking over them never nudges them. Gate 127 checks ALL
   GREEN (one stale v19 blood string updated to mv(s,0.02)). Chromium
   verified: spawn brass, step E then S, brass reads 1 then 1.414 tiles
   away; walk back, it is where it fell; real fxShot landings carry
   world coords, no p flag. Shipped to main (b91d825, BUILD 7/20i).
   THE PLUMBING PASS, part 1 (7/20, pass 22; Paolo: "do what you have to
   do next"): re-read the whole engagement pipeline (doWait/doPop/
   enterAim/endTurnReturn/tickTurnEnd/coverSeekAI/acq clocks/wounds).
   THREE ROTS FOUND AND FIXED, all in the TWO-TURN RED LINE law:
   (1) MOVE BREAKS THE BEAD — the law text ruled "break the line (move,
   cover, stun, kill)" but only stun/kill were built; a gun held its bead
   across your step and shot you the turn you emerged, no warning. Now a
   move resets every gun's acq clock (a moving target is re-acquired);
   verified live: held beads acq 3 and 1 both reset on a step, guns
   restart at ACQUIRING. Balance note to watch: mobile play is now
   strong (move->pop = no aimed return fire, only the 0.35x counter-snap
   on a whiff); melee pressure + zero damage while dancing are the
   counterweights. (2) DANGER OUTRANKS ITS WARNING — the live RED threat
   line drew at 0.15 alpha vs its amber ACQUIRING warning at 0.32; red
   now 0.30, amber 0.18. (3) THE WARNING SPEAKS — fresh beads announce
   on damage-free turn ends: "ACQUIRING — n guns drawing a bead, one
   turn to break it" (both doWait and endTurnReturn ends). Gate 130
   checks ALL GREEN. CROSS-SESSION NOTE: commit b12842e ("Combat moves
   batch #13") — Paolo's Animation chat cooked the 9 requested clips and
   a sibling session wired them into the combat B64 (crouch-live cover
   phase, cover-rise into the aim, cover-drop on turn end, gun-walk
   steps, weapon swings, shoved/prone/rise bodies, counter-snap from the
   crouch); my v22 anchors updated to the b13 text, all markers green.
   STILL OWED / WHAT COMES AFTER (the roadmap): (a) rhythm build once
   Paolo picks numbers (my pick if told "you pick": 1 faction rhythm +
   3 bar phrases + 4 the break); (b) plumbing part 2 — wounds are
   cosmetic only (no mechanical bite), prone/stun stand-up has no
   telegraph, coverSeekAI has no behavior when no pillar exists (open-
   ground gunmen just stand); (c) enemy archetypes with VISIBLE immunity
   classes per the 7/19 research addendum (shove-resist classes still
   [PENDING Paolo]); (d) balance watch on move->pop after real play.
   FOUR ASKS, ONE PASS (7/20, pass 23; Paolo's screenshot message):
   (1) HONEST PLAYER CROUCH — b13 crouched you in EVERY cover phase,
   stone or not; now playerNearCover() (pillar within 1.8 tiles) gates
   the crouch, same law as the enemies' v20 honest crouch. The b13 gate
   (combat_anim_gate.js) had machine-locked always-crouch; check updated
   to the newer ruling. (2) ROAM FACES THE WALK — victory-walk steps set
   facing to the step direction (mid-fight facing stays threat-driven
   per the 7/4 LOCKED cover-stance law). (3) EXPOSURE HONESTY (his
   "why am I double exposing myself"): engaging a target you are ALREADY
   exposed to = fired from BEHIND your stone; the covered side gets NO
   aimed volley (they still counter-snap a whiff). Only popping AROUND
   the stone (target you were covered from) opens you to everyone.
   G._poppedOut tracks it per turn, chain-aware. (4) AUTO FRAME — in the
   cover phase the applied zoom (uzEff(), floors G.userZoom) always
   holds the farthest living enemy with a 96px margin for the bottom-
   right action ring; pinch works but cannot LOSE an enemy; aim glide
   and killshot cams untouched (they run outside the cover phase).
   Gate 134 checks ALL GREEN. Chromium verified all four: pillars=[] ->
   no crouch; far enemy at 24 tiles pulls uzE to 0.45 vs userZoom 1.4;
   covered-north gunman excluded from the volley when engaging the
   exposed-south target; roam step east faces east.
   THE FEEL RULING (7/20, passes 24-25; Paolo's big message): SEVEN
   builds. (1) VITAL NEVER CHAINS (LOCKED): a vital = 2-turn stun and
   the turn ENDS clean; only a KILLSHOT buys the next target. (2) NO
   DOUBLE EXPOSURE (LOCKED, supersedes v23's version): POSITIONAL
   exposure (posExposed: anyone you lack cover from, out OR cycling)
   kills the pop-out entirely — button reads SHOOT (they're out) /
   HOLD (exposed side cycling; melee still engageable) / POP OUT (only
   when fully covered). (3) LOS BEAD (LOCKED, supersedes v22 move-
   breaks-all): moving only resets guns whose LINE the step broke
   (myCoverAgainst after the shift); walking in the open keeps you
   tracked — verified pinned: open gun 2->3, broken-line gun 2->0->1.
   (4) THE DEAD LIE UNDER THE LIVING: corpse+dead-enemy under-pass
   before the player; the old over-draws stripped (flies stay on top,
   they fly). (5) UI cluster (fire + move ring) 18px->44px from the
   corner, ring never clips. (6) A VOLLEY IS A BIG DEAL: 2+ shooters
   play the FULL incoming cam even on a total miss + every volley
   rattles the frame (G._vShakeAt in applyShake). (7) KICK-LOCK +
   EAR-LOCK: machine sweep of every song table (records/BOHEMIA_COMBAT_
   MUSIC_SYNC_ANALYSIS_7_20_26.txt): the KICK is the one layer all 14
   combat songs share (step0 14/14, step8 12/14; alpha-wide 215/224).
   The dial ember + a new rim flash now pulse on FAC().kick (override-
   aware), and the pulse clock auto-compensates the device's AudioContext
   outputLatency (the research-consensus mobile feel-killer). Research
   addendum: laws/BOHEMIA_ADDENDUM_DIAL_SYNC_AND_LAB_RESEARCH_7_20_26.md
   — also pitches LAB ROUND 3 modes (E QUEUE, F PHRASE, G BREAK,
   H METRONOME DUEL), build on thumbs; my pick E then F. PROCESS NOTE
   (banked): v24 rewrote v22's marker text and broke patch22's
   idempotence guard — guards must accept successor markers when a later
   patch rewrites their text (fixed: patch22 accepts 'V24 LOS BEAD').
   Gate 140 checks ALL GREEN. [PENDING Paolo]: tap-to-calibrate setting;
   whether kick-timed shots should ever earn anything mechanically;
   lab round 3 thumbs.
   THE THREE-MESSAGE STACK (7/20, pass 26 + lab round 3 BUILT): Paolo
   sent three feedback messages ("don't do anything yet" x2, then go).
   ALL BUILT: (1) HONEST MISS — incTick was calling feltHit() (stagger,
   hit-stop, red punch, sndHit, contact spray) for every incoming-cam
   contact even on all-miss volleys; G.inc.miss now routes misses to
   cracks + frame rattle, tracers fly PAST (offset per shooter), no
   spray, body stays cool. Verified: forced miss cam, _pHitAt stayed 0.
   (2) ONLY A KILLSHOT CHAINS — vital/hit deaths set G._noChain; the
   double-shot without a killshot is dead at the root (his repeat
   report; the leak was incidental deaths chaining via afterKill).
   (3) THE WOUNDED LEAK — <=30 HP: trail spot on every step (pushed at
   origin pre-worldShift) + fat double pool standing (his 10% report).
   (4) FAKE COVER IS DEAD — chip/body tap-to-toggle-cover deleted
   (debug-era), e.inCover drives NOTHING; gcov=(pillarBetweenMe &&
   nearPillar) — stone must be near HIM; open men now actually run
   (his "breaking your AI" diagnosis was right: the fake flag made
   coverSeekAI skip men standing in the open). Taps only SELECT
   victims. combat_anim_gate check updated to the newer ruling.
   (5) SMART CAM — auto-frame frames the LIVING (tightens up to 1.30x
   as they drop); pinch/pan takes the wheel for 5s then auto resumes;
   manual zoom-in restored (his "dog shit" cap removed). (6) DEFAULT 8
   ENEMIES. (7) TARGETING AUTO/MANUAL (settings; default AUTO):
   closest-first order always (knife runner outranks far gun); tap
   picks the first victim in auto; MANUAL pauses the chain on CHOOSE
   NEXT until he taps the next man (WAIT/MOVE = decline = engaged
   volley fires). (8) GRIT SHOTS perk 0..3 (the floor): a miss spends
   grit instead of the turn, dial reopens on the same man; KILLSHOTS/
   TURN stays the ceiling. (9) NO-DOUBLE-EXPOSURE doctrine re-affirmed
   (v24 build stands: HOLD/SHOOT/POP OUT). LAB ROUND 3 BUILT (his ask
   "make sure your next update will have those new play test
   additions"): E THE QUEUE (load 3 moves/shoves/waits, RUN BAR
   executes one per beat, enemies act between; fire stays live) and
   H THE METRONOME DUEL (one gunman fires ON the kick every 2nd world
   turn if he has your line — stone blocks it, off-beat is the window)
   are PLAYABLE in the BEAT TACTICS LAB with verdict thumbs rows
   (queue:up/duel:up in the export). Headless sims in the gate: duel
   alternates kick/off and wounds 18 per open-line kick; queue runs a
   4-enemy weapon mix clean. LAB BUG BANKED: S.beat increments in BOTH
   commitPlayer and worldStep, so beat-parity at worldStep time never
   alternates — use S.turn (ticks once per world beat) for any
   every-N-beats enemy logic. Gate 151 checks ALL GREEN.
   THE LAB IS DEAD, LONG LIVE THE DEMO (7/20, verdict 2 + pass 27):
   Paolo's final lab verdict ("i didnt like any of your beat tactics
   they were ass tbh only i liked shove so far"): ALL lab grammars DOWN
   (A/B/C/E/H — graveyard registry LABFAIL-*, verdict verbatim in
   records/BOHEMIA_COMBAT_LAB_VERDICT_2_7_20_26.txt). Mechanics that
   graduated BEFORE the verdict stay canon (separately ruled): weapon-
   typed melee, foresight perk, shove + perks, KICK-LOCK. THE SURFACE
   RETIRED: alpha combat tab hosts the Dead Eye Dial demo full-time
   (switcher deleted); lab slice + template + gen tool moved to
   /archive with registry lines; combat_lab_gate.js REWRITTEN as the
   COMBAT GATE (demo-only: engine block presence, MELEE CORE sims, all
   v2..v27 markers, walk bakes, lab-retired assertion) — 105 checks.
   POST-MORTEM BANKED: research ranks candidates, only PLAY decides;
   combat ideas go INTO the dial demo behind settings, never into side
   surfaces. AUTO TARGETING FIXED (pass 27, his "still isnt right"):
   root cause — a tapped pick (G.selTarget) persisted FOREVER, so
   after one tap every later auto engagement aimed at the stale pick
   instead of closest-first; plus G.popTarget could carry a stale index
   through enterAim's short-circuit. v27: a pick is SPENT by the dial
   it opens; popTarget resets at every turn end. Verified live:
   adjacent knife auto-targeted first, tap-pick hits the far gun once,
   next engagement back to the knife. ALL GREEN.
   THREAT ORDER FINAL (pass 28, Paolo shouted it): auto order is a
   strict ladder — 0 blade AT you (<=1.6 tiles) > 1 exposed guns
   closest-first > 2 closing blades > 3 the rest; distance only breaks
   ties inside a rung. Verified: knife at 5 + exposed gun at 8 targets
   the GUN; knife at 1 tile takes over. Gate 106.
   RECKLESS POP + CROUCH-FIRE PLUMBING (pass 29, his next message):
   (1) the pop button ALWAYS fires — popping when nobody is out (or
   while the exposed side cycles, no blade to engage) stands you into
   every held bead: acq-holders take opportunity fire at 0.8x with NO
   cover softening, turn spent either way ("POPPED INTO NOTHING" /
   "RECKLESS POP" reads). LAW NOTE: same damage class as waiting
   exposed (enemy-turn fire); NO DAMAGE BEFORE THE DIAL governs the
   engage flow and holds. Verified: pop into a held bead cost 14.
   (2) CROUCH-FIRE: Paolo owes 'crouch-aim-1h'/'crouch-aim-2h' from
   the Animation chat (records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_7_20_26
   .txt — 9-phase deadeye-style sweep, body low). The alpha bake
   (guarded on CLIPS membership) and the demo pose path (from-cover
   engagements prefer caim frames) are PRE-WIRED: zero surgery the day
   the clips land. His mixing rule (crouch-fire targets vs pop-out
   targets never share a turn) already holds structurally: shoot-mode
   pools exclude the covered side; pop mode only exists fully covered.
   RESEARCH ROUND 4 (his "present me ideas"): laws/BOHEMIA_ADDENDUM_
   JUICY_COMBAT_IDEAS_7_20_26.md — 8 pitched: 1 EXECUTION (adjacent
   stunned/prone killshot refunds the chain slot), 2 NERVE (morale,
   erratic survivors, the last man breaks/surrenders), 3 SUPPRESSING
   BURST (spend the engagement to cancel a peek + reset a bead),
   4 OVERWATCH STANCE (dial-gated interrupt), 5 HUMAN SHIELD,
   6 WOUNDED GUNS SHAKE, 7 FACTION TELLS (rhythm signatures),
   8 THE PRICE OF FALLING (Sifu-adapted scar, no run-reset). My pick
   if told: 1+3 then 2. [PENDING Paolo: pick numbers.] Gate 108 ALL
   GREEN. NOTE ALSO: Paolo reported "skins gone" — investigated hard:
   character/clothes/combat all healthy on tip, character UI byte-
   identical to pre-storm; combat session never touched skin code; if
   he reports again get the exact tab + screenshot and trace commits.
   THE IDEAS VERDICT + v30 "KILLING ISN'T CLEAN" (7/20, pass 30):
   Paolo ruled the menu: 1 EVOLVED into DOWNED-NOT-DEAD (built),
   2 NERVE loved (built v1), 3+4 need convincing (pitch again),
   5 HUMAN SHIELD liked (design pending), 6 built, 7 shelved, 8 ruled
   (scars persist unless flawless — already true: G.wounds never
   clears across encounters, addWound only fires on damage). BUILT:
   a KILLSHOT on a human drops him DYING at 1hp (fall plays via
   _fellAt, then prone on the floor, bleeding heavy via bleedTick);
   he is out of every combat read (peeking/firing/hasLine/alive/
   melee/AI/acq/snap/reckless/threat-lines all exclude downed+broken;
   aliveEnemies redefined so the FIGHT ends when nobody can fight);
   every 5th turn he crawls one tile toward the nearest downed/dead
   friend smearing blood (crawl-dying CLIP requested — records/
   BOHEMIA_COMBAT_ANIM_REQUESTS_2 round 2b; prone slides until it
   lands); the contextual button on an adjacent dying/surrendered man
   becomes FINISH (finishHim: instant corpse, no second fall, blood
   burst; costs the turn mid-fight, free on the victory walk) — SPARE
   is walking away. Incidental deaths (vital/hit to zero) stay clean
   deaths. NERVE v1: past half the crew down each survivor rolls
   10% +6% per body past half at turn end; broken = hands-up (bake
   handsup112 both sides, V30B loader), out of the fight, finishable
   or sparable. Perk hooks [PENDING]. WOUNDED GUNS SHAKE: <=40% fires
   0.8x, tracers wobble. Gate 115 ALL GREEN; verified live: pools
   exclude, crawl moved a tile, FINISH GOON (dying) button, nerve
   broke a survivor. NEXT: re-pitch 3 (suppressing burst) + 4
   (overwatch) convincingly; design 5 (human shield) concrete;
   NERVE tuning + perks pending Paolo.
   AUTONOMOUS HARDENING PASS v31 (7/21 overnight, Paolo asleep: "do some
   big brain awesome shit"): I hunted the DOWNED/NERVE system for bugs
   before Paolo could hit them. FOUND + KILLED A SOFTLOCK: tickTurnEnd
   runs the nerve roll, but NO turn-settle path re-checked the win after
   it — so a nerve break (or a downing) that cleared the last standing
   fighter during a WAIT/covered turn left aliveEnemies()===0 with the
   win screen NEVER firing. You'd be stranded among crawling bodies,
   WAIT/MOVE doing nothing, no AREA CLEAR. This would have enraged him.
   FIX: checkClear() helper wins the instant nobody can fight; called
   after tickTurnEnd on EVERY path (doWait, endTurnReturn, recklessPop,
   endTurnClean). ALSO v31: the FINISH now lands with weight (hitstop 10
   + heavier double blood pool + haptic thud); the crawl DRAGS a smear
   at both ends (where he was + where he dragged to), reads as a body
   hauled, not a drip. VERIFICATION (rigorous): (S1) nerve breaks the
   last fighter on a WAIT -> win fires (over/win/phase=over, alive 0);
   (S2) downing the last man + settle -> win fires; (S3) FINISH on the
   victory walk works, hitstop applied, 0 errors. FUZZ: 15 fights of
   randomized real actions (39 real fire() shots, doPop/doWait/doMove/
   finish) -> 0 page errors, every fight reached a terminal state
   except random hide-and-run-forever (legit player choice, not a dead
   state). WAIT-FOREVER probe: pure passivity -> enemies build beads ->
   you DIE at turn 135 (passivity punished, always terminates). VISUAL
   QA on the real canvas: dying men lie in death poses with blood pools,
   crawl smears extend, FINISH button appears, button reads HOLD with a
   live exposed enemy — the "killing isn't clean" aesthetic confirmed.
   Gate 118 (combat) + 74 (anim) ALL GREEN. Shipped c02e395, stamp
   7/21e. DISCIPLINE NOTE: stopped after v31 rather than sprawl into
   reserved canon (nerve numbers) or un-greenlit features (3/4/5) while
   he slept. STILL TEED UP FOR HIS "GO": pitches 3 SUPPRESSING BURST +
   4 OVERWATCH STANCE + 5 HUMAN SHIELD (concrete designs in the reply
   + laws/BOHEMIA_ADDENDUM_JUICY_COMBAT_IDEAS_7_20_26.md) build fast
   the moment he says go; crawl-dying + crouch-aim-1h/2h clips owed
   from his Animation chat (pre-wired, live on landing).
   THE DIAGNOSIS PASS v32 (7/21, Paolo's giant message — five real bugs
   found by reading code, not guessing, plus four new rulings):
   (1) THE HOLD SOFTLOCK, his most-repeated complaint ("action button
   never goes green," "1v1ing this enemy... never a good time to shoot
   him"): posExposed() counted ANY uncovered gunman as blocking POP OUT
   forever, even a single covered-but-not-peeking enemy in a 1v1, even
   downed/broken men. NO DOUBLE EXPOSURE now only gates when there's
   BOTH a covered side to protect (new coveredFromMe()) AND a genuine
   exposed threat — a lone covered enemy just runs the normal flow.
   Verified exact: 1v1, I lack cover, he's off-cycle -> button correctly
   reads POP OUT, not stuck HOLD. (2) THE SILENT READOUT: #cread was
   retired by an earlier session and setRead() has been hiding it ever
   since — EVERY message (GRIT, NERVE BROKE, KILL ARC, ACQUIRING) has
   been writing to memory and showing NOBODY anything, which is why
   "grit shots" and "kill arc" read as unexplained bugs. Rebuilt as a
   real top-left action log — root-caused TWICE: v32b/c fixed the
   text/legibility (dark backing panel, not a thin shadow), but the
   REAL bug (v32d) was that draw() has two exit paths and the COVER-
   PHASE one (95% of play) returns early via screenOverlays before ever
   reaching the tail where the log lived — proven with a pixel-exact
   before/after diff (calling drawActionLog directly changes 3429/4500
   sampled pixels; calling real draw() in cover phase changed ZERO).
   Now called from both exits. Chromium-screenshot-confirmed readable.
   (3) DELAYED BLOOD: a killshot survivor's floor pool didn't appear
   until the NEXT tickTurnEnd; now it drops the instant he falls.
   (4) NERVE TOO LIBERAL (his "kill half, walk away 5 turns, rest
   surrendered"): the roll fired every idle turn once half the crew
   was down; now gated to fire only the turn a NEW casualty happens
   (G._nerveLastDown tracking), rate bumped since it's now a rare,
   meaningful check instead of a grind. (5) KILL ARC EXPLAINED, not a
   bug: SEC-BOT has 160 base hp; a flat 100 killshot leaves it at
   60/160=37.5%, exactly his "drops to 40%, shoots again" report — now
   legible via the fixed readout instead of feeling broken.
   NEW RULINGS: WEAPON-GATED LETHALITY (records/BOHEMIA_COMBAT_
   LETHALITY_RESEARCH_7_21_26.txt, NTDB-sourced floor): pistol 0% never
   auto-kills on a killshot (always downs — his pacifist tool), smg
   15%, rifle 35%, shotgun 100% always dead-dead (his exact ruling,
   skips DOWNED entirely). KNEEL AND BEG: within finish range a downed
   man switches from crawling to hands-up kneeling, wiggling pleading
   text cycles above his head (same for broken/surrendered men).
   MANUAL TARGET RING + SELECT A TARGET prompt for manual targeting
   mode. Gate 128 (combat) + 74 (anim) ALL GREEN. Full scene chromium-
   verified together: log legible, "I'm done, I'm done" begging text,
   FINISH GOON (dying) button, all reading correctly at once.
   THREAT-REACH FIX + LETHALITY/NERVE RETUNE (7/21, pass 33, his design
   Q + follow-up bug): "not a big concern rn" design chat about KILL
   ARC chaining answered without code (recommended: end the turn like
   vital does, don't auto-chain, so armor costs real tempo — his call
   pending). Then the REAL bug: v28's threat-order rank-0 check used a
   flat 1.6-tile distance, ignoring each blade's ACTUAL reach and
   windup state — a spear (reach 4.2) or even a shiv at 1.9 tiles
   (just past the old flat cutoff) could rank BELOW a distant gun even
   while genuinely about to strike; his exact "jumping over my cover
   to shank me and I'm still not targeting them." Fixed: rank-0 is now
   windup (a LOCKED strike, no matter the distance) OR within the
   enemy's own reach stat + margin. Verified live: spear at 3.5/reach
   4.2 now ranks first (old check would've missed it); windup locks
   priority even at edist=6; shiv at 1.9/reach 1.8 now ranks first
   (old flat 1.6 would've missed it too). Also retuned per his ask +
   fresh research (records/BOHEMIA_COMBAT_LETHALITY_RESEARCH_7_21_26
   .txt, addended): pistol killshot lethality 0%->20% (general civilian
   handgun GSW fatality runs 10-22% even unaimed — 0% was dishonest),
   smg 15%->35%, rifle 35%->55%, shotgun unchanged 100%. NERVE roll
   0.18/0.08 -> 0.10/0.05 on top of v32's event-gating (his "kill half,
   walk away, they all surrendered" — hit twice now). Verified live:
   pistol killshot at roll 0.15 (under the new 0.20) now kills outright.
   DESIGN INTENT BANKED for later: Paolo wants mercy/surrender rates
   to eventually live behind PERKS (an unlock investment) rather than
   flat baseline numbers, once the game nears feature-complete — same
   doctrine as grit shots. [PENDING Paolo: perk-gate this when that
   pass comes; flat table is the honest baseline until then.] Gate 131
   (combat) + 74 (anim) ALL GREEN.
   ARMOR COSTS A REAL TURN (7/21, pass 34): the killshot-armor design
   question got answered without code first, Paolo liked the call —
   "even if we deal maximum damage it will be treated as a vital for
   armored opponents I like that robot or people." Built exactly that:
   a KILL ARC survivor (took KILL_DMG, still standing — bots, elites)
   now resolves like a VITAL — stun 2 (no stun-lock), turn ends CLEAN,
   no auto-chain, no same-turn re-target. Armor used to cost nothing
   but an extra click; now surviving buys the target a real turn back.
   Also answered "wtf is a grit shot" plainly in the reply (the floor
   to KILLSHOTS/TURN's ceiling — a miss spends a grit instead of ending
   your turn) since the v32 readout fix meant he'd never actually SEEN
   its message fire. Verified live: 160hp SEC-BOT takes a shotgun
   killshot, ends at stun 2, alive, not dead/downed/broken, no chain.
   Gate 132 (combat) + 74 (anim) ALL GREEN.
-5. LOOP DROPPED + TWO NEW SESSIONS BRIEFED (7/19): Paolo RULED the loop away
   (laws/BOHEMIA_ADDENDUM_LOOP_DROPPED_7_19_26.md): Bohemia is NOT one-life
   permadeath; death/failure meaning stays [PENDING Paolo]. Stop planning
   run-resets. He is opening dedicated LIFE and COMBAT sessions -- briefs:
   laws/BOHEMIA_SESSION_BRIEF_LIFE_7_19_26.md (agents/economy/factions,
   branch claude/life-session) and laws/BOHEMIA_SESSION_BRIEF_COMBAT_7_19_26
   .md (fun-first beat combat, NO DAMAGE BEFORE THE DIAL, branch
   claude/combat-session). Wardrobe stands at 78 CANON, all categories.
-3b. MUSIC: FULL-CATALOG VERDICT + CATEGORY LAW + BATCH 14 (7/19, PROCESSED):
   Paolo judged EVERYTHING after 30 min of listening. Nearly all CANON. FIVE
   DOWN graveyard-final (removed from MLOOPS/NEW_VIBES/CANON_DEFAULTS, registry
   tokens added, lead voices retired): A PRAYER WOUND BACKWARDS + THROAT OF THE
   DROWNED NAVE (batch 11), THE TIDE THAT KEEPS THE NAMES + A CHORD OF DROWNED
   BELLS + LAST BREATH OF THE ORGAN (batch 12). Batch 12 survivors canon.
   MUSIC CATEGORY LAW (locked, in the embedded lawbook): EDIT button DEAD ("I'm
   never editing shit"), replaced by the CAT button -- checklist of HIS
   categories (one per faction, MENU, OVERWORLD NIGHT / DAY / DUSK+DAWN; the
   old overworld = the NIGHT set, his ruling). His 7/19 assignments baked as
   CAT_DEFAULTS (SERVER FARM + DELTA BLUES -> NETWORK, FLUORESCENT DAWN ->
   CHURCH, DEAD MANS SLIDE -> HOMELESS "elder and King Hobo", HIGHWAY 15 SOUTH
   -> CARAVANS, THRONE OF STATIC -> REMNANTS, PYREFLIES RISE -> DAY, TWO COINS
   FOR THE FERRYMAN + THE WIND LEARNS WORDS -> DUSK/DAWN, CAMPFIRE CONFESSION +
   THE VAULT + THE CHOIR THAT STAYED + THE ORGAN IN THE DROWNED CHAPEL ->
   NIGHT). UI groups by category (faction vibes ride indented under the
   faction's hymns; 3 overworld sections); categories ride the export; city
   shuffle picks by CITYMUS.phase (NIGHT until a world clock lands -- the clock
   builder sets phase). UNJUDGED LAW fix (caught on the real surface): fresh
   cooks no longer pre-bake CANON_DEFAULTS=2; unjudged = absent = NEW badge +
   thumbs live. BATCH 14 cooked answering the 5 graves (shepardfall/sourdyad/
   unisonsplit/spectretide/strikeswell -- Shepard glide, interval morph,
   detune-spread envelope, noise ring-mod, strike-into-swell). NEW set = batch
   13 (6) + batch 14 (5) = 11 unjudged. Records: BOHEMIA_MUSIC_VERDICT_RECORD_
   7_19_26.txt, BOHEMIA_MUSIC_BATCH14_7_19_26.txt. NEXT: his verdict on the 11;
   [PENDING Paolo] re-file CAMPFIRE CONFESSION / THE VAULT if not night.
-3a. MUSIC BATCH 13 — NEW BADGE, PENDING VERDICT (7/19): pure expansion, no open
   slots. 6 songs, 6 voices born: THE REED THAT HOLDS ITS BREATH
   (pwmreed, true comparator PWM), SOMETHING SINGS THROUGH THE PIPES
   (filterfmgrowl, audio-rate filter-FM), WIND THROUGH THE COUNTING HOUSE
   (aeolianharp, wind-excited resonator bank), WHAT THE DRAWBARS REMEMBER
   (drawbarmorph, crossing drawbar envelopes), THE SHAPE THE WATER TAKES
   (wavemorph, dual-waveshaper antiphase morph), TWO LIGHTS OVER THE FLOOD
   (harmonictrem, band-split antiphase tremolo). Offline-render balanced
   0.10-0.20. Record: BOHEMIA_MUSIC_BATCH13_7_19_26.txt.
-3. MUSIC BATCH 12 + GRAVEYARD SWEEP — JUDGED 7/19, see -3b (7/18): Paolo's
   mega-verdict thumbed nearly the whole catalog CANON, killed 6 (SUNKEN VESPERS,
   UNDERTOW, VIA PURIFICO, HYMN IN THE FLOOD, THE DROWNED CHOIR, WHAT THE GLASS
   REMEMBERS — first 3 were briefly canon, newest verdict wins, GRAVEYARD FINAL).
   Swept from MLOOPS/NEW_VIBES/CANON_DEFAULTS, doc copies tombstoned, registry
   tokens n:'NAME' added (graveyard gate 0 live refs). BATCH 12 answers the slots:
   THE TIDE THAT KEEPS THE NAMES, WHERE THE PROCESSION DROWNED, A CHORD OF DROWNED
   BELLS, THE HYMN THE STATIC ATE, LAST BREATH OF THE ORGAN, THE BELL THAT COOLS
   TO SALT — 6 new topologies (Chebyshev/noise-flute/cluster/bitcrush/bellows/
   stretched-bell). Records: BOHEMIA_MUSIC_GRAVEYARD_7_18_26.txt. NEXT: verdict.
-2b. CLOTHING — ALL 51 CANON, COOKING EMPTY (7/18 end of day): the whole
   wardrobe is approved (tops incl. plaid flannels/henleys/button-ups/hoodies,
   pants, shoes, open coats, vests). The hoodie took SIX rounds because four
   stacked defects hid behind broken verification -- now LAW + GATE:
   laws/BOHEMIA_ADDENDUM_VERIFY_ON_THE_REAL_SURFACE_7_18_26.md (verify only on
   the real preview canvas; look before shipping; symptom-survives-content =
   pipeline bug; audit blanket rules per facing; audit generator inheritance)
   + gates/hood_gate.js (11 checks) + CLAUDE.md pointer. Render-order note:
   the CLO_PREVIEW garment hook now runs LAST in buildFrame (after SKIN_DETAIL).
   WARDROBE 66 CANON, BATCH 13 COOKING (7/19 latest): shades approved --
   accessories COMPLETE, every category exists. Batch 13 (12 cooking): new
   structures (turtlenecks via neck:'turtle', knee-cut shorts via cut:'short',
   slouch beanie via slouch:true) + first colorway wave off approved bases
   (slate plaid flannel, sand hoodie, rust striped tee, denim vest, slate
   sneakers, copper scarf, charcoal dust mask). NEXT: Paolo thumbs -> full
   colorway multiplication toward 500-800 -> his renaming/act/rarity passes.
   FACE CALIBRATION BAKED CANON (7/19): Paolo calibrated + exported; offsets
   baked VERBATIM into FACE_OFFSETS (records/BOHEMIA_FACE_CALIBRATION_7_19_26
   .txt -- the big one: profile nose moves 6px toward the facing). SHADES v2
   back in COOKING, anchored to the TRUE iris pixels + calibration + head bob
   (widest-row heuristic = fallback only; canon masks untouched).
   FACE CALIBRATION SHIPPED (7/19, superseded by the bake above): 7/8 accessories canon
   (wardrobe 65); BLACK SHADES shelved NOT dead (his words) until he
   recalibrates the per-direction EYE positions. The dormant FACE_OFFSETS
   system is wired into the render (facial px classified brows+iris/mouth/
   skin-marks -> eyes/lips/nose, moved never reshaped, cache re-keys) and a
   FACE CALIBRATION panel lives in the face editor (tap portrait, CHARACTER
   tab): facing + feature + arrow nudges on the live char + EXPORT .txt.
   [PENDING Paolo]: calibrate + export -> bake offsets as canon defaults ->
   re-cook shades v2 on the true eye pixels. Mini-expressions (brows/lips)
   ride these same per-feature rails later.
   ACCESSORIES FACTORY BORN (7/19, "keep cooking"): genAcc -- 5 zone-locked
   facing-aware types (scarf/mask/shades/gloves/belt), new layers neck/face/
   hands/waist. THE EYE LINE = the widest rows of the face part (probed, not
   guessed); masks start below it, shades sit ON it, gate #ACCESSORY (13 checks)
   enforces. 8 IN COOKING pending thumbs: DUST/OXBLOOD SCARF, BONE/OXBLOOD DUST
   MASK, BLACK SHADES, LEATHER/SOOT GLOVES, LEATHER BELT. Wardrobe 58 canon
   (all headwear approved; DESERT WIDE-BRIM renamed CHINESE RICE FARMER HAT by
   Paolo's ruling). AFTER: colorway multiplication toward 500-800, then Paolo's
   renaming/act/rarity passes.
   HEADWEAR FACTORY BORN (7/18, "do what you have to do next"): genHat --
   beanie/cap/wide-brim/wrap, facing-aware, on the skull, never the eyes (the
   FOREHEAD BAND rule) or body. Layer 'head'. Gate #HEADWEAR (hat_gate.js, 12
   checks). 7 hats IN COOKING pending thumbs (DUST/COAL BEANIE, SALVAGE/RUST
   CAP, DESERT WIDE-BRIM, OXBLOOD/OLIVE HEADWRAP).
   WHAT COMES AFTER (standing roadmap): accessories factory (~16%: scarf/mask/
   glasses/belt/gloves) -> colorway multiplication off approved bases toward the
   500-800 target -> Paolo's passes (renaming process, act + rarity assignment,
   faction dress, world-grade ruling -- his, never mine).
-2. MUSIC BATCH 11 — JUDGED (7/18 cook, 7/19 verdict): 3 CANON (THE CHOIR UNDER
   THE RESERVOIR, BONE RELIQUARY, THE TURBINE STILL TURNS), 3 DOWN graveyard-
   final across the two verdicts (WHAT THE GLASS REMEMBERS killed 7/18; A PRAYER
   WOUND BACKWARDS + THROAT OF THE DROWNED NAVE killed 7/19; wailmorph/
   throatsong/foldchoir voices retired). Record:
   records/BOHEMIA_MUSIC_BATCH11_7_18_26.txt (tombstoned).
-1. CLOTHING FACTORY — CANON MENU LIVE, all 9 approved (7/18): CLOTHES tab now
   has a COOKING area (fresh candidates + thumbs) and a collapsible CANON WARDROBE
   (approved items collapse in, each with a CANON chip; only visible rigs animate).
   Thumb UP promotes cook->canon, DOWN->graveyard. All 9 garments are canon
   (records/BOHEMIA_CLOTHING_CANON.txt). A WORLD GRADE toggle (default off) grades
   cloth to world ambient RGB(67,61,56) like the skin — [PENDING Paolo: bake it in
   or keep clean catalog colors?]. NEXT: cook more clothing batches into COOKING;
   on an approved template, build the colorway/wear variant factory.
-1b. CLOTHING FACTORY v2 — LIVE RIG (superseded by -1 above): the CLOTHES
   tab in the alpha now renders every garment ON THE LIVE ANIMATED CHARACTER
   (not a mannequin — Paolo: "I really wanna see it on the live skeleton"). How
   it works: buildFrame has a CLO_PREVIEW hook (~line 3628) that paints the
   garment onto the DEFORMED body grid, so each piece rides the real rig at the
   idle beat in any of 8 facings. Generators (window.CLO, ~line 8032): genTop
   (collar + neck hole + button placket + sleeve cuffs), genPants (hip
   waistband + belt + fly + rolled ankle hems), genShoes (dark sole + light
   midsole + tongue laces + padded collar). Batch of 9: RED SHIRT, WHITE TEE,
   BLACK TANK, GREEN FLANNEL, BLUE JEANS, BLACK CARGOS, GREY SWEATS, WHITE
   SNEAKERS, BROWN BOOTS. Thumb up/down + comments -> exports verdict .txt.
   Batch 1 (flat body-traced, no detail) all went DOWN -> graveyard
   (records/BOHEMIA_CLOTHING_GRAVEYARD.txt). NEXT: process Paolo's v2 verdict;
   the UP ones become silhouette/coverage TEMPLATES that spawn variants
   (palette-swap + wear-state factory — research banked: seed-vs-variant split,
   hand-author bases, automate variants). Live canvases throttled ~12fps.
0. THE INTERSECTION EXISTS (7/17 evening, Paolo asked, same turn): blockgen
   type 'intersection' — two roads crossing, clean box (no paint inside, per
   real anatomy), four crosswalks at the box edges, medians stopping at the
   crossings, left-turn pockets feeding every approach, corner lamps. LINE
   COLOR gate grew 6 intersection checks (30 total). A real anatomy bug was
   caught mid-build (B-side lanes started with a divider against the median;
   fixed half-aware). The graphics core's inlined blockgen re-inlined from
   canon AGAIN (second time today — the sync gate keeps earning). Baked proof:
   slices/BOHEMIA_V12_INTERSECTION_PROOF_7_17_26.png. ALSO: the v1 arrows were
   ruled illegible at phone zoom (Paolo: "wtf is the purpose of these lines")
   — BOLD marking candidates cooked (banks/BOHEMIA_MARKING_BOLD_CANDIDATES_
   7_17_26.txt, UNJUDGED: 5px shafts, solid tips, edge-positioned pocket
   lines); the intersection proof renders them and IS their judging surface.
   If Paolo blesses the proof, bold goes through the verdict->volume flow and
   the v1 confetti arrows get graveyarded FOR ARROWS (per-class rule).
0b. FIRST COMMISSIONED ORIGINAL ART (7/17 night, Paolo's call: "you could
   hallucinate and actually draw yourself"): Vegas mast-arm TRAFFIC SIGNALS,
   drawn from scratch in the corpus style. tools/bohemia_traffic_signal_
   factory.py -> banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt: 12
   sprites, 3 mast variants (two-head+sign / three-head arterial / two-head+
   pole-mount+sign) x dead/red/amber/green. FOUR COOKS TO GET HERE, lessons
   banked: v2 sampled lum 40-150 off the lamp and built all-rust orange
   poles (the lamps' DOMINANT metal is the near-black cluster); v3 went
   dark-flat with per-pixel flecks and Paolo's zoom verdict was "looks like
   dog shit in comparison" — THE CRAFT LESSON: the corpus is PAINTED, not
   filled. v4 paints: tone ramp sampled from the lamp (5 steps + warm rust
   cluster), cylindrical shading with a dithered highlight band, 1px
   silhouette outline pass, rust as coherent BLOTCHES + drip streaks below
   joints (never confetti), stacked base discs, bulged collars, rivet seam,
   cap. ALSO FIXED: seed used hash(state), which is process-salted — the
   determinism law was silently broken v1-v3; fixed mapping now. THEN v5,
   because Paolo ruled a NEW LAW off v4: THE 45 DEGREE ART LAW ("every art
   ... has to be viewed from like a 45 degree angle... yours is like a flat
   90, like it's a 2D scroller"). All original art is three-quarter view:
   ellipse cross-sections, sky-lit visible tops, bands bow toward the
   viewer. Law: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md +
   CLAUDE.md law list; GATE THE SAME TURN: gates/art_45_gate.py (gate #18,
   ellipse-base + top-lit machine proxies on every registered commission
   bank). v5 stands on stacked ellipse discs with a lidded cap, bowed
   collars, sky-lit arm, heads with visible top + side faces. THEN v6
   (Paolo: "so close... do better. It's not good enough yet"), self-diagnosed
   against the lamp: (1) SHAPE — the arm is now a real smooth quadratic
   curve off a low junction, capped pole showing above it, nothing straight;
   (2) RANGE — a true 'spec' brass tone sampled at p97 of the lamp rides the
   highlight bands, rims, and clamp tops; (3) CALM — grain cut to 10%, bands
   decisive; (4) STORY — rust blob centers seeded below collars, base skirt,
   arm junction (where water sits), not scattered. THEN v7 (Paolo circled
   the base on his phone): OCCLUSION LESSON — the base discs drew AFTER
   the pole and read as standing in FRONT of it. Draw order IS depth:
   base first bottom-up, pole planted INTO the top disc (ends at its
   center line), back halves hidden, front rims wrapping the foot.
   Applies to every planted prop from now on. THEN v8 (Paolo's expansion,
   7/18 early): ARM LAW — arm reach tracks street width (1 lane -> short
   2 cells / 2 -> med 3 / 3 -> long 4.5, heads 1/2/3 like real warrants;
   mapping shipped in the bank as arm_law). COLOR RESEARCH — real masts
   are hot-dip galvanized (25-50yr zinc coat): majority weather to dull
   GRAY with rust at joints; only stripped ones brown to the lamp family.
   Two families cooked: galv + bronze. WRECKS — fallen_arm (jagged stub,
   span on the ground with a dead head still bolted), jury_rigged (lash
   splice, sags past it), headless (empty hangers, dangling cable).
   EAST+WEST both shipped per sprite with per-entry pcx anchors (bake
   reads pcx, no transpose). DOUBLE BORDER — sampled rim + 1px true black
   (Paolo: reading thin). THEN v9 (Paolo: "what about when it's facing
   north or south"): FACE LAW — in the billboard convention heads either
   face the camera (face s, lenses, serves northbound) or away (face n =
   the BACKS: yellowed plate, ribbed panel, visor edges poking out, no
   lenses; lit shows only as colored light SPILL around the housing;
   sign backs are unpainted metal, no green, nothing to read). Every
   intact mast ships both faces; the proof now stands all FOUR corners
   (south side faces, north side backs). THEN v10-v12, THE EAST/WEST
   SAGA (two wrong swings, banked so nobody swings wrong again): v10
   made skinny side-profile heads — Paolo circled them ("this is how the
   stoplight has to look, bro come on"): a stoplight NEVER diets, full
   mass always. v11 kept full heads on the horizontal arm with biased
   lenses — still wrong. THE RULING (v12, Paolo verbatim): "if its
   facing west or east it wont be having the stop lights extending east
   or west, left or right — it will be UP OR DOWN." Face e/w = the arm
   runs VERTICALLY on screen, spanning the EW road: arm_dir n (up) or s
   (down), FULL map length per the ARM LAW (grid distances never
   foreshorten in the billboard world), elbow + junction collar + tip
   cap, full-mass heads hanging along the arm at 66px spacing (46
   overlapped them into a totem), lenses biased toward the facing edge.
   draw_mast extracted and shared by both orientations. base_y per bank
   entry (vertical-south sprites extend below the pole foot; the bake
   anchors on base_y). MIRROR TRUTH RULE: flipping swaps e<->w and the
   bank stores the face AFTER the flip. THEN THE FACING-THE-STREET
   ARRANGEMENT (Paolo's arrow sketch on the proof, 7/18): one mast per
   SIDE, arms circling the intersection counterclockwise, every mast's
   lights facing the oncoming traffic on the road they hang over — N
   side arms east + lenses south (serves northbound), E side arms DOWN
   + lights west (eastbound), S side arms west + backs north
   (southbound), W side arms UP + lights east (westbound). The proof
   stands exactly these four; this is the placement law the engine
   wiring will follow once Paolo approves the art. CORRECTED same
   night (Paolo): (1) ONE POST PER CORNER — the engine's corner lamp
   yields wherever a signal mast stands; (2) every facing FLIPPED to
   the near approach: N side backs, E side lights east, S side faces,
   W side lights west. That flip exposed that arm chirality and lens
   facing are INDEPENDENT axes (a pole east of its road carries the arm
   west while lights still face east), so the vertical drawer grew
   head_facing and the bank now carries all four arm-side x facing
   combos. THEN ARM LAW v2 + LOOK-DOWN OCCLUSION (Paolo, same night):
   the arm extends HALFWAY ACROSS THE STREET covering every forward
   driving lane (1 lane -> 3 cells, 2 -> 6, 3 -> 9, heads ONE PER LANE
   at the lane centers, measured from the median end), and because the
   camera looks DOWN, the arm paints OVER the hanging heads. FINAL
   REFINEMENT (Paolo: "these should be under the pole, not jutting out
   to the side"): heads center DIRECTLY BENEATH the arm with a 4px lean
   toward the facing side (lens column clears the pipe), arm over their
   middles, clamps riding the arm. INTACT LOOK APPROVED by Paolo
   ("Awesomeee nice") — THEN v16 wrecks derived from it untouched
   ("take it how it is and break it and add it to the floor"): the
   horizontal fallen span now carries its lane-count of dead heads
   lying on their sides with glass; NEW vertical fallen_arm (both
   arm_dirs): jagged stub at the junction, the span lying on the ROAD
   beside its old line, dead heads on their backs staring at the sky,
   shattered lens glass. THEN v17 (Paolo): the broke-off span moved to
   THE BASE of the mast (lies on the floor from the foot out along the
   road), and a NEW wreck kind dropped_heads — pole and arm stay UP,
   the lights themselves lie dead on the floor below their clamps, one
   tipped sideways, glass around them (horizontal + vertical, both
   arm_dirs). Proof went HALF BROKEN HALF GOOD (N dropped_heads, E
   fallen, S+W intact) — Paolo: "So good!!!! Awesome!" THEN v18
   (Paolo: "broken street lights scattered around randomly on the
   floor nearby"): new kind SCATTERED — sheared stub + a seeded debris
   field: pipe chunks with torn ends at random angles, dead heads
   thrown in random rotations, glass, stray bolts; 3 variants per
   color horizontal + 2 per arm_dir vertical, every seed different so
   corners never repeat. THEN v19 (Paolo x2): (1) scattered FOR ALL
   DIRECTIONS — scatter demo proof slices/BOHEMIA_V12_SCATTER_PROOF_
   7_18_26.png stands debris fields on all four sides (bake gained a
   corner_mode arg; the approved half-broken proof unchanged); (2) THE
   SALVAGED HEAD ("people taking these red green yellow stop lights
   for themselves... world building"): the lone dead head as a
   standalone portable texture, 4 carry poses (kept/side_l/side_r/
   flipped), in the bank under salvaged_heads with salvage_lore.
   [PENDING Paolo]: WHERE salvaged heads appear around the map (MAP
   LAW — texture ready, placement is his). 348 sprites + 4 salvage
   props; wrecks + non-approved classes still UNJUDGED. JUDGING SURFACE
   READY: tools/BOHEMIA_SIGNAL_PICKER_7_18_26.html (gen:
   tools/bohemia_signal_picker_gen.py) — 16 classes, SUN MODE, thumbs +
   comments + export .txt. Paolo taps when ready; UP unlocks the cooked
   volume, NO -> graveyard w/ post-mortem; verdicts land in /records. Laws:
   DEAD is default (act-1 grid pending), lit lenses rgb-only glow, sign
   plates ILLEGIBLE (names are Paolo's), zero purple. STATUS: UNJUDGED.
   Two dead-state masts are composited onto the intersection proof (SW
   arm-east + NE mirrored) as the judging surface, same as the bold
   markings; bank carries pole_center_px for the bake's anchor math. PROOF
   PLACEMENT ONLY: engine prop placement waits for approval.
1. V12-class bake: THE BAKE FACTORY EXISTS (7/17, tools/bohemia_bake_factory.py
   — rebuilt from the harmonized pools' data-laws: 88/12 weather rarity, family
   edge harmonization, the APPROVED marking bank for native cell.mk, dark lamps).
   7/18: WRECKS + FIRE BARRELS ARE IN — tools/bohemia_street_prop_extract.py
   derives banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt (20 top-down cars from
   HD part2 "Abandoned cars" — the V11 bake's own family — + 12 burn barrels
   from the demo prop pool, provenance recorded, corpus art not new canon);
   the baker composites car_wreck per the engine's w x h + facing (rot90 for
   EW) and fire_barrel/lamp props over them. ALL FOUR live cells baked:
   slices/BOHEMIA_V12_BAKE_PROOF_{33,34,35,36}_6.{png,html}.
   THE V12 SLICE = THE INTERSECTION, WALKABLE (7/18, v2 after Paolo's
   verdict on v1): tools/bohemia_v12_slice.py bakes the intersection with
   ALL FOUR STOPLIGHTS standing at their approaches (bake_factory
   --intersection 3 3 intact; new 'intact' corner_mode + an .occ.json
   sidecar of the SOLID cells), wraps V11's harness verbatim (light pass,
   patrol, walk loop; the 3 overlay payloads removed). Result:
   slices/BOHEMIA_LIVE_SLICE_V12_7_18_26.html — 24x35, opens in DAYLIGHT
   on the south approach framing a 3-head mast, only 4 OCC cells (the mast
   pole bases; the road/box/crosswalks fully walkable), verified in
   chromium: player roams the whole intersection freely in all 4 dirs, 0
   errors. V1 LESSON BANKED (Paolo: "the intersections and street lights
   aren't even here... invisible walls everywhere... you made this to
   smell your own fart"): v1 showcased the native-bake PLUMBING (4 random
   street cells) and blocked every wrecked-car footprint on the road ->
   no signals + invisible walls. FIX: show the CONTENT he cares about
   (the intersection + our stoplights) and only block real posts.
   THE THESIS still holds (bake IS the world, zero overlay).
   THE MOJAVE RENDERS (7/18): the desert around dead Vegas now bakes.
   tools/bohemia_desert_extract.py -> banks/BOHEMIA_DESERT_POOLS_7_18_26
   .txt (seamless-certified pale-sand ground from GROUND_SEAMLESS_SET's
   "Soil and dirt tiles" + HD rocks + rubble, corpus art no canon), and
   bake_factory --desert renders the engine's procedural desert block
   (24x14: sand + scattered rocks/rubble + a soft radial scorch scar).
   GRID-KILL LESSON: raw HD ground tiles have dark borders -> tiling them
   grids/checkerboards; fix = crop the inner ~78% past the border + use
   ONE sand tile with per-cell flip + gentle tone jitter (mixing 8
   variants made a checkerboard). Proof: slices/BOHEMIA_V12_DESERT_PROOF_
   7_18_26.png. ROCKS TANNED (Paolo: "the rocks should be more tan") —
   bake-time warm tint (R*1.18,G*1.02,B*0.72, then B clamped <= G so no
   cool shadow reads purple + stone stays sandstone). THE MOUNTAIN
   RENDERS TOO: bake_factory --mountain -> slices/BOHEMIA_V12_MOUNTAIN_
   PROOF_7_18_26.png — the engine's dense boulder field (123/block) as
   tan sandstone (Red Rock / Spring Mountains) on stonier ground. LESSON:
   the HD "Rock Formations" packs are FANTASY green/lava rocks (wrong);
   the Mojave stone is HD "Rocks and stones" tan-tinted. Desert + mountain
   are the two UN-gated wilderness types and BOTH render now;
   wash/solar/farm/airfield still need cooked+judged art. NEXT for the
   bake track: plot/building strips (HOUSE_FACTORY_BANK) when Paolo gives
   plot canon; and folding these terrains into the overmap / a walkable
   wilderness slice whenever wanted.
   LIVE-SLICE HOSTING (7/18, Paolo asked how to host slices in the alpha
   organically): the alpha's menu is a TAB BAR (char/anim/rig/combat/
   music/city). The design: ONE new tab points at a STABLE URL,
   slices/BOHEMIA_CURRENT_SLICE.html, and slices/SLICES_MANIFEST.json
   decides which slice it shows (current pointer + a short entries list,
   catalog-ready but no catalog until the game ships). Updating the slice
   = bump the manifest + rerun tools/bohemia_slice_host.py; the 31MB alpha
   NEVER changes again. Loader built + verified (card in the alpha's style,
   ENTER loads the slice full-bleed + BACK bar, 0 errors). TAB NAME LOCKED
   BY PAOLO: "SLICE". The alpha tab handler is generic (removes 'on' from
   all, adds to clicked, shows #p-<data-p>), so the insert is TWO divs, no
   JS change:
     (a) after the CITY tab in <div id="tabs">:
         <div class="tab" data-p="slice">SLICE</div>
     (b) a panel in <div id="stage">:
         <div class="panel" id="p-slice"><iframe src="BOHEMIA_CURRENT_SLICE.html"
           style="width:100%;height:100%;min-height:78vh;border:0"></iframe></div>
   DONE 7/18 (Paolo reported the mobile menu bug directly — "the top menu
   is fucked on mobile, I should be able to drag it"): the SLICE tab is IN
   the alpha, AND the tab bar is now properly mobile-scrollable. The bug:
   6 tabs summed to ~374px, jammed edge-to-edge at 390, and the game's
   global touch handlers ate native scroll so it wouldn't drag. Fix (all
   in #tabs, a region the ragdoll session never touches): touch-action:
   none + a window-driven pointer-drag handler that owns scrollLeft (works
   mouse + touch), padding:0 10px breathing room, click-suppression after
   a >8px drag so a drag never fires a tab, grab cursor. SLICE panel lazy-
   loads BOHEMIA_CURRENT_SLICE.html on first open. VERIFIED in a 390px
   mobile chromium: alpha boots, 7 tabs (scrollW 444 > 390, 54px drag
   range), SLICE activates + loads the slice, 0 console errors.
   ONE-ALPHA honored by COORDINATION not avoidance: synced the alpha to
   the latest origin/main FIRST, patched only the tab region, pushed
   non-force so a concurrent ragdoll push rebases cleanly (different
   regions). Future: when a slice updates, only the manifest+loader change
   — this alpha edit never repeats.
2. Questbook mining: PAUSED AT 68 pending Paolo's lane pick (see below).
3. Alpha absorption: preflight GO since 7/14; ONE session, WITH Paolo.

## NEXT ACTION
Whatever Paolo picks off the PENDING shelf; if he says "do what's next"
without picking, the standing default is: keep the gates green, consolidate
(this file stays a pointer; STATE_OF_PLAY carries the day), and take the
largest unblocked item in IN FLIGHT.

## OPEN FORKS PENDING PAOLO (never decide these)
- THE MINING FORK: fresh game names / systematic re-mine of the ~72-game pool
  / the 136-file backfill queue (the gate counts it every run).
- THE NEXT WALL CLASS: names one -> the 47 waiting candidates re-enter
  judging under its banner (banks/BOHEMIA_WALL_CANDIDATES_POOL_7_17_26.txt).
- GRAPHICS EYE-CALLS: lamp pairing at (16,44)/(2,44); patrol owner colors
  (placeholder grays); 101 purple world tiles kill-or-REDMAG; flashlight_36
  orange-or-cool-white; siren_blue; ASPHALT_BASE rgb; NETWORK zone placement;
  suburban kit path; single-file alpha vs streaming launcher (NOT locked).
- QUEST: the 7/16 list stands unchanged (relationships-gate-arcs, Q135
  mindscape centerpiece, Q130 Act 2 spine, Q124 Emil grammar, Q131 betrayal
  staging, Q115 SOMA-truth, when to end research/start compile, production
  quests 046-053 + master compile PARKED).
- STANDING: act-1 grid-power ruling / ragdoll head+neck / multi-enemy dial /
  pinch-zoom cap / perks gap / female + child rigs / gloves slot / mirrored
  garment art / currency logos.
- ANIMATION, THE SECOND DEATH (7/18, UNJUDGED, now a FAKE-PHYSICS RAGDOLL):
  'headshot-2' beside 'headshot' THE TOPPLE (v1, untouched). The whole arc:
  physics-crumple -> keyframe-crumple (Paolo: "so stiff") -> RAGDOLL. Paolo's
  order: "have RULES FOR THE LIMBS and ragdoll it based on a fake physics thing
  for all directions" + he REVOKED the FACE-LAW head lock ("head always faces
  north, i dont like that anymore -- move it with the body"). Built a clean
  Verlet ragdoll (RG in the alpha): gravity + rigid bones + torso braces +
  LIMB HINGE rules (elbow/knee one-way, partial-correct) + a NECK CONE so the
  head flops in range. FREE HEAD that ROTATES with the body via headStampFrame
  (RG_HEADROT follows the real neck->headTop bone; the rigid-upright stamp WAS
  the 'faces north'). Per-direction shot impulse = 8 distinct falls. Anti-jitter
  (the hard part): speed cap + SOFT floor push (hard clamps caused 20-30px leaf
  teleports) + 2.5px/frame per-joint MOVE CAP + freeze-on-settle; waist-centered
  camera + fixed floor. None of v1's fighting laws. Verified all 8 in frame,
  freeze, distinct rests, head rotates. Record: records/BOHEMIA_ANIM_DEATHS_
  7_17_26.txt. Combat bakes both deaths. Judge the FEEL in ANIMATION tab,
  'headshot-2'; headshot-3 still on the table if the ragdoll feel needs tuning.
  LESSON BANKED: verify animation by WATCHING motion, never static frames.
- MUSIC (verdict pass 7/17 PROCESSED; gate #17 gates/music_gate.js guards it
  all): CANON now: THE CANCELLED MAN, THE WIND LEARNS WORDS, THE PIT BOSS IS
  GONE (Paolo loves it; added to the OVERWORLD playlist, now six, his verbatim
  "add to overworld rn"). BURIED 7/17: SUNKEN VESPERS, UNDERTOW (no kill
  reason given; post-mortem in the embedded repo block). FRESH + UNJUDGED
  (batch 9b, NEW badges live): TAPS FOR THE VALLEY (ladderhorn, harmonic-ladder
  bugle) / WHAT THE DAM HELD BACK (tidewheel, nested-AM cascade). STILL
  UNJUDGED from before: SALT ON THE HIGHWAY, WHAT GROWS IN THE VAULT, THE LAST
  TABLE STANDING, MOJAVE GHOST, LONG WALK HOME, ONE CANDLE, MOB THE HOUSE
  REMEMBERS. UI shipped 7/17 per Paolo: export COPY fixed (modern clipboard
  first; the old order burned the iOS gesture window), COMMENT SECTION at the
  bottom of the music page always (persists, rides the export as PAOLO
  COMMENTS). Repair banked: the 7/8 "CANON baked" claim for THE LAST DEALER
  FOLDS + WHAT THE MIRRORS KEPT had never landed in CANON_DEFAULTS; landed now.
  A verdict claimed is not a verdict baked.

## THE QUESTBOOK TRACK — LOCKED LAWS (folded 7/16 from the launch handoff)
Every law below is CONFIRMED in the research corpus (verified by grep at the
merge: the files are all in the repo). This list is the SUMMARY of what the
questbook sprint concluded, and it lived in exactly one file. Now it lives here.

- **FORMAT LAW v2**: every quest file carries CAST + WHAT EACH WANTS,
  CONVERSATIONS as node trees (gates/TRAPs/SILENCE/NOVERBs), BRANCH MAP with
  counts. Gate: exactly 10 W-points, >0 option lines, END marker.
  (`BOHEMIA_QUESTBOOK_FORMAT_LAW_7_16_26.md`)
- **.bq FORMAT**: plain-text quest format, roles cast at runtime (Bethesda alias
  model), **STAT/KARMA GATES BANNED AT PARSER LEVEL**. Validator: alias-fill,
  orphans, dead links, named-body zero-loot, round-trip. (`bohemia_bq.js`, 29/29)
- **Target RAISED: >90 individual quests at v2 before master compile.** At 54.
- **BATCH LAW**: `BOHEMIA_QUESTBOOK_BATCH_LAW_7_16_26.md`

**LAW LOCKS STAGED FOR COMPILE** (confirmation counts live in the questbook index):
  - COMPREHENSION IS A BRANCH (11x confirmed)
  - AUTHOR-CANNOT-DELEGATE + HEIR-CANNOT-DELEGATE (one law)
  - ABSENT-PARTY DECISION (3x)
  - RESCUE-DENIAL register (4 instruments)
  - truth-delivery grid (unasked / begged-against / pre-authorized)
  - honest-devil set (buys / collects / exchanges / hosts / dominates)
  - exit-design theory (last-exit / first-exit / no-exit)
  - THE FINALE IS A LEDGER-READ (theater Q136 + arithmetic Q137 + rooftop Q102)
  - persuasion trilogy (deserved / written / midwifed)
  - HELP DECLARED IS HELP DENIED + verbs-removed-for-the-hearer
  - NO KARMA BAR (4-leg proof)
  - reward-flat forks, or the gradient is the point
  - @REDLINE companions
  - lures need ledgers
  - singleton registry (one Strange-Man, one Papyrus-class, one Sheogorath-class
    per game)

**FRESH MINING QUEUE** (from the ~72 whole-game teardowns still in the pool):
  Witcher contracts · Kenshi second story · Sunless Sea · Spec Ops white
  phosphorus · Undertale Sans · Obra Dinn · Mask of the Betrayer · Tyranny ·
  SH2 Eddie · Vampyr citizen-webs · Shivering Isles · Vaermina · Pamela-sibling
  files (Sharp/Flat, Ikana suite)

**ENGINE BACKLOG, EACH WITH A NAMED TEST**:
  - THE SETTLEMENT'S MISSING-PERSONS ORGAN (demanded by Q133/Q134/Q138) +
    vigilant-order response states
  - generational audit engine (Q137 PORT 1)
  - Fold ledger-view (Q136 PORT 1)

**EXTRACTION REPOS** (what the research is FOR):
  CRAFT_MASTER / FLAWS_MASTER / CONVERSATIONS_MASTER / **PORTS_MASTER = THE BUILD
  QUEUE**. PORTS is the one that turns research into game.

## BANKED LESSONS (folded from the questbook handoff, 7/16 merge. Do not lose.)
- **THE #102 INCIDENT.** A carried note said "two files at #102, fix the collision
  at compile." It was WRONG: not a collision, a LOSS. The EMIL file had been built,
  verified, shipped and presented, and was gone anyway. Transcript grep recovered
  it verbatim; it is now #124. FOUR LESSONS: (1) NEVER-LOSE-FILES LAW works and
  paid for itself; (2) a deferred fix is a fix that never happens, fix on
  discovery; (3) same-number-different-filename does NOT collide at the filesystem
  level, so it survives silently until someone counts: AUDIT BY NUMBER, NOT
  FILENAME; (4) never trust a carried note about file state over `ls`.
- **THE ZIP INCIDENT.** The first archive zip globbed BOHEMIA_QUESTBOOK_* only,
  silently excluding 57 files of Paolo's actual written work sitting in the same
  directory. LESSON: a wrap zip globs by DIRECTORY, then subtracts what is
  deliberately excluded. It NEVER globs by name prefix, because a prefix silently
  drops everything that does not match. Diff zip contents against disk every time.
  (This bit AGAIN at the 7/16 merge: a `*HD_TILE_REPO*.txt` skip glob also ate the
  `.chunkmanifest.txt` files. Same failure class, six days later. The diff caught
  it both times. THE DIFF IS THE GATE.)
- **THE GDD NEAR-MISS (7/16).** Two inherited registries claimed v2/v3/v4 were
  superseded by v5. Both wrong. v5 EXTENDS them and says so in its own first line.
  Archiving on that claim would have deleted the three-dynasty arc, the
  Amalgamation's origin, the Fifth Dimensional Element, the endgame and the fold.
  Caught only because Paolo asked "did you read the GDDs." LESSON, now gated by
  gdd_gate.js: a registry line is a CLAIM, not evidence. Read both documents
  before anything stops riding.
- Questbook files 01-16 run 11-13 craft points BY DESIGN (early format). Not
  damage. Do not "fix."
- Flaw laws locked 7/16: (12) the music repo's most emotional cue must have a KILL
  PATH (Q123, SCREECH LAW); (15) if a character asks the player for something, let
  the player be asked FOR REAL (Q124).
- Craft findings 7/16: the horror is the CLIPBOARD not the cross (Q122); mercy
  shows up in the PASSENGER MANIFEST (Q123); the enemy faction leaves if you fix
  their logistics (Q123); hope as a 12.5% trajectory improvement (Q123); the room
  list AS the atrocity (Q124); quest hooks as FORGERIES sent by people who love the
  target (Q124).

## DO NOT LOSE
- Paolo works from iPhone + two laptops. The alpha is stale and he wants ONE
  beautiful package: launcher UI tying alpha + music menus + character
  customization, fast on phones. First big build of the repo era. ONE session,
  with him, ONE-ALPHA LAW.
- Zero-dialogue-by-design registry (never "fix"): questbook #99 #104 #110 #114.
- 40/79 questbook files are superseded AS PRIMARY only (#122/#123 are primary).
  Both still ride. Registry-not-deletion.
- HD tile repos are NOT in the seed. They travel as chunks, separately.
- 103+ songs, faction genre bible locked for all 13 factions, music repo embedded
  in the alpha (lines 3249-5465), extractable as bohemia_music.js.
=== END HANDOFF ===

## SUBURB VERDICT (7/18): CUL-DE-SACS APPROVED, SCALE CHECK PENDING
Paolo verdict: CUL-DE-SACS UP; THE LOOPS + GARDEN CURVE DOWN (records/BOHEMIA_SUBURB_VERDICT_7_18_26.txt). He HELD graduation: 'before we continue I want to see house size vs the character, real human-vs-house ratios (single/two story).' SCALE STUDY is now the SLICE current: slices/BOHEMIA_SCALE_STUDY_7_18_26.html (tools/bohemia_scale_study.py) — 0.75 m/tile, a 1.75 m human vs single-story (14x11 m, 5 m) + two-story (11x10 m, 7.5 m) houses, top-down + elevation, toggle/check/export. ON SCALE SIGN-OFF: graduate cul-de-sacs into bohemia_plotgen at REAL dimensions, drop loop/garden from the generator + graveyard them (reference-clean), homes exist -> LIFE opens. [PENDING Paolo: scale sign-off].

## EXPLAIN-EVERY-TILE LAW (Paolo 7/18): no blank slabs; every tile maps to a named thing
in the legend; research what fills the space and put it there. Kit helpers legendOk/
voidFraction/largestBlob gate it. Applies to EVERY district.

## DISTRICT DOSSIER + LAYERING — RECORD WHAT THE HELL IS HAPPENING (Paolo 7/19: "record all the
notes of what the hell is happening... understand the LAYERING and what it looks like when the
player goes INSIDE — a building, a parking garage, the tunnel — what tiles, what positions, what
blocks. very important"): DONE for all 7 built districts. Each module exposes NOTES {summary,
reference[], layout[], circulation, LAYERING, decisions[]} + LEGEND {code -> name, kind, ACT-1
material, + layer/solid/enter} beside its PALETTE. LAYERING: every tile resolves (via kit
KIND_LAYER/tileLayer) to a render+occupancy LAYER — ground (flat floor) / structure (¾ front
face, blocks) / overhead (pass UNDER: canopy, garage deck) / prop / portal (go INTO an interior:
door, garage ramp, tunnel mouth) — plus solid? + what's INSIDE (enter). Examples recorded: the
medical parking GARAGE (solid shell outside -> multi-deck interior inside, ramp portal), store/
dock/house doors as portals, canopies as overhead (walk under, block nothing), the wash as a
BELOW-GRADE 3-layer descent (street road/fence -> slope bank -> sunken invert -> tunnel-mouth
PORTAL into the underground). tools/bohemia_tilespec.js GENERATES the full DOSSIER (records/
tilespec/ + INDEX) incl. a LAYERING section + a per-tile layer/solid/enter table. gates/
tilespec_gate.js (49 checks) fails if a district lacks the NOTES dossier (incl. layering), ships
an undocumented tile, OR has a tile with no valid layer. ACT-2/3 = [PENDING Paolo]. STANDING FLOW
(keep in mind forever): NEVER build/approve a district without its NOTES+LEGEND+LAYERING dossier
+ rerun the generator, same turn. The ¾ renderer + the interior/zoom system READ these flags.
LAYERING IS NOW CONSUMABLE (7/19): world.js plot() exposes it live — plot.tileInfo(x,y) ->
{code,name,layer,solid,enter}, plot.solidAt(x,y) (OCCUPANCY: does the cell block a body),
plot.portals() (every way INTO an interior: doors/garage-ramps/tunnel-mouths/gates), and each
building carries .enter (its interior from the dossier). world_gate.js asserts these (9 checks).
So the render/collision/interior systems read what blocks + what you go into, not just raw codes.
Proof: a LAYER VIEW render colors each tile by resolved layer (portals glow green) —
scratchpad only, regenerate from bohemia_wash/medical/cemetery via K.tileLayer.
FIRST SPECIAL INTERIOR — THE PARKING GARAGE (7/19): engine/bohemia_garage.js — a multi-DECK
parking structure (NOT rooms; the generic BSP floorplan can't do it): each deck = a central
drive aisle + 90-degree stalls + abandoned cars + a stair/elevator core, decks joined by an
aligned RAMP, the ground deck holding the ENTRANCE (from the exterior ramp). The solid garage
shell you see in the overworld becomes the deck you stand on. Gate garage_gate.js (7 checks incl.
a 3D reachability test: drive from the entrance UP THE RAMPS to every deck). WIRED: medical
exposes the garage as ONE enveloping footprint tagged code:8 (its shell is punched by stalls),
world.js building.interior() dispatches on enter text -> garage yields decks, everything else
rooms; building.kind='garage'. world_gate proves a real valley garage yields multi-deck parking
(10 checks). NEXT special interiors: the mausoleum CRYPT (cemetery, enter says CRYPT INTERIOR —
DONE 7/19) and the sewer TUNNEL network (wash mouth -> coordinate w/ LIFE, the tunnel people live there).
CRYPT INTERIOR DONE (7/19): engine/bohemia_crypt.js — the mausoleum interior (cemetery portal,
enter says CRYPT INTERIOR). A single-floor stone crypt: a central aisle threading a grid of
burial-VAULT banks, walls lined with stacked niches, an ALTAR terminus, the ENTRANCE at the
front, some vaults broken open (act-1 dead). INTERIOR===EXTERIOR (grid is exactly the mausoleum
footprint w x h; verified 29x17 via the world model). world.js interior() now dispatches
garage/CRYPT/floorplan on the enter text; building.kind='crypt'. Gate crypt_gate.js (7 checks
incl. footprint-exact any shape + floor reachable from entrance). Registered in the runner.
Two special interiors live: GARAGE (multi-deck) + CRYPT; generic ROOM FLOORPLAN for the rest.
INTERIOR===EXTERIOR LAW (Paolo 7/19, LOCKED): a building's interior floor plate is ALWAYS exactly
its exterior footprint w x h (garage clamps removed; each deck = footprint W x H; room floorplans
already matched). CLAUDE.md law + world_gate.js hard check (interior dims === footprint dims,
every building, 11 checks).
HOW-TO-BUILD-A-DISTRICT PLAYBOOK (Paolo 7/19: "make instructions for even how you make
instructions for yourself... the district kit... we're learning things together"):
laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md is the read-this-BEFORE-you-build brief — the DISTRICT
KIT (the shared machine + its helpers) and the 9-step method (research -> canonical-south on the
kit -> street-aware/drivable via rotateToStreet -> dossier NOTES+LEGEND -> render+look -> gate ->
wire (DISTGEN+tilespec) -> interior=exterior -> ship), plus how the self-instructions get made
(the dossier is GENERATED, not hand-written) + a module template. district_kit_gate asserts it
exists + covers the kit/method. So: this playbook (build) + per-district dossiers (record) + the
tiling brief (tile) = the full self-instruction stack, all gated.
TILING-PHASE INSTRUCTIONS (Paolo 7/19: "leave instructions for yourself when it's time to place
tiles"): laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md is the single read-this-when-you-tile brief —
scale, act-1-dead, 45-degree, purple ban, layering->render/occupancy, INTERIOR===EXTERIOR,
exterior<->interior zoom, order of operations, what's Paolo's. The tilespec INDEX points to it;
tilespec_gate asserts it exists + is linked (58 checks). So when tiling starts, one doc has it all.

## STREET-AWARE / DRIVABLE ACCESS LAW (Paolo 7/19, LOCKED — "one street vs two because it's
a corner is gonna be super important, for everything moving forward"): every road-fronting
district is built for BOTH a standalone grid (1 street, any edge) AND a corner (2 streets).
ONE car entrance on the primary street (order S>E>W>N); corners add a PEDESTRIAN gate on the
side street, never a 2nd car entrance. The drivable network (driveway + lot aisles) is an
EXPLICIT car surface separate from walking paths; a car reaches EVERY stall from the curb.
MECHANISM (author once): build canonical-south, call K.rotateToStreet(g,streets,{...}) ->
{g,primary,gates}; kit helpers primaryStreet/rotateCW/scanGates/pedGate + gate checks
driveNetworkOk/driveTouchesEdge/stallsReachable. GATES: district_kit_gate.js (machinery,
23 checks) + each district gate (park_gate.js reference, 11 checks/6 configs). Law:
laws/BOHEMIA_ADDENDUM_STREET_AWARE_DRIVABLE_LAW_7_19_26.md + CLAUDE.md law list. NEW districts
use it from the start.
RETROFIT DONE (7/19, "do something important"): diagnosed all 4 pre-law districts across the
6 placements (each single edge + 2 corners). Found + FIXED a real bug: MEDICAL's drive was
DISCONNECTED for a north-only cell (and N+W corner) — its south-biased "bottom drive band" sat
stranded behind the hospital. Fixed by retrofitting medical onto canonical-south + K.rotateToStreet
(the whole campus now rotates onto the real street; ambulance/ER/garage/lot all reached). New kit
helper K.driveReachFromStreet(g,driveCode) = fraction of the car network reachable from the curb
(right metric for complex sites whose drive isn't one tidy blob). INDUSTRIAL + SOLAR were NOT
broken (genuinely street-connected in all placements) but their gates only tested a couple configs
— HARDENED all gates to the full 6-placement sweep + a drive-reach assertion so this bug class
can't hide again (the medical gate only ever tested S-configs, which is exactly why the N bug
slipped through). Gate status now: park 11/6cfg, medical 12/6cfg, industrial 8/6cfg, solar 7/6cfg.
COMMERCIAL is the exception: it's the CORNER-plaza form by design (Paolo: "we'd have to completely
remake it to squeeze between two other districts"), so it's gated on S/corners/N only. [PENDING
Paolo]: commercial's standalone-any-edge / mid-block form is a DESIGN call — how a shopping plaza
reshapes when it's not on a corner. Everything else obeys the law across all placements.

## DISTRICTS ON THE FACTORY (running list) — Paolo 7/18
Built + folded into world.plot (each = a generator on the kit + a gate + one DISTGEN line):
- suburb/gated/estate -> RESIDENTIAL (bohemia_suburb)
- commercial -> COMMERCIAL (bohemia_commercial, corner plaza)
- industrial -> INDUSTRIAL (bohemia_industrial, distribution center, research-first)
- medical -> CIVIC (bohemia_medical, hospital campus, EXPLAIN-EVERY-TILE: hospital + ER,
  ambulance canopy + staging bays + helipad, drop-off lane + walkway/crosswalk, a full
  visitor lot with PARKED CARS + dead-planter islands, garage packed with cars + ramp, MOB).
  Gate medical_gate.js checks legend-complete + no-big-void + parked-cars.
- solar -> INFRASTRUCTURE (bohemia_solar, utility solar farm: panel arrays, gravel access
  roads, inverter/transformer pads, a substation switchyard + control building, fence+gate;
  fits the CLUSTERED-POWER lore). EXPLAIN-EVERY-TILE (void ~10%). Gate solar_gate.js.
- park -> LEISURE (bohemia_park, v4 — RESEARCHED custom grid + DRIVABLE + street-aware).
  RESEARCH (park design guides): FLOWING CURVILINEAR trails wind + route AROUND amenities
  (never a geometric circle, nothing sits on the path); ~half the park is PASSIVE OPEN LAWN;
  high-use amenities (playground + court) near the STREET for surveillance w/ LIMITED parking
  at the entrance; pavilion in a quieter shaded zone; TREES buffer the perimeter. BUILD:
  amenities drawn FIRST, then a Catmull-Rom WINDING pedestrian trail (code 1) laid only over
  open ground so it flows around every feature. DRIVABLE (Paolo 7/19: "do you have drivable
  parts where a car normally would go, corner or standalone"): the car network is EXPLICIT
  and separate from the walking trail — an asphalt DRIVEWAY + parking AISLES (code 12) run
  from the street curb cut into the lot so a car reaches every stall (0 orphan stalls,
  driveConn 1.0). STREET-AWARE via CANONICAL-SOUTH + ROTATE: the park is built entrance-at-
  south, then rotCW'd so the car entrance lands on the actual street; a CORNER gets the car
  entrance on the primary street (order S>E>W>N) + a PEDESTRIAN gate on each side street (one
  car entrance is realistic). Works for a standalone grid (1 street, any edge) AND a corner.
  Lawn ~75%. ACT-1 DEAD. void ~3%. Gate park_gate.js (11 checks over 6 configs incl.
  LAWN-DOMINANT >55%, drive-network-connected, driveway-reaches-primary-street, every-stall-
  car-reachable, corner-pedestrian-gate). v1 super-park + v2 perfect-circle both REJECTED —
  git history has them. NOTE: the canonical-south + rotate-to-street pattern (+ explicit
  drive code 12) is a reusable convention to push into the other districts' parking next.
  SEED VARIETY (7/19, "we're gonna have several parks"): the generator varies per seed so
  valley park cells DIFFER while staying realistic — pond present-or-absent (a tree stand
  fills in when absent), per-seed jitter on the trail waypoints + playground + court. 6 seeds
  verified as distinct-but-realistic; lawn 75-77%, drivable + street-aware hold on all. Gate
  makes the pond OPTIONAL (absent or a real pond, never a sliver). NEXT for parks: distinct
  park TYPES (pocket/plaza/greenbelt/sports) as their own generators when Paolo wants them.
FAILURE TRAINING (7/19, Paolo "record + train on all failures I thumbs down"): every
  thumbs-down catalogued w/ root cause + lesson + guardrail in records/BOHEMIA_FAILURE_
  GRAVEYARD_7_19_26.md; park v1/v2 tombstoned (PARKFAIL-SUPERPARK/PARKFAIL-CIRCLE, graveyard
  green); 4 new lessons in laws/BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md (realistic>impressive;
  research proportions not parts-list; no fake geometry; explain-every-tile != cram).
- wash -> TERRAIN (bohemia_wash, Paolo 7/19: "a wash where homeless people can get into the
  sewers — a sewer entrance by the street"). A LV concrete flood-control channel: wide lined
  channel (banks + invert + dead trickle), fenced maintenance O&M roads (drivable), riprap
  shoulders, clumped desert margins — and the HEADLINE: a headwall + a dark BOX-CULVERT TUNNEL
  MOUTH where the channel dives under the street, with a hole in the fence + a scramble path +
  a homeless CAMP (cart/tarps/crates) at the mouth. Grounded in the real LV flood tunnels
  (~600mi, ~1,200-1,500 unhoused "tunnel people"). Act-1 DEAD. Street-aware + drivable via
  rotateToStreet. footprints EMPTY (the mouth = future LIFE tunnel-interior hook, not a surface
  building). Gate wash_gate.js (9 checks/6 configs). The "tunnel people" are LIFE (agents); this
  district gives them the DOOR.
- cemetery -> CIVIC (bohemia_cemetery, 7/19 autonomous, research-first: memorial-park design
  guides). A dead-world cemetery: a rectilinear grid of grave SECTIONS (rows of headstones on
  dead memorial lawn) laced by memorial drives for graveside access (you DRIVE through it), a
  chapel + office + parking by the entrance, a MAUSOLEUM terminus (enterable crypt), a
  COLUMBARIUM cremation garden (niche wall + reflecting pool + monument), a central FOUNTAIN +
  OBELISK roundabout plaza, dead memorial trees lining the drives, a maintenance shed. Act-1
  DEAD (weathered stone, empty fountain, bare trees, no living lawn). Street-aware + drivable
  via rotateToStreet (drive reach 1.0 all placements). RECTILINEAR by design (grid maximizes
  graveside access — correct here, not fake geometry, unlike the organic park). Full dossier +
  layering (mausoleum = crypt interior; headstones = props you weave between). Gate
  cemetery_gate.js (8 checks/6 configs). 8 built districts now.
- drivein -> LEISURE (bohemia_drivein, 7/20 autonomous, research-first: drive-in site-plan
  guides — conceptdraw / drive-insdownunder / Film-Tech). A dead drive-in movie theater: a torn
  SCREEN TOWER spanning the back (its ¾ face IS the giant screen), a fan of ARCED PARKING ROWS
  centered on the screen (wheel-stop arc markings + speaker poles + abandoned cars rusting nosed
  to the screen), a central SNACK BAR + PROJECTION booth (enterable concession interior) with a
  little playground + picnic tables beside it, a drive-up TICKET BOOTH + roadside MARQUEE at the
  entrance. The WHOLE cracked-asphalt field is the drivable surface (you drive in and park),
  reachable from the curb in every placement (driveReachFromStreet). Act-1 DEAD. Street-aware +
  drivable via rotateToStreet. Full dossier + layering. Gate drivein_gate.js (11 checks/6
  configs). BUG CAUGHT + FIXED on the real render: the marquee had walled the entrance lane off
  from the field (single-street drive-reach failed while corners passed via the ped-walk leak) —
  moved the marquee roadside, off the lane. 9 built districts now. Stamp BUILD 7/20c.
- golf -> LEISURE (bohemia_golf, 7/20 autonomous, research-first: golf course design guides —
  Under Armour "Golf Course Layout 101", Keiser College of Golf, Archweb). A dead golf course
  SECTION (a full course is ~50ha, dwarfs a 96m cell, so one cell = the clubhouse end + a few
  holes): dead ROUGH dominates the parcel, brown mown FAIRWAYS wind through it (worm-of-discs,
  never straight) from TEE BOXES to GREENS (each with a leaning PIN), guarded by pale SAND
  BUNKERS + a seed-optional dry cracked WATER HAZARD; the abandoned CLUBHOUSE + two PARKING lots
  + DRIVING RANGE (tee line + mats + downrange targets) + practice PUTTING GREEN cluster at the
  south street entrance; a thin pale-concrete CART-PATH perimeter loop (front-nine-out/back-nine-
  in) hugs the fairway edges with stubs to each green. Street-aware + drivable (parking + cart
  paths reachable from the curb). Full dossier + layering; enterable clubhouse. Gate golf_gate.js
  (12 checks/6 configs). RENDER BUG CAUGHT + FIXED: cart paths first read as a dark tree-trunk up
  the middle (dark + thick + radial) — recolored to receding concrete, thinned, rerouted as the
  perimeter loop; now reads unmistakably as golf. 10 built districts now. Stamp BUILD 7/20j.
- stadium -> LEISURE (bohemia_stadium, 7/20 autonomous, research-first: stadium bowl + site-plan
  guides — Preferred-Seating "Stadium Bowl Design", conceptdraw, Wabash Valley, Carroll Eng). A
  dead sports stadium: a tiered seating BOWL (concentric ellipses) rings a cracked dead FIELD
  (faded sidelines/midline/center circle), a CONCOURSE loop runs under the stands cut by 12 radial
  VOMITORY aisles + tier walkways, the FACADE wall wraps it with the entry GATES, a PARKING APRON
  rings the whole parcel, LIGHT TOWERS at the four bowl corners, a dead SCOREBOARD over the north
  end. Street-aware + drivable (the apron reaches the curb every placement). Full dossier +
  layering; facade -> concourse interior. Gate stadium_gate.js (12 checks/6 configs, incl an
  explicit no-purple swatch check). PURPLE CATCH: the stands first rendered a purple-leaning gray
  -> recolored to NEUTRAL warm gray (PURPLE RESERVATION LAW), purity sweep passes. 11 built
  districts now. Stamp BUILD 7/20l.
- truckstop (GAS STATION) -> COMMERCIAL (bohemia_truckstop, 7/20 autonomous, research-first: gas-
  station + fuel-station site-plan guides — plan7architect, Scottsdale design guidelines,
  architecture4design, Venture Fuels). A dead highway fuel stop (fuel = the scarcity-economy
  currency, so this is core Bohemia): an overhead FUEL CANOPY on columns over dry rusted PUMP
  ISLANDS, a boarded STORE/diner (enterable) + customer parking, a dead WASH bay (enterable,
  drive-through), long pull-through BIG-RIG stalls with abandoned rigs, a blank price PYLON at the
  street, pole lights, all on a cracked drivable FORECOURT. Filed 'truckstop' (the taxonomy home
  for a fuel stop; category commercial). FIRST district to use the OVERHEAD layer: the canopy is
  overhead/pass-under (solid:false) so the forecourt stays drivable UNDER it — the gate asserts
  tileLayer(canopy)=overhead+pass-under. Street-aware + drivable. Full dossier + layering. Gate
  truckstop_gate.js (13 checks/6 configs, incl no-purple + the overhead-canopy assertion). 12
  built districts now. Stamp BUILD 7/20n. (Then REBUILT after Paolo "it kinda looks like shit":
  first pass was a sparse dark lot + thin canopy outline + dirt-noise; now a bold filled canopy
  roof, a light concrete pad focal plaza, zoned rows + landscaping planters, proper tonal ladder.
  Gate enforces the bold canopy + pad + planters. Stamp 7/20q.)
- BATCH OF FOUR (7/20 autonomous, Paolo "stop doing tiny things, do a lot"): school, fire station,
  swap meet, self-storage — one turn, four categories, research-first each, dense + zoned + tonal-
  laddered (the truck-stop lesson applied up front), street-aware + drivable, full dossier +
  layering, own gate (6 configs), all wired. Stamp 7/20u.
  - school -> CIVIC: E-shaped building + gym on dead lawn, a sports FIELD ringed by a running TRACK
    (hero), basketball courts, a playground, and SEPARATE bus-loop / drop-off / staff-parking drives
    (the SC-Ed safety rule). Gate 12 checks. Bug caught: bus-loop connectors were code 3 (broke the
    drive net) + field crossed the drop-off -> re-zoned field west, drives east, all knit to the gate.
  - firestation -> CIVIC: apparatus bays with RED engines nosed onto a LIGHT concrete apron (drive-
    through pull-out), a hose/drying tower, guideline stripes, staff parking. The apron is drive-code
    1 (light) so the red engines pop — a deliberate dark-asphalt inversion. Gate 12 checks.
  - swapmeet -> COMMERCIAL: rows of torn COLOR-CODED canopy stalls (OVERHEAD tents: bleached/red/
    teal) on packed-dirt aisles, a market hall, a gravel lot. THE BARTER-ECONOMY STAGE for LIFE/
    ECONOMY to populate with traders. Gate 12 checks. (Tents got per-row color after a monotone
    first render.)
  - storage -> INDUSTRIAL: rows of unit buildings with roll-up doors, ~40% pried OPEN + ransacked
    (each looted unit a PORTAL — the collapse story + a loot hook), drive aisles reaching every unit,
    fortress-perimeter fence, office. Gate 13 checks. Bug caught: inner keypad gate used code 5 off-
    edge (street-aware reserves 5) + entrance blocked by the south unit bar -> carved the lane through,
    office beside it.
  16 built districts now, across all 7 non-casino categories.
  WALKABLE-LAND LAW + REBUILDS (7/20, Paolo "it can't mostly be a parking lot or a car driveway...
  the firehouse is so tiny", "record and train on your failures"): NEW LOCKED LAW — buildings +
  purposeful content must DOMINATE a walkable plot; pavement is connective tissue, never the main
  event. Vehicular venues (drive-in, gas/truck stop) whose vehicle surface IS the venue declare
  vehicular:true + are exempt. laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md + CLAUDE.md +
  playbook step 2. K.landStats(g,legend) splits drive/content/filler; gates/walkable_gate.js sweeps
  every district (drivePct <= contentPct+22, vehicular exempt) — Stamp 7/20y. REBUILT the 3 he
  flagged: FIRE STATION (was 8% building + 52% empty apron -> big station + training ground w/ drill
  tower, burn building, hose racks, wreck cars; content 43% drive 12%); SCHOOL (was "incomplete" ->
  full campus: building complex around a planted quad, gym+cafeteria, entry plaza, portables, courts,
  field/track kept w/ yard lines+bleachers; content 45% drive 6%); SWAP MEET (was ambiguous ->
  unmistakably OUTDOOR: individual peaked tents + corner poles + open sky between). Storage (the one
  he liked) kept as the density reference. fire/school/swap gates now assert content dominates.
  THE DENSITY BAR IS NOW LAW: a walkable district must read FINISHED + USED, never a sparse lot.
  BATCH OF FOUR under the new law (7/20-21, "do what you're supposed to and know what comes next"):
  water treatment, salvage yard, police station, library — research-first, dense + content-dominant
  from the start, all pass the WALKABLE-LAND sweep. Stamp 7/20ab. 20 built districts.
  - watertreat -> INFRASTRUCTURE: circular CLARIFIERS (core + sweep arm) + rectangular aeration
    basins + a filter-bed grid + control/blower/chem building + pipe galleries, fenced. content 82%.
  - boneyard (SALVAGE YARD) -> INDUSTRIAL: rows of stripped wrecks (rust/blue/white), a crushed-car
    wall, a claw CRANE + crusher, office + truck scale, fenced. THE SALVAGE ECONOMY'S LARDER (LIFE/
    ECONOMY pull parts/scrap here). content 76%. Bug caught: entrance lane erased the gate -> gate
    drawn LAST (watch this pattern: draw drives THEN stamp the gate).
  - policestation -> CIVIC: big HQ (public front / secure back), fenced secure yard w/ SALLY PORT +
    patrol-fleet motor pool + maintenance bay, fenced IMPOUND of wrecks, public plaza + visitor lot.
    Public/secure separation honored. content 67%.
  - library -> CIVIC: big columned building around an inner reading COURTYARD, a colonnade + steps
    down to a piazza w/ a dead fountain, admin/community wings, reading garden. content 58%.
  FACTORY NOW 18 auto-districts (20 built total incl gaming placeholders) across all 7 non-casino
  categories.
  BATCH OF SIX (7/21, "LOOKING GOOD MAKE SOME MORE!"): landfill, railyard, substation, church,
  courthouse, jail — research-first, dense + content-dominant from the start, all pass the walkable
  sweep. Stamp 7/20ag. 24 auto-districts (26 built total). World model 341 plots-with-buildings.
  - landfill -> INFRA: waste cells (berms+trash) + leachate ponds + scale + haul roads + dozer.
  - railyard -> INDUSTRIAL: fan of classification tracks + rusted boxcars + loco + container gantry.
  - substation -> INFRA: transformers + switchgear bays + overhead busbars + control house (feeds
    the clustered-power network / LIGHT=TERRITORY).
  - chapel (CHURCH) -> CIVIC: a CRUCIFORM building (nave+transepts+apse+narthex) + bell tower +
    forecourt plaza + arcade + churchyard cross + memorial garden.
  - courthouse -> CIVIC: columned building + dome + portico + grand steps + plaza + Justice statue
    + sally port.
  - jail -> CIVIC: cell blocks off a control hub inside a double razor-wire wall + corner guard
    towers + walled rec yards + admin/intake sally port.
  Also (double-check pass, same day): COMMERCIAL enhanced (glass shopfronts + pad building +
  planters; content 44 vs pavement 46, was 40/51) under the walkable law.
  BATCH OF THREE — THE BIGGEST COVERAGE GAPS (7/21, "do some big brain awesome shit"): farm,
  downtown, trailer park — chosen by counting the overmap histogram (farm 144 cells, downtown 25,
  trailer 17 were the largest UN-generated district types). Research-first, dense + content-dominant,
  all pass the walkable sweep. Stamp 7/21f. 27 auto-types (29 built total).
  - farm -> INFRASTRUCTURE(default zone): crop FIELDS (furrow rows) DOMINATE the plot, dry irrigation
    ditches, farmhouse + yard, faded-red BARN, round grain SILOS, equipment shed, tractor, hay bales.
    content 82% / drive 2% (a farm is nearly all worked land — the walkable spirit, maxed).
  - downtown -> COMMERCIAL(retail): 4 PODIUM blocks each with a TOWER, a street grid, a ROUNDABOUT
    plaza (street ring at r=11-12 keeps the arms connected — bug caught: a solid plaza disc severed
    the crossing), an overhead SKYBRIDGE, rooftop mech. The dense urban core. content 57%.
  - trailer (MOBILE-HOME PARK) -> RESIDENTIAL: staggered rows of mobile homes on two internal streets,
    each lot a carport (overhead) + shed + propane, ~16% burned-out shells, abandoned cars, a
    guest-parking pod. Where the valley's poor washed up. content 71%. Bug caught: guest pod isolated
    from the drive net -> added a connector rect.
  THE VALLEY AERIAL (tools/bohemia_aerial.js -> records/BOHEMIA_VALLEY_AERIAL.svg): THE PAYOFF SHOT.
  Composes a real region of the CANON overmap, each DISTGEN cell built by its OWN generator
  (street-aware, real grid + real palette), streets meshing between them. v1 shipped downsampled to
  34px/cell and Paolo called it dead-on: "looks like absolute dog shit." ROOT CAUSE: nearest-neighbor
  point-sampling a 128x128 grid down to 34px turned every fine pattern (crop rows, tents, individual
  trailers) to noise, and road/interchange fill was near-black (#2a2824) against a near-black void
  (#161410) so streets were functionally invisible — districts read as floating islands, not a city.
  REBUILT same turn: NATIVE tile resolution (1 tile = 1 svg px, zero downsample loss, rows
  run-length-encoded to keep the SVG light — ~127k rects for a 10x10/50-built-cell region, renders in
  well under a second), road cells get a readable asphalt tone + dashed centerline (deterministic per
  seed), terrain/unbuilt cells get speckle texture instead of a dead flat block. Also swapped the
  region to a genuinely MIXED 10x10 (35,8): suburb/commercial/farm/trailer/storage/swapmeet/school/
  cemetery/park all visible together, not one district type repeated. Re-run:
  node tools/bohemia_aerial.js [x0 y0 size] (cellpx now fixed at native 128). LESSON: "render and look
  on the real surface" applies to showcase tools too — a downsample that looks fine in the code is not
  the same as looking fine on screen; screenshot before shipping, every time, no exceptions.
  DISTRICT FACTORY IS ESSENTIALLY COMPLETE (27 auto-types). REMAINING non-casino candidates: waterpark,
  speedway, mall, granary-variants. THE BIG PIVOT after the districts: make them WALKABLE/ENTERABLE
  (the zoom) or drop LIFE agents into them (inhabit) — or build the aerial into a live CITY overview.
FACTORY now spans 7 categories: residential, commercial, industrial, civic, infrastructure, leisure, terrain.
GAMING & RESORT = BESPOKE (Paolo 7/18): casinos/resorts get hand-crafted individual love,
NOT the auto-factory. A first casino generator was built then PULLED per that ruling (git
history has it if ever wanted as a starting sketch). Do NOT auto-generate gaming_resort.
NEXT non-casino districts to stamp (research-first, on the kit): more leisure (stadium/golf/
waterpark), more commercial (downtown/mall/swapmeet), more infrastructure (substation/
transit/airport), residential (trailer park/town/downtown highrise). Then L3 tiles + L4
3-act states (build once, all inherit).

## DISTRICT TAXONOMY (Paolo 7/18: "you have to categorize things nicely")
Every one of the 77 district types files into ONE of 8 top-level categories (source of
truth: engine/bohemia_district_kit.js TAXONOMY; law: laws/BOHEMIA_DISTRICT_TAXONOMY_7_18_26.md;
gate: gates/district_taxonomy_gate.js, nothing can be uncategorized). Grounded in real
land-use zoning + the two Vegas needs. Counts: residential 5, commercial 5, industrial 9,
gaming_resort 9, civic 13, leisure 8, infrastructure 24, terrain 4. world().plot() now
returns .category. The distribution center = INDUSTRIAL. A few judgment calls flagged for
Paolo in the law (convention/truckstop/fort/springs/farm) — easy to move.

## THE DISTRICT FACTORY (Paolo 7/18 late: "get this factory going... speed this up")
Built the shared machine so a NEW district is a short config, not a from-scratch build:
- engine/bohemia_district_kit.js: grid primitives, street-aware streetEdges(neigh),
  footprints, connectedFrom, dead-world ground(), a REGISTRY (register/get/types), and a
  3-ACT hook act(res,a,rules) (act 1 = as-built; act 2/3 rules are CONTENTS-PAOLO'S).
  Gate: gates/district_kit_gate.js (16 checks).
- engine/bohemia_industrial.js: FIRST district on the kit — a real DISTRIBUTION CENTER,
  REBUILT from site-plan research (Paolo: research the real thing FIRST): one big warehouse
  + office, a dock-door row, a truck court apron, trailer STAGING + a trailer PARKING yard
  (~58 staged trailers), employee car lot, guard shack, containers, fenced gates. Gate:
  gates/industrial_gate.js (8 checks). Rendered + verified.
- RESEARCH-FIRST LAW (Paolo 7/18): online research of the REAL thing before building ANY
  district; the generator is inspired by real reference. Added to the workflow law.
- engine/bohemia_world.js: routing is now GENERIC. DISTGEN table maps district type ->
  generator (suburb/gated/estate->SUB, commercial->COM, industrial->IND). Adding a
  district = ONE line. world.plot generates + exposes enterable buildings uniformly.
  Valley now: suburb 2332 / commercial 405 / industrial 36 / gated 18 / estate 11 plots
  with real buildings (297 total, was 38). world_gate green.
NEXT (fast now): stamp out the remaining ~25 district types on the kit (downtown, casino,
resort, strip, medical, campus, stadium, park, mall...), each a short generator + gate +
one DISTGEN line. Then the L3 TILE PIPELINE + L4 3-ACT states (build once, all inherit).
Status doc: records/BOHEMIA_OVERWORLD_STATUS_7_18_26.md. Workflow: laws/BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md.

## PLACEMENT PLAYBOOK + FIRST COMMERCIAL DISTRICT (Paolo 7/18 late)
Paolo: the suburb ate half a day; RECORD the issues so it never repeats, then pivot to
the first commercial district (a corner shopping plaza).
- POST-MORTEM: laws/BOHEMIA_PLACEMENT_PLAYBOOK_7_18_26.md. THE process rule: render a
  PNG and LOOK every change (a green gate is not a look); roads-first; spread not
  blind-stride; fill both grains; straight segments only (rigid footprints can't front
  curves); never add road to squeeze a house; constant house depth, vary width/story.
  The bugs that cost most: asymmetric inset (verify ALL four edges), dead-ground-as-void.
  This is the reference for the ~30 home models Paolo wants + every new district.
- COMMERCIAL (first cut, gated): engine/bohemia_commercial.js — a CORNER SHOPPING PLAZA.
  L-shaped store building on the back property lines; parking lot fronting the streets
  (striped stalls + drive aisles); curb cuts connect the lot back to the streets;
  storefront doors face the parking. Street-aware (exits the streets it touches, corner=2).
  generate(seed,{streets:[...]}) -> {g, stores, gates}; storeFootprints + driveConnected
  exported. Gate #23 gates/commercial_gate.js (8 checks), registered in bohemia_gates.py.
  Proof (still): tools/bohemia_commercial_proof.py -> slices/BOHEMIA_COMMERCIAL_PROOF.html.
  ITERATED (Paolo 7/18 eve): (1) PARKING now obeys BOHEMIA_PARKING_LAW (2-wide stalls,
  stripe every 3rd tile, row 4 deep, aisle 4 — the approved ST0 stall tiles texture it).
  (2) BACK ENTRANCE LAW: every business has a service door (9) onto a rear SERVICE ALLEY
  (8) that wraps the back corner (the "mini road") for trash/deliveries; hasServiceAccess()
  gates it. (3) GAS STATION pad (canopy 10 + pumps 11 + kiosk) in the street corner.
  (4) MORE curb cuts: 2 per street (corner = 4). Gate #23 now 11 checks. All green.
  NOTE: parking code (1/3/4) maps to the approved parking/stall-line TEXTURES at render
  time (banks); the proof shows geometry, the real render applies the tiles.
  VARIANT NOTE (Paolo 7/18): this is the CORNER form. A commercial cell squeezed
  between two other districts (frontage on one edge, or mid-block) needs its own
  layout variant, remade — not just the corner rotated. Build when folding into the map.
  NEXT: subdivide the store strip into TENANT UNITS (each own storefront), then fold
  commercial into the world model like the suburb. [PENDING Paolo: react.]

## SUBURB — FOLDED INTO THE WHOLE VALLEY (Paolo 7/18 late: "one done, what's next")
DONE: the approved suburb generator is now wired into the world model. engine/bohemia_world.js
plot(x,y) routes any RESIDENTIAL cell (suburb/gated/estate) through BohemiaSuburb.generate
with streets inferred from road-district neighbors (streetEdges), exposing homeFootprints as
enterable buildings (residential floorplans) + a suburbBlock() grid in world cells. Result:
2361 residential plots across the valley are real neighborhoods, ~56,540 homes, every one
enterable via world().plot().building().floorplan(). world_gate.js +1 check (6 total), 280
plots-with-buildings (was 38). All gates green.
STILL 1x1 PER CELL (merge across neighbors not yet done in the world model — the generator
supports cw/ch but the world addresses per-cell; multi-cell union + shared plot API is the
next refinement). Interior collector streets from the overmap not yet fed in (gates default
to road-neighbor edges, else S).
NEXT FORK (Paolo to call — AskUserQuestion dropped, asked inline): (1) LIFE — agents in the
houses; (2) the OTHER building types (commercial/civic/etc.) to this modular standard;
(3) the city-builder delete-to-desert/place-a-plot mechanic.

## SUBURB — MODULAR, BOTH LEVELS (Paolo 7/18 eve: "houses + neighborhood must be modular")
DONE + gated (gates/suburb_modular_gate.js, 14 checks; laws/BOHEMIA_ADDENDUM_MODULARITY_LAW):
- HOUSE FACTORY: typed MODELS[] in engine/bohemia_suburb.js — varied width (13..21),
  garage size + SIDE (L/R corner), and STORIES (2-story stamps inset upper floor code 9,
  reads taller). Per-lot deterministic. No more clones.
- STREET-AWARE + MERGE: generate(seed,{cw,ch,streets:['S','E',...]}). Gates ONLY on the
  edges that face a street; a CORNER exits two streets; neighbor cells MERGE into a
  connected cw x ch union (one wall, one network, gates scaled per edge — 2x1 = 2 gates
  on the main street). ~19 homes 1x1, ~50 at 2x1, ~107 at 2x2. Old generate(seed,'ring',
  cw,ch) still works.
- Proof (STILL image, not walkable — Paolo: don't make me walk unless near-done):
  tools/bohemia_suburb_modular_proof.py -> slices/BOHEMIA_SUBURB_MODULAR_PROOF.html.
  Sent Paolo the screenshot. WALK CAMPANA slice still current + works with modular houses.
WORKFLOW NOTE (Paolo 7/18 eve, LOCKED): do NOT spend tokens on walkable demos for him to
judge unless a thing is ALMOST COMPLETE. Still top-down proof images are fine for progress.
NEXT (mine, unblocked): fold into the FULL world model — overmap/bridge tells a residential
cell which edges face streets + whether it merges with same-type neighbors, then calls
generate() with those streets+shape; world().plot() returns correctly-gated varied homes.
Then LIFE (agents move in).

## SUBURB — APPROVED + GRADUATED TO WALKABLE (Paolo 7/18 verdict: THE BLOCK is UP)
VERDICT (records/BOHEMIA_SUBURB_VERDICT_BLOCK_APPROVED_7_18_26.txt): THE BLOCK (packed
grid) UP = canonical suburb; the central cul-de-sac court DOWN = graveyard (post-mortem
logged, court branch/throughStreet REMOVED from the generator, no respawn). Path taken
through the rejections that got here: empty-band bug (self-inflicted asymmetric wall
reject) -> rail+rung dense fill packing the whole block; dead ground rendered near-black
-> textured dead-dirt so backyards read as dead earth not void.
GRADUATED SAME TURN (approval -> implement): slices/BOHEMIA_SUBURB_WALK_7_18_26.html
(tools/bohemia_suburb_walk.py) — the approved block, WALKABLE. Spawn at the gate, walk
the dead streets, step on any yellow front door -> stand INSIDE that house's live
floorplan rooms (engine/bohemia_floorplan.js), walk out. 22 homes, all enterable.
Verified chromium (0 errors, interior render confirmed). SLICE current='subwalk'.
Gate #22 now 11 checks (added: no-vegetation dead-world, wall-backyard, campana n/a,
enter-path = every house yields a valid floorplan). engine/bohemia_suburb.js
generate(seed) is the ONE canonical block (style arg ignored, court gone).
NEXT (mine, unblocked): fold suburb houses into the FULL world model — bridge/blockgen
must emit these house footprints at the world scale so world().plot() over a residential
cell returns real homes (today the walk is a standalone slice; the world model still owes
suburb footprints via the bridge). Then LIFE (agents) once homes exist valley-wide.

## SUBURB — DEAD WORLD + 3-TILE WALL BACKYARD + YOUR TRACT (Paolo 7/18, three angry corrections)
Paolo rejected the block hard with three concrete complaints. ALL THREE fixed + machine-gated this turn:
1. "WHERE IS MY NEIGHBORHOOD I CAN THUMBS UP." -> Added the CAMPANA DR candidate (engine/bohemia_suburb.js style 'campana'): his real tract at 8xxx Campana Dr / 89147 reconstructed at 0.75 m/tile — walled block, homes packed all around the perimeter, an interior cul-de-sac court (the real "perimeter + court" Vegas tract off Tropicana: Van Carol->Mt Nido->Jadero->Campana). It is now the FIRST card in the judge, thumbs-up-able. ~14-16 homes (matches real ~0.15-acre lots on a 96 m block).
2. "EVERYTHING'S DEAD IN ACT 1 — no water for lil bushes, no grass, no trees, no pools." -> Stripped ALL vegetation. Removed the backyard tree/pool fill; codes 7/8 are never emitted. Judge palette is dead (dead-dirt ground, no green, no pool-blue). Gate asserts NO tree(7)/pool(8) anywhere (DEAD WORLD check).
3. "HOW DARE YOU PUT THE END OF THE HOUSE TOUCHING THE WALL — at least a 3-tile border for backyards." -> home() now rejects any footprint within 3 tiles of a wall; the ring inset was pushed out so every perimeter home keeps a >=3-tile DEAD backyard to the wall. New WALL BACKYARD LAW check in gates/suburb_modular_gate.js (ring + campana, no house cell within 3 of a wall).
Gate #22 now 10 checks (added wall-backyard, dead-world, campana-renders). ALL GATES GREEN. Judge shows TWO cards (Campana + the packed grid block), SLICE current='suburb'. Verified in chromium (0 errors). [PENDING Paolo: thumb Campana vs the block].

## SUBURB REMADE — WALLED-BLOCK MODEL (Paolo 7/18, two corrections)
Graduating cul-de-sacs surfaced two rulings that rebuilt the home + block:
1. HOMES BACK ONTO THE PERIMETER WALL. Backyards to the wall, fronts (driveway+garage) facing an INTERIOR street. So streets run inside, one home-depth off the wall; homes fill the band to the wall + the interior. The old 'grid of culs' schematic was wrong; the block is a walled ring.
2. DRIVEWAY = A CAR APRON, not a runway. 3 tiles long x 4 wide (2 cars). The GARAGE is the FRONT CORNER of the house; the house is the bulk. (Was: long driveway+garage+body strip, driveway bigger than the house — Paolo: 'what is wrong with you.') Fixed in engine/bohemia_suburb.js home().
engine/bohemia_suburb.js is the candidate generator (BohemiaSuburb.generate(seed,style,cw,ch), styles culs/double/court, real 0.75 m/tile, cluster-aware, ~18-23 homes/96 m block). Old tools/bohemia_suburb_gen.js RETIRED (loop/garden gone). Judge tool remade at 1x1 (Paolo: 'start with one grid'), SLICE current='suburb'. Gate #22 gates/suburb_modular_gate.js updated: connected + homed + garaged at 1x1/1x2/2x1/2x2, footprints house-sized (6-30 tiles), deterministic.
PRIOR VERDICT still stands (cul-de-sacs approved); these are the corrected designs for a fresh thumb. On pick: graduate into plotgen, homes exist, LIFE. [PENDING Paolo: re-verdict the remade designs].
