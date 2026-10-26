# ONE BEAT FOR EVERYTHING (SOUNDS 10/26/26, row [one beat for everything], rule 221(b)(c))

## HIS WORDS
"I'm tired of it like not everything not being on the same BPM for real like not sounding good as shit."

## WHAT WAS WRONG, MEASURED
- EYES line 47: AUTO's hits, swings and shots landed about 100 ms after the song's quarter beats.
- This lane, as heard (an AudioWorklet on the effects bus reading every 128-sample block at its own audio time, the
  loudness folded on the song's sixteenth from the grid the transport booked), on BUILD 10/26h before this change, the
  computer, a road fight by hand and on AUTO: the effects' steepest rise 35 ms BEFORE each sixteenth (so about 90 ms after
  the one before it: EYES' 100 ms), a smeared fold (rise 0.53); the song itself 5 ms after its sixteenth.
- WHY: the music is booked ahead on the audio clock; every effect started at the audio clock's 'now', whenever its request
  reached the shell (a postMessage from the fight's frame, a timer on a busy thread). Two clocks in practice.
- A FIRST READING OF MINE WAS WRONG AND IS NAMED: a ScriptProcessor tap read the song 27.5 ms early; its input lags its
  playbackTime by its two buffers (2 x 2048 samples = 93 ms), which wraps on a 125 ms grid to a false -30 ms. The gate reads
  with an AudioWorklet (exact block time) instead.

## WHAT CHANGED (tools/bohemia_sounds_one_beat_for_everything_patch.py, the alpha and the demo)
- ONE CLOCK: every effect asked for 'now' starts on the song's next sixteenth OF THE SAME AUDIO CLOCK the music is booked on.
  The music and the effect then reach the speaker together whatever the device's output delay (the context's outputLatency
  plus baseLatency, here 72 + 23 ms; a phone 10 to 40, Bluetooth 150 and more): that delay is the same for both, which is the
  correction 221(b) asks for: what he HEARS lands on the beat.
- HOW, WITHOUT TOUCHING ONE RECIPE: while an effect is being made, its one-shot player (playSFX, the real guns and landings
  through __sfxOut, a placed sound, a neighbour's step) puts a DelayNode of exactly (the next sixteenth - now) between the
  sound and its bus. The effect's own envelope, echoes and stops run as they always did. A bus is never wired through one (a
  sting's or a bed's bus made inside the moment would have kept the delay for good).
- Asked within 12 ms after a sixteenth, it plays at once (at most 12 ms late); no grid yet (no song ever), at once; booked for
  later ('beat', a number), as booked.
- A SOUND THAT KNOWS ITS MOMENT: a BOHEMIA_SFX message may carry `at`, the epoch ms (performance.timeOrigin +
  performance.now(), the same in every frame) where it should be HEARD; the shell puts it on the audio clock through the
  output timestamp, on the sixteenth within 20 ms of it, EXACTLY, however late the message came (as long as it came before).
  Inside the shell: BOHEMIA_BEAT.sound(ev, facts, atEpoch); BOHEMIA_BEAT.grid(t) gives the first sixteenth at or after audio
  time t. That is the clock handed to COMBAT and ANIMATION (NOTEs on their boards).

## THE GRID (221(c): 'a beat or its eighth')
The gate's grid is the transport's sixteenth, the step every note of the song is booked on. The fight's own grid is a beat
over a power of two (158(b), his: his hand 1x on the beat, their turns 2x on the eighth, AUTO's finish 4x on the sixteenth),
so the sixteenth is the finest grid an action may use; the gate prints the share on beats and on eighths.

## MEASURED AFTER (gate ONE BEAT FOR EVERYTHING, gates/one_beat_for_everything_gate.js)
- computer 7/0: the map, eight taps' ticks at random moments, all on a sixteenth (worst 0 ms); by hand (a blow and two walks
  through the calls his taps make) 7 effects, worst 0 ms; AUTO 43 effects (31 put on the grid, 12 asked inside 12 ms of one),
  worst 9.6 ms; AS HEARD the effects 12.5 ms after the sixteenth (the recordings' own attack), rise 2.04 (sharp), the song
  -2.5 ms.
- phone at 4x 7/0: the map worst 5.2 ms; by hand 7, worst 0; AUTO 122 effects (119 put on the grid), worst 11.5 ms; AS HEARD
  effects 12.5 ms, the song 5 ms.
- Before (the same gate on BUILD 10/26h, no one clock): the effects -35 ms, rise 0.53.
- Other sound gates, this tree against BUILD 10/26h side by side: BEAT FIRST, DOORS FRESH, ENDING SOUND, EVERY SOUND IS
  REACHABLE, LIT BLOCK HUMS, MIX, SFX SHUFFLE, SFX WIRED, SILENT MOMENTS, SILENT PLAY, SPATIAL SOUND, TIME PASS: the same reds
  on both (or one fewer on this tree), none new. DOORS FRESH read one more red once under the renders' load and 25/2 (the
  base's) alone.

## WHAT IS STILL OWED (named, not hidden)
- THE PICTURE: a sound asked for without `at` that comes more than 12 ms after a sixteenth waits for the next one (up to 113
  ms behind its picture). On the phone at 4x, 119 of AUTO's 122 effects were moved onto the grid. The cure is COMBAT's: send
  each blow's sounds with `at` (the moment the picture lands, a.at + its part of the beat), and put the shot and the swing on
  a sixteenth of their own (today they sit 0.1 of a fight beat before the landing, so the grid lays them on the landing).
  NOTE on COMBAT's board. ANIMATION: the keys on BOHEMIA_BEAT's heard grid (NOTE on its board).
- Voices (barks, the squiggle) are not effects in 221(b)'s list and are left as they speak.
