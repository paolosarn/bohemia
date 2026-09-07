# VERDICT: THE CAR RE-COOK, JUDGED AT THE SEAM (DIRECTION, 9/7)

The deferred half of [judge the car] (SHIPPED 815de5b ruled the general case;
this record is the specific judgment the line promised when COOK's re-cook
landed). COOK shipped the re-cook in 5c5ae7a. Judged side by side per the
compare law and style card section 2C: against the real wreck (Paolo's own
kill frame carries the photograph of one) and against the pixel body standing
beside it, ON THE LIVE WALKED SURFACE, not off disk.

## THE FRAME
records/target/DIRECTION_THE_CAR_RECOOK_JUDGED_9_7_26.png
Left: the photo-texture car Paolo killed (PAOLO_THE_CAR_IS_ASS_9_7_26.jpg).
Right: the re-cooked wreck on the freeway with the player body one tile away,
shot through the running alpha (probe teleport to a live vehicle cell,
freeway district, OM cell 58,20).

## VERDICT: PASS

1. ONE CRAFT, ONE WORLD. The body reads off a six-tone coat ramp; the car
   reads off the seven-tone asphalt ramp plus two rust accents. Standing one
   tile apart they are the same kind of drawing. The two-worlds-in-one-frame
   sin Paolo named in four words is gone.
2. THE NUMBERS AGREE WITH THE EYE THIS TIME. Measured off the shipped slice:
   20 of 20 cars at 9 colours each, 0 single-use pixels, 0 orphans
   (was median 3,031 colours, 71% single-use, 90% orphan). Union across all
   twenty: 28 colours. Style card 2C's objects_pixel_native holds.
3. AGAINST THE REAL WRECK (PROP-02: one material, two or three readable
   parts): shell, dead glass, rust — three parts, all readable at phone size.
   Rust travels in clusters of four or more (craft LAW 1 applied to accents),
   no speckle. Silhouette preserved pixel for pixel from the observed
   vehicle, so the structure is still the real thing's.
4. THE ACCENTS ARE LEGAL. Warm oxide family (#7c4c23..#cc7f23), two per car,
   taken from each wreck's own out-of-range pixels — the 7/28 method he
   approved, not an invention.

## ONE ROUTED FINDING (not the re-cook's fault, found by looking at it)
THE WRECK PARKS ON A PLINTH. The vehicle cell paints a blue-grey stippled
pad the size of the car's bounding box under the sprite, with a dotted
border. A real wreck sits ON the lane with a contact shadow (PROP-01: a
prop with no contact shadow floats); ours stands on a museum mat. This
ground pad predates the re-cook — the photo car stood on the same pad in
Paolo's kill frame — so it is the city's vehicle-cell ground, not COOK's
sprites. Routed via the handoff for the coordinator; the fix is the cell
under a vehicle keeping the road/ground art of its family, with the sprite
carrying its own contact shadow.

Proof: the frame above; measurements by pixel count off
slices/BOHEMIA_CITY_PROPS.js as shipped in 5c5ae7a.
