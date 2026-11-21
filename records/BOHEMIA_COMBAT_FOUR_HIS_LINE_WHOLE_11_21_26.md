# COMBAT FOUR: HIS LINE WHOLE (BUILD 11/21 - HIS LINE WHOLE)

11/21/26. COMBAT FOUR, a bug he can feel first (rule 461): FIGHT SCREEN 3's find routed to this lane, the fight's camera
(handoffs/COMBAT_THREE.md, NOTE 11/21 FROM FIGHT SCREEN 3; its record records/BOHEMIA_FIGHT_SCREEN_THE_LAST_HIT_ON_THE_CARD_11_21_26.md).
Rules 104a, 288(b), his NO ATARI vote (the far stop is a floor: never further out, never a smaller man), 441. Ask row 651.

## THE FIND, MEASURED AGAIN HERE (a copy of FIGHT SCREEN's walk that also reads who each man off the glass is and whether he can be seen)
(1) UPRIGHT, IN THE LINEUP, AT THE FARTHEST ZOOM, the alpha, a pack (beasts, three against three): REPRODUCED, 1 walk of 2. The board is 20
tiles wide; his line stood on column 4 and theirs on column 15, eleven tiles apart; at the far stop (zoom 0.203, the ring around the board
filling the glass top to bottom, so it can go no further out without black) the open area above the phone is 390 points, twelve tiles. The
frame was centred between the lines, so it cut both ends: two of his men and one of theirs 6 points past the glass (a man's whole figure,
his body and what he carries, 0.3 of his height either side), their bars cut. Every one of them a man he can see.
(2) ON ITS SIDE, ON HIS TURN (zoom 0.508): REPRODUCED EXACTLY (the demo on its side, 'two of theirs 117 and 77 points off'), and BOTH ARE MEN
HE CANNOT SEE: out of his crew's sight (FIGHT.shown false, by day), so the fight does not draw them and does not frame them, by design (the
dark, rule 104a's 'every fighter he can see'). Nothing on his glass is cut. FOR FIGHT SCREEN: the walk's MEN OFF counts every man on the
field; counting only FIGHT.shown(v) men reads what he sees. 7 whole walks on the alpha and the demo, both ways up (and 4 more to the
lineup alone): every other man off the glass was one he cannot see, but these:
- right after FIGHT is pressed, twice (the alpha upright, the demo on its side), a man of theirs who had just come into sight was 808 and
  107 points off while the camera began to ease out to him; the next still had no man he can see off the glass. The camera eases out to a man walking out of the dark in a beat, never a snap
  (gate THE FIGHT AS CLOSE AS IT CAN BE leg 2 holds this): a moment, not a defect.
- once on AUTO, a man at the glass's very edge (0 points past).

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html, the camera's fitBoth, and nothing else)
`hisLineWhole`: while he sets his line, where even the far stop cannot hold every man, the frame slides only as far as it must for every
one of his men to stand whole on the glass (the fight's own allFramed measure, and a point), and what does not fit goes off their side. A
frame that holds everyone is never touched (the function hands it back as it came). The far stop is unchanged (his NO ATARI vote), and the
man is the same size.
On the alpha, the same walk (upright, a pack, the lineup): the camera slid 7 points; his three men whole; one of theirs 13 points past the
right edge. The fight page in the gate: slid 8.3 points, his outermost man 1 point inside the edge, theirs up to 15.7 past.
SAID PLAINLY: both lines whole at once on that board, upright, cannot be had without either a smaller man (NO ATARI) or black past the map
(his eleventh votes) or the lines set closer (the five-hex gap is Battle Brothers' floor; eleven is this board's deploy). His line wins: it is
the line he is dragging.
NOT DONE: in the fight itself (after FIGHT) the far-stop frame still centres on everyone; the lines close in a round or two and the
camera comes in, and no seen man was measured off there. And at the far stop upright the camera cannot pan up or down (the ring fills the
glass top to bottom), so a man stood on the board's last rows would sit under the phone; no real lineup stands there (the lines are set
in the middle rows).

## THE GATE (gates/the_fight_his_line_whole_gate.js, new, in the suite as THE FIGHT HIS LINE WHOLE: 6 passed, 0 failed, about 40 s)
The fight page upright (390 by 844, the phone up right), three of his against a pack of three, the lines stood eleven tiles apart: 1 the
frame at its far stop and too narrow for both; 2 every one of his men's whole figure inside the open area (-1, -1, -1); 3 slid only as far
as his outermost man needed (8.3 points), theirs take the rest (15.7); 4 their line six tiles off, the frame centred (0.0 points) and every
man on the glass. PLANTED: the slide taken out, his men 7.3 points past: leg 2 red.
THE FIGHT AS CLOSE AS IT CAN BE never stands in the lineup (its fights are on AUTO or set by hand past it): untouched by this.

## ON THE PAGE (rule 441; a copy of FIGHT SCREEN's walk, a pack of beasts, the lineup a second after it opens)
- THE ALPHA UPRIGHT: the camera slid 7 points; his three men whole; one of theirs 13 points past the right edge. Before (the same walk,
  twice): two of his and two of theirs 6 points past, centred.
- THE DEMO UPRIGHT, twice: his three men whole; theirs 16 to 33 points past the right edge. The demo's open area is a little taller
  (558 points against 516) so its far stop is a little closer (0.213 against 0.203) and the glass holds less of the board across: centred,
  as before, both lines stood 16 points past their edges, his men's bodies half off the glass. Their line is reached by a drag, the way
  everything that does not fit is (never by a smaller man).
- THE ALPHA ON ITS SIDE and THE DEMO ON ITS SIDE: the frame holds both lines (zoom 0.303 and 0.350, the far stops 0.174 and 0.192);
  nobody off; the frame untouched.
0 page errors in the six walks.
THE REBUILT FIGHT PLAYS: 142 passed, 13 failed; its lineup legs green on both boards ('he sets it seeing both lines', 'both teams stay on
the glass as it starts'). None of the 13 is in the lineup, where this change acts; the one camera leg among them is the phone on its side
on the Strip mid-fight, 23 of 132 with a man off, the same number COMBAT TWO's block names red on main (named for MOTION and UI there).

## FOR WHOEVER IS NEXT
FIGHT SCREEN's walk tool: filter MEN OFF by FIGHT.shown(v) (it is FIGHT SCREEN's tool; this lane did not edit it).
