# MOTION 3 -- THE CAMP IS THE FIGHT'S BOARD (11/10/26)

Rule 442(a) (Paolo's vote on 11/9l, NO: 'This did not look like it was on the combat map'), rule 441 (fully baked), ask line 544
(and 469, 539). The coordinator's brief: the camp after a win IS the fight's own board: the same tiles, the same buildings, the same
dead where they fell, the same camera and zoom; his men at rest ON it (one goes through the dead, one leans on a house that was in the
fight, the fire on a tile they fought on). Proof he can see: one frame of the fight's last moment beside the camp's first frame, the same
place, on the real page, on a phone both ways, on three boards (a suburb, the Strip, the freeway). COMBAT TWO owns the board's files:
read through their seams, never edited. A redo, a new VOTE id.

## 1. WHAT WAS THERE (all of it kept)

CAMP THREE's 11/6m/11/6o camp on the board (the fight's own options and die re-dealt in a hidden copy of the fight page, the camp's
square pitched where the dead lie, CAMP TWO's camp laid on it) and MOTION 3's 11/9l round (the men lean on the board's walls, the map
rests under a place). records/BOHEMIA_MOTION_THREE_THE_CAMP_AFTER_A_FIGHT_11_9_26.md.

## 2. MEASURED (the demo at 390 x 844, a suburb fight won, MAKE CAMP on the loot screen; the fight's camera read off its own page)

- THE FIGHT showed its street: a tile 44 px wide on the glass, a man 56 px tall (zoomed out), or a tile 164 px and a man 209 px (the
  close camera a fight played on AUTO ends on).
- THE CAMP opened on ONE tile drawn 1,122 picture px wide: 488 px on the glass, from a picture only 231 px wide (a blur of asphalt), with
  the same 56 px men. The ground eleven times closer than the fight, no house on the glass. That is what he voted NO on.
- WHY: the camp sized its ground to hold CAMP TWO's whole camp (tents, cart, fire) at the men's size on one house tile; the fight draws
  a tile as a house and a man taller than one. The two never agreed on the size of a tile against a man (the fight: a tile 0.79 of a
  man's height in width, always; the camp: 2.2 to 11 men).

## 3. WHAT IS NEW

- THE CAMERA COMES WITH THE CAMP (slices/BOHEMIA_ALPHA_0_9.html campFromFightKeep, CAMP THREE's marked block in RUN's file): the moment
  MAKE CAMP is pressed, before the fight's page goes, the shell reads the camera the fight was seen through (FIGHT_UI's zoom and tile,
  sx(0), sy(0): where the board stood on the glass, manH(): a man's height) and where each of his men stood, through the fight page's
  own globals (the same way the shell's nfFight reads it); kept on window.__CAMP_FROM_FIGHT and in localStorage by the fight's
  fingerprint, so a reload of the camp finds it. Nothing of the fight's files changed.
- THE BOARD HANDED WHOLE (COMBAT TWO's seam, BUILD 11/10f, __THE_BOARD_HANDED_WHOLE__, built for this round): the shell also keeps
  window.fightBoardNow()'s board, and the camp's hidden page stands THAT board tile for tile (FIGHT_OPTS.boardDef), no deal at all; COMBAT
  TWO also found a re-deal could come out as another board after earlier deals in the same page (libOf's mirrored copies) and fixed it.
  A reload of the camp, with no board kept, deals it again from its options and die, as before.
- THE GROUND IS THE FIGHT'S VIEW (slices/bohemia_camp_board.js __THE_CAMP_IS_THE_FIGHTS_BOARD__): the camp's picture is the square
  round the glass's middle at the fight's own zoom (the glass both ways, so a turn shows the same board): the board baked by the fight's
  own bake with the same options and die (the same tiles, the same houses, the dead where they fell at the fight's own man size), the
  map round it by the fight's own ringCanvas (the blocks the fight showed past the board's edge; its night by the fight's own nightPass,
  read through FIGHT.S.night), composed in two short steps and written off the main thread (toBlob), never a stall. The settlement's
  camera puts it on the glass at the fight's own scale (a one-line hook in the settlement's frame fit, BohemiaCampLook.fightScale, and
  BohemiaSettlement.campView for where the camera stands): every tile where the fight had it, a man exactly as tall.
- HIS CAMP ON IT: the camp's square pitched ON THE GLASS (a tile whose middle is on what the fight showed, clear of the bar and the phone),
  first where a house of the fight stands two tiles off or nearer (the fight's own isRoof: one roof tile is one house), by the dead;
  the fire on it; CAMP TWO's pieces at the men's size packed on the board's open ground round it (half their own spread, never on a
  house, a wall, water, the dead or a man where he stood); every man's spot on open ground; he walks round the board's houses (the
  walk's blocks). The slain pile is left out: his dead are the board's own.
- THE GROUND THEY FOUGHT ON: CAMP THREE's grid keeps a camp off every raised tile; on the fight's view a raised tile a man walks on that
  is no roof (the freeway's deck, a rise of ground) is ground too, and the camp stands at its square's own height (the fight's own
  riseAt): measured, on the freeway on its side the deck was all the glass showed and the fire found no ground on it. No house stands
  on a deck, so nobody leans there; a man who ended the fight on a roof is drawn at the roof's height and climbs down from it.
- WHERE THEY STOOD: the camp's first frame draws every man of his where he stood when the fight ended; they hold there a bar (2 s at
  120 BPM) while the cart rolls in, then walk to their places in three beats (YOU by his own walk, the settlement's leadGo). The pitch's
  clock starts on the first frame drawn on the fight's view, never while the glass waits.
- AT REST BY DAY: one goes through the dead (a body on the glass), one leans on a house of the fight (the wall at his right hand,
  ANIMATION's flirt wall clip; the lookout may keep his watch from the wall), the fire kept. Each man's pictures are asked for the moment
  the camp is laid, in the order they are drawn.
- FRAMES (measured on the box with each part switched off: the camp's ground light, the fire's glow and the hours' ghosts filled fresh
  every frame, cost the camp at rest about a third of its frames, the old camp too, and more on the fight's view where a man is twice as
  tall): the glow is the same gradient drawn once into a picture and breathing by its size; the ghosts are drawn once an hour into a
  picture at half a css px (a two-percent long exposure needs no more) and that picture drawn each frame; the quarter-size copy a turn
  holds is taken once a bar, not once a beat. window.__CAMP_GHOST_EACH = the ghosts the old way.
- window.__CAMP_NO_FIGHT_VIEW = the camp that was voted NO.

## 4. AFTER (gates/the_camp_is_the_fights_board_gate.js, replaces THE CAMP AFTER A FIGHT)

How it is proved: the demo on the real page, the phone upright (390 x 844) and on its side (844 x 390), a fight on a suburb, a Strip
and a freeway cell of the map, each played on AUTO by a real tap (a fight AUTO does not finish in 20 s is won where it stands, their
men fallen beside his), MAKE CAMP tapped on the loot screen. THE FIGHT'S LAST FRAME is the fight's own canvas as it last drew, read the
moment MAKE CAMP is pressed, with the camera it was drawn through (the page's own shot from the loop can be a glide behind: measured on
the Strip); THE CAMP'S FIRST FRAME is the page once the camp's own grow has landed, his men still where they won. A camp made for
mending ends itself the hour his men are whole (CAMP's rule 278(a)): after a fight on AUTO that is about two seconds, so the gate holds
the map's campDone off on its page while it reads the camp (the healing rule is THE CAMP's own gates').

THE GATE, the full run (both ways, three boards, each fight played on AUTO to a win by a real tap): 34 passed, 1 failed; the one miss
(the freeway upright: the fire placed 9 px past the glass's edge, the camp's square crowded by the bodies) fixed (the fire looks
further on the glass before it gives up) and that case re-run alone: 8 passed, 0 failed. Then CAMP THREE's own gate asked for the
camp's square by the dead first (its B7): the pick now takes a square by a house only when it is as near the dead as the best on the
glass, and the placing reads the screen's layout once a beat (it was thousands of reads an hour of the camp's clock: a 217 ms frame);
the quick run after both (upright, a suburb, with the turn, P1, P2 and F1): 10 passed, 0 failed.

| board, phone | the same camera (worst board point off) | a man at camp / in the fight | the same picture (Pearson) | his men where they stood (first frame) |
|---|---|---|---|---|
| a suburb, upright (AUTO, 3 rounds) | 0.1 px | 114.1 / 114.1 px | 0.650 | YOU 3 px, DESI 0, RAUL 0 |
| the Strip, upright | 0.1 px | 65.4 / 65.4 | 0.951 | 3, 0, 0 |
| the freeway, upright (re-run) | 0.1 px | 99.2 / 99.2 | 0.515 | 4, 0, 0 |
| a suburb, on its side | 0.1 px | 71.6 / 71.6 | 0.653 | 2, 0, 0 |
| the Strip, on its side | 0.0 px | 102.7 / 102.6 | 0.951 | 2, 0, 0 |
| the freeway, on its side | 0.8 px | 146.3 / 146.3 | 0.949 (1% of the glass left after its men are left out) | 3, 0, 0 |

- BY DAY, ON IT: on every board the fire on a board tile on the glass and nobody in a house; one man goes through a body on the glass
  (a suburb on its side: the fight's last glass showed no body: said, never faked) and one leans on a house of the fight with his hand
  on the wall (the Strip on its side and the freeway on its side: no house within two tiles of the camp on that glass: said); the camp
  of three: one through the dead, one at the house, one at the fire.
- THE TURN (T1): upright to its side mid-camp, still the fight's view, a man 114.1 px both ways, the glass covered, the fire on it.
- P1 PLANTED: the camp that was voted NO (window.__CAMP_NO_FIGHT_VIEW) laid again: the camera check RED (its man 55 px against the
  fight's 114 and 99; the board points 450 to 700 px off).
- F1 FRAMES at rest (this box draws in software; PLUMBER owns 60 on a phone): last, the camp on the fight's view 40.5 and 40.9 fps
  (medians of three stretches, measured round the voted-NO camp), the voted-NO camp on the same box 37.8; worst frame 83 ms (the full
  run, before the layout read was cached: 33.0 and 37.1 against 41.1 and 48.7, worst 117 ms).
- P2 PLANTED: the same picture check on the voted-NO camp's frame: r 0.055 (the fight's view: 0.639 on that run). A man and every piece are drawn twice as tall as on the voted-NO camp (as
  the fight draws them), so the bar is 70% of it; before the glow and ghost caching it was 13 to 21 against 29 to 34.
- A1 nothing of the camp's threw, both ways.
- The proof: records/target/MOTION_3_THE_CAMP_IS_THE_FIGHTS_BOARD.webp (the six pairs: the fight's last frame | the camp's first).

## 5. WEAK, ROUTED, NEXT

- His men at camp wear their camp looks, not the helmets and armour they fought in (the camp draws the settlement's people sheets;
  the fight draws the fight rig): the first frame shows the same men in the same places in other clothes. CHARACTER's / ANIMATION's:
  the camp's men in their fight gear (BohemiaWear on the camp's folk, as the settlement's lead already wears it).
- The ground at the fight's closest zoom is the camp bake's 238 px a tile (the whole board under a phone's canvas limit), softer than the
  fight's own close-in art; at the zoomed-out end of a fight it is sharper than the fight's own board bake. PLUMBER's if a phone shows it.
- THE FIGHT AT CAMP (a crew finds him at camp, CAMP THREE's block in COMBAT's file) still grows the camp's pieces 1.6 times its own
  size; on a camp made off a fight its pieces are now at the men's size on the fight's scale, so they come out bigger there. CAMP THREE /
  COMBAT: CAMP_FIGHT_GROW to 1 for a camp handed over at the fight's scale.
- A camp made on the map (no fight) keeps CAMP THREE's own framing (one tile filling the camp's picture). The same view can be dealt
  for it (the fight's opening zoom on that glass, centred on the camp's square): NEXT, if he says the map camp should look the same.
- CAMP THREE's gate THE CAMP IS PITCHED ON THE BOARD, its leg B7, AMENDED here (rule 442(a), newest wins; marked in the file): the
  camp's square is pitched on the glass the fight was seen through, by the dead it shows when an open tile beside them is on it; where
  none is (its test fight kills the enemy where it stood, one body at the glass's edge) the square stays on the glass and his men go
  through the bodies there; the leg's own 'his men go through the dead by day' still holds. And its picture check takes the blob the
  fight's view is written as. NOTE for CAMP THREE.
- The wreck as it lay (cover blown up in the fight comes back whole at camp: COMBAT TWO's seam now hands the board whole, so what the
  handed boardDef carries is what stands; a car blown up mid-fight is COMBAT TWO's to hand on in it).

[bb] Battle Brothers' camp is a state on the world map; ours stays on the street the fight was on, seen through the same camera.
[analog horror] the same frame, a breath later: the bodies where they fell, the living standing where they were when it stopped.
