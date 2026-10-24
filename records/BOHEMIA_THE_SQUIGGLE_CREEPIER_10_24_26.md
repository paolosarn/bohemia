# THE SQUIGGLE, CREEPIER: ANIMALESE THE REAL WAY, A LITTLE WRONG (SOUNDS, 10/24/26, row [the squiggle, creepier])

Rule 135 (Paolo 10/24, LOCKED): 'we have squiggle voices... every time people speak... we might have to revamp or upgrade or
remake from scratch the squiggle voices; it's supposed to be this Animal Crossing style squiggle voice, but maybe it could be
more creepy.' His record: records/BOHEMIA_PAOLO_THE_SQUIGGLE_CREEPIER_10_24_26.md. Rule 127: no card, he hears it the next
time somebody talks.

BUILD 10/24c - THE SQUIGGLE, CREEPIER. Gate: gates/the_squiggle_creepier_gate.js.

## WHAT THE GAME DID BEFORE (measured 10/24)

- EVERY TALKING PORTRAIT WAS SILENT. The faces that talk in the demo (the map's one voice, UI's #bmvoice; RUN's walking man,
  #billtalk; the settlement's greeter and its keepers; the crew screen) all go through engine/bohemia_crew_faces.js talk(),
  which moves the mouth and never asked for a voice. The only callers of the voice left were the old walked city's talk cards
  (city: speakers) and the cold open tab. That is the likeliest answer to his 'where is that?'.
- The voice itself (engine/bohemia_voice.js, 8/9) is formant synthesis: a buzz through three bandpass filters per vowel, a
  filtered noise burst per consonant. Through the game's own chain it sat at -27.7 dB (the loudest 100 ms windows), under every
  bullet landing (-18 to -21) and 7.7 dB under the gun: the quietest thing on the bus.
- By the click ruler below, the old voice still makes 8 clicks in 19 of the game's lines (its hiss bursts are broadband
  edges); the 8/11 fix removed the worst of them, not all.

## THE REAL MATERIAL, AND HOW IT WAS CUT (tools/bohemia_squiggle_from_a_recording.py --cut)

This box reaches GitHub and nothing else (freesound, archive.org, huggingface, wikimedia, openslr: refused, measured 10/24).
LJ Speech (Keith Ito, 2017) is one woman, Linda Johnson, reading public-domain books for LibriVox, and the dataset is public
domain ('There are no restrictions on its use'). 32 of its clips (LJ001-0001 to 0032, 222 s) ride in coqui-ai/TTS's own test
data on GitHub; their words are in NVIDIA/tacotron2's file lists.

1. ALIGN: CMU PocketSphinx's own English model and dictionary (pip pocketsphinx 5, set_align_text) put every phone of every
   clip on a 10 ms grid: 25 clips aligned, 7 skipped for a word the dictionary does not know.
2. CHOOSE: a letter is the sound a mouth makes for it (Animalese's own rule): a consonant letter is that consonant and the
   vowel it opens (b is B+vowel from 'be', 'being'; h is HH+OW from 'whole'; c a K from 'character', 'called'), a vowel letter
   is its vowel (a is AA from 'modern', 'occupied', 'gothic'; o is OW from 'only', 'most', 'composed'). The vowel must be
   voiced (Praat finds a pitch in 60 percent of it), every take from a different word where the clips allow, never the same
   take for two letters (c, k and q share K: three different K's each), the rarest letters choosing first. 77 syllables: three
   for every letter but h (two: the clips say 'whole' and little else with an H).
3. BANK: each syllable with 40 ms of its own recording either side, one FLAC: reference/library/sound_bank/ljspeech_pd/
   (regions.flac 784 KB, regions.json, LICENCES.md with the 23 clips' words). The render needs nothing but the repo.

## HIS SIX ARE THE FAMILIES (the render)

Her own voice measured first, on the 25 clips: f0 median 223 Hz; her vowels' F1 1.24 and F2 1.11 of Peterson & Barney's men,
1.17 on the old engine's 'tract' scale. His six (records/BOHEMIA_VOICE_VERDICT_8_11_26.txt, the numbers he heard) become six
renders of every syllable by Praat's 'Change gender' (parselmouth, Praat 6.1, PSOLA):

| family | his f0 | his tract | formants moved | letters a beat | the room | the top | tilt |
|---|---|---|---|---|---|---|---|
| cand-1 | 252 | 1.070 | x0.915 | 5 (100 ms) | 17% | 5.2 kHz (his triangle) | +3.1 dB |
| cand-2 | 212 | 1.225 | x1.047 | 4 (125 ms) | 16% | 5.2 kHz | +2.9 dB |
| cand-3 | 168 | 1.032 | x0.882 | 5 (100 ms) | 14% | 6.2 kHz (his square) | -1.0 dB |
| cand-4 | 195 | 0.963 | x0.823 | 4 (125 ms) | 19% | 7.2 kHz (his saw) | -2.9 dB |
| cand-6 | 226 | 0.996 | x0.851 | 5 (100 ms) | 16% | 7.2 kHz | -0.5 dB |
| cand-7 | 229 | 0.943 | x0.806 | 6 (83 ms) | 20% | 7.2 kHz | -4.4 dB |

The pitch is set to his (Praat measured the rendered syllables back: 252, 212, 168, 196, 227, 230 Hz), its range halved so the
game's contour leads; each syllable re-timed to the family's slot on the 120 BPM grid (his rate rounded to 4, 5 or 6 letters a
beat), the pitch kept: a fast voice is quick, never a chipmunk. Two of his synth knobs became colour, said plainly: his 'wave'
is the top of the band (a triangle is soft, a saw bright), his 'gruff' (breath in the buzz) is the tape's drive and the room's
share. The chain is the lane's own (tools/bohemia_from_a_recording.py, REUSE-FIRST): high-pass 140 Hz, his tilt as a high
shelf at 2.5 kHz, the tape (head bump, saturation, slow wow, a 2:1 compressor), a small front room (4 x 5 x 2.7 m, RT60 0.35 s)
convolved in with 110 ms of its tail, the band cut steeply at the family's top, 4 ms in and 30 ms out to true zero, every
syllable's loudest 50 ms at -16 dBFS.

THE BREATH: two real frightened breaths in from ESC-50 3-166125-A-23 (Adam_N, Freesound 166125, CC0), the same tape and room.

ONE SPRITE: slices/voice_heard/squiggle.mp3, 462 syllables and 2 breaths, 125.7 s, 737 KB (48 kbps mono), and index.json:
every take [at, dur], the families, the onset the player uses to line up any browser's mp3 decoder (Chromium: 0.02 ms off).

## THE PLAYER (engine/bohemia_voice_recorded.js)

A person is still a voice object from engine/bohemia_voice.js (voiceOf, castVoice, speakerVoice: his seed), so identity is
unchanged. The player says it: the family nearest his tract and pitch (tract weighted first, the cue a playback rate cannot move
alone; his own six are themselves, exactly), his pitch inside it on the playback rate (Animalese's own knob, four semitones at
most), his speed on the grid (4, 5 or 6 letters a beat, a shout faster), one syllable per letter, never the same take of a
letter twice running, the line starting on the song's next step when the music plays. Declination down the line; a question
rises at its end. The mood (punctuation and case only, the 8/13 engine's rule) moves pitch, speed and level as before.

CREEPIER, INSIDE ANALOG HORROR, NEVER COMEDY, STILL A PERSON. Seeded on (person, words), never Math.random: the same person
saying the same line is wrong in the same place every time, like a damaged tape, and a voice you cannot learn is not a person.
- A SYLLABLE DROPS: the tape lets go (the take under a 600 Hz lowpass at a sixth of its level), about one letter in 45.
- A SYLLABLE DOUBLES: the tape catches, the take again half a step later and 3 percent flatter, about one in 50.
  Never the first two letters or the last two, never two wrong things within six letters.
- TAPE WOBBLE: 0.55 Hz at 0.3 percent, plus his family's own vibrato as the tape's, all inside the one law his eight verdicts
  prove (he killed the two voices that wobbled): never past 0.73 Hz, never deeper than 2.09 percent.
- A BREATH THAT SHOULD NOT BE THERE: on about one line in three, a frightened breath in, inside the line at a word gap (the words
  after it wait for it) or after the line is over, when nobody should be breathing.
- A SAG AT THE LINE'S END: the last three or four letters of a statement slow and fall 6 to 12 percent, the way a tape motor
  dies; never a question.
- A ROOM ON IT: baked in by the tool, so the player builds no convolver (SCREECH LAW: no delay, no convolver, no waveshaper, no
  feedback anywhere in it).
NO CLICKING: every take starts and ends on zero in the file, every gain is BORN at zero (a new gain is 1 until its first event,
and a source started between two samples hands out one frame at 1 first: the one click the first build had, 60.9 dB over its
neighbours on a doubled syllable), ramps up in 5 ms and down to true zero before stop(). A LINE CUT SHORT (the next line cuts
the one talking, so it happens as often as a line starts) fades on the line's own output, which nothing else automates, in
15 ms: the first build cancelled every syllable's own envelope instead and that clicked at 86 of 144 cut points (Chromium
held the cancelled envelope wrong mid-ramp); now 0 of 144.

## INTO THE GAME (tools/bohemia_squiggle_patch.py; the demo cut by tools/bohemia_cut_the_demo.js)

- The alpha inlines the player verbatim and its glue: window.SQUIGGLE, window.squiggleSay (the recorded voice when its bank is
  in, the 8/11 voice exactly as it was until then, never silence). The bank loads 4 s after the music first runs, never before
  the door.
- speakLine, the game's one voice (one at a time, the music ducked for exactly as long), says it through squiggleSay. A FACE
  speaker ('face:<look>') is cast from his look like the city's people (ONE ID, ONE WHOLE PERSON: his look is his seed), and a
  face saying its line again after it finished is a person saying it again, never dropped as a repaint.
- engine/bohemia_crew_faces.js talk() (RUN TWO's module; three lines, additive, NOTE on RUN TWO's board): a face that mouths a
  line posts it to the top window's voice. Every screen that talks through a face is heard with no line of its own.
- The MUSIC tab's voice judge and the cold open tab still call the 8/11 engine: the judge is the record of what he voted.
- The narrator (rule 45, 9/29) is untouched: the phone's own speech engine, the machine's voice.

## THE LEVEL AND THE CLICK RULER (tools/bohemia_squiggle_level.js, a real Chromium)

THE MARK: -22 dB after the game's compressor and brickwall (the loudest 100 ms windows, the top fifth): a person talking sits
just under the gun (-20) and level with a bullet landing, and the music ducks for him. Measured over 19 of the game's lines
said by his six and six people cast from his envelope: the old voice -27.7 dB, the new at 0 dB -10.5 dB, so the player rides
-14.15 dB, FOUND BY STEPS (the chain's compressor bends the level: one subtraction from the 0 dB reading put it at -19.4,
the second step at -22.0). A line lasts 4.0 s (the old 3.1): every letter on the grid, a word gap a step, a comma two, a full stop three.

THE CLICK RULER: a click is a step, broadband and over in a millisecond; the skirt of a real 's' up there is noise-like and lasts
tens of ms. So: everything above 13 kHz (nothing a syllable says reaches it: the band stops at 7.2 kHz and the most a playback
rate lifts it is x1.5), in 0.5 ms frames, a click is a frame 15 dB over the median of the 40 around it and within 45 dB of the
line's peak. PROVEN ON TWO PLANTED CLICKS (a take cut in at its loudest sample, the same take stopped dead there): both seen,
92 dB over their neighbours. WHY 20 dB: a real stop's release (a t, a k) is itself a transient and measured up to 13.9 dB over its neighbours in these
recordings; the click a gain born at 1 made stood 60.9 dB over them, the cut that cancelled envelopes up to 92, the planted 92.
THE NEW VOICE: 0 clicks in 19 lines (its worst frame 13.9 dB) and 0 at 144 cut points (worst 9.3). THE OLD: 3 in 19 lines.

## MEASURED IN THE GAME (the demo, his phone's door, through the map)

A town opened from the map (the Anarchists): the face that greets him (person_cartel_4) said 'Work's on the board, mijo...' and
the shell said it in the recorded squiggle (family cand-3, 19 syllables, 3.2 s, its sag 7 percent); then the bar tapped with a
real touch: MALACHI COYLE, BEHIND THE BAR (person_reds_6) said 'My cousin says it's market day over by the Homeless...' (family
cand-4, 41 syllables, 5.0 s, two syllables dropped, a breath after the line); the effects bus carried both at about -26 to
-30 dB RMS in 50 ms windows; nothing threw. Gate leg 8 does this every run.

## GATES (rule 13: my runs)

THE SQUIGGLE, CREEPIER (gates/the_squiggle_creepier_gate.js, new, registered): the files (the recording is real, his six are the
families, at his own pitch by Praat within 3 percent), the bare page (Animalese: one take per letter on the grid, his six
themselves; one voice per person: the same samples every time, another person not; no clicking, the ruler proven, a cut line
fades; the level at the mark, none over -1 dBFS; creepier never broken, over three passes of the game's lines; a statement falls,
a question rises; the wobble inside his law), the game carries it (byte for byte in the alpha and the demo, routed, the faces
heard, the SCREECH LAW, the narrator still the machine), and the real surface (the greeter and a tapped keeper heard).
RESULT on this tree: 19/0. PLANTED, each turning it red (SQUIGGLE_ENGINE=<a mutated copy>, --fast): the gain born at 1 (NO
CLICKING: 2 clicks in 20 lines), Math.random for the seed (ONE VOICE PER PERSON), no drops or doubles (CREEPIER), the tape's
wobble at 3 percent (HIS ONE HARD LAW: 3.91 percent), no sag (CREEPIER), and the first build's cut that cancelled every
syllable's envelope (NO CLICKING: 28 clicks at 54 cut points).
Beside it on this tree: SQUIGGLE VOICE 41/0 (its 'zero audio files' legs are about engine/bohemia_voice.js, which still loads
none: the recording lives in the new player), VOICE MOOD 19/0, VOICE VARIETY 3/0, VOICE AUDIBLE 2/0, TALKING PORTRAIT 34/0,
NO FACE FROM A BODY 23/0, DEMO BUILD 25/0, THE BULLET LANDS 12/0 (--fast), ONE SONG ONLY 16/0, VOICE SURFACES 27/0 (was
25/1 on main before this row: its discovery sweep found the demo unlisted, cutCaption, since the demo carries the cold open's
code; the demo is in its list now). RED ON MAIN BEFORE THIS ROW AND THE SAME AFTER (run on a clean checkout of 2b0c5838):
CITY UI VOICE 9/3 (the phone, close and sleep controls it measures are no longer in the city) and CITY TALK (a TimeoutError
walking the old city's talk card); neither touches this row.
THE STOPWATCH (re-run in this commit): BUILD 10/24c, the door 15.2 s on the 4x phone profile, median of 5 (14.7 to 15.7), 3.6 MB
before the door; the cut before it (10/24b, never timed) read 17.8 s (12.2 to 18.2) with the same 3.6 MB, so the voice adds
nothing before the door (its 737 KB loads 4 s after the music runs).

## NOTES LEFT (VAMILY)

- RUN TWO: engine/bohemia_crew_faces.js talk() now posts each line it mouths to the voice ({ type: 'BOHEMIA_VOICE', speaker:
  'face:' + look, text }); a screen that wants a face silent passes no line. Nothing else in the module changed.
- UI: #bmvoice is heard now (through the face it shows); the words still print as the mouth says them; nothing to change.
- RUN: the demo cut was this lane's for this one change (BUILD 10/24c).
- WORDS (paused): every line a face says is now heard; a line's first sentence is what is said (the 8/9 opener rule).
- COMBAT: THE FIGHT'S VETERAN IS THE ONE TALKING FACE LEFT SILENT (his line types in and his face works on the slots in
  slices/BOHEMIA_FIGHT.html teach(), and nothing asks for a voice). The one line that makes him heard, in the same voice he has on
  the map, is on COMBAT's board; not done from this lane (COMBAT's file, read by a dozen of its gates).

## ANALOG HORROR LINE (rule 20, section 9)

The worst voice is the one that is almost right: a real woman, recorded years ago, pitched into somebody else and played back
off a tape that has been in a hot car, so every so often a syllable is not there, or is there twice, and once in a while,
after he has finished talking, you hear him breathe in.

## [bb ...] SCHOOL LINE

Battle Brothers' people never talk; its events are text, and its brothers grunt only when they are hit. Ours talk in a squiggle
the way Animal Crossing's do, so a face reads alive, and the squiggle is the one thing Battle Brothers never had: you learn a
man by his voice, and you can tell when the tape is going.
