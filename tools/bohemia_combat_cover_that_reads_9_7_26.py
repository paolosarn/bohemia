#!/usr/bin/env python3
"""COVER THAT READS -- COOK, VAMILY [combat ground], round 2, 9/7/26.

AND CARS WERE NEVER ON THIS PATH, WHICH THE FIRST WRITE-UP OF THIS ROUND GOT WRONG. The
loop's very first branch is `if(P.car){ if(!P.nose)continue; ... CAR_IMG[P.carArt|0] ... }`:
a car already draws as ONE approved wreck picture across its whole 2x3 footprint, and the
other five of its six cells draw nothing at all. So TG-07's "a dead car" was already done
before this round started, and everything below is about the GENERIC pieces -- the ~45 of
51 that are not car cells. The probe reported a car-cell ratio because it measured every
pillar; that ratio described code cars never reach.

THE ROW's remaining clause is "cover that reads", and this lane's own reference sheet
(reference/library/tile-ground/INDEX.md, TG-07) says what that means:

  "at one house per tile, cover is HOUSE-PART SIZED -- a block wall segment, a dead car,
   a dumpster, a porch pier -- and each must break the ground's silhouette at the tile
   edge where it blocks; cover that only reads by its colour is not cover."

MEASURED FIRST, on the real surface, in a real arena (tools/bohemia_combat_cover_probe_9_7_26.js):

    a CAR CELL      blocks 0.90 tiles wide, shows 0.68  -> the picture is 76%
    a GENERIC piece blocks 1.91 tiles wide, shows 0.68  -> the picture is 36%
    the widest generic piece blocks 2.07 tiles

The drawn width is a CONSTANT -- s*1.1 where s = ring*0.62 -- so a car door and the
biggest block in the lot are the same picture. The blocking test is not a constant:
`Math.sin(dA)*P.edist < P.r*0.9`, so a piece stops a sightline anywhere within 0.9*r of
its centre and is an object 1.8*r tiles across. TG-07's test is that the picture breaks
the ground's silhouette AT THE TILE EDGE WHERE IT BLOCKS. Today it stops a third of the
way there, on every generic piece, in every fight.

WHAT THIS CHANGES, AND WHAT IT DELIBERATELY DOES NOT
  WIDTH becomes what the piece actually blocks. That is the whole correctness fix.
  HEIGHT IS NOT TOUCHED. Low is 0.9x and tall is 1.6x and that difference is the VAULT
    TELL -- a real silhouette difference, which an earlier note from this lane overstated
    away as "colour and nothing else". It reads, it is COMBAT's read, and it stays.
  THE LID COLOURS ARE NOT TOUCHED for the same reason: #7a94a8 you may vault, #94836a you
    may not. Changing a signal the player has learned is not a cook's call.
  NO DAMAGE BEFORE THE DIAL: P.r is read and never written. No damage, accuracy, range or
    resource number moves. The mechanic is untouched; the picture stops lying about it.

AND IT COOKS NOTHING. The face is the BLOCK WALL the fight already carries -- STREET_B64
`wall`, four variants at 44 px, lifted out of the approved starter bank in round 1 of this
same row. TG-07's first named example is "a block wall segment" and the generator's own
comment says "three pillars in a row IS a wall". So a wide piece reads as a run of block
wall, which is what a wide piece in a Vegas lot is.

ONE BLIT INSTEAD OF FOUR CANVAS OPS. The fight spends about 92% of a 500 ms beat and
roughly half of that is canvas blits, so 69 pieces on screen is not a place to be careless.
Each piece is baked ONCE into a cached sprite (shadow, wall face, lid, outline) keyed on
its size, then drawn with a single drawImage -- replacing a fillRect, a strokeRect and TWO
ellipse paths per piece per frame. Whether that is cheaper is measured, not assumed.

THE BAKE REFUSES TO CACHE A SPRITE MADE BEFORE THE ART WAS READY. streetTile() can answer
nothing while the bank is still decoding; a sprite baked then would be a flat box cached
forever. If no tile comes back the bake returns null, the old path draws that frame, and
it tries again next frame.

    python3 tools/bohemia_combat_cover_that_reads_9_7_26.py
"""
import base64, io, re, sys

MARK = '__COVER_THAT_READS__'

HELPERS = r"""
/* ===== COVER THAT READS (COOK, [combat ground] round 2, 9/7/26) """ + MARK + r"""
   MEASURED: a generic cover piece BLOCKS 1.91 tiles wide and was DRAWN 0.68 tiles wide,
   a constant, the same picture as a car door. The blocking test is
   `Math.sin(dA)*P.edist < P.r*0.9`, so a piece is an object 1.8*r tiles across. TG-07:
   the picture must break the ground's silhouette AT THE TILE EDGE WHERE IT BLOCKS.
   So the WIDTH is now what it blocks. HEIGHT is untouched -- low 0.9x, tall 1.6x is the
   vault tell and it is COMBAT's read, not a cook's. The lid colours are untouched for
   the same reason.
   THE FACE IS THE BLOCK WALL THE FIGHT ALREADY CARRIES (STREET_B64.wall, lifted from the
   approved starter bank in round 1). Nothing new is cooked. TG-07's first named example
   is "a block wall segment", and this generator's own comment says three pillars in a row
   IS a wall, so a wide piece reading as a run of block wall is the shape it always was. */
var _COVER_SPR={}, _COVER_SPRN=0, _COVER_S=-1;
function coverSprite(low,w,s,ring){
  /* ONE TILE SIZE IS LIVE AT A TIME, so keep one cache for it and drop it when the size
     changes -- the same shape streetTile uses for its own. It matters: TILE WIDTH is a
     DIAL in COMBAT's settings (his number, by eye, default 1.75), so sweeping it walks
     `s` through many values. Without this the cache would fill with sizes nobody is
     drawing and eventually hit its cap, and past the cap every piece would quietly fall
     back to the old constant width -- the lie this round removed, returning by itself. */
  if(_COVER_S!==s){ _COVER_SPR={}; _COVER_SPRN=0; _COVER_S=s; }
  var key=(low?'L':'T')+'|'+w;
  var got=_COVER_SPR[key]; if(got!==undefined) return got;
  if(_COVER_SPRN>400) return null;   /* a backstop, not a budget */
  var h=Math.max(2,Math.round(low?s*0.9:s*1.6));
  var top=-(low?s*0.55:s*1.15);          /* the face's top, relative to the ground point */
  /* THE SHADOW OVERHANG IS A DISTANCE, NOT A RATIO. It was 1.4545x the face half-width,
     a number tuned when every block was 0.68 tiles wide; kept as a ratio it makes the
     BLIT 45% wider than the piece on a 2-tile block, and a blit's cost is its area. A
     shadow reaches past an object by about the same amount whatever the object's width,
     so cap it: the narrow pieces keep exactly the overhang they had, the wide ones stop
     paying for one. Measured on a 84 px face this takes the sprite from 124 px to 100. */
  var hw=w/2, shx=hw+Math.min(hw*0.4545,s*0.25), shh=Math.max(2,Math.round(s*0.26));
  var lid=Math.max(2,Math.round(w*0.18));
  /* the sprite has to hold everything from the top of the lid down to the bottom of the
     shadow: from (top-lid) above the ground point to (s*0.5+shh) below it */
  var W2=Math.max(4,Math.ceil(shx*2)+2), H2=Math.ceil((s*0.5+shh)-(top-lid))+2;
  if(!(W2>0&&H2>0&&W2<4096&&H2<4096)) return null;
  var cv=document.createElement('canvas'); cv.width=W2; cv.height=H2;
  var g=cv.getContext('2d'); if(!g) return null;
  g.imageSmoothingEnabled=false;
  var ox=W2/2, oy=-(top-lid)+1;          /* where the ground point sits inside the sprite */
  /* the shadow, same shape it always was, at the piece's real width */
  g.fillStyle='rgba(0,0,0,0.25)'; g.beginPath();
  g.ellipse(ox,oy+s*0.5,shx,shh,0,0,7); g.fill();
  /* THE FACE: the block wall, tiled, clipped to the piece. If the bank is not decoded yet
     this bakes nothing and the sprite is REFUSED rather than cached as a flat box. */
  var fx=ox-hw, fy=oy+top, laid=0;
  var bank=(typeof STREET_B64!=='undefined'&&STREET_B64.wall)?STREET_B64.wall:null;
  var n=(bank&&bank.length)?bank.length:0;
  if(n>0){
    /* MATCH THE FLOOR'S PIXEL SIZE EXACTLY. streetTile keeps ONE cache for ONE px
       (`if(_stCacheT!==px){ _stCache={}; ... }`) and the floor asks for ceil(t)+1, so
       asking for round(ring)+1 would empty and refill the whole street cache every
       frame the moment ring is fractional. Same expression, same number, one cache. */
    var TP=Math.max(8,Math.ceil(ring)); var TPX=TP+1;
    g.save(); g.beginPath(); g.rect(fx,fy,w,h); g.clip();
    for(var uy=0; uy<h; uy+=TP) for(var ux=0; ux<w; ux+=TP){
      var t=null;
      try{ t=streetTile('wall',((((ux/TP)|0)+(((uy/TP)|0)*2))%n),TPX,0); }catch(_e){}
      if(t){ g.drawImage(t,fx+ux,fy+uy,TP,TP); laid++; }
    }
    g.restore(); }
  if(!laid) return null;                 /* the art was not ready; try again next frame */
  /* the lid and the outline, both exactly as they were, at the new width */
  g.fillStyle=low?'#7a94a8':'#94836a';
  g.beginPath(); g.ellipse(ox,fy,hw,lid,0,0,7); g.fill();
  g.strokeStyle='#241f18'; g.lineWidth=1; g.strokeRect(fx,fy,w,h);
  /* A sprite pixel (u,v) is world (pxs-ox+u, pys-oy+v), so the blit goes at
     (pxs-ox, pys-oy). __ay IS oy, not its negative -- the first cut had the sign
     inverted and would have hung every piece of cover below its own shadow. */
  cv.__ax=ox; cv.__ay=oy; cv.__fh=h;
  _COVER_SPR[key]=cv; _COVER_SPRN++;
  return cv; }
/* WHAT A PIECE IS REALLY AS WIDE AS: the corridor its own blocking test stops a line in.
   BUCKETED TO 4 PX, and that is not laziness. r is a continuous roll, so an unbucketed
   width gives every piece its own size: measured, 40 pieces produced 46 distinct cached
   sprites, which is a bake per piece and a cache that buys nothing. Four pixels is under
   a tenth of a tile -- far inside "breaks the silhouette at the tile edge" -- and it
   collapses a lot to a handful of sizes. */
function coverWideOf(P,ring){
  return Math.max(8,Math.round(ring*1.8*((P&&P.r)||0.5)/4)*4); }
"""

DRAW_OLD = """    const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const s=ring*0.62;   /* a block fills its tile */
    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();
    const _h=(P.tall===false)?s*0.9:s*1.6, _ty=pys-((P.tall===false)?s*0.55:s*1.15);   /* V54: low = duck height, vaultable */
    x.fillStyle='#6e604a'; x.fillRect(pxs-s*0.55,_ty,s*1.1,_h);
    x.fillStyle=(P.tall===false)?'#7a94a8':'#94836a'; x.beginPath(); x.ellipse(pxs,_ty,s*0.55,s*0.2,0,0,7); x.fill();   /* V54: a blue-lit top flags a pillar you can vault */
    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,_ty,s*1.1,_h); }"""

DRAW_NEW = """    const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const s=ring*0.62;
    const _h=(P.tall===false)?s*0.9:s*1.6, _ty=pys-((P.tall===false)?s*0.55:s*1.15);   /* V54: low = duck height, vaultable. NOT TOUCHED: this is the vault tell */
    /* """ + MARK + """ THE WIDTH IS WHAT IT BLOCKS, NOT A CONSTANT. It was s*1.1 for every
       piece -- 0.68 tiles -- while a generic piece blocks 1.91 tiles and a car cell 0.90.
       One baked sprite per size, one blit, in place of a fillRect, a strokeRect and two
       ellipse paths. If the bank is not decoded yet the sprite is refused and the old
       path draws this frame. */
    const _cw=coverWideOf(P,ring);
    /* AND NOTHING OFF THE CANVAS NEEDS DRAWING, WHICH UNTIL NOW EVERYTHING DID. This loop
       had no cull: measured, 37 of 51 pieces were on screen and all 51 were painted. Four
       comparisons per piece, and it pays part of what the honest width costs -- which is
       COMBAT's [draw budget] rule (9/7: every new fight visual arrives with its cost). */
    if(pxs<-_cw||pxs>W+_cw||pys<-ring*3||pys>H+ring*3) continue;
    const _csp=coverSprite(P.tall===false,_cw,s,ring);
    if(_csp){ x.drawImage(_csp,Math.round(pxs-_csp.__ax),Math.round(pys-_csp.__ay)); }
    else {
      x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();
      x.fillStyle='#6e604a'; x.fillRect(pxs-s*0.55,_ty,s*1.1,_h);
      x.fillStyle=(P.tall===false)?'#7a94a8':'#94836a'; x.beginPath(); x.ellipse(pxs,_ty,s*0.55,s*0.2,0,0,7); x.fill();
      x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,_ty,s*1.1,_h); } }"""

ANCHOR = "function scatterCars(kind){"


def patch(path):
    src = io.open(path, encoding='utf-8').read()
    m = re.search(r"(const COMBAT_B64\s*=\s*')([A-Za-z0-9+/=]+)(')", src)
    if not m:
        return path + ': no COMBAT_B64'
    combat = base64.b64decode(m.group(2)).decode('utf-8')

    if MARK in combat:
        return path + ': already done (mark present)'

    if combat.count(DRAW_OLD) != 1:
        return path + ': the pillar draw is not where I left it (%d matches) -- REFUSING' % combat.count(DRAW_OLD)
    if combat.count(ANCHOR) != 1:
        return path + ': no single scatterCars anchor -- REFUSING'
    # REUSE-FIRST, enforced by the tool: never a second copy of the helpers
    if 'function coverSprite(' in combat:
        return path + ': coverSprite already exists -- REFUSING to write a second one'

    combat = combat.replace(ANCHOR, HELPERS.strip() + '\n' + ANCHOR, 1)
    combat = combat.replace(DRAW_OLD, DRAW_NEW, 1)

    for needle, why in ((MARK, 'the mark'),
                        ('function coverSprite(', 'the sprite bake'),
                        ('function coverWideOf(', 'the real width'),
                        ('const _cw=coverWideOf(P,ring)', 'the draw uses it'),
                        ("if(!laid) return null;", 'the not-ready guard')):
        if combat.count(needle) < 1:
            return path + ': verify failed, missing ' + why
    if combat.count('function coverSprite(') != 1:
        return path + ': verify failed, coverSprite is not exactly once'

    out = base64.b64encode(combat.encode('utf-8')).decode('ascii')
    src = src[:m.start(2)] + out + src[m.end(2):]
    io.open(path, 'w', encoding='utf-8').write(src)
    return path + ': patched (width now what it blocks; face is the block wall already in the fight; no pixels cooked)'


if __name__ == '__main__':
    ok = 0
    for p in ('slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html'):
        msg = patch(p)
        print('  ' + msg)
        if 'patched' in msg or 'already done' in msg:
            ok += 1
    print('OK, %d surface(s)' % ok if ok == 2 else 'STOPPED: %d of 2' % ok)
    sys.exit(0 if ok == 2 else 1)
