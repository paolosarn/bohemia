# COOK [the fifty perk icons] (rule 252(c); line 179 of his list)
# SHIPPED 10/26 79250901, BUILT, NOT YET SEEN (rule 179): fifty icons in the rig's look; UI THREE's shared perk module draws them

## THE ASK
Rule 252, Paolo 10/26: 'I don't want a single perk without an icon, I need you to have icons for all the perks... I need to be able
to visualize it as well as what's written for it.' (c): 'the fifty remade in the Crashbox HBO look (115), each showing what the
perk does, reading at the crew card's size'. The row: 'swapped in through UI THREE's shared perk module'.

## MEASURED FIRST
The fifty are pen glyphs on a dark plate inside the fight only (BOHEMIA_FIGHT.html perkIcon, rule 67): gold strokes for what he
carries, blue for what he presses, flat lines with no light and no form; the crew screen, level-up, the hall and the shop show the
words alone (UI THREE's half of 252). Next to the rig's clay (the truck, the robot, the cart, the camp) they are another game.

## WHAT IS BUILT
tools/bohemia_cook_the_fifty_perk_icons_10_26_26.py (Blender's Python): each perk is a small model in metres, the THING that says
what it does, in the valley's skin:
  Fast Adaptation (row 1): a target with two misses and three steps up; Crippling Strikes (row 1): a snapped bone;
  Colossus (row 1): a big heart and a plus; Nine Lives (row 1): a cat with a taped ear;
  Bags and Belts (row 1): a belt with two pouches; Pathfinder (row 1): a boot over rough stones;
  Adrenaline (row 1, pressed): a shot of adrenaline and a bolt; Recover (row 1, pressed): a canteen;
  Student (row 1): an open notebook and a pencil; Executioner (row 2): a bloody axe;
  Bullseye (row 2): a target behind cover, hit dead centre; Dodge (row 2): a bullet passing a man;
  Fortified Mind (row 2): a brain held in steel; Resilient (row 2): a bandage roll with a red cross;
  Steel Brow (row 2): a steel helmet; Quick Hands (row 2): a pipe and a pistol swapping hands;
  Gifted (row 2): a gift box with a star; Backstabber (row 3): a knife in a back;
  Anticipation (row 3): an eye that sees the bullet coming; Shield Expert (row 3): a car door for a shield, a plus;
  Brawny (row 3): a flexed arm and a weight; Relentless (row 3): a stopwatch that keeps running;
  Rotation (row 3, pressed): two men trading places; Rally the Troops (row 3, pressed): a bullhorn;
  Taunt (row 3, pressed): a man with a target on his chest; Mace Mastery (row 4): a pipe;
  Flail Mastery (row 4): a chain and a spiked weight; Hammer Mastery (row 4): a sledgehammer; Axe Mastery (row 4): a hatchet;
  Cleaver Mastery (row 4): a bloody cleaver; Sword Mastery (row 4): a machete; Dagger Mastery (row 4): a knife, quicker;
  Polearm Mastery (row 4): a billhook on a long pole; Spear Mastery (row 4): a taped spear;
  Crossbow and Firearms Mastery (row 4): a scoped rifle; Bow Mastery (row 4): a bow and an arrow;
  Throwing Mastery (row 4): a lit molotov; Reach Advantage (row 5): a long blade and stacked steps;
  Overwhelm (row 5): three arrows coming down on one man; Lone Wolf (row 5): a wolf alone;
  Underdog (row 5): a small dog between two big shadows; Footwork (row 5, pressed): footsteps sliding out;
  Berserk (row 6): a skull with burning eyes; Head Hunter (row 6): a head in the crosshairs; Nimble (row 6): a feather;
  Battle Forged (row 6): a riveted chest plate; Fearsome (row 7): a gas mask; Duelist (row 7): one blade, one hand free;
  Killing Frenzy (row 7): a skull in a blood splash; Indomitable (row 7, pressed): a fist on an anvil.
Every model is put through DIRECTION's master rig (Cycles, the guide's sun and sky, the source pass, the family snap, the ring, the
contact shadow; no setting moved). Each model STANDS facing the camera like every prop the rig draws: the rig's 3/4 stretch shows
a standing face at its full height and a little of its top (the token's thickness), at the rig's 57 px a metre, each 1.4 m across
(80 px). The first round laid each model back to face the 45 degree camera: every front then read to the source pass as a face
looking up at the sky, dusted and bleached, and the heart came out pink; standing, the dust falls on its top edge and the reds read.
THE PLATE: a worn tag with light and form (lit from the upper left like everything the rig draws, a three pixel bevel, the grain),
its rim gold for what he carries and steel blue for what he presses (the fight's colours kept), the perk's row (1 to 7) in raised
dots at its foot. 96 x 96 px, drawn at the crew card's 24 to 32 points (three device pixels a point on his phone: the picture's own
pixels).

## SHIPPED
slices/perk_icons/<id>.png (fifty) and slices/perk_icons/perk_icons.json: each id {src, tier, pressed, shows (what the icon shows,
draft:true)}. The proof sheet (every icon at its own size and at 32 px): records/target/cook_perk_icons/the_fifty.jpg.

## MEASURED
- Fifty models through the rig, one run each, 7 to 40 s an icon; no setting moved on any run. Every body 1,678 colours or more
  (the fewest footwork's soles; fortified mind 7,185). The rig's card (sized for a sprite in the world, not a tag) calls 17 of 50
  BACK, mostly its colour floor and its 96 px long side, which an 80 px icon cannot meet.
- At 32 px (the crew card): every icon has 14 percent or more of its middle standing 45 values off the bare plate (a hammer's thin
  diagonal 14, a heart 60); no two alike (most alike the hatchet and the flail, 12.5 apart on average over the middle). The long
  weapons were turned apart for it: four diagonal sticks read as one at 32 px (the pipe mirrored, the spear steep with a broad leaf
  and a red rag, the machete laid nearly flat; the polearm keeps the diagonal).
- THE FIRST ROUND LAID EACH MODEL BACK to face the camera and the source pass dusted every front as a face looking at the sky: the
  heart came out pink, the target's rings rose; stood up, the reds read (the proof shows the second round).
- Gate EVERY PERK A PICTURE 5/0; it bites: a plate with its picture painted out (0 percent), a pressed perk's row marked carried,
  and one icon copied over another each failed it.

## THE GATE
EVERY PERK A PICTURE (gates/every_perk_a_picture_gate.py): every perk of perks.json has its picture, 96 x 96, a body on its plate,
its rig run with no break, its rim the right colour for carried or pressed, its row's dots; no two icons alike; every picture
reads at 32 px (its object stands off the plate).

## SAID PLAINLY
- NOT IN A TAB YET: UI THREE's shared perk module draws them (NOTE on its board: load slices/perk_icons/perk_icons.json, draw the
  picture where it has one, the pen glyph where it does not). Until then the fight's pen glyphs stand.
- The 'shows' lines are attempts (draft:true), the alt text and the words one tap away.

## REFERENCE CHECK (the 9/4 standing duty)
The twins are the rig's own props in the camp and the towns (one camera, one sun, one recipe) and the fight's fifty glyphs (the
same subject where the glyph had one: the pipe, the sledge, the hatchet, the cleaver, the blade, the bottle). Battle Brothers draws
a perk as a small painted square of the thing it gives (a heart for Colossus, a shield for Shield Expert); ours is that thing
modelled, in the valley's skin (the car door is the shield, the bullhorn the rally, the molotov the throw, the gas mask the fear).
No reference game added.
