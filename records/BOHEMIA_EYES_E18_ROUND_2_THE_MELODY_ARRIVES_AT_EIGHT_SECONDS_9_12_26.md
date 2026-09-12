# EYES AND EARS -- E18 [he can hear it] ROUND TWO: THE CHECK
## "OUR PATIENCE IS IN THE WRONG ELEMENT, AND THE LEAD HE NAMED NEVER SOUNDS"
### 9/12/26 -- lane 17, round two of two. School was records/BOHEMIA_EYES_E18_ROUND_1_SCHOOL_THE_ANCHOR_HAS_NO_NUMBER_9_12_26.md

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED). Round one learned the subject and measured
nothing. This is the check: the instrument is built, proven to bite, and run.

---

## THE TWO SIDES, BOTH NAMED BY HIM

**THE CANDIDATE.** THE MARKER ON THE DOOR, tagged OVERWORLD DAY by his own hand. Paolo
8/2: *"The marker on the door at full intensity is now one of my new favorite songs that
you've made great job."*

**THE ANCHOR.** BESAID ISLAND, FINAL FANTASY X Original Soundtrack, disc 1 track 18,
composed **and arranged** by **Masashi Hamauzu**, the ORIGINAL and not the remaster
(Paolo 9/7, *"look at this song bro"*).

---

## THE FOUR AXES, ONE NUMBER A SIDE, NO TOTAL

| axis | OURS, measured | THE REFERENCE | what it says |
|---|---|---|---|
| **TEMPO** | **120.0 BPM.** Step 0.125 s, four steps a beat, beat 0.5 s. Swing measured at +6.25 ms on the odd sixteenths, and the row asks for 6.25 ms. | **UNKNOWN** for the original | fixed by law, never a gap |
| **ENTRY** | drums **0.000 s**, bass **0.000 s**, **melody 8.000 s** (bar 4, the first B section) | the beat arrives LATE over a melody already playing | **the arrangement is inverted** |
| **BASS** | 114 notes on ABYSSBASS from 0.000 s; **77.3%** of the energy under 150 Hz | a played bass line under the melody | present on both sides |
| **MELODY** | 24 notes, one per second, the row's own [0,2,4,7,9] (a **major pentatonic**) played from D and then F#, D4 to D#5. Parsons `UDUDUUDUUDUDUUDUUDUDUUD`. Longest rise 2, longest fall 1. | a picked, patient line, warm with something sad under it | measured on ours, cited on the reference |
| **INSTRUMENTATION** | a triangle oscillator through a 2200 Hz lowpass carries the tune; ABYSSBASS the floor, NIGHTPAD the room, KNOCK and TIGHT the kit | real violin, hand percussion, picked strings, played by people | **not comparable, on purpose** |

Our loudness: **-31.06 dBFS rms, -7.82 dBFS peak, crest 23.24 dB.** No loudness match was
performed, because the reference recording is not in this repo and is not going to be.
The trade matches loudness before any A/B; we cannot, and that is a blank, not a number.

---

## THE HEADLINE: OUR PATIENCE IS POINTED AT THE WRONG ELEMENT

Eight seconds of drums and bass before a single melody note. The reference is described
the other way round: a melody already playing when the beat arrives, and that lateness is
named as part of what listeners loved.

So the song is not impatient. **It is patient backwards.** Same virtue, opposite element.
That is the one axis on this card where a change is possible and cheap, and which way to
move it is SOUNDS' call and DIRECTION's, never this lane's.

## AND THE ROLE CHECK FOUND SOMETHING NOBODY WAS LOOKING FOR

Instrumentation cannot be scored, so round one specified a ROLE check instead: is each
voice doing the job the arrangement needs. Running it:

**THE LEAD VOICE NAMED IN THE ROW IS SCHEDULED ZERO TIMES IN TWENTY-FOUR BARS.**

The row says `inst:{b:'abyssbass', l:'brokenrosary'}`. The batch 22 verdict records the
song as *"THE MARKER ON THE DOOR (lead brokenrosary, rhythm inside one note)"* and says
*"brokenrosary is the lead he named"*. The voice ledger describes its mechanism as
*"rhythm INSIDE one note: the same pitch re-struck within its own duration"*.

It never plays. The engine's melody branch reaches the named lead **only** when `mel` is
`'hymn'` or the lead is `'bell'`. This song is `mel:'longs'`, so the melody falls through
to the branch that builds a bare oscillator into a lowpass, and `brokenrosary` is never
called. Whatever he liked on 8/2, it was not that voice.

Not this lane's to fix. SOUNDS and COMBAT own the engine; this lane measured it.

---

## HOW OURS WAS MEASURED, AND WHY IT IS THE ENGINE'S OWN ANSWER

The song is a parameter row, not a recording. Reading that row in python and working out
what it sounds like would have measured **my arithmetic**, not his song. So:

- the shipped alpha is opened in real Chromium, the MUSIC tab is tapped, and `MUS.AC` and
  `MUS.MAST` are pointed at an `OfflineAudioContext`;
- the engine's own `MUS.playStep()` runs for every step at the engine's own `MUS.stepDur()`,
  with `MUS.fac()` returning the song under test;
- `synthV`, `drumV` **and** `createOscillator` are wrapped for the duration of the render,
  so the note list is what the engine actually scheduled: instrument, pitch, time;
- everything is put back afterwards, because leaving a wrapper on the live rack would
  change the game for whatever ran next.

That is the same principle `tools/bohemia_sfx_instrument_measure.py` (8/19) states bluntly
about its own first version: measuring on a clean wire is *"a ruler for a signal chain
nobody uses"*. And it sidesteps round one's worst failure mode by construction -- the
engine's schedule is not an estimate, so there is no beat tracker to make an octave error.

---

## FOUR MISTAKES THIS ROUND MADE, ALL FOUND BEFORE ANY NUMBER SHIPPED

**1. THE NOTE LOG WAS BLIND TO HALF THE ENGINE.** The first render wrapped only `synthV`
and `drumV`. It logged 359 notes and **not one melody note**, and the tempting read was
"the melody never plays". It does. This engine writes some notes with a named voice out of
the 602-voice rack and others as a bare `createOscillator` into a lowpass, and for
`mel:'longs'` the melody is the bare kind. **A note log blind to half the ways the engine
makes a note is a log that invents silences.** Fixed by wrapping oscillator creation too,
with a depth counter so the scheduler's own notes are told apart from the oscillators a
voice builds inside itself. It is now control C1b.

**2. A CONTROL FAILED BECAUSE ITS QUESTION WAS UNANSWERABLE.** The cross-check between the
engine's schedule and the sound that came out asks an onset detector where the first hit
is. An onset detector finds RISES, and a song beginning at t=0 begins already loud, so
there was no rise to find. The two instruments were not disagreeing; the question could
not be asked. Fixed with half a second of silence in front of the render, subtracted back
out of every time reported.

**3. THE TEMPO ROW PRINTED 228.57 BPM, AND IT WAS MY MISTAKE, NOT THE SONG'S.** Pointing
the interval estimator at the drum stream measures the spacing of drum **onsets**, and
this kit puts a kick and a hat on different sixteenths, so the median interval is one
STEP, not one beat. The number was arithmetically correct about the wrong quantity and it
sat in a row headed TEMPO, which is worse than no number. Now the step is measured, called
the step, and the beat is derived from the engine's four-steps-a-beat grid -- and the
0.13125 s the drums actually measure is explained as the 0.125 s step **plus the swing**,
rather than printed next to 120 BPM as a contradiction.

**4. THE SCALE READ "UNRECOGNISED", AND THAT WAS THE WRONG UNIT.** Pooling every melody
note across the song gave nine pitch classes matching nothing, which read as a fault in
the song. The engine transposes by a root shift per section (its own `RT` table), so the
union of two transposed pentatonics matches nothing by construction. Named per section it
is one five-note pattern moved by four semitones. A second pass then named the two sections
"D major pentatonic and D# minor pentatonic" -- both correct for their pitch sets, and
together a contradiction on the page. Fixed by reporting what the engine actually did:
**the row's own pattern, transposed**, with the pattern named once.

---

## RULE ZERO: NINE CONTROLS, ALL PASS OR NOTHING PRINTS

- **C1a** the render is sound, not silence.
- **C1b** the note log can see every way this engine makes a note -- mistake 1, turned into
  a control so it cannot be walked into twice.
- **C1c** the audio agrees with the engine's schedule on the first onset. Two independent
  instruments agreeing is worth more than either alone.
- **C1d** the render really used **this song's** settings: the swing measures back at
  6.25 ms and the row asks for 6.25 ms. That is the proof it is not the engine's defaults.
- **C2a/C2b** the octave-error control round one made mandatory: a click train at 120 reads
  120, and the same train at half speed reads **60 and not 120**.
- **C3a/C3b** a melody against itself reads identical (1.0); against its own inversion reads
  maximally different (0.0). A contour metric that cannot separate those is not measuring
  shape.
- **C4** a planted onset at 1.25 s is found within 30 ms.

---

## WHAT THIS CARD DELIBERATELY DOES NOT CONTAIN

**No score, no percentage, no ranking of the 181 song rows by distance from Besaid.** Round
one found the same warning twice from opposite directions: outside, the trade's own name
for it is *temp love*, and on Arrival the temp track beat everything the composer wrote;
inside, `tools/bohemia_where_his_taste_lives.py` exists because batch 25 was swept 0 for 8
by a gate that rewarded distance from the voices he had already approved. A ruler pointed
at something beloved reports that everything else is worse, which is true and useless.

**No reference number that cannot be sourced.** Every value in the reference column carries
the source that says it, and `UNKNOWN` appears twice because it is the honest answer twice.

---

## THE GATE, AND WHY IT RATCHETS NOTHING

`tools/bohemia_eyes_hear.py --gate`, in the suite as **HE CAN HEAR IT**. It holds three
things:

1. **every reference value carries its source.** A value that loses its source becomes a
   number somebody made up, which is exactly the rot E11 found in CLAUDE.md's own index.
2. **the shipped song row still matches the row that was measured**, or the numbers
   describe a song that no longer exists. Proven to bite: a changed `swing` reds it.
   (Its first cut reddened on a row that had not changed, because `find('},')` stopped
   inside the nested `inst:{...}` and the field was outside the text being searched. The
   gate biting on its own parser is the system working; the fix belonged in the parser.)
3. **all nine controls pass.**

Nothing is ratcheted, on purpose. There is no count here that can only get worse: the card
is a description, not a defect tally. Ratcheting a description would red the fleet's suite
the first time SOUNDS legitimately changed the song.

---

## FLAGS FOR THE COORDINATOR, NOT THIS LANE'S TO FIX
- `laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md` describes the
  original-versus-remaster difference in the opposite direction to every source reachable
  in round one, and implies the wrong composer for the one track he named. Every reference
  value here that leans on that law is marked with it.
- The lead voice named in the song row and in his own 8/2 verdict is scheduled zero times.

## ROUTED
- **SOUNDS** -- the axis card [sound card] asked for is `banks/eyes/BOHEMIA_EYES_E18_AXIS_CARD_9_12_26.json`,
  draft:true. The one change it points at is the entry: our patience is backwards.
- **SOUNDS and COMBAT** -- `brokenrosary` never sounds in this song.
- **THE COORDINATOR** -- the 9/6 sound law's reference facts.

## BLIND SPOTS, DECLARED
- No loudness match, because the reference is not in the machine and will not be.
- The reference column is description, not measurement. Nothing here compares two waveforms.
- The bass voice is a rack voice, so its pitch is not in the note log; its register is
  reported as band energy rather than as semitones.
- Twenty-four bars is the arrangement measured. A longer run reaches sections C and D,
  which schedule differently.
- One song of 181 rows. This is the anchor pair he named, not a survey.

## FILES
- `tools/bohemia_eyes_hear.js` -- the render half, through the engine's own scheduler
- `tools/bohemia_eyes_hear.py` -- the axes, the controls, the gate
- `records/BOHEMIA_EYES_E18_RENDER_9_12_26.json` -- the note log and the row, as rendered
- `records/BOHEMIA_EYES_E18_AXES_9_12_26.json` -- the measured card
- `records/BOHEMIA_EYES_E18_MARKER.wav` -- 51 seconds of the song, kept out of `records/target`
  on purpose so a published surface at 247 of its 260 MB does not carry 4.5 MB nobody opens
- `banks/eyes/BOHEMIA_EYES_E18_AXIS_CARD_9_12_26.json` -- the card for SOUNDS, draft:true
