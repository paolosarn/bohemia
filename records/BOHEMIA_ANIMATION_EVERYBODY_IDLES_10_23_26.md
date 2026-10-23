# [everybody idles] NOBODY STANDS LIKE A CHESS PIECE (ANIMATION, rule 130(a), 10/23/26)

PAOLO 10/23, LOCKED: "I think we need a lot of idle animations; right now everyone's standing still, making my brain
fry; it's looking like a chess man and I don't want that vibe at all."

## MEASURED FIRST: WHO STOOD STILL, AND HOW
Every screen with a person drew a standing man as ONE picture:
- THE FIGHT (COMBAT's file): a man waiting his turn was one cell, `stand`, or `carry` with a gun (one key each in
  slices/fight_rig). He turned to face the nearest foe; nothing else moved. A beast: its `stand` cell.
- THE SETTLEMENT (RUN TWO's file): every keeper and every man in the crowd was one render (CHARACTER's gang still), turned
  an eighth of a turn now and then on a beat. Its own comment said so: "The only standing pose made is the still, so
  nobody fakes a clip."
- THE CREW CARD (RUN TWO's file): one render of the man, mid-stride, painted once.
- THE MAP (RUN's file): a party at rest, a crowd at a place and HIM at rest were one still each (`set.idle`). The draw
  already reads a `breathe` list per facing, and nobody ever filled it for the 3D people.
Nobody breathed anywhere.

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): records/target/animation/BOHEMIA_EVERYBODY_IDLES.json. Every pose is a list of bone turns on
the rig's man (the skeleton every person in the game is built on, so one list fits every look and every act's wardrobe);
every clip is a list of HELD keys, three a beat at 120 (Crashbox stop-motion holds, rule 115(d)). An act-two re-render
is the same tool on the act-two models; nothing is drawn by hand.
- BARE (29 poses): breathing on the right leg and the left (out, half, in), standing square, look left and right,
  roll the shoulders (up, back, down), scratch the back of the head, stretch (arms out, up, a side bend), SMOKE (hand to
  the chest, to the mouth, the head back letting the smoke out: a cigarette in his hand and three grey puffs, modelled
  on bones of their own and shown only in those poses), lean (a hip out, a hand on it, a look), shift the strap.
- CARRY (19 poses, the gun held in both hands at the low ready, COMBAT's carry imported): breathing on each leg, look
  around, roll the shoulders, CHECK THE GUN (raised, turned one way then the other, his head down to it), shift the grip
  (the left hand off the fore-end to the strap and back). His gun is rendered in his hands on every one of them.
- BEAST (12 poses, the fox's skeleton every beast is built on): breathing, SNIFF (nose down, left, right), PANT (the
  chest heaving, the head up), SHAKE (a twist side to side through standing square), look about.
- MAP (10 poses, one picture a beat at a third the size): a breath on each leg, a look each way, a scratch, a smoke.
- THE FEET STAY PUT: after every pose the feet go back where they stood (a two-bone reach, knees forward), so a weight
  shift bends the free knee and nobody skates.
- THE TIMELINES: a SLOT is two bars (24 keys). A slot is one slow breath on one leg (the next slot the other; slow,
  short or a sigh, rolled per slot) or one of his idles; every slot ends standing square, so any slot follows any.
  AN ENVELOPE RAMPS SLOWER THAN THE GRID: a pose held one key sits between two different poses (a step on the way),
  and the two sides of a turn are never next to each other (the shake goes through standing square every time).

THE PLAYER: engine/bohemia_idles.js. One call per person per frame; nothing stored: his seed gives his offset (no two
in step), his four idles (one a habit he does twice as often), how often he fidgets (45 to 85 percent of his idle
slots). The slot he begins to stand in is always a breath, so a man who stops walking never lands mid-stretch.

THE PICTURES: tools/bohemia_animation_everybody_idles.py
- `fight` poses every man the fight dresses on COMBAT's own posed model (records/combat/rig/<look>.glb, its tool's
  `bodies`), renders him with COMBAT's render() over DIRECTION's master rig (imported and called, Stand first so the
  still, the scale and the box are the look's own), then COMBAT's guns tool on the carry idles (run with two changes in
  memory: the clip list, and IdleCarry held like Carry).
- `beasts` the same for the redone dire wolf, the cave hyena and the feral shepherd (Walk first, the beast's own still).
- `maps` rebuilds the map's OWN models with their own lanes' builders (CHARACTER's thirteen gangs and his body, the
  barber's three cuts, COOK THREE's three tiers), checks each rebuilt still against the picture the map already draws
  (silhouette and colour; a look that no longer matches keeps its still), then renders the map's ten.
- `pack` cuts every cell to what is drawn and packs them tight (a sheet per set: the fight loads only the gun-held
  poses, a town only the bare), in the colours of his own fight sheet (a man who stops walking keeps every colour he
  walked in), placed against the fight sheet's own cell by his feet.

## WHERE HE MEETS IT (no card, rule 127)
- THE FIGHT: every man waiting his turn breathes, shifts his weight, looks about, rolls his shoulders, checks his gun,
  shifts his grip (bare-handed: scratches, smokes, the strap); every beast breathes, sniffs, pants, shakes.
- THE SETTLEMENT: every keeper and every man in the crowd stays on his spot (rule 131(b)) and idles there; a keeper's
  trade leans his choice (the barber smokes, the bar leans, the lot scratches). They wear the same 3D man PORTRAIT made
  their talking head from (ONE ID, ONE WHOLE PERSON).
- THE CREW CARD: the man on his card stands there alive; a tap still turns him.
- THE MAP: him at rest, his two men, a party that stopped, a crowd at a place.

## THE BUG THE GATE FOUND IN MY OWN WORK (and what it cost)
The first render made the cigarette and the smoke separate RIGID parts on the hand and head bones. DIRECTION's master
rig anchors every SKINNED part to the nearest rigid part for its anti-boil HOLD, so his shoes were anchored to the
cigarette: when his head turned, the hold carried the shoes by the cigarette's inverse turn. Measured: the longcoat's
feet 3 px low on lookR facing S (the model itself never moved: its ankles read the same at every key). The gate's feet
leg (F1) caught it. Fix: the props are SKINNED to two bones of their own (prop_cigarette, prop_smoke), keyed tiny in
Stand and every pose that does not show them. Every man was rendered again; about 25 minutes of renders thrown away.

## THE SECOND BUG, ON THE REAL MAP
Looked at on the map itself (the demo, headless, his party at rest): he and his two men had NO HEADS. My map cells were
placed from the old render's `ground_px`, and CHARACTER's body was rendered before the master rig's round seven, when
`ground_px` was the look point, not the feet: 50 px off, so his head sat above the map's 112 frame and was cut. Fix:
the cells are placed on the full frame both renders share (the same model, still and camera, checked: the same res), never
on that field. Gate leg M3 (every map idle where its still is, soles 2 px, crown 6 px, every facing) and its mutation M4
(a cell 24 px high) now hold it.

## THE NUMBERS
- 28 men (the player, the twelve cast, the thirteen gangs, the thug and the poacher) x 48 poses x 8 facings, and 19 of
  those poses with each of three guns in his hands; 3 beasts x 12 x 8; 17 of the map's 20 people x 10 x 8.
- Rendered on this box at about 6.5 minutes a pair of men (two container restarts cost the in-flight looks, rerun).
- slices/rig_idles: 14 MB, 121 files. A man is about 2048 x 450 (bare) + 2048 x 330 (gun-held) + 1024 x 280 (guns);
  the fight loads only the gun-held sheet and the guns (about 3 MB decoded a man, against 18.5 for his fight sheet).
- A look's cells are a 22 KB json of its own; the index is 4 KB.
- 40 people over two minutes: no two share half their poses (the worst pair 46 percent, the median 9).
- THE MAP: 17 of 20 matched (silhouette 0.956 and up, colour step under 9 on the gangs); the job crew's three (the thug,
  the poacher: their rebuilt still is a new frame; the marksman: silhouette 0.61, his builder moved on) keep their stills.

## SHIP ONE (10/23, session two): ON MAIN, AND WHO IT REACHES TODAY
Rebased over about ninety commits (seven lanes). Two of them changed who stands on the screens: RUN TWO [no two people
alike] put 152 rolled people (each his own cut, face, skin, top and coat; all 152 rebuilt in CHARACTER's layers) in every
settlement's keepers and crowd and in the map's gang parties and crowds, and RUN TWO [the settlement is busy] made the
settlement draw its people in depth order. Measured on the real settlement after the rebase: 0 of 13 people idled at
Searchlight, 0 of 9 at Nelson, because every one of them is a rolled man and the idles were made for the cast and the
thirteen gang looks. So this first ship reaches: THE FIGHT (all 28 men and 3 beasts it dresses: the fight has no rolled
man yet), THE CREW CARD (the company), THE MAP (him at rest). The settlement's block now draws an idle in depth with the
walkers (it drew first and a walker could pass behind a man he should be in front of), and the men at the post each keep
their own offset (they shared one seed). The map bug of the record above (his head cut off) is the fix in 0f869a70; leg
M3 holds it.
THE ROLLED PEOPLE ARE NEXT, IN FLIGHT: each of the 152 built by RUN TWO's own build (run, never edited), the bare idles laid
on that model, rendered on the master rig at the street's own settings. Measured on person_blues_0: his Stand render
against the still the settlement draws, silhouette 1.000 and colour step 0.2 in all four facings checked: the same man.
Cost on this box: build 68 s, pose 17 s, render 240 pictures 3 min 51 s (11 CPU minutes).

## THE ROLLED PEOPLE (session two)
RUN TWO's 152 (each his own cut, face, skin, top and coat, all rebuilt in CHARACTER's layers) are every keeper, every man
in a town's crowd, every man at the post, and every man in a gang's party or a crowd on the map. Each is BUILT by RUN TWO's
own build (its tool run, never edited; its committed record of his height kept), the bare idles laid on that model as it
is (the street's still is its own Stand), RENDERED at the street's settings (24 samples, the same real height and camera),
and PACKED (`people_pack`): his own 64 colours, each cell in his render's full frame, `feet` facing by facing where his
still stands (the still's middle column and the row under its lowest painted pixel: the two numbers the settlement draws
the still by), and on the map his ten on RUN TWO's own map sheet's frame and colours (slices/rig_idles/map_<sheet>.webp,
map_people.json). A man whose Stand does not match the still the screens draw keeps his still (silhouette 0.98, colour 4).
The engine reads per-facing feet and the map's people; the map's block finds a rolled man's set on RIG_MIX's sheets; the
fight's block refuses a street-frame cell (a rolled man on the board keeps his still until his gun-held idles exist).
Cost on this box: about 12 CPU minutes a man (build 68 s, pose 17 s, 240 pictures), four at a time.

## THE WORK (rule 131, Paolo 10/23: 'characters you can't even interact with walking around the settlement, doing something,
## doing important things')
Each walker RUN TWO puts on a settlement's lanes has ONE JOB, seeded off his look inside his gang's leaning (the source's
work.by_gang: the caravans haul crates, the church sweeps, the homeless drag scrap, the gangs that hold ground stand guard,
the trades fix walls, everybody hauls batteries). He WALKS his lane carrying the job's thing, held, never swung (his 10/19
'weapons just swing with the hand'), and at each end of his round he WORKS it in a loop of whole beats:
- BATTERY: a car battery in both hands at his belt; at the stop he crouches, sets it on the ground and lifts it again.
- CRATE: a slatted crate against his chest; the same set-down and lift.
- HAMMER: the hammer hanging in his right hand; at the stop his left hand holds a board to the wall, his right lifts,
  winds up and drives the nail, THE BLOW ON THE BEAT (the gate holds it: a hammer a key early is caught).
- BROOM: carried brush-down; at the stop he sweeps the ground in front of him left, middle, right.
- SCRAP: a sheet of rusted tin dragged behind him by one hand, its far end on the ground; at the stop he leans back and tugs.
- GUARD: a rifle at the low ready in both hands; at the stop he looks down the street one way, then the other.
The props are models in the scene (a skinned bone each, placed in metres against his body; his hands REACH them, two-bone,
elbows down and back; a free arm keeps the walk's swing), lit by the one sun, grimed by the rig like everything else. The
work is written into RUN TWO's own walk sheet layout (`work_sheets`: his still, his walk, then the carrying walk and the
job's poses; 'walk' names the carrying walk, 'walk_plain' his own, 'work' the stop's loop three keys a beat), so RUN TWO's
screen plays it with no code: its busyAt already played 'work' columns at a stop. Measured on the real settlement: the
first battery hauler walks the street with it in his hands; RUN TWO's own gate THE SETTLEMENT IS BUSY 10/0 on the new sheet.
FOUND BY MY OWN GATE: the hammer's loop went from the follow-through straight back to the wind-up in one key (a jump and a
jump back); a lift pose sits between them now, and the blow still lands on the beat.

## THE FIGHT'S ROLLED MEN (session two, after RUN TWO put 51 on the board mid-round)
RUN TWO [no two people alike] shipped the fight and the hall while this round rendered: 51 rolled men on COMBAT's board,
each packed into his gang's cell by his ground pixel with his gang's guns. They arrived standing like chess pieces (the
fight's block refused their street-frame cells, by design). Each now has GUN-HELD idles: the carry set (COMBAT's low ready,
imported) laid on his own model, rendered at the street's settings, cut into his gang's cell by the same ground pixel, in
his fight sheet's colours with its one-pixel rim, and his gang's gun-held idle guns in his hands (the same skeleton, poses
and cell RUN TWO relied on for his gun sheet); his bare idles are his street sheet's very cells, moved into the fight cell
(no second picture). slices/rig_idles/fight_person_<id>.json; the fight's block reads 'fight_<look>' first. Looked at beside
his own fight sheet's carry cell: the same feet, the rifle in his hands, the gun checked in his idle.

## THE NUMBERS, END OF THE ROUND
- THE ROLLED PEOPLE: 150 of RUN TWO's 152 idle in the towns (keepers, crowd, the men at the post), on the crew card and on
  the map; the 2 left keep their still (below). 114 of the 116 walkers carry their job and work it at their stops.
  50 of the 51 fight men idle with their guns.
- THE CAST, THE GANGS, THE BEASTS (session one): the fight's 28 men and 3 beasts, the map's 17 own models.
- BYTES: slices/rig_idles 68 MB (539 files: a man's bare sheet about 220 KB, his map cells about 75 KB inside his map
  sheet's, a fight man's gun-held sheet about 150 KB), slices/rig_walk 16 MB (a walker's sheet about 150 KB with his work,
  was about 75). Every sheet is fetched only when a screen draws that man.
- RENDER: about 320 passes on this box's four cores (152 men's idles at 240 pictures each, 116 walkers' work at about 90,
  51 fight men's gun-held idles at 168), 07:04 to 20:30, shipped to main in batches about every hour, the gate green at
  every push.
- GATE: EVERYBODY IDLES 41/0 (S source, P pictures, C not a chess piece, F feet, M map, R rolled people, K work, X player,
  W wired and on the real fight, the real settlement and the real map).

## THE TWO WHO KEEP THEIR STILL, MEASURED
person_blues_1 and person_blues_4: built again from main (twice, the same result), their trousers come out darker than
the stills RUN TWO committed (colour step 6.4 and 6.8 against the 4 allowed; silhouette 0.999). CHARACTER's builder moved
after those two were rendered; an idle in other trousers would be a different man, so both keep RUN TWO's still and walk
sheet (the packer puts RUN TWO's own sheet back, byte for byte as its tool makes it). When RUN TWO renders them again, one
run of this tool gives them theirs. A NOTE on RUN TWO's board says so.

## A CONTAINER RESTART, AND WHAT IT COST
The container restarted once mid-batch (about 15:20). The renders, the venv and the queue files survived on disk; only the
running renders died (four men's in-flight pictures, rendered again). The queue was rebuilt from what each man still needed.

## [bb idles] HOW BATTLE BROTHERS DID IT
Battle Brothers spends its pictures on the HIT; a man between turns is essentially still, and on the map there is no
body at all (reference/library/battle_brothers/10_UI_AND_FEEL.md; records/BOHEMIA_BB_SCHOOL_WHERE_A_BODY_SPENDS_ITS_PICTURES_9_27_26.md).
Rule 33(g) on that same page: WHAT WE DO NOT COPY: the stills. So this is past Battle Brothers on purpose, his call
10/23. What we keep from it: the idles never travel (a man never leaves his tile or his spot), and the hit still owns
its own clip (an idle is only ever drawn while he stands).

## ANALOG HORROR LINE
Held keys, never tweened (the stop-motion Crashbox lesson); the smoke is grey matter in the scene, lit by the one sun,
not a filter; the cigarette's ember is the only warm point on a man.

## REFERENCE CHECK (the 9/4 standing duty)
The twin of every idle is the same man's own stand and carry cell on the fight's sheet, side by side at the fight's
pixels; general idle practice (a looping breath as the floor, a bigger movement now and then to break it, combat stances
breathing a little harder): [Vagrus devlog 25](https://lostpilgrims.itch.io/vagrus/devlog/110036/character-idle-animations),
[idle animation for games](https://mocaponline.com/blogs/mocap-news/idle-animation-game-dev-guide). No reference game added.

## GATE
gates/everybody_idles_gate.py (S the source, P the pictures, C not a chess piece in the pixels, F the feet, M the map
match and frame, X the shipped player under node, W wired on all four screens and on the real fight headless), six
mutations (a key short, a one-key turn, a man whose every idle is his still, a man sunk 4 px, a map cell 24 px high, twelve
people on one seed). 26 passed, 0 failed.

## NOT DONE, STATED
- person_blues_1 and person_blues_4 keep their stills (THE TWO WHO KEEP THEIR STILL above).
- The map's job crew (COOK THREE's thug, marksman, poacher on a job) keep their stills: the rebuilt models no longer
  match the map's pictures, and an idle that is a different man than the walk is worse than a still.
- The thug's base pose (COMBAT's Stand for a tier, the walk's passing pose) is mid-stride from the side; his idles keep
  that stance (the feet never move), so from the side he breathes in a stride. COMBAT's still, named on its board.
- The settlement's background people who WORK (rule 131(a)): built this session (THE WORK above). Not built: cooking and
  trading at a stall (they belong to a place's fixed things, a pot and a stall, not to a walker's hands).
