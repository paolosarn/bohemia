# EYES AND EARS -- [zoom range measured] -- ROUND TWO OF TWO: THE CHECK
### 10/1/26 -- session eyes-5vql33

Row (rule 50/50b): calibrate his six Pocket City 2 screenshots and our own matching stops to
real metres-per-pixel (round one's ruler), report the ratio and where our ladder lies or jumps,
both orientations. This round measured the NEAR END on both sides, cleanly. The FAR END is NOT
done -- named precisely below, not forced, because the one anchor round one's method needs (a
person, a known real size) is missing from his own far-zoom screenshots.

## HOW THE MEASURING WAS DONE, SHOWN NOT HIDDEN

Pocket City 2's own screenshots were measured with code against the actual pixels (Python/PIL,
reference/pocket_city_2/*.png), isolating the walking man in shot 02 from the road and sidewalk by
colour distance, and the bench in shot 01 the same way, rather than eyeballing a description.
Our own near end uses a number this whole project already has LOCKED and never needs to estimate:
the person is painted at a fixed 112 px box on every surface he appears on (rule 21/34).

## THE NEAR END, MEASURED BOTH SIDES

| | pixels measured | real-world anchor | metres per pixel |
|---|---|---|---|
| Pocket City 2, shot 02 (a man walking) | ~150 px head-to-foot (colour-segmented from the road) | an adult, ~1.7 m | **88 px/m** |
| Bohemia, the near end (a person on any walked/fought surface) | 112 px (LOCKED, rule 21/34) | an adult, ~1.7 m | **66 px/m** |

**Ratio: ours is about 0.75x Pocket City 2's shot-02 magnification** -- our near end sits a
little WIDER (less zoomed in) than that particular Pocket City 2 stop, same order of magnitude,
not a mismatch of kind. Shot 01 ("CLOSEST") is a further stop in than shot 02 -- its bench measured
at an apparent 570 px span, which against a ~1.5 m bench would read about 380 px/m, several times
tighter than shot 02 -- but that number is NOT trusted as solid: the bench lies at an angle in the
isometric view and its on-screen span is foreshortened by an amount this round did not pin down,
so it is reported as a rough cross-check only, not a result.

## THE FAR END: NOT DONE THIS ROUND, NAMED WHY

Round one's own method needs a real object of known size in the shot. Paolo's own notes on shots
04 and 05 say so themselves: shot 04 has "no person visible;" shot 05 is "the city keeps drawing,
the people stop being drawn." Without a person (or another object this round could confidently
size), the far-end metres-per-pixel cannot be calibrated the same honest way the near end was --
a road-width or a building-floor-count guess was tried and dropped rather than shipped, because
neither could be read with the same confidence as a human figure against its own well-known
height. SEPARATELY, on our own side: reading the live game's own zoom state (window state, czoom
0.208 at the map) returns a tile-width variable this round could not yet confirm is denominated in
the 96 m overworld tile the engine's own constants define (TILE_FINE 128 x CELL_M 0.75) versus some
other unit a different rendering path uses -- named rather than guessed at, so a wrong number is
not shipped as a right one.

## WHAT THIS CONFIRMS AND WHAT IT DOES NOT

CONFIRMED: our near end and Pocket City 2's are the same ORDER OF MAGNITUDE (0.75x, not 10x or
0.1x) -- the two camera systems are not telling two different stories at the close end.
NOT YET CONFIRMED: Paolo's own "roughly three orders of magnitude" end-to-end for Pocket City 2,
and whether our own ladder covers a comparable span without an uneven jump -- both need the far
end, which is round three's job, armed precisely: pin down which live variable on our side is
metres-per-pixel at the map's zoomed-out stop (one short confirmation, not a new method), and find
a sizeable, confidently-known real object in his far-zoom shots (or ask the coordinator for a
seventh reference shot with a person visible at a middle-far stop, if one does not already exist).
Both orientations (rule 50b) also wait on the far end existing to compare at all.

## ROUTED

Nothing bounced back -- a camera range is a design question for the coordinator and RUN, never
this lane's call, and the open half of this measurement is this lane's own homework, not a defect
found in anyone else's work.

## SHIP TEST FOR THIS ROW

Round one armed the ruler (metres per pixel, a known real anchor). Round two used it for real on
both sides at the near end and found the two systems close in scale, and named precisely, with
reasons shown rather than assumed, what the far end still needs before a full range ratio can be
reported. **Round one SHIPPED. Round two partially measures; the near end is done, the far end
is round three's.**
