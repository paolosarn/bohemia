#!/usr/bin/env python3
"""V119 GIVE THE FIELD THE SCREEN BACK -- WITHOUT LEAVING THE FLOW.

Paolo: "The game works as it did before ty make the combat as big as you can rn
its half the screen after ur ui menus eats it up"

He asked for this once before, I shipped v117, he got a black screen entering
from the home screen and told me to pull it. I pulled it whole. The cause turned
out to be a missing </div> another lane fixed in the same window -- but that does
not buy v117 a free pass, so this ships DIFFERENTLY and is verified DIFFERENTLY.

WHAT IS DIFFERENT THIS TIME
  1. NOTHING LEAVES THE LAYOUT FLOW. v117's first draft used position:fixed and
     collapsed the iframe to 0x0, because the parent panel is sized by its
     content and the content is this document. That draft never shipped, and the
     approach is banned here: this patch only makes the chrome SMALLER and lets
     #stage's existing flex:1 eat what frees up.
  2. NO DOM IS MOVED. v117 also relocated five controls into the settings panel
     at boot. That was the riskiest half and it is NOT in this patch. Every
     button stays exactly where it is; it just takes less room.
  3. VERIFIED THROUGH THE PATH HE ACTUALLY USES -- boot the alpha, sit through
     the front splash, open the tab from the tab bar -- with pageerror and
     console capture on, plus a measured panel size. Not a synthetic state poke.

WHERE THE SCREEN GOES. #wrap is a flex column: header, #chud, then #stage with
flex:1. Everything above the canvas takes its share first:
  a 44px logo canvas
  a comment box row
  the health bar row
  the enemy chip board
  the gap track
  thirteen buttons that WRAP onto three rows on a 430px phone
  four readout lines, each holding reserved empty height even when blank
MEASURED: that is roughly half his screen before a single pixel of fight.

WHAT THIS CHANGES, ALL OF IT CSS:
  the logo hides            -- a title-screen thing, never a HUD thing
  the button row scrolls sideways instead of wrapping onto extra rows
  the readout lines stop reserving height they are not using
  the enemy chip board collapses -- the field already shows you every body
  the gap track and the rows lose their padding
  #stage takes a hard 62vh floor so nothing added later can squeeze it back

WHAT IS DELIBERATELY UNTOUCHED: every control stays reachable and in the same
place. Nothing that resolves a turn moves, hides, or changes behaviour. If this
one goes wrong it goes wrong as LAYOUT, which is visible in one glance, instead
of as a missing button he finds mid-fight.

REUSE CHECK: cooks NO graphic pixels. It is CSS only -- no DOM, no JS, no
behaviour. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V119 GIVE THE FIELD THE SCREEN BACK'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v119 already in; nothing to do')
        return

    old = """#stage{flex:1;position:relative;min-height:0;}"""
    new = """#stage{flex:1;position:relative;min-height:0;}
  /* ===== V119 GIVE THE FIELD THE SCREEN BACK =======================
     Paolo: "make the combat as big as you can rn its half the screen after ur
     ui menus eats it up".
     #wrap is a flex column -- header, #chud, then #stage with flex:1 -- so the
     canvas gets whatever is left after a 44px logo, a comment row, the health
     bar, the enemy chip board, the gap track, THIRTEEN buttons wrapping onto
     three rows on a 430px phone, and four readout lines each holding reserved
     empty height even when blank. Measured: about half his screen before a
     single pixel of fight.

     NOTHING HERE LEAVES THE FLOW. An earlier draft used position:fixed and
     collapsed the whole iframe to 0x0, because the parent panel is sized by
     its content and the content is this document. That approach is banned in
     this file. The chrome only gets SMALLER; #stage's flex:1 eats the rest.
     AND NO DOM MOVES. This is CSS only -- every control stays exactly where it
     is and behaves exactly as it did. If this goes wrong it goes wrong as
     layout, visible in one glance, not as a button missing mid-fight. */
  #logo{display:none;}                    /* title-screen furniture, not a HUD */
  header{padding:2px 8px 0;}
  #topbar{margin:0 auto 2px;justify-content:flex-end;}
  #chud{gap:3px;margin:0 auto 4px;padding:0 6px;}
  #chud .hpbar{height:10px;}
  /* ONE LINE, NEVER THREE: the verbs scroll sideways instead of wrapping into
     extra rows that shove the picture down the screen. */
  #chud .crow{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
    scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  #chud .crow::-webkit-scrollbar{display:none;}
  #chud .crow>*{flex:0 0 auto;white-space:nowrap;}
  #chud .crow .hpbar{flex:1 1 auto;}
  /* the reads are a glance: no reserved empty height when they say nothing */
  #cread{font-size:11px;min-height:13px;line-height:1.2;}
  #patlbl2{min-height:0;line-height:1.2;}
  #rangeread{min-height:0;line-height:1.2;}
  #timing{min-height:0;line-height:1.2;}
  #gaptrack{margin:0;}
  /* the enemy chip board is a read the field already gives you, in full */
  #board{max-height:0;overflow:hidden;margin:0;}
  /* and the floor: the picture can never be squeezed back into a letterbox */
  #stage{min-height:62vh;}"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v119: the chrome shrinks, the field takes the rest (%d chars)' % len(s))


if __name__ == '__main__':
    main()
