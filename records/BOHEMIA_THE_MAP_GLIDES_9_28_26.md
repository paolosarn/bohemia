# THE MAP GLIDES (ANIMATION, [glide] round one, 9/28/26)

## HIS WORDS (9/27, in the tab, up on animation-how-you-cross-the-map-9-27; rule 37h)
"I would like the Animation movement to be very very smooth. I don't want to see move like a
block at a time you know like boom boom boom boom I just wanted to glide very nicely even if
Animation is playing within the thing that's sliding... the Animation would still play to the
BPM of the music and just slides."

## MEASURED BEFORE, ON THE REAL MAP, WITH THE GAME'S OWN CLOCK DRIVEN
The map's camera and the YOU pin were both read straight off the integer cell (city.x/city.y).
    one step        the camera moved 18 px on ONE frame of 36, then held
    two steps       half a beat apart: two jumps, up to 10.3 px each
That is the block he described, exactly.

## WHAT CHANGED (slices/BOHEMIA_CITY_WORLD.html, __THE_MAP_GLIDES__)
- What is DRAWN eases from where it was to where he is over ONE BEAT (500 ms), linear, so steps
  taken back to back chain into one constant speed.
- A new step mid-glide starts from where the picture IS, never from the old cell, so a press
  in the middle of a slide cannot snap.
- The pin HOPS once per beat while it travels (sin over the glide's own beat, so the hop lands
  when the step does) and sits still when it stops: the BPM inside the slide.
- A jump of more than two cells (landing, a ride, a load) SNAPS. Gliding across half the valley
  would lie about how he got there.
- city.x / city.y are NOT touched. Every rule that asks where he is still gets the whole cell
  on the step itself; only the picture moves between cells.
- The camera stays whole-pixel (the PIXEL FIX stands); the glide shows up as 1 px moves on most
  frames rather than one 18 px move on one.
- The city otherwise redraws only on the beat, so a glide drawn twice a second would be the
  block again: while a glide is in flight it asks for the next frame itself.

## MEASURED AFTER
    one step        the camera moves on 14-18 of 36 frames, never more than 1 px a frame,
                    and is still by frame 30 (it arrives on the beat, not a crawl)
    two steps       one slide, never more than 1 px a frame (was 10.3)
    the pin         hops 2 px at the default zoom, 0 at rest
    a far landing   121 px on the first frame, 0 after: a cut, as intended

## THIS LANE'S OWN EARLIER CALL WAS THE OPPOSITE
Round one of [bb marker] picked B, "one lot per beat", and argued from the 120 BPM law that
continuous travel would break it. He voted that page UP and said glide, and his version keeps
the law: the BPM lives in the hop inside the slide, not in the position. The gate
MARKER ON BEAT still describes that page's two options honestly (B stops at the beat, A does
not) and stays as the record of what he was shown; THE MAP GLIDES holds the game.

## [bb glide] THE SCHOOL LINE (rule 33f)
Battle Brothers moves its party marker in continuous real time and pauses the world instead of
stepping it (reference/library/battle_brothers/01_WORLDMAP.md; this lane's own school page
records/BOHEMIA_BB_SCHOOL_HOW_THE_MARKER_TRAVELS_9_27_26.md). What its marker never does is
jump. His ruling takes that half of BB and keeps the half that is ours: the beat. So the map now
moves the way BB's does, and the 120 BPM that BB has no equivalent of rides inside it as the
hop. FINDING THAT PROVES US WRONG: last round's school page concluded the beat had to govern
POSITION; it only has to govern the ANIMATION. The page is right about BB and was wrong about
what the law asks.

## NOT IN THIS ROUND, SAID PLAINLY
- The walked street body already slides (SLIDE, his 9/21 vote; 31 of 60 frames move), and rule
  38b makes walking the city dead anyway.
- The fight board is COMBAT's; the same rule applies to its movers and is theirs to build.
- Tap-to-travel along a route is RUN's (38c). When it moves city.x one cell at a time, it will
  glide through this for free; if it moves several cells at once, that is a far jump and cuts.

## PROOF
gates/the_map_glides_gate.js (MAP GLIDES), 11 claims, 4 mutations caught: no glide (the file
as it was), no far snap, a crawl of four beats, no hop. Two controls: the rule position
changes on the step itself, and the step moves the map a real distance, because a map that
never moved would pass every "never in a block" claim by standing still.
VOTE: animation-the-map-glides-9-28, both strips filmed off the game's map, two steps each.

## ANALOG HORROR LINE (rule 30)
A map that jumps a whole block and freezes is a slideshow; a map that slides and then holds
perfectly still at the end of each beat is a tape being played. The hop is the only thing that
moves when he moves, which is what makes it his.
