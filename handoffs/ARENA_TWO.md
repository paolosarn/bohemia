# ARENA TWO (arena 2) -- the handoff block (VAMILY rule 426(f), ask line 497; written only by ARENA TWO, newest first)

ARENA TWO (arena-two-01gkdyus): 11/7 LATEST -- [the pit's board] BUILT, NOT YET SEEN, BUILD 11/7t THE PIT IS A PIT (1e1fb5ec).
Paolo 11/6, his vote on the fight in the pit: YES to the rules and the crowd, 'The arena map is so fucking ugly bro'. Record:
records/BOHEMIA_ARENA_TWO_THE_PIT_IS_A_PIT_11_7_26.md. VOTE arena2-the-pit-is-a-pit-11-7 (stage golden, art_kind ground, bar
ground_one_real_street; ARENA TWO's own line beside the bar, DIRECTION may overturn it).

WHAT HE SEES (TAB: RUN, the demo; the Mob's town, THE PIT, pick, FIGHT): the fight stands IN the drained pool now. The pool floor
is the board, its walls are the edges: the casino's starburst in tile on the floor, the swim-up blackjack bar (BLOCKED), a heap
of loungers and a dead palm (DEBRIS), black water over the drain (WATER), sand in two corners (ROUGH); the chalk tally of the
dead on the wall; four gouges up the north wall where something climbed out. Round it: the crowd on casino chairs behind velvet
ropes, the bulbs (three alive), the bookie's table and chalkboard, the cabanas and dead palms, the hotel's balconies and tower,
the clone cages and ramp (east), the pool steps (west), the generator, the lifeguard chair, Las Vegas Boulevard with its stalled
cars, the Mob's broken solar field on the roof across it. MEASURED BEFORE: a 9 x 5 window of a random Strip template (lamps, a
bus shelter, half pool blocks, hard seams, a black hole sideways).

WHAT IS BUILT:
- tools/bohemia_arena_the_pit_board.py: one scene through the master rig (the fight's camera and ruler, 42.9 px a metre), one
  pool (10 x 5; a 10 x 7 is laid out, --variant M, not shipped: one place, one picture), rendered at full pixels (the ring at a quarter) and SHIPPED at half (the ring at a fifth): pixel for pixel on his phone upright and sideways, 0.56 MB (rule 418),
  cut into the fight's 5 x 5-tile laid-board pictures (slices/arena/pit/, slices/arena/pit_board.json). Renders need Blender's
  Python (python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow); about 20 minutes a size on 4 CPUs; --quick for a
  look, --crop x0,y0,x1,y1 for a full-size piece, --ship-only to re-cut, --check (system python3) for the gate.
- slices/BOHEMIA_FIGHT.html, two __THE_ARENA__ hooks: the pit's file loads with the fight's data (missing = the old cut), and
  arenaPit() after the cut: the smallest pool in the file that holds rule 79's sum (else the one), the lines centred, the laid board. Rules untouched.
- gates/the_arena_gate.js leg G: G1 the board is whole (--check: the pool, every picture, the floor is the pool, the terrain
  matches the picture, nothing blocked on a line, no seam where the fight cuts, 0 purple, 0 lava), G2 the fight reads it, G3
  (the demo) the pit fight stands on the laid pool with every picture loaded and both lines on the floor.
- slices/bohemia_arena_town.js: names slices/arena/pit_night.webp in full, so the publish list ships the town's night pit (it
  was left off: the lister read 'pit_night.webp' from slices/ and found nothing, so a night town had no pit on the live site).

GATES (rule 13, by name, on main aecbd030): THE ARENA 31/0 with the demo and --no-tourney (G1-G3, every pit-fight leg); with the tournament 34/3: F3-F5 (the
tournament's 'Enter the tournament' tap opens no pick screen) red on clean main too, 31/3 side by side: FOR ARENA. THE FIGHT READS
ONLY SOURCED NUMBERS 7/3, the same three red on clean main (the pit's file added to its allowed ground, with its reason).
PAGES PUBLISH 28/0 (the list 858 of 900, binary megabytes). VOTE TAB 62/4, main's four (DYNASTY's whys, the alpha's landing);
FIRST TIME FINAL green for the golden card. HANDOFF 10/0.

FOR COMBAT TWO / COMBAT 7: the pit is a laid board like yours (B.laid, family 'arena', name 'THE PIT'); arenaPit() runs after the
cut only when S.arena. A rework of the laid drawing keeps '../arena/pit/<pic>.webp#col,row' working (paths read from
slices/fight_ground/), or tell ARENA TWO.
FOR ARENA: your pit fight's rules, ranks, pay and crowd are untouched; the board under them is new.
FOR DIRECTION: the golden card asks your eye: beside the bar the pit is ARENA TWO's own call.

WEAK: the crowd is at the world's ruler (small beside the fight's men, like every board's cars); no lamp pools at night (the
lights list is empty, the bulbs are painted); the far ring (garage, podium) is plain under the ring's dim; one render a size.
NEXT: night with the three bulbs as real light pools; the tournament's pool seen on the phone with five men.

[bb Battle Brothers' arena is a small map in front of a crowd with no way out; ours is the Mob's drained pool, the walls are the
way out you do not have.]
[analog horror: an ordinary resort pool by day, the rings the last water left, the chalk count of the dead, four gouges up the
tile where something climbed out.]
