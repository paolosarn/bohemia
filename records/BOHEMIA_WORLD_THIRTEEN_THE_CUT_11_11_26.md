# WORLD THIRTEEN, ROUND FOUR, STEP THREE: THE CUT (11/11/26)

VAMILY rule 429(a)(c), 430; ask line 504. BUILD 11/11h - THE CUT. VOTE world13-the-cut-11-11 (stand_in).

The coordinator 11/11: '(3) the cut: the fight's board cut from the map cell it starts on.' With 11/11b the map stands the 15
place boards on every valley (templates); now a fight that starts on one of their cells is fought on THAT place's board.

## 1. MEASURED FIRST

A fight the map handed over sent its district and cell only. On a place's district the fight dealt the place's blocks
(dealOwn: the landmark on one of its rows, the field blocks shuffled round it, mirrored at random), then the new houses in
(rule 423(a)). Measured on the airport and the suburbs: the same blocks, but a different arrangement and mirroring every fight,
never the board the map stood there.

## 2. THE CUT

- THE MAP (slices/BOHEMIA_CITY_WORLD.html cityHandOver, `__THE_CUT__`): a fight that starts on a template cell carries
  msg.template = { id, board: 'place_<id>', tx, ty (the cell's top-left tile on the board), flip, cell } (vbTemplateAt); a boss's
  own board first.
- THE SHELL (slices/BOHEMIA_ALPHA_0_9.html nfOpts, re-cut into the demo): hands it to the fight as o.template.
- THE FIGHT (slices/BOHEMIA_FIGHT.html dealOwn, `__THE_CUT__`, a marked block COMBAT THREE owns from here): with opts.template for
  this place, the place's own board block for block as it stands on the map (fight_ground.json boards place_<id>), its landmark
  where the board has it, the camp from there; the new houses go in after as before; boardDef.cut says which map cell it was
  dealt from. Every other fight deals as before.
- The boards stand unmirrored on the map (place_templates.json mirror false for all) so the map and the fight show the same place.

## 3. GATES

- the_places_are_templates 13/0: NEW P3 on the demo, upright and on its side: a fight the map hands over itself (cityHandOver) on
  a cell of the suburbs' place (block 77,24) is dealt that place's own board block for block, the cell carried, 49 new houses in it.
- every_place_its_own_board PASS, the_old_layout_the_new_houses 25/0 (the fight's place deal and the house swap unchanged without
  a template).
- every_place_no_seams is RED, the same on main without this build (suburb: 19.7% of its cell borders a line you see, 14.0% cut a
  colour off; floor 4%): the fight lane's, named in the handoff.

## 4. OWED (the seam, handoffs/WORLD_THIRTEEN.md)

- COMBAT THREE: start the crew on the cell's tiles (template.tx..tx+2, ty..ty+2) rather than the board's start rows; the
  freeway, the casino floor and a boss's board keep theirs.
- WORLD THIRTEEN, next: the painter writes each place board's layout into the map at its cells (row 504's 'the 15 boards'
  layouts written into the map at their places'), so the map at street zoom shows the board's walls, roofs, water and open ground
  where the fight will stand them.

[bb] Battle Brothers fights a location on that location's own map; ours fights a place on the board the map stood there.
[analog horror] the airport's apron is the same apron every time you come back to it: the same shed, the same fence, the same
dark hangar door.
