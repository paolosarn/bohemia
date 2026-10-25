# [the PC playtest: the bodies' part] A PISTOL IN ONE HAND, AND COVER THAT LOOKS LIKE COVER (ANIMATION, rule 164, 10/25/26)

PAOLO 10/24 on his PC (rule 164, records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md):
- item 21: "if they're using pistols they shouldn't look like they're holding rifles."
- item 22: "when they're in a building they get extra cover stats... they shouldn't be standing up, they should look like
  they're in cover."
- item 31: more and better animations when people hold things.

## MEASURED FIRST
- THE PISTOL: COMBAT's poses tool (tools/bohemia_combat_the_fight_poses.py) says it in its own comment: "a pistol is held in
  two hands like the long gun (the modern stance): one clip, every gun". The fight sheet has ONE carry, ONE carry-walk and
  ONE aim, and the guns tool lays the pistol "in both hands at the belly" on them. So a man with a pistol stood, walked and
  fired in the long gun's two-handed poses, the pistol between his two fists at his belt buckle. Exactly his words.
- COVER: the fight knows cover only as a number (S.coverCount on the tile: a wall, a dead car, a shed, rubble, a barrier, a
  dumpster, a fence; coverDef() adds defence per piece). The man on that tile was drawn on the same stand cell as a man in
  the open. Nothing in any sheet kneels.
- WHO THE FIGHT DRAWS (the real fight, headless, seed 3): YOU are a named look; the rest of your company and nearly every man
  in the enemy band are RUN TWO's ROLLED men (person_town_*, person_<gang>_*), each his own body packed into his gang's cell
  with his gang's guns. So the rolled men are the main body of this job, not an extra: 51 of them, plus YOU, the thirteen
  gangs, the two tiers and the twelve cast, 79 in all.

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): records/target/animation/BOHEMIA_WHAT_A_MAN_HOLDS.json. Every clip a list of HELD keys (three a
beat at 120, Crashbox holds, rule 115(d)); every key a list of steps on the rig's man (the skeleton every person in the game
is built on, so one list fits every look and every act's wardrobe): bone turns, a wrist put on a point by a two-bone reach,
the feet planted, or a KNEEL (the gun side's knee and shin on the ground, the other foot a step forward, the pelvis dropped
exactly as far as the skeleton's own lengths put the knee on the floor; 'seat' sits him back toward his heel).

TEN CLIPS, 35 KEYS, EIGHT FACINGS:
- PIdle 7: the pistol in his right hand at the one-hand low ready (the forearm forward over the thigh, the muzzle forward
  and down); a breath; a look each way; the pistol brought up before his eyes, his left hand on the slide, turned; key 6 the
  half way up, so it never jumps from his thigh to his eyes.
- PCarryWalk 6: the walk's six keys with the pistol low in his right hand and his LEFT ARM SWINGING with the walk.
- PAim 3: one arm straight out at the eye, the body bladed, the left arm back; the kick lifts the wrist; the settle.
- PHit 2: the blow rocks him, the pistol kept in his right hand.
- CoverLong 3: down on one knee, sat back toward his heel, the long gun across him at COMBAT's low ready; a breath; a peek up.
- CoverLongAim 3: up on the knee, COMBAT's aim and kick over the cover.
- CoverPistol 3: on one knee, the pistol up at his chest, muzzle up, the left hand on the knee; a breath; a peek.
- CoverPistolAim 3: up on the knee, one arm out over the cover, the kick, the settle.
- CoverBare 3: a man with nothing in his hands ducks low on one knee, hands tucked in; a breath; a look.
- CoverHit 2: on the knee, rocked back, whatever he holds kept in his right hand.

HOW HE HOLDS STILL in a held clip (the source's timelines): slots of two bars (24 keys); an even slot is a breath, an odd one
of his idles, rolled off his own seed with the idles' own hash, so no two men move in step; every slot starts and ends on key
0, so any follows any.

THE TOOL: tools/bohemia_animation_what_a_man_holds.py.
- `pose` lays the ten clips on a man as ten actions beside every action his model came with.
- `fight_one LOOK` (a named look): COMBAT's posed model (rebuilt by its own `bodies` when missing), posed here, rendered by
  COMBAT's render() over DIRECTION's master rig (imported and called, Stand first so the box is the look's own), then
  COMBAT's guns tool run with changes made in memory: the clip list, which guns ride which clip, and how a one-hand pistol
  and a kneeling gun sit (the pistol's grip in the right fist along the forearm; at the eye along the straight arm).
- `person_one TAG` (a rolled man): RUN TWO's own build of him (its tool run, its committed records kept), posed here,
  rendered at the street's settings the way his fight sheet was; he holds his gang's guns.
- `all N`: everyone in the order the fight meets them: YOU, the gangs and tiers (whose guns the rolled men hold), the 51
  rolled men, then the cast.
- `pack`: slices/rig_hold/<look>.webp (every key and facing cut to what is drawn, shelf-packed), <look>_guns.webp (a named
  look's three guns), <look>.json (the cells, each placed from the look's fight-sheet cell by his feet; a rolled man's
  'guns' are his gang's), rig_hold.json (the clips, the guns, the timelines). The colours are the look's own fight sheet's.
  The index is never rebuilt from nothing (the renders live only in the container that made them).

THE FIGHT (COMBAT's file, ANIMATION's marked block __WHAT_A_MAN_HOLDS__, slices/BOHEMIA_FIGHT.html, and one hook line in
blitMan before the idles): a man whose gun is a pistol stands, walks, fires and is rocked in the one-hand clips; a man on a
tile with cover (S.coverCount) or on a roof kneels behind it, rises on the knee to fire over it, is rocked on the knee; a
man walking or dragged never kneels; his gun is laid in his hands on every key; the hit flash tints the held picture; at night
the held picture takes the fight's own night sheet. Until a man's pictures are in, the fight draws him exactly as before.

## THE GATE
gates/what_a_man_holds_gate.py, WHAT A MAN HOLDS: S the source (slots, flicker, the half key), P the pictures (every key and
facing, the guns, inside the sheet, his own colours), O ONE HAND (the pistol on his right side at rest; fired, out at arm's
length, a third of his height past his feet), F the feet standing, K COVER LOOKS LIKE COVER (on the ground; his crown a fifth
of his height lower at rest, a tenth when he rises to fire), W the real fight (the pistol man drawn in the held pistol clip;
a man stood on a cover tile drawn kneeling; no page error), and four mutations that must bite.

## THE BUGS I MADE AND CAUGHT
- The first back knee floated 33 cm off the ground (the two-bone pole pointed up, so the knee bent above the hip-to-ankle
  line): measured off the bones, fixed with the pole down.
- The first peek lifted the pelvis and took the kneeling knee off the floor with it: the peek is the torso and head now.
- The first gun pass died after two clips: the pistol's one-hand hold used Blender's vector type outside the function that
  imports it. The run said nothing (its output was thrown away); the guns step now keeps the error.
- The first rest pistol hung flat against his dark trousers and vanished at the fight's pixels: it is held forward at the
  one-hand low ready now, against the ground.
- The first kneel was a high kneel only 11 to 24 percent lower than standing; the resting kneel sits back toward his heel.

## REFERENCE CHECK
The compare law: the twin of every held clip is the same man's own carry, aim and stand cells on the fight sheet, side by
side at the fight's pixels (old carry, new rest, the check; old aim, new aim, the kick; the walk; the old rifle stand, the
rifle in cover, rising to fire, the pistol in cover, rising, bare, rocked). Analog horror AH-01, the held key. No reference
game (Battle Brothers' one-handed weapon held at the side is the study the row names).

## NOT DONE, SAID
- THE SHIELD: rule 149(b) wants YOU's car door in his off hand. The one-hand clips leave his left hand free for it, but no
  car door is modelled and the fight draws no shield; COMBAT's [what each hand holds shows] owns the shield's rules. The
  shield arm through the rig is this lane's next line when COMBAT asks for it.
- Melee weapons are not drawn in anybody's hands in the fight (only guns are, rule 120(a)); a man with a club in cover
  ducks bare-handed.
