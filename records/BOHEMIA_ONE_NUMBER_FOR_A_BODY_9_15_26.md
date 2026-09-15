# ONE NUMBER FOR A BODY
ANIMATION lane, 9/15/26. Rule 16, THE STEP IS A HOUSE (Paolo 9/15, LOCKED).
This lane's first measurement under his new ruling, and the smallest change that
serves it.

## HIS RULING, AND WHAT IT GIVES THIS LANE
laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md, his words:

> "I just entered combat and this is not at the scale that I needed it to be...
> even when it comes to traversing the city I want people to be larger, cause
> remember each tile is the size of a house... I want the player character and all
> characters' movements and enemies' movements to be larger at the same time."

Section 5 gives this lane exactly one job: **"ANIMATION: the rig at the new size,
the clips unchanged in content."** Section 3 gives the whole fleet one rule:
**"ONE NUMBER IN ONE PLACE... NOTHING IS BAKED ONCE. A second copy anywhere is the
bug."** Section 4 says each lane MEASURES FIRST and ships the smallest change.

## WHAT WAS MEASURED, BEFORE ANYTHING WAS TOUCHED
The rig renders at **112x112** and a standing body spans **98 rows**. The bake that
ships bodies to the street **halves that to 56** before it sends. Across eight
facings:

    dir | native px / colours / body rows | after the halve to 56 | colours kept
      N |                  2840 / 18 / 98 |        710 / 18 / 49  | 100%
     NE |                  2484 / 19 / 98 |        628 / 19 / 49  | 100%
      E |                  1710 / 21 / 98 |        425 / 20 / 49  |  95%
     SE |                  2396 / 21 / 98 |        599 / 21 / 49  | 100%
      S |                  2674 / 20 / 98 |        667 / 20 / 49  | 100%
     SW |                  2604 / 21 / 98 |        653 / 21 / 49  | 100%
      W |                  1633 / 21 / 98 |        408 / 20 / 49  |  95%
     NW |                  2398 / 19 / 98 |        601 / 19 / 49  | 100%

**The halve keeps 4,691 of 18,739 body pixels: 25%.** The body drops from 98 rows
to 49. **158 of 160 colours survive (99%)**, so nothing is lost to the palette --
three quarters of the RESOLUTION is thrown away. The city then doubles it back up
with Scale2x to draw it, inventing the pixels that were just discarded.

## AND IT WAS NOT A MISTAKE, IT WAS AN EXPIRED CONTRACT
The note above the bake says both exports "keep the size they PROMISE", and 56 was
the rig's NATIVE size when that promise was made. The rig later moved to 112
(RIG_RS 2). COMBAT got the benefit -- `bake112` stops upscaling once the frame
already arrives at 112 -- while the city kept being handed a half-size body,
because its contract still said 56. Nothing was broken until his ruling made the
cost real. **Reading the comment was what explained the number; measuring was what
made it matter.**

## THE SIX COPIES, AND THE SEVENTH
His rule says a second copy is the bug. On this lane's pipe the number lived in
**six** places: twice inside the bake, and in the `w`/`h` typed into each of the
five senders that post bodies to the city, the extra-cast append, the faction cast
and the run slice. **The seventh was the bake's own NAME**: a function called
`bake56` that bakes at a constant is the copy that misleads the next reader, so it
is `bakeCast` now.

## WHAT SHIPPED
`const CAST_PX=56;` and every one of those places asks it.

**At 56 this is byte-identical to what shipped before, and that was PROVED, not
asserted**: 48 baked frames (eight facings x three clips x bordered and
borderless) compared byte for byte through the real cast path against
origin/main. **48 identical, 0 different.** That is why it is safe to land before
RUN's step constant exists.

Growing the street's bodies is now **one edit**, and at 112 the halve stops
happening on its own, because `f.CW===CAST_PX` is true and the frame ships native.

**WHEN it grows is NOT this lane's call.** The law gives RUN the one constant and
gives this lane "the rig at the new size". Nothing about the street was changed
here; the pipe was made ready and the cost was measured so the decision is
informed.

## THE GATE
`gates/one_number_for_a_body_gate.js`, in the suite as **ONE NUMBER FOR A BODY**.
Nine claims. His ruling is read out of the law file, never copied in.

**The load-bearing claim is BEHAVIOURAL, not a source scan.** PLUMBER proved on
[suite runs] that a source scan cannot see a typed list once strings have to be
stripped, so this gate intercepts the real `postMessage` traffic and checks that
**what every sender PROMISES is what the bake actually SHIPS**.

**The city iframe is LAZY**, and that nearly made the claim vacuous. `#cityFrame`
does not exist until the CITY tab is opened, and every sender begins
`if(!fr||!fr.contentWindow)return false`, so the first cut of this gate caught
**zero senders and scored "0 of 0 agree" as a PASS**. The gate installs a target so
the real sender code runs, and **the sender count is now its own claim** -- the
same vacuous-control trap this lane already hit once on HEAD IN FRAME.

A CONTROL holds combat's separate 112 promise, which rule 16 does not touch from
here.

Five mutations, all behaving correctly:
  M1 the build before this round      -> 4 red
  M2 one sender left behind typing 56 -> the sender claim red
  M3 the constant moved to 112        -> **GREEN, and that is the design**: the gate
                                         forbids a SECOND COPY, never the ruling
                                         being executed. RUN can move the number.
  M4 the bake named after the number  -> 2 red
  M5 combat's 112 dragged along       -> the control red

## WHAT THIS LANE STILL OWES ON RULE 16
Its MODE line says: measure the eight facings at the new size before the redo batch
goes to the VOTE tab. The pipe is ready and the cost is known; the eight facings AT
the new size cannot be measured until RUN sets it, and inventing a size here would
be the second copy this whole round exists to remove.
