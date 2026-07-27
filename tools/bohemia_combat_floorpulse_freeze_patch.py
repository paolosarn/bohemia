#!/usr/bin/env python3
"""BOHEMIA - COMBAT v84: THE BROWN BOX IS THE FLOOR PULSE, AND I WELDED IT ON.

Paolo, twice: "the brown box is absolutely still there and the dead shot dial
orange part is still there like what's wrong with you bro."

I FOUND IT, AND I CAUSED IT.

--- THE ACTUAL BUG --------------------------------------------------------
JUICE.B FLOOR PULSE fills THE ENTIRE CANVAS with the faction's accent colour,
once a beat, at an alpha driven by the beat phase:

    const pb = Math.pow(1-_bpmPhase, FLOORPULSE.curve) * (...);
    if(pb>0.004){ x.fillStyle=f.acc; x.globalAlpha=pb; x.fillRect(0,0,W,H); }

And the faction accents are ORANGE-BROWNS: #d07a2a, #b8642a, #caa05a, #d8a23a,
#caa83a. A full-screen wash in those colours IS the brown box, and it is very
probably also the "orange from the dial" -- one effect, two complaints.

THEN I MADE IT PERMANENT. In v82, to stop the screen breathing during the freeze,
I PINNED the visual beat clock:

    if(G._freezeClock==null)G._freezeClock=_bpmClock;
    _bpmClock=G._freezeClock; _bpmPhase=(_bpmClock%BPM_MS)/BPM_MS;

`pb` is a function of `_bpmPhase`. Pinning the phase pins the pulse. So whatever
brightness the accent wash happened to have at the instant of the kill, it now
HOLDS THERE for the entire half-second of the freeze -- and if the freeze started
just after a downbeat, (1-phase) is near 1 and it holds at MAXIMUM.

Before v82 the wash at least decayed within the beat. After v82 it is a solid
orange-brown sheet over the whole screen for exactly as long as the pause lasts,
which is exactly the frame he screenshotted and exactly what he has now told me
three times.

--- THE FIX ---------------------------------------------------------------
THE FLOOR PULSE DOES NOT DRAW WHILE THE WORLD IS FROZEN. The pulse is the
metronome made visible ("the ground is the metronome"); a pulsing ground during a
dead stop is a contradiction, and the whole point of the freeze is that everything
holds. So the stop is silent on the floor too.

This is one condition, at the one place that draws it. It does not touch the
pulse's behaviour during normal play, which is his approved 120 BPM floor.

--- WHY THE PREVIOUS THREE ATTEMPTS MISSED IT -----------------------------
v81/v82/v83 were all reasoning about code that was never watched running, because
my own harness kept freezing the cinematic in order to photograph it -- the
instrument was stopping the thing it was measuring. Letting the killshot RUN and
photographing it at 60ms intervals showed the frame immediately: at ks.t=0.11 the
entire playfield is a flat orange-brown sheet, where the same field in the aim
phase is dark blue-grey.

REUSE CHECK: no art or audio assets are cooked, read or written. One condition on
one existing fill.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_floorpulse_freeze_patch.py
Gate:  node gates/combat_lab_gate.js   (section 19)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V84 THE STOP IS SILENT ON THE FLOOR TOO'


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
        "    if(pb>0.004){x.fillStyle=f.acc;x.globalAlpha=pb;x.fillRect(0,0,W,H);x.globalAlpha=1;} }",
        "    /* V84 THE STOP IS SILENT ON THE FLOOR TOO. This fill covers the ENTIRE\n"
        "       canvas with the faction accent, and every accent is an orange-brown\n"
        "       (#d07a2a, #b8642a, #caa05a, #d8a23a). It is Paolo's brown box.\n"
        "       And v82 WELDED IT ON: pinning _bpmPhase to stop the screen breathing\n"
        "       during a freeze also pins pb, which is a function of that phase -- so\n"
        "       the wash held at whatever brightness it had, at MAXIMUM if the kill\n"
        "       landed just after a downbeat, for the entire freeze.\n"
        "       The pulse is the metronome made visible; a pulsing ground during a dead\n"
        "       stop is a contradiction. While the world is frozen, the floor is too. */\n"
        "    if(pb>0.004&&!(G._freezeT>0)){x.fillStyle=f.acc;x.globalAlpha=pb;x.fillRect(0,0,W,H);x.globalAlpha=1;} }",
        'floor pulse silent while frozen')

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
