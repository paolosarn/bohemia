# THE FEED IS A PHONE YOU CAN SEE NOW (9/11/26, UI lane 11, row [phone object])

PAOLO 9/8, from his own frame (`records/target/PAOLO_THE_FEED_IS_NOT_A_PHONE_9_8_26.jpg`):

> "this doesn't look like a cool post-economic-apocalyptic phone, does it, bro, come on?"

He was right. What shipped was a rounded rectangle of monospace text on black. A debug
console with good writing in it.

Gate: `gates/phone_object_gate.js`, **18 ok, 0 failed**.
Picture: `slices/BOHEMIA_THE_PHONE_IS_AN_OBJECT_9_11_26.html`, five phones.

## THE WORDS WERE NEVER THE PROBLEM AND ARE NOT TOUCHED
Not one post, not one voice, not one line of the Spanglish. `feed_gate` 15/0, unchanged.
The OBJECT around the words was the job, and that is all that moved.

## WHAT MAKES THIS GATEABLE INSTEAD OF A MATTER OF TASTE
A panel and an object differ by something you can measure. A panel is one box with text in
it. An object has **thickness**. So the gate measures thickness:

    casing     5 / 5 / 9 / 5 px on the four sides -- padding, not a 1px border
    screen     120x346 inset strictly inside the 132x362 body, all four edges
    fracture   9 drawn paths radiating from one impact point
    tape       a strip over the top edge
    battery    reads the city's own cbLitFront() at the player's tile

## THE BATTERY IS A REAL READING, AND THAT IS THE LEG THAT MATTERS MOST
MECHANISM-MINE / CONTENTS-PAOLO'S. A percentage invented to look good is worse than no
battery at all, because he cannot tell an invented number from a real one by looking at it.

So the cell does not show a number. It asks the game a question the game already answers
for its own build permit: **is the street he is standing on a live circuit.** That is
`cbLitFront()`, and it exists in this file precisely because asking about the *plot*
instead of the *street* returns false everywhere -- a lesson another lane paid a round for,
written directly above the function.

On the grid the cell charges. Off it, the phone is running on what is left.

**AND BOTH BRANCHES ARE PROVED, BECAUSE ONE BRANCH IS NOT A READING.** Every other
assertion saw `lit=false`. If the reader returned false everywhere, all of them would still
be green and the battery would be a decoration that always says the same thing -- the exact
shape of the bug this city already paid for. So the gate finds a genuinely lit street,
stands the player on it, and watches the cell change:

    stood him on a live street at 49,52 -> lit, stepped back off -> dark

## THE FRACTURE WAS WRONG ONCE, AND LOOKING AT IT IS WHAT SAID SO
The first cut drew the crack as three full-length diagonal gradients. On the screen they
read as **scratches on a window**: straight lines crossing the whole panel, corner to
corner, which is not how glass breaks. Real glass fails from ONE impact point and radiates,
with short branches and a couple of ring fractures around the hit. Redrawn as an actual
shape (SVG, `preserveAspectRatio="none"` so it stretches with the panel), hairline, over
the text and never instead of it. No gate asked for this. The picture did.

## IT IS DRAWN FROM A SKIN, WHICH IS THE ONE PIECE OF ARCHITECTURE THIS LANE OWES
`laws/BOHEMIA_LAW_THE_UI_HAS_THREE_ACTS_9_6_26.md`: every element drawn from ONE NAMED SET
of shapes, colours and type, so swapping the set swaps the interface without touching what
the game does. **The phone is the first element moved onto it** -- `BOHEMIA_SKIN`, act one
named **SALVAGE**. Every colour, thickness and radius of the object lives there and nowhere
else; the stylesheet only reads variables. Add a sibling entry and act two's phone exists.

Proved by mutation, because a skin nothing reads is a config file: change one skin value
and the phone repaints (`rgb(74,65,51) -> rgb(255,0,0)`), put it back and it restores.

"2050 rustic" taken literally rather than as a mood: not a 1950s idea of the future, but
the tech we use now, worn down and kept alive past its life. What that means in the picture
comes from how phones actually wear -- a drop crack out of the corner it landed on, tape
over the top edge, the greasy band a thumb leaves across the bottom third of every phone
anybody has ever owned, and **a screen that is ON**. His frame was a picture of an off
phone with words on it.

## ONE RED CLOSED THAT WAS NOT THIS ROW'S
`readable_ruler_gate` has been RED on main: one control of seventeen under the readable
floor. Named it -- the BIKE chip's letters at **4.48 against a 4.5 floor**, two hundredths
short, the only one under. It takes the lighter tint of the same gold the walk arrows were
given on 9/6 for this exact problem, so the palette does not change and no other chip
moves. **0 of 17 under the floor now**, gate 7/0.

## ALSO CAUGHT BY LOOKING, ON THE OPTIONS SHEET
The thick-cased option pushed its own clock out past the casing, which would have shown him
a rendering fault dressed as a design trade. The narrow screen IS that option's cost; the
clock falling off the phone is not. The header now truncates instead, on the sheet and in
the shipped phone both.

## NOT MINE, PROVED ON A CLEAN origin/main WORKTREE
`language_gate` fails on one Spanglish neighbour line, identically on main with none of my
changes. `gate_registry_gate` is red on main with two orphans, `gates/a_days_work_gate.js`
(WORLD) and `gates/fold_runtime_gate.js` (QUESTS), which their lanes should register.
