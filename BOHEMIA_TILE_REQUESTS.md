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
# THE GATE IS LIVE (7/28, CITY lane): gates/tileform_gate.py, registered in the
# suite as TILE FORM. Rule 7 of the form law named it and nobody had written
# it, which meant every contract the ART lane cooks one-shot from was resting
# on self-attestation. 5,990 assertions across all 50 forms, five lanes. It also
# proves the board and records/tileforms/ cannot drift apart in EITHER
# direction: a form with no row fails, and a row claiming a FORM: id with no
# file fails. IT DOES NOT yet enforce row-number uniqueness -- see the note in
# the CITY block below, because four lanes proved on day one that a
# hand-assigned integer is the wrong key.
#
# ROW FORMAT:
# STATUS | WHAT (plain name) | FOR (surface/tab + purpose) | SPECS (size/layer/
# facing needs) | REFERENCE ANCHOR (approved corpus item or named outside ref) |
# REQUESTED BY | PRIORITY | FORM (TF id, once filled)
# STATUS: OPEN -> COOKING -> JUDGING (in Paolo's pile) -> DONE (indexed) /
# KILLED. HELD = filed but blocked on a named Paolo pick; not workable yet.

=============================================================================
## COLLISIONS — READ BEFORE COOKING ANYTHING (RUN lane, 7/28)
## Three lanes filed forms the same day and three asks landed twice. Nothing is
## deleted here (another lane's form is not mine to bin) but the ART lane must
## reconcile these BEFORE cooking, or the same tile gets drawn twice and one of
## them gets drawn at all when it should not.
=============================================================================
C1. DUPLICATE — CHAIN-LINK FENCE: TF-RUN-003 and TF-ART-004 are the same asset.
   Merge before cooking. TF-RUN-003 carries the measured per-cell district
   evidence and one thing the other does not: this is a RENDERING CAPABILITY
   gap, not only an art gap — the run has NO see-through structure at all, so
   the run lane and the art lane must agree the transparency contract before
   pixels exist. Whichever form survives, keep that clause.
C2. DUPLICATE — CORRUGATED METAL: TF-RUN-004 and TF-ART-002 are the same asset.
   Merge before cooking. TF-RUN-004 carries the per-cell counts (industrial
   warehouse x416, storage x333, warehouse tenant unit x267) and the note that
   it must drop into the run's existing 4-course building stack with no
   renderer change.
C3. **SHOPPING CHECK MISSED — PARKING LOT STRIPING (TF-ART-003). DO NOT COOK
   THIS YET.** That form's shopping check walked the ROAD MARKINGS bank and
   concluded "it does NOT hold parking STALL geometry — no stall lines, no
   stall ends". It did not walk banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt,
   which holds:
     pool `stall_line_v` x18, `stall_line_h` x18, `pocket_line_v/h` x6 each,
     `twlt_*` (two-way-left-turn) x6 each — all as WEATHERED ASPHALT WITH THE
     WHITE LINE ALREADY ON IT
     plus `parking_geometry_law` = {"stall":"lines every 3rd tile, SHARED
     dividers, interior 2 tiles (cars 2 wide)","row_depth":4,"aisle":4,
     "source":"Paolo 7/14, proof PK0/PK1 blessed"} — HIS OWN blessed geometry.
   RENDERED AND LOOKED AT 7/28 before filing this note, so this is not a
   filename guess. Under the shopping law ("cooking a substitute for an indexed
   asset is a violation") this is a WIRING job, not an art ask. If the existing
   stall tiles are judged inadequate after being seen ON THE SURFACE, refile
   with that evidence — but they must be seen first.
   THE GENERAL LESSON, now standing: the index's per-bank rows do not enumerate
   every pool inside a bank. Open the bank.

C4. OVERLAP, NOT DUPLICATE — CMU: TF-ART-001 (row 20) is a BUILDING FACE with
   courses and a bond beam. TF-CMB-002 (row 51) needs a FREESTANDING 1-tile stub
   with two authored ENDS and a sky-lit TOP, which a building face never has.
   Same material, different object. COOK THE CMU MATERIAL ONCE and cut both from
   it; do not cook block twice.
C5. OVERLAP, NOT DUPLICATE — PARAPET: TF-WORLD-007 (row 36) includes a parapet
   cap for commercial flat roofs. TF-CMB-006 (row 55) needs a parking-deck edge
   guard and says out loud that `roof_parapet` may already BE the answer. Same
   object family. Whoever cooks the parapet, cook it once and let both consume
   it. TF-CMB-006 is explicitly a cook-nothing-if-reuse-works row.
C6. SPLIT SCOPE, DELIBERATE — VEHICLES: TF-WORLD-011 (row 40) covers HEAVY
   hulls and excludes the passenger car by its own scope note ("the CAR itself
   is canon and already sized"). TF-CMB-003 (row 52) is the passenger car,
   because SIZED IS NOT DRAWN — the canon `_vehicle` helper is a size constant,
   not pixels, and no walkable-surface car art exists. Together they are
   complete; neither is redundant.
C7. STAIRS — row 1 (interior, coordinator) and row 54 / TF-CMB-005 (exterior
   open-air deck run, COMBAT) are the two halves of one problem. ONE BATCH, ONE
   JUDGING. Row 54 carries the only verbal Paolo rejection in the whole board
   ("dog shit") and the measured structural failure (v1 never touched the
   ground), so its acceptance tests are the stricter set. Use them for both.

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
   approved fire bank | RUN lane | HIGH | FORM: TF-LAB-001 (the DEPLOYED CAMP
   half only — filled 7/28 by LAB, which owns
   laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md. The FIRE is already
   approved and is NOT an ask. The kit roster stays HELD at H4 until Paolo
   rules clause (g). The CARRIED half is its own row, 80.)
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
9. OPEN | GRAVEL / BALLAST GROUND (fine yard gravel + coarse rail ballast +
   the gravel-to-desert blob edges, plus a wet colorway) | RUN — five district
   types are floored in crushed rock and all of them render as the single
   starter tile `dirt`: solar `gravel access road` x1150/cell, substation
   `gravel yard` x924, battery x891, railyard `ballast` x739, swapmeet x398
   (records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md) | ground layer,
   self-seamless + blob-47 to desert; seam MEASURED before judging | the frozen
   starter set's `dirt` and `concrete_0` (it must sit between them in value) |
   RUN lane | HIGH | FORM: TF-RUN-002
10. OPEN | CHAIN-LINK FENCE + RAZOR WIRE (straight run, corner, gate leaf,
   breach) | RUN — the game's FIRST see-through structure. Five approved
   district dossiers specify fencing in their own words ("fortress fence",
   "double-fenced", "fenced") and every one currently resolves to `wall_base`,
   the same opaque course the run lays as the bottom of a HOUSE — the identical
   defect Paolo already named once ("the suburb border walls are not changed
   its still the house tiles") | structure layer, SOLID, 2 tiles tall (door
   law), WANG-16 line + single-placement gate/breach; gate leaf reuses the
   approved 9-frame 2-beat door clip contract | the 13 approved perimeter walls
   as its deliberate OPPOSITE NUMBER | RUN lane | HIGH | FORM: TF-RUN-003
11. OPEN | CORRUGATED METAL BUILDING SKIN (wall face, base, under-eave, corner,
   roll-up surround; 2-3 colorways) | RUN — the industrial half of the valley is
   built out of house stucco: industrial `warehouse` x416/cell, storage
   `storage-unit building` x333, warehouse `tenant unit` x267, firestation
   quarters x355 | structure layer, slots into the run's existing 4-course
   stack with no renderer change; self-seamless horizontally (highest seam risk
   on the board - the ribs expose any seam) | the starter set's wall stack +
   garage bay | RUN lane | HIGH | FORM: TF-RUN-004
12. OPEN | TILT-UP / PRECAST CONCRETE BUILDING SKIN (panel, panel joint, base,
   parapet, corner) | RUN — every civic monument in the game wears tract
   housing: downtown `podium / mid-rise` x882/cell (the largest structure count
   in the survey), library x682, courthouse x651, jail x424, medical x394,
   policestation x334 | structure layer, self-seamless + single-placement panel
   joint every 4-6 tiles; big blank fields, NO dither | the starter set's
   `roof_deck` + `roof_parapet`, which exist and have nothing to sit on | RUN
   lane | HIGH | FORM: TF-RUN-005
13. OPEN | MOBILE HOME SKIN (side, end, skirting, low roof edge, burned-out
   variant) | RUN — trailer `mobile home` x395/cell renders as stucco with a
   hip roof, which is wrong in all four ways that matter (metal not masonry,
   low not tall, shallow roof not hip, on blocks not slab); the approved
   trailer dossier already gates the LAYOUT ("some burned out") while the
   MATERIAL does not exist | structure layer, SHORTER than the 4-course stack
   (2 courses + skirting - stack override to be agreed BEFORE cooking);
   HORIZONTAL ribs, deliberately opposite to row 12 | the 30 approved house
   skins, as the deliberate contrast | RUN lane | MED | FORM: TF-RUN-006
14. OPEN | SOLAR PANEL ARRAY (row, row end, cracked panel, bare rack, frozen
   tracker) | RUN — solar `solar panel` x354/cell renders as house stucco, so
   the most recognisable industrial silhouette in the Mojave looks like tiny
   suburban walls; also unblocks the theme sheet's own solar hook ("frozen
   solar trackers out of step"), which cannot be drawn today | structure layer,
   TILTED PLANE (the clearest test of the 45-degree law on the board), dark end
   of the structure band, self-seamless along the row axis; map-readable so the
   squint test applies | approved LAMP DARK VARIANTS as the nearest tonal
   reference | RUN lane | MED | FORM: TF-RUN-007

99. OPEN | THE RESOURCES CURRENCY MARK (apple + hammer + duct tape, composed
   into ONE icon) | PHONE (Wallet), city-builder build costs, pickup readouts —
   the three currencies were locked 7/26 and NONE of them has a face; the Wallet
   app is a tile with nothing to show | UI/prop layer, single placement, must
   read at 32px; THE SOLID-BLACK TEST is the acceptance gate (fill it black - if
   the blob is a lump the composition failed) | no approved anchor exists: this
   is the game's FIRST UI icon, so the frozen visual constitution is the anchor |
   Paolo direct 7/28 | HIGH | FORM: TF-RUN-008
100. OPEN | THE ENERGY CURRENCY MARK (jerrycan + AA battery + lightning bolt,
   composed into ONE icon) | PHONE (Wallet), power costs, lit-block readouts —
   the currency most tied to the game's core (12% lit, LIGHT=TERRITORY,
   powergrid, the solar/substation/battery districts) and it has no face | UI/prop
   layer, single placement, 32px; GLOW CEILING is the live risk (an electricity
   icon wants to glow and the act-1 ceiling is MEASURED) and so is purple |
   the constitution's glow ceiling + purity gate | Paolo direct 7/28 | HIGH |
   FORM: TF-RUN-009
101. OPEN | THE CLOUT CURRENCY MARK (a crowd + a speech bubble, composed into
   ONE icon) | PHONE (Wallet + the ME tab beside followers), clout costs — the
   currency with the MOST machinery already built (clout math, follower-scaled
   comment volume, socialProfile) and the least visibility | UI/prop layer,
   single placement, 32px; the crowd must read as ONE MASS not countable heads,
   and the bubble's tail is the first casualty at small size. NEVER ON A FEED
   POST - the visible clout badge was KILLED 7/21 | Cyberpunk street cred as the
   outside ref | Paolo direct 7/28 | HIGH | FORM: TF-RUN-010

=============================================================================
## OPEN — MED
=============================================================================
15. OPEN | ACT-1 TILESET REMAINDER (wall corner families, curb/sidewalk
   transitions, remaining per-district material coverage) | RUN/CITY — grow
   the 42 frozen starter tiles to full district coverage; this is RUN 0b's
   "each type needs its own dressed language" | per the mobile render
   contract + seam contracts | the frozen target + starter set | ART lane's
   own queue | MED
16. OPEN | CEMETERY MAP ICON | MAP — the district is APPROVED ("very good")
   and has no icon; named in the theme sheet as the highest-value icon debt
   in the game | map-zoom silhouette readability (squint test) | the approved
   cemetery district itself | WORLD (theme sheet 7/28) | MED
17. OPEN | INTERIOR STAIRWELL DRESSING (stair-adjacent wall/rail/landing
   props so upper floors read as real rooms, not bare plates) | RUN + CITY
   interiors — follows row 1 when verticality lands | prop layer, props
   never become collision (7/26 interiors law) | UP interior pool (approved,
   already consumed by the run) | MED — blocked by row 1 shipping first

18. OPEN | FOOTFALL DUST (the pale caliche puff a boot lifts off dry ground;
   walk puff + heavier run/land puff) | RUN + COMBAT + the CHARACTER stage
   when a walk clip plays | prop layer, single placement, 4 frames over ONE
   beat at 120 BPM, leaf-pixel law (anchor frozen, only the cloud edge
   moves); SUPPRESSED ENTIRELY on wet ground | the approved particle/fire
   loop bank for loop discipline ONLY (dust occludes, it does not emit);
   Shovel Knight for pixel landing puffs | CHARACTER lane | MED | TF-CHAR-003
19. OPEN | PORTRAIT BACKDROP (a material behind the face in the portrait
   disc, replacing flat #12100c) | CHARACTER tab portrait + any future
   dialogue portrait | structure layer, single placement, clipped to a 120px
   disc, authored 1x head-on flat (the deliberate 45-degree exception, stated
   in the form); must separate BOTH palest skin and near-white hair
   (237,232,220) | shares material with TF-CHAR-002; Papers Please / Disco
   Elysium portrait grounds | CHARACTER lane | LOW | TF-CHAR-004

=============================================================================
## BLOCKER IN FRONT OF THE ART LANE'S OWN ROWS (added 7/29 by the ART lane)
=============================================================================
0A. OPEN | THE BOHEMIA MASTER PALETTE (design one, ~32 colours, every material
   family a SUBSET of it) | ALL surfaces — this is not a tile, it is the thing
   the eighteen tile families are drawn FROM | value skeleton designed FIRST in
   greyscale (M18), hue applied to it after; families share steps so they cohere
   because they are made of the same colours, not because one script derived
   them | the frozen CBB target's own measured colour is the raw material |
   ART lane (mastery law M17) | HIGH — THIS BLOCKS ROWS 10-17
   WHY IT IS A BLOCKER AND NOT A NICE-TO-HAVE: the 7/28 re-cook derived six
   INDEPENDENT family ramps that know nothing about each other, which the
   sources name as exactly the amateur pattern ("games where each sprite has
   its own unrelated colour scheme"). Cooking eighteen more families the same
   way would multiply that mistake by three. records/target/
   BOHEMIA_MASTER_PALETTE.json is NOT this — it is a 64-colour quantization OF
   the target screen, a measurement of what we happened to make.

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

20. OPEN | CMU BLOCK WALL (GREY CONCRETE MASONRY UNIT) | RUN (the walk) + CITY (human mode) | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-001
21. OPEN | CORRUGATED METAL WALL + ROLL-UP DOOR | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-002
22. OPEN | PARKING LOT STRIPING (STALLS, AISLES, WHEEL STOPS) | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-003
23. OPEN | CHAIN-LINK FENCE (AND ITS RAZOR-WIRE VARIANT) | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | HIGH | TF-ART-004
24. OPEN | DEAD SPORTS TURF AND RUNNING TRACK | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-005
25. OPEN | EMPTY POOL AND CONCRETE BASIN | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-006
26. OPEN | CIVIC CUT-STONE MASONRY | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-007
27. OPEN | STOREFRONT GLASS AND ALUMINIUM | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown) | MED | TF-ART-008

28. OPEN | BRICK MASONRY (RUNNING BOND FACE, SOLDIER COURSE, CORNER RETURN) | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-009
29. OPEN | RAILROAD TRACK BED (BALLAST, SLEEPERS+RAIL, TURNOUT, GRADE CROSSING) | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-010
30. OPEN | FREEWAY SURFACE + JERSEY BARRIER + GUARDRAIL | RUN + CITY | ground + structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-011
31. OPEN | COMMERCIAL FLAT ROOF + ROOFTOP MECHANICAL | RUN + CITY (the top of every non-house building) | top layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | HIGH | FORM: TF-ART-012
32. OPEN | MOBILE HOME SIDING + SKIRTING + CARPORT EDGE | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-013
33. OPEN | CROP FIELD (FURROWS, IRRIGATION BERM, FIELD EDGE) | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-014
34. OPEN | LANDFILL WASTE CELL + DAILY COVER + HAUL ROAD | RUN + CITY | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | LOW | FORM: TF-ART-015
35. OPEN | SOLAR PANEL ARRAY + INVERTER PAD + MAINTENANCE LANE | RUN + CITY | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | MED | FORM: TF-ART-016
36. OPEN | WALL CORNER + OPENING REVEAL COMPLETION | RUN + CITY (EVERY building in the game) | structure layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | HIGH | FORM: TF-ART-017
37. OPEN | KERB + DRIVEWAY APRON TRANSITION SET | RUN + CITY (every street edge in the valley) | ground layer, 44px corpus cell, seam contract in the form |
   see form | ART lane (row 7 breakdown, filled 7/29) | HIGH | FORM: TF-ART-018

# STILL TO FORM (this walk found them; forms next ART turn, not dropped):
#   brick masonry (downtown low-rise, older commercial) · railroad track bed
#   (railyard, crossings) · freeway surface + barrier + guardrail (freeway,
#   interchange) · commercial flat roof + rooftop mechanical (every non-house
#   roof) · mobile-home siding + skirting (trailer park) · crop field furrows
#   (farm) · landfill waste cell ground · solar panel array surface (solar,
#   battery) · wall CORNER + opening reveal completion (the starter set's own
#   named gap) · kerb/driveway apron transition set (the other named gap).

# ROW NUMBERS 90-99 RESERVED for the TEN "still to form" items above as their
# forms land. Deliberately parked above the highest row in use (82) because
# 28/29 and 45-49 are one collision away from the four other lanes appending to
# this board the same week, and because the board's own standing note is
# correct: THE STABLE KEY IS THE TF ID, NOT THE ROW NUMBER.
# NOTE 7/29: eight of those ten already have forms on disk and STILL HAVE NO ROW
# HERE, so tileform_gate is red on them. Rows owed, not written by me — the
# lane that filed the forms files the rows. (No id is spelled out in this
# comment on purpose: the gate matches board rows by substring, so naming a
# form here would make its missing row LOOK filed.)
97. OPEN | WALL CORNER + OPENING REVEAL (the joinery that makes a building a
   SOLID instead of a cardboard flat) | RUN + CITY + every interior | structure
   layer, 44px corpus cell, WANG-16 on the wall run plus the concave cases; ten
   pieces (both hands of the outside and inside corner, jamb/head/sill reveals,
   parapet and rake corner) | see form | ART lane (row 7 breakdown) | HIGH |
   FORM: TF-ART-017 | SCOPE OVERLAP, FLAGGED NOT SETTLED: its parapet-corner
   piece is the same object as the commercial-flat-roof form's parapet-cap
   corner, and its jamb pieces sit beside the garage-door-skin form's per-skin
   jamb cases. Both overlaps are named in full in section B of the form. One
   form must own each piece, and that is a coordinator call, not mine.
98. OPEN | KERB + DRIVEWAY APRON TRANSITIONS (kerb return, dropped kerb, apron
   flare, gutter inlet, kerb-meets-crossing) | RUN + CITY — the frozen set's
   kerb runs dead straight past all four events, so corners do not turn, cars
   cannot get in and water goes nowhere | ground layer, 44px corpus cell,
   WANG-16 with the corner authored as a fixed multi-cell block; every road-side
   edge reproduces road_gutter's baked nine-row shadow ramp at phase | the
   frozen CBB starter set's walk_kerb / road_gutter / road_crossing (measured in
   the form); GTA2's street kit anatomy | ART lane (row 15 breakdown) | HIGH |
   FORM: TF-ART-018 | SCOPE OVERLAP, FLAGGED NOT SETTLED: rows 31 (TF-WORLD-002,
   kerb/sidewalk) and 65 (TF-CITY-006, driveway apron + rolled kerb cut) both
   claim members of this family. The form declares the overlap and proposes the
   split in its section B; who owns the dropped kerb and the apron flare is a
   coordinator call, not the ART lane's, and it must be settled BEFORE cooking
   or the same kerb gets drawn in three materials.
91. SHIPPED | DRY BEDS (drought lakebed polygons + swept pit floors) |
   RUN + CITY - 8,600+ cells of the valley's most famous dead surfaces
   (Mead's bathtub bed, both pit floors, the terminal hardpan) fell to
   the gravel fallback; golf's 2,074 fairway cells joined the approved
   turf family as pure wiring in the same turn | ground layer, 44px
   corpus cell, self-seamless (hashed crack seeds, matched silt base,
   three variants) | see form | ART lane (fresh inventory ranking,
   8/26) | HIGH | FORM: TF-ART-025
104. SHIPPED | GUY WIRES (the radio site's rigging fans) | RUN + CITY -
   2,798 cells of mast rigging drew as plain ground; eight direction-
   snapped steel-cable overlays, each wire cell BEARING ON ITS NEAREST
   MAST (positions cached per district cell), glint sun-side, faint SE
   shadow | ground overlay, 44px corpus cell | see form | ART lane
   (fresh inventory ranking, 8/27) | MED | FORM: TF-ART-030
105. SHIPPED | PROPANE TANK / ICE BRIDGE (the radio site's plant) | RUN +
   CITY - 3,376 cells (139 blobs) drew as plain ground; the dims sort
   the shared name into its two real things, so the wiring does too:
   thin runs >=5 long become galvanised ICE-BRIDGE tray ribbons along
   their axis, everything else becomes banks of bleached 500-gallon
   TANK cylinders (lit crown, shadowed belly, saddle shadows, weld
   rust) | structure layer over yard ground, 44px corpus cell | see
   form | ART lane (radio measure, 8/27) | MED | FORM: TF-ART-031
108. SHIPPED | BATHTUB RING (the white band the lake left) | CITY -
   108,559 ground cells at water + dam and 1,274 structure cells at the
   intake of the most photographed drought mark on earth drew the
   generic fallback - the census's LAST named family with no approved
   art. Crust from the approved kerb pale lifted one step, worn holes
   from the approved riprap rock; stand lines at CANONICAL rows shared
   across variants, wandering +/-1 mid-tile and PINNED at both edges so
   any two ring cells join (edge proven on a rendered h0|h1|h0 strip
   before wiring); axis follows the kit's own run like the channel
   bank. Measured a full value step brighter than the bed it borders
   (150.5 vs 117.5) so the band READS. Counters 100% on both names;
   walked at the water shoreline | ground layer (+ intake structure via
   sPool), 44px corpus cell | see form | ART lane (the 8/28 census,
   8/30) | MED | FORM: TF-ART-033
107. PHASES 1-2E SHIPPED 8/28-8/30 | THE GREAT TILE MIGRATION (every exterior
   family to the walked surface) | CITY - measured 8/27: all 32 wired
   families drew only in the legacy run slice, which the alpha stopped
   downloading on 8/21. PHASE 1 (8/28): the walked page resolves every
   kit cell to its legend entry and routes ground cells to art pools BY
   NAME, so nine approved GROUND pools (fill, drought bed, pit floor,
   plaza, plinth, invert, bank, xeriscape, tank deck - 90 KB) ride a
   late-loading pool file on the floors precedent (main ad42288), merge
   into SA_IMG, and thirteen name rows route them; the wash bank picks
   its axis from the kit's own run. VERIFIED ON FOOT: 6,803 fill cells
   at the landfill and 5,898 plaza/plinth cells at the library draw the
   real art in human mode. PHASE 2A SHIPPED same
   day: the railyard's rolling stock rides the vehicle-post contract
   (masters repackaged nose-up; a 7x4 lattice replaces the sedan
   lattice that was parking three squashed cars on every boxcar) -
   verified on foot: 118 boxcar + 14 loco posts, the exact measured
   blob counts. PHASE 2B SHIPPED same day: the structure and
   prop layers route by name too (c.sPool, honored ahead of the generic
   material pool - specific beats generic; the cooling units and tanks
   sat behind the prop layer's early return and were caught by probes),
   the wash's centreline stain and the blob-aware planter ride the kit's
   own runs. Verified on foot: the datafort membrane underfoot, tank
   rows with aisles at the radio site, the stained invert at the wash.
   PHASE 2C SHIPPED same day (the walked-world census): the 676-name
   census ranked every unrouted name; parkway xeriscape, cracked silt
   and talus joined already-approved pools by routing alone, ~5.8M
   cells upgraded with zero new pixels. PHASE 2D SHIPPED same day: the
   baker gains an OVERLAY hook (gArtOver on ground, sOver on structure)
   and the direction-critical pools ship as ONE-TILE pools because the
   weather-rarity shuffle permutes anything longer than seven; the guy
   wires bear on their nearest mast (one kit scan per tile, 8-way
   snap - verified on foot at the radio site), and the planter bed
   rims close the recorded debt (lone box / edge-to-edge soil / a
   concrete rim per OPEN side, corners wearing two). THE 2D AMBUSH,
   third of its kind: the planter branch first shipped in the GROUND
   name table and a dedicated counter read 0 of 266 cells routed -
   every planter in the game is legend kind STRUCTURE, so the routing
   moved to the structure block (sPool + sOver) and the counter reads
   266 of 266. A COUNTER PER FAMILY, not a walk past it: the walk
   showed a plaza; the count showed the branch never ran. PHASE 2E
   SHIPPED 8/30: the census's four biggest remaining names join their
   ALREADY-APPROVED families, ~5.3M more cells, zero new pixels. The
   solar field's 1.4M panel cells were wearing HOUSE SHINGLES (the
   hroof structure fallback); they now draw TF-ART-016's dark glass
   with the legacy row contract ported (row = run-above count capped
   at 3, phase = column mod 3, end caps as sOver overlays, and the
   run check crosses tile seams BY NAME because a neighbouring tile
   numbers its legend differently). The farm's field soil (950K),
   crop rows (273K, family-per-plot so a field reads as ONE field)
   and irrigation (65K) port the 8/11 TF-ART-014 contract verbatim;
   the freeway/interchange embankment (2.6M) takes the berm on the
   run's own axis (talus=riprap precedent - same material, same
   read). Counters: 100% routed on every family's biggest tile,
   solar rows cycling 1290/1204/1204/1204 with balanced end caps.
   Verified on foot: solar, farm, freeway. REMAINING (recorded, not
   urgent): bathtub ring (NO approved art - needs its own form),
   boxcar running-order polish | full finding:
   records/BOHEMIA_FINDING_THE_TILES_RIDE_A_SURFACE_NOBODY_WALKS_8_27_26.md
   | ART lane (fifth audit follow-through, 8/27) | HIGH | FORM: —
106. SHIPPED | WASH CHANNEL (invert + banks, the riprap's promised half) |
   RUN + CITY - 9,694 cells of the flood channel's own concrete drew as
   bare ground; jointed invert with the low-flow meander stain on
   CENTRELINE CELLS ONLY (edge-pinned so it joins; the first render
   stained every cell and read as a barcode), banks streaked down their
   slope. Same turn, pure wiring: watertreat's 'dry basin floor' x6920
   joined the TF-ART-025 bed tiles, zero new pixels | ground layer,
   44px corpus cell | see form | ART lane (riprap follow-through, 8/27)
   | MED | FORM: TF-ART-032
103. SHIPPED | CIVIC PLAZA (library paving, plinth terrace, planter beds) |
   RUN + CITY - 6,415 cells of the valley's most formal ground fell to
   gravel; scored paving with grime in the saw joints, lighter plinth
   slabs, and BLOB-AWARE planters (a lone cell is a box, a 5x7 blob is
   ONE bed with edge rims - the live look caught the waffle) | ground
   layer, 44px corpus cell, self-seamless | see form | ART lane (fresh
   inventory ranking, 8/27) | MED | FORM: TF-ART-029
102. SHIPPED | DATAFORT ROOFS + COOLERS (hall membrane, generator deck,
   cooling units) | RUN + CITY - 6,300+ cells of the datafort's built
   mass drew as brown noise; per-cell membrane with N+W sheet seams
   (the reservoir-deck contract), standing-seam generator deck, one
   dead CRAC module per cooling cell with a stopped-fan cross; the
   !body guard keeps every 3/4 front face | structure layer, 44px
   corpus cell, self-seamless | see form | ART lane (fresh inventory
   ranking, 8/27) | HIGH | FORM: TF-ART-028
101. SHIPPED | ROLLING STOCK (the railyard's stranded boxcars + dead loco) |
   RUN + CITY - 3,346 cells of the yard's signature content (118 boxcar
   blobs, 101 exactly 7x4 cells, + 14 loco blobs) drew as windowless
   wall mass; roof-read RGBA sprites, one per flood-walked blob at its
   right-bottom anchor (the trailer law), three weathers hashed per
   blob, no reporting mark or number ever | vehicle layer, 308x176 px
   (7x4 cells) | see form | ART lane (fresh inventory ranking, 8/27) |
   HIGH | FORM: TF-ART-027
100. SHIPPED | WASTE FILL (the landfill's compacted trash + berm wiring) |
   RUN + CITY - the dump's DOMINANT surface (6,400+ cells per district
   cell, measured 8/27) drew as yard gravel and its 3-thick berm rings
   drew as nothing; fill cooked from approved dirt/pale/rust, berms
   wired as PURE REUSE of the approved mag_ ridge pieces, zero new berm
   pixels | ground layer, 44px corpus cell, self-seamless (three hashed
   variants, one carrying a dead compactor's track pass) | see form |
   ART lane (fresh inventory ranking, 8/27) | HIGH | FORM: TF-ART-026
92. SHIPPED | LANDSCAPING (dead xeriscape beds, police station) | RUN +
   CITY - 1,131 named cells fell to the gravel fallback, erasing the one
   manicured ground in the district | ground layer, 44px corpus cell,
   self-seamless mulch (three hashed variants) + agave/boulder overlays
   | see form | ART lane (inventory ranking, 8/25) | MED |
   FORM: TF-ART-024
93. SHIPPED | RIPRAP (packed rock armor, wash) | RUN + CITY - 936 named
   cells fell to the gravel fallback, erasing the channel's armor bands |
   ground layer, 44px corpus cell, self-seamless full-cell tile (baked
   dirt gaps, three hashed variants against wallpaper on the 115-cell
   strips) | see form | ART lane (inventory ranking, 8/25) | MED |
   FORM: TF-ART-023
94. SHIPPED | BARRICADE POST (post-and-cable vehicle lines, arsenal) |
   RUN + CITY - 1,607 named cells fell to the gravel fallback, so the
   depot showed no movement control | ground layer, 44px corpus cell,
   self-seamless cable spans (edge-pinned) + single placement posts;
   rides on bought gravel | see form | ART lane (inventory ranking,
   8/24) | HIGH | FORM: TF-ART-022
95. SHIPPED | SPOUT / DUST BIN (loadout spouts + cyclone dust
   collectors, granary) | RUN + CITY - 1,514 named cells fell to the
   gravel fallback, erasing the elevator's working row | ground layer,
   44px corpus cell, single placement (rows read from the world's own
   cell placement); rides on bought concrete | see form | ART lane
   (inventory ranking, 8/24) | HIGH | FORM: TF-ART-021
96. SHIPPED | VALVE / HATCH (round access lids + two-leaf vault covers,
   reservoir) | RUN + CITY - 1,434 named cells fell to the gravel
   fallback, pockmarking the waterworks | ground layer, 44px corpus cell,
   single placement (runs read from wiring repetition down the measured
   pipe corridors); rides on bought concrete | see form | ART lane
   (inventory ranking, 8/24) | HIGH | FORM: TF-ART-020
99. SHIPPED | GRID KIT (transformer bays, switchgear lattice, overhead
   busbars, insulators, battery container banks) | RUN + CITY - the two
   districts that ARE the grid (substation MAINTAINED under CLUSTERED POWER,
   battery DEAD by its own dossier) drew as generic slabs | structure layer
   solid for bays/containers/lattice, OVERHEAD non-solid for the busbar
   runs, 44px corpus cell; bay pieces band the measured 19x20 bay, container
   pieces subdivide the 14-cell run into five 40-foot lids | see form | ART
   lane (post-board gap sweep, filed retroactively 8/24 - the form shipped
   8/21 with a "short form" shortcut this row and the full C-I sections now
   repair) | HIGH | FORM: TF-ART-019

=============================================================================
## OPEN — WORLD LANE (filed 7/28 under the TILE FORMS ORDER; every row has a
## ROW NUMBERS: this block is 30-44. THREE lanes appended concurrently and all
## three started at 10, so rows 10-13 (WORLD icon/misc), 10-17 (ART) and this
## block collided. I moved MY OWN block clear rather than renumber another
## lane's rows, because their forms carry BOARD ROW # pointers I would break.
## THE RESIDUAL COLLISION BETWEEN ROWS 10-13 AND 10-17 IS STILL THERE and is
## flagged for the board owner. THE REAL FIX: the stable key is the TF ID, not
## the row number -- an append-only board shared by parallel lanes cannot use a
## hand-assigned integer and stay unique.
## filled form in records/tileforms/. Walked all 48 district + surface
## generators: 687 declared legend entries, 483 distinct materials, grouped
## into 15 coherent drawing jobs. Rows already covered by 1-9 above are NOT
## re-filed — desert ground (row 4), dead foliage (row 5) and weather (row 6)
## between them cover the desert floor, the dead planting and the wet states,
## and the approved MARKING/STREET/HOUSE-SKIN/DOOR banks cover what they cover.)
=============================================================================
30. OPEN | LOT ASPHALT & APRON | RUN+CITY — the single largest man-made surface
   in the valley; Las Vegas is 32% parking (measured, legibility bible) and the
   approved 84-item MARKING bank has nothing to be painted ON | ground,
   self-seamless + blob-47 to desert; seam MEASURED before judging | approved
   MARKING bank + frozen CBB ground band | WORLD | HIGH | TF-WORLD-001
31. OPEN | KERB, GUTTER & SIDEWALK | RUN+CITY — SIDEWALK SANCTITY made visible;
   the most common real EDGE in a city and Lynch-edges scored "by accident
   only" | ground, WANG-16; kerb face is 0.15m — scale is the whole risk |
   approved STREET BLOCKS (the carriageway it butts against) | WORLD | HIGH |
   TF-WORLD-002
32. OPEN | CHAIN-LINK & SECURITY FENCE | RUN+CITY — 20 districts declare a
   fence; the approved perimeter walls are SOLID SUBURB STUCCO, the opposite
   object | structure, WANG-16, MUST read see-through | the approved suburb
   wall family as its deliberate opposite number | WORLD | HIGH | TF-WORLD-003
33. OPEN | DEAD WATER & THE BATHTUB RING | RUN+CITY — drained pools, dry
   fountains, cracked lakebed; the waterpark hook Paolo called "so fucking
   terrible"; Lake Mead's mineral ring is 30 miles from this map | ground +
   structure coping, WANG-16 ring + seamless floor | cemetery district
   (approved "very good") | WORLD | HIGH | TF-WORLD-004
34. OPEN | SPORTS SURFACES | RUN+CITY+MAP — track, court, field, green,
   bunker, banking: for 7 districts the playing surface IS the landmark under
   the 7/28 law | ground, seamless fields + single-placement painted lines;
   real proportions are the read | approved MARKING paint values | WORLD |
   HIGH | TF-WORLD-005
35. OPEN | RAILWAY PERMANENT WAY | RUN+CITY+MAP — ballast, sleepers, rails,
   turnouts, crossings; the line the city was founded on, 90 cells, no art.
   NOT built from road vocabulary (named 7/27 error) | ground, seamless along
   the running direction; gauge 1.435m is the critical proportion | frozen CBB
   ground band | WORLD | MED | TF-WORLD-006
36. OPEN | FLAT COMMERCIAL & CIVIC ROOFS | CITY+RUN+MAP — in a 45-degree view
   the ROOF is the largest visible part of every building, and the style
   bible's own rule 4 ("roofs carry the color, walls are pale") was written
   7/23 and never executed. THE PRIMARY HUE CARRIER: measured 3 hue families /
   13.4% chromatic vs Pocket City 2's 12 / 87.5% | structure, seamless field +
   WANG-16 parapet | approved HOUSE SKIN roof VALUES (geometry deliberately
   different — those are pitched residential) | WORLD | HIGH | TF-WORLD-007
37. OPEN | STOREFRONT, FALSE FRONT & AWNING | RUN+CITY — the one building face
   you walk right up against; "the building is still trying to sell you
   something and nobody is buying" | structure, WANG-16, 3-tile wall law, glass
   DEAD DARK at night (our inversion of the reference) | approved boarded-window
   treatment + 2-tile door proportion | WORLD | HIGH | TF-WORLD-008
38. OPEN | OVERHEAD CANOPIES | RUN+CITY — 13 declared overhead materials and
   the OVERHEAD layer has zero art; NOT SOLID is the whole point | overhead,
   WANG-16 deck + separate solid columns | approved LAMP DARK VARIANTS for the
   dead-fitting language | WORLD | MED | TF-WORLD-009
39. OPEN | SIGNS & PYLONS | RUN+CITY+MAP — every district needs ONE TALL THING
   visible from the next cell; Lynch LANDMARKS scored ZERO and Vegas's
   landmarks ARE its signs | structure, SINGLE PLACEMENT, no readable text ever
   (contents are Paolo's) | approved LAMP DARK VARIANTS | WORLD | HIGH |
   TF-WORLD-010
40. OPEN | DEAD HEAVY VEHICLES | RUN+CITY — locomotive, wagon, semi, bus, fire
   engine, tractor, dozer, boat: what the canon CAR size cannot express |
   prop, single placement (wagons repeat nose-to-tail); bound to the canon size
   constants the vehicle-size gate enforces | canon CAR/BUS/TRAILER/RAILCAR/LOCO
   | WORLD | MED | TF-WORLD-011
41. OPEN | INDUSTRIAL YARD GROUND | RUN+CITY — gravel, stained concrete, spoil,
   sorted debris; the whole utility family was rejected at once and what they
   share is that their GROUND carries the meaning | ground, seamless + blob-47
   to desert + single-placement piles | approved DESERT values it grades into |
   WORLD | MED | TF-WORLD-012
42. OPEN | TANKS, TOWERS & SILOS | RUN+CITY+MAP — the vertical landmarks; a
   cylinder is the most recognisable silhouette we have and we draw them as
   blocks. THE 45-DEGREE LAW'S own case: ellipse cross-sections or automatic
   fail | structure, single placement | the BLESSED LAMP BANK (the 45-degree
   law's named reference) | WORLD | MED | TF-WORLD-013
43. OPEN | CENTRE-PIVOT IRRIGATION & DEAD ALFALFA | RUN+CITY+MAP — Paolo's own
   correction, verbatim: "this is nevada nevada is in a dessert so". Nevada
   farms alfalfa under pivot, never row crops; the quarter-mile arc is a
   top-tier silhouette | ground field + single-placement machine; STOPPED
   mid-rotation, never animated | approved DESERT values (the hard circle edge
   against them IS the asset) | WORLD | MED | TF-WORLD-014
44. OPEN | MOUNTAIN & TERRAIN RELIEF | RUN+CITY+MAP — the ring that makes this
   a valley; 9 declared materials, no art, and the largest Lynch EDGE in the
   game. The one family that is NOT degraded — rock does not care | structure
   faces + ground slopes, WANG-16 cliff bands; ONE-LIGHT is doing all the work
   | approved DESERT/TERRAIN picks (the honest near-miss: flat ground, no
   vertical face) | WORLD | MED | TF-WORLD-015


=============================================================================
## OPEN — COMBAT LANE (filed 7/28 under the TILE FORMS ORDER; every row has a
## filled form in records/tileforms/. Walked the combat field itself: every
## object drawFloor/drawField draws as a code primitive, cross-referenced
## against the banks by (pack,idx) and RENDERED AND LOOKED AT.)
## ROW NUMBERS: this block is 50-57. Four lanes appended the same day and all
## four started at 10; WORLD moved itself to 30-44 and flagged the residual,
## and I have moved mine clear of everything rather than renumber anybody
## else's rows, because their forms carry BOARD ROW # pointers I would break.
## I AGREE WITH WORLD'S DIAGNOSIS: the stable key is the TF ID, not the row
## number. An append-only board shared by parallel lanes cannot use a
## hand-assigned integer and stay unique. That is the board owner's call.
=============================================================================
50. OPEN | LOW COVER, VAULTABLE (jersey barrier, wheel stops, low CMU planter,
   sandbags — 3-4 silhouettes at ONE shared height) | COMBAT (fight field) +
   RUN lots — the vaultable/not distinction is a LIVE mechanic (`tall:
   true/false`, `bestCover(lowOnly)`) and it is currently carried by A BLUE
   TINT ON AN ABSTRACT BOX, which is STRUCTURE-NOT-COLOR inverted | structure,
   44px cell, SINGLE PLACEMENT; height IS the spec (NDOT F-shape barrier = 32in
   = waist on the rig) | 12 APPROVED barricades in DEMO_PROP_POOL pack "5.
   Barricades and defenses" — USE THESE FIRST; XCOM 2 as the anti-reference |
   COMBAT lane | HIGH | FORM: TF-CMB-001
51. OPEN | TALL COVER, BLOCKING (CMU wall stub, concrete column, utility
   cabinet, dumpster — 3-4 silhouettes above chest height) | COMBAT + RUN lots
   — the other half of the same mechanic; NOT ONE of the 12 approved barricades
   is tall, checked by rendering them | structure, 44px cell, blocks sightline,
   tan 85/15 applies | PERIMETER_WALL_POOL (26 approved) for material truth;
   Jagged Alliance 2 | COMBAT lane | HIGH | FORM: TF-CMB-002
52. CLOSED BY REUSE (7/30) | THE DEAD PASSENGER CAR AS COVER | COMBAT + RUN — there are ZERO
   vehicles on the combat field; a fight in a dead city with no dead cars reads
   as a test harness | structure, MULTI-TILE, must match the ONE canon
   `_vehicle` size (vehicle_size_gate); asymmetric hide height (chest at the
   engine, waist at the boot) | `car_wreck` x20 in STREET_PROP_POOLS — TRY
   FIRST, cook nothing if it reads at 45; Project Zomboid | COMBAT lane | HIGH
   | FORM: TF-CMB-003 | *** CLOSED 7/30: the 20 were rendered and looked at, they
   are real top-down sun-bleached abandoned cars, and they SHIPPED. Paolo ruled
   the size (2 tiles by 3). NOTHING FOR THE ART LANE TO COOK. *** | NOT a duplicate of row 40 / TF-WORLD-011: that form
   EXCLUDES the car by its own scope note ("the CAR itself is canon and already
   sized"). Sized is not DRAWN. This row is the pixels that scope note assumes.
53. OPEN | THE UPPER DECK SLAB (top plate + spandrel edge beam + soffit) |
   COMBAT two-storey arenas (LIVE since v90) + CITY/RUN parking structures —
   the whole second storey is a flat fill, a near-black rectangle and a 2.5px
   stroke | structure w/ walkable top, WANG-16 edge set, edge beam authored to
   the demo's real `DECK_H` ratio | `roof_deck` + `roof_parapet` +
   `concrete_0/1` (approved, all partial); Project Zomboid | COMBAT lane | HIGH
   | FORM: TF-CMB-004
54. OPEN | THE DECK STAIR RUN (deck down to the lot, open air) | COMBAT — **the
   only asset in this lane Paolo has verbally rejected**: "I couldn't find the
   stairs bro", then "you have stairs right now looking like dog shit" | PORTAL
   layer, single placement, ALWAYS descends toward the viewer (the generator
   deletes the other 3 orientations), spans exactly one storey | NO STAIR EXISTS
   IN ANY BANK — checked all 12 prop families, the 42 starter tiles, the 465
   interior tiles; SLYNYRD Pixelblog 41 + Project Zomboid | COMBAT lane | HIGH |
   FORM: TF-CMB-005 | SAME BATCH AS ROW 1 (the INTERIOR half). One cook, one
   judging, never cook stairs twice.
55. OPEN | THE DECK GUARD (parapet / pipe rail / kerb wall + END + STAIR
   OPENING) | COMBAT — a second storey with no edge object means no visual
   price for standing exposed at the lip | structure, WANG-16 on the slab grid,
   42in code guard height, `solid` DIFFERS per variant (solid parapet vs
   see-through rail) | `roof_parapet` is approved and may simply BE the answer —
   try it, cook nothing if it works | COMBAT lane | MED | FORM: TF-CMB-006
56. OPEN | THE MUZZLE FLASH | COMBAT — the most-seen frame in the game is a
   code-drawn shape, identical for a pistol and a shotgun; every hook already
   exists (`WEAPON_MUZZLE` per-weapon barrel offsets, `G._muzzle` point+angle) |
   prop/fx, 3-4 frames on a LEGAL NOTE (32nd or 16th, `BohemiaFreeze.note`), 2
   orientations x 4 weapon sizes, WHITE-HOT never orange, gated on the freeze |
   approved `o_fx_spark_burst_06` + `o_fx_smoke_puff_01` ship WITH it as reuse;
   Hotline Miami | COMBAT lane | MED | FORM: TF-CMB-007
57. OPEN | FIGHT LITTER (spent brass + scorch, 3 densities) | COMBAT — the
   ground keeps no record of a firefight | ground OVERLAY (sits on real ground
   texture), single placement; a casing is a 2-3px object and a pile is a
   TEXTURE | OVERLAY_BANK's 174 stain/rubble overlays + 16 approved
   `trash_debris`; Hotline Miami | COMBAT lane | LOW (dressing, not a mechanic,
   and the form says so out loud) | FORM: TF-CMB-008

=============================================================================
## NOT FILED BY COMBAT — the art already exists and was approved. WIRING.
=============================================================================
The COMBAT lane's shopping check turned up things it draws in code that are
ALREADY APPROVED and sitting in banks with no consumer. Filing forms for these
would be a REUSE-FIRST violation. Full write-up:
records/BOHEMIA_COMBAT_TILE_SHOPPING_FINDINGS_7_28_26.md
- THE STREET UNDER THE FIGHT: combat paints a procedural grey fill off a
  coordinate hash. The md5-locked 42-tile starter set has road_0/1/2,
  road_centre, road_gutter, road_crossing, concrete_0/1, dirt, yard_0/1/2,
  walk_0/1/2 and walk_kerb. The combat field is authored as a STREET (it has a
  median and lane dashes), so the starter street tiles cover it TODAY. WIRE IT.
  (For an arena authored as a LOT rather than a street, row 30 / TF-WORLD-001
  is the correct form and COMBAT is not re-filing it.)
- THE ROAD MARKINGS: combat hand-draws a double-yellow median and lane dashes at
  hardcoded world coordinates. MARKING_BANK has 84 approved items, 14 classes,
  "I like all of them", ZERO live surface. *** THAT HAND-DRAWN MEDIAN WAS THE
  PERSISTENT ORANGE PAOLO REPORTED FOR THREE TURNS: it drew AFTER the vignette
  meant to dim it, so the one pass that dims the scene ran before the brightest
  object in it. Painting canon by hand is HOW that happens. *** WIRE IT.
- THE BLOOD: GORE_OVERLAY_BANK's own header reads "combat floor-painting layer:
  blood/gore overlays, transparent, draw-after-ground". 20 UP. It has never
  touched the combat floor; combat draws two ellipses. WIRE IT — but whether
  combat may AUTO-place them is [PENDING Paolo]: the index holds them for story
  placement and contents are his.
- SMOKE + SPARKS: approved o_fx_smoke_puff_01 / o_fx_smoke_small_04 /
  o_fx_spark_burst_06 have no consumer; combat draws grey circles. WIRE THEM
  (they ship with TF-CMB-007).
- AND THE MEDIAN ITSELF IS IN A BANK, WITH A LAW ATTACHED. Following C3's advice
  and opening STREET_POOLS_HARMONIZED: it holds `median` x3 (+6 weathered),
  `lane_div` x2 (+4), `cross` x3 (+6), the 18+18 stall lines C3 already named,
  AND `markings_30yr_law` = wash 0.55 + a second 0.40 pass, sourced to Paolo
  7/14: "whites and yellows of all medians/crosswalks/lanes/parking should be
  more washed out". Combat draws its own median at rgba(184,160,40,0.55), full
  brightness, no wash. The orange he chased for three turns was a hand-painted
  object ignoring a law written specifically to keep that object dim.

=============================================================================
## OPEN — CITY LANE (filed 7/28 under the TILE FORMS ORDER; every row has a
## filled form in records/tileforms/. Found by WALKING THE SURFACE, not by
## reading code: the run was booted in a browser, walked out of the house,
## down the driveway, into the street and along the perimeter wall, and
## screenshotted at each stop. Every claim below is either a LINE OF THE REAL
## RENDERER or an enumerated bank -- the forms quote
## `if(c===5) return 'concrete_0';` and `drawImage(im,0,0,w,h*n)` verbatim.)
## ROW NUMBERS: this block is 60-67. FIVE lanes appended the same day and four
## of them started at 10. WORLD moved itself to 30-44, COMBAT to 50-57, and I
## have moved mine clear of all of them rather than renumber anybody else's
## rows, because their forms carry BOARD ROW # pointers I would break.
## I AGREE WITH WORLD AND COMBAT: the stable key is the TF ID, not the row
## number. THE RESIDUAL 10-17 COLLISION BETWEEN THE RUN AND ART BLOCKS IS
## STILL THERE and is still the board owner's call -- I did not touch it.
## The TILE FORM gate already keys on TF IDs and enforces them unique, which
## is the half of the fix that a gate can hold today.
=============================================================================
60. OPEN | ROOF EDGE FAMILY for the approved house skins (4 hips + ridge +
   eave, cooked per approved roof material) | RUN + CITY — his 30 house skins
   were approved as the house's MATERIAL and only cover the flat middle of a
   roof; every edge falls back to the frozen target set, so every house in the
   valley wears a brown roof with an ORANGE STRIPE where the mass turns |
   44x44, structure layer, WANG-16; each piece's interior edge must hash to
   its own material's roof_slope (constitution seam contract); top value band
   110.2 (72.8-137.4) | the 30 approved house skins + the CBB target's hip/
   ridge/eave for the SHAPE only; Project Zomboid roof edge sets as outside ref
   | CITY lane (measured 7/28 in the run's bodyTile) | HIGH | FORM: TF-CITY-001
61. OPEN | ROOFTOP EQUIPMENT (package AC unit, dead swamp cooler, vent stacks,
   turbine vent, satellite dish, dead solar) | RUN + CITY — in a 45-degree
   top-down game the ROOF is the biggest thing on screen in a residential
   district and ours has NOTHING on it; screenshotted 7/28, a third of the
   phone screen is one uniform slab | prop layer, single placement, 44x44
   cell (the AC box draws taller than its cell, 45 law), top value band, no
   glow — nothing runs | the blessed LAMP DARK VARIANTS bank (dead metal at 45,
   the 45-law's own reference); Prison Architect / Streets of Rogue for
   sparseness | CITY lane (screenshotted on the real run surface 7/28) | HIGH
   | FORM: TF-CITY-002
62. OPEN | RESIDENTIAL GARAGE DOOR in the house-skin language (closed /
   forced-racked / open-to-a-dark-bay) | RUN + CITY — the garage door is about
   a THIRD of a Vegas tract house's street frontage and it is the frozen
   target set's orange panel bolted onto a house wearing his approved skin |
   2 tiles tall x BAY_W, structure + PORTAL, WANG-16, wall value band 96.0
   (37.5-167.6); the interior bay === footprint w x h | the 30 house skins +
   the CBB garage_* for shape; NOT the door bank's industrial rollup (wrong
   proportion, wrong pool, named in the form's anti-reference) | CITY lane
   (measured 7/28) | HIGH | FORM: TF-CITY-003
63. OPEN | PERIMETER WALL CORNER + PILASTER + END + CAP COURSE | RUN + CITY —
   his 13 approved suburb border walls are ALL straight runs (bank opened, 26
   entries enumerated), so a wall that closes a neighbourhood just butts into
   itself at every turn and has no top | structure, WANG-16, run-facing edges
   hash to their own pool key; native 44x44 with NO resampling (the 7/28
   quarter-res regression); 2 tiles tall, not 3 | banks/BOHEMIA_PERIMETER_WALL_
   POOL_7_14_26.txt itself — the corner is cooked FROM the key it joins, so
   this is REUSE-FIRST by construction | CITY lane | HIGH | FORM: TF-CITY-004
64. OPEN | THE NEIGHBOURHOOD GATE (vehicle opening + pilasters + gate leaf in
   3 states + the pedestrian side gate, lit/unlit) | RUN + CITY + MAP — the
   run currently draws code 5, the ONE entrance to a walled community and a
   declared PORTAL in the district's own dossier, as `concrete_0`, a blank
   slab; the street-aware law's mandatory corner PEDESTRIAN gate has no pixels
   of any kind | portal + structure, single placement, opening >=2 tiles wide
   (a car surface), wall/top value bands, lit variant is rgb-only glow
   (leaf-pixel law), DEAD IS DEFAULT | the perimeter wall pool (the pilasters
   are cooked from the key the gate interrupts) + the lamp bank for the wired
   glow pattern; New Vegas's Westside walls as outside ref | CITY lane
   (measured 7/28 in the run's tile resolver) | HIGH | FORM: TF-CITY-005
65. OPEN | DRIVEWAY APRON + ROLLED KERB CUT (apron flare L/R, the cut across
   the gutter, the sidewalk crossing course) | RUN + CITY — the street-aware
   law makes the drivable network an EXPLICIT car surface and there is no art
   anywhere saying a car can get from the road onto a lot; driveway, kerb and
   gutter are three unrelated field tiles butted together | ground layer,
   WANG-16, this piece is ALL seam so the hash test on all four neighbours IS
   the acceptance test; ground value band 103.7 (49.3-152.2); two variants,
   rolled (residential) and vertical (arterial) | the CBB starter set's
   concrete/walk_kerb/road_gutter, whose seam rings are already published |
   CITY lane | MED | FORM: TF-CITY-006. SEE ALSO the RUN/ART kerb asks and
   TF-WORLD-002 (kerb/sidewalk): this row is the DRIVEWAY CROSSING
   specifically, the one cell run where the kerb profile changes for a car.
   Cook the kerb material ONCE and cut this from it.
66. OPEN | SUBURBAN YARD DRESSING (mailbox, ground condenser + pad, wheeled
   bin, boulder, xeriscape rock border, hose bib, house number) | RUN + CITY —
   yards render as flat tan fields with literally nothing on them; the
   walkable-land law's render-and-look bar says a district must read FINISHED
   AND USED | prop layer, never collision; single placement except the rock
   border (self-seamless along its axis); ground value band; DENSITY is the
   judgement, so the proof is a whole dressed block, not a lone-prop sheet |
   the lamp bank + the 3 approved yard skins | CITY lane (screenshotted 7/28)
   | MED | FORM: TF-CITY-007. NOT a duplicate of row 5: that is dead PLANTS,
   this is MAN-MADE OBJECTS; they compose in the same yard.
67. OPEN | THREE-COURSE BUILDING FACADE (base / mid / cap + the door-header
   course) | CITY first, RUN second — Paolo ruled every wall carrying a door is
   3 tiles tall, and the only way the engine can do it today is tallTex(),
   a documented VERTICAL STRETCH of one 16px tile, so a tall wall is one
   texture smeared three times with no base, no mid, no cap | structure,
   WANG-16, mid course must be vertically self-seamless (it repeats up a tall
   building); wall band for base/mid, top band for the cap's sky sliver;
   MUST STAY LEGIBLE AT WALL_SEE=0.35 (his see-through ruling is a hard art
   constraint on this form) | the CBB wall family, wall_base is the direct
   model; Project Zomboid's course system as outside ref | CITY lane (measured
   7/28 in the CITY frame's own tallTex) | MED | FORM: TF-CITY-008
   OVERLAP, NOT DUPLICATE: TF-RUN-005 (tilt-up/precast) and TF-ART-001 (CMU
   face) are MATERIALS; this row is the COURSE SYSTEM those materials get cut
   into. Agree the course anatomy here, then cook each material against it —
   do not invent a second stack.


=====
## OPEN — LAB LANE (filed 7/28 under the TILE FORMS ORDER)
## ROW NUMBERS 80-82, WITH A DELIBERATE GAP. This block has been renumbered
## THREE TIMES in one day: 18-20 (CHARACTER and ART took those while I was
## verifying), then 60-62 (CITY took those), now 80-82 with a gap above the
## highest row in use (67). I first took 18-20 and by
## the time I pushed, CHARACTER held 18-19 and ART held 20 — the third collision
## of the day on this board. I did NOT renumber anyone else (their forms carry
## BOARD ROW # pointers I would break); I moved my own block above the highest
## row in use (57) and left a gap.
## AND THE RUN LANE'S DIAGNOSIS IS CORRECT, so it is worth restating rather than
## re-learning: THE STABLE KEY IS THE TF ID, NOT THE ROW NUMBER. An append-only
## board shared by parallel lanes cannot use a hand-assigned integer and stay
## unique. Every one of my forms carries its TF id and the art lane should read
## by id; the row number is a convenience that will keep drifting until the board
## owner replaces it.
## WHAT THIS LANE FILED AND WHY IT IS ONLY FOUR: four of the five LAB surfaces
## are REFERENCE pages marked "NOT BOHEMIA" and lab_gate clause 3 forbids them
## from ever consuming approved art, so they need ZERO tiles, permanently. Only
## the MOBILE CAMP DIAL has real gaps, because its mechanisms became canon law
## (laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md). The DEPLOYED camp is row 3
## (TF-LAB-001 fills that formerly formless HIGH row); these three are the rest.
=============================================================================
80. OPEN | THE CAMP, PACKED (the bundle on the player's back — the carried half
   of the mobile camp, with its walk facing set) | RUN + CHARACTER — the mobile
   camp law's clause 1 is TWO states ("a thing you CARRY and SET DOWN") and
   nothing on this board or in the corpus covers the carried one; today a packed
   player is visually identical to an unpacked one, which wastes the one
   silhouette that would communicate the game's headline survival ruling for
   free | prop, body-mounted, attaches to the rig (RIG LAW: never reshapes a
   painted region), leaf-pixel law across the walk | the canon rig + approved
   wardrobe outer layers; judged as a PAIR with TF-LAB-001 ("that unrolls into
   that") | LAB | HIGH | FORM: TF-LAB-002
81. OPEN | FIELD DRESSINGS (bandage roll + gauze pad: sealed, opened, and used
   states) | RUN at the camp + friendly-shelter interiors — the mobile camp law
   clause 8 is Paolo's own words, "a camp where u can apply a bandage... apply
   gauze", and clause 15 makes a dressing the answer to a wound | prop, tiny
   (hand-scale); the sealed state is the ONE clean thing in a dead world and the
   used state borrows the approved gore bank's legal red | approved GORE OVERLAY
   bank (20 UP) as the anchor for the used state; blessed lamp bank for the
   cylinder | LAB | MED | FORM: TF-LAB-003
   NOTE FOR EVERY LANE: THERE IS NO MEDICAL PACK ANYWHERE IN THE 87-PACK
   APPROVED CORPUS — enumerated 7/28 against
   banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt. Not judged down; never present.
82. OPEN | THE BULLET KIT (instruments laid out on a cloth: ready state + used
   state with the bullet on the cloth) | RUN at the camp, at NIGHT by the
   approved firelight — clause 8's "a place a companion can pull out a bullet
   from your body", which the law records as THE FIRST RULED MECHANICAL ROLE FOR
   A COMPANION in the game and which camp_dial_gate already locks (alone you
   cannot, with a companion you can) | prop, ~1 tile spread; specular metal is
   the point, so it is authored to be judged in firelight | approved
   fire-flicker bank + gore overlays; the approved junk packs are the CONTROL to
   compare against (if it reads as litter it failed) | LAB | MED | FORM:
   TF-LAB-004

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
H2. RESOLVED 7/28 — Paolo ruled "High school." The district was rebuilt the
   same turn (stadium landmark, student lot, no playground) and its icon
   rebaked; school_gate moved to the ruling. Its surface needs are now carried
   by rows 14 (sports surfaces), 16 (flat roofs) and 19 (the marquee).
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
- OPEN THE BANK, DO NOT READ ITS FILENAME (RUN lane, 7/28). Four candidate
  forms died to approved banks this turn and two survived only because the
  near-miss was rendered and LOOKED AT: `Metal floor tiles` sounds like it
  could clad a warehouse and is sci-fi deck plating; `Wall tiles` sounds
  universal and is a dungeon with a torch sconce. The shopping check is opening
  the bank; reading its name is not a shopping check.
  Full method + what it killed: records/BOHEMIA_RUN_DISTRICT_MATERIAL_SURVEY_7_28_26.md
- SHOP FIRST, ALWAYS: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md before
  any row is cooked — 1,927 approved HD tiles, 13 border walls, 30 house
  skins, 30 door clips, 84 markings, plus unused-approved tiers. A row is
  only cooked for what the index genuinely does not cover.
- MEASURE THE PROPERTY YOU RELY ON (the desert-pool lesson, 7/28): a bank's
  "seamless" claim is a claim. Ground families get their wrap measured
  BEFORE they reach Paolo's pile.
- Everything 45-degree law, everything verified on the real surface,
  delivered as assembled scenes beside the nearest approved anchor.
