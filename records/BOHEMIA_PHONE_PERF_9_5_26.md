# BOHEMIA -- HOW FAST IT IS ON A PHONE (first measurement, 2026-09-05)

PLUMBER lane, VAMILY row [sixty fps] FPS-ON-A-PHONE. The row said "Write the numbers
before touching anything." These are the numbers. Nothing in the game was changed to
get them, and nothing in the game was changed after taking them.

## THE SHORT VERSION

| what a person meets | what it does | what he asked for | verdict |
|---|---|---|---|
| tap the link, see the city | 2.8 s | -- | fine |
| tap the link, then MOVE | 18.7 s | under 5.0 s | MISSED by 3.7x |
| main thread blocked while you wait | 16.5 s | -- | -- |
| the first minute of walking | 18.5 fps | 60 fps | MISSED by 3.2x |
| walking, once it settles | 33 fps | 60 fps | MISSED by 1.8x |
| a fight | 17.8 fps | 60 fps | MISSED by 3.4x |
| downloaded before anything is on screen | 5.94 MB | -- | -- |
| downloaded before you can move | 28.05 MB | -- | -- |
| downloaded by the end of one session | 48.59 MB | -- | -- |

## THE THREE THINGS THAT ARE ACTUALLY WRONG

**1. THE FIRST MINUTE IS THE WORST MINUTE, AND IT IS THE ONLY ONE A STRANGER SEES.**
The walked city pulls its sprite banks AFTER the first frame paints -- eight more
script files, 19.4 MB gzipped, one at a time, downloading and parsing and baking on
the same main thread the game draws on. So the walk measures 18.5 fps
while that is happening and 33 fps once it is done. Both are true. Only
the first one is the one somebody who just tapped the link gets, and it is the one that
decides whether they keep tapping.
The late loader is not a mistake -- its own comment carries the measurement that put it
there (shipping those banks as deferred tags turned a five second wait into twenty-nine).
The problem is that nothing covers the gap it creates.

**2. THE WORLD IS DRAWN IN 2.8 s AND YOU STILL CANNOT MOVE FOR 18.7 s.**
Door at 0.7 s. The walked world says it is ready at 2.8 s, and a
screenshot taken at that moment (saved beside this file) shows the city, the character, the
eight-way pad and the day card, all drawn. Then the main thread is BLOCKED FOR
16.5 SECONDS across 21 long
tasks, the worst single one 7.9 seconds long, while
the sprite banks download and bake. Nothing can run in that window: not the game's metronome,
not a thumb, not a question asked from outside. A thumb held on the pad from the moment the
pad exists does not move anybody until 18.7 s.
This is on a desktop-class box, over localhost, with no network delay at all. On a phone on
a real network, the transfer goes on top.

**3. A FIGHT RUNS AT 17.8 FPS AND ASKS FOR 7372 drawImage CALLS A FRAME.**
The 120 BPM law lives in the fight. A beat the frames cannot keep up with is a beat
nobody can play to.

## THE BATTERY, AS HONESTLY AS A CONTAINER CAN PUT IT

Milliamp-hours need a real handset and nothing here can invent them. What a battery actually
pays for is main-thread CPU time, and that can be measured, over a fixed window with a thumb
held down and again with nobody touching anything:

  standing still, doing nothing     9.4% of one core
  walking                           14.8% of one core
  ten minutes of walking            1.48 CPU-minutes

Read that last line as: ten minutes of play asks a phone for about
1.48 minutes of solid single-core work, before its screen, its
radio or its thermal throttle are counted. Windows of 30s
each.

These read lower than the 28.2% in the table above, and both are
right: that one is a five second hold taken moments after the world settles, this one is a
30 second hold with the beat running steadily. The short
window catches the peak, the long one catches the average, and a battery is drained by the
average. THE REAL NUMBER IS STILL OWED and it is the first thing to take on a handset.

## AND ONE FINDING THAT IS NOT A NUMBER

**THE WAKE CARD SITS ON TOP OF THE PAD.** On boot, #daycard is inset:0 over the whole
walked surface, and the browser's own hit test returns the CARD for all eight direction
buttons. A stranger's first presses do nothing. This was found because the instrument's
first walk sample moved nobody and reported a perfectly healthy-looking 0 fps.

## THE SHELL TAX

The walked city is one page, and it can be measured twice: on its own, and inside the demo
that wraps it in an iframe. The steady thing is the COST, not the frame rate.

  standing still, the city alone      1.1% of the main thread
  standing still, inside the demo     10% of the main thread
  walking, the city alone             24.3% of the main thread
  walking, inside the demo            28.2% of the main thread

A same-origin iframe SHARES its parent's main thread, so every millisecond the shell spends
is a millisecond the city cannot draw in. The frames-per-second difference between the two is
real but noisy (the demo's settled walk ranged 32.7 to 33
fps across runs, and a later gate run of the same tree read even higher), so the CPU numbers
above are the ones to trust and the ones to watch.

And of the thread the walk does use, only 46.1% is painting: the
frame-rate problem in this game is not the drawing.

## HOW THESE WERE TAKEN, AND WHAT THEY ARE NOT

Chromium 390x844 at dpr 3, touch, mobile, over http with gzip. Every input is a real touch event. Every headline number is the MEDIAN OF
3 RUNS of that configuration (9 runs in all) with its
spread kept beside it in the JSON, because single runs of this disagreed by 3x. Frame rates are frames DELIVERED over wall time, not the median gap
between frames -- the gap distribution is bimodal and its median reports the best moment
of a walk as if it were the whole walk.

STILL OWED:
  - BATTERY IN TEN MINUTES ON A REAL HANDSET. No container can report milliamp-hours. What is here instead is main-thread CPU time, which is what a battery pays for.
  - A REAL PHONE, FULL STOP. Chromium at 390x844 with a CPU throttle is a stand-in: it does not reproduce a phone GPU, its memory bandwidth, its thermal throttle or Safari.
  - THE REAL LINK OVER A REAL NETWORK. These numbers come off a local server; the load time a stranger gets also carries GitHub Pages, TLS and whatever their signal is.

## THE BUDGET THE GATE NOW HOLDS

The goal (60 / 60 / five seconds) is REPORTED on every gate run and never asserted: the
build misses all three today, and a gate that is red on arrival gets switched off by the
next session that hits it. What is asserted is a RATCHET at today's truth plus the measured
spread, so the day somebody makes this WORSE is a red line instead of a drift nobody sees.

  time to first play          <= 26500 ms
  frames walking, settled     >= 24 fps
  main thread while walking   <= 52 %
  frames in a fight           >= 12 fps
  bytes before you can move   <= 33827271
  and the host must hand an empty canvas >= 45 fps, or it cannot judge

Refresh with: `node gates/bohemia_phone_perf.js --repeat 3 --cpu 1 --record`
Held by: gates/fps_on_a_phone_gate.js   Taken by: gates/bohemia_phone_perf.js
