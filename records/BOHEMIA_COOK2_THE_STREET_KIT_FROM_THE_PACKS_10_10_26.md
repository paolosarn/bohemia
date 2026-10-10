# COOK TWO round one: [the street kit from the packs] (rule 87, 82a, 77; Paolo 10/10)
- 16 house-tile pieces (515x364, 12 m, depth x cos45) in slices/fight_ground/kit_street/: road E-W / N-S, with one walk, both walks, junction, two zebra crossings, four inside corners, plain walk.
- Every pixel is stamped from banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (street asphalt, side sidewalk) at 2x nearest; paint colour = the zebra pool tile's brightest tenth, kerb = the sidewalk's brightest tenth. Each piece keys its (pool, index) list in kit_street.json.
- Rule 77: four typed edges in metres per piece (road/walk), centre lines in metres. Walk 1.5 m = an eighth of the 12 m road.
- Proof: kit_street/before_after.webp (the current block_main_1 street beside a 4x3 sample board).
- NOT DONE: DIRECTION's pass against the pack contact sheet (rule 87, before VOTE); COMBAT TWO laying boards from it; no gate yet that every kit seam matches (the legos gate reads blocks, not the kit). Row stays CLAIMED.
- Known look debt: the asphalt stamp repeats at 2 m, visible at full zoom; next round: larger stamp grid with rotation, oil stains and the marking bank's worn arrows.
- Analog horror: cracked pool asphalt, paint washed to 60-70%, weeds in the walk; nothing new.
- [bb street tiles] BB builds battle ground from edge-matched stamps, never one painted plate; so does this.

## Round two
- The 2 m repeat killed: stamps run in brick rows (half offset) and each is flipped one of four ways. Asphalt and slab have no up.
- Two arrow pieces (road_ew_arrow, road_ns_arrow): only the PAINT is lifted off his marking-bank through-arrow (pixels 120 over the tile's median), scaled to 5 m, washed in at 65% so the cracks show. 18 pieces now.
- Zebras cut to 4 m along the traffic, centred. FOUND BY THE GATE: full-length bars reached the tile edge and read as sidewalk, a seam break waiting for COMBAT TWO.
- gates/cook2_street_kit_gate.py, in the suite as COOK2 STREET KIT, 294/0. Its first reader used brightness and failed 60 times on his weeds; warmth separates his tan walk (red-blue 24) from his grey asphalt (3) cleanly. Mutation-proved twice (wrong written edge; kerb painted over), both red, restored green.
- Still owed: DIRECTION's pass before VOTE; COMBAT TWO laying the street board.

## Round three: rule 89, the same street before and after
- Rule 89 landed (Paolo 10/10, 'Can't tell difference'): my round-one sheet compared two different streets at half size, so it was not a rule-89 picture. Now: tools/bohemia_cook2_his_street_on_the_fight_block_10_10_26.py lays the kit's stamps into the street pixels of COMBAT TWO's own main-street blocks (found on the pixels: road rows 775-895, 1,993 and 2,087 street columns), buildings untouched pixel for pixel. Out: slices/fight_ground/kit_street/onboard/block_main_{0,1}.webp + onboard.json (pack manifest, exception names the unchanged buildings as COOK FOUR's).
- The picture: slices/vote/COOK2_THE_STREET_BEFORE_AFTER.png, two 585 px crops of block_main_1 at one art pixel to one phone pixel (1170 = his upright phone at 3x). The difference reads: the old checkered dark band vs his cracked asphalt, weeds in the walk, a kerb, a faded centre dash.
- First try streaked: the walk and kerb were decided column by column; one street now takes one T and B (the mode of the per-column runs).
- Pack gate: my tool and pictures pass (K1, M1). Its two reds are not mine and were red on main before this commit: K1 tools/bohemia_his_block_as_a_place_cook_10_10_26.py (COOK FOUR's), P1 block_main_0* and settlement home_0* without manifests (COMBAT TWO's cut and COOK FOUR's).
- NOT in VOTE: rule 87 sends it to DIRECTION first. FOR COMBAT TWO: swap blocks['main.0'/'main.1'].src to kit_street/onboard/ when it re-lays (fight_ground.json is theirs). The raided and reclaimed futures are not re-laid yet.
