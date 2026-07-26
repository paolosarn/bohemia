#!/usr/bin/env python3
"""BOHEMIA - COMBAT v70: THE 808 IS THE HERO, AND THE RINGS GO QUIET.

Two rulings from Paolo, 7/26:

1. "I kind of like those visuals that you added... how about you turn the
   opacity down by 75% so they're like barely visible but like still there."
   -> the approach ring and its snap flash keep exactly 25% of their alpha.
   Barely there, still there. Nothing else about them changes.

2. "Are you sure the beat one, the hero part, the instrument that I'm fucking
   with, which is probably the 808 or the bass, is twice as loud? Should it be
   like three times as loud. Just the voice."

   He is right twice over, and the second reason is the one that mattered:

   a) 2x AMPLITUDE IS NOT TWICE AS LOUD. Doubling amplitude is +6dB, and the
      long-standing psychoacoustic rule is that a doubling of PERCEIVED loudness
      takes about +10dB. So the v63 "hero beat" bass at 2x read as roughly 1.5x,
      never as double. 3x amplitude is +9.5dB -- that is the number that
      actually sounds twice as loud. His ear was right.
   b) AND THE LIMITER WAS EATING IT. There is a compressor on the master
      (threshold -14dB, ratio 6:1). On step 0 the hero beat ALSO fires a second
      kick and a sub boom, and those two transients slam the limiter at exactly
      the moment the bass note starts -- so the limiter ducked the very note
      that was supposed to be the hero. Turning the bass up alone would have
      been partly squashed away, which is very likely why "twice as loud" never
      sounded twice as loud.

   So: the bass voice goes to 3x (his call, and the correct number), AND the
   doubled drums on step 0 are routed through their own gain at 0.55 so they
   stop stealing the headroom from the voice they are supposed to be announcing.
   "Just the voice" is exactly what gets louder.

REUSE CHECK: no graphic pixels and no new audio assets are cooked (an alpha
multiplier, a gain value, and one gain node on the existing drum path).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_hero808_patch.py
Gate:  node gates/combat_lab_gate.js   (section 10)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V70 HERO 808'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # -----------------------------------------------------------------------
    # 1. THE RINGS AT A QUARTER (Paolo: "turn the opacity down by 75%")
    # -----------------------------------------------------------------------
    demo = sub1(demo,
        "    const _a=(_hero?0.42:0.24)*(0.35+0.65*_f);",
        "    const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.25;   /* V70 (Paolo): 75% down. Barely visible, still there. */",
        'ring alpha')

    demo = sub1(demo,
        "    if(_snap>0){ ctx.strokeStyle=(Math.floor(_b)%4===0?'rgba(255,226,150,':'rgba(230,238,250,')+(_snap*0.85)+')';",
        "    if(_snap>0){ ctx.strokeStyle=(Math.floor(_b)%4===0?'rgba(255,226,150,':'rgba(230,238,250,')+(_snap*0.2125)+')';   /* V70: the snap goes down the same 75% */",
        'snap alpha')

    # -----------------------------------------------------------------------
    # 2. THE 808 IS THE HERO: 3x on the voice, and give it the headroom
    # -----------------------------------------------------------------------
    demo = sub1(demo,
        "    const _bi=(f.inst&&f.inst.b)||'osc'; const _db=(s===0)?2:1;   /* V63 HERO BEAT: beat one bass hits double */",
        """    /* V70 HERO 808 (Paolo: "should it be like three times as loud. Just the
       voice"). He is right, twice: 2x amplitude is only +6dB and a DOUBLING OF
       PERCEIVED LOUDNESS takes about +10dB, so the v63 double read as ~1.5x and
       never as double. 3x is +9.5dB -- the number that actually sounds twice as
       loud. See also the drum ducking on step 0 below: the limiter was eating
       the boost before it ever reached his ear. */
    const _bi=(f.inst&&f.inst.b)||'osc'; const _db=(s===0)?3:1;   /* V70 HERO 808: the VOICE is the hero, at 3x */""",
        'hero bass gain')

    demo = sub1(demo,
        "  if(f.kick.includes(s)||(sc.fill&&s>=12)){ drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t); if(s===0){ drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t); drumV('boom',AC,MAST,t); } }",
        """  if(f.kick.includes(s)||(sc.fill&&s>=12)){ drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t);
    /* V70 HERO 808: the doubled kick and the sub boom used to hit the master
       limiter (-14dB, 6:1) at the exact instant the hero bass note started, so
       the limiter ducked the very note it was announcing. They keep the double
       -- they just stop stealing the voice's headroom. */
    if(s===0){ let _hd=MAST; try{ _hd=AC.createGain(); _hd.gain.value=0.55; _hd.connect(MAST); }catch(_e){ _hd=MAST; }
      drumV((f.kit&&f.kit.k)||'punchk',AC,_hd,t); drumV('boom',AC,_hd,t); } }""",
        'hero drum headroom')

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
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
