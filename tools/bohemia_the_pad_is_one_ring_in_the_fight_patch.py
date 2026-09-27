#!/usr/bin/env python3
"""
V226 -- THE FIGHT'S PAD IS THE ONE CUT RING  (COMBAT lane, [one mode], rule 24)

PAOLO 9/21 IN THE VOTE TAB, LOCKED, rule 24: "teleporting shit not part of the universe,
THE BUTTONS CHANGING, no consistency... one game mode, not teleporting to different game
modes" and "a UI that's not consistent for every second of the game."

MEASURED FIRST, on the one driver (rule 14g), walking into a real fight on the alpha and
photographing both sides one tap apart:

    THE WALK    cityFrame  shown 390x802     13 things he can read
    THE FIGHT   combatFrame shown 390x802    19 things he can read
    WORDS THAT SURVIVED THE START OF THE FIGHT: 0

Not one thing on his screen is the same. That is the row, in a number.

------------------------------------------------- AND ONE OF THEM IS A RULING HE LOCKED

The photographs put the two movement controls side by side, and they are the same control
drawn twice:

    THE WALK    ONE ring around his face, sawn into eight segments with hairline cuts,
                tan arrows on near-black (#pad / #padring, the city's own).
    THE FIGHT   EIGHT LOOSE CIRCLES around the fire button, 28 px each, labelled with
                the letters N NE E SE S SW W NW (buildMoveRing, Paolo 7/3/26).

PAOLO 9/7, LOCKED, after picking option 1 off his own judge sheet: "I want the action
button to be only surrounded by one other circle, AND THAT CIRCLE IS CUT INTO how many
parts of the directions that we need. I DON'T WANT THEM TO BE INDEPENDENT CIRCLES."

The walked city built it that round. THE FIGHT NEVER GOT THE RULING -- the shape he
rejected on 9/7 is still the shape his thumb meets the moment a fight starts. Newest date
wins, and the ruling is about the control, not about which document it is drawn in.

--------------------------------------------------------------------- WHAT IT DOES

The fight's mover becomes THE CITY'S CONTROL, not a copy of it in spirit: the geometry
constants, the wedge maths, the arrow glyphs and every colour value are lifted out of
slices/BOHEMIA_CITY_WORLD.html rather than re-picked here (REUSE-FIRST). Same 180 box,
same C=90 R0=50 R1=86 N=8 GAP=3.5, same #1e1a13 segment on a #2a2418 line, same #d8c49a
arrow, same 44.4% face in the middle of it, same right:6 bottom:6 corner. His thumb finds
the same object in the same place at the same size, in the walk and in the fight.

THE FIRE BUTTON KEEPS EVERYTHING IT SAYS. Its colour is not decoration -- red means
somebody has a clean line on you, amber means one gun is up, green means a real lull, and
the word on it changes between SHOOT, HOLD, ENGAGE, POP OUT and NOTHING TO SHOOT. That is
the fight's own information and rule 24 explicitly allows what the fight ADDS. So the
button is moved and resized to sit where the walk's face sits; nothing it says is touched.
It was already wearing the city's face styling byte for byte (the same radial gradient and
the same box-shadow), which is why only the ring was out of step.

THE VERB BUTTONS ARE RE-MEASURED, NOT NUDGED. V122's own comment says the offset was
measured against pips at R=66 and that anything wider ate two of his directions. The ring
is bigger now (outer radius 86 from the centre), so the same sum is done again against the
new number: a 52 px button clears the ring by the same 14 px it used to.

NO DAMAGE BEFORE THE DIAL: not a reach, a chance, a hit, a turn or a number. doMove(i) is
called with the same index from the same tap. MAP LAW: authors no street. RULE 17: this is
the look, which is the only thing this lane may ship.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_PAD_IS_ONE_RING_IN_THE_FIGHT__'

# ---- the fire button moves to where the walk's face is, and takes its size ----
OLD_FIRE = """  #fire{position:fixed;right:44px;bottom:44px;z-index:60;   /* V24: up-left, the ring never clips */width:92px;height:92px;margin:0;display:block;border-radius:999px;border:none;cursor:pointer;"""

NEW_FIRE = """  /* V226 __THE_PAD_IS_ONE_RING_IN_THE_FIGHT__ (rule 24): the walked city puts his face
     dead centre of a 180 box pinned at right:6 bottom:6, at 44.4% of it (#nav / #mode).
     This is the same face in the same corner at the same size, so his thumb does not
     have to find a new place when a fight starts. 6 + (180-80)/2 = 56. */
  #fire{position:fixed;right:56px;bottom:56px;z-index:60;width:80px;height:80px;margin:0;display:block;border-radius:999px;border:none;cursor:pointer;"""

# ---- the ring itself ----
OLD_RING = """(function buildMoveRing(){
  const wrap=document.createElement('div');wrap.id='movering';
  wrap.style.cssText='position:fixed;right:44px;bottom:44px;width:92px;height:92px;z-index:59;pointer-events:none;';   /* V24 */
  const names=['N','NE','E','SE','S','SW','W','NW'];
  const angs=[-90,-45,0,45,90,135,180,-135];
  for(let i=0;i<8;i++){
    const b=document.createElement('button');b.textContent=names[i];
    const a=angs[i]*Math.PI/180, R=66;
    const bx=46+Math.cos(a)*R-14, by=46+Math.sin(a)*R-14;
    b.style.cssText='position:absolute;left:'+Math.round(bx)+'px;top:'+Math.round(by)+'px;width:28px;height:28px;border-radius:999px;border:1px solid #3a3226;background:rgba(20,16,10,0.72);color:#8a7a5a;font:bold 9px BohemiaBody,sans-serif;pointer-events:auto;cursor:pointer;padding:0;';
    b.addEventListener('click',ev=>{ev.stopPropagation();G.moveIntent=names[i];doMove(i);   /* PILLAR V5: the ring IS movement (Paolo) */
      b.style.borderColor='#c8b892';b.style.color='#e7d8bb';
      setTimeout(()=>{b.style.borderColor='#3a3226';b.style.color='#8a7a5a';},220);});
    wrap.appendChild(b);
  }"""

NEW_RING = """(function buildMoveRing(){
  /* ===== V226 __THE_PAD_IS_ONE_RING_IN_THE_FIGHT__ (COMBAT, [one mode], rule 24) =====
     PAOLO 9/7, LOCKED, picking option 1 off his own sheet: "I want the action button to be
     only surrounded by ONE other circle, and that circle is CUT INTO how many parts of the
     directions that we need. I DON'T WANT THEM TO BE INDEPENDENT CIRCLES."
     The walked city built it that round. THIS DID NOT: eight loose 28 px circles labelled
     N NE E SE S SW W NW, which is the shape he rejected, and it is the first thing his
     thumb meets when a fight starts. Rule 24 is the same complaint in his newer words:
     "the buttons changing, no consistency... one game mode."
     SO THIS IS THE CITY'S CONTROL, not a lookalike. Every constant below is lifted out of
     slices/BOHEMIA_CITY_WORLD.html's own ring builder rather than re-picked here: the 180
     box, C=90 R0=50 R1=86 N=8 GAP=3.5, the wedge maths, the walk arrows in position order,
     #1e1a13 on #2a2418 with a #d8c49a arrow, the 44.4% face, the right:6 bottom:6 corner.
     A value re-picked here would drift from his the first time either lane tuned one.
     WHAT IS NOT COPIED, ON PURPOSE: the city holds a direction (startHold/endHold) because
     walking is continuous; a fight tile is a house and a tap is one move, so the tap still
     calls doMove(i) with the same index it always did. Nothing about movement changes. */
  const wrap=document.createElement('div');wrap.id='movering';
  wrap.style.cssText='position:fixed;right:6px;bottom:6px;width:180px;height:180px;z-index:59;pointer-events:none;';
  const names=['N','NE','E','SE','S','SW','W','NW'];
  { const NS='http://www.w3.org/2000/svg';
    const C=90, R0=50, R1=86, N=8, GAP=3.5;              /* THEIR numbers, 180 box, face radius 40 */
    const WALK=['\\u2191','\\u2197','\\u2192','\\u2198','\\u2193','\\u2199','\\u2190','\\u2196'];
    const pt=(r,a)=>{ const t=(a-90)*Math.PI/180; return [C+r*Math.cos(t), C+r*Math.sin(t)]; };
    const f=n=>n.toFixed(2);
    const wedge=(a0,a1)=>{ const p0=pt(R1,a0), p1=pt(R1,a1), p2=pt(R0,a1), p3=pt(R0,a0);
      return 'M'+f(p0[0])+','+f(p0[1])
        +'A'+R1+','+R1+' 0 0 1 '+f(p1[0])+','+f(p1[1])
        +'L'+f(p2[0])+','+f(p2[1])
        +'A'+R0+','+R0+' 0 0 0 '+f(p3[0])+','+f(p3[1])+'Z'; };
    const tri=(a,r,s,fill)=>{ const n=document.createElementNS(NS,'path'), P=pt(r,a);
      n.setAttribute('d','M0,'+(-s)+' L'+(s*0.72)+','+(s*0.66)+' L'+(-s*0.72)+','+(s*0.66)+' Z');
      n.setAttribute('fill',fill);
      n.setAttribute('transform','translate('+f(P[0])+','+f(P[1])+') rotate('+a+')');
      return n; };
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('id','padring');
    svg.setAttribute('viewBox','0 0 180 180');
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.setAttribute('style','position:absolute;inset:0;width:100%;height:100%;overflow:visible;touch-action:none;pointer-events:none;');
    const step=360/N, half=GAP/2;
    for(let i=0;i<N;i++){
      const a=i*step;
      const g=document.createElementNS(NS,'g');
      g.setAttribute('class','pb'); g.setAttribute('style','pointer-events:auto;cursor:pointer;');
      g.dataset.dir=names[i];                            /* so a gate can name the segment he pressed */
      const seg=document.createElementNS(NS,'path');
      seg.setAttribute('d',wedge(a-step/2+half, a+step/2-half));
      seg.setAttribute('fill','#1e1a13'); seg.setAttribute('stroke','#2a2418'); seg.setAttribute('stroke-width','1');
      g.appendChild(seg);
      g.appendChild(tri(a,68,9,'#d8c49a'));              /* one triangle, exactly as walking draws it */
      g.addEventListener('click',ev=>{ ev.stopPropagation();
        G.moveIntent=names[i]; doMove(i);                /* PILLAR V5: the ring IS movement (Paolo) */
        seg.setAttribute('fill','#2a2418'); seg.setAttribute('stroke','#5a4a2a');
        setTimeout(()=>{ seg.setAttribute('fill','#1e1a13'); seg.setAttribute('stroke','#2a2418'); },220); });
      svg.appendChild(g);
    }
    wrap.appendChild(svg);
  }"""

# ---- and the verbs are re-measured against the bigger ring ----
OLD_MK = """    b.style.cssText='position:absolute;left:-100px;top:'+dy+'px;width:52px;height:34px;'+"""
NEW_MK = """    /* V226: RE-MEASURED, NOT NUDGED. The sum above is done again against the new ring:
       the wrap is 180 with its centre at 90, the cut ring's outer radius is 86, so a 52 px
       button whose right edge sits at -10 clears it by the same 14 px V122 measured. */
    b.style.cssText='position:absolute;left:-62px;top:'+dy+'px;width:52px;height:34px;'+"""

OLD_VERBS = """  mk('runbtn','RUN','#8a7a5a',6,()=>{ try{audio();}catch(_e){} doRun(); });
  mk('grenbtn2','GREN','#c8a23a',48,()=>{ try{audio();}catch(_e){} doThrow(); });"""
NEW_VERBS = """  mk('runbtn','RUN','#8a7a5a',31,()=>{ try{audio();}catch(_e){} doRun(); });   /* V226: three 34 px buttons on a 42 pitch, centred on the ring's own centre (90) */
  mk('grenbtn2','GREN','#c8a23a',73,()=>{ try{audio();}catch(_e){} doThrow(); });"""

OLD_SWAP = """  mk('swapbtn','ALT','#9ab4d0',90,()=>{ try{audio();}catch(_e){} doSwap(); });"""
NEW_SWAP = """  mk('swapbtn','ALT','#9ab4d0',115,()=>{ try{audio();}catch(_e){} doSwap(); });"""

OLD_MM = """  mm.style.cssText='position:fixed;left:8px;right:8px;bottom:152px;text-align:center;font-size:10px;letter-spacing:1px;font-weight:700;display:none;pointer-events:none;z-index:60;text-shadow:0 1px 5px #000,0 0 10px #000';"""
NEW_MM = """  /* V226: the ring now stands from 6 to 186 off the bottom, so the armed-move line clears it. */
  mm.style.cssText='position:fixed;left:8px;right:8px;bottom:192px;text-align:center;font-size:10px;letter-spacing:1px;font-weight:700;display:none;pointer-events:none;z-index:60;text-shadow:0 1px 5px #000,0 0 10px #000';"""


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES. V214 terminated a JS string and the fight
    stopped defining G; V217's first cut left a block comment open and the last script went
    silent. A guard that checks the text it wrote rather than whether the file still runs is
    not a guard."""
    bodies = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', blob, re.S | re.I)
    if not bodies:
        sys.exit('GUARD %s: no inline scripts found, which cannot be right' % label)
    bad = 0
    for i, b in enumerate(bodies):
        fd, p = tempfile.mkstemp(suffix='.js')
        os.write(fd, b.encode('utf-8'))
        os.close(fd)
        r = subprocess.run(['node', '--check', p], capture_output=True)
        os.unlink(p)
        if r.returncode != 0:
            bad += 1
            print('  SCRIPT %d OF %d DOES NOT PARSE:' % (i + 1, len(bodies)),
                  r.stderr.decode('utf-8', 'replace').strip().splitlines()[-1][:160])
    if bad:
        sys.exit('GUARD %s: %d of %d scripts do not parse' % (label, bad, len(bodies)))
    print('  %s: %d scripts, all parse' % (label, len(bodies)))


def sub(s, old, new, what):
    n = s.count(old)
    if n != 1:
        sys.exit('ANCHOR %s: expected 1, found %d' % (what, n))
    return s.replace(old, new, 1)


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the fight already has the one cut ring')
        return

    blob = sub(blob, OLD_FIRE, NEW_FIRE, 'blob/the face sits where the walk puts it')
    blob = sub(blob, OLD_RING, NEW_RING, 'blob/one cut ring instead of eight circles')
    blob = sub(blob, OLD_MK, NEW_MK, 'blob/the verbs clear the new ring')
    blob = sub(blob, OLD_VERBS, NEW_VERBS, 'blob/the verbs centre on the ring')
    blob = sub(blob, OLD_SWAP, NEW_SWAP, 'blob/ALT with them')
    blob = sub(blob, OLD_MM, NEW_MM, 'blob/the armed-move line clears the ring')

    code = re.sub(r'/\*.*?\*/', '', blob, flags=re.S)
    # THE SHAPE HE REJECTED CANNOT COME BACK. Eight independent circles is the thing the
    # 9/7 ruling names; a border-radius:999px on a 28 px mover is that shape by any name.
    if "width:28px;height:28px;border-radius:999px" in code:
        sys.exit('GUARD: the eight loose circles are still being built')
    for want, why in (("viewBox','0 0 180 180'", 'the city\'s own 180 box'),
                      ("const C=90, R0=50, R1=86, N=8, GAP=3.5", 'their geometry, unchanged'),
                      ("'#d8c49a'", 'their arrow gold'),
                      ("doMove(i)", 'the same move on the same index')):
        if want not in code:
            sys.exit('GUARD: %s is missing (%s)' % (want, why))
    # AND THE FACE IS THE WALK'S FACE: same corner, same fraction of the same box.
    if 'right:56px;bottom:56px;z-index:60;width:80px;height:80px' not in code:
        sys.exit('GUARD: the fire button is not where the walk puts his face')

    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V226 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
