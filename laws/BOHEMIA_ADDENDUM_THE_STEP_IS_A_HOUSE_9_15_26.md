# BOHEMIA ADDENDUM -- THE STEP IS A HOUSE (Paolo 9/15/26, LOCKED)
# His words, voice-to-text, verbatim in records/BOHEMIA_PAOLO_THE_STEP_IS_A_HOUSE_9_15_26.md.
# The short of it: "I just entered combat and this is not at the scale that I needed it
# to be... even when it comes to traversing the city I want people to be larger, cause
# remember each tile is the size of a house... implement it into combat too, right now
# it's not there. I want the player character and all characters' movements and enemies'
# movements to be larger at the same time. It would make travel faster too, in multiples:
# however long it takes right now to walk the length of a house, that would be done in one
# step. I don't know if you need a whole remodel of the grid movement and combat system,
# but I want it larger than it is right now."

## 1. THE RULING
ONE STEP IS ONE HOUSE. On the walked street, the player, every character and every enemy
move one lot per step. The fight board uses the same tile (the 9/4 law already said a
combat tile is a house; he entered a fight and it was not there). Bodies are drawn
LARGER, on the street and in the fight, at the same time. Time per step stays honest,
so travel across the city gets faster by the multiple.

## 2. WHAT IT OVERRIDES (newest date wins)
The BATTERIES AND A TILE IS A HOUSE law (9/4), section 5, first bullet: "THE WALKED
WORLD NEVER CHANGES SCALE... Walking stays person-scale, one small cell a step." DEAD.
The walk moves at house scale now. The rest of section 5 stands: the fight is entered by
camera, no hard cut, no arena, and THE CLOUD IS HIS; with one scale on both sides the
pull-back becomes small or none, and the cloud still passes across the turn so a fight
starting reads as weather moving over the block.

## 3. THE NUMBERS THAT ARE FIXED AND THE ONES THAT ARE MEASURED
- FIXED: 120 BPM, one step per beat, unchanged. A house is the city's lot cell (the
  overmap tile). EVERYTHING COSTS ONE. NO DAMAGE BEFORE THE DIAL.
- THE CLOCK PER STEP is what it takes to walk one lot at the walking speed the reach
  module already carries (about nine metres a minute); it is re-derived, never typed, so
  distance shown, the day, the jobs and the rent nights all stay true. Real-time
  traversal gets faster by the multiple; game-time distance does not change.
- THE BODY'S SIZE ON SCREEN is a default he corrects in play: a person stands about half
  a lot tall at walk zoom, the same body pixels the fight already draws at the swap
  (the 9/13 zoom verdict: the person crosses at one size). Realism is not the guide
  here; readability on a phone is, and that trade is his.
- ONE NUMBER IN ONE PLACE. The scale (fine cells per step, body pixels per lot) lives in
  one constant that the street, the fight, the bodies, the zoom seam and the reach
  module all read. NOTHING IS BAKED ONCE. A second copy anywhere is the bug.

## 4. IT IS NOT A REBUILD FROM THE GROUND UP
The art under the feet (kerbs, lanes, sidewalks, the 74 recooked tiles, the yard) stays
as art. What coarsens is the MOVEMENT LATTICE: a step lands on lot corners instead of
fine cells. The fight board already lives on lots. The bodies are the same sprites
drawn bigger (the cast bake at a larger size, or the same bake scaled, whichever
measures cleaner and cheaper on a phone; PLUMBER holds the fps budget). Each lane
MEASURES FIRST what a house is in today's cells, what a step is, what a body is, and
ships the smallest change that meets the ruling. A rebuild is refused unless the
measurement says the lattice cannot coarsen.

## 5. WHO DOES WHAT (one system, one session)
- RUN owns THE STEP: the walked movement, the one constant, the clock per step, the
  door and the zoom seam ([zoom meets] recomputes: the street's farthest-out and the
  city's closest-in meet at the new size).
- COMBAT owns the board: the same tile, the same body size, entry by camera with the
  cloud, the first fight at the new scale.
- CHARACTER owns the body: drawn at the ruled size on both surfaces; the twelve bodies
  and the ramps carry over.
- LIFE+CITY owns the lattice: what a lot is in fine cells, where a step may land, the
  city tap and the arrival point.
- ANIMATION: the rig at the new size, the clips unchanged in content.
- PLUMBER: fewer steps per screen is fewer draws; the fps number before and after.
- DIRECTION judges the street and the fight at the new scale against the world.
His asks beat the queue (rule 8). This is first in every lane it names, ahead of the
five-minute breaks that depend on it (the door, the first fight, the crowd), because
every one of those is built on the step.

## 6. HIS QUESTION, ANSWERED
"Does that make sense?" Yes. "Do you need a whole remodel?" No: coarsen the step, grow
the body, keep the art, one number, measured first.
