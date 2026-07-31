#!/usr/bin/env python3
"""
CITY SCALE PATCH (7/30/26) -- marry the alpha's CITY tab to the canon overmap,
and make its block grouping DERIVED from the scale instead of hardcoded.

Paolo 7/30/26: "The districts should have always been full size bro."

WHY THIS TOOL EXISTS. Flipping TILE_FINE from 32 to 128 in engine/bohemia_overmap.js
is one line, and every district generator, the world model, the run and 114 gates
took it without a change. The CITY tab did not, for two separate reasons:

  1. BYTE MARRIAGE. The alpha embeds the city as a base64 blob (CITY_B64) with its
     own inlined copy of the overmap module. city_tab_gate asserts that copy is the
     canon body VERBATIM ("MARRIED"). Flip canon, the blob goes stale, gate red.

  2. THE GROUPING, which is the real one. A canon block is 128x128 cells. When a
     city cell was 32 wide, the renderer glued a 4x4 GROUP of cells together to
     show one block, and each cell drew its own 32x32 window of it (`tx>>2` to pick
     the group, `(tx&3)*FN` to pick the window). Now that a cell IS 128, that
     grouping asks for a 512-wide block and windows up to offset 384 into a 128-row
     array -- undefined, every suburb and every kit district. A byte marriage
     WITHOUT this would turn the gate green on a broken city, which is worse than
     the red.

THE FIX IS NOT "CHANGE 4 TO 1". It is to stop hardcoding the number at all:

    const GRP = Math.max(1, Math.round(128 / FN));

128 is the canon block size (measured, not assumed: BohemiaSuburb.generate(...).g
is 128x128). At FN=32 that is 4 and every rewritten expression is arithmetically
IDENTICAL to what shipped -- this patch cannot change today's behavior at the old
scale. At FN=128 it is 1 and the mapping becomes cell-for-block, which is what a
96m cell means. Any future scale lands right without another patch. Same disease
as the constant itself: a magic number with no single owner.

REUSE CHECK: cooks no graphic pixels. It rewrites existing code inside CITY_B64 and
re-embeds the canon engine body; no bank is read and none is needed.

Idempotent: re-running finds the GRP marker and the canon body already in place and
reports NOOP. Refuses to write anything if any expected source text is missing, so a
renderer another lane has since rewritten fails loudly instead of being half-patched.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CANON = 'engine/bohemia_overmap.js'
SUBURB = 'engine/bohemia_suburb.js'
WRAP_OPEN = '(function(global){'
WRAP_CLOSE = "})(typeof window!=='undefined'?window:globalThis);"
MARKER = 'const GRP='

# (what it is, exact old text, exact new text). Exact strings, never regex sweeps:
# `>>2` and `&3` are ordinary bit math that appears elsewhere in a renderer, and a
# blind sweep is how you silently break somebody else's file.
EDITS = [
    ('subBlock: pick the group',
     "  side('S',[0,1,2,3].map(i2=>[gx*4+i2,gy*4+4]));\n"
     "  side('E',[0,1,2,3].map(i2=>[gx*4+4,gy*4+i2]));\n"
     "  side('W',[0,1,2,3].map(i2=>[gx*4-1,gy*4+i2]));\n"
     "  side('N',[0,1,2,3].map(i2=>[gx*4+i2,gy*4-1]));",
     "  const __ns=[];for(let i2=0;i2<GRP;i2++)__ns.push(i2);\n"
     "  side('S',__ns.map(i2=>[gx*GRP+i2,gy*GRP+GRP]));\n"
     "  side('E',__ns.map(i2=>[gx*GRP+GRP,gy*GRP+i2]));\n"
     "  side('W',__ns.map(i2=>[gx*GRP-1,gy*GRP+i2]));\n"
     "  side('N',__ns.map(i2=>[gx*GRP+i2,gy*GRP-1]));"),

    ('subGrid: group + window',
     "  const res=__subBlock(tx>>2,ty>>2);\n"
     "  const ox=(tx&3)*FN, oy=(ty&3)*FN;",
     "  const res=__subBlock(Math.floor(tx/GRP),Math.floor(ty/GRP));\n"
     "  const ox=(((tx%GRP)+GRP)%GRP)*FN, oy=(((ty%GRP)+GRP)%GRP)*FN;"),

    ('kitBlock: pick the group',
     "    side('S',[0,1,2,3].map(i=>[gx4*4+i,gy4*4+4]));\n"
     "    side('E',[0,1,2,3].map(i=>[gx4*4+4,gy4*4+i]));\n"
     "    side('W',[0,1,2,3].map(i=>[gx4*4-1,gy4*4+i]));\n"
     "    side('N',[0,1,2,3].map(i=>[gx4*4+i,gy4*4-1]));",
     "    const __nk=[];for(let i=0;i<GRP;i++)__nk.push(i);\n"
     "    side('S',__nk.map(i=>[gx4*GRP+i,gy4*GRP+GRP]));\n"
     "    side('E',__nk.map(i=>[gx4*GRP+GRP,gy4*GRP+i]));\n"
     "    side('W',__nk.map(i=>[gx4*GRP-1,gy4*GRP+i]));\n"
     "    side('N',__nk.map(i=>[gx4*GRP+i,gy4*GRP-1]));"),

    ('kitGrid: group + window',
     "  const blk=__kitBlock(tx>>2,ty>>2,type);\n"
     "  if(!blk.g) return null;\n"
     "  const ox=(tx&3)*FN, oy=(ty&3)*FN;",
     "  const blk=__kitBlock(Math.floor(tx/GRP),Math.floor(ty/GRP),type);\n"
     "  if(!blk.g) return null;\n"
     "  const ox=(((tx%GRP)+GRP)%GRP)*FN, oy=(((ty%GRP)+GRP)%GRP)*FN;"),

    ('the stale comment that documented the hardcode',
     "   4x4 TILE GROUP = one canon 128x128 grid, same 1:1 scale as the suburb\n"
     "   patch (FN=TILE_FINE=32, SZ=128 -> 4x4 groups). ==== */",
     "   TILE GROUP = one canon 128x128 grid, same 1:1 scale as the suburb patch.\n"
     "   The group is GRP=128/FN cells on a side, DERIVED not hardcoded: 4 when a\n"
     "   cell was 32, 1 now that a cell is 128 (96m, the 7/6 VALLEY SCALE LAW).\n"
     "   ==== */"),
]

FN_DEF = 'const FN=OM.TILE_FINE, WORLD_F=OM.OVER_N*FN, CHK=16;'
FN_NEW = (FN_DEF + '\n'
          '/* GRP: how many city cells make one canon 128x128 block. DERIVED from the\n'
          '   scale so it is right at ANY scale -- 4 when a cell was 32 (the old\n'
          '   hardcoded 4x4 group), 1 now that a cell is 128. Paolo 7/30: "The\n'
          '   districts should have always been full size bro." */\n'
          'const GRP=Math.max(1,Math.round(128/FN));')


def main():
    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found in the alpha'); return 1
    b64 = m.group(1)
    city = base64.b64decode(b64).decode('utf8', errors='ignore')

    canon = open(CANON, encoding='utf8').read()
    body = canon[canon.index(WRAP_OPEN): canon.index(WRAP_CLOSE) + len(WRAP_CLOSE)]

    changed = False

    # ---- 1. marry the overmap body -----------------------------------------
    if body in city:
        print('  overmap body: already canon')
    else:
        old = re.search(re.escape(WRAP_OPEN) + r".*?const OVER_N=96, TILE_FINE=\d+.*?"
                        + re.escape(WRAP_CLOSE), city, re.S)
        if not old:
            print('FAIL: could not locate the embedded overmap body to replace'); return 1
        city = city[:old.start()] + body + city[old.end():]
        changed = True
        print('  overmap body: married to canon (%d bytes)' % len(body))

    # ---- 1b. marry the SUBURB generator too --------------------------------
    # Same failure mode, different module. The alpha's city blob carried its own
    # copy of bohemia_suburb.js, so when the generator gained the one-grid
    # sidewalk and 2-wide driveways (Paolo 7/31) the CITY kept drawing the old
    # 4-wide driveways and no walk at all. city_tab_gate asserts this body rides
    # verbatim, which is why the staleness could not hide.
    sub = open(SUBURB, encoding='utf8').read()
    if sub in city:
        print('  suburb body:  already canon')
    else:
        head = sub[:sub.index('\n', sub.index('(function(root){'))]
        i = city.find('// BOHEMIA SUBURB')
        if i < 0:
            print('FAIL: could not locate the embedded suburb body'); return 1
        # the module ends at its own IIFE close, the first one after the body
        end = city.find('BohemiaSuburb', i)
        end = city.find('\n', city.find('})(', end))
        if end < 0:
            print('FAIL: could not find the end of the embedded suburb body'); return 1
        city = city[:i] + sub + city[end:]
        changed = True
        print('  suburb body:  married to canon (%d bytes)' % len(sub))

    # ---- 2. the derived group factor ---------------------------------------
    if MARKER in city:
        print('  GRP: already derived')
    else:
        if FN_DEF not in city:
            print('FAIL: the FN definition is not where this tool expects it'); return 1
        city = city.replace(FN_DEF, FN_NEW, 1)
        changed = True
        print('  GRP: declared, derived from FN')

    # ---- 3. the four call sites --------------------------------------------
    for name, old, new in EDITS:
        if new in city:
            print('  %-46s already patched' % name)
            continue
        if old not in city:
            print('FAIL: %s -- source text not found. Another lane may have rewritten\n'
                  '      this renderer; refusing to half-patch it.' % name)
            return 1
        city = city.replace(old, new, 1)
        changed = True
        print('  %-46s patched' % name)

    if not changed:
        print('NOOP: the city tab is already at canon scale')
        return 0

    # sanity: no hardcoded group math left in the four helpers
    for fn in ('function __subGrid(', 'function __kitGrid('):
        i = city.index(fn)
        seg = city[i:i + 400]
        if '>>2' in seg or '&3)' in seg:
            print('FAIL: %s still carries hardcoded group math' % fn); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    alpha = alpha[:m.start(1)] + out + alpha[m.end(1):]
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('wrote %s (city blob %d -> %d bytes)' % (ALPHA, len(b64), len(out)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
