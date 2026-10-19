# RUN TWO [the 3D models on your screens] 10/19/26 -- THE CREW AND THE KEEPERS ARE RIG MODELS

Rule 121 (his work week, 10/19): "we have to do a full implementation of the 3D models, so that's top priority";
121(e), his NO on PORTRAIT's card portrait-the-face-is-the-bodys-face-10-19: "BRO EVERYTHING IS A 3D MODEL NOW FUCK
THE UGLY 8 BIT SHIT YOU COULDNT MAKE FRFR WTF TRYING TO COMBINE THE TWO"; his NO on EYES' card
eyes-every-face-beside-its-body-10-19: "bro the 3d models not in yettt????".

## Measured first (rule 12)
- THE CREW SCREEN drew no body at all (the line, who is wearing what and the card were faces only since 10/11, his
  'display the portraits all the time, not the full body'); every face was already PORTRAIT's 3D head. What it lacked:
  the man himself. Battle Brothers shows the man you picked whole on his card.
- THE SETTLEMENT drew every keeper and every man in the crowd from ANIMATION's flat sheets (slices/settlement_people,
  the alpha's famPaintBody 8-bit people, nine clips); the crowd's faction faces when tapped were the old painted 64 off
  slices/fight_people. That is exactly 'combining the two': a 3D head talking over an 8-bit body.

## What exists to implement (nothing new drawn, rule 121(b))
| set | where | what it is | pose |
|---|---|---|---|
| CHARACTER's thirteen gangs | records/target/character/rig/<gang>/rig_<turn>.png | his YES (character-the-thirteen-through-the-rig-10-18), own skins since 5e83eb13, the map's party bodies | a standing still in eight turns + a six-key walk |
| PORTRAIT's crew rigs | records/target/portrait/rig/crew/<look>/rig_<turn>.png | the whole body of the model each face was rendered from (YOU, 12 cast looks, 13 gangs), own skins | frame 0 of the model's walk only: mid-stride |
| PORTRAIT's 3D heads | records/target/portrait/crew/<look>/<key>_{64,128}.png | the faces, rest + four mouths + three moods | -- |
| RUN's rig cast sheet | slices/BOHEMIA_RIG_CAST.png | CHARACTER's gangs packed for the map | held to 256 colours for 13 gangs: a tan face reads grey at a door's height (cartel, measured), so the settlement reads CHARACTER's own files |

No Blender in the container and the crew .glb files are not committed, so no new pose can be rendered: the crew's only
3D body is the mid-stride one, and the only standing bodies are the thirteen gangs.

## What shipped
1. engine/bohemia_rig_bodies.js (new): has/src/image for PORTRAIT's crew bodies, standing(look, turn) for CHARACTER's
   gangs (the sole row read off the render's own pixels, so a man's feet stay on the ground in every turn).
2. THE SETTLEMENT: every keeper and every man in the crowd is one of the thirteen gangs standing, door tall (a
   bare-headed body, 108 render px, drawn DOOR_PX tall; one scale for all, so a hat stands above the door line), dimmed
   at night by a copy made once per render (a canvas filter per draw took the screen from 42 frames a second to 5 at
   night, measured, and starved the sound's hidden check: SOUNDS' gate caught it, 19/2, now 21/0). A man turns one eighth of a turn at a time, every bar or so, each on his own
   beat of the bar (no clip faked from a still). Tapping a person opens THAT person (the tap box is half a body wide; the
   old 33 px box took a neighbour's tap in a market-day crowd). The keepers' looks moved from the twelve cast looks to
   the thirteen gangs because only the gangs have a standing 3D body; PEOPLE's names still read as the face (faceReads).
3. THE FACES: PORTRAIT's thirteen gang heads (3d29bd66, every key on disk at 64 and 128) wired into
   engine/bohemia_crew_faces.js; the old painted 64 off a body sheet and the demo's handed painted face are never drawn
   on either screen again; a look with no 3D head (none today) is the dim head shape.
4. THE CREW CARD: the man's whole 3D body beside his face, from the model his face came from, at one render pixel to
   one point (three phone pixels, integer); a tap turns him through all eight turns.

## Gates
- THE PEOPLE OF THE PLACE (settlement_people_gate.js) 31/0, new legs: the night costs no frames (43 against 45 by day); the screen never names or fetches the flat
  sheets; the bodies came from CHARACTER's renders; every keeper and crowd member is a standing gang with a 3D head;
  a turn is one eighth, everyone turns in twelve seconds, not all on one beat.
- NO FACE FROM A BODY 23/0, tightened: every face of a look PORTRAIT made is its file pixel for pixel, the only other
  face that passes is the dim head (the painted 64 and the handed paint now fail); the body module may name renders,
  never cut a piece out of one, and the face module never reads it.
- EACH MAN HIS OWN SKIN (new, gates/each_man_his_own_skin_gate.py, in the suite) 5/0: every face beside the 3D body it
  stands beside on the two screens, read with EYES' own read (tools/bohemia_run2_each_man_his_own_skin.py imports EYES'
  tool): 24 of 26 PASS; cast_widebrim and cast_shorts BACK (the face 2 bands darker than its body, the body on its ONE SKIN
  tone), frozen, the list only shrinks; a dark face beside a light body is caught.
- Unchanged and green: settlement heard 21/0, arrival 37/0, bar news 22/0, barber's door 8/0, board's people 16/0,
  clinic's cough 9/0, refugees 15/0, build on the screen 15/0, market pack art 7/0, every item an icon 10/0, living map
  22/0, names mix 38/0, who the face is 46/0, talking portrait 34/0, labels 10/0, every speaker 10/0, settlement 74/0, ask the crowd 46/0, names wired 66/0, keepers 26/0,
  keeper lines 48/0, roster 15/0, crew stash 21/0, roster look 28/0, one man one look 8/0, hire price 10/0, climbing
  15/0, equip 7/0, roster hurt 13/0, bag sorts 9/0, sideways 13/0.

## VOTE
run2-the-3d-models-on-your-screens-10-19, slices/vote/RUN2_THE_3D_MODELS_ON_YOUR_SCREENS_10_19.webp, made by
tools/bohemia_run2_3d_models_shots.js (before served from git at 43339b58, the screens only; the game's camera, his
phone upright at 3x).

## Known, not mine to change (routed)
- PORTRAIT (paused): the women's 3D heads (cast poncho, skirt, shortcoat; gangs colorful, church, reds, network,
  volunteers) carry a dark mark under the nose that reads as a moustache at 64 px.
- PORTRAIT / CHARACTER (paused): the crew's 3D bodies exist only mid-stride (frame 0 of the walk); a standing still of
  the 13 crew rigs is one render each when either lane runs again, and the card takes it with no code (same files).
- RUN: the demo reaches both screens through its iframes, so this lands in the demo with no cut; the demo's
  BOHEMIA_SETTLEMENT_FACE answers are now kept and never drawn.
- COMBAT: engine/bohemia_rig_bodies.js gives any screen a man's 3D body by his look (PORTRAIT's, mid-stride) or a
  gang's standing one; the fight's [the fight wears the 3D models] can read the same files.
- The crew card's gear icons are still the pack's flat tiles (not people); COOK's 3D guns (YES 10/19) are the next row,
  [the guns on the crew screen].
