#!/usr/bin/env python3
"""BOHEMIA FAMILY CAST -> AGE UPGRADE (8/11/26, CHARACTER lane)

UPGRADES the family cast already shipped in the alpha rather than inserting a
second copy. That distinction is not pedantry: I re-ran the original insert patch
on a tree that already contained its own output and produced TWO `var FAMILY_CAST`
declarations and TWO `famBuild` functions. It LOOKED like it worked, because the
later function declaration wins -- the heights measured correctly while the file
carried a dead twin of every line. AN INSERT TOOL RUN TWICE IS A DUPLICATION
TOOL; anything that edits shipped code has to REPLACE, not ADD.

WHAT IT CHANGES, and why each one is required for Paolo's correction:
  "we have to assign the different heights in the different body sizing... you're
   just gonna create a family without fucking with the skeleton like are we even
   able to make character a kid child characters ... teenagers ... young adults"

1. EACH MEMBER GETS AN `age`. FATHER adult, MOTHER adult, BROTHER teen, SISTER
   child. The age axis itself (BOH_AGE) is added by
   tools/bohemia_age_axis_patch.py and is the thing that makes a CHILD possible
   at all -- see that file for the measured proportions.

2. THE DIALS ACTUALLY SPREAD. My first cast used timid dials on a system whose
   height dial is +-5% (about 2px), so four people came out within 4px of each
   other. Measured after: 106 / 98 / 94 / 84 px, a 22px spread.

3. *** famPaintBody REBUILDS THE RIG, AND THIS WAS THE REAL BUG. ***
   G.bodyVar and G.age are read by rebuildFromRig(), WHICH RUNS ONCE AT BOOT and
   sets the global RIG. Setting the globals and calling drawChar changes nothing
   whatsoever -- the renderer is still holding the body built at page load. My
   first cast set the dials and drew, so all four rendered the SAME BODY, and the
   only reason they looked different at all was their CLOTHES. Measured proof
   before the fix: paintedAdult 50, paintedTeen 50, paintedChild 50, identical at
   every age, while the transform itself correctly moved the pose from a 44px to
   a 36px stand.
   The body sliders already do it right (set global -> rebuildFromRig -> redraw);
   the cast now uses that same path, and clears the frame caches, which are keyed
   on facing/clip/look and know NOTHING about the body -- so without clearing they
   hand back the previous person.

4. IT PUTS THE PLAYER'S BODY BACK. These are globals. Leaving a child rig
   installed after drawing the sister would silently reshape every other surface
   in the game, and it would look like a rendering bug somewhere else entirely.

    python3 tools/bohemia_family_age_upgrade_patch.py
RIG CHECK (RIG IS LAW, Paolo 7/26/26): the cast is FOUR SETTINGS OF ONE RIG, never four
  rigs. Each member is BAKED resolved through BOH_AGE.apply (stage) and then
  BOH_BODYVAR (dials); the card renders by setting G.age, calling rebuildFromRig and
  drawing the same drawChar every other surface uses. Nothing here paints a joint, a
  bone or a pixel of anatomy.
  built on: BAKED, BOH_AGE, BOH_BODYVAR, rebuildFromRig, drawChar
  joints: none named
  parts: none
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

EDITS = [
    ('FATHER gets age + a real height spread',
     "{ role:'FATHER', name:'RAY',    draft:true, survivesIf:'always',",
     "{ role:'FATHER', name:'RAY',    draft:true, survivesIf:'always', age:'adult',"),
    ('MOTHER gets age + a real height spread',
     "{ role:'MOTHER', name:'DENISE', draft:true, survivesIf:'always',",
     "{ role:'MOTHER', name:'DENISE', draft:true, survivesIf:'always', age:'adult',"),
    ('BROTHER is a TEEN, not a small adult',
     "{ role:'BROTHER',name:'MARCO',  draft:true, survivesIf:'male',",
     "{ role:'BROTHER',name:'MARCO',  draft:true, survivesIf:'male', age:'teen',"),
    ('SISTER is a CHILD — the thing that was impossible before today',
     "{ role:'SISTER', name:'NINA',   draft:true, survivesIf:'female',",
     "{ role:'SISTER', name:'NINA',   draft:true, survivesIf:'female', age:'child',"),

    ('FATHER dials spread',
     "dials:{height:0.30,belly:0.35,arms:0.35,shoulders:0.50,hips:0.10}",
     "dials:{height:0.60,belly:0.35,arms:0.35,shoulders:0.55,hips:0.10}"),
    ('MOTHER dials spread',
     "dials:{height:0.00,belly:0.10,arms:-0.15,shoulders:-0.20,hips:0.35}",
     "dials:{height:-0.45,belly:0.10,arms:-0.15,shoulders:-0.25,hips:0.35}"),
    ('BROTHER dials spread',
     "dials:{height:0.15,belly:-0.20,arms:0.10,shoulders:0.20,hips:-0.10}",
     "dials:{height:0.20,belly:-0.35,arms:-0.05,shoulders:-0.05,hips:-0.15}"),
    ('SISTER dials spread',
     "dials:{height:-0.35,belly:-0.25,arms:-0.30,shoulders:-0.35,hips:0.00}",
     "dials:{height:-0.30,belly:-0.20,arms:-0.35,shoulders:-0.40,hips:0.00}"),

    ('famPaintBody REBUILDS the rig instead of only redrawing',
     """  var keepW = window.G_WORN, keepDials = G.bodyVar;
  try {
    window.G_WORN = member.worn;
    G.bodyVar = member.dials;
    if (typeof BOH_BODYVAR !== 'undefined' && typeof BAKED !== 'undefined') BOH_BODYVAR.apply(BAKED, G.bodyVar);
    drawChar(cv, dir, 'idle', 0);""",
     """  var keepW = window.G_WORN, keepDials = G.bodyVar, keepAge = G.age;
  try {
    window.G_WORN = member.worn;
    G.bodyVar = member.dials;
    G.age = member.age || 'adult';
    /* THE BODY IS REBUILT, NOT JUST RE-DRAWN, and this was the real bug in v1.
       rebuildFromRig() runs ONCE AT BOOT and sets the global RIG; G.age and
       G.bodyVar reach the renderer ONLY through it. Setting them and calling
       drawChar changes NOTHING -- measured: painted height 50px at adult, teen
       AND child alike, while the age transform was correctly moving the pose
       from a 44px stand to 36px. This is the path the body sliders already use.
       The frame caches are keyed on facing/clip/look and know nothing about the
       BODY, so they hand back the previous person unless cleared. */
    rebuildFromRig();
    try { HD_CACHE.map.clear(); } catch(e) {}
    drawChar(cv, dir, 'idle', 0);"""),

    ('famPaintBody puts the PLAYER body back afterwards',
     """    window.G_WORN = keepW; G.bodyVar = keepDials;
    try { if (typeof BOH_BODYVAR !== 'undefined' && typeof BAKED !== 'undefined') BOH_BODYVAR.apply(BAKED, G.bodyVar); } catch(e2){}""",
     """    /* PUT THE PLAYER'S BODY BACK. These are GLOBALS: leaving the sister's child
       rig installed would silently reshape every other surface in the game, and
       it would surface as a rendering bug somewhere with no connection to here. */
    window.G_WORN = keepW; G.bodyVar = keepDials; G.age = keepAge;
    try { rebuildFromRig(); } catch(e2) {}
    try { HD_CACHE.map.clear(); } catch(e3) {}"""),

    ('the cast label says which age each one is',
     "var lbl = document.createElement('div'); lbl.className='famRole'; lbl.textContent = m.role + ' \\u00b7 S';",
     "var lbl = document.createElement('div'); lbl.className='famRole';\n"
     "    var AGEL = (window.BOH_AGE && BOH_AGE.STAGES[m.age||'adult']) ? BOH_AGE.STAGES[m.age||'adult'].label : '';\n"
     "    lbl.textContent = m.role + ' \\u00b7 S';\n"
     "    var agl = document.createElement('div'); agl.className='famDraft'; agl.textContent = AGEL;"),
    ('the age label is actually appended',
     "card.appendChild(stage); card.appendChild(lbl); card.appendChild(nm); card.appendChild(dr);",
     "card.appendChild(stage); card.appendChild(lbl); card.appendChild(agl); card.appendChild(nm); card.appendChild(dr);"),
]

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in EDITS:
    if new in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s — expected exactly 1 match, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('FAMILY AGE UPGRADE: refused to write — %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)

if alpha != before:
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('FAMILY AGE UPGRADE: applied to %s' % ALPHA)
else:
    print('FAMILY AGE UPGRADE: already applied, nothing to write')
