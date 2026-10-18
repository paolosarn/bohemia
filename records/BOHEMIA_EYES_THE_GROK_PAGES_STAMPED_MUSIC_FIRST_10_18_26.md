# EYES [the Grok pages, stamped] -- 38 GROK PAGES STAMPED, MUSIC FIRST; AND OUR SAND IS NOT THE SQUEEZE (10/18/26)

Row: EYES AND EARS [the Grok pages, stamped] MUSIC-FIRST-THEN-THE-LOOK (coordinator 10/18, from Paolo's
'look again, grok fixed it'; records/BOHEMIA_PAOLO_LOOK_AGAIN_GROKS_MUSIC_AND_CRASHBOX_ARE_IN_10_18_26.md).
Session eyes-opus-10-18c. The filter is laws/BOHEMIA_ADDENDUM_AN_OUTSIDE_HELPER_KNOWS_EVERYTHING_9_30_26.md s5:
(1) no game he has not named, each named one in its department; (2) nothing that contradicts a newer ruling;
(3) a source on every number, or (recall). The stamp is line 2 of each page; gates/grok_filter_gate.js reads it.

## THE ANSWER FIRST

- **All 38 pages carry a line 2.** Music (184 to 195): **11 PASSED, 1 FAILED** (195). The look (158 to 183):
  **2 PASSED** (159, 160), **24 FAILED**. GROK FILTER 6/0, GROK FENCE 5/0 after both commits.
- **SOUNDS can cite 184 to 194.** Every hardware number on them checks out against the NES documentation. Six
  carry an ERRATUM on line 2 where Grok's REASON is wrong and the advice still holds; the one that matters most is
  190: a worklet that makes "the raw edges the hardware had" at the browser's 48 kHz aliases, and aliasing IS
  sand. **195 FAILED** on a false number that breaks the 120 BPM law (below).
- **DIRECTION can cite 160** (CRASHBOX, the facts checked) and 159 (the candidate shows). The other 24 look pages
  fail on the same handful of generic pixel-art rules our own numbers card, measured from his 1,927 tiles,
  disagrees with. The Crashbox facts that check out are collected below; cite this record for them.
- **THE FINDING THAT PROVES GROK WRONG ABOUT US** (the squeeze, measured; section 6): Grok 184, 187 and 193 say
  the sand is heavy compression and limiting. Our music does end in a compressor and a brickwall limiter, but on
  141 of his 142 songs they turn the music down 0.07 dB (the typical song), past 3 dB only as a song starts;
  what the chain does is make it 8.0 dB louder. The exception, THE GAPS IN THE HYMNAL, is crushed 18.7 dB.
  What the measurement does find off the 8-bit way: a white-noise layer in 119 of 142 songs that carries their
  top end (17 dB of it in THE MARKER ON THE DOOR), and voices that are 51 percent sine and 25 percent sawtooth
  (24 percent of our notes are a voice an NES has).
- **THE FINDING THAT PROVES THE COORDINATOR WRONG:** the 10/18 note on ANIMATION's section relays Grok's
  "12 frames a second". Our numbers card says twelve drawn keys a BAR at 120 BPM: 6 a second, 167 ms a key.
  Grok's 12 a second is twice our rate. Routed.

## 1. HOW EACH PAGE WAS READ

Every page read whole, by me, in this session; no sub-agent judged a page. Numbers were checked through the
search tool's copy of the source page (direct fetch of nesdev.org and wikipedia.org is refused by this box's
proxy: 403 and no DNS), never from memory alone; where the source text did not show a number, the stamp says it
is my arithmetic or (recall). A number that is a PROPOSAL (a volume, a hit length, a bar count) is named as a
proposal to tune by ear: it has no fact to source. The rule I held to, so 38 stamps say the same thing the same way:

- **FAILED** when the page tells a lane to build something a current ruling forbids, or when a false number
  changes what gets built.
- **PASSED with an ERRATUM** when a reason is wrong but the advice holds and breaks nothing.
- **PASSED** when the numbers check, no game is named outside its department, and nothing contradicts a ruling.

## 2. THE MUSIC PAGES (184 to 195): WHAT CHECKED, WHAT DID NOT

| page | stamp | checked against | the correction on line 2 |
|---|---|---|---|
| 184 chip music at 120 | PASSED | nesdev APU Mixer (90 Hz and 440 Hz high-pass, 14 kHz low-pass) | "120 to 150 BPM for NES tracks" is (recall); its COOK line names the art coordinator, songs are SOUNDS' |
| 185 duty and arps | PASSED | nesdev APU Pulse (12.5 / 25 / 50 / 75) | 75 sounds the same as 25 inverted |
| 186 drums and loops | PASSED | the 10/18 8-bit ruling | noise drums inside a SONG only; an EFFECT stays real material (9/23, 32e) |
| 187 deep Web Audio | PASSED + erratum | nesdev Pulse/Noise/Mixer; the famichord (Linus Akesson, 'Elements of Chip Music'; Ludomusicology 2015); Chris Wilson, 'A tale of two clocks' (25 ms timer, 100 ms window) | browser oscillators are band-limited (Chrome, Safari, Firefox since 37), the low-pass is for tone, not aliasing |
| 188 PeriodicWave, envelope, scheduler | PASSED + erratum | nesdev Envelope; Chromium's PeriodicWave.cpp builds its own square from one | a PeriodicWave is band-limited too; its real use is the 12.5, 25 and 75 duties the built-in 50 percent square cannot make |
| 189 Fourier, SRDC, mixer | PASSED + erratum | nesdev APU Mixer: pulse_out = 95.88 / (8128 / (p1 + p2) + 100), tnd 159.79 with 8227, 12241, 22638 | a 25 percent pulse is not an odd function; sine terms alone give the right harmonic sizes, not the shape |
| 190 coefficients, order list, worklet | PASSED + erratum | the Fourier series | raw edges at 48 kHz alias: step at chip rate and average down, or band-limit, or use 188's PeriodicWave |
| 191 LFSR, order, clicks | PASSED | nesdev APU Noise (15 bits; bit 0 XOR bit 1, 32767 steps; bit 0 XOR bit 6, 93 or 31); WebKit AudioParam.cpp and the Web Platform Tests (exponential ramp to 0 throws RangeError) | none |
| 192 triangle, vibrato, rules | PASSED + erratum | nesdev Triangle and Mixer ($4011 quiets the triangle and the noise) | a constant offset fades nothing in a linear Web Audio sum; MIDI 55 / 60 to 84 must be converted to our engine's semitones-from-110-Hz |
| 193 sweep, timer, gain | PASSED | nesdev Sweep (ones' complement on pulse 1, two's on pulse 2; mute over $7FF or under 8); nesdev Pulse (1.789773 MHz, CPU / (16 (t + 1))) | none |
| 194 frame counter, schema, shaper | PASSED | nesdev Frame Counter (240 / 120 Hz; 192 / 96 Hz in 5-step) | the mixer curve takes LEVELS 0 to 15, so map the sum onto 0 to 30 and high-pass after, as the hardware's 90 Hz filter does |
| 195 length table, counterpoint, worklet | **FAILED** | nesdev APU Length Counter (its legend names 4/4 at 75 bpm); Furnace's NES table (80 = 667 ms) | see below |

**195, THE ONE THAT PROVES GROK WRONG ON MUSIC.** It says the length table gives "16th, 8th, quarter, half, whole
notes at about 160 to 180 bpm" and tells Claude to "schedule the note stop time from the same table, do not
free-form the duration". The table's two note families are 4/4 at 90 bpm (10, 20, 40, 80, 160) and at 75 bpm
(12, 24, 48, 96, 192), counted at about 120 Hz on NTSC. The 75 is on nesdev's own legend; the 90 is my arithmetic
from Furnace's table (raw 80 is 667 ms, a quarter at 90). At OUR 120 BPM a quarter is 500 ms (60 counts) and a
half is 1 s (120 counts); 60 is in the table, 120 is not. Built as written, the durations land off our grid.
Its counterpoint and worklet paragraphs are sound and covered by 186 and 190, so SOUNDS loses nothing.

None of the twelve names a game. The NES is the hardware the 10/18 ruling names; Chris Wilson is the engineer who
wrote the Web Audio scheduling article; Linus Akesson is the chip musician who named the famichord.

## 3. THE LOOK PAGES (158 to 183): THE GENERIC RULES OUR CARD DISAGREES WITH

Grok's pixel and animation rules are the internet's standard pixel-art advice. Our numbers card
(skills/bohemia-pixel-art/SKILL.md) was measured from his purchased tiles and holds the rulings. Where they meet:

| Grok says (pages) | our ruling says | so |
|---|---|---|
| 12 fps, on twos; holds of 80 to 150 ms (163, 166 to 170, 172 to 177, 182) | twelve drawn keys a BAR at 120 BPM, 167 ms a key (the envelope law 9/24; the card) | off the grid; twice our rate |
| people at 16, 32 or 64 px, portraits at 128 (161, 162, 170) | the 112 px box, about 100 painted (9/21); the 32 px default is dead (NO ATARI 9/27); a portrait is a fresh render from the model (115h) | wrong size |
| lock one Lospec palette, Soft & Dirty (15) or Dry Sea (10) (163, 165, 168, 176, 178, 179, 183) | the family palettes cut from his tiles, 64 colours each; never invent one (the card); neither Lospec palette turned up on Lospec in this check | a new palette |
| checkerboard or Bayer dither (169, 179) | never a checker dither on a surface (the card) | forbidden |
| light flat or one hard source (most pages) | one key light from above, a little left (the card; 114a) | flat is out; 181's upper-left default is right |
| draw by hand in Aseprite: key poses, onion skin, linked cels, parts on cels (163, 168, 169, 173, 175, 177, 181, 182, 183) | every character, beast, vehicle and prop modelled at the source through the master rig (115a); the 2D parts grammar is a NO twice (10/17) | a dead road |
| junk street tiles, cartridge walls, scrap and barbed wire (161 to 165, 179) | the ground and the buildings stay on the packs (115b) | a redesign of both |
| cartridge-shaped menu plates and buttons (161 to 163, 165, 178) | the alpha's UI is frozen at his picks (rule 28) | not ours to change |
| outlines optional, never black, none on faces (171, 180) | a character's border is one black pixel where he sees it (8/14 law, border gate); props soft, buildings 1 px dark brown (the card) | contradicts |
| Godot and Unity settings (171, 178) | the game is one HTML page (the ONE-LINK LAW) | does not apply |
| "one Eddie Bull style face, one Captain Bones style body", green clay cartridges in our walls (161 to 166) | CRASHBOX is the look's reference, art only (115d amended 10/18) | lifting the show's own characters and props is copying, not the look |

What the look pages get RIGHT, and we already hold: the silhouette test at 1x (114a), no glow and no rounded
candy shapes (114a), hue shifting cool into shadow and warm into light, 10 to 20 degrees a step (114a asks 8 or
more), point filtering and integer scale (114a), grain baked at the source and static across frames, the
analog never a filter laid on top (the analog horror law), a sheet that travels with its tags and durations
(ANIMATION's clip table), the main character downed and never dead (9/27).

158 failed on a ruling, not a rule: it names Moral Orel as the show he meant (Grok 159 retracts it; his word ruled
it out, 115d amended) and calls Don't Hug Me I'm Scared a reference he asked for, which he never did; its ten
analog horror games are a genre study at most (115d: none becomes a reference game; the coordinator's own research
page holds that study) and the page offers them as the proof to cook against.

## 4. THE CRASHBOX FACTS THAT CHECK OUT (cite this record for them)

Checked through the search tool against Wikipedia's Crashbox page, the HBO Family wiki, the Crashbox fan wiki,
the Internet Archive's episode uploads, IMDb's cast list and a Substack retrospective of the show:

- HBO Family, early 1999 to spring 2000; two seasons; 52 episodes made of 65 planned.
- Made by Planet Grande Pictures; animated by Cuppa Coffee Studios (Adam Shaheen). Stop-motion edutainment.
- The frame: inside a game machine, rusty tin robots load green game cartridges sculpted out of clay.
- Each half hour is short games of two to five minutes. The game segments use stock music; only the factory
  segments have music of their own.
- The Revolting Slob: a narrator (Edie McClurg) asks which of three words fits his action; it ends in an
  explosion that fills the room with smoke.
- Captain Bones is a segment (episode 18's is on Cuppa Coffee's own Vimeo).
- Psycho Math: Professor Rocket, a hot-headed robot, sets long math problems with countable pictures.
- Think Tank: Captain Bob, trapped in a fish tank, shows three things; find what they share before time runs out.
- Power outages are a recurring hazard of the factory.
- Jerry Stiller is in the voice cast (which part, unverified). Eddie Bull is a character (IMDb: Greg Eagles).

NOT verified, so (recall) wherever Grok states them: Captain Bob as carved foam with 36 mouths; Professor
Rocket's calculator mouth and plus-and-six eyes; Eddie Bull's real human mouth; the loader names (Scrap Metal,
Wireframe, Arcade, Phone); the flashlight robot; "seven to eight months for the first block"; "the real Candle
Cove" (fan folklore); OPAL's twelve minutes (Grok 159).

## 5. WHAT SOUNDS TAKES FROM THE PASSED PAGES, IN ONE LIST

Two pulse voices with four duties (a PeriodicWave per duty, 188 and 190); a triangle bass with no volume moves;
LFSR noise for the song's drums only, high-passed, under 100 ms (186, 191); every note on a gain envelope from and
to near zero (exponential ramps cannot reach 0, 191); notes posted on the audio clock by a 25 ms timer looking
100 ms ahead (187, 188); the NES pitch table from CPU / (16 (t + 1)) with its real cents of error (193); the
nonlinear mixer as one curve over the pulse pair and one over the rest, then a high-pass (189, 194); patterns and
an order list as data (190, 191, 194); counterpoint, not stacked chords, the famichord for harmony (186, 187).
Durations come from OUR 120 BPM grid, never from the NES length table (195 FAILED).

## 6. THE SAND, MEASURED: tools/bohemia_eyes_the_squeeze.js

THE QUESTION: three passed pages (184, 187, 193) say the "crushed sand" is heavy compression and limiting. The
alpha's sound does end that way: MAST (0.8) -> his music slider -> his master slider -> a compressor (threshold
-14 dB, knee 8, ratio 6, attack 2 ms, release 120 ms) -> a brickwall limiter (threshold -5 dB, knee 0, ratio 20,
attack 1 ms, release 80 ms) -> the speaker. Does it squeeze his songs?

HOW: the chain was read twice, off the source text and off the two live compressor nodes the alpha builds when its
sound starts; they agree, or the tool stops. The level into it is the live one (0.39: MAST 0.8 x his music slider at
its default 0.75, tapered to 0.487, x master 1). Every song in the shipped tables, 142 of them, was played by the
game's own song engine (its scheduler, its voices, 16 bars, 32 s) into one two-channel offline render: one channel
through a copy of the chain, the other without the two compressors. Same notes, same render. The compressor's and
the limiter's own gain reduction were read every 0.1 s while the song was playing. Numbers:
records/BOHEMIA_EYES_THE_SQUEEZE_10_18_26.json.

WHAT IT FOUND:

| | measured |
|---|---|
| how much the compressor turns the typical song down while it plays | **0.07 dB** (median of 142; mean 0.2 with the one exception) |
| when it passes 3 dB | only at 0.35 to 0.55 s, the song starting (the first 12 songs re-run with the times kept; one has none); its biggest moment is in the first 0.8 s on 131 of 142 |
| the limiter, on average | 0.1 dB |
| punch lost (peak-to-average, with and without the chain) | 0.05 dB |
| what the chain DOES do | makes the music **8.0 dB louder** (the compressors' automatic make-up gain): 8.12 to 8.19 dB on every song but one |
| the one exception | **THE GAPS IN THE HYMNAL** comes in 21.8 dB over full scale and the compressor works **18.7 dB** on it, over 3 dB 96 percent of the time, the limiter 3.4 more; this song IS squeezed sand. SOUNDS found it over full scale on 9/12 and 9/13 (records/BOHEMIA_THE_SOUND_CARD_9_12_26.md) and left it, a CANON song; it still is |
| songs with a white-noise layer | **119 of 142**, about **86 bursts in 32 s** each (a buffer that crosses zero on more than 30 percent of its samples, read off each buffer as it plays) |
| what that layer carries | in THE MARKER ON THE DOOR, taking ONLY the noise out drops the energy above 6 kHz by **17 dB** while the loudness moves 0.0 dB: the top end of the song is the hiss |
| what the voices are | of 47,492 notes: **51 percent sine, 25 percent sawtooth**, 14 percent triangle, 10 percent square (50 percent duty only). The NES has two pulses, a triangle and noise: **24 percent** of our notes are a voice it has |

SO: the passed pages are right about what sand is in GENERAL, and wrong about where OUR sand lives. On 141 of 142
songs the end of the chain is a volume knob, not a squeeze. The things the measurement does find off the 8-bit way
are the white-noise layer that carries the top end (the band the 9/23 NO SAND ruling already suspected) and the
voices (three quarters of the notes are sine and saw). One song is truly crushed and has been reported before.
NOT MEASURED HERE: the songs with the effects and the ambience playing at the same time (they meet the same
compressor at OUT), and anything on a real phone's speaker.

THE A/B IN THE VOTE TAB: THE MARKER ON THE DOOR (it plays on the map by day), 12 s three ways, over the map:
A as the game plays it; B without the two compressors, raised to the same loudness (8.19 dB) and never over -1
dBFS; C through the same chain with only the white noise taken out. A and B measure the same (loudness within
0.01 dB, top end within 0.07 dB); C loses 17 dB of top end at the same loudness. slices/vote/EYES_THE_SQUEEZE.html.

## 7. ROUTED

- **SOUNDS [a new song every round]:** cite 184 to 194 by number; 195 FAILED (durations from OUR 120 BPM grid,
  never the NES length table). Read the errata on 187, 188, 189, 190, 192 and 194 before building; 190's is the
  one that makes sand if missed. The measurement in section 6 says the end of the chain is not where the sand
  lives; the white-noise layer and the voices are. Your row's text says "Grok 184 to 195": 195 is the one to drop.
  THE GAPS IN THE HYMNAL is still 21.8 dB over full scale and crushed 18.7 dB (your 9/12 finding, still open).
  The stamps on 184 and 193 first read the chain's SETTINGS as the sand; after the measurement they say what it
  does to his songs (0.07 dB on the typical one, 8 dB louder, one song crushed).
- **ANIMATION [the beasts through the rig]:** your claimed row says "Grok 170 to 177 read first". All eight FAILED,
  on the same two things: 12 frames a second (ours is twelve keys a bar, 167 ms a key, the envelope law) and the
  hand-drawn Aseprite road (115a). The Crashbox IDEA (held poses, stiffness, parts that do not quite fit) stands;
  its numbers do not.
- **DIRECTION [the look bible]:** cite 160 and this record's section 4 for CRASHBOX; the look pages' generic
  rules are in section 3 beside the card's numbers that beat them. Neither Lospec palette was found. The shows on
  159 stay candidates (115d amended).
- **COORDINATOR:** (1) your 10/18 note on ANIMATION's section relays "12 frames a second": Grok's number, not
  ours. (2) SOUNDS' song row and your 10/18 record say "Grok 184 to 195"; 195 FAILED. (3) The grok branch still
  carries 158 to 195 with a BLANK line 2: the next copy of the folder onto main must bring new pages only (or main
  merged into grok first), or a whole-folder copy wipes these 38 stamps. (4) The GROK FILTER gate reads PATHS; a
  citation in prose ("Grok 195") is invisible to it. PLUMBER's call whether the gate should read "Grok NNN" too.
