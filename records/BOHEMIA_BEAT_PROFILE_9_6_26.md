# BOHEMIA -- WHERE ONE BEAT ACTUALLY GOES (2026-09-06)

PLUMBER lane, VAMILY row [hot path] THE-BEAT-LOOP-IS-CLEAN. Written by the tool, never typed.

NOBODY HAD EVER PROFILED A BEAT. Of ~520 gates, two measure speed at all and both answer
"how much", never "of what". A frame rate tells you the bill. This tells you who ran it up.

A beat is 500 ms under the 120 BPM law. Every number below is how much of one beat is spent.

## THE HEADLINE

  walking the street   208.5 ms of every 500 ms beat   (41.7% of the main thread)
  in a fight           498.5 ms of every 500 ms beat   (99.7% of the main thread)

THE FIGHT HAS NO HEADROOM LEFT. It is using essentially the whole beat, which is what a
17 frames-a-second fight looks like from the inside. The walked street is using under half.

## THE FIVE MOST EXPENSIVE THINGS, WALKING

  1. (program)           9.88%     310.1 ms
  2. canvas blits        8.09%     253.9 ms   [drawImage, putImageData]
  3. danger + crews      6.93%     217.5 ms   [dangerMark (BOHEMIA_CITY_WORLD.html:34966), __dangerAt (BOHEMIA_CITY_WORLD.html:34958), window.BOHEMIA_DANGER.at (BOHEMIA_CITY_WORLD.html:56123)]
  4. canvas fills        2.72%        85 ms   [fillRect, save, lineTo]
  5. the map grid        2.09%      65.3 ms   [cellAt (BOHEMIA_CITY_WORLD.html:32086), chunkCanvas (BOHEMIA_CITY_WORLD.html:35086), saTex (BOHEMIA_CITY_WORLD.html:34684)]

## THE FIVE MOST EXPENSIVE THINGS, IN A FIGHT

  1. canvas blits       61.79%    1928.7 ms   [drawImage]
  2. (program)          27.29%     851.9 ms
  3. streetTile          2.08%        65 ms
  4. the fight           1.86%      58.5 ms   [drawField (about:srcdoc:10244), drawFloor (about:srcdoc:1515), paintFireButton (about:srcdoc:9632)]
  5. draw                1.05%      32.8 ms

Two thirds of a fight is one call: drawImage. The fight is not thinking too hard, it is
blitting too much.

## AND ONE THING NOBODY WAS LOOKING FOR

THE FIGHT IS ANIMATING BEHIND A HIDDEN PANEL, BEFORE ANY FIGHT HAS HAPPENED.

  the frame box measures        0 x 0, on a panel with display:none
  it runs                       59 frames a second
  it draws                      1062 images a second
  it costs                      3.7% of one core, 18.7 ms of every 500 ms beat

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

  walking, work per beat        <= 303 ms
  the hidden frame, per beat    <= 30 ms

THERE IS NO LINE FOR THE FIGHT, AND THAT IS NOT AN OVERSIGHT. It is already at
99.7% of the beat, so any ceiling is
either above 100% and can never fail, or below today's number and is red on arrival. A gate
red on arrival gets switched off by the next session that meets it. The number is PRINTED on
every run instead, and the day the fight has headroom again a real line can be set.

Scaled by the CPU yardstick the speed gate already uses, so a busy box is corrected for
rather than blamed on the game.

## WHAT IS STILL OWED

  - THE FIXES. The hot paths named here live in slices/ content, which this lane may not touch. Every number is a hand-off to the lane that owns the file. The row says "fix them where a measurement says so"; the measurement is here, the fixing is not this chat's to do.

Refresh with: `node gates/bohemia_beat_profile.js --record`
Held by: gates/beat_budget_gate.js   Taken by: gates/bohemia_beat_profile.js
