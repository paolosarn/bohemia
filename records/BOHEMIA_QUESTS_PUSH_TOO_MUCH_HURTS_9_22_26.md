# PUSHING TOO MUCH NOW HURTS, AND IT NEVER DID BEFORE
## QUESTS round 47, row [haggle like bb], 9/22/26

> PAOLO 9/22, voting ARGUING THE PRICE up: "do it the same way Battle Brothers
> does it: push too much hurts reputation and shit. Nothing less than Battle
> Brothers."

## FIRST, THE CORRECTION I OWE HIM

Two of my three vote items were voted DOWN, and rule 29 says why in his words:
**"boring asf... idk what I was reading... no more cards with quest, just make an
actual quest, make the pixels, make the sound."** I had been registering TEXT
PAGES. That was the wrong way to cook and this round does not do it: the thing
is in the game, and there is no page to read.

## WHAT WAS MEASURED BEFORE ANYTHING WAS BUILT

    the mark's delta                      0
    weight for 'pushed_the_price'         NONE   (forceOf: unruled = weightless)
    a row in the reaction table           NONE   (remembered and MUTE)
    deeds ever delivered                  ZERO

**THE FOURTH LINE IS THE ONE THAT MATTERS.** `ctHaggleMark` published into
`MINDS`, and **`MINDS` does not exist in that file** (only `CT_MINDS` does). Every
call threw on its first argument, inside its own `try`, and returned null. Under
that were two more faults, each fatal on its own:

- actor `'player'`, where the whole world reads `'@'`, so the deed would have been
  stored and never spoken about
- `where` passed a **string**, where `publish` calls `where(owner)` to get a
  position

Three ways wrong in four lines, silent for as long as it has existed. So "push
too much hurts reputation" was not one missing number. It was a call that never
ran.

**AND THE SAME FOUR LINES WERE COPY-PASTED INTO THE CLAIM MARK**, so catching
somebody in a lie has never left a mark either. Both were mine. There is one
deliverer now, not two copies.

## TWO MORE THINGS THE MEASUREMENT FOUND

**A FACTION-LESS DEED CAN NEVER GO THROUGH `publish()`.** It filters every witness
through `sameFaction`, which returns false the moment either side is null. That
is correct for a faction act, and pushing a man on his price is done to a PERSON.
Measured: witnesses 0 with four people standing in front of me. It goes through
`witness()` underneath now, with the same clout grading.

**BOTH CORPUS-LOAD CALLS RUN BEFORE THE HAGGLE MODULE IS INLINED.** So the first
cut derived nothing at boot, and worked perfectly every time a probe asked for
it, **because asking created it.** That is exactly how this class of bug hides
from its own author. It is order-independent now.

There was also a plain hoisting wipe on the way: `var CT_PUSH_COST = null;`
executing *below* a call that had already set it, throwing the answer away. This
file already carries a comment about the same trap costing another lane a
morning.

## WHAT IT COSTS, AND THE NUMBER IS HIS

    reckless deeds he has authored     23
    of those, negative                 12
    median of those                    -12      <- the cost of pushing
    the corpus's own divisor           10
    the weight it lands at             -1.2

The cost is the **median of his own negative #reckless deltas**, computed off the
83 deeds he has written, and the weight rides the divisor `loadCorpus` computes
off the same corpus. Nothing is typed: the gate fails if the number appears in
the module. If he rewrites a quest, this follows him. No corpus, no punishment.

No scaling curve, on purpose: there are two asks of room and the third ends it,
so there is exactly one "too far" state and a curve over it would be a magnitude
nobody ruled.

## AND SOMEBODY SAYS IT

`pushed_the_price` had a row in neither table, and that table's own comment warns
that a kind needs a row in both "or it is remembered and mute". It has one now:

    saw    "Squeezed him and he walked. Now nobody has it."
    heard  "Heard somebody pushed the price till it was gone."

A reckless deed carries 24 of reach and a person can be overheard within 6, so
the people who saw you do it are usually across the street at that moment and
say it when you next walk near them. That is the shadow of what you did working
as designed, not a gap.

## MEASURED ON THE ALPHA, THROUGH THE ONE DRIVER
    cost at boot   -12      weight  -1.2      witnesses  1-2
    opinions       [0,0,0,0]  ->  [0,0,0,-1.2]
    page errors    0

## PROVED TO BITE
Typing the number into the module is caught. Restoring the undefined-`MINDS`
publish turns three checks red, including the two that matter.

## STILL TRUE AND NOT FIXED HERE
The argument itself is only reachable from the card handler Paolo deleted, so a
player cannot push a price on the glass yet. The cost is real and wired; the way
in is the next piece.

## PROOF
HAGGLE LIKE BB 20/0, registered. WIRE THE DOOR 15/0.
