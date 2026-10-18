# ASEPRITE IN THE PIPE: SEVEN JOBS, THE BUILD ON THE FREE RUNNER, AND THE PROOF (PLUMBER, 10/18/26, round 64)

Row [aseprite in the pipe] (rule 108 ROUND SIX; Paolo 10/11, his one word: "Aseprite", $19.99, bought). The
chats fix pixels with an artist's tools, not with code that places squares. Builds on
records/BOHEMIA_THE_ART_PIPE_GATE_10_17_26.md (the vendored tool server and the fence).

Files: tools/aseprite/ (seven jobs, lib.lua, build_headless.sh, bohemia_aseprite_proof.py, README.md),
.github/workflows/aseprite.yml (in Actions as "aseprite"), gates/aseprite_pipe_gate.py (in the suite as ASEPRITE
PIPE), reference/art_pipe/proof_round_two/ (the committed proof), .gitignore (tools/aseprite/bin/).

## THE SEVEN JOBS

One Lua script per job, each one line (`aseprite -b --script-param k=v ... --script tools/aseprite/<job>.lua`),
each writing its picture and a JSON beside it saying what it did. No colour and no coordinate is typed in any of
them (the gate's P0 reads every job for a typed colour, a typed pixel place and a typed rectangle).

| job | what |
|---|---|
| snap.lua | to the pack palette, indexed: the pack piece quantized to 256 by Aseprite (or a palette file), every pixel to its nearest entry, no dithering; writes the palette as .gpl |
| outline.lua | one pixel ON (Aseprite's Outline, in the picture's own darkest colour) or OFF (the outermost ring cleared) |
| strays.lua | a pixel with no neighbour of its own colour in all eight takes the commonest colour around it; no new colour, the silhouette untouched, protect= for an eye glint (the vendored server's rule, so the two agree) |
| resize.lua | nearest neighbour by a whole K or 1/K; a fractional scale is refused (mixels, rule 114's first tell) |
| facings.lua | eight facings stacked into one row with Aseprite's sheet JSON and a tag per facing, the facings that are one picture flipped counted (rule 107); or a row split back into eight |
| sheet.lua | an .aseprite clip to a frame sheet plus its JSON (frames, durations, tags) |
| report.lua | the pixel count and palette: size, mode, palette, opaque and half-see-through pixels, distinct colours, strays, and with palette= the colours off it |

ONE THING ASEPRITE DOES THAT NOBODY WOULD GUESS, MEASURED: his pack pieces are named pack_..._000.png, and Aseprite
opens a numbered file name as the WHOLE NUMBERED SEQUENCE. The first snap of his cobblestone tile came back as 24
frames (000 to 023 of the pack) and saved 24 files. lib.open opens every PNG with oneFrame; an .aseprite opens whole.

## THE BUILD

tools/aseprite/build_headless.sh: Aseprite v1.3.18.6 (commit 331e898e), `-DENABLE_UI=OFF -DLAF_BACKEND=none
-DENABLE_SCRIPTING=ON`, no news, no updater. 1,636 steps, 730 s on this container's four cores (the 10/17 build was
1,549 steps in 414 s on an older tag). The licence lines ride in the script: Igara Studio's copyright; the EULA lets
a user compile for their own use and does not allow handing the build out; so the binary is never committed
(tools/aseprite/bin/ ignored, the gate's P1). This container's proxy refuses GitHub's archive downloads (403 on the
libjpeg-turbo 3.0.2 zip, measured again), so the script takes ASEPRITE_JPEG_TURBO_DIR, a git checkout; the runner
builds upstream unchanged.

.github/workflows/aseprite.yml: on a change to tools/aseprite, the gate or itself, and on demand. Clones the pinned
tag with submodules, checks the commit, builds only when the cache misses (keyed on tag, commit and the build
script), saves the cache the moment it is built, runs the proof and THE PIPE GATE, uploads the proof as the
'aseprite-proof' artifact. Read access only.

## THE PROOF (tools/aseprite/bohemia_aseprite_proof.py; committed at reference/art_pipe/proof_round_two)

46 steps, 5.3 s of Aseprite, no human, nothing typed.

1. HIS PACK TILE ROUND-TRIPPED: reference/art_bank/road/pack_1_cobblestone_floor_tiles_000.png (94 x 95, 8,400
   colours) snapped to its own palette (Aseprite quantized it to 255), outlined in its darkest entry (281 pixels),
   exported, reported. THE PNG'S PALETTE IS BYTE-IDENTICAL TO THE .GPL, 255 entries, re-read by PIL on every box;
   244 colours in use, 0 off the palette. Outline off after on: the silhouette 8,532 -> 8,813 -> 8,530; the two
   pixels are where the tile is one pixel thin (an erosion is not the exact inverse of a dilation), said in the job.
2. A GENERATED PICTURE CLEANED: the rig's robot (records/target/master_rig/robot, the render he fell in love with
   10/17) in all eight facings, each snapped to the palette of his car (pack 10, #0), strays removed, reported
   against that palette; no outline (the style guide's field 8: a rendered thing draws no line):

   | facing | colours raw / snapped / clean | strays raw / snapped / clean | half see-through raw / clean |
   |---|---|---|---|
   | N | 5,747 / 109 / 91 | 6,058 / 1,194 / 89 | 46 / 0 |
   | NE | 5,585 / 110 / 97 | 6,199 / 1,145 / 90 | 1,744 / 0 |
   | E | 5,198 / 106 / 92 | 5,614 / 1,066 / 114 | 926 / 0 |
   | SE | 5,865 / 112 / 99 | 6,157 / 1,305 / 86 | 183 / 0 |
   | S | 5,965 / 111 / 94 | 6,637 / 1,341 / 83 | 2,221 / 0 |
   | SW | 5,680 / 110 / 97 | 5,948 / 1,351 / 132 | 340 / 0 |
   | W | 5,553 / 106 / 92 | 5,984 / 1,227 / 104 | 1,008 / 0 |
   | NW | 5,637 / 105 / 87 | 5,898 / 1,170 / 97 | 148 / 0 |

   then stacked into one sheet (880 x 149, cells 110 x 149, Aseprite's sheet JSON with a tag per facing): 8 distinct
   facings, no mirrors; split back into eight.

WHAT THE PROOF SHOWED THAT IS NOT A PASS, SAID PLAINLY: the rig bakes the robot's ground shadow in as soft
see-through black (up to 2,221 half see-through pixels on S). An indexed picture has no half see-through, so the
snap turns that soft shadow into a hard black oval on five of the eight facings. The cure is at the source, not in
the pipe: the shadow rendered as its own layer (the style guide's contact line), the body with a hard alpha (round
two's soft-alpha tell). Routed to DIRECTION.

## THE PIPE GATE (gates/aseprite_pipe_gate.py, in the suite as ASEPRITE PIPE)

| leg | where | holds |
|---|---|---|
| P0 | every box | the seven jobs and lib.lua; a usage line each; no typed colour, pixel place or rectangle (planted both ways); the proof driver counts 0 on ART PIPE; the README names every job and the fifteen-minute steps |
| P1 | every box | no build tracked (planted), tools/aseprite/bin/ ignored, the build script's licence lines and headless flags, the workflow pinned and read only |
| P2 | every box | the committed proof: the palette byte-identical, re-read here (one byte off planted red), the outline on in the tile's palette, off giving the silhouette back but the one-pixel spurs (0.1% at most), the robot's eight facings on his car's palette with fewer strays and no half see-through, one sheet of 8 distinct facings, every step clean |
| P3 | a box with Aseprite | the jobs run fresh and agree with the committed proof (the same palette, the same counts): deterministic. Without Aseprite: UNMEASURED, never a pass |

Here: 18/0 without Aseprite, 26/0 with the scratch build (P3 green: the fresh run equals the committed one).

ON THE FREE RUNNER (Actions "aseprite", run 39158524152 on ee375191, SUCCESS): the cache missed, so it built
Aseprite 1.3.18.6 from the public source in 6 min 14 s (19:23:34 to 19:29:48) and cached it; the seven jobs ran
the whole proof in 1.6 s of Aseprite; THE PIPE GATE 25 passed, 0 failed, and P3 found the runner's clean build
(1.3.18.6-dev) and this container's build (1.3.18.6-dirty-dev: the libjpeg-turbo path patched for the proxy) make
the same palette, byte for byte, and the same counts on all eight facings. The proof is the 'aseprite-proof'
artifact (79 files). The next run on an unchanged build script restores the cache instead of building.

## NOT DONE, AND WHOSE

- The four cooks name the job they used in their sheet captions (the row's last line): COOK, COOK TWO, COOK THREE,
  COOK FOUR. Routed; their sheets, not this lane's files.
- Step 6 of records/BOHEMIA_THE_ART_WORKFLOW_IN_TEN_STEPS_10_11_26.md now has its scripts; the page is DIRECTION's.
- No pixel of this round is in the game; reference/ is not published.
