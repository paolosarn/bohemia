# HOME BASE 2, 11/21/26: THE CORK BOARD IS DEAD (VAMILY rule 466(b), his votes of 11/21; rules 445(b), 441, 454(a))

His NO, in the VOTE tab on home-base-his-impact-11-17: 'This looks like shit get this AI slop out of my fucking face.' Rule 466(b):
KILLED, graveyard.

## WHAT DIED (graveyard/home_base_the_cork_board_11_17_26/, post-mortem graveyard/POSTMORTEM_HOME_BASE_THE_CORK_BOARD_11_21_26.txt)
- records/target/bb/home_base.json places.board (the free board that put itself up on his first free lot) and its line
  ('{n} jobs done. {m} brought home.').
- slices/BOHEMIA_CITY_WORLD.html homeEnsureBoard and its two calls (on every deed, and on planting); BohemiaHomeMap.ensureBoard.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html the board's sheet (the count and the last five papers).
- A save made before the kill: its board comes down when the place loads (homeRec, __THE_CORK_BOARD_IS_DEAD__); a board in an old
  message is never drawn nor a door.

## WHAT STAYS
Every job he finished and every raid he held at his gate is still a deed in his place's memory (engine/bohemia_home.js, the jobs'
own settle, the raids' poll), shown nowhere until he asks for a way to see it. His YES the same hour on home-base-held-the-gate-11-18
(a held raid pinned on that board): the held gate stays a deed; the board it hung on died.

## THE GATE: gates/home_base_gate.js, YOUR PLACE, PLANTED
D18 rewritten: three jobs settle through the jobs' own code, the two done are remembered, the lost one not, no board goes up
(BohemiaHomeMap.ensureBoard is gone); a raid held at his gate is one deed marked held, one held elsewhere none, still no board; his
place's screen is handed no board and has no door of it; PLANTED: a board in a save from before the kill (1 in the save) comes down
when the place loads (0 after). E11: a deed still waits, is kept on planting, is one when given twice, has no lot; the board is no
place any more (NOT_A_PLACE). Engine 34/0; demo upright 123/0, sideways 120/0.

[bb Battle Brothers keeps your company's deeds in a ledger you open from a menu; ours keeps them in the place and says nothing.]
[analog horror: the pins are still in the fence post where the board hung. Nobody remembers putting them there.]
