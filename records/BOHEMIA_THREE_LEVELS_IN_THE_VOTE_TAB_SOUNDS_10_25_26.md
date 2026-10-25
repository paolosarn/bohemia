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
