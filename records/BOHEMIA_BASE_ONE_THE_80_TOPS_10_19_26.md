# BASE 1: THE GAME'S 80 TOPS ON THE BARBER'S 3D MAN (CHARACTER, 10/19/26)

Row: CHARACTER [every old asset into the new look], round five: the roll call's fourth batch, the garments slot by slot,
base first (80 tops). Rule 115c: modelled at the source and rendered through DIRECTION's rig, unedited.

## 1. WHAT THE GAME HAS

80 canon base tops, drawn by two functions with options (read off the alpha's wardrobe, never edited):

| function | option | values |
|---|---|---|
| genTop | sleeves | none (tank), short, rolled (cut at 68% of the arm), long (true is long) |
| genTop | neck | crew, henley, button, turtle, hood (hoodUp, and hoodDefaultUp on the two HOOD-UP items) |
| genTop | pattern | plaid, stripe |
| genTop | tatter, pocket | a ragged hem and holes; a hoodie's front pocket |
| genTop | shoulder, cut | the runway's two proportions (9/5): shoulder wide or arc, cut long or layered |
| genCoverall | bib, short | coveralls; bib overalls (the arms and chest bare, crossed straps at the back); shortalls (cut at the knee) |

THE NAME SAYS WHAT THE OLD OPTIONS NEVER COULD: the first tops in the bank (RED SHIRT, GREEN FLANNEL, SAGE FLANNEL,
SCAVENGER FLANNEL, BONE HENLEY, BRICK HENLEY, PATINA WORK SHIRT, STEEL WORK SHIRT, WHITE TEE, OLIVE DRAB TEE ...) predate
the neck and print options and the flat draws them all as one long crew. Where a top carries NO neck and NO print, its
name fills them in, word by word (STEEL is not a TEE: a FLANNEL or PLAID is a plaid button shirt, a HENLEY a henley, a TEE short, a SHIRT a button shirt, a
WORK SHIRT gets two chest pockets); every option the alpha does carry wins. 16 shapes result:

| card | shapes |
|---|---|
| 1 THE SHIRTS (28) | TANK 5, TEE 12, LONGSLEEVE 4, HENLEY 7 |
| 2 THE COLLARS (22) | BUTTON SHIRT 8, WORK SHIRT 2, FLANNEL 10, ROLLED SLEEVE 2 |
| 3 THE HEAVY ONES AND THE RUNWAY (30) | TURTLENECK 4, HOODIE 8, HOOD UP 2, TATTERED 2, COVERALLS, BIB OVERALLS, SHORTALLS 2, THE RUNWAY CUTS 10 |

## 2. THE METHOD

tools/bohemia_character_garments_base.py, driven by the barber (build BASE1 | BASE1:<names>): each top builds its own
body (this lane's rig tool, LOOKS 'G_<tag>' added in memory, through a new extra() hook that changes nothing for the
fourteen looks), then PORTRAIT's starred head goes on it in the TEMPLE TAPER (the barber's own cut, as_cut), then the rig.
Each OPTION is modelled once:

- THE BODY OF THE TOP is the man's own skin from neck to hem, CUT FINER FIRST and then kept and lifted (this lane's lift
  at the fine level: the man is 234 vertices of torso, so a neckline cut on his own faces is a staircase; cut on the
  subdivided cloth it is a line). The man's own faces are repainted under it, skin where the top leaves him bare.
- NECKS: a crew's rib band; a henley's rib, a placket and three buttons; a button shirt's collar stand, two collar points
  falling onto the chest, a placket and six buttons; a turtleneck's ribbed tube up the portrait's neck to the jaw with a
  roll at the top; a hoodie's hood lying in a heap on the upper back, its crossover band and two drawstrings (HOOD UP: a
  shell over the head with the face open in it and a lip round the opening, falling at the nape onto the shoulders).
- SLEEVES: short (cut half down the upper arm, standing off it, a hem band); long (a cuff, ribbed on a hoodie); rolled
  (cut at mid-forearm, a fat roll in the ramp's light, as the flat draws its bulge).
- HEMS: a tee's band; a shirt's curved tail, longer at the front and the back; a hoodie's ribbed waistband; the longline
  to mid-thigh; the layered cut's two hems (a longer, narrower under-layer in the ramp's dark); the tattered hem torn
  in points with holes in the body of the top.
- THE COVERALL: one colour top and legs, the collar, the zip and the belt in the dark, two chest pockets with flaps, dark
  cuffs; BIB OVERALLS a bib and a waist on two dark straps crossed at the back, two light buttons, a bib pocket, the arms
  and the chest bare; SHORTALLS the same cut at the knee.
- THE RUNWAY'S TWO PROPORTIONS (Rick Owens, Balenciaga, Bottega Veneta): the wide shoulder a square pad past the arm; the
  arc a cocoon dome, one curve from the neck to the elbow with no point (the flat's RNWY-02).
- PRINTS are this lane's prints in metres (plaid 16 cm, stripes 6.4 cm, a button shirt's stripe a chalk line), mapped
  round the body on every piece the eye sees: the body, the collar, the tail, the placket, the pocket.

THE COLOUR AT THE SOURCE (measured, cycle 1): the rig's source pass dusts every cloth toward a pale warm grey, and the first
top (RED SHIRT, S facing, torso) rendered (126, 70, 69) against the flat's (134, 55, 50): the red's spread from its grey
fell from 79 to 57 values and it read pink. Every cloth now goes in at SAT = 1.4 times its ramp's distance from its own
grey (its luminance kept), so the render lands on the flat's colour; a grey stays a grey.

## 3. WHAT LOOKING CHANGED

(filled per cycle below)

## 4. THE CARDS

Three cards, never one of eighty rows: character-base-one-the-shirts-10-19, character-base-one-the-collars-10-19,
character-base-one-the-heavy-and-the-runway-10-19. Each row: the game's flat top on the barber's flat mannequin at 1:1,
the model's eight facings at 1:1, the head and shoulders at the portrait's 128. Every still goes through the guide's first
five (the NOT VIBE CODED gate's own checker); a top that fails is held off its card and named here (rule 114b).

[bb Battle Brothers dresses a man in two slots, body armour and helmet, each a painted layer per facing with its armour
number; the shirt under it is never seen. Ours is the layer the street sees in a ruined city where nobody wears plate:
the shirt is the armour slot's first layer, cut and sewn on the man so it turns with him.]
[analog horror: clay cloth pressed into shape, a collar you could tear, the dust in every fold; nothing glows, nothing is
clean.]
