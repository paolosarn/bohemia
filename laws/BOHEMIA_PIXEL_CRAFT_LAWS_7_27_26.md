# BOHEMIA — THE PIXEL CRAFT LAWS (7/27/26, LOCKED)

Paolo, 7/27: *"i need you to stop being ass and be a great art direction guy look
and do big brain online research to learn the skillset of actualy pixel shit
pixel assets and yeah go to school for me for a couple turns and learn some laws
brother."*

So I went to school. This is what the craft actually says, where it says it, and
what it says about **our own art** when you point it at us. Sources are at the
bottom and every law that came from one is marked with it. Laws I derived rather
than found are marked **[DERIVED]** and say so, because a citation I invented
would be worth less than no citation.

**HOW THIS RESEARCH WAS DONE, stated so nobody over-trusts it.** This environment's
network policy blocks direct page fetches — every attempt returned 403 at the
proxy. Search worked. So these laws are built from search-returned summaries of
the primary sources, not from reading the pages end to end. Where a summary gave
me a verbatim sentence I quote it as verbatim; where it gave me a paraphrase I
say the idea, not a fake quote. **Pixel Logic** (Michael Azzi) is the standard
book on this and I could not open it; buying it is a real backlog item, not a
thing to fake having read.

---

## 0. THE ONE THAT EXPLAINS EVERY REJECTION

> *"AI learned what pixel art looks like, but never learned what pixel art is.
> Most AI 'pixel art' generators are not really making pixel art at all — they
> generate a normal image in a pixel-ish style and shrink it down, which leaves
> you with blurry edges, stray colors..."* — QWE / SpriteFusion writeups on
> AI pixel art

> *"True pixel art is a document of palette indices on a fixed-size grid."*

Paolo, 7/26, looking at my work: *"it looks like hallucinated AI slop."* He was
not being rude. He was being **accurate**, and the craft has a name for exactly
what he saw. Everything below is downstream of this one sentence.

**LAW 0. A TILE IS A DECISION PER PIXEL, NOT A PICTURE SHRUNK DOWN.** If the art
was rendered/painted continuous-tone and then reduced, it is not pixel art no
matter what size it ends up. The tell is measurable and we measure it.

---

## 1. CLUSTERS AND ORPHANS — the noise law

> *"Orphan pixels [are] single pixel units not connected to a cluster of the same
> color... they can distract the eye."* — Slynyrd, Pixelblog 2 (Texture)

> *"These one pixel clusters are also called orphan pixels and they usually are
> responsible for the image looking noisy and confusing."* — Saint11 (Pedro
> Medeiros), Cluster Sketching and Painting

> *"While making pixel art, my focus is to have as few clusters as I can and to
> avoid one-pixel clusters by all means."* — Saint11

**LAW 1. PIXELS TRAVEL IN GROUPS.** A colour that appears once, alone, touching
nothing of its own colour, is noise. The legal exceptions the craft itself names:
a pixel that is part of an anti-aliasing step, a shading curve, or a deliberate
single-pixel detail. Everything else is cleaned up.

**WHAT IT SAYS ABOUT US:** our frozen act-1 tiles are **73.6% orphan pixels on
average**, and the ground tiles — the surface most of the world is made of — are
**99%+**. `concrete_0` is 99.6% orphan pixels. Effectively every pixel in our
roads, walks and yards is a lone speck of its own unique colour. That is not a
style choice, it is the definition of noise, and it is why the world reads as
mush next to the assets Paolo approved by hand.

---

## 2. COLOUR — the palette law

> *"Three colors (shadow / base / highlight) is the standard starting point and
> works for most 16×16 and 32×32 sprites. Add steps as your sprite size grows:
> 32×32 characters benefit from 4–5 steps, 64×64 from 5–7 steps."*

> *"Value is how light or dark a color is. This is arguably the most important
> property in pixel art. Good value structure creates readable artwork even when
> converted to grayscale."*

> *"Hue shifting is intentionally changing the hue of colors as you move through
> a ramp — typically pushing shadows toward cooler hues (blue, violet) and
> highlights toward warmer ones (yellow, orange)."*

> *"As the colors reach high brightness levels it's important to decrease
> saturation, or you'll end up with intense eye burning colors."*

**LAW 2. A TILE GETS A RAMP, NOT A SPECTRUM.** At our 44px cell the honest budget
is roughly **4–7 values per material**, hue-shifted (shadows cooler, lights
warmer), never a smooth gradient. Value carries the read; hue carries the
richness. A tile that survives being turned to greyscale is built right.

**WHAT IT SAYS ABOUT US:** one 44x44 tile in our set carries **1610 colours** in
1936 pixels. The whole target plate carries 46,082. The mobile render contract
already admits the palette clause is unmet and ratchets it. Now we know the size
of the gap: it is not "needs indexing", it is **three orders of magnitude**.

---

## 3. LINE ART — jaggies, doubles, consistency

> *"Keep the same line width throughout the whole sprite."* — Pixel Logic ch.1

> *"Don't surround a row of pixels with bigger ones... Pixel art loves lines that
> have the same 'stairs', staircases with the same number of pixels on each step.
> The steeper the line, the bigger the 'step'! Don't mix staircases. If you have
> stairs of two-pixel steps, don't include a one pixel step."* — Pixel Logic ch.1

> *"Doubles are when a line doubles up, usually as it curves or turns an angle."*

**LAW 3. ONE STAIRCASE PER LINE.** Every diagonal in Bohemia runs a single
consistent step length. A 1px step inside a run of 2px steps is a jaggie and it
is a defect, not a texture.

---

## 4. ANTI-ALIASING — and when not to

> *"Anti-aliasing... helps soften the contrast between two colors."*

> *"You should let pixels be pixels at some point... which keeps some of the
> natural charm of pixel art."*

> *"Be careful when using anti-aliasing on outer edges of game art in
> particular... you do not know what color you're transitioning to."*
> — Wesnoth wiki / 2D Will Never Die

**LAW 4. AA IS INTERNAL, NEVER ON THE SILHOUETTE.** A tile that will sit against
an unknown neighbour must not anti-alias its own outer edge, because it does not
know what it is blending into. This is doubly true for us: our tiles get laid
next to arbitrary other tiles by the world generator.

---

## 5. BANDING

> *"Banding is a distracting effect where, because of thick, uniform bands of
> color, our eyes begin to focus on the lines where the colors meet instead of
> the colors themselves. You can fix banding by varying the width of your shading,
> or breaking up bands with dithering."* — Derek Yu

**LAW 5. BANDS VARY IN WIDTH.** Two shades running parallel at identical
thickness make the eye read the seam instead of the surface.

---

## 6. DITHERING

> *"If dithering doesn't clearly improve the piece, leave it out, as new artists
> tend to over-dither."*

> *"Below approximately 16×16 there's no room for a pattern to read, so it just
> adds noise."*

**LAW 6. NO DITHER IN ACT 1** — already Bohemia law (mobile render contract §5),
and the craft agrees for our reasons: stipple crawls under a 2x/3x integer blit
on a phone. Confirmed, not changed.

---

## 7. SHADING AND LIGHT

> *"Pillow shading refers to shading from the outline inward... This type of
> shading almost never occurs naturally in real life and tends to make the object
> look blurry and indistinct... If you can't answer where the light is coming
> from, you might be pillow shading."*

> *"Decide where your light is coming from before you begin."*

> *"Warm (yellow-orange) light sources cast cool (blue-purple) shadows, because
> the shadow is lit by ambient sky rather than the direct source."*

> *"Cast shadows help make objects feel like they connect with the ground, and
> it's best to keep them subtle and not cast out long in any particular
> direction, to minimize conflicts with overlapping adjacent tiles."* — Slynyrd

**LAW 7. ONE KEY, AND THE TILE MAY NOT ARGUE WITH IT.** Bohemia keys from the
upper LEFT (contract §4). A tile whose own brightness gradient points somewhere
else will read as pasted on no matter how good it is alone.

Note the Slynyrd caveat lands exactly on Bohemia's existing SHADOWS-ARE-SEPARATE
law: long baked cast shadows fight their neighbours in a tiled world, which is
precisely why our shadows are a runtime layer and not asset pixels.

**WHAT IT SAYS ABOUT US:** 38 of our 42 tiles have a measurable light direction
and only **14 of them agree with the upper-left key**. Twenty-four tiles are lit
from somewhere else. That is a second, independent reason the world does not
cohere, and nothing in the machine was looking at it until today.

---

## 8. TEXTURE — how material is implied without noise

> *"A good texture may only need a few simple clusters repeated over and over but
> with varied distribution patterns."* — Slynyrd, Pixelblog 2

> *"Avoid depicting every single brick as this would appear noisy and detract
> from the overall forms of the structure. Avoid emphasizing the outlines of the
> bricks, as this can look very busy."* — Slynyrd

**LAW 8. MATERIAL IS A FEW SHAPES REPEATED, NOT EVERY GRAIN DRAWN.** Stucco is
not a noise field. Asphalt is not a noise field. This is the direct fix for the
99% orphan ground tiles: they are trying to be photographic material and they
should be four clusters in a varied arrangement.

---

## 9. RESOLUTION AND MIXELS

> *"Mixing different pixel sizes can create a visually displeasing effect."*

> *"Mixing 16x16 characters with 64x64 backgrounds... creates a jarring mismatch
> in pixel density. Keep resolution consistent within the same scene."*

> *"Always scale by integer multiples (2x, 3x, 4x...). Non-integer scaling like
> 1.5x or 2.7x causes uneven pixel sizes."*

**LAW 9. ONE PIXEL SIZE IN A SCENE, INTEGER SCALING ONLY.** Already Bohemia law
(contract §1/§2/§7) and already gated — this is the craft confirming the fix we
made on 7/26 after Paolo said *"zoomed in zoomed out pictures of windows"* and
*"why the cars look like they're low quality pixel wise."* He diagnosed a
textbook mixel problem in his own words before I had read the textbook.

**WHAT IT SAYS ABOUT US:** the one thing we pass clean. Every tile in the set
measures a block size of 1 — authored at the real cell, no hidden upscale.

---

## 10. READABILITY

> *"If the silhouette isn't readable, no amount of shading will fix it. You can
> test your silhouette by squinting."*

> *"Value contrast matters more than hue."*

> *"Backgrounds should be less saturated than foreground sprites."*

**LAW 10. SILHOUETTE FIRST, SHADING LAST.** And Bohemia's own corollary, already
paid for in blood: **an object must be nameable.** *"Every time you make
something you have to be able to describe what it is"* (Paolo, 7/26) is the
NAME-IT-OR-DON'T-DRAW-IT law, and it is the same law as this one from the other
end — a shape you cannot name does not have a readable silhouette.

---

## 11. PROJECTION — [DERIVED, with one citation]

> *"In this projection it's as if you are viewing the house from 45 degrees
> above, and from such a vantage point you see about 3/4 of both the roof and
> facade."*

> *"In pixel art, uniformity takes priority over realism, and as long as all
> elements in a scene follow the same set of rules the resulting uniformity will
> please the eyes."* — Slynyrd, Graphical Projection

> *"Use a character as a sort of yardstick and decide how high you want doors,
> windows and roofs to be, to keep consistent environment dimensions."*

**LAW 11. UNIFORMITY BEATS REALISM.** This is the single most useful sentence I
found, and it retroactively justifies the whole proportion canon: the reason a
door is exactly 2 cells and a body clears 77% of it is not realism, it is that
*everything obeys the same rule*. Bohemia is axis-aligned oblique, not isometric,
so the 2:1 two-step line rule does **not** apply to us — but the yardstick rule
does, and we already have it.

**LAW 11b [DERIVED].** **A DOOR IS A HOLE, NOT A PICTURE OF A DOOR.** I searched
for craft writing on this specifically and found none worth citing, so this one
is ours, derived from occlusion: an opening reads as an opening when the wall
plane is genuinely interrupted — jamb on both sides, the inside darker than any
lit face, and the leaf seen EDGE-ON rather than flat. Paolo said it twice on
7/26 (*"you have a door that's a picture of a door"*, then *"half of the door is
like a picture of a door"*) before I fixed it. It is already in the
NAME-IT-OR-DON'T-DRAW-IT addendum; it is restated here because it belongs with
the craft, not with the incident.

---

## 12. TILESETS — [craft-cited, and mostly new to us]

> *"The rightmost column of pixels must visually match the leftmost column of the
> tile next to it, and the same applies for top and bottom rows. However, this
> doesn't mean they need to be identical — that would create obvious vertical and
> horizontal lines."*

> *"If you place a long line of horizontal tiles they will start to look
> repetitive, and it is often required to design 2 to 5 variations for the most
> used tiles."*

> *"The advantage of 'Blob' tilesets is that just 47 tiles are needed to
> seamlessly cover floor or rug-like areas."*

**LAW 12. EDGES MATCH WITHOUT BEING IDENTICAL, AND HIGH-TRAFFIC TILES GET 2–5
VARIANTS.** We already ship road_0/1/2, walk_0/1/2, yard_0/1/2 — three variants
each, inside the craft's stated range, by accident rather than by law. Now it is
by law. The 47-tile blob/Wang autotile pattern is the industry answer to
transitions and we are not using it; that is a real, named piece of missing
machinery, not a defect.

---

## WHAT THE MACHINE HOLDS

`gates/pixel_craft_gate.py`, registered in the suite. It measures six things a
machine can honestly measure — orphan share, single-use colour share, pixel block
size, pillow score, one-key consistency, cluster density — via
`tools/bohemia_pixel_craft_audit.py`.

**AMENDED 7/28, and the amendment is worth reading because it is the failure mode
this whole document exists to prevent.** LAW 7 was first checked by measuring each
tile's overall brightness gradient and demanding it point at the upper-left key.
That check failed the re-cooked set at 29% — and the check was wrong, not the art.
Ground tiles scored 3/16, because a flat floor has no facing surface and its
gradient is only where the wear happens to be. Worse, it failed structure tiles
that were *right*: `wall_under_eave` reads brighter downward because it is
literally the course sitting in the eave's shadow, and `wall_base` reads brighter
upward because it carries thirty years of dust along the ground. Correct art,
called a defect by a bad instrument.

It is now checked by PAIRS, which is what the law actually claims — if there is
one key from the upper left then the sunlit side of a form is lighter than its
shaded side: `wall_end_l > wall_end_r`, `roof_hipBL > roof_hipBR`,
`roof_hipTL > roof_hipTR`, `wall_0 > wall_under_eave`, `roof_ridge > roof_slope`.
Unfakeable, meaningful, and impossible to satisfy while ignoring the key.

The rule that governed the amendment: **a gate is never edited to let code
through.** The test for whether this was special pleading is that the OLD frozen
set failed the old check just as badly (37%), so the instrument was broken before
my art ever met it.

**It ratchets; it does not retroactively condemn.** The frozen act-1 set is
byte-locked by Paolo's CBB verdict and this gate does not get to overrule a
verdict. So the frozen set's numbers are RECORDED as the baseline and the gate
fails only if they get WORSE, while any bank registered from here on is held to
the real craft thresholds. That distinction is deliberate and it is the same
shape as the palette ratchet already in the contract.

**AND IT IS NOT A TASTE MACHINE.** None of the six say whether a tile looks good.
Amendment B is still the law: the gestalt is always Paolo's. These say whether
the thing was BUILT like pixel art. Art can pass all six and be ugly. It cannot
fail them and be pixel art.

---

## SOURCES

- Derek Yu — [Pixel Art Tutorial: Basics](https://www.derekyu.com/makegames/pixelart.html) and [Pixel Art: Common Mistakes](https://www.derekyu.com/makegames/pixelart2.html)
- Saint11 / Pedro Medeiros — [Cluster Sketching and Painting](https://saint11.art/pixel_art_articles/article2/), [Glossary](https://saint11.art/blog/glossary/), [Anti-Alias and Banding](https://medium.com/pixel-grimoire/how-to-start-making-pixel-art-4-ff4bfcd2d085), [Basic Color Theory](https://medium.com/pixel-grimoire/how-to-start-making-pixel-art-6-a74f562a4056)
- Raymond Schlitter (Slynyrd) — [Pixelblog 1: Color Palettes](https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes), [Pixelblog 2: Texture](https://www.slynyrd.com/blog/2018/2/15/pixelblog-2-texture), [Pixelblog 3 & 4: Graphical Projection](https://www.slynyrd.com/blog/2018/3/14/pixelblog-3-graphical-projections-1), [Pixelblog 41: Isometric](https://www.slynyrd.com/blog/2022/11/28/pixelblog-41-isometric-pixel-art)
- Michael Azzi (Michafrar) — [Pixel Logic: A Guide to Pixel Art](https://pixellogicbook.com/) — **not read, could not fetch; buy it**
- Pixel Parmesan — [Anti-Aliasing Fundamentals](https://pixelparmesan.com/blog/anti-aliasing-fundamentals-for-pixel-artists), [Dithering for Pixel Artists](https://pixelparmesan.com/blog/dithering-for-pixel-artists)
- Battle for Wesnoth wiki — [How to Anti-Alias Sprite Art](https://wiki.wesnoth.org/How_to_Anti-Alias_Sprite_Art)
- 2D Will Never Die — [Spriting basics: Anti-aliasing](https://2dwillneverdie.com/tutorial/spriting-basics-anti-aliasing/)
- Pixnote — [Glossary](https://pixnote.net/en/learn/glossary/), [Shading & Lighting](https://pixnote.net/en/learn/shading/), [Resolution guide](https://pixnote.net/en/learn/resolution/)
- Sandro Maglione — [How to create a Pixel Art Tileset](https://www.sandromaglione.com/articles/how-to-create-a-pixel-art-tileset-complete-guide)
- OpenGameArt — [Wang 'Blob' Tileset](https://opengameart.org/content/wang-%E2%80%98blob%E2%80%99-tileset)
- On the AI failure mode — [QWE: AI Pixel Art Is Broken](https://www.qwe.edu.pl/tutorial/create-pixel-art-with-ai-tools/), [SpriteFusion: How to Fix AI-Generated Pixel Art](https://www.spritefusion.com/pixel-snapper/how-to-fix-ai-pixel-art)
