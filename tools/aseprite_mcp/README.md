# THE ART PIPE: ASEPRITE, DRIVEN HEADLESS BY THE CHATS (PLUMBER 10/17/26, row [the art pipe gate])

Paolo 10/10 (rule 108): "find out what tools high-quality people that vibe code use ... all these months it's
been failing me." His one word 10/11: **Aseprite** ($19.99, bought). The finding: the good small teams drive a
real pixel editor from their tools and feed it the packs; nobody draws a tile pixel by pixel in code.

This folder is the pipe. Nothing in it is art. Nothing in it goes into the game (rule 100).

## WHAT IS HERE

| path | what | licence |
|---|---|---|
| `aseprite_mcp/` | the Aseprite MCP tool server, vendored (MalloyTheDev/aseprite-mcp, 163 tools: draw, shade, palette, layers, frames, slices, export, `assess_sprite`, `diff_sprites`, `validate_loop`) | MIT, `LICENSE` beside it |
| `UPSTREAM_SHA.txt` | the upstream commit and date this copy was taken from | |
| `TOOLS.md` | every tool with its parameters, upstream's own reference | MIT |
| `pyproject.upstream.toml` | upstream's dependency list, kept for the record | |
| `bohemia_pack_tile_through_the_pipe.py` | THE PROOF: one of his pack tiles opened, snapped to its own palette, outlined, stray pixels removed, measured, exported with its JSON, no pixel typed anywhere | ours |

The server works by writing Lua and running `aseprite -b --script`, so every edit is a real `.aseprite` file he
can open in the GUI he bought.

## THE ONE LINE THAT INSTALLS IT (once per machine)

    python3 -m pip install 'mcp[cli]>=2.0.0' 'pillow>=12.3.0' 'pydantic>=2'

and Aseprite itself: `ASEPRITE_PATH=/path/to/aseprite` (his bought binary on his computer; on a runner, the
headless build from source, row [aseprite in the pipe]; the EULA allows compiling for your own use). The binary is
NEVER committed.

## THE ONE LINE THAT STARTS IT

    PYTHONPATH=tools/aseprite_mcp ASEPRITE_PATH=/path/to/aseprite python3 -m aseprite_mcp

For Claude Code, from the repo root, once:

    claude mcp add aseprite -e PYTHONPATH=tools/aseprite_mcp -e ASEPRITE_PATH=/path/to/aseprite -e ASEPRITE_MCP_WORKSPACE=reference/art_pipe -- python3 -m aseprite_mcp

Then a chat calls the tools by name: `create_sprite`, `draw_image_base64` (a pack tile in), `set_color_mode`
(indexed, palette from the art), `add_outline`, `remove_stray_pixels`, `assess_sprite`, `export_png`,
`export_spritesheet`. From a script, the same functions are plain Python: `from aseprite_mcp.tools import sprite,
image, effects, inspect, export`.

Relative sprite paths resolve inside `ASEPRITE_MCP_WORKSPACE`; set it to a cook folder (`reference/art_pipe`), never
to `slices/` or `engine/` (rule 100: the art lanes cook only).

## THE PROOF, AND HOW TO RUN IT

    PYTHONPATH=tools/aseprite_mcp ASEPRITE_PATH=/path/to/aseprite python3 tools/aseprite_mcp/bohemia_pack_tile_through_the_pipe.py

It takes one tile from `reference/art_bank` (his approved packs), runs it through the server end to end and writes
`reference/art_pipe/proof/` (the `.aseprite`, the exported PNG at 1:1, and `report.json` with `assess_sprite`'s
numbers and the palette before and after). The script contains no colour and no coordinate: the palette comes from
the tile, the outline colour from its darkest entry.

## THE FENCE: gates/art_pipe_gate.py (in the suite as ART PIPE)

A drawing tool that writes pixels as numbers (`putpixel`, `putdata`, `draw.point/line/polygon`, a filled
`rectangle`/`ellipse`, `fillRect`, `strokeRect`, `putImageData`, `data[i] =`) is counted. The 150 tools that did so
before 10/17 are frozen in `gates/art_pipe_baseline.json` and may only go down; a new tool must count zero. Not
counted: one background colour, an outline-only frame on a contact sheet, pasting or cropping a pack tile, text.

    python3 gates/art_pipe_gate.py                  the gate
    python3 gates/art_pipe_gate.py --count <tool>   one tool's count, by call
    python3 gates/art_pipe_gate.py --rebase         lock a lowered count in (refuses to raise one)

## WHAT IS NOT HERE YET, SAID PLAINLY

- `tools/aseprite/` Lua scripts per job (snap to the pack palette, outline on/off, stray pixels, eight-facing
  split and stack, sheet + JSON) are row [aseprite in the pipe]; the server's tools cover the same jobs today
  from Python, so a chat is not waiting on them.
- The GitHub Action that builds Aseprite from source on the free runner is the same row. Measured in this
  container 10/17: the headless build (`-DENABLE_UI=OFF -DLAF_BACKEND=none`) needs the X11 dev headers and
  `libjpeg-turbo` fetched by git (the archive URL answers 403 behind the proxy); the full compile is 1,549 steps.
- Retro Diffusion and PixelLab are rows [the toolchain] and [the gun in the repo]; nothing with a meter is here.
