# JOBS 2 -- THE WORK FOLLOWS WHAT IS SHORT (BUILD 11/27c - THE WORK FOLLOWS WHAT IS SHORT), 11/27/26

VAMILY rules 485(b) and 482; the coordinator's routine 'JOBS 2: rule 482': 'the jobs better again, now inside rule 485's running
economy (a job's pay and its client follow what the city is short of; ECONOMY THREE has the calls)'. Ask row 752 (rule 485, owners
ECONOMY THREE, WORLD 15, WORLD 13): this is the jobs' part. Rules 441, 466(c), 465, 480.

## WHAT THE CITY IS SHORT OF, MEASURED (the game's own, nothing new beside it, rule 485(c))
The valley already runs one ledger (engine/bohemia_economy.js, the map's mktLedger(), advanced every day by mktAdvanceDay: 'IT RUNS
OUT WHETHER OR NOT YOU LOOK AT IT'): water, food, meds and fuel have a daily need, salvage and power none. Its price of a good is 1 at
30 days of supply and more and climbs to 40 when it is out (scarcityMult). Measured on the demo, a new crew, the valley K7QM9X, 104
people: food 8.5 days on day 1 (price 3.5), out by day 14; meds 30 days, out by day 30; water 60 days, out by day 60 (the pumps
add); fuel 70 days. The ledger is built when the map loads (0.6 ms), so reading it costs nothing (rule 480).
Before this build no job read it: the seed sacks paid the same on day 1 and on the day the valley ran out of food.

## BUILT (__THE_WORK_FOLLOWS_WHAT_IS_SHORT__)
- slices/bohemia_job_kinds.js short(offer): the job's good from its title's words (records/target/bb/job_pay.json short.goods: water
  16 jobs, food 4, meds 5, fuel 2; 75 carry none), the ledger's price for it, and the pay's bend 1 + share x log2(price), at most
  cap (share 0.1, cap 1.5, draft for ECONOMY THREE's call): food on day 1 +18%, a week in +36%, out +50%. Log, not the price itself:
  the ledger's siege price would make one carrying job worth forty.
- THE PAY: the map's loopJobPay takes the job (the contract, the phone's list), the town's board shows payShown(pay, job) with the
  same bend, and the contract carries the board's number (short.mult, beside standing), so what he is shown is what he is paid.
- THE CLIENT: the board's deal asks one job that brings what the valley is short of right after the town's own person
  (slices/bohemia_board_shelf.js), in the draft (the valley and the day, never a read: A JOB HAS ONE DOOR holds; the draft's key
  carries what is short).
- No word is added to a card (rule 466(c)) and no person's line changes (rule 465): the pay and the order say it.

## MEASURED NOW
- THE WORK FOLLOWS WHAT IS SHORT (new, gates/the_work_follows_what_is_short_gate.js) 6/0: S1 the words (the drums water, the insulin
  meds, the seed food, the propane fuel, the tyres none); S2 the curve (1 1 1.005 1.058 1.158 1.182 1.258 1.391 1.5 1.5 from 60 days
  down to none); S1p the curve without its cap planted; S3 the deal short of food: 3 places ask a food job (0 when nothing is short),
  one door; S4 on the demo and the alpha upright: a food job on the phone's list pays its pay x the bend (jk-farm-mob 114 -> 135),
  every job on Caravans' board shows what the map pays for it.
- The picture (tools/bohemia_jobs_the_work_follows_what_is_short_picture.js): the Anarchists' board on day 1, BRING THE SEED SACKS UP
  FROM THE RIVER for Hermana Rocio, who keeps the greenhouse alive: 120 before, 142 now. records/target/JOBS_TWO_THE_WORK_FOLLOWS_WHAT_IS_SHORT.jpg.
- A JOB HAS ONE DOOR 4/0, THE TOWN'S BOOK files 10/0. A JOB PAYS FOR THE TIME AND THE RISK 23/0 (its pay table re-written by its own
  tool with the short entry in it; its wire checks take the job beside the standing). MONEY TEACHES 3/1 and THE BATTERY IS REAL 51/2:
  the same reds on main (the money's walk; the camp's copied prices), not this build's.

## FOR ECONOMY THREE (the calls): the share and the cap (job_pay.json short, draft), the words that tie a job to a good, and whether
the valley's ledger is the city's or each town keeps its own (rule 485(b): 'a place that stops earning goes dark'); a town's own
shortage would bend its own jobs the same way through short().

[bb Battle Brothers' settlements show their situation (a food shortage, a sickness) and the contracts there pay for what they lack]
[analog horror: the greenhouse woman pays more each week, and the stall with the bread closes earlier every day]
