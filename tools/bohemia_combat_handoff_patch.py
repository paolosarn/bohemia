#!/usr/bin/env python3
"""BOHEMIA - V66 RUN HANDOFF HARDENING (COMBAT lane, 7/26/26).

The first connected RUN calls combat from a quest step. This patch makes that
enter/exit path bulletproof, on BOTH sides of the bus:

  DEMO SIDE (inside COMBAT_B64):
    - a new HANDOFF CORE block: pure, DOM-free, gate-simmed. It owns the whole
      encounter bus (quest CONTEXT in, ONE clean slate per fight, ONE outcome
      out, abort, ping/ready) so combat_lab_gate.js can run five encounters
      back to back headless through the real listener.
    - THE LEAK LIST: one declared table of every field a fight dirties, so a
      fresh encounter provably starts clean (the v59 reset missed the nerve
      tracker, armed sprint, streaks, recoil/wound, fx and hitstop).
    - quest OBJECTIVE renders on the screen while the fight runs.
    - encounterOutcome()/sendCombatEnd() now delegate to the core: one source
      of truth for dead/spared/fled and for the one-send-per-fight latch.

  PARENT SIDE (the alpha shell, outside the blob):
    - ensureCombatFrame(): the run can hand off COLD, with the combat tab
      never opened; the frame is built on demand.
    - a READY handshake + queue: an encounter posted before the demo is
      listening is held and flushed, never dropped (the real run-killer).
    - startEncounter(spec) carries quest context and an onEnd callback;
      BOHEMIA_COMBAT_END fills G.encounter.outcome + G.lastEncounter.
    - BOHEMIA_COMBAT_ERROR is finally handled instead of falling on the floor.

Every replacement asserts its anchor exists EXACTLY ONCE, so canon drift makes
this script fail loudly instead of corrupting the demo. Idempotent: skips if
the patch marker is already present.

REUSE CHECK: no graphic pixels are cooked here (plumbing only). The objective
chip reuses the demo's existing HUD palette tokens (--line/--ink/--bg) rather
than introducing a new colorway.

Usage: python3 tools/bohemia_combat_handoff_patch.py
Gate:  node gates/combat_lab_gate.js   (section 5 sims this headless)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'HANDOFF CORE START'
PARENT_MARK = 'V66 RUN HANDOFF (parent side)'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


# ===========================================================================
# 1. THE HANDOFF CORE (pure; the gate requires and sims this exact body)
# ===========================================================================
HANDOFF_CORE = r"""/* ===== HANDOFF CORE START (V66 RUN HANDOFF, pure + gate-simmed) =====
   THE RUN CALLS COMBAT. Everything the encounter bus does lives in this one
   block so the gate can run it headless: quest CONTEXT in, ONE clean slate per
   fight, ONE outcome out, five fights back to back with nothing leaking.
   No DOM, no canvas, no globals: every side effect goes through env hooks. */
var BohemiaHandoff=(function(){
  /* THE LEAK LIST: every field a fight dirties, and the value a fresh fight
     starts from. One list, one truth -- a new state field is one line here
     instead of a bug that only shows up on encounter two. */
  var BASE={
    over:false, win:false, phase:'cover', inFU:false, execWindow:false, ks:null,
    frozen:false, freezeTimer:0, killStreak:0, popTarget:-1, fireTarget:-1,
    selTarget:null, mTurn:0, _oneStreak:0, _onePop:false, _chainN:1, _relGreed:false,
    dashArm:false, handPeek:false, sprintArm:false, _endSent:false, _walkout:null,
    inc:null, grenade:null, _grenadeBlast:null, _grenadeThrown:false,
    wager:'none', wagerLocked:false, wagerFail:false,
    recoil:0, wound:0, woundShake:0, breathT:0, _hitstop:0, _redPunch:0, _vShakeAt:0,
    greedHeld:false, greedWant:false, greedMult:1.0,
    _nerveLastDown:0, _newBeads:0, _poppedOut:false, _dropAt:0, _riseAt:0, _stepAt:0,
    _lastErr:null, _demo:null, _spawnLayout:null };
  var EMPTY=['e','corpses','bloodSpots','litter','coverHoles','_fx','pillars'];
  function cleanSlate(G){
    for(var k in BASE)G[k]=BASE[k];
    for(var i=0;i<EMPTY.length;i++)G[EMPTY[i]]=[];
    G.rc={shots:0,hits:0,kills:0,greedCashed:0,greedWasted:0,best:999,peak:0};
    return G; }
  /* soft hooks are cosmetic (camera, beat, UI chrome): a stumble there never
     kills the fight. HARD hooks build the fight itself -- if one throws the
     failure goes out on the bus, because the run has to HEAR that instead of
     waiting forever on an encounter that never assembled. */
  function call(f){ if(typeof f==='function'){ try{ return f(); }catch(_e){} } }
  function hard(f){ if(typeof f==='function')return f(); }
  function txt(v,n){ return (v==null)?null:String(v).slice(0,n||64); }
  /* QUEST CONTEXT IN: why this fight is happening rides in with it, stays for
     the whole fight, and is echoed on the way out so the quest step can match
     the outcome to itself. */
  function context(d){ d=d||{};
    return { encounterId:txt(d.encounterId,64), questId:txt(d.questId,64), stepId:txt(d.stepId,64),
      objective:txt(d.objective,140), faction:txt(d.faction,40), reason:txt(d.reason,64),
      mercy:!!d.mercy,
      packageId:(d.packageId!=null)?Math.max(0,Math.min(4,d.packageId|0)):null }; }
  function standing(e){ return !(e.dead||e.downed||e.broken||e.fleeing); }
  /* OUTCOME OUT: dead / spared / fled per the mercy mechanics, plus who was
     still on his feet when the shooting stopped. */
  function outcome(G){ var src=(G&&G.e)||[], fates=[], i, e, f;
    for(i=0;i<src.length;i++){ e=src[i]||{};
      f = e.dead?'dead':(e.fleeing?'fled':((e.broken||e.downed)?'spared':'alive'));
      fates.push({eid:(e.eid!=null?e.eid:i), name:e.n, fate:f}); }
    var n=function(k){ var c=0,j; for(j=0;j<fates.length;j++)if(fates[j].fate===k)c++; return c; };
    return { dead:n('dead'), spared:n('spared'), fled:n('fled'), alive:n('alive'), fates:fates }; }
  function endPayload(G,win,reason){ var o=outcome(G), C=(G&&G._ctx)||{};
    return { type:'BOHEMIA_COMBAT_END', victory:!!win,
      result:(reason==='abort')?'aborted':(win?'win':'loss'),
      reason:reason||(win?'cleared':'down'),
      kills:o.dead, dead:o.dead, spared:o.spared, fled:o.fled, alive:o.alive, fates:o.fates,
      playerHP:Math.max(0,G.pHP|0), turns:G.mTurn|0,
      encounterId:C.encounterId||null, questId:C.questId||null, stepId:C.stepId||null }; }
  /* ONE SEND PER FIGHT: win, loss and abort all route here; _endSent latches. */
  function end(G,win,reason,post){ if(G._endSent)return null; G._endSent=true;
    var p=endPayload(G,win,reason);
    if(typeof post==='function'){ try{ post(p); }catch(_e){} }
    return p; }
  function applyRoster(G,list){ if(!list||!list.length)return;
    for(var i=0;i<list.length;i++){ var r=list[i], e=(G.e||[])[i]; if(!e||!r)continue;
      if(r.name)e.n=r.name; if(r.hp){e.hp=r.hp;e.max=r.hp;} if(r.eid!=null)e.eid=r.eid; } }
  function enter(G,d,env){ env=env||{}; d=d||{};
    var C=context(d);
    cleanSlate(G);                       /* nothing from the last fight survives */
    G._ctx=C;
    call(env.takeover);                  /* a quest handoff walks you STRAIGHT into the fight, never onto a splash */
    G.pMax=G.pMax||100;
    G.pHP=(typeof d.playerHP==='number')?Math.max(1,Math.min(G.pMax,d.playerHP|0)):G.pMax;
    if(env.stamMax!=null)G.stam=env.stamMax;
    if(C.packageId!=null){ G.userPkg=C.packageId; G.pkgDiff=C.packageId; call(env.syncPkg); }
    G.numEnemies=(d.roster&&d.roster.length)?Math.max(1,Math.min(8,d.roster.length)):(G.numEnemies||3);
    call(env.camHome); call(env.resetBeat); call(env.shuffle);
    hard(env.setup);                     /* setupEnemies: the bodies */
    applyRoster(G,d.roster);             /* ENGINE-OWNED ROSTER: the game decides who you fight */
    hard(env.afterSetup);                /* board, player, UI, music, objective */
    var alive=0,i; for(i=0;i<(G.e||[]).length;i++)if(standing(G.e[i]))alive++;
    G.enemiesLeft=alive;
    return C; }
  /* THE BUS: installed once, answers every message the run can send. */
  function install(win,G,env){ env=env||{};
    var post=env.post||function(m){ try{ parent.postMessage(m,'*'); }catch(_e){} };
    var ready=function(){ return {type:'BOHEMIA_COMBAT_READY',version:66}; };
    var handler=function(ev){ var d=ev&&ev.data; if(!d||!d.type)return false;
      if(d.type==='BOHEMIA_ENCOUNTER'){
        try{ var C=enter(G,d,env);
          post({type:'BOHEMIA_COMBAT_STARTED',encounterId:C.encounterId,questId:C.questId,
                stepId:C.stepId,enemies:G.numEnemies|0}); }
        catch(_e){ post({type:'BOHEMIA_COMBAT_ERROR',phase:'encounter',
                         encounterId:txt(d.encounterId,64),msg:String((_e&&_e.message)||_e)}); }
        return true; }
      if(d.type==='BOHEMIA_ENCOUNTER_ABORT'){    /* the quest pulls you out */
        try{ end(G,false,'abort',post); G.over=true; G.phase='over'; call(env.onAbort); }
        catch(_e){ post({type:'BOHEMIA_COMBAT_ERROR',phase:'abort',msg:String((_e&&_e.message)||_e)}); }
        return true; }
      if(d.type==='BOHEMIA_COMBAT_PING'){ post(ready()); return true; }
      return false; };
    if(win&&win.addEventListener)win.addEventListener('message',handler);
    post(ready());   /* the run never has to guess when the frame is listening */
    return handler; }
  return { BASE:BASE, cleanSlate:cleanSlate, context:context, outcome:outcome,
           endPayload:endPayload, end:end, enter:enter, install:install }; })();
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaHandoff;
/* ===== HANDOFF CORE END ===== */
"""


# ===========================================================================
# 2. the demo-side rewiring
# ===========================================================================
OLD_LISTENER = """window.addEventListener('message',ev=>{
  const d=ev&&ev.data;if(!d||d.type!=='BOHEMIA_ENCOUNTER')return;
  /* V59 RUN HANDOFF: a fresh encounter is a CLEAN SLATE -- nothing leaks from the last fight */
  try{
    try{if(typeof camHome==='function')camHome();}catch(_e){}
    G.over=false; G.win=false; G.phase='cover'; G.inFU=false; G.execWindow=false; G.ks=null; G.frozen=false;
    G.killStreak=0; G.popTarget=-1; G.fireTarget=-1; G._oneStreak=0; G.dashArm=false; G.handPeek=false; G._endSent=false;
    G.stam=(typeof STAM_MAX!=='undefined')?STAM_MAX:3;
    G.e=[]; G.corpses=[]; G.bloodSpots=[]; G.litter=[]; G.coverHoles=[]; G._walkout=null; G.inc=null; G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;   /* V59: clear the dead too. V60: no live grenade carries in. V61: one per encounter */
    G.wager='none'; G.wagerLocked=false; G.wagerFail=false;
    G.pMax=G.pMax||100; G.pHP=(typeof d.playerHP==='number')?Math.max(1,Math.min(G.pMax,d.playerHP)):G.pMax;
    try{resetBeat();}catch(_e){}
    if(d.packageId!=null){const p=Math.max(0,Math.min(4,d.packageId|0));G.userPkg=p;G.pkgDiff=p; try{if(typeof syncPkgUI==='function')syncPkgUI();}catch(_e){}}
    if(G.factionShuffle){ try{pickRandomFaction();}catch(_e){} try{pickDayPhase();}catch(_e){} }
    G.numEnemies=(Array.isArray(d.roster)&&d.roster.length)?Math.max(1,Math.min(8,d.roster.length)):(G.numEnemies||3);
    setupEnemies();
    if(Array.isArray(d.roster)&&d.roster.length){   /* ENGINE-OWNED ROSTER: the game decides who you fight */
      d.roster.forEach((r,i)=>{const e=G.e[i];if(!e||!r)return;
        if(r.name)e.n=r.name; if(r.hp){e.hp=r.hp;e.max=r.hp;} if(r.eid!=null)e.eid=r.eid;}); }
    try{updateGeomCover();}catch(_e){}
    buildBoard(); updPlayer(); G.enemiesLeft=aliveEnemies().length;
    G.rc={shots:0,hits:0,kills:0,greedCashed:0,greedWasted:0,best:999,peak:0};
    G.phase='cover'; setPhaseUI(); renderBoard();
    try{updGap();}catch(_e){} try{if(typeof updReadout==='function')updReadout();}catch(_e){} try{if(typeof updStam==='function')updStam();}catch(_e){}
    try{if(typeof startFactionLoop==='function'&&!G._musMuted)startFactionLoop();}catch(_e){}
  }catch(_e){ try{parent.postMessage({type:'BOHEMIA_COMBAT_ERROR',phase:'encounter',msg:String((_e&&_e.message)||_e)},'*');}catch(__e){} }
});"""

NEW_LISTENER = """/* V66 RUN HANDOFF: the encounter bus IS BohemiaHandoff (HANDOFF CORE above).
   The demo supplies only the hooks that touch the screen, so the gate can run
   the identical listener headless, five encounters back to back. */
function showObjective(C){ const o=D('objchip'); if(!o)return;
  const txt=(C&&C.objective)?C.objective:'';
  o.textContent=txt?(txt+(C&&C.mercy?'   \\u00b7   NOBODY HAS TO DIE':'')):'';
  o.style.display=txt?'block':'none'; }
BohemiaHandoff.install(window,G,{
  stamMax:(typeof STAM_MAX!=='undefined')?STAM_MAX:3,
  post:function(m){ try{parent.postMessage(m,'*');}catch(_e){} },
  /* V66: handed a fight by a quest, you are already in it. The demo's own TAP
     TO START splash is for someone opening the COMBAT tab to play the dial --
     it must never be what a run walks into. */
  takeover:function(){ if(G._ctx&&(G._ctx.questId||G._ctx.encounterId)){ try{startGame();}catch(_e){} } },
  camHome:function(){ if(typeof camHome==='function')camHome(); },
  resetBeat:function(){ if(typeof resetBeat==='function')resetBeat(); },
  syncPkg:function(){ if(typeof syncPkgUI==='function')syncPkgUI(); },
  shuffle:function(){ if(G.factionShuffle){ try{pickRandomFaction();}catch(_e){} try{pickDayPhase();}catch(_e){} } },
  setup:function(){ setupEnemies(); },
  afterSetup:function(){
    try{updateGeomCover();}catch(_e){}
    buildBoard(); updPlayer();
    G.phase='cover'; setPhaseUI(); renderBoard();
    try{updGap();}catch(_e){} try{if(typeof updReadout==='function')updReadout();}catch(_e){} try{if(typeof updStam==='function')updStam();}catch(_e){}
    try{if(typeof startFactionLoop==='function'&&!G._musMuted)startFactionLoop();}catch(_e){}
    try{showObjective(G._ctx);}catch(_e){} },
  onAbort:function(){
    try{setRead('CALLED OFF','the quest pulled you out of it','#8fd0e8');}catch(_e){}
    try{setPhaseUI();}catch(_e){} try{renderBoard();}catch(_e){} }
});"""

OLD_OUTCOME = """function encounterOutcome(){ const fates=(G.e||[]).map(e=>({eid:(e.eid!=null?e.eid:e.i),name:e.n,
    fate: e.dead?'dead':(e.fleeing?'fled':((e.broken||e.downed)?'spared':'alive')) }));
  return { dead:fates.filter(f=>f.fate==='dead').length, spared:fates.filter(f=>f.fate==='spared').length, fled:fates.filter(f=>f.fate==='fled').length, fates }; }   /* V59 RUN HANDOFF: dead/spared/fled per the mercy mechanics */
function sendCombatEnd(win){ if(G._endSent)return; G._endSent=true; const o=encounterOutcome();
  try{parent.postMessage({type:'BOHEMIA_COMBAT_END',victory:!!win,result:win?'win':'loss',kills:o.dead,dead:o.dead,spared:o.spared,fled:o.fled,fates:o.fates,playerHP:Math.max(0,G.pHP|0)},'*');}catch(_e){} }"""

NEW_OUTCOME = """/* V66: one source of truth -- the outcome and the one-send latch both live in
   HANDOFF CORE, so the gate tests the same code the run rides. */
function encounterOutcome(){ return BohemiaHandoff.outcome(G); }   /* V59 RUN HANDOFF: dead/spared/fled per the mercy mechanics */
function sendCombatEnd(win,reason){ BohemiaHandoff.end(G,win,reason||(win?'cleared':'down'),
    function(m){ try{parent.postMessage(m,'*');}catch(_e){} }); }"""

# THE 13-SECOND STALL. Measured on the real surface (headless Chromium on the
# shipped alpha): a cold handoff took 12.9s to reach the fight. None of it was
# the encounter -- an external Google Fonts stylesheet in the demo head BLOCKS
# the inline script from running until it loads or the socket gives up. On a
# phone with one bar that is the run stopping dead at the moment it gets good.
# The font still loads, it just no longer holds the fight hostage.

OLD_FONT = """<link href="https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">"""

NEW_FONT = """<!-- V66 RUN HANDOFF: NON-BLOCKING FONT. A render-blocking cross-origin
     stylesheet held combat's whole boot for ~13s offline (measured). The type
     arrives when it arrives; the fight never waits for it. -->
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=VT323&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet"></noscript>"""

OLD_STAGE = """<div id="stage"><canvas id="cv"></canvas><div id="verd"></div></div>"""

NEW_STAGE = """<div id="stage"><canvas id="cv"></canvas><div id="verd"></div>
<!-- V66 RUN HANDOFF: the quest's own words, over the board while you fight.
     Lives INSIDE the stage so it never covers the controls, and is only ever
     visible when a quest handed this encounter over. -->
<div id="objchip" style="display:none;position:absolute;left:50%;top:8px;transform:translateX(-50%);z-index:12;max-width:86%;padding:5px 12px;border:1px solid var(--line);border-radius:3px;background:rgba(12,10,8,0.88);color:var(--ink);font-size:11px;letter-spacing:1px;line-height:1.35;text-align:center;pointer-events:none;"></div></div>"""

def patch_demo(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    demo = sub1(demo, '/* ===== MELEE CORE END ===== */\n',
                '/* ===== MELEE CORE END ===== */\n' + HANDOFF_CORE, 'handoff core insert')
    demo = sub1(demo, OLD_LISTENER, NEW_LISTENER, 'encounter listener')
    demo = sub1(demo, OLD_OUTCOME, NEW_OUTCOME, 'outcome + sendCombatEnd')
    demo = sub1(demo, OLD_STAGE, NEW_STAGE, 'objective chip')
    demo = sub1(demo, OLD_FONT, NEW_FONT, 'non-blocking font')
    return demo


# ===========================================================================
# 3. the parent-shell (alpha) side
# ===========================================================================
OLD_START = """/* ENCOUNTER LIFECYCLE (7/3/26): the engine spawns the fight. startEncounter
   builds the roster from engine entity specs, pushes it into the dial, and
   tracks it until BOHEMIA_COMBAT_END settles the outcome. */
function startEncounter(spec){
  spec=spec||{};
  const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||('hostile_'+i),hp:r.hp||60,arch:r.arch||'human',dead:false}));
  /* AMMO WIRE (7/3/26): the encounter carries a REAL engine inventory; every
     resolved shot spends through Inventory.spendAmmo, the macro/micro law in
     practice. Mag sizes + per-weapon ammo types [PENDING, Paolo's tables];
     until then generic 60 and a dry shot still resolves visually. */
  const inv=BohemiaEngine.Inventory.fresh();
  BohemiaEngine.Inventory.addAmmo(inv,'generic',60);
  G.encounter={roster:roster,inv:inv,packageId:spec.packageId!=null?spec.packageId:1,kills:0,over:false,victory:null,playerHP:100,startedAt:Date.now()};
  const fr=document.getElementById('combatFrame');
  if(fr&&fr.contentWindow)try{fr.contentWindow.postMessage({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster},'*');}catch(_e){}
  return G.encounter;
}
function combatSetEncounter(packageId){
  const fr=document.getElementById('combatFrame');
  if(fr&&fr.contentWindow)try{fr.contentWindow.postMessage({type:'BOHEMIA_ENCOUNTER',packageId:packageId},'*');}catch(_e){}
}"""

NEW_START = """/* ===== V66 RUN HANDOFF (parent side): THE RUN CAN CALL COMBAT COLD =====
   A quest step hands off to a fight, and the combat tab may never have been
   opened in this session. ensureCombatFrame builds the frame on demand, and
   the encounter QUEUES until the demo answers BOHEMIA_COMBAT_READY -- a
   handoff can never land in a frame that is not listening yet (that dropped
   message is the one thing that would kill the run outright). */
function ensureCombatFrame(){
  let fr=document.getElementById('combatFrame');
  if(fr)return fr;
  const pc=document.getElementById('p-combat'); if(!pc)return null;
  /* LAB RETIRED (Paolo 7/20 verdict: the beat-tactics grammars are down;
     the shove already lives in the demo). The combat tab IS the Dead Eye
     Dial demo, full-time. */
  fr=document.createElement('iframe');fr.id='combatFrame';fr.allow='clipboard-write';
  fr.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(COMBAT_B64),c=>c.charCodeAt(0)));
  pc.appendChild(fr);
  setTimeout(musicPushToCombat,1200);   /* CATEGORY POOL: combat gets the faction pools at boot, not only when the music tab plays */
  return fr;
}
G._combatReady=false; G._combatQ=[]; G._combatPing=null; G._encN=0;
function combatPost(msg){
  const fr=ensureCombatFrame();
  if(fr&&fr.contentWindow&&G._combatReady){
    try{fr.contentWindow.postMessage(msg,'*');return true;}catch(_e){}
  }
  G._combatQ=G._combatQ.filter(m=>m.type!==msg.type);   /* one pending of a kind: the newest handoff wins */
  G._combatQ.push(msg);
  combatPingSoon();
  return false;
}
function combatPingSoon(){
  if(G._combatPing)return;
  let tries=0;
  G._combatPing=setInterval(()=>{
    if(G._combatReady||tries++>40){clearInterval(G._combatPing);G._combatPing=null;return;}
    const fr=document.getElementById('combatFrame');
    if(fr&&fr.contentWindow)try{fr.contentWindow.postMessage({type:'BOHEMIA_COMBAT_PING'},'*');}catch(_e){}
  },250);
}
function combatFlush(){
  const fr=document.getElementById('combatFrame');
  if(!fr||!fr.contentWindow)return;
  const q=G._combatQ; G._combatQ=[];
  for(const m of q)try{fr.contentWindow.postMessage(m,'*');}catch(_e){}
}
/* ENCOUNTER LIFECYCLE (7/3/26): the engine spawns the fight. startEncounter
   builds the roster from engine entity specs, pushes it into the dial, and
   tracks it until BOHEMIA_COMBAT_END settles the outcome. */
function startEncounter(spec){
  spec=spec||{};
  const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||('hostile_'+i),hp:r.hp||60,arch:r.arch||'human',dead:false}));
  /* AMMO WIRE (7/3/26): the encounter carries a REAL engine inventory; every
     resolved shot spends through Inventory.spendAmmo, the macro/micro law in
     practice. Mag sizes + per-weapon ammo types [PENDING, Paolo's tables];
     until then generic 60 and a dry shot still resolves visually. */
  const inv=BohemiaEngine.Inventory.fresh();
  BohemiaEngine.Inventory.addAmmo(inv,'generic',60);
  /* QUEST CONTEXT IN (V66): why this fight is happening rides with it, and
     comes back on BOHEMIA_COMBAT_END so the quest step matches outcome to
     itself even if the player took the long way round. */
  const ctx={encounterId:spec.encounterId||('enc_'+(++G._encN)),
    questId:spec.questId||null,stepId:spec.stepId||null,objective:spec.objective||null,
    faction:spec.faction||null,reason:spec.reason||null,mercy:!!spec.mercy};
  G.encounter={roster:roster,inv:inv,packageId:spec.packageId!=null?spec.packageId:1,ctx:ctx,
    kills:0,over:false,settled:false,victory:null,result:null,outcome:null,
    playerHP:(typeof spec.playerHP==='number')?spec.playerHP:100,startedAt:Date.now(),
    onEnd:(typeof spec.onEnd==='function')?spec.onEnd:null};
  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,
    playerHP:G.encounter.playerHP,encounterId:ctx.encounterId,questId:ctx.questId,stepId:ctx.stepId,
    objective:ctx.objective,faction:ctx.faction,reason:ctx.reason,mercy:ctx.mercy});
  return G.encounter;
}
/* the quest can call the fight OFF (a talk resolves it, a timer runs out): the
   demo still answers with one clean settled outcome, never a dangling fight. */
function abortEncounter(){
  if(!G.encounter||G.encounter.settled)return false;
  combatPost({type:'BOHEMIA_ENCOUNTER_ABORT'});
  return true;
}
function combatSetEncounter(packageId){
  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:packageId});
}"""

OLD_END = """  if(d.type==='BOHEMIA_COMBAT_END'){
    if(G.encounter){G.encounter.over=true;G.encounter.victory=!!d.victory;G.encounter.playerHP=d.playerHP;}
    G.combatLog.push({t:Date.now(),outcome:d.victory?'encounter-won':'encounter-lost',kills:d.kills,hp:d.playerHP,recorded:true});
    if(G.combatLog.length>40)G.combatLog.shift();
    /* faction standing + loot settle here [PENDING, sim state in the alpha] */
    return true;
  }"""

NEW_END = """  if(d.type==='BOHEMIA_COMBAT_READY'){   /* V66: the demo is listening -- flush anything the run posted early */
    G._combatReady=true; combatFlush();
    return true;
  }
  if(d.type==='BOHEMIA_COMBAT_STARTED'){
    if(G.encounter)G.encounter.live=true;
    return true;
  }
  if(d.type==='BOHEMIA_COMBAT_ERROR'){   /* V66: a broken handoff is LOUD in the log, never silent */
    G.combatLog.push({t:Date.now(),outcome:'combat-error',phase:d.phase,msg:d.msg,recorded:false});
    if(G.combatLog.length>40)G.combatLog.shift();
    return true;
  }
  if(d.type==='BOHEMIA_COMBAT_END'){
    const enc=G.encounter;
    if(enc&&!enc.settled){   /* V66: settle ONCE, hand the run its outcome */
      enc.over=true; enc.settled=true; enc.live=false;
      enc.victory=!!d.victory; enc.result=d.result||(d.victory?'win':'loss'); enc.playerHP=d.playerHP;
      enc.outcome={result:enc.result,reason:d.reason||null,victory:!!d.victory,
        dead:d.dead|0,spared:d.spared|0,fled:d.fled|0,alive:d.alive|0,fates:d.fates||[],
        playerHP:d.playerHP,turns:d.turns|0,
        encounterId:d.encounterId||(enc.ctx&&enc.ctx.encounterId)||null,
        questId:d.questId||(enc.ctx&&enc.ctx.questId)||null,
        stepId:d.stepId||(enc.ctx&&enc.ctx.stepId)||null};
      G.lastEncounter=enc.outcome;
      if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}
    }
    G.combatLog.push({t:Date.now(),outcome:d.victory?'encounter-won':'encounter-lost',kills:d.kills,hp:d.playerHP,recorded:true});
    if(G.combatLog.length>40)G.combatLog.shift();
    /* faction standing + loot settle here [PENDING, sim state in the alpha] */
    return true;
  }"""

# WARM THE FIGHT: REVERTED 7/26 (Paolo: the fight was showing the wrong
# character with no clothing). Pre-building the combat frame at app open also
# pre-BAKES the player's sprites, and any look that restores late would get
# baked stale. Not worth the risk for a boot that is already 14ms since the
# font fix. The frame is built on demand, exactly as it always was.

OLD_TAB = """  if(t.dataset.p==='combat'&&!document.getElementById('combatFrame')){
    const pc=document.getElementById('p-combat');
    /* LAB RETIRED (Paolo 7/20 verdict: the beat-tactics grammars are down;
       the shove already lives in the demo). The combat tab IS the Dead Eye
       Dial demo, full-time. */
    const fr=document.createElement('iframe');fr.id='combatFrame';fr.allow='clipboard-write';
    fr.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(COMBAT_B64),c=>c.charCodeAt(0)));
    pc.appendChild(fr);
    setTimeout(musicPushToCombat,1200);}   /* CATEGORY POOL: combat gets the faction pools at boot, not only when the music tab plays */"""

NEW_TAB = """  if(t.dataset.p==='combat')ensureCombatFrame();   /* V66: one builder, tab or run */"""


def patch_parent(src):
    if PARENT_MARK in src:
        print('  parent: already patched, skipping')
        return src
    src = sub1(src, OLD_START, NEW_START, 'startEncounter lifecycle')
    if src.count(OLD_END_WITH_RUN) == 1:
        src = sub1(src, OLD_END_WITH_RUN, NEW_END_WITH_RUN, 'combat end handler (with the run relay)')
    else:
        src = sub1(src, OLD_END, NEW_END, 'combat end handler')
    src = sub1(src, OLD_TAB, NEW_TAB, 'combat tab frame')
    return src


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))

    newdemo = patch_demo(demo)
    if newdemo is not demo:
        b64 = base64.b64encode(newdemo.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        print('  demo: re-embedded (%d bytes, +%d)' % (len(newdemo), len(newdemo) - len(demo)))

    src = patch_parent(src)

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
