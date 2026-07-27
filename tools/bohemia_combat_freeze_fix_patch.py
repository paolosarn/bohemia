#!/usr/bin/env python3
"""BOHEMIA - COMBAT v82: THE KILL FREEZE WAS WIRED TO THE WRONG TIER.

Paolo, after playing v81: "I didn't notice time stopping for a whole second or
whatever."

HE IS RIGHT AND IT IS MY ERROR. v81 shipped the tier table correctly, gated it,
proved the seconds drained, proved the music ran through it -- and then wired the
KILL tier to the two places he would almost never be, while the actual killshot
got the WEAPON tier.

--- THE BUG, EXACTLY ------------------------------------------------------
`startKillshot()` is only ever called after `sndKill()`. It IS the kill
cinematic, so EVERY bullet contact inside `G.ks` is a kill by construction. At
that contact v81 called:

    freeze(BohemiaFreeze.WPN[WEAPON]||'graze', ...)

which is a SIXTEENTH NOTE (0.125s) for a pistol or SMG. Meanwhile `freeze('kill')`
-- the whole beat, the headline of the entire feature -- only fired from
`finishHim` (the manual execution of a downed man) and from the bullet that kills
YOU. Neither is what he does when he shoots somebody.

So the thing he was told to go feel was 0.125 seconds, inside a killshot cinematic
that already runs 0.55 to 2.8 seconds of its own slow motion. Of course he felt
nothing. The freeze was four times too short AND buried inside a longer effect.

MY GATE DID NOT CATCH IT because it verified the TABLE and never verified the
WIRING: it asserted that a kill tier is one beat, and never asserted that a kill
fires the kill tier. That is the exact difference between testing a value and
testing a path, and it is the same class of miss as measuring a song per pattern
and calling it per bar.

--- THE FIX ---------------------------------------------------------------
1. A KILLSHOT FIRES THE KILL TIER. One whole beat, every time, and TWO beats when
   it is the last man standing (the cinematic already knows -- `ks.last`). The
   weapon no longer sets the duration on a kill; it still colours the SHAKE, which
   is what "the freeze says what killed him" (V43) actually needs.
2. THE WEAPON TIER STILL EXISTS for a contact that does NOT kill, so a graze and
   a heavy hit still read differently. It just is not what a kill uses.
3. THE FREEZE LANDS BEFORE THE CINEMATIC'S OWN SLOW MOTION, not inside it: the
   world goes dead still at the instant of contact -- the bullet stops in the air,
   the blood burst hangs -- and then the cinematic resumes. That is Vlambeer's
   "sleep", at beat length, which is the version that reads as impact instead of
   as a hitch.

--- AND THE GATE NOW TESTS THE PATH, NOT THE TABLE ------------------------
Section 17 gains assertions that the KILL tier is fired FROM the kill path and
that no kill can resolve on a weapon-tier freeze. A table that is correct and
unreachable is worth nothing, and the gate that only checks the table would have
passed this bug forever.

REUSE CHECK: no art or audio assets are cooked, read or written. This is a tier
argument at one call site plus the gate that should have caught it. His songs are
untouched (song_lock_gate proves it every run).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_freeze_fix_patch.py
Gate:  node gates/combat_lab_gate.js
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V82 A KILL FIRES THE KILL TIER'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo,
        "      /* V81: the stop is scaled to the weapon (the literature's rule) but every\n"
        "         value is a NOTE VALUE -- light guns a sixteenth, heavy guns an eighth. */\n"
        "      if(JUICE.F){ const _ax=Math.cos(ang), _ay=Math.sin(ang);\n"
        "        freeze(BohemiaFreeze.WPN[WEAPON]||'graze',_ax,_ay); }",
        "      /* V82 A KILL FIRES THE KILL TIER. Paolo after v81: \"I didn't notice time\n"
        "         stopping for a whole second or whatever\" -- and he was right, because\n"
        "         THIS line was the bug. startKillshot() is only ever called after\n"
        "         sndKill(), so every contact in here is a KILL by construction, and v81\n"
        "         handed it the WEAPON tier: a SIXTEENTH (0.125s) for a pistol, buried\n"
        "         inside a cinematic that already runs 0.55-2.8s of its own slow motion.\n"
        "         Four times too short and hidden inside a longer effect.\n"
        "         A kill is ONE WHOLE BEAT. The last man standing is TWO -- the cinematic\n"
        "         already knows which one this is. The weapon no longer sets the duration\n"
        "         here; it still colours the SHAKE, which is what V43's \"the freeze says\n"
        "         what killed him\" actually needs. */\n"
        "      if(JUICE.F){ const _ax=Math.cos(ang), _ay=Math.sin(ang);\n"
        "        const _hv={pistol:0.8,smg:0.7,rifle:1.15,shotgun:1.45}[WEAPON]||1;\n"
        "        freeze(ks.last?'last':'kill',_ax*_hv,_ay*_hv); }",
        'kill fires the kill tier')

    # ---- AND THE REAL REASON HE FELT NOTHING ----------------------------
    # MEASURED on the real surface with screenshots: during a killshot freeze,
    # 27% of the screen was still changing every 90ms, against 30% while running.
    # The freeze was halting the SIMULATION and not the PICTURE.
    # The cause is V67 ONE CLOCK doing its job too well: _bpmClock is set from the
    # AUDIO clock every frame, BEFORE the freeze is applied, and it drives the body
    # bob, the floor pulse, the kick pulse and the dial. So the whole screen kept
    # breathing on the beat while the world was supposed to be stopped.
    # THE FIX: hold the VISUAL beat clock for the length of the freeze. The AUDIO
    # is untouched -- the song keeps playing, which was always the point -- but the
    # picture stops dead and snaps back onto the true audio position on release.
    demo = sub1(demo,
        "  if(G._freezeT>0){ G._freezeT=Math.max(0,G._freezeT-dt); if(G._shk)G._shk.t+=dt; dt=0; }\n"
        "  else if(G._shk){ G._shk=null; }",
        "  if(G._freezeT>0){\n"
        "    /* V82 HOLD THE PICTURE, NOT JUST THE SIM. Measured: 27% of the screen was\n"
        "       still moving during a freeze because _bpmClock rides the AUDIO clock and\n"
        "       drives the bob, the floor pulse and the kick pulse. The audio is left\n"
        "       alone (the song must play through the stop); the VISUAL beat clock holds\n"
        "       and snaps back onto the true audio position when the freeze releases. */\n"
        "    if(G._freezeClock==null)G._freezeClock=_bpmClock;\n"
        "    _bpmClock=G._freezeClock; _bpmPhase=(_bpmClock%BPM_MS)/BPM_MS;\n"
        "    G._freezeT=Math.max(0,G._freezeT-dt); if(G._shk)G._shk.t+=dt; dt=0; }\n"
        "  else { G._freezeClock=null; if(G._shk)G._shk=null; }",
        'hold the visual beat clock')

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
