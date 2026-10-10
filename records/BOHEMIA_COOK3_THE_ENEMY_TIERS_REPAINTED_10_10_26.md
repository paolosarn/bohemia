# COOK THREE [the enemy tiers repainted], round 1 (10/10/26, cook3-vamily)
Ruling: CHARACTER [armour you can see], his NO 'good idea, terrible implementation'; rule 87; rule 89 (before and after of the same thing, 1:1).
Sheet: records/cook3/enemy_tiers_repainted.png (before 1:1, after 1:1, both at 28 px). Tool: tools/bohemia_cook3_the_enemy_tiers_repainted.js. Paint: engine/bohemia_cook3_tier_paint.json (draft:true). Tier table, band pool and added pieces are CHARACTER's, read not changed; alpha untouched.
## The rule
Armour found by drawing its pieces alone on the bare body (the thirteen's round-2 method). Repainted as a MATERIAL by luminance: thug padded quilt, poacher leather, marksman leather with a strap, raider mail weave, leader steel plate with gold trim, marauder steel plate with lames and a lit top edge. Heavy tiers paint the whole chest (rig parts 3,4).
## Finding that proves us wrong
The added armour pieces (CHARACTER's vest, cape, pauldron) cover 188 to 445 pixels of a ~2,500 pixel body: under 18%. 'Armour you can see' was armour you could not see. Painting the chest took the marauder to 1,123 and the leader to 754.
## Measured armour pixels
THUG 136 | POACHER 1310 | MARKSMAN 1606 | RAIDER 561 | LEADER 754 | MARAUDER 1123
## Round 2 (open)
1. Thug 136 px: padding barely shows; needs the chest too, as padded cloth.
2. Raider mail only on a narrow strip; the Mob's mustard shirt still wins the read.
3. At 28 px the leader's steel chest greys his gold: the leader is supposed to be the one you remember. Trim must be wider, or the plate gold-washed.
4. The frame backdrop shows white in the sheet; cosmetic, sheet only.
DIRECTION first, then VOTE. Not in a tab yet.

# ROUND 2 (10/10, cook3-vamily)
Thug: chest padded too, 136 -> 606 px, quilt lines read. Raider: mail runs down the arms as a shirt (every clothed pixel above the hip), 561 -> 1194 px; the Mob mustard no longer wins the read. Leader: plate gold-washed 55%, he stays the gold one at 28 px.
Ladder at 28 px now: grey-brown padding, brown leather, brown leather, grey mail, gold plate, banded steel. Light to heavy reads by colour family alone.
Still open: the white box behind each figure in the SHEET (not the game); the frame's backdrop is not the first pixel, needs the naked-frame diff. Round 3: the five armour states (CHARACTER [armour you can see]) on the marauder.

# ROUND 3 (10/10, cook3-vamily): DIRECTION's BACK (records/BOHEMIA_THE_REVAMP_PASS_ROUND_TWO_10_10_26.md) answered
1. Poacher and marksman one man at 28 px: the marksman keeps his teal above the waist (keepHue 180), leather below. Two different men now.
2. Leader same at 28 px: the gold is now under the plate's lames (every 6 rows a dark seam and a lit row), lit top edges, and a darker belly (35% toward the hem).
3. Mail as checkerboard: now ROWS, a light row and a dark row, lit at the shoulder and darker to the hem, a faint link every other pixel on the light rows.
Back to DIRECTION. The five armour states are the next round.

# ROUND 4 (10/10, cook3-vamily): THE FIVE ARMOUR STATES
One plain man (CHARACTER's BASE_PERSON), bare to plate, CHARACTER's skins from records/target/bb/armor_tiers.json read not changed; the same sheet, five more columns, before and after 1:1 and at 28 px.
BARE untouched | PADDED quilted chest 1287 px (was an olive hoodie) | LEATHER brown 1467 | MAIL rows down the arms 1607 | PLATE seamed steel, belly dark, 1703.
His NO was 'good idea, terrible implementation': the before row is an olive hoodie, an olive hoodie with a jacket, an olive hoodie with a vest. The after row is five materials.
Open: at 28 px MAIL and PLATE are both grey; plate needs a value step (lighter lit edges, or darker overall) to separate. Next round, with DIRECTION's verdict.

# ROUND 5 (10/10): DIRECTION's HOLD (round three, the mail a checker the third time) answered
The checker came from the garment's own pixel noise printing through: mail and plate now take their light from the ROW's mean luminance, light row and dark row, lit at the shoulder and darker to the hem, no per-pixel dot. Raider and marauder read as horizontal rows at 1:1. DIRECTION said register after the mail.

# REGISTERED IN VOTE (10/10, cook3-vamily)
DIRECTION round three: 'Register after the mail.' The mail landed in round 5, so the sheet is in VOTE as cook3-the-enemy-tiers-repainted-10-10 (slices/vote/COOK3_THE_ENEMY_TIERS_BEFORE_AFTER.png, rule 89 before/after 1:1 and 28 px). vote_tab_gate: my row clean; 2 failures inherited from main (combat2 twin, tuning whys), measured red on main before my change.
