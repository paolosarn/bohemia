# THE FERAL DOG PACK, ROUND THREE: THE WHOLE PACK IN VOTE, HELD LIKE STOP-MOTION (ANIMATION, 10/18/26, row [the beasts through the rig, the wolf redone])

Rule 115c (every beast remade through the rig, 'everything from the same source'), rule 115(d) AMENDED 10/18 (he named
CRASHBOX: stop-motion clay, held poses not smooth motion, nothing glows), the coordinator's note on this lane's section
(sweep AR: read Grok 170 to 177 before the next beast), rule 116 (opened by the coordinator, claim first, commit small),
rule 100 and ROUND THIRTEEN (a candidate in VOTE, nothing into the game), rule 114 (the five tells), rule 97 (passes by
eye, then stop), rule 12 (a premise is measured, not obeyed). Round two: records/BOHEMIA_THE_FERAL_DOG_PACK_10_18_26.md.

## WHAT WAS HELD, AND WHY, MEASURED FIRST
- THE CUR (NOT VIBE CODED D5 from behind, 0.047 against the packs' 0.057). Its edge map, drawn: nearly EVERY pixel of
  the white coat is an edge (the rig's grain on a bright coat moves a pixel more than 24 levels from its neighbour) and
  only the liver reads as rest. So hand-sized patches anywhere are detail everywhere, and a bright coat can only rest
  where it is dark.
- THE SHEPHERD (DIRECTION's card 3 of 8, BACK; and the guide's light row on four facings, -3.0 to -6.9). The card's
  light row is the top half's brightness minus the bottom's. A black saddle that wrapped the flanks and a cream belly
  are a black top and a white bottom: the PAINT reads as a light from below. (Real animals are the opposite: most are
  countershaded, dark on top and pale below, exactly to cancel the sun. See ROUTED.)
- A STILLS-ONLY RENDER IS NOT A MEASURE: it crops tighter (no clip frames in the box) so the D5 blocks are smaller, and
  it poses the still from the idle, not the walk's passing pose. Every number below is from a full render.
- DIRECTION'S RIG MOVED TO ROUND 7 during this round (a part that moves under half a pixel keeps its drawn shape). The
  shepherd and the cur measure the same on round 7; the pit (rendered on round 5) moved from 0.058 to 0.056 on D5 from
  behind-left, so the whole pack was re-rendered on round 7: one rig round for the pack.

## THE PASSES (tools/bohemia_animation_the_feral_dog_pack_prep.py, the knobs and their history in its header)
THE CUR, 1.25 m: 1 one big liver patch over the rump: D5 from behind passed (0.067), the front view read lit from below
(-11.4: the rump is that view's top). 2 the liver LOW, breeches on the hind legs: both pass on all eight, the front
view's value span 115 (line 118). 3 liver ears: 116. 4 the liver darker (0.30): 122. Stopped.
THE SHEPHERD, 1.4 m: A the saddle on the back only, deep tan below: seven facings lit from above, N not (the saddle ran
up the neck, that view's top). B the saddle from the withers, a darker mask. C the tail black along its top (a
shepherd's is): the full render's back-left D5 0.048. D a truly dark saddle (0.08), a light-tan throat: 0.054. E the
saddle a little wider and forward over the shoulders: D5 0.060, light +0.6 at worst, on all eight. F (a warm red-tan,
to part it from the pit) tipped D5 back to 0.056: NOT TAKEN; the pit was darkened instead (below). Stopped at E.
THE PIT, 1.1 m: on rig round 7 its back-left D5 read 0.056; the fawn streaks only low on the flanks (a brindle's back
is plain dark): 0.4 gave 0.058, 0.15 gave 0.067. Then the pack check said the pit and the shepherd were 18 levels apart
(line 20): the pit's 'near-black' brindle had rendered a mid grey-brown, so the brindle went darker (0.20): 24.5 apart,
D5 0.071, light +7.3 at worst.
By eye, all three beside the wolf: a dark brindle, a black-and-tan with a black tail (the old shepherd was the wolf's
twin in a different saddle), a white cur with liver ears and breeches. Three values at a glance: dark, middle, light.

## THE HOLDS (CRASHBOX), NEW THIS ROUND
Grok 170 ('frame duration is the secret... holds 200 ms or longer... anticipation and impact hold longer... no tween...
export the durations'), 172 (the walk), 173 (the attack: anticipation held, impact held, recovery quick), 174 (the idle:
holds of 400 to 500 ms), 175 and 177 (durations travel with the sheet). Our grid is the 120 beat: 6 slots a beat,
one slot 1/12 s (83 ms, the fall's claymation cadence). The keys are DIRECTION's renders, unchanged; a hold repeats a key.
- THE BITE, by its six authored poses (the keys sit exactly on frames 2, 6, 10, 14, 18, 22): rest 3 slots (250 ms), the
  crouch 2 (167, the anticipation), the spring 1 (83, the fast arc), THE BITE 2 (167) STARTING ON THE SECOND BEAT, the
  recovery 1 (83), the settle 3 (250).
- THE STEP, per beat by stillness (the silhouette change into and out of each key, over the eight facings): the stillest
  key 3 slots (the weight landing), the next 2, the quickest 1; every beat starts on a key.
- THE IDLE: its three stillest poses AT LEAST A BEAT APART held 5 slots (417 ms) each, every other key one slot: keys 4,
  8 and 11, the three pauses in the fox's look-around. (By rank alone the three stillest were keys 7, 8, 9, side by
  side: one frozen stretch and then nine keys in 0.75 s. Not a puppet; a stutter.)
- The bake writes holds, slots, slots_per_beat, the stillness and the rule into every table; the proof sheets label each
  key with its hold; the VOTE page plays the slots, never the keys evenly.

## WHAT EXISTS NOW
- reference/models/bohemia/feral_dog_{pit,shepherd,cur}.glb (remade); records/target/master_rig/feral_dog_*/ on rig
  round 7 (rig and shadow frames, rig.json; the raw, ID and object-ID passes not committed, the convention).
- slices/vote/ANIMATION_THE_FERAL_DOG_{PIT,SHEPHERD,CUR}.webp + .json + _TABLE.js; the proof sheets
  records/target/master_rig/ANIMATION_THE_FERAL_DOG_{PIT,SHEPHERD,CUR}.png (each beside the fox, the wolf and the
  other two); slices/vote/ANIMATION_THE_FERAL_DOG_PACK.html plays all three.
- VOTE: animation-the-feral-dog-pack-10-18, updated in place (the tab does not grow, rule 113c), PLACEHOLDER, the 24
  stills as its sprites, class beast, the look block.

## MEASURED
- Gates (gates/the_beast_in_eight_gate.py): THE FERAL DOG PACK (PIT) 47/0, (SHEPHERD) 47/0, (CUR) 47/0, the last two
  NEW in the suite; THE WOLF REDONE 31/0 and BEAST IN EIGHT 26/0 unchanged. New legs: the shepherd's pack questions; THE
  HOLDS (whole twelfths, at least one, filling the beats exactly; the slots the holds laid out; the holds VARY, the
  longest at least twice the shortest; the bite on the second beat, the crouch over the spring; every step beat on a
  key; an idle pose of 400 ms; every longest idle hold a real pause, stiller than both neighbours, re-measured from the
  frames); the page plays the slots and all three dogs; the row names each dog's eight stills. Mutations planted: a
  spilled slot, a late bite, an even table.
- NOT VIBE CODED, first five on all 24 stills (the cull's own path): pass. D5 worst 0.067 (pit), 0.060 (shepherd),
  0.081 (cur), line 0.057; the guide's light row worst +6.9, +0.6, +10.6, line -2.5. The gate is red on 11 OTHER
  lanes' rows (COMBAT TWO, COOK FOUR, CHARACTER, COOK: no sprites named, or D5 on a building cell), not this row.
- DIRECTION's card: 2 of 8 out for all three, to DIRECTION, none BACK (the pit and the cur: true size under the tile's
  96 floor, and colours, the rows every true-size beast misses; the shepherd: colours and the value span, 109 of 118).
- STYLE GUIDE: the three dogs pass, including round 7's new leg (the clips held at 0.5 px, the motion table and the
  object-ID pass whole); the gate is red on PORTRAIT's crew rigs ('wear'), not mine. REFERENCE CHECK 494/0. VOTE TAB:
  my row clean; red on DYNASTY's two whys.
- ON THE REAL SURFACE: the page served over HTTP in headless Chromium at a 390 px phone width, 3x: 3 tables, 72 cells,
  72 drawn, 0 page errors (one 404 is the browser's own favicon ask); the pit's facing-S bite cell changed 12 times in
  24 twelfths of a second (six keys, held, twice round), not 24.

## NEXT ON THIS ROW
3 THE HYENA (the bestiary's number 3): the cave hyena, Crocuta crocuta spelaea (its genome read from Ice Age bone),
from the same Fox: the sloped back, the big head and maned neck, round ears, a short black-tipped tail, spots on the
flanks and legs only (the cur's lesson), the belly never paler than the coat (the shepherd's), held like the pack.

## WHAT IS NOT DONE, SAID SO
- Not in the fight or the demo (rule 100); FINAL waits for his moodboard.
- The shepherd's back-left rest area and front-left light pass by thin margins (0.003 and 3.1); a warmer tan cost the
  first one. The shepherd's value span stays OUT on DIRECTION's card (109, line 118).
- No jaw bone still: the mouth never opens. The holds are in the VOTE page and the tables; the game's own beast player
  (engine/bohemia_quadruped.js) still plays evenly, and nothing changes there before the moodboard.

## ROUTED
- DIRECTION (the card's light row, a beast-class question, carried from round two): the row reads PAINT as light. Most
  animals are countershaded (dark on top, pale below) on purpose, so a true coat fails it; this round passed only by
  putting the dark where no view's top sits. A light row read from the rig's own white-clay pass (the object lit with
  one flat albedo, which the rig already renders for the movers' light) would measure the sun alone. Asked, not built:
  the card is DIRECTION's.
- DIRECTION (the style guide's field 15): its 'holds' line is now the rig's anti-boil hold (a part that moves under
  half a pixel keeps its drawn shape). The TIMING holds (how long each key stays on screen, whole twelfths filling the
  beats, declared per clip in the sheet's table) have no row; one is proposed: 'timing: CRASHBOX holds, 6 slots a beat,
  a key at least one slot, the hit on the beat, declared per clip in the table (gates/the_beast_in_eight_gate.py)'.

## [bb beast] THE SCHOOL LINE (rule 39b)
Battle Brothers' beasts read by silhouette and by how they move before you see their faces: the direwolf's lunge, the
hyena's skulk. WHAT WE DO: the pack reads as three bodies and three values at a glance, and moves in held poses on the
beat, so a bite you can see coming (the crouch is held for a sixth of a second) lands on the beat you hear.

## ANALOG HORROR LINE (rule 30)
The stillness is the horror. A dog that holds dead still for half a second, then is somewhere else.
