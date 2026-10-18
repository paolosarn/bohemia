# COMBAT [who dies by marks] 10/18/26 (the coordinator's sweep AM note; TUNING's table c07dfff9)

His fifth votes, item 5 (laws/BOHEMIA_ADDENDUM_THE_FIFTH_VOTES_10_1_26.md): "WHO DIES: a flat 20% when no
perk is in play; a little more per debilitating trait or injury carried." The coordinator's note asked the
fight to read the veteran's 10 percent row or say why not. Last round said why not (the fifth votes are newer
than the third and rule WHO DIES flat; the row carries superseded_by). This round builds the half that was
OWED: "a little more per injury carried".

## WHAT CHANGED
- records/target/bb/ours.json: new row struck_down_death_per_mark {per_mark 0.05, cap_marks 4}, sourced to the
  fifth votes and to TUNING's 10/10 pick (records/BOHEMIA_TUNING_RESPEC_BB_ALREADY_HAS_A_RESET_AND_IT_COSTS_SEVEN_RARE_PARTS_10_10_26.md:
  0.05 a mark, four marks at most, so 0.40 at worst, under Battle Brothers' 0.67).
- slices/BOHEMIA_FIGHT.html: deathChance(t) = ours.struck_down_death_chance + per_mark x min(cap, permanent
  injuries carried). The main character still never dies. A man handed in by the company with marks
  (opts.company[i].marks, ids or {id}) carries those permanent rows of injuries.json in his injuries, so they
  BITE with their own effects (Brain Damage's minus 25 percent initiative, Maimed Foot's extra AP a tile), the
  Battle Brothers way: a permanent injury never goes away. A fall never hands a mark he already carries (the
  wiki: one of each).
- engine/bohemia_roster.js company(): the hand-over carries marks (m.marks, else the one m.mark the roster
  keeps). One line, the fight's reading contract.

## MEASURED (the rebuilt fight plays gate, struck-down legs; a thousand rolls each)
- no marks: 18.7 percent dead (17 to 23 band, unchanged)
- two marks: 28.6 percent (chance exactly 0.30; band 26 to 34)
- six marks: 41.1 percent (capped at four marks, chance exactly 0.40; band 36 to 44)
- a man with Brain Damage who falls again never draws Brain Damage (200 falls)
- by hand: a company man handed in with brain_damage and missing_ear enters the fight with both, chance 0.30,
  zero page errors.
Also green: long injury 43/0, the fight reads only sourced numbers 9/0, the formation is kept 23/0, climbing 15/0.

## OWED TO OTHERS
- RUN TWO: the roster screen keeps ONE mark (afterFight overwrites m.mark), so a man can carry at most one
  and die at 25 percent at worst. Keep m.marks as a list (push, never overwrite) and the fight reads all of them.
- RUN: the alpha's and demo's map hand-over (company: o.men -> background, level) drops perks, gear and marks;
  when the map hands the roster's company, marks ride along.
- TUNING: the "debilitating TRAIT" half has nothing to bite on (we have no negative traits yet); when traits
  land, a trait row says whether it counts as a mark.
- TUNING's table: ours.veteran_death_chance stays superseded; struck_down_death_per_mark is a new live row read
  by fight-rules deathChance().

Tab: COMBAT (the death roll is in the fight; nothing new to look at, it is a number). No VOTE sheet: a number,
not a picture (text items are boring, his first votes).
