# COOK — [purple leak]: THE GATE FOUND 2,232 VIOLATIONS AND EXITED 0
9/12/26 · lane 16 COOK · row `[purple leak]` · from EYES E17

## THE ROW

EYES E17 swept all 9,556 tile pictures the shipped game loads and found **32** that are a
third or more saturated purple, with not one in a hatch or Amalgamation bank. PURPLE
RESERVATION (7/10/26, Paolo, LOCKED) says purple belongs to the hatch and the Amalgamation:
*"No fantasy-purple tiles scattered through the world. No purple runes, no purple floors, no
ambient purple decor."*

My row ends: *"and the reservation gate holds it after."* That turned out to be the whole
story.

## THE GATE EXISTS, IS REGISTERED IN THE SUITE, AND CANNOT FAIL

`gates/bohemia_purity_gate.py` is registered as `PURITY` at `bohemia_gates.py:5680`. Run on
main, untouched:

    17,497 images checked · 2,232 VIOLATIONS · 6,406 warm-suspect · 41 law-blessed
    exit code 0

It prints `<-- VIOLATIONS` against bank after bank — 493, 484, 433, 406 — and passes. The
verdict line:

```python
return 1 if (viol and strict) else 0
```

`strict` is the **`--strict` CLI flag**, bound at the top of `main()`. The per-image loop then
rebinds the same name:

```python
strict, suspect, pur = check_png(b64)     # check_png returns (lava_strict, suspect, purple)
```

So by the time the return runs, `strict` means *"did the last PNG I happened to look at
contain lava"* — not "was this run strict", and not "were there violations". With 2,232
violations and a clean final image, the gate reports success.

**A gate that finds two thousand violations, prints them, and passes is worse than no gate,
because the law reads as enforced.** A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED — and this
is the sharper case: a law with a gate that cannot say no.

## AND IT WAS POINTED AT THE WRONG POPULATION

The gate has swept `banks/` since 7/10 and **has never looked at
`slices/BOHEMIA_CITY_TILES*.js`** — the pools the walked city actually loads. That is exactly
why EYES had to find the 32 by hand: the gate was measuring the corpus, and the corpus is not
the game. A ruler aimed at the wrong population reports a clean number about something nobody
plays. (Same shape as the reference gate that picks cooks by filename, found last round.)

## WHAT I BUILT

**1. The name collision is gone.** The per-image value is `lava_px`; the flag stays the flag.

**2. The verdict is a ratchet, not a hard zero.** Flipping it to `return 1 if viol else 0` is
one character of honesty and a fleet-wide red on 2,232 pieces of art no lane here made. So:
a bank over its frozen count is red; a bank carrying violations with *no* frozen entry is red,
so new art cannot hide behind old debt; no baseline at all is red. The list may only shrink.

**3. The gate freezes its own baseline (`--freeze`).** My first pass wrote the baseline with a
separate script that counted one per *image* while the gate counts one per violation *reason*
(an image can be both LAVA and PURPLE) — 2,134 against 2,232, and every file read as a
regression. Two counters for one number always drift. One producer.

**4. The shipped pools are now a second, separately ratcheted scope**, because that is the one
a player can reach. The gate counted them independently and got **32 — with EYES' exact
category split: concrete 1, container 1, door 1, foliage 1, light 5, misc 15, sign 5, wall 3.**
Two separate implementations agreeing is the strongest evidence either of us has.

Mutation-tested four ways, all red, restore green:
a bank over its number · a bank with violations and no entry · no baseline at all ·
the shipped pools rising above 32. 18 seconds.

## THE 32 THEMSELVES, MEASURED ON THE REAL SURFACE

I loaded the walked city headlessly and counted saturated purple on the actual canvas:

    TP.on false · TP.scatter false · placed 0
    canvas 378x787, 297,486 opaque pixels, PURPLE: 0

**None of the 32 are drawn today.** The tile placer ships off and nothing is placed, so they
are a pool the builder paints from, not purple scattered through the world. This is a
landmine, not a fire — and the landmine is real: `tpPatchPick` is `hash % arr.length`, so
every tile in a drawn category is reachable, and one of the 32 is a **concrete** tile at 62%
purple. Concrete is the default ground for suburb, town, gated, school and medical. The day
scatter is switched on, that tile lands on suburban ground.

## WHAT I DID NOT DO, AND WHY

I did not repaint them. Looking at all 32 at 2× (`records/target/COOK_PURPLE_THE_32_9_12_26.png`)
they are crystal clusters, gem shards, glowing braziers, a portal archway, purple coral.
**Recolouring a crystal brown gives you a brown crystal**, which is still not a Las Vegas
economic crash simulator. The law's sentence bans fantasy decor as much as it bans the hue, so
a recolour satisfies the letter and fails the intent.

I also did not delete them from the pools. `TP.placed` stores `{cat, idx}` in localStorage, so
removing array entries **shifts every index a builder has already saved**. That is a real
hazard for a cosmetic win.

EYES routed the call explicitly: *"WHICH ONES TO REPAINT AND WHETHER ANY DESERVES AN EXCEPTION
IS DIRECTION'S CALL, NOT THIS LANE'S."* Ten of the 32 are `sign` and `light`, where Vegas neon
is a fair argument; the other 22 are the categories the law names out loud.
→ **[FOR DIRECTION]** kill or recolour, per tile, off the contact sheet. The gate holds the
line at 32 meanwhile, and I re-freeze downward the moment the number falls.

## A WRONG TURN I ALMOST TOOK

My own first sweep found **56**, not 32, and I nearly reported that EYES had undercounted —
their contact sheet renders `worst[:32]`, which looked like a cap. It is not: `len(worst)` is
genuinely 32. The 56 came from my own wider ruler (hue from 252° instead of 265°, lightness
0.18–0.85 instead of 0.25–0.75). **A wider ruler is not a bigger finding.** I kept EYES' band,
which is the one the law and the board cite.
