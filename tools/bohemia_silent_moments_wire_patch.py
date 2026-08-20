#!/usr/bin/env python3
"""
BOHEMIA — THE SILENT MOMENTS GET THEIR WIRES (8/20/26, SOUND lane).

REUSE CHECK: cooks NOTHING. Not one note, not one voice, not one candidate. This
is pure plumbing: it connects moments that already exist to sounds that already
have ids, so the day any of them is approved it plays with no further work.
Banks opened: banks/BOHEMIA_SFX_APPROVED_8_17_26.json, to establish that these
events have no approved sound TODAY -- which is why nothing here can make a
noise yet, and why that is fine.

THE MEASUREMENT THAT CAUSED THIS. Counted every one of the engine's 92 game
moments against the approved bank:

    92 moments | 50 have a sound | 42 make none
      of the 42:  7 are DELIBERATELY DEAD (replaced by a newer id)
                  4 belong to a verb that does not exist yet (already waived)
                 31 ARE REAL, PLAYABLE MOMENTS THAT MAKE NO SOUND

Pairing each moment with its second-round replacement id leaves TWELVE distinct
game moments that are silent. Then the verdict files, counted:

    clear / clear_still      0 UP,  65 DOWN      THE FIGHT IS OVER
    talk_start / turn_to_you 0 UP,  60 DOWN      SOMEBODY TURNS TO YOU
    go_inside / cross_in     0 UP,  60 DOWN      YOU STEP INSIDE
    quest_done / done_ring   0 UP,  60 DOWN      IT IS DONE
    reload / mag_clack       0 UP,  55 DOWN      YOU RELOAD
    breath / breath_out      0 UP,  55 DOWN      OUT OF BREATH
    money / cash_count       0 UP,  55 DOWN      MONEY MOVES
    neon_buzz / neon_hum     0 UP,  55 DOWN      NEON, STILL LIT
    dog_far / dog_cry        0 UP,  55 DOWN      A DOG, FAR OFF
    step_glass / glass_crunch 0 UP, 55 DOWN      FOOTSTEP - BROKEN GLASS
    step_metal / deck_ring   0 UP,  55 DOWN      FOOTSTEP - METAL DECK

Two full rounds each, ten candidates each, and he has never once said yes.

*** AND THEN THE PART THAT IS ACTUALLY MINE TO FIX. *** Not one of them has a
WIRE. Grepped the alpha, the combat module and the city world for a call on any
of those twenty-two ids: nothing, anywhere. So the pipeline for these moments is
broken at BOTH ends -- no approved sound, and no caller if there ever were one.
If Paolo approved a THE FIGHT IS OVER tomorrow it would still be silent, and the
reason would look exactly like a bad sound rather than a missing wire.

THIS PATCH DOES NOT COOK A THIRD ROUND. Two rejections end a feature for the
session; guessing at these again today is the thing STOP PRODUCING is named
after. It fixes the half that needs no thumb: the callers.

A WIRE FOR AN UNAPPROVED EVENT IS A NO-OP, BY DESIGN. The engine's play() is
"unjudged = silent" and the ambience rotation already guards on
`(A.event||[]).length` for exactly this reason. So none of this makes a sound
today, costs nothing today, and cannot be heard until he approves something --
at which point it works immediately.

WHAT IT WIRES, and only what lives in this lane's own files:
  clear        the fight is over -> the combat-end handler in the alpha
  money        a purse CREDIT     -> beside PAYSTING, which already detects it
  dog_far      \  into the rare outdoor ambience rotation, beside the generator
  neon_buzz    /  and the gust that are already there
Left for whoever owns those files, named so nobody has to re-derive it:
  go_inside / cross_in    the city world's interior crossing
  talk_start / turn_to_you the dialogue runtime
  reload / mag_clack      the combat module's reload
  breath / breath_out     needs a stamina signal, which may not exist yet
  step_glass / step_metal the surface reporting in BOHEMIA_STEP

Idempotent: keyed on each wire's own marker.

  python3 tools/bohemia_silent_moments_wire_patch.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_SFX_APPROVED_8_17_26.json'

# ---- 1. THE FIGHT IS OVER -------------------------------------------------
OLD_CLEAR = """      /* the fight is over, so the arrangement comes back down */
      try{ if(window.KILLMUS)KILLMUS.reset(); }catch(_e){}"""
NEW_CLEAR = """      /* the fight is over, so the arrangement comes back down */
      try{ if(window.KILLMUS)KILLMUS.reset(); }catch(_e){}
      /* AND THE ROOM GOES QUIET (8/20). `clear` is one of twelve moments with
         no approved sound AND no caller anywhere -- broken at both ends, so an
         approval would still have been silent and would have looked like a bad
         sound. Silent today (unjudged = silent); works the day he says yes.
         Its sibling id is tried too, because both rounds died and either could
         be the one that lives. */
      try{ if(window.playSFX){ playSFX('clear'); playSFX('clear_still'); } }catch(_e){}"""

# ---- 2. MONEY MOVES -------------------------------------------------------
OLD_MONEY = """        if(fresh[i]&&fresh[i].kind==='source'&&fresh[i].amount>0){
          if(window.STING)STING.play('paid');
          return;                                   /* one payday is ONE sound */
        }"""
NEW_MONEY = """        if(fresh[i]&&fresh[i].kind==='source'&&fresh[i].amount>0){
          if(window.STING)STING.play('paid');
          /* AND THE MONEY ITSELF (8/20). The sting is the feeling; `money` is
             the sound of the thing happening, and it is one of the twelve
             moments that had no caller at all. Silent until approved. */
          try{ if(window.playSFX){ playSFX('money'); playSFX('cash_count'); } }catch(e2){}
          return;                                   /* one payday is ONE sound */
        }"""

# ---- 3. THE RARE OUTDOOR THINGS ------------------------------------------
# The rotation already guards on the event being approved, which is why adding
# to it is free: an unapproved name is skipped and the bed plays instead.
OLD_AMB = """      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';
      return this.kind;"""
NEW_AMB = """      if(r<0.125 && (A.generator||[]).length) return 'generator';
      if(r<0.375 && (A.wind_gust||[]).length) return 'wind_gust';
      /* A DOG AND THE NEON (8/20). Both are written for exactly this slot --
         his own briefs say "far off" and "the 12% that has power" -- and both
         are among the twelve moments that had no caller anywhere in the build.
         The guard is the same one the two above use: an unapproved name is
         skipped and the bed plays, so this costs nothing until he says yes.
         RARER THAN THE WEATHER, in that order: a lit sign is a place, and a dog
         is the only other living thing you can hear, so it is the rarest of the
         four on purpose. */
      if(r<0.44 && (A.neon_buzz||[]).length) return 'neon_buzz';
      if(r<0.44 && (A.neon_hum||[]).length) return 'neon_hum';
      if(r<0.50 && (A.dog_far||[]).length) return 'dog_far';
      if(r<0.50 && (A.dog_cry||[]).length) return 'dog_cry';
      return this.kind;"""

WIRE = 'tools/bohemia_sfx_wire_patch.py'


def main():
    bank = json.load(open(BANK, encoding='utf8'))
    live = [e for e in ('clear', 'clear_still', 'money', 'cash_count',
                        'dog_far', 'dog_cry', 'neon_buzz', 'neon_hum') if bank.get(e)]
    if live:
        print('  NOTE these now HAVE approved sounds and will really play: %s'
              % ', '.join(live))
    else:
        print('  none of these are approved yet, so every wire below is a no-op '
              'until he says yes. That is the point.')

    changed = []

    # the alpha
    s = open(ALPHA, encoding='utf8').read()
    if "playSFX('clear')" not in s:
        if OLD_CLEAR not in s:
            print('FAIL: the combat-end handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_CLEAR, NEW_CLEAR, 1)
        changed.append('THE FIGHT IS OVER is wired to the end of a fight')
    if "playSFX('money')" not in s:
        if OLD_MONEY not in s:
            print('FAIL: PAYSTING is not the shape this patch knows')
            return 1
        s = s.replace(OLD_MONEY, NEW_MONEY, 1)
        changed.append('MONEY MOVES is wired to a purse credit')
    if OLD_AMB in s:
        s = s.replace(OLD_AMB, NEW_AMB, 1)
        changed.append('A DOG and THE NEON joined the ambience rotation (alpha)')
    if changed:
        open(ALPHA, 'w', encoding='utf8').write(s)

    # and the tool that OWNS the ambience block, so a rebuild keeps it
    w = open(WIRE, encoding='utf8').read()
    if OLD_AMB in w:
        w = w.replace(OLD_AMB, NEW_AMB, 1)
        open(WIRE, 'w', encoding='utf8').write(w)
        changed.append('and in %s, which owns that block' % WIRE)

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())
