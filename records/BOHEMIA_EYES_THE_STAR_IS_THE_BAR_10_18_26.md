# EYES AND EARS -- THE STAR IS THE BAR (10/18, eyes-opus-10-18d, row [the star is the bar])

Rule 115(h), Paolo 10/18, the fourteenth votes, on PORTRAIT's poacher face built as a 3D head on the body's own model:
"You might change the game with this one big star event... this is the first star I've handed out." The row's
PURPOSE: the starred face is now the bar every face is held to, and a bar nobody measures slips. END STATE: each face
PORTRAIT ships after the star sits beside the starred poacher on one sheet at the same size and light, with the numbers
that made the star (head size, light direction, colour count, mouth shapes, brow and lid moves) read off both, and a
PASS or BACK per face. CONSTRAINT: EYES measures, DIRECTION judges taste; never a filter.

Commit 4573a45f. Tool `tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py`; the read
`records/target/EYES_THE_STAR_IS_THE_BAR.json`; the sheet `slices/vote/EYES_THE_STAR_IS_THE_BAR.webp` (lossless);
VOTE `eyes-the-star-is-the-bar-10-18`; in the suite as THE STAR IS THE BAR (`--selftest`, GREEN 10/0).

## 1. The answer

13 faces were made after the star (YOU and the twelve cast looks on RUN TWO's crew and scavenge screens, PORTRAIT
round 1, eb12c4a2). Read beside the star off the pictures: **11 PASS, 2 BACK.**

| face | verdict | why |
|---|---|---|
| YOU, APRON, BAREARMS, CAPE, LONGCOAT, PACK, PONCHO, SATCHEL, SHORTCOAT, SHORTS, SKIRT | PASS | every number at or past the star's |
| BEDROLL (taper, work cap) | BACK | one eye has no pupil you can see under the visor (3 levels darker than round it, the star 29 and 28, 10 the least seen); its moods move the face 69/122/605 px for Angry/Sad/Surprised against the star's 143/173/902 |
| WIDEBRIM (taper, the rice farmer's cone) | BACK | the square the crew screen draws cuts 26 px of the cone (12 left, 14 right); the render itself is clear |
| THUG (made BEFORE the star, context only) | PASS | |

THE STAR'S OWN NUMBERS: eyes 35.2 px apart and 44.0 px from the eyes to the jaw; lit from 123 degrees (read under the
eyes); 16,007 colours over its eight shots (580 per 1,000 painted px); 4 mouth shapes (closed, A, E, O); both pupils
seen (29 and 28 levels darker than the ring round them); the render's frame clear.

The thirteen are one size with the star: eyes 34.5 to 35.4 px apart against 35.2 (98 to 101 percent), and lit from
one sun: 109 to 132 degrees against 123, the bedroll 148 (25 apart, inside the style guide's 30).

## 2. Three findings, for the lanes that own them

1. **THE STARRED FACE'S MOODS ARE THE MOUTH ALONE.** Above the lip line the star's Angry, Sad and Surprised move
   26, 7 and 52 px; the crew's move about 600, 250 and 750. At a CIELAB step of 5 (two noticeable steps) the star's
   brows and lids barely move at all. So the moods were not what earned the star, and every crew face beats it there.
   FOR DIRECTION (taste) and PORTRAIT: whether the bar should carry the crew's brows is a taste call, not this lane's.
2. **THE CREW SCREEN'S WINDOW CUTS EVERY BRIM.** PORTRAIT's hand-off square (`crew_faces`: 1.25 x the head, 160 px,
   from the top, centred on the head) is narrower than any brim: the widebrim loses 26 px, and the same window would cut
   15 px of the STARRED poacher's own brim. Rebuilt here, the window equals all 13 hand-off files to 0 levels, so the
   cut is exactly what the crew screen shows. The faction round (13 looks, hats among them) goes through the same window.
   FOR PORTRAIT: the window, not the face. FOR RUN TWO: the crew screen draws these files as they are.
3. **A VISOR CAN HIDE THE EYES.** The bedroll's work cap throws the eye sockets into a shade the pupil cannot be read
   out of (3 levels against the star's 29), and its moods' movement falls under the star's on all three. At the crew
   screen's 64 px the face reads as a cap and a mouth. FOR PORTRAIT (the light or the visor's height); taste stays
   DIRECTION's.

## 3. How each number is read (and what was tried and thrown away)

Everything is read off the render files (`records/target/portrait/rig/<who>/rig_portrait_S.png` and its seven
expression shots); the manifests' own claims (head_px 128 for every head) are printed beside, never used.

- **THE JAW AND THE LIP LINE** from what the A shot (jaw open) changes. THROWN AWAY: taking the topmost changed row as
  the lip; the star's A shot nudges one pixel at the top of its hat (row 45) and the "lip" jumped to the hat. Now the
  outliers far from the mouth are dropped and the lip line leans with the mouth's own long axis (13.5 degrees on the
  star, against the eyes' own 14.8: two landmarks agreeing on the head's roll without being told).
- **THE EYES** from where Surprised moves the lids above the lip line, split left and right, then pinned on the darkest
  small dot near each (the pupil). THROWN AWAY: a pupil finder alone, which took the hairline's notches for pupils on
  six of fifteen heads; and lid spots alone, which sit a few pixels over the pupil and slid 7 px when the cone's shade
  hid half a lid. A face whose pupil can not be seen (contrast under 10) gets EYES SEEN BACK and its size is NOT READ,
  never a false size verdict (the bedroll's lid spots read 43 px apart, which is wrong).
- **HEAD SIZE** is the eyes' spacing (the ruler face measurement normalises by): hat and hair can not change it.
- **LIGHT** is the brightness moment over the face's bare skin (cheek colour, the moving mouth and lids masked out),
  in screen degrees. It reads 155.5 on the rig's calibration sphere against DIRECTION's 155.4 (the method points at
  the right thing). THROWN AWAY: the whole face, because the star's brim shades its forehead (13 degrees there,
  127 below) and every hat would read as a different sun; and a brightness band in the skin mask, which removed the
  very shading being measured (a planted face lit from the right passed). Read now under the eyes only. A face is not
  a sphere, so faces read about 123 where the sphere reads 155: the comparison is face to face.
- **COLOURS**: distinct colours over the eight shots against the portrait class's floor of 800 (style guide). THROWN
  AWAY: "at least 0.6 of the star's density", which sent back the darkest faces only because sRGB has fewer codes in
  the dark (barearms 305 per 1,000 px, longcoat 345, against the star's 580). Density is printed, not judged.
- **MOUTH SHAPES**: rest, A, E, O and M compared in the mouth's box; two shapes are one under 0.05 x the eye spacing
  squared pixels (about 62). Rest and M are both a closed mouth and count once. THROWN AWAY: letting M count when it
  differed from rest, because the star's M sat 70 px from rest against a 62 px line and the count became a coin toss.
- **SEEN** is a CIELAB difference of 5 (about two noticeable steps). THROWN AWAY: 12 luminance levels, which counts a
  dark face's real change as nothing (the E shape merged into rest on the three darkest faces at 12 levels and stands
  at CIELAB 5).
- **MOODS** pass when each mood moves the brows and lids at least as much as the star's and the whole face at least
  seven eighths as much (the same eighth the size band allows).
- **FRAME**: a painted pixel of the head or hat on the top or side edge above the jaw, in the render and, for a face
  on the crew screen, in the screen's own square.

## 4. The controls (`--selftest`, in the suite)

1. the light read on the rig's calibration sphere: 155.5 against DIRECTION's 155.4 (within 5);
2. the crew screen's square, rebuilt, equals all 13 hand-off files to 0 levels;
3. the star reads and passes itself on every leg;
4. seven planted faces, each made from the star, each sent back on its own leg: a fifth smaller (head size), lit from
   the right (light), five steps a channel (colours), a mouth that only opens (mouth shapes), moods that never reach the
   brows (brows and lids), the hat cut by the frame (frame), a face that never moves (mouth shapes).

## 5. What this does not see, said out loud

- It reads the S facing at rest and the seven shots. SE and SW are not read.
- "Seen" is a pixel measure at 1:1 render size; at the crew screen's 64 px small moves shrink by 0.4 and some will
  not be seen. The company line on the sheet shows all of them at 64 (shown at 2x) so the eye can judge that size.
- The bar is the star's numbers, not its taste. A face can pass every leg and still be a NO from him; that is DIRECTION's
  and his.
- The faction round (PORTRAIT round 2, 13 more heads) had not landed when this ran. The tool walks every folder under
  `records/target/portrait/rig/`, so the next run reads them with no change; the coordinator runs it each sweep.

## 6. Routed

- PORTRAIT: finding 2 (the window cuts brims, the star's included) and finding 3 (the bedroll's eyes under the visor);
  one bounce-back line on its board, [eyes: brims and visors].
- DIRECTION: finding 1 (the star's moods are the mouth alone), taste only.
- RUN TWO: the crew screen shows the cut cone today.
- COORDINATOR: the tool is STANDING; run it when a face set lands (`python3 tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py`).

[bb Battle Brothers' portraits are flat paintings with no moods; a crew whose faces move is already past it, and the
bar keeps every new face there.]
[analog horror: a face whose eyes are lost in the shade of its cap is the right kind of wrong only when somebody chose
it; this measures so nobody gets it by accident.]
