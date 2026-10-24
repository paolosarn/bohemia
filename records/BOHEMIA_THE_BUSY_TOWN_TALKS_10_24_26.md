# THE BUSY TOWN TALKS (RUN TWO, 10/24/26, row [the busy town talks], rules 131 and 135)

PAOLO 10/23 (rule 131): 'in the settlement you don't have to make every character matter; I would like to see characters you
can't even interact with walking around the settlement, doing something, doing important things; but everyone that needs to
get clicked on stands still, always.' PAOLO 10/24 (rule 135): 'we have squiggle voices... every time people speak... it's
supposed to be this Animal Crossing style squiggle voice, but maybe it could be more creepy.' The coordinator's brief for this
round: the keeper you tap speaks his line in the new squiggle; the walkers at their jobs make the small sounds of the job and
now and then mutter a squiggle to each other as they pass, quiet, never a line to read; a town at night should feel different
from a town at noon. No card (rule 127): he meets it in the next town.

## WHAT WAS THERE BEFORE (measured 10/24)

- The walkers (row [the settlement is busy], 10/23) walked their lanes and stopped at the ends of their round in silence.
- A keeper tapped already spoke in SOUNDS' recorded squiggle (BUILD 10/24c: engine/bohemia_crew_faces.js talk() posts the line
  to the shell's one voice) whenever his head was a fresh portrait. A speaker whose head was the dim shape (his file missed)
  moved no mouth and said nothing.
- The screen's own sound (engine/bohemia_settlement_heard.js, SOUNDS) had a building's tap, the bar's murmur, the desert bed
  and the far things; nothing from the people on the street.

## WHAT IT DOES NOW

slices/bohemia_busy_heard.js, called once a frame by slices/BOHEMIA_SETTLEMENT_SCREEN.html (busyHeard(), heardInput()):

| | noon | night |
|---|---|---|
| the jobs | crates (set down at one end, the next lifted at the other), a hammer (a strike a beat, now and then a quick tap to set the nail), a pot and its lid, a broom (a stroke a beat, there and back) | the first walker is ALWAYS the watchman: his boots, one a beat, only while he walks (the only footsteps in town); the others a cook fire crackling and a late crate; no hammer, no broom (people sleep) |
| the level | each job by its own gain, panned to where he stands, quieter on the far lane, a third off the edge of the glass | the same, at 0.6 (the valley is quieter after dark), the watchman's boots untrimmed: they are the night |
| the mutter | two who cross (on a lane, or a word called across the street), or a walker going by a man in the crowd (who may answer) or a keeper at his door (greeted; the keeper keeps his voice for you); a chance of 0.6, at most one every 9 s (7 on market day); full voice at 0.34, a 6 kHz top; an answer six times in ten, a beat after | A WHISPER: 0.20, a 2.6 kHz top (close and low), the squiggle's own mood at arousal -0.7 (slower, lower), a chance of 0.45, at most one every 16 s, an answer three times in ten |
| the voice from the dark | none | once in a night visit, maybe (one in two, 20 to 60 s in): a voice nobody on the glass owns, at the very edge of the screen, 1.5 kHz top, 0.09, saying 'Come out here.' or 'I know you're awake.' |

- ON THE BEAT: every event of a job is booked on the screen's 120 BPM grid (a beat or its half), 150 ms ahead on the context's
  clock, minus the clip's own 38 ms onset; one that the frame reached too late is dropped, never played off the beat.
- A MAN, NOT A LOOP: every strike is pitched a hair apart (0.95 to 1.05), the takes alternate, never the same take at the
  same pitch twice running.
- THE VOICE IS THE PERSON: a walker's mutter is castVoice('face:' + look), the voice the shell gives that same face when he
  talks to you (ONE ID, ONE WHOLE PERSON), said by SOUNDS' recorded squiggle (engine/bohemia_voice_recorded.js): his family,
  his pitch, the tape a little wrong. The lines are draft:true and never shown anywhere; they only give the squiggle its
  letters (Spanglish, theirs; the player never speaks it).
- THE KEEPER IS THE ONE YOU HEAR: no mutter starts while a sheet is open, a sheet opening cuts a live one in 15 ms (the
  squiggle's own fade, never a click) and ducks the jobs to 0.35 under the keeper's line.
- ONE BANK ON THE PHONE: the decoded squiggle (125.7 s, about 22 MB as floats) is BORROWED from the shell (window.top.SQUIGGLE;
  an AudioBuffer is not tied to the context that decoded it), so the frame never decodes it twice; a screen opened alone (a
  gate) loads its own.
- A DIM HEAD IS STILL HEARD: a speaker whose head file missed posts his line to the shell's one voice in his own voice
  (face:<look>, or city:settle:<place>:<who>); only the mouth stays still.
- SILENT WHEN IT SHOULD BE: nothing before the first tap (a phone plays nothing before one), nothing while the frame is hidden
  (BohemiaHeard's own watch), a mutter cut the moment the frame hides.

## THE SOUNDS OF THE JOBS (tools/bohemia_run2_job_sounds.py, slices/settlement/heard_jobs/, 52 KB)

Eleven clips, ONE EVENT each, every one a window of a CC0 Freesound recording already in SOUNDS' bank
(reference/library/sound_bank/esc50_cc0), through SOUNDS' own chain (tools/bohemia_from_a_recording.py: window, speed,
high-pass, tape, low-pass, limiter), outdoors (no room: a man working in the street). Nothing generated (9/23: no sand).

| clip | the job | from |
|---|---|---|
| crate_a, crate_b | crate | a big wood door knock (aroth4) slowed 0.62; a drum shell tick (RutgerMuller) slowed 0.58 |
| hammer_a, hammer_b | hammer | two knocks of one door knock (Coonick) |
| pot_a, pot_b | pot | a heavy can set down (Reitanna) slowed 0.78; a soda can's tab (timgormly) slowed 0.72 |
| broom_a, broom_b | broom | sneakers scuffing gravel (MentalSanityOff), the low end off at 1.4 kHz: bristles |
| boot_a, boot_b | the watchman | steps in a factory hall on concrete (RutgerMuller) |
| fire | the cook fire | a fire crackling (kingsrow), 2.2 s |

--check: 11 of 11 clean (no click in the first or last 3 ms, peak under -1 dBFS).

## MEASURED (gates/the_busy_town_talks_gate.js, 20/0)

- T1: every walker has a job; camp crate+hammer+pot+broom, camp at night guard+fire, town hammer+pot+broom+crate+hammer+pot,
  town at night guard+crate+fire, fortress likewise; the same twice.
- T2: a market-day town, 60 s: 101 job sounds, 0 off the beat; every day job heard; 0 repeats; on the glass the same job is
  quieter on the far lane (0.157 against 0.179).
- T3: 6 mutters in that minute, at least 7 s apart; 0 with a sheet open; at night 2 a minute; the voice from the dark came
  twice in four night minutes (four visits).
- T5 LIVE, on the effects bus (the analyser on BohemiaHeard's own EFFECTS gain): a building's tap -11.9 dB (loudest 93 ms),
  the loudest job alone on the glass -35.9 dB, a mutter -29.6 dB; the keeper's line through the shell is -22 dB (SOUNDS 10/24),
  so a mutter sits about 8 dB under the man you tapped; a night mutter at 0.141 against the day's 0.271.
- T6: a live mutter cut to 0 by a sheet opening, the jobs at 0.35.
- T7 THE DEMO, through its door, a town opened from the map: Caravans, 7 job sounds in its first seconds (pot, hammer, broom,
  crate), the squiggle BORROWED; the stall's keeper tapped with a real touch said 'Market day. Everybody is out, everything is
  moving. Good day to sell, bad day to buy.' in the recorded squiggle, face:person_colorful_7. Nothing threw.
- Found in the demo: a town that is sick or raided has ONE walker (the busy row's own rule), so it is nearly silent: the
  quiet of a sick town, kept.

## GATES RUN (rule 13: the pre-push pass; the full suite unmeasured since this round)

THE BUSY TOWN TALKS 20/0 (new), SETTLEMENT HEARD 21/0 (one run 20/1: a far thing landed in the build tap's 3 s window; 21/0 on
the same tree and on clean main), THE SETTLEMENT IS BUSY 10/0, THE SETTLEMENT SCREEN 74/0, THE TOWN AND THE HIRE 11/0, ONE SONG
ONLY 16/0, THE KEEPERS SPEAK 48/0, NO FACE FROM A BODY 23/0, THE FACE IS HIS OWN FACE 18/0, THE PEOPLE OF THE PLACE 40/0, ASK
THE CROWD 46/0, EVERY SPEAKER HAS A FACE 10/0 (9/1 once with seven browsers running at once: a mouth sampled late; 10/0 alone,
and on clean main). NOT THIS DIFF: NO TWO PEOPLE ALIKE 21/2, both reds THE MAP's legs (nobody on the glass twice at zoom 1 and
1.4), the map is RUN's file and untouched here.

## FILES

- slices/bohemia_busy_heard.js (new, RUN TWO): the player.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html (RUN TWO): three script tags (engine/bohemia_voice.js, engine/bohemia_voice_recorded.js,
  the player), heardInput()/busyHeard() in the loop, BohemiaSettlement.heardInput(t), a dim head heard.
- engine/bohemia_settlement_heard.js (SOUNDS): ONE additive export, BohemiaHeard.sink() (the screen's one context, EFFECTS, AMBIENCE),
  nothing else changed.
- tools/bohemia_run2_job_sounds.py, slices/settlement/heard_jobs/ (11 mp3 + manifest.json), gates/the_busy_town_talks_gate.js.

## ROUTED

- SOUNDS: the eleven are cut from your bank with your chain; recut or replace any of them in place (same ids) and the screen
  plays yours. The sink() export is yours to keep or rename (the player reads BohemiaHeard.sink()).
- ANIMATION: when the work clips land on the walk sheets ('work' columns), the sounds already fall where the stops are; a
  hammer clip's strike key on the beat would line up with the hammer sound (the stop's first beat is the first strike).
- WORDS: the mutter lines (DAY_LINES, NIGHT_LINES, the answers, the greetings, the dark) are draft:true and never shown; yours
  to rewrite, they only change the squiggle's letters.
