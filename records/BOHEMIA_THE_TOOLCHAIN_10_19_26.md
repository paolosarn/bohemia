# THE TOOLCHAIN: ONE SCRIPT A CHAT RUNS (PLUMBER 10/19/26, VAMILY row [the toolchain])

Rule 108 (Paolo 10/10: outside help implemented into our system). The row, open since 10/10, asked for one script a
chat runs to make a tile from his packs and a sound from a real recording, every tool with its one install line and a
README a stranger follows in fifteen minutes, proven by one tile and one sound made end to end with no human.

READBACK [the toolchain]: I read this as: one script a chat runs for a tile from his packs and a sound from a real
recording, licences riding; done means both made end to end here, no human, the generator half held by rule 115.

## WHAT WAS ALREADY THERE, AND WHAT WAS MISSING

Most of the row had shipped in pieces under other rows: Aseprite and its seven jobs ([the art pipe gate] 27a5b00,
[aseprite in the pipe] ee375191), SOUNDS' recording chain (tools/bohemia_from_a_recording.py) and its CC0 bank
(reference/library/sound_bank/esc50_cc0, 40 clips, LICENCES.md). What was missing, measured on a fresh container:

1. **The sound half could not run.** A fresh cloud container has no scipy, soundfile, Pedalboard or pyroomacoustics;
   `python3 tools/bohemia_from_a_recording.py` dies on its first import. Every SOUNDS session has been installing them by
   hand. 22 s on a fresh Python (measured in an empty venv) installs both stacks.
2. **The snap had no fallback.** tools/aseprite/README.md says "pixelize stays the fallback snap on a box with no
   Aseprite"; no pixelize exists in the repo, and Aseprite is only on the free runner. A chat in a container could not
   snap a picture to a pack palette at all.
3. **No one door.** Five READMEs, no single line a chat runs, no list of what is installed.
4. **Keys:** `.env` was not in .gitignore.

## WHAT SHIPPED

- **tools/bohemia_toolchain.py**: `doctor` (16 tools as data: READY / MISSING with its one line / HELD / WALL, each
  with its licence), `setup` (the two pip lines), `clean` (step 6 of the ten steps on any picture), `sound` (one CC0
  recording through SOUNDS' chain, imported from their file, never copied), `proof`, `bands`.
- **tools/TOOLCHAIN.md**: the fifteen minutes, the commands, the tools table with licences, the rules that ride.
- **tools/requirements_toolchain.txt** and **the session hook** (tools/bohemia_session_setup.sh) installs the audio half
  second, after the image stack, so it can never delay the pixel gates. Every cloud session now starts able to run
  SOUNDS' chain.
- **.gitignore**: `.env`, `.env.*`.
- **THE TOOLCHAIN** in the suite (gates/toolchain_gate.py), 25/0, about 4 s.

## THE TILE LEG, AND WHAT MEASURING IT FOUND

`clean` snaps a picture to a pack piece's colours: Aseprite's snap.lua where it runs, else the script's own (the
piece's colours, Pillow's median cut to 256 when it holds more, the same 256 Aseprite takes; nearest RGB, no dither;
no colour typed). Then it COUNTS the pixels off the lock (the lock verified, not assumed), reads the joins, runs the
tells (tools/bohemia_not_vibe_coded.py, judged by the pack band) on the picture before and after, and writes the
sheet: the pack piece left, ours right, at 1:1, and three by three.

THE JOINS TOOK THREE TRIES, AND THE FIRST TWO WERE WRONG:
1. **A wrap test (core edge against core edge) is the wrong question.** His tiles are not wrap tiles: they carry a
   ragged fringe that lies over the neighbour. Laid edge to edge they read p50 3.1, p90 8.0 on 250 ground pieces, so a
   planted seam (the tile darkened 80 percent across) read 3.97 and passed. The first sheet showed the gaps.
2. **Three by three at the core's pitch, fringe over the neighbour** (the way they sit on a board) is the right
   picture: his grass reads 1.17 to 1.56, the proof 1.29. But ONE BAND PER FAMILY is still wrong: water tiles join at
   p50 6.0 (shorelines), grouted floors 5.7, grass 1.25; the family's p90 (7.7) let the planted seam through again.
3. **The ruler is the tile's own pack**: the 90th percentile of the pack it was cut from (else the lock's pack, else
   the family's tile packs; four pieces minimum). records/target/BOHEMIA_TOOLCHAIN_SEAM_BANDS.json holds 28 packs (24 with four pieces or more) and 3
   families. Against grass's own band (1.56) the 50 percent seam reads 1.87 and the 80 percent 3.04, both SEAM; his
   own grass tile 1.17, JOINS.

THE PROOF (reference/toolchain_proof/): his grass tile (pack_3_grass_and_ground_tiles_001) recoloured into his
burnt-ground pack's colours (pack_7_burnt_ground_tiles_000; his YES on the recolour, rule 115b): 0 of 7,755 pixels
off the lock, joins 1.286 against its pack's 1.564, 6,720 colours to 256. Tells against the pack band: D5 (evenness)
is past on HIS ORIGINAL too, so it is the tile's, not the snap's; D2 (colours) was past on the original and the snap
fixed it; D8 banding 0.001 against the packs' 0 is the one the snap added, and the manifest says so
(`tells_the_snap_added`). Aseprite was not on this box, so the fallback ran and the manifest says it.

## THE SOUND LEG

`sound` refuses any stem without a CC0 row in the bank's LICENCES.md before it reads a byte, runs SOUNDS'
render_oneshot (window, high-pass 120 Hz, tape, low-pass 9 kHz, a modelled room, the limiter), writes a FLAC, an mp3
for a card, the numbers, and a licence line beside it. THE PROOF: E-Audio's door (Freesound 118624, CC0), its last
thump (the window SOUNDS used for the clinic's door), the small room at 0.3 wet: 0.49 s, peak -2.00 dB, the mp3
-2.29 dB, the first millisecond -54 dB and the last -153 dB (no click).

## THE GATE (THE TOOLCHAIN, 25/0, about 4 s)

K1 the doctor ready on this box, every row its install line, licence and why, the generator rows HELD by rule 115;
K2 the README names every command, tool and rule; K3 the tile end to end (fallback forced), 0 off the lock, joins in
its pack's band, the sheet, pixel for pixel the committed proof; K4 the sound end to end, under -1 dBFS, no click,
the licence line CC0 with its URL, the committed proof's samples (correlation 1.0000); K5 planted: no licence row, a
CC BY row, --out in slices/ and engine/ (rule 100, nothing written), one pixel off the lock, the 50 and 80 percent
seams, his own tile passing; K6 .env ignored; K7 the hook installs the audio half and the doctor checks every module
it names. MUTATED THREE WAYS: the snap removed 22/3, the licence check removed 24/1, the fence removed 23/2.

## HELD (rule 115, newest date wins; the coordinator's to retire or re-aim)

The generator half: Retro Diffusion's request-card Action (his 10/11 YES, record
BOHEMIA_PAOLO_YES_TO_RETRO_DIFFUSION_IF_IT_IS_NOT_WORK_FOR_ME_10_11_26.md) and PixelLab. Its first six assets were a
street lamp, a wrecked car, a gun, a portrait, a house face and a street tile; rule 115 (10/17) makes the first four
the rig's (modelled at the source), and 115(b) keeps the house face and the street tile on his packs. A second
picture source would be a second look. Same reading as [the gun in the repo], held 10/18. No RD_TOKEN is referenced
anywhere in the repo, so nothing waits on his secret.

## REDS ON MAIN MET, NOT THIS LANE'S

ART PIPE A2: 23 new drawing tools write pixels as numbers (COOK FOUR 9, UI 4, RUN 3, EYES 2, DIRECTION, ANIMATION,
COMBAT TWO, COOK, PEOPLE 1 each); the fence says drive Aseprite instead. The toolchain counts zero.

## [bb pipe]

Battle Brothers' modders start from one known kit (Adam Milazzo's Modding Script Hooks and his bbsq packer) installed
before anything is touched, so a newcomer's first hour is spent modding, not hunting tools. The chats get the same:
one doctor line says what is on the box and the one line for what is not.
