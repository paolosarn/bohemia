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
match, X the shipped player under node, W wired on all four screens and on the real fight headless), four mutations.

## NOT DONE, STATED
- RUN TWO's rolled people (BOHEMIA_RIG_MIX, [no two people alike], not on main yet): when they land, the settlement and
  the map can play their idles the same way: `pose` and the master rig on each rolled person, a NOTE on RUN TWO's board.
- The settlement's background people who WORK (rule 131(a)) are RUN TWO's [the settlement is busy]; the work clips are
  a separate ask (the coordinator's NOTE on this board).
