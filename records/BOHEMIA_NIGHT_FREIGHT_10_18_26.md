# NIGHT FREIGHT: THE MIDDLE GROUND (SOUNDS, 10/18/26)

Row: [the middle ground] (VAMILY, SOUNDS), round three of [a new song every round]. Claimed sound-opus-10-18e
(f26924fb).

## THE RULINGS THIS ROUND ACTS ON

- Paolo 10/18, his YES on OVER THE RIDGE: 'Awesome I like it, but I just questioned like the aesthetic inspiration of
  what I'm hearing... whether it really goes with the vibe of bohemia... it sounds very different than the rest of our
  songs... they're still 120 BPM... so I wonder if there's like a middleground to reach for all of this, but yeah, like
  I like it.'
- The coordinator, sweep AT: 'his canon songs' own style and arrangement played the clean 8-bit way, so old and new
  sound like one game.'
- His songs are canon (7/26): read, never edited. NO SAND, no crush (10/18, the 8-bit way).

## FIRST, HIS SONGS READ AS MUSIC

records/BOHEMIA_WHAT_MAKES_HIS_SONGS_HIS_10_18_26.md, one page. The finding that proves us wrong: the title song does
not sound different because it is 8-bit; it sounds different because it is WRITTEN differently (21.8 pitched notes a bar
against his REPO MAN's 5.9, a running arpeggio in every bar, seven chords, a snare). The chip was never the problem.

## WHAT SHIPPED

- THE SONG: slices/vote/songs/night_freight.json, NIGHT FREIGHT (a name, draft), the map's song at night, written by
  tools/bohemia_sounds_middle_ground.py (same bytes every run, --check). WHAT IS HIS: the 64-bar form (SONG_ARR) and the
  key move every four bars (SONG_ROOT), read out of the alpha; G on REPO MAN's five notes (G A B flat D E flat), the
  map's most common key; half time; the kick on 1 and 3, the hat soft on 2 and 4, no snare, his four-kick fill; no
  drums for eight bars; the bass on his engine's own rule (scale[s % 5]) with his B lift; A the motif on beat one, B the
  tune, C kick and bass, D the high line. WHAT IS THE CHIP'S: the tune on a 50 percent pulse (round, closest to his soft
  leads), the NES echo three sixteenths late on a 12.5 percent pulse, the triangle bass an octave over his (a phone can
  hear G2, not G1), his BOOM as a chip kick (the triangle falling 110 to 34 Hz in 0.28 s with a low noise thump). WHAT IS
  WRITTEN: a tune a person can hum, CALL then LONGS (his two map shapes back to back, so his silent answer bar is his
  long notes), D Eb D Bb A Bb / G D / D Eb D Bb D Eb G / Eb D, from the five notes only, where his engine draws the
  degrees from a hash. 9.2 pitched notes a bar: between his 5.9 and the title's 21.8.
- THE ENGINE (engine/bohemia_chip_song.js, additive): an order entry 'name@3' plays that bar's pitched voices three
  semitones up (his SONG_ROOT as data); a song may carry its own kit. OVER THE RIDGE 32/0 and THE LONG ROAD 33/0 after.
- HIS SONG FOR THE A/B: slices/vote/songs/his_repo_man_on_the_map.mp3, the first 32 bars of REPO MAN recorded from the
  alpha's own music engine by tools/bohemia_sounds_record_his_song.js (MUS.playStep on an OfflineAudioContext, the way
  gates/menu_music_gate.py renders; CITYMUS on so the kit is held for 128 steps, as the map does; layers 0). The alpha is
  not changed on disk. Set to the new song's loudness THROUGH A PHONE'S SPEAKER (two high-passes at 350 Hz): +4.0 dB
  (gain 1.5875), no limiter (peak 0.72). Both read -27.65 dB through that speaker.
- THE VOTE ITEM: sounds-night-freight-10-18 (kind song), slices/BOHEMIA_NIGHT_FREIGHT_10_18_26.html: the real map
  (slices/BOHEMIA_MAP_CURRENT.html, untouched) from its own camera, the recorded desert under it at the map's level, A
  NIGHT FREIGHT, B HIS REPO MAN as the map plays it now, C NO SONG, STOP, a line naming the bar, the part and the key.
- THE LOCK: its own new_songs line in records/BOHEMIA_SONG_LOCK.json (song lock 23/0).
- THE CUE: CUE 7.5 in BUILD_CALLING_SCRIPT.md, RUN's, on his YES: the map's NIGHT shuffle gets one more song beside his
  six, 128 s a pass, back to the shuffle and the street's rest. Its drums are late in the data, so MUS.drumsHeld is not
  asked.

## MEASURED (offline render in Chrome, 44.1 kHz)

- Peak -5.40 dBFS, no compressor; 856 notes; quietest bar -23.8 dB (bars 1 to 4: bass and motif, no drums yet).
- The tune at 8.05 s (bar 5), the first drum at 16.05 s (bar 9). D5 587.5 Hz at bar 5, F5 698.5 Hz at bar 9 where his
  SONG_ROOT moves the song to B flat.
- Above 8 kHz: 26.5 dB under the whole. Largest sample-to-sample jump 0.261 (the chip's own noise), no click.
- Through a phone's speaker: the tune -26.2 dB, the echo and motif -37.2 (11 dB under; the first take was 20 dB under,
  inaudible, and was raised before anything shipped), the bass -36.4, the drums -32.8.
- In the game, the street plays his songs through MUS's master and the settings bus, and the chip song plays wherever RUN
  routes it; the page matched them by a phone's ear, and CUE 7.5 says the same target in the alpha: equal loudness with
  his songs through a phone, measured at the wiring.

## GATES

- night freight 42/0 (new, gates/night_freight_gate.js, registered NIGHT FREIGHT): his form byte for byte against the
  alpha, every bar's section and key, his groove, his sections, his bass rule, the five notes, the lock, the tool's
  --check, silent until his YES, the render, the fair A/B, the page. MUTATED TWICE: a snare planted in bar 9 (39/3: the
  groove, the tool, the lock) and his SONG_ROOT's third value changed in the tool (38/4: the form, the key at bars 9 to
  12, the lock, F5 at bar 9 heard as E5); restored byte for byte.
- song lock 23/0; over the ridge 32/0; the long road 33/0 (the engine change does not move them).
- vote tab 38/1: red only on DYNASTY's two items (no 'you see it'), as before this round; this item passes rule 22f.
- gate registry 6/1: red only on the_boards_quests_are_people_gate.js (RUN TWO's, unregistered; red on main before me).

## [bb] AND THE REAL WORLD

- Battle Brothers scores its world map as a mood under long travel, not a tune per screen; the department here is the
  sound and his word 8-bit. Nothing of its music is in this song.
- The real-world practice: a music team keeps a game's songs one game by a shared form and palette (a style guide for
  music the way rule 114 is one for pixels); his form already is that guide, so it was used as one.
- The finding that proves us wrong: two rounds of new songs were measured against the chip's numbers and never against
  his songs. The difference he heard is countable in notes per bar, and nobody had counted.

## [analog horror]

In the writing, never the grain: the whole song sliding to another floor every four bars (the planed riff that never
resolves), the flat sixth hanging at the end of every phrase, the strip in D where only a kick and a low bass are left,
the beat that comes in late, and the echo of a tune in a room nobody is in.

## NOT IN THE GAME YET, ON PURPOSE

The map plays nothing new until his YES. CUE 7.5, RUN's cut (rule 93). His songs untouched and still in the draw.

## NEXT

- On his YES: CUE 7.5 (RUN). If he likes the middle ground, the title song's next version takes the same writing.
- The row's third song: the fight's, in the same middle ground.
