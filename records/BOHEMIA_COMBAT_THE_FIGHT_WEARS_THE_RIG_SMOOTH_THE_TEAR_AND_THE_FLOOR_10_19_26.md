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

THE GUN IS HELD, NEVER SWUNG (the nineteenth votes, mid-round, his YES on COOK THREE's leader with 'I don't like how the
weapons just swing with the hand like some dumbass shit'; the coordinator's note on this row: a gun is held and aimed, a
two-hander gripped in both hands, never swinging loose with the arm). MEASURED on the first pack: the rifle hung from his
right hand and swung through the whole walk (the rig's walk swings both arms), and the pistol pointed at the ground from
one hand. BUILT: two more clips on the same skeleton, CARRY (the stand) and CARRYWALK (the walk's six keys, every bone the
walk's but the two arms): the right hand on the grip at the belly, the left under the fore-end a hand's span ahead
(measured on the apron man: the wrists 17 cm apart, the line 30 degrees across him and 6 down); the guns rendered on them
(the long gun from the right hand through the left, the pistol in both at the belly, muzzle down). A man with a gun stands
and walks in the carry; his legs walk, the gun does not move. And EVERY GUN IS A CLUB AT ONE (ours.gun_club): the first
pack had the gun vanish in the swing; it is rendered in his fist along his forearm through the three keys of the blow.
COOK THREE's thug and poacher have no Stand (their still is the walk's passing pose, the arms mid-swing: one wrist 33 cm
ahead of him, the other 28 behind), so every clip laid on them came out lopsided (the thug aimed with one arm); their arms
now rest at the walk's mean over the whole cycle before any clip is laid, and both were rendered again.

HIS SIZE STAYS (the nineteenth votes: NO, no words, on 'THE PEOPLE A LITTLE SMALLER: 104, 92 OR 84'; the coordinator: the
men keep today's size): no size card. The man is 98 points on his phone, the whole-pixel size between the 104 and the 92
(three phone pixels to the rig's pixel; 92 would be 2.8, every pixel a different width).

THE PACK: one sheet a look (slices/fight_rig/<look>.webp, 8 rows x 25 keys for a man and 18 for a beast, the one-pixel
dark day rim in its pixels, 64 colours a sheet, lossless), the guns beside it (<look>_guns.webp), PORTRAIT's faces on one
sheet (faces.webp, 128 px, lossy at 85), the index fight_rig.json. A fight loads only the looks its men wear.

THE BYTES, MEASURED ON A SLOW LINE (SOUNDS' card, the guns heard, plays the real fight at 1.6 Mbps): with the first pack
(256 colours, the faces lossless, every sheet awaited) a fight fetched 7.8 MB and started at 54 s against 20 s before;
its gate heard no shot in its thirty seconds. Three changes: 64 colours a sheet (31% fewer bytes; a lossy sheet would be
half, but it put colour into the dark rim, chroma 45 where the fringe leg allows 24); the faces lossy (325 KB to 68); and
the fight waits for its ground only, then gives the men three seconds more (MEN_GRACE): on a fast line they are all in by
then, on a slow one a man still coming is drawn the frame his sheet lands, and a gun lands in his hands the same way. The
floor's blocks are the ground's own noise (fewer colours took 573 KB to 548): left as they are.

IN THE FIGHT (slices/BOHEMIA_FIGHT.html): every man and beast is drawn from his rig sheet; the old flat sheets are not
loaded (rule 121(e)); the row is his facing (eight, toward the man he faces, toward where he walks, toward whom he
shoots or who hit him; he TURNS through the facings between, a twelfth of a beat each, never snaps); the column is the
clip's key on the beat; the faces in the turn strip and the bar are PORTRAIT's fresh portraits of the same model; the man
is drawn at a WHOLE number of phone pixels to the rig's pixel (rule 114a), 3 on his phone: 98 points, the rig's own ruler
(98 px = 1.72 m); on the flipped phone the whole size under the cap that keeps both teams on the glass, and where that
would be under half of him (33 points) the cap itself, the one place a rig pixel is not whole. The thug and poacher bands lead with COOK
THREE's own thug and poacher (ours.people_looks); the wolves wear the redone dire wolf, the hyenas the cave hyena, the war
dogs the feral shepherd (ours.beast_rig_looks). Each sheet is held as an ImageBitmap (measured: a man drawn from a canvas
cost 14 ms a frame on the phone profile, the source copied every draw).

## 2. [smooth]

MEASURED FIRST (rule 12), tools/bohemia_combat_smooth_measure.js, the one driver on his phone's profile (390 x 844 at 3x),
the same AUTO fight (seed 5, suburb, speed 1), every frame's time from the page's own requestAnimationFrame, and the
DEAD time: every stretch where nothing on the board moves (no walk, no clip, no camera, no number rising) that is not the
open's hold. WHERE THE FIFTH GRADER WAS, read from the code and the clock:
- a move was a HOP PER TILE: each step its own animation, a quarter of a beat, linear, with a stop at every tile;
- after any act by a man he does not move, the board HELD TWO MORE BEATS (ACT_BEATS 2, VIA GROK 10/9 'the turns are too
  short') on top of the act's own length, with the men standing still: 35 stills over half a second in a minute;
- every NOTE (a death, a reload, a skill, a held line) took the same half beat whether there was anything to see or not;
- a camera glide HELD THE TURN until it landed, every time, even when every man was already on the glass;
- a glide cut in half restarted from rest (the camera jerked to a stop and pulled away again);
- the flat sheets were drawn through a canvas source each frame (14 ms of a frame's budget on the phone profile).

WHAT CHANGED (slices/BOHEMIA_FIGHT.html):
- A WALK IS ONE MOVE: the steps of one order merge into one walk down the whole path, eased in and out with a cosine,
  half a beat a tile (TILE_BEATS); the footfalls and the high ground fire as he crosses each tile, not as separate acts.
- THE CLIPS PLAY BACK TO BACK: the next act starts on the next quarter-beat line after an eighth-of-a-beat breath
  (BREATH_BEATS, onBeat), never two beats of men standing still. A TURN YOU CAN STILL READ (GROK's 10/9 note kept): the
  acts are as far apart as before or further (a walk, a shot and a fall are each longer now), but the time between them
  is the men moving, never the board waiting; the gate's leg says both (an act at least 0.6 of a beat after the last, a
  still at most three-eighths of a beat).
- EVERY NOTE IS ITS OWN LENGTH (NOTE_BEATS): a death or a man down a beat (the fall plays whole), a skill or a rally
  half, a reload or a held line a quarter, a morale or injury tick nothing; an enemy's fall nobody saw takes no time.
- THE SHOT SOUNDS ON THE KICK: the shot and the swing land 0.35 of a beat into the clip, where the gun kicks.
- THE CAMERA EASES AND ONLY HOLDS WHEN IT MUST: a glide holds the turn only when a man is off the glass; a glide cut
  in half carries its speed into the next (ease-out, never from rest); following a man is a three-quarter-beat glide.
- HE TURNS: a man turns through the facings between, a twelfth of a beat each, never snaps (section 1).
- THE MEN ARE IMAGEBITMAPS: the rig sheets are held decoded, a man costs about 5 ms of a frame on the phone profile
  where the flat sheets cost 12 to 14.

WHAT IT BROKE AND WHAT WAS MENDED: SOUNDS' real-shoes page (slices/BOHEMIA_THE_STEP_IN_THE_FIGHT_10_18_26.html) heard
the fight's steps by hooking startAnim, one step animation a tile; a walk being one move, it heard one footfall a walk and
never choked a step (FIGHT STEPS: 0 choked). The fight now tells each tile crossed through footfall(man, tile), and the
page hooks that (a fight from before still works through startAnim): 34/0, 23 choked, 0 overlaps. SOUNDS' guns page
(slices/BOHEMIA_THE_GUNS_HEARD_10_19_26.html) read the pistol's class where the last round's pistol shot no longer keeps
it (it shoots as a thrown row, its own class in weapon.of): the card's fight played the pistol as a swing; it reads
weapon.of now and the pistol is heard as a pistol: THE GUNS HEARD 33/0 (30/3 on this round's first pack: the pistol leg red since the last round, the two thirty-second legs this round's bytes).

THE NUMBERS (records/target/combat/BOHEMIA_COMBAT_SMOOTH_*.json; this box renders in software, no GPU, so the frame
rate is a floor, not his phone; the pauses are the game's own and read the same anywhere):
SMOOTH_NUMBERS

## 3. [the tear and the floor]

THE TEAR: ANIMATION's module (slices/vote/ANIMATION_THE_AURA.js, his YES on B) laid over the man you control (yours, your
turn, not on AUTO, not fleeing), the fight only, in the 112 box it was tuned on at his art pixel; the demo shows it only
inside its fights, never on the map (the aura gate's leg 7 amended to his YES: the fight loads the tear and nothing else).

THE FLOOR THE 3D WAY: tools/bohemia_combat_the_floor_the_3d_way.py models COOK TWO's eight grounds (caliche, desert,
rough, playa, track, concrete, asphalt, lawn) as ground: 1.5 m concrete slabs with their joints, each its own millimetres
of height and tilt; stones on the dirt as stones; the playa's dried plates; the asphalt's aggregate; rendered through
DIRECTION's light and film (the one sun, the fill, matte) by the rig's camera at the fight ground's own scale (42.9 px a
metre, depth x cos45), the source pass's steps at the guide's numbers laid on a 4-D torus and the stones copied round
the edge so a ground TILES at 12 m (one house tile, 515 x 364 px): each block rolls it by its own offset and no seam
shows. Calibrated twice so the lit ground's median lands on the tan of his tile (COOK TWO's YES valley tans). Then COOK
TWO's re-lay, imported as it is, lays it: COMBAT TWO's block maker run twice, every ground pixel at the darkness its maker
gave it (a house's shadow), every non-ground pixel kept. SHIPPED: the 32 outdoor blocks (slices/fight_ground/block_*.webp),
only the re-laid pixels held to 96 colours (the first lay, every pixel at full colour, made the blocks four times the
bytes: 36 MB); 9.9 MB before, 17.6 MB after; a fight loads one block.

COOK runs [the floor through the rig] from 10/19 (rule 121(j)) and hands the fight its next floor: the materials folder
(records/target/combat/floor3d/materials) is the handover's shape, and `lay` then `ship` put any set of 12 m grounds in
every block; a NOTE on COOK's board says so. COOK TWO's and COMBAT TWO's files were used while they are paused (rule 121),
said on both boards.
