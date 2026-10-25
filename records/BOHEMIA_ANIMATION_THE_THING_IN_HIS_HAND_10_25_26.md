# [the PC playtest: the bodies' part], THE NEXT LINE: THE THING IN HIS HAND AND THE SHIELD ARM (ANIMATION, rule 164 item 31, 10/25/26)

PAOLO 10/24 on his PC (rule 164 item 31, records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md): more and
better animations when people hold things. Rule 149(b): 'if I have a pistol in one hand and a car door as a shield in the
other, I should see that in the combat.' THE COORDINATOR'S ORDER 10/25, in this order: (1) melee weapons held right in the
hand (the club, the bat, the pipe, the knife, the poacher's hatchet): idle, walk, the swing, the hit taken; (2) the shield
arm: the car-door shield and the crash-bar shield carried and raised to block; (3) anything else a man holds that still reads
as the wrong pose. Through the rig; COMBAT plays them.

## MEASURED FIRST
Sixteen real fights (seeds 1 to 8, the strip and the road, headless, the shipped file): 360 men. 225 of them hold a melee or
thrown weapon (the bludgeon 50, the two-handed mallet 34, the woodcutter's axe 30, the goedendag 14, the shortsword 12, the
wooden stick 12, the pickaxe 12, the hatchet 11, the pitchfork 10, the three flails 21, the bundle of throwing axes 16, the
butcher's cleaver 6, the militia and boar spears 10, the morning star 4, the handaxe 2), and EVERY ONE was drawn with EMPTY
HANDS: the fight draws only guns (rule 120(a)); a man with a pipe stood, walked and swung bare-fisted. About 150 carry a
shield (the wooden shield, the car door, and the buckler); none was drawn.

MEASURED AGAIN on the shipped file mid-round (the same sixteen fights, 336 men): 142 carry a shield, none on the back. The
two commonest are the pipe and a car door (48: the bludgeon and the wooden shield) and THE PISTOL AND A CAR DOOR (32: the
dagger row is our pistol, ours.gun_classes, and it carries the wooden shield): rule 149(b)'s own words, a third of all the
shields. Every melee and shield row those men hold maps to a thing; the 48 light crossbows and 16 handgonnes are our rifle
and shotgun (COMBAT's guns). By look: YOU's crew 192 men (80 shields, 32 two-handers, town men 1, 2, 3, 6, 8, 11 among
them), the homeless 48 (20, 22), the anarchists 48 (18, 24), the thug tier 16 (10, 2), the mob 16 (8, 4), the reds 16
(6, 4): the render order follows them.

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json. THE TOOL:
tools/bohemia_animation_melee_in_hand.py. THE SHEETS: slices/rig_melee/<look>.webp (his own new keys), <look>_props.webp
(every thing in his hands, a named look's), <look>.json, rig_melee.json. THE DRAW: ANIMATION's marked block
__WHAT_A_MAN_HOLDS__ in COMBAT's slices/BOHEMIA_FIGHT.html (meleeDraw, asked first by holdDraw).

THE WAY IS THE GUNS' WAY (COMBAT's tool): every thing is MODELLED in Blender at its real size (the hafts drawn 1.35 times
their girth, so a 2 cm pipe is not one pixel at 57 px a metre), in the style palette's steps, through the master rig's
source pass, and rendered IN HIS FIST frame for frame with his body as a holdout (it goes behind him where he is in front of
it), stretched with him (the 3/4 cheat), only its own patch of the frame rendered (0.15 s a picture against 0.67 for his
body). His BODY is mostly what this lane already rendered: the one-hand low ready a club is carried in is the pistol's
(PIdle, PCarryWalk, PHit, CoverPistol, CoverHit), the swing is COMBAT's own (the club over the shoulder, the blow, the follow
through, on his fight sheet), a two-hander rides COMBAT's carry, carry-walk, aim and blow, and the long gun's kneel. The only
new body keys are the things only a melee man does.

THE PROPS
- one hand: the PIPE (the bludgeon; the thug's rusted pipe with its couplings), the CLUB (the wooden stick; a table leg),
  the BAT (the morning star; an ash bat with nails through the barrel), the CLEAVER (the butcher's cleaver), the MACHETE
  (the shortsword; the market's BLADE), the HATCHET (the hatchet and the handaxe; the poacher's), and in (3) the SPEAR
  (a sign post's pipe and a leaf of spring steel), the FLAIL (a handle, a chain that HANGS and trails the swing, a spiked
  ball), the PICK, the MOLOTOV (COOK's own bottle, its real size).
- two hands, in (3): the SLEDGE (the two-handed mallet), the FELLING AXE (the woodcutter's axe), the GOEDENDAG (a fence post
  banded with iron, a rail spike out of its end), the PITCHFORK.
- the shields, in (2): the CAR DOOR (the wooden shields: the door skin cut off below the window, faded teal, the crease, the
  handle, rust along the seam, bullet holes, the window channel's stubs), the CRASH BAR (the metal ones: CHARACTER's Heavy's
  crash bar rebuilt as a prop), the SIGN (the small round ones: reference/models/bohemia/stop_sign.glb's face off its post).

THE NEW KEYS
- MIdleX (5): the club TAPPED INTO HIS LEFT PALM (half, lifted, down on the palm) and LAID ON HIS SHOULDER (half, on it). The
  melee idle is the pistol's rest, breath and looks plus these; the tap slot taps three times on the beat's thirds, the
  shoulder slot holds a bar.
- the shield arm (2): SIdle 4, SWalk 6 (neither arm swings), SSwing 3 (COMBAT's swing turns on the right arm, the shield kept
  up), SAim 2 (the pistol out over the shield, never bladed), SBlock 2 (THE BLOCK: the shield up before his face, then rocked
  behind it), SCover 3 (on one knee, the shield planted on the ground before him), SCoverHit 1.
- two hands (3): T2Idle 6 (across him in both hands, a breath, a look each way, THE LEAN: its head set down before him and
  both hands stacked on the haft's end), T2Swing 3 (both hands over his right shoulder, brought down before him, followed
  through low to his left).

HOW THE FIGHT PLAYS THEM (meleeDraw): a man with a one-handed thing stands in MIdle (a breath, the looks, the tap, the
shoulder, each slot rolled off his own seed), walks in MWalk, swings in MSwing (a spear thrusts out along his arm, MThrust;
a Molotov goes overhand on the aim), is rocked in MHit, kneels in MCover on a cover tile or a roof. A man with a shield takes
the S clips with his weapon (a club or a pistol) in his right hand; a blow that lands is THE BLOCK; where his right side is
toward the glass the weapon is drawn over the shield, else the shield over it; a pistol man still reloads on his body (his
left hand leaves the shield for the magazine). A two-hander takes the T2 clips (the pitchfork thrusts on COMBAT's aim). A
rolled man's things are his gang's; a man whose own model carries his weapon (the thug's pipe, the poacher's hatchet) or his
shield (the Heavy's crash bar) is drawn without a second one. A row with no prop, or a man whose pictures are not in: as
before, never a man without what he holds.

COOK'S THINGS (rule 177(c), its [a model for every item] the same hours): COOK built its item models in this tool's frame (it
read build_shield, place_shield and place()), so a thing is rendered from reference/models/bohemia/item_<thing>.glb the moment
it is in the folder: the car door, the crash bar, the riot shield, the pipe and the sledge at the time of writing; the club,
the bat, the cleaver, the machete, the hatchet, the rebar spear, the chain, the bottles, the fire axe and the pole hook are
this tool's stand-ins until theirs land (exported for COOK as held_*.glb). Each man's pictures keep the bytes of the model they
were drawn from (props/models.json); a model that lands or changes is rendered again on the next pass. The 310 armoury rows
are read off COOK's table (records/target/cook_every_item/BOHEMIA_EVERY_ITEM_AND_ITS_MODEL.json: 62 one-handed rows, 25
two-handed, 19 shields), so the market's thing is the fight's thing. The stop sign stand-in went: COOK's table makes the
buckler a car door.

WHO HOLDS WHOSE THINGS (the render bill, measured: a named look's things are about 4,400 pictures at 0.55 s each, a rolled
man's own keys 320 pictures at about 2 s plus 6 to 10 minutes to rebuild his model; 0.45 s of every thing's picture is the
render's own start, samples and the frame's size barely move it, four things in one scene save nothing):
- every named look: its own first layer of things (the one-handed six).
- past the first layer, MEASURED: aligned at the feet, a look whose model renders at YOU's scale (1.101 to 1.110) holds
  his things within about a pixel (17 to 28 px of a thing's 88 differ, the order of a one-pixel shift of a thin haft), so
  eleven cast and nine gangs hold YOU's things there; a hat that makes a man taller makes him smaller in the frame (the
  wide brim 1.054 and the caravans 1.058: 105 and 110 px off), and the anarchists, the church and the network sit two
  pixels off (29 to 44), so they, YOU and the two tiers render their own. Every look has its own body keys.
- the 68 rolled men (RUN TWO's 51, CHARACTER's 17): their gang's things (YOU's for his town men), moved by the difference of
  their feet so the thing is in this man's fist; their own body keys once rendered; UNTIL THEN they stand on their held
  sheets (the pistol's low ready, walk, blow and kneel) with their gang's thing in the fist and the breath and the looks for
  idles, so every band holds its weapons from the first pass.

ONE SHEET A GROUP (rule 173, no crash before a fight): a man's own new keys are three sheets (m the melee idle's, s the shield
arm's, t the two-hander's) and a named look's things one sheet a layer (m1, m2, s1, s2, t2), none over 2048 by 1024; a man
with a pipe and no shield decodes the melee keys and the pipe's layer and nothing of the shield or the sledge. The gate holds it.

## THE BUGS I MADE AND CAUGHT
- The 3/4 stretch was folded into the prop's own world matrix: an object's location, rotation and scale cannot hold a
  shear, so a tilted haft lost it (the bat's swing tip off by up to 8 px against the exact way). The stretch is an empty the
  prop sits under now; the first layer's tilted keys (the swing, the tap and shoulder, the blow, the kneel) were rendered again.
- The first prop pass sampled the clip as if it had as many keys as the hold list, so the pistol's seven-key idle was read at
  four points and the pipe in the look-left key was the check key's (floating at his eye): the keys are read off the clip's
  own frame range now.
- The cleaver and the hatchet laid back on the shoulder went behind a collar, a hood or a fur hat (hidden in 3 to 5 facings on
  the blues, the caravans, the church): they are held up beside his head on that key; the cleaver's tap is the flat lifted.
- A machete's tip showed as a three-pixel speck over a hat facing away: a prop picture under eight pixels is no prop.
- The stop sign came with its street-name blades and its bent bracket: only its face is kept.
- The first block raised the shield 4 px (the hand at the shoulder reads as the chest from the 45 degree camera): the hand is
  above the shoulder and the shield's middle by it.
- The gate's first 'planted' leg read the shield's near end as sunk: a thing standing on the ground nearer the camera sits
  lower on the glass by half its width across the 45 degree ground; the leg allows exactly that.

## REFERENCE CHECK
The compare law: the twin of every held key is the same man's own fight sheet cell and the market icon of the same thing
(slices/market_icons: w_pipe, w_machete, w_cleaver, w_axe, w_sledge, w_spear, w_pole, w_chain, w_bottles), side by side at
the fight's pixels. Analog horror AH-01, the held key. Battle Brothers' sprites carry the weapon in the hand on every pose and
the shield on the arm (the study the row names); no other reference.
