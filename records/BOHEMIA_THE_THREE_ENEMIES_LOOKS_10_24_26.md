# CHARACTER [the enemies' looks]: THE MECHANIC, THE KIDS AND RUNNERS, THE HEAVY ON THE 3D MAN (10/24)

The coordinator's round of 10/24 (Paolo: "10% usage left and 12 more hours... let's have fun, let's be creative").
COMBAT builds the three as [bestiary] rows (rule 42a; the skins from records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_THE_BESTIARY_
COUNT_9_29_26.md): NECROMANCER -> THE MECHANIC (a man who keeps reviving his robots; kill him and the machines drop),
GOBLINS -> KIDS AND RUNNERS (kiting, slings and nets), ORCS -> THE HEAVY (exo-suit men, crash-bar shields, they push you
off the tile). This lane gives them their looks on the 3D man: layered (rule 129), grimy (121(j)(k)), the runway inside
the grime (Rick Owens, Balenciaga, Bottega Veneta), no two alike (121(i)). No card (rule 127).

Tool: tools/bohemia_character_the_three_enemies.py. Roll (the kept scene, rule 128): records/character/BOHEMIA_THE_THREE_
ENEMIES_ROLL.json.

## 1. Reuse first: what the wardrobe already had

Every garment on the nine people is a piece this lane already made on the 3D man: the tops (GARMENTS BASE), the coats
(GARMENTS OUTER), the trousers and shoes (LEGS AND FEET), the belts, gloves, scarves, pads, gorget and satchels (GEAR 1),
the face wraps, bandanas, gas mask and visor (EYEWEAR 1), the scrap helm (HATS 1), worn as an outfit of layers (THE
OUTFIT). What it did not have is modelled once, as clay, in the new tool:

| piece | who | what it is |
|---|---|---|
| THE WELDING MASK, PUSHED UP | the Mechanic | a curved shell built down over the face, 4 cm off it, the chin cut forward, then turned 95 degrees up on two side pivots: the chin juts over the brow, the dark lens faces the sky; a headband and the pivot knobs under it |
| THE CABLES | the Mechanic | two insulated runs on the diagonals over the coat (a dulled extension-cord orange from the right shoulder, a black from the left), a plug with its prongs hanging at each hip, a three-turn coil off the tool belt on the right hip, three grey turns round the left upper arm |
| THE SLING | the Kids and Runners | two leather cords out of the right fist, a cupped pouch with its stone, hung along the forearm so it dangles to the knee when he stands |
| THE EXO FRAME | the Heavy | a 4 cm bar down the outside of each thigh and shin, a hip disc, a knee disc and a stirrup at the boot, a piston along each thigh; a spine bar, a hip ring with a pivot to each leg, a yoke over both shoulders with a motor drum on each; bars on the backs of the arms with an elbow disc; a car battery strapped to the spine (batteries are the money, 9/4); every strap tan woven leather (the Bottega note) |
| THE CRASH-BAR SHIELD | the Heavy | a truck's bull bar cut off and strapped to the left forearm, 62 by 48 cm: a bent 3.6 cm tube frame, two uprights and a crossbar, a push bar standing off it, a dented diamond-plate panel rusted at its edges, a dead Nevada plate riveted on; it faces out and forward when the arm hangs |

## 2. The seventeen (round 2, 10/25: nine became seventeen)

MEASURED FIRST, in the demo's own fight (the demo's nfOpen door with a road party, before any pack): a kids' band of 14 deals eight kids, all from one pool (every goblin kind reads ours.people_looks.band.runner), and the fight repeats a face only when the pool is smaller than the board (freeLook). Three Runners for eight kids is twins on every board (121(i)). So the cast is sized to the bands: EIGHT Runners (a kids' band runs to ten at count_scale 0.6), FIVE Heavies (a heavies' band fields up to five at 0.45), THREE Mechanics (one heads each machines party, never two). A type's pool switches only when the whole type is made, so no board ever lost a look while the rest rendered.

Rule 159 on the roll before any render: the pieces whose colour runs blue (a denim vest, the outlaw bandana, a steel work shirt, slate trousers; and the slate cocoon coat, which the rig's cool fill rendered a hot blue at 1:1, sampled (80, 96, 144)) are out; ash, coal, bone, khaki, rust, olive, oxblood are the cloth. Colour is an accent: the oxblood scarf, a rust dust mask, the dulled orange cable.

| id | skin | cut | under | over | legs / feet | kit | head and face |
|---|---|---|---|---|---|---|---|
| mechanic_0 | deep 3 | temple taper | work coveralls | wasteland duster | patched work pants / tall moto boots | scav tool belt, soot gloves | welder up |
| mechanic_1 | light 1 | temple taper | bone henley | soot trench | soot cargos / dust brown boots | soot tool belt, leather gloves, work suspenders | welder up |
| mechanic_2 | mid 1 | deep taper | rust henley | split-tail coat | dust trousers / field boots | scav tool belt, salvage satchel, soot gloves | welder up |
| runner_0 | light 3 | spring curls | hood-up coal hoodie | bone cocoon coat | drop rise trouser / grey sneakers | trailing scarf, hand wraps | face ash face wrap |
| runner_1 | deep 3 | half shave | layered jersey | ash asym coat | grey sweats / white sneakers | salvage satchel, soot hand wraps | face oxblood dust mask |
| runner_2 | mid 1 | static | coal hoodie | bone vest | black cargos / bone sneakers | oxblood satchel, hand wraps | face face wrap |
| runner_3 | deep 4 | curtain cut | charcoal turtleneck | leather jacket | bone drop trouser / coal mid boot | charcoal scarf, soot hand wraps | hat oxblood slouch beanie, face charcoal dust mask |
| runner_4 | deep 3 | heavy fringe | longline jersey | khaki jacket | charcoal crop trouser / ash slouch boot | dust scarf, ruck pack | hat charcoal watch cap, face rust dust mask |
| runner_5 | light 3 | heavy fringe | faded black longsleeve | hooded dust poncho | black denim / stacked sole boot | hand wraps, hip sash | face olive dust mask |
| runner_6 | mid 3 | half shave | ash longline tee | comma coat | dust trousers / wrapped boots | bone scarf, soot hand wraps | hat soot head wrap, face face wrap |
| runner_7 | light 3 | static | tattered tee | - | leather stack pant / grey sneakers | charcoal road cape, dust brown bandolier, hand wraps | hat sand knit cap, face charcoal dust mask |
| heavy_0 | light 0 | deep taper | work coveralls | quilted vest | slate work pants / field boots | scav kneepads, leather gloves | face rubber gas mask |
| heavy_1 | light 1 | dry taper | bone button-up | tactical vest | khaki cargos / tall moto boots | soot gloves, soot gorget | hat scrap helm |
| heavy_2 | mid 3 | dry taper | olive drab tee | leather vest | soot cargos / rust boots | steel shin guards, leather gloves | face shield visor |
| heavy_3 | light 2 | home clippers | dust plaid shirt | olive vest | bone work pants / charcoal boots | scrap pauldron, soot gloves | face ash shield |
| heavy_4 | light 0 | dry taper | faded black longsleeve | smith's apron | dust brown trousers / ranch boots | soot chest plate, leather gloves | hat dust work cap |
| heavy_5 | deep 3 | dry taper | rolled flannel | bone vest | olive pants / wrapped boots | spiked pauldron, oxblood gloves | hat soot head wrap, face grey wraparounds |


## 3. Looking at it (the cycles, each from the picture at 1:1 and x4)

* cycle 1, the Heavy: 2.8 cm bars read as wire and he stood no wider than a plain man: bars 4 cm, discs 8, a motor drum on
  each shoulder, a piston on each thigh. His HORSESHOE crown took the rig's up-face dust and a deep skin read as a pale
  egg: the Heavy wears short hair or the helm.
* cycle 1, the Mechanic: the olive coveralls and the brown work coat read as ONE (63 and 69 of 255), so THE OUTFIT put
  him in a pale barn coat to the hip. The coat is now LONG (the Rick Owens drape) and a value off what is under it: a
  sand duster on dark coveralls, a soot trench on a bone henley, a black split tail on a rust henley. The 2 cm cables
  read as a pencil line: 2.6 cm.
* cycle 1, the Runner: 7 mm cords broke into dots at 1:1 and, laid along the fist's own axis, the sling stuck out forward
  once he stood: it hangs along the forearm's line, the cords 1.2 cm, the pouch 7 cm.
* cycle 2, the Heavy: a ray cast down at the shoulder's x found the skull (the 1.2x head is 15 cm wide) and the two motor
  drums stood on his head like ears, the yoke over it: the drum sits on the joint, the yoke's top is measured from under
  the jaw.
* round 2 (10/25), the Runner 0 at 1:1: one hood-up hoodie and a face wrap read as ONE garment, not streetwear layers
  (rule 129(b)): the hood stays up and the Balenciaga oversize goes over it. The slate cocoon coat rendered a hot blue
  under the rig's cool fill (sampled (80, 96, 144) from a (70, 78, 89) source): the bone cocoon coat instead, pale over the
  black hood, the oxblood scarf over the coat. Every kid now wears a top under a coat, a vest, a jacket, a poncho or a cape.
* round 2, the Mechanic in the demo's fight: he stands 1.86 m with the mask flipped up (the ruler is 1.72), and the fight
  draws every man's bars at the ruler's height (Y - manH() - 9), so the bar sits on the top of his mask. The look is true
  (a welder's hood flipped up stands a hand over the head); the bar is COMBAT's (the NOTE: place it from the look's own
  height_m, which fight_rig.json carries).
* round 2, at the fight's pixels: the Mechanic's welding mask, the Runner's hood and wrap and the Heavy's gas mask all read
  on the face strip at 128 px (the bar and the turn row draw from it).
* round 2, THE OUTFIT REACHED FOR A RAINBOW (rule 159, root cause in this lane's tools/bohemia_character_the_outfit.py):
  when a top and its coat read as one value, the outfit swaps the top for "the same cut in another colour of the bank", and
  the bank still holds cobalt, teal, grass, rose and signal red. It put a COBALT SHIRT under the Heavy 4's smith's apron
  (rendered a bright cornflower body under the frame). Fixed at the source: contrast_pick never takes a loud cloth (a cool
  or pink hue at saturation 0.30 or more, or a saturated bright red or gold; earth, olive and every grey stay) unless it is
  the wearer's own gang's colour (COLOUR IS TERRITORY). Measured over RUN TWO's 152 and these 16: 6 of 168 change; it adds
  no loud piece anywhere (a man RUN TWO rolled in a loud top keeps it when nothing plain reads apart: RUN TWO's roll, its
  next rebuild). And the Heavy's own look cloth was a steel blue (76, 90, 106), which made cobalt "his gang's colour": a
  work-shirt drab (86, 80, 70) now.
* round 2, two kids whose layers read as one (the outfit's own note: "read as one, and no colour of either cut reads
  apart"): a black jersey under the ash asymmetric coat (48 and 70 of 255) and an ash longline under the black comma coat
  (70 and 55): a bone runway shirt under the ash coat, a sand hoodie under the black comma. The Heavy 4: a khaki button-up
  under the leather apron (black under it read as one, 48 and 69). All sixteen now wear two layers that read apart and no
  loud cloth (audited through the outfit, the list in the commit).

## 4. Sized to the map, and the sixth Heavy

The map's biggest party is 13 (records/target/bb/party_math.json, roaming and job max), a crew's 14. A kids' band is
round(14 x 0.6) = 8, every kid from the runner pool: eight Runners, every kid his own man. A heavies' band is round(14 x
0.45) = 6; today orc_young reads the old cast (the NOTE to COMBAT), and with it in the frame all six are Heavies, so a
sixth Heavy (a rolled brick flannel under a bone vest, a spiked pauldron, oxblood gloves, a soot head wrap and grey
wraparounds). The pack lost 434 to 1,075 pixels a sheet outside the reference cell over 200 cells (2 to 5 a cell, the
reach of a swing or the shield's corner), the same as RUN TWO's people in the same cells.

## 5. Checked in the demo's fight (rule 6: play it before you call it shipped)

The demo's own door (BOHEMIA_DEMO.html, nfOpen with a road party, the way the map hands one over; the one driver,
tools/bohemia_drive_the_demo.js), the fight read off its own state and shot from its camera on the phone profile:

| party | dealt | looks |
|---|---|---|
| machines 6 | the Mechanic and 4 machines | enemy_mechanic_0 |
| machines 13 | the Mechanic and 10 machines | enemy_mechanic_0 |
| kids 14 (x2) | 8 kids | 8 different Runners, both times |
| kids 16 (past the map's max) | 10 kids | 8 Runners, 2 repeat |
| heavies 12 | 2 Heavies, 3 orc_young | enemy_heavy_0, enemy_heavy_3; the young in the old cast |
| heavies 14 | 3 Heavies, 3 orc_young | enemy_heavy_0, 2, 3 (then 0, 4 at seed 3) |

0 page errors in every run. The picture: records/target/character/the_three_enemies/CHARACTER_THE_THREE_ENEMIES_IN_THE_DEMOS_FIGHT.webp
(the Mechanic with his robots; the kids; the Heavies with the plain young beside them). Before the pack the same bands
wore the old gang looks (the kids in the Colorful gang's greens and purples).

## 6. Handed on, by NOTE (each the owner's file)

* COMBAT: the Mechanic is dealt at band index 0, so always enemy_mechanic_0; orc_young has no look pool; every bar sits
  at the ruler's height, on the Mechanic's mask.
* ANIMATION: the enemies have no idles; EVERYBODY IDLES P1 is red on them (it exempts kind 'person', the rolled men
  rendered in batches, and these are the same kind of men under another name). The recipe is on its board. Not built
  here: ANIMATION was mid-round on slices/rig_idles and its gate (one system, one session).
* RUN TWO: the outfit's no-rainbow swap changes six of its 152 on its next rebuild.

## 7. Gates (rule 13: the pre-push pass, and which reds are this lane's)

Green: THE BESTIARY 10/0, ONE MAN ONE LOOK, TOOLS RUN 8/0, ONE SKIN ONE PERSON 15/0, THE ROLL CALL 8/0. Red and THIS
LANE'S: EVERYBODY IDLES P1 (the enemies' idles, handed to ANIMATION above). Red on clean main before this lane touched
them, not this lane's: NO TWO PEOPLE ALIKE (the crew screen leg), THE FACE IS HIS OWN FACE (the board's clients), PAGES
PUBLISH (the size, PLUMBER's), THE FIGHT READS ONLY SOURCED NUMBERS (typed numbers in the fight), REFERENCE CHECK and
REUSE-FIRST (other lanes' tools). THE REBUILT FIGHT PLAYS: 152 passed, 1 failed with all seventeen live and nothing else on the
box (the night 60-frame leg, 16 fps, red on main before); its two opening-camera legs went red once only while this
lane's renders held the CPU.
