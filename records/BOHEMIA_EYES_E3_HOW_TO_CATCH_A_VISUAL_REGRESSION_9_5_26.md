# EYES AND EARS -- E3 [screenshot diffs]: HOW A MACHINE CATCHES A VISUAL REGRESSION,
# AND WHY THE THING E3 ASKED FOR WOULD HAVE BEEN MUTED IN A WEEK
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E3 asked: how do studios catch visual regressions by machine (golden images, screenshot
diffing, per-tab captures at phone size), and design the pass for every tab of the alpha
and the demo, on every ship.

**THE SHORT ANSWER, AND IT CONTRADICTS THE BRIEF:** golden images on every ship, wired to
a red light, would be muted inside a week in THIS repo, and the measurement that says so
took twenty minutes. What ships instead is a red light on the questions that need no
baseline at all, and the picture diff as a REPORT that routes a human's eyes.

---

## AISLE ONE: HOW GAME STUDIOS DO IT

Games solved this before the web did, because a game is pixels and has no DOM to assert on.

- **UNITY'S GRAPHICS TEST FRAMEWORK** (`com.unity.testframework.graphics`) compares a
  rendered frame to a stored reference with **three** numbers, not one:
  `PerPixelCorrectnessThreshold` (perceptual deltaE per pixel; anything below is ignored),
  `IncorrectPixelsThreshold` (the ratio of pixels allowed to be wrong at all), and
  `AverageCorrectnessThreshold` (the average error across the whole image). A test passes
  only against all three.
- **UNREAL'S `AutomationScreenshotOptions`** carries `maximum_global_error` AND
  `maximum_local_error`, and Epic's own docs say why: the local error compares CHUNKS "to
  locate hot spots of change that are important and would be ignored by the global error."
  It also ships `ignore_anti_aliasing`, a per-channel `tolerance_amount`, and
  `disable_noisy_rendering_features`, which turns off AA, motion blur, SSR, eye adaptation
  and the tonemapper for the shot -- **the engine makes the picture deterministic before it
  compares it**, rather than tuning a threshold to tolerate its own noise.
- **NVIDIA'S FLIP** (Andersson et al., ACM CGIT 2020) is the metric graphics people reach
  for when a number has to mean "a person would notice": a difference evaluator that
  approximates what a human sees when ALTERNATING between two images, amplified by edge
  contrast, rather than PSNR's or SSIM's structural answer.

**WHAT WE TAKE:** two numbers, not one (global and local); make the picture deterministic
before comparing it, not after; and remember that "different" and "worse" are different
questions.

## AISLE TWO: HOW THE WEB DOES IT, AND HOW IT FAILS

- **PLAYWRIGHT** ships this in the box: `toHaveScreenshot` compares with **pixelmatch** in
  the **YIQ** colour space, default `threshold` 0.2, an optional `maxDiffPixelRatio`, and
  **`animations: "disabled"` by default** -- the same "kill the noise first" instinct as
  Unreal. It writes expected / actual / diff on failure. BackstopJS, Percy and Applitools
  are the same idea with a review queue bolted on.
- **AND THE INDUSTRY'S OWN POST-MORTEM IS BRUTAL.** The documented reason teams abandon
  visual regression testing is false-positive fatigue: "the tests scream that a page is
  broken, but to the human eye nothing has changed... within weeks the team mutes the
  alerts, disables the visual checkpoints, and abandons the initiative." The most common
  cause of a flake is TEXT RENDERING; the second is animation; the third is dynamic
  content. And the sentence that decides our design: **"a one-pixel shift in a decorative
  border produces the same alert as a navigation bar that has completely disappeared."**

---

## MEASURED AGAINST OUR OWN REPO (this is the part nobody can look up)

### 1. THE NOISE FLOOR: the pass run twice, same build, nothing changed
`records/BOHEMIA_EYES_NOISE_FLOOR_9_5_26.json` (build 9/5o).

| screen | global | worst 64px block |
|---|---|---|
| CHARACTER bench | **5.95%** | **100%** |
| ANIMATION | 1.67% | 72.9% |
| the demo, standing still | 1.09 - 2.21% | 78.7% |
| CLOTHES | 0.78% | 39.5% |
| the front door | 0.06% | 5.1% |
| the walked game | 0.007 - 0.008% | 1.2% |
| the other fifteen screens | **0.0000%** | 0% |

**15 of 27 screens are byte-identical run to run. TWELVE ARE NOT**, and the worst is the
bench Paolo judges characters on, because it shuffles a citizen, a fit and a facing on
every load. A per-pixel diff wired to a red light would flag nearly half the game on a
build nobody touched, every single run. That is the abandonment curve, in our own numbers,
before we have written the tool.

### 2. WHAT ACTUALLY MOVES BETWEEN BUILDS (round one, 8/31d against 9/5k)
Twelve of the workshop's screens moved **0.00%** across five days of shipping; the ones
that moved were the game (1.18%), the demo (2.25-3.23%), the two front doors (the build
line), and the benches that shuffle. **So the signal is real and it is small.** The problem
is never "can we see the change", it is "can we tell it from the shuffle."

### 3. THE GAME IS A CANVAS INSIDE AN IFRAME, AND HALF THE INDUSTRY'S TOOLING IS BLIND TO IT
The walked city is a `<canvas>` in `BOHEMIA_CITY_WORLD.html`, inside `#cityFrame`, inside
the shell. The player's movement ring and the STANDING / MARKET / CITY / BIKE / SLEEP chips
are DOM in that frame; the world under them is drawn pixels. A DOM probe that asks only the
main document reports a perfectly clean demo -- **this lane wrote exactly that probe this
afternoon and it passed on a surface it could not see.** Frames must be walked, and the
frame's offset must be added, because a frame 802 tall inside an 844 phone has its own idea
of where the bottom is.

### 4. THE FINDING THAT CHALLENGES US HARDEST IS OUR OWN HEADLINE, AND IT WAS WRONG
Round one's loudest line was "the demo's SLEEP button and the bottom arrow run off the
bottom of an iPhone." **FALSE.** Measured in the phone's coordinates: the demo's game frame
is top 0, height 844, and SLEEP's box is 788-832 -- twelve pixels clear. The workshop's
frame is top 42, height 802, and the same chip lands at 801-832 -- also clear. Brightening
the same screenshot 3x shows the chip's cut corner fully drawn above a black band. Dark
chips on a dark ground above a black letterbox, read at page scale, called clipped without
measuring. It is withdrawn at the top of the page he opens, not buried, and it is the
strongest argument in this record: **a pair of eyes is not an instrument, and this lane's
own eyes are the ones that proved it.**

---

## SO THIS IS THE PASS, AND IT IS BUILT, NOT DESIGNED

**RED, on every ship, no baseline, no noise floor, no taste** -- `gates/eyes_gate.js`,
registered in the suite, 49 seconds, green today:
1. the front door opens onto a live canvas (a black rectangle is the classic false success)
2. nothing hangs below or right of the phone's edge, IN THE PHONE'S COORDINATES
3. no text is wider than the box it is printed in
4. nothing threw, on either surface
5. **and the checker still bites**: every run, a copy of the demo with one control parked
   80px below the phone is probed, and a green that misses it fails the gate. This lane
   shipped a blind probe twice in one afternoon; a green from a blind instrument is worse
   than a red, so the instrument is tested by the instrument, every time.

Proven to bite before registering: the injected control was caught at "below by 80px", and
the two real surfaces came back clean in the same run.

**REPORT, every round, never a red light** -- `tools/bohemia_eyes_shots.js` (27 screens),
`tools/bohemia_eyes_diff.py` (global AND worst-64px-block, Unreal's two numbers),
`tools/bohemia_eyes_sheet.py` (the page he opens). Each screen is judged against ITS OWN
measured floor, so the character bench's 5.95% shuffle is not news and the map's 0.00% is.

**HUMAN, and the machine's only job is to put the right picture in front of him**: does
this art belong to this world, is this the same game two taps apart. Ten checks, split
RED / REPORT / HUMAN, are in `banks/eyes/BOHEMIA_EYES_CHECKS_9_5_26.json`, every line
`draft:true`, none of it wired into the game.

**NO GOLDEN IMAGE STORE, ON PURPOSE, TODAY.** A baseline that nobody is allowed to approve
is a baseline that rots, and EVERYTHING IS A THUMB (8/9) killed the approvals queue that
every commercial visual-testing product depends on. The last round's pictures ARE the
baseline, they live in `slices/eyes/` where he can open them, and the diff between rounds
is the report. If a golden store is ever wanted, it goes in `records/`, which is not
published, so it cannot eat the site's 235 MB of its 260 MB cap.

## WHAT THIS ROUND STILL CANNOT DO
- **It cannot hear.** E4 buys the ears.
- **It cannot see a canvas defect.** Sprites clipping through a wall, a seam between tiles,
  a popping frame: the DOM probe is blind to all of it and the pixel diff can only say
  something moved. That is E2 (the glitch list) and E1 (the pixel tells).
- **It cannot judge.** Nothing here says whether a thing is good.

## ROUTED
- **UI**: two cut labels the machine found and named -- the CHARACTER bench's "SHOULDERS"
  cut by 14px, and the MAP caption cut by 484px in the game frame.
- **EYES AND EARS (this lane)**: E2 next (the glitch taxonomy is what turns a moved pixel
  into a named fault), then E1, then E4 for the ears.
- **THE FLEET**: the eyes gate is in the suite now. It is 49 seconds and it is green; if it
  ever goes red, a control fell off the phone or a screen stopped rendering, and neither is
  a matter of taste.

## SOURCES (both aisles, named so a later chat can check them)
- Unity Graphics Test Framework, `ImageComparisonSettings` (per-pixel / incorrect-pixel /
  average-correctness thresholds): docs.unity3d.com/Packages/com.unity.testframework.graphics
- Unreal Engine, Screenshot Comparison Tool and `AutomationScreenshotOptions`
  (`maximum_local_error`, `maximum_global_error`, `disable_noisy_rendering_features`):
  dev.epicgames.com/documentation/en-us/unreal-engine/screenshot-comparison-tool-in-unreal-engine
- Andersson et al., **FLIP: A Difference Evaluator for Alternating Images**, ACM CGIT 3(2),
  2020: dl.acm.org/doi/10.1145/3406183
- Playwright `SnapshotAssertions.toHaveScreenshot` (pixelmatch, YIQ, threshold 0.2,
  `maxDiffPixelRatio`, animations disabled): playwright.dev/docs/api/class-snapshotassertions
- The abandonment post-mortem (false-positive fatigue, text rendering as the first cause):
  visual-regression-testing.dev/reduce-visual-testing-flakiness and
  shakacode.com/blog/flaky-visual-regression-tests-and-what-to-do-about-them
