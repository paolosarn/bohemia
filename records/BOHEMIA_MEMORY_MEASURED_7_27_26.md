# BOHEMIA — WE FINALLY WEIGHED THE GAME (7/27/26, ART lane)

## WHY THIS, WHILE HE IS ASLEEP

The mobile render contract I wrote on 7/26 had one clause I marked UNMET in my
own handwriting: memory. It said, out loud, "NOT YET INSTRUMENTED. No session has
measured live canvas bytes on a real device... Instrumenting it is a backlog
item, not a claim."

The next thing on the ART lane's list is growing the tile set from one
residential street to a family per district type. That is the thing that spends
the budget. You measure the budget BEFORE you multiply the spender, not after the
phone starts dying and nobody can say when it started. So this went ahead of the
tile set, deliberately, and it is a reordering worth saying plainly rather than
presenting as the original plan.

It is also the right thing to do unattended: it is this lane's own logged debt,
it touches no other lane's files, and it changes no behaviour. It reads.

## WHAT IT IS

`tools/bohemia_canvas_memory_probe.js` opens the real shipped surfaces in a real
browser, at iPhone portrait, and counts what the tab is actually holding:

- every canvas at width x height x 4, in **every frame** (the alpha carries its
  heaviest modules in iframes — a main-frame-only count reports the biggest thing
  in the game as weighing nothing)
- every decoded image at its natural size (a 4 KB PNG is 300 KB once decoded)
- the JS heap, read over the debug protocol **after forcing a collection**,
  because otherwise a leak and a merely-uncollected heap look identical

Everything is tracked by weak reference, so anything the app has genuinely let go
of stops counting. That is what makes the result mean something: a cache that
works shows up as a number that stops climbing.

## THE NUMBERS

| surface | pixels | heap | resident peak | of the 224 MB iOS floor |
|---|---|---|---|---|
| ALPHA, every tab opened | 62.1 MB (2604 canvases) | 46.2 MB | **97.5 MB** | 44% |
| RUN, 480 steps outdoors | 8.6 MB | 10.3 MB | 18.9 MB | 8% |
| CITY (the map) | 0.8 MB | 1.8 MB | 2.6 MB | 1% |

(The heap moves a megabyte or two between runs - the alpha measured 97.5, 98.8 and
99.6 MB resident across three runs of the same build - so read the resident column
as "about 98 MB, 44% of the floor", never to the decimal. The pixel column is exact
arithmetic and does not drift at all: 62.1 MB, 2604 canvases, every time.)

## THE GOOD NEWS, AND IT IS THE ACTUAL CLAUSE

**Walking the valley 480 steps grew the picture by 0.0 MB.** The whole point of
section 8 was that chunk caches times era variants is how a small game hits a big
wall. The WORLD lane's bounded plot LRU is doing exactly what it was built to do:
the world streams past you and the memory does not climb. That is no longer a
hope, it is a checked fact, and the gate fails if it ever stops being true.

## THE BAD NEWS, AND IT IS NOT WHAT THE CLAUSE WAS WATCHING

The clause watched canvases. Canvases are not where this game keeps its weight.

1. **2604 live canvases** once every tab has been opened — 2217 in the shell
   itself, 188 in the map module, 193 in the run module. About 21 KB each, which
   is exactly why nobody ever noticed: no single one of them looks wrong. They
   survive a forced collection, so they are live, not garbage waiting to go.
2. **~46 MB of JS heap at load**, because the art arrives as base64 text and
   lives as JavaScript pixel arrays — never as an image, never as a canvas. A
   canvas-only budget would have called the heaviest thing in the build free.

Neither is on fire today. 44% of the floor with every tab open is real headroom.
But both are the kind of thing that goes from fine to fatal in one feature, and
neither was being counted at all until tonight.

**This is a work item for the lanes that own those tabs, not a thing the ART lane
should reach into.** It is written down here and in the contract so it is theirs
to see, not mine to quietly patch inside somebody else's file.

## THE LIMIT, WHICH TRAVELS WITH EVERY NUMBER ABOVE

**This is headless desktop Chromium. It is not an iPhone.** The pixel arithmetic
is the same on any device so those bytes transfer; the JS heap and the
compositor's own copies do not. What this proves is the SHAPE of the curve — does
memory level off under exercise, or climb forever — which is the thing that
actually kills a phone. A real-device number still needs a real device, and
nothing here pretends otherwise.

## FOUR GREEN LIES I HAD TO KILL FIRST

Worth recording, because every one of them would have shipped as a passing gate:

1. The first run pressed 480 arrow keys at the run slice and reported "memory did
   not grow." It had not grown because the player was standing in his own
   bedroom, and the probe was steering at a door using the OUTSIDE world's
   coordinates while standing INSIDE. 480 presses, one tile of movement, a clean
   green number about nothing.
2. The second run clicked all eleven tabs of the alpha and reported the whole
   build as holding 0.8 MB. Every click had landed on the TAP TO ENTER splash.
   0.8 MB is what a build weighs when you have never opened it.
3. Fixed version 2 got out of the house — on the floorplan that existed that
   hour. Steering toward the door and flipping axis when stuck wedges in a corner
   the moment the rooms change, and the RUN lane had just re-dressed the
   interior. So it now reads the interior's own passability grid and BFSes a real
   path. A probe that only works on one floorplan stops measuring silently the
   day somebody moves a wall.
4. Even with a perfect path, the last step never landed: walking into a shut door
   opens it and returns WITHOUT moving, because doors animate open on the beat.
   The probe was hammering at a door mid-swing. It now presses on the beat.

All four are impossible to pass with now: the record carries proof that the walk left
the house and reached the street and that every tab opened, and the gate refuses
an exercise that did not happen. A probe that cannot prove it did the thing is
worth less than no probe, because it produces confidence instead of data.

## THE GATE

`gates/canvas_memory_gate.py`, registered in the suite. 31 checks. Ratchets:
120 MB resident, 75 MB pixels, and walking may not grow the picture by more than
2 MB. It also fails if the contract ever goes back to claiming it is
uninstrumented, or if a number ever loses the desktop caveat.

What it does NOT do, stated in the gate's own comment rather than left to be
discovered: it reads a recorded measurement, it does not launch a browser. A
three-minute browser probe inside the suite every lane runs on every ship is a
tax that gets a gate deleted, and a deleted gate enforces nothing. So staleness
is a hard fail on exactly one hash — the starter tile set's, because the tile set
is the thing this clause warns will multiply. Re-take the measurement with
`node tools/bohemia_canvas_memory_probe.js`.

## NOTHING TO JUDGE

No art was cooked. No pixel changed. Nothing here is a candidate.
