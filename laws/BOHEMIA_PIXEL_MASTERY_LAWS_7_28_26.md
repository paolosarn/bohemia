# BOHEMIA — THE PIXEL MASTERY LAWS (7/28/26, LOCKED)

Paolo, 7/28: *"You're gonna be cooking up all the tile request so I need you to
do big brain online research on how to become a the world's greatest pixel
artist."*

Level 1 (`laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md`) was **how not to be bad** —
orphan pixels, ramps, staircases, one light. It got us from 74% noise to 0.06%.
This is level 2: **what separates competent from great**, researched the same
day I am about to cook eighteen material families and therefore about to make
eighteen copies of whatever I do not yet understand.

**RESEARCH HONESTY, unchanged and still enforced:** this environment's network
policy 403s every direct page fetch. Search works. So these laws are built from
search-returned summaries of the primary sources, quoted where the summary gave
me a verbatim line and paraphrased where it did not. **Pixel Logic** is still
unread and still needs buying.

---

## M1. WEAR MUST BE MOTIVATED, NEVER SCATTERED — *the big one*

> *"A concrete floor may be mostly rough but slightly smoother where people walk
> frequently, and this kind of motivated roughness variation is what separates a
> professional material from a flat one."*

This is the single most useful sentence I found, and it convicts my own re-cook.
The 42 tiles I rebuilt place their aggregate, their wear patches and their cracks
at **deterministic random positions**. Random is not the same as natural. Real
surfaces wear where something happened:

- **traffic** — the middle of a walkway is polished, the edges are rough
- **water** — under every drip line, every scupper, every failed gutter
- **sun** — the south and west faces bleach and chalk first, always
- **contact** — where a car sat, where a door swung, where a hand pushed

**THE LAW:** every wear mark a tile carries must be able to answer *"what did
this?"* in one word. A crack that answers "nothing" is decoration, and invented
decoration is deleted on sight (existing law). This is the same rule as
NAME-IT-OR-DON'T-DRAW-IT, applied one level down: name the damage, not just the
object.

## M2. THE FLOOR IS QUIET — *measured, and we currently fail it*

> *"Ground generally darker than surrounding walls and minimal noisy details on
> wall textures."*
> *"Limit palettes... using a primary palette for large surfaces and accent
> colors for props and interactables to guide player attention."*

Ground is the largest surface in any frame and the one nobody should be looking
at. It exists so the things standing on it can be seen.

**MEASURED 7/28, both banks, and the re-cook still has it backwards:**

| | ground clusters/1000px | structure clusters/1000px |
|---|---|---|
| frozen 7/26 set | 962.0 | 722.7 |
| **re-cooked 7/28 set** | **102.0** | **58.8** |

The re-cook cut noise 9x — and left the floor **1.7x busier than the buildings
standing on it**. That is upside down. I fixed the noise and never asked which
surface deserved the detail.

**THE LAW:** in any tile set, ground must be quieter than structure — fewer
colour regions, less contrast, less to look at. Gated as a **reported number on
existing banks** (Paolo approved the re-cook and a gate does not overrule a
verdict) and a **hard fail on every bank cooked from here**, which is all
eighteen forms.

## M3. CONTRAST IS A BUDGET, AND YOU SPEND IT ON WHAT MATTERS

> *"Eyes are drawn to the brightest colors and highest contrast — use this for
> focal points."*
> *"Selective detailing means adding detail only where the viewer looks... while
> avoiding uniform detailing; negative space improves readability."*

Uniform detail is the intermediate plateau. Spending equal contrast on a road
tile and a door means the door is not a door, it is more road.

**THE LAW:** rank every family in a scene before cooking it — what is the player
supposed to look at? Doors, openings, landmarks, and anything interactive get the
contrast. Ground, plain wall field and roof field give it up.

## M4. AFTER YOU ADD DETAIL, TAKE IT AWAY

> *"One well-placed intermediate pixel can smooth a corner; three can make the
> entire edge look muddy."*
> *"After adding detail, simplify — remove redundant pixels and reduce palette to
> the essentials."*

**THE LAW:** a simplify pass is not optional and it is not a mood. Every cooked
family gets one, and the measurement it must beat is its own: fewer colour
regions after than before, with the read intact.

## M5. DETAIL LEVEL MUST MATCH ACROSS THE SET

> *"Highly detailed objects next to simple tiles break immersion; match detail
> levels across environment and props."*

**THE LAW:** the eighteen forms are one job, not eighteen. A CMU wall cooked at
twice the detail of the stucco beside it wrecks both. The set-wide numbers in
`pixel_craft_gate.py` exist for exactly this and now include a spread check.

## M6. HUE-SHIFT ON PERCEIVED LIGHTNESS, NOT ON RGB

> *"LCH is a color model that works on perceived lightness, perceived saturation,
> and regular hue. The hue-shifted version looks more luminous and natural, with
> far more perceived depth from the same number of colors."*
> *"An eight-color ramp is typical: three shades, the midtone, three tints, and
> the lightest highlight."*

Our ramps are 5–7 steps built on luminance with a small linear hue push. That is
correct in direction and crude in method: even value STEPS in RGB are uneven
steps to the eye. Building on perceived lightness is the upgrade, and it is free
— same colour count, more apparent depth.

**THE LAW:** ramp steps are spaced on perceived lightness. **[NAMED DEBT: our
ramps are still RGB-luminance spaced. This is the next palette job, alongside the
per-tile offset already named in render contract 6b.]**

## M7. A PRODUCTION PIPELINE BEATS HEROIC HAND-PIXELLING

Dead Cells (Motion Twin) built its entire look by modelling in 3D and running a
custom converter to pixel art with normal maps, because hand-animating that
volume *"would have committed unreasonable amounts of time and energy"* and
because the result is *"extremely easy to reanimate, which is one of the biggest
costs in development."*

That is the FACTORY LAW, proven by a shipped game. It also settles an argument I
had with myself on 7/28: my instinct to author tiles from a generator was right;
what was wrong was authoring over the top of Paolo's existing drawing. **Generate
the material, preserve the authored content.** That split is now the house rule
and it is in `tools/bohemia_tileset_recook.py`.

## M8. RESTRAINT READS AS INTENT

> *"A slightly jagged curve that still reads as intentional pixel work is always
> better than a smooth curve that reads as a mistake."*
> *"A 16-color palette means each color must justify its existence... every single
> pixel is a deliberate design decision."*

**THE LAW:** when in doubt, fewer. A tile that looks slightly plain and reads
instantly beats a tile that looks rich and reads as mush — and we have the
receipts, because the rich version is exactly what Paolo called slop.

---

## WHAT THE MACHINE HOLDS

`gates/pixel_craft_gate.py` gains **M2 and M5**, the two that are honestly
measurable:

- **M2 FLOOR IS QUIET** — ground families must be quieter than structure. REPORTED
  on the two existing banks (a verdict outranks a gate); HARD FAIL on any bank
  registered after 7/28.
- **M5 DETAIL SPREAD** — no family may run wildly busier than the set's median.

M1, M3, M4, M6 and M8 are **not gated and say so here**. Whether a crack is
motivated, whether contrast landed on the right thing, whether a simplify pass
actually simplified — those are judgement, and a machine claiming to check them
would be the fake verification the doctrine bans. They are the checklist the ART
lane works from, and the anti-reference section of every tile form is where they
bite.

---

## SOURCES

- [Dead Cells: using a 3D pipeline for 2D animation](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-) (Game Developer) and [80.lv's character-art case study](https://80.lv/articles/case-study-dead-cells-character-art-pipeline)
- [Slynyrd — Pixelblog 20: Top Down Tiles](https://www.slynyrd.com/blog/2019/8/27/pixelblog-20-top-down-tiles) and [Pixelblog 1: Color Palettes](https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes)
- [Pixel Parmesan — Color Theory for Pixel Artists: It's All Relative](https://pixelparmesan.com/blog/color-theory-for-pixel-artists-its-all-relative)
- [Pedro Medeiros — Basic Color Theory](https://medium.com/pixel-grimoire/how-to-start-making-pixel-art-6-a74f562a4056)
- [The Level Design Book — Environment Art](https://book.leveldesignbook.com/process/env-art)
- [Pixnote — 15 pro techniques](https://pixnote.net/en/learn/tips/) and [Sprite-AI — pixel art fundamentals](https://www.sprite-ai.art/guides/pixel-art-fundamentals)
- Tileset cohesion + detail-matching: [Understanding Tilesets](https://www.animationguides.com/tilesets-in-game-design/), [Top-Down Tile Set Design Guide](https://www.flooringclarity.com/tile-set-design-2d-games/)
- Material roughness motivation: [Pixune — Textures vs Materials vs Shaders](https://pixune.com/blog/textures-vs-materials-vs-shaders/)
- **Pixel Logic (Michael Azzi) — still NOT read, still blocked by the network policy, still a real backlog item.**

---

# PART 2 — THE PRODUCTION LAWS (7/28, second research pass)

Paolo: *"Do more research think about our project files and what we need and do
more research."* So this pass is not general craft. It is aimed at what THIS
repo is about to do: cook eighteen material families, each promising rain-wet
states, some promising lit states, most declaring a seamless or blob edge
contract — none of which I have ever actually built.

## M9. INDEX THE TILES, AND NIGHT / RAIN / ACT 2 / ACT 3 BECOME FREE

> *"Palette swapping works by changing the color mappings of an indexed image...
> you can change the color that each number corresponds to dynamically, which
> causes all the corresponding areas in the image to change too."*
> *"A day/night cycle similar to Pokemon Gold/Silver can be implemented using
> just a palette swap."*
> *"Restricting a sprite to fewer colors allows the color data to be stored once
> with each pixel given an index offset instead."*

**This is the biggest thing in the repo right now and we accidentally earned it
yesterday.** The re-cook put the whole 42-tile set on six family ramps and 150
colours set-wide. That means the tiles can be stored as **palette indices** and
not RGB — and once they are:

- **night** is a palette, not a tileset
- **rain-wet** is a palette, not a tileset (every one of the eighteen forms
  promises a wet state; that is 18 extra families we do not have to draw)
- **act 2 / act 3** are palettes — which retires the whole
  `bohemia_act_triptych.py` un-painting approach, since with indices you shift
  ramp steps instead of trying to recover a clean surface from painted decay
- **district colourways** are palettes (STRUCTURE-NOT-COLOR already says a
  recolour is never progress — this makes recolours nearly free, so they stop
  competing with real work)
- **memory** drops: one byte per pixel instead of four, against the ~224 MB
  clause already measured in the render contract

It also **kills two named debts at once**: the per-tile value-band offset in
render contract 6b (tiles cannot drift off a shared palette if they literally
index into it) and M6's RGB-spaced ramps (perceptual re-spacing becomes editing
one palette, not re-cooking 42 tiles).

**THE LAW:** every family cooked from a tile form ships INDEXED — its pixels
reference its family ramp by index, and the ramp ships beside it. **[NAMED, NOT
DONE: the current banks store RGB. Converting them is the next ART job and it is
a mechanical, lossless transform, not a re-cook.]**

## M10. THE OFFSET TEST IS THE SEAM TEST — and we fail it on walls

> *"Apply an offset filter, shifting the image horizontally by half its width and
> vertically by half its height... the original edges of your texture form a
> cross shape right in the middle of your canvas — this is where the seams are."*
> *"Heavy borders that outline the edge of the tile... guarantees it reads as a
> grid of tiles instead of a continuous surface."*

That second line is our own history twice over: the 7/26 black grid, and the
desert pool's measured edge darkening.

**MEASURED 7/28** — wrap-seam step divided by the tile's own internal step, so
1.0 means the seam is as quiet as the material itself. Scoped to the tiles that
actually claim to repeat (a door is *supposed* to be discontinuous at its edge;
measuring a door's wrap is meaningless and the first cut of this number did
exactly that and produced an alarming, useless 33):

| self-seamless tiles | mean | worst |
|---|---|---|
| frozen 7/26 set | 1.80 | 6.64 (wall_2) |
| **re-cooked 7/28 set** | **3.27** | **19.52 (wall_1)** |

**The re-cook made wall seams THREE TIMES WORSE.** Ground came through fine;
snapping the wall field to a ramp amplified a vertical discontinuity that was
already there, so a long wall now bands every 44 px. Mine, measured, named.

**THE LAW:** any tile declaring SELF-SEAMLESS is measured by the offset test
before it ships. Reported on existing banks (they carry a verdict); hard fail on
everything cooked from a form.

## M11. IRREGULAR CLUSTERING, NEVER EVEN SPACING

> *"Perfectly even spacing amplifies the repeat; irregular, slightly clustered
> detail hides it instead."*

This closes the loop on M1 from the other side. My tiles scatter detail
*evenly at random*, which is the worst of both: not motivated, and not clustered.
The fix is one move — put the wear where something happened (M1), in irregular
clumps, and leave the rest of the surface empty.

## M12. BLOB-47: EDGES, THEN CORNERS, THEN ISOLATED — AND THE INNER CORNERS ARE THE TRAP

> *"The full bitmask considers all 8 neighbours, producing 256 possible
> combinations... in practice you need 47 unique tile variants."*
> *"Draw all edge variants first, then corners, then isolated tiles."*
> *"The inner corner tiles (where a diagonal is empty but all cardinals are
> filled) are the trickiest to get right visually."*

Eight of the eighteen forms declare a WANG-16 or BLOB-47 contract and I have
never authored one. That order is the recipe, and the inner corner is the tile
to build first as the test, not last as the afterthought.

## SOURCES (part 2)

- [Boris the Brave — Classification of Tilesets](https://www.boristhebrave.com/2021/11/14/classification-of-tilesets/) and [Red Blob Games — Autotiling](https://www.redblobgames.com/articles/autotile/)
- [How to make seamless pixel art textures](https://axidus.io/blog/how-to-make-seamless-pixel-art-textures) · [Pixel art tiles that don't look terrible](https://www.sprite-ai.art/blog/seamless-pixel-art-tiles) · [Building tileable textures that work in production](https://www.texturly.com/blog/building-tileable-textures-that-actually-work-in-production)
- [Color cycling in pixel art](https://blog.prototypr.io/color-cycling-in-pixel-art-c8f20e61b4c4) and the Pokemon Gold/Silver day-night palette-swap devlog
- **Pixel Logic: still NOT read.**

---

# PART 3 — M13: MOST OF IT IS BACKGROUND (7/28, third pass)

Paolo: *"GO TO SCHOOL SOME MORE KNOW WHAT YOU DONT KNOW YET."* The full ignorance
map, including the four things I did not know this morning and the ten I still do
not, is `records/BOHEMIA_WHAT_I_DONT_KNOW_7_28_26.md`. One of the four binds the
eighteen tile forms immediately, so it lands here as law:

> *"If every asset is screaming for attention, then the player won't know where to
> look. The majority of the assets made for an environment must intentionally be
> subordinate to the focal point or hero asset."*

**M13. THE MAJORITY OF THE SET IS DELIBERATELY SUBORDINATE.** Of the eighteen
families queued, almost all are background: CMU block, corrugated metal, asphalt,
striping, turf, stucco, roof field. They are supposed to be quiet and supporting.
The focal points are the district HEROES and the things you can walk through —
doors, openings, portals. A warehouse wall cooked as lovingly as a courthouse
portico makes the courthouse stop being a courthouse.

This is M3 (contrast is a budget) scaled from one tile to a whole district, and it
is the rule that decides how much effort each of the eighteen deserves — which is
not the same amount.

**NOT GATED, and deliberately:** "is this asset appropriately subordinate" is a
composition judgement, and a machine claiming to check it would be the fake
verification the doctrine bans. M2's floor-is-quiet number is the closest a
machine gets, and it only covers ground.
