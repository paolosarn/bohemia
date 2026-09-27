# THE CELL IS THE STEP -- COOK [cell tiles] round 1 (9/27/26)
# Rule 34 (Paolo 9/27, LOCKED): TWO SCALES, ONE GAME. laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md
# Tool: tools/bohemia_the_cell_is_the_step_cook_9_27_26.py
# Bank: banks/BOHEMIA_THE_CELL_TILES_9_27_26.txt  Card: slices/vote/COOK_THE_CELL_IS_THE_STEP.png

## THE ONE SENTENCE
His approved bank was already drawn at 0.75 m a cell, and rule 34's own word for what happens
to it is CUT, so these cells are HIS PIXELS at 32 px instead of 44, not a re-cook.

## 1. THE HEADLINE MEASUREMENT: NOTHING ABOUT HIS SCALE WAS EVER WRONG
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, the 42 tiles he approved on 7/28
("I checked it to do the other 41 mark it approved"), declares `cell_px: 44` and, in its own
method, "1 px = 1.7 cm, because CELL_M = 0.75". A cell is three quarters of a metre. That is a
human step, which is exactly what rule 34 asks for. The tile bank did not need rethinking; only
the glass size changed, 32 instead of 44, and at 32 a pixel is 2.3 cm.

And rule 34 section 6 says it in one word: the tile banks, "cut to cell size". CUT.

## 2. THE FIRST CUT OF THIS ROUND WAS WRONG AND THE BANK ITSELF SAID SO
Round one's first attempt RE-AUTHORED all nine cells from scratch at 32, out of the approved
ramps, by the approved method. Every guard was green. It was still a violation, and the file it
was reading said why.

The bank tags each of its 42 tiles `authored` or `redrawn`, and its method block says of the
second kind, verbatim: **"Paolo DREW these. His drawing is approved content and I do not get to
redraw it. They get the craft operation only."** Measured: `walk_0/1/2`, `walk_kerb`, `yard_0/1/2`,
`dirt`, `concrete_0/1`, `wall_0/1/2`, `door_top`, `door_bottom` are ALL in the redrawn half. Only
the three road tiles are authored. So the first attempt redrew his drawings and called it a cook.

THE CORRECTION: nothing in this round is re-authored. Five cells are his tile cut 44 -> 32 and
nothing else. Four are his MATERIAL cut, plus the one edge the overhead camera makes.

## 3. THE CUT LOSES NOTHING, MEASURED
Nearest 44 -> 32 keeps 8 of every 11 rows. On chunky hand-made material that thins a crack and
never breaks one. Measured on every source tile used: **every distinct colour of every tile
survives the cut** (a check that refuses the run). His weed cracks, his kerb lip, his gravel
speckle, his per-tile sun offset, all of it, at the new size. The tool also refuses if a cut
tile carries a colour the source did not, which nearest cannot do but a smooth filter would.

The blur worry on the record ("never 44 at 67, that 1.523 scale IS the blur") was about
UPSCALING with a fractional factor and about smooth filters. Neither applies to a nearest
DOWNSCALE of authored material, and the measurement says so rather than the head comment.

## 4. WHAT IS DRAWN, AND WHY IT IS NOT A THIRD STYLE
The 7/28 bank is a STREET IN ELEVATION: a ground band you look across, and a building band
standing up behind it (`grid: [11,24]`, `ground` 24 long, `struct` 24 long). Rule 34's close grid
looks DOWN. So `wall_0` is a wall's FACE and the close grid needs a wall's CAP, and there is no
source for a cap at any scale, because the camera changed what the cell contains, not the art.

Four cells are therefore drawn: WALL, DOOR, MOUND, and the heap's placement. Each takes his own
material (his stucco, his dirt, his door's own gap black and lit threshold, lifted off
`door_bottom` by value) and adds only the derived edge: cap lit on the north-west, face shaded on
the south-east. DIRECTION 9/27 asked for exactly this distinction -- "identity or honest re-draw,
never a third style" -- and the card labels every cell CUT or DRAWN so he can see which is which.

## 5. WHAT THE MEASURING FOUND (four findings, all on the card)

### 5a. THE DENSITY FLOOR WAS NOT SCALE-FREE, AND I NEARLY SHIPPED UNDER IT
THE GROUND RULER (DIRECTION 9/23) is 2.07 colours per thousand pixels for ground, 1.55 for wall.
Those were measured on 44 px tiles. 2.07/kpx x 1936 px = **FOUR distinct colours**; 1.55 = THREE.
A 32 px cell is 1024 px, so the same four colours read **3.91/kpx**.

Round one's first cut checked 32 px cells against the 44 px NUMBER and reported "leanest 2.93
against a floor of 2.07, passing". 2.93/kpx at 32 px is THREE colours. It was passing ground art
one whole colour leaner than his leanest approved tile, and the number looked comfortable.

**THE RULER IS A COUNT, NOT A RATE.** The tool now re-derives the counts from his own per-kpx
numbers at run time (`round(2.07 * 44 * 44 / 1000) == 4`) and holds every ground cell to 4 and
every wall cell to 3. Nothing is typed.

*This is instance eighteen of this lane's running fault: a clean measurement off the wrong
oracle looks exactly like a fact. It is the reason every number in this file names what it was
measured ON, not just what it was.*

### 5b. THE CAR WAS ALREADY DRAWN, FROM ABOVE, AND IT IS NOT 2x1
`wreck_road` in the approved bank is **192 x 92 px of burnt-out sedan seen from directly
overhead** -- his art, already in the close grid's own camera, already a top-down car. At 1.7 cm
a pixel that is 3.26 m by 1.56 m: **four cells by two.**

Rule 34d's default of "a car 2x1" is 1.5 m by 0.75 m, which is a motorbike. A real sedan
(4.5 x 1.8 m) is six by two. The block uses his own drawing at its own honest size, and the card
carries all three numbers, because section 5 puts the defaults in VOTE as his to knock down.

Round one's first cut INVENTED a 2x1 car from ramp colours while a drawn one sat in the file
it was reading. That is the REUSE-FIRST law failing on the loudest possible object.

### 5c. A HOUSE AT 4x4 CELLS IS THREE METRES SQUARE
At 0.75 m a cell, rule 34d's "about 4x4" house is 3 m on a side and its 2x2 inside is a 1.5 m
room. That is a shed with a closet in it. A small Vegas tract house is about 11 x 13 m, which is
**15 x 17 cells**, and a phone showing 11 cells across (section 5) cannot hold one.

The block on the card is drawn to the law's 4x4 so that it is the LAW'S block and not mine. The
card puts the car beside it, because the car is his own drawing at its own measured size and it
comes out **as long as the whole house**. That picture is the argument.

**THIS NUMBER IS NOT COOK'S.** WORLD + LIFE+CITY [honest grid] owns what is on the grid, and
COOK draws to that list. The measurement is handed over; the row decides.

### 5d. HIS TILES SIT A LITTLE OFF THE FAMILY RAMP, AND THAT IS THE SUN
`road_0` is the asphalt ramp +2 on every channel, `walk_0` is concrete +3, `wall_0` is stucco -3.
A lit tile and a shaded tile, one offset each, and `road_2` is dead on the ramp. A guard that
forces every pixel onto a bare ramp entry is STRICTER THAN HIS OWN APPROVED ART and flattens the
whole street. The check here is "on the family ramp, or on it under one shared offset per tile",
and the card reports each cell's offset.

## 6. DIRECTION'S TWO-SCALE CARD LANDED MID-ROUND AND IS FOLDED IN
records/BOHEMIA_TWO_SCALES_LOOK_CARD_9_27_26.md (3475b22) names this row and how it is judged:
- "beside the 7/28 approved art it is cut from" -> the card's top half is every cell beside its
  source tile at the same zoom, labelled CUT or DRAWN.
- "density floor: the 7/28 bank's own per-class minimum" -> finding 5a, as a count.
- "ONE BLOCK FIRST: every batch shows ONE BLOCK whole before volume" -> the card's bottom half is
  one block at the phone's own width, at game size and at twice size.
- "wear is per-cell authorship, never stamps" -> section 7.

## 7. NOTHING IS STAMPED, AND NOTHING DRUMS
Counting distinct pictures is the WEAK form of the no-stamp rule: twenty-two different cells can
still beat like a drum if the same mark lands on the same beat, which is this lane's own
edge-that-drums lesson. So there are two gates.

**Per-cell authorship**: his three variants where he drew three (road, walk, yard), his two
concrete slabs for the inside, and a TORUS ROLL of his own tile where he drew one. A roll cannot
add a colour and cannot move the light, because it is a translation and material carries no
gradient; the kerb, whose lip runs east-west, is only rolled east-west so the lip stays south.
On the block: road 33 cells / 33 pictures, walk 22/22, yard 80/79, wall 11/11, kerb 22/15.

**The drum gate**: across each band, correlate column brightness with itself at every lag. If the
cell period is where the strongest echo sits, the street has a pulse in it. Measured: the echo at
the cell is +0.01 (walk), -0.33 (kerb), -0.34 (road), -0.16 (yard), against loudest echoes of
+0.64 / +0.74 / +0.85 / +0.50 at lag 1 to 5, which is just material continuity. **The cell period
is never where the echo sits.** Nothing repeats visibly.

## 8. THREE THINGS THE LOOKING CAUGHT THAT THE NUMBERS DID NOT
1. **THE HOUSE WAS PAINTED ON.** The first block read as a pale tan ring lying flat on a pale tan
   yard, and every guard was green. The temptation was to push the wall's contrast -- and this
   lane has now twice learned that "it does not read" is almost never a contrast problem. It was
   a DRAWING problem: every other object in this game throws a shadow and the house threw none,
   so nothing said it was standing up. The whole footprint now casts south-east, one third of a
   cell, onto whatever floor is there. It stands up. A shadow never changes what a cell IS, so
   the grid stays honest.
2. **A FULL-COLOUR SPRITE IS A STICKER AT CELL SIZE.** His rubble heap arrived carrying 203
   distinct colours against the five to eight every cell around it carries, and his burnt car
   arrived saturated rust in a muted block. Both read as pasted on. The fix is the bank's OWN
   craft operation, in its own two lines: snap every pixel to the family ramp by value, keep
   "up to two accents per tile, taken from that tile's own out-of-range pixels". Snapped to
   asphalt the car is a burnt hulk that sits in the road; snapped to concrete the heap is a heap.
   Same drawings, the world's register. Terracotta and ground were tried on the car and both lost
   its structure; that is why the choice is asphalt and it was made by looking.
3. **ALPHA IS ON OR OFF.** A half-transparent sprite edge blends with whatever it lands on and
   invents colours nobody approved -- thirteen of them, measured, off one heap, which is what
   tripped the subset guard. No gradients anywhere else in this cut either.

## 9. THE GUARDS THAT RUN EVERY TIME (each refuses the run)
- the cut loses no colour of any source tile, and invents none;
- every CUT cell's colours are a subset of its source tile's;
- every DRAWN cell's colours are a subset of his material plus its family ramp;
- the ruler as a COUNT: ground cells 4+, wall cells 3+, re-derived from his per-kpx numbers;
- A WALL SHOWS ITSELF: its south face is a whole edge in shadow, 100% of the line at -19.3 value,
  and no floor cell carries one;
- A DOOR SHOWS ITSELF: 82% of its pixels differ from the wall it sits in;
- EVERY FLOOR REGION CONNECTS TO THE STREET: 162 floor cells, all reached from the road, the
  inside only through the door -- AND THE GUARD BITES: walling that door up strands 4 cells, and
  the mutation runs every time, so the check is proved and not just passed;
- nothing is stamped; nothing drums.

### THE WALL GUARD TOOK THREE TRIES AND THE FIRST TWO ARE WORTH KEEPING ON THE RECORD
1. It compared the wall's bottom row to the YARD's top row and called the gap an edge. The
   baseline was two different floor MATERIALS: tan gravel against grey concrete is 53 apart and
   neither of them is a wall.
2. It took the biggest row-to-row jump inside one cell -- and his cracked concrete BEAT the wall,
   95 against 86, because a black weed crack across a sidewalk is a bigger jump than a stucco face.
3. It counted the SHARE of lines across an edge that step -- and his KERB came in at 66%, because
   a kerb really does have a full edge. That is the whole reason rule 34 gives it its own cell.
The thing no floor has is a full edge that is **DARK**. The sun is north-west, so a wall's south
and east faces are in shadow and a kerb's lip is LIT: a lip you step off, never a face you stop
at. Three measurements, each clean, two of them measuring the wrong thing.

## 10. THE ANALOG HORROR LINE (rule 20)
The house has an inside now, and there is nobody in it. The door stands open on a concrete slab,
and the light on the wall cap is the same light that is on the kerb outside. Nothing in the block
moved, and the car in the road has been there long enough that the road has healed around it.

## 11. [bb the overworld is battle brothers] -- rule 33(f) and (j), volume cited
**reference/library/battle_brothers/02_COMBAT_RULES.md, the TERRAIN section.** Read first, as
rule 33(j) requires. Its words: "high ground +10% to hit and ranged range; low ground -10%;
forest blocks line of sight and ranged fire; swamp costs AP and fatigue", with the note that
Paolo 9/24 keeps ONLY high ground for us and none of the rest.

WHAT IT TEACHES THE DRAWING: a BB board is read by LOOKING. Every tile is exactly one thing and
the picture never lies about it, so a player commits a move without probing. That is rule 34b in
another game's words, and it is the whole reason this round's guards are about whether a cell
SHOWS what it is rather than whether it is pretty.

AND COMBAT'S MEASUREMENT ON THAT SAME PAGE LANDS ON MY MOUND: our one terrain effect **has never
fired** -- over 160 seeded street fights the player started on high ground 0 times and it changed
0 of 688 shots, because the game built it as a raised slab 9.1 tiles across with its nearest
stair 6.3 tiles away. Under rule 34 the mound is ONE CELL. So it has to read as a lump you STEP
ONTO in one press, not a feature you go and find. That is why COVER here is **the ground
swelling** -- his own dirt, his own ground ramp -- while PROP is a foreign material sitting on the
ground (concrete heap on dirt). You can tell what you can climb from what is in your way, by
material, and that is now a guard.

**WHERE BB IS A STILL AND WE MOVE (rule 33g):** BB's board is a flat field you place units on
between turns, and it is finished before anybody steps on it. Ours is a street the character
WALKS, one cell per press, with no turn boundary and no setup -- and the shadow of the house
falls across the cell you are about to step into.

## 12. HANDED OVER
- **WORLD + LIFE+CITY [honest grid]**: a house at 4x4 is 3 m square and a car at 2x1 is 1.5 m.
  His own drawn car measures 4x2. The cell kinds, the block map and the pixels are in the bank
  for the block you name; COOK draws to your list.
- **COMBAT [fight on the grid]**: the mound cell is COVER and the only terrain read, and the
  block map in the bank is a board you can stand people on.
- **CHARACTER [small body]**: the ground these 28 px bodies are judged on is in the bank, at
  game size, as PNG.

## 12b. THE FIVE KINDS AGAINST THE ENGINE'S OWN TABLE, AND ONE OF THEM IS MISSING
LIFE+CITY's [honest grid] round 1 (a012271e) gated `KIND_LAYER` in engine/bohemia_district_kit.js:
one table mapping a legend kind to {layer, solid}, the single source of truth the walked surface
already asks. Checked rule 34's five kinds against it, by reading the file:

    FLOOR  ground, drive, walk, marking, turf-dead, water-dead, water, court, play  -> ground, not solid
    WALL   building, structure, fence, panel                                        -> structure, solid
    DOOR   gate, portal                                                             -> portal, not solid
    PROP   prop, vehicle, tree-dead                                                 -> prop, solid
    COVER  -- NOTHING --

**COVER is not in the table at all.** The one terrain effect this game keeps (rule 33d, and
COMBAT's measurement that it has never fired) has no kind and no encoding anywhere in the engine.
The art for it is drawn and in the bank; naming it is COMBAT [fight on the grid] and WORLD
[honest grid], not the art's call. The mapping is written into the bank so this cut binds to what
is already wired instead of running beside it.

## 14. THE GATE SUITE WAS DEAD FOR THE WHOLE FLEET AND 73 COMMITS LANDED ON IT
Running the suite at the end of this round printed, before a single gate ran:

    THE GATE TABLE IS MALFORMED -- no gate can run until this is fixed.
    row 446  THE FLIP  has 3 field(s), needs 4

Every row of the table is (name, argv, what, slow). THE FLIP shipped with three. The table
checks itself first and refuses everything, so from that commit onward **no lane could run any
gate at all**. Measured: the row landed in e7c2b13f (DYNASTY [the flip]) and **73 commits have
gone to main since**. Whoever ran the suite in that window saw the refusal, not a verdict.

**PIPE FIXED IT (2929a370) while this round was running**, independently, so the fix is theirs
and not this lane's. What this round adds is the measurement of what it cost and a comment on
the row carrying it, because this is the same class as the law that made the table check itself
in the first place: A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and a gate suite that cannot
start is not a gate either.

**AND THE SUITE IS NOT PASSING.** 728 gates now, and it does not finish in forty minutes. In
the first 154 gates it reached before that timeout, dozens are red: SILENT MOMENTS, FIGHT MUSIC,
INSTRUMENTS, DISTRICT FILL, REPO BUDGET, MAP SIZE, STREET SOURCE, FULL RES, SEE THROUGH, HALF
SIZE, TOP MENU BAR, PAD RING, READABLE RULER, ALLY WHY, PHONE READABLE, FIRST TEACHING,
SETTINGS, SEE IT COMING, THE FEED, PARTIES MOVE, A DAYS WORK, VALLEY RUNS OUT, COALITION, RUNG
PAYS, ROADS ARE FAST, TURF, FACTION TOWNS, FIRST MINUTE, THIS WEEK, COME BACK, DRAINS SHOWN,
WHAT YOU OWE and more. None of them are COOK's and none of them are this round's; they are what
73 commits of nobody being able to look adds up to. **PLUMBER's, urgently**, and the running
time itself is a row: a suite no lane can afford to finish is a suite no lane runs.

## 15. WHAT THIS ROUND WAS GATED WITH, AND THE THREE REDS THAT ARE NOT MINE
Nine gates, by name, each run on this tree AND on clean main to prove the verdict is not this
round's:

    REFERENCE CHECK   GREEN      TOOLS RUN   GREEN      ART 45     GREEN
    HANDOFF           GREEN      ATTEMPT     GREEN      MERGE DEBRIS GREEN
    REUSE FIRST       7 failed -- and this tool PASSES it by name. The same seven tools fail
                      byte for byte on clean main (city_ground, combat_you_can_see_why_she_did
                      _it, floor_cook, lot_is_sixteen_tiles, the_person_is_112, there_are
                      _enemies, you_can_start_it). Not mine, and they are on the board already.
    PAGES PUBLISH     283 MB against its own 260 MB cap. IDENTICAL on clean main. This lane
                      flagged it to PLUMBER three rounds ago at 275 MB; it is 283 now, so the
                      surface is still growing against a cap nobody is holding.
    VOTE TAB          30 ok, 1 failed -- a 90 second Playwright timeout on "tapping VOTE in the
                      gear opens the queue". Run on clean main: 30 ok, 1 failed, the same leg.
                      My item passes every data leg; the registry went 180 -> 181 items with
                      zero lost, checked against origin/main's own copy after the rebase.

## 16. STILL OPEN ON THIS LANE
- the boot's heel question, on the WHICH WAY IS HE FACING card, waiting with six others.
- landmarks still undrawn: luxor, springs, robofactory.
