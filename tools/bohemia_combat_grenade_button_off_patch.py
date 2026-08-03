#!/usr/bin/env python3
"""V124 THE TOP-ROW GRENADE COMES OFF. THAT IS ALL THIS DOES.

Paolo 8/3: "bro i needed you to get rid of the grenade button too bro wtf".

v122 put GREN in the thumb cluster and KEPT the top-row GRENADE, and my written
reason was "for a desktop cursor". He never asked for that. He asked for the
verbs to come off the top menu. GRENADE is a verb. It is off, on every device,
and the thumb button carries the count and the armed state the top one used to.

THE GRENADE MINIGAME IS NOT IN THIS PATCH AND IT IS NOT IN THE BUILD.
The first attempt (THE COOK, a fuse bar with three bands) was REJECTED on sight:
"bro what fucking minigame was that im so confused? like wtf. the deadshot dial
is a minigame. that grenade throwing was dogshit."
HE IS RIGHT AND THE POST-MORTEM IS IN THE GRAVEYARD. A bar that fills while you
hold, with a green stripe in the middle, is a QUICKTIME EVENT. The dead-shot
dial is a MINIGAME: it has a shape you read, a needle on a track, patterns that
change from fight to fight, and a window you learn. I built the most generic
interaction in games and filed it under the same word.
Nothing replaces it in this patch. The next attempt does not get authored until
he says what the grenade minigame IS, because picking that myself is exactly the
mistake that produced the first one.

REUSE CHECK: cooks NO graphic pixels. It deletes one button and null-guards its
listener. No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste question it answers is the interface one
and it is his standing complaint honoured rather than dodged -- a verb lives in
ONE place, and that place is where his thumb already is. It adds nothing, it
only removes.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V124: the top-row GRENADE is OFF the menu'


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
        print('v124 already in; nothing to do')
        return

    # ---- 1. THE TOP-ROW GRENADE COMES OFF -------------------------------
    old = """    <button id="grenbtn" class="cbtn" style="border-color:#c8a23a;color:#e8c88a" title="throw it on your target's tile. it ends your turn, and they get the same two beats you do">GRENADE</button>
"""
    new = """    <!-- V124: the top-row GRENADE is OFF the menu (Paolo 8/3: "bro i needed
         you to get rid of the grenade button too bro wtf"). v122 kept it "for a
         desktop cursor", which was me inventing a requirement he never gave. He
         asked for the verbs to come off the top menu; GRENADE is a verb; the
         thumb button is the grenade now, on every device. -->
"""
    s = subN(s, old, new)

    old = """D('grenbtn').addEventListener('click',()=>{ audio(); doThrow(); });"""
    new = """{const _gb=D('grenbtn'); if(_gb)_gb.addEventListener('click',()=>{ audio(); doThrow(); });}   /* V124: the top-row button is gone; the wire is null-safe and grenbtn2 on the thumb calls the same doThrow */"""
    s = subN(s, old, new)

    # updGrenBtn drives the old button; point it at the thumb one too
    old = """  b.textContent=G.grenArm?'TAP A TILE':('GRENADE '+n);
  b.disabled=!canThrow()&&!G.grenArm;
  b.style.borderColor=G.grenArm?'#e8593a':'#c8a23a';
  b.style.opacity=(canThrow()||G.grenArm)?'1':'0.45'; }"""
    new = """  b.textContent=G.grenArm?'TAP A TILE':('GRENADE '+n);
  b.disabled=!canThrow()&&!G.grenArm;
  b.style.borderColor=G.grenArm?'#e8593a':'#c8a23a';
  b.style.opacity=(canThrow()||G.grenArm)?'1':'0.45'; }
/* V124: the thumb grenade is the only grenade button now, so it carries the
   count and the armed state the top-row one used to. Same information, in the
   corner his hand is already in. */
function updGrenThumb(){ const b=D('grenbtn2'); if(!b)return;
  const n=(G.pGrenLeft||0);
  b.textContent=G.grenArm?'TILE':('GREN '+n);
  b.style.borderColor=G.grenArm?'#e8593a':'#3a3226';
  b.style.color=G.grenArm?'#ffd9b0':'#c8a23a';
  b.style.opacity=(canThrow()||G.grenArm)?'1':'0.45'; }"""
    s = subN(s, old, new)

    old = """function updGrenBtn(){ const b=D('grenbtn'); if(!b)return;"""
    new = """function updGrenBtn(){ try{updGrenThumb();}catch(_e){} const b=D('grenbtn'); if(!b)return;"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v124: the top-row grenade is off the menu (%d chars)' % len(s))


if __name__ == '__main__':
    main()
