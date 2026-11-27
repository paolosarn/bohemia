# COOK SEVEN: THE BANK, FINISHED, ITS BANKING HALL, ITS VAULT FLOOR AND ITS COFFERS; AND WHAT THE NEW INSIDES COST IN FRAMES (11/27/26)

COMBAT FOUR's bank build asked 'FOR COOK (SIX)'; VAMILY rule 480(b) (the fourth of the 27 insides COMBAT FOUR added since 11/21 with every piece a
stand-in); rule 480(c) (none costing frames, measured below for the truck stop, the police station and the bank); rule 482; rules 461, 441, 416,
451(a). BUILD 11/27zm - THE BANK.

## WHAT THIS IS
COMBAT FOUR's bank: its banking hall or its vault floor. Every one of its 17 pieces was a stand-in (the casino's glass, bar, seats, door, screens
and cage, the garage's core, the street board's bales, heaps and rubble, the tunnels' camp) on the mall's floor, and its ceiling was drawn by the
page. They are in the folder now under its names, and the bank lays them with no code changed:
- THE FLOOR (bank_floor_0.webp, floor.floor and floor.ring; one kind serves both rooms, marble in both): 1.2 m slabs of a warm grey stone, a ground
  of its own (bk_slab: the mall's terrazzo role with the shader's joints every 1.2 m and each slab its own shade), soft veins running long, the
  polish worn dull in a path, heel scuffs, a slab cracked across, mud tracked in. Laid darker than first drawn (153, not the mall's 160 that he
  flagged as the palest; the courthouse's marble is 146).
- THE PIECES (bank_art.json's kit, COMBAT FOUR's names): THE TELLER LINE'S GLASS (bk_glass: a tile long, the marble-fronted counter, the bandit glass
  in brass frames to 2.4 m, a window every 2 m with its deal tray and number plate, starred four times where it held). THE COUNTER'S END
  (bk_counter: the line's return, its gate swung). TELLER STATIONS (bk_stations: three, the cash drawers pulled and empty, dead screens, coins on
  the floor, a stool). A CASH SAFE (bk_safes: five, three open and empty, one rolled over). FILING CABINETS (bk_files). A MARBLE COLUMN (bk_column:
  a square pier drawn 5 m up, its brass shoe, its chipped corners). AN OFFICER'S DESK (bk_desks: the platform's brass rail bent down where it
  broke, a walnut desk pushed over on its back, another standing with its chair, a credenza, the nameplate and the green lamp on the floor).
  A CHECK-WRITING ISLAND (bk_island: two standing and one toppled, slips blown everywhere). WAITING CHAIRS (bk_chairs: leather, knocked into a
  heap, a dead palm in its planter). PAPER DRIFTS (bk_paper: ledgers splayed, statements, slips, AND THE BANDED NOTES NOBODY WANTS, straps burst
  into fans). THE VAULT DOOR (bk_vaultdoor: the round steel door turned to face you, its bolts out, its hub and wheel, THE TIME LOCK UNDER ITS
  GLASS ON ITS BACK, the hinge arm, the collar in the wall). SAFE DEPOSIT BOXES (bk_boxes: a tile long, 480 brass-faced doors, a third drilled
  and most of those hanging open). DUMPED DEPOSIT BOXES (bk_dumped: forty long boxes on their sides, their trays, papers, an empty ring box, a
  stack emptied). THE CASH CAGE (bk_cage: a tile long, the police station's welded mesh, its window and slot, its door open, the counters
  inside). COUNTING TABLES (bk_tables: one on its side for cover, two standing WITH THE STRAPS OF HUNDREDS LEFT ON THEM IN BRICKS, a note counter
  on the floor, a money cart, its bins empty). THE BANK'S WALL (bk_wall_ew, _ns: a marble wainscot with its joints, the brass rail, plaster to
  3.4 m, a cornice, soot, damp, cracks).
- THE CEILING (bank_ceiling.webp, rule 451(a), over the fight at his 10%; the data names its kind 'coffer'): deep plaster coffers on beams both
  ways with a gilt bead, a rosette in every coffer, a dead chandelier in every bay, damp and soot, plaster fallen to the lath. bank.json's
  ceiling entry: "have": true, "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## FOUND ON THE WAY
1. HIS 'COVER YOU COULD NOT SEE': ten pieces were 2.9 to 8.3% of their house tile at the first render; each made a fuller cluster (the platform's
   rail and a second desk, three stations, five safes, two islands standing, a second heap of chairs, a drift three times as dense, forty
   dumped boxes, a second counting table and the money cart): 7.4% (the column, the paper) to 15.1% now; the cage 50%, the boxes 35%.
2. The deposit-box wall first read as noise (three doors in five hanging open): one in three is drilled now, the rest shut in their rows.

## WHAT THE NEW INSIDES COST IN FRAMES (rule 480(c); tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js, the real fight page, 390 x
## 844, the CPU slowed four times; the same tree with the three art files moved aside, so the boards fall back to their stand-ins)
                 LOAD fps (now / stand-ins)   OPEN fps        PAN fps        AUTO fps
  truck stop     23.8 / 24.1                  8.8 / 8.1       3.0 / 2.6      28.6 / 24.7
  police         26.6 / 25.6                  7.8 / 8.1       3.0 / 2.7      28.9 / 26.9
  bank           25.8 / 24.3                  8.2 / 8.5       3.0 / 2.6      27.4 / 26.5
The finished pictures cost nothing: every phase is the same or better than with the stand-ins (the finished pieces are smaller files than the
casino's and the street board's pictures they replace). All six walks opened AT NIGHT (asked for day; COOK SIX saw the same), and the night
board is the slideshow: OPEN about 8 fps and PAN about 3 fps, a frame past 50 ms 45 to 51 times in the pan. That is the fight page's night
path (COOK SIX 11/26: nightTint2's whole-glass copies and nightDraw per piece, paid every frame the camera moves), not the pictures.
*** FOR PLUMBER 8 AND COMBAT FIVE (rule 480(c), (d)): the numbers above, again, on three more insides; nothing of yours edited here.

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'bank'):
- BEFORE (main a32d636c7): the_banking_hall upright: THE BANK, 161 pieces, 161 of them stand-ins, the ceiling drawn by the page ('coffer'), 0 page
  errors; the_vault_floor 241, 241 stand-ins.
- NOW: the_banking_hall 161 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright and on its side; the_vault_floor 241, 0
  stand-ins, both ways, 0 page errors. No bank file lost.
Gate THE INSIDES WEAR FINISHED ART 140/0 with twenty kits (A3 floor worst 4.5 against 7.0; A4 the teller glass, boxes and cage a tile long; A5
602,630 bytes of 900,000; C3 117 steps, 32% lines).

## REFERENCE CHECK (compared to the world before calling it done)
The valley's old bank branches and the downtown banking halls: marble floors, a teller line of marble-fronted counters under bullet-resistant
glass with brass frames and deal trays, square marble-clad columns, an officers' platform of wood desks behind a brass rail, stand-up
check-writing tables with slip racks and chained pens, a coffered ceiling with chandeliers; the vault: a round door of a dozen tons on its
hinge arm with its boltwork and time locks, walls of safe deposit boxes with dual-key doors, a cash cage of welded mesh, counting tables with
note counters and money carts. The twins: this lane's police station and truck stop kits; the courthouse's coffered plaster (COOK SIX).

[analog horror: the straps of hundreds left on the counting tables in bricks, nobody taking them, the money dead; the vault's time lock still on
the back of its open door]
[bb Battle Brothers' palisade you see through: the teller glass and the cash cage; its boulder: the vault door nobody stands on]

## THE TOOLS
tools/bohemia_cook7_the_bank_finished_11_27_26.py   render bk_floor | bk_pieces | bk_vault | ceil_bank; cut; sheet; plan (ON the police
station tool).

## NOT DONE, SAID PLAINLY
1. The column (a 1 m pier) and the paper drift are 7.4% of a tile: a pier is a pier.
2. The vault floor wears the hall's marble (one kind for both rooms, as COMBAT FOUR's data has it); a vault's concrete would want a floor area.
3. No night versions; the night board's frames are the page's (above).

VOTE: cook7-the-bank-11-27 (MADE FROM arena2-the-pit-is-a-pit-11-7).
