#!/usr/bin/env python3
"""
V234 -- THE FIGHT DRAWS AT THE PHONE'S REAL PIXELS  (COMBAT, [house tiles back] step one, [device canvas])

REUSE CHECK: nothing is cooked. The ground is the same street bank (COOK's cooked tiles, 44 and 88 px),
built at the size the phone can actually show; no bank file is opened here.

PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people dont look good man its
all fucked up." The coordinator's reading (rule 46f, records/BOHEMIA_PAOLO_COMBAT_IS_FUCKED_UP_THE_TILES_
BELOW_THE_PEOPLE_10_1_26.md): "the whole board drawn at CSS size so every painted pixel is a 3x3 block
on his phone... [device canvas] is step one of [house tiles back] from this round." And the row: the
walk's banks are authored at 42.9 px a metre and the board drew 16.3, so his art arrived 2.6x too
coarse.

THE CAUSE IS MINE: V224 put the fight's canvas at ONE backing pixel per CSS pixel, copied from the
street, to stop the person halving on the glass. That fixed his size and threw away two thirds of the
phone's pixels each way.

THE MOVE: the canvas's backing store is the phone's real pixels (devicePixelRatio, an integer up to 3,
so a pixel is never a fraction), and EVERY RULE STAYS IN SCREEN UNITS. The canvas reports its CSS size
to the game, and the context multiplies every transform the game sets by that ratio, so the person
is still 112 on the glass, a house still 196, and every number every gate reads is unchanged. Under
it, the ground is BUILT at the real pixels: a lot's street cells, a road tile and the standing house
are made at ratio x their size and drawn back at their screen size, 1:1 on the phone. The floor's
cached picture is made the same way. Nothing about who can be shot, where, or when moves.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FIGHT_AT_THE_PHONES_PIXELS__'

EDITS = [
 # A. the virtual canvas: backing at the device ratio, the game sees CSS units
 ("""const cv=document.getElementById('cv'),ctx=cv.getContext('2d');""",
  """const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
/* ===== V234 __THE_FIGHT_AT_THE_PHONES_PIXELS__ (COMBAT, [house tiles back] step one) ==========
   PAOLO 10/1: "the tiles below the people dont look good." Every painted pixel was a 3x3 block on
   his phone because V224 put this canvas at one backing pixel per CSS pixel. Now the BACKING STORE
   is the phone's real pixels (FD, an integer, 1 to 3) and EVERY RULE STAYS IN SCREEN UNITS: the
   canvas reports its CSS size, and the context multiplies each transform the game sets by FD. The
   person is still 112 on the glass and a house still 196; what changes is how many of the phone's
   pixels draw them. hiDPI() is applied to this canvas and to the floor's cached picture. */
let FD=1;
const _CWg=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width'),
      _CHg=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'height'),
      _STf=CanvasRenderingContext2D.prototype.setTransform;
function hiDPI(c,x){ if(c.__hiDPI)return; c.__hiDPI=true;
  Object.defineProperty(c,'width',{configurable:true,get(){ return Math.round(_CWg.get.call(c)/FD); },set(v){ _CWg.set.call(c,Math.round(v*FD)); }});
  Object.defineProperty(c,'height',{configurable:true,get(){ return Math.round(_CHg.get.call(c)/FD); },set(v){ _CHg.set.call(c,Math.round(v*FD)); }});
  x.setTransform=function(a,b,cc,d,e,f){ if(typeof a==='number')return _STf.call(x,a*FD,b*FD,cc*FD,d*FD,e*FD,f*FD); return _STf.call(x,a); };
  x.resetTransform=function(){ return _STf.call(x,FD,0,0,FD,0,0); };
  x.setTransform(1,0,0,1,0,0); }
function realPx(c){ return [_CWg.get.call(c),_CHg.get.call(c)]; }
/* THE SAFETY VALVE. Measured in the container, which paints in SOFTWARE: the game's own work per
   frame is unchanged (draw() 1.5 ms before, 1.6 ms after) and the frame rate fell 49 -> 16 because
   the painting is nine times the pixels; a phone paints on its graphics chip. That is not proven
   on HIS phone from here, so the fight watches itself: if 90 frames run under 40 a second, it steps
   the backing store down one ratio (3 -> 2 -> 1) and says so in G._fdDrop. A fast phone keeps every
   pixel; a slow one keeps its speed. */
function fdWatch(){ const n=performance.now();
  /* ONLY A SETTLED FIGHT IS MEASURED: loading is slow on every phone (PLUMBER measured 13 s at ~10 fps
     on a phone-shaped boot), and a valve that read the boot would throw away pixels for good. So: the
     cover phase only, 4 s after the fight was set up, and TWO slow windows in a row. */
  if(G.phase!=='cover'||G.over||G.ks){ G._fdLast=null; G._fdDts=[]; return; }
  if(G._fdArm==null||G._fdArmKey!==(G.ledger&&G.ledger.fights)){ G._fdArmKey=(G.ledger&&G.ledger.fights); G._fdArm=n+4000; G._fdBad=0; G._fdLast=null; G._fdDts=[]; }
  if(n<G._fdArm){ G._fdLast=n; return; }
  if(G._fdLast!=null){ const dt=n-G._fdLast;
    if(dt>0&&dt<1000){ (G._fdDts||(G._fdDts=[])).push(dt);
      if(G._fdDts.length>=90){ const s=G._fdDts.slice().sort((a,b)=>a-b), med=s[45]; G._fdDts=[];
        G._fdBad=(med>25)?(G._fdBad||0)+1:0;
        if(G._fdBad>=2&&FD>1){ G._fdBad=0; G._fdDrop=(G._fdDrop||[]).concat([{from:FD,fps:+(1000/med).toFixed(1)}]); G._fdCap=FD-1; try{ size(); }catch(_e){} } } } }
  G._fdLast=n; }
hiDPI(cv,ctx);"""),

 ("""  if(!(w>0&&h>0)){ setTimeout(size,60); return; }
  if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; } }""",
  """  if(!(w>0&&h>0)){ setTimeout(size,60); return; }
  /* V234: the backing store at the phone's real pixels; the game still reads w x h */
  const _fd=Math.max(1,Math.min(G._fdCap||3,3,Math.round(window.devicePixelRatio||1)));
  if(_fd!==FD){ FD=_fd; _CWg.set.call(cv,0); try{ _stCache={}; _stCacheT=-1; }catch(_e){} try{ for(const k in _LOTP)delete _LOTP[k]; }catch(_e){} try{ _shC={}; _shK=''; }catch(_e){} }
  if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; ctx.setTransform(1,0,0,1,0,0); } }"""),

 # B. the floor's cached picture at the same real pixels, blitted at its screen size
 ("""    if(!_FLC) _FLC=document.createElement('canvas');""",
  """    if(!_FLC){ _FLC=document.createElement('canvas'); hiDPI(_FLC,_FLC.getContext('2d')); }   /* V234 */"""),
 ("""  x.drawImage(_FLC,0,0); x.restore();""",
  """  x.drawImage(_FLC,0,0,W,H); x.restore();   /* V234: at its screen size, which is 1:1 on the phone */"""),

 # C. the ground tiles built at the real pixels
 ("""  const _bank=(px>44&&(STREET_IMG2X[kind]||[])[idx])?STREET_IMG2X:STREET_IMG;
  const src=(_bank[kind]||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=px;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=(px<(_bank===STREET_IMG2X?88:44));
  if(rot){ g.translate(px/2,px/2); g.rotate(rot*Math.PI/2); g.translate(-px/2,-px/2); }
  g.drawImage(src,0,0,px,px);""",
  """  const _rp=px*FD;   /* V234: built at the phone's real pixels, drawn back at px */
  const _bank=(_rp>44&&(STREET_IMG2X[kind]||[])[idx])?STREET_IMG2X:STREET_IMG;
  const src=(_bank[kind]||[])[idx]; if(!src)return null;
  const c=document.createElement('canvas'); c.width=c.height=_rp;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=(_rp<(_bank===STREET_IMG2X?88:44));
  if(rot){ g.translate(_rp/2,_rp/2); g.rotate(rot*Math.PI/2); g.translate(-_rp/2,-_rp/2); }
  g.drawImage(src,0,0,_rp,_rp);"""),
 ("""  const n=lotSub(); px=Math.max(n,Math.round(px||0)); const key=kind+'|'+face+'|'+n+'|'+px;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const sub=px/n;            /* a street cell, at the size the camera actually shows */
  const c=document.createElement('canvas'); c.width=c.height=px;""",
  """  const n=lotSub(); px=Math.max(n,Math.round(px||0)); const key=kind+'|'+face+'|'+n+'|'+px+'|'+FD;
  if(_LOTP[key]!==undefined)return _LOTP[key];
  const sub=px*FD/n;         /* a street cell, at the size the PHONE actually shows (V234) */
  const c=document.createElement('canvas'); c.width=c.height=px*FD;"""),
 ("""      if(_lp){ x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2)); }
      else if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2)); }""",
  """      if(_lp){ x.drawImage(_lp,Math.floor(sx2),Math.floor(sy2),_px,_px); }   /* V234: real pixels, screen size */
      else if(_st){ x.drawImage(_st,Math.floor(sx2),Math.floor(sy2),_px,_px); }"""),

 # D. the standing house baked at the real pixels
 ("""  const c=document.createElement('canvas'); c.width=W2; c.height=W2+WH+2;
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
  const u=W2/196;                                   /* 1 at the ruled 196 px house */""",
  """  const c=document.createElement('canvas'); c.width=W2*FD; c.height=(W2+WH+2)*FD;   /* V234 */
  const g=c.getContext('2d'); g.imageSmoothingEnabled=false; g.scale(FD,FD);
  const u=W2/196;                                   /* 1 at the ruled 196 px house */"""),
 ("""    x.drawImage(bk,Math.floor(p[0]-t2*0.5),Math.floor(p[1]-t2*0.5+dz));""",
  """    x.drawImage(bk,Math.floor(p[0]-t2*0.5),Math.floor(p[1]-t2*0.5+dz),bk.width/FD,bk.height/FD);   /* V234 */"""),
("""  if(innerWidth<2||innerHeight<2)return;
  ctx.setTransform(1,0,0,1,0,0);               /* HARD RESET V15: no transform survives a frame */""",
  """  if(innerWidth<2||innerHeight<2)return;
  try{ fdWatch(); }catch(_e){}   /* V234: the safety valve */
  ctx.setTransform(1,0,0,1,0,0);               /* HARD RESET V15: no transform survives a frame */"""),
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
        print('  the fight already draws at the phone\'s pixels')
        return
    if '__HOUSE_SIZED_NOT_HOUSE_FILLED__' not in blob:
        sys.exit('GUARD: V233 is not in this blob; V234 is written on top of it')
    for old, new in EDITS:
        n = blob.count(old)
        if n != 1:
            sys.exit('ANCHOR: expected 1, found %d for %r' % (n, old[:80]))
        blob = blob.replace(old, new, 1)
    parse_check(blob, 'the fight blob')
    enc = base64.b64encode(blob.encode('utf-8')).decode('ascii')
    alpha = alpha.replace("const COMBAT_B64='" + m.group(1) + "'",
                          "const COMBAT_B64='" + enc + "'", 1)
    open(ALPHA, 'w', encoding='utf-8').write(alpha)
    print('V234 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
