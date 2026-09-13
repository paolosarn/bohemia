#!/usr/bin/env python3
"""A SECOND TEAL PIECE FOR THE NETWORK -- COOK, 9/13/26. [teal legs].

THE ROW: "r2 wired TEAL WORK SHIRT #28bea0 (one degree off his choice) and the colour gate
went red: one teal shirt against dust trousers gives 31% self-agreement against the 38% law;
neutral trousers passed and MOVED THE SILHOUETTE, so it was reverted. Cook a second teal piece
on legs or feet at ramp #28bea0 that keeps the Network silhouette byte-identical."

RULE 12 LANDED THIS ROUND -- a dependency on a line is a premise, not a gate -- so every
number in that sentence was measured before a pixel was cooked, and all of them hold:

    faction_colour_gate, Network row      domShare 0.31   against CO = 0.38     CONFIRMED
    TEALBRT.mid = [40,190,160] = #28bea0  exactly the ramp the row names         CONFIRMED
    his choice #1fbf9c is hue 166.9, TEALBRT is 168.0                1.1 DEGREES APART
    teal garments by layer:  base 2 (TEAL WORK SHIRT, TEAL STRIPED TEE), legs 0, feet 0

So the gap is real and it is exactly where the row says it is: the Network has two teal
SHIRTS and nothing teal below the waist.

AND IT IS NOT THE MAGENTA PROBLEM. Last round the twin row [magenta piece] had to stop,
because the Anarchists' #c026a0 sits inside the reserved purple band (hue 312.5, the band is
265-330) and cooking it would have broken a locked law -- proven by mutation, the purity gate
goes red on exactly that cook. Teal is hue 168. Nowhere near it. This one is free to build.

HOW THE COLOUR ACTUALLY REACHES A BODY, read before writing anything:
    familyOrStripeOutfit  starts from the free draw, then walks REALISM_ORDER calling
                          nudgeRegion until coverageFor(outfit, target) >= 0.5
    nudgeRegion('legs')   o.legs = closestMatch(allowed(L.legs, faction), target)
So ONE teal legs garment is enough: closestMatch takes the nearest hex to the target, and
with teal on no other leg piece it wins outright. Nothing has to be re-ranked or re-weighted.

*** WHAT "KEEPS THE SILHOUETTE BYTE-IDENTICAL" MEANS, AND WHY THE FIRST ATTEMPT MOVED IT. ***
STRUCTURE-NOT-COLOR (7/19): a garment entry is a SILHOUETTE, never a recolour, and the shape
count is a ratchet in wardrobe_wired_gate. The requirement is therefore ZERO NEW GEOMETRY --
an EXISTING leg shape with a saturated ramp, which adds a garment and adds no shape.

This file already did exactly that once and wrote down why:
    "ZERO NEW GEOMETRY, exactly like the 7/21 batch: every one of these is an EXISTING shape
     with a saturated ramp. A recolour is never PROGRESS (STRUCTURE-NOT-COLOR, 7/19) and this
     is not progress, it is IDENTITY, which is the half his 8/26 ruling adds."
That is the RAINBOW FOUR and the COLOUR IS TERRITORY batch, and TEAL WORK SHIRT is one of
them. This is its trousers, built the same way, for the same reason.

REFERENCE CHECK

COMPARED TO: GARM-03 (this repo's own locked wardrobe laws -- COLOUR IS TERRITORY and the
trenchcoat law), GARM-01 (Lospec clothing tutorials), and real workwear in a saturated colour.

STRUCTURAL RULES TAKEN:
  * GARM-03 -- "the cut belongs to the register, the colour belongs to the faction; a cook
    never spends both channels on one idea." This spends the COLOUR channel only. The cut is
    genPants, unchanged, the same call BLUE JEANS and COBALT WORK PANTS make.
  * GARM-01 -- "at sprite scale fabric is VALUE BANDS, not drawn fold lines; one shadow band
    under every overhang." TEALBRT is already a three-value dk/mid/lt ramp and genPants
    already bands it; wear() at 13 adds the same honest grime every other trouser in the
    canon list carries, so the new piece is not a suspiciously clean one in a worn valley.
  * COLOUR IS TERRITORY (Paolo 8/26) -- this is the ruling the row serves. A faction whose
    colour reaches only the torso is a faction you cannot read at a distance.

WHAT CHANGED FROM THE REFERENCE: nothing. No new geometry, no new colour. One canon leg shape
and one ramp that already ships.

    python3 tools/bohemia_teal_legs_9_13_26.py
"""
import io, sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__TEAL_LEGS__'

ANCHOR = ("    {n:'COBALT WORK PANTS',st:'canon',fresh:true,layer:'legs',"
          "gen:function(g){return wear(genPants(g,{ramp:COBALT}),COBALT,10);}},")

NEW = ANCHOR + """
    /* """ + MARK + """ -- THE NETWORK'S TROUSERS (9/13, COOK, row [teal legs]).
       MEASURED FIRST: the colour gate reads Network at domShare 0.31 against a 0.38 law,
       because teal reaches TWO SHIRTS and nothing below the waist -- teal garments by layer
       were base 2, legs 0, feet 0. familyOrStripeOutfit nudges region by region until the
       faction's colour covers half the body and simply runs out of teal after the torso.
       ZERO NEW GEOMETRY, which is the whole of "keeps the silhouette byte-identical":
       genPants is the same call BLUE JEANS and COBALT WORK PANTS make, so this adds a
       GARMENT and adds no SHAPE, and wardrobe_wired_gate's shape ratchet does not move.
       STRUCTURE-NOT-COLOR says a recolour is never progress; the line above it in this file
       says the rest -- "this is not progress, it is IDENTITY, which is the half his 8/26
       ruling adds." TEALBRT.mid is [40,190,160] = #28bea0, 1.1 degrees off the #1fbf9c he
       chose for the Network, and hue 168 is nowhere near the reserved purple band that
       stopped the Anarchists' magenta dead last round. */
    {n:'TEAL WORK PANTS',st:'canon',fresh:true,layer:'legs',gen:function(g){return wear(genPants(g,{ramp:TEALBRT}),TEALBRT,13);}},"""


def main():
    src = io.open(ALPHA, encoding='utf-8').read()
    if MARK in src:
        print('  already done (mark present)')
        return 0
    if src.count(ANCHOR) != 1:
        print('  the cobalt pants row is not where I left it (%d) -- REFUSING' % src.count(ANCHOR))
        return 1
    if "TEAL WORK PANTS" in src:
        print('  a TEAL WORK PANTS already exists -- REFUSING to write a second one')
        return 1
    if 'var TEALBRT=' not in src:
        print('  the TEALBRT ramp is missing -- REFUSING (this cook invents no colour)')
        return 1

    src = src.replace(ANCHOR, NEW, 1)

    for needle, why in ((MARK, 'the mark'),
                        ("{n:'TEAL WORK PANTS'", 'the garment'),
                        ('genPants(g,{ramp:TEALBRT})', 'an EXISTING shape with an EXISTING ramp')):
        if needle not in src:
            print('  verify failed, missing ' + why)
            return 1
    if src.count("{n:'TEAL WORK PANTS'") != 1:
        print('  verify failed: the garment is not exactly once')
        return 1
    io.open(ALPHA, 'w', encoding='utf-8').write(src)
    print('  %s: TEAL WORK PANTS added. Same genPants call, existing ramp, no new shape.' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
