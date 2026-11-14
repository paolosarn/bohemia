# JOBS: THE NIGHT, THE TURN AND THE BID, 11/14/26 (VAMILY rules 447, 441; row 610 again; the coordinator's routine 'JOBS turn up')

THE ASK (rule 447, his 'turn up... we got 20% left'; one tight batch): first row 610, a board he has read stays what he read until its
time is up; then fifteen more jobs in the Battle Brothers kinds still missing (escort a caravan, defend a place through a night, a two-part
job that changes halfway, a job two towns bid on), each people, a place and a thing, each fitting the town that offers it, some paying
into his own settlement. Rule 441: one of each played to the end on the real page, alpha and demo, a phone both ways.

## 0. THE ANSWER
- ROW 610, NOW AS HE MEANT IT: 11/11's fix kept a posted job through a re-deal but let the day's floor take it off and let new jobs in.
  NOW a board he has opened is what he read until its window ends (refresh_days): the town's screen marks it read (BohemiaBoardShelf.seen),
  and every later deal in that window gives that town exactly those people; only a job he took or finished leaves it. Measured in node
  (gate leg R5): four boards read stay the same through the day turning, the towns' news changing (a market day, a sickness) and a floor
  turned against every job; with the read mark planted off, all four change. On the phone (P1, P2): a town's board read, the day turned
  inside the window, read again: the same people.
- MEASURED FIRST: escort a caravan was ours (haul-caravan, 6 offers); defend was ours only at the client's own gate (hold-defend), never a
  place out there through a night; a job that changes halfway and a job two towns bid on had no kind of ours.
- THREE NEW KINDS as legs rows of WORLD's engine, and fifteen jobs: three escorts, three night watches, three that turn halfway, and three
  places two towns bid on (six rows, one a town). Every row is a named person of one town in that town's look, posted at that town only.
  Four pay into his own settlement through HOME BASE's seam: the clinic's nurse, a school roof panel, a tank of the co-op's water, a
  family from the shelter line.

## 1. HOW BATTLE BROTHERS DOES IT (reference/library/grok/wiki/PAGES_ALL.tar.gz)
- Defend Settlement (bb_all/0441): 'Defend a settlement against a single or multiple waves of enemies.' Ours now also out there, at a
  place, through one night: wait for dark, they come; wait out the small hours; they come again.
- Return Item (bb_all/1693): 'After obtaining the stolen property, you are offered a higher reward for the object by a shady man.
  Accepting the offer will result in the failure of the contract.' A contract that turns on the road. Ours: halfway, the truth comes out
  and he chooses: finish it and fight for it, end it there for the other side (part of the pay, from them), or walk away.
- The noble houses (bb_all/0441's noble contracts, bb_all/1670 Relations): work for one house and its enemy thinks less of you. Ours:
  two towns bid on one place; he takes one side; the other town's board no longer has its side, and when he is paid, that town likes him
  less (the road events' own 'minor_offensive_action', -10).

## 2. THE KINDS (records/target/BOHEMIA_JOB_KINDS.json kinds; words draft:true)
| kind | the legs | the fights |
|---|---|---|
| night-watch (WATCH) | the place, waiting for dark; the same place again after 150 minutes of the small hours; back to be paid | 2, each split 2 (0.65) |
| turn (CARRY) | pick it up; HALFWAY a talk: finish (a fight, then back to be paid), give it back (paid there, 0.3 to 0.6 of the pay by the choice, 'paid', one marked line in slices/bohemia_job_kinds.js legTalk), walk away (lost) | 1 if he finishes |
| bid (TAKE A SIDE) | the place; back to be paid; the last leg tells the other town | 1 whole |
TUNING's one table section Y: job_kinds.night_watch_share, night_watch_wait, turn_paid_there, bid_rival.

## 3. THE FIFTEEN (board_people jb-escort-water/trunks/strongbox, jb-watch-clinic/tunnel/depot, jb-turn-speakers/panels/courier,
jb-bid-water-blues/reds, jb-bid-tv-network/anarchists, jb-bid-hall-church/mob; pay ECONOMY's bake)
| job | town | skulls | pay | to his place |
|---|---|---|---|---|
| Walk the water drums to the dry camp | Caravans | 1 | 38 | |
| Walk the costume trunks to the old bandshell | Colorful | 2 | 64 | |
| Walk the strongbox to the tower bank | Reds | 3 | 168 | |
| Watch the clinic tent through the night | Volunteers | 1 | 85 | a nurse from the clinic |
| Keep the tunnel mouth through the night | Homeless | 2 | 137 | |
| Hold the fuel depot until dawn | Remnants | 3 | 189 | |
| Carry the speakers to the show (they were stolen from the Colorful's club) | Anarchists | 1 | 34 | |
| Bring the panels down off the old school roof (they light a classroom) | Trades | 2 | 60 | one panel, if he keeps one |
| Walk the courier to the old relay (he carries everybody's feed) | Network | 3 | 90 | |
| Clear the water plant: for the co-op, or for the Reds | Blues / Reds | 1 | 34 | a tank of water (the co-op's side) |
| Clear the old TV station: for the Network, or for the pirate radio | Network / Anarchists | 2 | 60 | |
| Clear the big market hall: for a shelter, or for a card room | Church / Mob | 3 | 90 | a family (the Church's side) |

## 4. WHAT THE CODE DOES (marked JOBS 11/14)
- slices/bohemia_board_shelf.js: __A_READ_BOARD_STAYS_READ__ (seen(name, ids, day); a read town's deal is its read people); a job two towns
  bid on is gone from both boards once he holds or finished either (free(), and the memory's path).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html openB('board'): the board he opens is marked read.
- slices/bohemia_job_kinds.js legTalk: go 'paid' ends the job where he stands, paid by the choice's part.
- slices/bohemia_job_kinds.js asks(): a night's fight is said as 'a fight with about N of whoever comes in the dark' (the day turns at
  nightfall, so today's roll can name the wrong animal: measured, the card said 2 men and a bull came at the clinic tent).
- slices/bohemia_job_danger.js, the marked naming line: a job that asked for beasts names the animal it met (the tunnel watch's end
  screen said WHATEVER CAME UP THE TUNNEL ARE DOWN for one hyena; the card already said '1 hyena').

## 5. ON HIS PHONE (tools/bohemia_jobs_the_new_kinds_on_the_phone.js --set r4; the gate's own walks)
The gate's own walks (THE NIGHT, THE TURN AND THE BID P1, P2; rebased onto main at 11/14m), a new crew, the valley K7QM9X; each kind's
first job of its list on the first day its own town's board posts it; no photographs kept (the VOTE picture is one 147 KB JPEG):
| kind | job, town, day | the fights met | paid | and |
|---|---|---|---|---|
| escort | the water drums, Caravans, day 1 | THE RAIDERS AFTER THE WATER DRUMS (the raid ahead on his road) | 57, +120 CLOUT | |
| night watch | the clinic tent, Volunteers, day 10 | THE ONES WHO CAME FOR THE MEDICINE; then a bull (demo) or a hog (alpha) before dawn | 142, +100 CLOUT | A NURSE FROM THE CLINIC for his place |
| changes halfway | the courier, Network, day 1 (alpha sideways day 7) | the talk HALFWAY, 'Finish the job.', THE KING HOBO'S RUNNERS | 161, +100 CLOUT | |
| two towns bid | the water plant for the Blues, day 1 | THE SQUATTERS AT THE WATER PLANT | 65, +100 CLOUT | the Reds' side gone from the Reds' board; A TANK OF THE CO-OP'S WATER for his place |
| row 610 | the Anarchists' board read on day 1, read again on day 2 (the same window) | | | the same people, all four walks |
All sixteen jobs (four kinds, demo and alpha, upright and sideways) taken off the board with a finger, Take it, and paid.
FOUND ON THE WAY (routed to FIXES 2, beside EYES rows 611 and 612): on the alpha sideways the Network client's button stood on the
board on days 1 and 4 but kept moving under the finger for ten seconds (the list re-drawing under him); on day 7 it held still and the
job played. The walk also records, for every walk, two 'posted' days where the town's screen showed another day's board: the walk
jumps the calendar (DAY.day) between towns, which a player cannot, so those are the proof's shortcut, said, and it takes the next.

## 5b. GATES (this tree, rebased onto main at 11/14m)
- THE NIGHT, THE TURN AND THE BID (new, in the suite): 19 passed, 0 failed (JOBS_PLANT=1: a red in each planted copy; R5's own plant).
- THE NEW KINDS (11/11) file legs 19/0 with JOBS_PLANT=1 (N6 taught that a bid's other side leaves when he takes one); THE BOARDS ALWAYS
  HAVE WORK's node legs W1 to W6 green; HANDOFF 10/0; the pay bake --check; DEMO cut --check exact.


## 6. WHAT IS NOT HERE, SAID
- The walk to each stop is the proof's one shortcut (the crew is put on the stop and the map's own arrival is called); the board, the
  card, Take it, every fight, its end screen, the halfway talk (a finger on its first choice) and LEAVE are the page's own.
- No photographs are kept this round (rule 447(b): the site is at 894 of 900 megabytes); the VOTE picture is one small JPEG.
- The escort's raid is set off where the road meets it, the six contracts' own way (11/10).

[bb Battle Brothers' Return Item turns on the road with a shady man's offer; ours turns halfway with the truth, and he picks the side]
[analog horror: the board you read last night is the board you get, the same faces, even after the one who hired you stopped answering]
