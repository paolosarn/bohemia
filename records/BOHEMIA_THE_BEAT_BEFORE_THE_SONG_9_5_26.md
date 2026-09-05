# THE BEAT BEFORE THE SONG (9/5/26, SOUNDS lane)

VAMILY line 1 for this lane: **[heartbeat first] THE-BEAT-BEFORE-THE-SONG**, the
manager's own call. *"The city makes no sound and the law is 120 BPM. Put a
heartbeat on the walked street from the first second, before any song loads, at
120, quiet, that the first fight's music lands on."*

## MEASURED FIRST, ON THE REAL SURFACE

A headless run that tapped the splash and watched the master bus, sampling every
100ms with a timestamp:

    110 ms    the tap itself (ui_tap)
    401 ms    that sound is over
    ...       NOTHING
    9,824 ms  the next thing you hear

**Ten seconds of silence at the front door of the game.**

## AND THE CAUSE WAS NOT WHAT THE BRIEF ASSUMED, OR WHAT I ASSUMED

The obvious story is that the music is late. It is not. The opening music has
been wired since 8/19, and `MENUMUS.open()` is the last line of the splash
handler, after `runTab.click()` — which is where the 3.7 MB city iframe gets
built. So I expected the song to start after the build.

**It starts half a second after the tap.** The gate measured it: the handoff
happened 1 beat after the pulse began. The transport is not late.

**IT IS STARVED.** `MUS.start()` sets `playing = true` and then schedules notes
from a `setInterval(…, 25)` — on the main thread. The main thread is parsing a
3.7 MB document. The transport is running and cannot put a single note into the
audio graph for nine seconds.

That reframes the job. The silence is not a missing feature, it is a thread.

## WHICH ALSO BROKE THE FIRST INSTRUMENT I POINTED AT IT

The energy meter samples on a 100ms `setInterval`. Across the nine-second gap it
recorded **zero samples** — not zero energy, *zero samples*. A main-thread meter
cannot measure the one window this feature exists for. A gate built only on that
meter would report "still silent" on a build where the pulse was playing
perfectly.

So the gate proves the claims separately, and blocks the main thread for three
seconds **on purpose** to test the one that matters.

## THE DESIGN, AND WHY IT IS NOT A SCHEDULER

A beat driven by `setInterval` is impossible here: `setInterval` is the thing
that stopped running. A lookahead scheduler is not enough either — a four-second
horizon still dies in a nine-second stall.

**So the pulse is ONE looping `AudioBufferSourceNode`**, half a second long,
handed to the audio thread and never touched again. The audio thread does not
care that the main thread is building a city. It is also **exactly 120 BPM by
construction**: no scheduler, no drift, no jitter, which is what the law asks for
more cleanly than any timer could.

**What it sounds like:** a heart. Two low thumps, quiet, felt more than heard.
The gap between them is **0.3125 seconds, which is his own number** — `hits: [0,
0.3125]` from the approved `heartbeat` recipe he thumbed up 3 of 5 on 8/20.

**The shape is reused; the event is not touched.** `heartbeat` is labelled *"YOUR
HEART, TOO LOUD — low health, the sound that is inside your head, not in the
room."* Firing it here would tell the player they are dying. Reusing an approved
moment for a different meaning is not reuse, it is a lie in his own vocabulary.

**And it is MUSIC, not a candidate.** Two sines with a scheduled decay, on the
effects bus, no delay, no convolver, no feedback (7/8 screech law), one node. It
never enters the bank and never goes on a judging sheet. The music side of this
lane has always shipped without a per-sound thumb; MENUMUS did.

## THE HANDOFF, WHICH TOOK THREE TRIES AND EACH WRONG ONE TAUGHT SOMETHING

The brief's real ask is *"that the first fight's music lands on"* it.

    try 1  hand over in MUS.start()
           -> handed the beat to a song that then made no sound for nine
              seconds. STARTING A TRANSPORT IS NOT A SONG BEING AUDIBLE.

    try 2  hand over on the scheduler tick where step is still 0
           -> the timer fires every 25ms whether or not there is anything to
              book, so it ran once at half a second and handed over anyway.
              Covered 0.5 seconds of a ten-second silence.

    try 3  hand over INSIDE the booking loop, on the iteration that actually
           puts step 0 into the graph
           -> 12.9 beats of pulse, and the song lands on the beat.

And a fourth thing had to move. The pulse's supervisor — the 500ms check that
stops it when he is not looking at the game (8/16) — also killed it on
`MUS.playing`. That raced the scheduler after the block: whichever timer woke
first won, and when the supervisor won it took the pulse away *before* the
scheduler could ask where the next beat was, so the song re-anchored to `now +
0.06` and landed **29ms off its own beat**. The supervisor now only answers "is
he still looking at the game".

## A SECOND BUG, FOUND BY THE SAME MEASUREMENT

`MUS`'s scheduler books every step it is behind on, at times **in the past**,
and Web Audio plays those immediately. After a nine-second parse that is
**seventy-two sixteenths firing at once** — not a song coming in, a noise.

A transport more than a quarter second behind now **re-anchors** instead of
catching up, and it re-anchors onto the pulse's next beat: the beat the player
has actually been hearing.

## THE LEVEL WAS WRONG AND THE METER SAID SO

At my first guess of `0.085` the pulse peaked at **0.0678** against a footstep at
**0.0346** — louder than the quietest thing in the game, which is the opposite of
what he asked for. Scaled to `0.020`, landing at about 40% of a step.

## THE GATE

`gates/beat_first_gate.py`, 17 claims, measured on the real surface.

    A  the pulse never starts on the tap        -> RED x3
    C  the transport catches up, no re-anchor   -> RED (0.5s of cover)
    D  the level back to 0.085                  -> RED (louder than a footstep)
       restored                                    17 passed, 0 FAILED

**One more broken ruler of my own, and it is the usual shape.** The peak detector
used a fixed floor of 0.004. That was fine when the pulse peaked at 0.068 and
blind once the level came down to sit under a footstep: it started missing
thumps and reported lub-to-lub gaps of 1.01 seconds, which is a dropped beat, not
a slow one. **A detector with a fixed threshold measures its threshold.** The
floor is a fraction of the measured peak now. (And the first version of the
tempo check did not know a heart has two thumps, and called lub-dub-lub a broken
tempo.)

## WHAT HE WOULD NOTICE

Tap the front door. Instead of ten seconds of nothing while the valley loads,
there is a slow low pulse under it, quieter than your own footsteps, and when the
first song arrives it walks in on that beat instead of appearing.

Tab: **RUN** (the walked city), from the splash. Nothing to judge — no sound was
cooked and nothing entered the bank.
