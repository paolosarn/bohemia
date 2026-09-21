# HE TAPPED A DOOR AND GOT A BLACK RECTANGLE FOR TWO MINUTES (RUN, 9/21/26)

VAMILY `[loading screen]` part two, with `[horror loading]` folded in as its row
asks. Rule 18a LOADING, rule 20h.

> **PAOLO 9/8, LOCKED:** *"we seriously need a loading screen. It's bullshit when I
> go in the demo, all the loading shit that you might need to do, handle it, it's so
> awkward looking."*
> And 9/15, after playing: *"it's kinda not running as smoothly as I would like,
> maybe it's cause things are loading in real time."*

## THE MEASUREMENT

Served demo, 4x CPU, one tap, every milestone read off the game's own live state:

    2.8 s    the door offers
    4.5 s    the door opens, on ONE tap        <- part one, holding
   68.3 s    the world has a clock
  113.6 s    the city draws a frame
  118.2 s    a person is on the glass

    DOOR TO PLAYABLE: 113.7 SECONDS
    AND THE SCREEN WAS GONE FOR ALL OF IT.

The old handler hid the splash on its **first line** and then did a hundred and
thirteen seconds of work. Part one of this row fixed the four tenths of a second in
*front* of that and said so; this is the rest.

## THE SHAPE, WHICH IS THE COORDINATOR'S DECIDED DEFAULT

- **The load does not wait for a tap.** Nothing in it ever needed a gesture. It
  starts when the page is whole and runs BEHIND the screen.
- **The screen stays up and says what it is doing**, in the dead institution's
  register (bible rule 5: procedural, too calm, no exclamation mark). Measured on
  the glass, the words in order: **ONE MOMENT → WINDING THE CLOCK → PUTTING PEOPLE
  ON IT → BEGIN.**
- **No bar and no percentage.** The `[loading look]` row rules out a progress bar
  that lies, by name. Every line is a question the page answers about itself.
- **Nothing is tappable until it is loaded** (rule 18a, in those words). A tap
  before BEGIN is not a door.
- **It ends on BEGIN and takes one tap.** That tap is the browser's gesture, so it
  is where the first sound plays — SOUNDS shipped the hum for this exact tap.

**AUDIO IS THE ONLY THING THAT STILL NEEDS THE FINGER.** A browser will not start
audio without a gesture; everything else was never waiting for one. That is the
whole trick: the wait was always going to happen, and now it happens somewhere he
can see it, and the tap lands on a world that is already built, already drawn, and
already has people standing on it.

## AFTER

     99 s    the screen holds and reports, saying what it is doing
              then BEGIN
    4.0 s    BEGIN to a visible world

    DOOR TO PLAYABLE: 113.7 s of blank  ->  4.0 s after BEGIN

**SAID HONESTLY: THE TOTAL WAIT IS ABOUT THE SAME.** The game does not load faster.
What changed is that he is not staring at a black rectangle through it, and the
button he presses is not a promise the game cannot keep for two minutes.

## THREE THINGS I GOT WRONG, IN ORDER, AND ALL THREE WERE MINE

**1. I BROKE PART ONE WITH PART TWO.** The loader wrote its status into `#fronttap`
every beat and so did the old painter, so the two fought and the painter won: the
door read **TAP TO ENTER at 3.1 s** again, and the tap was then refused. That is the
dead first press part one existed to kill, reintroduced by the fix built on top of
it. One element, one owner: while the world is loading the loader owns that line and
the painter does not touch it.

**2. I STARTED THE LOAD TOO EARLY AND SWALLOWED THE PROOF.** I called it on the line
after `__DOOR_WIRED`, which is the middle of the file — `buildUI` had not parsed, it
threw, and **my own try/catch ate it**. Measured: `started` true, app shown, RUN tab
present, and `__OPENED_ON_THE_GAME` still **0** with no city frame. A boot that
reported success and did nothing. That is this file's oldest lesson in its own
capitals — *a caught exception is a feature that silently does nothing, and that is
worse than a crash, because a crash gets fixed* — and I committed it again. The load
waits for the page to be whole now, and a throw is recorded where a gate reads it.

**3. THE STAGE THAT JAMMED THE WHOLE SCREEN ASKED A QUESTION THE PARENT CANNOT
ANSWER.** WINDING THE CLOCK read `DAY` from outside the frame. `DAY` is declared
`const`, and **a const is not a property of window**, so it was undefined forever:
the screen sat on that line while the street (49 s) and the people (99 s) behind it
were already finished. The clock is wound when the HUD stops showing the placeholder
it ships with — the same shape as the door itself, where the markup carries a promise
and only a change proves it.

## AND A FOURTH, WHICH IS THE SAME LESSON AS THE WALK GATE, IN THE SAME SESSION

BEGIN to a visible world measured **22.7 s**, so I blamed the music build and
deferred it by a frame: **25.2 s.** Then by 1200 ms: **24.2 s.** No change either
time, so the song was not the cost and **I had guessed twice**.

The cost was **`page.tap`**. It does actionability work — hit-testing, scrolling into
view, waiting for stability — and on a 4x-throttled page all of that was charged to
the number my own gate printed. Every other gate this lane owns dispatches the touch
through CDP for exactly that reason; this one did not. Through a raw touch:

    22.7 s  ->  4.0 s

**Before blaming the game, blame the ruler.** The speculative music change is
reverted rather than left in as a change with no measurement behind it.

## THE GATE

`gates/the_screen_holds_the_loading_gate.js`, in the suite as **SCREEN HOLDS**,
**20 passed 0 failed** on the served demo at 4x. It holds: the load starts with
nothing tapped, the world is built behind the screen, the screen stays up, it says
more than one thing and never a percentage, **a real tap mid-load does not open the
game**, it ends on BEGIN, the city is already drawn and people already on it before
he taps, one tap opens it, and a load that throws is never swallowed.
