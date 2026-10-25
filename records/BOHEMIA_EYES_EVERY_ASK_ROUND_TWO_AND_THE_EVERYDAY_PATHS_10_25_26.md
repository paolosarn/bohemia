# EYES AND EARS: EVERY ASK, ROUND TWO, AND THE EVERYDAY PATHS COUNTED (10/25, eyes-every-ask-10-25w, rule 179)

His words, through the coordinator (rule 112): 'everything we've talked about in the last three rounds is still not in the demo,
bro, I need that.' Rule 179: a line is DONE only when EYES has seen it in the live game, phone and computer, with a picture.
This round re-walked every line of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md that was not already SEEN, plus the new
lines 99 to 126, and walked what a player does every hour, counting taps and screens (EYES [the everyday paths, counted]).

## THE BUILD AND HOW IT WAS PLAYED
- The live demo moved four times while it was walked, so every mark names its build:
  BUILD 10/25w (deployed 5bbf075c, pages run 3888), BUILD 10/25x (52cdf9fb, run 3892, with COOK's every-town-its-own
  878f1610), and BUILD 10/25z (2a44b38d's tree; COMBAT 80ba31e1 run 3895 SUCCESS, RUN TWO 59c9cb7a run 3893 SUCCESS, the
  10/25z run in progress when it was walked). For each, `node tools/bohemia_cut_the_demo.js --check` said the committed demo
  is exactly the deploy's cut, and slices/, engine/ and records/target/ matched the deployed sha.
- github.io is refused by this box's proxy (403). So the deployed tree was answered from disk AT THE REAL ADDRESS
  (https://paolosarn.github.io/bohemia/slices/BOHEMIA_DEMO.html): the browser's own request hook served slices/, engine/ and
  records/target/ (the three folders pages.yml publishes), refused every other host, and the service worker was blocked.
  No server. The tool is tools/bohemia_eyes_live_session.js: one browser held open, steps read from files, it stops itself.
- THE PHONE: 390 x 844, touch, 3x. THE COMPUTER: 1440 x 900, mouse and keys. Four games: A NEW CREW in the dark (10/25w),
  THE LONE WOLF with the towns shown (10/25w), THE BLOCK WATCH (10/25x), A NEW CREW with the towns shown (10/25x, then 10/25z).
- Steps were real taps and clicks on the game's own hit lists (the map's town plates and job labels, the settlement's
  where(), the crew screen's cells and slots, the fight's own buttons). Some trips used the game's own travel call (travelTo,
  townTap) where the line under test was not the trip itself; every one is said in the step files.
- Six fights, all on AUTO, read from the fight's own log (FIGHT.S.log): who did what each turn, at what distance,
  with which weapon. The music level was read from the shell's own INTENSITY every 1.2 s.
- Pictures: records/eyes_every_ask_10_25w/ (q phone, k computer), 67 of them, the game's own camera.

## THE COUNT (126 lines)
- SEEN in the game: 76.
- SEEN as a page or a process: 10.
- HALF: 11 (2 the Mechanic and Heavy not met; 39 sight; 47 the beat; 64 the Strip; 79 the sizing; 84 animations; 88 the
  pulse by ear; 90 cover; 103 the Lone Wolf; 106 the towns' screens; 114 jobs that fit).
- NOT SEEN: 12 (67, 87, 96, 102, 109, 110, 111, 117, 121, 122, 123, 124).
- Not met or not tested: 6 (1 the squiggle by ear, 3 the Kid's look, 5 ghosts, 17 the down talk, 95 Bluetooth, 100 the
  Mechanic).
- Not built yet: 5 (108, 112, 119, 120, 126). No crash seen: 2 (11, 93). In the VOTE tab first by his rule 181: 2 (48, 85).
  In flight: 1 (105). Built, not yet seen: 1 (125).
- Not re-walked this round, last round's mark standing: 1, 3, 5, 39, 47, 64, 88, 95.

## WHAT MOVED TO SEEN THIS ROUND (was NOT SEEN or HALF)
- 30, 31, 97 THE CAR DOOR IN HIS HAND IN THE FIGHT: YOU holds it up and kneels behind it (q20 to q22).
- 36 THE CAMP: tents, a fire, the clock runs, food eaten, BREAK CAMP (q27).
- 55 THE SIX ON THE MAP'S BAR (q01, k01). The town and the fight still show one or none: lines 111, 121.
- 56 THE JOB'S PLACE IN THE DARK, named and ringed, an arrow at the edge (q02, q07, q24).
- 61 DROP on the phone with its cost (q08).
- 86 THE NIGHT BOARD IN COLOUR (k29).
- 91 DISMISS, one confirm (q12, q15). 92 THE COMPANY SCREEN, Battle Brothers' layout (q11, k02).
- 99 AUTO uses no ability. 104 A GUN SHOOTS THE MAN BESIDE HIM. 107 A JOB SAYS HOW FAR (q02, q04, q05).
- 113 GEAR NEVER VANISHES over three fights in a row (k15, k26, the crew read after each).
- 115 A SPEAR AND A CAR DOOR ON ONE MAN, both in her hands in two fights; two-handers wear their own name (k11 to k16, k26).
- 116 THE PISTOL IS NEVER A CLUB: the words on 10/25x, the fight on 10/25z (k12, k14, q34).
- 118 DROP A JOB RIGHT IN THE TOWN: 2 taps to drop, 3 to swap, no map, on 10/25z (q29 to q33).
- 16 A SUPERIOR ENEMY READS AS SUPERIOR: 'OUTCLASSES YOU · LV 5 · DODGES 76%' in red (k30).
- 44 THE REGION'S PLACES OUTSIDE THE VALLEY, named (k01, k09).

## THE NOT SEEN, WORST FIRST, WITH THE ROW
1. THE LONE WOLF STANDS STILL AND LOSES (96, 102, 103). His first job, a dire wolf and a hyena, on AUTO: two swings, then
   twelve turns ended with 9 of 9 AP beside a hyena at 27 of 120 he hit at 74 percent; down in round 15 (k07, k08). His riot
   kit cuts his fatigue from 118 to 55; the crew screen still shows 118. The door says 'If you go down, it ends' and the game
   went on (k09). Rows: COMBAT (for COMBAT TWO, the AUTO brain) [eyes: auto stands still]; RUN TWO [eyes: the god is too heavy].
2. AUTO SENDS THE SPEAR ALONE (109). Desi with the two-hand spear walked four tiles alone into three thugs and went down
   without a blow (q22). Same row [eyes: auto stands still].
3. THE DEAD STILL COUNT (79, 114). After three of the Block Watch died the map's bar read 12/25 against the crew screen's
   9/25 (k18, k19), the next meet sized the enemy to 13 with six able and wiped them (k25), and the rescue said 'YOU 8' and
   sent YOU alone (k28). Row: RUN [eyes: the dead, again] (a bounce-back on its SHIPPED [eyes: the dead still count]).
4. A JOB'S LABEL TAKES THE TOWN'S TAP (the everyday path). A tap on MOB's name went to the caravan's label drawn over it,
   16 blocks and 3 h 16 of clock (q24, q25). Row: RUN [eyes: a job on a town's name].
5. THE MEET CARD CALLS BEASTS MEN, AND FALL BACK DOES NOT HOLD. '4 MEN' for two beasts, '3 MEN' for hyenas, 'IN THE DARK'
   by day (k06, q35); the hyena card came back after FALL BACK on every step and the town could not be reached. Row: RUN
   [eyes: the meet card's men].
6. NO ONE-HAND SPEAR ON A SHELF. Towns roll stock for stalls they do not have; in six towns the only buyable spear was
   two-handed (q16 to q18, q26). Row: RUN TWO [eyes: a shelf with no stall].
7. A FINISHED JOB COMES STRAIGHT BACK. 'Bring the Salcedo family home' was offered again at 151 on the same board the moment
   it was paid (k24). Row: WORLD [eyes: a done job comes back].
8. 87 THE THREE MUSIC LEVELS: their turn 1, his turn 2, never 3, in every fight; SOUNDS' cards are in VOTE first (NOTE).
9. 110 THE SECOND SHIELD ICON, 111 and 121 ONE BAR NOT THREE: UI running (NOTE with the pictures).
10. 117 THE CREW TALLER THAN THE HOUSES on the map (q28): RUN claimed (NOTE).
11. 67 ONE STOREY EVERYWHERE but a church steeple: COMBAT's [eyes: heights you can read] (NOTE).
12. 122 AUTO HITS FOUR MEN A ROUND, not one at a time: COMBAT TWO queued (NOTE with the number).
13. 123 THE SHOP DOES NOT SAY WHAT A DOOR DOES TO HIM, 124 EVERYONE IS 'HE': RUN TWO queued (NOTE).

## THE EVERYDAY PATHS, COUNTED (rules 194, 195, 197)
| Path | Taps | Screens | What was wrong |
|---|---|---|---|
| Take a job in a town | 3 (board, job, Take it) | 1 | none |
| Drop a job, 10/25w | 3 plus the trip out (LEAVE, DROP, DROP IT) | 2 (town, map) | no drop in the town |
| Swap a job, 10/25w | 8 (close, LEAVE, DROP, DROP IT, the town, board, job, Take it) | 4 (town, map, town, board) | with two held, a third offer tapped did nothing at all (q06) |
| Drop a job, 10/25z | 2 (DROP, Drop it) | 1 | right after a take the held job shows only on reopening |
| Swap a job, 10/25z | 3 (board, job, 'Drop it and take this one') | 1 | only the first of two held is listed |
| A spear and a car door on one man | phone: not possible in six towns; computer: 4 clicks (door off, door on) | 1 | the only buyable spear was two-handed (q16 to q18); two one-hand spears sat in stock with no stall |
| Then three fights, his hands | fights 1 and 2 spear and door in her hands; fight 3 she was held | | gear kept through all three |
| Equip and compare | phone 2 (the first shows the signed difference, '-14'); computer hover plus right-click | 1 | the figure wears nothing he equips |
| Level up | a perk 2 (PERK, the perk) | 1 | none |
| Dismiss | 2 (DISMISS, YES; KEEP HIM keeps him) | 1 | 'DESI takes his pay... KEEP HIM': everyone is he |
| Hire at the post | 2 (hall, Hire) | 1 | nineteen recruits in four halls, every one a pistol man; no rare man |
| Sell the loot | 2 (smith, SELL THE JUNK) | 1 | none ('Sold 9 pieces for 56 batteries') |
| Travel to a job and back | 1 there (its label), 1 back (the town), paid on arrival | map only | a tap on MOB's name went to a job's label 16 blocks away |

## SMALL THINGS SEEN ON THE WAY (NOTES on the boards, no rows)
- The crew screen's figure wears none of his gear (q11, k02); the Lone Wolf's fatigue reads 118 there and 55 in the fight.
- The camp's bar clips the clock to 'DAY 1 12…' (q27).
- The rescue job's card is cut to 'Get your men back from' and pays 0; the wipe says 'The road crew keep the field' when the
  kids held them; the Lone Wolf's wipe says 'The beasts have your men and your gear' (k27, k09).
- The board's 'Not now' on an offer goes back to the list instead of closing.
- Every pistol and rifle on 10/25x still clubbed at one tile in the fight (4 blows); gone on 10/25z.

## MEASURES WORTH KEEPING
- Melee reach: 117 of 117 melee blows in three fights came from the next tile.
- The pistol beside a man: 11 of 45 blows on 10/25z were shots at the next tile, 0 clubs (10/25x: 4 clubs).
- AUTO's focus: the Block Watch's twelve hit four different men a round for six rounds.
- The music: their turn level 1, his turn level 2, in four fights, never 3.
- Money: three men 290 batteries; the Block Watch 125 and 84 food; the camp ate 6 food and water in two days.
- No tab died in about five hours, six fights, three of them lost.

## WHAT EYES COULD NOT DO THIS ROUND, SAID PLAINLY
- The live site itself: refused by the proxy; the replay is the deployed tree, not his phone's cache, GPU or Bluetooth.
- No ear: the squiggle, the pulse, Bluetooth.
- Not met: the Mechanic, the Heavy, ghosts, the Strip. Not re-walked: lines 1, 3, 5, 39, 47, 64, 88, 95.
- [the long play] (ten fights in a row) was not run; six fights in four games were.
- Line 125 (he always walks) shipped during the round; the one look was blocked on the road by the hyena card.
