#!/usr/bin/env python3
"""BOHEMIA - COMBAT v79: THE PULSE JOINS THE LADDER (Paolo's design, 7/26).

Paolo: "I'm fucking with pulse starting off on soft so essentially zero kills and
then the old system we had kicks off at two kills then it upgrades the beat at
four kills and then maybe it goes to hard on five kills. Does that make sense?"

It makes sense and it is better than what shipped. THE PULSE STOPS BEING A
SETTING AND BECOMES THE TOP RUNG OF HIS OWN LADDER. One progression, four steps,
his numbers:

  0 kills   PULSE SOFT              the floor is there, tucked back
  2 kills   his 7/3 RUNG 1          the hats (unchanged, his LOCKED law)
  4 kills   his 7/3 RUNG 2          the bass (unchanged, his LOCKED law)
  5 kills   PULSE HARD              the floor opens up under all of it

This is the answer to the question he asked two messages ago -- "how do we strike
the balance between the two kill progression and your pulse mode thing" -- and it
is his answer, not mine. The pulse was a parallel system competing with his
ladder. Now it is the ladder's floor and its ceiling, and his two rungs sit
inside it untouched.

WHY IT KEYS OFF _sk AND NOT A RAW KILL COUNT: _sk is already the number the whole
music ladder runs on, and since v74 it is max(bodies taken out, what the GROOVE
chain has earned). So a player who is genuinely in the pocket can open the floor
on rhythm alone, exactly as the chain already does for his 2 and 4 rungs. One
number drives the whole progression; there is no second definition of intensity.
It also means the V71 ruling still holds without restating it: downed, crawling,
broken and fleeing men all count.

THE BUTTON STAYS, because he still has to be able to A/B it, but AUTO is the
default and the honest comparison is preserved:
  AUTO (default) -> SOFT -> HARD -> OFF -> AUTO
OFF is still the bare creeper exactly as approved.

WHAT IS NOT TOUCHED: his songs (song_lock_gate proves it every run), his 7/3
rungs at 2 and 4, the klay styles, the yield rule from v76.

REUSE CHECK: no audio assets are cooked, read or written. This is control flow
over the BohemiaPulse core already shipped at v75 and the ladder count already
computed at v71/v74. Nothing about his 13 approved songs is edited.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_pulse_ladder_patch.py
Gate:  node gates/combat_lab_gate.js   (section 16 executes the four-step ladder)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V79 THE PULSE JOINS THE LADDER'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


# --- the tier rule goes into the pure core, so the gate can execute it ---
OLD_CYCLE = "  function cycle(mode){ return mode==='hard'?'soft':(mode==='soft'?'off':'hard'); }\n" \
            "  return { MODES:MODES, kick:kick, hat:hat, back:back, on:on,\n" \
            "           gain:gain, mix:mix, cycle:cycle }; })();"

NEW_CYCLE = r"""  /* ===== V79 THE PULSE IS THE LADDER'S FLOOR AND ITS CEILING (Paolo 7/26) ===
     "pulse starting off on soft so essentially zero kills, and then the old
     system we had kicks off at two kills, then it upgrades the beat at four
     kills, and then maybe it goes to hard on five kills."
     His progression, his numbers. The pulse stops being a parallel system
     competing with his 7/3 ladder and becomes the same ladder's bottom and top:

       0   PULSE SOFT     the floor is there, tucked back
       2   his RUNG 1     the hats      (his LOCKED law, untouched)
       4   his RUNG 2     the bass      (his LOCKED law, untouched)
       5   PULSE HARD     the floor opens up under all of it

     Keyed off the SAME _sk the whole ladder runs on, which since v74 is
     max(bodies taken out, what the GROOVE chain earned) -- so rhythm alone can
     open the floor, and V71's downed/crawling/fleeing men still count. One
     number drives the entire progression. */
  var HARD_AT=5;
  function tier(sk){ return ((sk||0)>=HARD_AT)?'hard':'soft'; }
  /* AUTO is the default; the manual modes stay so he can still A/B it, and OFF
     is still the bare creeper exactly as approved. */
  function resolve(mode,sk){ return (!mode||mode==='auto')?tier(sk):mode; }
  function cycle(mode){ return mode==='auto'?'soft':(mode==='soft'?'hard':(mode==='hard'?'off':'auto')); }
  return { MODES:MODES, kick:kick, hat:hat, back:back, on:on, HARD_AT:HARD_AT,
           gain:gain, mix:mix, cycle:cycle, tier:tier, resolve:resolve }; })();"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo, OLD_CYCLE, NEW_CYCLE, 'tier in the core')

    # the emission resolves AUTO against the live ladder count
    demo = sub1(demo,
        "  if(BohemiaPulse.on(G.pulse||'hard') && !G.over && !G._musMuted){\n"
        "    try{\n"
        "      const _pm=BohemiaPulse.mix(G.pulse||'hard',BohemiaGroove.level(G.groove));",
        "  /* V79 THE PULSE JOINS THE LADDER: AUTO resolves against the SAME _sk his\n"
        "     2-and-4 rungs run on, so there is one progression and not two. */\n"
        "  const _pmode=BohemiaPulse.resolve(G.pulse||'auto',_sk);\n"
        "  if(BohemiaPulse.on(_pmode) && !G.over && !G._musMuted){\n"
        "    try{\n"
        "      const _pm=BohemiaPulse.mix(_pmode,BohemiaGroove.level(G.groove));",
        'emission resolves auto')

    # the button: AUTO by default, and it says which rung it is on
    demo = sub1(demo,
        '<button id="pulsebtn" style="border-color:#8fe89a;color:#cfe8c0">PULSE: HARD</button>',
        '<button id="pulsebtn" style="border-color:#8fe89a;color:#cfe8c0">PULSE: AUTO</button>',
        'button default')

    demo = sub1(demo,
        "    G.pulse=BohemiaPulse.cycle(G.pulse||'hard');\n"
        "    pb.textContent='PULSE: '+G.pulse.toUpperCase();",
        "    G.pulse=BohemiaPulse.cycle(G.pulse||'auto');\n"
        "    pb.textContent='PULSE: '+G.pulse.toUpperCase();",
        'button cycle default')

    demo = sub1(demo,
        "    setRead('FIGHT PULSE '+G.pulse.toUpperCase(),\n"
        "      G.pulse==='off'?'bare overworld creeper — 0.54 kicks a bar, nothing to lock to'\n"
        "      :(G.pulse==='hard'?'four on the floor under the song — lock to it':'the floor, tucked back'),\n"
        "      G.pulse==='off'?'#8a7d66':'#8fe89a'); });",
        "    setRead('FIGHT PULSE '+G.pulse.toUpperCase(),\n"
        "      G.pulse==='auto'?'soft from the first shot, HARD at '+BohemiaPulse.HARD_AT+' down — your 2 and 4 rungs sit inside it'\n"
        "      :(G.pulse==='off'?'bare creeper, exactly as approved'\n"
        "      :(G.pulse==='hard'?'four on the floor under the song — lock to it':'the floor, tucked back')),\n"
        "      G.pulse==='off'?'#8a7d66':'#8fe89a'); });",
        'button readout')

    # the settings line has to tell the truth about the new behaviour
    demo = sub1(demo,
        'and it thickens as your GROOVE chain climbs. OFF is the bare creeper, '
        'exactly as it plays today. Tap to A/B it.',
        'and it thickens as your GROOVE chain climbs. ON AUTO it is one ladder with your 7/3 rungs: '
        'SOFT from the first shot, your hats at 2 down, your bass at 4, and the floor opens to HARD at 5 '
        '(the GROOVE chain counts toward it, so rhythm alone can get you there). Tap to force '
        'SOFT / HARD / OFF instead. OFF is the bare creeper, exactly as approved.',
        'settings line tells the truth')

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
