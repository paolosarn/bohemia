#!/usr/bin/env python3
"""BOHEMIA - COMBAT v86: THE REST OF THE JUICE PASS, ON THE GRID.

Backlog 1e left five things open from Paolo's own pick-list after v81 landed the
freeze and the shake: PERMANENCE, RECOIL/KICKBACK on the next 16th, the impact
burst, a flash reserved for kills, and the camera. His standing word on the whole
item: "I want more juice. I want this to be juicy and fun and just like wow."

Auditing them first, per REUSE-FIRST, turned three of the five into BUGS rather
than features. That is what this ships.

--- 1. THE SHOT FLASH IS FRAME-COUNTED, EXACTLY LIKE THE OLD HIT-STOP ---------
    if(flash>0){ ...; flash-=0.08; }

A FIXED SUBTRACTION PER FRAME. 12.5 frames of white. On a 60Hz screen that is
208ms; on Paolo's 120Hz phone it is 104ms. Every shot he has ever judged has been
flashing for half as long as the number in the source implies, and the flash has
no single duration at all -- it is a function of the refresh rate.

This is the SAME DEFECT CLASS as the frame-counted hit-stop v81 killed, in a
second place nobody checked. The fix is the same fix: SECONDS, and a real note.

It becomes a SIXTEENTH (0.125s). Not the eighth that matches the 60Hz number --
the sixteenth, because 104ms is what HIS DEVICE has actually been showing him,
and the feel he has been approving is the phone's, not the desk's.

--- 2. THE KILLSHOT PUNCH SCALES WITH THE CINEMATIC, NOT WITH THE HIT ---------
    if(punch>0){...}   punch = 1-p*3     (clean)
    if(snap>0){...}    snap  = 1-p*4     (sharp)

p is ks.t/ks.dur, and ks.dur is snapped to whole beats per style. So the SAME
white punch runs 0.167s behind a 0.5s clean kill and 0.375s behind a 1.5s sharp
one. Same event, same meaning, more than double the duration, decided by which
cinematic the shuffle rolled.

Both now measure ks.t in SECONDS against one sixteenth. One number, every style.

--- 3. THE RECOIL IS NOT ON THE GRID -----------------------------------------
    if(G.recoil>0) G.recoil=Math.max(0,G.recoil-dt*4.5);

dt-based, so at least it is framerate-honest -- but 1/4.5 = 0.222s is an
arbitrary number that lands between a sixteenth and an eighth, so the kick is
still travelling home when the next sixteenth arrives. The pick-list says it in
so many words: "snapping back on the next 16th." Rate becomes 1/note(16) = 8/s,
so the gun is home exactly on the sixteenth and never smears across it.

--- 4. THE HELD BREATH IS 4% OFF THE BEAT ------------------------------------
    G.breathT = G.heldBreath ? 0.12 : 0;

0.12s. A sixteenth is 0.125s. Under the 120 BPM LAW everything quantizes to the
beat, and this is the one micro-pause in the kill that never did -- a 5ms drift
before every cinematic, on a system where the whole point is that the world
resolves on the grid. It is now note(16).

--- 5. PERMANENCE: THE BRASS WAS DELETING ITSELF -----------------------------
    G.litter.push(entry); if(G.litter.length>14)G.litter.shift();

Brass is FLOOR STATE (AF v3, Paolo 7/20): it drops where it lands and stays.
Except the fifteenth casing silently deleted the first one. In any real fight you
fire far more than 14 rounds, so the floor stopped accumulating almost
immediately and the evidence of the fight quietly capped out.

Permanence is the cheapest juice there is and the literature rates it top-tier:
the floor should read like something HAPPENED here. The cap goes to 96 -- still
bounded, still cleared on a fresh fight, but now it holds a real firefight
instead of five seconds of one.

--- 6. THE IMPACT BURST IS A PERFECT CIRCLE ----------------------------------
The kill impact throws twelve particles at k/12*6.28 -- a symmetric ring, which
is the one shape a real impact never makes. You cannot read WHERE the shot came
from, which is exactly the information a directional burst exists to give. The
spray now biases along the shot axis: the far side throws further, the near side
barely moves. Same twelve particles, same colours, same cost.

NOT SHIPPED, DELIBERATELY: the CAMERA THAT LEADS the shot. Every other item here
is a defect with a right answer; camera lead is a FEEL decision with a dozen
right answers, and inventing one while he is asleep is exactly what STOP
PRODUCING forbids. Filed for him.

REUSE CHECK: no art or audio assets are cooked, read or written. Every change is
a constant or an existing draw; nothing new is drawn that was not drawn before.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_juice_grid_patch.py
Gate:  node gates/combat_lab_gate.js   (section 21)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V86 THE JUICE IS ON THE GRID'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- the one table of durations, so no juice number is ever loose again ---
    demo = sub1(demo,
        "/* ===== V81 FREEZE CORE END ===== */",
        "/* ===== V81 FREEZE CORE END ===== */\n"
        "/* ===== V86 THE JUICE IS ON THE GRID ================================\n"
        "   Every visual juice duration, in SECONDS, as a real note value. v81 put\n"
        "   the hit-stop on the grid and found that counting FRAMES had been running\n"
        "   every impact at half weight on a 120Hz phone. This is the audit of\n"
        "   everything ELSE that had a duration, and it found the same bug again in\n"
        "   the shot flash, plus two numbers that were simply off the beat.\n"
        "   A duration that is not in here is a duration nobody is checking. */\n"
        "var JUICEMS={\n"
        "  flash:   BohemiaFreeze.note(16),   /* 0.125s the shot flash. WAS flash-=0.08 PER FRAME:\n"
        "                                        208ms at 60Hz, 104ms on his 120Hz phone, no\n"
        "                                        single duration at all. A sixteenth, because\n"
        "                                        104ms is what HIS device has been showing him. */\n"
        "  ksPunch: BohemiaFreeze.note(16),   /* 0.125s the killshot's white punch. WAS a fraction\n"
        "                                        of ks.dur, so the same punch ran 0.167s behind a\n"
        "                                        clean kill and 0.375s behind a sharp one -- and\n"
        "                                        keying it to ks.t instead left it PINNED by the\n"
        "                                        hit-stop at 633ms. It rides the wall clock. */\n"
        "  recoil:  BohemiaFreeze.note(16),   /* 0.125s the gun comes home ON the next sixteenth.\n"
        "                                        WAS dt*4.5 = 0.222s, between two notes. */\n"
        "  breath:  BohemiaFreeze.note(16)    /* 0.125s the held breath before the cinematic.\n"
        "                                        WAS 0.12 -- 4% off the beat, in the one system\n"
        "                                        whose entire premise is that it lands on it. */\n"
        "};\n"
        "var JUICE_BRASS_MAX=96;   /* PERMANENCE: the floor holds a real firefight. WAS 14, so the\n"
        "                             fifteenth casing quietly deleted the first and the ground\n"
        "                             stopped accumulating almost immediately. */\n"
        "if(typeof module!=='undefined'&&module.exports)module.exports.JUICEMS=JUICEMS;\n"
        "/* ===== V86 JUICE GRID END ===== */",
        'the juice duration table')

    # --- 1. the shot flash, in seconds ---------------------------------------
    demo = sub1(demo,
        "  if(flash>0){ctx.fillStyle='rgba(255,255,255,'+flash*0.22+')';ctx.fillRect(0,0,W,H);flash-=0.08;}",
        "  /* V86 THE SHOT FLASH IS A SIXTEENTH, IN SECONDS. It was flash-=0.08 PER\n"
        "     FRAME -- 208ms at 60Hz and 104ms on his phone, which is to say it had no\n"
        "     duration, only a refresh rate. Same defect class as the frame-counted\n"
        "     hit-stop v81 killed, hiding in a second place. Wall clock, one note. */\n"
        "  if(flash>0){ const _fn=performance.now();\n"
        "    const _fdt=(G._flashLast!=null)?Math.min(0.25,(_fn-G._flashLast)/1000):0;\n"
        "    G._flashLast=_fn;\n"
        "    ctx.fillStyle='rgba(255,255,255,'+flash*0.22+')';ctx.fillRect(0,0,W,H);\n"
        "    flash=Math.max(0,flash-_fdt/JUICEMS.flash); }\n"
        "  else G._flashLast=null;",
        'shot flash in seconds')

    # --- 2a. the cinematic's true zero, stamped past the held breath ---------
    demo = sub1(demo,
        "  // ---- CHAIN ESCALATION glow: hotter screen edge the higher the streak ----",
        "  /* V86 THE CINEMATIC'S TRUE ZERO. The white punch cannot key off G._ksAt:\n"
        "     the HELD BREATH runs first and this function early-returns through all of\n"
        "     it, so by the time the punch code is reached the wall clock is already\n"
        "     125ms past the stamp and the flash never draws at all (measured: NONE).\n"
        "     Nor can it key off ks.t, which the hit-stop pins (measured: 633ms of\n"
        "     white behind a sharp kill). The honest zero is the first frame the\n"
        "     cinematic actually gets to draw, which is exactly here. */\n"
        "  if(G._ksGo==null)G._ksGo=performance.now();\n"
        "  // ---- CHAIN ESCALATION glow: hotter screen edge the higher the streak ----",
        'the cinematic true zero')

    demo = sub1(demo,
        "  G._ksAt=performance.now();   /* DIAL FADE: the instrument leaves, the consequence owns the screen */",
        "  G._ksAt=performance.now();   /* DIAL FADE: the instrument leaves, the consequence owns the screen */\n"
        "  G._ksGo=null;                /* V86: the punch's zero, stamped when the cinematic really starts */",
        'clear the cinematic zero')

    # --- 2. the killshot punch, one note for every style ---------------------
    demo = sub1(demo,
        "    const punch=Math.max(0,1-p*3);\n"
        "    if(punch>0){c.fillStyle='rgba(255,255,255,'+punch*0.45+')';c.fillRect(0,0,W,H);}",
        "    /* V86 ONE PUNCH, ONE DURATION. Was 1-p*3 against ks.dur, so a clean kill\n"
        "       flashed 0.167s and a sharp one 0.375s -- the same event, decided by\n"
        "       whichever cinematic the shuffle rolled. Now ONE note, in SECONDS.\n"
        "       AND IT RIDES THE WALL CLOCK, NOT ks.t. Measured on the real canvas:\n"
        "       ks.t stalls during the hit-stop, so a punch keyed to it stayed white on\n"
        "       screen for 633ms behind a sharp kill -- pinned by the freeze, which is\n"
        "       the exact bug class the 7/27 law was written about, caught here by the\n"
        "       probe instead of by Paolo. The punch fires at the SHOT and is finished\n"
        "       before contact, so it has no business being held by a stop that starts\n"
        "       after it. And not G._ksAt either: the HELD BREATH runs first and this\n"
        "       function early-returns through all of it, so a punch keyed to the stamp\n"
        "       was already expired before its own code was reached (measured: NONE).\n"
        "       G._ksGo is the first frame the cinematic actually draws. */\n"
        "    const punch=Math.max(0,1-((performance.now()-(G._ksGo||performance.now()))/1000)/JUICEMS.ksPunch);\n"
        "    if(punch>0){c.fillStyle='rgba(255,255,255,'+punch*0.45+')';c.fillRect(0,0,W,H);}",
        'clean punch on the grid')

    demo = sub1(demo,
        "    const snap=Math.max(0,1-p*4);\n"
        "    if(snap>0){c.fillStyle='rgba(255,255,255,'+snap*0.4+')';c.fillRect(0,0,W,H);}",
        "    /* V86: the same one note, off the same wall clock, as the clean punch. */\n"
        "    const snap=Math.max(0,1-((performance.now()-(G._ksGo||performance.now()))/1000)/JUICEMS.ksPunch);\n"
        "    if(snap>0){c.fillStyle='rgba(255,255,255,'+snap*0.4+')';c.fillRect(0,0,W,H);}",
        'sharp snap on the grid')

    # --- 3. the recoil comes home on the sixteenth ---------------------------
    demo = sub1(demo,
        "  // recoil decays fast\n"
        "  if(G.recoil>0) G.recoil=Math.max(0,G.recoil-dt*4.5);",
        "  /* V86 THE GUN COMES HOME ON THE NEXT SIXTEENTH. dt*4.5 is 0.222s, which\n"
        "     lands between a sixteenth and an eighth, so the kick was still travelling\n"
        "     when the next sixteenth arrived. The pick-list says it literally:\n"
        "     \"1-2px RECOIL/KICKBACK snapping back on the next 16th.\" */\n"
        "  if(G.recoil>0) G.recoil=Math.max(0,G.recoil-dt/JUICEMS.recoil);",
        'recoil on the sixteenth')

    # --- 4. the held breath lands on the beat --------------------------------
    demo = sub1(demo,
        "  G.breathT = G.heldBreath ? 0.12 : 0;",
        "  /* V86: 0.12 was 4% off the grid, in the one system whose whole premise is\n"
        "     that everything resolves on it. A sixteenth is 0.125. */\n"
        "  G.breathT = G.heldBreath ? JUICEMS.breath : 0;",
        'held breath on the grid')

    # --- 5. permanence: the floor keeps the fight ----------------------------
    demo = sub1(demo,
        "function litterAdd(entry){ if(!JUICE.AF)return; G.litter=G.litter||[];\n"
        "  G.litter.push(entry); if(G.litter.length>14)G.litter.shift(); }",
        "/* V86 PERMANENCE: THE FLOOR KEEPS THE FIGHT. Brass is FLOOR STATE by AF v3 --\n"
        "   it drops where it lands and stays -- except the cap was 14, so the\n"
        "   fifteenth casing silently deleted the first and the ground stopped\n"
        "   accumulating within seconds of a real firefight starting. Permanence is\n"
        "   the cheapest juice there is: the floor should read like something HAPPENED\n"
        "   here. Still bounded, still cleared on a fresh fight. */\n"
        "function litterAdd(entry){ if(!JUICE.AF)return; G.litter=G.litter||[];\n"
        "  G.litter.push(entry); if(G.litter.length>JUICE_BRASS_MAX)G.litter.shift(); }",
        'brass permanence')

    # --- 6. the impact throws along the shot ---------------------------------
    demo = sub1(demo,
        "    for(let k=0;k<12;k++){const a=k/12*6.28,r=(4+ip*14*bloodScale)*S;\n"
        "      c.fillStyle='rgba('+(150+((k*37)%60))+',20,20,'+(0.75*(1-ip))+')';\n"
        "      px(c,tx+Math.cos(a)*r-S,ty+Math.sin(a)*r-S,2*S,2*S);}",
        "    /* V86 THE IMPACT THROWS ALONG THE SHOT. Twelve particles at k/12*6.28 is a\n"
        "       perfect circle, which is the one shape a real impact never makes, and it\n"
        "       throws away the only piece of information a burst exists to carry: WHERE\n"
        "       IT CAME FROM. The spray now leans down-range -- the far side throws out,\n"
        "       the near side barely moves. Same twelve particles, same colours, same\n"
        "       cost, and now the hit reads as a direction instead of a bloom. */\n"
        "    for(let k=0;k<12;k++){const a=k/12*6.28,r=(4+ip*14*bloodScale)*S;\n"
        "      const _lean=0.45+0.85*(0.5+0.5*Math.cos(a-ang));   /* 0.45 behind -> 1.30 down-range */\n"
        "      const _rx=r*_lean, _ry=r*_lean;\n"
        "      c.fillStyle='rgba('+(150+((k*37)%60))+',20,20,'+(0.75*(1-ip))+')';\n"
        "      px(c,tx+Math.cos(a)*_rx-S,ty+Math.sin(a)*_ry-S,2*S,2*S);}",
        'directional impact burst')

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
