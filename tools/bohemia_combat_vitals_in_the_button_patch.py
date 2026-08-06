#!/usr/bin/env python3
"""V129 YOUR VITALS LIVE IN THE BUTTON YOUR THUMB IS ALREADY ON.

Paolo T4: "For your personal HP I was thinking of maybe something more awesome
RAW gameplay wise where how you have the portrait at the bottom right maybe for
like each 10% of health that you don't have... I want you to think some sort of
visual of the face and for the stamina points I want you to do research how we
can incorporate that into the action parts as well maybe it's like fluid I know
all of Warcraft sort of things like that if I'm not mistaken, Diablo as well."

Then 8/4: "Think outside the box."

--------------------------------------------------------------------------
THE OUTSIDE-THE-BOX PART: THE BUTTON IS ALREADY A DIABLO GLOBE
--------------------------------------------------------------------------
He asked for two separate things -- a face that shows damage, and stamina as
fluid. The fire button is ALREADY A FACE IN A CIRCLE, 92px, bottom right, under
his thumb, and it is the one thing his eye is locked to at the moment he
shoots. That IS the orb. It has been sitting there the whole time.

So both vitals go in it and NOTHING NEW IS ADDED TO THE SCREEN:
    HP       the face itself takes the damage
    STAMINA  fluid rising in the same circle, behind the face
And the STA pips come OFF the top menu, which is the fifth thing removed from
that row this week and the same complaint every time.

--------------------------------------------------------------------------
THE FINDING THAT EXPLAINS WHY HE ASKED AT ALL
--------------------------------------------------------------------------
    const JUICE={... AU:false ...}

JUICE.AU is LIVING PORTRAIT. It already draws a hurt face. IT HAS BEEN SWITCHED
OFF THE ENTIRE TIME -- the only item in a table of 42 that is off. He has never
once seen it. He was not asking for something new; he was asking for something
that exists and was disabled.
And even switched on it was THREE states (ok / a red wash / the dying sprite),
where he asked for TEN. So: on, and rebuilt to his number.

--------------------------------------------------------------------------
THE RESEARCH: DOOM'S STATUS BAR FACE, AND TWO THINGS IT GIVES US FREE
--------------------------------------------------------------------------
Doom's face is the canonical version of exactly what he described -- it bleeds
and beats up as health falls, and it is one of the earliest expressive-feedback
designs in games precisely because it is a DIRECT CONNECTION to the character
rather than a number.

TWO DETAILS FROM IT THAT HE DID NOT ASK FOR AND THAT COST NOTHING HERE:
1. THE FACE TURNS TOWARD THE ATTACK. Doom tilts the face at whoever hit you.
   Bohemia's field is POLAR -- every enemy is an {ea,edist} bearing -- so the
   direction a round came from is already known exactly. The portrait now leans
   toward the shooter for a beat. It is a free second read of "who is hurting
   me", in the place he is already looking.
2. HYSTERESIS. Doom deliberately makes the face STICK at a state boundary so it
   cannot flicker between two faces while health hovers on the line. With ten
   tiers instead of three that stops being a nicety and becomes required: one
   point of chip damage at a boundary would strobe the button. The tier only
   changes once HP has moved past the edge by a margin.

--------------------------------------------------------------------------
WHAT THE TEN STATES ARE MADE OF, AND WHAT I AM NOT DOING
--------------------------------------------------------------------------
*** I AM NOT PAINTING A FACE. *** Ten hand-drawn injury states of Paolo's own
character is ART, it is his call, and the art lane is frozen. Drawing bruises
onto his portrait would be exactly the violation the RIG and art laws exist to
stop.
What ships is COMPOSITED from what he already approved: his own two portraits
(SPR.portraits.you and .dying, both already in the build) plus progressive
value/saturation damage -- the face darkens, cools and loses colour as it goes,
blood creeps in from the edges, and the dying portrait crossfades in over the
last tiers instead of popping at 40%.
IF HE WANTS TEN REAL PAINTED FACES, that is an ART REQUEST and it should be
built as one. This is the mechanism, sized to his number, using only his pixels.

STAMINA: the fluid fills the circle from the bottom, behind the face, and it
moves -- a slow surface wave so it reads as liquid and not as a progress bar.
That was the whole point of him naming Warcraft and Diablo: an orb is legible at
a glance with zero reading because you judge a LEVEL, not a count.

REUSE CHECK: cooks NO graphic pixels. Every face pixel is his approved portrait
(SPR.portraits.you / .dying); the damage is value and saturation applied over
it, and the fluid is a canvas fill. No bank is opened because no art is
authored, and the one thing that WOULD be authored art -- painted injuries -- is
explicitly refused and handed back to him.

TASTE CHECK: authors no art. The taste answer is the one he keeps asking for in
different words: PUT IT WHERE HE IS ALREADY LOOKING AND TAKE SOMETHING AWAY.
This adds NOTHING to the screen -- it removes the STA pips from the top row and
folds both vitals into a button that was already there. The damage reads in
value first (a face going dark and grey) rather than in colour, which is the
same discipline as the TEXTURE MATCH finding that his own art is rougher, greyer
and less saturated than mine. No purple anywhere near it.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. The portrait sprites are drawn as-is and only
  composited over; not one pixel of the face is redrawn or reshaped.
  built on: the BAKED package + SPR.portraits (his approved faces)
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V129 YOUR VITALS LIVE IN THE BUTTON'


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
        print('v129 already in; nothing to do')
        return

    # ---- 1. LIVING PORTRAIT WAS OFF ------------------------------------
    old = """  AS:true,AT:true,AU:false,AV:true,AW:true};"""
    new = """  AS:true,AT:true,AU:true,AV:true,AW:true};   /* V129: AU (LIVING PORTRAIT) was the ONE item in this table switched off, which is why he asked for a feature that already existed. He has never seen it. */"""
    s = subN(s, old, new)

    # ---- 2. TEN TIERS, HYSTERESIS, AND THE LEAN ------------------------
    old = """function portraitBackdrop(){ return FAC().base; }   /* [tile/indoor-outdoor inputs land with the grid] */"""
    new = """function portraitBackdrop(){ return FAC().base; }   /* [tile/indoor-outdoor inputs land with the grid] */
/* ===== V129 YOUR VITALS LIVE IN THE BUTTON YOUR THUMB IS ALREADY ON =====
   Paolo asked for a face that shows damage per 10% of health, and for stamina
   as fluid "like Warcraft... Diablo as well". THE FIRE BUTTON IS ALREADY A FACE
   IN A CIRCLE, under his thumb, and it is the one thing his eye is locked to at
   the instant he shoots. That IS the orb. So both vitals go in it and NOTHING
   is added to the screen -- the STA pips come OFF the top row instead.
   AND HE WAS ASKING FOR SOMETHING THAT ALREADY EXISTED: JUICE.AU was the only
   one of 42 items switched off, so the living portrait has never once run for
   him. It was also three states where he asked for ten.
   DOOM'S STATUS BAR FACE is the canonical version of this and it gives two
   things free: the face TURNS TOWARD the attack (Bohemia's field is polar, so
   the bearing is already exact), and HYSTERESIS so the state cannot strobe at a
   boundary -- with ten tiers instead of three that stops being a nicety. */
const HP_TIERS=10;              /* his number: one state per 10% [DIAL] */
const HP_HYST=0.035;            /* Doom's stickiness, in fractions of max HP [DIAL] */
function hpTier(){
  const f=Math.max(0,Math.min(1,(G.pHP||0)/(G.pMax||100)));
  const raw=Math.max(0,Math.min(HP_TIERS-1,Math.floor((1-f)*HP_TIERS)));
  const prev=(G._hpTierS==null)?raw:G._hpTierS;
  /* HYSTERESIS DAMPS FLICKER, IT MUST NEVER BLOCK REAL MOVEMENT. My first cut
     applied the margin to ANY change and MEASURED a 3-tier drop being refused
     because it happened to land exactly on a boundary -- the face would have
     frozen at "scratched" while he bled out. So the margin applies ONLY to a
     single-step change, which is the only thing that can strobe; a jump of two
     tiers or more is real damage and always commits. */
  if(raw===prev){ G._hpTierS=raw; }
  else if(Math.abs(raw-prev)>1){ G._hpTierS=raw; }
  else { const edge=1-Math.max(raw,prev)/HP_TIERS;
    if(Math.abs(f-edge)>HP_HYST)G._hpTierS=raw; }
  return (G._hpTierS==null)?raw:G._hpTierS; }
/* THE LEAN. Doom tilts the face at whoever hit you; our field is polar so we
   know the bearing exactly. Set on the hit, decays over a beat. */
function portraitLean(){
  const at=G._hitFromAt||0, dt=performance.now()-at;
  if(dt>BPM_MS)return 0;
  const k=1-dt/BPM_MS;
  return Math.max(-1,Math.min(1,Math.cos(G._hitFromEa||0)))*k; }"""
    s = subN(s, old, new)

    # ---- 3. THE COMPOSITE ----------------------------------------------
    old = """  const fb=D('fire');if(!fb||!SPR.portraits)return false;
  const _hpTier=(G.pHP<G.pMax*0.4)?'d':(G.pHP<G.pMax*0.7)?'h':'ok';
  const key=portraitBackdrop()+'|'+(stateWash||'')+'|'+_hpTier;"""
    new = """  const fb=D('fire');if(!fb||!SPR.portraits)return false;
  const _hpTier=hpTier();
  const _stam=Math.max(0,Math.min(STAM_MAX,G.stam||0));
  const _lean=+portraitLean().toFixed(2);
  const key=portraitBackdrop()+'|'+(stateWash||'')+'|'+_hpTier+'|'+_stam+'|'+_lean;"""
    s = subN(s, old, new)

    old = """  x.fillStyle=portraitBackdrop();x.fillRect(0,0,64,64);
  /* AU. LIVING PORTRAIT: the face in the button IS your state. Under 40%
     HP the dying portrait takes over; 40-70% wears a faint red wash. */
  const _hurt=(JUICE.AU&&G.pHP<G.pMax*0.4&&SPR.portraits.dying)?SPR.portraits.dying:SPR.portraits.you;
  x.imageSmoothingEnabled=false;x.drawImage(_hurt,0,0);
  /* AU v2 (Paolo 7/3/26: v1 never read): tiers hit harder. 40-70% wears a
     real red wash; under 40% the DYING face plus a blood-dark frame. */
  if(JUICE.AU&&G.pHP>=G.pMax*0.4&&G.pHP<G.pMax*0.7){x.fillStyle='rgba(180,30,20,0.26)';x.fillRect(0,0,64,64);}
  if(JUICE.AU&&G.pHP<G.pMax*0.4){x.strokeStyle='rgba(160,20,15,0.9)';x.lineWidth=5;x.strokeRect(0,0,64,64);}"""
    new = """  x.fillStyle=portraitBackdrop();x.fillRect(0,0,64,64);
  x.imageSmoothingEnabled=false;
  /* ===== V129 TEN STATES, HIS NUMBER =============================
     *** NOT PAINTED. *** Ten hand-drawn injury states of his own character is
     ART and it is his call, and drawing bruises onto his portrait is exactly
     what the rig and art laws exist to stop. This is COMPOSITED from the two
     faces he already approved: the healthy one darkens, cools and loses colour
     as it goes, blood creeps in from the edges, and the DYING face crossfades
     in over the last tiers instead of popping at 40%.
     IF HE WANTS TEN REAL PAINTED FACES THAT IS AN ART REQUEST. */
  const _t=_hpTier, _f=_t/(HP_TIERS-1);           /* 0 = untouched, 1 = nearly dead */
  x.save();
  if(_lean)x.setTransform(1,0,0,1,Math.round(_lean*3),0);   /* the Doom lean, toward the shooter */
  x.drawImage(SPR.portraits.you,0,0);
  if(JUICE.AU&&SPR.portraits.dying&&_f>0.45){        /* the dying face fades IN, never pops */
    x.globalAlpha=Math.min(1,(_f-0.45)/0.4); x.drawImage(SPR.portraits.dying,0,0); x.globalAlpha=1; }
  x.setTransform(1,0,0,1,0,0); x.restore();
  if(JUICE.AU&&_f>0){
    /* VALUE FIRST, COLOUR SECOND -- the same discipline the TEXTURE MATCH gate
       found in his own art: his is rougher, greyer and less saturated. A face
       going dark reads as hurt long before a red one does. */
    x.save(); x.globalCompositeOperation='multiply';
    x.fillStyle='rgba('+Math.round(255-90*_f)+','+Math.round(255-120*_f)+','+Math.round(255-125*_f)+',1)';
    x.fillRect(0,0,64,64); x.restore();
    /* blood creeps in from the edges as it gets worse */
    if(_f>0.2){ const g2=x.createRadialGradient(32,32,10,32,32,40);
      g2.addColorStop(0,'rgba(150,20,15,0)');
      g2.addColorStop(1,'rgba(150,20,15,'+(0.62*(_f-0.2)/0.8).toFixed(3)+')');
      x.fillStyle=g2; x.fillRect(0,0,64,64); }
    if(_f>0.75){ x.strokeStyle='rgba(170,22,16,'+(0.9*(_f-0.75)/0.25).toFixed(3)+')';
      x.lineWidth=5; x.strokeRect(0,0,64,64); } }"""
    s = subN(s, old, new)

    # ---- 3b. THE ORB GOES IN FRONT OF THE FACE, NOT BEHIND -------------
    old = """  if(stateWash){x.fillStyle=stateWash;x.fillRect(0,0,64,64);}"""
    new = """  /* ===== V129 THE STAMINA ORB, IN FRONT OF THE FACE =================
     He named Warcraft and Diablo, and the reason an orb works is that you judge
     a LEVEL at a glance with no reading at all -- unlike three pips, which you
     have to count. It fills from the bottom and its surface WAVES, because a
     flat line reads as a progress bar and a moving one reads as liquid.
     IN FRONT, NOT BEHIND, AND I ONLY KNOW THAT BECAUSE I MEASURED IT. My first
     cut drew the fluid first and the face over it, and the painted button came
     out BYTE-IDENTICAL at zero stamina and at full -- because his portrait is
     an opaque 64x64 image and covered every pixel of it. A real globe has the
     liquid in FRONT anyway: you see the face THROUGH it, tinted below the
     waterline, and the waterline is the thing you actually read. */
  { const lvl=Math.max(0,Math.min(1,(G.stam||0)/STAM_MAX));
    if(lvl>0){ const top=64-lvl*64*0.86, ph=performance.now()*0.004;
      x.save(); x.beginPath(); x.moveTo(0,64);
      for(let px=0;px<=64;px+=4){ const w=Math.sin(ph+px*0.16)*1.5+Math.sin(ph*0.7+px*0.09)*1.0;
        x.lineTo(px,top+w); }
      x.lineTo(64,64); x.closePath();
      const g=x.createLinearGradient(0,top,0,64);
      g.addColorStop(0,'rgba(120,232,150,0.15)'); g.addColorStop(1,'rgba(30,140,70,0.13)');
      x.fillStyle=g; x.fill();
      x.strokeStyle='rgba(190,255,210,0.85)'; x.lineWidth=1.4; x.stroke();
      x.restore(); } }
  if(stateWash){x.fillStyle=stateWash;x.fillRect(0,0,64,64);}"""
    s = subN(s, old, new)

    # ---- 4. the hit records WHERE it came from -------------------------
    # DOOM'S LEAN. The bearing is recorded BEFORE the repaint, so the very first
    # frame of the hurt face is already leaning at the man who did it.
    old = """function feltHit(){ _pbtnKey=null; try{paintFireButton('rgba(30,24,14,0.30)');}catch(_e){}   /* AU: the face updates the instant you bleed */"""
    new = """function feltHit(fromEa){
  /* V129: the face LEANS toward whoever did it -- Doom's own trick, and it
     costs nothing here because the field is polar so the bearing is exact.
     Recorded BEFORE the repaint so the first hurt frame is already leaning. */
  if(fromEa!=null){ G._hitFromEa=fromEa; G._hitFromAt=performance.now(); }
  _pbtnKey=null; try{paintFireButton('rgba(30,24,14,0.30)');}catch(_e){}   /* AU: the face updates the instant you bleed */"""
    s = subN(s, old, new)

    # the one path that actually resolves an incoming hit knows the shooter
    old = """      else { feltHit(); try{sndHit();}catch(_e){} }
      const _se=G.e[inc.idx[i]];"""
    new = """      else { const _sh=G.e[inc.idx[i]]; feltHit(_sh?_sh.ea:null); try{sndHit();}catch(_e){} }   /* V129: the face leans at the shooter */
      const _se=G.e[inc.idx[i]];"""
    s = subN(s, old, new)

    # ---- 5. the pips leave the top row --------------------------------
    old = """    <span id="stampips" class="cbtn" style="pointer-events:none;border-color:#3a5a3a;color:#8fe89a">STA \\u25c6\\u25c6\\u25c6</span>
"""
    new = """    <!-- V129: the STA pips are OFF the top menu. Stamina is FLUID in the fire
         button now (his ask: "maybe it's like fluid I know all of Warcraft...
         Diablo as well"), which is legible at a glance because you judge a
         LEVEL instead of counting pips. Fifth thing removed from this row this
         week, same complaint every time. updStam is null-safe already. -->
"""
    s = subN(s, old, new)

    # updStam must repaint the button now that the pips are gone
    old = """function updStam(){ const s=D('stampips'); if(!s)return; const n=Math.max(0,Math.min(STAM_MAX,G.stam||0));
  s.innerHTML='STA '+'\\u25c6'.repeat(n)+'\\u25c7'.repeat(STAM_MAX-n); }"""
    new = """function updStam(){ /* V129: the orb IS the stamina read, so a spend repaints the button. */
  try{ _pbtnKey=null; paintFireButton(G.phase==='aim'?'rgba(30,24,14,0.30)':null); }catch(_e){}
  const s=D('stampips'); if(!s)return; const n=Math.max(0,Math.min(STAM_MAX,G.stam||0));
  s.innerHTML='STA '+'\\u25c6'.repeat(n)+'\\u25c7'.repeat(STAM_MAX-n); }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v129: ten damage states + the stamina orb, in the button (%d chars)' % len(s))


if __name__ == '__main__':
    main()
