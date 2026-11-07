# THE FIGHT AS HE HEARS IT (SOUNDS TWO, 11/7/26, rule 427(a); asks 47, 88, 127, 212)

## HIS ASKS, FOR MONTHS (records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, every one HALF by EYES)
- 47 (rule 158): 'every time you press a button it's a request, and the game does those actions on the BPM... if I press AUTO
  or I'm fighting turn by turn manually, it's a request to be on the same BPM with any action'.
- 88 (rule 168): 'I only hear the sound effects... I'm not hearing any music'; music in every fight, 120 BPM you can hear.
- 127 (rule 207): 'I like the songs, I want you to implement them; there has to be a pretty big difference between the
  opponent's turn and my turn... it can't just be one quiet thing'; at least 6 dB, the full drums and the lead only on his turn
  (the coordinator's correction 10/25: the tune in all three, the full kit and the drive only in 3).
- 212 (rule 274): 'when I do the auto combat it's not the same pace, it speeds up and slows down however it wants... do the
  math, it has to go to the BPM, we need a formula for it'.

## THE INSTRUMENT: OFF THE AUDIO, NOT OFF THE CODE'S WORD
Every check before this one read a log the code wrote about itself (when the fight began a motion, when the shell booked a
sound). tools/bohemia_sounds_two_the_fight_heard.js listens to the audio graph inside the demo, on the real road fight
through the map's own door (the open road, seeded), with four sample-exact ears (AudioWorklets on the game's own context,
every 128-frame block stamped with the frame it renders): the music after his slider and the fight's lift; the same through a
phone's speaker (two 350 Hz high-passes); the effects bus after the fight's trim; the end of the chain (the brickwall)
through a phone's speaker. The grid is the beats the transport really booked (__beatNext, every 100 ms on the audio clock).
An effect's onset is the first 2.7 ms block 9 dB over the 21 ms before it; it is matched to the sound the shell booked for it.

## MEASURED BEFORE (main cc248f0e, BUILD 11/7j)
| | computer, AUTO (seed 11) | his phone's profile at 4x, AUTO (seed 7) |
|---|---|---|
| his turn over theirs, music through a phone | 0.9 dB (GHOST IN THE GRID / THE CHURCH CLOCK) | -3.6 dB (THE SODA MACHINE): his turn QUIETER |
| the end of the chain, effects and all | 1.9 dB | -1.4 dB |
| the old gate's reading (THE SONGS GO IN) | 1.6 dB | 2.0 dB |
| fight sounds heard within 20 ms of the song's grid | 89 of 110 | 89 of 99 |
| blows heard within 20 ms of a beat | 63 of 86 (the rest 123 to 130 ms LATE) | 2 of 62 (the rest 120 ms EARLY) |
| pairs of motions with a beat lost for nothing | 12 of 37 | 26 of 53 |
| the song's own beat on the grid | 2.9 ms | 5.8 ms |
| silent 100 ms windows from the fight's first frame | 19 (the map song's quiet first bars, -65 dB) | 11 |
The thirteen files themselves (fresh off the mp3, through a phone): level 3 over level 2 was 1.0 to 5.8 dB in all thirteen;
none reached 6. The bigger-gap re-renders the 10/26 record named as owed were never made; no song had its hit.

## THE CAUSES, EACH MEASURED
1. THE GAP WAS NEVER IN THE FILES. The renders in the game were the 10/25 first cards (made 10/25, no 'remade', no hit). The
   render tools already set the gap by measuring (level 2 at level 1 + 3.6 dB, level 3 at + 10.4 through a phone, a true peak
   limit) but had not been run since rule 207. In the game a turn samples a few bars of the song, so a 2 dB file gap read 0.9
   in one fight and -3.6 in another.
2. A COIN FLIP BETWEEN TWO MOTIONS (212). The next motion's beat is the first grid point at or after the last motion's end
   (songGrid, a ceiling with 0.0005 ms of tolerance). The grid's anchor (SONG.at, re-read from the one beat five times a
   second) moved by a tenth of a millisecond each read (measured -0.11 to +0.08 ms over 70 motions). When it moved earlier,
   a motion ending exactly on a beat 'ended after it' and the next one waited a whole beat: two attacks back to back came 1.00
   beats apart one time and 2.00 the next, at random. That is 'it speeds up and slows down'.
3. A SOUND WITH NO MOMENT ON IT (47). The fight's timers send a sound the way to the ear ahead of its picture and never say
   when it is to be heard; the shell's one beat books it 'now' if it comes within 12 ms after a sixteenth, else on the NEXT
   sixteenth. A timer 13 ms late put a blow 125 ms after its beat (the computer). On his phone's profile the audio clock moves
   in big render blocks, so a sound that came on time read 134 to 200 ms early and went on the sixteenth BEFORE its beat.
4. THE FIGHT'S FIRST FRAMES PLAYED THE MAP'S LEVEL (88). The ladder stayed at 1 until the board was up (2.3 s after the
   frame on the computer, 6.5 to 9 s on his phone at 4x); a map song still in its quiet first bars played -65 dB there.

## THE FIXES
1. THE THIRTEEN RE-RENDERED WITH THE GAP AND THE HIT (tools/bohemia_sounds_three_levels.js, tools/bohemia_sounds_four_new_songs.js,
   both by measuring; level 2 at level 1 + 3.6 dB, level 3 at level 2 + 7.8 through a phone, then a true peak limit): 32 bars as before (the cards he thumbed; 64 would add 40 MB against the 900 MB publish cap). LEVEL 1 IS
   THE FILE HE APPROVED, byte for byte (the three-levels tool now keeps it; the re-render of his engine matched it to -39 dB).
   Every song now carries its hit, so the game's lift moves to 1.0 and the effects' trim to 0.5 (the songs-go-in patch reads
   it off the book). SLOW BLEED and SLOW CREEP now play at the gain they were recorded down by (+6.02 dB, play_gain_db): on
   the map they had been 10 dB under the others since the recordings went in.
2. THE FIGHT ON THE BEAT (tools/bohemia_sounds_two_the_fight_on_the_beat_patch.py, slices/BOHEMIA_FIGHT.html, marked
   __SOUNDS_TWO_ON_THE_BEAT__, the fight's clock and sound only, no board code): a motion chained to the one before takes the
   grid point within 8 ms before its ask (GRID_SNAP_MS; a fresh tap still begins on the next beat); every sound sent while a
   motion plays carries `at`, the moment it is heard, on the song's nearest sixteenth; the sounds on a motion's own timers go
   ahead with that moment (80 ms, three of the device's frames on a slow one, up to 300), so the shell has them before their
   beat and books them to the sample; what is seen and said at the landing (the strip, the crew's call, the ladder's hit, the
   dry click's blink) keeps its own moment. COMBAT's EVERY ACTION ON THE BEAT reads the lead (its leg 6).
3. THE FIGHT FROM ITS FIRST FRAME: the fight's frame in the page brings level 2 (the heartbeat on every beat) in on the next
   beat, once per frame; the end settles it as before. COMBAT's THE FIGHT DRIVES THE MUSIC leg 4 re-aimed to the frame.
4. NO DUCK IN A FIGHT, THE HUM IN SERIES, THE TILE AS `tile`, THE BUZZ ON ITS MOMENT (causes 5 and 6 below).

## TWO MORE CAUSES, FOUND WITH THE SAME EARS AFTER THE RE-RENDER (the files had the gap and the game still did not)
5. THE DUCK ATE HIS TURN. The dialogue duck (8/15: -9 dB on the music for as long as a line runs) fired on every bark in the
   fight, and his crew calls his own shots on his turn (rule 143(c)). Read every 100 ms: the duck at 0.35 for about 1.5 s,
   again and again; level 3 played 8 to 17 dB under its file against level 2's 8 to 12. A 6.8 dB file gap was heard as 3.5.
   FIX: in a fight (its frame in the page to its settle) the music does not duck; a line still ducks it everywhere else.
6. THE MUSIC PLAYED TWICE. MOTION's hum (11/7, a low-pass for the dive) put itself after his slider, but the fight's lift
   already sat there: the hum went in BESIDE the lift, so from the first dive on the music reached the output by two roads
   (+6 dB; muting the lift took the output down 4.5 dB, not to silence), and the hum never hummed (the full song came the
   other way). FIX: one line in slices/bohemia_motion.js: the hum goes after the lift, in series.
And the gap's margin: bar by bar a song's gap moves 5.8 to 8.8 dB around its mean, so a turn that hears a few bars could fall
under 6 (measured 6.3 dB on his phone with the 6.8 renders). The thirteen were rendered once more with level 3 at 7.8 dB over
level 2 (the files now 7.8 to 9.2). And a gun's facts carried the target's tile as `at` ({x, y}, read by nothing in the shell),
which clobbered the moment on every shot and landing: the tile rides as `tile` now. The buzz in the hand (engine/bohemia_haptics.js)
waits for a fight sound's `at` (the table's wait_for_at_ms, 1500), so the hand and the ear meet on the beat.

## MEASURED AFTER (gates/the_fight_as_he_hears_it_gate.js on this tree, 22 of 24 on the first full run; the two reds below fixed)
| | his phone's profile, AUTO | his phone at a quarter of its CPU, AUTO | the computer, BY HAND |
|---|---|---|---|
| music from the first frame to the end screen | 0 silent quarter seconds of 275 | 0 of 251 | 0 of 279 |
| every turn heard as its level within 1.2 s | 27 of 27 | 21 of 21 | 20 of 20 |
| his turn over theirs, the music through a phone | 7.0 dB (GHOST IN THE GRID) | 7.2 dB (THE PAWN COUNTER) | 7.7 dB (THE ORGAN) |
| the end of the chain, effects and all | 3.6 dB | 4.5 dB | 4.2 dB |
| fight sounds on the song's grid (of those in time) | 146 of 150 | 74 of 74 | 102 of 103 |
| blows on a beat (of those in time) | 114 of 114 | 66 of 66 | 81 of 81 |
| sounds that came to the shell after their moment | 12 of 162 | 57 of 131 (the thread) | 10 of 113 |
| beats lost between two motions | 0 of 58 | 15 of 43 (the thread) | theirs 0 of 22 |
The card's own fight (the computer on AUTO, REPO MAN): 8.3 dB, blows 78 of 78 on a beat, 0 of 32 beats lost.
THE PLANT, the same run with four faults at once: A caught (7 silent quarter seconds), C caught (his turn never heard at 3),
D caught (blows 0 of 69 on a beat, every one 95 ms off), E caught (their grid 250 ms beside his 500).
The two reds of that first run, fixed in the gate before shipping: BY HAND, the first motion after his own turn waits for his
turn to end (his thumb's, like his own moves: excluded); on the quarter-speed phone the fight's drawing threw drawImage
TypeErrors (a sheet let go while a frame draws it): COMBAT's, ask 229, named in the gate and never counted as this gate's.

## THE GATE
gates/the_fight_as_he_hears_it_gate.js (in the suite as two entries under its ten-minute cap: --fast and --rest): the thirteen files' gap and kit; then three demo fights (his phone's
profile at 4x on AUTO, the computer on AUTO, the computer BY HAND with every turn of his asked for at a random moment off the
beat), each read for A music from the first frame to the end screen, B the three levels and every turn heard, C his turn at
least 6 dB over theirs through a phone, D every action on the beat off the audio, E one pace; then THE PLANT: one more fight
with four faults at once (his turn at level 2, every sound 90 ms off, their turns at double pace, two seconds of no music),
and A, C, D and E must each go red on it or the gate fails.

## THE OTHER GATES ON THIS TREE (main 49bc7f24 and these two commits)
- THE SONGS GO IN 86/0, the full gate now (the gap and the hit counted; the suite runs it without --now from this commit).
- ONE PACE ON THE BEAT 11/0. THREE LEVELS IN THE VOTE TAB FIRST 202/0. FOUR NEW SONGS 106/0. YOU FEEL IT 24/0.
  DEMO BUILD 25/0. PAGES PUBLISH 28/0 (864 MB of 900). HANDOFF 10/0. THE VOTE TAB 62/4: the four are main's own (two DYNASTY
  cards' why, and the alpha's landing on VOTE), measured the same on 173d8b97 by ECONOMY.
- EVERY ACTION ON THE BEAT 8/0 and THE FIGHT'S MUSIC YOU CAN HEAR 11/0 once their demo legs start on the open road (below).
- THE FIGHT DRIVES THE MUSIC: its leg 9 (YOU HEAR IT, his turn 4 dB over theirs on the full-band master) counts now the songs
  carry their hits, and read 2.8 dB: it binned the master by the arrangement of the step the transport BOOKED, a beat after the
  level really changed (turnNow changes it on the next beat not yet heard), so with turns of one to three beats each turn's
  first beat went to the other side. Re-aimed to the level really sounding (SONGBOOK.switches), 0.3 s after each change; the
  booked-step reading is still printed.
- EVERY ACTION ON THE BEAT, THE FIGHT DRIVES THE MUSIC and THE FIGHT'S MUSIC YOU CAN HEAR went red on main's tree for a reason
  outside the sound: since 11/7o the demo's start spot is a Mob fortress block, and a road fight called there never comes up
  (measured: no fight frame in 120 s, no page error). Their demo legs now set the party on the open road first, as THE SONGS
  GO IN always did (four lines each, the harness only); routed: RUN and WORLD THIRTEEN (the start spot), not fixed here.

## STILL OWED, ROUTED
- COMBAT: a motion still waits for the camera when the next man is off the glass or a new round is framed (thinkAhead's
  roundFit and framed holds): measured as the rare long idle (4 beats once in 37 pairs on the computer, before). And the
  drawImage TypeError on a quarter-speed CPU (ask 229).
- PLUMBER: on his phone's profile at a quarter of its CPU the page's thread runs 50 to 200 ms frames; 57 of 131 fight sounds
  and 15 of 43 choices came after their moment (a sound sent up to 300 ms ahead still waits for the thread to run its
  message). On the phone's profile at full speed it is 12 of 162 and 0 of 58.
- A fall's sound goes the moment its motion starts (no lead): one or two in a fight land 30 to 45 ms late.
- SOUNDS: the reload's recording (the guns' reload slots, engine/bohemia_guns_heard.js) opens about 30 ms into its slot, so
  every reload is heard 29 to 35 ms after its moment however it is booked: a lead per kind for the reload slots. The gate
  counts the reload apart and names it.
- MOTION: the way into a fight pulls the music down through a 190 Hz low-pass while the camera comes down (his card 11/7);
  through a phone's speaker that is silence for its second. Measured on the end of the chain, not counted in leg A (the ear
  on the music is before it); MOTION's call whether the hum keeps the heartbeat.
- EYES: an ear test on his phone (88, 127): the gap now measures over 6 dB off the audio; a phone speaker is the last mile.
- 270 (THE BEAT IS SEEN, the Bluetooth lag): the sound now lands on the audio clock's beat exactly; a car's Bluetooth adds its
  own delay after it, which only a calibration knows.

[bb Battle Brothers keeps one music bed under a whole battle and changes nothing on a turn; ours changes on every turn on the
beat, so the beat must never slip under it.]
[analog horror: his turn is the tape running hot (the kit and the drive, the limiter working 4 to 7 dB); their turn the same
tape with only the heartbeat and the ticking clock left on it.]
