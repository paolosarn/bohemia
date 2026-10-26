# TUNING 10/26: THE STUPID-MOVE WATCH, ROUND FOUR (rule 188(b), standing every round; research only)

The coordinator: COMBAT shipped ONE PACE on the beat (d5dc8f03, rule 274) and FATIGUE COMES BACK (b6f5dd21, rules 283 and 285: END TURN
with nothing spent is a rest of 30, and AUTO rests a winded man of his), which round three waited on. Run many AUTO fights on main, count
every wrong move by class, compare to round three, put the rows for what is still wrong on COMBAT's board (COMBAT TWO takes the brain's).

Tool tools/bohemia_tuning_stupid_move_watch.js --n 100 --jobs 4 --save, the same 600 fights as rounds one to three (his three, the Lone
Wolf, A New Crew, the spear crew, the twelve, TUNING's bench; AUTO both sides, our side watched). Main 6585e7a4 (the last fight commit),
rules print adf6f52ced29 (round three d3ed6cfb, e8efcbfd38de). Bank banks/BOHEMIA_TUNING_STUPID_MOVE_WATCH_10_26_26.json, round
adf6f52ced29. Between the two rounds the fight took: the one pace, the rest of 30, AUTO's rest for a winded man, an early retreat and
the wiki's gap between the fronts (5 between, 6 apart; it was 4 between, rule 256), the shield covers the man behind (the astray shot,
rule 230(b)), spare them or run them down (198(h)), struck down he still fights (234).

THE INSTRUMENT, THREE CHANGES (said, so round five reads the same): (1) an ASTRAY shot (230(b)) is the shot's own flight, never a second
blow chosen: it no longer counts as a blow, a focus blow or a landed hit (COMBAT's own gates skip it the same way): SPREAD 159 -> 153
on the same fights, everything else within one. (2) Every idle turn now also says whether the man was WINDED at full AP (rule 285's
rest, the right move, not a stupid one). (3) BREATHLESS: men unable to swing three or more of their turns running (rule 283(d): never
more than two). Two research splices for the cause of a change (gap4: the fronts five apart as before; noastray: 230(b) off) and three
for rule 285's numbers (rest15, rest45, owedoff). Splices are never the game and never saved into the round.

## 0. THE ANSWER

1. **THE FATIGUE FIX WORKS, AND IT IS THE BIGGEST CHANGE THE WATCH HAS SEEN.** The Lone Wolf wins 37 -> 57 in 100 on the same fights; his
   three-turn idle streaks 50 of 83 fights -> 0; every 'winded beside a foe' idle (525) is now a winded man taking his rest at full AP.
   Rule 283(d) holds on AUTO in every crew: 0 of 2,113 men unable to swing three turns running (590 turns begun winded, the longest run
   2). STREAK 115 -> 34, and none of the 34 is a winded hold.
2. **THE BRAIN'S COUNTS WENT DOWN:** the Mechanic in reach and never struck by the turn 97 -> 65 (20.7 -> 15.6 in 100; A New Crew 10 -> 2,
   the bench 21 -> 5); SPREAD 169 -> 153 (4.41 -> 3.65 in 100; chosen by the coin 104 -> 87); LONE INTO THREE 38 -> 28; a melee man who
   never struck 14 -> 12.
3. **TWO WENT UP, AND ONE OF THEM IS NOT THE BRAIN.** THE IDLE GUNMAN 278 -> 483 turns: 270 of the 337 kept examples are ROUND ONE, a
   gunman whose tile has no shot at the wider opening. On the same seeds with the fronts five apart (splice gap4) it is 50 -> 10 for his
   crew, 80 -> 39 for A New Crew, 80 -> 16 for the spear crew, 172 -> 105 for the twelve. The wider opening (the wiki's gap, rule 256)
   also costs HIS CREW 11 FIGHTS IN 100 (48 won; 59 with the old gap, exactly round three's 59; 21 fights flip, the machines six of the
   net); all four crews 292 -> 308 of 400 with the old gap. The astray shot costs nothing (noastray: 290 of 400, 47 for his crew).
   LOW SHOT 220 -> 254 (3.67 -> 4.08 in 100), 189 of them 'worth more' and 150 at a man already hurt: the brain's own coin, round two's
   STICK row stands.
4. **KEY MAN LAST 12 -> 22 of 74 fights is mostly lost fights:** the Mechanic never fell in 12, and 11 of those 12 we did not win (his
   crew's lost fights: 13 of 19 with the new gap, 8 of 19 with the old).
5. **RULE 285's NUMBERS, MEASURED:** the rest of 30 is the knee. At Battle Brothers' plain 15 the Lone Wolf wins 47 and in the heaviest
   kit 32; at 30, 57 and 54; at 45, 56 and 54. The hits a resting man takes held until his next spending turn (the coordinator's
   default) are what keep 283(d) true even at 15 (section 3).

## 1. THE COUNTS, ROUND THREE -> ROUND FOUR (all six crews, the same 600 fights)

| the wrong move | round three | round four | per 100 |
|---|---|---|---|
| KEY MAN LAST: the Mechanic falls last of his party, or never (fights with a Mechanic) | 12 of 74 | 22 of 74 | 16.2 -> 29.7 (11 of the 12 'never' in fights not won) |
| KEY MAN BY THE TURN: in reach a whole turn, never struck (turns) | 97 of 469 | 65 of 417 | 20.7 -> 15.6 (52 of the 65 a shot under a quarter of his best: fair) |
| LOW SHOT: 10+ under his best, not the team's man (shots with a choice) | 220 of 5,997 | 254 of 6,223 | 3.67 -> 4.08 |
| SPREAD: hits split, none fell, one could have (rounds with our blows) | 169 of 3,835 | 153 of 4,187 | 4.41 -> 3.65 |
| IDLE: winded beside a foe (turns) | 716 of 17,063 | 525 of 17,675 | 4.2 -> 3.0: ALL 525 a winded man's rest at full AP (rule 285); 497 in a ring, 28 out of every ring (rule 231(c)'s 'step back' would spend the rest; under 285 resting is right) |
| IDLE: a gunman stood, a shot one walk away (turns) | 278 | 483 | 1.63 -> 2.73 (round one: the opening a tile wider; 2 of them winded rests) |
| STREAK: the same man idle at full AP 3+ turns running (men) | 115 of 2,043 | 34 of 2,113 | 5.6 -> 1.6 (winded holds 72 -> 0) |
| NEVER: a melee man who never struck | 14 of 935 | 12 of 946 | 1.50 -> 1.27 |
| LONE: a walk alone into three | 38 of 4,681 | 28 of 5,307 | 0.81 -> 0.53 |
| PARKED (COMBAT's J1, melee turns) | 20 of 7,711 | 21 of 7,778 | 0.26 -> 0.27 |
| IDLE: a melee man with a walk open | 37 | 39 | 0.22 (18 of them winded rests) |
| BREATHLESS 3+ turns running (283(d), men) | (not counted) | 0 of 2,113 | 0 |
| a blow left / free hit / dance / gunman who never shot | 0 / 0 / 5 / 1 | 0 / 3 / 3 / 1 | |

Won 423 -> 434, clean 249 -> 253; ours down 922 -> 987, dead 129 -> 147 (the twelve 62 -> 76, the bench 21 -> 32). Rule 201: focus
share 64.9 -> 66.4; hurt and standing at a round's end 1.10 -> 1.19.

BY CREW (won; the counts that moved):
- HIS CREW: won 59 -> 48, clean 30 -> 18, down 166 -> 202; the idle gunman 24 -> 50; LOW SHOT 4 -> 15; SPREAD 15 -> 7. With the old gap:
  won 59, the idle gunman 10, LOW SHOT 7.
- THE LONE WOLF: won 37 -> 57; winded idles 360 -> 178 (all rests); STREAK 50 -> 0.
- A NEW CREW: won 70 -> 73; the Mechanic by the turn 10 of 40 -> 2 of 32; the idle gunman 31 -> 80 (39 with the old gap).
- THE SPEAR CREW: won 87 -> 83; SPREAD 24 -> 9; the idle gunman 20 -> 80 (16 with the old gap).
- THE TWELVE: won 83 -> 88, clean 30 -> 23, dead 62 -> 76; SPREAD 70 -> 73 of about 800 rounds (8.9 in 100, still the worst crew); the
  Mechanic by the turn 60 -> 53 of about 195.
- THE BENCH: won 87 -> 85, dead 21 -> 32; the Mechanic by the turn 21 -> 5.

## 2. WHAT THE OPENING A TILE WIDER DID (splice gap4: deployment.min_gap_between_lines_hexes read as 4, the same 400 fights)

| crew | won now / gap 4 | ours down | ours dead | the idle gunman | fights that flip |
|---|---|---|---|---|---|
| his crew | 48 / 59 | 202 / 173 | 18 / 25 | 50 / 10 | 21 (16 lost now, won at 4) |
| A New Crew | 73 / 75 | 118 / 117 | 12 / 18 | 80 / 39 | 20 (11) |
| the spear crew | 83 / 82 | 90 / 83 | 9 / 5 | 80 / 16 | 9 (4) |
| the twelve | 88 / 92 | 377 / 349 | 76 / 75 | 172 / 105 | 12 (8) |

Fewer wins and fewer dead in the small crews: the wider opening loses more fights and the early retreat (256) gets more of them out.
The gap is Battle Brothers' own ('at least 5 hexes between parties'), so the lever is not the gap: it is what AUTO's gunman does in
round one when his tile has no shot (rule 188(a): a shooter gets sight and reach), and why his crew's three lose 11 more against the
machines.

## 3. RULE 285's NUMBERS (the same seeds; wolf, the Lone Wolf in the heaviest kit, his crew, A New Crew, the twelve)

| the rest | the Lone Wolf won | heaviest kit won | A New Crew | the twelve | turns begun winded | the longest winded run |
|---|---|---|---|---|---|---|
| Battle Brothers' plain 15 (rest15) | 47 | 32 | 73 | 86 | 364 | 2 |
| 30, the coordinator's default (LIVE) | 57 | 54 | 73 | 88 | 319 | 2 |
| 45 (rest45) | 56 | 54 | 77 | 88 | 280 | 1 |
| 30, the hits on a resting man land at once, Battle Brothers' way (owedoff) | 49 | 35 | 71 | 87 | 341 | 6 (BREATHLESS 3+: the Lone Wolf 16 of 86, the heaviest kit 34 of 98) |

BOTH NUMBERS STAND. ours.rest_recovery 30, and the coordinator's default that the hits and blocks put on a resting man are owed
until his next spending turn closes (285(b)): without it the Lone Wolf loses 8 more in 100 (19 in the heaviest kit) and a man can
stand six turns unable to swing, which 283(d) forbids. ours.rest_recovery 30. It is the knee (15 -> 30 is +10 and +22 wins for the Lone Wolf; 30 -> 45 nothing). Battle
Brothers has no rest bonus: its answer is the Recover perk, half the fatigue for 9 AP (the wolfrecover splice of round one); 30 on a
turn with nothing spent is about the same breath for a man at 60 fatigue, with no perk and no button. One table section W.

## ROUTED
- COMBAT (NOTE): the opening a tile wider costs his crew 11 fights in 100 and makes the round-one idle gunman; rule 231(c)'s 'step back
  out of every ring' meets rule 285's rest (28 turns): resting is right now, say which wins in the code's comment.
- COMBAT TWO (NOTE, the brain's rows): the idle gunman in round one (483; the shooter walks to a tile with a shot, or to a roof, when
  his tile has none); LOW SHOT up (254; the STICK 1.5 row stands); the twelve's SPREAD (8.9 in 100); the Mechanic by the turn down to 65.
[bb the watch: Battle Brothers' tired man waits or presses Recover; ours rests by ending his turn, and AUTO now does it for him]
[analog horror: a man stands still in the middle of the fight, breathing, and the count of his breath is the only number that goes up]
