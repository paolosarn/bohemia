# ECONOMY DAY 84: NO RUN ENDS FOR TAPE (10/26/26)

VAMILY ECONOMY [tape income against armour wear] NO-RUN-ENDS-FOR-TAPE, rule 271(b) (Paolo 10/26, LOCKED: "I just feel like
there's not enough duct tape repaired tool shit like to be able to be bought or like loot in the world so like it feels like
when my armor runs out like it's my runs over right now... You should make that more available";
records/BOHEMIA_PAOLO_ALL_EIGHTEEN_FOLLOWERS_TAPE_THAT_KEEPS_A_RUN_ALIVE_AND_THE_ARMOUR_SHOWS_10_26_26.md). Fired by the
coordinator's routine (trig_017BhvZudBpJQKLjLRqhqLxD) after [trade goods]. RUN FOUR builds the loot's tape ([tape in the
loot]), CAMP the salvage, CAMP TWO the Scavenger; this page gives the numbers and the proof.

Built: records/target/bb/tape_income.json (new: the loot's tape, the Scavenger, scrap is tape, the bar); records/target/bb/
stall_prices.json tape_shelf.restock_days 3 to 1 and mend (s6, [the craftsman's price], rule 277(b)), engine/
bohemia_stall_prices.js mendPrice; tools/bohemia_economy_tape_income.js (rolled months); gates/
no_run_ends_for_tape_gate.js, in the suite as NO RUN ENDS FOR TAPE 18/0 (three mutations red); TUNING's one table section R.

---

## 0. THE ANSWER

1. **WHY HIS RUNS DIED.** A won fight breaks Battle Brothers' tape (15 armour points a roll), but our map holds about five
   fights a day where Battle Brothers holds one (rule 264). TUNING's bench (600 fights): a crew of three breaks about 5
   rolls a fight, twelve men about 16, the Lone Wolf 7. At our pace that is **26 rolls a day for three, 77 for twelve**. Until
   this round the stall sold none, the loot carried none, and nothing came back: the armour ran out, then the run.
2. **THE STALL REFILLS ITS TAPE EVERY MAP DAY** (camp 20, town 40, fortress 60, the Trades twice; at 1 a roll; past it the
   back room at 2, never sold out). Battle Brothers refills every 3 days; one of our days holds four to six of theirs, the
   same reason TUNING scaled healing five times.
3. **EVERY MAN HE KILLS CARRIES TWO OR THREE ROLLS** (never a dog; only the dead, as the loot already reads). Scaled to the
   kills, as he ruled.
4. **THE SCAVENGER IS BATTLE BROTHERS' OWN** (0.5 to 1 percent of a destroyed enemy piece's top durability in rolls, 60 a
   fight at most; 10 to 20 percent of the rounds spent), for CAMP TWO's eighteen followers.
5. **SCRAP IS TAPE: TWO ROLLS A WRECKED PIECE, STRAIGHT FROM THE LOOT** (his rule 276, the same hour: "what is scrap, why am
   I not getting more duct tape"; the loot already finds one scrap for every piece worn under the drop line). This page first
   had it broken down at camp, an hour a piece; 276 puts it straight into his tape.
6. **THE PROOF, ON ROLLED MONTHS** (30 days, five fights a day, 120 runs a cell): a new crew has **1.6 to 1.7 times** the
   tape it breaks from any home; twelve men **1.15** (a camp), **1.28** (a town), **1.34** (a fortress); the bar was 1.1
   ("some to spare"). The loot alone returns 1.13 of what a new crew breaks and 0.9 of twelve men's. The Lone Wolf, who fights
   dogs half the time and loses most fights, is covered from a town (1.12) or a fortress (1.15), not a camp (0.76): his tape
   is the stall's, and the back room is always there.

---

## 1. HOW BATTLE BROTHERS DOES IT (the wiki copy, quoted)

- bb_all/2014_Tools and Supplies.txt: "One point of Tools and Supplies is required to repair 15 points of item durability."
  "Can be looted after battle." (no amount). "Workshop substantially increases availability at adequate price." "Large
  settlements have higher availability." Carry: "150 - for Veteran and Expert; 200 - for Beginner".
- bb_all/2018_Trade.txt: tools are sold "200 for 20" (at ten to one, a battery a roll).
- bb_all/1972_The Scavenger (Follower).txt: "Recovers 10-20% of spent ammo." "Only fully destroyed (not just damaged)
  enemy body armor and helmets are eligible for tools recovery." "capped at 60 tools... the number of tools recovered is
  equal to 0.5-1% of maximum durability of destroyed enemy armor."
- bb_all/0827_Game Guide.txt: "Shops resupply every 3 days".
So in Battle Brothers tools come almost all from the market, and a company fighting once a day buys a stack every few days.
At five fights a day the same market starves a company: that is his "when my armour runs out my run's over".

---

## 2. THE NUMBERS AND WHY

| source | number | why |
|---|---|---|
| the stall's shelf | camp 20, town 40, fortress 60 rolls a map day (the Trades twice), never under 20, 1 a roll, the back room 2 | his 265(a); a stack is Battle Brothers' one tools item; refilled daily for our pace |
| the loot | 2 or 3 rolls from every man killed, never a dog | his 271(a), 'scaled to the kills'; at a roll or two twelve men had 0.81 of what they break from a camp |
| the Scavenger | 0.5 to 1 percent of a destroyed enemy piece's top in rolls, 60 a fight at most; 10 to 20 percent of rounds | Battle Brothers' page, word for word |
| scrap is tape | 2 rolls a wrecked piece, straight from the loot (his 276) | his 271(a) and 276(a); twice what the Scavenger finds on a 100-point piece, because his men strip it by hand; old saves' scrap converts at the same two |
| the bar | had at least 1.1 times what the fights break, at five fights a day | his 271(b) 'with some to spare'; the busiest pace the map allows, so a slower player is only better off |

The sweep (rolled months, had over needed, the median; a new crew / twelve men, from a camp):

| the shelf refills | loot a man | a new crew | twelve men |
|---|---|---|---|
| 3 days (Battle Brothers) | 1 to 2 | 0.97 | 0.63 |
| 3 days | 2 to 3 | 1.36 | 0.99 |
| every day | 1 to 2 | 1.30 | 0.81 |
| every day | 1 to 3 | 1.45 | 0.99 |
| **every day** | **2 to 3** | **1.62** | **1.15** |

**What it costs him:** a new crew working out of a camp buys about 12 rolls a day (12 batteries) against about 110 a day of
won jobs at the pace; twelve men 18 to 33 a day against about 130 and their wages. Tape is a bill, never the wall.

**What it is worth if he sells it:** the stall buys tape two for a battery (Day 82), so a looted roll he does not need is half
a battery: the loot's tape is never a money machine.

---

## 3. WHAT THE PROOF ASSUMES, SAID OUT LOUD

- **Kills.** Four in five of a won fight's enemies die (the rest flee with their kit). The bench does not count kills; at
  three in five twelve men from a camp fall to 0.94 (a town 1.12, a fortress 1.20) and a new crew still has 1.41. RUN FOUR
  or TUNING can count it on the live fight; the gate re-measures whatever the files say.
- **What a fight breaks** is TUNING's bench (banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json), rolled through its median and
  worst tenth and scaled to its mean; a lost fight breaks the same and loots nothing.
- **He shops at home every day** he can, up to Battle Brothers' carry of 150; salvage and the Scavenger are left out of the
  proof (they are the spare on top).

---

## 4. THE FINDINGS THAT PROVE US WRONG

1. **The pace broke the tape.** Rule 264 scaled healing to our five fights a day and left the tape per point alone ('it is the
   cost, not the speed'). True, but the shop's three-day shelf is a speed too: at our pace it was a fifth of Battle Brothers'
   supply per fight. Fixed for tape; TUNING should check the other three-day clocks (meds, rounds) against the same pace.
2. **The Lone Wolf cannot live on loot.** He wins 37 fights in 100 on TUNING's bench and half his foes are dogs: his loot
   returns about a sixth of his tape. Covered from a town or a fortress; from a camp he pays the back room, about 17 batteries
   a day. TUNING's section J (the gilded god) is where that is weighed.
3. **Day 83's tape shelf said 'restock every 3 days' to RUN TWO** an hour ago; the NOTE is superseded by this one (every map
   day).

---

## 5. ROUTED

- **RUN FOUR** [tape in the loot]: every man killed (only the dead, never a beast) leaves `loot_tape.per_kill` rolls, rolled
  even 2 or 3, into the company's TAPE count (bohemia.supplies.v1 tape), shown in the loot after most fights (271(c)).
- **RUN TWO** [tape at every stall]: the tape shelf refills every map day (`tape_shelf.restock_days` 1, key it by
  `Math.floor(mapDay)`), the rest as Day 83.
- **RUN FOUR** [scrap is tape]: a scrap from the loot (loot.json counts.scrap) is `salvage.tape_per_scrap` rolls (2), straight
  into the company's tape; an old save's scrap converts at the same two. **CAMP TWO**: the Scavenger's numbers are in
  `scavenger`. **CAMP**: nothing to break down at camp (276 made it the loot's).
- **TUNING**: section R's new rows; the kill share; the other three-day clocks against the pace; the Lone Wolf.
- **EYES**: 271(c) on the live game once RUN FOUR's loot is in: 30 rolled days, tape in every town every visit, tape in the
  loot after most fights.

## 6. THE CRAFTSMAN'S PRICE ([the craftsman's price], rule 277(b); Paolo 10/26: 'if I go to a settlement that has a smith
## and an armourer I should be able to repair my stuff with them pretty easily and quickly')

Battle Brothers (bb_all/1763 Settlement buildings): its armourer and weaponsmith "Can instantly repair items (Hold Alt and
click an item), without using the party's tool supply, but at a costly price (heavily depends on the item's worth value)."
The page gives no formula. Ours, in records/target/bb/stall_prices.json mend, read by BohemiaStallPrices.mendPrice:

**HE CHARGES TWICE THE TAPE.** The parts are the tape that much damage takes at this town's stall (one roll for every 15
points, Battle Brothers'), his hands the same again (a repair shop's bill runs about half labour), the town's size and buy
knob on it (a market day's 1.25, a taken town's 1.1), rounded, at least a battery a piece; about an hour of town time for the
whole job (277(c)).

| damage on the piece | a camp | a town | a fortress |
|---|---|---|---|
| 15 points (a dent) | 2 | 2 | 2 |
| 78 (a new crew's typical fight, all pieces) | 10 | 11 | 11 |
| 150 | 19 | 20 | 22 |
| 232 (twelve men's typical fight) | 29 | 32 | 34 |
| 300 | 38 | 41 | 44 |

The choice it makes: QUICK AND DEAR (the smith, an hour, no tape) against SLOW AND CHEAP (his own tape at camp: about half
the money, and the hours of the camp clock). Never a money machine: nothing is sold.

## 7. GATES (rule 13)

NO RUN ENDS FOR TAPE 21/0 (new; C1 to C3 the craftsman's price), BUY VERSUS SELL 45/0, HANDOFF and OPEN ROW as on main.
