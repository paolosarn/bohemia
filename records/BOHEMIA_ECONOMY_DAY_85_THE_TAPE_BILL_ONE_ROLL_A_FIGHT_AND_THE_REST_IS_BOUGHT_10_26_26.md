# ECONOMY DAY 85: THE TAPE BILL. ONE ROLL A FIGHT, AND THE REST IS BOUGHT (10/26/26)

VAMILY ECONOMY [the tape bar re-aimed] ONE-ROLL-A-FIGHT, rule 284 (Paolo 10/26, LOCKED: "you're about to crash my economy...
now I'm winning way too much duct tape after each fight... what were you trying to do with that scrap idea... if you have a
number that feels better use it, then just make it so I get one duct tape or something like that as a baseline if you have
no clue"; records/BOHEMIA_PAOLO_ONE_ROLL_OF_TAPE_A_FIGHT_NOT_A_PILE_10_26_26.md). Fired by the coordinator's routine
(trig_01Pw8sNfnuoYSfe1G1okVxAJ). RUN FOUR set the loot to one roll a won fight and zeroed this lane's per_kill and
tape_per_scrap (his ruling, RUN FOUR's commit); this page re-aims the bar and says what the tape costs.

---

## 0. THE ANSWER

1. **I WAS WRONG ABOUT THE LOOT.** Day 84 made the loot carry the tape (two or three rolls a dead man, two a wrecked piece);
   on the live demo one road fight paid thirteen rolls (40 to 53), most of a stall's stack. He felt the economy break. His
   ruling stands: **one roll a won fight**, nothing from kills or wrecks, nothing from a lost one.
2. **THE REST IS BOUGHT, BATTLE BROTHERS' WAY** (bb_all/2014: tools come from the market): the stall's shelf at a battery a
   roll (refilled every map day, Day 84), the back room at two past it, or the smith's mend for twice the tape (Day 84 s6).
3. **WHAT IT COSTS, AT FIVE FIGHTS A MAP DAY** (rolled months, TUNING's bench for what a fight breaks):

| company | breaks a day | loots a day | buys a day | the tape bill | the fights pay | share | left after food |
|---|---|---|---|---|---|---|---|
| A NEW CREW (three), from a camp | 26 | 3.7 | 16 off the shelf + 6 from the back | **27** | 110 | **25%** | +77 |
| A NEW CREW, from a town | 26 | 3.7 | 20 + 1 | **22** | 110 | **20%** | +81 |
| A NEW CREW, from a fortress | 26 | 3.7 | 21 + 0 | **22** | 111 | **20%** | +83 |
| THE BLOCK WATCH (twelve), from a camp | 77 | 4.3 | 20 + 53 | **125** | 129 | **97%** | **-20** |
| THE BLOCK WATCH, from a town | 77 | 4.3 | 39 + 33 | **106** | 129 | **82%** | **-1** |
| THE BLOCK WATCH, from a fortress | 77 | 4.3 | 54 + 18 | **90** | 130 | **70%** | +15 |
| THE LONE WOLF, from a camp | 35 | 1.8 | 19 + 13 | **46** | 55 | **85%** | +7 |
| THE LONE WOLF, from a town | 35 | 1.8 | 29 + 4 | **36** | 55 | **66%** | +17 |
| THE LONE WOLF, from a fortress | 35 | 1.8 | 32 + 1 | **33** | 55 | **60%** | +20 |

   In plain words: **a crew of three buys about four rolls a fight, four to five batteries out of the thirty a won job pays:
   a fifth of its pay goes on tape, and it stays well in the black.** The one roll a fight is about a seventh of what a fight
   breaks; the stall is where tape comes from.
4. **TWELVE MEN CANNOT KEEP THEIR ARMOUR UP ON ROUTINE PAY** from a camp or a town at this pace: their tape eats 82 to 97
   percent of what one-skull jobs pay, and with their food they lose money. A NOTE on TUNING's board says so (284(e): the price
   or the pay moves, never the loot past three): a won fight paying 35 keeps them level from a camp (30 from a town, 27 from a
   fortress); a two-skull job (60) puts them about 110 a day in the black. A company that size is meant for bigger jobs; the
   board's skulls and the renown multiplier are where that lives (TUNING, WORLD).
5. **THE LONE WOLF** pays two thirds of his pay in tape (his heavy kit, half his fights dogs, 37 in 100 won) and stays in the
   black from every home, thinly from a camp. Reported.

---

## 1. WHAT CHANGED IN THE MODEL (tools/bohemia_economy_tape_income.js)

- The loot: `loot_tape.per_won_fight` (RUN FOUR's number, 1), plus `per_kill` (now 0).
- Every fight's mending is paid from what he carries, then the home stall's shelf at its price, then the back room's (the
  smith's mend for the same damage costs the same, about two a roll's worth).
- A won fight pays the board's routine job (records/target/BOHEMIA_BOARD_SHELF.json, the least, 30); a lost one nothing; the
  crew eats its nights (nightly_bill.json, 2 a man). Loot sold and the gear's worth are left out: the bill is a ceiling, the
  pay a floor.
- What a fight breaks: TUNING's bench (banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json), rolled through its median and worst
  tenth, scaled to its mean. Five fights a map day (rule 264).

## 2. THE BAR, RE-AIMED (284(g): one roll plus the stall plus the smith, against what a fight pays)

gates/no_run_ends_for_tape_gate.js, NO RUN ENDS FOR TAPE:
- L: one roll a won fight, nothing a kill, nothing a wrecked piece, never above three (284(a)(b)(e)).
- S and C: the shelf (a stack, every day, the back room) and the smith's price, as Day 84.
- N1: A NEW CREW keeps its armour up on what its fights pay from every home: in the black nine months in ten or more, under a
  third of its pay on tape. N2: any company that cannot is named on TUNING's board.
- M: tape at three a roll, the loot at four, a five-roll shelf with a back room at five: each turns it red.

271(b)'s "the tape he can get covers the armour a fight breaks, with some to spare" now reads: **the tape he can BUY on what his
fights pay**. The tape is always there (every stall, every day, the back room never empty); what a run can run out of is money,
and for a crew of three it never does.

## 3. THE FINDINGS THAT PROVE US WRONG

1. **Day 84's loot was this lane's mistake.** It sized the loot to cover what fights break by themselves, which turned tape
   into loot money (13 rolls a road fight, half a battery each at the stall). Battle Brothers' own page never gives the loot an
   amount and its company buys its tools. His one roll is right.
2. **The pace is still the problem underneath.** Battle Brothers' tape per point at five fights a day: a company that grows
   pays for it. TUNING's 264(h) scaled healing by five and left the tape per point; for twelve men that is the line that
   breaks. The lever is TUNING's (the roll's 15 points, the pay of a bigger company's jobs), never the loot.

## 4. ROUTED

- **TUNING**: NOTE [the tape bill] on your board: the twelve's numbers and the two levers.
- **RUN TWO**: nothing new (the shelf daily, the smith's price, Day 84's NOTEs stand).
- **RUN FOUR**: nothing new; its commit made the loot one roll.
- **EYES**: 284(h) on the live game.

## 5. GATES (rule 13)

NO RUN ENDS FOR TAPE re-aimed (L, F, S, C, N, M), BUY VERSUS SELL 45/0, HANDOFF and OPEN ROW as on main.
