# EYES AND EARS -- E20 [song length] ROUND ONE: SCHOOL
## "128 IS NOT A BUFFER NUMBER, THE REST IS ALREADY BUILT, AND ONE ARRANGEMENT SERVES ALL 126 SONGS"
### 9/13/26 -- lane 17, round one of two. NOTHING ON THE SHIPPED SURFACE WAS MEASURED THIS ROUND.

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED). Round one is a whole VAMILY spent learning the
subject: how real games and real radio hand over between songs and let a place breathe. No
measuring. What I read instead is how OUR music engine is written, because front-page rule 12
says a premise is measured before it is built on, and this row's premise turns out to have
moved.

THE JOB (board row E20): *SOUNDS measured that the music never stops and that every song gets
exactly 128 seconds, the engine's loop length, a number about buffers and not about music, with
the next song starting on the very next beat and the ambience bed masked underneath forever.
School first: how real games and real radio hand over between songs and let a place breathe
between them; then the check: measure our handovers and the masked bed, on the real surface, and
hand SOUNDS the gap.*

---

## 0. THE PREMISE HAS ALREADY MOVED, AND SAYING SO IS THE FIRST JOB

`slices/BOHEMIA_ALPHA_0_9.html` carries a block marked `__THE_STREET_BREATHES__`, dated **9/11,
SOUNDS lane**, and it is wired. In the shuffle's own watch loop:

```
if (MUS.step >= 1024) { ...                 /* the 64-bar pass has ended */
  if (CITYMUS.beginRest()) return;          /* take the rest */
  CITYMUS.play(); return; }                 /* or fall through to the old hard cut */
```

`PHRASE: 128` -- **128 STEPS, eight bars, not 128 seconds** -- and `restLen()` asks the engine
for that one formula rather than copying it. The rest is **a duck, not a stop**, and the comment
gives the safety argument: `MUS.stop()` clears the scheduler, combat swaps the song in place on
a running transport and never calls `start()`, so a fight beginning on a stopped transport would
be silent, and the 120 BPM law is about a clock that does not stop. So the transport keeps
running, only the music master is ducked, the bed is on the SFX bus and is untouched, the level
is **captured and restored rather than typed**, and the rest is refused outright when the fight,
the menu or an interior owns the music.

**So the row's "the next song starts on the very next beat with nothing in between" describes the
build before 9/11.** Round two's job is therefore not to re-find that gap. It is to measure
whether the rest actually happens on the real surface, how long it really is, and whether the bed
is actually audible inside it -- because this lane's whole function is that a claim in source is
not a fact on the screen.

---

## 1. AND 128 SECONDS IS NOT A BUFFER NUMBER. IT IS A SIXTEEN-PART FORM.

The row calls 128 seconds *"the engine's loop length, a number about buffers and not about
music"*. Read the engine:

```
ARR: ['A','B','B','A','C','B','D','B','A','B','C','A','D','D','B','A']
RT:  [ 0,  0,  2,  0,  3,  2,  0,  1,  0,  2,  3,  0,  1,  2,  0,  0 ]
songCtx(step){ const bar = floor(step/16) % 64, si = floor(bar/4); ... }
```

Sixteen named sections, four bars each, sixty-four bars, at two seconds a bar: **128 seconds is
16 x 4 x 2.** That is an arrangement -- verse, chorus, bridge -- not a buffer size. The fleet
already has a gate asserting exactly this shape: `gates/combat_lab_gate.js` section 15 *"proves
the form is 16 sections / 128s with D first landing at 0:48 and doubled at 1:36"*.

**And here is the fault the row was reaching for and mis-named.** `ARR` and `RT` live on `MUS`.
**Not one song row in the shipped table carries its own arrangement** -- zero `arr` fields across
all 126 distinct songs in the alpha and the demo. So every song in the game plays
A B B A C B D B A B C A D D B A, with the key moving at the same sixteen moments, and the D
section landing at 0:48 every single time, in every single song, forever.

The length is identical **because the form is identical.** That is the same disease E19 measured
in the interface one round ago, and the reading there named it: *the tell is not ugliness, it is
fluency* -- the statistical average of itself, wearing the costume of competence. A hundred and
twenty-six songs with one skeleton is one song with a hundred and twenty-six paint jobs.

---

## 2. HOW RADIO ACTUALLY HANDS OVER: THE RULE BELONGS TO THE PAIR

- **Dead air is the profession's worst sin.** Among professional broadcasters it is considered
  one of the worst things that can happen, and it is normally the sound of a mistake. So radio's
  answer to a gap is: do not have one.
- **The fade exists as a cue, not as an aesthetic.** Records were faded so the DJ knew the end
  was coming and could talk over it into the next record.
- **A crossfade wants one to two seconds.** That is the working number.
- **And the important one:** stations schedule with **MusicMaster** or **Selector**, and those
  tools carry custom fields and **rules about the TRANSITION ITSELF** -- for example forbidding
  *"slow fade out into a slow build in"*. The handover is a property of the **pair**, not of
  either song.

## 3. HOW GAMES DO IT: THE SAME ANSWER, FROM A DIFFERENT INDUSTRY

- **Quantised transitions.** FMOD waits for the beginning of the nearest full bar before starting
  a transition; the quantisation grid can be bars, beats or smaller, and a smaller value buys a
  more agile change.
- **Transition regions, with the tail bleeding through.** FMOD crossfades the end of a loop with
  its own beginning so *reverb tails and the natural sustain of instruments play underneath the
  next pass*. A hard cut has no tail; a real handover does.
- **Stingers**, short motifs fired on an event and synchronised to the running music, often loud
  enough to cover a seam.
- **And Wwise's TRANSITION MATRIX: a custom transition defined for ANY PAIR of music states.**
  Exactly radio's rule, in a game engine.

**Ours is one global rule for every pair.** 126 songs is 15,750 ordered pairs, and all of them
get "duck eight bars, then start the next one from its beginning". That is not wrong -- it is
one rule where the trade uses a table -- and it is worth writing down as the shape of the gap
rather than as a defect.

---

## 4. HOW A PLACE BREATHES, AND THE NUMBER UNDERNEATH IT

**Breath of the Wild is the worked example and its designers were explicit about the mechanism.**
The gentle piano drifts in and out and never outstays its welcome, and *"the key here is the
length of silence in between musical moments -- they're long enough so that as a listener you're
no longer perceiving rhythm, and thus, no longer anticipating more music."* The phrases are
fragmented enough that *"you don't really get sick of it the way you would a looped track"*, and
the long silences are also what let the music fade in and out across a world with no loading
screens.

**And there is a real number under "no longer anticipating".** Synchronising to a pulse works for
inter-onset intervals above about 250 ms, and **breaks down once the interval passes roughly two
to three seconds**; independent experiments converge on about **two to three seconds for the
duration of the subjective present**, the window in which a sequence is still held together as
one thing. Intervals from 0.45 to 1.5 s are handled automatically; 1.8 to 3.6 s are already
being handled by slower cognitive processing.

So the design principle has a floor: **a gap shorter than about three seconds does not stop the
ear expecting the next beat.** At 120 BPM three seconds is six beats, a bar and a half. The rest
SOUNDS shipped is eight bars, sixteen seconds -- five times the floor, on paper. Round two
measures whether it is sixteen seconds in fact.

## 5. THE BED UNDER THE MUSIC IS NORMAL PRACTICE, NOT A DEFECT

The row calls the bed *"masked underneath forever"* as though that were the fault. The trade says
otherwise: **Dead Cells runs a separate always-on ambience bed under the score**, and ducks the
music only **4 dB for 600 ms** on boss entry and death, with **no ducking at all in ordinary
combat**, because *"the loop is the constant the player navigates by"*. Ambience beds are built
as long, deliberately detail-free loops precisely so they can sit under other things without
becoming recognisable.

So "the bed is under the music" is how it is supposed to be. The only honest question is
**whether ours is audible** -- a mix number, not a structure. And this lane already owns the
instrument for it: E12 built the audio tap and the BS.1770 loudness measurement, and its whole
finding was that a falling floor read as "the places differ" when it was actually the music.

---

## 6. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY -- NOTHING BUILT THIS ROUND)

**MEASURE THE HANDOVER AS IT NOW IS, not as the row describes it.** Drive the shuffle on the real
surface, with the audio clock as the timebase, and record: when the 64-bar pass ends, whether
`beginRest` is taken, how many seconds the music master stays ducked, and when the next song's
first note lands. Three numbers: **song length, gap length, restart offset.**

**MEASURE THE BED INSIDE THE GAP, in dB, against itself with music up.** Reuse E12's tap and
K-weighting. The question is not "is the bed connected" but "how much of it comes back when the
music ducks", and the answer is a difference, not a claim.

**MEASURE THE FORM'S SAMENESS, which is the finding of this round.** Confirm on the surface that
`ARR` and `RT` are global and that no song row overrides them, and report the consequence in
plain numbers: every song's D section at the same clock time.

**CHECK THE GAP AGAINST THE PUBLISHED FLOOR.** Report the measured gap beside the ~3 second
anticipation threshold and beside BotW's stated principle, with sources. If the gap clears the
floor, say so: this lane reports a pass as readily as a fault, because a sweep that only ever
finds faults gets muted.

**RULE ZERO, and this job's controls are unusually plantable:**
- **a silence control:** a deliberately ducked master must read as ducked, and an un-ducked one
  must not. If the instrument cannot tell those apart it is measuring nothing (E12's own lesson,
  where three captures at one spot spread 16.4 dB against 16.2 dB across places, and the spread
  was the music).
- **a gap control:** a planted 4-second gap in a synthetic stream must be measured as 4 seconds
  by the same detector, within a beat.
- **a form control:** a synthetic song row carrying its own `arr` must be reported as overriding,
  and a row without one must be reported as inheriting. Otherwise the sameness claim is unfalsifiable.
- **the clock control:** the timebase is the audio clock, not `Date.now()`. E14 measured the two
  are 9.6 ms apart with 0.93 ms of jitter, and a gap measured on the wrong clock inherits that.
- all controls pass or no number is printed.

**No ratchet on this one.** There is no count here that can only get worse: a form is a design
and a gap is a length. What a gate from this round CAN hold is the shape: that the rest is still
wired at the end of a pass, that the bed is still on a bus the duck does not touch, and that the
rest is still refused when the fight owns the music -- the three things whose quiet removal would
un-do the 9/11 fix without anything going red. A FIX THAT A LATER MIGRATION UNDOES IS NOT A FIX,
and the laws master already carries that sentence about this exact music path.

---

## ROUTED
- **SOUNDS** -- the gap this round hands you is not the one the row names. The rest exists; what
  has no answer is the form: one arrangement and one root-shift sequence for 126 songs, with the
  D section landing at 0:48 in every one of them. Radio and Wwise both put the handover rule on
  the PAIR; ours is one rule for 15,750 pairs.
- **THE COORDINATOR** -- the row's premise ("no gap, next song on the very next beat, bed masked
  forever") was true when it was written and was fixed by SOUNDS on 9/11, and "a number about
  buffers and not about music" is not right either: 128 s is 16 sections x 4 bars x 2 s and a
  gate already asserts that form. Flagging rather than quietly rewriting the row.

## SOURCES
- Dead air -- https://en.wikipedia.org/wiki/Dead_air
- Song segues, how do they do it -- https://radiodiscussions.com/threads/song-segues-how-do-they-do-it.776128/
- Why do some songs fade out at the end (NPR) -- https://www.npr.org/sections/therecord/2010/10/07/130409256/you-ask-we-answer-why-do-some-songs-fade-out-at-the-end
- Crossfade audio, how to make transitions sound clean -- https://www.descript.com/blog/article/crossfade-audio-what-crossfade-is-and-how-to-edit-it
- Seamless transitions -- https://classapps.chass.ncsu.edu/com304/?p=1642
- Wwise 201, implementing transitions -- https://www.audiokinetic.com/en/courses/wwise201/?id=lesson_6_implementing_transitions_part_i%2F
- FMOD's transition regions, in Wwise terms -- https://www.audiokinetic.com/qa/14093/fmods-transition-regions-in-wwise
- Interactive game music for beginners with FMOD, part 5 -- https://orchestralmusicschool.com/interactive-game-music-for-beginners-with-fmod-part-5/307
- Wwise vs FMOD vs MetaSounds -- https://www.strayspark.studio/blog/wwise-fmod-metasounds-audio-middleware-comparison
- Making interactive music for games, part three -- http://gamesounddesign.com/making-interactive-music-for-games-part-three.html
- Breaking the loop: the cinematic music of Breath of the Wild -- https://www.gamedeveloper.com/audio/breaking-the-loop-a-look-at-the-cinematic-music-of-breath-of-the-wild
- Breath of the Wild's musical rebellion -- https://the-artifice.com/zelda-breath-of-the-wild-music/
- BotW doesn't get enough credit for its audio design -- https://www.thegamer.com/zelda-breath-of-the-wild-sound-design/
- Quiet of the wild -- https://scenicroute.substack.com/p/quiet-of-the-wild
- Moments in time (the subjective present) -- https://www.frontiersin.org/journals/integrative-neuroscience/articles/10.3389/fnint.2011.00066/full
- The specious present, further issues -- https://plato.stanford.edu/entries/consciousness-temporal/specious-present.html
- Properties of echoic memory revealed by auditory-evoked magnetic fields -- https://www.nature.com/articles/s41598-019-48796-9
- Disco time: perceived duration and tempo in music -- https://journals.sagepub.com/doi/10.1177/2059204320986384
- Audio design, Dead Cells systems -- https://teemo.dev/game-design/dead-cells/systems/audio-design/
- How to maintain immersion and reduce listening fatigue in game audio -- https://www.asoundeffect.com/game-audio-immersion/
- How to make ambiences for games -- https://www.gameaudiolearning.com/knowledgebase/how-to-make-ambiences-for-games

**A NOTE ON THE SOURCES.** The egress proxy blocks several of these domains from this session, so
those findings are recorded as the search index reported them, with URLs, and the two this record
leans on hardest -- BotW's stated silence principle and the two-to-three-second anticipation
window -- are each reported by more than one independent page.

## OUR OWN FILES THIS LEANS ON
- `slices/BOHEMIA_ALPHA_0_9.html`: `CITYMUS` and the `__THE_STREET_BREATHES__` block (9/11,
  SOUNDS), `MUS.ARR` / `MUS.RT` / `MUS.songCtx`, and the `MUS.step >= 1024` call site
- `laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md` section 5 (the existing gate that proves
  the 16-section / 128 s form)
- `laws/BOHEMIA_LAWS_MASTER_9_4_26.md` (a fix a later migration undoes is not a fix, about this
  same music path)
- `records/BOHEMIA_EYES_E12_ROUND_2_TEN_SECONDS_OF_STANDING_STILL_9_6_26.md` (the audio tap, the
  loudness measurement, and the null control that killed a headline)
- `records/BOHEMIA_EYES_E14_ROUND_2_THE_BEAT_IS_EAR_TRUE_9_7_26.md` (the audio clock is the
  timebase, and by how much)
- `records/BOHEMIA_EYES_E19_ROUND_2_A_TOKEN_WITH_NO_DECLARATION_IS_NOT_A_TOKEN_9_12_26.md`
  (uniformity is the tell, measured in the interface one round ago)
