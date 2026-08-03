#!/usr/bin/env python3
"""
THE DOOR SWINGS WHEN YOU GO THROUGH IT (8/2/26).

Paolo: "WHY IS THERE NO ANIMATIONS WHEN I GO THROUGH AND OPEN A DOOR WEVE WORKED
ON THAT PREVIOUSLY."

He was right that we worked on it. banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt is
12.1 MB, 30 approved clips, and it carries his own style verdict:

    "PAOLO STYLE VERDICT: industrial door #0 = rollup; ALL other approved doors =
     double swing. Alpha-true leaf floors; per-clip gates: full-opening residue +
     frame-freeze. 9 frames / 2 beats / 120 BPM."

Measured in the shipped renderer before this: ZERO frames present. Sixth
approved-but-unused defect (border walls 7/28, the bought sidewalk 7/31,
footsteps 7/31, traffic signals 8/1, E/W doors, this).

WHICH CLIPS, AND WHY IT IS A WIRING JOB AND NOT A REBUILD.
The bank is mixed: 17 clips are the industrial pack at 176x176 (a DOUBLE door,
2 cells wide by 2 tall) and 3 are 88x88 single-leaf. The pack that matters here is
"4. Doors and entrances" -- TEN swing clips, nine frames each, at 88x176.

    88x176 is EXACTLY the plate the door already draws.

IN_DOOR_B64, the static door this game has been blitting since the 8/2 doorfill
fix, is 88x176. So these clips are the animated version of the very same door, at
the very same size, and they drop onto the existing slot with no scaling and no
geometry change. 90 frames, 2.54 MB.

HIS TIMING IS HIS, NOT MINE: 9 frames over 2 beats. BEAT is 500ms at the 120 BPM
law, so the swing runs 1000ms and the frame index is driven off the same clock the
rest of the game quantises to, never a wall-clock guess.

WHERE IT FIRES: inEnter() is the single place a body actually goes through a door
-- it is what the doorway rule now funnels every entry through. One anchor.

THE DOOR THAT SWINGS IS THE DOOR THAT WAS STANDING THERE: the clip is picked by
the same seed the static plate is picked by, so the leaf that opens is the leaf
you were looking at.

REUSE CHECK: cooks no graphic pixels. Every frame is lifted verbatim from
banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, the pack whose size already matches the
door plate. Nothing is re-cooked, resized or recoloured.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import json
import re
import struct
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt'
MARKER = '__DOOR_SWINGS__'

ANCHOR = """  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};
  advance(0.5); return true;"""


def main():
    bank = json.load(open(BANK))
    clips = {k: v for k, v in bank['clips'].items()
             if v.get('pack') == '4. Doors and entrances'}
    if not clips:
        print('FAIL: the 88x176 residential swing pack is not in the bank'); return 1
    for k, v in clips.items():
        b = base64.b64decode(v['frames'][0])
        if struct.unpack('>II', b[16:24]) != (88, 176):
            print('FAIL: %s is not 88x176 -- it would not match the door plate' % k); return 1

    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the door already swings'); return 0
    if city.count(ANCHOR) != 1:
        print('FAIL: the inEnter tail is not where this tool expects it'); return 1
    if 'const IN_DOOR_B64' not in city:
        print('FAIL: the static door plate this animates is missing'); return 1

    frames = [v['frames'] for _, v in sorted(clips.items())]

    decl = ("\n/* " + MARKER + " -- HIS 7/13 DOOR SWING, ON THE DOOR HE WALKS THROUGH.\n"
            "   \"WHY IS THERE NO ANIMATIONS WHEN I GO THROUGH AND OPEN A DOOR WEVE WORKED\n"
            "    ON THAT PREVIOUSLY.\" He was right that we made it: 30 approved clips sat in\n"
            "   banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt and ZERO frames had ever reached a\n"
            "   renderer. These ten are the \"4. Doors and entrances\" swing pack at 88x176 --\n"
            "   EXACTLY the plate IN_DOOR_B64 already blits, so the animated door is the same\n"
            "   door at the same size with no scaling and no geometry change.\n"
            "   HIS TIMING, from the bank: 9 frames / 2 beats / 120 BPM. BEAT is 500ms, so the\n"
            "   swing runs 1000ms off the same clock everything else quantises to. */\n"
            "const DOOR_ANIM=" + json.dumps(frames, separators=(',', ':')) + ";\n"
            "const DOOR_ANIM_IMG=DOOR_ANIM.map(function(cl){ return cl.map(function(b){\n"
            "  const im=new Image(); im.src='data:image/png;base64,'+b; return im; }); });\n"
            "let DOORSWING=null;   /* {clip, t0, gx, gy} while a door is opening */\n"
            "function doorSwing(seed,gx,gy){\n"
            "  if(!DOOR_ANIM_IMG.length)return;\n"
            "  /* the door that SWINGS is the door that was STANDING there: same seed, so the\n"
            "     leaf that opens is the leaf he was looking at. */\n"
            "  DOORSWING={clip:(seed>>>0)%DOOR_ANIM_IMG.length,t0:performance.now(),gx:gx,gy:gy};\n"
            "}\n"
            "function doorSwingDraw(ox,oy,C){\n"
            "  if(!DOORSWING)return 0;\n"
            "  const cl=DOOR_ANIM_IMG[DOORSWING.clip]; if(!cl){ DOORSWING=null; return 0; }\n"
            "  const DUR=BEAT*2;                       /* 9 frames / 2 beats, his ruling */\n"
            "  const u=(performance.now()-DOORSWING.t0)/DUR;\n"
            "  if(u>=1){ DOORSWING=null; return 0; }\n"
            "  const im=cl[Math.min(cl.length-1,Math.floor(u*cl.length))];\n"
            "  if(!im||!im.complete||!im.naturalWidth)return 0;\n"
            "  const dx=Math.round(ox+DOORSWING.gx*C), dy=Math.round(oy+DOORSWING.gy*C);\n"
            "  g.drawImage(im,dx,dy-C,C,C*2);          /* the same 1-wide 2-tall slot */\n"
            "  window.__DOOR_SWING_FRAMES=(window.__DOOR_SWING_FRAMES||0)+1;\n"
            "  return 1;\n"
            "}\n")

    new_tail = (ANCHOR.replace("  advance(0.5); return true;",
                "  /* " + MARKER + " -- inEnter is the ONE place a body goes through a door,\n"
                "     which is exactly what the 8/2 doorway rule funnels every entry through. */\n"
                "  try{ doorSwing((tgtX*73856093)^(tgtY*19349663),tgtX,tgtY); }catch(_e){}\n"
                "  advance(0.5); return true;"))

    hook_old = "  shadowPass(ox,oy,C);"
    if city.count(hook_old) != 1:
        print('FAIL: the ground-layer hook is not unique'); return 1

    city = city.replace("const IN_DOOR_B64", decl + "const IN_DOOR_B64", 1)
    city = city.replace(ANCHOR, new_tail, 1)
    city = city.replace(hook_old, hook_old + "\n  doorSwingDraw(ox,oy,C);   /* " + MARKER + " */", 1)

    for nm in ('function doorSwing(', 'function doorSwingDraw(', 'doorSwingDraw(ox,oy,C);'):
        if city.count(nm) != 1:
            print('FAIL: post-edit %s count %d' % (nm, city.count(nm))); return 1

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    print('wrote %s' % ALPHA)
    print('  %d of his approved swing clips, %d frames, embedded at 88x176'
          % (len(frames), sum(len(c) for c in frames)))
    print('  the door swings when you walk through it, 9 frames over 2 beats')
    return 0


if __name__ == '__main__':
    sys.exit(main())
