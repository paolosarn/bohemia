# HAIRSTYLES THAT MATCH -- THE FACE MAKER WAS DROPPING TWO OF SIX DIALS
# PORTRAIT (chat 20), 10/9/26. Paolo, direct: "can I get hairstyles that match
# the hairstyles we have on the characters like what's going on, bro." Follows
# his 10/2 vote on CHARACTER's barber card ("wayyyy more portrait assets...
# with PORTRAIT when they run") and his 10/1 down-vote on the barber itself
# ("really ugly").

## WHAT WAS ACTUALLY THERE, MEASURED BEFORE TOUCHING ANYTHING
The face maker's HAIRCUT row already shows the right thing: `CUTS=(window.
GARMENTS||[]).filter(g=>g.layer==='hair'&&g.st==='canon')`, the same 11 named
cuts the body wears, read live off the same source of truth -- not a stale
copy. Clicking one calls `hairDialsFor(g.n)` and copies the dials onto the
player's own `pface.hair`.

But it only ever copied FOUR of the SIX fields `hairDialsFor` returns:
`side`, `front`, `vol`, `flare` -- never `tex` or `fade`. Rendered all 11
cuts on the same crowd face and measured the pixel masks pairwise:

    average pairwise overlap across all 11 cuts     63%
    worst pair                 TEMPLE TAPER / DRY TAPER, 93% identical

Reading why: TEMPLE TAPER, DRY TAPER and DEEP TAPER each carry a `fade`
value on the body (4, 6, 9 -- how hard the sides taper) and the portrait
renderer has never had a single line that reads `h.fade`. All three
collapsed to the same short cap. Separately, DUST WEAVE carries `tex:
'braid'` on the body, and the portrait's own texture dispatch (`if(_tex===
'wave'){...} else if(_tex==='locs'||_tex==='coils'){...}`) never named
'braid' as a value to handle, so it silently fell through to nothing --
same flat cap as a cut that asked for no texture at all.

## THE FIX
**Face maker click handler** (the HAIRCUT row): now copies `tex` (explicit
`'solid'` when the cut sets none, never left on whatever the last pick
happened to be) and `fade` (null when absent) alongside the four dials it
already copied.

**Texture dispatch**: `_tex==='locs'||_tex==='coils'` widened to also match
`'braid'`, routed through the existing `locs` pattern (the closest existing
mark to a woven look; the body's own 'braid' texture is not a separate
rendering routine either, so this is reuse, not invention).

**A new `fade` effect in `renderFace`'s hair block**: when `h.fade` is a
real number, the two side-length polygons (the ones that give the mass its
length and jaw-line width) taper inward by a scale factor derived from the
fade value (`_fsc = max(0.45, 1 - fade*0.055)`), applied only to the lower
points of each polygon so the crown keeps its volume and the sides pull in
close to the skull -- the silhouette a fade actually has. Guarded on
`h.fade` being a real number: every cut without one, PUNK (the approved
face) included, computes `_fsc=1` and every `*_fsc` term is the original
unscaled term -- byte-identical.

## MEASURED AFTER
Same ruler, same 11 cuts, same crowd face:

    average pairwise overlap        63%  ->  59%
    worst pair                      93%  ->  89%  (now CURTAIN CUT / HEAVY FRINGE)
    TEMPLE TAPER vs DEEP TAPER      86%  ->  67%
    DRY TAPER vs DEEP TAPER         92%  ->  79%

## PROVED NOTHING SHIPPED MOVED (rule 18)
PUNK's hair spec carries no `tex` and no `fade` field. `h.tex` still
resolves through the same `h.tex || (style-based fallback)` it always has;
`h.fade` is `undefined`, so `_fsc=1` and every scaled term equals its
original unscaled value. Checked on the real gates, not assumed: talking_
portrait (34/0) and family (17/0) both read his approved hash unmoved.

## GATES
talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker 16/0,
hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads
20/0, portrait_matches_body 11/0, vote_tab 31/1 (pre-existing, a TUNING/Grok
item's own missing "where you see it" line, checked against a clean
origin/main worktree, not mine). character_in_the_vote_tab 8/1 pre-existing
(CHARACTER's own [barber] item, not mine, checked the same way.)

## COOKED (rule 22)
`portrait-hairstyles-match-10-9`, the same 11 cuts rendered before and
after on real renderer pixels, with the real IoU numbers. TAB: VOTE in the
alpha. Record of the render: this file; page itself `slices/vote/
PORTRAIT_HAIRSTYLES_MATCH.html`.

## NOT DONE, NAMED HONESTLY
The remaining overlap is structural, not a bug: several cuts (CURTAIN CUT /
HEAVY FRINGE, SHAG / COIL CROWN, ROPE LOCKS / LAYERED FALL) have no `fade`
and no distinguishing `tex`, so their only real difference is a `side`/
`front`/`vol` spread too narrow for this renderer's one-polygon-stretches
vocabulary to read as different silhouettes at 64px. Closing that needs
either a wider texture vocabulary (more than wave/locs/coils/braid) or a
real shape primitive the current cap-plus-flare system does not have --
named as the honest next line on this row, not chased inside one round.

CHARACTER's own barber screen ("the face editor and the haircut bank with
twelve cuts") opens the SAME face-maker panel this fix lives in, so this
answers the "really ugly" vote too, though CHARACTER's own screen layout is
CHARACTER's to judge, not touched here.
