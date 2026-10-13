# THE SIX AT PACK PIXELS, AND THE CREW BUTTON (UI [icons at full pixels] + [the crew button], 10/13/26)

MODE: cook only (rules 100, 101, 108). A candidate in VOTE; the only change to the game is the deletion he ordered.

## WHAT HE SAID
- Rule 104c on the stash: 'all the icons look like dogshit, five pixels by five pixels.'
- His eleventh votes: 'a fabric icon looks like someone is getting hung by a noose.'
- His twelfth vote (the [the crew button] row): the map's bar has no way to his crew and their gear.

## WHAT SHIPPED
1. THE NOOSE IS DELETED from the game: the tape case in supplyIcon() draws nothing. The slot keeps its place and its count. Graveyard: records/BOHEMIA_GRAVEYARD_UI_THE_TAPE_RING_10_13_26.md.
2. THE STUDY, which opens the round: records/BOHEMIA_UI_HOW_THE_PACK_DID_IT_THE_SIX_10_13_26.md. All six supplies are already finished props in his survival packs.
3. THE CANDIDATE SHEET: records/target/UI_ONE_AT_A_TIME_THE_SIX_AT_PACK_PIXELS.png.
   - It shows the bar BEFORE, the bar NOW, candidate A and candidate B, all at 1:1 on his phone profile through the one driver.
   - Below them sit the twelve cuts beside the old 30-pixel drawing.
   - Each candidate puts the six on a 40-point glass strip under the bar. They are his props whole, at 32 points, which is 96 phone pixels, their own size.
   - Each candidate adds a CREW button where the bar's cardboard was empty, 52 by 44, left of NOTES. A puts it on glass; B puts it on a receipt like NOTES.
   - The overlay was laid in the browser for the picture only.
   - Made by tools/bohemia_ui_six_at_pack_pixels_shots.js (the shots) and tools/bohemia_ui_six_at_pack_pixels_sheet.py (composes; draws nothing). Manifest: records/target/UI_THE_SIX_AT_PACK_PIXELS.json.
4. VOTE: ui-the-six-at-pack-pixels-10-13, 'FINAL? THE SIX SUPPLIES CUT FROM YOUR PACKS, AND A CREW BUTTON'. The options are A, B or NO. The card carries the twin with three differences and the before and after at 1:1.

## THE NUMBERS
- BEFORE: each icon is 10x10 cells, 100 per icon, 4 to 6 colours.
- AFTER: 2,362 to 5,627 colours per icon, 96 on the long side.
- CREW's word: A 13.76 to 1 plain and 6.43 in the sun; B 12.32 and 5.99.
- THE COST: 40 points of map height for the strip.

## THE GATES
- gates/the_six_at_pack_pixels_gate.py: 7/0. It caught five mutations:
  - the noose back
  - one pixel painted on a cut
  - icons at 10 pt
  - CREW's word unreadable
  - a three-sentence why
- Neighbours:
  - the map's bar 7/0, the bar says three things 23/0, the stash screen 12/0.
  - The vote tab is 35/2. Its 2 reds are other lanes' rows: TUNING's whys and COMBAT TWO's sheet without a twin.
  - FIXED IN THE VOTE TAB GATE: the planted-verdict leg picked rows[0], which could be a card the triage keeps out of its count. The plant landed on nothing, and the leg read 26 of 25 on main with or without this card. It now plants on a card the queue counts: 25 of 25.

## WHAT IS NOT DONE
- Nothing of the candidate is in the game until his FINAL (rule 100).
- The CREW button's wiring to RUN TWO's company screen is RUN TWO's job once he picks.
- The same button on the settlement screen and in the fight comes after his pick (rule 24, one HUD).
