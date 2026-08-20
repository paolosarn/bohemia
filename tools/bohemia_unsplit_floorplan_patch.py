#!/usr/bin/env python3
"""
A MODULE WAS INLINED INTO THE MIDDLE OF ANOTHER MODULE (8/20/26, RUN lane,
P0-SUITE).

Found while clearing the reds the suite could finally SEE once it stopped dying
two thirds of the way through. Four gates were all reporting the same thing in
four different vocabularies:

    INTERIORS        engine/bohemia_floorplan.js is inlined BYTE-IDENTICAL
                     (no second copy of the generator)            -- FAIL
    QUEST PLACEMENT  every inlined engine module is byte-identical
                     to its canon body                            -- FAIL
    BANNER           NO module is inlined TWICE in the page       -- FAIL
    (and the resync tool)  UNRECOGNISED: neither canon nor any of
                           the last 40 revisions

ONE ROOT CAUSE, MEASURED BY BISECTING THE CITY AGAINST CANON:

    canon bohemia_floorplan.js is 15,372 bytes
    the city holds its first 1,466 bytes  -- the comment header -- at 2,100,174
    the city holds the remaining 13,906   -- the actual code    -- at 2,136,490
    between them sit 34,850 bytes of TWO OTHER MODULES
        engine/bohemia_interior_ground.js   ("THE FLOOR INDOORS")
        engine/bohemia_furnish.js           ("WHAT IS IN THE ROOM")

So a patch tool anchored its insertion on the END OF A COMMENT BLOCK and landed
between the floorplan's header and its body, cutting one module in half. The
code all still RUNS -- both halves are top-level and the declaration is intact,
which is exactly why this survived: nothing was broken, only sliced. It is the
byte-identity that died, and byte-identity is the whole of the ENGINE SYNC LAW
("one canonical body per module"). A sync law that cannot see a module split in
two is not enforcing anything.

THE FIX MOVES BYTES AND CHANGES NONE. The two intruding modules are lifted out
of the wound and re-inserted immediately after the floorplan's last byte, so the
floorplan is contiguous again and every module keeps its banner, its order
relative to the code that uses it, and its content. The file LENGTH IS UNCHANGED
and the multiset of bytes is unchanged -- both are asserted before writing,
because a "reordering" that quietly loses 34KB is a far worse bug than the one
it fixes.

WHY NOT JUST RE-INLINE FROM CANON: because that would rewrite whatever the
interior-ground and furnish patches did, and this lane does not own those. Moving
a span is the smallest change that makes the law true again.

Idempotent: if the floorplan is already contiguous it reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
CANON = 'engine/bohemia_floorplan.js'
HDR_LEN = 1466          # the comment header, measured; the split point


def main():
    for p in (CITY, CANON):
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')
    city = open(CITY, encoding='utf8').read()
    canon = open(CANON, encoding='utf8').read()

    if canon in city:
        print('NOOP: engine/bohemia_floorplan.js is already inlined contiguously')
        return

    hdr, body = canon[:HDR_LEN], canon[HDR_LEN:]
    h = city.find(hdr)
    b = city.find(body)
    if h < 0 or b < 0:
        sys.exit('FAIL: cannot locate the split halves -- header %d, body %d' % (h, b))
    if b <= h:
        sys.exit('FAIL: body precedes header; this is not the split this fixes')
    gap_start, gap_end = h + len(hdr), b
    gap = city[gap_start:gap_end]
    if 'BOHEMIA MODULE' not in gap and '==== engine/' not in gap:
        sys.exit('FAIL: the span between the halves does not look like inlined '
                 'modules (%d bytes); refusing to move it' % len(gap))

    body_end = b + len(body)
    out = (city[:gap_start]           # everything up to the header's end
           + body                     # the floorplan's own body, rejoined
           + gap                      # the two modules, after it now
           + city[body_end:])         # the rest of the page

    # A REORDERING THAT LOSES BYTES IS WORSE THAN THE BUG IT FIXES.
    if len(out) != len(city):
        sys.exit('FAIL: length changed %d -> %d' % (len(city), len(out)))
    if sorted(out) != sorted(city):
        sys.exit('FAIL: the bytes are not the same bytes')
    if canon not in out:
        sys.exit('FAIL: the floorplan is still not contiguous after the move')

    open(CITY, 'w', encoding='utf8').write(out)
    print('PATCHED %s -- floorplan rejoined, %d bytes of two modules moved after it'
          % (CITY, len(gap)))


if __name__ == '__main__':
    main()
