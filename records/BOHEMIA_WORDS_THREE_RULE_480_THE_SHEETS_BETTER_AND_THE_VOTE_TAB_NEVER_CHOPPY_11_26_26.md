# WORDS THREE: RULE 480, THE SHEETS BETTER AND THE VOTE TAB NEVER CHOPPY (11/26/26)

VAMILY rule 480(b)(c)(d) (Paolo 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never
choppy for nothing lets go'), 461(c) amended, 467 amended, 465; ask row 723. The coordinator's round: improve the homework sheets
already made (six to eight, 38 cards), the VOTE tab opens and scrolls the sheets with no hitch, nothing new beyond that.
NOTHING IN THE GAME'S DIALOGUE WAS REWRITTEN (rule 465): THE VOICE HOLDS 11/0, 0 of 15 mouths open. He has not answered any of the 38.

## 0. THE ANSWER FIRST

1. THE VOTE TAB, MEASURED FIRST on a phone 390 x 844 with the CPU slowed four times, walked like a thumb (open, scroll the first
   screen's cards down to MORE, tap MORE, scroll every homework card behind it):
   - SCROLLING HIS SHEETS was already smooth: 413 frames at 60 fps, worst 16.8 ms.
   - THE OPEN was not: 3 to 5 frames past 50 ms, worst 167 ms (one cold run 867 ms). Three causes, each measured on its own:
     (a) the 1.9 MB registry turned from bytes into text in one task as its last byte landed (32 + 22 ms of an 89 ms task; parsing
     it is only 18 ms); (b) the first cards built and laid out in one frame (21 + 46 ms); (c) the YES list under the comment box,
     608 lines and 36,194 px far below the fold, laid out in one frame (126 ms forced; 170 to 230 ms in the walk).
   - THE TAP ON MORE held one frame 167 to 183 ms (every row rebuilt and laid out).
2. FIXED, in slices/BOHEMIA_VOTE_TAB.html (RUN TWO's and UI's page; nothing removed, every new piece falls back to the old way):
   - a card and a YES line are laid out only near the glass (content-visibility); the YES list's space is set from its own count so
     the page is the same height before it is reached. Laying out the whole YES box at once only moved its frame to the scroll
     (167 ms at y 5520), so it is line by line.
   - the registry is read and turned into text off the screen's thread (a worker made from the page itself, nothing new on disk);
     the screen's thread takes the text over, waits a frame, parses (18 ms), waits a frame, draws. Here a file lands in one 1.5 MB
     piece, so reading it as a stream alone did not split it (measured; the stream reader stays as the fallback).
   - the first cards are built off the page and come onto the glass a card a frame; MORE the same.
   - the gates' stand-in page (no frames, no worker, no URL) takes the old way, every step guarded.
3. AFTER, the same walk, four runs: OPEN worst 33 ms, 58 to 59 fps; DOWN to MORE worst 33 to 50 ms; the tap on MORE worst 33 to 50
   ms; THE SHEETS 60 fps, worst 16.8 ms; 0 frames past 50 ms in any run, 0 page errors. Three refreshes read 50.0 to 50.1 ms on the
   page's frame clock, so the gate counts past 50.5 ms.
4. A NEW GATE, THE VOTE TAB IS NEVER CHOPPY (gates/the_vote_tab_never_choppy_gate.js, in the suite, runs alone): N1 open, N2 down to
   MORE, N3 the tap on MORE, N4 every homework card behind MORE, each no frame past 50 ms and 55 fps or better; N5 the fixes in the
   page; N6 no page error; a part that hitches is walked again and is red only when both walks hitch. PLANT: the tab with the fixes
   taken out is served instead and is caught at the open (frames of 83, 133, 167 ms). 7/0, twice.
5. THE SHEETS, every one of the 38 tries read against THE VOICE again; four fixed:
   - 6.1 the dam's turbine man: our try promised a flat 119; the job's own deal is 'up to 119, part of it for every crew you stop'.
     Now: 'I pay out of the turbine money, up to 119 batteries, and more of it the more of those crews you put down on the way.'
   - 6.10 the mechanic: 'The Machinist' back to THE MACHINIST, the way the game and card 7.8 write a boss.
   - 7.11 what comes back after you dig the girl out: our try was a warm 'Don't worry' from nobody. His own answer on the same kind
     of card (3.3) gave it a mouth that sneers: 'What do you want fucking cookie?'. Now a neighbour at her fence: 'That little girl
     ran home without even saying thanks. What, you want a fucking parade? Relax. The whole town already knows it was you who dug her
     out.'
   - 8.8 Doña Fausta: our try still said 'is this ground ours' and 'guests forever', the speech English he asked 'what does that
     mean' about. Now: 'But sooner or later you gotta tell everybody, out loud, that this block is ours too. We're not gonna live as
     your damn guests forever.' (the card's own next choice is '(say it is ours, out loud)').
   Still: every card shows our try; 32 of 38 curse in full (10 of 12, 10 of 12, 12 of 14); the 6 clean ones each say why; no
   bleep, never 'it pays', no new Spanish, no fashion name, no cone hat. The four pictures redrawn; the queue unchanged (six at 6 to
   17, seven 18 to 29, eight 30 to 43 behind MORE on a fresh phone). On the real tab upright and sideways: 38 of 38 pictures open,
   0 errors. THE VOICE IS HIS WORDS 16/0; HIS ANSWER IS KEPT 15/0; the sheet checks 06/07/08 green; THE VOICE page's part three
   describes the new 7.11 and 8.8.
6. THE OTHER VOTE TAB GATES, against clean main: THE VOTE TAB GATE 61/5 (the same five: other lanes' whys, one art mark, the alpha's
   landing three); HIS YESES IN THE DEMO 15/0; THE CARD I NAME IS ON HIS SCREEN 24/2 (the same two on main: the coordinator's named
   ids).

## 1. WEAK, SAID

- Measured on this box's headless browser with the CPU slowed four times, not on his phone; EYES walks it on the slowed phone.
- The cards now come onto the glass a card a frame, about 50 ms from first to last; nobody should see it, and nothing is drawn
  differently.
- The YES list's height before it is reached is an estimate (59.5 px a line); when he scrolls to it, it settles to its real height.

## 2. NEXT

His answers on sheets six, seven and eight, folded the same way; nothing into the game until he says he is done.

[bb Battle Brothers' menus never stall on a long list; ours stalled on 608 lines nobody could see]
[analog horror: 'What, you want a fucking parade?' (card 7.11)]
