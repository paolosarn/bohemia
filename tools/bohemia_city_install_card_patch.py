#!/usr/bin/env python3
"""
KEEP THIS RUN (8/18/26, RUN lane) -- the last open piece of the 8/13 home-screen
work order, and the only one that had nowhere to point until now.

THE MANIFEST AND THE ICON SHIPPED 8/16. A player on iOS who adds Bohemia to his
home screen gets a full-screen app with the punk stencil on the springboard. But
MEASURED BEFORE WRITING A LINE:

    grep -c 'ADD TO HOME' on both surfaces  ->  0

Nothing anywhere ever tells him it exists. An install path nobody is told about
is an install path nobody takes, and on iOS THERE IS NO OTHER WAY TO TELL HIM:
`beforeinstallprompt` has never existed in Safari (WebKit bug 255716) and Chrome
and Edge on iOS cannot install either, because they are all Safari underneath.
Every other platform gets a browser-drawn prompt for free. iOS gets a sentence
from us or it gets nothing.

WHY IT MATTERS MORE HERE THAN ON AN ORDINARY SITE, and this is the actual stake:
iOS DOES NOT SHARE STORAGE between Safari and a home-screen app. Separate
localStorage, separate cookies, separate service worker. So the run he is playing
in Safari right now DOES NOT COME WITH HIM when he installs later. The moment to
say it is the moment he has the least to lose -- the end of DAY 1, before there
is a week of valley behind him.

    IT IS A LINE ON THE RECKONING, NOT A CARD OF ITS OWN, AND THAT WAS A
    CORRECTION, NOT A PREFERENCE.

The first cut was its own modal between the SLEEP tap and the DAY 2 wake. THREE
OF MY OWN GATES WENT RED (vista_beat 14/5, dayloop 56/1, demo_day 21/3) and they
were right: the first night would have been reckoning -> install -> wake -> GET
UP -> vista. FIVE MODALS BACK TO BACK, four of them before he gets to play the
second day. The gates were not obstacles to route around, they were the
measurement that the shape was wrong. So it is one heading on a card he is
already reading, and the tap that dismisses it is the SLEEP tap he was already
going to make. It costs him nothing. All three gates went back green untouched.

WORDS, NOT A DECISION (ALWAYS MAKE AN ATTEMPT, 8/11): this is copy, so it ships
written and playable, tagged draft:true so he can find it in the WORDS tab and
edit every word. Nothing here is a number, a price or a map.

ONCE EVER, and it remembers across reloads: INSTALL_ASKED rides the save the same
way VISTA_SEEN does. A prompt that comes back every night is an ad.

AND IT NEVER SHOWS INSIDE THE INSTALLED APP. He already did it; telling him to do
it again is the single most obviously broken thing this feature could do.

THE iOS 26 DETAIL, and it is the difference between an instruction that works and
one that sends him hunting: Safari moved the Share button out of the toolbar. The
path is now the ellipsis, THEN Share, THEN Add to Home Screen. Copy that says
"tap the Share button" describes a button that is not on his screen.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It adds one heading and two sentences of text to a card
that already exists, using that card's own <h3>/markup and its existing single
button. No new surface, no new art.

Gate: gates/install_card_gate.js.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__KEEP_THIS_RUN__'

# ---- 1. the words, the once-ever flag, and the two helpers -------------------
OLD_DECL = """let VISTA_SEEN=false;"""

NEW_DECL = """let VISTA_SEEN=false;
/* """ + MARK + """ -- KEEP THIS RUN. On iOS this sentence is the ONLY install
   path there is: beforeinstallprompt has never existed in Safari (WebKit 255716),
   and Chrome and Edge on iOS are Safari underneath, so no browser will ever draw
   this prompt for us. Measured 8/18 before writing it: `grep -c 'ADD TO HOME'`
   was 0 on both surfaces, so nothing had ever told him the installed app exists.
   THE REAL STAKE IS STORAGE: iOS does NOT share localStorage between Safari and a
   home-screen app, so the run he is in right now does not travel with him when he
   installs. That is why it is said at the end of DAY 1 -- the moment he has the
   least to lose -- and not on day nine.
   var, NOT let: reportState/citySnapshot sit ~500 lines EARLIER in this file and
   read INSTALL_ASKED. A top-level `let` is in the temporal dead zone until its own
   line runs, and the throw would land in citySnapshot's caller. Same trap that ate
   LANDED on 8/11 and CITYSAVE in the standalone check. */
var INSTALL_ASKED=false;
/* WORDS, NOT A DECISION (ALWAYS MAKE AN ATTEMPT, 8/11) -- a real attempt, written
   as if it ships, draft:true so he can find and edit every word in the WORDS tab. */
var INSTALL_WORDS={ draft:true,
  title:'KEEP THIS VALLEY',
  body:'Bohemia lives in your browser. Put it on your home screen and it opens '
     + 'like an app, full screen, straight back into this valley.',
  ios:'Tap \\u22ef at the bottom of Safari, then Share, then Add to Home Screen.',
};
function installShouldAsk(){
  if(INSTALL_ASKED) return false;
  /* NEVER INSIDE THE INSTALLED APP. He already did it. Checked through the top
     window because the city runs in the alpha's iframe: navigator.standalone is
     Apple's flag and is only meaningful on the top document, while display-mode
     reflects the top-level browsing context and so reads correctly from in here.
     Both are wrapped because a cross-origin top is a throw, not a false. */
  try{
    var w = window.top || window;
    if(w.navigator && w.navigator.standalone === true) return false;
  }catch(_e){}
  try{
    if(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
      return false;
  }catch(_e){}
  return true;
}
function installLine(){
  INSTALL_ASKED=true;
  try{ window.__INSTALL_SHOWN=(window.__INSTALL_SHOWN||0)+1; }catch(_e){}
  return '<h3>'+esc(INSTALL_WORDS.title)+'</h3>'
       + '<div class="sub">'+esc(INSTALL_WORDS.body)+'</div>'
       + '<div class="sub">'+esc(INSTALL_WORDS.ios)+'</div>';
}"""

# ---- 2. the anchor on the reckoning card ------------------------------------
OLD_RECK = """  h+='</ul>';
  h+='<div class="dcgo" data-act="next">SLEEP \\u2192 DAY '+(s.day+1)+'</div>';"""

NEW_RECK = """  h+='</ul>';
  /* """ + MARK + """ -- ONE LINE ON A CARD HE IS ALREADY READING, and that shape
     is a correction. The first cut was its own modal between the SLEEP tap and the
     DAY 2 wake, and it took THREE of my own gates red (vista_beat 14/5, dayloop
     56/1, demo_day 21/3) because the first night became reckoning -> install ->
     wake -> GET UP -> vista: five modals, four of them before he plays day two.
     The gates were the measurement that the shape was wrong, not an obstacle.
     Here the tap that dismisses it is the SLEEP tap he was making anyway. */
  if(s.day===1 && installShouldAsk()) h+=installLine();
  h+='<div class="dcgo" data-act="next">SLEEP \\u2192 DAY '+(s.day+1)+'</div>';"""

# ---- 3. it rides the save, the same way VISTA_SEEN does ---------------------
OLD_SNAP = """    vistaSeen:!!VISTA_SEEN,   /* __THE_VALLEY_IS_A_PLACE__ -- once ever means across reloads */"""

NEW_SNAP = """    vistaSeen:!!VISTA_SEEN,   /* __THE_VALLEY_IS_A_PLACE__ -- once ever means across reloads */
    installAsked:!!INSTALL_ASKED,   /* """ + MARK + """ -- a prompt that comes back every night is an ad */"""

OLD_REST = """  /* __THE_VALLEY_IS_A_PLACE__ */
  if(st.vistaSeen){ try{ VISTA_SEEN=true; }catch(_e){} }"""

NEW_REST = """  /* __THE_VALLEY_IS_A_PLACE__ */
  if(st.vistaSeen){ try{ VISTA_SEEN=true; }catch(_e){} }
  /* """ + MARK + """ */
  if(st.installAsked){ try{ INSTALL_ASKED=true; }catch(_e){} }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('the once-ever flag + words', OLD_DECL, NEW_DECL),
                           ('the reckoning anchor', OLD_RECK, NEW_RECK),
                           ('the snapshot', OLD_SNAP, NEW_SNAP),
                           ('the restore', OLD_REST, NEW_REST)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
