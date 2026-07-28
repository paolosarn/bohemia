# BOHEMIA — THE TILE REQUEST BOARD (created 7/28 on Paolo's ask; EXPANDED to
# the FULL master form same day, his order: "make a request form of all the
# tiles that we need to make high-quality please")
# THE LAW (extends APPROVED-ASSETS-FIRST + the shopping law): when any session
# needs a visual asset that does not exist, it (1) checks records/BOHEMIA_
# APPROVED_ASSET_INDEX first, and if nothing covers the need, (2) FILES A
# REQUEST ROW HERE and uses a flagged placeholder — it NEVER cooks the asset
# inline in its own lane. The ART lane works this board top-down in batches,
# every cook anchored + harness-gated (target_match_gate proxies: palette
# ceiling, value bands, one light direction, no keyline, no dither, seam
# contracts), delivered to Paolo as ASSEMBLED SCENES, never loose tiles.
# Paolo can also add rows himself (or tell any chat / the coordinator to).
#
# EVERY ROW IS A RECORDED NEED — sourced from Paolo's rulings, approved
# rosters, the engine reality map, and measured findings. Nothing invented.
#
# THE FORM LAW (Paolo 7/28, LOCKED — the board upgraded): every row must be
# backed by a FILLED TILE REQUEST FORM in records/tileforms/ (template + law:
# BOHEMIA_TILE_REQUEST_FORM.md at repo root; worked example:
# records/tileforms/TF-RUN-001_desert_ground.md). The board is the INDEX,
# the form is the CONTRACT — why/where/when/how, the machine-readable caption
# that ships with the tile, references incl. real-Vegas grounding, the
# anti-reference, and the acceptance tests. The ART lane cooks from forms
# only; a row with no form (or a form that fails tileform_gate) is not OPEN.
# Rows below filed before the form law get their forms filled by the
# REQUESTING lane before the art lane touches them (TF-RUN-001 covers row 4).
#
# ROW FORMAT:
# STATUS | WHAT (plain name) | FOR (surface/tab + purpose) | SPECS (size/layer/
# facing needs) | REFERENCE ANCHOR (approved corpus item or named outside ref) |
# REQUESTED BY | PRIORITY | FORM (TF id, once filled)
# STATUS: OPEN -> COOKING -> JUDGING (in Paolo's pile) -> DONE (indexed) /
# KILLED. HELD = filed but blocked on a named Paolo pick; not workable yet.

=============================================================================
## OPEN — HIGH (work these first, top-down)
=============================================================================
1. OPEN | STAIRS (interior stair tile family: up + down, both facings, plus
   the garage ramp/deck-edge treatment so the already-generated parking decks
   can finally be seen) | RUN + CITY interiors — the 2-3-story climbable
   buildings Paolo ordered; verticality is MISSING per the engine reality map
   and the garage decks are the free pilot | portal-layer, 2-tile door law
   applies to stairwell openings; each level plate === footprint (interior
   law) | Zomboid stair readability as outside ref | coordinator (from
   Paolo's 7/28 verticality order) | HIGH
2. OPEN | ACT-1 ENEMY LOOKS x12 (dog pack, coyote, rattlesnake, scavenger,
   toll crew, snatcher, crazed wanderer, bounty squad, casino security bot,
   spotter drone, ghost robotaxi, patrol fighters) | RUN/COMBAT — the
   approved encounter roster, needed on the WALK surface too now that real
   combat on the walk is ruled (7/28 addendum) | rig-derived for humans (RIG
   IS LAW), shadows separate, walk-surface scale | canon rig + approved
   wardrobe + vehicle sizes; bot/drone derived from approved bank materials |
   WORLD (roster approved 7/26) | HIGH
3. OPEN | MOBILE-BASE CAMP SET (deployed cart, fire ring lit/unlit, bedroll,
   awning, lantern, cook pot — roster pending Paolo but the CART + FIRE are
   already canon) | RUN — the mobile base build | fire uses the APPROVED
   fire-flicker loops (zero-consumer bank, routed 7/27) | cart canon +
   approved fire bank | RUN lane | HIGH
4. OPEN | DESERT GROUND, SEAMLESS (a ground family that actually tiles: open
   desert, hardpan, rock scatter, the desert-to-pavement blob edges) | RUN —
   twenty-plus districts sit on desert and the existing DESERT/TERRAIN pool
   is MEASURED broken (near-black borders on all 8 tiles, 3-5x wrap
   discontinuity — records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md; a
   grid across the whole district) | seam contracts are the acceptance test:
   MEASURE the wrap before judging, cropping does not save a bordered tile |
   the frozen starter tileset's ground values | RUN lane (0b1 finding) | HIGH
5. OPEN | DEAD FOLIAGE SET (dead lawns, dry shrubs, bare/dead trees, dead
   palm, tumbleweed, brown-striped mown grass gone to dust) | RUN/CITY — the
   world's baseline per the 7/28 weather ruling: "alot of foliage is going to
   be dead anyway"; also the language half the district records already speak
   (the irrigated-thing-that-died, fairway-vs-desert, dead alfalfa) |
   ground + prop layers, seam-contract ground where it tiles | cemetery
   district (approved "very good") as the dead-grass anchor | coordinator
   (from the 7/28 weather ruling) | HIGH
6. OPEN | VEGAS WEATHER OVERLAYS (cloudy ambient wash, rain overlay, wet
   ground state — THREE states total, mostly-sunny is the no-op baseline) |
   RUN/CITY — weather ruled IN 7/28, Vegas-real: sunny > cloudy > rain about
   once a month, NOT diverse, no fourth type ever | render-pass layers, not
   ground retiles; composes with the daycycle wiring (reality map gap 8) |
   laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_7_28_26.md is the contents ruling |
   coordinator (Paolo 7/28) | HIGH

7. OPEN | CHARACTER CONTACT SHADOW (the shadow every person, NPC and enemy
   casts on the ground; standing + walk/run + crouched footprints, lit/unlit
   strength) | RUN + COMBAT + CHARACTER preview — everywhere a body is drawn
   on a floor | prop layer, single placement, stamped per body at the feet;
   multiplies the ground band, never its own colour; NEVER baked into the
   sprite (SHADOWS ARE SEPARATE 7/26) | the blessed lamp bank (one light
   direction + 45-degree ellipse cross-section); Hyper Light Drifter for how
   LIGHT a ground pool should be | CHARACTER lane | HIGH | TF-CHAR-001
8. OPEN | THE CHARACTER STAGE (a real Vegas concrete pad + stucco backdrop
   for the CHARACTER tab preview, replacing the CSS purple gradient) |
   CHARACTER + ANIMATION tab previews ONLY, never the world — this is the
   surface every body, wardrobe and body-dial verdict is made on | ground
   plate self-seamless horizontally + structure backdrop band; value chosen
   for CONTRAST against both palest skin (224,211,203) and near-black coat
   (~42 lum) | the frozen CBB target screen's bands; Darkest Dungeon's hero
   panels | CHARACTER lane | HIGH | TF-CHAR-002

=============================================================================
## OPEN — MED
=============================================================================
9. OPEN | ACT-1 TILESET REMAINDER (wall corner families, curb/sidewalk
   transitions, remaining per-district material coverage) | RUN/CITY — grow
   the 42 frozen starter tiles to full district coverage; this is RUN 0b's
   "each type needs its own dressed language" | per the mobile render
   contract + seam contracts | the frozen target + starter set | ART lane's
   own queue | MED
10. OPEN | CEMETERY MAP ICON | MAP — the district is APPROVED ("very good")
   and has no icon; named in the theme sheet as the highest-value icon debt
   in the game | map-zoom silhouette readability (squint test) | the approved
   cemetery district itself | WORLD (theme sheet 7/28) | MED
11. OPEN | INTERIOR STAIRWELL DRESSING (stair-adjacent wall/rail/landing
   props so upper floors read as real rooms, not bare plates) | RUN + CITY
   interiors — follows row 1 when verticality lands | prop layer, props
   never become collision (7/26 interiors law) | UP interior pool (approved,
   already consumed by the run) | MED — blocked by row 1 shipping first

12. OPEN | FOOTFALL DUST (the pale caliche puff a boot lifts off dry ground;
   walk puff + heavier run/land puff) | RUN + COMBAT + the CHARACTER stage
   when a walk clip plays | prop layer, single placement, 4 frames over ONE
   beat at 120 BPM, leaf-pixel law (anchor frozen, only the cloud edge
   moves); SUPPRESSED ENTIRELY on wet ground | the approved particle/fire
   loop bank for loop discipline ONLY (dust occludes, it does not emit);
   Shovel Knight for pixel landing puffs | CHARACTER lane | MED | TF-CHAR-003
13. OPEN | PORTRAIT BACKDROP (a material behind the face in the portrait
   disc, replacing flat #12100c) | CHARACTER tab portrait + any future
   dialogue portrait | structure layer, single placement, clipped to a 120px
   disc, authored 1x head-on flat (the deliberate 45-degree exception, stated
   in the form); must separate BOTH palest skin and near-white hair
   (237,232,220) | shares material with TF-CHAR-002; Papers Please / Disco
   Elysium portrait grounds | CHARACTER lane | LOW | TF-CHAR-004

=============================================================================
## OPEN — ART LANE'S OWN MATERIAL FAMILIES (board row 7, broken down 7/28)
=============================================================================
# Row 7 said "ACT-1 TILESET REMAINDER ... remaining per-district material
# coverage" and sat there as one word. The ART lane walked its own surfaces to
# fill it in: the 42-tile frozen starter set is ONE RESIDENTIAL STREET (asphalt,
# sidewalk, gravel, slab, dirt, stucco, terracotta, flat deck) and the registered
# district list is 40+ types. These are the material families that gap, each one
# a coherent drawing job with a filled form. EIGHT filed below; the remaining TEN
# this walk found are named at the bottom of this block and get their forms next
# ART turn — named rather than quietly dropped.

10. OPEN | CMU BLOCK WALL (GREY CONCRETE MASONRY UNIT) | RUN (the walk) + CITY (human mode) | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-001
11. OPEN | CORRUGATED METAL WALL + ROLL-UP DOOR | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-002
12. OPEN | PARKING LOT STRIPING (STALLS, AISLES, WHEEL STOPS) | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-003
13. OPEN | CHAIN-LINK FENCE (AND ITS RAZOR-WIRE VARIANT) | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-004
14. OPEN | DEAD SPORTS TURF AND RUNNING TRACK | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-005
15. OPEN | EMPTY POOL AND CONCRETE BASIN | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-006
16. OPEN | CIVIC CUT-STONE MASONRY | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-007
17. OPEN | STOREFRONT GLASS AND ALUMINIUM | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-008

# STILL TO FORM (this walk found them; forms next ART turn, not dropped):
#   brick masonry (downtown low-rise, older commercial) · railroad track bed
#   (railyard, crossings) · freeway surface + barrier + guardrail (freeway,
#   interchange) · commercial flat roof + rooftop mechanical (every non-house
#   roof) · mobile-home siding + skirting (trailer park) · crop field furrows
#   (farm) · landfill waste cell ground · solar panel array surface (solar,
#   battery) · wall CORNER + opening reveal completion (the starter set's own
#   named gap) · kerb/driveway apron transition set (the other named gap).

=============================================================================
## HELD — filed, blocked on a NAMED Paolo pick (not workable yet)
=============================================================================
H1. HELD | DISTRICT HOOK SETS — the theme sheet's 36 landmark hooks each need
   their signature tiles (examples from the sheet: drained kidney pool +
   blown-in balcony furniture; empty trailer pads with hookups; collapsed
   mall skylight + the thicket under it; one rolled-up orange storage door;
   center-pivot irrigation arm over dead alfalfa; empty pool bottoms +
   slides to nowhere; drive-in screen; frozen solar trackers out of step;
   empty fire bays, doors open; water tower; 60-ft pylon sign) | RUN/CITY/MAP
   — every district is its own landmark (7/28 law) | each hook = ONE
   silhouette readable at map zoom + walkable signature content | records/
   BOHEMIA_DISTRICT_THEME_SHEET_7_28_26.md rows | WORLD | BLOCKED ON: Paolo's
   hook pick (which of the ★ five first, or all five, or edits) — the sheet
   is PROPOSALS, not canon, until he picks. The moment he picks, the picked
   rows move up to OPEN-HIGH with his edits applied.
H2. HELD | SCHOOL MASSING TILES | RUN/CITY — blocked on Paolo's named call:
   HIGH SCHOOL OR MIDDLE SCHOOL (changes the whole massing) | — | theme
   sheet school row | WORLD | BLOCKED ON that one word.
H3. HELD | ROOM RECIPE FURNITURE GAPS — whatever the 12 room recipes need
   that the approved UP interior pool does not cover | RUN/CITY interiors |
   per-recipe buckets, props never collision | records/BOHEMIA_ROOM_RECIPE_
   BOOK_7_26_26.md | coordinator | BLOCKED ON: the recipe book's bulk verdict
   (still in Paolo's judge pile). Approved recipes name their gaps; gaps
   become OPEN rows.
H4. HELD | MOBILE-BASE UPGRADE LOOKS (camp comfort tiers) | RUN | tables ship
   empty per mechanism-mine | lab feel ledger | RUN lane | BLOCKED ON: Paolo
   ruling the upgrade roster (numbers/looks are his verdicts).

=============================================================================
## STANDING NOTES FOR THE ART LANE
=============================================================================
- SHOP FIRST, ALWAYS: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md before
  any row is cooked — 1,927 approved HD tiles, 13 border walls, 30 house
  skins, 30 door clips, 84 markings, plus unused-approved tiers. A row is
  only cooked for what the index genuinely does not cover.
- MEASURE THE PROPERTY YOU RELY ON (the desert-pool lesson, 7/28): a bank's
  "seamless" claim is a claim. Ground families get their wrap measured
  BEFORE they reach Paolo's pile.
- Everything 45-degree law, everything verified on the real surface,
  delivered as assembled scenes beside the nearest approved anchor.
