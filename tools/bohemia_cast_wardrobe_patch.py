#!/usr/bin/env python3
"""BOHEMIA THE CAST WAS WEARING BOTH WARDROBES AT ONCE (8/11/26, CHARACTER lane)

famPaintBody sets window.G_WORN to the member's canon outfit and never touches
G.equipped -- so every cast member also wears THE PLAYER'S PD DEFAULTS underneath:
leather legwarmers, balenciagas, the cowl hoodie. Two wardrobes, both on, at the
same time.

MEASURED. The SISTER rendered with her `legs` slot emptied, sampling BAKED parts
9+10 -- the leg pixels:

    58% skin, top colours  212,208,200 x52 | 31,31,36 x24 | 20,20,26 x20

31,31,36 and 20,20,26 are not skin and they are not hers. They are entries 2 and 0
of the `pants/leather-legwarmer` ramp -- THE PLAYER'S DEFAULT PD PANTS, painting
her shins from underneath. 212,208,200 is her own white tee running down over the
hip rows on top of them.

*** THIS IS THE "BARE LEG PAINTS THE DARK UNDER-BODY 31,31,36" REPORT, SOLVED. ***
It was never a bare-leg rendering bug. Nothing paints a shin the wrong colour: the
shin is CORRECTLY painting a garment that nobody realised was still on. Measured
both ways to be sure -- strip BOTH wardrobes and the legs render 175/175 skin and
the arms 85/85, so the renderer was innocent the whole time.

AND IT IS WHY family_cast_gate HOLDS THE CAST TO CLOTHED LEGS. That rule was
written as a workaround for a rendering bug that does not exist, and it quietly
bans a bare-legged cast member -- a kid in shorts, anybody -- from the demo. The
workaround comes out with this fix.

THE FIX: a cast member wears HER OWN CLOTHES AND NOTHING ELSE. famPaintBody clears
the PD garment slots for the duration of the paint and restores them after, exactly
the way it already borrows and restores G_WORN, G.bodyVar and G.age.

WHAT IS NOT CLEARED, and the distinction is the whole point: `body` and `facial`
are not garments, they are the person. Clearing those would paint a headless
skinless mannequin. Only the CLOTHING slots go.

    python3 tools/bohemia_cast_wardrobe_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """function famPaintBody(cv, member, dir){
  var keepW = window.G_WORN, keepDials = G.bodyVar, keepAge = G.age;
  try {
    window.G_WORN = member.worn;"""

NEW = """/* A CAST MEMBER WEARS HER OWN CLOTHES AND NOTHING ELSE (8/11). This borrowed
   G_WORN but left G.equipped alone, so every member also wore THE PLAYER'S PD
   DEFAULTS underneath -- leather legwarmers, balenciagas, the cowl hoodie. Two
   wardrobes, both on, at once.
   MEASURED on the SISTER with her `legs` slot emptied, sampling BAKED parts 9+10:
   58% skin, top colours 212,208,200 x52 | 31,31,36 x24 | 20,20,26 x20. Those last
   two are entries 2 and 0 of the pants/leather-legwarmer ramp -- the player's
   default pants painting her shins from underneath.
   THAT IS THE "bare leg paints the dark under-body 31,31,36" REPORT, and it was
   never a rendering bug: the shin was correctly painting a garment nobody realised
   was still on. Strip BOTH wardrobes and legs render 175/175 skin, arms 85/85.
   `body` and `facial` are NOT cleared -- they are not garments, they are the
   person, and clearing them paints a skinless mannequin. */
var FAM_PD_CLOTHING = ['shirt','jacket','pants','shoes','hat','glasses','hair'];
function famPaintBody(cv, member, dir){
  var keepW = window.G_WORN, keepDials = G.bodyVar, keepAge = G.age;
  var keepEq = {};
  FAM_PD_CLOTHING.forEach(function(s){ if(s in G.equipped){ keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });
  try {
    window.G_WORN = member.worn;"""

OLD_RESTORE = """    window.G_WORN = keepW; G.bodyVar = keepDials; G.age = keepAge;"""
NEW_RESTORE = """    window.G_WORN = keepW; G.bodyVar = keepDials; G.age = keepAge;
    for (var _s in keepEq) G.equipped[_s] = keepEq[_s];"""

alpha = open(ALPHA, encoding='utf8').read()
applied, missed = [], []
for label, old, new in [
    ("the cast stops wearing the player's PD defaults underneath", OLD, NEW),
    ("the player's own wardrobe is put back after the paint", OLD_RESTORE, NEW_RESTORE),
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
    print('CAST WARDROBE: refused to write -- %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('CAST WARDROBE: applied to %s' % ALPHA)
