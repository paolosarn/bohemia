# THE OPENING SCENE NEVER ENDS (RUN, 9/12/26)

VAMILY `[drop in]` / THE-FIRST-MINUTE-IS-THE-PROMISE.

> Paolo 9/11: **"Your job is to make sure the rest of the game is playable and
> fun bro come on."**

Chasing the cold-hand red from last round to the bottom. It was real, and it was
mute: it named a symptom four presses downstream of the cause.

## WHAT A COLD HAND ACTUALLY DOES

The instrument presses the loudest thing on screen forty times and never reads a
word. Its trail on the served demo:

    front > openWatch > rungbtn > padring > daycardIn x20

**The second thing it ever presses is `openWatch`** — the invite card's own
**"▶ WATCH"**, sitting under *"DAY 1 BEGINS BEFORE THE DAY. The family, the table,
ten years ago."* It is a filled gold button on a dark screen, so it is the loudest
thing there is, and that is correct design: it is the most inviting thing in the
demo.

## *** AND WHAT IT STARTS NEVER ENDS ***

Measured on the served demo at 390x844, sampling the cutscene's own canvas:

    tapped WATCH
    openWrap and openCv are up, OPEN_RUNNING true, OPEN_MIDFLIGHT true
    the canvas changed ONCE in the first fifty seconds
    then the same pixels for EIGHTY-FIVE SECONDS
    still OPEN_MIDFLIGHT at 128 seconds

**The cold open paints about one frame and freezes, holding the screen forever.**
The walked game is underneath it, which is why the clock never moves: it cannot.
The 8/25 dead-end signature the cold hand kept reporting was true, and the reason
was this, not the walk pad and not the day card.

## A PERSON CAN GET OUT. A COLD HAND CANNOT

`#openSkip` exists, and the demo's cut already forces `#openWatch`, `#openNot` and
`#openSkip` to a 44px minimum, so **SKIP is a real thumb target and it works.** A
human reads the corner and escapes.

But it is dim grey on near-black in the top corner of a frozen picture — **the
quietest thing on the screen** — and never reading a word is exactly what the cold
hand is for. So this is not a dead end for a person; it is a frozen opening with a
quiet exit, which is still the worst possible first ten seconds for a demo whose
whole job is to be handed to a friend.

## WHAT CHANGED HERE, AND WHAT DID NOT

**Changed (mine):** the cold hand now asserts *the opening scene gives the game
back* and says so when the scene is still mid-flight. A red that names the cause
is worth ten that name a symptom, and the clock claims stayed exactly as they were
because they were never wrong.

**Not touched:** the cutscene engine. `cutBoot` and the scene runner are the
CUTSCENE lane's, and the freeze is inside them. ONE SYSTEM, ONE SESSION. The
invite and `openStart` are in the alpha shell, which is this lane's, and neither
is what is broken: the invite fires correctly, the wrapper shows, the canvas gets
its first frame. **It stops after that.**

**Not removed:** the invite. Taking the demo's opening beat off the screen because
its engine hangs is a content decision and a bad trade made quietly. It stays, the
freeze is named, and the exit is already a legal thumb target.

## FOR THE CUTSCENE LANE, THE WHOLE REPRODUCTION

    serve slices/, open BOHEMIA_DEMO.html at 390x844
    tap #front, wait for the walked world
    click #openWatch
    sample getImageData on #openCv every five seconds

    -> one change, then eighty-five seconds identical, OPEN_MIDFLIGHT true at 128s

Nothing threw. No page error at any point, which is why this was invisible: it is
not a crash, it is a scene that stops advancing and never reports that it did.

## RESULT

    COLD HAND -- the red now names the opening scene instead of the clock
