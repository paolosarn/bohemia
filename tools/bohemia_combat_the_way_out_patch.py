#!/usr/bin/env python3
"""V159 THE WAY OUT, AND THE AMMO GOES QUIET.

Paolo 8/16, two rulings in one breath:

  "I like that in rogue fable four you have to go down the dungeon so from one
   second to another so it is a movement goal for stuff so I think that's
   important."

  "I'm not a big fan of the ammo being depleted like I'm walking around like it's
   only four bullets like it's crazy."

--------------------------------------------------------------------------
1. THE AMMO ENDS. SECOND REJECTION.
--------------------------------------------------------------------------
He said it on 8/16 ("I hate that I ran out of ammo... unrealistic") and he has now
said it again. STOP PRODUCING is explicit: A SECOND REJECTION ENDS THE FEATURE.
Tuning the number a third time is the fourth-version mistake wearing a new hat,
and finding a legal way to ship scarcity anyway IS the violation.

So it goes quiet behind ONE dial. The gun never runs dry, the readout disappears,
the ground stops being littered with rounds. Nothing is deleted, because he did
not say kill it, he said he is not a fan -- one word from him turns it back on.

*** AND THE MECHANISM WAS NEVER THE PROBLEM, THE JOB I GAVE IT WAS. *** Ammo was
carrying the movement law, which is why it had to be scarce, which is why it kept
insulting him. The movement law gets its own mechanism below, and ammo is free to
be a flavour thing later, at numbers nobody has to defend.

--------------------------------------------------------------------------
2. THE WAY OUT: HIS ROGUE FABLE IV PICK
--------------------------------------------------------------------------
"you have to go down the dungeon... it is a movement goal."

That is mechanism 5 from his own law -- THE OBJECTIVE MOVES -- and it is the one
that cannot be tanked, because it is not a punishment for staying. It is a place
you have to reach.

  *** EVERY FIGHT NOW HAS A WAY OUT, AND REACHING IT IS HOW YOU WIN. ***

Killing every man on the board no longer ends the encounter. That is the whole
point and it is the RF4 shape exactly: clearing a floor does not advance you,
taking the stairs does. You are not a soldier clearing a map. You are a person in
a collapsed city trying to get somewhere, and the men are what is between you and
it.

WHY IT SATISFIES THE LAW WHEN NOTHING ELSE DID: cover decay, flankers and the
flush all make standing still WORSE, and every one can be tanked by a good player.
A destination cannot be tanked. From one spot, the win condition is not reachable
at all -- not unlikely, IMPOSSIBLE -- which is the only shape that makes his test
read zero without me shrinking a magazine to force it.

DERIVED, NEVER DESIGNED (MAP LAW). The way out is placed on the bearing the
threat is coming FROM, beyond the furthest man, exactly as V137's hold place is
derived opposite that same bearing. Nothing here authors a layout: it reads where
they already are. Push through them to leave.

--------------------------------------------------------------------------
WHAT THIS DOES NOT TOUCH
--------------------------------------------------------------------------
The gun ranges. He said again that they "still aren't good" and he is right that
they are unfinished, but he has not said WHICH WAY, and the biggest suspect is a
ruling of his own (V151's floor, which he marked temporary himself). Not mine to
reverse. Named in the reply, untouched here.

REUSE CHECK: cooks NO graphic pixels. The way-out marker IS V137's hold marker,
which was itself the grenade marker -- same fieldPos, same pulsing disc, same
dashed ring, same label draw. The placement reuses placeHoldLine's threat-bearing
derivation. worldShift already walks a list of world tiles; this is one more line
in it. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his: a movement goal, in his words
"from one second to another". The restraint is that the way out is a PLACE and
never a timer -- no countdown, no shrinking circle, no author on a loudspeaker,
which is the same restraint V152 argued for and finally has a mechanism worthy of
it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. Reaching a tile needs no new animation, so it
  owes the CHARACTER lane nothing and cannot be blocked on a clip that does not
  exist.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V159 THE WAY OUT'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v159 already in; nothing to do')
        return

    # ---- 1. the ammo goes quiet ---------------------------------------
    old = """const MAG={pistol:15, smg:30, rifle:20, shotgun:6};   /* [DIAL] what a gun HOLDS when it is full -- the real numbers */"""
    new = """/* ===== V159 THE AMMO GOES QUIET ==============================
   Paolo 8/16, for the SECOND time: "I'm not a big fan of the ammo being depleted
   like I'm walking around like it's only four bullets like it's crazy."
   STOP PRODUCING IS EXPLICIT: A SECOND REJECTION ENDS THE FEATURE. Tuning this
   number a third time is the fourth-version mistake in a new hat, and finding a
   legal way to ship scarcity anyway IS the violation.
   ONE DIAL, and nothing is deleted -- he said he is not a fan, not kill it, so
   one word turns it back on.
   *** AND THE MECHANISM WAS NEVER THE PROBLEM, THE JOB I GAVE IT WAS. *** Ammo
   was carrying the movement law, which is why it had to be scarce, which is why
   it kept insulting him. The movement law has its own mechanism now (THE WAY
   OUT, below) and ammo is free to be flavour later at numbers nobody has to
   defend. */
const AMMO_ON=false;   /* [DIAL] Paolo 8/16: the gun does not run dry. One word flips it. */
const MAG={pistol:15, smg:30, rifle:20, shotgun:6};   /* [DIAL] what a gun HOLDS when it is full -- the real numbers */"""
    js = subN(js, old, new)

    # the gun simply never empties, and nothing else has to know
    old = """function dryNow(){ return roundsIn(WEAPON)<=0; }"""
    new = """function dryNow(){ return AMMO_ON && roundsIn(WEAPON)<=0; }"""
    js = subN(js, old, new)

    old = """function spendRound(){ const w=WEAPON; G.ammo=G.ammo||{}; roundsIn(w); G.ammo[w]=Math.max(0,G.ammo[w]-1);"""
    new = """function spendRound(){ if(!AMMO_ON)return 99; const w=WEAPON; G.ammo=G.ammo||{}; roundsIn(w); G.ammo[w]=Math.max(0,G.ammo[w]-1);"""
    js = subN(js, old, new)

    old = """function dropRounds(e){ if(!e)return; G.drops=G.drops||[];"""
    new = """function dropRounds(e){ if(!AMMO_ON)return; if(!e)return; G.drops=G.drops||[];"""
    js = subN(js, old, new)

    old = """function updAmmoRead(){ try{ const el=D('ammoread'); if(!el)return;"""
    new = """function updAmmoRead(){ try{ const el=D('ammoread'); if(!el)return;
  if(!AMMO_ON){ el.textContent=''; return; }   /* V159: no counter for a gun that does not run dry */"""
    js = subN(js, old, new)

    # ---- 2. THE WAY OUT ------------------------------------------------
    old = """function placeHoldLine(spec){"""
    new = """/* ===== V159 THE WAY OUT ======================================
   Paolo 8/16: "I like that in rogue fable four you have to go down the dungeon
   so from one second to another so it is a movement goal for stuff so I think
   that's important."
   That is mechanism 5 from his own law -- THE OBJECTIVE MOVES -- and it is the
   one that cannot be tanked, because it is not a punishment for staying, it is a
   place you have to reach.
   *** REACHING IT IS HOW YOU WIN. Killing every man no longer ends the fight. ***
   That is the RF4 shape exactly: clearing a floor does not advance you, taking
   the stairs does. You are not a soldier clearing a map, you are a person trying
   to get somewhere and the men are what is between you and it.
   WHY IT WORKS WHERE THE OTHERS DID NOT: cover decay, flankers and the flush all
   make standing still WORSE and can all be tanked by a good player. A
   DESTINATION CANNOT BE TANKED -- from one spot the win condition is not merely
   unlikely, it is unreachable -- which is the only shape that takes his test to
   zero without me shrinking a magazine to force it.
   DERIVED, NEVER DESIGNED (MAP LAW): placed on the bearing the threat comes
   FROM, beyond the furthest man, reading where they already are. Push through
   them to leave. */
const EXIT_ON=true;
const EXIT_R=1.4;        /* [DIAL] how close is "you made it" */
/* BOUNDED, BECAUSE A JOURNEY IS NOT A FIGHT. The first cut put it beyond the
   FURTHEST man and measured 32.8 tiles -- roughly 32 moves against a fight that
   lasts about 14 turns. That is a hike with a gunfight at the start. It sits at
   the range the nearest man is holding instead, clamped, so the trip and the
   fight happen in the same place: they are closing on him while he is advancing
   on it, and they meet in the middle. */
const EXIT_MIN=10.0;     /* [DIAL] never so near that standing still reaches it */
const EXIT_MAX=18.0;     /* [DIAL] and never so far that it stops being a fight */
function placeWayOut(){ G.exit=null; G._wonByExit=false;
  if(!EXIT_ON)return;
  let sx=0,sy=0,n=0,near=1e9;
  for(const e of (G.e||[])){ if(!e||e.dead)continue;
    sx+=Math.cos(e.ea); sy+=Math.sin(e.ea); n++; if((e.edist||0)<near)near=e.edist||0; }
  const threat=n?Math.atan2(sy,sx):0;
  G.exit={ea:threat, edist:Math.min(EXIT_MAX,Math.max(EXIT_MIN,(near<1e9?near:EXIT_MIN))), r:EXIT_R, lvl:0};
  try{ setRead('THE WAY OUT','get to it and you are gone \\u2014 they are what is between you and it','#6aa8e8'); }catch(_e){} }
function exitCheck(){ if(!EXIT_ON||!G.exit||G.over)return false;
  if((G.exit.edist||99)<=(G.exit.r||EXIT_R)){ G._wonByExit=true; try{winGame();}catch(_e){} return true; }
  return false; }
function placeHoldLine(spec){"""
    js = subN(js, old, new)

    # it is world state, and reaching it is checked every time the world moves
    old = """  if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);   /* V157: rounds stay on the tile they fell on -- if they moved with him there would be nothing to walk to */"""
    new = """  if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);   /* V157: rounds stay on the tile they fell on -- if they moved with him there would be nothing to walk to */
  if(G.exit)mv(G.exit,0.02);   /* V159: the way out is a TILE. If it moved with him he could never arrive */"""
    js = subN(js, old, new)

    old = """  try{sweepDrops();}catch(_e){}   /* the world moving under him IS him walking */"""
    new = """  try{sweepDrops();}catch(_e){}   /* the world moving under him IS him walking */
  try{exitCheck();}catch(_e){}   /* V159: and walking is how he wins */"""
    js = subN(js, old, new)

    # ---- 3. killing everybody stops being the win ----------------------
    old = """function checkClear(){ if(!G.over && aliveEnemies().length===0){ winGame(); return true; } return false; }   /* V31 AREA CLEAR: the fight ends the instant nobody can fight — nerve breaks and downings included */"""
    new = """/* V159: KILLING EVERY MAN NO LONGER ENDS THE FIGHT when there is a way out to
   reach. This is the whole ruling -- a destination you can win from one spot is
   not a destination. With the board empty the walk is safe and short, and the
   readout says so. */
function checkClear(){ if(!G.over && aliveEnemies().length===0){
    if(EXIT_ON&&G.exit){ try{ setRead('NOTHING LEFT IN YOUR WAY','the way out is '+Math.round(G.exit.edist)+' tiles \\u2014 go','#8fe89a'); }catch(_e){} return false; }
    winGame(); return true; } return false; }   /* V31 AREA CLEAR: the fight ends the instant nobody can fight — nerve breaks and downings included */"""
    js = subN(js, old, new)

    old = """  if(aliveEnemies().length===0){ try{winGame();}catch(_e){} } }"""
    new = """  if(aliveEnemies().length===0){ if(!(EXIT_ON&&G.exit))try{winGame();}catch(_e){} } }   /* V159: the way out is the win when there is one */"""
    js = subN(js, old, new)

    old = """function afterKill(){ if(aliveEnemies().length===0)return winGame();"""
    new = """function afterKill(){ if(aliveEnemies().length===0&&!(EXIT_ON&&G.exit))return winGame();
  if(aliveEnemies().length===0)return endTurnReturn(false);   /* V159: board clear, but you still have to leave */"""
    js = subN(js, old, new)

    # ---- 4. the win says which win it was ------------------------------
    old = """function winGame(){ camHome(); G.over=true; G.win=true; G.phase='over'; sndWin(); setRead('AREA CLEAR','every gun down','#8fe89a'); setPhaseUI();"""
    new = """function winGame(){ camHome(); G.over=true; G.win=true; G.phase='over'; sndWin();
  setRead(G._wonByExit?'YOU MADE IT':'AREA CLEAR',
          G._wonByExit?'out, and it never mattered how many you left standing':'every gun down','#8fe89a'); setPhaseUI();"""
    js = subN(js, old, new)

    # ---- 5. placed at the bell, cleared on reset -----------------------
    # AFTER resetFightState, never before: setupCombat calls the reset LATER in its
    # own body, and the reset clears G.exit. Placing it earlier put the way out on
    # the board and then wiped it one line later -- measured, 0 tiles walked and a
    # null exit in every fight. The same class of bug as V151's damage faces.
    old = """  resetFightState();   /* V107: the ONE reset. Everything that used to be"""
    new = """  resetFightState(); placeWayOut();   /* V159: every fight has somewhere to be, placed AFTER the reset that clears it */
  /* V107: the ONE reset. Everything that used to be"""
    js = subN(js, old, new)

    old = """  G.ammo={}; G.spare=START_SPARE; G.drops=[];"""
    new = """  G.ammo={}; G.spare=START_SPARE; G.drops=[];
  G.exit=null; G._wonByExit=false;   /* V159: a way out never leaks into the next fight */"""
    js = subN(js, old, new)

    # ---- 6. he can see where he is going -------------------------------
    old = """  if(!aimo&&Array.isArray(G.drops))for(const _d of G.drops){"""
    new = """  if(!aimo&&G.exit){   /* V159 THE WAY OUT: V137's hold marker, which was the grenade marker. Same fieldPos, same pulsing disc, same dashed ring, same label. Blue because it is the one place on this board that is FOR him. */
    const xp=fieldPos(G.exit,W,H,cx,cy), rr5=ring*1.35, pu5=0.5+0.5*Math.sin(performance.now()*0.004);
    x.save(); x.fillStyle='rgba(106,168,232,'+(0.10+pu5*0.10).toFixed(3)+')';
    x.beginPath(); x.arc(xp[0],xp[1],rr5*0.72,0,7); x.fill();
    x.strokeStyle='rgba(106,168,232,'+(0.45+pu5*0.35).toFixed(3)+')'; x.lineWidth=3; x.setLineDash([7,5]);
    x.beginPath(); x.arc(xp[0],xp[1],rr5*(0.66+pu5*0.16),0,7); x.stroke(); x.setLineDash([]);
    x.fillStyle='#cfe3ff'; x.font='bold '+Math.round(ring*0.38)+'px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle'; x.fillText('OUT',xp[0],xp[1]);
    x.textAlign='left'; x.textBaseline='alphabetic'; x.restore(); }
  if(!aimo&&Array.isArray(G.drops))for(const _d of G.drops){"""
    js = subN(js, old, new)

    # and how far it is, on the readout that already carries the trade
    old = """  if(!AMMO_ON){ el.textContent=''; return; }   /* V159: no counter for a gun that does not run dry */"""
    new = """  if(!AMMO_ON){   /* V159: the counter is gone, and the distance to the way out takes its place -- a goal he cannot see is a goal he cannot walk to */
    if(EXIT_ON&&G.exit&&!G.over){ el.textContent='WAY OUT '+Math.round(G.exit.edist)+'T'; el.style.color=(G.exit.edist<=6)?'#8fe89a':'#6aa8e8'; }
    else el.textContent='';
    return; }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v159: the way out, and the ammo goes quiet -- %d chars' % len(js))


if __name__ == '__main__':
    main()
