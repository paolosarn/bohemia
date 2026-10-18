# TAKE THE NEXT PART (LIFE + CITY, 10/10/26, [take the next part])

Rule 43 (Paolo 9/29): what you hold grows by taking. Rule 86 (the map is for looks): it happens in the
settlement screen, never drawn on the map or the board.

## What ships
- At a place you do not hold, the settlement screen's BUILD says "This is not our ground. We build where
  we hold." and offers ONE thing: **Take it** (a fight at their gate). Draft words.
- Take it posts `take` to the map. The map opens OUR raid on that base in FACTIONS' ledger
  (`openRaid` by YOU; the same ledger a crew uses on you, the other way), closes the screen and hands one
  fight over the one door (`cityHandOver`, label "Taking X").
- A win: `closeRaid` outcome `taken`; the base is YOU's; the phone says "X is ours now. We can build there.";
  the next open hands the screen `held` and BUILD shows the eight-thing list.
- A loss: nothing written (DEATH IS A RELOAD, Paolo 7/26); our raid stays open at their gate, and Take it
  goes back to the same raid instead of opening a new one.
- Bug found and fixed while gating: a refused handover (the camera still mid-zoom) closed OUR raid as
  "held", which would have locked the place for the year. A retry now never closes the raid it reuses.

## BB first
Battle Brothers never lets you own a settlement; holdings are the nobles'. Our twist (rule 43, his) is that
the company becomes a house. The shape borrowed is BB's: one contract-like fight at a named place, the
result written to the world's ledger, the world reads the ledger. Contracts, bosses and deals as other ways
in are the next row, [taken by a deal].

## Proof
- Gate TAKE THE NEXT PART 9/0: the alpha through the shared driver, real touches in the settlement frame,
  a win run and a loss run; the fight ends through the shell's own way home.
- VOTE: slices/vote/LIFECITY_TAKE_THE_NEXT_PART_10_10.png (Take it, the fight at their gate, the build list
  after the win), cooked by tools/bohemia_take_the_next_part_cook.js/.py.

## Analog horror line
The words are a man's voice at a gate, no fanfare; the fight opens in the clouds like every fight.

## HELD (10/10, rule 88, the round after)
Rule 88 (LOOKS FIRST, FEATURES HOLD, 7fb539be, 01:03) put LIFE+CITY on hold 43 minutes before this shipped
(b88a6c36, 01:46). The lane read the front page at the start of its round only. Undone the round it was caught:
- Take it is OFF in the game: `window.BUILD_TAKE_ON = false` in the settlement screen (tools/bohemia_settlement_build_patch.py);
  a place you do not hold says only "This is not our ground. We build where we hold.", as before.
- The VOTE item lifecity-take-the-next-part-10-10 is RETRACTED, unjudged (tools/bohemia_vote_registry_round14.py).
- The map's raid machinery and the gate stay; the gate switches the flag on for itself (10/0) and asserts it is off
  in the game. One flag lifts it when he lifts the hold.
- The retry fix (a refused handover no longer closes the raid it reused) stays: it only matters once Take it is on.
Lesson: re-read the front page before the push, not only before the claim.
