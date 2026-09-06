# BOHEMIA -- WHERE ONE BEAT ACTUALLY GOES (2026-09-06)

PLUMBER lane, VAMILY row [hot path] THE-BEAT-LOOP-IS-CLEAN. Written by the tool, never typed.

NOBODY HAD EVER PROFILED A BEAT. Of ~520 gates, two measure speed at all and both answer
"how much", never "of what". A frame rate tells you the bill. This tells you who ran it up.

A beat is 500 ms under the 120 BPM law. Every number below is how much of one beat is spent.

## THE HEADLINE

  walking the street   208 ms of every 500 ms beat   (41.6% of the main thread)
  in a fight           497.5 ms of every 500 ms beat   (99.5% of the main thread)

THE FIGHT HAS NO HEADROOM LEFT. It is using essentially the whole beat, which is what a
17 frames-a-second fight looks like from the inside. The walked street is using under half.

## THE FIVE MOST EXPENSIVE THINGS, WALKING

  1. (program)          10.52%     328.2 ms
  2. canvas blits        8.48%     264.6 ms   [drawImage, putImageData]
  3. danger + crews      6.94%     216.8 ms   [dangerMark (BOHEMIA_CITY_WORLD.html:35687), __dangerAt (BOHEMIA_CITY_WORLD.html:35679), window.BOHEMIA_DANGER.at (BOHEMIA_CITY_WORLD.html:57219)]
  4. canvas fills        2.06%      64.9 ms   [fillRect, save, lineTo]
  5. the map grid        2.05%      63.9 ms   [cellAt (BOHEMIA_CITY_WORLD.html:32706), chunkCanvas (BOHEMIA_CITY_WORLD.html:35807), saTex (BOHEMIA_CITY_WORLD.html:35405)]

## THE FIVE MOST EXPENSIVE THINGS, IN A FIGHT

  1. (program)           80.1%    2464.1 ms
  2. canvas blits        11.5%     353.9 ms   [drawImage]
  3. the fight           3.21%      98.6 ms   [drawField (about:srcdoc:10275), paintFireButton (about:srcdoc:9663), drawFloor (about:srcdoc:1515)]
  4. (anonymous)         0.88%      28.1 ms
  5. draw                0.65%      20.1 ms

Two thirds of a fight is one call: drawImage. The fight is not thinking too hard, it is
blitting too much.

## AND ONE THING NOBODY WAS LOOKING FOR

THE FIGHT IS ANIMATING BEHIND A HIDDEN PANEL, BEFORE ANY FIGHT HAS HAPPENED.

  the frame box measures        0 x 0, on a panel with display:none
  it runs                       59.8 frames a second
  it draws                      0 images a second
  it costs                      1.2% of one core, 5.8 ms of every 500 ms beat

Found because a walk profile of a session that had never entered a fight contained drawField,
which is a fight function. The frame is created at boot and never stops.

HOW THAT NUMBER WAS TAKEN, because the first two attempts were both wrong and the record
should say so: an A/B on walking was INVALID (the later walks were blocked by a card, so the
"after" samples reported 4 fps on a page that was not walking at all -- an invalid sample is
not a fast one). An A/B on standing still was INCONCLUSIVE (the effect and the noise floor
were both about two points, and suppressing an rAF chain turns out to be one-way, so only the
first pair was ever a real comparison). Timing the frame's own callback needs no control arm
and no subtraction of two noisy numbers: three consecutive samples read 3.3%, 2.8% and 3.1%.
When a difference is the size of the noise, stop subtracting and measure the thing directly.

## THE BUDGET THE GATE HOLDS

  walking, work per beat        <= 302 ms
  the hidden frame, per beat    <= 10 ms

THERE IS NO LINE FOR THE FIGHT, AND THAT IS NOT AN OVERSIGHT. It is already at
99.5% of the beat, so any ceiling is
either above 100% and can never fail, or below today's number and is red on arrival. A gate
red on arrival gets switched off by the next session that meets it. The number is PRINTED on
every run instead, and the day the fight has headroom again a real line can be set.

Scaled by the CPU yardstick the speed gate already uses, so a busy box is corrected for
rather than blamed on the game.

## WHAT IS STILL OWED

  - THE FIXES. The hot paths named here live in slices/ content, which this lane may not touch. Every number is a hand-off to the lane that owns the file. The row says "fix them where a measurement says so"; the measurement is here, the fixing is not this chat's to do.

Refresh with: `node gates/bohemia_beat_profile.js --record`
Held by: gates/beat_budget_gate.js   Taken by: gates/bohemia_beat_profile.js
