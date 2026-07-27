# BOHEMIA ADDENDUM — REPRODUCE BEFORE YOU FIX (7/27/26, LOCKED)

> Paolo, five times in one session:
> "There's a brown square that covers everything."
> "That brown box is absolutely still there... I didn't even see you do anything."
> "Literally, the brown box is still there and the dead shot dial orange part is
> still there like what's wrong with you, bro."
> "Brown box still their kill shot orange box doesnt fade away bro."

Five reports. Five fixes shipped. Five misses. That is not five bugs, it is ONE
process failure repeated five times, and this is the law that ends it.

---

## 1. THE LAW

**FOR ANY DEFECT PAOLO REPORTS VISUALLY, THE FIRST DELIVERABLE IS A REPRODUCTION,
NOT A FIX.** A captured frame, or a named draw with its colour, its screen-space
size and its position. Until that exists, no patch tool gets written.

**A FIX FOR SOMETHING I CANNOT REPRODUCE IS A GUESS, AND A GUESS SHIPPED AS A FIX
IS A LIE.** It costs him a turn, it costs him trust, and it teaches him that
"fixed" means nothing.

**A SECOND REPORT OF THE SAME SYMPTOM ENDS THE GUESSING IMMEDIATELY.** The turn
after a repeat report is spent on the instrument, not on another theory. Writing
a third version of a fix means the diagnosis is wrong, not the patch.
(This is STOP PRODUCING applied to bugs: the tell is the version number.)

---

## 2. WHAT THE FIVE MISSES ACTUALLY WERE

| # | What I did | Why it missed |
|---|---|---|
| v81/v82 | Reasoned about freeze code | Never watched it run |
| v83 | Deleted placeholder slabs `#3a3228`, `#5a4a38`, `#241c14`, `#4a4038`, `#5a4a3a` | Right *class* of object, wrong objects. The real one is `rgba(70,60,50)` |
| v83 | Re-derived the dial fade | Faded a thing that was already gone |
| v84 | Floor pulse silent during freeze | A REAL regression I had caused, but not his brown box |
| v84c | Faded the road median | A real brightness problem, not his orange |

Three separate probes lied to me before the sixth one told the truth:

- `getImageData` reported "still" while the game was visibly running.
- A screenshot hash called 473 changed pixels out of 329,160 "MOVING".
- **The harness bug that caused three of the five misses:** my probe kept setting
  `G._freezeT` in order to photograph the cinematic. Setting `_freezeT` sets
  `dt=0`, which halts `ks.t`. *The instrument was stopping the thing it was
  measuring.*
- `boxes.js` measured raw `fillRect` ARGUMENTS. A `6*S x 7*S` square inside a 3x
  camera zoom read as tiny and my own size threshold threw it away. The bug was
  in the report the whole time, filtered out by me.

---

## 3. WHAT A REAL REPRODUCTION LOOKS LIKE (the shape to copy)

`scratchpad/spot.js`, the sixth attempt and the first honest one:

1. Hook `fillRect`, `drawImage`, and `arc`+`fill`/`stroke` — **the dial is drawn
   with STROKES, so every fill-only probe was structurally blind to it.**
2. Convert every draw into SCREEN space through `ctx.getTransform()`. Raw
   arguments are meaningless inside a camera.
3. **Let the cinematic RUN.** Never drive the state you are measuring.
4. Dump everything landing on the body at the frozen frame.

It answered in one run, with both complaints named:

```
THE BROWN BOX    fillRect  rgba(70,60,50,0.984)   @197,272   42x50
THE ORANGE ONE   arcFill   rgba(255,200,70,0.55)  @197,237   9x9 + glow + trails
```

---

## 4. THE TWO ANSWERS

**THE BROWN BOX** was `drawKillshotWorld`'s `LEGACY_PRE_REVAMP (3)` stand-in body.
Its alpha is `1-ip*0.8`, and `ip` is 0 at contact, so it was never translucent at
the moment that matters — it was a SOLID slab. The quantized freeze holds `ks.t`
still, so it stayed solid for the whole stop.

**It carried Paolo's own note from 7/3/26:** *"still drops/fades ON TOP of the real
sprite death playing underneath ... fine for now, delete at cleanup."*

Which means the answer to the OTHER thing he asked three times — *"the animation
that should be starting to play is the headshot one and headshot two animation"* —
was the same single line. **The clip was never missing. A placeholder square was
parked on top of it.** A 12-frame death clip, three rolled variants, contact-timed,
playing correctly, invisible.

**LESSON WITH TEETH:** a `LEGACY_PRE_REVAMP` marker with a Paolo date on it is a
BUG WITH A DEADLINE, not a comment. When he reports something in that neighbourhood,
the marked placeholders are the FIRST suspects, not the last.

**THE ORANGE ONE** was the JUICE.T ghost chip, the gold payout mote. It spawns AT
contact — the same instant the freeze starts — and its flight rides `p.t`, which
rides `dt`, which is 0 while the world is stopped. So the payout hung on the corpse
for the entire pause. "Doesn't fade away" was literally correct.
**The stop belongs to the kill. The reward comes after it.**

---

## 5. THE GENERAL BUG CLASS THIS EXPOSED

`dt=0` freezes the SIMULATION. It does not freeze anything driven by
`performance.now()`, and it does not freeze anything whose *appearance* is a pure
function of a pinned value.

Three of this session's five bugs are the same shape:

- v82 pinned `_bpmPhase`; the floor pulse's brightness is a function of it, so a
  full-screen accent wash WELDED ON (fixed v84).
- The placeholder slab's alpha is a function of `ip`, which rides `ks.t`, which is
  pinned; so it welded on at full opacity (fixed here).
- The chip's whole flight rides `p.t`, which is pinned (fixed here).

**RULE: when you pin a clock, audit everything that READS it. A pinned clock does
not stop a drawing — it FREEZES it at whatever value it had, which is usually the
brightest one.**

And its mirror image, also fixed here: `visNow()` correctly held the death clip on
frame 0 through the stop, but `_deadAt` is raw wall time, so the instant the world
moved the clip snapped forward to frame 4 of 12. **The drop he paused FOR was the
part that got skipped.** Every body timestamp now advances by exactly the frozen
duration on release. **A pause you do not pay back is a skip.**

---

## 6. THE MACHINE GATE

`gates/combat_lab_gate.js` section 20, 9 checks:

- the slab is DELETED, by exact source, and cannot come back
- the real death clip is still contact-timed and still rolled three ways
- the chip does not draw during a freeze, and the chip itself is unchanged
- `visNow()` exists and BOTH body render passes read it (no `performance.now()`
  left in either)
- every body timestamp is paid back the frozen duration
- the debt is paid exactly once (`_fzNow` cleared in the same branch that pays it)
- v84's two fixes both still stand, so this turn added instead of trading

A law without a machine gate is not enforced.
