#!/usr/bin/env python3
"""
"IT'S HARD TO FIND MY HOUSE. IT'S NOT EASY." (Paolo 8/24/26, RUN lane.)

WHAT IS ACTUALLY THERE TODAY: homePass draws the word HOME over the house in his
own gold, and it is good. Then:

    if(cxp<-C*8||cyp<-C*8||cxp>cv.width+C*8||cyp>cv.height+C*8)return;

Eight cells past the edge of the screen and the only thing in the game that knows
where he lives STOPS DRAWING. Walk one block and home does not exist. There is no
map marker, no compass, no line in the HUD. Once it is off screen, the answer to
"where do I live" is walk around until you see it again.

That comment above the cull is a good one and it stays: it fixed a real bug where
the label was culled ON THE LABEL while he stood on his own doorstep. The cull is
right about DRAWING THE WORD OVER THE HOUSE. It was never asked what to do when
the house is not on screen, and the answer it gives by default is nothing.

REALISM FIRST, AND THIS IS THE REALISTIC ANSWER RATHER THAN THE GAME ONE: a
person knows the way to their own house. He does not need a quest marker floating
in the sky, he needs what anybody standing on a street already has -- a sense of
which way home is. So when the house is off screen, a small arrow sits at the
edge of the screen pointing at it, with HOME under it and how far in the game's
own unit. Nothing is added when the house is visible; the label he already has is
better than an arrow.

THE DISTANCE IS IN MINUTES, NOT TILES, and that is deliberate. The day advances
0.084 minutes per cell walked -- the clock is already the game's unit of distance
because TIME IS SPENT BY ACTIONS. "HOME 4 MIN" is a sentence about his day.
"HOME 48 TILES" is a number about a grid he cannot see.

IT KEEPS OFF THE PAD. The arrow is clamped into an inset box whose bottom-right
corner is held clear of the 180px nav ring, so the one thing he is holding his
thumb on is never underneath it.

MAP LAW HOLDS: nothing is placed or moved. homeFind already resolves which house
is his, by a rule, from the world the generator built. This only points at the
answer that already exists.

REUSE CHECK: no graphic pixels cooked -- this draws a triangle and a word with the
canvas API in the palette the HOME label already uses, so no banks/ lookup applies.

WORDS: "HOME" is the label already on the house. The MIN suffix is UI copy, a real
attempt, draft:true.

Idempotent (marker __HOME_IS_FINDABLE__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__HOME_IS_FINDABLE__'

# ---- AND THE ROOT CAUSE, FOUND BY MEASURING THE ARROW -----------------------
# The arrow drew at spawn and then drew NOTHING after fourteen steps, which is
# not what an off-screen house looks like -- it is what NO house looks like.
# homeFind keys its cache on the cell he is STANDING IN:
#     const key = seed+':'+_pcx+','+_pcy;   // _pcx,_pcy = the player's cell
#     if (HOME_KEY === key) return HOME;
# so crossing into a new district changes the key, re-scans THAT cell, and calls
# whatever house it finds there his home. His house followed him around. And in a
# cell with no house the scan finds nothing, returns null, and homePass draws
# nothing at all -- no label, no arrow, no house anywhere in the world.
# HIS HOUSE IS ONE HOUSE. It is keyed on where he LANDED, which is the anchor the
# function's own comment says it wants ("anchoring here keeps HOME the same house
# every load AND puts it in front of him") and which the line below it already
# uses for the scan centre. The current cell is kept ONLY as the fallback for
# before he has dropped in, which is the one moment LANDED is null. REROLL already
# clears LANDED/HOME/HOME_KEY together, so a new valley still gets a new house.
HOME_OLD = """  const _pcx=(MODE==='human')?((hx/FN)|0):city.x;
  const _pcy=(MODE==='human')?((hy/FN)|0):city.y;"""

HOME_NEW = """  /* """ + MARK + """ -- HIS HOUSE IS ONE HOUSE, AND IT WAS NOT.
     This keyed the cache on the cell he is STANDING IN, so crossing a district
     boundary re-scanned the new cell and called a house there his home. Walk two
     blocks and "home" was a different building; walk into a cell with no house
     and homeFind returned null, so homePass drew nothing and he had no house at
     all. Measured: the arrow drew at spawn and vanished after fourteen steps.
     Keyed on where he LANDED now, which is the anchor this function's own note
     below already asks for -- "anchoring here keeps HOME the same house every
     load AND puts it in front of him". The standing cell survives only as the
     fallback for the one moment LANDED is null, before he has dropped in. REROLL
     clears LANDED, HOME and HOME_KEY together, so a new valley still gets a new
     house. */
  const _lcell=(typeof LANDED!=='undefined'&&LANDED)?[(LANDED[0]/FN)|0,(LANDED[1]/FN)|0]:null;
  const _pcx=_lcell?_lcell[0]:((MODE==='human')?((hx/FN)|0):city.x);
  const _pcy=_lcell?_lcell[1]:((MODE==='human')?((hy/FN)|0):city.y);"""

OLD = """  const cxp=Math.round(ox+(h.x+h.w/2)*C), cyp=Math.round(oy+(h.y+h.h/2)*C);
  if(cxp<-C*8||cyp<-C*8||cxp>cv.width+C*8||cyp>cv.height+C*8)return;"""

NEW = """  const cxp=Math.round(ox+(h.x+h.w/2)*C), cyp=Math.round(oy+(h.y+h.h/2)*C);
  if(cxp<-C*8||cyp<-C*8||cxp>cv.width+C*8||cyp>cv.height+C*8){
    /* """ + MARK + """ (8/24). Paolo: "It's hard to find my house. It's not easy."
       This was a bare `return`: eight cells past the edge of the screen and the
       only thing in the game that knows where he lives stopped drawing, so one
       block from his own door the answer to "where do I live" was walk around
       until you see it again.
       REALISM FIRST, and this is the realistic answer rather than the game one: a
       person knows the way to his own house. Not a marker floating over the world
       -- just what anybody standing on a street already has, which way it is and
       how far. The label above is still better when the house is actually
       visible, so this only runs when it is not. */
    homeArrow(cxp,cyp,C);
    return;
  }"""

# the arrow itself, appended right after homePass so it reads in order
TAIL_OLD = """  window.__HOME_LABEL=(window.__HOME_LABEL||0)+1;
}"""

TAIL_NEW = """  window.__HOME_LABEL=(window.__HOME_LABEL||0)+1;
}
/* """ + MARK + """ -- WHICH WAY HOME IS, from the edge of the screen. */
function homeArrow(cxp,cyp,C){
  const mx=cv.width/2, my=cv.height/2;
  let dx=cxp-mx, dy=cyp-my;
  const len=Math.hypot(dx,dy); if(!len) return;
  dx/=len; dy/=len;
  /* THE INSET BOX KEEPS IT OFF THE PAD. The nav ring is 180px in the bottom
     right and it is the one thing his thumb lives on, so the arrow is never
     allowed into that corner. */
  const padL=26, padT=Math.round(cv.height*0.16), padR=26, padB=34;
  let bx=cv.width-padR, by=cv.height-padB;
  if(dx>0&&dy>0){ bx=Math.min(bx,cv.width-206); by=Math.min(by,cv.height-206); }
  /* march out from the middle until the point leaves the box: cheap, exact, and
     it cannot divide by zero on a straight-up or straight-across direction. */
  let t=0; const step=4;
  while(t<4000){
    const px=mx+dx*(t+step), py=my+dy*(t+step);
    if(px<padL||py<padT||px>bx||py>by) break;
    t+=step;
  }
  const ax=Math.round(mx+dx*t), ay=Math.round(my+dy*t);
  /* HOW FAR, IN THE GAME'S OWN UNIT. The day advances 0.084 minutes per cell, so
     the clock is already how this world measures distance. A number of tiles is a
     fact about a grid he cannot see. */
  const cells=Math.round(len/Math.max(1,C));
  const mins=Math.max(1,Math.round(cells*0.084));
  g.save();
  g.translate(ax,ay);
  g.rotate(Math.atan2(dy,dx));
  const r=Math.max(7,Math.round(C*0.20));
  g.beginPath(); g.moveTo(r,0); g.lineTo(-r*0.75,r*0.68); g.lineTo(-r*0.75,-r*0.68); g.closePath();
  g.fillStyle='rgba(12,14,10,0.85)'; g.lineWidth=3; g.strokeStyle='rgba(12,14,10,0.85)'; g.stroke();
  g.fillStyle='#e8b84a'; g.fill();
  g.restore();
  g.save();
  g.font='700 '+Math.max(9,Math.round(C*0.20))+'px "Space Grotesk",system-ui,sans-serif';
  g.textAlign='center'; g.textBaseline='top';
  const lbl='HOME '+mins+' MIN';                                  /* draft:true */
  const ly=Math.min(cv.height-14,ay+Math.max(10,Math.round(C*0.26)));
  /* CLAMP THE TEXT, NOT JUST THE ARROW. First cut clamped where the arrow sits and
     then centred the label on it, so at the right edge the words ran off the
     canvas and he read "HOME 4 MI". The arrow can touch the margin; the sentence
     has to fit inside it, so its own half-width is measured and used. */
  const half=g.measureText(lbl).width/2;
  const lx=Math.max(half+4,Math.min(cv.width-half-4,ax));
  g.fillStyle='rgba(12,14,10,0.85)';
  for(let ddx=-1;ddx<=1;ddx++)for(let ddy=-1;ddy<=1;ddy++)if(ddx||ddy)g.fillText(lbl,lx+ddx,ly+ddy);
  g.fillStyle='#e8b84a'; g.fillText(lbl,lx,ly);
  g.restore();
  window.__HOME_ARROW=(window.__HOME_ARROW||0)+1;
}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: home already points at itself from the edge')
        return
    for needle, why in (('function homePass(', 'the pass that draws the HOME label'),
                        ('function homeFind(', 'the rule that resolves which house is his')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in ((HOME_OLD, HOME_NEW, 'his house is ONE house, keyed on where he landed'),
                           (OLD, NEW, 'the off-screen case stops being a bare return'),
                           (TAIL_OLD, TAIL_NEW, 'the arrow itself')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- when the house is off screen, the screen says which way '
          'it is and how far' % CITY)


if __name__ == '__main__':
    main()
