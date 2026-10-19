# THE RAIDER AGAIN, THE THUG'S AND THE MARKSMAN'S WAY (COOK THREE, [the tiers through the rig] round 5, 10/19/26)

Rule 115(a)(c)(h), rule 120(a)(d). Cook only (rule 100): nothing in slices/, engine/ or the demo. Opus 5.5 at Extra
(rule 116), opened by the coordinator (rule 112). The chat before this one was stopped by the five-hour cap minutes in
with nothing committed on the row; resumed from the board.

## His word on the one before (the seventeenth votes)
NO on the mail raider (cook3-the-raider-through-the-rig-10-18): 'It's kind of funny telling you that we were gonna have
like this, that's insane.' Chain mail, a nose-guard helmet and a round shield are the Middle Ages; this is a dead-dollar
Las Vegas. The coordinator's note (sweep AX): the raider as built goes no further; one more raider only in the direction
of the two tiers he said YES to, the thug ('it's giving this like analog horror AI slop and I love it') and the marksman
('finally looks like they're all [Clayface] from Batman'); a second NO ends it for the round. Rule 120(d) the same
night: the face is the body's face, skin to skin ('Black people looking like white people').

## How Battle Brothers did it (rule 41) and our translation
records/target/bb/enemies.json, `brigand_raider`: the MEDIUM-ARMOUR man of the band: a mail shirt over padding (Worn or
Patched Mail Shirt at double chance), 85 percent a helmet, 66 percent a wooden shield, one good one-handed weapon. The
lesson kept: he is the band's armoured middle, heavier than the thug and the poacher, lighter than the leader. The skin
changed from the same city the thug walks in:
- THE MAIL becomes a POLICE-SURPLUS PLATE CARRIER looted from a station: a front and a back plate, a cummerbund of
  webbing rows, two shoulder straps, in coyote nylon (tape_masking 2: the thug's padded coat's colour, his YES).
- THE HELMET becomes THE HOOD UP of an oversized black hoodie (the runway's black, Rick Owens' hood; cloth_black 2).
- THE SHIELD AND THE ONE-HANDER become THE GUN: a sawn-off double barrel in his right fist (rule 120(a), guns first:
  the gun is the main way a fight is won). COMBAT owns whether a raider shoots; this is the picture.
- THE FACTION'S GOLD (the tier paint's raider and leader share it; the flat raider wears gold cuffs) is kept as the brass
  bases of a row of red shotgun shells on the chest: the one accent above the waist, and the focal point.
- Below: black cargo trousers (one black with the hoodie, one material), pale knee pads (the vest's nylon: the light
  end low on the dark legs), boots.

## The skin is the face's (rule 120(d))
He is a Black man: skin_deep 2 on his hands AND on PORTRAIT's modelled head (HEADS in the tool, PORTRAIT's file read and
called, never edited; a short full beard and a buzz under the hood). MEASURED OFF THE PIXELS, not asserted: the rig's
material-ID pass says which rendered pixel is the face's skin and which is the hands' and neck's; pooled over the eight
facings, the face's lit tone (L* 80th percentile, median a*, b*) against the body's:
- THE RAIDER AGAIN: dE 0.8 (face L 34.8, body L 35.1). PASS.
- the ruler, measured before it was set: the same step on face and hands measures 0.8 to 5.2 (the starred poacher 5.2,
  the mail raider 2.1, cycle 2 at skin_deep 3 0.9); a skin_deep 3 face on this skin_deep 2 body 18.6; a skin_light 2
  face on it 27.7. One step of a skin ramp apart is about 18; the line is 10.
- one facing alone is the wrong ruler: the same step measured 21.5 apart on the starred poacher's N (his face in shade,
  his hand in the sun). Hence pooled and lit.
`python3 tools/bohemia_cook3_the_tiers_through_the_rig.py --skin <frames>` (exit 0 on PASS).

## The cycles (logged)
1. Hoodie, hood (a 3.2 cm gap off the skull, a 3.5 cm point up), the vest as the body's torso triangles lifted and
   flattened to a plane, the shells, the pads, the gun; skin_deep 2. Eight facings: the hood a GREY EGG twice the face
   with the face a dark slot at its foot (the up-face dust greys a black hood; the gap and the point made it huge).
2. The hood on the skull (1.7 cm), falling back not up, a centre seam crown to nape, open from the hairline to under the
   chin, worn a little pushed back; skin_deep 3 to read under it. The face reads; it rendered (150, 120, 98), a light
   brown, not the Black man this is. The vest's lifted triangles had a ragged edge: it read as a FLEECE BIB.
3. The vest rebuilt as its own clean pieces: two flat 3 cm plates on a rounded rectangle bent a little round the chest,
   a cummerbund ring, two straps over the shoulders, every vertex weighted from the nearest torso point (never an arm).
   The man is low-poly (2 to 21 vertices round the waist every few cm; the vertex search found none at 0.855 m), so the
   surface is RAY-CAST with the arms left out. Skin back to skin_deep 2 with the hood open: a dark brown face that reads.
4. The hood's base lay over the straps in steps (a clearance per angle) that the dust lit as a fur ruff: a running
   maximum then a mean over nine segments lays it as one fold of cloth; the cummerbund 8 mm further off the hoodie.

## The card, the gate, the sheet
(filled from the full render below)

## Findings
- FOR PORTRAIT and EYES [every face beside its body]: the rig's ID pass makes the skin match a measurement, not a look:
  `--skin <frames>` pools the face's and the body's skin pixels over the eight facings and compares the lit tone. Run on
  the starred poacher it reads 5.2 (PASS); on PORTRAIT's crew it needs the body's skin material to end in `_skin` and the
  head's to be `portrait_*_skin` (both already true on every model built by --whole). One facing alone is not a ruler.
- FOR DIRECTION (the rig): the material-ID table's hex is the LINEAR emission; the PNG is sRGB-encoded (#23ff19 is
  written as 104, 255, 89). A reader that matches the hex to the PNG finds nothing (this lane did, first).
- FOR DIRECTION (the rig, again): the up-face dust greys every black hood and cap (the fifth lane-round to hit it). A
  black hood in the desert is honestly dusty, so it stays; the size of the grey area is what to control, and the shape
  did it (cycle 2).
- FOR CHARACTER: CesiumMan's torso is a ring of 2 to 21 vertices every few cm; any garment that reads the body by its
  vertices (band(), the coif's clearance) is reading a sparse sample. Ray-casting the surface with the arms removed
  (vest() in this tool) is the reliable way to lay a piece on him.
- FOR COMBAT: the raider carries a gun in the picture (rule 120(a)); whether Battle Brothers' raider tier shoots in our
  fight is yours.

REFERENCE CHECK: the twin is the game's own flat raider (records/cook3/enemy_tiers_repainted.png, cell 3); the thug and
marksman he voted up; PORTRAIT's modelled head; the card of numbers. No reference game.
