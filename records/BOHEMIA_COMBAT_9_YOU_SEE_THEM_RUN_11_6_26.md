# COMBAT 9, 11/6: YOU SEE THEM RUN (rule 415, ask line 467)

Opened by the coordinator for one round. Paolo 11/6: "while retreating, I don't see my people actually run, they kind of just
disappear. I think it's because you have the retreat edge of the screen less than four tiles away from our back line, so maybe
that's part of it too." His floor, rule 256: "in Battle Brothers every time I retreated I watched my people run tile to tile and
they always made it, they got that head start."

## MEASURED FIRST (main 7d9c2883)

**Where his line stood (the logic, tools/bohemia_fight_headless.js, 300 rolled fights, every faction, every district):** his back
line stood **2 tiles** from his own edge in 299 of 300 (front column 3: a man's flat run, four tiles, less rule 256's one-tile
margin). Every man stood 2 or 3 tiles from an edge. Paolo's guess was right.

**What was drawn (the fight page, every frame its own drawMan drew, tools/bohemia_combat_you_see_them_run_probe_11_6_26.js):**
- From the lineup, his upright phone, four men: **every one was drawn on ONE tile, the one he stood on, and never again.** Zero
  tiles of running seen; the last tile each was drawn on was not the edge.
- Mid-fight (AUTO into round 2): the same blink for the man two tiles from the top edge; a man who walked three tiles vanished
  one tile short of the edge.

**The cause, one line of the board:** the rules take a man off in the SAME act as his last walk (retreatStep walks him onto the
edge and getOut marks him fled at once). The board drew only the men the rules have on the field (`FIGHT.onField`), so the man
left the glass the moment his walk to the edge was asked, before a single step of it played. With his line two tiles from the
edge, that last walk was his ONLY walk: nobody was ever seen running.

**Rule 256's number (tools/bohemia_combat_early_retreat.js, 1,000 rolled fights, RETREAT the moment his first man is up):** 97.7% of
his men out, every man out in 920 fights; beasts 92.6%; a man of theirs closed to melee on his own first turn in 9 fights (the
rule-256 gate's E3 and E4 were already red on main for this reason).

## WHAT CHANGED

1. **A RETREAT IS WATCHED (rule 415(a))** `__YOU_SEE_THEM_RUN__` in slices/BOHEMIA_FIGHT.html, the drawing only (the rules are
   untouched: he is out the moment they say so). A man the rules have taken off stays on the board while his walk to the edge and
   his get-out still play: his own walk, on the beat, his bars on, the camera framing him like any walker. From the edge tile he
   runs on two tiles off the board at the walk's own pace (half a beat a tile), the second tile fading into the dark round the
   board, and only then is he gone. A broken man of theirs who leaves from the edge runs off the same way, if his side saw him.
2. **ROOM TO RUN (rule 415(b))** `__ROOM_TO_RUN__`: `ours.early_retreat.room_to_run_tiles` = 4 (his number). His back line stands
   four tiles from his own edge, his front column five (it was 2 and 3); their line moves with it (the five-tile gap between the
   fronts is Battle Brothers' own and is kept). Where the lineup places them only (startCols and placeBack), never how the board
   is cut: COMBAT TWO's dealer and the street board are untouched.
3. **THE HEAD START KEPT FOR THE WHOLE RUN:** his front column now needs two turns to reach his edge, and a fast one gains his
   extra run on him each turn, so a man of theirs who runs farther than a man starts back his extra run TIMES the turns his front
   needs (a dire wolf 4 tiles back, a hyena 6), capped at the board's far side. The camp and the pincer starts (COMBAT MAPS 3,
   rule 341) skipped the head start entirely before; they now take it too (145 of 753 dire wolves in 200 beast fights stood on the
   gap's line).

4. **THE RUN FROM THE LINEUP STAYS SURE (rule 253, 'before the enemy, no matter what'):** before, every man of his got out in round
   one, so the fight ended before any man of theirs moved. With the run now two of his turns, measured on the map's own board,
   their marksman shot a man between his two turns and the run ended LOST. Now, while a run ordered on the lineup lasts, theirs hold:
   no turn and no free shot (newRound keeps only his men in the order; freeShot answers nothing), for at most the turns his front
   needs plus one (lineHold, 3), so nothing can stall. 300 rolled lineup runs: 300 WITHDREW, 0 acts of theirs, none stalled, every
   one over by round 3. The lineup gate's strict leg ("none of theirs moved") holds as it was written.

Measured with only (2), no (3): beasts fell to 79.3% (the wolves caught his front column in round 2 with free swings as he
stepped away). With (3): see below.

## AFTER

| | before (main) | after |
|---|---|---|
| his back line from his own edge (300 fights) | 2 tiles (299 of 300) | **4 tiles (300 of 300)** |
| tiles a man is drawn on between where he stood and the edge, from the lineup | **0** (all four) | **3** (all, then 16-22 frames off the glass) |
| last tile drawn before he leaves | his own tile | **the edge tile**, every man |
| walk clip while he moves | none (he never moved) | 99-100% |
| rule 256, his men out (1,000 fights) | 97.7% | **99.2%** |
| rule 256, against beasts | 92.6% | **99.3%** |
| a first-turn melee blow | 9 fights | **0** |
| brigands / kids / machines / heavies | 98.1 / 98.2 / 99.9 / 99.6% | 97.6 / 99.1 / 100 / 99.9% |
| a retreat from the lineup (300 fights) | all out in round one, WITHDREW | over in round 1 (75), 2 (212), 3 (13); 300 WITHDREW |
| on the map's own board (the demo, a street block) | not measured | 3 of 3 drawn on 3-4 tiles between, the edge last, 16-22 frames off, WITHDREW |

Brigands dip half a point: their marksmen get one more turn of shooting while the run takes two turns; nobody closes to melee.

## THE GATES

- **YOU SEE THEM RUN** (new, gates/you_see_them_run_gate.js, in the suite): Y1 room to run in 300 rolled fights; Y7 the run from
  the lineup stays sure (300 withdrew, none of theirs acts); Y2 from the lineup on his upright phone (six men); Y3 mid-fight on his
  computer; Y6 on the map's own board through the demo's door (the map's encounter hand-over, the board laid from the block); Y4
  rule 256's number at least as high as before (97.7%), beasts 95, no first-turn blow; Y5 nothing threw. 7/0.
- **AN EARLY RETREAT GETS OUT**: E2 amended by rule 415(b) (newest wins): every man within TWO turns' run of an edge (it was one).
  5/0; E3 and E4 were red on main.
- **RETREAT IS A RUN FOR THE EDGE** 5/0. **RETREAT FROM THE LINEUP** L1 5 kinds and the red fight, phone: green as written (none of
  theirs moved); L2 red here and on clean main (its demo boot, 'engage', crashes this box's page before any fight; Y6 reaches the
  same fight through the title instead). **NO CAP ON HOW MANY FIGHT** 9/0. **EVERY PLACE ITS OWN BOARD** PASS. **THE CAMP IS PITCHED
  ON THE BOARD** (CAMP THREE's, it reads his front column) all green, both phone screens. **THE MAP HANDS THE BOARD** 5/3, the same
  three as main. **GHOSTS AND APPARITIONS** one red (THE ACTS, a weight table), the same as main.
- **THE REBUILT FIGHT PLAYS**: main 145/10; this tree 143/12 before two legs were set right, then those two legs re-run green:
  THE FIGHT OPENS WITH YOUR MEN WHERE THE ROSTER PUT THEM counted a roof as an open slot (rule 256: nobody is dealt onto a roof; at
  columns 5 and 4 seed 7 has a roof on two slots), fixed in the leg; THE HEAD UNDER THE STRIP judged a broken thug's last step after
  he had left the board (on the glass when his step ended, 373 of 390), now judged where his act ended. Still differing from main:
  the art-pixels pair flips with the tile at the glass's centre (main red by day 133%, here red by night 49%; COMBAT TWO's NOTE (3)
  says the same); 'both teams stay on the glass' is flaky on the sideways phone on main too (2 of 3 runs red on clean main, the
  same round-one spread: a man at row 12, a thug at row 2, 234 points of open glass at the farthest zoom).

## WHAT IT IS NOT

- The run off the glass is two tiles and fades; it is not a run to the edge of the screen (the camera holds the board, the ring of
  the map round it is drawn, and he leaves into it).
- Mid-fight a man runs for the NEAREST edge (rule 365, Battle Brothers' "edges of the map"); his own back edge is not forced. The
  run picks the reachable edge tile farthest from their men, so a man two tiles from the top still runs three or more tiles.
- The demo's own street board (COMBAT TWO's 11/6h) uses the same startCols and the same lineup code; measured there in Y6 (one
  street block, three men). A wider sweep of street blocks by their own layouts: NOT YET.

[bb] Battle Brothers' retreat: men already on an edge leave; the rest "attempt to speedily move to the edges of the map
automatically" (rules.json retreat_from_map_edge); its deployment puts the two companies far enough apart that an early retreat
is nearly sure, which is the head start this keeps for the whole run.
[analog horror] a man who gets out does not blink off like a deleted file: he walks off the lit board into the dark ring, fading
over the last tile like a figure walking out of a camcorder's light.
