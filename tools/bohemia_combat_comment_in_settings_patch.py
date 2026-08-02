#!/usr/bin/env python3
"""V120 THE COMMENT BOX MOVES INTO SETTINGS, AND THE DRAFT STOPS EVAPORATING.

Paolo: "I just put the comment box on the top of the Settings menu and then just
make sure as I'm clicking it out of the settings the comment doesn't go away
until I guess I reopened the alpha or something."

TWO THINGS.

1. IT GOES TO THE TOP OF SETTINGS. It moves NODE AND ALL -- the row, the input
   and the COPY button together -- so every listener already bound to them comes
   with them and nothing is re-wired. It is inserted directly after the panel's
   h2, which is the top, which is where he said to put it. That frees the whole
   comment row off the fight screen, which is the last big block of chrome above
   the field.

2. THE DRAFT SURVIVES CLOSING THE PANEL. His words: it should not go away "until
   I reopened the alpha". So the text you have typed but not yet copied is
   stashed on every keystroke and restored whenever the panel opens. It lives as
   long as the page does and dies with a reload, which is exactly the lifetime he
   described.
   WHAT IS NOT TOUCHED: pressing COPY still folds the text into the export and
   clears the box, because that is the box doing its job -- he asked for the
   draft to survive being INTERRUPTED, not for the saved note to linger.

WHY THIS ONE IS SAFE WHERE v117'S DOM MOVE WAS NOT: v117 moved five controls at
once, including a <select> and two buttons that resolve turns, and it did it
alongside a layout change that had already collapsed the iframe once. This moves
ONE row that does nothing during a fight, changes no layout, and is the thing he
explicitly asked for. If it goes wrong, the comment box is in the wrong place --
it cannot take the fight with it.

REUSE CHECK: cooks NO graphic pixels. It relocates one DOM node and stashes a
string. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V120 THE COMMENT BOX LIVES IN SETTINGS'


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
        print('v120 already in; nothing to do')
        return

    old = """D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); D('lccopy').click(); } });"""
    new = """/* ===== V120 THE COMMENT BOX LIVES IN SETTINGS =====================
   Paolo: "I just put the comment box on the top of the Settings menu and then
   just make sure as I'm clicking it out of the settings the comment doesn't go
   away until I guess I reopened the alpha or something."
   It moves NODE AND ALL -- row, input and COPY together -- straight after the
   panel's h2, which is the top, which is where he said to put it. Every
   listener already bound to them comes with them; nothing is re-wired.
   AND THE DRAFT SURVIVES. Text typed but not yet copied is stashed on every
   keystroke and put back whenever the panel opens, so it lives as long as the
   page does and dies with a reload -- exactly the lifetime he described.
   COPY still folds the text into the export and clears the box, because that
   is the box doing its job: he asked for the draft to survive being
   INTERRUPTED, not for a saved note to linger. */
(function v120(){
  try{
    const row=D('livecomment'), panel=document.querySelector('#settings .setpanel');
    if(row&&panel){ const h2=panel.querySelector('h2');
      /* h2.after() puts it DIRECTLY under the title. insertBefore(h2.nextSibling)
         lands it after a whitespace TEXT node instead, which measured as "in
         settings but not the first thing you see" -- and the top is where he
         said to put it. */
      /* MEASURED: doing this inline landed it FOURTH in the panel -- something
         else re-homes it after us. Running on the next tick makes our
         placement the last word, which is the only way to actually be at
         the top. */
      const pin=()=>{ try{ const h=panel.querySelector('h2');
        if(h&&h.after)h.after(row); else panel.insertBefore(row,panel.firstChild);
        row.style.margin='0 0 10px'; }catch(_e){} };
      pin(); setTimeout(pin,0); setTimeout(pin,250);
      const g0=D('gear'); if(g0)g0.addEventListener('click',()=>setTimeout(pin,0)); }
    const inp=D('lcinput');
    if(inp){
      inp.addEventListener('input',()=>{ G._draftComment=inp.value; });
      /* put the draft back whenever the panel becomes visible again */
      const put=()=>{ try{ if(!inp.value&&G._draftComment)inp.value=G._draftComment; }catch(_e){} };
      const g=D('gear'); if(g)g.addEventListener('click',()=>setTimeout(put,0));
      const st=D('settings');
      if(st&&window.MutationObserver){
        new MutationObserver(()=>{ if(!st.classList.contains('hidden'))put(); })
          .observe(st,{attributes:true,attributeFilter:['class']}); }
    }
  }catch(_e){}
})();
D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); D('lccopy').click(); } });"""
    s = subN(s, old, new)

    # COPY clears the box: clear the stash with it, or it would resurrect
    old = """  inp.value=''; setRead('COMMENT ADDED','saved — rides the export','#8fd0e8'); }"""
    new = """  inp.value=''; try{G._draftComment='';}catch(_e){}   /* V120: the note is SAVED, so the draft is spent -- otherwise it would come straight back next time the panel opened */
  setRead('COMMENT ADDED','saved — rides the export','#8fd0e8'); }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v120: comment box at the top of settings, draft persists (%d chars)' % len(s))


if __name__ == '__main__':
    main()
