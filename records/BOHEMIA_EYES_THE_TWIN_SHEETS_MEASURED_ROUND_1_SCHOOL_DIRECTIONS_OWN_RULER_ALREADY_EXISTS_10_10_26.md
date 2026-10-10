# EYES AND EARS -- [the twin sheets measured] -- ROUND ONE: SCHOOL
### 10/10/26 -- session eyes-5vql33

Row (rule 82, the reference twin; DIRECTION [the reference twin]): for each of DIRECTION's twin
sheets, EYES' OWN INSTRUMENT measures ours against the reference at the same size (distinct
colours, outline share, edge density, contrast range, the share of flat fill), one table, the
family with the widest gap named first, in VOTE with the two crops. This lane's own MODE line is
explicit: "your own instruments, never a lane's self-report." This round is research only, no
measuring, per this lane's two-round law.

## REUSE-FIRST: DIRECTION ALREADY BUILT MOST OF THIS RULER, FOR ITSELF

tools/bohemia_direction_twin_sheets.py's own `stats(im)` function already computes four of the
row's five named metrics, on real formulas, not invented for this check:

```
col_kpx      = distinct colours per 1000 opaque pixels          <- "distinct colours"
value_range  = 95th minus 5th percentile of luminance            <- "contrast range"
dark_line    = share of pixels both dark (L<45) AND high-gradient <- "outline share"
detail       = mean gradient magnitude (finite-difference edges) <- "edge density"
sat          = mean saturation (not named in the row)
```

NONE OF THESE ARE RAW COUNTS: col_kpx is per-1000px (a ratio), value_range is percentile-based,
dark_line and detail are per-pixel fractions and means. That matters because COOK's own
tools/bohemia_the_before_and_after_cook_10_10_26.py and tools/bohemia_the_pack_is_the_twin_cook
(measure_two()) both hit and FIXED the same real bug this round: "the first version compared raw
pixel COUNT and raw colour COUNT... a sheet is not a tile... all three are now ratios that do not
care how big the picture is." DIRECTION's stats() already avoids that trap from the start.

THE ONE METRIC MISSING: "the share of flat fill" has no existing number in DIRECTION's stats().
It is the natural complement of edge density (detail): the share of pixels where the local
gradient sits BELOW a low threshold, i.e. untextured flat colour fields, as opposed to the mean
gradient magnitude detail already reports. Round two adds it as `flat_share = (edge < some floor
& opaque).mean()`, the same shape as dark_line's own threshold-and-share pattern, not a new idea.

## WHAT THIS ROUND FOUND ALREADY SITTING IN VOTE, SELF-REPORTED, NOT YET INDEPENDENTLY CHECKED

DIRECTION has already run stats() on real crops for two families and printed the numbers straight
into the VOTE cards (slices/vote/DIRECTION_THE_TWIN_THE_GROUND.json,
DIRECTION_THE_TWIN_THE_PLACES.json), e.g. the road: ours col_kpx 0.5 against the twin's 142.3,
value_range 63 against 126; the ground between on the map: detail 25.4 against the pack ground's
12.6. These are DIRECTION's own self-report, exactly what this row exists to NOT simply trust:
this lane re-measures the same crops independently (not DIRECTION's printed numbers, the actual
pixels) and reports what its own instrument finds, which may agree or may not.

## HOW THE CROPS ARE SOURCED, REUSED EXACTLY, NOT RE-DERIVED

tools/bohemia_direction_twin_sheets.py builds `our_road`/`twin_road` (a crop of
slices/fight_ground/block_corner_0.webp beside a grid of reference/art_bank/road/*.png),
`our_props`/`twin_props`, and `our_board`/`twin_board` as real PIL Image objects from real source
files, not guessed crop boxes. Round two imports this module directly (the same pattern used last
round for COOK's before-and-after pairs) and runs the independent stats on those exact objects,
so the crop a reader sees in VOTE and the crop this lane measures are provably the same pixels.
THE PLACES FAMILY compares five named surfaces (the map now, COOK FOUR's new map house, the
settlement screen, the ground between on the map, the pack ground twin) rather than a strict
ours/twin pair; round two reads whichever of those five pairings DIRECTION's own card treats as a
pair (map-now vs settlement-screen, ground-on-map vs pack-ground) and says so plainly if a pairing
is ambiguous rather than forcing one.

## THE REAL METHOD BEHIND EACH NAME, SOURCED AGAINST PRIMARY LITERATURE, NOT PARAPHRASE SITES

A real search (not memory) for each of the row's five names, checked against primary sources:

- DISTINCT COLOURS (col_kpx): ties to the real COLOUR QUANTIZATION literature (Heckbert's
  median-cut algorithm, 1982, the classic palette-reduction paper; Wikipedia's "Color
  quantization" page covers the indexed-colour/CLUT framing). Unique-colour COUNT as a metric has
  no single coining paper -- it is a direct pixel-set cardinality measure used throughout that
  literature, which is exactly how col_kpx and COOK's own "COLOUR DENSITY" already use it this
  same round. A hand-painted pack tile carries dozens to hundreds of distinct values from
  dithering and shading; a flat-filled placeholder carries a handful.
- OUTLINE SHARE (dark_line): no single standard CV term exists for this as a ratio, but the real
  technique it approximates is well studied in non-photorealistic rendering: Philippe Decaudin,
  "Cartoon-Looking Rendering of 3D Scenes," INRIA Research Report #2919 (1996) -- the classic
  three-part toon pipeline (silhouette/profile edges inked black, flat interior fill, shadow
  bands) -- and US Patent 7,095,417, which treats dark regions as ink lines and Sobel-detects
  outlines specifically outside them, a concrete ink-vs-fill separation method. dark_line's own
  "dark AND high-gradient" test is the same ink-vs-fill idea in two lines of code: a cel-shaded or
  pixel-art outline is both dark AND sharp, which plain edge density alone would not isolate (a
  bright, saturated hard edge inflates detail without being an outline).
- EDGE DENSITY (detail): a real, formally standard term. ED = count of detected edge pixels over
  total pixels, confirmed verbatim in recent image-complexity papers (e.g. a facade-complexity
  study computing "ratio of detected edge pixels to total facade pixels" via OpenCV Canny). Source
  of the underlying detector: John Canny, "A Computational Approach to Edge Detection," IEEE
  Trans. PAMI (1986); OpenCV's own Canny tutorial documents the standard implementation. detail's
  finite-difference gradient (the pixel-to-pixel luminance jump in x and y, maxed) is a simplified
  Sobel-family approximation of the same signal, two one-pixel taps standing in for a full 3x3
  kernel.
- CONTRAST RANGE (value_range): maps to two real, named formulas -- Michelson contrast
  ((Lmax-Lmin)/(Lmax+Lmin), best for isolated high/low patterns) and RMS contrast (the standard
  deviation of normalized luminance, independent of spatial layout). Primary source: Eli Peli,
  "Contrast in complex images," Journal of the Optical Society of America A, 7(10), 2032-2040
  (1990) -- the paper that established RMS contrast against Michelson's for real complex images,
  not simple gratings. value_range's 95th-minus-5th-percentile is a robust, percentile-clipped
  dynamic range in the same family: a stray single bright or dark pixel cannot blow the number up
  the way a raw min/max would.
- FLAT FILL SHARE (new, round two): not a standard named metric by itself, but it maps directly
  onto established TEXTURE HOMOGENEITY measures. The real primary source is Haralick, Shanmugam
  and Dinstein, "Textural Features for Image Classification," IEEE Trans. Systems, Man, and
  Cybernetics, SMC-3(6), 610-621 (1973) -- the founding GLCM (grey-level co-occurrence matrix)
  paper, whose Homogeneity / Inverse Difference Moment term is high exactly where neighbouring
  pixels are similar, i.e. flat. scikit-image's own `graycoprops` documents the same formula.
  Round two's operational definition (share of pixels whose local gradient sits below a low
  floor) is the direct, standard complement of edge density, the simplest real instance of the
  same idea. A placeholder is mostly flat fill; a painted pack tile has shading and dither
  everywhere, the same direction COOK's own "THE HALF" measurement (how many colours it takes to
  cover half the picture) points, from a different angle.

TWO OF THE FIVE NAMES (distinct colours, outline share) HAVE NO SINGLE COINING PAPER -- named
honestly rather than forcing a citation that does not exist; edge density and contrast range are
properly standardized terms with primary sources; flat fill share is a direct, standard complement
of edge density via the real GLCM homogeneity concept, not invented from nothing.

## THE PREMISE, CHECKED AGAINST RULE 101 (LANDED THIS SAME ROUND)

Rule 101 slows cooking to one high-quality asset per cook per round, studied from the pack first,
with his FINAL the only thing that ships it. This does NOT change this row's job: DIRECTION's
twin sheets are still produced the same way (ours beside the reference, in VOTE), just arriving
one asset at a time instead of in batches. The two twin sheets that already exist (the ground,
the places) are real, current, and worth checking now; more will arrive one at a time and this
lane re-measures each as it lands, per rule 90's framing of this row as a standing duty.

## ROUTED

Nothing to route yet -- school round, no measurement taken.

## SHIP TEST FOR THIS ROUND

Found DIRECTION's own already-built, already-correct (scale-free, not raw-count) ruler covering
four of the row's five named metrics, with real, defensible formulas, not invented here; named
the one real gap (flat fill share) and how it extends the same pattern already in use; confirmed
the exact crops can be reused unmodified from DIRECTION's own tool, so round two measures the same
pixels a reader sees in VOTE, independently, not DIRECTION's own printed numbers. NO MEASURING
THIS ROUND, per the lane's own two-round law. Round two next: import the crops, run the
independent five-metric table across both existing twin sheets, order by widest gap first, two
crops in VOTE.
