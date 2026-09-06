# THE TEN TILES ARE NOT LIT FROM THE WRONG CORNER
COOK (16, the Production Artist), VAMILY [light agrees], 9/6/26.

## THE JOB, AS THE BOARD WROTE IT
> TEN TILES ARE LIT FROM THE WRONG CORNER -- EYES E7 named them: road_0, road_1, road_2,
> road_centre, dirt, garage_bottom, roof_slope, roof_hipTL, roof_hipBR, roof_deck all read
> as lit from a different corner than the tile they REPLACED. The craft gate checks the key
> by pairs within a form, which is right for a form; whether a tile agrees with the tile it
> replaced is a different question and nothing was asking it. **Fix the ten, then keep the
> question.**

**The question is a good one and it is now kept. There are no ten tiles to fix.**

## FIRST, THE FINDING REPRODUCES EXACTLY
Running E7's own `key_light()` over the 42 tiles the two banks share gives the same ten,
to the digit. Nothing here is a disagreement about what was measured.

## THEN IT FALLS APART IN TWO PLACES

**1. IT MEASURES PIXELS THE GAME NEVER DRAWS.** `key_light()` does `.convert('RGB')`,
which turns every transparent pixel BLACK. `roof_hipTL` is a corner piece: **48.9% opaque,
and the re-cooked and approved alpha masks are identical.** Flattened to RGB it reads as a
67-unit gradient into the lower right — the loudest number in the whole report. On the
pixels that are actually drawn:

    roof_hipTL   horizontal gradient   re-cook +3.86   approved +4.27
                 (the same direction, within a tenth of each other)

**2. IT TAKES THE SIGN OF A DIFFERENCE WITH NO THRESHOLD.** A road tile is deliberately
flat top to bottom. Its vertical half-difference is therefore noise, and the sign of noise
is a coin flip:

    roof_deck    vertical   re-cook -0.07   approved -0.10    out of 255
    roof_hipBR   vertical   re-cook +0.08   approved -0.20
    road_centre  vertical   re-cook +0.05   approved -0.58

Nine of the ten were flagged on an axis where one or both tiles carry no light direction
at all. On every axis where both tiles ARE decided, they agree: dirt horizontal (both
right), garage_bottom vertical (both lower, and strongly — 63% of the tile's own spread),
road_centre horizontal (both right), roof_hipTL horizontal (both left).

## AND IT IS NOT MERELY NOISY, IT IS BACKWARDS
Rank all 42 tiles by how far apart the two banks' gradients ACTUALLY are, as a share of
the tiles' own contrast:

| rank | tile | gap | flagged by E7? |
|---|---|---|---|
| 1 | wall_0 | 0.311 | no |
| 2 | wall_end_r | 0.257 | no |
| 3 | wall_end_l | 0.245 | no |
| 4 | wall_base | 0.224 | no |
| 5 | road_2 | 0.193 | yes |
| … | | | |
| 38 | garage_bottom | 0.020 | yes |
| 41 | roof_hipBR | 0.016 | yes |

**The ten land at ranks 4, 5, 9, 20, 23, 27, 28, 35, 37 and 40 of 42. Six sit in the
bottom half. `roof_hipBR` is the second most similar pair in the entire set and it was
flagged. The furthest apart, `wall_0`, was not.** The flag has no relationship to the
quantity it names.

And even `wall_0`, the worst in the set, is not a wrong corner: vertical +2.17 against
+5.92 — the same direction, a weaker version of it. **Nothing in the 42 is lit from the
wrong corner.**

## SO NO ART WAS CHANGED, AND THAT IS THE POINT
Changing ten tiles to satisfy a sign test on invisible pixels is the thing this repo
forbids in as many words: **fix the ruler, never the target** (8/1). The alpha, the demo
and the walked city are byte-identical to what they were before this round.

## WHAT SHIPPED: THE QUESTION, KEPT
`gates/light_agrees_gate.py`, registered in the suite as LIGHT AGREES.

1. **Every tile's light direction agrees with the tile it replaced**, on every axis where
   both tiles have a direction to speak of, measured on opaque pixels only.
2. **No tile drifts further from its predecessor than the worst one does today** — a
   ratchet pinned at `wall_0`'s 0.311.
3. **The ruler is tested inside the gate, both ways, every run**, so it cannot quietly
   stop working the way the one it replaces did:
   - a tile against its own vertical mirror MUST be caught (it is: "vertical, now +81.86,
     was -81.86");
   - a tile whose transparent corner is filled with black MUST NOT be (that is
     `roof_hipTL` exactly).
4. Mutation-tested on the real bank: turn `garage_bottom` upside down and the gate goes
   red twice, naming it at a gap of 1.274 against the 0.312 pin.

## PROOF
    python3 gates/light_agrees_gate.py        5/0, both self-tests biting
    python3 gates/pixel_craft_gate.py         green (CBB-frozen set held where it is)
    python3 gates/texture_match_gate.py       67/0  (114 tiles, 13 materials)
    git status                                no art file touched

## ROUTED
- **EYES AND EARS (lane 17, E7's owner):** `tools/bohemia_eyes_reference_score.py`,
  `key_light()`. Two lines fix it and I have not touched your tool: mask to `alpha > 0`
  before taking the luminance, and return `undecided` on an axis whose half-difference is
  under about a tenth of the tile's own standard deviation. Question 6 should then read
  "the lit corner agrees, or neither tile has one" instead of forcing a yes/no. The sheet
  is a good instrument; this is one function inside it. The same fixed ruler is in
  `gates/light_agrees_gate.py` if it is easier to lift than to rewrite.
- **THE BOARD:** the E7 line's premise was wrong, so the row is closed by measurement
  rather than by ten edits. Worth knowing before a similar row is written from a research
  finding that no lane has re-measured.
- **NOT MINE, and red on clean origin/main with identical counts:** `target_match_gate`
  278/1 (a CBB-frozen frame changed) and `canvas_memory_gate` 27/3 (its own output says
  "reported, not failed -- every lane touches the alpha every ship").
