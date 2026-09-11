# THE RAIL STOPPED COLLIDING, AND IT WAS NEVER THE OFFSET (9/11/26, UI lane 11, row [rail collides])

PAOLO 9/8, from his own frame (`records/target/PAOLO_THE_RAIL_COLLIDES_9_8_26.jpg`):

> "what is this part of the UI? it's colliding with each other, what's up with that?"

The day's job card, SCAVENGE · 9H, sitting on top of DROP IN and WHOLE MAP.

Gate: `gates/city_rail_gate.js`, **8 ok, 0 failed**, mutation-proved.
Picture: `slices/BOHEMIA_THE_LEFT_RAIL_9_11_26.html`, five layouts.

## MEASURED BEFORE ANYTHING WAS TOUCHED
On the real page, phone size, city screen, job card showing:

    workbtn   144x46   position:absolute   in #stage
    sleepbtn   44x14   position:static     in #blstack
    bikebtn    44x14   position:static     in #blstack
    fitbtn     52x14   position:static     in #blstack
    modechip   44x14   position:static     in #blstack
    ... and four more, all static, all in the column

    OVERLAPS: workbtn x fitbtn 52x11 | workbtn x modechip 44x5

Eight of the nine things in that rail were children of one flex column that lays them
out. **The job card was the one that was not.** It carried its own `left:6px;
bottom:107px` from the round the shift work added it. Those two overlaps are the two
chips buried in his photograph.

## THE BUG WAS NOT THE OFFSET, IT WAS THAT SOMETHING NEW ARRIVED AND NOBODY TOLD THE COLUMN
A hand-typed offset is correct on the day it is typed and wrong the moment anything else
exists at that height. The file even carried the scar of the last time this happened --
a comment on another element reading *"sits well above the DROP IN pad so it collides with
neither"*, which is this same bug fixed once, by hand, for one element.

**So nothing was nudged.** One name went into the column's adopt list, and the card's own
offset was deleted rather than adjusted. Nine things in the column, all static, all laid
out by it. **Zero overlaps.**

## AND IT HAD ESCAPED THE HALF-SIZE ORDER TOO, THE SAME WAY
Once the column had it, the card drew **144x46 in a rail of 44x14 chips** -- more than
three times everything around it, on a screen he ordered halved. Same root cause one layer
up: a second list owns the sizes, and nobody told that one either. Two lists, one miss
each, one photograph. The card is **65x14** now, in line with the rest.

## WHAT THE GATE ACTUALLY ASSERTS, AND WHY THE SECOND ONE MATTERS MORE
1. **Nothing overlaps.** Every visible pair on the city screen, with the card forced
   showing -- a gate that only measures the easy state is not measuring the bug.
2. **Every chip in the rail is laid out BY the rail.** Position static, no hand-typed
   offset, and the rail's contents are read off the page rather than listed in the gate
   (a hardcoded list here would go stale exactly the way the column's own list did).
   **This is the assertion that catches the NEXT element somebody adds without telling the
   column** -- it fails in the suite instead of in a photograph he has to send.
3. No chip is more than twice the height of the smallest, which holds the half-size order.

**MUTATION-PROVED.** Put the card back the way it was and the gate reports his frame
verbatim: `fitbtn x workbtn 52x11 | modechip x workbtn 44x5`, plus the card no longer in
the column and no longer static. 5 ok, 3 failed.

## TWENTY-ONE DEAD ELEMENTS DELETED
The markup carried **twenty-two** copies of `<div id="footing">`, accumulated from merges.
Duplicate ids are invalid, and the only code that reads it uses `getElementById`, which
returns the first and can never see the other twenty-one. They are gone. One remains.

## ALSO CAUGHT BY LOOKING, NOT BY A GATE
The options sheet's first cut drew a 300-tall screen while a phone is 844, so the spread
column ran off the top of it and **option A -- the one actually in the game -- looked like
it overflowed into the top bar.** It does not. Redrawn as whole 390x844 phones scaled down.
The same fault the top-bar sheet paid for, and the reason the cost line under option A was
then wrong too ("almost the whole height" when the picture plainly shows the bottom third);
both corrected to what the picture shows.

## THE PICTURE
Five layouts for that side, each a whole phone at true size: **A** one column spread (what
shipped), **B** the same column pulled tight, **C** split between both bottom corners,
**D** the job moved into the top bar as a tag, **E** everything behind one MORE button.
