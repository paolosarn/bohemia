#!/usr/bin/env python3
"""V131 REAL DAMAGE, DRAWN ON THE BONES OF WHATEVER FACE YOU HAVE.

Paolo 8/7: "Pretty dogshit all u did was change the opacity of the nose bleed. U
need to do better and it needs to work with customizable faces"

HE IS LITERALLY, EXACTLY RIGHT, AND MORE PRECISELY THAN A GUESS COULD BE.

--------------------------------------------------------------------------
WHAT v129 ACTUALLY DID, WHICH IS WHAT HE SAID IT DID
--------------------------------------------------------------------------
v129 crossfaded SPR.portraits.you into SPR.portraits.dying. And `dying` is:

    dying: packIdx(renderFace(buildSpec(),{ramp:portraitRamp(),blood:true}),64,64)

THE SAME FACE WITH blood:true. And blood:true, in its entirety, is:

    if(blood){for(const p of [[cx+1,ny1],[cx+1,ny1+2],[cx+2,ny1+4],
      [cx+2,my-1],[cx+2,my+1],[cx+3,my+3]]){P(p[0],p[1],[168,28,28]);...}}

SIX PIXELS OF NOSEBLEED. That is the entire difference between healthy and
dying. So a crossfade between them changes exactly one thing: THE OPACITY OF THE
NOSE BLEED. He described the implementation from the outside, correctly, without
reading it.
(One thing I got wrong in my own diagnosis and am correcting: I assumed `dying`
was a different person's face and would break customisation. It is not -- it is
buildSpec() like everything else. The customisation was never broken. The damage
was just six pixels.)

--------------------------------------------------------------------------
WHY IT MUST BE DRAWN INSIDE THE GENERATOR
--------------------------------------------------------------------------
"it needs to work with customizable faces" is the whole design constraint, and it
rules out every overlay approach -- a fixed damage sprite, a wash, a vignette --
because those sit at fixed coordinates while the face underneath moves. A tall
forehead, a wide jaw, close-set eyes: an overlay lands in the wrong place on
every one.
renderFace ALREADY receives the exact anatomy of the face it is drawing:
    f.browY  f.eyeY  f.noseY  f.mouthY  f.cheekY  f.cheekW  f.jawCornerY
    spec.eyes.gap/.w/.h   spec.nose.w   spec.mouth.w
SO THE WOUNDS ARE PLACED ON THAT FACE'S OWN BONES. Not near them, ON them. A
face with a wider cheekbone gets its cut further out, by construction, and no
future customisation can break it.

--------------------------------------------------------------------------
THE RESEARCH DECIDED WHERE, NOT ME
--------------------------------------------------------------------------
Boxing/ringside trauma sources are unanimous on the mechanism: cuts come from
contact at the BONY PROMINENCES -- eyebrows, cheekbones, nose, lips -- because
"the skin above the bone is compressed to the extent that it is ruptured". And
where vessels rupture WITHOUT the skin breaking you get swelling and bruising
instead of a cut.
That is a placement rule, and every prominence it names is a field in the spec.
So the progression is anatomy, not decoration:
    1  a contusion on the cheekbone   -- vessels go first, skin intact
    2  the brow ridge splits          -- the classic ring cut, hardest bone
    3  swelling under the eye         -- edema closing the aperture
    4  the nose goes                  -- the original six pixels, now one beat
    5  the lip splits
    6  the eye swells SHUT            -- a lid drawn over it, the eye stops reading
    7  everything runs DOWNWARD       -- gravity, blood tracks toward the jaw
    8  the face goes pallid           -- blood loss desaturates the skin itself
ONE SIDE takes the beating, chosen per fight, so the face reads as a person who
got hit rather than a symmetrical pattern.

--------------------------------------------------------------------------
AND IT IS A POST-PASS, NOT A REWRITE
--------------------------------------------------------------------------
Every wound draws AFTER the face is finished, over the top, using the same P()
plotter the face itself uses. Not one existing line of renderFace changes, so no
face he has ever approved renders differently at damage 0. The old `blood` flag
still works exactly as it did.

REUSE CHECK: authors damage pixels, and it opens no bank because there is no
bank of facial wounds -- this is the generator, which is where face pixels are
authored in this repo. It reuses renderFace's own P/rect/line plotters, its own
skin ramp (wounds derive from Sh/Ln, so they sit in the face's own palette on
every skin tone) and its own anatomy fields. Nothing is hand-placed.

TASTE CHECK: the taste rule this answers is his, verbatim: six pixels of
nosebleed is not a damage state. Damage reads in SHAPE and VALUE -- a split, a
swelling, a lid -- not in a red filter, which is what v129 leaned on and what he
called dogshit. The colours are derived from the face's own shadow and line
tones rather than invented, so a pale character and a dark character both bruise
in their own range. No purple: the bruise sits on the red/ochre side because
purple belongs to the Amalgamation alone.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. This is the FACE generator, which is not the
  rig; BAKED and the painted regions are untouched.
  built on: renderFace's spec anatomy
  joints: none
  parts: none
"""
import re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V131 REAL DAMAGE ON THE BONES'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    if MARK in html:
        print('v131 already in; nothing to do')
        return

    # ---- 1. THE WOUNDS, DRAWN ON THE SPEC'S OWN ANATOMY ----------------
    old = """ if(blood){for(const p of [[cx+1,ny1],[cx+1,ny1+2],[cx+2,ny1+4],[cx+2,my-1],[cx+2,my+1],[cx+3,my+3]]){P(p[0],p[1],[168,28,28]);P(p[0],p[1]+1,[120,18,18]);}}"""
    new = """ if(blood){for(const p of [[cx+1,ny1],[cx+1,ny1+2],[cx+2,ny1+4],[cx+2,my-1],[cx+2,my+1],[cx+3,my+3]]){P(p[0],p[1],[168,28,28]);P(p[0],p[1]+1,[120,18,18]);}}
 /* ===== V131 REAL DAMAGE ON THE BONES ==============================
    Paolo: "Pretty dogshit all u did was change the opacity of the nose bleed. U
    need to do better and it needs to work with customizable faces."
    HE WAS LITERALLY RIGHT. The `dying` portrait is this same face with
    blood:true, and blood:true is the six pixels on the line above. So the old
    crossfade could only ever change the nosebleed's opacity.
    "It needs to work with customizable faces" rules out every overlay: a fixed
    damage sprite lands in the wrong place the moment the forehead is taller or
    the eyes are closer. THE WOUNDS ARE PLACED ON THIS FACE'S OWN BONES instead,
    from the anatomy the generator already has (f.browY, f.cheekY, f.cheekW,
    f.noseY, f.mouthY, f.eyeY, spec.eyes.gap/w/h).
    THE RESEARCH CHOSE THE PLACES, NOT ME: ringside trauma sources say cuts come
    from the BONY PROMINENCES -- eyebrows, cheekbones, nose, lips -- because the
    skin over bone is compressed until it ruptures, and where vessels burst under
    intact skin you get swelling instead of a cut. Every prominence they name is
    a field in the spec.
    A POST-PASS: this runs after the face is finished and changes not one line of
    it, so at dmg 0 every approved face renders byte-identical.
    Colours derive from the face's own Sh/Ln/ramp so a pale and a dark character
    each bruise in their own range. No purple anywhere: the Amalgamation owns it. */
 { const dmg=Math.max(0,Math.min(1,+opts.dmg||0));
   if(dmg>0){
     const side=(opts.dmgSide!=null)?opts.dmgSide:1;      /* ONE side takes the beating */
     const wound=[Math.min(255,Sh[0]*0.55+96|0),Sh[1]*0.34|0,Sh[2]*0.32|0];   /* split skin, from the face's own shadow */
     const deep =[Math.min(255,Sh[0]*0.34+58|0),Sh[1]*0.18|0,Sh[2]*0.17|0];
     const bruise=[Math.min(255,Mn[0]*0.62+22|0),Mn[1]*0.46|0,Mn[2]*0.44|0];  /* vessels, skin intact */
     const at=t=>dmg>=t;
     /* 1. THE CHEEKBONE GOES FIRST: vessels rupture under intact skin. */
     if(at(0.10)){ const bx0=cx+side*(cw-3), by0=chY-1;
       for(let yy=0;yy<3;yy++)for(let xx=0;xx<4;xx++){
         if((xx+yy)%4===3)continue;
         const k=1-(yy*0.18); P(bx0-side*xx,by0+yy,[bruise[0]*k|0,bruise[1]*k|0,bruise[2]*k|0]); } }
     /* 2. THE BROW RIDGE SPLITS -- the classic ring cut, hardest bone in the face. */
     if(at(0.24)){ const bxr=cx+side*(b.gap+2), byr=by-1;
       line(bxr,byr,bxr+side*3,byr+2,wound); P(bxr,byr,deep); P(bxr+side,byr+1,deep); }
     /* 3. EDEMA UNDER THE EYE: the aperture starts closing. */
     if(at(0.38)){ const exs=cx+side*e.gap;
       for(let xx=-(e.w>>1);xx<=(e.w>>1);xx++){ const k=1-Math.abs(xx)/(e.w+1)*0.5;
         P(exs+xx,ey+e.h,[bruise[0]*k|0,bruise[1]*k|0,bruise[2]*k|0]);
         if(dmg>=0.5)P(exs+xx,ey+e.h+1,[bruise[0]*k*0.8|0,bruise[1]*k*0.8|0,bruise[2]*k*0.8|0]); } }
     /* 4. THE NOSE. The original six pixels, now one beat among many. */
     if(at(0.50)){ for(const p of [[cx+1,ny1],[cx+1,ny1+2],[cx+2,ny1+4]]){
       P(p[0],p[1],wound); P(p[0],p[1]+1,deep); } }
     /* 5. THE LIP SPLITS. */
     if(at(0.62)){ const lx=cx+side*2; P(lx,my-1,wound); P(lx,my,deep); P(lx+side,my,wound); }
     /* 6. THE EYE SWELLS SHUT -- a lid drawn over it, so the eye stops reading as
        an eye. This is the one that makes a face look genuinely beaten. */
     if(at(0.74)){ const exs=cx+side*e.gap, half=e.w>>1;
       for(let yy=0;yy<e.h;yy++)for(let xx=-half;xx<=half;xx++){
         const k=0.92-yy*0.06; P(exs+xx,ey+yy,[Sh[0]*k|0,Sh[1]*k|0,Sh[2]*k|0]); }
       line(exs-half,ey+(e.h>>1),exs+half,ey+(e.h>>1),deep); }
     /* 7. GRAVITY. Everything runs DOWNWARD toward the jaw. */
     if(at(0.84)){ const runs=[[cx+side*(b.gap+3),by+3],[cx+2,ny1+5],[cx+side*2,my+2]];
       for(const r of runs){ const len=3+Math.round(dmg*5);
         for(let yy=0;yy<len;yy++){ const k=1-yy/(len+2)*0.6;
           P(r[0],r[1]+yy,[deep[0]*k+wound[0]*(1-k)|0,deep[1]*k|0,deep[2]*k|0]); } } }
     /* 8. BLOOD LOSS. The skin itself goes pallid -- the whole point is that this
        is the FACE changing, not a wash laid on top of it. */
     if(at(0.90)){ const pal=(dmg-0.90)/0.10;
       for(let yy=0;yy<N;yy++)for(let xx=0;xx<N;xx++){ const i=(yy*N+xx)*4;
         if(!buf[i+3])continue;
         const g=(buf[i]*0.35+buf[i+1]*0.5+buf[i+2]*0.15);
         buf[i]  =buf[i]  +(g*1.02-buf[i]  )*0.55*pal;
         buf[i+1]=buf[i+1]+(g*0.99-buf[i+1])*0.55*pal;
         buf[i+2]=buf[i+2]+(g*1.01-buf[i+2])*0.55*pal; } }
   } }"""
    html = subN(html, old, new)

    # ---- 2. TEN FRAMES OUT OF THE GENERATOR ----------------------------
    old = """        dying:packIdx(renderFace(buildSpec(),{ramp:portraitRamp(),blood:true}),64,64)};}catch(_e){}"""
    new = """        dying:packIdx(renderFace(buildSpec(),{ramp:portraitRamp(),blood:true}),64,64),
        /* V131: TEN REAL DAMAGE FRAMES, each rendered from buildSpec() like every
           other face in the game, so customisation is preserved by construction --
           change the character and all ten change with him. `dying` stays for any
           older caller. */
        dmg:(function(){ const a=[]; const _sd=(Math.random()<0.5?-1:1);
          for(let i=0;i<10;i++)a.push(packIdx(renderFace(buildSpec(),
            {ramp:portraitRamp(),dmg:i/9,dmgSide:_sd}),64,64));
          return a; })()};}catch(_e){}"""
    html = subN(html, old, new)

    ALPHA.write_text(html)
    print('v131: ten anatomically-placed damage frames out of the face generator')


if __name__ == '__main__':
    main()
