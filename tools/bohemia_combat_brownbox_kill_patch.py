#!/usr/bin/env python3
"""BOHEMIA - COMBAT v85: THE BROWN BOX AND THE ORANGE ONE, NAMED IN A CAPTURED FRAME.

Paolo, five times: "Brown box still their kill shot orange box doesnt fade away bro."

Five fixes, five misses, because every one of them was a theory. This one is not.

--- THE REPRODUCTION (this had to come first) ------------------------------
scratchpad/spot.js hooks fillRect / drawImage / arc+fill / arc+stroke, converts
every draw into SCREEN space through ctx.getTransform(), lets the kill cinematic
RUN untouched, and dumps every draw that lands on the body at the exact frame the
world stops. Two things came back, and they are his two complaints, by name:

  THE BROWN BOX    fillRect  rgba(70,60,50,0.984)   @197,272   42x50
  THE ORANGE ONE   arcFill   rgba(255,200,70,0.55)  @197,237   9x9 + glow + trails

Everything before this measured raw fillRect ARGUMENTS, so a 6*S x 7*S square
inside a 3x camera zoom read as tiny and got filtered out by my own thresholds,
and the dial is drawn with STROKES so every fill-only probe was blind to it. The
instrument was the bug, not the theory.

--- 1. THE BROWN BOX ------------------------------------------------------
drawKillshotWorld draws this, and it has carried Paolo's own note since 7/3/26:

    /* LEGACY_PRE_REVAMP (3): the TRANSLUCENT SQUARE. Pre-revamp stand-in
       body that still drops/fades ON TOP of the real sprite death playing
       underneath. Paolo flagged it 7/3/26: fine for now, delete at cleanup. */
    c.fillStyle='rgba(70,60,50,'+(1-ip*0.8)+')';
    px(c,tx-3*S,ty-5*S+ip*9*S,6*S,7*S);

At contact ip=0, so its alpha is 1.0 -- not translucent at all, a SOLID brown
slab. And the quantized freeze holds ks.t still, so ip stays 0 and the slab holds
at full opacity for the entire stop. That is the frame he screenshotted.

IT IS ALSO WHY HE HAS ASKED THREE TIMES FOR THE HEADSHOT ANIMATION TO START. The
comment says it: the real sprite death is ALREADY PLAYING UNDERNEATH. The clip was
never missing. A placeholder square was parked on top of it. Deleting the square
is the same single edit as starting the animation -- one line, both complaints.

DELETED. "Cleanup" is now.

--- 2. THE ORANGE ONE -----------------------------------------------------
The GHOST CHIP (JUICE.T): the gold experience mote, ghostRGB(1) = 255,200,70, that
arcs from the body into your fire-button corner. It spawns AT CONTACT -- the same
instant the freeze starts -- and its flight is driven by p.t, which advances on
dt, and dt is 0 during a freeze. So the payout hangs there, gold, glowing, welded
to the corpse, for the whole pause. "Doesn't fade away" is literally correct.

THE PAYOUT ARRIVES WHEN THE WORLD MOVES AGAIN. It does not draw while time is
stopped. The stop belongs to the kill; the reward comes after it. Same shape as
v84's floor-pulse fix, and it covers the double-tap chip for free.

--- 3. THE STOP IS A STILL, INCLUDING THE BODY ----------------------------
The death clip is stepped off performance.now(), which does not care about the
freeze, so the corpse was falling through frames during a dead stop. Now the body
reads visNow(): wall clock normally, PINNED to the instant the freeze began while
the world is held. Impact, hold, THEN the fall -- which is the entire point of the
hitstop, and it is what makes the headshot fall read as a fall instead of a smear.

And the pause is PAID BACK. Pinning alone is half a fix: _deadAt is raw wall time,
so the instant the world moved the clip snapped to wherever the wall clock had
got to. Measured with scratchpad/deathprobe.js: frame 0 held correctly through the
stop, then jumped straight to frame 4 of 12 -- the drop was three frames in before
you saw it move. Every body timestamp now advances by exactly the frozen duration
on release, so the clip is continuous across the stop.

MEASURED (scratchpad/deathprobe.js, 12-frame death clip, half-beat stop, 120ms
samples -- the FRAME INDEX the target's own clip resolves to, each sample):
  before   ALIVE 0 [0 0 0 0 held] --release--> 4 5 6 7 8 9 9 10 11   <- JUMPS 0->4
  after    ALIVE 0 [1 1 1 1 held] --release--> 1 2 3 3 4 5 6 7 8 8 9 10 11

REUSE CHECK: no art or audio assets are cooked, read or written. This deletes one
placeholder fill, gates one existing fx draw, and pins one existing clock.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_brownbox_kill_patch.py
Gate:  node gates/combat_lab_gate.js   (section 19)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V85 THE PLACEHOLDER SLAB IS DELETED'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- 1. the brown box: delete the placeholder slab -----------------------
    demo = sub1(demo,
        "    /* LEGACY_PRE_REVAMP (3): the TRANSLUCENT SQUARE. Pre-revamp stand-in\n"
        "       body that still drops/fades ON TOP of the real sprite death playing\n"
        "       underneath. Paolo flagged it 7/3/26: fine for now, delete at cleanup. */\n"
        "    c.fillStyle='rgba(70,60,50,'+(1-ip*0.8)+')';\n"
        "    px(c,tx-3*S,ty-5*S+ip*9*S,6*S,7*S);",
        "    /* V85 THE PLACEHOLDER SLAB IS DELETED. Measured on the real surface\n"
        "       (scratchpad/spot.js, screen-space, cinematic running untouched):\n"
        "         fillRect rgba(70,60,50,0.984) @197,272 42x50\n"
        "       THAT is Paolo's brown box, five reports running. It was the\n"
        "       LEGACY_PRE_REVAMP stand-in body, and it carried his own 7/3/26 note:\n"
        "       'still drops/fades ON TOP of the real sprite death playing underneath\n"
        "       ... fine for now, delete at cleanup.' It is not translucent at the\n"
        "       moment that matters: ip=0 at contact, so alpha=1.0, a SOLID slab -- and\n"
        "       the freeze holds ks.t still, so it stays solid for the whole stop.\n"
        "       Deleting it is also the answer to 'start the headshot fall animation',\n"
        "       asked three times: the clip was never missing, it was UNDERNEATH THIS.\n"
        "       Cleanup is now. The body on screen is the body's own death clip. */",
        'delete the brown placeholder slab')

    # --- 2. the orange one: the payout is not part of the stop ---------------
    demo = sub1(demo,
        "  for(const p of G._fx){ if(p.type!=='chip'||p.t<0)continue;\n"
        "    const q=Math.min(1,p.t/0.7);",
        "  for(const p of G._fx){ if(p.type!=='chip'||p.t<0)continue;\n"
        "    /* V85 THE PAYOUT ARRIVES WHEN THE WORLD MOVES AGAIN. Measured at the\n"
        "       pause: arcFill rgba(255,200,70,0.55) @197,237 9x9, glow and trails,\n"
        "       sitting on the corpse. Paolo: 'kill shot orange box doesnt fade away.'\n"
        "       He is exactly right -- the chip spawns AT contact, which is the same\n"
        "       instant the freeze starts, and its flight rides p.t which rides dt,\n"
        "       and dt is 0 while the world is stopped. So it hangs there, gold and\n"
        "       glowing, welded to the body, for the entire pause.\n"
        "       The stop belongs to the kill. The reward comes after it. */\n"
        "    if(G._freezeT>0)continue;\n"
        "    const q=Math.min(1,p.t/0.7);",
        'the chip does not draw during the freeze')

    # --- 3. the stop is a still, including the body --------------------------
    demo = sub1(demo,
        "function drawEnemySprite(x,e,ex,ey,now){",
        "/* V85 THE STOP IS A STILL, INCLUDING THE BODY. The death clip steps off\n"
        "   performance.now(), which does not care about the freeze, so the corpse was\n"
        "   falling through frames during a dead stop -- the one thing a hitstop exists\n"
        "   to prevent. visNow() is the wall clock normally and the INSTANT THE FREEZE\n"
        "   BEGAN while the world is held, so it is impact, hold, THEN the fall. That\n"
        "   ordering is what makes the headshot drop read as a body giving way instead\n"
        "   of a smear you never see. */\n"
        "function visNow(){ return (G._freezeT>0&&G._fzNow!=null)?G._fzNow:performance.now(); }\n"
        "function drawEnemySprite(x,e,ex,ey,now){",
        'visNow helper')

    demo = sub1(demo,
        "    if(G._freezeClock==null)G._freezeClock=_bpmClock;",
        "    if(G._fzNow==null)G._fzNow=performance.now();   /* V85: the body's clock holds with everything else */\n"
        "    if(G._freezeClock==null)G._freezeClock=_bpmClock;",
        'pin the wall clock')

    demo = sub1(demo,
        "  else { G._freezeClock=null; if(G._shk)G._shk=null;",
        "  else { if(G._fzNow!=null){ const _fd=performance.now()-G._fzNow;\n"
        "      /* V85 EVERY BODY'S CLOCK STOPPED TOO. Without this the fall RESUMES\n"
        "         three frames in: visNow() holds the death clip on frame 0 through the\n"
        "         pause, but _deadAt is raw wall time, so the moment the world moves the\n"
        "         clip jumps to wherever the wall clock says it should be -- measured 0\n"
        "         -> 4 of 12 across a half-second stop. The drop you paused FOR is the\n"
        "         part that got skipped. Push every body timestamp forward by exactly\n"
        "         the pause and the clip is continuous: hold on frame 0, then fall. */\n"
        "      const _ks5=['_deadAt','_fellAt','_hitAt','_roseAt','_swingAt','_snapAt','_movedAt','_crawlAt','_shovedAt'];\n"
        "      for(const _b5 of (G.e||[]))for(const _k5 of _ks5)if(_b5[_k5]!=null)_b5[_k5]+=_fd;\n"
        "      G._fzNow=null; }\n"
        "    G._freezeClock=null; if(G._shk)G._shk=null;",
        'release the wall clock and pay every body its pause back')

    demo = sub1(demo, "  { const _nowD=performance.now();",
        "  { const _nowD=visNow();   /* V85: bodies hold through the freeze */", 'board bodies read visNow')
    demo = sub1(demo, "  const nowMs=performance.now();",
        "  const nowMs=visNow();   /* V85: bodies hold through the freeze */", 'field bodies read visNow')

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
