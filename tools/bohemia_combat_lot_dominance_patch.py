#!/usr/bin/env python3
"""BOHEMIA - COMBAT v97: I BROKE PAOLO'S OWN DOMINANCE LAW. UNDOING IT.

v96 gave the lot beyond the sidewalk a six-tile pool and let the per-cell hash
pick freely. Rendered and looked at: the ground came out a CHECKERBOARD of pale
concrete against sandy dirt. Confetti.

--- AND IT IS NOT A TASTE PROBLEM, IT IS A RULED ONE ---------------------
banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt carries this, in the bank, in
Paolo's own words:

    desert_dominance_law:
      dominant = "TP22 (2. Soil and dirt tiles #3)"
      share    = 0.85
      accents  = "coherent value-noise clusters (top 15 pct), one tile per region"
      banned   = "per-cell random shuffle"
      source   = "Paolo 7/14: too much diversity with the desert tiles"

*** PER-CELL RANDOM SHUFFLE IS THE ONE THING THE LAW NAMES AS BANNED, AND IT IS
EXACTLY WHAT I WROTE. *** I opened this bank on 7/28 to quote its markings laws
into a records file and did not apply the law sitting three lines above them.

--- THE FIX IS THE LAW, IMPLEMENTED --------------------------------------
1. ONE DOMINANT TILE AT 85%. `dirt` -- "the graded dirt every lot sits on".
2. ACCENTS IN COHERENT REGIONS, ONE TILE PER REGION. The lot is diced into 4x4
   blocks; a block is dominant or it is a single accent tile, never a mix. 15% of
   blocks are accents, which is the law's own share.
3. NO PER-CELL SHUFFLE ANYWHERE ON THE LOT.

4. AND THE POOL LOSES CONCRETE. A poured concrete driveway slab scattered at
   random through dirt is not a texture accent, it is a BUILT THING placed by
   nobody, and placing built things is Paolo's call (MAP LAW). The lot pool is
   now dirt + the three gravel yards: one family, one value band, no jumps.

The quarter-turn rotation from v96 STAYS -- it is what kills the repeat, and it
does not fight the dominance law because a rotated dirt tile is still dirt.

--- WHAT I AM NOT DOING --------------------------------------------------
This is the THIRD pass at this ground. STOP PRODUCING names a fourth version of
anything as the tell that the attempt already failed. So this fix lands, and if
the ground is still wrong after it, the next turn says "I stopped" instead of
shipping a v98 of the same surface.

REUSE CHECK: no art or audio is cooked, read or written. This only narrows which
already-approved tiles v96 loaded and changes which one a cell selects. No new
pixels enter the build; two tiles (concrete_0/1) stop being used on the lot.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_lot_dominance_patch.py
Gate:  node gates/combat_lab_gate.js   (section 30)
"""
import base64, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V97 THE DOMINANCE LAW'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    if 'V96 THE SIDEWALK ENDS' not in demo:
        sys.exit('FAIL: v96 must be applied first (this migrates its lot pool)')

    # ---- 1. the lot pool loses concrete, keeps one family -------------------
    demo = subN(demo,
        "const ST_SPIN={road:1,walk:1,lot:1};   /* isotropic surfaces only */",
        "const ST_SPIN={road:1,walk:1,lot:1};   /* isotropic surfaces only */\n"
        "/* ===== V97 THE DOMINANCE LAW ======================================\n"
        "   v96 let the per-cell hash pick freely from a six-tile lot pool and the\n"
        "   ground came out a CHECKERBOARD of pale concrete against sandy dirt.\n"
        "   That is not a taste call, it is a RULED one. The street bank carries, in\n"
        "   Paolo's own words:\n"
        "     desert_dominance_law: dominant 0.85, accents \"coherent value-noise\n"
        "     clusters (top 15 pct), ONE TILE PER REGION\", banned \"per-cell random\n"
        "     shuffle\", source \"Paolo 7/14: too much diversity with the desert tiles\".\n"
        "   PER-CELL RANDOM SHUFFLE IS THE ONE THING THE LAW NAMES AS BANNED AND IT IS\n"
        "   EXACTLY WHAT I WROTE. I quoted this bank's markings laws into a record on\n"
        "   7/28 and did not apply the law three lines above them.\n"
        "   Concrete leaves the pool too: a driveway slab scattered at random through\n"
        "   dirt is not a texture accent, it is a BUILT THING placed by nobody, and\n"
        "   placing built things is his call. */\n"
        "const LOT_DOMINANT=0, LOT_ACCENT_PCT=15, LOT_REGION=4;\n"
        "function lotIdx(wx,wy,n){\n"
        "  if(n<=1)return 0;\n"
        "  /* one hash per 4x4 REGION, not per cell: a block is the dominant tile or it\n"
        "     is a single accent tile, and it is never a mix of both. */\n"
        "  const c=(Math.imul((wx>>2)|0,668265263)^Math.imul((wy>>2)|0,2246822519))>>>0;\n"
        "  if((c%100)>=LOT_ACCENT_PCT)return LOT_DOMINANT;\n"
        "  return 1+(c%(n-1)); }",
        'the dominance law, implemented')

    # ---- 2. drop concrete from the loaded lot pool --------------------------
    demo = subN(demo,
        "(function(){ for(const k in STREET_B64X){ STREET_B64[k]=STREET_B64X[k]; STREET_IMG[k]=[];",
        "/* V97: dirt (the dominant) + the three gravel yards. One family, one value\n"
        "   band, no jumps. The concrete slabs v96 loaded are dropped here. */\n"
        "STREET_B64X.lot=STREET_B64X.lot.slice(0,4);\n"
        "(function(){ for(const k in STREET_B64X){ STREET_B64[k]=STREET_B64X[k]; STREET_IMG[k]=[];",
        'the lot pool keeps one family')

    # ---- 3. the lot selects by region, everything else by cell -------------
    demo = subN(demo,
        "      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;\n"
        "      const _st=streetTile(_sk,h%_sn,Math.ceil(t)+1,(h/_sn)|0);",
        "      /* V97: the LOT selects its tile per 4x4 REGION under the dominance law;\n"
        "         every other surface still selects per cell, because a road and a\n"
        "         sidewalk are single materials whose variants are the same thing. The\n"
        "         quarter-turn stays per cell everywhere -- a rotated dirt tile is still\n"
        "         dirt, so it kills the repeat without breaking the dominance. */\n"
        "      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;\n"
        "      const _si=(_sk==='lot')?lotIdx(wx,wy,_sn):(h%_sn);\n"
        "      const _st=streetTile(_sk,_si,Math.ceil(t)+1,(h/_sn)|0);",
        'the lot selects by region')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
