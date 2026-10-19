# HAIR 2 AND FACES 1: THE WHOLE ENCHILADA ON THE 3D HEAD (CHARACTER, 10/19/26)

Row: CHARACTER [way more hair and faces] (rule 121(i) and (k)), opened by the coordinator (rule 112), session
character-hair-two. His words, 10/19, the nineteenth votes: "Need more way more facial customization hair options as
well" (on character-base-one-the-heavy-and-the-runway-10-19); "We need to add so much incredible amount more of
customixation to it" (on run-the-map-is-all-3d-10-19); "let's implement all the 3-D characters with all their assets
and different clothing and what's up with the fucking Chinese hats and the Weird hats on these people like give them
hairstyles... the whole enchilada" (on eyes-every-face-beside-its-body-10-19). Hair before hats.

## 1. WHAT THE 3D MAN HAD

Before this round the 3D head had eleven cuts (the barber's three, HAIR 1's eight, two of them held), one face (the
starred face at the default dials: every 3D head in the game is that face), PORTRAIT's three beard parts and stubble,
and PORTRAIT's three scars. RUN TWO's row measured the rest: the cast the map draws is thirteen looks, one per gang.

## 2. HAIR 2: TWELVE NEW CUTS

tools/bohemia_character_hair_two.py, called by the barber tool, built from HAIR 1's own kit (HAIR 1's helpers lifted into
kit() with no change to what they build), on PORTRAIT's starred head on the barber's mannequin, rendered through
DIRECTION's rig unedited. The method is HAIR 1's, which he said yes to: clumps of three sizes combed one way, locks that
hang and rest, ropes and plaits; what is new is the silhouette, twelve heads the game has never drawn, picked for a city
after the money died, where a haircut is what you can do with what you have:

| cut | what it is | colour (palette step) |
|---|---|---|
| RAZOR SKULL | shaved to the skin, a 1 mm stubble shadow dithered at three strengths, two shaving nicks scabbed | cloth_black 0 |
| HOME CLIPPERS | a buzz done at home: a blunt ragged neckline, one gouge too close on the right, five tufts missed at the back, a nick | clay_mustard 0 |
| HORSESHOE | the crown bald, a grey ring round the sides and back, thinning in stubble at its top edge | tape_grey 1 |
| COMB OVER | the horseshoe dyed black, seven strands across the bald crown from a low part, skin between them | cloth_black 1 |
| GREASE BACK | combed straight back from a high hairline, the temples receded, comb grooves front to back, ends flicked at the nape | cloth_black 1 |
| LONG DROP | straight, a centre part, one curtain resting on the shoulders and falling over the back to the shoulder blades, two face curtains | clay_mustard 1 |
| SPRING CURLS | ringlets, each a spiral of clay round its own hanging path, a curl over the brow | clay_rust 1 |
| STATIC | bed head: short tufts standing every way, flattened on the side he sleeps on | tape_masking 1 |
| HALF SHAVE | one side clippered to dark roots, the rest bleached and swept over the top to the jaw | clay_bone 2 |
| BOX BRAIDS | braids from parted sections, each a plait of crossing lenses, hanging past the shoulders | clay_mustard 1 |
| FINGER WAVES | pressed S-waves from a side part, a flat pin curl at each sideburn (the runway's) | cloth_black 1 |
| SCORCH | a short crop with a burn scar over the right ear where nothing grows back, waxy and mottled two ways | clay_mustard 0 |

THE GRAVEYARD, read before a single cut was drawn (A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME, gates/
bohemia_graveyard.txt): no crest (mohawk, liberty spikes, high top), no tie (ponytail, braided tail, top knot, low bun),
no mullet, no side part, no flat top, no pompadour, no chin bob, no afro by a volume dial. The round-4 slots these touch
(BUZZ CUT, SLICK BACK, LONG LOOSE, the curl slot) were killed for one render defect, the east and west facings, and the
tombstones say a fresh cook answers them once those facings render true; the rig renders all eight from one model.

WHAT LOOKING CHANGED (measured on the renders, not guessed):
- RAZOR SKULL cycle 1: the stubble came out blotched. The rig's wear reads a material as hair, skin or eye by its name
  (the guide's wear_by_material: hair 0.15, skin 0.25, eye 0); new materials without one of those words took the
  paint's full dust. Every new material here carries 'hair', 'skin' or 'eye' in its name.
- COMB OVER cycle 1: nine even strands on an even pitch read as a striped cap, the one-size-on-a-pitch tell his
  chain-mail note names; now seven, uneven widths and gaps, two that fall short.
- GREASE BACK cycle 1: on the natural hairline with an even shell it read as a black helmet with a fringe; now the
  hairline sits high with the temples receded, the comb's grooves run front to back at an uneven pitch and depth, and
  the black is a step lighter so the grooves can show.

- EVERY RENDER, cycle 1: the stills came out mid-stride and the portraits tilted, because the rig picks the standing
  still (the passing pose of Stand) only when the Stand clip is named; HAIR 1's approved renders were made with it and
  the first HAIR 2 pass was not. Measured on the rig.json: HAIR 1 'the passing pose of Stand, frame 1.02', HAIR 2 cycle 1
  'frame 0'. Everything re-rendered with --clip Stand:1, so every cut and face stands the way his YES'd cuts stand.
- FINGER WAVES, standing: the guide's light row (D3) read the W facing 'lit from below' by 3.7 values at cloth_black 0
  (black waves over the black tank: HAIR 1's HEAVY FRINGE case); a step up, GREASE BACK's cloth_black 1, passes 8 of 8.
- THE GUIDE'S FIRST FIVE (the NOT VIBE CODED gate's own checker, class person, light guide): 96 of 96 stills pass.

## 3. FACES 1: FACE SHAPES, FACIAL HAIR, MARKS

tools/bohemia_character_faces_one.py, the same way (a CUTS entry the barber's build reads like a haircut), every head
in the barber's TEMPLE TAPER (his UP):

- TWELVE FACE SHAPES from the face maker's fourteen dials that PORTRAIT put on the modelled skull (FACE_DIALS): LONG AND
  NARROW, BROAD AND SQUARE, ROUND, HEART, GAUNT, HEAVY BROW, HIGH DOME, WIDE SET, HAWK, SMALL FEATURES, LANTERN JAW,
  FLAT AND LOW. No new geometry: a face shape is a row of numbers, so the barber's sliders and the crowd's roll use the
  same table; the skull itself moves and the cut and the light follow it.
- ELEVEN KINDS OF FACIAL HAIR: PORTRAIT's FULL BEARD, MOUSTACHE, GOATEE and stubble, shown on the same man, and SEVEN NEW
  ONES: CHIN STRAP, MUTTON CHOPS, HORSESHOE MOUSTACHE, PENCIL MOUSTACHE, SOUL PATCH, PATCHY BEARD, LONG BEARD (its mass
  hangs in eleven locks from under the jaw to the chest, held off the body). Built PORTRAIT's way: the skull's own
  faces where it grows, lifted in tufts of hashed noise at two sizes; every vertex carries every shape key of the face.
  MEASURED: on the open-mouth key A the horseshoe moustache moves 52.6 mm and the long beard 52.7 mm against the head's
  own 57.3 mm, so the beard drops with the jaw when he talks. Cycle 1: the skull's faces are about 8 mm, so a pencil
  moustache was six blocks; now the region and two rings round it are cut finer (shape keys carried through the cut)
  and trimmed to the region on the fine faces (20 vertices became 150).
- EIGHT MARKS: PORTRAIT's BROW, CHEEK and LIP SCARS, and FIVE NEW ONES, what a city with no doctors leaves (rule
  121(k)): a BROKEN NOSE set crooked (the head's own vertices and every shape key moved: the lower nose 7 mm to one
  side, the bridge kinked forward), a CAULIFLOWER EAR (the right ear swollen in lumps), a STITCHED GASH across the brow
  with seven stitches of thread still in it, a CHEEK BURN healed waxy and mottled two ways, a CLOUDED EYE gone milky.

## 4. THE HAND-OFF TO RUN TWO [no two people alike]

- THE BARBER'S BOOK, records/target/character/BOHEMIA_THE_BARBERS_BOOK.json (tools/bohemia_character_the_barbers_book.py):
  every piece CHARACTER has made on the 3D man by kind, the name the barber's build takes, its renders, its card and
  his vote: the cuts, the face shapes with their dials, the facial hair, the marks, the 21 hats (which are in the random
  mix and which are not), the 14 face pieces, the hair colours with how often a crowd wears them, the skins (ONE SKIN's
  census mix of Clark County and its rig table).
- THE ROLL: `python3 tools/bohemia_character_the_barbers_book.py roll <Gang> <n> <out.json>` draws n people of a gang,
  seeded by id, no two alike (a repeat is re-drawn): his skin from the census mix, his cut (his gang's cuts weigh three
  times), a hair colour (grey with the balding cuts), a face shape, facial hair on about half, a mark on one in five, a
  hat on about one in eight and only over a short cut (never the cone hat, a wrap or the shemagh: his 10/19), a face
  piece on one in ten. Twenty Mob came out twenty different on the first twenty draws.
- A PERSON IS A BUILD: the barber's tool now takes a roll file (`build PEOPLE:<out.json>`) and builds each person on HIS
  OWN GANG'S BODY (CHARACTER's look for that gang, copied in memory) IN HIS OWN SKIN STEP, with his cut, face dials,
  facial hair, mark, hat and face piece on the same head bone; the book's how_to_build line gives the rig command with
  the walk clip the map draws, and RUN's bake packs the folders.

## 5. WHAT IS NOT DONE, SAID OUT LOUD

- Nothing here is in the demo or the alpha (rule 121(a): RUN TWO runs [no two people alike]; this lane hands over).
- The person build is proven on three rolled Reds (built and rendered, records/target/character/barber/person_reds_0..2);
  the crowd itself (twenty per gang, the walk clip, the bake, the map) is RUN TWO's row.
- A beard or mark on a dialled face is placed on the default face's measure (the mouth line, the jaw line) and rides the
  dials' warp after, within a few millimetres; the face shape card and the beards card each show one change at a time.

[bb Battle Brothers' barber picks a hair, a beard and a face from lists of painted layers, one picture per facing; ours
sculpts each on the one head bone, so it turns, walks and talks with the man, and the crowd rolls them so no two match.]
[analog horror: clay hair that still looks like clay, shaving nicks and a clipper gouge, a burn that never grew back, a
milky eye; the dust is on all of it, nothing glows.]
