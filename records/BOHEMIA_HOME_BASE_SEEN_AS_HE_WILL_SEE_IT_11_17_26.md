# HOME BASE, 11/17/26: HIS PLACE SEEN AS HE WILL SEE IT (BUILD 11/17zr; VAMILY rule 458(c), rules 451(c), 373, 354, 23, 441; ask line 642)

His words on HIS OWN BUILDINGS (vote sheet 11/16, the YES): "Bro, every time you show me my settlement, I wanna see the view that I'm
gonna be seeing the settlement in. You know it's gonna be a different view. It's gonna be some intimate shit. It's gonna be like
security cameras." The second time (451(c) was the first). The coordinator's order (routine "HOME BASE show it through the cameras"):
every card, picture and screen of his settlement is the security-camera view; the HIS OWN BUILDINGS and YOUR PLACE ON CAMERA cards
re-shot from inside the feeds (the training yard, the forge, the lookout each in a camera's frame, close, his people at them); the
game never falls back to a top-down sheet of his place: building, placing and looking all through the cameras, the build sheet
reached from a feed. One build, the cards re-shot, the row marked.

## MEASURED FIRST (main 6e0198f3, the demo upright, his place planted with a yard, a forge, a lookout and the cork board)
- His three cameras were this screen's own 45-degree picture with REC written over it: the same view as every town, the footage's
  look owed (the 11/14 record said so). A card shot of it read as the town, not a camera (his complaint).
- The build sheet drew a TOP-DOWN PLAN of his lots (a small canvas) and he picked a lot by tapping it: the top-down sheet.
- Tapping the yard at CAM 2 opened its sheet with the yard off the glass: nothing of it was in the camera's frame.
- Nobody stood at his buildings; his men were in the town's crowd anywhere.

## WHAT WAS BUILT (slices/BOHEMIA_SETTLEMENT_SCREEN.html, __HIS_PLACE_SEEN_AS_HE_WILL_SEE_IT__, only at his planted place)
1. THE LENS. Each camera is mounted: the picture is seen through its own perspective (a tilt, CAM 1 13, CAM 2 20, CAM 3 16 degrees and
   crooked), so the near ground is big and the far small (rule 373), one compositor transform on the canvas (nothing redrawn, no cost a
   frame). The camera always fills the glass (never a black corner) and sees all twelve lots (rule 354): where the picture's own edge
   stops it, it turns (a yaw) or pivots on its side and zooms the least it must.
2. THE FOOTAGE. The camera's own sensor (nearly black and white, a green cast: act one's dying system, rule 354), the starred title
   feed's own tape (its scan lines, its rolling bar, its vignette, the same values) and the wrong clock a forgotten camera keeps
   (01-01-80, running). The readout, the switch, the sheet and the phone stay clean: they are his, not the camera's.
3. A FINGER THROUGH THE LENS. Every tap is mapped back through the same transform (its exact inverse): a door, a man and a lot answer
   where the camera shows them. The click a phone sends after a tap keeps its tap's own point, so ONE TAP, ONE ANSWER still swallows
   it (found on the way: the tap on BUILD turned the camera, the click was read through the new camera and pressed WALL). The framing
   runs after the tap, never inside it (found: on a loaded box it ran past the 700 ms the swallow allows). The piece drawn under the
   finger answers before a neighbour's wider tap box (found: at CAM 1 the yard's middle sat in the forge's 44-point box).
4. CLOSE. A tap on one of his things cuts that camera close on it (its own zoom), named in the readout ("CAM 1 · TRAINING YARD"), in
   the glass the sheet leaves open; the sheet put away, the camera goes back on its mount. On its side the yard's men sit in two
   columns, so the camera keeps glass to show the yard.
5. HIS PEOPLE AT THEM. A man of his company stands at each of his own buildings, a body in front of it (a lot is about a man wide, so a
   man beside it stood on the next door), the men in training at the yard first; taken out of the town's crowd, so nobody is twice.
   A tap is that man on the crew screen. (With two men, the lookout stands empty: the company is the count.)
6. NO TOP-DOWN SHEET. The plan is gone from the desk. BUILD cuts to CAM 2 on THE LOTS: each open lot marked on its own ground (chalk,
   its number), the picked one gold; a tap on a lot in the feed picks it. With no sheet open, a tap on an empty lot opens BUILD with that
   lot picked (on a short glass on its side the desk covers the lots). What his place can do (TRADE MEND HEAL TRAIN CRAFT WATCH) is one
   row under the speaker.
7. The walk-up's lift (the town sliding under a sheet) is off at his place: the camera frames what he tapped above the sheet instead.

## THE GATE: gates/home_base_gate.js, YOUR PLACE, PLANTED
D19 new, D8 and D10 rewritten (the plan is gone): every camera its own mount through a perspective, the sensor, the tape and the wrong
clock, the glass filled, all twelve lots in its frame (PLANTED: the sensor and tape taken off read red); a finger goes through the lens
(PLANTED, upright: the yard's spot read flat, without the lens, answers wrong; on its side CAM 1 sees the yard within a few px of flat,
so the leg reports the distance); a real tap on the yard cuts close on it, all of it above the sheet (upright more than 1.3 times wider
than at CAM 1); his men at the yard and the forge, each once; the sheet put away, the camera back on CAM 1. D8: no top-down plan, the
twelve lots on their ground in the feed, the camera on THE LOTS (PLANTED: a plan put back on the desk reads red). D10: lot 3 picked by a
real tap on its ground in the feed, a thumb's width (44 px or more), the garden goes up there, CLEAR takes it down.
D17 waits for the sheet's opening to finish before it reads a row (measured: a row read mid-opening, at a tenth of its size).
THE ALPHA, by real taps (tools' driver, alpha:true): upright every close shot and BUILD with the pick; on its side every close shot; on
its side BUILD's desk covers all but 42 px, so there the lot is picked first, by a tap on its ground with no sheet open.
Pre-push: see the commit.

## THE CARDS RE-SHOT (records/target/home_base/, records/target/vote_first/)
- HIS OWN BUILDINGS (home-base-his-own-buildings-11-17): the yard, the forge and the lookout, each close on CAM 1, his men there.
- YOUR PLACE ON CAMERA (home-base-his-place-through-its-cameras-11-14): CAM 1, CAM 2 and CAM 3 through the lens.
- WHAT YOU DID, PINNED (home-base-his-impact-11-17): the cork board close, and the alpha on its side.
- NEW: home-base-seen-through-the-cameras-11-17 (vote_seen_through_the_cameras.webp): BUILD with the lots on their ground, the yard
  close, the alpha on its side.

## NOT DONE, SAID PLAINLY
- The cameras are the town's picture through a lens, not the 3D renders of rule 354/373 (tools/bohemia_home_settlement_pipeline_11_3_26.py
  and its page slices/BOHEMIA_YOUR_SETTLEMENT.html, which have none of his buildings yet). This is the view he plays now; the renders
  are a separate, bigger build.
- The camera's look is a filter on the live picture (a colour matrix, the tape over it), because the place is alive; the starred feeds
  bake theirs at render.
- No camera sound yet (the starred feeds each have one).
- Close shots on a small piece are soft (the picture magnified about twice): the camera's own zoom.
- His place's shops (the stall, the bar, the clinic) are the camp's own pictures through the lens.

[bb Battle Brothers shows your company's camp as a drawn screen; ours is the footage of cameras on poles round the place you took.]
[analog horror: the clock on the feed says 01-01-80 and keeps counting. Nobody has set it since.]
