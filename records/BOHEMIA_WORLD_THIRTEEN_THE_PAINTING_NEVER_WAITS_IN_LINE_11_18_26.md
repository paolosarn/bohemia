# WORLD THIRTEEN, ROUND SEVEN, BUILD ONE: THE PAINTING NEVER WAITS IN LINE (11/18/26)

VAMILY rule 453 (round after round: the map fast on a cheap phone on every seed); rules 418(c), 441; asks 440, 475. BUILD 11/18? -
THE PAINTING NEVER WAITS IN LINE. VOTE world13-the-painting-never-waits-in-line-11-18 (stand_in).

## 1. MEASURED (the far stop on a new valley; the demo on a phone; the map's own REROLL)

- The whole painting (100 x 100 blocks at 24 texels) lands 2 to 3 s after it is asked for once the painters are warm, at full speed.
- RIGHT AFTER THE PAGE OPENS it waited 10.5 s: it was asked of VB.worker, the one painter that also paints the land past the map,
  and stood in line behind that job. With the CPU four times slower the same wait was 27 to 32 s, the page's own thread 77 in 100
  idle the whole time (a CPU profile of the wait).
- TRIED AND TAKEN BACK: the painting cut in four quarters on the painters' pool and stitched (the picture, the lights, the depth,
  the blocks' heights, the painter's counts summed). Warm, it landed in 2.0 to 2.6 s against the one piece's 2.2 to 2.7: no gain on
  this box, and a quarter's buildings roll their colours and heights as the close tiles do, not as the painting he saw does (54 in
  100 texels differ, the streets and blocks the same). Not shipped; the stitching code is kept in the record's history only.
- THIS BOX'S LIMIT, said plainly: its four cores are shared with its software GPU (SwiftShader), and the browser's CPU slow-down
  reaches only the painters made after it is switched on, so a 4x reading of a painter is not a phone's. The full-speed readings
  are the measure.

## 2. THE BUILD (slices/BOHEMIA_CITY_WORLD.html, `__THE_MAP_PAINTS_ON_EVERY_CORE__`)

- vbCityReady sends the whole painting to the painters' pool (vbTileSend): a free painter takes it at once, never the land's line.
  VB_CITY_ON_VB is the old way (the gate's plant, the speed probe's --quick 0). vbCityLand gives the painter back.
- THE POOL'S QUEUE: when every painter is busy a job waits its turn in VBT.queue (it was painted on the page's own thread);
  the reaper (45 s for a tile, 120 s for the whole painting) ends a dead painter, makes a new one and lets the painting be asked
  again.
- vbBoxInput: any n x n box of the valley for the painter (the body of vbTileInput, word for word).
- VBC.askAt / VBC.landMs: the painting's ask to landed, for the probe and the gate.

## 3. GATES

- THE MAP PAINTS ON EVERY CORE: new Q6 (a new valley's whole painting asked of the pool; planted on the old worker: red), with Q1
  to Q5 on this tree. Neighbours green: the far end is painted 11/0, the map's lights read as lights 9/0, the map stands up 13/0,
  the Strip reads as the Strip 5/0, the houses stand up close 28/0, the generated world holds 8/0, the valley has its zones 9/0,
  the near end is the block 7/0.

[bb] Battle Brothers draws its world map once at load; ours paints the valley as you go, so the valley comes first in line.
[analog horror] the far view comes up before the edges of the world do, as if the tape found the city first.
