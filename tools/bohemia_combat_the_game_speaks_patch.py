#!/usr/bin/env python3
"""V133 THE GAME HAS BEEN TELLING HIM NOTHING, AND IT SAYS SO IN ITS OWN CODE.

Paolo 8/8: "No minigame plays when i click grenade bro"

TWO SEPARATE TRUTHS AND ONLY ONE OF THEM IS A BUG.

--------------------------------------------------------------------------
1. THERE IS NO GRENADE MINIGAME, AND THAT IS BY HIS OWN KILL
--------------------------------------------------------------------------
THE COOK was the only one ever built and he killed it on sight ("that grenade
throwing was dogshit"). It is graveyarded with a post-mortem and a standing ban
on rebuilding a variation. I asked what shape the next one should be and have
had no answer, so nothing has been built. NOTHING IS BUILT HERE EITHER. Guessing
at that shape a second time is exactly what earned the first rejection.

--------------------------------------------------------------------------
2. BUT THE GRENADE LOOKED BROKEN, AND THAT IS A REAL BUG THAT IS MINE
--------------------------------------------------------------------------
Tapping GREN calls:

    setRead('TAP WHERE IT LANDS','any tile -- short throws catch YOU too',...)

MEASURED on the live build: the read comes back EMPTY and NOT VISIBLE. So he
taps GREN, the button label changes to TILE, and NOTHING TELLS HIM TO TAP A
TILE. From outside it is indistinguishable from a dead button. He reported it as
"no minigame plays" because as far as the screen is concerned, nothing happened.

AND THE CAUSE IS NOT SUBTLE. It is written in the file, by an earlier version of
me, as a known defect nobody ever came back for:

    /* V32 THE SILENT READOUT: #cread was retired and never replaced --
       every message since has written to memory and shown NOBODY anything */

setRead() HIDES the element and pushes to a 6-entry array. So EVERY instruction
in the fight is invisible and always has been: TAP WHERE IT LANDS, RUN ARMED,
NO STAMINA, BLOCKED, THE EDGE, ALREADY ON IT, SOMEBODY IS THERE, TARGET, MISS,
GRIT. Dozens of call sites, all shouting into a log.
THAT IS NOT A GRENADE BUG. It is the whole game not speaking, and it explains a
long trail of "I'm so confused" and "what's up with that" that I have been
answering one symptom at a time.

--------------------------------------------------------------------------
WHY IT COMES BACK AS A TRANSIENT ON THE FIELD, NOT AS A HUD LINE
--------------------------------------------------------------------------
#cread was retired for a reason worth respecting: it was permanent chrome in the
HUD stack, and this lane has spent the week REMOVING things from that stack at
his repeated instruction (the logo, the chip board, DASH, VAULT, SPRINT, the
top-row GRENADE, the STA pips). Putting a permanent text line back would undo
that.
So the read returns as a TRANSIENT, on the field, above his thumb, in exactly
the pattern the file already uses for #movemode: display:none until something is
said, then visible for two beats and gone. It costs ZERO screen height in every
frame where the game has nothing to say, which is the same rule the fuse bar
followed and the same rule that took five buttons off the menu.
ON THE BEAT: it holds for two beats (BPM_MS*2) because everything in this fight
is quantised and a message that outstays the grid is noise.

REUSE CHECK: cooks NO graphic pixels. It reuses the #movemode pattern already in
the file for its positioning and lifecycle, and the palette is the colour each
setRead call site already passes. No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste rule is the one this lane has been
enforcing all week and it cuts BOTH ways: NO PERMANENT CHROME FOR A THING YOU
ARE NOT DOING -- but a verb that gives no feedback at all is not clean, it is
broken. The answer is transient, not absent. It is dark-plate + one warm line so
it reads over any arena without a box, and it never occupies height when silent.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V133 THE GAME SPEAKS AGAIN'


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
        print('v133 already in; nothing to do')
        return

    old = """function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now()}; const r=D('cread'); if(r&&r.style.display!=='none')r.style.display='none';"""
    new = """/* ===== V133 THE GAME SPEAKS AGAIN ================================
   Paolo: "No minigame plays when i click grenade bro". Two truths there and
   only one is a bug. There IS no grenade minigame -- he killed THE COOK on
   sight and nothing has been built since, deliberately. BUT THE GRENADE ALSO
   LOOKED BROKEN, and that part is mine: tapping GREN calls setRead('TAP WHERE
   IT LANDS'...) and MEASURED on the live build that read came back EMPTY AND
   INVISIBLE. The button label changed to TILE and nothing told him to tap a
   tile, which from outside is indistinguishable from a dead button.
   THE CAUSE WAS WRITTEN RIGHT HERE, BY AN EARLIER ME, AS A KNOWN DEFECT NOBODY
   CAME BACK FOR: "#cread was retired and never replaced -- every message since
   has written to memory and shown NOBODY anything." So EVERY instruction in the
   fight has been invisible: TAP WHERE IT LANDS, RUN ARMED, NO STAMINA, BLOCKED,
   THE EDGE, ALREADY ON IT, SOMEBODY IS THERE, MISS, GRIT. Dozens of call sites
   shouting into a 6-entry array. That is not a grenade bug, it is the whole
   game not speaking, and it explains a long trail of "I'm so confused".
   IT COMES BACK AS A TRANSIENT, NOT AS A HUD LINE. #cread was retired for a
   reason worth respecting -- it was permanent chrome in a stack this lane has
   spent the week emptying at his instruction. So this lives on the FIELD above
   his thumb, in the exact pattern #movemode already uses: nothing at all until
   something is said, then two beats and gone. Zero height when silent, which is
   the same rule that took five buttons off the menu. */
function _speak(t,sub,col){
  try{
    let e=D('saytxt');
    if(!e){ e=document.createElement('div'); e.id='saytxt';
      e.style.cssText='position:fixed;left:8px;right:8px;bottom:214px;z-index:62;'+
        'pointer-events:none;text-align:center;display:none;'+
        "font-family:'Space Grotesk',sans-serif;text-shadow:0 1px 6px #000,0 0 12px #000;";
      document.body.appendChild(e); }
    e.innerHTML='<div style="font:bold 13px Space Grotesk,sans-serif;letter-spacing:2px;color:'+(col||'#e8ddc8')+'">'+
      String(t||'').replace(/</g,'&lt;')+'</div>'+
      (sub?'<div style="font:11px Space Grotesk,sans-serif;color:#9c8f76;margin-top:1px">'+String(sub).replace(/</g,'&lt;')+'</div>':'');
    e.style.display='block'; e.style.opacity='1';
    if(G._sayT)clearTimeout(G._sayT);
    if(G._sayF)clearTimeout(G._sayF);
    /* TWO BEATS, because everything in this fight is quantised and a message
       that outstays the grid is noise. */
    G._sayF=setTimeout(()=>{ try{e.style.transition='opacity 180ms';e.style.opacity='0';}catch(_e){} },BPM_MS*2);
    G._sayT=setTimeout(()=>{ try{e.style.display='none';e.style.transition='';}catch(_e){} },BPM_MS*2+200);
  }catch(_e){}
}
function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now()}; _speak(t,s,col); const r=D('cread'); if(r&&r.style.display!=='none')r.style.display='none';"""
    s = subN(s, old, new)

    # a reset must not leave a stale line on screen
    old = """  G._missHold=0;   /* V127: a camera hold never survives a reset */"""
    new = """  G._missHold=0;   /* V127: a camera hold never survives a reset */
  /* V133: and neither does a spoken line */
  try{ if(G._sayT)clearTimeout(G._sayT); if(G._sayF)clearTimeout(G._sayF);
       const _sy=D('saytxt'); if(_sy)_sy.style.display='none'; }catch(_e){}"""
    if old in s:
        s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v133: every instruction in the fight is visible again (%d chars)' % len(s))


if __name__ == '__main__':
    main()
