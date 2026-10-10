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
