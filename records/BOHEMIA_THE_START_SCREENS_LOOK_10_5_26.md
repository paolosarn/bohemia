# UI [the start screen's look] (10/5/26, ui-kmqmrf)

Rule 66 (Paolo 10/2: 'there should be a start screen'), rule 67/71 (not AI slop). RUN builds the start screen's
logic (claimed e31bb315) and owns the front door's picks (BOH_START, #newco); this lane dresses them, in
slices/bohemia_ui_materials.js, so RUN's file stays RUN's.

BUILT
- BohemiaMaterials.startScreen(host, {onNew, onContinue, onSettings, saved, sub}) -> {root, paint, arm, disarm,
  destroy}: the whole look, deciding nothing. Three things of three materials, as the row asked: NEW GAME a
  cardboard card taped to the glass, CONTINUE a receipt with the run's day printed on it (dark with no run),
  SETTINGS a pane of cracked phone glass; each read from the left under a printed mark, 64 pt, CASING. Behind:
  the valley at night under the dead grid, one block still powered, his wordmark copied from #logobig. Landscape
  and wider: the title left, the three right. RUN calls it and wires SETTINGS to BohemiaSettings.open().
- dressFrontDoor(), automatic wherever #newco exists (the alpha): his terminal green stays (his 'loads B'); the
  fights and the shelves are cardboard cards (the picked one lit amber under a strip of tape), the origins are a
  sheet posted on the terminal with the picked one ringed in red marker and the difficulty as an ink stamp, the
  crew's name is a form (a ruled line on paper) with ANOTHER as a glass pane.

MEASURED: gates/the_start_screens_look_gate.js 17/0 on the alpha at 390x844 3x and at 844x390. FOUND: the printed
lines on the paper (#3a2e22) failed the sun test at 3.7:1; the ink is #1f1710 now (9.2 plain, 4.9 sun). Two
instrument errors of mine caught before they counted: comparing the opening bytes of the material pictures (every
PNG shares its header) and requiring the picked card to be cardboard when it is lit by design. Five mutations.

NOT DONE: RUN's start screen calling startScreen() (its logic has not landed; until it does the look is reachable
only through the call, shown in VOTE). Tablet and monitor not measured beyond 844x390.
