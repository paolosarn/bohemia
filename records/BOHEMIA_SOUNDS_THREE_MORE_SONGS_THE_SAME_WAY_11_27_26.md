# MORE SONGS, MADE THE SAME WAY, AND EVERY SONG IN TURN (SOUNDS THREE 11/27/26, rule 488; ask row 756)

## HIS WORDS
"we need more music please, the good way you did, the exact same way that you made it last time, it was doing good. We
need more tunes... I keep hearing the same songs. I thought we had lots of songs." And: "there's some good music."

## MEASURED FIRST (the alpha's own pickers in the page, before anything changed)
- THE POOL: 13 songs play on the road, in a fight and after one (his nine at three levels, the four of 10/25). Every other
  song stays silent (rule 122). The 13 faction songs play only in their part of town (rule 237).
- AN HOUR: a song plays its 128 s pass, the street rests 16 s, the next comes: 25 songs an hour. The pick drew at random
  each time (canon 8x, unjudged 4x) and remembered only the song playing now. Over 400 simulated hours: 11.5 different
  songs an hour, 13.5 repeats an hour, the first repeat a median 12 minutes in (7.2 at the tenth percentile), a song back
  after 4.8 minutes at the closest. That is "I keep hearing the same songs": the pool is small AND the draw repeats early.
- EVERY ORIGIN ITS SONG, THE FACTION SONGS (rule 237): nothing is missing. 13 of 13 factions play a song in their part of
  town (NETWORK has two); 15 of 15 origins have a song on the tape and at home. Two pairs share one: THE FAITHFUL and THE
  PROMISE KEEPERS (the CHURCH's, his word for THE FAITHFUL), THE DESERTERS and THE HUNTERS (the REMNANTS'). Giving those two
  their own recorded song on the tape is not done this round, and why: the tape plays before first play, and before first
  play no song recording may load (PLUMBER's FIRST PLAY IS LIGHT, P4), so a recorded song there would be silent. NEXT.

## THE RECIPE, KEPT (the four of 10/25: records/BOHEMIA_FOUR_NEW_SONGS_SOUNDS_10_25_26.md, his UP on all four)
tools/bohemia_sounds_more_songs.js has NO render of its own: every song goes through tools/bohemia_sounds_four_new_songs.js's
own render and record. The same 32-bar form (an intro of the bed and the beat, A, B, A an octave up, the ending), the same
worn tape (a soft saturation, the top rolled off at 7.5 kHz: analog horror inside the sound, never a drone over the tune),
the same three levels on one timeline (1 the map, 2 their turn, 3 your turn), the same gap set by measuring through a phone
and on full range (level 2 3.6 dB over 1, level 3 7.8 over 2), the same hit into your turn, the same kit set 9 dB under the
tune through a phone, level 1 at his songs' loudness (-36.5 dB through a phone), the same 120 beat, the same card page.
What the shared render learned, each a field the four do not carry so the four render exactly as before: a five-note scale
(his own songs are five notes, 101 of 128), a chord line for the B section, the bass and the pad set by measuring
(BALANCE: the bass 3 dB and the pad 9 dB under the tune on full range, where the four's synth-led songs measured, the bass
+0.2 to -8.5 and the pad -3.9 to -12.2), and a drum cut at its peak for a recording that swells.

## HOW THE PARTS WERE CHOSEN (measured, never by name)
- THE VOICES: about 150 of the rack's voices rendered offline, a phrase each: the pitch held (autocorrelation at the
  note's period), the level, how long a note rings. Nine render silent offline (oud, dulcimer, mandolin, zither, shamisen,
  koto, sitar, kora, guzheng) and two read no pitch (sousaphone, contrabass): left out. The lead gains are set from the
  same numbers (every lead about -33 dB at its bus before the mix is levelled).
- THE DRUMS: 75 recordings from the CC0 bank cut and filtered as hits: the peak's place after the cut and the level. A
  hit whose peak came 60 to 160 ms late (most animal and voice sounds, a door knock, a footstep) would sound off the beat:
  four are cut at their peak instead (the crow, the car horn, a bottle, unused: a cough), the rest kept only if the peak
  lands within 25 ms. Each kit's three hits levelled against each other (kick and snare about -17 dB, the hat -24).

## THE TWELVE (slices/vote/songs/more_songs/<slug>/: level_1, level_2, level_3, hit, a_fight, measured.json)
| song | key | lead | bass | pad | drums (real recordings, CC0) | phone dB L1 / L2 / L3 | his turn over theirs | tune vs the mix | the beat climbs | size |
|---|---|---|---|---|---|---|---|---|---|---|
| THE ICE CREAM TRUCK STILL PLAYS ITS SONG | G lydian | musicbox | uprightslap | glasspad | a footstep for the kick, a bottle breaking for the snare, a kid slurping for the hat | -36.5 / -31.56 / -23.83 | +7.7 | -0.64 dB | +12.14 dB | 1.96 MB |
| THE WEDDING CHAPEL TAKES ONE MORE BOOKING | G harmonic minor | pumporgan | foreclosurebass | boychoir | the chapel door knocked for the kick, a champagne glass breaking for the snare, a sip for the hat | -36.5 / -32.88 / -25.06 | +7.8 | -1.02 dB | +10.39 dB | 1.96 MB |
| THE LOUNGE SINGER STILL TAKES REQUESTS | B flat dorian | ondes | uprightjazz | wornstrings | a soft footstep for the kick, a breath for the brush, a saw stroke for the ride, swung | -36.5 / -32.88 / -23.81 | +9.1 | -0.71 dB | +13.93 dB | 1.96 MB |
| ONE SIGN IN THE BONEYARD STILL BUZZES | E minor pentatonic | vibraphone | reese | sinepad | a footstep for the kick, a neon tube breaking for the snare, a crackle for the hat, half time | -36.5 / -32.96 / -25.22 | +7.7 | -0.7 dB | +11.66 dB | 1.96 MB |
| LAKE MEAD GIVES BACK WHAT IT TOOK | A hirajoshi (five notes) | shakuhachi | boneyardbass | stillwater | a drop of water for the kick, a boat's wood creaking for the snare, another drop for the hat | -36.5 / -32.9 / -24.77 | +8.1 | -0.74 dB | +12.9 dB | 1.96 MB |
| THE MONORAIL RUNS WITH NOBODY ON IT | F sharp phrygian dominant | clarinet | fmbass | harmonium | a train for the kick, a crow on the rail for the snare, the train's rattle for the hat | -36.5 / -33 / -23.62 | +9.4 | -0.19 dB | +15 dB | 1.96 MB |
| THE DRIVE-IN SHOWS THE SAME REEL | A flat major | honkytonk | doghouse | none (dry) | a footstep for the kick, a car horn for the snare, the film's crackle for the hat | -36.5 / -32.87 / -24.83 | +8.0 | -0.55 dB | +14.81 dB | 1.96 MB |
| THE MOTEL SIGN SAYS VACANCY | D dorian | lapsteel | outlawbass | dawnwash | a boot heel for the kick, a bottle breaking for the snare, a saw stroke for the shaker, a gallop | -36.5 / -32.89 / -25.06 | +7.8 | -0.66 dB | +11.03 dB | 1.96 MB |
| THE WATER TOWER READS OUT NUMBERS | B in-scale (five notes) | whistle | sub | ghostpad | a low snore for the kick, a cough on the microphone for the snare, a breath for the hat, the tresillo | -36.5 / -32.59 / -24.77 | +7.8 | -0.79 dB | +9.4 dB | 1.96 MB |
| THE BUFFET STILL LAYS OUT THE TRAYS | C sharp harmonic minor | accordion | jugbass | warmpad | a grunt for the kick, a laugh from the line for the snare, a breath for the hat, oom-pah | -36.5 / -32.9 / -24.43 | +8.5 | -0.63 dB | +14.21 dB | 1.96 MB |
| THE IMPERSONATOR DOES TWO SHOWS A NIGHT | E flat mixolydian | telecaster | swaggerbass | choir | a footstep for the kick, the audience clapping for the snare, a drink poured for the hat, swung | -36.5 / -32.88 / -25.06 | +7.8 | -1.19 dB | +9.49 dB | 1.96 MB |
| THE HOSPITAL KEEPS ONE LIGHT ON | C minor (aeolian) | celesta | lampbass | mistchoir | a soft footstep for the kick, a cough on the ward for the snare, a ventilator's breath for the hat, the heartbeat | -36.5 / -32.89 / -24.96 | +7.9 | -0.84 dB | +11.68 dB | 1.96 MB |

Stories: THE ICE CREAM TRUCK STILL PLAYS ITS SONG: an ice cream truck parked on a cul-de-sac in Summerlin, its battery dying, its jingle still calling kids who left with their families. THE WEDDING CHAPEL TAKES ONE MORE BOOKING: a drive-through wedding chapel on the Strip with its lights on and its organ playing, booking couples who never come. THE LOUNGE SINGER STILL TAKES REQUESTS: the lounge of a dead casino where a voice still sings to empty tables, taking requests from nobody. ONE SIGN IN THE BONEYARD STILL BUZZES: the field off Las Vegas Boulevard where the dead signs were laid down, and one tube that still lights at night. LAKE MEAD GIVES BACK WHAT IT TOOK: the reservoir going down year after year, a town's roofs coming up out of the water, and the barrels on the new shore. THE MONORAIL RUNS WITH NOBODY ON IT: the Strip's monorail still running its loop on the last power, the doors opening at every empty station. THE DRIVE-IN SHOWS THE SAME REEL: the drive-in off Boulder Highway whose projector still runs one reel at dusk, and the cars that honk at it. THE MOTEL SIGN SAYS VACANCY: a motel on Fremont whose VACANCY sign has never once gone off, every room open, every key on its hook. THE WATER TOWER READS OUT NUMBERS: the water tower in North Las Vegas whose old emergency speaker plays a tune at night and then reads out numbers. THE BUFFET STILL LAYS OUT THE TRAYS: an all-you-can-eat buffet off the Strip that still sets out its trays every evening, and the line that still forms for them. THE IMPERSONATOR DOES TWO SHOWS A NIGHT: a man in a white jumpsuit who still does both his shows in a showroom with the power out, to applause from the dark. THE HOSPITAL KEEPS ONE LIGHT ON: the hospital on Charleston with one window lit on the fourth floor every night, a monitor still beeping for someone.

No two of the sixteen (these twelve and the four) share more than one of lead, bass, drums, pad, key: they share none.

## THE SIZE (measured: the published site against its cap, PAGES PUBLISH)
The publish list measured 869 MB of its 900 MB cap before this batch. The four's way (mp3 at 96 kbps) is 2.9 MB a song,
35 MB for twelve: over the cap. The twelve are encoded at 64 kbps (about 1.95 MB a song), at the same 44.1 kHz, so the
encoder's delay is the one the game's probe already reads (the beat stays where it was written, on every browser); the
worn tape rolls the top off at 7.5 kHz, so 64 kbps carries all the song has. Nothing about the music changed with it.
MEASURED AFTER: the twelve are 23.5 MB on disk; the publish list 893 MB of its 900 MB cap (PAGES PUBLISH 30/0). Seven MB of room is little: SOUNDS' own his_night_songs (6.2 MB, reference audio only gates and tools read) can leave the publish list next.

## THE ROTATION: EVERY SONG IN TURN (engine/bohemia_every_song_in_turn.js, in the alpha and the demo)
One choice for the street, the opening, the fence and the faction song's hand-off to a fight: never the song playing now,
a song he took out in the MUSIC tab only when nothing else is left, then THE LEAST PLAYED THIS SESSION, and among those the
one he heard longest ago (kept in the browser, so a new session starts with what the last one did not reach), a tie at
random. A play is what the transport started (MUS.cur read every 250 ms while the music plays), not a choice. The street's
pick and the opening's call it in their first line; THE SONGS GO IN's queue a phrase early, the song after a battle and the
part of town all go through the street's pick, so the recording the rotation chose is the one loaded ahead.
AFTER (the same walk, the alpha's and the demo's own pickers, six hours from a clean browser): 25 songs, 25 different every hour, never twice in a row, every song once before any twice, the first repeat at 60 minutes and every repeat 60 minutes after the last. THE PLANT (the old draw, same walk, same 25 songs): every turn broken, the first repeat 19 to 22 minutes in, a song back after 4.8 minutes. With the old 13 the new rotation alone moved the first repeat from 12 to 31 minutes.

## THE GAME (tools/bohemia_sounds_the_songs_go_in_patch.py, re-run): the book is the thirteen and the twelve, 25 songs, each
a row with no notes (its notes are its recording), OVERWORLD NIGHT, so the fence lets it play and the street, a fight and
the song after a battle draw it; the opening never opens on one (no live engine under it while it decodes).

## THE CARDS (rule 488(c)): one per song, TAB: VOTE, the three-levels page naming the song and this list: 1, 2, 3 and A
FIGHT. Each asks: A, keep it in the game; B, take it out. They are in the game already (EVERYTHING IS A THUMB).

## GATES
- MORE SONGS, THE SAME WAY (gates/more_songs_the_same_way_gate.py, new, in the suite): every song green on the music legs (the same way, the files, the tune leads, the pulse, the climb, each its own, the fingerprint: the sixteen's mean 0.617, the closest pair 0.924, LAKE MEAD and THE SODA MACHINE); the book and the card legs after the cards: see the commit.
- EVERY SONG IN TURN (gates/every_song_in_turn_gate.js, new, in the suite, with THE PLANT: the old draw): 24 passed, 0 failed (alpha and demo).
- THE SONGS GO IN (re-aimed: the book is the thirteen plus every song in more_songs): the files and the book 25 of 25 green; the live demo with SONG set to a new one (THE MONORAIL RUNS WITH NOBODY ON IT) on the phone at 4x and the computer: the map plays it from its recording at level 1, never chops; every turn heard on a beat within 0.52 s (33 turns); a hit into 3, 17 of 17; his turn over theirs 8.1 dB through a phone; the music from the fight's first frame; back to 1 after, the rotation then taking another new song. Two legs red, both on the quarantine list before this round (THE SONGS GO IN, LOAD): 'IT NEVER CHOPS' 1 jump on the slowed phone with two demo walks on the box at once (re-run alone on the box with the new song: 137 passed, 0 failed, 0 jumps in 950 windows), and 'THE BEAT ON THE GRID', a measure that reads the same file 0 ms at 44.1 kHz and 75 ms at 24 kHz and flags 7 of the old 13 too (CAMPFIRE CONFESSION and REPO MAN on this run); the new songs' drums are placed on the grid by the render itself, to the sample. Its re-aim (read the kit, not the swell of a slow lead) is routed below.
- FOUR NEW SONGS, EACH ITS OWN (the four's own gate, the shared tool changed): 106 passed, 0 failed (the four's files untouched).

## SAID OUT LOUD
- Nobody's ear is claimed. The songs are chosen and checked by numbers and by their pictures (a spectrogram of the tune
  alone shows each note where it was written); he is the ear, on the cards.
- A new song has no live engine: until its recording decodes it is silent (THE SONGS GO IN's rule). The rotation loads the
  next song a phrase early, so on the road it is in; straight after a fight the queued song is held as bytes and decodes in
  under a second on the computer (the phone not measured this round).
- The two shared origin songs and the faction songs at three levels (rule 237(e)) are the next jobs, not this round's.

## ROUND TWO (the routine 'keep cooking', BUILD 11/27w): EVERY ORIGIN ITS OWN SONG, THE PART OF TOWN, THE NEXT BATCH
- MEASURED: 15 origins on 13 faction songs; THE FAITHFUL and THE PROMISE KEEPERS shared the CHURCH's, THE DESERTERS and THE
  HUNTERS the REMNANTS'. The tape (the squad up close) asks for the origin's song at 15.0 s and ends at 20.3 s; the first play
  lands at 23.7 s (the demo, the phone profile). So the whole tape plays before any song recording may load (FIRST PLAY IS
  LIGHT, P4), and a recorded song there would be silent.
- BUILT: an origin may name one of HIS OWN road songs ('SONG:<name>' in ORIGIN_SONG), which his engine plays at once: THE
  PROMISE KEEPERS ('a promise you made at a grave') THE ORGAN IN THE DROWNED CHAPEL, THE HUNTERS ('you track what came out of
  the lab; it tracks you back') SLOW CREEP. Fifteen origins, fifteen different songs; THE FAITHFUL keeps the CHURCH's and
  THE WATER TRUCK the CARAVANS' (his words). At home after the first play the song plays from its recording.
  MEASURED on the demo before the first play: each sounds at once from his engine (25 engine steps in 3 s, -24 to -38 dB on
  the music bus), 0 song files fetched.
- THE PART OF TOWN (rule 237(c)) was built 10/26 and stands: THE MAP PLAYS THE PART OF TOWN 17/0 (three districts their
  songs on the beat, the road an overworld song, now five origins' tapes their own songs). The faction songs: none missing
  (13 of 13); their remake at three levels (237(e)) is a batch like the twelve.
- THE NEXT BATCH WAITS ON ROOM: the published site is 899 of its 900 MB cap (PAGES PUBLISH). A song made this way is about
  2 MB; twelve more is 23 MB. Moving SOUNDS' reference recordings (his_night_songs, 6.2 MB) would free nothing: the publish
  list never carried them (it ships only what pages, code and cards name), tried and undone. What SOUNDS ships: the 25 songs'
  levels and hits, and 10.1 MB of A FIGHT previews that only the cards play (13 of those cards are already voted, so their
  previews can never be opened, but every card page names 'a_fight', so the list cannot tell them apart). The cap and the
  list are PLUMBER 8's: routed with these numbers.
- THE CARD: sounds3-every-origin-its-own-song-11-27 (TAB: VOTE), the three-levels page with its song picker on the two
  songs; THE VOTE CARDS PLAY with CARD set to it, the phone through the alpha's VOTE tab: 8/0.

## ROUND THREE (the routine 'the next songs and the drone', BUILD 11/27zr): THE DRONE HEARD (rule 490, with ARMORY 3)
- MEASURED: the fight had no name for the drone's or the rocket's sounds: the launch and the scout drone posted 'power_on', the
  landing and the rocket's house a gunshot (the shooter's rifle). ARMORY 3's record: 'SOUNDS owes a drone's whine and a blast'.
  The new guns' bursts were already real: every round of a burst or the belt plays a real gun (THE BULLET LANDS, per its gun).
- BUILT IN THE OWNING PLACES (rule 495, no new patch layer): the fight names them ('drone_up', 'blast', 'drone_down'); three voices
  in tools/bohemia_bullet_lands.py from real CC0 recordings through the same street, camcorder and tape (the whine: a vacuum motor
  sped up 2.5 to 2.8 times, a helicopter's rotor, an insect swarm; the blast: a far gunshot slowed to a third, a near crack, glass,
  gravel, a door slammed slow; the drone down: a pop, the motor dying, steel and gravel); levels through the game's own chain (the
  blast -12, 8 dB over a gun; the whine -22; the drone down -19); engine/bohemia_bullet_lands.js plays them and falls back to what
  played before until the sprite is in. Every old voice re-rendered identical; the sprite 91.8 -> 104.4 s, 735 -> 836 KB.
- GATES: THE BULLET LANDS 17/0 (new legs: the three voices played and placed, the fallback, the fight naming them; the demo's real
  fight); THE GUNS GROW UP 23/0; ALPHA LOADS 20/0. The card's page on a phone: LOADING, then PLAYING; the file blocked, plain words.
- THE CARD: sounds3-the-drone-heard-11-27 (TAB: VOTE), five buttons: it goes up, it lands, shot down, and the two as a fight plays them.
