# AN ASK, IN A MOUTH
## QUESTS round 44, row [a person asks], 9/21/26

> PAOLO 9/20, rule 19: "Unless the quest has actors and I moved to things and
> picked things up in the overworld, you can't just be putting things on the
> screen and pretend they're the quest. It has to be people, characters, items
> to pick up, locations to go, text coming from people's voice."

## TWO LANES SHIPPED INTO THIS ROW, SO I RE-MEASURED INSTEAD OF ASSUMING

PEOPLE landed `[face at the door]` and `[a name]` since the last round, and
`[a name]`'s own commit cites this lane's measurement as its cause. Rule 12 says
a named dependency is a premise, so the four blockers were re-measured on the
walked city rather than crossed off:

| round 42 | now |
|---|---|
| a face pipe: none | **`ctFaceAsk` is live, faces come through the shell** |
| 0 of 21 at the door have a name | still 0 of 21 |
| nothing draws a face where a person speaks | still nothing |
| nobody at the door can speak | still nobody |
| a pop-up card is first on screen | still a pop-up card |

## AND THE MEASUREMENT FOUND SOMETHING BETTER THAN THE ROW ASSUMED

The generator in this lane has made real asks out of the running valley since
9/6. At minute one it makes three:

    shelf_refills        food         47,50    ->  "A shelf fills back up."
    light_comes_back     circuit 757  47,49    ->  "A light comes back on."
    block_changes_hands  Church       50,46    ->  "A block changes hands."

**EVERY ONE IS ATTRIBUTED TO `P:city:12:12:0`, WHO IS STANDING ON THE WAKING
BLOCK.** The person at his door already exists and already wants something. The
row reads as though somebody has to be invented and placed there. Nobody does.

What the valley could not do was **say it**. This lane's own handoff admitted it:
"NOT ON SCREEN YET (mechanism only)". Three real jobs, generated from what is
actually wrong near him, and no mouth anywhere.

## SO THE COOK IS THE MOUTH AND NOTHING ELSE

`engine/bohemia_ask_spoken.js` takes an ask the generator already made and
answers with what that person SAYS. It invents no ask, picks no ask, and moves
nobody.

    Shelf's been empty since the weekend and nobody's saying when.
    Bring back whatever you can carry. It's at the market, two streets down.
      I'll go.  /  Not right now.
      -> A shelf fills back up.

    Breaker's been down a while and nobody's gone in to throw it.
    Throw it back if you're walking that way. It's one street over, past the storefronts.
      -> A light comes back on.

    Fence moved. Nobody moved it while anybody was looking.
    Go stand on it before somebody paints it. It's up at the fence on the far corner.
      -> A block changes hands.

Person, place, thing, visible result, in a voice. The closing promise is the
generator's own `visible` string **byte for byte**, so the sentence on screen
and the sentence in the ledger cannot drift into two different promises.

## WHAT IT REFUSES, AND WHY EACH REFUSAL EXISTS

- **A change with no words gets no words.** A friendly fallback sentence for
  anything is exactly how an unwired system looks wired, so an unknown change is
  refused BY NAME.
- **A COORDINATE IS NOT AN ADDRESS.** The generator's `where` is a raw cell, so a
  caller must hand over a human phrase and a bare cell is refused rather than
  read aloud. This lane shipped that ruling once already, after a card printed
  "HERE, 6205 6269" at him.
- **Refusing the job gets a real line**, never a greyed-out row.

## THREE DEFECTS IN MY OWN CUT, ALL FOUND BY READING THE OUTPUT AFTER IT WENT GREEN

1. **The first version said "It's at 47,49."** The exact defect this lane already
   ruled against, reintroduced by me. Now gated, not remembered.
2. **A check that ended in `|| true`** and therefore could never fail. A check
   that cannot fail is decoration; replaced with a behavioural one.
3. **The shelf ask read "market" twice** and the exactly-once check PASSED,
   because it compared the whole place phrase and not the words inside it. The
   check now fails on any meaningful place word repeated, and that tightening was
   proved against the exact line that had slipped past it.

The third is the one worth carrying: **a green check is not a read line.** The
gate was right about what it measured and the sentence was still bad.

## PROVED TO BITE
Four bugs planted in the real module, each caught by name: a filler fallback
(refusal count 0/2), the place said twice, a coordinate accepted (two checks),
and a refusal with no line (all four changes named).

## PROOF
ASK HAS A MOUTH 22/0, registered in the suite. VOTE TAB 28/0. Driven on the real
surface: the row opens in the tab and the three cards carry the generator's own
three promises.
