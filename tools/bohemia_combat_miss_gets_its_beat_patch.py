#!/usr/bin/env python3
"""V126 THE MISS GETS ITS BEAT, AND YOU CAN ACTUALLY SEE IT.

Paolo 8/4: "I didn't notice them either make it more noticeable or you didn't
deploy it."

IT WAS DEPLOYED. v125 is on main and the Pages build for it concluded success.
He did not see it, and BOTH reasons are mine.

--------------------------------------------------------------------------
REASON 1, THE REAL ONE: THE CAMERA CUT AWAY AT THE EXACT FRAME IT LANDED
--------------------------------------------------------------------------
    fireNow, the miss branch:   setTimeout(endTurnReturn, 170)
    v125, the round:            MISS_FLY_MS = 170

The return volley starts at 170ms. The round lands at 170ms. And
endTurnReturn -> startIncoming takes the CAMERA and flies it to whoever is
shooting back, zooming in on them.

So the impact particles -- the whole point, 0.5 to 0.7 seconds of dust and
sparks -- played while the camera was somewhere else entirely. He was not
missing a subtle effect. He was watching a different part of the screen,
because the game moved his eye off it at the exact frame it happened.

I built a collision and then asked him whether he noticed it.

THE FIX IS TIME, NOT SIZE. On a miss the world now waits ONE FULL BEAT (500ms,
BPM_MS -- the 120 BPM law, so it lands on the grid like everything else) before
the return volley. The round flies in 120ms, the impact reads, THEN they shoot
back. A hit already ends the turn clean at 170ms and is untouched: only the
miss, which is the moment that had nothing, gets its beat.
AND THAT IS ALSO THE RESEARCH'S OWN PRINCIPLE, arrived at from the other end: a
hit STOPS the world, a miss should be the world NOT WAITING FOR YOU. It waits
exactly long enough for you to watch your round land somewhere it should not
have, and then it punishes you.

--------------------------------------------------------------------------
REASON 2: IT WAS ALSO GENUINELY TOO FAINT
--------------------------------------------------------------------------
A 1.6px line at 0.55 alpha for 170ms, and five 2px particles, on a phone.
Even with the camera fixed that is a whisper. Measured against what the file
already does loudly: the incoming crack strokes at 1.4px but there are EIGHT of
them across your body, and the killshot's dust is 6 particles at close camera.
A single thin line at mid-field is smaller than either.
  * the tracer is 3.4px, brighter, and carries a HEAD -- a bright dot at the
    front, which is the thing the eye actually tracks
  * the impact is roughly double the particles, bigger, and throws a short
    flash at the point of contact so there is a single frame that says HERE
  * the dust lives longer so it is still settling when the volley starts

REUSE CHECK: cooks NO graphic pixels. It changes numbers on the v125 tracer and
reuses the same 'dust' particle type and renderer that v125 already reuses from
the pre-existing FX system. The impact flash is a canvas arc in the file's own
warm white (255,240,190, the ric spark's colour). No bank is opened because no
art is authored.

TASTE CHECK: authors no art. The taste question is the one he just asked in
three words -- IF HE DID NOT SEE IT, IT DID NOT HAPPEN. That is the same law as
VERIFY ON THE REAL SURFACE (7/18) pointed at feedback instead of pixels: an
effect that is technically present and never perceived is not shipped, it is
just committed. Nothing here adds HUD, a number, or a bar; it makes an event
that already existed loud enough and long enough to be seen.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V126 THE MISS GETS ITS BEAT'


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
        print('v126 already in; nothing to do')
        return

    # ---- 1. THE ROUND LANDS BEFORE THE CAMERA LEAVES --------------------
    old = """const MISS_FLY_MS=170;    /* the round's travel, ~a third of a beat        [DIAL] */"""
    new = """const MISS_FLY_MS=120;    /* the round's travel                           [DIAL] */
/* ===== V126 THE MISS GETS ITS BEAT ===============================
   Paolo: "I didn't notice them either make it more noticeable or you didn't
   deploy it." IT WAS DEPLOYED. He did not see it, and the reason is a
   collision I built:
       the miss branch fired endTurnReturn at 170ms
       v125 gave the round a life of exactly 170ms
   The return volley takes the CAMERA and flies it to whoever is shooting back.
   So the impact -- half a second of dust and sparks, the entire point -- played
   while the camera was somewhere else. He was not missing a subtle effect; the
   game moved his eye off it on the exact frame it happened.
   THE FIX IS TIME, NOT SIZE. On a MISS the world waits ONE FULL BEAT before the
   volley, on the 120 grid like everything else. The round flies, the impact
   reads, THEN they answer. A hit still resolves at 170ms and is untouched.
   And it is the research's own principle from the other end: a hit STOPS the
   world; a miss is the world not waiting for you -- it waits exactly long
   enough for you to see where your round went, and then it punishes you. */
const MISS_BEAT_MS=BPM_MS;   /* one beat of held camera after a miss [DIAL] */"""
    s = subN(s, old, new)

    old = """  setRead('MISS','turn ends','#e8593a');
  G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnReturn(); },170);"""
    new = """  setRead('MISS','turn ends','#e8593a');
  /* V126: ONE BEAT before they answer, so the round he just threw away lands
     and reads before the camera flies to the men shooting back at him. */
  G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnReturn(); },MISS_BEAT_MS);"""
    s = subN(s, old, new)

    # ---- 2. THE TRACER YOU CAN ACTUALLY SEE -----------------------------
    old = """    if(q<1){ /* the tracer: the same two-point stroke the incoming crack uses */
      const bx=cx+(ex-cx)*q, by=cy+(ey-cy)*q;
      const tail=0.16;
      const sx=cx+(ex-cx)*Math.max(0,q-tail), sy=cy+(ey-cy)*Math.max(0,q-tail);
      x.strokeStyle='rgba(255,238,200,'+(0.55*(1-q*0.6)).toFixed(3)+')'; x.lineWidth=1.6;
      x.beginPath(); x.moveTo(sx,sy); x.lineTo(bx,by); x.stroke(); }"""
    new = """    if(q<1){ /* V126: 1.6px at 0.55 alpha for 170ms was a whisper on a phone.
        The incoming crack gets away with 1.4px because there are EIGHT of them
        across your body; ONE line at mid-field is smaller than anything else
        the fight draws. Thicker, brighter, and it carries a HEAD -- the bright
        dot at the front is the thing an eye actually tracks. */
      const bx=cx+(ex-cx)*q, by=cy+(ey-cy)*q;
      const tail=0.30;
      const sx=cx+(ex-cx)*Math.max(0,q-tail), sy=cy+(ey-cy)*Math.max(0,q-tail);
      x.save();
      x.strokeStyle='rgba(255,244,214,'+(0.30*(1-q*0.5)).toFixed(3)+')'; x.lineWidth=6.5;
      x.beginPath(); x.moveTo(sx,sy); x.lineTo(bx,by); x.stroke();          /* the soft body */
      x.strokeStyle='rgba(255,250,232,'+(0.92*(1-q*0.35)).toFixed(3)+')'; x.lineWidth=3.4;
      x.beginPath(); x.moveTo(sx,sy); x.lineTo(bx,by); x.stroke();          /* the hot core */
      x.fillStyle='rgba(255,252,240,'+(0.95*(1-q*0.25)).toFixed(3)+')';     /* THE HEAD */
      x.beginPath(); x.arc(bx,by,3.1,0,7); x.fill();
      x.restore(); }"""
    s = subN(s, old, new)

    # ---- 3. AN IMPACT WITH A FRAME THAT SAYS *HERE* ---------------------
    old = """function missImpact(p){
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
  try{ sndMissImpact(p.surf); }catch(_e){} }"""
    new = """function missImpact(p){
  const F=G._field; if(!F)return;
  const ex=F.cx+p.wx*F.ring, ey=F.cy+p.wy*F.ring;
  /* V126 THE FRAME THAT SAYS *HERE*. Particles alone have no single moment --
     they are already spreading by the time the eye arrives. One bright flash at
     contact gives the eye something to land on, and everything after it is the
     aftermath instead of the event. */
  G._fx.push({type:'missflash',x:ex,y:ey,surf:p.surf,t:0,life:0.22});
  if(p.surf==='metal'){
    for(let k=0;k<11;k++)G._fx.push({type:'dust',spark:1,x:ex,y:ey,
      vx:(Math.random()-0.5)*110,vy:-30-Math.random()*52,t:0,life:0.34+Math.random()*0.24});
  } else if(p.surf==='stone'){
    for(let k=0;k<10;k++)G._fx.push({type:'dust',x:ex+(Math.random()-0.5)*6,y:ey,
      vx:(Math.random()-0.5)*52,vy:-22-Math.random()*30,t:0,life:0.66+Math.random()*0.36});
  } else {
    for(let k=0;k<12;k++)G._fx.push({type:'dust',x:ex+(Math.random()-0.5)*9,y:ey+2,
      vx:(Math.random()-0.5)*32,vy:-13-Math.random()*18,t:0,life:0.9+Math.random()*0.45});
  }
  try{ sndMissImpact(p.surf); }catch(_e){} }"""
    s = subN(s, old, new)

    # the flash renderer, next to the round's own draw
    old = """  for(const p of G._fx){ if(p.type!=='dust'||p.t<0||p.ks)continue;
    const q2=p.t/p.life;"""
    new = """  /* V126: the contact flash. A ring that opens and fades, plus a hard core for
     the first frames, in the file's own warm white. */
  for(const p of G._fx){ if(p.type!=='missflash'||p.t<0)continue;
    const q3=Math.min(1,p.t/p.life);
    const r3=4+q3*(p.surf==='metal'?26:19);
    x.save();
    x.strokeStyle='rgba(255,244,210,'+(0.78*(1-q3)).toFixed(3)+')'; x.lineWidth=2.2*(1-q3*0.6);
    x.beginPath(); x.arc(p.x,p.y,r3,0,7); x.stroke();
    if(q3<0.42){ x.fillStyle='rgba(255,252,240,'+(0.85*(1-q3/0.42)).toFixed(3)+')';
      x.beginPath(); x.arc(p.x,p.y,4.2*(1-q3/0.42)+1.6,0,7); x.fill(); }
    x.restore(); }
  for(const p of G._fx){ if(p.type!=='dust'||p.t<0||p.ks)continue;
    const q2=p.t/p.life;"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v126: the miss gets a beat and a flash you can see (%d chars)' % len(s))


if __name__ == '__main__':
    main()
