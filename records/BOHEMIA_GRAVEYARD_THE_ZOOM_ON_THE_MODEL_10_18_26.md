# GRAVEYARD: THE ZOOM ON THE MODEL'S FACE (RUN TWO, 10/18/26)

KILLED by Paolo's note on the card run2-the-starred-faces-10-18 (vote up, with the note):
"you showed me portraits that I really liked and then on 90% of the characters there's a zoomed in of the model asset,
bro it can't be like that... I liked it when it was the portrait not when you zoom in on the fucking creepy model's
face... it has to be made fresh portrait." Rule 115(h) amended the same sweep: A FRESH PORTRAIT, NEVER A ZOOM ON THE
MODEL, not even as a stopgap.

## What died
- slices/rig_faces/ (13 webp at 128 px + rig_faces.json): eleven of thirteen were a CHARACTER rig BODY render's head,
  found as the widest alpha run above the neck, cropped 32 px square and scaled x4 nearest (two were PORTRAIT's
  poacher and thug heads, cropped from their own portrait renders).
- tools/bohemia_run2_rig_faces.py, the tool that cut them.
- engine/bohemia_rig_faces.js, the reader both screens used.
Shipped 66923cf, removed by [the fresh portraits wired in].

## Why it was wrong (post-mortem)
1. A body render is lit, framed and sized for a 32 px head on a whole body. Zoomed x4 it is mush with the body's light;
   it reads as a doll's face pressed to the glass, which is the word he used: creepy. A portrait needs its own camera,
   its own framing and its own light (PORTRAIT's head camera), not more pixels of the body's.
2. The stopgap came from the coordinator's row ('a man shows his rig body's head, never the old portrait'); I built it
   to the letter instead of measuring what it looked like at his phone's size against the two real portrait heads on
   the same screen. The before-and-after I registered showed the problem and I called it a KNOWN SHORT instead of a NO.
   THE TELL: a shipped row whose own record says 'blurrier than' the thing it sits next to.
3. Nothing would have stopped it coming back: no gate knew where a face's pixels came from.

## What replaces it
PORTRAIT's 13 fresh portraits (eb12c4a2), records/target/portrait/crew/<look>/, read in place by
engine/bohemia_crew_faces.js; the mouths A E O M move on the beat when a man speaks.
gates/no_face_from_a_body_gate.js (NO FACE FROM A BODY in the suite) classifies every face on both screens by where its
pixels came from and fails a body crop, with a planted crop as its control.

## Never again
A face on any screen is a portrait render or the old painted portrait, never a crop or zoom of a body sprite or render.
If PORTRAIT has not made a look's face, the screen keeps the old painted 64 until it has.
