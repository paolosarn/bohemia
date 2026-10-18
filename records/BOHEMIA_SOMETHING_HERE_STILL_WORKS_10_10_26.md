# SOMETHING HERE STILL WORKS (SOUNDS, 10/10)

Paolo, direct to this chat, unpausing rule 88's hold for this lane only: "you gotta
create more of the best sounds of all time instead of implementing mid sounds... can u
impress me from now on." His ruling is recorded in full in VAMILY.md's MODE line for
this lane. This is the first swing at it: not another line off the keep/redo list, an
ambitious, memorable moment.

## The moment

Finding something genuinely rare in a dead valley where almost nothing works any more.
The object still works, and for a second, so does the world around it.

## The materials: both already shipped, neither one new

- The bell: `struckMetal`'s own founder-tuned minor third (`STRIKE.bell`), the exact
  same table entry `[bb ambience]`'s hourly chime already plays. A found object that
  still rings true is the voice of the moment -- bright, immediate, the transient.
- The hum: `powerOnHum`, already shipped -- a transformer's core pulling in, rising
  from 40 to 120 Hz over 0.6 s. The valley itself catching up to the object, the
  sustained body under the ring.

Zero new material, zero new table entries. Every composite sound this lane has built
before this one (`canOnWood`, `barGlassDown`, `weaponBlock`, `partsPass`) is a flat sum
of two layers at a fixed ratio.

## The technique: a real sidechain duck, the first one in this file

A real mixer, hearing a bright transient and a sustained tone compete for the same air,
pulls the sustained layer back while the transient is loudest and lets it breathe back
up as the transient fades. `legendaryFind()` builds an actual envelope follower off the
bell's own amplitude (2 ms attack, 120 ms release, the standard detector shape) and uses
it to duck the hum in real time:

```
duck(t) = 1 - duckAmount * (env(t) / peak(env))
```

`duckAmount` defaults to 0.6. This is not a fade or a static mix ratio -- it reacts to
the actual rendered bell buffer, sample by sample.

## Measured, not assumed

Two renders at the duck's own extremes (0 and 0.9) are compared in two windows:

- **Right at the strike** (the first 50 ms, where the bell's envelope is near its
  peak): the two renders differ by 0.1847 rms. A real duck has the most hum to pull
  back exactly here.
- **Two seconds in** (where the bell has mostly decayed): the two renders differ by
  only 0.0240 rms -- 7.7x less. A real envelope follower releases as the thing driving
  it quiets down; it does not hold a fixed cut for the whole buffer.

That ratio (large difference early, small difference late) is the actual proof the duck
is really happening over time, not a label on a flat sum.

## Gates

`gates/cooked_sounds_gate.js`: three new claims (both materials present and unchanged
from their shipped tables; the duck proven real at the strike; the duck proven to
release as the bell decays), 233/0 (was 228/0). All three bite under `--mutate`, the
falsifier replacing `H.legendaryFind` directly (the usual closure-trap fix, since it
calls `struckMetal` and `powerOnHum` by closure).

## VOTE

`sounds-something-here-still-works-10-10`, draft:true, on
`slices/BOHEMIA_SOMETHING_HERE_STILL_WORKS_10_10_26.html` (the real thing against the
same two materials flat-summed with no duck, so the difference is audible, not just
claimed).
