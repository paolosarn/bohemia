# LOADED IS NOT ARRIVED (8/20/26, WORLD lane)

> This morning his 348 traffic signal sprites turned out to be **loaded, correct, and drawing
> nowhere** for weeks, while the check that said *"his sprites are LOADED in the browser"* was
> green the entire time. That is not a one-off. It is a shape.

## THE QUESTION NOTHING HAD EVER ASKED

Every art pool on the walked surface is reached through a **lookup**: a colour, a flag, a
district name. When the thing the lookup keys on changes underneath it, the art stops
appearing and **nothing anywhere goes red**, because every existing check asks whether the
art *loaded*. So this gate asks the other question: **did it end up on a canvas.**

It hooks `CanvasRenderingContext2D.prototype.drawImage` and counts real draws across 58
renders of the walked surface covering 36 district types, plus the CITY view.

| pool | result |
|---|---|
| district heroes | **3,664 draws**, 60/60 loaded |
| traffic signals | **6 draws** — zero this morning |
| street / building pools | **3 of 21 draw** |

## THE BIG ONE, AND IT IS NOT MINE TO FIX

Street art is chosen by **ground colour**, through `SA_MAP`, whose keys are the old
parametric street colours (`#8a8a86`, `#7a7a76`, `#5e5e5a`, `#4a4a48`, `#c8c4b8`…). Since
**A ROAD WITH ITS OWN MODULE DRAWS ITSELF** (8/18–8/19), roads emit their generator's own
palette instead (`#33333c`, `#6a5f47`, `#8a8a92`, `#a09a8a`…).

**Measured: 44,376 road ground cells sampled across 24 road cells. ZERO map to an approved
street tile.**

His harmonized 7/14 bank — roadway, kerb, shoulder, crossings, medians, lane markings —
reaches **no road in the valley**. That is `STREETS ARE THE HARMONIZED POOL` (Paolo 7/31,
LOCKED) failing valley-wide, in silence, for two days.

**I did not fix it.** The fix is a mapping from each new road tile to the bank pool it should
wear, and that is a decision for whoever authored those road tiles — the other WORLD session,
who are actively in that file. Handed over with the numbers instead of guessed at: ONE
SYSTEM, ONE SESSION.

## THE GATE IS THE MACHINE THAT LAW NEVER HAD

*A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED* — proven 7/16, when six of nine gated laws
turned out to be already broken. `STREETS ARE THE HARMONIZED POOL` had no gate at all, which
is exactly why this could be true for two days with every suite green.

**Ratchet, not a cliff.** The 18 silent pools are named, may only shrink, and no pool outside
the list may go quiet. A gate that is red on day one is a comment nobody can act on.

Both mutations bite, and the first is the **exact historical regression**: point the signal
code back at the old flag and this gate fails on *"his 7/17 TRAFFIC SIGNALS arrive (0 draws)"*.
**It would have caught the signal loss the day it happened.**

## MY OWN METHOD WAS WRONG TWICE BEFORE IT WAS RIGHT

Worth writing down, because both errors would have produced confident, alarming, false
findings:

1. **I hooked only the visible canvas.** Street art bakes into **per-chunk canvases**, a
   different context entirely, so the first sweep reported zero draws for pools that were
   working fine.
2. **I swept only the walked surface** and reported **"60 district heroes loaded, 0 drawn"**.
   The heroes are drawn by `renderCity()` — the CITY tab — not by `render()`. They were never
   missing; I was looking in the wrong room. *A probe that checks one room and reports the
   house empty is the same disease as the bug it hunts.*

I nearly shipped that second one as a 60-sprite catastrophe. Checking which renderer owned
the call is what stopped it.

## AND THREE OF MY OWN GATES WERE NOT IN THE SUITE

Found while registering this one. `interior_ground_gate.js` (8/20) and `hazard_look_gate.js`
(8/20) were **never added to the table in `gates/bohemia_gates.py`**, so they had only ever
run because I ran them by hand. They passed every time I invoked them and would never have
run again after this session ended.

**A gate that is not in the table is a gate nobody runs — the same silence it was written to
end.** All three are registered now and verified through the runner itself, not just
standalone.

---
**Gate:** `gates/approved_art_arrives_gate.js` (7 checks, two mutations confirmed) ·
**Registered:** `gates/bohemia_gates.py` (+ INTERIOR GROUND, + HAZARD LOOK) · **The law it
enforces:** `laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md`
