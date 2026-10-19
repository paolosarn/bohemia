# COMBAT, THE WORK WEEK ROUND (rule 121): THE FIGHT WEARS THE 3D MODELS, SMOOTH, THE TEAR AND THE FLOOR (10/19/26)

Opened by the coordinator (rules 112, 116, 121), Opus 5.5 at Extra; three rows in his order:
[the fight wears the 3D models], [smooth], [the tear and the floor].

## His words (records/BOHEMIA_PAOLO_THE_WORK_WEEK_FOUR_LANES_AND_THE_3D_MODELS_IN_10_19_26.md)
"We have to do a full implementation of the 3D models, so that's top priority. Combat is still not smooth, it still
sucks. It looks like it's been coded by a fifth grader." / "BRO EVERYTHING IS A 3D MODEL NOW FUCK THE UGLY 8 BIT SHIT...
WTF TRYING TO COMBINE THE TWO" / on the aura: "combat only... I'm fucking with the tear" / the fight floor: NO again,
"looks like shit".

## 1. [the fight wears the 3D models]

MEASURED FIRST (rule 12): the fight drew every man from slices/fight_people, 26 looks baked 10/4 from the alpha's flat
112 rig, TWO facings (SE, SW), a 64 px painted face; its beast was ANIMATION's flat dire wolf, two facings. The rig
models of the same 26 people already existed (PORTRAIT's bodies, records/portrait/rig/crew/bodies, built by CHARACTER's
tool in each person's one skin) with PORTRAIT's fresh portraits of the same models; COOK THREE's thug and poacher with
PORTRAIT's head on their own bodies; ANIMATION's redone dire wolf, cave hyena and feral dogs; COOK's guns. None were in
the fight.

WHAT EXISTED AND WHAT DID NOT: the rig's man (CesiumMan) carries two clips, Stand and the walk. The fight needs the gun
up, the swing, the blow landing and the fall. tools/bohemia_combat_the_fight_poses.py POSES THE SAME SKELETON (no vertex
touched, nothing drawn) into four held clips, the keys exact at the master rig's sample frames (Crashbox: held poses):
Aim 3 (up, the kick, the settle; a pistol in two hands, the modern stance), Swing 3, Hit 2, Fall 3 (the knees go, he
tips over his heels, he lies on his back); a beast's Hit 2 and Fall 3 in the world's axes (it rolls onto its flank).

THE RENDER: tools/bohemia_combat_the_fight_wears_the_rig.py runs DIRECTION's master rig AS WRITTEN with three changes
made in memory and recorded in slices/fight_rig/fight_rig.json (render_changes): the movers' light pass not rendered,
Cycles keeps its scene between renders, samples 24 and the 2.5 cm dents off (both --set, breaks in each rig.json).
MEASURED: the dents subdivide every mesh sixteen times; with them a look took 11 minutes on this box, without them 40
seconds; side by side at the sprite's own pixels (records/target/combat/rig, the apron man, still and gun-up, 4x) the two
read the same. 30 looks rendered: the player, the twelve cast and the bedroll, the thirteen gangs, the thug and the
poacher, the dire wolf, the cave hyena and the feral shepherd; eight facings each; stand, the six-key walk, the four new
clips (a beast: its own walk and six-key bite, the blow, the fall).

THE GUNS: tools/bohemia_combat_the_guns_in_their_hands.py renders COOK's pistol, rifle and shotgun IN EACH MAN'S HANDS,
frame for frame with his body (the same keys, camera, sun and box read back from his rig.json) with HIS BODY AS A HOLDOUT,
so the gun laid over his sheet sits in his hand and goes behind him where he is in front of it: carried at the low ready,
up at the shoulder level in both hands when he shoots; never in the swing (the butt is a club) or the fall. The fight
picks the block by his weapon (a dagger-class sidearm the pistol, a crossbow-class long gun the rifle, the handgonne the
shotgun).

THE PACK: one sheet a look (slices/fight_rig/<look>.webp, 8 rows x 18 keys, the one-pixel dark day rim in its pixels,
256 colours a sheet), the guns beside it (<look>_guns.webp), PORTRAIT's faces on one sheet (faces.webp, 128 px), the
index fight_rig.json. A fight loads only the looks its men wear.

IN THE FIGHT (slices/BOHEMIA_FIGHT.html): every man and beast is drawn from his rig sheet; the old flat sheets are not
loaded (rule 121(e)); the row is his facing (eight, toward the man he faces, toward where he walks, toward whom he
shoots or who hit him; he TURNS through the facings between, a twelfth of a beat each, never snaps); the column is the
clip's key on the beat; the faces in the turn strip and the bar are PORTRAIT's fresh portraits of the same model; the man
is drawn at a WHOLE number of phone pixels to the rig's pixel (rule 114a), 3 on his phone: 98 points, the rig's own ruler
(98 px = 1.72 m), the nearest whole size to his 'a little smaller' (92). The thug and poacher bands lead with COOK
THREE's own thug and poacher (ours.people_looks); the wolves wear the redone dire wolf, the hyenas the cave hyena, the war
dogs the feral shepherd (ours.beast_rig_looks). Each sheet is held as an ImageBitmap (measured: a man drawn from a canvas
cost 14 ms a frame on the phone profile, the source copied every draw).

## 2. [smooth]

(numbers below, from tools/bohemia_combat_smooth_measure.js)

## 3. [the tear and the floor]

THE TEAR: ANIMATION's module (slices/vote/ANIMATION_THE_AURA.js, his YES on B) laid over the man you control (yours, your
turn, not on AUTO, not fleeing), the fight only, in the 112 box it was tuned on at his art pixel; never on the map, the
demo or the alpha (the aura gate's leg 7 amended to his YES).

THE FLOOR THE 3D WAY: tools/bohemia_combat_the_floor_the_3d_way.py models COOK TWO's eight grounds (caliche, desert,
rough, playa, track, concrete, asphalt, lawn) as ground: 1.5 m concrete slabs with their joints, each its own millimetres
of height and tilt; stones on the dirt as stones; the playa's dried plates; the asphalt's aggregate; rendered through
DIRECTION's light and film (the one sun, the fill, matte) by the rig's camera at the fight ground's own scale (42.9 px a
metre, depth x cos45), the source pass's steps at the guide's numbers laid on a 4-D torus so a patch TILES at 60 m (one
block): each block takes its own shifted window with no seam. Calibrated twice so the lit ground's median lands on the tan
of his tile (COOK TWO's YES valley tans). Then COOK TWO's re-lay, imported as it is, lays it: COMBAT TWO's block maker run
twice, every ground pixel at the darkness its maker gave it (a house's shadow), every non-ground pixel kept.
