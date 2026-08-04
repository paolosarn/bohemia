#!/usr/bin/env python3
"""V125 THE ROUND GOES SOMEWHERE, AND YOU SEE WHERE.

Paolo 8/3, after the research: "Do the missed bullet and impact effect".

--------------------------------------------------------------------------
WHAT WAS ACTUALLY WRONG, MEASURED
--------------------------------------------------------------------------
42 juice items, 37 switched on, and ZERO of them fire when YOU miss. All four
freeze call sites in the fight are damage events (you take a hit, the round that
kills you, your death, your kill). freeze calls on a miss: 0.
And the miss branch, verbatim:

    G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;
    if(navigator.vibrate)navigator.vibrate(8);
    setRead('MISS','turn ends','#e8593a');

A sound, a grey word, an 8ms buzz. THE ROUND ITSELF NEVER EXISTED. Not a weak
effect -- no bullet was ever created. Meanwhile JUICE.D has drawn THEIR misses
whipping visibly past your body since v24, with tracers and dust, because we
built the incoming side and never the outgoing side.

--------------------------------------------------------------------------
THE IDEA: THE DIAL ALREADY KNOWS WHERE THE ROUND SHOULD GO
--------------------------------------------------------------------------
JUICE.I already computes your release error -- G.angle over G._angVel, in
milliseconds early or late -- and PRINTS IT AS TEXT over the target's head.
A number. Degrees mean nothing to a player and neither does "37ms EARLY".

SO PUT THE NUMBER IN THE WORLD INSTEAD OF ON TOP OF IT. The signed angular
error becomes a LATERAL OFFSET at the target: pull early and the round goes
wide one way, late and it goes wide the other, and the size of the miss is the
size of your error. You stop reading that you were early and start SEEING that
you pulled left.

AND IT SCALES WITH RANGE, WHICH IS FREE PHYSICS AND A FREE LESSON. The same
wrist error throws a round further off the further out the target is, so the
offset is multiplied by distance. A sloppy release at point blank still hits
near him; the same release at twenty tiles sails. That teaches the range trade
he already ruled on (7/27) without a single word of UI.

--------------------------------------------------------------------------
AND IT HITS SOMETHING, BECAUSE EVERYTHING IS SOMEWHERE
--------------------------------------------------------------------------
The landing cell is checked against the world that already exists:
    A CAR      -> sparks off metal, a bright hard flash, no dust
    A PILLAR   -> stone chips, a dull puff, grit
    OPEN DIRT  -> a dust kick, the Mojave answer
That is not three new effects; it is the existing 'dust' particle plus a spark
colour, chosen by asking G.pillars what is standing there -- the same question
cover, the vault, the dash path and the AI all already ask.

--------------------------------------------------------------------------
WHAT IT DELIBERATELY DOES NOT DO
--------------------------------------------------------------------------
* NO DAMAGE. A missed round does nothing to anybody, including whoever it flies
  toward. NO DAMAGE BEFORE THE DIAL, and a miss is a miss.
* NO ACCURACY CHANGE. Where the round lands is a RENDER of the error the dial
  already computed. It cannot make you miss more or less, and the hit/miss
  decision is untouched above it.
* NO NEW FREEZE TIER. The research proposed a ~62ms miss stop as a separate
  item; he asked for the bullet and the impact, so that is not in here.
* NO PERMANENCE / DECALS. Pockmarks that survive the fight were proposal 4 and
  he did not ask for them.

REUSE CHECK: cooks NO graphic pixels. The tracer is the SAME two-point stroke
the incoming 'crack' has drawn since v24, and the impact reuses the existing
'dust' particle type and its renderer. The only new colour is the metal spark,
built from the file's own warm ramp (255,240,190 -- the ric spark's own colour,
lifted verbatim from fxDrawField). No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste question it answers is the honesty one:
FEEDBACK IS A THING THAT HAPPENS IN THE WORLD, NOT A LABEL ON TOP OF IT. The
grey word MISS is a scoreboard, and scoreboards do not feel like anything. This
adds no HUD, no number, no bar -- it puts the consequence where the fight is.
The impact reads in the palette the field already uses (the dust brown
168,148,116 and the ric spark's warm white), so a missed round looks like it
belongs to the same desert as everything else.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V125 THE ROUND GOES SOMEWHERE'


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
        print('v125 already in; nothing to do')
        return

    # ---- 1. THE SHOT, AND WHERE IT LANDS ---------------------------------
    old = """function fxDrawField(x,cx,cy){ for(const p of G._fx){"""
    new = """/* ===== V125 THE ROUND GOES SOMEWHERE, AND YOU SEE WHERE ===========
   MEASURED: 42 juice items, 37 on, ZERO firing on YOUR miss. All four freeze
   call sites are damage events. And the miss branch made a sound, a grey word
   and an 8ms buzz -- THE ROUND ITSELF NEVER EXISTED. Not a weak effect: no
   bullet was ever created. Meanwhile JUICE.D has drawn THEIR misses whipping
   past your body since v24, because we built the incoming side and never the
   outgoing one.
   THE DIAL ALREADY KNOWS WHERE IT SHOULD GO. JUICE.I computes the release
   error (G.angle over G._angVel) and prints it as "37ms EARLY" over his head.
   A number. Degrees mean nothing to a player and neither does that.
   SO THE NUMBER GOES IN THE WORLD INSTEAD OF ON TOP OF IT: the SIGNED error
   becomes a lateral offset at the target, and it SCALES WITH RANGE, which is
   free physics and a free lesson -- the same wrist error throws a round
   further off the further out he is. A sloppy release point blank still lands
   near him; the same release at twenty tiles sails. That teaches his own 7/27
   range trade without a word of UI.
   NO DAMAGE, NO ACCURACY CHANGE. This RENDERS an error the dial already
   decided. The hit/miss branch above it is untouched. */
/* THE CONSTANTS ARE SIZED FROM THE REAL INPUT RANGE, NOT GUESSED. G.angle is
   clamped to +/-LIM and LIM is Math.PI/3, so the release error spans about
   +/-1.05. My first cut used 0.85 and every shot in the game piled onto the
   0.55 floor -- small error and huge error landed in the same place, which is
   the same mistake as the difficulty multipliers, caught the same way: by
   printing the numbers before shipping them.
       a hair off (0.15)  -> ~0.5 tiles wide at 8 tiles out
       sloppy    (0.50)   -> ~1.8
       wild      (1.00)   -> clamped, it sails */
const MISS_LAT=2.4;       /* tiles of sideways miss per unit of dial error [DIAL] */
const MISS_RANGE_K=0.06;  /* ...and how much further out multiplies it     [DIAL] */
const MISS_MAX=4.0;       /* the widest a round can miss by, in tiles      [DIAL] */
const MISS_FLY_MS=170;    /* the round's travel, ~a third of a beat        [DIAL] */
function missLandPoint(tgt){
  /* the signed release error. G.angle is the offset from the kill line and
     G._angVel is which way the needle was moving, so their product is the
     side you pulled to -- exactly what JUICE.I already reads for EARLY/LATE. */
  const err=(G.angle||0), vel=(G._angVel||1);
  const side=(err*vel)<0?-1:1;
  const mag=Math.min(MISS_MAX,Math.abs(err)*MISS_LAT*(1+(tgt.edist||6)*MISS_RANGE_K));
  const lat=side*Math.max(0.35,mag);           /* never a zero-width miss */
  /* perpendicular to the line to him, in world tiles */
  const ux=Math.cos(tgt.ea), uy=Math.sin(tgt.ea);
  const tx=ux*tgt.edist, ty=uy*tgt.edist;
  return [tx-uy*lat, ty+ux*lat]; }
/* WHAT IS STANDING THERE DECIDES WHAT THE ROUND DOES. Same question cover, the
   vault, the dash path and the AI all already ask of G.pillars. */
function missSurfaceAt(wx,wy){
  for(const P of (G.pillars||[])){ const q=pXY(P);
    if(Math.hypot(q[0]-wx,q[1]-wy)<(P.r||0.55)*0.6+0.5) return P.car?'metal':'stone'; }
  return 'dirt'; }
/* THE IMPACT LIVES IN THE TICK, NOT THE DRAW, AND THAT WAS A REAL BUG. My
   first cut spawned it from fxDrawField when the tracer reached the end --
   but fxTick culls with `p.t<p.life`, so the round could be deleted before any
   draw ever saw it finish. Measured: the round spawned and the impact fired
   ZERO particles. Logic in the tick, drawing in the draw. */
function missImpact(p){
  const F=G._field; if(!F)return;
  const ex=F.cx+p.wx*F.ring, ey=F.cy+p.wy*F.ring;
  if(p.surf==='metal'){
    for(let k=0;k<5;k++)G._fx.push({type:'dust',spark:1,x:ex,y:ey,
      vx:(Math.random()-0.5)*70,vy:-24-Math.random()*34,t:0,life:0.26+Math.random()*0.16});
  } else if(p.surf==='stone'){
    for(let k=0;k<5;k++)G._fx.push({type:'dust',x:ex+(Math.random()-0.5)*5,y:ey,
      vx:(Math.random()-0.5)*34,vy:-16-Math.random()*20,t:0,life:0.5+Math.random()*0.3});
  } else {
    for(let k=0;k<6;k++)G._fx.push({type:'dust',x:ex+(Math.random()-0.5)*7,y:ey+2,
      vx:(Math.random()-0.5)*20,vy:-9-Math.random()*12,t:0,life:0.7+Math.random()*0.35});
  }
  try{ sndMissImpact(p.surf); }catch(_e){} }
function fireMissRound(tgt){
  if(!tgt)return;
  const lp=missLandPoint(tgt);
  G._fx.push({type:'missrd', wx:lp[0], wy:lp[1], surf:missSurfaceAt(lp[0],lp[1]),
    t:0, life:MISS_FLY_MS/1000, _hit:false}); }
function fxDrawField(x,cx,cy){
  /* THE ROUND IN FLIGHT, then the impact. Drawn first so the bodies and the
     structures sit on top of it -- a round travels through the scene, it is
     not a sticker over the front of it. */
  for(const p of G._fx){ if(p.type!=='missrd'||p.t<0)continue;
    const F=G._field; if(!F)continue;
    const ring=F.ring, q=Math.min(1,p.t/p.life);
    const ex=cx+p.wx*ring, ey=cy+p.wy*ring;
    if(q<1){ /* the tracer: the same two-point stroke the incoming crack uses */
      const bx=cx+(ex-cx)*q, by=cy+(ey-cy)*q;
      const tail=0.16;
      const sx=cx+(ex-cx)*Math.max(0,q-tail), sy=cy+(ey-cy)*Math.max(0,q-tail);
      x.strokeStyle='rgba(255,238,200,'+(0.55*(1-q*0.6)).toFixed(3)+')'; x.lineWidth=1.6;
      x.beginPath(); x.moveTo(sx,sy); x.lineTo(bx,by); x.stroke(); }
  }
  for(const p of G._fx){"""
    s = subN(s, old, new)

    # ---- 1b. THE IMPACT FIRES FROM THE TICK, NOT THE DRAW ---------------
    old = """  G._fx=G._fx.filter(p=>p.t<p.life); }"""
    new = """  /* V125: a finished round detonates HERE, before the cull below can delete
     it. Spawning the impact from the draw meant fxTick could remove the round
     before any frame saw it end -- measured as a round that flew and produced
     zero impact particles. */
  for(const p of G._fx){ if(p.type==='missrd'&&!p._hit&&p.t>=p.life){ p._hit=true;
    try{ missImpact(p); }catch(_e){} } }
  G._fx=G._fx.filter(p=>p.t<p.life); }"""
    s = subN(s, old, new)

    # ---- 2. the spark is a dust particle with a different colour ---------
    old = """  for(const p of G._fx){ if(p.type!=='dust'||p.t<0||p.ks)continue;
    const q2=p.t/p.life;
    x.fillStyle='rgba(168,148,116,'+(0.38*(1-q2))+')';   /* Paolo 7/3/26: was too hard to see */
    const ds=q2<0.4?3:2;
    x.fillRect(p.x+p.vx*p.t, p.y+p.vy*p.t+14*p.t*p.t, ds, ds); } }"""
    new = """  for(const p of G._fx){ if(p.type!=='dust'||p.t<0||p.ks)continue;
    const q2=p.t/p.life;
    /* V125: a spark off metal is the same particle with the ric spark's own
       warm white and a faster fall -- no new effect, no new colour invented. */
    x.fillStyle=p.spark
      ? 'rgba(255,240,190,'+(0.85*(1-q2)).toFixed(3)+')'
      : 'rgba(168,148,116,'+(0.38*(1-q2))+')';   /* Paolo 7/3/26: was too hard to see */
    const ds=p.spark?(q2<0.5?2:1):(q2<0.4?3:2);
    x.fillRect(p.x+p.vx*p.t, p.y+p.vy*p.t+(p.spark?40:14)*p.t*p.t, ds, ds); } }"""
    s = subN(s, old, new)

    # ---- 3. the sound the surface makes ---------------------------------
    old = """function sndMiss(){ if(!AC)return;"""
    new = """/* V125: the surface answers in sound too, built from the same oscillator
   grammar every other cue in this file uses. Metal rings, stone knocks, dirt
   thuds. Nothing sampled, nothing new imported. */
function sndMissImpact(surf){ if(!AC)return;
  const o=AC.createOscillator(), g=AC.createGain();
  const t0=AC.currentTime;
  if(surf==='metal'){ o.type='square';
    o.frequency.setValueAtTime(1650,t0); o.frequency.exponentialRampToValueAtTime(520,t0+0.13);
    g.gain.setValueAtTime(0.045,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+0.15); }
  else if(surf==='stone'){ o.type='triangle';
    o.frequency.setValueAtTime(420,t0); o.frequency.exponentialRampToValueAtTime(150,t0+0.09);
    g.gain.setValueAtTime(0.05,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+0.11); }
  else { o.type='sine';
    o.frequency.setValueAtTime(190,t0); o.frequency.exponentialRampToValueAtTime(72,t0+0.10);
    g.gain.setValueAtTime(0.055,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+0.12); }
  o.connect(g); g.connect(MAST); o.start(); o.stop(t0+0.18); }
function sndMiss(){ if(!AC)return;"""
    s = subN(s, old, new)

    # ---- 4. fire it on the miss ------------------------------------------
    old = """  // MISS -> turn ends, return fire (V26 GRIT: the floor perk buys the shot back)
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;"""
    new = """  // MISS -> turn ends, return fire (V26 GRIT: the floor perk buys the shot back)
  /* V125: THE ROUND GOES SOMEWHERE. Before this line existed a missed shot
     produced no bullet in the world at all -- the single biggest hole in the
     juice, measured. It renders the error the dial already computed; it
     changes no odds and does no damage. */
  try{ fireMissRound(tgt); }catch(_e){}
  G.killStreak=0; sndMiss(); showVerd('MISS','#777'); flash=1;"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v125: the missed round flies and hits something (%d chars)' % len(s))


if __name__ == '__main__':
    main()
