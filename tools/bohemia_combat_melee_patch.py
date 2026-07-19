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


def main():
    src = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64='([^']+)'", src)
    if not m:
        sys.exit('FAIL: COMBAT_B64 not found')
    demo = base64.b64decode(m.group(1)).decode('utf-8')
    patched = patch3(patch2(patch(demo)))
    if patched == demo:
        return
    b64 = base64.b64encode(patched.encode('utf-8')).decode('ascii')
    out = src[:m.start(1)] + b64 + src[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(out)
    print('OK: COMBAT_B64 patched (%d -> %d chars decoded)' % (len(demo), len(patched)))


if __name__ == '__main__':
    main()
