# EYES AND EARS -- E12 [silence standing] -- ROUND ONE OF TWO: SCHOOL
## WHAT A QUIET PLACE ACTUALLY SOUNDS LIKE
### 9/6/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

The job, from the board:

> THE-VALLEY-IS-SILENT-STANDING-STILL -- E5's own finding, promoted to a job: the footsteps
> work and the valley goes quiet the moment the player stops moving, and the bed sound is
> cooked and never called. Measure what a player hears in ten seconds of standing still, in
> three places, and hand SOUNDS the gap list.

Round one is school. It contains no capture, no numbers off our surface, and no gap list.
It contains what the craft and the science already know, one finding that proves the job's
premise wrong, and the design round two builds. E5's own earlier finding stands as the
starting point and is not re-measured here: gap 1 said *play the bed, it is the one where
the work is already done and only the call is missing*
(`records/BOHEMIA_EYES_E5_THE_SOUND_GAP_LIST_9_5_26.md`).

---

## 1. THE VOCABULARY IS FIFTY YEARS OLD AND WE HAVE NEVER USED IT

R. Murray Schafer founded the World Soundscape Project at Simon Fraser University in **1969**,
and it is where the field of acoustic ecology comes from. Its analytical split is three words:

- **KEYNOTE** -- the ubiquitous, prevailing sound, usually in the background of perception,
  **which every other sound in the place is heard against**.
- **SIGNAL** -- a foreground sound, consciously listened to, carrying information.
- **SOUNDMARK** -- like a landmark: a sound object unique to one specific place.

**WHAT THIS CHANGES FOR US.** The brief says "measure what a player hears standing still",
and the obvious instrument is a level meter. That is the wrong unit. The right unit is these
three, because they name three different defects with three different fixes:

- no KEYNOTE -> the place has no floor. That is the silence the job is about.
- no SIGNAL -> nothing to listen to. Not our problem: footsteps, barks and the fight are signals.
- no SOUNDMARK -> **you cannot tell one district from another with your eyes shut.**

That third one has never been named anywhere in this project, and it is the one that matters
most to a game whose whole world design is "every part of Vegas has an owner" and "every block
has a name on it". A soundmark is how a blind test tells the Mob's blocks from the Cartel's.
Round two therefore measures whether the three places DIFFER, not just whether each is quiet.

---

## 2. THE INDUSTRY RECIPE IS TWO PARTS AND WE HAVE ZERO OF PART ONE

Ambience splits into **room tones** and **one-shots**:

- The **bed** is stereo loops: wind, hum, distant traffic, foliage. It is the background
  everything else sits on top of. In an urban setting it is traffic, technology hums, crowds.
- The **one-shots** (spot effects) are the detail, played as independent events at randomized
  times, positions, pitch and volume.

And the craft rule that matters most, because it is counter-intuitive:

> Detailed sounds in ambience beds become familiar as the loop repeats, so they are usually
> **edited out** of the ambient loop and recorded separately, to be added later as spot effects.

**WHAT THIS CHANGES FOR US.** The board's phrasing, "the bed sound is cooked and never called",
frames this as one missing call. School says the gap list must have **two columns**. If the bed
we cooked has distinct events baked into it, then calling it does not fix the valley, it just
moves the problem: within a few loops those details become a tell, and a player hears the seam
instead of the place. Round two must report what is IN the bed, not only whether it plays.

---

## 3. THE TOOL FOR PART TWO ALREADY SOLVES OUR 120 BPM LAW, WHICH I DID NOT EXPECT

FMOD's **Scatter instrument** plays one sample from a playlist at a time, at a randomized
distance from the listener, with a **min and max spawn interval**, and a **spawn rate that can
be automated by a game parameter** (their own example: bird chirps thinning as the weather gets
worse). And the trigger can run **on regular time OR ON MUSICAL TEMPO**. Wwise migrants
reportedly miss it more than any other feature.

**WHAT THIS CHANGES FOR US, TWICE.**

1. Rule 7 of the board says every mechanic is 120 BPM friendly or it is not done. For ambience
   that reads like a constraint and it is not: tempo-locked scattering is a documented, standard
   mode. Our one-shots can land on the beat by design, and the lane that builds it does not have
   to invent anything.
2. An automatable spawn rate is exactly how **THE VALLEY RUNS OUT** (WORLD, 9/6) becomes
   audible. The valley emptying is already a number in the game. Hang the ambient event rate on
   it and the world gets quieter as it dies, with no new system written by anybody. That is a
   reuse-first answer and it belongs in the gap list.

---

## 4. THE REAL WORLD: A QUIET PLACE HAS A FLOOR, AND THE FLOOR IS ABOUT 30 dBA

The project's law is REALISM FIRST, so the second angle is what a real place measures.

| place | level |
|---|---|
| wilderness, day-night average | as low as **30-40 dBA** |
| wilderness and sparsely populated areas | **seldom below 30-35 dB** |
| quiet suburban neighbourhood | 45-50 dBA |
| metropolitan urban | 60-70 dBA |
| night vs day, same city | about **7 dB lower** |

**WHAT THIS CHANGES FOR US.** There is no such thing as a silent outdoor place. The floor is
real, it is roughly 30 dBA, and it is made of wind, distance and your own body. So "the valley
is silent standing still" is not realism and it is not a style choice, it is a missing floor.
And the target is not one number: our valley at night should sit near the wilderness floor and
the same valley in a working district by day should sit near a quiet suburb, which is a **15 dB
spread** the game currently does not have at all.

---

## 5. THE BEST REFERENCE FOR A DEAD CITY IS 2020, AND THE NUMBER IS FAR SMALLER THAN ANYONE GUESSES

This is the finding I would not have got from game-audio sources, and it changes the brief.

When the world's traffic stopped in 2020, cities were measured, not guessed:

- Montreal: sound level reductions of **6-7 dB(A)**.
- The Ruhr, Germany: a mean overall reduction of **5.1 dB**.
- European studies broadly: about **5 dB**.
- And the one that lands hardest: **heavy-traffic areas dropped only 3-5 dBA despite a 52%
  reduction in traffic flow.**
- Granada's tourist points were the outlier at up to 30 dBA, because the sound there WAS the
  tourists.
- Levels returned to near pre-pandemic within about four weeks of restrictions relaxing.

What actually changed was not the level, it was **the character**: Parisians suddenly heard
river birds; London's Millennium Bridge went effectively silent.

**WHAT THIS CHANGES FOR US, AND IT IS THE BIGGEST THING IN THIS RECORD.** A post-collapse Las
Vegas is **not** thirty decibels quieter than a live one. Halving the traffic in a real city
bought 3 to 5 dB. The design instruction that falls out is not "make it quiet". It is:

> **take the machines out of the keynote and let what was always underneath come up.**

Wind on concrete, a loose sign, a dog four blocks away, birds that were always there and were
always masked. That is a content list, it is cheap, and it is more true than a volume slider.
It also explains why our silent valley reads as broken rather than as post-apocalyptic: real
collapse does not remove the soundscape, it re-ranks it.

---

## 6. CONSTANT AMBIENCE IS A DOCUMENTED FAILURE, AND IT HAS A CLOCK ON IT

- Listeners fatigue on content with no dynamic range and reach for the off switch.
- **Constant volume for more than 30-40 minutes** produces listening fatigue. A constant wall
  of sound is exhausting.
- A bed occupying the whole frequency range **masks** the sounds a player must hear. Frequency
  separation and dynamic mixing exist so footsteps and alarms punch through.

**WHAT THIS CHANGES FOR US.** THERE ARE NO RUNS: this is a ~100 hour game, which is about 150
times the documented fatigue clock. So the gap list may never say "turn the bed on and leave it
on". Whatever SOUNDS builds has to breathe, and the bed must leave room where the footsteps,
the barks and the fight live, or E12's fix silently damages the things that already work.

---

## 7. SILENCE IS AN INSTRUMENT, NOT AN ABSENCE

Silence in game audio works like negative space in a painting: used deliberately it raises
tension, sharpens contrast and lands an emotional beat. Horror leans on it hardest.

**WHAT THIS CHANGES FOR US.** Some of our silence might be worth keeping. But a chosen silence
and a missing call sound **identical** from outside, and this lane does not get to guess. The
only honest separator is mechanical: **does anything in the code ever DECIDE to be quiet?** If
no module ever ducks, gates, or holds off, then the quiet is not a choice, it is an absence,
and the record can say so without an opinion in it.

---

## 8. THE FINDING THAT PROVES US WRONG

Every research round in this lane owes one. This round has two, and both change round two.

**a) The job's premise is not established, and the honest target is not "fill the silence".**
Sections 4, 5 and 6 together say: real quiet has a floor near 30 dBA; a dead city is only about
5-7 dB below a live one; and constant ambience is a documented failure with a 30-40 minute
clock in a 100 hour game. So "the valley is silent, add the bed" is the wrong shape of fix.
The corrected question, and round two will ask it in this order:

1. **Is there a floor?** (keynote)
2. **Does anything ever decide to be quiet?** (chosen silence vs missing call)
3. **Can you tell the three places apart with your eyes shut?** (soundmark)

Three questions, three different fixes, and only the first one is "call the bed".

**b) Measuring a LEVEL is the wrong instrument for this job.**
The brief says measure what a player hears in ten seconds. The obvious reading is loudness, and
loudness barely separates our cases: a silent valley and a valley with a properly quiet bed
differ by a handful of decibels and both read as "quiet". What separates them is **event rate**
(how many distinct things happen per minute) and **spectral occupancy** (whether the frequency
range is filled or is a hole). A level meter alone would have reported "quiet, quiet, quiet"
across all three places and told us nothing. Round two measures four things, and level is only
one of them.

---

## 9. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**Where.** Three places, as the brief says: a street in the opening district, an interior, and
open valley away from any town. Day and night if the clock reaches.

**What the capture is.** Ten seconds of standing genuinely still, on the real surface, in the
real browser, with the game running. Reuse the live-wrap approach E4 and E9 already proved:
wrap the sound entry points **by bare name**, never through `window`. A `const` at top level is
a global binding and not a window property, and reading `window.MUS` once made this lane report
"no AudioContext" through an entire walk.

**Four measurements, not one.**

| # | measure | why it is here |
|---|---|---|
| 1 | FLOOR: K-weighted loudness (BS.1770, the standard E4 already uses) and true peak | is there a keynote at all |
| 2 | EVENT RATE: how many distinct sound calls fired in the ten seconds | this is the number that actually separates the cases |
| 3 | SPECTRUM: is the frequency range occupied or is it a hole | a bed that is only low rumble is not a floor |
| 4 | DIFFERENCE: do the three captures differ from each other | the soundmark question, and a separate defect from silence |

**RULE ZERO, and this job is the most dangerous one in the queue for it.** A ten-second capture
reporting ZERO events is exactly what a broken harness reports. This lane has already been
burned by counters nobody incremented, printing a confident zero forever. So round two fires
one known sound by hand at the end of every capture and **refuses to report silence unless that
control moved the counters**. No control, no finding.

**Blind spots to declare rather than count clean.** Standing still may not be the only quiet
state (a menu, a loading beat, an interior with the door shut). A bed may be gated on a district
the walk never reaches. Headphones and a phone speaker are different instruments and this
measures the signal, not the speaker.

**The output.** A gap list for SOUNDS, two-word verdict each, the same shape E5 used, handed
over as one `[eyes: two words]` line if a shipped item is actually defective.

---

## ROUTED
Nothing is routed this round. School routes nothing; the gap list is round two's, and this lane
writes at most one bounce-back line and only on a real defect it has measured.

## SOURCES
- World Soundscape Project (1969, Schafer, SFU) -- https://en.wikipedia.org/wiki/World_Soundscape_Project
- Acoustic ecology -- https://en.wikipedia.org/wiki/Acoustic_ecology
- Keynotes, signals and soundmarks -- https://www.bulldozia.com/2010/07/17/keynotes-signals-and-soundmarks/
- The soundscape, chapter 1 -- https://justsoundeffects.com/article/chapter-1-the-soundscape/
- How to make ambiences for games -- https://www.gameaudiolearning.com/knowledgebase/how-to-make-ambiences-for-games
- Game Audio Implementation, ch.1: ambience and environment -- https://www.oreilly.com/library/view/game-audio-implementation/9781317679455/xhtml/Ch001.xhtml
- How to design ambient sound layers -- https://bugnet.io/blog/how-to-design-ambient-sound-layers
- Creating an audio soundscape for video games -- https://splice.com/blog/audio-soundscape-for-video-games/
- Room tone = emotional tone -- https://designingsound.org/2012/11/15/room-tone-emotional-tone-the-importance-of-hearing-ambience/
- FMOD scatterer instrument / CRYENGINE ambience and trigger spots -- https://www.cryengine.com/tutorials/view/audio-and-music/audio-using-fmod-studio/article/audio-ambience-and-trigger-spots-fmod-studio-workflow-part-1
- Maintaining immersion, reducing repetition and listening fatigue -- https://www.asoundeffect.com/game-audio-immersion/
- The power of silence in game audio -- https://www.wayline.io/blog/power-of-silence-game-audio
- Silence and space in video game audio -- https://gameaudioinsights.com/2025/04/26/silence-and-space-in-video-game-audio/
- Dynamics of narrative (dynamic mixing, ducking) -- https://www.gamedeveloper.com/audio/dynamics-of-narrative
- Outdoor ambient sound pressure levels -- https://www.engineeringtoolbox.com/outdoor-noise-d_62.html
- Noise basics -- https://www.noisequest.psu.edu/noisebasics-basics.html
- Background noise levels in Europe (SINTEF A6631) -- https://www.easa.europa.eu/sites/default/files/dfu/Background_noise_report.pdf
- Quieted city sounds during COVID-19 in Montreal -- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8199082/
- Noise levels in the Ruhr area, pre/during comparison -- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8125542/
- Changes in noise levels in Madrid during lockdown -- https://pmc.ncbi.nlm.nih.gov/articles/PMC7857494/
- The soundscape of the COVID-19 lockdown: Barcelona monitoring network -- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8199076/
- Lockdowns silenced urban noise, now it is coming back -- https://www.weforum.org/stories/2020/05/covid19-lockdowns-silenced-urban-noise-now-its-coming-back/

## OUR OWN FILES THIS LEANS ON
- records/BOHEMIA_EYES_E5_THE_SOUND_GAP_LIST_9_5_26.md (gap 1: the bed is cooked and never called; gap 10: nothing has ever metered the mix)
- records/BOHEMIA_EYES_E4_THE_EARS_9_5_26.md (BS.1770 loudness, true peak, the measurement stack this reuses)
- records/BOHEMIA_EYES_ROUND_2_THE_STANDING_DUTY_9_5_26.md (RULE ZERO: a zero needs a positive control, and the const-is-not-on-window bug that produced it)
- VAMILY.md rule 7 (every mechanic is 120 BPM friendly), WORLD 9/6 THE-VALLEY-RUNS-OUT
