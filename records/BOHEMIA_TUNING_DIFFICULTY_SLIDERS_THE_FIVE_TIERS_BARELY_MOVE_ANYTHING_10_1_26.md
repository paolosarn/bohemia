# TUNING ROUND 6 -- [difficulty sliders] WHAT A SLIDER MOVES AND NEVER MOVES (10/1/26)
# Row: VAMILY TUNING [difficulty sliders], MODE RESEARCH (rule 38g, build nothing). Law: fight-gets-deep s3.
# His words (9/27): "difficulty sliders: well beyond me, you optimize that." Sources: our decoded fight (COMBAT_B64 on
# 10/1 main: THREAT_BY_PKG, PKG_FELT, the V121 comment), the earlier pages (five points, fight length, death rule).
# Battle Brothers difficulty details are RECALL-GRADE and marked. [grok sources]: no Grok page has passed EYES' filter
# yet (reference/library/grok/ holds only its README), so nothing here cites Grok.

## 1. HOW BATTLE BROTHERS DOES IT (recall; to verify when a stamped Grok page lands)
- Difficulty is picked when you start a company: Beginner, Veteran, Expert, plus an IRONMAN switch (no reloads,
  death permanent). It shapes how strong the enemy is and how hard fights are at a given point in the game; it does
  not change the rules (initiative, action points, zone of control, fatigue). Rules never move, numbers do.
- What players say (recall): the number on the label barely matters; what matters is the first ten hours, when a
  few lost men decide whether the run lives. So the right default is the one a stranger survives their first
  contract on, not the one that matches the tough fights.

## 2. WHAT OURS DOES TODAY (measured first, rule 12)
Five difficulty packages already exist: EASY, NORMAL, HARD, V.HARD, BOHEMIAN. They set TWO unrelated things at once:
- THE DIAL (the pattern YOU must hit; PKG_FELT 1.00, 1.60, 2.20, 2.90 and an EASY slowdown of 0.81): your SKILL.
- THE ENEMY'S AIM (V121: THREAT_BY_PKG 1.00, 1.12, 1.26, 1.42, 1.60 divides the enemy's MISS chance): the PRESSURE.
Both ride one number, so a player who struggles with the rhythm also gets weaker enemies, and one who masters it
cannot ask for harder enemies without harder rhythm.
It never reaches enemy damage (the V121 note says it scales damage; the code scales only the miss), enemy count,
enemy level, enemy gear, the death rule or pay.

## 3. THE FINDING THAT PROVES US WRONG
*** THE FIVE TIERS BARELY MOVE ANYTHING A PLAYER FEELS. *** Measured with the enemy hit chance the build uses
(mid-lot 0.699 and far side 0.370 on NORMAL, point blank is already 0.97):
    tier        enemy hit chance mid / far     hits you take vs NORMAL   a man's median life   struck down / fight
    EASY        0.699 / 0.370                  x0.91                      135 fights            4.6%
    NORMAL      0.731 / 0.438                  x1.00                      121                   5.0%
    HARD        0.761 / 0.500                  x1.08                      110                   5.4%
    V.HARD      0.788 / 0.556                  x1.15                      105                   5.8%
    BOHEMIAN    0.812 / 0.606                  x1.21                       96                   6.1%
The hardest setting is 21% more enemy hits and a man living 96 fights instead of 121. A player cannot feel that;
he would think the setting did nothing. (His own sentence, "the smallest changes in numbers mean the biggest
difference", is true only where a number crosses a threshold; these do not.) Near the player nothing moves at all
because point blank is already 0.97.

## 4. THE DESIGN: THREE SLIDERS, EACH A NAMED SET OF TABLE ROWS
The numbers table marks which rows a slider may move (`slider: true`) and the range it can never leave. A slider is a
list of multipliers on those rows, nothing else. Three kinds, kept apart:
  A. PRESSURE (the world): enemy accuracy tier (existing), enemy damage x, enemy count +-1, enemy level, pay x.
     This is his three reasons a fight is tough, as one control.
  B. STAKES (what losing costs): the death chance (struck down 20% dead, 10% veteran) and the injury days.
     His ruled default is the middle. Lower = gentler, higher = Ironman-like. This is the BB Ironman idea as a dial.
  C. ASSIST (your skill): the dial speed and the beat window (PERFECT_MS, GOOD_MS, BEAT_GRACE, EASY_PKG_SLOW).
     An accessibility control, not a difficulty: it never changes the enemy, so a player may have a wide window and
     still face HARD pressure. This is the split the old single number could not do.
WHAT NEVER MOVES (the BB lesson): the beat is always 120 BPM; the grid and reach (pistol 1, rifle 2, scope 3);
everything costs one; the morale rules; the loot rules; the main character never dies; no damage before the dial.

## 5. FOUR PRESETS, MEASURED (model: struck-down chance 5% x accuracy ratio x enemy damage x bodies/4.33; nothing built)
    preset     accuracy  damage  bodies  death   struck   median life  dead before vet  rounds   men out at once  pay
    STEADY     EASY      0.85    -1      10/5%   3.0%     440 fights    6%              6.7      1.3              x0.90
    STANDARD   NORMAL    1.00     0      20/10%  5.0%     117           17%             9.4      2.2              x1.00   <- his rule
    HARD       HARD      1.15    +1      20/10%  7.6%      72           25%             12.4     3.4              x1.15
    IRON       BOHEMIAN  1.30    +1      30/15%  9.7%      29           42%             13.3     4.3              x1.30
(rounds from the fight-length page: 9.4 base scaled by bodies and half the damage change; men out = 1 fight every 4
days, 6 fielded, 35 days out.) IRON is meant to hurt: nearly half your men die before they are veterans.
THE DEFAULT A STRANGER PLAYS AT: STANDARD pressure and stakes (his 20% and 10% are the ruled middle, and he said he
loves dying a lot), with ASSIST on its widest setting until the player turns it down. First contracts should be
cushioned by the world (fewer bodies on the first three fights), not by a weaker rule.

## 6. ROWS (proposed, for the table)
diff.accuracy_tier (existing THREAT_BY_PKG), diff.enemy_damage_mult [0.7,1.5], diff.bodies_delta [-1,+2],
diff.enemy_level_mult, diff.pay_mult [0.8,1.4] (harder pays more so the risk is paid), diff.death_struck [0.05,0.40],
diff.death_veteran [0.025,0.20], assist.beat_window_mult [0.8,1.5], assist.dial_speed_mult (existing EASY_PKG_SLOW).

## ROUTED
- TUNING [numbers table]: section 6 rows; mark each `slider: true` with its range.
- COMBAT: the dial and the enemy aim ride one tier today (section 2): needs splitting before ASSIST can exist; also
  the V121 note says damage scales but the code scales only the miss.
- WORLD: first-contract cushion (fewer bodies) and the fight cadence the men-out column assumes.
- Test material: the toy page is draft:true, never in the game.

## CORRECTED 10/9 (see records/BOHEMIA_TUNING_THE_WIKI_CHECK_WHAT_I_HAD_WRONG_10_9_26.md): the claims above marked recall were checked against the wiki. Corrections to this page are listed there in section 1; where they clash, that page wins.

## STALE FOR THE DEMO 10/10: the fight numbers on this page were measured on the old fight tab (COMBAT_B64). The demo fights in BOHEMIA_FIGHT.html on the wiki rows. See section 3 of records/BOHEMIA_TUNING_THE_FELT_NUMBERS_TABLE_IS_REAL_AND_MY_FIGHT_FINDINGS_ARE_STALE_10_10_26.md.
