# TILE FORM TF-ART-013 — MOBILE HOME (RIBBED SIDING, SKIRT, AWNING, HITCH, BURNED)

## A. IDENTITY
- NAME: Mobile home — the ribbed metal side of a single-wide, its vented skirt, its awning edge, its hitch end, and the burned-out shell of one
- FAMILY/SET: MOBILE HOME family, six members cooked as ONE job — (1) long side field, (2) belt/decal stripe course, (3) skirt course + louvre vent insert, (4) end face with the hitch, (5) the awning/carport edge, (6) the burned-out variant
- THE JOB, ONE SENTENCE: this family exists so the trailer park reads as a row of thin metal boxes standing on blocks over a dark ventilated void, instead of as a row of small stucco houses with hip roofs sitting on slabs.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS "STILL TO FORM" list, which names "mobile-home siding + skirting (trailer park)" verbatim as a gap this walk found and did not drop; and the district itself — gates/trailer_gate.js asserts, as a hard pass condition, `mobile homes + carports + sheds + streets + abandoned cars + propane + fence + lots` AND a separate `DEAD: some trailers burned out (the collapse story)` check that requires code 8 to exceed 80 cells in every one of its six street configurations. The layout is canon and gated; the MATERIAL for it does not exist.
- WHAT LOOKS BROKEN TODAY: engine/bohemia_trailer.js draws every lot's home as code 2, an 8x16-cell box, and the run's building stack renders it through the same house pipeline as the suburb — stucco field, four wall courses, a hip roof cap, no skirt. Four things are wrong at once and each is a silhouette error, not a colour error: the material is METAL not masonry, the mass is ONE LOW STOREY not four courses, the top is a shallow bowed metal roof not a hip, and the home stands on piers with a skirt instead of sitting on a slab. Result: the most visually distinctive residential district in the valley is currently indistinguishable from the subdivision two cells away. The gate is green and the district is wrong, which is exactly the case the laws say a green gate never argues.
- SHOPPING CHECK (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full; banks OPENED, not read by filename, per the ART lane's own standing note):
  - HOUSE SKINS, 30/30 UP — banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt opened and its ids read: roof_shingle_0-5, roof_gravel_6-7, wall_plain_8-11, wall_window_12-14, wall_boarded_15-17, wall_door_18-20, roof_stile_terracotta/desertbrown/graybrown_21-26, yard_27-29. THE CLOSEST NEAR-MISS in the whole index is wall_plain_8..11 and it is the wrong answer in the most instructive way: it is a stick-built stucco field, a THICK wall with mass, drawn to carry a shingle or tile roof. A trailer wall is 2 inches of studwall behind 0.024in aluminium — it has no mass, no reveal at its openings, and its whole character is a repeating rib the stucco field cannot fake. Using it is what the run does today and it IS the defect.
  - THE FROZEN STARTER TILESET, 42 tiles, CBB and md5-locked — banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt opened, ids read. `wall_base` is the runner-up near-miss and deserves naming because it occupies the exact slot a skirt would: the bottom course where a building meets the dirt. It fails for a structural reason, not a look reason. wall_base is a wall that continues to the ground and is SOLID all the way down. A skirt is a non-structural sheet hung in front of a VOID, it is legally required to be perforated (see G), and it is the one course on the whole building that is routinely MISSING — a kicked-in skirt changes the SILHOUETTE, which no repaint of wall_base can do. Also checked and rejected: `roof_deck`/`roof_parapet` (flat commercial roof, wrong for a bowed metal trailer roof with a raised centre seam), `wall_end_l`/`wall_end_r` (masonry corner logic, no hitch), `concrete_0`/`dirt` (the pad under it, correct and already approved — this form does not re-cook the ground).
  - SEAM-FIXED SURFACES — banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt opened. It is a wrap-seam re-pass over act-1 grounds/floors/walls/roofs/streets, not new material, and it carries nothing metallic at domestic scale.
  - PERIMETER WALL POOL — banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt: approved for the SUBURB BOUNDARY wall (WB4 "PERIMETER"), a freestanding site wall. Not a dwelling face.
  - THE TWO FORMS THAT ALREADY TOUCH THIS, and why this one still exists: records/tileforms/TF-RUN-006_mobile_home_skin.md is the RUN lane's request for this same material — this form is the ART lane's COOKABLE version of it, not a second ask, and the two must ship as one family or the graveyard gets a duplicate. TF-RUN-006's own spec is adopted whole where it rules (horizontal ribs, the stripe, the under-gap, the burned unit) and this form adds the pixel-level numbers, the code grounding, and the awning member it left out. records/tileforms/TF-ART-002_corrugated_metal.md is DELIBERATELY a different form: warehouse cladding is heavy vertical rib at building scale; this is thin horizontal lap rib at half the height with a skirt and a completely different decay story. Different silhouette = different form, rule 1.
  - Genuine hole. Nothing in the approved corpus is a domestic-scale ribbed metal wall.

## C. WHERE
- SURFACE + TAB: RUN (the walk) and CITY (human mode). At MAP zoom the family has no icon — it is the long thin light block, and the burned unit is the dark one in the row.
- DISTRICT FAMILIES: trailer (the home district). Also the site/office trailers that belong in industrial, boneyard, quarry and landfill yards, and the permanent vendor units at the swap meet.
- LAYER: structure — the home layer for five of the six members. ONE DECLARED EXCEPTION, stated here so the tilespec ingest does not have to guess: the awning/carport edge member ships on the overhead layer, because engine/bohemia_trailer.js already types carport code 6 as overhead and you walk and park UNDER it.
- SOLID? yes for the body, the end face and the burned shell; the skirt course is solid; the awning edge is no. ENTERABLE? yes — through the approved 2-cell door; INSIDE is the interior pool's small-residential recipe, and per INTERIOR-MATCHES-EXTERIOR the floor plate is exactly the footprint, which for a single-wide is genuinely long and thin. That is a feature, not a problem to clamp.
- MUST SIT BESIDE: itself along the long axis; its own stripe course above and skirt course below; the end face at both ends; lot dirt and the packed gravel pad at its base; the awning edge and its column; the tin shed; the propane tank at the corner; the next trailer in the staggered row.
- NEVER BESIDE: house stucco on the SAME building (that is the current defect); a hip roof cap of any kind; a terracotta or shingle roof; dead lawn (a trailer pad is dirt or gravel, never turf); a masonry corner tile; a residential window with a deep reveal — a trailer window is flush, it has no reveal to draw.
- EDGE CONTRACT: SELF-SEAMLESS horizontally for the side field, the stripe course and the skirt course — a trailer is any length and a park is rows of them, so the horizontal wrap is the load-bearing one. The vertical rib phase is DECLARED so ribs line up course to course. The end face, the hitch, the louvre vent insert, the awning edge and the burned shell are SINGLE PLACEMENT. Every seamless member gets the offset test (M10) before it ships: wrap step over internal step, and the wall-seam regression that measured 3.27 mean / 19.52 worst on the re-cook is the number this family must not repeat.

## D. WHEN
- ACT: 1
- BEST TIME: both, and the family is USUALLY SEEN DARK. Clustered power says 12% of the valley is lit and owned, and a trailer park is not somebody's territory — the pole light (code 9) is explicitly "head dark" in the district legend. What changes at night is only the roof: a shallow metal roof is the one surface here that still catches a low sky, so the row reads as pale roof-lines above black walls. No lit tile.
- WEATHER STATES: sunny is the baseline. Cloudy needs nothing — the ribs lose their shadow half and the whole family flattens, which is correct and free. RAIN: the metal body needs NO wet variant, thin aluminium sheds instantly. Three things DO change and they are what sells it — the dirt pad below darkens, the skirt band darkens where splashback hits the bottom third, and the void behind a missing skirt panel goes properly black. If M9 indexing lands, all three are a palette swap, not a tile.
- LIT/UNLIT: no lit variant. LIGHT=TERRITORY and nobody owns this.
- ANIMATION: static. A loose awning pan or a hanging skirt panel moving in wind is a real and tempting ask and it is NOT in this form — it would be a separate request under the leaf-pixel law, structure frozen, only the loose leaf moving.

## E. HOW
- EXACT SIZE: the 44 px corpus cell, 1x1 tiles per member. 1 px = 1.70 cm (CELL_M 0.75 / 44), which is the number every dimension below is derived from and the reason none of them are guesses. FOOTPRINT in the district: engine/bohemia_trailer.js draws the home as 8x16 cells = 6.0 m x 12.0 m. FLAGGED, NOT DECIDED: a real single-wide is 14 ft x 70 ft = 4.3 m x 21.3 m, a 1:5 box; the district's 8x16 is 1:2. The material does not care, but the district's aspect is a WORLD-lane plumbing question and it is named here rather than silently absorbed.
- VIEW: 45-degree world view — the three-quarter front face plus the sky-lit top of the shallow roof, with its raised centre seam visible as a bright line running the long axis. Ribs run HORIZONTALLY. That direction is load-bearing: TF-ART-002's warehouse rib is vertical, and rib direction is the fastest read a player has for telling a metal home from a metal shed.
- PALETTE: constitution ceiling, STRUCTURE value band (front 0.97 / away 0.56), drawn from the ONE master palette (M17) as a subset — no family-private ramp. Anchor the body on the district's own declared trailer colour #7a7266 and build 5-7 steps around it, hue-shifted cool into shadow and warm into light. M14 CHECK, stated as a number so it is not left to taste: the body must clear the lot dirt (#565040) by at least 18 points of mean luminance in greyscale, and a chalked cream body clears it easily — the risk here is the OPPOSITE, that a near-white trailer eats the whole scene's contrast budget. So the body's top step is held BELOW the district's hero highlight (M3, M13): the trailers are the mass, the door and the burned unit get the contrast. Three colourways share the geometry — chalked white, cream/beige, pale desert turquoise. Turquoise stays well under hue 255 (PURPLE RESERVATION; the district palette is already purple-free and this must not be what breaks it).
- LIGHT: the one global key from the upper LEFT. Every horizontal rib is a two-step pair — lit lip above, shadow under — and the pair order must not flip anywhere in the family or the wall argues with the key. NO black keyline. NO dither. The rib pattern is a REGULAR repeat and is declared to the dither check so it is not read as stipple.
- SHADOWS: none baked — separate-layer law. TWO expected footprints to design AROUND rather than draw: the awning throws a long shade across the pad and the trailer's flank, and the home stands on piers so there is a genuine dark strip along the ground behind the skirt. That under-gap is PART OF THE TILE'S OWN FORM, not a cast shadow, and it is the single strongest tell that this is a mobile home. Where the skirt is missing, that strip is the darkest value in the district.
- SCALE ANCHORS: the 2-cell door opening is the yardstick (2 cells = a 6ft8 door, so one cell of vertical face reads about 1 m). Off that: body wall 8 ft = 2.4 cells; skirt 20 in = 0.5 cell; eave-to-ground about 2.9 cells, so the STACK IS 3 CELLS against the suburb house's 4, and that one-cell difference is the district's silhouette. The car (2x3 tiles) parks under the awning; a 1.75 m human clears the skirt line by three times its height. THE PIXEL SIZES, all from 1 px = 1.70 cm — rib pitch 11 px (18.7 cm, a real 8-inch V-groove lap, and it divides 44 exactly four times so the vertical wrap is clean); panel butt joint every ~67 px (a 45in exposed panel), which means the joint must NOT land on the tile edge or the wall reads as a grid (M10); belt/decal stripe 12-18 px tall; a foundation louvre vent 12 px tall x 24 px wide; a skirt panel about 24 px wide; a fastener washer under 1 px.
- WEAR LEVEL: thirty Mojave summers, no maintenance, and this is the family that decays HARDEST because it has the least mass. Every mark must answer "what did this?" in one word (M1) — nothing scattered:
  - SUN, on the south and west faces only: the painted aluminium chalks to a dull powder and the body loses one full step of saturation. The decal stripe is the FIRST thing to go — it crazes and peels, so the stripe survives as broken segments with hard torn ends, never as a clean band.
  - WATER, at the fasteners: the siding is screwed through with washered screws about 3/4 in across, which at this scale is UNDER ONE PIXEL. So rust starts as a ONE-PIXEL bloom at the fastener and runs as a 1 px wide, 4-6 px long bleed streak straight down from it. Irregularly clustered along a run (M11), never evenly spaced, never a blotch. A 13-pixel rust patch is a 22 cm hole in a wall and would read as damage, not weathering.
  - CONTACT, at the skirt: skirting is kicked in, blown off or stolen, and a panel is ~24 px wide, over half a cell. MISSING SKIRT IS A SILHOUETTE EVENT, not a texture — draw it as an absent panel with the block pier and the black void behind it, not as a scuff.
  - IMPACT, at the roof edge: the drip rail is a 1-2 px lip and it is bent, so the roof line goes slightly irregular along its length. That irregularity is what stops a 16-cell trailer reading as a ruler.
  - FIRE, for the burned member: a pre-1976 mobile home is a total loss in ten minutes or less, and what survives is the steel chassis and the roof frame. The burned variant is a COLLAPSED shell over a still-straight frame — char going warm-black, the roof caved into the box, the skirt gone entirely, the chassis rails still dead level. Not a pile. The straightness of the frame under the collapse is the whole story.
- VARIANTS: six members (listed in A), three body colourways sharing identical geometry. STRUCTURE-NOT-COLOR: the colourways are legal and they are NEVER the headline — the six shapes are the work. Anything beyond these six (a double-wide, an Airstream, a park-model) is a different silhouette and needs its own form.

## F. THE CAPTION
```json
{
  "id": "TF-ART-013",
  "name": "mobile home siding",
  "layer": "structure",
  "solid": true,
  "enter": true,
  "district_families": [
    "trailer",
    "industrial",
    "boneyard",
    "quarry",
    "landfill",
    "swapmeet"
  ],
  "best_time": "both, and usually seen UNLIT - clustered power leaves a trailer park dark; only the shallow metal roof catches a low sky at night",
  "best_location": "staggered rows of lots along the park's internal streets, long axis facing the street, awning and shed to one side, propane at the corner",
  "place_next_to": [
    "mobile home siding",
    "trailer end face",
    "skirt course",
    "louvre vent insert",
    "awning edge",
    "tin shed",
    "lot dirt",
    "gravel ballast ground",
    "propane tank",
    "abandoned car"
  ],
  "never_next_to": [
    "house stucco on the same building",
    "hip roof cap",
    "terracotta roof",
    "shingle roof",
    "dead lawn",
    "masonry corner",
    "deep-reveal residential window"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS horizontally for the side field, stripe course and skirt course with a declared rib phase; SINGLE PLACEMENT for the end face, hitch, louvre vent insert, awning edge and burned shell",
  "anim": null,
  "tags": [
    "structure",
    "metal",
    "residential",
    "low-mass",
    "on-blocks",
    "horizontal-rib",
    "skirted",
    "burned-out-variant",
    "usually-dark",
    "overhead-member"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt, tiles wall_plain_8..11 and roof_shingle_0..5 — the 30 approved house skins, live in the run since 7/28. This family is their DELIBERATE OPPOSITE: same residential job, opposite construction, and it must be value-matched to them so the two districts belong to one world while being instantly separable at walk zoom. Second anchor for the bottom course and the seam discipline: banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (wall_base, wall_under_eave, wall_end_l/wall_end_r) — the CBB frozen target, whose measured wall-seam regression is the number this family is held against.
- NAMED OUTSIDE REFERENCE: **NORCO** (Geography of Robots / Raw Fury, 2022) — specifically how it draws industrial and domestic Louisiana structures as large FLAT VALUE BLOCKS with the silhouette and the light doing all the work, and almost no surface texture. Its refinery is a mass of grey pipe read entirely by value against a sky, not by drawn grain. That is exactly the correction this family needs, because a ribbed metal wall is the single easiest thing in the game to over-texture. Second, for the human half: **Kentucky Route Zero** for treating a working-class dwelling with weight rather than as a joke — Bohemia's rule is that a design decision carries a life lesson without preaching, and a trailer park drawn with contempt breaks that rule before a single pixel is judged. NOT taken from either: NORCO's palette, and KRZ's vector flatness.
- REAL-WORLD GROUNDING: The Boulder Highway corridor east of downtown Las Vegas — Valley Trailer Park at 5803 Boulder Hwy, Miracle Mile at 3642 Boulder Hwy, and the string of pads around Dodd St — is the real place this is, and it is where the valley's poorest have lived since the 1960s (Desert Paradise was closed outright by Clark County in 2022, residents ordered out and homes left behind, because the units were ruled unsafe; that is the exact condition Act 1 is thirty years past). WHAT THEY ARE MADE OF: a welded steel chassis with two long I-beam rails; a 14 ft x 70 ft single-wide body (980 sq ft, the most common length); painted aluminium lap siding, panels roughly 45 in exposed x 96 in long, screwed through with washered fasteners; a shallow bowed metal roof with a raised centre seam, recoated with fibered ALUMINIUM roof coating that goes silver then grey; a rooftop swamp cooler, near-universal in this valley and a signature silhouette; concrete-block piers with vinyl or thin metal skirting hung between them; steel strapping tie-downs against valley wind. THE SKIRT IS NOT DECORATION — 24 CFR 3285.505 requires ventilation openings of not less than one square foot per 150 square feet of floor area, on at least two opposite sides for cross-ventilation, placed as high as practicable, covered full height and width with a corrosion-resistant perforated covering to keep rodents out, plus an access opening at least 18 in x 24 in. For a 980 sq ft single-wide that is about 6.5 sq ft of net vent, roughly seven or eight 8x16in vents, so a louvre lands about every 9 ft — one every three to four cells, high in the skirt band, plus one wider access hatch per home. WHAT THIRTY YEARS OF MOJAVE SUN AND NO MAINTENANCE DOES: the coating on painted aluminium is broken down by UV until its binders release the pigment, so the siding CHALKS — a dull white powder that comes back the moment it is rubbed off, because the surface itself is failing rather than being dirty; the body loses saturation, not value. The decal stripe crazes and peels within a decade and survives only in torn segments. Rust does not eat the panel (aluminium does not rust) — it bleeds from the STEEL fasteners and from the steel window frames, in thin vertical streaks under each washer, and that is the only red in the whole family. Vinyl skirting is the fastest failure of all: prolonged UV and 45-degree summers make it fade, go brittle, crack, warp and pull out of its track, so panels are simply gone and the block piers and the dark crawl void are exposed. The aluminium roof coating chalks to grey and the low slope ponds at the centre seam. Awnings and carports here are aluminium W-pan (a waved pan that sheds sun and drains to an end gutter fascia) or flat pan, carried on 8-inch flat scroll columns; they sag, the pans lift at the fasteners, and they are usually the last thing standing on a lot. And fire: a pre-HUD-1976 mobile home is a total loss in ten minutes or less and burns at over 2.5 times the rate of a post-1976 manufactured home, which is why "some burned out" is not set dressing in this district — it is what actually happens to a street of these, and what is left standing is the chassis.

## H. DON'T WANT
- NOT a small house. If it has a hip roof, a masonry wall, a slab, or four wall courses, it has failed — those four wrongs are the entire defect this form exists to kill, and they are what the run draws today.
- NOT an Airstream. No polished silver curves, no rivets catching the sun. This is a matte rectangular box.
- NOT a comedy trailer. No cartoon squalor, no gag props, no lawn flamingo joke. Somebody lived here. See the KRZ note in G — a district drawn with contempt fails before the pixels are judged.
- NOT rust-belt rotted. Vegas CHALKS and CRAZES and goes brittle; it does not rot through and it does not grow moss. Aluminium does not rust at all — the only red in the family is fastener bleed. Getting this wrong is a climate error, and every climate error in this game reads instantly as somewhere else.
- NOT every rib drawn as an outlined stripe. This is the exact shape of Slynyrd's "avoid depicting every single brick... avoid emphasising the outlines" and of LAW 1 in laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md, whose measured consequence in this repo was a 73.6% orphan-pixel set that Paolo correctly called hallucinated AI slop. A rib is a two-step lit/shadow pair repeated, not a drawn line.
- NOT uniform banding. LAW 5: identical-width parallel bands make the eye read the seams instead of the surface, and a ribbed wall is the single most likely tile in the whole game to fail this. The rib pair widths vary along the run; the pattern is regular in PITCH, not in weight.
- NOT dithered, ever (LAW 6 / act-1 ban; stipple crawls under the phone's integer blit), and NOT anti-aliased on its outer silhouette (LAW 4 — this tile does not know what it will sit against).
- NOT a grid. A visible discontinuity every 44 px along a 16-cell trailer is the M10 failure and it already happened here once: the 7/28 re-cook made wall seams three times worse (3.27 mean, 19.52 worst) by snapping the wall field to a ramp. Panel joints and rib phase are placed to hide the tile edge, never to land on it.
- NOT loud. M13: this family is BACKGROUND. It is a whole district of it. A trailer wall cooked as lovingly as a door or a landmark makes the door stop being a door, and M8 says restraint reads as intent — when in doubt, fewer.
- NOT a picture of a vent. LAW 11b, the door-is-a-hole rule applied one size down: a louvre's individual slats are 1 in apart, which is 1.5 px, and drawing them would be pure noise. The vent is ONE darker rectangle with a single lighter top lip and a genuinely dark interior — an opening, not an illustration of one.
- NOT tall, and NOT scattered. Height is the tell (3 cells, not 4). And no wear mark goes anywhere it cannot answer "what did this?" — M1 and M11 together, motivated and clustered, never randomly sprinkled.

## I. ACCEPTANCE
- [ ] SILHOUETTE TEST: a trailer row and a suburb street side by side at walk zoom, instantly distinguishable — this is the pass/fail for the whole family
- [ ] Height verified at 3 cells (0.5 skirt + 2.5 body) against the suburb's 4; the stack override agreed with the RUN lane BEFORE cooking, not after
- [ ] Offset/wrap test (M10) on the three self-seamless members: wrap step within the internal neighbour step, no edge darkening (the desert-pool lesson), and better than the re-cook's 3.27 mean / 19.52 worst wall figure
- [ ] Rib phase declared and verified to line up across a 10-tile run; panel joints verified NOT to land on a tile edge
- [ ] Rib direction HORIZONTAL and visibly opposite to TF-ART-002's vertical warehouse rib
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1, pillow score, cluster density, one-key PAIRS, set-wide palette spread (M5)
- [ ] M14 value check: body clears lot dirt by >= 18 points of mean greyscale luminance; the whole family read in GREYSCALE via tools/bohemia_look_again.py before any colour judgement
- [ ] Palette from the ONE master subset (M17), value skeleton built FIRST and hue applied after (M18); PURPLE RESERVATION sweep on all three colourways
- [ ] Squint test at map zoom: the row reads as light bars with one dark burned bar in it
- [ ] 3x3 TILED PROOF SHEET for every seamless member, PLUS one whole-trailer proof end to end with skirt, stripe, hitch and awning assembled
- [ ] ON THE REAL SURFACE: screenshot of the trailer district wearing it, beside today's house-stucco render and beside an approved suburb house
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 22 | VERDICT: —
