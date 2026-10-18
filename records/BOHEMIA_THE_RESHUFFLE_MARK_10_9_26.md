# UI [glass face]: THE RESHUFFLE IS A DRAWN ARROW, NOT A '?' (10/9/26, ui-kmqmrf)

The row: RUN 9/28 left it in a code comment ('Whoever wants a real reroll arrow adds it to the ROM face; UI [glass
face]'). The reshuffle on each family face (rule 32d, [three names]) had become a '?' because the phone's ROM face
has no circular arrow; a '?' on a face reads as 'who is this', it sat on the hair, and it was 11 points wide.

BUILT in slices/bohemia_ui_materials.js; the city file is not edited.
- MARKS.again: a 12x12 pixel ring two cells thick, open at the top right where the arrowhead sits, beside the fight
  bar's end, wait and auto marks. mark(k, ink) takes an ink now, so the ring is cream (#f2e4c6) for dark glass.
- dressPhone puts the reshuffle in its own strip UNDER the face: a pane of the bar's glass, the card's width
  (38 pt) by 24 pt, the ring centred, amber while pressed. The card grows 31 pt at the foot to hold it, so the flip
  keeps the whole card above it (44x56). The '?' stays in the page for a screen reader at no size, see-through.
- Not drawn into the ROM face: a glyph would have to be cut into the woff2 and the ttf and checked against
  rom_face_gate's coverage; a mark is the materials' own way (the fight bar's marks are the same kind).

MEASURED: gates/the_reshuffle_mark_gate.js 9/0 on the demo's map with the family unlocked by the game's own hook:
the ring painted on both reshuffles, 13.6 to 1 plain and 6.4 in the sun; 38x24 under the face; the flip 44x56
above it; a real finger on the reshuffle turns Ezekiel into Araceli and the act stays 1; a finger on the face
above flips to act 2. BEFORE: an 11x11 '?' circle over the face's top right corner.
FIVE MUTATIONS, each restored: no ring -> 1 red (the screenshot leg; the drawn-ring leg read the image off a ::before with content:none and passed, so it now checks content too); the ? painted -> 1; back on the face -> 3; no room under the face -> 2; a dark-ink ring -> 1.
VOTE: ui-the-reshuffle-mark-10-9, sheet slices/vote/UI_THE_RESHUFFLE_MARK_10_9.png (before, after).
