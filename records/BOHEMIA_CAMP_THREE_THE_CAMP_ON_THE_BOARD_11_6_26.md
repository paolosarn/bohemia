# THE CAMP IS PITCHED ON THE FIGHT BOARD (CAMP THREE, 11/6/26; VAMILY rule 406, ask line 449)

Paolo 11/4, an executive decision, LOCKED: 'it's not feeling natural at all... the camp only takes place on combat grid maps... the
camp could take up one tile or four tiles in a square and keep getting bigger... it'll make it a lot easier for you, so you don't
have to make two different types of camps... anytime you camp it's on the combat grid... that's why we need more awesome combat
streets'.

## MEASURED BEFORE (main ce14b189)
- Making camp on any block opened the same picture: CAMP TWO's quilted sand (slices/camp_two/plate.webp, plate_night, plate_tall,
  plate_tall_night). The block he stood on was shown nowhere.
- A crew that found him at camp opened a fight on a board dealt for that block: a different picture, with no camp on it. Two camps.

## NOW
(a) ONE CAMP, ON THE BOARD. HEAL out on the map makes camp as before (the hours, the healing, the doors, the acts, the pitch, the
compass, the ghosts, the turn: every rule CAMP and CAMP TWO built, unchanged). Only the ground changed: the camp screen's ground is
the fight board of the block he stands on.
- The map (slices/BOHEMIA_CITY_WORLD.html, __THE_CAMP_ON_THE_BOARD__) builds the hand-over its one door (cityHandOver) would send
  from that block: district, spot, world, the world state's burned board and power; plus the camp's own die (campDie: the block's,
  so a camp made there again and a fight that finds it are dealt the same board).
- The camp screen (slices/bohemia_camp_look.js, marked) asks slices/bohemia_camp_board.js (new) for the board. That module asks the
  shell's own door (nfOpts) for the fight's options, exactly as a fight there gets them, and loads a hidden copy of the fight page
  (slices/BOHEMIA_FIGHT.html, __THE_CAMP_ON_THE_BOARD__, campBoardBake) BESIDE THE MAP, where a fight's page sits (the shell), so
  COMBAT TWO's board laid from the map's own block (__THE_BOARD_IS_THE_CITY_AT_THAT_SPOT__, landed this same round, b6f4215c) finds
  the map exactly as a fight does: the fight's own dealer deals the board (FIGHT.setup, same options, same die), the camp's square is
  pitched on it, and the fight's own bakeBoard bakes the WHOLE board (any kind: a template's, a place's own, a laid one) at up to
  515 px a tile held under 12 M pixels (237 on the 20 x 15 board), by day and by night; the ground round the square is cut out of
  it. Nothing else of a fight starts: no band on the glass, no clock, no song, the fight count untouched. The pictures are copied
  out, the page lets go of its memory (RUN's __fightLetGo) and is removed.
- ONE BOARD, ONE FINGERPRINT (campBoardSig in the fight's block): the blocks, every tile's ground, every cover piece where it lies,
  a laid board's own pieces. The camp keeps its board's fingerprint and the fight that finds it is checked against it.
- THE TILES (engine/bohemia_camp_life.js square, pitchOn): from the company alone, never the glass's shape, so the camp stands on
  the same tiles upright or on its side: one house tile while the company is three or fewer, two tiles side by side to eight, a 2 by
  2 past that, never more than four connected tiles (rule 406(h), AMENDED 11/6 during this round, ask line 469; the first build of
  this round went to 3 by 3 and 4 by 4 and was cut back to four tiles the same round); the pickup takes two at least. Three tiles (an L) is not used:
  CAMP TWO's camp would stand a piece on its missing corner. Pitched where every tile is open ground (no wall, water, roof or raised tile), clear of
  cover where it can be, on his side of the board at his own line (his men sleep where they would stand), near the middle row, with
  enough board round it that the picture never runs off the edge.
- CAMP TWO's camp is laid on the square: the camp's footprint (every piece's footprint_m, as the camp's walk reads it) fills the
  square with a tenth to spare, so the board under it is drawn at the size that holds it. One tile is one house; a bigger company
  shows more of the street round it.
- Until the board is in, nothing of the camp is drawn (the glass the fight's own dark, no door, no man) and the pitch waits, then plays
  on the board. MOTION's grow waits on the camp's first drawn frame as before.

(b) THE OLD PICTURE IS RETIRED. The four sand plates are in graveyard/the_camp_sand_11_6_26/ (POSTMORTEM_THE_CAMP_SAND_11_6_26.txt);
kit.json no longer names them; CAMP TWO's cook tool no longer writes them. The settlement screen's own camp pictures
(settlement_ground camp_0/camp_1) never show in camp mode: the camp look always names its ground (the dark wait, then the board).
The crew screen opened at camp takes the camp screen's live picture (UI 7's rule 369 code, unchanged), so it shows the board.

(c) A CREW AT CAMP FIGHTS HIM THERE. While the camp stands, or for five minutes after a crew broke it if he has not moved off the
block, the map's door (campFightAt, one marked line in cityHandOver) sends the camp's block, its die and the camp as it stood (each
piece's foot in board tiles and its size against a tile); the shell's door passes it on (one marked line in nfOpts, RUN's file); the
fight deals the camp's board and draws the camp on its square every frame under the men (campOnBoard, one marked line in draw()),
the fire burning on the beat. In the fight each piece is drawn 1.6 times its camp size about its own foot (the fight draws its men far
over the houses' scale; at the camp's own size a tent was 25 px under a 160 px man on the phone on its side). It is drawn, it does not
rule: a tent is not cover.

(d) IN A TOWN, THE TOWN'S SCREEN. Unchanged (rule 273): HEAL in a town or on its doorstep rests in the town's own screen; the map
never asks for a board there (campBoardAsk is null while CAMP.town).

## MEASURED AFTER (the demo, cut from this tree)
- Before COMBAT TWO's laid boards (the template boards): the board on the glass 2.1 s after HEAL with a free line (the fight page's
  data 1.0 s, the deal 0.01 s, the two bakes 1.0 s; the camp's two pictures written in 0.2 s). Up to 11 s measured when the map was
  fetching pictures for new blocks at the same moment (the gate jumps the marker between blocks; the fight page's data waits in line).
- On the laid board (rebased on b6f4215c, suburb at [40, 66]): 2.26 s (data 0.84 s, the map's block read and the deal 0.15 s, the
  two whole-board bakes 1.23 s, the two pictures 0.04 s); the camp on the map's own yard tile, the street beside it.
- First build wrote the camp's pictures as PNG in the background: 6.5 s to come back while the camp's clock ran, the glass dark all
  that time. Now written at once (WebP, JPEG where WebP is not written).
- First build re-asked the board after BREAK CAMP (a late hour's tick) with no block: a board of nowhere. Now only a standing camp
  asks.
- Phone on its side: 'yards' (suburb) board, the camp on one tile at (3, 7), the next tile's shed wall at its left edge. Upright: the
  same tile, the camp risen over the phone, the next tile's curb at the top.
- The fight at camp: the same blocks (byte for byte), the camp's six pieces on tile (3, 7), his men deployed on his line over it.

## GATES (each run alone; PIL is broken on this kind of box, no image-comparing leg here)
See the commit and handoffs/CAMP_THREE.md for the numbers of this ship.

## NOT DONE (rule 406 AMENDED 11/6, ask line 469, CAMP THREE's next)
- (f) CAMP HERE FROM THE VICTORY SCREEN on the very board the fight was on, the bodies and the wreck where they fell: the end screen's
  MAKE CAMP (RUN FOUR's rule 267, the shell's door) opens today's camp on the block's board (the same deal, so the same streets), but
  without the fight's own last state (its bodies, its burned tiles, his men where they stood). Next: hand the camp the fight's board
  and its dead (FIGHT.S.units dead with x, y) at MAKE CAMP, and pitch the camp on the fight's own picture.
- (g) the men living on it (going through the kills, rule 392's carcass haul; leaning on the buildings next to the camp's tiles).
- (h)'s three tiles (an L).

## HOOKS ASKED (handoffs/CAMP_THREE.md)
- COMBAT TWO (407(g)): the camp asks for its board through campBoardAsk, a copy of what cityHandOver adds to choose a board. When a
  board starts being chosen by a new field of the hand-over, add it there too, or give one function both call (fightBoardAsk(x, y)).
  If a tent should be cover, the camp's pieces are in FIGHT_OPTS.camp.pieces (u, v in tiles).
- UI: on the map (no camp) the crew screen still draws COOK FOUR's camp pictures (settlement_ground_packs camp_0/camp_1);
  slices/bohemia_camp_board.js can give it the board of the block he stands on.

[bb Battle Brothers: camping is a state of the party on the world map, and an attack on a camp is a battle on the ground where it
stood; here the camp is the battle ground, pitched on it.]
[analog horror: the camp is the same ground the fight is on; the tile you sleep on is the tile they come for.]
