# COMBAT 5, SHIP 1: CLIMB OR ATTACK (11/2, rule 328, ask line 326)

Paolo 11/2: "New rule: you cannot climb on top of a building and attack anything within the same turn. This is for everyone, the same turn."

## MEASURED BEFORE

gates/climb_or_attack_gate.js --before (the rule's switch off in the memory copy, everything else the same), 40 fights on AUTO for
both sides (10 each of raiders, the mechanic's robots, the three act-one bosses, wolves; companies of 3 and 6):
- 148 climbs onto a roof (108 his men, 40 theirs).
- **36 turns a man climbed a roof and attacked in the same turn.**
- **44 climbs by a shooter who already had a shot from where he stood** (AUTO's roof logic, 70b and rule 322, climbed first and shot after).
- A man on a roof was refused nothing: the blow, the gun, the sweep, the hook all landed the turn he climbed.
- Minutes on AUTO (the bench's sum: 2 beats a turn that acts, half a beat one that passes, 120 a minute): raiders 0.9, robots 1.0, bosses 1.0, wolves 0.7.

## WHAT SHIPPED

**The rule** (slices/BOHEMIA_FIGHT.html, ours.climb_or_attack in records/target/bb/ours.json):
- A step from lower ground up onto a roof (a roof tile higher than the tile he stepped from) marks the man for the round
  (`u.upRound`; WAIT brings the same turn back in the same round, so the mark holds through it). His walk, the far walk, Footwork and
  Rotation all mark; a shove that puts him up there does not (it is not his climb). The climb is said over him ('CLIMBED').
- A marked man makes no attack for the rest of his turn: `canStrike`, `canSweep`, `canNet`, `canShove`, `hookTarget` and `hook` all
  refuse, and `canUse` refuses any active perk listed in `attack_skills` (none of the fight's active perks is a blow today, so it
  ships empty for the next one). The dial's shot, a whip's lash (ARMORY 2) and the cell vest's spark (ship 2) are named in `refused`
  and ride these gates. Reloading, WAIT, walking on, the shield, the bag and the non-attacking perks stay his.
- Every side and every beast that can climb (rule 321 keeps the wolves off roofs). The zone of control's free swing and the free shot
  happen on somebody else's turn and stand (Battle Brothers' rule).

**What he sees** (draft words, WORDS'):
- Before the climb: the walk's tag says CLIMBING ENDS HIS ATTACKS THIS TURN under ROOF n UP, and the line under the board ends
  "Climbing ends his attacks this turn." (Yours for the main man.)
- Up there: the strike square greys out and says CLIMBED (its title CLIMBED THIS TURN); a sweep square greys out the same; a tap on a
  man of theirs says "DEUCE climbed this turn: no blow and no shot until the next one." with the deny sound.
- Pictures (his phone, 390 x 844, the real page): records/combat_climb_or_attack_11_2/1_BEFORE_THE_CLIMB.png, 2_UP_THERE_NO_ATTACK.png.

**AUTO and the enemy brain (rule 322 changed to fit)**:
- The walk's field (`reach`) now carries `up[k]`: the cheapest way to tile k climbs a roof. Every brain that picks a tile to strike
  from this turn (`joinFrom`, `stepIn`, the main walk's scoring, `vantage`'s first pass through `shotFrom`) treats a tile reached by
  a climb as no tile to strike from: the club walks to a ground tile beside the man on the roof instead (height is accuracy, rule 321,
  so he still reaches up).
- `climb()` (70b): a shooter of either side climbs only when he has no shot from where he stands AND no tile he can walk to gives
  one now (vantage's first pass, whose climbing tiles give none), and the roof puts a man in his reach for NEXT turn. Never 'climb
  then shoot'. The undo veto on a roof is now plain: never back up to where an idle turn began.
- A shooter who climbed this turn with a man in his reach from the roof holds it (ends his turn), never down again the same turn.

## MEASURED AFTER (the same 40 fights, the same seeds)

| | before | after |
|---|---|---|
| a man climbed a roof and attacked the same turn | 36 | **0** |
| a shooter climbed while he had a shot where he stood | 44 | **0** |
| climbs onto a roof (his / theirs) | 108 / 40 | 30 / 11 |
| minutes on AUTO: raiders, robots, bosses, wolves | 0.9, 1.0, 1.0, 0.7 | 0.9, 0.8, 1.0, 0.6 |

Fights did not get longer; every kind stays under 4 minutes on AUTO by the bench's own sum. The bench counts AUTO's beats; a fight he
plays by hand is longer by his thinking time, which nothing in the repo measures yet (TUNING's job times, rule 307).

Other gates on this change: auto_plays_smart 7/7 (its probe amended: a tile his way climbs a roof to gives no shot this turn, by his
rule), every_man_has_a_job_each_turn 5/5 (AUTO wins 163 of 300, floor 158), auto_kills_one_at_a_time 7/7 (won 79, clean 53 of 100),
auto_never_wastes_a_turn 9/9 (amended, below). The phone look: tools/bohemia_combat_climb_or_attack_phone_11_2_26.js 3/3.

**Amended to his rule**: auto_never_wastes_a_turn G5 ("a gunman who can walk onto a roof takes one", rule 176(f)) counted every turn
a roof was in walking reach; under rule 328 a turn with a shot open is a shot, never a roof, so the roof now counts only on turns
with no shot open without climbing (tools/bohemia_tuning_auto_brain.js roofAny and roofOpt read the brain's own vantage), and the
roof counted is one that gives him the shot next turn (roofOpt, its AP-left test dropped: the climb buys next turn's shot). With the
old count it read 18.8% (the old brain 39.7%): the drop was the rule working (a man with a shot no longer climbs away from it). With
the amended count: **93.8%** of the gunmen who could walk onto a roof that gave them next turn's shot, on a turn with no shot open,
took it (any roof in reach on such a turn: 24.5%, most of them roofs with no man in reach from them).

THE GATE: gates/climb_or_attack_gate.js, 6 legs (the rule is data; a climb marks him; every attack refused up there, the reload, the
walk on and WAIT still his; the next round he attacks, a walk along the roof is no climb; every side on AUTO, nobody climbs and
attacks, no shooter climbs past a shot, climbs still happen; minutes under 4, nothing threw). `--before` turns the rule off in the
memory copy: C2, C3, C4 and C5 fail on it.

## WHAT IS LEFT
- EYES on his phone (ask line 326: NOT YET SEEN). The words are drafts (WORDS).
- The dial does not exist in the fight yet (63a, the 9/22 law); when it lands, its shot goes through `canStrike` and is refused the
  same way (named in `refused`). The whip's lash (ARMORY 2) rides `canStrike`/`canSweep` the same way.
- TUNING: whether a shooter should ever climb under rule 328 when a ground tile gives a worse shot now (today: the shot now wins).
- A ladder-only climb ('the way the board allows') is still a bigger change: a man climbs from any tile beside a roof for +1 AP a level.

[bb] Battle Brothers has no such rule: a climb costs +1 AP a level (ap.move_cost.height_change_extra) and nothing more, and its
ranged AI (ai_engage_ranged) climbs and shoots in one turn. His rule makes a roof a turn's investment: you take the height, you
shoot from it next turn; the way a Battle Brothers archer repositions one turn and looses the next when the AP runs short.

[analog horror] Nothing new is drawn. The word CLIMBED prints on the strike square in the same worn cell type, greyed like a dead
switch; up on the roof the man stands with his hands empty for a turn, the thing below looking up at him. The tag's warning is the
receipt's red line.
