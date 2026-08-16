#!/usr/bin/env python3
"""
THE BUILDER'S TOOLS COME OUT OF HIS THUMB'S WAY (8/16/26, RUN lane).

PAOLO, 8/16: "Im not even trying to press re roll fr the run has a lot of
bullshit buttons still around from the early days."

That is a ruling, and it is a different bug from the one he reported yesterday.
Yesterday's was "reroll did something terrible"; another lane fixed that. THIS
one is "I keep hitting it BY ACCIDENT, and it is not the only one." The button
was not the problem. THE TOOLBAR WAS.

WHAT WAS IN THE ROW HE TAPS WHILE WALKING, audited one at a time rather than
guessed at:

    MUSIC    on/off               PLAYER
    save     the save panel       PLAYER
    PHONE    where his job lands  PLAYER   <- what he is actually reaching for
    REROLL   regenerates the world                    BUILDER, from the sandbox era
    KEY      a colour legend + district-type FILTERS  BUILDER, a map tool
    UNDER    the underground inspection view          BUILDER

Three of six were tools for building the world, sitting either side of the one
button he actually presses, at phone size, under a thumb. He was never trying to
press REROLL. He was trying to press PHONE.

WHAT THIS DOES: the three builder tools move into a tray behind one 🛠 toggle at
the FAR END of the row, away from PHONE. Nothing is deleted and nothing moves out
of the DOM -- REROLL is another lane's live feature with its own gate (which
clicks it through the DOM, so a closed tray does not bother it), and UNDER and
KEY are real tools somebody uses. They are simply not in his way any more.

WHY A TRAY AND NOT A DELETION, given I already made that mistake once this week:
I deleted REROLL on his first report, and it turned out another lane had fixed it
that same day for the same user. Removing a working feature to solve an ergonomics
problem is the wrong tool twice over. The ergonomics problem has an ergonomics
fix.

AND THE SECOND HALF OF WHAT HE SAID: "I always want to make sure your procedurally
generated world is 10/10." So the tools that INSPECT the world do not get thrown
away -- they get a home. A tray one tap away is still one tap away.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It reuses the topbar's own button treatment for the tray
rows and moves three existing elements; no handler is touched, so every one of
them behaves exactly as it did.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__BUILDERS_TOOLS_IN_A_DRAWER__'

OLD = """  <div id="topbar"><!-- TOOLBAR TIDY: one flex row, never overlaps -->
    <div id="musbtn">🎵 MUSIC</div>
    <div id="savebtn">💾</div>
    <div id="reroll">↻ REROLL</div>
    <div id="underbtn">⬇ UNDER</div>
    <div id="phonebtn">📱 PHONE<span id="phonebadge"></span></div>
    <div id="keybtn">🔑 KEY</div>
  </div>"""

NEW = """  <!-- """ + MARK + """ -- Paolo 8/16: "Im not even trying to press re roll fr
       the run has a lot of bullshit buttons still around from the early days."
       AUDITED ONE AT A TIME: of the six controls that used to be in this row,
       three were tools for BUILDING the world (REROLL regenerates it, KEY is a
       colour legend and district FILTER, UNDER is the underground inspection
       view) and they sat either side of PHONE, which is the one he is actually
       reaching for. At phone size, under a thumb. He was never trying to press
       REROLL. Nothing is deleted and nothing leaves the DOM -- REROLL is another
       lane's live feature with its own gate, and he also said "I always want to
       make sure your procedurally generated world is 10/10", so the tools that
       INSPECT the world keep a home. They are one tap away instead of under his
       thumb, at the FAR END of the row, away from PHONE. -->
  <div id="topbar"><!-- TOOLBAR TIDY: one flex row, never overlaps -->
    <div id="musbtn">🎵 MUSIC</div>
    <div id="savebtn">💾</div>
    <div id="phonebtn">📱 PHONE<span id="phonebadge"></span></div>
    <div id="devbtn">🛠</div>
  </div>
  <div id="devtray"><!-- """ + MARK + """ -- the builder's tools, out of the way -->
    <div id="reroll">↻ REROLL</div>
    <div id="underbtn">⬇ UNDER</div>
    <div id="keybtn">🔑 KEY</div>
  </div>"""

CSS_OLD = """#phonebtn{position:relative}"""
CSS_NEW = """#phonebtn{position:relative}
/* """ + MARK + """ -- the builder's tray. Same treatment as the toolbar buttons
   it holds, so nothing looks like a different app; hidden until asked for. */
#devbtn{padding:7px 9px;border-radius:5px;background:var(--face);border:1px solid var(--line);
  color:#6f6350;font-size:11px;font-weight:700;letter-spacing:1px}
#devbtn.on{color:var(--acc);border-color:var(--acc)}
#devtray{position:absolute;right:6px;top:44px;z-index:9;display:none;
  flex-direction:column;gap:5px;padding:6px;border-radius:8px;
  background:rgba(12,10,8,.96);border:1px solid var(--line)}
#devtray.on{display:flex}
#devtray > div{padding:7px 11px;border-radius:5px;background:var(--face);
  border:1px solid var(--line);color:var(--acc);font-size:11px;font-weight:700;
  letter-spacing:1px;white-space:nowrap;text-align:center}
#devtray > div:active{border-color:var(--acc);color:#fff}"""

BOOT_OLD = """document.getElementById('keybtn').addEventListener('click',()=>{ kp.style.display=kp.style.display==='block'?'none':'block'; });"""
BOOT_NEW = """document.getElementById('keybtn').addEventListener('click',()=>{ kp.style.display=kp.style.display==='block'?'none':'block'; });
/* """ + MARK + """ -- one toggle for the whole tray. The tools inside keep their
   own handlers untouched, so each behaves exactly as it always did. */
document.getElementById('devbtn').addEventListener('click',()=>{
  const t=document.getElementById('devtray');
  const on=!t.classList.contains('on');
  t.classList.toggle('on',on);
  document.getElementById('devbtn').classList.toggle('on',on);
});"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [('the toolbar', OLD, NEW),
                           ('the css', CSS_OLD, CSS_NEW),
                           ('the boot', BOOT_OLD, BOOT_NEW)]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
