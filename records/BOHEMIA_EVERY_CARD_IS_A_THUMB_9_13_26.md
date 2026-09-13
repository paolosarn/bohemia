# EVERY CARD IS A THUMB, AND ONE CONTROL NO INSTRUMENT COULD EVER SEE
UI lane (11), row [every card] -- FOUR-BUTTONS-THAT-SPEND-AN-HOUR-WERE-31-PX. 9/13/26.
Routed here by the coordinator 9/13 from RUN [drop in] (9da188c2). Rule 14, THE FIVE MINUTES.
Sheet: slices/BOHEMIA_FIVE_WAYS_A_CHOICE_FITS_9_13_26.html

## THE ROW, AND WHY IT COULD NOT BE FIXED WHERE IT WAS FOUND
RUN measured the conversation's four choices at **31 px against the 44 px thumb law** and held
them to 44 **from the demo side, height only**. The demo is a CUT: under rule 14(a) only RUN
regenerates it, so a fix living there evaporates on the next cut. The cards live inside the city
frame, and a style in the shell cannot reach into an iframe. So the fix had to come here.

## MEASURED FIRST, ON THE REAL CARDS, THROUGH THE SYSTEM EVERY CARD USES
    the conversation's five choices     29 px tall   ->  44
    the day card's own choices          29 px tall   ->  44   (one was 37 px WIDE)
    the day card's SEND                 36 px tall   ->  44
    the phone's control                 36 px tall   ->  44

**It was never only the conversation card.** The day card was just as bad and nobody had
reported it, because `thumb_gate` -- this lane's own gate for this exact law -- had only ever
swept the first screen and the one card it opened for its chrome.

**REACH GROWS, INK DOES NOT**, which is his half-size order held exactly. The halving rule sets
`font-size` and `padding` with `!important`; `min-height` and `min-width` are neither, so the box
reaches 44 while the lettering stays small. That is the whole trick, and it is why this is
`min-*` and not `height`.

## *** AND THE ONE NO INSTRUMENT COULD EVER HAVE SEEN ***
`#cttalk` -- **the button that opens a conversation at all**, the single most important control
for meeting anybody in this game -- measured **184x36**. Nothing in this repo had ever measured
it.

Not because somebody forgot it. **Because it only exists while the player is standing next to a
person**, and every sweep in this repo looks at a fresh street where nobody is adjacent. The
button is not on screen to be found. A control that appears only in a state the instrument never
enters is invisible to that instrument, and it will stay invisible no matter how carefully the
list is written.

It was found by accident, while walking onto somebody to test a different thing. So the gate now
stands next to somebody **on purpose** and sweeps the street again from there.

## THE GATE, AND TWO REAL DEFECTS IN IT THAT THIS FOUND
`gates/thumb_gate.js` now opens a CONVERSATION (by walking onto a person the game placed, never
by setting a flag -- `ctOpen()` asks `ctAdjacent()` itself, and a control measured on a state the
game never reaches is a number about nothing), sweeps its choices, and sweeps the street again
while adjacent. **19 ok, 0 failed.**

**DEFECT ONE, IN THE SWEEP ITSELF: a card that scrolls hides its own controls from it.** The
sweep drops anything whose rect is outside the viewport -- right for the street, wrong inside a
scrolling panel. `#ctcard` is capped at the viewport with `overflow-y:auto`, so its later buttons
sit below the fold. Measured with the fix removed: the general sweep flagged **one** control
(`ctlend`), the only one that happened to be above the fold, and **never looked at the other four
29 px buttons -- the ones RUN actually reported.** A control the player can scroll to is still a
control, so card controls are now measured through the card rather than through the window.

**DEFECT TWO, AND IT CHANGED WHAT I CAN CLAIM: the mutation could not show the original bug.**
Reverting my rule left four of the five conversation choices at 44, because the gate runs the
DEMO and **RUN's demo-side patch is still in it**. The one it missed, `ctlend`, came back at
189x29. So the honest proof of the fix is the direct measurement on
`BOHEMIA_CITY_WORLD.html` itself (29 -> 44 on all five), not the mutation -- and the mutation's
real finding is that **my city-side fix cures the one control RUN's patch could not reach**
(`ctlend` is 189x44 in the demo now).

Mutation-proved where it can be: put `#cttalk` back at 36 and the gate reports
`cttalk 184x36 (stood beside somebody)`.

## THE LIST IS NOT THE GUARANTEE, AND I PROVED THAT ON MYSELF
The fix is a selector list. I wrote it from the row's own words -- conversation, offer, nightfall,
haggle, fight, **THE PHONE** -- and **still left the phone out on the first pass**, then measured
it at 184x36. A list written from a correct list, one minute earlier, was already incomplete.
That is the argument for the gate: a new kind of card button is caught by measurement, not by
somebody remembering to edit a line.

## NOT RE-CUT, ON PURPOSE
Rule 14(a): only RUN re-cuts the demo. This ships to the alpha and the workshop, and the demo is
byte-identical to `origin/main` in this diff. RUN cuts it.

## PROOF
    node gates/thumb_gate.js          19 ok, 0 failed (conversation + adjacent street, mutation-proved)
    node gates/city_rail_gate.js      11 ok, 0 failed
    node gates/phone_object_gate.js   18 ok, 0 failed
    node gates/half_size_gate.js       7 ok, 0 failed
    node gates/rom_face_gate.js       14 ok, 0 failed
    node gates/feed_gate.js           15 ok, 0 failed
    node gates/alpha_loads_gate.js    20 passed, 0 failed
    python3 gates/readable_ruler_gate.py  7 ok, 0 failed

Per rule 13: PRE-PUSH PASS green. THE SUITE LINE is still unposted, so the honest sentence is
**pre-push pass green; full suite unmeasured since f765fa37.**

## NOT MINE, FOURTH TIME
`phone_readable_gate` 15 ok 4 FAILED -- the same four colour-collision ratchets, unmoved for four
rounds (normal 5 vs ratchet 3, protan 14/13, deutan 12/11, tritan 13/9). Nothing here touches a
faction colour. For whoever owns the palette; the row is this lane's OPEN [colour reaches].
