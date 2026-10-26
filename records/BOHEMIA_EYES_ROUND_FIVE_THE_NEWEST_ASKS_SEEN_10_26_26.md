# EYES AND EARS: ROUND FIVE, THE NEWEST ASKS SEEN ON THE LIVE GAME (10/26, eyes-round-five, rules 179, 225(c), 173(e), 287)

The coordinator's message, four jobs in order: (1) FIRST, the moment each lands live: the COMBAT emergency fix ('tweaking' on
AUTO and by hand; ten fights from a saved game through the map), CAMP's struck-down man fighting again at one hitpoint and the
dead staying dead (line 156), the bars over their heads (189), camp holding until he ends it (198), tape at every stall and in
the loot (195, 207), healing x5 (193, 194); (2) every line from 154 to 208 whose lane has shipped, SEEN / HALF / NOT SEEN with
the build and a picture, every HALF and NOT SEEN a row at the top of its owner's board; (3) ten fights in a row on each
profile, the memory each time; (4) the list's status column and the counts.

## THE COUNT (the coordinator reports this)
Of the list's 242 lines (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md): **SEEN 136** (was 109 at 06:00), **HALF 24**,
**NOT SEEN 9** (17, 67, 96, 102, 109, 117, 202, 219, 226), NOT BUILT 6 (the lane's row still open; what the live game does
today is written on the line: 189, 198, 212, 218, 220, 223), NOT SHIPPED 36 (no lane has shipped them, nothing to walk; line 242, rule 290, came in during the round), not
met or not tested 17, and 14 standing, queued, running or his taste. 42 lines marked this round, each leading with 'EYES R5'.

## THE BUILDS AND HOW THEY WERE PLAYED
- BUILD 10/26zh - THE SMITH MENDS (deployed c4a5fd98, pages run 3971 SUCCESS; the COMBAT emergency's fix d3ed6cfb in it) for
  the start, the towns and the first twenty fights; then BUILD 10/26zq - HIS MAP (deployed 934932e6, run 3981 SUCCESS; the
  walked tree differs from it only in the VOTE registry) after a cache-cleared reopen and CONTINUE on both profiles, for
  PLAY, the fit, the retreat, the clinic, the smith, the crew screen, MAKE CAMP and three more fights. Runs 3983 and 3984
  (RUN's 26c18a3a, COOK's 86174fc9) were cancelled behind newer pushes and are not in these marks.
- github.io is refused by this box's proxy (CONNECT 403), so the deployed tree is answered from disk at the real address
  (https://paolosarn.github.io/bohemia/slices/BOHEMIA_DEMO.html), slices/, engine/ and records/target/ only, every other host
  refused, the service worker blocked, no server (tools/bohemia_eyes_live_session.js, one browser per profile, it stops itself).
- THE PHONE: 390 x 844, touch, 3x, A NEW CREW with the door's defaults. THE COMPUTER: 1440 x 900, mouse, THE BLOCK WATCH.
- Every fight through the map: a job off a town's board by real taps, the party walked to it (a touch on the place, or the
  map's own travelTo when the place was off the glass, the call the touch makes; PLAY once it shipped), the meet card,
  ENGAGE by a real tap; AUTO by a real tap; by hand, a finger that strikes a man in reach with two taps and otherwise walks
  toward the nearest with two taps, then END (the first finger walked with one tap and so never moved: the by-hand losses
  of fights 4, 5, 7 and 8 on the computer and 7 and 8 on the phone are that finger's, not the game's).
- A save was made, the tab killed and the link opened again (CONTINUE · DAY 1 · 06:00 on both), and every fight after came
  from that saved game.
- Pictures: records/eyes_every_ask_10_26zh/ (q the phone, k the computer; 37 webp).

## (1) THE FIRST LIST, ONE BY ONE
- THE COMBAT EMERGENCY, LINE 229: SEEN. 23 fights through the map (11 on the phone, 12 on the computer; 12 on AUTO, 11 by
  hand): the longest stretch with nothing moving outside his own turn was 1,162 ms; no turn broke (FIGHT_UI.broke 0 in every
  fight); no page error in the whole session (0 on both, 6,687 and 6,341 files served); every tap of the last two hand
  fights answered (3 of 3, 5 of 5). WHAT IS STILL THERE (line 212, COMBAT's [one pace, on the beat] open): the beat under his
  turns is 500 ms and under theirs 250 ms, and 125 ms when a side runs out (computer fight 9: their 33 turns at 125); their
  median turn 0.6 to 0.9 s against his 1.0 to 1.8 s on AUTO. The speed still jumps between turns.
- STRUCK DOWN, LINE 156: SEEN. 'STRUCK DOWN. ONE HITPOINT, STILL IN THE CREW: BRAIN DAMAGE' on the end screen (q10, k07);
  DESI on the next board (healed on the march to 32 of 63), HECTOR fought at 24 of 64, SERGIO at 26 of 57; nobody held out
  for injury days; the crew card says 'He can fight. A clinic halves the days and the wound for 78 batteries.' (k04). The
  thumbs wear the wounds (band-aids, stitches, a head bandage, NENO's eye patch; k20, PORTRAIT c552e2a9). THE DEAD STAY
  DEAD: MARCOS (computer, day 1), GRIZ (day 2), DESI (phone) never on a board again. The crew card's HP row reads her
  maximum (63); her one hitpoint is only in the words.
- THE BARS OVER THEIR HEADS, LINE 189: NOT BUILT (CAMP's row open): no bar over any man on the map, at camp or in a town.
- CAMP HOLDS, LINE 198: NOT BUILT (CAMP's row open): on the phone the HEAL tap made camp and it broke itself after one hour
  ('contact', q12), as in round four. On the computer two camps with nobody near held 49 and 17 hours, and the 49-hour one ran
  two days past a whole company (line 218, open).
- TAPE AT EVERY STALL, LINE 195: SEEN, AND A HOLE: Blues 40 rolls, Colorful 25, a roll for 1 battery and a stack of 20 for
  20; a stack took the tape 40 to 60 (q04, k02). On the phone the stall's price column sits under the phone (q03).
- TAPE IN THE LOOT, LINES 207, 216, 224: SEEN. Before 33b06264 a won fight gave +31, +7, +16, +18, +4, +18 tape; after it
  '+1 TAPE, MENDS ARMOUR' (computer fight 11, tape 10 to 11; k07). 'Scrap' on no screen. A wipe still takes tape
  (75 to 40, 55 to 16, 43 to 33).
- HEALING x5, LINES 193, 194: SEEN BY MEASURE. Marching: 2.06 map hours, every hurt man +10.3 hitpoints (5.0 an hour),
  armour +30 to full (at least 14.6 an hour). Camped (phone): one hour, +10 hitpoints and +30 armour each, 4 tape spent.

## (2) LINES 149 TO 231, WHAT EACH ONE DOES ON THE LIVE GAME
SEEN: 149 PLAY walks to the job (both, q15); 150 leaving a town the map fits every job (both, k06, q14); 156; 158 the squad
up close then a town (q01, q02, k01); 162 the crew screen's back is their camp (k19); 163 a can and a bottle; 169 the end
screen's back is the fight's board with his men moving (k16); 170 the portraits change frame to frame (by picture); 180 the
lineup's RETREAT before anyone moves (k14); 183 a first-turn retreat gets a lone man out (q16, q17); 191 YOU leads the walk
(k18); 193, 194; 201; 203 MAKE CAMP NEARBY before a still enemy, FALL BACK and ENGAGE only before a roaming one (k13); 207;
215 two blocks off (k15); 216; 217 the smith's MEND YOUR GEAR, one man's mend 3 batteries and an hour (k11); 224; 229;
231 one woman among 22 hires. WITH A HOLE: 154 (three jobs, two cards), 164 (the clinic offers to halve again), 195.
HALF: 161 (presses off the phone), 167 (static over the unseen; pins, signs, bosses not met), 172 (the fight's card owed),
174 (the shop's half not built), 190 (the phone's status line names the ground), 199 (no pile of the slain, nobody loots),
228 (off-centre on the map; the fight's camera not walked).
NOT SEEN: 202 (wounds run 25 to 39 days, not 6 to 8 of ours), 219 and 226 (on the phone, upright: Railroad Pass's board under
the phone, its tap lands on the phone; Blues' stall prices and board lines under it; q07, q03, q05).
NOT BUILT: 189, 198, 212, 218, 220 (the top bar over every fight, q08), 223 (fatigue fell 10 to 15 on rested turns in 23
fights; TRAVIS HATCHER walked in with a fatigue ceiling of 28 after a partly collapsed lung, nothing said).
NOT MET: 168 (the stash never filled). 213 SEEN after the round's push, on a fresh phone game, BUILD 10/26zs: the cold box won,
then a walk PAST Blues: at 72,46, its edge, the bar counted 291 to 336 (+45), no town screen, the party walked on (q18).

## (3) TEN FIGHTS IN A ROW, EACH PROFILE (rule 173(e)), FROM THE SAVED GAME, THROUGH THE MAP
No crash, no page error, no tab lost; the heap after each fight 87 to 106 MB on the phone and 83 to 107 MB on the computer,
not climbing (92 and 88 MB at the end).
| Profile | # | How | Result | Rounds | Foes | His men | Still (ms) | Heap |
|---|---|---|---|---|---|---|---|---|
| phone | 1 | AUTO | won | 3 | 3 thugs | 3 | 516 | 106 |
| phone | 2 | AUTO | wiped | 11 | 4 thugs | 3 | 863 | 101 |
| phone | 3 | hand | won | 16 | 2 thugs | 1 | 523 | 91 |
| phone | 4 | hand | wiped | 3 | 3 thugs | 1 | 510 | 87 |
| phone | 5 | AUTO | won | 6 | 3 thugs | 4 | 893 | 93 |
| phone | 6 | AUTO | won | 6 | a Kid, a Runner | 6 | 930 | 93 |
| phone | 7 | hand | wiped | 7 | 4 thugs | 5 | 661 | 94 |
| phone | 8 | hand | wiped | 2 | 4 thugs | 1 | 568 | 96 |
| phone | 9 | AUTO | wiped | 13 | 4 thugs | 4 | 1,010 | 98 |
| phone | 10 | hand | wiped | 5 | one Kid | 1 | 190 | 92 |
| phone | 11 | AUTO | wiped | 6 | 3 thugs | 2 | 879 | 92 |
| computer | 1 | hand | won | 9 | 5 thugs | 12 | 402 | 83 |
| computer | 2 | AUTO | won | 2 | a Kid, a Runner | 11 | 1,160 | 95 |
| computer | 3 | AUTO | won | 3 | 5 thugs | 11 | 994 | 89 |
| computer | 4 | hand | wiped | 16 | a Kid, a Runner | 11 | 1,162 | 106 |
| computer | 5 | hand | wiped | 4 | 3 thugs | 1 | 465 | 88 |
| computer | 6 | AUTO | won | 5 | 3 thugs | 4 | 848 | 94 |
| computer | 7 | hand | wiped | 19 | 6 thugs | 13 | 1,146 | 93 |
| computer | 8 | hand | wiped | 2 | 5 thugs | 1 | 494 | 97 |
| computer | 9 | AUTO | won (they ran) | 10 | 5 thugs | 1 | 184 | 98 |
| computer | 10 | hand | wiped | 4 | 3 thugs | 1 | 314 | 107 |
| computer | 11 | AUTO | won | 9 | 2 raiders, a thug | 5 | 843 | 94 |
| computer | 12 | AUTO | won | 3 | 2 dire wolves, a hyena | 16 | 1,144 | 104 |
On AUTO the computer won 6 of 6 and the phone 3 of 6. Every wipe left the company held by the winners, a rescue job on the
phone, and YOU alone at about 25 hitpoints; the rescue sends him alone at three or four, so the wipes came in runs (phone
7 to 11, computer 7 to 10). That is round four's F33, still there.

## FOUND THIS ROUND (each a row or a note on its owner's board)
1. HIRED TWICE (RUN THREE, the hall): Blues' hall offered HECTOR MAYFIELD, RAUL IBARRA and TRAVIS HATCHER again on day 3 after
   they were hired on day 2 and taken by the road crew in a wipe; hiring them again took 111 batteries and gave no man
   (bohemia.hired.v1 lists each twice, the company once; the next fight fielded YOU alone, computer fight 9). Network did the
   same on the phone (FERN FERRIS and TERRENCE VANCE again, 83 batteries, neither fought, phone fight 11). Picture k10.
2. THREE JOBS HELD (RUN, the wipe's rescue): after a second wipe the phone held two 'Get your men back' jobs and a find, and
   after a third, three rescues; the phone shows two cards (q11). Rule 228(b): two at most.
3. UNDER THE PHONE, UPRIGHT (COOK, RUN TWO, UI): Railroad Pass's board (the tap lands on the phone, q07); Blues' stall prices
   (q03) and board lines (q05); the crew screen's struck-down line and the level-up box (q13). COOK's 86174fc9 (all fourteen
   upright towns clear of the phone) landed after the walk: round six re-walks it.
4. THE GROUND ON THE PHONE (UI TWO): the phone's status line writes 'ARTERIAL', 'SUBURB', 'PARK' on every map screen.
5. PRESSES OFF THE PHONE (UI TWO): the town's LEAVE and x, the fight's bar, the end screen's three buttons, BREAK CAMP.
6. THE WOUND'S DAYS (CAMP): 25 to 39 days on every struck man; TUNING's table holds 6 to 8.
7. THE CLINIC TWICE (CAMP): after Treat DESI (26 to 13 days, 52 batteries) the card offers 'Treat DESI: 13 days to 7' for 26
   more and the doc says 'DESI stays with me'.
8. 'THE ROAD CREW RAN' (RUN FOUR, the end screen): after two dire wolves and a hyena, and over '3 OF 3 OF THEIRS DOWN'.
9. A CEILING OF 28 (COMBAT, TUNING): TRAVIS HATCHER's partly collapsed lung left him a fatigue ceiling of 28 and he was fielded
   with nothing said (rule 283(c)).
10. Two men both shown as 'RAUL' on the phone's crew screen (RAUL and RAUL IBARRA), NOTE to RUN [eyes: names on names].
11. The phone asked the server for records/target/portrait/wounds/person_woman_0.json twice and got 404 (NOTE to PORTRAIT).

## ROWS FILED (each at the top of its owner's board)
RUN [eyes: three jobs held]; RUN TWO (for RUN THREE) [eyes: hired twice], [eyes: prices under the phone]; RUN TWO (for RUN FOUR)
[eyes: the road crew ran]; UI (for UI TWO) [eyes: the ground on the phone], [eyes: presses off the phone]; UI [eyes: words under
the phone]; CAMP [eyes: the wound's days], [eyes: the clinic twice] and a NOTE (the camp still breaks, 49 hours past full, no
bars); COOK [eyes: under the phone, upright]; COMBAT a NOTE (the pace measured, the ceiling of 28); PORTRAIT a NOTE (the 404).

## WHAT EYES COULD NOT DO THIS ROUND, SAID PLAINLY
- The live site itself: refused by the proxy; the replay is the deployed tree, not his phone's cache, GPU or Bluetooth; the
  service worker (the emergency's second half) was blocked, so the fix tested is the fight's own fresh loads and its floor.
- No ear: death sounds (157), the songs (159), the VOTE tab's music (230) not heard.
- Not walked: a full stash (168), the shop's taps (RUN TWO's half of 174), the
  Lone Wolf, the computer at 4x; the 1,000-fight retreat rate is COMBAT's gate, EYES saw one.
- The by-hand finger is simple (strike in reach, else walk toward the nearest, END); it tests that his taps answer and that
  nothing freezes, not how well a person plays.
