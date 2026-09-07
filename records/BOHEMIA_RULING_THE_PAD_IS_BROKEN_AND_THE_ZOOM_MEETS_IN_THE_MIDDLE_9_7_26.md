# THE PAD IS BROKEN, AND THE ZOOM MEETS IN THE MIDDLE (Paolo 9/7/26, LOCKED, from a frame he played)
# "The action button is fucked up now." / "When I zoom out and it goes into city mode, I
# want to be at the same scale of the zoom out. From the actual character on the street I
# want to be able to zoom out a little more, and when it goes into the city builder I want
# to be able to zoom in a little more. They gotta meet exactly in the middle where it's
# the same scale. Does that make sense?"
# The frame: records/target/PAOLO_THE_PAD_IS_BROKEN_9_7_26.jpg

## 1. THE PAD IS BROKEN AND IT IS A REGRESSION FROM THE HALF-SIZE WORK
What the frame shows: seven arrow buttons scattered in no ring, two of them pointing
the same way, one arrow sitting where the face used to be, and the face -- which IS the
action button -- shoved into the bottom-right corner in its own box, half off the pad.
Before [half size] the pad was a ring of four arrows around the face. The "spread so a
thumb fits" option was right about reach and wrong about shape: spreading the ring
broke the ring.
- THE PAD IS A RING. Four arrows, one per direction, around the face in the centre.
  Spread means the ring gets a bigger radius, not that its pieces leave the ring.
- THE FACE IS THE ACTION BUTTON and it lives in the centre of the ring. Nothing
  displaces it. (It already calls people by name; that is why it is a face.)
- Half size is still his order. Half the pixels, 44 px reach, one ring.
- A gate: exactly four direction controls, one each way, the face inside the ring,
  no control overlapping another, on a phone viewport.

## 2. THE ZOOM MEETS IN THE MIDDLE
He is describing one continuous scale with a handoff, not two screens with a jump:
- **From the street you can zoom out a little more** than the body-scale view.
- **From the city builder you can zoom in a little more** than the city-scale view.
- **They meet at exactly the same scale.** The street view's farthest zoom-out equals
  the city view's closest zoom-in: one number. The switch between the two renderers
  happens AT that number, so a tile, a house and a body are the same size on both
  sides of the switch, and nothing on screen changes size when it happens.
This is the 7/1 two-scale camera lock ("seamless, as fast as Pocket City 2's drop-in")
made exact: seamless means equal scale at the handoff, and it is measurable.
- A gate: at the handoff, the pixel size of one house tile measured in the street
  renderer and in the city renderer are equal, both directions.

## ROUTED
- UI [pad broken]: top of UI, above everything, including [half size] which it fixes.
- RUN [zoom meets]: top of RUN with [first world]; the one-number handoff.
- PLUMBER [scale gate]: the equal-size check at the switch, both directions.
