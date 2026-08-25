#!/usr/bin/env python3
"""
CLICKING OUT OF A PANEL HAS TO CLOSE IT, ON ALL OF THEM, NOT JUST THE CARD
(8/24/26, RUN lane.)

PAOLO, verbatim, and it is a rule about the WHOLE UI rather than one button:

    "there shouldn't be any buttons that bring up any pop menus that don't go
     away after ... clicking out of them"

The card system got this in the same session (__EVERY_PANEL_CLOSES__). The other
five floating panels did not, and they are the ones he meets while playing:

    #savepanel   the save/export card      CLOSE button: yes    tap outside: NO
    #keypanel    the colour legend         CLOSE button: varies tap outside: NO
    #pfpanel     the pathfinder readout    CLOSE button: varies tap outside: NO
    #popwrap     the population card       CLOSE button: yes    tap outside: NO
    #phonewrap   the phone                 CLOSE button: yes    tap outside: NO

None of them is technically STUCK -- each has some button somewhere -- and that
is exactly the trap. "It has a close button" is not the standard he set. The
standard is that the gesture everybody already makes, tapping the world behind
the thing, puts the thing away. A panel you have to find the right pixel to
dismiss is a panel that feels broken, and he is the one holding the phone.

HOW MY OWN GATE GOT THIS WRONG FIRST, recorded because it is the same mistake in
miniature: the first run of every_panel_closes_gate reported savebtn, keybtn and
five others as STUCK. They were not. The gate pressed #phoneclose and #popclose
and never pressed #sv-close, so it declared a panel unclosable because IT did not
know the button's name -- a gate measuring its own blind spot and calling it a
defect in the game. The gate now presses whatever the open panel itself offers,
found by looking, and the real finding underneath survived: none of them answers
a tap outside.

WHAT THIS BUILDS, and it is deliberately ONE mechanism rather than five patches:
a single capture-phase listener on the document. When a panel is open and a
pointer lands outside BOTH the panel and the chip that opens it, the panel
closes. Escape closes all of them.

  - CAPTURE PHASE, so a panel that stops propagation on its own content cannot
    hide the tap from this.
  - THE OPENER IS EXCLUDED, or the toggle would fight itself: the same tap would
    open the panel and immediately be seen as a tap outside it.
  - EACH PANEL IS PUT AWAY THE WAY ITS OWN AUTHOR PUTS IT AWAY. The phone has a
    phoneClose() that also clears PHONE_ON; calling it is not the same as setting
    display:none, and reaching past somebody's teardown to hide their element is
    how state and pixels drift apart. So the table names a closer per panel and
    falls back to the class or the style only where there is nothing to call.
  - THE DEV DRAWER IS INCLUDED. It is a menu that hangs open over the world.

NOT INCLUDED, on purpose: #daycard already has its own scrim (same session), and
the nav pad and the toolbar are not panels.

REUSE CHECK: no graphic pixels cooked -- this closes existing elements, so no
banks/ lookup applies.

Idempotent (marker __CLICK_OUTSIDE_CLOSES__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CLICK_OUTSIDE_CLOSES__'

ANCHOR = """function phoneClose(){ PHONE_ON=false; document.getElementById('phonewrap').classList.remove('on'); }"""

BLOCK = ANCHOR + """
/* ==== """ + MARK + """ (8/24, RUN lane) =================================
   Paolo: "there shouldn't be any buttons that bring up any pop menus that don't
   go away after ... clicking out of them."
   Every floating panel in the city, answering the one gesture everybody already
   makes. ONE listener, not five patches, because five patches is how the last
   two of these ended up behaving differently from each other.
   MEASURED FIRST: all five had SOME button and NONE of them answered a tap
   outside. "It has a close button" is not the standard he set. */
var OUTSIDE_PANELS = [
  /* panel id,    the chip that opens it,  how ITS OWN AUTHOR closes it */
  ['phonewrap',   'phonebtn',  function(){ try{ phoneClose(); }catch(_e){} }],
  ['savepanel',   'savebtn',   null],
  ['keypanel',    'keybtn',    null],
  ['pfpanel',     null,        null],
  ['popwrap',     'popbtn',    null],
  ['devtray',     'devbtn',    function(){ var t=document.getElementById('devtray');
                                           if(t)t.classList.remove('on');
                                           var b=document.getElementById('devbtn');
                                           if(b)b.classList.remove('on'); }]
];
function panelIsOpen(el){
  if(!el) return false;
  var s=getComputedStyle(el);
  return s.display!=='none' && s.visibility!=='hidden' && el.offsetParent!==null;
}
/* CLOSE IT THE WAY ITS AUTHOR DOES. The phone's own close also clears PHONE_ON;
   setting display:none behind its back leaves the flag saying the phone is up
   while the pixels say it is not, which is exactly how state and screen drift
   apart. Only fall back to hiding when nobody published a closer. */
function panelClose(row){
  var el=document.getElementById(row[0]); if(!el) return;
  if(row[2]){ row[2](); return; }
  if(el.classList.contains('on')) el.classList.remove('on'); else el.style.display='none';
}
document.addEventListener('pointerdown', function(ev){
  for(var i=0;i<OUTSIDE_PANELS.length;i++){
    var row=OUTSIDE_PANELS[i], el=document.getElementById(row[0]);
    if(!panelIsOpen(el)) continue;
    if(el.contains(ev.target)) continue;                       /* inside it: leave it be */
    var opener=row[1]?document.getElementById(row[1]):null;     /* the tap that opened it */
    if(opener&&(opener===ev.target||opener.contains(ev.target))) continue;
    panelClose(row);
  }
}, true);   /* CAPTURE, so a panel that stops propagation cannot hide the tap */
document.addEventListener('keydown', function(ev){
  if(ev.key!=='Escape') return;
  for(var i=0;i<OUTSIDE_PANELS.length;i++){
    var el=document.getElementById(OUTSIDE_PANELS[i][0]);
    if(panelIsOpen(el)) panelClose(OUTSIDE_PANELS[i]);
  }
});
/* ==== end """ + MARK + """ ============================================== */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: clicking outside already closes every panel')
        return
    for needle, why in (('id="savepanel"', 'the save panel'),
                        ('id="phonewrap"', 'the phone'),
                        ('id="popwrap"', 'the population card')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))
    n = s.count(ANCHOR)
    if n != 1:
        sys.exit('FAIL: phoneClose anchor matched %d times, expected 1' % n)
    open(CITY, 'w', encoding='utf8').write(s.replace(ANCHOR, BLOCK, 1))
    print('PATCHED %s -- a tap outside any panel, or Escape, puts it away' % CITY)


if __name__ == '__main__':
    main()
