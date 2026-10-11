# THE PORTRAIT GENERATION CONTRACT -- PORTRAIT, 10/11/26

## WHAT CHANGED SINCE LAST ROUND
Rule 108, a whole new arc about the real art pipeline, landed in full this round (13
rounds in VAMILY.md rule 243). The part that binds this lane directly is 108a: "a cook's
tile, prop, house, portrait or icon is GENERATED against his pack tiles as the style
reference... a tile drawn rectangle by rectangle in a Python or JavaScript tool is no
longer a candidate." Rule 108 round eight restates it even more plainly: "NO CHAT DRAWS
A PIXEL OR A CURVE IN CODE."

## WHAT THIS RETIRES, NAMED HONESTLY
Last round's own row, [the real clothes reach the portrait], built a candidate by
drawing a hand-coded hat/glasses/shoulder overlay in JavaScript (`poly()`/`P()`/`line()`
copied from `renderFace`, recoloured with real garment data). That candidate's BUG
FINDING is not reversed by this round's new rule -- the measurement stands: headwear
agreed with the real worn body only 59% of the time, eyewear 68%, and top clothing was
never read at all. What is retired is the FIX METHOD: hand-coded overlay pixels in a
cook tool are exactly what rule 108a now forbids. The real fix, when COOK's own
[generate against the pack] row reaches portraits, will be a model call referenced
against the pack, not more JavaScript polygons.

## THIS ROUND: NOT A FIX, A CONTRACT
Built `tools/bohemia_cook_the_portrait_generation_contract.js`. For three real citizens
(the same ones used last round, for continuity: `gate:crowd:2`, `gate:crowd:0`,
`gate:crowd:71`), it renders their real walked body from four real facings (S, E, N, W)
through `drawChar()` -- completely unmodified, zero new code touches a pixel -- and
writes down, in plain text, exactly which real `GARMENTS` piece they wear in every slot
that should inform a generated portrait of them: hat, face accessory, top (preferring
the visible outer layer over a covered base, the same correction made last round), hair.

This is the input sheet COOK's own `[generate against the pack]` row will need the day
it reaches portraits -- the same shape of input Retro Diffusion's own docs ask for
(reference images plus a locked description) -- written down now instead of invented
under time pressure in that future round.

## WHY THIS LANE, NOT COOK'S
Rule 87's hard file split still stands, unretracted by rule 108: "CHARACTER and PORTRAIT
keep the rigs, the dials, the sheets' mechanics and the gates; COOK THREE owns the PAINT
LAYERS." Reading what a citizen actually, really wears (`BOH_PERSONLOOK.lookFor`,
`window.GARMENTS`) is this lane's own mechanism, already built and proven last round;
handing that data forward as a clean contract is the same job, not a new one. Nothing
here paints anything -- every pixel in the sheet is a citizen's own already-approved
walked body.

## WHAT WAS ALSO FIXED THIS ROUND: THE BOARD ITSELF
Two rows this lane wrote last round, [a nose and mouth shape] and [hairstyle variety],
were scoped as new hand-coded shape dials and wider hand-coded hair-dial separation --
exactly the kind of work rule 108a now forbids. Corrected on the board rather than left
to mislead a future round into building something now disallowed.

## PROVED SAFE
Every image in the sheet is `drawChar()`'s own unmodified output; nothing about the
renderer was touched, so there is nothing to hash against a stash -- the safety claim
here is simpler than usual and stated as such, not padded with an unneeded check.

## GATES
`reference_check_gate.py`: this tool's REFERENCE CHECK block recognised, 437 passed (2
pre-existing failures are COOK TWO's tools, not this lane's).

## NOT DONE, NAMED HONESTLY
This is not a VOTE candidate for a thumb on a look -- it is reference material for a
call COOK owns, not this lane. Whenever COOK's row reaches portraits, this sheet (and
the pattern it demonstrates: four facings, the real worn-garment table) is ready to
hand over.
