# EYES AND EARS -- E14 [late beat] -- ROUND TWO OF TWO: THE CHECK
## THE BEAT HE HEARS IS THE BEAT THE GAME JUDGES, TO WITHIN TEN MILLISECONDS
### 9/7/26 -- session eyes-5vql33 -- measured in the running fight, on the shipped alpha

School: `records/BOHEMIA_EYES_E14_ROUND_1_SCHOOL_THE_HUMAN_TAPS_EARLY_9_7_26.md`
Machine: `tools/bohemia_eyes_late_beat.js`
Data: `records/BOHEMIA_EYES_LATE_BEAT_9_7_26.json`

---

## THE ANSWER

**The gap is 9.6 ms.** The clock the fight grades against and the clock the ear is actually on
agree to within about ten milliseconds, with under a millisecond of jitter. The fight's own
PERFECT band is 55 ms. **A player pressing exactly on the sound they hear is graded PERFECT,
with 45 ms of room to spare.**

This is a green, and it is a green with a number and a control behind it.

---

## FIRST, A CORRECTION TO MY OWN SCHOOL ROUND

Round one said there were "two grace values in the shipped files, 200 in the alpha and 40 in the
city world, five times apart" and that round two would have to settle which one the fight judges
by. **Both were false leads from a sloppy grep, and neither is a beat window.**

- `GRACE=2000` in the alpha (my pattern matched a prefix of it) is not a timing window.
- `SF_GRACE=40` in the city world is *steps before the street may jump you*, not milliseconds.

I flagged them as "no claim is made" and that was the right instinct, but the honest thing is to
kill them out loud rather than quietly drop them. **The real numbers, read out of the running
fight, are these:**

| what | value |
|---|---|
| `BPM_MS` | 500 (120 BPM, exact) |
| `PERFECT_MS` | **55 ms** |
| `GOOD_MS` | **110 ms** |
| `BEAT_GRACE` | 0.24 beats = **120 ms** of permission look-back |

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED

The MODE requires this, and school changed the instrument completely.

**School: a tap test measures a human, not a phone.** People tap 20-100 ms early and the bias is
not universal, so it cannot be subtracted. So this tool **takes no taps from anybody**. It
compares two clocks the machine already has:

- **the judge's clock**, which is what the fight actually grades against, and
- **the ear's clock**, `getOutputTimestamp().contextTime`, which the spec defines as the sample
  frame the output device is playing *right now*.

Both read in the same instant, in the same frame, with no person anywhere in it. The difference
between them **is** the gap the job asked for.

**And school's second finding paid off immediately**: the browser reports the device latency, so
the audio half was a read. It reported **32 ms of outputLatency** and 10 ms of baseLatency on
this machine.

---

## WHAT THE FIGHT ALREADY DOES, AND IT IS THE RIGHT THING

Reading the running code rather than guessing at it:

```js
function audioMs(){
  if(!AC||!_seq.on||!_seq.t0)return null;
  const lat=((AC.outputLatency||AC.baseLatency||0)||0);
  const t=AC.currentTime-lat-_seq.t0;
  /* V69 SYNC: the per-device offset every real rhythm game calibrates for.
     Phone output latency runs 40-300ms; uncalibrated, a perfectly correct build
     can feel a third of a beat off and read as "no difference". */
```

**The fight reads the device's own latency and subtracts it.** That is exactly what school said
the web makes possible and what native games need a calibration screen for. It is already
shipped, and the comment beside it already knows the 40-300 ms number school went and found.

Two more things the code gets right, and both are worth recording because they are the kind of
thing that is usually wrong:

- **The beat clock is the audio clock, not a frame counter.** `_bpmClock = audioMs()` while the
  song plays, falling back to frames only when it is silent. The comment calls it V67 ONE CLOCK.
- **It grades the PRESS, never the granted shot.** Its own comment: *"the permission gate fires
  on the beat by design, so grading the shot would print PERFECT every time and teach him
  nothing."* That is the tautology trap this lane's RULE ZERO exists to catch, and the fight had
  already caught it itself.

---

## THE NUMBERS

**1. What the device says about itself**

| | |
|---|---|
| outputLatency | **32.00 ms** |
| baseLatency | 10.00 ms |
| getOutputTimestamp | available |
| sample rate | 44100 Hz |

**2. The gap: what the judge thinks the time is, minus what the ear is hearing**

| | |
|---|---|
| median | **9.6 ms** |
| mean | 9.46 ms |
| jitter (sd) | **0.93 ms** |
| worst sample | 10.76 ms |
| samples | 19, over 1.5 seconds |

**3. The grade bands, swept through the fight's own grader**

```
-220ms -> EARLY     -110ms -> GOOD     -55ms -> PERFECT
                      56ms -> GOOD      111ms -> LATE
```

Exactly as declared: PERFECT inside ±55, GOOD inside ±110, EARLY or LATE beyond.

**So: 9.6 ms of error, in a 55 ms PERFECT band.** Somebody doing it right passes.

---

## RULE ZERO

School named the trap: a gap of about zero could mean the fight is ear-true, or it could mean I
am reading the same number twice and subtracting it from itself, which is a tautology dressed as
a pass. So a known **150 ms** shift is injected into one side and the reported gap must move by
150.

```
PASS  the gap moved by -150.26 ms when 150 ms was injected
```

It moves. The two clocks are genuinely being compared.

---

## THE ONE CONDITIONAL FINDING: THE EAR-TRUE CLOCK EXISTS ONLY WHILE THE SONG PLAYS

Measured, by stopping the music loop and asking again:

```
the music loop is off, and audioMs() now returns null
```

When `audioMs()` returns null the beat clock falls back to a frame counter, and **nothing
subtracts the device latency from a frame counter.** So the compensation that makes the judge
ear-true is tied to the song being on.

I am not routing that as a defect and I am not calling it one. With no song there may be no beat
for the player to hear either, in which case there is nothing to be late against. But it is a
real conditional and somebody should know it is there before they turn the music off in a fight.

---

## BLUETOOTH: STILL THE OPEN RISK, STILL QUOTED AND NOT MEASURED

School's numbers stand: typical wireless earbuds are 150-300 ms behind, and the best case
anywhere is about 35 ms. Two things follow from what was measured here:

- **The good news is structural.** The fight subtracts whatever `outputLatency` reports rather
  than a hard-coded number, so if the browser reports a Bluetooth route honestly, the
  compensation follows it for free. Nobody has to build a calibration screen for that.
- **The untested part is whether it follows a route change.** A player who connects headphones
  mid-fight is relying on `outputLatency` updating. That cannot be tested in this harness at all,
  and I am not going to guess at it.

---

## THE INSTRUMENT WAS WRONG THREE TIMES

1. **`page.click` needs the element visible, and the tab bar is not.** The first run never opened
   the COMBAT tab, fell back to some other frame, and confidently reported "not measurable" about
   the wrong frame. The shell switches tabs with an ordinary `.click()` in JS, which does not care
   about visibility, and the heavy frames are lazy (`data-src`). The tool now also **finds the
   fight by asking every frame whether it has the grader in it**, rather than trusting a name.
2. **There is no AudioContext until a real gesture**, and the fight's music loop only runs while a
   fight is live. Two runs measured a game that had never been started. The tool now starts it
   with a **real tap on the start screen**, and the record says which path was used.
3. **It sampled 60 times inside one tight loop and printed a jitter of exactly 0.00 ms.** Both
   clocks are quantised to the render quantum and the loop runs in microseconds, so it read the
   same instant sixty times. **That would have betrayed this round's own school finding** -- the
   whole counter-finding was that the gap is a bias *and* a jitter, and a jitter of zero from
   sixty copies of one number is not a measurement. Sampling now runs on `requestAnimationFrame`
   across a second and a half, so consecutive samples are genuinely different instants.

---

## ROUTED

**Nothing.** There is no defect to bounce back, and a lane that only ever finds problems is not a
lane anybody should trust. The one line this lane is allowed to write stays unwritten this round
because nothing is broken.

Two notes instead, for whoever reads this:

- **SOUNDS' OPEN row `[scheduled beat]` is partly already done inside the fight.** The fight
  already judges by its own audio clock and already offsets by the device's reported latency.
  What that row still covers is the rest of the game, and the "where a phone's delay is known,
  the judgement window offsets by it" half is satisfied here and worth reusing rather than
  rebuilding.
- The rAF loop delivered 19 samples in 1500 ms, about 13 frames a second. That is this headless
  harness with no GPU, not a statement about the game's frame rate, and it is not routed.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- One device, one browser, one output route. This is the harness's audio path, not a phone's, and
  `outputLatency` is explicitly an *estimate*.
- Bluetooth cannot be tested here at all. Its numbers stay quoted, never measured.
- **Video offset is not measured.** School said there are two offsets and this round measured one.
  Whether the picture of the beat agrees with the sound of the beat is a separate question.
- The fight was started from its start screen, in the COMBAT tab, not by walking into a body on
  the street. A fight entered the other way is not proved to behave the same.
- Nothing here says whether the fight is fun, or whether 55 ms is the right band. Both are his.

---

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job asked for the gap between the beat the player hears and the beat the fight scores, and
whether the first fight can be passed by somebody doing it right. The gap is 9.6 ms with 0.93 ms
of jitter, measured machine to machine with a 150 ms control proving the comparison bites; the
bands were swept out of the fight's own grader; and a press on the sound the player hears grades
PERFECT with 45 ms to spare. **E14 is SHIPPED with both rounds.**
