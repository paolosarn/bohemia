# OVER THE RIDGE: A NEW SONG FOR THE TITLE (SOUNDS, 10/18/26)

Row: [a new song every round] (VAMILY, SOUNDS), round one, the title song first. Claimed sound-opus-10-18d (377f03a1)
in the same session that shipped [the step in the fight]: the coordinator put the row at the top of this board while
that round ran, with his words, and his words beat the queue (standing duty 8).

## THE RULINGS THIS ROUND ACTS ON

- Paolo 10/18: 'I haven't heard a new song that was made in a long time... what's up?'
  (records/BOHEMIA_PAOLO_I_HAVE_NOT_HEARD_A_NEW_SONG_IN_A_LONG_TIME_10_18_26.md). His word on music: 'he likes 8-bit'
  (records/BOHEMIA_PAOLO_LOOK_AGAIN_GROKS_MUSIC_AND_CRASHBOX_ARE_IN_10_18_26.md).
- His 10/5: 'I wish there was cool main menu music... everything we do has to follow this analog horror aesthetic'.
- His 10/17 NO on the detuned title: 'the hiss way too loud and the music behind it sucks'. His fourteenth votes:
  YES on the title is the desert (the real wind at -30 dB rms).
- His songs are canon (laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md): none touched; a new song is added out
  loud in the song lock. 120 BPM. NO SAND. His anchor (9/6): the patience, the bass under it, the beat arriving late.
- The row's 8-bit way: clean NES-style chip, two pulse leads with the four duty cycles, a triangle bass, LFSR noise
  drums, three or four voices, a gain envelope on every note, the high-pass on all but the bass, a gentle low-pass
  on the pulses; no bit crushing, no heavy compression, no muddy low end; the analog horror in the melody and the
  mood. The how is the lane's.
- THE GROK PAGES (184 to 195) ARE NOT CITED: none carries its PASSED FILTER line yet ([the Grok pages, stamped] is
  EYES' row), so every number here is the 2A03's own. A reader went through all twelve: their duty-coefficient
  formula ('real = 0') is right only at 50 percent and their claim that a PeriodicWave skips the browser's
  band-limiting is wrong; the engine uses the closed-form series and every harmonic.

## WHAT SHIPPED

- THE ENGINE: engine/bohemia_chip_song.js, BOH_CHIP.make(ctx, dest, song, { tape }). Four voices the way the NES made
  them: the pulse as a PeriodicWave per duty (12.5, 25, 50, 75 percent), its Fourier series in closed form, every
  harmonic up to 96, a new oscillator per note so a duty change lands on its note; the triangle as the 2A03's 32-step
  4-bit staircase read into a PeriodicWave (the console's own soft buzz), gated 3 ms up and 15 ms down because the
  chip's triangle has no volume; the noise as the 15-bit LFSR (seed 1, feedback into bit 14, bit 0 XOR bit 1 long or
  XOR bit 6 short) clocked at 1.789773 MHz over the 16-entry period table; every volume a sequence of the 16 levels,
  one a frame at 60 Hz, with a 12 ms declick. A look-ahead scheduler on the audio clock (25 ms tick, 100 ms ahead).
  The worn tape (option B) is a shared 0.45 Hz wow at 7 cents and a 5.8 Hz flutter at 2 cents on every pitched voice
  and a 6 kHz low-pass: a drift, never a crush.
- THE SONG: slices/vote/songs/over_the_ridge.json, OVER THE RIDGE (a name, draft), a tracker grid a person can read
  and edit (rule 38g). D minor, 120 BPM, 32 bars, 64 s, loops. The tune on a 25 percent pulse with a vibrato that
  waits 0.24 s (6 Hz, 10 cents); the arpeggio on a 12.5 percent pulse, broken chords in sixteenths (up three times,
  down once); the triangle bass a whole note to the bar in the opening, then root, root, fifth, root; the kit from the
  noise and the triangle (a kick is a triangle falling 150 to 45 Hz under a dull click).
  THE SHAPE, bar by bar: 1 to 4 the ridge at night, the arpeggio and the bass alone (nothing forced in the first
  seconds); 5 to 12 the tune, a statement and its answer climbing to D6 (Dm Bb F C, Dm Bb Gm A); 13 to 20 the lift,
  and the beat arrives late at bar 13 (Gm Dm Bb F Gm Dm Eb A), bar 19 the wrong chord, E flat, the flat second over
  D minor's home; 21 to 28 the tune again, remembered wrong at bar 25 (A flat where it sang A, a tritone against the
  root) with the drums dropping out under it for two bars, the dead speaker; 29 to 32 the last phrase and back to the
  top on the A chord, the dominant that pulls into bar 1.
- THE VOTE ITEM: sounds-over-the-ridge-10-18 (kind song), slices/BOHEMIA_OVER_THE_RIDGE_10_18_26.html: the real start
  screen (UI's BohemiaMaterials.startScreen, his logo copied out of the alpha to slices/vote/songs/front_logo.png), the
  desert wind he kept under it (title_heard/title_wind.mp3, 0.7 under the song, 1.0 alone), A THE SONG, B ON A WORN
  TAPE, C THE WIND ALONE, STOP, and a line naming the bar and the part as it plays.
- THE LOCK: records/BOHEMIA_SONG_LOCK.json gains new_songs, one line per new song with its file, md5 and why;
  gates/song_lock_gate.js checks every line (a new song cannot change after he hears it without the line changing
  in the same diff) and --write now keeps the line instead of dropping it.

## MEASURED (offline render in Chrome, 44.1 kHz)

- Peak -6.55 dBFS, no compressor or limiter anywhere; 843 notes; no bar under -21.7 dB rms.
- On a phone (A-weighted, bars 14 to 26, each voice rendered alone): the tune -30.2 dB, the drums -34.3, the bass
  -36.9 (it came down 1.7 dB), the arpeggio -38.4 (it came up 3.8 dB: it carries the opening alone); the tune leads
  every voice by 4 dB or more.
- The written pitches sound: D5 587.5 Hz at bar 5, A flat 5 830.5 Hz at bar 25, E flat 5 622.4 at bar 19.
- Above 8 kHz: 23.8 dB under the whole (no crush, no sand). Two renders agree to 1.6e-6 (float rounding).
- Live on the page: 60 arpeggio notes in 6 s, every one on the 125 ms grid, worst 0.000 ms off.

## NOT IN THE GAME YET, ON PURPOSE

The title plays nothing new until his YES (unjudged is silent); any alpha byte is a demo re-cut (the deploy cuts the
demo from the alpha) and the cut is RUN's (rule 93). The swap is CUE 7.3 in BUILD_CALLING_SCRIPT.md. FOR RUN: his YES
on the title is the desert (the wind) is already in and that wind is not wired in the alpha either; CUE 7.3 carries
both.

## GATES

- over the ridge 31/0 (new, gates/over_the_ridge_gate.js, registered OVER THE RIDGE). MUTATED: the A flat sung as A
  turns three claims red (the shape, the lock's hash, the rendered pitch), 28/3, restored.
- song lock 21/0 (was 20: the new song's line); gate registry 7/0; attempt 15/0.
- vote tab: red before this round on DYNASTY's two items with no 'where you see it', unchanged.

## [bb] AND THE REAL WORLD

- Battle Brothers: its music is orchestral, not chip; the department this answers to is the SOUND (FFX's beach, under
  analog horror first) and his own word 8-bit. Nothing of Battle Brothers is in this song.
- The real-world practice it follows: NES composers wrote to four channels and made the limits the style (a kick from
  the triangle, chords as arpeggios, volume moved a frame at a time); this follows that, at the console's own numbers.
- The finding that proves us wrong: the alpha's song engine (synthV, MLOOPS) has no pulse duty and no 4-bit triangle,
  so 'made on the game's own song engine' and 'the 8-bit way' could not both be true; the 8-bit way is the newer word
  and won, and the new engine is a file beside the old one, never inside his songs.

## [analog horror]

In the melody, never in the grain: the flat second at bar 19, the tune remembered wrong at bar 25 with the floor
pulled out under it, a vibrato that waits like a held breath, and option B's tape that drifts a few cents. The only
hiss is the desert's.

## NEXT

- On his YES: CUE 7.3 (RUN). On B: the same, tape on.
- The row's next song: the map's travel song (his order: the title, then the map, then the fight), the same engine, a
  new tune; the engine is the road for every song after this one.

## FIXED AFTER (the same session, round two)

The engine leaked one sample at full scale at the start of some hits (a gain is 1 until its first event); the map
song found it, the engine's gains are now born at zero, and this song's gate refuses any jump over 0.4 (now 0.28).
The song's data and its lock hash did not change. Record: records/BOHEMIA_THE_LONG_ROAD_10_18_26.md.
