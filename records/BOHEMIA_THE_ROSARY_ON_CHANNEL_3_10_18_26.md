# THE ROSARY ON CHANNEL 3: A NEW SONG MADE WITH HIS SONGS' OWN MACHINE (SOUNDS, 10/18/26)

Row: [his sound, not a revamp] (VAMILY, SOUNDS), claimed sound-opus-10-18f (1fcc9516). The same commit TURNED
[the middle ground]: NIGHT FREIGHT is his form on the chip engine's pulse, the sound he said NO to twice, so its card
sounds-night-freight-10-18 was pulled from VOTE unheard (rule 118c), CUE 7.5 SCRUB, the song stays on disk.

## THE RULING THIS ROUND ACTS ON

Paolo 10/18, his NO on THE LONG ROAD (records/BOHEMIA_PAOLO_BOTH_NEW_SONGS_ARE_NOT_ANALOG_HORROR_10_18_26.md):
'Im not a fan of this song bith songs not giving analog horrir vibes I was hoping the research that Grok helped you do
would make it easier to do what you needed to do not like have a whole revamp process where you're like making songs I
don't fit aesthetic you know'. Rule 119: (a) a new song starts from his canon songs' own instruments, kits and
arrangement (MLOOPS, synthV, drumV, SONG_ARR), read and reused, never edited; the chip is dead as a song's sound;
(b) research makes it cleaner and quicker, never a new style; (c) before VOTE it plays beside two canon songs and EYES
AND EARS writes one line; (d) the card plays it next to the canon song it came from.

## WHAT A SONG IS IN HIS MACHINE (read off the alpha, nothing edited)

One row. His 128 MLOOPS rows are each a name, a key, a five-note scale, three step lists (kick, bass, hat), a bass
voice, a lead voice, an accent voice, a kit, a tune shape, a feel and a fight ladder. MUS.playStep turns a row into
music through his 581-voice rack (synthV), his drum bank (drumV), his 64-bar form (A B B A C B D B A B C A D D B A)
and his key moves. The map's six night songs are SIBLINGS: REPO MAN, GHOST IN THE GRID, SLOW BLEED and SATELLITE PRAYER
differ from each other in three to five fields. So the way his songs were made is the way this one is made.

THE SONG, slices/vote/songs/the_rosary_on_channel_3.json, row:

    {n:'THE ROSARY ON CHANNEL 3', root:52, scale:[0,2,3,7,8], wave:'sine', kick:[0,8], bass:[0,7,11], hat:[4,12],
     inst:{b:'deadsat', l:'brokenrosary'}, am:'powergrid', kit:{k:'thud', h:'wood'}, mel:'longs', swing:0,
     feel:'half', klay:'melody', ff:true}

It is SATELLITE PRAYER's own row (canon, a map night song; his 7/18 'satellite prayer is great') with TWO fields
changed, each the value of another canon song:

| field | value | from his | why |
|---|---|---|---|
| lead | brokenrosary | THE MARKER ON THE DOOR | his 8/2 'one of my new favorite songs that you've made': five beads on one note, each duller, the gaps widening like a thread slipping |
| scale | 0 2 3 7 8 | REPO MAN | the map's most common five; and the only way to a NEW tune (below) |
| everything else | as it is | SATELLITE PRAYER | F sharp, half time, the deadsat bass, the powergrid accent, the thud and the wood, the long notes, his ladder |

The gate holds every field deep-equal to the song its provenance names, and that song CANON (2 in his verdict table).

## THE FINDING THAT PROVES US WRONG: HIS ENGINE HAS FIVE TUNES PER SCALE, AND ONE SCALE WAS FULL

His engine draws the tune from the name. Read exactly: for the long-notes shape the degree is
((len*7 + step/2 + bar*8) * 40503) mod 5, which is (len + 3k + 4b) mod 5: the tune depends only on the NAME'S LENGTH
MOD 5. On a five-note scale there are exactly five long-notes tunes, and two songs with the same scale, shape and
length mod 5 play the same tune in different keys. On SATELLITE PRAYER's own scale (0 2 4 7 9) his canon songs already
hold all five (MENU THE POWER STILL ON SOMEWHERE 0, SATELLITE PRAYER 1, THE MARKER ON THE DOOR 2, SIX STRING SUNRISE 3,
LAST BROADCAST 4): keeping his scale would have meant one of his tunes again. On REPO MAN's five (0 2 3 7 8) his songs
hold 0, 1, 2 and 4 (IRON CHOIR, TWO COINS and THE SENDING, COPPER DUNES, THE VAULT); 23 letters is the fifth. The gate
plays all 106 canon songs through his engine and proves the tune is none of theirs, note for note and beat for beat
relative to the root; a 12-letter name was proven to come out as COPPER DUNES' tune exactly.

## HOW THE ROW WAS CHOSEN: MEASURED, NOT BY AN EAR THIS LANE DOES NOT HAVE

First try: REPO MAN's row with the rosary and SLOW CREEP's key. His engine played it (no drum before 16.05 s, the
rosary 72 times, peak -6.1 dB) but on a phone's speaker the tune sat 22.7 dB under the mix, against 15.0 for REPO
MAN's piano: the grid's low saws (powergrid as the bass) bury a short bead. So his whole night family was measured the
same way (16 bars each, the tune alone against the mix, through two 350 Hz high-passes):

| his song | bass / lead / accent | the tune under the mix on a phone |
|---|---|---|
| SLOW CREEP | nightpad / rustlead / deadsat | 13.5 dB |
| SLOW BLEED | powergrid / rustlead / deadsat | 14.5 dB |
| SATELLITE PRAYER | deadsat / solarhymn / powergrid | 14.5 dB |
| REPO MAN | powergrid / coldpiano / deadsat | 15.0 dB (32 bars) |
| THE VAULT | nightpad / duskorgan / ledgerbell | 20.0 dB |
| THE PIT BOSS IS GONE | nightpad / rouletteghost / dreadbed | 25.4 dB |
| GHOST IN THE GRID | powergrid / signalfade / deadsat | 26.0 dB |
| THE ORGAN IN THE DROWNED CHAPEL | nightpad / hollowvowl / dreadbed | 46.2 dB |

Six variants of the new row, each swapping only values his songs use: the rosary over powergrid or nightpad sat 23 to
26 dB under (inside his range, at its buried end, with GHOST IN THE GRID); over SATELLITE PRAYER's pair (deadsat under,
powergrid on beat one of the core) it sat 16.6 dB under, like his REPO MAN. So the frame became SATELLITE PRAYER's.

## MEASURED (the four recordings he and EYES hear, decoded from the mp3s)

Every one recorded from the alpha's own engine by tools/bohemia_sounds_his_machine.js, the map's way (CITYMUS on: no
drums for eight bars), no kill layers, the first 32 bars (all four of his parts: A B B A C B D B), 80 kbps mono. His
songs at the engine's own level, gain 1, no limiter. The new song's recording alone raised 1.56 dB so it is exactly as
loud as SATELLITE PRAYER through a phone's speaker (the louder of two takes always sounds better).

| | THE ROSARY ON CHANNEL 3 | SATELLITE PRAYER | REPO MAN | THE MARKER ON THE DOOR |
|---|---|---|---|---|
| made by | his engine, a new row | his engine, his row | his engine, his row | his engine, his row |
| tempo | 120 | 120 | 120 | 120 |
| key, scale | F#, 0 2 3 7 8 | F#, 0 2 4 7 9 | G, 0 2 3 7 8 | D, 0 2 4 7 9 |
| first drum | 16.0 s (bar 9) | 16.0 s | 16.0 s | 16.0 s |
| tune in bars (of 64) | 36 | 36 | 18 | 36 |
| pitched notes a bar | 4.59 | 4.59 | 5.88 | 5.59 |
| peak | -7.53 dB | -8.47 dB | -7.35 dB | -11.01 dB |
| through a phone | -41.57 dB | -41.56 dB | -36.86 dB | -46.99 dB |
| the tune under the mix, phone | 12.8 dB | 12.7 dB | 15.0 dB | 12.4 dB |
| energy above 5 kHz | 0.000 % | 0.000 % | 0.003 % | 0.098 % |
| largest sample jump | 0.016 | 0.014 | 0.048 | 0.047 |

All in slices/vote/songs/the_rosary_on_channel_3/measured.json (the row's hash ties the recordings to the row).

## ANALOG HORROR AT THE SOURCE (rule 20; no filter on top)

- The tune is a plain minor line on a rosary that slips: five beads a note, each duller, the gaps widening. A warm
  melody that sounds like a mechanism failing, which is the law's own default ('a warm melody heard through a dead
  broadcast'), built from his own voice.
- Under every bar, deadsat: a sine drifting off pitch at 0.7 Hz, a satellite still transmitting with nobody on it.
- On beat one of the core the grid hums: powergrid, three low saws with the filter shaking at 50 Hz.
- The beat arrives late (his 9/12 rule) and his strip sections leave kick and bass alone: silence as an instrument.
- No crush, no added hiss, no tape: 0.000 percent of the energy above 5 kHz. NO SAND.

## WHAT THE GROK RESEARCH DID HERE (rule 119b)

All twelve of Grok's music pages (184 to 195; 11 PASSED FILTER, 195 FAILED) are about the NES chip, and rule 119(a)
killed the chip as a song's sound, so nothing in them chose anything here. What of them made this cleaner is hygiene,
used as checks: an envelope on every note (GROK 188; here: no sample jump over 0.2, the worst 0.016) and no muddy low end
burying the tune (GROK 184; here: the tune measured against the mix through a phone, which is what moved the row from
REPO MAN's frame to SATELLITE PRAYER's).

## WHERE IT IS

- NOT IN A TAB YET (rule 118a). The card, sounds-the-rosary-on-channel-3-10-18, waits inside the song's file. Rule
  119(c): EYES AND EARS hears it first on slices/BOHEMIA_THE_ROSARY_BESIDE_HIS_SONGS_10_18_26.html (the new song beside
  SATELLITE PRAYER, REPO MAN and THE MARKER ON THE DOOR, with the table above) and writes one line on SOUNDS' row, for
  example 'EYES <date> <session>: THE ROSARY ON CHANNEL 3 beside SATELLITE PRAYER and REPO MAN: same game YES, analog
  horror YES (the reasons)'. Then `python3 tools/bohemia_sounds_register_song.py slices/vote/songs/the_rosary_on_channel_3.json --write`
  puts the card in the tab with its sha; it refuses without that line, and refuses on a NO or a NOT.
- THE CARD'S PAGE: slices/BOHEMIA_THE_ROSARY_ON_CHANNEL_3_10_18_26.html: the real map (BOHEMIA_MAP_CURRENT, untouched)
  from its own camera, the recorded desert under it at the map's level, A the new song, B his SATELLITE PRAYER (the
  song it came from, rule 119d), C no song, STOP, a line naming the bar, the part and the key.
- THE ALPHA: untouched. CUE 7.6 (RUN's, rule 93): on EYES' yes and his YES the row joins MLOOPS and the map's night
  shuffle beside his six, played by MUS.playStep like every one of his songs.
- LOCKED OUT LOUD: its new_songs line in records/BOHEMIA_SONG_LOCK.json (file, hash, why). His bodies unchanged.

## THE TOOLS AND THE GATE

- tools/bohemia_sounds_his_machine.js: no synthesis in it. Opens the alpha read only, pushes the row into MLOOPS in the
  page's memory, plays it with MUS.playStep into an OfflineAudioContext, wraps synthV and drumV for the length of the
  pass to log every voice his engine scheduled (and puts them back), renders the tune alone for the phone number,
  records his songs named in 'beside' the same way, writes the mp3s and measured.json. Its schedule pass (no audio,
  milliseconds) is what the gate runs live.
- tools/bohemia_sounds_his_machine_measure.py: peak, rms, the largest jump, energy above 5 and 8 kHz, the centroid,
  the level through a phone (Parseval on the averaged spectrum), every bar's rms.
- tools/bohemia_sounds_register_song.py: the only door into VOTE for a new song, behind EYES' line.
- gates/the_rosary_on_channel_3_gate.js, THE ROSARY ON CHANNEL 3 in the suite: 39/0; mutated (a kit field off its
  provenance plus the card registered with no EYES line) 35/4, restored; the twin check proven on a 12-letter name.

## FOUND, NOT FIXED (his voice bank is locked; routed)

rustlead, the lead of SLOW CREEP and SLOW BLEED (two of the map's six night songs), leaks: its WaveShaper's curve at
silence is -0.027 (the curve is not symmetric about zero), and the gain after it is born at 1 and only set to
0.0001 at the note's own start time. So from the moment a note is scheduled until it plays, -0.027 of DC passes at full
gain. In an offline pass that schedules everything up front it piles up to -15.6 dBFS of DC (SLOW CREEP, mean -0.165);
REPO MAN's coldpiano: none. In the live game the music runs into a compressor at -14 dB with no DC blocker in front
of it, so every rustlead note should arrive as a short DC step at the scheduler's lookahead (inferred from the code,
not measured live). It is the same class as the
chip engine's 'gain born at 1' click this lane fixed on THE LONG ROAD round. The fix is either a deliberate change to
his voice bank with the lock rewritten and a reason, or a DC blocker on the music bus (mechanism, not locked); measured
here, not applied, because his songs are canon and this round's row is the new song.

## GATES THIS ROUND

the rosary on channel 3 39/0 (new, registered), song lock 24/0, night freight 42/0 (asserts the pull), vote tab 41/1
(the one red is DYNASTY's two items, as before). Full suite unmeasured since c2d11e55 (rule 13).
