# THE CASINO BOARD (COMBAT TWO, 10/19/26, [the casino board], rule 52, rule 117, rule 120)

A CANDIDATE (rule 100). Nothing to slices/, engine/ or the demo. The board 271cc303. VOTE `combat2-the-casino-board-10-19` (redo of
`combat2-the-casino-floor-10-9`, his YES: 'Definitely placeholder tiles, but looking good'), sheet
`records/target/COMBAT2_THE_CASINO_BOARD_10_19.webp` (one column at the phone's 1170 px, rule 118). The tool:
`tools/bohemia_combat2_the_casino_board_cook_10_19_26.py` (seeded, about a minute). Manifest
`reference/art_bank/fight_board/COMBAT2_THE_CASINO_BOARD_10_19.json` (the plan and terrain per house tile, the cover
by tile and in metres, the lights, the fight's read old and new, every pack key). The board regenerates bit for bit
(.gitignore there; proved: the same md5 across two runs). The lossless 1:1 crop the card names:
`reference/art_bank/fight_board/sprites/COMBAT2_THE_CASINO_BOARD_10_19_1TO1.png`.

## WHY THIS ROUND
The row: 'the casino board still wears placeholder tiles while the casino itself now exists. END STATE: the casino
board rebuilt from COOK FOUR's casino and its floor, the slot rows and the cashier's cage as blockers, rule 117's
one-look read, in VOTE from the game's camera.' His YES on the old board and his YES on COOK FOUR's casino
(`cook4-the-casino-10-18`). Rule 120 (Paolo 10/18, 'the guns were supposed to be the main way this is gonna be
solved'): the coordinator's line for this lane is that the boards give shooters lines and cover, so this round
measures both on the fight's own grid before it saves.

## HOW THE PACK DID IT (rule 100c; his tiles as bought, the ones this board stands on)
| his tile | size | opaque | colours | mean | saturation | light, top-left / bottom-right | judged |
|---|---|---|---|---|---|---|---|
| 'Streets props and urban' #47 (the slot machine) | 68x96 | 76% | 3,541 | #2a3131 | 0.26 | 54 / 41 | never judged |
| 'Machines and tech' #13 (the video-poker console) | 96x82 | 89% | 4,818 | #353126 | 0.34 | 65 / 43 | never judged |
| 'Tables, chairs and sitting' #34 (the cage's counter) | 96x68 | 81% | 3,762 | #7d461a | 0.78 | 92 / 66 | never judged |
| '19. Miscellaneous (1)' #46 (the teller bars) | 96x80 | 85% | 3,831 | #37312e | 0.17 | 54 / 45 | never judged |
| 'Furniture and fixtures' #7 (the card table) | 96x83 | 85% | 2,861 | #462d17 | 0.63 | 62 / 36 | UP |
| 'Tables, chairs and sitting' #37 (the bar) | 96x91 | 79% | 4,723 | #674317 | 0.76 | 77 / 66 | never judged |
| 'Structures and columns' #1 (the column) | 29x96 | 73% | 1,432 | #423d3a | 0.14 | 80 / 45 | never judged |
| 'Floor tiles (1)' #1 (the aisle stone) | 94x96 | 95% | 5,586 | #8a7f6e | 0.23 | 139 / 119 | UP |
| '1. Cracked contrete tiles' #0 (the slab, through COOK TWO's cell) | 96x94 | 94% | 3,969 | #70665a | 0.19 | 105 / 101 | UP |
| 'Floor tiles and wall tiles' #5 (the cage's floor) | 85x96 | 96% | 2,192 | #34363a | 0.11 | 61 / 51 | UP |

What it says: (1) EVERY STANDING PIECE IS LIT FROM THE TOP-LEFT (the slot 54 against 41, the column 80 against 45),
the floors near flat (the slab 105 / 101), so the board keeps one light by laying them as bought, never flipped (the
card tables were flipped at random in the first run; that was cut). (2) His packs draw every prop in one 96 px box: a
slot machine is 96 px = 1.7 m at the body's 57 px a metre, a real one 1.9 m, so 1x; his column at 1x is 1.7 m, so x2
(3.4 m; a casino's columns run 5 m: no taller one exists, the hole is named). (3) His pack has NO CARPET, no slot
machine seen from behind and no casino at all; the machines are a street kiosk with a screen and an amber
video-poker console, the cage his bar counter and an iron grate. (4) His wood is loud (saturation 0.63 to 0.78): the
counters and the bar are the only warm thing on the board, and that is where the eye goes (the cage, the bar).

## HOW BATTLE BROTHERS DID IT
Battle Brothers never fights indoors. Its ruins and camps are open ground with walls, tents and debris as the cover
and a raised spot as the hill, and the two lines start apart across open ground, out of reach. OURS: the casino
floor, slot rows as the cover, the cage as the hill, the lines start eight house tiles apart (rifle 2, scope 3, the
hill +1: nobody is in reach before they move).

## THE BOARD
The middle board, 14 x 10 house tiles (161 x 115 m, rule 79's routine fight; the MGM Grand's gaming floor, the
valley's biggest, is 15,900 m2). The building is COOK FOUR's: their casino is the valley's first kind (El Rancho Vegas
1941, the Last Frontier 1942), a long ranch hall with not one window.
- THE NORTH WALL is COOK FOUR's street wall seen from inside (the camera sees south faces, so the street wall's inner
  face is the one wall a board can show): their render laid the whole width with their own `wall()`, their `hall()`
  set into it on the render's own period (no seam), so their six glass leaves, their open pair and their two steel
  fire exits stand at the board's north edge, the open pair at the spine aisle (column 2). From inside, the open pair
  is not COOK FOUR's black room: it holds the street in daylight (COOK TWO's sidewalk cell). The wall's contact line
  is the board's only paint (a 14 px shade at its foot, rule 114a).
- THE FLOOR: the gaming floor is the BARE SLAB, COOK TWO's concrete cell from the street he said YES to
  (`cook2-one-real-street-10-18`), twelve variants (three repeated visibly at 1:1): a dead casino's carpet rots under
  a leaking roof and is pulled up. The racetrack aisle (every casino loops one round its floor) is his five pale
  pavers mixed, a ribbon 4.8 m wide down the middle of each aisle tile (real aisles run 3 to 5 m); inside the doors
  it runs on as the foyer and before the cage as its apron. The cage's floor is his grey flagstone.
- THE PIECES (1,147 standing): 1,060 slot machines in banks of ONE MODEL a block (casinos group machines by model),
  three rows a house tile 3.3 m apart, eight cyan kiosks or six amber consoles a row, gaps where machines were pulled
  for their batteries (batteries are the money, 9/4), three bank tiles pulled whole; the cashier's cage (19 counters,
  a till every fourth, his grate behind each as the teller bars, his column at each end, two counting tables inside);
  the card pit (24 tables); the lounge bar (12 counters); 10 columns, one at the north-west corner of every block; one
  fire drum in a pulled bank with his scorch under it.

## THE FIGHT READS IT (rule 120), on the house-tile grid
A bank tile is HIGH COVER (rows of 1.7 m machines: you stand in it covered and nobody sees through it), the pit and
the bar LOW COVER, the cage HEIGHT behind its counter and bars (its counter row high cover), the aisles open.
Terrain per tile: slot banks and the pit `rough` (you walk the slot aisles), the cage `height`, the rest `flat`.
Sight: a line from tile middle to tile middle is blocked by any bank tile between. Reach: rifle 2, scope 3, height +1.
| measure | NEW (14 x 10, 11.5 m) | OLD (his YES, 20 x 15, 12 m) |
|---|---|---|
| clear lines of fire across the whole floor | 7 (rows 0, 1, 4, 7; columns 2, 6, 10) | 14 |
| tiles with cover one step away | 93% | 99% |
| places to hide with a shot out at rifle or scope reach | 93% | 99% |
| the longest clear line | 14 tiles | 20 |
| tiles the hill overlooks | 28 | 129 |
| the lines start apart | 8 tiles | 5 |
The old board measured on its own cover list (a tile with a slot bank in it is high cover) and its own start rows
(4 and 9). Read honestly: the old board is twice the area with sparser banks, so it has more lines and a bigger hill;
the new board has fewer, longer, plainer lanes (the racetrack and the spines) and every bank faces one. Both give a
shooter cover and a shot out nine times in ten. What changes for the guns: the racetrack row from the doors runs
straight to the cage's counter (14 tiles), so walking in by the doors is walking down the cage's line of fire, and
the banks either side are the way round. The lines start eight apart, out of every reach (rule 117: nobody is shot
before they move).

## THE ONE-LOOK COUNT (round one-look's counter, the board whole at the phone's 1,170 px)
words 0; pieces without a fight fact 0; specks 0; lit 5 (the open door, the fire, three machines on a battery); the
eye's count 244 things at the opening frame (the banks read as rows; the planted control: 12 cars read 12); colours per
96 px 4,928 (his pack ground 4,140).

## DIRECTION'S FLOOR BAR (fight verdict 24, `tools/bohemia_direction_floor_bar.py`, run on the whole board)
B1 pale PASS (saturation 0.197, bar 0.28); B4 grit PASS (12.45); B6 no bright orange PASS (0.14%, bar 0.5);
B2 FAIL (hue 32.6, bar 36 to 50); B3 FAIL (split 22.1, bar 9). The first run laid his orange square tile ('Floor,
walls' #10, Saltillo, the true floor of a 1940s ranch hall) and his tan parquet (#3) and read 63% bright orange (the
tiles alone 89 and 90%): both measured and left out, the slab put in; the bright pine round tables (0.51%, just over)
became his dark wood tables (UP). FOR DIRECTION: B2 and B3 are the bar reading a floor that has no dirt. COOK TWO's
slab alone (the lounge) reads hue 34.1 and fails B2; the aisle stone alone reads 30.7; each passes B3 alone (8.0 and
6.4), the whole board fails it because it has two floors, the slab and the stone, on purpose. The bar's dirt mask takes
concrete for dirt.

## GATES (rule 13: the gates that read my files; the full suite unmeasured)
REFERENCE CHECK 496/2 (the two reds are UI's tool and the frozen baseline, on main before me; this tool carries its
check). REUSE-FIRST: this tool PASS (the reds on main are other lanes'). ART PIPE A2: this tool 0 literal pixel writes
(the first run drew its floor masks and the card's chart with ImageDraw, 3 writes; both now arrays; 23 other tools stay
red on main). NOT VIBE CODED 29/1: N3's reds are COOK FOUR's gas station, warehouse and school (on main before me); this card's
crop through the gate's own N3 checker passes D1, D2, D4, D5 (D3 not held on a tile). VOTE TAB 46/6, the same six red as
main without this card (DYNASTY's two whys; the full-size viewer's five, RUN TWO's). Its first run named this card three
times, all fixed: a why of three sentences (now two, naming the VOTE tab), a twin he never judged (now his UP concrete,
'1. Cracked contrete tiles' #0), and a first picture 1,856 pt tall (now the board whole, 1170 x 826, cut from the sheet by
RUN TWO's tools/bohemia_run2_first_picture.py, records/target/vote_first/combat2-the-casino-board-10-19.webp).
THE TAG: the card is untagged on purpose. The tab puts a new untagged card on his first screen right after the reds (the
gate's leg passes with it there); a red tag of mine made 11 reds of the 12 cap and tripped the gate's boundary leg ('at 11
and -1 of 12'), so tagging is the coordinator's call.

## WEAK (said, not hidden)
- Every pack screen is lit: in daylight all 1,060 machines glow; the fight's dark pass lights only the three on a
  battery (the lights list).
- No slot machine's back exists: every bank faces south, the camera's side, never back to back.
- The cage's counter is his bar counter: it carries stools on the floor side, which a cashier's cage would not.
- The wall is 4.5 m of one render; at the opening frame it is a 33 px strip and the doors are specks inside it.
- 2x columns beside 1x machines (MIXELS) wait on DIRECTION's style guide field 1.
- The fight draws a man 0.86 of a tile tall against this board's house ruler (one COMBAT reader change at FINAL).
- COOK TWO's slab cell carries faint seams every 81 px at 1:1 (their recipe; their [the fight floor he hates]).

## FOR THE OTHER LANES
- FOR COOK TWO / DIRECTION: no carpet in the whole bank (294 packs read): a casino, a hotel and an office need one;
  the slab is a stand-in.
- FOR COMBAT (my lead): the casino's plan, terrain and cover by tile are in the manifest at the house-tile ruler; the
  fight's reader for a board this size is yours at FINAL.
- FOR COOK FOUR: their `hall()` made the board's north wall unchanged; the open pair seen from inside holds the street.

## THE ANALOG HORROR LINE (rule 20)
Three machines on a scavenged battery still play their attract loop to nobody, and the doors that were built never to
lock stand open on the street (El Cortez had no locks when the state shut it in March 2020).
