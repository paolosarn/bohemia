#!/usr/bin/env python3
"""BOHEMIA — MELEE + SHOVE + PERKS into the canon COMBAT demo (7/19/26).

Paolo's ruling: what he said he liked goes STRAIGHT into the actual combat
demo, no re-confirmation. This patch grafts the lab-ruled mechanics onto the
Dead Eye Dial demo inside the alpha's COMBAT_B64:
  - weapon-typed MELEE enemies (SHIV fast / BAT heavy / SPEAR reach), riding
    the melee plumbing the demo has carried since 7/4,
  - the SHOVE: contextual button at point-blank, ALWAYS stuns 1 turn
    (IRON SHOULDER perk: 2), chance to TOPPLE (prone), no-stun-lock honored,
  - FORESIGHT perk: movement intent on the enemy chips (attack windups are
    always visible — an attack is never a surprise).
Pure decision logic lives in a MELEE CORE block so combat_lab_gate.js can
require and sim it headless.

Every replacement asserts its anchor exists EXACTLY ONCE, so canon drift
makes this script fail loudly instead of corrupting the demo.
Idempotent: skips if the patch marker is already present.

Usage: python3 tools/bohemia_combat_melee_patch.py
"""
import base64, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'MELEE CORE START'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('already patched, skipping')
        return demo

    # ---- 1. MELEE CORE (pure, gate-testable) + new archetypes ----
    demo = sub1(demo, "// ---- enemy archetypes (armor / HP) ----", """\
/* ===== MELEE CORE START (pure decision logic, gate-tested; Paolo rulings 7/19) =====
   decide(e,turn): NEVER strikes without a windup the turn before (telegraph law);
   held while stunned/prone; spear stops at its reach and pokes from there.
   shove(e,perk,roll): ALWAYS stuns 1 (perk: 2) unless the no-stun-lock clock
   says he braces; roll (0..99, injected) decides the topple. */
var BohemiaMelee={
  decide:function(e,turn){
    if(e.stun>0||e.prone>0)return {act:'held',dist:e.edist};
    if(e.windup)return {act:'strike',dist:e.edist};
    var active=((turn+(e.phase||0))%(e.cad||1))===0;
    if(!active)return {act:'rest',dist:e.edist};
    if(e.edist<=e.reach)return {act:'windup',dist:e.edist};
    return {act:'advance',dist:Math.max(e.reach,e.edist-e.adv)};
  },
  shove:function(e,perk,roll){
    var out={stun:0,pushed:3,topple:false,braced:false};
    if(e.stun>0||e.stunCooldown>0)out.braced=true;
    else out.stun=perk?2:1;
    out.topple=roll<(perk?50:30);
    return out;
  },
  SHOVE_RANGE:2.5
};
if(typeof module!=='undefined'&&module.exports)module.exports=BohemiaMelee;
/* ===== MELEE CORE END ===== */
// ---- enemy archetypes (armor / HP) ----""", 'melee-core')

    demo = sub1(demo, """\
  /* MELEE plumbing (Paolo 7/4/26): a melee/charging archetype sets melee:true.
     It weights the facing math heavier the closer it gets (a blade a tile away
     is a faster death than a gun across the map). Add rushers/dogs/bladed
     goons here later; the facing already respects the flag. */
};""", """\
  /* MELEE plumbing (Paolo 7/4/26): a melee/charging archetype sets melee:true.
     It weights the facing math heavier the closer it gets (a blade a tile away
     is a faster death than a gun across the map). Add rushers/dogs/bladed
     goons here later; the facing already respects the flag. */
  /* WEAPON-TYPED MELEE (Paolo 7/19: "depending on the weapon they have they
     will move differently"). Identity = advance rate x strike cadence x reach,
     never damage numbers. Names are mechanic placeholders; flavor is Paolo's.
     adv = tiles closed per active turn; reach = strike range (tiles);
     cad = acts every Nth turn (1 = every turn). */
  shiv: {n:'SHIV', hp:60, acc:0, dmg:[14,20], bot:false, melee:true, adv:3, reach:1.8, cad:1},
  bat:  {n:'BAT',  hp:85, acc:0, dmg:[26,38], bot:false, melee:true, adv:2, reach:1.8, cad:2},
  spear:{n:'SPEAR',hp:70, acc:0, dmg:[18,26], bot:false, melee:true, adv:2, reach:4.2, cad:2},
};""", 'archetypes')

    # ---- 2. makeEnemy fields ----
    demo = sub1(demo,
        "return {i,arch,E:a,n:a.n,hp:a.hp,max:a.hp,armor:(a.armor||0),melee:!!a.melee,dead:false,inCover:true,beatOffset:0,stun:0,stunCooldown:0};",
        "return {i,arch,E:a,n:a.n,hp:a.hp,max:a.hp,armor:(a.armor||0),melee:!!a.melee,dead:false,inCover:!a.melee,beatOffset:0,stun:0,stunCooldown:0,prone:0,windup:false,adv:(a.adv||0),reach:(a.reach||0),cad:(a.cad||1),phase:i%2};",
        'make-enemy')

    # ---- 3. spawn mix ----
    demo = sub1(demo,
        "for(let i=0;i<N;i++){ const arch=(N>=5 && i%4===3)?'bot':'human'; const e=makeEnemy(i,arch);",
        """for(let i=0;i<N;i++){ let arch=(N>=5 && i%4===3)?'bot':'human';
    /* MELEE MIX (Paolo 7/19): blades join the gunfight. SOME = every 3rd body,
       PACK = every other. Settings toggle; default SOME. */
    const MM=(G.meleeMix==null)?1:G.meleeMix;
    if(MM===1&&N>=3&&i%3===2)arch=['shiv','bat','spear'][((i/3)|0)%3];
    else if(MM===2&&i%2===1)arch=['shiv','bat','spear'][((i/2)|0)%3];
    const e=makeEnemy(i,arch);""",
        'spawn-mix')
    demo = sub1(demo, "G.e=[]; const N=G.numEnemies;",
        "G.e=[]; const N=G.numEnemies; G.mTurn=0;", 'mturn-reset')

    # ---- 4. gun pools exclude blades ----
    demo = sub1(demo,
        "function exposedToMe(){ return G.e.filter(e=>!e.dead&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea)); }",
        "function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea)); }   /* blades don't SHOOT; their damage is meleeTurnRun's */",
        'exposed-excl')
    demo = sub1(demo,
        "function firing(e){ if(e.dead||e.stun>0)return false;",
        "function firing(e){ if(e.dead||e.stun>0||e.melee)return false;", 'firing-excl')
    demo = sub1(demo,
        "pool=G.e.filter(e=>!e.dead&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)); }",
        "pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)); }",
        'return-pool-excl')

    # ---- 5. the melee turn + prone clocks, hooked at the ONE turn-end choke ----
    demo = sub1(demo,
        "function tickTurnEnd(){ for(const e of G.e){ if(e.dead)continue; if(e.stun>0){e.stun--; if(e.stun===0)e.stunCooldown=1;} else if(e.stunCooldown>0)e.stunCooldown--; } }",
        """function tickTurnEnd(){ meleeTurnRun();
  for(const e of G.e){ if(e.dead)continue;
    if(e.prone>0){ e.prone--; if(e.prone===0)e.stunCooldown=Math.max(e.stunCooldown,1); continue; }   /* getting up IS the cost */
    if(e.stun>0){e.stun--; if(e.stun===0)e.stunCooldown=1;} else if(e.stunCooldown>0)e.stunCooldown--; }
  updShoveBtn(); }
/* MELEE TURN (Paolo 7/19): blades advance/windup/strike AFTER your action
   resolves (you always act first — locked law). A strike NEVER lands without
   last turn's windup; stun/topple/kill during your turn cancels it. Cover
   does not stop a blade. */
function meleeTurnRun(){ if(G.over)return; G.mTurn=(G.mTurn||0)+1; let dmg=0,who=[];
  for(const e of G.e){ if(e.dead||!e.melee)continue;
    const r=BohemiaMelee.decide(e,G.mTurn);
    if(r.act==='strike'){ e.windup=false;
      if(e.edist<=e.reach+0.01){ const a=e.E.dmg; const d=a[0]+Math.floor(Math.random()*(a[1]-a[0]+1)); dmg+=d; who.push(e.i); } }
    else if(r.act==='windup'){ e.windup=true; }
    else if(r.act==='advance'){ e.edist=r.dist; }
  }
  if(dmg>0){ G.pHP=Math.max(0,G.pHP-dmg); updPlayer(); const _lethal=G.pHP<=0;
    onOffbeat(()=>{ hurtFlash(); sndReturn(); setRead('BLADES IN',who.length+' melee hit you for '+dmg,'#e8593a'); });
    addWound(G); G.steady=0; wagerBust('you took a hit');
    try{parent.postMessage({type:'BOHEMIA_PLAYER_HIT',dmg:dmg,hp:G.pHP},'*');}catch(_e){}
    if(G.pHP<=0)return loseGame(); }
}
/* THE SHOVE (Paolo 7/19, loved + ruled): contextual at point-blank. ALWAYS
   stuns 1 turn (IRON SHOULDER: 2); chance he TOPPLES prone; pushes him back
   3 tiles; a braced man (no-stun-lock) just gets the push. Costs your turn;
   you stay low, so only exposed shooters answer. */
function shoveTarget(){ let best=null;
  for(const e of G.e){ if(e.dead)continue;
    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&(!best||e.edist<best.edist))best=e; }
  return best; }
function updShoveBtn(){ const b=D('shovebtn'); if(!b)return;
  const t=(G.phase==='cover'&&!G.over&&!G.inc)?shoveTarget():null;
  b.style.display=t?'':'none';
  if(t){ const braced=(t.stun>0||t.stunCooldown>0);
    b.textContent='SHOVE '+t.n+(braced?' (braced)':' ('+(G.perkShoulder?'stun 2':'stun 1')+' \\u00b7 '+(G.perkShoulder?50:30)+'%)'); } }
function doShove(){ if(G.phase!=='cover'||G.over||G.inc)return; const t=shoveTarget(); if(!t)return; audio();
  const r=BohemiaMelee.shove(t,!!G.perkShoulder,Math.floor(Math.random()*100));
  if(!r.braced)t.stun=Math.max(t.stun,r.stun);
  t.windup=false;
  t.edist=Math.min(MAX_RANGE,t.edist+r.pushed);
  if(r.topple)t.prone=2;
  setRead(r.braced?'HE BRACED':'SHOVED',
    r.braced?'pushed back — no re-stun until he gets a turn':(t.n+' stunned '+r.stun+' turn'+(r.stun>1?'s':'')+(r.topple?' — AND DOWN':'')),
    r.topple?'#8fe89a':'#8fd0e8');
  sndHit();
  endTurnReturn(false); }""",
        'melee-turn')

    # ---- 6. vital stun also cancels a pending blade windup ----
    demo = sub1(demo, "if(tgt.stunCooldown<=0) tgt.stun=2;            // 2-turn stun, no stun-lock",
        "if(tgt.stunCooldown<=0) tgt.stun=2;            // 2-turn stun, no stun-lock\n    tgt.windup=false;                              // a stun cancels a pending blade strike", 'vital-cancel')

    # ---- 7. chip status: melee states + FORESIGHT perk (movement intent) ----
    demo = sub1(demo,
        "es.innerHTML=rng+(e.dead?'DOWN':e.stun>0?('STUN '+e.stun):fr?'● FIRING':pk?'○ OUT':'· tucked'); } } }",
        """es.innerHTML=rng+(e.dead?'DOWN'
        :e.prone>0?('▼ FLOOR '+e.prone)
        :e.stun>0?('STUN '+e.stun)
        :e.melee?(e.windup?'⚔ STRIKES NEXT'
          :(G.perkForesight?(function(){ const nx=BohemiaMelee.decide(e,(G.mTurn||0)+1);
              return nx.act==='advance'?('→ ADVANCES '+e.adv):nx.act==='windup'?'will WIND UP':'rests'; })()
            :'· closing'))
        :fr?'● FIRING':pk?'○ OUT':'· tucked'); } } }""",
        'chip-status')

    # ---- 8. field draw: melee tint + windup ring + prone flat ----
    demo = sub1(demo,
        "      x.fillStyle=e.stun>0?'#8a7d66':fr?'#e83c28':pk?'#6fc46a':'#9a8a6a';\n      x.beginPath();x.arc(ex,ey,er,0,7);x.fill();\n    }",
        """      x.fillStyle=e.prone>0?'#5a5142':e.stun>0?'#8a7d66':e.melee?'#c06a4a':fr?'#e83c28':pk?'#6fc46a':'#9a8a6a';
      if(e.prone>0){ x.beginPath();x.ellipse(ex,ey+er*0.4,er*1.2,er*0.5,0,0,7);x.fill(); }
      else { x.beginPath();x.arc(ex,ey,er,0,7);x.fill(); }
    }
    if(e.melee&&!e.dead&&e.windup){ const wp=Math.pow(1-_bpmPhase,2);   /* the blade telegraph pulses on the beat */
      x.strokeStyle='rgba(232,176,74,'+(0.5+wp*0.5)+')'; x.lineWidth=2+wp*2;
      x.beginPath();x.arc(ex,ey,er*1.5,0,7);x.stroke(); }""",
        'field-draw')

    # ---- 9. UI: shove button + settings group ----
    demo = sub1(demo, '<button id="waitbtn" class="cbtn">WAIT</button>',
        '<button id="waitbtn" class="cbtn">WAIT</button>\n    <button id="shovebtn" class="cbtn" style="display:none;border-color:#5fbf6a;color:#8fe89a">SHOVE</button>',
        'shove-btn')
    demo = sub1(demo, '<div class="setgrp"><span class="gl">JUICE + FEEL</span>',
        """<div class="setgrp"><span class="gl">MELEE + PERKS (Paolo 7/19 rulings)</span>
    <div class="controls">
      <button id="meleemix">MELEE: SOME</button>
      <button id="perkshoulder">IRON SHOULDER: OFF</button>
      <button id="perkforesight">FORESIGHT: OFF</button>
    </div>
    <div style="font-size:10px;color:#8a7a5a;letter-spacing:1px;line-height:1.5">Blades close on you by weapon (SHIV fast / BAT heavy / SPEAR reach). SHOVE appears at point blank: always stuns 1 (IRON SHOULDER: 2), chance they hit the floor. FORESIGHT shows their next move; windups always show.</div>
  </div>
  <div class="setgrp"><span class="gl">JUICE + FEEL</span>""",
        'settings-group')

    # ---- 10. wiring (appended IIFE at the end of the main script) ----
    demo = sub1(demo, "</script>\n</body>", """
/* MELEE + PERKS wiring (7/19) */
(function(){ const mm=D('meleemix'),ps=D('perkshoulder'),pf=D('perkforesight'),sb=D('shovebtn');
  if(mm)mm.addEventListener('click',()=>{ G.meleeMix=((G.meleeMix==null?1:G.meleeMix)+1)%3;
    mm.textContent='MELEE: '+['NONE','SOME','PACK'][G.meleeMix]; });
  if(ps)ps.addEventListener('click',()=>{ G.perkShoulder=!G.perkShoulder;
    ps.textContent='IRON SHOULDER: '+(G.perkShoulder?'ON':'OFF'); updShoveBtn(); });
  if(pf)pf.addEventListener('click',()=>{ G.perkForesight=!G.perkForesight;
    pf.textContent='FORESIGHT: '+(G.perkForesight?'ON':'OFF'); renderBoard(); });
  if(sb)sb.addEventListener('click',doShove);
  setInterval(updShoveBtn,400);   /* the option follows the fight */
})();
</script>
</body>""", 'wiring')

    return demo


def patch2(demo):
    """v2 (same day): doWait had its OWN inline stun loop and never hit
    tickTurnEnd, so blades never advanced on WAIT turns (caught by the
    chromium drive). Route doWait through the one turn-end choke."""
    if 'MELEE V2 DOWAIT' in demo:
        print('v2 already applied, skipping')
        return demo
    demo = sub1(demo, """\
  for(const e of G.e){ if(e.dead)continue; if(e.stun>0){e.stun--; if(e.stun===0)e.stunCooldown=1;} else if(e.stunCooldown>0)e.stunCooldown--; }
  renderBoard(); updGap(); }
function doPop(){""", """\
  tickTurnEnd();   /* MELEE V2 DOWAIT: waiting is a turn — blades advance through the one choke */
  renderBoard(); updGap(); }
function doPop(){""", 'dowait-choke')
    return demo


def patch3(demo):
    """v3 (same day): the enemy CARDS are retired canon (7/3) — the field is
    the display. FORESIGHT now draws on the FIELD: a green intent arrow when
    a blade will advance next turn, an amber dot when it will wind up."""
    if 'MELEE V3 FORESIGHT FIELD' in demo:
        print('v3 already applied, skipping')
        return demo
    demo = sub1(demo, """\
    if(e.melee&&!e.dead&&e.windup){ const wp=Math.pow(1-_bpmPhase,2);   /* the blade telegraph pulses on the beat */
      x.strokeStyle='rgba(232,176,74,'+(0.5+wp*0.5)+')'; x.lineWidth=2+wp*2;
      x.beginPath();x.arc(ex,ey,er*1.5,0,7);x.stroke(); }""", """\
    if(e.melee&&!e.dead&&e.windup){ const wp=Math.pow(1-_bpmPhase,2);   /* the blade telegraph pulses on the beat */
      x.strokeStyle='rgba(232,176,74,'+(0.5+wp*0.5)+')'; x.lineWidth=2+wp*2;
      x.beginPath();x.arc(ex,ey,er*1.5,0,7);x.stroke(); }
    /* MELEE V3 FORESIGHT FIELD (cards are retired; the field tells you):
       green arrow = he ADVANCES next turn, amber dot = he will WIND UP */
    if(G.perkForesight&&e.melee&&!e.dead&&e.stun<=0&&!(e.prone>0)&&!e.windup){
      const nx=BohemiaMelee.decide(e,(G.mTurn||0)+1);
      if(nx.act==='advance'){ const fa2=Math.atan2(cy-ey,cx-ex);
        x.strokeStyle='rgba(154,208,106,0.8)'; x.lineWidth=2;
        x.beginPath(); x.moveTo(ex+Math.cos(fa2)*er*1.3,ey+Math.sin(fa2)*er*1.3);
        x.lineTo(ex+Math.cos(fa2)*er*2.3,ey+Math.sin(fa2)*er*2.3); x.stroke();
        x.beginPath(); x.fillStyle='rgba(154,208,106,0.8)';
        x.arc(ex+Math.cos(fa2)*er*2.3,ey+Math.sin(fa2)*er*2.3,2.5,0,7); x.fill(); }
      else if(nx.act==='windup'){ x.fillStyle='rgba(232,176,74,0.9)';
        x.beginPath(); x.arc(ex,ey-er*1.9,3,0,7); x.fill(); } }""", 'foresight-field')
    return demo


def patch4(demo):
    """v4 (Paolo 7/19: 'did you fix it so that I can move around now...
    are you just having it to where players are running after me and I
    can't even move'): MOVEMENT lands in the canon demo. Locked canon
    since 6/27 — 'move 1 tile to a new position = 1 turn' — never built.
    MOVE button arms the 3x3 ring; tap a cell = step that way. The whole
    polar world (enemies, corpses) shifts around the player-centered
    camera. Moving out of a blade's reach makes its telegraphed strike
    WHIFF — movement IS the melee dodge."""
    if 'MOVE V4' in demo:
        print('v4 already applied, skipping')
        return demo
    demo = sub1(demo, "function shoveTarget(){", """\
/* MOVE V4 — the world is polar around you; a step transforms every bearing */
function worldShift(vx,vy){
  const mv=o=>{ if(o.ea==null||o.edist==null)return;
    const px=Math.cos(o.ea)*o.edist-vx, py=Math.sin(o.ea)*o.edist-vy;
    o.edist=Math.max(0.6,Math.hypot(px,py)); o.ea=Math.atan2(py,px); };
  for(const e of G.e)mv(e);
  for(const c of (G.corpses||[]))mv(c);
  if(Array.isArray(G.litter))for(const L of G.litter)mv(L);
}
function updMoveUI(){ const b=D('movebtn'); if(!b)return;
  b.textContent=G.moveArm?'MOVE: TAP A CELL':'MOVE';
  b.style.borderColor=G.moveArm?'#5fbf6a':''; b.style.color=G.moveArm?'#8fe89a':''; }
function doMove(d){ if(G.phase!=='cover'||G.over||G.inc)return; audio();
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  const v=DIRS[d], n=Math.hypot(v[0],v[1]);
  worldShift(v[0]/n, v[1]/n);
  G.moveArm=false; updMoveUI();
  G.steady=0;   /* repositioning spends the held stance */
  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }
function shoveTarget(){""", 'move-fns')
    demo = sub1(demo,
        '<button id="shovebtn" class="cbtn" style="display:none;border-color:#5fbf6a;color:#8fe89a">SHOVE</button>',
        '<button id="shovebtn" class="cbtn" style="display:none;border-color:#5fbf6a;color:#8fe89a">SHOVE</button>\n    <button id="movebtn" class="cbtn">MOVE</button>',
        'move-btn')
    demo = sub1(demo,
        "if(Math.abs(x-cxx)<ring*0.45 && Math.abs(y-cyy)<ring*0.45){ audio(); G.pCover[d]=!G.pCover[d]; updGap(); return; } }",
        "if(Math.abs(x-cxx)<ring*0.45 && Math.abs(y-cyy)<ring*0.45){ audio(); if(G.moveArm){ doMove(d); return; } /* MOVE V4: an armed ring cell is a step */ G.pCover[d]=!G.pCover[d]; updGap(); return; } }",
        'move-ring-tap')
    demo = sub1(demo, "if(sb)sb.addEventListener('click',doShove);", """\
if(sb)sb.addEventListener('click',doShove);
  const mvb=D('movebtn'); if(mvb)mvb.addEventListener('click',()=>{ audio();
    G.moveArm=!G.moveArm; updMoveUI();
    if(G.moveArm)setRead('MOVE ARMED','tap one of the 8 cells around you — 1 tile = 1 turn','#8fd0e8'); });""",
        'move-wire')
    return demo


def patch5(demo):
    """v5 (Paolo 7/19, two rulings in one breath):
    1. 'We already have eight cardinal directions to click right next to
       the action button' — the existing move ring (built 7/4 as plumbing
       that only set G.moveIntent) now CALLS doMove directly. One tap =
       one step. The MOVE-and-arm button dies.
    2. 'Shuffled pillars that I can take cover from... a wall pillar' —
       REAL GEOMETRY COVER lands: seeded shuffled pillars are world
       objects; a pillar between you and a shooter IS cover (the locked
       RF4 line-of-fire model, 'hand-set now, geometry later' — this is
       the later). Pillars block movement, cover enemies too, and a shove
       into one slams (65% topple)."""
    if 'PILLAR V5' in demo:
        print('v5 already applied, skipping')
        return demo

    # 1a. ring -> doMove
    demo = sub1(demo,
        "b.addEventListener('click',ev=>{ev.stopPropagation();G.moveIntent=names[i];",
        "b.addEventListener('click',ev=>{ev.stopPropagation();G.moveIntent=names[i];doMove(i);   /* PILLAR V5: the ring IS movement (Paolo) */",
        'ring-domove')
    # 1b. the MOVE button dies
    demo = sub1(demo, '\n    <button id="movebtn" class="cbtn">MOVE</button>', '', 'movebtn-gone')
    demo = sub1(demo, """\
  const mvb=D('movebtn'); if(mvb)mvb.addEventListener('click',()=>{ audio();
    G.moveArm=!G.moveArm; updMoveUI();
    if(G.moveArm)setRead('MOVE ARMED','tap one of the 8 cells around you — 1 tile = 1 turn','#8fd0e8'); });""",
        '', 'movebtn-wire-gone')

    # 2a. geometry helpers + pillar-aware my-cover
    demo = sub1(demo, "function myCoverAgainst(ang){ return !!G.pCover[dirIndex(ang)]; }", """\
function myCoverAgainst(ang,dist){ if(G.pCover[dirIndex(ang)])return true;
  /* PILLAR V5: a pillar on the line to the shooter IS cover (RF4 law, geometry-driven) */
  const md=(dist==null?MAX_RANGE:dist);
  return (G.pillars||[]).some(P=>{ if(P.edist>md||P.edist<0.8)return false;
    let dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; }); }
function pXY(o){ return [Math.cos(o.ea)*o.edist, Math.sin(o.ea)*o.edist]; }
function segNear(ax,ay,bx,by,px,py,r){ const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1e-6;
  let t=((px-ax)*dx+(py-ay)*dy)/L2; t=Math.max(0.08,Math.min(0.92,t));
  return Math.hypot(ax+dx*t-px,ay+dy*t-py)<r; }
function pillarBetweenMe(e){ const exy=pXY(e);
  return (G.pillars||[]).some(P=>{ const pxy=pXY(P); return segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85); }); }
function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=pillarBetweenMe(e)?1:0; } }""",
        'geom-cover')

    # 2b. effective cover = hand toggle OR geometry, everywhere it reads
    demo = sub1(demo, "if(e.stun>0)return true; if(!e.inCover)return true;",
        "if(e.stun>0)return true; if(!(e.inCover||e.gcov))return true;", 'peeking-gcov')
    demo = sub1(demo, "if(!e.inCover){const f=efrac(e); return (f>=0.30&&f<=0.30+fw)||(f>=0.70&&f<=0.70+fw);}",
        "if(!(e.inCover||e.gcov)){const f=efrac(e); return (f>=0.30&&f<=0.30+fw)||(f>=0.70&&f<=0.70+fw);}", 'firing-gcov')
    demo = sub1(demo, "return e.inCover?peeking(e):true; }",
        "return (e.inCover||e.gcov)?peeking(e):true; }", 'hasline-gcov')
    demo = sub1(demo, "if(e.inCover){ const fa=Math.atan2(cy-ey,cx-ex);",
        "if(e.inCover||e.gcov){ const fa=Math.atan2(cy-ey,cx-ex);", 'arc-gcov')
    # main pools pass the shooter's distance so a pillar BEHIND him never counts
    demo = sub1(demo,
        "function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea)); }",
        "function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist)); }",
        'exposed-dist')
    demo = sub1(demo, "const cov=myCoverAgainst(e.ea); const acc=distAccuracy(e)*",
        "const cov=myCoverAgainst(e.ea,e.edist); const acc=distAccuracy(e)*", 'pool-dist')

    # 2c. spawn shuffled pillars each encounter
    demo = sub1(demo, "G.e=[]; const N=G.numEnemies; G.mTurn=0;", """\
G.e=[]; const N=G.numEnemies; G.mTurn=0;
  /* PILLAR V5 (Paolo): shuffled hard cover, world-anchored, reshuffled per encounter */
  G.pillars=[]; { const NP=5+Math.floor(Math.random()*3); let pg=0;
    while(G.pillars.length<NP&&pg++<120){
      const a=Math.random()*Math.PI*2, d=3+Math.random()*18, r=0.9+Math.random()*0.8;
      const nx2=Math.cos(a)*d, ny2=Math.sin(a)*d;
      if(G.pillars.some(P=>{ const q=pXY(P); return Math.hypot(q[0]-nx2,q[1]-ny2)<3.2; }))continue;
      G.pillars.push({ea:a,edist:d,r:r}); } }""",
        'pillar-spawn')

    # 2d. pillars ride worldShift; cover refreshes when anything moves
    demo = sub1(demo, "for(const c of (G.corpses||[]))mv(c);",
        "for(const c of (G.corpses||[]))mv(c);\n  for(const P of (G.pillars||[]))mv(P);", 'pillar-shift')
    demo = sub1(demo, "function tickTurnEnd(){ meleeTurnRun();",
        "function tickTurnEnd(){ meleeTurnRun(); updateGeomCover();", 'tick-gcov')
    demo = sub1(demo, """\
  const v=DIRS[d], n=Math.hypot(v[0],v[1]);
  worldShift(v[0]/n, v[1]/n);""", """\
  const v=DIRS[d], n=Math.hypot(v[0],v[1]);
  const sx=v[0]/n, sy=v[1]/n;
  if((G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.45; })){
    setRead('BLOCKED','a pillar is there','#8a7d66'); return; }   // OCCUPANCY: solid is solid
  worldShift(sx,sy); updateGeomCover();""",
        'move-collide')

    # 2e. shove into a pillar = the wall slam
    demo = sub1(demo, """\
  t.edist=Math.min(MAX_RANGE,t.edist+r.pushed);
  if(r.topple)t.prone=2;""", """\
  { let nd=Math.min(MAX_RANGE,t.edist+r.pushed), slam=false;
    for(const P of (G.pillars||[])){ const q=pXY(P);
      let dA=Math.abs(((t.ea-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(dA<0.5 && P.edist>t.edist-0.2 && P.edist<nd+P.r){ nd=Math.max(t.edist,P.edist-P.r-0.3); slam=true; } }
    t.edist=nd;
    if(slam&&!r.braced&&Math.random()<0.65){ t.prone=2; r.topple=true; }   /* PILLAR SLAM: walls make men fall */
    if(slam)setRead('INTO THE PILLAR',t.n+' ate the stone','#8fe89a'); }
  if(r.topple)t.prone=2;""",
        'shove-slam')

    # 2f. render pillars (tan family, sky-lit top per the 45 law, zero purple)
    demo = sub1(demo, "  // my 3x3 self-cover ring", """\
  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const s=ring*(0.5+P.r*0.35);
    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();
    x.fillStyle='#6e604a'; x.fillRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6);
    x.fillStyle='#94836a'; x.beginPath(); x.ellipse(pxs,pys-s*1.15,s*0.55,s*0.2,0,0,7); x.fill();
    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6); }
  // my 3x3 self-cover ring""",
        'pillar-render')

    # 2g. fresh geometry at encounter birth
    demo = sub1(demo, "function setupCombat(){ setupEnemies(); buildBoard();",
        "function setupCombat(){ setupEnemies(); updateGeomCover(); buildBoard();", 'setup-gcov')
    return demo


def patch6(demo):
    """v6 (Paolo 7/19): (1) 'I need to see each tile... add the street' —
    the combat floor becomes a readable TILE BOARD in street anatomy
    (asphalt tiles + double-yellow median + white lane dashes, LINE COLOR
    law), WORLD-ANCHORED so it slides exactly one tile per step — the
    board is the movement ruler. (2) 'when you shove people they get
    pushed back one tile' — shove push = 1 tile (was 3); LONG ARM perk
    pushes 2. (3) full-tile diagonal steps (Chebyshev) so the board is
    honest."""
    if 'STREET FLOOR V6' in demo:
        print('v6 already applied, skipping')
        return demo

    # 1. shove push = 1 tile, LONG ARM perk = 2 (melee core)
    demo = sub1(demo, """\
  shove:function(e,perk,roll){
    var out={stun:0,pushed:3,topple:false,braced:false};
    if(e.stun>0||e.stunCooldown>0)out.braced=true;
    else out.stun=perk?2:1;
    out.topple=roll<(perk?50:30);
    return out;
  },""", """\
  shove:function(e,perk,roll){
    var P=(perk&&typeof perk==='object')?perk:{shoulder:!!perk};
    var out={stun:0,pushed:(P.longarm?2:1),topple:false,braced:false};   /* Paolo 7/19: pushed back ONE tile; LONG ARM perk: two */
    if(e.stun>0||e.stunCooldown>0)out.braced=true;
    else out.stun=P.shoulder?2:1;
    out.topple=roll<(P.shoulder?50:30);
    return out;
  },""", 'shove-push1')
    demo = sub1(demo,
        "const r=BohemiaMelee.shove(t,!!G.perkShoulder,Math.floor(Math.random()*100));",
        "const r=BohemiaMelee.shove(t,{shoulder:!!G.perkShoulder,longarm:!!G.perkLongarm},Math.floor(Math.random()*100));",
        'shove-call')
    demo = sub1(demo, '<button id="perkforesight">FORESIGHT: OFF</button>',
        '<button id="perklongarm">LONG ARM: OFF</button>\n      <button id="perkforesight">FORESIGHT: OFF</button>',
        'longarm-btn')
    demo = sub1(demo, "const mm=D('meleemix'),ps=D('perkshoulder'),pf=D('perkforesight'),sb=D('shovebtn');",
        "const mm=D('meleemix'),ps=D('perkshoulder'),pf=D('perkforesight'),sb=D('shovebtn'),pl=D('perklongarm');",
        'longarm-const')
    demo = sub1(demo, "if(pf)pf.addEventListener('click',()=>{ G.perkForesight=!G.perkForesight;",
        """if(pl)pl.addEventListener('click',()=>{ G.perkLongarm=!G.perkLongarm;
    pl.textContent='LONG ARM: '+(G.perkLongarm?'ON':'OFF'); });
  if(pf)pf.addEventListener('click',()=>{ G.perkForesight=!G.perkForesight;""",
        'longarm-wire')

    # 2. full-tile steps, diagonals included
    demo = sub1(demo, """\
  const v=DIRS[d], n=Math.hypot(v[0],v[1]);
  const sx=v[0]/n, sy=v[1]/n;""", """\
  const v=DIRS[d];
  const sx=v[0], sy=v[1];   /* full tile steps, diagonals included (Chebyshev) — the board reads in tiles */""",
        'chebyshev')

    # 3. the world remembers how far you have walked (the floor's anchor)
    demo = sub1(demo, "function worldShift(vx,vy){",
        "function worldShift(vx,vy){\n  G.worldOff=G.worldOff||{x:0,y:0}; G.worldOff.x+=vx; G.worldOff.y+=vy;",
        'world-off')

    # 4. the street tile floor, world-anchored, drawn under everything in the field
    demo = sub1(demo, """\
  const rMin=ring*1.8, rMax=Math.min(W,H)*0.85;   /* the field is BIGGER than the screen now; pan + zoom navigate it */""", """\
  const rMin=ring*1.8, rMax=Math.min(W,H)*0.85;   /* the field is BIGGER than the screen now; pan + zoom navigate it */
  /* STREET FLOOR V6 (Paolo: "I need to see each tile... add the street"):
     a readable tile board in street anatomy. World-anchored: it slides
     exactly one tile per step, so the board IS the movement ruler.
     LINE COLOR law: yellow = direction split (double median), white = lane. */
  { G.worldOff=G.worldOff||{x:0,y:0}; const t=ring;
    const offx=G.worldOff.x, offy=G.worldOff.y;
    const gx0=Math.floor(offx-(cx/t))-1, gx1=Math.floor(offx+((W-cx)/t))+1;
    const gy0=Math.floor(offy-(cy/t))-1, gy1=Math.floor(offy+((H-cy)/t))+1;
    for(let wy=gy0; wy<=gy1; wy++){ for(let wx=gx0; wx<=gx1; wx++){
      const sx2=cx+(wx-offx)*t, sy2=cy+(wy-offy)*t;
      const h=(Math.imul(wx|0,73856093)^Math.imul(wy|0,19349663))>>>0;
      const j=(h%7)-3;                                    /* gentle tone jitter, never confetti */
      const g=50+j*3;
      x.fillStyle='rgb('+(g+16)+','+(g+9)+','+(g+1)+')';   /* asphalt brown-grey */
      x.fillRect(sx2,sy2,t+1,t+1); } }
    x.strokeStyle='rgba(18,14,10,0.6)'; x.lineWidth=1;      /* the grid he can read */
    for(let wx=gx0; wx<=gx1; wx++){ const sx2=Math.round(cx+(wx-offx)*t)+0.5;
      x.beginPath(); x.moveTo(sx2,0); x.lineTo(sx2,H); x.stroke(); }
    for(let wy=gy0; wy<=gy1; wy++){ const sy2=Math.round(cy+(wy-offy)*t)+0.5;
      x.beginPath(); x.moveTo(0,sy2); x.lineTo(W,sy2); x.stroke(); }
    /* the street story: double-yellow median at world x=2.5, white lane dashes 4 tiles out */
    const medX=cx+(2.5-offx)*t;
    if(medX>-t&&medX<W+t){ x.fillStyle='rgba(184,160,40,0.55)';
      x.fillRect(medX-3,0,2.4,H); x.fillRect(medX+1,0,2.4,H); }
    x.fillStyle='rgba(215,205,185,0.38)';
    for(const lane of [-1.5,6.5]){ const lx=cx+(lane-offx)*t;
      if(lx<-t||lx>W+t)continue;
      const dashLen=t*1.2, gap=t*0.9;
      let sy3=-((offy*t)%(dashLen+gap));
      for(let yy=sy3; yy<H; yy+=dashLen+gap)x.fillRect(lx-1.4,yy,2.8,dashLen); }
  }""",
        'street-floor')
    return demo


def patch7(demo):
    """v7 (Paolo 7/19, two rulings):
    1. 'the cover tiles... magical cover in front of me... it has to be
       the same tiles that you have on the grid' — the magic 3x3 arcs are
       DEAD. Tapping a cell now places/removes a REAL cover block ON that
       grid tile, identical rules to shuffled pillars (blocks lines,
       blocks steps, slammable). Cover is geometry only. And the whole
       field goes GRID TRUE: fieldPos maps 1 tile of distance to 1 board
       cell, so enemies, pillars, corpses and the floor share ONE ruler
       (spawn band compressed to the visible board; far snipers return
       with the world model).
    2. 'enemies need to have a red line on you for two turns before they
       can shoot' — TWO-TURN RED LINE law: a gun's first turn on you is
       ACQUIRING (bright warning line, cannot fire); it fires only if the
       bead survives to the next turn. Break the line (move, cover, stun,
       kill) and the clock resets."""
    if 'GRID TRUE V7' in demo:
        print('v7 already applied, skipping')
        return demo

    # 1a. one ruler: tile-true positions
    demo = sub1(demo, """\
  const rr=rMin+Math.max(0,Math.min(1,(e.edist-PT_BLANK)/(MAX_RANGE-PT_BLANK)))*(rMax-rMin);
  return [cx+Math.cos(e.ea)*rr, cy+Math.sin(e.ea)*rr]; }""", """\
  const rr=e.edist*ring;   /* GRID TRUE V7: one tile of distance = one board cell, everything on the same ruler */
  return [cx+Math.cos(e.ea)*rr, cy+Math.sin(e.ea)*rr]; }""", 'tile-true')
    demo = sub1(demo,
        "                             : (PT_BLANK+8)+Math.random()*(MAX_RANGE-PT_BLANK-8); // mid..far: never point blank, clear gap from the close one",
        "                             : (PT_BLANK+2.5)+Math.random()*8; // GRID TRUE V7: the fight lives on the visible board (~6.5-14.5 tiles); long-range returns with the world model",
        'spawn-band')

    # 1b. pillars sit ON tiles
    demo = sub1(demo, """\
      const a=Math.random()*Math.PI*2, d=3+Math.random()*18, r=0.9+Math.random()*0.8;
      const nx2=Math.cos(a)*d, ny2=Math.sin(a)*d;
      if(G.pillars.some(P=>{ const q=pXY(P); return Math.hypot(q[0]-nx2,q[1]-ny2)<3.2; }))continue;
      G.pillars.push({ea:a,edist:d,r:r}); } }""", """\
      const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*7;
      const nx2=Math.round(Math.cos(a0)*d0-0.5)+0.5, ny2=Math.round(Math.sin(a0)*d0-0.5)+0.5;   /* cover sits ON a tile */
      if(Math.hypot(nx2,ny2)<1.5)continue;
      if(G.pillars.some(P=>{ const q=pXY(P); return Math.abs(q[0]-nx2)<0.9&&Math.abs(q[1]-ny2)<0.9; }))continue;
      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55}); } }""",
        'pillar-snap')
    demo = sub1(demo, "const s=ring*(0.5+P.r*0.35);", "const s=ring*0.62;   /* a block fills its tile */", 'pillar-size')

    # 1c. the magic arcs die; a tapped cell places a REAL block on that tile
    demo = sub1(demo, "function myCoverAgainst(ang,dist){ if(G.pCover[dirIndex(ang)])return true;",
        "function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */",
        'arcs-dead')
    demo = sub1(demo,
        "if(Math.abs(x-cxx)<ring*0.45 && Math.abs(y-cyy)<ring*0.45){ audio(); if(G.moveArm){ doMove(d); return; } /* MOVE V4: an armed ring cell is a step */ G.pCover[d]=!G.pCover[d]; updGap(); return; } }",
        """if(Math.abs(x-cxx)<ring*0.45 && Math.abs(y-cyy)<ring*0.45){ audio();
      /* V7 (Paolo): tapping a cell places/removes a REAL cover block ON that tile */
      const tx3=DIRS[d][0], ty3=DIRS[d][1];
      G.pillars=G.pillars||[];
      const at=G.pillars.findIndex(P=>{ const q=pXY(P); return Math.abs(q[0]-tx3)<0.45&&Math.abs(q[1]-ty3)<0.45; });
      if(at>=0)G.pillars.splice(at,1);
      else G.pillars.push({ea:Math.atan2(ty3,tx3),edist:Math.hypot(tx3,ty3),r:0.55,placed:true});
      updateGeomCover(); updGap(); return; } }""",
        'cell-places-block')
    demo = sub1(demo, "const cxx=cx+DIRS[d][0]*ring, cyy=cy+DIRS[d][1]*ring, up=G.pCover[d];",
        "const cxx=cx+DIRS[d][0]*ring, cyy=cy+DIRS[d][1]*ring, up=false;   /* V7: no magic arcs; placed blocks draw as real cover */",
        'ring-render')

    # 2. TWO-TURN RED LINE
    demo = sub1(demo, ",prone:0,windup:false,adv:", ",prone:0,windup:false,acq:0,adv:", 'acq-field')
    demo = sub1(demo,
        "const pool=exposedToMe(); let hits=0,dmg=0,hitIdx=[];       // tucked: only enemies you can't cover from reach you",
        "const pool=exposedToMe().filter(e=>(e.acq||0)>=1); let hits=0,dmg=0,hitIdx=[];   // TWO-TURN RED LINE (Paolo 7/19); tucked: only enemies you can't cover from reach you",
        'wait-acq')
    demo = sub1(demo,
        "pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)); }",
        "pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)&&(e.acq||0)>=1); }",
        'engaged-acq')
    demo = sub1(demo, "  else {       // you stayed tucked -> only enemies you have NO cover toward can reach you\n    pool=exposedToMe(); }",
        "  else {       // you stayed tucked -> only enemies you have NO cover toward can reach you\n    pool=exposedToMe().filter(e=>(e.acq||0)>=1); }",
        'tucked-acq')
    demo = sub1(demo, "function tickTurnEnd(){ meleeTurnRun(); updateGeomCover();", """\
function tickTurnEnd(){ meleeTurnRun(); updateGeomCover();
  /* TWO-TURN RED LINE (Paolo 7/19): a gun must hold its bead for two turns
     before it may fire — the first turn is ACQUIRING, your one-turn warning.
     Break the line (move, cover, stun, kill) and his clock resets. */
  for(const e of G.e){ if(e.dead||e.melee){ e.acq=0; continue; }
    const bead=e.stun<=0&&!(e.prone>0)&&(peeking(e)||firing(e));
    e.acq=bead?Math.min(9,(e.acq||0)+1):0; }""",
        'acq-tick')
    demo = sub1(demo,
        "for(const e of G.e){ if(e.dead)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e); const red=out&&!myCoverAgainst(e.ea);",
        """for(const e of G.e){ if(e.dead)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e);
    const hot=out&&!myCoverAgainst(e.ea,e.edist);
    const red=hot&&(e.melee||(e.acq||0)>=1);
    const acqing=hot&&!red;   /* first-turn bead: the warning line */""",
        'line-acq')
    demo = sub1(demo,
        "let col,w; if(red){col='rgba(232,60,40,0.15)';w=2;} else if(out){col='rgba(222,150,60,0.09)';w=1.4;}",
        "let col,w; if(red){col='rgba(232,60,40,0.15)';w=2;} else if(acqing){col='rgba(232,140,40,0.32)';w=2;} else if(out){col='rgba(222,150,60,0.09)';w=1.4;}",
        'line-colors')
    return demo


def patch8(demo):
    """v8 (Paolo 7/19, furious and right): the ghost tap-cells around the
    player did NOT sit on the painted board — the floor's lines ran
    through the player's position, so cells straddled tiles by half a
    tile. GRID LOCK: the player stands in the CENTER of a painted cell.
    Floor cells are centered on integer world coords (boundaries at
    half-integers), pillars snap to integer centers, and the ghost cell
    is drawn as EXACTLY the painted tile it sits on. One grid, no lies."""
    if 'GRID LOCK V8' in demo:
        print('v8 already applied, skipping')
        return demo
    demo = sub1(demo, "      const sx2=cx+(wx-offx)*t, sy2=cy+(wy-offy)*t;",
        "      const sx2=cx+(wx-offx-0.5)*t, sy2=cy+(wy-offy-0.5)*t;   /* cells CENTERED on integers — the player stands mid-cell */",
        'floor-center')
    demo = sub1(demo, "    for(let wx=gx0; wx<=gx1; wx++){ const sx2=Math.round(cx+(wx-offx)*t)+0.5;",
        "    for(let wx=gx0; wx<=gx1; wx++){ const sx2=Math.round(cx+(wx-offx+0.5)*t)+0.5;",
        'lines-x')
    demo = sub1(demo, "    for(let wy=gy0; wy<=gy1; wy++){ const sy2=Math.round(cy+(wy-offy)*t)+0.5;",
        "    for(let wy=gy0; wy<=gy1; wy++){ const sy2=Math.round(cy+(wy-offy+0.5)*t)+0.5;",
        'lines-y')
    demo = sub1(demo,
        "      const nx2=Math.round(Math.cos(a0)*d0-0.5)+0.5, ny2=Math.round(Math.sin(a0)*d0-0.5)+0.5;   /* cover sits ON a tile */",
        "      const nx2=Math.round(Math.cos(a0)*d0), ny2=Math.round(Math.sin(a0)*d0);   /* cover sits ON a tile (integer centers, same grid as the board) */",
        'pillar-int')
    demo = sub1(demo,
        "    x.beginPath();x.rect(cxx-ring*0.42,cyy-ring*0.42,ring*0.84,ring*0.84);x.fill();x.stroke();",
        "    x.beginPath();x.rect(cxx-ring*0.5+1.5,cyy-ring*0.5+1.5,ring-3,ring-3);x.fill();x.stroke();   /* GRID LOCK V8: the ghost cell IS the painted tile */",
        'ghost-is-tile')
    return demo


def patch9(demo):
    """v9 (Paolo 7/19): (1) 'the dial minigame should be the same tile
    shit as the previous screen, same location, zoomed in' — the aim
    phase's stand-in world dies; the REAL board (street tiles, pillars,
    bodies) renders behind the dial, zoomed about the player so the man
    you're shooting is the man on the board. (2) 'the power of who to
    shoot next' — tap any enemy (blades included) to SELECT him as the
    next target; auto-pick remains the fallback; tapping the selected man
    again toggles his cover (authoring layer preserved). Also settles the
    6/27 open fork: manual targeting, ruled."""
    if 'ZOOMED BOARD V9' in demo:
        print('v9 already applied, skipping')
        return demo

    # 1. the dial happens ON the board
    demo = sub1(demo, """\
  // ---- minimal stand-in WORLD so the camera has somewhere to go ----
  // crude ground band + the enemy marker (real sprites/world drop in here later)
  drawStandInWorld(ctx,cx,cy,base,RAD,S);""", """\
  // ---- ZOOMED BOARD V9 (Paolo): the dial happens ON the same tiles, zoomed in.
  //      The stand-in world is dead; the aim backdrop IS the field, scaled about
  //      the player so the man under the dial is the man on the board.
  { const ring0=Math.min(W,H)*0.085; const tgtE=G.e[G.fireTarget];
    const zb=tgtE?Math.max(0.9,Math.min(3.2,(RAD*1.18)/(Math.max(1.2,tgtE.edist)*ring0))):2.0;
    ctx.save();
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    ctx.globalAlpha=0.85;                                   /* the board carries the scene; the dial stays boss */
    drawField(ctx,W,H,cx,cy);
    ctx.globalAlpha=1; ctx.restore(); }""",
        'zoomed-board')

    # 2. the power of who to shoot next
    demo = sub1(demo, """\
function modePool(){ if(G.engageMode==='shoot') return exposedToMe();
  return G.e.filter(e=>!e.dead&&e.stun<=0&&peeking(e)); }
function pickTarget(){ const pool=modePool(); if(!pool.length)return -1;
  let b=-1,bd=1e9; for(const e of pool){ const sc=(G.engageMode==='shoot'?e.edist:e.hp); if(sc<bd){bd=sc;b=e.i;} } return b; }""", """\
function modePool(){
  /* TARGET SELECT V9: blades are always in the pool when visible (Paolo:
     "shoot the melee attacker first"), and a stunned/prone man is a
     TARGET — he is the easy dial you manufactured. */
  const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
  if(G.engageMode==='shoot') return exposedToMe().concat(mel);
  return G.e.filter(e=>!e.dead&&peeking(e)); }
function pickTarget(){ const pool=modePool(); if(!pool.length)return -1;
  if(G.selTarget!=null){ const s=pool.find(e=>e.i===G.selTarget); if(s)return s.i; }   /* your pick rules; auto is the fallback */
  let b=-1,bd=1e9; for(const e of pool){ const sc=(G.engageMode==='shoot'?e.edist:e.hp); if(sc<bd){bd=sc;b=e.i;} } return b; }""",
        'manual-target')
    demo = sub1(demo, """\
  for(let i=0;i<G.e.length;i++){ const e=G.e[i]; if(e.dead||!pos[i])continue;
    if(Math.hypot(x-pos[i][0],y-pos[i][1])<ring*0.5){ audio(); e.inCover=!e.inCover; e.coverLocked=true; renderBoard(); updGap(); return; } }""", """\
  for(let i=0;i<G.e.length;i++){ const e=G.e[i]; if(e.dead||!pos[i])continue;
    if(Math.hypot(x-pos[i][0],y-pos[i][1])<ring*0.5){ audio();
      /* TARGET SELECT V9 (Paolo): first tap SELECTS him as your next shot;
         tapping the selected man again toggles his cover (authoring stays). */
      if(G.selTarget!==e.i){ G.selTarget=e.i;
        setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a'); }
      else { e.inCover=!e.inCover; e.coverLocked=true; }
      renderBoard(); updGap(); return; } }""",
        'tap-select')
    demo = sub1(demo, "G.e=[]; const N=G.numEnemies; G.mTurn=0;",
        "G.e=[]; const N=G.numEnemies; G.mTurn=0; G.selTarget=null;", 'sel-reset')
    demo = sub1(demo, """\
      else if(nx.act==='windup'){ x.fillStyle='rgba(232,176,74,0.9)';
        x.beginPath(); x.arc(ex,ey-er*1.9,3,0,7); x.fill(); } }""", """\
      else if(nx.act==='windup'){ x.fillStyle='rgba(232,176,74,0.9)';
        x.beginPath(); x.arc(ex,ey-er*1.9,3,0,7); x.fill(); } }
    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }""",
        'sel-ring')
    return demo


def patch10(demo):
    """v10 (Paolo 7/20: 'you literally slapped it on top of it instead of
    it being what it actually is'): ONE SCENE. v9 layered the board UNDER
    the dial stage, so two worlds drew at once (field player + pose-
    silhouette needle, clutter cells, dimmed tiles, target not under the
    reticle because of the zoom clamp). Now: during aim the zoomed board
    IS the stage — exact zoom puts the real target token precisely at the
    wedge rim where the needle sweeps; the field's player token hides
    (the sweeping pose silhouette IS you); ghost cells and threat lines
    stay out of the shot; full opacity. Also: corpses join the grid-true
    mapping (they were still on the old nonlinear radius)."""
    if 'ONE SCENE V10' in demo:
        print('v10 already applied, skipping')
        return demo

    demo = sub1(demo, "function drawField(x,W,H,cx,cy){", "function drawField(x,W,H,cx,cy,aimo){", 'field-sig')

    # threat lines: not during the dial
    demo = sub1(demo, """\
  for(const e of G.e){ if(e.dead)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e);
    const hot=out&&!myCoverAgainst(e.ea,e.edist);
    const red=hot&&(e.melee||(e.acq||0)>=1);
    const acqing=hot&&!red;   /* first-turn bead: the warning line */""", """\
  if(!aimo)for(const e of G.e){ if(e.dead)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e);
    const hot=out&&!myCoverAgainst(e.ea,e.edist);
    const red=hot&&(e.melee||(e.acq||0)>=1);
    const acqing=hot&&!red;   /* first-turn bead: the warning line */""",
        'lines-aimo')

    # ghost cells: not during the dial
    demo = sub1(demo, """\
  // my 3x3 self-cover ring
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];""", """\
  // my 3x3 self-cover ring (never during the dial — the scene stays clean)
  if(!aimo){
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];""",
        'cells-aimo-open')
    demo = sub1(demo, """\
      x.beginPath();x.arc(cxx,cyy,ring*0.3,ang-0.85,ang+0.85);x.stroke(); } }
  // me: the pers""", """\
      x.beginPath();x.arc(cxx,cyy,ring*0.3,ang-0.85,ang+0.85);x.stroke(); } } }
  // me: the pers""",
        'cells-aimo-close')

    # the field player hides during aim — the sweeping pose IS you
    demo = sub1(demo, """\
// me: the person, same size as every other human on the field
  if(SPR.ready&&SPR.cv.S){""", """\
// me: the person, same size as every other human on the field
  if(aimo){ /* ONE SCENE: during the dial the sweeping pose IS you — no duplicate body */ }
  else if(SPR.ready&&SPR.cv.S){""",
        'player-aimo')

    # corpses join the grid-true ruler
    demo = sub1(demo,
        "    const rr=rMin+Math.max(0,Math.min(1,(c.edist-PT_BLANK)/(MAX_RANGE-PT_BLANK)))*(rMax-rMin);",
        "    const rr=c.edist*ring;   /* grid-true: the dead lie on the same ruler as the living */",
        'corpse-grid')

    # exact zoom, full opacity, one scene
    demo = sub1(demo, """\
  { const ring0=Math.min(W,H)*0.085; const tgtE=G.e[G.fireTarget];
    const zb=tgtE?Math.max(0.9,Math.min(3.2,(RAD*1.18)/(Math.max(1.2,tgtE.edist)*ring0))):2.0;
    ctx.save();
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    ctx.globalAlpha=0.85;                                   /* the board carries the scene; the dial stays boss */
    drawField(ctx,W,H,cx,cy);
    ctx.globalAlpha=1; ctx.restore(); }""", """\
  { /* ONE SCENE V10 (ZOOMED BOARD V9 corrected): EXACT zoom — the real
       target token stands precisely at RAD*1.18 where the needle sweeps
       and the reticle locks. No dimming, no duplicates: this IS the shot. */
    const ring0=Math.min(W,H)*0.085; const tgtE=G.e[G.fireTarget];
    const zb=tgtE?Math.max(0.35,Math.min(3.6,(RAD*1.18)/(Math.max(0.8,tgtE.edist)*ring0))):2.0;
    ctx.save();
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    drawField(ctx,W,H,cx,cy,{dial:true});
    ctx.restore(); }""",
        'one-scene')
    return demo


def patch11(demo):
    """v11 (Paolo 7/20: 'you want to change the size of the shit...
    integrate it better'): BOARD BODY. The full-body pose silhouette was
    the standalone demo's needle and it can never match the board's
    scale. The 6/28 LOCKED canon already says the answer: no separate
    shooting pose — the WORLD SPRITE stays, and the combat ARM becomes
    the dial, pinned at the shoulder. So: the field player sprite stays
    visible during the dial (he IS you, board scale), and the needle is
    an arm+weapon drawn at board scale from his shoulder. Ghost fan =
    faint arm echoes. Wedge/zones/reticle untouched (the exact zoom
    already lands the target on the rim)."""
    if 'BOARD BODY V11' in demo:
        print('v11 already applied, skipping')
        return demo

    # the field player IS you, dial included
    demo = sub1(demo, """\
  if(aimo){ /* ONE SCENE: during the dial the sweeping pose IS you — no duplicate body */ }
  else if(SPR.ready&&SPR.cv.S){""", """\
  if(SPR.ready&&SPR.cv.S){   /* BOARD BODY V11: the field sprite IS you, dial included */""",
        'player-back')

    # remember the aim zoom so the arm can live at board scale
    demo = sub1(demo, """\
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    drawField(ctx,W,H,cx,cy,{dial:true});""", """\
    G._zb=zb;   /* the arm needle reads this to live at board scale */
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    drawField(ctx,W,H,cx,cy,{dial:true});""",
        'zb-out')

    # the arm needle (board scale), replacing the pose silhouette
    demo = sub1(demo, "function draw(){", """\
/* BOARD BODY V11: the needle is an ARM at board scale, pinned at the field
   player's shoulder — the 6/28 locked canon ('the combat arm becomes part
   of the dial'), finally literal on the board. */
function drawArmNeedle(c2,px,py,ang,L,al){
  const sx=px, sy=py-L*0.42;
  const hx=sx+Math.cos(ang)*L, hy=sy+Math.sin(ang)*L;
  c2.save(); c2.globalAlpha=al;
  c2.strokeStyle='#241f18'; c2.lineWidth=Math.max(3,L*0.16); c2.lineCap='round';
  c2.beginPath(); c2.moveTo(sx,sy); c2.lineTo(hx,hy); c2.stroke();
  c2.strokeStyle='#caa07a'; c2.lineWidth=Math.max(2,L*0.10);
  c2.beginPath(); c2.moveTo(sx+Math.cos(ang)*L*0.55,sy+Math.sin(ang)*L*0.55); c2.lineTo(hx,hy); c2.stroke();
  const gl=L*0.45;
  c2.strokeStyle='#3a3632'; c2.lineWidth=Math.max(2.5,L*0.13); c2.lineCap='butt';
  c2.beginPath(); c2.moveTo(hx,hy); c2.lineTo(hx+Math.cos(ang)*gl,hy+Math.sin(ang)*gl); c2.stroke();
  c2.restore();
  return [hx,hy,gl];
}
function draw(){""",
        'arm-needle-fn')

    demo = sub1(demo, """\
  // ---- GHOST FAN: faint echo of the FULL pose (both arms + weapon) sweeping the wedge ----
  for(let i=8;i>=1;i--){
    const ga=base + G.angleTrail(i);
    drawPose(ctx,cx,cy,ga,S,0.005*i,true);
  }""", """\
  // ---- GHOST FAN (BOARD BODY V11): faint echoes of the ARM sweeping the wedge ----
  const ARML=Math.min(W,H)*0.085*(G._zb||2)*1.05;   /* one arm ≈ one board tile at the current zoom */
  for(let i=8;i>=1;i--){
    const ga=base + G.angleTrail(i);
    drawArmNeedle(ctx,cx,cy,ga,ARML,0.045*i/8);
  }""",
        'ghost-arm')

    demo = sub1(demo, """\
  body(ctx,pcx,pcy,S);
  const [hx,hy,gl]=drawPose(ctx,pcx,pcy,ang,S,1,false);""", """\
  const [hx,hy,gl]=drawArmNeedle(ctx,pcx,pcy,ang,ARML,1);   /* BOARD BODY: your sprite stands, the arm swings */""",
        'live-arm')
    return demo


def patch12(demo):
    """v12 (same hour, finishing v11's integration): (1) the street floor's
    tile bounds ignored the aim zoom, so zoom-out shots showed a floating
    floor rectangle in the void — bounds now expand by 1/zb and the
    median/lane/grid strokes overdraw generously. (2) the aim camera is
    PINNED each non-killshot frame (no stale killshot offsets) and biased
    35% toward the target so shooter and target both sit comfortably on
    screen — the whole scene (field + instrument) shifts together through
    the one cam transform."""
    if 'AIM CAM PIN V12' in demo:
        print('v12 already applied, skipping')
        return demo

    demo = sub1(demo, """\
    G._zb=zb;   /* the arm needle reads this to live at board scale */
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    drawField(ctx,W,H,cx,cy,{dial:true});""", """\
    G._zb=zb;   /* the arm needle reads this to live at board scale */
    /* AIM CAM PIN V12: no stale killshot offsets; bias the whole scene
       toward the target so shooter and target share the frame. */
    if(!G.ks){ G.cam.zoom=1;
      G.cam.x=W/2+Math.cos(base)*RAD*0.35;
      G.cam.y=H/2+Math.sin(base)*RAD*0.35; }
    ctx.translate(cx,cy); ctx.scale(zb,zb); ctx.translate(-cx,-cy);
    drawField(ctx,W,H,cx,cy,{dial:true,zb:zb});""",
        'cam-pin')

    demo = sub1(demo, """\
    const gx0=Math.floor(offx-(cx/t))-1, gx1=Math.floor(offx+((W-cx)/t))+1;
    const gy0=Math.floor(offy-(cy/t))-1, gy1=Math.floor(offy+((H-cy)/t))+1;""", """\
    const spanF=(aimo&&aimo.zb&&aimo.zb<1)?1/aimo.zb:1;   /* zoom-out shots need a wider board */
    const gx0=Math.floor(offx-(cx/t)*spanF)-1, gx1=Math.floor(offx+((W-cx)/t)*spanF)+1;
    const gy0=Math.floor(offy-(cy/t)*spanF)-1, gy1=Math.floor(offy+((H-cy)/t)*spanF)+1;""",
        'floor-span')
    demo = sub1(demo, "      x.beginPath(); x.moveTo(sx2,0); x.lineTo(sx2,H); x.stroke(); }",
        "      x.beginPath(); x.moveTo(sx2,-H*2); x.lineTo(sx2,H*3); x.stroke(); }", 'vline-span')
    demo = sub1(demo, "      x.beginPath(); x.moveTo(0,sy2); x.lineTo(W,sy2); x.stroke(); }",
        "      x.beginPath(); x.moveTo(-W*2,sy2); x.lineTo(W*3,sy2); x.stroke(); }", 'hline-span')
    demo = sub1(demo, "    if(medX>-t&&medX<W+t){ x.fillStyle='rgba(184,160,40,0.55)';\n      x.fillRect(medX-3,0,2.4,H); x.fillRect(medX+1,0,2.4,H); }",
        "    if(medX>-t*20&&medX<W+t*20){ x.fillStyle='rgba(184,160,40,0.55)';\n      x.fillRect(medX-3,-H*2,2.4,H*5); x.fillRect(medX+1,-H*2,2.4,H*5); }", 'median-span')
    demo = sub1(demo, """\
      let sy3=-((offy*t)%(dashLen+gap));
      for(let yy=sy3; yy<H; yy+=dashLen+gap)x.fillRect(lx-1.4,yy,2.8,dashLen); }""", """\
      let sy3=-H*2-((offy*t)%(dashLen+gap));
      for(let yy=sy3; yy<H*3; yy+=dashLen+gap)x.fillRect(lx-1.4,yy,2.8,dashLen); }""",
        'dash-span')
    return demo


def patch13(demo):
    """v13 (Paolo 7/20, three asks):
    1. 'it broke when I got shot' — could not reproduce headless, so fix
       the CLASS: the rAF loop gets armor. Any uncaught frame error is
       caught and logged, the next frame still schedules — one bad frame
       can never freeze the game again (a dead rAF was exactly what
       'broke' feels like).
    2. 'remove the auto cover, they better try to GET cover — we gotta
       work on their AI now' — gunmen no longer spawn behind magic cover.
       COVER AI: an uncovered gunman runs for the far side of the nearest
       pillar (up to 2.2 tiles/turn) until real geometry covers him; then
       he holds and works his peek cycle. Blades keep charging.
    3. 'more of the game on screen' — the header logo shrinks and WAGER +
       PATTERN move into the SETTINGS drawer; WAIT / SHOVE / NEW
       ENCOUNTER stay at hand."""
    if 'COVER AI V13' in demo:
        print('v13 already applied, skipping')
        return demo

    # 1. loop armor
    demo = sub1(demo, """\
function loop(ts){
  if(!last)last=ts; let dt=Math.min((ts-last)/1000,0.05);last=ts;""", """\
function loop(ts){
 try{   /* LOOP ARMOR V13: one bad frame must never kill the game */
  if(!last)last=ts; let dt=Math.min((ts-last)/1000,0.05);last=ts;""",
        'loop-armor-open')
    demo = sub1(demo, "  draw();requestAnimationFrame(loop);",
        "  draw();\n }catch(_le){ G._lastErr=String(_le); try{console.error('BOHEMIA frame error',_le);}catch(_e2){} }\n  requestAnimationFrame(loop);",
        'loop-armor-close')

    # 2. no auto cover; the AI earns it
    demo = sub1(demo,
        "return {i,arch,E:a,n:a.n,hp:a.hp,max:a.hp,armor:(a.armor||0),melee:!!a.melee,dead:false,inCover:!a.melee,beatOffset:0,stun:0,stunCooldown:0,prone:0,windup:false,acq:0,adv:(a.adv||0),reach:(a.reach||0),cad:(a.cad||1),phase:i%2};",
        "return {i,arch,E:a,n:a.n,hp:a.hp,max:a.hp,armor:(a.armor||0),melee:!!a.melee,dead:false,inCover:false,beatOffset:0,stun:0,stunCooldown:0,prone:0,windup:false,acq:0,adv:(a.adv||0),reach:(a.reach||0),cad:(a.cad||1),phase:i%2};   /* COVER AI V13: nobody spawns behind magic cover — they RUN for the real thing */",
        'no-auto-cover')
    demo = sub1(demo, "function tickTurnEnd(){ meleeTurnRun(); updateGeomCover();", """\
/* COVER AI V13 (Paolo: 'they better try to get cover'): an uncovered gunman
   picks the nearest pillar and runs for its far side (the spot where the
   stone sits between him and the player), up to 2.2 tiles a turn. Covered
   (geometry or hand-toggle) = hold and work the peek cycle. */
function coverSeekAI(){
  for(const e of G.e){
    if(e.dead||e.melee||e.stun>0||e.prone>0||e.stagger>0)continue;
    if(e.gcov||e.inCover)continue;
    let best=null,bd=1e9;
    for(const P of (G.pillars||[])){ const q=pXY(P); const L=Math.hypot(q[0],q[1])||1;
      const sx=q[0]*(1+1.15/L), sy=q[1]*(1+1.15/L);
      const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
      const d=Math.hypot(sx-ex,sy-ey);
      if(d<bd){bd=d;best=[sx,sy];} }
    if(!best)continue;
    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    const step=Math.min(2.2,bd);
    let nx=ex+(best[0]-ex)/(bd||1)*step, ny=ey+(best[1]-ey)/(bd||1)*step;
    if(Math.hypot(nx,ny)<1.6)continue;                       /* never scramble INTO the player */
    let blocked=false;                                        /* one body per spot */
    for(const o of G.e){ if(o===e||o.dead)continue;
      const ox=Math.cos(o.ea)*o.edist, oy=Math.sin(o.ea)*o.edist;
      if(Math.hypot(ox-nx,oy-ny)<0.9){blocked=true;break;} }
    if(blocked)continue;
    e.edist=Math.max(0.8,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx);
  }
}
function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover();""",
        'cover-ai')

    # 3. more game on screen
    demo = sub1(demo, "(function(){ const mm=D('meleemix'),ps=D('perkshoulder'),pf=D('perkforesight'),sb=D('shovebtn'),pl=D('perklongarm');", """\
(function(){ /* UI COMPACT V13: the board owns the screen */
  try{
    const st=document.createElement('style');
    st.textContent='#logo{height:30px!important;width:160px!important}'+
      'header{margin:0!important;padding:2px 6px!important}'+
      '#topbar{padding:2px 4px!important}'+
      '#chud{padding:3px 8px!important;gap:3px!important}';
    document.head.appendChild(st);
    const panel=document.querySelector('.setpanel');
    if(panel){ const grp=document.createElement('div'); grp.className='setgrp';
      grp.innerHTML='<span class="gl">TABLE (moved off the main screen)</span>';
      const row=document.createElement('div'); row.className='controls';
      const wb=D('wagerbtn'), ps2=D('patsel');
      if(wb)row.appendChild(wb); if(ps2)row.appendChild(ps2);
      grp.appendChild(row);
      panel.insertBefore(grp,panel.children[1]||null); }
  }catch(_ui){}
})();
(function(){ const mm=D('meleemix'),ps=D('perkshoulder'),pf=D('perkforesight'),sb=D('shovebtn'),pl=D('perklongarm');""",
        'ui-compact')
    return demo


def patch14(demo):
    """v14 (Paolo 7/20, the big feel pass):
    - logo OFF in combat, default view starts wider (0.82 zoom).
    - CHAIN SKILL: how many people you can shoot in one turn is a skill
      setting 1..8 (settings, default 3). '8 perfect kills = 1 turn'
      stays the ceiling at max skill.
    - WEAPON READ: every body shows what it holds — spear pole, bat club,
      shiv blade, gun barrel — pointed at you. You always know who is a
      blade and who is a gun.
    - MISS CINEMATIC: every return volley plays the quick incoming camera
      even when they all miss — you see WHO shot at you, every time.
    - AIM CAM GLIDE: your own framing (pan/zoom) eases into the shot
      framing when the dial opens; settings toggle GLIDE/SNAP.
    - The aiming arm's gun reads per weapon (pistol short, rifle long)."""
    if 'AIM CAM GLIDE V14' in demo:
        print('v14 already applied, skipping')
        return demo

    demo = sub1(demo, "st.textContent='#logo{height:30px!important;width:160px!important}'+",
        "st.textContent='#logo{display:none!important}'+   /* V14: Paolo — no logo in the fight */",
        'logo-off')
    demo = sub1(demo, "G.userZoom=1;G.userPan={x:0,y:0};",
        "G.userZoom=0.82;G.userPan={x:0,y:0};   /* V14: start wide — see the board */",
        'wide-start')

    # chain skill
    demo = sub1(demo,
        "function enterAim(isChain){ G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }",
        """function enterAim(isChain){
  /* CHAIN SKILL V14 (Paolo): how many people you can shoot in ONE turn is a
     SKILL (1..8, settings). The locked '8 perfect kills = 1 turn' is the
     ceiling at max skill. */
  if(!isChain)G._chainN=1;
  else { G._chainN=(G._chainN||1)+1;
    if(G._chainN>(G.chainSkill||3)){ setRead('CHAIN SPENT','skill caps you at '+(G.chainSkill||3)+' this turn','#8a7d66'); return endTurnReturn(); } }
  G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }""",
        'chain-skill')
    demo = sub1(demo, '<button id="perkforesight">FORESIGHT: OFF</button>',
        '<button id="perkforesight">FORESIGHT: OFF</button>\n      <button id="chainskill">CHAIN: 3</button>\n      <button id="aimcam">AIM CAM: GLIDE</button>',
        'skill-btns')
    demo = sub1(demo, "if(sb)sb.addEventListener('click',doShove);", """\
if(sb)sb.addEventListener('click',doShove);
  const cs=D('chainskill'); if(cs)cs.addEventListener('click',()=>{ G.chainSkill=((G.chainSkill||3)%8)+1; cs.textContent='CHAIN: '+G.chainSkill; });
  const ac=D('aimcam'); if(ac)ac.addEventListener('click',()=>{ G.aimCamGlide=(G.aimCamGlide===false); ac.textContent='AIM CAM: '+(G.aimCamGlide===false?'SNAP':'GLIDE'); });""",
        'skill-wire')

    # weapon read on every body
    demo = sub1(demo, """\
    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }""", """\
    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }
    if(!e.dead&&!(e.prone>0)){ /* WEAPON READ V14: you always see who holds what */
      const wa=Math.atan2(cy-ey,cx-ex);
      if(e.melee){ const wl=e.wpn==='spear'?er*1.9:e.wpn==='bat'?er*1.1:er*0.75;
        x.strokeStyle=e.wpn==='bat'?'#6a4a26':'#b8b4a8'; x.lineWidth=e.wpn==='bat'?4:2.5; x.lineCap='round';
        x.beginPath(); x.moveTo(ex+Math.cos(wa)*er*0.6,ey+Math.sin(wa)*er*0.6);
        x.lineTo(ex+Math.cos(wa)*(er*0.6+wl),ey+Math.sin(wa)*(er*0.6+wl)); x.stroke(); x.lineCap='butt'; }
      else { x.strokeStyle='#242220'; x.lineWidth=3;
        x.beginPath(); x.moveTo(ex+Math.cos(wa)*er*0.7,ey+Math.sin(wa)*er*0.7);
        x.lineTo(ex+Math.cos(wa)*er*1.3,ey+Math.sin(wa)*er*1.3); x.stroke(); } }""",
        'weapon-read')

    # miss volleys get the camera too
    demo = sub1(demo,
        "  else setRead('WAITED', pool.length?'they fired, missed':'world moves — new windows','#8a7d66');",
        """  else { setRead('WAITED', pool.length?'they fired, missed':'world moves — new windows','#8a7d66');
    if(G.incomingCam&&pool.length)startIncoming(pool.map(e2=>e2.i),false,'quick'); }   /* MISS CINEMATIC V14: you see WHO shot, even on a miss */""",
        'miss-cam-wait')
    demo = sub1(demo,
        "  else setRead(pool.length?'RETURN FIRE':'CLEAR', pool.length?(pool.length+' fired, all missed'):'you stayed covered','#8fe89a');",
        """  else { setRead(pool.length?'RETURN FIRE':'CLEAR', pool.length?(pool.length+' fired, all missed'):'you stayed covered','#8fe89a');
    if(G.incomingCam&&pool.length)startIncoming(pool.map(e2=>e2.i),false,'quick'); }   /* MISS CINEMATIC V14 */""",
        'miss-cam-return')

    # your framing glides into the shot
    demo = sub1(demo, """\
    if(!G.ks){ G.cam.zoom=1;
      G.cam.x=W/2+Math.cos(base)*RAD*0.35;
      G.cam.y=H/2+Math.sin(base)*RAD*0.35; }""", """\
    if(!G.ks){ const tx3=W/2+Math.cos(base)*RAD*0.35, ty3=H/2+Math.sin(base)*RAD*0.35;
      if(G.aimCamGlide===false){ G.cam.zoom=1; G.cam.x=tx3; G.cam.y=ty3; }
      else { const k=0.14;   /* AIM CAM GLIDE V14: however you framed it, the camera swings into the shot */
        G.cam.zoom+=(1-G.cam.zoom)*k; G.cam.x+=(tx3-G.cam.x)*k; G.cam.y+=(ty3-G.cam.y)*k;
        G.userZoom+=(1-G.userZoom)*k; G.userPan.x*=(1-k); G.userPan.y*=(1-k); } }""",
        'cam-glide')

    # the arm's gun reads per weapon
    demo = sub1(demo, """\
  const gl=L*0.45;
  c2.strokeStyle='#3a3632'; c2.lineWidth=Math.max(2.5,L*0.13); c2.lineCap='butt';
  c2.beginPath(); c2.moveTo(hx,hy); c2.lineTo(hx+Math.cos(ang)*gl,hy+Math.sin(ang)*gl); c2.stroke();""", """\
  const wf=(typeof WEAPON!=='undefined')?(WEAPON==='rifle'?0.68:WEAPON==='shotgun'?0.60:WEAPON==='smg'?0.50:0.38):0.45;
  const gl=L*wf;   /* the gun reads per weapon: pistol short, rifle long */
  c2.strokeStyle='#3a3632'; c2.lineWidth=Math.max(2.5,L*0.13); c2.lineCap='butt';
  c2.beginPath(); c2.moveTo(hx,hy); c2.lineTo(hx+Math.cos(ang)*gl,hy+Math.sin(ang)*gl); c2.stroke();
  if(wf>0.55){ c2.strokeStyle='#241f18'; c2.lineWidth=Math.max(2,L*0.09);   /* long guns get a stock */
    c2.beginPath(); c2.moveTo(hx-Math.cos(ang)*L*0.14,hy-Math.sin(ang)*L*0.14); c2.lineTo(hx,hy); c2.stroke(); }""",
        'gun-read')
    return demo


def patch15(demo):
    """v15 (Paolo 7/20, with the tunnel screenshot): the recursive-tunnel /
    smeared-bodies screen was a LEAKED CANVAS TRANSFORM — when a frame
    throws between save() and restore(), the half-applied zoom survives
    and compounds every frame (v13's armor kept the game alive but wore
    the leak). THE CLASS FIX:
    - draw() hard-resets the transform AND clears the canvas at frame
      start — nothing survives a frame, ever.
    - the loop-armor catch also resets the transform and paints a small
      ERR chip with the message so the underlying error becomes visible
      and reportable instead of invisible.
    - the street floor now outruns ANY zoom (user pinch included) and any
      pan — no more small floating board ('make the world map bigger').
    - the FIRST fight at boot shuffles its faction too (newEncounter
      already did; boot stayed on CUSTOM, which read as no-shuffle)."""
    if 'HARD RESET V15' in demo:
        print('v15 already applied, skipping')
        return demo

    demo = sub1(demo, """\
function draw(){
  applyShake();
  const W=cv.width,H=cv.height;""", """\
function draw(){
  ctx.setTransform(1,0,0,1,0,0);               /* HARD RESET V15: no transform survives a frame */
  ctx.clearRect(0,0,cv.width,cv.height);       /* no stale pixels either — the tunnel dies here */
  applyShake();
  const W=cv.width,H=cv.height;""",
        'hard-reset')
    demo = sub1(demo,
        " }catch(_le){ G._lastErr=String(_le); try{console.error('BOHEMIA frame error',_le);}catch(_e2){} }",
        """ }catch(_le){ G._lastErr=String(_le);
   try{ctx.setTransform(1,0,0,1,0,0);}catch(_e3){}
   try{console.error('BOHEMIA frame error',_le);}catch(_e2){}
   try{ctx.fillStyle='rgba(220,70,45,0.95)';ctx.font='10px monospace';
     ctx.fillText('ERR '+String(_le).slice(0,70),8,12);}catch(_e4){} }""",
        'armor-reset')
    demo = sub1(demo,
        "    const spanF=(aimo&&aimo.zb&&aimo.zb<1)?1/aimo.zb:1;   /* zoom-out shots need a wider board */",
        """    const uzS=(G.userZoom&&G.userZoom<1)?1/G.userZoom:1;
    const panT=Math.ceil((Math.abs((G.userPan&&G.userPan.x)||0)+Math.abs((G.userPan&&G.userPan.y)||0))/(t*(G.userZoom||1)))+2;
    const spanF=(((aimo&&aimo.zb&&aimo.zb<1)?1/aimo.zb:1)*uzS)*1.25;   /* the board outruns ANY zoom or pan */""",
        'floor-uz-span')
    demo = sub1(demo,
        "    const gx0=Math.floor(offx-(cx/t)*spanF)-1, gx1=Math.floor(offx+((W-cx)/t)*spanF)+1;\n    const gy0=Math.floor(offy-(cy/t)*spanF)-1, gy1=Math.floor(offy+((H-cy)/t)*spanF)+1;",
        "    const gx0=Math.floor(offx-(cx/t)*spanF)-panT, gx1=Math.floor(offx+((W-cx)/t)*spanF)+panT;\n    const gy0=Math.floor(offy-(cy/t)*spanF)-panT, gy1=Math.floor(offy+((H-cy)/t)*spanF)+panT;",
        'floor-pan-bounds')
    demo = sub1(demo,
        "function setupCombat(){ setupEnemies(); updateGeomCover(); buildBoard();",
        "function setupCombat(){ if(G.factionShuffle)try{pickRandomFaction();}catch(_e){}   /* V15: the FIRST fight shuffles too */\n  setupEnemies(); updateGeomCover(); buildBoard();",
        'boot-shuffle')
    return demo


def patch16(demo):
    """v16: the music studio's boot push was killing the shuffle default
    every time the COMBAT tab opened (userPicked persists from an old
    studio pick). Per Paolo's 7/20 ruling, studio pushes steer the
    CURRENT song; SHUFFLE stays the encounter default unless the studio
    is live-driving (m.audit)."""
    if 'SHUFFLE stays the encounter default' in demo:
        print('v16 already applied, skipping')
        return demo
    demo = sub1(demo,
        "      G.faction=m.faction; G.factionShuffle=false; _seq.step=0;",
        "      G.faction=m.faction; if(m.audit)G.factionShuffle=false; _seq.step=0;   /* V16 (Paolo 7/20): studio pushes steer the CURRENT song; SHUFFLE stays the encounter default unless the studio is live-driving */",
        'shuffle-survives-push')
    return demo


def patch17(demo):
    """v17 (Paolo 7/20, with the outside-the-map screenshot):
    - EXACT FLOOR: the street tile bounds are now computed by inverse-
      transforming the real viewport corners (uzInvert) + the aim zoom,
      padded 6 tiles — the board covers exactly what the camera shows,
      any zoom, any pan, no heuristics to lose ('he's outside the map').
    - CROUCH: covered men (hand cover or pillar) draw squashed to a duck
      (0.72 height, feet-anchored) until the real cover animation lands
      from his art chat.
    - SHOT COUNTER: the aim readout shows 'SHOT n/skill' so you always
      know how many the chain allows this turn.
    - MENU SWEEP: the DIAL FACING group (N/E/S/W) is obsolete — the dial
      faces your target on the board now. Removed."""
    if 'EXACT FLOOR V17' in demo:
        print('v17 already applied, skipping')
        return demo

    demo = sub1(demo, """\
    const uzS=(G.userZoom&&G.userZoom<1)?1/G.userZoom:1;
    const panT=Math.ceil((Math.abs((G.userPan&&G.userPan.x)||0)+Math.abs((G.userPan&&G.userPan.y)||0))/(t*(G.userZoom||1)))+2;
    const spanF=(((aimo&&aimo.zb&&aimo.zb<1)?1/aimo.zb:1)*uzS)*1.25;   /* the board outruns ANY zoom or pan */
    const gx0=Math.floor(offx-(cx/t)*spanF)-panT, gx1=Math.floor(offx+((W-cx)/t)*spanF)+panT;
    const gy0=Math.floor(offy-(cy/t)*spanF)-panT, gy1=Math.floor(offy+((H-cy)/t)*spanF)+panT;""", """\
    /* EXACT FLOOR V17: invert the real camera — the board covers exactly
       what the viewport shows, any zoom, any pan. No heuristics to lose. */
    const _c0=uzInvert(0,0,W,H), _c1=uzInvert(W,H,W,H);
    let _wx0=(Math.min(_c0[0],_c1[0])-cx)/t, _wx1=(Math.max(_c0[0],_c1[0])-cx)/t;
    let _wy0=(Math.min(_c0[1],_c1[1])-cy)/t, _wy1=(Math.max(_c0[1],_c1[1])-cy)/t;
    if(aimo&&aimo.zb&&aimo.zb>0){ _wx0/=aimo.zb; _wx1/=aimo.zb; _wy0/=aimo.zb; _wy1/=aimo.zb; }
    const PAD=6;   /* cam bias + incoming pans live inside this */
    const gx0=Math.floor(offx+_wx0)-PAD, gx1=Math.ceil(offx+_wx1)+PAD;
    const gy0=Math.floor(offy+_wy0)-PAD, gy1=Math.ceil(offy+_wy1)+PAD;""",
        'exact-floor')

    demo = sub1(demo, "    if(!drawEnemySprite(x,e,ex,ey,nowMs)){", """\
    const _cov=(e.inCover||e.gcov)&&!e.dead&&!(e.prone>0);
    if(_cov){ x.save(); x.translate(ex,ey+er); x.scale(1,0.72); x.translate(-ex,-(ey+er)); }   /* CROUCH V17: covered men duck (real cover anim comes from Paolo's art chat) */
    if(!drawEnemySprite(x,e,ex,ey,nowMs)){""",
        'crouch-open')
    demo = sub1(demo, """\
      if(e.prone>0){ x.beginPath();x.ellipse(ex,ey+er*0.4,er*1.2,er*0.5,0,0,7);x.fill(); }
      else { x.beginPath();x.arc(ex,ey,er,0,7);x.fill(); }
    }""", """\
      if(e.prone>0){ x.beginPath();x.ellipse(ex,ey+er*0.4,er*1.2,er*0.5,0,0,7);x.fill(); }
      else { x.beginPath();x.arc(ex,ey,er,0,7);x.fill(); }
    }
    if(_cov)x.restore();""",
        'crouch-close')

    demo = sub1(demo,
        "pl.innerHTML='<b style=\"color:'+rangeCol(tg)+'\">'+rangeTier(tg)+'</b> ~'+m+'m · <b style=\"color:#e89a4a\">'+pkgName(G.pkgDiff)+'</b> dial · '+G.pat.toUpperCase(); }",
        "pl.innerHTML='<b style=\"color:'+rangeCol(tg)+'\">'+rangeTier(tg)+'</b> ~'+m+'m · <b style=\"color:#e89a4a\">'+pkgName(G.pkgDiff)+'</b> dial · '+G.pat.toUpperCase()+' · <b style=\"color:#8fe89a\">SHOT '+(G._chainN||1)+'/'+(G.chainSkill||3)+'</b>'; }   /* V17: you always know what the chain allows */",
        'shot-counter')

    demo = sub1(demo, """\
  <div class="setgrp"><span class="gl">DIAL FACING</span>
    <div class="controls">
      <button data-f="0">N</button><button data-f="2">E</button>
      <button data-f="4" class="on">S</button><button data-f="6">W</button>
    </div>
  </div>

""", "", 'facing-gone')
    return demo


def patch18(demo):
    """v18 (Paolo 7/20, ERR chip screenshot: "ReferenceError: Can't find
    variable: DIRS"):
    1. THE PHONE GHOST, KILLED: v10 wrapped drawField's DIRS table inside
       the not-during-dial block, but the ring-cell FX further down (the
       cover-save flash — which fires exactly WHEN YOUR COVER EATS A
       SHOT) still read DIRS. Getting shot at while covered = dead frame
       = the dial stops drawing. DIRS is now scoped to the whole field.
    2. THE REAL CROUCH: the alpha already bakes 'take-cover' frames into
       every enemy look (cover112/coverE/coverW, Paolo 7/3 canon) and
       enemyFrame renders them beat-bobbed — but only for the hand
       inCover flag. Pillar cover (gcov) now triggers the SAME baked
       crouch; peek/fire windows still stand them up (the readable pop).
       The v17 squash placeholder is removed — real frames win.
    3. KILLSHOTS/TURN: the chain-skill button is labeled in Paolo's own
       words and highlighted, in a SKILLS-labeled group."""
    if 'V18 DIRS' in demo:
        print('v18 already applied, skipping')
        return demo

    demo = sub1(demo, """\
  // my 3x3 self-cover ring (never during the dial — the scene stays clean)
  if(!aimo){
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];""", """\
  // my 3x3 self-cover ring (never during the dial — the scene stays clean)
  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];   /* V18 DIRS: whole-field scope — the ring FX below read it too (the phone's ReferenceError) */
  if(!aimo){""",
        'dirs-scope')

    demo = sub1(demo, "  if(e.inCover&&!peeking(e)&&!firing(e)){",
        "  if((e.inCover||e.gcov)&&!peeking(e)&&!firing(e)){   /* V18: pillar cover crouches with the SAME baked take-cover frames */",
        'gcov-crouch')

    # the squash placeholder dies — the real frames carry it
    demo = sub1(demo, """\
    const _cov=(e.inCover||e.gcov)&&!e.dead&&!(e.prone>0);
    if(_cov){ x.save(); x.translate(ex,ey+er); x.scale(1,0.72); x.translate(-ex,-(ey+er)); }   /* CROUCH V17: covered men duck (real cover anim comes from Paolo's art chat) */
    if(!drawEnemySprite(x,e,ex,ey,nowMs)){""", """\
    const _cov=false;   /* V18: the baked take-cover frames carry the crouch now */
    if(!drawEnemySprite(x,e,ex,ey,nowMs)){""",
        'squash-gone')

    demo = sub1(demo, '<span class="gl">MELEE + PERKS (Paolo 7/19 rulings)</span>',
        '<span class="gl">SKILLS + PERKS (killshots per turn lives here)</span>', 'skills-label')
    demo = sub1(demo, '<button id="chainskill">CHAIN: 3</button>',
        '<button id="chainskill" style="border-color:#8fe89a;color:#cfe8c0">KILLSHOTS/TURN: 3</button>', 'chain-label')
    demo = sub1(demo, "cs.textContent='CHAIN: '+G.chainSkill;",
        "cs.textContent='KILLSHOTS/TURN: '+G.chainSkill;", 'chain-label-wire')
    return demo


def patch19(demo):
    """v19 (Paolo 7/20):
    1. VICTORY WALK: after the fight is won, the move ring keeps working —
       wander the field over the corpses (loot comes later).
    2. BLOOD BY HEALTH: wounded bodies BLEED into the world. An enemy at
       or under 40% health drips every turn; under 20% it pours; the
       player under 30 HP leaves a trail behind every step. Spots are
       world-anchored so they smear into a trail as bodies move and pool
       where they stand.
    3. KILLSHOTS/TURN could not be found — the SKILLS group now moves to
       the very TOP of the settings drawer at boot."""
    if 'VICTORY WALK V19' in demo:
        print('v19 already applied, skipping')
        return demo

    demo = sub1(demo, "function doMove(d){ if(G.phase!=='cover'||G.over||G.inc)return; audio();", """\
function doMove(d){ if(G.inc)return;
  const roam=(G.over&&G.win);   /* VICTORY WALK V19: the field is yours after the fight */
  if(!roam&&(G.phase!=='cover'||G.over))return; audio();""",
        'roam-gate')
    demo = sub1(demo, """\
  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }""", """\
  if(roam){ setRead('WALKING THE FIELD','yours now — loot comes later','#8fd0e8'); renderBoard(); updGap(); return; }
  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }""",
        'roam-free')

    # blood by health
    demo = sub1(demo, "function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover();", """\
/* BLOOD BY HEALTH V19 (Paolo): wounded bodies bleed into the world.
   <=40% hp drips each turn, <=20% pours; the player under 30 leaves a
   trail behind every step. World-anchored: moving smears a trail,
   standing still pools. */
function bleedTick(){ G.bloodSpots=G.bloodSpots||[];
  for(const e of G.e){ if(e.dead||e.hp>e.max*0.4)continue;
    const heavy=e.hp<=e.max*0.2;
    G.bloodSpots.push({ea:e.ea,edist:e.edist,r:(heavy?2.6:1.5)+Math.random()*1.2,
      jx:(Math.random()-0.5)*0.5,jy:(Math.random()-0.5)*0.5});
    if(heavy)G.bloodSpots.push({ea:e.ea,edist:e.edist,r:1.2+Math.random(),
      jx:(Math.random()-0.5)*0.8,jy:(Math.random()-0.5)*0.8}); }
  if(G.pHP<=30)G.bloodSpots.push({ea:0,edist:0.15,r:2.0+Math.random()*1.4,
    jx:(Math.random()-0.5)*0.6,jy:(Math.random()-0.5)*0.6});
  while(G.bloodSpots.length>90)G.bloodSpots.shift(); }
function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover(); bleedTick();""",
        'bleed-tick')
    demo = sub1(demo, "  for(const P of (G.pillars||[]))mv(P);",
        "  for(const P of (G.pillars||[]))mv(P);\n  if(Array.isArray(G.bloodSpots))for(const s of G.bloodSpots)mv(s);   /* the trail stays where it fell */",
        'blood-shift')
    demo = sub1(demo, "  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];", """\
  if(Array.isArray(G.bloodSpots))for(const s of G.bloodSpots){
    const sp=fieldPos(s,W,H,cx,cy);
    x.fillStyle='rgba(118,16,14,0.32)';
    x.beginPath(); x.ellipse(sp[0]+(s.jx||0)*ring,sp[1]+(s.jy||0)*ring,(s.r||2),(s.r||2)*0.6,0,0,7); x.fill(); }
  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];""",
        'blood-draw')

    # skills to the top of the drawer
    demo = sub1(demo, "      panel.insertBefore(grp,panel.children[1]||null); }", """\
      panel.insertBefore(grp,panel.children[1]||null);
      const csB=document.getElementById('chainskill'), sg=csB&&csB.closest('.setgrp');
      if(sg)panel.insertBefore(sg,panel.children[1]||null);   /* V19: KILLSHOTS/TURN at the TOP of settings */ }""",
        'skills-top')
    return demo


def patch20(demo):
    """v20 (Paolo 7/20, the animation pass — pulled from bakes we already own):
    - WALK: the parent now bakes 'walk' frames (player 4-phase, enemies
      2-phase); stepping plays them — you and the blades stop gliding.
    - THE DEADEYE POSE IS THE NEEDLE: during the dial the field player
      renders the baked gun-holding deadeye sprite AT THE CURRENT NEEDLE
      ANGLE (sprAimFrame) — the body itself sweeps. The drawn live arm
      goes compute-only (muzzle math), ghosts stay.
    - DEATH POSES ARE STATIC: a corpse's look was re-picked by bearing
      every step (worldShift changes bearings) — the look now LOCKS at
      death.
    - 1v1 RISK: a MISS is punishable at any enemy count — tucked gunmen
      counter-snap from cover at 0.35x accuracy (0.7x damage) when you
      engage and blow it. No more free whiffing at the last man.
    - GLIDE, actually gliding: ease 0.14->0.055 and the aim ZOOM eases
      too (G._zbS), reset on return to cover.
    - HONEST CROUCH: the take-cover pose needs REAL stone nearby (gcov,
      or hand-flag within 1.8 tiles of a pillar) — no more men ducking
      behind air."""
    if 'V20 WALK' in demo:
        print('v20 already applied, skipping')
        return demo

    # SPR loaders learn the walk frames
    demo = sub1(demo, "    SPR.cv[dir]={idle:mk(d.dirs[dir].idle),aim:d.dirs[dir].aim.map(a=>({off:a.off,cv:mk(a.rgba)})),",
        "    SPR.cv[dir]={idle:mk(d.dirs[dir].idle),walk:(d.dirs[dir].walk||[]).map(mk),   /* V20 WALK */\n      aim:d.dirs[dir].aim.map(a=>({off:a.off,cv:mk(a.rgba)})),",
        'cv-walk')
    demo = sub1(demo, "      cover112:L.cover112.map(b=>mkAt(b,112,112)),",
        "      cover112:L.cover112.map(b=>mkAt(b,112,112)),\n      walk112:L.walk112?L.walk112.map(b=>mkAt(b,112,112)):null,",
        'look-walk')

    # the player: aim pose sweeps, steps walk
    demo = sub1(demo, """\
    const fset=SPR.cv[sprFacing(G.faceAng)]||SPR.cv.S;
    const pst=(G._pHitAt&&performance.now()-G._pHitAt<600&&fset.stag)?fset.stag[Math.min(3,Math.floor((performance.now()-G._pHitAt)/150))]:fset.idle;""", """\
    const fset=SPR.cv[sprFacing(G.faceAng)]||SPR.cv.S;
    let pst=(G._pHitAt&&performance.now()-G._pHitAt<600&&fset.stag)?fset.stag[Math.min(3,Math.floor((performance.now()-G._pHitAt)/150))]:fset.idle;
    if(aimo){ const af=sprAimFrame(sprFacing(G.faceAng),G.angle); if(af)pst=af; }   /* the baked DEADEYE pose IS the needle */
    else if(G._stepAt&&performance.now()-G._stepAt<520&&fset.walk&&fset.walk.length){
      pst=fset.walk[Math.floor((performance.now()-G._stepAt)/130)%fset.walk.length]; }   /* V20 WALK: steps read as steps */""",
        'player-frames')
    demo = sub1(demo, "  worldShift(sx,sy); updateGeomCover();\n  G.moveArm=false; updMoveUI();",
        "  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now();\n  G.moveArm=false; updMoveUI();",
        'step-at')

    # enemies walk when they moved
    demo = sub1(demo, "    else if(r.act==='advance'){ e.edist=r.dist; }",
        "    else if(r.act==='advance'){ e.edist=r.dist; e._movedAt=performance.now(); }", 'blade-moved')
    demo = sub1(demo, "    e.edist=Math.max(0.8,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx);\n  }\n}",
        "    e.edist=Math.max(0.8,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._movedAt=performance.now();\n  }\n}",
        'seeker-moved')
    demo = sub1(demo, "  if(e._hitAt&&now-e._hitAt<600&&L.stag112)return L.stag112[Math.min(3,Math.floor((now-e._hitAt)/150))];",
        "  if(e._hitAt&&now-e._hitAt<600&&L.stag112)return L.stag112[Math.min(3,Math.floor((now-e._hitAt)/150))];\n  if(e._movedAt&&now-e._movedAt<520&&L.walk112)return L.walk112[Math.floor((now-e._movedAt)/170)%L.walk112.length];   /* V20: movers walk */",
        'enemy-walk')

    # corpse look locks at death
    demo = sub1(demo, "function enemyLook(e){if(!SPR.enemy)return null;return SPR.enemyByFace[SPR_DIRNAME[dirIndex(e.ea+Math.PI)]]||null;}",
        "function enemyLook(e){if(!SPR.enemy)return null;\n  if(e._lookLock)return e._lookLock;   /* V20: the dead keep the pose they died in */\n  const L=SPR.enemyByFace[SPR_DIRNAME[dirIndex(e.ea+Math.PI)]]||null;\n  if(e.dead&&L)e._lookLock=L;\n  return L;}",
        'look-lock')

    # the live arm goes compute-only; the sprite carries the gun
    demo = sub1(demo, "  const [hx,hy,gl]=drawArmNeedle(ctx,pcx,pcy,ang,ARML,1);   /* BOARD BODY: your sprite stands, the arm swings */",
        "  const [hx,hy,gl]=drawArmNeedle(ctx,pcx,pcy,ang,ARML,0);   /* compute-only: the baked deadeye sprite IS the swinging gun (V20) */",
        'arm-ghost-only')

    # a miss is punishable at any count: tucked counter-snap
    demo = sub1(demo, """\
    else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */ }
  if(dmg>0){ G.pHP=Math.max(0,G.pHP-dmg); updPlayer(); const _lethal=G.pHP<=0;
    onOffbeat(()=>{hurtFlash(); sndReturn(); setRead('RETURN FIRE',hits+' of '+pool.length+' hit you — '+dmg,'#e8593a');""", """\
    else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */ }
  if(engaged){ /* V20 COUNTER-SNAP (Paolo: 'even 1v1 I never take damage if I miss a million shots'):
     tucked gunmen answer your blown engagement from cover — 0.35x accuracy, 0.7x damage. */
    const snap=G.e.filter(e2=>!e2.dead&&!e2.melee&&e2.stun<=0&&!(e2.prone>0)&&(e2.inCover||e2.gcov)&&pool.indexOf(e2)<0);
    for(const e2 of snap){ const cov2=myCoverAgainst(e2.ea,e2.edist);
      const acc2=distAccuracy(e2)*0.35*(cov2?0.4:1)*((e2.E.acc||0.55)/0.55);
      if(Math.random()<acc2){ hits++; hitIdx.push(e2.i);
        const a2=e2.E.dmg; dmg+=Math.round((a2[0]+Math.floor(Math.random()*(a2[1]-a2[0]+1)))*0.7); } } }
  if(dmg>0){ G.pHP=Math.max(0,G.pHP-dmg); updPlayer(); const _lethal=G.pHP<=0;
    onOffbeat(()=>{hurtFlash(); sndReturn(); setRead('RETURN FIRE',hits+' of '+pool.length+' hit you — '+dmg,'#e8593a');""",
        'counter-snap')

    # glide slower + zoom eases too
    demo = sub1(demo, "      else { const k=0.14;   /* AIM CAM GLIDE V14: however you framed it, the camera swings into the shot */",
        "      else { const k=0.055;   /* AIM CAM GLIDE V14 (V20: actually glides — slower) */",
        'glide-slow')
    demo = sub1(demo, """\
    const zb=tgtE?Math.max(0.35,Math.min(3.6,(RAD*1.18)/(Math.max(0.8,tgtE.edist)*ring0))):2.0;""", """\
    const zbT=tgtE?Math.max(0.35,Math.min(3.6,(RAD*1.18)/(Math.max(0.8,tgtE.edist)*ring0))):2.0;
    G._zbS=(G._zbS==null||G.aimCamGlide===false)?zbT:G._zbS+(zbT-G._zbS)*0.08;   /* V20: the zoom glides too */
    const zb=G._zbS;""",
        'zb-glide')
    demo = sub1(demo, "  if(G.phase!=='aim' && !G.ks){\n    if(G.inc)incApply(ctx,W,H,cx,cy);",
        "  if(G.phase!=='aim' && !G.ks){ G._zbS=null;\n    if(G.inc)incApply(ctx,W,H,cx,cy);",
        'zb-reset')

    # honest crouch: needs real stone nearby
    demo = sub1(demo, "function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=pillarBetweenMe(e)?1:0; } }",
        "function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=pillarBetweenMe(e)?1:0; } }\nfunction nearPillar(e){ const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;\n  return (G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-ex,q[1]-ey)<1.8; }); }",
        'near-pillar')
    demo = sub1(demo, "  if((e.inCover||e.gcov)&&!peeking(e)&&!firing(e)){   /* V18: pillar cover crouches with the SAME baked take-cover frames */",
        "  if((e.gcov||(e.inCover&&nearPillar(e)))&&!peeking(e)&&!firing(e)){   /* V18+V20: the crouch needs REAL stone nearby — nobody ducks behind air */",
        'honest-crouch')
    return demo


def patch21(demo):
    """v21 (Paolo 7/20, screenshot: 'my shell casings follow me around
    instead of staying on the floor where I shot them'):
    BRASS IS FLOOR STATE. Root cause: player brass was stored as {p:1,dx,dy}
    (a player-anchored offset, the 7/3 AF v2 law written BEFORE movement
    existed). worldShift already moves litter, but its mover skips entries
    with no ea/edist, and the renderer drew p-brass at cx+dx — glued to your
    screen-centered body. Fix: player brass lands AT YOUR WORLD SPOT
    (ea:0, edist:0 = the tile you fired from) and rides worldShift like
    blood and corpses. Plus: the shift's 0.6-tile minimum clamp exists so
    enemies never stand inside you — statics (corpses, pillars, blood,
    litter) now keep TRUE positions so walking over them never nudges them."""
    if 'V21 BRASS' in demo:
        print('v21 already applied, skipping')
        return demo

    # brass lands at the shooter's world spot
    demo = sub1(demo, "        litterAdd({p:1,dx:rdx/mag*cl,dy:Math.max(8,Math.abs(rdy/mag*cl))+4,r:Math.random()*Math.PI}); } } }",
        "        litterAdd({ea:0,edist:0,dx:rdx/mag*cl,dy:Math.max(8,Math.abs(rdy/mag*cl))+4,r:Math.random()*Math.PI}); } } }   /* V21 BRASS: lands at YOUR WORLD SPOT and stays on the floor */",
        'brass-world-spawn')
    demo = sub1(demo, """\
/* AF v2 (Paolo 7/3/26, ONE WORLD LAW): brass is WORLD STATE. It lands close
   to whoever fired it and reads the same in the dial view and the field
   view, because those are ONE world. Player brass anchors to you; enemy
   volleys drop brass at the shooter's field spot. */""", """\
/* AF v3 (Paolo 7/20, V21 BRASS): brass is FLOOR STATE. Everyone's brass —
   yours included — drops at the shooter's WORLD spot the moment it lands
   and stays on that floor tile forever (worldShift carries it like blood
   and corpses). The old v2 player-anchor predates movement and is dead. */""",
        'brass-law-comment')

    # renderer: all brass reads through fieldPos (world), no player-glue branch
    demo = sub1(demo, """\
    let lx,ly;
    if(l.p){lx=cx+l.dx;ly=cy+l.dy;}
    else{const [ex4,ey4]=fieldPos(l,W,H,cx,cy);lx=ex4+l.dx;ly=ey4+l.dy;}""", """\
    const _bp=(l.ea!=null)?fieldPos(l,W,H,cx,cy):[cx,cy];   /* V21: ALL brass is world state */
    const lx=_bp[0]+l.dx, ly=_bp[1]+l.dy;""",
        'brass-world-draw')

    # the JUICE panel's AF demo scatter converts too
    demo = sub1(demo, """\
  if(k==='AF'){ for(let w=0;w<5;w++)setTimeout(()=>litterAdd({p:1,
    dx:-14+w*7+(Math.random()-0.5)*4,dy:9+((w*17)%8),r:Math.random()*Math.PI}),w*250); }""", """\
  if(k==='AF'){ for(let w=0;w<5;w++)setTimeout(()=>litterAdd({ea:0,edist:0,
    dx:-14+w*7+(Math.random()-0.5)*4,dy:9+((w*17)%8),r:Math.random()*Math.PI}),w*250); }""",
        'brass-demo-spawn')

    # statics keep TRUE spots; only live enemies keep the body-bubble clamp
    demo = sub1(demo, """\
  const mv=o=>{ if(o.ea==null||o.edist==null)return;
    const px=Math.cos(o.ea)*o.edist-vx, py=Math.sin(o.ea)*o.edist-vy;
    o.edist=Math.max(0.6,Math.hypot(px,py)); o.ea=Math.atan2(py,px); };
  for(const e of G.e)mv(e);
  for(const c of (G.corpses||[]))mv(c);
  for(const P of (G.pillars||[]))mv(P);
  if(Array.isArray(G.bloodSpots))for(const s of G.bloodSpots)mv(s);   /* the trail stays where it fell */
  if(Array.isArray(G.litter))for(const L of G.litter)mv(L);""", """\
  const mv=(o,mn)=>{ if(o.ea==null||o.edist==null)return;
    const px=Math.cos(o.ea)*o.edist-vx, py=Math.sin(o.ea)*o.edist-vy;
    o.edist=Math.max(mn==null?0.6:mn,Math.hypot(px,py)); o.ea=Math.atan2(py,px); };
  for(const e of G.e)mv(e);   /* live bodies keep the bubble: nobody stands inside you */
  for(const c of (G.corpses||[]))mv(c,0.02);   /* V21: statics keep TRUE spots — walking over them never nudges them */
  for(const P of (G.pillars||[]))mv(P,0.02);
  if(Array.isArray(G.bloodSpots))for(const s of G.bloodSpots)mv(s,0.02);   /* the trail stays where it fell */
  if(Array.isArray(G.litter))for(const L of G.litter)mv(L,0.02);""",
        'statics-true-spots')
    return demo


def main():
    src = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", src)
    if not m:
        sys.exit('FAIL: COMBAT_B64 not found')
    demo = base64.b64decode(m.group(1)).decode('utf-8')
    patched = patch21(patch20(patch19(patch18(patch17(patch16(patch15(patch14(patch13(patch12(patch11(patch10(patch9(patch8(patch7(patch6(patch5(patch4(patch3(patch2(patch(demo)))))))))))))))))))))
    if patched == demo:
        return
    b64 = base64.b64encode(patched.encode('utf-8')).decode('ascii')
    out = src[:m.start(1)] + b64 + src[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(out)
    print('OK: COMBAT_B64 patched (%d -> %d chars decoded)' % (len(demo), len(patched)))


if __name__ == '__main__':
    main()
