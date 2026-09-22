# THE PHONE COULD NOT BE OPENED, ANYWHERE, BY ANYBODY (RUN, 9/23/26)

VAMILY `[no pop ups]`, the red leg. Rule 14g (never report a break you have not
reproduced on the glass) and rule 18g (the demo keeps the phone).

## THE ONE RED LEG WAS RIGHT AND MY FIRST TWO FIXES WERE BOTH WRONG

`NOTHING POPS UP` came back 15 passed, 1 failed, on one line:

    FAIL: and the phone chip rings so he knows it is there

I fixed the bookkeeping first: made `phoneBadge()` the single decider, reading
`MORNING_UNREAD` as well as the unread call, so one function owned the chip. Still
red. That was a real fix to a real second-owner bug and it was not this bug.

Then I stopped guessing and asked the live demo instead:

    btnExists: false     MORNING_UNREAD: 10     morningLines: 10

`#phonebtn` is in the markup at line 472 and is **not in the document at runtime**.

## WHAT ACTUALLY HAPPENED, IN ORDER

1. **9/22, Paolo, in his own words:** *"There shouldn't be a phone button in the top
   right. I should click the phone and then it opens the phone... the phone is the
   phone button."* (records/BOHEMIA_PAOLO_CITY_MODE_9_22_26.md ruling 3.)
2. **UI shipped it correctly in JavaScript.** The chip is removed from the DOM on
   purpose -- "removed rather than hidden: a control that is display:none is still a
   thing the next person finds in the markup" -- and the drawn phone, `#cityfeed`,
   was given `role=button`, `tabindex`, an aria-label, `cursor:pointer` and a click
   handler that opens and folds it. Every line of that is right.
3. **And the rule above it still said `pointer-events:none`.** That was correct when
   the feed was a thing you only LOOKED at, and it became wrong the second the feed
   became the door. Nobody changed it, because nothing pointed at it.

## MEASURED ON THE GLASS, BEFORE ANYTHING WAS TOUCHED

    the drawn phone            132 x 349 on the screen
    who gets the point at
    the middle of it           cv          <- THE CANVAS. The map behind it.
    a real touch there         PHONE_ON stayed false
    the chip                   not in the document

**So the phone could not be opened anywhere in the demo.** There was no chip, and the
thing that replaced the chip ate nothing. A handler on an element that cannot be
touched is the same class of defect as a caught exception: the code is there, it reads
correct, and it silently does nothing.

**AND IT TOOK MY OWN WORK DOWN WITH IT.** `[no pop ups]` had just moved the morning
and the night off cards and onto the phone, which is where rule 19a sends them. Ten
lines of "this morning" were sitting in a room with no door, and the gate leg that was
supposed to catch exactly that was asking a deleted element whether it was gold --
`(null || {}).className` answers undefined, so the check could only ever say no, about
a thing that was not there.

## THE THREE LINES

1. **`#cityfeed.on{ pointer-events:auto }`.** Only when it is OPEN: folded, the phone
   is not on the screen at all, so nothing is taken from the map that was not already
   the phone's.
2. **`phoneBadge()` rings whichever door is there.** It asks for the chip first, for
   the day somebody puts one back, and falls through to the drawn phone. Same gold,
   reused, never a second alert designed. This is the third time in this file an
   alarm has followed a button out of the room; `ctOutfitBadge` wrote the post-mortem
   for the second one and its sentence is the rule: **the door moving is a decision,
   the alarm going silent is an accident, and only the second one is a bug.**
3. **Opening it is reading it.** `phoneOpen` clears the unread morning and asks
   `phoneBadge` again, so the gold stops meaning "there is something new" only when
   there is nothing new.

And a fourth, found by the same measurement: the outside-tap registry named
`'phonebtn'` as the phone's opener -- an id that no longer exists -- so the phone's
real door was registered nowhere. The row takes a comma list now and names both.

## WHAT I MEASURED AFTER, WITH A FINGER

    the drawn phone      132 x 349, ringing, pointer-events auto
    the point at its
    middle               DIV.txt      <- inside the phone. It is a door now.
    one touch            PHONE_ON true, the morning 10 unread -> 0
    its own CLOSE        PHONE_ON false

**THE HARNESS LOSES THE FIRST TOUCH INTO A FRESH FRAME** and the gate retries once
before it calls a button dead. Accusing the game of what the ruler did is this lane's
most expensive recurring mistake and it is not going in the count again.

## ONE THING I DID NOT FIX, AND IT IS NOT MINE

**On the street there is no phone drawn at all.** `#cityfeed` shows only in CITY mode,
which is the law's own wording (9/4: "when it's in zoomed out city mode"). So between
waking up and zooming out, the morning is there and the door is not. His ruling says
the phone is the phone button, so the answer is a phone on the street, not a chip --
and the chip is his to refuse, not mine to restore. That is UI's row
`[phone is the button]`, second half, and it is on the break list rather than quietly
patched from this lane.

## THE GATE

`gates/nothing_pops_up_gate.js`, **NOTHING POPS UP**. The leg that asked a deleted
element for a class now asks what he would do: find the phone on the screen, look at
it, put a finger on it, read the morning, fold it. Five legs, all measured on the
served demo at 4x, none of them readable off the source.
