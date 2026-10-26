# [gear as layers on the rig] THE PLAN (ANIMATION, rule 177(b), written 10/26 while the camp renders ran; nothing built yet)

THE ROW: one body per man and every gear item its own layer on the same skeleton, eight facings and the held keys, put together
when the fight draws him; a layer shared by all who wear it (less memory than a sheet per man, rule 173); COOK models the
missing items; COMBAT picks the layers from his gear; the gate finds each equipped item drawn in every facing and clip.
WHAT STANDS IN FOR IT NOW: CHARACTER's placeholder (engine/bohemia_wear.js, 7035d1c7) finds his head on each cell's own pixels
and lays a flat helmet or chest piece there; the row's layer replaces it piece by piece.

## [bb gear] HOW BATTLE BROTHERS DOES IT
A man is a paper doll: separate sprites for body, head, beard, hair, helmet, body armour (and its attachments), shield and
weapon, each drawn at fixed sockets over the one before, two facings (one mirrored). Its 'animation' is the whole doll moved as
one (the idle bob, the lunge, the hit shake), so a sprite never needs a pose: a helmet is one picture per facing. That is why a
thousand items cost it nothing. Ours has poses (held keys, eight facings), so a layer must be drawn for every pose a body takes,
and the doll's trick only works where the piece rides a rigid bone.

## OUR WAY, THREE KINDS OF PIECE
1. RIGID ON THE HEAD (helmets, hats, masks, goggles): rides the head bone, so one layer per facing per head TILT is enough, not
   per pose. Render each piece on the reference head at the head's few tilts the clips use (level, down 20, down 40, back 15),
   eight facings; at draw time place it by the man's head joint for that cell (the posed joints are kept for every town and
   camp pass in records/animation/town_joints; the fight's poses need the same file from COMBAT's tool) and pick the nearest tilt.
   The body as a holdout is not needed for a helmet (it sits on top); the hair under it is hidden by drawing the head-gear
   layer's own 'hair cut' mask (the piece's footprint grown 1 px) before the piece. Cost: about 4 tilts x 8 facings a piece.
2. HELD (the guns, the melee things, the shield): already layers. The holds (slices/rig_hold) and the melee (slices/rig_melee)
   render the thing in his fist frame for frame with his body as a holdout; nothing new.
3. WORN ON THE TRUNK (body armour, vests, plates, the car-door plate): bends with the spine and the arms cover it, so it is per
   pose. Shared across men only by build: render each piece on the five builds the roll makes (narrow, middle, broad, heavy, her
   body) with the man as a holdout, per clip, eight facings; a man takes his build's layer. Cost per piece: 5 builds x the fight's
   clips; the trunk pieces COOK has (the plate carrier, the riot vest, the car-door chest) first.

## THE ORDER WHEN THE ROW IS PICKED UP
(1) the head kind on the fight's clips for the riot helmet and the hard hat (what COMBAT deals most), the player call
BohemiaWear.layer(look, slot, id, clip, key, facing) -> a cell or null (null: the placeholder draws, as now); (2) its gate: every
equipped head piece drawn in every facing and clip on the real fight, never off his head by more than 2 px (his head joint);
(3) the trunk kind on one build, then all five; (4) the town and camp passes read the same layers.
