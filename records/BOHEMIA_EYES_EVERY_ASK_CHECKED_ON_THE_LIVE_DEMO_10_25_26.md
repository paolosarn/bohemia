# EYES AND EARS: EVERY ASK ON HIS LIST, CHECKED ON THE LIVE DEMO (10/25, eyes-every-ask-10-25, rule 179)

His words (records/BOHEMIA_PAOLO_ARE_YOU_SURE_EVERY_JOB_IS_GETTING_DONE_10_25_26.md): 'I told you about the car door shield
yesterday... are you sure every job that I requested is getting done.' The list (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md,
98 lines) had marked lines SHIPPED on a lane's commit. This round walked every line in the game against HIS words, and the
list's status column now leads with EYES' mark on every one of the 98; the lane's old word is kept after it as [lane said: ...].

## THE BUILD AND HOW IT WAS PLAYED
- The live demo, BUILD 10/25o (THE PC KEYS, THE SIX, THE ICONS): the last `pages` run that succeeded was for ec9e2c10
  (run 3816, 17:44 UTC); main's slices/, engine/ and records/target/ were byte-identical to it when the audit started
  (git diff empty), and `node tools/bohemia_cut_the_demo.js --check` said the committed demo is exactly the cut. github.io
  is refused by this box's proxy (403), so the deployed tree was replayed from disk at the real address
  (https://paolosarn.github.io/bohemia/slices/BOHEMIA_DEMO.html), every request answered from those three folders, no other
  file, the service worker blocked. No server: one browser held open by a script that read its steps from files and stopped
  itself.
- THE PHONE: 390 x 844, touch, 3x pixels, full CPU. Two games (the first ended when EYES' own script broke, not the game),
  about two and a half hours: the title, the door, the map at every zoom, five towns, two hires, a car door and a pipe
  bought and equipped, a tab killed and reopened, a sale, five fights (two by AUTO to a win, one with a bag swap by hand, a
  wipe by ending every turn, a retreat), level-ups and perks, the wake after the wipe.
- THE COMPUTER: 1440 x 900, mouse and keys. One game with SHOW THE TOWNS: the keys, the wheel, the camera on trips, Church
  and Remnants, two fights, a whole night on the road, the closest zoom.
- Steps were real taps, drags, pinches, keys and the wheel, found on the game's own hit lists (the map's town and party
  lists, the settlement's where() and personAt(), the fight's own buttons). Two kinds of trip were started from the game's
  own travel calls (townTap, travelTo) where the line under test was not the travel itself; nothing was set by hand.
- Sound was checked by the log, not by ear: every line any voice engine spoke (the arm script of SOUNDS' tools/bohemia_sounds_pc_playtest_measure.js), the
  song transport's own state every 200 ms, and the fight's own record of when each sound was asked (UI.sent).
- Pictures: records/eyes_every_ask_10_25/ (q = phone, k = computer), the game's own camera.

## THE COUNT (98 lines)
- SEEN in the game, 56 (some on one route or one man, said so on the line).
- SEEN AS A PAGE OR A PROCESS, 8 (research and coordinator lines with nothing in the game by ruling: the page is there).
- HALF, 11: Kids met, the Mechanic and the Heavy not (2); Remnants busy, Blues not (4); sight hides what is off the street,
  showing down a street not met (39); the hits land on quarter beats inside 75 ms, about 100 ms late (47); DROP is there,
  not used (61); the freeway yes, the Strip not looked at (64); the day boards organic, a static column once (66); the day
  boards in colour, the night ones near black and white (86); music all through every fight, the pulse not judged by ear
  (88); melee 8 of 8 from the next tile, open-street cover not measured (90); the held gun and the kneel, the shield arm
  still running (84).
- NOT SEEN, 13. Seven are in flight on a running lane (36 the camp, 48 and 85 the new songs, 87 the three levels, 91 dismiss,
  92 the company screen, 97 the car door). Six are not: 17 THE DOWN TALK, 30 and 31 THE CAR DOOR (its rows are rule 177's,
  claimed), 55 ONE CURRENCY ON THE BAR, 56 THE JOB'S PLACE IN THE DARK, 67 HEIGHTS NOBODY CAN READ.
- NOT MET OR NOT TESTED, 10: ghosts (5), a superior enemy (16), the Kid's look in light (3), a full roster (79), Bluetooth
  (95), AUTO's wasted turns by numbers (96), the squiggle's creepiness by ear (1), no crash in seven fights (11 and 93: seen
  as no crash, the ten-in-a-row is [the long play]), this audit itself (98).

## THE NOT SEEN, WITH THE STEP AND THE ROW (worst first)
1. LINES 30, 31, 97, THE CAR DOOR. YOU starts with a pistol and 'a car door' in the off hand on the crew screen; Travis Hatcher
   was hired at Blues and given a car door bought from the armourer. In the next fight neither door is drawn: both hold a gun
   (q19, a 3x crop). The fight's own list arms YOU with Battle Brothers' 'Dagger' and a 'Wooden Shield', Travis with 'Knife'
   and 'Ancient Coffin Shield', Desi (a rifle on the crew screen) with a 'Light Crossbow'; the weapon card says 'Battle
   Brothers: Dagger; it shoots as Bundle of Javelins' (q21). Rows: rule 177's COOK [a model for every item] (CLAIMED),
   ANIMATION [gear as layers on the rig], COMBAT [the fight draws what he wears]. IN FLIGHT, not filed again.
2. LINE 17, THE DOWN TALK. After a wipe (END TURN every turn on the freeway at night), LEAVE: DESI, down in the fight, laid
   up 40 days and held by the road crew, speaks on the map with her face: 'They got me. 40 days, then I'm back.' and 'RAUL
   didn't get up, carnal. He's gone.' (q41). ROW: RUN [eyes: the held talk].
3. LINE 56, THE JOB'S PLACE IN THE DARK. A new game (THE DARK): the phone's card says 'TOUCH REMNANTS ON THE MAP' while
   Remnants is under the fog with no name and no mark at any zoom; Primm, where the carts go, is named nowhere (q05, q06).
   ROW: WORLD [eyes: the place in the dark].
4. LINE 55, ONE CURRENCY. Only the batteries on the bar for two hours on both profiles (q02, k02); UI's own commit says the
   other five wait on the game's counts. ROW: RUN TWO [eyes: four currencies] (UI's NOTE gave RUN TWO the counts).
5. LINE 67, HEIGHTS. Every house on seven boards was one storey; a pointer resting on a house before the fight said nothing
   (k06, k07). ROW: COMBAT [eyes: heights you can read], with three NOTES in it (the quarter beats, the static column, the
   weapon card's Battle Brothers line).
6. LINE 86 (HALF), THE NIGHT BOARD. By day the boards are back in colour; both night fights read almost black and white,
   grey-blue with pools blown out to white (q39, q43). ROW: COOK [eyes: the night board].
7. LINE 4 (HALF), THE QUIET TOWN. Blues: one person nobody taps, standing still through three pictures, and an empty dark
   band under its picture; Remnants busy with five walking (q32, q33). ROW: RUN TWO [eyes: the quiet town].

## SMALL THINGS SEEN ON THE WAY (no rows; on the lines as NOTES)
- 'Carry a letter' 90 showed two stars on the phone at 06:00 and one at 10:23, two on the board (line 24).
- TUNING's page set four picks a level; the game raises three of eight (line 50).
- Raul Zamora's face on the end screen is an empty black square (q36); PORTRAIT is paused.
- On the map after the wipe 'YOUR MEN' sits over 'THE CREW' over 'REMNANTS' (q41): RUN's [names on names] from round 2.
- The level-up: 'LEVEL 2: RAISE 3 OF 8' and 'PICK A PERK' from eight (q37, q38).

## MEASURES WORTH KEEPING
- The music in the fight (phone, 20 samples): their turn plays INTENSITY level 1, his turn level 2 and sometimes 3. His
  order (rule 167(c)) is map 1, their turn 2, his turn 3. SOUNDS is on it (line 87, in flight).
- The beat (computer, the fight's own sound clock, 65 sounds on AUTO, beat 500 ms): R 0.08 on the beat, 0.03 on the half,
  0.59 on the quarter; the sounds sit 70 to 145 ms past each quarter. The same figures against the shell's own transport
  (offset 35 ms). The fight's log, read with EYES' 50 ms clock, gave R 0.14 earlier: the log is written before the act plays,
  so only the sound clock counts.
- The night (computer): dark from 18:00, the clock ran on through 22:00, 01:00 and 05:20 to 06:41 in about 90 s of travel;
  the cleared ground averaged 69.5 at night against 79 by day (12 percent darker); no recap at any turn.
- Money: three men and 290 is 48 nights; four men and 218 is 27 nights.
- Memory after the fights: the page's heap 107 MB (phone), 93 MB (computer). No crash in about three hours.
- The voices: 24 lines, nine voices, one at a time, 0.3 to 1.9 s, cut 134 ms after LEAVE; 3 of 20 different lines carried
  Spanish (15 percent), YOU never.

## WHAT EYES COULD NOT DO THIS ROUND, SAID PLAINLY
- The live site itself: refused by this box's proxy; the replay is byte-identical to what deployed, but a phone's cache, a
  real GPU and Bluetooth were not in it.
- No ear: the squiggle's creepiness, the clicks, the pulse over the effects and the Bluetooth chop are ear tests.
- Not met in seven fights: ghosts, the Mechanic, the Heavy, a superior enemy, a full roster, a two-storey board, the Strip.
