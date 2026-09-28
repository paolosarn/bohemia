# GRAVEYARD -- THE SMALL BODY DOWNSCALE
# POST-MORTEM. CHARACTER lane, [small body]. 9/28/26.
# (laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s1, "NO ATARI": "the 32 px cell and the
#  28 px one-cell sprite are DEAD as defaults.")

## HIS RULING, VERBATIM

On the neighbouring item (`animation-he-walks-at-one-cell-9-27`), DOWN, transcribed and
deciphered in records/BOHEMIA_PAOLO_THIRD_VOTES_9_28_26.md:

> "I don't wanna treat a whole new character... why can't it just be the same character...
> the details and pixels" (garbled voice-to-text, coordinator's reading).

And from the same batch, on the map and its markers: "we cannot be obsessed with making
things eight pixels tall... add more pixels to all the squares so it reads like an actual
map instead of some Atari bullshit." The coordinator's own correction, in the law:

> "THE COORDINATOR READ 'TINY' AS FEW PIXELS. WRONG. Tiny means SMALL RELATIVE TO
> BUILDINGS; the pixel detail stays at the level of the zoomed-in roaming art we already
> made."

No verdict landed on this lane's own item (`character-the-one-cell-sprite-9-27`) directly --
it had not been opened when he voted. It is graveyarded anyway, because the RULE that
authored it is dead, not because he tapped this specific card. Waiting for a redundant
per-item down when the default it answers to has already been killed is the kind of
staleness this board exists to avoid.

## WHAT IS DEAD, EXACTLY

The premise of rule 34 section 4 (TWO SCALES, ONE GAME, 9/27): the walked person is ONE
CELL, about 28 px tall on a 32 px cell, and the 112 px body becomes source art only. Rule
37a supersedes it outright: **the 32 px cell and the 28 px one-cell sprite are DEAD as
defaults.** "Tiny" was never about pixel count; it meant small NEXT TO BUILDINGS, at the
SAME pixel detail the roaming art already has.

Two rounds of this lane's own work built on the dead premise:

1. **9/27, THE ONE CELL SPRITE**, first pass. A block-majority downscale of the game's own
   112 px render to 32x32, plus a mechanical rim shade replacing the outline the downscale
   erased.
2. **9/28, the same tool, revised.** A palette-collapse pass on top of the downscale,
   reducing every body to skin plus at most three cloth tones (one value split, one
   accent), because DIRECTION's own [two scales look] card asked for exactly that shape at
   28 px. Measured honestly, refused-to-write guards added, shipped.

Both are dead as the walked sprite. Item 2 answered a real, numbered spec DIRECTION
actually published the same round -- it was not a wasted motion against nothing -- but the
spec itself sat on top of the now-dead 28 px default, so its floor is gone too.

## WHY IT WAS BUILT, SO THE MISTAKE IS LEGIBLE

Rule 34 was LOCKED the round before this one, with the coordinator's own handoff naming
`[small body]` as this lane's FIRST LINE under it. Blind spot 4 then asked DIRECTION to
judge the first sprite before a second was drawn, and DIRECTION answered with a real,
numbered floor spec (SILHOUETTE + ONE VALUE SPLIT + ONE ACCENT, real ground) inside the
same round. Building the palette collapse against that spec was the correct response to
the information that existed at the time it was built. The information changed under it
within the same day, before this lane's own commit reached main.

**THE ROOT CAUSE WAS NEVER A DRAWING CHOICE. IT WAS A WORD.** "Tiny" was read by the
coordinator as a pixel count, and the whole grid rebuild -- WORLD's cell work, COOK's tile
cuts, ANIMATION's walk-at-one-cell, DIRECTION's floor spec, this lane's two rounds of
downscaling -- was built downstream of that one misreading. A LOCKED law with a wrong
premise still produces correctly-executed work; correct execution of a wrong premise is
still wrong, and only he could have caught which one it was, because "tiny" is his word
and only he knows what he meant by it.

## WHAT IS NOT DEAD, AND THE DISTINCTION MATTERS

- **The measurement METHODOLOGY survives, even though the default it was built for does
  not.** The silhouette-distinctness ruler (the 16-sample front width profile, reused from
  the runway fit search), the hue-identity check (the same 30-degree buckets
  faction_colour_gate uses), and the "does it disappear against real ground" contrast test
  are all general techniques for judging whether a simplified sprite still reads. If a
  future round needs to simplify art at SOME smaller scale (a map marker, a settlement
  screen icon), the method is proven and sitting in
  `tools/bohemia_cook_the_one_cell_sprite.js` to be pointed at a different target size.
- **0.75 m per cell stands** (DIRECTION's ruling f739e36, "THE CELL IS THE STEP"), as the
  WORLD UNIT. That is a real-world distance, not a pixel count, and rule 37 section 16 says
  plainly the two are different numbers: the world unit is ruled, the pixel size is his,
  from options WORLD and COOK have not shown him yet.
- **The block-majority downscale function itself (`downscale()`) is not proven wrong** --
  it was never judged, because the thing it fed (a 28 px final size) is what died. It is
  general-purpose and would work at any target size.

## WHAT THIS LANE DOES DIFFERENTLY FROM HERE

1. **[small body] is RE-AIMED, not closed**, per rule 37 section 15: "the same character at
   full detail, scaled to the grid the options decide." There is nothing to build against
   that instruction yet, because the grid's pixel-per-cell size is explicitly his pick from
   WORLD + COOK's `[tile options]` round, which has not landed. Building a guess at a pixel
   size now would be the exact STOP PRODUCING tell this lane has been burned by before:
   writing a version of something before the thing it depends on exists.
2. **The existing 112 px body is very likely already most of the answer.** "The same
   character at full detail" describes the body this lane has shipped since the wardrobe
   remake -- it may need no new pixels drawn once a cell's pixel size is chosen, only a
   scale factor. That is worth saying so the next round does not rebuild what already
   exists.
3. **A registry item that answers a dead default gets corrected in place, not left to
   mislead a future reader of the queue.** `character-the-one-cell-sprite-9-27`'s `why`
   field is updated to say so; the item is not deleted (VOTE items are the board's history,
   the same as a VAMILY.md line), but it no longer reads as a live pitch.
