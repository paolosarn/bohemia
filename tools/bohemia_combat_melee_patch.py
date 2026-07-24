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


def patch22(demo):
    """v22 (7/20, the PLUMBING PASS Paolo asked for — re-examining the flow,
    not stacking features). Three rots found in the TWO-TURN RED LINE law:
    - MOVE BREAKS THE BEAD: the law text says 'Break the line (move, cover,
      stun, kill) and his clock resets' but only stun/kill were built. A gun
      could hold its bead across your step and shoot the turn you emerged,
      with zero warning. Now a move resets every gun's acq clock: a moving
      target must be RE-ACQUIRED. (Movement matters; whiffing after a move
      is still punished by the v20 counter-snap, melee still hunts you.)
    - DANGER OUTRANKS ITS WARNING: the live RED threat line rendered at
      0.15 alpha while its amber ACQUIRING warning rendered 0.32 — the
      warning shouted louder than the danger. Red now 0.30, amber 0.18.
    - THE WARNING SPEAKS: acquiring was a silent amber line. Fresh beads
      now announce themselves in the read on damage-free turns:
      'ACQUIRING — n guns drawing a bead, one turn to break it'."""
    if 'V22 MOVE BREAKS THE BEAD' in demo or 'V24 LOS BEAD' in demo:   # v24 supersedes the v22 marker text
        print('v22 already applied, skipping')
        return demo

    # a move resets every gun's clock (the law's missing clause)
    demo = sub1(demo, """\
  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }""", """\
  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if((e2.acq||0)>=1)_broke++; e2.acq=0; }   /* V22 MOVE BREAKS THE BEAD: a moving target must be re-acquired */
  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],_broke?('one tile — '+_broke+' red line'+(_broke>1?'s':'')+' broken'):'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }""",
        'move-breaks-bead')

    # the red line must read stronger than its own warning
    demo = sub1(demo, "    let col,w; if(red){col='rgba(232,60,40,0.15)';w=2;} else if(acqing){col='rgba(232,140,40,0.32)';w=2;}",
        "    let col,w; if(red){col='rgba(232,60,40,0.30)';w=2;} else if(acqing){col='rgba(232,140,40,0.18)';w=2;}   /* V22: danger outranks its warning */",
        'line-hierarchy')

    # count fresh beads so the warning can speak
    demo = sub1(demo, """\
  for(const e of G.e){ if(e.dead||e.melee){ e.acq=0; continue; }
    const bead=e.stun<=0&&!(e.prone>0)&&(peeking(e)||firing(e));
    e.acq=bead?Math.min(9,(e.acq||0)+1):0; }""", """\
  G._newBeads=0;
  for(const e of G.e){ if(e.dead||e.melee){ e.acq=0; continue; }
    const bead=e.stun<=0&&!(e.prone>0)&&(peeking(e)||firing(e));
    const was=e.acq||0; e.acq=bead?Math.min(9,was+1):0;
    if(was===0&&e.acq===1)G._newBeads++; }   /* V22: fresh beads announce themselves */""",
        'bead-counter')
    demo = sub1(demo, """\
  onOffbeat(()=>fxCracks(pool.length-hits));   /* JUICE.D */
  tickTurnEnd(); G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); renderBoard(); updGap(); }   /* b13: stand down INTO the crouch */""", """\
  onOffbeat(()=>fxCracks(pool.length-hits));   /* JUICE.D */
  tickTurnEnd();
  if(G._newBeads&&dmg===0&&G.pHP>0)setRead('ACQUIRING',G._newBeads+' gun'+(G._newBeads>1?'s':'')+' drawing a bead — one turn to break it','#e8a04a');   /* V22: the warning speaks */
  G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); renderBoard(); updGap(); }   /* b13: stand down INTO the crouch */""",
        'warning-read-return')
    demo = sub1(demo, """\
  tickTurnEnd();   /* MELEE V2 DOWAIT: waiting is a turn — blades advance through the one choke */
  renderBoard(); updGap(); }""", """\
  tickTurnEnd();   /* MELEE V2 DOWAIT: waiting is a turn — blades advance through the one choke */
  if(G._newBeads&&dmg===0&&G.pHP>0)setRead('ACQUIRING',G._newBeads+' gun'+(G._newBeads>1?'s':'')+' drawing a bead — one turn to break it','#e8a04a');   /* V22 */
  renderBoard(); updGap(); }""",
        'warning-read-wait')
    return demo


def patch23(demo):
    """v23 (Paolo 7/20, four asks in one message):
    - HONEST PLAYER CROUCH: b13 made you live the crouch in EVERY cover
      phase, stone or not ('I'm crouching even though there's no cover
      around me'). Same law as the enemies' v20 honest crouch: the pose
      needs a pillar within 1.8 tiles, otherwise you stand.
    - ROAM FACES THE WALK: after the win you stayed locked at the last
      shot's facing; victory-walk steps now face the direction you step.
      (Mid-fight facing stays threat-driven per the 7/4 LOCKED law.)
    - EXPOSURE HONESTY ('why am I double exposing myself'): engaging a
      target you are ALREADY exposed to is fired from BEHIND your stone —
      the side you're covered from gets NO free aimed volley (they still
      counter-snap a whiff at 0.35x). Only popping AROUND your cover to
      hit someone you were covered from opens you to everyone.
    - AUTO FRAME: during the cover phase the camera automatically stays
      zoomed out far enough to hold EVERY living enemy, with a margin so
      the bottom-right action ring never hides a body. Pinch still works;
      it just can't LOSE an enemy while the fight is on."""
    if 'V23 AUTO FRAME' in demo:
        print('v23 already applied, skipping')
        return demo

    # honest player crouch: stone or stand
    demo = sub1(demo, "function nearPillar(e){ const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;\n  return (G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-ex,q[1]-ey)<1.8; }); }",
        "function nearPillar(e){ const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;\n  return (G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-ex,q[1]-ey)<1.8; }); }\nfunction playerNearCover(){ return (G.pillars||[]).some(P=>P.edist<1.8); }   /* V23: your crouch needs stone too */",
        'player-near-cover')
    demo = sub1(demo, "    if(G.phase==='cover'&&!G.over&&fset.crouch&&fset.crouch.length){",
        "    if(G.phase==='cover'&&!G.over&&playerNearCover()&&fset.crouch&&fset.crouch.length){   /* V23: no stone, no crouch */",
        'honest-player-crouch')

    # the victory walk faces where it walks
    demo = sub1(demo, "  if(roam){ setRead('WALKING THE FIELD','yours now — loot comes later','#8fd0e8'); renderBoard(); updGap(); return; }",
        "  if(roam){ G.faceAng=Math.atan2(sy,sx); G.facing=dirIndex(G.faceAng);   /* V23: the walk faces the step, not the last shot */\n    setRead('WALKING THE FIELD','yours now — loot comes later','#8fd0e8'); renderBoard(); updGap(); return; }",
        'roam-facing')

    # exposure honesty: firing from behind your stone never opens the covered side
    demo = sub1(demo, "  if(!isChain)G._chainN=1;",
        "  if(!isChain){G._chainN=1;G._poppedOut=false;}   /* V23: track whether this turn ever left the stone */",
        'popped-reset')
    demo = sub1(demo, "  { const tgt=G.e[G.fireTarget]; if(tgt){ if(tgt.ea!=null) G.faceAng=tgt.ea;",
        "  { const tgt=G.e[G.fireTarget]; if(tgt){ if(tgt.ea!=null) G.faceAng=tgt.ea;\n      G._poppedOut=G._poppedOut||!!myCoverAgainst(tgt.ea,tgt.edist);   /* V23: shooting who you're covered FROM = popping around the stone */",
        'popped-track')
    demo = sub1(demo, "    pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)&&(e.acq||0)>=1); }",
        "    pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)&&(e.acq||0)>=1);\n    if(!G._poppedOut)pool=pool.filter(e=>!myCoverAgainst(e.ea,e.edist));   /* V23 EXPOSURE HONESTY: fired from BEHIND the stone — the covered side gets no free volley */ }",
        'exposure-honesty')

    # auto frame: the camera holds every living body
    demo = sub1(demo, "function uzApply(c,W,H){c.translate(W/2+G.userPan.x,H/2+G.userPan.y);c.scale(G.userZoom,G.userZoom);c.translate(-W/2,-H/2);}",
        "function uzEff(){ return G._uzE!=null?G._uzE:G.userZoom; }   /* V23 AUTO FRAME: the applied zoom, floored to hold every enemy */\nfunction uzApply(c,W,H){c.translate(W/2+G.userPan.x,H/2+G.userPan.y);c.scale(uzEff(),uzEff());c.translate(-W/2,-H/2);}",
        'uz-eff')
    demo = sub1(demo, "  px2=(px2-W/2)*G.userZoom+W/2+G.userPan.x; py2=(py2-H/2)*G.userZoom+H/2+G.userPan.y;",
        "  px2=(px2-W/2)*uzEff()+W/2+G.userPan.x; py2=(py2-H/2)*uzEff()+H/2+G.userPan.y;",
        'uz-eff-scr')
    demo = sub1(demo, "function uzInvert(x,y,W,H){return [(x-W/2-G.userPan.x)/G.userZoom+W/2,(y-H/2-G.userPan.y)/G.userZoom+H/2];}",
        "function uzInvert(x,y,W,H){return [(x-W/2-G.userPan.x)/uzEff()+W/2,(y-H/2-G.userPan.y)/uzEff()+H/2];}",
        'uz-eff-inv')
    demo = sub1(demo, """\
  applyShake();
  const W=cv.width,H=cv.height;
""", """\
  applyShake();
  const W=cv.width,H=cv.height;
  { /* V23 AUTO FRAME: in the cover phase the camera is at least wide enough
       to hold the FARTHEST living enemy, with margin so the bottom-right
       action ring never sits on a body. Pinch works, but can't LOSE anyone. */
    let uzT=G.userZoom;
    if(G.phase==='cover'&&!G.over&&!G.ks&&G.e&&G.e.length){
      const ringF=Math.min(W,H)*0.085; let md=0;
      for(const e of G.e)if(!e.dead&&e.edist>md)md=e.edist;
      if(md>0){ const fit=(Math.min(W/2,H/2)-96)/Math.max(80,md*ringF+70);
        uzT=Math.min(G.userZoom,Math.max(0.45,Math.min(1,fit))); } }
    G._uzE=(G._uzE==null)?uzT:G._uzE+(uzT-G._uzE)*0.10; }
""",
        'auto-frame')
    return demo


def patch24(demo):
    """v24 (Paolo 7/20, the big feel message):
    - VITAL NEVER CHAINS: a vital = 2-turn stun and your turn ENDS clean.
      Only a KILLSHOT buys the next target ('get a killshot, choose your
      next target'). The double-shoot off a vital is dead.
    - NO DOUBLE EXPOSURE: POSITIONAL exposure (anyone you lack cover from,
      out or cycling) kills the pop-out option entirely — the button reads
      HOLD while the exposed side cycles, SHOOT when they're out, and only
      a fully-covered player ever sees POP OUT.
    - LOS BEAD (his nerf of my v22): perpetual walking no longer blanks
      every gun. Moving only resets the clocks of guns whose LINE you
      actually broke (you have cover from them after the step). Walking in
      the open keeps you tracked — line of sight for a turn, then they fire.
    - THE DEAD LIE UNDER THE LIVING: corpses painted in an under-pass
      before the player; no more bodies layered on top of you on the walk.
    - UI CLUSTER UP-LEFT: fire button + move ring 18px -> 44px from the
      corner so the ring never clips off screen.
    - A VOLLEY IS A BIG DEAL: 2+ shooters play the FULL incoming camera
      even on a total miss, and every volley rattles the frame.
    - KICK-LOCK: the dial pulses on the SONG'S kick pattern (the one layer
      every faction song shares), not the bare beat grid — you SEE the
      kick you HEAR: ember pump + rim flash ride FAC().kick."""
    if 'V24 KICK-LOCK' in demo:
        print('v24 already applied, skipping')
        return demo

    # vital: stun, never a second shot
    demo = sub1(demo, """\
    setRead('VITAL — STUN', tgt.n+' frozen · chain on','#c8a23a');
    setTimeout(()=>{ if(!G.over) enterAim(true); },150);   // vital continues your turn
    return;""", """\
    setRead('VITAL — STUN', tgt.n+' frozen 2 turns — turn ends','#c8a23a');
    G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnClean(); },170);   /* V24 (Paolo): a vital STUNS — it never buys another shot. Only a KILLSHOT chains. */
    return;""",
        'vital-no-chain')

    # positional exposure: pop-out cannot exist while anyone has you lined up
    demo = sub1(demo, "function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist)); }   /* blades don't SHOOT; their damage is meleeTurnRun's */",
        "function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist)); }   /* blades don't SHOOT; their damage is meleeTurnRun's */\nfunction posExposed(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist)); }   /* V24: POSITIONAL exposure — who could line you up, out or cycling */",
        'pos-exposed')
    demo = sub1(demo, "function updGap(){ if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); let green=false;\n  let bg,glow,col,txt;\n  if(exp.length>0){          // forced: someone has a clean line on you -> you MUST shoot\n    bg='radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)'; glow='0 0 0 1px #d0543a,0 0 26px 5px rgba(232,89,58,.6)'; col='#ffeae6'; txt='SHOOT';\n  } else {",
        "function updGap(){ if(G.phase!=='cover')return; G.pkgDiff=G.userPkg; const fb=D('fire'); const exp=exposedToMe(); const pexp=posExposed(); let green=false;\n  let bg,glow,col,txt;\n  if(exp.length>0){          // forced: someone has a clean line on you -> you MUST shoot\n    bg='radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)'; glow='0 0 0 1px #d0543a,0 0 26px 5px rgba(232,89,58,.6)'; col='#ffeae6'; txt='SHOOT';\n  } else if(pexp.length>0){   /* V24 NO DOUBLE EXPOSURE (Paolo): a side has you lined up — POP OUT does not exist */\n    bg='radial-gradient(circle at 50% 40%,#6a4a1e,#241a0a 72%)'; glow='0 0 0 1px #9a7a3a,0 0 18px 3px rgba(200,150,60,.35)'; col='#e8d0a0'; txt='HOLD';\n  } else {",
        'no-double-expose-ui')
    if demo.count("txt='POP';") != 4:
        sys.exit('FAIL anchor [pop-labels]: found %d times (want 4)' % demo.count("txt='POP';"))
    demo = demo.replace("txt='POP';", "txt='POP OUT';")
    demo = sub1(demo, """\
  const exp=exposedToMe();
  if(exp.length===0 && !anyPeeking()){ setRead('NO TARGET','nobody is out — wait for a peek','#8a7d66'); return; }
  G.engageMode = exp.length>0 ? 'shoot' : 'pop';     // forced engagement vs voluntary pop""", """\
  const exp=exposedToMe();
  if(exp.length===0 && posExposed().length>0){   /* V24 NO DOUBLE EXPOSURE: never pop around your stone while a side has you lined up */
    const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
    if(!mel.length){ setRead('EXPOSED — HOLD','they are cycling: shoot when they pop, or move','#c88a3a'); return; }
    G.engageMode='shoot'; }
  else if(exp.length===0 && !anyPeeking()){ setRead('NO TARGET','nobody is out — wait for a peek','#8a7d66'); return; }
  else G.engageMode = exp.length>0 ? 'shoot' : 'pop';     // forced engagement vs voluntary pop""",
        'no-double-expose-flow')

    # LOS bead: only a broken line resets the clock
    demo = sub1(demo, "  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue; if((e2.acq||0)>=1)_broke++; e2.acq=0; }   /* V22 MOVE BREAKS THE BEAD: a moving target must be re-acquired */",
        "  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue;\n    if(myCoverAgainst(e2.ea,e2.edist)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; } }   /* V24 LOS BEAD (Paolo: 'it has to be a line of sight thing'): only BREAKING THE LINE resets his clock — walking in the open keeps you tracked */",
        'los-bead')

    # the dead lie under the living
    demo = sub1(demo, "  // me: the person, same size as every other human on the field\n  if(SPR.ready&&SPR.cv.S){",
        """\
  // V24 UNDER THE LIVING (Paolo): the dead lie on the FLOOR — they never paint over a standing body
  { const _nowD=performance.now();
    if(G.corpses)for(const c of G.corpses){ if(!c.look)continue;
      const rr=c.edist*ring, cxx=cx+Math.cos(c.ea)*rr, cyy=cy+Math.sin(c.ea)*rr;
      drawBloodPool(x,cxx,cyy,1);
      const cs=c.look.death[Math.min(c.dv||0,c.look.death.length-1)];
      drawHuman(x,cs[cs.length-1],cxx,cyy); drawCorpseHoles(x,c,cxx,cyy); }
    for(const e of G.e){ if(!e.dead)continue; const _ep=fieldPos(e,W,H,cx,cy);
      drawEnemySprite(x,e,_ep[0],_ep[1],_nowD);
      if(JUICE.AN&&!e._landed&&fallLanded(e,_nowD)){e._landed=true;landDust(_ep[0],_ep[1]+16,false);} } }
  // me: the person, same size as every other human on the field
  if(SPR.ready&&SPR.cv.S){""",
        'under-pass')
    demo = sub1(demo, """\
  if(G.corpses)for(const c of G.corpses){ if(!c.look)continue;
    const rr=c.edist*ring;   /* grid-true: the dead lie on the same ruler as the living */
    const cseq=c.look.death[Math.min(c.dv||0,c.look.death.length-1)];
    const cxx=cx+Math.cos(c.ea)*rr,cyy=cy+Math.sin(c.ea)*rr;
    drawBloodPool(x,cxx,cyy,1);
    drawHuman(x,cseq[cseq.length-1],cxx,cyy);
    drawCorpseHoles(x,c,cxx,cyy);
    fly(cxx,cyy,(c.ea*13)|0,nowMs); }   /* harvested corpses always have them; they are old */""", """\
  if(G.corpses)for(const c of G.corpses){ if(!c.look)continue;
    const rr=c.edist*ring;   /* V24: the body itself paints in the under-pass; only the flies live up here */
    const cxx=cx+Math.cos(c.ea)*rr,cyy=cy+Math.sin(c.ea)*rr;
    fly(cxx,cyy,(c.ea*13)|0,nowMs); }   /* harvested corpses always have them; they are old */""",
        'corpse-loop-strip')
    demo = sub1(demo, "    if(e.dead){pos.push(null);drawEnemySprite(x,e,ex,ey,nowMs);\n      if(JUICE.AN&&!e._landed&&fallLanded(e,nowMs)){e._landed=true;landDust(ex,ey+16,false);}   /* AN: the ground answers the body */",
        "    if(e.dead){pos.push(null);   /* V24: the body painted in the under-pass */",
        'dead-branch-strip')

    # the button cluster comes up and in
    demo = sub1(demo, "#fire{position:fixed;right:18px;bottom:18px;z-index:60;",
        "#fire{position:fixed;right:44px;bottom:44px;z-index:60;   /* V24: up-left, the ring never clips */",
        'fire-pos')
    demo = sub1(demo, "  wrap.style.cssText='position:fixed;right:18px;bottom:18px;width:92px;height:92px;z-index:59;pointer-events:none;';",
        "  wrap.style.cssText='position:fixed;right:44px;bottom:44px;width:92px;height:92px;z-index:59;pointer-events:none;';   /* V24 */",
        'ring-pos')

    # a volley is a big deal, hit or MISS
    demo = sub1(demo, "    if(G.incomingCam&&pool.length)startIncoming(pool.map(e2=>e2.i),false,'quick'); }   /* MISS CINEMATIC V14 */",
        "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick');G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24: a volley is a BIG DEAL even when it misses */",
        'miss-cam-return')
    demo = sub1(demo, "    if(G.incomingCam&&pool.length)startIncoming(pool.map(e2=>e2.i),false,'quick'); }   /* MISS CINEMATIC V14: you see WHO shot, even on a miss */",
        "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick');G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24: you see WHO shot, and the frame feels it */",
        'miss-cam-wait')
    demo = sub1(demo, "  if(G.over){cv.style.transform='';return;}\n  let dx=0,dy=0;",
        "  if(G.over){cv.style.transform='';return;}\n  let dx=0,dy=0;\n  if(G._vShakeAt){ const q=(performance.now()-G._vShakeAt)/420;\n    if(q<1){ const mg=(1-q)*5; dx+=(Math.random()-0.5)*mg; dy+=(Math.random()-0.5)*mg; } else G._vShakeAt=0; }   /* V24: incoming fire rattles the frame, hit or miss */",
        'volley-shake')

    # KICK-LOCK: the dial rides the song's kick, not the bare grid
    demo = sub1(demo, "  const fgv=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05));   // bands SHOW the true forgiven window (high-tier forgiveness + JUICE.L steady)",
        "  const _ks16=Math.floor(_bpmClock/(BPM_MS/4))%16, _kkA=((typeof FAC==='function'&&FAC().kick)||[0,8]);\n  const _kAge=(_bpmClock%(BPM_MS/4))/(BPM_MS/4);\n  const _kickP=_kkA.includes(_ks16)?Math.pow(1-_kAge,2):0;   /* V24 KICK-LOCK: the dial pulses on the SONG'S kick — the one layer every faction shares */\n  const fgv=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05));   // bands SHOW the true forgiven window (high-tier forgiveness + JUICE.L steady)",
        'kick-vars')
    demo = sub1(demo, "  band(G.W.vZ*fgv*KILL_GRACE,'rgba(230,168,74,0.85)',4,0);   // vital= amber (+10% grace)",
        "  band(G.W.vZ*fgv*KILL_GRACE,'rgba(230,168,74,0.85)',4,0);   // vital= amber (+10% grace)\n  if(_kickP>0.03){ ctx.save(); ctx.lineCap='butt'; ctx.lineWidth=2.2*S; ctx.strokeStyle='rgba(232,196,120,'+(0.34*_kickP).toFixed(3)+')';\n    ctx.shadowBlur=14*_kickP; ctx.shadowColor='rgba(255,190,90,0.75)';\n    ctx.beginPath();ctx.arc(cx,cy,RR+4*S,base-span,base+span);ctx.stroke(); ctx.restore(); }   /* V24 KICK-LOCK rim: you SEE the kick you hear */",
        'kick-rim')
    demo = sub1(demo, "  const _hb=_hot?Math.pow(1-_bpmPhase,2):0;",
        "  const _hb=_hot?Math.max(Math.pow(1-_bpmPhase,2)*0.35,_kickP):0;   /* V24: the ember pump rides the audible kick */",
        'kick-ember')
    return demo


def patch25(demo):
    """v25 EAR-LOCK (research: NecroDancer/Rhythm Quest calibration lesson):
    phone speakers deliver the kick AFTER the visual clock (AudioContext
    outputLatency, tens of ms on mobile). The kick pulse now judges by what
    the EAR hears: the pulse clock shifts by the device's measured output
    latency, automatically, no settings needed."""
    if 'V25 EAR-LOCK' in demo:
        print('v25 already applied, skipping')
        return demo
    demo = sub1(demo, "  const _ks16=Math.floor(_bpmClock/(BPM_MS/4))%16, _kkA=((typeof FAC==='function'&&FAC().kick)||[0,8]);\n  const _kAge=(_bpmClock%(BPM_MS/4))/(BPM_MS/4);",
        "  const _lms=((typeof AC!=='undefined'&&AC&&((AC.outputLatency||0)||(AC.baseLatency||0)))*1000)||0;   /* V25 EAR-LOCK: pulse to what the EAR hears — auto latency compensation */\n  const _bpmEar=_bpmClock-_lms;\n  const _ks16=Math.floor(_bpmEar/(BPM_MS/4))%16, _kkA=((typeof FAC==='function'&&FAC().kick)||[0,8]);\n  const _kAge=(((_bpmEar%(BPM_MS/4))+(BPM_MS/4))%(BPM_MS/4))/(BPM_MS/4);",
        'ear-clock')
    return demo


def patch26(demo):
    """v26 (Paolo 7/20, the three-message feedback stack):
    - HONEST MISS: the incoming camera was playing your full hit reaction
      (stagger, hit-stop, red punch, hit sound, blood spray) on volleys
      that MISSED. Misses now whip PAST you: cracks + frame rattle, tracer
      flies wide, no contact spray, your body stays cool.
    - ONLY A KILLSHOT CHAINS: a vital or hit that incidentally kills still
      plays the death, but the turn ENDS after. The double-shot without a
      killshot is dead at the root.
    - THE WOUNDED LEAK: at <=30 HP you leave a blood trail behind every
      step and a fat pool where you stand.
    - FAKE COVER IS DEAD: the debug-era hand toggle (tap a chip = magic
      cover) is deleted; e.inCover no longer drives ANY behavior. Real
      cover = a pillar between him and you AND stone within 1.8 tiles of
      HIM. Anyone without it reads as open and the cover AI runs him to
      real stone. Chip/body taps now only ever SELECT the victim.
    - SMART CAM: auto-frame frames the LIVING (kill the far men and it
      tightens in, up to 1.30x); your pinch/pan takes the wheel for 5s,
      then the auto resumes. Manual zoom-in is back.
    - DEFAULT 8 ENEMIES in the playtest.
    - TARGETING AUTO/MANUAL (settings, default AUTO): auto order is
      closest-first, always — the knife in your face outranks the far
      gun; you can still tap a first victim. MANUAL: after each killshot
      the chain PAUSES on CHOOSE NEXT until you tap the next victim
      (WAIT/MOVE ends the engagement).
    - GRIT SHOTS (the floor perk, 0..3, default 0): a miss spends a grit
      shot instead of your turn — the dial reopens on the same man. The
      chain skill stays the ceiling."""
    if 'V26 HONEST MISS' in demo:
        print('v26 already applied, skipping')
        return demo

    # --- honest miss ---
    demo = sub1(demo, ",idx:list,lethal:!!lethal,hitDone:{},",
        ",idx:list,lethal:!!lethal,miss:!!arguments[3],hitDone:{},   /* V26 HONEST MISS */", 'inc-miss-flag')
    demo = sub1(demo, "    if(inc.t>=c&&!inc.hitDone[i]){ inc.hitDone[i]=true; feltHit(); try{sndHit();}catch(_e){}",
        "    if(inc.t>=c&&!inc.hitDone[i]){ inc.hitDone[i]=true;\n      if(inc.miss){ try{fxCracks(1);}catch(_e){} G._vShakeAt=performance.now(); }   /* V26: the crack whips PAST — your body stays cool */\n      else { feltHit(); try{sndHit();}catch(_e){} }",
        'inc-miss-tick')
    demo = sub1(demo, "      const bx=ex+(cx-ex)*tp, by=(ey-27)+((cy-20)-(ey-27))*tp;",
        "      const _mx=inc.miss?((i%2?1:-1)*(30+i*9)):0;   /* V26: misses fly PAST you */\n      const bx=ex+((cx+_mx)-ex)*tp, by=(ey-27)+((cy-20)-(ey-27))*tp;",
        'inc-miss-tracer')
    demo = sub1(demo, "    else if(dt2<0.34){ const ip=(dt2-0.16)/0.18;   /* contact spray on your body */",
        "    else if(dt2<0.34&&!inc.miss){ const ip=(dt2-0.16)/0.18;   /* contact spray only when blood was real (V26) */",
        'inc-miss-spray')
    demo = sub1(demo, "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick');G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24: a volley is a BIG DEAL even when it misses */",
        "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick',true);G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24+V26: big deal, honest body */",
        'miss-caller-return')
    demo = sub1(demo, "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick');G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24: you see WHO shot, and the frame feels it */",
        "    if(G.incomingCam&&pool.length){startIncoming(pool.map(e2=>e2.i),false,pool.length>=2?null:'quick',true);G._vShakeAt=performance.now();} }   /* MISS CINEMATIC V24+V26: you see WHO shot; your body stays honest */",
        'miss-caller-wait')

    # --- only a killshot chains ---
    _death = "if(tgt.hp<=0){ tgt.dead=true; G.killStreak++; G.enemiesLeft=aliveEnemies().length; renderBoard(); tgt._deathVar=Math.floor(Math.random()*3); addWound(tgt); sndKill(); startKillshot();"
    if demo.count(_death) != 2:
        sys.exit('FAIL anchor [incidental-death]: found %d times (want 2)' % demo.count(_death))
    demo = demo.replace(_death,
        "if(tgt.hp<=0){ tgt.dead=true; G._noChain=true;   /* V26: an incidental kill is not a KILLSHOT — no chain */\n      G.killStreak++; G.enemiesLeft=aliveEnemies().length; renderBoard(); tgt._deathVar=Math.floor(Math.random()*3); addWound(tgt); sndKill(); startKillshot();")
    demo = sub1(demo, """\
function afterKill(){ if(aliveEnemies().length===0)return winGame();
  const next=nextChainTarget();
  if(next>=0){ G.popTarget=next; G.inFU=true; enterAim(true); }
  else { endTurnReturn(); } }""", """\
function afterKill(){ if(aliveEnemies().length===0)return winGame();
  if(G._noChain){ G._noChain=false; return endTurnReturn(); }   /* V26: only a true KILLSHOT buys the next man */
  const next=nextChainTarget();
  if(next<0)return endTurnReturn();
  if(G.targetMode==='manual'){ G._chainWait=true; G.phase='cover'; setPhaseUI(); renderBoard(); updGap();
    setRead('CHOOSE NEXT','tap the next victim — WAIT or MOVE ends the turn','#e8b04a'); return; }   /* V26 MANUAL TARGETING */
  G.popTarget=next; G.inFU=true; enterAim(true); }""",
        'afterkill-flow')
    demo = sub1(demo, "  G.popTarget=pickTarget();\n",
        "  G._noChain=false; G._gritUsed=0;   /* V26: fresh engagement, fresh floors */\n  G.popTarget=pickTarget();\n",
        'engage-resets')

    # --- the wounded leak ---
    demo = sub1(demo, "  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now();",
        "  if(G.pHP<=30){ (G.bloodSpots=G.bloodSpots||[]).push({ea:0,edist:0.05,r:1.8+Math.random()*1.2,jx:(Math.random()-0.5)*0.5,jy:(Math.random()-0.5)*0.5}); }   /* V26: the wounded leave a TRAIL */\n  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now();",
        'blood-trail')
    demo = sub1(demo, "  if(G.pHP<=30)G.bloodSpots.push({ea:0,edist:0.15,r:2.0+Math.random()*1.4,\n    jx:(Math.random()-0.5)*0.6,jy:(Math.random()-0.5)*0.6});",
        "  if(G.pHP<=30){ G.bloodSpots.push({ea:0,edist:0.15,r:3.2+Math.random()*1.8,jx:(Math.random()-0.5)*0.6,jy:(Math.random()-0.5)*0.6});\n    G.bloodSpots.push({ea:Math.random()*6.28,edist:0.3,r:1.6+Math.random()*1.2,jx:(Math.random()-0.5)*0.8,jy:(Math.random()-0.5)*0.8}); }   /* V26: at 30 you are LEAKING */",
        'blood-pool-beef')

    # --- fake cover dies ---
    demo = sub1(demo, "function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=pillarBetweenMe(e)?1:0; } }",
        "function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=(pillarBetweenMe(e)&&nearPillar(e))?1:0; } }   /* V26: real cover NEEDS stone near HIM — no more ducking behind a pillar that sits by YOU */",
        'gcov-near')
    demo = sub1(demo, "function peeking(e){ if(e.dead)return false; if(e.stun>0)return true; if(!(e.inCover||e.gcov))return true;",
        "function peeking(e){ if(e.dead)return false; if(e.stun>0)return true; if(!e.gcov)return true;   /* V26: fake cover dead */",
        'peek-gcov')
    demo = sub1(demo, "function firing(e){ if(e.dead||e.stun>0||e.melee)return false; const fw=coverTuning().fire; if(!(e.inCover||e.gcov)){",
        "function firing(e){ if(e.dead||e.stun>0||e.melee)return false; const fw=coverTuning().fire; if(!e.gcov){",
        'fire-gcov')
    demo = sub1(demo, "function hasLine(e){ if(e.dead||e.stun>0)return false; return (e.inCover||e.gcov)?peeking(e):true; }",
        "function hasLine(e){ if(e.dead||e.stun>0)return false; return e.gcov?peeking(e):true; }",
        'line-gcov')
    demo = sub1(demo, "    const snap=G.e.filter(e2=>!e2.dead&&!e2.melee&&e2.stun<=0&&!(e2.prone>0)&&(e2.inCover||e2.gcov)&&pool.indexOf(e2)<0);",
        "    const snap=G.e.filter(e2=>!e2.dead&&!e2.melee&&e2.stun<=0&&!(e2.prone>0)&&e2.gcov&&pool.indexOf(e2)<0);",
        'snap-gcov')
    demo = sub1(demo, "    if(e.gcov||e.inCover)continue;",
        "    if(e.gcov)continue;   /* V26: no fake flag saves you from running for stone */",
        'ai-gcov')
    demo = sub1(demo, "    if(e.inCover||e.gcov){ const fa=Math.atan2(cy-ey,cx-ex);",
        "    if(e.gcov){ const fa=Math.atan2(cy-ey,cx-ex);",
        'arc-gcov')
    demo = sub1(demo, "  if(firing(e)&&(e.gcov||(e.inCover&&nearPillar(e)))&&L.cfire112)",
        "  if(firing(e)&&e.gcov&&L.cfire112)", 'cfire-gcov')
    demo = sub1(demo, "  if((e.gcov||(e.inCover&&nearPillar(e)))&&!peeking(e)&&!firing(e)){",
        "  if(e.gcov&&!peeking(e)&&!firing(e)){", 'crouch-gcov')
    demo = sub1(demo, "    let cls='echip '+(e.inCover?'cov':'exp');",
        "    let cls='echip '+(e.gcov?'cov':'exp');", 'chip-cls-gcov')
    demo = sub1(demo, "et.textContent=e.inCover?'COV':'EXP';",
        "et.textContent=e.gcov?'COV':'EXP';", 'chip-label-gcov')
    demo = sub1(demo, "    if(prev[i]&&prev[i].coverLocked){ e.inCover=prev[i].inCover; e.coverLocked=true; }\n",
        "", 'coverlock-dead')
    demo = sub1(demo, """\
    d.onclick=ev=>{ ev.stopPropagation(); if(G.phase!=='cover')return; e.inCover=!e.inCover; e.coverLocked=true; renderBoard(); updGap(); };
    D('et'+i).onclick=ev=>{ ev.stopPropagation(); if(G.phase!=='cover')return; e.inCover=!e.inCover; e.coverLocked=true; renderBoard(); updGap(); };""", """\
    const selFn=ev=>{ ev.stopPropagation(); if(e.dead)return;   /* V26: a tap only ever PICKS the victim — the fake cover toggle is dead */
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }
      if(G.phase!=='cover')return; G.selTarget=e.i; setRead('TARGET: '+e.n,'he eats the next dial','#e8b04a'); renderBoard(); updGap(); };
    d.onclick=selFn; D('et'+i).onclick=selFn;""",
        'chip-select')
    demo = sub1(demo, """\
      if(G.selTarget!==e.i){ G.selTarget=e.i;
        setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a'); }
      else { e.inCover=!e.inCover; e.coverLocked=true; }""", """\
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }   /* V26 MANUAL CHAIN: the chosen next victim */
      G.selTarget=e.i;
      setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a');""",
        'field-select')

    # --- smart cam ---
    demo = sub1(demo, """\
    let uzT=G.userZoom;
    if(G.phase==='cover'&&!G.over&&!G.ks&&G.e&&G.e.length){
      const ringF=Math.min(W,H)*0.085; let md=0;
      for(const e of G.e)if(!e.dead&&e.edist>md)md=e.edist;
      if(md>0){ const fit=(Math.min(W/2,H/2)-96)/Math.max(80,md*ringF+70);
        uzT=Math.min(G.userZoom,Math.max(0.45,Math.min(1,fit))); } }
    G._uzE=(G._uzE==null)?uzT:G._uzE+(uzT-G._uzE)*0.10; }""", """\
    let uzT=G.userZoom;
    const _man=G._camTouchAt&&performance.now()-G._camTouchAt<5000;   /* V26 SMART CAM: your pinch drives for 5s, then the auto resumes */
    if(!_man&&G.phase==='cover'&&!G.over&&!G.ks&&G.e&&G.e.length){
      const ringF=Math.min(W,H)*0.085; let md=0;
      for(const e of G.e)if(!e.dead&&e.edist>md)md=e.edist;
      if(md>0){ const fit=(Math.min(W/2,H/2)-96)/Math.max(80,md*ringF+70);
        uzT=Math.max(0.45,Math.min(1.30,fit)); } }   /* frames the LIVING: drop the far men and it tightens IN */
    G._uzE=(G._uzE==null)?uzT:G._uzE+(uzT-G._uzE)*0.10; }""",
        'smart-cam')
    demo = sub1(demo, "function setUserZoom(z){G.userZoom=Math.max(0.6,Math.min(2.4,z));}",
        "function setUserZoom(z){G.userZoom=Math.max(0.45,Math.min(2.4,z));G._camTouchAt=performance.now();}   /* V26: touching the camera takes the wheel */",
        'cam-touch-zoom')
    demo = sub1(demo, "  G.userPan.x=Math.max(-L,Math.min(L,px2));G.userPan.y=Math.max(-L,Math.min(L,py2));}",
        "  G.userPan.x=Math.max(-L,Math.min(L,px2));G.userPan.y=Math.max(-L,Math.min(L,py2));G._camTouchAt=performance.now();}",
        'cam-touch-pan')

    # --- default 8 ---
    demo = sub1(demo, "  numEnemies:3, e:[],",
        "  numEnemies:8, e:[],   /* V26 (Paolo): the playtest defaults to a real fight */", 'default-8')
    demo = sub1(demo, '<button class="nb" data-n="1">1</button><button class="nb on" data-n="3">3</button><button class="nb" data-n="5">5</button><button class="nb" data-n="8">8</button>',
        '<button class="nb" data-n="1">1</button><button class="nb" data-n="3">3</button><button class="nb" data-n="5">5</button><button class="nb on" data-n="8">8</button>', 'default-8-ui')

    # --- targeting auto/manual + grit ---
    demo = sub1(demo, '<button id="chainskill" style="border-color:#8fe89a;color:#cfe8c0">KILLSHOTS/TURN: 3</button>',
        '<button id="chainskill" style="border-color:#8fe89a;color:#cfe8c0">KILLSHOTS/TURN: 3</button><button id="gritskill" style="border-color:#c8a23a;color:#e8d0a0">GRIT SHOTS: 0</button><button id="targmode" style="border-color:#8fb0e8;color:#c0d0e8">TARGETING: AUTO</button>',
        'skill-buttons')
    demo = sub1(demo, "  const cs=D('chainskill'); if(cs)cs.addEventListener('click',()=>{ G.chainSkill=((G.chainSkill||3)%8)+1; cs.textContent='KILLSHOTS/TURN: '+G.chainSkill; });",
        "  const cs=D('chainskill'); if(cs)cs.addEventListener('click',()=>{ G.chainSkill=((G.chainSkill||3)%8)+1; cs.textContent='KILLSHOTS/TURN: '+G.chainSkill; });\n  const gs=D('gritskill'); if(gs)gs.addEventListener('click',()=>{ audio(); G.gritShots=((G.gritShots||0)+1)%4; gs.textContent='GRIT SHOTS: '+G.gritShots; });   /* V26: the floor perk */\n  const tm=D('targmode'); if(tm)tm.addEventListener('click',()=>{ audio(); G.targetMode=(G.targetMode==='manual'?'auto':'manual'); tm.textContent='TARGETING: '+G.targetMode.toUpperCase(); });",
        'skill-handlers')
    demo = sub1(demo, "  let b=-1,bd=1e9; for(const e of pool){ const sc=(G.engageMode==='shoot'?e.edist:e.hp); if(sc<bd){bd=sc;b=e.i;} } return b; }",
        "  let b=-1,bd=1e9; for(const e of pool){ const sc=e.edist; if(sc<bd){bd=sc;b=e.i;} } return b; }   /* V26 AUTO ORDER: closest first, always — the knife in your face outranks the far gun */",
        'closest-first')
    demo = sub1(demo, "function doWait(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* cutscene law */ audio();",
        "function doWait(){ if(G._chainWait){G._chainWait=false; return endTurnReturn();}   /* V26: declining the chain ends the engagement */\n  if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* cutscene law */ audio();",
        'chainwait-wait')
    demo = sub1(demo, "function doMove(d){ if(G.inc)return;",
        "function doMove(d){ if(G.inc)return;\n  if(G._chainWait){G._chainWait=false; return endTurnReturn();}   /* V26: moving forfeits the chain */",
        'chainwait-move')
    demo = sub1(demo, """\
  // MISS -> turn ends, return fire
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;
  if(navigator.vibrate)navigator.vibrate(8);
  setRead('MISS','turn ends','#e8593a');
  G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnReturn(); },170);""", """\
  // MISS -> turn ends, return fire (V26 GRIT: the floor perk buys the shot back)
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;
  if(navigator.vibrate)navigator.vibrate(8);
  if((G.gritShots||0)>(G._gritUsed||0)&&(G._chainN||1)<(G.chainSkill||3)){
    G._gritUsed=(G._gritUsed||0)+1; if(tgt&&!tgt.dead)G.selTarget=tgt.i;
    setRead('GRIT','missed — the floor holds, shoot again ('+((G.gritShots||0)-G._gritUsed)+' left)','#c8a23a');
    setTimeout(()=>{ if(!G.over) enterAim(true); },200); return; }
  setRead('MISS','turn ends','#e8593a');
  G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnReturn(); },170);""",
        'grit-floor')
    return demo


def patch27(demo):
    """v27 (Paolo 7/20: "the auto targeting still isnt right"): the root —
    a tapped pick (G.selTarget) persisted FOREVER, so after you ever tapped
    a man, every later AUTO engagement kept aiming at your stale pick
    instead of closest-first. And G.popTarget could carry stale indexes
    across turns through enterAim's short-circuit. Now: a pick is SPENT by
    the dial it opens (auto resumes closest-first right after), and
    popTarget resets at every turn end."""
    if 'V27 PICK SPENT' in demo:
        print('v27 already applied, skipping')
        return demo
    demo = sub1(demo, "  G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }",
        "  G.popTarget>=0||(G.popTarget=pickTarget()); G.fireTarget=(isChain?nextChainTarget():G.popTarget); if(G.fireTarget<0){ return endTurnReturn(); }\n  if(G.selTarget===G.fireTarget)G.selTarget=null;   /* V27 PICK SPENT: a tap buys ONE dial — auto goes back to closest-first after */",
        'pick-spent')
    demo = sub1(demo, "  tickTurnEnd();\n  if(G._newBeads&&dmg===0&&G.pHP>0)setRead('ACQUIRING',G._newBeads+' gun'+(G._newBeads>1?'s':'')+' drawing a bead — one turn to break it','#e8a04a');   /* V22: the warning speaks */",
        "  tickTurnEnd(); G.popTarget=-1;   /* V27: no stale target carries into the next turn */\n  if(G._newBeads&&dmg===0&&G.pHP>0)setRead('ACQUIRING',G._newBeads+' gun'+(G._newBeads>1?'s':'')+' drawing a bead — one turn to break it','#e8a04a');   /* V22: the warning speaks */",
        'poptarget-reset-return')
    demo = sub1(demo, "function endTurnClean(){ setRead('HIT','clean — turn ends','#8fd0e8'); tickTurnEnd(); G.phase='cover';",
        "function endTurnClean(){ setRead('HIT','clean — turn ends','#8fd0e8'); tickTurnEnd(); G.popTarget=-1; G.phase='cover';",
        'poptarget-reset-clean')
    return demo


def patch28(demo):
    """v28 THREAT ORDER (Paolo 7/20, shouted and final): 'MELEE WEAPON PEOPLE
    ARE NOT A PRIORITY UNTIL THEY ARE ONE TILE AWAY. UNTIL THEN YOU HIT THE
    PEOPLE WITH GUNS YOU ARE EXPOSED TO FIRST.' The auto order is now a
    strict threat ladder, not raw distance:
      0. a blade AT you (<=1.6 tiles, adjacent incl. diagonal)
      1. gunmen you are EXPOSED to, closest first
      2. blades still closing
      3. everyone else (covered-side, manufactured targets)
    Distance breaks ties inside each rung."""
    if 'V28 THREAT ORDER' in demo:
        print('v28 already applied, skipping')
        return demo
    demo = sub1(demo, """\
function pickTarget(){ const pool=modePool(); if(!pool.length)return -1;
  if(G.selTarget!=null){ const s=pool.find(e=>e.i===G.selTarget); if(s)return s.i; }   /* your pick rules; auto is the fallback */
  let b=-1,bd=1e9; for(const e of pool){ const sc=e.edist; if(sc<bd){bd=sc;b=e.i;} } return b; }   /* V26 AUTO ORDER: closest first, always — the knife in your face outranks the far gun */""", """\
function pickTarget(){ const pool=modePool(); if(!pool.length)return -1;
  if(G.selTarget!=null){ const s=pool.find(e=>e.i===G.selTarget); if(s)return s.i; }   /* your pick rules; auto is the fallback */
  /* V28 THREAT ORDER (Paolo, final): a blade only jumps the queue when it is
     ON you (one tile). Until then the guns you are EXPOSED to die first,
     closest to farthest. Then closing blades. Then everyone else. */
  const _rank=e=>{
    if(e.melee&&e.edist<=1.6) return 0;                     /* knife AT you */
    if(!e.melee&&!myCoverAgainst(e.ea,e.edist)) return 1;   /* gun with a line on your blood */
    if(e.melee) return 2;                                   /* blade still closing */
    return 3; };                                            /* covered-side / the rest */
  let b=-1,bs=1e9; for(const e of pool){ const sc=_rank(e)*1000+e.edist; if(sc<bs){bs=sc;b=e.i;} } return b; }""",
        'threat-order')
    return demo


def patch29(demo):
    """v29 (Paolo 7/20, the crouch-fire + reckless-pop message):
    - RECKLESS POP: the button ALWAYS fires. Popping when nobody is out
      (or while the exposed side cycles) stands you up INTO every held
      bead: acq-holders take an opportunity shot, NO cover softening (you
      left it), and the turn is spent either way. LAW NOTE: this is the
      same class as waiting exposed (enemy-turn fire) — NO DAMAGE BEFORE
      THE DIAL governs the ENGAGE flow (your shot always resolves before
      their answer) and still holds on every engagement path.
    - CROUCH-FIRE PLUMBING: when you engage FROM cover (not popped out,
      stone near you), the aim body prefers the crouched gun sweep
      (caim bakes) the day Paolo cooks 'crouch-aim-1h'/'crouch-aim-2h'
      in the Animation chat — zero surgery later, falls back to the
      standing deadeye until then."""
    if 'V29 RECKLESS POP' in demo:
        print('v29 already applied, skipping')
        return demo

    # the button always fires: no-target and hold states become the reckless pop
    demo = sub1(demo, """\
  const exp=exposedToMe();
  if(exp.length===0 && posExposed().length>0){   /* V24 NO DOUBLE EXPOSURE: never pop around your stone while a side has you lined up */
    const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
    if(!mel.length){ setRead('EXPOSED — HOLD','they are cycling: shoot when they pop, or move','#c88a3a'); return; }
    G.engageMode='shoot'; }
  else if(exp.length===0 && !anyPeeking()){ setRead('NO TARGET','nobody is out — wait for a peek','#8a7d66'); return; }
  else G.engageMode = exp.length>0 ? 'shoot' : 'pop';     // forced engagement vs voluntary pop""", """\
  const exp=exposedToMe();
  if(exp.length===0 && posExposed().length>0){   /* V24 NO DOUBLE EXPOSURE: never pop around your stone while a side has you lined up */
    const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
    if(!mel.length){ return recklessPop(); }   /* V29: the click is YOURS — and so is the price */
    G.engageMode='shoot'; }
  else if(exp.length===0 && !anyPeeking()){ return recklessPop(); }   /* V29: popping at nothing is allowed, and punished */
  else G.engageMode = exp.length>0 ? 'shoot' : 'pop';     // forced engagement vs voluntary pop""",
        'reckless-routes')
    demo = sub1(demo, "function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;",
        """\
function recklessPop(){ /* V29 RECKLESS POP (Paolo: 'no risk for clicking pop out at the wrong time... not punishing me for fucking up'):
   the button always fires. Standing up with nothing to shoot presents you to every gun that was
   holding a bead — opportunity fire, NO cover softening (you left it), turn spent either way.
   Same class as waiting exposed: enemy-turn fire, never engage-flow damage — the dial law holds. */
  audio(); G._steadyAtPop=0; G.steady=0; G._riseAt=performance.now(); G._dropAt=0;
  const holders=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(e.acq||0)>=1);
  let hits=0,dmg=0,hitIdx=[];
  for(const e of holders){ const acc=distAccuracy(e)*0.8*((e.E.acc||0.55)/0.55);
    if(Math.random()<acc){hits++;hitIdx.push(e.i);const a=e.E.dmg;dmg+=a[0]+Math.floor(Math.random()*(a[1]-a[0]+1));} }
  if(dmg>0){ G.pHP=Math.max(0,G.pHP-dmg); updPlayer(); const _l=G.pHP<=0;
    onOffbeat(()=>{hurtFlash(); sndReturn(); setRead('RECKLESS POP',holders.length+' beads were waiting — '+dmg,'#e8593a');
      if(G.incomingCam&&_l)startIncoming(hitIdx.length?hitIdx:[0],true);
      else if(G.incomingCam)startIncoming(hitIdx,false,hitIdx.length>=2?null:'quick');});
    addWound(G); wagerBust('you took a hit'); try{parent.postMessage({type:'BOHEMIA_PLAYER_HIT',dmg:dmg,hp:G.pHP},'*');}catch(_e){}
    if(G.pHP<=0)return loseGame(); }
  else { setRead('POPPED INTO NOTHING',holders.length?(holders.length+' fired and missed — turn wasted'):'you broke cover for nothing — turn wasted','#c88a3a');
    if(G.incomingCam&&holders.length)startIncoming(holders.map(e=>e.i),false,holders.length>=2?null:'quick',true); }
  tickTurnEnd(); G.popTarget=-1; G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); renderBoard(); updGap(); }
function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;""",
        'reckless-pop-fn')

    # crouch-fire plumbing: caim bakes load and win when firing FROM cover
    demo = sub1(demo, "    SPR.cv[dir]={idle:mk(d.dirs[dir].idle),walk:(d.dirs[dir].walk||[]).map(mk),   /* V20 WALK */",
        "    SPR.cv[dir]={idle:mk(d.dirs[dir].idle),walk:(d.dirs[dir].walk||[]).map(mk),   /* V20 WALK */\n      caim:(d.dirs[dir].caim||[]).map(a=>({off:a.off,cv:mk(a.rgba)})),   /* V29: crouched gun sweep (empty until the clips land) */",
        'caim-loader')
    demo = sub1(demo, "    if(aimo){ let af=sprAimFrame(sprFacing(G.faceAng),G.angle);\n      if(G._riseAt&&_pn-G._riseAt<520&&fset.rise&&fset.rise.length)af=fset.rise[Math.min(3,Math.floor((_pn-G._riseAt)/130))];   /* out of the crouch UP into the gun */",
        "    if(aimo){ let af=sprAimFrame(sprFacing(G.faceAng),G.angle);\n      if(!G._poppedOut&&playerNearCover()&&fset.caim&&fset.caim.length){ let _bs=1e9,_bf=null;   /* V29: firing FROM the crouch — the low sweep wins when baked */\n        for(const _a of fset.caim){ const _dd=Math.abs((_a.off||0)-(G.angle||0)); if(_dd<_bs){_bs=_dd;_bf=_a.cv;} }\n        if(_bf)af=_bf; }\n      if(G._riseAt&&_pn-G._riseAt<520&&fset.rise&&fset.rise.length)af=fset.rise[Math.min(3,Math.floor((_pn-G._riseAt)/130))];   /* out of the crouch UP into the gun */",
        'caim-pose')
    return demo


def patch30(demo):
    """v30 (Paolo 7/20, the ideas verdict — 'killing people isn't as clean
    as it is in this fps. Give this shit some life'):
    - DOWNED, NOT DEAD: a killshot on a human drops him DYING at 1 HP —
      the fall plays, then he lies on the floor bleeding out, and every 5
      turns he zombie-crawls one tile toward the nearest downed/dead
      friend, smearing blood. He is out of the fight (never shoots, never
      counts for the win) but he is THERE. Walk up to him: the contextual
      button becomes FINISH (the death blow). Or walk away — sparing is a
      choice you make with your feet. Crawl CLIP pending from the
      Animation chat; the prone pose carries it until then. Incidental
      deaths (vital/hit reaching zero) stay clean deaths.
    - NERVE (loved, ruled): when half a crew is down, each survivor rolls
      his nerve every turn (10% + 6% per body past half). A broken man
      drops the gun and puts his hands up — out of the fight, standing
      there. FINISH works on him too, or spare him. Perk hooks [PENDING].
    - WOUNDED GUNS SHAKE (ruled): under 40% HP their return fire drops to
      0.8x and their tracers visibly wobble.
    - SCARS (ruled): wounds on YOUR body already persist across
      encounters (never cleared); a flawless fight adds nothing."""
    if 'V30 DOWNED' in demo:
        print('v30 already applied, skipping')
        return demo

    # the killshot DOWNS a human
    demo = sub1(demo, "    const _killed = tgt.hp<=0;\n    if(_killed){ tgt.dead=true; }",
        "    const _killed = tgt.hp<=0;\n    if(_killed){ tgt.downed=true; tgt.hp=1; tgt.stun=0; tgt.prone=0; tgt.windup=false; }   /* V30 DOWNED: a killshot drops him DYING, not clean-dead */",
        'downed-kill')
    demo = sub1(demo, "    if(G.ks){const tv=G.ks.style==='sharp'?0.18:G.ks.style==='hammer'?0.5:G.ks.style==='duel'?0.55:0.55;\n      tgt._deadAt=performance.now()+G.ks.dur*tv*1000;}\n    else tgt._deadAt=performance.now()+120;",
        "    if(G.ks){const tv=G.ks.style==='sharp'?0.18:G.ks.style==='hammer'?0.5:G.ks.style==='duel'?0.55:0.55;\n      tgt._fellAt=performance.now()+G.ks.dur*tv*1000;}\n    else tgt._fellAt=performance.now()+120;   /* V30: the FALL plays, then he is dying, not gone */",
        'downed-fall-timing')

    # out of the fight: every combat read excludes the dying and the broken
    demo = sub1(demo, "function peeking(e){ if(e.dead)return false; if(e.stun>0)return true; if(!e.gcov)return true;   /* V26: fake cover dead */",
        "function peeking(e){ if(e.dead||e.downed||e.broken)return false; if(e.stun>0)return true; if(!e.gcov)return true;   /* V26: fake cover dead; V30: the dying and the broken are out */",
        'peek-downed')
    demo = sub1(demo, "function firing(e){ if(e.dead||e.stun>0||e.melee)return false;",
        "function firing(e){ if(e.dead||e.downed||e.broken||e.stun>0||e.melee)return false;",
        'fire-downed')
    demo = sub1(demo, "function hasLine(e){ if(e.dead||e.stun>0)return false;",
        "function hasLine(e){ if(e.dead||e.downed||e.broken||e.stun>0)return false;",
        'line-downed')
    demo = sub1(demo, "function aliveEnemies(){ return G.e.filter(e=>!e.dead); }",
        "function aliveEnemies(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken); }   /* V30: the FIGHT ends when nobody can fight — the dying crawl, the broken stand */",
        'alive-downed')
    demo = sub1(demo, "function meleeTurnRun(){ if(G.over)return; G.mTurn=(G.mTurn||0)+1; let dmg=0,who=[];\n  for(const e of G.e){ if(e.dead||!e.melee)continue;",
        "function meleeTurnRun(){ if(G.over)return; G.mTurn=(G.mTurn||0)+1; let dmg=0,who=[];\n  for(const e of G.e){ if(e.dead||e.downed||e.broken||!e.melee)continue;",
        'melee-downed')
    demo = sub1(demo, "  for(const e of G.e){\n    if(e.dead||e.melee||e.stun>0||e.prone>0||e.stagger>0)continue;",
        "  for(const e of G.e){\n    if(e.dead||e.downed||e.broken||e.melee||e.stun>0||e.prone>0||e.stagger>0)continue;",
        'ai-downed')
    demo = sub1(demo, "  for(const e of G.e){ if(e.dead||e.melee){ e.acq=0; continue; }",
        "  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.melee){ e.acq=0; continue; }",
        'acq-downed')
    demo = sub1(demo, "    const snap=G.e.filter(e2=>!e2.dead&&!e2.melee&&e2.stun<=0&&!(e2.prone>0)&&e2.gcov&&pool.indexOf(e2)<0);",
        "    const snap=G.e.filter(e2=>!e2.dead&&!e2.downed&&!e2.broken&&!e2.melee&&e2.stun<=0&&!(e2.prone>0)&&e2.gcov&&pool.indexOf(e2)<0);",
        'snap-downed')
    demo = sub1(demo, "  const holders=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(e.acq||0)>=1);",
        "  const holders=G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.melee&&e.stun<=0&&(e.acq||0)>=1);",
        'reckless-downed')
    demo = sub1(demo, "  if(!aimo)for(const e of G.e){ if(e.dead)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e);",
        "  if(!aimo)for(const e of G.e){ if(e.dead||e.downed||e.broken)continue; const [ex,ey]=epos(e); const out=peeking(e)||firing(e);",
        'lines-downed')

    # the dying render low (fall once, then the floor); the broken stand hands-up
    demo = sub1(demo, """\
  /* COMBAT MOVES b13 (Paolo 7/20): the shove reads as a body, the topple is
     a body on the deck, the get-up is a body paying for it, and a tucked gun
     answering your blown engagement snaps from the crouch. Shoved/prone
     outrank the hit stagger: a man on the deck never staggers standing. */""", """\
  if(e.downed){   /* V30 DOWNED: the drop plays once, then he is DYING on the floor (crawl clip pending Paolo) */
    if(!e._fellAt)e._fellAt=now;
    if(now<e._fellAt) return firing(e)&&L.fire112?L.fire112[0]:L.idle112;
    const fseq=L.death[Math.min(e._deathVar||0,L.death.length-1)];
    const fi=Math.floor((now-e._fellAt)/150);
    if(fi<fseq.length) return fseq[Math.min(fseq.length-1,fi)];
    return L.prone112||fseq[fseq.length-1]; }
  if(e.broken){ return L.handsup112||L.idle112; }   /* V30 NERVE: the gun is down, the hands are up */
  /* COMBAT MOVES b13 (Paolo 7/20): the shove reads as a body, the topple is
     a body on the deck, the get-up is a body paying for it, and a tucked gun
     answering your blown engagement snaps from the crouch. Shoved/prone
     outrank the hit stagger: a man on the deck never staggers standing. */""",
        'downed-frames')
    demo = sub1(demo, "    for(const e of G.e){ if(!e.dead)continue; const _ep=fieldPos(e,W,H,cx,cy);",
        "    for(const e of G.e){ if(!(e.dead||(e.downed&&e._fellAt&&_nowD>e._fellAt)))continue; const _ep=fieldPos(e,W,H,cx,cy);",
        'underpass-downed')
    demo = sub1(demo, "    if(e.dead){pos.push(null);   /* V24: the body painted in the under-pass */",
        "    if(e.dead||(e.downed&&e._fellAt&&nowMs>e._fellAt)){pos.push(null);   /* V24+V30: floor bodies painted in the under-pass */",
        'living-skip-downed')
    demo = sub1(demo, "        :e.prone>0?('▼ FLOOR '+e.prone)",
        "        :e.downed?'▼ DYING':e.broken?'HANDS UP'\n        :e.prone>0?('▼ FLOOR '+e.prone)",
        'chip-downed')

    # the crawl: every 5 turns, one tile toward a downed/dead friend
    demo = sub1(demo, "  updShoveBtn(); }",
        """\
  for(const e of G.e){ if(!e.downed)continue;   /* V30: the dying crawl toward their own every 5th turn */
    e._downTurns=(e._downTurns||0)+1;
    if(e._downTurns%5!==0)continue;
    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    let bx=null,bd=1e9;
    for(const o of G.e){ if(o===e||!(o.dead||o.downed))continue;
      const ox=Math.cos(o.ea)*o.edist, oy=Math.sin(o.ea)*o.edist;
      const d2=Math.hypot(ox-ex,oy-ey); if(d2<bd){bd=d2;bx=[ox,oy];} }
    for(const c of (G.corpses||[])){ const ox=Math.cos(c.ea)*c.edist, oy=Math.sin(c.ea)*c.edist;
      const d2=Math.hypot(ox-ex,oy-ey); if(d2<bd){bd=d2;bx=[ox,oy];} }
    if(bx&&bd>0.8){ const nx=ex+(bx[0]-ex)/bd, ny=ey+(bx[1]-ey)/bd;
      e.edist=Math.max(0.4,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._crawlAt=performance.now();
      (G.bloodSpots=G.bloodSpots||[]).push({ea:e.ea,edist:e.edist,r:1.8,jx:0,jy:0}); } }
  { /* V30 NERVE: past half the crew down, every survivor rolls his nerve */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken).length, _half=Math.ceil(_tot*0.5);
    if(_down>=_half)for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;
      if(Math.random()<0.10+0.06*(_down-_half)){ e.broken=true; e.windup=false; e.acq=0; e._brokeAt=performance.now();
        setRead('NERVE BROKE', e.n+' drops the gun — hands up','#c8a23a'); } } }
  updShoveBtn(); }""",
        'crawl-nerve')
    demo = sub1(demo, "  for(const e of prev){ if(e&&e.dead){",
        "  for(const e of prev){ if(e&&(e.dead||e.downed)){   /* V30: a re-roll bleeds the dying out — they harvest as corpses */",
        'harvest-downed')

    # FINISH: the contextual button on a dying or broken man
    demo = sub1(demo, "function shoveTarget(){ let best=null;\n  for(const e of G.e){ if(e.dead)continue;\n    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&(!best||e.edist<best.edist))best=e; }\n  return best; }",
        "function shoveTarget(){ let best=null;\n  for(const e of G.e){ if(e.dead)continue;\n    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&(!best||e.edist<best.edist))best=e; }\n  return best; }\nfunction finishHim(t){ /* V30: the death blow — yours to give or withhold */\n  t.dead=true; t.downed=false; t.broken=false; t.hp=0;\n  t._deathVar=Math.floor(Math.random()*3); t._deadAt=performance.now()-1200;   /* already on the floor: no second fall */\n  addWound(t); (G.bloodSpots=G.bloodSpots||[]).push({ea:t.ea,edist:t.edist,r:3.2,jx:0,jy:0});\n  try{sndKill();}catch(_e){} G.enemiesLeft=aliveEnemies().length;\n  setRead('FINISHED', t.n+' — it is done','#e8593a'); renderBoard(); updGap();\n  if(!G.over)endTurnReturn(false); }",
        'finish-fn')
    demo = sub1(demo, "function updShoveBtn(){ const b=D('shovebtn'); if(!b)return;\n  const t=(G.phase==='cover'&&!G.over&&!G.inc)?shoveTarget():null;\n  b.style.display=t?'':'none';\n  if(t){ const braced=(t.stun>0||t.stunCooldown>0);\n    b.textContent='SHOVE '+t.n+(braced?' (braced)':' ('+(G.perkShoulder?'stun 2':'stun 1')+' \\u00b7 '+(G.perkShoulder?50:30)+'%)'); } }",
        "function updShoveBtn(){ const b=D('shovebtn'); if(!b)return;\n  const t=((G.phase==='cover'&&!G.inc)||(G.over&&G.win))?shoveTarget():null;   /* V30: the choice exists on the victory walk too */\n  b.style.display=t?'':'none';\n  if(t){ if(t.downed||t.broken){ b.textContent='FINISH '+t.n+(t.broken?' (surrendered)':' (dying)'); return; }   /* V30: the death blow is a CHOICE */\n    if(G.over){ b.style.display='none'; return; }\n    const braced=(t.stun>0||t.stunCooldown>0);\n    b.textContent='SHOVE '+t.n+(braced?' (braced)':' ('+(G.perkShoulder?'stun 2':'stun 1')+' \\u00b7 '+(G.perkShoulder?50:30)+'%)'); } }",
        'finish-btn')
    demo = sub1(demo, "function doShove(){ if(G.phase!=='cover'||G.over||G.inc)return; const t=shoveTarget(); if(!t)return; audio();",
        "function doShove(){ if(G.inc)return; const t=shoveTarget(); if(!t)return;\n  if(t.downed||t.broken){ if(G.phase==='cover'||(G.over&&G.win)){ audio(); return finishHim(t); } return; }   /* V30 */\n  if(G.phase!=='cover'||G.over)return; audio();",
        'finish-route')

    # wounded guns shake
    demo = sub1(demo, "  for(const e of pool){ const acc=distAccuracy(e)*(firing(e)?1:0.6); if(Math.random()<acc){hits++; hitIdx.push(e.i); const a=e.E.dmg; dmg+=a[0]+Math.floor(Math.random()*(a[1]-a[0]+1));} }",
        "  for(const e of pool){ const acc=distAccuracy(e)*(firing(e)?1:0.6)*(e.hp<=e.max*0.4?0.8:1);   /* V30: wounded guns shake */\n    if(Math.random()<acc){hits++; hitIdx.push(e.i); const a=e.E.dmg; dmg+=a[0]+Math.floor(Math.random()*(a[1]-a[0]+1));} }",
        'shake-wait')
    demo = sub1(demo, "  for(const e of pool){ const cov=myCoverAgainst(e.ea,e.edist); const acc=distAccuracy(e)*(firing(e)?1:0.6)*(cov?0.4:1)*((e.E.acc||0.55)/0.55);",
        "  for(const e of pool){ const cov=myCoverAgainst(e.ea,e.edist); const acc=distAccuracy(e)*(firing(e)?1:0.6)*(cov?0.4:1)*((e.E.acc||0.55)/0.55)*(e.hp<=e.max*0.4?0.8:1);   /* V30: wounded guns shake */",
        'shake-return')
    demo = sub1(demo, "      const _mx=inc.miss?((i%2?1:-1)*(30+i*9)):0;   /* V26: misses fly PAST you */\n      const bx=ex+((cx+_mx)-ex)*tp, by=(ey-27)+((cy-20)-(ey-27))*tp;",
        "      const _mx=inc.miss?((i%2?1:-1)*(30+i*9)):0;   /* V26: misses fly PAST you */\n      const _wob=(e.hp<=(e.max||100)*0.4)?Math.sin(inc.t*40+i*3)*3:0;   /* V30: a hurt gun's tracer wobbles */\n      const bx=ex+((cx+_mx)-ex)*tp, by=(ey-27)+((cy-20+_wob)-(ey-27))*tp;",
        'shake-tracer')
    return demo


def patch30b(demo):
    """v30b: the look loader carries the surrender bake (handsup112)."""
    if 'V30B SURRENDER LOADER' in demo:
        print('v30b already applied, skipping')
        return demo
    demo = sub1(demo, "      walk112:L.walk112?L.walk112.map(b=>mkAt(b,112,112)):null,",
        "      walk112:L.walk112?L.walk112.map(b=>mkAt(b,112,112)):null,\n      handsup112:L.handsup112?mkAt(L.handsup112,112,112):null,   /* V30B SURRENDER LOADER */",
        'surrender-loader')
    return demo


def patch31(demo):
    """v31 (autonomous hardening pass, 7/21 — the DOWNED/NERVE system made
    robust for real play):
    - AREA-CLEAR SOFTLOCK KILLED: tickTurnEnd runs the nerve roll, but no
      path re-checked the win after it. A nerve break (or downing) that
      cleared the last standing fighter during a WAIT / covered turn left
      aliveEnemies()===0 with NO win screen — you'd be stranded among
      crawling bodies with nothing to do. Every turn-settle path now
      checks checkClear() the instant tickTurnEnd resolves.
    - THE FINISH HAS WEIGHT: the death blow now lands with a hitstop, a
      heavier blood burst, and a haptic thud — killing point-blank should
      FEEL different from a clean dial kill.
    - THE CRAWL DRAGS: a dying man smears blood at BOTH ends of his crawl
      (old spot + new spot), so it reads as a body being dragged, not a
      drip."""
    if 'V31 AREA CLEAR' in demo:
        print('v31 already applied, skipping')
        return demo

    # the win guard, one helper, called after every tickTurnEnd
    demo = sub1(demo, "function winGame(){ camHome(); G.over=true; G.win=true; G.phase='over';",
        "function checkClear(){ if(!G.over && aliveEnemies().length===0){ winGame(); return true; } return false; }   /* V31 AREA CLEAR: the fight ends the instant nobody can fight — nerve breaks and downings included */\nfunction winGame(){ camHome(); G.over=true; G.win=true; G.phase='over';",
        'checkclear-fn')
    demo = sub1(demo, "  tickTurnEnd();   /* MELEE V2 DOWAIT: waiting is a turn — blades advance through the one choke */",
        "  tickTurnEnd(); if(checkClear())return;   /* MELEE V2 DOWAIT: waiting is a turn — blades advance through the one choke; V31: a broken/downed field wins here too */",
        'clear-dowait')
    demo = sub1(demo, "  tickTurnEnd(); G.popTarget=-1;   /* V27: no stale target carries into the next turn */",
        "  tickTurnEnd(); if(checkClear())return; G.popTarget=-1;   /* V27: no stale target carries into the next turn */",
        'clear-return')
    demo = sub1(demo, "  tickTurnEnd(); G.popTarget=-1; G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); renderBoard(); updGap(); }",
        "  tickTurnEnd(); if(checkClear())return; G.popTarget=-1; G.phase='cover'; G._dropAt=performance.now(); G._riseAt=0; setPhaseUI(); renderBoard(); updGap(); }",
        'clear-reckless')
    demo = sub1(demo, "function endTurnClean(){ setRead('HIT','clean — turn ends','#8fd0e8'); tickTurnEnd(); G.popTarget=-1; G.phase='cover';",
        "function endTurnClean(){ setRead('HIT','clean — turn ends','#8fd0e8'); tickTurnEnd(); if(checkClear())return; G.popTarget=-1; G.phase='cover';",
        'clear-clean')

    # the finish has weight
    demo = sub1(demo, "  addWound(t); (G.bloodSpots=G.bloodSpots||[]).push({ea:t.ea,edist:t.edist,r:3.2,jx:0,jy:0});\n  try{sndKill();}catch(_e){} G.enemiesLeft=aliveEnemies().length;",
        "  addWound(t); const _bl=(G.bloodSpots=G.bloodSpots||[]);\n  _bl.push({ea:t.ea,edist:t.edist,r:3.8,jx:0,jy:0}); _bl.push({ea:t.ea,edist:t.edist,r:2.2,jx:(Math.random()-0.5)*0.9,jy:(Math.random()-0.5)*0.9});   /* V31: a heavier pool */\n  G._hitstop=Math.max(G._hitstop||0,10);   /* V31: the death blow lands with weight — the world catches for a beat */\n  if(navigator.vibrate)navigator.vibrate([18,26,60]);\n  try{sndKill();}catch(_e){} G.enemiesLeft=aliveEnemies().length;",
        'finish-weight')

    # the crawl drags a smear at both ends
    demo = sub1(demo, "    if(bx&&bd>0.8){ const nx=ex+(bx[0]-ex)/bd, ny=ey+(bx[1]-ey)/bd;\n      e.edist=Math.max(0.4,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._crawlAt=performance.now();\n      (G.bloodSpots=G.bloodSpots||[]).push({ea:e.ea,edist:e.edist,r:1.8,jx:0,jy:0}); } }",
        "    if(bx&&bd>0.8){ (G.bloodSpots=G.bloodSpots||[]).push({ea:e.ea,edist:e.edist,r:1.5,jx:0,jy:0});   /* V31: smear where he WAS */\n      const nx=ex+(bx[0]-ex)/bd, ny=ey+(bx[1]-ey)/bd;\n      e.edist=Math.max(0.4,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); e._crawlAt=performance.now();\n      G.bloodSpots.push({ea:e.ea,edist:e.edist,r:1.8,jx:0,jy:0}); } }   /* and where he drags TO */",
        'crawl-drag')
    return demo


def patch32(demo):
    """v32 (Paolo 7/21, the big diagnosis message — five real bugs + four
    new rulings, all in one pass):

    BUGS FOUND AND FIXED:
    - THE HOLD SOFTLOCK: posExposed() counted ANY uncovered gunman as a
      reason to block POP OUT, even a single covered-but-not-peeking
      enemy in a 1v1, even downed/broken men. That made the button read
      HOLD forever in exactly the scenarios he described ("my action
      button never goes green," "1v1ing this enemy... never a good
      time to shoot him"). Fix: NO DOUBLE EXPOSURE only applies when
      there's an actual COVERED side to protect (coveredFromMe()) AND
      an exposed side that isn't dead/downed/broken. A lone covered
      enemy with nothing else on the board just runs the normal
      POP OUT flow.
    - THE SILENT READOUT: setRead() has written every combat message to
      G.lastRead and then IMMEDIATELY HIDDEN the on-screen element since
      an earlier session retired it — GRIT, NERVE BROKE, KILL ARC,
      ACQUIRING, all of it has been invisible this whole time. That is
      why grit shots and the KILL ARC state read as unexplained bugs.
      Fix: a real action log, top-left, light white text, last 5 lines,
      fading with age — his exact ask (4) and the fix for "idk what
      grit shots is."
    - DELAYED BLOOD: a killshot survivor didn't leave a floor pool until
      the NEXT tickTurnEnd (one turn later). Fix: the pool drops the
      instant he goes down.
    - NERVE TOO LIBERAL: the morale roll fired on EVERY idle turn once
      half the crew was down, so waiting around eventually broke
      everyone regardless of new violence. Fix: the roll only fires
      the turn a NEW casualty happens (tracked via G._nerveLastDown) —
      morale cracks when a friend just died in front of them, not from
      ambient dread while you do nothing.
    - KILL ARC CONFUSION (not a bug, documented): SEC-BOT has 160 base
      hp; a flat 100 killshot leaves it at 60/160 = 37.5%, which is
      what read as "killshot doesn't kill, shoots again at 40%." The
      readout now being visible (see above) makes this legible in play
      instead of feeling broken.

    NEW RULINGS BUILT:
    - WEAPON-GATED LETHALITY: a shotgun killshot is always dead-dead
      (skips DOWNED entirely — his exact ruling). Pistol never
      auto-kills on a killshot (always downs — the pacifist's tool).
      SMG/rifle roll a lethality chance in between. Floor numbers from
      research (records/BOHEMIA_COMBAT_LETHALITY_RESEARCH_7_21_26.txt):
      pistol 0%, smg 15%, rifle 35%, shotgun 100%.
    - KNEEL AND BEG: once you're within finish range of a downed man
      (not just crawling toward a friend), he kneels with his hands up
      instead of lying there, and a wiggling pleading line hovers over
      his head. Broken (surrendered) men already stood hands-up; they
      get the same begging text.
    - MANUAL TARGET RING: every valid target gets a visible ring in
      manual mode, and a SELECT A TARGET prompt shows when nothing is
      chosen yet."""
    if 'V32 HOLD FIX' in demo:
        print('v32 already applied, skipping')
        return demo

    # --- the HOLD softlock ---
    demo = sub1(demo, "function posExposed(){ return G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist)); }   /* V24: POSITIONAL exposure — who could line you up, out or cycling */",
        "function posExposed(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.melee&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist)); }   /* V24+V32: POSITIONAL exposure — who could line you up, out or cycling (the dying and the surrendered never count) */\nfunction coveredFromMe(){ return G.e.filter(e=>!e.dead&&!e.downed&&!e.broken&&!e.melee&&e.stun<=0&&myCoverAgainst(e.ea,e.edist)); }   /* V32 HOLD FIX: the side you WOULD be neglecting by popping toward it — nothing to neglect, nothing to hold for */",
        'posexposed-covered')
    demo = sub1(demo, "  } else if(pexp.length>0){   /* V24 NO DOUBLE EXPOSURE (Paolo): a side has you lined up — POP OUT does not exist */",
        "  } else if(pexp.length>0 && coveredFromMe().length>0){   /* V32 HOLD FIX: only gate when there is BOTH a covered side to protect AND an exposed side threatening it — a lone exposed enemy just runs the normal flow */",
        'updgap-hold-gate')
    demo = sub1(demo, "  const exp=exposedToMe();\n  if(exp.length===0 && posExposed().length>0){   /* V24 NO DOUBLE EXPOSURE: never pop around your stone while a side has you lined up */",
        "  const exp=exposedToMe();\n  if(exp.length===0 && posExposed().length>0 && coveredFromMe().length>0){   /* V32 HOLD FIX: same gate as updGap — no covered side, no double-exposure risk */",
        'dopop-hold-gate')

    # --- the silent readout: a real, visible action log ---
    demo = sub1(demo, "function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now()}; const r=D('cread'); if(r&&r.style.display!=='none')r.style.display='none'; }",
        "function setRead(t,s,col){ G.lastRead={t:t,s:s||'',at:Date.now()}; const r=D('cread'); if(r&&r.style.display!=='none')r.style.display='none';\n  (G._actionLog=G._actionLog||[]).push({t:t,s:s||'',at:performance.now()}); if(G._actionLog.length>6)G._actionLog.shift(); }   /* V32 THE SILENT READOUT: #cread was retired and never replaced — every message since has written to memory and shown NOBODY anything */",
        'setread-log')
    demo = sub1(demo, "  if(G.ks) driveKillshotCamera(ctx,W,H,cx,cy,RAD,S);\n  screenOverlays(ctx,W,H);\n}",
        """\
  if(G.ks) driveKillshotCamera(ctx,W,H,cx,cy,RAD,S);
  screenOverlays(ctx,W,H);
  drawActionLog(ctx,W,H);   /* V32: the light white corner log — every shot, miss, GRIT, NERVE, KILL ARC, ACQUIRING, visible for the first time */
}
function drawActionLog(ctx,W,H){
  const log=G._actionLog; if(!log||!log.length)return; const now=performance.now();
  ctx.save(); ctx.textAlign='left'; ctx.font='600 10px Space Grotesk, ui-monospace, monospace';
  let y=14;
  for(let i=Math.max(0,log.length-5);i<log.length;i++){ const L=log[i], age=(now-L.at)/1000, a=Math.max(0,0.62-age*0.07);
    if(a<=0.02)continue;
    ctx.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';
    ctx.fillText(L.t+(L.s?(' — '+L.s):''),10,y); y+=13; }
  ctx.restore();
}""",
        'draw-actionlog')

    # --- delayed blood on downing ---
    demo = sub1(demo, "    if(_killed){ tgt.downed=true; tgt.hp=1; tgt.stun=0; tgt.prone=0; tgt.windup=false; }   /* V30 DOWNED: a killshot drops him DYING, not clean-dead */",
        """\
    if(_killed){
      const _lethalRoll=(WEAPON==='shotgun')||(Math.random()<(WEAPON_LETHAL[WEAPON]||0));   /* V32 WEAPON-GATED LETHALITY */
      if(_lethalRoll){ tgt.dead=true; }   /* his ruling: this weapon finishes the job, no downed state */
      else { tgt.downed=true; tgt.hp=1; tgt.stun=0; tgt.prone=0; tgt.windup=false;
        (G.bloodSpots=G.bloodSpots||[]).push({ea:tgt.ea,edist:tgt.edist,r:2.6,jx:0,jy:0});   /* V32: the pool starts the instant he drops, not next turn */
      }
    }""",
        'weapon-lethality')
    demo = sub1(demo, "let WEAPON='shotgun';",
        "let WEAPON='shotgun';\nconst WEAPON_LETHAL={pistol:0,smg:0.15,rifle:0.35,shotgun:1.0};   /* V32 (Paolo, research floor): a killshot's odds of being FINAL rather than DOWNED, by weapon */",
        'weapon-lethal-table')

    # --- nerve: event-triggered, not ambient ---
    demo = sub1(demo, """\
  { /* V30 NERVE: past half the crew down, every survivor rolls his nerve */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken).length, _half=Math.ceil(_tot*0.5);
    if(_down>=_half)for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;
      if(Math.random()<0.10+0.06*(_down-_half)){ e.broken=true; e.windup=false; e.acq=0; e._brokeAt=performance.now();
        setRead('NERVE BROKE', e.n+' drops the gun — hands up','#c8a23a'); } } }""", """\
  { /* V32 NERVE (Paolo: too liberal — waiting 5 turns shouldn't crack a whole crew).
       The roll fires ONLY the turn a NEW casualty happens, not every idle turn. */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken).length, _half=Math.ceil(_tot*0.5);
    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;
      if(Math.random()<0.18+0.08*(_down-_half)){ e.broken=true; e.windup=false; e.acq=0; e._brokeAt=performance.now();
        setRead('NERVE BROKE', e.n+' drops the gun — hands up','#c8a23a'); } }
    G._nerveLastDown=_down; }""",
        'nerve-event-gated')

    # --- kneel and beg when adjacent ---
    demo = sub1(demo, """\
  if(e.downed){   /* V30 DOWNED: the drop plays once, then he is DYING on the floor (crawl clip pending Paolo) */
    if(!e._fellAt)e._fellAt=now;
    if(now<e._fellAt) return firing(e)&&L.fire112?L.fire112[0]:L.idle112;
    const fseq=L.death[Math.min(e._deathVar||0,L.death.length-1)];
    const fi=Math.floor((now-e._fellAt)/150);
    if(fi<fseq.length) return fseq[Math.min(fseq.length-1,fi)];
    return L.prone112||fseq[fseq.length-1]; }
  if(e.broken){ return L.handsup112||L.idle112; }   /* V30 NERVE: the gun is down, the hands are up */""", """\
  if(e.downed){   /* V30 DOWNED: the drop plays once, then he is DYING on the floor (crawl clip pending Paolo) */
    if(!e._fellAt)e._fellAt=now;
    if(now<e._fellAt) return firing(e)&&L.fire112?L.fire112[0]:L.idle112;
    if(e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112)return L.handsup112;   /* V32 KNEEL AND BEG: close the distance and he begs YOU specifically */
    const fseq=L.death[Math.min(e._deathVar||0,L.death.length-1)];
    const fi=Math.floor((now-e._fellAt)/150);
    if(fi<fseq.length) return fseq[Math.min(fseq.length-1,fi)];
    return L.prone112||fseq[fseq.length-1]; }
  if(e.broken){ return L.handsup112||L.idle112; }   /* V30 NERVE: the gun is down, the hands are up */""",
        'kneel-and-beg')

    # begging text render (world/camera space, over the head, wiggling)
    demo = sub1(demo, "    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */\n      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }",
        """\
    if(G.selTarget===e.i&&!e.dead){ x.strokeStyle='rgba(232,176,74,0.9)'; x.lineWidth=2.5;   /* your chosen man */
      x.beginPath(); x.arc(ex,ey,er*1.75,0,7); x.stroke(); }
    if(G.targetMode==='manual'&&!e.dead&&(peeking(e)||firing(e)||e.melee)&&G.selTarget!==e.i){   /* V32 MANUAL TARGET RING: every valid pick is visible */
      x.strokeStyle='rgba(150,170,205,0.5)'; x.lineWidth=1.6; x.setLineDash([3,3]);
      x.beginPath(); x.arc(ex,ey,er*1.6,0,7); x.stroke(); x.setLineDash([]); }
    if((e.broken||(e.downed&&e._fellAt&&nowMs>=e._fellAt&&e.edist<=BohemiaMelee.SHOVE_RANGE))&&BEG_LINES.length){   /* V32 KNEEL AND BEG: he pleads with YOU */
      const _bi=(e.i*7+(e._brokeAt||e._fellAt||0)|0)%BEG_LINES.length, _wig=Math.sin(nowMs*0.006+e.i*2)*2;
      x.font='600 9px Space Grotesk, sans-serif'; x.textAlign='center';
      x.fillStyle='rgba(255,255,255,0.72)'; x.fillText(BEG_LINES[_bi],ex+_wig,ey-er*2.6);
      x.textAlign='left'; }""",
        'beg-text-render')
    demo = sub1(demo, "let WEAPON='shotgun';",
        "let WEAPON='shotgun';\nconst BEG_LINES=['please... don\\'t','i surrender!','i have a family','don\\'t shoot!','mercy... please','i\\'m done, i\\'m done'];   /* V32 KNEEL AND BEG */",
        'beg-lines-const')

    # SELECT A TARGET prompt in manual mode with nothing chosen
    demo = sub1(demo, "  ctx.restore();   // <-- end camera transform",
        """\
  if(G.targetMode==='manual'&&G.phase==='cover'&&!G.over&&G.selTarget==null&&(G._chainWait||exposedToMe().length>0)){   /* V32 MANUAL TARGET RING: the prompt */
    ctx.save(); ctx.textAlign='center'; ctx.font='700 12px Space Grotesk, sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fillText('SELECT A TARGET',cx,cy-RAD*0.72); ctx.textAlign='left'; ctx.restore(); }
  ctx.restore();   // <-- end camera transform""",
        'select-target-prompt')
    return demo


def patch32b(demo):
    """v32b: the action log verified via raw pixel scan (real brightness
    delta over the floor tiles) but too faint to actually READ against a
    busy tiled background. Adds a soft dark halo (shadowBlur) behind the
    light text — legible over any floor color, still reads as 'light'."""
    if 'V32B LEGIBLE LOG' in demo or 'V32C LOG PANEL' in demo:   # v32c supersedes v32b's marker text
        print('v32b already applied, skipping')
        return demo
    demo = sub1(demo, "  for(let i=Math.max(0,log.length-5);i<log.length;i++){ const L=log[i], age=(now-L.at)/1000, a=Math.max(0,0.62-age*0.07);\n    if(a<=0.02)continue;\n    ctx.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';\n    ctx.fillText(L.t+(L.s?(' — '+L.s):''),10,y); y+=13; }",
        "  for(let i=Math.max(0,log.length-5);i<log.length;i++){ const L=log[i], age=(now-L.at)/1000, a=Math.max(0,0.62-age*0.07);   /* V32B LEGIBLE LOG */\n    if(a<=0.02)continue;\n    ctx.shadowColor='rgba(0,0,0,'+(a*0.9).toFixed(3)+')'; ctx.shadowBlur=3;\n    ctx.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';\n    ctx.fillText(L.t+(L.s?(' — '+L.s):''),10,y); y+=13; }\n  ctx.shadowBlur=0;",
        'log-halo')
    return demo


def patch32c(demo):
    """v32c: the shadow-halo (v32b) was verified via pixel scan but STILL
    imperceptible to a human eye against the busy tiled floor at 10px/0.62
    alpha — confirmed by 4x-zoomed screenshot inspection, not just pixel
    math. A per-glyph shadow was never going to fix a legibility problem
    at this text size. Real fix: a genuine translucent dark backing panel
    behind the whole log block — the panel carries the 'reads clearly'
    job, the text stays light/white as Paolo asked, at higher contrast
    against a KNOWN dark background instead of an unpredictable floor."""
    if 'V32C LOG PANEL' in demo:
        print('v32c already applied, skipping')
        return demo
    demo = sub1(demo, """\
function drawActionLog(ctx,W,H){
  const log=G._actionLog; if(!log||!log.length)return; const now=performance.now();
  ctx.save(); ctx.textAlign='left'; ctx.font='600 10px Space Grotesk, ui-monospace, monospace';
  let y=14;
  for(let i=Math.max(0,log.length-5);i<log.length;i++){ const L=log[i], age=(now-L.at)/1000, a=Math.max(0,0.62-age*0.07);   /* V32B LEGIBLE LOG */
    if(a<=0.02)continue;
    ctx.shadowColor='rgba(0,0,0,'+(a*0.9).toFixed(3)+')'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';
    ctx.fillText(L.t+(L.s?(' — '+L.s):''),10,y); y+=13; }
  ctx.shadowBlur=0;
  ctx.restore();
}""", """\
function drawActionLog(ctx,W,H){   /* V32C LOG PANEL: a real backing, not a shadow trick — legible over ANY floor */
  const log=G._actionLog; if(!log||!log.length)return; const now=performance.now();
  const rows=[]; for(let i=Math.max(0,log.length-5);i<log.length;i++){ const L=log[i], age=(now-L.at)/1000, a=Math.max(0,1-age*0.11);
    if(a<=0.02)continue; rows.push({txt:L.t+(L.s?(' — '+L.s):''),a}); }
  if(!rows.length)return;
  ctx.save(); ctx.textAlign='left'; ctx.font='600 10px Space Grotesk, ui-monospace, monospace';
  let maxW=0; for(const r of rows)maxW=Math.max(maxW,ctx.measureText(r.txt).width);
  const panelA=Math.min(0.5,rows[rows.length-1].a*0.55);
  ctx.fillStyle='rgba(10,8,6,'+panelA.toFixed(3)+')';
  ctx.fillRect(6,6,Math.min(W-16,maxW+14),rows.length*14+6);
  let y=17; for(const r of rows){ ctx.fillStyle='rgba(255,255,255,'+(0.55+r.a*0.35).toFixed(3)+')'; ctx.fillText(r.txt,12,y); y+=14; }
  ctx.restore();
}""",
        'log-panel')
    return demo


def patch32d(demo):
    """v32d: THE REAL ROOT CAUSE of the invisible log — draw() has TWO
    exit paths. The cover-phase branch (G.phase!=='aim' && !G.ks — i.e.
    ~95% of actual play, exactly where GRIT/NERVE/ACQUIRING/HOLD fire)
    calls screenOverlays and returns EARLY, never reaching the tail
    where drawActionLog lived. Proven with a pixel-exact before/after
    diff: calling drawActionLog directly darkens 3429/4500 sampled
    pixels correctly; calling the real draw() in cover phase changes
    ZERO pixels, because it never gets there. Fix: call it from BOTH
    exits, not just the aim/killshot one."""
    if 'V32D BOTH EXITS' in demo:
        print('v32d already applied, skipping')
        return demo
    demo = sub1(demo, "    if(G.inc){incDrawFX(ctx,W,H,cx,cy);ctx.restore();}\n    ctx.restore(); screenOverlays(ctx,W,H); return; }",
        "    if(G.inc){incDrawFX(ctx,W,H,cx,cy);ctx.restore();}\n    ctx.restore(); screenOverlays(ctx,W,H); drawActionLog(ctx,W,H); return; }   /* V32D BOTH EXITS: this is the COVER PHASE path — where the log actually needs to live */",
        'log-both-exits')
    return demo


def patch33(demo):
    """v33 (Paolo 7/21): (1) THREAT ORDER, THE REAL FIX — v28's rank-0
    check used a flat 1.6-tile distance, ignoring each blade's ACTUAL
    reach and windup state. A spear (reach 4.2) closing in, or a shiv
    already winding up its strike, could sit outside 1.6 tiles and lose
    priority to a distant gun that isn't even close to touching you —
    his exact 'jumping over my cover to shank me and I'm still not
    targeting them' report. Rank-0 is now: winding up (a locked-in
    strike, no matter the distance) OR within HIS OWN reach + a half-
    tile margin. Uses the enemy's real weapon stat, not a guess.
    (2) LETHALITY RETUNE (research, his ask 'a pistol shouldn't never
    kill', 'tone the surrendering down'): general civilian handgun GSW
    fatality runs 10-22% (NCBI/trauma-center data) even before aiming
    is factored in — 0% was never honest. New floor: pistol 20%, smg
    35%, rifle 55%, shotgun 100% (unchanged, his ruling). (3) NERVE
    retuned down (0.18/0.08 -> 0.10/0.05) — still event-gated (v32),
    now genuinely rarer on top of that."""
    if 'V33 THREAT REACH' in demo:
        print('v33 already applied, skipping')
        return demo

    demo = sub1(demo, "    if(e.melee&&e.edist<=1.6) return 0;                     /* knife AT you */",
        "    if(e.melee&&(e.windup||e.edist<=(e.reach||1.8)+0.3)) return 0;   /* V33 THREAT REACH: a windup is a LOCKED strike regardless of distance; otherwise judge by HIS reach, not a flat guess — the spear/bat that jumped your cover now ranks first */",
        'threat-reach')
    demo = sub1(demo, "const WEAPON_LETHAL={pistol:0,smg:0.15,rifle:0.35,shotgun:1.0};   /* V32 (Paolo, research floor): a killshot's odds of being FINAL rather than DOWNED, by weapon */",
        "const WEAPON_LETHAL={pistol:0.20,smg:0.35,rifle:0.55,shotgun:1.0};   /* V33 (Paolo, research retune): general handgun GSW fatality runs 10-22%% even unaimed — 0%% was never honest; the rest scaled up with it */",
        'lethal-retune')
    demo = sub1(demo, "    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;\n      if(Math.random()<0.18+0.08*(_down-_half)){",
        "    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){ if(e.dead||e.downed||e.broken)continue;\n      if(Math.random()<0.10+0.05*(_down-_half)){   /* V33: toned down further on top of v32's event-gating */",
        'nerve-retune')
    return demo


def patch34(demo):
    """v34 (Paolo 7/21, the killshot-armor design answer he liked): a
    perfect killshot that doesn't finish an armored target (took max
    damage, still standing) now resolves exactly like a VITAL — stun 2
    (no stun-lock), turn ends CLEAN, no chain, no same-turn re-target.
    Armor used to cost nothing but an extra click; now surviving a
    killshot buys the target a real turn (move, cover, return fire)
    before you can finish the job, whether it's a man or a robot."""
    if 'V34 KILL ARC = VITAL' in demo:
        print('v34 already applied, skipping')
        return demo
    demo = sub1(demo, """\
      /* SURVIVED THE KILL ARC (future elites/bosses/robots): took 100-armor, still
         standing. No death, but the kill arc still buys the clean turn -> chain on,
         NO return fire from this target. */
      tgt._hitAt=performance.now(); addWound(tgt); renderBoard();
      setRead('KILL ARC', tgt.n+' took '+KILL_DMG+' — still up · chain on','#c8a23a');
      setTimeout(()=>{ if(!G.over) enterAim(true); },150); return;
    }""", """\
      /* V34 KILL ARC = VITAL (Paolo, ruled): took max damage, still standing — a
         perfect shot doesn't waive armor. Same treatment as a vital: stun 2 (no
         stun-lock), turn ends CLEAN, no chain. Surviving buys him a real turn. */
      if(tgt.stunCooldown<=0) tgt.stun=2; tgt.windup=false;
      tgt._hitAt=performance.now(); addWound(tgt); renderBoard();
      sndVital(); if(navigator.vibrate)navigator.vibrate(24);
      setRead('KILL ARC — STUN', tgt.n+' took '+KILL_DMG+' and held — frozen 2 turns, turn ends','#c8a23a');
      G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnClean(); },170); return;
    }""",
        'killarc-is-vital')
    return demo


def patch35(demo):
    """v35 (Paolo 7/21, the diagnosis-heavy message): six real bugs, two
    new mechanics.
    BUGS:
    - CAMERA WON'T TIGHTEN: the AUTO FRAME max-distance loop only
      excluded e.dead — a downed/dying/broken/fleeing body sitting far
      away kept the zoom wide forever even though he's out of the fight.
    - DOUBLE-ZOOM FIGHTING THE KILLCAM: AUTO FRAME kept re-targeting and
      easing G._uzE even while the dedicated killshot camera (G.ks) was
      driving its OWN zoom on top — two competing zoom transforms
      compounding is the likely cause of his 'falling before the bullet
      hits' desync. AUTO FRAME now freezes the instant G.ks starts.
    - STICKY AUTO-BREAKING TAPS: tapping any enemy body (chip or field)
      set G.selTarget unconditionally, even in AUTO mode — one curious
      tap silently overrode closest-priority targeting until the pick
      got 'spent'. Now a tap only locks a pick in MANUAL mode (or when
      resolving a forced CHOOSE NEXT).
    - FAKE COVER, TAKE THREE: pillarBetweenMe() and nearPillar() each
      independently scanned ALL pillars — an enemy near pillar A (far
      from blocking) while pillar B (blocking, but not near him) sat on
      the sightline would satisfy gcov=true with no actual stone next
      to his body. Real fix: ONE pillar must satisfy BOTH conditions.
    NEW MECHANICS:
    - DIAL DIFFICULTY BY EXPOSURE (his ask): a covered target pulls the
      package harder (+1), an exposed one pulls it easier (-1), stacked
      with the existing distance/elite modifiers, floored at 0.
    - LAST-MAN-ONLY SURRENDER + FLEE (his ruling): a NERVE break only
      produces a surrender (hands up) when the breaking man is the
      LAST fighter left. Anyone who cracks while allies are still
      shooting FLEES instead — runs away every turn, out of the fight,
      same as broken/downed for every pool. Elites (hardened) break
      less often — a first pass at his 'rank slider,' full faction
      tuning [PENDING Paolo]."""
    if 'V35: FROZEN during the killcam' in demo:
        print('v35 already applied, skipping')
        return demo

    # --- bulk: fleeing joins the same exclusion set as dead/downed/broken everywhere ---
    _or, _or_c = "e.dead||e.downed||e.broken", 9
    if demo.count(_or) != _or_c:
        sys.exit('FAIL anchor [fleeing-or]: found %d times (want %d)' % (demo.count(_or), _or_c))
    demo = demo.replace(_or, "e.dead||e.downed||e.broken||e.fleeing")
    _neg, _neg_c = "!e.dead&&!e.downed&&!e.broken", 4
    if demo.count(_neg) != _neg_c:
        sys.exit('FAIL anchor [fleeing-neg]: found %d times (want %d)' % (demo.count(_neg), _neg_c))
    demo = demo.replace(_neg, "!e.dead&&!e.downed&&!e.broken&&!e.fleeing")
    _neg2, _neg2_c = "!e2.dead&&!e2.downed&&!e2.broken", 1
    if demo.count(_neg2) != _neg2_c:
        sys.exit('FAIL anchor [fleeing-neg2]: found %d times (want %d)' % (demo.count(_neg2), _neg2_c))
    demo = demo.replace(_neg2, "!e2.dead&&!e2.downed&&!e2.broken&&!e2.fleeing")

    # --- camera: exclude the out-of-fight from the fit, freeze during the killcam ---
    demo = sub1(demo, "      const ringF=Math.min(W,H)*0.085; let md=0;\n      for(const e of G.e)if(!e.dead&&e.edist>md)md=e.edist;",
        "      const ringF=Math.min(W,H)*0.085; let md=0;   /* V35: only ACTIVE fighters hold the frame open — a downed/broken/fled body stops widening the shot */\n      for(const e of G.e)if(!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&e.edist>md)md=e.edist;",
        'camera-exclude-out')
    demo = sub1(demo, "    G._uzE=(G._uzE==null)?uzT:G._uzE+(uzT-G._uzE)*0.10; }",
        "    if(!G.ks)G._uzE=(G._uzE==null)?uzT:G._uzE+(uzT-G._uzE)*0.10;   /* V35: FROZEN during the killcam — AUTO FRAME never fights driveKillshotCamera's own zoom again */ }",
        'camera-freeze-killcam')

    # --- real cover: one pillar satisfies BOTH conditions ---
    demo = sub1(demo, "function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=(pillarBetweenMe(e)&&nearPillar(e))?1:0; } }   /* V26: real cover NEEDS stone near HIM — no more ducking behind a pillar that sits by YOU */",
        """\
function updateGeomCover(){ for(const e of (G.e||[])){ if(e.dead)continue; e.gcov=realCoverPillar(e)?1:0; } }   /* V35: ONE pillar must both BLOCK and sit NEAR him — no more mismatched pillars faking cover */
function realCoverPillar(e){ const exy=pXY(e);
  return (G.pillars||[]).some(P=>{ const pxy=pXY(P);
    return segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85) && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8; }); }""",
        'real-cover-same-pillar')

    # --- taps only lock a pick in manual mode ---
    demo = sub1(demo, """\
    const selFn=ev=>{ ev.stopPropagation(); if(e.dead)return;   /* V26: a tap only ever PICKS the victim — the fake cover toggle is dead */
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }
      if(G.phase!=='cover')return; G.selTarget=e.i; setRead('TARGET: '+e.n,'he eats the next dial','#e8b04a'); renderBoard(); updGap(); };""", """\
    const selFn=ev=>{ ev.stopPropagation(); if(e.dead)return;   /* V26: a tap only ever PICKS the victim — the fake cover toggle is dead */
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }
      if(G.phase!=='cover'||G.targetMode!=='manual')return;   /* V35: AUTO means the game decides — a curious tap can never silently override closest-priority */
      G.selTarget=e.i; setRead('TARGET: '+e.n,'he eats the next dial','#e8b04a'); renderBoard(); updGap(); };""",
        'chip-tap-manual-only')
    demo = sub1(demo, """\
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }   /* V26 MANUAL CHAIN: the chosen next victim */
      G.selTarget=e.i;
      setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a');
      renderBoard(); updGap(); return; } }""", """\
      if(G._chainWait){ G.selTarget=e.i; G._chainWait=false; G.inFU=true; enterAim(true); return; }   /* V26 MANUAL CHAIN: the chosen next victim */
      if(G.targetMode!=='manual')return;   /* V35: same law on the field tap — AUTO stays the game's call */
      G.selTarget=e.i;
      setRead('TARGET: '+e.n, e.melee?'the blade goes down first':'he eats the next dial','#e8b04a');
      renderBoard(); updGap(); return; } }""",
        'field-tap-manual-only')

    # --- dial difficulty scales with the target's cover ---
    demo = sub1(demo, "      G.pkgDiff=Math.min(4,distPkg(tgt)+(tgt.elite?1:0)); } }   // dial faces the target; point-blank pulls easier patterns",
        "      G.pkgDiff=Math.max(0,Math.min(4,distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1))); } }   // V35 (Paolo): covered pulls the package HARDER, exposed pulls it EASIER — stacks with distance/elite",
        'difficulty-by-cover')

    # --- fleeing pose + chip label ---
    demo = sub1(demo, "  if(e.broken){ return L.handsup112||L.idle112; }   /* V30 NERVE: the gun is down, the hands are up */",
        "  if(e.fleeing){ if(L.walk112&&L.walk112.length)return L.walk112[Math.floor(now/170)%L.walk112.length]; return L.idle112; }   /* V35: running for it — the same walk cycle, never stopping */\n  if(e.broken){ return L.handsup112||L.idle112; }   /* V30 NERVE: the gun is down, the hands are up */",
        'fleeing-pose')
    demo = sub1(demo, "        :e.downed?'▼ DYING':e.broken?'HANDS UP'",
        "        :e.downed?'▼ DYING':e.broken?'HANDS UP':e.fleeing?'FLEEING'",
        'fleeing-chip-label')

    # --- the nerve rewrite: last man surrenders, everyone else runs ---
    demo = sub1(demo, """\
  { /* V32 NERVE (Paolo: too liberal — waiting 5 turns shouldn't crack a whole crew).
       The roll fires ONLY the turn a NEW casualty happens, not every idle turn. */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length, _half=Math.ceil(_tot*0.5);
    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing)continue;
      if(Math.random()<0.10+0.05*(_down-_half)){   /* V33: toned down further on top of v32's event-gating */ e.broken=true; e.windup=false; e.acq=0; e._brokeAt=performance.now();
        setRead('NERVE BROKE', e.n+' drops the gun — hands up','#c8a23a'); } }
    G._nerveLastDown=_down; }""", """\
  { /* V35 NERVE, LAST-MAN-ONLY SURRENDER (Paolo, ruled): nobody surrenders while his
       people are still shooting — he either holds or FLEES. Only the last man standing
       can actually put his hands up. Elites are hardened: half the break chance — the
       first pass at his rank/faction slider [PENDING Paolo: full faction tuning]. */
    const _tot=G.e.length, _down=G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length, _half=Math.ceil(_tot*0.5);
    if(_down>=_half && _down>(G._nerveLastDown||0))for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing)continue;
      const _chance=(0.10+0.05*(_down-_half))*(e.elite?0.5:1);
      if(Math.random()<_chance){
        e.windup=false; e.acq=0;
        const _isLastMan=aliveEnemies().length<=1;
        if(_isLastMan){ e.broken=true; e._brokeAt=performance.now();
          setRead('NERVE BROKE', e.n+' drops the gun — hands up','#c8a23a'); }
        else{ e.fleeing=true; e._fleeAt=performance.now();
          setRead('PANICKED', e.n+' breaks and runs — his people are still fighting','#c8a23a'); } } }
    G._nerveLastDown=_down; }
  for(const e of G.e){ if(!e.fleeing)continue;   /* V35: the fleeing run AWAY every turn, same plumbing as the crawl */
    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist, ed=Math.hypot(ex,ey)||1;
    const nx=ex+(ex/ed)*2.4, ny=ey+(ey/ed)*2.4;
    e.edist=Math.min(30,Math.hypot(nx,ny)); e.ea=Math.atan2(ny,nx); }""",
        'nerve-last-man-flee')
    return demo


def patch36(demo):
    """v36 (Paolo 7/21, follow-up on v35): accuracy means killshot rate, not
    any-hit rate; kill the "face gets worse as you do" fire-button effect
    (his verdict: "i dont like it")."""
    if 'AU:false' in demo:
        print('v36 already applied, skipping')
        return demo

    # accuracy = killshots / shots, not (any hit) / shots
    demo = sub1(demo,
        "D('ledgerbtn').addEventListener('click',()=>{ if(!JUICE.AT)return; const L=G.ledger||{};\n  const rate3=L.shots?Math.round(L.hits/L.shots*100):0;",
        "D('ledgerbtn').addEventListener('click',()=>{ if(!JUICE.AT)return; const L=G.ledger||{};\n  const rate3=L.shots?Math.round(L.kills/L.shots*100):0;   /* V36 KILL-RATE ACCURACY: 100% means every shot was a killshot, not just a hit (Paolo, ruled) */",
        'ledger-accuracy-kill-rate')

    # kill the living-portrait effect (dying face swap / red wash / red border on HP loss)
    demo = sub1(demo,
        "  AS:true,AT:true,AU:true,AV:true};",
        "  AS:true,AT:true,AU:false,AV:true};   /* V36: Paolo -- \"i dont like it\", killed. wound state stays on the body/screen vignette, not the fire-button face */",
        'kill-au-face')

    return demo


def patch37(demo):
    """v37 (Paolo 7/21, correcting v36): accuracy is not literally
    killshots-only -- "1 killshot + 3 vitals should say 100%, not 25%,
    judge based on how close they were to the middle of the dial." Kill
    and vital are both the two zones close to dial-center; the outer 'hit'
    ring and misses are the imprecise ones. Accuracy = (kills+vitals)/shots."""
    if 'V37 PRECISION ACCURACY' in demo or 'V38 CONTINUOUS PRECISION' in demo:
        print('v37 already applied, skipping')
        return demo

    demo = sub1(demo,
        "  G.rc=G.rc||{shots:0,hits:0,kills:0,greedCashed:0,greedWasted:0,best:999,peak:0};\n  G.rc.shots++; if(kind!=='miss')G.rc.hits++;\n  if(kind==='kill'){G.rc.kills++;if(G._relGreed)G.rc.greedCashed++;}\n  if(G.ledger){ G.ledger.shots++; if(kind!=='miss')G.ledger.hits++; if(kind==='kill')G.ledger.kills++;",
        "  G.rc=G.rc||{shots:0,hits:0,kills:0,precise:0,greedCashed:0,greedWasted:0,best:999,peak:0};\n  G.rc.shots++; if(kind!=='miss')G.rc.hits++;\n  if(kind==='kill'||kind==='vital')G.rc.precise=(G.rc.precise||0)+1;   /* V37 PRECISION ACCURACY: kill+vital are both 'close enough to center', the outer hit ring and misses are not */\n  if(kind==='kill'){G.rc.kills++;if(G._relGreed)G.rc.greedCashed++;}\n  if(G.ledger){ G.ledger.shots++; if(kind!=='miss')G.ledger.hits++; if(kind==='kill')G.ledger.kills++; if(kind==='kill'||kind==='vital')G.ledger.precise=(G.ledger.precise||0)+1;",
        'rc-ledger-precise-count')

    demo = sub1(demo,
        "  G.ledger=G.ledger||{kills:0,shots:0,hits:0,wagersPaid:0,wagersBust:0,best:999,peak:0,fights:0,deaths:0};   /* AT: the night's book, survives encounters */",
        "  G.ledger=G.ledger||{kills:0,shots:0,hits:0,precise:0,wagersPaid:0,wagersBust:0,best:999,peak:0,fights:0,deaths:0};   /* AT: the night's book, survives encounters */",
        'ledger-default-precise')

    demo = sub1(demo,
        "  const rate3=L.shots?Math.round(L.kills/L.shots*100):0;   /* V36 KILL-RATE ACCURACY: 100% means every shot was a killshot, not just a hit (Paolo, ruled) */",
        "  const rate3=L.shots?Math.round((L.precise||0)/L.shots*100):0;   /* V37 PRECISION ACCURACY: kill+vital zones both count as accurate, not killshots-only (Paolo, corrected v36) */",
        'ledger-accuracy-precise')

    return demo


def patch38(demo):
    """v38 (Paolo 7/21, correcting v37): a binary zone bucket is still not
    it -- "compared to the deadshot dial, how close was that hit to the
    middle" means a CONTINUOUS score per shot, not kill/vital=100,
    hit/miss=0. fire() already computes d (the release's actual angular
    deviation) and hitz (the outer edge of the hit ring, beyond which is a
    clean miss) to decide the zone -- reuse those same numbers as a real
    distance-to-center percentage instead of re-bucketing them. A dead-
    center kill scores ~100%, a shot right on the miss line scores ~0%,
    and everything between reads smoothly, so landing several outer-ring
    hits (no misses at all) now correctly averages above 50%."""
    if 'V38 CONTINUOUS PRECISION' in demo:
        print('v38 already applied, skipping')
        return demo

    demo = sub1(demo,
        "  let kind; if(d<=hz)kind='kill'; else if(d<=vz)kind='vital'; else if(d<=hitz)kind='hit'; else kind='miss';",
        "  let kind; if(d<=hz)kind='kill'; else if(d<=vz)kind='vital'; else if(d<=hitz)kind='hit'; else kind='miss';\n  const _precisionPct=Math.max(0,1-d/hitz)*100;   /* V38 CONTINUOUS PRECISION: dead-center release=100%, right on the miss line=0%, every shot in between reads true to how close it actually was */",
        'compute-continuous-precision')

    demo = sub1(demo,
        "  G.rc=G.rc||{shots:0,hits:0,kills:0,precise:0,greedCashed:0,greedWasted:0,best:999,peak:0};\n  G.rc.shots++; if(kind!=='miss')G.rc.hits++;\n  if(kind==='kill'||kind==='vital')G.rc.precise=(G.rc.precise||0)+1;   /* V37 PRECISION ACCURACY: kill+vital are both 'close enough to center', the outer hit ring and misses are not */\n  if(kind==='kill'){G.rc.kills++;if(G._relGreed)G.rc.greedCashed++;}\n  if(G.ledger){ G.ledger.shots++; if(kind!=='miss')G.ledger.hits++; if(kind==='kill')G.ledger.kills++; if(kind==='kill'||kind==='vital')G.ledger.precise=(G.ledger.precise||0)+1;",
        "  G.rc=G.rc||{shots:0,hits:0,kills:0,precise:0,precisionSum:0,greedCashed:0,greedWasted:0,best:999,peak:0};\n  G.rc.shots++; if(kind!=='miss')G.rc.hits++;\n  G.rc.precisionSum=(G.rc.precisionSum||0)+_precisionPct;   /* V38: sum of per-shot proximity-to-center, averaged for display */\n  if(kind==='kill'||kind==='vital')G.rc.precise=(G.rc.precise||0)+1;\n  if(kind==='kill'){G.rc.kills++;if(G._relGreed)G.rc.greedCashed++;}\n  if(G.ledger){ G.ledger.shots++; if(kind!=='miss')G.ledger.hits++; if(kind==='kill')G.ledger.kills++; if(kind==='kill'||kind==='vital')G.ledger.precise=(G.ledger.precise||0)+1; G.ledger.precisionSum=(G.ledger.precisionSum||0)+_precisionPct;",
        'sum-continuous-precision')

    demo = sub1(demo,
        "  G.ledger=G.ledger||{kills:0,shots:0,hits:0,precise:0,wagersPaid:0,wagersBust:0,best:999,peak:0,fights:0,deaths:0};   /* AT: the night's book, survives encounters */",
        "  G.ledger=G.ledger||{kills:0,shots:0,hits:0,precise:0,precisionSum:0,wagersPaid:0,wagersBust:0,best:999,peak:0,fights:0,deaths:0};   /* AT: the night's book, survives encounters */",
        'ledger-default-precisionsum')

    demo = sub1(demo,
        "  const rate3=L.shots?Math.round((L.precise||0)/L.shots*100):0;   /* V37 PRECISION ACCURACY: kill+vital zones both count as accurate, not killshots-only (Paolo, corrected v36) */",
        "  const rate3=L.shots?Math.round((L.precisionSum||0)/L.shots):0;   /* V38 CONTINUOUS PRECISION: average per-shot proximity to dial-center, not a binary zone bucket (Paolo, corrected v37) */",
        'ledger-accuracy-continuous')

    return demo


def patch39(demo):
    """v39 (Paolo 7/21, "WE NEED TO MAKE COMBAT FUNNER"): two additions,
    not a tuning pass.
    - STREAK MOMENTUM: G.killStreak existed but only drove cosmetics (floor
      pulse, killcam escalation). It now actually widens the dial's
      forgiveness window a little per consecutive kill (capped +15% at a
      5-streak, same multiplicative slot every other forgiveness bonus
      already stacks into), so a hot streak is mechanically hot, not just
      loud. A miss still zeroes it -- same risk/reward shape as greed.
    - SNIPER ARCHETYPE: every ranged enemy today is the same GOON stats.
      One sniper can now spawn in bigger fights (N>=4), always placed at
      the far edge of the supported board range (never the close guy),
      hits far harder than a GOON. He uses the SAME exposure/cover math
      every other enemy already respects (v35's dial-difficulty-by-cover,
      the acq red line) -- no new AI, just numbers that make "get to
      cover NOW" a real stake instead of a mild inconvenience."""
    if 'V39 STREAK MOMENTUM' in demo:
        print('v39 already applied, skipping')
        return demo

    # streak momentum: same fg slot both formulas already share (resolution + the band that SHOWS it)
    _fg_old = "(1+((G._steadyAtPop||0)*0.05))"
    _fg_new = "(1+((G._steadyAtPop||0)*0.05))*(1+Math.min(0.15,(G.killStreak||0)*0.03))"
    _fg_count = demo.count(_fg_old)
    if _fg_count != 2:
        sys.exit('FAIL anchor [streak-fg]: found %d times (want 2)' % _fg_count)
    demo = demo.replace(_fg_old, _fg_new)
    demo = sub1(demo,
        "  const fg=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05))*(1+Math.min(0.15,(G.killStreak||0)*0.03));   /* JUICE.L steadied aim */",
        "  const fg=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)*(1+((G._steadyAtPop||0)*0.05))*(1+Math.min(0.15,(G.killStreak||0)*0.03));   /* V39 STREAK MOMENTUM: a hot streak widens the window for real, capped +15% at 5, a miss zeroes it (killStreak resets on miss elsewhere) */",
        'streak-momentum-tag')

    # sniper archetype
    demo = sub1(demo,
        "  spear:{n:'SPEAR',hp:70, acc:0, dmg:[18,26], bot:false, melee:true, adv:2, reach:4.2, cad:2},\n};",
        "  spear:{n:'SPEAR',hp:70, acc:0, dmg:[18,26], bot:false, melee:true, adv:2, reach:4.2, cad:2},\n  sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48], bot:false, melee:false},   /* V39: every ranged enemy was reading identical -- one real specialist, punishes standing exposed HARD */\n};",
        'sniper-archetype')

    demo = sub1(demo,
        "  const closeIdx = (N>=3) ? Math.floor(Math.random()*N) : (Math.random()<0.5?Math.floor(Math.random()*N):-1);\n  const eliteIdx=(N>=3)?Math.floor(Math.random()*N):-1;   /* one elite per 3+ fight [spawn odds PENDING Paolo] */",
        """  const closeIdx = (N>=3) ? Math.floor(Math.random()*N) : (Math.random()<0.5?Math.floor(Math.random()*N):-1);
  const eliteIdx=(N>=3)?Math.floor(Math.random()*N):-1;   /* one elite per 3+ fight [spawn odds PENDING Paolo] */
  /* V39 SNIPER: one per fight, N>=4 only, never the close guy [spawn odds PENDING Paolo] */
  let sniperIdx=-1; if(N>=4){ let sp=0; do{ sniperIdx=Math.floor(Math.random()*N); }while(sniperIdx===closeIdx&&sp++<20); }""",
        'sniper-idx-roll')

    demo = sub1(demo,
        """  for(let i=0;i<N;i++){ let arch=(N>=5 && i%4===3)?'bot':'human';
    /* MELEE MIX (Paolo 7/19): blades join the gunfight. SOME = every 3rd body,
       PACK = every other. Settings toggle; default SOME. */
    const MM=(G.meleeMix==null)?1:G.meleeMix;
    if(MM===1&&N>=3&&i%3===2)arch=['shiv','bat','spear'][((i/3)|0)%3];
    else if(MM===2&&i%2===1)arch=['shiv','bat','spear'][((i/2)|0)%3];
    const e=makeEnemy(i,arch);
    e.elite=(i===eliteIdx);
    if(e.elite){e.hp=Math.round(e.hp*1.25);e.hpMax=Math.round((e.hpMax||e.hp)*1.25);}   /* Paolo: elites a bit tougher [tunable] */
    e.ea=angs[i];                                    // bearing from the rolled demo layout
    e.edist = (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : (PT_BLANK+2.5)+Math.random()*8; // GRID TRUE V7: the fight lives on the visible board (~6.5-14.5 tiles); long-range returns with the world model""",
        """  for(let i=0;i<N;i++){ let arch=(N>=5 && i%4===3)?'bot':'human';
    /* MELEE MIX (Paolo 7/19): blades join the gunfight. SOME = every 3rd body,
       PACK = every other. Settings toggle; default SOME. */
    const MM=(G.meleeMix==null)?1:G.meleeMix;
    if(MM===1&&N>=3&&i%3===2)arch=['shiv','bat','spear'][((i/3)|0)%3];
    else if(MM===2&&i%2===1)arch=['shiv','bat','spear'][((i/2)|0)%3];
    if(i===sniperIdx)arch='sniper';   /* V39: overrides the melee-mix roll on his slot */
    const e=makeEnemy(i,arch);
    e.elite=(i===eliteIdx);
    if(e.elite){e.hp=Math.round(e.hp*1.25);e.hpMax=Math.round((e.hpMax||e.hp)*1.25);}   /* Paolo: elites a bit tougher [tunable] */
    e.ea=angs[i];                                    // bearing from the rolled demo layout
    e.edist = (i===sniperIdx) ? (PT_BLANK+9.5)+Math.random()*3         // V39: always the farthest gun on the board, still inside the supported range
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : (PT_BLANK+2.5)+Math.random()*8; // GRID TRUE V7: the fight lives on the visible board (~6.5-14.5 tiles); long-range returns with the world model""",
        'sniper-spawn-wire')

    return demo


def patch40(demo):
    """v40 (Paolo 7/21, "keep cooking juicy stuff... add it to the UI menu
    of juice"): wire v39's streak momentum through a real toggle in the
    same SETTINGS > JUICE + FEEL verdict menu every prior feel addition
    graduated through (AS/AT/AU/AV pattern) -- new letter AW, same
    on/demo/thumbs plumbing. Also retires AU's row from that menu: he
    already ruled it dead in chat ("i dont like it", v36), and the row's
    toggle button would otherwise silently flip JUICE.AU back to true on
    a tap since nothing re-reads its live state at boot -- a live trap
    for undoing his own ruling. NOTES ARE RULINGS; a killed effect does
    not keep a toggle that can resurrect it."""
    if 'V40 JUICE MENU' in demo:
        print('v40 already applied, skipping')
        return demo

    # gate the streak bonus behind a real flag, same pattern as JUICE.L's steady-aim gate
    _old_term, _want = "(1+Math.min(0.15,(G.killStreak||0)*0.03))", 2
    _count = demo.count(_old_term)
    if _count != _want:
        sys.exit('FAIL anchor [streak-juice-gate]: found %d times (want %d)' % (_count, _want))
    demo = demo.replace(_old_term, "(1+Math.min(0.15,(JUICE.AW?(G.killStreak||0):0)*0.03))")

    # register the toggle + its one-line description (same object every other letter lives in)
    demo = sub1(demo,
        "  AS:true,AT:true,AU:false,AV:true};   /* V36: Paolo -- \"i dont like it\", killed. wound state stays on the body/screen vignette, not the fire-button face */",
        "  AS:true,AT:true,AU:false,AV:true,AW:true};   /* V40 JUICE MENU: streak momentum joins the verdict menu, same plumbing as everything else here */",
        'register-aw-flag')
    demo = sub1(demo,
        "  AU:'the face in your fire button gets worse as YOU do',\n  AV:'the receipt GRADES the fight, D to BOHEMIAN'};",
        "  AU:'the face in your fire button gets worse as YOU do',\n  AV:'the receipt GRADES the fight, D to BOHEMIAN',\n  AW:'a hot streak visibly widens your kill window, a miss snaps it back'};",
        'register-aw-watch')

    # a demo preview, same shape as every other letter's case in juiceDemo()
    demo = sub1(demo,
        "  if(k==='L'){ setRead('STEADY +10%','held position, aim settles \\u00B7 next dial kill zone widens','#8fe89a'); }",
        "  if(k==='L'){ setRead('STEADY +10%','held position, aim settles \\u00B7 next dial kill zone widens','#8fe89a'); }\n  if(k==='AW'){ setRead('STREAK MOMENTUM','3+ kills running \\u00B7 dial window +9% wider, a miss zeroes it','#8fe89a'); }",
        'aw-demo-preview')

    # the menu row: drop the dead AU toggle (his ruling already stands, this button could only undo it),
    # promote AV, add AW in its place -- same 2-per-row shape as the AS/AT row above it
    demo = sub1(demo,
        '    <div class="controls"><button data-j="AU" class="on">AU LIVING PORTRAIT</button><button data-jv="AU:1">&#128077;</button><button data-jv="AU:-1">&#128078;</button><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button></div>',
        '    <div class="controls"><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button><button data-j="AW" class="on">AW STREAK MOMENTUM</button><button data-jv="AW:1">&#128077;</button><button data-jv="AW:-1">&#128078;</button></div>   <!-- V40 JUICE MENU: AU retired (killed, verdict already given -- no toggle left to undo it), AW joins -->',
        'menu-row-aw')

    return demo


def patch41(demo):
    """v41 (Paolo 7/21, "KEEP COOKING"): destructible cover. Every pillar
    now has real durability -- each shot it eats for you chips it, and
    after enough hits it's GONE, for both sides (it's the same shared
    G.pillars pool every cover check already reads, so an enemy loses
    that same stone too). Hiding behind one rock all fight stops being
    free. Wired as a real JUICE toggle (AX) through the same verdict-menu
    plumbing as AW, same guarantee: off means the old permanent-cover
    behavior, not a lie."""
    if 'V41 BREAKABLE COVER' in demo or 'V42 COVER REVERT' in demo:
        print('v41 already applied (or already reverted by v42), skipping')
        return demo

    # pillars carry durability now
    demo = sub1(demo,
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55}); } }",
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55,hp:3,hpMax:3}); } }   /* V41 BREAKABLE COVER: 3 hits and it's gone, JUICE.AX-gated */",
        'pillar-hp')

    # a variant of myCoverAgainst that returns the ACTUAL pillar (not just true/false), so a hit can be attributed to one
    demo = sub1(demo,
        "function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */",
        """function myCoveringPillar(ang,dist){   /* V41: same predicate as myCoverAgainst, but hands back WHICH pillar so a hit can chip it */
  const md=(dist==null?MAX_RANGE:dist);
  return (G.pillars||[]).find(P=>{ if(P.edist>md||P.edist<0.8)return false;
    let dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; })||null; }
function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */""",
        'covering-pillar-lookup')

    # the chip itself, plus what happens when a pillar finally breaks
    demo = sub1(demo,
        "function fxCoverSave(ea){ if(!JUICE.R)return;",
        """function chipCover(ea,dist){ if(!JUICE.AX)return;
  const P=myCoveringPillar(ea,dist); if(!P)return;
  P.hp=(P.hp==null?3:P.hp)-1;
  G._fx.push({type:'coverdust',dir:dirIndex(ea),t:0,life:0.5,vx:0,vy:0});   /* V41: a visible chip, distinct from the R spark */
  if(P.hp<=0){ const at=G.pillars.indexOf(P); if(at>=0)G.pillars.splice(at,1);
    setRead('COVER BROKE','that stone is rubble now','#e8593a');
    updateGeomCover(); } }
function fxCoverSave(ea){ if(!JUICE.R)return;""",
        'chip-cover-fn')

    # wire it into the exact moment cover eats a shot for you (the R spark's own trigger)
    demo = sub1(demo,
        "    else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */ }",
        "    else if(cov){ onOffbeat(()=>fxCoverSave(e.ea)); chipCover(e.ea,e.edist); }   /* R: your cover ate that one; V41: and it cost the stone something */ }",
        'chip-on-cover-save')

    # the pillar reads its own damage in the draw: shrinks + darkens as hp drops, so the crumble is visible with zero new art
    demo = sub1(demo,
        "  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];\n    const s=ring*0.62;   /* a block fills its tile */\n    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();\n    x.fillStyle='#6e604a'; x.fillRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6);\n    x.fillStyle='#94836a'; x.beginPath(); x.ellipse(pxs,pys-s*1.15,s*0.55,s*0.2,0,0,7); x.fill();\n    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6); }",
        """  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const _hf=(JUICE.AX&&P.hpMax)?Math.max(0,(P.hp==null?P.hpMax:P.hp))/P.hpMax:1;   /* V41: crumbles as it eats hits */
    const s=ring*0.62*(0.7+0.3*_hf);
    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();
    x.fillStyle=_hf<1?('rgba(110,96,74,'+(0.55+0.45*_hf)+')'):'#6e604a'; x.fillRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6);
    x.fillStyle='#94836a'; x.beginPath(); x.ellipse(pxs,pys-s*1.15,s*0.55,s*0.2,0,0,7); x.fill();
    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6); }""",
        'pillar-crumble-draw')

    # register in the same JUICE plumbing as everything else
    demo = sub1(demo,
        "  AS:true,AT:true,AU:false,AV:true,AW:true};   /* V40 JUICE MENU: streak momentum joins the verdict menu, same plumbing as everything else here */",
        "  AS:true,AT:true,AU:false,AV:true,AW:true,AX:true};   /* V41 BREAKABLE COVER joins the verdict menu */",
        'register-ax-flag')
    demo = sub1(demo,
        "  AW:'a hot streak visibly widens your kill window, a miss snaps it back'};",
        "  AW:'a hot streak visibly widens your kill window, a miss snaps it back',\n  AX:'your cover crumbles as it eats shots for you, and eventually breaks'};",
        'register-ax-watch')
    demo = sub1(demo,
        "  if(k==='AW'){ setRead('STREAK MOMENTUM','3+ kills running \\u00B7 dial window +9% wider, a miss zeroes it','#8fe89a'); }",
        "  if(k==='AW'){ setRead('STREAK MOMENTUM','3+ kills running \\u00B7 dial window +9% wider, a miss zeroes it','#8fe89a'); }\n  if(k==='AX'){ setRead('COVER BROKE','that stone is rubble now','#e8593a'); }",
        'ax-demo-preview')
    demo = sub1(demo,
        '    <div class="controls"><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button><button data-j="AW" class="on">AW STREAK MOMENTUM</button><button data-jv="AW:1">&#128077;</button><button data-jv="AW:-1">&#128078;</button></div>   <!-- V40 JUICE MENU: AU retired (killed, verdict already given -- no toggle left to undo it), AW joins -->',
        '    <div class="controls"><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button><button data-j="AW" class="on">AW STREAK MOMENTUM</button><button data-jv="AW:1">&#128077;</button><button data-jv="AW:-1">&#128078;</button></div>   <!-- V40 JUICE MENU: AU retired (killed, verdict already given -- no toggle left to undo it), AW joins -->\n    <div class="controls"><button data-j="AX" class="on">AX BREAKABLE COVER</button><button data-jv="AX:1">&#128077;</button><button data-jv="AX:-1">&#128078;</button></div>   <!-- V41 -->',
        'menu-row-ax')

    # V41 fix-forward: v40 registered AW everywhere EXCEPT JUICE_NAMES, so its demo
    # preview caption would have literally rendered "AW undefined" on screen -- catching
    # it here before it ever ships broken, and registering AX in the same table.
    demo = sub1(demo,
        "AS:'BLOOD TRAIL',AT:'LIFETIME LEDGER',AU:'LIVING PORTRAIT',AV:'FIGHT GRADE'};",
        "AS:'BLOOD TRAIL',AT:'LIFETIME LEDGER',AU:'LIVING PORTRAIT',AV:'FIGHT GRADE',AW:'STREAK MOMENTUM',AX:'BREAKABLE COVER'};",
        'register-names')

    return demo


def patch42(demo):
    """v42 (Paolo 7/22, "i dont like the pillar health idea its dogshit"):
    REVERTS v41's destructible cover entirely. Not a default-off toggle --
    a full removal. The idea was killed outright; a killed idea keeps no
    code lying around defaulting to off, same principle as v40 retiring
    AU's row rather than leaving a dead flag with a live button. Every
    mutation below is the exact inverse of patch41's, string for string.
    The v40 JUICE_NAMES fix (AW was missing, would have rendered literal
    "undefined") is UNRELATED to the killed idea and stays."""
    if 'V42 COVER REVERT' in demo:
        print('v42 already applied, skipping')
        return demo
    if 'V41 BREAKABLE COVER' not in demo:
        print('v41 not present, nothing to revert')
        return demo

    demo = sub1(demo,
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55,hp:3,hpMax:3}); } }   /* V41 BREAKABLE COVER: 3 hits and it's gone, JUICE.AX-gated */",
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55}); } }   /* V42 COVER REVERT: cover is permanent again, Paolo killed breakable cover outright */",
        'revert-pillar-hp')

    demo = sub1(demo,
        """function myCoveringPillar(ang,dist){   /* V41: same predicate as myCoverAgainst, but hands back WHICH pillar so a hit can chip it */
  const md=(dist==null?MAX_RANGE:dist);
  return (G.pillars||[]).find(P=>{ if(P.edist>md||P.edist<0.8)return false;
    let dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; })||null; }
function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */""",
        "function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */",
        'revert-covering-pillar-lookup')

    demo = sub1(demo,
        """function chipCover(ea,dist){ if(!JUICE.AX)return;
  const P=myCoveringPillar(ea,dist); if(!P)return;
  P.hp=(P.hp==null?3:P.hp)-1;
  G._fx.push({type:'coverdust',dir:dirIndex(ea),t:0,life:0.5,vx:0,vy:0});   /* V41: a visible chip, distinct from the R spark */
  if(P.hp<=0){ const at=G.pillars.indexOf(P); if(at>=0)G.pillars.splice(at,1);
    setRead('COVER BROKE','that stone is rubble now','#e8593a');
    updateGeomCover(); } }
function fxCoverSave(ea){ if(!JUICE.R)return;""",
        "function fxCoverSave(ea){ if(!JUICE.R)return;",
        'revert-chip-cover-fn')

    demo = sub1(demo,
        "    else if(cov){ onOffbeat(()=>fxCoverSave(e.ea)); chipCover(e.ea,e.edist); }   /* R: your cover ate that one; V41: and it cost the stone something */ }",
        "    else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */ }",
        'revert-chip-on-cover-save')

    demo = sub1(demo,
        """  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];
    const _hf=(JUICE.AX&&P.hpMax)?Math.max(0,(P.hp==null?P.hpMax:P.hp))/P.hpMax:1;   /* V41: crumbles as it eats hits */
    const s=ring*0.62*(0.7+0.3*_hf);
    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();
    x.fillStyle=_hf<1?('rgba(110,96,74,'+(0.55+0.45*_hf)+')'):'#6e604a'; x.fillRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6);
    x.fillStyle='#94836a'; x.beginPath(); x.ellipse(pxs,pys-s*1.15,s*0.55,s*0.2,0,0,7); x.fill();
    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6); }""",
        "  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];\n    const s=ring*0.62;   /* a block fills its tile */\n    x.fillStyle='rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(pxs,pys+s*0.5,s*0.8,s*0.26,0,0,7); x.fill();\n    x.fillStyle='#6e604a'; x.fillRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6);\n    x.fillStyle='#94836a'; x.beginPath(); x.ellipse(pxs,pys-s*1.15,s*0.55,s*0.2,0,0,7); x.fill();\n    x.strokeStyle='#241f18'; x.lineWidth=1; x.strokeRect(pxs-s*0.55,pys-s*1.15,s*1.1,s*1.6); }",
        'revert-pillar-crumble-draw')

    demo = sub1(demo,
        "  AS:true,AT:true,AU:false,AV:true,AW:true,AX:true};   /* V41 BREAKABLE COVER joins the verdict menu */",
        "  AS:true,AT:true,AU:false,AV:true,AW:true};   /* V42: AX (breakable cover) removed -- killed, not just defaulted off */",
        'revert-ax-flag')
    demo = sub1(demo,
        "  AW:'a hot streak visibly widens your kill window, a miss snaps it back',\n  AX:'your cover crumbles as it eats shots for you, and eventually breaks'};",
        "  AW:'a hot streak visibly widens your kill window, a miss snaps it back'};",
        'revert-ax-watch')
    demo = sub1(demo,
        "  if(k==='AW'){ setRead('STREAK MOMENTUM','3+ kills running \\u00B7 dial window +9% wider, a miss zeroes it','#8fe89a'); }\n  if(k==='AX'){ setRead('COVER BROKE','that stone is rubble now','#e8593a'); }",
        "  if(k==='AW'){ setRead('STREAK MOMENTUM','3+ kills running \\u00B7 dial window +9% wider, a miss zeroes it','#8fe89a'); }",
        'revert-ax-demo-preview')
    demo = sub1(demo,
        '    <div class="controls"><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button><button data-j="AW" class="on">AW STREAK MOMENTUM</button><button data-jv="AW:1">&#128077;</button><button data-jv="AW:-1">&#128078;</button></div>   <!-- V40 JUICE MENU: AU retired (killed, verdict already given -- no toggle left to undo it), AW joins -->\n    <div class="controls"><button data-j="AX" class="on">AX BREAKABLE COVER</button><button data-jv="AX:1">&#128077;</button><button data-jv="AX:-1">&#128078;</button></div>   <!-- V41 -->',
        '    <div class="controls"><button data-j="AV" class="on">AV FIGHT GRADE</button><button data-jv="AV:1">&#128077;</button><button data-jv="AV:-1">&#128078;</button><button data-j="AW" class="on">AW STREAK MOMENTUM</button><button data-jv="AW:1">&#128077;</button><button data-jv="AW:-1">&#128078;</button></div>   <!-- V40 JUICE MENU: AU retired (killed, verdict already given -- no toggle left to undo it), AW joins -->',
        'revert-menu-row-ax')

    # keep the v40 JUICE_NAMES fix (AW), drop only AX
    demo = sub1(demo,
        "AS:'BLOOD TRAIL',AT:'LIFETIME LEDGER',AU:'LIVING PORTRAIT',AV:'FIGHT GRADE',AW:'STREAK MOMENTUM',AX:'BREAKABLE COVER'};",
        "AS:'BLOOD TRAIL',AT:'LIFETIME LEDGER',AU:'LIVING PORTRAIT',AV:'FIGHT GRADE',AW:'STREAK MOMENTUM'};",
        'revert-names')

    return demo


def patch43(demo):
    """v43 (Paolo 7/22, "keep cooking up juicy stuff... mechanics, vfx,
    sfx, or fun swag"): weapon-flavored kill impact. The killcam's contact
    frame (hitstop + blood burst) was flat -- identical whether you killed
    with a pistol or a shotgun, even though the fire loop itself already
    scales recoil/muzzle by weapon. Same numeric knobs, now weapon-aware:
    shotgun kills hit hardest (biggest freeze, biggest burst -- it's
    already the always-lethal weapon by his own ruling, the impact should
    say so), rifle is the pierce (long freeze, moderate burst), SMG is
    quick and messy (short freeze, wide scrappy burst), pistol stays the
    cleanest, smallest kill in the game (the mercy weapon reads as one,
    even in the kill camera)."""
    if 'V43 WEAPON KILL IMPACT' in demo:
        print('v43 already applied, skipping')
        return demo

    demo = sub1(demo,
        "    if(!ks._contact){ ks._contact=true;   /* THE BULLET ARRIVES: one frame, two effects hang on it */\n      if(JUICE.F)G._hitstop=3;            /* F. HIT-STOP: 3 frames of total freeze at contact */",
        """    if(!ks._contact){ ks._contact=true;   /* THE BULLET ARRIVES: one frame, two effects hang on it */
      /* V43 WEAPON KILL IMPACT: the freeze itself now says what killed him */
      const _wpnStop={pistol:3,smg:2,rifle:4,shotgun:6}[WEAPON]||3;
      if(JUICE.F)G._hitstop=_wpnStop;""",
        'weapon-hitstop')

    demo = sub1(demo,
        "    const bloodScale = ks.style==='hammer'?1.3:1.0;",
        "    const bloodScale = (ks.style==='hammer'?1.3:1.0) * ({pistol:0.75,smg:0.95,rifle:1.15,shotgun:1.55}[WEAPON]||1.0);   /* V43 WEAPON KILL IMPACT */",
        'weapon-blood-scale')

    return demo


def patch44(demo):
    """v44 (Paolo 7/23, "more combat and movement and strategy fun"):
    SPRINT -- a real risk/reward movement option. Every move today is the
    same safe 1-tile shuffle that always resolves tucked (endTurnReturn
    (false), only currently-exposed shooters can reach you). SPRINT arms
    the NEXT ring tap to cover 2 tiles instead of 1 -- reach cover that
    was one step out of normal range, close distance on a melee target
    fast, or break a whole cluster's sightline in one move -- but it
    costs real exposure: the move resolves engaged (endTurnReturn(true)),
    same as breaking cover to fire, so everyone with a line answers.
    Blocked if EITHER tile in the path has a pillar (checked before the
    turn is spent, same as a normal blocked move -- no cost for trying).
    A toggle button in the always-visible action row (not settings, which
    is a modal you wouldn't have open mid-fight) arms/disarms it; it
    consumes itself after one use, same shape as the existing greed-shot
    bank-and-spend pattern."""
    if 'V44 SPRINT' in demo:
        print('v44 already applied, skipping')
        return demo

    demo = sub1(demo,
        '    <button id="waitbtn" class="cbtn">WAIT</button>',
        '    <button id="waitbtn" class="cbtn">WAIT</button>\n    <button id="sprintbtn" class="cbtn">SPRINT: OFF</button>   <!-- V44 -->',
        'sprint-button')

    demo = sub1(demo,
        "function doMove(d){ if(G.inc)return;",
        """function doMove(d){ if(G.inc)return;
  const _sprinting=!!G.sprintArm;   /* V44 SPRINT: consumed by this move regardless of outcome below */""",
        'sprint-capture-arm')

    demo = sub1(demo,
        """  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  const v=DIRS[d];
  const sx=v[0], sy=v[1];   /* full tile steps, diagonals included (Chebyshev) — the board reads in tiles */
  if((G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.45; })){
    setRead('BLOCKED','a pillar is there','#8a7d66'); return; }   // OCCUPANCY: solid is solid""",
        """  const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
  const v=DIRS[d];
  const _mult=_sprinting?2:1;   /* V44 SPRINT: two tiles, not one */
  const sx=v[0]*_mult, sy=v[1]*_mult;   /* full tile steps, diagonals included (Chebyshev) — the board reads in tiles */
  if((G.pillars||[]).some(P=>{ const q=pXY(P); return Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.45 || (_sprinting&&Math.hypot(q[0]-v[0],q[1]-v[1])<P.r*0.6+0.45); })){
    setRead('BLOCKED',_sprinting?'the sprint path is blocked':'a pillar is there','#8a7d66'); return; }   // OCCUPANCY: solid is solid (V44: sprint checks BOTH tiles in the path)""",
        'sprint-two-tile-step'
    )

    demo = sub1(demo,
        """  G.moveArm=false; updMoveUI();
  G.steady=0;   /* repositioning spends the held stance */""",
        """  G.moveArm=false; updMoveUI();
  if(_sprinting){ G.sprintArm=false; const _sb=D('sprintbtn'); if(_sb){_sb.textContent='SPRINT: OFF';_sb.classList.remove('on');} }   /* V44: one use per arm */
  G.steady=0;   /* repositioning spends the held stance */""",
        'sprint-consume-arm'
    )

    demo = sub1(demo,
        """  setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],_broke?('one tile — '+_broke+' red line'+(_broke>1?'s':'')+' broken'):'one tile — the world answers','#8fd0e8');
  endTurnReturn(false); }""",
        """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'two tiles, fully exposed — return fire incoming','#e8593a');
    endTurnReturn(true); }   /* V44: a sprint breaks cover for real, same cost as popping to fire */
  else{ setRead('MOVED '+['N','NE','E','SE','S','SW','W','NW'][d],_broke?('one tile — '+_broke+' red line'+(_broke>1?'s':'')+' broken'):'one tile — the world answers','#8fd0e8');
    endTurnReturn(false); } }""",
        'sprint-resolve-engaged'
    )

    demo = sub1(demo,
        "document.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>{",
        """D('sprintbtn').addEventListener('click',()=>{ G.sprintArm=!G.sprintArm;   /* V44 SPRINT */
  D('sprintbtn').textContent='SPRINT: '+(G.sprintArm?'ARMED':'OFF'); D('sprintbtn').classList.toggle('on',G.sprintArm);
  setRead(G.sprintArm?'SPRINT ARMED':'SPRINT OFF',G.sprintArm?'next move covers two tiles — breaks cover for real':'back to a normal tucked move',G.sprintArm?'#e8593a':'#8a7d66'); });
document.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>{""",
        'sprint-toggle-wire'
    )

    return demo


def patch45(demo):
    """v45 (Paolo 7/23, "camera still fucking up and not showing all the
    Enemies"): the REAL root cause, found by computing the actual numbers
    against the live canvas, not guessing. The auto-frame fit formula
    (V23/V35) was always correct -- it computes exactly the zoom needed to
    hold the farthest active enemy. But the result was clamped to a floor
    of 0.45, and on a real phone canvas (780x1336 backing res, confirmed
    live) any active enemy past about 4.5 tiles needs LESS zoom than that
    floor to fit on screen. Every prior pass (v23, v26, v35) fixed WHICH
    enemies count toward the farthest-distance measurement; none of them
    touched the floor itself, so the fix never reached the actual ceiling.
    Verified against the live app: an 8-enemy fight with a sniper at 14.4
    tiles needed zoom 0.29 to fit him; clamped to 0.45, he rendered 41px
    off the edge of a 780px-wide canvas. Lowering the floor to 0.20 covers
    every realistic spawn distance (worst case, max sniper range 16.5
    tiles, needs ~0.24) with margin to spare."""
    if 'V45 CAMERA FLOOR' in demo:
        print('v45 already applied, skipping')
        return demo

    demo = sub1(demo,
        "      if(md>0){ const fit=(Math.min(W/2,H/2)-96)/Math.max(80,md*ringF+70);\n        uzT=Math.max(0.45,Math.min(1.30,fit)); } }   /* frames the LIVING: drop the far men and it tightens IN */",
        "      if(md>0){ const fit=(Math.min(W/2,H/2)-96)/Math.max(80,md*ringF+70);\n        uzT=Math.max(0.20,Math.min(1.30,fit)); } }   /* V45 CAMERA FLOOR: 0.45 was cutting off any enemy past ~4.5 tiles on a real phone canvas -- 0.20 actually covers realistic spawn/sniper range. frames the LIVING: drop the far men and it tightens IN */",
        'camera-floor-fix')

    return demo


def patch46(demo):
    """v46 (Paolo 7/23, "I need to be able to make comments live as I'm
    playing"): a comment field at the TOP of the combat screen (not
    buried in the settings modal, not anywhere near the bottom-right
    action zone he's protecting) that's live the whole time he's playing.
    Feeds the EXISTING jnotes/export pipeline instead of building a new
    one -- each submitted comment appends a turn-tagged line to the same
    textarea juiceExportText() already reads, so it rides the same COPY
    EXPORT button, no new storage/export surface to maintain."""
    if 'V46 LIVE COMMENT' in demo:
        print('v46 already applied, skipping')
        return demo

    demo = sub1(demo,
        '<div id="chud">\n  <div class="crow"><span class="clbl">YOU</span>',
        """<div id="chud">
  <div class="crow" id="livecomment">   <!-- V46 LIVE COMMENT: top of screen, feeds the same jnotes export -->
    <input id="lcinput" type="text" placeholder="comment while you play..." style="flex:1;min-width:0;background:#0a0806;border:1px solid #241f18;border-radius:6px;color:#d8c9a8;font-size:14px;padding:6px 8px;font-family:'Space Grotesk',sans-serif;">
    <button id="lcadd" class="cbtn">ADD</button>
  </div>
  <div class="crow"><span class="clbl">YOU</span>""",
        'live-comment-row')

    demo = sub1(demo,
        "document.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>{",
        """function addLiveComment(){ const inp=D('lcinput'); if(!inp)return; const txt=(inp.value||'').trim(); if(!txt)return;
  const jn=D('jnotes'); if(jn)jn.value=(jn.value?jn.value+'\\n':'')+'[T'+(G.mTurn||0)+'] '+txt;
  inp.value=''; setRead('COMMENT ADDED','saved — rides the export','#8fd0e8'); }   /* V46 LIVE COMMENT */
D('lcadd').addEventListener('click',addLiveComment);
D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); addLiveComment(); } });
document.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>{""",
        'live-comment-wire')

    return demo


def patch47(demo):
    """v47 (Paolo 7/23, "it should be more difficult to get the green
    action button when it's safe to pop out... depending on the amount
    of dead shots available to me I'm still getting shot at"): the green
    threshold was a flat outN<4 regardless of how many enemies were alive
    -- an 8-man fight and a 3-man fight needed the exact same "fewer than
    4 guns peeking" lull to read as safe. Now it scales with aliveEnemies
    (recomputed live, so it naturally eases as you thin the fight out,
    exactly his ask): 1-3 alive keeps today's threshold (4, unchanged --
    he had no complaint about small fights), 4-6 alive tightens to 3,
    7-8 alive tightens to 2. A crowded fight now genuinely needs a
    cleaner lull to earn green than a thin one does.
    NOTE for the reply, not code: killshots/turn (chainskill) caps how
    many kills you can CHAIN in one pop -- it was never wired to your
    OWN exposure risk, so turning it down doesn't make popping safer.
    That's not a bug, just two different systems; not touched here."""
    if '_crowdThresh=Math.max(2,4-Math.floor' in demo:
        print('v47 already applied, skipping')
        return demo

    demo = sub1(demo,
        "    const firingN=G.e.filter(e=>!e.dead&&firing(e)).length;       // guns actually up right now\n    const outN=G.e.filter(e=>!e.dead&&(peeking(e)||firing(e))).length;\n    if(outN===0){             // nobody out, nothing to pop at\n      bg='radial-gradient(circle at 50% 38%,#3a342a,#15120d 72%)'; glow='0 0 0 1px #4a4030,0 6px 22px rgba(0,0,0,.6)'; col='#8a7d66'; txt='POP OUT';\n    } else if(firingN>=2){    // multiple muzzles up -> popping now = eating several shots\n      bg='radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)'; glow='0 0 0 1px #e0603a,0 0 30px 7px rgba(232,89,58,.7)'; col='#ffeae6'; txt='POP OUT';\n    } else if(firingN===1 || outN>=4){ // one gun up, or a crowd peeking that could snap-fire -> risky",
        "    const firingN=G.e.filter(e=>!e.dead&&firing(e)).length;       // guns actually up right now\n    const outN=G.e.filter(e=>!e.dead&&(peeking(e)||firing(e))).length;\n    const _crowdThresh=Math.max(2,4-Math.floor((aliveEnemies().length-1)/3));   /* V47: a fuller fight needs a cleaner lull -- 1-3 alive=4 (unchanged), 4-6=3, 7-8=2 */\n    if(outN===0){             // nobody out, nothing to pop at\n      bg='radial-gradient(circle at 50% 38%,#3a342a,#15120d 72%)'; glow='0 0 0 1px #4a4030,0 6px 22px rgba(0,0,0,.6)'; col='#8a7d66'; txt='POP OUT';\n    } else if(firingN>=2){    // multiple muzzles up -> popping now = eating several shots\n      bg='radial-gradient(circle at 50% 40%,#8a2618,#2e0e0a 72%)'; glow='0 0 0 1px #e0603a,0 0 30px 7px rgba(232,89,58,.7)'; col='#ffeae6'; txt='POP OUT';\n    } else if(firingN===1 || outN>=_crowdThresh){ // one gun up, or a crowd peeking that could snap-fire -> risky (V47: threshold scales with headcount)",
        'green-scales-headcount')

    return demo


def patch48(demo):
    """v48 (Paolo 7/23, "Green needs to be the whole action wym????"):
    green was a snapshot at the instant you popped, not a lock for the
    action. The dial takes real time to aim; enemies' fire cycles keep
    ticking during that window, so someone who wasn't even peeking when
    you popped could be firing by the time your shot resolved, and
    endTurnReturn evaluated return fire FRESH at that moment -- punishing
    a correctly-read green pop for something that happened after you'd
    already committed. This actually contradicts the code's own
    documented law from 7/4 ("NO DAMAGE BEFORE THE DIAL... Pop clean on
    green, get punished for a whiff, never before the dial") -- so this
    isn't a new feature, it's closing a gap against Paolo's own original
    intent.
    FIX: updGap() now publishes its live green verdict (G._greenNow).
    doPop() snapshots it AND the exact set of enemies who were already a
    known threat (peeking or firing) at the moment of the pop. If the pop
    was green, endTurnReturn's return-fire pool is filtered down to ONLY
    those already-known threats -- anyone who shows up fresh during your
    aim cannot punish a green pop. A pop that wasn't green is unaffected
    (unchanged risk, exactly as before)."""
    if 'V48 GREEN IS A LOCK' in demo:
        print('v48 already applied, skipping')
        return demo

    demo = sub1(demo,
        "  if(green&&!_lastGreen)sndGreen(); _lastGreen=green; }",
        "  G._greenNow=green;   /* V48 GREEN IS A LOCK: doPop() reads this to snapshot the safety promise at commit time */\n  if(green&&!_lastGreen)sndGreen(); _lastGreen=green; }",
        'green-publish-state')

    demo = sub1(demo,
        "function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */ audio();",
        """function doPop(){ if(G.phase!=='cover'||G.over)return; if(G.inc)return;   /* CUTSCENE LAW (Paolo 7/3/26): they play out, short, no skipping */ audio();
  G._poppedGreen=!!G._greenNow;   /* V48 GREEN IS A LOCK: the safety promise is made HERE, not re-litigated at resolve time */
  G._popKnownThreats=new Set(G.e.filter(e=>!e.dead&&(peeking(e)||firing(e))).map(e=>e.i));   /* who you could actually see when you committed */""",
        'pop-snapshot-green')

    demo = sub1(demo,
        "  if(engaged){ // you broke cover to shoot -> EVERYONE who's out with a line shoots back; your cover only softens it\n    pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)&&(e.acq||0)>=1);\n    if(!G._poppedOut)pool=pool.filter(e=>!myCoverAgainst(e.ea,e.edist));   /* V23 EXPOSURE HONESTY: fired from BEHIND the stone — the covered side gets no free volley */ }\n  else {       // you stayed tucked -> only enemies you have NO cover toward can reach you\n    pool=exposedToMe().filter(e=>(e.acq||0)>=1); }",
        "  if(engaged){ // you broke cover to shoot -> EVERYONE who's out with a line shoots back; your cover only softens it\n    pool=G.e.filter(e=>!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine(e)&&(e.acq||0)>=1);\n    if(!G._poppedOut)pool=pool.filter(e=>!myCoverAgainst(e.ea,e.edist));   /* V23 EXPOSURE HONESTY: fired from BEHIND the stone — the covered side gets no free volley */ }\n  else {       // you stayed tucked -> only enemies you have NO cover toward can reach you\n    pool=exposedToMe().filter(e=>(e.acq||0)>=1); }\n  if(G._poppedGreen)pool=pool.filter(e=>G._popKnownThreats&&G._popKnownThreats.has(e.i));   /* V48: a green pop only answers to threats that were ALREADY visible when you committed */\n  G._poppedGreen=false;   /* V48: single-use -- consumed the moment this resolution reads it, so a later WAIT never inherits a stale green */",
        'engaged-pool-green-lock')

    return demo


def patch49(demo):
    """v49 (Paolo 7/23, "I wrote like a whole big ass paragraph and then
    I pressed and then it went all the way"): the v46 comment field was a
    single-line <input>, which scrolls text SIDEWAYS as you type past its
    width instead of wrapping -- confirmed live: typing a 271-char
    paragraph left the box showing only its last ~40 characters, with
    everything before it scrolled out of view to the left. The data was
    never lost (captured + saved correctly underneath), but it LOOKED
    broken, exactly what he described. Swapped to a real multi-line
    <textarea> (2 rows tall by default, grows a bit, caps at a modest
    max-height with internal scroll so it can't push the HP bar/board
    too far down the screen) that wraps like text is supposed to. Also
    dropped the Enter-submits-the-comment handler -- Enter in a textarea
    should insert a line break like anywhere else; ADD is still there to
    actually submit."""
    if 'V49 COMMENT WRAPS' in demo or 'V50 COMMENT COPY BUTTON' in demo:
        print('v49 already applied, skipping')
        return demo

    demo = sub1(demo,
        '    <input id="lcinput" type="text" placeholder="comment while you play..." style="flex:1;min-width:0;background:#0a0806;border:1px solid #241f18;border-radius:6px;color:#d8c9a8;font-size:14px;padding:6px 8px;font-family:\'Space Grotesk\',sans-serif;">',
        '    <textarea id="lcinput" rows="2" placeholder="comment while you play..." style="flex:1;min-width:0;max-height:90px;background:#0a0806;border:1px solid #241f18;border-radius:6px;color:#d8c9a8;font-size:14px;padding:6px 8px;font-family:\'Space Grotesk\',sans-serif;resize:vertical;overflow-y:auto;line-height:1.35;"></textarea>   <!-- V49 COMMENT WRAPS: a real multi-line box, not a single-line input that scrolls sideways -->',
        'comment-box-wraps')

    demo = sub1(demo,
        "D('lcadd').addEventListener('click',addLiveComment);\nD('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); addLiveComment(); } });",
        "D('lcadd').addEventListener('click',addLiveComment);   /* V49: Enter now just makes a line break, like any other multi-line box -- ADD submits */",
        'comment-drop-enter-submit')

    return demo


def patch50(demo):
    """v50 (Paolo 7/23, correcting v49: "I did not tell you to make a
    bigger multi box... all I was saying is that there was no export
    copy button I pressed add and all of my shit went away"): v49
    misread the complaint as a text-scrolling bug and grew the box
    (rows=2, max-height 90px) -- eating screen space he explicitly didn't
    want to give up, and not even the real problem. The real problem: ADD
    clears the input (by design, it moves the text into jnotes) but
    there was no visible way to get that text back out short of digging
    into SETTINGS for the COPY EXPORT button -- so from where he's
    sitting, typing a comment and tapping ADD just makes it vanish.
    FIX: revert the box back to the original compact single-line input
    (undo v49's size growth entirely), and add a small COPY button right
    in that same row, wired through the exact same proven export rail
    jexport already uses (sync clipboard write, async clipboard
    fallback, THEN post up to the parent app's export panel -- the
    reliable rail on mobile/iOS) so his comments are one tap away without
    ever opening settings."""
    if 'V50 COMMENT COPY BUTTON' in demo or 'V51 NO ADD BUTTON' in demo:
        print('v50 already applied, skipping')
        return demo

    demo = sub1(demo,
        '    <textarea id="lcinput" rows="2" placeholder="comment while you play..." style="flex:1;min-width:0;max-height:90px;background:#0a0806;border:1px solid #241f18;border-radius:6px;color:#d8c9a8;font-size:14px;padding:6px 8px;font-family:\'Space Grotesk\',sans-serif;resize:vertical;overflow-y:auto;line-height:1.35;"></textarea>   <!-- V49 COMMENT WRAPS: a real multi-line box, not a single-line input that scrolls sideways -->\n    <button id="lcadd" class="cbtn">ADD</button>',
        '    <input id="lcinput" type="text" placeholder="comment while you play..." style="flex:1;min-width:0;background:#0a0806;border:1px solid #241f18;border-radius:6px;color:#d8c9a8;font-size:14px;padding:6px 8px;font-family:\'Space Grotesk\',sans-serif;">   <!-- V50: back to compact, size was never the real problem -->\n    <button id="lcadd" class="cbtn">ADD</button>\n    <button id="lccopy" class="cbtn">COPY</button>   <!-- V50 COMMENT COPY BUTTON: right here, no trip to settings needed -->',
        'comment-box-compact-plus-copy')

    demo = sub1(demo,
        "D('lcadd').addEventListener('click',addLiveComment);   /* V49: Enter now just makes a line break, like any other multi-line box -- ADD submits */",
        """D('lcadd').addEventListener('click',addLiveComment);
D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); addLiveComment(); } });   /* V50: single-line input again, Enter submits like before */
D('lccopy').addEventListener('click',()=>{   /* V50: your comments, one tap, no settings trip -- same proven rail as jexport */
  const t=(D('jnotes')&&D('jnotes').value)||''; const b=D('lccopy');
  if(!t.trim()){ b.innerHTML='<b>NOTHING YET</b>'; setTimeout(()=>{b.innerHTML='COPY';},1400); return; }
  let ok=false;
  try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-999px;font-size:16px';
    document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,t.length);ok=document.execCommand('copy');document.body.removeChild(ta);}catch(_e){}
  if(!ok&&navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(()=>{},()=>{});}
  if(window.parent&&window.parent!==window){
    try{parent.postMessage({bohemiaExport:{name:'combat_comments.txt',text:t}},'*');
      b.innerHTML='<b>'+(ok?'COPIED + ':'')+'SENT &#8599;</b>';}catch(_e){b.innerHTML='<b>'+(ok?'COPIED</b>':'COPY BLOCKED</b>');}}
  else b.innerHTML='<b>'+(ok?'COPIED':'select + copy manually')+'</b>';
  setTimeout(()=>{b.innerHTML='COPY';},2200); });""",
        'comment-copy-wire')

    return demo


def patch51(demo):
    """v51 (Paolo 7/24: "Bro REMOVE THE ADD BUTTON IT DOES NOTHING"): ADD
    technically worked (it saved into jnotes) but the only feedback was a
    setRead() toast elsewhere on screen -- easy to miss, so from where he's
    sitting it looked like a dead button. Rather than try to make ADD's
    feedback louder, cut it: COPY is now the ONE button. It folds whatever's
    sitting in the input into jnotes first (same addLiveComment() call ADD
    used to make), THEN copies/exports everything, so nothing typed is ever
    lost and there's one less button to wonder about. Enter in the input
    does the same thing ADD used to."""
    if 'V51 NO ADD BUTTON' in demo:
        print('v51 already applied, skipping')
        return demo

    demo = sub1(demo,
        '    <button id="lcadd" class="cbtn">ADD</button>\n    <button id="lccopy" class="cbtn">COPY</button>   <!-- V50 COMMENT COPY BUTTON: right here, no trip to settings needed -->',
        '    <button id="lccopy" class="cbtn">COPY</button>   <!-- V50 COMMENT COPY BUTTON: right here, no trip to settings needed -- V51 NO ADD BUTTON: now the only button, saves + copies in one tap -->',
        'comment-remove-add-button')

    demo = sub1(demo,
        "D('lcadd').addEventListener('click',addLiveComment);\nD('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); addLiveComment(); } });   /* V50: single-line input again, Enter submits like before */\nD('lccopy').addEventListener('click',()=>{   /* V50: your comments, one tap, no settings trip -- same proven rail as jexport */\n  const t=(D('jnotes')&&D('jnotes').value)||''; const b=D('lccopy');",
        "D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); D('lccopy').click(); } });   /* V51 NO ADD BUTTON: Enter just triggers the one button now */\nD('lccopy').addEventListener('click',()=>{   /* V50: your comments, one tap, no settings trip -- same proven rail as jexport */\n  addLiveComment();   /* V51 NO ADD BUTTON: fold whatever's typed into jnotes first -- ADD is gone, this button does both jobs now */\n  const t=(D('jnotes')&&D('jnotes').value)||''; const b=D('lccopy');",
        'comment-copy-does-both')

    return demo


def main():
    src = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", src)
    if not m:
        sys.exit('FAIL: COMBAT_B64 not found')
    demo = base64.b64decode(m.group(1)).decode('utf-8')
    patched = patch51(patch50(patch49(patch48(patch47(patch46(patch45(patch44(patch43(patch42(patch41(patch40(patch39(patch38(patch37(patch36(patch35(patch34(patch33(patch32d(patch32c(patch32b(patch32(patch31(patch30b(patch30(patch29(patch28(patch27(patch26(patch25(patch24(patch23(patch22(patch21(patch20(patch19(patch18(patch17(patch16(patch15(patch14(patch13(patch12(patch11(patch10(patch9(patch8(patch7(patch6(patch5(patch4(patch3(patch2(patch(demo)))))))))))))))))))))))))))))))))))))))))))))))))))))))
    if patched == demo:
        return
    b64 = base64.b64encode(patched.encode('utf-8')).decode('ascii')
    out = src[:m.start(1)] + b64 + src[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(out)
    print('OK: COMBAT_B64 patched (%d -> %d chars decoded)' % (len(demo), len(patched)))


if __name__ == '__main__':
    main()
