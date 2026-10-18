# THE ASEPRITE JOBS (PLUMBER 10/18/26, VAMILY row [aseprite in the pipe])

Paolo 10/11, his one word: **Aseprite** ($19.99, bought). The chats fix pixels with an artist's tools, not with
code that places squares. This folder is one Lua script per job. Each runs Aseprite headless, takes its inputs as
`--script-param name=value`, writes its picture and a `.json` beside it saying what it did, in numbers. No job
holds a colour or a coordinate: the colours come from the picture or from his pack piece, the shapes from
Aseprite's own commands (gates/aseprite_pipe_gate.py P0 reads every job for a typed colour or place).

Nothing here goes into the game (rule 100). Write into a cook folder (`reference/art_pipe/...`), never into
`slices/` or `engine/`.

## THE SEVEN JOBS

| job | what it does | one line |
|---|---|---|
| `snap.lua` | snap to the pack palette, indexed: the pack piece's colours (quantized to 256 by Aseprite) or a palette file; every pixel to the nearest entry, no dithering | `aseprite -b --script-param in=OURS.png --script-param palette=PACK.png --script-param out=OUT.png --script-param palette_out=OUT.gpl --script tools/aseprite/snap.lua` |
| `outline.lua` | a one-pixel outline ON (Aseprite's Outline, in the picture's own darkest colour) or OFF (the outermost ring taken away, for a rendered thing that draws no line) | `aseprite -b --script-param in=X.png --script-param out=OUT.png --script-param mode=on --script tools/aseprite/outline.lua` |
| `strays.lua` | stray pixels (no neighbour of their own colour in all eight) take the commonest colour around them; no new colour, the silhouette never changes, `protect=` keeps an eye glint | `aseprite -b --script-param in=X.png --script-param out=OUT.png --script tools/aseprite/strays.lua` |
| `resize.lua` | blur-free resize, nearest neighbour, by a whole K or 1/K; a fractional scale (mixels) is refused | `aseprite -b --script-param in=X.png --script-param out=OUT.png --script-param scale=2 --script tools/aseprite/resize.lua` |
| `facings.lua` | stack eight facings (N NE E SE S SW W NW) into one row with Aseprite's sheet JSON and a tag per facing, and count the facings that are one picture flipped (rule 107: a mirror is not a direction); or split a row back into eight files | `aseprite -b --script-param mode=stack --script-param dir=FOLDER --script-param pattern=rig_{f}.png --script-param out=SHEET.png --script tools/aseprite/facings.lua` |
| `sheet.lua` | a frame sheet plus its JSON (frames, durations, tags) from an `.aseprite` clip | `aseprite -b --script-param in=CLIP.aseprite --script-param out=SHEET.png --script tools/aseprite/sheet.lua` |
| `report.lua` | the pixel count and palette report the pipe gate reads: size, mode, palette, opaque and half-see-through pixels, distinct colours, strays, and with `palette=` the colours off it | `aseprite -b --script-param in=X.png --script-param out=X.report.json --script-param palette=PACK.gpl --script tools/aseprite/report.lua` |

`lib.lua` is their shared half (parameters, opening a file, the JSON beside the output). pixelize stays the
fallback snap on a box with no Aseprite.

## FIFTEEN MINUTES, FROM NOTHING (a stranger can follow this)

1. **Get Aseprite (7 to 10 minutes, once).** On GitHub nothing is needed: the `aseprite` workflow
   (.github/workflows/aseprite.yml, in Actions as "aseprite") builds it headless from the public source at the
   pinned tag and caches it. On your own Ubuntu box:

       sudo apt-get install -y build-essential cmake ninja-build libx11-dev libxcursor-dev libxi-dev libxrandr-dev libgl1-mesa-dev libfontconfig1-dev
       git clone --depth 1 --branch v1.3.18.6 --recurse-submodules --shallow-submodules https://github.com/aseprite/aseprite /tmp/aseprite
       tools/aseprite/build_headless.sh /tmp/aseprite tools/aseprite/bin

   (Behind a proxy that refuses GitHub's archive downloads, clone libjpeg-turbo 3.0.2 with git and set
   `ASEPRITE_JPEG_TURBO_DIR` to it first.) On his computer, his bought copy works the same:
   `ASEPRITE_PATH=/Applications/Aseprite.app/Contents/MacOS/aseprite`.
2. **Point at it (seconds).** `export ASEPRITE_PATH=$PWD/tools/aseprite/bin/aseprite` and check
   `"$ASEPRITE_PATH" --version`.
3. **Run the proof (about a minute).** `python3 tools/aseprite/bohemia_aseprite_proof.py --out /tmp/proof`:
   his pack tile round-tripped (snap, outline, export, report) and the rig's robot cleaned in eight facings and
   stacked into one sheet. It prints whether the tile's palette came back byte for byte.
4. **Run the gate (seconds).** `BOHEMIA_ASEPRITE_PROOF=/tmp/proof python3 gates/aseprite_pipe_gate.py`.
5. **Use a job on your own picture.** Copy a line from the table above, change the paths, read the `.json`
   it writes beside the picture.

## THE RULES THAT RIDE WITH IT

- The binary is NEVER committed (`tools/aseprite/bin/` is ignored; P1 of the gate). Aseprite's EULA lets a user
  compile it for their own use and does not allow handing the build out. Licence lines: build_headless.sh.
- A cook sheet that used a job names it in its caption (for example "snapped to pack:10 with snap.lua, strays.lua").
- The vendored tool server (tools/aseprite_mcp, MIT) drives the same Aseprite from Python with 163 tools; these
  scripts are the small fixed jobs a chat runs in one line.
