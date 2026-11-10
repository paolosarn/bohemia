# PLUMBER 8 -- THE FULL SUITE ON MAIN (11/10/26)

VAMILY rule 13 (THE SUITE LINE, the QUARANTINE), rule 441(c) (Paolo 11/10: a full suite, more bug fixes, nothing half baked), ask line 543.
The other half of PLUMBER 8 (SMOOTH) is records/BOHEMIA_PLUMBER_EIGHT_NO_FREEZE_OVER_HALF_A_SECOND_11_10_26.md.

## THE SUITE LINE

main d97cecd3 (the tree when the run began), 1,203 gates, an 8-hour clock (BOHEMIA_SUITE_BUDGET=30000) on a 4-core box: RAN 1,079, GREEN 588, RED 491 (in the pack, four at a time), NEVER RAN 124 (the clock ran out on the late table), FLAKED 2 (of the reds re-run alone before that pass was stopped: STREET CONTRACT, COLD BOOT). The alone pass would have taken about three hours on a tree already behind main, so it was stopped and the reds were re-checked on main itself (below).
Since, on main: the 124 that never ran and the 9 added since run three at a time on main 55e3ad43: 37 of 133 so far, 16 green, 21 red (the table below); gates/BOHEMIA_QUARANTINE.txt names 343 old reds with their owners; 10 reds were pipes and are green; 23 were the same stale road-fight step and are patched (3 re-run so far).

## WHAT THE 491 REDS ARE

- 348 are gates written before 10/1 (dated by the first date in their own description): checks of a game that has since changed, most by a later ruling, red on main for weeks. 343 are on the QUARANTINE with their owners (they run and print, they never decide a ship); BUNDLE is fixed; STREET CONTRACT and COLD BOOT were green alone; two are gone from the table (THE CAMP AFTER A FIGHT, TAKE THE NEXT PART). By kind: failed-legs 282, crash 29, stale-daycard 24, stale-city-alone 7, timeout 5, pipe-missing-module 1.
- 143 are gates from 10/1 on. Each is below: fixed, better, confirmed red on main alone, patched and being re-run, or red in the pack only (not yet re-run alone: named as that).

## FIXED (pipes, stale checks, a broken tool): now green on main

- SCRAP IS TAPE: 7/2 -> 11/0 (a road fight off the town, 55e3ad43)
- OPTIMIZE LOOT: 21/1 -> 22/0 (a road fight off the town, 55e3ad43)
- ONE FIGHT: 3/1 -> 4/0 (a road fight off the town, 55e3ad43)
- THE BULLET LANDS: 'the road fight never came up' -> 14/0 (d461b393)
- THE FALL READS: 11/1 -> 12/0 (each route read on its own, d461b393)
- BUNDLE: 14/2 -> 16/0 (two stale md5 lines, d461b393)
- ONE ROOM TABLE: 14/1 -> 15/0 (the table re-written by its own tool, d461b393)
- LAW INDEX: red -> 4/0 (reads 'gate OWED' as owed, 26ddd7a9)
- DERIVED FRESH: red -> green (one scratch tree per checkout, 26ddd7a9)
- CASING FACE: could not run (no fontTools) -> runs; it then found ask row 559 (e35e7edb)
- the road fight off the town (55e3ad43, tools/bohemia_drive_the_demo.js __A_ROAD_FIGHT_OFF_THE_TOWN__): since A TOWN IS ALWAYS A DOOR (11/6) no road fight starts on a town's ground, and the demo starts him in a town; checks that stepped once and called roadContactFight met the crew on the town's ground on some seeds. offTheTown puts the party on the nearest walkable cell that is no town's ground; the game decides.

## BETTER, THE REST NAMED

- THE ONE SONG (SOUNDS): 4/4 -> 7/1: S6 after a fight the street plays REPO MAN, which the check does not count as a map song (REPO MAN has a fight version at three levels now): the check or the song list
- THE HEAL BUTTON (CAMP, FIXES): 2/2 -> 11/3: H4, H4b, H5 on one of the two profiles per run: the LEAVE tap on the end screen did not leave, so 'fight two' re-read fight one's page (its own 70% blows, RAUL at 0); the end screen re-fitting under the finger is the suspect (11/10k): ask row 565
- THE AFTERMATH (RUN FOUR): 6/6 -> 16/4: D2 the window over the crew reads dark on the board (mean luminance 0.14 to 0.16, the computer 0.008), D5 its frame line 5.45 ms a frame

## CONFIRMED RED ON MAIN, RUN ALONE (each its owner; none of these is a pipe)

- PAGES PUBLISH (RUN, PLUMBER): the published surface 901 MB against its 900 MB cap: ask row 563
- REPO BUDGET (PLUMBER): 33 days from GitHub's ceiling at 66 MB a day: ask row 562
- GROK FILTER (EYES): L1 a Grok page cited outside its folder is not stamped PASSED FILTER
- ART PIPE (DIRECTION): A2 62 drawing tools outside the baseline write literal pixels
- SPEAK ALONG (PORTRAIT): 2 portrait comments with no ledger row (portrait-every-face-from-the-same-model-10-18, portrait-the-face-is-the-bodys-face-10-19)
- LONG INJURY (PEOPLE): the penalties list both parts (the mark for life and the wound today), each the wiki's key
- THE PLAGUE (PEOPLE, PORTRAIT): an engine file writes injury id 'sick' on a person: engine/bohemia_wound_faces.js
- WHO THE FACE IS (PEOPLE, BOSSES): 21 faces; nobody behind boss_pot_0, boss_tap_0, boss_filter_0, boss_burn_0, boss_surveyor_0, boss_climb_0 (the bank is draft; nothing live reads it)
- ASK THE CROWD (PEOPLE): a crowd person does not carry their spot in the crowd
- SHAPE FROZEN (CHARACTER): 2 garments on the rail unfrozen: SPIKED PAULDRON, STEEL SPIKED PAULDRON
- MARKET PACK ART (RUN TWO): 30 market icons: w_pistol is neither his pack tile nor a render of it
- HEIRS (DYNASTY): the phone does not show the heirs when he stands in act 2 (5 legs)
- THE ONE RULER (COMBAT TWO): slices/bohemia_street_board.js TILE_M = 12, an unlisted carrier of a block's metres
- THREE BLOCKS (WORLD): the never-at-all list does not match (basin, blvd, desert, dump, fremont, lakebed, rail, stripe, stripw, yards); cornerw missing from the library
- SEE EVERY HIT (COMBAT TWO): S1 the audit: every skill in the fight's data sorted (rule 312): new skills unsorted
- SETTLEMENT HEARD (PORTRAIT): the town asks for wound-face sheets that do not exist (records/target/portrait/wounds/person_woman_2.json, 404): ask row 564
- THE MACHINE PARTY (SOUNDS): drumV and MUS.playStep are his again after the machine detaches (playStep is not the same function: later code wraps it, so the check may be stale); and the card waits on EYES

## THE SAME STALE ROAD-FIGHT STEP, PATCHED, RE-RUN ONE AT A TIME FROM THE PATCHED TREE

- A FEW, NOT TWELVE: RED: FAIL *** P3 DAY ONE AND DAY ONE HUNDRED DIFFER *** (day 1: 3 A FEW -> brigand_thug brigand_thug brigand_thug; day 100: 13 LOTS -> coyote)
- DEATH SOUNDS THAT TERRIFY: RED: FAIL phone_portrait: *** ON THE BEAT *** every death starts on the song's sixteenth (within 20 ms), the tail rings past [7 deaths booked: at 2.9, at 33.9, at -46.9, at 14
- EVERY FIGHT HANDS HIM BACK: RED: FAIL F5 a fight he LOSES hands him back to the map too, in under 3 s OF A TAP ON LEAVE (end screen up, back in 3423 ms, loss)
- EVERY LEVEL WAITS: not yet re-run
- GEAR THROUGH THE SAVE: not yet re-run
- MAKE CAMP FROM THE FIGHT: not yet re-run
- NOTHING POPS, VOICES CLEAR, TOOLTIPS: not yet re-run
- ONE BEAT FOR EVERYTHING: not yet re-run
- RETREAT FROM THE LINEUP: not yet re-run
- STRUCK DOWN, HE STILL FIGHTS: not yet re-run
- THE DAYS ONCE: not yet re-run
- THE FIGHT ON THE LIVE PATH: not yet re-run
- THE FIGHTS MUSIC YOU CAN HEAR: not yet re-run
- THE ORIGIN SETS THE COMPANY: not yet re-run
- THE ORIGINS ARE DATA: not yet re-run
- THE SONGS GO IN: not yet re-run

## THE NEVER-RAN 124 AND THE 9 ADDED SINCE, ON MAIN (three at a time)

- THE MACHINE PARTY: RED (in the pack): FAIL drumV and MUS.playStep are his again after the machine detaches [{"dv":true,"ps":false,"on":false}]
- THREE LEVELS IN THE VOTE TAB FIRST: GREEN
- THE BULLET LANDS: RED (in the pack): FAIL the demo's fight ran [the road fight never came up]
- THE VOTE CARDS PLAY: GREEN
- THE SQUIGGLE, CREEPIER: RED (in the pack): FAIL his six AS HE HEARD THEM: every family's syllables at his own pitch (Praat, within 3%) []
- THE PC PLAYTEST, THE SOUND: RED (in the pack): FAIL IN THE DEMO, SHORT: no line in the town runs past 3.6 s with its breath [longest 5.39 s; every line [5.39,2.11,5.25,3.58,0.5,2.12,2.06,1.7,1.99,1.2]]
- SETTLEMENT HEARD: RED (in the pack): FAIL every file the page asked for was there [http://127.0.0.1:8879/records/target/portrait/wounds/person_woman_2.json http://127.0.0.1:8879/records/target/port
- THE LOADING MENU IS FROZEN: GREEN
- THE SCREENS PAST THE PHONE: GREEN
- THE DAYS ONCE: RED (in the pack): FAIL at 320 wide every fact stays, it fits, nothing overlaps, every press 44
- THE MAP'S KEYS: GREEN
- THE SIX ON THE BAR: GREEN
- THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE: GREEN
- THE STAT ICONS: GREEN
- THE FIGHT'S BARS AND THE END SCREEN: GREEN
- A PLAIN WAY TO DROP A JOB: GREEN
- THE MODE BUTTON IS 44: GREEN
- THE TEN CHANGES, THE UIS PART: RED (in the pack): FAIL *** T1 THE BAR CARRIES TWO NUMBERS *** (6 figures: batteries, nights, food, tape, meds, rounds; days 55 / bill 55; crew 3 / bill 3)
- THE UI BELONGS TO THE WORLD: RED (in the pack): FAIL the front screen he loved is left alone: the start screen is the same with the kit on and off [differs]
- THE FACE IS THE BODYS FACE: RED (in the pack): FAIL STARRED boss_pot_0 has a person in CHARACTER's file
- WHAT A MAN HOLDS: RED (in the pack): FAIL W3 IN THE DEMO (a road fight from the map, the fight inside the shell): his pistol men are drawn in held clips, and his man stood on cover kneels, no page 
- THE THING IN HIS HAND: RED (in the pack): FAIL W3 IN THE DEMO (a road fight from the map, the fight inside the shell): the men with melee rows are drawn in their idle (one hand, the shield arm or two ha
- EVERY WEAPON SHOWS: RED (in the pack): FAIL the demo drove (the fight) [Error: page.waitForTimeout: Target page, context or browser has been closed]
- THE TOWNS ACTIVITIES: GREEN
- EVERY TOWN LOOKS ITS OWN: RED (in the pack): FAIL *** THE HEART LOOKS LIKE THE CITY ***: the towns deep in it stand twice as tall as the edge's, mostly concrete boxes; the edge's not [heart Church/Mob/Reds
- THE NIGHT KEEPS ITS COLOUR: RED (in the pack): FAIL and it is still night: the suburb's dark ground darker than by day, a lit tile three to one over the dark on the strip [suburb 0.1771 -> 0.1448, strip lit 
- EVERY ITEM HAS A MODEL: RED (in the pack): FAIL M1 the manifest lists each row under the object the market names it <- ['rebuild_black_band_vest', 'newcrew_surplus_vest', 'south_road_dust_vest', 'truck_h
- EVERY ORIGIN STARTS LIKE ITSELF: RED (in the pack): FAIL *** W4 THE CREW SCREEN READS AS A GOD *** (a real tap on the chip: YOU at LEVEL 4, his rolled numbers, ★★★ drawn on the three stats, his kit, the pistol in
- EACH ORIGIN ITS OWN: GREEN
- THE RARE MAN AT THE POST: GREEN
- MORE RARE HIRES: GREEN
- THE WAGON AND THE SIX: RED (in the pack): FAIL C4 the stall, real taps: a dose of meds +1, six rounds +6, a night of food and water +1, and the bar says so in the town and on the map [{"added":{"meds":0
- A TWO-HANDER WEARS ITS OWN NAME: RED (in the pack): FAIL *** T3 THE SPEAR AND THE CAR DOOR ON ONE MAN *** (real taps on the crew screen: YOU holds the beat-up rebar spear and the car door; in the fight: null)
- DROP A JOB RIGHT IN THE TOWN: RED (in the pack): FAIL *** D6 PHONE_PORTRAIT: TWO JOBS AT ONCE *** right after the second Take it, both on the board, each with its cost () [[]]
- ONE HUD EVERYWHERE: RED (in the pack): FAIL nothing covers a press in the town with its board open (the bar's, LEAVE, the sheet's X, every job, the phone's) [3 presses]
- THE STAT ICONS READ AT A GLANCE: GREEN
- THE SHOP SAYS WHAT IT DOES TO YOUR MAN: RED (in the pack): FAIL C4 an armour card (ARMOUR 110 / FATIGUE -11 / INITIATIVE -11) and a weapon card, the fight's own damage (DAMAGE 30-45 / VS ARMOUR 75% / THROUGH ARMOUR 45% 
- NOT YET RUN (96): THE TOWN FITS THE SCREEN, NOTHING TAPPABLE UNDER THE PHONE, PINCH OUT TO THE MAP, THE FLIP GLIDES, THE COMPANY TAKES HIS NAME, THE STALL BUYS AND SELLS, THE SHOP TAPS, THE SMITH MENDS, TAPE AT EVERY STALL, WHAT YOU BUY GOES ON THE MAN, HER BODY, A FEW WOMEN AT THE POST, THE STRIP READS AS THE STRIP, THE GAME STARTS IN A TOWN, MAKE YOUR MAIN GUY, YOUR CREW LIVES IN THE TOWN, THE BEST RECRUIT AT THE TOP, EVERY ENEMY READS AT NIGHT, EVERY TOWN SCREEN ITS OWN, EVERY TOWN TALL AND WIDE, THE CAMP THROUGH THE RIG, EVERY PERK A PICTURE, THE ARMOUR THROUGH THE RIG, THE MENU HEARS ONLY ITS FEED, THE SHOP KEEPS ITS ARMOUR, AUTO NEVER LEAVES A MAN, RETREAT IS A RUN FOR THE EDGE, YOU SEE THEM RUN, AUTO AT 4X NEVER CRASHES, THE ENEMY WANTS TO LIVE, THE KILL CAMS, THE DECOY, NO CAP ON HOW MANY FIGHT, AUTO KNOWS ITS MAN, HEAVY ARMOUR COSTS A TILE, NO TWO MEN SHARE A NAME, THE FEED HAS A MAX LENGTH, THE FEED'S WORDS, THE BOARDS ALWAYS HAVE WORK, EVERY TOWN IS BUSY, THE BLOOD IS CRASHBOX, THE DANGER RAMPS TO DAY FIFTY, THE FEED IS ALIVE, THE CREW FIGURE HOLDS HIS GUN, THE CREW SCREEN SHOWS THEIR CAMP, BUY VERSUS SELL, THE UI MORPHS, STATS ARE BARS IN HIS ORDER, THE PHONE, NO RUN ENDS FOR TAPE, THE FACE SHOWS THE WOUND, EVERY FACE BREATHES, THE ARMOUR HE WEARS SHOWS, THE FIGHT AS CLOSE AS IT CAN BE, NO TOP BAR IN THE FIGHT, YOU FEEL IT, THE TOWN YOU DID NOT DEFEND, IT IS CALLED BOHEMIA, THE DEAD ARE MADE, EVERY BEAST ITS OWN OUTLINE, THE RADIO LIVES IN THE FEED, A TWEET SOUNDS LIKE A HUMAN, THE ARENA, THE WHOLE LOOP PLAYS, FIRST PLAY IS LIGHT, THE MAP'S LIGHTS READ AS LIGHTS, EVERY CHANGE AT SIXTY, THE HEAP STAYS FLAT, THE SAVE COMES BACK THE SAME, A RETREAT GETS HIM AWAY, A PACK HE RAN FROM LETS HIM GO, THE BESTIARY FLOOR, THE TERATORN IS ONE MORE BEAST, WHAT LIVES ON THE MAP HAS A CAP, THE KILL GOES IN THE STASH, THE PAD IS TRAVEL SPEED, THE PLACES GET THEIR USE, EVERY MAN ACTS ON AUTO, EVERY BUILDING ON THE ROAD, THE CASINO FLOOR, THE OLD LAYOUT, THE NEW HOUSES, THE BOARD IS THE CITY AT THAT SPOT, SCAVENGE ON THE DIAL, SEARCH THE LOT ANSWERS, THE FREEWAY FIGHT, YOUR PLACE, PLANTED, THE FOURTEEN EYES FOUND, JOBS THAT FIT THE COMPANY, THE MAP KINDS HAVE FIGHT ANSWERS, A STREET IN FRONT OF EVERY HOUSE, THE VALLEY HAS ITS ZONES, THE CORNERS JOIN, THE PACKERS MERGE, THE CAMP IS THE FIGHT'S BOARD, THE STREETS JOIN, NO FREEZE OVER HALF A SECOND

## RED IN THE PACK ON d97cecd3, NOT YET RE-RUN ALONE (107; the owner from the gate's history, its board row, or "(by its words)")

### PLUMBER (14)
- A MERGE DID NOT DELETE A SYSTEM: FAIL [control] the real incident can be replayed one of the two commits is not in this
- EVERY RUNNING LANE HAS A JOB: FAIL O1 every running lane has at least one OPEN row
- FIRST LOAD: FAIL T1 the title is on screen within 2.0 s of the tap (2.4 s)
- HAIR MATCH REGRESSION: FAIL all six shipped enemy tiers resolve a real worn cut from ours.json + FACTION_LOOKS
- NOT VIBE CODED: FAIL N3 the cull: 86 new art items with a picture, every one names its sprites and look
- ONE COMPANY, A MAN LET GO IS GONE: FAIL *** O3 LET GO AT CAMP *** (TITO VEGA, from the camp's CREW): on none of the lists,
- SMOOTH IS A BUDGET: FAIL F1 THE PINCH: worst frame and frames over 33 ms under the ratchet (320 ms, 18%) [i
- THE ART FENCE: FAIL A2 no art-lane commit put a file in the game without his FINAL
- THE CARD I NAME IS ON HIS SCREEN: FAIL R3 every id the coordinator names is on his first screen (0 of 12)
- THE COMPANY IS A CAST: FAIL a press is bigger than the old reach, which is the whole defe
- THE EIGHT FACINGS: FAIL R1 every rig render folder (708) carries eight facings in every still and clip, non
- THE ONE STOPWATCH: FAIL W2 THE NUMBER IS OF THIS DEMO: the stopwatch hash (e5d31a90) is the committed demo'
- THE PACKS ARE THE BAR: FAIL K1 no NEW ground cook tool skips the corpus (29 skip it today, 8 on the debt list f
- THE PIXEL FLOOR: FAIL F2 every published picture has a kind (29367 pictures)
### COMBAT (14)
- AUTO NEVER WASTES A TURN: FAIL *** G2 NO DANCE *** (rule 176(b): 'never off and back'): off one round and back the
- EVERY MAN HAS A JOB EACH TURN: FAIL J3 TUNING's own crews (3, 6 and 12 men, three gear stages): the same, at most 1 i
- EVERY WEAPON HAS ITS RANGE BANDS: FAIL *** B5 THE HITS LAND AT THE CHANCE THE RULES GAVE *** (rule 187(e)): every band and
- GEAR NEVER VANISHES: FAIL *** V1 TEN FIGHTS IN A ROW, HIS SPEAR AND HIS CAR DOOR NEVER VANISH *** (rule 191(b
- GHOSTS AND APPARITIONS: FAIL *** THE ACTS ***: every kind the fight fields has a weight for each act; Geists thr
- THE FIGHT BY HAND, QUICKER: FAIL never a die: a walk that drew a free swing has no BACK [NOTHING ROLLED, no BACK,
- THE FIGHT HOLDS THE WHOLE GRID: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE FIGHT OPENS THE FIGHT: FAIL L1 LEVEL UP on the end screen: the company screen opens over it, its DONE on the ph
- THE FIRST FIGHT TEACHES: FAIL *** THE WORDS: THREE LINES, THE LESSON IN ENGLISH, AT MOST ONE FLAVOUR WORD FROM TH
- THE PC PLAYTEST: THE FIGHT: FAIL what it gives, said: on the tile he taps, on the walk's tag, and in the aim both
- THE PISTOL IS NEVER A CLUB: FAIL *** THE GUN'S BUTT AND THE WHIP ARE GONE FROM THE FIGHT *** (rule 195(a)): no clubF
- THE REBUILT FIGHT PLAYS: ok *** NO BLUE HOLE EVEN WHEN A BLOCK FAILS (his fourteenth votes NO: 'what the fuck i
- THE RELOAD IS LOUD: FAIL *** ON ITS SIDE (844 x 390) THE BIG RELOAD FITS *** [46 x 46 at 340,325 on 844 x 3
- WHAT THE CREW CAN'T SEE: FAIL *** SIGHT BY BATTLE BROTHERS' RULES ***: 7; Eagle Eyes 8, Short Sighted 6; the nasa
### RUN TWO (12)
- CLIMBING: }
- EQUIP FROM THE STASH: FAIL DONE closes it; the stash lost the weapon; the company carries his gear [{"main":"
- NO FACE FROM A BODY: FAIL the face module reads only PORTRAIT's hand-off folder, and knows every look PORTRAI
- NO TWO PEOPLE ALIKE: FAIL THE CREW SCREEN: a hired man wears his own face there [0 rolled faces of 0 on the
- ONE MAN, ONE LOOK: FAIL the crew screen and the fight, each left to itself, dress every man alike [8 of 12
- SETTLEMENT PEOPLE (ORPHAN): FAIL every file loads [http://127.0.0.1:8864/records/target/portrait/wounds/person_woma
- SETTLEMENT SIDEWAYS: FAIL on its side, camp: the whole picture is on the glass, nothing cropped, no page colo
- THE CREW SCREEN AT FOURTEEN: FAIL every man in the line and the laid-up strip is a fresh face on the glass, 44 wide
- THE FACE IS HIS OWN FACE: FAIL F3 THE TOWNS: every keeper speaks under the head of the body at his post, a rolled
- THE TOWN AND THE HIRE: FAIL every file loads [http://127.0.0.1:8874/records/target/portrait/wounds/person_woma
- THE TOWN'S PART: FAIL E8 [crowd taps] every person on the glass answers a fair finger, 44 points at least
- TWO HANDS: FAIL T8 the shop says a long gun takes two hands (every bow, rifle and shotgun on the sh
### RUN (10)
- MEET BEFORE YOU FIGHT: FAIL M6 again, and ENGAGE: the fight goes to the shell through the one door, as their pa
- ONLY THE FINAL LOOK: FAIL F2 the loading screen held GO until the final look was in (asked 22 times, ready ye
- PLAY TAKES YOU THERE: FAIL P2 the path finder's own route: never more minutes than the fewest-blocks route, fe
- PROOF SHOTS STAY PUT: FAIL P1 no gate writes a picture into a tracked folder except through proofShot or a scr
- THE FAR END AT THE PHONES PIXELS: FAIL *** D0 THE FAR END HE LIKED IS THE DEFAULT *** (switch false, front 0.38, sharp ask
- THE LOOP PLAYS ON THE MAP: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE MAP FRAMES AROUND THE PHONE: FAIL F12 MUTATION: the map's own no-button-twice line off, F11 goes red (the bar's crew
- THE MAP STANDS TALLER: FAIL W1 behind a house at the near stop part of him is covered, and the glass there is t
- THE NEAR END IS THE BLOCK: FAIL N1 one squeeze climbs the map to its closest stop and stops there (zoom 21.11 of 4.
- TWENTY FIGHTS, NO CRASH: FAIL T1 computer: 0 of 20 fights stood and ended, the tab never crashed
### UI (9)
- SETTINGS IN OUR MATERIALS: FAIL EVERY CONTROL IS A THUMB (44 x 44 or more) [27 controls, small: sound level 1 53x4
- THE FIGHT READS ONLY SOURCED NUMBERS: FAIL *** THE RULES TYPE NO NUMBER: every felt number comes from a sourced row *** (41 ty
- THE FIRST HOUR, QUICKER: FAIL *** Q2 THE PHONE'S JOB GOES SOMEWHERE *** (road 0 blocks, town lit 0, dead taps 1)
- THE FRONT SCREEN JUST THE FONT: FAIL J4 no browser default on the picks and the terminal, upright (gradient, glow, blur,
- THE HIT CHANCE LOOK: FAIL H4-H9 C in the bar: 4 words read, honest cells, in place -- covers bspeed
- THE LINE ON A GROUND: FAIL G4 NO GRADIENT, GLOW, BLUR OR ROUND CORNER in what the candidate puts on the screen
- THE MAPS BAR: }
- THE ROSTER AND POSTS LOOK: FAIL EVERY WORD ON HIS PAGE PASSES 4.5 TO 1 ON WHAT IT SITS ON, PLAIN AND IN THE SUN [t
- THE START SCREENS LOOK: FAIL the alpha opened [page.evaluate: TypeError: Failed to execute 'getComputedStyle' o
### WORLD (6)
- A NEW VALLEY EVERY GAME: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- EVERY JOB KIND: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE JOB TELLS THE TRUTH, IN BLOOD: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE JOBS' PART: FAIL R3 nine men hired at the hall by a finger on HIRE (7)
- THE MOMENTS BETWEEN: FAIL B1 MAKE CAMP: made at once, the camp screen eased up over 3 beats, no frame steps o
- THE NEWS DOWN THE ROAD: FAIL B4 nowhere is raided more than every other week (the news is news, not weather) (L
### SOUNDS (5)
- FIGHT STEPS: FAIL STREET: every tile a man crosses is one step [0 tiles crossed, 0 steps, 0 dropped]
- MAP HEARD: FAIL travel on the map brings the recorded desert in [{"on":false,"id":null,"g":false,"
- ONE SONG ONLY: FAIL O1 THE FENCE IS IN THE ALPHA AND THE DEMO, verbatim from its source
- THE GUNS HEARD: FAIL in thirty seconds of the fight at real speed, its guns are heard through the new so
- THE ONE BEAT: FAIL B9 A DIVISION IS THE SAME GRID, FINER (snaps 1,2,2,4,4,8,16,16; the next half beat
### CHARACTER (4)
- BODY SCALE: Node.js v22.23.4
- CHARACTER IN THE VOTE TAB: FAIL *** EVERY VERDICT ON THIS LANE IS WRITTEN DOWN IN records/ AS .txt *** -- NOTES A
- HEM FOLLOWS THE LEG: FAIL *** AND EVERY GARMENT THAT REACHES THE LEG IS IN THE TABLE *** -- this is the hal
- THE ROLL CALL: FAIL R6 the roll call re-derives row for row (tools/bohemia_character_the_roll_call.py)
### BOSSES (4)
- THE FILTER CHANGES THE MAP: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE FIRST BOSS CHANGES THE MAP: FAIL C1b the way across his ground is shorter than while his crew held it [14 blocks th
- THE FIRST THREE BOSSES: FAIL A5m THE POT: the moment he falls the camera goes to his place and the change plays
- THE TAP CHANGES THE MAP: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
### MOTION (3)
- THE CAMP IS PITCHED ON THE BOARD: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
- THE UI MORPHS EVERYWHERE: FAIL the board's sheet grows out of the board [sheet in, 656 ms, 8 poses, biggest pos
- THE ZOOM DOWN INTO THE BOARD: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
### CAMP (3)
- A TOWN IS SAFE: FAIL phone_portrait: T2 HEAL AGAIN ENDS THE REST, and he is still in the town [{"on":tr
- CAMP HOLDS UNTIL HE ENDS IT: FAIL phone_portrait: H1 *** STRAIGHT AFTER A FIGHT *** (the won fight's contact flag up,
- THE BARS OVER THEIR HEADS: FAIL phone_portrait: B4 *** AT CAMP ***: bars over his man struck to 20% hit points and
### COMBAT (by its words) (2)
- NO BOARD BREAKS ITS OWN PICTURE: NO BOARD BREAKS ITS OWN PICTURE: FAIL
- TILES ARE LEGOS: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
### WORLD (by its words) (2)
- THE FAR END AT THE PHONE'S PIXELS: FAIL *** D0 THE FAR END HE LIKED IS THE DEFAULT *** (switch false, front 0.38, sharp ask
- THE VALLEY HAS AN EDGE: FAIL E13 ONE LIGHT: the land beside the city changes with the hour as the city does (3:0
### ECONOMY (by its words) (2)
- THE FRONT DOOR: FAIL *** D4 THE CARD SAYS WHAT THE GAME APPLIES *** ("THE WATER TRUCK" vs start 165, cre
- THE START SCREEN: FAIL T2 the menu is clear of the door's BEGIN, upright and on its side (upright false, B
### COOK (2)
- QUARTERMASTER'S COUNT: FAIL Q1 the count names the sha it was counted at and that sha is in this history (bb0e3
- THE FIGHT KEEPS ITS COLOUR: FAIL *** K2 NO FIGHT PICTURE HAS LOST MORE THAN HALF ITS COLOUR *** [30 of 121 below ha
### PEOPLE (2)
- MAP KNOWS PEOPLE: FAIL: B1 the grid says exactly what the population module says (14 settlements against t
- THE NAMES WIRED IN: THE NAMES WIRED IN GATE: 2 FAILED, 64 ok
### EYES (2)
- THE QUEUE ON HIM: FAIL the live queue waiting on him: 45 (cap about 20) {'arena': 4, 'combat': 16, 'ui': 1
- THE STAR IS THE BAR: FAIL the crew screen's square: rebuilt for 13 faces; the most any pixel differs from the
### DIRECTION (2)
- SPRITE SCALE: FAIL records/target/master_rig/cook_bld_ranch_plain_3s/rig.json on the ruler: base_turn_
- STYLE GUIDE: FAIL records/target/character/barber/base_arc_layered_shirt/rig.json 1 of 8 out under th
### SOUNDS TWO (2)
- THE FIGHT AS HE HEARS IT: FAIL PHONE, AUTO: *** D EVERY ACTION ON THE BEAT, OFF THE AUDIO *** (47) [297 fight so
- THE FIGHT AS HE HEARS IT, THE REST: FAIL PHONE AT A QUARTER OF ITS CPU, AUTO: *** A MUSIC FROM THE FIRST FRAME TO THE END S
### FINISHER (1)
- THE FIGHT SAVES AT ITS START: timed out after 600s (BOHEMIA_GATE_CAP) and the whole process GROUP wa
### FACTIONS (1)
- THE NEW ENEMIES: FAIL *** THE FILE ***: at least 8 new types in at least 3 factions, each on a wiki row w
### COMBAT TWO (1)
- AUTO KILLS ONE AT A TIME: FAIL *** F5 EVERY KIND HAS ITS LESSON, EVERY LESSON ITS READER *** (182(a)(c)) [23 kind
### FIXES (1)
- THE SPOILS: FAIL the walk ran to the end [locator.tap: Timeout 30000ms exceeded.
### WORLD TWO (1)
- WHERE IT SELLS BEST: FAIL W3 phone_portrait: the marks for SALT: every town he knows with what it pays, best
### ECONOMY (1)
- TRADE GOODS CARRIED: FAIL L2 phone_portrait: a double tap buys one: batteries -21, one piece in the stash, th
### HOME BASE (1)
- HIS MAP: FAIL F2 phone_portrait: MUTATION: RUN's dark back, the shape is gone (under half of this

## THE OLD REDS ON THE QUARANTINE, BY OWNER (each line in gates/BOHEMIA_QUARANTINE.txt with its first failing line)

UI 37, ECONOMY (guessed from its words) 33, RUN 27, WORLD 22, COMBAT (guessed from its words) 22, COMBAT 17, PEOPLE 16, CITY 15, CHARACTER (guessed from its words) 15, PLUMBER 13, SOUNDS (guessed from its words) 11, WORLD (guessed from its words) 10, PEOPLE (guessed from its words) 9, LIFE + CITY 9, QUESTS 8, SOUNDS 7, ANIMATION (guessed from its words) 7, CHARACTER 7, COOK (guessed from its words) 6, EYES 5, ANIMATION 5, MUSIC 4, FACTIONS 4, COOK 4, WORDS 3, RUN TWO 3, UI (guessed from its words) 3, DYNASTY 3, ECONOMY 2, FACTIONS (guessed from its words) 2, QUESTS (guessed from its words) 2, DIRECTION 2, PLUMBER (unowned, routed to the pipe) 1, CONTENT 1, PORTRAIT 1, MOTION 1, MODS 1, TUNING 1, HOME BASE 1, COMBAT TWO 1, COORDINATOR 1, FEEL 1

## ASK ROWS FILED (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md)

- 562 THE REPOSITORY GROWS ABOUT 66 MB A DAY (PLUMBER)
- 563 THE PUBLISHED SITE IS 944 MB (RUN, PLUMBER)
- 564 THE TOWN ASKS FOR WOUND FACES THAT DO NOT EXIST (PORTRAIT)
- 565 THE LEAVE TAP ON THE END SCREEN SOMETIMES DOES NOT LEAVE (FIXES, CAMP)
- 566 THE TOWN AT REST, WHAT COSTS ITS FRAMES (RUN, UI TWO, JOBS)
- 548 and 558 FIXED by FIXES a1a3a216 (checked here against the case EYES measured)

## HOW (so the next PLUMBER can do it in one sitting)

- python3 -u gates/bohemia_gates.py with BOHEMIA_SUITE_BUDGET=30000 in a worktree of main: 8 hours on 4 cores and still 124 short. A full suite does not fit a round on this box; shard it (--shard i/n) across sessions, or run the never-ran tail first next time.
- the re-run: a list of gate names run from the registry in a clean worktree, N at a time or alone, results as JSON as they land (PLUMBER 8's scratch confirm.py; the runner's --only takes one name pattern, not a list: worth a --names FILE).
- the triage: a red's first FAIL line, its gate's own date, its owner from the gate's history (the oldest lane commit), else its board row, else its words (marked "(by its words)").
