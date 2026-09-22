# THE PHONE IN HIS POCKET, AND THE DOOR MY PROBES NEVER WALKED THROUGH
UI lane (chat 11), 9/23/26. Row [phone on the street], claimed from RUN's 9/23
bounce-back on [phone door] (records/BOHEMIA_THE_PHONE_COULD_NOT_BE_OPENED_9_23_26.md).

## WHAT THE ROW ASKED FOR
"#cityfeed only draws in CITY mode, so ON THE STREET THERE IS NO PHONE AT ALL.
Rule 19a sends the morning and the night to the phone, and from waking up until he
zooms out the words are there and the door is not. The answer is a phone on the
street, not a chip he already refused."

## WHAT IS BUILT
The drawn phone is now on him in BOTH modes. In CITY it is the streaming feed it
already was, 132 x 349. On the STREET it is FOLDED INTO HIS POCKET: 46 x 62 at the
top right, the glass and the gold rim and the crack, the list and the bar and the
fade hidden, one 44 x 44 reach pad centred on it so the thumb target is a whole
thumb without the drawn object growing. Same element, same id, same handler, same
unread ring. One tap opens the phone, on the street, on the first touch.

  slices/BOHEMIA_CITY_WORLD.html
    the feed tick: `var wantOn = true` -- the phone is always on him; the class
    `street` is what changes, not whether he has a phone
    `#cityfeed.street{...}` and `#cityfeed.street::after{width:44px;height:44px}`

This is not a chip. He killed the chip on 9/22 ("the phone is the phone button")
and the chip stays dead: nothing new was added to the bar, the object he already
owns simply stopped disappearing when he walks.

## THE DEFECT THIS ROUND ACTUALLY FOUND, WHICH IS BIGGER THAN THE ROW
*** A LIVE ORACLE UNDER AN OVERLAY IS THE SAME DEFECT CLASS AS A HANDLER ON AN
UNTOUCHABLE ELEMENT. ***

RUN's finding a round ago was: my gate asked the SOURCE whether a handler exists
and never asked the GLASS who gets the point, so `pointer-events:none` passed. I
rewrote the tap to go through the glass. Then my own probe came back with two
readings that made no sense:

    == THE STREET   a REAL touch opens the phone: false
                    and again folds it: true          <- off by one
    == THE CITY     mode=human  class="on street ring" <- never crossed the seam

I did not write either of those up as a result. Measured instead, with a tape of
every event the page really saw:

    TOUCH 1   (no pointerdown in the city frame at all)
    TOUCH 2   pointerdown -> cityfeed, click -> cityfeed, phoneOpen(), PHONE_ON true

The frame saw nothing on the first touch. Asking the TOP page where that pixel
goes gave the answer in one line:

    the TOP page says that point is: loadgl   (the front splash)
    top tape: ["top pointerdown -> loadgl"]

THE DRIVER WAS STILL ON THE SPLASH. tools/bohemia_drive_the_demo.js taps the front
door the moment the door is SEEN, and rule 18a made the door's own handler open
with `if(!window.__LOAD_READY) return;`, with __LOAD_READY set far down the file.
So the driver's knock RACES THE LOAD, and on the runs where it loses it walks away
believing it is inside. Nothing downstream notices, because the city frame is built
and alive UNDERNEATH the splash: `fr.evaluate` answers every question happily, the
world is there, MODE is 'human', elementFromPoint inside the frame says the phone
owns its own pixel -- all true, all about a screen nobody is looking at. A real
finger at those coordinates lands on #loadgl.

That is how "the phone does not open on the first touch" got measured about a phone
that opens fine, and how a pinch that never crossed the seam got printed under a
heading that said THE CITY.

## THE FIX, IN THE DRIVER, SO IT IS FIXED FOR EVERY LANE
    knock() -> CHECK THE DOOR IS BEHIND US -> knock again, up to 14 times, 900 ms
    apart, and publish `doorIsBehindUs()` so a caller that sends real pointers can
    REFUSE TO REPORT rather than measure the splash.
Bounded, and it costs nothing at all on a boot where the single knock already
worked (measured: tappableMs 1043 and 938 on two runs, the door behind us both
times, the first real touch opening the phone both times).
This is PLUMBER's file and UI touched it; flagged in the handoff.

## AND A THIRD THING, FOUND BY LOOKING AT THE OBJECT INSTEAD OF THE CODE
The pocket phone came out a DEAD BLACK SLAB, and a dead phone in your hand is a
different game than a lit one, so I went looking for something to put in the glass.
The phone's own bar already carries a clock. It has never told the time:

    var hh=(typeof HH!=='undefined')?HH:null, mm=(typeof MM!=='undefined')?MM:null;

THERE IS NO HH AND NO MM IN THIS FILE. The only hit for HH anywhere in 76,000 lines
is a household label. Both guards fell through to '' and the phone has shown an empty
clock since the day it was built, IN THE CITY AS WELL, where nobody noticed because a
blank slot next to a signal meter and a battery reads like a blank slot. The game keeps
its time in T and prints it with clockStr(), so the phone asks that now and takes the
part after the separator: one clock in this game, and the pocket cannot drift from the
bar.

Two more lines had the same shape. The tick opened with `if(!on) return;` and `on`
means THE FEED IS STREAMING, which is city mode only -- so on the street the pocket
phone never re-measured the bar above it (the bar's height is not fixed; a long track
name wraps it and it grows down) and its clock never ran. The stream still belongs to
the city, his ruling on 9/4. The OBJECT is on him either way, so the two lines that
keep the object honest run either way and the early return moved down to where the
feed work actually starts.

So the pocket phone is: 46 x 62, cracked glass, 06:00 lit behind the cracks in the
screen's own type, the gold rim when something is unread. 9px, not 11 -- at 11 the
hour touched both edges of a 38 px glass and the leading digit went under the casing.

## AND WHAT OPENING THAT DOOR UNCOVERED, WHICH IS THE WORST OF IT
Fixing the knock is what let anybody see the next two, because a driver that never got
inside could not trip over anything inside.

TRAP 6, THE COUNT WAS TOO SHORT FOR THE ALPHA. The first cut of the fix knocked fourteen
times, 900 ms apart. MEASURED: the alpha's door holds for 21,898 ms after the first knock
-- it is a bigger load than the demo and __LOAD_READY arrives when it arrives. So on the
alpha the count ran out and the driver walked away on the splash anyway. you_can_start_it
_gate was printing, in its own words, "NOTHING REACHABLE. The shell says the first body
point is under: DIV#loadgl" -- a gate about tapping the street, measuring the front
splash, red for a reason that had nothing to do with its subject. The budget is the thing
to bound, not the patience: it knocks on a clock now (90 s, and it publishes doorMs()).

TRAP 7, AND THIS ONE IS MINE FROM LAST ROUND. With the door finally behind it, open()
threw on the alpha: `Cannot read properties of null (reading 'x')`. A HIDDEN ELEMENT HAS
NO BOX. Paolo ruled twice that the alpha must not open on the run, so since 9/22 it lands
on the VOTE tab after BEGIN -- which means the RUN panel, the one holding the city frame,
is display:none the instant the door opens, boundingBox() returns null, and every
coordinate in the driver reads .x off it. Nobody had seen it because nobody had ever been
through that door. The driver walks to the RUN tab when the frame has no box, then takes
it, and says so if that fails. MEASURED AFTER: door behind us, held 21.9 s, and the middle
of the alpha's screen belongs to cityFrame instead of loadgl.

THE SHAPE OF ALL THREE IS ONE SHAPE. Something is in front of the thing being measured,
the thing being measured answers anyway, and the answer is about a screen nobody is
looking at. RUN's pointer-events:none was the same shape. Ask the glass.

## THE GATE
gates/the_bar_fits_his_glass_gate.js, 26 ok / 0 failed. New legs:
  - the driver is really inside the game, not still on the splash
  - ON THE STREET the phone is drawn at all (46x62 in mode human)
  - and the WHOLE of it is on the glass (not `left < innerWidth`, the mistake at
    the top of that file)
  - and it is a thumb wide
  - and it owns its own middle pixel (elementFromPoint, never the source)
  - and THE FIRST REAL TOUCH opens the phone, on the street
  - the same four questions again in CITY mode, after a squeeze that is checked
It folds the phone with phoneClose() rather than a second tap, because the open
phone covers its own handle (RUN measured it: 378x794 over 132x349) and an open
phone eats a pinch.

SIX MUTATIONS, EACH PROVED AND EACH RESTORED:
  take the pocket phone away (width/height 0)          -> 1 red  [8x9, the padding]
  make it untouchable, pointer-events:none, RUN's
    exact defect, on the street this time              -> 2 red  [the point goes to cv]
  shrink it under a thumb                              -> 1 red  [30x30]
  push it half off the right edge of the glass         -> 3 red  [364,108]
  TAKE THE HANDLER OFF THE DRAWN PHONE                 -> 2 red  [both screens]
  put the old behaviour back: the phone in city only   -> 4 red  [0x0 in mode human]
The fifth is the one that matters. That mutation PASSED a round ago and RUN caught
it by hand; it now fails on the street and in the city, because both legs send a real
pointer at a pixel the page agreed belongs to the phone.

## THE PRE-PUSH PASS, AND EVERY RED ATTRIBUTED BY MEASUREMENT
Every red was run again on a CLEAN CHECKOUT OF MAIN in a separate worktree, because a
lane reasoning about whether a failure is its own is a lane deciding its own case.
  GREEN with the change:
    NOTHING POPS UP            21/0   (RUN's phone gate)
    THE BAR FITS HIS GLASS     26/0
    THE NOTES SECTION          28/0
    THE NOTES BUTTON           22/0
    THE VOTE TAB               30/0
    LOADING DURING PLAY         6/0
    THE DRIVER SAYS WHAT IT OPENED  6/0   -- 3 FAILED on my tree before the trap 7 fix.
      That red was mine and it is closed in the same round; it is on the record because a
      red I caused and fixed inside one round is still a red I caused.
  RED ON MAIN AND ON MINE, SAME LEGS, SAME NUMBERS, NOT MINE:
    NOTHING MOVES UNDER HIS FINGER  8 pass / 2 fail   (the day card draws 0 rows)
    YOU CAN START IT                7 pass / 4 fail   (its own splash race)
  RED BOTH SIDES, DIFFERENT LEG: THE DRIVER REACHES THE CITY. On main the squeeze never
    crosses the seam at all, because the driver is on the splash. With the door open it
    crosses (mode city, HZOOM 11) and then FINGERS APART DOES NOT BRING HIM BACK. Newly
    VISIBLE, not newly broken, and the city-to-street seam is not this lane's. Flagged to
    FACTIONS and RUN in the handoff.

## THE ANALOG HORROR LINE (rule 9 of the law, every chat, every round)
ONE WRONG THING, and the pocket phone is built on it: everything about the object is
ordinary -- a handset in the corner of the screen, the hour lit, the way a phone has sat
in the corner of every screen you have ever looked at -- and THE GLASS IS BROKEN. Nobody
mentions it. Nothing in the game refers to it. The clock behind the cracks keeps perfect
time, which is the part that is wrong: the network is dead, the valley is dark, and this
thing still knows exactly what hour it is. The camera does not help (rule 2): the phone
is 46 px and is never zoomed, framed or pointed at. It is diegetic or dead (rule 8) -- it
is not an icon of a phone, it is the phone, the same object that opens full size.

## WHAT THIS ROUND DID NOT FIX
The phone's own screen is BLACK for about three seconds the first time it opens,
on the street and in the city alike. Measured: the iframe is `loading` at 1.5 s and
`complete` with 49,301 characters at 3 s. It is the first open only, it is not new,
and it is not what this row is about, so it is written down instead of quietly
widened into. [PENDING for a row: warm the phone iframe when the game is idle.]
