# UI REVIEW FOR DYNASTY: THE FLIP LIVES IN THE OPENED PHONE NOW (10/11/26, ui-kmqmrf, row [the flip off the face])

PAOLO, his eleventh votes: 'it's not until an endgame crisis, in one timeline, that you can switch; you click the phone and
it's in the menu; it will never be on the UI display of the phone itself; I can't believe you went this long with that on
the phone.' UI moved the switch (slices/bohemia_ui_materials.js, flipOffTheFace; DYNASTY's strip, its paint and its flip
are untouched and used as they are):
- the family's strip (#actflip) never shows on the phone's face (it is hidden while it sits in #cityfeedscreen);
- once BohemiaActs.crisisStarted() is true, the opened phone's bar (#phonebar) carries one entry, SWITCH TIMELINE (#bmtimes);
  a tap opens #bmtimespanel under the bar and MOVES the same #actflip node into it (getElementById still finds it,
  ctActFlipPaint repaints it there, the tiles' click handlers are unchanged);
- before the crisis the entry and the panel do not exist.

FOUR DYNASTY GATES NOW FAIL BY DESIGN, all on the same step: they tap a family card on the phone's face, which his ruling
removed. Measured 10/11: the_flip_gate 19/4 (the third face 0x0), three_names_gate 29/2 (the slot-2 reshuffle 0x0),
one_then_heirs_gate (the new face 0x0, the hop, the customize offer), heirs_gate 102/5 (the heirs after a hop). Nothing in
the derive, the roster, the names or the heirs is wrong; only where the finger goes.

THE RE-AIM (three steps, the same UI's own gates now use: the_phones_look, the_reshuffle_mark, the_flip_off_the_face):
  1. open the door the game uses: BohemiaActs.crisis(90) (it sets the flag and unlocks act 2; a later act still via
     ctActUnlock(3) after the crisis), then ctActFlipPaint();
  2. a real finger on the phone's face opens the phone (#phonewrap gets .on);
  3. a real finger on #bmtimes opens the panel; the cards are '#bmtimespanel #actflip .af', each 44 points (the opened
     phone makes every press 44 tall, so AGAIN is 44 and sits under the name, the card grows to hold it); tap the face at
     the card's top + 14, clear of AGAIN.
'Inside the glass' becomes inside #bmtimespanel. The customize row (#actedit) and the heirs row (#actheirs) still live on the
phone's face as before (UI did not move them; they are not the switch); if DYNASTY wants them with the family in the menu,
that is DYNASTY's call. DYNASTY is on hold under rule 88, so these four stay red until the coordinator re-opens it or rules
otherwise; UI did not edit DYNASTY's gates (ONE SYSTEM ONE SESSION).
