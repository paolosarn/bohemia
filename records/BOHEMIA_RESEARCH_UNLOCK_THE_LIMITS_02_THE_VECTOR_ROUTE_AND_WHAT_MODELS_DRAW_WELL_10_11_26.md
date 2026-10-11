# UNLOCK THE LIMITS 02: THE VECTOR ROUTE, AND WHAT LANGUAGE MODELS ACTUALLY DRAW WELL (research, 10/11/26)

Angle: the chats draw by placing coloured rectangles in code and it looks like a seventh grader did it. Does drawing in VECTORS and shrinking to the grid get past that, what can models actually draw, and which free or one-time tools run on GitHub's free CPU runners? Companion to records/BOHEMIA_THE_ART_WORKFLOW_IN_TEN_STEPS_10_11_26.md and records/BOHEMIA_PAOLO_ASEPRITE_10_11_26.md. Container note: outbound fetch was blocked, so every fact rests on search result text; sources are in section 7.

## 1. THE FINDING (five sentences)

A language model is bad at placing pixels one by one, and every benchmark agrees it is also bad at the fine curves of a complex SVG, but it is reliably good at one thing: laying out simple shapes (rectangles, circles, rounded boxes, straight lines) in the right places with the right colours. So the chats should stop drawing pixels and stop drawing fancy curves, and instead write SVG made of plain parts (a wall block, a window, a door, a roof slab, a sign) at four times the final size. A renderer (resvg, free) turns that into a big picture, a box filter shrinks it exactly four times onto the 96 pixel floor grid, and the pack palette is snapped on with no dither. Aseprite ($19.99, bought) then does the artist's hand work as a Lua script with no screen: indexed colour, a one pixel outline, stray pixel cleanup, the eight-facing sheet. This fixes the seventh-grader look for HOUSES, PROPS, STREET FURNITURE and ICONS; it does not fix faces, bodies in eight directions, or anything organic, which still need the image road (the ten steps) or a human.

## 2. THE EVIDENCE: what models draw well and badly

What they draw well:
- Basic geometry placed correctly. The Chat2SVG paper (CVPR 2025) states that current language models "can produce basic geometric shapes, such as circles and rectangles, with layouts that match text prompts but struggle to produce the complex geometric details required for professional SVG applications." That is the whole case for parts-based vector drawing in one sentence.
- Structured, high-level formats. VGBench (EMNLP 2024, 4,279 questions, 5,845 caption pairs) finds models strong on understanding and generation overall but weakest on "low-level formats (SVG)" against TikZ and Graphviz, and reports that chain-of-thought prompting lifts the low-level results. Translation: give the model a part library and a layout to fill, not a blank canvas of path commands.
- Editing a template beats inventing one. SVGenius (2025, 22 to 24 models) and SVGEditBench both measure editing as a separate, easier task than free generation.

What they draw badly:
- Complexity. SVGenius: every model degrades as the SVG gets harder; GPT-4o's perceptual accuracy falls from 82.72% on easy to 42.22% on hard. Failures move from broken syntax to wrong meaning to bad abstraction as the model grows.
- Organic curves. Chat2SVG's own fix is to let the model lay out primitives and then refine the Bezier curves with an image model, because text alone does not land the curves. Simon Willison's "pelican riding a bicycle" test (16 models in Oct 2024, ongoing) shows the same thing in public: recognisable layouts, mangled anatomy, bicycles upside down.
- Pixels. No benchmark even tests models placing raster pixels. Our rectangle-in-code art is a hand-rolled version of the hardest task.
- Specialist models are not a shortcut. StarVector (8B) scores 0.966 on its own SVG-Bench but, per OmniSVG's authors, "fails to generate SVGs" for illustrations and characters. Both are GPU research models, not CPU runner tools.

## 3. THE TOOLS

| Tool | What it does | Price | CPU only? | URL |
|---|---|---|---|---|
| resvg | Renders static SVG 1.1 to PNG, one binary, no runtime deps; `--width` sets the raster size | Free (MIT/Apache) | Yes | https://github.com/linebender/resvg (pip: https://www.piwheels.org/project/resvg-cli, brew: https://formulae.brew.sh/formula/resvg) |
| CairoSVG | Python `svg2png(output_width=…, scale=…)`; needs cairo and libffi on the runner | Free | Yes | https://cairosvg.org/documentation/ |
| Inkscape 1.x | Broadest SVG support; `--export-type=png --export-width=N`; slow in batch; older builds wanted a display, newer CLI is headless for export (slide deck claim, test it; Xvfb is the fallback) | Free | Yes | https://man.archlinux.org/man/inkscape.1.en |
| ImageMagick | `-scale` (box average) for exact integer shrinks; `-remap pack_palette.png -dither None` for the palette snap; already in the day-one plan | Free | Yes | https://usage.imagemagick.org/resize/ |
| Aseprite | The finishing hand: `-b` batch, `--palette`, `--color-mode indexed`, `--scale`, `-script x.lua`; outline, stray pixels, sheets. Compile from source on the runner for own use (EULA FAQ); never publish the binary | $19.99 once (bought) | Yes | https://www.aseprite.org/cli/ and https://community.aseprite.org/faq |
| unfake.js / unfake.py | Detects the true pixel size of a fake-pixel image, snaps the grid, downscales (dominant/median/adaptive), cleans holes and jaggies, quantizes to a fixed palette; Rust-to-WASM core, Python port 10 to 20% faster | Free (open source) | Yes | https://github.com/jenissimo/unfake.js and https://github.com/painebenjamin/unfake.py |
| Retro-Diffusion pixel-art-fixer | Same job, simpler; converts images to grid pixel art | Free (open source) | Yes | https://github.com/Retro-Diffusion/pixel-art-fixer |
| Pixel It | Browser JS: pixelate an image at a scale with a fixed RGB palette; 1.7k stars | Free | Yes | https://github.com/giventofly/pixelit |
| PixelOver | Desktop tool that turns vector/raster into pixel art with indexation and dithering filters; Godot-based, Win/Linux/Mac; GUI, not a CI tool | $30 base on itch (sales seen) | Yes | https://deakcor.itch.io/pixelover |
| Tilesetter | Draws a few base tiles, generates the full tile set and maps | $12.99 | Yes | https://led.itch.io/tilesetter (price per GameFromScratch and itch listing) |
| LDtk | Level editor, JSON project files, open source (MIT) | Name your price, $0 allowed | Yes | https://deepnight.itch.io/ldtk |
| mxgmn WaveFunctionCollapse / DeBroglie | Grow a tilemap from one example; WFC with extra constraints (DeBroglie, C# CLI) | Free (check mxgmn licence file) | Yes | https://github.com/mxgmn/WaveFunctionCollapse and https://www.boristhebrave.com/2018/10/06/debroglie-v0-1 |
| Pixelorama | Free open-source pixel editor (Godot, MIT); GUI with extensions, no documented headless CLI | Free | Yes | https://github.com/orama-interactive/pixelorama |
| hqx and the scaling family | UPscalers only (2x, 3x, 4x). Useless for shrinking to grid; listed so nobody reaches for them | Free | Yes | https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms |

Not found: a ready-made 2D pixel-art shape-grammar building generator. The closest are BlendSmile's parameter-driven Building Generator (C#, Windows, open source, https://blendsmile.itch.io/building-generator) and 3D shape-grammar course projects. The grammar is small enough to write ourselves (section 4, step 1).

## 4. THE PIPELINE FOR THIS REPO

1. THE PART LIBRARY AND THE GRAMMAR. One SVG file per part, drawn once by hand or by a chat from plain shapes: wall slab, window (lit, dark, boarded), door, roof slab at the 45 degree ratio, awning, sign, lamp, battery crate, wreck quarter. A tiny grammar (a JSON file a modder can edit) says how a house is composed: floors times storeys, window spacing, door on the street side, roof on top, light from the top-left. The chat fills the grammar; it does not draw curves.
2. DRAW THE ASSET AS SVG PARTS at 4x: a 96 floor tile is composed on a 384 by 384 canvas, the 112 man on 448 by 448. Only `rect`, `circle`, `ellipse`, `line`, `polygon`, `path` with straight segments, and flat fills from the pack palette hexes. No gradients, no blur filters, no text (font rendering is the known headless failure case).
3. RASTERIZE with resvg: `resvg --width 384 house_03.svg house_03_4x.png`. CairoSVG is the Python fallback; Inkscape only when a feature resvg lacks is needed.
4. SHRINK EXACTLY FOUR TIMES with a box filter, never bilinear and never a non-integer factor: `magick house_03_4x.png -scale 25% house_03_96.png` (or Pillow `Image.BOX`). The 2dwillneverdie "Fix my sprite" method is this exact trick: draw at 800%, shrink, index to a fixed palette, minor cleanup. The box filter keeps the lines straight; nearest at a non-integer factor makes the uneven cells unfake.js exists to repair.
5. SNAP TO THE PACK PALETTE, no dither: `magick house_03_96.png -dither None -remap pack_palette.png house_03_locked.png`, then `identify -format "%k"` must not exceed the pack tile's colour count (day-one plan step 3, already written).
6. OUTLINE AND CLEAN IN ASEPRITE, headless: `aseprite -b house_03_locked.png --palette pack_palette.png --color-mode indexed -script tools/aseprite/outline_one_px.lua -script tools/aseprite/strip_orphans.lua --save-as house_03.png`. The Lua scripts are the ones PLUMBER [aseprite in the pipe] already owes; this pipeline is their first customer.
7. THE TELLS GATE (step 6 of the ten steps) runs unchanged: palette, seams against eight neighbours, 96 and 112 measure, orphan pixels, pillow shading, light direction. A fail re-runs from step 2 with the gate's note in the grammar, never by hand-editing pixels in code.
8. FOR PEOPLE, do not use this road. Eight directions, faces and cloth stay on the image road (Retro Diffusion per the ten steps) or a human, then unfake.py or the Aseprite scripts for cleanup.

## 5. WHAT IT FIXES AND WHAT IT DOES NOT

Fixes: the rectangle look on buildings, street furniture, vehicles, icons, UI chrome and ground tiles, because those ARE compositions of simple shapes, the one task the model is proven good at. Fixes seams and off-palette colours mechanically. Fixes "every chat draws differently," because every chat fills the same grammar from the same part library. Costs nothing per asset.

Does not fix: faces, hands, hair, bodies in eight facings, beasts, anything that needs a confident curve; Chat2SVG and the pelican test both show the model cannot land those from text. Does not replace the eye: YES / NO / FINAL stays. Does not make the analog horror on its own; the grammar must carry the bible (cracked glass part, sagging awning, dead lamp) or the houses come out clean and wrong. Does not help with the 45 degree law unless the roof and wall parts are drawn to the ratio once and reused.

## 6. ONE RULE

NO CHAT DRAWS A PIXEL OR A CURVE IN CODE. A chat composes named vector parts through the grammar at 4x; the machine shrinks, snaps, outlines and measures; a person draws what has a face.

## 7. SOURCES

- Chat2SVG (CVPR 2025): https://openaccess.thecvf.com/content/CVPR2025/papers/Wu_Chat2SVG_Vector_Graphics_Generation_with_Large_Language_Models_and_Image_CVPR_2025_paper.pdf
- VGBench (EMNLP 2024): https://arxiv.org/pdf/2407.10972
- SVGenius: https://arxiv.org/pdf/2506.03139 and https://zju-real.github.io/SVGenius/
- SVGEditBench: https://arxiv.org/pdf/2404.13710
- StarVector and SVG-Bench: https://starvector.github.io/starvector/
- OmniSVG: https://arxiv.org/html/2504.06263v1
- SVGen (chain-of-thought for composition): https://arxiv.org/html/2508.09168v1
- Simon Willison, pelicans on a bicycle: https://simonwillison.net/tags/pelican-riding-a-bicycle/
- resvg: https://github.com/linebender/resvg; pip wheels https://www.piwheels.org/project/resvg-cli
- CairoSVG docs: https://cairosvg.org/documentation/
- Inkscape 1.x man page: https://man.archlinux.org/man/inkscape.1.en; headless notes https://socallinuxexpo.org/sites/default/files/2026-03/automating-inkscape.pdf
- ImageMagick resize and -scale: https://usage.imagemagick.org/resize/
- Aseprite CLI: https://www.aseprite.org/cli/; EULA FAQ https://community.aseprite.org/faq; store https://dacap.itch.io/aseprite
- "Fix my sprite" volume 3 (draw at 800%, shrink, index): https://2dwillneverdie.com/tutorial/fix-my-sprite-volume-3/
- Saint11 on scaling (the warning against naive downscale): https://saint11.art/blog/scaling/
- unfake.js: https://github.com/jenissimo/unfake.js; unfake.py: https://github.com/painebenjamin/unfake.py
- Retro-Diffusion pixel-art-fixer: https://github.com/Retro-Diffusion/pixel-art-fixer
- Pixel It: https://github.com/giventofly/pixelit
- PixelOver: https://deakcor.itch.io/pixelover; licences https://docs.pixelover.io/manual/licenses/
- Tilesetter price: https://gamefromscratch.com/?p=23443
- LDtk: https://deepnight.itch.io/ldtk
- WaveFunctionCollapse: https://github.com/mxgmn/WaveFunctionCollapse; DeBroglie: https://www.boristhebrave.com/2018/10/06/debroglie-v0-1
- Pixelorama: https://github.com/orama-interactive/pixelorama
- Pixel-art scaling algorithms (hqx family, upscale only): https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms
- BlendSmile Building Generator: https://blendsmile.itch.io/building-generator
