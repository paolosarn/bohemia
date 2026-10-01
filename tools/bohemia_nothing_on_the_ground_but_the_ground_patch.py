#!/usr/bin/env python3
"""
V235 -- NOTHING ON THE GROUND BUT THE GROUND  (COMBAT, [house tiles back], rule 46f)

REUSE CHECK: nothing is cooked. The cover's new top face is the same 'wall' tile of the fight's own
street bank (COOK's cooked tiles) its face was already cut from, lit a value; the lit tiles are the
ground itself, a value lighter. No bank file is opened here.

PAOLO 10/1: "combat is soooo fucked up bro holy shit the tiles below the people dont look good man its
all fucked up." What the coordinator saw under the fighters (records/BOHEMIA_PAOLO_COMBAT_IS_FUCKED_UP_
THE_TILES_BELOW_THE_PEOPLE_10_1_26.md): pale blue OVALS (13.9% of the board), tan CARDBOARD blocks for
cover, translucent DIAMONDS, a flat RED DISC, the words ROSA and CLEAR on top of each other. Rule 46f,
LOCKED: "NOTHING ON THE GROUND THAT IS NOT THE GROUND. No pads, ovals, diamonds, discs, stickers or
words painted on the board. Reach lights the SQUARE tile (37f) in the ground's own colour; the aim cue
lives on the HUD ring; names live in the HUD, never on the floor."

EACH ONE, FOUND IN THE SOURCE BEFORE IT WAS TOUCHED:
  OVALS + CARDBOARD  the cover sprite: a wall-tile face under an ELLIPSE LID painted #7a94a8 (low,
                     the blue ovals) or #94836a (tall, the tan), on an elliptical shadow. Now the top is
                     a FLAT FACE cut from the same wall tile, a value lighter (lit from above), and the
                     shadow is the piece's own rectangle. Low still reads low: it is shorter.
  DIAMONDS + CLEAR   V193's ground read, drawn as blue diamonds with the best tile's worth in words.
                     Now the SQUARE TILE ITSELF is lit in the ground's own colour, the best one a value
                     more on the beat; no words.
  RED DISC           V148's "can he reach you" pip, sized off the TILE PITCH (house-sized on the house
                     board), so a 25 px red disc floated 137 px above a man's feet, alone on the street.
                     Now it is sized and placed off HIS BODY: a small dot just over his head, on him.
  ROSA (+ her oval)  her name drawn on the board and a green ellipse painted under her feet. Both go;
                     her health bar stays on her (it is on her body, not the floor). Her name is in the
                     HUD line every time she acts (allySay already writes ALLY_NAME there).
  OUT and HOLD       the way out and the held place, each a pulsing blue disc, a dashed ring and a word.
                     Now each is its tile, lit in the ground's own colour (the way out the strongest
                     light on the board, on the beat); the HUD already says WAY OUT and how far.
  THE RANGE RING     a dashed red circle round the man you aim at. The aim cue lives on the HUD ring.

NO DAMAGE BEFORE THE DIAL: nothing about who can shoot whom, where, or when moves. Only what is
painted on the floor.
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__NOTHING_ON_THE_GROUND_BUT_THE_GROUND__'

LIT = """/* ===== V235 __NOTHING_ON_THE_GROUND_BUT_THE_GROUND__ (COMBAT, rule 46f) =====================
   PAOLO 10/1: "the tiles below the people dont look good." Rule 46f: no pads, ovals, diamonds,
   discs or words painted on the board; a place is shown by lighting ITS SQUARE TILE in the ground's
   own colour. One helper, so every lit tile on the board is the same light. */
function litTile(x,p,ring,a){
  const t=ring, x0=Math.round(p[0]-t*0.5), y0=Math.round(p[1]-t*0.5), s=Math.round(t);
  x.save(); x.fillStyle='rgba(255,236,204,'+a.toFixed(3)+')'; x.fillRect(x0,y0,s,s);
  const lw=Math.max(1,1/Math.max(0.05,uzEff()));   /* one screen pixel at any zoom */
  x.strokeStyle='rgba(255,240,214,'+Math.min(0.6,a*2.2).toFixed(3)+')'; x.lineWidth=lw;
  x.strokeRect(x0+lw*0.5,y0+lw*0.5,s-lw,s-lw); x.restore(); }
function beatLift(){ return Math.pow(1-(_bpmPhase||0),2); }
function coverSprite("""

EDITS = [
 # the helper, placed ahead of coverSprite
 ("""function coverSprite(""", LIT),

 # cover: flat lit top face, rectangular shadow
 ("""  g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath();
  g.ellipse(ox,oy+s*0.5,shx,shh,0,0,7); g.fill();""",
  """  g.fillStyle='rgba(0,0,0,0.25)';   /* V235: the piece's own shadow, square to the grid, never an oval */
  g.fillRect(Math.round(ox-hw),Math.round(oy+s*0.5-shh*0.6),Math.round(w+Math.min(hw*0.4545,s*0.25)),Math.round(shh*1.2));"""),
 ("""  g.fillStyle=low?'#7a94a8':'#94836a';
  g.beginPath(); g.ellipse(ox,fy,hw,lid,0,0,7); g.fill();""",
  """  /* V235: THE TOP IS A FLAT FACE OF THE SAME WALL, lit from above -- never a painted oval lid
     (#7a94a8 blue on the low pieces was 13.9% of the board). Low still reads low: it is shorter. */
  { var _tt=null; try{ _tt=streetTile('wall',0,TPX,0); }catch(_e){}
    if(_tt){ g.save(); g.beginPath(); g.rect(fx,fy-lid,w,lid); g.clip();
      for(var _ux=0; _ux<w; _ux+=TP) g.drawImage(_tt,fx+_ux,fy-lid,TP,TP); g.restore(); }
    g.fillStyle='rgba(255,236,204,0.22)'; g.fillRect(fx,fy-lid,w,lid);
    g.fillStyle='rgba(20,16,12,0.55)'; g.fillRect(fx,fy-1,w,1); }"""),
 ("""      x.fillStyle=(P.tall===false)?'#7a94a8':'#94836a'; x.beginPath(); x.ellipse(pxs,_ty,s*0.55,s*0.2,0,0,7); x.fill();""",
  """      x.fillStyle=(P.tall===false)?'#6b6152':'#7d705c'; x.fillRect(pxs-s*0.55,_ty-s*0.2,s*1.1,s*0.2);   /* V235: no oval lid, even before the art decodes */"""),

 # the ground read: the square tile, lit, no words
 ("""        const _s=ring*0.40;
        x.beginPath();
        x.moveTo(_p[0],_p[1]-_s*0.62); x.lineTo(_p[0]+_s,_p[1]);
        x.lineTo(_p[0],_p[1]+_s*0.62); x.lineTo(_p[0]-_s,_p[1]); x.closePath();""",
  """        /* V235: the square tile itself, lit in the ground's own colour; no diamond */
        litTile(x,_p,ring,_bst?(0.10+0.08*beatLift()):0.06); continue;
        const _s=ring*0.40;
        x.beginPath();
        x.moveTo(_p[0],_p[1]-_s*0.62); x.lineTo(_p[0]+_s,_p[1]);
        x.lineTo(_p[0],_p[1]+_s*0.62); x.lineTo(_p[0]-_s,_p[1]); x.closePath();"""),
 ("""      if(_rd.bestTile){
        const _p=fieldPos({ea:Math.atan2(_rd.bestTile.dy,_rd.bestTile.dx),""",
  """      if(false&&_rd.bestTile){   /* V235: no words on the floor (rule 46f) */
        const _p=fieldPos({ea:Math.atan2(_rd.bestTile.dy,_rd.bestTile.dx),"""),

 # the hold and the way out: their tiles, lit
 ("""    const col=(near<(G.hold.r||HOLD_R)*2.4)?'232,60,40':'106,168,232';
    x.save(); x.fillStyle='rgba('+col+','+(0.10+pu3*0.10).toFixed(3)+')';""",
  """    const col=(near<(G.hold.r||HOLD_R)*2.4)?'232,60,40':'106,168,232';
    litTile(x,hp,ring,0.10+0.06*beatLift());   /* V235: the held place is its tile, lit; no disc, no word */
    if(false){
    x.save(); x.fillStyle='rgba('+col+','+(0.10+pu3*0.10).toFixed(3)+')';"""),
 ("""    x.textAlign='center'; x.textBaseline='middle'; x.fillText('HOLD',hp[0],hp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }""",
  """    x.textAlign='center'; x.textBaseline='middle'; x.fillText('HOLD',hp[0],hp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); } }"""),
 ("""    const xp=fieldPos(G.exit,W,H,cx,cy), rr5=ring*1.35, pu5=0.5+0.5*Math.sin(performance.now()*0.004);
    x.save(); x.fillStyle='rgba(106,168,232,'+(0.10+pu5*0.10).toFixed(3)+')';""",
  """    const xp=fieldPos(G.exit,W,H,cx,cy), rr5=ring*1.35, pu5=0.5+0.5*Math.sin(performance.now()*0.004);
    litTile(x,xp,ring,0.14+0.10*beatLift());   /* V235: the way out is its tile, the strongest light on the board, on the beat */
    if(false){
    x.save(); x.fillStyle='rgba(106,168,232,'+(0.10+pu5*0.10).toFixed(3)+')';"""),
 ("""    x.textAlign='center'; x.textBaseline='middle'; x.fillText('OUT',xp[0],xp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }""",
  """    x.textAlign='center'; x.textBaseline='middle'; x.fillText('OUT',xp[0],xp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); } }"""),

 # the range ring round the man you aim at: the aim cue lives on the HUD ring
 ("""      x.save(); x.strokeStyle='rgba(232,60,40,0.30)'; x.lineWidth=2; x.setLineDash([6,7]);
      x.beginPath(); x.arc(_rp[0],_rp[1],_rr,0,7); x.stroke(); x.setLineDash([]); x.restore(); } }""",
  """      if(false){ x.save(); x.strokeStyle='rgba(232,60,40,0.30)'; x.lineWidth=2; x.setLineDash([6,7]);   /* V235: no ring on the floor; the aim cue is the HUD ring */
      x.beginPath(); x.arc(_rp[0],_rp[1],_rr,0,7); x.stroke(); x.setLineDash([]); x.restore(); } } }"""),

 # the red disc: sized and placed off his body
 ("""    if(!e.melee){ const _hot=inHisRange(e), _pr=Math.max(3,ring*0.22), _py=ey+MASS_DY-ring*0.85;""",
  """    if(!e.melee){ const _bs=bodyScale(), _hot=inHisRange(e), _pr=Math.max(3*_bs,5*_bs), _py=ey-84*_bs-9*_bs;   /* V235: a small dot just over HIS head, sized off his body, never a disc on the street */"""),

 # her health bar, sized and placed off her body, not the house-sized tile
 ("""    if(!A.downed){ const _w=_ar*1.8, _f=Math.max(0,Math.min(1,A.hp/A.max));
      x.fillStyle='rgba(20,16,12,0.6)';
      x.fillRect(_ap[0]-_w/2,_top-_ar*0.35,_w,3);
      x.fillStyle=_f>0.5?'#8fe89a':(_f>0.25?'#e8c88a':'#e8593a');
      x.fillRect(_ap[0]-_w/2,_top-_ar*0.35,_w*_f,3); }""",
  """    if(!A.downed){ const _w=34*_S, _bh=3*_S, _by=_top-8*_S, _f=Math.max(0,Math.min(1,A.hp/A.max));   /* V235: off her body */
      x.fillStyle='rgba(20,16,12,0.6)';
      x.fillRect(_ap[0]-_w/2,_by,_w,_bh);
      x.fillStyle=_f>0.5?'#8fe89a':(_f>0.25?'#e8c88a':'#e8593a');
      x.fillRect(_ap[0]-_w/2,_by,_w*_f,_bh); }"""),
 # Rosa: no name on the board, no oval under her feet
 ("""    x.lineWidth=2; x.beginPath();
    x.ellipse(_ap[0],_sole,_ar*1.05,_ar*0.44,0,0,Math.PI*2); x.stroke();
    x.restore();""",
  """    x.restore();   /* V235: no oval painted under her feet (rule 46f) */"""),
 ("""    x.fillStyle='rgba(20,16,12,0.72)';
    x.fillText(ALLY_NAME,_ap[0]+1,_ly+1);
    x.fillStyle=A.downed?'#e8593a':'#8fe89a';
    x.fillText(ALLY_NAME,_ap[0],_ly);""",
  """    /* V235: her name lives in the HUD (allySay writes it there), never on the board */"""),
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
        print('  the ground is already only the ground')
        return
    if '__THE_FIGHT_AT_THE_PHONES_PIXELS__' not in blob:
        sys.exit('GUARD: V234 is not in this blob; V235 is written on top of it')
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
    print('V235 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
