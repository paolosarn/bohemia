# BOHEMIA -- HOW FAST IT IS ON A PHONE (first measurement, 2026-09-05)

PLUMBER lane, VAMILY row [sixty fps] FPS-ON-A-PHONE. The row said "Write the numbers
before touching anything." These are the numbers. Nothing in the game was changed to
get them, and nothing in the game was changed after taking them.

## THE SHORT VERSION

| what a person meets | what it does | what he asked for | verdict |
|---|---|---|---|
| tap the link, see the city | 1.9 s | -- | fine |
| tap the link, then MOVE | 14.1 s | under 5.0 s | MISSED by 2.8x |
| main thread blocked while you wait | 12.5 s | -- | -- |
| the first minute of walking | 20.4 fps | 60 fps | MISSED by 2.9x |
| walking, once it settles | 24.9 fps | 60 fps | MISSED by 2.4x |
| a fight | 25.6 fps | 60 fps | MISSED by 2.3x |
| beats swallowed while you wait | 11.8% | 0% | MISSED |
| beats swallowed once settled | 3.1% | 0% | close |
| downloaded before anything is on screen | 6.01 MB | -- | -- |
| downloaded before you can move | 25.26 MB | -- | -- |
| downloaded by the end of one session | 48.69 MB | -- | -- |

## THE THREE THINGS THAT ARE ACTUALLY WRONG

**1. THE FIRST MINUTE IS THE WORST MINUTE, AND IT IS THE ONLY ONE A STRANGER SEES.**
The walked city pulls its sprite banks AFTER the first frame paints -- eight more
script files, 19.4 MB gzipped, one at a time, downloading and parsing and baking on
the same main thread the game draws on. So the walk measures 20.4 fps
while that is happening and 24.9 fps once it is done. Both are true. Only
the first one is the one somebody who just tapped the link gets, and it is the one that
decides whether they keep tapping.
The late loader is not a mistake -- its own comment carries the measurement that put it
there (shipping those banks as deferred tags turned a five second wait into twenty-nine).
The problem is that nothing covers the gap it creates.

**2. THE WORLD IS DRAWN IN 1.9 s AND YOU STILL CANNOT MOVE FOR 14.1 s.**
Door at 0.5 s. The walked world says it is ready at 1.9 s, and a
screenshot taken at that moment (saved beside this file) shows the city, the character, the
eight-way pad and the day card, all drawn. Then the main thread is BLOCKED FOR
12.5 SECONDS across 17 long
tasks, the worst single one 6.8 seconds long, while
the sprite banks download and bake. Nothing can run in that window: not the game's metronome,
not a thumb, not a question asked from outside. A thumb held on the pad from the moment the
pad exists does not move anybody until 14.1 s.
This is on a desktop-class box, over localhost, with no network delay at all. On a phone on
a real network, the transfer goes on top.

**3. A FIGHT RUNS AT 25.6 FPS AND ASKS FOR 7330 drawImage CALLS A FRAME.**
The 120 BPM law lives in the fight. A beat the frames cannot keep up with is a beat
nobody can play to.

## THE BEAT, AND THIS IS THE 120 BPM LAW'S FIRST REAL CHECK

Nothing in this repo had ever checked that the beat LANDS ON TIME. Gates check that the
number 500 is in the code, or that a step happened; none of them asked whether the step
happened WHEN IT WAS DUE. A metronome is a setInterval, and a setInterval on a blocked
main thread does not run a little late, it runs when the thread is free.

  during the boot window    33.3% of beats late, 11.8% SWALLOWED WHOLE
  worst single stretch      4.1 beats' worth of silence in one gap
  once it settles           13.8% late, 3.1% swallowed, median gap 500 ms against 500

Through the boot window, about one beat in 8
never happens at all, and the worst single gap ate 4.1 beats of
silence. That is the same 12.5 second block from
the section above, seen from the side the 120 BPM law cares about.

Settled is much better but it is NOT clean: 3.1% of beats are still
swallowed whole and 13.8% land more than a tenth of a beat late, on a
median gap of exactly 500 ms. The median being perfect and the tail
being ragged is the signature of a thread that is mostly free and occasionally busy, which is
what a walk on this build is.

## AND THE SAME THING ON A PHONE'S NETWORK, WHICH IS THE ONE THAT COUNTS

Everything above comes off a local server, so the transfer is free. A phone's is not.
Run again through Chromium's slow-4G profile -- 1.6 Mbit down, 150 ms round trip, which is
the preset everybody means by "a bad signal" -- the same demo, same box, same build:

  the logo appears                 8.4 s   (0.5 s on the local server)
  the city is drawn                25.4 s   (1.9 s)
  you can MOVE                     33.0 s   (14.1 s)

So a stranger on a bad signal looks at a blank screen for 8 seconds before the logo
even arrives, and waits 33 seconds before a thumb does anything. Against a five
second goal that is 7x.

One thing gets BETTER on the slow link, and it is worth understanding rather than
celebrating: the beat is fine through the boot (0% swallowed instead of 11.8%),
because when the network is the bottleneck the art arrives in dribbles and the main thread
gets gaps to breathe in. The jam is not caused by the download. It is caused by parsing and
baking the art once it lands, which is why a faster connection makes that part WORSE.

## THE BATTERY, AS HONESTLY AS A CONTAINER CAN PUT IT

Milliamp-hours need a real handset and nothing here can invent them. What a battery actually
pays for is main-thread CPU time, and that can be measured, over a fixed window with a thumb
held down and again with nobody touching anything:

  standing still, doing nothing     8.3% of one core
  walking                           9.9% of one core
  ten minutes of walking            0.99 CPU-minutes

The row asked for ten minutes, so these are ten real minutes each, not a short sample
multiplied up: 10 minutes standing still and
10 minutes with a thumb held down, back to back.

AND THE INTERESTING NUMBER IS THE FIRST ONE, NOT THE SECOND. Standing still costs
8.3% of a core and playing costs 9.9%, so
DOING NOTHING COSTS 84%
OF WHAT PLAYING COSTS. Ten minutes of the game sitting open and untouched burns about
0.83 CPU-minutes. On a phone in a pocket
that is heat and battery for nothing, and it is a much cheaper thing to fix than a frame rate.

These read lower than the 30.2% in the table above, and both are
right: that one is a five second hold taken moments after the world settles, this one is a ten
minute hold with the beat running steadily. The short window catches the peak, the long one
catches the average, and a battery is drained by the average.

MILLIAMP-HOURS ARE STILL OWED. CPU time is what a battery pays for, but the bill also has a
screen, a radio and a thermal throttle on it, and none of those exist here.

## AND ONE FINDING THAT IS NOT A NUMBER

**THE WAKE CARD SITS ON TOP OF THE PAD.** On boot, #daycard is inset:0 over the whole
walked surface, and the browser's own hit test returns the CARD for all eight direction
buttons. A stranger's first presses do nothing. This was found because the instrument's
first walk sample moved nobody and reported a perfectly healthy-looking 0 fps.

## THE SHELL TAX

The walked city is one page, and it can be measured twice: on its own, and inside the demo
that wraps it in an iframe. The steady thing is the COST, not the frame rate.

  standing still, the city alone      1.5% of the main thread
  standing still, inside the demo     12.2% of the main thread
  walking, the city alone             24.6% of the main thread
  walking, inside the demo            30.2% of the main thread

A same-origin iframe SHARES its parent's main thread, so every millisecond the shell spends
is a millisecond the city cannot draw in. The frames-per-second difference between the two is
real but noisy (the demo's settled walk ranged 24.5 to 24.9
fps across runs, and a later gate run of the same tree read even higher), so the CPU numbers
above are the ones to trust and the ones to watch.

And of the thread the walk does use, only 71.1% is painting: the
frame-rate problem in this game is not the drawing.

## HOW THESE WERE TAKEN, AND WHAT THEY ARE NOT

Chromium 390x844 at dpr 3, touch, mobile, over http with gzip. Every input is a real touch event. Every headline number is the MEDIAN OF
3 RUNS of that configuration (9 runs in all) with its
spread kept beside it in the JSON, because single runs of this disagreed by 3x. Frame rates are frames DELIVERED over wall time, not the median gap
between frames -- the gap distribution is bimodal and its median reports the best moment
of a walk as if it were the whole walk.

STILL OWED:
  - MILLIAMP-HOURS ON A REAL HANDSET. The ten-minute CPU windows the row asked for are taken and in this record; what a container cannot add to them is a screen, a radio and a thermal throttle.
  - A REAL PHONE, FULL STOP. Chromium at 390x844 with a CPU throttle is a stand-in: it does not reproduce a phone GPU, its memory bandwidth, its thermal throttle or Safari.
  - THE REAL LINK OVER A REAL NETWORK. These numbers come off a local server; the load time a stranger gets also carries GitHub Pages, TLS and whatever their signal is.

## THE BUDGET THE GATE NOW HOLDS

The goal (60 / 60 / five seconds) is REPORTED on every gate run and never asserted: the
build misses all three today, and a gate that is red on arrival gets switched off by the
next session that hits it. What is asserted is a RATCHET at today's truth plus the measured
spread, so the day somebody makes this WORSE is a red line instead of a drift nobody sees.

  time to first play          <= 19500 ms
  frames walking, settled     >= 24 fps
  main thread while walking   <= 52 %
  frames in a fight           >= 17 fps
  bytes before you can move   <= 30463637
  and the host must hand an empty canvas >= 45 fps, or it cannot judge

Refresh with: `node gates/bohemia_phone_perf.js --repeat 3 --cpu 1 --record`
Held by: gates/fps_on_a_phone_gate.js   Taken by: gates/bohemia_phone_perf.js
