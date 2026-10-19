# REPO MAN, THE MACHINE PARTY: HIS SONG WITH A REAL MACHINE IN IT (SOUNDS, 10/19/26)

Row: [the machine party] (VAMILY, SOUNDS), claimed sound-opus-10-19b (8edca73e). Round one of 'the game's songs remade
one per round'.

## THE RULINGS THIS ROUND ACTS ON

- Paolo 10/19, rule 121(k): 'Remodel everything 3D grimey Crashbox analog horror machine party vibes. And the music too
  man.' The look of everything is 3D, grimy, Crashbox, analog horror, a machine party; the music is remade in that vibe
  through his songs' own machine.
- Rule 119 (Paolo 10/18, his NO on The Long Road): a song starts from his canon songs' own instruments, kits and
  arrangement, read and reused, never edited; research makes it cleaner, never a new style.
- His nineteenth votes, YES on NIGHT FREIGHT: 'Good direction not final i still like repo man alot but im fucking w it
  heavy.' The coordinator: REPO MAN and NIGHT FREIGHT are the bar.
- The coordinator 10/19: EYES is paused, say so on the card instead of waiting (rule 119c's same-game line).

## WHAT A REMAKE IS HERE

A remake keeps the song and changes the room it is played in. So REPO MAN's row is REPO MAN's row: every key deep equal
to the alpha's, the name too, because his engine draws the tune from the name's length (the rosary record proved it: a
12-letter name played COPPER DUNES' tune). His engine (MUS.playStep, synthV, drumV, his 64-bar form, his key moves, the
beat held for eight bars on the map) plays every note. What is new is a machine that plays ALONG with his engine and never
instead of it: engine/bohemia_machine_party.js listens to his engine's own drum calls and step clock and answers with
recordings of real machines. The gate proves the machine adds no note: with it attached his engine schedules the same 640
calls at the same times.

## THE MACHINE (every piece a real recording, CC0 at the source)

Cut by tools/bohemia_sounds_machine_party.py into slices/vote/songs/machine_party_kit/ (manifest.json), the clips banked
as FLAC in reference/library/sound_bank/esc50_cc0/ with their licence lines; through ESC-50 on GitHub, the one sound host
this box reaches; re-pull the originals by Freesound id before the game ships (the bank's own rule).

| part | what it is | the recording | plays on |
|---|---|---|---|
| THE PRESS | a coupling slamming between two train wagons, two strikes | felix.blume, 'On a train in Argentina, between two wagons. Metal' (Freesound 165845) | every one of his kick calls (BOOM on 1 and 3, his fills), same sample-clock time |
| THE RELAY | a Soviet electromechanical clock ticking, three ticks | ST303, 'Old Electromechanical Clock Ticking "Yantar"' (Freesound 171041) | every one of his hat calls (tight, on 2 and 4) |
| THE PARTY | the press again, on beats two and four | (the press) | his D sections only (the full): the half-time groove stamps four to the bar |
| THE STEEL | steel on steel, two strikes | felix.blume, the same series (Freesound 165845) | the and of two, every other bar, in B and D |
| THE MOTOR | a washing machine's motor on its spin cycle, whining at 199.73 Hz, steady to the hundredth for five seconds | GJOS, 'washing machine spin cycle' (Freesound 207811) | under the whole song from bar 1; slowed 1.9 percent onto G3 (195.99 Hz measured), REPO MAN's G; every four bars it changes speed by his SONG_ROOT's interval (0 0 3 0 7 3 0 2 ...): the machine changes gear when his song does; 1.6 times louder in his C sections, where the song strips to kick and bass |
| THE HALL | one concrete hall around everything | the from-a-recording tool's own modelled 'hall' (10 x 18 x 7 m, ray traced, RT60 1.70 s measured) | A only: the music 0.12 wet, the machine 0.35 wet: one grime over every part (Klubnika: 'dirty and grimy leaks to every corner, which blends everything together') |
| THE TAPE | a worn tape | the from-a-recording tool's tape numbers: +2.5 dB head bump at 110 Hz, tanh drive 1.6, wow 0.08 percent at 0.6 Hz and flutter 0.025 percent at 5.1 Hz on a delay line, 2:1 above -18 dB, a 9 kHz top | A only |

Two pieces were cut and dropped by measurement, not by ear: a steel door slam from the same train series (95 percent of
it under 350 Hz, so a phone would not hear it) and the first press cut, whose loudest sample landed 26 ms after his kick
(a flam at 120 BPM); the train hits are now cut 6 ms before their loudest sample.

NO SAND: nothing in the kit tool generates sound (the gate greps it for random and oscillators); the only hiss is the
machines'. No crush: under 0.11 percent of either take's energy sits above 5 kHz.

## THE FINDING THAT PROVES US WRONG: ON A PHONE, HIS SONGS HAVE NO BEAT

Measured on his REPO MAN as the map plays it, through a phone's speaker (two second-order high-passes at 350 Hz): his
kick and hat alone sit at -51.0 dB, 14.5 dB under his own mix. His BOOM is a sine falling 55 to 30 Hz, all of it under
the speaker; his tight hat is 45 ms of filtered noise at 0.045. The beat he wrote is there on headphones and gone on the
phone he plays on. That is the thing NIGHT FREIGHT did that he is 'fucking with heavy': its chip kick (a triangle from
110 Hz with a thump) is a beat a phone can hear (its drums -32.8 dB through a phone, the NIGHT FREIGHT record). The
machine does the same for his own song without touching it: the press and the relay put the beat back on the phone at
-39.7 dB, 11.2 dB louder than his, and his tune is still as clear as in his own (below).

## MEASURED (the three files he hears, decoded from the mp3s; slices/vote/songs/repo_man_the_machine_party/measured.json)

| | A, the machine party (hall, tape) | C, the machine party, clean | B, his REPO MAN now |
|---|---|---|---|
| made by | his engine + the machine | his engine + the machine | his engine |
| bars | 32 (66.5 s with the tail) | 32 | 32 |
| gain to his loudness on a phone | -9.21 dB | -2.62 dB | 0 (the engine's own level) |
| through a phone | -36.90 dB | -36.90 dB | -36.91 dB |
| peak | -12.29 dBFS | -7.70 dBFS | -7.34 dBFS |
| largest sample jump | 0.054 | 0.077 | 0.058 |
| energy above 5 kHz | 0.061 % | 0.109 % | 0.003 % |
| his tune under the mix, phone | 13.86 dB | 17.62 dB | 15.00 dB |
| the beat alone, phone | -39.76 dB | -39.70 dB | -50.98 dB |
| the machine in 64 bars | 168 presses, 96 ticks, 24 party strokes, 16 steel, 16 motor gears | the same | none |
| first drum | bar 9 (16.0 s) | bar 9 | bar 9 |

## ANALOG HORROR AT THE SOURCE (rule 20; his 9/20 law)

- The machine is running before the song's beat arrives: for eight bars a motor whines on his G with nobody at it, and
  his core plays over it. A machine that outlived the people it was for (the machine party record, 3.4).
- When his song moves key the motor labours up or down to follow it, a beat late in feel, never cleanly: a mechanism
  trying to keep up.
- In his C sections (kick and bass only) the motor comes up 4 dB: the song strips and the room is what is left.
- The hall and the tape are one grime over the music and the machine together; nothing is a filter on top of a clean
  mix, and no noise is added.

## WHERE IT IS

- VOTE: sounds-repo-man-the-machine-party-10-19 (kind song), slices/BOHEMIA_REPO_MAN_THE_MACHINE_PARTY_10_19_26.html:
  the real map from its own camera with the recorded desert under it, A THE MACHINE PARTY, B YOUR REPO MAN, C THE
  MACHINE, CLEAN, STOP; a line naming the bar, the part of his form, the key and what the machine is doing. The card
  says EYES AND EARS is paused, so nobody checked it beside his songs first (tools/bohemia_sounds_register_song.py
  --eyes-paused, which registers only while EYES' MODE reads PAUSED and the card says so).
- The game: not yet. His REPO MAN in the alpha is untouched and stays in the shuffle; on his YES the remake plays in
  REPO MAN's slot, CUE 7.8, RUN's cut (rule 93).
- The lock: records/BOHEMIA_SONG_LOCK.json new_songs, 'repo-man-the-machine-party', ON PURPOSE.
- Gate: THE MACHINE PARTY, 42/0; mutated (the press skips his fills, the party in every section) 40/2.

## NEXT ROUND

The next of the game's songs, the same machine, his row untouched: the map's night shuffle first (he hears it most):
SATELLITE PRAYER (his 7/18 'satellite prayer is great'), then GHOST IN THE GRID, SLOW BLEED, SLOW CREEP, THE PIT BOSS
IS GONE; then the title's. Each song gets the machine that fits its own kit (a song with a punchk kick gets a lighter
press; a song with no hat gets no relay), never a new note.

[bb sound] How Battle Brothers did it: its score and its world's sounds are separate layers, the music never carries
the camp or the fight's din. This remake keeps that split inside one song: his notes are the score, untouched; the
machine is the world's sound, playing with it.
