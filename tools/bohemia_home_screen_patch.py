#!/usr/bin/env python3
"""
IT GOES ON HIS HOME SCREEN (8/16/26, RUN lane). Demo board row 6, the open half.

The 8/13 work order, still open when measured this morning: manifest + apple
metas + icon + the install card. `grep -c manifest` across all three surfaces was
0, 0 and 0, and `apple-touch-icon` likewise. He demos this on a phone, off one
link, and until now that link had no name, no icon and no way to leave Safari.

RESEARCHED FIRST, BECAUSE iOS DOES NOT BEHAVE THE WAY THE DOCS FOR EVERY OTHER
PLATFORM SAY IT DOES, and getting this wrong is a demo that opens in a browser
chrome with a screenshot for an icon:

 1. iOS DOES NOT USE THE MANIFEST'S ICONS for the home screen. It reads
    <link rel="apple-touch-icon">, and where that element exists it OVERRIDES the
    manifest icon list entirely. So the touch icon is not the legacy path here,
    it is the ONLY path that puts his logo on the springboard.
 2. `apple-mobile-web-app-capable` is legacy against `display:standalone` in a
    manifest, and as of iOS 26 a site added to the Home Screen opens as a web app
    ANYWAY. Both ship: the manifest is the modern, correct declaration, and the
    meta costs one line and covers every older phone a friend might hand over.
 3. *** THE ONE THAT ACTUALLY MATTERS FOR HIS SAVE. *** STORAGE IS NOT SHARED
    BETWEEN SAFARI AND THE HOME-SCREEN APP. Not localStorage, not cookies, not
    the service worker registration -- a standalone web app on iOS gets its OWN
    storage bucket. So the run he has been playing in Safari IS NOT THERE when he
    opens the icon. The save is not corrupt and nothing is broken; it is a
    different jar, and it looks exactly like the save being wiped.

    THAT IS WHY THIS FILE DOES MORE THAN PASTE FOUR TAGS. The alpha already has
    an EXPORT SAVE / IMPORT SAVE path (the city's save panel, built for the
    hostile-browser cases). So on the FIRST boot in standalone with NOTHING
    saved, the game says so in plain words and points at the door that already
    exists, instead of silently starting him at day 1 in an empty valley and
    letting him conclude the save is broken. Detected, never guessed:
    navigator.standalone (Apple's own flag) or display-mode:standalone, AND an
    empty save. Both true, or it stays quiet.

WHAT IS NOT HERE, AND WHY: the work order's "first-sleep-save install card" (an
ADD TO HOME SCREEN prompt after his first night) is not in this pass. Choosing
when to interrupt a player, and with what words, is a directing decision, and
this file is the plumbing that has to exist before that card could point
anywhere. The card is written into the handoff as the next step, not skipped
quietly.

REUSE CHECK: cooks no graphic pixels. The icon is his own chosen logo, read out
of his bank by tools/bohemia_home_icon.py (see its REUSE CHECK). The install
notice reuses the front splash's own type treatment and the save panel's existing
import path; no new surface is invented.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MANIFEST = 'slices/bohemia.webmanifest'
MARK = '__IT_GOES_ON_HIS_HOME_SCREEN__'

MANIFEST_JSON = """{
  "name": "BOHEMIA",
  "short_name": "BOHEMIA",
  "id": "/bohemia/slices/BOHEMIA_ALPHA_0_9.html",
  "start_url": "BOHEMIA_ALPHA_0_9.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0c0a08",
  "theme_color": "#0c0a08",
  "description": "A roguelite city-builder in post-economic-apocalypse Las Vegas.",
  "icons": [
    { "src": "icons/bohemia-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/bohemia-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/bohemia-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
"""

HEAD_ANCHOR = '<meta name="viewport"'
HEAD_ADD = """<!-- """ + MARK + """ -- IT GOES ON HIS HOME SCREEN (demo board row 6).
     iOS DOES NOT read the manifest's icons for the springboard: it reads
     apple-touch-icon, and that element OVERRIDES the manifest list where both
     exist. So the touch icon is not a legacy fallback here, it is the only thing
     that puts his own chosen logo (bank pick #11, THE ONE) on his phone.
     The manifest is the modern declaration and carries display:standalone; the
     capable meta costs one line and covers older phones a friend might hand
     over. Both, on purpose. -->
<link rel="manifest" href="bohemia.webmanifest">
<link rel="apple-touch-icon" href="icons/bohemia-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="BOHEMIA">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#0c0a08">
"""

# the standalone storage split, surfaced on the front screen where he lands
SPLASH_ANCHOR = """  <div id="fronttap">TAP TO ENTER</div>"""
SPLASH_ADD = """  <div id="fronttap">TAP TO ENTER</div>
  <!-- """ + MARK + """ -- THE STORAGE SPLIT, SAID OUT LOUD INSTEAD OF LOOKING
       LIKE A WIPED SAVE. iOS gives a home-screen web app its OWN storage bucket:
       localStorage, cookies and the service worker are NOT shared with Safari.
       So a run played in Safari is simply not in the jar the icon opens, and the
       symptom is indistinguishable from the save being destroyed. This says so,
       in plain words, ONLY when both things are true (standalone AND nothing
       saved), and points at the EXPORT/IMPORT path the save panel already has
       rather than inventing a new one. -->
  <div id="standalonenote" style="display:none;position:absolute;left:14px;right:14px;bottom:34px;
       font:11px ui-monospace,monospace;color:#8d7c5e;letter-spacing:1px;line-height:1.5;text-align:center"></div>"""

BOOT_ANCHOR = """document.getElementById('front').addEventListener('click',()=>{"""
BOOT_ADD = """/* """ + MARK + """ -- see the note element above. navigator.standalone is
   Apple's own flag and display-mode:standalone covers everyone else; BOTH this
   AND an empty save must be true, so a returning player never sees it. */
(function(){
  var solo = (window.navigator && window.navigator.standalone === true) ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  if(!solo) return;
  /* *** A NOT-YET IS NOT AN ANSWER. *** The first cut read CITYSAVE right here
     and wrapped it in a catch that set empty=true. CITYSAVE is a `const` about
     FOUR THOUSAND LINES further down this file, so at this point it is in the
     temporal dead zone: the read THREW, the catch called that "no save", and the
     gate caught the build telling a returning player his run was gone. Same
     shape as the HOME/LANDED bug on 8/11 -- a silent catch around a TDZ error
     looks exactly like a feature quietly doing the wrong thing. So it WAITS for
     the ledger to exist and only then decides, and if it never arrives it says
     NOTHING, because a warning fired on no evidence is worse than no warning. */
  var tries = 0;
  function decide(){
    var sv = null;
    try{ sv = CITYSAVE.load(); }
    catch(_e){ if(tries++ < 60){ setTimeout(decide, 100); } return; }
    var empty = !(sv && sv.data);
    window.__STANDALONE_EMPTY = !!empty;
    if(!empty) return;
    var el = document.getElementById('standalonenote');
    if(!el) return;
    el.textContent = 'Added to your home screen. iPhone gives this its own save, '
      + 'separate from Safari, so a run you played in the browser is not here. '
      + 'Open the browser, tap the disk icon, EXPORT SAVE, then IMPORT it in here.';
    el.style.display = 'block';
    window.__STANDALONE_NOTE = 1;
  }
  decide();
})();
document.getElementById('front').addEventListener('click',()=>{"""


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if HEAD_ANCHOR not in s:
        sys.exit('FAIL: no viewport meta to sit beside')
    i = s.index(HEAD_ANCHOR)
    s = s[:i] + HEAD_ADD + s[i:]
    for name, old, new in [('the splash note', SPLASH_ANCHOR, SPLASH_ADD),
                           ('the boot check', BOOT_ANCHOR, BOOT_ADD)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    open(MANIFEST, 'w', encoding='utf-8').write(MANIFEST_JSON)
    print('PATCHED ' + ALPHA + ' + wrote ' + MANIFEST)


if __name__ == '__main__':
    main()
