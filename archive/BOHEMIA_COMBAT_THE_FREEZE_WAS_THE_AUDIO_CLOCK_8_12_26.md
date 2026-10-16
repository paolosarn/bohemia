# THE FREEZE WAS REAL, AND IT WAS THE MUSIC CLOCK

**8/12/26 — COMBAT lane. Answers Paolo: "idk i pressed wait hella and when i
went to shoot someone the game froze bro"**

---

## FOUND IT, AND IT IS NOT WHERE EITHER OF US WOULD HAVE LOOKED

It is the music scheduler. One loop:

```js
while(_seq.next < ahead){ playStep(...); _seq.step++; _seq.next += stepDur(); }
```

That runs on a 25ms timer and catches the music clock up to the audio clock one
0.125-second step at a time — **replaying every step it missed.**

Timers do not fire on time. They fire late when the tab is backgrounded, when
the phone locks, when the OS is busy. **The audio clock never stops.** So the
gap is however long the timer was starved, and the loop has to walk all of it:

**Measured on the build that is live right now — steps scheduled in ONE tick:**

| stalled for | old | fixed |
|---|---|---|
| 10 seconds | **81** | 1 |
| 1 minute | **481** | 1 |
| 5 minutes | **2,401** | 1 |

Every one of those builds and schedules real audio nodes. A few hundred in a
single tick takes the main thread away.

**That is why it reads as a freeze and not a crash.** Nothing throws. There is
no error. The thread is just gone, inside a loop, scheduling music that already
happened. And "pressed wait hella" is exactly the shape that causes it: a long
session with real time passing between taps, phone sleeping and waking.

## THE FIX

**Resync instead of catching up.** Steps missed during a stall are in the past
and can never be heard, so the counter jumps to where the music *would* be.
Silence during a stall is correct; a stampede of stale notes is not.

**And the loop is bounded anyway.** A tick only ever needs one or two steps, so
the cap is 64 — a hundred times real headroom, and hanging becomes impossible.
The resync fixes the cause I can name; the cap fixes the ones I cannot. An
unbounded loop inside a 25ms timer is a hang waiting for an excuse, and this one
already cost him a session.

---

## THE OTHER HALF: "WAIT WHERE I'M AT UNTIL MFS WANNA GET IN MY RANGE"

Measured, 60 arenas, doing nothing but pressing WAIT:

| | |
|---|---|
| turns before anything is shootable | **14.9** |
| damage taken while waiting | **49.3** — half your health |
| turns spent exposed to a live gun | 10.2 |

**So waiting is not free — it costs half your HP.** But that is not really his
complaint. The number that matters is the first one: **fifteen turns where the
only button that does anything is WAIT.**

The approach phase has no verbs. You cannot shoot (out of range), so you wait,
and you bleed. That is not a dominant strategy, it is an *empty* one, and it is
the honest next problem: **the approach needs something to do that is not
shooting.** Moving to better ground, breaking their locks, choosing which one
reaches you first. The material is already in the game — RUN works properly now,
cover is real, and their acquisition already resets when you break a line.

**I am not building that in the same breath as the freeze fix.** I have guessed
wrong twice today by building on top of an assumption instead of a measurement,
and the freeze is a blocker that ships on its own.

## ONE MEASUREMENT I THREW AWAY

The first version of the waiting table said "HP left 0.0, damage taken 1.7" —
two numbers that cannot both be true. Health was carrying over between arenas,
so every run after the first began with a dead player. Fixed and re-run rather
than reported. A number that contradicts itself is the cheapest kind of wrong to
catch, and I nearly shipped it.

Tool: `tools/bohemia_combat_the_scheduler_cannot_hang_patch.py`
Gate: `gates/combat_lab_gate.js`, 757 → 760 checks.

**WHERE TO SEE IT: the COMBAT tab.** Nothing looks different. The game just
stops being able to stop.

---

Sources:
- [A tale of two clocks — web.dev](https://web.dev/articles/audio-scheduling)
- [Timing and Scheduling — IRCAM Web Audio Tutorials](https://ircam-ismm.github.io/webaudio-tutorials/scheduling/timing-and-scheduling.html)
- [Why your metronome should never use setInterval](https://perfecttune.net/articles/why-your-metronome-should-not-use-setinterval.html)
