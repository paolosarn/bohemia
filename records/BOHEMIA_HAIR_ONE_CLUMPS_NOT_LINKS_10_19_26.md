# HAIR 1: THE BARBER'S ELEVEN CUTS, THE EIGHT NEW ONES AS CLUMPS, LOCKS, ROPES AND BRAIDS (CHARACTER, 10/19/26)

Row: CHARACTER [every old asset into the new look], round two: the roll call's first batch, hair (his order: "we still
have to get the hair approved and the hats approved and the sunglasses approved").
His words on the crew faces, 10/18: "it looks like you made some hair look like it was like a medieval link mesh
armor... so just keep in mind."

## 1. WHY HAIR READS AS CHAIN MAIL (the finding the method answers)

Chain mail is a field of ONE size of round bump on a regular pitch: links. Two of the hair surfaces in the game made
exactly that: a groove every 12 mm combed across a crown (a regular pitch), and coils seeded at random but all one size
(the eye still finds the size). Hair reads as hair when (1) its relief is ELONGATED along the way it is combed, (2) it
comes in clumps of DIFFERENT sizes with gaps between them, and (3) a long cut is made of separate pieces that throw
shadows on each other. Every one of the eight new cuts is built from those three things and nothing else:

- CLUMPS on a shell: seeded at three sizes (20, 11 and 6 mm apart), each clump an ellipse 1.6 to 2.8 times longer than
  it is wide laid along the comb (front to back on a taper's crown, down on a fringe, away from the part on a curtain),
  each its own depth; the relief at a point is the deepest clump it sits in, nothing in the gaps.
- LOCKS: a flat lens of clay rooted on the skull, walked down the head at its own azimuth and then hanging (the
  barber's LAYERED FALL rule: never back in), resting on the shoulder.
- ROPES and BRAIDS: a tube with two strands twisted round it (a groove on a helix), or a plait of lenses that cross at an
  angle (the chevron).

tools/bohemia_character_hair_one.py holds the eight; tools/bohemia_character_the_barber_on_the_skull.py calls it (the
first three cuts, his UP on character-the-barber-on-the-skull-10-18, are untouched). Each reads its silhouette off the
flat cut's own dials in the alpha's wardrobe (vol, side, front, fade, flare, tex), on PORTRAIT's starred head on the
barber's mannequin, rendered through DIRECTION's rig unedited.

## 2. THE EIGHT, AND WHAT EACH ROUND OF LOOKING CHANGED

| cut | dials | built as | changed after looking |
|---|---|---|---|
| DRY TAPER | vol 1, side .36, front .16, fade 6 | the taper with clumps combed front to back, a stubble fade 120 mm deep in three dithered bands | brown darkened (below) |
| DEEP TAPER | vol 1, side .32, front .14, fade 9 | the highest line, a 150 mm fade | nothing: a high-top fade at 128, one gradient at 1:1 |
| SHAG | vol 1, side .82, front .30, flare .10 | a thin scalp, 11 crown locks, 15 jaw locks flipped out, 7 choppy fringe locks | cycle 1 read as a helmet: a 10 to 18 mm cap buried locks set 12 mm off the skull; the cap is now 4.5 to 7 mm and the locks stand 13 to 26 mm off |
| CURTAIN CUT | vol 0, side .78, front .42 | a centre-parted scalp, 18 wide locks to the jaw, two front curtains swept from the part to the cheekbone | the same burial, the same fix |
| HEAVY FRINGE | vol 1, side .64, front .46 | a thick shell with a blunt notched edge at the brows, 11 short pointed locks over the brow, 8 over the ears | cycle 1 read as a smooth black helmet: relief 4.5 mm was invisible under black hair with flattened normals; now 8 mm, the strand normals capped at 0.5, the edge in pieces |
| ROPE LOCKS | vol 1, side 1.50, front .20, locs | ropes from random sections of the scalp, hanging to the shoulders, the front ones swept to the sides | cycle 1: 24 mm sections and 12 mm ropes read as long straight hair; now 29 mm sections and 16 mm ropes |
| SHORT ROPES | vol 0, side .62, front .18, locs | short twisted ropes, 25 mm sections | the same fattening |
| DUST WEAVE | vol 0, side .95, front .22, braid | cornrows front to back, short braids hanging at the nape | cycle 1: seven rows over the top left the temples bare; eleven rows wrap the sides |

THE COLOURS: H_BLK is cloth_black 0 (the barber's: about 0.6 of the flat cut's mid, the rig's sun and dust lift it back);
H_BRN was tape_masking 0 and sat on the mannequin's tan skin at one value, so it is clay_mustard 0, the warm step at the
same 0.6 of its flat mid (82, 58, 38).

## 3. WHAT THE CARD ASKS

One card, character-hair-one-clumps-not-links-10-19: the barber's eleven cuts on the starred head, each row the game's
flat cut today at 1:1, the model's eight facings at 1:1, and the head at the portrait's 128. The question is the METHOD
(does this read as hair, not chain mail) and the cuts one by one; a cut he votes down goes back, never into the game
(rule 108 stands for assets). The walk in eight for each cut renders when its card passes (the first three already walk).

[bb Battle Brothers' barber picks a hair and a beard from a list of painted layers, one picture per facing; ours is one
sculpted cut on the head bone, so it turns, walks and talks with the man.]
[analog horror: clay hair that still looks like clay, pressed with a thumb, never a hair simulation; the dust is on it.]
