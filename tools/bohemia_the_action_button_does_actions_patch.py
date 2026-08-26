#!/usr/bin/env python3
"""
THE ACTION BUTTON IS NOT THE CITY BUTTON
(8/26/26, RUN lane. THE PLAYTEST DISPATCH item 6, LOCKED 8/25, and he said it
again today because it still was not built.)

    "I HATE THAT THE ACTION BUTTON IS THE CITY BUTTON I WANT TO CHANGE THAT I
     SCROLL OUT AND SCROLL INTO THE CITY NOT BY CLICKING THE ACTION BUTTON"

    and today: "the action button shouldn't be the city button, bro. It should
    be the zoom out thing until you keep zooming out ... Like, you haven't even
    done that."

HIS SENTENCE HAS TWO HALVES AND ONLY ONE OF THEM WAS DONE.

HALF ONE, ZOOM, IS BUILT -- AND I CHECKED BEFORE BUILDING ANYTHING, because
"you haven't even done that" deserves a measurement and not an argument. A real
two-finger pinch, dispatched as actual touch, from the street:

    start            human  HZOOM 44
    pinch out        CITY   CZOOM 0.351
    pinch out        SKY
    spread in        city
    spread in        city   CZOOM 1.77
    spread in        HUMAN  HZOOM 44

Street to city to sky and all the way back, one continuous gesture, both
directions. __ZOOM_SEAM__ (8/2) and __ONE_ZOOM_TO_THE_MOON__ (8/12) did that.

HALF TWO WAS NEVER DONE, AND IT IS THE HALF HE NAMES FIRST BOTH TIMES.
The big round button in the middle of the movement pad -- the largest thing on
screen under his right thumb, wearing HIS CHARACTER'S FACE -- still said

    DROP IN  /  CITY

So the most reachable control in the game is a camera toggle, and the game has
NO BUTTON FOR DOING THE THING IN FRONT OF YOU. The law's own words: THE ACTION
BUTTON DOES ACTIONS.

=== WHAT THIS BUILDS ========================================================

THE ROUND BUTTON BECOMES THE ONE CONTEXTUAL VERB. It asks, in this order, what
is actually in front of him and says so on its own face:

    somebody standing next to you   ->  their address (the person system's own
                                        label, so it is never a generic "TALK")
    a door you are facing           ->  ENTER
    a market where you stand        ->  TRADE
    nothing                         ->  it goes quiet and says nothing

*** THE PATTERN IS NOT NEW AND THAT IS THE POINT. *** #cttalk already worked
exactly this way -- "THE BUTTON ONLY EXISTS WHEN SOMEBODY IS THERE. That is what
makes it the ONE CONTEXTUAL VERB and not a menu." That rule was right and it was
stuck on a small pill above the pad while a bigger, rounder, better-placed button
sat in the middle doing camera work. This moves the rule onto the button his
thumb is already on, and ctVerb() stays the single owner of "who is next to me"
rather than growing a second copy.

THE DOOR IS THE NEW VERB, and it is the one the demo needs: today the only way
into a building is to WALK INTO IT and hope. inEnter() is unchanged and still the
one place a body goes through a door; this only gives him a way to ASK for it
while standing still, which is what a door in front of you should offer.

WHERE THE CITY VIEW WENT: a small DROP IN / CITY chip in the chrome, beside
WHOLE MAP. NOT DELETED. Zoom is the way (measured above), but NO DISTRICT IS A
PRISON and a player whose fingers cannot pinch must still be able to get out --
so the toggle survives at the size of a preference instead of the size of the
primary verb. transition() itself is untouched; only what triggers it moved.

NOT CHANGED: the pad, walking, inEnter, the person card, the zoom seams, what
any verb does once pressed.

REUSE CHECK: no graphic pixels cooked -- this re-labels an existing button and
routes existing verbs, so no banks/ lookup applies. #modeFace (his character's
face, already baked) stays exactly where it is.

WORDS: ENTER and TRADE are UI copy, a real attempt, draft:true.

Idempotent (marker __THE_ACTION_BUTTON_DOES_ACTIONS__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_ACTION_BUTTON_DOES_ACTIONS__'

# ------------------------------------------------- 1. what is in front of him
VERB_ANCHOR = """/* THE BUTTON ONLY EXISTS WHEN SOMEBODY IS THERE. That is what makes it the ONE
   CONTEXTUAL VERB and not a menu. */
function ctVerb(){"""

VERB_NEW = """/* """ + MARK + """ (8/26) -- WHAT IS IN FRONT OF HIM, IN ONE PLACE.
   Paolo, twice: "I HATE THAT THE ACTION BUTTON IS THE CITY BUTTON ... THE ACTION
   BUTTON DOES ACTIONS." The biggest, most central control in the game, wearing his
   own character's face, was a camera toggle -- and there was no button anywhere for
   doing the thing in front of you.
   ORDER MATTERS AND IS DELIBERATE: a person beats a door, because if somebody is
   standing in your doorway the thing you mean is them. Returns null when there is
   nothing to do, and a button with nothing to do says nothing -- the same rule
   #cttalk already had, moved onto the button his thumb is on. */
function actFront(){
  if(typeof MODE==='undefined'||MODE!=='human') return null;
  /* a person, using the person system's OWN address so it is never a generic TALK */
  try{
    if(typeof ctAdjacent==='function' && !CT_OPEN){
      var p=ctAdjacent();
      if(p){ var who=ctPerson(p);
             return { kind:'talk', label:BohemiaPeople.addressOf(who), who:p }; }
    }
  }catch(_e){}
  /* a door he is FACING. HFACE is where the body is pointed, which is the only
     honest answer to "in front of" -- reading the whole ring would let him enter a
     building behind his back. */
  try{
    if(typeof HFACE!=='undefined' && typeof isDoorCell==='function'){
      var d=({N:[0,-1],S:[0,1],E:[1,0],W:[-1,0],
              NE:[1,-1],SE:[1,1],NW:[-1,-1],SW:[-1,1]})[HFACE]||[0,1];
      var fx=hx+d[0], fy=hy+d[1], fc=null;
      try{ fc=cellAt(fx,fy); }catch(_e2){}
      if(fc && fc.enter && isDoorCell(fc))
        return { kind:'enter', label:'ENTER', at:[fx,fy] };   /* draft:true */
    }
  }catch(_e){}
  /* a market is a PLACE -- the same rule mktAt() already states */
  try{ if(typeof mktAt==='function' && mktAt())
         return { kind:'trade', label:'TRADE' };              /* draft:true */
  }catch(_e){}
  return null;
}

/* """ + MARK + """: and the round button wears whatever that is. */
function actPaint(){
  var b=document.getElementById('mode'); if(!b) return;
  var l=document.getElementById('modeLbl'); if(!l) return;
  var f=actFront();
  window.__ACT_VERB = f ? f.kind : null;
  if(f){ l.textContent=f.label; b.classList.add('canact'); b.classList.remove('idle'); }
  else { l.textContent=''; b.classList.remove('canact'); b.classList.add('idle'); }
}

/* """ + MARK + """: and pressing it does that thing. One press, one meaning,
   never a menu. Each branch calls the verb's EXISTING owner -- inEnter for doors,
   ctOpenFor for people, showMarket for the market -- so nothing here can drift
   away from what walking into the same thing already does. */
function actPress(){
  var f=actFront(); if(!f) return false;
  /* ctOpen() TAKES NO ARGUMENT -- it asks ctAdjacent() itself, which is exactly
     the single-owner shape this whole patch is built on. Passing it a person would
     have been a second opinion about who is next to him. */
  if(f.kind==='talk'){ try{ ctOpen(); }catch(_e){} return true; }
  if(f.kind==='enter'){ try{ return !!inEnter(f.at[0],f.at[1],hx,hy,false); }catch(_e){ return false; } }
  if(f.kind==='trade'){ try{ showMarket(); }catch(_e){} return true; }
  return false;
}

/* THE BUTTON ONLY EXISTS WHEN SOMEBODY IS THERE. That is what makes it the ONE
   CONTEXTUAL VERB and not a menu. */
function ctVerb(){
  try{ actPaint(); }catch(_e){}   /* """ + MARK + """: the round button repaints on
     the same beat this already ran on -- movement -- so there is no new hook and no
     second thing deciding what is in front of him. */"""

# --------------------------------------- 2. the round button stops toggling mode
CLICK_OLD = """document.getElementById('mode').addEventListener('click',transition);"""

CLICK_NEW = """/* """ + MARK + """ (8/26): THE ACTION BUTTON DOES ACTIONS. This line was the
   whole complaint -- the largest control in the game, in the middle of the movement
   pad, wearing his character's face, wired to a camera toggle. ZOOM IS THE WAY IN
   AND OUT and it is measured working end to end (street -> city -> sky -> back, one
   pinch), so the camera does not need the best button on the screen.
   IT STILL FALLS BACK. If there is genuinely nothing in front of him the press does
   nothing rather than surprising him with a camera move -- a button that does a
   different thing when you are not looking is worse than a button that waits. */
document.getElementById('mode').addEventListener('click',function(){
  try{ if(actPress()) return; }catch(_e){}
});"""

# ------------------------------------------- 3. the label stops saying DROP IN
LBL_OLD = ("  document.getElementById('modeLbl').textContent="
           "MODE==='city'?'⤓ DROP IN':'⤒ CITY';")

LBL_NEW = """  /* """ + MARK + """: the round button says what it will DO, not where the
     camera is. Repainted here because this already runs on every hud update. */
  try{ actPaint(); }catch(_e){}
  { var _mc=document.getElementById('modechip');
    if(_mc) _mc.textContent=MODE==='city'?'\⤓ DROP IN':'\⤒ CITY'; }"""

# ------------------------------- 4. the camera toggle survives as a small chip
CHIP_OLD = """document.getElementById('fitbtn').addEventListener('click',()=>{"""

CHIP_NEW = """/* """ + MARK + """ (8/26) -- THE CAMERA TOGGLE, AT THE SIZE OF A PREFERENCE.
   Zoom is the way in and out and it is measured working, so this is no longer the
   primary verb and no longer owns the best button on the screen. It is NOT deleted:
   NO DISTRICT IS A PRISON (Paolo 8/1) and a player whose fingers cannot pinch must
   still have a way across the seam. Beside WHOLE MAP, in the same chip language,
   calling the SAME transition() the round button used to call. */
(function(){
  var b=document.getElementById('modechip');
  if(!b){
    b=document.createElement('div'); b.id='modechip';
    var st=document.createElement('style');
    st.textContent='#modechip{position:absolute;left:12px;bottom:46px;padding:7px 10px;'
      +'border-radius:5px;background:var(--face);border:1px solid var(--line);'
      +'color:var(--acc);font-weight:600;font-size:10px;letter-spacing:1px;z-index:6}'
      +'#modechip:active{color:#fff;border-color:#5a4a2a;background:#1f1a10}'
      /* the round button, when there is nothing in front of him, is quiet rather
         than gone -- a control that vanishes reads as broken. */
      +'#mode.idle{opacity:0.62}'
      +'#mode.canact{box-shadow:0 0 0 1px var(--acc),0 6px 22px rgba(0,0,0,.6)}';
    document.head.appendChild(st);
    (document.querySelector('.wrap')||document.body).appendChild(b);
    b.addEventListener('click',function(){ try{ transition(); }catch(_e){} });
  }
  try{ b.textContent=(typeof MODE!=='undefined'&&MODE==='city')?'\⤓ DROP IN':'\⤒ CITY'; }catch(_e){}
})();
document.getElementById('fitbtn').addEventListener('click',()=>{"""

EDITS = [
    (VERB_ANCHOR, VERB_NEW, 'actFront/actPaint/actPress, and ctVerb repaints the round button'),
    (CLICK_OLD, CLICK_NEW, 'the round button does the verb, not the camera'),
    (LBL_OLD, LBL_NEW, 'and its label says the verb'),
    (CHIP_OLD, CHIP_NEW, 'the camera toggle survives as a chip'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the action button already does actions')
        return
    for needle, why in (('function ctAdjacent(', 'who is next to him'),
                        ('function inEnter(', 'the one way a body goes through a door'),
                        ('function transition(', 'the camera move the chip inherits'),
                        ('function isDoorCell(', 'the one door predicate')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s' % CITY)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()
