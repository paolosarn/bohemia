# THE OLD LAYOUT, THE NEW HOUSES (COMBAT TWO, 11/7/26)

VAMILY rule 423 (NEW RULING, amending 407(g) and 11/6h), ask lines 484 to 488. Paolo 11/7, after playing the fight board: "the
combat map is still dogshit like each house should be connected by road or mini road... every house should be a tile that I can be
on... if it's one story I can still be on top of it, that's a defense boost, but not a range offense boost... converted to two or
three story houses... there's no ladder system, the ladder system is not realistic... no one wants to be right in the middle of the
street, that's how you get shot at the most... a 4 x 4 of house tiles... I can't even get on any of them... the map has to change
too... you have to understand the difference between layouts and assets: I like the new assets for the houses, but the layout is
dog shit, I prefer the previous layouts... use the layout of before and just swap the house assets."
BUILD 11/7zb - THE OLD LAYOUT, THE NEW HOUSES. BUILT, NOT YET SEEN.

## WHAT CHANGED, BY HIS LETTERS
(a) LAYOUT AND ASSETS ARE TWO THINGS. A fight from the map deals the seeded template board again (the boards before b6f4215c0: the
    district's own blocks, its place's landmark, its start, cut by the cell's own dice, rule 46): nothing of its layout moves. Then
    slices/bohemia_street_board.js fromTemplate() draws that same board tile for tile from its own blocks' pictures (a source rect a
    tile) and swaps every HOUSE of its suburb blocks (subs, corner, culdesac, suburb_stem, yards: their walled or roofed tiles) for
    the new houses he likes: COOK's five ranches through the master rig (the same pictures 11/6h stood on the map's lots). The tile
    the old house stood on takes a bare tile of its own block, the tile north of it (where the old roof stood up into the picture)
    a clean tile of the same row of the same block, and the new house stands on it, its foot where the old house's was. The ring
    round the board is dressed the same way. The template's own roofs (the shops downtown, the Strip's) stay roofs.
    The map's own block (11/6h) is asked now only by a handed plan (a gate, a bench) or opts.street 'map'.
(b) EVERY HOUSE TOUCHES A WAY: a house tile with no tile beside it a man walks on that is no house is no house (a yard). Measured
    on the gate's 44 spots: none needed it (the template's houses already front a street or a yard: subs rows on their street,
    yards rows over their yards); the rule holds it for every future block. Every floor tile joins his line (B2): all 44.
(c) EVERY HOUSE IS A TILE YOU CAN BE ON: a house tile is height, height2 or height3 (never blocked: the subs blocks' houses were
    walls before, 'I can't even get on any of them'); its level is its storeys (the hit chance up and down, the sight, rule 321).
(d) NO LADDERS; ONE, TWO, THREE STOREYS, MOST ONE OR TWO, THREE RARE (rule 428(b), landed on main while this was built, amends
    423(d)'s 'most two or three': 'more defence, more range offense bonus depending on whether it's a one or two-story house...
    three-story houses are rare, but not unheard of'). The storeys by the spot's own dice (ours.storeys.share: 45% one storey, 45%
    two, 10% three), and where WORLD THIRTEEN's one table answers the district (rule 429(b), records/target/bb/map_fight_kinds.json
    through engine/bohemia_fight_kinds.js, now loaded by the fight) the table's own mix, so the map and the fight stand the same
    houses as tall (the suburb 50/45/5, the estate 30/60/10, gated); measured 46% / 48% / 6% over 2,273 house tiles, 12 of the 44
    boards at the table's mix. A ONE-STOREY HOUSE GIVES DEFENCE AND NO RANGE:
    a house's reach (what it adds to a gun's range) is its storeys less one (two storeys one tile, three two; rangeUp, reachLevel;
    any other height as before); its defence is the height's (a man below it hits it at -10% a storey, rule 321). Walking into a
    house is no climb (climbsUp false on a house: the climb-or-attack lock of rule 328 was the ladder's), it costs the step and Battle
    Brothers' +1 AP a level. No ladder is drawn (UI.ladders empty; drawLadders kept for a mod). The words on the tile: 'A house, n
    storeys: walk in by its door. One storey covers you; two and three reach farther too.' (draft).
    THE PICTURES: the five ranches of two and three storeys (tools/bohemia_combat_two_the_storeyed_houses_11_7_26.py): COOK's own
    builder (tools/bohemia_cook_model_buildings.py) with the main body's walls and windows repeated 2.7 m higher a storey and the
    roof and chimney lifted on top, the porch, wing, garage and carport one storey at the side; COOK's own render through the master
    rig (S facing, its cast shadow, the settlement snap, the ring), cut to the fight's ruler (slices/fight_ground/street_board/
    storeys/, storeys.json). New names only; the approved one-storey ranches untouched. STAND-INS (408(c)) until DIRECTION's eye.
(e) AUTO HATES THE OPEN STREET, AND SCRAMBLES OFF IT (423(e), and 428(c) as he corrected it at once: 'they can start off in the
    middle of the street... if it's on auto, they're trying to get out of there'). AUTO's one brain (his men's and theirs):
    - where a turn ends is weighed by the hurt it can take there (dangerOn): an open street tile (the board's asphalt, a lane or a
      walk, with nothing to hide behind on it) counts 6 more of that hurt and a house 2 less, four times over in the first two
      rounds (ours.open_street: street, house, first_share, first_rounds);
    - THE WALK TOWARD THE FIGHT (the brain's own walk when there is nothing to hit, which never read that hurt) now counts the
      ground it ends on in steps: the open street 2 steps farther, a house, a roof or a tile with cover 1.5 steps nearer, full in
      the first two rounds and 0.4 of it after so the fight still comes on (walk_street, walk_good, later_share); of the tiles he can
      strike from, the one off the street (strike); a walk off the street onto better ground no farther from the fight is a walk;
    - a man who HOLDS (the line before contact, a shooter who sees them) still steps aside or one step back onto better ground,
      never nearer the fight.
    The sides start where the layout and the walk put them (428(c): the open street included); nothing moves the starts.
    MEASURED (headless, both sides AUTO): of the turns a man moved (6 spots, 4 rounds) 10.0% ended on the open street with the cost
    off (13.6% of the walkable board) and 4.0% with it, 27% in a house; THE SCRAMBLE (24 boards, every man of both sides put on
    the open street nearest his start, the first round): on a house, a roof or cover after their first moves his 55% and theirs
    48% with the cost off, 69% and 78% with it; the fights the same length (4.4 rounds before, 4.6 after, all 24 over). The men of
    his left on the street after the first round are mostly shooters who swapped and fired from where they stood (a shot now beats
    a walk to a house with no AP left to shoot).
(f) THE MAP'S BLOCKS GET THE SAME ROADS AND ALLEYS: MOVED TO WORLD 13 (rules 426(a), 429(d)(e), below). The board no longer copies
    the map's block, so nothing on the board waits on it.

## GATE
gates/the_old_layout_the_new_houses_gate.js (THE OLD LAYOUT, THE NEW HOUSES, registered), about 35 s: 44 spots (11 districts whose
boards carry houses x 4 cells), the live rules headless plus one page: A1 the template's layout with the new houses on its own house
tiles; A2 every one of the fifteen 11/3 place boards dealt at its own places (428(a), 20 seeds each, 300 fights); B1 every house
touches a way; B2 every floor tile joins his line; C1 every house tile enterable at its storeys' level; D1
storeys 1 to 3, one and two each at least a quarter, three present and at most a fifth (428(b)); D2 the reach (one 0, two 1, three
2); D3 no climb into a house, no ladder drawn on the page; E1 the cost; E2 AUTO's moves end off the open street (under half its
share of the board); E3 THE SCRAMBLE (24 boards: more than 60% of EACH side on a house, a roof or cover after its first moves).
EVERY LEG HAS A PLANTED FAIL that turns it red: the marina's board unbuilt (A2p), a 3 x 3 lump of houses (B1p), a floor tile walled in (B2p), a house tile walled
(C1p), every house one storey and every house three (D1p), range_from 1 (D2p), the ladders drawn again (D3p), the cost off (E1p,
E2p, E3p). 23 passed, 0 failed (about 45 s): 15 of 15 place boards at their places on 300 of 300 fights, 44 of 44 boards, 2,273 house tiles, storeys 1,086 / 1,027 / 160 (48% / 45% / 7%), E2 4.0%
against 10.0% with the cost off, E3 his 68.6% and theirs 77.8% against 55.2% and 48.4%; on the page 225 new houses drawn, 121 of
two or three storeys, no ladder.

## OTHER GATES RUN (one at a time, rule 13)
THE BOARD IS THE CITY AT THAT SPOT 194/0 (W1 re-aimed, below). HEIGHTS YOU CAN READ 4/0 (re-aimed, below). EVERY FLOOR TILE IS A
TRANSLATION 19/0 (re-aimed, below). AUTO AT 4X NEVER CRASHES 7/0 (after the fix below). THE ZOOM DOWN INTO THE BOARD 28/0 (the three profiles).
THE CAMP IS PITCHED ON THE BOARD 14/0 (after the fix below).
FOUND ON THE WAY, AND FIXED:
- AUTO AT 4X A3 (the night fight, 16 against 30, his phone at 4x CPU) went to 33 ms a frame: not the scramble (33 with it off) and
  not the storeys (33 with the old share); main's own fight 16.7, this build with opts.houses false 16.7. Timed by function: the
  frame's raster landed in drawFog (12.6 ms a frame against 3.9), the first fill after the ground. The template board with the new
  houses frames its men wider (zoom 0.25 to 0.38), below one device pixel an art pixel, so the fight sat on the zoomed-out ground
  path: two scaled blits of the ring and the baked board EVERY frame. Now kept as drawGround keeps the close-in ground: drawn once to
  a glass-sized sheet while the camera holds, blitted after (one sheet shared with drawGround); 33 -> 16.7 ms, p95 50 -> 33.
- the blocks whose houses were swapped still stood their old roofs' outlines for THE LAYERS (a man behind a house no longer drawn
  was cut by it): standsNow skips a suburb block's outlines on a template board with the new houses (the new houses stand as their
  own pictures).
- the camp (CAMP THREE's engine/bohemia_camp_life.js pitchOn): a won fight's dead now often lie in a house (no camp on a roof), and
  the upright phone's camp picture is narrow (a body a tile to the side is off it); a body the camp's own picture shows (need, the
  tiles it shows past the camp's middle each way) counts with the camp, a little less than one on its tiles, so the camp is
  pitched where his men can see the dead and go through them (B7: 3 dead, 2 in the picture, looted).
- THE ZOOM DOWN P4 (his phone at 4x, traced) threw in blitMan on the stale demo cut; the demo re-cut, 7/0.
MERGED TREE (every gate above run again on it, one at a time: all green as above): THE FREEWAY FIGHT 22/0. EVERY WEAPON HAS ITS RANGE BANDS 13/1: B5 red on its fixed dice (seeds 1-10) on the new boards,
one bucket of nine, his rifle at 4 tiles landing 63% against 50% shown over 126 shots (2.9 of its spread; 1 shot astray, 14 across a
height); the same leg on seeds 11-20 holds every one of 11 buckets (the rifle at 4: 47% against 48%, 132 shots): the dice, not the
rule (the chance and the roll are one function). Named for WEAPONS: B5 over more seeds, or its bound for nine buckets.
NOT THIS ROUND'S: THE WHOLE LOOP PLAYS red at its step 6 (a road event's second card never closes after GO ON) on main's own
demo and on this cut alike (the cut differs from main's by the stamp alone; the step runs before any fight). Named for RUN.
CLIMB OR ATTACK: C6 red, NOT THIS ROUND'S: its wolves' minutes on AUTO (139.6) come from one wolf fight at the convention spot that
never ends; the same six wolf fights run on main's own fight rules (origin/main 61f555a6) stall the same way, step for step
(tools: the headless engine with main's rules spliced in; both 40,549 steps, one stuck at 5,001 rounds). Named for COMBAT.

## RE-AIMED (the law moved, rule 423)
- THE BOARD IS THE CITY AT THAT SPOT (COMBAT TWO's): W1 now asks the demo's own door for the TEMPLATE layout with the new houses at
  that cell (it asked for the map's block); M3 and K1's template are the template as it was (opts.houses false). Its H, S, R, K and
  M legs keep the map's-block path (handed plans) honest for a bench.
- HEIGHTS YOU CAN READ (COMBAT's [eyes: heights you can read], EYES line 67): H1 counted the chevrons over every ladder; the ladders
  are gone (423(d)), so H1 now holds that no ladder is drawn and every suburb house is drawn at its own storeys (its picture); H2/H3
  ask a two-storey house (a house has no wall now, 423(c)) for its storeys, the hit, the reach, the sight and the way in ('door');
  his turn's pointer is put on the farthest such house. FOUND ON THE WAY: on the computer, a house he can walk into showed only the
  walk; now the line of its height shows with the walk (the pointer on a house).
- EVERY FLOOR TILE IS A TRANSLATION (COMBAT's): its roof leg read a one-level roof's words ('to hit anyone lower', 'takes the high
  ground'); a suburb house is two or three storeys now, so it accepts a house's own line ('Roof, 2 storeys up: +10% to hit...') and
  the feed's 'is 2 storeys up'.

## MERGED WITH MAIN (40 commits landed while this was built)
- WEAPONS' range bands (BUILD 11/7y) moved the storeys' reach into one place, reachUp(a, t), by agreement with COMBAT TWO for 428(b):
  it reads reachLevel now (a house's storeys less one), so the range card on the tiles and inRange both follow 423(d).
- FREEWAY's board (BUILD 11/7p) reads what the map is at the spot off the street board's plan; the board no longer asks the map's
  block, so the freeway asks for the map's plan by name (opts.street 'map').
- WORLD THIRTEEN's table (BUILD 11/7o): the storey mix, above.
- The build letter: 11/7k was taken by SCAVENGE while this was built; 11/7z by WORLD 12 and 11/7za by SOUNDS TWO; this is BUILD 11/7zb.

## FOR MOTION, CAMP THREE AND UI
The entry point is unchanged: FIGHT.setup(opts). A fight from the map has boardDef.laid (laid.template true: the template drawn tile
for tile, laid.storeys, laid.tiles), boardDef.street {cell, district, template: true, X0, Y0, shift [0, 0]} (the same origin the 11/6h
board gave the dive), boardDef.blocks the template's real blocks. opts.houses false: the template as it was.

## WEAK, SAID OUT LOUD
- The swap is a picture cut: a bare tile of the block where the old house stood, a clean tile of the row above; where the block has
  no clean tile of that row (or a baked piece stands on it) the old roof's top can show behind the new house.
- Downtown, the Strip, the works and the desert have no houses (their buildings are shops, casinos, works): unchanged.
- The two- and three-storey ranches are stand-ins (408(c)): COOK's model a storey taller, not yet through DIRECTION's eye.
- (b)'s "no lump of houses with no way between" holds on the template's own blocks; the 11/6h map-block lumps (a 4 x 4 of houses)
  are gone with that layout, and come back only on a bench.
- AUTO still ends 4% of its moves on the open street, and after the first round 31% of his men are still on it when the fight
  opens in the street (shooters firing from where they stand: a shot now beats a walk with no AP left to shoot).

## NEXT: (f) THE MAP GETS THE SAME ROADS AND ALLEYS, NOW WORLD 13'S (rules 426(a), 429(d)(e), landed while this was built)
The map's painter (vbCityCore) packs a suburb block with lots edge to edge (the 4 x 4 of houses he saw); the board is no longer
read from it. 426(a) reads 423(a) as: the marriage stays, the map's generation puts a street in front of every house, and the old
layouts with the new houses are the stopgap until it does; this build is that stopgap. 429(e) gives the map's generation to WORLD 13
alone (the street in front of every house, the building kinds' fight answers, the place boards written into the map); then the
board asks the map again (407(g), 429(a)) on a layout that already has a way to every house.
## NEXT FOR COMBAT TWO: RULE 428 (the board kinds come back)
428(a) the 11/3 place boards COME BACK WITH THIS BUILD: a fight from the map deals the template again, and the template IS the
place's own board where a place has one (ours.place_boards, the fifteen, all built: dealOwn); measured (A2) every one at its own
places on 20 of 20 seeds; the suburb's carries the new houses (980 house tiles over its 20), the other fourteen have no house blocks
(the trailer park's are trailers, 426(a)'s one exception). Next for 428(a): their buildings onto the road network (429(h)); 428(d) the weaker side digs in and
falls back (an odds read: numbers, gear, levels); 429(h) every building on one joined road network, on every board, 20+ seeds.
428(b)'s storeys and 428(c)'s scramble are in this build.

[bb] Battle Brothers' settlements are open ground between houses you can walk round, never a block of roofs; ours keeps the
template's streets and yards and lets a man into every house, up its stairs.
[analog horror] a two-storey ranch with every upstairs window boarded the same way as the one below it, as if somebody did the whole
house in one night.
