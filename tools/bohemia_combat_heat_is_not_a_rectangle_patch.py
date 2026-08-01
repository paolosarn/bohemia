#!/usr/bin/env python3
"""V112 THE ORANGE, TENTH REPORT: IT IS MY OWN CAR HEAT SLAB.

Paolo, with a screenshot: "that orange part of the dead shot dial is not going
away during the cinematic camera shit I don't know why it's so difficult to get
rid of that please I've asked like 10 times."

HE IS RIGHT THAT IT IS RIDICULOUS, AND THE REASON I KEPT MISSING IT IS A FLAW
IN MY METHOD, NOT BAD LUCK.

Every time I instrumented the canvas I ranked the results BY CALL COUNT. That
finds things drawn hundreds of times a frame -- which is how I caught the eight
ghost arms (v107) and the deck kick rail (v110). But the thing in his
screenshot is ONE BIG RECTANGLE DRAWN ONCE PER FRAME. Twenty calls over a whole
killshot. It sat near the bottom of every list I ever printed and I never saw
it, three separate investigations running.

RANKED BY AREA INSTEAD, IT WAS THE TOP WARM OBJECT ON THE FIRST RUN:

    maxArea 32062   n=20   fillRect rgb(232,71,40)  drawField  146x219 @763,127
    maxArea 32062   n=20   drawImage                drawField  146x219

146x219 at ring=73 is EXACTLY 2 tiles by 3 -- a car -- and the drawImage
underneath it at the identical size is the car sprite. rgb(232,71,40) is
literally `'rgba(232,'+Math.round(120-70*_ht)+',40,...)'` at 70% heat.

IT IS THE CAR HEAT GLOW I ADDED IN v108, FOUR TURNS AGO. A solid orange
rectangle the size and shape of the one in his photo.

TWO THINGS ARE WRONG WITH IT, NOT ONE.

1. IT IS `globalCompositeOperation='lighter'`, WHICH ADDS LIGHT. That is why
   dimming never touched it: v110 moved the killshot dim to after the whole
   environment and darkened every warm highlight at the source, and a black
   wash cannot subtract an additive layer. It survived the one fix that was
   built to catch exactly this.

2. IT IS A FULL-BODY SLAB, so it is wrong even when nothing is dying. Additive
   orange at 0.21 over a dark car sprite is a flat orange rectangle, which is
   what he photographed. HOT METAL DOES NOT LOOK LIKE A COLOURED RECTANGLE
   LAID ON A CAR. It glows at its edges and it is hottest where the fire is.

THE FIX IS BOTH:
  * the heat never draws during a kill, on the same named rule as everything
    else (dialOrnament)
  * the full-body additive slab is DELETED. What is left is the rim -- which
    was always the readable part -- plus a soft radial bloom at THE TANK END
    ONLY, which is also more honest, because the tank is in the boot and that
    is the end that matters. No `lighter` anywhere.

The mechanic is untouched: heat still accumulates, still cooks off, still
kills. Only the drawing changes.

AND THE METHOD LESSON IS THE POINT: rank by AREA, not by count. A thing drawn
once a frame can still be the biggest thing on the screen.

REUSE CHECK: cooks NO graphic pixels. It deletes one fillRect and replaces it
with a gradient built from canvas primitives. No bank is opened because no art
is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V112 HOT METAL IS NOT AN ORANGE RECTANGLE'


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
        print('v112 already in; nothing to do')
        return

    old = """        else { const _ht=Math.min(1,((G._carHeat||{})[P.car]||0)/CAR_COOK);
          if(_ht>0.04){ const _pu=0.55+0.45*Math.sin(performance.now()*(0.004+_ht*0.020));
            x.save(); x.globalCompositeOperation='lighter';
            x.fillStyle='rgba(232,'+Math.round(120-70*_ht)+',40,'+(0.30*_ht*_pu).toFixed(3)+')';
            x.fillRect(bx,by,bw,bh); x.restore();
            /* and the tank end burns hottest, because that is the end that matters */
            x.save(); x.globalAlpha=Math.min(0.95,0.35+0.65*_ht);
            x.strokeStyle='rgba(255,'+Math.round(190-130*_ht)+',60,0.95)';
            x.lineWidth=Math.max(1.5,ring*0.09);
            x.strokeRect(bx+1,by+1,bw-2,bh-2); x.restore(); } } }"""
    new = """        /* ===== V112 HOT METAL IS NOT AN ORANGE RECTANGLE ==============
           THIS IS THE ORANGE. Tenth report, and I kept missing it because I
           ranked every instrument run BY CALL COUNT -- which finds eight ghost
           arms and a kick rail stroked 232 times, and completely hides ONE BIG
           RECTANGLE DRAWN ONCE A FRAME. Ranked by AREA it was the top warm
           object on the first run: fillRect rgb(232,71,40), 146x219, which at
           ring=73 is exactly 2 tiles by 3 -- a car -- sitting on a drawImage of
           the identical size. It is the heat glow I added in v108.
           IT WAS `globalCompositeOperation='lighter'`, WHICH ADDS LIGHT, so the
           v110 kill dim could not touch it: you cannot subtract an additive
           layer with a black wash. It survived the one fix built to catch it.
           AND A FULL-BODY SLAB IS WRONG EVEN WHEN NOBODY IS DYING. Additive
           orange over a dark sprite is a flat orange rectangle, which is what
           he photographed. Hot metal glows at its EDGES and it is hottest where
           the fire is -- and the fire is the tank, which is in the boot.
           The mechanic is untouched. Only the drawing changes. */
        else if(dialOrnament()){ const _ht=Math.min(1,((G._carHeat||{})[P.car]||0)/CAR_COOK);
          if(_ht>0.04){ const _pu=0.55+0.45*Math.sin(performance.now()*(0.004+_ht*0.020));
            /* THE RIM: the readable part, and the only part that was ever
               carrying the read. It brightens as the metal cooks. */
            x.save(); x.globalAlpha=Math.min(0.92,0.30+0.62*_ht)*(0.72+0.28*_pu);
            x.strokeStyle='rgba(255,'+Math.round(190-130*_ht)+',60,0.95)';
            x.lineWidth=Math.max(1.5,ring*0.09);
            x.strokeRect(bx+1,by+1,bw-2,bh-2); x.restore();
            /* THE TANK END, and only the tank end: a soft bloom that falls off
               to nothing, so it reads as heat coming OUT of the metal instead
               of paint laid ON it. No lighter, so the kill dim owns it. */
            { const _tx=bx+bw*0.5, _ty=by+bh*0.82, _tr=Math.max(6,ring*0.95);
              const g2=x.createRadialGradient(_tx,_ty,0,_tx,_ty,_tr);
              g2.addColorStop(0,'rgba(255,'+Math.round(150-90*_ht)+',50,'+(0.40*_ht*_pu).toFixed(3)+')');
              g2.addColorStop(1,'rgba(255,120,40,0)');
              x.save(); x.fillStyle=g2;
              x.beginPath(); x.arc(_tx,_ty,_tr,0,7); x.fill(); x.restore(); } } } }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v112: the orange slab is deleted; heat is a rim and a tank bloom (%d chars)' % len(s))


if __name__ == '__main__':
    main()
