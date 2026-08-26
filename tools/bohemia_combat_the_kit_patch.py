#!/usr/bin/env python3
"""
V185 THE KIT -- RF4-11 and RF4-13, six abilities recharged by SIX DIFFERENT VERBS.

  PAOLO 8/26, ruling: A REAL KIT of abilities.
  PAOLO 8/26, minutes ago: "I really need you to take big turns and big swings for
  the combat. I can't be... you can't just be doing one thing at a time like, bro,
  I really need this shit to look like Rogue Fable four RIGHT NOW."

  RF4-13: "RECHARGE CONDITIONS ARE UNIQUE PER ITEM, AND THEY ARE VERBS, NOT
  TIMERS. Armor-of-Repulsion recharges based on DAMAGE TAKEN..."
  RF4-11: "Equipment should have abilities connected to them with MIXED resource
  mechanics."

*** THIS IS THE PIECE THAT MAKES A TURN A CHOICE, AND IT IS THE LAST BIG ONE HE
RULED ON THAT WAS NOT BUILT. *** The bars (V182/V184) are what you spend and lose.
The kit is what you DO. Without it every turn in this game is still "shoot, or
walk" -- which is exactly why eight mechanics shipped across six days and none of
them changed the feel.

-------------------------------------------------------------------------
SIX ABILITIES, SIX DIFFERENT VERBS, AND THE VERBS ARE THE POINT
-------------------------------------------------------------------------
A timer recharges whatever you do, so it teaches nothing. A VERB recharges only if
you played a certain way, so the kit itself tells you how the game wants to be
played -- and having six different verbs means no single style keeps everything
lit. That is RF4-13's whole argument and it is why the six were chosen to conflict:

  PLATE UP    <- TAKE A HIT.        RF4's OWN EXAMPLE, near enough verbatim
                                    ("Armor-of-Repulsion recharges based on damage
                                    taken"). Getting hurt buys you armour.
  BREAK CONTACT <- MOVE TWO TILES.  Smoke at your feet; every line on you dies.
  STEADY      <- END A TURN IN COVER. Tucking buys ONE much wider dial.
  SLIP        <- PUT A MAN DOWN.    A free two-tile move to the nearest stone,
                                    and it costs no speed pip.
  CALL IT     <- LAND A SHOT.       Pin the man with the best line on you.
  READ THE ROOM <- END A TURN WIDE OPEN UNDER THEIR EYES. V180's exact condition.
                                    Standing where they can see you buys a speed
                                    pip back and a turn of Power.

TAKING A HIT and TUCKING and STANDING IN THE OPEN cannot all be true at once. So
the kit is a set of pressures, not a shopping list, which is the difference
between depth and a bigger menu.

-------------------------------------------------------------------------
NO DAMAGE BEFORE THE DIAL, AND NOT ONE OF THE SIX BREAKS IT
-------------------------------------------------------------------------
Not one ability deals damage, adds damage, or changes an accuracy number. They
move you, hide you, pin a man, hand you a plate, widen the dial for one shot, or
give back a pip. Every effect is POSITION, STATE or RESOURCE -- and every one of
them drives a machine that already exists (smoke, suppress, plates, the power
term, the speed pips, doDash's mover).

EVERY ABILITY IS SELF-CONTAINED ON PURPOSE. V122 took DASH and VAULT off the top
menu because they "lived at the TOP of the screen and acted at the BOTTOM, on the
ring, with his thumb" -- a button that arms and then makes you travel to say which
way. None of these six asks for a direction. You press it, it happens.

MECHANISM MINE, CONTENTS HIS: the verbs, the charges and the effects are
mechanism. The NAMES are WORDS, so under the 8/11 amendment they ship as a real
attempt tagged draft:true rather than six blanks he would have to fill.

REUSE CHECK: cooks no graphic pixels and opens no bank. It calls the shipped
smoke, the shipped pin, the shipped plate count, the shipped power term, the
shipped speed pips and the shipped mover. Nothing is reimplemented.

TASTE CHECK: a button only exists while it is CHARGED, so the row is empty at the
start of a fight and never becomes furniture.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V185 THE KIT'


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
        print('v185: already applied')
        return

    # ---- 1. THE KIT ----
    d = sub(d,
        "const PLATE_START=1;  /* [DIAL] what you walk in with */",
        """const PLATE_START=1;  /* [DIAL] what you walk in with */
/* ===== V185 THE KIT (RF4-11, RF4-13) ==============================
   "RECHARGE CONDITIONS ARE UNIQUE PER ITEM, AND THEY ARE VERBS, NOT TIMERS."
   THE PIECE THAT MAKES A TURN A CHOICE. The bars are what you spend and lose;
   the kit is what you DO. Without it every turn here is still "shoot, or walk",
   which is why eight mechanics shipped in six days and none changed the feel.
   THE VERBS ARE THE POINT AND THEY CONFLICT ON PURPOSE. A timer recharges
   whatever you do and teaches nothing. A verb recharges only if you played a
   certain way -- so the kit tells you how the game wants to be played, and
   because TAKING A HIT and TUCKING and STANDING IN THE OPEN cannot all be true
   at once, no single style keeps everything lit. A set of pressures, not a
   shopping list.
   NOT ONE OF THE SIX DEALS OR MODIFIES DAMAGE. Position, state, resource.
   ALL SIX ARE SELF-CONTAINED. V122 pulled DASH and VAULT off the top menu for
   living at the top and acting at the bottom with his thumb; nothing here asks
   for a direction. You press it, it happens.
   [draft:true] on every NAME -- what these are CALLED is his. */
const KIT=[
  {id:'plate', n:'PLATE UP',      verb:'hit',   need:2, draft:true,
   why:'they put one in you and you got your hands on a vest'},
  {id:'smoke', n:'BREAK CONTACT', verb:'move2', need:3, draft:true,
   why:'smoke at your feet, every line on you dies'},
  {id:'steady',n:'STEADY',        verb:'cover', need:2, draft:true,
   why:'one shot, and the dial is wide'},
  {id:'slip',  n:'SLIP',          verb:'kill',  need:1, draft:true,
   why:'two tiles to the nearest stone, free'},
  {id:'call',  n:'CALL IT',       verb:'shot',  need:3, draft:true,
   why:'the man with the best line on you puts his head down'},
  {id:'read',  n:'READ THE ROOM', verb:'open',  need:2, draft:true,
   why:'a pip back and a turn of power for standing where they can see you'}
];
function kitDef(id){ for(const k of KIT)if(k.id===id)return k; return null; }
function kitReady(id){ const k=kitDef(id); if(!k)return false;
  return ((G.kit&&G.kit[id])||0)>=k.need; }
/* THE VERB FEED. Every hook below is a thing the player DID, never a clock. */
function kitVerb(verb){
  if(G.over)return;
  G.kit=G.kit||{};
  for(const k of KIT){ if(k.verb!==verb)continue;
    const was=(G.kit[k.id]||0);
    if(was>=k.need)continue;
    G.kit[k.id]=was+1;
    if(G.kit[k.id]>=k.need)try{ setRead(k.n+' READY',k.why,'#8fe89a'); }catch(_e){} }
  try{ updKit(); }catch(_e){} }
function kitSpend(id){
  const k=kitDef(id); if(!k||!kitReady(id))return false;
  G.kit[id]=0; try{ updKit(); }catch(_e){} return true; }
/* THE SIX. Each one drives a machine that already exists. */
function useKit(id){
  if(G.over||G.inc||!kitReady(id))return false;
  if(id==='plate'){ if(!kitSpend(id))return false;
    G.pp=Math.min(PP_MAX,(G.pp||0)+1); try{updPP();}catch(_e){}
    setRead('PLATE UP','one on your chest','#8fe89a'); return true; }
  if(id==='smoke'){ if(!kitSpend(id))return false;
    G.smoke=G.smoke||[];
    G.smoke.push({ea:0,edist:0,r:3.0,t:performance.now(),born:G.mTurn||0});
    try{ updateGeomCover(); visionTick(); }catch(_e){}
    setRead('BREAK CONTACT','smoke at your feet','#8fd0e8'); return true; }
  if(id==='steady'){ if(!kitSpend(id))return false;
    G._steadyShot=true;
    setRead('STEADY','next shot, the dial is wide','#8fe89a'); return true; }
  if(id==='slip'){ if(!kitSpend(id))return false;
    let best=null,bd=1e9;
    for(const P of (G.pillars||[])){ const q=pXY(P); const dd=Math.hypot(q[0],q[1]);
      if(dd>0.9&&dd<bd){bd=dd;best=q;} }
    if(best){ const n=Math.hypot(best[0],best[1])||1;
      try{ worldShift(-Math.round(best[0]/n*2), -Math.round(best[1]/n*2)); }catch(_e){}
      try{ updateGeomCover(); visionTick(); }catch(_e){} }
    setRead('SLIP','two tiles, and it cost you nothing','#8fd0e8'); return true; }
  if(id==='call'){ if(!kitSpend(id))return false;
    let tgt=null; try{ const pool=exposedToMe(); tgt=pool&&pool[0]; }catch(_e){}
    if(!tgt)for(const e of (G.e||[])){ if(e&&!e.dead&&!e.downed){tgt=e;break;} }
    if(tgt){ tgt.supp=Math.max(tgt.supp||0,2); tgt.windup=false; tgt.acq=0; }
    setRead('CALL IT',tgt?(tgt.n+' puts his head down'):'nobody to call','#e8c88a'); return true; }
  if(id==='read'){ if(!kitSpend(id))return false;
    G.stam=Math.min(STAM_MAX,(G.stam||0)+1); try{updStam();}catch(_e){}
    G.power=(G.power||0)+1; G._powerTurn=(G.mTurn||0);
    setRead('READ THE ROOM','a pip back, and the gun sits easier','#8fe89a'); return true; }
  return false; }
function updKit(){ const row=D('kitrow'); if(!row)return;
  let h='';
  for(const k of KIT) if(kitReady(k.id))
    h+='<button class="cbtn kitb" data-kit="'+k.id+'" style="border-color:#8fe89a;color:#8fe89a">'+k.n+'</button>';
  row.innerHTML=h; }""",
        what='the kit')

    # ---- 2. THE VERBS FIRE OFF REAL EVENTS ----
    d = sub(d,
        """function hurtPlayer(dmg){
  dmg=Math.max(0,dmg|0); if(!dmg)return 0;""",
        """function hurtPlayer(dmg){
  dmg=Math.max(0,dmg|0); if(!dmg)return 0;
  try{ kitVerb('hit'); }catch(_x){}   /* V185: RF4's own example -- armour that recharges on damage taken */""",
        what='verb hit')

    d = sub(d,
        "  if(kind!=='miss')finisherFeed();",
        "  if(kind!=='miss'){ finisherFeed(); try{ kitVerb('shot'); }catch(_x){} }   /* V185 */",
        what='verb shot')

    # *** CAUGHT BEFORE SHIPPING, AND IT IS THE FOURTH TIME TODAY. *** The first
    # write of this kit hooked five verbs and left 'move2' with NO CALLER, so
    # BREAK CONTACT could never charge in a played fight -- shipped, correct and
    # structurally unreachable, exactly like V152's chewCover, V176's threshold
    # and five of six deaths in V181. spendMove() is the ONE owner of a two-tile
    # move: sprint spends 1 pip for two tiles, dash spends 2, and both come
    # through here. One hook covers both.
    d = sub(d,
        "function spendMove(n){\n  if(!spendStam(n))return false;",
        "function spendMove(n){\n  if(!spendStam(n))return false;\n  try{ kitVerb('move2'); }catch(_x){}   /* V185: covering ground on your pips is the verb */",
        what='verb move2')

    d = sub(d,
        "function bodyFell(e){\n  if(!e)return;",
        "function bodyFell(e){\n  if(!e)return;\n  try{ kitVerb('kill'); }catch(_x){}   /* V185 */",
        what='verb kill')

    d = sub(d,
        """function openGroundTick(){
  /* NO SECOND CAP HERE.""",
        """function openGroundTick(){
  /* V185: standing where they can see you is a VERB too -- the same condition
     V180 already pays a finisher charge for, now also charging READ THE ROOM. */
  try{ if(!G.over&&wideOpen()&&eyesOnMe())kitVerb('open'); }catch(_x){}
  /* NO SECOND CAP HERE.""",
        what='verb open')

    # ---- 3. COVER AND MOVEMENT VERBS, AND THE STEADY SHOT ----
    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick();",
        """function kitCoverTick(){
  /* V185: ending a turn behind stone is the TUCK verb, and it is deliberately
     the opposite pressure to 'open' above -- both cannot be true in one turn. */
  try{ if(!G.over&&!wideOpen())kitVerb('cover'); }catch(_x){} }
function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick(); kitCoverTick();""",
        what='verb cover')

    d = sub(d,
        "const _pwr=powerMult();",
        """/* V185 STEADY: one shot, a much wider dial, spent on use. It rides the same
     power term rather than inventing a second multiplier. */
  const _steady=G._steadyShot?1.6:1; if(G._steadyShot)G._steadyShot=false;
  const _pwr=powerMult()*_steady;""",
        what='steady in the dial')

    # ---- 4. THE ROW, AND A FRESH FIGHT ----
    d = sub(d,
        '<button id="suppressbtn" class="cbtn" style="border-color:#d69a3a;color:#e8c88a">SUPPRESS</button>',
        '<button id="suppressbtn" class="cbtn" style="border-color:#d69a3a;color:#e8c88a">SUPPRESS</button>\n    <span id="kitrow"></span>   <!-- V185: a button only exists while it is CHARGED, so this is empty at the start of a fight and never becomes furniture -->',
        what='kit row')

    d = sub(d,
        "G.pp=PLATE_START; G.power=POWER_BASE;",
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false;   /* V185: a kit is charged in the fight you spend it in */",
        what='reset')

    d = sub(d,
        "{ const _s=D('suppressbtn'); if(_s)_s.addEventListener('click',doSuppress);",
        """{ /* V185: one listener on the row, because the buttons come and go with their
     charges. Delegation, so a button that did not exist a turn ago still works. */
  const _kr=D('kitrow');
  if(_kr)_kr.addEventListener('click',(ev)=>{ const b=ev.target&&ev.target.closest?ev.target.closest('[data-kit]'):null;
    if(!b)return; try{ audio(); }catch(_e){}
    useKit(b.getAttribute('data-kit')); try{ renderBoard(); updGap(); }catch(_e){} });
  const _s=D('suppressbtn'); if(_s)_s.addEventListener('click',doSuppress);""",
        what='kit wiring')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v185: the kit -- %d chars' % len(d))


if __name__ == '__main__':
    main()
