#!/usr/bin/env python3
"""
V193 THE GROUND IS A DECISION AND IT WAS INVISIBLE -- his 8/25 note number three,
and the measurement says he is right for the opposite of the obvious reason.

  PAOLO 8/25: "I just keep testing out this street with BULLSHIT PILLARS and
  BULLSHIT STAIRS that I could climb, and THERE DOESN'T FEEL LIKE THERE'S ANY
  STRATEGIC REASON to do so. This combat has a long way to go."

*** MEASURED BEFORE TOUCHING ANYTHING, 40 FIGHTS, MID-FIGHT, ON THE SHIPPED
PREDICATES: THE GROUND PAYS ENORMOUSLY AND NOTHING ON THE SCREEN SAYS SO. ***

  guns that can reach you where you stand        1.38
  the best tile within three steps                0.00
  the worst tile within three steps               2.10
  fights where a strictly better tile exists     30 of 40
  fights where every tile is identical            3 of 40

In THREE FIGHTS IN FOUR there is a place within three steps that takes EVERY GUN
off you, and the only way to find it in this build is to walk there and see what
happens. He walked in circles for many turns, said "it felt decent", and could
not see that two steps left was zero incoming. THE DECISION WAS ALWAYS THERE. IT
WAS NEVER ON THE SCREEN.

That is RF4-48 stated as a pass/fail: "if a mechanic can only be understood from
a menu, the recreation has failed on RF4's own terms." This one could not even be
understood from a menu -- it took a script.

AND THE FIRST CUT OF THE PROBE SAID THE OPPOSITE. At the bell it read 0.28 guns
on you and a better tile in 9 of 40, which would have "proved" the ground is safe
and the complaint imaginary. V140 and V145 deliberately spawn every man outside
your reach, so TURN ONE MEASURES A DESIGN DECISION, NOT A FIGHT. Ten turns of the
shipped AI walking in, and the number inverted. A measurement taken before the
thing being measured has started is not a measurement.

-------------------------------------------------------------------------
WHAT SHIPS: THE READ
-------------------------------------------------------------------------
The tiles you can reach this turn are scored by the SAME geometry the fight runs
on, and the ones that are STRICTLY BETTER than standing still are painted on the
floor. The best one is named.

  * ONLY BETTER TILES ARE PAINTED. Not a danger heat map over the whole lot --
    the answer, never the noise. If nowhere is better, NOTHING is drawn, and that
    is information too: you are already standing in the best place there is.
  * NOTHING IS PAINTED WHEN NOTHING IS ON YOU. Zero guns on you is not a
    decision, and a board that lights up every turn is furniture. He has asked
    five times for things to come OFF this screen.
  * IT IS THE SAME GEOMETRY, NOT A SECOND OPINION. gunsOnTile is
    coverPillarAgainst + posExposed with the origin moved, so the paint can never
    disagree with the fight -- the same discipline V179 used when its rings were
    made to read seesMe() rather than a second guess at it.
  * ON THE FIELD, NOT IN A HUD. The count is drawn on the tile. No new row, no
    new button, no new line of chrome.

-------------------------------------------------------------------------
AND THE GROUND STOPS LYING ABOUT AMMO -- his note number one, root cause found
-------------------------------------------------------------------------
  PAOLO 8/25: "I'm kinda confused about what ammo does."

*** BECAUSE THE GAME HAS BEEN LABELLING EVERY CORPSE "AMMO" WITH AMMO SWITCHED
OFF SINCE 8/16. *** AMMO_ON is false on his own second rejection (V159), and the
floor marker that V157 wrote for loose rounds draws the literal word AMMO. V181
then put EXPERIENCE on every body, V184 put PLATES there, V190 put BOSS KEYS
there -- all through the same G.drops array, all still labelled AMMO.

So the thing he walked over said AMMO, contained experience, and belonged to a
system that does nothing. He was not confused about ammo. He was reading a label
that was three features out of date. It says what is actually on the tile now.

NO DAMAGE BEFORE THE DIAL: draws pixels and renames a label. Not one damage,
accuracy, hp, armour, range or resource number changes, and no rule about who can
shoot whom is touched -- THE READ only reports what the existing rules already
say.

REUSE CHECK: cooks no graphic pixels and opens no bank. The tile mark is the
board's own cell geometry; the scoring is the shipped cover test with a moved
origin; the label sits in the marker V157 already draws.

TASTE CHECK: no new HUD, no new button, no new row, and it is silent whenever
there is no decision to make.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V193 THE GROUND IS A DECISION'


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
        print('v193: already applied')
        return

    # ---- 1. THE SCORING, WHICH IS THE FIGHT'S OWN GEOMETRY WITH A MOVED ORIGIN ----
    d = sub(d,
        "function myCoverAgainst(ang,dist,lvl){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */",
        """/* ===== V193 THE GROUND IS A DECISION AND IT WAS INVISIBLE ============
   Paolo 8/25: "I just keep testing out this street with BULLSHIT PILLARS and
   BULLSHIT STAIRS that I could climb, and THERE DOESN'T FEEL LIKE THERE'S ANY
   STRATEGIC REASON to do so."
   *** MEASURED BEFORE TOUCHING ANYTHING, 40 FIGHTS, MID-FIGHT: THE GROUND PAYS
   ENORMOUSLY AND NOTHING ON THE SCREEN SAYS SO. *** Guns that can reach you
   where you stand 1.38; the best tile within three steps 0.00; the worst 2.10; a
   strictly better tile exists in 30 of 40 fights and every tile is identical in
   3. In three fights in four there is a place within three steps that takes
   EVERY GUN off you, and the only way to find it in this build was to walk there
   and see what happened.
   THE DECISION WAS ALWAYS THERE. IT WAS NEVER ON THE SCREEN. RF4-48 states that
   as pass/fail -- "if a mechanic can only be understood from a menu, the
   recreation has failed" -- and this one could not be understood from a menu, it
   took a script.
   *** AND THE PROBE SAID THE OPPOSITE ON ITS FIRST RUN. *** At the bell it read
   0.28 guns on you and would have "proved" the complaint imaginary. V140 and
   V145 deliberately spawn every man outside your reach, so TURN ONE MEASURES A
   DESIGN DECISION AND NOT A FIGHT. A measurement taken before the thing being
   measured has started is not a measurement.
   THIS IS THE SAME GEOMETRY, NOT A SECOND OPINION: coverPillarAgainst and
   posExposed with the origin moved to the tile, so the paint can never disagree
   with the fight -- the discipline V179 used when it made its rings read
   seesMe() rather than guess at it a second time. */
const GROUND_READ=true;   /* [DIAL] V193: paint the tiles that are better than standing still */
const READ_STEPS=2;       /* [DIAL] how far ahead it looks -- a step and a sprint */
function gunsOnTile(dx,dy){
  let n=0;
  for(const e of (G.e||[])){
    if(!e||e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    try{ if(pinned(e))continue; }catch(_x){}
    if((e.stun||0)>0)continue;
    const ex=Math.cos(e.ea)*e.edist-dx, ey=Math.sin(e.ea)*e.edist-dy;
    const dd=Math.hypot(ex,ey);
    if(dd>maxRange(foeRange(e)))continue;          /* out of HIS reach from there */
    /* A FLOOR BETWEEN YOU IS NOT A WALL BETWEEN YOU (V90), and the shipped
       predicate says so by returning null -- so a man on the deck counts from
       every tile on the ground, exactly as he does today. */
    if((e.lvl|0)!==myLvl()){ n++; continue; }
    const aa=Math.atan2(ey,ex);
    let cov=false;
    for(const P of (G.pillars||[])){
      if(P.hard===false)continue;                  /* glass is not cover */
      const px=Math.cos(P.ea)*P.edist-dx, py=Math.sin(P.ea)*P.edist-dy;
      const pd=Math.hypot(px,py);
      if(pd>dd||pd<0.8)continue;
      const pa=Math.atan2(py,px);
      const dA=Math.abs(((aa-pa+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(dA<Math.PI/2 && Math.sin(dA)*pd<P.r*0.9){ cov=true; break; } }
    if(!cov)n++; }
  return n; }
/* WHAT IS BETTER THAN HERE, computed ONCE per board state. The key carries every
   input that can change the answer -- where the world is, whose turn it is, how
   many men are up and how much stone is left -- because a read that is stale is
   worse than no read at all, and because recomputing 24 tiles against 60 rocks
   every frame is the performance complaint in his own dispatch (item 7). */
function readGround(){
  if(!GROUND_READ)return null;
  const key=[Math.round(G.worldOff?G.worldOff.x*100:0),Math.round(G.worldOff?G.worldOff.y*100:0),
             G.mTurn|0,myLvl(),(G.e||[]).filter(e=>e&&!e.dead).length,
             (G.pillars||[]).length,G.dayPhase||''].join(',');
  if(G._readKey===key)return G._readOut;
  const here=gunsOnTile(0,0);
  const out={here:here,best:here,tiles:[],all:[],bestTile:null};
  /* NOTHING IS A DECISION WHEN NOTHING IS ON YOU. A board that lights up every
     turn is furniture, and he has asked five times for things to come OFF this
     screen. */
  if(here>0){
    for(let dx=-READ_STEPS;dx<=READ_STEPS;dx++)for(let dy=-READ_STEPS;dy<=READ_STEPS;dy++){
      if(!dx&&!dy)continue;
      if(Math.hypot(dx,dy)<0.9)continue;
      /* never offer a tile that is inside a rock or under somebody */
      let blocked=false;
      for(const P of (G.pillars||[])){ const q=pXY(P);
        if(Math.abs(q[0]-dx)<0.7&&Math.abs(q[1]-dy)<0.7){ blocked=true; break; } }
      if(!blocked)for(const o of (G.e||[])){ if(!o||o.dead)continue; if((o.lvl|0)!==myLvl())continue;
        const q=pXY(o); if(Math.abs(q[0]-dx)<0.7&&Math.abs(q[1]-dy)<0.7){ blocked=true; break; } }
      if(blocked)continue;
      const n=gunsOnTile(dx,dy);
      if(n<here){ out.all.push({dx:dx,dy:dy,n:n}); if(n<out.best)out.best=n; } }
  /* *** ONLY THE BEST GROUND IS PAINTED, AND THE FIRST CUT PAINTED EVERY TILE
     THAT WAS MERELY BETTER. *** Measured on the real canvas: 19 of 24 tiles lit
     at once, which is not an answer, it is a board with the lights on -- and
     nineteen tiles moved FIFTEEN PIXELS, because to keep that many marks from
     shouting they had to be drawn so faintly they were not really drawn. That is
     V129's finding exactly: a thing painted under the threshold of visibility has
     not been painted.
     THE EQUAL-BEST SET IS THE ANSWER. It is usually a handful of tiles, it points
     in a DIRECTION rather than naming one square, and it can be drawn loudly
     enough to see because there are few enough of them to be worth seeing. */
    out.tiles=out.all.filter(t=>t.n===out.best);
    for(const t of out.tiles){
      if(!out.bestTile||Math.hypot(t.dx,t.dy)<Math.hypot(out.bestTile.dx,out.bestTile.dy))
        out.bestTile=t; } }
  G._readKey=key; G._readOut=out;
  return out; }
function myCoverAgainst(ang,dist,lvl){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */""",
        what='the scoring')

    # ---- 2. PAINTED ON THE FLOOR, UNDER EVERYTHING ----
    d = sub(d,
        "  if(!aimo&&Array.isArray(G.drops))for(const _d of G.drops){",
        """  /* ===== V193 THE READ, PAINTED ON THE FLOOR =========================
     ONLY THE ANSWER, NEVER THE NOISE: the tiles that are strictly better than
     standing still, and nothing at all when nowhere is. A danger heat map over
     the whole lot would be the stat sheet RF4-48 forbids, drawn in colour.
     A PALE BLUE, and the choice is deliberate: green is the peek wash and the
     pickup marker, red is firing and the held bead, amber is the melee
     telegraph, bone is V179's eyes, and PURPLE IS RESERVED FOR THE AMALGAMATION.
     The way out is the only other blue in this fight and it is the same idea in
     a bigger font -- GO HERE -- so the association is right rather than a
     collision. */
  if(!aimo&&GROUND_READ&&G.phase==='cover'&&!G.over&&!G.inc){
    let _rd=null; try{ _rd=readGround(); }catch(_x){}
    if(_rd&&_rd.tiles.length){
      const _pu=0.5+0.5*Math.sin(performance.now()*0.004);
      x.save();
      for(const _t of _rd.tiles){
        const _p=fieldPos({ea:Math.atan2(_t.dy,_t.dx),edist:Math.hypot(_t.dx,_t.dy)},W,H,cx,cy);
        const _bst=(_rd.bestTile&&_t.dx===_rd.bestTile.dx&&_t.dy===_rd.bestTile.dy);
        const _s=ring*0.40;
        x.beginPath();
        x.moveTo(_p[0],_p[1]-_s*0.62); x.lineTo(_p[0]+_s,_p[1]);
        x.lineTo(_p[0],_p[1]+_s*0.62); x.lineTo(_p[0]-_s,_p[1]); x.closePath();
        /* LOUD ENOUGH TO EXIST. The first cut used 0.075 fill on the ordinary
           tiles and moved fifteen pixels on the real canvas -- painted, and
           invisible, which is the same thing V129 found when the stamina fluid
           was drawn behind an opaque portrait. */
        x.fillStyle=_bst?('rgba(120,170,232,'+(0.22+_pu*0.16).toFixed(3)+')')
                        :'rgba(120,170,232,0.15)';
        x.fill();
        x.strokeStyle=_bst?('rgba(170,212,255,'+(0.70+_pu*0.25).toFixed(3)+')')
                          :'rgba(150,195,245,0.50)';
        x.lineWidth=_bst?2.5:1.5; x.stroke(); }
      /* AND THE BEST ONE SAYS WHAT IT IS WORTH, ON THE FIELD (RF4-48) rather
         than in one more line of chrome. */
      if(_rd.bestTile){
        const _p=fieldPos({ea:Math.atan2(_rd.bestTile.dy,_rd.bestTile.dx),
                           edist:Math.hypot(_rd.bestTile.dx,_rd.bestTile.dy)},W,H,cx,cy);
        x.fillStyle='#dbe9ff'; x.font='bold '+Math.round(ring*0.30)+'px Space Grotesk,sans-serif';
        x.textAlign='center'; x.textBaseline='middle';
        x.fillText(_rd.bestTile.n===0?'CLEAR':('\\u2212'+(_rd.here-_rd.bestTile.n)),_p[0],_p[1]);
        x.textAlign='left'; x.textBaseline='alphabetic'; }
      x.restore(); } }
  if(!aimo&&Array.isArray(G.drops))for(const _d of G.drops){""",
        what='the read painted')

    # ---- 3. AND THE GROUND STOPS LYING ABOUT AMMO ----
    d = sub(d,
        "    x.fillStyle='#dcffe6'; x.font='bold '+Math.round(ring*0.34)+'px Space Grotesk,sans-serif';\n    x.textAlign='center'; x.textBaseline='middle'; x.fillText('AMMO',dp[0],dp[1]);",
        """    /* ===== V193 THE GROUND STOPS LYING ABOUT AMMO ===================
       Paolo 8/25: "I'm kinda confused about what ammo does."
       *** BECAUSE THIS MARKER HAS BEEN LABELLING EVERY CORPSE "AMMO" WITH AMMO
       SWITCHED OFF SINCE 8/16. *** AMMO_ON went false on his own SECOND
       rejection (V159) and this label, written by V157 for loose rounds, never
       moved. V181 then put EXPERIENCE on every body, V184 put PLATES there and
       V190 put BOSS KEYS there -- all through this same G.drops array, all still
       reading AMMO. The thing he walked over said AMMO, held experience, and
       belonged to a system that does nothing.
       HE WAS NOT CONFUSED ABOUT AMMO. He was reading a label three features out
       of date. A KEY outranks everything else on the tile because it is the only
       thing on this board you cannot get anywhere else. */
    const _lab=_d.key?'KEY':(_d.plate?'PLATE':((_d.xp||_d.loot)?'TAKE':(_d.n?'AMMO':'')));
    x.fillStyle='#dcffe6'; x.font='bold '+Math.round(ring*0.34)+'px Space Grotesk,sans-serif';
    x.textAlign='center'; x.textBaseline='middle'; if(_lab)x.fillText(_lab,dp[0],dp[1]);""",
        what='the label stops lying')

    # ---- 4. AND HE CAN TURN IT OFF (8/12) ----
    d = sub(d,
        '      <button id="bossforget" class="cbtn" style="border-color:#8a5c3a;color:#c8a23a">GIVE IT ALL BACK</button>',
        """      <button id="bossforget" class="cbtn" style="border-color:#8a5c3a;color:#c8a23a">GIVE IT ALL BACK</button>
      <button id="readbtn" class="cbtn" style="border-color:#5a7ba8;color:#a8c8e8">THE READ: ON</button>""",
        what='the read toggle')

    d = sub(d,
        "    const fb=D('bossforget');",
        """    /* V193: WHERE HE TURNS IT OFF (8/12). A read he cannot silence is a read
       that has been decided for him, and this one paints on his board. */
    const rb=D('readbtn');
    if(rb)rb.addEventListener('click',()=>{ G.readOff=!G.readOff;
      rb.textContent='THE READ: '+(G.readOff?'OFF':'ON');
      rb.style.borderColor=G.readOff?'#4a443a':'#5a7ba8';
      rb.style.color=G.readOff?'#6a6458':'#a8c8e8';
      try{ G._readKey=null; renderBoard(); }catch(_e){} });
    const fb=D('bossforget');""",
        what='the read toggle wiring')

    d = sub(d,
        "function readGround(){\n  if(!GROUND_READ)return null;",
        "function readGround(){\n  if(!GROUND_READ||G.readOff)return null;",
        what='the toggle reaches the read')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v193: the ground is a decision -- %d chars' % len(d))


if __name__ == '__main__':
    main()
