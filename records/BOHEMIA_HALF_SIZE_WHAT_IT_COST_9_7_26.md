# HALF SIZE IS ON, AND HERE IS WHAT IT COST (9/7/26, UI lane 11, row [half size])

PAOLO 9/6, LOCKED: "for the run right now make all the UI 50% smaller, I don't give a
fuck." The row also said: a control is DRAWN at half while its touch area stays 44 --
halve the pixels, never the reach -- AND, in the same breath, "if something cannot
survive that, shrink it anyway and put the fact in the record for him to see."

It could not survive. This is that record.

## WHAT SHIPPED
Commit 8a130456 (and 270b0e6c before it). Module `BOHEMIA_HALF` in
`slices/BOHEMIA_CITY_WORLD.html`, ON by default. Gate: `gates/half_size_gate.js`, 7 ok.
Option D from the size sheet: the same HALF size with the stack spread (container
`gap:30px`) so a thumb has room between buttons.

## THE MEASURED TRUTH, EVERY CONTROL, NOTHING HIDDEN
Eleven real buttons on the walked screen. Every one is now 14 px tall, and its reach is
the same 14 px -- drawn size and touch size are the same number.

    musbtn    44x14      savebtn   44x14      phonebtn  44x14
    outfitbtn 44x14      rungbtn   47x14      buildbtn  54x14
    mktbtn    44x14      modechip  44x14      fitbtn    52x14
    bikebtn   44x14      sleepbtn  44x14

The other eleven rows the report prints (hud, note, hmode, hclock, hslot, modeLbl,
topbar, blstack, nav, pad, mode) are labels and containers, not things you press.
`nav` and `pad` are 90x90 and the mode button is 40x40.

## WHY THE REACH IS THE BUTTON INSTEAD OF 44
A reach pad big enough to matter is a pad that lies across the control next to it. That
is not a theory, it is what the real screen did: at the PHONE chip's own centre, the
topmost element was SAVEBTN's pad. With pads on, pressing PHONE opened nothing. With
pads off, it opens. The pads were not a harmless bonus under the buttons; they were the
thing that broke the game.

It got worse before it got better: zeroing the pad's SIZE was not enough, because the
class stayed on, and `#topbar>*` forces `position:static`, so a pseudo-element of a chip
that cannot be positioned anchors to a distant ancestor and becomes a sheet over the
whole container. The pad had to come off properly, class and variables and all.

So: the pixels are halved, and the reach is the button itself. Nothing is unhittable and
nothing does the wrong thing. Some things want aiming at.

## THE 44 FLOOR, AND WHY IT YIELDED
`gates/thumb_gate.js` enforced a 44 px minimum from `[phone readable]` (9/6). His halving
order is also 9/6 and it is the newer, louder one, and NEWEST DATE WINS is the repo's own
rule. The floor did not get deleted. It now yields by a NARROW, NAMED exemption: only the
ids `BOHEMIA_HALF` actually reports, only while the halving is on, and the gate PRINTS
every shrunk control by name every run so this never goes quiet. Mutation-proved: put one
control back to 30 px outside the list and the gate still fails.

## WHAT DID NOT HALVE, AND IS KNOWN
The shell gear and the teaching caption. They are drawn by the outer shell, outside the
city frame, so the city's stylesheet cannot reach them. Not fixed, not hidden.

## THE STANDING LESSON THIS ROW ADDED
Three harnesses lied before one told the truth. An in-page hit test said 12 of 12 while a
driven tap got 2 of 11. Per-button listeners said 4 of 10 on the UNMODIFIED build, which a
person can obviously use. What settled it asks the GAME, not the DOM: press PHONE, did the
phone open. When a measurement and the thing itself disagree, the thing itself wins.
