# PLUMBER (the permanent pipe fixer) -- written only by PLUMBER, newest first; older blocks in handoffs/PLUMBER_ARCHIVE.md

PLUMBER 5 (chat 18b) 11/6 -- rule 411's third wave: THE SITE IS TOO BIG, then 408(c)'s F1-F8. BOTH SHIPPED (pipe and gates; nothing
in the game changed, so no build stamp). Record: records/BOHEMIA_PLUMBER_THE_SITE_IS_WHAT_THE_GAME_LOADS_11_6_26.md. Ask lines 462, 463.
BEFORE: pages.yml copied slices/ + engine/ + records/target whole: 1,858 MB, 32,040 files; 3 of the last 8 pages runs died at
deploy-pages' 10-minute timeout (4270, 4272, 4274), the good ones 4-5 min; PAGES PUBLISH red at its 260 MB cap.
NOW: the deploy copies tools/bohemia_publish_list.js's list, computed at deploy: the doors (alpha, demo, VOTE tab, sw.js), everything
a published text file names (followed to the end; 2b a bare name + its extension), every folder the CODE builds names in whole (or a
data value that is a folder and nothing else), the VOTE registry read as the tab reads it (36 drawable cards of 938). 831 MB, 16,198
files. 260 MB is not reachable losslessly: the game's own art is ~530 MB; the boards are lossy WebP already, lossless re-encode 0-4%,
PNG 2% (measured, PIL works here; left). Budget CAP_MB 900 (GitHub's limit is 1 GB). _config.yml names the list and now excludes
handoffs/, skills/, tickets/ (kept, never copied: the half-published red).
GATES: PAGES PUBLISH re-aimed 28/0 (red on main). NEW THE SITE SERVES WHAT THE GAME LOADS (a server that answers only the list) 7/0 on
the full run: the alpha's 18 tabs 303 files, the VOTE tab's 36 cards 200, all 61 published pages 1,238, PLUMBER 4's THE WHOLE LOOP
PLAYS run as it is through the list 11/0 (767 files), a mutation; none off the list. Its first run caught BOHEMIA_RIG_CAST/PEOPLE/YOU
.json (rule 2b). In the suite as two entries (--quick, --loop: one run is over the 10-minute cap). VOTE TAB 57/6: the FIRST TIME
FINAL leg F1-F8 (DIRECTION's PART 4, as written; baseline frozen in records/BOHEMIA_FIRST_TIME_FINAL_BASELINE_11_6_26.json, 938 ids,
128 waiting art cards; 12 plants all named); F6 THE BAND and F7 NO MARK red ON PURPOSE until RUN TWO draws the marks and skips an
unmarked card; F8 not armed until DIRECTION writes records/BOHEMIA_FIRST_TIME_FINAL_STAGES.json; the other 4 reds are main's (two
DYNASTY whys, the alpha's landing x2, the gear door). The rule-82 twin leg no longer asks a stand-in for a twin.
DEPLOY: see the ask line 462 for the run that carried this and its time.
NEXT FOR WHOEVER: if a page builds a name the list cannot see, THE SITE SERVES WHAT THE GAME LOADS names the file and who asked;
teach tools/bohemia_publish_list.js the pattern (a rule, never a hand list). The budget is 831 of 900: the next cut is a look call
(old tabs' pictures, a lossy pass), not the pipe's.

PLUMBER 4 11/5-11/6 -- rule 409's first wave: the brother's three glitches (ask 454, rule 400(e)), SMOOTH IS A BUDGET (400(a)), 384(f),
the stale pad gate, the whole-loop smoke test (408(d)), the 405(b) sweep. BUILT, NOT YET SEEN (BUILD 11/6f THE THREE GLITCHES).
Record: records/BOHEMIA_PLUMBER_THE_BROTHERS_THREE_GLITCHES_11_5_26.md.
THE ZOOM: the ground painted 3.3x the glass every frame (__A_PICTURE_NOBODY_SLIDES_HAS_NO_MARGIN__), every landed tile drew the map at
once (__ONE_DRAW_FOR_WHAT_LANDS__), the sky's earth 45,000 fillRects a frame (__ONE_PICTURE_FOR_A_PIXEL_DISC__, pixel-identical): a pinch
draw 56 -> 30 ms, frames over 33 ms pinching in 86 -> 16. THE FIGHT'S START: the phone copied twice at the door (bohemia_motion.js
__A_COPY_COSTS_WHAT_SHOWS__, door 219/68/60 -> 120/23/30 ms), a 238 ms main-thread decode (BOHEMIA_FIGHT.html load(),
__NO_PICTURE_DECODED_MID_PLAY__). THE MIDDLE OF A FIGHT: the hidden map's phone board re-read every job's danger, 276 ms in one piece
(bohemia_phone_board.js __NOTHING_WORKS_UNDER_THE_FIGHT__, 0 reads now). THE CLOCK: a beat a slow frame swallowed is owed and paid
(__THE_DAY_KEEPS_REAL_TIME__, BEAT_DEBT, capped 4); the march 4.05/4.05/4.15 blocks a second at the far, middle and street stops.
THE METER: slices/bohemia_frame_meter.js (off unless Shift+F / BohemiaFrameMeter.show()), loaded by the alpha.
GATES: SMOOTH IS A BUDGET (new, solo, ~6 min) 19/0 on the merged tree; THE WHOLE LOOP PLAYS (new) 11/0; THE PAD IS TRAVEL
SPEED re-aimed 14/0 (was failing 10 legs looking for the dead plates); all three now in the suite.
OVER BUDGET, ROUTED: the map's far and opening stops while travelling (WORLD: __YOU_WALK_BEHIND_IT__ reads 66 to 105 walkers back off
the GPU every draw; 83 and up to 66 ms medians here; held as known debt in the gate's OVER_BUDGET table, delete the line when fixed).
FOR RUN: after a fight, a save and a reload came back hours later twice in four loops (+337, +208 game minutes), exact the other two and
with no fight; not found; the smoke test fails loud with both clocks when it recurs. FOR UI: the 405(b) list in the record (the fight's
own end card 160 ms before the end screen, its loading veil in the dive, a road card that outlives a fight, the crew screen in three steps).
THIS BOX: software GPU (SwiftShader); a frame's drawing costs it what a phone's GPU does off the thread; ratchets are this box's truth.

FIXES 11/3 (round 3) -- the coordinator's A and B (rules 361, 364; asks 385, 388). BOTH BUILT, NOT YET SEEN (BUILD 11/3zzzw THE QUIET MENU, THE SHOP KEEPS ITS ARMOUR).
Record: records/BOHEMIA_FIXES_THE_MENUS_SILENCE_AND_THE_SHOPS_ARMOUR_11_3_26.md.
A: the day's speed sound is the hour strike (time_pass): travel strikes 2 to 7 times every 4 s now. The start screen hears only its
camera feed (window.__FRONT_QUIET gates the effects, the strike, the desert bed, the ambience); in play the strike is a whisper
(own bus at 0.12, peak 0.033). Gate THE MENU HEARS ONLY ITS FEED 4/0. Four sound gates now begin play before they listen; they read
main's own reds again (17/0, 30/2, 1052/4, 19/4).
B: reproduced: a shelf rolled again between his pick and his Buy took the shelf's last piece (splice at -1). A buy takes only its own
piece now. Gate THE SHOP KEEPS ITS ARMOUR 3/0 (red on main).

FIXES 11/3 (round 2) -- the coordinator's items 9, 10, 11. ALL THREE BUILT, NOT YET SEEN (BUILD 11/3zzzj THE WHOLE POST, ONE NAME EACH).
9 (rule 350, ask 360): the strip is the coordinator's fitStrip (d3f1cb29), not touched; this round the words: every
feed line 120 or under with its longest real names (87 lines rewritten at the WORDS sources, then the bank and the game's file rebuilt),
40 handles to 16; gate THE FEED HAS A MAX LENGTH (six longest posts at 6 px or more, none cut). records/BOHEMIA_FIXES_THE_FEED_HAS_A_MAX_LENGTH_11_3_26.md
10 (rule 351(b), ask 362): the cause was the hire lock's number (TOMAS REYES II, III); now a new surname, the post shows the final
name, twins mended at load (engine/bohemia_unique_name.js); gate NO TWO MEN SHARE A NAME 9/0.
11 (rule 355, ask 372): language gate section I: the feed's twins frozen at 171 and 46, no Spanish twin in other feed files, what he
meets at most 13.6%. records/BOHEMIA_FIXES_NO_TWO_NAMES_AND_THE_SPANGLISH_FREEZE_11_3_26.md
Reds seen and measured as main's own: THE PHONE's fight-pulse timing (on a loaded box), THE COMPANY SCREEN's computer path (one
scroll, the same before my change), THE SETTLEMENT SCREEN's gun-name casing, THE LONG INJURY's 'penalties list both parts'.
12 (the coordinator's): NOTHING POPS UP's two stale legs (the recap he ruled out 10/25; the one-day demo ending, gone since 10/23) re-aimed, 23/0; its 437 s is five minutes of play by design.
Seen, not fixed: the title offers CONTINUE DAY 1 for the new-game door's background save, a game never begun.

FIXES 11/3 -- EYES' broken items 3 to 8 (rows 17, 311, 315, 294, 292, 300). ALL SIX FIXED AND LIVE (BUILD 11/3zzzf SIX SMALL FIXES,
35568211, deployed in 7393fc39). Record: records/BOHEMIA_FIXES_SIX_SMALL_THINGS_11_3_26.md.

PLUMBER 3 11/2 -- ask line 335 (rule 335), THE BOARDS ALWAYS HAVE WORK. FIXED, NOT YET SEEN (BUILD 11/3zz THE JOBS ARE BACK).
Record: records/BOHEMIA_PLUMBER_NO_TOWN_HAD_ANY_JOBS_11_2_26.md.
REPRODUCED: a fresh game, two codes, an old save made on 11/3zd, the Lone Wolf, one man: every board had work in the first
minute, because a job not yet read by the danger engine passes the floor. With the reads in: the old save, every town RAIDED,
13 of 14 boards EMPTY; the same save posts 297 of 700 job-town pairs where 11/3zd posted 450.
MOVED IT: COMBAT 49666e21 (11/3zg) and 02a94193 (11/3zm) took 3 thugs vs a new crew of 3 from 0.80 to 0.54 clean runs (bisected on
BohemiaJobDanger.probe). Rulings of his; not the bug.
CAUSE: slices/bohemia_board_shelf.js asked the day's floor (rule 255) of every job and NOTHING stood under it (the deal's own
'never empty' pass asked the floor too). A raided place deals only the 4 raid jobs (3 to 6 men), all under the floor.
FIX: pickOwn's never(): the floor thins, never empties (raided -> its ordinary work; then, only in the deal's LAST pass after a
shared safe job: all kept back -> the least dangerous by its read; all done -> the one finished longest ago). The board and the
phone hand held and done apart (opt.done); held never returns. (A first cut fired mid-deal; the day-fifty gate caught the Lone
Wolf handed 0.08 on day 20; moved to the last pass.)
GATE: gates/the_boards_always_have_work_gate.js (THE BOARDS ALWAYS HAVE WORK, in the suite), 24 passed, 0 failed, about 7 min: the shelf's file
in node over 168 valleys, the floor still standing (W6) + a mutation that empties them with the rule cut; the demo on the phone: a new game, a typed code, an old save
(held + done), every home base's board tapped open, every person says his job; every town raided after the reads: 14 of 14.
ALSO: the suite runner refused to run any gate (3 rows of the table with 3 fields: THE FIGHT SAVES AT ITS START, THE NEW ENEMIES,
NOTHING POPS...); mended (slow=False). SUITE HONESTY 12/14 -> 26/0.
NEXT FOR WHOEVER: COMBAT 2cb32f46 (AUTO PLAYS THE BEST TURN) landed after this was measured; the floor's numbers move with every fight
change. TUNING may want to look at day ten's floor (0.5) against a new crew now: most fight jobs sit under it.

PLUMBER 2 11/2 -- ask line 325 (rule 327), ONE COMPANY, A MAN LET GO IS GONE EVERYWHERE. FIXED, NOT YET SEEN (BUILD 11/3zq ONE COMPANY).
Record: records/BOHEMIA_PLUMBER_ONE_COMPANY_A_MAN_LET_GO_IS_GONE_11_2_26.md.
CAUSE: the crew screen's DISMISS left a HIRED man in bohemia.hired.v1; the shop's list (settlement shopCrew: the green 'on him'
mark and his men in the town's picture) merged the hired back in and never read the let-go list. The camp's fire kept the map's
list from the visit. The map's crewCount (bar, bill, fight size) was a sum of four lists; the phone added two lists' lengths.
FIX: ONE TRUTH in engine/bohemia_hire_lock.js: company() / count() / isGone() / gone() / key() / dismiss() (the one write: the
let-go list once, then scrub() takes him out of the hired, the hand-over and the line, renumbering the line) / onChange() (storage
event or 'bohemia:company'). Crew screen DISMISS and the road's manOut call dismiss(); shopCrew, the map's crewCount (crewMen,
crewOriginNamed), the camp's fire (camp_look companyOf, settlement campFolk) and the phone read it. Every page scrubs an old save
at load.
GATE: gates/one_company_a_man_let_go_is_gone_gate.js (ONE COMPANY, A MAN LET GO IS GONE, in the suite), 9/0, about 35 s: one hire
let go from a town's CREW, one from a camp's CREW, one on the crew screen alone; gone from the shop list, 22 shop marks, the town's
picture, the fire (13 -> 12), the one company, the saved lists; the count = the crew screen's line = the map's crewCount (12).
Touched gates re-run: company screen 47/1 (= main), roster counts, who you hire fights, the shop says, crew lives in the town 10/0,
the camp 8/0 (its C5 cart leg flaked twice under load, passed alone).
NEXT FOR WHOEVER: the alpha's fight door, job_kinds rosterMen and condition members still build their own lists (they filter the
let-go by name, so they agree); fold them onto BohemiaHireLock.company() when next in there.

PLUMBER 11/2 (second round) -- ask line 313, THE WAY BACK FROM A LEVEL-UP. FIXED, NOT YET SEEN (BUILD 11/3zl).
Record: records/BOHEMIA_PLUMBER_THE_WAY_BACK_FROM_A_LEVEL_UP_11_2_26.md.
CAUSE: the phone took its YOUR COMPANY face (the one with DONE) only off a fight, and a fight's end screen counts as the fight; UI round 2
had hidden the company screen's own DONE. So LEVEL UP on the end screen (and CREW mid-fight) opened a screen with no way out; the phone
also stood at z 70, under the end screen (z 8000). FIX: slices/bohemia_phone.js, a company screen up anywhere is the phone's face first
and the phone stands on top while it is; back to a live fight with no second strike card. BOHEMIA_SPOILS_SCREEN.html: DONE re-reads the
men's levels; the last pick of the man brings him back by itself. GATE: L1-L6 in THE FIGHT OPENS THE FIGHT (17/0 on the demo).
FOR WORDS: the end screen says 'Pick three stats', a level asks for four (rules.json attributes_raised 4).

PLUMBER 11/2 -- ask line 309, THE FIGHT THAT OPENED THE CREW SCREEN. FIXED, NOT YET SEEN (BUILD 11/3zf THE FIGHT OPENS THE FIGHT).
Record: records/BOHEMIA_PLUMBER_THE_FIGHT_THAT_OPENED_THE_CREW_SCREEN_11_2_26.md.
CAUSE: the map's meet card (ENGAGE / FALL BACK / MAKE CAMP NEARBY, slices/BOHEMIA_CITY_WORLD.html meetShow) answered the finger's
lift and in the same handler went see-through (btwCardGone), so the tap's click, made ~80 ms later, landed on whatever was under the
button: the camp or town screen (measured: mousedown, mouseup, click on its canvas from the one ENGAGE tap) or the map. Under it,
YOUR COMPANY, OPEN THE STASH and his men's ALSO HERE faces open the crew screen by a click. A finger only: a mouse never leaks.
FIX: the card cancels its touchend (no click born), the going card stays a wall 450 ms for a late click, done() answers only its card.
GATE: gates/the_fight_opens_the_fight_gate.js (THE FIGHT OPENS THE FIGHT, in the suite): ten ways into a fight with a real touch;
red on main before the fix (every ENGAGE and FALL BACK leaked), green after. The crew screen at the very end of the leak was not
staged in a scripted run (the camp's sheets are behind its sealed code); the leak itself is measured both ways.
NEXT FOR WHOEVER: any other overlay that acts on pointerup and steps aside in the same handler has the same ghost click; grep
`addEventListener('pointerup'` on cards that remove themselves.
