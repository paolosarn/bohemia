#!/usr/bin/env python3
"""
V240 -- THE GROUND IS 45 DEGREES, AND IT IS COMBAT 2'S FLOOR (COMBAT, rules 56 and 55, [house tiles back])

PAOLO, HIS FIFTH VOTES (rule 56, 9/30 read 10/1): "everything we do is 45 when it comes to the land
underneath" -- THE GROUND IS 45 DEGREES, never a 90-degree bird's eye; and THE SIDEWALK IS REAL-SIZED ("the
sidewalks are way too fucking big... this has to look real first"): a Vegas sidewalk is 4-5 ft against a
37-ft roadway, at most a sixth of its road.

WHAT WAS ON THE BOARD, MEASURED FIRST: the house board drew square cells, straight down, a 90-degree bird's
eye; and the street was three tiles, a 12 m road tile with a 12 m sidewalk tile each side -- a sidewalk
as wide as the road, six times his ruler.

REUSE CHECK: nothing is cooked here. The ground is COMBAT 2's [floor set] round two
(banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt, "camera pitched 45, depth and heights x cos45", 515 x 364
tiles, sidewalk 1.4 m on a 9.21 m roadway), rule 55: they make the floor art, this lane drops it in. The
street is their street_small_ns, a whole street in one tile (his "a street has to be a tile"), so the
cells beside it are lots; the yards are their lot / lot_b; the walls between plots their slab.

THE PROJECTION, house board only (the body board is byte-identical): every FLAT thing squashes north-south
by 364/515 (cos 45, their own ratio): the floor's rows, a lit tile, a roof's top, where a body or a piece
stands, and a tap read back into a tile. Every UPRIGHT thing keeps its height: the man (112, rule 21),
a wall face, cover, a house's front. So the ground reads at 45 and nothing he already ruled the size of
changes size.

AND RULE 57'S LAST LEG: his side down is a loss every frame it is true, even when the code that should have
called it threw first (measured: one fight in three sat 300 s at 0 health, not over).

NO DAMAGE BEFORE THE DIAL: no rule of the fight moves. Distances are in tiles and tiles are still squares
in the world; only how a square is drawn changed.
"""
import base64
import json
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
FSET = 'banks/BOHEMIA_THE_FIGHT_FLOOR_SET_10_1_26.txt'
GROUND = ('street_small_ns', 'lot', 'lot_b', 'slab')
MARK = '__THE_GROUND_IS_45__'


def bank_js():
    d = json.load(open(FSET, encoding='utf-8'))
    if 'street_small_ns' not in [t['id'] for t in d['ground']]:
        sys.exit('BANK: the floor set has no north-south street; this patch draws the one COMBAT 2 baked')
    out = []
    for i in GROUND:
        hit = [t for t in d['ground'] if t['id'] == i]
        if len(hit) != 1:
            sys.exit('BANK: expected one ground tile %r, found %d' % (i, len(hit)))
        if list(hit[0]['px']) != [515, 364]:
            sys.exit('BANK: %r is %r, not the 515 x 364 the 45-degree projection is built for' % (i, hit[0]['px']))
        out.append('%s:"%s"' % (i, hit[0]['b64']))
    return 'const FSET_B64={' + ','.join(out) + '};'


HELPERS = r"""/* ===== V240 __THE_GROUND_IS_45__ (COMBAT, rules 56 and 55) =============================================
   The house board's ground is seen at 45 degrees: flat things squash north-south by COMBAT 2's own
   364/515, upright things keep their height. The ground is their floor set. */
const H45=364/515;
function py45(){ return houseOn()?H45:1; }
__BANK__
const FSET_IMG={}; let FSET_READY=false;
(function(){ const ks=Object.keys(FSET_B64); let left=ks.length;
  ks.forEach(k=>{ const im=new Image(); im.onload=()=>{ FSET_IMG[k]=im; if(--left===0)FSET_READY=true; };
    im.onerror=()=>{ if(--left===0)FSET_READY=true; }; im.src='data:image/png;base64,'+FSET_B64[k]; }); })();
/* which of their tiles a house-board cell is: the road column is their whole street, sidewalks inside it
   at the real 1.4 m; the cells either side and the yards are lots; the walls between plots are slab */
function fsetGround(sk,wx,wy){
  const h=(Math.imul(wx+64,73856093)^Math.imul(wy+64,19349663))>>>0;
  if(sk==='road')return 'street_small_ns';
  if(sk==='walk'||sk==='yard'||sk==='house')return (h&1)?'lot_b':'lot';
  if(sk==='wall')return 'slab';
  return null; }
function fsetPatch(id,pw,ph){
  const im=FSET_IMG[id]; if(!im||!im.naturalWidth)return null;
  const key='F45|'+id+'|'+pw+'|'+ph+'|'+FD; if(_LOTP[key])return _LOTP[key];
  const c=document.createElement('canvas'); c.width=pw*FD; c.height=ph*FD;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false; g.drawImage(im,0,0,c.width,c.height);
  c.__v240=id; _LOTP[key]=c; return c; }
/* a house's roof is flat, so it squashes; its front is upright, so it does not */
const _SH45=new WeakMap();
function standingHouse45(bk,t2){
  let c=_SH45.get(bk); if(c)return c;
  const rw=bk.width, rh=Math.round(t2*FD), rh45=Math.round(t2*H45*FD), fh=bk.height-rh;
  c=document.createElement('canvas'); c.width=rw; c.height=rh45+fh;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  g.drawImage(bk,0,0,rw,rh,0,0,rw,rh45);
  g.drawImage(bk,0,rh,rw,fh,0,rh45,rw,fh);
  c.__v240='house'; _SH45.set(bk,c); return c; }
/* ===== /V240 ===== */
function fieldFloorPaint(x,W,H,cx,cy,t,offx,offy,gx0,gx1,gy0,gy1){ const _P45=py45();"""

EDITS = [
 ("function fieldFloorPaint(x,W,H,cx,cy,t,offx,offy,gx0,gx1,gy0,gy1){", None),
 ("      const sx2=cx+(wx-offx-0.5)*t, sy2=cy+(wy-offy-0.5)*t;",
  "      const sx2=cx+(wx-offx-0.5)*t, sy2=cy+(wy-offy-0.5)*t*_P45;   /* V240: the rows at 45 */"),
 ("      const _lp=(houseOn()&&(_sk==='road'||_sk==='walk'))?xsecPatch(",
  "      const _ph=Math.ceil(t*_P45)+1, _fs=houseOn()?fsetGround(_sk,wx,wy):null, _fp=_fs?fsetPatch(_fs,_px,_ph):null;   /* V240: COMBAT 2's floor (rule 55) */\n"
  "      const _lp=_fp?_fp:(houseOn()&&(_sk==='road'||_sk==='walk'))?xsecPatch("),
 ("      if(_lp){ x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2),_px,_px); }",
  "      if(_lp){ x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2),_px,_ph); }"),
 ("      else if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2),_px,_px); }",
  "      else if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2),_px,_ph); }"),
 ("        x.fillRect(sx2,sy2,t+1,t+1); } } }",
  "        x.fillRect(sx2,sy2,t+1,t*_P45+1); } } }"),
 ("  let _wy0=(Math.min(_c0[1],_c1[1])-cy)/t, _wy1=(Math.max(_c0[1],_c1[1])-cy)/t;",
  "  let _wy0=(Math.min(_c0[1],_c1[1])-cy)/(t*py45()), _wy1=(Math.max(_c0[1],_c1[1])-cy)/(t*py45());   /* V240 */"),
 ("    (typeof STREET_READY!=='undefined'&&STREET_READY)?1:0,\n    uzEff(), G.userPan.x, G.userPan.y,",
  "    (typeof STREET_READY!=='undefined'&&STREET_READY)?1:0,\n    (typeof FSET_READY!=='undefined'&&FSET_READY)?1:0, py45(),   /* V240: the floor set decoding, and the pitch */\n    uzEff(), G.userPan.x, G.userPan.y,"),
 ("  return [cx+Math.cos(e.ea)*rr, cy+Math.sin(e.ea)*rr]; }",
  "  return [cx+Math.cos(e.ea)*rr, cy+Math.sin(e.ea)*rr*py45()]; }   /* V240: where a thing stands, at 45 */"),
 ("  return [Math.round((x-F.cx)/F.ring), Math.round((y-F.cy)/F.ring)]; }",
  "  return [Math.round((x-F.cx)/F.ring), Math.round((y-F.cy)/(F.ring*py45()))]; }   /* V240: a tap read back at 45 */"),
 ("  const t=ring, x0=Math.round(p[0]-t*0.5), y0=Math.round(p[1]-t*0.5), s=Math.round(t);\n  x.save(); x.fillStyle='rgba('+(rgb||'255,236,204')+','+a.toFixed(3)+')'; x.fillRect(x0,y0,s,s); x.restore(); }",
  "  const t=ring, p45=py45(), x0=Math.round(p[0]-t*0.5), y0=Math.round(p[1]-t*p45*0.5), s=Math.round(t), sh=Math.round(t*p45);   /* V240: a lit tile lies flat */\n  x.save(); x.fillStyle='rgba('+(rgb||'255,236,204')+','+a.toFixed(3)+')'; x.fillRect(x0,y0,s,sh); x.restore(); }"),
 ("    const gy=p[1]+t2*0.5+dz0;",
  "    const gy=p[1]+t2*py45()*0.5+dz0;   /* V240 */"),
 ("    x.drawImage(bk,Math.floor(p[0]-t2*0.5),Math.floor(p[1]-t2*0.5+dz),bk.width/FD,bk.height/FD);   /* V234 */",
  "    { const b45=houseOn()?standingHouse45(bk,t2):bk;   /* V240: the roof lies flat at 45, the front stands */\n"
  "      x.drawImage(b45,Math.floor(p[0]-t2*0.5),Math.floor(p[1]-t2*py45()*0.5+dz),b45.width/FD,b45.height/FD); }   /* V234 */"),
 ("function draw(){\n  /* __NOT_ON_SCREEN__",
  "function draw(){\n  /* V240, rule 57 (\"your side down\" ends it): HIS SIDE DOWN IS A LOSS EVEN IF THE CODE THAT SHOULD HAVE CALLED IT\n"
  "     THREW FIRST. Measured: one fight in three sat 300 s with him at 0 health and G.over false (the damage paths run\n"
  "     addWound/wagerBust between the hit and loseGame, unguarded). Checked once a frame, before anything can return. */\n"
  "  if(!G.over&&G.phase!=='over'&&typeof G.pHP==='number'&&G.pHP<=0){ try{ loseGame(); }catch(_e){ G.over=true; G.phase='over'; } }\n"
  "  /* __NOT_ON_SCREEN__"),
]


def parse_check(blob, label):
    """EVERY SCRIPT IN THE BLOB STILL PARSES."""
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


def main():
    alpha = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", alpha)
    if not m:
        sys.exit('COMBAT_B64 not found in the alpha')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in blob:
        print('  the ground is already at 45')
        return
    if '__EVERY_FIGHT_ENDS__' not in blob:
        sys.exit('GUARD: V239 is not in this blob; V240 is written on top of it')
    helpers = HELPERS.replace('__BANK__', bank_js())
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, helpers if new is None else new, 1)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V240 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
