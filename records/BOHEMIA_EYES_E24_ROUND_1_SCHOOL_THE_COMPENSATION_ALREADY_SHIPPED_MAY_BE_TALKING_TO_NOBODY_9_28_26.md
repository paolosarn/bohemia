# EYES AND EARS -- E24 [phone latency] -- ROUND ONE OF TWO: SCHOOL
## NO MEASURING THIS ROUND. This is desk research, armed for round two.
### 9/28/26 -- session eyes-5vql33

Row: "the fight is judged on the beat and nobody has measured how late a tap's sound arrives on
iOS Safari." School first: how rhythm games measure and calibrate touch-to-audio latency on
iOS and Android; then round two measures ours.

---

## THE HEADLINE, FOUND BEFORE ANY NEW MEASUREMENT WAS TAKEN

This lane already has a shipped record that looks like it answers this row: **E14 [late beat]**
(`records/BOHEMIA_EYES_E14_ROUND_2_THE_BEAT_IS_EAR_TRUE_9_7_26.md`) measured a 9.6 ms gap
between the fight's judging clock and the browser's own reported "ear" clock, and found the
fight already reads `AudioContext.outputLatency||AudioContext.baseLatency||0` and subtracts it
before grading a press. That record is real and its number is real. **But it measured the gap
between two clocks inside one desktop-shaped browser, on the machine this fleet runs on, never
a real phone, and it says so itself** ("this is the harness's audio path, not a phone's,"
"outputLatency is explicitly an estimate"). It is not wrong. It is not the same question as
this row's.

**And the school found the specific reason a phone changes the answer: the property the fight's
compensation is built on is not reliably there on the one platform this game ships to.**

- **`AudioContext.outputLatency` has a still-open "fixme" in WebKit** (Safari's engine) and, per
  multiple sources including caniuse's own tracking, only reached broad availability across
  "Baseline 2025" -- meaning for a long stretch, and possibly still on the OS versions real
  strangers carry, **Safari on iOS returns nothing for this property.**
- **`baseLatency` fares a little better but is not a clean yes either**: WebKit's own source
  declares the method, but multiple open WebKit bugs (choppy/glitchy Web Audio playback on iOS,
  `AudioContext.currentTime` speeding up when a Bluetooth speaker connects, a regression that
  increased latency specifically while playing audio over WebRTC) show the underlying clock
  and buffering this property is supposed to describe has itself been unreliable across recent
  Safari versions.
- **The fight's own line is `AC.outputLatency||AC.baseLatency||0`.** On a browser where the
  first two are unavailable or wrong, this compensates with **zero**, silently, and grades
  every press as if the phone had no output delay at all. Nothing in that line can tell the
  difference between "this phone has 0 ms of latency" and "this phone will not tell me."

So the premise under this row is not "we have never measured this." It is closer to: **we have
one real measurement, on a surface that cannot reproduce the failure mode school just found,
and the mechanism that measurement praised may be a no-op on the actual target device.**
That is worse than an unmeasured row, and it is why round two cannot reuse E14's tool as-is; it
has to run on something that behaves like an iPhone's Safari, not this box's Chromium.

---

## WHAT REAL RHYTHM GAMES ACTUALLY DO, AND WHY THEY DO IT THAT WAY

**Every real answer school found is a game asking the PLAYER, not the OS, because the OS's own
number is not trustworthy enough to build a judge on.** The published pattern (Rhythm Quest's
own devlog, echoed by osu!'s offset wizard and the general genre convention): the game plays a
short accented loop, the player taps along for several bars, the game keeps the taps that land
near the beat and throws out outliers, and the median (or a trimmed mean) becomes a personal
**offset in milliseconds** applied from then on. osu! ships this as both an automatic "Offset
Wizard" (tap along, it computes a number) and a manual millisecond slider players nudge by ear
afterward, because a computed number is a starting point, not a guarantee.

**This is the opposite instrument from E14's.** E14 compared two clocks the MACHINE already had
and needed no person in the loop, which is exactly right for grading whether the fight's own
math is self-consistent. A REAL calibration screen puts a HUMAN in the loop on purpose, because
the number it is chasing -- the true, physical gap between "the phone made a sound" and "the
phone told JavaScript a finger touched it" -- has no API that reports it honestly on every
device, which is precisely the WebKit gap just found. A tap-along screen is how the genre
answers a question the platform will not.

**The professional, device-agnostic version of the same idea is a loopback measurement**: play
a click through the speaker, catch it again on the microphone, and read the real gap off the
recording (this is what the cited hardware/software latency testers, e.g. Superpowered's
latency test app, do -- speaker to mic, no OS API trusted at all). That is the ONLY method in
the whole school round that does not depend on the browser telling the truth about itself.

---

## THE NUMBERS FOUND, EACH WITH ITS CAVEAT: WEB SEARCH SYNTHESIS, NOT A FETCHED PRIMARY SOURCE

Same caveat this lane has given every round this session: direct fetches to the primary pages
(WebKit bug tracker entries, Android source docs, the itch.io devlog itself) were blocked by
this box's network egress policy; every figure below is web-search synthesis, quoted rather
than read from the original page, and round two should treat any of them that matters enough
to design around as worth a second check once a real device is in hand.

| what | number | source shape |
|---|---|---|
| iOS native audio output latency | "a few ms," among the best of any platform | general audio-latency consensus |
| iOS Safari Web Audio, real-world reports | 100 ms+ commonly, up to ~1500 ms in a cited bad case | developer forum / blog reports |
| iOS Safari dev target (quoted) | under 100 ms | game-dev latency guidance |
| Android native, low-latency path (Oboe/AAudio exclusive) | 3-8 ms on flagship, 10 ms first hit by the Pixel 3a (2019) | Android Developers / Oboe docs |
| Android native, shared/no-exclusive path | 15-40 ms, some mid-tier devices 30-80 ms, cheap devices up to 150 ms | Android Developers |
| Android Chrome (BROWSER, not native) | mean ~41 ms, peaks noted separately at 3-5 ms | web audio measurement discussion |
| touch sensor to app-processor event (native pipeline, not browser) | ~70-100 ms | mobile touch-latency literature |
| the classic mobile-browser tap delay | ~300 ms, mostly removed by modern viewport/touch-action handling, with iOS carrying its own tap-duration heuristics on top | browser vendor blogs |
| our own fight's grading bands (already shipped, not new this round) | PERFECT 55 ms, GOOD 110 ms, permission look-back 120 ms | this lane's own E14 record, read from the running code |

**THE ONE COMPARISON THAT MATTERS FOR THIS ROW'S OWN QUESTION** ("does a 120 BPM eighth, 250 ms,
survive it"): the row is not asking whether the fight's PERFECT band survives -- E14 already
showed that band has 45 ms of room over a 9.6 ms machine-to-machine gap. It is asking whether
the FULL real-world chain (finger hits glass -> OS -> browser event -> our JS -> AudioContext
scheduling -> the phone's own speaker) fits inside that budget on an iPhone. Stack the browser
figures above (a touch pipeline commonly quoted in the tens of ms, plus a Safari Web Audio
report that is itself sometimes 100 ms or more) and the arithmetic alone says it can plausibly
eat a third to all of a 250 ms eighth on exactly the platform this game is going into somebody's
hand on -- which is a reason to measure it for real, not a measurement in itself.

---

## WHAT ROUND ONE DOES NOT DO, ON PURPOSE

**No number in this record was produced by running our game.** Every figure above is somebody
else's platform or somebody else's game, cited for the shape of the problem and the shape of the
fix, not applied to us. MODE: SCHOOL THEN CHECK forbids measuring in round one, and round two
exists specifically to take a real reading rather than reason from these secondhand numbers.

---

## WHAT ROUND TWO IS ARMED TO DO DIFFERENTLY BECAUSE OF THIS SCHOOL ROUND

1. **Cannot run on this box's headless Chromium and call it a phone.** E14 already proved that
   surface answers a different, easier question (two clocks agreeing with each other) than this
   row asks (does a real phone's whole touch-to-sound chain fit the budget). Round two needs
   either a real device, a device farm, or an emulation path that actually engages Safari's/
   Chrome-for-Android's real audio stack -- a plain desktop browser with `--force-device-scale`
   is not that, no matter how it is labelled.
2. **Read what `outputLatency`/`baseLatency` actually return on whatever surface round two DOES
   use, before trusting anything the fight computes from them** -- if they read `undefined` or
   `0` on the test surface, that is itself the finding, not a reason to skip ahead.
3. **Measure the touch side, not only the audio side.** E14 measured audio-clock agreement only;
   nothing in this lane has ever timed the gap between a real finger touching the glass and the
   fight's own JS handler receiving that touch. That gap is the other half of "touch-to-sound"
   and school found real numbers (tens of ms of pipeline, historically up to 300 ms of browser
   tap delay) that could dominate the budget on their own.
4. **If a real device is out of reach, the honest fallback the genre itself uses is a loopback
   test** (play a click, catch it on a microphone) rather than trusting any single browser API,
   because the same WebKit gap this round found is exactly the failure mode a loopback test
   cannot be fooled by.
5. **State whether the 250 ms eighth survives, or does not, with a number** -- the row asked for
   one number a platform and a yes/no against the beat; a school round is not allowed to answer
   that, and round two must.

---

## ROUTED

**Nothing yet.** No defect has been measured this round; E14's finding stands as what it always
was (a correct, useful measurement of a different, narrower question). The open risk named
above -- the fight's device-latency compensation may silently read zero on Safari -- is a
premise for round two to test, not a bounce-back to post now. Posting it as a finding before it
is measured on a real surface would be exactly the mistake this lane's own RULE ZERO exists to
stop.

## SHIP TEST FOR THIS ROUND
School asked for how the craft measures and calibrates touch-to-audio latency on iOS and
Android, armed for a real check. Delivered: the genre's own method (tap-along calibration,
never trusting the OS's self-report alone), the professional fallback (loopback against a
microphone), and the specific, sourced reason this game's own already-shipped compensation may
not reach the platform it needs to reach. **Round one SHIPPED. Round two measures.**
