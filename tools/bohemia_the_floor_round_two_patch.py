#!/usr/bin/env python3
"""
V236 -- THE FLOOR, ROUND TWO: NO GRID, NO DISCS, COVER NO WIDER THAN A HOUSE
(COMBAT, [house tiles back], rule 46f)

REUSE CHECK: nothing is cooked. The pickups are three small rectangles each; the lit tiles are the
ground a value lighter; the cover is the same wall sprite at an honest width. No bank file is opened.

PAOLO 10/1: "the tiles below the people dont look good." Rule 46f: nothing on the ground that is not
the ground; a place is its square tile, lit in the ground's own colour. V235's own record named what
it left, before anybody else could: the cover 1.8 houses of wall, the lit tiles' frame reading as a
grid, the drops and the grenade still discs. Reading the source for those found one more, and it is
the grid he saw:

  THE GRID AROUND HIM   "my 3x3 self-cover ring": the eight tiles around him, each a dark square with a
                        drawn outline, EVERY FRAME, since V7 (its 'up' branch is hard-wired false, so
                        all it ever drew was the outline). The movement ring in the HUD (V226) already
                        says where he can step. Gone.
  THE LIT TILE'S FRAME  litTile's one-pixel border made a grid where several tiles were lit. Fill only.
  THE GRENADE           a pulsing red disc, a dashed ring and the fuse in 0.85-tile digits on the street.
                        Now its tile, lit a dangerous red, pulsing faster as the fuse runs; the count
                        is said by the pulse, not printed on the floor.
  THE PICKUPS           a pulsing green disc, a dashed ring and the word AMMO, PLATE, TAKE or KEY. Now
                        its tile, lit, with the THING itself on it, sized off a body: a small case with a
                        brass top (a key), steel (a plate), cloth (anything else).
  THE COVER'S WIDTH     a piece's half-width is 0.9 x its r, and r was rolled 0.45 to 1.15 TILES on every
                        board -- written when a tile was a body (1.5 m, a crate). On the house board that
                        is a wall up to two HOUSES long (24 m). On the house board r is now at most 0.56,
                        so no piece is wider than one house; the same dice, the same order.

NO DAMAGE BEFORE THE DIAL: no chance, hit or damage number moves. What changes is what is painted, and
how wide a piece of cover is on the house board (it blocks what it is drawn as, which is the rule V54
and COVER THAT READS already hold).
"""
import base64
import os
import re
import subprocess
import sys
import tempfile

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FLOOR_ROUND_TWO__'

EDITS = [
 # the lit tile: fill only, and a tint for danger
 ("""function litTile(x,p,ring,a){
  const t=ring, x0=Math.round(p[0]-t*0.5), y0=Math.round(p[1]-t*0.5), s=Math.round(t);
  x.save(); x.fillStyle='rgba(255,236,204,'+a.toFixed(3)+')'; x.fillRect(x0,y0,s,s);
  const lw=Math.max(1,1/Math.max(0.05,uzEff()));   /* one screen pixel at any zoom */
  x.strokeStyle='rgba(255,240,214,'+Math.min(0.6,a*2.2).toFixed(3)+')'; x.lineWidth=lw;
  x.strokeRect(x0+lw*0.5,y0+lw*0.5,s-lw,s-lw); x.restore(); }""",
  """function litTile(x,p,ring,a,rgb){
  /* V236 __THE_FLOOR_ROUND_TWO__: FILL ONLY. The one-pixel frame made a grid where several tiles were
     lit at once; the light itself is the tile. rgb tints it (danger), the default is the ground's own. */
  const t=ring, x0=Math.round(p[0]-t*0.5), y0=Math.round(p[1]-t*0.5), s=Math.round(t);
  x.save(); x.fillStyle='rgba('+(rgb||'255,236,204')+','+a.toFixed(3)+')'; x.fillRect(x0,y0,s,s); x.restore(); }
/* V236: a thing lying on a lit tile, sized off a body (a small case with a coloured top) */
function groundThing(x,p,top){ const b=bodyScale(), w=14*b, h=9*b;
  x.save(); x.fillStyle='rgba(0,0,0,0.35)'; x.fillRect(Math.round(p[0]-w*0.5),Math.round(p[1]+h*0.35),Math.round(w),Math.round(3*b));
  x.fillStyle='#2a241c'; x.fillRect(Math.round(p[0]-w*0.5),Math.round(p[1]-h*0.5),Math.round(w),Math.round(h));
  x.fillStyle=top; x.fillRect(Math.round(p[0]-w*0.5),Math.round(p[1]-h*0.5),Math.round(w),Math.round(3*b));
  x.restore(); }"""),

 # the grid around him: gone
 ("""    x.beginPath();x.rect(cxx-ring*0.5+1.5,cyy-ring*0.5+1.5,ring-3,ring-3);x.fill();x.stroke();""",
  """    if(up){ x.beginPath();x.rect(cxx-ring*0.5+1.5,cyy-ring*0.5+1.5,ring-3,ring-3);x.fill();x.stroke(); }   /* V236: 'up' is hard-wired false, so this drew eight outlined squares round him every frame -- the grid; the HUD ring says where he can step */"""),

 # the grenade: its tile lit red, pulsing with the fuse; no disc, no digits
 ("""    const gp=fieldPos(G.grenade,W,H,cx,cy), gx2=gp[0], gy2=gp[1], rr=ring*1.35, pu=0.5+0.5*Math.sin(performance.now()*0.012);
    x.save(); x.fillStyle='rgba(232,60,40,'+(0.13+pu*0.13).toFixed(3)+')'; x.beginPath(); x.arc(gx2,gy2,rr*0.72,0,7); x.fill();""",
  """    const gp=fieldPos(G.grenade,W,H,cx,cy), gx2=gp[0], gy2=gp[1], rr=ring*1.35, pu=0.5+0.5*Math.sin(performance.now()*0.012);
    { const _fz=Math.max(1,G.grenade.fuse|0), _pz=0.5+0.5*Math.sin(performance.now()*0.004*(1+3/_fz));   /* V236: faster as the fuse runs */
      litTile(x,gp,ring,0.12+0.14*_pz,'232,80,56'); groundThing(x,gp,'#5a5a4a'); }
    if(false){
    x.save(); x.fillStyle='rgba(232,60,40,'+(0.13+pu*0.13).toFixed(3)+')'; x.beginPath(); x.arc(gx2,gy2,rr*0.72,0,7); x.fill();"""),
 ("""    x.fillText(String(G.grenade.fuse),gx2,gy2); x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }""",
  """    x.fillText(String(G.grenade.fuse),gx2,gy2); x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); } }"""),

 # the pickups: the tile lit, the thing on it; no disc, no words
 ("""    const dp=fieldPos(_d,W,H,cx,cy), rr4=ring*1.35, pu4=0.5+0.5*Math.sin(performance.now()*0.005);
    x.save(); x.fillStyle='rgba(95,200,110,'+(0.10+pu4*0.10).toFixed(3)+')';""",
  """    const dp=fieldPos(_d,W,H,cx,cy), rr4=ring*1.35, pu4=0.5+0.5*Math.sin(performance.now()*0.005);
    litTile(x,dp,ring,0.08+0.05*beatLift()); groundThing(x,dp,_d.key?'#c8a050':(_d.plate?'#8a9096':'#6d5a44'));   /* V236 */
    if(false){
    x.save(); x.fillStyle='rgba(95,200,110,'+(0.10+pu4*0.10).toFixed(3)+')';"""),
 ("""    x.textAlign='center'; x.textBaseline='middle'; if(_lab)x.fillText(_lab,dp[0],dp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }""",
  """    x.textAlign='center'; x.textBaseline='middle'; if(_lab)x.fillText(_lab,dp[0],dp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); } }"""),

 # the faction motif under the board: always covered by the floor, so never drawn on the house board
 ("""  x.save(); x.globalAlpha=0.5;
  let i=0;
  for(let gy=0;gy<H+T;gy+=T){ for(let gx=0;gx<W+T;gx+=T){ i++;""",
  """  if(!houseOn()){   /* V236: under the house board's floor this was ~85 strokes a frame nobody sees (V223 photographed it covered); at the phone's real pixels it is paint for nothing */
  x.save(); x.globalAlpha=0.5;
  let i=0;
  for(let gy=0;gy<H+T;gy+=T){ for(let gx=0;gx<W+T;gx+=T){ i++;"""),
 ("""  }}
  x.restore();
  /* JUICE.B FLOOR PULSE""",
  """  }}
  x.restore(); }
  /* JUICE.B FLOOR PULSE"""),
 # HIS VOTE 9/30 on combat-a-street-of-houses-9-30, UP: "a street has to be a tile bro, if it's a freeway
 # it might be three or four" (rule 46g). The street is ONE tile of road; a sidewalk each side; the lots.
 ("""    if(wx===ST_H_ROAD0||wx===ST_H_ROAD0+1)return 'road';
    if(wx===ST_H_ROAD0-1||wx===ST_H_ROAD0+2)return 'walk';""",
  """    if(wx===ST_H_ROAD0)return 'road';   /* V236: HIS VOTE 9/30, "a street has to be a tile" (rule 46g); a freeway is three or four, when the cutter reads the road class */
    if(wx===ST_H_ROAD0-1||wx===ST_H_ROAD0+1)return 'walk';"""),
 ("""(wx-(ST_H_ROAD0+3))""", """(wx-(ST_H_ROAD0+2))"""),
 ("""      const side=houseOn()?(_sd?ST_H_ROAD0:ST_H_ROAD0+1):(_sd?ST_LANE_L-1:ST_LANE_R);""",
  """      const side=houseOn()?ST_H_ROAD0:(_sd?ST_LANE_L-1:ST_LANE_R);   /* V236: one tile of road, the same one draw */"""),
 # the cover's width: never wider than a house on the house board
 ("""      const r=Math.max(0.45,Math.min(1.15,bulk+(Math.random()-0.5)*0.30));""",
  """      let r=Math.max(0.45,Math.min(1.15,bulk+(Math.random()-0.5)*0.30));
      if(houseOn())r=Math.min(r,0.56);   /* V236 __THE_FLOOR_ROUND_TWO__: rolled for a body-sized tile; on the house board no piece is wider than one house (half-width 0.9r) */"""),
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
        print('  the floor is already on round two')
        return
    if '__NOTHING_ON_THE_GROUND_BUT_THE_GROUND__' not in blob:
        sys.exit('GUARD: V235 is not in this blob; V236 is written on top of it')
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
    print('V236 applied to the fight blob in', ALPHA)


if __name__ == '__main__':
    main()
