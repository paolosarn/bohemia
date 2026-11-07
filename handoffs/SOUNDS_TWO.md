# SOUNDS TWO -- the handoff block (written only by SOUNDS TWO; chat 08b, opened 11/7 by the coordinator for rule 427(a))

SOUNDS TWO (sounds-two-01gkdyuw, session_01GKDyuvGoQW16Ah4aF581f6): 11/7 LATEST -- BUILD 11/7za THE FIGHT AS YOU HEAR IT, BUILT, NOT
YET SEEN (rule 427(a), asks 47, 88, 127, 212; row [the songs go in, his turn hits hard]). Record:
records/BOHEMIA_SOUNDS_TWO_THE_FIGHT_AS_HE_HEARS_IT_11_7_26.md.

WHAT HE HEARS (TAB: VOTE, the card THE FIGHT, AS YOU HEAR IT; and every fight in the DEMO):
his turn now comes in 7 to 8 dB over theirs through a phone (it was 1 dB, once his turn was quieter); the full kit and the
lead only on his turn with a hit on the beat it comes back; the music is there from the fight's first frame to the end
screen; the shots and blows land on the beat; and the fight moves at one pace, a motion every beat, no random extra beat.

WHAT WAS WRONG, MEASURED OFF THE AUDIO (four sample-exact ears on the demo's own audio graph, the real road fight):
- the thirteen songs in the game were the first 10/25 cards: level 3 only 1.0 to 5.8 dB over level 2, no hit; the re-renders
  the 10/26 record owed were never made;
- the dialogue duck took 9 dB off the music under every bark, and his crew calls his own shots on his turn: his turn sat
  under the duck more than theirs;
- the music reached the output twice from the first dive on (MOTION's hum went in beside the fight's lift, not after it):
  +6 dB, and the hum never hummed;
- a coin flip between two motions: the grid anchor's tenth-of-a-millisecond jitter cost a whole beat at random (12 of 37
  pairs on the computer, 26 of 53 on the slow phone): 'it speeds up and slows down';
- the fight's sounds had no moment on them: the shell put a late one on the NEXT sixteenth (23 of 86 blows 125 ms late) and
  on the slow phone an on-time one on the sixteenth BEFORE (60 of 62 blows);
- the fight's first frames played the map's level (a song's quiet first bars, -65 dB) until the board was up.

WHAT IS BUILT:
- THE THIRTEEN RE-RENDERED (tools/bohemia_sounds_three_levels.js, tools/bohemia_sounds_four_new_songs.js): level 3 at 7.8 dB
  over level 2 by measuring (bar by bar the gap moves 2 dB around its mean, so 6.8 could hear under 6), the tune in all
  three, the full kit and the drive in 3 only, the hit; 32 bars as before; LEVEL 1 IS HIS APPROVED FILE byte for byte.
- THE GAME (tools/bohemia_sounds_the_songs_go_in_patch.py, the alpha and the demo): the book with every hit, the fight's lift
  1.0 and the effects' trim 0.5 (the levels carry the gap now); level 2 from the fight's frame in the page; no duck in a fight.
- THE FIGHT'S CLOCK AND SOUND (tools/bohemia_sounds_two_the_fight_on_the_beat_patch.py, slices/BOHEMIA_FIGHT.html, marked
  __SOUNDS_TWO_ON_THE_BEAT__, no board code): a chained motion takes its grid point within 8 ms (GRID_SNAP_MS); every motion's
  sound carries `at`, the moment it is heard on the song's nearest sixteenth; a motion's timed sounds go ahead (80 ms, three
  frames on a slow device, up to 300) while what is seen and said at the landing keeps its moment (onTime).
- engine/bohemia_haptics.js: a fight sound's buzz waits for its `at`. slices/bohemia_motion.js: the hum goes after the lift.
- THE INSTRUMENT: tools/bohemia_sounds_two_the_fight_heard.js (--record writes the end of the chain as a file).
- THE GATE: gates/the_fight_as_he_hears_it_gate.js (in the suite), with THE PLANT (four faults at once, each leg must go red).
- COMBAT's gates re-aimed to the new contract: EVERY ACTION ON THE BEAT leg 6 reads the lead; THE FIGHT DRIVES THE MUSIC leg 4
  lifts from the fight's frame and leg 9 reads the level really sounding; those two and THE FIGHT'S MUSIC YOU CAN HEAR start
  their demo fight on the open road (the demo's start spot is a Mob fortress since 11/7o: no road fight comes up there).
- THE CARD: slices/BOHEMIA_THE_FIGHT_AS_YOU_HEAR_IT_11_7_26.html, registry id sounds2-the-fight-as-you-hear-it-11-7.

SAID OUT LOUD:
- MEASURED (the gate, this tree): his turn over theirs, the music through a phone, 7.0 dB (phone), 7.2 (phone at a quarter
  CPU), 7.7 (computer by hand), 8.3 (the card's fight); blows on a beat 114/114, 66/66, 81/81, 78/78; beats lost 0 of 58 on
  the phone; music never silent from the first frame to the end screen; THE PLANT caught by all four legs.
- On his phone's profile with the CPU four times slower, the page's thread is so busy (frames 50 to 200 ms) that 57 of 131
  fight sounds and 15 of 43 choices still come late; that is the thread, routed to PLUMBER with the numbers (the gate
  reports it on that run and holds it on the others).
- The end of the chain (effects and all, after the master compressor) hears his turn about 4 dB over theirs: the shots are
  as loud on both turns. The ask is the music's; the music measures 7 to 8.
- A drawImage TypeError in the fight's drawing on the quarter-speed CPU (COMBAT's, ask 229): named in the gate.
- A fall's sound goes the moment its motion starts (no lead): one or two in a fight land 30 to 45 ms late.

NEXT: EYES hears it on his phone (88, 127); PLUMBER the slow phone's thread; COMBAT the camera's hold before an off-glass man;
this lane: the reload's recording opens 30 ms into its slot (a lead per kind in the guns' player); the after-battle song starts on
its own quiet first bars (the four new songs' intros read near -60 dB on the end screen once in a slow run).
PENDING Paolo: nothing.
[bb Battle Brothers keeps one battle track and never changes it on a turn; ours changes on every turn, on the beat, so the beat
must never slip under it.]
[analog horror: his turn is the tape running hot, the limiter working 4 to 8 dB; their turn the same tape with only the
heartbeat and the ticking clock left on it.]
