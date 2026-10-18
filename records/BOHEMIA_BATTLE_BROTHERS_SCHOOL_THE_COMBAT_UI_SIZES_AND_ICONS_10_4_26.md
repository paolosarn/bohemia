# BATTLE BROTHERS SCHOOL: HOW BIG THEIR COMBAT UI AND ICONS ARE, AND WHAT OURS MUST BE ON A PHONE (coordinator 10/4/26, his ask)
Paolo 10/4: "do research on how big the UI and icons are for Battle Brothers; the combat UI is all fucked up and not seamless."
Sources reachable: the wiki text in the repo, the dev blog titles as search returns them (Dev Blog 75 'Reworked UI'; the dev
blog, Steam, ModDB and the wiki itself are egress-blocked); (recall) marks a number from memory; Grok ask 19 measures the
real ones off 1080p screenshots.

## WHAT IS CERTAIN ABOUT THEIRS
- The UI is MADE OF REAL MATERIALS of the setting: wood, metal and paper. Tooltips are paper and scrolls written in ink.
  Every button was redrawn to be 'more clear in its function' (Dev Blog 75). Nothing on it is flat, glossy or generic.
- It renders at NATIVE RESOLUTION with a UI scale slider (100 to 200%) and a separate scene scale; one painted pixel per
  screen pixel (DIRECTION 9/28).
- THE LAYOUT (the game, every screenshot): top centre, the TURN ORDER strip of small portraits in initiative order, the
  active one marked; top left, the round; bottom, ONE BAR: the selected man's portrait and name at the left, his
  hitpoints, armour (head and body), fatigue and morale as bars with numbers, the SKILL BAR in the middle (skills 1 to 9
  on the number keys, items beside them), END TURN and WAIT at the right; the fight log is a small scroll at the side that
  can be hidden. On the field: a man's health and armour bars appear ABOVE HIM when selected or hovered (a toggle shows
  all), small status icons over his head, the hex under him lit, the hit chance shown at the cursor.
- Cover and line of fire have their own icon (a shield with an arrow) in the hit-chance read-out.

## THE SIZES (recall, to be measured by Grok ask 19)
- At 1080p, 100% scale: the bottom bar about 150 px tall; a skill button about 56 to 64 px square (the source icons are
  64x64); a turn-order portrait about 60 px; the overhead bars about 40 px wide and 4 px tall; body text about 14 px.
- So on a 1080p monitor a skill button is about 3% of the screen's width. Their UI is SMALL on a big screen and it works
  because a mouse is precise.

## WHAT OURS MUST BE, BECAUSE IT IS A PHONE (the part that transfers is the LAYOUT and the MATERIALS, never the pixel sizes)
- A THUMB NEEDS 44 POINTS: Apple's own floor for anything you tap is 44 x 44 points, which is 132 x 132 device pixels on
  his phone (3x). Every skill button, END TURN, WAIT and the portrait are at least that. Their 56 px button would be a
  19-point target on his phone: unusable.
- THE BAR: at the bottom, one bar, the man's portrait and bars at the left, the skills in the middle as 44-point squares
  (five or six fit across 390 points with gaps; more scroll), END TURN at the right under the right thumb. Height: about
  120 points (360 device pixels), under a quarter of the glass.
- THE TURN ORDER: a strip of portraits across the top, 36 to 44 points each, the active one larger; it is read, not
  tapped, so it may be smaller than a button.
- OVER THE PEOPLE: health and armour bars only (his 10/2 vote), 2 to 3 points tall, as wide as the man; status icons
  12 to 16 points; nothing else on the field.
- MATERIALS: theirs is wood, metal, paper, ink. Ours is the same idea in our world: tape, cardboard, a cracked phone's
  glass, a thermal receipt, marker on a wall; drawn, with light and form (rule 29), never a flat rounded rectangle. Every
  perk and trait gets a drawn icon (his 10/2 vote), 44 points when tapped, 24 when listed.
- ONE UI EVERY SECOND (the first votes): the map, the settlement and the fight share the bar's place, type and materials;
  the fight adds the skill row and the turn strip, nothing else changes.

## WHAT IS CERTAIN / NOT
Certain: the materials, the layout, native resolution with a scale slider, the 44-point thumb floor (Apple HIG). Recall:
every pixel number for theirs. Grok ask 19: measure the bottom bar, a skill button, a turn-order portrait, an overhead bar
and the text height off three 1080p screenshots at 100% scale, and at 200%.
