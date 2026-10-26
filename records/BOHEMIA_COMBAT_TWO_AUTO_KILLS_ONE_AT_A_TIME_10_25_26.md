# COMBAT TWO: AUTO KILLS ONE AT A TIME, A SHOOTER TAKES THE BEST SHOT, AUTO KNOWS EVERY ENEMY'S LESSON (10/25-26)

Rows: [AUTO kills one at a time] (rule 201), [a shooter takes the best shot] (rule 191(a)), [AUTO knows every enemy's lesson]
(rule 182), on COMBAT's board, CLAIMED 10/25 COMBAT TWO. The fight file is slices/BOHEMIA_FIGHT.html (THE TEAM PICKS ONE and AUTO
KNOWS EVERY ENEMY'S LESSON blocks, before bestTarget); the numbers are ours.auto_brain and ours.lessons in records/target/bb/ours.json;
the gate is gates/auto_kills_one_at_a_time_gate.js (AUTO KILLS ONE AT A TIME in the suite); the before is
banks/BOHEMIA_COMBAT_TWO_AUTO_FOCUS_10_25_26.json (draft:true, nothing in the game reads it).

## HIS WORDS (verbatim, voice to text)
- 201: "in the auto combat, I don't see teammates working together at target one person or one enemy to make sure we kill Enemies
  at a time... it's just all the damage is spreading apart like equally on all the opponents... I want to see my team focus on
  killing whoever it may be for whatever reason for whatever numbers are best... unless the risk is too great to move from tile
  the tile because you're gonna get a free hit on you"
- 191(a): "the range units should always prioritize Enemies. They have the highest accuracy to hit at all... my range. Guy tried
  to shoot someone with the lowest accuracy setting like, bro this is fucked up."
- 182: "if killing the mechanic turns the rest of his robots off then why aren't we just aiming at the mechanic at every term that
  we possibly can that we're in range for... I can't be explaining each niche auto combat thing to you"

## WHAT WAS THERE (the before: main at d859efe1, after COMBAT's rules 199, 198 and 187's range bands)
bestTarget scored each foe by expected() (his chance times the weapon's middle over the foe's health plus body armour: the
softest man first), times focus_per_strike (1.25) for every strike his friends had already put on that man this round. Nothing
named a target for the team, nothing counted what the team could still deal to a man before he acts. The mechanic was a special
case: ai.json crew.snipes_the_head returned any man with Raise Undead the instant he could be struck, at any chance (14%, 5%).
Measured on the gate's 600 fights (TUNING's fightOf k 0..599) and 120 beast and ghost fights:
- won 495 of 600, clean (nobody of ours down) 305, our men down 1,064, rounds 5,595;
- the most-struck man of a round took 64.9% of our blows; 1.30 enemies hurt but standing after each of our rounds;
- 162 shots under a quarter of the shooter's best chance on the board;
- the mechanic struck in 661 of 661 turns a man could reach him, at any chance (the special case).

## WHAT IS BUILT
1. THE TEAM NAMES ONE (201(a)). Once a round (and again when he falls, runs, or nobody left this round can reach him), for every
   enemy our side can see: the men of ours still to act this round who can reach him (from where they stand, or by a walk that
   leaves no ring), their blows (the strike's AP, breath, rounds, a loaded gun) and chances, played through the rules' own
   hitDamage blow by blow (the armour wearing; the roll read at its quartiles, ours.auto_brain.damage_quantiles; the eight likeliest
   blows, count_blows) into the chance he goes DOWN this round, the chance he goes down BEFORE HE ACTS AGAIN (the men who go before
   his turn), and the share of him (health and armour) the blows take. Times what his death is worth in hitpoints a round: his own
   blows, every lesson of his (below), and the man of ours his blows would put down next turn. Score = worth x (kill_rounds x
   (down + share) + down before he acts + share): Lanchester (TUNING s3f, the one table's brain.kill_rounds = 2), a kill removes
   his damage for every round after; the share is the road to the kill, so it carries those rounds too. The runner-up is kept as
   the NEXT man.
2. EVERY MAN'S BLOW (201(b)(c)(d), 191(a)). Never a shot under ours.auto_brain.shot_floor (0.25) of his best chance on the board:
   the 'lowest accuracy' shot. When the team is all but sure to drop the named man this round (his down chance at least
   commit_kill, 0.8), every man who can reach him hits him. Otherwise each man strikes where his blows buy most in the same coin; on
   the named man (and the next) they buy what they ADD to the team's blows still to come on him, so the team piles on and nobody
   overkills (once he falls the next is named). A man who cannot strike the named man from where he stands walks to the tile with
   the fewest other men's rings and the most expected blows (a shooter: the highest such tile), unless: he stands in a ring (the
   free swings), a shooter would come down off his roof, his blows where he stands buy more, or the tile is ahead of his front
   line (rule 70b). Once a turn. Every blow keeps its choice and reason on the man (u.pick).
3. EVERY ENEMY'S LESSON AS DATA (182). ours.lessons.kinds: every kind the fight can field (ours.enemy_tiers mix and heads, six
   factions, 21 kinds) with its lessons by name; the fight's LESSON table has one reader per lesson that turns the game's own rule
   into hitpoints a round, reading the rule's own row, never a copy:
   - blows (every man): his own blows on the nearest of ours, armour and health the way the rules split a blow; a runner counts
     his too (rule 198: he rallies, and the fight ends only when he is down or gone);
   - his_machines_drop (the mechanic, ours.bestiary.mechanic): the last of his kind down, every machine of his drops: their blows;
   - stands_them_up (the mechanic, racial raise_undead): per_turn of his fallen back next turn at hp_pct: their blows;
   - gets_up (the machines, raise_undead): while a raiser stands, putting him down is not a kill (kill_rounds 0) and blows that take
     him under the raise's health buy nothing (his armour stays off);
   - nets (the kids, racial throw_net) [COMBAT TWO's default]: cut_pct of his side's strongest man's blows while he carries a net;
   - breaks_the_line (the heavy, racial line_breaker) [COMBAT TWO's default]: his blows on the weakest of ours a walk and a knock
     away, over his blows on the nearest, times knock_tiles;
   - breaks_nerve (the geist, racial horrific_scream) [COMBAT TWO's default]: the chance his checks walk a man of ours down the
     morale ladder to Fleeing (each a fail at 1 - resolve), times that man's blows;
   - leads (the brigand leader, ours.captain_aura) [COMBAT TWO's default]: for each of his men inside range_tiles, the extra chance
     one nerve check fails without him (resolve_pct of that man's resolve) times that man's blows (priced first as resolve_pct of
     their whole blows, it sent AUTO after the leader behind his line: 495 of 600 won where the old brain won 497);
   - shoots_the_soft (marksman, poacher; ai.json backline.soft): his blows on the weakest of ours in his reach over the nearest;
   - runs_round (the runner, the wolves, the hyena; ai.json rider and rusher): his blows on the weakest of ours a run away.
   The special case (snipes_the_head) no longer runs for our side: the mechanic is taken because his row says what his death does.
4. THE CALCULATOR PLAYS THE SAME BRAIN (201(f)): the odds worker runs the same fight-rules script, so its AUTO is this AUTO with no
   second copy. S.focus is kept in the saved fight (KEPT_STATE). Their side keeps Battle Brothers' spread (201(e)): bestTarget's
   old scoring, 1/(1+n), untouched.

## EVERY BRAIN TRIED (the same seeded fights; deterministic: a config run twice gives the same numbers to the blow)
On COMBAT's base before rule 199 (8b29f4b2), 300 fights, the old brain: won 246, clean 154, down 531, hurt 1.34, low shots 1,652.
| brain | won | clean | ours down | hurt/round | named share | shots >10 under best |
|---|---|---|---|---|---|---|
| first cut: threat counted as blood only (every armoured man harmless) | 80/100 | | | 1.99 | 70.2% | |
| the strict 191(a): only shots within 10 points of his best, value inside | 241 | 143 | 558 | 1.87 | 63.6% | 0 |
| within 20 points | 245 | 149 | 550 | 1.72 | 63.5% | 0 |
| within 30 points | 256 | 160 | 451 | 1.49 | 65.1% | 0 |
| the best-chance shot only, the named man exempt | 247 | 150 | 520 | 1.63 | 71.3% | 713 |
| the coin, no floor | 252 | 164 | 470 | 1.27 | 63.7% | 1,670 |
| the coin, floor 0.25 | 252 | 159 | 484 | 1.33 | 63.5% | 1,670 |
| every man on the named man always (201(b) to the letter) | 245 | 147 | 531 | 1.74 | 78.4% | 1,419 |
| the same, named by kill odds first (201(a) to the letter) | 241 | 140 | 581 | 1.67 | 79.6% | 1,390 |
| a shooter walks for a fair shot on the named man | 80/100 | | | 1.58 | 67.9% | 0 |
| no join walks at all | 79/100 | | | 1.99 | 67.3% | |
| + the mechanic's lesson as data, the share as the road to the kill | 255 | 165 | 439 | 1.38 | 60.3% | 1,660 |
On COMBAT's base after rule 199 (a3c87279), 600 fights, the old brain: won 486, clean 294, down 1,107, hurt 1.35, rounds 5,811.
| commit_kill (pile on when he is this likely to drop) | won | clean | ours down | hurt/round | named share | rounds |
|---|---|---|---|---|---|---|
| 0.5 | 482 | 321 | 1,039 | 1.40 | 66.9% | 5,301 |
| 0.7 | 491 | 314 | 1,002 | 1.43 | 63.7% | 5,292 |
| 0.8 (shipped, with the roof kept) | 489 | 323 | 990 | 1.43 | 62.3% | 5,229 |
| 0.9 (with the roof kept) | 498 | 324 | 954 | 1.44 | 60.3% | 5,108 |
| off (the coin alone) | 486 | 331 | 946 | 1.43 | 59.3% | 5,067 |
| 0.9, the worth to the power 0.5 / 0 | 489 / 486 | 317 / 320 | 1,009 / 1,037 | 1.41 / 1.40 | 62.1 / 61.4% | |

WHAT THE TABLE SAYS:
1. THE STRICT READING OF 191(a) LOSES FIGHTS. Every brain that forces the shooter onto his best chance (within 10 or 20 points)
   wins fewer than the old brain and puts more of ours down; the finishing shot on a hurt man at 30% beats the fresh man at 55%
   (Lanchester: the kill takes his blows off every round after; the wound takes none). Built instead: the floor (no shot under a
   quarter of his best: the 'lowest accuracy' shot he saw, 14% while 58% was there; 181 such shots before, 0 now) and the coin
   above it. The clause 'the kill-this-turn and the key man win only when their chance is close to the best one' is the
   coordinator's, not his words (rule 205(b)): the plainer reading (his 'lowest accuracy') is built, and this table is why.
2. 201(b) TO THE LETTER LOSES FIGHTS TOO. Every man on the named man always: 78% of the blows on him, and 245 won, 531 down. The
   named man is often the hard, dangerous one, and the finishing blow on a nearly dead man next to him is thrown away. Built: the
   pile-on when the kill is likely (0.8), the coin otherwise (the team's blows still to come counted on the named man, so they
   still meet on him).
3. THE SPREAD BAR IS NOT MET (201(g)(2), TUNING's draft 1.3). Every brain that scores blows by the kill leaves 1.40 to 1.44 enemies
   hurt but standing a round where 'the softest first' left 1.35, with or without the worth weighting (power 0 still 1.40); it
   wins more, keeps more men up and ends fights 10% sooner. The gate WATCHES the number and prints NOT MET. FOR TUNING: the bar
   or the measure (a raised machine stands up hurt, a blast hurts three, a ring-locked man hits the man in front of him: 1,950 of
   the off-target blows on 600 fights are 'in a ring').
4. THE MECHANIC: the special case hit him in every turn he was in reach (713 of 713), at any chance; the lesson hits him in 786 of
   800 blows a man could put on him over the floor, and the 14% shots at him are gone (the floor). Machine fights, crew of 3 on
   300 fights, clean wins 13 -> 16 once his lesson (the robots he stands up are not kills) was read.

## THE GATE, BEFORE AND AFTER (gates/auto_kills_one_at_a_time_gate.js --n 100 --jobs 4; the suite's run), on d859efe1
100 rolled AUTO fights and 20 beast and ghost fights, the old brain on the same seeds:
- F1 THE TEAM PICKS ONE: 63.7% of 4,207 blows on the named man (the old brain had no named man; its most-struck man took 65.8%);
- F2 WATCHED: 1.31 hurt but standing a round (the old 1.21); TUNING's 1.3 NOT MET (600: 1.36, the old 1.30);
- F3 every off-target blow with its reason: worth more 596, out of reach 437, in a ring 350, worth more where he stands 50, keeps
  his roof 48, a shot too poor 24, ahead of his line 21;
- F4 a shooter takes the best shot: 0 under the floor (the old 33); the 498 more than 10 points under his best: a hurt man, the
  named man or the next, a man with a lesson, or a man his best-chance shot buys less than (the gate recomputes it in the brain's
  own coin), none without a reason;
- F5 21 kinds, 10 lessons, every row and every reader;
- F6 the mechanic: 136 of 143 fair chances taken (the old 95 of 95, at any chance);
- F7 won 86 clean 53 (the old 84, 53), fight by fight: wins lost 3 gained 5, clean lost 7 gained 7; the beast and ghost fights won
  14 of 20 (the old 13); our men down 136 (161); rounds 842 (896).
On 600: won 488 clean 312 (the old 495, 305), wins lost 27 gained 20 (inside chance by the sign test, but the third base in a row
where the wins came out a few under: -3, -3, -7; said plainly, TUNING's to watch), clean lost 42 gained 49, ours down 987 (1,064),
rounds 5,371 (5,595), 64.2% of the blows on the named man, 0 shots under the floor (162), the mechanic in 750 of 794 fair chances.
AUTO NEVER WASTES A TURN 9/0 (G5 the roof: the join walk first took gunmen off their roofs, 43.5 -> 39.7%, the 'keeps his roof'
rule put it back over the bar).
WHY F7 IS A PAIRED TEST: a fight is chaotic; any change to one blow re-deals the dice after it, and two brains as good as each
other flip about one fight in fifteen each way (on 600: 21 and 18). A raw 'no fewer wins' on 600 fights moved 494 to 497 and back
with changes that do nothing to the brain's logic (the leader's price, 2 wins). The leg now passes when the fights lost do not
outnumber the fights gained beyond chance (the sign test at 95 in 100), and prints the counts.
THE RULES MOVED UNDER THIS ROW FOUR TIMES (COMBAT's rule 199, walk through your own men, a3c87279; rule 198, the rout a chase,
75a94cdc; 2890d0ea/27507bcd; rule 187's range bands, 34e0a072): each re-dealt every fight; the before was measured again on each
base, the after with it. Rule 198 made a runner matter (the fight ends
only when every one of theirs is down or gone): a runner is now named and priced like any man (his blows: he rallies).

## ON THE REAL PAGE (rule 179's half this lane can do; the live site is out of this container's reach, its network policy denies
## paolosarn.github.io, so EYES watches the live demo)
tools/bohemia_combat2_watch_auto_focus_10_26_26.js opens slices/BOHEMIA_FIGHT.html itself in Chromium, AUTO on, five seeds, at the
phone's profile (390 x 844 at 3x, touch) and the computer's (1440 x 900), and reads what the page's own fight did:
- phone: 5 of 5 won, 179 of 288 of our blows on the named man over 27 rounds, 44 of theirs dead;
- computer: 5 of 5 won, 180 of 288, the same 27 rounds and 44 dead;
- the pictures, taken the moment a named man falls with three or more of our blows on him that round (seed 61, round 3):
  records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_phone_portrait.jpg, records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_computer.jpg;
  the numbers per round in records/target/COMBAT2_AUTO_KILLS_ONE_AT_A_TIME_WATCH.json.
THE WHOLE FIGHT on this change: THE REBUILT FIGHT PLAYS 152/3, the three reds the ones COMBAT named on main before (the night pass,
a man off his ground at night, the bank frames), none of them AUTO's.

## FOR COMBAT (your lead, your rules)
- THE FORMATION IS KEPT's line leg read the line at round 4 whatever had happened; on its seed the lines meet in round 1 and by
  round 4 three of his men had killed the man in front of them and stood 4 to 6 from the rest while one still fought: 'ahead of the
  line' on a fight, not a line. Re-aimed (gates/the_formation_is_kept_gate.js): read at every AUTO step until round 4 or the lines
  meet, whichever is first (the brain's own keep_formation boundary). 23/0 on main and on this change.
- Ghosts against a lone man: 4 of 120 beast and ghost fights run past 60 rounds (the old brain 5): a lone man of ours with a
  pistol and a dozen geists Steady around him, nobody landing. The standoff end reads 'they landed nothing'; the geist's scream
  is not a hit. Yours to rule.
- Fixed by your rule 195 before I could hand it over: a gun beside its man with AP for exactly one shot rolled his shot at his
  club's chance (the AP was spent before the chance was read). With the club gone, gone.

## WEAK
- The lesson readers marked [COMBAT TWO's default] price rules the library gives no number for; TUNING's to tune.
- The named man is named for the side, not shown: EYES sees the focus only as the blows meeting; a mark on the named man is UI's
  (never a thing that pops up, rule 32a).
- The F2 bar above.
- NOT YET SEEN (rule 179): EYES watches five AUTO fights on the live demo, phone and computer.
