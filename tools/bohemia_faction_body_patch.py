#!/usr/bin/env python3
"""BOHEMIA THE OUTFIT REACHES THE STREET (9/5/26, PEOPLE lane).
VAMILY [outfits nearby], row OUTFITS-AT-SPAWN, second half.

FACTION_LOOKS has held THIRTEEN canon faction outfits since 8/18 -- every
selectable faction, each one draft:true with a written reason, gated at thirteen
distinguishable silhouettes by gates/faction_outfit_gate.js -- AND NO BODY ON THE
WALKED STREET HAS EVER WORN ONE. The city cast bake sends six anonymous
townsfolk and nothing else, so a Cartel enforcer standing on Cartel ground is
dressed exactly like a scavenger two blocks away.

*** WHY IT IS LAZY, AND THE NUMBER IS MEASURED, NOT GUESSED. *** The obvious fix
is to bake the thirteen alongside the six. Timed on the real surface: bake56
costs 6.02ms, a look is 40 bakes (8 directions x 1 idle + 4 breath frames), so
the six cost 1,446ms of BLOCKING page today and nineteen would cost 4,579ms.
Four and a half seconds of frozen boot to dress people who, near the spawn, do
not exist: 0 of 61 within three neighbourhoods run with anybody.

SO A FACTION BODY IS BAKED THE FIRST TIME ONE IS ACTUALLY NEEDED. Walk onto
Cartel ground and the city asks for the Cartel, once; the alpha bakes that ONE
look (240ms) and posts it back; it is cached for the session. Where nobody is
affiliated nothing is baked and boot is exactly what it was.

AND IT NEVER LEAVES A HOLE. Until the body arrives the person wears the
trade-bound anonymous fit they already had, so the street never shows a gap and
the swap is the body getting MORE specific, never appearing from nothing.

  python3 tools/bohemia_faction_body_patch.py

Gate: gates/trade_fit_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__CITY_FACTIONBODY__'

# ---------------------------------------------------------------------------
# THE ALPHA: bake ONE faction look on request.
A_ANCHOR = """  if(d.type==='BOHEMIA_CITY_NEED_PLAYER'){ try{citySendCast();}catch(_e){} }"""
A_NEW = r"""  if(d.type==='BOHEMIA_CITY_NEED_PLAYER'){ try{citySendCast();}catch(_e){} }
  /* __CITY_FACTIONBODY__ (9/5, PEOPLE) -- ONE FACTION'S BODY, ON DEMAND.
     Baking all thirteen at boot costs a measured 4,579ms of frozen page against
     today's 1,446ms, to dress people who do not exist near the spawn. So the
     city asks for a faction the first time it actually has to draw one, and
     this bakes that one look and sends it back. */
  if(d.type==='BOHEMIA_CITY_NEED_FACTION'&&d.faction){
    try{ cityBakeFaction(String(d.faction)); }catch(_e){}
    return true;
  }"""

A_FN_ANCHOR = """/* ==== /CITY CAST ==== */"""
A_FN_NEW = r"""/* __CITY_FACTIONBODY__ -- BAKE ONE FACTION LOOK AND POST IT.
   Everything here is citySendCast's own machinery, asked for a single look:
   the same withLook borrow-and-give-back (these are GLOBALS -- leaving one
   installed silently reshapes every other surface in the game), the same
   bake56, the same 56px frames, the same four breath phases on the 120 BPM
   clock. Nothing about how a body is made is duplicated; only HOW MANY. */
const CFACT_SENT = {};
function cityBakeFaction(name){
  const fr=document.getElementById('cityFrame');
  if(!fr||!fr.contentWindow) return false;
  if(CFACT_SENT[name]) return true;              /* one bake per faction, ever */
  const src=(window.FACTION_LOOKS||[]).filter(f=>f.faction===name)[0];
  if(!src) return false;                          /* no outfit for them: stay anonymous */
  CFACT_SENT[name]=1;
  const L={id:'faction:'+name,dials:src.dials,worn:src.worn,age:src.age||'adult',dirs:{}};
  const PD_CLOTHES=['shirt','jacket','pants','shoes','hat','glasses','hair'];
  const kW=window.G_WORN, kD=G.bodyVar, kA=G.age, kE={};
  PD_CLOTHES.forEach(s=>{ if(s in G.equipped){ kE[s]=G.equipped[s]; G.equipped[s]=''; } });
  try{
    window.G_WORN=L.worn; G.bodyVar=L.dials; G.age=L.age;
    rebuildFromRig();
    for(const d of DIRS){
      L.dirs[d]={idle:bake56(d,'idle',0.25,true),
                 breathe:CAST_PHS.map(ph=>bake56(d,'idle',ph,true))};
    }
  }catch(_e){ CFACT_SENT[name]=null; return false; }
  finally{
    window.G_WORN=kW; G.bodyVar=kD; G.age=kA;
    for(const s in kE) G.equipped[s]=kE[s];
    try{ rebuildFromRig(); }catch(_e){}
    try{ HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); }catch(_e){}
  }
  try{ fr.contentWindow.postMessage(
    {type:'BOHEMIA_CITY_FACTION_CAST',w:56,h:56,packed:true,
     faction:name,dirs:L.dirs},'*'); }catch(_e){ return false; }
  return true;
}
/* ==== /CITY CAST ==== */"""

# ---------------------------------------------------------------------------
# THE CITY: ask once, receive, and prefer the outfit over the trade fit.
C_STORE_ANCHOR = """var CAST_ID = null;"""
C_STORE_NEW = r"""var CAST_ID = null;
/* ==== __CITY_FACTIONBODY__ : THE OUTFIT REACHES THE STREET ================
   FACTION_LOOKS has carried thirteen canon outfits since 8/18 and no body on
   this street has ever worn one. They arrive one at a time, the first time
   somebody who runs with that outfit has to be drawn -- baking all thirteen at
   boot is a measured 4,579ms of frozen page to dress people who, near the
   spawn, do not exist (0 of 61 affiliated).
   ASKED ONCE PER FACTION, EVER. A render runs sixty times a second and every
   one of them would otherwise post another request for the same body. */
var CAST_FID = {}, CAST_FID_ASKED = {};
function ctNeedFaction(name){
  if(!name || CAST_FID[name] || CAST_FID_ASKED[name]) return false;
  CAST_FID_ASKED[name] = 1;
  try{ if(window.parent && window.parent !== window)
    window.parent.postMessage({type:'BOHEMIA_CITY_NEED_FACTION',faction:String(name)},'*'); }
  catch(_e){ return false; }
  return true;
}
window.addEventListener('message',function(ev){
  var m=ev&&ev.data;
  if(!m||m.type!=='BOHEMIA_CITY_FACTION_CAST'||!m.faction||!m.dirs) return;
  var set={};
  for(var d in m.dirs){
    var f=decodePlayerFrame(m.dirs[d].idle);
    if(!f) continue;
    set[d]={idle:f};
    var br=(m.dirs[d].breathe||[]).map(decodePlayerFrame).filter(Boolean);
    if(br.length) set[d].breathe=br;
  }
  if(Object.keys(set).length){ CAST_FID[m.faction]=set; if(MODE==='human')render(); }
});"""

C_BODY_OLD = """function ctBody(p,dir){
  if(!CAST_CV||!CAST_CV.length) return null;
  var set=CAST_CV[ctFitIndex(p)];"""
C_BODY_NEW = r"""function ctBody(p,dir){
  if(!CAST_CV||!CAST_CV.length) return null;
  /* __CITY_FACTIONBODY__ -- WHO YOU RUN WITH BEATS WHAT YOU DO. An outfit is a
     stronger fact about somebody than their trade: it is the thing they chose
     and the thing that gets them killed. Their trade is what they wear until
     they have one.
     NO HOLE WHILE IT BAKES. The request goes out and this frame keeps drawing
     the trade fit, so the swap is a body getting MORE specific, never a person
     appearing out of nothing. */
  var set=null;
  try{
    var fid=ctFactionOf(p);
    if(fid){ set=CAST_FID[fid]||null; if(!set) ctNeedFaction(fid); }
  }catch(_e){}
  if(!set) set=CAST_CV[ctFitIndex(p)];"""

STEPS_ALPHA = [
    ('the faction bake request', A_ANCHOR, A_NEW),
    ('the faction bake', A_FN_ANCHOR, A_FN_NEW),
]
STEPS_CITY = [
    ('the faction body store', C_STORE_ANCHOR, C_STORE_NEW),
    ('the outfit beating the trade fit', C_BODY_OLD, C_BODY_NEW),
]


def apply(fname, steps):
    html = open(fname, encoding='utf-8').read()
    if MARK in html:
        return html, False
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), fname))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    return html, True


def main():
    a, ta = apply(ALPHA, STEPS_ALPHA)
    c, tc = apply(CITY, STEPS_CITY)
    if not ta and not tc:
        print('  already applied  ' + ALPHA + ' + ' + CITY)
        return
    if ta:
        open(ALPHA, 'w', encoding='utf-8').write(a)
    if tc:
        open(CITY, 'w', encoding='utf-8').write(c)
    print('  patched  the outfit reaches the street  [' +
          ('alpha ' if ta else '') + ('city' if tc else '') + ']')


if __name__ == '__main__':
    main()
