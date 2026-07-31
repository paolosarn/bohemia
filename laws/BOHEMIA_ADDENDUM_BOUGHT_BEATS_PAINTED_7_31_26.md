# ADDENDUM — BOUGHT BEATS PAINTED (Paolo 7/31/26, LOCKED, FLEET-WIDE)

> "Bro why dont u understand that if i bought it i prefer it! Thats for all
> textures bro!!! Holy shit"

## THE LAW

**IF PAOLO BOUGHT IT, IT WINS. FOR ALL TEXTURES. NO EXCEPTIONS, NO ASKING.**

A purchased asset is not a candidate to be weighed against something Claude
painted. It is the default. Painted art is the FALLBACK, legal only for a surface
his library does not cover, and every such surface is NAMED DEBT that must shrink.

This supersedes any reading of the frozen-starter-set rule that had painted ground
tiles beating his own library. The starter set stays byte-locked and stays the
reference for LOOK; it is not a licence to ignore art he paid for.

## WHY THIS HAD TO BECOME A LAW

He asked whether the bought sidewalk had been thrown away. It had not, and no new
art had been cooked. But the sidewalk was wearing `walk_kerb` from the painted
starter set while 98 pavement tiles he owns had never drawn a single pixel. When
that was reported back to him, it was reported as a QUESTION -- keep the painted
one or swap to yours? -- as if his two rules were in tension and he had to break
the tie.

**That was the mistake, and it is the reason for this file.** There was no tie.
He had already answered it by buying the asset. Asking again is the failure mode
he has named repeatedly: he DECIDES, Claude PRODUCES, and a preference he has
already paid money to express does not need re-confirming.

The correct behavior, the first time: use his tile, and only report what surfaces
his library does NOT cover.

## WHAT IT MEANS MECHANICALLY

1. **HIS BANKS ARE READ FIRST.** Before any painted tile is laid for a surface,
   the renderer asks whether he owns art for it. If yes, his art draws. The
   painted path is only reached when the answer is no.
2. **VERBATIM OR NOT AT ALL.** His tiles blit 1:1. They are 44x44, which IS the
   corpus cell, so nothing is ever resampled (the 7/26 no-resample law).
3. **SEAM-READY AND PURE ONLY.** Tier S/A off the bank's own authoritative `tier`
   field, and `pure:true` only, so the PURPLE RESERVATION still holds.
4. **DETERMINISTIC PLACEMENT.** Same tile in the same cell every time, hashed off
   the coordinate. No per-frame shuffle, no shimmer.
5. **THE DEBT IS NAMED.** Every surface still wearing painted art because he owns
   nothing for it is listed BY NAME by the gate. It can only shrink.

## LANDED FIRST (7/31)

The ground the suburb is made of, from
`banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt`:

| surface | world code | his pack | tiles |
|---|---|---|---|
| sidewalk | 10 | 1. Cracked contrete tiles | 20 |
| driveway | 3 | 1. Cracked contrete tiles | 20 |
| road | 1 | 1. Cracked street tiles | 13 |

Measured on the real surface: 33 of his tiles decode and draw, all 44x44, and his
art now covers **3,847 of 16,384 cells — 23.5% of the block** that was 100%
painted before.

## THE GATE

`gates/bought_beats_painted_gate.js`. It checks that his banks are really
consumed, that the bought branch runs BEFORE the painted branch at every draw
site, that nothing is resampled, that only pure S/A tiles ship, and it PRINTS THE
REMAINING DEBT by name so no painted surface can hide.

`gates/banks_used_gate.js` also now watches his ground library, because
"approved-but-unused is a defect" was never pointed at the library he actually
paid for -- which is exactly why 98 tiles sat unused and only he noticed.
