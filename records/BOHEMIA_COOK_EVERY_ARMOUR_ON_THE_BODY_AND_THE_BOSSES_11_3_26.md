# COOK ARMOUR (rule 337, ask line 345): THE BOSSES DRESSED, THE ARMOUR WORN
# 11/3, BUILT, NOT YET SEEN (rule 179). First push the armour (BUILD 11/3zza, 719de686), second the bosses (BUILD 11/3zzc, c91de519).

## THE ASK
Paolo 11/3, angry and right: "you build the bosses like shit, we don't have enough assets, and you're not creating assets, weapons,
armor, the vibe, nothing." Rule 337, ask line 345: every armour its own model on the body (the nine newest first, then the
placeholders), and THE POT, THE TAP and THE FILTER rebuilt as real assets: the man, his weapon in his hand, his face, in the fight
and on his card, each reading as THAT man in one look.

## MEASURED FIRST
- The three bosses (11/2, records/target/character/bosses/) stood in the fight as three thin men in pieces any rolled man wears: a
  bone shirt and a head wrap; a field shirt under a utility vest; olive coveralls and a gas mask. Nothing said which man he was.
  Their weapon and shield were not on them at all: their looks have no held sheets, so the fight drew whatever their stand-in
  gang holds in its fist, or nothing.
- The armory's nine pieces of the valley's own were DATA: each drew on the man as one of CHARACTER's 17 placeholder classes (the
  football pads as a quilted olive vest, the road sign as a car door, the goalie mask as a gas mask).

## THE BOSSES DRESSED (second push, BUILD 11/3zzc)
tools/bohemia_cook_the_bosses_dressed_11_3_26.py runs BOSSES' own pipe (tools/bohemia_bosses_the_three_men.py, CHARACTER's tool for
a new kind of man, the barber, DIRECTION's master rig, COMBAT's fight poses, RUN TWO's render and faces, BOSSES' pack), each boss's
own pieces modelled ON HIS BODY in CHARACTER's kit (the cloth lift, bands, rings, sections, the man's own measured hands), one hat
through HATS 1's door. His face, skin and body are kept from his 11/2 roll; his clothes, hat, cut and pieces are his own.
- THE POT, the kitchen's captain: STAINED CHEF'S WHITES (the bone button-up a value up, old blood and grease laid on as their own
  cloth), a black RIOT VEST CUT DOWN TO HIS CHEST with a knife (the hem ragged, his belly out under it, the trauma plate proud, the
  side tabs, the buckles), a red neckerchief, a leather butcher's apron, a CHEF'S TOQUE (a pleated white column on a dark band,
  leant a touch), THE COPPER POT'S LID on his left forearm (44 cm, a dome with a rolled rim, tarnished at the edge, one dent, a
  loop handle, two leather straps), THE BUTCHER'S CLEAVER in his right fist (30 x 15 cm, a bright edge, a dark spine, the hang
  hole, a riveted wooden handle).
- THE TAP, the pump-house boss: OIL-BLACK COVERALLS, a FIRE HOSE's tan canvas across him like a sash with its brass coupling at the
  hip, a RED VALVE HANDWHEEL bolted to his chest for a badge (18 cm, five spokes, the hub and its square nut, chipped to the iron,
  on a leather patch), a brass ring of valve keys, tan gloves, the work cap and wraparound shades, and THE VALVE WRENCH: a 55 cm
  pipe wrench, red I-beam handle, black hook and heel jaws, the knurled nut, the teeth.
- THE FILTER, the mechanic: olive coveralls and his rubber respirator; A FILTER PACK on his back (two filter-yellow canisters on a
  steel frame, black bands, rubber caps) and TWO RIBBED HOSES over his shoulders to his mask's chin; HIS ROBOTS' PARTS ON HIM (a
  robot's forearm plating round his left arm with an orange stripe, a robot's shoulder shell, three bolts, a robot's camera eye
  on his chest strap with an amber lens and a red tally, the Mechanic's cables); and A CLEAVER of his own (a 33 x 15 cm chopper
  cut from a robot's panel, its corner clipped, the robot's paint left on it, four rivets, the handle in black tape).
- HIS WEAPON AND HIS SHIELD ARE HIS MODEL'S, on his hand's bone and his forearm's, so they swing in COMBAT's own clips (stand, walk,
  aim, swing, hit, fall). fight_rig.json marks each look own_kit, and the fight (slices/BOHEMIA_FIGHT.html meleeDraw, one marked
  line) draws no second weapon or shield over him, the rule the Heavy's crash bar already lives by. The numbers are unchanged
  (boss_act_one.json still says Butcher's Cleaver, Wooden Shield, Warhammer).
- His card: his face in PORTRAIT's manifest (records/target/portrait/crew/boss_<x>_0/), the toque, the shades and the wheel, the
  mask and its hoses, talking on the meet card (BOSSES' pack, unchanged).

## EVERY ARMOUR ITS OWN (first push, BUILD 11/3zza)
tools/bohemia_cook_every_armour_its_own_11_3_26.py, through the pipe the police pair went through (the armour-through-the-rig tool,
imported, never edited): signed distances in CHARACTER's head frame, surface nets, DIRECTION's master rig (light, film, source
pass, the 45-degree camera, eight facings, a helmet also dropped and at portrait size, his head and trunk as holdouts, smoked
glass where a visor is), the rig's post, packed into CHARACTER's own sheets beside every piece already there (the old cells
lifted off as they are). armour_looks.json gives each of the nine rows 'own'; engine/bohemia_wear.js draws a row's own piece where
the sheet has it (one marked line).
- HELMETS: the goalie mask (bone white, eye and breathing holes, a crack, two red brow stripes, black elastic straps over a quilted
  cap); the football helmet (silver, black and red centre stripes, a maroon diamond each side, ear holes, a black face cage, a white
  chin cup, the neck bumper); the welding-mask riot helmet (a black welding hood on a black riot dome with one safety-orange stripe, a gold-mirror lens in its
  frame, a skull sticker, a flame decal, scorch, the pivot knobs); the gas-visor riot helm (olive black, the smoked visor down over
  a rubber gas mask, its canister out under the shield at his right cheek, a yellow stencil band, a fabric neck curtain).
- BODY ARMOUR: the football pads (two white plastic caps and their epaulets with a faded maroon stripe over a grey hoodie, the hood
  bunched, the laced front plate, black straps); the duct-taped carpet vest (casino carpet: burgundy, gold swirls, olive leaves,
  black dots, its pile; silver duct tape crossed on the chest, at the seams and the hem); the licence-plate vest (motorcycle plates
  shingled two across in five rows on olive canvas, sunset-orange bands, dark letters, bolt holes, rust at the edges); the
  riot-gear plate carrier (shoulder guards in three plates with rivets, a collar guard, a ribbed chest plate, a belly flap with a
  pale number, a pale band across the back); the road-sign armour (a yellow CURVE AHEAD diamond bent round his chest with its
  black border and arrow and three bullet holes, a green street sign on his back, a red STOP octagon on his left shoulder,
  seat-belt webbing and a chrome buckle).

## THE PLACEHOLDERS THE SHOPS SELL MOST, THEIR OWN (first push)
The same tool, --classes: the five classes with the most rows, each its own model of the valley (every row of the class wears it;
its extras, the mail and the horns, CHARACTER's own laid over it):
- the motorcycle helmet (25 rows): oxblood, darker so the sun's bleach no longer turns the crown rose, a smoke visor with a
  scratch's glint, a crack held with silver duct tape, scuffs to the primer, the chin vent, the pivot plates, the chin strap hanging;
- the hard hat (17): yellow, ridge and brim, a union sticker and a red one, a headlamp on its band;
- the padded vest (21): a moving blanket cut into a vest, maroon-grey, diamond quilting, the edges bound black, a cargo strap and
  its ratchet for a belt;
- the work jacket (16): brown duck canvas, a dark corduroy collar, two chest pockets with flaps, a reflective strip across the back;
- the scale coat (15): scales cut from flattened cans off the Strip's gutters, aluminium with a can's red or gold left on some,
  riveted, the shoulders scaled too.

## MEASURED
- THE ARMOUR (first push, BUILD 11/3zza): 14 new models through the rig, 31,036 to 90,604 faces each (the riot plate carrier and the
  gas-visor helm the most), every one 300 colours or more in its fullest view (the padded vest 301, the scale coat 573); the sheets
  slices/wear/wear.webp 512 x 831 (was 512 x 605; 263 kB) and wear_face.webp 512 x 554 (131 kB), 36 pieces in all (27 + the nine
  own). The class pieces' anchors where CHARACTER's placeholder put them: worst middle 2.5 px off (unchanged).
- Tried and fixed on the way (looking at the proofs): a bend that curled the road sign and the plates OUT toward the camera
  (now round his chest); the football helmet's grey cage invisible on its grey shell (now black, 2.5 px bars); an orange hard hat
  under the welding hood and a yellow hard hat with dark scuff dots read as a brain and a cookie under the rig's grime (now a
  black dome with one orange stripe, and a clean yellow dome with its headlamp); the scale coat's shoulders two brown balls
  (now scaled, flatter).
- THE BOSSES (second push, BUILD 11/3zzc): each a full sheet in the fight's own shape (25 columns: stand, the walk, aim, swing,
  hit, fall, carry, carrywalk; eight facings; 148 x 167 cells in his stand-in gang's cell so its gun sheet fits him): THE POT 321 kB,
  THE TAP 294 kB, THE FILTER 317 kB; his face on the fight's strip and his rest and four mouths at 64 and 128 in PORTRAIT's manifest.
  Rendered three side by side on four cores: street 185 / 280 / 351 s, fight 335 / 541 / 573 s.
- Tried and fixed on the way (looking at the stills): THE POT's first toque puffed into a white afro (now a pleated column on a
  dark band); his first cleaver 24 cm in light steel read as a spoon (now 30 x 15 cm, a dark body, a bright edge).
- THE POT's swing (rig_Swing SE k00-k02): the cleaver goes up over his head and down through, the lid riding his left arm.
- Gates: THE FIRST THREE BOSSES 43 passed, 0 failed (phone, the stranger's game: each boss met, his card his own face, his fight with the man himself in HIS OWN look on the board, A3b for all three); THE VOTE TAB GATE: the three moving cards two sentences each with where he sees it, a twin with three
  differences (their 11/2 VOTE sheets).
- Gates (the armour): THE ARMOUR THROUGH THE RIG 5/0 (27 class pieces file for file, made by the rig, the police pair's art, the glass, the
  anchors worst 2.5 px); CHARACTER's THE ARMOUR HE WEARS SHOWS 18 passed, 0 failed on the new sheets (the crew card, his portrait, the
  fight, the fight's face strip, camp, the map and its close end, phone and computer, nothing thrown). THE VOTE TAB GATE: my four
  rows two sentences each with where he sees it and a twin with three differences; its other four failures were there before
  this round (BOSSES logged the same 48/4 on 11/2: older rows' long whys, the alpha's landing on VOTE).

## WHERE HE SEES IT
- THE BOSSES: the fight (meet THE POT at the kitchen, THE TAP at the pump house, THE FILTER at the settling tanks from the MAP), his
  meet card (his face talking), and the VOTE tab: each boss his own card, moving.
- THE ARMOUR: every screen that draws a man in his gear (the CREW card, the FIGHT, the CAMP, the MAP, his portrait for a helmet).
  Buy one from the armourer in a town, put it on a man in the CREW tab. The VOTE tab: two sheets.

## SAID PLAINLY
- The other placeholder classes (the riot helmet's and police vest's own art from 10/26 stand; the welder's mask, the gas mask,
  the brim helmet, the chain hood, the rag hood, the straw hat, the bandana, the dust mask, the car door, the riot armour) are
  CHARACTER's shapes through the real rig; they get their own models next, the same way.
- The bosses' weapons are modelled on the bosses. COOK WEAPONS (handoffs/COOK.md) owns the held weapons every other man carries;
  NOTE there: the three boss looks are own_kit and must not be given held sheets.

## REFERENCE CHECK (the 9/4 standing duty)
The twins on every card and sheet: the boss as he was last round (his 11/2 stills and face, out of git) and each armour's
placeholder (the row's class drawn by the same player on the same man). The real things: a line cook's whites, toque and
neckerchief; a patrol riot vest; a 40-quart stockpot's lid; a butcher's cleaver; a water utility's red gate-valve handwheel, valve
keys and a 24-inch pipe wrench; a twin-canister respirator on hoses; a hobby robot's plating and camera; a high school football
shoulder pad set and helmet; a casino's patterned carpet; a Nevada motorcycle plate; a riot suit's guards; MUTCD W1 and R1 signs;
a fibreglass goalie mask; a hard-hat welding shield; a riot helmet with a gas mask under its visor; a moving blanket; a duck
canvas chore coat; crushed cans. No reference game.
