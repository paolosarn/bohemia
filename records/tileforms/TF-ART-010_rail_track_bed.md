# TILE FORM TF-ART-010 - RAILROAD TRACK BED (BALLAST, TIES, RAIL, POINTS, CROSSING, BUFFER STOP)

## A. IDENTITY
- NAME: Railroad track bed. The crushed-rock bed with wooden ties and two steel rails on it, plus the four things a real yard cannot be drawn without: a set of points, a grade crossing where a street runs over the line, a buffer stop at the end of a stub, and the stretch where the rail was scrapped and only the ties are left.
- FAMILY/SET: RAIL TRACK BED family, one drawing job, six shapes: (1) plain running track as a 5-cell corridor, (2) the yard ballast plate between corridors, (3) points/turnout, (4) grade crossing, (5) buffer stop, (6) lifted-rail alignment (ties and prism, no steel).
- THE JOB, ONE SENTENCE: this family exists so the railyard reads as a railyard instead of a grey car park with brown stripes painted on it, because a railyard is the only district in the game whose floor IS the content and whose gate already asserts classification tracks, rolling stock, an engine shed and a container gantry standing on ground that currently has no art.

## B. WHY
- DEMANDED BY: gates/railyard_gate.js asserts a per-cell anatomy that cannot render (t[6] > 300 track cells, t[7] > 800 rolling stock, t[4] > 4000 ballast, plus loco, containers, engine shed, gantry) and engine/bohemia_railyard.js declares code 6 'a steel running rail on ties, the classification tracks fanned across the yard' and code 4 'the crushed-stone ballast and gravel of the yard'. Both are named in the district dossier and neither has a tile. Second demand: engine/bohemia_rail.js ships a 90-cell mainline gated by gates/rail_gate.js for continuity across all 12,288 tile rows, and every street that meets it needs a crossing that is not a pedestrian zebra.
- WHAT LOOKS BROKEN TODAY: the railyard's 4,000-plus ballast cells and 300-plus track cells all resolve to the frozen starter tile `dirt` or `yard_0`, so the yard floor and the desert outside the fence are the same brown square. The tracks do not read as tracks, the classification fan does not read as a fan, and the boxcars and the dead loco are standing on nothing. The whole district's story (a fan of parallel lines with rusted stock stranded on them) is carried entirely by the ground and the ground is blank.
- SHOPPING CHECK: records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md walked in full, and per the C3 board lesson the banks were OPENED, not guessed from the index row.
  - banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt, the 42-tile CBB frozen set, ids read off disk: road_0/1/2, road_centre, walk_0/1/2, walk_kerb, road_gutter, road_crossing, yard_0/1/2, concrete_0/1, dirt, wall_*, door_*, garage_*, roof_*. `yard_0/1/2` ("the dead gravel yard surface") is the CLOSEST THING IN THE CORPUS and it is the near-miss named in G. It is an isotropic 44px ground square with no running direction, no tie rhythm, no prism and nothing with height on it. A track bed is anisotropic by definition: it has an axis, and the axis is the whole point. `road_crossing` ("asphalt with the painted crossing bars on it") is a pedestrian zebra and is the wrong object for a grade crossing, which has no zebra bars at all.
  - banks/BOHEMIA_MARKING_BANK_7_17_26.txt, opened, all 14 classes listed: arrow_left_h/v, arrow_right_h/v, arrow_thru_h/v, pocket_line_h/v, twlt_arrow_h/v, twlt_h_B/T, twlt_v_L/R. Lane-level roadway markings only. No stop bar, no RXR legend, no crossbuck. Nothing rail.
  - banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt, opened, all 16 pools listed: cross, desert, lane_div, median, pocket_line_h/v, rock, scorch, side, stall_line_h/v, street, twlt_*. `cross` is a road intersection, not a level crossing. All asphalt roadway. Nothing rail.
  - banks/BOHEMIA_SEAM_FIXED_SURFACES_7_14_26.txt, the 605-tile zero-consumer pack, pack list counted by the RUN lane on 7/28 and re-checked here: dirt path, cracked concrete, grass and ground, metal floor, water, roof, burned ground, cobblestone floor, cracked street, soil and dirt, stone paths. No ballast, no track, no crossing.
  - banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt and banks/BOHEMIA_DESERT_POOLS_7_18_26.txt: desert, rock, scorch. Natural desert pavement and rock lag, not machine-crushed trucked aggregate, and the ground half of that bank is measured broken anyway (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md).
  - banks/BOHEMIA_MOUNTED_SIGNS_7_13_26.txt, opened: 10 mounted faces, all from HD pack "17. Hazard and warning tiles", 1x2 footprint. Generic hazard/warning. No crossbuck, no crossing gate, no signal mast.
  - banks/BOHEMIA_HD_TILE_REPO_part1.txt through part4 keyed against banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt (the 1,927 UP list): no rail family in the confirmed set.
  - CONCLUSION: nothing in the approved corpus claims a track bed, a ballast prism, a tie, a rail, a turnout, a grade crossing or a buffer stop. This is a genuine hole, not a wiring job.
  - FORM-LEVEL COLLISIONS, named up front so the ART lane does not draw this twice (this is the same class of thing as board notes C1 to C3): records/tileforms/TF-WORLD-006_permanent_way.md is the SAME ASSET filed by the WORLD lane for the mainline, and records/tileforms/TF-RUN-002_gravel_ballast_ground.md overlaps on the coarse ballast variant. MERGE BEFORE COOKING, one cook, three consumers. What THIS form carries that the other two do not: the measured 44px geometry (gauge, tie pitch, stone size, flangeway width, all in pixels), the tie-pitch-versus-cell arithmetic that decides the seam contract, the yard-versus-mainline ballast distinction, the grade crossing as a real crossing rather than a zebra, the buffer stop, and the wiring note against engine/bohemia_railyard.js. What TF-WORLD-006 carries that this does not: the 90-cell mainline continuity requirement across the freeway crossing. Keep both clauses in whichever form survives.

## C. WHERE
- SURFACE + TAB: RUN (the walk: you cross the line, you walk between two strings of boxcars) and CITY (human mode ground plane) and MAP (the line is a Lynch edge across the whole valley and must read at map zoom as ONE continuous line).
- DISTRICT FAMILIES: railyard (the whole floor), rail (the mainline), industrial and warehouse spurs, freeway (the rail-under-bridge condition), town (the water-stop origin), plus a grade crossing at every cell where a street meets the line in ANY district.
- LAYER: ground
- SOLID? no, you walk and drive across it, and the rail head is a step-over not a wall. ENTERABLE? no
- HEIGHT NOTE (not the LAYER field): the buffer stop is the one piece of this family with a body above the bed. Its steel post ships as a SINGLE PLACEMENT piece drawn on top of the ground plate; if the engine wants that cell to block, it flags the cell solid, the art does not change layer. Signals, crossbucks and crossing gates are NOT in this form and are NOT IN A TAB YET.
- MUST SIT BESIDE: itself endlessly along the running axis; the yard ballast plate between corridors; gravel ground (TF-RUN-002); chain-link right-of-way fence (TF-RUN-003 / TF-ART-004, themselves a merge); the concrete apron at the engine shed door; CMU block wall (TF-ART-001) on the shed; lot asphalt ONLY through the grade crossing piece; desert ground at the prism toe.
- NEVER BESIDE: lot asphalt or any street tile meeting the rail with no crossing piece between them (a road that just stops at a rail is the single loudest tell of a fake railway); kerb or sidewalk running across the track; road lane markings on the bed; terracotta roof or any residential tile; interior floors; anything green.
- EDGE CONTRACT: SELF-SEAMLESS along the running axis, on a DECLARED 2-CELL TIE PHASE (see E: the tie pitch is 3 ties per 2 cells, so the repeat period is 88px, not 44px, and the engine must lay the corridor with an even/odd phase or the tie rhythm breaks at every cell boundary). Across the axis the corridor is a fixed 5-slice stack, not a tiling. The turnout, the grade crossing and the buffer stop are SINGLE PLACEMENT. Every touching edge will be MEASURED per M10's offset test (wrap step divided by the tile's own internal step, target 1.0) against the roughly 9-value normal neighbour step established by the 7/28 seam finding.

## D. WHEN
- ACT: 1
- BEST TIME: both. Nothing here is self-lit. At night the bed goes to the ambient pass like any ground, with ONE exception worth the pixels: the rail crown is the only polished-then-rusted surface in the family and under a lamp it is the one line that still catches light, so a lit railyard cell reads as two faint parallel threads in the dark. Unlit that thread is absent, which is correct: nobody patrols the dark.
- WEATHER STATES: sunny baseline. Cloudy needs nothing. RAIN matters more here than on any other ground in the game and it is three separate effects, not one: (1) crushed granite ballast goes markedly darker and more saturated when wet, more than gravel does, because the stones are fresh-fractured and non-absorbent so the water sits on the faces; (2) the ties go near-black, and the sun-silvered top face darkens MORE than the shaded sides do, which briefly inverts the tie's two-value read; (3) the flangeway slots at a grade crossing FILL AND HOLD WATER, which makes a crossing one of the only places in act 1 with standing water in it. Per M9 all three are palette states, not new geometry.
- LIT/UNLIT: no separate lit tile is drawn. LIGHT=TERRITORY: the railyard's pole lights (engine code 9) belong to whoever owns the yard, and the bed is a receiver only. The rail-crown thread described above is a palette state of the same tile.
- ANIMATION: static. Act 1 is dead, nothing runs, the points are frozen where they were left. The one candidate loop in this family is dust or tumbleweed drifting along the bed, and per M16 that is a palette cycle on an indexed tile, not a frame set, and it is not built until indexing (M9) lands. [PENDING, Paolo's call: whether a dead line gets any motion at all.]

## E. HOW
- EXACT SIZE: THE CORPUS CELL, 44px, CELL_M 0.75, so 1px = 1.70cm. That number is what makes the rest of this section real rather than adjectives, and every dimension below is measured from AREMA practice and then converted:
  - GAUGE: standard gauge is 1.435m = 84px = 1.91 cells. UNIFORMITY BEATS REALISM (craft law 11): snap it to exactly 2 cells (88px, 1.50m, 4 percent over standard, invisible) so each rail sits on a CELL CENTRE instead of straddling a boundary.
  - THE CORRIDOR IS 5 CELLS ACROSS, in a fixed order: shoulder / rail-left / four-foot / rail-right / shoulder. A tie is 7in x 9in x 8ft 6in, so 152px long (3.45 cells) and 13px wide, which puts the tie ends 0.77 cells past each rail and lands them inside the shoulder cells. That is why the corridor is 5 and not 3.
  - TIE PITCH: real timber main-line spacing is 19.5in on centre = 495mm = 29px. 44 does not divide by 29, which would band the corridor at every cell edge. THE CALL: 3 ties per 2 cells, pitch 29.33px, laid at 0, 29, 59 inside an 88px period. That is 19.7in, real to within half a percent, AND it tiles. Declare the phase; the 1px jitter between the 29 and 30 gaps is not an error, it is M11 working for us.
  - RAIL: 136RE is 185.7mm tall, head about 74mm wide, base 152mm. So the rail head is a 4px line, the base flare is 9px, and the rail carries 11px of TRUE HEIGHT. That 11px is the only real height any ground-layer tile in this game gets and it is the entire difference between a railway and a painted stripe. Draw it: a 4px crown, a 2 to 3px shaded web on the down-light side, a 1px base flare.
  - TIE PLATE: about 14in x 8in under each rail = 21px x 12px. Big enough to read as a darker rectangle on the tie top. This is where the rust bleeds from, so it is where the family spends its only saturated colour.
  - SPIKES: 5/8in = 1px. DO NOT DRAW. A 1px lone speck is the orphan-pixel defect (craft law 1) and our own measured 99.6% orphan `concrete_0` disaster.
  - BALLAST STONE: AREMA #4 is 1.5 to 2.5in angular = 2 to 4px. So ballast is a 2-to-4px CLUSTER texture, never single pixels and never countable boulders.
  - PRISM: 12in ballast under the tie, 12in shoulder past the tie end, 2:1 side slope. Mainline single track reads about 4 cells across the top and 5 toe to toe, with a 1-cell sloped shoulder each side.
  - YARD VERSUS MAINLINE, and this is the read that makes a yard a yard: in a YARD the tracks share ONE CONTINUOUS BALLAST PLATE. There are no individual prisms and no shoulders between tracks. Classification track centres are 13 to 14ft, so about 6 cells; engine/bohemia_railyard.js lays its code-6 lines 7 rows apart, which at 7 cells is 5.25m and works. WIRING NOTE for the WORLD/RUN lane, not an art job: code 6 is currently ONE row wide and cannot carry a 5-cell corridor. Widening code 6 to a 5-row band on the existing 7-row pitch leaves 2 rows of plain ballast between corridors, which is exactly the walking gap the OCCUPANCY LAW needs to let a body move between two strings of boxcars.
  - GRADE CROSSING: crossing panels come in 8ft 1.5in, 9ft and 10ft lengths, so 3 cells along the road, and the panel joints run PARALLEL TO THE RAILS. The flangeway is 2.5in minimum wide and 1.5 to 3in deep, which is a 3 to 4px DARK SLOT on the gauge side of each rail. That slot is the single detail that makes a crossing read as a crossing, and it is also the thing a zebra crosswalk can never have.
  - BUFFER STOP: AAR coupler height is 31.5 to 34.5in, so the striking face sits at about 0.85m, which on a 1.75m body is between the knee and the waist. It is a low, wide, heavy thing bolted across both rails, not a tall gate.
- VIEW: 45-degree world view. The bed is a ground plane with sky-lit top, but the RAIL and the PRISM SHOULDER are the two places this family actually has a third dimension and both must be built as such: the prism shoulder is a bowed slope, not a drawn line, and the rail is a section with a lit crown and a shaded web. 45 DEGREE ART LAW: bands bow toward the viewer, no flat side-on scroller face, ever.
- PALETTE: the constitution ceiling and the GROUND value band, drawn as a SUBSET of the one Bohemia master palette (M17), not its own invented ramp. Six or seven steps for the whole family. VALUE FIRST (M18): the value skeleton is decided in grey before any hue, and it is this, dark to light: ties (darkest, the shaded sides) / ballast field / ballast lit shoulder / rail crown (lightest, and it is the ONLY high value in the family). M14: the ballast must sit at least 18 luminance points off the pale limestone yard gravel it abuts, or the prism vanishes into the yard floor.
- LIGHT: the one global direction, upper LEFT. NO keyline. NO dither. The bed gets a free gift here: a wheel-polished rail crown loses its mill scale and rusts a LIGHTER orange-tan than the web and base, which keep the darker scale under their rust, so the rail is genuinely lighter on top than on the sides and the physics already agrees with the key.
- SHADOWS: none baked, per the separate-shadow law. Expected runtime footprint: the rail throws a hairline shadow to its down-light side onto the tie; a boxcar standing on the corridor throws a full body shadow across the bed; the buffer stop throws a short one. None of that is asset pixels.
- SCALE ANCHORS: gauge 1.435m snapped to 2 cells; tie 2.59m long (3.45 cells); human 1.75m, so a standing body is a little taller than the corridor is wide from rail to rail; a car is 2x3 tiles, so a car crossing the line covers the whole corridor in one move; a door opening is 2 cells, and the engine shed door beside the bed is the nearest fixed reference.
- WEAR LEVEL: thirty summers, no maintenance, and the honest answer is that a desert track bed does NOT rot, it FILLS AND SINKS. Concretely, and every mark answers M1's "what did this":
  - SUN did the ties. The top 2 to 3mm of creosote photo-oxidises and volatilises, so the tie TOP goes silver-grey and checked while the shaded SIDES stay dark brown-black. A tie is TWO VALUES, never one brown bar. In July, rail-level surface temperatures put residual creosote back to the surface as glossy black seeps in the checks. At 13px wide a tie shows exactly ONE long grain split, plus end checks. Not a texture.
  - SUN did NOT do the rail. Mojave mean humidity sits well under the roughly 60 percent critical RH for atmospheric corrosion; dry rural steel loses under about 1.3 microns a year against 200-plus in a marine atmosphere. Thirty years is well under a millimetre. So the rail is a SOLID BAR wearing an even matte orange-brown film, not a flaking ruin, and the crown has lost its polish and is now the same matte as everything else.
  - CONTACT did the tie plates. Rust bleeds out from under the plate onto the tie top as an orange halo and streaks down-grain from each spike head. That halo is the only saturated colour in the family and it is where the whole colour budget goes.
  - WIND did the ballast. Blown sand and silt fill the cribs between the ties from the prevailing side; the windward shoulder stays sharp and the lee side goes smooth and buried, and after thirty years the cribs sit level with the tie tops and the crisp 2:1 shoulders have slumped to a soft rounded toe. Fouled ballast is the single most correct thing this family can show.
  - WATER did the vegetation, so there is almost none. The prism sheds to the toe, which is the only place anything grows, and in act 1 it is all DEAD: dead creosote bush at the toe, and dead Russian thistle. Tumbleweed reached the West on railroad cars in the first place and it piles against fences and rights-of-way, so a 3 to 4ft drift of pale straw-grey dead thistle jammed against the windward side of the yard fence and against the buffer stop is the most Nevada-railroad object available and it costs almost nothing to draw. Straw and grey, never green.
  - TRAFFIC did the crossing. The asphalt fails at the panel joint first, because that is where the pavement is thinnest and the panel edge concentrates the wheel load, so a crossing reads as intact concrete panels sitting in a ring of alligator-cracked sunken asphalt. The panels themselves are basically fine.
- VARIANTS: six shapes. (1) plain running corridor, self-seamless, 2-cell tie phase. (2) yard ballast plate, self-seamless, the continuous bed between corridors, distinctly darker and coarser than TF-RUN-002's pale limestone yard gravel. (3) points/turnout, single placement: a real No.8 turnout is about 25m, which is 33 cells, so it is DELIBERATELY COMPRESSED to a 5x3 cell piece carrying the only four things that say "points" (the tapered switch blade lying against the stock rail, the two rails diverging, the dark manganese frog casting, the switch stand). The compression is named, not hidden. (4) grade crossing, single placement, 5 cells across the corridor by 3 cells along the road, with the flangeway slots, the panel joints parallel to the rails, and the road humping up to top of rail. (5) buffer stop, single placement, 2 cells. (6) lifted-rail alignment, self-seamless: ties and prism intact, steel gone. Beyond these six it is colourways only (wet, night, act shift), which are palettes per M9 and are never progress per STRUCTURE-NOT-COLOR. [PENDING, Paolo's call: a seventh shape, a sun-kinked buckled rail section. Real (unmaintained CWR buckles in Mojave heat) and it would be the most striking single tile in the family, but it is a new silhouette and I am not adding one he did not ask for.]

## F. THE CAPTION
```json
{
  "id": "TF-ART-010",
  "name": "railroad track bed",
  "layer": "ground",
  "solid": false,
  "enter": false,
  "district_families": [
    "railyard",
    "rail",
    "industrial",
    "warehouse",
    "freeway",
    "town"
  ],
  "best_time": "both",
  "best_location": "the classification fan and ballast plate of the railyard, the mainline alignment across the valley, every industrial spur, and every cell where a street crosses the line",
  "place_next_to": [
    "railroad track bed",
    "yard ballast plate",
    "gravel / ballast ground",
    "chain-link fence",
    "concrete apron",
    "cmu block wall",
    "desert ground",
    "rolling stock",
    "locomotive"
  ],
  "never_next_to": [
    "lot asphalt with no grade crossing piece",
    "kerb or sidewalk crossing the track",
    "road lane markings on the bed",
    "terracotta roof",
    "interior floors",
    "green plants"
  ],
  "weather_ok": [
    "sunny",
    "cloudy",
    "rain"
  ],
  "acts": [
    1
  ],
  "edge_contract": "SELF-SEAMLESS along the running axis on a declared 2-cell tie phase (88px period, 3 ties per 2 cells), fixed 5-slice stack across the axis; turnout, grade crossing and buffer stop are SINGLE PLACEMENT",
  "anim": null,
  "tags": [
    "ground",
    "rail",
    "ballast",
    "track-bed",
    "railyard",
    "grade-crossing",
    "turnout",
    "buffer-stop",
    "lynch-edge",
    "origin-of-the-city",
    "receives-light"
  ]
}
```

## G. REFERENCES
- APPROVED ANCHOR: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt `yard_0/1/2` ("the dead gravel yard surface"), the nearest approved thing in the corpus and the tile the railyard currently wears. The new bed must sit DARKER and COARSER than it (trucked granite against local limestone) while staying inside the same GROUND value band, and the two will be seen touching constantly at the fence line, so they are judged side by side. Secondary anchors from the same frozen set: `dirt` and `concrete_0` for where the bed sits in the ground value order, and `road_crossing` as the thing the grade crossing must NOT be mistaken for. Value band and one-light pairs come from banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt.
- NAMED OUTSIDE REFERENCE: **Factorio** (Wube Software), specifically its rail tile, for one thing only: it spends essentially ALL of its contrast on the two rail crowns and keeps the ballast prism almost flat, which is why a Factorio rail line still reads as a LINE at full zoom-out while staying quiet under a screen full of machinery. That is exactly M3 and M13 solved in the same object, and it is the read this family needs, since the railyard's heroes are the boxcars, the dead loco, the engine shed and the gantry, not the floor they stand on. Take also how its gravel meets terrain on a soft irregular boundary instead of a drawn edge. Do NOT take its saturation, its greenery or its two-step isometric diagonal (we are axis-aligned oblique). Second, as artwork rather than game: **Richard Misrach, "Desert Cantos"**, the Nevada and Mojave plates, for the colour truth this family keeps getting wrong: under that sun the ground is bleached tan-grey with the colour cooked out of it, man-made lines are the only geometry in the frame, and nothing is brown.
- REAL-WORLD GROUNDING: Las Vegas exists BECAUSE of this tile. The town was founded in 1905 as a water stop where the San Pedro, Los Angeles and Salt Lake line met the springs, and the crossing of the Mojave was only possible because Union Pacific and Clark's outfit laid creosote-treated crossties from 1902, since creosoted timber does not dry out and fail in desert air the way untreated wood does. The named real locations to work from (M15 says grounding is a looking job, not a writing job) are UNION PACIFIC'S ARDEN YARD, 6180 Oleta Ave, Enterprise NV, which is where the old downtown railyard moved to and is the live classification yard this district is modelled on, and the abandoned BLUE DIAMOND BRANCH running west from Arden to the gypsum plant, lifted in the 1980s when the plant went to trucks, which is the lifted-rail variant standing in the real desert right now. Third reference for the same variant: the Las Vegas and Tonopah and the Tonopah and Tidewater, whose rails were pulled in 1942 and 1943 for the war and whose ROADBED IS STILL THERE AND STILL TRACEABLE eighty years later, ties, prism and all. Construction: standard gauge on 1.5 to 2.5in angular crushed granite ballast at least 12in deep under the tie, 7x9x8ft-6in creosoted timber ties at 19.5in centres, tie plates and cut spikes, a maintenance road down one side and a chain-link right-of-way fence outside that. What thirty Mojave summers with nobody maintaining it actually does, specifically: the ties bleach silver-grey and check on their TOP faces while their shaded sides stay creosote-black, and in July heat the residual creosote seeps back out glossy into those checks; the rail does NOT rot away, because Mojave humidity sits below the roughly 60 percent threshold where atmospheric corrosion gets going, so at under about 1.3 microns a year the steel loses well under a millimetre in thirty years and stays a solid bar under a matte orange-brown film, with the crown lighter than the web because it lost its mill scale to wheels decades ago; rust bleeds outward from under the tie plates onto the tie tops as orange haloes and streaks down-grain from the spikes; wind-blown sand and silt foul the ballast until the cribs are level with the tie tops and the crisp 2:1 shoulders slump into a rounded toe, so the track SINKS INTO ITS OWN BED rather than eroding; and the only vegetation is at the prism toe where the bed sheds its water, plus dead Russian thistle drifted against the fence and the buffer stop, which is fitting because Russian thistle spread across the American West on railroad cars in the first place.

## H. DON'T WANT
- NOT road vocabulary. No lane lines, no kerb, no median, no intersection treatment on the bed. This is the recorded 7/27 error and TF-WORLD-006 exists partly to stop it recurring.
- NOT a flat side-on scroller face and NOT a flat painted stripe. Without the prism slope and the rail's 11px of real height this is a grey band with brown ticks on it. 45 DEGREE ART LAW.
- NOT the OpenTTD / Transport Tycoon top-down ladder: a symmetrical row of identical brown bars at identical pitch on a flat grey strip. Identical pitch at identical value is BANDING (craft law 5), and a 44px repeat with a hard tie at each edge is the exact "heavy borders outline the tile" failure M10 names, which is our own black-grid history twice over.
- NOT every tie drawn as an outlined box. Slynyrd's rule is "avoid depicting every single brick" and "avoid emphasizing the outlines" (craft law 8); a tie is a two-value block with one split, not a bordered rectangle.
- NOT single-pixel ballast noise. Ballast stones measure 2 to 4px, so ballast is CLUSTERS. A field of lone specks is the definition of noise (craft law 1) and it is precisely the 99.6% orphan `concrete_0` failure that got the whole set re-cooked.
- NOT shiny silver rail heads and NO specular highlight. Nothing has run in thirty years, and M19's lesson is explicit: withholding the bright highlight is what makes a surface read dead. A gleaming rail makes the whole world look maintained.
- NOT brown. Trucked mainline ballast is dark angular granite, local yard gravel is pale limestone, ties are silver-grey on top and near-black on the sides. Brown ballast reads as mud and mud is the one thing the Mojave does not have.
- NOT green, NOT overgrown. Weeds live at the prism toe only, and in act 1 they are dead. Grass in the four-foot contradicts why ballast exists.
- NOT a rotted flaking rail. The research says the opposite: dry-climate steel barely corrodes. Drawing a Rust Belt railway in the Mojave is the generic-decay mistake this form was written to prevent.
- NOT a zebra crossing. A grade crossing has no bars painted across it. If it does not have the 3 to 4px dark flangeway slot beside each rail it is not a crossing, it is `road_crossing` with a mistake on it.
- NOT the mall-icon mistake at the turnout: a set of points is not an X or a Y symbol, it is four specific pieces of ironwork (blade, stock rail, frog, stand) and if it cannot be NAMED it does not get drawn (NAME-IT-OR-DON'T-DRAW-IT).
- NOT the desert-pool failure. No edge darkening of any kind. A visible grid is the kill condition (records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md), and the wall re-cook already proved a family can get THREE TIMES WORSE at the seam while every other number improves (M10).
- NOT louder than what stands on it. The bed is background (M13): the boxcars, the dead loco, the containers and the gantry are the heroes. Ground must measure quieter than structure (M2), which the current banks fail by 1.7x in the wrong direction.
- NOT a black keyline anywhere, NOT dither (act-1 law), NOT a model-railroad cork roadbed trapezoid with a hard clean edge line.

## I. ACCEPTANCE
- [ ] Offset/wrap seam measured on the self-seamless members (running corridor, yard plate, lifted alignment): wrap step over internal step near 1.0, no edge darkening, and the tie phase verified across an 88px period so the rhythm does not break at cell boundaries
- [ ] 20-cell continuity proof: the corridor reads as ONE line over at least 20 consecutive cells with no visible repeat motif, and the same over a freeway-crossing cell so the gated rail continuity is not severed
- [ ] Geometry verified against the numbers in E at 44px: gauge 2 cells, tie 13px x 152px, rail crown 4px, rail height 11px, ballast clusters 2 to 4px, flangeway slot 3 to 4px
- [ ] Pixel craft gate green: orphan share, single-use colours, block size 1, pillow score, cluster density, set-wide palette spread (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md)
- [ ] M2 floor-is-quiet: this ground measures QUIETER than the structure families it sits under, hard fail (laws/BOHEMIA_PIXEL_MASTERY_LAWS_7_28_26.md)
- [ ] M14 value separation: at least 18 luminance points between the ballast and the yard gravel it abuts, and between the bed and the rolling stock standing on it, checked in GREYSCALE first
- [ ] Palette ceiling, GROUND value band, one-light pair checks green, no keyline, no dither
- [ ] Squint test at map zoom: the alignment reads as one continuous line across the valley
- [ ] 3x3 TILED PROOF SHEET rendered, plus an assembled 5-cell corridor, an assembled turnout, an assembled grade crossing and an assembled buffer stop, never judged as lone tiles
- [ ] ON THE REAL SURFACE: a railyard cell wearing the classification fan with boxcars on it, beside the current all-`dirt` render for contrast, and beside the approved anchor `yard_0`
- [ ] Caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: APPROVED 8/11/26 AND WIRED 8/11/26: the railyard's classification fan draws the yard corridors (5-slice, phase A/B per the bank's 88px contract) and the ballast bed draws the plates, live in the RUN tab. Turnout/crossing/buffer and the mainline corridor are the remaining volume. | REQUESTED BY: ART lane (own queue, breaking down board row 7)
  | DATE: 7/29/26 | PRIORITY: HIGH
- BOARD ROW #: 19 | VERDICT: none yet
