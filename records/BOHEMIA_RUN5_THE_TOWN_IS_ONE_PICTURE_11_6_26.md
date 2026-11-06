# THE TOWN IS ONE PICTURE (RUN FIVE, 11/6/26; VAMILY rule 383, ask line 414; NOW by rule 404 amended, ask line 447; rule 411)

## HIS WORDS
11/3, with his screenshot of NETWORK (records/target/coordinator_11_3/network_the_cut_for_the_phone.png): "the straight line cutting
off bullshit, it looks so bad just to optimize for the phone, you got to be smarter than this, all settlement maps probably have this
issue, it's not looking organic... a circular object... cut in half... just for the phone". 11/4: "I don't like any cheap alternative
ways you've tried to do the UI with the settlement, it took you like three days to stop fucking that up and it still looks like ass
for some settlements".

## MEASURED BEFORE (11/6, the demo, all fourteen towns, the phone upright 390 x 844 and on its side 844 x 390, both sides)
- HIS SCREENSHOT IS THE SIDEWAYS PHONE. On its side the screen fitted the 2060 x 1092 town to the glass LESS the phone's strip
  (frameFit's R; Network s 0.344, the town 708 of 844 points) and drew padGround: a 120 px square of the picture's own open ground,
  mirrored four ways and tiled, over the whole glass behind the picture; the 136 points beside the town were that tile. A hard
  vertical line top to bottom (the picture's right edge), a flat tiled fill, a gravel band mirrored in the tile, and Network's two
  round tanks cut in half by the picture's edge. Measured in the same views: drawing the 2060 picture over the WHOLE glass instead
  would put a tap under the phone in all 14 towns (the armourer or the build ground at one side, the barber, smith, bar or posts at
  the other), so the room could not be made at the screen: it had to be made in the drawing.
- UPRIGHT: the four layouts' drawings (11/3) were whole, the phone's corner the town's own ground with its things cleared, but the
  screen still laid the same tiled square over the corner as a rectangle (padDraw, one hard edge), on top of ground that was already
  right; and the 260 px of ground those drawings add under the town were the town's plan FLIPPED ('g2 = np.flipud(g)', 'the plan
  mirrored, laid on south of it, so the seam is the same ground meeting itself'): the plan's grounds mirrored about row 1820.

## WHAT CHANGED
1. THE DRAWINGS (tools/bohemia_run5_the_town_drawn_whole_11_6_26.py; COOK's builders, plans, layouts, fills, taps and checks, imported):
   - WIDE: the re-laid wide town (COOK's relaid tool, untouched) with its frame opened 600 px on BOTH sides: 3260 x 1092, the same
     camera, light and pixel scale; every thing the old frame cut at its edge drawn whole (Network's tanks, Caravans' and Mob's barber
     blocks); past the plan's 60 m the ground is CONTINUED (go_on): every band of the plan that runs to that edge runs on (a street,
     the yard's slab, the centre line), a patch that only touches the edge runs on 3 to 9 m and ends ragged, three worn patches of the
     town's own grounds near the seam; never the plan mirrored. Taps, boxes, doors, entrance and walk outlines move by 600, measured.
     comp.whole = {ext:600, town:[600,0,2660,1092]}. The arena's pit spot in mob.webp moves by 600 (slices/arena/arena_town.json).
   - TALL: the four layouts' drawings (left, right), their 260 px under the plan CONTINUED south the same way: only the strip from row
     1640 is rendered and pasted under the shipped drawing from row 1760 (2 m inside the plan's own ground, the same scene at the same
     pixels; the join measured as it pastes). Each drawing's record: whole.ground_south 'continued'.
   - MEMORY, MEASURED: three whole 60 m ground grids with their stones held 7.3 GB and the kernel killed the render beside a demo gate;
     every grid laid beside the plan is trimmed to what the frame sees before the render: 2.4 GB mid-render. Its build still peaks
     high: never run a demo gate beside it.
2. THE SCREEN (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_TOWN_IS_ONE_PICTURE__):
   - frameFit: the picture covers the whole glass, every way (cover = max(W/pw, H/ph)); the town itself (comp.whole.town) fills what
     the phone leaves (s0 = max(cover, area/townW, area/ph)); every candidate placing keeps the glass covered; the taps still scored
     against the phone's rectangle (unchanged). pan/panY hold the glass covered (they held only the town's part before).
   - DELETED (the graveyard): padGround (the mirrored tiled square), padDraw (that square laid over the phone's corner or strip), the
     background fill of the same pattern, the four edge fades, the old-drawing ride-up (oldDraw: no drawing without the phone's
     ground is left).
   - the glide's pairs (COOK's, measured on the 2060 frame) and the walkers' lanes move by comp.whole.ext; BohemiaSettlement.night()
     for the gates.
3. GATES: gates/the_town_is_one_picture_gate.js (new); RUN TWO's NOTHING TAPPABLE N7 re-aimed (padDraw gone).

## THE MIRROR MEASURE, CALIBRATED (so the gate is a measure, not an opinion)
A seam mirrors when, across the whole of it and 40 rows deep (half resolution), the band on one side is the other side flipped: per
segment (24 a seam), the flipped pair (n-1-i, n+i) against the smaller of the same-distance pairs on either side, a segment mirroring
under a fifth. Measured: the old tiled square laid into a picture 0.80, a band flipped under itself 1.00; the towns' own pictures at
most 0.33. Two first versions were thrown away: the one-sided reference read flat ground beside a building's foot as a mirror (0.96),
the shallow one read a roof's parapet (a short symmetric stripe) as one (0.71). THE LIMIT, SAID: the old upright drawings' flipped plan
is NOT a pixel mirror (its stones, wear and light are its own; it scores 0.3 at row 1820), so the pixel leg cannot catch that kind; the
gate reads each drawing's own record that its ground under the town was continued, and the tool's own paste measures the seam.

## RESULT (11/6, BUILD 11/6l)
- All 14 wide towns re-drawn whole (3260 x 1092, the town 600 px in each side): records/target/cook_town_screens/whole/wide/*.json.
  Ten of them 16 samples with the denoiser (as the four layouts' upright towns); Cartel 32 samples, no denoiser, the rig's dents cut
  once (--simplify --no-denoise): measured, the denoiser's load at the first sample took Cartel past the box's 14 GB at any size, and
  its many small things subdivided twice held 13.6 GB without it. Its dents are finer than a pixel at the screen's size.
- Sideways the town is drawn at the same size as before (s 0.344 on 844 x 390, the town in the 708 points the phone leaves) and the
  phone floats over its own continued ground; upright nothing is laid over the corner any more.
- LOOKED AT (deviceScaleFactor 1, the phone shown and hidden): Network, Mob and Cartel sideways both sides by day and night (Network's
  tanks whole, Mob's street and car under the phone, the arena's pit on its plaza), the same three upright both sides.
- OWED, NEXT ROUND (named in the gate as OWED, not counted): the upright drawings' 260 px under the plan are still the plan flipped
  (mostly under the phone's corner): --tall renders the strip continued and pastes it under the shipped drawing; on this box the
  fortresses' layouts take ten minutes a side, so the 28 strips are about two and a half hours of rendering.
- THE LOOK, FOR DIRECTION/COOK FOUR at final: the three worn patches go_on lays near each seam have stepped edges; seen only off the
  glass or under the phone in the views measured.
- SEEN, NOT MINE (NOTE for the map's camp and travel owners): through the map's own door in the demo, a camp is made over a town a
  second after it opens (campMake, then btwCampIn sets the town frame's opacity to 0) with a patrol's warning up; the town is still
  open behind it (its phone says town). Started this round, after the map's lanes shipped.

## GATES (one at a time, nothing else on the box)
- NEW gates/the_town_is_one_picture_gate.js, the full run (14 towns, upright and on its side, phone right and left, day and night,
  112 views, 84 drawings): 10 passed, 1 failed, the one red Reds on its side drawing the tier's town_1 (below); after the fix Reds
  alone 11/0. P1 covers the glass 112 of 112; P2 under and round the phone the town's own pixels 108 of 112 (the four were Reds'
  town_1) then 4 of 4, the least 99 percent; P3 no exact mirror in 84 of 84 drawings (the nearest 0.143, Homeless wide night) and the
  wide towns opened 14 of 14; the upright ground leg OWED (0 of 28); P4 112 of 112; P5 source clean. PLANTED (the old laid rectangle
  painted in before the read): P2 fails in 24 of 24 views, as it must.
- REDS, FOUND BY THE GATE AND FIXED: Reds' wide smith door had been set by hand by RUN TWO (1044,1062, off the picture's bottom edge);
  the first ship recomputed it onto the edge (1879,1087) and the screen's door check refused the whole drawing, so Reds drew the
  tier's picture on its side. The door is back (1644,1062) and the ship now carries a town's shipped doors over, moved by 600.
- RUN TWO's gates: NOTHING TAPPABLE UNDER THE PHONE 22/0 (every town its own picture both ways, no tap and nobody you can tap under the
  phone), THE TOWN FITS THE SCREEN 21/0, THE FLIP GLIDES 9/0, PINCH OUT TO THE MAP 8/0 (it was 7/1 ON MAIN, the same 137.1-point drift
  with main's own screen: pinchMove centred on FIT.open while pan places by FIT.area; one line, now the same centre, drift 0.5).


## [bb] Battle Brothers' town screen is one painted scene with its menus laid over it; nothing in the scene is cut for a menu.
## [analog horror] the yard's concrete runs on under the phone, its stains and stones the town's own; nothing pasted, nothing mirrored.
