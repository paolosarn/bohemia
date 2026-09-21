# BOHEMIA -- THE BAR CANNOT LIE (UI lane 11, 9/22/26, row [cook panels] item 1)

Paolo 9/21, verbatim (records/BOHEMIA_PAOLO_I_WANT_A_COOL_LOADING_SCREEN_9_21_26.md):
"And there's no loading screen yet, bro I wanna cool loading screen. It's looking like shit
there's no loading screen just a bunch of glitchy shit loading in loading out loading in
between before I'm able to even touch anything so that should be covered with a loading
screen, bro, maybe even a loading bar if you're smart enough for."

Rule 22: a UI round is panels. This round's panel is item 1 of the row, and the row says it
goes to RUN as a real skin as well as to VOTE as a picture.

## 1. WHAT WAS MADE

`slices/bohemia_loading_screen.js` -- the loading screen as a drop-in skin, and nothing else.

    BohemiaLoading.mount(el)                  build it inside el
    BohemiaLoading.expect(['world','art'])    name the sources, up front
    BohemiaLoading.report('world', 8, 14)     REAL progress from a real source
    BohemiaLoading.ready()                    everything is in; BEGIN lights
    BohemiaLoading.onBegin(fn)                one tap, and the first sound

**IT IS THE SKIN AND NOTHING ELSE.** RUN owns the door (`#front` in the alpha) and RUN
[loading screen] has been claimed since 9/16. ONE SYSTEM, ONE SESSION: this lane did not
reach into RUN's splash. It hands over four calls and no opinions about when the game is
ready. The wiring RUN needs is section 5 below.

## 2. THE BAR CANNOT LIE, WHICH IS THE WHOLE OF RULING 3

"A bar that reads REAL progress, never a fake timer; it reaches the end exactly when the pad
works. A bar that lies is rule 14(d) in a new coat."

A LYING BAR IS THE DEFAULT EVERYWHERE, because a timer always looks good and never blocks a
release. So the module is built so the lie is not available:

- There is **no timer in the file at all**. No `setTimeout`, no `setInterval`, no
  `requestAnimationFrame`. The fraction is `sum(done) / sum(total)` across the sources
  somebody really reported, and nothing else can touch it. The only things time drives are
  the cursor blink and the tape band, and both are CSS animations on ornament that touch
  neither the fill nor the number.
- With nothing reported the bar sits at zero and the screen says zero. That is the truth,
  and it is what a stranger sees for the first second.
- `ready()` **REFUSES** while a source it was told to expect has not finished, and names
  which ones. A screen that lets go early is exactly the "loading in between" he is
  complaining about, and a screen that lies about being done is the same defect as a bar
  that does.

## 3. IT IS A DEAD MACHINE, NOT A SPINNER (rule 20, the bible 14e03eb6)

The frame is the power company's terminal cold-booting in a room nobody is in. The name is
punched into the case with a lit lower lip on the groove. The glass is sunk into the case,
lit from behind, corners going dark because a tube is curved, and the boot log fills it from
the bottom the way a real terminal does. The bar is a lit strip lying in a slot cut into the
case. Under it a vent, then BEGIN, which is dark and says WAIT until the game really is in.

**THE ONE WRONG THING (bible rule 1), nameable in one sentence:** the station prints
`NO OPERATOR ON DUTY` as a flat status line, and it is the only line on the screen about
people rather than plant. Nothing points at it and nothing waits on it. That is the whole
horror on this screen and there is only one of it.

Rule 4, the light was in the room: the only lit thing is the glass, and the case is lit by
that glass and nothing else -- no mood gradient anywhere. Rule 5: two registers only, the
stencil on the case and the character cells on the glass, nothing decorative. Rule 8: the
tape drop-out lives INSIDE the glass, which is an in-world screen, and nothing draws over
the frame.

## 3b. THE WORDS ARE NOT MINE, AND FOLDING THEM IN MADE THE SCREEN BETTER

WORDS Q28 landed while this was being built
(records/BOHEMIA_WORDS_Q28_WHAT_THE_LOADING_SCREEN_SAYS_9_23_26.md) and routed seventeen
lines for this exact screen to RUN and to this lane. My first cut had invented its own boot
log, which is this lane writing player-facing prose it does not own. Theirs is better and it
came with two conditions that are promises, not style notes:

1. **EACH STATE LINE IS WIRED TO THE STAGE IT NAMES.** "A line that says it is counting while
   nothing is counting is the worst bug in the game by his own ruling." So a line now carries
   the NAME OF A SOURCE and appears only once that source has really reported. Nothing shows
   because time passed. This is the same promise as the bar, applied to the words.
2. **THE COUNT IN THE SLOW LINE IS THE REAL COUNT.** "THE 41 AND THE 68 ARE THE REAL FILE
   COUNT OR THEY DO NOT SHIP." `STILL WORKING. 31 OF 44.` is printed from the same done/total
   the bar is made of, so the words and the bar cannot disagree.

AND MY INVENTED WRONG THING WENT WITH IT. I had written `RESIDENTS ON THIS BLOCK 0
RESPONDING`; WORDS had `NO OPERATOR ON DUTY`, which is ordinary institutional signage, simply
true, and set as a status rather than a warning. Keeping both would have been the same wrong
thing said twice, which is the frame nudging -- bible rule 2 forbids that as hard as rule 1
forbids two different ones. Theirs stays; mine is gone.

**NOT BUILT, AND SAID SO RATHER THAN QUIETLY DROPPED**, back to WORDS and RUN: the second
tone line (`THIS SCREEN UPDATES ITSELF`) would be a second tonal line on a screen allowed
one, so it is not here; and the five Spanish lines are real under THEY SPEAK SPANGLISH, but
doubling every line makes the log twice as long, and where they sit is a surface decision I
did not take alone.

## 4. I SHIPPED TWO WRONG THINGS ON THE FIRST CUT, AND A GATE LEG EXISTS BECAUSE OF IT

The first version had the residents line AND a footer reading `THIS TERMINAL IS UNATTENDED`.
Two wrong things is a haunted house; the bible says one. Nothing in the source looks wrong
about that -- both lines are perfectly ordinary strings -- and no checker I had would have
caught it. It came out of rendering the screen and looking at it.

So bible rule 1 is a machine leg now: the boot log's flagged-line count must be exactly one,
and the mutation that adds a second turns it red.

Two more defects from the same look, both fixed: the unit was a small box floating in a lot
of black, which reads as a dialog rather than a screen that covers everything, and the name
punched into the case was so subtle it was nearly invisible -- a cut letter needs a real
value step on both sides, not a whisper.

## 5. WHAT RUN NEEDS TO DO, AND IT IS FOUR LINES

    <script src="bohemia_loading_screen.js"></script>
    BohemiaLoading.mount(document.getElementById('front'));
    BohemiaLoading.expect(['world','art','sound']);      // whatever the real sources are
    // ...as each finishes a chunk:
    BohemiaLoading.report('world', chunksPainted, chunksTotal);
    // ...when the pad genuinely works:
    if (BohemiaLoading.ready().ok) { /* BEGIN lights by itself */ }
    BohemiaLoading.onBegin(function(){ /* open the game, and SOUNDS plays the first sound */ });

The names are RUN's to choose; the module has no opinion. `ready()` returning
`{ok:false, waitingOn:[...]}` is the module telling RUN it asked too early.

And SOUNDS measured the thing that makes BEGIN necessary
(records/BOHEMIA_A_LOADING_SCREEN_CANNOT_MAKE_A_SOUND_9_20_26.md): a browser will not start
audio without a gesture, so a screen that blocks the tap cannot make a sound. BEGIN is that
gesture, and the first sound plays on it. That was the coordinator's default and this build
honours it.

## 6. THE GATE

`gates/the_loading_screen_gate.js`, 29 legs, 0 failed, in the suite as LOADING SCREEN.

The hard leg is proved two ways, because either alone is cheatable: **in the source**, the
file contains no timer at all (a timer that exists can be pointed at the fill later by
somebody in a hurry); **on the glass**, it mounts, reports nothing, waits three real seconds,
and the fraction and the painted width are both still zero. Reading the source is not proof
-- this lane has been wrong about a file it had read twice.

It also holds WORDS' two conditions, on the glass and not just in the source: with nothing
reported no stage claims to be working, the stage that reported says its line while the one
that did not stays silent, and the slow line prints the real count.

Five mutations proved, each restored:

    make the bar a timer (the defect the gate exists for)          2 red
    add a second wrong thing to the boot log                       1 red
    let a stage speak before it reported (the promise rule)        3 red
    let the slow line invent its count                             2 red
    let ready() let go while a source is unfinished                5 red

AND TWO OF MY OWN LEGS CONTAMINATED THE ONES AFTER THEM, which is in here rather than quietly
fixed: the new promise-rule leg reports a stage and leaves it reported, so the next leg's
hand-typed "4 of 20" was wrong by exactly that much, and the end-state leg only finished the
sources it happened to remember. Both were replaced with better legs rather than bigger
numbers -- the arithmetic leg now checks the IDENTITY (the bar equals the sum of whatever is
reported) instead of a total I typed, and the end-state leg finishes every source that
exists. A leg that only works when nothing ran before it is not a leg.

## 7. THE COOK (rule 22)

`slices/BOHEMIA_FOUR_WAYS_THE_GAME_LOADS_9_22_26.html`, registered as
`ui-four-ways-the-game-loads-9-22`. Four at real phone size: the terminal that was built, the
same screen with no case at all (you are inside the machine), one enormous lit number instead
of a bar, and the bar as a single strip across the very bottom edge of the phone.
