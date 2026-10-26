# THE SONGS GO IN, AND HIS TURN HITS HARD (SOUNDS 10/25/26, rule 207; with rules 175(b) and 193)

STATE 10/26 (SOUNDS, the next session): THE GAME'S HALF IS ON MAIN with the renders there were (rule 221(a),
records/BOHEMIA_THE_MUSIC_IN_THE_FIGHT_NOW_SOUNDS_10_26_26.md): the player, the ladder, the turn on the next beat. THE FILES
BELOW (the 64-bar levels with the gap and the hit) WERE NOT YET RENDERED when this record reached main; the numbers in
THE MUSIC are the tool's targets until the re-render lands and this line is replaced by the measured ones.

## HIS WORDS
"I like the songs I want you to implement them however one thing though... there has to be a pretty big difference between
the opponents turn and my turn... I can't just be like one quiet ass thing that's the difference between their turn and your
turn."

## WHAT WAS WRONG, MEASURED
My first cards (records/BOHEMIA_THREE_LEVELS_IN_THE_VOTE_TAB_SOUNDS_10_25_26.md) had their turn to his turn at 1.2 to 3.0 dB
through a phone (THE VAULT -32.4 / -30.0). Two causes: level 2 carried his engine's second tier (for seven of his nine songs
that tier is a second melody line: a lead) plus a kit, so it was already most of level 3; and the parts were set by guessing
gains, then pulled down together when level 2 sounded like a fight.

## WHAT CHANGED IN THE MUSIC (the thirteen re-rendered; the VOTE cards play the same files)
- LEVEL 1, THE MAP: as approved. His nine: his song as the map plays it plus the soft 120 pulse, now over the WHOLE 64-bar
  pass the game plays a song for (128 s; the cards were 32 bars). The four new songs: the approved level_1.mp3 is not touched
  (its re-render measures 0.00 dB from it).
- LEVEL 2, THEIR TURN, TENSION ONLY: his tune, his accents and his kit are held back (counted, never sounded); only his bass
  voice and his pads play, with a heartbeat kick on the beat, the clock ticking, a low pedal in 8ths and his chord held a bar
  at a time. The new songs: the tune waits, the chord is held, the kick on the beat and the ticking, the bass pushing.
- LEVEL 3, YOUR TURN, EVERYTHING: his top tier with his tune, the full kit (the backbeat, the 16th hats, a hit on each phrase),
  the driving bass and the hook in his own lead voice; the new songs' tune doubled an octave with the full kit and the fill.
- THE GAP IS SET BY MEASURING, BY TWO EARS: one gain per level and a true peak limit at -0.5 dBFS, iterated until level 2 is
  at least 3.6 over level 1 and level 3 at least 6.8 over level 2 BOTH through a phone's speaker (two 350 Hz high-passes) AND
  on full-range speakers (ITU-R BS.1770 K-weighting, LUFS: a computer, his car on Bluetooth). WHY TWO: THE VAULT's first take
  of the new level 2 was +3.6 dB on a phone and 2.5 LU UNDER the map on full range (the ticking carried the phone, the low end
  was gone); measured with ffmpeg's ebur128 too (-26.5 / -29.0 / -17.5 LUFS). Level 2 was rebalanced (the chord and the pedal
  up, the tick down) and both ears now decide.
- THE HIT (207(c)): a one-shot in the song's own kit and bass at level 3's gain, struck on the beat the turn comes back to him.

NUMBERS: see THE THIRTEEN below.

## WHAT CHANGED IN THE GAME (tools/bohemia_sounds_the_songs_go_in_patch.py, the alpha and the demo)
__THE_SONGS_GO_IN__: the thirteen play from their recordings. The transport still books every sixteenth on the 120 beat (the
one grid: THE ONE BEAT, the fight's beat, the street's turns); on each step it books, the recording at the level the game's
intensity asks for is checked to be sounding at exactly that step's place.
- THE LADDER (207(a)): the map and the towns 1; a fight: the formation 2, their turn 2, his turn 3; the 8/26 talking and crowd
  triggers no longer raise the map.
- THE TURN ON THE NEXT BEAT HE HEARS: the transport books a beat ahead, so waiting for its booking put the change 0.55 to
  0.97 s after the turn (MEASURED, computer); the recording is already sounding, so the level changes at the song's next beat
  not yet out of the speaker (40 ms margin): MEASURED 0.06 to 0.47 s, every change on a beat, a hit into 3, a 15 ms drop out.
- RENDERED AHEAD (175(b)): the recordings play in the audio thread; a stalled main thread books nothing and the music plays on.
- MEMORY (173): only the playing song's levels decoded (the map: level 1; a fight: 2 and 3, level 1 let go once 2 is in), the
  next song's level 1 a phrase early (its bytes only in a fight); on a phone the recordings decode at 24 kHz.
- THE FOUR NEW SONGS JOIN THE ROTATION: a row each in MLOOPS with no notes, OVERWORLD NIGHT in CAT_DEFAULTS, CANON in
  CANON_DEFAULTS; the street, a fight and the song after a battle draw them; the opening never opens on one.
- Until a recording is decoded his song plays from his engine live, as before; the swap lands on a beat.
- THE FIGHT'S LIFT: the music was lifted 6 dB in a fight (2.0) to sit over the effects; the levels carry that now, so the lift
  is 1.0 and the effects come down 6 dB (0.5) instead of 4.

## GATES
gates/the_songs_go_in_gate.js (new, in the suite as THE SONGS GO IN); gates/the_vote_cards_play_gate.js (new, rule 193);
three_levels_vote_gate.js and four_new_songs_gate.py now require the game to play them (207); the_fight_drives_the_music_gate.js
(COMBAT's) moved to the 207 ladder (their turn layers 2, his 4) and hears the level on the master, not in notes built a step;
one_song_only_gate.js hears REPO MAN's machine party in its recording.
