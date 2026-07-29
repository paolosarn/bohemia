# BOHEMIA — THE PIXEL MASTERY LAWS (7/28/26, LOCKED)

> **CONSOLIDATED INTO `laws/BOHEMIA_THE_PIXEL_BIBLE.md` (7/29).** That file is the
> one the ART lane reads before touching a pixel; this one is the full text and the
> sources behind it. They are held together by `gates/pixel_bible_gate.py`.


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

---

# PART 4 — M14: LAYERS SEPARATE IN VALUE, NOT IN HUE (7/29, found by LOOKING)

This one did not come from a measurement. It came from `tools/bohemia_look_again.py`
— the self-critique rig built to close the worst gap on my ignorance list (*"I do
not know how to look at my own work and say that's wrong without first computing
something"*). On its **first run**, the GREYSCALE panel of the re-cooked street
showed the roofs and the ground sitting at the same tone.

> *"Greyscale conversions and value checks help assess structure."* — if it does
> not read in grey, it does not read.

**AND THE MEASUREMENT CORRECTED ME, which is the honest half of the story.** My
eye said "the whole top of the frame is flat". The numbers say otherwise:

| | ground | wall | roof |
|---|---|---|---|
| both banks | 103.7 | 139.2 | 110.2 |

Ground-to-wall is **35.6 apart** — healthy, and my "all flat" read was wrong.
Ground-to-**roof** is **6.5 apart** — which is the thing I actually saw. A
terracotta roof and a dead gravel yard are the same tone; the roof only reads
because it is ORANGE. Take the colour away and the roof falls into the ground.

That matters beyond looking pretty: colour-blind players, a phone in sunlight, and
the map's own zoomed-out read all run on value, not hue.

**M14. ANY TWO LAYERS THAT APPEAR ADJACENT MUST SEPARATE IN VALUE.** Minimum 18
points of mean luminance between ground / structure / top. Hue may reinforce the
separation; it may never be the only thing carrying it.

Gated in `pixel_craft_gate.py`: REPORTED on the two existing banks (both carry
Paolo verdicts and both fail the ground↔roof pair at 6.5), HARD FAIL on every bank
cooked from a tile form.

**THE REAL LESSON, and it is bigger than the rule:** six numbers ran on this set
all night and not one of them could see this, because every one measured a tile
*alone*. The flaw only exists BETWEEN tiles, and it took looking at the picture in
grey to find it. That is the argument for the whole self-critique rig, and it is
also the argument for never letting a green gate stand in for a look.

## SOURCES (part 4)

- [7 tools every artist can use to check their own work](https://willkempartschool.com/7-essential-tools-every-artist-can-use-to-check-their-own-work-a-guide-for-painters/) · [How to critique your own artwork](https://www.mastrius.com/how-to-critique-your-own-artwork/) · [Painter's Keys — How to critique yourself](https://painterskeys.com/critique-self/)
- Atmospheric perspective for the depth half: [Draw Paint Academy](https://drawpaintacademy.com/atmospheric-perspective/) · [pixel art backgrounds](https://www.sprite-ai.art/blog/pixel-art-backgrounds)

---

# PART 5 — WHAT THE MASTERS ACTUALLY DO (7/29, fourth pass)

Item B8 on the ignorance list was *"I can name Saint11, Slynyrd, Azzi, Waneella,
Mark Ferrari. I have never analysed a single piece by any of them."* So this pass
studied two of them, and both landed on this project harder than any technique
tutorial has.

## M15. THE MASTER WORKS FROM REAL PHOTO REFERENCE OF REAL PLACES

> *"Waneella's working style often initially draws influence from Japanese streets
> found via Google Streetview."* Her work is praised for *"rigorous perspective
> work"* and *"masterful deployment of light sources and shadow"* — not for
> texture.

The best environmental pixel artist alive works **from photographs of real
streets**. She does not invent a city out of her head and then style it. That is
the whole method, and it is the thing I have been doing wrong from a different
angle: I write elaborate descriptions of Las Vegas materials and then generate
from the description instead of from the thing.

**M15. EVERY TILE FORM'S REAL-WORLD GROUNDING IS A LOOKING JOB, NOT A WRITING
JOB.** The eighteen forms already demand real Vegas grounding and each one has it
— but grounded in what I *know* about Clark County construction, not in what a
specific street actually looks like. The upgrade is naming a REAL LOCATION per
family, not just a real material.

Note what she is praised for and what she is not: **perspective and light**, never
texture. Every failure I have had on this project has been a texture failure that
was really a light-and-structure failure underneath.

## M16. COLOUR CYCLING: RAIN, FOG, SMOKE AND WATER FOR FREE — AND WE JUST BUILT THE PREREQUISITE

> *"Ferrari invented unique ways of using color cycling for environmental effects
> including rain, snow, ocean waves, moving fog, clouds, smoke, waterfalls,
> streams, lakes, and more — all achieved without any layers or alpha channels,
> just one single flat image with one 256 color palette."*
> *"This wasn't animation in the traditional sense, rather it was all being done
> by just organizing and changing palette registers in sequence."*

**This is the biggest thing I have learned on this project.** Not because the
technique is clever — because we accidentally built its prerequisite yesterday.

M9 says index the tiles so night, rain and the acts become palette swaps. M16 says
that once they are indexed, **shifting the palette in sequence animates the
world**: rain falling, fog drifting, smoke rising, the wash running, the camp fire
flickering — with **no extra frames, no extra memory, and no alpha layers**. On a
phone with a measured 224 MB ceiling, that is not a nice trick, it is the only way
we get animated weather at all.

It also retires work already on the board: the fire-flicker bank (34 loops,
approved, currently ZERO consumers) exists because frames were the only way we
knew. Some of it becomes a palette instead.

**M16. ANIMATED ENVIRONMENT EFFECTS ARE PALETTE CYCLES, NOT FRAME SETS**, wherever
the effect is a colour moving through a static shape — which is rain, fog, smoke,
running water, and flicker. Things that change SHAPE (a door opening, a body
walking) stay frame animation. **[NAMED, NOT BUILT: needs indexing (M9) first, and
it is a renderer feature — RUN/CITY, not this lane alone.]**

**ONE THING WE DO NOT IMPORT.** Ferrari's other signature is heavy patterned
dither, which he fought his own engineers to use. **Act 1 bans dither** (render
contract §5, and the craft agrees for our reason: stipple crawls under a 2x/3x
integer blit on a phone). Cycling and dithering are separable, and we take the
cycling only. Naming that rather than quietly importing a master's whole toolkit
is the difference between studying someone and copying them.

## SOURCES (part 5)

- [Q&A with Mark J. Ferrari](https://www.effectgames.com/effect/article-Q_A_with_Mark_J_Ferrari.html) and [Old School Color Cycling with HTML5](https://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html) (Effect Games) · [Wikipedia: colour cycling](https://en.wikipedia.org/wiki/Color_cycling)
- Waneella — [Vice profile](https://www.vice.com/en/article/d74apv/futuristic-landscape-gifs-waneella) and [Pixelscapes (Thames & Hudson)](https://thamesandhudson.com/waneella-pixelscapes-9780500028452)

---

# PART 6 — THE CAPSTONE: VALUE FIRST, HUE LAST (7/29, fifth pass)

## M17. ONE MASTER PALETTE FOR THE WHOLE GAME, SUBSETS PER FAMILY

> *"Creating one master palette for the entire project, then using subsets for
> individual sprites is the recommended approach... games where every character
> shares a palette look more professional and intentional than games where each
> sprite has its own unrelated color scheme."*
> *"32 colors gives you enough range for... varied environments while still
> keeping everything cohesive."*

**What we built yesterday is the amateur pattern and I did not know it.** The
re-cook derived SIX INDEPENDENT family ramps — asphalt from asphalt tiles, stucco
from stucco tiles, terracotta from roof tiles — each measured separately and each
knowing nothing about the others. That is exactly *"each sprite has its own
unrelated color scheme"*, and it is why the set-wide count came out at 150 instead
of a designed number.

The professional structure is inverted: **one master palette, and every family is
a SUBSET of it**, sharing steps with its neighbours. Families cohere because they
are literally made of the same colours, not because they were derived by the same
script.

**M17.** All eighteen forms draw from ONE Bohemia master palette. A family may use
a subset; it may not invent a colour outside it. **[NAMED DEBT: the master palette
does not exist yet. `records/target/BOHEMIA_MASTER_PALETTE.json` is a 64-colour
ramp QUANTIZED FROM the target screen — a measurement of what we happened to make,
not a designed palette. Designing the real one is the job that must happen BEFORE
the eighteen families are cooked, not after.]**

## M18. BUILD THE VALUE STRUCTURE FIRST, PUT THE HUE ON LAST — *the method I have never used*

> *"Decide which zones are dark, mid-tone, and light, and once values are locked
> in, replacing the grays with actual hues is trivial — and the result always
> looks cohesive."*

This is the single most important sentence in five research passes, because it is
a **method**, not a rule, and it is the opposite of what I do.

What I do: pick colours from the source art, build a ramp, place clusters, and
then *measure afterwards* whether the values landed. What the craft does: decide
in GREY that ground is dark, walls are mid, roofs are light — lock that skeleton —
and only then choose hues to sit on it.

**And it explains M14 exactly.** The roof/ground value collapse (6.5 apart, roofs
vanishing in greyscale) is not a bug I introduced by accident — it is the
inevitable result of never having built a value skeleton at all. Nobody ever
decided what value a roof should be. It got whatever colour it inherited.

**M18.** Every family is designed in VALUE first — a greyscale plan for what is
dark, mid and light across the whole set — and hue is applied to that skeleton
afterwards. The `look_again` rig's greyscale panel is how it gets checked, and
M14's 18-point separation is the number it must hit.

## M19. GLASS IS THE BACKGROUND, DARKENED AND FLATTENED

> *"Suggest transparency by blending background color, and use sharp white
> highlights for reflections."*
> *"Because opaque objects block more light, when looking through transparent
> objects like glass, the color value of what you see through it will be LOWER and
> have LESS CONTRAST."*

Closes half of ignorance item B4. Glass is not a colour — it is whatever is behind
it, moved down in value and squeezed in contrast, plus one hard highlight.

For the storefront form (TF-ART-008) this is directly buildable and it does not
fight the DEAD DARK GLASS law: act-1 glass shows the looted interior behind it,
darker and flatter than it really is, and the "sharp white highlight" is the ONE
thing act 1 withholds, because a bright specular is what makes a window look alive.
**Withholding the highlight is how our glass reads dead.** That is a design answer
falling out of a technique note, and it is the kind of thing five passes of
research were for.

## SOURCES (part 6)

- [Ansimuz — How to create retro colour palettes for your pixel art game](https://medium.com/@ansimuz/how-to-create-retro-color-palettes-for-your-pixel-art-game-a-practical-guide-7beae8ee9c97) · [FreePixel — palettes complete guide](https://freepixel.art/blog/pixel-art-color-palettes-complete-guide) · [GB Studio Central — creating a colour palette](https://gbstudiocentral.com/tips/dwf-c9-creating-a-color-palette-part-1/)
- [Pixnote — 15 pro techniques](https://pixnote.net/en/learn/tips/) and glass/reflection references
