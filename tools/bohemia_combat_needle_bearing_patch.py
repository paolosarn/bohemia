#!/usr/bin/env python3
"""V128 THE ROUND GOES WHERE THE NEEDLE WAS POINTING.

Paolo 8/4: "cool i noticed it although it didnt sometimes go to where i missed
like the direction of the deadshot dial i chose."

HE IS RIGHT AND THE WORD "SOMETIMES" IS THE WHOLE DIAGNOSIS.

--------------------------------------------------------------------------
THE BUG
--------------------------------------------------------------------------
v125 picked the side of the miss like this:

    const side=(err*vel)<0?-1:1;

That is not a direction. It is JUICE.I's EARLY/LATE flag -- angle times
velocity is "was the needle still travelling toward centre", which is a fact
about TIME, not about WHERE THE NEEDLE WAS. So:

    angle +0.3 with the needle sweeping one way   -> round goes LEFT
    angle +0.3 with the needle sweeping the other -> round goes RIGHT

Identical needle position, opposite miss, decided by which way it happened to
be moving. Half the time it agreed with what he saw and half the time it did
not, which is exactly "sometimes".

--------------------------------------------------------------------------
THE FIX, AND THE FILE ALREADY HAD THE ANSWER IN ONE LINE
--------------------------------------------------------------------------
The dial draws its needle at:

    const ang = G.ks ? G.ks.ang : (base + G.angle);      // base = G.faceAng
    ...and on a shot, G.faceAng = tgt.ea

SO THE NEEDLE IS ALREADY POINTING AT A WORLD BEARING: tgt.ea + G.angle. The
round does not need a side, a lateral offset, or a constant to decide left from
right -- IT JUST FLIES ALONG THE BEARING THE NEEDLE WAS POINTING AT. Where he
aimed is where it goes, every time, by construction rather than by a rule that
can disagree.

AND THE RANGE SCALING NOW COMES FREE AND CORRECT. v125 multiplied the sideways
miss by distance with a hand-tuned MISS_RANGE_K, which was me reimplementing arc
length badly. An angular error at the muzzle produces a lateral miss of
r*sin(theta) -- so pointing the round down the needle's bearing gives the exact
real relationship, with no constant at all. A wild release at point blank still
lands near him; the same release across the lot sails. Free physics, and it is
the physics rather than an approximation of it.

MISS_ANGLE_K exists only to keep the magnitudes sane: at K=1 the round flies
exactly where the needle pointed, and since LIM is 60 degrees a maximum error
would throw a round 60 degrees off, which reads as absurd rather than as a bad
shot. K scales the deviation without ever touching its SIGN, so the direction is
identical at any K and only the size is a dial.

DELETED: MISS_LAT and MISS_RANGE_K, which were both approximating what the
bearing gives exactly. MISS_MAX stays as the sanity clamp on lateral distance.

REUSE CHECK: cooks NO graphic pixels. It replaces one geometry function's body
with the bearing the dial already computes for its own needle. No bank is opened
because no art is authored.

TASTE CHECK: authors no art. The taste answer is the one this whole thread has
been circling -- THE FEEDBACK HAS TO AGREE WITH WHAT HE DID. An effect that is
right half the time is worse than none, because it teaches him that the world
does not answer to his input. Nothing here adds HUD, a number or a bar; it makes
an existing effect honest.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V128 THE ROUND GOES WHERE THE NEEDLE WAS POINTING'


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
        print('v128 already in; nothing to do')
        return

    old = """const MISS_LAT=2.4;       /* tiles of sideways miss per unit of dial error [DIAL] */
const MISS_RANGE_K=0.06;  /* ...and how much further out multiplies it     [DIAL] */
const MISS_MAX=4.0;       /* the widest a round can miss by, in tiles      [DIAL] */"""
    new = """/* ===== V128 THE ROUND GOES WHERE THE NEEDLE WAS POINTING =========
   Paolo: "it didnt sometimes go to where i missed like the direction of the
   deadshot dial i chose." SOMETIMES IS THE WHOLE DIAGNOSIS.
   v125 picked the side with `(err*vel)<0?-1:1`, which is not a direction at
   all -- it is JUICE.I's EARLY/LATE flag, and angle-times-velocity asks "was
   the needle still travelling toward centre", a fact about TIME. So the same
   needle position threw the round LEFT or RIGHT depending purely on which way
   it happened to be sweeping. Right half the time.
   THE FILE ALREADY HAD THE ANSWER IN ONE LINE. The dial draws its needle at
   `base + G.angle`, and on a shot base is G.faceAng which IS tgt.ea. The
   needle is already pointing at a world bearing. So the round does not need a
   side or an offset or a constant to tell left from right: IT FLIES ALONG THE
   BEARING THE NEEDLE WAS POINTING AT, by construction.
   AND THE RANGE SCALING IS NOW FREE AND EXACT. MISS_LAT and MISS_RANGE_K were
   me reimplementing arc length badly; an angular error gives a lateral miss of
   r*sin(theta), so the bearing gives the real relationship with no constant.
   Both are DELETED.
   MISS_ANGLE_K only keeps the magnitude sane -- at K=1 the round goes exactly
   where the needle pointed, and LIM is 60 degrees, so a maximum error would
   throw a round 60 degrees off and read as absurd rather than as a bad shot.
   It never touches the SIGN, so the direction is identical at any K. */
const MISS_ANGLE_K=0.55;  /* how much of the dial's own error the round carries [DIAL] */
const MISS_MAX=4.0;       /* the widest a round can miss by, in tiles      [DIAL] */"""
    s = subN(s, old, new)

    old = """function missLandPoint(tgt){
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
  return [tx-uy*lat, ty+ux*lat]; }"""
    new = """function missLandPoint(tgt){
  /* THE NEEDLE'S OWN BEARING. tgt.ea + G.angle is literally the angle the dial
     drew the arm at, so the round cannot disagree with what he was looking at. */
  const err=(G.angle||0);
  let dev=err*MISS_ANGLE_K;
  const d=Math.max(0.8,tgt.edist||6);
  /* keep it a MISS and keep it sane: never so small it lands on him, never so
     wide it reads as spraying. Both bounds are on the lateral distance, which
     is what the eye actually judges, and neither can flip the sign. */
  const minDev=0.35/d, maxDev=Math.asin(Math.min(0.999,MISS_MAX/d));
  const mag=Math.min(maxDev,Math.max(minDev,Math.abs(dev)));
  dev=(err<0?-1:1)*mag;
  const a2=tgt.ea+dev;
  return [Math.cos(a2)*d, Math.sin(a2)*d]; }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v128: the round flies down the needle bearing (%d chars)' % len(s))


if __name__ == '__main__':
    main()
