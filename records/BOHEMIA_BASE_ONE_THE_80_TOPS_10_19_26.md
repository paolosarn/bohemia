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

Fourteen tops were built and looked at first, one per hard option (RED SHIRT, BLACK TANK, STRIPED TEE, ROLLED FLANNEL,
CHARCOAL TURTLENECK, OLIVE HOODIE, HOOD-UP ASH HOODIE, TATTERED FLANNEL, WORK COVERALLS, BIB OVERALLS, DENIM SHORTALLS,
ARC LAYERED SHIRT, LONGLINE JERSEY, WIDE SHOULDER TEE), then the 80 were built:

| what | cycle 1 | after |
|---|---|---|
| THE COLOUR | the red rendered pink (the dust took its spread 79 -> 57) | every cloth at SAT 1.4 at the source (section 2) |
| THE NAMES | STEEL WORK SHIRT came out a tee (STEEL holds the letters TEE) | the name is read word by word |
| THE LYING HOOD | a 40 mm heap read at 1:1 as a pale fur collar (its top takes the dust) | 55 mm, rounder, higher, to the base of the skull |
| THE HOOD UP | cycle 1 a smooth ball with a square face hole (a diving helmet); cycle 2 the ear came through its side and the back's point read as a knob | cycle 2 an oval opening with a lip, a slimmer crown, a seam, soft folds; cycle 3 18 mm more over each ear, the point softer (the ear no longer shows; a small nub stays at the crown where the seam starts: three cycles is the limit, it goes to his vote as it is) |
| THE TATTERS | pin holes over a body painted in the same plaid, a 2.6 cm ragged hem: nothing read as torn | holes 3 to 4 cm showing his skin, the hem torn in points 5.5 cm deep, the cuffs torn |
| THE WIDE SHOULDER | pushed along the cloth's normal the pad only raised the shoulder | pushed OUT from the shoulder point 32 mm and up 10, past the arm |

Read as they are on the first pass: the tank's straps, scoop and armholes; the tee's stripes; the plaid and the shirt's
tail; the rolled sleeve's roll; the turtleneck's ribbed roll to the jaw; the coveralls; the arc's dome and the layered
cut's two hems; the longline's one mass over the legs.

THE LIGHT ROW AND LIGHT LEGS (measured; the third time this lane meets D3's bias, routed to DIRECTION): BIB OVERALLS and
DENIM SHORTALLS fail the guide's light row side on (E -2.8, W -4.4; E -2.7, NW -2.7, W -4.5), with and without the colour
at the source. The head is the same 48 in every top's top quarter; what moves the row is the LEGS: the mannequin's black
cargos put the bottom half at 54 to 57 (the black tank reads W +6.3, the red shirt +5.1), the denim legs put it at 71, over
a top half of 68.6. Any outfit whose legs are lighter than its dark head is 'lit from below' by construction, whatever
the light does. The shape is right and the colour is the flat's, so nothing is changed to pass: the two denim overalls
are held off the card (rule 114b), built and rendered (records/target/character/barber/base_bib_overalls,
base_denim_shortalls), and the question goes to DIRECTION with the numbers: should the light row compare the lit side
against the shadow side of the same mass, not the top half against the bottom? The 80's own pass found one more of the
same: ASH LONGLINE TEE, W -3.0, its quarters 48 / 76 / 70 / 54 (the pale ash hem to mid-thigh puts light in the third
quarter; the same cut in faded black, LONGLINE JERSEY, reads 48 / 61 / 52 / 54 and passes): held with the two denims.

THE COUNT: cards 1 and 2 pass 400 of 400 stills (224 and 176); card 3 passes 234 of 240, the 6 that fail are the three
held tops' side views, so its 27 shown tops are 216 of 216: 77 of the 80 in VOTE, 3 held.

FOR DIRECTION, A BUG IN THE MASTER RIG (found by this batch, worked around, the rig not edited): line 969 names the
cropped id frames with fn.replace('id_', 'rigid_') on the WHOLE path (line 857 beside it correctly takes the basename), so
any output folder holding 'id_' breaks the run after the stills: 'plaid_flannel' became 'plarigid_flannel', the save
raised FileNotFoundError and the portraits and rig.json were never written (DUST PLAID SHIRT, FOREST PLAID FLANNEL,
measured). This lane renders into a folder with 'id_' written 'id-' and copies the frames to their own name.

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
