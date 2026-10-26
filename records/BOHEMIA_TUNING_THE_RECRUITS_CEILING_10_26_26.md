# TUNING 10/26: THE RECRUIT'S CEILING, CHECKED (rule 216, the coordinator's NOTE [the recruit's ceiling]; research only)

Paolo 10/26 (rule 216): "in the recruiting pitstop just put the best at the absolute top... the more stars, the more expensive...
when we level them up as much as we can, their stars and default good stats lead the way... you might have to make a calculator...
that's one failure of Battle Brothers, no proper filter to quickly see who's the fire one... it doesn't respect your time."
RUN THREE builds the hall's order ([the best recruit at the top], CLAIMED 10/26). The NOTE asks TUNING: which stats count for a
melee man and a gunman, how the stars widen the roll, the BARGAIN line, the weights in the one table. Nothing here is built.
Instrument: tools/bohemia_tuning_the_recruit_ceiling.js (--weights on the live fight, --halls the settlement screen's own roll and
price). Bank: banks/BOHEMIA_TUNING_THE_RECRUIT_CEILING_10_26_26.json. The numbers: the one table, section O.

## 1. THE FORMULA (what RUN THREE's number must equal, rule 216(f): "within a point")
For each man and each kind (melee, gun), his stats at level 11 EXPECTED through the game's own level-up: each of the ten levels
2 to 11 rolls every stat on its star column (rules.json experience.stat_gains_by_stars, Battle Brothers' own) and he raises four
(per_level.attributes_raised 4); the expected gain is the column's midpoint:
| stars | melee skill, melee defence | hitpoints, fatigue, resolve, ranged skill, ranged defence | initiative |
|---|---|---|---|
| none | 2 (1-3) | 3 (2-4) | 4 (3-5) |
| one | 2.5 (2-3) | 3.5 (3-4) | 4.5 (4-5) |
| two | 3 (3) | 4 (4) | 5 (5) |
| three | 3.5 (3-4) | 4.5 (4-5) | 5.5 (5-6) |
So L11 = his rolled stat + 10 x that midpoint, for the four stats his kind raises; the other four stay as rolled. HOW THE STARS
WIDEN: every star adds 5 to a raised stat by level 11 (a melee skill with none gains 20, with three 35). The hall's men carry
exactly three starred stats (the post's own star first, then the two where his roll sits highest: the settlement screen's
hireTalents), so a man's ceiling depends on whether his stars landed on his kind's four.

## 2. WHICH STATS COUNT, MEASURED (not argued)
Six men at level 5 in the town shelf (TUNING's whole-grid company: three melee, three guns) against nine brigands, 100 seeded fights,
the same fights for every cell; +10 on ONE stat of every man of ONE kind. The base: won 81, clean 17, men struck down 289. Men struck
down saved is the steadier measure (a win moves 4 in 100 on noise alone; downs move about 17 of 289):
| +10 on every melee man | won | down (saved) | | +10 on every gunman | won | down (saved) |
|---|---|---|---|---|---|---|
| melee skill | 86 | 252 (37) | | ranged skill | 85 | 231 (58) |
| melee defence | 77 | 274 (15) | | melee defence | 87 | 245 (44) |
| ranged defence | 78 | 275 (14) | | hitpoints | 82 | 275 (14) |
| hitpoints | 82 | 276 (13) | | fatigue | 79 | 275 (14) |
| fatigue | 84 | 277 (12) | | ranged defence | 81 | 282 (7) |
| initiative | 76 | 286 (3) | | resolve | 80 | 285 (4) |
| ranged skill | 81 | 289 (0) | | initiative | 79 | 288 (1) |
| resolve | 79 | 292 (-3) | | melee skill | 81 | 289 (0) |
THE WEIGHTS (men saved per point, the kind's main skill = 1): MELEE melee skill 1, melee defence 0.41, ranged defence 0.38,
hitpoints 0.35, fatigue 0.32 (initiative 0.08, resolve and ranged skill 0). GUN ranged skill 1, MELEE DEFENCE 0.76, hitpoints 0.24,
fatigue 0.24, ranged defence 0.12 (resolve 0.07, initiative 0.02, melee skill 0).
THE FINDING: A GUNMAN'S SECOND STAT IS MELEE DEFENCE. Since rule 185 a gun shoots the man beside him, so the gun line stands and gets
reached: +10 melee defence on the three guns saved 44 men in 100 fights, more than anything but their aim. TUNING's own killer-
company plan (10/25: guns raise ranged skill, fatigue, hitpoints, ranged defence) is wrong for this enemy; ranged defence earned its
place there against thirty men half of them shooting (records/BOHEMIA_TUNING_THE_KILLER_COMPANY_STATS_AND_LEVEL_UPS_10_25_26.md s4b),
and here, against the road's brigands (two marksmen and a poacher in eleven), it is the fourth-worst. The weights depend on the
enemy; the hall reads the road's.
THE FOUR A LEVEL, by weight: MELEE melee skill, melee defence, ranged defence, hitpoints; GUN ranged skill, melee defence,
hitpoints, fatigue. Inside the noise (under about 17 downs) the last two of each list could swap.

## 3. ONE NUMBER FOR THE HALL
His CEILING is the weighted sum of his level-11 stats for his better kind, shown as a rank among every man the posts roll (better than
N of 100), because a weighted sum's own size means nothing to him and a rank reads at a glance. The kind it was read for is shown
beside it (a GUN or a MELEE man), since the same man can be a 90 behind a rifle and a 40 with a pipe.
On 2,000 halls of seven rolled the settlement screen's way (engine/bohemia_goodbros.js's men, the hall's three stars, the hall's
price formula as gates/the_hire_price_is_the_formula_gate.js reads it):
- THE STARS ALONE PICK THE WRONG MAN HALF THE TIME: the hall's best man by ceiling is its man with the most stars 47 in 100 halls
  (35 with the plan's own four counted flat). Stars on his kind's four correlate 0.60 with his ceiling: they lead, as he said, but his
  rolled base and where the stars landed decide the rest.
- THE PRICE SAYS NOTHING TODAY: price against ceiling correlates 0.12; stars against price 0.00. The hall prices a man by his
  background's rolled hire and his kit (Battle Brothers' formula; Battle Brothers never prices talents either). His "the more stars,
  the more expensive" is not true in the game, so every good man is luck at a random price.

## 4. THE BARGAIN LINE (rule 216(c)(f))
| the line | marked a hall | halls with one | their ceiling (of 100) |
|---|---|---|---|
| over the hall's median worth per battery (216(f) as written) | 3.00 | 100 in 100 | 69 |
| worth per battery 1.5 times the hall's median | 1.82 | 92 | 73 |
| the hall's best worth per battery, and a ceiling over the hall's median | 0.84 | 84 | 80 |
| a ceiling in the top fifth of all men, and a price under the hall's median | 0.51 | 43 | 89 |
AS WRITTEN, BARGAIN MARKS THREE MEN OF SEVEN IN EVERY HALL: a median line marks half of any hall by construction, so it is a
colour, not a find. PROPOSED: BARGAIN on a man whose ceiling is in the top fifth of all men AND whose price is under the hall's
median: about one man in two halls, and those men are the real thing (89 of 100). It is rare enough to stop him, and true.
IF HIS 'THE MORE STARS, THE MORE EXPENSIVE' IS MADE TRUE (a price that climbs with the ceiling), the bargain dies with it: every cheap
man would be a weak man. The two asks pull against each other; the proposal keeps today's random price and lets the ceiling find the
luck, which is the bargain he described ('a bunch of stars but their cost is less than a Battle Brothers Hedge Knight'). That trade is
his (the coordinator puts it to him).

## 5. WHAT PROVES US WRONG
TUNING's own level-up plan for a gunman (10/25) leaves out the stat that saves the most men after his aim; the rules changed under it
(rule 185 put the guns in reach of a blade) and nobody re-measured. And the BARGAIN line as ruled marks three men of seven every visit.

## ROUTED
- THE ONE TABLE, section O: recruit.ceiling_formula, recruit.weights_melee, recruit.weights_gun, recruit.plan_melee, recruit.plan_gun,
  recruit.ceiling_shown, recruit.bargain_line.
- RUN THREE (the hall, a NOTE on RUN TWO's board where its rows live): the formula, the weights, the rank, the bargain line.
- THE COORDINATOR: the bargain line replaces 216(f)'s median; 'the more stars, the more expensive' against the bargain is his trade.
- COMBAT and the crew screen (the level-up's suggested picks, if any read TUNING's plan): the gunman's four now include melee defence.
