#!/usr/bin/env python3
"""BOHEMIA - COMBAT v80: SOFT THE WHOLE FIGHT, AND THE LADDER MAKES ROOM.

Paolo: "the music is the best it's ever been. I just think we should just work a
little bit on volumizing and maybe for the pulse mode just forget about it going
hard at five kills, you know, cause I feel like by the end of my combat encounters
it was like a lot of volume fighting each other. So maybe just the pulse mode is
soft the whole time starting at zero kills when combat is beginning to be engaged."

TWO RULINGS, both his, both applied.

--- 1. NO HARD RUNG. SOFT FROM THE FIRST SHOT, ALL THE WAY THROUGH. -----------
The v79 HARD-at-5 rung is gone from AUTO. The floor comes in SOFT the moment
combat is engaged and stays SOFT. His 7/3 rungs at 2 and 4 still carry the climb;
the floor is a floor, not a competitor for the top of the fight.
HARD survives as a manual override so he can still hear the difference on demand,
but nothing ever escalates to it on its own. The button is now three distinct
states with no redundant one: AUTO (soft, always) -> HARD (forced) -> OFF (bare
creeper) -> AUTO.

--- 2. "A LOT OF VOLUME FIGHTING EACH OTHER" IS A REAL, MEASURED DEFECT -------
Counted off the shipped code, voices SCHEDULED PER BAR across his six creepers:

    0 kills   18.2 voices/bar
    2 kills   30.7 voices/bar     (his rung 1 + its klay layer)
    4 kills   52.3 voices/bar     (his rung 2 + its klay layer)
    ------------------------------------------------------------
    2.9x THE VOICE COUNT BY THE END OF A FIGHT, into one master gain that never
    moved, in front of a limiter at -14dB / 6:1.

Nothing was making room for anything. Summed as incoherent sources that is about
+4.6dB by the fourth kill, which is not "the music got bigger", it is the mix
running out of headroom and the limiter clamping the whole track -- and a clamped
limiter ducks EVERY voice, which is exactly what "fighting each other" sounds
like. It is the same failure v70 hit on one voice; this is the whole-mix version.

THE FIX IS WHAT A MIX ENGINEER DOES: as layers arrive, the master TRIMS. The
ladder still grows, by about +1.3dB instead of +4.6dB, so it reads as MORE
INSTRUMENTS rather than MORE LOUD, and the limiter stops being slammed.

    rung 0 (0-1 down)   trim 1.00     reference
    rung 1 (2-3 down)   trim 0.82     absorbs ~1.7dB of the ~2.3dB it added
    rung 2 (4+  down)   trim 0.68     absorbs ~3.3dB of the ~4.6dB it added

The trim RAMPS (setTargetAtTime, 120ms) rather than stepping, so a rung arriving
never clicks. It is applied to the master gain only. It does not touch a single
note, voice, pattern or rung -- song_lock_gate byte-proves that on every run.

REUSE CHECK: no audio assets are cooked, read or written. This is a gain trim on
the existing master node plus a tier rule in the BohemiaPulse core shipped at
v75. Nothing about his 13 approved songs is edited.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_headroom_patch.py
Gate:  node gates/combat_lab_gate.js   (section 16 executes both rulings)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V80 SOFT THE WHOLE FIGHT'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


OLD_TIER = """  var HARD_AT=5;
  function tier(sk){ return ((sk||0)>=HARD_AT)?'hard':'soft'; }"""

NEW_TIER = r"""  /* ===== V80 SOFT THE WHOLE FIGHT (Paolo 7/26, retiring his own V79 top rung)
     "just forget about it going hard at five kills, cause I feel like by the end
     of my combat encounters it was like a lot of volume fighting each other. So
     maybe just the pulse mode is soft the whole time starting at zero kills."
     The floor is a FLOOR. It arrives the moment combat is engaged and it stays
     put; his 7/3 rungs at 2 and 4 carry the climb. HARD is still reachable by
     forcing it, but nothing escalates there on its own. */
  var HARD_AT=Infinity;                 /* V80: never, on AUTO */
  function tier(sk){ return 'soft'; }
  /* THE HEADROOM TRIM. Measured off his own song table: the ladder schedules
     18.2 voices a bar at 0 kills, 30.7 at 2 and 52.3 at 4 -- 2.9x by the end of
     a fight, into one master gain that never moved, in front of a limiter at
     -14dB / 6:1. Summed incoherently that is about +4.6dB of pile-up, and a
     clamped limiter ducks every voice at once, which is what "a lot of volume
     fighting each other" actually sounds like.
     So the master TRIMS as the rungs arrive. The fight still grows, by roughly
     +1.3dB instead of +4.6dB, which reads as MORE INSTRUMENTS rather than MORE
     LOUD. Same thing a mix engineer does, and it touches no note, voice or
     pattern -- only the master gain. */
  var TRIM=[1.00, 0.82, 0.68];
  function rung(sk){ return ((sk||0)>=4)?2:(((sk||0)>=2)?1:0); }
  function headroom(sk){ return TRIM[rung(sk)]; }"""

OLD_RET = """  return { MODES:MODES, kick:kick, hat:hat, back:back, on:on, HARD_AT:HARD_AT,
           gain:gain, mix:mix, cycle:cycle, tier:tier, resolve:resolve }; })();"""
NEW_RET = """  return { MODES:MODES, kick:kick, hat:hat, back:back, on:on, HARD_AT:HARD_AT,
           gain:gain, mix:mix, cycle:cycle, tier:tier, resolve:resolve,
           TRIM:TRIM, rung:rung, headroom:headroom }; })();"""

OLD_CYCLE = "  function cycle(mode){ return mode==='auto'?'soft':(mode==='soft'?'hard':(mode==='hard'?'off':'auto')); }"
NEW_CYCLE = ("  /* V80: SOFT is gone from the cycle because AUTO *is* soft now -- three\n"
             "     distinct states, no redundant one. HARD stays reachable on purpose so he\n"
             "     can still hear what he retired. */\n"
             "  function cycle(mode){ return mode==='auto'?'hard':(mode==='hard'?'off':'auto'); }")


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo, OLD_TIER, NEW_TIER, 'tier + trim')
    demo = sub1(demo, OLD_RET, NEW_RET, 'core exports')
    demo = sub1(demo, OLD_CYCLE, NEW_CYCLE, 'cycle')

    # apply the trim on the master, ramped, only when the rung actually changes
    demo = sub1(demo,
        "  const _pmode=BohemiaPulse.resolve(G.pulse||'auto',_sk);",
        "  const _pmode=BohemiaPulse.resolve(G.pulse||'auto',_sk);\n"
        "  /* V80 HEADROOM: the master makes room as his rungs arrive, so the ladder\n"
        "     reads as more instruments instead of more level. Ramped, never stepped,\n"
        "     so a rung landing does not click. */\n"
        "  { const _rg=BohemiaPulse.rung(_sk);\n"
        "    if(G._mixRung!==_rg){ G._mixRung=_rg;\n"
        "      try{ MAST.gain.setTargetAtTime(0.8*BohemiaPulse.headroom(_sk),AC.currentTime,0.12); }catch(_e){} } }",
        'headroom on the master')

    # a fresh fight starts from full headroom again
    demo = sub1(demo,
        "  G.killStreak=0; G.popTarget=-1; G.fireTarget=-1;",
        "  G.killStreak=0; G.popTarget=-1; G.fireTarget=-1;\n"
        "  G._mixRung=null; try{ MAST.gain.setTargetAtTime(0.8,AC.currentTime,0.12); }catch(_e){}   /* V80: a fresh fight starts from full headroom */",
        'reset headroom on a new encounter')

    # the panel has to stop promising a rung that no longer exists
    demo = sub1(demo,
        'ON AUTO it is one ladder with your 7/3 rungs: '
        'SOFT from the first shot, your hats at 2 down, your bass at 4, and the floor opens to HARD at 5 '
        '(the GROOVE chain counts toward it, so rhythm alone can get you there). Tap to force '
        'SOFT / HARD / OFF instead. OFF is the bare creeper, exactly as approved.',
        'ON AUTO it stays SOFT the whole fight, from the first shot: it is a floor, and your 7/3 '
        'rungs (hats at 2 down, bass at 4) carry the climb on top of it. The master TRIMS as those '
        'rungs arrive, so the fight grows in instruments instead of in volume. Tap to force HARD or '
        'OFF. OFF is the bare creeper, exactly as approved.',
        'panel tells the truth')

    demo = sub1(demo,
        "      G.pulse==='auto'?'soft from the first shot, HARD at '+BohemiaPulse.HARD_AT+' down — your 2 and 4 rungs sit inside it'",
        "      G.pulse==='auto'?'soft the whole fight — your 2 and 4 rungs carry the climb, the master makes room'",
        'readout tells the truth')

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
