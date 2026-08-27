#!/usr/bin/env python3
"""
V188 THE TREE -- his 8/26 ruling, and the spine that connects five days of work.

  PAOLO 8/26: "BRO THERE ARE NO RUNS. IT IS A FULL GAME THAT WILL TAKE YOU 100
  HOURS TO COMPLETE BRO. LEVELING UP LEVELS AND GIVES YOU EXPERIENCE FOR
  EXPERIENCE TREE CYBER PUNK ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND
  IN HAND WITH ABILITIES AND THE 60 MINI BOSSES IN THE GAME THAT GIVE YOU A NEW
  WAY TO INTERACT WITH BOHEMIA BRO!"

*** THIS IS THE PIECE EVERYTHING ELSE HAS BEEN WAITING FOR, AND THE SOCKETS WERE
ALREADY CUT. *** Five days of combat work all terminate here and none of them
could finish:

  V181 put EXPERIENCE on the bodies and it went into a ledger NOTHING READ.
  V183 gated the whole nerve system behind `G.perks.fear`, and wrote in its own
       comment that "nothing turns it on, which is exactly what he asked for" --
       a switch with no hand on it.
  V182/V184 gave you Power, plates and legs, all fixed forever at their start
       value, because there was no way to earn a better one.
  V185's kit charges at a rate nobody could ever change.

A tree is not a menu bolted on top of that. IT IS THE THING THOSE FIVE WERE
BUILT AGAINST, and the proof is that seven of the nine perks below need no new
mechanic at all -- they move a number a shipped system already reads.

-------------------------------------------------------------------------
NO RUNS MEANS IT PERSISTS, AND THAT IS THE WHOLE DIFFERENCE
-------------------------------------------------------------------------
His 8/26 law killed the run. So the tree is NOT per-fight and NOT per-session: it
is written to storage and read back on load, and a fight begins by APPLYING what
you have already earned. One character, a hundred hours.
Storage is wrapped in try/catch and falls back to memory, because a srcdoc frame
can be handed an opaque origin and a tree that THROWS is worse than one that
forgets.

-------------------------------------------------------------------------
NINE PERKS, THREE BRANCHES, AND NOT ONE OF THEM TOUCHES DAMAGE
-------------------------------------------------------------------------
  BODY   PLATE CARRIER   walk in wearing two
         SECOND SKIN     carry four instead of three
         WALK IT OFF     a plate back at the top of every fight
  EYE    THEY KNOW YOU   *** men break and run from you now ***  (V183's socket)
         STEADY EYE      +1 Power: every gun's window, never its damage
         QUICK STUDY     the kit charges one verb sooner
  HAND   LONG WIND       a fourth speed pip
         CLOSER          the finisher lands at three instead of four
         OPENING MOVE    one ability already charged when the bell goes

THEY KNOW YOU IS THE FLAGSHIP AND IT IS HIS OWN SENTENCE MADE MECHANICAL. He said
"I don't wanna see anyone run away... unless I have a perk that allows them to.
YOU'RE NOT SCARY ENOUGH." V183 built the off switch and named the perk that would
one day flip it. This is that perk. Nothing else in the tree changes how a fight
READS as much as men deciding you are worth running from.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour number moves.
Every perk moves a RESOURCE, a WINDOW, a COUNT or a SWITCH.

MECHANISM MINE, CONTENTS HIS: the tree, the curve and the effects are mechanism.
The NAMES and the lines are WORDS, so they ship as a real attempt tagged
draft:true -- nine written perks he can rewrite, not nine blanks.

REUSE CHECK: cooks no graphic pixels, opens no bank. Every perk drives a system
already shipped: G.power (V182), the plate count (V184), the kit's need (V185),
the speed pips (V163), the finisher threshold (V176/V178) and V183's fear switch.
Two const reads became variables so a perk could reach them; nothing was rebuilt.

TASTE CHECK: one button, and it only appears when you have a point to spend. No
permanent furniture, same rule as the kit row.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V188 THE TREE'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v188: already applied')
        return

    # ---- 1. TUNABLES A PERK CAN REACH ----
    d = sub(d,
        "function finisherReady(){ return (G._finCharge||0)>=FINISH_AT; }",
        "function finishAt(){ return Math.max(1,FINISH_AT-(G.perkFinish||0)); }   /* V188: CLOSER lowers it */\n"
        "function finisherReady(){ return (G._finCharge||0)>=Math.max(1,FINISH_AT-(G.perkFinish||0)); }",
        what='finishAt')

    d = sub(d,
        "function kitReady(id){ const k=kitDef(id); if(!k)return false;\n  return ((G.kit&&G.kit[id])||0)>=k.need; }",
        "function kitNeed(k){ return Math.max(1,k.need-(G.perkKit||0)); }   /* V188: QUICK STUDY */\n"
        "function kitReady(id){ const k=kitDef(id); if(!k)return false;\n  return ((G.kit&&G.kit[id])||0)>=Math.max(1,k.need-(G.perkKit||0)); }",
        what='kitNeed')

    d = sub(d,
        "    if(was>=k.need)continue;\n    G.kit[k.id]=was+1;\n    if(G.kit[k.id]>=k.need)",
        "    if(was>=Math.max(1,k.need-(G.perkKit||0)))continue;\n    G.kit[k.id]=was+1;\n    if(G.kit[k.id]>=Math.max(1,k.need-(G.perkKit||0)))",
        what='kitVerb need')

    d = sub(d,
        "function ppCap(){ return PP_MAX; }" if "function ppCap()" in d else
        "      if(d.plate && (G.pp||0)<PP_MAX){ G.pp=(G.pp||0)+1; gotPlate++; }",
        "      if(d.plate && (G.pp||0)<(PP_MAX+(G.perkCarry||0))){ G.pp=(G.pp||0)+1; gotPlate++; }",
        what='plate cap at pickup')

    d = sub(d,
        "    G.pp=Math.min(PP_MAX,(G.pp||0)+1); try{updPP();}catch(_e){}",
        "    G.pp=Math.min(PP_MAX+(G.perkCarry||0),(G.pp||0)+1); try{updPP();}catch(_e){}",
        what='plate cap in the kit')

    # ---- 2. THE TREE ----
    d = sub(d,
        "const PLATE_START=1;  /* [DIAL] what you walk in with */",
        """const PLATE_START=1;  /* [DIAL] what you walk in with */
/* ===== V188 THE TREE ==============================================
   Paolo 8/26: "THERE ARE NO RUNS. IT IS A FULL GAME THAT WILL TAKE YOU 100 HOURS
   TO COMPLETE... LEVELING UP GIVES YOU EXPERIENCE FOR EXPERIENCE TREE CYBER PUNK
   ELDERSCROLL PERK AND BONUS SHIT. WILL ALSO GO HAND IN HAND WITH ABILITIES AND
   THE 60 MINI BOSSES."
   *** THE SOCKETS WERE ALREADY CUT AND NONE OF THEM HAD A HAND ON THEM. *** V181
   put experience on the bodies and it went into a ledger nothing read. V183 gated
   the entire nerve system behind G.perks.fear and wrote in its own comment that
   nothing turns it on. V182 and V184 gave you Power and plates fixed forever at
   their start value. V185's kit charged at a rate nobody could change.
   A TREE IS NOT A MENU BOLTED ON TOP OF THAT -- it is the thing those five were
   built against, and the proof is that seven of these nine perks need no new
   mechanic at all. They move a number a shipped system already reads.
   NO RUNS MEANS IT PERSISTS: written to storage, read back on load, applied at
   the top of every fight. Wrapped in try/catch and falling back to memory,
   because a srcdoc frame can be handed an opaque origin and a tree that THROWS is
   worse than one that forgets.
   [draft:true] on every name and line: what a perk is CALLED is his. */
const XP_PER_LEVEL=120;   /* [DIAL] a body is worth about 15, so a level is roughly eight of them */
const PERKS=[
  {id:'carrier', br:'BODY', n:'PLATE CARRIER', draft:true, lvl:1,
   says:'you walk in wearing two', apply:()=>{ G.pp=(G.pp||0)+1; }},
  {id:'skin',    br:'BODY', n:'SECOND SKIN',   draft:true, lvl:2,
   says:'room for four on you instead of three', apply:()=>{ G.perkCarry=(G.perkCarry||0)+1; }},
  {id:'walkoff', br:'BODY', n:'WALK IT OFF',   draft:true, lvl:3,
   says:'one back at the top of every fight', apply:()=>{ G.pp=(G.pp||0)+1; }},
  {id:'fear',    br:'EYE',  n:'THEY KNOW YOU', draft:true, lvl:2,
   says:'men break and run from you now', apply:()=>{ G.perks=G.perks||{}; G.perks.fear=true; }},
  {id:'eye',     br:'EYE',  n:'STEADY EYE',    draft:true, lvl:1,
   says:'every gun sits a little easier', apply:()=>{ G.power=(G.power||0)+1; }},
  {id:'study',   br:'EYE',  n:'QUICK STUDY',   draft:true, lvl:3,
   says:'the kit comes up one sooner', apply:()=>{ G.perkKit=(G.perkKit||0)+1; }},
  {id:'wind',    br:'HAND', n:'LONG WIND',     draft:true, lvl:1,
   says:'a fourth pip in your legs', apply:()=>{ G.perkLegs=(G.perkLegs||0)+1; G.stam=(G.stam||0)+1; }},
  {id:'closer',  br:'HAND', n:'CLOSER',        draft:true, lvl:2,
   says:'the finisher lands at three', apply:()=>{ G.perkFinish=(G.perkFinish||0)+1; }},
  {id:'opening', br:'HAND', n:'OPENING MOVE',  draft:true, lvl:3,
   says:'one of them is ready when the bell goes', apply:()=>{
     G.kit=G.kit||{}; const k=KIT[Math.floor(Math.random()*KIT.length)];
     G.kit[k.id]=kitNeed(k); }}
];
/* *** THE SLICE RULE, LEARNED THREE TIMES IN ONE DAY. *** Several gates here do
   not READ a function, they SLICE IT OUT AND EXECUTE IT with a fixed list of
   bindings -- V163 does it to the speed clock, V167 to composeRoster, and
   combat_lab does it to spendMove with exactly (G, STAM_MAX, ...). That is a GOOD
   way to gate: a per-use refund and a global clock are indistinguishable by
   string. It also means ANY HELPER A SLICED FUNCTION CALLS IS UNDEFINED INSIDE
   THE HARNESS -- calling stamCap() from spendMove did not fail a claim, IT
   CRASHED THE WHOLE GATE.
   So every perk-aware cap is written INLINE at its read site, out of nothing but
   a const the harness already binds and G. The named helpers below stay for
   everything outside a sliced function. */
function ppCap(){ return PP_MAX+(G.perkCarry||0); }
function stamCap(){ return STAM_MAX+(G.perkLegs||0); }
const TREE={ xp:0, spent:[] };
function treeLoad(){
  try{ const raw=localStorage.getItem('bohemia.tree');
    if(raw){ const o=JSON.parse(raw); TREE.xp=o.xp|0; TREE.spent=Array.isArray(o.spent)?o.spent:[]; } }
  catch(_e){}                       /* opaque origin: keep the in-memory copy */
  return TREE; }
function treeSave(){
  try{ localStorage.setItem('bohemia.tree',JSON.stringify({xp:TREE.xp,spent:TREE.spent})); }catch(_e){} }
function treeLevel(){ return 1+Math.floor((TREE.xp||0)/XP_PER_LEVEL); }
function treePoints(){ return Math.max(0,(treeLevel()-1)-(TREE.spent||[]).length); }
function treeHas(id){ return (TREE.spent||[]).indexOf(id)>=0; }
function treeCanBuy(id){ const p=PERKS.find(x=>x.id===id);
  return !!p && !treeHas(id) && treePoints()>0 && treeLevel()>=p.lvl; }
function treeBuy(id){ if(!treeCanBuy(id))return false;
  TREE.spent.push(id); treeSave();
  const p=PERKS.find(x=>x.id===id);
  try{ p.apply(); }catch(_e){}      /* it lands in the fight you are standing in, too */
  try{ setRead(p.n,p.says,'#8fe89a'); updTree(); updPP(); updStam(); updKit(); }catch(_e){}
  return true; }
/* THE EARNED STATE IS APPLIED AT THE TOP OF EVERY FIGHT, which is what "no runs"
   means in code: the fight reads what the character already is. */
function applyPerks(){
  G.perkCarry=0; G.perkLegs=0; G.perkFinish=0; G.perkKit=0;
  G.perks=G.perks||{};
  for(const id of (TREE.spent||[])){ const p=PERKS.find(x=>x.id===id);
    if(p)try{ p.apply(); }catch(_e){} } }
/* AND THE EXPERIENCE OFF THE BODIES (V181) FINALLY LANDS SOMEWHERE. */
function treeEarn(n){ if(!n)return; TREE.xp=(TREE.xp||0)+n; treeSave();
  try{ updTree(); }catch(_e){} }
function updTree(){ const b=D('treebtn'); if(!b)return;
  const pts=treePoints();
  b.style.display=pts>0?'inline-block':'none';
  b.textContent='LEVEL '+treeLevel()+'  ('+pts+')';
  const panel=D('treepanel'); if(!panel||panel.style.display==='none')return;
  let h='<div style="opacity:0.75;margin-bottom:4px">XP '+(TREE.xp|0)+'   LEVEL '+treeLevel()+'   POINTS '+pts+'</div>';
  for(const br of ['BODY','EYE','HAND']){
    h+='<div style="opacity:0.6;margin-top:5px">'+br+'</div>';
    for(const p of PERKS.filter(x=>x.br===br)){
      const owned=treeHas(p.id), can=treeCanBuy(p.id);
      h+='<button class="cbtn" data-perk="'+p.id+'" style="display:block;width:100%;text-align:left;margin:2px 0;'
        +'border-color:'+(owned?'#8fe89a':(can?'#e8c88a':'#4a443a'))+';color:'+(owned?'#8fe89a':(can?'#e8c88a':'#6a6458'))+'">'
        +(owned?'\\u2714 ':'')+p.n+(p.lvl>treeLevel()?('  [lvl '+p.lvl+']'):'')
        +'<span style="opacity:0.7"> \\u2014 '+p.says+'</span></button>'; }
  }
  panel.innerHTML=h; }""",
        what='the tree')

    # ---- 3. THE FIGHT READS WHAT THE CHARACTER ALREADY IS ----
    d = sub(d,
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;",
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;\n"
        "  try{ treeLoad(); applyPerks(); }catch(_e){}   /* V188: no runs -- the fight starts as who you already are */",
        what='apply at fight start')

    # ---- 4. THE XP OFF THE BODIES LANDS IN THE TREE ----
    d = sub(d,
        "      if(d.xp){ G.ledger=G.ledger||{}; G.ledger.xp=(G.ledger.xp||0)+d.xp;\n"
        "                G.rc=G.rc||{}; G.rc.xp=(G.rc.xp||0)+d.xp; gotXP+=d.xp; }",
        "      if(d.xp){ G.ledger=G.ledger||{}; G.ledger.xp=(G.ledger.xp||0)+d.xp;\n"
        "                G.rc=G.rc||{}; G.rc.xp=(G.rc.xp||0)+d.xp; gotXP+=d.xp;\n"
        "                try{ treeEarn(d.xp); }catch(_x){} }   /* V188: and it lands in the TREE, which is what makes it a hundred hours */",
        what='xp into the tree')

    # ---- 5. THE LEGS CAP OBEYS THE PERK ----
    d = sub(d, "G.stam=Math.min(STAM_MAX,(G.stam||0)+n); updStam();",
        "G.stam=Math.min(STAM_MAX+(G.perkLegs||0),(G.stam||0)+n); updStam();", what='legs refund cap')
    d = sub(d, "    G.stam=STAM_MAX;\n", "    G.stam=STAM_MAX+(G.perkLegs||0);\n", what='legs clock cap')
    d = sub(d, "    G.stam=Math.min(STAM_MAX,(G.stam||0)+1); try{updStam();}catch(_e){}",
        "    G.stam=Math.min(STAM_MAX+(G.perkLegs||0),(G.stam||0)+1); try{updStam();}catch(_e){}", what='legs kit cap')

    # ---- 6. THE DOOR ----
    d = sub(d,
        '<span id="kitrow"></span>',
        '<span id="kitrow"></span>\n    <button id="treebtn" class="cbtn" style="display:none;border-color:#8fe89a;color:#8fe89a">LEVEL 1 (0)</button>\n'
        '    <div id="treepanel" style="display:none;position:absolute;z-index:40;left:6px;right:6px;top:44px;'
        'background:rgba(14,12,10,0.96);border:1px solid #4a443a;border-radius:6px;padding:8px;font-size:11px;max-height:60vh;overflow:auto"></div>',
        what='the button and the panel')

    d = sub(d,
        "  const _s=D('suppressbtn'); if(_s)_s.addEventListener('click',doSuppress);",
        """  /* V188: the tree opens, and a perk is bought by tapping it. Delegated,
     because the rows are rebuilt every time anything changes. */
  const _tb=D('treebtn');
  if(_tb)_tb.addEventListener('click',()=>{ const pn=D('treepanel'); if(!pn)return;
    pn.style.display=(pn.style.display==='none'?'block':'none'); try{ updTree(); }catch(_e){} });
  const _tp=D('treepanel');
  if(_tp)_tp.addEventListener('click',(ev)=>{ const b=ev.target&&ev.target.closest?ev.target.closest('[data-perk]'):null;
    if(!b)return; try{ audio(); }catch(_e){}
    treeBuy(b.getAttribute('data-perk')); try{ updTree(); renderBoard(); }catch(_e){} });
  const _s=D('suppressbtn'); if(_s)_s.addEventListener('click',doSuppress);""",
        what='tree wiring')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v188: the tree -- %d chars' % len(d))


if __name__ == '__main__':
    main()
