# THE MUSIC IN THE FIGHT NOW (SOUNDS 10/26/26, row [the music in the fight now], rule 221(a))

## HIS WORDS
"Bro, when does the music get implemented in the combat? I'm tired of it like not everything not being on the same BPM for
real like not sounding good as shit."

## WHAT WAS WRONG, MEASURED (EYES line 87, and this lane on main dbbe84b3)
- The thirteen voted-up songs were not in the game: the fight played his engine live, and the four new songs not at all.
- The turn messages reached the shell one step low: __THE_FIGHT_DRIVES_THE_MUSIC__ made their turn level 1 (`K.level` returned
  1 while `theirTurn`) and his turn whatever the kill count said (threat = level 2, two kills = 3). So their turn played 1 and his
  2, almost never 3.
- THE FIGHT'S MUSIC YOU CAN HEAR was red on main on the computer: while effects sounded the music sat at -43.3 dB under effects
  at -36.4 dB.

## WHAT CHANGED (tools/bohemia_sounds_the_songs_go_in_patch.py, the alpha and the demo, BUILD 10/26b)
- __THE_SONGS_GO_IN__ (built by the chat before this one, branch sounds-songs-in, kept) now runs on the renders already on main:
  slices/vote/songs/three_levels/ (his nine) and new_four/ (the four new), 32 bars a level, the files his cards played and he
  thumbed up. Nothing waits on the re-renders (221(a)).
- THE LADDER: the map and the towns 1; in a fight, before the first turn 2, their turn 2, his turn 3. A kill, a conversation or a
  crowd on the map no longer raise it (207(a)).
- THE TURN ON THE NEXT BEAT HE HEARS: the recording is already sounding, so the level changes at its next beat not yet out of
  the speaker (40 ms margin), never waiting for the transport's booking a beat ahead.
- THE DECODER'S DELAY READ OFF A PROBE (new): the hit that measured it comes with the re-renders, so a 0.5 s probe
  (slices/vote/songs/probe.mp3, one hard onset exactly 0.05 s in, the songs' own encoder: libmp3lame 96k mono) is decoded once;
  Chromium trims the encoder's padding (0 ms, at 44.1 and 24 kHz); a browser that keeps it reads the padding and every song's
  step 0 moves with it.
- THE FIGHT'S LEVELS ARE READY BEFORE ITS FIRST TURN (new, from a miss under load: one of his turns on the phone at 4x came
  1.22 s late because level 3 was still decoding): on the map the playing song's levels 2 and 3 are fetched as bytes (not
  decoded, rule 173), they decode the moment the fight's frame is in the page (9 s before the board on a slow phone), and a
  level that finishes decoding after its turn was told comes in on its own next beat. After: phone 7 of 7 turns on a beat,
  the slowest 0.45 s.
- THE HIT is struck only where a song has one (the re-renders bring it); the fight's lift stays 2.0 and the effects' trim 0.63
  until the re-rendered levels carry the gap (then 1.0 and 0.5, as the branch had it).
- THE BEAT ON THE GRID is now read as a fold first and a rise after: the recording's loudness in 2.5 ms frames folded on the
  eighth from where the player puts step 0, then the steepest rise. The old reading (onsets per 5 ms frame, the biggest bin)
  read 50 to 250 ms "off" on files that are on the grid (a beat-synchronous average of THE VAULT's level 3 rises inside 10 ms of
  every beat); the new one reads 0 to 7.5 ms on every level of his nine.

## MEASURED ON THE LIVE DEMO (gate THE MUSIC IN THE FIGHT NOW: node gates/the_songs_go_in_gate.js --now)
- computer: 9/0. The map plays SLOW CREEP's level 1 from its recording, 12 s never silent; a road fight on AUTO: 7 turns, all 7
  heard on a beat (slowest 0.21 s); a song from the fight's first frame (2.6 s frame to board, 0 silent windows); never a jump,
  never silent (160 windows); back to 1 after.
- phone at 4x: 10/0. CAMPFIRE CONFESSION; 9 turns, all 9 on a beat (slowest 0.73 s); 9.0 s frame to board, music all the way;
  the beat 7.5 ms off the grid at 24 kHz; his turn 6.6 dB over theirs in that fight (the old renders' sections vary: on the
  computer's fight it read -0.9 dB, which is the job of [the songs go in, his turn hits hard], the re-renders).
- Other gates on this tree: THE FIGHT DRIVES THE MUSIC 10/0 (COMBAT's; two legs moved to 207: a kill moves nothing, his turn
  after a kill is the top; YOU HEAR IT asks 4 dB on the master once the re-renders are in, printed until then), THE FIGHT'S
  MUSIC YOU CAN HEAR 11/0 (red on main, 10/1), INTENSITY WIRED 24/0, THREE LEVELS IN THE VOTE TAB FIRST 218/0, FOUR NEW SONGS
  106/0, DEMO BUILD 25/0. Red on main before this change and still red, not this change's: FIGHT MUSIC 43/8 (the streets'
  hand-over and the sting; main 42/9, this change fixes its kill leg), ONE SONG ONLY 14/2 (the same two legs on main),
  DEMO CURRENT 15/1 (the dead walk pad; main 14/2).

## STILL OWED (the next rows, in order)
- [the songs go in, his turn hits hard] (207): the re-renders (64 bars, level 3 at least 6 dB over 2 on a phone, the tune in all
  three, the hit), swapped into the same folders; the book picks them up on a re-run of the patch, and the lift moves to 1.0.
- [one beat for everything] (221(b)): one audio clock for the music and every effect, corrected for the output latency.
- EYES listens in three live fights (rule 179, line 143).
