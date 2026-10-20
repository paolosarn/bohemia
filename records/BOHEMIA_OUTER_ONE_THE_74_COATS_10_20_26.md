# OUTER 1: THE GAME'S 74 COATS ON THE 3D MAN (CHARACTER, 10/20/26)

Row: CHARACTER [every old asset into the new look] (claimed 10/18), round six: the roll call's fifth batch, the outer
slot, in the roll call's order (hair, hats, eyewear, base tops, then OUTER). His words: 10/18 'all the assets we have,
we have to coordinate them, rename them, reapply them in the new art stuff, so please don't forget'; 10/19, the twentieth
votes (rule 121(l)): 'we need all the 2D assets made into 3D assets now though'.

## 1. WHAT THE GAME HAS

74 outer garments in the alpha's wardrobe, read off the bank (never edited), drawn by three functions: genCoat (66),
genPoncho (4), genApron (4). genCoat's options (len, vest, jacket, split, and the runway's wrap, asym, cocoon and comma of
9/5) and its own rules, read off its code, are what each shape keeps. Sixteen shapes, every coat in its own ramp:

| shape | coats | what the 3D one is |
|---|---|---|
| TRENCH | 3 | to the calf, belted, a double row of dark buttons, a narrow open front, the tall collar |
| DUSTER | 6 | to the calf, hanging open, a capelet over the shoulders, the hem worn ragged |
| LONGCOAT | 7 | to the calf, closed above the waist, patch pockets with flaps |
| SPLIT TAIL | 4 | a vent up the back from a third of the skirt, widening to the hem |
| CAR COAT | 7 | to the knee, pockets, cuffs |
| CHORE COAT | 7 | to the upper thigh, patch pockets and flaps, cuffs (the barn coat's collar dark) |
| JACKET | 7 | stops at the waist on a ribbed band, ribbed cuffs (leather: a zip down both edges; field and denim: chest pockets) |
| VEST | 9 | sleeveless, cut armholes, fully open (tactical: four pouches; quilted: stitched channels) |
| COCOON COAT | 6 | blown out round the shoulders and the chest, narrowing to the hem |
| COMMA COAT | 3 | the cocoon with the hem longer behind |
| WRAP COAT | 4 | no opening: the crossing panel's edge shoulder to hip, a belt and its knot |
| ASYMMETRIC COAT | 3 | the hem on a slant, long on his right |
| PONCHO | 3 | one blanket from the shoulders over the arms, a neck hole, two woven bands |
| HOODED PONCHO | 1 | the poncho with BASE 1's hood up over the head |
| APRON | 2 | a panel on a neck strap, waist ties; the smith's heavy leather with rivets |
| HALF APRON | 2 | the skirt panel on the waist ties |

THE NAME SAYS WHAT THE OPTIONS CANNOT (BASE 1's rule): the game's trench, duster and longcoat are one coat at three
lengths and colours; here the name decides the cut (belt and buttons, capelet and open front, pockets).

## 2. THE METHOD

tools/bohemia_character_garments_outer.py, called by the barber tool (build OUTER1 | OUTER1:<names>): each shape modelled
ONCE as clay on the rig's man with BASE 1's own toolkit (tools/bohemia_character_garments_base.py kit(): its helpers
lifted out of pieces() with nothing changed in what they build; measured on RED SHIRT, ASH HOODIE and BIB OVERALLS: every
mesh the same, vertex for vertex) and THIS LANE's coat skirt (the tube: a pattern hung from the hip, never narrowing back
onto the legs, weighted onto each thigh so it parts on the stride); PORTRAIT's starred head in the TEMPLE TAPER on top;
DIRECTION's rig unedited, standing (--clip Stand:1). The twin: the game's own flat coat as the body wears it today,
OUTER:<name> on the barber's flat tool, eight facings, 1:1.

WHAT LOOKING CHANGED:
- SOOT TRENCH, cycle 1: 6 cm of flare on a coat to the calf read as a bell from the back; the long coats flare 3.5 cm
  now (the duster 7).
- DUST PONCHO, cycles 1 to 3: cut as the skirt's tube, its section took in the hanging arms and the hang rule never let
  it narrow, so it read as a cake a metre across; cut to its own pattern (a neck ring, out over the shoulders, then
  straight) it read as a box (a level hem, a 10 cm shoulder ledge); the shoulder now slopes from the neck past the arm
  and the hem falls lower front and back. Three cycles; a fourth is the tell.

- THE LIGHT ROW AND THE MANNEQUIN'S HEAD (measured, the finding of the round, FOR DIRECTION AND PLUMBER): the guide's
  light row (G3: the opaque top half of the sprite at least as bright as the bottom, within 2.5 values) failed all 15 of
  the first long coats, on the back and side facings, by 7 to 31 values. The coats are lit from above: with the head left
  out, the top half of the coat is as bright as the bottom or brighter (BONE DUSTER N 112.8 over 115.2, RANGER LONGCOAT N
  76.5 over 73.5, SOOT TRENCH N 63.7 over 58.0). The cause is the barber's mannequin: PORTRAIT's starred head is 35 to 38
  per cent of the sprite's top half, and in the black taper it reads value 30 from behind; any coat lighter than the head
  'is lit from below' by construction. His own YES'd gang looks show it: the Volunteers' bone cocoon coat fails the same
  row on 8 of 8, the Colorful's grass car coat on 5 of 8, while the dark coats (the Reds' brick duster, the Anarchists')
  pass. So the coat cards put the mannequin in the same taper in SAND (tape_masking 1, HAIR 2's STATIC), the coats
  unchanged: RANGER LONGCOAT went from 8 of 8 out to 8 of 8 in; BONE DUSTER from 7 out (worst 31 values) to 4 out (worst
  8). What still fails is held off its card (rule 114b), not changed to pass. The fix that belongs to the ruler, not to
  this lane: compare the lit and the shadow side of one material (the rig's own id pass), not the sprite's halves (BASE
  1's note, three rounds running).

## 3. THE CARDS

[filled when the renders land]

[bb Battle Brothers dresses a man in body armour over a gambeson, painted layers per facing; its coats are armour. Ours
are the street's: what a city wears after the money died, cut and hung on the man so it turns, walks and parts with him.]
[analog horror: wool and leather pressed in clay, a hem worn ragged, a poncho's woven bands sun-bleached, the dust in every fold.]
