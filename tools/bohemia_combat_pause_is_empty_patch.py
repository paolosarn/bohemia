#!/usr/bin/env python3
"""BOHEMIA - COMBAT v87: THE PAUSE IS EMPTY. And the orange was the STREAK GLOW.

Paolo, the SIXTH time: "that orange part of the dead shot dial is still there not
fading away."

--- WHY FIVE REPRODUCTIONS MISSED IT ---------------------------------------
Every probe I have ever written kills ONE MAN. Paolo plays whole encounters.

CHAIN ESCALATION only exists at killStreak >= 2:

    if(ks.escal>1){
      const k=(ks.escal-1)/2;
      const grd=c.createRadialGradient(...);
      grd.addColorStop(1,'rgba(255,'+(120-k*60)+',40,'+(0.10+k*0.18)*(1-p)+')');
      c.fillStyle=grd;c.fillRect(0,0,W,H);   /* THE WHOLE SCREEN */
    }

A FULL-SCREEN ORANGE WASH, on every kill from the second onward, brightest at the
screen edge -- which is exactly where the dial sits, which is why he has been
calling it "the orange part of the dial" for a week while I kept measuring the
dial's own arcs and finding them correctly faded to zero.

MEASURED, at a 3-streak, by recording the colour stop the game actually asks for:

    +  875ms   ks.t=0.871   freeze=0     rgba(255,60,40) alpha=0.199
    + 2284ms   ks.t=0.969   freeze=held  rgba(255,60,40) alpha=0.190

1.4 SECONDS OF WALL TIME, and the alpha moved by 0.009. Because its fade is
(1-p), p is ks.t/ks.dur, and the hit-stop pins ks.t. Third instance of the same
pin this session, and the one that was actually on his screen.

--- THE LAW THIS MAKES ------------------------------------------------------
THE PAUSE IS EMPTY. A flourish does not draw while the world is stopped.

This session has now fixed the same shape four times one at a time: the floor
pulse (v84), the gold payout chip (v85), and now the streak glow. Every time, the
thing had a decay driven by a clock the freeze pins, so the freeze welded it on at
its brightest. Fixing them one by one is how it took six rounds.

So this ships a RULE instead of a fourth patch:
  1. THE STREAK GLOW rides the wall clock with a one-beat life, and does not draw
     while frozen. It blooms on the shot and it is gone before the stop lands.
  2. THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP. _df -- the one alpha that
     owns the ENTIRE dial, from the first band to the reticle -- is forced to 0
     while the world is frozen. The dial is the instrument; the pause is the
     consequence; they are never on screen together, whatever the timing math
     says. Safe by construction: the demo already resets globalAlpha to 1 before
     drawKillshotWorld ("dial fade never touches the killshot world"), so the
     bullet, the blood and the body are untouched.

--- AND THE INSTRUMENT, SO A SEVENTH ROUND IS IMPOSSIBLE --------------------
WHAT'S ON SCREEN (v84b) could never have found this. It hooked fillRect and
drawImage only, and only things over 2% of the canvas -- but a gradient fill
reports its style as "[object CanvasGradient]" with no colour in it at all, and
the dial is drawn with STROKES, which it never watched.

v2 watches strokes and arcs too, resolves gradient colour stops to the actual
rgba, drops the size floor for anything WARM, and reports position. One tap from
Paolo now names any coloured thing on his screen, at any size, whatever drew it.

REUSE CHECK: no art or audio assets are cooked, read or written. One new duration
in the existing JUICEMS table, two conditions on existing draws, and two more
methods on an existing debug hook.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_pause_is_empty_patch.py
Gate:  node gates/combat_lab_gate.js   (section 22)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
# THE MARKER MUST BE A STRING THIS TOOL ACTUALLY WRITES. v1 used
# 'V87 THE PAUSE IS EMPTY' -- the law's title, which appears in the docstring and
# in the law file but is never inserted into the demo. So the idempotency check
# could never fire, and a re-run (which happens on every parallel-session rebase)
# tried to patch an already-patched file: anchor 1 still matched, anchor 2 was
# already consumed, and the tool exited on a FAIL that looked like corruption.
# Caught on a real rebase 7/27. A marker you do not write is not a marker.
MARK = 'V87 THE STREAK GLOW BLOOMS AND LEAVES'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- the streak glow joins the duration table --------------------------
    demo = sub1(demo,
        "  breath:  BohemiaFreeze.note(16)    /* 0.125s the held breath before the cinematic.",
        "  streak:  BohemiaFreeze.note(4),    /* 0.500s ONE BEAT. The CHAIN ESCALATION glow: a\n"
        "                                        FULL-SCREEN orange wash on every kill from the\n"
        "                                        second onward. Its fade was (1-p) against ks.dur,\n"
        "                                        which the hit-stop pins -- measured 1.4s of wall\n"
        "                                        time during which alpha moved 0.199 -> 0.190.\n"
        "                                        This is the orange Paolo reported six times. */\n"
        "  breath:  BohemiaFreeze.note(16)    /* 0.125s the held breath before the cinematic.",
        'the streak glow joins JUICEMS')

    # --- 1. the streak glow blooms and leaves, and never during the stop ----
    demo = sub1(demo,
        "  if(ks.escal>1){\n"
        "    const k=(ks.escal-1)/2;                    // 0..1 across streak 2..3+\n"
        "    const grd=c.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.min(W,H)*0.7);\n"
        "    grd.addColorStop(0,'rgba(0,0,0,0)');\n"
        "    grd.addColorStop(1,'rgba(255,'+(120-k*60)+',40,'+(0.10+k*0.18)*(1-p)+')');\n"
        "    c.fillStyle=grd;c.fillRect(0,0,W,H);\n"
        "  }",
        "  /* V87 THE STREAK GLOW BLOOMS AND LEAVES. THIS IS PAOLO'S ORANGE, six reports\n"
        "     running, and no probe of mine could ever have seen it because every one of\n"
        "     them killed ONE MAN: escal>1 needs a streak, and he plays whole encounters.\n"
        "     It is a FULL-SCREEN wash, brightest at the screen EDGE -- which is exactly\n"
        "     where the dial sits, which is why he called it 'the orange part of the\n"
        "     dial' while I kept measuring the dial's own arcs and finding them at zero.\n"
        "     MEASURED at a 3-streak, off the colour stop the game really asks for:\n"
        "       +  875ms  ks.t=0.871  freeze=0     rgba(255,60,40) alpha=0.199\n"
        "       + 2284ms  ks.t=0.969  freeze=HELD  rgba(255,60,40) alpha=0.190\n"
        "     1.4 seconds, 0.009 of fade, because (1-p) rides ks.t and the hit-stop pins\n"
        "     ks.t. Now: ONE BEAT, on the wall clock, and NOT DURING THE STOP. It\n"
        "     celebrates the streak on the shot and it is gone before the pause lands,\n"
        "     which is what he asked for the very first time he mentioned it. */\n"
        "  if(ks.escal>1&&!(G._freezeT>0)){\n"
        "    const k=(ks.escal-1)/2;                    // 0..1 across streak 2..3+\n"
        "    const _sg=Math.max(0,1-((performance.now()-(G._ksGo||performance.now()))/1000)/JUICEMS.streak);\n"
        "    if(_sg>0){\n"
        "      const grd=c.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.min(W,H)*0.7);\n"
        "      grd.addColorStop(0,'rgba(0,0,0,0)');\n"
        "      grd.addColorStop(1,'rgba(255,'+(120-k*60)+',40,'+((0.10+k*0.18)*_sg).toFixed(3)+')');\n"
        "      c.fillStyle=grd;c.fillRect(0,0,W,H); }\n"
        "  }",
        'the streak glow on the wall clock')

    # --- 2. the instrument is never on screen during a stop ----------------
    demo = sub1(demo,
        "  const _df=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1;",
        "  /* V87 THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP. _df is the one alpha\n"
        "     that owns the ENTIRE dial -- ctx.globalAlpha=_df is set before the first\n"
        "     band and holds all the way to the reticle, and the demo resets it to 1\n"
        "     immediately before drawKillshotWorld ('dial fade never touches the killshot\n"
        "     world'), so forcing it to 0 hides the instrument and NOTHING else: the\n"
        "     bullet, the blood and the bodies are on the other side of that reset.\n"
        "     The dial is the instrument. The pause is the consequence. They are never on\n"
        "     screen together, whatever the timing math happens to work out to on a\n"
        "     device I do not have. */\n"
        "  const _df=(G._freezeT>0)?0:((G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1);",
        'the instrument leaves before the stop')

    # --- 3. WHAT'S ON SCREEN v2: strokes, arcs, gradients, and warm at any size
    demo = sub1(demo,
        "  function note(kind,w,h,style,area,screen){\n"
        "    if(!armed||done)return;\n"
        "    if(!(area>screen*0.02))return;              /* only things that actually cover the screen */",
        "  /* V87 WARM THINGS COUNT AT ANY SIZE. v1 could never have found the streak\n"
        "     glow: it watched fillRect and drawImage only, and only things over 2% of\n"
        "     the canvas -- but a gradient fill reports its style as the useless string\n"
        "     '[object CanvasGradient]' with no colour in it at all, and the dial is\n"
        "     drawn with STROKES, which v1 never watched. Six rounds of 'what is that\n"
        "     orange thing' is what a blind instrument costs. */\n"
        "  function isWarm(css){ var q=String(css).match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);\n"
        "    if(q)return (+q[1]>110&&+q[1]>+q[2]+25&&+q[2]>=+q[3]-20);\n"
        "    var h=String(css).match(/^#([0-9a-f]{6})$/i); if(!h)return false;\n"
        "    var r=parseInt(h[1].slice(0,2),16),g=parseInt(h[1].slice(2,4),16),b=parseInt(h[1].slice(4,6),16);\n"
        "    return r>110&&r>g+25&&g>=b-20; }\n"
        "  function note(kind,w,h,style,area,screen){\n"
        "    if(!armed||done)return;\n"
        "    if(!(area>screen*0.02) && !isWarm(style))return;   /* big things, OR anything WARM at any size */",
        'warm things count at any size')

    demo = sub1(demo,
        "  return { arm:arm, isArmed:isArmed, note:note, report:report, finish:finish, count:count }; })();",
        "  return { arm:arm, isArmed:isArmed, note:note, report:report, finish:finish, count:count,\n"
        "           isWarm:isWarm }; })();",
        'expose isWarm')

    demo = sub1(demo,
        "    P.drawImage=function(){ var a=arguments;",
        "    /* V87: STROKES AND ARCS. The dial is strokes; a fill-only hook is blind to\n"
        "       the exact thing he keeps pointing at. */\n"
        "    var oST=P.stroke;\n"
        "    P.stroke=function(){\n"
        "      try{ if(BohemiaWhatsOn.isArmed()&&G._freezeT>0&&this.canvas&&this.canvas.id==='cv'\n"
        "        &&BohemiaWhatsOn.isWarm(this.strokeStyle))\n"
        "        BohemiaWhatsOn.note('stroke',this.lineWidth,this.lineWidth,this.strokeStyle,1,1); }catch(_e){}\n"
        "      return oST.apply(this,arguments); };\n"
        "    /* V87: a GRADIENT fill stringifies to '[object CanvasGradient]', which names\n"
        "       nothing. Record the colour stops it is built from instead -- that is how\n"
        "       the streak glow was finally caught. */\n"
        "    var oACS=CanvasGradient.prototype.addColorStop;\n"
        "    CanvasGradient.prototype.addColorStop=function(o,cs){\n"
        "      try{ if(BohemiaWhatsOn.isArmed()&&G._freezeT>0&&BohemiaWhatsOn.isWarm(cs))\n"
        "        BohemiaWhatsOn.note('gradient',1,1,cs,1,1); }catch(_e){}\n"
        "      return oACS.call(this,o,cs); };\n"
        "    P.drawImage=function(){ var a=arguments;",
        'hook strokes and gradients')

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
