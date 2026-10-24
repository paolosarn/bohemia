# THE TEN CHANGES, THE UI'S PART (UI, 10/24/26)

Row: UI [the ten changes: the UI's part] THE-PHONE-THE-PLATE-THE-BAR-THE-COUNT-UP-THE-FACE, then [portrait menu]
TAP-YOUR-FACE-THE-COMPANY-SCREEN-OPENS. Rule 133, Paolo 10/23: "the whole point of this project was to be like Battle
Brothers but quicker and funner for normies, also kind of hardcore vibes if you're fucking around too much... like someone
who plays Stardew Valley would play it." TUNING's page (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md)
ranked ten changes; RUN built the map's half of 1 to 5 on 10/23 (records/BOHEMIA_RUN_THE_FIRST_HOUR_QUICKER_10_23_26.md).
The screen's five are 2, 3, 5, 6 and 8. No card (rule 127): he meets all of it in the game.

## THE STRANGER'S WALK, BEFORE AND AFTER

tools/bohemia_ui_the_ten_changes_walk.js is TUNING's stranger as a tool, the same way RUN made its walk one: the one driver,
real touches on the phone profile (390 x 844, touch), the committed demo. `--before` serves the three files as git HEAD had
them (bohemia_ui_materials.js, bohemia_phone_board.js, BOHEMIA_CITY_WORLD.html) through the driver's serve map, so before and
after are ONE walk on the same demo and only the files differ. Two steps are scripted and marked in the tool: one of his men
is struck down before the fight's own end (laid up 34 days, the fight's own fields), and the clock is moved to 21:50 and
across 22:00 the way RUN's W9 does it. When the walk could find no crew on the glass it spawns the road's hunters (marked).

| | BEFORE (the round's start) | AFTER |
|---|---|---|
| change 5: the bar's glass strip | 5 figures: 290, food 0, three dashes (meds, rounds, water), the place | 2 figures: 290 and 48 NIGHTS LEFT, the place; 0 dashes; 48 is the map's own bill (290 / 6 a night) |
| the crew tag | 3/12, a drawn man | 3/12 read off the bill (a man who walked is gone), HIS face, and the tag is the door to his company |
| change 2: the phone's job touched | the post went amber; nothing on the phone said what the map now showed | the post says ROAD LIT · TOUCH CHURCH ON THE MAP and its edge beats with the road's dots (one clock) |
| change 3: a crew touched once | a dark strip, 9 px words: "2 · ON THE BORDER" and skull marks, no word for the danger | a tin tag from the kit: a drawn man and the count at 12 px, the skulls, the danger in one word (EASY / EVEN / BAD ODDS), where it is going under; the hunters' tag rusted red with the blocks to contact; ink 10.7 to 1 on the tin |
| change 6: the first job won | the battery figure jumped 290 to 335 (0 values between), 0 ticks, nobody spoke | the figure climbs 290 ... 335 through every step it can show in under 3.7 s, lit amber while it climbs; BOHEMIA_COUNT_UP goes to SOUNDS' counter and the steps ride its ticks when it answers; the client's face pays (Yesenia Ochoa, "+45": "45 batteries, like we said. Gracias."); the laid-up man shows his face and his days (DESI, "OUT 34 DAYS") |
| change 6: nightfall | the purse lost 9; the phone posted a line; nothing else | the figure counts DOWN 335 to 326 (red while it falls), the nights walk with it; his second says the day's tally: "1 fight won. 45 in, 9 out. 54 nights left." under a DAY 1 tag; one tap lets it go, none is needed |
| change 8: the first hour's voice | nothing taught anything but the fight's paper strip from nobody | his second (the first man of the company after him who is still with him) says one line the first time each of seven things happens; the first at 60.0 s of play, never before (0 early); a tap lets it go and the map does not move; it never covers the speed pad |

Numbers from the after walk and the gate's own runs on this box (the box is slow: BEGIN to the first touch the walk makes is
about 2 minutes here, so every line the walk sees is past the sixty seconds; the bench proves the hold by moving the clock).

## WHAT IS BUILT, CHANGE BY CHANGE

All of it is in slices/bohemia_ui_materials.js, section THE TEN CHANGES (the file every screen loads live: no re-cut), plus
two lines in RUN's map and one in my phone board.

2. THE PHONE'S LIT TOWN (slices/bohemia_phone_board.js): the picked post prints the next touch (ROAD LIT · TOUCH <TOWN> ON
   THE MAP; YOU ARE HERE · TOUCH <TOWN> at its gate) and its edge beats with the road, its animation started on the map's own
   clock (performance.now() over BEAT). The phone still only shows (rule 51). The picked post lost its gradient (rule 114 D10):
   flat amber with a pressed bevel, the bar's own lit look.
3. THE PARTY PLATE: partyPlate(g, P) draws the tag into the map's canvas from the kit's own nine tin pieces (KIT_BASE/tin/),
   laid at half scale and repeated by their period, a hard shadow down and right from the one sun; the count beside the bar's
   drawn man, the skulls, the word, where it is going; the hunters' tin rusted red. RUN's partyPlatePush hands it P.info; its
   mapPlatesDraw asks the materials first and keeps its dark strip as the fallback. The pieces are fetched at load, so the first
   plate he asks for is already tin.
5. TWO NUMBERS ON THE BAR: with the map's bill in (window.__BILL), the glass carries the batteries and the NIGHTS they feed the
   crew. NIGHTS, not days: the bill is paid at nightfall, and his NO on the 10/19 bars ('How many times ur gonna show how many
   days?') keeps DAY on the bar once. Red-inked at the bill's own red line. A man the fight laid up (bohemia.climb.v1) is a red
   tick. Without the bill (a page that has none) the bar keeps the five it had. This supersedes rule 47a's six on the map's bar
   (rule 133, newer, and TUNING's 'the bar shows two numbers, not five'); the stall's goods are bought and kept where they are sold.
6. A WIN IS A MOMENT: THE FIGURE NEVER JUMPS. Every change to the batteries counts where the number lives: posted to the shell
   as BOHEMIA_COUNT_UP {from, to} (SOUNDS' NOTE, engine/bohemia_bullet_lands.js); when SOUNDS answers BOHEMIA_COUNT_UP_PLAN, one
   step a tick on its 16ths and the last number lands with its drop (its clock read across the frames by timeOrigin); without a
   plan (the sprites still loading, no shell), the game's own eighth notes, at most twelve. Every step is also posted as
   BOHEMIA_MOMENT (count_up / count_tick / count_land / count_done, window.__MOMENTS). Nothing counts in the first three seconds
   or while a place is open over the bar (what was bought there counts when the bar is back). THE FACES: the map hears won or
   lost; the shell keeps the fight's own word home (BOHEMIA_FIGHT_OVER's crew: down, laid-up days, dead) for it; the client who
   posted the job pays with his face (the board's own person from RUN TWO's shelf, else the town's people), the laid-up man says
   his days, a dead man is said by another. What a fight drops flies into the crew tag (the seam is built: COMBAT names the drop
   as drops [{id, kind, name}] in its word home; nothing drops yet). NIGHTFALL: the day's tally (fights won that day, the
   batteries in and out from the purse's own ledger for that day, the start's grant left out, the nights left) said by his
   second; it waits while RUN's walking man has the foot of the map.
8. ONE VOICE: #bmvoice, at the foot of the map above the speed pad (beside the phone when it is on its side): a sheet of the
   kit's board, the face in a pressed tin pocket with cracked glass at its floor (PORTRAIT's fresh portrait, the mouth talking
   a syllable a half beat), the name on a receipt tag, a stamp (+45, OUT 34 DAYS, DAY 1) on tin, the line printed on thermal
   paper a word as the mouth says it. Held until sixty seconds of play (the second votes); one at a time, a beat of nothing
   between two; a tap lets it go and never reaches the map; a line nobody has a face for is never shown (rule 19c); each
   teaching line once (localStorage bohemia.voice.once.v1); a stale line drops (ttl). RUN's walking man (#billtalk) wears the
   same plate, so the map has one voice. THE SEVEN (the fight's three are COMBAT's, [the first fight teaches]): a job on the
   phone while he holds none; a crew within eight blocks before he ever looked at one; on the way to a town before he was
   ever inside one; the first pay; the first man laid up; the first hire; the first nightfall.
   THE WORDS: records/target/words/the_second_speaks.json, draft:true, WORDS' to overwrite (WORDS is paused, rule 121); every
   line twelve words or fewer; what he needs is in English and a word of Spanish is flavour from the declared lexicon (oye,
   mano, cuidado, carnal, gracias), never the required part (the language gate's rule). If the file cannot be read nobody speaks.

[portrait menu] (rule 44b): the bar's crew tag wears HIS face and is a press (44 points): a touch opens his company through
RUN TWO's one door (engine/bohemia_crew_door.js, loaded on the first touch), the map not moved. The settlement's CREW is the
same door already; his face in front of its word was tried and TAKEN OFF this round (the image moved the button's box while it
loaded and broke the word's own read: THE UI BELONGS TO THE WORLD 34/2, back to 36/0 without it); dressing it is RUN TWO's, measured.
The fight's half ('where it shows the formation') is COMBAT's [formation].

ALSO FIXED: RUN's walking man lost half his eight beats: with the faces already loaded, his face showed inside nightfall's
advance(), which holds the thread about 2 s on this box, and his 4 s timer started before the glass could show him (THE
FIRST HOUR, QUICKER Q10 went red on this tree, traced to the timer by a stack on the style write). His eight beats now start
when the night's own work is done (one line in RUN's billSpeaks).

## GATES (rule 13: my runs)

THE TEN CHANGES, THE UI'S PART (gates/the_ten_changes_the_uis_part_gate.js, new): the walk's legs T1 to T9, the bench B1 to
B7 and P1, and the planted defects: every walk leg red on a walk bent at its own number, every bench leg red on a bench bent at
its own number, and two defects planted in the source and served through the driver (the sixty-second hold removed: caught by
B1; the count made a jump: caught by B4). RESULT on the pushed tree (rebased over RUN TWO's and COMBAT's 10/24 work): 22/0.
Re-aimed, my lane's own: THE DAYS ONCE (the food and the dash legs become 'the nights are the map's bill' and 'two numbers, no
dash'; the planted '0 DAYS' goes on the nights), THE MAP'S BAR (with the bill, the drawn pictures are the batteries and the
nights). Green on this tree: THE DAYS ONCE 50/0 (both sides), THE MAP'S BAR 7/0, THE SETTLEMENT SCREEN 74/0, THE UI BELONGS TO THE WORLD 36/0, THE PHONE'S BOARD 15/0, THE PHONE'S LOOK 15/0, THE NOTES
BUTTON 22/0, SETTINGS AND PAUSE 18/0, THE SCREENS PAST THE PHONE 36/0, SETTINGS IN OUR MATERIALS 15/0, THE ROSTER AND THE POSTS
LOOK 28/0, THE FIGHT'S BAR IS STUDIO MADE 15/0, WHEN THE PHONE TURNS 14/0, THE HIT CHANCE LOOK 25/0, THE FLIP OFF THE FACE 10/0,
THE START SCREEN'S LOOK 18/0, THE FRONT SCREEN JUST THE FONT 42/0, RUN's THE FIRST HOUR, QUICKER 11/0 and THE LOOP PLAYS ON THE
MAP 12/0, NO TWO TEXTS OVERLAP ON THE DEMO 14/0, A FRESH PHONE SEES THE DOOR 9/0, THE BOARD'S QUESTS ARE PEOPLE 16/0, EVERY ITEM
HAS AN ICON 10/0, THE SETTLEMENT'S LABELS 10/0, THE SIX AT PACK PIXELS 7/0, THE RESHUFFLE MARK 9/0, THE SIDEWAYS SIDES 10/0,
ATTEMPT GATE 15/0, DEMO BUILD green. RED AND NOT MINE (the same on main, named in the 10/22 and 10/23 blocks): THE NOTES SECTION
27/1, THE TOP MENU BAR 13/2, THE ART FENCE A2 (COOK's straight-in swaps), DERIVED FRESHNESS (the canon index, FACTIONS'
dossiers, the chunker's alpha and world lines).

## WEAK, SAID PLAINLY

- SOUNDS' plan answers only once its sprites are in (about 25 s after the music first runs); before that the figure walks on
  the eighth notes and no counter sounds. Its climb is 24 sixteenths (3 s) and the drop lands on the beat after: up to 3.5 s,
  half a beat over TUNING's 'three seconds or less'. The number follows the sound.
- Nothing drops from a fight yet, so the fly into the crew tag has never been seen in the game (the seam is COMBAT's to feed).
- On this box BEGIN to the first touch is about two minutes, so the walk itself never sees the first sixty seconds; the bench
  proves the hold by moving the clock (a line asked at 20 s is not said, at 61 s it is).
- 'first_town' says the town has men for hire: true at the post (RUN TWO's [the hire shows the whole man]); if the line out
  front becomes the post (TUNING's change 7) WORDS should say so.
- The fight's portrait door is not built (COMBAT's [formation]).

[bb Battle Brothers pays you on a loot screen and says nothing for its first two contracts; ours counts the pay into the corner
where the batteries live, the client says it with his face, and one of your own men tells you what each new thing is, once.]
[analog horror: the pay ticks up on a real counter in the corner, the drop lands in a crate, and every night the same face
reads the day back to you off a thermal receipt: what came in, what went out, and how many nights are left.]
