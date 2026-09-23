# COORDINATOR ROUND 9/23/26 B (sweep c7805c5..b751dc2, 29 commits; stamps alpha 9/24e and demo 9/24e LESS ON SCREEN)
# Registry: 107 items, 83 verdicts, 24 waiting for him (sounds 3, factions 2, world 2, life+city 2,
# character 2, portrait 2, animation 2, people 2, cook 2, coordinator 2, direction 1, quests 1, ui 1).
# Deploy: pages run for b751dc2 SUCCESS 00:47; the run for d4b24e8 FAILED because that push carried a
# registry with merge markers, which is the wait+fetch step doing its job.

## 1. WHAT SHIPPED (by chat)
- RUN [cut now] SHIPPED b751dc2, stamp 9/23f: the demo's first screen went from 27 named boxes to 13
  (MUSIC, SAVE, HUMAN MODE, the day readouts, STANDING, BUILD HERE, SCAVENGE, BIKE, SLEEP, MARKET and
  the mouthless prose hidden from the demo only; the alpha keeps all eight). NOTES stays in the open
  (not behind a gear; correct, newest ruling). The feed stays (the phone is the button; correct).
  THE DRIVER HAD NEVER PRESSED BEGIN: the loading screen was over the game on every run and every
  lane's numbers came through it. Fixed (trap 7: knock until the door is behind us). Newly visible:
  the way back from the city costs THREE squeezes against one going out.
- UI [phone on the street] SHIPPED 400c374: the drawn phone is on him in both modes (folded to
  46x62 in his pocket on the street, cracked glass, the hour lit, gold rim when unread, a 44x44
  reach pad). The phone's clock had NEVER told the time (read a variable that does not exist); fixed.
  Not fixed, named: the phone's own screen is black about three seconds the first time it opens.
  UI [alpha opens on vote] SHIPPED (every lane's driver now clicks RUN first; a hidden panel has
  no box, which threw on every alpha open until the driver walked to RUN).
- PEOPLE [rumours travel] SHIPPED bdf7202 + 324d14b: the city could not gossip at all because
  [no clumping] spaced drawn bodies 19 cells apart and the gossip pass paired off the DRAW LIST;
  the pass asks the world now; two people who stand together SEE each other (61 minds had ONE
  sighting in the whole city since 8/2); stories level, sharpen and shift blame (Bartlett, Allport
  and Postman), 133 wrong of 109 stories in one day, one event alive as nine versions; a mouth
  says it with a head and a name plate. And [no clumping] had also killed WITNESSES (10-cell room
  vs 8-cell memory), which QUESTS bisected and PEOPLE fixed in the witness pass, not with a second
  writer. [PENDING Paolo] how often a story goes wrong: in VOTE.
- COMBAT [fight looks] V224 70faff2, stamp 9/23g: THE LAST SIZE LIE WAS THE CANVAS. The fight drew
  at 2x backing on a phone; now 1:1 like the street, so the fighter is 112 CSS on the glass (was 56),
  a lot 196, a quarter of the pixels. Pad, slack and floor moved to CSS units. Still open: the auto
  frame scales the PERSON at a wide frame (71 CSS); the way out placed off the glass. Also: the
  board could boot at one pixel and stay there for ever (game fix in size()); the alpha keeps a
  HIDDEN fight frame for its COMBAT tab that fools every softer gate; the gate's frame finder took
  four cuts and COMBAT stopped and said so (rule 14g: put the gates on the one driver). No VOTE item
  for a fourth round.
- QUESTS [strike ask] SHIPPED f403acc: the picket ask, cooked as a picture off the real glass
  (Estella Gaines at his door, one bubble, no card); person_moves_house wired to WORLD's strike
  (5 of 6 visible changes wired); dormant on the play surface by construction. Found: THE FACE IN
  THE BUBBLE IS NOT HER (36 of 40 people carry a face index, the bubble rolls a different one from
  the id).
- SOUNDS [footsteps on the beat] SHIPPED 5ffae16: the row's premise was backwards; footsteps fire
  once per beat (one press = one house = one footstep, 94% of cells silent is correct). THE REAL
  BUG: a run covers twice the ground and makes the same one sound (the second step is synchronous
  and the limiter eats it). Cooked DOES A RUN SOUND LIKE A RUN (A/B/C) in VOTE; the one-line fix
  held under rule 18. RULED HERE: walking is item 2 and un-held, ship the line.
- PLUMBER [eyes: head blind] SHIPPED 991d39c: the handoff gate's round marker was one character,
  so every lane past 26 rounds was invisible to the block-head guard; the recovery tool ordered
  markers backwards ('b' > 'ap'); 58 blocks recoverable (LIFE+CITY 17, EYES 16, WORDS 9). PLUMBER
  named the missing leg: nothing stops a conflicted file reaching main; a pre-push leg is cheap.
- PORTRAIT [customizations first] 99bb605: 13 of 27 face dials were not on his panel; 14 -> 22
  sliders, all move pixels; five deliberately not added (the clamp re-derives two, one moves one
  pixel, nose.len and details.stubble move zero pixels: dead fields). Tab: CHARACTER, tap the face.
- LIFE+CITY [eyes: half a hud] round 1 (2b3347f, 0317a42): EYES WAS RIGHT. SCAVENGE, BUILD HERE and
  STANDING are reached by the finger and do nothing; likely cause: they open CARDS and rule 19a
  killed the card surface, so the room was removed and the doors were left; RAY, DENISE, MARCO and
  Marry live inside the STANDING card, so four of the seven are one dead door. Four wrong
  instruments first, all pressing a covered surface.
- ANIMATION [spine bend] SHIPPED (7104c0b, the elder in VOTE). CHARACTER runway redo in VOTE.

## 2. THE THING THIS ROUND KEEPS SAYING
Five lanes (RUN, UI, SOUNDS, LIFE+CITY, COMBAT) each found separately that their instrument was
measuring a covered or hidden surface: the splash over the game, the VOTE landing instead of RUN,
the hidden fight frame, the one-pixel board. Every one read as a dead pad, a dead phone or a dead
fight, and none was. The fleet's answer exists (rule 14g, the one driver) and three lanes patched
the driver in one round. THE DRIVER IS ONE SYSTEM AND PLUMBER OWNS IT.

## 3. ROUTED
- PLUMBER [no markers] FIRST LINE: a pre-push leg that refuses a commit carrying conflict markers;
  it happened twice this round on the one file he complained about (mine at 9eec17d, PEOPLE at
  d4b24e8). [one driver] OPEN: fold the three door fixes (RUN trap 7, UI knock loop, the RUN tab
  click) into the one driver, and every gate that opens the alpha goes through it (city_deeds and
  city_memory time out on the door, YOU CAN START IT has its own splash race). [slim build] 268 MB.
  [suite line] is stale since 9/14; the reds named on clean main this round listed on the front page.
- COMBAT: [fight looks] closes when the person is 112 at EVERY frame width (rule 21: the frame moves
  the ground, never his size); register V224's before/after in VOTE (four rounds without a thing);
  [hidden frame] OPEN: mark the pre-created COMBAT tab frame so no gate mistakes it for the fight.
- UI [phone black] OPEN: three seconds of black on the phone's first open.
- PEOPLE [bubble face] OPEN with PORTRAIT: the bubble draws the face the person carries.
- PORTRAIT [dead dials] OPEN: nose.len and details.stubble move zero pixels; a dial that does nothing
  is rule 14d.
- CHARACTER [become red] OPEN: become_gate 15/13 red on clean main.
- LIFE+CITY [eyes: half a hud] continues: under 14d the three doors speak through a mouth with a
  portrait (rule 19) or go; the family behind STANDING gets a mouth with PEOPLE.
- RUN [way back] OPEN: one squeeze out, one spread back (three today).
- SOUNDS: ship the run's second footfall (walking is un-held).
- EYES: two findings proven this round by other lanes (half a hud, head blind); standing.

## 4. THE THING HE NEVER OPENED
The demo with 13 things on screen instead of 27, build 9/24e, DEMO. And the phone in his pocket on
the street, top right, tap it: ALPHA and DEMO, RUN tab.
