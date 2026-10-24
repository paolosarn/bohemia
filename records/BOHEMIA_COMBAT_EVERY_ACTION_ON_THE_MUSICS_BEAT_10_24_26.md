# COMBAT [every action on the music's beat] (rule 158, 10/24/26)

PAOLO 10/24: 'one of the most important things I said months and months ago: the combat turns are taken as requests: every
time you press a button it's a request, and the game does those actions on the BPM, everything is supposed to be on the BPM
clock of the music, and we totally lost sight of that in this revamp... if I press AUTO or I'm fighting turn by turn
manually, it's a request to be on the same BPM with any action'. Ruling record:
records/BOHEMIA_PAOLO_EVERY_ACTION_ON_THE_MUSICS_BEAT_AND_MORE_MUSIC_10_24_26.md.

## MEASURED BEFORE
- The fight (slices/BOHEMIA_FIGHT.html) cut time from its own start (UI.t0): their next act waited for onBeat(), a quarter of
  beatMs(), and beatMs() was 60000/120 over UI.speed, the hand and paceNow(). Nothing read the song.
- A tap of his played the frame it came (startAnim at `now`), on no grid at all.
- The hand's speeds were 1x / 2x / 3x and AUTO's finish 3x: a third of a beat is off every grid the song has.

## WHAT IS BUILT (all in slices/BOHEMIA_FIGHT.html; the demo loads it as it is, no cut needed)
- THE SONG IS THE CLOCK (block of that name beside beatMs()): the fight reads the shell's song transport across the frame
  every 200 ms. In order: `BOHEMIA_SONG_CLOCK()` if the shell posts one (the contract below, for SOUNDS [more music, on the
  one beat]); else the transport the shell already lends (`BULLET.clock()` = MUS's playing / nextT / step, and
  `__sfxOut().AC`), read only when the song is playing so the fight never makes an audio context; else the heartbeat's
  `__pulseNextBeat()`; else its own 120 from the board coming up (the fight opened alone, the music off). Audio time goes onto
  the fight's clock through `AudioContext.getOutputTimestamp()` (timeOrigin-shifted from the shell's page), so a beat is placed
  where it is HEARD; `SONG.lat` is the time a sound asked for now takes to reach the ear. A reading within 6 ms of the last
  keeps the old anchor, so the grid never jitters; a re-anchored song (MUS.step zeroed) moves it.
- A TAP IS A REQUEST (onTheBeat, in the director): every motion, his by hand, his on AUTO and theirs, begins when its beat
  comes round. A blow or shot LANDS on the beat (its landing, LAND_BEATS = 0.45 of its beat in, is the kick; the swing leads
  into it); a walk's first foot, a fall, a reload, a ring start on it; a note with nothing to show (a morale word, an injury,
  a fall nobody saw) takes no beat. A timer starts the motion at its time, not the next frame, and starts it SONG.lat early:
  its sounds go then, its picture is drawn from the beat (a.at), so the ear and the eye meet on the kick. The AI no longer
  waits for a quarter beat to DECIDE (that would be a second wait); it breathes an eighth and its motion waits for its beat.
- THE FEET KEEP TIME: a walk's footfalls fall every TILE_BEATS of its beat from the first, linear in time under the eased
  glide, each SONG.lat early.
- FASTER IS FINER, NEVER OFF: SPEEDS 1 / 2 / 4 and FINISH_PACE 4 (were 1 / 2 / 3 and 3); their turns stay 2x. Every grid is
  the song's beat over a power of two: a beat, a half, a quarter. A phone that kept 3 keeps the top (4). A walk he hurried
  waits only for the next quarter of the beat.
- Everything that pulses (the reload's blink, AUTO's glow `--ph`, the dead lamp, the ghost's static slots, the aura's t)
  reads the song's phase (beatPh, SONG.at), not the fight's start.

## THE CONTRACT FOR THE SHELL (SOUNDS, when it posts its clock)
`window.BOHEMIA_SONG_CLOCK = () => ({ playing, beatMs, beatAt, latencyMs })`, beatAt = a beat as HEARD on the epoch clock
(performance.timeOrigin + performance time). The fight prefers it to its own reading the moment it exists. Until then the
fight reads what the shell already lends; nothing in the demo was edited.

## PROVED
- gates/every_action_on_the_beat_gate.js (EVERY ACTION ON THE BEAT, registered). On the fight's page: a walk tapped a third
  into a beat waits and begins on the next; his blow lands on the beat; a whole AUTO fight's motions, his and theirs, on
  their grids; grids 500 / 250 (/125 at 4x); the pane 1x -> 2x -> 4x -> 1x.
- In the demo with his music on (a road fight through the map's door, seeded, AUTO): the fight reads 'song'; 30 of 30
  motions within 0.1 ms of the grid cut from the beats MUS.playStep really booked (each placed by the output timestamp of its
  own moment); every 1x blow on a booked beat; their turns' motions on the half beats. SONG.lat read 35 to 39 ms on this box.
- An earlier reading at 30 ms off was the measurement, not the fight: one end-of-fight clock mapping applied to a 20-second
  fight (the headless audio clock drifts against the system clock); the per-beat mapping removed it.

## NOT DONE, NAMED
- The music off: the fight keeps its own 120 from the board coming up (nothing to be on). SOUNDS' (c), the clock under a hum,
  is SOUNDS' row.
- The kick itself is not read: the gate checks the booked BEATS (where four on the floor puts the kick); a song with its
  kick off the beat would need SOUNDS' clock to say where.
