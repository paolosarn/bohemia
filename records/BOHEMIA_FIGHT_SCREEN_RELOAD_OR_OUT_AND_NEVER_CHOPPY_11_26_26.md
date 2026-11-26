# FIGHT SCREEN THREE: RELOAD OR OUT, AND THE GLASS NEVER CHOPPY -- 11/26/26
BUILD 11/26d - RELOAD OR OUT, NEVER CHOPPY. VAMILY rule 480 (Paolo 11/26: 'Lets turn up full sweep. But improve on
what we already have. And make sure fps is never choppy for nothing lets go'), ask row 723: (b) the fight screen as built checked and improved
before anything new; (c) the cards, bars and end screen never drop a frame when they open, update or close, on a slowed phone (390 x 844, the
CPU slowed four times). Rules 449, 450, 441; 478(a) (the card's half, after COMBAT FOUR's __NO_AMMO_NO_SHOT__). No person's line written or
rewritten (454(a), 465): the count lines are the game's.

## WHAT THIS LANE'S PIECES ALREADY IN THE GAME WERE CHECKED (rule 480(b))
The card that opens a fight, the why at the bell, the man's card on the phone (bars, last hit, AP, plate, rounds), his sheet, the strip's say
line, the fight's own end card, the end screen (no receipt: THE RECEIPT IS GONE 7/0 stands), the result line (JOBS TWO's agreement table on top of
11/22zr). FOUND AND FIXED:
1. THE ROUNDS ON THE CARD AFTER COMBAT FOUR'S RULE 478: his guns now carry rounds beyond the magazine (a pistol 10, a shotgun 7), and a gun with
   none left anywhere is slung and his fists come up. The card (11/22zv) knew only the magazine: an empty magazine with rounds still carried
   showed RED like the end, and a man truly out showed NOTHING (fists carry no rounds). NOW three states: in the gun (brass), RELOAD (the
   magazine empty, rounds carried: hollow amber), OUT (none anywhere: the slung gun's cases red, pulsing on the beat); and WHAT HE CARRIES as a
   brass line under the cases (FIGHT.carried, COMBAT FOUR's helper written for this card).
2. HIS NINTH AP PIP WAS CLIPPED by the rounds (my own 11/22zv): 72 points of row in a 65 point column. Now beside a gun the pips stand 4 wide
   and the cases six at most: 9 of 9 pips whole, 0 clipped (P9 reads it).
3. THE GRAMMAR (__EVERY_LINE_AGREES__, nWord): '1 hits to drop him.', 'Loaded: 1 rounds.' (possible now: a reload loads only what he carries),
   '1 rounds, 0:42 of fighting.' (the fight's own card), '1 tiles', '1 turns': a count and its word agree.

## NEVER CHOPPY (rule 480(c)): MEASURED, THEN FIXED (__NEVER_CHOPPY__)
THE INSTRUMENT: tools/bohemia_fight_screen_the_walk.js FRAMES=1 (the whole fight walked on the demo or the alpha; from the map on the CPU slowed
four times; every painted frame counted with a 1-pixel canvas drawn each frame; marks, not screenshots, at every moment; PROFILE= and TRACE= at
any mark for a CPU profile or a Chrome trace; per call, what this lane's pieces cost: the card's refresh hud(), the sheet drawer(), the phone
card's repaint manPaint).
WHAT EACH PIECE COST PER CALL ON THE SLOWED PHONE (the demo upright; the same fight walk before and after):
- the card's refresh (hud, every sixth frame and on every event): 14.0 ms mean, 143 of 158 calls past 8 ms, before; 5.0 to 5.8 ms mean after
  (the alpha on its side 5.0). Why it was heavy: it tore down and made again his nine AP pips on every call, wrote every bar's width, colour,
  number and mark, the round's label and the say line's place even when nothing had changed, then measured the name's plate and the say line's
  room right after those writes (a layout forced, twice, every call). Now each is written only when it changed and measured only when the
  name or the glass changed: refreshed twice with nothing changed, the card writes NOTHING (a MutationObserver over the bar reads 0 writes).
- the phone card's repaint (manPaint, on every change): 8.9 to 9.9 ms mean before; 2.0 ms mean after (4 of 47 past 8 ms; on its side 2.2).
  Why: any change (one bar) repainted ALL of it: the face drawn again from the fight's canvas, the name written and measured (a forced layout),
  the AP pips, the plate and the rounds made again. Now each part is painted when its own part changed; the face only when the fight drew it
  again (UI.faceN counts the fight's face draws); each name's fit measured once a fight.
- his sheet opening (drawer): 42 to 58 ms on opening before; 27 to 36 ms after (the fit starts at the step that fitted this glass last time:
  it measured at every step it tried, up to four).
WHAT STILL MAKES THE FIGHT CHOPPY ON THE SLOWED PHONE IS NOT THIS LANE'S (traced, routed; numbers at 4x on this box, one run):
- COMBAT FOUR: the board's own drawing, the fight page's frame() and draw(): 100 to 370 ms a frame on his turn (drawMan, blitMan, sheetDraw,
  laidDraw, the fog), 3.6 s of every 4 s on his turn; this is what sets his turn at 6 to 34 frames a second, run to run.
- UI FIVE: bohemia_ui_nothing_pops.js check() measures the glass every frame (getBoundingClientRect, checkVisibility): 124 to 200 ms of every
  3.5 s, about 5% of the frame.
- PLUMBER 8: the fight's page loading while the card that opens a fight types (ParseHTML of the fight 127 ms, a 295 ms message, a 251 ms event;
  the card's own typing is cheap) and the freeze after ENGAGE (1.8 to 3.9 s).
- WORLD and PLUMBER 8: the city map keeps drawing behind the end screen (the city's frames 34 to 42 ms each while the end screen covers the
  glass).
- COMBAT FOUR (this round's LEAVE): LEAVE from the end screen: tasks of 0.7 to 0.8 s in the city and the top page (EYES' row 725).

## ON THE PAGE (rule 441)
RESULT: the demo upright and the alpha on its side, a held job's crew met through the map's card, ENGAGE by a finger, walked to the map again:
0 page errors, home true both ways. The card's states read on the page (P9): YOU with his pistol 5 of 5 in the gun, 10 of 10 carried (the line
100%); one spent 4 of 5, 9 carried (90%); the magazine at none, RELOAD, 9 carried; out, his fists up, five red cases pulsing on the beat; a
THUG with an axe, none; a MARKSMAN of theirs, his one-shot gun unloaded, RELOAD. 9 of 9 AP pips whole.
Picture: records/target/FIGHT_SCREEN_RELOAD_OR_OUT_AND_NEVER_CHOPPY_11_26.webp (before and now: full, reload, out).

## GATES
THE MAN'S CARD ON THE PHONE 15/0 (was 13/0): P9 re-aimed to the three states, the carried line and no AP pip clipped; P10 NEVER CHOPPY new (a bar
moves: the face not drawn again, the pips and the rounds the same nodes; his AP moves: the pips again, the face not; another man: the face
drawn; the fight's card refreshed twice unchanged writes nothing) and its plant (NOCHOP_PLANT: the card painted whole on every change, P10 red).
THE PHONE 268/0, THE MAN'S SHEET 7/0, THE FIGHT'S BARS AND THE END SCREEN 6/0, THE RELOAD IS LOUD 17/0, NO AMMO NO SHOT 7/0, ICONS NOT NUMBERS
IN THE FIGHT 8/0.
[bb Battle Brothers' ranged man shows his ammo on his bar and goes to his fists when it is gone; ours stands the rounds on end, says reload in amber and out in red]
[analog horror: the out gun's cases breathe red on the beat, and the card under it costs the frame nothing]
