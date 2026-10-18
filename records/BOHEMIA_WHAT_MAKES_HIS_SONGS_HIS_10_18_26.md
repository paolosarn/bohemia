# WHAT MAKES HIS SONGS HIS (SOUNDS, 10/18/26)

Row: [the middle ground] (VAMILY, SOUNDS), its FIRST step: 'read his canon songs as music before writing a note'. Read
only, never edited (laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md; the song lock 23/0 after this round). Sources:
MLOOPS (128 rows on 10/18, not the 46 the law names), MFACTIONS (14), OVERWORLD_SONGS (the map's six night songs),
SONG_ARR, SONG_ROOT, synthV, drumV and the two players (MUS.playStep in the alpha, playStep in the fight's blob), all
pulled with the song lock's own anchors. Counts made by a script over the rows, not by eye.

## THE ONE PAGE

1. THE FORM IS ONE FORM FOR EVERY SONG. Not a song's data: the player builds it. 64 bars, 2:08, sixteen sections of four
   bars, A B B A C B D B A B C A D D B A (his 7/3 TWO MINUTE LAW, shortened to four-bar sections by his AUDITION LAW so
   the tune lands at 0:08). A is the core (bass, kick, hat, one note of the lead on beat one), B the lift (the tune
   enters, the bass jumps an octave on the second half of each half bar), C the strip (kick and bass only, no hats, no
   tune), D the full (the tune an octave up). The last bar of every section is a fill: the kick on the last four
   sixteenths. His NO HAT-RUN law: never a tick-hat riser.
2. THE HARMONY IS THE WHOLE SONG MOVING. There are no chords. Every four bars the whole song (bass, tune, motif) is
   moved to another degree of its own scale (SONG_ROOT 0,0,2,0,3,2,0,1,0,2,3,0,1,2,0,0): on REPO MAN's scale that is G,
   G, B flat, G, D, B flat, G, A... The riff is planed, the same shape on a new floor, which is why his songs drift
   instead of resolve.
3. THE SCALES ARE FIVE NOTES, DARK. 101 of 128 vibes are five notes. Minor third in 74, a flat sixth in 39, a flat
   second in 29. The map's six night songs: all five notes, on [0,1,5,6,10] (SLOW CREEP, SLOW BLEED), [0,2,3,7,8] (REPO
   MAN, THE PIT BOSS IS GONE), [0,2,4,7,9] (SATELLITE PRAYER), [0,2,3,7,9] (GHOST IN THE GRID). Three of the six sit on
   G.
4. THE GROOVE IS PATIENT. All six map songs are half time, no swing, the kick on 1 and 3 in four of six ([0,8]), the hat
   soft on 2 and 4 in four of six ([4,12]: the hat sits where a snare would, 16 dB under his kick). NOT ONE OF THE SIX
   HAS A SNARE. His BOOM kick is a sine falling 55 to 30 Hz over 0.3 s: on a phone's speaker it is nearly not there.
5. THE BEAT ARRIVES LATE. On the map the kit is held for the first eight bars of every song (MUS.drumsHeld, step < 128,
   the 9/12 rule from his anchor: 'the patience, the bass under it, the beat arriving late').
6. THE BASS IS A RULE, NOT A LINE. A song names the steps the bass plays on; the pitch is the step's place in the scale
   (scale[s % 5]), so REPO MAN's [0,7,10,12] plays root, third, root, third. In the map's songs it sits around G1 to F#2.
7. THE TUNE IS SPARSE. Two shapes on the map: CALL (eighths in every other bar, about six in ten steps sounding, a silent
   answer bar) and LONGS (two half notes a bar), three songs each. The degrees come from a hash of the song's name, so a
   tune is the same every time and nobody wrote it note by note. By his engine's own rule REPO MAN plays 5.9 pitched notes
   a bar and has a tune in 18 of its 64 bars.
8. THE COLOUR IS THE VOICE. Every song names a lead and a bass voice from a rack of 120 (coldpiano, rustlead,
   solarhymn, signalfade; powergrid, nightpad, deadsat), each a hand-built Web Audio patch. That is where his songs'
   sound lives; the notes are few.

## WHY OVER THE RIDGE SOUNDS DIFFERENT (measured, and it is not the 8-bit)

The title song has a tune in 26 of 32 bars, a sixteenth-note arpeggio in all 32, a snare in 14, seven named chords
(D minor, B flat, G minor...) and 21.8 pitched notes a bar. His REPO MAN: 5.9 notes a bar, no arpeggio, no snare, no
chords, the song moved four ways. The difference he heard is the WRITING (busy, functional harmony, a running arpeggio,
a backbeat), not the chip. So the middle ground keeps the chip and takes his writing: NIGHT FREIGHT, 9.2 pitched notes a
bar, no arpeggio, no snare, no chords, his form and his four key moves (records/BOHEMIA_NIGHT_FREIGHT_10_18_26.md).
