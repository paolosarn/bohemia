#!/usr/bin/env python3
"""
BOHEMIA -- THE BORDER WEARS ITS COLOUR, WHERE HE WALKS  (COOK, [border marked], 9/6/26)

THE ROW: "cook the edge: a territory border is marked where a player can see it, in the
holder's colour, on the wall, the fence, the underpass." Tab: CITY.

BOTH THINGS IT WAITED ON HAVE LANDED, and neither of them is this.
  FACTIONS [who holds] (8bf3a91) made the border REAL: every one of the 9,216 cells has an
  owner and 100% of the places two owners meet run along a road, a rail line, a wash or a
  mountain -- so every border in the valley is now on a landmark a painter could reach.
  FACTIONS [colours fixed] (0160c71) made the colour REACHABLE: a faction's hue lived only
  as rendered cloth pixels, and it is measured off his own wardrobe now and inlined into
  the city as window.BOHEMIA_FACTION_COLOURS.
  UI [owner shown] painted it ON THE MAP.
THE MAP IS NOT WHERE HE WALKS. This is the other half: the wall you are standing next to.

THE REFERENCE CHECK (the 9/4 standing duty -- compared to real work of its kind before
calling it done, and what was TAKEN written down):
  policemag.com "Decoding the Secret Messages on the Wall", police1.com "How police can
  gain intelligence from gang graffiti", ASU Center for Problem-Oriented Policing
  "Graffiti", gangenforcement.com.
  TAKEN, structurally:
   1. A boundary mark is a NO-TRESPASSING SIGN AIMED AT THE OTHER SIDE, not decoration.
      So it goes on the holder's own edge, in the holder's colour, facing out.
   2. THE PLACES NAMED ARE "main thoroughfares, underpasses, and walls bordering rival
      territories" -- which is the row's own list, arrived at independently.
   3. "Large and plain surfaces are preferred, without windows or doors." So: plain wall
      and fence faces only. No window, no boarded window, no door, no garage door, and
      nothing you can walk into.
   4. A mark is a NAME OR SYMBOL, repeated along the boundary -- NOT a wash of colour over
      the wall. A faction that paints its whole border wall has painted a fence, not a
      claim. So the mark is small, it is spaced, and the wall stays the wall.
  NOT TAKEN: the crossing-out vocabulary (a rival's mark struck through is a threat, and
  where two claims meet you see both). That is a second mark answering a first and it
  needs the contested-edge data to be a pair rather than a cell; named in the record as
  the next thing rather than half-built here.
  STYLE FROM US: the hue is HIS, measured off his wardrobe and never picked here
  (COLOUR IS TERRITORY 8/26: "which faction owns which hue is HIS"), and the mark is thin
  -- the row cites the one-pixel border law, and a band 3 px of a 44 px face is the spirit
  of it: a mark, not a coat of paint.

WHAT IT ADDS, in three places and nothing else:
  1. bohBorderInk()  -- one top-level helper beside the turf cache. Reads his measured RGB
     and lifts saturation just enough that paint reads against tan stucco. The HUE is
     untouched, which is the part that is his.
  2. the tile builder -- on a wall or fence face whose OVERMAP cell touches a different
     owner, and only on a plain surface, sets c.turfMark. Deterministic off the tile
     coordinates, so a wall never shimmers and every device paints the same one.
  3. the structure draw -- paints the mark on the face, after the wall texture and before
     the edge lines, so it sits ON the wall rather than under the shadow.

    python3 tools/bohemia_border_wears_its_colour_9_6_26.py
"""
import os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html')

# ---- 1. the ink -------------------------------------------------------------------
INK_OLD = "var TURF_MAP=null, TURF_MAP_KEY=null;"
INK_NEW = """/* __THE_BORDER_WEARS_ITS_COLOUR__ (COOK, 9/6) -- HIS HUE, ON A WALL, IN DAYLIGHT.
   The map's own copy of this lifts value AND saturation hard, and it is right to: an
   overmap is drawn at night and the Mob's measured #572f2a is nearly black at one pixel.
   A WALL IS NOT A MAP. This is paint on tan stucco in the sun, so the value stays where
   his wardrobe put it and only the saturation comes up -- cloth is dyed to be worn and
   spray paint is not, and that difference is the whole of the change.
   NOTHING HERE PICKS A COLOUR. COLOUR IS TERRITORY (8/26): "which faction owns which hue
   is HIS", and he answered it in garments; this reads that answer.
   A DRAB FACTION KEEPS ITS DRAB. The Volunteers, the Homeless and the Cartel measure as
   neutral, which is the law's own exemption, and a boundary in their grey is exactly what
   an outfit that does not advertise would paint. */
var BOH_INK_CACHE = {};
function bohBorderInk(who){
  if(!who) return null;
  if(BOH_INK_CACHE[who]) return BOH_INK_CACHE[who];
  var out = null;
  try{
    var C = window.BOHEMIA_FACTION_COLOURS;
    var e = C && C.factions && C.factions[who];
    if(e && e.rgb){
      var r=e.rgb[0]/255, g2=e.rgb[1]/255, b2=e.rgb[2]/255;
      var mx=Math.max(r,g2,b2), mn=Math.min(r,g2,b2), d=mx-mn;
      var h=0; if(d){ if(mx===r) h=((g2-b2)/d)%6; else if(mx===g2) h=(b2-r)/d+2; else h=(r-g2)/d+4;
                      h*=60; if(h<0)h+=360; }
      var sat = e.drab ? (mx?d/mx:0) : Math.min(1,(mx?d/mx:0)*1.45+0.10);
      var val = Math.min(1, mx*1.12);
      var c3=val*sat, x3=c3*(1-Math.abs(((h/60)%2)-1)), m3=val-c3, rr,gg,bb;
      if(h<60){rr=c3;gg=x3;bb=0;} else if(h<120){rr=x3;gg=c3;bb=0;}
      else if(h<180){rr=0;gg=c3;bb=x3;} else if(h<240){rr=0;gg=x3;bb=c3;}
      else if(h<300){rr=x3;gg=0;bb=c3;} else {rr=c3;gg=0;bb=x3;}
      var hx=function(v){ return Math.max(0,Math.min(255,Math.round((v+m3)*255))).toString(16).padStart(2,'0'); };
      out = '#'+hx(rr)+hx(gg)+hx(bb);
    }
  }catch(_e){}
  BOH_INK_CACHE[who]=out; return out;
}
var TURF_MAP=null, TURF_MAP_KEY=null;"""

# ---- 2. the builder ---------------------------------------------------------------
BLD_OLD = "        if(entry&&entry.kind==='fence') c.wallH=2;"
BLD_NEW = """        if(entry&&entry.kind==='fence') c.wallH=2;
        /* __THE_BORDER_WEARS_ITS_COLOUR__ (COOK, [border marked], 9/6) -- and this is the
           half of rule 4 that is not on the map. FACTIONS put every border in the valley
           on something a player can see; UI painted it on the overmap. A MAP IS NOT WHERE
           HE WALKS. Standing in the street, the boundary between two outfits is still
           nothing at all, and the real thing is not subtle: gangs paint the wall that
           divides them, and police-intelligence write-ups list the places as "main
           thoroughfares, underpasses, and WALLS BORDERING RIVAL TERRITORIES".
           ONLY WHERE IT IS TRUE. The mark goes on a wall or fence in an overmap cell whose
           four-neighbourhood contains a DIFFERENT owner -- the edge itself, never the
           interior -- so a faction's own back streets stay clean and the paint means what
           it says. It is the holder's colour, facing out, because a boundary mark is a
           no-trespassing sign aimed at the other side.
           PLAIN SURFACES ONLY, which is the reference's own rule: "large and plain
           surfaces are preferred, without windows or doors". No window, no boarded
           window, no door, no garage door, nothing enterable.
           AND IT GOES ON THE SIDE THE RIVAL IS ON, WHICH THE FIRST CUT GOT WRONG AND
           MEASURING CAUGHT. That version marked any plain wall anywhere in a border
           overmap cell, one face in three. An overmap cell is 128 x 128 walked tiles, so
           the paint came out at ten marks per 16,384 cells, scattered through a whole
           neighbourhood -- a player could live there and never meet one, and if they did
           it would be in the middle of a block saying nothing. A boundary mark is on THE
           WALL THAT DIVIDES THEM. So the band is the eighth of the cell that touches the
           rival, on that side only, and it is one face in two inside it, which is a line
           of paint you walk along instead of a scatter you never notice. */
        if(!c.turfMark && entry){
          var _bnm = String(entry.name||'').toLowerCase();
          /* THE NAME, NOT THE KIND, AND MEASURING IS WHY. The first cut tested
             entry.kind==='fence', which is what the CITY's own legend calls code 4 --
             and a district KIT writes its own legend. Measured on the real surface: the
             apartment kit's 756 fence tiles are kind 'structure' name 'fence', and the
             solar kit's are kind 'fence' name 'fence'. Testing the kind found the solar
             farm and missed everywhere anybody lives. The NAME is the thing every kit
             agrees on, because it is what the dossier calls the object. */
          var _plain = !entry.enter && !c.enter
                    && (_bnm.indexOf('fence')>=0 || _bnm.indexOf('wall')>=0)
                    && _bnm.indexOf('window')<0 && _bnm.indexOf('door')<0
                    && _bnm.indexOf('gate')<0 && _bnm.indexOf('garage')<0
                    && _bnm.indexOf('retaining')<0 && _bnm.indexOf('sea')<0;
          if(_plain && ((Math.imul(gx,2654435761)^Math.imul(gy,246822507))>>>0)%2===0){
            /* ASKED ONCE PER TILE, NOT ONCE PER CELL. Whether this overmap cell touches a
               different owner is a fact about the TILE, and a tile is 16,384 cells. The
               answer rides on the tile's own meta object, which is already the cache the
               rest of this builder reads, so a hot chunk asks the turf grid once instead
               of sixteen thousand times. */
            if(m.__tm===undefined){
              m.__tm=null;
              try{
                var _tg2=(typeof turfGrid==='function')?turfGrid():null;
                if(_tg2&&_tg2.own&&_tg2.n){
                  var _tn2=_tg2.n, _me=_tg2.own[ty*_tn2+tx];
                  if(_me){
                    var _o=_tg2.own;
                    m.__tm={ who:_me, ink:bohBorderInk(_me), band:Math.max(4,FN>>3),
                      W:!!(tx>0      && _o[ty*_tn2+tx-1]     && _o[ty*_tn2+tx-1]!==_me),
                      E:!!(tx<_tn2-1 && _o[ty*_tn2+tx+1]     && _o[ty*_tn2+tx+1]!==_me),
                      N:!!(ty>0      && _o[(ty-1)*_tn2+tx]   && _o[(ty-1)*_tn2+tx]!==_me),
                      S:!!(ty<_tn2-1 && _o[(ty+1)*_tn2+tx]   && _o[(ty+1)*_tn2+tx]!==_me) };
                    if(!m.__tm.ink||!(m.__tm.W||m.__tm.E||m.__tm.N||m.__tm.S)) m.__tm=null;
                  }
                }
              }catch(_e){}
            }
            var _tmT=m.__tm;
            if(_tmT){
              var _b=_tmT.band;
              if((lx<_b&&_tmT.W)||(lx>=FN-_b&&_tmT.E)||(ly<_b&&_tmT.N)||(ly>=FN-_b&&_tmT.S))
                c.turfMark={ink:_tmT.ink, who:_tmT.who,
                  v:((Math.imul(gx,374761393)^Math.imul(gy,668265263))>>>0)%3};
            }
          }
        }"""

# ---- 3. the draw ------------------------------------------------------------------
DRW_OLD = """      x.fillStyle='rgba(255,255,255,0.10)'; x.fillRect(i2*TPX,y*TPX,TPX,1);
      x.fillStyle='rgba(0,0,0,0.22)'; x.fillRect(i2*TPX,y*TPX+TPX-1,TPX,1);
      ch2.lamps.push([i2,y]); }"""
DRW_NEW = """      /* __THE_BORDER_WEARS_ITS_COLOUR__ DRAW (COOK, 9/6). ON the wall texture and UNDER
         the edge lines, so it reads as paint on a surface rather than a sticker floating
         over one -- the shadow at the foot of the wall still falls across it.
         A MARK, NOT A COAT. The row cites the one-pixel border law, and the spirit of that
         law is that his eye wants a THIN line: a 3 px band and two strokes on a 44 px face
         is under a tenth of the wall, so the stucco he approved is still the wall and the
         claim is a thing painted on it. Three variants off the same hash the builder used,
         because a boundary of forty identical marks is a stencil and not a street. */
      if(c.turfMark){
        var _tmB=c.turfMark, _tx0=i2*TPX, _ty0=y*TPX;
        var _bandY=_ty0+Math.round(TPX*0.30), _bandH=Math.max(2,Math.round(TPX*0.07));
        var _inX=Math.round(TPX*0.16), _inW=TPX-2*_inX;
        x.globalAlpha=0.82; x.fillStyle=_tmB.ink;
        x.fillRect(_tx0+_inX,_bandY,_inW,_bandH);
        if(_tmB.v===0){                                     /* a bar and a downstroke */
          x.fillRect(_tx0+_inX,_bandY,_bandH,Math.round(TPX*0.22));
        } else if(_tmB.v===1){                              /* a bar under a short cap */
          x.fillRect(_tx0+_inX+Math.round(_inW*0.55),_bandY-Math.round(TPX*0.14),
                     _bandH,Math.round(TPX*0.16));
        } else {                                            /* a bar struck at the end */
          x.fillRect(_tx0+_inX+_inW-_bandH,_bandY-Math.round(TPX*0.09),
                     _bandH,Math.round(TPX*0.20));
        }
        x.globalAlpha=1;
      }
      x.fillStyle='rgba(255,255,255,0.10)'; x.fillRect(i2*TPX,y*TPX,TPX,1);
      x.fillStyle='rgba(0,0,0,0.22)'; x.fillRect(i2*TPX,y*TPX+TPX-1,TPX,1);
      ch2.lamps.push([i2,y]); }"""


def main():
    src = open(CITY, encoding='utf-8').read()
    if 'bohBorderInk' in src:
        sys.exit('already applied.')
    for name, old, new in (('the ink helper', INK_OLD, INK_NEW),
                           ('the tile builder', BLD_OLD, BLD_NEW),
                           ('the structure draw', DRW_OLD, DRW_NEW)):
        n = src.count(old)
        if n != 1:
            sys.exit('ABORT: %s anchor found %d times, expected 1.' % (name, n))
        src = src.replace(old, new, 1)

    for needle, why in [
        ('function bohBorderInk(who)', 'the ink helper is in the file'),
        ('c.turfMark={ink:_tmT.ink', 'the builder marks border walls only'),
        ('if(m.__tm===undefined){', 'the turf lookup is memoised per tile, not per cell'),
        ('if(c.turfMark){', 'the draw paints it'),
        ("_bnm.indexOf('window')<0", 'plain surfaces only, per the reference'),
    ]:
        if needle not in src:
            sys.exit('ABORT: %s -- not true after the substitution.' % why)

    open(CITY, 'w', encoding='utf-8').write(src)
    print('=== THE BORDER WEARS ITS COLOUR (9/6) ===')
    print('  ink helper, tile builder and structure draw: 3 of 3')
    print('  the rival-facing eighth of a border overmap cell; plain wall and')
    print('  fence faces only; one face in two inside that band')
    print('=== done ===')


if __name__ == '__main__':
    main()
