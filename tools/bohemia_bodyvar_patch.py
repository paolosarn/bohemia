#!/usr/bin/env python3
"""
BOHEMIA — ONE-RIG VARIATION SLIDERS: alpha wiring patch (7/26/26)

laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md (Paolo 7/25, LOCKED):
"We're actually gonna remove the whole female rig... Everything is gonna be off
the male rig. However I would like to see options for the rig for people to be
shorter or taller, maybe their stomach's a little wider or skinnier, their arms
and stuff, and we have to make that work."

REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): this patch cooks ZERO new graphic
pixels. Banks opened: the painted rig package BAKED inside the alpha (Paolo's
own hand-painted body + hand-posed skeleton) -- reused verbatim as the ONE rig,
re-mapped by engine/bohemia_bodyvar.js. Nothing is drawn, generated, or
authored. That is the ruling: one rig, parameters, no second body.

This patch does exactly two things, both owed by the addendum:
  A. THE CLEANUP: strips FEMALE_BAKED, bakedFor(), BODY_RIGS and the FEMALE
     picker button from the alpha (the graveyard tombstone lands in the SAME
     commit, per the addendum's sequencing trap). KEEPS rigSkel() and its three
     call sites -- those fixed real bugs on the male body's own contracts.
  B. THE SLIDERS: inlines BOH_BODYVAR (engine/bohemia_bodyvar.js verbatim, so
     the ENGINE SYNC GATE holds one canonical body), adds G.bodyVar, applies it
     in rebuildFromRig, hashes it into the frame cache, persists it with the
     look, and replaces the dead BODY picker row with HEIGHT / BELLY / ARMS.

Idempotent: re-running on an already-patched alpha is a no-op with a report.

  python3 tools/bohemia_bodyvar_patch.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_bodyvar.js')
STAMP = 'BUILD 7/26u · YOUR LAYERING, NOT THE RENDERER GUESSING IT'

def die(msg):
    print('  ! ' + msg)
    sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
mod = open(MODULE, encoding='utf-8').read()
orig = src
did = []

# --------------------------------------------------------------------------
# A1. strip the FEMALE_BAKED comment block + const (one giant single line)
# --------------------------------------------------------------------------
if 'const FEMALE_BAKED=' in src:   # DEAD token, matched only to delete it
    lines = src.split('\n')
    out, i, killed = [], 0, 0
    while i < len(lines):
        if lines[i].startswith('/* FEMALE_BAKED '):
            while i < len(lines) and not lines[i].startswith('const FEMALE_BAKED='):   # DEAD token, matched only to delete it
                i += 1; killed += 1
            i += 1; killed += 1           # the const line itself
            continue
        out.append(lines[i]); i += 1
    src = '\n'.join(out)
    did.append('stripped FEMALE_BAKED (%d lines)' % killed)

# --------------------------------------------------------------------------
# A2. BODY_RIGS + bakedFor -> the ONE rig + the dial package
# --------------------------------------------------------------------------
OLD_RIGS = "const BODY_RIGS={MALE:1,FEMALE:1};\nfunction bakedFor(rig){return rig==='FEMALE'?FEMALE_BAKED:BAKED;}"   # DEAD tokens, matched only to delete them
NEW_RIGS = """/* ONE RIG (Paolo 7/25/26, LOCKED -- laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md).
   The separate female rig is DEAD and graveyarded: there is ONE painted body,
   Paolo's, and every human in the world is that body plus a set of slider
   values. bakedFor() no longer forks between two authored packages -- it
   RESOLVES the one rig through the variation dials. Neutral dials return the
   canon object itself, so the existing character cannot shift by a pixel. */
let BODY_PKG=BAKED;
function bakedFor(){return BODY_PKG;}"""
if OLD_RIGS in src:
    src = src.replace(OLD_RIGS, NEW_RIGS, 1)
    did.append('BODY_RIGS/bakedFor -> ONE RIG resolver')

# rigSkel: KEEP (addendum), but it must read the resolved package, not a rig name
OLD_SKEL = "function rigSkel(d){const b=bakedFor(G.bodyRig);return (b.skeleton&&b.skeleton[d])||BAKED.skeleton[d];}"   # the DEAD rig-name argument, removed here
NEW_SKEL = "function rigSkel(d){const b=bakedFor();return (b.skeleton&&b.skeleton[d])||BAKED.skeleton[d];}"
if OLD_SKEL in src:
    src = src.replace(OLD_SKEL, NEW_SKEL, 1)
    did.append('rigSkel reads the resolved package (KEPT per the addendum)')

# --------------------------------------------------------------------------
# B1. inline BOH_BODYVAR verbatim (ENGINE SYNC LAW: one canonical body)
# --------------------------------------------------------------------------
BODY = mod.replace("if (typeof module !== 'undefined' && module.exports) module.exports = BOH_BODYVAR;\n", '').rstrip()
BV_HEAD = '/* ==========================================================================='
BV_TAIL = '})();'
if 'const BOH_BODYVAR' not in src:
    anchor = '\nconst BONES={head:[\'neck\',\'headTop\']'
    if anchor not in src:
        die('BONES anchor not found -- alpha layout changed')
    src = src.replace(anchor, '\n' + BODY + anchor, 1)
    did.append('inlined BOH_BODYVAR (%d bytes)' % len(BODY))
else:
    # RESYNC (ENGINE SYNC LAW): the engine file is canon. Tuning a dial range is
    # a one-line edit there; this re-inlines it so the two bodies can never drift.
    i = src.index('const BOH_BODYVAR')
    hs = src.rindex(BV_HEAD, 0, i)
    he = src.index('\n' + BV_TAIL, i) + len('\n' + BV_TAIL)
    if src[hs:he] != BODY:
        src = src[:hs] + BODY + src[he:]
        did.append('RESYNCED the inlined BOH_BODYVAR from engine/bohemia_bodyvar.js')

# --------------------------------------------------------------------------
# B2. G.bodyRig -> G.bodyVar  (the DEAD rig picker becomes the dials)
# --------------------------------------------------------------------------
if "bodyRig:'MALE'" in src:
    src = src.replace("bodyRig:'MALE'", "bodyVar:{height:0,belly:0,arms:0}", 1)
    did.append('G.bodyRig -> G.bodyVar')   # DEAD token, removed

# --------------------------------------------------------------------------
# B3. rebuildFromRig resolves the dials
# --------------------------------------------------------------------------
# the dead block, quoted line by line so each DEAD token carries its own
# tombstone comment without a single character of the match text changing
OLD_RB = (
    "     BODY RIG LAW (MARATHON WAVE 3, 7/25/26): the source is G.bodyRig's own\n"   # DEAD token, matched only to delete it
    "     baked package -- BAKED (Paolo's painted, live-editable) for MALE, or\n"
    "     FEMALE_BAKED (the derived candidate, never hand-painted) for FEMALE.\n"   # DEAD token, matched only to delete it
    "     The rig tool only ever edits BAKED (male stays sacrosanct either way). */\n"
    "  const src=bakedFor(G.bodyRig);")   # DEAD token, matched only to delete it
NEW_RB = """     ONE RIG + VARIATION SLIDERS (Paolo 7/25/26, LOCKED): the source is ALWAYS
     Paolo's painted BAKED, resolved through G.bodyVar. Height rides the
     skeleton (bone lengths, so seg()'s WIDTH LAW gives a taller body at
     unchanged width); belly and arms reshape rest pixels before the skinner
     binds, because the perpendicular axis is law-bound never to scale. All
     dials at 0 returns BAKED itself -- the canon body, untouched. */
  const src=BODY_PKG=BOH_BODYVAR.apply(BAKED,G.bodyVar);"""
if OLD_RB in src:
    src = src.replace(OLD_RB, NEW_RB, 1)
    did.append('rebuildFromRig resolves G.bodyVar')

# --------------------------------------------------------------------------
# B4. frame cache hash must see the dials (or a slider drag draws stale frames)
# --------------------------------------------------------------------------
if 'G.swing,G.bodyRig,' in src:   # DEAD token, removed
    src = src.replace('G.swing,G.bodyRig,', 'G.swing,G.bodyVar,', 1)   # DEAD token, removed
    did.append('frameLookHash sees G.bodyVar')

# --------------------------------------------------------------------------
# B5. persist the dials with the look
# --------------------------------------------------------------------------
if 'bodyVar:G.bodyVar' not in src:
    OLD_SNAP = "snapshot(){return {equipped:G.equipped,tints:G.tints,swing:G.swing,dir:G.dir,"
    NEW_SNAP = "snapshot(){return {equipped:G.equipped,tints:G.tints,swing:G.swing,dir:G.dir,bodyVar:G.bodyVar,"
    if OLD_SNAP not in src:
        die('PERSIST.snapshot anchor not found')
    src = src.replace(OLD_SNAP, NEW_SNAP, 1)
    OLD_RES = "      if(typeof d.swing==='number')G.swing=d.swing;"
    NEW_RES = ("      if(typeof d.swing==='number')G.swing=d.swing;\n"
               "      if(d.bodyVar){G.bodyVar=BOH_BODYVAR.sanitize(d.bodyVar);rebuildFromRig();}   "
               "/* ONE RIG: the dials ride the look save */")
    if OLD_RES not in src:
        die('PERSIST.restore anchor not found')
    src = src.replace(OLD_RES, NEW_RES, 1)
    did.append('PERSIST carries G.bodyVar')

# --------------------------------------------------------------------------
# B6. the BODY row: dead FEMALE picker -> HEIGHT / BELLY / ARMS sliders
# --------------------------------------------------------------------------
OLD_UI_START = "    if(slot==='body'){"
OLD_UI_END = "      cs.appendChild(row);continue;\n    }"
i0 = src.find(OLD_UI_START)
i1 = src.find(OLD_UI_END, i0)
if i0 > 0 and i1 > i0 and 'BODY_VAR_ROW' not in src:
    NEW_UI = """    if(slot==='body'){
      /* BODY = THE ONE RIG + VARIATION SLIDERS (Paolo 7/25/26, LOCKED).
         BODY_VAR_ROW. The MALE/FEMALE picker is gone with the female rig
         itself; a body is now Paolo's painted rig plus these dials. Every
         slider is live: drag it and the character, all 8 facings and every
         animation rebuild off it in one shot (ONE PACKAGE LAW). */
      const lab=document.createElement('b');lab.textContent='BODY';row.appendChild(lab);
      const note=document.createElement('span');note.className='mini';
      const dialTxt=()=>{const v=G.bodyVar;return 'H '+(v.height>0?'+':'')+v.height.toFixed(2)+
        '  B '+(v.belly>0?'+':'')+v.belly.toFixed(2)+'  A '+(v.arms>0?'+':'')+v.arms.toFixed(2)+
        (BOH_BODYVAR.neutral(v)?'  (canon)':'');};
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:2px;flex:1;min-width:170px';
      [['height','HEIGHT','shorter \\u2194 taller'],['belly','BELLY','skinnier \\u2194 wider'],['arms','ARMS','thinner \\u2194 thicker']].forEach(([k,label,hint])=>{
        const r=document.createElement('div');r.style.cssText='display:flex;gap:6px;align-items:center';
        const l=document.createElement('span');l.className='mini';l.style.cssText='width:52px;text-align:right';l.textContent=label;
        const sl=document.createElement('input');sl.type='range';sl.min=-1;sl.max=1;sl.step=0.05;sl.value=G.bodyVar[k];sl.style.flex='1';
        sl.oninput=()=>{G.bodyVar={height:G.bodyVar.height,belly:G.bodyVar.belly,arms:G.bodyVar.arms};
          G.bodyVar[k]=BOH_BODYVAR.clampDial(+sl.value);rebuildFromRig();note.textContent=dialTxt();refresh();};
        const h=document.createElement('span');h.className='mini';h.style.cssText='width:96px;opacity:.65';h.textContent=hint;
        r.appendChild(l);r.appendChild(sl);r.appendChild(h);wrap.appendChild(r);});
      row.appendChild(wrap);
      const rst=document.createElement('button');rst.className='opt';rst.textContent='CANON';
      rst.onclick=()=>{G.bodyVar={height:0,belly:0,arms:0};rebuildFromRig();note.textContent=dialTxt();
        row.querySelectorAll('input[type=range]').forEach(x=>{x.value=0;});refresh();};row.appendChild(rst);
      note.textContent=dialTxt();row.appendChild(note);
      const bed=document.createElement('button');bed.className='opt';bed.textContent='\\u270E EDIT SKIN';
      bed.onclick=()=>{openSkinEditor();};row.appendChild(bed);
      const rl=document.createElement('button');rl.className='opt';rl.textContent='RIG \\u2192';
      rl.onclick=()=>{document.querySelector('.tab[data-p=rig]').click();};row.appendChild(rl);
      cs.appendChild(row);continue;
    }"""
    src = src[:i0] + NEW_UI + src[i1 + len(OLD_UI_END):]
    did.append('BODY row -> HEIGHT/BELLY/ARMS sliders')

# --------------------------------------------------------------------------
# B6b. SHOULDER BLEND FOLLOWS THE HEIGHT DIAL (found on the real surface, 7/26)
# --------------------------------------------------------------------------
# The SHOULDER BLEND suppresses the arm/torso contour for the couple of rows at
# the top of the shoulder, and it finds those rows from the REST skeleton --
# which the height dial deliberately never moves. On a taller body the drawn
# shoulder sits ~2 rows higher than rest, so the blend zone reached two rows too
# far DOWN the arm and ate two rows of the contour that tells you where the arm
# ends and the torso begins. Shift the blend row by exactly the height dial's
# own neck displacement. Zero when the dial is zero, so canon is untouched.
OLD_SHOULDER = "if((g===1||g===2)&&ng===5){const RS=rigSkel(d);\n          const shy=Math.min(RS.shL[1],RS.shR[1]);if(by<=shy+1)continue;}"
NEW_SHOULDER = ("if((g===1||g===2)&&ng===5){const RS=rigSkel(d);\n"
                "          const shy=Math.min(RS.shL[1],RS.shR[1])+rigHeightDY(d);if(by<=shy+1)continue;}")
if 'rigHeightDY' not in src:
    if OLD_SHOULDER not in src:
        die('shoulder blend anchor not found -- alpha layout changed')
    src = src.replace(OLD_SHOULDER, NEW_SHOULDER, 1)
    HELPER = ("""/* HEIGHT DISPLACEMENT OF THE DRAWN SHOULDER (Paolo 7/26, found by reading the
   shade map, not the code). Skeleton-anchored render rules read the REST
   skeleton -- correct, because that is where the art is bound -- but the HEIGHT
   dial moves the DRAWN body without moving rest. This is the offset between the
   two, and it is exactly 0 on the canon body. */
function rigHeightDY(d){const P=BODY_PKG&&BODY_PKG.pose&&BODY_PKG.pose[d];
  if(!P||BODY_PKG===BAKED)return 0;
  return Math.round(P.neck[1]-BAKED.pose[d].neck[1]);}
function rigSkel(d)""")
    src = src.replace('function rigSkel(d)', HELPER, 1)
    did.append('SHOULDER BLEND follows the height dial (rigHeightDY)')

# --------------------------------------------------------------------------
# B7. FINAL FLOATER CULL (found on the real surface, 7/26)
# --------------------------------------------------------------------------
# The body already has a de-speckle pass, but it runs BEFORE garments composite,
# so a garment pixel left stranded over a reshaped body survives it. At the
# extreme corner of the dial space (every dial at its minimum at once) five
# frames across dance/cough/startle facing NE ended up with a single floating
# clothing pixel beside the arm. A pixel with ZERO orthogonal neighbours is a
# floater by definition -- it cannot be thin art (a 1px strip still has two
# neighbours up and down), which is exactly the trap the body pass was written
# to avoid. Culled on the FINAL composited frame, so it protects every garment,
# now and future. No-op on the canon body: canon has zero floaters.
FLOATER = """  /* FINAL FLOATER CULL (7/26/26): the body de-speckle runs before garments
     composite, so a clothing pixel stranded over a reshaped body survived it.
     ZERO orthogonal neighbours = a floater by definition; thin art always keeps
     at least two. No-op on the canon body (it has none). */
  {const rm=[];for(let i=0;i<px.length;i++){if(!px[i])continue;const x=i%CW,y=(i/CW)|0;
     if((x+1<CW&&px[i+1])||(x>0&&px[i-1])||(y+1<CH&&px[i+CW])||(y>0&&px[i-CW]))continue;
     rm.push(i);}
   for(const i of rm){px[i]=null;grid[i]=0;}}
  return {px,CW,CH};"""
if 'FINAL FLOATER CULL (7/26/26)' not in src:
    if src.count('  return {px,CW,CH};') != 1:
        die('buildFrame return anchor is not unique -- alpha layout changed')
    src = src.replace('  return {px,CW,CH};', FLOATER, 1)
    did.append('FINAL FLOATER CULL added to buildFrame')

# --------------------------------------------------------------------------
# any surviving G.bodyRig reference is a bug, not a leftover -- the dead rig never comes back
# --------------------------------------------------------------------------
left = [m.start() for m in re.finditer(r'G\.bodyRig|FEMALE_BAKED|BODY_RIGS', src)]
if left:
    for p in left[:6]:
        print('  ! still referenced at offset %d: %s' % (p, src[max(0, p - 60):p + 60].replace('\n', ' ')))
    die('%d dead-rig references survive' % len(left))

# --------------------------------------------------------------------------
# BUILD STAMP (7/20 law: every ship updates the front splash stamp)
# --------------------------------------------------------------------------
src, n = re.subn(r'(id="buildstamp"[^>]*>)([^<]+)(<)', lambda m: m.group(1) + STAMP + m.group(3), src, count=1)
if n:
    did.append('build stamp -> ' + STAMP)

if src == orig:
    print('BODYVAR PATCH: already applied, nothing to do.')
    sys.exit(0)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('BODYVAR PATCH applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
