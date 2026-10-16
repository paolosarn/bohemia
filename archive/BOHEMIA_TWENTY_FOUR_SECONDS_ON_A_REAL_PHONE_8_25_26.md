# TWENTY-FOUR SECONDS ON A REAL PHONE

**8/25/26 — WORLD lane. Every load number this lane has produced was measured on localhost,
with infinite bandwidth and zero latency. Throttled to a weak 4G connection, a friend who
taps the moment the splash appears waits **24.2 seconds** for the world. That number is now
printed on every gate run and held to a ceiling. And the thing that would fix it is no longer
a guess: it is measured, with a probe that finally passes its own control.**

---

## FIRST, THE INSTRUMENT — BECAUSE YESTERDAY'S LIED

Yesterday's comparison of *normal* vs *art blocked* came back **identical**, which is
impossible, so I refused to ship on it. Today, before anything else, I found out why.

Enumerating every canvas in the city frame with a real pixel checksum:

```
NORMAL,      after dismissing:  cv 378x779  2d  opaque=151200  sum=1170979137
ART BLOCKED, after dismissing:  cv 378x779  2d  opaque=151200  sum=2766964240
                                modeFace 64x64  IDENTICAL both runs
```

`cv` is the world, and it **moves** when the art is removed. `modeFace` is the UI portrait
and correctly does not. **The control passes.**

Yesterday's bug, now nameable: I compared `toDataURL(...).slice(-64)` — **the last 64
characters of a PNG data URL.** That is the tail of a compressed stream, and it matched for
three visibly different worlds. Two other things had to be fixed to get an honest reading:
the DAY 1 card sits over the canvas, so the world has to be dismissed first; and the service
worker fetches navigations itself, so page-level interception never fires until it is
blocked.

## THE ANSWER THE PROBE GAVE

With `defer` on chunks 2..N — the change that would drop the blocking payload from 28 MB to
1.75 MB:

```
normal   families=24  worldsum=1170979137  errors=0
defer    families=24  worldsum= 188303220  errors=0
blocked  families= 0  worldsum= 188303220  errors=0

CONTROL  normal vs blocked differ?  true
ANSWER   defer === normal ?         false
ANSWER   defer === blocked?         TRUE
```

**The deferred art arrives — all 24 families, zero errors — and the world is drawn without
it.** The mechanism is one line:

```js
const TP_IMG = {};
for(const k in TP_TILES){ TP_IMG[k]=TP_TILES[k].map(b=>{const im=new Image();im.src='data:image/png;base64,'+b;return im;}); }
const TP_CATS = Object.keys(TP_TILES);
```

`TP_IMG` and `TP_CATS` are baked **once, at parse time**. Deferred scripts run after that, so
they bake from an empty object and stay empty forever. Progressive loading needs a re-bake
and a redraw, not just a `defer` attribute. That was the predicted risk; it is now a measured
fact with the exact line named.

## AND THEN THE NUMBER THAT IS ACTUALLY ABOUT A PERSON

Everything this lane has measured — 40.48 MB, 32.38 MB after the tap, 2.65 MB after the
chunking — was localhost. Correct for counting bytes. Useless for answering *how long does he
stare at it*. Throttled:

```
connection   taps at once   reads the splash 8s
good 4G          9.2 s            2.3 s
weak 4G         24.3 s           16.3 s
```

Two things fall out, and they pull in opposite directions:

- **The splash warm-up is real.** It is the entire difference between those two columns —
  9.2 s down to 2.3 s on a good connection.
- **It only helps a player who waits.** The friend who taps the moment a button appears is
  the friend a demo has to survive, and he waits **24 seconds** on a weak connection. The
  splash appears in 0.8 s, so he has every reason to tap immediately.

The 12x win from yesterday was real and it was measured on a machine where the download was
already finished. On a phone it is worth about seven seconds on a good connection and eight
on a bad one. Worth having. Not the end of the job.

## WHAT SHIPPED

`time_to_play_gate` now runs a third boot under `Network.emulateNetworkConditions` at
3 Mbit / 150 ms — the conservative end of weak 4G, not its headline number — taps
immediately, and waits for the world's canvas to exist:

```
ON A WEAK 4G PHONE, TAPPING AT ONCE: splash 0.8s, world 25.0s, WAIT AFTER THE TAP 24.2s
TIME TO PLAY GATE: 13 passed, 0 failed
```

Two claims: the world must actually appear at all, and the wait is held at 30 s and only ever
comes down. Mutation-tested at 5 s — it fails and names the measured 24.2 s.

**Sizing a wait off a headline bandwidth number is how you ship a demo that only works in the
office.** This gate now measures the office and the phone, and prints both.

## GATES

```
time to play 13/0 (all three ceilings mutation-tested)
walked surface 11/0 (8,595 / 93.3% / 99.9%, unmoved)
```

The build stamp does not move: nothing a player sees changed. This turn bought a number and
an instrument.

## WHAT COMES AFTER — AND IT IS ONE JOB NOW, NOT AN OPEN QUESTION

**Re-bake and redraw when the art lands.** The blocker is named, the line is quoted above,
and the payoff is measured: the world would appear off chunk 1 alone — 1.75 MB instead of
28 MB, roughly **two seconds instead of twenty-four** on a weak phone.

The shape:
1. `defer` chunks 2..N (the world already survives this — gated).
2. After the last chunk, rebuild `TP_IMG` and refill `TP_CATS` (it is `const`, so
   `length=0` then `push`, never a re-bind), plus whatever the other seven banks bake at
   parse time — **find them all before starting, that survey is not done.**
3. Force one redraw.
4. Prove it with the probe in this record: `defer === normal`, control passing.

Then lower the 30 s ceiling to whatever it measures, which is the point of the ratchet.

Still open behind that: the cluster seam for golf / railyard / landfill / farm (19 cells),
and the aperture mismatch (13 cells) plus midpoint keep-out (2 cells) from 8/22.
