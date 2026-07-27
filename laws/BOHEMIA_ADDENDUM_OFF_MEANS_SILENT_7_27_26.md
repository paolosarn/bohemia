# BOHEMIA ADDENDUM — OFF MEANS SILENT (Paolo 7/27/26, LOCKED)

> "when im in the run i press the music button off and the music still plays"

---

## THE LAW

**A control that says OFF makes the thing stop. Not the flag that describes the
thing — the thing.** A button whose state is right and whose effect is wrong is
worse than no button, because the game is now lying to his face while he taps it.

This binds every toggle in Bohemia, not only music: mute, pause, lights,
whatever a future session adds. If the surface says off, the surface IS off.

**AND ITS GATE ASSERTS THE EFFECT, NEVER THE FLAG.** A gate that round-trips the
boolean proves the message arrived. It cannot prove anything stopped. So the
check reads the thing the player actually experiences — for audio, the master
gain in the live graph — and it checks BOTH directions, because a control that
can never come back on is the same bug wearing the other hat.

---

## WHAT WAS ACTUALLY WRONG

`MUS.stop()` cleared the step scheduler and set `playing=false`. That is all it
ever did.

The scheduler books notes AHEAD of real time — `while(nextT < currentTime+0.12)`
— and every voice it books is a real WebAudio node with its own envelope,
scheduled to sound at an absolute future time and to release on its own
schedule. **Killing the scheduler stops new notes being QUEUED. It does not
touch a single note already in the graph.** A pad, a horn or anything with a
long release goes right on sounding after the button says OFF.

The old gate asserted `musicOff === false && musicOn === true`, and both of those
were true the whole time. The flags were never the problem. The flags were the
reason nobody caught it.

## THE FIX

Everything routes through one master gain, so the master is what gets cut:

- `MUS.stop()` ramps `MAST.gain` to **0 over 60ms** (ramped, so it ducks instead
  of clicking) after cancelling any scheduled values. That silences what is
  already in flight as well as what was about to start.
- `MUS.start()` ramps it back up to 0.8 over 40ms, or the next press would be a
  silent one.
- `CITYMUS.stopShuffle()` now calls `MUS.stop()` **unconditionally**. It used to
  be guarded by `if(MUS.playing)`, so any desync of that one flag left OFF
  pressed and the audio still running with nothing willing to stop it. `stop()`
  is idempotent; the guard only ever cost us.

## THE GATE

`gates/run_gate.js` drives the real synth in the real alpha and reads the real
master gain:

| assertion | what it would have caught |
|---|---|
| the gate drove the REAL synth — a live audio context at full master | a gate passing against a synth that never started |
| **OFF MEANS SILENT — the master really goes to zero, not just the scheduler** | **this bug** |
| ON after OFF is not a silent build — the master comes back up | a fix that mutes the game permanently |

Proven by running the assertion against the pre-fix code: `playing:false`,
`timer:false`, **`gain:0.8`**. Flags perfect, sound still on.

## THE TRAP THAT HID IT FROM THE FIRST PROBE

`MUS` is declared `const MUS = {...}` at the top level of a classic script. That
puts it in global LEXICAL scope, **not on `window`** — so `window.MUS` is
`undefined` and any probe written as `window.MUS && MUS.MAST` silently reports
`null` forever and passes on nothing. Reference it bare. (`CITYMUS` is fine: it
is explicitly exported with `window.CITYMUS = CITYMUS` so same-origin iframes can
call it inside the tap gesture.)
