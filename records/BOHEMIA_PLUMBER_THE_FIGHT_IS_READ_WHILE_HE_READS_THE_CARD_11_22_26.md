# THE FIGHT IS READ WHILE HE READS THE CARD (PLUMBER 8, 11/22/26; VAMILY rule 472(e), rule 441, ask row 613)

PAOLO 11/22, of the camp: 'it's just like the combat map, it freezes for like 10 seconds and then everything's populated in.' The camp's
load shipped first (BUILD 11/22zx, records/BOHEMIA_PLUMBER_THE_CAMP_LOADS_IN_ONE_GO_11_22_26.md). This is the combat map's.

## HOW IT WAS MEASURED

A probe that plays a road fight the way he meets one (scratchpad meet_fight.js): the demo upright 390 x 844, the CPU slowed 4x, the GPU
canvas, the real map's fog, a road crew handed over the way the map hands one so the MEET card comes up, the card read 3 s, a finger on
ENGAGE. The fight's die pinned (its kept deal, 424242); in the first fifteen runs THE VALLEY WAS NOT (a new game each run, so the cell and
its board still changed: 16 to 90 pictures), which is why their times swing 12 to 24 s; the last four runs pin the valley too (PTBTDN,
the same board every run, 8 pictures) and are the clean A/B. Read: the camera's own 'the fight is up' mark (the dive's turn,
BohemiaMotion.dive.log), the fight page's own clock (window.__FIGHT_T: its start, its pictures asked, the ground in, the men in, the
board drawn), every task over 50 ms, and a network waterfall (the Chrome protocol's own requests). A phone on mobile data: a 100 ms round
trip and 12.8 Mbit/s; on wifi: no delay.

## WHERE THE TIME WENT (before, a phone on mobile data, the same board every run)

From ENGAGE: the map's camera comes down (about 2 s, MOTION's dive), the fight's page is built at its stop, made, read and run (its
document from the phone's cache, 1.15 MB of page: 2.2 to 5.0 s after the tap), its 50 data files read (in one go since BUILD 11/22zx;
they are already in the phone's cache by a fight, so that cut does not move a fight's start: inside the run-to-run noise), the fight
started 7.0 to 8.6 s after the tap, its board dealt (0.3 to 0.8 s), 64 to 90 pictures asked (5 to 6 MB on the wire: SIX BLOCK PICTURES OF
ABOUT 600 KB EACH, 2575 x 1820, for a board that draws a few tiles of each; the faces strips; then the men's sheets, after the ground on
purpose so a slow line serves the ground first), the ground in 2.5 to 5.5 s after it was asked, the men 0.6 to 1.9 s after that, the
board drawn 1.8 to 3.7 s more, up 12 to 24 s after the tap. The page held in tasks over 50 ms 3.7 to 5.9 s of it.

## THE CUT

`__THE_FIGHT_IS_READ_WHILE_HE_READS_THE_CARD__`. The moment the meet card is up (the map's meetShow calls the shell's nfWarm), the fight's
page is opened hidden in the fight's own place (#p-combat, unseen, no finger reaches it), told FIGHT_OPTS.warm: it is read and its files
loaded while he reads, then it WAITS (slices/BOHEMIA_FIGHT.html fightGo), dealing nothing, drawing nothing, saying nothing. The fight
it is built for takes it (the shell's nfBuild: the same frame, the fight's own options, then go). FALL BACK or MAKE CAMP NEARBY lets it
go, and so do 90 s with no fight. ONLY A PAGE ALREADY WAITING IS THE FIGHT'S: measured with the checkers' tap (ENGAGE the moment the
card is up, MOTION's THE ZOOM DOWN INTO THE BOARD), a page still reading its files read them while the camera came down and cost the way
in one 434 ms frame at 4x; so when ENGAGE finds the hidden page not yet waiting it goes (nfOpen, 'engaged before it was read') and the
fight's page is made at the camera's stop exactly as before. AND IT IS OPENED A BEAT AFTER THE CARD (half a second at 120): a card answered
inside the beat (the checkers' own tap, 250 ms) makes no hidden page at all, the old way exactly; one made and let go a quarter second
later left the next fight its half-built page to clear (the freeze census went over its ratchet by 3% on a later step, twice, where
main's own run passed). A card read for about 3 s or more at 4x finds it waiting. Switch: window.__NO_FIGHT_WARM (every fight's page
made at the fight).

`__A_FIGHT_STARTS_ONCE__` (found by this gate). The shell starts a fight's page again 'if its data beat the options', and it told that
by the dealt board's kinds missing the district's kind. A board cut from a place, a zone or the street carries kinds of its own, so the
test can fire on a page that started with exactly the right orders: the fight dealt, its pictures asked and its board baked twice. SEEN
ONCE in this round's gate runs (a random valley: one fight counted twice by the phone, the cause not caught at the time); not seen on
seven valleys asked on purpose the old way. NOW the fight's page notes which orders its start read (FIGHT_UI.startedWith) and the shell
starts it again only when they were not the fight's. Four gate runs since: one start each, no restart. Switch: window.__NF_RESTART_BY_KIND.

## AFTER, THE CLEAN A/B (the final build; the valley and the die pinned, the same board every run; mobile data; the card read 4 s)

| | the page made at the fight | read while he reads the card |
|---|---:|---:|
| the fight up after ENGAGE (the camera's own mark) | 12.0, 11.0 s | 8.8, 9.1 s |
| the fight page's start after ENGAGE | 8.2, 7.2 s | 3.6, 2.9 s |
| its board baked | 11.9, 11.4 s | 9.0, 7.8 s |
| tasks over 50 ms, ENGAGE to up | 4.3, 4.1 s | 3.4, 3.2 s |
| while the card was up (4 s): tasks over 50 ms, the longest | 0.54, 0.52 s; 240, 234 ms | 0.95, 1.09 s; 293, 278 ms |

## AFTER, THE FIRST FIFTEEN RUNS (the die pinned, the valley not: the board changed run to run)

| | the page made at the fight | read while he reads the card |
|---|---:|---:|
| mobile data: the fight up after ENGAGE | 11.9, 22.5, 23.3, 17.0, 21.7 s (19.3) | 14.7, 17.7, 19.6, 9.6, 21.0, 23.1 s (17.6) |
| wifi: the fight up after ENGAGE | 20.5, 17.2 s | 13.6, 16.7 s |
| all fifteen, the mean | 19.2 s | 17.0 s |
| the fight page's start after ENGAGE | 7.0, 7.2, 8.5, 8.6 s | 3.5, 3.5, 3.6, 4.3 s (8.1 once: a 2.5 s task in the dive held it) |
| tasks over 50 ms, ENGAGE to up | 3.7, 5.7, 5.2, 5.9, 4.1 s (4.9) | 2.7, 3.5, 3.9, 4.2, 6.3 s (4.1) |
| while the card is up (3 s): tasks over 50 ms, the longest | 0.5 to 0.7 s, 233 to 363 ms | 1.0 s, 232 to 395 ms |

WHAT IT MEANS. On one board (the clean A/B) the fight is up 2.5 s sooner after ENGAGE, 12.0 and 11.0 s down to 8.8 and 9.1 s. Over
the fifteen mixed boards: the fight now starts about 4 s sooner after ENGAGE, every time but once. The board lands about 2 s sooner on the mean,
less than the 4 s, because on a phone's line the board's 5 to 6 MB of pictures are the wall: asked 4 s sooner, they share the line with
what is still arriving and take longer (7 to 8 s against 4 to 6 s). The card's 3 s carries 0.4 s more work, no task over 0.4 s.

## WHAT IS LEFT, NAMED

- THE BOARD'S PICTURES, 5 to 6 MB a fight: each board reads six whole block pictures (about 600 KB each) for a few tiles of each. A
  board's ground packed the way the men's sheets are (RUN 10/25 __THE_SHEETS_ARE_PACKED__) is the root: COMBAT (the ground's files).
- THE DEAL AT THE CARD (PLUMBER's next pipe): the die is picked by the shell at the hand-over and the hand-over dresses the message
  (the hour, the cell's ground and template) only after ENGAGE; picked and dressed at the card, the hidden page could deal the board
  and ask its pictures while he reads, so they cross the line before ENGAGE.
- The board's draw after its pictures (1.8 to 3.7 s at 4x, one chain): COMBAT's bake (the camp's page already breathes between its
  halves, __THE_BAKE_DOES_NOT_FREEZE__).
- The camera's come-down: its worst frame about 1 s at 4x both ways (MOTION's dive draws the map's pictures at each stop).

Gate: THE FIGHT IS READ WHILE HE READS THE CARD (gates/the_fight_is_read_while_he_reads_the_card_gate.js), 15/0; its plant (the old
way) finds no hidden page.
