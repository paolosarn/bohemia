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
#
# REVISION 2 (7/26, same day): Paolo ruled the FRONT FACE is the direction and
# killed the other two candidates, then named two defects - cars were not 2x3
# tiles, and the roofs were not put on square. Both are now pinned here and
# gated. Sections 2 and 9 changed; nothing else did.

---

## 1. FRAME

| pinned | value | why |
|---|---|---|
| base art resolution | **484 x 1056 art px** | iPhone portrait aspect 0.4583, and 11 x 24 cells at the corpus cell |
| integer zoom levels | **1x, 2x, 3x only** | the frame ships at 2x (968 x 2112) |
| viewport | iPhone portrait, safe-area aware | the only device shape that matters |
| non-integer scale | **BANNED** | a 3x phone blitting a 1.07x buffer destroys pixel art |

## 2. TILE PX

| pinned | value |
|---|---|
| **A ground cell** | **44 px square — THE CORPUS CELL** |
| **A door** | 2 cells = 88 px |
| body | 68 px (77% of the opening) |
| **car footprint** | **3 x 2 tiles** — 114 x 76 px |

There is ONE projection: axis-aligned oblique, north-up. The 2:1 dimetric and
cutaway candidates were graveyarded by Paolo on 7/26 and their numbers are gone
from this contract with them.

**NO SHEAR.** The top face is never slid sideways relative to the walls under
it. Revision 1 offset it by 0.34 cells per cell of height, which put a roof
about a tile and a half off its own house — "the roofs are all fucked up not put
on correctly." A roof sits square over its own footprint; the 45-degree read
comes from the roof's PITCH (hip trapezoid, ridge, fascia, eave shadow), never
from sliding the box.

**THE CELL IS THE CORPUS CELL, AND ART NEVER RESAMPLES.** Paolo 7/26: *"I'm a
little confused why the cars look like they're low quality pixel wise."* They
were. Every approved tile in every bank is 44px; the world was being drawn at 38,
so the entire corpus was resampled every frame at a non-integer ratio **through a
smoothing filter**. Two rules, both gated:

1. the world cell **is** the corpus cell, 44px, so an approved tile blits 1:1
2. any scaling of art is **NEAREST**. Never LANCZOS, BICUBIC or BILINEAR. A
   smoothing filter is exactly what makes crisp pixel art look low quality.

**A WINDOW IS THE APPROVED TILE, WHOLE.** *"why are you like not just using the
windows and you're like doing zoomed in zoomed out pictures of windows"* — the
corpus tile already IS a wall with a window in it. It is never cropped out,
rescaled, and re-framed by hand; that is what put the same window on one screen
at three different sizes.

**NOTHING STANDS IN A DRIVEWAY.** *"a light post should never be in the driveway
where a car enters"* — gated against the driveway rect.

**NO VOLCANIC ROCK.** All 24 members of the desert BOULDER family are glowing
lava rock. This valley is limestone and sandstone; there is no volcano and never
was. Banned by lore alongside the radiation marks.

**CARS ARE 2 x 3 TILES.** Paolo, locked ("2x3 i told you"), restated 7/26. The
number is not typed into any art tool: it is read out of
`engine/bohemia_prop_scale.js` at draw time, so a picture can never disagree
with the game. Cars are turned to lie along the surface they are parked on.

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
(+ `.png` swatch sheet), derived by quantizing the target screen — which is
itself built only out of approved banks, so the ramp is the approved corpus's
own colour, measured.

**It is not enforced on the corpus, and saying otherwise would be a lie.** The
approved tiles were cooked as continuous-tone material, not as indexed pixel
art: the target plate carries **46082 unique colours**. Indexing them to the
ramp is a real re-cook, and it belongs to the ACT-1 MASTER TILESET (ART backlog
item 2), which is where the tiles are made rather than sampled.

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
changing `CELL`, `SHEAR`, `BODY_K`, `SCALE`, `TOP/FRONT/SIDE` or the frame breaks
the gate rather than silently breaking proportion. Section 6 is asserted as a
ratchet. Section 7 is asserted on the shipped surfaces. Section 8 is documented
and explicitly NOT asserted.

The gestalt question — *does this look like the target* — is **never** a gate.
Amendment B is explicit: that is always a human side-by-side verdict, Paolo's.
