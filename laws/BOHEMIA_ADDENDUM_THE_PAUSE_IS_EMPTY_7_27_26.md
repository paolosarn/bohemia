# BOHEMIA ADDENDUM — THE PAUSE IS EMPTY (7/27/26, LOCKED)

> Paolo, six times across a week, about the same orange:
> "the dead shot dial can like fade away so by the time there's that pause the
> dead shot dial is not there... it kind of looks like shit"
> "The orange shit from the dead shot. Dial is still there by the time the game pauses."
> "kill shot orange box doesnt fade away bro"
> "that orange part of the dead shot dial is still there not fading away"

---

## 1. THE LAW

**WHILE THE WORLD IS FROZEN, NOTHING DECORATIVE DRAWS.**

The hit-stop exists so the player looks at one thing: the consequence. Anything
that is a flourish — a wash, a pulse, an instrument, a payout, a glow — is not on
screen during the stop. Not dimmed. **Absent.**

And its corollary, which is the part that actually cost six rounds:

**A PINNED CLOCK DOES NOT STOP A DRAWING. IT WELDS IT ON, AT ITS BRIGHTEST.**

`dt=0` freezes the simulation. Anything whose *appearance* is a pure function of a
value the freeze pins holds at whatever it had — which, for a decay, is its
maximum. Four separate effects in this codebase were the same bug:

| effect | its fade rode | fixed |
|---|---|---|
| the floor pulse | `_bpmPhase` (pinned by v82) | v84 |
| the gold payout chip | `p.t`, which rides `dt` | v85 |
| the killshot white punch | `ks.t/ks.dur` (633ms of white measured) | v86 |
| **the chain-escalation glow** | `1-p` against `ks.dur` | **v87 — this one was his** |

Fixing them one at a time is how it took a week. Hence the rule.

---

## 2. WHY FIVE REPRODUCTIONS FOUND NOTHING

**EVERY PROBE I EVER WROTE KILLED ONE MAN. PAOLO PLAYS WHOLE ENCOUNTERS.**

`CHAIN ESCALATION` only draws at `killStreak >= 2`. It is a FULL-SCREEN radial
wash, `rgba(255,60,40)`, brightest at the screen EDGE — which is exactly where the
dial sits, which is why he named the dial and why I kept measuring the dial's own
arcs and correctly finding them at zero alpha. He was pointing at the right pixels
and calling them by the nearest landmark.

MEASURED at a 3-streak, by recording the colour stop the game actually asks for:

```
+  875ms   ks.t=0.871   freeze=0      rgba(255,60,40) alpha=0.199
+ 2284ms   ks.t=0.969   freeze=HELD   rgba(255,60,40) alpha=0.190
```

1.4 seconds of wall time. 0.009 of fade.

AND IN PIXELS, on the freeze frame, mean colour of the outer 12% of the screen:

```
before   rgb(70.8, 53.1, 42.4)    380 warm px
after    rgb(25.7, 24.8, 31.0)      0 warm px
```

**THE HARNESS RULE THIS FORCES: reproduce at the STATE HE PLAYS IN, not the
cheapest state that runs.** A one-kill harness cannot see a streak effect, a
full-health harness cannot see a wounded one, a fresh-fight harness cannot see
anything that accumulates. *If the bug report mentions "by the end of my
encounters," the harness must get to the end of an encounter.*

And the second harness rule, also earned this week: **thresholds hide bugs.** Five
pixel scans came back clean because they tested `r > 100`, and `rgba(255,60,40)` at
alpha 0.19 over this floor composites to about `rgb(72,31,24)`. The wash was in
every screenshot I took. My filter deleted it.

---

## 3. WHAT SHIPPED

1. **THE STREAK GLOW BLOOMS AND LEAVES.** One beat (`JUICEMS.streak = note(4)`),
   on the wall clock, and it does not draw during a stop. It celebrates the streak
   on the shot and is gone before the pause lands — which is what he asked for the
   first time he raised it.
2. **THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP.** `_df` — the single alpha
   that owns the entire dial, from the first band to the reticle — is forced to 0
   while frozen. Safe by construction: the demo already resets `globalAlpha` to 1
   immediately before `drawKillshotWorld` ("dial fade never touches the killshot
   world"), so the bullet, the blood and the bodies are on the far side of it.
   The dial is the instrument, the pause is the consequence, and they are never on
   screen together **whatever the timing math works out to on a device I do not
   have.**
3. **WHAT'S ON SCREEN v2.** The v84b instrument could never have found this: it
   hooked fills only, over a 2% size floor, and a gradient fill stringifies to
   `[object CanvasGradient]` — a string with no colour in it. It now watches
   strokes and gradient colour stops, and keeps anything WARM at any size.

---

## 4. THE MACHINE GATE

`gates/combat_lab_gate.js` section 22, 9 checks: the glow rides the wall clock
against `JUICEMS.streak` and is skipped while frozen; the old `(1-p)` form is gone
by exact source; `_df` is zero while frozen and the old form is gone; the
`globalAlpha=1` reset still sits between the dial and `drawKillshotWorld` (source
ORDER, so the safety argument itself is enforced); `isWarm` is EXECUTED against
real rgba and hex, warm and cool; a tiny warm draw is kept where a tiny cool one
is dropped; and all three earlier pause fixes still stand.

A law without a machine gate is not enforced.
