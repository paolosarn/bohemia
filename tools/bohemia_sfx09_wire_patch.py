#!/usr/bin/env python3
"""
BOHEMIA — SFX-09 GETS ITS CALLERS (8/20/26, SOUND lane).

REUSE CHECK: cooks nothing. Not a note, not a voice. This connects the six
moments SFX-09 cooked to the places in the game where they happen. Banks opened:
none needed -- the sounds exist, the moments exist, and the only thing missing
was the wire between them.

WHY THIS EXISTS, AND IT IS EMBARRASSING. Yesterday I counted thirty game moments
that make no sound, found that NOT ONE OF THEM HAD A CALLER, wrote that up as the
defect this lane keeps finding, and shipped wires for the ones I could reach.
Then I cooked SFX-09 and shipped SIX NEW MOMENTS WITH NO CALLERS. Checked it
before writing this: every one of gone_quiet, mag_home, hands_pass, dog_calls,
sign_alive and lungs_burn had exactly one reference in the build, and that
reference was its own recipe. I did the thing I had documented the day before.

A COOK WITHOUT A CALLER IS NOT A SHIPPED SOUND. It is a candidate on a judging
sheet. That is the rule this file exists to hold.

WHAT IT WIRES
  gone_quiet   the end of a fight, beside `clear` which is already there
  hands_pass   a purse CREDIT, beside `money` which is already there
  dog_calls    \  the rare outdoor ambience rotation, beside the generator, the
  sign_alive   /  gust, the dog and the neon already in it
  mag_home     doReload() in the combat module -- a real function with a real
               trigger that already calls audio(). THE MAG SEATS is the beat
               where you cannot shoot and the player has to HEAR it.

AND ONE THAT IS NOT WIRED, NAMED RATHER THAN FAKED:
  lungs_burn   OUT OF BREATH needs a sprint. There is no sprint VERB in the run
               -- the only matches for it in the city world are one liquids
               effect that would DISABLE a sprint that does not exist. Wiring it
               to walking would be a lie about what the sound means. It gets an
               expiry needle, the same as the other seven waived moments.
               [expires when a sprint verb appears in the run]

Every wire is a NO-OP until Paolo approves a candidate for that moment: the
engine's play() is "unjudged = silent". They cost nothing today and work the day
he says yes.

Idempotent: keyed on each id.

  python3 tools/bohemia_sfx09_wire_patch.py
"""
import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- 1. the alpha-side wires ---------------------------------------------
OLD_CLEAR = """      try{ if(window.playSFX){ playSFX('clear'); playSFX('clear_still'); } }catch(_e){}"""
NEW_CLEAR = """      try{ if(window.playSFX){ playSFX('clear'); playSFX('clear_still');
        /* SFX-09's instrument-backed version of the same moment. Both rounds of
           the raw-synthesis one died 0 of 65; this is the source that works. */
        playSFX('gone_quiet'); } }catch(_e){}"""

OLD_MONEY = """          try{ if(window.playSFX){ playSFX('money'); playSFX('cash_count'); } }catch(e2){}"""
NEW_MONEY = """          try{ if(window.playSFX){ playSFX('money'); playSFX('cash_count');
            playSFX('hands_pass'); } }catch(e2){}   /* SFX-09, same moment */"""

OLD_AMB = """      if(r<0.50 && (A.dog_far||[]).length) return 'dog_far';
      if(r<0.50 && (A.dog_cry||[]).length) return 'dog_cry';
      return this.kind;"""
NEW_AMB = """      if(r<0.50 && (A.dog_far||[]).length) return 'dog_far';
      if(r<0.50 && (A.dog_cry||[]).length) return 'dog_cry';
      /* SFX-09 (8/20): the instrument-backed versions of the same two moments,
         built on voices he WROTE for them -- neonsign, neontube, neonrelic for
         the sign; dobrowail, harmonicawail, shofar for the dog. Same guard, so
         an unapproved name is skipped and the bed plays. */
      if(r<0.44 && (A.sign_alive||[]).length) return 'sign_alive';
      if(r<0.50 && (A.dog_calls||[]).length) return 'dog_calls';
      return this.kind;"""

WIRE_TOOL = 'tools/bohemia_sfx_wire_patch.py'

# ---- 2. the combat-side wire ---------------------------------------------
# doReload is the reload, it already calls audio(), and it is present once.
# VERBATIM, NEWLINES AND ALL. The first version of this anchor assumed the two
# statements sat on one line; they do not, and the patch failed loudly rather
# than matching something near enough, which is the behaviour you want.
RELOAD_OLD = "  G.ammo[w]+=take; G.spare-=take;\n  try{audio();}catch(_e){}"
RELOAD_NEW = ("  G.ammo[w]+=take; G.spare-=take;\n  try{audio();}catch(_e){}\n"
              "  /* SFX-09: THE MAG SEATS (8/20). The beat where you cannot\n"
              "     shoot, and the player has to HEAR it. Silent until he\n"
              "     approves a candidate for it. */\n"
              "  try{sfxAsk('mag_home');}catch(_e){}")


def patch_combat(s):
    m = re.search(r"const COMBAT_B64='([A-Za-z0-9+/=]+)'", s)
    if not m:
        print('FAIL: the combat module is not in the alpha')
        return s, False
    demo = base64.b64decode(m.group(1)).decode('utf8')
    if "sfxAsk('mag_home')" in demo:
        return s, None
    if demo.count(RELOAD_OLD) != 1:
        print('FAIL: doReload is not the shape this patch knows (%d matches)'
              % demo.count(RELOAD_OLD))
        return s, False
    demo = demo.replace(RELOAD_OLD, RELOAD_NEW, 1)
    b64 = base64.b64encode(demo.encode('utf8')).decode('ascii')
    return s[:m.start(1)] + b64 + s[m.end(1):], True


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if "playSFX('gone_quiet')" not in s:
        if OLD_CLEAR not in s:
            print('FAIL: the fight-over wire is not where this patch expects it')
            return 1
        s = s.replace(OLD_CLEAR, NEW_CLEAR, 1)
        changed.append('gone_quiet -> the end of a fight')

    if "playSFX('hands_pass')" not in s:
        if OLD_MONEY not in s:
            print('FAIL: the money wire is not where this patch expects it')
            return 1
        s = s.replace(OLD_MONEY, NEW_MONEY, 1)
        changed.append('hands_pass -> a purse credit')

    if OLD_AMB in s:
        s = s.replace(OLD_AMB, NEW_AMB, 1)
        changed.append('dog_calls and sign_alive -> the ambience rotation')

    s, did = patch_combat(s)
    if did is False:
        return 1
    if did:
        changed.append('mag_home -> doReload() in the combat module')

    if changed:
        open(ALPHA, 'w', encoding='utf8').write(s)

    # and the tool that OWNS the ambience block, so a rebuild keeps it
    w = open(WIRE_TOOL, encoding='utf8').read()
    if OLD_AMB in w:
        open(WIRE_TOOL, 'w', encoding='utf8').write(w.replace(OLD_AMB, NEW_AMB, 1))
        changed.append('and in %s, which owns that block' % WIRE_TOOL)

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    for c in changed:
        print('  ' + c)
    print('  NOT WIRED, on purpose: lungs_burn. There is no sprint verb in the '
          'run, and wiring OUT OF BREATH to walking would be a lie about what '
          'the sound means. [expires when a sprint verb appears in the run]')
    return 0


if __name__ == '__main__':
    sys.exit(main())
