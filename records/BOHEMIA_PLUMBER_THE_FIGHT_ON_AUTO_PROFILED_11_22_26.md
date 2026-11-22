# THE FIGHT ON AUTO, PROFILED (PLUMBER 8, 11/22/26; rule 441, row 677: NO FREEZE OVER HALF A SECOND, F1)

WHAT WAS MEASURED. The freeze census's own way into a road fight (the demo upright 390 x 844, the CPU slowed 4x, this box's
software canvas as the census walks it: `cpu: true`), the fight on AUTO at 4x, a CPU profile of 8 s of it (Chrome's sampling
profiler, 0.5 ms), with another gate's browser running beside it (the shares below hold, the absolute times are high). The board
was THE DECK (6 men). The census's two walks this round read the fight on AUTO at 1x at 5.5 fps
(12 freezes over half a second) and at 4x at 1.6 fps (19), the walk before at 6.9 fps on another board: the fight's frame
depends on its board.

WHERE THE FRAME GOES (8 s of samples, self time):

| self ms | what |
|---:|---|
| 4,578 | (program): the browser's own work, the software canvas's raster and the garbage collector among it |
| 3,770 | drawImage: pictures drawn onto the board's canvas |
| 587 | restore (canvas state) |
| 300 | checkVisibility (UI FOUR's pop-up watcher, below) |
| 167 | save (canvas state) |
| 137 | getImageData |
| 125 | getBoundingClientRect |

TOTAL TIME BY CALLER (each function with everything it called): frame 5,546 ms; draw 5,063; sheetDraw (the packed sheet's cell
drawn) 3,771; keepLayers 2,043 (drawMan 2,034, blitMan 1,936); holdDraw 1,272; meleeDraw 1,160; drawGround 471; the AI's turn
(aiStepAuto, bestTurn, planTurn) 367; UI FOUR's watcher (bohemia_ui_nothing_pops.js check, shownNow) 325; tintOver and
punchTint 251 and 243; drawFog 183.

WHAT IT MEANS.
- The fight's frame on this box is THE MEN'S PICTURES BEING DRAWN, cell by cell from their packed sheets, by the software canvas
  with the CPU slowed 4x. A phone draws a canvas on its GPU, where a drawImage is the GPU's work, not the page's: the census's
  CPU canvas is the worst case for exactly this cost, and the fight is where it shows most (six men, each drawn with his held
  weapon and his melee pose every frame, two state saves and restores a man).
- The AI is 3% of it. The fight's thinking is not what freezes.
- UI FOUR's watcher (__NOTHING_POPS__) watches the whole page for style and class changes and, on each batch of them, asks every
  watched selector and each element's visibility: in a fight every frame changes styles, so it runs every frame (4%).

ROUTED. COMBAT: the men drawn per frame on a board like THE DECK (sheetDraw from blitMan, holdDraw, meleeDraw; a man who has not
moved or changed pose since the last frame is drawn again). UI FOUR: the watcher runs on every style change of a fight's
frame. The gate (NO FREEZE OVER HALF A SECOND) names the fight on AUTO as KNOWN OVER, at its measured worst, with this record,
so the rest of the walk is judged again by F1 (with F1 red on the fight the whole gate decided nothing).
