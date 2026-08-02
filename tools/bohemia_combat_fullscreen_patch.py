#!/usr/bin/env python3
"""V117 THE FIELD IS THE SCREEN.

Paolo: "Can you try to make the combat gameplay as full screen as realistic we
can and anything that is already in the menu or whatever is like a Settings
button pretty please"

WHERE IT WAS. #wrap is a flex COLUMN -- header, then #chud, then #stage with
flex:1. So the canvas got whatever was left after a logo, a comment box, a
health bar, an enemy board, a gap track, THIRTEEN buttons and four readout
lines had taken their share. Measured on his 430x900 phone the field was under
half the screen and the fight was happening in a letterbox.

THE FIRST ATTEMPT TOOK THE CHROME OUT OF FLOW and killed the tab. The parent
panel is sized by its content and the content is this document, so making the
header, the HUD and the stage position:fixed collapsed the iframe to nothing.
MEASURED: panel 430x846 before, 0x0 after. The runtime smoke gate built two
turns ago caught it before it reached him, which is exactly what it is for.

SO NOTHING LEAVES THE FLOW. The chrome gets SMALL and #stage's flex:1 eats
every pixel that frees up -- same win, no collapse:
  the logo is gone (a title-screen thing, never a HUD thing)
  the verb row scrolls SIDEWAYS instead of wrapping into a second and third
    row that shove the picture down
  the four readout lines lose their reserved empty height
  the enemy chip board collapses -- it is a read the field already gives you
  and #stage gets a hard floor of 64vh so the picture can never be squeezed
    back into a letterbox by anything added later

AND "ANYTHING THAT IS LIKE A SETTINGS BUTTON" GOES BEHIND THE GEAR, which is
the second half of his sentence and the half that actually buys the space:

  the live comment box + COPY   -- a verdict tool, not a fight control
  NEW ENCOUNTER                 -- you press it between fights, not during
  ARENA (re-roll)               -- same
  PATTERN: AUTO (the test lock) -- a debugging clamp, never a move
  WAGER                         -- set BEFORE the fight, never mid-turn

Those five were eating a third of the chrome and not one of them is a thing
you do while somebody is shooting at you. They move into a new DEMO TOOLS
group in the settings panel, NODE AND ALL, so every listener already attached
to them survives the move untouched.

WHAT DELIBERATELY DOES NOT MOVE: nothing that resolves a turn. If it changes
what happens on the beat it stays on the glass, because burying a move behind
a menu on a phone is worse than a small screen.

REUSE CHECK: cooks NO graphic pixels. It is CSS layout plus a boot-time
appendChild. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V117 THE FIELD IS THE SCREEN'


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
        print('v117 already in; nothing to do')
        return

    # ---- 1. the CSS: full bleed stage, floating chrome ------------------
    old = """#stage{flex:1;position:relative;min-height:0;}"""
    new = """#stage{flex:1;position:relative;min-height:0;}
  /* ===== V117 THE FIELD IS THE SCREEN ==============================
     Paolo: "make the combat gameplay as full screen as realistic we can".
     #wrap is a flex COLUMN -- header, #chud, then #stage with flex:1 -- so
     the canvas got whatever was left after a logo, a comment box, a health
     bar, a board, a gap track, THIRTEEN buttons and four readout lines had
     taken their share. On his 430x900 phone the fight ran in a letterbox.

     THE FIRST ATTEMPT TOOK THE CHROME OUT OF FLOW (position:fixed) AND
     KILLED THE TAB. The parent panel is sized by its content and the
     content is this document, so removing everything from flow collapsed
     the iframe to 0x0 -- MEASURED, panel 430x846 before, 0x0 after. The
     smoke gate caught it before it shipped.
     SO NOTHING LEAVES THE FLOW. The chrome just gets SMALL, and #stage's
     flex:1 eats every pixel that frees up. Same win, no collapse. */
  #logo{display:none;}                 /* a title-screen thing, not a HUD thing */
  header{padding:2px 8px 0;}
  #topbar{margin:0 auto 2px;justify-content:flex-end;}
  #chud{gap:3px;margin:0 auto 4px;max-width:none;padding:0 6px;}
  #chud .hpbar{height:10px;}
  /* ONE LINE, NEVER TWO: the verbs scroll sideways instead of wrapping into
     a second and third row that shove the picture down the screen. */
  #chud .crow{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
    scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  #chud .crow::-webkit-scrollbar{display:none;}
  #chud .crow>*{flex:0 0 auto;white-space:nowrap;}
  #chud .crow .hpbar{flex:1 1 auto;}
  /* the reads are a glance, not a panel */
  #cread{font-size:11px;min-height:13px;line-height:1.2;}
  #patlbl2{min-height:0;}
  #rangeread{min-height:0;line-height:1.2;}
  #timing{min-height:0;line-height:1.2;}
  #gaptrack{margin:0;}
  /* the enemy chip board is a read the field already gives you */
  #board{max-height:0;overflow:hidden;margin:0;}
  /* and the floor of it all: the picture never gets less than this */
  #stage{min-height:64vh;}"""
    s = subN(s, old, new)

    # ---- 2. the verbs get their own bottom rail, and the menu-ish things
    #         go behind the gear, NODE AND ALL so listeners survive.
    old = """  const sb2=D('stairbtn'); if(sb2)sb2.addEventListener('click',()=>doStairs());"""
    new = """  /* ===== V117 THE FIELD IS THE SCREEN: rehome the chrome =============
     The second half of his sentence -- "anything that is already in the menu
     or whatever is like a Settings button" -- is the half that actually buys
     the space. Five controls were eating a third of the HUD and not one of
     them is something you do while somebody is shooting at you:
       the live comment box + COPY  a verdict tool, not a fight control
       NEW ENCOUNTER                you press it BETWEEN fights
       ARENA (re-roll)              same
       PATTERN: AUTO                a debugging clamp, never a move
       WAGER                        set BEFORE the fight, never mid-turn
     They MOVE, node and all, so every listener already bound to them comes
     with them untouched.
     NOTHING THAT RESOLVES A TURN MOVES. If it changes what happens on the
     beat it stays on the glass, because burying a move behind a menu on a
     phone is worse than a small screen. */
  (function v117(){
    try{
      const chud=D('chud'); if(!chud)return;
      const panel=document.querySelector('#settings .setpanel');
      if(panel){
        const grp=document.createElement('div'); grp.className='setgrp';
        const gl=document.createElement('span'); gl.className='gl';
        gl.textContent='DEMO TOOLS'; grp.appendChild(gl);
        const ctl=document.createElement('div'); ctl.className='controls';
        grp.appendChild(ctl);
        for(const id of ['livecomment','newenc','arenabtn','patsel','wagerbtn']){
          const el=D(id); if(el)ctl.appendChild(el); }
        const h2=panel.querySelector('h2');
        if(h2&&h2.nextSibling)panel.insertBefore(grp,h2.nextSibling);
        else panel.appendChild(grp);
      }
    }catch(_e){}
  })();
  const sb2=D('stairbtn'); if(sb2)sb2.addEventListener('click',()=>doStairs());"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v117: the field is the screen, the chrome floats (%d chars)' % len(s))


if __name__ == '__main__':
    main()
