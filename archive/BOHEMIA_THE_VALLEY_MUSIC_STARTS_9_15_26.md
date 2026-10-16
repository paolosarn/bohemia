# THE VALLEY'S MUSIC STARTS (9/15/26, SOUNDS lane)
## [music owned] — two breaks in what he plays, both measured, both mine

---

## ONE: THE STREET'S MUSIC COULD NEVER START ON A BOOT THAT STUTTERS

Measured on the shipped alpha, cold boot, polling both music flags for 62 seconds:

    17.5s  menu=1 city=0 step=1
    28.0s  menu=1 city=0 step=25
    28.6s  menu=1 city=0 step=1      <- reset
    30.4s  menu=1 city=0 step=15
    31.4s  menu=1 city=0 step=1      <- reset
    36.1s  menu=1 city=0 step=39
    37.3s  menu=1 city=0 step=1      <- reset

    66 distinct states in 62 seconds, and MENUMUS.on NEVER went false.

The opening hands over at `MUS.step >= 128`. **The counter never got past 39.** So the
opening song restarted forever and the valley's music never played at all.

### THE CAUSE IS A GOOD FEATURE WEARING A SHARED COUNTER

`__THE_BEAT_BEFORE_THE_SONG__` zeroes `MUS.step` whenever the transport falls more than
a quarter second behind, and it exists for a reason it wrote down plainly: catching up
booked *"SEVENTY-TWO SIXTEENTHS at once: not a song coming in, a noise."* That re-anchor
is right and it stays.

The defect is that **one counter carries two jobs**: the transport's position, which a
re-anchor *must* zero, and the opening's egg timer, which nothing should. A 24-second
city parse resets the timer before it can ring — and so does any phone.

> **A COUNTER THAT ANOTHER SYSTEM IS ENTITLED TO RESET CANNOT BE USED AS A TIMER.**

### THE FIX, AND NO NEW NUMBER

The opening now *also* watches the **audio clock**, which a re-anchor does not move, and
hands over after one phrase of real audio time — `phraseMs()`, the engine's own unit,
already shared with the street's rest and the drum hold.

The step check **stays, as an OR**. On a clean boot the counter still wins and the
handoff is exactly what it always was, on the phrase, to the step; the clock is the floor
underneath. And when the clock wins, the player *has* heard a full phrase, because the
re-anchors kept the opening audible the whole time — that is what they are for — so it is
the honest moment, not an early cut. The timestamp is cleared when the opening starts, so
a second opening in one session cannot hand over instantly off the first one's.

    BEFORE   62 s, 66 states, never handed over
    AFTER    handed over at 16.7 s — menu=0 city=1, street song REPO MAN

---

## TWO: A SIDEWALK SOUNDS LIKE A DIRT PATH

Measured with an ear on the demo he played, five real minutes: the city posted 28
`step_dirt` and one `step_concrete`, and the live step bank held **three** surfaces.

    var ev = 'step_' + ({asphalt:'asphalt',dirt:'dirt',gravel:'gravel'})[surface] || 'dirt'

A map of three and an `|| 'dirt'`. **And it was never a missing cook.** His newest
approved bank carries six footstep surfaces: asphalt 5, dirt 5, gravel 5, **concrete 1,
sand 1, wood 2**. The game embedded a block from before those were thumbed.

> **THE BANK HE APPROVED AND THE BANK THE GAME LOADS WERE DIFFERENT BANKS, and the
> difference was silent — a fallback means nobody hears a MISSING surface, they hear the
> WRONG one.**

Fixed both ends: the block is rebuilt from his bank (every variant copied byte for byte,
nothing authored), and a surface plays itself with dirt kept as the last resort rather
than the rule. **Wood is left out on purpose** — no wooden ground exists in the valley,
measured across 18 districts, and an unreachable sound in a bank makes a census lie.

### AND THIS LANE'S OWN BOARD LINE SAID THE OPPOSITE

Its words: *"all five reachable footstep surfaces are walked onto and fired (dirt,
concrete, asphalt, gravel, sand)."* False for the shipped alpha, and false since it was
written. The 9/5 round measured the city's **classifier**, which really does name five,
and never checked that the shell could play them.

> **A CENSUS OF WHAT IS ASKED FOR IS NOT A CENSUS OF WHAT CAN SOUND.**

The board line is corrected in the same round.

---

## AND LAST ROUND'S REST IS PROVEN AT LAST, BY ITS OWN GATE

    rest 15,903 ms of a 16,000 ms phrase
    master ducked to 0.096  — the floor, 12% of his 0.8, NOT zero
    bed air_day speaking inside the gap
    25 passed, 0 failed

Getting there meant **three fixes in the gate**, and every one was the instrument:

1. **It was red on main before this round, and the red was telling the truth.** Proved
   with a worktree at the parent of the rest commit: 9 failures there, 8 after, and the
   extra one named the cause — *"the opening handed over on its own, unforced."* Every
   pass-end number read null because `restBlocked()` refuses while the opening owns the
   music, and the opening never let go. **The gate had been reporting the defect above
   for days and nobody read it.**
2. **A VALUE ANOTHER SYSTEM IS ENTITLED TO RESET MUST BE RE-ASSERTED, NOT SET.** The
   probe assigned `MUS.step=1020` once and waited; the re-anchor wiped it before the
   watch's 300 ms tick could read it. It holds the pass end now, and the real branch
   still does the work.
3. **A MEASUREMENT THAT STARTS AFTER THE EVENT MEASURES WHAT IS LEFT OF IT.** `restMs`
   started its clock after a 2,000 ms settle and a six-tick bed test, so it measured the
   rest's *remainder* and compared it against a full phrase: 12,359 ms against a 13,000
   floor, red, on a rest that was 16 seconds long. 16,000 minus the 3,641 the probe had
   spent.

---

## ONE OPEN QUESTION, WRITTEN DOWN AND NOT GUESSED AT

Straight after the handover, `MUS.cur` was found sitting on a **faction** song —
VOLUNTEERS on one run, MOB on the next, persisting a full 8 seconds.
`CITYMUS.candidates()` can only ever return `MLOOPS` entries, so **the street cannot have
picked either of them**; something else owned the transport. A clean probe of the same
handover showed a creeper (REPO MAN), so it is not constant.

That is not forced green and not explained away: the room gate now asks the street to
pick — which is what its claim is actually about, the room's takeover — and **records what
held the transport before it did**, so the next round starts from the observation instead
of rediscovering it.

REUSE CHECK: cooks nothing. No bank candidate, no pixel, no new sound, no new event, and
no new number: the phrase is the engine's own, and every footstep variant is one he
already approved.

    python3 gates/bohemia_gates.py --only "STREET BREATHES"

Build 9/15b - THE VALLEY MUSIC STARTS.
