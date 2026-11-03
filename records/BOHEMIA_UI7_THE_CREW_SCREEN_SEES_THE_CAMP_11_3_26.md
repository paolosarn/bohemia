# UI 7: THE CREW SCREEN SEES THE CAMP (rule 369, Paolo 11/3; ask line 393)

## HIS WORDS
"I'm tired of all that brown backdrop shit. I wanna see more of the camp, of the settlement, when you're in the crew screen, so I'm
wondering if we can set up a smart system, the screen looks really clean. It's your people in the camp and... right now it's hard to
see them. There's so much brown background gunk... especially in the crew menu, you click on a character, it centers the camera on
that character, to make it that much more like walking around."

## MEASURED BEFORE (the demo at a5e7eaa6)
- records/target/coordinator_11_3/crew_screen_now.png: YOUR COMPANY covered the glass with four brown textured panels (the line, his
  card, the stats' paper, the stash); the camp behind was dimmed 0.62 everywhere and his men were a dark smudge at the foot.
- A tap on a man changed his card; the camp never moved.
- A DEFECT UNDER IT: made camp on the map after a town, the town's frame stays display:block at opacity 0, so the phone's CREW opened
  the company screen INSIDE that unseen frame: the phone showed YOUR COMPANY over the bare map and the screen was nowhere (same on main).

## WHAT CHANGED (slices/BOHEMIA_ROSTER_SCREEN.html, __THE_CREW_SEES_THE_CAMP__; the phone's crew face; one line in the materials)
- THE CAMP IS THE SCREEN. One camera over the camp (or the town, or the camp in a town), the man picked in the middle of his own sheet:
  his slots round him, his figure (his gear, his gun) standing in his own place in the camp, the others at their camp things round the
  back of the fire. In a town his men live in the town's own picture (rule 218): the camera finds him there and follows him while he
  walks. The ground may zoom, the person may not (rule 21): at the camp the camera comes as close as makes his people the figure's size
  (98 points); in a town (the town draws its people at its own size) it comes in by half, enough to walk to a man and still see the men
  round him (measured on its side: brought to the figure's size, two of three men fell off the glass). Never past the picture's own edge:
  a man the town stands at its very edge lands as close to the middle as the picture allows (said, not hidden: 105 points off upright,
  200 on its side, at Church).
- A TAP GLIDES TO HIM: a finger on a man in the line, a swipe across him, Tab, or a finger on the man himself in the camp: the camera
  glides to him in 450 ms (under a beat), eased in and out, on its own clock from its first drawn frame (his sheet is rebuilt first;
  that wait is logged, never eaten out of the glide); tap another and it glides on. Where bodies overlap, the man nearest the camera is
  the one picked; his slots, his numbers, the line and the stash keep their own taps.
- WHAT IT COSTS: the camera's paint during a glide, measured on this box (no GPU, the whole game running under the screen): in a town
  median 8.2 ms, 90th 11.5, worst 14.1 (the town's live picture copied); at the camp 0.2 ms; inside a 60 fps frame. Only the part of the
  picture on the glass is drawn (drawing the whole zoomed picture held frames to 200 ms, measured), and the lamp is drawn once a pick.
- THE BROWN IS GONE. Card, title plate, stats paper, the kit's board and tin are off the sheet while the camp is under it: the line is
  faces in thin frames, his slots small dark glass, his numbers bars on the camp (the stat tags dark glass), the stash pockets.
- THE LAMP, NOT A BOX: the camp is lit where he stands; the frame falls into shade above the words over the pool (the line's FRONT and
  BACK) and below the words under it, as far as they reach and no further, with a fall-off round the pool only for words beside it; each
  the least that keeps every word on the picture at 4.5 to 1, measured off the drawn picture (rule 357(c): no box behind a word). Measured
  on its side at the camp: one radial dim for every word darkened the whole camp to 0.46; the bands leave it at 0.00 where it is seen.
- THE PHONE CARRIES HIS NAME: the phone's YOUR COMPANY face now names the man picked (his name, trade and level, XP, trait, kills); the
  screen's own title bar, the stash's count and its 'the stash is empty' line step off the glass (said once, on the phone).
- UPRIGHT he stands at the foot of his slots (the two bag pockets join the side columns), so the camera can bring his place in the camp,
  low in the picture where the fire is, under his figure; ON ITS SIDE the line of faces stands over the stash, clear of the phone.
- EVERY MAN round the back of the fire (it drew the first eight): four close (his neighbours stand in the open middle of his sheet, where a
  finger reaches them; at the old ring they stood behind his slot columns, measured), then six, eight, twelve further out.
- THE UNSEEN TOWN never takes the crew (slices/bohemia_ui_materials.js hudTownWin): the map's own door opens the screen over their camp.

## GATE
gates/the_crew_screen_sees_the_camp_gate.js (new): S1 the camp seen past 40% of the glass off the phone and lit (the lamp's shade under
0.35 there, 0 where he stands, no board or paper panel); S2 every man drawn; S3 a finger on each man in the line glides the camera to him
inside a beat (its plan 450 ms and the one late frame of this box) and he lands in the middle of his sheet within 14 points of his feet
(or the picture's edge holds it, said); S4 a finger on a man in the camp itself (a point where the game picks him, clear of the sheet)
picks him and glides; S5 the phone names him; S6 the camera's paint fits a 60 fps frame; MAP CAMP C1 the screen opens on the glass over
their camp. PLANTED: the brown back, a man left out, the camera frozen.

## THE SCHOOL LINE
[bb Battle Brothers keeps its company screen over a painting of the camp's fire, the men as portraits on a parchment panel; ours is the
camp itself, live, the men standing in it, and the panel is gone.]
[analog horror: one work lamp on the man you picked, the rest of the camp falling into the dark the way a CCTV frame does at its corners.]
