# EYES AND EARS -- E18 [he can hear it] ROUND ONE: SCHOOL
## "THE ANCHOR HE NAMED HAS NO TRUSTWORTHY NUMBER ANYWHERE, AND OUR OWN LAW HAS IT BACKWARDS"
### 9/12/26 -- lane 17, round one of two. NOTHING WAS MEASURED ON THE SHIPPED SURFACE THIS ROUND.

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED: *"eyes and ears gotta still be going to school bro,
rounds of big brain research."*) Round one is a whole VAMILY spent learning the subject: how the
trade compares a reference track to a candidate, what the standard instrument is, and what it gets
wrong. No measuring. What I read instead was how OUR music is written and what OUR documents claim
about the anchor, because that is what decides whether the check is even possible.

THE JOB (board row E18): the one song he likes among our two hundred plus, measured against Besaid
Island on a music supervisor's axes -- tempo, entry of the beat, bass, instrumentation, the shape
of the melody -- so SOUNDS [sound card] starts from a number and not a feeling.

---

## 0. THE TWO THINGS THE JOB NAMES, BOTH FOUND, BOTH WITH HIS OWN WORDS ON THEM

**THE ANCHOR.** Paolo 9/7, *"look at this song bro"*: FINAL FANTASY X OST, **BESAID ISLAND, the
ORIGINAL not the remaster.** Written into `laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md`
section 6. The brief in four words off the picture he sent: WOULD YOU LIVE HERE.

**THE CANDIDATE.** *"The marker on the door at full intensity is now one of my new favorite songs
that you've made great job"* (Paolo 8/2, batch 22 verdict, in the demo's own verdict log). It is
the first and, per the laws master, the only stated positive ruling on a cooked song. It is a live
row in the shipped music table:

    root 48  ·  scale [0,2,4,7,9]  ·  wave sawtooth  ·  kick [0,4,8,11]  ·  bass [0,4,9,12]
    hat [2,6,10,14]  ·  bass voice ABYSSBASS  ·  lead BROKENROSARY  ·  pad NIGHTPAD
    kit knock + tight  ·  mel longs  ·  swing 0.1  ·  feel normal  ·  full intensity

Both sides of the comparison are named by him, in his words, with dates. That is the rare case
where this lane has nothing to guess about WHAT to compare.

---

## 1. HOW THE TRADE ACTUALLY DOES THIS

**Supervision is metadata-first, and the listen is short.** Catalogue platforms are searched by
mood, BPM, instrumentation and reference style, and a pitchable track is expected to carry genre
and subgenre, three to five mood tags, **exact BPM, key, primary instrumentation** and two or three
similar-artist reference points. Most tracks get **15 to 30 seconds** of attention; a strong one
gets a full play. So the axes the job names are the real working axes of the trade, and they are
the ones a human uses to decide whether to keep listening at all.

**Commissioned work compares earlier, and differently.** For a composed cue the reference is used
before a note is written, to build tonal references, pick the emotional pacing, shape the harmonic
language and set the instrumentation. That is closer to our situation than catalogue search is: we
are not picking a track off a shelf, we are cooking one.

**AND THE TRADE HAS A NAMED DISEASE FOR EXACTLY WHAT WE ARE ABOUT TO DO.** It is called **temp
love** (also tempitis): the director hears the temporary reference so many times that nothing newly
written can compete, and the composer is pushed to reproduce it, which is the one thing copyright
will not allow. Danny Elfman calls temp tracks *"the bane of my existence."* On **Arrival**, the
Max Richter temp beat everything Jóhann Jóhannsson wrote for that scene and stayed in the finished
film. An anchor that is genuinely loved is not a neutral ruler. Measured against it, everything
reads as a lesser version of it.

---

## 2. THE STANDARD INSTRUMENT MEASURES NONE OF THE FIVE AXES

This is the finding I did not expect. The industry's actual reference-comparison tools are
**ADPTR Metric AB** and **Mastering the Mix Reference 2**. Between them they give you: loudness
matching (four modes), LUFS integrated and short term, true peak, dynamics/PSR, spectrum, tonal
balance, stereo image, stereo width and phase correlation.

Tempo: no. Key: no. Instrumentation: no. Melodic shape: no. Entry of the beat: no.

**The standard instrument compares PRODUCTION, not COMPOSITION.** Every one of the five axes the
job names is a composition axis. A lane that reached for the standard tool would come back with a
spectrum tilt and a LUFS delta and would have learned nothing about the patience of the line, which
is the thing he actually responded to. Reuse-first does not mean reuse the wrong ruler.

**What the standard tool does get right, and round two takes:** loudness is matched FIRST, before
any A/B. The research is explicit that loudness is a confound in similarity judgement, that
loudness maximisation raises "technical quality" scores while adding clipping and compression
artefacts, and that expert listening studies normalise integrated loudness per sample before
asking anybody anything. A comparison that skips loudness matching measures mastering.

---

## 3. THE MEASUREMENT SCIENCE ON EACH AXIS, AND WHERE IT BREAKS

**TEMPO -- and this is the axis with the worst failure mode for this exact kind of music.** Tempo
estimation is not solved. The named failure modes of state-of-the-art beat trackers are octave
errors (half or double, and reported as far as three to four times the annotation), continuity
errors, and complete tracking failure where every metric drops below 0.3. Two specifics land
directly on Besaid Island:

- **the presence of percussion significantly changes algorithm performance**, and the island theme
  is a picked melody over soft hand percussion, not a drum kit;
- the standard DBN post-processor's **default minimum tempo of 55 BPM** forces double-tempo
  predictions on slow music and was measured as preventing the correct tempo on **21%** of the SMC
  (hard) set.

So a tempo number produced by pointing a beat tracker at this reference is a coin flip between the
right answer and twice the right answer. An octave-error control is not optional.

**MELODIC SHAPE -- measurable, and cheaply.** Parsons code encodes a melody as nothing but the
direction of each interval (U, D, R) and Parsons showed that is enough to tell a large number of
tunes apart. Dynamic time warping, in music retrieval since Mongeau and Sankoff, compares two
sequences that run at different speeds, which is precisely the problem when one side is at 120 BPM
by law and the other is not. Contour plus DTW is the right pair for "the shape of the melody".

**ENTRY OF THE BEAT -- measurable, and it is the axis he actually cares about.** Our own sound card
already records that what people loved is the beat arriving LATE. That is an onset time, in
seconds, from the start of the loop. It needs no tracker at all: it needs the first percussive
onset.

**INSTRUMENTATION -- not comparable, and pretending otherwise would be the lie.** See section 4(e).

---

## 4. FIVE COUNTER-FINDINGS. EVERY ONE OF THEM CHANGES THE JOB.

### (a) EVERY PUBLIC NUMBER FOR BESAID ISLAND IS FOR A COVER, AND THEY DISAGREE WILDLY

The BPM-and-key sites all have entries for "Besaid Island". Reading whose entries they are:
Celestial Aeon Project, Franco Albertini, Josh Barron, Jeremy Ng, Game Soundtrack Cat, PianoDreams.
Those are **arrangements and covers**, not the 2001 recording. Across them the tempo runs from
about **103 to 175 BPM** and the key is given as **E major** on one and **C#/Db minor** on another.

He named the ORIGINAL, specifically, and said stop hunting. So the reference side of this comparison
**has no trustworthy number available from the open web**, and any number lifted from those pages
would be a number about somebody's piano cover. Round two may not put a borrowed BPM in a record
and call it the anchor.

### (b) OUR OWN LIVE LAW HAS THE ORIGINAL AND THE REMASTER THE WRONG WAY ROUND

`laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md`, and the SOUNDS row that quotes it, say
the remaster **shortened it, started the beat sooner and removed the bass line**, and conclude that
patience, the bass and the late beat are what people loved.

What the reviews and the long complaint threads actually say is the other direction on pacing: the
**original is faster paced and more upbeat**, and the **remaster slowed the BPM down significantly**
into something slower, more serene and string-heavy, which is why it changed the feel of Besaid for
people who objected. The same sources note Masashi Hamauzu's own style moved between 2001 and 2013,
which is the reason the rearrangement drifts.

And the attribution in our documents implies the wrong composer. **Besaid Island is composed AND
arranged by Masashi Hamauzu**, track 18 of disc 1 of the FINAL FANTASY X Original Soundtrack. The
three-composer split was Uematsu dividing the score and assigning pieces; this piece is Hamauzu's.

This matters mechanically, not pedantically. If round two inherits "slow and patient" as the
reference and our candidate reads faster, the sweep reports a gap that may be pointing the wrong
way. **The reference side of every axis is UNVERIFIED in our own documents and round two must not
inherit it.** I am not changing a law; a law is not this lane's to edit. It is flagged.

### (c) TEMPO IS NOT A FREE VARIABLE HERE, SO AXIS ONE CAN BE REPORTED AND NEVER ACTED ON

120 BPM is a pillar law, and the music runs on the one clock the whole game runs on. Whatever the
original's tempo turns out to be, our candidate's tempo is 120 and changing it breaks the law that
the fight, the walk, the mouth and the limbs all keep. So the honest output for axis one is a
statement of the constraint, not a defect. A sweep that files "tempo differs from the reference" as
something SOUNDS should fix would be asking for a law to be broken.

### (d) A DISTANCE-FROM-THE-ANCHOR SCORE IS THE WRONG INSTRUMENT, AND WE HAVE ALREADY BEEN BURNED BY THAT EXACT MISTAKE

Outside, it is temp love: measured against something beloved, everything loses.

Inside, we have the post-mortem already written. `tools/bohemia_where_his_taste_lives.py` (8/27)
exists because batch 25 was swept 0 for 8 -- *"I didn't like any of the new shit that you made"* --
and its own docstring names the cause: a gate was built to prove each new voice sat FURTHER from
its nearest existing neighbour than existing voices sit from each other, and **the existing voices
are the ones he approved**, so *"a metric that rewards distance from every voice he has ever kept
is a metric that walks AWAY from his taste, and the harder a batch passes it the further it has
walked."*

Two roads, one conclusion. Round two does not produce a similarity score, a percentage, or a
ranking of two hundred songs by distance from Besaid. It produces **one number per named axis, on
both sides, side by side**, and says which side is which. Reference beside candidate, which is
already the law (9/5, REFERENCE-BESIDE-EVERY-CANDIDATE).

### (e) OUR CANDIDATE IS NOT AUDIO. IT IS A PARAMETER ROW, AND ONE AXIS CANNOT BE COMPARED AT ALL.

The song he likes does not exist as a recording anywhere in this repo. It exists as the row in
section 0: a root note, a five-note scale, a waveform, three step patterns and the names of voices
in a 602-voice synth rack. The reference is a 2001 studio recording with real players on it.

The literature on this trade-off is blunt about both sides. Recorded music buys human, expressive,
real instruments and detailed arrangement and then **cannot be changed**; procedural synthesis buys
parameters that move in real time and gives up the acoustic realism. That is our exact position,
and it splits the five axes cleanly:

| axis | our side | the reference side | comparable? |
|---|---|---|---|
| tempo | 120 by law, fixed | one number, unknown (see (a)) | as a stated constraint only |
| entry of the beat | onset time, measurable from a render | describable from the recording | **yes** |
| bass | a step pattern and a named voice | a played bass line | **yes, as presence and register** |
| melody shape | pentatonic contour off the row | a picked melodic line | **yes, contour and DTW** |
| instrumentation | a sawtooth through a synth voice | real violin, hand percussion, picked strings | **no. and saying otherwise would be the lie** |

Four of five are honestly comparable. The fifth is not, and it gets written down as not comparable
rather than scored, because a synth patch and a violin are not two points on one ruler. What CAN
be said about instrumentation is whether our voice is doing the same JOB in the arrangement -- lead
that carries the tune, bass that holds the floor, pad that holds the room -- and that is a role
check, not a timbre score.

---

## 5. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY -- NOTHING BUILT THIS ROUND)

**Four axes measured, one declared uncomparable, and every number carries which side it is from.**
From 4(e). No total, no percentage, no ranking.

**Our side is measured off a real render, not off the row.** The row says sawtooth and a step
pattern; what comes out of the rack is what he heard. Reuse, do not rebuild:
`tools/bohemia_sfx_instrument_measure.py` already opens the one alpha and reaches the live rack, and
`tools/bohemia_eyes_quiet.js` (E12) already taps the audio graph and does BS.1770 loudness. Neither
gets rewritten.

**Loudness matched before any comparison, per section 2**, and said out loud in the record.

**The reference side is entered as CITED TEXT WITH A SOURCE, never as a number I invented, and
never as a cover's BPM.** From 4(a). Where the reference's value is unknown, the record prints
UNKNOWN and names what would settle it. An honest blank beats a borrowed number.

**Tempo is reported as a fixed constraint, not a gap.** From 4(c).

**Our own law's reference facts are flagged as unverified, not used.** From 4(b). The record carries
the conflict and the coordinator carries the fix; this lane does not edit laws.

**RULE ZERO (E9), and this job's controls are unusually easy to plant:**
- **a render control:** the song must come back as sound, not silence. E12's tap already proves the
  difference between a quiet place and a dead one, and its whole point was that a zero needs a
  positive control.
- **an octave-error control, mandatory per section 3:** a synthetic click train at a known 120 must
  read 120, and the same train at half speed must read 60 and NOT 120. If the probe cannot tell 60
  from 120 it cannot be pointed at a slow reference.
- **a contour control:** a melody scored against itself must come back identical, and against its
  own inversion must come back maximally different. A contour metric that cannot separate those two
  is not measuring shape.
- **a beat-entry control:** a planted onset at a known time must be found at that time.
- all controls pass or no number is printed, which is how this lane has run since E9.

**No ratchet on this one, and that is deliberate.** There is nothing here that can only get worse:
the axis card is a description, not a defect count. What CAN go stale is the card claiming a
reference fact that no source backs, so if a gate comes out of round two it holds that every
reference-side value carries a source, in the shape PRE-JUDGE COVERAGE already uses -- every claim
carries its own evidence string and is verified present rather than asserted.

---

## ROUTED
- **SOUNDS** -- the axis card [sound card] asked for starts from this round's table, not from a
  similarity score, and four axes are the whole of what a machine can give it.
- **THE COORDINATOR** -- `laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md` describes the
  original-versus-remaster difference in the opposite direction to every source I could reach, and
  implies the wrong composer for the one track he named. A law is not this lane's to edit.
- **NOTED, ALREADY ON THE RECORD, NOT A NEW CLAIM** -- the song he likes is in the alpha and in the
  demo and is not in the walked city file at all, which is the permanently-NIGHT music gap the laws
  master already carries. Round two measures where the song actually plays.

## SOURCES
- How to write music specifically for sync, 2026 -- https://blog.nexatunes.com/how-to-write-music-specifically-for-sync/
- How music supervisors find trailer music -- https://tonalchaostrailers.com/blog/how-music-supervisors-find-trailer-music/
- How music supervisors search library catalogs -- https://thatpitch.com/blog/how-music-supervisors-search-library-catalogs/
- How metadata helps music supervisors find tracks -- https://thatpitch.com/blog/how-metadata-helps-music-supervisors-find-tracks/
- How music supervisors actually find songs in 2026 -- https://www.blakmarigold.com/blog/how-music-supervisors-actually-find-songs-in-2026-and-how-to-get-discovered
- What is temp music in film -- https://www.masterclass.com/articles/what-is-temp-music-in-film
- Temp love, tempitis, scratch track fever -- https://www.studiounknown.com/temp-love-tempitis-scratch-track-fever/
- A case study for film composers working with temp tracks -- https://researchrepository.wvu.edu/cgi/viewcontent.cgi?article=8297&context=etd
- Temp tracks: to temp or not to temp -- https://soundtrack.academy/temp-tracks/
- The SMC blind spot: a failure mode analysis of state-of-the-art beat tracking -- https://arxiv.org/html/2605.12287v1
- Music tempo estimation: are we done yet? (TISMIR) -- https://transactions.ismir.net/articles/10.5334/tismir.43
- Addressing tempo estimation octave errors in electronic music -- https://www.ifs.tuwien.ac.at/~knees/publications/hoerschlaeger_etal_smc_2015.pdf
- Evaluation of audio beat tracking and music tempo extraction algorithms -- https://www.researchgate.net/publication/248906423_Evaluation_of_Audio_Beat_Tracking_and_Music_Tempo_Extraction_Algorithms
- Cosine contours: a multipurpose representation for melodies (ISMIR 2021) -- https://archives.ismir.net/ismir2021/paper/000016.pdf
- Music classification based on melodic similarity with dynamic time warping -- https://ieeexplore.ieee.org/document/6724279
- Melodic similarity and applications using biologically-inspired techniques -- https://www.mdpi.com/2076-3417/7/12/1242
- Assessing the alignment of audio representations with timbre similarity ratings -- https://arxiv.org/pdf/2507.07764
- Towards assessing data replication in music generation with music similarity metrics on raw audio -- https://arxiv.org/pdf/2407.14364
- ADPTR Metric AB -- https://www.plugin-alliance.com/products/metric-ab
- Mastering the Mix Reference 2 -- https://audiodeluxe.com/collections/software/products/mastering-mix-reference-2
- Besaid (Final Fantasy X theme), composer and track listing -- https://finalfantasy.fandom.com/wiki/Besaid_(Final_Fantasy_X_theme)
- Music of Final Fantasy X -- https://en.wikipedia.org/wiki/Music_of_Final_Fantasy_X
- Masashi Hamauzu, composer biography -- https://www.ffdistantworlds.com/composers/masashi-hamauzu
- Composer Masashi Hamauzu looks back on the music of Final Fantasy X -- https://www.newsweek.com/final-fantasy-x-masashi-hamauzu-interview-1409873
- Final Fantasy X HD Remaster soundtrack review -- https://thelifestream.net/lifestream-projects/reviews/29775/final-fantasy-x-hd-remaster-soundtrack-review/
- Final Fantasy X HD's rearranged OST was unnecessary and disappointing -- https://www.resetera.com/threads/final-fantasy-x-hds-rearranged-ost-was-unnecessary-and-disappointing.107400/
- Livid at how they butchered the Final Fantasy X OST in the HD remake -- https://www.resetera.com/threads/im-kind-of-livid-at-how-the-butchered-the-final-fantasy-x-ost-in-the-hd-remake.134906/
- Final Fantasy X HD Remaster Original Soundtrack, discussion -- https://soundtrackcentral.com/topics/7293/final-fantasy-x-hd-remaster-original-soundtrack
- Generative audio and real-time soundtrack synthesis in gaming environments -- https://dl.acm.org/doi/fullHtml/10.1145/3441000.3441075
- Generative music in digital games, application and evaluation of PCG principles -- https://www.researchgate.net/publication/342159490_Generative_Music_in_Digital_Games_-_Application_and_Evaluation_of_Procedural_Content_Generation_Principles

**A NOTE ON THE SOURCES, BECAUSE IT AFFECTS HOW HARD THEY MAY BE LEANED ON.** Several of these
pages could not be opened from this session: the egress proxy blocks arxiv, the ISMIR transactions
site, Wikipedia, the FF wiki, the TU Wien PDF, the BPM databases and the Lifestream review. Their
findings are recorded here as the search index reported them, with the URL, and they are
consistently reported across independent pages. The original-versus-remaster direction in 4(b) in
particular rests on listener reviews and long complaint threads, which is community consensus, not
a measurement. That is exactly why round two enters the reference side as CITED TEXT and prints
UNKNOWN where it is unknown rather than turning any of it into a number.

## OUR OWN FILES THIS LEANS ON
- `laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md` section 6 (the anchor, named 9/7)
- `slices/BOHEMIA_DEMO.html` batch 22 verdict block (his 8/2 words) and the live song row
- `laws/BOHEMIA_LAWS_MASTER_9_4_26.md` (the song is OVERWORLD DAY and the music is permanently NIGHT)
- `tools/bohemia_where_his_taste_lives.py` (8/27: a distance metric walked away from his taste)
- `tools/bohemia_sfx_instrument_measure.py` (8/19: the live rack is already reachable, reuse it)
- `tools/bohemia_eyes_quiet.js` (E12: the audio tap and BS.1770 loudness already exist)
- `records/BOHEMIA_EYES_E15_ROUND_2_THE_JUDGE_ALREADY_EXISTS_9_11_26.md` (what ignoring REUSE-FIRST costs)
- `records/BOHEMIA_EYES_E17_ROUND_2_THE_LOCK_IS_NOT_THE_RULING_9_12_26.md` (a claim in text is not a fact on the surface)
