#!/usr/bin/env python3
"""V115 THE CRASH I SHIPPED: DIAL_GONE READ BEFORE IT EXISTED.

Paolo, with a screenshot of a black screen and one red line:
    ERR ReferenceError: Cannot access 'DIAL_GONE' before initialization.
"Shit got fucked."

HE IS RIGHT AND IT IS ENTIRELY MINE. v114 declared

    const DIAL_GONE=(_df<=0.03);

immediately above the dial's band block -- but the line that USES it,

    drawField(ctx,W,H,cx,cy,{dial:true,zb:zb,gone:DIAL_GONE});

sits about 1,500 characters EARLIER in the same function. `const` has a
temporal dead zone, so reading it before its declaration is a hard
ReferenceError, every frame, and the whole demo goes black.

THE FIX IS THE ONE-LINE ONE: the declaration moves up to sit immediately
after `_df`, which is what it is derived from and which is already declared
before drawField. Nothing else changes.

--------------------------------------------------------------------------
AND THE REAL FAILURE IS THAT MY GATE PASSED IT
--------------------------------------------------------------------------
620 checks green. The suite runs `node --check` on every script body in the
demo, which proves the file PARSES -- and a temporal dead zone error is
perfectly valid syntax. It proves nothing about whether the thing RUNS.

A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and "the demo renders a frame
without throwing" had no gate at all. Ten versions of drawing work in this
lane and the one thing nobody was checking was whether draw() survives being
called. That gate ships in this same turn (combat_lab_gate section 0B: boot
the real alpha headless, open the combat tab, run real frames, and fail on
ANY pageerror or console error). It would have caught this in seconds, and it
will catch the next one.

REUSE CHECK: cooks NO graphic pixels. It moves one declaration. No bank is
opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V115 DECLARED BEFORE IT IS READ'


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
        print('v115 already in; nothing to do')
        return

    DECL = "  const DIAL_GONE=(_df<=0.03);\n"
    if DECL not in s:
        sys.exit('v114 declaration not found -- refusing to guess')

    # 1. delete the misplaced declaration
    s = subN(s, DECL, "")

    # 2. put it immediately after _df, which is what it reads and which is
    #    already declared before the drawField call that consumes it.
    old = """  const _df=(G._freezeT>0)?0:((G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1);"""
    new = """  const _df=(G._freezeT>0)?0:((G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1);
  /* ===== V115 DECLARED BEFORE IT IS READ ============================
     v114 declared this down beside the dial's band block -- roughly 1,500
     characters BELOW the drawField call that passes it in. `const` has a
     temporal dead zone, so that read threw ReferenceError every frame and
     the whole demo went black. Paolo screenshotted it.
     It belongs HERE, next to the _df it is derived from and above every
     use, which is the only ordering that can be correct.
     THE GATE PASSED IT, and that is the bigger failure: `node --check`
     proves a file PARSES and a temporal dead zone is valid syntax. The
     runtime smoke gate that would have caught this in seconds ships in the
     same turn as this fix. */
  const DIAL_GONE=(_df<=0.03);"""
    s = subN(s, old, new)

    # 3. prove the ordering in the shipped text itself
    if s.index('const DIAL_GONE=') > s.index('{dial:true,zb:zb,gone:DIAL_GONE}'):
        sys.exit('STILL USED BEFORE DECLARED -- refusing to ship')

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v115: DIAL_GONE now declared above every use (%d chars)' % len(s))


if __name__ == '__main__':
    main()
