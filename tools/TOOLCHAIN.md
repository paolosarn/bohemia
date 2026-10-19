# THE TOOLCHAIN (PLUMBER 10/19/26, VAMILY row [the toolchain])

Rule 108 (Paolo 10/10): outside help implemented into our system. One script, `tools/bohemia_toolchain.py`, is the
door to every tool a chat uses to make a tile from his packs or a sound from a real recording. Each piece belongs to
a lane and lives where that lane keeps it; this file and the script only point at them.

Nothing here goes into the game (rule 100). Both legs refuse an `--out` under `slices/` or `engine/`; write into a
cook folder (`reference/...`) and register a card the usual way.

## FIFTEEN MINUTES, FROM NOTHING (a stranger can follow this)

1. **Check the box (seconds).** `python3 tools/bohemia_toolchain.py doctor` prints every tool as READY, MISSING
   (with its one install line), HELD or WALL. On a Claude cloud session the start hook
   (`tools/bohemia_session_setup.sh`) has already installed the Python half.
2. **Install what is missing (about 20 s).** `python3 tools/bohemia_toolchain.py setup` runs the two pip lines
   (`gates/requirements.txt`, `tools/requirements_toolchain.txt`). ffmpeg is `sudo apt-get install -y ffmpeg`.
   Aseprite is optional here: without it the snap uses the script's own fallback, and the manifest says which ran.
3. **Run the proof (about 8 s).** `python3 tools/bohemia_toolchain.py proof --out /tmp/proof`: his grass tile
   recoloured into his burnt-ground pack's colours (his YES on the recolour, rule 115b), and a real door shutting
   in a small room. It prints the numbers; the committed copy is `reference/toolchain_proof/`.
4. **Run the gate (about 10 s).** `python3 gates/toolchain_gate.py` (in the suite as THE TOOLCHAIN).
5. **Use it on your own thing.** The two lines below, your paths.

## THE COMMANDS

| command | what it does |
|---|---|
| `python3 tools/bohemia_toolchain.py doctor` | every tool, READY or the line that installs it; exit 1 if a leg cannot run |
| `python3 tools/bohemia_toolchain.py setup` | installs the missing Python half |
| `python3 tools/bohemia_toolchain.py clean --in PIC.png --pack PIECE.png --family ground --out DIR` | step 6 of the ten steps (records/BOHEMIA_THE_ART_WORKFLOW_IN_TEN_STEPS_10_11_26.md) on any picture: snapped to the pack piece's colours, how it joins (against his own tiles' band), its tells (against the pack band), the sheet with the pack piece left and yours right at 1:1 and three by three at the core's pitch; `--fallback` forces the script's snap even where Aseprite runs |
| `python3 tools/bohemia_toolchain.py sound --stem STEM --win auto\|last --room small\|shed\|hall\|bar --wet 0.3 --speed 1 --peak -2 --out DIR` | one CC0 recording from the bank through SOUNDS' chain; a FLAC, an mp3 for a card, the numbers, and the licence line beside it |
| `python3 tools/bohemia_toolchain.py proof --out DIR` | one tile and one sound end to end, no human |
| `python3 tools/bohemia_toolchain.py bands` | rebuilds his tiles' join band (records/target/BOHEMIA_TOOLCHAIN_SEAM_BANDS.json) when the packs change |

What a tile's manifest says: `off_palette_pixels` (must be 0: the lock, counted, not assumed), `joins.verdict`
(JOINS or SEAM against the 90th percentile of his own tiles of that family), `tells` and `tells_of_the_input`
(D1 to D8 judged by the pack band, before and after, so `tells_the_snap_added` names only what the snap did),
`at_or_over_the_cell` (the family's own tile size).

## THE TOOLS

| tool | state | the one line | licence |
|---|---|---|---|
| Pillow + numpy | installed by the start hook | `python3 -m pip install -r gates/requirements.txt` | Pillow MIT-CMU (HPND), numpy BSD-3 |
| scipy + soundfile | installed by the start hook | `python3 -m pip install -r tools/requirements_toolchain.txt` | BSD-3, BSD-3 (libsndfile LGPL-2.1) |
| Pedalboard | installed by the start hook | same line | GPL-3.0: a tool we run, nothing of it ships |
| pyroomacoustics | installed by the start hook | same line | MIT |
| ffmpeg | on the cloud image | `sudo apt-get install -y ffmpeg` | LGPL-2.1+; stands in for SoX, whose effects the chain does not use |
| Aseprite | optional; the free runner builds and caches it (Actions "aseprite") | `tools/aseprite/build_headless.sh` (tools/aseprite/README.md) | his bought licence, compiled for our own use, never committed |
| the Aseprite jobs | in the repo | `tools/aseprite/*.lua`, one line each | ours |
| the tells | in the repo | `tools/bohemia_not_vibe_coded.py` and its pack band | ours |
| the recording chain | in the repo (SOUNDS') | `tools/bohemia_from_a_recording.py` render_oneshot, imported, never copied | ours |
| the CC0 bank | in the repo (SOUNDS') | `reference/library/sound_bank/esc50_cc0/` with LICENCES.md, one row per clip | CC0 per clip, its Freesound URL and author |
| the vendored Aseprite server | in the repo | `tools/aseprite_mcp/` (163 tools from Python) | MIT |
| Retro Diffusion | HELD by rule 115 | none: no picture generator | per-call credits |
| PixelLab | HELD by rule 115 | none | subscription (its API without one was never confirmed) |
| Freesound, Sonniss GDC, EchoThief | WALL | this container's network policy refuses their hosts (SOUNDS measured 10/17); the bank is the CC0 half of ESC-50, kept as FLAC; the room is modelled | CC0 only is taken |
| Chow Tape Model | WALL | no headless Linux scan; the tape is SOUNDS' own stage (head bump, saturation, wow and flutter, a 2:1 compressor) | BSD-3 |
| Pyxelate, Tiled's rasterizer, an autotiler | not installed, on purpose | the rig renders at its native size and the snap covers the rest; the boards are JSON, not TMX; Tilesetter ($12.99) is a desktop app and was never bought | - |

## THE RULES THAT RIDE WITH IT

- **Licences ride with every file.** A sound is refused unless its stem has a CC0 row in the bank's LICENCES.md;
  the licence line is written beside the FLAC. A tile's manifest names the pack pieces it came from by path and hash.
- **Keys live in `.env`, never committed** (`.env` is in .gitignore; the gate checks). The free set needs no key.
- **HELD (rule 115, newest date wins):** the row's generator half (Retro Diffusion's request-card Action, PixelLab's
  rotate) makes no picture. Every character, beast, vehicle and prop is modelled at the source and rendered through
  DIRECTION's master rig; the ground and the buildings stay on his packs. The coordinator retires or re-aims it.
- **Nothing into the game (rule 100).** A result is a candidate in the VOTE tab; only his FINAL lets it in.
- **Before the game ships,** re-pull every recording by its Freesound id on a machine that can reach the site, so
  the shipped file is the author's own and not the dataset's cut (SOUNDS' LICENCES.md says the same).
