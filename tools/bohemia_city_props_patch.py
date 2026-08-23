#!/usr/bin/env python3
"""
THE VERTICAL IS A MECHANISM, NOT A LAMP. (8/21, WORLD lane.)

This morning's fix taught the valley to stand ONE object up: `c.lamp` -> LAMP_IMG, a
lamp-shaped path from the flag to the sprite, three sprites wide. It was the right fix and
it is the wrong shape to keep, because the very next thing anybody wants -- a bin at the
kerb, a cone in the road, a tyre in the wash -- would mean `c.bin` -> BIN_IMG, `c.cone` ->
CONE_IMG, and a fourth copy of the same eight lines every time. FACTORY LAW: a thing you
will need many of gets a mechanism, not a special case.

SO THE FLAG BECOMES A FAMILY. `c.post = {p:'bin', v:2}` and the collector carries the
family with the cell. The lamp keeps working exactly as it does today (`c.lamp` is mapped
to family 'lamp' at the collector, so every shipped lamp is byte-for-byte the same draw),
and every family after it is a bank entry plus a row in one table.

    ONE TABLE, WHOLE VALLEY. A district legend that NAMES a bin gets a bin -- the same
    trick that lit forty-two districts' streetlights this morning, generalised. The table
    is legend name -> family, so authoring content in a district module is now the ONLY
    thing a new prop needs; nothing in this page has to change again.

SIZE IS DECLARED, NOT MEASURED. Every master in the corpus is capped at 96px, so a traffic
cone and a dumpster arrive the same pixel height and would stand the same height in the
world. PROP_FP (in the emitted sibling) says what each object IS, in cells: a cone is
knee-high, a lamp is three cells. `rise` is how far above its footing it reaches, which is
what lets a standing prop occlude what is behind it -- the render rule the corpus standing
set has carried since 7/10 and that nothing in this game has ever honoured.

THE NIGHT GLOW STAYS WHERE IT BELONGS. It is asked only of the lamp family and still only
when POWER says the circuit is live. A bin does not glow, and CLUSTERED POWER /
LIGHT=TERRITORY is untouched.

REUSE CHECK: cooks no pixels. It draws banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt (shopped
from the corpus HD tile repo, vetted against PURPLE RESERVATION and ACT ONE ONLY) through
slices/BOHEMIA_CITY_PROPS.js, and it keeps drawing Paolo's approved V11 lamp bodies for the
lamp family.

  python3 tools/bohemia_city_props_patch.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'

BLOCKS = [
    # ---- 1. load the sibling bank, build the images, and hold the name->family table
    ('__A_VERTICAL_IS_A_FAMILY__',
     '<script src="BOHEMIA_CITY_TILES.js"></script>',
     True,
     """<script src="BOHEMIA_CITY_PROPS.js"></script><!-- __A_VERTICAL_IS_A_FAMILY__ the street
     furniture bank (20 corpus objects, 11 families). Beside the page, not in it, for the same
     reason TP_TILES is (8/6, repo budget): 354 KB of art that never changes should not ride
     inside the one file every session rewrites. __A_VERTICAL_IS_A_FAMILY__ END -->"""),

    # ---- 2. the registry itself
    ('__A_VERTICAL_IS_A_FAMILY_REG__',
     'function realizeCell(gx,gy){',
     False,
     """/* __A_VERTICAL_IS_A_FAMILY_REG__ -- ONE TABLE, WHOLE VALLEY, and it is the same trick
   that lit every streetlight in the game this morning: a district legend that NAMES a thing
   gets the thing. Authoring content in a district module is the only step a new prop needs;
   nothing here changes again.
   The lamp is deliberately NOT in this table -- it has its own matcher (__lampTile) that
   already refuses towers and masts, and it keeps its own flag so every lamp shipped today
   draws byte-for-byte the same. */
const PROP_IMG = (function(){ var out={};
  if(typeof PROP_B64==='undefined') return out;
  for(var k in PROP_B64){ out[k]=PROP_B64[k].map(function(b){
    var im=new Image(); im.src='data:image/png;base64,'+b; return im; }); }
  return out; })();
var PROP_NAME = [
  /* a legend name that matches -> the family that stands up for it. Ordered: the first
     match wins, so the specific patterns come before the loose ones. */
  [/dumpster|skip\\b/i,                              'dumpster'],
  [/trash|garbage|refuse|waste bin|\\bbin\\b/i,       'bin'],
  [/garbage bag|refuse sack|\\bbags?\\b/i,           'bag'],
  [/\\bbench\\b/i,                                   'bench'],
  [/bollard|wheel stop/i,                           'bollard'],
  [/traffic cone|\\bcone\\b/i,                       'cone'],
  [/jersey barrier|barricade|road closed/i,         'barricade'],
  /* A LIT BARREL IS A CLAIM, NOT A DECORATION, so it gets its own row ABOVE the dead one.
     All 12 banked fire barrels are ACTIVELY BURNING (measured: 5-10% flame pixels each), and
     a fire in this valley means somebody is here RIGHT NOW keeping warm and holding this
     spot -- LIGHT=TERRITORY, and nobody patrols the dark. WHO HOLDS WHAT GROUND IS PAOLO'S
     (MECHANISM-MINE / CONTENTS-PAOLO'S), so the family is wired and NOTHING PLACES ONE: no
     district authors the name today, so nothing draws, which is the correct default. The day
     he says there are people at an intersection it is one legend line, not a build. */
  [/fire ?barrel|burn barrel|brazier/i,             'firebarrel'],
  [/oil drum|\\bdrum\\b|\\bbarrel\\b/i,             'barrel'],
  [/\\btyres?\\b|\\btires?\\b/i,                      'tyre'],
  [/pallet|\\bcrate\\b/i,                            'pallet'],
  [/mailbox|post box|letter box/i,                  'mailbox']
];
function __propFamily(entry){
  var n=String((entry&&entry.name)||''); if(!n) return null;
  /* a TOWER or a MAST is never one of these, same refusal the lamp matcher makes */
  if(/tower|mast|floodlight/i.test(n)) return null;
  for(var i=0;i<PROP_NAME.length;i++) if(PROP_NAME[i][0].test(n)) return PROP_NAME[i][1];
  return null;
}
/* __A_VERTICAL_IS_A_FAMILY_REG__ END */
"""),

    # ---- 3. the kit branch asks the table
    ('__A_VERTICAL_IS_A_FAMILY_KIT__',
     "    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';",
     True,
     """    /* __A_VERTICAL_IS_A_FAMILY_KIT__ -- ONE PER BLOB, top-left anchored, exactly as the
       lamp does it: a two-tile blob must not stand two objects in the same spot. */
    /* A CAR IS ITS OWN SHAPE, AND IT IS NOT A STANDING PROP. Thirty-odd districts author a
       kind:'vehicle' tile and the kit maps vehicle -> layer:'prop', so every dead car in the
       valley has been a flat coloured square while 20 approved top-down wrecks sat in
       banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt since 7/18, never drawn.
       ONE CAR PER 2x4 SUB-BLOCK, not one per blob. Districts author cars as 2x4 blobs -- but
       medical parks them shoulder to shoulder and six of its blobs merge into 5x6, which as
       one blob would draw ONE CAR SIX METRES WIDE. Walking left and up to the sub-block
       origin and emitting on a 2x4 lattice handles both without ever looking at a whole blob:
       a lone car gets one sprite, a merged rank gets one per car. The run lengths give the
       real extent so a 2x3 stall draws a 2x3 car instead of overhanging the kerb. */
    if(!c.lamp && entry && entry.kind==='vehicle' && PROP_IMG.car && PROP_IMG.car.length){
      /* THE LATTICE FOLLOWS THE BLOB, because the plot may be TURNED. Districts are authored
         canonical-south and rotated to whatever street they front (kit rotateToStreet), so a
         rank of cars authored 2 wide x 4 long arrives 4 wide x 2 long half the time. A fixed
         2x4 lattice cut those in half and drew two squat 2x2 cars side by side -- measured on
         the running page: a 4x2 rank came back as w:2,h:2 twice, and the sprite squashed into
         a square is exactly what it looked like. So find the run BOTH WAYS through this cell,
         let the longer one be the car's length, and step the lattice along it. */
      var _ox=lx; while(_ox>0 && m.kit[ly*FN+_ox-1]===code) _ox--;
      var _ex=lx; while(_ex<FN-1 && m.kit[ly*FN+_ex+1]===code) _ex++;
      var _oy=ly; while(_oy>0 && m.kit[(_oy-1)*FN+lx]===code) _oy--;
      var _ey=ly; while(_ey<FN-1 && m.kit[(_ey+1)*FN+lx]===code) _ey++;
      var _lie=(_ex-_ox) > (_ey-_oy);            /* the rank lies ACROSS, not up the page */
      var _sx=_lie?4:2, _sy=_lie?2:4;
      if((((lx-_ox)%_sx)===0) && (((ly-_oy)%_sy)===0)){
        var _cw=Math.min(_sx, _ex-lx+1), _chh=Math.min(_sy, _ey-ly+1);
        var _cvh=(Math.imul(gx,2654435761)^Math.imul(gy,40503))>>>0;
        c.post={p:'car', v:_cvh%PROP_IMG.car.length, w:_cw, h:_chh};
      }
    }
    if(!c.lamp && !c.post){ var _pf=__propFamily(entry);
      if(_pf && PROP_IMG[_pf] && PROP_IMG[_pf].length){
        var _pw=(lx>0)?(m.kit[ly*FN+lx-1]===code):false;
        var _pn=(ly>0)?(m.kit[(ly-1)*FN+lx]===code):false;
        if(!_pw&&!_pn){ var _ph=(Math.imul(gx,2654435761)^Math.imul(gy,40503))>>>0;
          c.post={p:_pf, v:_ph%PROP_IMG[_pf].length}; }
      }
    }
    /* __A_VERTICAL_IS_A_FAMILY_KIT__ END */
"""),

    # ---- 4. the collector carries the family
    ('__A_VERTICAL_IS_A_FAMILY_COLLECT__',
     '    if(c.lamp)ch2.posts.push([i2,y]);',
     False,
     """    /* __A_VERTICAL_IS_A_FAMILY_COLLECT__ -- the lamp is mapped onto the general path so
       there is ONE collector and one draw, and so every lamp shipped this morning keeps its
       exact footprint (PROP_FP.lamp is the 1.5 x 3 rise 2 it already drew at). */
    if(c.lamp) ch2.posts.push([i2,y,'lamp',(i2+y)%3]);
    else if(c.post) ch2.posts.push([i2,y,c.post.p,c.post.v,c.post.w,c.post.h]);
    /* __A_VERTICAL_IS_A_FAMILY_COLLECT__ END */
"""),
    # ---- 4b. the suburb is NOT on the kit path (m.sub, a hand-written per-code branch),
    # so it needs its own case -- the same split the streetlight hit this morning.
    ('__A_VERTICAL_IS_A_FAMILY_SUB__',
     "    else if(v===12){ c.s='#4a463f'; c.walk=false; c.lamp=1; }",
     True,
     """    /* __A_VERTICAL_IS_A_FAMILY_SUB__ -- THE BINS. The district he spawns in is the one
       district that is not on the kit path, so the name->family table cannot reach it and it
       says the family here instead. Code 14 is a wheeled collection cart: solid, standing,
       beside the garage on most lots and out at the kerb on the ones that had already rolled
       them out for a collection that never came. */
    /* THE CARS THAT NEVER LEFT. Same blob-following logic the kit path uses, reading m.sub
       instead: find the sub-block origin, emit ONE car per 2x4 (or 4x2) and give it the real
       extent so a short drive gets a short car instead of one overhanging the kerb. */
    else if(v===16){ c.s='#5a5f63'; c.walk=false;
      if(typeof PROP_IMG!=='undefined' && PROP_IMG.car && PROP_IMG.car.length){
        var _sox=lx; while(_sox>0 && m.sub[ly*FN+_sox-1]===16) _sox--;
        var _sex=lx; while(_sex<FN-1 && m.sub[ly*FN+_sex+1]===16) _sex++;
        var _soy=ly; while(_soy>0 && m.sub[(_soy-1)*FN+lx]===16) _soy--;
        var _sey=ly; while(_sey<FN-1 && m.sub[(_sey+1)*FN+lx]===16) _sey++;
        var _slie=(_sex-_sox) > (_sey-_soy);
        var _ssx=_slie?4:2, _ssy=_slie?2:4;
        if((((lx-_sox)%_ssx)===0) && (((ly-_soy)%_ssy)===0)){
          var _sh=(Math.imul(tx*FN+lx,2654435761)^Math.imul(ty*FN+ly,40503))>>>0;
          c.post={p:'car', v:_sh%PROP_IMG.car.length,
                  w:Math.min(_ssx,_sex-lx+1), h:Math.min(_ssy,_sey-ly+1)}; }
      } }
    else if(v===15){ c.s='#6b4a2e'; c.walk=false;
      var _fh=(Math.imul(tx*FN+lx,2654435761)^Math.imul(ty*FN+ly,40503))>>>0;
      var _fp2=(typeof PROP_IMG!=='undefined'&&PROP_IMG.firebarrel)?PROP_IMG.firebarrel.length:1;
      c.post={p:'firebarrel', v:_fh%_fp2}; }
    else if(v===14){ c.s='#55565a'; c.walk=false;
      var _bh=(Math.imul(tx*FN+lx,2654435761)^Math.imul(ty*FN+ly,40503))>>>0;
      var _bp=(typeof PROP_IMG!=='undefined'&&PROP_IMG.bin)?PROP_IMG.bin.length:1;
      c.post={p:'bin', v:_bh%_bp}; }
    /* __A_VERTICAL_IS_A_FAMILY_SUB__ END */
"""),
]

# ---- 5. the draw: family-aware, footprint-aware, and the glow stays a LAMP thing
DRAW_OLD = """    if(ch.posts&&ch.posts.length)for(const [px2,py2] of ch.posts){
      const im=LAMP_IMG[(px2+py2)%LAMP_IMG.length];
      if(im.complete&&im.naturalWidth) g.drawImage(im, bx+px2*C-C*0.25, by+(py2-2)*C, C*1.5, C*3);
      if(night){"""
DRAW_NEW = """    if(ch.posts&&ch.posts.length)for(const [px2,py2,pfam,pvar,pw,ph] of ch.posts){
      /* __A_VERTICAL_IS_A_FAMILY_DRAW__ -- one draw for every standing object in the game.
         The family picks the sprite pool and the FOOTPRINT; a 96px master cannot say how big
         a thing is in the world, so PROP_FP does. `rise` is how far above the footing cell it
         reaches, which is what makes it occlude what is behind it. */
      let _fam=pfam||'lamp';
      /* __A_FIRE_IS_WHERE_THE_GRID_IS_NOT__ (Paolo 8/21: "Ofc ppl will warm themselves by
         barrel fire in act one"). This is the CLUSTERED POWER law made visible in daylight.
         The valley measures 94.5% dark -- 12% of circuits live, owned, the network eerily
         perfect. A STREETLIGHT is what burns on the share somebody OWNS. A BARREL is what
         burns on all the rest, where everybody else is. So the same authored tile draws a
         BURNING drum on a dead block and a COLD RUSTED one on a live block, because nobody
         breaks up furniture to keep warm on a street that still has electricity. One tile,
         two readings, and you can tell whose ground you are standing on by looking at it. */
      const _pTX=((cx<<4)+px2)>>5, _pTY=((cy<<4)+py2)>>5;
      const _onGrid=(_fam==='firebarrel')&&POWER.at(_pTX,_pTY).live;
      if(_onGrid) _fam='barrel';
      const _pool=(_fam==='lamp')?LAMP_IMG:((typeof PROP_IMG!=='undefined'&&PROP_IMG[_fam])||null);
      let _fp=(typeof PROP_FP!=='undefined'&&PROP_FP[_fam])||[1.5,3,2];
      /* AN EXTENT BEATS A DEFAULT. Most props are one object of one size, but a car is
         whatever its stall is, so the cell may carry its own w/h in cells. */
      if(pw) _fp=[pw,ph,0];
      const im=_pool?_pool[(pvar==null?(px2+py2):pvar)%_pool.length]:null;
      if(im&&im.complete&&im.naturalWidth){
        if(pw&&pw>ph){
          /* THE MASTERS ARE ALL NOSE-UP. A stall that is wider than it is deep holds a car
             lying ACROSS it, so it turns a quarter -- drawn about the footprint's centre so
             it still fills the stall it was parked in. */
          const _mx=bx+px2*C+(C*pw)/2, _my=by+py2*C+(C*ph)/2;
          g.save(); g.translate(_mx,_my); g.rotate(Math.PI/2);
          g.drawImage(im, -(C*ph)/2, -(C*pw)/2, C*ph, C*pw);
          g.restore();
        } else {
          g.drawImage(im, bx+px2*C-C*(_fp[0]-1)/2*(pw?0:1), by+(py2-_fp[2])*C, C*_fp[0], C*_fp[1]);
        }
      }
      /* THE GLOW IS A LAMP THING. A bin does not light a street, and CLUSTERED POWER /
         LIGHT=TERRITORY is a claim about who owns a block -- never a decoration on furniture. */
      /* AND AT NIGHT THE FIRE IS ITS OWN CIRCUIT. The lamp asks POWER before it glows; the
         barrel does not have to ask anybody, and that is the entire point of it. Warmer and
         lower than a lamp head, and no two barrels sit at the same brightness.
         NOT A PER-FRAME FLICKER, DELIBERATELY. The city redraws on a STEP, not on a frame
         (I-MOVE-YOU-MOVE), so an animated flame keyed to a render clock would be a flicker
         that never flickers -- a lie told in code. It is keyed to the world clock and the
         cell instead: it varies barrel to barrel, and it shifts as the night goes on. */
      if(night&&_fam==='firebarrel'){
        const _fl=0.72+0.28*Math.abs(Math.sin(((T&&T.min)||0)*0.11+px2*0.7+py2*1.3));
        g.fillStyle='rgba(255,150,60,'+(0.55*_fl).toFixed(3)+')';
        g.fillRect(bx+px2*C+C*0.28, by+(py2-_fp[2])*C+C*0.10, Math.max(2,C*0.34), Math.max(2,C*0.30));
        g.fillStyle='rgba(255,120,40,'+(0.18*_fl).toFixed(3)+')';
        g.beginPath(); g.ellipse(bx+px2*C+C*0.5, by+py2*C+C*0.5, C*2.1*_fl, C*1.5*_fl, 0, 0, 7); g.fill();
      }
      if(night&&_fam==='lamp'){"""

if not os.path.exists(WORLD):
    sys.exit('PROPS PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
refreshed = BLOCKS[0][0] in src

for mark, anchor, after, body in BLOCKS:
    pat = re.compile(r'[ \t]*/\* ' + re.escape(mark) + r'.*?' + re.escape(mark) + r' END \*/\n',
                     re.S)
    src, _ = pat.subn('', src)
    pat2 = re.compile(r'<script src="BOHEMIA_CITY_PROPS\.js"></script><!-- ' + re.escape(mark) +
                      r'.*?' + re.escape(mark) + r' END -->', re.S)
    src, _ = pat2.subn('', src)
    if src.count(anchor) != 1:
        sys.exit('PROPS PATCH: anchor is not unique (%d hits): %s' % (src.count(anchor), anchor))
    src = src.replace(anchor, (anchor + '\n' + body.rstrip('\n')) if after
                      else (body.rstrip('\n') + '\n' + anchor), 1)

# REVERSE BY MARKER, NEVER BY CONTENT -- the rule this repo learned on 8/20 and that I broke
# here the same afternoon. This used to reverse by matching DRAW_NEW's FIRST LINE, which is
# content; the moment I edited the block to carry a per-cell extent, the stored first line
# stopped matching the one on the page, the reversal silently did nothing, and the tool then
# could not find its anchor and exited loud. Loud is the good outcome and it is still luck.
# The marker is stable across every edit to the body, so this converges no matter what the
# block becomes.
if '__A_VERTICAL_IS_A_FAMILY_DRAW__' in src:
    src = re.sub(r'    if\(ch\.posts&&ch\.posts\.length\)for\(const \[[^\]]*\] of ch\.posts\)\{'
                 r'.*?if\(night&&_fam===\'lamp\'\)\{',
                 DRAW_OLD, src, count=1, flags=re.S)
if src.count(DRAW_OLD) != 1:
    sys.exit('PROPS PATCH: could not find the single lamp-draw block. Refusing to guess -- '
             'this is what puts every standing object in the game on screen.')
src = src.replace(DRAW_OLD, DRAW_NEW, 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('PROPS PATCH: %s -- the vertical is a mechanism now, not a lamp'
      % ('REFRESHED' if refreshed else 'applied'))
print('    11 families wired by legend name; the lamp keeps its exact footprint and its glow')
