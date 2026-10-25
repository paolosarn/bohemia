# HIS SONGS AT THREE LEVELS, IN THE VOTE TAB FIRST (SOUNDS 10/25/26, rules 167, 168, 181)

## HIS WORDS
"one intensity on the map or chilling, two when they're attacking, three when it's your turn to attack, real combat music";
"everything at 120 BPM... it doesn't have tempo, doesn't intensify"; and, over both, rule 181: "don't forget about the
alpha voting system, but I still want to hear if it's something I even want... I hope you're not telling it to go
immediately into the game without me hearing it."

## WHAT WAS MADE
One VOTE card per song he plays. Each card plays his song, by his own engine, at:

| level | when | what is in it |
|---|---|---|
| 1 THE MAP | the map, a town, chilling | his song exactly as approved (his recording's own pass, his gain), plus a soft 120 BPM pulse: his own kick on every beat and his clock tick on the 8ths, quiet (rule 168(a): never a beatless hum). On a phone the clock is what is heard of it. |
| 2 THEIR TURN | the enemy's turn | tension: his engine's second tier (MUS.layers 2, the song's own klay style), a heartbeat kick on every beat, ticking 16ths, a low pedal on the root in 8ths in his bass voice, a tom on the off-beats, a rim roll into each phrase. No backbeat: it waits. |
| 3 YOUR TURN | his turn to attack | real combat music: his engine's top tier (MUS.layers 4), a driving kit (kick with pickups, clap and knock on 2 and 4, 16th hats, a hit on each phrase), a bass in driving 8ths with the octave jump, a two-bar hook in the song's own lead voice that answers itself and lifts on the fourth bar, in his key and moving with his key changes. |
| A FIGHT | the turns changing | 20 bars from bar 9 (where his beat has arrived on the map): the map, their turn, your turn, their turn, your turn, four bars each, every change on the bar line with a 40 ms crossfade. |

ONE TIMELINE: every level is rendered from step 0 of the same song, so bar N of level 1, 2 and 3 is the same bar in the same
key. On the card a level tapped mid-song changes on the next bar line and the song never jumps. That is also rule 175's
render-ahead (each song's three levels rendered once, the change a crossfade on the bar), proven on the card before it goes
anywhere near the game.

Every added part is one of his engine's own voices (drumV, synthV): no sample, no noise recipe, nothing new to his machine.
Levels 2 and 3 go through a gentle limiter so the added kit never clips his song; level 1 never does.

## THE NUMBERS (THE VAULT, card 1)
Through a phone's speaker: level 1 -36.8 dB (his recording -37.4: the pulse adds 0.6), level 2 -32.4, level 3 -30.0, the
fight run -31.6. None clipped. THE FIRST TAKE WAS WRONG AND WAS MEASURED WRONG: the parts at 0.55 to 1.0 put level 2 5.3 dB
and level 3 8.6 dB over level 1 on a phone (their turn as loud as a fight); pulled down and re-rendered.
The 120 BPM pulse, measured in the audio (the onset envelope's autocorrelation at 0.5 s against every lag from 0.3 to 0.9 s
that is not a 16th): 3.9x, 5.0x, 37.8x, and 10.3x in the fight run.
The card plays on a phone profile and a computer profile: level 3 tapped at 2.6 s lands on the bar line at 4.05 s, A FIGHT
plays its turns, STOP stops, the page asks for playback latency.

## NOT IN THE GAME
Nothing in the alpha or the demo changed (181(d)); the gate refuses either naming the three levels. The game keeps playing
his approved songs as approved until he says a level joins.

## TOOLS AND GATE
- tools/bohemia_sounds_three_levels.js record "<his song>" | register "<his song>" --write
- slices/vote/songs/three_levels/<song>/{level_1,level_2,level_3,a_fight}.mp3 + measured.json; index.json
- the card page: slices/BOHEMIA_THREE_LEVELS_10_25_26.html (template), one copy per song naming it
- gates/three_levels_vote_gate.js, in the suite as THREE LEVELS IN THE VOTE TAB FIRST

## THE CARDS, ALL SEVEN (registry ids sounds-three-levels-<song>-10-25)
| song | phone rms L1 / L2 / L3 (dB) | the beat repeats (of its energy, high end) L1 / L2 / L3 / fight |
|---|---|---|
| THE VAULT | -36.8 / -32.4 / -30.0 | 0.34 / 0.34 / 0.44 / 0.44 |
| GHOST IN THE GRID | -35.5 / -31.4 / -30.4 | 0.30 / 0.42 / 0.64 / 0.49 |
| SATELLITE PRAYER | -41.2 / -37.1 / -31.4 | 0.33 / 0.37 / 0.35 / 0.42 |
| THE PIT BOSS IS GONE | -37.3 / -33.0 / -30.8 | 0.28 / 0.40 / 0.51 / 0.47 |
| THE ORGAN IN THE DROWNED CHAPEL | -36.0 / -31.6 / -30.5 | 0.17 / 0.24 / 0.43 / 0.35 |
| CAMPFIRE CONFESSION | -38.7 / -33.3 / -30.2 | 0.33 / 0.25 / 0.39 / 0.29 |
| REPO MAN (through the game's own machine party, take A, trim -9.21 dB) | -36.7 / -33.1 / -31.9 | 0.29 / 0.31 / 0.28 / 0.34 |
| SLOW BLEED | -46.5 / -42.7 / -39.7 | 0.39 / 0.45 / 0.66 / 0.57 |
| SLOW CREEP | -45.2 / -42.1 / -39.7 | 0.17 / 0.29 / 0.55 / 0.47 |
SLOW BLEED AND SLOW CREEP, FOUR TRIES, THE LAST ONE MEASURED RIGHT: his engine plays both 'past full scale' (recorded 6 dB
down). Tried and measured wrong: the compressor (level 3 under level 1 on a phone), a 6 dB trim on the song (worse: the
phone hears its tune), no added low parts (worse again, -46.5 / -49.2 / -50.5). THE CAUSE: a DC offset, their spectral
centre at 2 to 3 Hz, under hearing; his tier 2 piles more on (full-band rms -9.2 dBFS at level 1, -1.8 at level 2 with only
a tick and a rim added), and the peak limit answered the offset and pulled down everything a person hears. Levels 2 and 3
now go through a 15 Hz high-pass in front of the limit (the centre moves to 75 to 95 Hz); level 1 is his song as approved.
All nine of his songs have their card (gate 218/0).

## FOUND ON THE WAY, MEASURED
- THE PULSE TEST WAS FOOLED BY A DRONE: the full-band onset autocorrelation put CAMPFIRE CONFESSION's beat under an
  off-grid lag on every level (0.40 to 0.54) because its drone and strum swell every 0.31 to 0.46 s. Heard through the high
  end (the clock, the hats, the kit's attack, a phone's band) its beat repeats at 0.25 to 0.39 of its energy, like the rest.
- A CARD'S SHA MUST BE ON MAIN: card 1 was registered at a local commit a rebase renamed (512d6316 -> 0538fe30); the tool
  now refuses a sha that is not on main.
- THE LIST MUST COME FROM THE CARDS: the renderer wrote all nine songs into the list between a rebuild and its commit, and
  main listed three songs with no card for about two minutes; the renderer never writes the list now.

## THE GAME FIX (181(c), not new music; straight in, BUILD 10/25r, main 0c54e493, live in pages run 3865)
MEASURED BEFORE on the demo (a road fight, AUTO, seeded; gates/the_fights_music_you_can_hear_gate.js):
| | computer | phone, CPU 4x slower |
|---|---|---|
| music while an effect sounds | -32.6 dB vs effects -31.3 | -34.1 vs -34.1 |
| the game's AudioContext asked for | nothing (10 ms base) | nothing |
| AudioContexts the fight frame made | 0 on AUTO, 1 on his first finger down | 1 |
| notes booked late in the fight | 0 of 101 | 4 of 144 (205 ms) |
AFTER (tools/bohemia_sounds_the_sound_never_chops_patch.py):
| | computer | phone, CPU 4x slower |
|---|---|---|
| music while an effect sounds | -31.7 dB vs effects -35.4 | -31.5 vs -36.2 |
| the game's AudioContext | 'playback': 23 ms base, 72 ms out | the same |
| AudioContexts the fight frame made | 0 | 0 |
| the song restarting after a stall | 0 | 0 (it re-anchored to step 0 before) |
| notes booked late | 0 of 96 | 3 of 141 (156 ms): OWED to 175(b), the music rendered ahead |
What changed: (1) latencyHint 'playback'; (2) the fight frame takes the shell's AudioContext; (3) a playing song moves on
after a stall by the time it took, on the beat, instead of starting over; (4) in a fight the music +6 dB and the effects
-4 dB over half a second, back over a bar at the end (one node after each slider; the lift alone left the song 2.2 dB
under the shots). The neighbours, run with and without it: SONG LOCK 31/0, ONE SONG ONLY 16/0, THE ONE BEAT 12/0, THE BULLET
LANDS 14/0; THE FIGHT DRIVES THE MUSIC, EVERY ACTION ON THE BEAT and THE GUNS HEARD are red on main without it too (2, 1 and
1 legs; with it 1, 1 and 1), none of them this change's.
