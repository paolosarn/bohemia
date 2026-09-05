# HAIRCUT REFERENCES (hair as a mass on a 56/112px head)

### HAIR-01  Pedro Medeiros (saint11) tutorials — hair and character heads
- WHERE: https://saint11.org/blog/pixel-art-tutorials/
- KIND: pixel
- TEACHES: hair is ONE MASS with a silhouette, clumps drawn as little off shapes; single-strand lines at sprite scale read as scratches, not hair.

### HAIR-02  The repo's own hair laws (the deepest reference we hold)
- WHERE: laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md + laws/BOHEMIA_LAW_THE_HAIRLINE_IN_PROFILE_8_27_26.md + laws/BOHEMIA_LAW_A_HAIRCUT_READS_FROM_EVERY_ANGLE_8_28_26.md
- KIND: real
- TEACHES: the hairline crosses the FOREHEAD, TEMPLE and EAR in profile; a haircut is one haircut from all eight directions; no straight runs longer than six rows.

### HAIR-03  Real barbering taxonomy (any barber's chart)
- WHERE: search "haircut names chart barber" (structure only)
- KIND: real
- TEACHES: every real cut is LENGTH ON TOP x LENGTH ON SIDES x HOW IT FALLS; naming a cook against that grid catches a shape that is not actually a haircut anybody has.

<!-- HAIR-04..HAIR-08 landed 9/5/26 by the CHARACTER lane against his 8/25 order,
     "LOOK ONLINE FOR PIXEL HAIRSTYLES IN ALL 8 DIRECTIONS", which the playtest
     dispatch turned into REFERENCE FIRST, BEFORE ANY MORE COOKING: study what those
     artists do AT THE BACK and AT THE THREE-QUARTER. These five are the eight-facings
     half of the shelf, which HAIR-01..03 did not cover at all. Measured against our
     own wardrobe in records/BOHEMIA_DOES_THE_HAIRCUT_TURN_9_5_26.txt. -->

### HAIR-04  Sandy Gordon — 8-Directional Turn-Around
- WHERE: https://lospec.com/pixel-art-tutorials/8-directional-turn-around-by-sandy-gordon
- KIND: pixel
- TEACHES: the canonical pixel-art turnaround is EIGHT SEPARATE DRAWINGS, laid out as one sheet so the artist judges a cut by how it CHANGES across the row rather than by any single view; a facing that cannot be told from its neighbour on that sheet is not a facing.

### HAIR-05  SLYNYRD (Raymond Schlitter) — Top Down Character Sprites, Pixelblog 22
- WHERE: https://www.slynyrd.com/blog/2019/10/21/pixelblog-22-top-down-character-sprites
- KIND: pixel
- TEACHES: THE FINDING THAT ARGUES AGAINST US, and it is here on purpose. Shipped top-down games commonly draw FOUR directions and let the diagonals reuse them, and a side view is normally MIRRORED for left and right rather than redrawn — a unique frame per orientation is only paid for when the design is genuinely asymmetric. So "the back three-quarters reuse the back" is a normal trade in the craft, not automatically a bug. It is a bug HERE for two reasons: we already pay to render eight, and mirroring is exactly what our back three-quarters were NOT doing — NE and NW were the same picture, not reflections of each other, which is the one thing this reference says you must never skip.

### HAIR-06  Head anatomy — the occipital protuberance and the nape
- WHERE: https://hairscience.org/news/parts-of-the-head/ (and any head-anatomy chart)
- KIND: real
- TEACHES: the back of the head is about two thirds of the head's height, the neck emerges from UNDER the occipital bone, and the skull tapers inward toward the spine before the neck begins. THAT TAPER IS THE LANDMARK THE HAIRLINE IS PLACED FROM — the nape starts there, and hair overlaps both the ear and the neck. Two things fall straight out of it: hair does not stop in a straight line at the bone, and the base of the skull is read off the silhouette's pinch, NOT off a rig's neck joint (a joint is a pivot further down inside the body; measuring from it made our own nape rule un-passable by any real haircut).

### HAIR-07  Drawing the back of a head — hairline gradient
- WHERE: https://melodywillingham.com/how-to-draw-the-back-of-a-head/
- KIND: real
- TEACHES: from behind, the hairline's density is a GRADIENT — thicker at the nape, finer at the crown — so the back of a head is not one flat mass; the edge that reads is the bottom one, on the neck, and that is the edge a barber actually cuts.

### HAIR-08  A three-quarter is between, and it is its own drawing
- WHERE: https://www.slynyrd.com/blog/2025/3/24/pixelblog-55-top-down-character-animation
- KIND: pixel
- TEACHES: a three-quarter shows part of the front AND part of the depth a head-on view hides completely, so its silhouette sits BETWEEN the head-on and the side-on one and is asymmetric about the sprite's centre. Our own numbers set the size of that: measured off hair/curtain-bob, the one style Paolo painted himself, hair leaves the skull by 0 px head-on and 2 px side-on, so a three-quarter is 1. A rule from the internet does not outrank the reference he painted (8/3) — reference gives the SHAPE of the rule, his art gives the NUMBER.
