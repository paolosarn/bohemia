#!/usr/bin/env python3
"""
V232 -- A HOUSE IS NEVER SMALLER THAN A MAN  (COMBAT, [house tiles back], round 2)

REUSE CHECK: nothing is cooked. The markers are four strokes and a number in the fight's own
BohemiaBody face, drawn with the palette the fight already uses; no bank file is opened here.

PAOLO 9/28, overworld law s14: "for the combat a tile is as big as a house." Rule 37a: "'tiny
character' means SMALL RELATIVE TO BUILDINGS." Rule 21: the person is one pixel size; the camera
moves the ground, never him.

MEASURED LAST ROUND (records/BOHEMIA_COMBAT_HOUSE_TILES_BACK_THE_ROOF_YOU_STAND_ON_9_28_26.md): the
auto frame (V23, re-derived by V225) sat at its 0.20 floor in 40 of 40 arenas, because it pulls
back until the FARTHEST living enemy fits, and enemies stand up to six houses out. With the man
held at 112 px that drew a house 39 px wide: a house a third of a man. All three rulings above
were being honoured one at a time and broken together.

THE TRADE, DECIDED (rule 39a, "build it, don't ask"): the ground may zoom out only until a house is
as wide as the man. Past that the camera stops, and every living enemy the glass cannot hold is
shown ON ITS EDGE: a chevron where the line from him to that man leaves the glass, and the
distance in houses. That is how the fight keeps its promise that nobody is lost (V23's "Pinch
works, but can't LOSE anyone"): not by shrinking the city under him, but by saying where they are.
Pinching still goes wider; that is his hand, not the camera's choice.

    before  floor 0.20 on every board        a house 39 px beside a 112 px man
    after   floor 112/196 on the house board  a house never under 112 px; body board untouched

NO DAMAGE BEFORE THE DIAL: no chance, hit, reach or turn moves; nothing about who can be shot
changes. Only what the camera shows and what the edge says.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN__'

EDITS = [
 ("""        uzT=Math.max(0.20,Math.min(_ceil,fit)); } }""",
  """        uzT=Math.max(camFloor(ringF),Math.min(Math.max(_ceil,camFloor(ringF)),fit)); } }   /* V232 __A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN__ */"""),

 ("""    ctx.restore(); screenOverlays(ctx,W,H); drawActionLog(ctx,W,H); return; }   /* V32D BOTH EXITS: this is the COVER PHASE path""",
  """    ctx.restore(); drawEdgeMarks(ctx,W,H,cx,cy); screenOverlays(ctx,W,H); drawActionLog(ctx,W,H); return; }   /* V32D BOTH EXITS: this is the COVER PHASE path"""),

 ("""function uzEff(){ return G._uzE!=null?G._uzE:G.userZoom; }""",
  """function uzEff(){ return G._uzE!=null?G._uzE:G.userZoom; }
/* ===== V232 __A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN__ (COMBAT, [house tiles back]) ==============
   MEASURED: the auto frame sat at its 0.20 floor in 40 of 40 arenas, pulling back to hold a man
   six houses out while the man himself stays 112 (rule 21), so a house was drawn 39 px beside
   him. Law s14 (a tile is a house) and rule 37a (tiny means small RELATIVE TO BUILDINGS) cannot
   both hold at that zoom. So on the house board the camera stops where a house is as wide as the
   man; the men the glass cannot hold are shown on its edge (drawEdgeMarks). Body board: 0.20. */
function camFloor(ringF){ return houseOn()?Math.max(0.20,(112*bodyRule())/Math.max(1,ringF)):0.20; }
function drawEdgeMarks(x,W,H,cx,cy){
  G._edgeMarks=[];
  if(!houseOn()||G.inc||G.over||!G.e||G.phase!=='cover')return;
  const uz=uzEff(), pnx=(G.userPan&&G.userPan.x)||0, pny=(G.userPan&&G.userPan.y)||0;
  const k=Math.max(1,cv.width/Math.max(1,cv.getBoundingClientRect().width||cv.width));
  const M=26*k, lef=M, rig=W-M, top=70*k, bot=H-M, TALL=100*k;   /* top clears the three-line banner (measured 6 to 56 px) */
  const scx=(cx-W/2)*uz+W/2+pnx, scy=(cy-H/2)*uz+H/2+pny-TALL*0.5;   /* his chest, on the glass */
  const pu=Math.pow(1-(_bpmPhase||0),2);
  for(const e of G.e){ if(!e||e.dead||e.downed||e.fleeing)continue;
    const p=fieldPos(e,W,H,cx,cy);
    const sx=(p[0]-W/2)*uz+W/2+pnx, sy=(p[1]-H/2)*uz+H/2+pny;   /* his feet */
    if(sx>=0&&sx<=W&&sy-TALL>=0&&sy<=H)continue;                /* the whole man is on the glass */
    const dx=sx-scx, dy=(sy-TALL*0.5)-scy; let t=1e9;
    if(dx>0)t=Math.min(t,(rig-scx)/dx); if(dx<0)t=Math.min(t,(lef-scx)/dx);
    if(dy>0)t=Math.min(t,(bot-scy)/dy); if(dy<0)t=Math.min(t,(top-scy)/dy);
    if(!(t>0&&t<1e8))continue;
    const mx=scx+dx*t, my=scy+dy*t, a=Math.atan2(dy,dx);
    let hot=false; try{ hot=!!(firing(e)||(typeof acquired==='function'&&acquired(e))); }catch(_e){}
    const s=11*k*(1+0.12*pu), col=hot?'#c8452e':'#d8c49a';
    x.save(); x.translate(mx,my); x.rotate(a);
    x.lineCap='square'; x.lineJoin='miter';
    for(const [lw,st] of [[5*k,'#0b0907'],[2.5*k,col]]){ x.lineWidth=lw; x.strokeStyle=st;
      x.beginPath(); x.moveTo(-s*0.6,-s); x.lineTo(s*0.4,0); x.lineTo(-s*0.6,s); x.stroke(); }
    x.restore();
    const d=Math.max(1,Math.round(e.edist)), tx=mx-Math.cos(a)*s*1.9, ty=my-Math.sin(a)*s*1.9;
    x.save(); x.font='bold '+Math.round(13*k)+'px BohemiaBody,sans-serif'; x.textAlign='center'; x.textBaseline='middle';
    x.lineWidth=4*k; x.strokeStyle='#0b0907'; x.strokeText(String(d),tx,ty);
    x.fillStyle=col; x.fillText(String(d),tx,ty); x.restore();
    G._edgeMarks.push({x:+mx.toFixed(1),y:+my.toFixed(1),d,hot}); } }"""),
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
    if MARK + ' (COMBAT' in blob:
        print('  a house is already never smaller than a man')
        return
    if '__HOUSE_TILES_BACK__' not in blob:
        sys.exit('GUARD: V231 is not in this blob; V232 is written on top of it')
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
    print('V232 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
