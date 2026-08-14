#!/usr/bin/env python3
"""BOHEMIA THE CLOTHES HE PUTS ON DO NOT SURVIVE A RELOAD (8/11/26, CHARACTER lane)

Measured on the real surface, boot to boot:

    1. fresh boot           G_WORN = {}
    2. after SHUFFLE FIT    G_WORN = {base:"STEEL PLAID FLANNEL", legs:"SLATE WORK
                                      PANTS", feet:"BROWN BOOTS", outer:"FIELD
                                      GREEN COAT"}
    3. after a tab round-trip                          SURVIVED: true
    4. after a RELOAD       G_WORN = {}                SURVIVED: FALSE

THE SAVE NEVER CARRIED IT. PERSIST.snapshot() writes equipped, tints, swing, dir,
bodyVar, pface, hairColor, eyeColor, faceOffsets, skinToneName, skinDetail -- and
NOT window.G_WORN. So everything from the CLO catalogue (258 garments, 236 of them
st:'canon') is session-only. You dress the character, come back, and he is in the
default PD layers again.

THE TWO WARDROBES, stated plainly, because this is the concrete cost of the split:
    G.equipped   the PD layer slots (body/facial/shirt/pants/shoes/hair/...)
                 -- saved and restored since forever
    G_WORN       the CLO garment catalogue, everything the clothes tab and
                 SHUFFLE FIT put on him -- saved NOWHERE
frameLookHash already carries G_WORN (a 7/31 fix, "putting on a red shirt changed
the frame"), so the RENDERER has known about it for weeks. Only the SAVE did not.

*** AND MY FIRST PROBE SAID THE OPPOSITE. *** I searched the saved blob for the
garment names with /SLATE|HENLEY|BOOTS|JACKET/i and it hit -- so I nearly recorded
"the save carries the fit, the restore drops it", which is a completely different
bug in a completely different place. What it actually matched was
`jacket/japanese-fuzz_hoodDown`, a PD slot value in G.equipped, because "JACKET" is
a substring of it. A LOOSE REGEX OVER A SAVE BLOB IS NOT A MEASUREMENT. Reading
snapshot() settled it in one line.

THE FIX, and it is deliberately the smallest one that is true:
  - snapshot() carries `worn`
  - restore() puts it back, REPLACING rather than merging, because a fit is a
    whole outfit: Object.assign would leave a garment from the previous session
    hanging in a slot the saved fit deliberately left empty.

Nothing else moves. G.equipped keeps its own restore, untouched.

    python3 tools/bohemia_worn_persist_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD_SNAP = """  snapshot(){return {equipped:G.equipped,tints:G.tints,swing:G.swing,dir:G.dir,bodyVar:G.bodyVar,"""
NEW_SNAP = """  /* `worn` IS THE CLO WARDROBE and it was missing from this list entirely, so
     every garment he put on from the 236-item canon catalogue died on reload --
     measured boot to boot: SHUFFLE FIT survives a tab round-trip and comes back
     {} after a refresh. frameLookHash has carried G_WORN since 7/31, so the
     RENDERER knew about it; only the SAVE did not. */
  snapshot(){return {equipped:G.equipped,worn:(typeof window!=='undefined'&&window.G_WORN)||{},
    tints:G.tints,swing:G.swing,dir:G.dir,bodyVar:G.bodyVar,"""

OLD_RES = """      if(d.equipped)Object.assign(G.equipped,d.equipped);"""
NEW_RES = """      if(d.equipped)Object.assign(G.equipped,d.equipped);
      /* REPLACE, NEVER MERGE. A fit is a whole outfit, not a pile of slots:
         Object.assign here would leave a coat from the previous session hanging in
         an `outer` slot that the saved fit deliberately left EMPTY, and he would
         get an outfit he never chose. */
      if(d.worn&&typeof window!=='undefined')window.G_WORN=Object.assign({},d.worn);"""

alpha = open(ALPHA, encoding='utf8').read()
applied, missed = [], []
for label, old, new in [
    ('the save carries the CLO wardrobe', OLD_SNAP, NEW_SNAP),
    ('the restore puts the fit back, replacing not merging', OLD_RES, NEW_RES),
]:
    if new in alpha:
        applied.append('(already) ' + label); continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for l in applied: print('  ok   ' + l)
for l in missed:  print('  MISS ' + l)
if missed:
    print('WORN PERSIST: refused to write -- %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('WORN PERSIST: applied to %s' % ALPHA)
