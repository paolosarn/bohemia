# BOHEMIA — THE MOBILE RENDER CONTRACT (7/26/26)
# STEP ZERO of the ART lane. Amendment D of the art-first reset:
# "base resolution, tile px size, integer zoom level(s), iPhone portrait
#  viewport, palette, light direction, outline/dither rules. Target painted at
#  exactly that spec. Pipeline rule gated: offscreen 1x render + integer blit +
#  smoothing off (non-integer scaling voids pixel art on 3x phones)."
#
# ORDER-OF-EVENTS NOTE, stated plainly because the law says the target is
# painted AT this spec: amendment D landed on main while the three target
# screens were being composed. So this contract was WRITTEN FROM the screens
# rather than the screens being painted from it. Every number below is the
# number the screens were actually built at — read out of
# tools/bohemia_target_screen_factory.py and asserted against it by
# gates/target_screen_gate.py, so the two can never drift apart. Where the
# screens do NOT satisfy a clause (the palette), it says so instead of
# pretending.

---

## 1. FRAME

| pinned | value | why |
|---|---|---|
| base art resolution | **418 x 912 art px** | iPhone portrait aspect 0.4583; 390x844 CSS px maps 1:1.07 |
| integer zoom levels | **1x, 2x, 3x only** | the poster ships at 2x (836 x 1824) |
| viewport | iPhone portrait, safe-area aware | the only device shape that matters |
| non-integer scale | **BANNED** | a 3x phone blitting a 1.07x buffer destroys pixel art |

## 2. TILE PX

| projection | ground cell | height cell | door | body |
|---|---|---|---|---|
| **A — front face** (axis-aligned oblique) | 38 px square | 38 px | 2 cells = 76 px | 66 px |
| **B / C — 2:1 dimetric** | 52 x 26 px diamond | **ZH = 38 px** | 2 cells = 76 px | 59 px |

The iso HEIGHT unit is deliberately larger than the tile height. At TH=26 a
2-cell door is 52 px and a standing body out-tops its own doorway. ZH=38 puts a
body at 77% of the opening in both projections.

## 3. PROPORTION CANON (already gated)

- `CELL_M = 0.75 m` per ground cell — the engine constant, not a new number
- a human is `1.75 m` — researched LV averages, `tools/bohemia_scale_study.py`
- **a door opening is 2 cells tall** — art-first reset law 5
- therefore **a standing body clears 68–90% of its own doorway** (target 77%)

## 4. LIGHT

- ONE direction, everywhere: **key from the upper LEFT**, Vegas noon, warm.
- Shadows fall **down and to the right**. Every mass throws a real cast shape
  across the ground in front of it, not just a contact pool.
- **Three flat value bands per volume**, ordered and gated:
  `sky-lit top 1.30 > lit front 0.97 > away side 0.56`, top/away ≥ 1.6.
- Dead-world reconciliation (already law): act-1 windows are **DEAD DARK
  glass**. Never a warm night glow. Gated: < 2% hot-yellow pixels per plate.

## 5. OUTLINE + DITHER

- **NO black keyline.** Edges read from the value step between faces, at most a
  slightly darker edge pixel. Gated: < 6% near-pure-black pixels per plate.
- **No dither** in act 1. Gradients are flat bands, not stipple. Where a falloff
  is needed (wall base grime, eave shadow) it is a per-row alpha ramp, which is
  a solid, and survives integer scaling. Stipple crawls under 2x/3x blit.

## 6. PALETTE — THE ONE CLAUSE THIS CONTRACT DOES NOT YET SATISFY

Pinned ramp: **64 colours**, `records/target/BOHEMIA_MASTER_PALETTE.json`
(+ `.png` swatch sheet), derived by quantizing the three target screens — which
are themselves built only out of approved banks, so the ramp is the approved
corpus's own colour, measured.

**It is not enforced on the corpus, and saying otherwise would be a lie.** The
approved tiles were cooked as continuous-tone material, not as indexed pixel
art: the three plates carry **59,377 unique colours**. Indexing them to the ramp
is a real re-cook, and it belongs to the ACT-1 MASTER TILESET (ART backlog item
2), which is where the tiles are made rather than sampled.

Until then the number is **tracked with a ceiling of 80,000** so a future cook
cannot quietly make it worse while the real fix waits. That is a ratchet, not a
pass, and the gate says so.

## 7. PIPELINE RULE (gated on the real render path)

1. Render the world **offscreen at 1x**, in art px.
2. **Integer blit** to the device buffer. Never `drawImage` at a fractional
   scale for world tiles.
3. **`imageSmoothingEnabled = false`** on every context that touches world art.
4. Cell size is computed with `Math.floor` — never a float.

Gated today on the shipped walkable surfaces (`BOHEMIA_RUN_CURRENT.html`,
`BOHEMIA_CITY_CURRENT.html`) and on the alpha shell.

## 8. MEMORY

The iOS Safari canvas floor to respect is **~224 MB** live. Chunk caches
multiplied by era variants is how a 32 MB game hits that wall, so:

- one chunk cache, evicted by distance, never one cache per era
- era variants derive at draw time from the act-1 base (amendment A: assets are
  born era-READY, not era-complete)

**NOT YET INSTRUMENTED.** No session has measured live canvas bytes on a real
device. Until a probe exists this section is a design constraint the lanes are
expected to honour, not a checked one, and the gate does not pretend to check
it. Instrumenting it is a backlog item, not a claim.

## 9. WHAT THE GATE ACTUALLY HOLDS

`gates/target_screen_gate.py` (registered in `python3 gates/bohemia_gates.py`).
Every number in sections 1–5 is asserted against the factory's own constants, so
changing `CELL`, `ZH`, `BODY_K`, `SCALE`, `TOP/FRONT/SIDE` or the frame breaks
the gate rather than silently breaking proportion. Section 6 is asserted as a
ratchet. Section 7 is asserted on the shipped surfaces. Section 8 is documented
and explicitly NOT asserted.

The gestalt question — *does this look like the target* — is **never** a gate.
Amendment B is explicit: that is always a human side-by-side verdict, Paolo's.
