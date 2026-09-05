# HOW THE FIGHT BEGINS: OVERWORLD TO COMBAT (coordinator, 9/5/26, answering Paolo)
# "how's combat gonna work from overworld exploration to like combat... if a tile is
# like one house... is the whole overworld change now or is it gonna be a transition
# from combat to non-combat or what?"

## WHAT IS ALREADY TRUE (measured, not planned)
1. **The overworld does NOT change scale.** You walk as a person, one small cell per
   step. That is untouched by the house-tile ruling.
2. **The house-tile ruling only ever applied to the FIGHT board.** It shipped as a
   dial in the COMBAT tab's DEMO SETTINGS (TILE: A BODY / A HOUSE, plus TILE WIDTH);
   a pistol reaches one house, a rifle two, a sniper three. The walked city never
   read it.
3. **The transition already exists and it is place-based, not screen-based.** The
   fight board is BUILT OUT OF WHERE YOU ARE STANDING:
   - bump a hostile on the street -> the board is a STREET, objective "out on the
     block", you start where you stood;
   - walk through a front door -> the board is THAT ROOM, real walls, real furniture
     as cover, and you start AT THE DOOR you came through.
   One field decides which board you get. Nothing is randomly generated.

## SO THE REAL QUESTION IS NOT "WHOLE WORLD OR TRANSITION"
It is a transition, and it always was. The open question is WHAT THE PLAYER SEES IN
THE HALF SECOND IT HAPPENS, and that is a creative fork with no defensible default,
so it goes to him (three options in the reply, realism/his-stated-goal first):
- **A. THE CAMERA PULLS BACK.** You never leave the street. The view zooms out from
  person-scale to house-scale on one beat, the grid fades in over the ground you are
  already standing on, the fight happens on top of the real world, and the camera
  comes back in when it ends. This is his own sentence, "war is spilling in the
  streets," and the board is already made of the real place, so it is the honest
  picture of what the code already does. RECOMMENDED.
- **B. A HARD CUT** to the fight board. Cheapest, snappiest, but it reads as another
  screen, which is what he disliked about entering fights from the map door.
- **C. NO TRANSITION.** The whole game runs on the house grid all the time. Kills the
  seam entirely, but then walking round a house is one step and the city stops
  feeling like a place you walk.

## ROUTED
- COMBAT [enter zoom]: build the chosen transition, on the beat, 120 BPM, both
  directions (in and out), same for street and room.
