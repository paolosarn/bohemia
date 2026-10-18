# UI [the settlement's labels] (10/5/26, ui-kmqmrf)

Rule 71a (one painted place), RUN TWO [one painted place] (7dacde2): the settlement is one picture and a
building names itself only under the finger. The row: the game's type on a torn tag, 44 pt, by the hotspot,
gone when the finger lifts; the pay and the price lines in the receipt face; nothing permanent on the picture.

BUILT in slices/bohemia_ui_materials.js:
- settleTag(cx, box, title, line, W, H): a torn tag of receipt paper under the building (over it near the foot),
  a strip of tape, the name stamped in CASING and the line printed in ROM from the left, 44 pt, a hard one-pixel
  contact edge, clamped to the glass; the paper washed light so its darkest curl still holds the ink in the sun.
- dressSettlement(), automatic on any page with #sbody: every act in the keeper's sheet (the stall's goods and
  prices, the board's contracts and pay) a receipt line in ROM, the price stamped in CASING behind a dashed rule.
RUN TWO's file (BOHEMIA_SETTLEMENT_SCREEN.html): one include line and its picture now calls settleTag() only while
the finger is down (view.lit), its own plate kept as the fallback; before, the plate also stayed while a sheet was
open, which the row rules out.

MEASURED: gates/the_settlement_labels_gate.js 10/0 at 390x844 3x, all six buildings (tags 84-149 x 44). FOUND:
the price ink was 4.3:1 in the sun (now 5.3) and the smallest tag's curl 4.3:1 (now 4.8). Two errors of mine
caught before they counted: the tag's place read in canvas space, not the page's; and the 'gone when lifted' leg
cleared the tag while the finger was still down. Five mutations. RUN TWO's THE SETTLEMENT SCREEN GATE 27/0 (it
needs NODE_PATH=/opt/node22/lib/node_modules to find playwright).
