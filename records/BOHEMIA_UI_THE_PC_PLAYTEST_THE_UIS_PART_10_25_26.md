# UI [the PC playtest: the UI's part] + [eyes: mode button] -- 10/25/26, session ui-pc-playtest

Rule 164 (Paolo 10/24 evening, on his PC: "I'm playing this on my PC and I'm so fucking impressed... but I have a lot of
feedback"), items 1, 2, 4, 7, 8, 16, 25 of records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md, in the
coordinator's order. Every piece is in the game (no card, rule 127), live on every page through slices/bohemia_ui_materials.js
and slices/bohemia_phone_board.js; the demo re-cut once for the stamp: BUILD 10/25o - THE PC KEYS, THE SIX, THE ICONS.

## (1) BATTLE BROTHERS' KEYS ON THE MAP (item 1)  c4f0c4f1

HOW BATTLE BROTHERS DID IT: the wiki's Keyboard Shortcuts page, through Grok ask 105 (PASSED FILTER; Grok, unverified):
world map W A S D / arrows camera, wheel / Page Up / Page Down / + / - zoom, Shift or Return centres on the party and zooms
in, Space pauses, F5 quick save, F9 quick load, Esc menus or closes a city / shop / inventory, F tracks, T camp, R relations,
C or I inventory; inventory Tab or D next man, A the one before, Esc or C or I closes.

MEASURED BEFORE (EYES round 2 on BUILD 10/24t, computer 1440 x 900): Space paused (RUN's); Enter did nothing on the title;
Escape did not leave a town; C did not open the crew in a town (the focus was inside the town's frame).

NOW, one block, __BATTLE_BROTHERS_KEYS__, in the file every frame loads. It listens on the window, behind each page's own
listeners, and a key pressed on a page with a screen lying over it is DISPATCHED INTO that screen's document, so every listener
there (RUN's space, the meet card's Enter and F, COMBAT's fight keys) answers as if it had the focus. The settings, the title
and the door's picks stand over every frame, so a key pressed in a frame under them goes up to the shell.

| key | map | town | company |
|---|---|---|---|
| W A S D, arrows | the camera moves while held (lets go of the crew, like a drag) | | D the next man, A the one before |
| Page Up / Down, + / - | zoom, one spin's rule (stops at the far stop) | | |
| Shift, Return | back on the crew, in to the middle stop when out past it | | |
| Space | pause (RUN's, kept) | | |
| C, I | the company (the one crew door) | CREW | closes it (DONE) |
| Tab | | | the next man (Shift+Tab the one before) |
| F | the parties' tracks on and off (off by 151(f) until asked) | | |
| F5 | save now; the bar's day tag says SAVED | | |
| F9 | the last save (the title, CONTINUE lit) | | |
| Esc | closes what is open; with nothing open, the settings | the building's sheet, then LEAVE | the picker, then DONE |
| Enter (title) | CONTINUE over a save, else NEW GAME; on the picks, BEGIN | | |

NOT BOUND, AND SAID: T (make or break camp) and R (the relations window) open things the game does not have; Ctrl+click on a
neutral party (no neutral attack). The fight's keys are COMBAT's (f9a2a846); a key with the focus on the shell is handed to it.

Gate: THE MAP'S KEYS (gates/the_map_keys_gate.js) 11/0, real key presses on the demo, the computer profile.

## (2) THE SIX ON THE BAR (item 2)  6cf805c5

ECONOMY's page (records/BOHEMIA_ECONOMY_DAY_80_HOW_MANY_CURRENCIES_HIS_FOUR_ARE_BATTLE_BROTHERS_FOUR_AND_THE_GAME_COUNTS_ONE_
10_25_26.md section 3): left to right BATTERIES, FOOD, WATER, TAPE, MEDS, ROUNDS, an icon and a number each; hold the batteries
and the nights show; low red; never a dash, never an invented number.

THE ICONS ARE HIS: set A of the card he voted UP on 10/17 (ui-the-six-at-pack-pixels-10-13, records/BOHEMIA_THE_THIRTEENTH_
VOTES_10_17_26.txt), each a pack tile copied byte for byte into slices/supply_icons/ (SOURCES.txt), 32 points (96 phone
pixels, the pack's floor). The batteries now wear the pack's cells instead of the 10 x 10 drawing.

THE COUNTS: a supply stands on the glass the moment the game counts it, from ONE reader (supplyCounts): the purse's own key
when engine/bohemia_purse.js carries it, else the map's window.BOH_SUPPLIES. Held (hovered), the nights follow the batteries
and food and water say the days they last (the crew the bill feeds eats one a day). MEASURED: today the game counts the
batteries only (the purse's three keys are resources, electricity, clout; ECONOMY section 1), so the glass shows the batteries
and nothing else, never a dash. THE FIVE WAIT ON ECONOMY's section 4 (RUN: the purse gets the counts, each spent by its verb;
RUN TWO: the stall and the loot add to them). Planted at once on the demo they stand in order, inside the glass, on a phone
and a computer (the gate's S3).

Gates: THE SIX ON THE BAR 8/0 (new); THE MAP'S BAR re-aimed to the pack's props (6/1: the speed pad's thumbs, red on main);
THE DAYS ONCE 59/0; THE SIX AT PACK PIXELS 7/0.

## (3) AN ICON FOR EVERY STAT (item 4)  81a3323e

HOW BATTLE BROTHERS DID IT: a small picture beside every stat on a man's page and in the fight. OURS: eight solids lit by
the kit's one sun (slices/ui_kit/kit.json, 155.4 deg, 40 up), bevelled, shaded per pixel, inked and dropped on a hard shadow
(tools/bohemia_ui_stat_icons.py, seeded; ALL THE UI LOOKS 3-D, never a CSS gradient): HITPOINTS a heart, FATIGUE two lungs,
RESOLVE a taped fist, INITIATIVE a bolt, MELEE SKILL a machete, RANGED SKILL a reticle, MELEE DEFENSE a steel shield, RANGED
DEFENSE the drab shield shot through. 72 px = 24 points on his phone, one art pixel to one phone pixel. Sheet:
records/target/UI_THE_STAT_ICONS_10_25_26.png. Laid on by CSS on the crew screen's rows and level-up picks and the hire's
numbers, and on the fight's drawer rows by their words; nobody's code rewritten.

Gate: THE STAT ICONS 5/0 (a flat fill fails I1: planted, lit/shade 1.00, 2 tones).

## (4) THE FIGHT'S BARS AND THE END SCREEN, NEVER AI SLOP (items 7, 16, 25)  d7eb9aea

MEASURED BEFORE: the man's plate in the fight carried three unlabelled 5-point strips of flat colour, no number, no name: the
browser's progress bar. The end screen's XP bars were CSS gradients (rule 114's loudest tell) and what they left was words.
NOW: each strip is a gauge (the stat's icon in front: heart, shield, lungs; a track sunk into the board; a lit tube drawn in
pixels; now/most printed in the casing face, following the man shown); the end screen's XP bars are the same track and tube,
bronze for what he had, gold for what he earned; what they left wears his pack's props (batteries, rounds, a crate for scrap).
COMBAT's and RUN TWO's code untouched; COMBAT's bar keeps its 180 points.

Gates: THE FIGHT'S BARS AND THE END SCREEN 6/0 (new); THE SPOILS 27/0; THE FIGHT'S BAR IS STUDIO MADE 15/0; ONE SCREEN 10/0.

## (5) A PLAIN BUTTON TO DROP A JOB (item 8)  b179167a

HOW BATTLE BROTHERS DID IT: the contract you hold sits on the world map's corner as a scroll with an X; it asks once. WORLD
built the rule (07826e02: BohemiaJobKinds.drop and dropCost; the place's bar -10, nobody pays, never in its own fight).
NOW: the jobs he holds sit on the phone above the two on offer, each a receipt (its what, YOURS, its pay, its place) with a red
tin DROP, 44 points. DROP asks once with WORLD's cost printed ("NOBODY PAYS. CHURCH THINKS LESS OF YOU: 50 TO 40."); DROP IT
drops it, KEEP IT takes the question back; in its own fight the card says NOT IN ITS OWN FIGHT.

Gate: A PLAIN WAY TO DROP A JOB 6/0 (new, real touches on the glass); THE PHONE'S BOARD 18/0; THE PHONE'S LOOK 17/0.

## [eyes: mode button]  a1d99267

E23's crawl measured the round DROP IN button 40 x 40 (44.4% of the half-size pad). It keeps its share and floors at 44,
still centred; on the demo's map the pad is off (rule 38b), the workshop still walks. Gate: THE MODE BUTTON IS 44 3/0.

## RED, NOT MINE (the same on main before me)
SETTINGS AND PAUSE 17/1 (its QUIT leg's click after QUIT no longer lands on the title's NEW GAME), PAGES PUBLISH 16/2 (the
published surface 1393 MB against the 260 cap; handoffs, skills, tickets not copied), GATE REGISTRY 6/1 (12 orphans of other
lanes: a_fresh_start_and_a_fog_of_war, bullet_lands, everybody_idles, meet_before_you_fight, sight_down_the_street,
the_busy_town_talks, the_guns_on_the_crew_screen, the_jobs_stars, the_map_stands_up, the_trait_before_you_hire,
the_wipe_wakes_in_town, what_a_man_holds), THE MAP'S BAR's pad leg (2 plates, it wants 5: RUN's pad).

## WEAK, SAID
- The five supplies are not on the glass until the purse counts them; the bar is ready and gated, the counts are RUN's.
- F's tracks: the switch flips (K6) but no print was on the glass at that moment of the gate; whether the prints draw well is
  RUN's and LIFE+CITY's drawing, not measured here.
- The stat icons are ours, drawn in light and form by a tool; the packs hold no heart or shield to cut.
- The fight's '9/9 AP 0/81 FAT' line still prints the fatigue a second time (COMBAT's words, rule 125(b)).

[bb Battle Brothers puts a picture in front of every bar and every stat, prints the numbers inside the bars, keeps the held
contract in sight with an X that asks once, and answers the same keys on every screen: ours does all four now.]
[analog horror: the gauges are tubes sunk into the board, lit from one sun and chipped every sixteen cells, the numbers
stamped into them like a meter on a salvaged machine; the job you drop is a receipt you tear off the glass.]
