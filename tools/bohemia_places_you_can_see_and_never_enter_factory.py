#!/usr/bin/env python3
"""BOHEMIA — PLACES YOU CAN SEE AND NEVER ENTER (9/28/26, LIFE + CITY, row [honest grid]).

THE ROUND'S COOK (rule 22), AND IT IS THE ROUND'S FINDING. Rule 34(b), Paolo 9/27: every
floor region connects to the street. Measured across all 72 districts, 25,544 cells of floor
were walled in with no gap -- ground the game draws, and a body can never reach. This sheet
shows six real blocks, each coloured by one answer per cell:

    green   you can walk here from the street
    grey    solid: it stops you
    blue    water or a pit: you do not walk in
    pale    an ISLAND: floor you can only reach across water. Honest.
    RED     SEALED: floor walled in by solid things with no way in. The lie.

*** IT IS THE GAME'S OWN GROUND, NOT A DRAWING. *** Rule 32(f): show it from the game's
camera. Every block comes out of its district's own registered generator with one fixed seed,
and every cell's answer comes from gates/every_floor_region_connects_lib.js -- the same
measurement the gate ratchets, so the picture and the gate cannot disagree.

THE TWO "BEFORE" PANELS ARE HONEST TOO. They are the same generator and the same seed with the
ONE declaration this round changed flipped back in memory (the kerb's solid:false, the pond
berm's solid:false). Nothing else differs between a before and its after, which is the only
way a before/after is evidence and not an illustration.

THE ANALOG HORROR LINE (rule 30): the wrong thing is a place that looks entered and cannot be.
A lit parking lot with its bays painted and nobody able to walk onto it. A field inside a
stadium that nothing in the valley can reach. Bible rule 1, one wrong thing in an ordinary
frame, and the wrong thing is a door that was never drawn.

REUSE CHECK: every grid comes from the registered district generators (engine/bohemia_*.js
through the district kit), every cell's class from the kit's own tileLayer(), and every
reachable / island / sealed answer from gates/every_floor_region_connects_lib.js, the one
measurement the gate uses. Nothing about a block is authored here; this file only colours an
answer and lays six of them out. REFUSES TO RUN if a district is missing or the fixed ones
stopped being fixed.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: flat top-down plans in five quiet
           answer colours, and the only loud colour in the whole sheet is red, used for
           exactly one thing: floor you cannot reach.
  BLDG-03  structure reads. Held: every solid mass keeps one grey so buildings, stands and
           fences stay legible as the places they are; only the answer about the floor moves.
  BLDG-05  structural sanity: a wall meets a roof, a street meets a kerb. Held: nothing is
           moved or redrawn, so every before and after is the same geometry cell for cell.

DETERMINISTIC: fixed seed, no clock. Same bytes every run.

Run from repo root:  python3 tools/bohemia_places_you_can_see_and_never_enter_factory.py
Writes: slices/vote/LIFECITY_PLACES_YOU_CAN_SEE_AND_NEVER_ENTER_9_28.png
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_PLACES_YOU_CAN_SEE_AND_NEVER_ENTER_9_28.png')
SCALE, BAND = 2, 12

COL = {0: (136, 158, 132),   # reachable
       1: (170, 196, 214),   # island
       2: (206, 70, 60),     # SEALED
       3: (70, 70, 80),      # solid
       4: (40, 60, 90)}      # void

# (label, district, the one declaration to flip back for the BEFORE, or None)
PANELS = [
    ('SIGN LOT: BEFORE', 'sign', (8, 'solid', True)),
    ('SIGN LOT: AFTER', 'sign', None),
    ('POND FIELD: BEFORE', 'reclaim', (7, 'solid', True)),
    ('POND FIELD: AFTER', 'reclaim', None),
    ('STADIUM: STILL SEALED', 'stadium', None),
    ('CHAPEL: STILL SEALED', 'chapel', None),
]

HARVEST = r'''
process.exit=function(){}; const log=console.log; console.log=function(){};
const fs=require('fs'),path=require('path');
const ROOT=process.argv[2], OUTF=process.argv[3], JOBS=JSON.parse(process.argv[4]);
const K=require(path.join(ROOT,'engine','bohemia_district_kit.js'));
for(const f of fs.readdirSync(path.join(ROOT,'engine')).filter(n=>n.endsWith('.js'))){ try{require(path.join(ROOT,'engine',f));}catch(e){} }
const R=require(path.join(ROOT,'gates','every_floor_region_connects_lib.js'));
const res=[];
for(const [type,flip] of JOBS){
  const d=K.get(type); if(!d){ res.push({error:type+' is not registered'}); continue; }
  let saved;
  if(flip){ const L=d.legend[flip[0]]; saved=L[flip[1]]; L[flip[1]]=flip[2]; }
  const m=R.measure(K,type);
  if(flip){ const L=d.legend[flip[0]]; if(saved===undefined) delete L[flip[1]]; else L[flip[1]]=saved; }
  if(!m||m.error){ res.push({error:type+': '+(m&&m.error)}); continue; }
  const cls=new Array(m.W*m.H);
  for(let k=0;k<m.W*m.H;k++){
    cls[k]= m.sealedCells[k]?2 : m.islandCells[k]?1 : m.walk[k]?0 : m.VOID[k]?4 : m.STAND[k]?0 : 3; }
  res.push({type:type,W:m.W,H:m.H,sealed:m.sealed,island:m.island,stand:m.stand,cls:cls});
}
fs.writeFileSync(OUTF, JSON.stringify(res));
'''


def harvest():
    """ASK THE GAME. The grids and every answer come out of the engine and the gate's own
    measurement; a python re-implementation would be a second opinion, and a second
    opinion is the bug this whole row is about."""
    tmp = os.path.join(ROOT, '.places_harvest.js')
    outf = os.path.join(ROOT, '.places_harvest.json')
    jobs = [[p[1], list(p[2]) if p[2] else None] for p in PANELS]
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, ROOT, outf, json.dumps(jobs)], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=300)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing.')
        res = json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)
    for r in res:
        if r.get('error'):
            sys.exit('REFUSING: ' + r['error'])
    return res


def label(W, text):
    im = Image.new('RGB', (W, BAND), (24, 24, 28))
    dr = ImageDraw.Draw(im)
    # MEASURED, NOT GUESSED. The last cook's title collided and then ran off its edge
    # because it was sized by eye. A label that does not fit its band is refused.
    if dr.textlength(text) > W - 4:
        sys.exit('REFUSING: the label %r draws %d px in a %d px band.'
                 % (text, dr.textlength(text), W - 4))
    dr.text((2, 1), text, fill=(228, 232, 228))
    return im


def tile(r):
    im = Image.new('RGB', (r['W'], r['H']))
    px = im.load()
    for k, c in enumerate(r['cls']):
        px[k % r['W'], k // r['W']] = COL[c]
    return im


def main():
    res = harvest()
    # THE PICTURE REFUSES TO LIE ABOUT ITS OWN CLAIM. If a BEFORE shows no seal or an AFTER
    # still shows one, the sheet would be illustrating something that is not true any more.
    for (lab, t, flip), r in zip(PANELS, res):
        if flip and r['sealed'] == 0:
            sys.exit('REFUSING: %s shows nothing sealed, so there is no before to show.' % lab)
        if lab.endswith('AFTER') and r['sealed'] != 0:
            sys.exit('REFUSING: %s still has %d sealed cells; the fix did not hold.'
                     % (lab, r['sealed']))
    W, H = res[0]['W'], res[0]['H']
    cols, rows, gap = 2, 3, 2
    sheet = Image.new('RGB', (cols * W + gap, rows * (H + BAND) + (rows - 1) * gap), (14, 14, 16))
    for i, ((lab, t, flip), r) in enumerate(zip(PANELS, res)):
        cx, cy = (i % cols) * (W + gap), (i // cols) * (H + BAND + gap)
        sheet.paste(label(W, lab), (cx, cy))
        sheet.paste(tile(r), (cx, cy + BAND))
    sheet = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)

    print('PLACES YOU CAN SEE AND NEVER ENTER  (row [honest grid], rule 34b)')
    print('  six real blocks off their own generators, one fixed seed, coloured by one')
    print('  answer per cell from the same measurement the gate ratchets.')
    for (lab, t, flip), r in zip(PANELS, res):
        print('    %-22s sealed %5d   island %4d   floor %6d' % (lab, r['sealed'], r['island'], r['stand']))
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
