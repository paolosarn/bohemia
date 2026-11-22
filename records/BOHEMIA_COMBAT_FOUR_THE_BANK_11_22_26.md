# COMBAT FOUR: THE BANK (BUILD 11/22 - THE BANK)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The bank (the map's kind 'bank', WORLD's real place downtown), whose fights were fought on the street outside it. Rules 416,
59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22g)
A fight at the bank was fought on the board of the kind it is like ('bank' is in the fight's 'strip' family: the casino and strip
blocks), never inside it.

## THE FACTS IT IS BUILT ON
- WORLD's real place (records/target/bb/real_places.json, 'the_bank'): the Valley Bank Plaza, 300 South Fourth Street at Bridger,
  downtown, opened 13 December 1975 as the Valley Bank of Nevada's headquarters, 16 floors; in the collapse 'a tower of paper nobody
  wants over the strongest room in town'.
- A bank's public floor is the banking hall: the teller line behind bullet-resistant glass on its counter, the tellers' stations and
  cash safes behind it, the officers' desks on the platform, check-writing islands, the columns holding the floors above.
- The vault sits below it: walls of reinforced concrete, a round steel door that weighs tons standing open on its hinge, the safe
  deposit boxes in steel walls floor to ceiling, a table where a box is opened, and beside the vault the cash cage and the counting room.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/bank/bank.json`, the twenty-fourth in `slices/fight_ground/insides.json` (eight fights in ten at the
bank's cell, by the cell's own dice). No new rule code; the ceiling is the casino's coffers ('coffer', a stand-in, at 10%).
- `the_banking_hall`: the teller line across the back of the hall (its glass: nobody passes, seen through, cover beside it; the
  counter's ends where the glass stops, waist high: low cover), the tellers' stations (low cover) and cash safes (cover) and loan files
  behind it, marble columns in two rows down the hall (cover), the officers' desks along both sides (cover), check-writing islands (low
  cover), the waiting chairs heaped (low cover), paper drifted against the furniture (rough 3 AP, low cover), the front doors and the
  side doors (lit by day), two fires.
- `the_vault_floor`: the vault in the middle, its concrete walls with a way in on each side, its round door standing open beside the
  west way in (a blocker that hides a man); inside, walls of deposit boxes (they hide a man), dumped boxes across the floor (rough 3
  AP, low cover) and the viewing tables (cover); round it the counting room's tables (cover), coin carts (low cover), dumped boxes and the
  cash cages in the corners (mesh: nobody passes, seen through), the stair doors on both ends and in the bottom wall, two fires.
- 19 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the glass and the cage its palisade you see
  through, the counter's end its palisade waist high, the column its tree, the vault door its boulder, the deposit box wall its wall,
  the paper and the dumped boxes its brush); 17 pieces with the walls, all stand-ins (the names for COOK in the handoff). Every blocker
  says whether it hides a man ('sight'). NO HIGH GROUND: the officers' platform is a step up, not a storey. No line rewritten (465);
  the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js: 398 passed, 0 failed over twenty-four insides in 341 s; the bank 19 of them)
34 of 40 fights at the bank's cell go inside (the share 0.8 of what the garage leaves); 24 of 24 fights to the end on AUTO (7.8
rounds), nobody of 288 stood a whole fight; 16% of men on the bare floor after round one against 37% with rule 428's leg off; every
board's floor joined, both layouts dealt both ways. THE TALL THINGS (I12), NOW READ ON EVERY LAYOUT: the deposit box walls and the vault
door hide a man, the teller glass is seen past.
THE GATE'S OWN HOLE, FOUND ON THIS BOARD AND CLOSED: I12 (this lane's leg, 11/22) read the first board it dealt and no other. On the
bank that was the banking hall, whose only blocker is glass, so the vault's tall things were never read and the leg passed on 'no tall
kind'. It now deals boards until every layout of the inside has been read and fails if one never was (the full gate: every inside
'2 of 2 layouts read').
MY FIRST CUT, MEASURED AND CHANGED: the vault floor 43% bare after round one (the hall 11%): the bands above and below the vault were
open marble, and the vault's inside half floor. The bands filled with counting tables, coin carts and dumped boxes, the vault's inside
with dumped boxes and the viewing tables: 19%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:bank, C3_INSIDE=bank, through the map's own door)
The demo upright 1 fight (the banking hall), 6 of 6 taps (the floor, an island, a column, chairs, a desk, the counter); the demo on its
side 1 (the banking hall), 4 of 4 (the floor, the paper, an island, a desk); the alpha upright 1 (THE VAULT FLOOR, another valley's
bank), 2 of 2 (dumped boxes, a counting table); the alpha on its side 1 (the banking hall), 3 of 3. 4 fights inside, all ended on AUTO,
15 of 15 tile taps, 0 page errors; the ceiling moves a pixel 4.7 to 7.5 of 255 on average. The valley has one bank: each run met it once,
and the cell's own dice deal its room (three runs on one valley dealt the hall; the fourth valley's bank dealt the vault). Both rooms
are also opened alone on the fight page (the card's top row) and played in the gate (24 boards).

## SAID PLAINLY
VOTE card combat4-the-bank-11-22 (stand_in): the banking hall and the vault floor from the fight's camera, and a real fight in the
bank on the page. The pictures are stand-ins (the casino's glass for the teller line, a casino door for the vault's round door) until
COOK draws them; the ground's rules are real.
