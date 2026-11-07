# COMBAT 10 -- AUTO AT 4X NEVER CRASHES (rule 417(a), ask line 473), 11/6/26

Paolo 11/6: "when I put the combat on auto at four times speed and I have like 11 people and they have like 16 people the game
crashes, so you gotta do what you gotta do to handle that." Rule 378: no cap on theirs, 12 of his (16 with the Block Watch).
The finish line's stage 1 item 1: nothing breaks a run.

## 1. Reproduced first (main 55df870a)

Instruments: `tools/bohemia_combat_auto_at_4x_probe_11_6_26.js` (one fight on AUTO at 4x, the fight's own page or through the
demo's map and its own door, his upright phone or his computer, sampled every 2 s), the headless engine for the brain.

| what | 11 v 16 | 16 v 30 |
|---|---|---|
| timers alive at 4x | 1 to 5 | 1 to 5 |
| motions queued | 0 to 4 | 0 to 9 (bursts of zero-length morale notes after a death, drained the next sample) |
| page errors, broken turns | 0, 0 | 0, 0 |
| AUTO's longest think on the page | 41 ms (demo) | 162 ms (bare) |
| headless brain, longest step | 126 ms | 172 to 374 ms (round 1, all 46 standing) |
| JS heap | 100 to 135 MB (demo) | 15 to 31 MB (bare) |
| the fight's decoded pictures, by day | 329 MB | ~420 MB |
| the fight's decoded pictures, AT NIGHT | **847 MB** | ~1 GB |
| the tab (renderer, this box's Chromium) | 1.5 GB on the map, **2.1 to 2.3 GB** in the fight | 1.1 to 1.36 GB bare |
| canvases made in one fight | ~880 | 1,986 (1,260 from the turn strip) |

Nothing stacks at 4x and nothing throws. **The tab is what goes.** A phone kills a tab at its peak memory, not after a collection.

## 2. The cause

The fight held every picture it ever decoded, to the fight's end, with no ceiling:

1. **THE NIGHT (the multiplier).** Every sheet a man was drawn from in the dark got a WHOLE darkened copy (canvas, then bitmap) for
   each moon level the pick tried (moonFor tries up to four, just to read the copy's light). 11 v 16 at night: 134 whole copies,
   518 MB, on top of the day's 329 MB. 4x reaches them all within seconds.
2. **THE POSE SHEETS NEVER LET GO.** The held (cover), melee and carried-thing sheets (rig_hold, rig_melee, and COMBAT 8's donor
   layers) are decoded per look the first time a man needs them and kept, even after every man of that look is down.
3. **THE TURN STRIP** made nine new face canvases every time the order moved, four times as often at 4x.
4. The brain: naming the man (nameFocus) asked the same ring (zocOn) of every tile once per target; threatOf sorted every foe to
   take the nearest (1.4 s of `dist` in one 16 v 30).

## 3. The fix, at the source (slices/BOHEMIA_FIGHT.html, marked `__AUTO_AT_4X_NEVER_CRASHES__`)

1. **THE NIGHT IS LAID CELL BY CELL.** nightPass is per pixel (saturation, multiply, the moon's screen over itself, the figure's own
   alpha), so a cell darkened alone is the same pixels as that cell cut from a darkened sheet. `nightSheet` answers a `NightSheet`
   (the sheet and the moon, no pixels); the canvas's `drawImage` hook (the one the packed sheets already use) darkens only the cell
   asked for, once, into ONE cache with a ceiling (`NIGHT_CELLS_MB` 48, the cell drawn longest ago let go first, its bitmap closed).
   The pick's light is read off a copy no wider than the 192 px it always sampled (nearest), darkened the same way. Proven: 24 cells,
   four moons, a body sheet and a held sheet: **0 channels of any pixel differ**; the light the same number. The machine's chip still
   lays itself on a whole night sheet (`nightWhole`, machines are few). `FIGHT_OPTS.nightWhole` puts the old way back for a gate.
2. **A SHEET NOBODY IS DRAWN FROM IS LET GO** (`poseSweep`, every 2 s): a held, melee or carried sheet not drawn from in 20 s is closed
   and forgotten; asked for again it comes back the way it came the first time (fetched, decoded off the frames), the man drawn as
   before until it is in. No ceiling by day on purpose: measured, 154 of 208 MB of them are drawn from inside any 3 s of an 11 v 16
   (a ceiling would stand men up out of their cover).
3. **THE STRIP KEEPS ITS FACES** (`stripFace`): one canvas per man per size, drawn again; the same picture.
4. **THE BRAIN, THE SAME CHOICES, LESS WORK:** zocOn kept for one naming (`ZOC`, only for the side being named, dropped while a raised
   man is stood up for a sum), the nearest foe by one pass (the stable sort's first), deathWorth's reach read once. Proven by the gate's
   A1: 12 fights from 6 v 8 to 16 v 30, men, beasts, the machines, kids, heavies, some at night: **every event the same on the same
   dice**. Slow steps (over 60 ms) in the 16 v 30 bench: 18 -> 14, their time 2,358 -> 1,256 ms (naming the man 642 -> 189 ms).
5. **THE METER** `window.FIGHT_PICS()`: the fight's decoded pictures by kind (body, pose, night cells, whole night sheets, ground) and
   `held`, the bitmaps a phone cannot purge. PLUMBER's rule 418 can read it.

## 4. After

| what | before | after |
|---|---|---|
| 16 v 30 phone, AUTO 4x, by day: pictures peak / at the end | ~420 / ~420 MB | 377 / 253 MB (41 sheets let go) |
| 16 v 30 phone at night: pictures peak | ~1 GB | 405 MB (night cells 48 MB) |
| 11 v 16 at night, the old way against the new (gate A3) | 713 MB | 328 MB |
| AUTO's longest think on the page, 16 v 30 | 162 ms | 86 ms (61 to 87 over runs) |
| the frames' middle / 95th on the phone, 16 v 30 | 20 to 24 / 33 to 57 ms | 16.7 / 33.4 ms |
| the JS heap, start to end (after a collection) | | 13 -> 16 MB bare; 88 -> 93 MB in the demo |
| the demo, 11 v 16: tab on the map -> fight peak | 1,525 -> 2,305 MB | 1,203 to 1,435 -> 1,978 to 2,122 MB |
| the demo, 11 v 16: the fight's pictures peak / end | 329 / 329 MB | 293 / 175 MB |
| page errors, broken turns, stacked motions | 0 | 0 |

## 5. The gate

`gates/auto_at_4x_never_crashes_gate.js` (suite row AUTO AT 4X NEVER CRASHES): A1 the brain is the same; A2 16 v 30 on his upright
phone on AUTO at 4x start to end (no error, no broken turn, under 12 timers, the timed motions under 16 and every burst drained, AUTO's
think under 150 ms, the frames' middle under 20 ms, no freeze over 750 ms, the heap flat within 24 MB, the pictures under 450 MB and
lower at the end than the peak); A3 the same at night (cells under 48 MB, no whole night sheet for a man) and the old way at least
twice the pictures; A4 the night is the same pixels; A5 12 v 20 on his computer; A6 11 v 16 through the demo's own door on his phone.

Long tasks on this box: up to 289 to 432 ms, the same size as before the change (422 to 482). The profile says they are the frame's own
drawing of 46 men rasterised in software (this box's browser has no graphics chip: `drawLadders`' `save` carries the flush), not the
brain; the freeze ceiling is set at 750 ms so a real freeze is caught and this box's raster is not.

## 6. What it is not (named, not done)

- **By day the fight still holds 290 to 380 MB of decoded art** for the 22 to 35 different looks a big fight deals (each look's body
  atlas ~4 MB, its held sheet a whole 2048-px sheet of 6 to 9 MB, its melee sheets ~2.6 MB). That is the art's own size per look. With
  the map's own 1.2 to 1.5 GB in the same tab, a 4 GB iPhone may still be near its edge in the biggest day fights. The levers past this
  are the art (ANIMATION's held sheets cut per clip or per facing, COOK THREE) and the map's own memory (WORLD, PLUMBER's rule 418).
- No iPhone on this box: every number is Chromium on the phone's profile. His next 11 v 16 on AUTO at 4x is the real test.
- The two AUTO reds (AUTO PLAYS SMART H4 'raiders idle 1', AUTO HOLDS THE ROOF R3 'left-posting 1, up-down 1') are the same numbers on
  clean main 55df870a (and the brain is proven the same): not this round's.

[bb] Battle Brothers draws its whole company and an enemy column of 30-plus at four times speed on a PC; what made ours fall over was
never the count of men but the pictures each one dragged in, so the count stays uncapped (rule 378). [analog horror] the night is
still the same tape-dark on every pixel; it is just laid on the frame being shown, not on the whole reel.
