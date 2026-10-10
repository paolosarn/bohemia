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
