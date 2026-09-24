# THE PHONE IS A CRACKED IPHONE
UI lane (chat 11), 9/24/26. Row [phone city only], round two. Rule 32c.

## HIS WORDS
"YOU ONLY SEE THE PHONE WHEN ITS UR ZOOMED OUT TO THE WHOLE CITY VIEW not when its the
human close shit bro. And the phone should look like a cracked iphone bro"
(9/23 in the VOTE tab, thumb DOWN on ui-the-phone-in-your-pocket-9-23.)

The first half landed last round: no phone on the walked street. This is the second half.

## WHAT THE OLD OBJECT MEASURED, BEFORE ANYTHING WAS TOUCHED
    132 x 349      a ratio of 2.65
    5 px of moulded case on every side
    a 13 px corner
    A STRIP OF TAPE across the top, rotated 1.4 degrees
That is a rugged radio, and it was RIGHT for the round that built it: it answered his 9/8
frame, "this doesn't look like a cool post-economic-apocalyptic phone". His newer word is
a different object, and newest date wins.

## WHAT A PHONE IS, AND WHAT EACH ONE CHANGED
    the shape     19.5 by 9, a ratio of 2.167, not 2.65 -> 132 x 286
    the body      a THIN BRIGHT RAIL, not a moulded case -> 5 px to 3 px, and the paint
                  goes from a flat plastic gradient to a turned metal band, bright at the
                  edges and dark in the middle, which is what a rail does under one light
    the corner    about a seventh of the width -> 13 px to 19 px
    the glass     edge to edge inside the rail, 16 px radius, near black
    the island    a black cut-out in the middle of the status row. That ONE SHAPE is most
                  of why a rectangle reads as a phone rather than as a screen
    the wear      the tape is deleted; the rail is CHIPPED, which is the wear he actually
                  asked to keep ("the phone keeps the chipping and broken glass", 9/21)
    the crack     unchanged, his, and still one drawn fracture

## THREE THINGS THE PICTURE TAUGHT ME THAT THE CODE DID NOT
1. *** A RATIO IS A HEIGHT, NOT A WISH. *** `aspect-ratio: 9 / 19.5` measured 132 x 564, a
   ratio of 4.27, because aspect-ratio is a PREFERRED size and the feed's own posts pushed
   the box straight past it. The height is computed from the width now, so a skin that
   widens the phone keeps the phone's proportions, and the glass clips what does not fit,
   which is what a screen does.
2. *** THE ISLAND LANDED ON TOP OF THE NAME. *** The status row ran signal, name, battery,
   clock straight across the middle, and the picture read "THE [black pill] 06:00". A
   phone's row is the hour on the LEFT, the island in the MIDDLE, signal and battery on the
   RIGHT. Reordered with CSS only, so the reading order a screen reader gets is untouched.
3. *** AND THE ONE THING THE SHAPE COSTS, said rather than hidden: THE PLACE NAME COMES
   OFF THE ROW. *** The island spans the middle 36 px of 126 px of glass and the hour takes
   the left 30; there is no room for a word between them, and a phone with a notch does not
   put the carrier beside the clock either. The element stays in the markup so anything
   that writes to it still has somewhere to write, and the place he is standing in is on
   the game's own top bar two centimetres away.

## HOW BROKEN IS HIS, AND BOTH ANSWERS ARE ONE FRACTURE
Two options in the VOTE tab, photographed from the game's camera in one run with nothing
different but the class the glass carries:
  A  one spider from the top right corner, which is what a dropped phone looks like
  B  wrecked: a second impact from the opposite corner
THE SECOND IMPACT IS THE FIRST ONE CLONED AND FLIPPED, never a second shape drawn by hand.
A phone with two different-looking cracks on it is two phones. A ships as the default
because that is what "a cracked iPhone" means in the world; B is one word away.

## THE GATE
gates/phone_object_gate.js, this lane's own from 9/11, 22 ok / 0 failed.
TWO OF ITS LEGS HELD THE OLD OBJECT AND WERE TURNED ROUND WITH THE RULING, which is worth
being exact about because the difference between that and loosening a gate is the whole
argument:
  - "every side of the body measures at least 4px" was written about a moulded case. An
    iPhone's band is thin; a 4 px rail at this size is a case again. The floor comes down
    to 2 px AND the leg under it is NEW and tighter: the object must have a phone's RATIO
    (2.167, not the 2.65 slot), a phone's CORNER (about a seventh of the width) and an
    ISLAND cut out of the glass. The old leg could be passed by a brick; these cannot.
  - "there is tape on it" is now "there is NO tape on it, because it is a phone", and the
    wear he asked to keep is held instead: THE RAIL IS CHIPPED.

*** AND ONE LEG OF MINE WAS MEASURING THE THING SITTING ON TOP OF WHAT IT ASKED ABOUT. ***
The skin leg reads the body's border colour and expects a skin change to repaint it. It
came back the same gold before and after and called a working skin broken. The unread RING
sets border-color itself, so on any run where the morning is unread the ring was answering
for the skin. The ring is the phone's STATE, not its paint: it comes off for the
measurement and goes back on after. This is the same defect class as the loading screen the
whole fleet was measuring through, one element smaller.

SEVEN MUTATIONS PROVED AND EACH RESTORED:
  put the radio proportions back (the 2.65 slot)        -> 1 red
  flatten the rail to a line                            -> 2 red
  take the island out of the glass                      -> 1 red
  take the chipping off the rail                        -> 1 red
  tape it shut again                                    -> 1 red
  square the corner off                                 -> 1 red  (see below)
  make it as wide as it is tall                         -> 1 red

*** AND THE CORNER MUTATION PASSED THE FIRST TIME, WHICH IS THE ONE WORTH WRITING DOWN. ***
Squaring the corner scored 22 ok / 0 failed, and for about a minute that looked like a hole
in the leg. It was not: the CSS carries the corner as var(--skin-round, 19px) AND THE SKIN
SETS --skin-round, so editing the fallback edits a value nothing reads. THE MUTATION NEVER
MOVED A PIXEL. Changed at the skin, where the value lives, it reds immediately. This lane
has now been caught by the same shape three times -- a stress that could not move the type,
a route that matched no request, a mutation that edited a dead default -- so the rule it
keeps re-learning is written here plainly: PROVE THE BREAK BROKE SOMETHING BEFORE SCORING
WHAT THE GATE SAID ABOUT IT.

## THE ANALOG HORROR LINE (rule 9 of the law, every chat, every round)
The most familiar object anyone alive has held, in a valley where the network has been dead
for years, still lit, still keeping perfect time, with somebody else's town gossip scrolling
up it behind a crack nobody has fixed. The wrong thing is not on the phone. It is that the
phone still works.
