# THROUGH CLOUDS, AND THE NEAR STOP (RUN, 10/2/26, [map pixels now], rule 67 s3)

> **PAOLO 10/2 (the sixth votes):** *"the zoom into a fight goes through clouds as the loading screen
> again"*; *"got to be able to zoom tf in so much and out all the way."*

## THE CLOUDS (`__THE_ZOOM_GOES_THROUGH_CLOUDS__`, the shell)
**Measured first:** the door opened the rebuilt fight about 1.0 s after the bell. Its ground then
took another 1.7 s to build, shown as the fight's own plain loading line.

**Now the clouds are the loading screen.**
- **Three layers of pixel cloud,** drawn once at a quarter of the screen's pixels: a solid dusk
  floor, then two layers of billows lit on top and dark beneath, in the valley's dust and ash.
- **The compositor moves them.** CSS transforms carry them, because the fight builds on the same
  thread and frame-drawn clouds would freeze right when they are needed.
- **The timing:** they roll in at the door (up within 280 ms), hold until the fight's ground is
  built (never less than a beat), then part on two beats.
- **Going home:** they close over the fight's card in its last beat, he lands on the map under them,
  and they part over it.

## THE NEAR STOP (`__THE_NEAR_STOP_IS_THE_ART_AT_ITS_OWN_PIXELS__`, the city file)
**Measured first:** the closest map stop was 2.6. There a block is 47 CSS px, so its 256-px building
art showed at about half its own pixels on his 3x phone.

**Now the near stop is where that art lands one art pixel to one device pixel:** a block is
256 / ratio CSS px, which is 85 on his phone (stop 4.74). The ground picture's margin is capped at
220 px; at the near stop TW*4 would have made the picture 14 million px. Measured at the near stop:
a fresh paint takes 90 ms, and the picture is 2454 x 3810.

**Seen at the near stop and NOT this lane's art:** a large purple shape (the existing marker,
present at the old stop too, now larger) and black arcs where the freeways cross (the overpass and
interchange strokes scale with the block). They are named here for whoever owns those draws.

## CHECKS
- **THE ZOOM GOES THROUGH CLOUDS**, new, 8/0, registered slow. Mutations, each red: no clouds at
  the door; the clouds parting before the fight is built; no clouds on the way home.
- **THE FAR END IS PAINTED** gains F11: at the near stop a block is 256 device px for 256 px of
  art, and the ground picture is under the 16-million-pixel canvas limit.
