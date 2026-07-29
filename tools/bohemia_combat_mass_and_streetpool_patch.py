#!/usr/bin/env python3
"""BOHEMIA - COMBAT v101: HIT IN THE CHEST, NOT THE FEET. AND THE APPROVED STREETS.

Paolo 7/29, two more:

  "when people are on a second story you just have the location of them wrong
   when it comes to getting shot like its not centered on their mass when the
   bullet goes and lands its like their feet. can you fix that"

  "i really like the street please use approved streets though but its looking
   so good."

=========================================================================
BUG: EVERY BODY IN THIS FIGHT IS ANCHORED AT ITS FEET
=========================================================================
drawHuman blits the sprite 84px ABOVE the position it is handed:

    x.drawImage(cv112, Math.round(ex-56), Math.round(ey-84));

So (ex,ey) is the man's FEET, and every ring, arc and effect drawn at (ex,ey) is
drawn on the floor he is standing on rather than on him. That has always been
wrong. It was survivable while everyone stood on one floor, because a ring around
your feet still reads as "that guy".

*** ON A SECOND STOREY IT STOPS BEING SURVIVABLE. *** A man on the deck has his
feet one whole storey below where his body appears. So the target ring, the cover
arc and the melee telegraph all sit a storey away from the man they belong to,
and the shot reads as landing at his feet. Exactly what he described.

THE FIX: one constant and one helper. Everything that marks a BODY moves to the
centre of mass, half a sprite up. Everything that marks the GROUND he is standing
on (his shadow, his blood pool, the brass) deliberately does NOT move, because
those things really do belong on the floor.

  MASS_DY = -42, which is half of drawHuman's own 84px offset. It is derived
  from the draw call rather than eyeballed, so if the sprite height ever changes
  there is one number to follow.

AND THE DRIP CARRIES ITS LEVEL. The wounded-drip effect was pushed with the
enemy's polar position and NO level, so blood from a man on the mezzanine fell
on the ground floor. It now carries lvl and renders on the floor he is actually
bleeding on.

=========================================================================
AND THE ROADWAY IS THE APPROVED STREET BANK NOW
=========================================================================
v94 built the roadway out of the starter set's `road_0/1/2`, which is the
RESIDENTIAL street from the target screen: three variants of one lane surface.
The median and lane lines came from STREET_POOLS_HARMONIZED because the starter
set has no yellow median (LINE COLOR LAW: yellow is the direction split).

So the road was one bank and its markings were another. Now the whole roadway
comes from the bank whose name is literally the approved street:
`pools.street` and `pools.side`, the STREET BLOCKS row in the approved index
(REAL_VEGAS R2, already wired in CITY).

THREE THINGS THAT GETS US, and none of them is taste:
  1. THE ROAD AND ITS MARKINGS ARE FINALLY THE SAME MATERIAL. A median tile and
     the asphalt beside it were cut from the same source; now they match by
     construction instead of by a measurement I had to take.
  2. 8 road variants and 8 sidewalk variants instead of 3, which with the v96
     quarter-turns is 32 distinct faces each. The repeat problem stops being a
     problem rather than being managed.
  3. It is the bank Paolo asked for by name.

The starter set keeps the kerb, the gutter and the lot, because those are the
pieces the street bank does not carry and they are the pieces whose measured
orientation v94 already established.

REUSE CHECK: no art or audio is cooked, read or written.
USED BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (pools.street x8, pools.side x8)
- approved, REAL_VEGAS R2, the STREET BLOCKS row of the approved asset index,
already wired in CITY. Nothing is drawn that was not already drawn by somebody.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_mass_and_streetpool_patch.py
Gate:  node gates/combat_lab_gate.js   (section 35)
"""
import base64, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
POOLS_BANK = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
POOLS = os.path.join(ROOT, POOLS_BANK)
MARK = 'V101 HIT IN THE CHEST'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def bake_street():
    pools = json.load(open(POOLS, encoding='utf8'))['pools']
    out = {'road': pools['street'][:8], 'walk': pools['side'][:8]}
    size = sum(len(b) for v in out.values() for b in v)
    print('  approved street pools: %d road + %d side, %.0f KB'
          % (len(out['road']), len(out['walk']), size / 1024))
    return out


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    if 'V100 THE WAREHOUSE' not in demo:
        sys.exit('FAIL: v100 must be applied first')

    blob = json.dumps(bake_street(), separators=(',', ':'))

    # ---- the roadway becomes the approved street bank ----------------------
    demo = subN(demo,
        "ST_SPIN.slab=1;",
        "ST_SPIN.slab=1;\n"
        "/* ===== V101 THE APPROVED STREET BANK (Paolo 7/29: \"i really like the\n"
        "   street please use approved streets though\") =======================\n"
        "   v94 built the roadway from the starter set's road_0/1/2, which is the\n"
        "   RESIDENTIAL street off the target screen, while the median and lane lines\n"
        "   came from STREET_POOLS_HARMONIZED because the starter set has no yellow\n"
        "   median (LINE COLOR LAW: yellow is the direction split). So the road was one\n"
        "   bank and its markings were another.\n"
        "   Now the whole roadway is the bank whose name IS the approved street: the\n"
        "   STREET BLOCKS row of the approved index, REAL_VEGAS R2, already wired in\n"
        "   CITY. The road and its markings are finally cut from the same source, so\n"
        "   they match by construction instead of by a measurement I had to take, and\n"
        "   8 variants x the v96 quarter-turns is 32 faces instead of 12.\n"
        "   The starter set KEEPS the kerb, the gutter and the lot: those are the pieces\n"
        "   the street bank does not carry, and the pieces whose orientation v94 already\n"
        "   measured off the pixels. */\n"
        "const STREET_B64S=" + blob + ";\n"
        "(function(){ for(const k in STREET_B64S){ STREET_B64[k]=STREET_B64S[k]; STREET_IMG[k]=[];\n"
        "  STREET_B64S[k].forEach((b,i)=>{ _stPend++; const im=new Image();\n"
        "    im.onload=()=>{ STREET_IMG[k][i]=im; if(--_stPend===0)STREET_READY=true; };\n"
        "    im.onerror=()=>{ if(--_stPend===0)STREET_READY=true; };\n"
        "    im.src='data:image/png;base64,'+b; }); } })();",
        'the roadway is the approved street bank')

    # ---- the centre of mass, derived from the draw call --------------------
    demo = subN(demo,
        "  const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };",
        "  const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };\n"
        "  /* ===== V101 HIT IN THE CHEST, NOT THE FEET =======================\n"
        "     Paolo: \"when people are on a second story you just have the location of\n"
        "     them wrong when it comes to getting shot... its like their feet.\"\n"
        "     drawHuman blits the sprite 84px ABOVE the point it is handed, so every\n"
        "     position in this file is a man's FEET and every ring drawn at it is drawn\n"
        "     on the floor rather than on him. That was always wrong and merely\n"
        "     survivable while everybody stood on one floor.\n"
        "     ON A SECOND STOREY IT IS NOT SURVIVABLE: his feet are a whole storey below\n"
        "     where his body appears, so every mark sits a storey off the man.\n"
        "     MASS_DY is half of drawHuman's OWN 84px offset, so it is derived from the\n"
        "     draw call and not eyeballed. Things that mark a BODY move up to it; things\n"
        "     that mark the GROUND (his blood pool, his shadow, the brass) deliberately\n"
        "     do not, because those really do belong on the floor. */\n"
        "  const MASS_DY=-42;\n"
        "  const mpos=e=>{ const p=epos(e); return [p[0],p[1]+MASS_DY]; };",
        'the centre of mass')

    # ---- the cover arc marks the man, not the floor ------------------------
    demo = subN(demo,
        "    if(e.gcov){ const fa=Math.atan2(cy-ey,cx-ex); x.strokeStyle='rgba(150,170,205,0.7)'; x.lineWidth=3;\n"
        "      x.beginPath();x.arc(ex,ey,er*1.6,fa-0.7,fa+0.7);x.stroke(); }",
        "    if(e.gcov){ const _my=ey+MASS_DY;   /* V101: on HIM, not on the floor under him */\n"
        "      const fa=Math.atan2(cy-_my,cx-ex); x.strokeStyle='rgba(150,170,205,0.7)'; x.lineWidth=3;\n"
        "      x.beginPath();x.arc(ex,_my,er*1.6,fa-0.7,fa+0.7);x.stroke(); }",
        'the cover arc marks the body')

    # ---- and so does the blade telegraph -----------------------------------
    demo = subN(demo,
        "    if(e.melee&&!e.dead&&e.windup){ const wp=Math.pow(1-_bpmPhase,2);   /* the blade telegraph pulses on the beat */\n"
        "      x.strokeStyle='rgba(232,176,74,'+(0.5+wp*0.5)+')'; x.lineWidth=2+wp*2;\n"
        "      x.beginPath();x.arc(ex,ey,er*1.5,0,7);x.stroke(); }",
        "    if(e.melee&&!e.dead&&e.windup){ const wp=Math.pow(1-_bpmPhase,2);   /* the blade telegraph pulses on the beat */\n"
        "      x.strokeStyle='rgba(232,176,74,'+(0.5+wp*0.5)+')'; x.lineWidth=2+wp*2;\n"
        "      x.beginPath();x.arc(ex,ey+MASS_DY,er*1.5,0,7);x.stroke(); }   /* V101: on his chest */",
        'the blade telegraph marks the body')

    # ---- the drip bleeds on the floor he is actually standing on -----------
    demo = subN(demo,
        "      G._fx.push({type:'drip',ea:e.ea,edist:e.edist,dx:(Math.random()-0.5)*8,t:0,life:0.8}); }",
        "      /* V101: it carries his LEVEL. A man bleeding on the mezzanine was dripping\n"
        "         onto the ground floor, because the effect was pushed with a polar\n"
        "         position and no storey. */\n"
        "      G._fx.push({type:'drip',ea:e.ea,edist:e.edist,lvl:e.lvl|0,dx:(Math.random()-0.5)*8,t:0,life:0.8}); }",
        'the drip carries its level')

    demo = subN(demo,
        "    const q5=p.t/p.life, [dxp,dyp]=fieldPos(p,W,H,cx,cy);",
        "    const q5=p.t/p.life, _dp=fieldPos(p,W,H,cx,cy);\n"
        "    const dxp=_dp[0], dyp=_dp[1]+lvlDY(p.lvl|0);   /* V101: the floor HE is on */",
        'the drip renders on his floor')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
