# BOHEMIA ADDENDUM — THE THREE-TILE WALL AND THE SEE-THROUGH (Paolo 7/27/26, LOCKED)

> "Bro, every wall supporting a door should be three tiles tall you know that's
>  what I'm trying to tell you like this game needs to focus on like working on
>  an opacity filter for when I'm in front of a wall or something you know like
>  not good enough by any means"

Two rulings in one sentence, and they are the same ruling.

---

## THE LAW

**1. A WALL THAT CARRIES A DOOR IS THREE TILES TALL.** Not one. A building's
front face rises out of its own cell and covers the two cells above it. This is
the 45 DEGREE ART LAW arriving at the world grid: a structure is a ¾ front face
with real height, not a floor tile with a wall pattern printed on it. A door is
TWO of those three tiles (DOOR LAW), which is the real proportion — a ~2m door
in a ~3m wall. A window belongs UP the wall, at the middle tile, not lying on
the ground.

**2. A WALL THAT IS COVERING THE PLAYER GOES SEE-THROUGH.** The moment walls have
height they can stand between the camera and the character, and a game where you
lose yourself behind your own scenery is broken. So a facade in front of him
whose three-tile box overlaps his sprite drops to 35% opacity. Only that one.
Only while it covers him. A filter that is always on is not a filter, it is a
bug — and a world that shimmers as you walk is worse than one that hides you.

**3. THEY SHIP TOGETHER, ALWAYS.** Height without the see-through is a game that
hides the player. See-through without height is a filter with nothing to filter.
Anyone adding a new structure kind adds both or neither.

---

## WHY IT COULD NOT BE A TEXTURE CHANGE

The world bakes each 16x16-cell chunk into an offscreen canvas once, and a
facade was ONE flat cell inside it — a house front exactly as tall as the ground
it stood on. Three tiles tall means drawing into the two cells above, which
belong to other rows and sometimes to other chunks. And the opacity depends on
where the player is standing THIS FRAME, which a bake by definition cannot know.

So facades leave the bake and become a live pass, drawn in two halves around the
player. That draw order IS the feature:

1. baked ground and roofs blit
2. facades BEHIND him (row < his row) at full opacity
3. the player
4. facades IN FRONT of him (row >= his row) last, faded where they cover him

## THE DOOR IS TALL WITHOUT BEING STRETCHED

The approved door art is a 16x16 tile and the slot is one cell wide by two tall.
As a single draw that is an aspect change — the exact thing the MOBILE RENDER
CONTRACT bans and `render_pixel_gate.js` measures. So the tall door is DERIVED
ONCE into a cached 16x32 canvas and blitted at 1:1 aspect forever after. One
stretch, in a cache, never in a frame. A law is not allowed to break another law
to get itself implemented.

## THE GATE

`gates/wallheight_gate.js` — patches drawImage before the app boots and renders
two REAL frames: one with the player behind a door, one with him walked clear of
every facade. It reads back the destination size AND the alpha of every draw,
which a normal draw audit cannot see. It asserts the height, asserts the door is
one cell wide by two tall, asserts no facade draw is off its source aspect, and
asserts the fade fires in the first frame and **does not fire** in the second.
Both directions, because only checking that it turns on would pass a filter that
never turns off.

## WHAT THIS DOES NOT DO

It does not touch a pixel of art. Every tile it draws is his own 7/21 house
verdict (`records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt`, all 30 UP). "Not good
enough by any means" was said about the result, and the result is now taller and
see-through — the materials are unchanged and remain his to rule on.
