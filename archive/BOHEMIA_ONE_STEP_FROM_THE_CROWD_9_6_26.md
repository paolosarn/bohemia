# ONE STEP FROM THE CROWD (CHARACTER, 9/6/26 — VAMILY [stands out])

A hostile on the walked street now stands ONE VALUE STEP away from the bodies
around him. Light in a dark crowd, dark in a light one, measured against the
people actually near him in the frame — not against a palette, and not by
wearing a colour.

Evidence pair: `records/target/CHARACTER_ONE_STEP_FROM_THE_CROWD_9_6_26.png`
(left: before, right: after — the same frame, the same crowd, the same one
enemy in it).

## THE ROW CORRECTS A FIX WE WERE ABOUT TO SHIP
DIRECTION judged the hostiles (records/BOHEMIA_VERDICT_THE_HOSTILES_LOOK_9_6_26.md)
and answered NO to all three of its own questions: they ARE the crowd. Its fix
was "a hostile wears its faction's accent." The board answered:

> in a Cartel block full of Cartel people that is exactly what makes a hostile
> INVISIBLE. Pop-out comes from FEATURE CONTRAST, not the feature.

That correction is the whole job. A feature only pops when it DIFFERS from its
surroundings; a red shirt in a room of red shirts is camouflage.

## WHAT WAS MEASURED FIRST (records/BOHEMIA_CAN_YOU_PICK_HIM_OUT_9_6_26.txt)

**DOES A BODY LOOK ANY DIFFERENT ONCE IT IS YOUR ENEMY? NO. ZERO OF 172.**

Same crowd swept before and after they turned hostile, the same facing asked
both times, every body matched to itself by id. Not one moved by a thousandth
of a shade — while a null control spanning real time shows those same bodies
drifting up to 3.13 shades on their own.

The code says the same, so it is not one crowd's accident: `ctBody()` asks
`ctFactionOf()` then `ctFitIndex()` — faction, else trade, else id — and
`ctAgainstMe` is called in exactly four places in the walked city, none of them
the appearance path. **The value channel carried no information about who is
dangerous, because nothing was asking.**

## THREE MEASURED FACTS THAT DECIDED THE BUILD, rather than taste
1. **The crowd is quantised** — 24 distinct body values behind 172 people,
   because the cast is a small set of baked bodies many people share. So the
   step cannot be baked into a sprite; it is applied **per body at draw time**.
2. **Bodies already sit a median 6.6 shades from their own neighbours** (worst
   34.6) inside a crowd spanning 37.3. A step smaller than that is inside the
   noise the crowd already carries and reads as another body, not a warning.
3. **Nobody on the walked street has a faction** — 172 of 172 answer none — so
   a fix keyed on faction membership would do nothing at all today.

## WHAT SHIPPED
In `peoplePass` (slices/BOHEMIA_CITY_WORLD.html):
- **Gather, then draw.** The pass used to draw as it walked the neighbourhoods.
  A step measured against the bodies *around* a person cannot be computed until
  everyone near them is resolved, so it now resolves every visible body first
  and blits in a second pass. Same list, same order, same bookkeeping.
- **The crowd is the CIVILIANS near him.** Other hostiles are excluded: two
  enemies standing together would otherwise cancel each other out, which is the
  case where being seen matters most.
- **No near civilians, no step.** A lone figure on an empty street is already
  the only thing to look at; shifting him there would be a badge, not contrast.
- **The direction is the crowd's, not the body's** — against a dark crowd there
  is room above and none below, so he goes light; against a light one, dark.
- No health bar, no floating name, no outline, no badge. Alpha is never
  touched, so the silhouette cannot move by a pixel (RIG LAW).

## THE NUMBER IS NOT MINE
`CT_STEP.delta` defaults to **14 shades** — a little over twice the 6.6 the
crowd already carries by accident, so it cannot be read as one more body.
It is set to beat a measured floor rather than chosen by eye, and it reads from
DIRECTION's style card the moment that card carries `hostile_value_step`.
DIRECTION's **[contrast rule]** row owns the magnitude and is still open.
MECHANISM-MINE / CONTENTS-PAOLO'S.

## THE SHIP TEST, AND HOW THE MIXED CROWD WAS EARNED
The first measurement round could not ask "does a hostile stand out from
civilians", because the probe's deed turned **all 172 hostile at once** — every
body on the glass witnessed it, so there were no civilians left to stand out
from.

Hostility here is personal and witness-based, so the crowd is mixed by standing
at the **edge** of it when the deed happens: only who is on the glass turns.
Measured: **88 hostile, 83 civilian, 171 on the glass, one frame.**

    hostile distance from the crowd near him, BEFORE   median  7.6 shades
    an ORDINARY CIVILIAN's distance, same measure       median  8.4 shades
    hostile distance AFTER                              median 14.0 shades

Before the change a hostile sat *closer* to his neighbours than an average
civilian did — which is the defect stated as a number.

31 of the 88 had no civilian within reach and correctly take no step.

Perf, same frame, 171 bodies: **5.1 ms/render before, 5.2 ms after.** The luma
read and the shifted body are both cached per sprite, so a crowd of 171 costs
about 24 reads, not 171.

## ONE THING I GOT WRONG AND LOOKING AT IT IS WHAT CAUGHT IT
The first version composited **white or black** over the body at an alpha solved
for the target. It hit the number exactly and looked wrong: white over a dun
body pulls the channels toward each other, so it drains the colour as it
lightens and a hostile came out **milky** — a pale person rather than a lit one,
in a valley whose whole register is dust and ash. A fight with COLOUR IS
TERRITORY (8/26), invisible to the measurement, since the target luma was
correct in both versions.

It now **multiplies every channel by the same factor**, which moves the value
and leaves the hue exactly where it was. That is what a painter means by a value
step. THE NUMBER WAS RIGHT AND THE PICTURE WAS WRONG; only rendering the street
and looking at it found that.

## HONESTLY, WHAT IT LOOKS LIKE
At the default 14, with ONE enemy in a dense frame at phone size, the read is
**present but quiet** — the crop pair shows his top lifting clearly when you
know where to look, less so when you do not. That is a magnitude question, and
the magnitude is DIRECTION's ([contrast rule], open); the mechanism now exists
for a number to be set on. If the card asks for more, the only thing that
changes is one field.

## NOT DONE, SAID PLAINLY
- The separate `__THERE_ARE_ENEMIES__` pass draws its own bodies alongside the
  people and was **not** touched. Whether those need the same step is a
  different question and it is not this row's.
- The step is applied on the walked street. The DEMO is cut from the same file,
  so it carries it; the alpha reaches this surface through the city frame.
