# RUN FOUR: OPTIMIZE LOOT, AND THE LOOT'S TAPS (rows [optimize loot] and [one tap selects, two taps take]; rules 244, 249, 250; 10/26/26)

## HIS WORDS
Rule 244 (Paolo 10/26, LOCKED): 'there should be an optimize loot button at the end of battle screen... if my inventory is full but
there are ten more things that could be taken... it takes the things in your inventory that are sellable at the lowest price and
replaces them with the more expensive loot.' Rule 249 (Paolo 10/26, LOCKED): 'when I click something once in a shop or an inventory
it should be highlighted, at least on the outside... I just double click it.' Rule 250 (Paolo 10/26, LOCKED): 'as I click through the
items I should just be able to click them and the things don't change locations.' Record of the ruling:
records/BOHEMIA_PAOLO_OPTIMIZE_LOOT_AND_THE_AFTERMATH_BEHIND_THE_LOOT_AND_THE_FACES_BREATHE_10_26_26.md.

## MEASURED BEFORE (main e3bd072b, slices/BOHEMIA_SPOILS_SCREEN.html)
- LOOT ALL took the ground in its own order and stopped at the cap. With a full stash the only way to a better one was a tap to put a
  piece back and a tap to take one, piece by piece.
- No price anywhere on the end screen: he could not tell the cheap piece from the dear one without leaving for a town.
- ONE tap moved a piece at once (ground to stash, stash to ground); nothing selected, nothing shown first.
- What is left of a worn piece was a number in the box's corner ('42%').

## HOW BATTLE BROTHERS DOES IT ([bb], recall, marked)
The loot screen shows the stash beside the found items; LOOT ALL fills what room there is; a better piece with a full stash is a drag
of your junk out and the better piece in, one at a time. No button does it. A right click moves a piece; a left click picks it up.

## WHAT IS BUILT
1. THE SWAP (engine/bohemia_spoils.js optimize, pure): every piece he did not choose (looted and not marked KEEP, or let go) and every
   piece on the ground ranked by what a town pays for it; the stash keeps the most valuable that fit; the cheapest go back on the
   ground for the dearest left, until nothing left beats the cheapest kept. A tie never swaps. A piece he keeps never changes its slot;
   a left piece's slot takes the best piece taken.
2. THE PRICE IS THE SHOP'S: sellBack(it, at) is the settlement screen's own sum (its worth, what is left of it, Battle Brothers'
   seventh, the standing's add, the trait's mult, floor 1). The gate cuts the shop's own sellBack and isJunk out of its file and runs
   them beside ours on 2,400 pieces at six towns: the same batteries, the same junk.
3. ONE ORDER AT EVERY TOWN (written down so nobody has to ask): a town moves every piece's price by the same cut and the same trait,
   and the floor never reverses two prices, so the piece worth more is never paid less anywhere. The swap is the same whichever town
   is nearest; only the batteries it is worth there change. The screen shows the gain at the plain price unless the game hands it the
   nearest town's standing and trait (open({sell:{add, mult}})); nothing hands them over yet, so the shown gain is the plain price's.
4. WHAT NEVER MOVES (rule 244(c)): a KEEP piece as the shop marks it (a piece he bought or took off his own men is his until he lets it
   go, a looted one is junk until he marks it KEEP: the shop's own isJunk, so the same pieces wear KEEP in the shop and here), and
   anything worn, held, bagged or a job's (worn, held, bagged, equipped, job, quest). What his men wear and hold is not in the stash at
   all (the crew screen keeps it on the man); a job's cargo is counted on the job, not in the bag; the guard is there for the day it is.
5. THE BUTTON (rule 244(a)(d)): OPTIMIZE LOOT beside LOOT ALL, the same size, whenever loot is left that will not all fit (with a
   full stash, any loot left). It says its gain before the tap: a battery and a green up arrow by how much (rule 224); THE BEST YOU
   CAN CARRY and dim when nothing would change. On a phone it rides the bottom bar with LOOT ALL and LEAVE (LEAVE gives up 44 px while
   the two stand there). One tap: the strip shows a red down arrow and what it left, a green up arrow and what it took (pictures, four
   each and '+n'), a battery and the gain; the new pieces are lit gold in the stash, the left ones marked with a dashed rust edge on the
   ground. The button is then UNDO ('as it was') until he leaves: every piece back in its slot, exactly, the saved bag too.
6. THE STRIP (rules 249(a), 250(a)): one line, always there at one size (58 px), printed receipt: what the screen says, the piece he
   picked (its picture, its name, what is left of it as a fill, where it came from, KEEP when it is, and what a town pays: a battery
   and the count), or what OPTIMIZE did. On a phone it rides just over the bar, under his thumb.
7. ONE TAP SELECTS, TWO TAPS TAKE (rule 249): one tap lights the box (a bright outline, no box moves a pixel: measured on every slot,
   button and count) and fills the strip; a second tap inside 450 ms, a double click, or a right click takes it or puts it back. 244's
   UNDO covers OPTIMIZE; two taps back cover a single move.
8. WHAT IS LEFT OF A PIECE is a fill along the foot of its box (green, amber under two thirds, rust under one third); the number is a
   long press or a hover away (rule 224(b)).

## THE GATE: gates/optimize_loot_gate.js (in the suite as OPTIMIZE LOOT), 22/0 at registration
P1 600 rolled stashes against every possible stash (all subsets), the plain price and five towns: 3,600 of 3,600 the best. P2 the
same pick at every town, 3,000 of 3,000. P3 nothing protected moved, nothing lost, never over the cap; a tie never swaps; a bought
piece stays. P4 the shop's own sellBack and isJunk agree on 2,400 of 2,400. S1 to S6 on a phone (a finger) and a computer (a mouse),
a stash of 36 (30 looted junk, 3 KEEP, 3 bought) and ten on the ground: the button beside LOOT ALL with its gain; one real tap makes
the best stash (98 of 98 batteries), every protected piece in its slot, the saved bag the stash; the strip in pictures; UNDO exact;
one tap lights and moves nothing; two taps / a double click / a right click take it. D1 THE DEMO: a full stash, a road fight won
through the map's own door, OPTIMIZE on the spoils screen the game opened, a real tap: the best stash (40 of 40), three better
pieces taken.
RE-AIMED, said here: THE SPOILS GATE's S1 put a piece back and took one with ONE tap each; rule 249 makes that two taps, and the leg
now taps twice.

## WHAT I DID NOT DO, AND WHY
- The nearest town's standing and trait do not reach the end screen (the shell does not know the nearest town's rolled traits; the
  settlement screen rolls them on its own). The pick is right everywhere (point 3); only the shown gain is the plain price's.
- The crew strip with each man's arrow for the picked piece (rule 250(c)) is the shop's (RUN TWO); the loot strip shows the piece's
  own facts. The per-man arrows for a looted piece wait on UI THREE's one stat component.

## [bb] Battle Brothers' loot screen: LOOT ALL to the room there is, the rest a drag at a time; ours does the drag for him, by the
shop's own price, and gives it back with one tap.
## [analog horror] what you leave on the ground stays marked: a dashed rust edge round each piece you walked away from.
