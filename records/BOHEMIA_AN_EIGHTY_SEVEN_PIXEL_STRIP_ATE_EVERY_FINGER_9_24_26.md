# AN EIGHTY-SEVEN PIXEL STRIP ATE EVERY FINGER ACROSS THE TOP OF THE GAME (RUN, 9/24/26)

VAMILY `[banner eats fingers]`. Measured to the element by LIFE+CITY (492f40c),
reproduced here on the glass before one character was changed.

> **PAOLO 8/24:** *"when I press standing and I press close, it doesn't close."*

## WHAT WAS THERE

The opening overlay's banner -- the one that says DAY 1 BEGINS BEFORE THE DAY and
offers WATCH and NOT NOW -- draws in the **parent document**, over the iframe the
walked world lives in. On the alpha, which is the link he is sent:

    #openInvite      390 x 87 at 0,109      z-index 39      pointer-events AUTO

    elementFromPoint down the middle of the screen
        y = 110   ->  openInvite
        y = 140   ->  its inner div
        y = 160   ->  its inner div

    three real touches down that strip, counted INSIDE the frame
        0 of 3 arrived

**An eighty-seven pixel band across the top of the game swallowed every finger**, and
the STANDING card's own X sits under it.

## WHY NOBODY'S CHECKER SAW IT

Two reasons, and both are worth keeping.

1. **AN IFRAME'S STACKING NEVER BEATS ITS PARENT'S.** Every control in that band lives
   inside the walked city document. Nothing written in there -- no z-index, no raised
   layer, no handler -- could have won against an element in the page that contains it.
   So every checker that lived in the city file was correct when it said the controls
   were fine. They were fine. They were underneath something.
2. **A CHECK THAT CLICKS INSTEAD OF TOUCHING CANNOT SEE AN OVERLAY.** `el.click()`
   dispatches straight at the element and closes that X every single time. A finger
   hit-tests the screen and never arrives. That is how it was signed off, and why he
   kept reporting a close button that does not close on a build where the close button
   worked perfectly in every test we had.

## AND THEN THE RULING CHANGED THE FIX WHILE I WAS MEASURING

**THE REVAMP LIST landed on main mid-round and named this element for deletion:**

> THE COLD OPEN (RUN, PEOPLE): the family cutscene ("DAY 1 BEGINS BEFORE THE DAY",
> WATCH / NOT NOW) **and the banner that eats fingers with it.** Rule 32a.

Everything I had measured stayed true. It was also the wrong fix. He said *"why does
everything have to happen the first second of the game... don't force this on me"*, and a
POLITE banner in the first second is still a banner in the first second. **Newest date
wins.** So what shipped is not a see-through strip, it is no strip:

`openShould()` returns false, which closes every door at once -- the banner, the tab
handler and the resume all ask that one question first, so no future caller can reopen it
either. The strip keeps `pointer-events:none` as a **second lock**, for any path that sets
`display` directly.

**AND IT IS A HIDE, NOT A RAID.** The markup, WATCH, NOT NOW and the scene engine stay in
the file. Archiving them is a shared job with PEOPLE, and RAY, DENISE, MARCO and NINA stay
as people you meet in the world. Half-deleting another lane's scene code to close my own
row is how a lane breaks three gates it does not own.

## WHAT THE FIX WAS GOING TO BE, AND WHY IT IS STILL WORTH READING

`pointer-events:none` on the strip, `pointer-events:auto` on WATCH and NOT NOW.

The banner still draws, still says what it says, and the only things in it a finger can
touch are the two it is asking him about.

    BEFORE   0 of 3 touches down the strip reached the walked world
    AFTER    3 of 3, and every point across it answers the walked frame

## THE GATE, RE-AIMED AND RENAMED: NOTHING SITS ON TOP OF THE GAME

`gates/the_banner_takes_only_its_own_buttons_gate.js`, **NOTHING SITS ON TOP OF THE GAME**,
7 passed 0 failed, registered in the suite. It held "the banner takes only its own two
buttons" until the ruling arrived; now it holds that the cold open never offers itself,
that the strip never draws, that the lock is on the element for any future caller, that
the top of the game reaches the walked world, **and that the scene code is still in the
file** -- a cut of a shared feature must not become a quiet deletion of somebody else's
half. It opens the **ALPHA and says so**: the cut hides this
banner outright, so measuring the demo would have reported a clean screen about a defect
that only exists on the surface he is sent.

It holds four things: the strip owns no point across it; its two buttons still take a
finger and NOT NOW still folds it; real touches reach the walked world; **and the walked
world is genuinely underneath the strip.** That last leg is not decoration -- without it,
the first three would pass on a screen where nothing was ever covered.

**MUTATIONS, EACH CAUGHT AND EACH RESTORED.** On the shipped shape: let the cold open
offer itself again -> 2 red; take the second lock off the strip -> 1 red. On the shape
that did not ship, proved before the ruling arrived: give the strip its fingers back -> 2
red and 0 of 3 touches, the exact before number; take pointer-events off NOT NOW -> 2 red,
because a strip nobody can press is not a fix, it is a different defect.

**AND A THIRD LEG OF MINE NEARLY PASSED FOR THE WRONG REASON.** Forcing the strip visible
gives a 0 x 0 box, because the panel it lives in is not laid out -- so asking who owns a
zero-width point answered "nothing" and ticked green. It asserts the LOCK now, which needs
no layout, and it REPORTS the box instead of asserting on it, and says out loud when there
was nothing to hit-test. That is the same mistake as the y=744 finger test below, caught
twice in one round.

## AND THE FIRST CUT OF MY OWN GATE ASKED THE WRONG SCREEN

I measured the two buttons **after** tapping three times through the strip, and both
button legs went red with WATCH reporting a **0 x 0 box** on a banner still reading
`display:block`. Tapping the world underneath changes what the banner is doing. A leg
that runs after a destructive step is asking about a different screen than the one it
names, so each leg gets a clean state now: the buttons are measured first, the world taps
come after, and the fold is asked of a freshly shown banner.

I also nearly shipped a green tick for the X itself: my first finger test found the card's
close control at **y=744**, four hundred pixels below the strip, and closed it. That proved
nothing at all about a band at y=109. A test that passes without touching the thing it is
about is worse than no test.
