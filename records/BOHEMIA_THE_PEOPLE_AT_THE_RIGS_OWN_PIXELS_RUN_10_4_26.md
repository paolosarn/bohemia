# THE PEOPLE AT THE RIG'S OWN PIXELS (RUN, 10/4/26, [map pixels now], rule 65 (a))

> Rule 65 (a): "the map at the phone's real pixels, everything drawn 1:1 from its art."

## MEASURED FIRST
The rig renders a body at 112 x 112. The shell's bake halved it to 56 (`CAST_PX`; its own note
measured that this keeps 25% of the body's pixels). The map then drew it 37 CSS px tall, which is
112 device px on his phone, so every person on the map was a 56-px body doubled back up. The towns
are drawn from 256-px art (more than 1:1) and the blocks are 1:1 at the near stop. The people were
the one thing left drawn bigger than their art.

## NOW
- **`CAST_PX` is 112:** the one edit the bake's note promised. The frame ships as the rig renders
  it, so the halving step is gone.
- **The city's ladder (`spriteAt`) is size-aware:** the same 56-px boxes from a body of either
  size. At 112 the 2x rung is the rig's real pixels instead of EPX's guess.
- **The map draws a person at the same size as before**, now 112 art px on 112 device px: one to
  one.
- **He is drawn from his 112 box at half,** the same 56 CSS on the glass, so 112 px of art on 168
  device px. Rule 21 sizes him, and that ratio is said, not judged.

## CHECKS
- **THE FAR END IS PAINTED** gains F12, 11/0: the people are x1.00. Mutation `CAST_PX` 56: x2.00,
  red.
- **THE ONE THAT IS YOU** A2 and **THE FACE ON THE MAP IS HIS** A1 read the source for
  `spriteAt(__spr,24)`. They now accept the fixed 32 rung, and their claim is unchanged: his own
  rig, one size, never following the zoom. Results: 5/0, and 17/1, where the 1 is main's known A2.
- **Twenty body checks against main:** all the same, except CITY CAST SILHOUETTE, 5/1 on main and
  6/0 here.
