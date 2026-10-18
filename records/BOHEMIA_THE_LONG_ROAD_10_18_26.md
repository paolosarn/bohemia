# THE LONG ROAD: A NEW SONG FOR THE MAP (SOUNDS, 10/18/26)

Row: [the map's song] (VAMILY, SOUNDS), round two of [a new song every round]. Claimed sound-opus-10-18d (c1d22416),
the same session as rounds twenty-four and twenty-five.

## THE RULINGS THIS ROUND ACTS ON

- Paolo 10/18: 'I haven't heard a new song that was made in a long time... what's up?'; 'he likes 8-bit'. The row's
  order: the title (round one, OVER THE RIDGE, 474f7bb0), then the map's travel song, then the fight's.
- His songs are canon: the map already plays his songs in the street shuffle (CITYMUS); a new song JOINS that draw on
  his YES and never replaces one. His anchor (9/6): the patience, the bass under it, the beat arriving late. No sand.

## WHAT SHIPPED

- THE SONG: slices/vote/songs/the_long_road.json, THE LONG ROAD (a name, draft). E Dorian (the C sharp is the road's
  light), 120 BPM, 32 bars, 64 s, loops, on engine/bohemia_chip_song.js. Its own voice: the tune on a 50 percent pulse
  (hollower than the title's 25), a later vibrato (0.3 s, 5.5 Hz, 12 cents), a driving triangle bass in eighths, root
  and fifth, the arpeggio rolling root, fifth, octave, fifth.
  THE SHAPE: 1 to 4 the engine turns over (the bass and the road's tick, no tune); 5 to 12 the road, the tune with the
  kick on one and three and no snare (Em A Em A Em A C B); 13 to 20 the open desert, the climb to D6, and the snare
  arrives late at bar 13 (C D Em Em C D B B); 21 THE STALL, everything stops but one low E on the triangle for a whole
  bar; 22 to 26 the road again; 27 THE WRONG SIGN, a B flat chord, the flat fifth of E, the tune bending onto it; 28
  the turn home; 29 to 32 one long E with the vibrato and the tick, back to the top.
- THE VOTE ITEM: sounds-the-long-road-10-18 (kind song), slices/BOHEMIA_THE_LONG_ROAD_10_18_26.html: the real map
  (slices/BOHEMIA_MAP_CURRENT.html, untouched) from its own camera, the recorded desert under it at the map's level
  (MAPDESERT's file), A THE SONG, B ON A WORN TAPE, C NO SONG, STOP, a line naming the bar and the part.
- THE LOCK: its own new_songs line in records/BOHEMIA_SONG_LOCK.json (song lock 22/0).

## THE DEFECT THIS SONG FOUND, FIXED IN THE ENGINE FOR BOTH SONGS

The map song's first render peaked at -6.1 dB in bar 1, where nothing loud plays. Bisected in the browser: a single
hat at step 4 made it alone, at any volume including zero. A Web Audio gain is 1 until its first scheduled event, and
when a note's start falls between two samples the source's first sample went out at full scale before the gain's
'0 at the start' took hold: one sample at 0.50, then the high-pass ringing. It was in the title song too (on some
hits, wherever the start time rounded that way). Every gain in the engine is now born at zero. Measured after: the
largest sample-to-sample jump is 0.26 (the map) and 0.28 (the title), the chip's own noise flipping; the leak was 0.50
to 0.54. Both gates now refuse any jump over 0.4, and the map's gate was run once with the leak put back: red
(0.535), restored. The title song's data did not change (its lock hash holds); its sound did, cleaner.

## MEASURED (offline render in Chrome, 44.1 kHz)

- Peak -5.79 dBFS, no compressor; 1,106 notes; no bar under -22 dB rms but the stall.
- The stall is the triangle alone (one note in bar 21). E5 659.5 Hz at bar 5, the wrong sign's D5 587.5 at bar 27.
- Above 8 kHz: 22.5 dB under the whole. Two renders agree to float rounding.

## NOT IN THE GAME YET, ON PURPOSE

The map plays nothing new until his YES. CUE 7.4 in BUILD_CALLING_SCRIPT.md: on his YES the map's shuffle gets one
more song (64 s, then back to the draw), his songs untouched and still in it; RUN's cut (rule 93).

## GATES

- the long road 33/0 (new, gates/the_long_road_gate.js, registered THE LONG ROAD); mutated (the leak back) 32/1.
- over the ridge 32/0 (the click claim added); song lock 22/0; gate registry 7/0.
- vote tab: red before this round on DYNASTY's two items, unchanged.

## [bb] AND THE REAL WORLD

- Battle Brothers' map has no travel song of its own beyond its score; the department here is the sound and his word
  8-bit. Nothing of it is in this song.
- The real-world practice: NES overworld themes drive with an eighth-note triangle bass and save the snare for the
  lift; this does, at the console's numbers.
- The finding that proves us wrong: our own engine clicked on its first song and no ear or gate caught it until the
  second song made the click land where nothing else was playing. The click claim is now in both gates.

## [analog horror]

In the form, not the grain: the stall (the road goes dead for two seconds and only the engine's low note is left), the
wrong sign (a chord from outside the key, the flat fifth), and option B's drifting tape.

## NEXT

- On his YES: CUE 7.4 (RUN). The row's third song: the fight's.
