# ECONOMY -- the handoff block (rule 215; written only by ECONOMY, newest first; older blocks in ECONOMY_ARCHIVE.md)

ECONOMY: 11/7 LATEST -- ECONOMY [trade goods carried] SHIPPED, BUILD 11/7m - TRADE GOODS, BUY LOW SELL HIGH (rule 425(b),
asks 196 and 197, rules 265(b) and 266). BUILT, NOT YET SEEN.
Record: records/BOHEMIA_ECONOMY_TRADE_GOODS_CARRIED_11_7_26.md
MEASURED: the twelve goods and Battle Brothers' prices sat in stall_prices.json since Day 83 and the map's marks waited for a tap;
no stall sold a good, nothing rode in the stash, nothing sold (asks 196 and 197 both HALF).
BUILT: every stall's TRADE GOODS lines (slices/BOHEMIA_SETTLEMENT_SCREEN.html __TRADE_GOODS_CARRIED__): the maker's batch a week
(camp 1, town or fortress 2) at the plain price, every good he carries, BUY and SELL side by side, one tap lights, two do it; one
good = one stash slot (engine tradeItem, trade.slot 1); every stall buys (maker 15/100, elsewhere 110/100, size 95/102/110,
trade.sold_floor 1 so never nothing), the shops' bags at the same price; sold-here buys back at what it paid (rule 248); the strip
names the best price he KNOWS elsewhere. The crew screen (BOHEMIA_ROSTER_SCREEN.html): a good wears its pack tile, one tap lists
the two best towns he knows and lights the map's marks, two taps close onto the map; nobody wears a good; the last sale clears the
marks. Twelve pack tiles copied as-is (slices/market_icons/g_<good>.png). A modder edits one file: stall_prices.json trade.goods.
WALKED: copper wire 21 at the Trades' camp, the Mob 26 calm (33 on market day), the Homeless' camp 22.
GATE: gates/trade_goods_carried_gate.js (in the suite): data 4/0 with five planted fails, phone 11/0, computer 11/0 (L9 planted live).
FIXED ON THE WAY: BUY VERSUS SELL 44/1 -> 45/0 (S1's bar read a 10-battery walk as 'a routine contract' since job pay; now the
cheapest killing job, floor 30).
MAIN'S OWN REDS, MEASURED ON CLEAN MAIN: NO RUN ENDS FOR TAPE 16/3 (N1), THE SMITH MENDS 6/2 (M1, M4), THE MARKET IN THE PACK'S
ART 7/1 (w_pistol, COOK's golden piece).
LEFT: a good sold where it is not made vanishes when he leaves (Battle Brothers keeps it on the shelf); no clear button on the
map (WORLD TWO's screen); goods' names draft (WORDS); CAMP TWO's trader follower not wired.
PENDING Paolo: nothing.
[bb Battle Brothers: made here buys 100 / sells 15, elsewhere 150 / 110, size 95/102/110, one item a good, no map of who pays;
ours keeps the numbers, a batch a week, and the map says who pays from what he saw and heard.]
[analog horror: candles burned down and poured again, rings and teeth melted to bars, copper pulled out of empty walls.]

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
