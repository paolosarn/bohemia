# BOHEMIA ADDENDUM — ONE ISOMETRIC VIEW, ZOOM IS THE CONTINUUM (Paolo 7/25/26, LOCKED)

## THE VISION (Paolo's words, 7/25)
"As you zoom out on your character then at some point it organically becomes the
city builder, and then if you keep zooming out you could see the rest of the
world." Plus: keep it all "on this diamond isometric 45 degree angle view."
And: "the only time I'll demolish and build shit is in the city builder [zoom]."

So it LOCKS: there is ONE view, the isometric 45-degree diamond. You do not
switch between separate maps — you ZOOM through one continuous camera:

- **Zoomed IN** — you ARE your character, walking the street (human scale).
- **Zoom OUT** — it organically becomes the CITY BUILDER: you look down over the
  plots and DEMOLISH / BUILD / BUILD BIG. This is the ONLY place building
  happens.
- **Zoom OUT further** — you see the rest of the world (the valley / beyond).

No second city map. No separate flat top-down tab. No separate iso tab. ONE
iso 45 view, three zoom bands of the same camera.

## WHAT THIS CORRECTS (my two wrong turns, same day)
1. I first read "top down only" as "the builder is a separate FLAT top-down
   surface" and wired the CITY tab to a standalone flat builder page
   (BOHEMIA_CITY_CURRENT.html). WRONG — that made a second city map, exactly
   what Paolo did not want. Reverted: the CITY tab is the ONE iso view again.
2. The build verbs do NOT get their own tab/page. They become a ZOOM LEVEL of
   the iso view (the zoomed-out "city" mode the iso app already has:
   MODE 'human' <-> 'city' via DROP IN / WHOLE MAP).

## BUILT 7/25: THE BUILDER IS NOW A ZOOM OF THE ISO VIEW
tools/bohemia_city_zoombuild_patch.py wires it into the ONE iso app (CITY_B64):
at the zoomed-out CITY zoom you tap any plot and get DEMOLISH TO DESERT / BUILD
/ BUILD BIG 2x2, right there in the diamond 45 view. No second map.
- VERBS: engine/bohemia_cityedit.js inlined VERBATIM (the canon delta engine
  already used by the rest of the build) - skeleton stays sacred, only canon
  districts placeable, 4-lot big buildings demolish as one mass.
- THE ONE SEAM: om.at(x,y) is what EVERY consumer reads (the city overview AND
  tileMeta -> realizeCell -> the fine-grain walked streets), so wrapping it means
  an edit is true at EVERY zoom, with no second copy of the world. The tile/chunk
  caches clear on an edit so the walked streets regenerate from the edited plot.
- TAP PICKING is the exact inverse of the iso projection; a drag or a pinch is
  never mistaken for a tap. Edits persist device-local; a REROLL (new valley)
  resets them.
- VERIFIED ON THE REAL SURFACE (headless, real pointer taps): the tap picked the
  intended plot exactly, DEMOLISH took a strip plot to desert, BUILD placed
  commercial, and a demolished pocket of resort/suburb buildings VISIBLY cleared
  to bare desert in the rendered pixels (before/after diff isolated to that
  block). Gate: gates/zoombuild_gate.py (24 checks), registered as ZOOM BUILD.
STILL TO COME: the third zoom band (keep zooming out to see the rest of the
world) - that touches the MAP surface (another lane), so coordinate, don't jam.

## THE ORIGINAL STANDING BUILD (superseded by the section above)
The iso view (CITY_B64, the alpha's CITY tab) already has the character<->city
zoom (MODE 'human' vs 'city', grid-based cells drawn as 45 tiles, pan + pinch
zoom). WHAT IS MISSING and must be built INTO its zoomed-out city mode:
- tap a plot (city mode) -> DEMOLISH to desert / BUILD a district / BUILD BIG,
  driven by the existing delta engine engine/bohemia_cityedit.js (reuse the
  ENGINE, inline it into the iso app; the standalone flat page stays dormant).
- the city render resolves each cell through the delta so edits show live.
- edits persist device-local (localStorage), same as the flat builder did.
- the third zoom band (the world) is a later step and touches the MAP surface
  (another lane) — coordinate, do not jam.

## SUPERSEDES
- Replaces this file's own earlier "separate top-down surface / CITY tab loads
  the flat builder" framing (same day, superseded by Paolo's zoom-continuum
  description).
- Supersedes the 7/19 hijack-lock's tab assignment only in intent; its real
  lesson (keep the CITY boot DYNAMIC, never a static cityFrame) is kept.
- District search (the MAP tab FIND) is explicitly expendable per Paolo ("I
  don't give a fuck if I lose a district search, you can just rebuild it").
