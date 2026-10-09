# TUNING ROUND 4 -- [fight length] WHY A BATTLE BROTHERS FIGHT RUNS 40 MINUTES AND OURS DOES NOT (9/29/26)
# Row: VAMILY TUNING [fight length], MODE RESEARCH (rule 38g). Rule 40a; his words records/BOHEMIA_PAOLO_TOUGH_BATTLES_ARE_30_40_MINUTES_9_29_26.md
# ('tough battles can be 30-40 mins... shorter than 30-40 even for tough battles... either the enemy is higher level,
# or better equipment, or you fucked up'). His measurement replaces my recall of "5 to 20 minutes" (struck).
# Sources: our decoded fight (COMBAT_B64 on 9/29 main); records/BOHEMIA_COMBAT_THE_ENCOUNTER_CURVE_8_19_26.md
# (measured: 20 to 60 seeded fights); BB seconds-per-unit are RECALL-GRADE, calibrated to HIS 30 to 40 minutes.
# The model below is arithmetic on named numbers, not a recording of a human. EYES [where the minutes go] owns that.

## 1. WHY A BATTLE BROTHERS FIGHT RUNS LONG (one equation)
    minutes = rounds x (units on the board) x (seconds each unit takes)
- UNITS ON THE BOARD: turns are SEQUENTIAL. Every man and every enemy takes a turn, one after another, and the
  next cannot start until the last one has finished walking and swinging. Up to 12 of yours plus 15 to 30 of theirs.
- SECONDS EACH: a move animation, an attack animation, an AI think, a hit reaction: recall 3 to 6 seconds a unit.
- ROUNDS: about 8 in a routine fight; 12 to 18 when the enemy is armoured or numerous, because armour is a second
  health bar (records/BOHEMIA_TUNING_BB_NUMBERS_HOW_FIVE_POINTS_ARE_FELT_9_28_26.md s1) and a hit that only chews
  armour does not end anything.
Worked, calibrated to him:
    routine     12 v 15, 8 rounds,  4 s a unit   =  14 minutes
    tough       12 v 25, 13 rounds, 5 s a unit   =  ~40 minutes   <- his 30 to 40
    worst       12 v 30, 18 rounds, 5 s a unit   =  ~63 minutes
So it is not the chess that is long. It is that the equation MULTIPLIES three growing things. Cut any one of
them and the fight falls; cut the middle one (units acting one after another) and it falls the most.

## 2. WHAT OUR FIGHT DOES (measured first, rule 12)
- UNITS ACT ON THE SAME BEAT. Rule 23: a turn is a beat, you, your companion and the enemy all move inside it.
  So the middle factor is not 27 units, it is 1: minutes = rounds x seconds per round, and a round is ONE
  decision, not one per body. That single fact is most of the gap.
- BODIES: 3 to 6 (a weighted roll: 3 at 30%, 4 at 35%, 5 at 22%, 6 at 13%; 7-8 reserved for bosses).
- ROUNDS, MEASURED: 9.4 turns a fight on the curve (8.6 with 8 pinned); 20 fights in 8/19, none over inside 2.
  The 90-second target I invented was a guess about time; the repo had turns, never minutes.
- ARMOUR: enemies carry 0 except the boss (9). So our rounds do not inflate the way BB's do.
- MORALE ALREADY ENDS FIGHTS EARLY. The 8/28 study found the nerve system switched off behind a perk. V199 flipped
  FEAR_ON to true: once half the room is down, each standing man rolls to run at 10% + 5% per extra body
  (half that for elites). That is the shape of the real thing (winners lose about 5%, losers 10 to 15%, mostly
  in the rout). It is on, so it is not a fix owed; it is a dial to keep.

## 3. THE FINDING THAT PROVES US WRONG (mine and the manager's)
*** WE DO NOT HAVE A LENGTH PROBLEM. WE MAY HAVE THE OPPOSITE. *** Model: routine 9.4 rounds x 5 s = about 50
seconds. Even with all three of his dials turned up (enemy level +2 steps, better gear, a mistake) it is about
3.7 minutes, and a worse-than-anything case is about 9. His defaults (routine 2 to 4 minutes, tough 8 to 15,
never past 15) are CEILINGS and we are far under every one. The risk in a game that wants "450 hours to master"
is a fight that is over before formation and gear can matter. A ceiling is not a target; the target is the depth
that fits under it. (If a real play of the demo shows fights are long anyway, that is a decision-time problem, not a
turn-count problem, and EYES [where the minutes go] will show it.)

## 4. HIS THREE DIALS AS TABLE ROWS (proposal; nothing is built)
A fight is tough for three reasons only. Each is ONE multiplier on rounds, so nothing else can make a fight long.
  fight.level    rows per step: enemy hp x, enemy damage x   -> more rounds to kill you and to kill them
  fight.gear     enemy armour hold (the plate model, five-points page)  -> more rounds per body
  fight.mistake  not a row, an OUTCOME: standing in the open and taking hits already cost more (MOVING_MISS,
                 exposure), so the third dial is the player's, and TUNING only has to keep that penalty steep
Measured with the model, rounds x seconds per round (seconds grow with tension, 5 to 8):
    routine             9.4 rounds x 5 s = 0.8 min
    enemy +2 levels    13.2          x 5 = 1.1 min
    better gear        15.0          x 6 = 1.5 min
    you made a mistake 14.1          x 6 = 1.4 min
    all three          31.6          x 7 = 3.7 min
    all three, worse   67.7          x 8 = 9.0 min   (a hard case)
    the toy's sliders all the way up (four steps each): about 13 minutes, still under 15, while Battle Brothers reads about 100
Rows: fight.rounds.base 9.4 (measured), fight.level.hp_mult, fight.level.dmg_mult, fight.gear.hold,
fight.seconds_per_round [5,8], fight.ceiling_minutes 15 (his), nerve rows already in the draft table.

## 5. HOW WE KEEP IT UNDER HIS CEILING WITHOUT CUTTING DEPTH (what the studios do)
- ONE ACTION PER BEAT FOR EVERYONE (already ours) beats any animation speed-up.
- A GAMBIT CARRIES THE ROUTINE: the companion and later men act on set rules, so decision seconds per round drop.
- A FIGHT ENDS WHEN SOMEBODY LEAVES (morale): a hard cap on rounds no matter the body count.
- A PLAYER WITHDRAW is still absent (8/28 finding (d)); it is the other early exit and belongs to COMBAT.

## ROUTED
- TUNING [numbers table]: fight.* rows above; [difficulty sliders] = multipliers on fight.level and fight.gear.
- EYES [where the minutes go]: measure human minutes per fight on a phone; this page predicts about 50 s routine.
- COMBAT: a withdraw verb (finding (d)); confirm nothing but the three dials lengthens a fight.
- Test material: the toy page is draft:true, never in the game.

## CORRECTED 10/9 (see records/BOHEMIA_TUNING_THE_WIKI_CHECK_WHAT_I_HAD_WRONG_10_9_26.md): the claims above marked recall were checked against the wiki. Corrections to this page are listed there in section 1; where they clash, that page wins.
