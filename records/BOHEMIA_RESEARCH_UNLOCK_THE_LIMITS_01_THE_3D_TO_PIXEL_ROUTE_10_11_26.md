# BOHEMIA RESEARCH: UNLOCK THE LIMITS 01, THE 3D-TO-PIXEL ROUTE (10/11/26)

Lane: research. Question: can the art chats build a small 3D model once and let a machine render it to 45-degree pixel art in all eight facings? Constraints from Paolo: one-time purchases only, no subscriptions, no credits, no graphics card he depends on, must run on GitHub's free CPU runners. Container note: DNS blocked most page fetches, so facts resting on search-result text are marked (search text). Every URL came back from a search; no price was invented.

## 1. THE FINDING

A chat is bad at placing pixels but much better at writing code that builds a shape, and a 3D model is just code that builds a shape. Build the model once in real meters, point one fixed 45-degree camera at it, spin the model eight times, and Blender prints eight sprites that agree with each other for free. Blender is free, runs with no screen and no graphics card, and renders a tiny sprite in well under a second on a plain CPU, so the free GitHub runner can do the whole job. After the render, one free command snaps every color to our palette and the outline is one more pass. What it does not fix: the model still has to be designed well, the outline and the eyes still want a human pass, and a face still needs the portrait lane.

## 2. THE TOOLS

| Tool | What it does | Price | Runs on CPU? | URL |
|---|---|---|---|---|
| Blender | The 3D program. Has a headless mode (`blender -b`), a Python API (bpy), three renderers (Workbench, EEVEE, Cycles), and a compositor Pixelate node. | Free, GPL | Yes. Workbench and Cycles CPU need no GPU. EEVEE needs OpenGL/Vulkan; on a runner it only works through a software driver (llvmpipe/lavapipe) and is slow (search text). | https://www.blender.org |
| setup-blender (GitHub Action) | Installs any Blender version on a runner and caches the download. | Free, GPL-3.0 | Yes | https://github.com/BradyAJohnston/setup-blender |
| DirectionalSpriteBatchRender | Blender add-on; one click renders 8 directions of an animation. Old script, test on current Blender. | Free | Yes | https://github.com/chronicleroflegends/DirectionalSpriteBatchRender |
| Spritesheet Renderer (bgivenb) | Blender 3.6+ add-on; PNG sheets plus JSON frame data; 360-degree orbit option. | Free | Yes | https://github.com/bgivenb/blender-spritesheet |
| SpriteSheetMaker (ManasMakde) | Add-on; 3D animation to sprite sheet with built-in pixelation, ortho camera. | Free | Yes | https://github.com/ManasMakde/SpriteSheetMaker |
| 8 Directions Render Plugin (AUTeddy) | Add-on; renders animations from eight directions. Needs Blender 3.6+. | Pay what you want on itch; EUR 10 on Gumroad (search text) | Yes | https://auteddy.itch.io/8-directions-render-plugin-for-blender |
| Pixel Art Rendering (Lucas Roedel) | Add-on: Bayer dither, multi-light pixel materials. EEVEE only, so weak on a runner. | $0+ pay what you want | Needs EEVEE | https://lucasroedel.gumroad.com/l/pixel_art |
| Sprytile | Build meshes from pixel tile sets inside Blender; skips UV work. | Free (name your price), MIT | Yes | https://jeiel.itch.io/sprytile |
| Blender Pixelate node | Built-in compositor node: Scale down, Pixelate, Scale up. | Free (in Blender) | Yes | https://docs.blender.org/manual/en/4.1/compositing/types/filter/pixelate.html |
| blender-mcp (ahujasid) | MCP server so a Claude chat drives a running Blender by talking. MIT. Runs arbitrary Python, so it is for a trusted desktop, not a runner. | Free | Needs Blender open with a window (desktop) | https://github.com/ahujasid/blender-mcp |
| ImageMagick / Pillow | Palette snap: `magick in.png +dither -remap palette.png out.png`, or Python `im.quantize(palette=pal_img, dither=0)` (RGBA to RGB first or the palette is ignored). | Free | Yes | https://usage.imagemagick.org/quantize/ , https://pillow.readthedocs.io/en/latest/reference/Image.html |
| Aseprite | Editor with a CLI (`aseprite -b --palette ... --save-as`), Lua scripts for batch. | $19.99 one-time (itch, with Steam key) | Yes | https://dacap.itch.io/aseprite |
| OpenSCAD / trimesh / CadQuery | Code-first shape builders a chat can write for. Free. | Free | Yes | https://openscad.org, https://trimesh.org |
| Kenney, Quaternius | CC0 low-poly model libraries (thousands of models). | Free, CC0 (search text) | n/a | https://kenney.nl, https://quaternius.com |
| Poly Pizza, Sketchfab | Model libraries; mostly CC-BY, some CC0. Check each model's license. | Free | n/a | https://poly.pizza, https://sketchfab.com |

## 3. THE PIPELINE (free runner, CPU only)

1. **Install.** In a workflow: `uses: bradyajohnston/setup-blender@v5` with a pinned version (4.2 series). Add `libgl1`, `libxi6`, `libxrender1` with apt. Run `blender -b -noaudio`.
2. **One master scene file** in the repo (`tools/3d/bohemia_rig.blend`), owned by DIRECTION. It holds the camera, the sun, the palette and the compositor. Nobody makes a new camera, ever.
3. **The camera.** Orthographic. Rotation X = 60, Y = 0, Z = 45 gives the 2:1 pixel-art tilt our 45-degree art uses (true isometric is X = 54.736, which we do not use). Ortho scale is locked to the 96-pixel floor: ortho scale = (pixels across the frame) / (pixels per meter). We fix pixels per meter once (the 96 px floor is one house cell; a 1.8 m person is about 100 px painted, so about 55 px per meter) and the number never changes again.
4. **Real meters.** Every model is built at true size: a person 1.7 to 1.9 m, a door 2.1 m, a pickup 5.3 m, a house 9 to 12 m wide. The camera is fixed, so size on screen follows from size in meters. The "sizing of things" argument ends.
5. **The eight facings.** Do NOT move the camera or the sun. Parent the model to an empty, set the empty's Z rotation to 0, 45, 90 ... 315, render once each. Lighting stays identical on every facing because the light did not move; only the object turned. Shadow side flips naturally as it should.
6. **Render engine.** Workbench, flat or studio lighting, no anti-aliasing, filter size 0.01, render size exactly the sprite box (112 by 112 for a person). Cycles CPU with 8 to 16 samples when we need true shadows. Reported timings on a free `ubuntu-24.04` runner: Workbench about 0.2 s/frame, Cycles CPU about 1.4 s/frame at preview size, EEVEE through lavapipe about 7.7 s/frame (search text; the source page would not fetch). Eight facings of one object: under 15 seconds.
7. **Pixel snap.** Camera and object origins sit on exact pixel multiples (1 px = 1/ppm meters). The frame center is shifted half a pixel so edges land on whole pixels. This is the fix for sub-pixel jitter: it is never a filter, it is the camera math.
8. **Palette snap.** `magick frame.png +dither -remap palette.png out.png` with our palette PNG. Dither off; pixel art wants hard steps.
9. **Outline.** One Python pass with Pillow: any transparent pixel touching an opaque one becomes the outline color (one pixel, the border law). Do it after the palette snap so it is never blended.
10. **Sheet and manifest.** Pack the eight facings into one strip plus a JSON of frame boxes and the meters-per-pixel used. Commit the .blend, the sheet and the JSON together, so the sprite can be re-rendered forever.
11. **Gates.** `reference_check_gate.py` reads the sheet like any cook. A new gate, `sprite_scale_gate`, reads the JSON and refuses a sheet whose meters-per-pixel differs from the master.
12. **Who drives Blender.** On the runner, bpy scripts in the repo (the chat writes Python, the runner runs it). On Paolo's always-on desktop, blender-mcp lets a chat poke the live scene and look at the result; the runner remains the source of truth.

## 4. WHAT IT FIXES, WHAT IT DOES NOT

**Fixes.** Consistency across eight facings (same light, same camera, same mesh). Scale (meters in, pixels out, one fixed number). Animation reuse: one walk cycle renders to eight facings and every outfit. Volume: a building type is a model plus a material swap, not eight paintings. Repeatability: a .blend in git can be re-rendered when the palette changes. And a chat writes shape code more reliably than it places pixels: benchmarks report the Python CAD route "yielding substantial improvements ... in both execution validity and geometric accuracy" over command lists, and OpenSCAD held 94 to 99 percent validity on an assembly task (P3D-Bench, Text2CAD-Bench, CodeGen-3D). Render-look-fix loops are what make it work, and a runner can post the render back.

**Does not fix.** A bad model is a bad sprite eight times. Outlines from 3D are the weak point: depth-based outlines "are prone to have double width or be skipped," so ours is a 2D post pass and still wants eyes. Faces: at 112 px a face is a few pixels; the portrait law is untouched. Hair and cloth that must read from every angle need a modeled shape, not a texture. Analog horror is a job at the source: a renderer gives clean geometry, so the grime and wrong-ness must be modeled on purpose or it reads as a clean indie toy. EEVEE-only add-ons are desktop-only for us. The Pixelate node is a mosaic, not a palette; it does not replace the remap.

## 5. ONE RULE

**ONE CAMERA, REAL METERS, THE MODEL TURNS.** Every sprite that is not a face comes from the one master rig file: a fixed orthographic camera at X 60 / Z 45, a fixed sun, one locked pixels-per-meter number, and eight renders made by turning the model, never the camera. A sprite with no .blend and no scale JSON beside it is a draft, not an asset. Gate: a sheet whose meters-per-pixel does not match the master is refused.

## 6. SOURCES

- https://github.com/BradyAJohnston/setup-blender : GitHub Action installing Blender on a runner, caches downloads, GPL-3.0 (fetched).
- https://github.com/HaiyiMei/blender-docker-headless : headless Blender container notes; Cycles falls back to CPU without a GPU (search text).
- https://github.com/AleBrito124356/blender-python-toolkit : headless bpy automation, EEVEE-first, batch renders (search text).
- https://drcodes.com/posts/github-actions-blender-automate-game-assets-in-30-minutes : Blender on GitHub Actions for game assets, source of the per-frame timings (search text; page would not fetch).
- https://docs.blender.org/manual/en/4.1/compositing/types/filter/pixelate.html : the Pixelate node and the Scale-Pixelate-Scale chain.
- https://savedpixel.com/blog/blender-pixel-art : match render size to sprite size, kill AA, motion blur, DoF.
- https://www.javin-inc.com/blenderpixel/ : ortho scale 3.150 for 32 px and the half-pixel shift so corners land on single pixels.
- https://clintbellanger.net/articles/isometric_tiles/ : X 60 / Z 45 camera for 2:1 pixel tiles; X 54.736 is true isometric.
- https://gist.github.com/vini-guerrero/91733fedd43f46f3e7431ec52eed30af : true isometric camera script (35.264 from horizontal = 54.736 in Blender).
- https://cxong.github.io/2017/03/3d-rendered-pixel-sprites : Blender + Python + ImageMagick 8-direction sprite pipeline, 144 frames.
- https://github.com/chronicleroflegends/DirectionalSpriteBatchRender : free 8-direction batch render add-on.
- https://github.com/bgivenb/blender-spritesheet : free sprite sheet add-on with JSON frame data.
- https://github.com/ManasMakde/SpriteSheetMaker : free sheet add-on with built-in pixelation.
- https://auteddy.itch.io/8-directions-render-plugin-for-blender : 8-direction plugin, pay what you want (EUR 10 on Gumroad).
- https://lucasroedel.gumroad.com/l/pixel_art : Pixel Art Rendering add-on, $0+, EEVEE only, Bayer dither.
- https://jeiel.itch.io/sprytile : Sprytile, free, MIT, tile-based mesh building.
- https://github.com/ahujasid/blender-mcp : the Blender MCP server, MIT, runs arbitrary Python inside Blender.
- https://usage.imagemagick.org/quantize/ : `-remap` to a palette image, `+dither` to turn dithering off.
- https://pillow.readthedocs.io/en/latest/reference/Image.html : `Image.quantize(palette=...)`, RGBA must become RGB first.
- https://www.aseprite.org/docs/cli/ : Aseprite CLI, `--palette`, `-b`, `--save-as`.
- https://dacap.itch.io/aseprite/purchase : Aseprite $19.99 one-time with Steam key.
- https://discussions.unity.com/t/3d-pixelart-outline-issue/897809 : depth/normal outlines double-width or skipped at low res.
- https://medium.com/@elliotbentine/pixelizing-3d-objects-b55ec33328f1 : render-to-sprite fixes lighting and angles, loses scene shadows.
- https://arxiv.org/html/2606.11152v1 : P3D-Bench, OpenSCAD 94 to 99 percent validity, CadQuery fails later in the chain.
- https://arxiv.org/html/2605.18430v1 : Text2CAD-Bench, Python CadQuery beats command sequences on validity and accuracy.
- https://scholarworks.sjsu.edu/cgi/viewcontent.cgi?article=7835&context=faculty_rsca : CodeGen-3D, 100 prompts, LLM writes Blender code, feedback loops help a lot.
- https://github.com/FreedomIntelligence/BlenderLLM : BlenderLLM and CADBench, bpy script generation scored by a judge.
- https://github.com/craigrusselltiu/pseudo-pixel : open repo, reference to mesh to low-res toon render to sheet, driven by Claude Code.
- https://app.cinevva.com/guides/free-3d-model-sites : Kenney and Quaternius CC0, Poly Pizza mostly CC-BY with a CC0 subset (third-party guide).
