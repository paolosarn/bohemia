# THE PIT IS A PIT (ARENA 2, 11/7/26; VAMILY rule 426(f), ask line 497; rule 408(b) the golden-piece recipe)

His vote, 11/6, on the VOTE card of the fight in the pit (arena-the-fight-in-the-pit-11-3): YES to the rules and the crowd's
sound, and in his words: 'The arena map is so fucking ugly bro'. The coordinator's brief: remake the arena board's LOOK on
the golden-piece recipe, analog horror at the source, a real place in a dead Las Vegas, compared to the world before calling it
done; keep its rules and its sound; touch only the arena's own board (COMBAT TWO is on the street boards).

## WHAT WAS UGLY, MEASURED (before, on his phone: records/target/arena/board/vote/before_phone_*.webp)

The pit fight had no board of its own. The fight dealt the Strip's template board (20 x 15 tiles) and cut a 9 x 5 window out
of it (rule 79's cut). On the demo's real pit fight that window was 'blvd + stripw': a boulevard's lamp posts, a bus shelter,
two teal pool blocks cut in half at the window's edge, the hard straight seams where one block picture meets the next, and
sideways a black hole where a ring block never loaded. Nothing in the picture said pit, arena, Mob, crowd or Las Vegas resort.
It was a street. DIRECTION's other wall names the same faults on other boards: 'straight lines at grid borders, colours that
end abruptly' (11/2) and 'This does not look like a strip' (11/3).

## WHAT IT IS NOW (after, on his phone: records/target/arena/board/vote/after_phone_*.webp)

THE PIT IS A PLACE: a Strip resort's lagoon pool, drained since the water stopped, that the Mob fights in. THE POOL FLOOR IS
THE BOARD AND ITS WALLS ARE THE BOARD'S EDGES, so 'no retreat' is something he sees, not a rule he reads. One scene, one
render, cut where the fight already cuts:

- ON THE FLOOR, each thing inside its own tile and the tile's ground saying what it is (rule 59, Battle Brothers' tiles):
  the swim-up blackjack bar (the Tropicana's and the Hard Rock's real thing) on one tile, BLOCKED; a heap of loungers the
  crowd threw in with a dead palm the wind put in the pool, DEBRIS; black water over the main drain, WATER (Battle Brothers'
  swamp: 4 AP, the melee malus); wind-blown sand in two corners and along the north wall, ROUGH; everything else flat.
  The pool for three (10 x 5): 44 flat, 3 rough, 1 debris, 1 water, 1 blocked. Nothing blocked on either line's columns,
  whatever the card's depth (checked for all four line depths).
- THE PAINT OF THE FLOOR, made from the palette, never over the picture: sun-chalked aqua plaster, old algae where the water
  sat last, the rings the last water left as it went down round the drain, the trickle tracks to it, the cracks a pool gets
  when it is drained, the plaster spalled to the concrete, the casino's starburst set in 30 cm tile with one tile in eight
  popped out, dried blood where men fell, two drags toward the east gate where the dead clones went out, leaf litter in the
  corners, paper and the house's chips.
- THE NORTH WALL (what shows above the board): 15 cm aqua tile, the dark trim row with its depth marks set in pale tile
  (4 FT, 8 FT, 4 FT), the three rings where the water stood for years, the Mob's chalk tally of the dead (forty-one groups),
  the ladder bent outward.
- THE ONE WRONG THING (analog horror bible R1): four gouges up the north wall's tile where something climbed out, the coping
  broken there, scrapes on the floor running to it, and a dark drag across the deck into the cabanas.
- ROUND IT, the dead resort as one real place (BLDG-04, the Strip's pool race: a casino's pool deck is a small city): the
  north deck's small crowd on mismatched casino chairs behind the dead showroom's velvet ropes (broken and taped), four poles
  with bulb strings along the rim (three bulbs of a dozen alive), the PA horns, the breaker box held shut with a belt, the
  scoreboard with half its digits dead, the bookie's blackjack table and his chalkboard (TONIGHT / BULL 3-1 / HOUSE EVEN /
  NO REFUNDS), the hand-painted THE PIT sign (the town pit's own); the cabanas gone to rags and the dead palms; the hotel wing's
  four floors of balconies and a towel on a rail; the tower over it with boarded windows and rust running from its ledges;
  the guests' lot behind; the pool steps at the west end where his men go down, their bench and water barrel; the clone
  cages and the plywood ramp at the east end where the Mob drives the clones in (one cage door open and empty, a hulk lying
  in another); the generator they cannot always feed and its jerrycans; the south deck's crowd, the empty lifeguard chair,
  the fence, the dead garden, the resort's dead marquee by the Boulevard, Las Vegas Boulevard with its median palms and the
  cars and a bus where they stopped; across it, on the next resort's roof, the Mob's mostly broken solar field (rule 375's
  amendment: 'a mostly broken solar field').
- ONE POOL, 10 x 5: five rows hold his three with a tile above and below (rule 79's sum), and a tournament's five in one
  column; a band longer than five (79 of 2,360 cards drawn from engine/bohemia_arena.js) steps back a column, the fight's
  own place(). A 10 x 7 pool is laid out in the tool (--variant M) and NOT shipped:
  the pit is one place, as the town shows it, and one picture is lighter (rule 418). The pictures went to webp quality 72 (half the bytes of 86; 4 levels of
  255 off the render), the board at half the render's pixels and the ring at a fifth: his phone shows the pit upright at about a
  quarter of the render's pixels and sideways at about a half, so half is pixel for pixel on the glass at both, and the pit loads
  0.56 MB instead of about 4 (rule 418: light as a flash game). A pinch past the sideways zoom is where it goes soft. The fight
  picks the smallest pool in the file that holds rule 79's own sum (a tile of room, his line, the gap, theirs, a tile), the
  one pool when none does, and sets the two lines in its middle.

## HOW (one source, the town pit's way)

tools/bohemia_arena_the_pit_board.py builds the scene in metres through the master rig (its camera: orthographic, 45 degrees,
facing north, heights x 1.414; 42.9 px a metre, the fight's tile_px 515 x 364 for a 12 m tile; its one sun and sky fill; its
source pass on every material and its dent pass on the props; DIRECTION's palette roles). The deck stands 2.2 m over the
floor and the south wall stands 3.1 m south of the board, so the south coping lies exactly on the board's bottom edge and the
floor tiles agree with the grid. The board and a tile round it are rendered at the fight's full pixels, the ten-tile ring
(what the fight shows round any laid board) at a quarter (the fight bakes its ring at half anyway). Both are cut into the 5 x 5
tile pictures the fight already reads ('picture.webp#col,row', COMBAT TWO's laid board), so the fight draws the pit with the
code every laid board uses: the bake, the zoom, the ring's dim, the night pass. slices/arena/pit_board.json holds the laid
board (a file of pool sizes, so a second one is a render and a --ship away); slices/arena/pit/ the pictures (34 webp, 0.56 MB: the board and a tile round it at half the render's pixels, crisp sideways on his phone; the ring at a fifth; 23.8 KB of laid board).

THE FIGHT (slices/BOHEMIA_FIGHT.html, two __THE_ARENA__ hooks, nothing else touched): the pit's file loads with the fight's
data (a missing file leaves the old cut, never a broken fight), and after the cut, a pit fight calls arenaPit(): the size,
the lines' columns, the laid board. Rules untouched: no retreat, nobody spared, no loot, the crowd's sounds all as before.

## THE RECIPE (rule 408(b)) AND WHAT WAS NOT DONE

1 ONE AT A TIME: one board, the arena's, no other ground made. 2 THE BAR BESIDE IT: records/target/arena/board/vote/
beside_the_bar.webp, the pit at one pixel to one pixel beside ground_one_real_street (his YES, the floor bar) and the town's
pit. 3 THE REAL THING: a Strip lagoon pool, the swim-up bar, Kool Deck round a Vegas pool, the plaster of a drained pool.
4 ONE SOURCE: the master rig, the palette, the town pit's own sign and mesh helpers. 5 THE LOOP: renders looked at in four
rounds (the first: the bar read as a dark disc, the heap was too small to read at 12 m a tile, the sand was a perfect oval,
the deck was flat pink; each fixed), NOT twenty cycles of the look tool (it measures a sprite's silhouette at 16 x 16, which a
whole board has no use for), said here instead of pretended. 6 THE MACHINE CHECKS: the floor bar (tools/bohemia_direction_
floor_bar.py) on the pit at 1:1 failed B2 (hue 32.7, a touch orange) and B4 (grit 6.1) on the first deck, so the deck was
re-coloured to the valley's bone and given grit before the final render (on the final: B1 sat 0.18, B2 hue 39.5, B3 split 4.3 and B6 0 percent orange PASS; B4 grit 7.1 still under the bar's line, said; no road, so no B5); the
pool's own plaster is not dirt and the bar's dirt mask does not read it; purity 0 purple, 0 lava on every picture; the
reference check block in the tool names BLDG-04, BLDG-05, AH-01, AH-03, TG-07 and the bar piece. 7 ON ITS REAL SURFACE: the
demo, a real pit fight entered by a finger from the Mob's town, on a 390 x 844 phone, upright and turned sideways.
8 DIRECTION'S EYE: not had in this session; the card carries ARENA 2's own line beside the bar and says DIRECTION may overturn
it (the precedent: animation-the-crawl-golden-11-7).

## REFERENCE CHECK (the 9/4 duty)

Compared to the world: the same camera, ruler, sun and palette as every board and the town's pit; beside his YES floor bar at
one pixel to one pixel; the real thing (a drained Strip lagoon pool, its swim-up bar, Kool Deck, Las Vegas Boulevard). No
reference game added: Battle Brothers' arena stays the floor for the rules only (a small board, a crowd, no way out).

## WEAK, SAID

- The people round the pit are at the world's ruler (1.7 m at 42.9 px a metre), so beside the fight's men (drawn at the
  person's own fixed size, rule 'the ground may zoom, the person may not') they read small: ants round giants, the same
  clash every board has with its dead cars.
- No lamp pools at night: the three live bulbs are painted in the render; the fight's night pass darkens the pit like any
  board, with no light pool of its own (the board's lights list is empty).
- The ring past the courtyard (the podium roof, the garage, the far lot) is plain; it sits under the fight's ring dim and
  mostly behind the phone.
- One render of each size: every pit fight of a size is the same pool (the card changes, the place does not; it is one place).

[bb Battle Brothers' arena is a small map in front of a crowd with no way out; ours is the Mob's drained pool, the walls are the
way-out you do not have.]
[analog horror: an ordinary resort pool by day, the old water's rings, the chalk count of the dead, and four gouges up the tile
where something climbed out.]

## THE SHIP LINE (11/7, BUILD 11/7t THE PIT IS A PIT)

GATES (rule 13, run by name on this tree, rebased on main aecbd030): THE ARENA 31 ok / 0 failed with the demo and --no-tourney, 34 / 3
with the tournament: G1, G2, G3 (it waits for the fight's own ground load, as he does) and every
pit-fight leg green (C5: the card's three gladiators on 10 x 5; G3: family arena, THE PIT, every picture loaded, both lines on the
floor); F3, F4, F5 (the tournament's 'Enter the tournament' tap opens no pick screen) are red on clean main 173d8b97 too, 31 ok / 3
failed measured side by side, not this round's: routed to ARENA. THE FIGHT READS ONLY SOURCED NUMBERS 7 / 3, the same three red on
clean main (COMBAT TWO's typed STREET numbers, camp_two/kit.json, '.fat ='); the pit's file added to its allowed ground with its
reason. The board's own --check: ok (one pool, 34 pictures, the laid board 3.6 levels off the render it was cut from, the worst
cut line 2.15 x the others and no seam to the eye, floor rgb 162/174/163, 0 purple, 0 lava). PAGES PUBLISH 28/0: the publish list 858 of its 900 (the gate counts
binary megabytes; this round first read the lister's decimal 899.9 as 'at the cap by a hair', which was wrong, and the board's half
size stands on the phone's own pixels and rule 418, not on the cap). VOTE TAB 62/4: FIRST TIME FINAL green for the golden card; the
four reds are main's (two DYNASTY cards' whys, the alpha's landing on VOTE).
