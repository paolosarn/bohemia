# EYES AND EARS -- E8 [first minute]: THE ORDER, AND THE RULE THAT CAME OUT OF BUILDING IT
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E8 asked what a human art reviewer does in the first sixty seconds with a new asset, what an
audio reviewer does in the first ten seconds with a sound, and to turn both into the order
this lane checks things in.

**The order is written down, and it is now a command.** `node tools/bohemia_eyes_round.js`
runs the whole round in the reviewer's order.
Order: `banks/eyes/BOHEMIA_EYES_THE_ORDER_9_5_26.json` (draft:true).

---

## WHY AN ORDER MATTERS AT ALL
This lane owns ten instruments as of today. Run in any order they produce a pile of numbers.
Run in a reviewer's order they produce a REPORT, because **a reviewer's order is not
arbitrary: each step is only worth doing if the one before it passed.** Nobody checks a
palette on a screen that never rendered, and nobody judges a sound's material before knowing
it is audible.

## THE ART ORDER -- THE FIRST SIXTY SECONDS
How directors actually review: **the squint and thumbnail test first** (black it out, shrink
it: does the thing still read, does the focal point survive at any size), then **VALUE BEFORE
COLOUR** (strip the colour; if everything blurs together, saturation was carrying the image
and contrast was doing nothing), then silhouette, then colour, then detail.

| at | the step | what it asks | our instrument |
|---|---|---|---|
| 1s | **is it there** | did it render at all | the eyes gate: a live canvas in any frame |
| 5s | **the squint** | shrink it -- does it still read | the reference score's read-at-play-size |
| 10s | **value, not colour** | is contrast doing the work | the readability pass over the finished picture |
| 15s | **does it fit the glass** | nothing off the edge, no text wider than its box | the eyes gate |
| 30s | **is it the same world** | detail order, colour density, saturation, value band, grain, light | the reference score |
| 60s | **the craft** | orphans, banding, jaggies, mixels, the key | the craft gate plus this lane's two tells |
| then | **TASTE** | does it belong here; is this the same game two taps apart | **Paolo. Never a machine.** |

## THE SOUND ORDER -- THE FIRST TEN SECONDS
The broadcast QC pass, in its own order: clarity first, then no clipping at true peak, then
the bed never masking what matters, then effects calibrated to what they sit under, then
loudness inside the window, then stereo image with no phase issues, and finally **mono
fold-down intelligibility** -- which for us is not a formality, because a phone speaker IS
the mono fold-down.

| at | the step | our instrument |
|---|---|---|
| 1s | **is there a sound at all** (with a positive control) | the live harness |
| 2s | **is it too hot** -- true peak, clipping | the ears |
| 4s | **can he hear it** on a phone, and what survives above 500 Hz | the ears plus the weak list |
| 6s | **is it the thing** -- does it read as its material | a person |
| 10s | **does it sit** -- against music and steps, and in mono | **nobody yet.** E5 gap 10 |

## RULE ZERO, AND IT COST THIS LANE THE WHOLE ROUND TO LEARN

**A ZERO NEEDS A POSITIVE CONTROL.**

Building the runner meant running every instrument end to end for the first time, and the
sound step reported that the game rendered no sounds during a walk -- again. The dedicated
experiment from E5 had already proven the opposite (31 steps, 32 renders). Chasing the
disagreement found this: **the live harness's render counter and footstep counter were read
from variables that NOTHING INCREMENTED.** The wraps that were meant to set them had quietly
stopped being in the file. A counter nobody increments reads zero forever, and zero looks
exactly like silence.

Both hooks are installed now, by bare name, and **the tool fires one sound by hand after
every run and checks that the counters move.** If they do not, it prints that its counters
are blind instead of reporting silence. With the control in place: **41 renders and 40
footstep calls in 20 seconds of walking**, all `step_dirt`. The harness now agrees with the
dedicated experiment, which is what agreement is supposed to look like.

That rule is now the first line of the order, above the art side and the sound side both.

## WHAT THE RUNNER DOES
`node tools/bohemia_eyes_round.js [--quick]` runs, in order: the gate (is it there, does it
fit the glass, and the self-test), the readability pass, the 27-screen picture pass, what
moved since last round against each screen's own noise floor, the craft tells across the art
banks, and the walk with the audio engine proven alive. Then it prints the taste questions it
will not answer.

## ROUTED
- **EYES AND EARS**: E9 is the standing duty and it is the last open line in this lane. The
  runner is what makes it a command instead of a promise. The mix meter (E5 gap 10) is the
  one instrument the order names and this lane does not have.
- **THE FLEET**: rule zero is not this lane's alone. Any gate that reports "0 found" without
  a control is a gate that might be blind, and there are 500-odd of them.
