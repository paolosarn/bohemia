#!/usr/bin/env python3
"""
THE NOTICE THAT KEEPS GETTING DELETED (8/19/26, RUN lane).

TWICE NOW a rebase onto the front splash has dropped `<div id="standalonenote">`
while keeping the script that fills it. The element's own comment records the
first time, on 8/17: "a rebase onto a splash another lane had edited dropped this
element while keeping the script that fills it, so the notice went silent with
every source check still green." It was re-placed. On 8/19 it was dropped AGAIN,
by 9a2151f, and home_screen_gate went 16/2 on main.

RE-PLACING IT A THIRD TIME IS NOT A FIX, IT IS THE THIRD ROUND OF THE SAME LOSS.
The element sits inches from #buildstamp inside the front splash -- the single
hottest conflict region in this repo, the one every lane edits on every ship --
and nothing about a bare div can survive that. The failure is silent by
construction: the script does `if(!el) return;`, so a missing element is
indistinguishable from a player who does not need the notice, and EVERY source
check stays green. Only the gate that drives a real standalone browser sees it.

SO THE SCRIPT THAT FILLS IT NOW GUARANTEES IT EXISTS. If the div was dropped,
this creates it and appends it to the splash with the same styling it always had.
That is the derived form of the same rule the bridge guard and the chrome
reporter follow: DO NOT DEPEND ON A VALUE ANOTHER HAND MAINTAINS WHEN YOU CAN
DERIVE IT. A later rebase can delete the markup as many times as it likes and the
notice still reaches the player.

WHAT THE NOTICE IS FOR, unchanged: iOS gives a home-screen app its own storage,
separate from Safari. A player who installs after playing in the browser opens
the app to an empty valley, and the symptom is indistinguishable from the save
being destroyed. The notice says the storage is separate and points at the
EXPORT/IMPORT door the save panel already has. It is shown ONLY when standalone
AND nothing is saved, so a returning player never sees it.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It re-creates one empty div with the styling the element
already carried, and changes no copy.

Gate: gates/home_screen_gate.js (already drives a real standalone browser with an
empty store, which is what caught both deletions).

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_NOTICE_SURVIVES_A_REBASE__'

OLD = """    var el = document.getElementById('standalonenote');
    if(!el) return;"""

NEW = """    /* """ + MARK + """ -- THE ELEMENT HAS BEEN DELETED BY A REBASE TWICE.
       It lives inches from #buildstamp in the front splash, which is the hottest
       conflict region in the repo -- every lane edits it on every ship -- and on
       8/17 and again on 8/19 a rebase dropped the div while keeping this script.
       The failure is SILENT BY CONSTRUCTION: `if(!el) return` makes a missing
       element look exactly like a player who does not need the notice, and every
       source check stays green while the notice never appears.
       So this no longer DEPENDS on markup another hand maintains -- it makes the
       element when it is gone. A third rebase can delete it again and the player
       still gets told his storage is separate. */
    var el = document.getElementById('standalonenote');
    if(!el){
      el = document.createElement('div');
      el.id = 'standalonenote';
      el.style.cssText = 'display:none;position:absolute;left:14px;right:14px;bottom:34px;'
        + 'font:11px ui-monospace,monospace;color:#8d7c5e;letter-spacing:1px;'
        + 'line-height:1.5;text-align:center';
      var host = document.getElementById('front') || document.body;
      if(!host) return;
      host.appendChild(el);
    }"""


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the standalone note anchor is not where this expects it')
    s = s.replace(OLD, NEW, 1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + ALPHA + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
