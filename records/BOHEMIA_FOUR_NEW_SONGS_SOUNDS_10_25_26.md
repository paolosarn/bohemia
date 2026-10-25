# FOUR NEW SONGS, EACH ITS OWN SONG (SOUNDS 10/25/26, row [every song its own song], rules 166, 167, 168, 181)

## HIS WORDS
"it's the same one for like seven songs bro and they use the same instruments... seven of the same songs with like one
slightly thing different... you have like this background creepy vibe, and it's hard to hear really anything else."

## PART ONE: THE SIX ARE BURIED
The six night songs of 10/24 (THE METER READER, THE SUBSTATION HUMS ALONE, THE LOBBY PIANO STILL PLAYS, THE CASHIER'S CAGE,
THE MALL AFTER CLOSING, THE LAST BUS TO HENDERSON) are in graveyard/the_six_night_songs_10_24_26/ with the post-mortem
(graveyard/POSTMORTEM_THE_SIX_NIGHT_SONGS_10_24_26.txt): each one of his songs with two or three values changed, REPO MAN's
machine under all six, the tune 12.4 to 21.6 dB under the mix on a phone. Their cards are out of the tab (never voted), their
names are tombstones in gates/bohemia_graveyard.txt, the song lock keeps their lines pointed at the graveyard, and
gates/more_music_gate.js now proves the burial.

## PART TWO: FOUR NEW SONGS, WRITTEN
Nothing here is one of his songs with values changed. Each is written note by note in tools/bohemia_sounds_four_new_songs.js:
a melody that asks for two bars and answers for two, a B section that climbs, the A coming back an octave up, an ending that
holds the cadence; the chords bar by bar; the groove step by step. 32 bars: an intro of the bed and the beat (4), A (8),
B (8), A an octave up (8), the ending (4).

| song | key | lead | bass | pad | kit (real recordings, the CC0 bank) | groove |
|---|---|---|---|---|---|---|
| THE CHURCH CLOCK STRIKES TWELVE | D minor (aeolian) | the church clock's own bell, a real recording tuned note by note (its strongest partial measured at 525 Hz, a C) | abyssbass | submergechoir | wood knocked, hands clapped, the old Yantar clock | a processional: kick on 1 and the and of 3, the backbeat only on your turn |
| THE SODA MACHINE STILL TAKES COINS | E phrygian | drawbarmorph, a drawbar organ that bends | filterfmgrowl | none (dry) | a bass drum shell, a soda can opening, a mouse click | swung 16ths, a shuffle |
| THE HELICOPTER THAT NEVER LANDS | A dorian | ghostflute | undertowbass | aeolianharp | a large wooden door knocked, a clap, a clock ticking close | four on the floor, the off-beat bass |
| THE PAWN COUNTER AT FOUR IN THE MORNING | C harmonic minor | drownedpiano | pwmreed | faythchoir | a door knock, a can opened, a wind-up clock | a broken beat |

No two share more than one of lead, bass, drums, pad, key: they share none. No machine party anywhere (166(d)).
ANALOG HORROR INSIDE THE SOUND (166(c)): every song goes through its own worn tape (a soft saturation, the top rolled off at
7.5 kHz); there is no drone laid over any tune.

THE LEVELS, ONE TIMELINE: 1 the map (the tune on top, a soft 120 beat), 2 their turn (the beat tightens, the ticking doubles,
the bass pushes, the tune stays), 3 your turn (the full kit, the bass driving with the octave jump, the tune doubled an
octave, a fill into each phrase). A FIGHT: from bar 5, the map, their turn, your turn, their turn, your turn, four bars each.

THE MIX, SET BY MEASURING (166(c): the tune and the beat lead): a calibration pass renders the tune alone and the three real
hits alone at level 1 and sets this song's kit 9 dB under its tune through a phone (the first takes had the same kit gains
everywhere: THE SODA MACHINE's beat came out 0.9 dB under its whole mix with the tune 7 dB under, THE CHURCH CLOCK's 13 dB under,
because real hits are as loud as they were recorded); then level 1 is set to -36.5 dB through a phone, his night songs'
loudness, one gain for every level.

## WHY NOT REAL INSTRUMENT LIBRARIES
Rule 166(e) asks for more instruments from real material, a free licence where one allows. The CC0 orchestral and the
University of Iowa instrument libraries were tried and the network refuses their hosts in this environment; so the real
material is the CC0 bank already in the repo (a church bell, wood, a soda can, clocks, claps), and the pitched voices are his
engine's own. A real piano, strings or brass are the next round's ask once a host is allowed.

## NUMBERS (slices/vote/songs/new_four/<song>/measured.json; gate gates/four_new_songs_gate.py 106/0, in the suite)
| song | phone rms L1 / L2 / L3 (dB) | climb L2 / L3 | the tune vs the mix | the beat, level 1 to 3 | the kit set by | card |
|---|---|---|---|---|---|---|
| THE CHURCH CLOCK STRIKES TWELVE | -36.5 / -35.2 / -33.2 | +1.3 / +3.3 | -0.36 dB | 11.11 dB | 3.89 dB | sounds-new-song-the-church-clock-strikes-twelve-10-25 |
| THE SODA MACHINE STILL TAKES COINS | -36.5 / -33.6 / -29.8 | +2.9 / +6.7 | -0.58 dB | 14.07 dB | -15.06 dB | sounds-new-song-the-soda-machine-still-takes-coins-10-25 |
| THE HELICOPTER THAT NEVER LANDS | -36.5 / -33.9 / -31.0 | +2.6 / +5.5 | -0.75 dB | 11.92 dB | -9.32 dB | sounds-new-song-the-helicopter-that-never-lands-10-25 |
| THE PAWN COUNTER AT FOUR IN THE MORNING | -36.5 / -33.8 / -30.7 | +2.7 / +5.8 | -1.35 dB | 9.97 dB | -18.18 dB | sounds-new-song-the-pawn-counter-at-four-in-the-morning-10-25 |

A STRANGER TELLS THEM APART, measured as a pitch-class fingerprint (12-bin chroma) of ten seconds of level 1 from the bar the
tune comes in: against each other mean 0.69, the closest pair 0.85; against ten seconds of each of his eight night songs the
closest 0.78 (the gate's line is 0.95). The 120 BPM pulse, heard through the high end, repeats at 0.20 to 0.95 of its energy on
every level of every song. Every card plays on the phone and computer profiles (level 1, level 3 on the bar, A FIGHT, STOP).
None clipped; nothing named in the alpha or the demo.
