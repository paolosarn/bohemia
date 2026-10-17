# THE ART PIPE: ASEPRITE IN THE REPO, ONE PACK TILE THROUGH IT WITH NO PIXEL TYPED, AND THE FENCE BEHIND IT
PLUMBER, 10/17/26, VAMILY row [the art pipe gate]. Rule 108 ROUND EIGHT (a); the research page
records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_06_WHAT_GOES_IN_THE_REPO_SKILLS_AND_TOOL_SERVERS_10_11_26.md.
Paolo 10/10: "all the art assets you made look like AI slop ... every time you make something art-wise you use
the tiniest amount of pixels possible." His one word 10/11: Aseprite.

## WHAT LANDED, IN THREE PARTS

### 1. The server is in the repo: tools/aseprite_mcp/ (MalloyTheDev/aseprite-mcp, MIT, upstream 8b7e95b6 of 10/9)
Vendored, 1.7 MB: the Python package (163 tools: draw, shade on a ramp, palette, layers, frames, tags, slices,
export, and the three the row named, `assess_sprite`, `diff_sprites`, `validate_loop`), its LICENSE, upstream's
TOOLS.md reference, and a README with the one install line and the one start line:

    python3 -m pip install 'mcp[cli]>=2.0.0' 'pillow>=12.3.0' 'pydantic>=2'
    PYTHONPATH=tools/aseprite_mcp ASEPRITE_PATH=/path/to/aseprite python3 -m aseprite_mcp

It drives Aseprite in batch mode by writing Lua, so every edit is a real `.aseprite` file he can open in the
editor he bought. Relative paths are sandboxed to a workspace folder; the README points it at a cook folder,
never at slices/ or engine/ (rule 100).

### 2. THE PROOF: one of his pack tiles through the pipe end to end (tools/aseprite_mcp/bohemia_pack_tile_through_the_pipe.py)
Aseprite was built headless from its public source in this container to run it (the EULA allows compiling
for your own use; the binary is NOT committed): `-DENABLE_UI=OFF -DLAF_BACKEND=none`, 1,549 compile steps,
6 min 54 s on four cores after the X11 dev headers were installed and libjpeg-turbo was fetched by git
(GitHub's archive URL answers 403 behind this container's proxy). That measurement is row [aseprite in the pipe]'s
first line, already taken.

The script holds no colour and no coordinate. On `reference/art_bank/road/pack_1_cobblestone_floor_tiles_000.png`
(94 by 95, 8,400 colours, from his approved packs), in 0.9 s:

    create_sprite 94x95 rgb          -> draw_image_base64 (the tile in, 94x95 stamped at 0,0)
    quantize_palette to its own 255  -> set_color_mode indexed REFUSED by the server: "would lose 20 of 8,670
                                        drawn pixels"; the sprite on disk unchanged; the refusal is in the report
    add_outline, 1 px, its own darkest palette entry   224 pixels written
    remove_stray_pixels                                 256 replaced
    assess_sprite                                       8,171 colours, 8,310 of 8,670 pixels isolated, 82 jaggy corners
    export_png 1:1                                      27 KB

Output: reference/art_pipe/proof/ (the .aseprite, the PNG, report.json with every step's JSON and the palette
before and after). `python3 gates/art_pipe_gate.py --count` on the script: 0 literal pixel writes.

TWO THINGS THE PROOF TAUGHT, said plainly:
- THE SERVER REFUSES TO LOSE A PIXEL, and that is the point of a tool over code: a PIL script would have
  converted and 20 pixels would have vanished without a word. The tile stayed RGB on its own 255.
- HIS TILES READ AS NOISE TO A PIXEL-ART CHECKER: 8,310 of 8,670 pixels "isolated" (no neighbour of their own
  colour). This is DIRECTION's 10/11 finding from the other side (pixel_craft_gate would fail every tile he
  bought): his packs are painted surfaces with thousands of colours, not ramps. assess_sprite's isolated count
  is not a verdict on his packs; it is a reading to take at 8 value steps, as DIRECTION's note says.

### 3. THE FENCE: gates/art_pipe_gate.py, in the suite as ART PIPE. 5/0.
Counts literal pixel writes per drawing tool over 1,008 files under tools/ (not the vendored server):
    Python/Pillow   .putpixel(  .putdata(  draw.point(  draw.line(  draw.polygon(  rectangle/ellipse with fill=  chord/pieslice
    JS/canvas       fillRect(  strokeRect(  putImageData(  imageData.data[i] =
Not counted, on purpose: Image.new's one background colour; an outline-only frame round a pack tile on a
contact sheet; paste, crop, composite, resize (moving a pack's pixels is the whole point); text on a sheet.
A file with no image signal at all (no PIL, no canvas, no png) counts zero whatever its geometry calls.

THE BASELINE: gates/art_pipe_baseline.json, frozen 10/17: 150 files, 1,180 literal writes (the biggest:
bohemia_the_same_street_three_times_factory.py 115 filled rectangles, bohemia_the_building_props_cook 59).
  A1 the baseline is on disk; retired files are listed and leave on --rebase.
  A2 NO NEW LITERAL PIXELS: a drawing tool outside the baseline counts zero, or is red with its calls and
     the README's line: drive Aseprite instead.
  A3 NOTHING GREW: a baseline file may only go down; --rebase locks a gain in and refuses to raise a count.
  A4 THE PIPE IS THERE: the server imports, LICENSE and README on disk, the start line in the README.
  S1 self-test both ways: a putpixel tile is counted, the same tile pasted from a pack counts zero, an
     outline-only frame with a label counts zero, a canvas fillRect is counted.

## WHAT IS NOT DONE, AND WHOSE IT IS
- The per-job Lua scripts (tools/aseprite/: snap to the pack palette, outline on/off, strays, eight-facing split
  and stack, sheet + JSON) and the GitHub Action that builds Aseprite on the free runner are row
  [aseprite in the pipe]; the server's Python tools do the same jobs today, so no cook waits.
- The binary on a runner: measured here, the source build needs libxcursor-dev, libxi-dev, libxrandr-dev,
  libgl1-mesa-dev, libfontconfig1-dev and a git fetch of libjpeg-turbo 3.0.2; seven minutes. A cached binary
  is the Action's job.
- DIRECTION's reading of assess_sprite at 8 value steps (above) is DIRECTION's, with the pixel tutor.
- No pixel of this round is in the game. reference/ is not published.
