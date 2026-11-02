# ECONOMY -- the handoff block (rule 215; written only by ECONOMY, newest first; older blocks in ECONOMY_ARCHIVE.md)

ECONOMY: 11/2 LATEST -- ECONOMY 2 [a job pays for the time and the risk] SHIPPED, BUILD 11/3zc, the walk's smaller margin 11/3zd - THE WORK PAYS (rule 323 and
its amendment the same round, ask lines 320 and 321). NOT YET SEEN.
Record: records/BOHEMIA_ECONOMY_A_JOB_PAYS_FOR_THE_TIME_AND_THE_RISK_11_2_26.md
MEASURED: every board job paid 30 a skull flat; the dog hunt (qd-aa01, 1 skull, 11 dogs, about 4 fights) paid 30, 8.2 a fight.
BUILT: records/target/bb/job_pay.json (every number with its reason) + engine/bohemia_job_pay.js (the formula and the standing) +
tools/bohemia_economy_job_pay.js (bake / --table / --purse / --check). pay = map hours x 2.75 for killing work, 2.06 for a walk (crew 1.375 x 2 or x 1.5) + fights x 26 x
skulls (THE VIOLENCE PREMIUM; a hunt per head, heads/3); killing work never under its old pay (30 a skull); a job with no killing only
10 a skull, so walks pay clearly less. The shelf's baker reads 'pays'; the board people's pay is written in place.
STANDING: the client town's bar bends the offer, 0.85 (hostile) to 1.15 (allied), the word on the town's board under the trip
("A FRIEND'S PRICE: +8% PAY"), with "KILLING WORK: THE BLOOD PRICE IS IN IT" or "NO KILLING EXPECTED: WALKING PAY"; the map's
loopJobPay(base, place, st), the take carries the board's number, the phone passes the place.
NUMBERS: dogs 30 -> 116 (125 at a friendly town); wolves 90 -> 198; holds x2.3; escorts x1.9; one-fight jobs unchanged; scout 35 -> 10,
envoy 40 -> 16, carry 60 -> 23. No killing job under 2.75 a map hour, no walk under 2.06. Purse probe (a ceiling): x1.43 at day 30, x1.39 at day 50, x1.31 a map hour.
GATE: gates/a_job_pays_for_the_time_and_the_risk_gate.js (23 ok, in the suite); the board gate's pay check reads the table.
LEFT: WORLD 4's measured hours (records/BOHEMIA_WORLD_A_JOBS_TIME_IS_THE_TRUTH_11_2_26.md, not landed) replace the modelled hours,
re-run the tool; Battle Brothers' refusal below THREATENING; the phone card's words (UI); money_teaches tool broken on main ("THE HALL MOVED").

ECONOMY: 11/2 -- [the delivery service] DESIGNED, NOT BUILT (ask line 296, rule 303). Design only, no game
code, no live data file.
Record: records/BOHEMIA_ECONOMY_THE_DELIVERY_SERVICE_DESIGN_11_2_26.md
THE DESIGN IN ONE LINE: the Caravans (existing faction, neutral outside-world trade) take orders on the cracked phone
in the city view; price = worth x 1.5 x (1 + 0.10 a road day) x road danger x Cartel cut x standing, capped at 2.5x
worth, never cheaper than a stall and never flippable; half up front; 1 to 3 map days to a town you have visited;
raid odds (2/8/20 percent, max 30) shown before you pay; a raided load lies on the map 5 days, yours for the half you
paid if you take it back, else the whole deposit returns. Never orderable: god gear and named pieces, people,
cells, max HP, quest things, boss verbs.
NUMBERS: a proposed shape for records/target/bb/delivery.json is on the page (section 4); not written.
BUILD ORDER: ECONOMY (data file, pure quote function, gate) -> WORDS (dispatcher lines, draft:true) -> UI (phone
thread, quote lines, odds, tracking dot) -> WORLD (the load on the map clock, the raid, the raided-load place,
collection at the town's Caravans post with RUN).
FORKS FOR PAOLO (the coordinator asks): F1 best gear, price only (A) or Caravans standing (B); F2 ride along as your
own load's guard, yes (A) or no (B); F3 lands at any visited town (A) or only truck stops and swap meets (B).
PENDING Paolo: the three forks above, nothing else new.
