# MORE MUSIC, MADE IN HIS SONGS' OWN MACHINE (SOUNDS 10/24/26, row [more music, on the one beat], part two)

## HIS WORDS
Paolo 10/24 (rule 158): "a big thing is we need more music... some of the songs are background hums without drums,
but we made this universal BPM music thing for a whole reason, to give that extra layer of love."
Rule 158(d): SOUNDS makes more songs in his songs' own machine (rule 119), in the vibe of his OVERWORLD NIGHT category
and REPO MAN THE MACHINE PARTY; a new song waits in the VOTE tab until he says it joins (rule 122(d)).

## WHAT WAS MADE
Six new night songs. Each is ONE ROW in the shape of his MLOOPS rows: one of his OVERWORLD NIGHT songs' own row with
two or three things changed, every changed value taken from one of his CANON songs (the tool refuses a value that canon
song does not hold). His engine plays it (MUS.playStep, synthV, drumV, his SONG_ARR form, his SONG_ROOT key moves, the
beat arriving late), and REPO MAN THE MACHINE PARTY's machine plays along, number for number (his YES 10/19), the
motor moved into each song's key, in the concrete hall on the worn tape.

| song | parent (his) | what changed, and from which of his songs | C beside it |
|---|---|---|---|
| THE METER READER | REPO MAN | lead: brokenkeys (PAWNSHOP PSALM); accent: dreadbed (THE PIT BOSS IS GONE) | SLOW BLEED |
| THE SUBSTATION HUMS ALONE | GHOST IN THE GRID | lead: cracklewire (WHAT THE SLOT MACHINE REMEMBERS); accent: vacancyhum (THE LAST BROADCAST CORRODES); hat: sizzle (THE HYMN THE STATIC ATE) | REPO MAN |
| THE LOBBY PIANO STILL PLAYS | SLOW BLEED | lead: drownedpiano, bass: undertowbass, hat: ride (all THE SENDING) | THE VAULT |
| THE CASHIER'S CAGE | THE VAULT | lead: rotviola (THE LAST DEALER FOLDS); accent: chapelbreath (A GASP IN THE VAULT); melody: call (REPO MAN) | THE PIT BOSS IS GONE |
| THE MALL AFTER CLOSING | THE ORGAN IN THE DROWNED CHAPEL | lead: atriumvox (THE VOICE THAT STILL ANNOUNCES FLOORS); accent: deadsat (REPO MAN); kick [0,10] (SLOW CREEP) | GHOST IN THE GRID |
| THE LAST BUS TO HENDERSON | SLOW CREEP | lead: ghostflute, bass: abyssbass (WHERE THE PROCESSION DROWNED) | SATELLITE PRAYER |

His engine draws the tune from the name's length, the root and the scale; the tool refuses a name whose tune is any of
his 128 (THE COUNTING ROOM was refused first: the name is already one of his songs).

## THE NUMBERS
See each song's slices/vote/songs/<slug>/measured.json. Every new song is set to its parent's loudness through a
phone's speaker (inside 0.5 dB), none clipped, its tune not buried (no more than 3 dB under its parent's, or above
-25 dB); the machine plays its
five parts (press, clock, party, steel, motor) in every song.

SONGS_TABLE

## FOUND
- THE CASHIER'S CAGE's first lead, A GASP IN THE VAULT's paper lung, measured its tune 33.9 dB under the mix on a phone
  (his VAULT's 17.2): buried. Swapped for THE LAST DEALER FOLDS' rot viola: 12.6 dB under. Measured, not by ear.
- His songs do not render the same twice: his voices carry their own noise, so his REPO MAN came out as two different
  files on two renders (7e1c86 then 5da75e). A card that re-recorded a shared song would leave another card's numbers
  about a file that is gone. So each of his songs is recorded ONCE (slices/vote/songs/his_night_songs/, with its numbers
  in measured.json there) and every card reads that one.
- The machine party's motor recording is cut on REPO MAN's G. A song on another root would have had a G motor under it,
  out of key; engine/bohemia_machine_party.js now takes machine.motor.transpose (absent = 0, so REPO MAN plays exactly
  as before; its own gate is the proof).

## EYES
Rule 119(c) wants EYES AND EARS' one line (same game? analog horror?) before VOTE. EYES is running (rule 150) and its
row [the new song beside his songs] is open. Rule 158(d) (10/24, newer) and this round's brief put each song in the VOTE
tab, and rule 154(c) says no row waits. So the cards say, in those words, "EYES AND EARS' line is owed", and the
register tool's new --rule-158 door registers only while rule 158 is on the board and the card says so. An EYES line
that exists still decides: a NO keeps a song out.

## NEVER WIRED
No song is in MLOOPS on disk, in CAT_DEFAULTS, in the fence or named anywhere in the alpha or the demo (rule 122).
Each is a new_songs line in the song lock with its hash. Gate: gates/more_music_gate.js.

## TOOLS
- tools/bohemia_sounds_more_music.js make | record <slug> | pages | lock
- tools/bohemia_sounds_more_music_pages.js (the card pages, the cards)
- tools/bohemia_sounds_register_song.py --rule-158 --write
