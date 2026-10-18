# RUN TWO [the crew screen at fourteen], 10/18/26
# His 10/18: 'when you got one person... three... six... up to 14 people'; rule 117 minimalist.

## WHAT WAS WRONG (measured at 1, 6 and 14 men, phone 390 x 844 and laptop 1440 x 900)
- THE PHONE: the line is nine 48 px cells across (464 px with the gaps) on a 390 px glass, so the eighth and ninth places
  sat behind a sideways drag, and the laid-up strip (the same nine-cell grid outside the line's scroller) pushed the WHOLE
  PAGE to 477 px: from six men up, the page itself scrolled sideways. Nine 44-point cells cannot sit across 390 (396).
- THE DOUBLE: a man laid up stood in the line AND in the laid-up strip. open() benched him, then its 'a man who joined
  since the line was set' loop put him straight back in the first empty place.
- THE LAPTOP: one column stretched to 1440: the line a strip in the corner, gear slots 325 px wide with 22 px icons, the
  bag's slots 230 px squares, the page 2,972 px tall at fourteen men.

## WHAT CHANGED (slices/BOHEMIA_ROSTER_SCREEN.html, CSS and three DOM lines)
- A phone upright (under 490 px): THE LINE STANDS UP. FRONT and BACK side by side, the nine places top to bottom, every
  man a 44 px fresh face with his whole name beside it; the laid-up strip the same, with his name AND his days. A drag
  between the lines works as before (the same cells, the same order).
- A laptop (1100 px and up): the phone's view with room, two columns: the line and who wears what on the left (640),
  the man's card and the bag on the right (440, sticky); the bag's slots 44 to 64.
- open() never puts a laid-up or dead man back in the line.
- Between the two (a phone on its side, a tablet) the line fits across and stays as Battle Brothers draws it.

## MEASURED
- NEW GATE THE CREW SCREEN AT FOURTEEN 21/0 (registered): phone at 1, 6, 14 men: the page 390 of 390; every man a fresh
  face on the glass, 44 wide, his whole name; laid-up men show name and days; 4 slots a man on the glass, thumb-sized; a
  drag FRONT to BACK moves him; laptop at 1, 6, 14: two columns, the card at (844, 74), bag 64, fourteen rows and the
  card and the bag inside 1,104 of 900 px (1.3 screens); CONTROL: the screen before this row runs to 477 of 390 at six
  men. It caught the double on its first run (7 faces for 6 men).
- roster 15/0, roster hurt 13/0, crew stash 21/0, the roster and posts look 28/0 (UI's, every cell 44), equip 7/0,
  climbing 15/0, bag sorts 9/0, no face from a body 22/0, settlement 74/0.

## ROUTED
- UI: the line's name plates are the materials' receipts; on the standing line they are 170 px wide, room for a level
  or the hurt mark if UI wants it there.
- COMBAT: the formation the screen posts is unchanged ({front:[9], back:[9]}); only how it is drawn moved.

[bb school line] Battle Brothers draws the company as two lines of nine across a wide screen; on a phone held upright the
same two lines stand up, front beside back, so nobody has to drag the ninth man into view.
[analog horror line] Fourteen faces in two columns, like a school photo nobody asked for. Two of them grey, in the strip
underneath, counting days.
