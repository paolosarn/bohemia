# TUNING 10/26: THE CAMP NOTE, HEALING AND REPAIR OVER TIME (rule 226(b); research only; for CAMP, lane 24)

Paolo 10/26 (rule 226): "in Battle Brothers you can't just do fights back to back, your people need to heal... it will combine the
HP and armor of all your people into a single HP and armor bar... once you see it you can be like I need to heal... healing is
important, the damage you sustained in battle." 226(b): "hitpoints back slowly with the clock, armour repaired by spending TAPE over
time, injuries in their days; Battle Brothers' rates from the wiki copy, in TUNING's table." The coordinator's row: Battle Brothers'
hitpoint recovery over time, armour repair per tool (our TAPE) over time, and how much making camp speeds them, in the one table.
The rows are the one table's section P (records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md).

## 1. THE RATES, CHECKED LINE BY LINE AGAINST THE WIKI COPY (reference/library/grok/wiki/PAGES_ALL.tar.gz)
CAMP's records/target/bb/condition.json already carries every rate with its quoted line. All ten agree with the pages:
- HITPOINTS: 1 an hour on the march, 2 camped or escorting a caravan (bb_all/0160 Attributes). Doubles in camp.
- ARMOUR: 3 durability points an hour, doubled camped or escorting (bb_all/2014 Tools and Supplies). Doubles in camp.
- TAPE: one point mends 15 durability (bb_all/2014; price_table.json's dailyRates agrees). Equipped and bag items mend on their own;
  stash items when marked. No tape, no mending: a weapon at zero breaks for good, armour at zero is useless until mended.
- MEDS: one a day for EVERY injury, or it does not heal; lost hitpoints heal on their own (bb_all/1253 Medical Supplies). NOT YET IN
  THE GAME: injuries heal by their days without meds today; row camp.meds_per_injury_day.
- THE RETINUE: the cook +1 hitpoint an hour and food 3 days longer (2,000 crowns), the blacksmith x1.2 mending and x0.8 tape and
  nothing lost at zero (3,000), the surgeon an injury a day shorter and a man with no mark lives one fatal blow (3,500); two pages
  disagree (33 percent on the Attributes and Tools pages, 1 an hour and 20 percent on the followers' own): the followers' pages win,
  as CAMP took them.
- THE TEMPLE: an injury's days halved for a price (2-4 days to 1-2; bb_all/1763, bb_all/1936 'Treatment (halves healing time)').
- WHAT CAMP COSTS: 'less vision range and also being more visible to roaming enemies (more dangerous parties are often attracted
  at night)' (bb_all/2014). The wiki gives no number; ours proposed, draft: sight x0.75, seen at x1.5.
- CARRY CAPS: tape 150 (Veteran, Expert; 200 Beginner), meds 100 (150 Beginner), each +50 with the quartermaster.
- TIME: a Battle Brothers day is about 1 minute 45 seconds (bb_all/0828), 4.4 seconds a game hour, and camping does NOT speed the
  clock there. Ours: the camp runs an hour a beat (500 ms; slices/BOHEMIA_CITY_WORLD.html campHour), 8.75 times quicker.

## 2. WHAT THE WIKI DOES NOT SAY, AND THE READING TAKEN
Whether a company's pieces are mended AT ONCE (every worn piece 3 points an hour) or IN TURN (3 points an hour shared). CAMP built
'at once'. It matters: in turn, the median won fight needs 29 hours on the march to mend instead of 12, the twelve's 49 instead of
12. KEEP 'at once' (it is the easier reading and rule 117 says start easier); a Grok line to settle it from the scripts.

## 3. WHAT A FIGHT COSTS AFTER (MEASURED: 600 AUTO fights of the live fight, rules 7a8ee2fc0ad9, the watch's six crew shapes, 423 won;
## bench tools/bohemia_tuning_the_camp_clock.js, bank banks/BOHEMIA_TUNING_THE_CAMP_CLOCK_10_26_26.json)
A man struck down and alive is laid up for his days (the fight-gets-deep law), so his hitpoints are not the wait.
| crew | won | the HEAL bar after (median, p10) | whole on the march (median, p90) | whole camped | camped, full retinue | TAPE (median, mean) | laid up | MEDS |
|---|---|---|---|---|---|---|---|---|
| all | 423 | 0.83, 0.46 | 23 h, 50 | 12 h, 25 | 9 h | 5.9, 9.1 | 0.66 | 3.6 |
| 1 (the Lone Wolf) | 37 | 0.88, 0.64 | 22 h, 68 | 11 h | 9 h | 5.1, 7.0 | 0 | 0.1 |
| 2 to 3 | 245 | 0.78, 0.42 | 21 h, 42 | 11 h | 8 h | 3.8, 5.2 | 0.45 | 2.4 |
| 6 | 26 | 0.92, 0.37 | 29 h, 70 | 15 h | 11 h | 8.1, 21 | 0.73 | 2.6 |
| 12 | 115 | 0.86, 0.63 | 28 h, 52 | 14 h | 10 h | 9.9, 15.5 | 1.3 | 7.5 |
IN REAL TIME: 12 hours of camp is 6 seconds on our clock (Battle Brothers: 53). At the mean, 150 tape lasts about 16 won fights.

## 4. DOES THE HEAL MATTER? BACK TO BACK (rule 226's point, measured)
336 won fights, each followed by the next fight on the road (the same crew shape's fight k+1000) with the men still standing (the
dead and the laid up stay home), four ways; the fight's own condApply carries each man's losses:
| between the fights | won | clean | ours down | ours dead |
|---|---|---|---|---|
| healed whole | 232 | 143 | 471 | 75 |
| nothing (the wounds carried) | 208 | 100 | 661 | 97 |
| 12 hours on the road | 224 | 132 | 527 | 80 |
| 12 hours camped | 230 | 139 | 498 | 84 |
Fighting again with the wounds: 40 percent more men down, 29 percent more dead, a third fewer clean wins (the twelve: clean 29 ->
9). Twelve hours camped, six seconds, gives back nearly all of it. The HEAL button earns its place at Battle Brothers' rates.

## 5. THE NUMBERS, PROPOSED (section P)
Keep every rate at Battle Brothers' (rule 226 names them and is newer than 117); the lever rule 117 asks for is already pulled: the
camp's clock (an hour a beat) makes the felt wait 8.75 times shorter than Battle Brothers'. New: meds a day per injury (when the
game spends meds); the temple's halving; camp's cost in sight and being seen (ours, draft, the wiki has none).

## 6. WHAT PROVES US WRONG
The thing that makes healing feel like Battle Brothers is not the rate but the clock: at Battle Brothers' own rates our camp heals a
company in six seconds, so a player who camps after every fight never feels the wound. The rate is right; whether six seconds is
too quick for 'you can't just do fights back to back' is a feel to watch in his play (the bar's dip shows, then is gone).

## ROUTED
- CAMP (lane 24): NOTE [the camp note] on CAMP's board: the rates checked, the 'at once' reading kept, meds a day per injury, the
  temple, camp's cost, the caps; the back-to-back numbers for its gate (226(f)).
- WORLD: a camp's being seen (226(d)): the wiki has no number; draft x1.5 the distance it is seen at.
- ECONOMY: the carry caps (tape 150, meds 100) when our stash holds them.
