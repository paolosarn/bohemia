# THE NEW GUNS IN HIS HANDS (CHARACTER 3, 11/27/26; VAMILY rule 489(b), ask row 758, CHARACTER's part: the guns held and drawn)

Paolo 11/27: 'we haven't even added automatic guns or more intense guns, maybe even a rocket launcher'. ARMORY 3 built sixteen pieces
(records/BOHEMIA_ARMORY_THREE_THE_GUNS_GROW_UP_AND_THE_DRONE_11_27_26.md) and named what it owed this lane: 'in a man's hands every new
gun is drawn as its family's gun'. MEASURED on ARMORY 3's own card (records/target/armory/armory3_hands.jpg): the Ranch AR, the Guard
Carbine, the Kalash, the Night-Sight AR and the Belt-Fed SAW are one picture (the wood rifle); the box and pipe SMGs are the pistol;
the rocket launcher is the shotgun; the drones show nothing in his hands.

## WHAT READS AT THE FIGHT'S SIZE (57 px a metre: a rifle about 50 px long, 5 px tall)
The silhouette and one colour, never the detail. So each own model is built shape first at real size (tools/
bohemia_character_three_the_guns_held.py model, COOK's conventions: barrel +X, up +Z, the grip at the origin; COOK's material names
plus polymer, fde, olive, worn by the master rig's source pass like every gun):
- AR (an AR-15 pattern carbine): Ranch AR, Guard Carbine, Night-Sight AR. A straight magazine, a pistol grip, a thick handguard, a
  buffer-tube stock, an optic on the rail; the furniture flat dark earth (the ranch's tan): at the fight's size a rifle with TAN
  ends and a black middle, never the wood rifle.
- KALASH (an AK pattern rifle): the curved magazine in three steps, wood furniture with the stock's drop, the gas tube, a brake. At
  the fight's size it reads as a wood rifle with a hook under it; the curve is one or two pixels (said plainly: the least distinct).
- BOX SMG (a MAC-10 pattern): short and square, the magazine down the grip, a can on the barrel, a wire stock: the shortest gun on
  the board, black.
- BELT-FED (an M249 pattern): the olive ammo box under the receiver, the bipod folded forward, a carry handle, the long barrel: the
  longest rifle, heavy, an olive block under it.
- ROCKET (an RPG-7 pattern): the long tube, the warhead's cone, the wooden heat guard, two grips: a long pale olive tube, nothing
  else on the board looks like it.

## IN HIS HANDS
COMBAT's guns-in-hands render imported and never edited (tools/bohemia_combat_the_guns_in_their_hands.py: its GUNS and CLIPS swapped
in memory), on a man posed by COMBAT's fight poses and rendered by DIRECTION's master rig on the Carry and the Aim: the same camera,
light, box, hold and holdout every gun in the fight already has. The man is the powered-arm man under the vest
(records/BOHEMIA_CHARACTER_THREE_THE_POWERED_ARM_11_27_26.md), so his powered hand holds the fore-end. The rocket is held as the
long guns are (the grip in the right hand, the fore-end through the left), not on the shoulder: the hold is COMBAT's; a shoulder
hold for the tube is theirs to add.

## NOT IN THE GAME YET (the next steps, named)
1. The fight draws a gun by class from each look's gun sheet (<look>_guns.webp: pistol, rifle, shotgun). For each new gun to show,
   the gun sheet needs its blocks (the hands render on every look for these five models, about 40 s a look a gun on this box) and
   the fight needs the row's model (armory.json: a 'held' key naming ar, kalash, smg, saw or rocket; the fight's gun pick reads it
   before the class). COMBAT FIVE owns the pick; this lane or COOK SIX the renders over every look; ARMORY 3 the rows' key.
2. The drones' launch in the hand (ARMORY 3 draws the drone in the air; in his hands it is the bottles' throw).

## THE CARD
VOTE character3-the-new-guns-in-his-hands-11-27 (made from COOK's first guns off the rig): each gun in his hands, three turns aiming
and one carried at three times the fight's size, and at one to one. records/target/character/the_guns_held/.

[bb Battle Brothers tells a crossbow from a bow at a glance by its outline; ours tell an AR from a rocket the same way.]
[analog horror: a long tube in a man's hands at the far end of the street, and nobody on your side has seen one before.]
