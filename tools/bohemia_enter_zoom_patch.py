#!/usr/bin/env python3
"""
V205 -- HOW THE FIGHT BEGINS: THE CAMERA PULLS BACK  (COMBAT lane, [enter zoom])

  PAOLO RULED IT 9/6, OPTION A: "Yes definitely, and the map will zoom out
  nicely, maybe a cloud opacity somewhere."

The row: you never leave the street. When a fight starts the view zooms out from
person-scale to house-scale over the SAME ground you are standing on, on the beat
at 120 BPM, and comes back in when it ends. HIS DETAIL, LOCKED: a cloud passes in
the turn, a soft opacity layer that covers the moment the scale changes, so the
zoom reads as WEATHER and not as a loading screen.

AND THE MOVE WAS ALREADY BUILT, FOR A DIFFERENT DOOR. transition() has pulled the
walked street up into the map since long before this row -- the same easing, the
same HC curve, "pulling up: zoom OUT from wherever you were" in its own comment --
with a veil that peaks exactly at the swap. THE FIGHT NEVER ASKED FOR ANY OF IT:
it posted its message and the shell hard-cut one document for another. Same shape
as every row in this lane: the material was built and nothing consumed it.

TWO THINGS ARE THIS ROW'S OWN.
  * THE VEIL BECOMES WEATHER. The shipped veil is rgba(8,8,10,0.9) -- near black,
    which is precisely the loading screen he ruled against.
  * THE DURATION IS TWO BEATS. transition() runs 460 ms, which is nothing in
    particular; the look card rules two beats, "beat one the cloud arrives, beat
    two the scale settles."

AND WHAT IT LOOKS LIKE IS DIRECTION'S, RULED 9/6 AND ROUTED TO THIS ROW BY NAME:
records/BOHEMIA_FIGHT_TRANSITION_LOOK_9_6_26.md. A cloud SHADOW (a value
multiplier darkening to 0.75-0.85, no white mist, no blur) that TRAVELS across
the frame, covering at most 60% of it at its peak, cleared by the end of beat
two with no residue; a door gets the doorway's own shadow instead, one mechanism
and two skins. The first cut of this row was built before I read the card and
broke four of those clauses. Every visual number in the block below is quoted
from it.

AND IT COSTS THE FIGHT LOOP NOTHING, which is the point of the row before it. The
draw budget says anything new that draws IN THE FIGHT ships with its cost in
milliseconds a beat and does not enter until there is room -- and the worst-case
headroom is 2.5 ms. So the fight is not touched at all: the zoom and the cloud
live in the CITY, during a handover, which is not the fight loop. The combat blob
is byte-identical and the draw-surface ratchet proves it.
"""
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__ENTER_ZOOM__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:130]))
    return src.replace(old, new, n)


BLOCK = r"""
/* ===== V205 __ENTER_ZOOM__ -- HOW THE FIGHT BEGINS ==========================
   Paolo 9/6, OPTION A, LOCKED: "Yes definitely, and the map will zoom out
   nicely, maybe a cloud opacity somewhere."

   YOU NEVER LEAVE THE STREET. The fight's board is already built out of the real
   place you are standing on -- a street bump makes a STREET board, a door makes
   THAT ROOM with its real walls as cover -- so the only thing missing was the
   picture of it. The view pulls back from person-scale toward house-scale over
   the same ground, a cloud passes across the moment the scale changes, and the
   fight is there when it clears.

   THE PULL-BACK IS transition()'s, NOT A SECOND ONE. That function has taken the
   walked street up into the map since long before this row, and its own comment
   says what it is doing: "pulling up: zoom OUT from wherever you were". Same
   easing, same HC curve, same veil-peaks-at-the-swap shape. The fight simply
   never asked for it.

   *** AND WHAT THE HALF SECOND LOOKS LIKE IS NOT MINE. DIRECTION RULED IT ON 9/6
   AND ROUTED THE CARD TO THIS ROW BY NAME: records/
   BOHEMIA_FIGHT_TRANSITION_LOOK_9_6_26.md, "COMBAT [enter zoom] and ANIMATION
   [zoom beat] build to this". *** The first cut of this row was built before I
   read it and broke four of its clauses, so every visual number below is the
   card's, not a taste of mine:
     1. TWO BEATS, NOT ONE. "beat one the cloud arrives, beat two the scale
        settles... A longer zoom reads as a cutscene; a shorter one as a glitch."
     2. IT IS A CLOUD SHADOW, NOT FOG. "a soft-edged VALUE MULTIPLIER (darken to
        0.75-0.85 at its core, feathered wide)... No white mist, no blur -- this
        is a desert with a sun, and what crosses a desert street is shade." My
        first cut was PALE DUST, which is the white mist the card bans by name.
     3. IT TRAVELS AND IT MAY NOT COVER EVERYTHING. "one direction of travel...
        it enters one screen edge and leaves the other", and the core "covers at
        most 60% of the frame at its peak and NEVER the whole screen - a
        full-frame dim is a fade-to-black in a costume, which is the hard cut
        again." My first cut bloomed in place across the whole frame.
     4. A DOOR GETS THE DOORWAY'S SHADOW, NOT A CLOUD. "One mechanism, two skins;
        the skins never mix."
   The card's own routing says DIRECTION judges the built thing on the real
   surface against its section 6, which is the arbiter here and not this file.

   THE VALUE-ONLY PART IS PROVABLE AND THAT IS WHY IT IS DRAWN THIS WAY. The shade
   is BLACK AT AN ALPHA, never a grey fill and never a blend mode: compositing
   black over a pixel at alpha A leaves every channel multiplied by exactly
   (1-A), so hue and saturation cannot move and the card's "multiplies value and
   touches NOTHING else" is true by construction rather than by eye. The world's
   own weather module already dims a cloudy hour this way (CLOUD_MULT
   [0.86,0.88,0.94]); the card's 0.75-0.85 core is a shadow, deeper than an
   overcast hour, which is what it should be. The one place they differ is that
   CLOUD_MULT cools as it dims and the card says value only -- the card is newer
   and it is about this turn, so the turn does not cool.

   AND THE FIGHT ITSELF IS NOT TOUCHED. [draw budget] says anything new that
   draws inside the fight ships with its cost in milliseconds a beat and does not
   enter until there is room, and the worst-case headroom is 2.5 ms. So nothing
   new draws in there: the zoom and the shade are the CITY's, during a handover,
   and the fight loop pays zero. */
const FZ_MS = BEAT * 2;      /* TWO BEATS -- the card, section 1 */
const FZ_ARRIVE = 0.35;      /* the shade is full by here: it arrives in beat one */
const FZ_PULL0 = 0.50;       /* and the scale settles inside BEAT TWO, the card's word */
const FZ_PULL1 = 0.80;
const FZ_HAND = 0.80;        /* the handover happens UNDER the shade, not as it clears */
let FZOOMING = false;
let FZ_SKIN = 'cloud';
function fightZooming(){ return FZOOMING; }

/* *** THE SHADE. A CLOUD SHADOW CROSSING THE STREET, WHICH IS THE CARD'S SPEC AND
   NOT A CHOICE OF MINE. *** Black at an alpha, so every channel is multiplied by
   the same (1-alpha) and the card's "value only" is arithmetic rather than an
   opinion. Soft-edged and wide, and it TRAVELS: it enters one edge and crosses,
   because "a shadow that blooms in place reads as an effect; one that CROSSES
   reads as sky."
   THE CORE IS 0.78 (the card's band is 0.75-0.85) and it may cover at most 60%
   of the frame, so a fight never starts behind a full-frame dim -- the card calls
   that "a fade-to-black in a costume, which is the hard cut again."
   [DIAL, draft:true] ONLY the direction of travel: no wind direction exists
   anywhere in canon, so left to right is a guess of mine and it is marked as one.
   Everything else here is quoted from the card.
   COLOUR IS TERRITORY: a shadow has no colour at all, so it cannot wear anybody's
   faction. That law is satisfied by the card's own spec. */
const FZ_CORE = 0.78;        /* the card: darken to 0.75-0.85 at the core */
const FZ_DOOR_CORE = 0.62;   /* the door's skin is interior dark, and darker is right */
const FZ_R = 0.45;           /* shade radius as a fraction of the long edge; the CORE
                                (below 0.85) lands near 27% of it, about 40% of frame */
function fightShadeAt(u){    /* where the core is, in fractions of the width */
  return -0.62 + 1.44 * u;   /* off the left edge at 0, over the middle at the swap */
}
function fightShade(a, u, skin){
  if(a<=0.002) return;
  const W=cv.width, H=cv.height;
  const core=(skin==='door')?FZ_DOOR_CORE:FZ_CORE;
  const A=(1-core)*Math.min(1,a);          /* black at an alpha IS a value multiply */
  g.save();
  if(skin==='door'){
    /* THE DOORWAY'S OWN SHADOW, not a cloud: "interior dark... One mechanism, two
       skins; the skins never mix." A hard-edged band of interior dark sweeping the
       frame the way a door frame's shadow crosses you as you step through it. */
    const x=(-0.45+1.7*u)*W, w=W*0.34;
    const gr=g.createLinearGradient(x-w,0,x+w,0);
    gr.addColorStop(0,   'rgba(0,0,0,0)');
    gr.addColorStop(0.44,'rgba(0,0,0,'+A.toFixed(3)+')');
    gr.addColorStop(0.56,'rgba(0,0,0,'+A.toFixed(3)+')');
    gr.addColorStop(1,   'rgba(0,0,0,0)');
    g.fillStyle=gr;
  } else {
    const cx=fightShadeAt(u)*W, cy=H*0.46, r=Math.max(W,H)*FZ_R;
    const gr=g.createRadialGradient(cx,cy,r*0.08,cx,cy,r);
    gr.addColorStop(0,   'rgba(0,0,0,'+A.toFixed(3)+')');
    gr.addColorStop(0.42,'rgba(0,0,0,'+A.toFixed(3)+')');
    gr.addColorStop(1,   'rgba(0,0,0,0)');
    g.fillStyle=gr;
  }
  g.fillRect(0,0,W,H);
  g.restore();
}
/* THE ALPHA OVER THE TWO BEATS: it arrives across beat one, holds through the
   scale change, and the SHELL takes it off after the swap -- the card wants it
   gone by the end of beat two with no residue, and the swap is at 80% of the
   move, so the tail has 200 ms of the second beat to clear in. */
function fightShadeA(u){
  if(u<=0) return 0;
  if(u<FZ_ARRIVE) return u/FZ_ARRIVE;
  return 1;
}

/* *** IT SCALES THE FRAME, IT DOES NOT RE-RENDER THE WORLD, AND BOTH HALVES OF
   THAT WERE MEASURED. *** The first cut drove HC -- the walked street's pixels
   per cell -- and re-rendered every frame, the way transition() does. Two things
   came back off the real surface and both were bad:
     ELEVEN FRAMES IN EIGHT HUNDRED MILLISECONDS. Re-rendering the city at a new
     zoom every frame busts the chunk cache every frame, so the move ran at about
     fourteen a second. A camera pull-back that stutters is worse than none, and
     "on the beat at 120 BPM" is the row's own requirement.
     AND HC WAS LEFT AT 1.4. I read transition()'s curve as spanning the whole
     move when its `e` only ever reaches a half before it swaps, so the pull went
     more than twice as deep as the shipped one and stranded the street at a
     blur of dots whenever the animation did not finish.
   So the frame that is already on the glass is photographed once and that ONE
   BITMAP is scaled. It is a single blit a frame, it cannot strand the camera
   because it never touches it, and it is what a camera pulling back looks like. */
const FZ_DEEP = 0.34;     /* [DIAL, draft:true] how far back it pulls. A combat tile
                             is EIGHT person tiles (V198), so true house-scale is an
                             eighth and at an eighth the street is a postage stamp.
                             This is visibly pulled back, still legibly the same
                             ground, and the cloud covers the rest of the distance.
                             What it should LOOK like is the art direction's. */
function fzSnap(){
  const c=document.createElement('canvas');
  c.width=cv.width; c.height=cv.height;
  try{ c.getContext('2d').drawImage(cv,0,0); }catch(_e){}
  /* AND A SOFT COPY FOR THE SURROUND, BLURRED ONCE AND NOT PER FRAME. A pull-back
     shows more ground than the photograph has, and the first cut filled that
     margin with near-black -- which fails the card's judge test on its own
     terms: "Freeze any frame of the half second: it must still look like the
     walked street... If a frozen frame looks like a different game, the turn
     failed." A letterbox is a different game. So the margin is the same street,
     softened, which is what is out there anyway. */
  const b=document.createElement('canvas');
  b.width=cv.width; b.height=cv.height;
  try{ const bg=b.getContext('2d');
    bg.filter='blur(14px)'; bg.drawImage(c,0,0); bg.filter='none';
  }catch(_e){ try{ b.getContext('2d').drawImage(c,0,0); }catch(_e2){} }
  return { sharp:c, soft:b };
}
function fzPaint(snap,s,a,u,skin){
  const W=cv.width,H=cv.height;
  g.save();
  g.imageSmoothingEnabled=true;
  try{ g.drawImage(snap.soft,0,0,W,H); }catch(_e){}
  try{ g.drawImage(snap.sharp,0,0,W,H,(W-W*s)/2,(H-H*s)/2,W*s,H*s); }catch(_e){}
  g.restore();
  fightShade(a,u,skin||FZ_SKIN);
}

/* OUT, IN TWO BEATS, WHICH IS THE CARD'S SHAPE AND NOT A DURATION I PICKED.
     BEAT ONE -- THE SHADE ARRIVES, AND THE WORLD IS STILL LIVE. The card is
     explicit that nothing about time changes ("the world clock, the music
     transport and the walk beat run through the turn uninterrupted. The
     transition is weather, not a pause"), so the first beat RE-RENDERS THE REAL
     CITY every frame and paints the shade on top of it. That is affordable
     because the scale is not changing yet: this is the same render the city does
     while you walk, and the chunk cache holds.
     BEAT TWO -- THE SCALE SETTLES. The photograph is taken at the beat line and
     the pull-back scales that one bitmap, for the reason underneath.
     THE HANDOVER IS AT 80% OF THE MOVE, UNDER THE SHADE, so the shell has the
     last 200 ms of beat two to take the shade off in -- the card wants it "gone
     by the end of beat two, fully - no lingering tint, no residue". */
function fightZoomOut(then, skin){
  if(FZOOMING){ return false; }
  if(typeof transing!=='undefined' && transing){ if(then)then(); return true; }
  FZOOMING=true;
  FZ_SKIN=(skin==='door')?'door':'cloud';
  let snap=null;
  const t0=performance.now();
  let fired=false;
  /* *** AND THE LATCH CLEARS ON A CLOCK, NOT ONLY ON THE LAST FRAME. *** The
     handover HIDES this document: the shell swaps to the fight panel, the city
     stops painting, and requestAnimationFrame stops firing -- so the second half
     of this animation never runs and the flag it set would stay up FOREVER,
     refusing every fight after the first. Caught by a harness that hung on
     exactly that. A backstop on setTimeout survives a frame that is no longer
     drawn, and it puts the picture back where it found it. */
  const bail=setTimeout(function(){ if(!FZOOMING)return;
    FZOOMING=false; try{ render(); }catch(_e){} }, FZ_MS+400);
  /* *** AND THE HANDOVER LANDS BY THE CLOCK, NOT BY THE FRAME COUNT. ***
     MEASURED: the walked city's own loop idles at TWENTY frames a second here,
     and under load it fell to three -- which put the handover at 845 ms instead
     of 250, a visible hitch before a fight that is supposed to start on the
     beat. The picture is allowed to be as smooth as the document can manage;
     WHEN THE FIGHT STARTS is not, because that is the 120 BPM law. So whichever
     comes first, the frame that reaches the mark or the clock, fires it once. */
  const fire=function(){ if(fired)return; fired=true; if(then)then(); };
  const onTime=setTimeout(fire, Math.round(FZ_MS*FZ_HAND));
  (function frame(now){
    const u=Math.min(1,(now-t0)/FZ_MS);
    const a=fightShadeA(u);
    if(u<FZ_PULL0){
      /* BEAT ONE: the real world, still running, with the shade crossing it */
      try{ render(); }catch(_e){}
      try{ fightShade(a,u,FZ_SKIN); }catch(_e){}
    } else {
      /* THE PHOTOGRAPH IS TAKEN OF A CLEAN WORLD FRAME, never of the frame the
         shade is already on: snapshot the painted canvas and the shadow gets
         baked into the bitmap and then SCALED WITH IT, so the shade would shrink
         with the street and a second one would be drawn on top of it. */
      if(!snap){ try{ render(); }catch(_e){} try{ snap=fzSnap(); }catch(_e){} }
      const p=Math.min(1,(u-FZ_PULL0)/(FZ_PULL1-FZ_PULL0)), e=ease(p);
      try{ fzPaint(snap, 1-(1-FZ_DEEP)*e, a, u, FZ_SKIN); }catch(_e){}
    }
    if(!fired && u>=FZ_HAND){ clearTimeout(onTime); fire(); }
    if(u<1) requestAnimationFrame(frame);
    else { clearTimeout(bail); clearTimeout(onTime); fire(); FZOOMING=false; try{ render(); }catch(_e){} }
  })(t0);
  return true;
}

/* IN: the way back, and it is "the same two beats reversed", the card's words.
   The shell has already put the city back on screen with the shade over it, so
   the scale settles FIRST (out of the pull-back, under the shade) and then the
   world is live again while the shade finishes crossing and clears. */
function fightZoomIn(skin){
  if(FZOOMING) return false;
  FZOOMING=true;
  FZ_SKIN=(skin==='door')?'door':(FZ_SKIN||'cloud');
  try{ render(); }catch(_e){}
  let snap=null;
  try{ snap=fzSnap(); }catch(_e){}
  const t0=performance.now();
  const bail=setTimeout(function(){ if(!FZOOMING)return;
    FZOOMING=false; try{ render(); }catch(_e){} }, FZ_MS+400);
  const SETTLE=1-FZ_PULL1;            /* the mirror of the pull: 0.20 of the move */
  (function frame(now){
    const u=Math.min(1,(now-t0)/FZ_MS);
    /* THE SHADE CLEARS ACROSS THE WHOLE RETURN, and it keeps travelling the way
       it came in, so the turn reads as one cloud passing rather than two. */
    const a=1-u, v=Math.min(1,FZ_HAND+u*(1-FZ_HAND));
    if(u<SETTLE && snap){
      const p=Math.min(1,u/SETTLE), e=ease(p);
      try{ fzPaint(snap, FZ_DEEP+(1-FZ_DEEP)*e, a, v, FZ_SKIN); }catch(_e){}
    } else {
      try{ render(); }catch(_e){}
      try{ fightShade(a,v,FZ_SKIN); }catch(_e){}
    }
    if(u<1) requestAnimationFrame(frame);
    else { clearTimeout(bail); FZOOMING=false; try{ render(); }catch(_e){} }
  })(t0);
  return true;
}

/* ONE DOOR FOR "THE FIGHT IS STARTING". Four places post the encounter -- the
   road contact, a crew closing on you, a hostile body, and walking through a
   door -- and all four used to hand over with a hard cut. They go through here
   now, so the picture is the same wherever the fight came from, which is the
   row's own sentence: SAME MOVE for a street fight and for a room. */
function cityHandOver(msg, skin){
  try{
    return fightZoomOut(function(){
      try{ window.parent.postMessage(msg,'*'); }catch(_e){}
    }, skin);
  }catch(_e){
    try{ window.parent.postMessage(msg,'*'); }catch(_e2){}
    return true;
  }
}
/* ===== /V205 __ENTER_ZOOM__ ===== */
"""


def main():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  city slice already patched')
        return

    # 1. the block, right after the transition helpers it reuses.
    s = sub(s,
            "function ease(u){ return u<0.5? 2*u*u : 1-Math.pow(-2*u+2,2)/2; }",
            "function ease(u){ return u<0.5? 2*u*u : 1-Math.pow(-2*u+2,2)/2; }\n"
            + BLOCK.strip(),
            1, 'city/block')

    # 2. every entry hands over through the one door.
    s = sub(s,
            "  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:String((ev&&ev.name)||'on the road'), faction:fac, draft:true,\n"
            "    roster:roadFightRoster(P,ev), street:true, why:'road:'+(ev&&ev.id),\n"
            "    at:{gx:w[0]|0, gy:w[1]|0}},'*'); }catch(_e){ return false; }",
            "  /* V205 __ENTER_ZOOM__: the camera pulls back first, and the handover happens\n"
            "     inside the cloud. */\n"
            "  if(!cityHandOver({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:String((ev&&ev.name)||'on the road'), faction:fac, draft:true,\n"
            "    roster:roadFightRoster(P,ev), street:true, why:'road:'+(ev&&ev.id),\n"
            "    at:{gx:w[0]|0, gy:w[1]|0}})) return false;",
            1, 'city/hand-road')

    s = sub(s,
            "      try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "        label:'out on the block', faction:cfac, draft:true, roster:croster,\n"
            "        street:true, why:'crew',\n"
            "        at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }",
            "      if(!cityHandOver({type:'BOHEMIA_CITY_ENCOUNTER',   /* V205 __ENTER_ZOOM__ */\n"
            "        label:'out on the block', faction:cfac, draft:true, roster:croster,\n"
            "        street:true, why:'crew',\n"
            "        at:{gx:hx|0, gy:hy|0}})) return false;",
            1, 'city/hand-crew')

    s = sub(s,
            "  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:'out on the block', faction:fac, draft:true, roster:roster,\n"
            "    street:true, why:why,\n"
            "    at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }",
            "  if(!cityHandOver({type:'BOHEMIA_CITY_ENCOUNTER',   /* V205 __ENTER_ZOOM__ */\n"
            "    label:'out on the block', faction:fac, draft:true, roster:roster,\n"
            "    street:true, why:why,\n"
            "    at:{gx:hx|0, gy:hy|0}})) return false;",
            1, 'city/hand-person')

    # 3. and the door into a room takes the same move, which is the row's own words.
    s = sub(s,
            "  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:(INSIDE.label||'interior'), faction:fac, draft:true, roster:roster,\n"
            "    room:cityFightRoom(fp,f),                      /* __THE_FIGHT_GETS_THE_ROOM__ */\n"
            "    at:{gx:(INSIDE.exit&&INSIDE.exit.gx)|0, gy:(INSIDE.exit&&INSIDE.exit.gy)|0}},'*'); }catch(_e){ return false; }",
            "  /* V205 __ENTER_ZOOM__: SAME MOVE FOR A DOOR AS FOR A STREET, which is the\n"
            "     row's own sentence, AND THE OTHER SKIN, which is the look card's:\n"
            "     \"the shade is the DOORWAY'S own shadow sweeping the frame as you cross the\n"
            "     threshold -- interior dark, not a cloud. One mechanism, two skins; the\n"
            "     skins never mix.\" The board is already built out of the building you\n"
            "     walked into; this is the picture of it. */\n"
            "  if(!cityHandOver({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:(INSIDE.label||'interior'), faction:fac, draft:true, roster:roster,\n"
            "    room:cityFightRoom(fp,f),                      /* __THE_FIGHT_GETS_THE_ROOM__ */\n"
            "    at:{gx:(INSIDE.exit&&INSIDE.exit.gx)|0, gy:(INSIDE.exit&&INSIDE.exit.gy)|0}}, 'door')) return false;",
            1, 'city/hand-door')

    # 4. AND THE WAY BACK IN. The shell has already put the city on screen by the
    #    time this lands, so the zoom starts pulled back and eases in.
    s = sub(s,
            "  var d=ev&&ev.data; if(!d||d.type!=='BOHEMIA_CITY_COMBAT_END')return;\n"
            "  var o=d.outcome||{};",
            "  var d=ev&&ev.data; if(!d||d.type!=='BOHEMIA_CITY_COMBAT_END')return;\n"
            "  /* V205 __ENTER_ZOOM__: AND IT COMES BACK IN WHEN IT ENDS. Both directions,\n"
            "     his ruling's own words. The shell has already put the street back on\n"
            "     screen, so this starts pulled back and eases in with the cloud clearing. */\n"
            "  try{ fightZoomIn(); }catch(_e){}\n"
            "  var o=d.outcome||{};",
            1, 'city/way-back')

    open(CITY, 'w', encoding='utf-8').write(s)
    print('V205 applied to', CITY)
    patch_shell()


SHELL = r"""
/* ===== V205 __ENTER_ZOOM__ -- AND THE SHADE HAS TO OUTLIVE THE SWAP ==========
   The city's half of this move paints the shade on the CITY'S canvas, and the
   handover REPLACES that whole panel with the fight's. So the shadow vanished at
   the exact instant it was supposed to be over the player: you saw weather, then
   a hard cut to a fight. The cover has to live ABOVE both documents, which means
   it lives here, in the shell.
   THE CARD'S NUMBERS, NOT MINE. Black at 0.22 alpha is the 0.78 core its band
   asks for (0.75-0.85), and black-at-an-alpha multiplies every channel equally,
   so "value only, no hue rotation, no saturation change" is arithmetic. It is a
   SOFT-EDGED TRAVELLING SHADOW and not a full-frame dim, because the card calls
   a full-frame dim "a fade-to-black in a costume, which is the hard cut again."
   It keeps moving as it clears (the div slides) so the turn reads as one cloud
   passing over both documents rather than two effects.
   *** AND THAT MEANS THE SWAP IS NOT HIDDEN, WHICH IS THE RULING AND NOT A BUG.
   *** An opaque cover would hide it completely and that is exactly what the card
   forbids; what carries the continuity instead is that both pictures are the
   same ground, in the same palette, at two scales. The card's own routing says
   DIRECTION judges this on the real surface against its section 6.
   IT IS ONE DIV AND IT NEVER TOUCHES THE FIGHT. pointer-events none so it can
   never eat a tap, and it is gone inside the second beat. The draw budget says
   anything new that draws IN THE FIGHT ships with its cost and does not enter
   until there is room; this is one div for 200 ms during a handover, outside the
   fight's canvas and outside its loop, so the fight pays nothing. */
var FZ_VEIL=null;
var FZ_VEIL_MS=200;    /* the tail of beat two, so the shade is gone by its end */
function fightVeil(on){
  try{
    if(!FZ_VEIL){
      FZ_VEIL=document.createElement('div');
      FZ_VEIL.id='fzveil';
      FZ_VEIL.style.cssText='position:fixed;inset:0;z-index:999998;pointer-events:none;'
        +'opacity:0;will-change:opacity,transform;'
        +'background:radial-gradient(46% 62% at 50% 46%, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0) 100%)';
      document.body.appendChild(FZ_VEIL);
    }
    /* the city has already brought the shade up to full and put it over the
       middle of the frame, so this starts there and travels out as it clears */
    if(on){ FZ_VEIL.style.transition='none';
      FZ_VEIL.style.opacity='1'; FZ_VEIL.style.transform='translateX(0)';
      void FZ_VEIL.offsetWidth;
      FZ_VEIL.style.transition='opacity '+FZ_VEIL_MS+'ms linear, transform '+FZ_VEIL_MS+'ms linear';
      setTimeout(function(){ if(FZ_VEIL){ FZ_VEIL.style.opacity='0';
        FZ_VEIL.style.transform='translateX(18%)'; } }, 30); }
    else { FZ_VEIL.style.opacity='0'; }
  }catch(_e){}
}
"""


def patch_shell():
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('  shell already patched')
        return
    s = sub(s,
            "function cityEncounterIn(d){",
            SHELL.strip() + "\nfunction cityEncounterIn(d){\n"
            "  fightVeil(true);   /* V205 " + MARK + ": the dust outlives the panel swap */",
            1, 'shell/veil-in')
    s = sub(s,
            "function cityFightHome(outcome){\n"
            "  if(!CITYFIGHT)return false;",
            "function cityFightHome(outcome){\n"
            "  if(!CITYFIGHT)return false;\n"
            "  fightVeil(true);   /* V205 " + MARK + ": and it covers the way back too */",
            1, 'shell/veil-out')
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/12a - THE CAMERA PULLS BACK\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V205 applied to', ALPHA)


if __name__ == '__main__':
    main()
