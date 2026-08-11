# TILE FORM TF-ART-011 — THE FREEWAY (WIDE-LANE ASPHALT, BARRIER, GUARDRAIL, SHOULDER, DECK EDGE)

## A. IDENTITY
- NAME: Freeway surface family — the interstate cross-section (wide lanes, white paint at freeway pitch, concrete median barrier, W-beam guardrail, paved shoulder with rumble strip, overpass deck edge)
- FAMILY/SET: FREEWAY family — ONE cross-section, six members drawn as one coherent job: (1) travel lane asphalt at freeway pitch, (2) freeway paint (dashed lane line + solid edge line), (3) paved shoulder + milled rumble strip, (4) continuous F-shape concrete median barrier, (5) W-beam guardrail run, (6) overpass deck edge seen from underneath. They are one job because they are one 34-metre-wide slice of road and every one of them is measured off the same centreline.
- THE JOB, ONE SENTENCE: this family exists so that the 968 valley cells of interstate — 952 freeway plus the 16-cell Spaghetti Bowl block — stop borrowing residential-street material and finally read as a FREEWAY, which at our tile scale means one thing above all: everything is WIDER than the city.

## B. WHY
- DEMANDED BY: BOHEMIA_TILE_REQUESTS row 7 (ACT-1 TILESET REMAINDER, ART lane queue), against two registered and rendering modules that declare a full material legend and have no material to draw it with. engine/bohemia_freeway.js states it in its own header — "952 valley cells are freeway and every one of them rendered as a flat grey slab" — and its LEGEND names seventeen distinct act-1 materials (travel lane, white lane line, shoulder, median barrier, guardrail, embankment, sound wall, overpass deck, bridge column, sign gantry) that resolve today to seventeen flat PALETTE hex values and nothing else. engine/bohemia_interchange.js re-uses codes 0-15 deliberately "so the two read as one road" and adds ramp lane, ramp shoulder and gore marking on top. Both modules are correct, complete and gated; neither has a single authored pixel.
- WHAT LOOKS BROKEN TODAY: Paolo drives across the valley and the biggest man-made object in the city — the stack — is sixteen grey squares, and the two interstates running out of it are a flat slab with a lighter slab beside it. The freeway module's own comment already names the failure it fixed once at the geometry level ("the corridor rendered as a lattice of tan embankment squares instead of a road"); the geometry is fixed and the MATERIAL is still the flat fill. Worse, where anything reads at all it reads as a residential street, because the frozen starter tileset's road_* is the only road surface that exists — so an eight-lane interstate is currently made of the same material, at the same pitch, as the street in front of a house.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full, banks OPENED not filename-read (the RUN lane's 7/28 standing note).
  - banks/BOHEMIA_MARKING_BANK_7_17_26.txt — 84 items, 14 classes, "I like all of them", APPROVED-VOLUME. THE CLOSEST NEAR-MISS BY A MILE and it still fails on three counts. Opened: its own header declares `law_basis` "yellow = direction separation, twlt line classes only; white = lane-level (pockets, arrows)" and its class keys are surface-street vocabulary (`arrow_left_h`, turn pockets, stop bars, stall lines, crossings). A freeway has NO crosswalk, NO stop bar, NO stall, NO turn pocket, and by construction NO YELLOW ANYWHERE — the barrier separates the opposing directions, which is exactly why engine/bohemia_freeway.js can claim the LINE COLOR LAW is satisfied without painting a single yellow pixel. Second: it is PAINT, not SURFACE, the same hole TF-WORLD-001 named — except here the lane it would be painted on does not exist either. Third and fatal: freeway paint is a different PITCH, not a different picture. The dash cycle is 10 ft on / 30 ft off = 16.25 corpus cells; any per-tile marking authored for a city block puts a dash in every 44 px and lays four times too much paint on an interstate. USED FOR: its weathered white value and its dirt treatment, so freeway paint reads as the same paint as city paint, aged the same way. NOT USED FOR: any shape in this family.
  - banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (STREET BLOCKS, 5 researched lanes, REAL_VEGAS R2) — the roadway between kerbs. A freeway cross-section has no kerb, no gutter pan, no sidewalk and no parking lane; it is barrier, inside shoulder, four lanes, outside shoulder, guardrail. Every one of those five pool lanes is bounded by a thing this family does not contain. Does not cover.
  - banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (42 tiles, CBB, md5-locked in records/target/BOHEMIA_VISUAL_CONSTITUTION.json) — one residential street. road_0/1/2 is residential asphalt at residential pitch; road_centre is a YELLOW centre line, which is illegal on a freeway by construction; road_gutter presumes a kerb. And it is BYTE-FROZEN by a Paolo verdict, so it cannot be extended even if it fitted. It is the ANCHOR this family must sit beside, not the asset it can reuse.
  - banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt (26 entries, WB4 "PERIMETER") — CHECKED AND DELIBERATELY NOT ASKED FOR. The freeway legend's code 8 sound wall is a tall block wall and the approved perimeter pool plus TF-CITY-004 already cover a tall block wall with a cap. The sound wall is therefore EXCLUDED from this form on purpose; asking for it would be cooking a substitute for an indexed asset, which the shopping law calls a violation.
  - banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt + banks/BOHEMIA_DESERT_POOLS_7_18_26.txt — the code 6 embankment is a graded decomposed-granite slope and is desert-family; TF-RUN-001 owns it. EXCLUDED on purpose, same reason.
  - banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt (ZERO consumers, flagged in the index) — opened because a zero-consumer approved bank is exactly where a free win hides. It is the act-1 seam audit set for the surfaces we already had; there is no freeway-pitch lane, no barrier, no rail in it. Does not cover.
  - banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (the 1,927-UP HD pack list) — searched for road/highway/barrier classes. The HD corpus is house, interior, dungeon and off-genre; there is no Clark-County highway family in it. Does not cover.
  - SIBLING FORMS, checked so this one does not duplicate work already filed: records/tileforms/TF-CMB-001_low_cover_vaultable.md ALREADY OWNS the NDOT F-shape barrier as a PORTABLE COVER PROP — a loose 10 ft segment dragged into a barricade, layer prop, SINGLE PLACEMENT, vaultable. That is the same real object in a completely different role, and the correct answer is not a second design but a SHARED SILHOUETTE: this form's barrier re-uses CMB-001's profile and ramp exactly (M5 detail-match, M17 one master palette) and adds only what a continuous run needs — the 12 ft 6 in joint phase, the self-seamless run behaviour, and solid=true. records/tileforms/TF-WORLD-001_lot_asphalt.md owns LOT asphalt: flat, all-over crocodile-cracked, scale-anchored to a parking stall. Freeway asphalt is a different WEAR REGIME (two polished wheel paths and raveling at speed, not alligator cracking at rest) and a different PITCH. Right material, wrong wear — which is exactly the class of mistake this form exists to prevent.
  Nothing in the index claims a freeway-pitch driving surface, a continuous median barrier, a guardrail run, a rumble strip, or an overpass deck edge.

## C. WHERE
- SURFACE + TAB: RUN (the walk, and the drive) + CITY (human mode) + MAP. Name the tab plainly: this is what you see in the RUN tab when you are standing on the interstate, and in the CITY tab when you look at the corridor from above. At map zoom the corridor is the widest continuous line in the valley and it must hold that read as pure value, no icon.
- DISTRICT FAMILIES: freeway (952 cells), interchange (the 16-cell Spaghetti Bowl block at x50-53 / y19-22), and arterial ONLY at the overpass approach where a mile-grid street rides over the corridor and needs the deck edge on its own side of the crossing.
- LAYER: ground for the travel lane, shoulder, rumble strip and paint; structure for the median barrier and the guardrail (both solid, both blocking); overhead for the overpass deck edge you pass UNDER. The caption declares **ground**, which is what the family is mostly made of and what the tilespec ingest keys on; the barrier, guardrail and deck-edge members carry their own layer and solid flags in their per-tile dossier rows, exactly as the freeway module's LEGEND already declares them.
- SOLID? no for the lane, shoulder, rumble and paint; YES for the median barrier and the guardrail; no for the deck edge (that is the whole point of an overhead) — ENTERABLE? no. Nothing in this family is a portal. The way from the corridor up to the deck is the embankment and the ramp, and both belong to other forms.
- MUST SIT BESIDE: itself along the corridor axis, forever; the freeway's own inside shoulder and outside shoulder; the median barrier at the inside edge and the guardrail at the outside edge, which is what BOUNDS the lane field and stops it bleeding into the embankment; the graded embankment (TF-RUN-001 family) beyond the rail; the approved sound wall at the right-of-way line; dead cars and the jackknifed semi sitting IN the lanes (they are the act-1 dressing this surface exists to hold); the interchange's ramp lane and gore marking, which must meet the mainline without a step because bohemia_interchange.js deliberately shares codes 0-15 with the freeway; the rail ballast where the interstate bridges the UP mainline.
- NEVER BESIDE: never a kerb, gutter pan or sidewalk (a freeway has no pedestrian edge at grade; that is what makes it a freeway); never a crosswalk or a stop bar; never a yellow line of any kind; never a parking stall or a driveway apron; never a storefront or a building face at grade — the sound wall or the embankment is always between the corridor and any building; never a residential road tile butted straight onto a travel lane, because the pitch change would be visible as a lie in a single seam.
- EDGE CONTRACT: SELF-SEAMLESS along the corridor axis for the lane, shoulder and edge line — a freeway runs for miles and the tile must wrap against itself on the axis of travel with no wrap discontinuity beyond the material's own internal step (M10 offset test, hard fail on a bank cooked from a form). The dashed lane line, the barrier joint and the guardrail post are NOT self-seamless and must not be: each is authored as a declared-phase RUN — a 16-cell dash cycle, a 5-cell barrier joint, a 5-cell guardrail unit carrying two posts — so the rhythm belongs to the corridor and not to the 44 px grid. The overpass deck edge is SINGLE PLACEMENT (it happens once per crossing).

## D. WHEN
- ACT: 1
- BEST TIME: both, and this family is the canonical statement of LIGHT=TERRITORY. Nobody owns a freeway. Not one high-mast head on it is ever lit, so at night the corridor is the darkest and emptiest thing in the valley — a black trench between the lit places, with the barrier catching the last of the sky on its 14 px top face and nothing else visible at all. That contrast is the point: the freeway is how you feel how far apart the owned places are.
- WEATHER STATES: sunny baseline; cloudy needs nothing but a flatter key. RAIN is where this family earns its keep and it is NOT a uniform wet-down. A freeway is crowned and superelevated and sheds to the shoulder; thirty years unmaintained, every inlet and scupper is silted shut, so a dead freeway PONDS in exactly two places — a dark band hugging the barrier toe on the low side of the crown, and standing water in the gore where a ramp splits. Everything else drains and stays merely dark. The wet state is a value-shift colourway on the same geometry (M9: indexed, so wet is a palette not a tileset), with the ponded band as its own indexed region.
- LIT/UNLIT: no lit variant, and the absence is deliberate canon rather than an omission. NO reflector sparkle on the guardrail delineators, NO retroreflective flash on a sign panel, NO warm head on a high-mast pole. The constitution caps hot pixels at 2% of the frame and act-1 measured 0.01%; a freeway that twinkles is a freeway somebody maintains.
- ANIMATION: static. NAMED AND NOT BUILT: heat shimmer over the lane and grit drifting across the shoulder are the two effects this surface obviously wants, and per M16 both are palette cycles on a static shape rather than frame sets — which needs M9 indexing first and is a renderer job (RUN/CITY), not this form's.

## E. HOW
- EXACT SIZE: THE CORPUS CELL, 44 px, CELL_M 0.75 m, so 1 px = 1.70 cm and every number below is derived from that and nothing else. Footprints: lane / shoulder / rumble / paint are 1x1 ground tiles that tile infinitely on the corridor axis; the median barrier is a 1-cell-wide run standing 48 px tall (1.08 cells) with its joint every 5 cells; the guardrail is a 5-CELL REPEAT UNIT (220 px) carrying two posts; the overpass deck edge is a 1x3-cell band (its full visual depth from barrier top to girder soffit is 140 px = 3.2 cells).
- VIEW: 45-degree world view, always, and the barrier is the member where this law is won or lost. The F-shape is a batter, not a wall: you see its 14 px sky-lit TOP FACE as a band bowed toward the viewer, its upper slope receding, its 15 px lower kick catching a second, dimmer bounce off the pavement, and its base 36 px wide where it meets the road. The guardrail shows the top edge of the W-beam as a lit line and the corrugation as two lit / two shaded bands 5 px deep, never a flat strip. The lane, shoulder and paint are pure ground plane — sky-lit top, no side face. The deck edge is the one member drawn mostly as UNDERSIDE: from the corridor you look up at a soffit in shadow with a lit fascia edge above it.
- PALETTE: constitution ceiling (records/target/BOHEMIA_VISUAL_CONSTITUTION.json, 80,000, measured 46,082 — a cook may not raise it). GROUND value band for the lane, shoulder and paint: measured mean 103.7, lo 49.3, hi 152.2, and the lane field must sit in the LOWER half of it because it is the biggest ground surface in the world and it is background. STRUCTURE band for the barrier and guardrail: mean 96.0, lo 37.5, hi 167.6 — and per M14 the barrier's mean must clear the lane's by at least 18 points of luminance so the corridor still reads in greyscale, which is how it reads on a phone in the sun and how it reads at map zoom. 4-7 values per material, hue-shifted cool into the shadows and warm into the lights, drawn from ONE master palette per M17 and never a private ramp.
- LIGHT: the one global key, upper LEFT, everywhere, no argument. Cast shadows fall down and to the right. NO black keyline (constitution caps near-black edge pixels at 6%). NO dither anywhere (act 1 bans it, and stipple crawls under the 2x/3x integer blit on a phone).
- SHADOWS: none baked. The barrier's own shadow onto the lane, the guardrail's shadow onto the shoulder and the big one — the overpass deck's shadow across the whole corridor — are ALL the runtime shadow pass, because a baked shadow in a tiled world fights every neighbour it is laid beside. Expected footprint to leave room for: the barrier throws roughly 0.8 m down-right in the middle of the day (about 1 cell); the deck throws a hard 17 m band right across the lanes, which is a runtime feature and the single most dramatic thing in this family.
- SCALE ANCHORS — this is the section that decides whether the family reads as a freeway at all, and every number is checkable:
  * A 12 ft travel lane is 3.66 m = **4.9 cells = 215 px**. A car is 2x3 tiles = 1.5 m x 2.25 m = 88 x 132 px. So a car sits in a freeway lane with **1.45 cells of empty air on each side**. THE TEST: if the lane looks like it fits a car snugly, the tile has been drawn at surface-street pitch and it is wrong. Everything else in this form is downstream of that one read.
  * Outside shoulder 10 ft = 4.06 cells (179 px). Inside shoulder 4 ft = 1.63 cells (72 px).
  * A human is 1.75 m = 2.33 cells = 103 px. The barrier at 32 in = 48 px is **46% of standing height — hip high**, and the guardrail top at 31 in = 46 px is the same. A body walking the shoulder is TWICE the height of the thing beside it; if the barrier reads chest-high the profile is too tall.
  * A door opening is 2 cells = 1.5 m, so the barrier is just over HALF a door opening tall. Use it as the sanity check against the house corpus.
  * Vertical clearance under an overpass is 16 ft 6 in = 5.03 m = **6.7 cells = 295 px of daylight** between the lane and the soffit. That is a lot of air and it must feel like it, or the deck reads as a low tunnel.
  * Paint: a 4 in lane line is **6 px wide**; an 8 in edge line is **12 px**. Six pixels. That number alone kills most of the ways this can go wrong.
  * The dash: 10 ft stripe = 4 cells, 30 ft gap = 12.2 cells, cycle = **16.25 cells / 715 px**. A dash cycle is longer than a third of a district. It cannot live inside a tile.
  * Rumble strip: milled grooves 16 in across the shoulder = **24 px**, 7 in along travel = **10 px**, pitched 12 in = **18 px** centre to centre, so 10 px of groove and 8 px of land, about 2.4 grooves per cell. Depth 0.5 in = **0.75 px — sub-pixel**, so the rumble is a VALUE pattern and never geometry.
  * Barrier: 48 px tall, 36 px base, 14 px top, the F-shape lower kick breaking at 15 px above the pavement, precast segments 12 ft 6 in = **5.08 cells**, so a vertical joint shadow line every 5 cells and NEVER at the tile edge.
  * Guardrail: W-beam face 12.25 in = 18 px tall, corrugation 3.25 in = 5 px deep, posts at 6 ft 3 in = 2.54 cells. Rounded to the world grid as a 5-cell unit with two posts, that is 110 px spacing against a real 112 px — **1.6% off, and uniformity beats realism** (M11).
  * Deck edge: 8 in slab = 12 px, a 54 in girder = 80 px = 1.83 cells, barrier on top 48 px; total fascia band 140 px = 3.2 cells.
- WEAR LEVEL — thirty Mojave summers, zero maintenance, and every mark below can answer "what did this?" in one word (M1). Nothing scattered, nothing decorative:
  * SUN, on the lane. The bitumen oxidised out of black years ago; UV broke the cohesive bond and the surface RAVELLED, so the closed black skin is gone and what is left is an open field of exposed pale aggregate on a grey mastic. There is no freeze-thaw here, so the decay is even and all-over rather than edge-first — Vegas asphalt dies of sun, not ice.
  * TRAFFIC, on the lane, and this is the one mark that must be unmistakable. Two POLISHED WHEEL PATHS per lane, about 0.8 m wide (47 px) and 1.75 m apart (103 px = 2.3 cells), running dead straight down the corridor: smoother, slightly DARKER and quieter than the ravelled field either side of them. That single motivated contrast is what makes it a road somebody drove on rather than a grey rectangle.
  * SUN, on the paint. Thermoplastic does not vanish, it abrades and DARKENS as its surface texture goes and its beads are lost. And there is no snowplough in Nevada — the number one cause of marking loss everywhere else does not exist here — so the lines survive. What is left after thirty years is a chalky grey-white band you can still read, plus the best detail in this whole form: THE GHOST. Where a stripe has finally gone, the asphalt underneath it was shielded from UV for decades, so it is a stripe-shaped patch of LESS-OXIDISED, darker, smoother surface. A dead lane line is not an absence; it is a different colour of road in the exact shape of the line.
  * SUN AND THERMAL CYCLING, on the concrete. The barrier and the piers are chalky pale grey with fine map cracking from a 30-40 C daily swing. What is NOT here matters as much: Nevada has no de-icing salt and no marine air, so the chloride-driven rust-spall that eats bridges everywhere else is essentially absent. The concrete is INTACT. It is bleached, not broken.
  * GRIT, on the lower 60 cm of everything. Wind-blown quartz and caliche silt saltates and sandblasts the bottom two feet of the barrier, the piers and the rail posts on the windward side, leaving a scoured, lighter, slightly rounded base band about 35 px tall — and above it, on the sheltered face, a dust film that is DARKER, not lighter.
  * WIND, on the shoulder. Prevailing valley wind is from the south-southwest, and blown silt deposits against the first vertical thing it meets. So sand fingers drift across the shoulder and PILE on the windward face of the barrier and against the guardrail posts, and tumbleweed jams into the rail. Drift is placed by the wind and shaded by the key — it must never argue with the upper-left light.
  * CREVICE WATER, on the steel, and this is the one everybody gets wrong. Hot-dip galvanising to ASTM A123 puts down about 1,100 g/m2 of zinc, and in arid Nevada air, with almost no time-of-wetness, that coating is barely consumed in thirty years. A Nevada guardrail does NOT rust orange all over. It goes DULL MATTE GREY — zinc patina, chalky, light-eating. **It rusts at the fastener washers first**, because that is the one place water sits flattened between two surfaces where air cannot reach and the zinc gets attacked; then at the drilled bolt holes and cut ends where bare steel was exposed after galvanising. So: a 10-18 px rust bleed running down from each bolt head, and nothing else. The rail is intact.
  * IMPACT, on the rail. Posts bent and the beam folded where something left the road — canon already, straight out of the freeway module's own legend ("posts bent where something left the road"). Motivated, localised, never a general condition.
  * SIZE DISCIPLINE: at 1.70 cm per pixel, a 22 cm blotch is 13 px and reads as an enormous stain. Wear clusters live at 2-8 px, irregularly clumped, with the surface between them left EMPTY (M11). A rust bleed is 6-18 px. A spall exposing aggregate is 3-9 px.
- VARIANTS: lane field x3 (baseline ravel / heavy ravel / drift-covered), shoulder x2 (clean / drifted), rumble strip x1, edge line x1, dash run x1, barrier field + barrier joint x2, guardrail 5-cell unit + a damaged unit x2, deck edge + its pier-meet x2. Plus the rain-wet colourway across all of them, which is a palette and not a redraw. Colourways only beyond that — a recolour is never progress (STRUCTURE-NOT-COLOR), and any NEW silhouette in this corridor (ramp nose, gore nose, sign gantry, high-mast pole) is its own form.

## F. THE CAPTION
```json
{
  "id": "TF-ART-011",
  "name": "freeway surface",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": [
    "freeway",
    "interchange",
    "arterial (overpass approach only)"
  ],
  "best_time": "both",
  "best_location": "the interstate corridor and the interchange block - travel lanes, shoulders, the median line and the outside rail line, and under an overpass deck",
  "place_next_to": [
    "freeway travel lane",
    "white lane line",
    "solid edge line",
    "paved shoulder",
    "rumble strip",
    "concrete median barrier",
    "w-beam guardrail",
    "graded embankment",
    "sound wall",
    "dead car",
    "dead semi",
    "bridge column",
    "ramp lane",
    "gore marking",
    "rail ballast"
  ],
  "never_next_to": [
    "kerb and gutter",
    "sidewalk",
    "crosswalk",
    "stop bar",
    "yellow centre line",
    "parking stall marking",
    "driveway apron",
    "storefront",
    "residential road tile"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS along the corridor axis for lane, shoulder and edge line; the dashed lane line, barrier joint and guardrail post are declared-phase runs (16-cell dash cycle, 5-cell barrier joint, 5-cell guardrail unit); the overpass deck edge is SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "ground",
    "structure",
    "overhead",
    "pavement",
    "asphalt",
    "concrete",
    "steel",
    "freeway",
    "infrastructure",
    "background",
    "vehicular"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt — the frozen CBB road_0/1/2 and road_gutter, which are the nearest approved SURFACE in the corpus and the ground value band this family must sit inside (measured in records/target/BOHEMIA_VISUAL_CONSTITUTION.json: ground mean 103.7, lo 49.3, hi 152.2; structure mean 96.0). The delivered proof sheet puts a freeway lane directly beside road_0 so the PITCH difference is visible in one glance and not argued about. Second anchor for the paint only: banks/BOHEMIA_MARKING_BANK_7_17_26.txt, whose approved weathered white is the value freeway paint must match, so city paint and freeway paint read as the same paint aged the same way. Third, for the barrier silhouette: records/tileforms/TF-CMB-001_low_cover_vaultable.md, whose F-shape profile this family re-uses rather than re-designs.
- NAMED OUTSIDE REFERENCE: **Overland (Finji, 2019)** — specifically how it draws a dead American highway: the road is a nearly value-FLAT plane and the only high-contrast marks anywhere in the frame are the wrecks, the debris and the things that can hurt you. The surface is deliberately given up so that everything standing on it reads instantly. That is the exact relationship this family needs (M13 subordinate background, M3 contrast is a budget), on the same subject matter, and it is the single best argument against making a beautiful freeway. Second, for the WEAR VOCABULARY only, an artwork: **Ed Ruscha, "Thirtyfour Parking Lots in Los Angeles" (1967)** — sun-flattened aerial Southwestern pavement where the entire content of every plate is tyre scrub, oil drip, patch scars and paint stripes and literally nothing else. It is the definitive study of what marks a dead sun-baked pavement actually carries, and crucially of how FEW of them there are and how far apart they sit. Take the mark vocabulary, not the composition. Third, technique: Slynyrd's Pixelblog 20 top-down tiles for implying a road surface with three or four repeated clusters in a varied arrangement rather than drawing the aggregate.
- REAL-WORLD GROUNDING: I-15 and CC-215/I-11 through the Las Vegas valley, and the I-15/US-95 Spaghetti Bowl where they cross. Cross-section: four 12 ft travel lanes each way, 10 ft outside shoulder, 4 ft inside shoulder, an NDOT F-shape concrete median barrier 32 in high, 24 in at the base tapering to a 9-5/8 in top with the lower slope breaking at 10 in, cast in place or set as 12 ft 6 in precast segments (NDOT standard drawing RB-47). Outside the shoulder, hot-dip galvanised W-beam guardrail to ASTM A123 with about 1,100 g/m2 of zinc, rail top at 31 in, 12.25 in beam face with a 3.25 in corrugation, posts at 6 ft 3 in centres. The shoulder carries milled rumble strips at the FHWA/Pennsylvania Turnpike pattern — 7 in by 16 in, half an inch deep, 12 in centres. Paint is thermoplastic, white only: 4 in broken lane lines on the MUTCD 10 ft / 30 ft cycle and a solid edge line. There is no yellow anywhere on the cross-section, because opposing directions are separated by the barrier and never by paint. Surface streets do not meet it at grade; they ride over on a deck with 16 ft 6 in of clearance, carried on centre and shoulder piers. Behind the embankment is the block or concrete post-and-panel sound wall — and NDOT is replacing the I-11 walls right now because they date to the 1980s, so a thirty-year-unmaintained wall in Bohemia is precisely the age at which Nevada considers one life-expired. WHAT THIRTY YEARS OF MOJAVE SUN AND NO MAINTENANCE DOES, concretely: solar radiation breaks the cohesive bond between bitumen and aggregate, so the lanes oxidise from black to grey within a few years and then RAVEL, plucking aggregate loose until the wearing course is open pale chip on grey mastic — Vegas asphalt dies of UV, not of ice, so it fails evenly all over rather than from the edges in. Wheel paths polish darker and smoother than the ravelled field beside them. Thermoplastic abrades and DARKENS instead of disappearing and, with no snowplough in the state to scrape it, it survives as a legible chalky ghost — and where it finally goes it leaves a stripe-shaped patch of asphalt that never saw the sun and is therefore a different colour from the road around it. Concrete stays structurally intact because there is no de-icing salt and no marine chloride to drive rebar corrosion; it goes chalky, map-cracked from a 30-40 C daily swing, and sandblasted smooth on the lower two feet by wind-blown quartz and caliche silt. Galvanised steel behaves the opposite way to the apocalypse cliché: with almost no time-of-wetness the zinc is barely consumed in three decades, so the rail is dull matte grey and rusts FIRST at the fastener washers, where water sits flattened in the crevice with the air excluded, then at drilled holes and cut ends where bare steel was exposed after galvanising. And the valley moves: blowing silt saltates off the alluvial fans, deposits against the first vertical obstruction it meets, drifts fingers across the shoulder and piles on the windward face of the barrier — with tumbleweed jammed into the guardrail deep enough to bury a car, which is a documented Southwestern event and not an invention.

## H. DON'T WANT
- NOT a flat side-on scroller face (45 DEGREE ART LAW). The barrier is where this dies: a jersey barrier drawn as a side-on trapezoid strip is the single most common failure in tiled road art. It must show a 14 px sky-lit top face and a receding batter, not a silhouette.
- NOT city-pitch lanes. A lane a car fits snugly into is a surface street. The lane is 4.9 cells and the car is 2, and if that gap is not obvious the whole family has failed no matter how good the material is.
- NOT one yellow pixel. There is no yellow on a freeway cross-section; the barrier does the direction-separating job. LINE COLOR LAW, and engine/bohemia_freeway.js already states it as a construction fact.
- NOT a dash in every tile. The cycle is 16.25 cells. A per-cell dash is four times too much paint, reads as a solid line, and creates exactly the every-44-px grid tell M10 was written for.
- NOT crisp bright white paint. Act-1 paint is filthy — the freeway module's own decision note already ruled it ("act-1 paint is filthy, not clean white"). Chalky grey-white, plus the ghost.
- NOT a rusted-through orange guardrail. This is the anti-reference that research actually overturned: galvanised steel in arid Nevada survives thirty years. All-over rust is the generic apocalypse cliché AND it is factually wrong for the Mojave. Dull grey rail, rust at the washers.
- NOT crocodile cracking. That is a parking lot at rest (TF-WORLD-001's wear regime). At freeway speed and axle load the failure is raveling and rutting in two wheel paths. Right material, wrong wear is the mall-icon class of mistake.
- NOT spalled, rebar-exposed, crumbling concrete everywhere. No de-icing salt in Nevada means no chloride spall. Bleached and map-cracked, not broken. Damage only where something HIT it.
- NOT a rumble strip drawn as a solid black bar. It is 0.75 px deep. It is a value pattern of 24x10 px lozenges every 18 px, and a black bar is exactly the 22 cm blotch this form's whole scale section exists to prevent.
- NOT green. No living plants in act 1 — no weeds in the joints, no grass on the embankment, only dead brush and tumbleweed.
- NOT a noise field. LAW 8 and M2: this is the largest ground surface in the game (968 cells) and it must measure QUIETER than the barrier standing in it. Our own measured disaster is the ruler — concrete_0 was 99.6% orphan pixels, and 968 cells of that would make the entire valley read as mush.
- NOT evenly scattered wear. M1 and M11: every mark answers "what did this?" — sun, traffic, wind, grit, water, impact — and sits in irregular clumps with empty surface between. Deterministic random scatter is the thing that made the last re-cook look manufactured.
- NOT a baked cast shadow off the barrier, the rail or the deck. Separate-shadow law, and Slynyrd's own caveat that long baked shadows fight their neighbours in a tiled world.
- NOT a black keyline anywhere (constitution caps near-black edge pixels at 6%); edges are value steps.
- NOT dithered (act 1 bans it; stipple crawls under the 2x/3x integer blit on a phone).
- NOT a glowing reflector, lit delineator or warm high-mast head. Hot pixels are capped at 2% and measured at 0.01%. Nobody owns the freeway, so nothing on it is lit — LIGHT=TERRITORY.
- NOT cooked at hero detail. M13: this is background, and a freeway lane loved as much as a courthouse portico stops the courthouse being a courthouse.

## I. ACCEPTANCE
- [ ] Seam measured (M10 offset test) on the lane, shoulder and edge line: wrap delta
      within the material's own internal step, zero edge darkening (the desert-pool
      ruler). Hard fail, not reported — this bank is cooked from a form.
- [ ] PITCH PROOF: a 2-cell-wide car placed in a lane, showing 1.45 cells of air each
      side, rendered beside the frozen road_0 residential street for comparison.
- [ ] PHASE PROOFS over a 20-cell run: the dash cycle shows ONE dash per 16 cells (not
      20), the barrier shows FOUR joints (not 20), the guardrail shows EIGHT posts (not 20).
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1, pillow
      score, one-key pairs, cluster density, set-wide spread (gates/pixel_craft_gate.py)
- [ ] M2 FLOOR IS QUIET: the lane measures fewer clusters per 1000 px than the barrier
- [ ] M14 VALUE SEPARATION: >= 18 points of mean luminance between the lane (ground) and
      the barrier (structure); checked on the greyscale panel, not on the colour one
- [ ] Palette ceiling + ground/structure value bands + one-light checks green
- [ ] Squint test at map zoom: the corridor still reads as the widest continuous line in
      the valley on value alone, with no icon
- [ ] 3x3 TILED PROOF SHEET per member — never judged as a lone tile
- [ ] ON THE REAL SURFACE: rendered in engine/bohemia_freeway.js (a straight run AND an
      overpass cell) and in engine/bohemia_interchange.js (the mainline meeting a ramp
      across a cell boundary, proving codes 0-15 still read as one road), beside the
      approved anchor named in G
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: APPROVED by Paolo 8/11/26 (TILE BOARD sitting, UP; bank: banks/tileforms/TF-ART-011_CANDIDATES_8_8_26.json now carries the APPROVED law line; verdict: records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt). Volume unlocked, wiring open. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 20 | VERDICT: —
