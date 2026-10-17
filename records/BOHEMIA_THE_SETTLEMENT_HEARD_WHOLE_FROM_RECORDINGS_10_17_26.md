# THE SETTLEMENT HEARD WHOLE, FROM REAL RECORDINGS

SOUNDS lane, 10/17/26, THE BIG SWING (VAMILY rule 110). Rows `[from a recording]` (rule 108b, round one)
and `[the settlement's sounds]` (round three). MODE line, the coordinator's words: *"one settlement screen
heard whole: every building its sound from a recording, the bed under it, in VOTE playing. Run it to the end
of the round, no check-in, no question."*

Paolo 10/9: *"there's so many sounds in Battle Brothers, from ambience to the clinking of someone working in
the city, and we're not even touching the surface."* Paolo 10/10: stop making sounds that sound coded; a sound
starts from a recording (rule 108b). Paolo 10/10, to this chat: *"create more of the best sounds of all time
instead of implementing mid sounds."*

## THE CLAIM (rule 97)

I read this as: he hears a real recording answer every building on the settlement screen, with a real bed
under it, in the VOTE tab. I intend to: pull CC0 Freesound recordings through the one host this box can
reach, run them through the day-one chain, and put the real screen in a frame that answers its own taps.
Two up: Paolo wants "stop making sounds that sound coded"; the coordinator wants the engine's oscillator
calls retired one recording at a time.

## MEASURED FIRST: WHERE A RECORDING CAN COME FROM ON THIS BOX

The research (records/BOHEMIA_RESEARCH_THE_EXACT_PIPELINE_ROUND_TWO_10_10_26.md) named Sonniss and
Freesound. Neither is reachable from here, and neither is anything else that hosts sound:

```
freesound.org          000   CONNECT refused by the network policy
sonniss.com            000
archive.org            000
huggingface.co         000
upload.wikimedia.org   000
zenodo.org             000
opengameart.org        000
kenney.nl              000
github.com             OK    (the git proxy serves public repositories read-only)
pypi.org               200   (scipy, soundfile, pedalboard, pyroomacoustics installed from it)
```

So the recordings came from GitHub: **ESC-50** (github.com/karolpiczak/ESC-50) is 2,000 five-second
Freesound clips in 50 categories, and its LICENSE file names every clip's Freesound source, author and
licence. Counted: 868 clips are CC0 at the source, 899 CC-BY, 169 CC-BY-NC, 60 Sampling+. ONLY CC0 IS USED,
and the tool refuses anything else by reading that file (`tools/bohemia_from_a_recording.py`,
`freeze_sources`). 678 CC0 clips in the 38 categories a settlement could use were fetched by a blobless
sparse checkout (260 MB in the scratchpad, never in the repo).

THE HONEST LINE ON THE LICENCE: the dataset as a compilation is CC BY-NC 3.0; the clips used are CC0 at the
source, which is the licence that matters for a sold game. The five-second cut is the dataset's, so before
the game ships each original is re-pulled by its Freesound id (frozen in
`tools/bohemia_from_a_recording_sources.json` and `reference/library/sound_bank/esc50_cc0/LICENCES.md`) on a
machine that can reach the site, so the shipped file is the author's own. Thirty-one sources, every one with
its URL, author and the word CC0 beside it.

## PICKED BY THE NUMBERS, NOT BY AN EAR THIS LANE DOES NOT HAVE

Every fetched clip was measured (`scratchpad/measure.py`, 678 rows): peak, clipping share, noise floor (the
10th percentile of 50 ms frames), top (97th), dynamic range, active share, onset count, spectral centroid,
energy under 200 Hz and over 4 kHz, first and last loud frame. The picks:

| building | the recording | why this one, in numbers |
|---|---|---|
| THE HALL (who wants work) | a church clock striking (JarredGibb) + boots in a factory hall (RutgerMuller) | the bell: 3 onsets, no clipping, 1.5 kHz centroid; the boots: 14 onsets, floor -49 dB |
| THE BOARD | wood knocks (RutgerMuller), at 1.25x | 3 onsets in 1.3 s, 772 Hz centroid: a knuckle, made a tack |
| THE CLINIC open / shut | a door hinge creak (tec studios) / a door's own close (E-Audio, close mic) | the creak: 2.1 s, peak 1.0, clip 0.08 percent; the shut: the last onset, 81 percent of its energy under 200 Hz |
| THE STALL tap / buy | a soda can opened (timgormly) / a can set down (Reitanna) | 1.2 s, 6 onsets, no clipping / 1.0 s, 85 percent low |
| THE BARBER | a vacuum cleaner's motor (MrAuralization) at 0.5x, 90 Hz to 2.6 kHz | the lowest-centroid motor in the set (596 Hz), 9 onsets of variation, no clipping |
| THE YARD | sneakers on gravel (MentalSanityOff) + a sportsman breathing (mariiao2) | 14 onsets; the breath 2.65 s, 76 percent low |
| THE BAR, a round | a drink going down (sagetyrtle) + a laughing man (scottemoil) | 2.9 s / 22 onsets |
| GUNS AND PLATE | mouse clicks (davidkyoku) at 0.7x + a drum-shell tick (RutgerMuller) at 0.8x | 6 onsets, 2.75 kHz centroid slowed to about 1.9 kHz; a counter thump |
| THE SMITH | a hand saw through wood (Pingel) | 25 onsets in 4.9 s, peak 0.94: someone working |
| THE ARMOURER | a door knock (Coonick) at 1.4x, twice | 4 onsets, clip 0.03 percent |
| SCAVENGE | glass breaking (avrahamy) + an angry crow flock (conleec) | the quietest glass (peak 0.48, no clipping); 2.25 s of crows |
| BUILD | a wood saw (Ohrwurm) + wood knocks (RutgerMuller) twice | 21 onsets / 3 |
| BED, DAY | wind (toiletrolltube) + chicken chatter (jsbarrett) + binaural birds (dwareing) + a rooster once (dudermensch), far | the steadiest wind (dyn 9.9 dB, no onsets); hens peak 0.30 |
| BED, NIGHT | winter wind (klangfabrik) + soft crickets (rayjensen) + a fire crackling (kingsrow) | wind dyn 3.2 dB; crickets peak 0.06, the quietest; fire 78 percent low |
| THE BAR, murmur | laughs2 (sagetyrtle) + male laughter (Eneasz) + a laughing man (scottemoil) + a sip through ice (MentalSanityOff) | the two quietest laughs in the set (peaks 0.12 and 0.10, active 80 to 87 percent): people, not a joke |
| FAR | a car horn, a helicopter pass, a crow, a civil defence siren (night) | one every 14 to 32 s, never two |

The dog is not in the bed on purpose (his eleventh votes: the dog sound goes), nor a generator ("the music
is already there"). Real crickets at night are a different thing from the synthesised insects he turned down
on the travel clip; they are in the night bed at -6 dB under the wind, and the vote will say.

## THE CHAIN, STAGE BY STAGE (`tools/bohemia_from_a_recording.py`)

1. WINDOW: a start and an end inside the clip (by hand, by the first loud frame, or by the last onset), a
   3 ms fade in and 40 ms out; the whole rendered file gets a 12 ms fade in and 30 ms out again at the end.
2. SPEED: a rational resample where a thing has to be smaller or heavier than it was recorded.
3. HIGH-PASS 120 Hz, second order (Pedalboard).
4. TAPE: a +2.5 dB low shelf at 110 Hz (the head bump), tanh saturation at drive 1.6, wow at 0.6 Hz and
   0.08 percent plus flutter at 5.1 Hz and 0.025 percent as a time-varying resample, a 2:1 compressor at
   -18 dB. CHOW Tape is not here (no VST on this box; the plan's own fallback line applies and this is it).
5. LOW-PASS 9 kHz, second order.
6. ROOM: a shoebox of stated size with the absorption Sabine's formula needs for a stated reverb time
   (`pyroomacoustics.inverse_sabine`), image-source for the small rooms, ray tracing for the big ones, at the
   stated wet share. A model's render in 108b's words; EchoThief's real rooms are behind the same wall.
   Measured on the rendered responses: the clinic's and the barber's front room 0.31 s (asked 0.35), the
   smith's shed 0.25 s, the hall 1.70 s (asked 1.3; ray tracing lands long), the bar 0.87 s (asked 0.55).
7. LIMITER at the ceiling, then the mp3 is DECODED BACK and re-encoded lower if the codec overshot (an mp3
   of a sharp transient lands about 1 dB over its own input; two did on the first pass).

`--check` re-reads every rendered file: peak under -1 dBFS on the decoded mp3, first and last millisecond
under -26 and -40 dB (no click), every source CC0. **CHECK PASS: 14 sounds, 3 beds, 4 events.** Files: 2.6 MB
in `slices/vote/settlement_heard/` (mp3 at 80 to 96 kbps mono, a `before_` file beside each for the A/B);
the chosen source clips 5.4 MB as FLAC in `reference/library/sound_bank/esc50_cc0/`, not published.

## THE PAGE: THE REAL SCREEN, HEARD (`slices/BOHEMIA_THE_SETTLEMENT_HEARD_WHOLE_10_17_26.html`)

The real `BOHEMIA_SETTLEMENT_SCREEN.html` sits in a frame, untouched. Its code is a closure, so nothing is
patched: the page WATCHES the sheet the screen opens (a MutationObserver on `#sheet`) and answers the keeper
it names ("CHUY, THE BARBER" is the barber, "YOU" with the word build in the sheet is the lot being built,
else scavenge). The clinic's door, the stall's buy and the bar's round come over the screen's own
`BOHEMIA_SFX` postMessage bridge, the road the game itself uses, so NIGHT_TRIM 0.5 arrives in the message.
Web Audio: the mp3s decoded once, one master gain; the beds play as two overlapped copies with a one-second
equal-power crossfade so the codec's padding never clicks at the seam; the bar's murmur loops while the bar
is open and stops when it closes. DAY / NIGHT posts `BOHEMIA_SETTLEMENT_OPEN {night}` to the real screen and
swaps the bed. Below the frame: one card per sound with PLAY (after the chain) and RAW (the cut as it was),
its line, its room and wet share, its author and Freesound link and the word CC0.

PROVED ON A DRIVEN PHONE (390x844, over http, `scratchpad/prove.js`): the screen reports live; SOUND ON
starts `bed_day`; a real pointer tap on each of the ten buildings (the sheet closed first, the way the
settlement gate taps) opens that keeper and plays that file:

```
barber   -> CHUY, THE BARBER      -> barber_clippers
stall    -> NENA, AT THE STALL    -> stall_can
board    -> THE ELDER             -> board_nail
hall     -> LUPE, AT THE HALL     -> hall_who_wants_work
clinic   -> DOC ROSALES           -> clinic_door_open, and clinic_door_shut on close
bar      -> MANNY, BEHIND THE BAR -> the murmur bed starts; stops when the bar closes
smith    -> RUBEN, THE SMITH      -> smith_saw
armourer -> IRMA, THE ARMOURER    -> armourer_rivets
lot      -> YOU                   -> lot_scavenge
build    -> YOU                   -> build_hammer_and_saw
NIGHT    -> bed_night; smith_saw@0.5, clinic_door_open@0.5
cards    -> 14 buildings + 7 beds and far things; RAW plays before_hall_who_wants_work
errors   -> 0
```

The first proof run missed four buildings: the taps landed on an open sheet, and then on the page below
the frame because the frame's bottom sat past the phone's viewport. Both were the driver's faults (close the
sheet first; scroll the frame into view), fixed in the driver, not the page.

## REGISTERED

`sounds-the-settlement-heard-whole-10-17`, kind sound, draft:true, two sentences ending in "you hear it",
options A (the whole screen heard like this) / B (the beds only, the taps stay as they were). It is a
candidate. NOTHING IS WIRED INTO THE GAME: unjudged is silent, and the engine's oscillator calls retire only
after his vote, one per round, as the row says.

## WHAT THIS ROUND DID NOT DO, SAID PLAINLY

- No engine call retired yet: the row's END STATE says "replacing one oscillator call in the sound engine",
  and that is the wiring that waits on the vote. The chain and the files exist; the wire is one line each.
- The tape stage is a built one, not CHOW Tape; the room is a model, not a measured room. Both are the
  plan's own named fallbacks and both are swapped the day the network lets a real one in.
- DIRECTION's bible rule 8 (tape damage lives inside speakers) and 108b's chain (tape on every recording)
  pull against each other on a door under your own ear. The wow and flutter here is 0.08 percent, under
  what a listener names as wobble; the question is DIRECTION's to rule, not this lane's to decide by
  building. Named, not decided.
- The ESC-50 clone's `audio/` folder stays in the scratchpad; only the 31 chosen clips entered the repo.

## NEXT

His vote. On A: wire each building's file into the settlement screen's own `sfx()` and retire the matching
engine call, one per round, the before-and-after on each row. On B: the beds only. Either way the chain is
now a tool any lane can point at a recording.
