# UNLOCK THE LIMITS 08: STRETCHING THE PACKS (KITBASHING, RECOLOUR, MODULAR TILES, DECALS)

Research, 10/11/26, rule 108 line. Angle: how pixel artists and small studios turn a bought pack into a whole game without it looking stitched. Web research by search-result text only (outbound fetch is blocked in the container; where a fact rests on a result snippet it says so). One-time or free tools only; the pipeline runs on GitHub's free CPU runners. No reference game is proposed.

## 1. THE FINDING

Studios do not draw beside a bought pack; they cut it up, recolour it and recombine it, and every new piece is checked against numbers measured from the pack. The four moves that stretch a pack are kitbashing (cut parts, glue parts), decals (dirt, cracks, graffiti laid over a base tile), modular autotiles (a handful of drawn edges generates the full 47-tile set), and faction recolour (a remap of the pack's colour ramps, never a hue filter). All four run headless with Aseprite in batch mode or plain Python PIL on a free runner. One measurement from our own bank matters most: a single bought road tile holds 2,400 to 3,000 unique colours, so these packs are high-colour pixel art, and the classic indexed palette swap does not apply; recolour has to be a ramp remap or an HSV band shift. The licence question is simple: modified pack art may ship inside the game, but never as loose files, so the kitbashed outputs stay out of any public pack and out of records that a stranger could download as a tile library.

## 2. THE TECHNIQUES

**Kitbashing (cut and recombine).** Yields new props, cars, barricades and house skins from parts the pack already drew (a door from pack 2 on a wall from pack 5, a fire barrel beside a pack 15 cone). Headless: PIL `Image.crop` on alpha-bounded parts, `Image.alpha_composite` onto a 96 px canvas, drop shadow sampled from the pack's own shadow colour. PixelBasher is the commercial proof the method is standard (parts that auto-tile so they resize without stretching). Risk: two parts lit from different sides, or two outline weights, read as stitched; the rule sheet below is the gate.

**Decals and overlays.** Yields twenty variants of one base tile from five decals: cracks, oil, dirt, graffiti, snow, blood, posters. The post-apocalyptic itch packs do exactly this (broken-window and damaged-pipe variants layered over a base set). Headless: PIL composite with a decal mask, seeded per map cell so no two combat boards share a tile (rule 59, the 9/29 board record). Risk: a decal with its own light or outline floats; decals carry no outline and only darken or stain, never highlight.

**Modular autotiles (Wang / blob / 47-tile).** Yields a seamless road, kerb, sidewalk and median set from a few drawn edges. The 47-tile blob set covers every corner and side case; a 15-tile Wang template, or even a 2x3 template of six tiles, generates it (itsjavi/autotiler, AutoBlob for Aseprite, nodefunc's free browser generator; Sandro Maglione's sub-tile method composes 14 tiles from 8 blocks). Headless: a Python bitmask script that reads neighbours, picks the tile index and stitches quadrants; Tiled and LDtk both store the rule sets in a plain file a chat can read. Risk: our 95x96 and 94x91 pack pieces are not a uniform 96 grid, so sub-tiling needs each piece padded to 96 first, documented in the bank index.

**Faction recolour (COLOUR IS TERRITORY).** Yields one faction's version of every tile and coat. The field rule is "a palette swap is not a hue filter": a global hue rotate moves every colour by the same degrees with saturation and value frozen, kills the hue shifting the artist put in the ramp, and turns skin and wood green. Studios remap shade to shade (a two-texture lookup, reference palette to swap palette, as in the Godot LUT shader and Cyanilux's write-up). Headless with 2,400-colour tiles: quantise the tile to its ramps first (PIL `quantize` or Aseprite `--color-mode indexed` with a locked `.gpl` palette), then remap ramps, then let the engine's palette shader do it live. The repo's own measurement: road tiles sit at median saturation 0.06, props at 0.17 to 0.54, so a faction colour belongs on the props and markings, not the asphalt. Risk: remapping without quantising yields speckle; quantising too hard flattens the pack's grain.

**Mix-and-match character layers (paper doll).** Yields hundreds of people from a base body plus layered hair, coat, head gear, in every direction, which is exactly how the Universal LPC generator works (base, then eyes, hair, clothing, weapons, exported as one multi-direction sheet with a per-asset licence sheet). Our rig already layers; the lesson is the licence sheet generated per output. Risk: layer order and the one-pixel border law (8/16) fight at the seams; the seam check is a gate, not a note.

## 3. THE TOOLS

| Tool | Job | Price | URL |
|---|---|---|---|
| Aseprite | the editor; `-b --script` headless; `--palette`, `--color-mode indexed`, `--save-as` on the CLI | $19.99 once (bought 10/11) | https://www.aseprite.org/cli/ |
| AutoBlob (Aseprite) | 47-tile blob set from a 2x3 template, inside Aseprite | price not shown in results | https://violetpixel13.itch.io/autoblob |
| itsjavi/autotiler | 15-tile Wang to 47-blob, free, open | free | https://github.com/itsjavi/autotiler |
| nodefunc autotile generator | 47-tile template in the browser, exports Godot/Unity/Tiled | free (per its page) | https://nodefunc.com/tools/autotile-generator |
| Tilesetter | source tiles in, seamless autotile set out, deterministic | $12.99 once | https://led.itch.io/tilesetter |
| Tiled | map editor, autotile rules in plain files | free | https://www.mapeditor.org/ |
| LDtk | level editor, open source, auto-layers | free | https://ldtk.io/ |
| Sprite Fusion | browser tilemap editor | free tier; desktop $14.99 (unverified) | https://www.spritefusion.com/ |
| PixelBasher | kitbash from a parts library | $19.99; "not actively maintained", on hold since 7/2024 | https://blastmode.itch.io/pixelbasher |
| Universal LPC generator | layered character sheets with a licence sheet per export | free, mixed CC0/CC-BY/CC-BY-SA/GPL per asset | https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator |
| Python PIL | crop, composite, quantize, count colours (`getcolors` needs `maxcolors` raised past 256) | free | https://pypi.org/project/pillow/ |
| Lospec | palette library for hand-tuned hue-shifted ramps | free | https://lospec.com/palette-list |

## 4. THE PACK-RULE SHEET (measure before adding)

| Rule | How a chat measures it | Our bank, first read |
|---|---|---|
| Outline width and colour | dilate the alpha mask by one pixel at a time until the ring stops being darker than the fill; record width in px and whether the ring is black or a darker fill colour (the LPC guide: darker version of the local colour for tiles, near black for characters) | OWED per family |
| Light angle | for each opaque pixel pair across the sprite's centre, compare luma left vs right and top vs bottom; the brighter side is the light; report as a clock angle (LPC: from above, slightly left) | OWED |
| Saturation range | HSV per opaque pixel, report min / median / max | road 0.06 median, props 0.17 to 0.54 |
| Cluster size | connected components of same colour; median area in px tells grain (big flat clusters vs one-pixel noise) | OWED |
| Palette size | unique RGB per piece; and after quantise to N, the N where error stops falling | 1,600 to 3,100 raw per tile (not indexed art) |
| Value steps per ramp | sort a quantised ramp by luma; count steps and the hue drift per step (field norm 10 to 20 degrees, warm up, cool down) | OWED |
| Grid and footprint | bounding box vs the 96 cell; list every piece not 96 wide | 95x96 median, 94x91 props, 81 to 85 roofs |

A new piece passes when every row sits inside the pack's measured range for its family. The sheet lives beside the bank index; the reference check gate reads it.

## 5. LICENCES IN PLAIN WORDS

itch.io's General Paid Asset License (the template many sellers use) says: modify, recolour, resize and combine freely for your product; the modified version stays under the same licence; never resell, share as loose files, bundle into another pack, or let others extract it; and no systems that generate derivative assets for third parties. Kenney's packs are CC0: use, modify, remix and even republish. LPC art is per asset CC0, CC-BY, CC-BY-SA, OGA-BY or GPL; the generator prints the credit sheet; share-alike terms travel with the derivative. Each seller may change the template, so the pack's own page is the authority (search-result text; not fetched). For us: kitbashed and recoloured outputs ship in the game, the bank stays in the private repo, no contact sheet of pack art goes to a public page, and a LICENCE line rides with every bank folder.

## 6. WHAT IT FIXES, WHAT IT DOES NOT

Fixes: variety without drawing (decals, seeds, autotiles); faction colour on everything the pack already has; houses and props in the pack's hand from the pack's parts; the stitched look, because every output is measured against the sheet. Does not fix: a shape the pack never drew (a new beast, a new vehicle, a face) still needs a drawing hand or the Aseprite workflow; high-colour tiles resist clean palette swaps until quantised; a 96 grid the packs only mostly honour; and no tool here judges whether a thing looks good, only whether its numbers match.

## 7. ONE RULE

Nothing is drawn fresh beside the pack: every new piece is cut, layered, generated or recoloured FROM pack parts, and it reaches the vote only when its outline, light, saturation, cluster and palette numbers sit inside the family's measured range.

## 8. SOURCES

- https://pixelbasher.dev/ and https://blastmode.itch.io/pixelbasher (kitbashing as a product; price and status)
- https://www.sandromaglione.com/articles/pixel-art-game-tileset-made-easier (sub-tiles compose a blob set)
- https://freepixel.art/blog/how-to-design-pixel-art-tilesets-for-seamless-worlds (variants share edges)
- https://github.com/itsjavi/autotiler ; https://violetpixel13.itch.io/autoblob ; https://nodefunc.com/tools/autotile-generator ; https://github.com/leobaray/blobsmith-autotile-wirer (47-tile generators)
- https://lpc.opengameart.org/static/LPC-Style-Guide/build/styleguide.html (light from above, slightly left; outline as darker local colour)
- https://drmonojog.com/keeping-pixel-art-consistent-across-an-indie-game/ ; https://github.com/Ridejock/Emerald/issues/22 (style spec and normalising pipeline)
- https://www.cyanilux.com/tutorials/color-swap/ ; https://sglmnaz.itch.io/paletteswap-with-luts ; https://spritesheetgenerator.online/guides/color-palettes-palette-swaps (LUT swap; "a palette swap is not a hue filter")
- https://the-pixel.art/articles/hue-shifting-pixel-art-shading/ ; http://pixeljoint.com/forum/forum_posts.asp?TID=7501 (hue shift per step, saturation peaks mid-ramp)
- https://www.aseprite.org/cli/ ; https://community.aseprite.org/t/change-the-palette-of-several-sprites/4299 ; https://github.com/briacp/aseprite-scripts/blob/master/Change%20Palette.lua (headless palette work)
- https://itch.io/blog/929708/general-paid-asset-license ; https://kenney-assets.itch.io/ui-pack ; https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator (licences)
- https://itch.io/e/4929087/dallenz-added-to-tools ; https://www.spritefusion.com/ ; https://alternativeto.net/software/ldtk/ (prices)
- https://www.thecodingcouple.com/counting-pixels-by-color-in-python-with-pillow-a-pil-fork/ (PIL colour counting)
- Repo measurement: reference/art_bank road and prop tiles, PIL, this round.
