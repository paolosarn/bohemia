# COOK — THE NETWORK AGREES WITH ITSELF AT 62%, ON THE WRONG COLOUR
9/13/26 · lane 16 COOK · `[teal legs]` round 1 · **TEAL WORK PANTS shipped**

## THE ROW, AND WHAT RULE 12 CAUGHT IN IT

> r2 wired TEAL WORK SHIRT #28bea0 (one degree off his choice) and the colour gate went red:
> **one teal shirt against dust trousers gives 31% self-agreement against the 38% law**;
> neutral trousers passed and MOVED THE SILHOUETTE, so it was reverted.

Rule 12 landed this round — *a dependency on a line is a premise, not a gate; the lane
measures first.* I measured every number in that sentence. Most held. **The headline one did
not.**

    faction colour gate, the printed table:
      faction        colour strength   biggest hue   share
      Network                0.31           210     62%

**0.31 is Network's colour STRENGTH — its saturation. Its self-agreement is 62%,** and the
law is 38%. Network was never failing that law. I misread the same column the same way on my
first pass and only caught it by going back for the header.

**So the defect is real but it is a different defect.** Network's cloth agrees with itself
perfectly well. It agrees on **hue 210 — blue** — when Paolo chose `#1fbf9c`, hue 167, teal.
A faction can be perfectly coordinated in a colour that is not its own, and a share number
alone will never say so.

## WHAT NETWORK ACTUALLY WEARS

Hand-authored in `FACTION_LOOKS`, not picked by the dresser:

    hair TEMPLE TAPER · base STEEL WORK SHIRT · legs DUST TROUSERS · feet STEEL SNEAKERS

Steel shirt, steel sneakers, khaki trousers. Blue at 210 wins on area, and the entry's own
note says what it was supposed to be: *"the manufactured one, and it shows: no coat, no hat,
no wear — eerily clean, like the lights."*

Teal garments by layer before this round: **base 2, legs 0, feet 0.** Two shirts and nothing
below the waist, exactly where the row said the gap was.

## THE PIECE

`TEAL WORK PANTS` — `wear(genPants(g,{ramp:TEALBRT}),TEALBRT,13)`.

Character for character the same call as `DUST TROUSERS`
(`wear(genPants(g,{ramp:DUSTSAND}),DUSTSAND,13)`), including the same wear value of 13, so it
is a drop-in replacement for the exact trouser Network is wearing today. `TEALBRT.mid` is
`[40,190,160]` = **#28bea0**, the ramp the row names, **1.1 degrees** off his `#1fbf9c`.
No new ramp, no new colour, no new geometry.

**"Keeps the silhouette byte-identical" is not a hope here, it is measured** on rendered
pixels — the opaque mask of the body with dust trousers against the same body with teal ones:

    silhouette identical: true · pixels moved: 0

## WHAT IT BUYS, MEASURED THREE WAYS

    Network                    colour strength   dominant hue   agreement
    today (steel + dust)            0.309          210 blue        62%
    + TEAL WORK PANTS               0.434          210 blue        61%
    + TEAL PANTS AND TEAL SHIRT     0.553          180 TEAL        62%

**The pants alone are not enough, and that is the finding the wiring lane needs.** They lift
colour strength by 40% and the dominant hue stays blue, because the steel shirt still owns
more area than the trousers. Only with **both** teal pieces does the dominant hue flip from
210 to 180 — the first time the Network wears the colour he chose for it.

Rendered and looked at (`records/target/COOK_TEAL_LEGS_9_13_26.png`): the middle case reads
muddled, two cool colours competing. The right-hand case reads as a **uniform** — a utility
crew, the manufactured ones. That is the look the entry's own note asks for.

## → FOR CHARACTER, WHO WIRES IT

Wire **both**, not just the legs: `FACTION_LOOKS` Network `base: 'TEAL WORK SHIRT'` and
`legs: 'TEAL WORK PANTS'`. Wiring only the legs raises saturation and leaves the faction
still reading blue. Both pieces exist and are canon; the silhouette does not move either way.

## AND IT IS NOT THE MAGENTA PROBLEM

The twin row `[magenta piece]` is stopped dead: the Anarchists' `#c026a0` sits inside the
reserved purple band (hue 312.5, band 265–330), and the purity gate goes red on exactly that
cook — mutation-tested last round. **Teal is hue 168.** Nowhere near it. This one was free to
build, and that difference is the entire reason one row shipped this round and the other did
not.

## REFERENCE CHECK

**Compared to** GARM-03 (this repo's own locked wardrobe laws), GARM-01 (Lospec clothing
tutorials), and real workwear in a saturated colour.

- **GARM-03** — *"the cut belongs to the register, the colour belongs to the faction; a cook
  never spends both channels on one idea."* This spends the colour channel only.
- **GARM-01** — *"at sprite scale fabric is VALUE BANDS, not drawn fold lines."* `TEALBRT` is
  already a three-value ramp and `genPants` bands it; `wear(...,13)` gives the same grime
  every other canon trouser carries, so the new piece is not a suspiciously clean one.
- **STRUCTURE-NOT-COLOR** — a recolour is never progress in shape. The file already says the
  rest, above the RAINBOW FOUR: *"this is not progress, it is IDENTITY, which is the half his
  8/26 ruling adds."* This is that batch's trousers.

**Changed from the reference: nothing.** One existing leg shape, one existing ramp.

## NUMBERS (rule 13: this is the PRE-PUSH PASS, not the suite)

    wardrobe_wired 17/0  (the shape ratchet did not move — the point of the whole design)
    clothes_4x     13/0  ·  trenchcoat 12/0  ·  attempt    15/0
    faction_colour 27/0  ·  alpha_loads 20/0  ·  demo       23/0  ·  purity exit 0

Full suite unmeasured since this sha — PLUMBER has not posted the first SUITE LINE yet.
Build 9/13t, demo re-cut.
