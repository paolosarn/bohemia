# ONE SCREEN: THE SAME BAR ON THE MAP, THE SETTLEMENT AND THE FIGHT (UI [one screen], rule 110's swing, 10/17/26)

MODE: cook only (rules 100, 101, 108). A candidate in VOTE. Nothing in the game: the city file, the settlement file and the fight
file are untouched; the bar is laid over the real screens in the browser by a tool and photographed.

## WHAT HE SAID
Rule 110 (10/16): 'the screen shit'. Rule 24 (his first votes): one game mode, the same UI every second. Rule 67a: one UI across map,
settlement and fight, 44 points. Rule 47a: the HUD carries the six. His twelfth vote: the map's bar has no way to his crew.

## WHAT SHIPPED
- THE STUDY: records/BOHEMIA_UI_HOW_THE_PACK_DID_IT_THE_HUD_10_17_26.md (the bar is a board that holds paper; his packs hold that
  object; paper 3.4 to 3.9 times the board's light, lit from above, a hard rim, grain under 2 px).
- THE CANDIDATE, on his phone at 1:1:
  - records/target/ui_one_screen/UI_ONE_AT_A_TIME_ONE_SCREEN.png (upright, the phone's width): for each of the three screens the
    top as it is NOW and with the ONE HUD, then the bottom corner NOW and with the ONE HUD; then his pack twins beside the bar's
    pieces; 2.7 MB.
  - records/target/ui_one_screen/UI_ONE_SCREEN_SIDEWAYS.png (the phone on its side): the same, 4.0 MB.
  - records/target/ui_one_screen/UI_ONE_SCREEN_THE_FIGHT_WHOLE.png: one whole laid screen (the fight), 2.9 MB, linked here and not
    on the card so the card stays light.
- THE LAW OF THE LAYOUT, the same on every screen:
  - THE TOP IS THE ONE BAR: cut cardboard with its flutes along the foot; on it, receipt tags for the clock the screen runs on (the
    hour on the map, DAY on the settlement, the round in the fight) and the place; CREW and NOTES as receipt tags at the right end,
    52 by 44 points, at the same x on every screen (272 and 330 upright); under them a strip of glass with the six supplies cut
    whole from his survival packs at 96 pixels (the 10/13 candidate A, yellow in the tab) and the count the screen knows (a dimmed
    dash where it knows none, the map's own rule). On its side the strip joins the first row: one 64-point bar.
  - THE SCREEN'S OWN ROW RIDES UNDER IT: the fight's round, turn strip and AUTO on the bar's cardboard (the fight still measures its
    board against that element, so the board sits under the bar, nothing covered).
  - THE BIG ACTION KEEPS THE BOTTOM RIGHT: the map's speed pad as it is; the settlement's LEAVE on the same taped cardboard card;
    the fight's END TURN where it is.
  - The map's phone drops under the taller bar; on its side it keeps 19.5 by 9 and the foot of the glass. The shell's gear goes
    under the bar on the same cardboard card.
- EVERY CODE-DRAWN BOX, FOUND BY MACHINE (a visible element painting a flat colour, a border or a rounded corner with no material
  behind it; tools/bohemia_ui_one_screen_shots.js sweeps the three screens, both profiles) AND ITS REPLACEMENT:
  | screen | box | what it was | what it becomes on the sheet |
  |---|---|---|---|
  | settlement | #bar | a flat plate, system monospace, 61 pt | the one bar, cardboard, the place and the day on receipt tags |
  | settlement | #crew | a flat plate, 6 px corners | CREW as a receipt tag at the bar's right end, 44 pt, the same place as the map's |
  | settlement | #leave | a flat plate, 6 px corners | LEAVE on the taped cardboard card, bottom right, the speed pad's place |
  | settlement | #heard | a flat strip at the foot | printed on a receipt like the fight's hint; empty, it draws nothing |
  | settlement | #sheet | a flat card with a gold rule | a cardboard card with a strip of tape |
  | fight | #top | a gradient strip | the one bar; the round, the faces and AUTO ride on it |
  | fight | .bar x3 | flat black meters, 5 px | the three meters printed on receipt paper |
  | fight | #ap i | flat pips, 7 by 5 | receipt chips, the ready ones lit amber |
  | map (shell) | #gearbtn | a dark rounded square with a soft shadow | the gear on the speed pad's cardboard card, under the bar |
  | map | #cityfeed (4 rows) | his phone's rail and glass | KEPT: his object by his vote (9/27, one crack); the crack is its own candidate (10/16) |
  | map | .sp.now | the lit amber of the speed you are at | not a box: the materials' own light |
  | map, settlement | #stage, #scene | the page's floor under the picture | not a box he sees; the sweep now skips a floor a canvas covers |
  After the lay, the sweep finds no code-drawn box on any of the six shots but his phone and the lit amber.
- VOTE: ui-one-screen-10-17, 'FINAL? ONE BAR ON THE MAP, THE SETTLEMENT AND THE FIGHT'. YES or NO.
- TOOLS, none of which draws a pixel:
  - tools/bohemia_ui_one_screen_shots.js: the shots through the one driver, the sweep, the measures.
  - tools/bohemia_ui_one_screen_hud.js: the bar laid in the browser from the materials file's own generators (cardboard, tape,
    receipt, glass, the cut edge); real buttons are moved, never cloned, so every handler stays.
  - tools/bohemia_ui_one_screen_sheet.py: composes the sheets and the manifest.
  - tools/bohemia_ui_one_screen_register.py: the card, spliced as text.

## THE NUMBERS
- The bar upright: 110 points tall (44 of tags, 40 of glass, the edge); the map's bar today is 50. On its side: 64 (the map's 50).
- CREW and NOTES: 52 by 44 points at x 272 and 330 on all three screens upright; the six strip at 8, 374 wide, 40 tall.
- The six: 96 on the long side in the file, 32 points on the glass, 36 icons measured at 1:1 across six shots.
- Paper over board on the shot: the worst tag 6.4 to 1 (the pack's boards are 3.4 to 3.9).
- The sun: every tag's ink against its paper, at rest and under a flat 25% white, in the gate's line.

## THE GATES
- gates/the_one_screen_gate.py: 10/0. It caught seven mutations: CREW moved three points on one screen; NOTES under a thumb; an
  icon shrunk; a code box left on a laid screen; a box without a replacement; a three-sentence why; the cut named in a slice.
  The sun line: the worst tag reads 6.2 to 1 at rest and 2.5 to 1 under a flat 25% white; paper over board worst 6.1 to 1.
- vote_tab_gate: 34/3 before this card and the same after; the 3 reds are other lanes' rows (TUNING's whys, COMBAT TWO's sheet
  without a twin) and three ids main carries twice (animation, combat, and my 10/13 card, whose second copy I removed here).

## WHAT IS NOT DONE, AND WHOSE
- CREW's wiring (the company screen) is RUN TWO's after his pick; NOTES on the settlement and the fight is the demo shell's door
  (RUN) after his pick; the tags are the look.
- Into the game after his FINAL: the settlement's bar, the fight's top strip and the map's bar take the one bar from the materials
  file (a dress function like dressMapBar), the owners' files untouched but for one include line each.
- The fight's bottom bar is already in the materials (10/4) and is not touched; only its meters and pips are re-dressed here.
