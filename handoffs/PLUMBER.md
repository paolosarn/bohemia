# PLUMBER (the permanent pipe fixer) -- written only by PLUMBER, newest first; older blocks in handoffs/PLUMBER_ARCHIVE.md

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
