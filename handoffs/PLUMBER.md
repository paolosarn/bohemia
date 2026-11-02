# PLUMBER (the permanent pipe fixer) -- written only by PLUMBER, newest first; older blocks in handoffs/PLUMBER_ARCHIVE.md

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
