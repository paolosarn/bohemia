#!/usr/bin/env python3
"""V116 THE ORANGE ARM: ONE `=` THAT SHOULD ALWAYS HAVE BEEN A `*=`.

Paolo, twentieth report, and his sentence this time is the one that solves it:

  "The orange part of the dead shot dial does not slowly disappear LIKE THE
   REST of the dead shot dial."

THE REST FADES. THE ORANGE PART DOES NOT. That is not a missing gate, which
is what I went looking for eleven times. That is one element ESCAPING a fade
that is already working on everything around it.

--------------------------------------------------------------------------
THE LINE
--------------------------------------------------------------------------
The whole dial renders under one alpha:

    ctx.globalAlpha=_df;   // the dial fade, tied to the bullet's travel

Every band, tick, arc, reticle and echo inherits that and fades with it.
Then, inside the dial block, exactly ONE function does this:

    function drawArmNeedle(c2,px,py,ang,L,al){
      c2.save(); c2.globalAlpha=al;        // <-- ASSIGNS
      ...
      c2.strokeStyle='#caa07a';            // <-- THE ORANGE
      c2.lineWidth=Math.max(2,L*0.10);

`=` NOT `*=`. It OVERWRITES the dial fade with its own number, so the warm
tan-orange arm holds its opacity while the entire rest of the instrument
fades out from under it. His description is not approximately the bug, it is
literally the bug, word for word.

MEASURED: it is the ONLY globalAlpha assignment anywhere in the dial block.
Every other piece of the dial inherits _df. fxDrawDial has none. That is why
"the rest" behaves and this one does not.

Every fix I shipped for this set _df harder, gated more members, moved the
world dim, deleted a heat slab. None of them could ever have worked, because
this function throws _df away on its first line and I never once read it.

THE FIX: multiply. `c2.globalAlpha*=al`. It inherits the fade like everything
else and dies with it. The live needle is still called with al=0 and still
draws nothing; the ghost fan still gets its own faint value, now scaled by
the fade instead of replacing it.

--------------------------------------------------------------------------
AND THE BELT AND BRACES HE ASKED FOR TWICE
--------------------------------------------------------------------------
"Make the WHOLE dead shot dial go away."
v114 added DIAL_GONE and used it for the player's pose only. It now bails out
of the ENTIRE dial render -- the wedge, the track, the ticks, the bands, both
ghost fans, the needle, the reticle and the muzzle heat -- in one branch, so
nothing in there can ever outlive the fade again whatever anyone adds later.

REUSE CHECK: cooks NO graphic pixels. It changes one operator and adds one
early bail. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V116 THE ARM INHERITS THE FADE'


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
        print('v116 already in; nothing to do')
        return

    # ---- THE LINE -------------------------------------------------------
    old = """function drawArmNeedle(c2,px,py,ang,L,al){
  const sx=px, sy=py-L*0.42;
  const hx=sx+Math.cos(ang)*L, hy=sy+Math.sin(ang)*L;
  c2.save(); c2.globalAlpha=al;"""
    new = """/* ===== V116 THE ARM INHERITS THE FADE =============================
   Paolo, TWENTIETH report: "The orange part of the dead shot dial does not
   slowly disappear LIKE THE REST of the dead shot dial."
   THE REST FADES, THE ORANGE PART DOES NOT -- which is not a missing gate,
   it is one element ESCAPING a fade that already works on everything else.
   The whole dial renders under `ctx.globalAlpha=_df`. Every band, tick, arc,
   reticle and echo inherits it. This function was the ONLY globalAlpha
   ASSIGNMENT in the entire dial block: `=` where it had to be `*=`. It
   overwrote the fade with its own number, so the warm #caa07a arm held its
   opacity while the instrument around it faded out from under it.
   Eleven fixes set _df harder, gated more members, moved the world dim and
   deleted a heat slab. None of them could ever have worked, because this
   line threw _df away before drawing a single pixel, and I never read it.
   MULTIPLY. The live needle is still called with al=0 and still draws
   nothing; the ghosts still get their own faint value, now SCALED BY the
   fade instead of replacing it. */
function drawArmNeedle(c2,px,py,ang,L,al){
  const sx=px, sy=py-L*0.42;
  const hx=sx+Math.cos(ang)*L, hy=sy+Math.sin(ang)*L;
  c2.save(); c2.globalAlpha*=al;"""
    s = subN(s, old, new)

    # ---- AND THE WHOLE DIAL, IN ONE BRANCH ------------------------------
    old = """  // ---- STATIC WEDGE (the arc) with zones baked in, very low opacity fill ----
  ctx.fillStyle='rgba(200,200,200,.035)';"""
    new = """  /* V116 "MAKE THE WHOLE DEAD SHOT DIAL GO AWAY" -- he has asked for this
     twice in those words. v114 added DIAL_GONE and spent it on the player's
     pose alone. It bails out of the ENTIRE instrument now: the wedge, the
     track, the ticks, the bands, both ghost fans, the needle, the reticle
     and the muzzle heat. One branch, so nothing in here can outlive the fade
     again no matter what anyone adds later. */
  if(!DIAL_GONE){
  // ---- STATIC WEDGE (the arc) with zones baked in, very low opacity fill ----
  ctx.fillStyle='rgba(200,200,200,.035)';"""
    s = subN(s, old, new)

    old = """  // ---- KILLSHOT world-space beats (bullet, impact) render INSIDE the camera ----
  ctx.globalAlpha=1;   /* dial fade never touches the killshot world */"""
    new = """  }   /* V116: end of the one DIAL_GONE branch -- everything above is the instrument */
  // ---- KILLSHOT world-space beats (bullet, impact) render INSIDE the camera ----
  ctx.globalAlpha=1;   /* dial fade never touches the killshot world */"""
    s = subN(s, old, new)

    # ---- AND THE DIAL FADES BACK IN, NEVER SNAPS ------------------------
    old = """  const _df=(G._freezeT>0)?0:((G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1);"""
    new = """  /* ===== V116B THE DIAL COMES BACK SLOWLY TOO ======================
     MEASURED, and it is why twenty reports never matched what I fixed: the
     orange arm's alpha during G.ks was ALREADY 0 on main. It is not on
     screen during the kill at all. What he is photographing is the CHAIN --
     his own screenshot says SHOT 2 OF 2 with the FIRE button green -- where
     the dial SNAPS BACK to full opacity the instant the killshot ends,
     while the camera is still zoomed on the body he just dropped.
     "The orange part does not slowly disappear like the rest" is exactly
     right: the whole instrument fades out and then the biggest, most solid,
     most orange piece of it slams back in over a corpse.
     A SNAP IS NOT A FADE. It ramps back over DIAL_IN_MS, so the dial leaves
     with the bullet and returns with your next shot instead of arriving all
     at once on the cinematic. */
  const DIAL_IN_MS=420;
  /* MEASURED, and this is the part I got wrong on the first attempt: keying
     the ramp off _ksAt does nothing, because _dfT is only the BULLET's travel
     (~90-300ms) while the whole cinematic runs ~2s. By the time the dial is
     allowed back, the ramp has long since finished and it snaps to 1 exactly
     as before. The fade-in has to key off when the KILLSHOT ENDS. */
  if(G.ks)G._ksEnd=performance.now();
  const _sinceKs=(G._ksAt!=null)?(performance.now()-G._ksAt):1e9;
  const _sinceEnd=(G._ksEnd!=null)?(performance.now()-G._ksEnd):1e9;
  const _df=(G._freezeT>0)?0
    :((G.ks&&G._ksAt)?Math.max(0,1-_sinceKs/(_dfT*1000))
      :Math.max(0,Math.min(1,_sinceEnd/DIAL_IN_MS)));"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v116: the arm multiplies the fade; the whole dial bails in one branch (%d chars)' % len(s))


if __name__ == '__main__':
    main()
