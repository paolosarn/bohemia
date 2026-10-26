# TUNING 10/26: STRUCK DOWN, HE STILL FIGHTS. THE DEBUFF, THE HEAL FROM ONE, THE CLINIC'S HALF, THE SELL SPREAD (research only)

Rows (the coordinator's order, session_016uEPGrM8): (1) [struck down, he still fights] numbers, rule 234(b); (2) the clinic's half,
rule 241; (3) the sell spread with ECONOMY, rule 242; (4) [the stupid-move watch] round three, after the COMBAT emergency lands;
(5) each man's own stat ceiling with his stars, rule 247(d). Research only (rule 38g): nothing here touches the game. The numbers are
the one table's section S (records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md); the bench is tools/bohemia_tuning_struck_down_debuff.js;
the bank (draft:true, nothing reads it) is banks/BOHEMIA_TUNING_STRUCK_DOWN_DEBUFF_10_26_26.json. The live fight is main 1b49f2db's
slices/BOHEMIA_FIGHT.html, AUTO both sides, the stupid-move watch's crews.

HIS WORDS (rule 234, records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md): "their health will just
like be at one and then when you heal them they'll still go back up. They're still active. I don't know why you have it so like they
can't participate in combat anymore, that's why restarted Hella runs... They should just have that deep buffing [debuff]... I'm gonna
have to restart a run and I didn't even like make it past the first day." And rule 241: "if I did take it to a clinic, then I wanted
to be clear that it would half the days and half the D buff [debuff]."

## 0. THE ANSWER, SHORT
1. THE FIRST DAY, MEASURED. 382 next fights after a fight that left a man struck down and alive (202 of those first fights were
   LOSSES, his bad first fight). Leave them home, the old bench: the crew wins 128 (34 in 100). Bring them back camped whole with the
   mark and the whole fresh wound: 221 (58 in 100). Send them at once on ONE hitpoint: 183 (48 in 100), but 280 dead against 223.
   Rule 234 is right by 24 wins in 100, and the HEAL bar's lesson is real: camp before you fight again.
2. THE DEBUFF: CAMP's two parts KEEP, both Battle Brothers' own rows: the mark for life (injuries.json's eleven permanent rows), and
   the fresh wound for the 30 to 40 days (the temporary row of the same body part, CAMP's match; 10 of 11 checked and kept, one
   noted), whole the day he wakes, fading in a straight line to nothing. What each costs a man in the fight is in section 2.
3. THE HEAL FROM ONE HITPOINT: Battle Brothers' rates, no slower for a struck-down man: the median man (57 hitpoints, 2,240 men of
   the fifteen origins) is whole in 56 hours on the march, 28 camped (14 seconds on the camp's clock), 19 camped with the cook (9 s).
4. THE CLINIC: the half is the wound jumping halfway down its line (days and debuff together, exactly as he said), the mark never
   touched. THE FINDING THAT PROVES US WRONG: the clinic's price today charges Battle Brothers' daily rate for OUR 30 to 40 days:
   70 batteries at level one, the 89 he saw at level two, 2.3 to 3 one-skull jobs. Battle Brothers' temple for the SAME wound costs
   a sixth to a quarter of its sourced contract. Proposed: Battle Brothers' temple price for the fresh wound it treats, 6 to 16
   batteries at level one.
5. THE SELL SPREAD: TUNING AGREES with ECONOMY's section R (supplies sell at half the calm buy, a town in need pays the rise, the
   stall keeps the same cut); one row added so gear (one seventh, his YES 10/10) and supplies (half) are never read for each other.
6. THE OWN CEILING TICK (247(d)) was given whole in 28b5d6f2 (the one table's bar.tick.own_ceiling); worked examples below for
   UI THREE's gate.
7. [the stupid-move watch] round three WAITS: the COMBAT emergency has not landed on main (no COMBAT commit since rule 233's).

## 1. HOW BATTLE BROTHERS DOES IT (the wiki copy, reference/library/grok/wiki/PAGES_ALL.tar.gz, through records/target/bb/injuries.json)
- STRUCK DOWN: "A character whose hitpoints have reached 0 has a chance of surviving with a random permanent injury an otherwise
  fatal blow... The chance to survive is 33% or 90% with the Survivor trait. The part hit does not matter in selecting the injury"
  (bb_all/1540). Ours: 80 in 100 live (his 9/27 law), 5 more die a mark carried (his fifth votes). Battle Brothers gives the
  survivor NO fresh wound: only the permanent one, for life. A struck-down brother is never barred from a fight; the player picks.
- THE ELEVEN MARKS: Brain Damage, Broken Elbow Joint, Broken Knee, Partly Collapsed Lung, Maimed Foot, Missing Ear, Missing Eye,
  Missing Finger, Missing Nose, Traumatized, Weakened Heart, each its wiki effects for life (the one table's
  injuries.permanent.* rows, section B).
- TEMPORARY INJURIES: 48 rows, 1 to 9 days each (heal_days), "Cure (removal): medicine and time... Treatment (halves healing time):
  in a settlement temple for a price" (bb_all/1936). One MEDS a day for every injury or it does not heal; lost hitpoints heal on
  their own (bb_all/1253).
- HITPOINTS: 1 an hour on the march, 2 camped (bb_all/0160); nothing slower for a man who was struck down.
- THE TEMPLE'S PRICE: "price = base wound treatment price (20) x treatment price multiplier (1) x settlement prices multiplier x
  max remaining healing time (in days) x (1 + (character level - 1) x 0.2)" (bb_all/1936). It halves the TIME only; halving the
  penalty too is his (rule 241).
- STACKING: two injuries on one stat multiply (the live fight's injMult does the same: 0.5 x 0.5 = -75 percent).

## 2. THE DEBUFF, CHECKED AND MEASURED
### 2a. CAMP's fresh wound per mark (condition.json struck_down_fresh on CAMP's branch camp-struck-down 63b74fe5, a default for this
### table): the temporary row of the same body part the mark is the healed-wrong form of. Checked one by one against the 48 rows:
| mark (for life) | the fresh wound (30 to 40 days) | the match | waking (mark x fresh) | the clinic's half | for life |
|---|---|---|---|---|---|
| Brain Damage | Severe Concussion (head, blunt, 3-5 days in BB) | KEEP (Fractured Skull carries the same effects over 6-9 days) | MS, RS, MD, RD -50%, INI -62%, RES +15%, VIS -2 | the four -25%, INI -44% | INI -25%, RES +15%, XP -25% |
| Broken Elbow Joint | Fractured Elbow (3-5) | KEEP | MS -20, RS -20, MD -48% | MD -39% | MS -20, RS -20, MD -30% |
| Broken Knee | Injured Knee Cap (5-8) | KEEP | MD, RD -40, INI -64%, +2 AP a tile | INI -52%, +1 AP | MD, RD, INI -40% |
| Partly Collapsed Lung | Pierced Lung (5-7) | KEEP | FAT -76% | FAT -58% | FAT -40% |
| Maimed Foot | Cut Achilles Tendon (3-5) | KEEP (no foot row in BB; the heel is the nearest) | +3 AP a tile, INI -44% | +2 AP, INI -32% | +1 AP, INI -20% |
| Missing Ear | Ripped Ear (2-3) | KEEP | INI -23% | INI -17% | INI -10% |
| Missing Eye | Grazed Eye Socket (2-4) | KEEP | RS -75%, VIS -4 | RS -62%, VIS -3 | RS -50%, VIS -2 |
| Missing Finger | Crushed Finger (2-3) | KEEP | MS, RS -10% | -8% | -5% |
| Missing Nose | Split Nose (2-4) | KEEP, BUT IT COSTS NOTHING TODAY: the fight does not read fatigue_recovery_per_turn | FAT -10%, recovery -5 | recovery -3 | FAT -10% |
| Traumatized | none (the wiki gives the mind no flesh wound) | KEEP | RES -40, INI -30% | the same: nothing to halve | RES -40, INI -30% |
| Weakened Heart | Pierced Chest (3-4) | KEEP (by name the heart's wound; its -20% fatigue, not hitpoints) | HP -30, FAT -20% | FAT -10% | HP -30% |

### 2b. WHAT EACH COSTS ONE MAN (8,160 fights: A New Crew from the door against the road, 120 fights, the same seeds in all 34
### states, ONE man carrying it: the swordsman c1 (his pistol too, guns first) and the gunman c2; the paired change against the same
### fight with nothing on him)
His damage dealt (hit points plus armour, the fight's own attack log), mark / the clinic's half / waking:
| mark | swordsman | gunman | his own fall rate at waking (swordsman) |
|---|---|---|---|
| Missing Eye | -36 / -44 / -54 % | -32 / -37 / -45 % | +17 in 100 |
| Partly Collapsed Lung | -14 / -24 / -49 % | -12 / -22 / -39 % | +18 |
| Brain Damage | -8 / -27 / -42 % | -3 / -20 / -33 % | +21 |
| Broken Elbow Joint | -24 / -27 / -28 % | -12 / -12 / -12 % | +14 |
| Broken Knee | -20 / -21 / -22 % | -14 / -16 / -19 % | +13 |
| Maimed Foot | -14 / -15 / -19 % | -18 / -21 / -20 % | +8 |
| Weakened Heart (hitpoints cut applied by the bench) | -9 / -6 / -16 % | -6 / -7 / -10 % | +5 |
| Missing Ear | -6 / -9 / -9 % | -3 / -2 / -3 % | +7 |
| Missing Finger | -6 / -7 / -8 % | -3 / -4 / -7 % | 0 |
| Traumatized | -7 % all three | -9 % all three | +6 |
| Missing Nose | -3 % all three | -1 % all three | -1 |
(The control: the swordsman deals 156 a fight and falls 33 in 100; the gunman 121 and 45. z on the damage change: the eye, the
lung and the brain at waking -9 to -12; the nose -0.8, inside the noise.)
READ: three marks carry most of their cost FOR LIFE (the eye, the elbow, the knee): the clinic barely helps them, because it never
touches the mark. Two carry it in the FRESH wound (the brain -8 for life against -42 waking; the lung -14 against -49): for those the
clinic and the days are everything. The fresh wound fades in a straight line, so a brain-damaged man camped back up is about -35 at a
week, -27 at the halfway day, -15 with a week left (the measured points lie on the line).

### 2c. THE FIRST DAY (rule 234(f): 'no run ends on day one from a benched crew'). 800 first fights on the road (his three, A New
### Crew, the spear crew, the twelve, 200 each); the 382 that left a man struck down and alive (939 men; 202 of those first fights
### LOST) were each followed by the next fight six ways, everyone else whole so only the struck-down men move:
| the struck-down men in the next fight | won | clean | ours down | ours dead | the struck men down again | of them dead |
|---|---|---|---|---|---|---|
| never struck down (the control) | 239 | 109 | 970 | 157 | 581 | 102 |
| LEFT HOME (the old bench) | 128 | 64 | 606 | 73 | - | - |
| camped whole, the mark only (after his days) | 224 | 91 | 1,052 | 212 | 642 | 165 |
| camped whole, the mark and the whole fresh wound | 221 | 89 | 1,098 | 223 | 667 | 172 |
| camped whole, the clinic's half | 222 | 91 | 1,066 | 206 | 639 | 158 |
| sent at once on ONE hitpoint, the whole fresh wound | 183 | 58 | 1,334 | 280 | 804 | 218 |
By crew: his three won 20 benched against 54 back; A New Crew 24 against 45; the spear crew 17 against 34; the twelve 67 against 88.
READ: (1) the bench was what lost his runs: a small crew with one man home wins under half as often. (2) The debuff costs a crew
little in the next fight (221 against the never-struck 239); THE MARK is most of it (224), the fresh wound 3 more. (3) The ONE
HITPOINT is the real danger: 46 more of the struck men die than camped (218 against 172), 38 fewer wins. 28 camped hours (14 seconds)
is the difference. (4) Benching keeps men alive (73 dead) by fielding fewer and losing more: the men not killed in a lost fight live on, so the
player's choice stays real (rule 234(a): pickable, never forced).

### 2d. THE NUMBERS (the one table, section S), TUNING's calls
- THE FRESH WOUND'S DAYS: 30 to 40, whole days, each as likely (ours.json struck_down_laid_up_days, his 9/27 '30 to 40 days'); they
  measure the debuff and never keep him out (234(b)). THE FALSE QUOTE: ours.json's row quoted 'a DEBILITATING INJURY that takes them
  out of fights for 30 to 40 game days' as if he said it; it was the coordinator's reading. CAMP's branch camp-struck-down replaces
  it with his 10/26 words and a 'was' line saying so; TUNING checked it and carries the same hunk if CAMP has not landed it.
- THE FADE: whole at waking, nothing on the last day, a straight line (CAMP's struck_down_fresh_full_share 1). KEEP. The real
  world heals faster at first and slower at the end (a fracture's bone takes weeks, but most of the pain and the use come back in
  the first ones), so a curve would be truer; the straight line is kept because the arrow shrinks the same each day and the
  clinic's half is then exactly the halfway day, which a curve breaks.
- WAKING SHARE 1 (the whole Battle Brothers row): KEEP. 234(b) names Battle Brothers' penalty. Rule 117 is met elsewhere: 80 in 100
  live against Battle Brothers' 33.
- NO MEDS FOR THE FRESH WOUND (new, TUNING's default): it fades on the clock alone. Battle Brothers' one MEDS a day stays for the
  temporary injuries from hits (1 to 9 days). Why: 35 days at a dose a day is 35 doses for one man, a third of a carried 100; a crew
  out of meds would carry the whole wound forever, the 'run over on day one' he hates, and Battle Brothers' marks eat no meds either.
- THE HEAL: Battle Brothers' 1 an hour on the march, 2 camped, +1 the cook; the struck-down man heals at the same rate from ONE.
- THE SURGEON: a day off the fresh wound (condition.json surgeon_injury_days, live).

## 3. THE HEAL FROM ONE HITPOINT (2,240 men: every origin rolled 40 ways by the door, engine/bohemia_origin_start.js)
Whole hitpoints: min 40, p10 48, MEDIAN 57, p90 65, max 91 (the Lone Wolf's 84 median; the Debt crew's 47 lowest).
| from one hitpoint to whole | median | p90 | on the camp's clock (an hour a beat) | Battle Brothers' clock |
|---|---|---|---|---|
| on the march (1 an hour) | 56 h | 64 h | - | - |
| camped (2 an hour) | 28 h | 32 h | 14 s | 2 min 3 s |
| camped with the cook (3 an hour) | 19 h | 21 h | 9 s | - |
| on the march with the cook (2 an hour) | 28 h | 32 h | - | - |
Weakened Heart's -30 percent makes the median man whole at 40 (when the fight reads it, section 7): 39 hours on the march, 19.5 camped.

## 4. THE CLINIC'S HALF (rule 241)
- WHAT HALF MEANS ON A FADING WOUND: the days left halve, and the debuff with them, because the wound's share IS the days left over
  its days (CAMP's treat(): left halves, of stays). So a treated wound jumps to the point halfway down its line and fades on from
  there at the same pace: 'half the days and half the debuff', both true at once. The mark's lifelong part never moves; the card
  says so (241(b)).
- ONE EXACTNESS NOTE FOR CAMP: treat() rounds the days left UP before it halves the share (35 left -> 18, so -50 becomes -26, not
  -25). Keep left = before / 2 exactly inside and show the days rounded up: then the arrow is exactly half, as his 'a cut of 10
  becomes 5' and the 241(e) gate read it, and the days still read 18.
- TRAUMATIZED: no fresh wound, so the clinic has nothing to halve: it should not offer him (or say it cannot stitch a mind); today's
  wounded() lists every man with a wound record, Traumatized too.
- THE PRICE, CHECKED AGAINST BATTLE BROTHERS' TEMPLE (THE FINDING):
  | | level 1 | level 2 | level 5 | level 11 |
  |---|---|---|---|---|
  | TODAY: 20 x town x OUR days left x level / 10 (35 days) | 70 | 84 (89 at 37 days: what he saw) | 126 | 210 |
  | PROPOSED: Battle Brothers' temple price for the fresh wound it treats | 6 to 16 | 7 to 19 | 11 to 29 | 18 to 48 |
  PROPOSED = 20 x the town's buy knob x the fresh wound's LONGEST days in Battle Brothers (its injuries.json heal_days[1]) x the
  share of the wound left (days left over its days) x (1 + 0.2 a level past one), in batteries (/ 10), never under 1: Severe
  Concussion and Fractured Elbow and Cut Achilles 10 at level one, Injured Knee Cap 16, Pierced Lung 14, Grazed Eye Socket, Split Nose,
  Pierced Chest 8, Ripped Ear and Crushed Finger 6; Traumatized none.
  WHY: today's charges Battle Brothers' 20 a day for days Battle Brothers never has (its longest temporary wound is 9 days), so the
  clinic costs 2.3 one-skull jobs (30 batteries) at level one and 3 at level two. Battle Brothers' temple for the same wound costs
  100 to 160 crowns at level one against its one sourced contract of 610 (price_table.json contractPay): a sixth to a quarter. The
  proposed price is a fifth to a half of a one-skull job: Battle Brothers' own weight. The value per battery is higher than Battle
  Brothers' (it buys 17 days, not 2), and that is rule 117's easier start; today's price is the slider's hard end, and harder than
  Battle Brothers. It still falls as the wound heals, like Battle Brothers' (it reads the days left).
- THE MEDIC: a day fewer after the halving (live, kept).

## 5. THE SELL SPREAD (rule 242, with ECONOMY: records/BOHEMIA_ECONOMY_DAY_82_BUY_VERSUS_SELL_THE_STALL_PAYS_HALF_AND_A_TOWN_IN_NEED_PAYS_THE_DIFFERENCE_10_26_26.md, the one table's section R, shipped a9f99967)
TUNING AGREES with R as written, checked by hand on its own engine (engine/bohemia_stall_prices.js):
- CALM: a night of food bought for 2 sells for 1; a dose, six rounds, a roll of tape bought for 1 sell two for a battery (the
  handful: the smallest count that pays a whole battery). A SICK town: food buys at 4 and sells at 2 x (2 - 0.5) = 3; a dose at 3,
  sells at min(2.5, 0.85 x 3) = 2.5, one dose pays 2. Matches R's table.
- THE SPREAD BY CLASS IS RIGHT AND REALISTIC: gear sells back at one seventh (his YES 10/10, market.sell_cut, Battle Brothers'
  0.15); supplies at half. In a crash, food, rounds and medicine are near-money (they trade like cash because everybody needs
  them); a used helmet is not. Battle Brothers itself never buys back tools, medicine or ammo and buys back food at its regular
  cut: R's slider names that hard end.
- ONE ROW ADDED (S): sell.by_class, so RUN TWO's stall never applies the gear's one seventh to a supply or the supplies' half to
  gear. Loot's rounds (loot.json counts.rounds, a dead man's gun) are a supply: a dozen sell for about a battery, no exploit.
- ARBITRAGE: R's ceiling (the best first week +27 against one routine job's 30; the best week of a year +38 against three men's 42
  of food) is ECONOMY's gate; not re-run here.

## 6. THE OWN CEILING TICK (rule 247(d), for UI THREE): given whole in 28b5d6f2, the one table's bar.tick.own_ceiling
tick = his number now + the levels left to 11 x the MIDDLE of his star column (rules.json experience.stat_gains_by_stars):
hitpoints, fatigue, resolve, ranged skill, ranged defence 3 / 3.5 / 4 / 4.5 a level at 0 to 3 stars; melee skill and melee defence
2 / 2.5 / 3 / 3.5; initiative 4 / 4.5 / 5 / 5.5; at level 11 or past, his number. Worked, for the 247(e) gate:
| the man | stat | number | stars | tick | the bar's maximum | fill / tick on the bar |
|---|---|---|---|---|---|---|
| level 1 | hitpoints | 55 | 0 | 85 | 133 | 41% / 64% |
| level 1 | hitpoints | 55 | 3 | 100 | 133 | 41% / 75% |
| level 1 | melee skill | 50 | 2 | 80 | 122 | 41% / 66% |
| level 6 | ranged skill | 60 | 1 | 77.5 | 109 | 55% / 71% |
| level 3 | initiative | 110 | 3 | 154 | 195 | 56% / 79% |
| level 11 | melee defence | 30 | 2 | 30 | 65 | 46% / 46% (the tick on the fill) |

## 7. WHAT THE FIGHT DOES NOT READ (named, COMBAT's, not fixed here)
The live fight reads an injury's skills, defences, initiative, max fatigue, damage dealt and extra AP a tile (injMult, stepCost). It
does NOT read hitpoints_pct (Weakened Heart's -30 and every temporary row with a hitpoint cut; the bench applied it, Battle
Brothers' way), vision (the eye -2, the concussion -2), fatigue_recovery_per_turn (the nose's whole fresh wound) or action_points
(Dislocated Shoulder -3, Inhaled Flames -2). And it does not take a fresh wound from the company yet: c.marks comes in, a fresh
wound does not (CAMP's handOver gives c.fresh on its branch; the fight's door waits for the COMBAT emergency, CAMP's row says so).

## 8. NOT MEASURED, SAID
A phone's CPU. The fresh wound on the live path (the fight does not read c.fresh yet). AUTO keeping a man under a third of his
hitpoints back (234(e), COMBAT TWO's, not built). The twelve-man company at waking share for every mark (the per-mark bench is a
crew of three, where one man shows). [the stupid-move watch] round three (waits on COMBAT's fix).

## ROUTED
- CAMP [struck down, he still fights] and [the clinic halves the days and the debuff]: section S's numbers; KEEP your fresh map
  and fade; no meds for the fresh wound; treat() exact half; Traumatized not offered; the proposed clinic price. (NOTE on CAMP's
  board.)
- RUN TWO (the clinic card's price in the town): the proposed clinicPrice reads the fresh wound's Battle Brothers days. (NOTE.)
- ECONOMY [buy versus sell]: TUNING AGREES; sell.by_class added. (NOTE.)
- COMBAT: the four injury effects the fight does not read; the fresh wound into the fight after your emergency fix. (NOTE.)
- UI THREE: the worked ceiling ticks in section 6 for your gate. (NOTE.)
[bb the struck down: Battle Brothers lets 33 in 100 live with a mark for life and no fresh wound, and never benches them; ours lets 80
live, the mark for life and a fresh wound fading over 30 to 40 days; its temple charges for its own 1-to-9-day wounds, ours must too]
[analog horror: the wound reads as a number that gets smaller every night, a clock on the man, until only the scar is left]
