# PAOLO 10/27: FOUR LAYOUTS OF EVERY SETTLEMENT, AND THE TOWN FILLS THE SCREEN (LOCKED, rule 291; built by the coordinator)

## HIS WORDS (verbatim, voice to text)
"All right bro, so the only thing I want you to do right now cause basically not playable and terrible looking bro the settlement
and the camp shit cannot be broke. You need to create four of every fucking settlement landscape with the two phone placements and
portrait with the 2 Phone Pl. End of story so that I need to see that everywhere in the UI has been big dog shit so fucking fuck with
you too, but I need to fix right now everywhere because it's unplayable when the settlement is fucked up like that man tiny ear hurt
like bro disgusting"
('tiny ear hurt' is 'tiny, it hurts my eyes'.)

## WHY THE COORDINATOR BUILT IT
Every lane chat was out of usage (the weekly limit, resets 11/01 05:00 UTC, and the monthly spend limit); he asked for this one
thing now. The coordinator's no-code rule yields to his direct order with no lane able to run.

## MEASURED BEFORE (60 pictures: 14 towns and the camp, upright 390 x 844 and on its side 844 x 390, the phone left and right;
tools/bohemia_four_layouts_shoot_10_27_26.js against slices/BOHEMIA_SETTLEMENT_SCREEN.html in a full-glass frame)
- Upright: the whole picture was shrunk into the band above the phone (FIT.fit = min(open/pic)), so every town was a small box
  in the top three fifths of the glass, a sunk copy of itself round it, the phone over dead ground. About 0.27 scale.
- On its side: boxed to the band beside the phone, dim bands both sides. About 0.30 scale.
- The camp: one tent and a fire in a field of sand, a narrow lit column upright.

## WHAT CHANGED (__FOUR_LAYOUTS__ in slices/BOHEMIA_SETTLEMENT_SCREEN.html)
- frameFit(): for the layout he is in (tall or wide, the phone left or right) the picture is laid at the scale that covers the
  whole glass, and out of every pan the picture allows (up to a strip under the phone) the one framing is chosen that keeps the
  front of every building and every keeper at his door on the glass and out from under the phone; only when no framing at full
  size can, it steps back 6 percent at a time. Roofs may run off the top; fronts and doors may not.
- The camp frames its own tents, fire and men (BohemiaCampLook.state()), never the empty plate.
- A new glass or a new phone side re-frames; at the fit nothing slides (a drag looks round only when zoomed in); the pinch back to
  the fit returns to the framing. The building's sheet still stands in the open band (FIT.open).
- AFTER: upright 100 percent of the fill in all fourteen towns (0.42 scale, about 1.6 times bigger), on its side 82 to 100 percent
  (0.31 to 0.41), the camp 104 to 110 percent; the worst door overlap 0.05 (none under the phone).
- Pictures: records/four_layouts_10_27/<town>.jpg, four layouts each.
- Gate re-aimed: gates/the_town_fits_the_screen_gate.js T1 THE TOWN FILLS THE GLASS (four fifths covered, doors and keepers on
  the glass, none under the phone; the crowd may pass behind it), T5 the picture may run under the phone, nobody tappable does.

## STILL TRUE, FOR THE NEXT GO
The pictures are the same two compositions per town (COOK's tall 1024 x 1820 and wide 2060 x 1092); the four layouts are four
framings of them. Wide pictures are 1.89 wide to 1 tall while a phone on its side leaves 2.18 to 1 beside the phone, so four towns
step back on their side (Reds 82 percent, Anarchists and Blues 88). The full answer is COOK re-laying the wide compositions wider,
with the phone's column for each side kept clear (needs its Blender renderer, bpy, which this container does not have).
