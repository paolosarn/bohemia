# COMBAT FOUR: A MAN IS DRAWN ONCE (BUILD 11/22 - A MAN IS DRAWN ONCE), ASK ROW 699

11/22/26. Row 699, FOUND BY PLUMBER 8 (records/BOHEMIA_PLUMBER_THE_FIGHT_ON_AUTO_PROFILED_11_22_26.md): 'THE FIGHT ON AUTO DRAWS
EVERY MAN EVERY FRAME. On THE DECK (6 men) every frame was over half a second, 1.6 frames a second at 4x... of 8 s, drawImage 3.8 s
(sheetDraw from blitMan/keepLayers 2.0 s, holdDraw 1.3 s, meleeDraw 1.2 s), the canvas's save and restore 0.75 s; the AI 0.37 s. A
man who has not moved or changed pose since the last frame is drawn again... the ask: a man unchanged since the last frame is not
drawn again (or a board like THE DECK reads at least 6 frames a second at 4x on the census).' Filed for COMBAT; COMBAT FOUR is the
fight's lane now (as rows 679 and 684). Rules 441(a)(c), 461, 465.

## MEASURED BEFORE (main, BUILD 11/22u; a bench of my own: the fight page alone, his phone upright 390 x 844 at 3, the CPU slowed 4x,
## the census's CPU canvas, a 20-man road fight, seed 5, AUTO at 4x, a CPU profile of 6 s)
- 3.4 to 3.8 frames a second. Of 6 s: the frame 4.4 s, draw 3.9 s, drawMan 1.9 s (blitMan 1.5 s: holdDraw 0.66, the armour 0.55,
  meleeDraw 0.43), the fog 0.81 s, the AI 0.98 s, AND createImageBitmap 1.2 s on the page's own thread.
- WHO MADE THE BITMAPS: counted by a wrapper, 32 sheets in the first 8 s of AUTO, 34.5 million pixels, every one from holdImg (the
  held, melee and carried sheets, fetched the first time a man of a look holds or swings): an <img> decoded, then copied into an
  ImageBitmap ON THE PAGE'S THREAD. The camp's page had found the same thing and fixed it its own way (549 ms against 22 ms): a sheet
  decoded from its file is decoded off the page's thread.
- A man is many draws a frame: his body's cell (or his held pose's), each armour piece, his gun, what he holds, what he carries,
  each with its state saved and set; the same draws every frame he stands still.

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html; no rule of the fight changed, nothing he sees changed)
1. __A_MAN_IS_DRAWN_ONCE__: blitMan TAKES A MAN DOWN before drawing him. While he is taken down the fight's glass answers to a
   recorder (its own methods and state on the glass, installed once; sheetDraw asks it too): every draw and every state he sets is
   kept in order with the box it covers on the glass, and nothing is drawn. He is taken down with his feet at the glass's corner (ox
   and oy are whole pixels off his feet), so the camera gliding on AUTO does not make him new. If what he would draw is what he drew
   last frame, to the number, his own little canvas already holds it and the glass gets ONE draw of it at his spot; if anything
   changed (a key of his idle, a step, the night's light on him) the kept draws are played into his canvas and that is laid once.
   What cannot be his own picture is played straight onto the glass, the same draws in the same order: a draw from a canvas remade
   between frames (the hit's red, made in one scratch canvas for every layer: copied at the moment of its draw so the later play shows
   what it showed), a blend other than laying over, a shadow, a filter, words, a read of the glass, a clear, a save left open, a box
   bigger than a man. The ghost and the machine are drawn as before. Every other moment the glass's methods are the browser's,
   looked up at the call, so a page or a gate that wraps them later still sees every draw. The old way: window.__MAN_DRAWN_EVERY_FRAME.
   THE RECORDER KEEPS NO STRINGS: every draw and set is pushed flat into one buffer (its code, its count, its arguments) and held
   against the man's last frame's buffer number by number. My first cut built a text signature a man a frame; its garbage put the
   collector's pauses into the AI's turns (AUTO AT 4X NEVER CRASHES: think 150 -> 231 ms, red); the flat buffer took it back.
2. THE GLASS PICKS THE CHEAPER WAY: keeping only pays where drawing pixels is the cost (the CPU canvas, slowed); where the draw is
   cheap (a phone's GPU, or this box at full speed: 37 against 38 frames a second) the bookkeeping is what costs, and on a 46-man night
   fight at full speed keeping always put the middle frame from 16.7 to 33 ms (AUTO AT 4X A3, red). So draw() times the men's loop
   both ways on the device it runs on: 6 frames straight, 8 kept (2 to fill his canvases, not timed), keeps the cheaper for 240
   frames, asks again (window.__MAN_KEPT_ALWAYS keeps always, for the gate's legs on the keeping itself).
3. __THE_HELD_SHEETS_DECODE_OFF_THE_PAGE__: holdImg fetches the sheet's file and makes its bitmap from it (off the page's thread);
   the <img> way is the fallback (and window.__HELD_SHEETS_ON_THE_PAGE, the gate's plant).

## THE GATE (gates/a_man_is_drawn_once_gate.js, in the suite as A MAN IS DRAWN ONCE, solo: 11 passed, 0 failed, about 2 minutes)
M1 over 6 s on AUTO at 1x (keeping always), 5,976 of 6,153 man-draws laid as his kept picture (97%), 144 made again, 33 straight.
M2 BY DAY: 80 men at four moments, each drawn the old way, made and kept on the same ground: 77 the same to the pixel, 3 within a
turned weapon's edge (at most 30 pixels past 2 levels, the worst 16 of 255: a rotated draw's pixel picking its neighbour at another
spot on the glass), 0 not the same.
M2n AT NIGHT: 63 men at three moments: 11 the same to the pixel, 52 within 1 level of 255 but a turned edge (the night's see-through
layers laid in his canvas first round a level differently), 0 not the same.
M3 THE HIT'S RED: three men flashing from a blow drawn straight, the same as the old way to the pixel (my first cut played the red
scratch canvas after the next layer had remade it: caught by this leg's first run, fixed by the copy at the draw).
M4 over 8 s of AUTO no held sheet copied from an <img> on the page's thread (38 of 38 sheets in hand as bitmaps).
M5 the CPU slowed 4x, AUTO at 4x, 6 s each way: the men drawn 78.6 ms a frame the old way, 47.0 ms the new (60%).
M6 there the glass timed the men both ways (5.3 ms a man straight, 2.3 kept) and kept them.
Planted: the old way on reads nothing kept; a kept picture laid a pixel off reads 20 of 20 men not the same; the held sheets the old
way count 28 copies on the page's thread. E1 nothing threw.
OTHER GATES ON THE FINAL CODE: AUTO AT 4X NEVER CRASHES 7/0 (its longest think 135 ms, every middle frame 16.7 ms; on main 7/0); THE
AURA OF THE ONE YOU CONTROL 29/0; EVERY SHOT IS FELT 11/0; SEE EVERY HIT 10/0; THE FIGHT DRIVES THE MUSIC 10/0 alone (9/1 run beside
another gate: its live loudness leg). THE ARMOUR HE WEARS
SHOWS: its fight legs F1, F2 green; its map legs M1, M2 red (the city map, a page this change does not touch).

## WHAT IT DID TO THE FRAME
- THE CENSUS ITSELF (tools/bohemia_freeze_census.js --cpu --only 'the fight on AUTO', the demo upright through the map's own door, the
  CPU slowed 4x; the old way --arm window.__MAN_DRAWN_EVERY_FRAME=true, against the final code): THE FIGHT ON AUTO AT 1x 5.8 -> 11.3
  frames a second, the median frame 117 -> 67 ms, freezes over half a second 8 -> 0. AT 4x 5.0 -> 7.5 frames a second (THE ROW'S 6
  REACHED), the median frame 67 -> 50 ms, freezes 55 -> 22, the worst 4.5 s -> 2.8 s (that step's 12 s also hold the fight's end and
  the spoils' pictures, 35 PNGs both ways).
- My bench (the fight page alone, 20 men, AUTO at 4x, a CPU profile of 6 s, run twice each way on a 13-man fight too): the men's
  drawing 58 to 70 ms a frame -> 31 ms; what is left at 4x on the CPU canvas is the fog's pattern fill over the dark tiles (drawFog,
  a fifth of draw) and the AI's turns (tick, a fifth of the frame).
- FOR PLUMBER: the freeze gate's KNOWN_OVER for the fight on AUTO (1x: n 16, worst 1100; 4x: n 25, worst 1850) reads 0 and 283 ms at
  1x, 22 and 2833 ms at 4x on this walk (the 4x worst is the fight's end); the 1x line may go.

## SAID PLAINLY
No VOTE card: nothing he sees changed (the same men, the same pixels; the gate proves it). The fight on AUTO does less work a frame.
No line rewritten (465).
