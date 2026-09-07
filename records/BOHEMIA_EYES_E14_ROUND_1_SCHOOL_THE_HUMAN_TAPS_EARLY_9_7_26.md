# EYES AND EARS -- E14 [late beat] -- ROUND ONE OF TWO: SCHOOL
## THE HUMAN TAPS EARLY, AND BLUETOOTH IS FOUR TIMES OUR WHOLE WINDOW
### 9/7/26 -- session eyes-5vql33 -- NO MEASURING WAS DONE THIS ROUND, ON PURPOSE

The job, from the board:

> IS-THE-BEAT-HE-HEARS-THE-BEAT-THE-GAME-JUDGES -- school first: how real rhythm games
> calibrate audio offset per device and what they get wrong; then the check, on the real
> surface: the gap between the beat the player hears and the beat the fight scores, and
> whether the first fight can be passed by somebody doing it right.

Round one is school. Nothing on our surface was measured. Two things were read off disk to
ground the research, because the MODE asks for the world measured against our repo: the beat is
`BEAT_MS = 500`, which is 120 BPM exactly and correct, and there are **two different grace
values in the shipped files** -- 200 in the alpha and 40 in the city world. Which one the fight
actually judges by is round two's first question, and no claim is made about it here.

---

## 1. THERE ARE TWO OFFSETS, NOT ONE, AND ADDING THEM IS THE CLASSIC BUG

Real rhythm games split calibration in two:

- **Audio offset** -- how late the sound comes out of the device.
- **Video offset** -- how late the picture arrives.

Rhythm Doctor runs calibration in two phases: first the player lines the picture up with the
sound, then a **tap test** measures input latency. The arcade game Chunithm does the same thing
with two named values, Offset A for audio and Offset B for video.

And the documented failure mode is that they get **added**: if a player calibrates audio and
gets one value, then video calibration adds its own, the game ends up compensating for the sum
rather than for the true audio latency.

**WHAT THIS CHANGES FOR US.** The job says "the gap between the beat the player hears and the
beat the fight scores", which is one number. There are at least three clocks in that sentence:
when the sound leaves the speaker, when the picture shows the beat, and when the judge thinks
the beat was. Round two measures the audio one against the judge's one and **says which pair it
measured**, rather than reporting "the gap" as if there were one.

---

## 2. THE BROWSER WILL JUST TELL YOU THE AUDIO LATENCY, AND THAT MAY REMOVE HALF THE PROBLEM

This is the finding that most changes the instrument, and it is free:

- **`AudioContext.outputLatency`** -- an estimate, in seconds, of the time between the browser
  handing a buffer to the host audio system and the first sample actually being processed by the
  output device.
- **`AudioContext.baseLatency`** -- the seconds of processing latency inside the graph itself,
  from the destination node into the host audio system.
- **`AudioContext.getOutputTimestamp()`** -- returns `contextTime` (the sample frame being played
  right now, in the audio clock) and `performanceTime` (the same instant in `performance.now()`
  terms). It exists specifically to bridge the two clock domains for games.

**WHAT THIS CHANGES FOR US.** A calibration screen exists because native games cannot ask the
device how late it is. **On the web, we can.** So the audio half of E14 is a read, not a survey,
and round two should report `outputLatency` and `baseLatency` off the real surface before
anything else. The half that still needs a human is video and input, and that is a separate
question the job did not ask.

---

## 3. SCHEDULE ON THE AUDIO CLOCK, NEVER FIRE ON A TIMER

`getOutputTimestamp()` exists because the audio clock and the JavaScript clock are different
clocks that drift against each other. The standard pattern is to schedule sound ahead of time on
the audio clock and to convert to `performance.now()` only when you need to draw something.

**WHAT THIS CHANGES FOR US.** This is not new advice to this repo -- SOUNDS already carries an
OPEN row, **THE-BEAT-IS-SCHEDULED-NOT-FIRED**, saying the game must judge by its own clock and
schedule ahead rather than fire on the tap. School confirms that row is the standard and not a
preference. What school adds is the *test*: if the beat is scheduled on the audio clock, then the
gap between the scheduled time and the judged time is a **machine-to-machine** comparison, and
round two can measure it with no human in the loop at all.

---

## 4. THE REAL-WORLD HALF: HUMANS TAP EARLY, AND IT IS NOT A MISTAKE

The science here is old, large and unambiguous. In paced tapping to a metronome, **finger taps
typically precede the sound.** The effect has a name, **negative mean asynchrony**, and a size:
humans tap roughly **20 to 100 ms before** the auditory pacing signal. Repp's review of the
tapping literature is the standard reference and covers rate limits, variability, error
correction and the neural correlates.

Two explanations compete: the Paillard-Fraisse "transmission" hypothesis (different conduction
times for different senses) and a sensory accumulator account (a central average of channels
processed at different rates). And a cross-cultural study finds the effect is **not universal**,
which matters more than the explanation does.

**WHAT THIS CHANGES FOR US, AND IT IS THE SHARPEST THING IN THIS RECORD.** Every tap-based
calibration measures device latency **plus** the player's own anticipation, and cannot separate
them. So a calibration built from taps bakes in 20 to 100 ms of human bias, calls it device
latency, and then applies it on a different device where it is simply wrong. And because the
bias is not universal, it cannot be subtracted as a constant either.

The clean split, and round two will hold to it:

> **Measure the machine with the machine. Never ask a human to calibrate a number a browser
> already reports.**

---

## 5. BLUETOOTH IS THE ELEPHANT, AND AGAINST OUR OWN NUMBERS IT IS NOT CLOSE

| codec | typical latency |
|---|---|
| SBC, the Bluetooth baseline | **150-200 ms or higher** |
| AAC (Apple and most Android) | varies widely by implementation |
| aptX / aptX HD | 100-200 ms |
| aptX Low Latency, best case | 30-40 ms codec-level, more system-wide |
| typical consumer device, measured round trip | **150-300 ms** |

**WHAT THIS CHANGES FOR US.** Our beat is 500 ms. The two grace values sitting in the shipped
files are 200 ms and 40 ms.

- Against the **40 ms** grace, the *smallest* realistic Bluetooth delay is about four whole
  windows late. The fight is not hard on wireless headphones, it is **impossible by
  construction**.
- Against the **200 ms** grace, a typical Bluetooth delay of 150-300 ms straddles the entire
  window: some devices land inside it by luck and some do not.
- Either way this is not a tuning problem. It is a "did we read the device's latency and offset
  the window by it" problem, which is exactly what SOUNDS' own row already says to do.

And note what makes it worse than the numbers look: **Bluetooth latency arrives after
calibration.** A player calibrates on the speaker, then puts headphones on, and the whole
correction is now wrong by 200 ms. A one-time calibration is a snapshot of a moving thing.

---

## 6. WHAT PLAYERS AND GAMES GET WRONG, FROM THE PLAYER SIDE

- **Calibrating by eye.** The documented mistake is watching the pulsing line on screen, which
  makes players doubt their own internal rhythm; the advice is to close your eyes and listen for
  the accent. So a calibration that *shows* you something is measuring the wrong sense.
- **Believing offset fixes accuracy.** Players routinely think adjusting offset will fix poor
  timing. It will not; it moves the centre of the window, not the width of their error.
- **Two kinds of offset in one game.** osu! separates *local* offset (per beatmap, shifts
  gameplay against that track) from *universal* offset (shifts the audio against everything).
  Conflating them produces a fix that works on one song and breaks the rest.

**WHAT THIS CHANGES FOR US.** If E14 ever leads to a calibration screen, it must not be a
watch-the-dot screen, and it must not be sold as a fix for being bad at the fight. Neither of
those is round two's job, but they are the trap on the other side of it.

---

## 7. THE FINDINGS THAT PROVE US WRONG

Three, and the first two change what round two measures.

### a) "THE GAP" IS NOT A NUMBER. IT IS A DISTRIBUTION THAT MOVES.
The job asks for "the gap between the beat the player hears and the beat the fight scores". A
single number is the wrong instrument. Latency has a **bias** (how late, on average) and a
**jitter** (how much that varies beat to beat), and it **changes at runtime** when an output
route changes, when Bluetooth connects, when the device throttles. A fight can be perfectly
centred and still unplayable if the jitter is wider than the window, and a fight can be 30 ms
late and completely fine.

So round two reports **bias and jitter over many beats**, not one gap, and it says whether
anything in the game re-reads latency after it changes.

### b) A TAP TEST MEASURES A HUMAN, NOT A PHONE.
Section 4. Every tap-based calibration measures device latency plus 20-100 ms of anticipation
that belongs to the person, and the two cannot be separated by tapping harder. The browser
reports the device half directly. **Round two takes no taps from a human and does not build a
calibration screen.**

### c) OUR OWN NUMBERS DISAGREE WITH EACH OTHER BY FIVE TIMES.
`GRACE=200` in the alpha and `GRACE=40` in the city world. Until round two establishes which one
the fight judges by, "is the beat late" has no denominator. That is round two's first question
and it is a question about our repo, not about the world. No claim is made here about which is
right or whether either is a defect.

---

## 8. THE INSTRUMENT DESIGN FOR ROUND TWO (SPEC ONLY, NOTHING BUILT THIS ROUND)

**Order of operations.**

1. **Ask the device.** Read `AudioContext.outputLatency` and `baseLatency` on the real surface,
   at iPhone size, in the shipped alpha. This is the machine's own answer and it costs nothing.
2. **Find the denominator.** Establish which grace the fight actually judges by, by reading the
   code path the fight runs, not by guessing between 200 and 40.
3. **Measure the beat against the judge, machine to machine.** Wrap the scheduler and the judge,
   collect many beats, and report **bias and jitter**, plus the worst beat, not one gap.
4. **Answer the real question: can a perfect player pass?** Drive taps exactly on the audio-clock
   beat, corrected by `outputLatency`, and see what the fight scores. No human, no calibration
   screen, no opinion.
5. **Report against the Bluetooth numbers**, because a window that survives a wired phone and
   dies on headphones is a finding the player will meet on day one.

**RULE ZERO, and this job's trap is a good one.** A simulated perfect player that scores 100%
proves nothing on its own: it may mean the fight is fair, or it may mean the judge is reading my
taps off the same clock that generated them, which is a tautology dressed as a pass. So round two
plants a **deliberately late player** -- the same taps shifted by a known amount, say 150 ms --
and the score **must** drop. If a player 150 ms late still scores perfect, the judge is not
judging and every number above is meaningless.

A second control, from E13's hardest lesson: **a sweep that interacts changes its own subject.**
Driving taps into a fight changes the fight's state, so each run starts from a fresh fight or the
later beats are measured in a fight the earlier beats altered.

**Blind spots to declare, not to count clean.** One device, one browser, one output route: this
measures the harness's audio path and not a real phone's, and `outputLatency` is explicitly an
*estimate*. Bluetooth cannot be tested here at all and its numbers stay quoted, never measured.
Video offset is not measured. And nothing here says whether the fight is *fun*, which is his.

---

## ROUTED
Nothing this round. School routes nothing. Two things are noted for round two rather than
claimed: the two grace values, and SOUNDS' existing OPEN row THE-BEAT-IS-SCHEDULED-NOT-FIRED,
which school confirms is the standard practice and not a preference.

## SOURCES
- Latency calibration is surprisingly hard -- https://steamcommunity.com/sharedfiles/filedetails/?id=3434111928
- Rhythm Quest devlog 10, latency calibration -- https://rhythmquestgame.com/devlog/10.html
- Rhythm game crash course (Native Audio) -- https://exceed7.com/native-audio/rhythm-game-crash-course/index.html
- Input calibration discussion, PolyrhythmMania -- https://github.com/chrislo27/PolyrhythmMania/discussions/21
- Rhythm Doctor latency calibration discussion -- https://steamcommunity.com/app/774181/discussions/0/3200370144982666969/
- osu! wiki: Offset -- https://osu.ppy.sh/wiki/en/Offset
- osu! wiki: Local offset -- https://osu.ppy.sh/wiki/en/Offset/Local_offset
- How to more accurately calibrate your input offset -- https://steamcommunity.com/sharedfiles/filedetails/?id=2716696968
- AudioContext.outputLatency (MDN) -- https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency
- AudioContext.baseLatency (MDN) -- https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency
- Keeping audio and visuals in sync with the Web Audio API -- https://www.jamieonkeys.dev/posts/web-audio-api-output-latency/
- Audio/video synchronization with the Web Audio API -- https://blog.paul.cx/post/audio-video-synchronization-with-the-web-audio-api/
- Repp, Sensorimotor synchronization: a review of the tapping literature -- https://pubmed.ncbi.nlm.nih.gov/16615317/
- The same review, full text -- http://users.df.uba.ar/anita/f1_labo/clase1/repp%20psycho%20bull%20rev%202006%20synchro%20tapping%20review.pdf
- The classical mean negative asynchrony is not universal: a cross-cultural study -- https://arxiv.org/pdf/2107.03971
- Understanding Bluetooth codecs -- https://www.soundguys.com/understanding-bluetooth-codecs-15352/
- Bluetooth codecs explained: SBC, AAC, aptX, LDAC, LC3 -- https://onlineaudiotest.com/bluetooth-codec-guide/
- Bluetooth audio latency explained -- https://soundlatencytest.com/blog/bluetooth-audio-latency-explained/
- What is Bluetooth audio delay -- https://treblab.com/blogs/news/what-is-bluetooth-audio-delay

## OUR OWN FILES THIS LEANS ON
- VAMILY.md, SOUNDS: OPEN [scheduled beat] THE-BEAT-IS-SCHEDULED-NOT-FIRED
- CLAUDE.md: the 120 BPM law
- BEAT_MS = 500 in the shipped alpha (120 BPM, exact), and GRACE=200 / GRACE=40 in two shipped files
- records/BOHEMIA_EYES_E13_ROUND_2_WHO_ACTUALLY_GETS_THE_TAP_9_7_26.md (a sweep that interacts changes its own subject)
- records/BOHEMIA_EYES_ROUND_2_THE_STANDING_DUTY_9_5_26.md (RULE ZERO)
