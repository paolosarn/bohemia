#!/usr/bin/env python3
"""
THE COLD OPEN WAS SITTING ON THE PHONE (8/19/26, RUN lane).

FOUND BY PLAYING THE FIRST NIGHT AS A SEQUENCE, which nobody had ever done. Nine
beats now land in the player's first twenty minutes and each was built by a
different turn against its own gate. Every one of those gates is green. The bug
is in the SPACE BETWEEN THEM, which is exactly the space no gate was watching.

MEASURED IN A REAL BROWSER, on the alpha, after one tap on the splash:

    #openInvite (the shell's cold-open banner)   page y   40 -> 127
    the city's own toolbar                       page y   89 -> 120

The toolbar is ENTIRELY INSIDE the banner. Covered: MUSIC, save, the builder
drawer, and PHONE -- with its "1" unread badge lit.

AND THE DAY 1 WAKE CARD, on screen at the same moment, says:

    "Something came in on your phone overnight."
    "THE METER READER - on the network - not taken"

So the game tells him to check his phone, shows him the unread badge, and then
covers the phone with the story hook. THE DEMO'S CORE LOOP IS BLOCKED AT MINUTE
ONE -- the job comes in on the phone, and on day 1 the phone cannot be tapped
until he answers a banner about something else.

It is worse than a covered button, because the banner does not go away on its
own: WATCH and NOT NOW are both real answers and NOT NOW is remembered, so an
unanswered invite sits on the toolbar for the whole first day.

AND THE STORY HOOK LOSES TOO. The cold open is the family, the table, ten years
ago -- the emotional hook of the entire game -- and it is a thin bar at the top
competing with a big gold GET UP button in the middle of the screen. Two asks at
the same instant, and the research on openings is blunt about what that teaches:
a player who gets stacked interruptions in the first minutes calibrates to "this
game will keep interrupting me". Neither beat wins here. The hook is small and
the phone is buried.

THE FIX IS DERIVED, NOT A NUMBER. The obvious patch is `top: 88px` in the shell,
and it is wrong: the toolbar's height is the city's business, it changes with the
font and the notch, and the shell cannot read into the iframe at all on file://
(opaque origins), which is how every gate runs. So the CITY REPORTS ITS OWN
CHROME and the shell clears it:

    city  -> shell : {bohemiaCityChrome:{top:<toolbar bottom, css px>}}
    shell          : openInvite.style.top = that

This rides the bridge repaired on 8/15 (the guard that used to drop every untyped
bohemia* message), so it needed no new channel and a later field needs no new
handler.

BEFORE THE REPORT ARRIVES THE BANNER OPENS WHERE IT ALWAYS DID, and that is not
a guessed toolbar height -- it is the honest statement that AN EMPTY PANEL HAS NO
TOOLBAR TO COVER. It drops to the reported line the moment the city says where
its chrome is.

THE FIRST CUT HELD THE BANNER BACK UNTIL THE REPORT ARRIVED, AND THAT WAS WRONG.
It looked principled -- no number, no guess -- and the pixels ended up right, so
first_night_gate went green on it. Then MEASURED: the report lands 8.5 SECONDS
after the RUN tap, because the city is a 2.3MB document that has to boot. The
story hook sat invisible for eight seconds, and opening_gate (another lane's,
which claims "TAPPING RUN WITH NO DAY IN PROGRESS OFFERS THE OPENING") went red
and was RIGHT to. Making one beat wait on another document's load is a regression
even when the geometry is correct, and the fix was to earn the timing rather than
to loosen somebody else's gate -- fix the target, never the ruler.

A SECOND HALF THAT ONLY MOVING THE BANNER WOULD HAVE MISSED: it also STANDS DOWN
entirely while a city surface is open, because clearing the toolbar and then
sitting on the phone screen behind it is moving a bug rather than fixing one.

WHAT THIS DELIBERATELY DOES NOT TOUCH: the cutscene itself, its copy, its
trigger, WATCH/NOT NOW semantics, or where it lives in the CUTSCENE tab. This is
a collision between two lanes' surfaces, and only the collision is fixed.

Gate: gates/first_night_gate.js -- plays the first night on the real alpha and
asserts the phone is reachable while the invite is up.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It moves one existing element and adds no surface.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_COLD_OPEN_CLEARS_THE_TOOLBAR__'

# ---- 1. the city reports its own chrome -------------------------------------
CITY_OLD = """function reportState(){"""

CITY_NEW = """/* """ + MARK + """ -- THE CITY REPORTS ITS OWN CHROME.
   The shell floats the cold-open invite over this iframe and it was landing ON
   the toolbar: measured 8/19, the banner covered page y 40-127 and this toolbar
   sits at 89-120, so MUSIC, save, the builder drawer and PHONE -- unread badge
   lit, on the morning the wake card says "something came in on your phone" --
   were all underneath it. The job comes in on the phone, so that is the demo's
   core loop blocked at minute one.
   THE SHELL CANNOT MEASURE THIS ITSELF. Cross-frame DOM access is blocked on
   file:// (opaque origins), which is how every gate runs, and the toolbar's
   height is the city's business anyway -- it moves with the font and the notch.
   A hardcoded 88 in the shell is the same class of mistake as the bug.
   So this posts the one number the shell needs, on boot and whenever the layout
   can have changed. It rides the bridge repaired on 8/15. */
/* AND IT REPORTS WHEN TO STAND DOWN ENTIRELY. Moving the banner below the
   toolbar was only half the fix and the first cut shipped that half: measured,
   the phone SCREEN then ran page 115-844 while the banner sat at 121-208, so
   the top ninety pixels of the phone -- the job list, on the morning the job
   arrives -- were still underneath it. Clearing one button and covering the
   surface behind it is moving a bug, not fixing one.
   OCCLUSION IS DERIVED, NOT A LIST OF SURFACE NAMES. Anything visible that
   covers most of the viewport AND DECLARES A STACKING LEVEL counts, so the
   phone, the market, a day card and whatever a later lane adds are all handled
   with no edit here -- the same reason the 8/15 bridge guard tests for a
   bohemia* key instead of naming seven messages.
   THE z-index CLAUSE IS LOAD-BEARING AND IT COST ME A ROUND. Without it the
   first cut matched #cv -- THE WORLD CANVAS ITSELF, 94% of the viewport -- so
   the banner was suppressed permanently and the cold open would simply never
   have appeared: a worse bug than the one being fixed, shipped inside the fix.
   Caught by measuring after the change rather than assuming, then derived
   properly: the world is painted at the bottom of the stack (#cv declares no
   z-index at all) and anything drawn OVER it must declare one to get there.
   That is a property of what an overlay IS, not a list of which ones exist. */
function cityOccluded(){
  try{
    var W=innerWidth, H=innerHeight, els=document.body.getElementsByTagName('*');
    for(var i=0;i<els.length;i++){
      var e=els[i], s=getComputedStyle(e);
      if(s.position!=='fixed'&&s.position!=='absolute') continue;
      if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0) continue;
      var z=parseInt(s.zIndex,10);
      if(!(z>=1)) continue;               /* the world sits at the bottom, not over it */
      /* AND IT MUST REPLACE THE SCREEN, NOT DIM IT. An OPAQUE panel (the phone,
         #070605) is a surface the player reads and taps at the top, so a banner
         floating on it is the same bug in a new place. A SCRIM (the day card,
         rgba(6,5,4,.86)) is a modal over the world with its content centred well
         below the banner's band -- they have always coexisted and the banner is
         not what was wrong with that pairing.
         WITHOUT THIS CLAUSE the day card counts, and the day card is up the
         instant a run starts, so the cold open is never offered at all --
         opening_gate (another lane's) went red on exactly that and was right.
         Alpha is the honest discriminator here and it is a property, not a list:
         replaces-the-screen vs dims-the-screen. */
      var bg=s.backgroundColor||'', al=bg.match(/^rgba\(.*,\s*([0-9.]+)\s*\)$/);
      if(al && parseFloat(al[1])<1) continue;
      if(bg==='transparent'||bg==='rgba(0, 0, 0, 0)') continue;
      var r=e.getBoundingClientRect();
      if(r.width*r.height >= W*H*0.4) return true;
    }
  }catch(_e){}
  return false;
}
var _chromeLast='';
function reportChrome(){
  try{
    if(!(window.parent&&window.parent!==window)) return;
    var tb=document.getElementById('topbar');
    if(!tb) return;
    var r=tb.getBoundingClientRect();
    if(!(r.height>0)) return;
    var msg={top:Math.ceil(r.bottom),busy:cityOccluded()};
    var key=msg.top+'/'+msg.busy;
    if(key===_chromeLast) return;      /* only ever posts on a real change */
    _chromeLast=key;
    window.parent.postMessage({bohemiaCityChrome:msg},'*');
  }catch(_e){}
}
try{
  window.addEventListener('resize',function(){ setTimeout(reportChrome,60); });
  window.addEventListener('orientationchange',function(){ setTimeout(reportChrome,240); });
  /* more than once on boot on purpose: fonts land late and the first rect can be
     short, and a banner parked one line too high is the whole bug again. */
  setTimeout(reportChrome,120); setTimeout(reportChrome,600); setTimeout(reportChrome,1800);
  /* A POLL, and it is the honest tool here. Surfaces open from a dozen places
     and hooking each one is the list this deliberately avoids; the check is a
     few rects and it posts NOTHING unless the answer changed. */
  setInterval(reportChrome,400);
}catch(_e){}
function reportState(){"""

# ---- 2. the shell clears it -------------------------------------------------
ALPHA_OLD = """  if(getComputedStyle(host).position==='static') host.style.position='relative';
  if(inv.parentElement!==host) host.appendChild(inv);
  inv.style.display='block';
}"""

ALPHA_NEW = """  if(getComputedStyle(host).position==='static') host.style.position='relative';
  if(inv.parentElement!==host) host.appendChild(inv);
  /* """ + MARK + """ -- CLEAR THE CITY'S TOOLBAR.
     This banner used to sit at top:0 of the panel and the walked city's own
     toolbar is a few pixels down inside the iframe, so the banner covered
     MUSIC, save, the builder drawer and PHONE. On DAY 1 the wake card says
     "Something came in on your phone overnight" and shows the unread badge --
     and the phone was underneath this. The job comes in on the phone.
     The offset is REPORTED BY THE CITY, never hardcoded: the shell cannot read
     into the iframe on file:// (opaque origins, which is how every gate runs),
     and the height is the city's business anyway.
     BEFORE THE CITY EXISTS THERE IS NOTHING TO CLEAR, so the banner opens where
     it always did and drops to the reported line the instant the city says where
     its chrome is. That is not a guessed toolbar height -- it is the honest
     statement that an empty panel has no toolbar to cover.
     THE FIRST CUT HELD THE BANNER BACK UNTIL THE REPORT ARRIVED AND THAT WAS
     WRONG: measured, the report lands 8.5 SECONDS after the RUN tap, because the
     city is a 2.3MB document that has to boot. So the story hook sat invisible
     for eight seconds and opening_gate went red on "TAPPING RUN WITH NO DAY IN
     PROGRESS OFFERS THE OPENING" -- correctly. Making a beat wait on another
     document's load is a regression even when the pixels end up right. */
  if(CITY_BUSY){ inv.style.display='none'; return; }
  inv.style.top=(typeof CITY_CHROME_TOP==='number'?CITY_CHROME_TOP:0)+'px';
  inv.style.display='block';
}
/* var, NOT let: openInviteShow above runs from a tab handler that can fire
   before this line is reached, and a top-level let would throw out of the
   temporal dead zone into a listener nobody is catching. Same trap that ate
   LANDED on 8/11 and CITYSAVE in the standalone check. */
var CITY_CHROME_TOP=null, CITY_BUSY=false;
function cityChromeIn(d){
  if(!d||!d.bohemiaCityChrome) return false;
  var m=d.bohemiaCityChrome, t=m.top;
  if(typeof t!=='number'||!(t>=0)) return true;
  CITY_CHROME_TOP=t; CITY_BUSY=!!m.busy;
  var inv=document.getElementById('openInvite');
  if(!inv) return true;
  /* reposition a banner that is already up: fonts land late, and the phone
     staying covered for the first second is still the phone being covered. */
  inv.style.top=t+'px';
  /* AND STAND DOWN while the city has a surface open, then come back when it
     closes. He never loses the invitation, he just never reads it through the
     phone he was told to check. */
  if(inv.dataset.want==='1') inv.style.display=CITY_BUSY?'none':'block';
  return true;
}
window.addEventListener('message',function(ev){ try{ cityChromeIn(ev&&ev.data); }catch(_e){} });"""

# the invite must remember it WANTED to be up, so a late report can raise it
WANT_OLD = """  if(CITY_BUSY){ inv.style.display='none'; return; }"""
WANT_NEW = """  inv.dataset.want='1';
  if(CITY_BUSY){ inv.style.display='none'; return; }"""

HIDE_OLD = """function openInviteHide(){
  var inv=document.getElementById('openInvite');
  if(inv) inv.style.display='none';
}"""
HIDE_NEW = """function openInviteHide(){
  var inv=document.getElementById('openInvite');
  /* """ + MARK + """ -- answered means answered: clear the want flag too, or a
     later chrome report raises a banner he already dismissed. */
  if(inv){ inv.dataset.want='0'; inv.style.display='none'; }
}"""


def patch(path, pairs):
    if not os.path.exists(path):
        sys.exit('FAIL: ' + path + ' not found')
    s = open(path, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already in ' + path)
        return False
    for name, old, new in pairs:
        if old not in s:
            sys.exit('FAIL: anchor not found in ' + path + ' -- ' + name)
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + path + ' (' + str(len(s)) + ' bytes)')
    return True


def main():
    patch(CITY, [('the chrome reporter', CITY_OLD, CITY_NEW)])
    patch(ALPHA, [('the invite placement', ALPHA_OLD, ALPHA_NEW),
                  ('the want flag', WANT_OLD, WANT_NEW),
                  ('the hide path', HIDE_OLD, HIDE_NEW)])


if __name__ == '__main__':
    main()
