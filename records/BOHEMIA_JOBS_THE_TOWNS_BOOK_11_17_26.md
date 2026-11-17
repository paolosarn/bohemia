# JOBS: THE TOWN'S BOOK, 11/17/26 (VAMILY rules 453, 454(a), 441; the coordinator's routine 'JOBS full sweep')

THE ASK: the jobs' SYSTEMS, the way Battle Brothers runs them, from the library; NO new prose and no standing line rewritten (rule 454(a),
his: 'every time you have a human talk it's so fucking bad... don't do anything to fix it yet'): (1) how a town feels about him moves
with the jobs he does and fails there, and changes what that town offers and charges; (2) a job's danger shown before he takes it, and
pay he can push up at a cost; (3) what failing or walking away costs; (4) a job that pays into his own settlement. Each its own build.

## 0. MEASURED FIRST (main at b94bd4920)
- (1) A town's bar (records/target/bb/relations.json, the wiki's nine bands, start 50, drift 0.25 a dawn) already moved with every job
  settled there (done +10, part +5, failed -20, dropped -10: bb_all/1670) and bent the pay (job_pay.json standing, -15% to +15%); its
  shelves charged less above Neutral (settlement_traits.json relation_prices, the Market page). MISSING: below Neutral nothing moved
  ('the page says nothing'; the Game Guide does say it), and the bar never changed what a town OFFERS (the pay table's own note:
  'Battle Brothers' refusal... is left for later').
- (2) The danger before the yes stands (the stars, the blood price, 11/11's WHAT IT ASKS). MISSING: no way to push the pay on the
  board's card (the 9/11 haggle module serves the old street card, built when every job paid one).
- (3) Dropping and failing already cost standing and CLOUT. MISSING: the card never says it before the yes.
- (4) 11/14's four jobs pay into his place by their own legs. MISSING: a way for any job to.

## 1. BUILD A, THE TOWN REMEMBERS
HOW BATTLE BROTHERS DOES IT: 'Relations < 50: ± (50 − relations) × 0.6% for a range of 0-30% (added if buying, subtracted if selling)...
Negative relations are doubly as penalized as positive relations are rewarded' (bb_all/0827 Game Guide, Economy); settlements are 'the only
factions you can have friendly interactions with (receive Contracts, trade...)' and the fortified towns' contracts wait for Professional
renown (bb_all/0724).
OURS:
- The price (records/target/settlement_traits.json relation_prices.below; the town screen's relPrice, marked JOBS 11/17): below Neutral the
  buy side rises to 30% of worth at Hostile 0 and the sell side falls 4% of worth (twice the Market page's top-of-the-bar 2%).
- What a town offers (records/target/bb/relations.json board, ours; engine/bohemia_job_pay.js board(); slices/bohemia_board_shelf.js
  __THE_TOWN_REMEMBERS__): Cold, Unfriendly and Threatening keep their three-skull work from him (the news's work too); Hostile gives him
  one one-skull job (a board is never empty, rule 335); Friendly and up post one job more (never over four). A read board stays read.
- TUNING's one table section Y: relation_prices.below, relations.board.
MEASURED (node, gate A2, A3): the price at 0, 25, 50, 100: buy -30%/-15%/0/+15% of worth (as subtracted), sell -4%/-2%/0/+2%; fourteen
towns over ten windows: 1.93 jobs a board at Neutral, 2.93 at Friendly, no board over four; three-skull boards 63 at Neutral, 0 at Cold;
Hostile boards one job each, never over one skull; planted (the trust off) the cold boards carry three-skull work again.
ON HIS PHONE: (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build A; gate A4, the demo and the alpha, upright and sideways, a new crew, K7QM9X):
a one-skull job taken by the board's own message and played to the pay moved its town's bar 50 -> 60 in all four (Church: the map made
the job Church's); Network's board at 50 read 3 people, at 75 (Friendly, a fresh window) 4; Mob's shelf at 25 charged x1.151 the
Neutral price over its 22 items; Mob's board at 25 carried no three-skull job (it had one, a market-day job, before the news's work was
trusted the same).
A BUG FOUND ON THE WAY AND FIXED: on the alpha held sideways, the town's first open came before its relations.json had loaded, and the
town screen's relMove returned nothing: the finished job's +10 was thrown away for good (bar 50 -> 50). Now the settled acts wait for the
bands (REL_WAIT, slices/BOHEMIA_SETTLEMENT_SCREEN.html, marked JOBS 11/17) and the alpha sideways reads 50 -> 60. GATE: THE TOWN'S BOOK
with JOBS_BUILD=A 5/0.

## 2. BUILD B, PUSH THE PAY
HOW BATTLE BROTHERS DOES IT: 'each haggling attempt will worsen Relations by 0.5 points... If you ask for more pay, the value of the
contract increases between 4-11%' and pushed past the client's patience (annoyance 3 to 6 an ask, out at 9) the company is thrown out,
-2.5 (bb_all/0441, bb_all/1670; records/target/bb/contract_terms.json haggle, ECONOMY's pull of the same page).
OURS (slices/BOHEMIA_SETTLEMENT_SCREEN.html __PUSH_THE_PAY__; records/target/bb/relations.json acts.haggle and haggle; TUNING's one table
relations.haggle and relations.acts.haggle):
- On every job's card, above Take it, an ask: 'Ask +7%' with its cost beside it ('-0.5 STANDING'). Each ask lands 7% on the pay (the
  middle of the wiki's 4-11%) and costs 0.5 of this town's bar, the wiki's own number. The house's rule of 9/11 (the street card's haggle:
  'Two asks land. The third ends it.') stands: it is told, never rolled, so the third ask's button says so before the tap ('Ask again,
  THEY WALK · -3 STANDING') and that tap ends it: the 0.5 and the wiki's -2.5, and that person is gone from this board AND the phone's
  list until the board turns (refresh_days), kept in bohemia.haggle.v1 (slices/bohemia_board_shelf.js leaves them out of pick()).
- The client's own line is not touched (rule 454(a)): its {pay} reads the pushed number. The pushed base rides to the map with the
  contract, so the map's own sum (the start's add, CLOUT, the standing) is made on it.
MEASURED (node, gate B2): the card's own sum: 100 stays 100, one ask 107, two 114; a 57-battery base two asks 65.
ON HIS PHONE (tools/bohemia_jobs_the_towns_book_on_the_phone.js --build B; gate B3; a new crew, K7QM9X, Caravans at Neutral, day 16):
Teo Abernathy's water drums, base 38: two asks with a finger, the card's line read 57 -> 62 -> 66 batteries, the town's bar 50 -> 49.5
-> 49; Take it, and the map held the job at 66 (its own sum on the pushed 44; 57 unpushed). The ring-trucks job asked three times: they
walked, the bar -4.0 (three asks and the walk), gone from the board, gone again when he walked back in, and not on the phone's list.
FOUND ON THE WAY AND FIXED: on the alpha held sideways the alpha's tabs and the top bar leave the card 288 px, and the ask pushed Not
now half under the edge (264-308 px; nothing on that card scrolls). On a short screen held sideways the ask now sits beside Take it
(.acts.offer, a two-wide row), so all three are on the glass (168-212, 168-212, 216-260); gate B3 now fails any card button off the
glass. MAIN WAS RED ON RELATIONS SINCE BUILD A: its gate reads only the wiki's Relations page and refused acts.haggle (the Contracts
page's -0.5); it now holds such an act to the same standard, its quote word for word from that page out of the tarball and its number
the quoted one (gates/relations_gate.js, marked JOBS 11/17; three planted mistakes each bite). (The test's own finger also learned two things: it no longer nudges a frame it can already see, the screen snaps it back; and it
reads a scaled frame by its drawn size.) GATE: THE TOWN'S BOOK with JOBS_BUILD=B.

## 3. BUILD C, WHAT FAILING OR WALKING AWAY COSTS
(next)

## 4. BUILD D, PAID INTO HIS OWN PLACE
(next)

## 5. WHAT IS NOT HERE, SAID
- No line a person speaks is new or rewritten (rule 454(a)); the only new words are the fewest labels, draft.
- The phone proof sets a town's bar in the game's own relations record to reach Friendly or Unfriendly at once (the one shortcut, said);
  the job that moves the bar is played to the pay.

[bb Battle Brothers' towns trade better with friends and hand big contracts only to a company they know; ours now do both]
[analog horror: the board is shorter at the town that remembers what you did there, and nobody says why]
